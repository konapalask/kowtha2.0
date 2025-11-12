import * as fs from "fs";
import * as path from "path";
import { formSchema } from "./forms-schema";
import { LoanService } from "./loan.service";
import { PrismaService } from "src/prisma.service";
import * as templates from "./templates/PD/html/_index";
// import * as interfaces from "./templates/PD/interface/_index";
import { VerificationType, Department } from "@prisma/client";
import { S3Service } from "src/modules/common/s3utils/s3.service";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { LoggingService } from "src/modules/common/logging/logging.service";
// import { AxisFinanceUBLInterface } from "./templates/PD/interface/axis-finance-ubl.interface";
import { axisFinanceUBLTemplate } from "./templates/PD/html/axis-finance-ubl.template";
// import { mapAxisUBL } from "./templates/PD/mappers/axis-finance-ubl.mapper";
// import { RBLInterface } from "./templates/PD/interface/rbl.interface";
import { rblTemplate } from "./templates/PD/html/rbl.template";
import { iciciTemplate } from "./templates/PD/html/icici.template";
import { cholaTemplate } from "./templates/PD/html/chola.template";
import { heroFincorpTemplate } from "./templates/PD/html/hero-fincorp.template";
import { iiflTemplate } from "./templates/PD/html/iifl.template";
import { yesBankTemplate } from "./templates/PD/html/yes-bank.template";
import { tataUblTemplate } from "./templates/PD/html/tata-ubl.template";
import { axisBankTemplate } from "./templates/PD/html/axis-bank.template";
import { axisFinanceTemplate } from "./templates/PD/html/axis-finance.template";
import { arkaFincapTemplate } from "./templates/PD/html/arka-fincap.template";
import { heroHousingSelfTemplate } from "./templates/PD/html/hero-housing-self.template";
import { herohousingSalariedTemplate } from "./templates/PD/html/herohousing-salaried.template";
import { idfcHlMlTemplate } from "./templates/PD/html/idfc-hl-ml.template";
import { idfcPlTemplate } from "./templates/PD/html/idfc-pl.template";
import { indiaShelterSalariedTemplate } from "./templates/PD/html/india-shelter-salaried.template";
import { indiaShelterSenpTemplate } from "./templates/PD/html/india-shelter-senp.template";
import { axisAgriTemplate } from "./templates/PD/html/axis-agri.template";
import { smfgSmeTemplate } from "./templates/PD/html/smfg-sme.template";
import { adityaBirlaTemplate } from "./templates/PD/html/aditya-birla.template";
import { niwasSenpTemplate } from "./templates/PD/html/niwas-senp.template";
import { niwasSalariedTemplate } from "./templates/PD/html/niwas-salaried.template";
import { genericPDTemplate } from "./templates/PD/html/generic.template";
import { dcbTemplate } from "./templates/PD/html/dcb.template";
import { incredTemplate } from "./templates/PD/html/incred.template";
import { ambitTemplate } from "./templates/PD/html/ambit.template";
import { ambitMsmeTemplate } from "./templates/PD/html/ambit-msme.template";
import { janaSalariedTemplate } from "./templates/PD/html/jana-salaried.template";
import { janaSenpAbove50lTemplate } from "./templates/PD/html/jana-senp-above-50l.template";
import { janaSenpBelow50lTemplate } from "./templates/PD/html/jana-senp-below-50l.template";

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

  async FormatPDImages(
    verification: any,
    bankName: string,
    applicationNumber: string,
    synopsis: string,
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
      if (typeof value === "string" && (value.toLowerCase() === "nan" || value.toLowerCase() === "null")) {
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
              const hasCoordinates = photo.latitude && photo.longitude;
              return `
                <div style="width:48%;margin:1%;border:1px solid #ddd;padding:10px;text-align:center;display:inline-block;vertical-align:top;box-sizing:border-box;page-break-inside:avoid;">
                  <img src="${photo.url}" alt="${group.documentType}" style="width:100%;height:260px;object-fit:contain;margin-bottom:8px;" />
                  <div style="font-size:12px;color:#555;text-align:left;">
                    ${
                      hasCoordinates
                        ? `<div><strong>Geo Tag:</strong> ${photo.latitude}, ${photo.longitude}</div>`
                        : ""
                    }
                    ${
                      photo.timestamp
                        ? `<div><strong>Captured:</strong> ${photo.timestamp}</div>`
                        : ""
                    }
                    ${
                      photo.remarks
                        ? `<div><strong>Remarks:</strong> ${photo.remarks}</div>`
                        : ""
                    }
                  </div>
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

    return {
      bankName: loan?.templateName || bankName,
      applicationNumber: applicationNumber,
      path: synopsis,
      financialAnalysis: financialAnalysis,
      status: status,
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
    verification: any,
    loan: any,
    synopsis: string,
    financialAnalysis: any,
    schema?: any
  ): Promise<any> {
    // Banks with custom templates
    if (
      bankName === "Axis Finance UBL Above 10L" ||
      bankName === "Axis Finance UBL Below 10L"
    ) {
      // const verificationData = (verification?.verificationData ||
        // verification) as AxisFinanceUBLInterface;
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return axisFinanceUBLTemplate(verification, html_data);
    }

    if (bankName == "RBL" || bankName == "Rbl") {
      // let verificationData = verification as RBLInterface; 
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return rblTemplate(verification, html_data);
    }

    if (bankName == "ICICI") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return iciciTemplate(verification, html_data);
    }

    if (bankName == "Chola") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return cholaTemplate(verification, html_data);
    }

    if (bankName == "Hero Fincorp") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return heroFincorpTemplate(verification, html_data);
    }

    if (bankName == "IIFL") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return iiflTemplate(verification, html_data);
    }

    if (bankName == "Yes Bank") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return yesBankTemplate(verification, html_data);
    }

    if (bankName == "Tata Ubl") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return tataUblTemplate(verification, html_data);
    }

    if (bankName == "Axis Bank") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return axisBankTemplate(verification, html_data);
    }

    if (bankName == "Axis Finance") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return axisFinanceTemplate(verification, html_data);
    }

    if (bankName == "Axis Agri") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return axisAgriTemplate(verification, html_data);
    }

    if (bankName == "SMFG SME") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return smfgSmeTemplate(verification, html_data);
    }

    if (bankName == "Niwas Salaried") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return niwasSalariedTemplate(verification, html_data);
    }

    if (bankName == "Niwas Senp") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return niwasSenpTemplate(verification, html_data);
    }

    if (bankName == "Arka Fincap") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return arkaFincapTemplate(verification, html_data);
    }

    if (bankName == "HeroHousing-Self") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return heroHousingSelfTemplate(verification, html_data);
    }

    if (bankName == "HeroHousing-Salaried") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return herohousingSalariedTemplate(verification, html_data);
    }

    if (bankName == "India Shelter SENP") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return indiaShelterSenpTemplate(verification, html_data);
    }

    if (bankName == "India Shelter Salaried") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return indiaShelterSalariedTemplate(verification, html_data);
    }

    if (bankName == "IDFC PL") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return idfcPlTemplate(verification, html_data);
    }

    if (bankName == "IDFC HL & ML") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return idfcHlMlTemplate(verification, html_data);
    }

    if (bankName == "Aditya Birla") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return adityaBirlaTemplate(verification, html_data);
    }

    if (bankName == "DCB") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return dcbTemplate(verification, html_data);
    }

    if (bankName == "INCRED") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return incredTemplate(verification, html_data);
    }
    if (bankName == "Ambit") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return ambitTemplate(verification, html_data);
    }
    if (bankName == "Ambit-MSME") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return ambitMsmeTemplate(verification, html_data);
    }

    if (bankName == "Jana Salaried") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return janaSalariedTemplate(verification, html_data);
    }

    if (bankName == "Jana Senp Above 50l") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return janaSenpAbove50lTemplate(verification, html_data);
    }

    if (bankName == "Jana Senp Below 50l") {
      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return janaSenpBelow50lTemplate(verification, html_data);
    }
  
    // Generic template for all other banks (uses schema-driven approach)
    try {
      // Get schema for this bank
      const schema = formSchema[bankName as keyof typeof formSchema];
      if (!schema) {
        throw new NotFoundException(`Bank schema not found for: ${bankName}`);
      }

      const html_data = await this.FormatPDImages(
        verification,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis,
        loan
      );
      return genericPDTemplate(verification, schema, html_data);
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

      // Use templateName for footer, fallback to bankName if templateName is not set
      const footerName = templateName || bankName || "Kowtha";

      const pdfBuffer = await this.loanService.PDFBufferGeneration(
        htmlTemplate,
        footerName
      );

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

  // async FormatPDImages(verification: any, bankName: string, applicationNumber: string, synopsis: string, financialAnalysis: any): Promise<any> {

  //   const signaturePath = path.resolve(process.cwd(),process.env.SIGNATURE_PATH);
  //   const imageBase64 = fs.readFileSync(signaturePath, "base64");
  //   const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

  //   const status = verification?.approvedStatus || "";

  //   const uploadedItems = verification?.uploadedItems || [];

  //   // Generate presigned URLs for images
  //   const imageUrls = await Promise.all(
  //     uploadedItems.map(async (item: any) => {
  //       try {
  //         return await this.s3Service.generatePresignedDownloadUrl(
  //           item.s3ImageUrl
  //         );
  //       } catch (error) {
  //         await this.loggingService.error(
  //           "Failed to generate presigned URL for image",
  //           {
  //             s3ImageUrl: item.s3ImageUrl,
  //             error: error.message,
  //           }
  //         );
  //         return null;
  //       }
  //     })
  //   );

  //   // Filter out any failed URL generations
  //   const validImageUrls = imageUrls.filter((url) => url !== null);

  //   const fieldExecutive = verification.fieldExecutive?.name || "";

  //   const imagesData = await this.loanService.formatImages(
  //     validImageUrls,
  //     bankName,
  //     fieldExecutive
  //   );

  //   return {
  //     bankName: bankName,
  //     applicationNumber: applicationNumber,
  //     path: synopsis,
  //     financialAnalysis: financialAnalysis,
  //     status: status,
  //     imageDataUri: imageDataUri,
  //     imagesData: imagesData,
  //     fieldExecutive: fieldExecutive,
  //   };
  // }

  // async InterfaceMapping(
  //   bankName: string,
  //   verification: any,
  //   loan: any,
  //   synopsis: string,
  //   financialAnalysis: any,
  //   schema?: any
  // ): Promise<any> {
    
  //   if (bankName == "Axis Bank") {
  //     let verificationData = loan.verificationData as interfaces.AxisFinanceUBLInterface;
  //     const html_data = await this.FormatPDImages( verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis );
  //     return templates.axisFinanceUBLTemplate(verificationData, html_data);
  //   }

  //   if (bankName == "RBL" || bankName == "Rbl") {
  //     let verificationData = verification as interfaces.RBLInterface;
  //     const html_data = await this.FormatPDImages( verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis );
  //     return templates.rblTemplate(verificationData, html_data);
  //   }

  //   if (bankName == "Aditya Birla") {
  //     let verificationData = verification as any;
  //     const html_data = await this.FormatPDImages( verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis );
  //     return templates.adityaBirlaTemplate(verificationData, html_data);
  //   }

  //   if (bankName == "Arka Fincap") {
  //     let verificationData = verification as interfaces.ArkaFincapInterface;
  //     const html_data = await this.FormatPDImages( verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis );
  //     return templates.arkaFincapTemplate(verificationData, html_data);
  //   }
  // }
}
