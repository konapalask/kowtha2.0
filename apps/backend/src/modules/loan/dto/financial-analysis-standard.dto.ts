import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Standard Trading and P&L Account Format
 * Used for: Generic banks, default format
 * Format: Traditional two-column P&L with debit/credit sides
 */
export class FinancialAnalysisStandardDto {
  @ApiProperty({ description: 'Synopsis of the verification', required: false })
  @IsOptional()
  @IsString()
  synopsis?: string;

  // Left Side - Expenditure/Debits
  @ApiProperty({ description: 'Opening Stock amount', required: false })
  @IsOptional()
  @IsNumber()
  openingStock?: number;

  @ApiProperty({ description: 'Actual Opening Stock amount', required: false })
  @IsOptional()
  @IsNumber()
  openingStockActual?: number;

  @ApiProperty({ description: 'Purchase amount', required: false })
  @IsOptional()
  @IsNumber()
  purchase?: number;

  @ApiProperty({ description: 'Actual Purchase amount', required: false })
  @IsOptional()
  @IsNumber()
  purchaseActual?: number;

  @ApiProperty({ description: 'Cost of Services amount', required: false })
  @IsOptional()
  @IsNumber()
  costOfServices?: number;

  @ApiProperty({ description: 'Actual Cost of Services amount', required: false })
  @IsOptional()
  @IsNumber()
  costOfServicesActual?: number;

  @ApiProperty({ description: 'Wages amount', required: false })
  @IsOptional()
  @IsNumber()
  wages?: number;

  @ApiProperty({ description: 'Actual Wages amount', required: false })
  @IsOptional()
  @IsNumber()
  wagesActual?: number;

  @ApiProperty({ description: 'Hamali Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  hamaliCharges?: number;

  @ApiProperty({ description: 'Actual Hamali Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  hamaliChargesActual?: number;

  @ApiProperty({ description: 'Manufacturing Expenses amount', required: false })
  @IsOptional()
  @IsNumber()
  manufacturingExpenses?: number;

  @ApiProperty({ description: 'Actual Manufacturing Expenses amount', required: false })
  @IsOptional()
  @IsNumber()
  manufacturingExpensesActual?: number;

  @ApiProperty({ description: 'Packing Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  packingCharges?: number;

  @ApiProperty({ description: 'Actual Packing Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  packingChargesActual?: number;

  @ApiProperty({ description: 'Gross Profit amount', required: false })
  @IsOptional()
  @IsNumber()
  grossProfit?: number;

  @ApiProperty({ description: 'Actual Gross Profit amount', required: false })
  @IsOptional()
  @IsNumber()
  grossProfitActual?: number;

  @ApiProperty({ description: 'Salaries amount', required: false })
  @IsOptional()
  @IsNumber()
  salaries?: number;

  @ApiProperty({ description: 'Actual Salaries amount', required: false })
  @IsOptional()
  @IsNumber()
  salariesActual?: number;

  @ApiProperty({ description: 'Rent amount', required: false })
  @IsOptional()
  @IsNumber()
  rent?: number;

  @ApiProperty({ description: 'Actual Rent amount', required: false })
  @IsOptional()
  @IsNumber()
  rentActual?: number;

  @ApiProperty({ description: 'Electricity Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  electricityCharges?: number;

  @ApiProperty({ description: 'Actual Electricity Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  electricityChargesActual?: number;

  @ApiProperty({ description: 'Printing & Stationery amount', required: false })
  @IsOptional()
  @IsNumber()
  printingStationery?: number;

  @ApiProperty({ description: 'Actual Printing & Stationery amount', required: false })
  @IsOptional()
  @IsNumber()
  printingStationeryActual?: number;

  @ApiProperty({ description: 'Telephone Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  telephoneCharges?: number;

  @ApiProperty({ description: 'Actual Telephone Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  telephoneChargesActual?: number;

  @ApiProperty({ description: 'Postage & Telegram amount', required: false })
  @IsOptional()
  @IsNumber()
  postageTelegram?: number;

  @ApiProperty({ description: 'Actual Postage & Telegram amount', required: false })
  @IsOptional()
  @IsNumber()
  postageTelegramActual?: number;

  @ApiProperty({ description: 'Office Maintenance amount', required: false })
  @IsOptional()
  @IsNumber()
  officeMaintenance?: number;

  @ApiProperty({ description: 'Actual Office Maintenance amount', required: false })
  @IsOptional()
  @IsNumber()
  officeMaintenanceActual?: number;

  @ApiProperty({ description: 'Repairs & Maintenance amount', required: false })
  @IsOptional()
  @IsNumber()
  repairsMaintenance?: number;

  @ApiProperty({ description: 'Actual Repairs & Maintenance amount', required: false })
  @IsOptional()
  @IsNumber()
  repairsMaintenanceActual?: number;

  @ApiProperty({ description: 'Sadar Expenses amount', required: false })
  @IsOptional()
  @IsNumber()
  sadarExpenses?: number;

  @ApiProperty({ description: 'Actual Sadar Expenses amount', required: false })
  @IsOptional()
  @IsNumber()
  sadarExpensesActual?: number;

  @ApiProperty({ description: 'Audit Fee amount', required: false })
  @IsOptional()
  @IsNumber()
  auditFee?: number;

  @ApiProperty({ description: 'Actual Audit Fee amount', required: false })
  @IsOptional()
  @IsNumber()
  auditFeeActual?: number;

  @ApiProperty({ description: 'Advertisement amount', required: false })
  @IsOptional()
  @IsNumber()
  advertisement?: number;

  @ApiProperty({ description: 'Actual Advertisement amount', required: false })
  @IsOptional()
  @IsNumber()
  advertisementActual?: number;

  @ApiProperty({ description: 'Bank Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  bankCharges?: number;

  @ApiProperty({ description: 'Actual Bank Charges amount', required: false })
  @IsOptional()
  @IsNumber()
  bankChargesActual?: number;

  @ApiProperty({ description: 'Insurance amount', required: false })
  @IsOptional()
  @IsNumber()
  insurance?: number;

  @ApiProperty({ description: 'Actual Insurance amount', required: false })
  @IsOptional()
  @IsNumber()
  insuranceActual?: number;

  @ApiProperty({ description: 'Depreciation amount', required: false })
  @IsOptional()
  @IsNumber()
  depreciation?: number;

  @ApiProperty({ description: 'Actual Depreciation amount', required: false })
  @IsOptional()
  @IsNumber()
  depreciationActual?: number;

  @ApiProperty({ description: 'Interest on Loan amount', required: false })
  @IsOptional()
  @IsNumber()
  interestOnLoan?: number;

  @ApiProperty({ description: 'Actual Interest on Loan amount', required: false })
  @IsOptional()
  @IsNumber()
  interestOnLoanActual?: number;

  @ApiProperty({ description: 'Net Profit amount', required: false })
  @IsOptional()
  @IsNumber()
  netProfit?: number;

  @ApiProperty({ description: 'Actual Net Profit amount', required: false })
  @IsOptional()
  @IsNumber()
  netProfitActual?: number;

  // Right Side - Income/Credits
  @ApiProperty({ description: 'Sales amount', required: false })
  @IsOptional()
  @IsNumber()
  sales?: number;

  @ApiProperty({ description: 'Actual Sales amount', required: false })
  @IsOptional()
  @IsNumber()
  salesActual?: number;

  @ApiProperty({ description: 'Services amount', required: false })
  @IsOptional()
  @IsNumber()
  services?: number;

  @ApiProperty({ description: 'Actual Services amount', required: false })
  @IsOptional()
  @IsNumber()
  servicesActual?: number;

  @ApiProperty({ description: 'Closing Stock amount', required: false })
  @IsOptional()
  @IsNumber()
  closingStock?: number;

  @ApiProperty({ description: 'Actual Closing Stock amount', required: false })
  @IsOptional()
  @IsNumber()
  closingStockActual?: number;

  @ApiProperty({ description: 'Rent Received amount', required: false })
  @IsOptional()
  @IsNumber()
  rentReceived?: number;

  @ApiProperty({ description: 'Actual Rent Received amount', required: false })
  @IsOptional()
  @IsNumber()
  rentReceivedActual?: number;

  @ApiProperty({ description: 'Commission Received amount', required: false })
  @IsOptional()
  @IsNumber()
  commissionReceived?: number;

  @ApiProperty({ description: 'Actual Commission Received amount', required: false })
  @IsOptional()
  @IsNumber()
  commissionReceivedActual?: number;
}

