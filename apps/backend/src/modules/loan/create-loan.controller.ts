import * as crypto from "crypto";
import { Response } from "express";
import { LoanService } from "./loan.service";
import { CreateLambdaLoanDto } from "./dto/create-lamba-loan.dto";
import { CreatePDEmailLogDto } from "./dto/create-pd-email-log.dto";
import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  Res,
  Logger,
} from "@nestjs/common";

const algorithm = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(String(process.env.ENCRYPT_KEY))
  .digest()
  .subarray(0, 32);

function decrypt(encryptedData: { iv: string; data: string }) {
  const iv = Buffer.from(encryptedData.iv, "base64");
  const encryptedText = encryptedData.data;

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
}

@Controller("create-loan")
export class CreateLoanController {
  private readonly logger = new Logger(CreateLoanController.name);

  constructor(private readonly createLoanService: LoanService) {}

  @Post()
  async createLambaLoan(
    @Headers("apiKey") apiKey: string,
    @Body() encryptedData: any
  ) {
    this.logger.debug(`API Key received: ${apiKey ? "Present" : "Missing"}`);
    this.logger.debug(
      `Encrypted data received: ${JSON.stringify(encryptedData)}`
    );

    if (apiKey !== process.env.LAMBDA_API_KEY) {
      throw new UnauthorizedException("Invalid API key");
    }

    try {
      const decryptedData = decrypt(encryptedData);
      this.logger.debug(`Decrypted data: ${JSON.stringify(decryptedData)}`);

      const result = await this.createLoanService.createLambdaLoan(
        decryptedData as CreateLambdaLoanDto
      );

      return result;
    } catch (error) {
      this.logger.error("Error in createLambaLoan", error.stack);
      throw error;
    }
  }

  @Post("email-log")
  async createEmailLog(
    @Body() encryptedData: any,
    @Headers("apiKey") apiKey: string
  ) {
    this.logger.debug(
      `Encrypted data received for email log: ${JSON.stringify(encryptedData)}`
    );

    if (apiKey !== process.env.LAMBDA_API_KEY) {
      this.logger.warn("Invalid API key provided for email log");
      throw new UnauthorizedException("Invalid API key");
    }

    this.logger.log("API key validation successful for email log");

    try {
      const decryptedData = decrypt(encryptedData);

      // Find loan by application number (loan should already exist from /create-loan/ call)
      const loan = await this.createLoanService.findLoanByApplicationNumber(
        decryptedData.applicationNumber,
        decryptedData.bankName
      );

      if (!loan) {
        throw new Error(
          `Loan not found for application ${decryptedData.applicationNumber}. Please create the loan first.`
        );
      }

      this.logger.log(
        `Found loan with ID ${loan.id} for application ${decryptedData.applicationNumber}`
      );

      // Create email log linked to the loan
      const emailLogData = {
        ...decryptedData.emailLogData,
        loanId: loan.id,
      } as CreatePDEmailLogDto;

      const result =
        await this.createLoanService.createPDEmailLog(emailLogData);

      return result;
    } catch (error) {
      this.logger.error("Error in createEmailLog", error.stack);
      throw error;
    }
  }
}
