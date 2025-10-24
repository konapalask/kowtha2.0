import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Simple Service Business Format
 * Format: Simplified P&L with estimated income/expenditure and monthly calculations
 * Used for service-based businesses
 */
export class FinancialAnalysisServiceDto {
  @ApiProperty({ description: 'Synopsis of the verification', required: false })
  @IsOptional()
  @IsString()
  synopsis?: string;

  @ApiProperty({ description: 'Business/Proprietor name', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ description: 'Proprietor name', required: false })
  @IsOptional()
  @IsString()
  proprietorName?: string;

  // Expenditure
  @ApiProperty({ description: 'Cost of Service', required: false })
  @IsOptional()
  @IsNumber()
  costOfService?: number;

  @ApiProperty({ description: 'Rent', required: false })
  @IsOptional()
  @IsNumber()
  rent?: number;

  @ApiProperty({ description: 'Salaries', required: false })
  @IsOptional()
  @IsNumber()
  salaries?: number;

  @ApiProperty({ description: 'Electricity', required: false })
  @IsOptional()
  @IsNumber()
  electricity?: number;

  @ApiProperty({ description: 'Transport', required: false })
  @IsOptional()
  @IsNumber()
  transport?: number;

  @ApiProperty({ description: 'Maintenance', required: false })
  @IsOptional()
  @IsNumber()
  maintenance?: number;

  @ApiProperty({ description: 'Other expenses', required: false })
  @IsOptional()
  @IsNumber()
  otherExpenses?: number;

  // Income
  @ApiProperty({ description: 'By service (Income)', required: false })
  @IsOptional()
  @IsNumber()
  byService?: number;

  // Net Profit
  @ApiProperty({ description: 'Net Profit', required: false })
  @IsOptional()
  @IsNumber()
  netProfit?: number;

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
  grossProfitPercentage?: number;

  @ApiProperty({ description: 'Net profit percentage', required: false })
  @IsOptional()
  @IsNumber()
  netProfitPercentage?: number;
}

