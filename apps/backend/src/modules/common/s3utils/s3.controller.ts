import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { JwtAuthGuard } from '../../accounts/jwt-auth.guard';
import { PutBucketInventoryConfigurationRequestFilterSensitiveLog } from '@aws-sdk/client-s3';

@ApiTags('s3')
@Controller('s3')
@UseGuards(JwtAuthGuard)
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('presigned-upload-url')
  @ApiOperation({ summary: 'Generate a pre-signed URL for file upload' })
  @ApiResponse({
    status: 200,
    description: 'Returns a pre-signed URL for uploading a file to S3',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
    },
  })
  async generatePresignedUploadUrl(
    @Body() body: { path: string; contentType: string }
  ) {
    const url = await this.s3Service.generatePresignedUploadUrl(
      body.path,
      body.contentType
    );
    return { url };
  }

  @Get('presigned-download-url')
  @ApiOperation({ summary: 'Generate a pre-signed URL for file download' })
  @ApiResponse({
    status: 200,
    description: 'Returns a pre-signed URL for downloading a file from S3',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
    },
  })
  async getPresignedDownloadUrl(@Query('path') path: string) {
    const url = await this.s3Service.generatePresignedDownloadUrl(path);
    return { url };
  }
} 