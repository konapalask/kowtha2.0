import { Controller, Post, Get, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { VerificationType, LoanStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../common/types/request.types';
import { GetLoansDto } from './dto/get-loans.dto';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  async importLoans(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.loanService.importLoans(file, req.user.sub);
    return {
      status: 200,
      message: 'Loans imported successfully',
      data: result
    };
  }

  @Post(':id/assign')
  async assignLoan(
    @Param('id') loanId: number,
    @Body() body: { verificationType: VerificationType; fieldExecutiveId: number },
  ) {
    const result = await this.loanService.assignVerification(loanId, body.verificationType, body.fieldExecutiveId);
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
  async verifyLoan(
    @Param('id') loanId: number,
    @Body() body: { status: string; comments?: string },
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.loanService.verifyLoan(
      loanId,
      req.user.sub,
      body.status as LoanStatus,
      body.comments,
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
} 