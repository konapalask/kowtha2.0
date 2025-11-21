import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../prisma.service';
import { Department, VerificationType } from '@prisma/client';
import { LoggingService } from '../common/logging/logging.service';

/**
 * Service for generating bank-specific financial analysis Excel exports
 * Each bank has its own template format
 */
@Injectable()
export class FinancialAnalysisTemplatesService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService
  ) { }
  private readonly bankTemplateMappings = {
    'generic': [ "ADITYA BIRLA-HL", "ADITYA BIRLA-ML", "ADITYA BIRLA-STSL", "AMBIT-HL", "AMBIT-MSME", "AXIS FINANCE-UBL", "AXIS FINANCE-UBL", "AXIS BANK", "AXIS AGRI", "AXIS BUSINESS AGRI", "ARKA FINCAP", "CENTRUM", "CENT BANK", "CHOLA-HL", "CHOLA-SME", "CLIX CAPITAL-HL", "CLIX CAPITAL-UBL", "EASY HL", "FED BANK (PD&LIP)", "GODREJ-HL", "GODREJ-UBL", "HERO HOUSING", "HERO HOUSING", "ICICI", "IDFC FIRST-HL", "IDFC FIRST-ML", "IDFC FIRST-PL", "IIFL", "INDUSIND", "INDIA SHELTER", "INDIA SHELTER", "JANA SMALL FINANCE BANK LIMITED", "JANA SMALL FINANCE BANK LIMITED", "JANA SMALL FINANCE BANK LIMITED", "KOTAK", "MUTHOOT-HL", "MUTHOOT FINCORP (PD & LIP)", "NIDO HOME FINANCE", "NIWAS", "NIWAS", "NORTHERN ARC", "NIPUN", "PIRAMAL (PD, AIP, LIP)", "PNB", "SMFG-SME", "TATA CAPITAL-UBL", "TRUHOME (PD & LIP)", "VERITAS", "YES BANK-HL",],
    'statement-2': ["AXIS FINANCE-HL", "INCRED/KKR India Financial Services Limited", "SAMMAAN", "SMFG-ML (MICRO & MASS)", "SMFG-HL", "TATA CAPITAL-FSL", "TATA CAPITAL-HFL",],
    'statement-3': ["DCB BANK"],
    'statement-4': ["HERO FINCORP", "RBL BANK (PD & LIP)"],
  };
  
   // Main export function that routes to the appropriate template based on bank
   
  async exportFinancialAnalysisToExcel(loanId: number, bankName: string): Promise<Buffer> {
    const ExcelJS = await import('exceljs');
    console.log("bankName", bankName);
    try {
      // Fetch verification with financial analysis and loan details
      const verification = await this.prisma.verification.findFirst({
        where: {
          loanId,
          department: Department.PD,
          type: VerificationType.Business,
        },
        include: {
          loan: {
            include: {
              office: true,
            },
          },
        },
      });

      if (!verification) {
        throw new NotFoundException('Verification not found');
      }
      
      // Financial analysis is stored in verification.financialAnalysis, not in verificationData
      const financialAnalysis = (verification.verificationData as any)?.financialAnalysis || {};
      const loan = verification.loan;
      
      // Log for debugging if financial analysis is empty
      if (!financialAnalysis || Object.keys(financialAnalysis).length === 0) {
        await this.loggingService.warn('Financial analysis is empty for loan', {
          loanId,
          bankName,
          verificationId: verification.id,
        });
      }
      
      if (this.isServiceBusinessFormat(bankName)) {
        console.log("service business format");
        return await this.generateStandardFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isDetailedBalanceSheetFormat(bankName)) {
        console.log("detailed balance sheet format");
        return await this.generateDetailedBalanceSheetFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isProprietorGstFormat(bankName)) {
        console.log("proprietor gst format");
        return await this.generateProprietorGstFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isGpPbditFormat(bankName)) {
        console.log("gp pbdit format");
        return await this.generateGpPbditFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isComprehensiveFormat(bankName)) {
        console.log("comprehensive format");
        return await this.generateStandardFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else {
        // Default fallback to standard format if bank doesn't match any specific format
        await this.loggingService.warn('Bank format not recognized, using standard format', {
          loanId,
          bankName,
        });
        console.log("standard format");
        return await this.generateStandardFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      }
    } catch (error) {
      await this.loggingService.error(
        'Failed to export financial analysis to Excel',
        {
          loanId,
          bankName,
          error: error.message,
          stack: error.stack,
        }
      );
      throw error;
    }
  }

  /**
   * Determine which banks use which format
   */
  private isServiceBusinessFormat(bankName: string): boolean {
    const serviceBanks = this.bankTemplateMappings['generic'];
    return serviceBanks.some((bank) => bankName.includes(bank));
  }

  private isDetailedBalanceSheetFormat(bankName: string): boolean {
    const detailedBanks = this.bankTemplateMappings['statement-2'];
    return detailedBanks.some((bank) => bankName.includes(bank));
  }

  private isProprietorGstFormat(bankName: string): boolean {
    const gstBanks = this.bankTemplateMappings['statement-3'];
    return gstBanks.some((bank) => bankName.includes(bank));
  }

  private isGpPbditFormat(bankName: string): boolean {
    const pbditBanks = this.bankTemplateMappings['statement-4'];
    return pbditBanks.some((bank) => bankName.includes(bank));
  }

  private isComprehensiveFormat(bankName: string): boolean {
    const comprehensiveBanks = this.bankTemplateMappings['statement-5'];
    return comprehensiveBanks.some((bank) => bankName.includes(bank));
  }


  private async generateStandardFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Analysis');

    worksheet.columns = [
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 25 },
      { width: 15 },
      { width: 15 },
    ];

    const titleRow = worksheet.addRow([
      'Trading and Profit & Loss Account for the year ending 31.03.2026',
    ]);
    worksheet.mergeCells('A1:F1');
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 30;
    titleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };
    console.log('financialAnalysis', financialAnalysis);
    // Add header row
    const headerRow = worksheet.addRow([
      'Particulars',
      'Actuals',
      'Estimations',
      'Particulars',
      'Actuals',
      'Estimations',
    ]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    const leftItems = [
      { label: 'To Opening Stock', key: 'openingStockEstimations', actualKey: 'openingStockActuals' },
      { label: 'To Purchase', key: 'purchaseEstimations', actualKey: 'purchaseActuals' },
      { label: 'To Cost of Services', key: 'costOfServicesEstimations', actualKey: 'costOfServicesActuals' },
      { label: 'To Wages', key: 'wagesEstimations', actualKey: 'wagesActuals' },
      { label: 'To Hamali Charges', key: 'hamaliChargesEstimations', actualKey: 'hamaliChargesActuals' },
      { label: 'To Manufacturing Expenses', key: 'manufacturingExpensesEstimations', actualKey: 'manufacturingExpensesActuals' },
      { label: 'To Packing Charges', key: 'packingChargesEstimations', actualKey: 'packingChargesActuals' },
      { label: '', key: '' },
      { label: 'To Gross Profit', key: 'grossProfitDebitEstimations', actualKey: 'grossProfitDebitActuals', isBold: true },
      { label: '', key: '' },
      { label: 'To Salaries', key: 'salariesEstimations', actualKey: 'salariesActuals' },
      { label: 'To Rent', key: 'rentEstimations', actualKey: 'rentActuals' },
      { label: 'To Electricity Charges', key: 'electricityChargesEstimations', actualKey: 'electricityChargesActuals' },
      { label: 'To Printing & Stationery', key: 'printingStationeryEstimations', actualKey: 'printingStationeryActuals' },
      { label: 'To Telephone Charges', key: 'telephoneChargesEstimations', actualKey: 'telephoneChargesActuals' },
      { label: 'To Postage & Telegram', key: 'postageTelegramEstimations', actualKey: 'postageTelegramActuals' },
      { label: 'To Office Maintenance', key: 'officeMaintenanceEstimations', actualKey: 'officeMaintenanceActuals' },
      { label: 'To Repairs & Maintenance', key: 'repairsMaintenanceEstimations', actualKey: 'repairsMaintenanceActuals' },
      { label: 'To Sadar Expenses', key: 'sadarExpensesEstimations', actualKey: 'sadarExpensesActuals' },
      { label: 'To Audit Fee', key: 'auditFeeEstimations', actualKey: 'auditFeeActuals' },
      { label: 'To Advertisement', key: 'advertisementEstimations', actualKey: 'advertisementActuals' },
      { label: 'To Bank Charges', key: 'bankChargesEstimations', actualKey: 'bankChargesActuals' },
      { label: 'To Insurance', key: 'insuranceEstimations', actualKey: 'insuranceActuals' },
      { label: 'To Depreciation', key: 'depreciationEstimations', actualKey: 'depreciationActuals' },
      { label: 'To Interest on Loan', key: 'interestOnLoanEstimations', actualKey: 'interestOnLoanActuals' },
      { label: '', key: '' },
      { label: 'To Net Profit', key: 'netProfitEstimations', actualKey: 'netProfitActuals', isBold: true },
      { label: '', key: '' },
    ];

    const rightItems = [
      { label: 'By Sales', key: 'salesEstimations', actualKey: 'salesActuals' },
      { label: 'By Services', key: 'servicesEstimations', actualKey: 'servicesActuals' },
      { label: 'By Closing Stock', key: 'closingStockEstimations', actualKey: 'closingStockActuals' },
      ...Array(5).fill({ label: '', key: '' }),
      { label: 'By Gross Profit', key: 'grossProfitCreditEstimations', actualKey: 'grossProfitCreditActuals', isBold: true },
      { label: 'By Rent Received', key: 'rentReceivedEstimations', actualKey: 'rentReceivedActuals' },
      { label: 'By Commission Received', key: 'commissionReceivedEstimations', actualKey: 'commissionReceivedActuals' },
      ...Array(17).fill({ label: '', key: '' }),
    ];

    // Add data rows
    for (let i = 0; i < Math.max(leftItems.length, rightItems.length); i++) {
      const leftItem = leftItems[i] || { label: '', key: '', actualKey: '' };
      const rightItem = rightItems[i] || { label: '', key: '', actualKey: '' };

      // Helper function to get value, handling empty strings and null/undefined
      const getValue = (key: string): any => {
        if (!key) return '';
        const value = financialAnalysis[key];
        if (value === null || value === undefined || value === '') return '';
        return value;
      };

      const row = worksheet.addRow([
        leftItem.label,
        getValue(leftItem.actualKey),
        getValue(leftItem.key),
        rightItem.label,
        getValue(rightItem.actualKey),
        getValue(rightItem.key),
      ]);

      if (leftItem.isBold || rightItem.isBold) {
        row.font = { bold: true };
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF4B084' },
          };
        });
      }

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle' };
      });

      // Align numbers to the right and format numeric values
      [2, 3, 5, 6].forEach((colNum) => {
        const cell = row.getCell(colNum);
        const value = cell.value;
        if (value !== null && value !== undefined && value !== '') {
          cell.alignment = {
            horizontal: 'right',
            vertical: 'middle',
          };
          if (typeof value === 'number') {
            cell.numFmt = '#,##0.00';
          } else if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
            // Handle string numbers
            cell.value = Number(value);
            cell.numFmt = '#,##0.00';
          }
        }
      });
    }

    await this.addSignature(workbook, worksheet);
    return await this.finalizeWorkbook(workbook, loan.id);
  }


  private async generateServiceBusinessFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Analysis');
    worksheet.columns = [
      { width: 40 },
      { width: 20 },
    ];

    // Business header
    const businessRow = worksheet.addRow([
      `M/S. ${financialAnalysis.businessName || loan.applicantName || 'XXXX'}`,
    ]);
    worksheet.mergeCells('A1:B1');
    businessRow.font = { bold: true, size: 16 };
    businessRow.alignment = { horizontal: 'center' };
    businessRow.height = 25;

    const propRow = worksheet.addRow([
      `PROP: Mr. ${financialAnalysis.proprietorName || loan.applicantName || 'XXXX'}`,
    ]);
    worksheet.mergeCells('A2:B2');
    propRow.font = { bold: true, size: 12 };
    propRow.alignment = { horizontal: 'center' };

    const titleRow = worksheet.addRow([
      'ESTIMATED PROFIT & LOSS ACCOUNT FOR THE YEAR ENDED 31ST MARCH 2025',
    ]);
    worksheet.mergeCells('A3:B3');
    titleRow.font = { bold: true, size: 12 };
    titleRow.alignment = { horizontal: 'center' };
    titleRow.height = 30;

    worksheet.addRow([]);

    // Table header
    const tableHeaderRow = worksheet.addRow(['PARTICULARS', 'Estimated']);
    tableHeaderRow.font = { bold: true };
    tableHeaderRow.alignment = { horizontal: 'center' };
    tableHeaderRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' },
      };
      this.applyBorder(cell);
    });

    // Expenditure section
    this.addDataRow(worksheet, 'Expenditure', '', true);
    this.addDataRow(worksheet, 'To Cost of Service', financialAnalysis.costOfService);
    this.addDataRow(worksheet, 'To Rent', financialAnalysis.rent);
    this.addDataRow(worksheet, 'To Salaries', financialAnalysis.salaries);
    this.addDataRow(worksheet, 'To Electricity', financialAnalysis.electricity);
    this.addDataRow(worksheet, 'To Transport', financialAnalysis.transport);
    this.addDataRow(worksheet, 'To Maintenance', financialAnalysis.maintenance);
    this.addDataRow(worksheet, 'To Other expenses', financialAnalysis.otherExpenses);
    worksheet.addRow([]);

    this.addDataRow(worksheet, 'To Net Profit', financialAnalysis.netProfit, true);
    this.addDataRow(worksheet, 'Total', financialAnalysis.byService, true);

    worksheet.addRow([]);

    // Income section
    this.addDataRow(worksheet, 'INCOME', '', true);
    this.addDataRow(worksheet, 'By service', financialAnalysis.byService);
    worksheet.addRow([]);
    worksheet.addRow([]);
    this.addDataRow(worksheet, 'Total', financialAnalysis.byService, true);

    // Monthly calculations (right side)
    const monthlyStartRow = 6;
    worksheet.getCell(`D${monthlyStartRow}`).value = 'TO monthly';
    worksheet.getCell(`E${monthlyStartRow}`).value = financialAnalysis.monthlyTurnover || 0;
    worksheet.getCell(`D${monthlyStartRow + 1}`).value = 'Payments Monthly';
    worksheet.getCell(`E${monthlyStartRow + 1}`).value = financialAnalysis.monthlyPayments || 0;
    worksheet.getCell(`D${monthlyStartRow + 2}`).value = 'NP monthly';
    worksheet.getCell(`E${monthlyStartRow + 2}`).value = financialAnalysis.monthlyNetProfit || 0;
    worksheet.getCell(`D${monthlyStartRow + 3}`).value = 'GP%';
    worksheet.getCell(`D${monthlyStartRow + 4}`).value = 'NP%';
    worksheet.getCell(`E${monthlyStartRow + 4}`).value = financialAnalysis.netProfitPercentage || 0;

    await this.addSignature(workbook, worksheet);
    return await this.finalizeWorkbook(workbook, loan.id);
  }

  /**
   * Detailed Format with Balance Sheet
   */
  private async generateDetailedBalanceSheetFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any
  ): Promise<Buffer> {
    console.log("financialAnalysis", financialAnalysis);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Analysis');

    // Set up columns for P&L and Balance Sheet side by side
    worksheet.columns = [
      { width: 25 }, // A - Particulars
      { width: 10 }, // B - Note
      { width: 15 }, // C - Audited Income
      { width: 12 }, // D - Assessed
      { width: 25 }, // E - Particulars (right)
      { width: 10 }, // F - Note
      { width: 15 }, // G - Audited Income
      { width: 12 }, // H - Estimated
    ];

    // Title
    const titleRow = worksheet.addRow([
      `M/s. ${financialAnalysis.businessName || 'XXX'}`,
    ]);
    worksheet.mergeCells('A1:D1');
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: 'center' };

    // Second title row
    const partnerRow = worksheet.addRow([
      `Partners : ${financialAnalysis.partnersNames || 'Mrs. XXX'}`,
    ]);
    worksheet.mergeCells('A2:D2');
    partnerRow.font = { bold: true, size: 11 };
    partnerRow.alignment = { horizontal: 'center' };

    // Balance Sheet title on right
    worksheet.getCell('E1').value = `Balance Sheet as on 31st March 2024`;
    worksheet.mergeCells('E1:H1');
    worksheet.getCell('E1').font = { bold: true, size: 12 };
    worksheet.getCell('E1').alignment = { horizontal: 'center' };

    worksheet.getCell('E2').value = `${financialAnalysis.partnersNames || 'Mrs. Digava Savitha'}`;
    worksheet.mergeCells('E2:H2');
    worksheet.getCell('E2').font = { bold: true };
    worksheet.getCell('E2').alignment = { horizontal: 'center' };

    const subTitleRow = worksheet.addRow([
      'Estimated Profit & Loss Account for the Year Ended 31st March 2026',
    ]);
    worksheet.mergeCells('A3:D3');
    subTitleRow.font = { bold: true };
    subTitleRow.alignment = { horizontal: 'center' };

    // Headers for P&L
    const headerRow = worksheet.addRow([
      'PARTICULARS',
      'Note',
      'Audited Income',
      'Assessed',
      'PARTICULARS',
      'Note',
      'Audited Income',
      'Estimated',
    ]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };
    headerRow.eachCell((cell) => {
      this.applyBorder(cell);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' },
      };
    });

    // Helper function to get value safely
    const getValue = (key: string): any => {
      if (!key) return '';
      const value = financialAnalysis[key];
      if (value === null || value === undefined || value === '') return '';
      return value;
    };

    // Helper function to add a data row
    const addDataRow = (
      leftLabel: string,
      leftNote: string | number,
      leftAudited: string | number,
      leftAssessed: string | number,
      rightLabel: string,
      rightNote: string | number,
      rightAudited: string | number,
      rightEstimated: string | number,
      isBold = false
    ) => {
      const row = worksheet.addRow([
        leftLabel,
        leftNote,
        leftAudited,
        leftAssessed,
        rightLabel,
        rightNote,
        rightAudited,
        rightEstimated,
      ]);

      if (isBold) {
        row.font = { bold: true };
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF4B084' },
          };
        });
      }

      row.eachCell((cell) => {
        this.applyBorder(cell);
        cell.alignment = { vertical: 'middle' };
      });

      // Format numeric columns (C, D, G, H)
      [3, 4, 7, 8].forEach((colNum) => {
        const cell = row.getCell(colNum);
        const value = cell.value;
        if (value !== null && value !== undefined && value !== '') {
          cell.alignment = {
            horizontal: 'right',
            vertical: 'middle',
          };
          if (typeof value === 'number') {
            cell.numFmt = '#,##0.00';
          } else if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
            cell.value = Number(value);
            cell.numFmt = '#,##0.00';
          }
        }
      });
    };

    // Add P&L data rows - Left side (Expenditure/Assessed) and Right side (Income/Estimated)
    
    // Income section (Right side - Estimated column)
    addDataRow('', '', '', '', 'Gross Receipts', '', '', getValue('grossReceipts'));
    addDataRow('', '', '', '', 'Other Income', '', '', getValue('otherIncome'));
    addDataRow('', '', '', '', 'Sub-total (Income)', '', '', getValue('incomeSubtotal'), true);
    
    // Cost section (Left side - Assessed column)
    addDataRow('Cost of material consumed', '', '', getValue('costOfMaterialConsumed'), '', '', '', '');
    addDataRow('Cost to Receipts %', '', '', getValue('costToReceiptsPercentage'), '', '', '', '');
    
    // Gross Profit (Right side)
    addDataRow('', '', '', '', 'Gross Profit as per assumption', '', '', getValue('grossProfitAsPerAssumption'), true);
    addDataRow('', '', '', '', 'GP ratio %', '', '', getValue('gpRatio'));
    
    // Expenditure section (Left side - Assessed column)
    addDataRow('Salary', '', '', getValue('salary'), '', '', '', '');
    addDataRow('Rent', '', '', getValue('rent'), '', '', '', '');
    addDataRow('Electricity', '', '', getValue('electricity'), '', '', '', '');
    addDataRow('Travelling', '', '', getValue('travelling'), '', '', '', '');
    addDataRow('Other Expenses', '', '', getValue('otherExpenses'), '', '', '', '');
    addDataRow('Sub-total (Expenditure)', '', '', getValue('expenditureSubtotal'), '', '', '', '', true);
    
    // Net Profit before interest, tax & Depreciation (Right side)
    addDataRow('', '', '', '', 'Net Profit before interest, tax & Depreciation', '', '', getValue('netProfitBeforeInterestTaxDepreciation'), true);
    addDataRow('', '', '', '', 'PBDIT Margin %', '', '', getValue('pbditMargin'));
    
    // Finance Expenses (Left side)
    addDataRow('Finance Expenses', '', '', getValue('financeExpenses'), '', '', '', '');
    
    // Net Profit before tax & Depreciation (Right side)
    addDataRow('', '', '', '', 'Net Profit before tax & Depreciation', '', '', getValue('netProfitBeforeTaxDepreciation'), true);
    
    // Depreciation (Left side)
    addDataRow('Depreciation', '', '', getValue('depreciation'), '', '', '', '');
    
    // Net Profit Before Tax (Right side)
    addDataRow('', '', '', '', 'Net Profit Before Tax', '', '', getValue('netProfitBeforeTax'), true);
    
    // Income Tax (Left side)
    addDataRow('Income Tax', '', '', getValue('incomeTax'), '', '', '', '');
    
    // Net Profit After Tax (Right side)
    addDataRow('', '', '', '', 'Net Profit After Tax', '', '', getValue('netProfitAfterTax'), true);
    
    // Total expenses including cost of sales (Left side)
    addDataRow('Total expenses including cost of sales', '', '', getValue('totalExpensesInclCostOfSales'), '', '', '', '', true);

    await this.addSignature(workbook, worksheet);
    return await this.finalizeWorkbook(workbook, loan.id);
  }

  /**
   * Proprietor Format with GST Tables
   */
  private async generateProprietorGstFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Analysis');

    // Similar structure to service format but with GST tables added at bottom
    // Implementation continues...

    await this.addSignature(workbook, worksheet);
    return await this.finalizeWorkbook(workbook, loan.id);
  }

  /**
   * GP/PBDIT Format
   */
  private async generateGpPbditFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Analysis');

    // Implementation for GP/PBDIT format from image 5
    // This would include all the detailed calculations

    await this.addSignature(workbook, worksheet);
    return await this.finalizeWorkbook(workbook, loan.id);
  }

  /**
   * Comprehensive Actuals vs Estimated Format
   */
  private async generateComprehensiveFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Analysis');

    // Implementation for comprehensive format from image 6
    // With multiple years comparison

    await this.addSignature(workbook, worksheet);
    return await this.finalizeWorkbook(workbook, loan.id);
  }

  /**
   * Helper methods
   */
  private addDataRow(
    worksheet: any,
    label: string,
    value: any,
    isBold = false
  ): void {
    const row = worksheet.addRow([label, value]);
    if (isBold) {
      row.font = { bold: true };
      row.eachCell((cell: any) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF4B084' },
        };
      });
    }
    row.eachCell((cell: any) => {
      this.applyBorder(cell);
      cell.alignment = { vertical: 'middle' };
    });
    if (row.getCell(2).value && typeof row.getCell(2).value === 'number') {
      row.getCell(2).alignment = { horizontal: 'right', vertical: 'middle' };
      row.getCell(2).numFmt = '#,##0.00';
    }
  }

  private applyBorder(cell: any): void {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }

  private async addSignature(workbook: any, worksheet: any): Promise<void> {
    try {
      const signaturePath = path.resolve(
        process.cwd(),
        process.env.SIGNATURE_PATH || ''
      );
      if (fs.existsSync(signaturePath)) {
        worksheet.addRow([]);
        worksheet.addRow([]);
        const lastRowNumber = worksheet.lastRow.number + 1;

        const imageBuffer = fs.readFileSync(signaturePath);
        const imageId = workbook.addImage({
          buffer: imageBuffer as any,
          extension: 'jpeg',
        });

        worksheet.addImage(imageId, {
          tl: { col: 0, row: lastRowNumber },
          ext: { width: 350, height: 250 },
        });

        // Add spacing rows
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
      }
    } catch (error) {
      // Signature is optional, don't fail if it's missing
      console.warn('Failed to add signature:', error.message);
    }
  }

  private async finalizeWorkbook(workbook: any, loanId: number): Promise<Buffer> {
    const buffer = await workbook.xlsx.writeBuffer();
    await this.loggingService.info(
      'Financial analysis exported to Excel successfully',
      { loanId }
    );
    return Buffer.from(buffer);
  }
}

