import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, LoanStatus, VerificationType, VerificationStatus } from '@prisma/client';
import { LoggingService } from '../common/logging/logging.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import * as XLSX from 'xlsx';
import { Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import PDFDocument = require('pdfkit');
import { Buffer } from 'buffer'; // Import the Buffer type
import * as fs from 'fs';
import * as path from 'path';
import { EditLoanDto } from './dto/edit-loan.dto';
import { EditVerificationDto } from './dto/edit-verification.dto';
import { S3Service } from '../common/s3utils/s3.service';

// Workaround: use union type for VerificationType
// TODO: Replace with import from @prisma/client if/when available
// type VerificationType = 'PermanentAddress' | 'CurrentAddress' | 'Work';

interface VerificationData {
  applicantDetails?: {
    applicantName: string;
    pan: string;
    aadhar: string;
    coApplicantName: string;
    coApplicantPan: string;
    coApplicantAadhar: string;
    address: string;
  };
  basicDetails?: {
    verificationDate: string;
    verificationMode: string;
    verificationTime: string;
    verificationType: string;
    verificationStatus: string;
    verificationRemarks: string;
    maritalStatus: string;
    educationalQualification: string;
    dependents: string;
    yearsInCurrentResidence: string;
    houseSize: string;
    previousAddress: string;
    yearsAtPreviousAddress: string;
    yearsInCurrentCity: string;
    previousCity: string;
    yearsInPreviousCity: string;
    reasonForChange: string;
    parentsStayingWith: string;
    category: string;
  };
  applicantInformation?: {
    applicantAge: string;
    applicantGender: string;
    applicantEducation: string;
    applicantMaritalStatus: string;
  };
  residenceDetails?: {
    houseArea: string;
    rentDetails: string;
    localityType: string;
    accessibility: string;
    residenceType: string;
    residenceStatus: string;
    locationCategory: string;
    nameplateVisible: string;
    standardOfLiving: string;
    constructionQuality: string;
    yearsAtCurrentAddress: string;
  };
  familyEmploymentDetails?: {
    totalFamilyMembers: string;
    earningMembers: string;
    dependents: string;
    isSpouseWorking: string;
    spouseEmploymentDetails: string;
    assetsObserved: string;
  };
  thirdPartyCheck?: {
    tpcName: string;
    relationship: string;
    comments: string;
    feedbackStatus: string;
  };
  addressVerification?: {
    addressType: string;
    addressCategory: string;
    addressSubCategory: string;
    addressDetails: string;
    geoTag: string;
  };
  finalObservations?: {
    overallStatus: string;
    cooperativeness: string;
    remarks: string;
  };
  uploadedItems?: Array<{
    id: string;
    uri: string;
    type: string;
    timestamp: string;
  }>;
}

@Injectable()
export class LoanService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
    private logger: Logger,
    private s3Service: S3Service,
  ) {}

  async createLoan(data: CreateLoanDto) {
    try {
      // Start a transaction to ensure all operations succeed or fail together
      return await this.prisma.$transaction(async (prisma) => {
        // Create the loan
        const loanData: Prisma.LoanCreateInput = {
          applicationNumber: data.applicationNumber || `LOAN-${Date.now()}`,
          applicantName: data.applicantName,
          applicantMobile: data.applicantMobile,
          applicantAddress: data.applicantAddress,
          isAddressSame: data.isAddressSame || false,
          loanType: data.loanType,
          bankName: data.bankName,
          loanAmount: data.loanAmount,
          office: { connect: { id: data.officeId } },
          operationsExecutive: { connect: { id: data.operationsExecutiveId } },
          status: data.status || LoanStatus.Unassigned,
        };

        const loan = await prisma.loan.create({
          data: loanData,
          include: {
            operationsExecutive: true,
            office: true,
          },
        });

        // If field executive ID is provided, create all three verifications
        if (data.fieldExecutiveId) {
          const verificationTypes = [
            VerificationType.PermanentAddress,
            VerificationType.CurrentAddress,
            VerificationType.Work,
          ];

          // Create verifications for each type
          await Promise.all(
            verificationTypes.map((type) =>
              prisma.verification.create({
                data: {
                  loanId: loan.id,
                  type,
                  fieldExecutiveId: data.fieldExecutiveId,
                  status: VerificationStatus.Pending,
                },
              })
            )
          );

          // Update loan status to Assigned since field executive is assigned
          await prisma.loan.update({
            where: { id: loan.id },
            data: { status: LoanStatus.Assigned },
          });
        }

        await this.loggingService.info('Loan created successfully with verifications', {
          loanId: loan.id,
          applicationNumber: loan.applicationNumber,
          applicantName: loan.applicantName,
          loanAmount: loan.loanAmount,
          fieldExecutiveId: data.fieldExecutiveId,
        });

        // Fetch the complete loan data with verifications
        return await prisma.loan.findUnique({
          where: { id: loan.id },
          include: {
            operationsExecutive: true,
            office: true,
            verifications: {
              include: {
                fieldExecutive: true,
              },
            },
          },
        });
      });
    } catch (error) {
      await this.loggingService.error('Failed to create loan', {
        data,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async importLoans(file: Express.Multer.File, operationsExecutiveId: number, officeId: number) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // Read the Excel file
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (!data.length) {
        throw new BadRequestException('Excel file is empty');
      }

      const results = [];
      const errors = [];

      // Process each row
      for (const row of data) {
        try {
          const loanData: CreateLoanDto = {
            applicantName: row['NAME OF THE APPLICANT'],
            applicantMobile: row['CONTACT NUMBER'].toString(),
            applicantAddress: row['FULL ADDRESS'],
            isAddressSame: row['IS_ADDRESS_SAME'] === 'YES' || false,
            applicationNumber: row['APPLICATION ID'],
            loanType: 'Personal', // Default to Personal if not specified
            bankName: 'Default Bank', // Default bank if not specified
            loanAmount: 100,
            officeId: officeId, // Use the provided officeId
            operationsExecutiveId: operationsExecutiveId,
            status: LoanStatus.Unassigned,
            verifierId: 9,
          };

          // Validate required fields
          if (!loanData.applicantName || !loanData.applicantMobile || !loanData.applicantAddress) {
            throw new Error('Missing required fields: Applicant Name, Contact Number, or Full Address');
          }

          if (!loanData.applicationNumber) {
            throw new Error('Missing required field: APPLICATION ID');
          }

          const loan = await this.createLoan(loanData);
          results.push({
            row: row['__rowNum__'] + 1,
            loanId: loan.id,
            status: 'success'
          });
        } catch (error) {
          errors.push({
            row: row['__rowNum__'] + 1,
            error: error.message
          });
        }
      }

      await this.loggingService.info('Loans import completed', {
        operationsExecutiveId,
        fileName: file.originalname,
        totalProcessed: data.length,
        successful: results.length,
        failed: errors.length
      });

      return {
        message: 'Loans import completed',
        totalProcessed: data.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors
      };
    } catch (error) {
      await this.loggingService.error('Failed to import loans', {
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
        await this.loggingService.warn('Verification assignment failed - Loan not found', { loanId });
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

      const loanStatusChange = await this.prisma.loan.update({
        where: { id: loanId },
        data: { status: 'Assigned' },
      });

      await this.loggingService.info('Verification assigned successfully', {
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
      await this.loggingService.error('Failed to assign verification', {
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
    path?: string,
    verificationData?: any,
    pictureSource?: 'Camera' | 'Gallery',
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
        await this.loggingService.warn('Verification report submission failed - Verification not found', {
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
          paths: path ? [path] : [],
          verificationData: verificationData || null,
          pictureSource: pictureSource || null,
        },
      });

      await this.loggingService.info('Verification report submitted successfully', {
        loanId,
        verificationType,
        fieldExecutiveId,
        verificationId: verification.id,
        hasPath: !!path,
        hasVerificationData: !!verificationData,
        pictureSource
      });

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error('Failed to submit verification report', {
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
        await this.loggingService.warn('Loan verification failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      if (!loan.verificationReport) {
        await this.loggingService.warn('Loan verification failed - Verification report not found', { loanId });
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

      await this.loggingService.info('Loan verified successfully', {
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
      await this.loggingService.error('Failed to verify loan', {
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

      await this.loggingService.debug('Retrieved loans by office', {
        officeId,
        count: loans.length
      });

      return loans;
    } catch (error) {
      await this.loggingService.error('Failed to get loans by office', {
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

      await this.loggingService.debug('Retrieved loans by field executive', {
        fieldExecutiveId,
        count: loans.length
      });

      return loans;
    } catch (error) {
      await this.loggingService.error('Failed to get loans by field executive', {
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

      await this.loggingService.debug('Retrieved loans by verifier', {
        verifierId,
        count: loans.length
      });

      return loans;
    } catch (error) {
      await this.loggingService.error('Failed to get loans by verifier', {
        verifierId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getLoans(filters?: { status?: LoanStatus }) {
    try {
      const where: Prisma.LoanWhereInput = {};
      
      if (filters?.status) {
        where.status = filters.status;
      }

      const loans = await this.prisma.loan.findMany({
        where,
        include: {
          operationsExecutive: true,
          verifier: true,
          verificationReport: true,
          verifications: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      await this.loggingService.debug('Retrieved loans with filters', {
        filters,
        count: loans.length
      });

      return loans;
    } catch (error) {
      await this.loggingService.error('Failed to get loans', {
        filters,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async updateVerificationAssignment(
    loanId: number,
    verificationType?: VerificationType,
    fieldExecutiveId?: number,
  ) {
    try {
      const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
      if (!loan) {
        await this.loggingService.warn('Verification assignment update failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      // If no updates provided, return current verification
      if (!verificationType && !fieldExecutiveId) {
        const verification = await this.prisma.verification.findFirst({
          where: { loanId }
        });
        return verification;
      }

      // Update verification
      const verification = await this.prisma.verification.update({
        where: {
          loanId_type: {
            loanId,
            type: verificationType,
          },
        },
        data: {
          ...(fieldExecutiveId && { fieldExecutiveId }),
          status: 'Pending', // Reset status when assignment is updated
        },
      });

      await this.loggingService.info('Verification assignment updated successfully', {
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
      await this.loggingService.error('Failed to update verification assignment', {
        loanId,
        verificationType,
        fieldExecutiveId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getAssignedLoansWithVerifications(fieldExecutiveId: number) {
    try {
      const loans = await this.prisma.loan.findMany({
        where: {
          verifications: {
            some: {
              fieldExecutiveId: fieldExecutiveId,
            },
          },
        },
        include: {
          verifications: {
            where: {
              fieldExecutiveId: fieldExecutiveId,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return loans;
    } catch (error) {
      this.logger.error(`Error fetching assigned loans with verifications: ${error.message}`, error.stack);
      throw new Error('Failed to fetch assigned loans with verifications');
    }
  }

  async editVerificationReport(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number,
    findings: string,
    verificationData?: any,
    paths?: string[],
  ) {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: {
          loanId,
          type: verificationType,
          fieldExecutiveId,
        },
      });

      if (!verification) {
        throw new Error('Verification not found or not assigned to this field executive');
      }

      // Update verification status
      const updatedVerification = await this.prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          status: 'Completed',
          paths: paths || [],
          verificationData: verificationData || null,
          updatedAt: new Date(),
        },
      });

      // Create or update verification report
      const verificationReport = await this.prisma.verificationReport.upsert({
        where: {
          loanId,
        },
        update: {
          remarks: findings,
          updatedAt: new Date(),
        },
        create: {
          loanId,
          verifierId: fieldExecutiveId,
          verificationDate: new Date(),
          remarks: findings,
        },
      });

      return {
        verification: updatedVerification,
        report: verificationReport,
      };
    } catch (error) {
      this.logger.error(`Error updating verification report: ${error.message}`, error.stack);
      throw new Error('Failed to update verification report');
    }
  }

  async generateLoanPDF(loanId: number): Promise<Buffer> {
    try {
      // Fetch loan details with verification data
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
        select: {
          applicationNumber: true,
          applicantName: true,
          applicantMobile: true,
          applicantAddress: true,
          loanType: true,
          bankName: true,
          loanAmount: true,
          status: true,
          office: { select: { name: true } },
          operationsExecutive: { select: { name: true } },
          verifications: {
            select: {
              type: true,
              status: true,
              updatedAt: true,
              verificationData: true,
              paths: true,
              fieldExecutive: { select: { name: true } }
            }
          },
          verificationReport: { select: { remarks: true, verificationDate: true } }
        }
      });

      if (!loan) {
        throw new NotFoundException('Loan not found');
      }

      // Get the first verification's data for the template
      const verificationData = loan.verifications[0]?.verificationData as VerificationData || {};

      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: #fff;
              color: #222;
            }
            .header {
              text-align: left;
              padding: 24px 40px 8px 40px;
              border-bottom: 2px solid #2c3e50;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .header .firm {
              font-size: 28px;
              font-weight: bold;
              color: #1a237e;
              letter-spacing: 1px;
            }
            .header .subtitle {
              color: #1976d2;
              font-style: italic;
              font-size: 18px;
              margin-bottom: 8px;
            }
            .header .address {
              font-size: 14px;
              margin-bottom: 4px;
            }
            .header .contact {
              font-size: 14px;
              text-align: right;
            }
            .report-title {
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              margin: 24px 0 0 0;
              letter-spacing: 1px;
              text-decoration: underline;
            }
            .align-wrapper {
              width: 90%;
              margin: 0 auto;
            }
            .branch-box {
              width: 100%;
              margin: 18px 0 0 0;
              border: 2px solid #888;
              border-radius: 4px;
              background: #f8f9fa;
            }
            .branch-table {
              width: 100%;
              border-collapse: collapse;
            }
            .branch-table td {
              border: none;
              padding: 10px 16px;
              font-size: 16px;
            }
            .branch-label {
              font-weight: bold;
              width: 160px;
            }
            .branch-value {
              font-size: 18px;
              font-weight: bold;
              color: #222;
            }
            .branch-note {
              background: #ffe0b2;
              color: #b26a00;
              font-size: 13px;
              text-align: center;
              border-radius: 3px;
              font-weight: bold;
            }
            .section-table {
              width: 100%;
              margin: 24px 0 0 0;
              border-collapse: collapse;
              font-size: 15px;
            }
            .section-header {
              background: #f5f5f5;
              font-weight: bold;
              font-size: 16px;
              text-align: center;
              border: 1px solid #888;
              padding: 8px;
              letter-spacing: 1px;
            }
            .section-table th, .section-table td {
              border: 1px solid #888;
              padding: 8px 10px;
              vertical-align: top;
            }
            .section-table th {
              background: #f5f5f5;
              font-weight: bold;
              text-align: center; 
              width: 220px;
            }
            .highlight {
              font-weight: bold;
              color: #1a237e;
            }
            .tick {
              font-weight: bold;
              color: #388e3c;
              font-size: 18px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #7f8c8d;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
            .logo {
              margin-top: 24px;
              text-align: center;
              opacity: 0.15;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="firm">KOWTHA & CO.</div>
              <div class="subtitle">CHARTERED ACCOUNTANTS</div>
              <div class="address">26-22-21, Mudunurivari Street,<br>Gandhi Nagar, VIJAYAWADA – 520003.</div>
            </div>
            <div class="contact">
              Mobile no: 9491821359<br>
              Mail ID: kowthaBOI@gmail.com
            </div>
          </div>

          <div class="report-title">DUE DILIGENCE REPORT</div>

          <div class="align-wrapper">
            <div class="branch-box">
              <table class="branch-table">
                <tr>
                  <td class="branch-label">Branch Name</td>
                  <td class="branch-value">PIDUGURALLA</td>
                  <td class="branch-note">NOTE: Please tick/circle as applicable</td>
                </tr>
              </table>
            </div>
            <table class="section-table">
              <tr><td colspan="6" class="section-header">Basic Details</td></tr>
              <tr>
                <th>Name of Applicant</th>
                <td colspan="2">${verificationData.applicantDetails?.applicantName || 'Mr. PADIRA MOHA YOGESH'}</td>
                <th>PAN Number</th>
                <td colspan="2">${verificationData.applicantDetails?.pan || 'DEIPP8976Q'}</td>
              </tr>
              <tr>
                <th>Aadhar Number</th>
                <td colspan="2">${verificationData.applicantDetails?.aadhar || '2656 5044 6168'}</td>
                <th>Name Of the Co-Applicant</th>
                <td colspan="2">${verificationData.applicantDetails?.coApplicantName || 'Mr. PADIRA SRINIVASA CHARY'}</td>
              </tr>
              <tr>
                <th>PAN of the Co-Applicant</th>
                <td colspan="2">${verificationData.applicantDetails?.coApplicantPan || 'BBJPB893D'}</td>
                <th>Aadhar Of the Co-Applicant</th>
                <td colspan="2">${verificationData.applicantDetails?.coApplicantAadhar || '7344 4827 4773'}</td>
              </tr>
              <tr>
                <th>Residential Address</th>
                <td colspan="5">${verificationData.applicantDetails?.address || 'Siri Mens Duplex Hostel, N Convention Road, Hi Tech City, Near Shilparamam, Hospital and Telangana.'}</td>
              </tr>
              <tr>
                <th>Marital Status</th>
                <td colspan="2">${verificationData.basicDetails?.maritalStatus || 'Married'}</td>
                <th>Educational Qualification</th>
                <td colspan="2">${verificationData.basicDetails?.educationalQualification || 'Graduate'}</td>
              </tr>
              <tr>
                <th>Category</th>
                <td colspan="2">${verificationData.basicDetails?.maritalStatus || 'General'}</td>
                <th>Number of Dependents</th>
                <td colspan="2">${verificationData.basicDetails?.educationalQualification || '3'}</td>
              </tr>
              <tr>
                <th>Number of years in Current Residence</th>
                <td colspan="2">${verificationData.basicDetails?.maritalStatus || '2'}</td>
                <th>Current residence house size</th>
                <td colspan="2">${verificationData.basicDetails?.educationalQualification || '3'}</td>
              </tr>
              <tr>
                <th>If Less than 1 Year, then Previous Address</th>
                <td colspan="5">${verificationData.basicDetails?.yearsInCurrentCity || 'Gachibowli, Hyderabad'}</td>
              </tr>
              <tr>
                <th>Number of Years in Current City</th>
                <td colspan="2">${verificationData.basicDetails?.previousAddress || 'NA'}</td>
                <th>Number of Years stayed at that Address</th>
                <td colspan="2">${verificationData.basicDetails?.yearsAtPreviousAddress || 'NA'}</td>
              </tr>
              <tr>
                <th>If Less than 3 Years in current city, then mention</th>
                <td colspan="5">${verificationData.basicDetails?.previousCity || 'NA'}</td>
              </tr>
              <tr>
                <th>Reason for Change</th>
                <td colspan="5">${verificationData.basicDetails?.reasonForChange || 'NA'}</td>
              </tr>
              <tr>
                <th>Parents Staying with?</th>
                <td colspan="5">${verificationData.basicDetails?.parentsStayingWith || 'Self'}</td>
              </tr>
            </table>
          </div>

          <div class="logo">
            <img src="/Users/bys/Desktop/signature_kowtha.jpeg" width="120" alt="stamp" />
          </div>

          <div class="footer">
            <span>BOI-AP</span><br>
            Generated on ${new Date().toLocaleString()}
          </div>
        </body>
        </html>
      `;

      // Launch a new browser instance
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Create a new page
      const page = await browser.newPage();

      // Set content to the HTML template
      await page.setContent(htmlTemplate, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdfArray = await page.pdf({
        format: 'a4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        printBackground: true,
        preferCSSPageSize: true
      });
      const pdfBuffer: Buffer = Buffer.from(pdfArray);
      // Close the browser
      await browser.close();

      await this.loggingService.info('PDF generated successfully', {
        loanId,
        applicationNumber: loan.applicationNumber,
      });

      return pdfBuffer;
    } catch (error) {
      await this.loggingService.error('Failed to generate PDF', {
        loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateVerificationStatus(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number,
    status: VerificationStatus,
  ) {
    try {
      // Verify that the field executive is assigned to this verification
      const verification = await this.prisma.verification.findFirst({
        where: {
          loanId,
          type: verificationType,
          fieldExecutiveId,
        },
      });

      if (!verification) {
        await this.loggingService.warn('Verification status update failed - Verification not found or not assigned', {
          loanId,
          verificationType,
          fieldExecutiveId
        });
        throw new NotFoundException('Verification not found or not assigned to this field executive');
      }

      // Update verification status
      const updatedVerification = await this.prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          status,
        },
      });

      // If status is Completed, check if all verifications are complete
      if (status === VerificationStatus.Completed) {
        const allVerifications = await this.prisma.verification.findMany({
          where: {
            loanId,
          },
        });

        const allCompleted = allVerifications.every(
          v => v.status === VerificationStatus.Completed
        );

        // If all verifications are complete, update loan status to FVCompleted
        if (allCompleted) {
          await this.prisma.loan.update({
            where: { id: loanId },
            data: { status: LoanStatus.FVCompleted },
          });

          await this.loggingService.info('All verifications completed, loan status updated', {
            loanId,
            newStatus: LoanStatus.FVCompleted
          });
        }
      }

      await this.loggingService.info('Verification status updated successfully', {
        loanId,
        verificationType,
        fieldExecutiveId,
        newStatus: status
      });

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error('Failed to update verification status', {
        loanId,
        verificationType,
        fieldExecutiveId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getVerificationData(loanId: number) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
        include: {
          verifications: {
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true
                }
              }
            }
          },
          verificationReport: true
        }
      });

      if (!loan) {
        await this.loggingService.warn('Failed to get verification data - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      // Format the verification data and generate presigned URLs for paths
      const verificationData = await Promise.all(loan.verifications.map(async verification => {
        const downloadUrls = await Promise.all(
          (verification.paths || []).map(async path => {
            try {
              return await this.s3Service.generatePresignedDownloadUrl(path);
            } catch (error) {
              await this.loggingService.error('Failed to generate presigned URL', {
                path,
                error: error.message
              });
              return null;
            }
          })
        );

        return {
          id: verification.id,
          type: verification.type,
          status: verification.status,
          verificationData: verification.verificationData,
          paths: verification.paths,
          downloadUrls: downloadUrls.filter(url => url !== null),
          fieldExecutive: verification.fieldExecutive,
          createdAt: verification.createdAt,
          updatedAt: verification.updatedAt
        };
      }));

      await this.loggingService.info('Verification data retrieved successfully', {
        loanId,
        verificationCount: verificationData.length
      });

      return {
        loanId: loan.id,
        applicationNumber: loan.applicationNumber,
        applicantName: loan.applicantName,
        verifications: verificationData,
        verificationReport: loan.verificationReport
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error('Failed to get verification data', {
        loanId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async createLoans(data: CreateLoanDto[]) {
    try {
      const results = {
        successful: [],
        failed: [],
        totalProcessed: data.length,
        successfulCount: 0,
        failedCount: 0
      };

      // Process each loan creation
      for (const loanData of data) {
        try {
          const loan = await this.createLoan(loanData);
          results.successful.push({
            loanId: loan.id,
            applicationNumber: loan.applicationNumber,
            status: 'success'
          });
          results.successfulCount++;
        } catch (error) {
          results.failed.push({
            data: loanData,
            error: error.message
          });
          results.failedCount++;
        }
      }

      await this.loggingService.info('Bulk loan creation completed', {
        totalProcessed: results.totalProcessed,
        successful: results.successfulCount,
        failed: results.failedCount
      });

      return results;
    } catch (error) {
      await this.loggingService.error('Failed to create loans in bulk', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async editLoan(loanId: number, editLoanDto: EditLoanDto) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
      });

      if (!loan) {
        await this.loggingService.warn('Loan edit failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      const updatedLoan = await this.prisma.loan.update({
        where: { id: loanId },
        data: {
          ...editLoanDto,
          updatedAt: new Date(),
        },
      });

      await this.loggingService.info('Loan updated successfully', {
        loanId,
        updatedFields: Object.keys(editLoanDto),
      });

      return updatedLoan;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error('Failed to edit loan', {
        loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async editVerificationData(
    loanId: number,
    verificationType: VerificationType,
    editVerificationDto: EditVerificationDto,
  ) {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: {
          loanId,
          type: verificationType,
        },
      });

      if (!verification) {
        await this.loggingService.warn('Verification edit failed - Verification not found', {
          loanId,
          verificationType,
        });
        throw new NotFoundException('Verification not found');
      }

      const updatedVerification = await this.prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          ...editVerificationDto,
          updatedAt: new Date(),
        },
      });

      await this.loggingService.info('Verification data updated successfully', {
        loanId,
        verificationType,
        updatedFields: Object.keys(editVerificationDto),
      });

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error('Failed to edit verification data', {
        loanId,
        verificationType,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
} 