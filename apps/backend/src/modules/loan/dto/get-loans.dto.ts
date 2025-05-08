import { IsEnum, IsOptional } from 'class-validator';
import { LoanStatus } from '@prisma/client';

export class GetLoansDto {
  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;
} 