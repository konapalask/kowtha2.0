import * as fs from "fs";
import * as path from "path";
import { formSchema } from "./forms-schema";
import { LoanService } from "./loan.service";
import { PrismaService } from "src/prisma.service";
import * as templates from "./templates/PD/html/_index";
import * as interfaces from "./templates/PD/interface/_index";
import { VerificationType, Department } from "@prisma/client";
import { S3Service } from "src/modules/common/s3utils/s3.service";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { LoggingService } from "src/modules/common/logging/logging.service";
import {
  validateVerificationData,
  logDataStructure,
} from "./templates/PD/html/template-validator";



@Injectable()
export class PDTemplateService {
  constructor(
    private loggingService: LoggingService,
    private s3Service: S3Service,
    private prisma: PrismaService,
    private loanService: LoanService
  ) {}

  async generatePreviewPDF(loanId: number): Promise<Buffer> {
    try {
      // Fetch loan details with verification data
      const loan = await this.prisma.loan.findUnique({
        where: { id: loanId, department: Department.PD },
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
            where: { type: VerificationType.Business },
            select: {
              type: true,
              status: true,
              approvedStatus: true,
              updatedAt: true,
              verificationData: true,
              path: true,
              finalReportPath: true,
              synopsis: true,
              financialAnalysis: true,
              fieldExecutive: { select: { name: true } },
            },
          },
        },
      });

      if (!loan) {
        throw new NotFoundException("Loan not found");
      }

      if (loan.verifications.length === 0) {
        throw new NotFoundException(
          `Verification for address type Business not found`
        );
      }

      const verification = loan.verifications[0];

      const bankName = loan.bankName;

      const verificationData: any = verification.verificationData;

      // Validate data against schema before generating PDF
      const schema = formSchema[bankName as keyof typeof formSchema];
      if (schema) {
        logDataStructure(verificationData, `${bankName} Verification Data`);
        const validationResult = validateVerificationData(
          verificationData,
          schema,
          bankName
        );

        // Log validation results but don't block PDF generation
        if (!validationResult.isValid) {
          await this.loggingService.warn(
            `Data validation issues for ${bankName} PDF generation`,
            {
              loanId,
              missingFields: validationResult.missingRequiredFields,
              emptyFields: validationResult.emptyRequiredFields,
              unexpectedFields: validationResult.unexpectedFields,
            }
          );
        }
      }

      const htmlTemplate = await this.InterfaceMapping(
        bankName,
        verificationData,
        loan,
        verification.synopsis,
        verification.financialAnalysis,
        schema
      );

      const pdfBuffer = await this.loanService.PDFBufferGeneration(htmlTemplate);

      await this.loggingService.info(
        "Verification PDF generated successfully",
        {
          loanId,
          applicationNumber: loan.applicationNumber,
        }
      );

      return pdfBuffer;
    } catch (error) {
      await this.loggingService.error("Failed to generate verification PDF", {
        loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async FormatPDImages(verification: any, bankName: string, applicationNumber: string, synopsis: string, financialAnalysis: any): Promise<any> {

    const signaturePath = path.resolve(process.cwd(),process.env.SIGNATURE_PATH);
    const imageBase64 = fs.readFileSync(signaturePath, "base64");
    const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

    const status = verification?.approvedStatus || "";

    const uploadedItems = verification?.uploadedItems || [];

    // Generate presigned URLs for images
    const imageUrls = await Promise.all(
      uploadedItems.map(async (item: any) => {
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

    const fieldExecutive = verification.fieldExecutive?.name || "";

    const imagesData = await this.loanService.formatImages(
      validImageUrls,
      bankName,
      fieldExecutive
    );

    return {
      bankName: bankName,
      applicationNumber: applicationNumber,
      path: synopsis,
      financialAnalysis: financialAnalysis,
      status: status,
      imageDataUri: imageDataUri,
      imagesData: imagesData,
      fieldExecutive: fieldExecutive,
    };
  }

  async InterfaceMapping(
    bankName: string,
    verification: any,
    loan: any,
    synopsis: string,
    financialAnalysis: any,
    schema?: any
  ): Promise<any> {
    
    if (bankName == "Axis Bank") {
      let verificationData = loan.verificationData as interfaces.AxisFinanceUBLInterface;
      const html_data = await this.FormatPDImages( verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis );
      return templates.axisFinanceUBLTemplate(verificationData, html_data);
    }

    if (bankName == "RBL" || bankName == "Rbl") {
      let verificationData = verification as interfaces.RBLInterface;
      const html_data = await this.FormatPDImages( verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis );
      return templates.rblTemplate(verificationData, html_data);
    }

    if (bankName == "Aditya Birla") {
      let verificationData = verification as any;
      const html_data = await this.FormatPDImages( verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis );
      return templates.adityaBirlaTemplate(verificationData, html_data);
    }

    if (bankName == "Arka Fincap") {
      let verificationData = verification as interfaces.ArkaFincapInterface;
      const html_data = await this.FormatPDImages( verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis );
      return templates.arkaFincapTemplate(verificationData, html_data);
    }
  }
}
