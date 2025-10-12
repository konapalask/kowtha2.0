import { IsString, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateQALoanDto {
  @ApiProperty({ description: "Bank name for QA testing" })
  @IsString()
  bankName: string;

  @ApiProperty({
    description: "Field executive phone number",
    example: "9912994742",
  })
  @IsString()
  fieldExecutivePhone: string;

  @ApiProperty({ description: "Applicant name for QA test", required: false })
  @IsString()
  @IsOptional()
  applicantName?: string;

  @ApiProperty({ description: "Applicant mobile", required: false })
  @IsString()
  @IsOptional()
  applicantMobile?: string;

  @ApiProperty({ description: "Applicant address", required: false })
  @IsString()
  @IsOptional()
  applicantAddress?: string;

  @ApiProperty({ description: "Loan amount", required: false })
  @IsNumber()
  @IsOptional()
  loanAmount?: number;
}
