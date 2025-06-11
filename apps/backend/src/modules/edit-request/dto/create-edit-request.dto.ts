import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { EditRequestType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEditRequestDto {
  @ApiProperty({ description: 'Loan ID' })
  @IsNumber()
  loanId: number;

  @ApiProperty({ description: 'Verification ID', required: false })
  @IsNumber()
  @IsOptional()
  verificationId?: number;

  @ApiProperty({ 
    description: 'Changes to be made',
    type: 'object',
    additionalProperties: true
  })
  @IsObject()
  @IsNotEmpty()
  changes: Record<string, any>;

  @ApiProperty({ description: 'Remarks', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({ description: 'Type of edit request', enum: EditRequestType, required: false })
  @IsEnum(EditRequestType)
  @IsOptional()
  type?: EditRequestType;
} 