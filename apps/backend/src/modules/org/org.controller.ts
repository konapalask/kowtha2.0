import { Controller, Get, Post, Put, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrgService } from './org.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) { }

  @Get('offices')
  async getOffices() {
    return this.orgService.getOffices();
  }

  @Post('offices')
  async createOffice(@Body() body: { name: string; location: string; address: string }) {
    return this.orgService.createOffice(body);
  }

  @Put('offices/:id')
  async updateOffice(
    @Param('id') id: string,
    @Body() body: { name?: string; location?: string; address?: string }
  ) {
    return this.orgService.updateOffice(Number(id), body);
  }

  @Patch('offices/:id/archive')
  async archiveOffice(@Param('id') id: string) {
    return this.orgService.archiveOffice(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('organization')
  async getOrganization(@Request() req) {
    return this.orgService.getOrganizationByUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('organization/:id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string }
  ) {
    return this.orgService.updateOrganization(Number(id), body);
  }
}
