import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { LoggingService } from '../logging/logging.service';
import { createCanvas, loadImage, Canvas, Image as CanvasImage, CanvasRenderingContext2D } from 'canvas';
import fetch from 'node-fetch';
import fs from 'fs';
import { format, toZonedTime } from 'date-fns-tz';

@Injectable()
export class S3Service {
  private static readonly IMAGE_KEY_REGEX =
    /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif)$/i;

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

  async uploadPdfToS3(pdfBuffer: Buffer, fileName: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    });
  
    try {
      await this.s3Client.send(command);
  
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      const signedUrl = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 }); // URL expires in 1 hour

      await this.loggingService.info('Generated presigned download URL', {
        fileName,
      });

      return signedUrl;
    } catch (error) {
      await this.loggingService.error('Failed to upload PDF to S3', {
        fileName,
        error: error.message,
      });
      throw error;
    }
  };

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
    
    const date = new Date();
    const timeZone = 'Asia/Kolkata';
    const zonedDate = toZonedTime(date, timeZone);

  const istDate = format(zonedDate, 'dd-MM-yyyy hh:mm:ss a xxx', { timeZone });

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
    ctx.fillText(istDate, x, currentY + 20);

    // Save output
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    await new Promise<void>(resolve => out.on('finish', () => resolve()));
  }

  async processAndUploadImage(s3ImageUrl: string, latitude: number, longitude: number, timestamp: string): Promise<string> {
    try {
      // Download the image from S3
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: s3ImageUrl,
      });
    
      const s3Response = await this.s3Client.send(getCommand);

      const chunks: Buffer[] = [];

      for await (const chunk of s3Response.Body as any) {
        chunks.push(chunk);
      }
      const imageBuffer = Buffer.concat(chunks);
    
      // Load image from buffer
      const img = await loadImage(imageBuffer);
    
      // Determine size (smaller canvas → smaller stored JPEG → smaller PDFs)
      let preferredWidth: number, preferredHeight: number;

      if (img.width > img.height) {
        preferredWidth = 800;
        preferredHeight = 540;
      } else {
        preferredWidth = 540;
        preferredHeight = 800;
      }
    
      // Create canvas and draw resized image
      const canvas = createCanvas(preferredWidth, preferredHeight);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, preferredWidth, preferredHeight);

      // Prepare text
      // Validate latitude and longitude are valid numbers
      const isValidLat = latitude !== null && latitude !== undefined && !Number.isNaN(latitude) && Number.isFinite(latitude);
      const isValidLng = longitude !== null && longitude !== undefined && !Number.isNaN(longitude) && Number.isFinite(longitude);
      
      let address = '';
      if (isValidLat && isValidLng) {
        address = await this.getAddressFromLatLon(latitude, longitude);
        address = await this.cleanAddress(address);
      }
      
      const latlonText = isValidLat && isValidLng 
        ? `Lat: ${latitude.toFixed(6)}   Lon: ${longitude.toFixed(6)}`
        : 'Lat: Not Available   Lon: Not Available';
      ctx.font = '20px Arial';
      const maxTextWidth = preferredWidth - 80;
      const addressLines = await this.wrapText(ctx, address, maxTextWidth);
      
      // Format timestamp in IST if it's an ISO string or Date object
      let formattedTimestamp = timestamp;
      if (timestamp) {
        try {
          // Try to parse as ISO string or Date
          const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
          if (!Number.isNaN(dateObj.getTime())) {
            // Format in IST timezone
            formattedTimestamp = dateObj.toLocaleString('en-GB', {
              timeZone: 'Asia/Kolkata',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }) + ' IST';
          }
        } catch (e) {
          // If parsing fails, use timestamp as-is
          formattedTimestamp = timestamp;
        }
      }
    
      // Position text
      const lineSpacing = 15;
      const latlonHeight = 20;
      const addressHeights = addressLines.length * (20 + lineSpacing);
      const timestampHeight = 20;
      const totalTextHeight = latlonHeight + addressHeights + timestampHeight + 3 * lineSpacing;
      const padding = 20;
      const bottomPadding = 50;
      const x = padding;
      const y = preferredHeight - totalTextHeight - padding - bottomPadding;
    
      // Draw background and text
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = 'rgb(255,255,204)';
      ctx.fillRect(x - padding, y - padding, maxTextWidth + 2 * padding, totalTextHeight + 2 * padding);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      let currentY = y;
      ctx.fillText(latlonText, x, currentY + 20);
      currentY += latlonHeight + lineSpacing;
      for (const line of addressLines) {
        ctx.fillText(line, x, currentY + 20);
        currentY += 20 + lineSpacing;
      }
      ctx.fillText(formattedTimestamp, x, currentY + 20);
    
      // Convert canvas to buffer (lower quality for smaller PDFs)
      const jpegBuffer = canvas.toBuffer('image/jpeg', {
        quality: 0.7,
        progressive: true,
        chromaSubsampling: true,
      });
    
      // Upload back to S3 (overwrite)
      const putCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3ImageUrl,
        Body: jpegBuffer,
        ContentType: 'image/jpeg',
      });
    
      await this.s3Client.send(putCommand);
    
      // Return the same URL
      return `https://${this.bucketName}.s3.amazonaws.com/${s3ImageUrl}`;
    }
     catch (error) {
      await this.loggingService.error('Failed to process and upload image', {
        s3ImageUrl,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Fetch an S3 image, downscale it, JPEG-encode at given quality,
   * and return as a base64 data URI ready to embed directly in HTML.
   * This avoids Puppeteer making any network requests for images,
   * which dramatically reduces both PDF generation memory and final PDF size.
   */
  async fetchImageAsDataUri(
    s3Key: string,
    maxWidth = 600,
    quality = 0.65
  ): Promise<string | null> {
    if (!S3Service.IMAGE_KEY_REGEX.test(s3Key)) {
      return null;
    }
    try {
      const obj = await this.s3Client.send(
        new GetObjectCommand({ Bucket: this.bucketName, Key: s3Key })
      );

      const chunks: Buffer[] = [];
      for await (const c of obj.Body as any) chunks.push(c);
      const srcBuffer = Buffer.concat(chunks);

      const img = await loadImage(srcBuffer);

      // Downscale only if image is larger than target
      const ratio = Math.min(1, maxWidth / img.width);
      const w = Math.max(1, Math.round(img.width * ratio));
      const h = Math.max(1, Math.round(img.height * ratio));

      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const buf = canvas.toBuffer('image/jpeg', {
        quality,
        progressive: true,
        chromaSubsampling: true,
      });

      return `data:image/jpeg;base64,${buf.toString('base64')}`;
    } catch (error) {
      await this.loggingService.error('Failed to fetch image as data URI', {
        s3Key,
        error: (error as Error).message,
      });
      return null;
    }
  }
}

// Export standalone function for worker threads
export async function processAndUploadImage(s3ImageUrl: string, latitude: number, longitude: number, timestamp: string): Promise<string> {
  const s3Service = new S3Service(new LoggingService());
  return s3Service.processAndUploadImage(s3ImageUrl, latitude, longitude, timestamp);
} 