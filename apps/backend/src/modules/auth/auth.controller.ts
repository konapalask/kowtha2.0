import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('otp/generate')
  async generateOTP(@Body('mobile') mobile: string) {
    return this.authService.generateOTP(mobile);
  }

  @Post('otp/verify')
  async verifyOTP(
    @Body('mobile') mobile: string,
    @Body('otp') otp: string,
  ) {
    return this.authService.verifyOTP(mobile, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.validateUser(req.user.sub);
  }
}
