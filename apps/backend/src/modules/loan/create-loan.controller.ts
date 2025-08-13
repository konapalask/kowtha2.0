import { Controller, Post, Body, Headers, UnauthorizedException, Res } from "@nestjs/common";
import { LoanService } from "./loan.service";
import { CreateLambdaLoanDto } from "./dto/create-lamba-loan.dto";
import { CreatePDEmailLogDto } from "./dto/create-pd-email-log.dto";
import * as crypto from 'crypto';
import * as puppeteer from 'puppeteer';
import { cholaTemplate } from "./templates/PD/chola.template";
import { adityabirlaTemplate } from "./templates/PD/adityabirla.template";
import { Response } from "express";


const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(process.env.ENCRYPT_KEY)).digest().subarray(0, 32);


function decrypt(encryptedData: { iv: string; data: string }) {
  const iv = Buffer.from(encryptedData.iv, 'base64');
  const encryptedText = encryptedData.data;

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

@Controller('create-loan')
export class CreateLoanController {
  constructor(private readonly createLoanService: LoanService) {}

  @Post()
  async createLambaLoan(@Headers('apiKey') apiKey: string, @Body() encryptedData: any) {

    if (apiKey !== process.env.LAMBDA_API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    const decryptedData = decrypt(encryptedData);
    
    return this.createLoanService.createLambdaLoan(decryptedData as CreateLambdaLoanDto);
  }

  @Post('pdf')
  async PDFGeneration(@Res() res: Response) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=en-IN','--intl.accept_languages=en-IN']
    });

    // Create a new page
    const page = await browser.newPage();
    
    const htmlTemplate = adityabirlaTemplate();
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
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=loan-all.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @Post('pd-email-log')
  async createPDEmailLog( @Body() encryptedData: any, @Headers('apiKey') apiKey: string, @Res() res: Response) {
    if (apiKey !== process.env.LAMBDA_API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    const decryptedData = decrypt(encryptedData);
    
    const loanData = decryptedData.parsedData;

    const loan = await this.createLoanService.createLambdaLoan(decryptedData as CreateLambdaLoanDto);
    
    return this.createLoanService.createPDEmailLog(loanData as CreatePDEmailLogDto);
  }
}   