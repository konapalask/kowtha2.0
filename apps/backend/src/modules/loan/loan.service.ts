import * as fs from "fs";
import * as path from "path";
import pLimit from "p-limit";
import { Buffer } from "buffer"; // Import the Buffer type
import * as puppeteer from "puppeteer";
import { Logger } from "@nestjs/common";
import { Worker } from "worker_threads";
import { format, toZonedTime } from "date-fns-tz";
import { GetLoansDto } from "./dto/get-loans.dto";
import { EditLoanDto } from "./dto/edit-loan.dto";
import { PrismaService } from "../../prisma.service";
import { CreateLoanDto } from "./dto/create-loan.dto";
import { S3Service } from "../common/s3utils/s3.service";
import { baseTemplate } from "./templates/FI/base.template";
import { workTemplate } from "./templates/FI/work.template";
import { PaginatedResponse } from "../common/dto/pagination.dto";
import { CreateLambdaLoanDto } from "./dto/create-lamba-loan.dto";
import { addressTemplate } from "./templates/FI/address.template";
import { createAssignmentDto } from "./dto/assign-loan-executive";
import { UpdateAssignmentDto } from "./dto/update-assignment.dto";
import { EditVerificationDto } from "./dto/edit-verification.dto";
import { LoggingService } from "../common/logging/logging.service";
import { CreatePDEmailLogDto } from "./dto/create-pd-email-log.dto";
import { businessTemplate } from "./templates/FI/business.template";
import { VerificationData } from "./templates/FI/address.interface";
import { WorkVerificationData } from "./templates/FI/work.interface";
import { BusinessVerificationData } from "./templates/FI/business.interface";
import { FieldExecutiveAssignedDto } from "./dto/field-executive-assigned.dto";
import {
  Prisma,
  LoanStatus,
  VerificationType,
  VerificationStatus,
  AddressType,
  UserRole,
  ApprovedStatus,
  Department,
} from "@prisma/client";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

const limit = pLimit(3); // allow 3 workers at a time (tune this)

@Injectable()
export class LoanService {
  private financialAnalysisTemplatesService: any;

  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
    private logger: Logger,
    private s3Service: S3Service
  ) { }

  // Lazy loading to avoid circular dependencies
  private async getFinancialAnalysisTemplatesService() {
    if (!this.financialAnalysisTemplatesService) {
      const { FinancialAnalysisTemplatesService } = await import('./financial-analysis.service');

      this.financialAnalysisTemplatesService = new FinancialAnalysisTemplatesService(
        this.prisma,
        this.loggingService
      );
    }
    return this.financialAnalysisTemplatesService;
  }

  async runWorker(data: any) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.resolve(__dirname, "imageWorker.js"), {
        workerData: data,
      });
      worker.on("message", (msg) => {
        if (msg.success) resolve(msg.result);
        else reject(new Error(msg.error));
      });
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
      });
    });
  }

  async PDFBufferGeneration(
    htmlTemplate: string,
    bankName?: string
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--lang=en-IN",
        "--intl.accept_languages=en-IN",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    });

    // Create a new page
    const page = await browser.newPage();

    // ßSet content to the HTML template
    await page.setContent(htmlTemplate, {
      waitUntil: "networkidle0",
    });

    // Wait a bit more to ensure content is fully loaded
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate current IST date
    const istDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Debug logging
    console.log("Footer template variables:", {
      bankName: bankName || "Kowtha",
      istDate: istDate,
    });

    // Create footer template with proper string interpolation
    const footerTemplate = `
      <div style="
          font-size: 10px;
          width: 100%;
          padding: 6px 16px;
          color: #7f8c8d;
          border-top: 1px solid #eee;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1.4;
          height: 50px;
          box-sizing: border-box;
        ">
        <div style="color: rgb(8, 136, 36); font-weight: 600;">${bankName || "Kowtha"}</div>
        <div>
          Generated on ${istDate} —
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      </div>
    `;

    console.log("Footer template HTML:", footerTemplate);

    // Generate PDF
    console.log("Starting PDF generation with header/footer...");
    const pdfArray = await page.pdf({
      format: "a4",
      margin: {
        top: "60px", // Increased to accommodate header
        right: "20px",
        bottom: "80px", // Increased further to prevent content overlap
        left: "20px",
      },
      printBackground: true,
      preferCSSPageSize: false, // Changed to false to ensure consistent page sizing
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="
            font-size: 8px;
            width: 100%;
            padding: 4px 16px;
            color: #999;
            border-bottom: 1px solid #eee;
            text-align: center;
          ">
          ${bankName || "Kowtha"} - Verification Report
        </div>
      `,
      footerTemplate: footerTemplate,
    });

    console.log("PDF generation completed. Buffer size:", pdfArray.length);
    const pdfBuffer: Buffer = Buffer.from(pdfArray);

    // Close the browser
    await browser.close();
    return pdfBuffer;
  }

  async createLambdaLoan(data: CreateLambdaLoanDto) {
    try {
      const office = await this.prisma.office.findFirst({
        where: {
          department: "PD",
        },
      });

      if (!office) {
        throw new NotFoundException("Office not found");
      }

      const loan = await this.prisma.loan.create({
        data: {
          department: "PD",
          loanType: "Business",
          status: "Unassigned",
          bankName: data.bankName,
          loanAmount: Number(data.loanAmount),
          applicantName: data.applicantName,
          applicantMobile: data.applicantMobile,
          office: { connect: { id: office.id } },
          applicantAddress: data.applicantAddress,
          applicationNumber: data.applicationNumber,
          applicantType: data.applicantType || "Primary Applicant",
        },
        include: {
          office: true,
        },
      });
      return loan;
    } catch (error) {
      await this.loggingService.error("Failed to create lambo loan", {
        data,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async createLoan(
    data: CreateLoanDto,
    officeId: number,
    department: Department
  ) {
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
                  addressType:
                    type === "Work" ? "PermanentAddress" : "CurrentAddress",
                  fieldExecutive: { connect: { id: data.fieldExecutiveId } },
                  status: "Pending",
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

        await this.loggingService.info(
          "Loan created successfully with verifications",
          {
            loanId: loan.id,
            applicationNumber: loan.applicationNumber,
            applicantName: loan.applicantName,
            loanAmount: loan.loanAmount,
            fieldExecutiveId: data.fieldExecutiveId,
          }
        );

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
      await this.loggingService.error("Failed to create loan", {
        data,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // Create a QA test loan for testing purposes
  async createQALoan(bankName: string, fieldExecutiveId: number, qaData?: any) {
    try {
      // Find an admin user who will initiate the loan
      const adminDepartmentRole = await this.prisma.departmentRole.findFirst({
        where: {
          role: UserRole.Admin,
        },
        include: {
          user: true,
        },
      });

      if (!adminDepartmentRole) {
        throw new Error(
          "No admin user found in system. Cannot create QA loan."
        );
      }

      const adminUser = adminDepartmentRole.user;

      // Verify the field executive exists
      const fieldExecutive = await this.prisma.user.findUnique({
        where: { id: fieldExecutiveId },
      });

      if (!fieldExecutive) {
        throw new Error(
          `Field executive with ID ${fieldExecutiveId} not found`
        );
      }

      // Get first office in the system
      const office = await this.prisma.office.findFirst();
      if (!office) {
        throw new Error("No office found in system");
      }

      // Generate QA test data
      const timestamp = Date.now();
      const applicationNumber = `QA-${bankName.substring(0, 3).toUpperCase()}-${timestamp}`;
      const businessName =
        qaData?.businessName || `QA Test Business ${timestamp}`;

      return await this.prisma.$transaction(async (prisma) => {
        // Create the QA loan (initiated by admin, assigned to field executive)
        const loan = await prisma.loan.create({
          data: {
            applicationNumber,
            applicantName:
              qaData?.applicantName || `QA Test Applicant ${timestamp}`,
            applicantMobile: qaData?.applicantMobile || "9999999999",
            applicantAddress:
              qaData?.applicantAddress || "QA Test Address, Mumbai - 400001",
            loanType: qaData?.loanType || "Business Loan",
            bankName: bankName,
            loanAmount: qaData?.loanAmount || 1000000,
            office: { connect: { id: office.id } },
            operationsExecutive: { connect: { id: adminUser.id } }, // Admin initiates
            status: LoanStatus.Assigned,
            department: Department.PD,
          },
          include: {
            operationsExecutive: true,
            office: true,
          },
        });

        // Create a PD verification assigned to the field executive
        const verification = await prisma.verification.create({
          data: {
            loan: { connect: { id: loan.id } },
            type: VerificationType.Business,
            addressType: AddressType.Business,
            fieldExecutive: { connect: { id: fieldExecutiveId } },
            status: VerificationStatus.Pending,
            businessName: businessName,
          },
        });

        await this.loggingService.info("QA test loan created successfully", {
          loanId: loan.id,
          applicationNumber: loan.applicationNumber,
          bankName: bankName,
          initiatedBy: adminUser.id,
          assignedTo: fieldExecutiveId,
          verificationId: verification.id,
        });

        return {
          loan,
          verification,
          message: "QA test loan created successfully",
        };
      });
    } catch (error) {
      await this.loggingService.error("Failed to create QA loan", {
        bankName,
        fieldExecutiveId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // Assign a field executive to a verification for a loan
  async assignVerification(loanId: number, createData: createAssignmentDto) {
    try {
      const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });

      if (!loan) {
        await this.loggingService.warn(
          "Verification assignment failed - Loan not found",
          { loanId }
        );
        throw new NotFoundException("Loan not found");
      }

      if (!createData.fieldExecutiveId || !createData.verifierId) {
        throw new BadRequestException(
          "Field Executive ID or Verifier ID is required when assigning a field executive"
        );
      }

      if (
        createData.fieldExecutiveId &&
        (!createData.address || !createData.verificationType)
      ) {
        throw new BadRequestException(
          "Address and Verification Type is required when assigning a field executive"
        );
      }

      return await this.prisma.$transaction(async (prisma) => {
        const verification = await prisma.verification.create({
          data: {
            loan: { connect: { id: loan.id } },
            type: createData.verificationType || "AddressOne",
            verifier: { connect: { id: createData.verifierId } },
            fieldExecutive: { connect: { id: createData.fieldExecutiveId } },
            status: "Pending",
            applicantAddress: createData.address || null,
            locationType: createData.locationType || null,
            businessName: createData.businessName || null,
            currentOfficeName: createData.currentOfficeName || null,
            department: loan.department,
          },
        });

        const loanStatusChange = await prisma.loan.update({
          where: { id: loanId },
          data: { status: "Assigned" },
        });

        await this.loggingService.info("Verification assigned successfully", {
          loanId,
          createData,
        });

        return verification;
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      await this.loggingService.error("Failed to assign verification", {
        loanId,
        createData,
        error: error.message,
        stack: error.stack,
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
    pictureSource?: "Camera" | "Gallery"
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
        await this.loggingService.warn(
          "Verification report submission failed - Verification not found",
          {
            loanId,
            verificationType,
          }
        );
        throw new NotFoundException("Verification not found");
      }

      const updatedVerification = await this.prisma.verification.update({
        where: {
          loanId_type: {
            loanId,
            type: verificationType,
          },
        },
        data: {
          status: "Completed",
          verificationData: verificationData || null,
          pictureSource: pictureSource || null,
        },
      });

      await this.loggingService.info(
        "Verification report submitted successfully",
        {
          loanId,
          verificationType,
          fieldExecutiveId,
          verificationId: verification.id,
          hasPath: !!path,
          hasVerificationData: !!verificationData,
          pictureSource,
        }
      );

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to submit verification report", {
        loanId,
        verificationType,
        fieldExecutiveId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async verifyLoan(
    loanId: number,
    verifierId: number,
    status: LoanStatus,
    approvedStatus: ApprovedStatus,
    comments?: string
  ) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
      });

      if (!loan) {
        await this.loggingService.warn(
          "Loan verification failed - Loan not found",
          { loanId }
        );
        throw new NotFoundException("Loan not found");
      }

      const updatedLoan = await this.prisma.loan.update({
        where: { id: loanId },
        data: {
          status,
        },
      });

      await this.loggingService.info("Loan verified successfully", {
        loanId,
        verifierId,
        status,
        hasComments: !!comments,
      });

      return updatedLoan;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to verify loan", {
        loanId,
        verifierId,
        status,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getLoansByOffice(officeId: number, department: Department) {
    try {
      const office = await this.prisma.office.findUnique({
        where: { id: officeId },
      });

      if (!office) {
        throw new NotFoundException("Office not found");
      }

      const loans = await this.prisma.loan.findMany({
        where: {
          officeId,
          department: department,
        },
        include: {
          operationsExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
            },
          },
          verifications: {
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                },
              },
              verifier: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      await this.loggingService.info("Retrieved loans by office", {
        officeId,
        department,
        count: loans.length,
      });

      return loans;
    } catch (error) {
      await this.loggingService.error("Failed to get loans by office", {
        officeId,
        department,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getLoansByFieldExecutive(
    fieldExecutiveId: number,
    department: Department
  ) {
    try {
      const fieldExecutive = await this.prisma.user.findUnique({
        where: { id: fieldExecutiveId },
      });

      if (!fieldExecutive) {
        throw new NotFoundException("Field executive not found");
      }

      const verifications = await this.prisma.verification.findMany({
        where: {
          fieldExecutiveId,
          department: department,
        },
        include: {
          loan: {
            select: {
              id: true,
              applicationNumber: true,
              applicantName: true,
              loanAmount: true,
              status: true,
            },
          },
        },
      });

      const loanIds = verifications.map((v) => v.loanId);
      const loans = await this.prisma.loan.findMany({
        where: {
          id: { in: loanIds },
          department: department,
        },
        include: {
          operationsExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
            },
          },
          verifications: {
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                },
              },
              verifier: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                },
              },
            },
          },
        },
      });

      await this.loggingService.debug("Retrieved loans by field executive", {
        fieldExecutiveId,
        department,
        count: loans.length,
      });

      return loans;
    } catch (error) {
      await this.loggingService.error(
        "Failed to get loans by field executive",
        {
          fieldExecutiveId,
          department,
          error: error.message,
          stack: error.stack,
        }
      );
      throw error;
    }
  }

  async getLoansByVerifier(
    verifierId: number,
    department: Department,
    role: any
  ) {
    try {
      const verifier = await this.prisma.user.findUnique({
        where: { id: verifierId },
      });

      if (!verifier) {
        throw new NotFoundException("Verifier not found");
      }

      const where: Prisma.VerificationWhereInput = {
        department: department,
      };

      const userRole = role.find((r: any) => r.department === department);

      if (userRole.role === UserRole.Verifier) {
        where.verifierId = verifierId;
        if (department === Department.PD) {
          where.initialSubmitted = true;
        }
      } else if (userRole.role === UserRole.VerificationExecutive) {
        if (department === Department.PD) {
          where.initialSubmitted = false;
        }
        where.initialSubmitted = false;
      } else {
      }

      const verifications = await this.prisma.verification.findMany({
        where: where,
        include: {
          loan: {
            include: {
              operationsExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                },
              },
            },
          },
          fieldExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Group verifications by loan to avoid duplicates
      const loanMap = new Map();
      verifications.forEach((verification) => {
        if (!loanMap.has(verification.loan.id)) {
          loanMap.set(verification.loan.id, {
            ...verification.loan,
            verifications: [],
          });
        }
        loanMap.get(verification.loan.id).verifications.push(verification);
      });

      const loans = Array.from(loanMap.values());

      await this.loggingService.info("Retrieved loans by verifier", {
        verifierId,
        role,
        count: loans.length,
      });

      return loans;
    } catch (error) {
      await this.loggingService.error("Failed to get loans by verifier", {
        verifierId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getLoans(
    officeId: number,
    filters?: GetLoansDto
  ): Promise<PaginatedResponse<any>> {
    try {
      const where: Prisma.LoanWhereInput = {
        department: filters.department,
      };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.postponed) {
        if (filters.postponed === "true") {
          where.verifications = {
            some: {
              isPostponed: true,
            },
          };
        }
      }

      if (filters?.applicantName) {
        where.applicantName = {
          contains: filters.applicantName,
          mode: "insensitive",
        };
      }

      if (filters?.applicantMobile) {
        where.applicantMobile = {
          contains: filters.applicantMobile,
          mode: "insensitive",
        };
      }

      if (filters?.bankName) {
        where.bankName = {
          contains: filters.bankName,
          mode: "insensitive",
        };
      }

      if (filters?.id) {
        where.id = Number(filters.id);
      }

      if (filters?.applicationNumber) {
        where.applicationNumber = {
          contains: filters.applicationNumber,
          mode: "insensitive",
        };
      }

      // Add date range filter
      if (filters?.startDate || filters?.endDate) {
        where.createdAt = {
          ...(filters.startDate && {
            gte: new Date(`${filters.startDate}T00:00:00.000Z`),
          }),
          ...(filters.endDate && {
            lte: new Date(`${filters.endDate}T23:59:59.999Z`),
          }),
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
                  mode: "insensitive",
                },
              }),
              ...(filters.fieldExecutiveName && {
                name: {
                  contains: filters.fieldExecutiveName,
                  mode: "insensitive",
                },
              }),
            },
          },
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
            },
          },
          verifications: {
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                  departmentRoles: {
                    where: {
                      department: filters.department,
                    },
                    select: {
                      officeId: true,
                      office: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
              verifier: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                  employeeCode: true,
                },
              },
              verificationRetries: {
                select: {
                  reason: true,
                  date: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: Number(limit),
      });

      await this.loggingService.debug("Retrieved loans with filters", {
        filters,
        count: loans.length,
        page,
        limit,
      });

      return {
        items: loans,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      await this.loggingService.error("Failed to get loans", {
        filters,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateVerificationAssignment(
    loanId: number,
    updateData: UpdateAssignmentDto
  ) {
    try {
      const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });

      if (!loan) {
        await this.loggingService.warn(
          "Verification assignment update failed - Loan not found",
          { loanId }
        );
        throw new NotFoundException("Loan not found");
      }

      // // If field executive is provided, address is mandatory
      if (
        !updateData.fieldExecutiveId &&
        !updateData.address &&
        !updateData.businessName &&
        !updateData.currentOfficeName &&
        !updateData.verifierId
      ) {
        throw new BadRequestException(
          "Address is required when assigning a field executive"
        );
      }

      // Start a transaction to ensure all operations succeed or fail together
      return await this.prisma.$transaction(async (prisma) => {
        // Update verification
        const verification = await prisma.verification.update({
          where: {
            loanId_type: {
              loanId,
              type: updateData.verificationType,
            },
          },
          data: {
            ...(updateData.address && { applicantAddress: updateData.address }),
            ...(updateData.businessName && {
              businessName: updateData.businessName,
            }),
            ...(updateData.verifierId && { verifierId: updateData.verifierId }),
            ...(updateData.fieldExecutiveId && {
              fieldExecutiveId: updateData.fieldExecutiveId,
            }),
            ...(updateData.currentOfficeName && {
              currentOfficeName: updateData.currentOfficeName,
            }),
            status: "Pending", // Reset status when assignment is updated
          },
        });

        await this.loggingService.info(
          "Verification assignment updated successfully",
          {
            loanId,
            updateData,
          }
        );

        return verification;
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      await this.loggingService.error(
        "Failed to update verification assignment",
        {
          loanId,
          updateData,
          error: error.message,
          stack: error.stack,
        }
      );
      throw error;
    }
  }

  async getAssignedLoansWithVerifications(
    fieldExecutiveId: number,
    filters?: FieldExecutiveAssignedDto
  ) {
    try {
      const fieldExecutive = await this.prisma.user.findUnique({
        where: { id: fieldExecutiveId },
      });

      if (!fieldExecutive) {
        throw new NotFoundException("Field executive not found");
      }

      // Calculate today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const where: Prisma.VerificationWhereInput = {
        fieldExecutiveId,
        department: filters.department,
        // Exclude verifications that have retries not for today
        OR: [
          {
            postponedDate: {
              gte: today,
              lt: tomorrow,
            },
          },
          {
            OR: [
              {
                isPostponed: null,
              },
              {
                isPostponed: false,
              },
            ],
          },
        ],
      };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.applicationNumber) {
        where.loan = {
          applicationNumber: {
            contains: filters.applicationNumber,
            mode: "insensitive",
          },
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
              applicantMobile: true,
              applicantName: true,
              applicantType: true,
              loanAmount: true,
              status: true,
              bankName: true,
              templateName: true,
              loanType: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: Number(limit),
      });
      // console.log(verifications[0].loan.applicantMobile, "verifications");

      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const startOfTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      const isAvailableToday = (await this.prisma.attendance.findFirst({
        where: {
          userId: fieldExecutiveId,
          date: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
        },
      }))
        ? true
        : false;

      await this.loggingService.debug(
        "Retrieved assigned loans with verifications",
        {
          fieldExecutiveId,
          count: verifications.length,
          page,
          limit,
          excludedRetriesForToday: true,
        }
      );

      return {
        isAvailableToday,
        data: {
          items: verifications,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      await this.loggingService.error(
        "Failed to get assigned loans with verifications",
        {
          fieldExecutiveId,
          error: error.message,
          stack: error.stack,
        }
      );
      throw error;
    }
  }

  private isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private safeParseJson(value: string): Prisma.JsonValue {
    try {
      return JSON.parse(value);
    } catch (error) {
      this.logger.warn(
        "Failed to parse verification data JSON string, returning original value",
        {
          valuePreview: value?.slice?.(0, 100),
        }
      );
      return value;
    }
  }

  async editVerificationReport(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number,
    findings: string,
    verificationData?: any,
    addressType?: AddressType
  ) {
    try {
      let updatedAddressType = addressType;
      // First, check if a verification with the same loanId and addressType exists and is completed
      if (addressType) {
        const completedVerification = await this.prisma.verification.findFirst({
          where: {
            loanId,
            addressType: addressType,
            status: "Completed",
          },
        });

        if (
          completedVerification &&
          (addressType === "CurrentAddress" ||
            addressType === "PermanentAddress")
        ) {
          updatedAddressType =
            updatedAddressType === "CurrentAddress"
              ? "PermanentAddress"
              : "CurrentAddress";
          if (verificationData && verificationData.addressVerification) {
            verificationData.addressVerification.address = updatedAddressType;
          }
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
        throw new Error(
          "Verification not found or not assigned to this field executive"
        );
      }
      // Process all images in verificationData if it exists
      if (verificationData?.uploadedItems) {
        await Promise.all(
          verificationData.uploadedItems.map((item: any) =>
            limit(() =>
              this.runWorker({
                s3ImageUrl: item.s3ImageUrl,
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
                timestamp: item.timestamp,
              })
            )
          )
        );
      }

      // Update verification status
      const updatedVerification = await this.prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          status: "Completed",
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
          (v) => v.status === VerificationStatus.Completed
        );

        // If all verifications are complete, update loan status to FVCompleted
        if (allCompleted) {
          await this.prisma.loan.update({
            where: { id: loanId },
            data: { status: LoanStatus.FVCompleted },
          });

          await this.loggingService.info(
            "All verifications completed, loan status updated",
            {
              loanId,
              newStatus: LoanStatus.FVCompleted,
            }
          );
        }
      }

      await this.loggingService.info(
        "Verification report updated successfully with processed images",
        {
          loanId,
          verificationType,
          fieldExecutiveId,
          processedImagesCount: verificationData?.uploadedItems?.length || 0,
        }
      );

      return {
        verification: updatedVerification,
      };
    } catch (error) {
      this.logger.error(
        `Error updating verification report: ${error.message}`,
        error.stack
      );
      throw new Error("Failed to update verification report");
    }
  }

  async updateVerificationStatus(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number,
    status: VerificationStatus
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
        await this.loggingService.warn(
          "Verification status update failed - Verification not found or not assigned",
          {
            loanId,
            verificationType,
            fieldExecutiveId,
          }
        );
        throw new NotFoundException(
          "Verification not found or not assigned to this field executive"
        );
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
          (v) => v.status === VerificationStatus.Completed
        );

        // If all verifications are complete, update loan status to FVCompleted
        if (allCompleted) {
          await this.prisma.loan.update({
            where: { id: loanId },
            data: { status: LoanStatus.FVCompleted },
          });

          await this.loggingService.info(
            "All verifications completed, loan status updated",
            {
              loanId,
              newStatus: LoanStatus.FVCompleted,
            }
          );
        }
      }

      await this.loggingService.info(
        "Verification status updated successfully",
        {
          loanId,
          verificationType,
          fieldExecutiveId,
          newStatus: status,
        }
      );

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to update verification status", {
        loanId,
        verificationType,
        fieldExecutiveId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async deleteVerification(
    loanId: number,
    verificationType: VerificationType,
    fieldExecutiveId: number
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
        await this.loggingService.warn(
          "Verification deletion failed - Verification not found or not assigned",
          {
            loanId,
            verificationType,
            fieldExecutiveId,
          }
        );
        throw new NotFoundException(
          "Verification not found or not assigned to this field executive"
        );
      }

      // Check if verification is already completed
      if (verification.status === VerificationStatus.Completed) {
        throw new BadRequestException("Cannot delete a completed verification");
      }

      const verificationRetries =
        await this.prisma.verificationRetries.findMany({
          where: {
            verificationId: verification.id,
          },
        });

      if (verificationRetries.length > 0) {
        throw new BadRequestException(
          "Cannot delete the verification as it has been rescheduled"
        );
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

        await this.loggingService.info(
          "All verifications deleted, loan status updated to Unassigned",
          {
            loanId,
            newStatus: LoanStatus.Unassigned,
          }
        );
      }

      await this.loggingService.info("Verification deleted successfully", {
        loanId,
        verificationType,
        fieldExecutiveId,
        verificationId: verification.id,
      });

      return {
        message: "Verification deleted successfully",
        deletedVerification,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      await this.loggingService.error("Failed to delete verification", {
        loanId,
        verificationType,
        fieldExecutiveId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getVerificationData(loanId: number, department: Department) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
        include: {
          verifications: {
            where: { department },
            include: {
              fieldExecutive: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                },
              },
              verifier: {
                select: {
                  id: true,
                  name: true,
                  mobile: true,
                },
              },
            },
          },
        },
      });

      if (!loan) {
        await this.loggingService.warn(
          "Failed to get verification data - Loan not found",
          { loanId }
        );
        throw new NotFoundException("Loan not found");
      }

      // Format the verification data
      console.error(
        `🔍 getVerificationData called for loan ${loanId}, department: ${department}`
      );

      const verificationData = await Promise.all(
        loan.verifications.map(async (verification) => {
          // For PD forms, handle both old hardcoded format and new schema format
          const rawVerificationData =
            verification.verificationData as Prisma.JsonValue;
          const parsedVerificationData =
            typeof rawVerificationData === "string"
              ? this.safeParseJson(rawVerificationData)
              : rawVerificationData;

          let transformedVerificationData: Prisma.JsonValue =
            parsedVerificationData;

          console.error(`🔍 Processing verification ${verification.id}`);

          if (
            department === "PD" &&
            this.isJsonObject(parsedVerificationData)
          ) {
            const verificationDataObject = parsedVerificationData as Record<
              string,
              any
            >;

            const hasLegacyShape = [
              "basicDetails",
              "businessDetails",
              "applicantDetails",
            ].some((key) => verificationDataObject[key]);

            await this.loggingService.info(
              `PD verification ${verification.id}: legacyShape = ${hasLegacyShape}`,
              {
                verificationId: verification.id,
                dataKeys: Object.keys(verificationDataObject),
                legacyShapeDetected: hasLegacyShape,
              }
            );
          }

          return {
            id: verification.id,
            type: verification.type,
            path: verification.path,
            status: verification.status,
            bankName: loan.bankName,
            approvedStatus: verification.approvedStatus,
            finalReportPath: verification.finalReportPath,
            addressType: verification.addressType,
            verificationData: transformedVerificationData,
            financialAnalysis: verification.financialAnalysis,
            synopsis: verification.synopsis,
            fieldExecutive: verification.fieldExecutive,
            createdAt: verification.createdAt,
            updatedAt: verification.updatedAt,
          };
        })
      );

      await this.loggingService.info(
        "Verification data retrieved successfully",
        {
          loanId,
          verificationCount: verificationData.length,
        }
      );

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
      await this.loggingService.error("Failed to get verification data", {
        loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async createLoans(
    createLoanDtos: CreateLoanDto[],
    officeId: number,
    department: Department
  ) {
    try {
      const results = {
        successful: [],
        failed: [],
        totalProcessed: createLoanDtos.length,
        successfulCount: 0,
        failedCount: 0,
      };
      if (!department) {
        throw new BadRequestException("Department is required");
      }

      for (const dto of createLoanDtos) {
        try {
          // Check if operations executive exists
          if (dto.operationsExecutiveId) {
            const operationsExecutive = await this.prisma.user.findUnique({
              where: { id: dto.operationsExecutiveId },
            });

            if (!operationsExecutive) {
              throw new NotFoundException(
                `Operations executive with ID ${dto.operationsExecutiveId} not found`
              );
            }
          } else {
            dto.operationsExecutiveId = null;
          }

          // Check if field executive exists (if provided)
          if (dto.fieldExecutiveId) {
            const fieldExecutive = await this.prisma.user.findUnique({
              where: { id: dto.fieldExecutiveId },
            });

            if (!fieldExecutive) {
              throw new NotFoundException(
                `Field executive with ID ${dto.fieldExecutiveId} not found`
              );
            }
          } else {
            dto.fieldExecutiveId = null;
          }

          const {
            operationsExecutiveId,
            fieldExecutiveId,
            verifierId,
            ...rest
          } = dto;

          // Generate application number if not provided
          const applicationNumber = dto.applicationNumber || `APP${Date.now()}`;

          const loanData = {
            ...rest,
            applicationNumber,
            department,
            status: dto.status || "Unassigned",
            office: { connect: { id: officeId } },
            ...(operationsExecutiveId && {
              operationsExecutive: { connect: { id: operationsExecutiveId } },
            }),
            ...(fieldExecutiveId && {
              fieldExecutive: { connect: { id: fieldExecutiveId } },
            }),
          };

          const loan = await this.prisma.loan.create({
            data: loanData,
          });

          results.successful.push(loan);
          results.successfulCount++;
        } catch (error) {
          results.failed.push({
            data: dto,
            error: error.message,
          });
          results.failedCount++;
        }
      }

      await this.loggingService.info("Loans created", {
        totalProcessed: results.totalProcessed,
        successfulCount: results.successfulCount,
        failedCount: results.failedCount,
      });

      return results;
    } catch (error) {
      await this.loggingService.error("Failed to create loans", {
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
        await this.loggingService.warn("Loan edit failed - Loan not found", {
          loanId,
        });
        throw new NotFoundException("Loan not found");
      }

      const updatedLoan = await this.prisma.loan.update({
        where: { id: loanId },
        data: {
          ...editLoanDto,
          updatedAt: new Date(),
        },
      });

      await this.loggingService.info("Loan updated successfully", {
        loanId,
        updatedFields: Object.keys(editLoanDto),
      });

      return updatedLoan;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to edit loan", {
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
    editVerificationDto: EditVerificationDto
  ) {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: {
          loanId,
          type: verificationType,
        },
      });

      if (!verification) {
        await this.loggingService.warn(
          "Verification edit failed - Verification not found",
          {
            loanId,
            verificationType,
          }
        );
        throw new NotFoundException("Verification not found");
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

      await this.loggingService.info("Verification data updated successfully", {
        loanId,
        verificationType,
        updatedFields: Object.keys(editVerificationDto),
      });

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to edit verification data", {
        loanId,
        verificationType,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async generateFinalReportPDF(
    loanId: number,
    addressType: AddressType
  ): Promise<string> {
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
            fieldExecutive: { select: { name: true } },
          },
        },
      },
    });

    if (!loan) {
      throw new NotFoundException("Loan not found");
    }

    const verification = loan.verifications[0];

    if (!verification) {
      throw new NotFoundException(
        `Verification for address type ${addressType} not found`
      );
    }

    const finalReportPath = verification.finalReportPath;

    let finalReportPdfUrl = "";

    const s3_path = `final_pdf/${loanId}/${addressType}.pdf`;

    if (finalReportPath) {
      finalReportPdfUrl =
        await this.s3Service.generatePresignedDownloadUrl(finalReportPath);
      return finalReportPdfUrl;
    } else {
      const pdfBuffer = await this.generateVerificationPDF(loanId, addressType);

      const pdfUrl = await this.s3Service.uploadPdfToS3(pdfBuffer, s3_path);

      const updatedVerification = await this.prisma.verification.update({
        where: { id: verification.id },
        data: { finalReportPath: s3_path },
      });

      return pdfUrl;
    }
  }

  async returnHTMLImageData(
    data: string[],
    bankName: string,
    fieldExecutive: string
  ): Promise<string> {
    return `
    <div style="page-break-before: always;"></div>
      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Uploaded Documents and Images</td></tr>
          <tr>
            <td colspan="6">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 20px;">
                ${data.join("")}
              </div>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  async formatImages(
    images: string[],
    bankName: string,
    fieldExecutive: string
  ): Promise<string> {
    let result = [];
    let finalResult = [];
    let count = 0;
    const date = new Date();
    const timeZone = "Asia/Kolkata";
    const zonedDate = toZonedTime(date, timeZone);
    const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", {
      timeZone,
    });
    for (let i = 0; i < images.length; i++) {
      result.push(`<div style="width: 70%; margin: 1%; border: 1px solid #ddd; padding: 10px; text-align: center; display: inline-block; vertical-align: top; box-sizing: border-box; page-break-inside: avoid;">
                  <img src="${images[i]}" style="width: 100%; height: 300px; object-fit: contain; margin-bottom: 10px;" />
                  <div style="font-size: 12px; color: #666;">Uploaded on: ${istDate}</div>
                  </div>`);

      count++;
      if (count % 4 === 0) {
        finalResult.push(
          await this.returnHTMLImageData(result, bankName, fieldExecutive)
        );
        result = [];
        count = 0;
      }
    }

    if (count > 0 && count < 4) {
      finalResult.push(
        await this.returnHTMLImageData(result, bankName, fieldExecutive)
      );
    }

    return finalResult.join("");
  }

  async generateVerificationPDF(
    loanId: number,
    addressType: AddressType
  ): Promise<Buffer> {
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
              fieldExecutive: { select: { name: true } },
            },
          },
        },
      });

      if (!loan) {
        throw new NotFoundException("Loan not found");
      }

      const verification = loan.verifications[0];

      if (!verification) {
        throw new NotFoundException(
          `Verification for address type ${addressType} not found`
        );
      }

      const status = verification?.approvedStatus || "";

      // let address = verification.fieldExecutive?.office?.address || '' +
      //   ', ' + verification.fieldExecutive?.office?.location || '' +
      //   ', ' + verification.fieldExecutive?.office?.name || '';
      let address = "";
      // address = address.toLocaleLowerCase();

      // Get the verification data
      let verificationData:
        | VerificationData
        | WorkVerificationData
        | BusinessVerificationData = {};
      if (addressType === "Work") {
        verificationData =
          (verification.verificationData as WorkVerificationData) || {};
      } else if (addressType === "Business") {
        verificationData =
          (verification.verificationData as BusinessVerificationData) || {};
      } else if (
        addressType === "PermanentAddress" ||
        addressType === "CurrentAddress"
      ) {
        verificationData =
          (verification.verificationData as VerificationData) || {};
      } else {
        throw new NotFoundException("Invalid address type");
      }

      const imagePath = path.resolve(
        process.env.SIGNATURE_PATH || "/home/ubuntu/kowtha/new_sign.jpg"
      );
      const imageBase64 = fs.readFileSync(imagePath, "base64");
      const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

      // Get uploaded items for this verification only
      const uploadedItems = verificationData?.uploadedItems || [];

      // Generate presigned URLs for images
      const imageUrls = await Promise.all(
        uploadedItems.map(async (item) => {
          try {
            return await this.s3Service.generatePresignedDownloadUrl(
              item.s3ImageUrl
            );
          } catch (error) {
            await this.loggingService.error(
              "Failed to generate presigned URL for image",
              {
                s3ImageUrl: item.s3ImageUrl,
                error: error.message,
              }
            );
            return null;
          }
        })
      );

      // Filter out any failed URL generations
      const validImageUrls = imageUrls.filter((url) => url !== null);

      let htmlTemplate = "";

      const imagesData = await this.formatImages(
        validImageUrls,
        loan.bankName,
        verification.fieldExecutive?.name || ""
      );

      const html_data = {
        bankName: loan.bankName,
        path: verification.path,
        status: status,
        imageDataUri: imageDataUri,
        imagesData: imagesData,
        fieldExecutive: verification.fieldExecutive?.name || "",
      };

      if (
        addressType === "PermanentAddress" ||
        addressType === "CurrentAddress"
      ) {
        htmlTemplate =
          this.generateBaseHTMLTemplate(loan, address) +
          addressTemplate(
            verificationData as VerificationData,
            html_data,
            addressType
          );
      } else if (addressType === "Work") {
        htmlTemplate =
          this.generateBaseHTMLTemplate(loan, address) +
          workTemplate(verificationData as WorkVerificationData, html_data);
      } else if (addressType === "Business") {
        htmlTemplate =
          this.generateBaseHTMLTemplate(loan, address) +
          businessTemplate(
            verificationData as BusinessVerificationData,
            html_data
          );
      } else {
        throw new NotFoundException("Invalid address type");
      }
      // Launch a new browser instance
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--lang=en-IN",
          "--intl.accept_languages=en-IN",
        ],
      });

      // Create a new page
      const page = await browser.newPage();

      // Set content to the HTML template
      await page.setContent(htmlTemplate, {
        waitUntil: "networkidle0",
      });

      // Generate PDF
      const pdfArray = await page.pdf({
        format: "a4",
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
        printBackground: true,
        preferCSSPageSize: true,
      });
      const pdfBuffer: Buffer = Buffer.from(pdfArray);

      // Close the browser
      await browser.close();

      await this.loggingService.info(
        "Verification PDF generated successfully",
        {
          loanId,
          addressType,
          applicationNumber: loan.applicationNumber,
        }
      );

      return pdfBuffer;
    } catch (error) {
      await this.loggingService.error("Failed to generate verification PDF", {
        loanId,
        addressType,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private generateBaseHTMLTemplate(loan: any, address: string): string {
    let mailId = "";

    if (address.includes("vijayawada")) {
      mailId = "apfi@cakowtha.co.in";
    } else {
      mailId = "tsfi@cakowtha.co.in";
    }

    return baseTemplate(address, mailId, loan);
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
        throw new NotFoundException("Verification not found");
      }

      const updatedVerification = await this.prisma.verification.update({
        where: { id: verification.id },
        data: {
          approvedStatus,
          status: VerificationStatus.Completed,
          ...(path !== undefined && { path }),
        },
      });

      await this.loggingService.info("Verification approval updated", {
        loanId,
        verificationType,
        approvedStatus,
        path,
      });
      return updatedVerification;
    } catch (error) {
      await this.loggingService.error(
        "Failed to update verification approval",
        {
          loanId,
          verificationType,
          approvedStatus,
          path,
          error: error.message,
          stack: error.stack,
        }
      );
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
              applicantName: true,
            },
          },
        },
      });

      if (!verification) {
        throw new NotFoundException("Verification not found");
      }

      // Validate that the field executive exists
      const fieldExecutive = await this.prisma.user.findUnique({
        where: { id: createVerificationRetryDto.fieldExecutiveId },
      });

      if (!fieldExecutive) {
        throw new NotFoundException("Field executive not found");
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
                  applicantName: true,
                },
              },
            },
          },
          fieldExecutive: {
            select: {
              id: true,
              name: true,
              mobile: true,
              employeeCode: true,
            },
          },
        },
      });

      const updateVerification = await this.prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          isPostponed: true,
          postponedDate: new Date(createVerificationRetryDto.date),
          postponedReason: createVerificationRetryDto.reason,
        },
      });

      await this.loggingService.info(
        "Verification retry created successfully",
        {
          verificationRetryId: verificationRetry.id,
          verificationId: createVerificationRetryDto.verificationId,
          fieldExecutiveId: createVerificationRetryDto.fieldExecutiveId,
          loanId: verification.loan.id,
          applicationNumber: verification.loan.applicationNumber,
        }
      );

      return verificationRetry;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to create verification retry", {
        data: createVerificationRetryDto,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async createPDEmailLog(data: CreatePDEmailLogDto) {
    try {
      // If loanId is provided, verify the loan exists
      if (data.loanId) {
        const loan = await this.prisma.loan.findUnique({
          where: { id: data.loanId },
        });

        if (!loan) {
          throw new NotFoundException("Loan not found");
        }
      }

      const pdEmailLog = await this.prisma.pDEmailLog.create({
        data: {
          messageID: data.messageID,
          fromEmail: data.fromEmail,
          toEmail: data.toEmail,
          ccEmail: data.ccEmail,
          bccEmail: data.bccEmail,
          subject: data.subject,
          body: data.body,
          attachments: data.attachments,
          receivedAt: data.receivedAt ? new Date(data.receivedAt) : null,
          parsedData: data.parsedData,
          s3Path: data.s3Path,
          ...(data.loanId && { loan: { connect: { id: data.loanId } } }),
        },
        include: {
          loan: true,
        },
      });

      await this.loggingService.info("PD Email Log created successfully", {
        pdEmailLogId: pdEmailLog.id,
        messageID: pdEmailLog.messageID,
        subject: pdEmailLog.subject,
        loanId: pdEmailLog.loanId,
      });

      return pdEmailLog;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to create PD Email Log", {
        data,
        error: error.message,
        stack: error.stack,
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
        const verificationIds = verifications.map((v) => v.id);
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

        await this.loggingService.info(
          "Loan and all related entities deleted",
          {
            loanId,
          }
        );
        return {
          message: "Loan and all related entities deleted",
          deletedLoan,
        };
      });
    } catch (error) {
      await this.loggingService.error(
        "Failed to delete loan and related entities",
        {
          loanId,
          error: error.message,
          stack: error.stack,
        }
      );
      throw error;
    }
  }

  async reassignLoan(originalLoanId: number, department: Department) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const originalLoan = await prisma.loan.findUnique({
          where: { id: originalLoanId, department },
          include: {
            verifications: true,
          },
        });

        if (!originalLoan) {
          throw new NotFoundException("Loan not found");
        }

        const newLoan = await prisma.loan.create({
          data: {
            applicationNumber: originalLoan.applicationNumber,
            applicantName: originalLoan.applicantName,
            applicantMobile: originalLoan.applicantMobile,
            applicantAddress: originalLoan.applicantAddress,
            applicantAddress1: originalLoan.applicantAddress1,
            applicantAddress2: originalLoan.applicantAddress2,
            applicantType: originalLoan.applicantType,
            isAddressSame: originalLoan.isAddressSame,
            loanType: originalLoan.loanType,
            bankName: originalLoan.bankName,
            templateName: originalLoan.templateName,
            loanAmount: originalLoan.loanAmount,
            status: originalLoan.status,
            department: originalLoan.department,
            reassignCount: originalLoan.reassignCount + 1,
            office: { connect: { id: originalLoan.officeId } },
            ...(originalLoan.operationsExecutiveId && {
              operationsExecutive: {
                connect: { id: originalLoan.operationsExecutiveId },
              },
            }),
          },
        });

        if (
          originalLoan.verifications &&
          originalLoan.verifications.length > 0
        ) {
          for (const v of originalLoan.verifications) {
            await prisma.verification.create({
              data: {
                loan: { connect: { id: newLoan.id } },
                type: v.type,
                addressType: v.addressType,
                department: department,
                ...(v.verifierId && {
                  verifier: { connect: { id: v.verifierId } },
                }),
                fieldExecutive: { connect: { id: v.fieldExecutiveId } },
                status: VerificationStatus.Pending,
                locationType: v.locationType,
                isPostponed: false,
                postponedDate: null,
                postponedReason: null,
                businessName: v.businessName,
                currentOfficeName: null,
                applicantAddress: v.applicantAddress,
                verificationData: v.verificationData,
              },
            });
          }
        }

        await this.loggingService.info(
          "Loan reassigned by cloning with incremented reassignCount",
          {
            originalLoanId,
            newLoanId: newLoan.id,
            previousReassignCount: originalLoan.reassignCount,
            newReassignCount: newLoan.reassignCount,
            verificationsCloned: originalLoan.verifications?.length || 0,
          }
        );

        return newLoan;
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to reassign loan", {
        originalLoanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // PD Verification PDF Generation

  async generatePDFinalReportPDF(loanId: number) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
        include: {
          verifications: {
            where: { addressType: "Business" },
            select: {
              id: true,
              type: true,
              status: true,
              approvedStatus: true,
              updatedAt: true,
              verificationData: true,
              path: true,
              finalReportPath: true,
              fieldExecutive: { select: { name: true } },
            },
          },
        },
      });

      if (!loan) {
        throw new NotFoundException("Loan not found");
      }

      const verification = loan.verifications[0];

      if (!verification) {
        throw new NotFoundException(
          `Verification for address type Business not found`
        );
      }

      const finalReportPath = verification.finalReportPath;

      if (!finalReportPath) {
        throw new NotFoundException("Final report path not found");
      }

      const finalReportPdfUrl =
        await this.s3Service.generatePresignedDownloadUrl(finalReportPath);

      return finalReportPdfUrl;
    } catch (error) {
      await this.loggingService.error("Failed to generate Final Report PDF", {
        loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async createFinancialAnalysis(
    loanId: number,
    financialAnalysisData: any,
    synopsis?: string
  ) {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: {
          loanId,
          department: Department.PD,
          type: VerificationType.Business,
        },
      });

      if (!verification) {
        await this.loggingService.warn(
          "Financial analysis creation failed - Verification not found",
          {
            loanId,
          }
        );
        throw new NotFoundException("Verification not found");
      }

      const updatedVerification = await this.prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          financialAnalysis: financialAnalysisData,
          ...(synopsis && { synopsis }),
        },
      });

      if (
        updatedVerification.initialSubmitted === false &&
        updatedVerification.financialAnalysis !== null &&
        updatedVerification.synopsis !== null
      ) {
        await this.prisma.verification.update({
          where: { id: verification.id },
          data: { initialSubmitted: true },
        });
      }

      await this.loggingService.info(
        "Financial analysis created successfully",
        {
          loanId,
          verificationId: verification.id,
        }
      );

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to create financial analysis", {
        loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateFinancialAnalysis(
    loanId: number,
    financialAnalysisData: any,
    synopsis?: string
  ) {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: {
          loanId,
          department: Department.PD,
          type: VerificationType.Business,
        },
      });

      if (!verification) {
        await this.loggingService.warn(
          "Financial analysis update failed - Verification not found",
          {
            loanId,
          }
        );
        throw new NotFoundException("Verification not found");
      }

      // Merge existing financialAnalysis with new data to preserve unchanged fields
      const existingFinancialAnalysis =
        (verification.financialAnalysis as any) || {};
      const mergedFinancialAnalysis = {
        ...existingFinancialAnalysis,
        ...financialAnalysisData,
      };

      const updatedVerification = await this.prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          financialAnalysis: mergedFinancialAnalysis,
          ...(synopsis !== undefined && { synopsis }),
          updatedAt: new Date(),
        },
      });

      await this.loggingService.info(
        "Financial analysis updated successfully",
        {
          loanId,
          verificationId: verification.id,
          updatedFields: Object.keys(financialAnalysisData),
        }
      );

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error("Failed to update financial analysis", {
        loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async submitVerificationExecutive(
    loanId: number,
    verificationType: VerificationType,
    verificationData: any,
    financialAnalysisData: any,
    synopsis?: string
  ) {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: {
          loanId,
          type: verificationType,
        },
      });

      if (!verification) {
        await this.loggingService.warn(
          "Verification executive submission failed - Verification not found",
          {
            loanId,
            verificationType,
          }
        );
        throw new NotFoundException("Verification not found");
      }

      // Merge existing financialAnalysis with new data to preserve unchanged fields
      const existingFinancialAnalysis =
        (verification.financialAnalysis as any) || {};
      const mergedFinancialAnalysis = {
        ...existingFinancialAnalysis,
        ...financialAnalysisData,
      };

      const updatedVerification = await this.prisma.verification.update({
        where: {
          id: verification.id,
        },
        data: {
          verificationData,
          financialAnalysis: mergedFinancialAnalysis,
          ...(synopsis !== undefined && { synopsis }),
          initialSubmitted: true,
          status: VerificationStatus.Completed,
          updatedAt: new Date(),
        },
      });

      await this.loggingService.info(
        "Verification executive submission completed successfully",
        {
          loanId,
          verificationId: verification.id,
          verificationType,
          initialSubmitted: true,
        }
      );

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error(
        "Failed to submit verification executive data",
        {
          loanId,
          verificationType,
          error: error.message,
          stack: error.stack,
        }
      );
      throw error;
    }
  }

  async exportFinancialAnalysisToExcel(loanId: number, bankName?: string): Promise<Buffer> {
    try {
      // If no bankName provided, fetch it from the loan
      if (!bankName) {
        const loan = await this.prisma.loan.findUnique({
          where: { id: loanId },
          select: { templateName: true },
        });
        if (!loan) {
          throw new NotFoundException('Loan not found');
        }
        bankName = loan.templateName;
      }

      const templatesService = await this.getFinancialAnalysisTemplatesService();

      return await templatesService.exportFinancialAnalysisToExcel(loanId, bankName);
    } catch (error) {
      await this.loggingService.error(
        'Failed to export financial analysis to Excel',
        {
          loanId,
          bankName,
          error: error.message,
          stack: error.stack,
        }
      );
      throw error;
    }
  }

  // DEPRECATED: Old implementation kept for reference
  // async exportFinancialAnalysisToExcelOld(loanId: number): Promise<Buffer> {
  //   const ExcelJS = await import("exceljs");

  //   try {
  //     // Fetch verification with financial analysis
  //     const verification = await this.prisma.verification.findFirst({
  //       where: {
  //         loanId,
  //         department: Department.PD,
  //         type: VerificationType.Business,
  //       },
  //       include: {
  //         loan: true,
  //       },
  //     });

  //     if (!verification) {
  //       throw new NotFoundException("Verification not found");
  //     }

  //     const financialAnalysis = (verification.financialAnalysis as any) || {};

  //     // Create workbook and worksheet
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet("Financial Analysis");

  //     // Set column widths
  //     worksheet.columns = [
  //       { width: 25 }, // A - Left Particulars
  //       { width: 15 }, // B - Left Actuals
  //       { width: 15 }, // C - Left Estimations
  //       { width: 25 }, // D - Right Particulars
  //       { width: 15 }, // E - Right Actuals
  //       { width: 15 }, // F - Right Estimations
  //     ];

  //     // Add title
  //     const titleRow = worksheet.addRow([
  //       "Trading and Profit & Loss Account for the year ending 31.03.2026",
  //     ]);
  //     worksheet.mergeCells("A1:F1");
  //     titleRow.font = { bold: true, size: 14 };
  //     titleRow.alignment = { horizontal: "center", vertical: "middle" };
  //     titleRow.height = 30;

  //     // Add header row
  //     const headerRow = worksheet.addRow([
  //       "Particulars",
  //       "Actuals",
  //       "Estimations",
  //       "Particulars",
  //       "Actuals",
  //       "Estimations",
  //     ]);
  //     headerRow.font = { bold: true };
  //     headerRow.alignment = { horizontal: "center", vertical: "middle" };
  //     headerRow.eachCell((cell) => {
  //       cell.fill = {
  //         type: "pattern",
  //         pattern: "solid",
  //         fgColor: { argb: "FFE0E0E0" },
  //       };
  //       cell.border = {
  //         top: { style: "thin" },
  //         left: { style: "thin" },
  //         bottom: { style: "thin" },
  //         right: { style: "thin" },
  //       };
  //     });

  //     // Define the rows structure based on the screenshot
  //     const leftItems = [
  //       { label: "To Opening Stock", key: "openingStock" },
  //       { label: "To Purchase", key: "purchase" },
  //       { label: "To Cost of Services", key: "costOfServices" },
  //       { label: "To Wages", key: "wages" },
  //       { label: "To Hamali Charges", key: "hamaliCharges" },
  //       { label: "To Manufacturing Expenses", key: "manufacturingExpenses" },
  //       { label: "To Packing Charges", key: "packingCharges" },
  //       { label: "", key: "" }, // Empty row
  //       { label: "To Gross Profit", key: "grossProfit", isBold: true },
  //       { label: "", key: "" }, // Empty row
  //       { label: "To Salaries", key: "salaries" },
  //       { label: "To Rent", key: "rent" },
  //       { label: "To Electricity Charges", key: "electricityCharges" },
  //       { label: "To Printing & Stationery", key: "printingStationery" },
  //       { label: "To Telephone Charges", key: "telephoneCharges" },
  //       { label: "To Postage & Telegram", key: "postageTelegram" },
  //       { label: "To Office Maintenance", key: "officeMaintenance" },
  //       { label: "To Repairs & Maintenance", key: "repairsMaintenance" },
  //       { label: "To Sadar Expenses", key: "sadarExpenses" },
  //       { label: "To Audit Fee", key: "auditFee" },
  //       { label: "To Advertisement", key: "advertisement" },
  //       { label: "To Bank Charges", key: "bankCharges" },
  //       { label: "To Insurance", key: "insurance" },
  //       { label: "To Depreciation", key: "depreciation" },
  //       { label: "To Interest on Loan", key: "interestOnLoan" },
  //       { label: "", key: "" }, // Empty row
  //       { label: "To Net Profit", key: "netProfit", isBold: true },
  //       { label: "", key: "" }, // Empty row
  //     ];

  //     const rightItems = [
  //       { label: "By Sales", key: "sales" },
  //       { label: "By Services", key: "services" },
  //       { label: "By Closing Stock", key: "closingStock" },
  //       { label: "", key: "" }, // Empty row
  //       { label: "", key: "" }, // Empty row
  //       { label: "", key: "" }, // Empty row
  //       { label: "", key: "" }, // Empty row
  //       { label: "", key: "" }, // Empty row
  //       { label: "By Gross Profit", key: "grossProfit", isBold: true },
  //       { label: "By Rent Received", key: "rentReceived" },
  //       { label: "By Commission Received", key: "commissionReceived" },
  //       // Fill rest with empty rows to match left side
  //       ...Array(17).fill({ label: "", key: "" }),
  //     ];

  //     // Add data rows
  //     let lastRowNumber = 2; // Start after header
  //     for (let i = 0; i < Math.max(leftItems.length, rightItems.length); i++) {
  //       const leftItem = leftItems[i] || { label: "", key: "" };
  //       const rightItem = rightItems[i] || { label: "", key: "" };

  //       const row = worksheet.addRow([
  //         leftItem.label,
  //         leftItem.key ? financialAnalysis[leftItem.key] || "" : "",
  //         "", // Estimations column - left empty for now
  //         rightItem.label,
  //         rightItem.key ? financialAnalysis[rightItem.key] || "" : "",
  //         "", // Estimations column - left empty for now
  //       ]);

  //       // Apply bold formatting to gross profit and net profit rows
  //       if (leftItem.isBold || rightItem.isBold) {
  //         row.font = { bold: true };
  //       }

  //       // Apply borders
  //       row.eachCell((cell) => {
  //         cell.border = {
  //           top: { style: "thin" },
  //           left: { style: "thin" },
  //           bottom: { style: "thin" },
  //           right: { style: "thin" },
  //         };
  //         cell.alignment = { vertical: "middle" };
  //       });

  //       // Align numbers to the right
  //       if (row.getCell(2).value) {
  //         row.getCell(2).alignment = {
  //           horizontal: "right",
  //           vertical: "middle",
  //         };
  //       }
  //       if (row.getCell(3).value) {
  //         row.getCell(3).alignment = {
  //           horizontal: "right",
  //           vertical: "middle",
  //         };
  //       }
  //       if (row.getCell(5).value) {
  //         row.getCell(5).alignment = {
  //           horizontal: "right",
  //           vertical: "middle",
  //         };
  //       }
  //       if (row.getCell(6).value) {
  //         row.getCell(6).alignment = {
  //           horizontal: "right",
  //           vertical: "middle",
  //         };
  //       }

  //       lastRowNumber++;
  //     }

  //     // Add signature at the end
  //     try {
  //       const signaturePath = path.resolve(
  //         process.cwd(),
  //         process.env.SIGNATURE_PATH || ""
  //       );
  //       if (fs.existsSync(signaturePath)) {
  //         // Add some spacing
  //         worksheet.addRow([]);
  //         worksheet.addRow([]);
  //         lastRowNumber += 3;

  //         // Add signature label
  //         const signatureRow = worksheet.addRow([]);
  //         signatureRow.getCell(1).font = { bold: true };
  //         signatureRow.getCell(1).alignment = {
  //           horizontal: "right",
  //           vertical: "middle",
  //         };
  //         lastRowNumber++;

  //         // Read signature image
  //         const imageBuffer = fs.readFileSync(signaturePath);

  //         // Add image to workbook
  //         const imageId = workbook.addImage({
  //           buffer: imageBuffer as any,
  //           extension: "jpeg",
  //         });

  //         // Position the image (left-aligned, below the signature label)
  //         worksheet.addImage(imageId, {
  //           tl: { col: 0, row: lastRowNumber }, // top-left position (column A, left-aligned)
  //           ext: { width: 350, height: 250 }, // image dimensions
  //         });

  //         // Add extra rows to make space for the image
  //         worksheet.addRow([]);
  //         worksheet.addRow([]);
  //         worksheet.addRow([]);
  //         worksheet.addRow([]);
  //       }
  //     } catch (signatureError) {
  //       // Log error but don't fail the export if signature is missing
  //       await this.loggingService.warn(
  //         "Failed to add signature to Excel export",
  //         {
  //           loanId,
  //           error: signatureError.message,
  //         }
  //       );
  //     }

  //     // Generate buffer
  //     const buffer = await workbook.xlsx.writeBuffer();

  //     await this.loggingService.info(
  //       "Financial analysis exported to Excel successfully",
  //       { loanId }
  //     );

  //     return Buffer.from(buffer);
  //   } catch (error) {
  //     await this.loggingService.error(
  //       "Failed to export financial analysis to Excel",
  //       {
  //         loanId,
  //         error: error.message,
  //         stack: error.stack,
  //       }
  //     );
  //     throw error;
  //   }
  // }
}
