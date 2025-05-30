import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateEditRequestDto {
  @IsInt()
  @IsNotEmpty()
  loanId: number;

  @IsInt()
  @IsOptional()
  verificationId?: number;

  @IsObject()
  @IsNotEmpty()
  changes: Record<string, any>;

  @IsString()
  @IsOptional()
  remarks?: string;
} 