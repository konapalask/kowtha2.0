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
  ) {}

  /**
   * Main export function that routes to the appropriate template based on bank
   */
  async exportFinancialAnalysisToExcel( loanId: number, bankName: string ): Promise<Buffer> {
    const ExcelJS = await import('exceljs');

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

      const financialAnalysis = (verification.financialAnalysis as any) || {};
      const loan = verification.loan;

      // Route to appropriate template based on bank name
      const bankNameLower = bankName?.toLowerCase() || '';

      // Define bank template mappings
      if (this.isServiceBusinessFormat(bankNameLower)) {
        return await this.generateServiceBusinessFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isDetailedBalanceSheetFormat(bankNameLower)) {
        return await this.generateDetailedBalanceSheetFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isProprietorGstFormat(bankNameLower)) {
        return await this.generateProprietorGstFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isGpPbditFormat(bankNameLower)) {
        return await this.generateGpPbditFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isComprehensiveFormat(bankNameLower)) {
        return await this.generateComprehensiveFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else {
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
    const serviceBanks = ['chola', 'cholamandalam'];
    return serviceBanks.some((bank) => bankName.includes(bank));
  }

  private isDetailedBalanceSheetFormat(bankName: string): boolean {
    const detailedBanks = ['hdfc', 'icici', 'axis'];
    return detailedBanks.some((bank) => bankName.includes(bank));
  }

  private isProprietorGstFormat(bankName: string): boolean {
    const gstBanks = ['kotak', 'indusind'];
    return gstBanks.some((bank) => bankName.includes(bank));
  }

  private isGpPbditFormat(bankName: string): boolean {
    const pbditBanks = ['bajaj', 'tata'];
    return pbditBanks.some((bank) => bankName.includes(bank));
  }

  private isComprehensiveFormat(bankName: string): boolean {
    const comprehensiveBanks = ['sbi', 'pnb', 'bank of baroda'];
    return comprehensiveBanks.some((bank) => bankName.includes(bank));
  }

  /**
   * Standard Trading and P&L Format (Default)
   */
  private async generateStandardFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Analysis');

    // Set column widths
    worksheet.columns = [
      { width: 25 }, // A - Left Particulars
      { width: 15 }, // B - Left Actuals
      { width: 15 }, // C - Left Estimations
      { width: 25 }, // D - Right Particulars
      { width: 15 }, // E - Right Actuals
      { width: 15 }, // F - Right Estimations
    ];

    // Add title
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

    // Define the rows structure
    const leftItems = [
      { label: 'To Opening Stock', key: 'openingStock', actualKey: 'openingStockActual' },
      { label: 'To Purchase', key: 'purchase', actualKey: 'purchaseActual' },
      { label: 'To Cost of Services', key: 'costOfServices', actualKey: 'costOfServicesActual' },
      { label: 'To Wages', key: 'wages', actualKey: 'wagesActual' },
      { label: 'To Hamali Charges', key: 'hamaliCharges', actualKey: 'hamaliChargesActual' },
      { label: 'To Manufacturing Expenses', key: 'manufacturingExpenses', actualKey: 'manufacturingExpensesActual' },
      { label: 'To Packing Charges', key: 'packingCharges', actualKey: 'packingChargesActual' },
      { label: '', key: '' },
      { label: 'To Gross Profit', key: 'grossProfit', actualKey: 'grossProfitActual', isBold: true },
      { label: '', key: '' },
      { label: 'To Salaries', key: 'salaries', actualKey: 'salariesActual' },
      { label: 'To Rent', key: 'rent', actualKey: 'rentActual' },
      { label: 'To Electricity Charges', key: 'electricityCharges', actualKey: 'electricityChargesActual' },
      { label: 'To Printing & Stationery', key: 'printingStationery', actualKey: 'printingStationeryActual' },
      { label: 'To Telephone Charges', key: 'telephoneCharges', actualKey: 'telephoneChargesActual' },
      { label: 'To Postage & Telegram', key: 'postageTelegram', actualKey: 'postageTelegramActual' },
      { label: 'To Office Maintenance', key: 'officeMaintenance', actualKey: 'officeMaintenanceActual' },
      { label: 'To Repairs & Maintenance', key: 'repairsMaintenance', actualKey: 'repairsMaintenanceActual' },
      { label: 'To Sadar Expenses', key: 'sadarExpenses', actualKey: 'sadarExpensesActual' },
      { label: 'To Audit Fee', key: 'auditFee', actualKey: 'auditFeeActual' },
      { label: 'To Advertisement', key: 'advertisement', actualKey: 'advertisementActual' },
      { label: 'To Bank Charges', key: 'bankCharges', actualKey: 'bankChargesActual' },
      { label: 'To Insurance', key: 'insurance', actualKey: 'insuranceActual' },
      { label: 'To Depreciation', key: 'depreciation', actualKey: 'depreciationActual' },
      { label: 'To Interest on Loan', key: 'interestOnLoan', actualKey: 'interestOnLoanActual' },
      { label: '', key: '' },
      { label: 'To Net Profit', key: 'netProfit', actualKey: 'netProfitActual', isBold: true },
      { label: '', key: '' },
    ];

    const rightItems = [
      { label: 'By Sales', key: 'sales', actualKey: 'salesActual' },
      { label: 'By Services', key: 'services', actualKey: 'servicesActual' },
      { label: 'By Closing Stock', key: 'closingStock', actualKey: 'closingStockActual' },
      ...Array(5).fill({ label: '', key: '' }),
      { label: 'By Gross Profit', key: 'grossProfit', actualKey: 'grossProfitActual', isBold: true },
      { label: 'By Rent Received', key: 'rentReceived', actualKey: 'rentReceivedActual' },
      { label: 'By Commission Received', key: 'commissionReceived', actualKey: 'commissionReceivedActual' },
      ...Array(17).fill({ label: '', key: '' }),
    ];

    // Add data rows
    for (let i = 0; i < Math.max(leftItems.length, rightItems.length); i++) {
      const leftItem = leftItems[i] || { label: '', key: '' };
      const rightItem = rightItems[i] || { label: '', key: '' };

      const row = worksheet.addRow([
        leftItem.label,
        leftItem.actualKey ? financialAnalysis[leftItem.actualKey] || '' : '',
        leftItem.key ? financialAnalysis[leftItem.key] || '' : '',
        rightItem.label,
        rightItem.actualKey ? financialAnalysis[rightItem.actualKey] || '' : '',
        rightItem.key ? financialAnalysis[rightItem.key] || '' : '',
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

      // Align numbers to the right
      [2, 3, 5, 6].forEach((colNum) => {
        if (row.getCell(colNum).value) {
          row.getCell(colNum).alignment = {
            horizontal: 'right',
            vertical: 'middle',
          };
          if (typeof row.getCell(colNum).value === 'number') {
            row.getCell(colNum).numFmt = '#,##0.00';
          }
        }
      });
    }

    await this.addSignature(workbook, worksheet);
    return await this.finalizeWorkbook(workbook, loan.id);
  }

  /**
   * Service Business Format - Simple estimated P&L
   */
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

    // Add P&L data rows...
    // This would continue with the detailed structure from image 3

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

