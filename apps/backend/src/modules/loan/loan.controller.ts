import { Response } from "express";
import { LoanService } from "./loan.service";
import { EditLoanDto } from "./dto/edit-loan.dto";
import { GetLoansDto } from "./dto/get-loans.dto";
import { NotFoundException } from "@nestjs/common";
import { CreateLoanDto } from "./dto/create-loan.dto";
import { VerifyLoanDto } from "./dto/verify-loan.dto";
import { JwtAuthGuard } from "../accounts/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "../accounts/guards/roles.guard";
import { Roles, All } from "../accounts/decorators/roles.decorator";
import { Public } from "../accounts/public.decorator";
import { EditVerificationDto } from "./dto/edit-verification.dto";
import { UpdateAssignmentDto } from "./dto/update-assignment.dto";
import { createAssignmentDto } from "./dto/assign-loan-executive";
import { AuthenticatedRequest } from "../common/types/request.types";
import { DeleteVerificationDto } from "./dto/delete-verification.dto";
import { FieldExecutiveAssignedDto } from "./dto/field-executive-assigned.dto";
import { CreateVerificationRetryDto } from "./dto/create-verification-retry.dto";
import { UpdateVerificationStatusDto } from "./dto/update-verification-status.dto";
import { CreateFinancialAnalysisDto } from "./dto/create-financial-analysis.dto";
import { UpdateFinancialAnalysisDto } from "./dto/update-financial-analysis.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from "@nestjs/swagger";
import {
  VerificationType,
  LoanStatus,
  UserRole,
  VerificationStatus,
  AddressType,
  ApprovedStatus,
  LocationType,
  Department,
} from "@prisma/client";
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
  Patch,
  Res,
  Delete,
} from "@nestjs/common";
import { PDTemplateService } from "./templates/pd-templates.service";
import { formSchema, BANK_NAMES } from "./forms-schema";

@ApiTags("loans")
@Controller("loans")
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoanController {
  constructor(
    private loanService: LoanService,
    private pdTemplateService: PDTemplateService
  ) {}

  /*
      The below API's are used by only Operations Executive . His tasks include: Create Loan, Edit Loan, Assign Field Executive
  */

  @Get()
  @Roles(All)
  @ApiOperation({ summary: "Get all loans with filters" })
  @ApiResponse({
    status: 200,
    description: "Loans fetched successfully",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: { type: "string", example: "Loans fetched successfully" },
        data: {
          type: "object",
          properties: {
            items: { type: "array", items: { type: "object" } },
            total: { type: "number" },
            page: { type: "number" },
            limit: { type: "number" },
            totalPages: { type: "number" },
          },
        },
      },
    },
  })
  async getLoans(
    @Query() filters: GetLoansDto,
    @Request() req: AuthenticatedRequest
  ) {
    // Get the role for the specific department from the user's department roles

    if (!req.user.officeId) {
      throw new BadRequestException("User does not have an assigned office");
    }

    const result = await this.loanService.getLoans(req.user.officeId, filters);
    return {
      status: 200,
      message: "Loans fetched successfully",
      data: result,
    };
  }

  @Post()
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({
    summary: "Operations Executive will Create one or multiple loans",
  })
  @ApiResponse({
    status: 201,
    description: "The loans have been successfully created",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 201 },
        message: { type: "string", example: "Loans created successfully" },
        data: {
          type: "object",
          properties: {
            successful: { type: "array", items: { type: "object" } },
            failed: { type: "array", items: { type: "object" } },
            totalProcessed: { type: "number" },
            successfulCount: { type: "number" },
            failedCount: { type: "number" },
          },
        },
      },
    },
  })
  async createLoan(
    @Body() createLoanDtos: CreateLoanDto[],
    @Request() req: AuthenticatedRequest,
    @Query("department") department: Department
  ) {
    if (!req.user.officeId) {
      throw new BadRequestException("User does not have an assigned office");
    }

    const result = await this.loanService.createLoans(
      createLoanDtos,
      req.user.officeId,
      department
    );
    return {
      status: 201,
      message: "Loans created successfully",
      data: result,
    };
  }

  @Post("qa-test-loan")
  @Public()
  @ApiOperation({
    summary: "Create a QA test loan for mobile app testing",
    description:
      "Creates a test loan and verification for QA purposes. Only for development/testing.",
  })
  @ApiResponse({
    status: 201,
    description: "QA test loan created successfully",
  })
  async createQATestLoan(
    @Body("bankName") bankName: string,
    @Body("fieldExecutiveId") fieldExecutiveId: number,
    @Body("qaData") qaData?: any
  ) {
    const result = await this.loanService.createQALoan(
      bankName,
      fieldExecutiveId,
      qaData
    );
    return {
      status: 201,
      message: "QA test loan created successfully",
      data: result,
    };
  }

  @Post(":id/assign-loan-executive")
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({
    summary:
      "Operations Executive will Assign a field executive to a loan verification",
  })
  @ApiResponse({
    status: 200,
    description: "The verification has been successfully assigned",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Verification assigned successfully",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            loanId: { type: "number" },
            type: { type: "string", enum: Object.values(VerificationType) },
            fieldExecutiveId: { type: "number" },
            status: { type: "string" },
          },
        },
      },
    },
  })
  async assignLoan(
    @Param("id") loanId: string,
    @Body() createAssignmentDto: createAssignmentDto
  ) {
    const result = await this.loanService.assignVerification(
      Number(loanId),
      createAssignmentDto
    );
    return {
      status: 200,
      message: "Verification assigned successfully",
      data: result,
    };
  }

  @Post(":id/reassign")
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({
    summary:
      "Reassign a loan by cloning it and incrementing reassignCount by 1",
  })
  @ApiResponse({
    status: 201,
    description: "Loan reassigned successfully by cloning with verifications",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 201 },
        message: { type: "string", example: "Loan reassigned successfully" },
        data: { type: "object" },
      },
    },
  })
  async reassignLoan(
    @Param("id") loanId: string,
    @Query("department") department: Department
  ) {
    if (department != Department.PD) {
      throw new BadRequestException("Invalid department");
    }
    const result = await this.loanService.reassignLoan(
      Number(loanId),
      department
    );
    return {
      status: 201,
      message: "Loan reassigned successfully",
      data: result,
    };
  }

  @Patch(":id/update-executive")
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: "Patch API to edit loan verification assignment" })
  @ApiResponse({
    status: 200,
    description:
      "The loan verification assignment has been successfully updated",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Verification assignment updated successfully",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            loanId: { type: "number" },
            type: { type: "string", enum: Object.values(VerificationType) },
            fieldExecutiveId: { type: "number" },
            status: { type: "string" },
          },
        },
      },
    },
  })
  async updateAssignment(
    @Param("id") loanId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto
  ) {
    const result = await this.loanService.updateVerificationAssignment(
      Number(loanId),
      updateAssignmentDto
    );
    return {
      status: 200,
      message: "Verification assignment updated successfully",
      data: result,
    };
  }

  @Patch(":id")
  @Roles(UserRole.OperationsExecutive)
  @ApiOperation({ summary: "Patch API to Edit loan details" })
  @ApiResponse({
    status: 200,
    description: "The loan has been successfully updated",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: { type: "string", example: "Loan updated successfully" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            applicantName: { type: "string" },
            applicantMobile: { type: "string" },
            applicantAddress: { type: "string" },
            loanType: { type: "string" },
            bankName: { type: "string" },
            loanAmount: { type: "number" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  async editLoan(
    @Param("id") loanId: string,
    @Body() editLoanDto: EditLoanDto
  ) {
    const result = await this.loanService.editLoan(Number(loanId), editLoanDto);
    return {
      status: 200,
      message: "Loan updated successfully",
      data: result,
    };
  }

  /*
      The below API's are used by only Verifier. His tasks include: Approve or Reject Loan, Edit Verification Data, Generate Final Report
  */

  @Get("get-verifier-loans")
  @Roles(UserRole.Admin, UserRole.Verifier, UserRole.FieldExecutive)
  @ApiOperation({ summary: "Get loans assigned to verifier" })
  @ApiResponse({
    status: 200,
    description:
      "Returns a list of loans assigned to the same verifier calling this API",
  })
  async getLoansByVerifier(
    @Request() req: AuthenticatedRequest,
    @Query("department") department: string
  ) {
    const result = await this.loanService.getLoansByVerifier(
      req.user.id,
      department as Department,
      req.user.role
    );
    return {
      status: 200,
      message: "Verifier loans fetched successfully",
      data: result,
    };
  }

  @Get(":id/preview-final-report")
  @Roles(All) // Allow all roles including field executives for QA testing
  @ApiOperation({ summary: "Generate PDF Preview for loan details" })
  @ApiResponse({ status: 200, description: "PDF generated successfully" })
  @ApiResponse({ status: 404, description: "Loan not found" })
  async generatePDFPreview(
    @Param("id") id: string,
    @Query("type") type: AddressType,
    @Query("department") department: Department,
    @Res() res: Response
  ) {
    try {
      let pdfBuffer = null;

      if (department === Department.FI) {
        pdfBuffer = await this.loanService.generateVerificationPDF(
          Number(id),
          type
        );
      } else if (department === Department.PD) {
        console.log("Preview PD Verification PDF");
        pdfBuffer = await this.pdTemplateService.previewPDVerificationPDF(
          Number(id)
        );
      }

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=loan-${id}-${type || "all"}.pdf`,
        "Content-Length": pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Failed to generate PDF", error: error.message });
      }
    }
  }

  @Get(":id/generate-final-report")
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({
    summary:
      "Generate Final Report PDF for loan details without further improvements",
  })
  @ApiResponse({ status: 200, description: "PDF generated successfully" })
  @ApiResponse({ status: 404, description: "Loan not found" })
  async generateFinalReportPDF(
    @Param("id") id: string,
    @Query("type") type: AddressType,
    @Res() res: Response
  ) {
    try {
      let pdfUrl = await this.loanService.generateFinalReportPDF(
        Number(id),
        type
      );

      if (pdfUrl) {
        res.status(200).json({ downloadUrl: pdfUrl });
      } else {
        res
          .status(404)
          .json({ message: "Error while generating Final report" });
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Failed to generate PDF", error: error.message });
      }
    }
  }

  @Get(":id/verification-data")
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({ summary: "Get verification data for a loan" })
  @ApiResponse({
    status: 200,
    description: "Returns verification data for the specified loan",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Verification data retrieved successfully",
        },
        data: {
          type: "object",
          properties: {
            loanId: { type: "number" },
            applicationNumber: { type: "string" },
            applicantName: { type: "string" },
            verifications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  type: {
                    type: "string",
                    enum: Object.values(VerificationType),
                  },
                  status: {
                    type: "string",
                    enum: Object.values(VerificationStatus),
                  },
                  verificationData: { type: "object" },
                  path: { type: "string", nullable: true },
                  fieldExecutive: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                      mobile: { type: "string" },
                    },
                  },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                },
              },
            },
            verificationReport: {
              type: "object",
              properties: {
                id: { type: "number" },
                remarks: { type: "string" },
                verificationDate: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
  })
  async getVerificationData(
    @Param("id") loanId: string,
    @Query("department") department: Department
  ) {
    const result = await this.loanService.getVerificationData(
      Number(loanId),
      department
    );
    return {
      status: 200,
      data: result,
    };
  }

  @Post(":id/verify")
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({
    summary: "Verifier will approve or reject a loan and add comments",
  })
  @ApiResponse({
    status: 200,
    description: "The loan has been successfully verified",
  })
  async verifyLoan(
    @Param("id") loanId: string,
    @Body() verifyLoanDto: VerifyLoanDto,
    @Request() req: AuthenticatedRequest
  ) {
    const result = await this.loanService.verifyLoan(
      Number(loanId),
      req.user.id,
      verifyLoanDto.status,
      verifyLoanDto.approvedStatus,
      verifyLoanDto.comments
    );
    return {
      status: 200,
      message: "Loan verified successfully",
      data: result,
    };
  }

  @Patch(":id/verification/:type")
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({ summary: "Edit verification data" })
  @ApiResponse({
    status: 200,
    description: "The verification data has been successfully updated",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Verification data updated successfully",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            loanId: { type: "number" },
            type: { type: "string", enum: Object.values(VerificationType) },
            findings: { type: "string" },
            verificationData: { type: "object" },
            path: { type: "string", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  async editVerificationData(
    @Param("id") loanId: string,
    @Param("type") verificationType: VerificationType,
    @Body() editVerificationDto: EditVerificationDto
  ) {
    const result = await this.loanService.editVerificationData(
      Number(loanId),
      verificationType,
      editVerificationDto
    );
    return {
      status: 200,
      message: "Verification data updated successfully",
      data: result,
    };
  }

  @Patch(":id/verification/:type/approve")
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({
    summary:
      "Approve or change status and path for a verification (Admin/Verifier only)",
  })
  @ApiResponse({
    status: 200,
    description: "The verification approval status and path have been updated",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Verification approval updated successfully",
        },
        data: { type: "object" },
      },
    },
  })
  async updateVerificationApproval(
    @Param("id") loanId: string,
    @Param("type") verificationType: VerificationType,
    @Body() body: { status: ApprovedStatus; path?: string }
  ) {
    const approvedStatus = body.status;
    const result = await this.loanService.updateVerificationApproval(
      Number(loanId),
      verificationType,
      approvedStatus,
      body.path
    );
    return {
      status: 200,
      message: "Verification approval updated successfully",
      data: result,
    };
  }

  @Patch("verification/:id/financial-analysis")
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({
    summary: "Update financial analysis data for a verification",
  })
  @ApiResponse({
    status: 200,
    description: "Financial analysis updated successfully",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Financial analysis updated successfully",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            loanId: { type: "number" },
            type: { type: "string", enum: Object.values(VerificationType) },
            financialAnalysis: { type: "object" },
            synopsis: { type: "string" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid data provided",
  })
  @ApiResponse({
    status: 404,
    description: "Verification not found",
  })
  async updateFinancialAnalysis(
    @Param("id") loanId: string,
    @Body() updateFinancialAnalysisDto: UpdateFinancialAnalysisDto
  ) {
    const { synopsis, ...financialAnalysisData } = updateFinancialAnalysisDto;
    const result = await this.loanService.updateFinancialAnalysis(
      Number(loanId),
      financialAnalysisData,
      synopsis
    );
    return {
      status: 200,
      message: "Financial analysis updated successfully",
      data: result,
    };
  }

  /*
      The below API's are used by only Field Executive. His tasks include: Edit Verification Report, Submit Verification Data and Upload Proofs
  */

  @Get("get-field-executive-loans")
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: "Get loans assigned to field executive" })
  @ApiResponse({
    status: 200,
    description:
      "Returns a list of loans assigned to the same field executive calling this API",
  })
  async getLoansByFieldExecutive(
    @Request() req: AuthenticatedRequest,
    @Query("department") department: string
  ) {
    const result = await this.loanService.getLoansByFieldExecutive(
      req.user.id,
      department as Department
    );
    return {
      status: 200,
      message: "Field executive loans fetched successfully",
      data: result,
    };
  }

  @Get("field-executive/assigned")
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({
    summary:
      "Get all loans assigned to field executive with verification details",
  })
  @ApiResponse({
    status: 200,
    description:
      "Returns a paginated list of loans assigned to the field executive with verification details",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        isAvailableToday: { type: "boolean", example: false },
        message: {
          type: "string",
          example: "Assigned loans fetched successfully",
        },
        data: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  loan: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      applicationNumber: { type: "string" },
                      applicationMobile: { type: "string" },
                      applicantName: { type: "string" },
                      loanAmount: { type: "number" },
                      status: {
                        type: "string",
                        enum: Object.values(LoanStatus),
                      },
                      bankName: { type: "string" },
                      loanType: { type: "string" },
                    },
                  },
                  type: {
                    type: "string",
                    enum: Object.values(VerificationType),
                  },
                  status: { type: "string" },
                  findings: { type: "string" },
                  documents: { type: "array", items: { type: "string" } },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                },
              },
            },
            meta: {
              type: "object",
              properties: {
                total: { type: "number" },
                page: { type: "number" },
                limit: { type: "number" },
                totalPages: { type: "number" },
              },
            },
          },
        },
      },
    },
  })
  async getAssignedLoansWithVerifications(
    @Request() req: AuthenticatedRequest,
    @Query() filters: FieldExecutiveAssignedDto
  ) {
    const result = await this.loanService.getAssignedLoansWithVerifications(
      req.user.id,
      filters
    );
    return {
      status: 200,
      isAvailableToday: result.isAvailableToday,
      message: "Assigned loans fetched successfully",
      data: result.data,
    };
  }

  @Patch(":id/submit-verification-report")
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: "Edit verification report" })
  @ApiResponse({
    status: 200,
    description: "The verification report has been successfully updated",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Verification report updated successfully",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            loanId: { type: "number" },
            type: { type: "string", enum: Object.values(VerificationType) },
            fieldExecutiveId: { type: "number" },
            findings: { type: "string" },
            verificationData: { type: "object" },
            path: { type: "string", nullable: true },
            status: { type: "string" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  async editVerificationReport(
    @Param("id") loanId: string,
    @Body()
    body: {
      verificationType: VerificationType;
      addressType: AddressType;
      findings: string;
      verificationData?: any;
    },
    @Request() req: AuthenticatedRequest
  ) {
    const result = await this.loanService.editVerificationReport(
      Number(loanId),
      body.verificationType,
      req.user.id,
      body.findings,
      body.verificationData,
      body.addressType
    );
    return {
      status: 200,
      message: "Verification report updated successfully",
      data: result,
    };
  }

  @Patch(":id/verification/status")
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: "Update verification status" })
  @ApiResponse({
    status: 200,
    description: "The verification status has been successfully updated",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Verification status updated successfully",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            loanId: { type: "number" },
            type: { type: "string", enum: Object.values(VerificationType) },
            fieldExecutiveId: { type: "number" },
            status: { type: "string", enum: Object.values(VerificationStatus) },
          },
        },
      },
    },
  })
  async updateVerificationStatus(
    @Param("id") loanId: string,
    @Body() updateStatusDto: UpdateVerificationStatusDto,
    @Request() req: AuthenticatedRequest
  ) {
    const result = await this.loanService.updateVerificationStatus(
      Number(loanId),
      updateStatusDto.type,
      req.user.id,
      updateStatusDto.status
    );
    return {
      status: 200,
      message: "Verification status updated successfully",
      data: result,
    };
  }

  @Delete(":id/verification/:type")
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({
    summary: "Delete verification assigned to a field executive",
  })
  @ApiBody({
    type: DeleteVerificationDto,
    description: "Field executive ID to identify the verification to delete",
  })
  @ApiResponse({
    status: 200,
    description: "The verification has been successfully deleted",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Verification deleted successfully",
        },
        data: {
          type: "object",
          properties: {
            message: { type: "string" },
            deletedVerification: {
              type: "object",
              properties: {
                id: { type: "number" },
                loanId: { type: "number" },
                type: { type: "string", enum: Object.values(VerificationType) },
                fieldExecutiveId: { type: "number" },
                status: {
                  type: "string",
                  enum: Object.values(VerificationStatus),
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Cannot delete a completed verification",
  })
  @ApiResponse({
    status: 404,
    description:
      "Verification not found or not assigned to this field executive",
  })
  async deleteVerification(
    @Param("id") loanId: string,
    @Param("type") verificationType: VerificationType,
    @Body() deleteVerificationDto: DeleteVerificationDto
  ) {
    const result = await this.loanService.deleteVerification(
      Number(loanId),
      verificationType,
      deleteVerificationDto.fieldExecutiveId
    );
    return {
      status: 200,
      message: "Verification deleted successfully",
      data: result,
    };
  }

  @Post("verification-retry")
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: "Create a verification retry record" })
  @ApiResponse({
    status: 201,
    description: "Verification retry created successfully",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 201 },
        message: {
          type: "string",
          example: "Verification retry created successfully",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            verificationId: { type: "number" },
            date: { type: "string", format: "date-time" },
            geotag: { type: "string", nullable: true },
            address: { type: "string", nullable: true },
            reason: { type: "string", nullable: true },
            fieldExecutiveId: { type: "number" },
            verification: {
              type: "object",
              properties: {
                id: { type: "number" },
                type: { type: "string" },
                status: { type: "string" },
                loan: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    applicationNumber: { type: "string" },
                    applicantName: { type: "string" },
                  },
                },
              },
            },
            fieldExecutive: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
                mobile: { type: "string" },
                employeeCode: { type: "string" },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid data provided",
  })
  @ApiResponse({
    status: 404,
    description: "Verification or field executive not found",
  })
  async createVerificationRetry(
    @Body() createVerificationRetryDto: CreateVerificationRetryDto,
    @Request() req: AuthenticatedRequest
  ) {
    // If the user is a field executive, ensure they can only create retries for themselves
    if (req.user.role === UserRole.FieldExecutive) {
      createVerificationRetryDto.fieldExecutiveId = req.user.id;
    }

    const result = await this.loanService.createVerificationRetry(
      createVerificationRetryDto
    );
    return {
      status: 201,
      message: "Verification retry created successfully",
      data: result,
    };
  }

  @Post("verification/:id/financial-analysis")
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({
    summary: "Create financial analysis data for a verification",
  })
  @ApiResponse({
    status: 201,
    description: "Financial analysis created successfully",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 201 },
        message: {
          type: "string",
          example: "Financial analysis created successfully",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            loanId: { type: "number" },
            type: { type: "string", enum: Object.values(VerificationType) },
            financialAnalysis: { type: "object" },
            synopsis: { type: "string" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid data provided",
  })
  @ApiResponse({
    status: 404,
    description: "Verification not found",
  })
  async createFinancialAnalysis(
    @Param("id") loanId: string,
    @Body() createFinancialAnalysisDto: CreateFinancialAnalysisDto
  ) {
    const { synopsis, ...financialAnalysisData } = createFinancialAnalysisDto;
    const result = await this.loanService.createFinancialAnalysis(
      Number(loanId),
      financialAnalysisData,
      synopsis
    );
    return {
      status: 201,
      message: "Financial analysis created successfully",
      data: result,
    };
  }

  @Delete(":id")
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: "Delete a loan and all related entities (cascade)" })
  @ApiResponse({
    status: 200,
    description:
      "The loan and all related entities have been successfully deleted",
    schema: {
      type: "object",
      properties: {
        status: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "Loan and all related entities deleted",
        },
        data: { type: "object" },
      },
    },
  })
  async deleteLoan(@Param("id") loanId: string) {
    const result = await this.loanService.deleteLoan(Number(loanId));
    return {
      status: 200,
      message: "Loan and all related entities deleted",
      data: result,
    };
  }

  @Get("banks")
  @Roles(All)
  @ApiOperation({ summary: "Get list of supported bank names" })
  @ApiResponse({ status: 200, description: "Bank names fetched successfully" })
  async getBanks() {
    return {
      status: 200,
      message: "Bank names fetched successfully",
      data: BANK_NAMES,
    };
  }

  @Get("get-bank-forms")
  @Roles(All)
  @ApiOperation({ summary: "Get bank forms schema with metadata" })
  @ApiResponse({ status: 200, description: "Bank forms fetched successfully" })
  async getBankForms(
    @Query("bankName") bankName: string,
    @Query("type") type: string
  ) {
    // Optional legacy support for type=banks
    if (type === "banks") {
      return {
        status: 200,
        message: "Bank forms fetched successfully",
        data: BANK_NAMES,
      };
    }
    if (
      !bankName ||
      !Object.prototype.hasOwnProperty.call(formSchema, bankName)
    ) {
      return {
        status: 400,
        message: "Invalid or unsupported bank name",
        data: null,
      };
    }

    const schema = formSchema[bankName];

    // Add metadata for verifier fields and template mapping
    const result = {
      bankName: bankName,
      schema: schema,
      metadata: {
        // Fields that verifiers can add/edit (common across all banks)
        verifierFields: [
          "financialAnalysis",
          "synopsis",
          "path",
          "approvedStatus",
          "comments",
        ],
        // Template information for PDF generation
        hasCustomTemplate: ["RBL"].includes(bankName),
        // Section IDs for mapping (extracted from schema)
        sectionIds: schema.sections?.map((s: any) => s.id) || [],
      },
    };

    return {
      status: 200,
      message: "Bank forms fetched successfully",
      data: result,
    };
  }
}
