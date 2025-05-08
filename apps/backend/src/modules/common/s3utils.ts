import { Injectable } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly uploadDir: string;

  constructor(
    private loggingService: LoggingService,
    uploadDir: string = 'uploads'
  ) {
    this.uploadDir = path.resolve(process.cwd(), uploadDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: { originalname: string; buffer: Buffer; size: number }): Promise<string> {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(this.uploadDir, fileName);
      await fs.promises.writeFile(filePath, file.buffer);
      
      await this.loggingService.info('File uploaded successfully', {
        fileName,
        size: file.size
      });
      
      return fileName;
    } catch (error) {
      await this.loggingService.error('Failed to upload file', {
        originalName: file.originalname,
        error: error.message
      });
      throw error;
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    return `/uploads/${fileName}`;
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, fileName);
      await fs.promises.unlink(filePath);
      
      await this.loggingService.info('File deleted successfully', {
        fileName
      });
    } catch (error) {
      await this.loggingService.error('Failed to delete file', {
        fileName,
        error: error.message
      });
      throw error;
    }
  }
}
