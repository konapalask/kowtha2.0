import { Controller, Post, Body, Headers, UnauthorizedException } from "@nestjs/common";
import { LoanService } from "./loan.service";
import { CreateLambdaLoanDto } from "./dto/create-lamba-loan.dto";
import * as crypto from 'crypto';

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
}   