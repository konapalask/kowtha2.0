export const statement4Schema = {
  id: "financialAnalysis",
  label: "Detailed Financial Analysis with Balance Sheet",
  schema: {
    type: "object",
    properties: {
      // Header Information
      // synopsis: {
      //   type: "string",
      //   title: "Synopsis of the verification",
      //   ui: { widget: "textarea", rows: 3 },
      // },
      businessName: { type: "string", title: "Business Name", readOnly: true },
      partnersNames: {
        type: "string",
        title: "Partners Names",
        ui: { widget: "textarea", rows: 3 },
      },

      // Expenditure Section - with Audited Income and Assessed columns
      openingStockAudited: {
        type: "number",
        title: "Opening Stock - Audited",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      openingStockAssessed: {
        type: "number",
        title: "Opening Stock - Assessed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      purchasesAudited: {
        type: "number",
        title: "Purchases - Audited",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      purchasesAssessed: {
        type: "number",
        title: "Purchases - Assessed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grossProfitAudited: {
        type: "number",
        title: "To Gross Profit - Audited",
        formula: "grandTotalIncomeAudited - (openingStockAudited + purchasesAudited)",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grossProfitAssessed: {
        type: "number",
        title: "To Gross Profit - Assessed",
        formula:
          "grandTotalIncome - (openingStockAssessed + purchasesAssessed)",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grandTotalExpenditureAudited: {
        type: "number",
        title: "Grand Total Expenditure - Audited",
        formula:
          "openingStockAudited + purchasesAudited + grossProfitAudited",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grandTotalExpenditure: {
        type: "number",
        title: "Grand Total Expenditure - Assessed",
        formula:
          "openingStockAssessed + purchasesAssessed + grossProfitAssessed",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Income Section
      salesAudited: {
        type: "number",
        title: "By Sales - Audited",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      salesEstimated: {
        type: "number",
        title: "By Sales - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      servicesAudited: {
        type: "number",
        title: "By Services - Audited",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      servicesEstimated: {
        type: "number",
        title: "By Services - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      closingStockAudited: {
        type: "number",
        title: "By Closing Stock - Audited",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      closingStockEstimated: {
        type: "number",
        title: "By Closing Stock - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grandTotalIncomeAudited: {
        type: "number",
        title: "Grand Total Income - Audited",
        formula: "salesAudited + servicesAudited + closingStockAudited",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grandTotalIncome: {
        type: "number",
        title: "Grand Total Income",
        formula: "salesEstimated + servicesEstimated + closingStockEstimated",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      byGrossProfitAudited: {
        type: "number",
        title: "By Gross Profit - Audited",
        formula: "grossProfitAudited",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      byGrossProfitEstimated: {
        type: "number",
        title: "By Gross Profit - Estimated",
        formula: "grossProfitAssessed",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Indirect Expenses
      electricityAudited: {
        type: "number",
        title: "Electricity - Audited",
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
        title: "Electricity - Assessed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      rentAudited: {
        type: "number",
        title: "Rent - Audited",
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
        title: "Rent - Assessed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      salariesAudited: {
        type: "number",
        title: "Salaries - Audited",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      salaries: {
        type: "number",
        title: "Salaries - Assessed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      travellingChargesAudited: {
        type: "number",
        title: "Travelling Charges - Audited",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      travellingCharges: {
        type: "number",
        title: "Travelling Charges - Assessed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      otherExpensesAudited: {
        type: "number",
        title: "Other Expenses - Audited",
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
        title: "Other Expenses - Assessed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      netProfitAudited: {
        type: "number",
        title: "Net Profit - Audited",
        formula: "byGrossProfitAudited - (electricityAudited + rentAudited + salariesAudited + travellingChargesAudited + otherExpensesAudited)",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      netProfit: {
        type: "number",
        title: "Net Profit - Assessed",
        formula:
          "byGrossProfitEstimated - (electricity + rent + salaries + travellingCharges + otherExpenses)",
        readOnly: true,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // // Balance Sheet Section
      // balanceSheet: {
      //   type: "object",
      //   title: "Balance Sheet",
      //   ui: { widget: "card", collapsible: true },
      //   properties: {
      //     // Liabilities
      //     capitalAccount: {
      //       type: "number",
      //       title: "Capital Account",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //     sundryCreditors: {
      //       type: "number",
      //       title: "Sundry Creditors",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //     provisions: {
      //       type: "number",
      //       title: "Provisions",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //     auditPayable: {
      //       type: "number",
      //       title: "Audit Payable",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //     accountantFees: {
      //       type: "number",
      //       title: "Accountant Fees",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //     newLoan: {
      //       type: "number",
      //       title: "New Loan",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },

      //     // Assets - Loans and Advances
      //     loansAndAdvances: {
      //       type: "number",
      //       title: "Loans and Advances",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },

      //     // Assets - Current Assets
      //     currentAssets: {
      //       type: "object",
      //       title: "Current Assets",
      //       properties: {
      //         prepaidInsurance: {
      //           type: "number",
      //           title: "Prepaid Insurance",
      //           minimum: 0,
      //           formatter: {
      //             useIndianFormat: true,
      //             locale: "en-IN",
      //             maxDecimalPlaces: 2,
      //             minDecimalPlaces: 0,
      //           },
      //         },
      //         closingStock: {
      //           type: "number",
      //           title: "Closing Stock",
      //           minimum: 0,
      //           formatter: {
      //             useIndianFormat: true,
      //             locale: "en-IN",
      //             maxDecimalPlaces: 2,
      //             minDecimalPlaces: 0,
      //           },
      //         },
      //         sundryDebtors: {
      //           type: "number",
      //           title: "Sundry Debtors",
      //           minimum: 0,
      //           formatter: {
      //             useIndianFormat: true,
      //             locale: "en-IN",
      //             maxDecimalPlaces: 2,
      //             minDecimalPlaces: 0,
      //           },
      //         },
      //       },
      //     },

      //     // Other Assets
      //     gstRefund: {
      //       type: "number",
      //       title: "GST Refund",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //     gstSetOff: {
      //       type: "number",
      //       title: "GST Set Off",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //     dcbBank: {
      //       type: "number",
      //       title: "DCB Bank",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //     cashInHand: {
      //       type: "number",
      //       title: "Cash in Hand",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //     additionalProperty: {
      //       type: "number",
      //       title: "Additional Property",
      //       minimum: 0,
      //       formatter: {
      //         useIndianFormat: true,
      //         locale: "en-IN",
      //         maxDecimalPlaces: 2,
      //         minDecimalPlaces: 0,
      //       },
      //     },
      //   },
      // },

      // Payment Calculations
      totalPayments: {
        type: "number",
        title: "Total Payments",
        formula: "(salesEstimated + servicesEstimated - netProfit) / 12",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      netProfitMargin: {
        type: "number",
        title: "Net Profit",
        formula: "netProfit / 12",
        readOnly: true,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Margin Percentages
      gpMargin: {
        type: "number",
        title: "GP Margin",
        formula: "grossProfitAssessed / salesEstimated",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      npMargin: {
        type: "number",
        title: "NP Margin",
        formula: "netProfit / (salesEstimated + servicesEstimated)",
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
    // Debit side (expenses/costs) - Left column
    debit: [
      "openingStockAudited",
      "openingStockAssessed",
      "purchasesAudited",
      "purchasesAssessed",
      "grossProfitAudited",
      "grossProfitAssessed",
      "grandTotalExpenditureAudited",
      "grandTotalExpenditure",
      "electricityAudited",
      "electricity",
      "rentAudited",
      "rent",
      "salariesAudited",
      "salaries",
      "travellingChargesAudited",
      "travellingCharges",
      "otherExpensesAudited",
      "otherExpenses",
      "netProfitAudited",
      "netProfit",
    ],
    // Credit side (income/receipts) - Right column
    credit: [
      "salesAudited",
      "salesEstimated",
      "servicesAudited",
      "servicesEstimated",
      "closingStockAudited",
      "closingStockEstimated",
      "grandTotalIncomeAudited",
      "grandTotalIncome",
      "byGrossProfitAudited",
      "byGrossProfitEstimated",
    ],
  },
} as const;

export default statement4Schema;
