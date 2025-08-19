import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EditRequestStatus, EditRequestType, Prisma } from '@prisma/client';
import { CreateEditRequestDto } from './dto/create-edit-request.dto';
import { UpdateEditRequestDto } from './dto/update-edit-request.dto';
import { LoggingService } from '../common/logging/logging.service';
import { S3Service } from '../common/s3utils/s3.service';

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
    // private s3Service: S3Service,
  ) {}

  async createEditRequest(userId: number, createEditRequestDto: CreateEditRequestDto) {
    try {
      // If type is LoanData, verify the verification exists
      if (createEditRequestDto.type === EditRequestType.LoanData) {
        if (!createEditRequestDto.verificationId) {
          throw new NotFoundException('Verification Id is required for LoanData edit requests');
        }

        const verification = await this.prisma.verification.findFirst({
          where: {
            id: Number(createEditRequestDto.verificationId),
          },
        });
        
        if (!verification) {
          throw new NotFoundException('Verification not found or does not belong to this loan');
        }
      }

      // If type is Login, verify the user exists
      if (createEditRequestDto.type === EditRequestType.Login) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId }
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }
      }
            
      // Create edit request
      const editRequest = await this.prisma.editRequest.create({
        data: {
          loan: {
            connect: { id: Number(createEditRequestDto.loanId) }
          },
          ...(createEditRequestDto.verificationId && {
            verification: {
              connect: { id: Number(createEditRequestDto.verificationId) }
            }
          }),
          requester: {
            connect: { id: userId }
          },
          status: EditRequestStatus.Pending,
          changes: createEditRequestDto.changes,
          remarks: createEditRequestDto.remarks,
          type: createEditRequestDto.type || EditRequestType.LoanData, // Default to LoanData if not specified
        },
        include: {
          loan: true,
          requester: true,
          verification: true,
        },
      });

      await this.loggingService.info('Edit request created successfully', {
        editRequestId: editRequest.id,
        loanId: editRequest.loanId,
        verificationId: editRequest.verificationId,
        type: editRequest.type,
        requestedBy: userId,
      });

      return editRequest;
    } catch (error) {
      await this.loggingService.error('Failed to create edit request', {
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
    updateEditRequestDto: UpdateEditRequestDto,
  ) {
    try {
      const editRequest = await this.prisma.editRequest.findUnique({
        where: { id: editRequestId },
        include: { 
          loan: true,
          verification: true 
        },
      });

      if (!editRequest) {
        throw new NotFoundException('Edit request not found');
      }

      if (editRequest.status !== EditRequestStatus.Pending) {
        throw new BadRequestException('Edit request is not in pending status');
      }

      // If status is approved, update the data based on type
      if (updateEditRequestDto.status === EditRequestStatus.Approved) {
        if (editRequest.type === EditRequestType.LoanData) {
          if (!editRequest.verification) {
            throw new BadRequestException('No verification associated with this edit request');
          }

          // Get current verification data and ensure it's an object
          const currentVerificationData = editRequest.verification.verificationData as Record<string, any>;
          
          // Apply the changes to the verification data
          const updatedVerificationData = {
            ...currentVerificationData,
            ...(editRequest.changes as Record<string, any>),
          };

          // Update the verification record
          await this.prisma.verification.update({
            where: { id: editRequest.verification.id },
            data: {
              verificationData: updatedVerificationData,
            },
          });
        } else if (editRequest.type === EditRequestType.Login) {
          // Update user data
          const user = await this.prisma.user.findUnique({
            where: { id: editRequest.requestedBy }
          });

          if (!user) {
            throw new NotFoundException('User not found');
          }
          const requestedData = await this.prisma.editRequest.findUnique({
            where: { id: editRequestId },
            select: {
              changes: true
            }
          });
          console.log(requestedData);
          
          const changes = requestedData?.changes as unknown as changeData;

          // Update the user record
          await this.prisma.user.update({ 
            where: { id: user.id },
            data: {
              deviceId: changes.newDeviceId
            },
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

      await this.loggingService.info('Edit request updated successfully', {
        editRequestId,
        loanId: editRequest.loanId,
        verificationId: editRequest.verificationId,
        type: editRequest.type,
        status: updateEditRequestDto.status,
        approvedBy: userId,
      });

      return updatedEditRequest;
    } catch (error) {
      await this.loggingService.error('Failed to update edit request', {
        editRequestId,
        userId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getEditRequests(filters?: { status?: EditRequestStatus; loanId?: number; type?: EditRequestType }) {
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
          createdAt: 'desc',
        },
      });

      await this.loggingService.debug('Retrieved edit requests', {
        filters,
        count: editRequests.length,
      });

      return editRequests;
    } catch (error) {
      await this.loggingService.error('Failed to get edit requests', {
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
        throw new NotFoundException('Edit request not found');
      }

      return editRequest;
    } catch (error) {
      await this.loggingService.error('Failed to get edit request by ID', {
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
        throw new NotFoundException('Loan not found');
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

      throw new NotFoundException('Image not found in any verification');
    } catch (error) {
      await this.loggingService.error('Failed to get image coordinates', {
        s3ImageUrl,
        id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
} 