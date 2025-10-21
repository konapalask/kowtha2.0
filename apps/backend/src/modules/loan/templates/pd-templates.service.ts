import * as fs from 'fs';
import * as path from 'path';
import { S3Service } from 'src/modules/common/s3utils/s3.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoanService } from '../loan.service';
import { PrismaService } from 'src/prisma.service';
import {
<<<<<<< Updated upstream
    Prisma, LoanStatus, VerificationType, VerificationStatus,
    AddressType, UserRole, ApprovedStatus, Department
  } from '@prisma/client';
import { axisFinanceUBLTemplate } from './PD/axis-finance-ubl.template';
import { LoggingService } from 'src/modules/common/logging/logging.service';
import { AxisFinanceUBLInterface } from './PD/interface/axis-finance-ubl.interface';
import { mapAxisUBL } from './PD/mappers/axis-finance-ubl.mapper';
=======
  Prisma,
  LoanStatus,
  VerificationType,
  VerificationStatus,
  AddressType,
  UserRole,
  ApprovedStatus,
  Department,
} from "@prisma/client";
import { axisFinanceUBLTemplate } from "./PD/axis-finance-ubl.template";
import { LoggingService } from "src/modules/common/logging/logging.service";
import { AxisFinanceUBLInterface } from "./PD/interface/axis-finance-ubl.interface";
import { mapAxisUBL } from "./PD/mappers/axis-finance-ubl.mapper";
import { RBLInterface } from "./PD/interface/rbl.interface";
import { rblTemplate } from "./PD/rbl.template";
import { genericPDTemplate } from "./PD/generic.template";
import { formSchema } from "../forms-schema";
import {cholaTemplate} from "./PD/chola.template";
import {CholaInterface} from "./PD/interface/chola.interface";
import {arkaFincapTemplate} from "./PD/arka-fincap.template";
import {ArkafincapInterface} from "./PD/interface/arka-fincap.interface";

import {
  validateVerificationData,
  logDataStructure,
} from "./PD/template-validator";
>>>>>>> Stashed changes

@Injectable()
export class PDTemplateService {
    constructor(
        private loggingService: LoggingService,
        private s3Service: S3Service,
        private prisma: PrismaService,
        private loanService: LoanService,

    ) { }

    async FormatPDImages(validImageUrls: string[], bankName: string, fieldExecutive: string): Promise<any> {
        return this.loanService.formatImages(validImageUrls, bankName, fieldExecutive);
    }

    async InterfaceMapping(bankName: string, verification: any, loan: any): Promise<any> {
      const imagePath = path.resolve(process.env.SIGNATURE_PATH || '/home/ubuntu/kowtha/new_sign.jpg');
      const imageBase64 = fs.readFileSync(imagePath, 'base64');
      const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;
            
        if (bankName == 'Axis Bank') {
            // Map incoming verification data (schema-driven or legacy) to AxisFinanceUBLInterface
            let verificationData: AxisFinanceUBLInterface = mapAxisUBL(verification);

            const status = verification?.approvedStatus || '';

            const uploadedItems = verificationData?.uploadedItems || [];
    
            // Generate presigned URLs for images
            const imageUrls = await Promise.all(
              uploadedItems.map(async (item: any) => {
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
      
            const fieldExecutive = verification.fieldExecutive?.name || '';

            const imagesData = await this.FormatPDImages(validImageUrls, bankName, fieldExecutive);

            const html_data = {
                bankName: bankName,
                applicationNumber: loan.applicationNumber,
                path: verification.path,
                status: status,
                imageDataUri: imageDataUri,
                imagesData: imagesData,
                fieldExecutive: fieldExecutive,
              }
            return axisFinanceUBLTemplate(verificationData, html_data);
        }

        if (bankName == 'Tata Ubl') {
          // Map incoming verification data (schema-driven or legacy) to AxisFinanceUBLInterface
          let verificationData: AxisFinanceUBLInterface = mapAxisUBL(verification);

          const status = verification?.approvedStatus || '';

          const uploadedItems = verificationData?.uploadedItems || [];
  
          // Generate presigned URLs for images
          const imageUrls = await Promise.all(
            uploadedItems.map(async (item: any) => {
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
    
          const fieldExecutive = verification.fieldExecutive?.name || '';

          const imagesData = await this.FormatPDImages(validImageUrls, bankName, fieldExecutive);

          const html_data = {
              bankName: bankName,
              applicationNumber: loan.applicationNumber,
              path: verification.path,
              status: status,
              imageDataUri: imageDataUri,
              imagesData: imagesData,
              fieldExecutive: fieldExecutive,
            }
          return axisFinanceUBLTemplate(verificationData, html_data);
      }
    }
 
    async previewPDVerificationPDF(loanId: number): Promise<Buffer> {
        try {
<<<<<<< Updated upstream
          // Fetch loan details with verification data
          const loan = await this.prisma.loan.findUnique({
            where: { id: loanId, department: Department.PD },
=======
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
    // Banks with custom templates
    if (bankName == "Axis Bank") {
      let verificationData = loan.verificationData as AxisFinanceUBLInterface;
      const html_data = await this.FormatPDImages(
        verificationData,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis
      );
      return axisFinanceUBLTemplate(verificationData, html_data);
    }

    if (bankName == "RBL" || bankName == "Rbl") {
      let verificationData = verification as RBLInterface;
      const html_data = await this.FormatPDImages(
        verificationData,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis
      );
      return rblTemplate(verificationData, html_data, schema);
    }

    if (bankName == "Arka Fincap") {
      let verificationData = verification as ArkafincapInterface;
      const html_data = await this.FormatPDImages(
        verificationData,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis
      );
      return arkaFincapTemplate(verificationData, html_data);
    }

    if (bankName == "Chola") {
      let verificationData = verification as CholaInterface;
      const html_data = await this.FormatPDImages(
        verificationData,
        bankName,
        loan.applicationNumber,
        synopsis,
        financialAnalysis
      );
      return cholaTemplate(verificationData, html_data);
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
        financialAnalysis
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

  async previewPDVerificationPDF(loanId: number): Promise<Buffer> {
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
>>>>>>> Stashed changes
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
                  fieldExecutive: { select: { name: true } }
                }
              },
            }
          });
    
          if (!loan) {
            throw new NotFoundException('Loan not found');
          }
    
          if (loan.verifications.length === 0) {
            throw new NotFoundException(`Verification for address type Business not found`);
          }
    
          const verification = loan.verifications[0];
    
          const bankName = loan.bankName;
          
          const verificationData: any = verification.verificationData;
          console.log(loan.verifications.length);
          // Generate HTML template using the appropriate template function
          const htmlTemplate = await this.InterfaceMapping(bankName, verificationData, loan);
    
          const pdfBuffer = await this.loanService.PDFBufferGeneration(htmlTemplate);
    
          await this.loggingService.info('Verification PDF generated successfully', {
            loanId,
            applicationNumber: loan.applicationNumber,
          });
    
          return pdfBuffer;
        } catch (error) {
          await this.loggingService.error('Failed to generate verification PDF', {
            loanId,
            error: error.message,
            stack: error.stack,
          });
          throw error;
        }
      }
}


