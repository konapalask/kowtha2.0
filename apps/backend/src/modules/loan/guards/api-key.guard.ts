import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] || request.headers['authorization'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // Validate against environment variable
    const validApiKey = process.env.LAMBDA_API_KEY;
    if (!validApiKey) {
      throw new UnauthorizedException('API key configuration is missing');
    }

    // Remove 'Bearer ' prefix if present
    const cleanApiKey = typeof apiKey === 'string' && apiKey.startsWith('Bearer ') 
      ? apiKey.substring(7) 
      : apiKey;

    if (cleanApiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
