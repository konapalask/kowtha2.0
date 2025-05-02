import { S3 } from 'aws-sdk';
import { Readable } from 'stream';

const s3 = new S3({
  region: process.env.AWS_REGION || 'us-east-1',
});

export interface S3Config {
  bucket: string;
  region?: string;
}

export class S3Service {
  private bucket: string;
  private region: string;

  constructor(config: S3Config) {
    this.bucket = config.bucket;
    this.region = config.region || process.env.AWS_REGION || 'us-east-1';
  }

  async generatePresignedUrl(
    key: string,
    operation: 'getObject' | 'putObject',
    expiresIn: number = 3600
  ): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn,
    };

    try {
      const url = await s3.getSignedUrlPromise(operation, params);
      return url;
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  async uploadFile(
    key: string,
    file: Buffer | Readable,
    contentType?: string
  ): Promise<string> {
    const params: S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ...(contentType && { ContentType: contentType }),
    };

    try {
      await s3.upload(params).promise();
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async downloadFile(key: string): Promise<Buffer> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      const response = await s3.getObject(params).promise();
      return response.Body as Buffer;
    } catch (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async listFiles(prefix?: string): Promise<string[]> {
    const params: S3.ListObjectsV2Request = {
      Bucket: this.bucket,
      ...(prefix && { Prefix: prefix }),
    };

    try {
      const response = await s3.listObjectsV2(params).promise();
      return (response.Contents || []).map(item => item.Key);
    } catch (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async copyFile(
    sourceKey: string,
    destinationKey: string,
    sourceBucket?: string
  ): Promise<void> {
    const params: S3.CopyObjectRequest = {
      Bucket: this.bucket,
      CopySource: `${sourceBucket || this.bucket}/${sourceKey}`,
      Key: destinationKey,
    };

    try {
      await s3.copyObject(params).promise();
    } catch (error) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }
}

// Create a default S3 service instance
export const s3Service = new S3Service({
  bucket: process.env.S3_BUCKET || 'default-bucket',
});
