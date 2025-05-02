import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { logger } from '../common/logging';

@Injectable()
export class OrgService {
  constructor(private prisma: PrismaService) {}

  async getOffices() {
    try {
      const offices = await this.prisma.office.findMany({ where: { archived: false } });
      await logger.debug('Retrieved active offices', { count: offices.length });
      return offices;
    } catch (error) {
      await logger.error('Failed to get offices', { 
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  async createOffice(data: { name: string; location: string; address: string }) {
    try {
      const office = await this.prisma.office.create({ data });
      await logger.info('Office created successfully', { 
        officeId: office.id,
        name: office.name 
      });
      return office;
    } catch (error) {
      await logger.error('Failed to create office', { 
        data,
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  async updateOffice(id: number, data: { name?: string; location?: string; address?: string }) {
    try {
      const office = await this.prisma.office.update({ where: { id }, data });
      await logger.info('Office updated successfully', { 
        officeId: id,
        updatedFields: Object.keys(data) 
      });
      return office;
    } catch (error) {
      await logger.error('Failed to update office', { 
        officeId: id,
        data,
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  async archiveOffice(id: number) {
    try {
      const office = await this.prisma.office.update({ 
        where: { id }, 
        data: { archived: true } 
      });
      await logger.info('Office archived successfully', { officeId: id });
      return office;
    } catch (error) {
      await logger.error('Failed to archive office', { 
        officeId: id,
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  // Optionally, get all offices including archived
  async getAllOffices() {
    try {
      const offices = await this.prisma.office.findMany();
      await logger.debug('Retrieved all offices', { count: offices.length });
      return offices;
    } catch (error) {
      await logger.error('Failed to get all offices', { 
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  // Fetch organization details based on the logged-in user
  async getOrganizationByUser(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { office: true },
      });

      if (!user || !user.office) {
        await logger.warn('Organization not found for user', { userId });
        return null;
      }

      const org = await this.prisma.organization.findUnique({
        where: { id: user.office.organizationId },
      });

      await logger.debug('Retrieved organization for user', { 
        userId,
        organizationId: org?.id 
      });
      return org;
    } catch (error) {
      await logger.error('Failed to get organization by user', { 
        userId,
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  // Update organization name and description
  async updateOrganization(orgId: number, data: { name?: string; description?: string }) {
    try {
      const org = await this.prisma.organization.update({
        where: { id: orgId },
        data,
      });
      await logger.info('Organization updated successfully', { 
        organizationId: orgId,
        updatedFields: Object.keys(data) 
      });
      return org;
    } catch (error) {
      await logger.error('Failed to update organization', { 
        organizationId: orgId,
        data,
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }
}
