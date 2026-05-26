import { Module } from "@nestjs/common";
import { EditRequestService } from "./edit-request.service";
import { EditRequestController } from "./edit-request.controller";
import { PrismaService } from "../../prisma.service";
import { LoggingService } from "../common/logging/logging.service";
import { S3Module } from "../common/s3utils/s3.module";
import { LoanModule } from "../loan/loan.module";

@Module({
  imports: [LoanModule, S3Module],
  controllers: [EditRequestController],
  providers: [EditRequestService, PrismaService, LoggingService],
  exports: [EditRequestService],
})
export class EditRequestModule {}
