import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Comprehensive Actuals vs Estimated Format
 * Format: Side-by-side comparison of multiple years with changes and monthly breakdown
 * Most detailed format with historical data comparison
 */
export class FinancialAnalysisComprehensiveDto {
  @ApiProperty({ description: 'Synopsis of the verification', required: false })
  @IsOptional()
  @IsString()
  synopsis?: string;

  @ApiProperty({ description: 'Business name', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  // Actuals columns (multiple years)
  @ApiProperty({ description: 'Opening stock - Actuals as on 31/03/23', required: false })
  @IsOptional()
  @IsNumber()
  openingStock_2023?: number;

  @ApiProperty({ description: 'Opening stock - Actuals as on 31/03/24', required: false })
  @IsOptional()
  @IsNumber()
  openingStock_2024?: number;

  @ApiProperty({ description: 'Opening stock - Change percentage', required: false })
  @IsOptional()
  @IsNumber()
  openingStockChange?: number;

  @ApiProperty({ description: 'Opening stock - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  openingStockEstimated?: number;

  @ApiProperty({ description: 'Purchases - Actuals as on 31/03/23', required: false })
  @IsOptional()
  @IsNumber()
  purchases_2023?: number;

  @ApiProperty({ description: 'Purchases - Actuals as on 31/03/24', required: false })
  @IsOptional()
  @IsNumber()
  purchases_2024?: number;

  @ApiProperty({ description: 'Purchases - Change percentage', required: false })
  @IsOptional()
  @IsNumber()
  purchasesChange?: number;

  @ApiProperty({ description: 'Purchases - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  purchasesEstimated?: number;

  @ApiProperty({ description: 'Gas & Liquid Items - Actuals as on 31/03/23', required: false })
  @IsOptional()
  @IsNumber()
  gasLiquidItems_2023?: number;

  @ApiProperty({ description: 'Gas & Liquid Items - Actuals as on 31/03/24', required: false })
  @IsOptional()
  @IsNumber()
  gasLiquidItems_2024?: number;

  @ApiProperty({ description: 'Gas & Liquid Items - Change percentage', required: false })
  @IsOptional()
  @IsNumber()
  gasLiquidItemsChange?: number;

  @ApiProperty({ description: 'Gas & Liquid Items - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  gasLiquidItemsEstimated?: number;

  @ApiProperty({ description: 'Gross profit - Actuals as on 31/03/23', required: false })
  @IsOptional()
  @IsNumber()
  grossProfit_2023?: number;

  @ApiProperty({ description: 'Gross profit - Actuals as on 31/03/24', required: false })
  @IsOptional()
  @IsNumber()
  grossProfit_2024?: number;

  @ApiProperty({ description: 'Gross profit - Change percentage', required: false })
  @IsOptional()
  @IsNumber()
  grossProfitChange?: number;

  @ApiProperty({ description: 'Gross profit - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  grossProfitEstimated?: number;

  // Income side
  @ApiProperty({ description: 'Sales - Actuals as on 31/03/23', required: false })
  @IsOptional()
  @IsNumber()
  sales_2023?: number;

  @ApiProperty({ description: 'Sales - Actuals as on 31/03/24', required: false })
  @IsOptional()
  @IsNumber()
  sales_2024?: number;

  @ApiProperty({ description: 'Sales - Change percentage', required: false })
  @IsOptional()
  @IsNumber()
  salesChange?: number;

  @ApiProperty({ description: 'Sales - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  salesEstimated?: number;

  @ApiProperty({ description: 'Majuri Charges - Actuals as on 31/03/23', required: false })
  @IsOptional()
  @IsNumber()
  majuriCharges_2023?: number;

  @ApiProperty({ description: 'Majuri Charges - Actuals as on 31/03/24', required: false })
  @IsOptional()
  @IsNumber()
  majuriCharges_2024?: number;

  @ApiProperty({ description: 'Majuri Charges - Change percentage', required: false })
  @IsOptional()
  @IsNumber()
  majuriChargesChange?: number;

  @ApiProperty({ description: 'Majuri Charges - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  majuriChargesEstimated?: number;

  @ApiProperty({ description: 'Closing stock - Actuals as on 31/03/23', required: false })
  @IsOptional()
  @IsNumber()
  closingStock_2023?: number;

  @ApiProperty({ description: 'Closing stock - Actuals as on 31/03/24', required: false })
  @IsOptional()
  @IsNumber()
  closingStock_2024?: number;

  @ApiProperty({ description: 'Closing stock - Change percentage', required: false })
  @IsOptional()
  @IsNumber()
  closingStockChange?: number;

  @ApiProperty({ description: 'Closing stock - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  closingStockEstimated?: number;

  // Indirect Expenses
  @ApiProperty({ description: 'Salaries - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  salariesEstimated?: number;

  @ApiProperty({ description: 'Bonus - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  bonusEstimated?: number;

  @ApiProperty({ description: 'Electricity Charges - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  electricityChargesEstimated?: number;

  @ApiProperty({ description: 'Sadar - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  sadarEstimated?: number;

  @ApiProperty({ description: 'Coal, Gas & Liquid - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  coalGasLiquidEstimated?: number;

  @ApiProperty({ description: 'Spares & Machinery - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  sparesMachineryEstimated?: number;

  @ApiProperty({ description: 'Bank Interest - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  bankInterestEstimated?: number;

  @ApiProperty({ description: 'Bank Charges - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  bankChargesEstimated?: number;

  @ApiProperty({ description: 'Finance Charges/Professional Tax - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  financeChargesEstimated?: number;

  @ApiProperty({ description: 'Shop Rents - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  shopRentsEstimated?: number;

  @ApiProperty({ description: 'GST Late Fee - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  gstLateFeeEstimated?: number;

  @ApiProperty({ description: 'Auditor Fee - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  auditorFeeEstimated?: number;

  @ApiProperty({ description: 'Telephone Charges - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  telephoneChargesEstimated?: number;

  @ApiProperty({ description: 'Travelling Exp/Transport - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  travellingExpEstimated?: number;

  @ApiProperty({ description: 'Vehicle Maintenance & machinery - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  vehicleMaintenanceEstimated?: number;

  @ApiProperty({ description: 'Depreciation - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  depreciationEstimated?: number;

  @ApiProperty({ description: 'Interest - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  interestEstimated?: number;

  @ApiProperty({ description: 'Net Profit - Estimated', required: false })
  @IsOptional()
  @IsNumber()
  netProfitEstimated?: number;

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
}

