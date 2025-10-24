import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * GP/PBDIT Format
 * Format: Estimated financial statement with GP ratio, PBDIT margin, cost calculations
 * Includes detailed cost analysis and margin calculations
 */
export class FinancialAnalysisGpPbditDto {
  @ApiProperty({ description: 'Synopsis of the verification', required: false })
  @IsOptional()
  @IsString()
  synopsis?: string;

  @ApiProperty({ description: 'Business name', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ description: 'Proprietor name', required: false })
  @IsOptional()
  @IsString()
  proprietorName?: string;

  // Income Section
  @ApiProperty({ description: 'Gross Receipts', required: false })
  @IsOptional()
  @IsNumber()
  grossReceipts?: number;

  @ApiProperty({ description: 'Other Income', required: false })
  @IsOptional()
  @IsNumber()
  otherIncome?: number;

  @ApiProperty({ description: 'Sub-total (Income)', required: false })
  @IsOptional()
  @IsNumber()
  incomeSubtotal?: number;

  // Cost Section
  @ApiProperty({ description: 'Cost of material consumed', required: false })
  @IsOptional()
  @IsNumber()
  costOfMaterialConsumed?: number;

  @ApiProperty({ description: 'Cost of material consumed to Receipts percentage', required: false })
  @IsOptional()
  @IsNumber()
  costToReceiptsPercentage?: number;

  // Gross Profit
  @ApiProperty({ description: 'Gross Profit as per assumption', required: false })
  @IsOptional()
  @IsNumber()
  grossProfitAsPerAssumption?: number;

  @ApiProperty({ description: 'GP ratio percentage', required: false })
  @IsOptional()
  @IsNumber()
  gpRatio?: number;

  // Expenditure
  @ApiProperty({ description: 'Salary', required: false })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiProperty({ description: 'Rent', required: false })
  @IsOptional()
  @IsNumber()
  rent?: number;

  @ApiProperty({ description: 'Electricity', required: false })
  @IsOptional()
  @IsNumber()
  electricity?: number;

  @ApiProperty({ description: 'Travelling', required: false })
  @IsOptional()
  @IsNumber()
  travelling?: number;

  @ApiProperty({ description: 'Other Expenses', required: false })
  @IsOptional()
  @IsNumber()
  otherExpenses?: number;

  @ApiProperty({ description: 'Sub-total (Expenditure)', required: false })
  @IsOptional()
  @IsNumber()
  expenditureSubtotal?: number;

  // Net Profit before interest, tax & Depreciation
  @ApiProperty({ description: 'Net Profit before interest, tax & Depreciation', required: false })
  @IsOptional()
  @IsNumber()
  netProfitBeforeInterestTaxDepreciation?: number;

  @ApiProperty({ description: 'PBDIT Margin percentage', required: false })
  @IsOptional()
  @IsNumber()
  pbditMargin?: number;

  @ApiProperty({ description: 'Finance Expenses', required: false })
  @IsOptional()
  @IsNumber()
  financeExpenses?: number;

  // Net Profit before tax & Depreciation
  @ApiProperty({ description: 'Net Profit before tax & Depreciation', required: false })
  @IsOptional()
  @IsNumber()
  netProfitBeforeTaxDepreciation?: number;

  @ApiProperty({ description: 'Depreciation', required: false })
  @IsOptional()
  @IsNumber()
  depreciation?: number;

  // Net Profit Before Tax
  @ApiProperty({ description: 'Net Profit Before Tax', required: false })
  @IsOptional()
  @IsNumber()
  netProfitBeforeTax?: number;

  @ApiProperty({ description: 'Income Tax', required: false })
  @IsOptional()
  @IsNumber()
  incomeTax?: number;

  // Net Profit After Tax
  @ApiProperty({ description: 'Net Profit After Tax', required: false })
  @IsOptional()
  @IsNumber()
  netProfitAfterTax?: number;

  @ApiProperty({ description: 'Total expenses including cost of sales', required: false })
  @IsOptional()
  @IsNumber()
  totalExpensesInclCostOfSales?: number;
}

