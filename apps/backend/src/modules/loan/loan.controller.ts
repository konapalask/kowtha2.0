import { Controller, Post, Get, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { VerificationType, LoanStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../common/types/request.types';
import { GetLoansDto } from './dto/get-loans.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('loans')
@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importLoans(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.loanService.importLoans(file, req.user.sub);
  }

  @Post(':id/assign')
  async assignLoan(
    @Param('id') loanId: number,
    @Body() body: { verificationType: VerificationType; fieldExecutiveId: number },
  ) {
    return this.loanService.assignVerification(loanId, body.verificationType, body.fieldExecutiveId);
  }

  @Post(':id/verification-report')
   async submitVerificationReport(
     @Param('id') loanId: number,
     @Body() body: { verificationType: VerificationType; findings: string; documents: string[] },
     @Request() req: AuthenticatedRequest,
   ) {
     return this.loanService.submitVerificationReport(
       loanId,
       body.verificationType as VerificationType,
       req.user.sub,
       body.findings,
       body.documents,
     );
   }

  @Post(':id/verify')
  async verifyLoan(
    @Param('id') loanId: number,
    @Body() body: { status: string; comments?: string },
    @Request() req: AuthenticatedRequest,
  ) {
    return this.loanService.verifyLoan(
      loanId,
      req.user.sub,
      body.status as LoanStatus,
      body.comments,
    );
  }

  @Get('office/:officeId')
  async getLoansByOffice(@Param('officeId') officeId: number) {
    return this.loanService.getLoansByOffice(officeId);
  }

  @Get('field-executive')
  async getLoansByFieldExecutive(@Request() req: AuthenticatedRequest) {
    return this.loanService.getLoansByFieldExecutive(req.user.sub);
  }

  @Get('verifier')
  async getLoansByVerifier(@Request() req: AuthenticatedRequest) {
    return this.loanService.getLoansByVerifier(req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all loans with optional status filter' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of loans matching the filter criteria' 
  })
  async getLoans(@Query() filters: GetLoansDto) {
    return this.loanService.getLoans(filters);
  }
} 