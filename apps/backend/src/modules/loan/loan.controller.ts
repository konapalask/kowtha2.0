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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VerificationType, LoanStatus } from '@prisma/client';
@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importLoans(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
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
     @Request() req,
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
    @Request() req,
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
  async getLoansByFieldExecutive(@Request() req) {
    return this.loanService.getLoansByFieldExecutive(req.user.sub);
  }

  @Get('verifier')
  async getLoansByVerifier(@Request() req) {
    return this.loanService.getLoansByVerifier(req.user.sub);
  }
} 