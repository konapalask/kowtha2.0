import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EditRequestStatus } from '@prisma/client';

export class UpdateEditRequestDto {
  @IsEnum(EditRequestStatus)
  @IsNotEmpty()
  status: EditRequestStatus;

  @IsString()
  @IsOptional()
  remarks?: string;
} 