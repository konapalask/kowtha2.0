import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginWithPasswordDto {
  @ApiProperty({ description: 'User mobile number or email', example: '9876543210' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password', example: 'Kowtha@123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'Optional device ID', required: false })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({ description: 'Whether login is from mobile app', required: false })
  @IsOptional()
  isMobile?: boolean;
}
