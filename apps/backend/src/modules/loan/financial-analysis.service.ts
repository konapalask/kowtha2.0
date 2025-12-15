import { Injectable, NotFoundException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { PrismaService } from "../../prisma.service";
import { Department, VerificationType } from "@prisma/client";
import { LoggingService } from "../common/logging/logging.service";

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
  private readonly bankTemplateMappings = {
    generic: [
      "ADITYA BIRLA-HL",
      "ADITYA BIRLA-ML",
      "ADITYA BIRLA-STSL",
      "AMBIT-HL",
      "AMBIT-MSME",
      "AXIS FINANCE-UBL ABOVE 10L",
      "AXIS FINANCE-UBL BELOW 10L",
      "AXIS BANK",
      "AXIS AGRI",
      "AXIS BUSINESS AGRI",
      "ARKA FINCAP",
      "CENTRUM",
      "CENT BANK",
      "CHOLA-HL",
      "CHOLA-SME",
      "CLIX CAPITAL-HL",
      "CLIX CAPITAL-UBL",
      "EASY HL",
      "FED BANK (PD&LIP)",
      "GODREJ-HL",
      "GODREJ-UBL",
      "HERO HOUSING SALARIED",
      "HERO HOUSING SELF",
      "ICICI",
      "IDFC FIRST-HL",
      "IDFC FIRST-ML",
      "IDFC FIRST-PL",
      "IIFL",
      "INDUSIND",
      "INDIA SHELTER",
      "INDIA SHELTER",
      "JANA SMALL FINANCE BANK LIMITED SALARIED",
      "JANA SMALL FINANCE BANK LIMITED SENP ABOVE 50L",
      "JANA SMALL FINANCE BANK LIMITED SENP BELOW 50L",
      "KOTAK",
      "MUTHOOT-HL",
      "MUTHOOT FINCORP (PD & LIP)",
      "NIDO HOME FINANCE",
      "NIWAS SALARIED",
      "NIWAS SENP",
      "NORTHERN ARC",
      "NIPUN",
      "PIRAMAL (PD, AIP, LIP)",
      "PNB",
      "SMFG-SME",
      "TATA CAPITAL-UBL",
      "TRUHOME (PD & LIP)",
      "VERITAS",
      "YES BANK-HL",
    ],
    "statement-2": [
      "AXIS FINANCE-HL",
      "INCRED/KKR India Financial Services Limited",
      "SAMMAAN",
      "SMFG-ML (MICRO & MASS)",
      "SMFG-HL",
      "TATA CAPITAL-FSL",
      "TATA CAPITAL-HFL",
    ],
    "statement-3": ["DCB BANK"],
    "statement-4": ["HERO FINCORP", "RBL BANK (PD & LIP)"],
  };

  // Main export function that routes to the appropriate template based on bank

  async exportFinancialAnalysisToExcel(
    loanId: number,
    bankName: string
  ): Promise<Buffer> {
    const ExcelJS = await import("exceljs");
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
        throw new NotFoundException("Verification not found");
      }

      // Financial analysis is stored in verification.financialAnalysis, not in verificationData
      const financialAnalysis =
        (verification.verificationData as any)?.financialAnalysis || {};
      const loan = verification.loan;
      const businessName = verification.businessName || "";

      // Log for debugging if financial analysis is empty
      if (!financialAnalysis || Object.keys(financialAnalysis).length === 0) {
        await this.loggingService.warn("Financial analysis is empty for loan", {
          loanId,
          bankName,
          verificationId: verification.id,
        });
      }

      if (this.isServiceBusinessFormat(bankName)) {
        return await this.generateStandardFormat(
          ExcelJS,
          financialAnalysis,
          loan,
          businessName
        );
      } else if (this.isDetailedBalanceSheetFormat(bankName)) {
        return await this.generateDetailedBalanceSheetFormat(
          ExcelJS,
          financialAnalysis,
          loan,
          businessName
        );
      } else if (this.isProprietorGstFormat(bankName)) {
        return await this.generateProprietorGstFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isGpPbditFormat(bankName)) {
        return await this.generateGpPbditFormat(
          ExcelJS,
          financialAnalysis,
          loan
        );
      } else if (this.isComprehensiveFormat(bankName)) {
        return await this.generateStandardFormat(
          ExcelJS,
          financialAnalysis,
          loan,
          businessName
        );
      } else {
        // Default fallback to standard format if bank doesn't match any specific format
        await this.loggingService.warn(
          "Bank format not recognized, using standard format",
          {
            loanId,
            bankName,
          }
        );
        return await this.generateStandardFormat(
          ExcelJS,
          financialAnalysis,
          loan,
          businessName
        );
      }
    } catch (error) {
      await this.loggingService.error(
        "Failed to export financial analysis to Excel",
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
    const serviceBanks = this.bankTemplateMappings["generic"];
    if (!serviceBanks || !Array.isArray(serviceBanks)) {
      return false;
    }
    // Check if bankName matches any bank in the list (case-insensitive)
    return serviceBanks.some(
      (bank) =>
        bankName.toUpperCase().includes(bank.toUpperCase()) ||
        bank.toUpperCase().includes(bankName.toUpperCase())
    );
  }

  private isDetailedBalanceSheetFormat(bankName: string): boolean {
    const detailedBanks = this.bankTemplateMappings["statement-2"];
    if (!detailedBanks || !Array.isArray(detailedBanks)) {
      return false;
    }
    return detailedBanks.some(
      (bank) =>
        bankName.toUpperCase().includes(bank.toUpperCase()) ||
        bank.toUpperCase().includes(bankName.toUpperCase())
    );
  }

  private isProprietorGstFormat(bankName: string): boolean {
    const gstBanks = this.bankTemplateMappings["statement-3"];
    if (!gstBanks || !Array.isArray(gstBanks)) {
      return false;
    }
    return gstBanks.some(
      (bank) =>
        bankName.toUpperCase().includes(bank.toUpperCase()) ||
        bank.toUpperCase().includes(bankName.toUpperCase())
    );
  }

  private isGpPbditFormat(bankName: string): boolean {
    const pbditBanks = this.bankTemplateMappings["statement-4"];
    if (!pbditBanks || !Array.isArray(pbditBanks)) {
      return false;
    }
    // Check both directions: bankName contains bank OR bank contains bankName
    // This handles cases like "RBL" matching "RBL BANK (PD & LIP)"
    return pbditBanks.some(
      (bank) =>
        bankName.toUpperCase().includes(bank.toUpperCase()) ||
        bank.toUpperCase().includes(bankName.toUpperCase())
    );
  }

  private isComprehensiveFormat(bankName: string): boolean {
    const comprehensiveBanks = this.bankTemplateMappings["statement-5"];
    if (!comprehensiveBanks || !Array.isArray(comprehensiveBanks)) {
      return false;
    }
    return comprehensiveBanks.some(
      (bank) =>
        bankName.toUpperCase().includes(bank.toUpperCase()) ||
        bank.toUpperCase().includes(bankName.toUpperCase())
    );
  }

  /**
   * Calculates the financial year ending date (31.03.YEAR) based on current date
   * Financial year runs from April 1 to March 31
   * - April 1, 2025 to March 31, 2026 → returns 2026
   * - April 1, 2026 to March 31, 2027 → returns 2027
   */
  private getFinancialYearEndingYear(): number {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed: 0=Jan, 1=Feb, ..., 3=Apr, ..., 11=Dec
    const currentYear = now.getFullYear();
    
    // If we're in April (3) or later, the financial year ending is next year
    // If we're in Jan-Mar (0-2), the financial year ending is this year
    if (currentMonth >= 3) {
      return currentYear + 1;
    } else {
      return currentYear;
    }
  }

  private async generateStandardFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any,
    businessName: string
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Financial Analysis");

    worksheet.columns = [
      { width: 30 },
      { width:  20},
      { width: 30 },
      { width: 20 },
    ];
    

    const titleRow = worksheet.addRow([
      `Estimated Trading and Profit & Loss Account for the year ending 31.03.${this.getFinancialYearEndingYear()}`,
      "", // Column B
      "", // Column C
      "", // Column D
    ]);
    worksheet.mergeCells("A1:D1");
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: "center", vertical: "middle" };
    titleRow.height = 30;
    titleRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };

    const applicantNameRow = worksheet.addRow([
      `PROPRIETOR/PARTNER/DIRECTOR: ${loan.applicantName || "XXXX"}`,
      "", // Column B
      "", // Column C
      "", // Column D
    ]);
    worksheet.mergeCells("A2:D2");
    applicantNameRow.font = { bold: true, size: 16 };
    applicantNameRow.alignment = { horizontal: "center" };
    applicantNameRow.height = 25;
    applicantNameRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };
    const businessNameRow = worksheet.addRow([
      `Business Name: ${businessName || ""}`,
      "", // Column B
      "", // Column C
      "", // Column D
    ]);
    worksheet.mergeCells("A3:D3");
    businessNameRow.font = { bold: true, size: 16 };
    businessNameRow.alignment = { horizontal: "center" };
    businessNameRow.height = 25;
    businessNameRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };
    // Add header row
    const headerRow = worksheet.addRow([
      "Particulars",
      "Estimated",
      "Particulars",
      "Estimated",
    ]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Using field names from generic.ts schema
    // Debit side fields (left) - matching the order in generic.ts debit array
    const leftItems = [
      { label: "To Opening Stock", key: "openingStock" },
      { label: "To Purchase", key: "purchase" },
      { label: "To Cost of Services", key: "costOfServices" },
      { label: "To Wages", key: "wages" },
      { label: "To Hamali Charges", key: "hamaliCharges" },
      { label: "To Manufacturing Expenses", key: "manufacturingExpenses" },
      { label: "To Packing Charges", key: "packingCharges" },
      { label: "", key: "" },
      { label: "To Gross Profit", key: "grossProfitDebit", isBold: true },
      { label: "TOTAL", key: "totalDebit"},
      { label: "To Salaries", key: "salaries" },
      { label: "To Rent", key: "rent" },
      { label: "To Electricity Charges", key: "electricityCharges" },
      { label: "To Printing & Stationery", key: "printingStationery" },
      { label: "To Telephone Charges", key: "telephoneCharges" },
      { label: "To Postage & Telegram", key: "postageTelegram" },
      { label: "To Office Maintenance", key: "officeMaintenance" },
      { label: "To Repairs & Maintenance", key: "repairsMaintenance" },
      { label: "To Sadar Expenses", key: "sadarExpenses" },
      { label: "To Audit Fee", key: "auditFee" },
      { label: "To Advertisement", key: "advertisement" },
      { label: "To Bank Charges", key: "bankCharges" },
      { label: "To Insurance", key: "insurance" },
      { label: "To Depreciation", key: "depreciation" },
      { label: "To Interest on Loan", key: "interestOnLoan" },
      { label: "", key: "" },
      { label: "To Net Profit", key: "netProfit", isBold: true },
      { label: "TOTAL", key: "totalExpenses"},
    ];

    // Credit side fields (right) - matching the order in generic.ts credit array
    const rightItems = [
      { label: "By Sales", key: "sales" },
      { label: "By Services", key: "services" },
      { label: "By Closing Stock", key: "closingStock" },
      ...Array(6).fill({ label: "", key: "" }),
      { label: "TOTAL", key: "totalCredit"},
      { label: "By Gross Profit", key: "grossProfitCredit" },
      { label: "By Rent Received", key: "rentReceived" },
      { label: "By Commission Received", key: "commissionReceived" },
      ...Array(14).fill({ label: "", key: "" }),
      { label: "TOTAL", key: "totalExpenses"},
    ];

    // Add data rows
    for (let i = 0; i < Math.max(leftItems.length, rightItems.length); i++) {
      const leftItem = leftItems[i] || { label: "", key: "" };
      const rightItem = rightItems[i] || { label: "", key: "" };

      // Helper function to get value, handling empty strings and null/undefined
      const getValue = (key: string): any => {
        if (!key) return "";
        const value = financialAnalysis[key];
        if (value === null || value === undefined || value === "") return "";
        return value;
      };

      // Add row with only Actuals columns (no Estimations)
      const row = worksheet.addRow([
        leftItem.label,
        getValue(leftItem.key), // Actuals column
        rightItem.label,
        getValue(rightItem.key), // Actuals column
      ]);

      if (leftItem.label === "TOTAL" || rightItem.label === "TOTAL") {
        row.font = { bold: true };
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFF00" },
          };
        });
      }

      if (leftItem.isBold || rightItem.isBold) {
        row.font = { bold: true };
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF4B084" },
          };
        });
      }
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle" };
      });

      // Align numbers to the right and format numeric values (only Actuals columns: 2 and 4)
      [2, 4].forEach((colNum) => {
        const cell = row.getCell(colNum);
        const value = cell.value;
        if (value !== null && value !== undefined && value !== "") {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
          };
          if (typeof value === "number") {
            cell.numFmt = "#,##0.00";
          } else if (
            typeof value === "string" &&
            !isNaN(Number(value)) &&
            value.trim() !== ""
          ) {
            // Handle string numbers
            cell.value = Number(value);
            cell.numFmt = "#,##0.00";
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
    const worksheet = workbook.addWorksheet("Financial Analysis");
    worksheet.columns = [{ width: 40 }, { width: 20 }];

    // Business header
    const businessRow = worksheet.addRow([
      `M/S. ${financialAnalysis.businessName || loan.applicantName || "XXXX"}`,
    ]);
    worksheet.mergeCells("A1:B1");
    businessRow.font = { bold: true, size: 16 };
    businessRow.alignment = { horizontal: "center" };
    businessRow.height = 25;

    const propRow = worksheet.addRow([
      `PROP: Mr. ${financialAnalysis.proprietorName || loan.applicantName || "XXXX"}`,
    ]);
    worksheet.mergeCells("A2:B2");
    propRow.font = { bold: true, size: 12 };
    propRow.alignment = { horizontal: "center" };

    const titleRow = worksheet.addRow([
      "ESTIMATED PROFIT & LOSS ACCOUNT FOR THE YEAR ENDED 31ST MARCH 2025",
    ]);
    worksheet.mergeCells("A3:B3");
    titleRow.font = { bold: true, size: 12 };
    titleRow.alignment = { horizontal: "center" };
    titleRow.height = 30;

    worksheet.addRow([]);

    // Table header
    const tableHeaderRow = worksheet.addRow(["PARTICULARS", "Estimated"]);
    tableHeaderRow.font = { bold: true };
    tableHeaderRow.alignment = { horizontal: "center" };
    tableHeaderRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" },
      };
      this.applyBorder(cell);
    });

    // Expenditure section
    this.addDataRow(worksheet, "Expenditure", "", true);
    this.addDataRow(
      worksheet,
      "To Cost of Service",
      financialAnalysis.costOfService
    );
    this.addDataRow(worksheet, "To Rent", financialAnalysis.rent);
    this.addDataRow(worksheet, "To Salaries", financialAnalysis.salaries);
    this.addDataRow(worksheet, "To Electricity", financialAnalysis.electricity);
    this.addDataRow(worksheet, "To Transport", financialAnalysis.transport);
    this.addDataRow(worksheet, "To Maintenance", financialAnalysis.maintenance);
    this.addDataRow(
      worksheet,
      "To Other expenses",
      financialAnalysis.otherExpenses
    );
    worksheet.addRow([]);

    this.addDataRow(
      worksheet,
      "To Net Profit",
      financialAnalysis.netProfit,
      true
    );
    this.addDataRow(worksheet, "Total", financialAnalysis.byService, true);

    worksheet.addRow([]);

    // Income section
    this.addDataRow(worksheet, "INCOME", "", true);
    this.addDataRow(worksheet, "By service", financialAnalysis.byService);
    worksheet.addRow([]);
    worksheet.addRow([]);
    this.addDataRow(worksheet, "Total", financialAnalysis.byService, true);

    // Monthly calculations (right side)
    const monthlyStartRow = 6;
    worksheet.getCell(`D${monthlyStartRow}`).value = "TO monthly";
    worksheet.getCell(`E${monthlyStartRow}`).value =
      financialAnalysis.monthlyTurnover || 0;
    worksheet.getCell(`D${monthlyStartRow + 1}`).value = "Payments Monthly";
    worksheet.getCell(`E${monthlyStartRow + 1}`).value =
      financialAnalysis.monthlyPayments || 0;
    worksheet.getCell(`D${monthlyStartRow + 2}`).value = "NP monthly";
    worksheet.getCell(`E${monthlyStartRow + 2}`).value =
      financialAnalysis.monthlyNetProfit || 0;
    worksheet.getCell(`D${monthlyStartRow + 3}`).value = "GP%";
    worksheet.getCell(`D${monthlyStartRow + 4}`).value = "NP%";
    worksheet.getCell(`E${monthlyStartRow + 4}`).value =
      financialAnalysis.netProfitPercentage || 0;

    await this.addSignature(workbook, worksheet);
    return await this.finalizeWorkbook(workbook, loan.id);
  }

  /**
   * Detailed Format with Balance Sheet
   */
  private async generateDetailedBalanceSheetFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any,
    businessName: string
  ): Promise<Buffer> {
    console.log("financialAnalysis", financialAnalysis);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Financial Analysis");

    // Set up columns - single column format with Particulars and Value
    worksheet.columns = [
      { width: 40 }, // A - Particulars
      { width: 20 }, // B - Value
    ];

    // Title
    const titleRow = worksheet.addRow([
      `Business Name: ${businessName || "XXX"}`,
      "", // Column B
    ]);
    worksheet.mergeCells("A1:B1");
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: "center" };

    // Second title row
    const partnerRow = worksheet.addRow([
      `PROPRIETOR/PARTNER/DIRECTOR: ${loan.applicantName || "Mr. XXX"}`,
      "", // Column B
    ]);
    worksheet.mergeCells("A2:B2");
    partnerRow.font = { bold: true, size: 11 };
    partnerRow.alignment = { horizontal: "center" };

    const subTitleRow = worksheet.addRow([
      `Estimated Trading and Profit & Loss Account for the Year Ended 31st March ${this.getFinancialYearEndingYear()}`,
      "", // Column B
    ]);
    worksheet.mergeCells("A3:B3");
    subTitleRow.font = { bold: true };
    subTitleRow.alignment = { horizontal: "center" };

    worksheet.addRow([]); // Empty row

    // Headers
    const headerRow = worksheet.addRow(["PARTICULARS", "Estimated Income"]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      this.applyBorder(cell);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" },
      };
    });

    // Helper function to get value safely
    const getValue = (key: string): any => {
      if (!key) return "";
      const value = financialAnalysis[key];
      if (value === null || value === undefined || value === "") return "";
      return value;
    };

    // Helper function to add a data row
    const addDataRow = (label: string, value: any, isBold = false) => {
      const row = worksheet.addRow([label, value]);

      if (isBold) {
        row.font = { bold: true };
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF4B084" },
          };
        });
      }

      row.eachCell((cell) => {
        this.applyBorder(cell);
        cell.alignment = { vertical: "middle" };
      });

      // Format numeric column (B)
      const valueCell = row.getCell(2);
      const cellValue = valueCell.value;
      if (cellValue !== null && cellValue !== undefined && cellValue !== "") {
        valueCell.alignment = {
          horizontal: "right",
          vertical: "middle",
        };
        if (typeof cellValue === "number") {
          valueCell.numFmt = "#,##0.00";
        } else if (
          typeof cellValue === "string" &&
          !isNaN(Number(cellValue)) &&
          cellValue.trim() !== ""
        ) {
          valueCell.value = Number(cellValue);
          valueCell.numFmt = "#,##0.00";
        }
      }
    };

    // Add P&L data rows - single column format

    // Income section
    addDataRow("Gross Receipts", getValue("grossReceipts"));
    addDataRow("Other Income", getValue("otherIncome"));
    addDataRow("Sub-total (Income)", getValue("incomeSubtotal"), true);

    // Cost section
    addDataRow("Cost of material consumed", getValue("costOfMaterialConsumed"));
    addDataRow("Cost of material consumed to Receipts %", getValue("costToReceiptsPercentage"));

    // Gross Profit
    addDataRow(
      "Gross Profit as per assumption",
      getValue("grossProfitAsPerAssumption"),
      true
    );
    addDataRow("GP ratio %", getValue("gpRatio"));
    addDataRow("Expenditure","",true);

    // Expenditure section
    addDataRow("Salary", getValue("salary"));
    addDataRow("Rent", getValue("rent"));
    addDataRow("Electricity", getValue("electricity"));
    addDataRow("Travelling", getValue("travelling"));
    addDataRow("Other Expenses", getValue("otherExpenses"));
    addDataRow(
      "Sub-total (Expenditure)",
      getValue("expenditureSubtotal"),
      true
    );

    // Net Profit before interest, tax & Depreciation
    addDataRow(
      "Net Profit before interest, tax & Depreciation",
      getValue("netProfitBeforeInterestTaxDepreciation"),
      true
    );
    addDataRow("PBDIT Margin %", getValue("pbditMargin"));

    // Finance Expenses
    addDataRow("Finance Expenses", getValue("financeExpenses"));

    // Net Profit before tax & Depreciation
    addDataRow(
      "Net Profit before tax & Depreciation",
      getValue("netProfitBeforeTaxDepreciation"),
      true
    );

    // Depreciation
    addDataRow("Depreciation", getValue("depreciation"));

    // Net Profit Before Tax
    addDataRow("Net Profit Before Tax", getValue("netProfitBeforeTax"), true);

    // Income Tax
    addDataRow("Income Tax", getValue("incomeTax"));

    // Net Profit After Tax
    addDataRow("Net Profit After Tax", getValue("netProfitAfterTax"), true);

    // Total expenses including cost of sales
    addDataRow(
      "Total expenses including cost of sales",
      getValue("totalExpensesInclCostOfSales"),
      true
    );

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
    console.log("financialAnalysis", financialAnalysis);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Financial Analysis");

    // Set up columns for P&L with comparison columns
    worksheet.columns = [
      { width: 30 }, // A - Particulars (left)
      { width: 20 }, // B - Previous Year Actuals
      { width: 20 }, // C - This Year Actuals
      { width: 15 }, // D - Estimated
      { width: 30 }, // E - Particulars (right)
      { width: 20 }, // F - Previous Year Actuals
      { width: 20 }, // G - This Year Actuals
      { width: 15 }, // H - Estimated
    ];

    // Helper function to get value safely
    const getValue = (key: string): any => {
      if (!key) return "";
      const value = financialAnalysis[key];
      if (value === null || value === undefined || value === "") return "";
      return value;
    };

    // Title
    const titleRow = worksheet.addRow([
      `M/s. ${financialAnalysis.businessName || loan.applicantName || "XXX"}`,
    ]);
    worksheet.mergeCells("A1:H1");
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: "center" };

    // Subtitle
    const subTitleRow = worksheet.addRow([
      `Estimated Profit & Loss Account for the Year Ended 31st March ${this.getFinancialYearEndingYear()}`,
    ]);
    worksheet.mergeCells("A2:H2");
    subTitleRow.font = { bold: true, size: 12 };
    subTitleRow.alignment = { horizontal: "center" };
    subTitleRow.height = 25;

    worksheet.addRow([]);

    // Column headers row
    const columnHeaderRow = worksheet.addRow([
      "PARTICULARS",
      `${this.getFinancialYearEndingYear() - 2} Actuals`,
      `${this.getFinancialYearEndingYear() - 1} Actuals`,
      "Estimated",
      "PARTICULARS",
      `${this.getFinancialYearEndingYear() - 2} Actuals`,
      `${this.getFinancialYearEndingYear() - 1} Actuals`,
      "Estimated",
    ]);
    columnHeaderRow.font = { bold: true };
    columnHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
    columnHeaderRow.eachCell((cell) => {
      this.applyBorder(cell);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" },
      };
    });

    // Helper function to add a data row
    const addDataRow = (
      leftLabel: string,
      left2023: any,
      left2024: any,
      leftEstimated: any,
      rightLabel: string,
      right2023: any,
      right2024: any,
      rightEstimated: any,
      isBold = false
    ) => {
      const row = worksheet.addRow([
        leftLabel,
        left2023,
        left2024,
        leftEstimated,
        rightLabel,
        right2023,
        right2024,
        rightEstimated,
      ]);

      if (isBold) {
        row.font = { bold: true };
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF4B084" },
          };
        });
      }

      row.eachCell((cell) => {
        this.applyBorder(cell);
        cell.alignment = { vertical: "middle" };
      });

      // Format numeric columns (B, C, D, F, G, H)
      [2, 3, 4, 6, 7, 8].forEach((colNum) => {
        const cell = row.getCell(colNum);
        const value = cell.value;
        if (value !== null && value !== undefined && value !== "") {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
          };
          if (typeof value === "number") {
            cell.numFmt = "#,##0.00";
          } else if (
            typeof value === "string" &&
            !isNaN(Number(value)) &&
            value.trim() !== ""
          ) {
            cell.value = Number(value);
            cell.numFmt = "#,##0.00";
          }
        }
      });

    };

    // Add P&L data rows - Left side (Expenditure) and Right side (Income)

    // Opening Stock (Left)
    addDataRow(
      "To Opening Stock",
      getValue("openingStock_2023"),
      getValue("openingStock_2024"),
      getValue("openingStockEstimated"),
      "",
      "",
      "",
      ""
    );

    // Sales (Right)
    addDataRow(
      "",
      "",
      "",
      "",
      "By Sales",
      getValue("sales_2023"),
      getValue("sales_2024"),
      getValue("salesEstimated")
    );

    // Purchases (Left)
    addDataRow(
      "To Purchases",
      getValue("purchases_2023"),
      getValue("purchases_2024"),
      getValue("purchasesEstimated"),
      "",
      "",
      "",
      ""
    );

    // Majuri Charges (Right)
    addDataRow(
      "",
      "",
      "",
      "",
      "To Majuri Charges",
      getValue("majuriCharges_2023"),
      getValue("majuriCharges_2024"),
      getValue("majuriChargesEstimated")
    );


    // Closing Stock (Right)
    addDataRow(
      "",
      "",
      "",
      "",
      "By Closing Stock",
      getValue("closingStock_2023"),
      getValue("closingStock_2024"),
      getValue("closingStockEstimated")
    );

    // Gas & Liquid Items (Left)
    addDataRow(
      "To Gas & Liquid Items",
      getValue("gasLiquidItems_2023"),
      getValue("gasLiquidItems_2024"),
      getValue("gasLiquidItemsEstimated"),
      "",
      "",
      "",
      ""
    );

    // Gross Profit (Left)
    addDataRow(
      "To Gross Profit",
      getValue("grossProfit_2023"),
      getValue("grossProfit_2024"),
      getValue("grossProfitEstimated"),
      "",
      "",
      "",
      "",
      true
    );

    // Empty row
    addDataRow("", "", "", "", "", "", "", "");

    // Indirect Expenses (Left side)
    addDataRow(
      "To Salaries",
      getValue("salaries_2023"),
      getValue("salaries_2024"),
      getValue("salariesEstimated"),
     "By Gross Profit",
      getValue("grossProfit_2023"),
      getValue("grossProfit_2024"),
      getValue("grossProfitEstimated")
    );
 

    addDataRow(
      "To Bonus",
      getValue("bonus_2023"),
      getValue("bonus_2024"),
      getValue("bonusEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Shop Rents",
      getValue("shopRents_2023"),
      getValue("shopRents_2024"),
      getValue("shopRentsEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Electricity Charges",
      getValue("electricityCharges_2023"),
      getValue("electricityCharges_2024"),
      getValue("electricityChargesEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Coal, Gas & Liquid",
      getValue("coalGasLiquid_2023"),
      getValue("coalGasLiquid_2024"),
      getValue("coalGasLiquidEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Spares & Machinery",
      getValue("sparesMachinery_2023"),
      getValue("sparesMachinery_2024"),
      getValue("sparesMachineryEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Bank Interest",
      getValue("bankInterest_2023"),
      getValue("bankInterest_2024"),
      getValue("bankInterestEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Bank Charges",
      getValue("bankCharges_2023"),
      getValue("bankCharges_2024"),
      getValue("bankChargesEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Finance Charges/Professional Tax",
      getValue("financeCharges_2023"),
      getValue("financeCharges_2024"),
      getValue("financeChargesEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To GST Late Fee",
      getValue("gstLateFee_2023"),
      getValue("gstLateFee_2024"),
      getValue("gstLateFeeEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Auditor Fee",
      getValue("auditorFee_2023"),
      getValue("auditorFee_2024"),
      getValue("auditorFeeEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Telephone Charges",
      getValue("telephoneCharges_2023"),
      getValue("telephoneCharges_2024"),
      getValue("telephoneChargesEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Travelling Exp/Transport",
      getValue("travellingExp_2023"),
      getValue("travellingExp_2024"),
      getValue("travellingExpEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Vehicle Maintenance & Machinery",
      getValue("vehicleMaintenance_2023"),
      getValue("vehicleMaintenance_2024"),
      getValue("vehicleMaintenanceEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Depreciation",
      getValue("depreciation_2023"),
      getValue("depreciation_2024"),
      getValue("depreciationEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Interest",
      getValue("interest_2023"),
      getValue("interest_2024"),
      getValue("interestEstimated"),
      "",
      "",
      "",
      ""
    );

    addDataRow(
      "To Sadar",
      getValue("sadar_2023"),
      getValue("sadar_2024"),
      getValue("sadarEstimated"),
      "",
      "",
      "",
      ""
    );

    // Empty row
    addDataRow("", "", "", "", "", "", "", "");

    // Net Profit (Right)
    addDataRow(
      "To Net Profit",
      getValue("netProfit_2023"),
      getValue("netProfit_2024"),
      getValue("netProfitEstimated"),
      "",
      "",
      "",
      "",
      true
    );

    // Net Profit (Right)
    addDataRow(
      "Total",
      getValue("total_2023_left"),
      getValue("total_2024_left"),
      getValue("total_estimated_left"),
      "",
      getValue("total_2023_right"),
      getValue("total_2024_right"),
      getValue("total_estimated_right"),
      true
    );

    // Empty rows before monthly calculations
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Monthly Calculations Section
    const monthlyHeaderRow = worksheet.addRow([
      "Monthly Calculations",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    const monthlyHeaderRowNum = monthlyHeaderRow.number;
    worksheet.mergeCells(`A${monthlyHeaderRowNum}:B${monthlyHeaderRowNum}`);
    monthlyHeaderRow.getCell(1).font = { bold: true, size: 12 };
    monthlyHeaderRow.getCell(1).alignment = { horizontal: "center" };
    monthlyHeaderRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };
    this.applyBorder(monthlyHeaderRow.getCell(1));

    const monthlyDataRow = worksheet.addRow([
      "Monthly Turnover",
      getValue("monthlyTurnover"),
    ]);

    monthlyDataRow.eachCell((cell, colNumber) => {
      if (colNumber === 1 || colNumber === 6) {
        cell.font = { bold: true };
      }
      this.applyBorder(cell);
      if (colNumber === 2 || colNumber === 7) {
        cell.alignment = { horizontal: "right" };
        if (cell.value && typeof cell.value === "number") {
          cell.numFmt = "#,##0.00";
        }
      }
    });

    const monthlyNetProfitRow = worksheet.addRow([
      "Monthly Net Profit",
      getValue("monthlyNetProfit"),
    ]);
    monthlyNetProfitRow.getCell(1).font = { bold: true };
    monthlyNetProfitRow.eachCell((cell, colNumber) => {
      this.applyBorder(cell);
      if (colNumber === 2) {
        cell.alignment = { horizontal: "right" };
        if (cell.value && typeof cell.value === "number") {
          cell.numFmt = "#,##0.00";
        }
      }
    });

    const monthlyPaymentsRow = worksheet.addRow([
      "Monthly Payments",
      getValue("monthlyPayments"),
    ]);
    monthlyPaymentsRow.getCell(1).font = { bold: true };
    monthlyPaymentsRow.eachCell((cell, colNumber) => {
      this.applyBorder(cell);
      if (colNumber === 2) {
        cell.alignment = { horizontal: "right" };
        if (cell.value && typeof cell.value === "number") {
          cell.numFmt = "#,##0.00";
        }
      }
    });

    // Empty rows before margin percentages
    worksheet.addRow([]);

    // Margin Percentages Section
    const marginHeaderRow = worksheet.addRow([
      "Margin Percentages",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    const marginHeaderRowNum = marginHeaderRow.number;
    worksheet.mergeCells(`A${marginHeaderRowNum}:B${marginHeaderRowNum}`);
    marginHeaderRow.getCell(1).font = { bold: true, size: 12 };
    marginHeaderRow.getCell(1).alignment = { horizontal: "center" };
    marginHeaderRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };
    this.applyBorder(marginHeaderRow.getCell(1));

    const marginDataRow = worksheet.addRow([
      "Gross Profit %",
      getValue("gpPercentage"),
    ]);
    marginDataRow.eachCell((cell, colNumber) => {
      if (colNumber === 1 || colNumber === 6) {
        cell.font = { bold: true };
      }
      this.applyBorder(cell);
      if (colNumber === 2 || colNumber === 7) {
        cell.alignment = { horizontal: "right" };
        if (cell.value && typeof cell.value === "number") {
          cell.numFmt = "0.00";
        }
      }
    });
    const marginNetProfitRow = worksheet.addRow([
      "Net Profit %",
      getValue("npPercentage"),
    ]);
    marginNetProfitRow.getCell(1).font = { bold: true };
    marginNetProfitRow.eachCell((cell, colNumber) => {
      this.applyBorder(cell);
      if (colNumber === 2) {
        cell.alignment = { horizontal: "right" };
        if (cell.value && typeof cell.value === "number") {
          cell.numFmt = "0.00";
        }
      }
    });

    await this.addSignature(workbook, worksheet);
    return await this.finalizeWorkbook(workbook, loan.id);
  }

  /**
   * GP/PBDIT Format - Detailed Financial Analysis with Balance Sheet
   */
  private async generateGpPbditFormat(
    ExcelJS: any,
    financialAnalysis: any,
    loan: any
  ): Promise<Buffer> {
    console.log("financialAnalysis", financialAnalysis);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Financial Analysis");

    // Set up columns for P&L and Balance Sheet side by side
    worksheet.columns = [
      { width: 25 }, // A - Particulars (left)
      { width: 12 }, // B - Assessed/Estimated
      { width: 25 }, // C - Particulars (right)
      { width: 12 }, // D - Estimated
    ];

    // Helper function to get value safely
    const getValue = (key: string): any => {
      if (!key) return "";
      const value = financialAnalysis[key];
      if (value === null || value === undefined || value === "") return "";
      return value;
    };

    // Helper function to get nested value from balanceSheet
    const getBalanceSheetValue = (key: string): any => {
      if (!financialAnalysis.balanceSheet) return "";
      const value = financialAnalysis.balanceSheet[key];
      if (value === null || value === undefined || value === "") return "";
      // Handle nested objects - return empty string for now as they need special handling
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return "";
      }
      // Handle string numbers
      if (
        typeof value === "string" &&
        !isNaN(Number(value)) &&
        value.trim() !== ""
      ) {
        return Number(value);
      }
      return value;
    };

    // Title
    const titleRow = worksheet.addRow([
      `M/s. ${financialAnalysis.businessName || loan.applicantName || "XXX"}`,
    ]);
    worksheet.mergeCells("A1:D1");
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: "center" };

    // Partners row
    const partnerRow = worksheet.addRow([
      `Partners : ${financialAnalysis.partnersNames || "XXX"}`,
    ]);
    worksheet.mergeCells("A2:D2");
    partnerRow.font = { bold: true, size: 11 };
    partnerRow.alignment = { horizontal: "center" };

    // Subtitle
    const subTitleRow = worksheet.addRow([
      `Estimated Profit & Loss Account for the Year Ended 31st March ${this.getFinancialYearEndingYear()}`,
    ]);
    worksheet.mergeCells("A3:D3");
    subTitleRow.font = { bold: true };
    subTitleRow.alignment = { horizontal: "center" };

    // Headers for P&L
    const headerRow = worksheet.addRow([
      "PARTICULARS",
      "Assessed",
      "PARTICULARS",
      "Estimated",
    ]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      this.applyBorder(cell);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" },
      };
    });

    // Helper function to add a data row
    const addDataRow = (
      leftLabel: string,
      leftAssessed: string | number,
      rightLabel: string,
      rightEstimated: string | number,
      isBold = false
    ) => {
      const row = worksheet.addRow([
        leftLabel,
        leftAssessed,
        rightLabel,
        rightEstimated,
      ]);

      if (isBold) {
        row.font = { bold: true };
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF4B084" },
          };
        });
      }

      row.eachCell((cell) => {
        this.applyBorder(cell);
        cell.alignment = { vertical: "middle" };
      });

      // Format numeric columns (B, D)
      [2, 4].forEach((colNum) => {
        const cell = row.getCell(colNum);
        const value = cell.value;
        if (value !== null && value !== undefined && value !== "") {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
          };
          if (typeof value === "number") {
            cell.numFmt = "#,##0.00";
          } else if (
            typeof value === "string" &&
            !isNaN(Number(value)) &&
            value.trim() !== ""
          ) {
            cell.value = Number(value);
            cell.numFmt = "#,##0.00";
          }
        }
      });
    };

    // Add P&L data rows - Left side (Expenditure) and Right side (Income)

    addDataRow(
      "Expenditure",
      "",
      "INCOME",
      "",
      true
    );
    

    // Opening Stock (Left)
    addDataRow(
      "To Opening Stock",
      getValue("openingStockAssessed"),
      "",
      ""
    );

    // Sales (Right)
    addDataRow(
      "",
      "",
      "By Sales",
      getValue("salesEstimated")
    );

    // Purchases (Left)
    addDataRow(
      "To Purchases",
      getValue("purchasesAssessed"),
      "",
      ""
    );

    // Services (Right)
    addDataRow(
      "",
      "",
      "By Services",
      getValue("servicesEstimated")
    );

    // Closing Stock (Right)
    addDataRow(
      "",
      "",
      "By Closing Stock",
      getValue("closingStockEstimated")
    );

    // Gross Profit (Left - Assessed, Right - Estimated)
    addDataRow(
      "To Gross Profit",
      getValue("grossProfitAssessed"),
      "",
      ""
    );

    // Grand Total (Left)
    addDataRow(
      "Grand Total",
      getValue("grandTotalExpenditure"),
      "Grand Total",
      getValue("grandTotalIncome"),
      true
    );

    // Empty row
    addDataRow("To Indirect Expenditures", "", "By Gross Profit", getValue("byGrossProfitEstimated"));

    // Indirect Expenses (Left side)
    addDataRow(
      "To Electricity",
      getValue("electricity"),
      "",
      ""
    );

    addDataRow("To Rent", getValue("rent"), "", "");

    addDataRow("To Salaries", getValue("salaries"), "", "");

    addDataRow(
      "To Travelling Charges",
      getValue("travellingCharges"),
      "",
      ""
    );

    addDataRow(
      "To Other Expenses",
      getValue("otherExpenses"),
      "",
      ""
    );

    // Empty row
    addDataRow("", "", "", "");

    // Net Profit (Right)
    addDataRow(
      "To Net Profit",
      getValue("netProfit"),
      "",
      "",
      true
    );
    addDataRow(
      "Total",
      getValue("byGrossProfitEstimated"),
      "",
      getValue("byGrossProfitEstimated"),
      true
    );

    // Empty rows before Balance Sheet
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Balance Sheet title directly above balance sheet table
    const balanceSheetTitleRowNumber = worksheet.lastRow.number + 1;
    worksheet.getCell(`A${balanceSheetTitleRowNumber}`).value =
      `Balance Sheet as on 31st March 2024`;
    worksheet.mergeCells(
      `A${balanceSheetTitleRowNumber}:D${balanceSheetTitleRowNumber}`
    );
    worksheet.getCell(`A${balanceSheetTitleRowNumber}`).font = {
      bold: true,
      size: 12,
    };
    worksheet.getCell(`A${balanceSheetTitleRowNumber}`).alignment = {
      horizontal: "center",
    };

    const balanceSheetPartnerRowNumber = balanceSheetTitleRowNumber + 1;
    worksheet.getCell(`A${balanceSheetPartnerRowNumber}`).value = `${
      financialAnalysis.partnersNames || "XXX"
    }`;
    worksheet.mergeCells(
      `A${balanceSheetPartnerRowNumber}:D${balanceSheetPartnerRowNumber}`
    );
    worksheet.getCell(`A${balanceSheetPartnerRowNumber}`).font = { bold: true };
    worksheet.getCell(`A${balanceSheetPartnerRowNumber}`).alignment = {
      horizontal: "center",
    };

    // Balance Sheet Section - Liabilities (Left) and Assets (Right)

    // Balance Sheet Headers
    const balanceSheetHeaderRow = worksheet.addRow([
      "LIABILITIES",
      "Estimated",
      "ASSETS",
      "Estimated",
    ]);
    balanceSheetHeaderRow.font = { bold: true, size: 12 };
    balanceSheetHeaderRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    balanceSheetHeaderRow.eachCell((cell, colNumber) => {
      if (colNumber) {
        this.applyBorder(cell);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD9E1F2" },
        };
      }
    });
    // worksheet.mergeCells(
    //   `A${balanceSheetHeaderRow.number}:E${balanceSheetHeaderRow.number}`
    // );
    // worksheet.mergeCells(
    //   `F${balanceSheetHeaderRow.number}:J${balanceSheetHeaderRow.number}`
    // );

    // Liabilities (Left side)
    addDataRow(
      "Capital Account",
      getBalanceSheetValue("capitalAccount"),
      "",
      ""
    );

    addDataRow(
      "Sundry Creditors",
      getBalanceSheetValue("sundryCreditors"),
      "",
      ""
    );

    addDataRow(
      "Provisions",
      getBalanceSheetValue("provisions"),
      "",
      ""
    );

    addDataRow(
      "Audit Payable",
      getBalanceSheetValue("auditPayable"),
      "",
      ""
    );

    addDataRow(
      "Accountant Fees",
      getBalanceSheetValue("accountantFees"),
      "",
      ""
    );

    addDataRow(
      "New Loan",
      getBalanceSheetValue("newLoan"),
      "",
      ""
    );

    // Assets (Right side)
    addDataRow(
      "",
      "",
      "Loans and Advances",
      getBalanceSheetValue("loansAndAdvances")
    );

    addDataRow(
      "",
      "",
      "Current Assets",
      getBalanceSheetValue("currentAssets")
    );

    addDataRow(
      "",
      "",
      "GST Refund",
      getBalanceSheetValue("gstRefund")
    );

    addDataRow(
      "",
      "",
      "GST Set Off",
      getBalanceSheetValue("gstSetOff")
    );

    addDataRow(
      "",
      "",
      "DCB Bank",
      getBalanceSheetValue("dcbBank")
    );

    addDataRow(
      "",
      "",
      "Cash in Hand",
      getBalanceSheetValue("cashInHand")
    );

    addDataRow(
      "",
      "",
      "Additional Property",
      getBalanceSheetValue("additionalProperty")
    );

    // Empty rows before payment calculations
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Payment Calculations Section
    const paymentHeaderRow = worksheet.addRow([
      "Payment Calculations",
      "",
      "",
      "",
    ]);
    const paymentHeaderRowNum = paymentHeaderRow.number;
    worksheet.mergeCells(`A${paymentHeaderRowNum}:D${paymentHeaderRowNum}`);
    paymentHeaderRow.getCell(1).font = { bold: true, size: 12 };
    paymentHeaderRow.getCell(1).alignment = { horizontal: "center" };
    paymentHeaderRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };
    this.applyBorder(paymentHeaderRow.getCell(1));

    const totalPaymentsRow = worksheet.addRow([
      "Total Payments",
      getValue("totalPayments"),
      "",
      "",
    ]);
    totalPaymentsRow.getCell(1).font = { bold: true };
    totalPaymentsRow.eachCell((cell, colNumber) => {
      this.applyBorder(cell);
      if (colNumber === 2) {
        cell.alignment = { horizontal: "right" };
        if (cell.value && typeof cell.value === "number") {
          cell.numFmt = "#,##0.00";
        }
      }
    });

    // Empty rows before margins
    worksheet.addRow([]);

    // Margin Percentages Section
    const marginHeaderRow = worksheet.addRow([
      "Margin Percentages",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    const marginHeaderRowNum = marginHeaderRow.number;
    worksheet.mergeCells(`A${marginHeaderRowNum}:D${marginHeaderRowNum}`);
    marginHeaderRow.getCell(1).font = { bold: true, size: 12 };
    marginHeaderRow.getCell(1).alignment = { horizontal: "center" };
    marginHeaderRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };
    this.applyBorder(marginHeaderRow.getCell(1));

    const gpMarginRow = worksheet.addRow([
      "GP Margin %",
      "",
      "",
      getValue("gpMargin"),
    ]);
    gpMarginRow.getCell(1).font = { bold: true };
    gpMarginRow.eachCell((cell, colNumber) => {
      this.applyBorder(cell);
      if (colNumber === 4) {
        cell.alignment = { horizontal: "right" };
        if (cell.value && typeof cell.value === "number") {
          cell.numFmt = "0.00";
        }
      }
    });

    const npMarginRow = worksheet.addRow([
      "NP Margin %",
      "",
      "",
      getValue("npMargin"),
    ]);
    npMarginRow.getCell(1).font = { bold: true };
    npMarginRow.eachCell((cell, colNumber) => {
      this.applyBorder(cell);
      if (colNumber === 4) {
        cell.alignment = { horizontal: "right" };
        if (cell.value && typeof cell.value === "number") {
          cell.numFmt = "0.00";
        }
      }
    });

    const netProfitMarginRow = worksheet.addRow([
      "Net Profit Margin",
      "",
      "",
      getValue("netProfitMargin"),
    ]);
    netProfitMarginRow.getCell(1).font = { bold: true };
    netProfitMarginRow.eachCell((cell, colNumber) => {
      this.applyBorder(cell);
      if (colNumber === 4) {
        cell.alignment = { horizontal: "right" };
        if (cell.value && typeof cell.value === "number") {
          cell.numFmt = "#,##0.00";
        }
      }
    });

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
    const worksheet = workbook.addWorksheet("Financial Analysis");

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
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF4B084" },
        };
      });
    }
    row.eachCell((cell: any) => {
      this.applyBorder(cell);
      cell.alignment = { vertical: "middle" };
    });
    if (row.getCell(2).value && typeof row.getCell(2).value === "number") {
      row.getCell(2).alignment = { horizontal: "right", vertical: "middle" };
      row.getCell(2).numFmt = "#,##0.00";
    }
  }

  private applyBorder(cell: any): void {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  }

  private async addSignature(workbook: any, worksheet: any): Promise<void> {
    try {
      const signaturePath = path.resolve(
        process.cwd(),
        process.env.SIGNATURE_PATH || ""
      );
      if (fs.existsSync(signaturePath)) {
        worksheet.addRow([]);
        worksheet.addRow([]);
        const lastRowNumber = worksheet.lastRow.number + 1;

        const imageBuffer = fs.readFileSync(signaturePath);
        const imageId = workbook.addImage({
          buffer: imageBuffer as any,
          extension: "jpeg",
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
      console.warn("Failed to add signature:", error.message);
    }
  }

  private async finalizeWorkbook(
    workbook: any,
    loanId: number
  ): Promise<Buffer> {
    const buffer = await workbook.xlsx.writeBuffer();
    await this.loggingService.info(
      "Financial analysis exported to Excel successfully",
      { loanId }
    );
    return Buffer.from(buffer);
  }
}
