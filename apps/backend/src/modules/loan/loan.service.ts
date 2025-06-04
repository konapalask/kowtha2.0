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
    category: string;
    applicantName: string;
    categoryOther: string;
    verificationType: string;
    applicationNumber: string;
    applicantMaritalStatus: string;
    educationQualification: string;
    applicantMaritalStatusOther: string;
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
    mobileNumber: string;
  };
  addressVerification?: {
    address: string;
    addressType: string;
    previousCity: string;
    addressCategory: string;
    reasonForChange: string;
    addressSubCategory: string;
    addressDetails: string;
    geoTag: string;
    numberOfYearsAtCurrentCity: string;
    numberOfYearsAtPreviousCity: string;
    numberOfYearsAtCurrentResidence: string;
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
    s3ImageUrl: string;
  }>;
}


interface WorkVerificationData {
    basicDetails?: {
      tenure: string;
      bankName: string;
      panNumber: string;
      loanAmount: string;
      aadharNumber: string;
      applicantName: string;
      purposeOfLoan: string;
      qualification: string;
      prospectNumber: string;
    };
    existingLoans?: {
      loans: Array<{
        emi: string;
        tenure: string;
        purpose: string;
        bankName: string;
        loanAmount: string;
      }>;
    };
    pastEmployment?: {
      employments: Array<{
        toDate: string;
        fromDate: string;
        designation: string;
        employerName: string;
        contactPersonName: string;
        reasonForMovement: string;
        contactPersonNumber: string;
      }>;
    };
    employmentDetails?: {
      netSalary: string;
      salaryMode: string;
      companySize: string;
      designation: string;
      grossSalary: string;
      employerType: string;
      idCardNumber: string;
      officeAddress: string;
      officeLocality: string;
      natureOfService: string;
      currentOfficeName: string;
      yearsInCurrentJob: string;
      totalWorkExperience: string;
      natureOfServiceOther: string;
    };
    colleagueReferences?: {
      references: Array<{
        name: string;
        address: string;
        yearsKnown: string;
        designation: string;
        emailAddress: string;
        contactNumber: string;
      }>;
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
      pincode: string;
      latitude: string;
      locality: string;
      longitude: string;
      timestamp: string;
      s3ImageUrl: string;
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
          applicantAddress1: data.applicantAddress1,
          applicantAddress2: data.applicantAddress2,
          applicantType: data.applicantType,
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
            VerificationType.AddressOne,
            VerificationType.AddressTwo,
            VerificationType.Work,
            VerificationType.Business,
          ];

          // Create verifications for each type
          await Promise.all(
            verificationTypes.map((type) =>
              prisma.verification.create({
                data: {
                  loan: { connect: { id: loan.id } },
                  type,
                  addressType: type === 'Work' ? 'PermanentAddress' : 'CurrentAddress',
                  fieldExecutive: { connect: { id: data.fieldExecutiveId } },
                  status: 'Pending',
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
            applicantAddress1: row['ADDRESS LINE 1'] || null,
            applicantAddress2: row['ADDRESS LINE 2'] || null,
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
          if (!loanData.applicantName || !loanData.applicantMobile) {
            throw new Error('Missing required fields: Applicant Name or Contact Number');
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
    fieldExecutiveId: number,
    address?: string,
    verifierId?: number
  ) {
    try {
      const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
      if (!loan) {
        await this.loggingService.warn('Verification assignment failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      // If field executive is provided, address is mandatory
      if (fieldExecutiveId && !address) {
        throw new BadRequestException('Address is required when assigning a field executive');
      }

      // Start a transaction to ensure all operations succeed or fail together
      return await this.prisma.$transaction(async (prisma) => {
        // Update loan with verifier if provided
        if (verifierId) {
          await prisma.loan.update({
            where: { id: loanId },
            data: { verifierId }
          });
        }

        const verification = await prisma.verification.upsert({
          where: {
            loanId_type: {
              loanId,
              type: verificationType,
            },
          },
          update: {
            fieldExecutiveId,
            status: 'Pending',
            applicantAddress: address || null,
          },
          create: {
            loan: { connect: { id: loan.id } },
            type: verificationType,
            addressType: verificationType === 'Work' ? 'PermanentAddress' : 'CurrentAddress',
            fieldExecutive: { connect: { id: fieldExecutiveId } },
            status: 'Pending',
            applicantAddress: address || null,
          },
        });

        const loanStatusChange = await prisma.loan.update({
          where: { id: loanId },
          data: { status: 'Assigned' },
        });

        await this.loggingService.info('Verification assigned successfully', {
          loanId,
          verificationType,
          fieldExecutiveId,
          hasAddress: !!address,
          verifierId,
          verificationId: verification.id
        });

        return verification;
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
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
          operationsExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
              role: true
            }
          },
          verifier: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
              role: true
            }
          },
          verificationReport: true,
          verifications: {
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                  role: true
                }
              }
            }
          }
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
          operationsExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
              role: true
            }
          },
          verificationReport: true,
          verifications: {
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                  role: true
                }
              }
            }
          }
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
          operationsExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
              role: true
            }
          },
          verificationReport: true,
          verifications: {
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                  role: true
                }
              }
            }
          }
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
          operationsExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
              role: true
            }
          },
          verifier: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
              role: true
            }
          },
          verificationReport: true,
          verifications: {
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                  role: true
                }
              }
            }
          }
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
    address?: string,
    verifierId?: number,
  ) {
    try {
      const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
      if (!loan) {
        await this.loggingService.warn('Verification assignment update failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      // If field executive is provided, address is mandatory
      if (fieldExecutiveId && !address) {
        throw new BadRequestException('Address is required when assigning a field executive');
      }

      // If no updates provided, return current verification
      if (!verificationType && !fieldExecutiveId && !verifierId) {
        const verification = await this.prisma.verification.findFirst({
          where: { loanId }
        });
        return verification;
      }

      // Start a transaction to ensure all operations succeed or fail together
      return await this.prisma.$transaction(async (prisma) => {
        // Update loan with verifier if provided
        if (verifierId) {
          await prisma.loan.update({
            where: { id: loanId },
            data: { verifierId }
          });
        }

        // Update verification
        const verification = await prisma.verification.update({
          where: {
            loanId_type: {
              loanId,
              type: verificationType,
            },
          },
          data: {
            ...(fieldExecutiveId && { fieldExecutiveId }),
            ...(address && { applicantAddress: address }),
            status: 'Pending', // Reset status when assignment is updated
          },
        });

        await this.loggingService.info('Verification assignment updated successfully', {
          loanId,
          verificationType,
          fieldExecutiveId,
          hasAddress: !!address,
          verifierId,
          verificationId: verification.id
        });

        return verification;
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
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

      // Get the verification data for each type
      const permanentAddressVerification = loan.verifications.find(
        v => v.type === 'AddressOne'
      )?.verificationData as VerificationData || {};

      const currentAddressVerification = loan.verifications.find(
        v => v.type === 'AddressTwo'
      )?.verificationData as VerificationData || {};

      const workVerification = loan.verifications.find(
        v => v.type === 'Work'
      )?.verificationData as WorkVerificationData || {};

      const imagePath = path.resolve(process.env.SIGNATURE_PATH || '/home/ubuntu/kowtha/signature_kowtha.jpeg');
      
      const imageBase64 = fs.readFileSync(imagePath, 'base64');
      const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

      // Get all uploaded items from all verifications
      const allUploadedItems = loan.verifications.reduce((acc, verification) => {
        const verificationData = verification.verificationData as VerificationData;
        if (verificationData?.uploadedItems) {
          return [...acc, ...verificationData.uploadedItems];
        }
        return acc;
      }, []);

      // Generate presigned URLs for all images
      const imageUrls = await Promise.all(
        allUploadedItems.map(async (item) => {
          try {
            return await this.s3Service.generatePresignedDownloadUrl(item.s3ImageUrl);
          } catch (error) {
            await this.loggingService.error('Failed to generate presigned URL for image', {
              s3ImageUrl: item.s3ImageUrl,
              error: error.message
            });
            return null;
          }
        })
      );

      // Filter out any failed URL generations
      const validImageUrls = imageUrls.filter(url => url !== null);

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
              position: relative;
              min-height: 60vh;
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
            .logo {
              display: block;
              width: 220px;
              filter: contrast(200%) brightness(80%) saturate(150%);
              background: white;
              image-rendering: auto;
              margin-left: 0; /* aligns to left */
              margin-bottom: 20px;
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
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100%;
              text-align: center;
              color: #7f8c8d;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding: 8px 0 6px 0;
              background-color: white; /* Optional, helps avoid overlay */
            }
            .logo {
              margin-top: 24px;
              text-align: center;
              opacity: 0.15;
            }
            .var-value {
              font-weight: bold;
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
                  <td class="branch-label">Application Number</td>
                  <td class="branch-value">${loan.applicationNumber}</td>
                </tr>
              </table>
            </div>
            <table class="section-table">
              <tr><td colspan="6" class="section-header">Basic Details</td></tr>
              <tr>
                <th>Name of Applicant</th>
                <td colspan="5"><span class="var-value">${permanentAddressVerification.basicDetails?.applicantName || ''}</span></td>
              </tr>
              <tr>
                <th>PAN Number</th>
                <td colspan="5"><span class="var-value">${permanentAddressVerification.applicantDetails?.pan || 'BQBUU2345R'}</span></td>
              </tr>
              <tr>
                <th>Aadhar Number</th>
                <td colspan="5"><span class="var-value">${permanentAddressVerification.applicantDetails?.aadhar || '9801 7691 7654'}</span></td>
              </tr>
              <tr>
                <th>Residential Address</th>
                <td colspan="5"><span class="var-value">${permanentAddressVerification.addressVerification?.addressDetails || '1-1-1, Gandhi Nagar, Vijayawada'}</span></td>
              </tr>
              <tr>
                <th>Marital Status</th>
                <td colspan="2"><span class="var-value">${permanentAddressVerification.basicDetails?.applicantMaritalStatus || ''}</span></td>
                <th>Educational Qualification</th>
                <td colspan="2"><span class="var-value">${permanentAddressVerification.basicDetails?.educationQualification || ''}</span></td>
              </tr>
              <tr>
                <th>Category</th>
                <td colspan="2"><span class="var-value">${permanentAddressVerification.basicDetails?.category || ''}</span></td>
                <th>Number of Dependents</th>
                <td colspan="2"><span class="var-value">${permanentAddressVerification.familyEmploymentDetails?.dependents || ''}</span></td>
              </tr>
              <tr>
                <th>Number of years in Current Residence</th>
                <td colspan="2"><span class="var-value">${permanentAddressVerification.addressVerification?.numberOfYearsAtCurrentResidence || ''}</span></td>
                <th>Current residence house size</th>
                <td colspan="2"><span class="var-value">${permanentAddressVerification.residenceDetails?.houseArea || ''}</span></td>
              </tr>
              <tr>
                <th>Number of Years in Current City</th>
                <td colspan="2"><span class="var-value">${permanentAddressVerification.addressVerification?.numberOfYearsAtCurrentCity || 'NA'}</span></td>
                <th>Number of Years stayed in the Current City</th>
                <td colspan="2"><span class="var-value">${permanentAddressVerification.addressVerification?.numberOfYearsAtPreviousCity || 'NA'}</span></td>
              </tr>
              <tr>
                <th>If Less than 1 Year, then Previous Address</th>
                <td colspan="5"><span class="var-value">${permanentAddressVerification.addressVerification?.previousCity || ''}</span></td>
              </tr> 
              <tr>
                <th>If Less than 3 Years in current city, then mention Reason for Change</th>
                <td colspan="5"><span class="var-value">${permanentAddressVerification.addressVerification?.reasonForChange || 'NA'}</span></td>
              </tr>
              <tr>
                <th>Reason for Change</th>
                <td colspan="5"><span class="var-value">${permanentAddressVerification.addressVerification?.reasonForChange || 'NA'}</span></td>
              </tr>
              <tr>
                <th>Parents Staying with?</th>
                <td colspan="5"><span class="var-value">${permanentAddressVerification.addressVerification?.reasonForChange || ''}</span></td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
            Generated on ${new Date().toLocaleString()}
          </div>

          <div style="page-break-before: always;"></div>

          <div class="align-wrapper">
            <table class="section-table">
            <tr><td colspan="6" class="section-header">Employment Details</td></tr>
              <tr>
                <th>Name of the Current Employer</th>
                <td colspan="5"><span class="var-value">${workVerification.employmentDetails?.currentOfficeName || ''}</span></td>
              </tr>
              <tr>
                <th>Curent Office Address</th>
                <td colspan="5"><span class="var-value">${workVerification.employmentDetails?.officeAddress || ''}</span></td>
              </tr>
              <tr>
                <th>Number of years in Current Job</th>
                <td colspan="5"><span class="var-value">${workVerification.employmentDetails?.yearsInCurrentJob || ''}</span></td>
              </tr>
              <tr>
                <th>Total Work Experience</th>
                <td colspan="5"><span class="var-value">${workVerification.employmentDetails?.totalWorkExperience || ''}</span></td>
              </tr>
              <tr>
                <th>Office Email ID</th>
                <td colspan="5"><span class="var-value">${''}</span></td>
              </tr>
              <tr>
                <th>Office Phone Number/Landline Number</th>
                <td colspan="5"><span class="var-value">${''}</span></td>
              </tr>
              <tr>
                <th>Number of Employees in the Company</th>
                <td colspan="5"><span class="var-value">${workVerification.employmentDetails?.companySize || ''}</span></td>
              </tr>
              <tr>
                <th>Employee ID(Copy/Photograph Mandatory)</th>
                <td colspan="2"><span class="var-value">${workVerification.employmentDetails?.idCardNumber || ''}</span></td>
                <th>Designation</th>
                <td colspan="2"><span class="var-value">${workVerification.employmentDetails?.designation || ''}</span></td>
              </tr>
              <tr>
                <th>Mode of Salary</th>
                <td colspan="5"><span class="var-value">${workVerification.employmentDetails?.salaryMode || ''}</span></td>
              </tr>
              <tr>
                <th>Type of Employer</th>
                <td colspan="5"><span class="var-value">${workVerification.employmentDetails?.employerType || ''}</span></td>
              </tr>
              <tr>
                <th>Type of Industry</th>
                <td colspan="5"><span class="var-value">${workVerification.employmentDetails?.natureOfService || ''}</span></td>
              </tr>
              <tr>
                <th>Type of Office Locality</th>
                <td colspan="5"><span class="var-value">${workVerification.employmentDetails?.officeLocality || ''}</span></td>
              </tr>
            <tr><td colspan="6" class="section-header">Financial Details</td></tr>
              <tr>
                <th>Monthly Gross Salary</th>
                <td colspan="2"><span class="var-value">${workVerification.employmentDetails?.grossSalary || ''}</span></td>
                <th>Monthly Net Salary</th>
                <td colspan="2"><span class="var-value">${workVerification.employmentDetails?.netSalary || ''}</span></td>
              </tr>
              
            </table>
          </div>

          <div class="footer">
            <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
            Generated on ${new Date().toLocaleString()}
          </div>

          <div style="page-break-before: always;"></div>

          <div class="align-wrapper">
            <table class="section-table">
              <tr><td colspan="6" class="section-header">Loan Details</td></tr>
              <tr>
                <th>Purpose of Loan</th>
                <td colspan="5"><span class="var-value">${workVerification.basicDetails?.purposeOfLoan || 'Home Loan'}</span></td>
              </tr>
              <tr>
                <th>Minimum Loan Amount Required</th>
                <td colspan="5"><span class="var-value">${workVerification.basicDetails?.loanAmount || '700000'}</span></td>
              </tr>
              <tr><td colspan="6" class="section-header">Exisiting Loan Details</td></tr>
              <tr>
                <th>Bank Name</th>
                <td colspan="5"><span class="var-value">${workVerification.existingLoans?.loans[0]?.bankName || ''}</span></td>
              </tr>
              <tr>
                <th>EMI</th>
                <td colspan="5"><span class="var-value">${workVerification.existingLoans?.loans[0]?.emi || ''}</span></td>
              </tr>
              <tr>
                <th>Tenure</th>
                <td colspan="5"><span class="var-value">${workVerification.existingLoans?.loans[0]?.tenure || ''}</span></td>
              </tr>
              <tr>
                <th>Purpose</th>
                <td colspan="5"><span class="var-value">${workVerification.existingLoans?.loans[0]?.purpose || ''}</span></td>
              </tr>
              
            </table>
          </div>

          <canvas id="logoCanvas" width="250" height="140"></canvas>

          <div class="footer">
            <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
            Generated on ${new Date().toLocaleString()}
          </div>
           <script>
              const canvas = document.getElementById('logoCanvas');
              const ctx = canvas.getContext('2d');
              const img = new Image();
              img.onload = function () {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                const offsetX = 20;
                ctx.drawImage(img, offsetX, 0, canvas.width, canvas.height);
              };
              img.src = '${imageDataUri}';
          </script>

          <div style="page-break-before: always;"></div>

          <div class="align-wrapper">
            <table class="section-table">
              <tr><td colspan="6" class="section-header">Uploaded Documents and Images</td></tr>
              <tr>
                <td colspan="6">
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 20px;">
                    ${validImageUrls.map(url => `
                      <div style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                        <img src="${url}" style="max-width: 100%; height: auto; margin-bottom: 10px;" />
                        <div style="font-size: 12px; color: #666;">Uploaded on: ${new Date().toLocaleString()}</div>
                      </div>
                    `).join('')}
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
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
          addressType: verification.addressType,
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

  async generateVerificationPDF(loanId: number, verificationType: VerificationType): Promise<Buffer> {
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
            where: { type: verificationType },
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
      
      const verification = loan.verifications[0];
      if (!verification) {
        throw new NotFoundException(`Verification of type ${verificationType} not found`);
      }

      // Get the verification data based on type
      let verificationData: VerificationData | WorkVerificationData = {};
      if (verificationType === 'Work') {
        verificationData = verification.verificationData as WorkVerificationData || {};
      } else {
        verificationData = verification.verificationData as VerificationData || {};
      }
      console.log(verificationData);

      const imagePath = path.resolve(process.env.SIGNATURE_PATH || '/home/ubuntu/kowtha/signature_kowtha.jpeg');
      const imageBase64 = fs.readFileSync(imagePath, 'base64');
      const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

      // Get uploaded items for this verification only
      const uploadedItems = verificationData?.uploadedItems || [];

      // Generate presigned URLs for images
      const imageUrls = await Promise.all(
        uploadedItems.map(async (item) => {
          try {
            return await this.s3Service.generatePresignedDownloadUrl(item.s3ImageUrl);
          } catch (error) {
            await this.loggingService.error('Failed to generate presigned URL for image', {
              s3ImageUrl: item.s3ImageUrl,
              error: error.message
            });
            return null;
          }
        })
      );

      // Filter out any failed URL generations
      const validImageUrls = imageUrls.filter(url => url !== null);

      // Generate HTML template based on verification type
      let htmlTemplate = this.generateBaseHTMLTemplate(loan);

      // Add verification-specific content
      if (verificationType === 'Work') {
        htmlTemplate += this.generateWorkVerificationContent(verificationData as WorkVerificationData, validImageUrls, imageDataUri);
      } else {
        htmlTemplate += this.generateAddressVerificationContent(verificationData as VerificationData, validImageUrls, imageDataUri);
      }

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

      await this.loggingService.info('Verification PDF generated successfully', {
        loanId,
        verificationType,
        applicationNumber: loan.applicationNumber,
      });

      return pdfBuffer;
    } catch (error) {
      await this.loggingService.error('Failed to generate verification PDF', {
        loanId,
        verificationType,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private generateBaseHTMLTemplate(loan: any): string {
    return `
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
              position: relative;
              min-height: 60vh;
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
            .logo {
              display: block;
              width: 220px;
              filter: contrast(200%) brightness(80%) saturate(150%);
              background: white;
              image-rendering: auto;
              margin-left: 0; /* aligns to left */
              margin-bottom: 20px;
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
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100%;
              text-align: center;
              color: #7f8c8d;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding: 8px 0 6px 0;
              background-color: white; /* Optional, helps avoid overlay */
            }
            .logo {
              margin-top: 24px;
              text-align: center;
              opacity: 0.15;
            }
            .var-value {
              font-weight: bold;
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
            Mail ID: kowthaboi@gmail.com
          </div>
        </div>

        <div class="report-title">DUE DILIGENCE REPORT</div>

        <div class="align-wrapper">
          <div class="branch-box">
            <table class="branch-table">
              <tr>
                <td class="branch-label">Application Number</td>
                <td class="branch-value">${loan.applicationNumber}</td>
              </tr>
            </table>
          </div>
        </div>
    `;
  }

  private generateWorkVerificationContent(verificationData: WorkVerificationData, imageUrls: string[], imageDataUri: string): string {
    // Use standardized list of remarks
    const defaultRemarks = [
      'Applicant is joined as a Project Manager at "M/s. Tekis Hub Consulting Services Pvt. Ltd" since Jan 2024',
      'Applicant designation is "Project Manager"',
      'Applicant receives present Net Salary Rs. 75,529/- Per month though Bank',
      'Applicant submitted the Previous company pay slips and present company pay slip and offer letter',
      'Applicant having a 07 years of experience in his field',
      'Co-applicant Mr.Padira srinivasa chary (Father to Applicant) Currtently residing In rented house Rs.2,000/- Per Month with his family in D.no 8-196/2, Chichala Donka, Piduguralla – 522413',
      'Co-applicant doing wood works and he earns around Rs. 30,000/- per month',
      'Co-applicant gets the Contracts from out and gets the work',
      'Co-aplicant gets Income in the Form of cash',
      'Co-applicant submitted Gas and Current bill For Residential Proof',
      'Applicant availing this loan for house Constriction',
      'Neighbor check done. And we got positive feedback about the applicant'
    ];

    // Use provided remarks or default list
    const remarks = verificationData.finalObservations?.remarks 
      ? verificationData.finalObservations.remarks.split('.').filter(point => point.trim()).map(point => point.trim())
      : defaultRemarks;
    
    const remarksHtml = remarks.map(point => `<li>${point}</li>`).join('');

    return `
      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Employment Details</td></tr>
          <tr>
            <th>Name of the Current Employer</th>
            <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.currentOfficeName || ''}</span></td>
          </tr>
          <tr>
                <th>Name of the Current Employer</th>
                <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.currentOfficeName || ''}</span></td>
              </tr>
              <tr>
                <th>Curent Office Address</th>
                <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.officeAddress || ''}</span></td>
              </tr>
              <tr>
                <th>Number of years in Current Job</th>
                <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.yearsInCurrentJob || ''}</span></td>
              </tr>
              <tr>
                <th>Total Work Experience</th>
                <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.totalWorkExperience || ''}</span></td>
              </tr>
              <tr>
                <th>Office Email ID</th>
                <td colspan="5"><span class="var-value">${''}</span></td>
              </tr>
              <tr>
                <th>Office Phone Number/Landline Number</th>
                <td colspan="5"><span class="var-value">${''}</span></td>
              </tr>
              <tr>
                <th>Number of Employees in the Company</th>
                <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.companySize || ''}</span></td>
              </tr>
              <tr>
                <th>Employee ID(Copy/Photograph Mandatory)</th>
                <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.idCardNumber || ''}</span></td>
                <th>Designation</th>
                <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.designation || ''}</span></td>
              </tr>
              <tr>
                <th>Mode of Salary</th>
                <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.salaryMode || ''}</span></td>
              </tr>
              <tr>
                <th>Type of Employer</th>
                <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.employerType || ''}</span></td>
              </tr>
              <tr>
                <th>Type of Industry</th>
                <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.natureOfService || ''}</span></td>
              </tr>
              <tr>
                <th>Type of Office Locality</th>
                <td colspan="5"><span class="var-value">${verificationData.employmentDetails?.officeLocality || ''}</span></td>
              </tr>
            <tr><td colspan="6" class="section-header">Financial Details</td></tr>
              <tr>
                <th>Monthly Gross Salary</th>
                <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.grossSalary || ''}</span></td>
                <th>Monthly Net Salary</th>
                <td colspan="2"><span class="var-value">${verificationData.employmentDetails?.netSalary || ''}</span></td>
              </tr>
        </table>
      </div>
      <div class="footer">
        <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
        Generated on ${new Date().toLocaleString()}
      </div>

      <div style="page-break-before: always;"></div>
      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="7" class="section-header">Past Employment History</td></tr>
          <tr>
            <th>Employer Name</th>
            <th>Designation</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Contact Person</th>
            <th>Contact Number</th>
            <th>Reason for Movement</th>
          </tr>
          ${verificationData.pastEmployment?.employments?.map(employment => `
            <tr>
              <td><span class="var-value">${employment.employerName || ''}</span></td>
              <td><span class="var-value">${employment.designation || ''}</span></td>
              <td><span class="var-value">${employment.fromDate || ''}</span></td>
              <td><span class="var-value">${employment.toDate || ''}</span></td>
              <td><span class="var-value">${employment.contactPersonName || ''}</span></td>
              <td><span class="var-value">${employment.contactPersonNumber || ''}</span></td>
              <td><span class="var-value">${employment.reasonForMovement || ''}</span></td>
            </tr>
          `).join('') || '<tr><td colspan="7" style="text-align: center;">No past employment history found</td></tr>'}
        </table>
      </div>

      

      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Colleague References</td></tr>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Contact Number</th>
            <th>Email Address</th>
            <th>Address</th>
            <th>Years Known</th>
          </tr>
          ${verificationData.colleagueReferences?.references?.map(reference => `
            <tr>
              <td><span class="var-value">${reference.name || ''}</span></td>
              <td><span class="var-value">${reference.designation || ''}</span></td>
              <td><span class="var-value">${reference.contactNumber || ''}</span></td>
              <td><span class="var-value">${reference.emailAddress || ''}</span></td>
              <td><span class="var-value">${reference.address || ''}</span></td>
              <td><span class="var-value">${reference.yearsKnown || ''}</span></td>
            </tr>
          `).join('') || '<tr><td colspan="6" style="text-align: center;">No colleague references found</td></tr>'}
        </table>
      </div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Existing Loans</td></tr>
          <tr>
            <th>Bank Name</th>
            <th>Loan Amount</th>
            <th>EMI</th>
            <th>Tenure</th>
            <th>Purpose</th>
          </tr>
          ${verificationData.existingLoans?.loans?.map(loan => `
            <tr>
              <td><span class="var-value">${loan.bankName || ''}</span></td>
              <td><span class="var-value">${loan.loanAmount || ''}</span></td>
              <td><span class="var-value">${loan.emi || ''}</span></td>
              <td><span class="var-value">${loan.tenure || ''}</span></td>
              <td><span class="var-value">${loan.purpose || ''}</span></td>
            </tr>
          `).join('') || '<tr><td colspan="5" style="text-align: center;">No existing loans found</td></tr>'}
        </table>
      </div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Final Remarks</td></tr>
          <tr>
            <th>Overall Status</th>
            <td colspan="5"><span class="var-value">${verificationData.finalObservations?.overallStatus || 'POSITIVE'}</span></td>
          </tr>
          <tr>
            <th>Cooperativeness</th>
            <td colspan="5"><span class="var-value">${verificationData.finalObservations?.cooperativeness || ''}</span></td>
          </tr>
          <tr>
            <th>Remarks</th>
            <td colspan="5">
              <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                ${remarksHtml}
              </ul>
            </td>
          </tr>
        </table>
      </div>

      <canvas id="logoCanvas" width="250" height="140"></canvas>

          <div class="footer">
            <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
            Generated on ${new Date().toLocaleString()}
          </div>
           <script>
              const canvas = document.getElementById('logoCanvas');
              const ctx = canvas.getContext('2d');
              const img = new Image();
              img.onload = function () {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                const offsetX = 20;
                ctx.drawImage(img, offsetX, 0, canvas.width, canvas.height);
              };
              img.src = '${imageDataUri}';
          </script>

      <div style="page-break-before: always;"></div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Uploaded Documents and Images</td></tr>
          <tr>
            <td colspan="6">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 20px;">
                ${imageUrls.map(url => `
                  <div style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                    <img src="${url}" style="max-width: 100%; height: auto; margin-bottom: 10px;" />
                    <div style="font-size: 12px; color: #666;">Uploaded on: ${new Date().toLocaleString()}</div>
                  </div>
                `).join('')}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="footer">
        <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
        Generated on ${new Date().toLocaleString()}
      </div>
    `;
  }

  private generateAddressVerificationContent(verificationData: VerificationData, imageUrls: string[], imageDataUri: string): string {
    // Use standardized list of remarks
    const defaultRemarks = [
      'Applicant is joined as a Project Manager at "M/s. Tekis Hub Consulting Services Pvt. Ltd" since Jan 2024',
      'Applicant designation is "Project Manager"',
      'Applicant receives present Net Salary Rs. 75,529/- Per month though Bank',
      'Applicant submitted the Previous company pay slips and present company pay slip and offer letter',
      'Applicant having a 07 years of experience in his field',
      'Co-applicant Mr.Padira srinivasa chary (Father to Applicant) Currtently residing In rented house Rs.2,000/- Per Month with his family in D.no 8-196/2, Chichala Donka, Piduguralla – 522413',
      'Co-applicant doing wood works and he earns around Rs. 30,000/- per month',
      'Co-applicant gets the Contracts from out and gets the work',
      'Co-aplicant gets Income in the Form of cash',
      'Co-applicant submitted Gas and Current bill For Residential Proof',
      'Applicant availing this loan for house Constriction',
      'Neighbor check done. And we got positive feedback about the applicant'
    ];

    // Use provided remarks or default list
    const remarks = verificationData.finalObservations?.remarks 
      ? verificationData.finalObservations.remarks.split('.').filter(point => point.trim()).map(point => point.trim())
      : defaultRemarks;
    
    const remarksHtml = remarks.map(point => `<li>${point}</li>`).join('');

    return `
      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Address Verification Details</td></tr>
          <tr>
            <th>Address</th>
            <td colspan="5"><span class="var-value">${verificationData.addressVerification?.addressDetails || ''}</span></td>
          </tr>
          <tr>
                <th>Name of Applicant</th>
                <td colspan="5"><span class="var-value">${verificationData.basicDetails?.applicantName || ''}</span></td>
              </tr>
              <tr>
                <th>PAN Number</th>
                <td colspan="5"><span class="var-value">${verificationData.applicantDetails?.pan || 'BQBUU2345R'}</span></td>
              </tr>
              <tr>
                <th>Aadhar Number</th>
                <td colspan="5"><span class="var-value">${verificationData.applicantDetails?.aadhar || '9801 7691 7654'}</span></td>
              </tr>
              <tr>
                <th>Residential Address</th>
                <td colspan="5"><span class="var-value">${verificationData.addressVerification?.addressDetails || '1-1-1, Gandhi Nagar, Vijayawada'}</span></td>
              </tr>
              <tr>
                <th>Marital Status</th>
                <td colspan="2"><span class="var-value">${verificationData.basicDetails?.applicantMaritalStatus || ''}</span></td>
                <th>Educational Qualification</th>
                <td colspan="2"><span class="var-value">${verificationData.basicDetails?.educationQualification || ''}</span></td>
              </tr>
              <tr>
                <th>Category</th>
                <td colspan="2"><span class="var-value">${verificationData.basicDetails?.category || ''}</span></td>
                <th>Number of Dependents</th>
                <td colspan="2"><span class="var-value">${verificationData.familyEmploymentDetails?.dependents || ''}</span></td>
              </tr>
              <tr>
                <th>Number of years in Current Residence</th>
                <td colspan="2"><span class="var-value">${verificationData.addressVerification?.numberOfYearsAtCurrentResidence || ''}</span></td>
                <th>Current residence house size</th>
                <td colspan="2"><span class="var-value">${verificationData.residenceDetails?.houseArea || ''}</span></td>
              </tr>
              <tr>
                <th>Number of Years in Current City</th>
                <td colspan="2"><span class="var-value">${verificationData.addressVerification?.numberOfYearsAtCurrentCity || 'NA'}</span></td>
                <th>Number of Years stayed in the Current City</th>
                <td colspan="2"><span class="var-value">${verificationData.addressVerification?.numberOfYearsAtPreviousCity || 'NA'}</span></td>
              </tr>
              <tr>
                <th>If Less than 1 Year, then Previous Address</th>
                <td colspan="5"><span class="var-value">${verificationData.addressVerification?.previousCity || ''}</span></td>
              </tr> 
              <tr>
                <th>If Less than 3 Years in current city, then mention Reason for Change</th>
                <td colspan="5"><span class="var-value">${verificationData.addressVerification?.reasonForChange || 'NA'}</span></td>
              </tr>
              <tr>
                <th>Reason for Change</th>
                <td colspan="5"><span class="var-value">${verificationData.addressVerification?.reasonForChange || 'NA'}</span></td>
              </tr>
          <tr><td colspan="6" class="section-header">Third Party Check</td></tr>
              <tr>
                <th>Name</th>
                <td colspan="5"><span class="var-value">${verificationData.thirdPartyCheck?.tpcName || ''}</span></td>
              </tr>
              <tr>
                <th>Mobile Number</th>
                <td colspan="5"><span class="var-value">${verificationData.thirdPartyCheck?.mobileNumber || ''}</span></td>
              </tr>
              <tr>
                <th>Relationship</th>
                <td colspan="5"><span class="var-value">${verificationData.thirdPartyCheck?.relationship || ''}</span></td>
              </tr>
              <tr>
                <th>Feedback Status</th>
                <td colspan="5"><span class="var-value">${verificationData.thirdPartyCheck?.feedbackStatus || ''}</span></td>
              </tr>
              <tr>
                <th>Comments</th>
                <td colspan="5"><span class="var-value">${verificationData.thirdPartyCheck?.comments || ''}</span></td>
              </tr>          
        </table>
      </div>

      <div class="footer">
        <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
        Generated on ${new Date().toLocaleString()}
      </div>

      <div style="page-break-before: always;"></div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Residence Details</td></tr>
          <tr>
            <th>House Area</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.houseArea || ''}</span></td>
          </tr>
          <tr>
            <th>Rent Details</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.rentDetails || ''}</span></td>
          </tr>
          <tr>
            <th>Locality Type</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.localityType || ''}</span></td>
          </tr>
          <tr>
            <th>Accessibility</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.accessibility || ''}</span></td>
          </tr>
          <tr>
            <th>Residence Type</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.residenceType || ''}</span></td>
          </tr>
          <tr>
            <th>Residence Status</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.residenceStatus || ''}</span></td>
          </tr>
          <tr>
            <th>Location Category</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.localityType || ''}</span></td>
          </tr>
          <tr>
            <th>Name Plate Visible</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.nameplateVisible || ''}</span></td>
          </tr>
          <tr>
            <th>Standard of Living</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.standardOfLiving || ''}</span></td>
          </tr>
          <tr>
            <th>Construction Quality</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.constructionQuality || ''}</span></td>
          </tr>
          <tr>
            <th>Years at Current Address</th>
            <td colspan="5"><span class="var-value">${verificationData.residenceDetails?.yearsAtCurrentAddress || ''}</span></td>
          </tr>
          <tr><td colspan="6" class="section-header">Family Employment Details</td></tr>
          <tr>
            <th>Dependents</th>
            <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.dependents || ''}</span></td>
          </tr>
          <tr>
            <th>Assets Observed</th>
            <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.assetsObserved || ''}</span></td>
          </tr>
          <tr>
            <th>Earning Members</th>
            <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.earningMembers || ''}</span></td>
          </tr>
          <tr>
            <th>Is Spouse Working</th>
            <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.isSpouseWorking || ''}</span></td>
          </tr>
          <tr>
            <th>Spouse Employment Details</th>
            <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.spouseEmploymentDetails || 'NA'}</span></td>
          </tr>
          <tr>
            <th>Total Family Members</th>
            <td colspan="5"><span class="var-value">${verificationData.familyEmploymentDetails?.totalFamilyMembers || 'NA'}</span></td>
          </tr>      
        </table>
      </div>
      <div class="footer">
        <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
        Generated on ${new Date().toLocaleString()}
      </div>

      <div style="page-break-before: always;"></div>
      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Final Remarks</td></tr>
          <tr>
            <th>Overall Status</th>
            <td colspan="5"><span class="var-value">${verificationData.finalObservations?.overallStatus || 'POSITIVE'}</span></td>
          </tr>
          <tr>
            <th>Remarks</th>
            <td colspan="5">
              <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                ${remarksHtml}
              </ul>
            </td>
          </tr>
        </table>
      </div>

      <canvas id="logoCanvas" width="250" height="140"></canvas>

          <div class="footer">
            <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
            Generated on ${new Date().toLocaleString()}
          </div>
           <script>
              const canvas = document.getElementById('logoCanvas');
              const ctx = canvas.getContext('2d');
              const img = new Image();
              img.onload = function () {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                const offsetX = 20;
                ctx.drawImage(img, offsetX, 0, canvas.width, canvas.height);
              };
              img.src = '${imageDataUri}';
          </script>

      <div style="page-break-before: always;"></div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Uploaded Documents and Images</td></tr>
          <tr>
            <td colspan="6">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 20px;">
                ${imageUrls.map(url => `
                  <div style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                    <img src="${url}" style="max-width: 100%; height: auto; margin-bottom: 10px;" />
                    <div style="font-size: 12px; color: #666;">Uploaded on: ${new Date().toLocaleString()}</div>
                  </div>
                `).join('')}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="footer">
        <span style="color: #138808;">BOI</span><span style="color: #FF9933;">-AP</span><br>
        Generated on ${new Date().toLocaleString()}
      </div>
    `;
  }
} 