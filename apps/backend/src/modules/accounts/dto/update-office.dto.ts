import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOfficeDto } from './create-office.dto';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class UpdateOfficeDto extends PartialType(CreateOfficeDto) { 

  @ApiProperty({ description: 'Archived', required: false })
  @IsBoolean()
  @IsOptional()
  archived?: boolean;
  
 } 