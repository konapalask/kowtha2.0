import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateFinancialAnalysisDto {
  @ApiProperty({ description: 'Opening Stock amount', required: false })
  @IsOptional()
  @IsNumber()
  openingStock?: number;

  @ApiProperty({ description: 'Purchase amount', required: false })
  @IsOptional()
  @IsNumber()
  purchase?: number;

  @ApiProperty({ description: 'Cost of Services amount', required: false })
  @IsOptional()
  @IsNumber()
  costOfServices?: number;

  @ApiProperty({ description: 'Wages amount', required: false })
  @IsOptional()
  @IsNumber()
  wages?: number;

  @ApiProperty({ description: 'Hamali Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  hamaliCharges?: number;

  @ApiProperty({ description: 'Manufacturing Expenses amount', required: false })
  @IsOptional()
  @IsNumber()
  manufacturingExpenses?: number;

  @ApiProperty({ description: 'Packing Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  packingCharges?: number;

  @ApiProperty({ description: 'Sales amount', required: false })
  @IsOptional()
  @IsNumber()
  sales?: number;

  @ApiProperty({ description: 'Services amount', required: false })
  @IsOptional()
  @IsNumber()
  services?: number;

  @ApiProperty({ description: 'Closing Stock amount', required: false })
  @IsOptional()
  @IsNumber()
  closingStock?: number;

  @ApiProperty({ description: 'Salaries amount', required: false })
  @IsOptional()
  @IsNumber()
  salaries?: number;

  @ApiProperty({ description: 'Rent amount', required: false })
  @IsOptional()
  @IsNumber()
  rent?: number;

  @ApiProperty({ description: 'Electricity Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  electricityCharges?: number;

  @ApiProperty({ description: 'Printing & Stationery amount', required: false })
  @IsOptional()
  @IsNumber()
  printingStationery?: number;

  @ApiProperty({ description: 'Telephone Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  telephoneCharges?: number;

  @ApiProperty({ description: 'Postage & Telegram amount', required: false })
  @IsOptional()
  @IsNumber()
  postageTelegram?: number;

  @ApiProperty({ description: 'Office Maintenance amount', required: false })
  @IsOptional()
  @IsNumber()
  officeMaintenance?: number;

  @ApiProperty({ description: 'Repairs & Maintenance amount', required: false })
  @IsOptional()
  @IsNumber()
  repairsMaintenance?: number;

  @ApiProperty({ description: 'Sadar Expenses amount', required: false })
  @IsOptional()
  @IsNumber()
  sadarExpenses?: number;

  @ApiProperty({ description: 'Audit Fee amount', required: false })
  @IsOptional()
  @IsNumber()
  auditFee?: number;

  @ApiProperty({ description: 'Advertisement amount', required: false })
  @IsOptional()
  @IsNumber()
  advertisement?: number;

  @ApiProperty({ description: 'Bank Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  bankCharges?: number;

  @ApiProperty({ description: 'Insurance amount', required: false })
  @IsOptional()
  @IsNumber()
  insurance?: number;

  @ApiProperty({ description: 'Depreciation amount', required: false })
  @IsOptional()
  @IsNumber()
  depreciation?: number;

  @ApiProperty({ description: 'Interest on Loan amount', required: false })
  @IsOptional()
  @IsNumber()
  interestOnLoan?: number;

  @ApiProperty({ description: 'Rent Received amount', required: false })
  @IsOptional()
  @IsNumber()
  rentReceived?: number;

  @ApiProperty({ description: 'Commission Received amount', required: false })
  @IsOptional()
  @IsNumber()
  commissionReceived?: number;

  @ApiProperty({ description: 'Net Profit amount', required: false })
  @IsOptional()
  @IsNumber()
  netProfit?: number;

  @ApiProperty({ description: 'Gross Profit amount', required: false })
  @IsOptional()
  @IsNumber()
  grossProfit?: number;
}
