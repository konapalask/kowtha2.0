import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

/**
 * Proprietor Format with Monthly Breakdown and GST Tables
 * Format: Estimated P&L with monthly breakdown and GST payment tables
 */
export class FinancialAnalysisProprietorGstDto {
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

  // Expenditure - Estimated only
  @ApiProperty({ description: 'Opening stock', required: false })
  @IsOptional()
  @IsNumber()
  openingStock?: number;

  @ApiProperty({ description: 'Purchases', required: false })
  @IsOptional()
  @IsNumber()
  purchases?: number;

  @ApiProperty({ description: 'Gross Profit', required: false })
  @IsOptional()
  @IsNumber()
  grossProfit?: number;

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

  @ApiProperty({ description: 'Transportation', required: false })
  @IsOptional()
  @IsNumber()
  transportation?: number;

  @ApiProperty({ description: 'Other expenses', required: false })
  @IsOptional()
  @IsNumber()
  otherExpenses?: number;

  @ApiProperty({ description: 'Net Profit', required: false })
  @IsOptional()
  @IsNumber()
  netProfit?: number;

  @ApiProperty({ description: 'Total', required: false })
  @IsOptional()
  @IsNumber()
  total?: number;

  // Income
  @ApiProperty({ description: 'By Sales', required: false })
  @IsOptional()
  @IsNumber()
  sales?: number;

  @ApiProperty({ description: 'By closing Stock', required: false })
  @IsOptional()
  @IsNumber()
  closingStock?: number;

  @ApiProperty({ description: 'By Gross Profit', required: false })
  @IsOptional()
  @IsNumber()
  byGrossProfit?: number;

  // Monthly calculations
  @ApiProperty({ description: 'Monthly turnover', required: false })
  @IsOptional()
  @IsNumber()
  monthlyTurnover?: number;

  @ApiProperty({ description: 'Monthly payments', required: false })
  @IsOptional()
  @IsNumber()
  monthlyPayments?: number;

  @ApiProperty({ description: 'Monthly net profit', required: false })
  @IsOptional()
  @IsNumber()
  monthlyNetProfit?: number;

  // Margin percentages
  @ApiProperty({ description: 'Gross profit percentage', required: false })
  @IsOptional()
  @IsNumber()
  gpPercentage?: number;

  @ApiProperty({ description: 'Net profit percentage', required: false })
  @IsOptional()
  @IsNumber()
  npPercentage?: number;

  // GST Tables (2023-2024 and 2024-2025)
  @ApiProperty({ description: 'GST data for 2023-2024', required: false })
  @IsOptional()
  @IsObject()
  gst2023_2024?: {
    april?: number;
    may?: number;
    june?: number;
    july?: number;
    august?: number;
    september?: number;
    october?: number;
    november?: number;
    december?: number;
    january?: number;
    february?: number;
    march?: number;
    total?: number;
  };

  @ApiProperty({ description: 'GST data for 2024-2025', required: false })
  @IsOptional()
  @IsObject()
  gst2024_2025?: {
    april?: number;
    may?: number;
    june?: number;
    july?: number;
    august?: number;
    september?: number;
    october?: number;
    november?: number;
    december?: number;
    january?: number;
    february?: number;
    march?: number;
    total?: number;
  };
}

