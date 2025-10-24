import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

/**
 * Detailed Format with Balance Sheet
 * Format: Comprehensive P&L with balance sheet on the side
 * Shows both audited income and estimated values
 */
export class FinancialAnalysisDetailedDto {
  @ApiProperty({ description: 'Synopsis of the verification', required: false })
  @IsOptional()
  @IsString()
  synopsis?: string;

  @ApiProperty({ description: 'Business name', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ description: 'Partners names', required: false })
  @IsOptional()
  @IsString()
  partnersNames?: string;

  // Expenditure - with Note, Audited Income, Assessed, and Estimated columns
  @ApiProperty({ description: 'Opening stock - Assessed', required: false })
  @IsOptional()
  @IsNumber()
  openingStockAssessed?: number;

  @ApiProperty({ description: 'Opening stock - Audited Income', required: false })
  @IsOptional()
  @IsNumber()
  openingStockAudited?: number;

  @ApiProperty({ description: 'Purchases - Assessed', required: false })
  @IsOptional()
  @IsNumber()
  purchasesAssessed?: number;

  @ApiProperty({ description: 'Purchases - Audited Income', required: false })
  @IsOptional()
  @IsNumber()
  purchasesAudited?: number;

  @ApiProperty({ description: 'Gross Profit - Assessed', required: false })
  @IsOptional()
  @IsNumber()
  grossProfitAssessed?: number;

  @ApiProperty({ description: 'Gross Profit - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  grossProfitEstimated?: number;

  @ApiProperty({ description: 'Grand Total', required: false })
  @IsOptional()
  @IsNumber()
  grandTotal?: number;

  // Indirect Expenses
  @ApiProperty({ description: 'Electricity', required: false })
  @IsOptional()
  @IsNumber()
  electricity?: number;

  @ApiProperty({ description: 'Rent', required: false })
  @IsOptional()
  @IsNumber()
  rent?: number;

  @ApiProperty({ description: 'Salaries', required: false })
  @IsOptional()
  @IsNumber()
  salaries?: number;

  @ApiProperty({ description: 'Travelling Charges', required: false })
  @IsOptional()
  @IsNumber()
  travellingCharges?: number;

  @ApiProperty({ description: 'Other Expenses', required: false })
  @IsOptional()
  @IsNumber()
  otherExpenses?: number;

  @ApiProperty({ description: 'Net Profit', required: false })
  @IsOptional()
  @IsNumber()
  netProfit?: number;

  // Income
  @ApiProperty({ description: 'By Sales - Audited Income', required: false })
  @IsOptional()
  @IsNumber()
  salesAudited?: number;

  @ApiProperty({ description: 'By Sales - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  salesEstimated?: number;

  @ApiProperty({ description: 'By Services - Audited Income', required: false })
  @IsOptional()
  @IsNumber()
  servicesAudited?: number;

  @ApiProperty({ description: 'By Services - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  servicesEstimated?: number;

  @ApiProperty({ description: 'By closing Stock - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  closingStockEstimated?: number;

  @ApiProperty({ description: 'By closing Stock - Audited Income', required: false })
  @IsOptional()
  @IsNumber()
  closingStockAudited?: number;

  @ApiProperty({ description: 'By Gross Profit - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  byGrossProfitEstimated?: number;

  @ApiProperty({ description: 'By Gross Profit - Audited Income', required: false })
  @IsOptional()
  @IsNumber()
  byGrossProfitAudited?: number;

  // Balance Sheet Section
  @ApiProperty({ description: 'Balance sheet data', required: false })
  @IsOptional()
  @IsObject()
  balanceSheet?: {
    // Liabilities
    capitalAccount?: number;
    sundryCreditors?: number;
    provisions?: number;
    auditPayable?: number;
    accountantFees?: number;
    newLoan?: number;

    // Assets
    loansAndAdvances?: {
      gcrumChaudhary?: number;
      mahadevTrading?: number;
    };
    currentAssets?: {
      prepaidInsurance?: number;
      closingStock?: number;
      sundryDebtors?: number;
    };
    gstRefund?: number;
    gstSetOff?: number;
    dcbBank?: number;
    cashInHand?: number;
    additionalProperty?: number;
  };

  // Payment calculations
  @ApiProperty({ description: 'Total payments', required: false })
  @IsOptional()
  @IsNumber()
  totalPayments?: number;

  @ApiProperty({ description: 'Net profit', required: false })
  @IsOptional()
  @IsNumber()
  netProfitMargin?: number;

  @ApiProperty({ description: 'GP Margin', required: false })
  @IsOptional()
  @IsNumber()
  gpMargin?: number;

  @ApiProperty({ description: 'NP Margin', required: false })
  @IsOptional()
  @IsNumber()
  npMargin?: number;
}

