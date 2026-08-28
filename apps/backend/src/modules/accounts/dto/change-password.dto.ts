import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password (optional if first time setup)', required: false })
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiProperty({ description: 'New password (minimum 6 characters)', example: 'NewSecurePass@123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;
}
