import * as fs from 'fs';
import * as path from 'path';
import { S3Service } from 'src/modules/common/s3utils/s3.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoanService } from '../loan.service';
import { PrismaService } from 'src/prisma.service';
import {
    Prisma, LoanStatus, VerificationType, VerificationStatus,
    AddressType, UserRole, ApprovedStatus, Department
  } from '@prisma/client';
import { axisFinanceUBLTemplate } from './PD/axis-finance-ubl.template';
import { LoggingService } from 'src/modules/common/logging/logging.service';
import { AxisFinanceUBLInterface } from './PD/interface/axis-finance-ubl.interface';
import { mapAxisUBL } from './PD/mappers/axis-finance-ubl.mapper';
import { RBLInterface } from './PD/interface/rbl.interface';
import { rblTemplate } from './PD/rbl.template';

@Injectable()
export class PDTemplateService {
    constructor(
        private loggingService: LoggingService,
        private s3Service: S3Service,
        private prisma: PrismaService,
        private loanService: LoanService,

    ) { }

    async FormatPDImages(verification: any, bankName: string, applicationNumber: string, synopsis: string, financialAnalysis: any): Promise<any> {
      const imagePath = path.resolve(process.env.SIGNATURE_PATH || '/home/ubuntu/kowtha/new_sign.jpg');
      const imageBase64 = fs.readFileSync(imagePath, 'base64');
      const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

      const status = verification?.approvedStatus || '';

      const uploadedItems = verification?.uploadedItems || [];

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

      const imagesData = await this.loanService.formatImages(validImageUrls, bankName, fieldExecutive);

      return {
          bankName: bankName,
          applicationNumber: applicationNumber,
          path: synopsis,
          financialAnalysis: financialAnalysis,
          status: status,
          imageDataUri: imageDataUri,
          imagesData: imagesData,
          fieldExecutive: fieldExecutive,
        }
    }

    async InterfaceMapping(bankName: string, verification: any, loan: any, synopsis: string, financialAnalysis: any): Promise<any> {

        if (bankName == 'Axis Bank') {
            let verificationData = loan.verificationData as AxisFinanceUBLInterface
            const html_data = await this.FormatPDImages(verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis);
            return axisFinanceUBLTemplate(verificationData, html_data);
        }

        if (bankName == 'Rbl') {
          let verificationData = verification as RBLInterface
          const html_data = await this.FormatPDImages(verificationData, bankName, loan.applicationNumber, synopsis, financialAnalysis);
          return rblTemplate(verificationData, html_data);
        } else {
          throw new NotFoundException('Bank not found');
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
          console.log(verification, "==================");
          const bankName = loan.bankName;
          
          const verificationData: any = verification.verificationData;
          
          const htmlTemplate = await this.InterfaceMapping(bankName, verificationData, loan, verification.synopsis, verification.financialAnalysis);
    
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


