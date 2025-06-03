import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfficeDto {
  @ApiProperty({ description: 'Name of the office/branch' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Location of the office/branch' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Address of the office/branch' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Contact number of the office/branch', required: false })
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiProperty({ description: 'Email address of the office/branch', required: false })
  @IsString()
  @IsOptional()
  email?: string;
} 