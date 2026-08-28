import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import * as fs from 'fs';

@Injectable()
export class CloudFrontService {
  private readonly domain: string;
  private readonly keyPairId: string;
  private readonly privateKey: string;

  constructor() {
    this.domain = process.env.CLOUDFRONT_DOMAIN || '';
    this.keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID || '';
    const keyPath = process.env.CLOUDFRONT_PRIVATE_KEY_PATH || '';

    const missing: string[] = [];
    if (!this.domain) missing.push('CLOUDFRONT_DOMAIN');
    if (!this.keyPairId) missing.push('CLOUDFRONT_KEY_PAIR_ID');
    if (!keyPath) missing.push('CLOUDFRONT_PRIVATE_KEY_PATH');
    if (missing.length > 0) {
      console.warn(
        `[CloudFrontService] Missing CloudFront env var(s): ${missing.join(', ')}. CloudFront signed URLs will be disabled.`,
      );
      this.privateKey = '';
      return;
    }

    try {
      const pem = fs.readFileSync(keyPath, 'utf8').trim();
      if (!pem.includes('BEGIN') || !pem.includes('PRIVATE KEY')) {
        console.warn(`[CloudFrontService] CloudFront private key at ${keyPath} is not a valid PEM`);
        this.privateKey = '';
        return;
      }
      this.privateKey = pem;
    } catch (e: any) {
      console.warn(`[CloudFrontService] Failed to read private key at ${keyPath}: ${e.message}`);
      this.privateKey = '';
    }
  }

  getSignedImageUrl(key: string, expiresInSeconds = 3600): string {
    const cleanKey = key.replace(/^\/+/, '');
    if (!this.domain || !this.keyPairId || !this.privateKey) {
      return `https://${this.domain || 'localhost'}/${cleanKey}`;
    }
    const url = `https://${this.domain}/${cleanKey}`;
    const dateLessThan = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    return getSignedUrl({
      url,
      keyPairId: this.keyPairId,
      privateKey: this.privateKey,
      dateLessThan,
    });
  }
}
