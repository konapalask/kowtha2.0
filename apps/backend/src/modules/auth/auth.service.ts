import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async generateOTP(mobile: string): Promise<{ message: string }> {
    const otp = '123456'; // Hardcoded OTP for now
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { mobile } });

    // Create a new session for this OTP
    await this.prisma.session.create({
      data: {
        userId: user.id,
        otp,
        otpExpires,
        isActive: true,
      },
    });

    // In production, send OTP via SMS service

    return { message: 'OTP sent successfully' };
  }

  async verifyOTP(mobile: string, otp: string): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({ where: { mobile } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Find the latest active session for this user
    const session = await this.prisma.session.findFirst({
      where: {
        userId: user.id,
        isActive: true,
        otp,
        otpExpires: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark session as inactive and clear OTP
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        isActive: false,
        otp: null,
        otpExpires: null,
        lastLoginAt: new Date(),
      },
    });

    const payload = { sub: user.id, mobile: user.mobile, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}