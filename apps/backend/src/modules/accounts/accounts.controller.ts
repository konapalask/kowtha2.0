import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';  

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('otp/generate')
  async generateOTP(@Body('mobile') mobile: string) {
    return this.accountsService.generateOTP(mobile);
  }

  @Post('otp/verify')
  async verifyOTP(
    @Body('mobile') mobile: string,
    @Body('otp') otp: string,
  ) {
    return this.accountsService.verifyOTP(mobile, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
} 