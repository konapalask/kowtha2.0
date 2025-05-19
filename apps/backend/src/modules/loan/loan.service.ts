import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, LoanStatus, VerificationType, VerificationStatus } from '@prisma/client';
import { LoggingService } from '../common/logging/logging.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import * as XLSX from 'xlsx';
import { Logger } from '@nestjs/common';
import * as htmlPdf from 'html-pdf-node';
import PDFDocument = require('pdfkit');
import * as fs from 'fs';
import * as path from 'path';
import { EditLoanDto } from './dto/edit-loan.dto';
import { EditVerificationDto } from './dto/edit-verification.dto';
import { S3Service } from '../common/s3utils/s3.service';

// Workaround: use union type for VerificationType
// TODO: Replace with import from @prisma/client if/when available
// type VerificationType = 'PermanentAddress' | 'CurrentAddress' | 'Work';

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
      // Fetch only necessary loan details
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
              fieldExecutive: { select: { name: true } }
            }
          },
          verificationReport: { select: { remarks: true, verificationDate: true } },
          documents: { select: { type: true, url: true } }
        }
      });

      if (!loan) {
        throw new NotFoundException('Loan not found');
      }

      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #2c3e50;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #2c3e50;
              margin: 0;
              font-size: 24px;
            }
            .header p {
              color: #7f8c8d;
              margin: 10px 0 0;
            }
            .section {
              margin-bottom: 30px;
              background: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .section-title {
              color: #2c3e50;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eee;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #f8f9fa;
              color: #2c3e50;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .status {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 3px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-pending { background-color: #ffeeba; color: #856404; }
            .status-completed { background-color: #d4edda; color: #155724; }
            .status-rejected { background-color: #f8d7da; color: #721c24; }
            .document-list {
              list-style: none;
              padding: 0;
            }
            .document-list li {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .document-list li:last-child {
              border-bottom: none;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #7f8c8d;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Loan Application Details</h1>
            <p>Application Number: ${loan.applicationNumber}</p>
          </div>

          <div class="section">
            <div class="section-title">Applicant Information</div>
            <table>
              <tr>
                <th>Name</th>
                <td>${loan.applicantName}</td>
              </tr>
              <tr>
                <th>Mobile</th>
                <td>${loan.applicantMobile}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>${loan.applicantAddress}</td>
              </tr>
              <tr>
                <th>Loan Type</th>
                <td>${loan.loanType}</td>
              </tr>
              <tr>
                <th>Bank Name</th>
                <td>${loan.bankName}</td>
              </tr>
              <tr>
                <th>Loan Amount</th>
                <td>₹${loan.loanAmount}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td><span class="status status-${loan.status.toLowerCase()}">${loan.status}</span></td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Office & Executive Details</div>
            <table>
              <tr>
                <th>Office</th>
                <td>${loan.office?.name || 'N/A'}</td>
              </tr>
              <tr>
                <th>Operations Executive</th>
                <td>${loan.operationsExecutive?.name || 'N/A'}</td>
              </tr>
            </table>
          </div>

          ${loan.verifications.length > 0 ? `
            <div class="section">
              <div class="section-title">Verification Details</div>
              <table>
                <tr>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Field Executive</th>
                  <th>Completed Date</th>
                </tr>
                ${loan.verifications.map(v => `
                  <tr>
                    <td>${v.type}</td>
                    <td><span class="status status-${v.status.toLowerCase()}">${v.status}</span></td>
                    <td>${v.fieldExecutive?.name || 'N/A'}</td>
                    <td>${v.updatedAt ? new Date(v.updatedAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          ` : ''}

          ${loan.verificationReport ? `
            <div class="section">
              <div class="section-title">Verification Report</div>
              <table>
                <tr>
                  <th>Remarks</th>
                  <td>${loan.verificationReport.remarks || 'No remarks'}</td>
                </tr>
                <tr>
                  <th>Verification Date</th>
                  <td>${new Date(loan.verificationReport.verificationDate).toLocaleDateString()}</td>
                </tr>
              </table>
            </div>
          ` : ''}

          ${loan.documents.length > 0 ? `
            <div class="section">
              <div class="section-title">Supporting Documents</div>
              <ul class="document-list">
                ${loan.documents.map(doc => `
                  <li>${doc.type}: ${doc.url}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>
      `;

      // Generate PDF
      const options = {
        format: 'A4',
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        printBackground: true,
        preferCSSPageSize: true
      };

      const file = { content: htmlTemplate };
      const pdfBuffer = await htmlPdf.generatePdf(file, options);

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