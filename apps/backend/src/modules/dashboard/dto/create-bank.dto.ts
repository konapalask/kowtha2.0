import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankDto {
  @ApiProperty({ description: 'Bank name', required: true })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Bank logo URL', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  logo?: string;

  @ApiProperty({ description: 'Parent bank name', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  parent?: string;
}
