import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class OrgService {
  constructor(private prisma: PrismaService) {}

  async getOffices() {
    // Only return non-archived offices by default
    return this.prisma.office.findMany({ where: { archived: false } });
  }

  async createOffice(data: { name: string; location: string; address: string }) {
    return this.prisma.office.create({ data });
  }

  async updateOffice(id: number, data: { name?: string; location?: string; address?: string }) {
    return this.prisma.office.update({ where: { id }, data });
  }

  async archiveOffice(id: number) {
    return this.prisma.office.update({ where: { id }, data: { archived: true } });
  }

  // Optionally, get all offices including archived
  async getAllOffices() {
    return this.prisma.office.findMany();
  }

  // Fetch organization details based on the logged-in user
  async getOrganizationByUser(userId: number) {
    // Get the user's office
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { office: true },
    });
    if (!user || !user.office) return null;
    // Get the organization for the office
    const org = await this.prisma.organization.findUnique({
      where: { id: user.office.organizationId },
    });
    return org;
  }

  // Update organization name and description
  async updateOrganization(orgId: number, data: { name?: string; description?: string }) {
    return this.prisma.organization.update({
      where: { id: orgId },
      data,
    });
  }
}
