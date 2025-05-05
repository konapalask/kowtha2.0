import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    mobile: string;
    role: string;
  };
} 