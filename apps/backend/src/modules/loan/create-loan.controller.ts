import { Controller, Post, Body, Headers, UnauthorizedException, Res, Logger } from "@nestjs/common";
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
  private readonly logger = new Logger(CreateLoanController.name);

  constructor(private readonly createLoanService: LoanService) {}

  @Post()
  async createLambaLoan(@Headers('apiKey') apiKey: string, @Body() encryptedData: any) {
    this.logger.log('Starting createLambaLoan request');
    this.logger.debug(`API Key received: ${apiKey ? 'Present' : 'Missing'}`);
    this.logger.debug(`Encrypted data received: ${JSON.stringify(encryptedData)}`);

    if (apiKey !== process.env.LAMBDA_API_KEY) {
      this.logger.warn('Invalid API key provided');
      throw new UnauthorizedException('Invalid API key');
    }
    
    this.logger.log('API key validation successful');
    
    try {
      this.logger.log('Starting data decryption');
      const decryptedData = decrypt(encryptedData);
      this.logger.log('Data decryption successful');
      this.logger.debug(`Decrypted data: ${JSON.stringify(decryptedData)}`);
      
      this.logger.log('Calling createLambdaLoan service');
      const result = await this.createLoanService.createLambdaLoan(decryptedData as CreateLambdaLoanDto);
      this.logger.log('createLambdaLoan service completed successfully');
      
      return result;
    } catch (error) {
      this.logger.error('Error in createLambaLoan', error.stack);
      throw error;
    }
  }


  @Post('pd-email-log')
  async createPDEmailLog( @Body() encryptedData: any, @Headers('apiKey') apiKey: string, @Res() res: Response) {
    this.logger.log('Starting createPDEmailLog request');
    this.logger.debug(`API Key received: ${apiKey ? 'Present' : 'Missing'}`);
    this.logger.debug(`Encrypted data received: ${JSON.stringify(encryptedData)}`);

    if (apiKey !== process.env.LAMBDA_API_KEY) {
      this.logger.warn('Invalid API key provided for PD email log');
      throw new UnauthorizedException('Invalid API key');
    }
    
    this.logger.log('API key validation successful for PD email log');
    
    try {
      this.logger.log('Starting data decryption for PD email log');
      const decryptedData = decrypt(encryptedData);
      this.logger.log('Data decryption successful for PD email log');
      this.logger.debug(`Decrypted data: ${JSON.stringify(decryptedData)}`);
      
      const loanData = decryptedData.parsedData;
      this.logger.debug(`Extracted loan data: ${JSON.stringify(loanData)}`);

      this.logger.log('Calling createLambdaLoan service for PD email log');
      const loan = await this.createLoanService.createLambdaLoan(decryptedData as CreateLambdaLoanDto);
      this.logger.log('createLambdaLoan service completed successfully for PD email log');
      
      this.logger.log('Calling createPDEmailLog service');
      const result = await this.createLoanService.createPDEmailLog(loanData as CreatePDEmailLogDto);
      this.logger.log('createPDEmailLog service completed successfully');
      
      return result;
    } catch (error) {
      this.logger.error('Error in createPDEmailLog', error.stack);
      throw error;
    }
  }
}   