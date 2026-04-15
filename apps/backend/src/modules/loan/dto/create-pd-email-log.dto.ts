import { IsString, IsArray, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePDEmailLogDto {
  @ApiProperty({ description: 'Message ID of the email' })
  @IsString()
  messageID: string;

  @ApiProperty({ description: 'From email addresses', type: [String] })
  @IsArray()
  @IsString({ each: true })
  fromEmail: string[];

  @ApiProperty({ description: 'To email addresses', type: [String] })
  @IsArray()
  @IsString({ each: true })
  toEmail: string[];

  @ApiProperty({ description: 'CC email addresses', type: [String] })
  @IsArray()
  @IsString({ each: true })
  ccEmail: string[];

  @ApiProperty({ description: 'BCC email addresses', type: [String] })
  @IsArray()
  @IsString({ each: true })
  bccEmail: string[];

  @ApiProperty({ description: 'Email subject' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Email body content' })
  @IsString()
  body: string;

  @ApiProperty({ description: 'Email attachments', type: [String] })
  @IsArray()
  @IsString({ each: true })
  attachments: string[];

  @ApiProperty({ description: 'When the email was received', required: false })
  @IsDateString()
  @IsOptional()
  receivedAt?: string;

  @ApiProperty({ description: 'Parsed data from email', required: false })
  @IsOptional()
  parsedData?: any;

  @ApiProperty({ description: 'S3 path for email content', required: false })
  @IsString()
  @IsOptional()
  s3Path?: string;

  @ApiProperty({ description: 'Associated loan ID', required: false })
  @IsNumber()
  @IsOptional()
  loanId?: number;

  @ApiProperty({ description: 'Mailbox that received this email (e.g. appd@cakowtha.co.in)', required: false })
  @IsString()
  @IsOptional()
  receivedByMailbox?: string;
}
