import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { Buffer } from 'buffer'; // Import the Buffer type
import { Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { GetLoansDto } from './dto/get-loans.dto';
import { EditLoanDto } from './dto/edit-loan.dto';
import { PrismaService } from '../../prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { S3Service } from '../common/s3utils/s3.service';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { EditVerificationDto } from './dto/edit-verification.dto';
import { LoggingService } from '../common/logging/logging.service';
import { FieldExecutiveAssignedDto } from './dto/field-executive-assigned.dto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, LoanStatus, VerificationType, VerificationStatus, 
            AddressType, UserRole, ApprovedStatus, LocationType } from '@prisma/client';
import { businessTemplate } from './templates/business.template';
import { BusinessVerificationData } from './templates/business.interface';
import { WorkVerificationData } from './templates/work.interface';
import { workTemplate } from './templates/work.template';
import { VerificationData } from './templates/address.interface';
import { addressTemplate } from './templates/address.template';



@Injectable()
export class LoanService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
    private logger: Logger,
    private s3Service: S3Service,
  ) {}

  async createLoan(data: CreateLoanDto, officeId: number) {
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
          office: { connect: { id: officeId } },
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
            applicantType: row['APPLICANT TYPE'] || 'Primary Applicant',
            applicantMobile: row['CONTACT NUMBER'].toString(),
            applicantAddress: row['FULL ADDRESS'],
            applicantAddress1: row['ADDRESS LINE 1'] || null,
            applicantAddress2: row['ADDRESS LINE 2'] || null,
            isAddressSame: row['IS_ADDRESS_SAME'] === 'YES' || false,
            applicationNumber: row['APPLICATION ID'],
            loanType: 'Personal', // Default to Personal if not specified
            bankName: 'Default Bank', // Default bank if not specified
            loanAmount: 100,
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

          const loan = await this.createLoan(loanData, officeId);
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
    verificationType?: VerificationType,
    fieldExecutiveId?: number,
    address?: string,
    verifierId?: number,
    locationType?: LocationType,
    businessName?: string
  ) {
    try {
      const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });

      if (!loan) {
        await this.loggingService.warn('Verification assignment failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      if (!fieldExecutiveId || !verifierId) {
        throw new BadRequestException('Field Executive ID or Verifier ID is required when assigning a field executive');
      }

      if (fieldExecutiveId && (!address || !verificationType)) {
        throw new BadRequestException('Address and Verification Type is required when assigning a field executive');
      }

      return await this.prisma.$transaction(async (prisma) => {
           const verification = await prisma.verification.create({
             data: {
              loan: { connect: { id: loan.id } },
              type: verificationType || 'AddressOne',
              verifier: { connect: { id: verifierId } },
              fieldExecutive: { connect: { id: fieldExecutiveId } },
              status: 'Pending',
              applicantAddress: address || null,
              locationType: locationType || null,
              businessName: businessName || null,
             }
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

  async verifyLoan(loanId: number, verifierId: number, status: LoanStatus, approvedStatus: ApprovedStatus, comments?: string) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
      });

      if (!loan) {
        await this.loggingService.warn('Loan verification failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      const updatedLoan = await this.prisma.loan.update({
        where: { id: loanId },
        data: {
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
      const office = await this.prisma.office.findUnique({
        where: { id: officeId }
      });

      if (!office) {
        throw new NotFoundException('Office not found');
      }

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
              },
              verifier: {
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

      await this.loggingService.info('Retrieved loans by office', {
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
      const fieldExecutive = await this.prisma.user.findUnique({
        where: { id: fieldExecutiveId }
      });

      if (!fieldExecutive) {
        throw new NotFoundException('Field executive not found');
      }

      const verifications = await this.prisma.verification.findMany({
        where: { fieldExecutiveId },
        include: {
          loan: {
            select: {
              id: true,
              applicationNumber: true,
              applicantName: true,
              loanAmount: true,
              status: true
            }
          }
        }
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
              },
              verifier: {
                select: {
                  id: true,
                  name: true,
                  mobile: true
                }
              }
            }
          }
        }
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

  async getLoansByVerifier(verifierId: number, role: UserRole) {
    try {
      const verifier = await this.prisma.user.findUnique({
        where: { id: verifierId }
      });

      if (!verifier) {
        throw new NotFoundException('Verifier not found');
      }

      let whereCondition: Prisma.VerificationWhereInput = {};
      
      if (role === UserRole.Admin) {
        // For Admin, get all verifications
        whereCondition = {};
      } else if (role === UserRole.Verifier) {
        // For Verifier, get only verifications assigned to them
        whereCondition = { verifierId };
      }

      const verifications = await this.prisma.verification.findMany({
        where: whereCondition,
        include: {
          loan: {
            include: {
              operationsExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                  role: true
                }
              }
            }
          },
          fieldExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Group verifications by loan to avoid duplicates
      const loanMap = new Map();
      verifications.forEach(verification => {
        if (!loanMap.has(verification.loan.id)) {
          loanMap.set(verification.loan.id, {
            ...verification.loan,
            verifications: []
          });
        }
        loanMap.get(verification.loan.id).verifications.push(verification);
      });

      const loans = Array.from(loanMap.values());

      await this.loggingService.info('Retrieved loans by verifier', {
        verifierId,
        role,
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

  async getLoans(officeId: number, role: UserRole, filters?: GetLoansDto): Promise<PaginatedResponse<any>> {
    try {
      const where: Prisma.LoanWhereInput = {};
      
      if (role === UserRole.OperationsExecutive) {
        where.officeId = officeId;
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.id) {
        where.id = Number(filters.id);
      }

      if (filters?.applicationNumber) {
        where.applicationNumber = {contains: filters.applicationNumber, mode: 'insensitive'};
      }

      // Add date range filter
      if (filters?.startDate || filters?.endDate) {
        where.createdAt = {
          ...(filters.startDate && { 
            gte: new Date(`${filters.startDate}T00:00:00.000Z`)
          }),
          ...(filters.endDate && { 
            lte: new Date(`${filters.endDate}T23:59:59.999Z`)
          })
        };
      }

      // Add field executive search conditions
      if (filters?.fieldExecutiveEmployeeCode || filters?.fieldExecutiveName) {
        where.verifications = {
          some: {
            fieldExecutive: {
              ...(filters.fieldExecutiveEmployeeCode && {
                employeeCode: {
                  contains: filters.fieldExecutiveEmployeeCode,
                  mode: 'insensitive'
                }
              }),
              ...(filters.fieldExecutiveName && {
                name: {
                  contains: filters.fieldExecutiveName,
                  mode: 'insensitive'
                }
              })
            }
          }
        };
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const skip = (page - 1) * limit;

      const total = await this.prisma.loan.count({ where });

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
          verifications: {
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                  role: true,
                  office: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
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
              verificationRetries: {
                select: {
                  reason: true,
                  date: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: Number(limit)
      });

      await this.loggingService.debug('Retrieved loans with filters', {
        filters,
        count: loans.length,
        page,
        limit
      });

      return {
        items: loans,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
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
    businessName?: string
  ) {
    try {
      const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });

      if (!loan) {
        await this.loggingService.warn('Verification assignment update failed - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      // // If field executive is provided, address is mandatory
      if (!fieldExecutiveId && !address && !businessName && !verifierId) {
        throw new BadRequestException('Address is required when assigning a field executive');
      }

      // Start a transaction to ensure all operations succeed or fail together
      return await this.prisma.$transaction(async (prisma) => {
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
            ...(verifierId && { verifierId }),
            ...(address && { applicantAddress: address }),
            ...(businessName && { businessName }),
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

  async getAssignedLoansWithVerifications(fieldExecutiveId: number, filters?: FieldExecutiveAssignedDto) {
    try {
      const fieldExecutive = await this.prisma.user.findUnique({
        where: { id: fieldExecutiveId }
      });

      if (!fieldExecutive) {
        throw new NotFoundException('Field executive not found');
      }

      // Calculate today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const where: Prisma.VerificationWhereInput = { 
        fieldExecutiveId,
        // Exclude verifications that have retries for today
        NOT: {
          verificationRetries: {
            some: {
              createdAt: {
                gt: today,
                lt: tomorrow
              }
            }
          }
        }
      };
      
      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.applicationNumber) {
        where.loan = {
          applicationNumber: {
            contains: filters.applicationNumber,
            mode: 'insensitive'
          }
        };
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const skip = (page - 1) * limit;

      const total = await this.prisma.verification.count({ where });

      const verifications = await this.prisma.verification.findMany({
        where,
        include: {
          loan: {
            select: {
              id: true,
              applicationNumber: true,
              applicantName: true,
              loanAmount: true,
              status: true,
              bankName: true,
              loanType: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: Number(limit)
      });
      
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const isAvailableToday = await this.prisma.attendance.findFirst({
        where: {
          userId: fieldExecutiveId,
          date: {
            gte: startOfToday,
            lt: startOfTomorrow
          }
        }
      }) ? true : false;

      await this.loggingService.debug('Retrieved assigned loans with verifications', {
        fieldExecutiveId,
        count: verifications.length,
        page,
        limit,
        excludedRetriesForToday: true
      });

      return {
        isAvailableToday,
        data:
        {items: verifications,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }}
      };
    } catch (error) {
      await this.loggingService.error('Failed to get assigned loans with verifications', {
        fieldExecutiveId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async editVerificationReport(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number,
    findings: string,
    verificationData?: any,
    addressType?: AddressType,
  ) {
    try {
      let updatedAddressType = addressType;
      // First, check if a verification with the same loanId and addressType exists and is completed
      if (addressType) {
        const completedVerification = await this.prisma.verification.findFirst({
          where: {
            loanId,
            addressType: addressType,
            status: 'Completed',
          },
        });

        if (completedVerification) {
          updatedAddressType = updatedAddressType === 'CurrentAddress' ? 'PermanentAddress' : 'CurrentAddress';
        }
      }

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
      // Process all images in verificationData if it exists
      if (verificationData?.uploadedItems) {
        await Promise.all(
          verificationData.uploadedItems.map(async (item: { id: string; uri: string; type: string; timestamp: string; s3ImageUrl: string; 
                  latitude?: string; longitude?: string; isCamera?: boolean; isOverlayNeeded?: boolean}) => {
            try {
              
              if (item.s3ImageUrl && item.isCamera && item.isOverlayNeeded) {
                const processedUrl = await this.s3Service.processAndUploadImage(
                  item.s3ImageUrl,
                  parseFloat(item.latitude),
                  parseFloat(item.longitude),
                  item.timestamp,
                );
              }
            } catch (error) {
              await this.loggingService.error('Failed to process image', {
                loanId,
                verificationType,
                itemId: item.id,
                error: error.message
              });
            }
          })
        );
      }

      // Update verification status
      const updatedVerification = await this.prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          status: 'Completed',
          verificationData: verificationData || null,
          addressType: updatedAddressType || null,
          updatedAt: new Date(),
        },
      });

      // If status is Completed, check if all verifications are complete
      if (updatedVerification.status === VerificationStatus.Completed) {
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

      await this.loggingService.info('Verification report updated successfully with processed images', {
        loanId,
        verificationType,
        fieldExecutiveId,
        processedImagesCount: verificationData?.uploadedItems?.length || 0
      });

      return {
        verification: updatedVerification,
      };
    } catch (error) {
      this.logger.error(`Error updating verification report: ${error.message}`, error.stack);
      throw new Error('Failed to update verification report');
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

  async deleteVerification(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number,
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
        await this.loggingService.warn('Verification deletion failed - Verification not found or not assigned', {
          loanId,
          verificationType,
          fieldExecutiveId
        });
        throw new NotFoundException('Verification not found or not assigned to this field executive');
      }

      // Check if verification is already completed
      if (verification.status === VerificationStatus.Completed) {
        throw new BadRequestException('Cannot delete a completed verification');
      }

      const verificationRetries = await this.prisma.verificationRetries.findMany({
        where: {
          verificationId: verification.id,
        },
      });

      if (verificationRetries.length > 0) {
        throw new BadRequestException('Cannot delete the verification as it has been rescheduled');
      }

      // Delete the verification
      const deletedVerification = await this.prisma.verification.delete({
        where: {
          id: verification.id,
        },
      });

      // Check if there are any remaining verifications for this loan
      const remainingVerifications = await this.prisma.verification.findMany({
        where: {
          loanId,
        },
      });

      // If no verifications remain, update loan status to Unassigned
      if (remainingVerifications.length === 0) {
        await this.prisma.loan.update({
          where: { id: loanId },
          data: { status: LoanStatus.Unassigned },
        });

        await this.loggingService.info('All verifications deleted, loan status updated to Unassigned', {
          loanId,
          newStatus: LoanStatus.Unassigned
        });
      }

      await this.loggingService.info('Verification deleted successfully', {
        loanId,
        verificationType,
        fieldExecutiveId,
        verificationId: verification.id
      });

      return {
        message: 'Verification deleted successfully',
        deletedVerification
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      await this.loggingService.error('Failed to delete verification', {
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
              },
              verifier: {
                select: {
                  id: true,
                  name: true,
                  mobile: true
                }
              }
            }
          },
        }
      });

      if (!loan) {
        await this.loggingService.warn('Failed to get verification data - Loan not found', { loanId });
        throw new NotFoundException('Loan not found');
      }

      // Format the verification data and generate presigned URLs for paths
      const verificationData = await Promise.all(loan.verifications.map(async verification => {

        return {
          id: verification.id,
          type: verification.type,
          path: verification.path,
          status: verification.status,
          approvedStatus: verification.approvedStatus,
          finalReportPath: verification.finalReportPath,
          addressType: verification.addressType,
          verificationData: verification.verificationData,
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

  async createLoans(createLoanDtos: CreateLoanDto[], officeId: number) {
    try {
      const results = {
        successful: [],
        failed: [],
        totalProcessed: createLoanDtos.length,
        successfulCount: 0,
        failedCount: 0
      };

      for (const dto of createLoanDtos) {
        try {
          // Check if operations executive exists
          const operationsExecutive = await this.prisma.user.findUnique({
            where: { id: dto.operationsExecutiveId }
          });

          if (!operationsExecutive) {
            throw new NotFoundException(`Operations executive with ID ${dto.operationsExecutiveId} not found`);
          }

          // Check if field executive exists (if provided)
          if (dto.fieldExecutiveId) {
            const fieldExecutive = await this.prisma.user.findUnique({
              where: { id: dto.fieldExecutiveId }
            });

            if (!fieldExecutive) {
              throw new NotFoundException(`Field executive with ID ${dto.fieldExecutiveId} not found`);
            }
          }

          const { operationsExecutiveId, fieldExecutiveId, verifierId, ...rest } = dto;

          // Generate application number if not provided
          const applicationNumber = dto.applicationNumber || `APP${Date.now()}`;
          
          const loanData = {
            ...rest,
            applicationNumber,
            status: dto.status || 'Unassigned',
            office: { connect: { id: officeId } },
            operationsExecutive: { connect: { id: operationsExecutiveId } },
            ...(fieldExecutiveId && {
              fieldExecutive: { connect: { id: fieldExecutiveId } }
            })
          };

          const loan = await this.prisma.loan.create({
            data: loanData
          });

          results.successful.push(loan);
          results.successfulCount++;
        } catch (error) {
          results.failed.push({
            data: dto,
            error: error.message
          });
          results.failedCount++;
        }
      }

      await this.loggingService.info('Loans created', {
        totalProcessed: results.totalProcessed,
        successfulCount: results.successfulCount,
        failedCount: results.failedCount
      });

      return results;
    } catch (error) {
      await this.loggingService.error('Failed to create loans', {
        error: error.message,
        stack: error.stack
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


  async generateFinalReportPDF(loanId: number, addressType: AddressType): Promise<string> {
    
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
          where: { addressType: addressType },
          select: {
            id: true,
            type: true,
            status: true,
            approvedStatus: true,
            updatedAt: true,
            verificationData: true,
            path: true,
            finalReportPath: true,
            fieldExecutive: { select: { name: true } }
          }
        },
      }
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }
    
    const verification = loan.verifications[0];
    
    if (!verification) {
      throw new NotFoundException(`Verification for address type ${addressType} not found`);
    }

    const finalReportPath = verification.finalReportPath;

    let finalReportPdfUrl = '';

    const s3_path = `final_pdf/${loanId}/${addressType}.pdf`;

    if(finalReportPath) {
      finalReportPdfUrl = await this.s3Service.generatePresignedDownloadUrl(finalReportPath);
      return finalReportPdfUrl;
    }
    else {
      const pdfBuffer = await this.generateVerificationPDF(loanId, addressType);

      const pdfUrl = await this.s3Service.uploadPdfToS3(pdfBuffer, s3_path);

      const updatedVerification = await this.prisma.verification.update({
        where: { id: verification.id },
        data: { finalReportPath: s3_path }
      });

      return pdfUrl;
    }
  }

  async returnHTMLImageData(data: string[], bankName: string, fieldExecutive: string): Promise<string> {
    return `
    <div style="page-break-before: always;"></div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Uploaded Documents and Images</td></tr>
          <tr>
            <td colspan="6">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 20px;">
                ${data.join('')}
              </div>
            </td>
          </tr>
        </table>
        <div style="text-align: right; margin-top: 10px; font-size: 14px; color: #333;">
        Field Executive: ${fieldExecutive || ''}
      </div>
      </div>

      <div class="footer">
        <span style="color: #138808;">${bankName}</span><span style="color: #FF9933;"></span><br>
        Generated on ${new Date().toLocaleString()}
      </div>
    `
  }

  async formatImages(images: string[], bankName: string, fieldExecutive: string): Promise<string> {
    let result = [];
    let finalResult = [];
    let count = 0;
    for(let i = 0; i < images.length; i++) {
      result.push(`<div style="width: 70%; margin: 1%; border: 1px solid #ddd; padding: 10px; text-align: center; display: inline-block; vertical-align: top; box-sizing: border-box; page-break-inside: avoid;">
                  <img src="${images[i]}" style="width: 100%; height: 300px; object-fit: contain; margin-bottom: 10px;" />
                  <div style="font-size: 12px; color: #666;">Uploaded on: ${new Date().toLocaleString()}</div>
                  </div>`);
      
      count++;
      if(count % 4 === 0) {
        finalResult.push(await this.returnHTMLImageData(result, bankName, fieldExecutive));
        result = [];
        count = 0;
      }
    }

    if(count > 0 && count < 4) {
      finalResult.push(await this.returnHTMLImageData(result, bankName, fieldExecutive));
    }
    
    return finalResult.join('');
  }

  async generateVerificationPDF(loanId: number, addressType: AddressType): Promise<Buffer> {
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
          office: { select: { name: true, address: true } },
          operationsExecutive: { select: { name: true } },
          verifications: {
            where: { addressType: addressType },
            select: {
              type: true,
              status: true,
              approvedStatus: true,
              updatedAt: true,
              verificationData: true,
              path: true,
              finalReportPath: true,
              fieldExecutive: { select: { name: true, office: { select: { address: true, location: true, name: true } } } }
            }
          },
        }
      });

      if (!loan) {
        throw new NotFoundException('Loan not found');
      }

      const verification = loan.verifications[0];
      
      if (!verification) {
        throw new NotFoundException(`Verification for address type ${addressType} not found`);
      }

      const status = verification?.approvedStatus || '';

      let address = verification.fieldExecutive?.office?.address || '' + 
                    ', ' + verification.fieldExecutive?.office?.location || '' + 
                    ', ' + verification.fieldExecutive?.office?.name || '' ;

      address = address.toLocaleLowerCase();

      // Get the verification data
      let verificationData: VerificationData | WorkVerificationData | BusinessVerificationData = {};
      if (addressType === 'Work') {
        verificationData = verification.verificationData as WorkVerificationData || {};
      }
      else if(addressType === 'Business') {
        verificationData = verification.verificationData as BusinessVerificationData || {};
      }
      else if(addressType === 'PermanentAddress' || addressType === 'CurrentAddress') {
        verificationData = verification.verificationData as VerificationData || {};
      }
      else {
        throw new NotFoundException('Invalid address type');
      }
      
      const imagePath = path.resolve(process.env.SIGNATURE_PATH || '/home/ubuntu/kowtha/new_sign.jpg');
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

      let htmlTemplate = '';

      const imagesData = await this.formatImages(validImageUrls, loan.bankName, verification.fieldExecutive?.name || '');
      
      const html_data = {
        bankName: loan.bankName,
        path: verification.path,
        status: status,
        imageDataUri: imageDataUri,
        imagesData: imagesData,
        fieldExecutive: verification.fieldExecutive?.name || '',
      }

      if(addressType === 'PermanentAddress' || addressType === 'CurrentAddress') {
        htmlTemplate = this.generateBaseHTMLTemplate(loan, address) + 
        addressTemplate(verificationData as VerificationData, html_data, addressType);
      }
      else if(addressType === 'Work') {
        htmlTemplate = this.generateBaseHTMLTemplate(loan, address) + 
        workTemplate(verificationData as WorkVerificationData, html_data);
      }
      else if(addressType === 'Business') {
        htmlTemplate = this.generateBaseHTMLTemplate(loan, address) + 
        businessTemplate(verificationData as BusinessVerificationData, html_data);
      }
      else {
        throw new NotFoundException('Invalid address type');
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
        addressType,
        applicationNumber: loan.applicationNumber,
      });

      return pdfBuffer;
    } catch (error) {
      await this.loggingService.error('Failed to generate verification PDF', {
        loanId,
        addressType,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private generateBaseHTMLTemplate(loan: any, address: string): string {
    let mailId = '';

    if (address.includes('vijayawada')) {
      mailId = 'apfi@cakowtha.co.in';
    } else {
      mailId = 'tsfi@cakowtha.co.in';
    }

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
            <div class="address">${address}</div>
          </div>
          <div class="contact">
            Mobile no: 8332037517<br>
            Mail ID: ${mailId}
          </div>
        </div>

        <div class="report-title">DUE DILIGENCE REPORT</div>

        <div class="align-wrapper">
          <div class="branch-box">
            <table class="branch-table">
              <tr>
                <td class="branch-label">Application Number</td>
                <td class="branch-value" style="border-right: 1px solid #000;">${loan.applicationNumber}</td>
                <td class="branch-label">Bank Name</td>
                <td class="branch-value">${loan.bankName}</td>
              </tr>
            </table>
          </div>
        </div>
    `;
  }

  async updateVerificationApproval(
    loanId: number,
    verificationType: VerificationType,
    approvedStatus: ApprovedStatus,
    path?: string
  ) {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: {
          loanId,
          type: verificationType,
        },
      });

      if (!verification) {
        throw new NotFoundException('Verification not found');
      }

      const updatedVerification = await this.prisma.verification.update({
        where: { id: verification.id },
        data: {
          approvedStatus,
          status: VerificationStatus.Completed,
          ...(path !== undefined && { path }),
        },
      });

      await this.loggingService.info('Verification approval updated', {
        loanId,
        verificationType,
        approvedStatus,
        path,
      });
      return updatedVerification;
    } catch (error) {
      await this.loggingService.error('Failed to update verification approval', {
        loanId,
        verificationType,
        approvedStatus,
        path,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async createVerificationRetry(createVerificationRetryDto: any) {
    try {
      // Validate that the verification exists
      const verification = await this.prisma.verification.findUnique({
        where: { id: createVerificationRetryDto.verificationId },
        include: {
          loan: {
            select: {
              id: true,
              applicationNumber: true,
              applicantName: true
            }
          }
        }
      });

      if (!verification) {
        throw new NotFoundException('Verification not found');
      }

      // Validate that the field executive exists
      const fieldExecutive = await this.prisma.user.findUnique({
        where: { id: createVerificationRetryDto.fieldExecutiveId }
      });

      if (!fieldExecutive) {
        throw new NotFoundException('Field executive not found');
      }

      // Create the verification retry
      const verificationRetry = await this.prisma.verificationRetries.create({
        data: {
          verificationId: createVerificationRetryDto.verificationId,
          date: new Date(createVerificationRetryDto.date),
          geotag: createVerificationRetryDto.geotag,
          address: createVerificationRetryDto.address,
          reason: createVerificationRetryDto.reason,
          fieldExecutiveId: createVerificationRetryDto.fieldExecutiveId,
        },
        include: {
          verification: {
            include: {
              loan: {
                select: {
                  id: true,
                  applicationNumber: true,
                  applicantName: true
                }
              }
            }
          },
          fieldExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true
            }
          }
        }
      });

      const updateVerification = await this.prisma.verification.update({
        where:{
          id: verification.id
        },
        data:{
          isPostponed: true,
          postponedDate: new Date(createVerificationRetryDto.date),
          postponedReason: createVerificationRetryDto.reason
        }
      });

      await this.loggingService.info('Verification retry created successfully', {
        verificationRetryId: verificationRetry.id,
        verificationId: createVerificationRetryDto.verificationId,
        fieldExecutiveId: createVerificationRetryDto.fieldExecutiveId,
        loanId: verification.loan.id,
        applicationNumber: verification.loan.applicationNumber
      });

      return verificationRetry;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error('Failed to create verification retry', {
        data: createVerificationRetryDto,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async deleteLoan(loanId: number) {
    try {
      // Start a transaction to delete all related entities
      return await this.prisma.$transaction(async (prisma) => {
        // Delete VerificationRetries for all verifications of this loan
        const verifications = await prisma.verification.findMany({
          where: { loanId },
          select: { id: true },
        });
        const verificationIds = verifications.map(v => v.id);
        if (verificationIds.length > 0) {
          await prisma.verificationRetries.deleteMany({
            where: { verificationId: { in: verificationIds } },
          });
        }

        // Delete EditRequests for this loan
        await prisma.editRequest.deleteMany({
          where: { loanId },
        });
        // Delete EditRequests for verifications of this loan
        if (verificationIds.length > 0) {
          await prisma.editRequest.deleteMany({
            where: { verificationId: { in: verificationIds } },
          });
        }

        // Delete Verifications for this loan
        await prisma.verification.deleteMany({
          where: { loanId },
        });

        // Finally, delete the loan
        const deletedLoan = await prisma.loan.delete({
          where: { id: loanId },
        });

        await this.loggingService.info('Loan and all related entities deleted', {
          loanId,
        });
        return { message: 'Loan and all related entities deleted', deletedLoan };
      });
    } catch (error) {
      await this.loggingService.error('Failed to delete loan and related entities', {
        loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
} 