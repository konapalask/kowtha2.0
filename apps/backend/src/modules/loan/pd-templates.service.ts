import * as fs from "fs";
import * as path from "path";
import { LoanService } from "./loan.service";
import { PrismaService } from "src/prisma.service";
import * as templates from "./templates/PD/html/_index";
import { VerificationType, Department } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { S3Service } from "src/modules/common/s3utils/s3.service";
import { LoggingService } from "src/modules/common/logging/logging.service";
import {
  validateVerificationData,
  logDataStructure,
} from "./templates/PD/html/template-validator";
import {
  formSchema,
  getFooterNameFromTemplate,
  getBankNameFromTemplate,
  getSchemaFromTemplate,
} from "./forms-schema";

@Injectable()
export class PDTemplateService {
  constructor(
    private loggingService: LoggingService,
    private s3Service: S3Service,
    private prisma: PrismaService,
    private loanService: LoanService
  ) {}

  async FormatPDImages(
    verification: any,
    bankName: string,
    applicationNumber: string,
    synopsis: string,
    approvedStatus: string,
    financialAnalysis: any,
    loan?: any
  ): Promise<any> {
    const signaturePath = path.resolve(
      process.cwd(),
      process.env.SIGNATURE_PATH
    );
    const imageBase64 = fs.readFileSync(signaturePath, "base64");
    const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

    const status = verification?.approvedStatus || "";

    const fieldExecutive = verification.fieldExecutive?.name || "";

    const uploadedItems = verification?.uploadedItems || [];

    const photoGroups: Array<{
      documentType: string;
      photos: Array<{
        url: string;
        latitude?: string | number;
        longitude?: string | number;
        timestamp?: string;
        remarks?: string;
      }>;
    }> = [];

    const appendPhotoGroup = (
      documentType: string,
      photos: Array<{
        url: string;
        latitude?: string | number;
        longitude?: string | number;
        timestamp?: string;
        remarks?: string;
      }>
    ) => {
      if (photos.length === 0) return;
      photoGroups.push({
        documentType: documentType || "Document",
        photos,
      });
    };

    const resolveCoordinate = (value: any) => {
      if (value === undefined || value === null) return undefined;
      // Handle string "NaN" or "null" cases
      if (
        typeof value === "string" &&
        (value.toLowerCase() === "nan" || value.toLowerCase() === "null")
      ) {
        return undefined;
      }
      const numeric = Number(value);
      // Check if numeric is valid (not NaN, not Infinity)
      if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
        return numeric.toFixed(6);
      }
      // Return undefined for invalid values instead of string representation
      return undefined;
    };

    const getPhotoEntriesFromItem = (item: any) => {
      if (Array.isArray(item?.photos) && item.photos.length > 0) {
        return item.photos;
      }
      if (Array.isArray(item?.images) && item.images.length > 0) {
        return item.images;
      }
      if (Array.isArray(item?.documents) && item.documents.length > 0) {
        return item.documents;
      }
      if (Array.isArray(item?.photoList) && item.photoList.length > 0) {
        return item.photoList;
      }
      if (item?.s3ImageUrl || item?.uri || item?.url || item?.path) {
        return [item];
      }
      return [];
    };

    for (const item of uploadedItems) {
      const documentType =
        item?.documentType ||
        item?.type ||
        item?.title ||
        item?.documentCategory ||
        "Document";

      const entries = getPhotoEntriesFromItem(item);

      const processedPhotos: Array<{
        url: string;
        latitude?: string | number;
        longitude?: string | number;
        timestamp?: string;
        remarks?: string;
      }> = [];

      for (const entry of entries) {
        const possibleS3Key =
          entry?.s3ImageUrl ||
          entry?.s3Key ||
          entry?.uri ||
          entry?.url ||
          entry?.path ||
          item?.s3ImageUrl;

        if (!possibleS3Key) {
          continue;
        }

        try {
          const presignedUrl =
            await this.s3Service.generatePresignedDownloadUrl(possibleS3Key);
          if (!presignedUrl) {
            continue;
          }

          const latitude =
            resolveCoordinate(
              entry?.latitude ??
                entry?.lat ??
                entry?.geoTag?.latitude ??
                item?.latitude ??
                item?.lat ??
                item?.geoTag?.latitude
            ) ?? undefined;

          const longitude =
            resolveCoordinate(
              entry?.longitude ??
                entry?.lng ??
                entry?.geoTag?.longitude ??
                item?.longitude ??
                item?.lng ??
                item?.geoTag?.longitude
            ) ?? undefined;

          processedPhotos.push({
            url: presignedUrl,
            latitude,
            longitude,
            timestamp:
              entry?.timestamp ??
              entry?.capturedAt ??
              item?.timestamp ??
              undefined,
            remarks: entry?.remarks ?? entry?.note ?? item?.remarks,
          });
        } catch (error) {
          await this.loggingService.error(
            "Failed to generate presigned URL for grouped image",
            {
              s3ImageUrl: possibleS3Key,
              error: error.message,
            }
          );
        }
      }

      appendPhotoGroup(documentType, processedPhotos);
    }

    let imagesData = "";

    if (photoGroups.length > 0) {
      imagesData = photoGroups
        .map((group) => {
          const photosHtml = group.photos
            .map((photo) => {
              return `
                <div style="width:31%;margin:1%;border:1px solid #ddd;padding:8px;text-align:center;display:inline-block;vertical-align:top;box-sizing:border-box;page-break-inside:avoid;">
                  <img src="${photo.url}" alt="${group.documentType}" style="width:100%;height:180px;object-fit:contain;margin-bottom:6px;" />
                  ${
                    photo.remarks
                      ? `<div style="font-size:12px;color:#555;text-align:left;margin-top:6px;"><strong>Remarks:</strong> ${photo.remarks}</div>`
                      : ""
                  }
                </div>
              `;
            })
            .join("");

          return `
            <div style="margin-bottom:16px;page-break-inside:avoid;">
              <div style="font-size:14px;font-weight:bold;margin-bottom:8px;text-transform:uppercase;">${group.documentType}</div>
              <div style="display:flex;flex-wrap:wrap;justify-content:flex-start;">
                ${photosHtml}
              </div>
            </div>
          `;
        })
        .join("");
    } else if (uploadedItems.length > 0) {
      // Fallback to previous rendering if new structure not matched
      const imageUrls = await Promise.all(
        uploadedItems.map(async (item: any) => {
          if (!item?.s3ImageUrl) {
            return null;
          }
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

      const validImageUrls = imageUrls.filter((url) => url !== null);

      imagesData = await this.loanService.formatImages(
        validImageUrls,
        bankName,
        fieldExecutive
      );
    }

    const loanDetails = loan
      ? {
          applicationNumber: loan.applicationNumber ?? null,
          applicantName: loan.applicantName ?? null,
          applicantMobile: loan.applicantMobile ?? null,
          applicantAddress: loan.applicantAddress ?? null,
          loanAmount: loan.loanAmount ?? null,
          loanType: loan.loanType ?? null,
          loanPurpose: loan.loanPurpose ?? loan.purposeOfLoan ?? null,
          businessName:
            loan.businessName ??
            loan.companyName ??
            verification?.applicantDetails?.nameOfConcern ??
            null,
        }
      : undefined;

    const fieldVisitTime =
      verification?.fieldVisitTime ||
      verification?.applicantDetails?.appointmentFixed ||
      verification?.visitTime ||
      null;

    const pdVerifiedBy =
      verification?.pdOfficer?.name ||
      verification?.pdOfficerName ||
      verification?.verifiedBy ||
      verification?.fieldExecutive?.name ||
      loan?.operationsExecutive?.name ||
      fieldExecutive ||
      null;

    const pdVerifiedDate =
      verification?.pdVerifiedDate ||
      verification?.verificationDate ||
      verification?.applicantDetails?.dateOfVisit ||
      loan?.updatedAt ||
      null;

    const extractCoordinate = (...candidates: any[]) => {
      for (const candidate of candidates) {
        if (candidate === null || candidate === undefined) {
          continue;
        }

        const text = String(candidate).trim();

        if (text.length) {
          return text;
        }
      }

      return "";
    };

    const latitude = extractCoordinate(
      verification?.applicantDetails?.latitude,
      verification?.basicInformation?.latitude,
      verification?.locationDetails?.latitude,
      verification?.geoTag?.latitude,
      verification?.latitude,
      loan?.applicantLatitude,
      loan?.latitude
    );

    const longitude = extractCoordinate(
      verification?.applicantDetails?.longitude,
      verification?.basicInformation?.longitude,
      verification?.locationDetails?.longitude,
      verification?.geoTag?.longitude,
      verification?.longitude,
      loan?.applicantLongitude,
      loan?.longitude
    );

    const geoCoordinates =
      latitude || longitude
        ? {
            latitude,
            longitude,
          }
        : undefined;

    const getStyledApprovedStatus = (status: string): string => {
      if (!status) return "Not provided";
      
      const statusLower = status.toLowerCase().trim();
      let color = "#333";
      let fontWeight = "bold";
      
      if (statusLower === "positive" || statusLower.includes("positive")) {
        color = "#28a745"; // Green for positive
      } else if (statusLower === "negative" || statusLower.includes("negative")) {
        color = "#dc3545"; // Red for negative
      } else if (statusLower === "creditrefer" || statusLower.includes("creditrefer") || statusLower === "credit refer" || statusLower.includes("credit refer")) {
        color = "#ffa500"; // Yellow/Orange for credit refer
      }
      return `<span style="color: ${color}; font-weight: ${fontWeight};">${status}</span>`;
    };

    return {
      bankName: loan?.templateName || bankName,
      applicationNumber: applicationNumber,
      path: synopsis,
      financialAnalysis: financialAnalysis,
      status: status,
      synopsis: synopsis,
      approvedStatus: getStyledApprovedStatus(approvedStatus),
      imageDataUri: imageDataUri,
      imagesData: imagesData,
      fieldExecutive: fieldExecutive,
      loanDetails,
      fieldVisitTime,
      pdVerifiedBy,
      pdVerifiedDate,
      geoCoordinates,
    };
  }

  async InterfaceMapping(
    bankName: string,
    templateName: string | null,
    verification: any,
    loan: any,
    synopsis: string,
    approvedStatus: string,
    financialAnalysis: any,
    schema?: any
  ): Promise<any> {
    // Helper function to check if templateName matches any key in templatesAndFooters
    const matchesTemplate = (templateKey: string): boolean => {
      if (!templateName) return false;
      return templateName === templateKey;
    };

    // Match by templateName first, then fallback to bankName for backward compatibility
    const matchKey = templateName || bankName;
    // Banks with custom templates - match by templateName
    if (matchesTemplate("AXIS FINANCE-UBL ABOVE 10L") || matchKey === "Axis Finance UBL Above 10L") {
      // const verificationData = (verification?.verificationData ||
      // verification) as AxisFinanceUBLInterface;
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.axisFinanceUBLTemplate(verification, html_data);
    }
    if (matchesTemplate("AXIS FINANCE-UBL BELOW 10L") || matchKey === "Axis Finance UBL Below 10L") {
      // const verificationData = (verification?.verificationData ||
        // verification) as AxisFinanceUBLInterface;
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.axisFinanceUBLBelow10lTemplate(verification, html_data);
    }

    if (matchesTemplate("RBL BANK (PD & LIP)")) {
      // let verificationData = verification as RBLInterface;
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.rblTemplate(verification, html_data);
    }

    if (matchesTemplate("ICICI")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.iciciTemplate(verification, html_data);
    }

    if (matchesTemplate("CHOLA-HL") || matchesTemplate("CHOLA-ML")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.cholaTemplate(verification, html_data);
    }

    if (matchesTemplate("HERO FINCORP")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.heroFincorpTemplate(verification, html_data);
    }

    if (matchesTemplate("IIFL")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.iiflTemplate(verification, html_data);
    }

    if (matchesTemplate("YES BANK-HL")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.yesBankTemplate(verification, html_data);
    }

    if (matchesTemplate("TATA CAPITAL-UBL")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.tataUblTemplate(verification, html_data);
    }

    if (matchesTemplate("AXIS BANK")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.axisBankTemplate(verification, html_data);
    }

    if (
      matchesTemplate("AXIS FINANCE-HL") ||
      matchesTemplate("SAMMAAN") ||
      matchesTemplate("SMFG-ML (MICRO & MASS)") ||
      matchesTemplate("SMFG-HL") ||
      matchesTemplate("TATA CAPITAL-FSL") ||
      matchesTemplate("TATA CAPITAL-HFL")
    ) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.axisFinanceTemplate(verification, html_data);
    }

    if (matchesTemplate("AXIS AGRI") || matchesTemplate("AXIS BUSINESS AGRI")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.axisAgriTemplate(verification, html_data);
    }

    if (matchesTemplate("SMFG-SME")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.smfgSmeTemplate(verification, html_data);
    }

    if (matchesTemplate("NIWAS SALARIED")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.niwasSalariedTemplate(verification, html_data);
    }

    if (matchesTemplate("NIWAS SENP")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.niwasSenpTemplate(verification, html_data);
    }

    if (
      matchesTemplate("ARKA FINCAP") ||
      matchesTemplate("CENTRUM") ||
      matchesTemplate("CENT BANK") ||
      matchesTemplate("CLIX CAPITAL-HL") ||
      matchesTemplate("CLIX CAPITAL-UBL") ||
      matchesTemplate("EASY HL") ||
      matchesTemplate("FED BANK (PD&LIP)") ||
      matchesTemplate("GODREJ-HL") ||
      matchesTemplate("GODREJ-UBL") ||
      matchesTemplate("INDUSIND") ||
      matchesTemplate("KOTAK") ||
      matchesTemplate("MUTHOOT-HL") ||
      matchesTemplate("MUTHOOT FINCORP (PD & LIP)") ||
      matchesTemplate("NIDO HOME FINANCE") ||
      matchesTemplate("NORTHERN ARC") ||
      matchesTemplate("NIPUN") ||
      matchesTemplate("PIRAMAL (PD, AIP, LIP)") ||
      matchesTemplate("PNB") ||
      matchesTemplate("TRUHOME (PD & LIP)") ||
      matchesTemplate("VERITAS")
    ) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.arkaFincapTemplate(verification, html_data);
    }

    if (matchesTemplate("HERO HOUSING SELF")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.heroHousingSelfTemplate(verification, html_data);
    }

    if (matchesTemplate("HERO HOUSING SALARIED")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.herohousingSalariedTemplate(verification, html_data);
    }

    if (matchesTemplate("INDIA SHELTER SENP")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.indiaShelterSenpTemplate(verification, html_data);
    }

    if (matchesTemplate("INDIA SHELTER SALARIED")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.indiaShelterSalariedTemplate(verification, html_data);
    }

    if (matchesTemplate("IDFC FIRST-PL")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.idfcPlTemplate(verification, html_data);
    }

    if (matchesTemplate("IDFC FIRST-HL") || matchesTemplate("IDFC FIRST-ML")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.idfcHlMlTemplate(verification, html_data);
    }

    if (
      matchesTemplate("ADITYA BIRLA-HL") ||
      matchesTemplate("ADITYA BIRLA-ML") ||
      matchesTemplate("ADITYA BIRLA-STSL")
    ) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.adityaBirlaTemplate(verification, html_data);
    }

    if (matchesTemplate("DCB BANK")) {
      console.log("********");
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.dcbTemplate(verification, html_data);
    }

    if (matchesTemplate("INCRED/KKR India Financial Services Limited")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.incredTemplate(verification, html_data);
    }
    if (matchesTemplate("AMBIT-HL")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.ambitTemplate(verification, html_data);
    }
    if (matchesTemplate("AMBIT-MSME")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.ambitMsmeTemplate(verification, html_data);
    }

    if (matchesTemplate("JANA SMALL FINANCE BANK LIMITED SALARIED")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.janaSalariedTemplate(verification, html_data);
    }

    if (matchesTemplate("JANA SMALL FINANCE BANK LIMITED SENP ABOVE 50L")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.janaSenpAbove50lTemplate(verification, html_data);
    }

    if (matchesTemplate("JANA SMALL FINANCE BANK LIMITED SENP BELOW 50L")) {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.janaSenpBelow50lTemplate(verification, html_data);
    }

    // Generic template for all other banks (uses schema-driven approach)
    try {
      // Get bankName and schema from templateName using helper functions
      let schemaBankName = bankName;
      let schemaToUse = schema;

      if (templateName) {
        const foundBankName = getBankNameFromTemplate(templateName);
        if (foundBankName) {
          schemaBankName = foundBankName;
        }
        const foundSchema = getSchemaFromTemplate(templateName);
        if (foundSchema) {
          schemaToUse = foundSchema;
        }
      }

      // Fallback to formSchema if schema not found from templateName
      if (!schemaToUse) {
        schemaToUse = formSchema[schemaBankName as keyof typeof formSchema];
      }
      if (!schemaToUse) {
        throw new NotFoundException(
          `Bank schema not found for: ${schemaBankName} (templateName: ${templateName || "N/A"})`
        );
      }

      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        approvedStatus,
        financialAnalysis,
        loan
      );
      return templates.genericPDTemplate(verification, schemaToUse, html_data);
    } catch (error) {
      await this.loggingService.error(
        "Failed to generate PDF using generic template",
        {
          bankName,
          error: error.message,
        }
      );
      throw new NotFoundException(
        `Unable to generate PDF for bank: ${bankName}`
      );
    }
  }

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
          templateName: true,
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
      const templateName = loan.templateName;

      const verificationData: any = verification.verificationData;

      // Get bankName and schema from templateName using helper functions
      let schemaBankName = bankName;
      let schema = null;

      console.log("templateName", templateName);
      if (templateName) {
        const foundBankName = getBankNameFromTemplate(templateName);
        if (foundBankName) {
          schemaBankName = foundBankName;
        }
        const foundSchema = getSchemaFromTemplate(templateName);
        if (foundSchema) {
          schema = foundSchema;
        }
      }

      // Fallback to formSchema if schema not found from templateName
      if (!schema) {
        schema = formSchema[schemaBankName as keyof typeof formSchema];
      }
      if (schema) {
        logDataStructure(
          verificationData,
          `${schemaBankName} Verification Data`
        );
        const validationResult = validateVerificationData(
          verificationData,
          schema,
          schemaBankName
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
        templateName,
        verificationData,
        loan,
        verification.synopsis,
        verification.approvedStatus,
        verification.financialAnalysis,
        schema
      );

      // Get footer name from templatesAndFooters using templateName, fallback to templateName, then bankName
      const footerName =
        getFooterNameFromTemplate(templateName) ||
        templateName ||
        bankName ||
        "Kowtha";

      const pdfBuffer = await this.loanService.PDFBufferGeneration(
        htmlTemplate,
        footerName
      );
      const footerNameFromTemplate = getFooterNameFromTemplate(templateName);
      console.log("Footer name resolution: yes", {
        templateName,
        bankName,
        footerNameFromTemplate,
        finalFooterName: footerName,
      });

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

}
