import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteVerificationDto {
  @ApiProperty({
    description: 'ID of the field executive assigned to the verification',
    example: 123
  })
  @IsNumber()
  fieldExecutiveId: number;
} 