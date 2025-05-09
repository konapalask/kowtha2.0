import { Controller, Post, Get, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, Query, BadRequestException, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { VerificationType, LoanStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../common/types/request.types';
import { GetLoansDto } from './dto/get-loans.dto';
import { CreateLoanDto } from './dto/create-loan.dto';
import { VerifyLoanDto } from './dto/verify-loan.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { log } from 'console';
import * as XLSX from 'xlsx';

@ApiTags('loans')
@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Post()
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

    const result = await this.loanService.importLoans(file, req.user.sub);
    return {
      status: 200,
      message: 'Loans imported successfully',
      data: result
    };
  }

  @Post(':id/assign')
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
  async submitVerificationReport(
    @Param('id') loanId: number,
    @Body() body: { verificationType: VerificationType; findings: string; documents: string[] },
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.loanService.submitVerificationReport(
      loanId,
      body.verificationType as VerificationType,
      req.user.sub,
      body.findings,
      body.documents,
    );
    return {
      status: 200,
      message: 'Verification report submitted successfully',
      data: result
    };
  }

  @Post(':id/verify')
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
  async getLoansByOffice(@Param('officeId') officeId: number) {
    const result = await this.loanService.getLoansByOffice(officeId);
    return {
      status: 200,
      message: 'Office loans fetched successfully',
      data: result
    };
  }

  @Get('field-executive')
  async getLoansByFieldExecutive(@Request() req: AuthenticatedRequest) {
    const result = await this.loanService.getLoansByFieldExecutive(req.user.sub);
    return {
      status: 200,
      message: 'Field executive loans fetched successfully',
      data: result
    };
  }

  @Get('verifier')
  async getLoansByVerifier(@Request() req: AuthenticatedRequest) {
    const result = await this.loanService.getLoansByVerifier(req.user.sub);
    return {
      status: 200,
      message: 'Verifier loans fetched successfully',
      data: result
    };
  }

  @Get()
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
} 