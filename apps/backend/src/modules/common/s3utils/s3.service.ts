import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { LoggingService } from '../logging/logging.service';
import { createCanvas, loadImage, Canvas, Image as CanvasImage, CanvasRenderingContext2D } from 'canvas';
import fetch from 'node-fetch';
import fs from 'fs';

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

  async cleanAddress(address: string): Promise<string> {
    // Remove words containing 'zone', 'ward', 'municipal', 'corporation', 'greater' (case-insensitive)
    return address
      .split(' ')
      .filter(word => !/(zone|ward|municipal|corporation|greater)/i.test(word))
      .join(' ');
  }

  async wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): Promise<string[]> {
    // Simple word wrap for canvas
    const words = text.split(' ');
    let lines: string[] = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  async getAddressFromLatLon(latitude: number, longitude: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'bys_image_geotag_app' }
    });
    const data: any = await response.json();
    return data.display_name || 'Address not found';
  }

  async processImage(
    inputPath: string,
    outputPath: string,
    latitude: number,
    longitude: number
  ) {
    const img = await loadImage(inputPath);
    // Check orientation and set preferred resolution
    let preferredWidth: number, preferredHeight: number;
    console.log(img.width, img.height);

    if (img.width > img.height) {
      preferredWidth = 960;
      preferredHeight = 650;
    } else {
      preferredWidth = 650;
      preferredHeight = 960;
    }
    // preferredWidth = img.width;
    // preferredHeight = img.height;
    // Create canvas and draw resized image
    const canvas = createCanvas(preferredWidth, preferredHeight);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, preferredWidth, preferredHeight);

    // Get address and clean it
    let address = await this.getAddressFromLatLon(latitude, longitude);
    address = await this.cleanAddress(address);

    // Prepare text
    const latlonText = `Lat: ${latitude.toFixed(6)}   Lon: ${longitude.toFixed(6)}`;
    ctx.font = '20px Arial';
    const maxTextWidth = preferredWidth - 80;
    const addressLines = await this.wrapText(ctx, address, maxTextWidth);
    const now = new Date();
    const timestamp = now.toLocaleString('en-GB', { hour12: true, timeZone: 'Asia/Kolkata' }) + ' IST';

    // Calculate text block height
    const lineSpacing = 15;
    const latlonHeight = 20;
    const addressHeights = addressLines.length * (20 + lineSpacing);
    const timestampHeight = 20;
    const totalTextHeight = latlonHeight + addressHeights + timestampHeight + 3 * lineSpacing;
    const padding = 20;
    const bottomPadding = 50;
    const x = padding;
    const y = preferredHeight - totalTextHeight - padding - bottomPadding;

    // Draw background rectangle (light yellow)
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'rgb(255,255,204)';
    ctx.fillRect(x - padding, y - padding, maxTextWidth + 2 * padding, totalTextHeight + 2 * padding);
    ctx.globalAlpha = 1.0;

    // Draw text
    let currentY = y;
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(latlonText, x, currentY + 20);
    currentY += latlonHeight + lineSpacing;
    for (const line of addressLines) {
      ctx.fillText(line, x, currentY + 20);
      currentY += 20 + lineSpacing;
    }
    ctx.fillText(timestamp, x, currentY + 20);

    // Save output
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    await new Promise<void>(resolve => out.on('finish', () => resolve()));
    console.log(`Processed image saved to ${outputPath}`);
  }

  async processAndUploadImage(s3ImageUrl: string, latitude: number, longitude: number): Promise<string> {
    try {
      // Download the image from S3
      const response = await fetch(s3ImageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      
      // Create temporary files for input and output
      const tempInputPath = `/tmp/input_${Date.now()}.jpg`;
      const tempOutputPath = `/tmp/output_${Date.now()}.jpg`;
      
      // Write the downloaded image to temp file
      fs.writeFileSync(tempInputPath, imageBuffer);
      
      // Process the image
      await this.processImage(tempInputPath, tempOutputPath, latitude, longitude);
      
      // Read the processed image
      const processedImageBuffer = fs.readFileSync(tempOutputPath);
      
      // Upload the processed image back to S3 with the same key
      const key = s3ImageUrl.split('/').pop(); // Get the filename from the URL
      if (!key) {
        throw new Error('Invalid S3 URL - could not extract key');
      }
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: processedImageBuffer,
        ContentType: 'image/jpeg',
      });
      
      await this.s3Client.send(command);
      
      // Clean up temporary files
      fs.unlinkSync(tempInputPath);
      fs.unlinkSync(tempOutputPath);
      
      // Return the same S3 URL since we're overwriting the file
      return s3ImageUrl;
    } catch (error) {
      await this.loggingService.error('Failed to process and upload image', {
        s3ImageUrl,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
} 