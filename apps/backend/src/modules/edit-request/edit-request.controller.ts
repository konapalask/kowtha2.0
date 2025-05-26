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
import { EditRequestStatus } from '@prisma/client';

interface RequestWithUser extends ExpressRequest {
  user: {
    id: number;
  };
}

@Controller('edit-requests')
@UseGuards(JwtAuthGuard)
export class EditRequestController {
  constructor(private readonly editRequestService: EditRequestService) {}

  @Post()
  create(@Request() req: RequestWithUser, @Body() createEditRequestDto: CreateEditRequestDto) {
    return this.editRequestService.createEditRequest(req.user.id, createEditRequestDto);
  }

  @Get()
  findAll(
    @Query('status') status?: EditRequestStatus,
    @Query('loanId') loanId?: number,
  ) {
    return this.editRequestService.getEditRequests({ status, loanId });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.editRequestService.getEditRequestById(id);
  }

  @Patch(':id/update')
  update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEditRequestDto: UpdateEditRequestDto,
  ) {
    return this.editRequestService.updateEditRequest(id, req.user.id, updateEditRequestDto);
  }
} 