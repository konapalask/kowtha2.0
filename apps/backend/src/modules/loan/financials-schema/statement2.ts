export const statement2Schema = {
  id: "financialAnalysis",
  label: "GP/PBDIT Financial Analysis",
  schema: {
    type: "object",
    properties: {
      grossReceipts: {
        type: "number",
        title: "Gross Receipts",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      otherIncome: {
        type: "number",
        title: "Other Income",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      incomeSubtotal: {
        type: "number",
        title: "Sub-total (Income)",
        formula: "grossReceipts + otherIncome",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Cost Section
      costOfMaterialConsumed: {
        type: "number",
        title: "Cost of material consumed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      costToReceiptsPercentage: {
        type: "number",
        title: "Cost of material consumed to Receipts %",
        formula: "(costOfMaterialConsumed / incomeSubtotal) * 100",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Gross Profit
      grossProfitAsPerAssumption: {
        type: "number",
        title: "Gross Profit as per assumption",
        formula: "incomeSubtotal - costOfMaterialConsumed",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      gpRatio: {
        type: "number",
        title: "GP ratio %",
        formula: "(grossProfitAsPerAssumption / incomeSubtotal) * 100",
        readOnly: true,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Expenditure
      salary: {
        type: "number",
        title: "Salary",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      rent: {
        type: "number",
        title: "Rent",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      electricity: {
        type: "number",
        title: "Electricity",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      travelling: {
        type: "number",
        title: "Travelling",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      otherExpenses: {
        type: "number",
        title: "Other Expenses",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      expenditureSubtotal: {
        type: "number",
        title: "Sub-total (Expenditure)",
        formula: "salary + rent + electricity + travelling + otherExpenses",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Net Profit before interest, tax & Depreciation
      netProfitBeforeInterestTaxDepreciation: {
        type: "number",
        title: "Net Profit before interest, tax & Depreciation",
        formula: "grossProfitAsPerAssumption - expenditureSubtotal",
        readOnly: true,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      pbditMargin: {
        type: "number",
        title: "PBDIT Margin %",
        formula:
          "(netProfitBeforeInterestTaxDepreciation / incomeSubtotal) * 100",
        readOnly: true,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      financeExpenses: {
        type: "number",
        title: "Finance Expenses",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Net Profit before tax & Depreciation
      netProfitBeforeTaxDepreciation: {
        type: "number",
        title: "Net Profit before tax & Depreciation",
        formula: "netProfitBeforeInterestTaxDepreciation - financeExpenses",
        readOnly: true,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      depreciation: {
        type: "number",
        title: "Depreciation",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Net Profit Before Tax
      netProfitBeforeTax: {
        type: "number",
        title: "Net Profit Before Tax",
        formula: "netProfitBeforeTaxDepreciation - depreciation",
        readOnly: true,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      incomeTax: {
        type: "number",
        title: "Income Tax",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Net Profit After Tax
      netProfitAfterTax: {
        type: "number",
        title: "Net Profit After Tax",
        formula: "netProfitBeforeTax - incomeTax",
        readOnly: true,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      totalExpensesInclCostOfSales: {
        type: "number",
        title: "Total expenses including cost of sales",
        formula: "costOfMaterialConsumed + expenditureSubtotal",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
    },
  },
} as const;

export default statement2Schema;
