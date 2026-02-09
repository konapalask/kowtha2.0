import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { EditRequestStatus, EditRequestType, Prisma } from "@prisma/client";
import { CreateEditRequestDto } from "./dto/create-edit-request.dto";
import { UpdateEditRequestDto } from "./dto/update-edit-request.dto";
import { LoggingService } from "../common/logging/logging.service";
import { S3Service } from "../common/s3utils/s3.service";
import {
  ArrayValidationService,
  ArrayItemWithId,
} from "../loan/services/array-validation.service";

interface changeData {
  oldDeviceId: string;
  newDeviceId: string;
  userName: string;
  mobile: string;
  employeeCode: string;
  role: string;
  officeId?: number;
}

interface LoginRequestData {
  changes?: changeData;
}
@Injectable()
export class EditRequestService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
    private arrayValidationService: ArrayValidationService
    // private s3Service: S3Service,
  ) {}

  async createEditRequest(
    userId: number,
    createEditRequestDto: CreateEditRequestDto
  ) {
    try {
      let arrayChangesMetadata: any = null;

      // If type is LoanData, verify the verification exists and validate array changes
      if (createEditRequestDto.type === EditRequestType.LoanData) {
        if (!createEditRequestDto.verificationId) {
          throw new NotFoundException(
            "Verification Id is required for LoanData edit requests"
          );
        }

        const verification = await this.prisma.verification.findFirst({
          where: {
            id: Number(createEditRequestDto.verificationId),
          },
        });

        if (!verification) {
          throw new NotFoundException(
            "Verification not found or does not belong to this loan"
          );
        }

        // Validate array changes and generate metadata
        const validationResult =
          this.arrayValidationService.validateVerificationArrays(
            createEditRequestDto.changes
          );

        if (!validationResult.isValid) {
          throw new BadRequestException(
            `Invalid array data: ${validationResult.errors.join(", ")}`
          );
        }

        // Generate array change metadata
        arrayChangesMetadata = this.detectArrayChanges(
          verification.verificationData as Record<string, any>,
          createEditRequestDto.changes as Record<string, any>
        );

        // Fix any missing array IDs
        createEditRequestDto.changes = this.arrayValidationService.fixArrayData(
          createEditRequestDto.changes
        );

        if (validationResult.warnings.length > 0) {
          await this.loggingService.warn("Array validation warnings", {
            verificationId: createEditRequestDto.verificationId,
            warnings: validationResult.warnings,
          });
        }
      }

      // If type is Login, verify the user exists
      if (createEditRequestDto.type === EditRequestType.Login) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new NotFoundException("User not found");
        }
      }

      // Prepare changes data with metadata
      const changesWithMetadata = {
        ...createEditRequestDto.changes,
        ...(arrayChangesMetadata && {
          _arrayChangesMetadata: arrayChangesMetadata,
        }),
      };

      // Create edit request
      const editRequest = await this.prisma.editRequest.create({
        data: {
          loan: {
            connect: { id: Number(createEditRequestDto.loanId) },
          },
          ...(createEditRequestDto.verificationId && {
            verification: {
              connect: { id: Number(createEditRequestDto.verificationId) },
            },
          }),
          requester: {
            connect: { id: userId },
          },
          status: EditRequestStatus.Pending,
          changes: changesWithMetadata,
          remarks: createEditRequestDto.remarks,
          type: createEditRequestDto.type || EditRequestType.LoanData, // Default to LoanData if not specified
        },
        include: {
          loan: true,
          requester: true,
          verification: true,
        },
      });

      await this.loggingService.info("Edit request created successfully", {
        editRequestId: editRequest.id,
        loanId: editRequest.loanId,
        verificationId: editRequest.verificationId,
        type: editRequest.type,
        requestedBy: userId,
      });

      return editRequest;
    } catch (error) {
      await this.loggingService.error("Failed to create edit request", {
        userId,
        verificationId: createEditRequestDto.verificationId,
        type: createEditRequestDto.type,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateEditRequest(
    editRequestId: number,
    userId: number,
    updateEditRequestDto: UpdateEditRequestDto
  ) {
    try {
      const editRequest = await this.prisma.editRequest.findUnique({
        where: { id: editRequestId },
        include: {
          loan: true,
          verification: true,
        },
      });

      if (!editRequest) {
        throw new NotFoundException("Edit request not found");
      }

      if (editRequest.status !== EditRequestStatus.Pending) {
        throw new BadRequestException("Edit request is not in pending status");
      }

      // If status is approved, update the data based on type
      if (updateEditRequestDto.status === EditRequestStatus.Approved) {
        if (editRequest.type === EditRequestType.LoanData) {
          if (!editRequest.verification) {
            throw new BadRequestException(
              "No verification associated with this edit request"
            );
          }

          // Get current verification data and ensure it's an object
          const currentVerificationData = editRequest.verification
            .verificationData as Record<string, any>;

          // Extract changes and metadata
          const changes = editRequest.changes as Record<string, any>;
          const { _arrayChangesMetadata, ...actualChanges } = changes;

          // Validate array changes before applying
          const validationResult =
            this.arrayValidationService.validateVerificationArrays(
              actualChanges
            );

          if (!validationResult.isValid) {
            throw new BadRequestException(
              `Cannot apply changes due to invalid array data: ${validationResult.errors.join(", ")}`
            );
          }

          // Fix any array data issues
          const fixedChanges = this.arrayValidationService.fixArrayData(actualChanges);

          // Apply the changes to the verification data
          const updatedVerificationData = {
            ...currentVerificationData,
            ...fixedChanges,
          };

          if (editRequest.remarks === "Financial_Analysis") {
            updatedVerificationData.financialAnalysis = fixedChanges;
          }

          // Update the verification record
          await this.prisma.verification.update({
            where: { id: editRequest.verification.id },
            data: {
              verificationData: updatedVerificationData,
            },
          });

          // Log array changes if metadata exists
          // if (_arrayChangesMetadata) {
          //   await this.loggingService.info(
          //     "Array changes applied successfully",
          //     {
          //       editRequestId: editRequest.id,
          //       verificationId: editRequest.verification.id,
          //       arrayChanges: _arrayChangesMetadata,
          //     }
          //   );
          // }
        } else if (editRequest.type === EditRequestType.Login) {
          // Update user data
          const user = await this.prisma.user.findUnique({
            where: { id: editRequest.requestedBy },
          });

          if (!user) {
            throw new NotFoundException("User not found");
          }
          const requestedData = await this.prisma.editRequest.findUnique({
            where: { id: editRequestId },
            select: {
              changes: true,
            },
          });

          const changes = requestedData?.changes as unknown as changeData;

          // Update the user record
          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              deviceId: changes.newDeviceId,
            },
          });
        }
        else if (editRequest.type === EditRequestType.FinancialAnalysis) {
          const financialAnalysis = editRequest.changes;
          let oldVerification = await this.prisma.verification.findUnique({
            where: { id: editRequest.verification.id },
          });
          if (!oldVerification) {
            throw new NotFoundException("Verification not found");
          }
          let newVerificationData = oldVerification.verificationData as any;
          newVerificationData.financialAnalysis = financialAnalysis;
          await this.prisma.verification.update({
            where: { id: editRequest.verification.id },
            data: { verificationData: newVerificationData },
          });
        }
      }

      // Update edit request
      const updatedEditRequest = await this.prisma.editRequest.update({
        where: { id: editRequestId },
        data: {
          status: updateEditRequestDto.status,
          approvedBy: userId,
          remarks: updateEditRequestDto.remarks,
        },
        include: {
          loan: true,
          requester: true,
          approver: true,
          verification: true,
        },
      });

      await this.loggingService.info("Edit request updated successfully", {
        editRequestId,
        loanId: editRequest.loanId,
        verificationId: editRequest.verificationId,
        type: editRequest.type,
        status: updateEditRequestDto.status,
        approvedBy: userId,
      });

      return updatedEditRequest;
    } catch (error) {
      await this.loggingService.error("Failed to update edit request", {
        editRequestId,
        userId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getEditRequests(filters?: {
    status?: EditRequestStatus;
    loanId?: number;
    type?: EditRequestType;
  }) {
    try {
      const where: Prisma.EditRequestWhereInput = {};

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.loanId) {
        where.loanId = filters.loanId;
      }

      if (filters?.type) {
        where.type = filters.type;
      }

      const editRequests = await this.prisma.editRequest.findMany({
        where,
        include: {
          loan: true,
          requester: true,
          approver: true,
          verification: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      await this.loggingService.debug("Retrieved edit requests", {
        filters,
        count: editRequests.length,
      });

      return editRequests;
    } catch (error) {
      await this.loggingService.error("Failed to get edit requests", {
        filters,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getEditRequestById(editRequestId: number) {
    try {
      const editRequest = await this.prisma.editRequest.findUnique({
        where: { id: editRequestId },
        include: {
          loan: true,
          requester: true,
          approver: true,
          verification: true,
        },
      });

      if (!editRequest) {
        throw new NotFoundException("Edit request not found");
      }

      return editRequest;
    } catch (error) {
      await this.loggingService.error("Failed to get edit request by ID", {
        editRequestId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getImageCoordinates(s3ImageUrl: string, id: string) {
    try {
      // Find the loan by application number
      const loan = await this.prisma.loan.findUnique({
        where: { id: Number(id) },
        include: { verifications: { select: { verificationData: true } } },
      });

      if (!loan) {
        throw new NotFoundException("Loan not found");
      }

      // Search through all verifications for the image
      for (const verification of loan.verifications) {
        const verificationData = verification.verificationData as any;
        if (verificationData?.uploadedItems) {
          const image = verificationData.uploadedItems.find(
            (item: any) => item.s3ImageUrl === s3ImageUrl
          );
          if (image) {
            return {
              latitude: image.latitude,
              longitude: image.longitude,
              timestamp: image.timestamp,
            };
          }
        }
      }

      throw new NotFoundException("Image not found in any verification");
    } catch (error) {
      await this.loggingService.error("Failed to get image coordinates", {
        s3ImageUrl,
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Detect array changes between current and new verification data
   */
  private detectArrayChanges(
    currentData: Record<string, any>,
    newData: Record<string, any>
  ): any {
    const arrayChanges: any = {};

    // Common array fields to check
    const arrayFields = [
      "familyMembers",
      "familyMemberDetails",
      "familyDetails",
      "businessOwnerDetails",
      "shareholdingDetails",
      "employees",
      "suppliers",
      "customers",
      "assets",
      "liabilities",
    ];

    // Check all fields in newData for arrays
    Object.keys(newData).forEach((fieldKey) => {
      const newValue = newData[fieldKey];
      const currentValue = currentData?.[fieldKey];

      // Check if this is an array field or if the value is an array
      if (Array.isArray(newValue) || arrayFields.includes(fieldKey)) {
        const oldArray = Array.isArray(currentValue) ? currentValue : [];
        const newArray = Array.isArray(newValue) ? newValue : [];

        // Detect changes
        const changes = this.arrayValidationService.detectArrayChanges(
          oldArray,
          newArray
        );

        // Only store if there are actual changes
        if (
          changes.added.length > 0 ||
          changes.removed.length > 0 ||
          changes.modified.length > 0 ||
          changes.reordered
        ) {
          arrayChanges[fieldKey] = {
            summary: {
              added: changes.added.length,
              removed: changes.removed.length,
              modified: changes.modified.length,
              reordered: changes.reordered,
            },
            details: changes,
          };
        }
      }
    });

    return Object.keys(arrayChanges).length > 0 ? arrayChanges : null;
  }
}
