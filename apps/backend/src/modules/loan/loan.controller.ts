import { Controller, Post, Get, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, Query, BadRequestException, Patch, Res, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { RolesGuard } from '../accounts/guards/roles.guard';
import { Roles } from '../accounts/decorators/roles.decorator';
import { VerificationType, LoanStatus, UserRole, VerificationStatus, AddressType } from '@prisma/client';
import { AuthenticatedRequest } from '../common/types/request.types';
import { GetLoansDto } from './dto/get-loans.dto';
import { CreateLoanDto } from './dto/create-loan.dto';
import { VerifyLoanDto } from './dto/verify-loan.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { UpdateVerificationStatusDto } from './dto/update-verification-status.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { log } from 'console';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';
import { EditLoanDto } from './dto/edit-loan.dto';
import { EditVerificationDto } from './dto/edit-verification.dto';
import { FieldExecutiveAssignedDto } from './dto/field-executive-assigned.dto';
import { DeleteVerificationDto } from './dto/delete-verification.dto';

@ApiTags('loans')
@Controller('loans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoanController {
  constructor(private loanService: LoanService) {}

  /*
      The below API's are used by only Operations Executive . His tasks include: Create Loan, Edit Loan, Assign Field Executive
  */

  @Get('office/:officeId')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Get loans by office' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of loans for the specified office'
  })
  async getLoansByOffice(@Param('officeId') officeId: number) {
    const result = await this.loanService.getLoansByOffice(officeId);
    return {
      status: 200,
      message: 'Office loans fetched successfully',
      data: result
    };
  }
    
  @Get()
  @Roles(UserRole.Admin, UserRole.OperationsExecutive, UserRole.Verifier)
  @ApiOperation({ summary: 'Get all loans with optional status filter' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a paginated list of loans matching the filter criteria',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Loans fetched successfully' },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  applicationNumber: { type: 'string' },
                  applicantName: { type: 'string' },
                  applicantMobile: { type: 'string' },
                  loanType: { type: 'string' },
                  bankName: { type: 'string' },
                  loanAmount: { type: 'number' },
                  status: { type: 'string', enum: Object.values(LoanStatus) },
                  operationsExecutive: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' },
                      mobile: { type: 'string' },
                      employeeCode: { type: 'string' },
                      role: { type: 'string' }
                    }
                  },
                  verifier: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' },
                      mobile: { type: 'string' },
                      employeeCode: { type: 'string' },
                      role: { type: 'string' }
                    }
                  },
                  verifications: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        type: { type: 'string' },
                        status: { type: 'string' },
                        fieldExecutive: {
                          type: 'object',
                          properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            mobile: { type: 'string' },
                            employeeCode: { type: 'string' },
                            role: { type: 'string' }
                          }
                        }
                      }
                    }
                  },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  async getLoans(@Query() filters: GetLoansDto) {
    const result = await this.loanService.getLoans(filters);
    return {
      status: 200,
      message: 'Loans fetched successfully',
      data: result
    };
  }

  @Post()
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Operations Executive will Create one or multiple loans' })
  @ApiResponse({ 
    status: 201, 
    description: 'The loans have been successfully created',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Loans created successfully' },
        data: {
          type: 'object',
          properties: {
            successful: { type: 'array', items: { type: 'object' } },
            failed: { type: 'array', items: { type: 'object' } },
            totalProcessed: { type: 'number' },
            successfulCount: { type: 'number' },
            failedCount: { type: 'number' }
          }
        }
      }
    }
  })
  async createLoan(@Body() createLoanDtos: CreateLoanDto[], @Request() req: AuthenticatedRequest) {
    const result = await this.loanService.createLoans(createLoanDtos, req.user.officeId);
    return {
      status: 201,
      message: 'Loans created successfully',
      data: result
    };
  }

  @Post('import')
  @Roles(UserRole.OperationsExecutive)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Operations Executive will Import loans from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel file containing loan data'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Loans have been successfully imported from Excel file',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Loans imported successfully' },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            totalProcessed: { type: 'number' },
            successful: { type: 'number' },
            failed: { type: 'number' },
            results: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  row: { type: 'number' },
                  loanId: { type: 'number' },
                  status: { type: 'string' }
                }
              }
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  row: { type: 'number' },
                  error: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  })
  async importLoans(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.loanService.importLoans(file, req.user.sub, req.user.officeId);
    return {
      status: 200,
      message: 'Loans imported successfully',
      data: result
    };
  }

  @Post(':id/assign-loan-executive')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Operations Executive will Assign a field executive to a loan verification' })
  @ApiResponse({ 
    status: 200, 
    description: 'The verification has been successfully assigned',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification assigned successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            loanId: { type: 'number' },
            type: { type: 'string', enum: Object.values(VerificationType) },
            fieldExecutiveId: { type: 'number' },
            status: { type: 'string' }
          }
        }
      }
    }
  })
  async assignLoan(
    @Param('id') loanId: string,
    @Body() body: { verificationType?: VerificationType; fieldExecutiveId?: number; address?: string; verifierId?: number },
  ) {
    const parsedLoanId = parseInt(loanId, 10);
    if (isNaN(parsedLoanId)) {
      throw new BadRequestException('Invalid loan ID');
    }

    const result = await this.loanService.assignVerification(
      parsedLoanId,
      body.verificationType,
      body.fieldExecutiveId,
      body.address,
      body.verifierId
    );
    return {
      status: 200,
      message: 'Verification assigned successfully',
      data: result
    };
  }

  @Patch(':id/update-executive')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Patch API to edit loan verification assignment' })
  @ApiResponse({ 
    status: 200, 
    description: 'The loan verification assignment has been successfully updated',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification assignment updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            loanId: { type: 'number' },
            type: { type: 'string', enum: Object.values(VerificationType) },
            fieldExecutiveId: { type: 'number' },
            status: { type: 'string' }
          }
        }
      }
    }
  })
  async updateAssignment(
    @Param('id') loanId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    const parsedLoanId = parseInt(loanId, 10);
    if (isNaN(parsedLoanId)) {
      throw new BadRequestException('Invalid loan ID');
    }

    const result = await this.loanService.updateVerificationAssignment(
      parsedLoanId,
      updateAssignmentDto.verificationType,
      updateAssignmentDto.fieldExecutiveId,
    );
    return {
      status: 200,
      message: 'Verification assignment updated successfully',
      data: result
    };
  }

  @Patch(':id')
  @Roles(UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Patch API to Edit loan details' })
  @ApiResponse({
    status: 200,
    description: 'The loan has been successfully updated',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Loan updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            applicantName: { type: 'string' },
            applicantMobile: { type: 'string' },
            applicantAddress: { type: 'string' },
            loanType: { type: 'string' },
            bankName: { type: 'string' },
            loanAmount: { type: 'number' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async editLoan(
    @Param('id') loanId: string,
    @Body() editLoanDto: EditLoanDto
  ) {
    const result = await this.loanService.editLoan(Number(loanId), editLoanDto);
    return {
      status: 200,
      message: 'Loan updated successfully',
      data: result
    };
  }


  /*
      The below API's are used by only Verifier. His tasks include: Approve or Reject Loan, Edit Verification Data, Generate Final Report
  */

  @Get('get-verifier-loans')
  @Roles(UserRole.Admin, UserRole.Verifier, UserRole.FieldExecutive)
  @ApiOperation({ summary: 'Get loans assigned to verifier' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of loans assigned to the same verifier calling this API'
  })
  async getLoansByVerifier(@Request() req: AuthenticatedRequest) {
    const result = await this.loanService.getLoansByVerifier(req.user.sub, req.user.role as UserRole);
    return {
      status: 200,
      message: 'Verifier loans fetched successfully',
      data: result
    };
  }


  @Get(':id/generate-final-report')
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({ summary: 'Generate PDF for loan details' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully' })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  async generatePDF(
    @Param('id') id: string,
    @Query('type') type: AddressType,
    @Query('status') status: string,
    @Res() res: Response,
  ) {
    try {
      const pdfBuffer = await this.loanService.generateVerificationPDF(Number(id), type, status)
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=loan-${id}-${type || 'all'}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
      }
    }
  }

  @Get(':id/verification-data')
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({ summary: 'Get verification data for a loan' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns verification data for the specified loan',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification data retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            loanId: { type: 'number' },
            applicationNumber: { type: 'string' },
            applicantName: { type: 'string' },
            verifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  type: { type: 'string', enum: Object.values(VerificationType) },
                  status: { type: 'string', enum: Object.values(VerificationStatus) },
                  verificationData: { type: 'object' },
                  path: { type: 'string', nullable: true },
                  fieldExecutive: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' },
                      mobile: { type: 'string' }
                    }
                  },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            verificationReport: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                remarks: { type: 'string' },
                verificationDate: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    }
  })
  async getVerificationData(@Param('id') loanId: string) {
    const result = await this.loanService.getVerificationData(Number(loanId));
    return {
      status: 200,
      message: 'Verification data retrieved successfully',
      data: result
    };
  }

  @Post(':id/verify')
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({ summary: 'Verifier will approve or reject a loan and add comments' })
  @ApiResponse({ 
    status: 200, 
    description: 'The loan has been successfully verified' 
  })
  async verifyLoan(
    @Param('id') loanId: string,
    @Body() verifyLoanDto: VerifyLoanDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.loanService.verifyLoan(
      Number(loanId),
      req.user.sub,
      verifyLoanDto.status,
      verifyLoanDto.comments,
    );
    return {
      status: 200,
      message: 'Loan verified successfully',
      data: result
    };
  }

  @Patch(':id/verification/:type')
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({ summary: 'Edit verification data' })
  @ApiResponse({
    status: 200,
    description: 'The verification data has been successfully updated',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification data updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            loanId: { type: 'number' },
            type: { type: 'string', enum: Object.values(VerificationType) },
            findings: { type: 'string' },
            verificationData: { type: 'object' },
            path: { type: 'string', nullable: true },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async editVerificationData(
    @Param('id') loanId: string,
    @Param('type') verificationType: VerificationType,
    @Body() editVerificationDto: EditVerificationDto
  ) {
    const result = await this.loanService.editVerificationData(
      Number(loanId),
      verificationType,
      editVerificationDto
    );
    return {
      status: 200,
      message: 'Verification data updated successfully',
      data: result
    };
  }


  /*
      The below API's are used by only Field Executive. His tasks include: Edit Verification Report, Submit Verification Data and Upload Proofs
  */

  @Get('get-field-executive-loans')
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: 'Get loans assigned to field executive' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of loans assigned to the same field executive calling this API'
  })
  async getLoansByFieldExecutive(@Request() req: AuthenticatedRequest) {
    const result = await this.loanService.getLoansByFieldExecutive(req.user.sub);
    return {
      status: 200,
      message: 'Field executive loans fetched successfully',
      data: result
    };
  }

  @Get('field-executive/assigned')
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: 'Get all loans assigned to field executive with verification details' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a paginated list of loans assigned to the field executive with verification details',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Assigned loans fetched successfully' },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  loan: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      applicationNumber: { type: 'string' },
                      applicantName: { type: 'string' },
                      loanAmount: { type: 'number' },
                      status: { type: 'string', enum: Object.values(LoanStatus) },
                      bankName: { type: 'string' },
                      loanType: { type: 'string' }
                    }
                  },
                  type: { type: 'string', enum: Object.values(VerificationType) },
                  status: { type: 'string' },
                  findings: { type: 'string' },
                  documents: { type: 'array', items: { type: 'string' } },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  async getAssignedLoansWithVerifications(
    @Request() req: AuthenticatedRequest,
    @Query() filters: FieldExecutiveAssignedDto
  ) {
    const result = await this.loanService.getAssignedLoansWithVerifications(req.user.sub, filters);
    return {
      status: 200,
      message: 'Assigned loans fetched successfully',
      data: result
    };
  }

  @Patch(':id/submit-verification-report')
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: 'Edit verification report' })
  @ApiResponse({ 
    status: 200, 
    description: 'The verification report has been successfully updated',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification report updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            loanId: { type: 'number' },
            type: { type: 'string', enum: Object.values(VerificationType) },
            fieldExecutiveId: { type: 'number' },
            findings: { type: 'string' },
            verificationData: { type: 'object' },
            path: { type: 'string', nullable: true },
            status: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async editVerificationReport(
    @Param('id') loanId: string,
    @Body() body: { 
      verificationType: VerificationType; 
      addressType: AddressType; 
      findings: string; 
      verificationData?: any;
    },
    @Request() req: AuthenticatedRequest,
  ) {
    
    const result = await this.loanService.editVerificationReport(
      Number(loanId),
      body.verificationType,
      req.user.sub,
      body.findings,
      body.verificationData,
      body.addressType,
    );
    return {
      status: 200,
      message: 'Verification report updated successfully',
      data: result
    };
  }

  @Patch(':id/verification/status')
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: 'Update verification status' })
  @ApiResponse({ 
    status: 200, 
    description: 'The verification status has been successfully updated',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification status updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            loanId: { type: 'number' },
            type: { type: 'string', enum: Object.values(VerificationType) },
            fieldExecutiveId: { type: 'number' },
            status: { type: 'string', enum: Object.values(VerificationStatus) }
          }
        }
      }
    }
  })
  async updateVerificationStatus(
    @Param('id') loanId: string,
    @Body() updateStatusDto: UpdateVerificationStatusDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.loanService.updateVerificationStatus(
      Number(loanId),
      updateStatusDto.type,
      req.user.sub,
      updateStatusDto.status,
    );
    return {
      status: 200,
      message: 'Verification status updated successfully',
      data: result
    };
  }

  @Delete(':id/verification/:type')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Delete verification assigned to a field executive' })
  @ApiBody({
    type: DeleteVerificationDto,
    description: 'Field executive ID to identify the verification to delete'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The verification has been successfully deleted',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification deleted successfully' },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            deletedVerification: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                loanId: { type: 'number' },
                type: { type: 'string', enum: Object.values(VerificationType) },
                fieldExecutiveId: { type: 'number' },
                status: { type: 'string', enum: Object.values(VerificationStatus) }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Cannot delete a completed verification' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Verification not found or not assigned to this field executive' 
  })
  async deleteVerification(
    @Param('id') loanId: string,
    @Param('type') verificationType: VerificationType,
    @Body() deleteVerificationDto: DeleteVerificationDto,
  ) {
    const result = await this.loanService.deleteVerification(
      Number(loanId),
      verificationType,
      deleteVerificationDto.fieldExecutiveId,
    );
    return {
      status: 200,
      message: 'Verification deleted successfully',
      data: result
    };
  }
} 