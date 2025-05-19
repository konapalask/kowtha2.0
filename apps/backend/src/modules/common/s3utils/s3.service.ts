import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private loggingService: LoggingService) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET || '';
  }

  async generatePresignedUploadUrl(fileName: string, contentType: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        ContentType: contentType,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

      await this.loggingService.info('Generated presigned upload URL', {
        fileName,
        contentType,
      });

      return signedUrl;
    } catch (error) {
      await this.loggingService.error('Failed to generate presigned upload URL', {
        fileName,
        contentType,
        error: error.message,
      });
      throw error;
    }
  }

  async generatePresignedDownloadUrl(path: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: path,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

      await this.loggingService.info('Generated presigned download URL', {
        path,
      });

      return signedUrl;
    } catch (error) {
      await this.loggingService.error('Failed to generate presigned download URL', {
        path,
        error: error.message,
      });
      throw error;
    }
  }
} 