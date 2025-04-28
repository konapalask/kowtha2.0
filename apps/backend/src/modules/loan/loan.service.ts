import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, LoanStatus, VerificationType } from '@prisma/client';

// Workaround: use union type for VerificationType
// TODO: Replace with import from @prisma/client if/when available
// type VerificationType = 'PermanentAddress' | 'CurrentAddress' | 'Work';

@Injectable()
export class LoanService {
  constructor(private prisma: PrismaService) {}

  async importLoans(file: Express.Multer.File, operationsExecutiveId: number) {
    // TODO: Implement Excel file parsing and loan import
    // This is a placeholder for the actual implementation
    return { message: 'Loans imported successfully' };
  }

  // Assign a field executive to a verification for a loan
  async assignVerification(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number
  ) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    // Upsert verification assignment
    return this.prisma.verification.upsert({
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
  }

  async submitVerificationReport(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number,
    findings: string,
    documents: string[],
  ) {
    const verification = await this.prisma.verification.findUnique({
      where: {
        loanId_type: {
          loanId,
          type: verificationType,
        },
      },
    });
    if (!verification) throw new NotFoundException('Verification not found');
    // Update verification status and remarks
    return this.prisma.verification.update({
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
  }

  async verifyLoan(loanId: number, verifierId: number, status: LoanStatus, comments?: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: { verificationReport: true },
    });
    if (!loan) throw new NotFoundException('Loan not found');
    if (!loan.verificationReport) throw new NotFoundException('Verification report not found');
    await this.prisma.verificationReport.update({
      where: { loanId },
      data: { remarks: comments || '' },
    });
    return this.prisma.loan.update({
      where: { id: loanId },
      data: {
        verifierId,
        status,
      },
    });
  }

  async getLoansByOffice(officeId: number) {
    return this.prisma.loan.findMany({
      where: { officeId },
      include: {
        operationsExecutive: true,
        verifier: true,
        verificationReport: true,
        verifications: true,
      },
    });
  }

  async getLoansByFieldExecutive(fieldExecutiveId: number) {
    // Find all verifications assigned to this field executive
    const verifications = await this.prisma.verification.findMany({
      where: { fieldExecutiveId },
      select: { loanId: true },
    });
    const loanIds = verifications.map(v => v.loanId);
    return this.prisma.loan.findMany({
      where: { id: { in: loanIds } },
      include: {
        operationsExecutive: true,
        verificationReport: true,
        verifications: true,
      },
    });
  }

  async getLoansByVerifier(verifierId: number) {
    return this.prisma.loan.findMany({
      where: { verifierId },
      include: {
        operationsExecutive: true,
        verificationReport: true,
        verifications: true,
      },
    });
  }
} 