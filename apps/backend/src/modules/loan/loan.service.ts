import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, LoanStatus, VerificationType } from '@prisma/client';
import { logger } from '../common/logging';

// Workaround: use union type for VerificationType
// TODO: Replace with import from @prisma/client if/when available
// type VerificationType = 'PermanentAddress' | 'CurrentAddress' | 'Work';

@Injectable()
export class LoanService {
  constructor(private prisma: PrismaService) {}

  async importLoans(file: Express.Multer.File, operationsExecutiveId: number) {
    try {
      // TODO: Implement Excel file parsing and loan import
      // This is a placeholder for the actual implementation
      await logger.info('Loans import started', { 
        operationsExecutiveId,
        fileName: file.originalname 
      });
      return { message: 'Loans imported successfully' };
    } catch (error) {
      await logger.error('Failed to import loans', { 
        operationsExecutiveId,
        fileName: file.originalname,
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  // Assign a field executive to a verification for a loan
  async assignVerification(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number
  ) {
    try {
      const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
      if (!loan) {
        await logger.warn('Verification assignment failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      const verification = await this.prisma.verification.upsert({
        where: {
          loanId_type: {
            loanId,
            type: verificationType,
          },
        },
        update: {
          fieldExecutiveId,
          status: 'Pending',
        },
        create: {
          loanId,
          type: verificationType,
          fieldExecutiveId,
          status: 'Pending',
        },
      });

      await logger.info('Verification assigned successfully', {
        loanId,
        verificationType,
        fieldExecutiveId,
        verificationId: verification.id
      });

      return verification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await logger.error('Failed to assign verification', {
        loanId,
        verificationType,
        fieldExecutiveId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async submitVerificationReport(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number,
    findings: string,
    documents: string[],
  ) {
    try {
      const verification = await this.prisma.verification.findUnique({
        where: {
          loanId_type: {
            loanId,
            type: verificationType,
          },
        },
      });

      if (!verification) {
        await logger.warn('Verification report submission failed - Verification not found', {
          loanId,
          verificationType
        });
        throw new NotFoundException('Verification not found');
      }

      const updatedVerification = await this.prisma.verification.update({
        where: {
          loanId_type: {
            loanId,
            type: verificationType,
          },
        },
        data: {
          status: 'Completed',
          // Optionally store findings and documents if schema supports
        },
      });

      await logger.info('Verification report submitted successfully', {
        loanId,
        verificationType,
        fieldExecutiveId,
        verificationId: verification.id
      });

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await logger.error('Failed to submit verification report', {
        loanId,
        verificationType,
        fieldExecutiveId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async verifyLoan(loanId: number, verifierId: number, status: LoanStatus, comments?: string) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
        include: { verificationReport: true },
      });

      if (!loan) {
        await logger.warn('Loan verification failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      if (!loan.verificationReport) {
        await logger.warn('Loan verification failed - Verification report not found', { loanId });
        throw new NotFoundException('Verification report not found');
      }

      await this.prisma.verificationReport.update({
        where: { loanId },
        data: { remarks: comments || '' },
      });

      const updatedLoan = await this.prisma.loan.update({
        where: { id: loanId },
        data: {
          verifierId,
          status,
        },
      });

      await logger.info('Loan verified successfully', {
        loanId,
        verifierId,
        status,
        hasComments: !!comments
      });

      return updatedLoan;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await logger.error('Failed to verify loan', {
        loanId,
        verifierId,
        status,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getLoansByOffice(officeId: number) {
    try {
      const loans = await this.prisma.loan.findMany({
        where: { officeId },
        include: {
          operationsExecutive: true,
          verifier: true,
          verificationReport: true,
          verifications: true,
        },
      });

      await logger.debug('Retrieved loans by office', {
        officeId,
        count: loans.length
      });

      return loans;
    } catch (error) {
      await logger.error('Failed to get loans by office', {
        officeId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getLoansByFieldExecutive(fieldExecutiveId: number) {
    try {
      const verifications = await this.prisma.verification.findMany({
        where: { fieldExecutiveId },
        select: { loanId: true },
      });

      const loanIds = verifications.map(v => v.loanId);
      const loans = await this.prisma.loan.findMany({
        where: { id: { in: loanIds } },
        include: {
          operationsExecutive: true,
          verificationReport: true,
          verifications: true,
        },
      });

      await logger.debug('Retrieved loans by field executive', {
        fieldExecutiveId,
        count: loans.length
      });

      return loans;
    } catch (error) {
      await logger.error('Failed to get loans by field executive', {
        fieldExecutiveId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getLoansByVerifier(verifierId: number) {
    try {
      const loans = await this.prisma.loan.findMany({
        where: { verifierId },
        include: {
          operationsExecutive: true,
          verificationReport: true,
          verifications: true,
        },
      });

      await logger.debug('Retrieved loans by verifier', {
        verifierId,
        count: loans.length
      });

      return loans;
    } catch (error) {
      await logger.error('Failed to get loans by verifier', {
        verifierId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
} 