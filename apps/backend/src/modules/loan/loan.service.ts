import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import pLimit from "p-limit";
import { Buffer } from "buffer"; 
import * as puppeteer from "puppeteer";
import { Logger } from "@nestjs/common";
import { Worker } from "worker_threads";
import { ModuleRef } from "@nestjs/core";
import { format, toZonedTime } from "date-fns-tz";
import { GetLoansDto } from "./dto/get-loans.dto";
import { EditLoanDto } from "./dto/edit-loan.dto";
import { PrismaService } from "../../prisma.service";
import { CreateLoanDto } from "./dto/create-loan.dto";
import { S3Service } from "../common/s3utils/s3.service";
import { getFooterNameFromTemplate } from "./forms-schema";
import { baseTemplate } from "./templates/FI/base.template";
import { workTemplate } from "./templates/FI/work.template";
import { PaginatedResponse } from "../common/dto/pagination.dto";
import { CreateLambdaLoanDto } from "./dto/create-lamba-loan.dto";
import { addressTemplate } from "./templates/FI/address.template";
import { createAssignmentDto } from "./dto/assign-loan-executive";
import { UpdateAssignmentDto } from "./dto/update-assignment.dto";
import { EditVerificationDto } from "./dto/edit-verification.dto";
import { LoggingService } from "../common/logging/logging.service";
import { SMSUtils } from "../common/smsutils";
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
  EditRequestType,
  EditRequestStatus,
} from "@prisma/client";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleDestroy,
} from "@nestjs/common";

const imageWorkerLimit = pLimit(2);

@Injectable()
export class LoanService implements OnModuleDestroy {
  private financialAnalysisTemplatesService: any;
  private pdTemplateServiceInstance: any;
  private browserPromise: Promise<puppeteer.Browser> | null = null;
  private pdfQueue: Promise<any> = Promise.resolve();
  private pdfConcurrency = 0;
  private readonly MAX_PDF_CONCURRENCY = 2;
  private readonly reportTelemetryEnabled =
    process.env.ENABLE_REPORT_TELEMETRY !== "false";
  private readonly reportTelemetryTag = "TEMP_REPORT_TELEMETRY";
  private cachedSignatureDataUri: string | null = null;
  private cachedFISignatureDataUri: string | null = null;

  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
    private logger: Logger,
    private s3Service: S3Service,
    private moduleRef: ModuleRef
  ) { }

  async onModuleDestroy() {
    const browser = await this.browserPromise?.catch(() => null);
    if (browser && browser.isConnected()) {
      await browser.close().catch(() => undefined);
    }
    this.browserPromise = null;
  }

  private bytesToMb(value: number | undefined): number {
    return Number(((value || 0) / 1024 / 1024).toFixed(2));
  }

  private getReportTelemetrySnapshot() {
    const memory = process.memoryUsage();
    return {
      rssMb: this.bytesToMb(memory.rss),
      heapUsedMb: this.bytesToMb(memory.heapUsed),
      heapTotalMb: this.bytesToMb(memory.heapTotal),
      externalMb: this.bytesToMb(memory.external),
      arrayBuffersMb: this.bytesToMb(memory.arrayBuffers),
      uptimeSec: Number(process.uptime().toFixed(1)),
      loadAverage: os.loadavg().map((value) => Number(value.toFixed(2))),
      activePdfConcurrency: this.pdfConcurrency,
      maxPdfConcurrency: this.MAX_PDF_CONCURRENCY,
    };
  }

  private getCpuUsageDelta(startUsage: NodeJS.CpuUsage) {
    const delta = process.cpuUsage(startUsage);
    return {
      userMs: Number((delta.user / 1000).toFixed(2)),
      systemMs: Number((delta.system / 1000).toFixed(2)),
      totalMs: Number(((delta.user + delta.system) / 1000).toFixed(2)),
    };
  }

  private getSignatureDataUri(): string {
    if (this.cachedSignatureDataUri) {
      return this.cachedSignatureDataUri;
    }

    const imagePath = path.resolve(
      process.env.SIGNATURE_PATH || "/home/ubuntu/kowtha/new_sign.jpg"
    );
    const imageBase64 = fs.readFileSync(imagePath, "base64");
    this.cachedSignatureDataUri = `data:image/jpeg;base64,${imageBase64}`;
    return this.cachedSignatureDataUri;
  }

  private getFISignatureDataUri(): string {
    if (this.cachedFISignatureDataUri) {
      return this.cachedFISignatureDataUri;
    }

    const imagePath = path.resolve(
      process.env.FI_SIGNATURE_PATH ||
        path.join(__dirname, "..", "..", "images", "anifdat_sign.jpg")
    );
    const imageBase64 = fs.readFileSync(imagePath, "base64");
    this.cachedFISignatureDataUri = `data:image/jpeg;base64,${imageBase64}`;
    return this.cachedFISignatureDataUri;
  }

  private async logReportTelemetry(
    event: string,
    payload: Record<string, any>,
    level: "info" | "warn" | "error" = "info"
  ) {
    if (!this.reportTelemetryEnabled) {
      return;
    }

    const message = `[${this.reportTelemetryTag}] ${event}`;
    if (level === "warn") {
      await this.loggingService.warn(message, payload);
      return;
    }
    if (level === "error") {
      await this.loggingService.error(message, payload);
      return;
    }
    await this.loggingService.info(message, payload);
  }

  // Lazy load PDTemplateService to avoid circular dependency
  private async getPDTemplateService() {
    if (!this.pdTemplateServiceInstance) {
      const { PDTemplateService } = await import("./pd-templates.service");
      this.pdTemplateServiceInstance = this.moduleRef.get(PDTemplateService, {
        strict: false,
      });
    }
    return this.pdTemplateServiceInstance;
  }

  // Lazy loading to avoid circular dependencies
  private async getFinancialAnalysisTemplatesService() {
    if (!this.financialAnalysisTemplatesService) {
      const { FinancialAnalysisTemplatesService } = await import(
        "./financial-analysis.service"
      );

      this.financialAnalysisTemplatesService =
        new FinancialAnalysisTemplatesService(this.prisma, this.loggingService);
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

  private async getPdfBrowser(): Promise<puppeteer.Browser> {
    if (this.browserPromise) {
      const browser = await this.browserPromise.catch(() => null);
      if (browser && browser.isConnected()) {
        await this.logReportTelemetry("pdf_browser_reused", {
          ...this.getReportTelemetrySnapshot(),
        });
        return browser;
      }
      this.browserPromise = null;
    }
    const launchStartedAt = Date.now();
    this.browserPromise = puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--lang=en-IN",
        "--intl.accept_languages=en-IN",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    });
    const browser = await this.browserPromise;
    await this.logReportTelemetry("pdf_browser_launched", {
      launchDurationMs: Date.now() - launchStartedAt,
      ...this.getReportTelemetrySnapshot(),
    });
    browser.on("disconnected", () => {
      this.logger.warn("Puppeteer browser disconnected, will re-launch on next request");
      this.browserPromise = null;
    });
    return browser;
  }

  private async withPdfQueue<T>(
    reportType: string,
    metadata: Record<string, any>,
    fn: (queueWaitMs: number) => Promise<T>
  ): Promise<T> {
    const queuedAt = Date.now();
    while (this.pdfConcurrency >= this.MAX_PDF_CONCURRENCY) {
      await this.pdfQueue;
    }
    const queueWaitMs = Date.now() - queuedAt;
    this.pdfConcurrency++;
    let resolve: () => void;
    const slot = new Promise<void>((r) => (resolve = r));
    this.pdfQueue = slot;
    try {
      await this.logReportTelemetry("pdf_queue_acquired", {
        reportType,
        queueWaitMs,
        ...metadata,
        ...this.getReportTelemetrySnapshot(),
      });
      return await fn(queueWaitMs);
    } finally {
      this.pdfConcurrency--;
      resolve!();
    }
  }

  async PDFBufferGeneration(
    htmlTemplate: string,
    bankName?: string
  ): Promise<Buffer> {
    const startedAt = Date.now();
    const startCpuUsage = process.cpuUsage();
    const startSnapshot = this.getReportTelemetrySnapshot();
    const htmlSizeBytes = Buffer.byteLength(htmlTemplate || "", "utf8");

    await this.logReportTelemetry("pdf_buffer_generation_started", {
      reportType: "pd-preview-pdf",
      bankName: bankName || "Kowtha",
      htmlSizeBytes,
      ...startSnapshot,
    });

    try {
      return await this.withPdfQueue(
        "pd-preview-pdf",
        {
          bankName: bankName || "Kowtha",
          htmlSizeBytes,
        },
        async (queueWaitMs) => {
          const browser = await this.getPdfBrowser();
          const page = await browser.newPage();
          try {
            // Images are inlined as base64 data URIs upstream — no network fetches.
            await page.setContent(htmlTemplate, {
              waitUntil: "domcontentloaded",
              timeout: 30000,
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

            const pdfArray = await page.pdf({
              format: "a4",
              margin: {
                top: "60px",
                right: "20px",
                bottom: "80px",
                left: "20px",
              },
              printBackground: true,
              preferCSSPageSize: false,
              displayHeaderFooter: true,
              headerTemplate: `
          <div style="
              font-size: 8px;
              width: 100%;
              padding: 4px 16px;
              color: #999;
              text-align: center;
            ">
            <!-- ${bankName || "Kowtha"} - Verification Report -->
          </div>
        `,
              footerTemplate: footerTemplate,
            });

            const pdfBuffer = Buffer.from(pdfArray);
            await this.logReportTelemetry("pdf_buffer_generation_completed", {
              reportType: "pd-preview-pdf",
              bankName: bankName || "Kowtha",
              durationMs: Date.now() - startedAt,
              queueWaitMs,
              htmlSizeBytes,
              pdfSizeBytes: pdfBuffer.length,
              cpuUsageMs: this.getCpuUsageDelta(startCpuUsage),
              startSnapshot,
              endSnapshot: this.getReportTelemetrySnapshot(),
            });

            return pdfBuffer;
          } finally {
            await page.close().catch(() => undefined);
          }
        }
      );
    } catch (error) {
      await this.logReportTelemetry(
        "pdf_buffer_generation_failed",
        {
          reportType: "pd-preview-pdf",
          bankName: bankName || "Kowtha",
          durationMs: Date.now() - startedAt,
          htmlSizeBytes,
          cpuUsageMs: this.getCpuUsageDelta(startCpuUsage),
          startSnapshot,
          endSnapshot: this.getReportTelemetrySnapshot(),
          error: error.message,
        },
        "error"
      );
      throw error;
    }
  }

  async findLoanByApplicationNumber(
    applicationNumber: string,
    bankName?: string
  ) {
    try {
      const where: any = {
        applicationNumber,
        department: "PD",
      };

      if (bankName) {
        where.bankName = bankName;
      }

      const loan = await this.prisma.loan.findFirst({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });

      return loan;
    } catch (error) {
      await this.loggingService.error(
        "Failed to find loan by application number",
        {
          applicationNumber,
          error: error.message,
          stack: error.stack,
        }
      );
      return null;
    }
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
          loanTag: data.loanTag,
          branch: data.branch,
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



  // Assign a field executive to a verification for a loan
  async assignVerification(
    loanId: number,
    createData: createAssignmentDto,
    department: Department
  ) {
    try {
      const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });

      if (!loan) {
        await this.loggingService.warn(
          "Verification assignment failed - Loan not found",
          { loanId }
        );
        throw new NotFoundException("Loan not found");
      }

      if (department === Department.PD && !loan.templateName) {
        throw new BadRequestException(
          "Please assign a template to the loan first"
        );
      }

      if (!createData.fieldExecutiveId) {
        throw new BadRequestException(
          "Field Executive ID is required when assigning a field executive"
        );
      }

      if (!createData.address || !createData.verificationType) {
        throw new BadRequestException(
          "Address and Verification Type is required when assigning a field executive"
        );
      }

      return await this.prisma.$transaction(async (prisma) => {
        let verificationData = await prisma.verification.create({
          data: {
            loan: { connect: { id: loan.id } },
            type: createData.verificationType || "AddressOne",
            ...(createData.verifierId && {
              verifier: { connect: { id: createData.verifierId } },
            }),
            fieldExecutive: { connect: { id: createData.fieldExecutiveId } },
            status: "Pending",
            applicantAddress: createData.address || null,
            locationType: createData.locationType || null,
            businessName: createData.businessName || null,
            currentOfficeName: createData.currentOfficeName || null,
            department: loan.department,
          },
        });

        if (createData.assistantVerifierId) {
          // console.log("assistantVerifierId", createData.assistantVerifierId);

          verificationData = await prisma.verification.update({
            where: { id: verificationData.id },
            data: { assistantVerifier: { connect: { id: createData.assistantVerifierId } } },
          });
        }

        const loanStatusChange = await prisma.loan.update({
          where: { id: loanId },
          data: { status: "Assigned" },
        });

        await this.loggingService.info("Verification assigned successfully", {
          loanId,
          createData,
        });

        return verificationData;
      });
    } catch (error) {
      if ( error instanceof NotFoundException || error instanceof BadRequestException ) {
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
    role: any,
    page: number = 1,
    limit: number = 10,
    filters?: {
      applicationNumber?: string;
      applicantName?: string;
    }
  ): Promise<PaginatedResponse<any>> {
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

      const loanFilters: Prisma.LoanWhereInput = {};
      if (filters?.applicationNumber) {
        loanFilters.applicationNumber = {
          contains: filters.applicationNumber,
          mode: "insensitive",
        };
      }
      if (filters?.applicantName) {
        loanFilters.applicantName = {
          contains: filters.applicantName,
          mode: "insensitive",
        };
      }
      if (Object.keys(loanFilters).length > 0) {
        where.loan = {
          is: loanFilters,
        };
      }

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
        where.assistantVerifierId = verifierId;
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
          updatedAt: "desc",
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

      const safeLimit = Math.max(1, Number.isFinite(limit) ? limit : 10);
      const total = loans.length;
      const totalPages = Math.max(1, Math.ceil(total / safeLimit));
      const safePage = Math.min(
        totalPages,
        Math.max(1, Number.isFinite(page) ? page : 1)
      );
      const startIndex = (safePage - 1) * safeLimit;
      const paginatedLoans = loans.slice(startIndex, startIndex + safeLimit);

      await this.loggingService.info("Retrieved loans by verifier", {
        verifierId,
        role,
        total,
        page: safePage,
        limit: safeLimit,
        count: paginatedLoans.length,
        filters,
      });

      return {
        items: paginatedLoans,
        meta: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages,
        },
      };
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
        where.status = filters.status as LoanStatus;
      }

      if (filters?.postponed) {
        if (filters.postponed === "true") {
          where.verifications = {
            some: {
              isPostponed: true,
              status: VerificationStatus.Pending,
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
              assistantVerifier: {
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
          pdEmailLogs: {
            orderBy: {
              receivedAt: "desc",
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

  async exportLoansCsv(
    officeId: number,
    filters?: GetLoansDto
  ): Promise<string> {
    const where: Prisma.LoanWhereInput = {
      department: filters.department,
    };

    if (filters?.status) {
      where.status = filters.status as LoanStatus;
    }

    if (filters?.bankName) {
      where.bankName = {
        contains: filters.bankName,
        mode: "insensitive",
      };
    }

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

    const loans = await this.prisma.loan.findMany({
      where,
      include: {
        operationsExecutive: {
          select: { name: true, employeeCode: true },
        },
        verifications: {
          include: {
            fieldExecutive: {
              select: { name: true, employeeCode: true },
            },
            verifier: {
              select: { name: true, employeeCode: true },
            },
            assistantVerifier: {
              select: { name: true, employeeCode: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const escCsv = (val: any) => {
      if (val == null) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = [
      "Application Number",
      "Applicant Name",
      "Mobile",
      "Loan Type",
      "Bank Name",
      "Loan Amount",
      "Applicant Type",
      "Status",
      "Loan Tag",
      "Branch",
      "Ops Executive",
      "Created At",
      "Closed At",
    ];

    const department = filters.department;

    if (department === "FI") {
      headers.push(
        "Address1 FE",
        "Address1 Status",
        "Address2 FE",
        "Address2 Status",
        "Work FE",
        "Work Status",
        "Business FE",
        "Business Status"
      );
    } else if (department === "PD") {
      headers.push(
        "Template Name",
        "Business FE",
        "Business Status",
        "Verifier",
        "Verification Executive"
      );
    }

    const rows = loans.map((loan) => {
      const getVer = (type: string) =>
        loan.verifications?.find((v) => v.type === type);

      const base = [
        escCsv(loan.applicationNumber),
        escCsv(loan.applicantName),
        escCsv(loan.applicantMobile),
        escCsv(loan.loanType),
        escCsv(loan.bankName),
        escCsv(loan.loanAmount),
        escCsv(loan.applicantType),
        escCsv(loan.status),
        escCsv(loan.loanTag),
        escCsv(loan.branch),
        escCsv(loan.operationsExecutive?.name),
        escCsv(
          loan.createdAt
            ? new Date(loan.createdAt).toISOString().slice(0, 10)
            : ""
        ),
        escCsv(
          loan.closedAt
            ? new Date(loan.closedAt).toISOString().slice(0, 10)
            : ""
        ),
      ];

      if (department === "FI") {
        for (const type of [
          "AddressOne",
          "AddressTwo",
          "Work",
          "Business",
        ]) {
          const v = getVer(type);
          base.push(
            escCsv(v?.fieldExecutive?.name),
            escCsv(v?.status)
          );
        }
      } else if (department === "PD") {
        const biz = getVer("Business");
        base.push(
          escCsv(loan.templateName),
          escCsv(biz?.fieldExecutive?.name),
          escCsv(biz?.status),
          escCsv(biz?.verifier?.name),
          escCsv(biz?.assistantVerifier?.name)
        );
      }

      return base.join(",");
    });

    return [headers.join(","), ...rows].join("\n");
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
        !updateData.verifierId &&
        !updateData.assistantVerifierId
      ) {
        throw new BadRequestException(
          "Address is required when assigning a field executive"
        );
      }

      // Start a transaction to ensure all operations succeed or fail together
      return await this.prisma.$transaction(async (prisma) => {
        const current = await prisma.verification.findUnique({
          where: {
            loanId_type: {
              loanId,
              type: updateData.verificationType,
            },
          },
          select: { fieldExecutiveId: true },
        });

        if (!current) {
          throw new NotFoundException("Verification not found");
        }

        const isReassigningFE =
          updateData.fieldExecutiveId !== undefined &&
          updateData.fieldExecutiveId !== current.fieldExecutiveId;

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
            ...(updateData.assistantVerifierId && {
              assistantVerifierId: updateData.assistantVerifierId,
            }),
            // Only reset verification.status when the FE is actually being
            // swapped. Editing verifier / assistant verifier / address / etc.
            // on a loan that has already moved past FVCompleted must not
            // bounce the case back into the FE's pending queue.
            ...(isReassigningFE && {
              status:
                loan.status === "FVCompleted"
                  ? VerificationStatus.Completed
                  : VerificationStatus.Pending,
            }),
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

      const where: Prisma.VerificationWhereInput = {
        fieldExecutiveId,
        department: filters.department,
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

      const orderBy: Prisma.VerificationOrderByWithRelationInput[] =
        filters?.status === VerificationStatus.Pending
          ? [
              { isPostponed: { sort: "asc", nulls: "first" } },
              { postponedDate: { sort: "asc", nulls: "first" } },
              { createdAt: "asc" },
            ]
          : [{ createdAt: "desc" }];

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
        orderBy,
        skip,
        take: Number(limit),
      });

      for (const verification of verifications) {
        const templateName = verification.loan?.templateName;
        const footerFromTemplate = templateName
          ? getFooterNameFromTemplate(templateName)
          : null;
        (verification as Record<string, unknown>).displayName =
          footerFromTemplate ?? verification.loan?.bankName ?? null;
      }

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
    addressType?: AddressType,
    department?: string
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
      // Process only photos (not documents) in verificationData if it exists
      // Documents (PDFs/DOCX) don't need geotag overlay processing
      // Only process images where isOverlayNeeded is true
      if (verificationData?.uploadedItems) {
        // Filter out PDFs/documents - they should never run worker
        // For images, only process if isOverlayNeeded is true
        const itemsToProcess = verificationData.uploadedItems.filter(
          (item: any) => {
            // Skip PDFs and documents completely
            if (item.type === "document" || item.fileType === "pdf") {
              return false;
            }
            // For images/photos, only process if isOverlayNeeded is true
            if (item.type === "photo" || !item.type || !item.fileType) {
              return item.isOverlayNeeded === true;
            }
            return false;
          }
        );

        if (itemsToProcess.length > 0) {
          await Promise.all(
            itemsToProcess.map((item: any) =>
              imageWorkerLimit(() =>
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
      }

      // Sync FE-editable loan fields back to the loan record (PD only)
      if (department === "PD" && verificationData?.basicDetails) {
        const loanUpdateData: any = {};
        if (verificationData.basicDetails.loanAmount) {
          loanUpdateData.loanAmount = parseFloat(
            verificationData.basicDetails.loanAmount
          );
        }
        if (verificationData.basicDetails.purposeOfLoan) {
          loanUpdateData.loanType = verificationData.basicDetails.purposeOfLoan;
        }
        if (Object.keys(loanUpdateData).length > 0) {
          await this.prisma.loan.update({
            where: { id: loanId },
            data: loanUpdateData,
          });
        }
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

      return { verification: updatedVerification };
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

      // Send SMS to applicant when FE starts verification (InProgress)
      if (status === VerificationStatus.InProgress) {
        try {
          const loan = await this.prisma.loan.findUnique({
            where: { id: loanId },
          });
          const fieldExecutive = await this.prisma.user.findUnique({
            where: { id: fieldExecutiveId },
          });
          if (loan?.applicantMobile && fieldExecutive?.name) {
            const smsUtils = new SMSUtils(this.loggingService);
            await smsUtils.sendVerificationAssigned(
              loan.applicantMobile,
              loan.applicationNumber || loanId.toString(),
              fieldExecutive.name
            );
          }
        } catch (smsError) {
          await this.loggingService.error("Failed to send SMS to applicant", {
            loanId,
            error: smsError.message,
          });
        }
      }

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
          ...(department === Department.PD && {
            pdEmailLogs: {
              orderBy: { receivedAt: "desc" },
              take: 1,
            },
          }),
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
      // console.error(
      //   `🔍 getVerificationData called for loan ${loanId}, department: ${department}`
      // );

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

          // console.error(`🔍 Processing verification ${verification.id}`);

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
        ...(department === Department.PD && {
          pdEmailLogs: (loan as any).pdEmailLogs || [],
        }),
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

      const updateData: any = {
        ...editLoanDto,
        updatedAt: new Date(),
      };

      // Convert closedAt string to Date object if provided
      if (editLoanDto.closedAt) {
        updateData.closedAt = new Date(editLoanDto.closedAt);
      }

      const updatedLoan = await this.prisma.loan.update({
        where: { id: loanId },
        data: updateData,
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
    editVerificationDto: EditVerificationDto,
    userId: number,
    department: Department
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

      try {
        let financialAnalysis =
          editVerificationDto.verificationData?.financialAnalysis;
        
        // console.log("financialAnalysis", financialAnalysis);

        let netProfit = financialAnalysis?.netProfit || financialAnalysis?.netProfitAfterTax || financialAnalysis?.netProfitEstimated;
        if ( netProfit && netProfit > 1000000) {

          await this.loggingService.info("Financial analysis is greater than 1000000", {
            loanId,
            verificationId: verification.id,
            financialAnalysis,
          });

          const checkAlreadyExists = await this.prisma.editRequest.findFirst({
            where: {
              loanId,
              verificationId: verification.id,
              type: EditRequestType.LoanData,
              status: EditRequestStatus.Approved,
              department: department,
            },
            orderBy: {
              createdAt: "desc",
            }
          });

          if (!checkAlreadyExists || (checkAlreadyExists && JSON.stringify(checkAlreadyExists.changes) !== JSON.stringify(financialAnalysis))) {
            delete editVerificationDto.verificationData?.financialAnalysis; // Remove financialAnalysis from editVerificationDto to avoid duplicate data
            const createEditRequest = await this.prisma.editRequest.create({
              data: {
                loan: {
                  connect: { id: loanId },
                },
                verification: {
                  connect: { id: verification.id },
                },
                requester: {
                  connect: { id: userId },
                },
                status: EditRequestStatus.Pending,
                type: EditRequestType.LoanData,
                changes: financialAnalysis,
                department: department,
                remarks: "Financial_Analysis",
              },
            });

            return verification;
          }
        }
      } catch (error) {
        await this.loggingService.error("Failed to edit verification data", {
          loanId,
          verificationType,
          error: error.message,
          stack: error.stack,
        });
        throw error;
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
    const startedAt = Date.now();
    const startSnapshot = this.getReportTelemetrySnapshot();

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
      await this.logReportTelemetry("final_report_cache_hit", {
        reportType: "verification-final-report",
        loanId,
        addressType,
        finalReportPath,
        durationMs: Date.now() - startedAt,
        startSnapshot,
        endSnapshot: this.getReportTelemetrySnapshot(),
      });
      return finalReportPdfUrl;
    } else {
      const pdfBuffer = await this.generateVerificationPDF(loanId, addressType);

      const pdfUrl = await this.s3Service.uploadPdfToS3(pdfBuffer, s3_path);

      const updatedVerification = await this.prisma.verification.update({
        where: { id: verification.id },
        data: { finalReportPath: s3_path },
      });

      await this.logReportTelemetry("final_report_generated_and_uploaded", {
        reportType: "verification-final-report",
        loanId,
        addressType,
        pdfSizeBytes: pdfBuffer.length,
        s3Path: s3_path,
        durationMs: Date.now() - startedAt,
        startSnapshot,
        endSnapshot: this.getReportTelemetrySnapshot(),
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
    const startedAt = Date.now();
    const startCpuUsage = process.cpuUsage();
    const startSnapshot = this.getReportTelemetrySnapshot();

    try {
      await this.logReportTelemetry("verification_pdf_started", {
        reportType: "verification-preview-pdf",
        loanId,
        addressType,
        ...startSnapshot,
      });

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

      const imageDataUri = this.getFISignatureDataUri();

      // Get uploaded items for this verification only
      const uploadedItems = verificationData?.uploadedItems || [];

      // Fetch images as base64 data URIs so Puppeteer needs no network access
      const imageUrls = await Promise.all(
        uploadedItems.map(async (item) => {
          try {
            return await this.s3Service.fetchImageAsDataUri(item.s3ImageUrl);
          } catch (error) {
            await this.loggingService.error(
              "Failed to fetch image as data URI",
              {
                s3ImageUrl: item.s3ImageUrl,
                error: error.message,
              }
            );
            return null;
          }
        })
      );

      // Filter out any failed fetches
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
      const htmlSizeBytes = Buffer.byteLength(htmlTemplate || "", "utf8");
      const pdfBuffer = await this.withPdfQueue(
        "verification-preview-pdf",
        {
          loanId,
          addressType,
          applicationNumber: loan.applicationNumber,
          uploadedItemsCount: uploadedItems.length,
          validImageCount: validImageUrls.length,
          htmlSizeBytes,
        },
        async (queueWaitMs) => {
          const browser = await this.getPdfBrowser();
          const page = await browser.newPage();
          try {
            // Images are inlined as base64 data URIs upstream — no network fetches.
            await page.setContent(htmlTemplate, {
              waitUntil: "domcontentloaded",
              timeout: 30000,
            });

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

            const renderedPdfBuffer = Buffer.from(pdfArray);
            await this.logReportTelemetry("verification_pdf_render_completed", {
              reportType: "verification-preview-pdf",
              loanId,
              addressType,
              applicationNumber: loan.applicationNumber,
              queueWaitMs,
              htmlSizeBytes,
              pdfSizeBytes: renderedPdfBuffer.length,
              uploadedItemsCount: uploadedItems.length,
              validImageCount: validImageUrls.length,
              cpuUsageMs: this.getCpuUsageDelta(startCpuUsage),
              startSnapshot,
              endSnapshot: this.getReportTelemetrySnapshot(),
            });

            return renderedPdfBuffer;
          } finally {
            await page.close().catch(() => undefined);
          }
        }
      );

      await this.loggingService.info(
        "Verification PDF generated successfully",
        {
          loanId,
          addressType,
          applicationNumber: loan.applicationNumber,
        }
      );

      await this.logReportTelemetry("verification_pdf_completed", {
        reportType: "verification-preview-pdf",
        loanId,
        addressType,
        applicationNumber: loan.applicationNumber,
        durationMs: Date.now() - startedAt,
        pdfSizeBytes: pdfBuffer.length,
        cpuUsageMs: this.getCpuUsageDelta(startCpuUsage),
        startSnapshot,
        endSnapshot: this.getReportTelemetrySnapshot(),
      });

      return pdfBuffer;
    } catch (error) {
      await this.logReportTelemetry(
        "verification_pdf_failed",
        {
          reportType: "verification-preview-pdf",
          loanId,
          addressType,
          durationMs: Date.now() - startedAt,
          cpuUsageMs: this.getCpuUsageDelta(startCpuUsage),
          startSnapshot,
          endSnapshot: this.getReportTelemetrySnapshot(),
          error: error.message,
        },
        "error"
      );
      await this.loggingService.error("Failed to generate verification PDF", {
        loanId,
        addressType,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private generateBaseHTMLTemplate(loan: any, _address: string): string {
    return baseTemplate(loan);
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

  private async getPostponedPdLoan(loanId: number) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId, department: Department.PD },
      include: {
        verifications: {
          where: {
            isPostponed: true,
            status: VerificationStatus.Pending,
          },
        },
      },
    });

    if (!loan) {
      throw new NotFoundException("Loan not found");
    }
    if (!loan.verifications || loan.verifications.length === 0) {
      throw new BadRequestException("Loan is not in a postponed state");
    }

    return loan;
  }

  async sendPostponementFollowUpToBank(
    loanId: number
  ): Promise<{ success: boolean; message: string }> {
    const loan = await this.getPostponedPdLoan(loanId);
    const postponed = loan.verifications[0];

    if (!postponed.postponedDate) {
      return {
        success: false,
        message: "Postponed verification has no postpone date",
      };
    }

    return await this.sendPostponementEmailReply(
      loan.id,
      postponed.postponedDate,
      postponed.postponedReason ?? ""
    );
  }

  async sendPostponementFollowUpToApplicant(
    loanId: number
  ): Promise<{ success: boolean; message: string }> {
    const loan = await this.getPostponedPdLoan(loanId);

    if (!loan.applicantMobile) {
      return {
        success: false,
        message: "No mobile number on file for applicant",
      };
    }

    const smsUtils = new SMSUtils(this.loggingService);
    const ok = await smsUtils.sendVerificationStatus(
      loan.applicantMobile,
      "postponed and will be rescheduled",
      loan.applicationNumber || String(loan.id)
    );

    return ok
      ? { success: true, message: "Follow-up SMS sent to applicant" }
      : { success: false, message: "Failed to send follow-up SMS" };
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
          receivedByMailbox: data.receivedByMailbox,
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
            status: LoanStatus.Assigned,
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
                ...(v.assistantVerifierId && {
                  assistantVerifier: { connect: { id: v.assistantVerifierId } },
                }),
                status: VerificationStatus.Pending,
                locationType: v.locationType,
                isPostponed: false,
                postponedDate: null,
                postponedReason: null,
                initialSubmitted: false,
                businessName: v.businessName,
                currentOfficeName: null,
                applicantAddress: v.applicantAddress,
                verificationData: null,
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
    synopsis?: string,
    approvedStatus?: ApprovedStatus
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
          ...(approvedStatus !== undefined && { approvedStatus }),
          initialSubmitted: true,
          status: VerificationStatus.Completed,
          updatedAt: new Date(),
        },
      });

      // Check if all verifications for this loan have been submitted by VE
      const allVerifications = await this.prisma.verification.findMany({
        where: { loanId },
      });

      const allSubmitted = allVerifications.every(
        (v) => v.initialSubmitted === true
      );

      if (allSubmitted) {
        await this.prisma.loan.update({
          where: { id: loanId },
          data: { status: LoanStatus.BackendCompleted },
        });

        await this.loggingService.info(
          "All verifications submitted by VE, loan status updated to BackendCompleted",
          {
            loanId,
            newStatus: LoanStatus.BackendCompleted,
          }
        );
      }

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

  async closeLoan(loanId: number) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
        select: { id: true, department: true, status: true, closedAt: true },
      });

      if (!loan) {
        throw new NotFoundException("Loan not found");
      }

      if (loan.department !== Department.PD) {
        throw new BadRequestException("Only PD loans can be closed");
      }

      if (loan.closedAt) {
        return await this.prisma.loan.findUnique({ where: { id: loanId } });
      }

      if (loan.status !== LoanStatus.BackendCompleted) {
        throw new BadRequestException(
          "Only loans in BackendCompleted state can be closed"
        );
      }

      const updatedLoan = await this.prisma.loan.update({
        where: { id: loanId },
        data: {
          closedAt: new Date(),
          status: LoanStatus.Completed,
        },
      });

      await this.loggingService.info("Loan closed", {
        loanId,
        closedAt: updatedLoan.closedAt,
      });

      return updatedLoan;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      await this.loggingService.error("Failed to close loan", {
        loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async returnToVerificationExecutive(
    loanId: number,
    verificationType: VerificationType,
    comments?: string
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

      // Reset initialSubmitted so VE sees it in their queue
      const updatedVerification = await this.prisma.verification.update({
        where: { id: verification.id },
        data: {
          initialSubmitted: false,
          ...(comments && { synopsis: comments }),
          updatedAt: new Date(),
        },
      });

      // Revert loan back to FVCompleted so VE picks it up again. If the loan
      // had already been closed (status=Completed, closedAt set), reopen it
      // by clearing closedAt as well.
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
      });

      if (loan?.status === LoanStatus.Completed) {
        await this.prisma.loan.update({
          where: { id: loanId },
          data: { status: LoanStatus.FVCompleted, closedAt: null },
        });
      } else if (loan?.status === LoanStatus.BackendCompleted) {
        await this.prisma.loan.update({
          where: { id: loanId },
          data: { status: LoanStatus.FVCompleted },
        });
      }

      await this.loggingService.info(
        "Verification returned to VerificationExecutive by Verifier",
        {
          loanId,
          verificationId: verification.id,
          verificationType,
        }
      );

      return updatedVerification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error(
        "Failed to return verification to VerificationExecutive",
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

  async exportFinancialAnalysisToExcel(
    loanId: number,
    bankName?: string
  ): Promise<Buffer> {
    try {
      // If no bankName provided, fetch it from the loan
      if (!bankName) {
        const loan = await this.prisma.loan.findUnique({
          where: { id: loanId },
          select: { templateName: true },
        });
        if (!loan) {
          throw new NotFoundException("Loan not found");
        }
        bankName = loan.templateName;
      }

      const templatesService =
        await this.getFinancialAnalysisTemplatesService();

      return await templatesService.exportFinancialAnalysisToExcel(
        loanId,
        bankName
      );
    } catch (error) {
      await this.loggingService.error(
        "Failed to export financial analysis to Excel",
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

  async sendPdEmailReply(
    loanId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const axios = (await import("axios")).default;
      const FormData = (await import("form-data")).default;

      // Fetch loan with PD email logs and verifications
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId, department: Department.PD },
        include: {
          pdEmailLogs: {
            orderBy: { receivedAt: "desc" },
            take: 1,
          },
          verifications: {
            where: { type: VerificationType.Business },
            include: {
              fieldExecutive: {
                select: { name: true },
              },
            },
          },
        },
      });

      if (!loan) {
        throw new NotFoundException("PD loan not found");
      }

      if (!loan.pdEmailLogs || loan.pdEmailLogs.length === 0) {
        throw new NotFoundException("No PD email log found for this loan");
      }

      const pdEmailLog = loan.pdEmailLogs[0];
      const verification = loan.verifications[0];

      if (!verification) {
        throw new NotFoundException(
          "Business verification not found for this loan"
        );
      }

      // Check if financial analysis exists for better error messages
      const verificationData = verification.verificationData as any;
      const financialAnalysis = verificationData?.financialAnalysis;
      const hasFinancialAnalysis =
        financialAnalysis && Object.keys(financialAnalysis).length > 0;

      await this.loggingService.info("Preparing email reply attachments", {
        loanId,
        hasFinancialAnalysis,
        hasFinalReportPath: !!verification.finalReportPath,
        verificationId: verification.id,
      });

      // Get Microsoft Graph API credentials from environment
      const clientId = process.env.AZURE_CLIENT_ID;
      const clientSecret = process.env.AZURE_CLIENT_SECRET;
      const tenantId = process.env.AZURE_TENANT_ID;
      // Use the mailbox that originally received this email so the reply
      // goes out from the same mailbox. Falls back to USER_EMAIL env for
      // legacy rows that don't have receivedByMailbox stored.
      const userEmail = pdEmailLog.receivedByMailbox || process.env.USER_EMAIL;

      if (!clientId || !clientSecret || !tenantId || !userEmail) {
        throw new BadRequestException(
          "Microsoft Graph API credentials not configured"
        );
      }

      // Get access token using client credentials flow
      const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        throw new Error("Failed to obtain access token");
      }

      // Log token acquisition for debugging (without exposing the token)
      await this.loggingService.info("Access token obtained successfully", {
        loanId,
        userEmail,
        tokenType: tokenResponse.data.token_type,
        expiresIn: tokenResponse.data.expires_in,
        scope: tokenResponse.data.scope,
      });

      // Prepare attachments
      const attachments: Array<{
        name: string;
        content: Buffer;
        contentType: string;
      }> = [];

      // 1. Generate and add Excel file
      try {
        await this.loggingService.info(
          "Attempting to generate Excel file for email reply",
          { loanId, bankName: loan.bankName }
        );

        const excelBuffer = await this.exportFinancialAnalysisToExcel(
          loanId,
          loan.bankName
        );

        if (excelBuffer && excelBuffer.length > 0) {
          attachments.push({
            name: `financial-analysis-loan-${loanId}.xlsx`,
            content: excelBuffer,
            contentType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          await this.loggingService.info(
            "Excel file generated successfully for email reply",
            { loanId, excelSize: excelBuffer.length }
          );
        } else {
          await this.loggingService.warn(
            "Excel buffer is empty or null for email reply",
            { loanId, bankName: loan.bankName }
          );
        }
      } catch (error) {
        // Log detailed error information
        const errorDetails = {
          loanId,
          bankName: loan.bankName,
          errorMessage: error.message,
          errorName: error.name,
          errorStack: error.stack,
          // Include response data if it's an HTTP error
          ...(error.response && {
            statusCode: error.response.status,
            responseData: error.response.data,
          }),
        };

        await this.loggingService.error(
          "Failed to generate Excel file for email reply - will continue without Excel",
          errorDetails
        );

        // Don't throw - continue with other attachments
        // The email can still be sent with PDF attachments
      }

      // Helper function to download file from S3
      const downloadFromS3 = async (s3Key: string): Promise<Buffer> => {
        const { S3Client, GetObjectCommand } = await import(
          "@aws-sdk/client-s3"
        );
        const s3Client = new S3Client({
          region: process.env.AWS_REGION || "us-east-1",
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
          },
        });

        const getCommand = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET || "",
          Key: s3Key,
        });

        const response = await s3Client.send(getCommand);
        const chunks: Uint8Array[] = [];
        for await (const chunk of response.Body as any) {
          chunks.push(chunk);
        }
        return Buffer.concat(chunks);
      };

      // 2. Generate final report PDF using the preview endpoint method
      try {
        const pdTemplateService = await this.getPDTemplateService();
        const pdfBuffer = await pdTemplateService.generatePreviewPDF(loanId);
        attachments.push({
          name: `pd-final-report-loan-${loanId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        });
        await this.loggingService.info(
          "Generated final report PDF for email reply",
          { loanId }
        );
      } catch (error) {
        await this.loggingService.warn(
          "Failed to generate final report PDF for email reply",
          { loanId, error: error.message, stack: error.stack }
        );
        // Try fallback to S3 if available
        try {
          if (verification.finalReportPath) {
            const pdfBuffer = await downloadFromS3(
              verification.finalReportPath
            );
            attachments.push({
              name: `pd-final-report-loan-${loanId}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            });
            await this.loggingService.info(
              "Used S3 final report PDF as fallback for email reply",
              { loanId }
            );
          }
        } catch (fallbackError) {
          await this.loggingService.warn(
            "Failed to get final report PDF from S3 as fallback",
            { loanId, error: fallbackError.message }
          );
        }
      }

      // 3. Get uploaded PDFs from verification data
      // try {
      //   const verificationData = verification.verificationData as any;
      //   const uploadedItems = verificationData?.uploadedItems || [];
      //   const pdfItems = uploadedItems.filter(
      //     (item: any) =>
      //       item?.fileType === "pdf" ||
      //       item?.type === "document" ||
      //       (item?.s3ImageUrl && item.s3ImageUrl.toLowerCase().endsWith(".pdf"))
      //   );

      //   for (const pdfItem of pdfItems) {
      //     try {
      //       if (pdfItem.s3ImageUrl) {
      //         const pdfBuffer = await downloadFromS3(pdfItem.s3ImageUrl);
      //         const fileName =
      //           pdfItem.fileName ||
      //           `uploaded-document-${pdfItem.id || Date.now()}.pdf`;
      //         attachments.push({
      //           name: fileName,
      //           content: pdfBuffer,
      //           contentType: "application/pdf",
      //         });
      //       }
      //     } catch (error) {
      //       await this.loggingService.warn(
      //         "Failed to get uploaded PDF for email reply",
      //         {
      //           loanId,
      //           s3Path: pdfItem.s3ImageUrl,
      //           error: error.message,
      //         }
      //       );
      //     }
      //   }
      // } catch (error) {
      //   await this.loggingService.warn(
      //     "Failed to process uploaded PDFs for email reply",
      //     { loanId, error: error.message }
      //   );
      // }

      // Log all attachments being prepared
      await this.loggingService.info("Prepared attachments for email reply", {
        loanId,
        attachmentCount: attachments.length,
        attachmentNames: attachments.map((a) => a.name),
        attachmentSizes: attachments.map((a) => a.content.length),
      });

      if (attachments.length === 0) {
        throw new BadRequestException(
          "No attachments available to send (Excel, PDF, or uploaded documents)"
        );
      }

      // Validate the messageID
      if (!pdEmailLog.messageID || pdEmailLog.messageID.trim() === "") {
        throw new BadRequestException("Message ID is missing or invalid");
      }

      // Microsoft Graph API message IDs may contain special characters that need URL encoding
      const messageId = pdEmailLog.messageID.trim();

      // Determine the correct message ID format by trying to fetch the message
      let validMessageId = messageId;
      let replyUrl: string;

      // Try with URL encoding first (most common case)
      const encodedMessageId = encodeURIComponent(messageId);
      const getMessageUrlEncoded = `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${encodedMessageId}`;

      try {
        const response = await axios.get(getMessageUrlEncoded, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // Encoded version works, use it
        validMessageId = encodedMessageId;
        replyUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${validMessageId}/createReply`;
      } catch (error) {
        // Log the first error for debugging
        const firstErrorDetails = error.response?.data?.error || {};
        await this.loggingService.warn(
          "First attempt to get message failed (encoded)",
          {
            loanId,
            messageId,
            encodedMessageId,
            statusCode: error.response?.status,
            errorCode: firstErrorDetails.code,
            errorMessage: firstErrorDetails.message,
            responseData: error.response?.data,
          }
        );

        // Try without encoding
        const getMessageUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${messageId}`;
        try {
          await axios.get(getMessageUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          // Unencoded version works, use it
          validMessageId = messageId;
          replyUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${validMessageId}/createReply`;
        } catch (unencodedError) {
          const errorDetails = unencodedError.response?.data?.error || {};
          const errorMessage = errorDetails.message || unencodedError.message;
          const errorCode =
            errorDetails.code || unencodedError.response?.status;

          await this.loggingService.error(
            "Failed to access original message (both attempts)",
            {
              loanId,
              messageId,
              encodedMessageId,
              userEmail,
              errorCode,
              errorMessage,
              firstError: firstErrorDetails,
              secondError: errorDetails,
              fullResponseData: unencodedError.response?.data,
            }
          );

          // Provide more detailed error message
          const detailedError =
            errorDetails.message ||
            firstErrorDetails.message ||
            "Unknown error";
          const errorCodeStr =
            errorDetails.code || firstErrorDetails.code || errorCode;

          throw new BadRequestException(
            `Failed to access message in mailbox ${userEmail}. ` +
            `Error Code: ${errorCodeStr}. ` +
            `Error: ${detailedError}. ` +
            `Please verify: 1) The app has Mail.Read permission, 2) Admin consent is granted, ` +
            `3) The mailbox ${userEmail} exists and is accessible, 4) The message ID is correct.`
          );
        }
      }

      const replyMessage = {
        message: {
          body: {
            contentType: "Text",
            content: `Please find attached the PD verification documents for loan application ${loan.applicationNumber}.\n\nAttachments:\n${attachments.map((a) => `- ${a.name}`).join("\n")}`,
          },
          toRecipients: pdEmailLog.fromEmail.map((email) => ({
            emailAddress: { address: email },
          })),
          ccRecipients:
            pdEmailLog.ccEmail && pdEmailLog.ccEmail.length > 0
              ? pdEmailLog.ccEmail.map((email) => ({
                emailAddress: { address: email },
              }))
              : [],
        },
      };

      // Create the reply draft
      let createReplyResponse;
      try {
        createReplyResponse = await axios.post(replyUrl, replyMessage, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        const errorDetails = error.response?.data?.error || {};
        await this.loggingService.error("Failed to create reply message", {
          loanId,
          userEmail,
          messageId: validMessageId,
          statusCode: error.response?.status,
          errorCode: errorDetails.code,
          errorMessage: errorDetails.message,
          fullError: errorDetails,
          responseData: error.response?.data,
        });

        const errorMessage = errorDetails.message || error.message;
        const errorCode = errorDetails.code || error.response?.status;

        throw new BadRequestException(
          `Failed to create reply message. ` +
          `Error Code: ${errorCode}. ` +
          `Error: ${errorMessage}. ` +
          `Please verify: 1) Mail.Send permission is granted with admin consent, ` +
          `2) The app can access mailbox ${userEmail}, ` +
          `3) There are no conditional access policies blocking the request.`
        );
      }

      const replyMessageId = createReplyResponse.data.id;
      if (!replyMessageId) {
        throw new Error("Failed to create reply message");
      }

      // Add attachments to the reply message one by one
      for (const attachment of attachments) {
        const attachmentUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${replyMessageId}/attachments`;

        const attachmentPayload = {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: attachment.name,
          contentBytes: attachment.content.toString("base64"),
          contentType: attachment.contentType,
        };

        try {
          await axios.post(attachmentUrl, attachmentPayload, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          await this.loggingService.warn(
            "Failed to add attachment to email reply",
            {
              loanId,
              attachmentName: attachment.name,
              error: error.response?.data || error.message,
            }
          );
          // Continue with other attachments even if one fails
        }
      }

      // Send the reply message
      const sendUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${replyMessageId}/send`;
      await axios.post(
        sendUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await this.loggingService.info("PD email reply sent successfully", {
        loanId,
        messageId: pdEmailLog.messageID,
        attachmentsCount: attachments.length,
      });

      return {
        success: true,
        message: `Email reply sent successfully with ${attachments.length} attachment(s)`,
      };
    } catch (error) {
      const errorDetails = {
        loanId,
        error: error.message,
        stack: error.stack,
      };

      // Include Graph API error details if available
      if (error.response) {
        errorDetails["statusCode"] = error.response.status;
        errorDetails["responseData"] = error.response.data;
        errorDetails["responseHeaders"] = error.response.headers;
      }

      await this.loggingService.error(
        "Failed to send PD email reply",
        errorDetails
      );

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Provide more detailed error message
      const errorMessage = error.response?.data?.error?.message
        ? `Failed to send email reply: ${error.response.data.error.message}`
        : `Failed to send email reply: ${error.message}`;

      throw new BadRequestException(errorMessage);
    }
  }

  /**
   * Sends a templated reply email to the bank notifying them that the
   * verification has been postponed by the applicant. The reply lands in
   * the same Outlook thread as the original verification request because
   * Microsoft Graph's createReply preserves conversationId.
   *
   * Silently no-ops if the loan has no PD email log (e.g. FI loans, or PD
   * loans created manually without an originating email).
   */
  async sendPostponementEmailReply(
    loanId: number,
    postponedDate: Date,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const axios = (await import("axios")).default;

      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId, department: Department.PD },
        include: {
          pdEmailLogs: {
            orderBy: { receivedAt: "desc" },
            take: 1,
          },
        },
      });

      if (!loan || !loan.pdEmailLogs || loan.pdEmailLogs.length === 0) {
        return {
          success: false,
          message: "No PD email log found for this loan; skipping reply",
        };
      }

      const pdEmailLog = loan.pdEmailLogs[0];

      const clientId = process.env.AZURE_CLIENT_ID;
      const clientSecret = process.env.AZURE_CLIENT_SECRET;
      const tenantId = process.env.AZURE_TENANT_ID;
      const userEmail = pdEmailLog.receivedByMailbox || process.env.USER_EMAIL;

      if (!clientId || !clientSecret || !tenantId || !userEmail) {
        throw new BadRequestException(
          "Microsoft Graph API credentials not configured"
        );
      }

      const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials",
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        throw new Error("Failed to obtain Microsoft Graph access token");
      }

      // Resolve the message ID format (encoded vs raw) the same way
      // sendPdEmailReply does — Graph IDs sometimes need URL encoding.
      const messageId = pdEmailLog.messageID.trim();
      const encodedMessageId = encodeURIComponent(messageId);
      let validMessageId: string;
      try {
        await axios.get(
          `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${encodedMessageId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        validMessageId = encodedMessageId;
      } catch {
        await axios.get(
          `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${messageId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        validMessageId = messageId;
      }

      const formattedDate = postponedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const replyBody =
        `Dear Team,\n\n` +
        `The verification for application ${loan.applicationNumber} (${loan.applicantName}) ` +
        `has been postponed by the applicant and will be rescheduled.\n\n` +
        `Rescheduled date: ${formattedDate}\n` +
        `Reason: ${reason}\n\n` +
        `We will share the verification report once completed.\n\n` +
        `Regards,\nKowtha Team`;

      const replyUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${validMessageId}/createReply`;
      const createReplyResponse = await axios.post(
        replyUrl,
        {
          message: {
            body: { contentType: "Text", content: replyBody },
            toRecipients: pdEmailLog.fromEmail.map((email) => ({
              emailAddress: { address: email },
            })),
            ccRecipients:
              pdEmailLog.ccEmail && pdEmailLog.ccEmail.length > 0
                ? pdEmailLog.ccEmail.map((email) => ({
                    emailAddress: { address: email },
                  }))
                : [],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const replyMessageId = createReplyResponse.data.id;
      if (!replyMessageId) {
        throw new Error("Failed to create reply draft");
      }

      await axios.post(
        `https://graph.microsoft.com/v1.0/users/${userEmail}/messages/${replyMessageId}/send`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      await this.loggingService.info("Postponement email reply sent", {
        loanId,
        applicationNumber: loan.applicationNumber,
        mailbox: userEmail,
        postponedDate: postponedDate.toISOString(),
      });

      return {
        success: true,
        message: "Postponement email reply sent successfully",
      };
    } catch (error) {
      await this.loggingService.error("Failed to send postponement email reply", {
        loanId,
        error: error.message,
        stack: error.stack,
        responseData: error.response?.data,
      });
      // Don't throw — postponement should not fail because of email issues
      return {
        success: false,
        message: `Failed to send postponement email: ${error.message}`,
      };
    }
  }
}


// @Post("qa-test-loan")
// @Public()
// @ApiOperation({
//   summary: "Create a QA test loan for mobile app testing",
//   description:
//     "Creates a test loan and verification for QA purposes. Only for development/testing.",
// })
// @ApiResponse({
//   status: 201,
//   description: "QA test loan created successfully",
// })
// async createQATestLoan(
//   @Body("bankName") bankName: string,
//   @Body("fieldExecutiveId") fieldExecutiveId: number,
//   @Body("qaData") qaData?: any
// ) {
//   const result = await this.loanService.createQALoan(
//     bankName,
//     fieldExecutiveId,
//     qaData
//   );
//   return {
//     status: 201,
//     message: "QA test loan created successfully",
//     data: result,
//   };
// }

  // Create a QA test loan for testing purposes
  // async createQALoan(bankName: string, fieldExecutiveId: number, qaData?: any) {
  //   try {
  //     // Find an admin user who will initiate the loan
  //     const adminDepartmentRole = await this.prisma.departmentRole.findFirst({
  //       where: {
  //         role: UserRole.Admin,
  //       },
  //       include: {
  //         user: true,
  //       },
  //     });

  //     if (!adminDepartmentRole) {
  //       throw new Error(
  //         "No admin user found in system. Cannot create QA loan."
  //       );
  //     }

  //     const adminUser = adminDepartmentRole.user;

  //     // Verify the field executive exists
  //     const fieldExecutive = await this.prisma.user.findUnique({
  //       where: { id: fieldExecutiveId },
  //     });

  //     if (!fieldExecutive) {
  //       throw new Error(
  //         `Field executive with ID ${fieldExecutiveId} not found`
  //       );
  //     }

  //     // Get first office in the system
  //     const office = await this.prisma.office.findFirst();
  //     if (!office) {
  //       throw new Error("No office found in system");
  //     }

  //     // Generate QA test data
  //     const timestamp = Date.now();
  //     const applicationNumber = `QA-${bankName.substring(0, 3).toUpperCase()}-${timestamp}`;
  //     const businessName =
  //       qaData?.businessName || `QA Test Business ${timestamp}`;

  //     return await this.prisma.$transaction(async (prisma) => {
  //       // Create the QA loan (initiated by admin, assigned to field executive)
  //       const loan = await prisma.loan.create({
  //         data: {
  //           applicationNumber,
  //           applicantName:
  //             qaData?.applicantName || `QA Test Applicant ${timestamp}`,
  //           applicantMobile: qaData?.applicantMobile || "9999999999",
  //           applicantAddress:
  //             qaData?.applicantAddress || "QA Test Address, Mumbai - 400001",
  //           loanType: qaData?.loanType || "Business Loan",
  //           bankName: bankName,
  //           loanAmount: qaData?.loanAmount || 1000000,
  //           office: { connect: { id: office.id } },
  //           operationsExecutive: { connect: { id: adminUser.id } }, // Admin initiates
  //           status: LoanStatus.Assigned,
  //           department: Department.PD,
  //         },
  //         include: {
  //           operationsExecutive: true,
  //           office: true,
  //         },
  //       });

  //       // Create a PD verification assigned to the field executive
  //       const verification = await prisma.verification.create({
  //         data: {
  //           loan: { connect: { id: loan.id } },
  //           type: VerificationType.Business,
  //           addressType: AddressType.Business,
  //           fieldExecutive: { connect: { id: fieldExecutiveId } },
  //           status: VerificationStatus.Pending,
  //           businessName: businessName,
  //         },
  //       });

  //       await this.loggingService.info("QA test loan created successfully", {
  //         loanId: loan.id,
  //         applicationNumber: loan.applicationNumber,
  //         bankName: bankName,
  //         initiatedBy: adminUser.id,
  //         assignedTo: fieldExecutiveId,
  //         verificationId: verification.id,
  //       });

  //       return {
  //         loan,
  //         verification,
  //         message: "QA test loan created successfully",
  //       };
  //     });
  //   } catch (error) {
  //     await this.loggingService.error("Failed to create QA loan", {
  //       bankName,
  //       fieldExecutiveId,
  //       error: error.message,
  //       stack: error.stack,
  //     });
  //     throw error;
  //   }
  // }