import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EditRequestStatus, Prisma } from '@prisma/client';
import { CreateEditRequestDto } from './dto/create-edit-request.dto';
import { UpdateEditRequestDto } from './dto/update-edit-request.dto';
import { LoggingService } from '../common/logging/logging.service';

@Injectable()
export class EditRequestService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
  ) {}

  async createEditRequest(userId: number, createEditRequestDto: CreateEditRequestDto) {
    try {
      // Check if loan exists
      const loan = await this.prisma.loan.findUnique({
        where: { id: createEditRequestDto.loanId },
      });

      if (!loan) {
        throw new NotFoundException('Loan not found');
      }

      // Create edit request
      const editRequest = await this.prisma.editRequest.create({
        data: {
          loanId: createEditRequestDto.loanId,
          requestedBy: userId,
          status: EditRequestStatus.Pending,
          changes: createEditRequestDto.changes,
          remarks: createEditRequestDto.remarks,
        },
        include: {
          loan: true,
          requester: true,
        },
      });

      await this.loggingService.info('Edit request created successfully', {
        editRequestId: editRequest.id,
        loanId: editRequest.loanId,
        requestedBy: userId,
      });

      return editRequest;
    } catch (error) {
      await this.loggingService.error('Failed to create edit request', {
        userId,
        loanId: createEditRequestDto.loanId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateEditRequest(
    editRequestId: number,
    userId: number,
    updateEditRequestDto: UpdateEditRequestDto,
  ) {
    try {
      const editRequest = await this.prisma.editRequest.findUnique({
        where: { id: editRequestId },
        include: { loan: true },
      });

      if (!editRequest) {
        throw new NotFoundException('Edit request not found');
      }

      if (editRequest.status !== EditRequestStatus.Pending) {
        throw new BadRequestException('Edit request is not in pending status');
      }

      // Update edit request
      const updatedEditRequest = await this.prisma.editRequest.update({
        where: { id: editRequestId },
        data: {
          status: updateEditRequestDto.status,
          approvedBy: userId,
          remarks: updateEditRequestDto.remarks,
        },
        include: {
          loan: true,
          requester: true,
          approver: true,
        },
      });

      // If approved, apply the changes to the loan and verifications
      if (updateEditRequestDto.status === EditRequestStatus.Approved) {
        // Update loan data
        await this.prisma.loan.update({
          where: { id: editRequest.loanId },
          data: editRequest.changes as Prisma.LoanUpdateInput,
        });

        // Update verification data for all verifications of this loan
        const verifications = await this.prisma.verification.findMany({
          where: { loanId: editRequest.loanId },
        });

        // Update each verification's data
        await Promise.all(
          verifications.map(verification =>
            this.prisma.verification.update({
              where: { id: verification.id },
              data: {
                verificationData: {
                  ...(verification.verificationData as object),
                  ...(editRequest.changes as object),
                },
              },
            })
          )
        );
      }

      await this.loggingService.info('Edit request updated successfully', {
        editRequestId,
        loanId: editRequest.loanId,
        status: updateEditRequestDto.status,
        approvedBy: userId,
      });

      return updatedEditRequest;
    } catch (error) {
      await this.loggingService.error('Failed to update edit request', {
        editRequestId,
        userId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getEditRequests(filters?: { status?: EditRequestStatus; loanId?: number }) {
    try {
      const where: Prisma.EditRequestWhereInput = {};
      
      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.loanId) {
        where.loanId = filters.loanId;
      }

      const editRequests = await this.prisma.editRequest.findMany({
        where,
        include: {
          loan: true,
          requester: true,
          approver: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      await this.loggingService.debug('Retrieved edit requests', {
        filters,
        count: editRequests.length,
      });

      return editRequests;
    } catch (error) {
      await this.loggingService.error('Failed to get edit requests', {
        filters,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getEditRequestById(editRequestId: number) {
    try {
      const editRequest = await this.prisma.editRequest.findUnique({
        where: { id: editRequestId },
        include: {
          loan: true,
          requester: true,
          approver: true,
        },
      });

      if (!editRequest) {
        throw new NotFoundException('Edit request not found');
      }

      return editRequest;
    } catch (error) {
      await this.loggingService.error('Failed to get edit request by ID', {
        editRequestId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
} 