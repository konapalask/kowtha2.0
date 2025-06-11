import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { EditRequestService } from './edit-request.service';
import { CreateEditRequestDto } from './dto/create-edit-request.dto';
import { UpdateEditRequestDto } from './dto/update-edit-request.dto';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { EditRequestStatus, EditRequestType, UserRole } from '@prisma/client';
import { Public } from '../accounts/public.decorator';
import { Roles } from '../accounts/decorators/roles.decorator';

interface RequestWithUser extends ExpressRequest {
  user: {
    sub: number;
    mobile: string;
    role: string;
    officeId: number;
  };
}

@Controller('edit-requests')
@UseGuards(JwtAuthGuard)
export class EditRequestController {
  constructor(private readonly editRequestService: EditRequestService) {}

  @Post()
  @Roles(UserRole.Verifier)
  create(@Request() req: RequestWithUser, @Body() createEditRequestDto: CreateEditRequestDto) { 
    if (!req.user?.sub) {
      throw new Error('User not authenticated. Please ensure you are sending a valid JWT token.');
    }
    return this.editRequestService.createEditRequest(req.user.sub, createEditRequestDto);
  }

  @Get()
  findAll(
    @Query('status') status?: EditRequestStatus,
    @Query('loanId') loanId?: string,
    @Query('type') type?: EditRequestType,
  ) {
    const loanIdNumber = loanId ? parseInt(loanId) : undefined;
    return this.editRequestService.getEditRequests({ status, loanId: loanIdNumber, type });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.editRequestService.getEditRequestById(id);
  }

  @Patch(':id/update')
  @Roles(UserRole.Admin)
  update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEditRequestDto: UpdateEditRequestDto,
  ) {
    return this.editRequestService.updateEditRequest(id, req.user.sub, updateEditRequestDto);
  }

  @Public()
  @Get('image-coordinates')
  async getImageCoordinates(
    @Query('path') path: string,
    @Query('id') id: string,
  ) {
    return this.editRequestService.getImageCoordinates(path, id);
  }
} 