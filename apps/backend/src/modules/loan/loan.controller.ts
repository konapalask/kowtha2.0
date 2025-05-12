import { Controller, Post, Get, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, Query, BadRequestException, Patch, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { RolesGuard } from '../accounts/guards/roles.guard';
import { Roles } from '../accounts/decorators/roles.decorator';
import { VerificationType, LoanStatus, UserRole, VerificationStatus } from '@prisma/client';
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

@ApiTags('loans')
@Controller('loans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Create a new loan' })
  @ApiResponse({ 
    status: 201, 
    description: 'The loan has been successfully created' 
  })
  async createLoan(@Body() createLoanDto: CreateLoanDto) {
    const result = await this.loanService.createLoan(createLoanDto);
    return {
      status: 201,
      message: 'Loan created successfully',
      data: result
    };
  }

  @Post('import')
  @Roles(UserRole.OperationsExecutive)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import loans from Excel file' })
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

  @Post(':id/assign')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Assign a field executive to a loan verification' })
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
    @Body() body: { verificationType: VerificationType; fieldExecutiveId: number },
  ) {
    const parsedLoanId = parseInt(loanId, 10);
    if (isNaN(parsedLoanId)) {
      throw new BadRequestException('Invalid loan ID');
    }

    const result = await this.loanService.assignVerification(
      parsedLoanId,
      body.verificationType,
      body.fieldExecutiveId
    );
    return {
      status: 200,
      message: 'Verification assigned successfully',
      data: result
    };
  }

  @Post(':id/verification-report')
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: 'Submit verification report' })
  @ApiResponse({ 
    status: 200, 
    description: 'The verification report has been successfully submitted'
  })
  async submitVerificationReport(
    @Param('id') loanId: number,
    @Body() body: { 
      verificationType: VerificationType; 
      findings: string; 
      documents: string[];
      path?: string;
    },
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.loanService.submitVerificationReport(
      loanId,
      body.verificationType as VerificationType,
      req.user.sub,
      body.findings,
      body.documents,
      body.path,
    );
    return {
      status: 200,
      message: 'Verification report submitted successfully',
      data: result
    };
  }

  @Post(':id/verify')
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({ summary: 'Verify a loan by field verifier' })
  @ApiResponse({ 
    status: 200, 
    description: 'The loan has been successfully verified' 
  })
  async verifyLoan(
    @Param('id') loanId: number,
    @Body() verifyLoanDto: VerifyLoanDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.loanService.verifyLoan(
      loanId,
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

  @Get('field-executive')
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: 'Get loans assigned to field executive' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of loans assigned to the field executive'
  })
  async getLoansByFieldExecutive(@Request() req: AuthenticatedRequest) {
    const result = await this.loanService.getLoansByFieldExecutive(req.user.sub);
    return {
      status: 200,
      message: 'Field executive loans fetched successfully',
      data: result
    };
  }

  @Get('verifier')
  @Roles(UserRole.Admin, UserRole.Verifier)
  @ApiOperation({ summary: 'Get loans assigned to verifier' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of loans assigned to the verifier'
  })
  async getLoansByVerifier(@Request() req: AuthenticatedRequest) {
    const result = await this.loanService.getLoansByVerifier(req.user.sub);
    return {
      status: 200,
      message: 'Verifier loans fetched successfully',
      data: result
    };
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Get all loans with optional status filter' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of loans matching the filter criteria' 
  })
  async getLoans(@Query() filters: GetLoansDto) {
    const result = await this.loanService.getLoans(filters);
    return {
      status: 200,
      message: 'Loans fetched successfully',
      data: result
    };
  }

  @Patch(':id/assign')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Update loan verification assignment' })
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

  @Get('field-executive/assigned')
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: 'Get all loans assigned to field executive with verification details' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of loans assigned to the field executive with verification details',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Assigned loans fetched successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              loanNumber: { type: 'string' },
              applicantName: { type: 'string' },
              amount: { type: 'number' },
              status: { type: 'string', enum: Object.values(LoanStatus) },
              verifications: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    type: { type: 'string', enum: Object.values(VerificationType) },
                    status: { type: 'string' },
                    findings: { type: 'string' },
                    documents: { type: 'array', items: { type: 'string' } },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async getAssignedLoansWithVerifications(@Request() req: AuthenticatedRequest) {
    const result = await this.loanService.getAssignedLoansWithVerifications(req.user.sub);
    return {
      status: 200,
      message: 'Assigned loans fetched successfully',
      data: result
    };
  }

  @Patch(':id/verification-report')
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
            documents: { type: 'array', items: { type: 'string' } },
            path: { type: 'string', nullable: true },
            status: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async editVerificationReport(
    @Param('id') loanId: number,
    @Body() body: { 
      verificationType: VerificationType; 
      findings: string; 
      documents: string[];
      path?: string;
    },
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.loanService.editVerificationReport(
      loanId,
      body.verificationType,
      req.user.sub,
      body.findings,
      body.documents,
      body.path,
    );
    return {
      status: 200,
      message: 'Verification report updated successfully',
      data: result
    };
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Generate PDF for loan details' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully' })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  async generatePDF(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const pdfBuffer = await this.loanService.generateLoanPDF(Number(id));
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=loan-${id}.pdf`,
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
    @Param('id') loanId: number,
    @Body() updateStatusDto: UpdateVerificationStatusDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.loanService.updateVerificationStatus(
      loanId,
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
} 