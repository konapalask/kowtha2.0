export const statement4Schema = {
  id: "financialAnalysis",
  label: "Detailed Financial Analysis with Balance Sheet",
  schema: {
    type: "object",
    properties: {
      // Header Information
      synopsis: {
        type: "string",
        title: "Synopsis of the verification",
        ui: { widget: "textarea", rows: 3 },
      },
      businessName: { type: "string", title: "Business Name", readonly: true },
      partnersNames: {
        type: "string",
        title: "Partners Names",
        ui: { widget: "textarea", rows: 3 },
      },

      // Expenditure Section - with Audited Income and Assessed columns
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
      openingStockAudited: {
        type: "number",
        title: "Opening Stock - Audited Income",
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
      purchasesAudited: {
        type: "number",
        title: "Purchases - Audited Income",
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
        title: "Gross Profit - Assessed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grossProfitEstimated: {
        type: "number",
        title: "Gross Profit - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      grandTotal: {
        type: "number",
        title: "Grand Total",
        formula:
          "openingStockAssessed + purchasesAssessed + grossProfitAssessed",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Indirect Expenses
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
      salaries: {
        type: "number",
        title: "Salaries",
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
        title: "Travelling Charges",
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

      netProfit: {
        type: "number",
        title: "Net Profit",
        formula:
          "grossProfitEstimated - (electricity + rent + salaries + travellingCharges + otherExpenses)",
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
        title: "By Sales - Audited Income",
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
        title: "By Services - Audited Income",
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
        title: "By Closing Stock - Audited Income",
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

      byGrossProfitAudited: {
        type: "number",
        title: "By Gross Profit - Audited Income",
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
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Balance Sheet Section
      balanceSheet: {
        type: "object",
        title: "Balance Sheet",
        properties: {
          // Liabilities
          capitalAccount: {
            type: "number",
            title: "Capital Account",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          sundryCreditors: {
            type: "number",
            title: "Sundry Creditors",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          provisions: {
            type: "number",
            title: "Provisions",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          auditPayable: {
            type: "number",
            title: "Audit Payable",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          accountantFees: {
            type: "number",
            title: "Accountant Fees",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          newLoan: {
            type: "number",
            title: "New Loan",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },

          // Assets - Loans and Advances
          loansAndAdvances: {
            type: "object",
            title: "Loans and Advances",
            properties: {
              gcrumChaudhary: {
                type: "number",
                title: "GCRUM Chaudhary",
                minimum: 0,
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              mahadevTrading: {
                type: "number",
                title: "Mahadev Trading",
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

          // Assets - Current Assets
          currentAssets: {
            type: "object",
            title: "Current Assets",
            properties: {
              prepaidInsurance: {
                type: "number",
                title: "Prepaid Insurance",
                minimum: 0,
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              closingStock: {
                type: "number",
                title: "Closing Stock",
                minimum: 0,
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              sundryDebtors: {
                type: "number",
                title: "Sundry Debtors",
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

          // Other Assets
          gstRefund: {
            type: "number",
            title: "GST Refund",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          gstSetOff: {
            type: "number",
            title: "GST Set Off",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          dcbBank: {
            type: "number",
            title: "DCB Bank",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          cashInHand: {
            type: "number",
            title: "Cash in Hand",
            minimum: 0,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          additionalProperty: {
            type: "number",
            title: "Additional Property",
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

      // Payment Calculations
      totalPayments: {
        type: "number",
        title: "Total Payments",
        formula:
          "electricity + rent + salaries + travellingCharges + otherExpenses",
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
        title: "Net Profit Margin",
        formula: "netProfit",
        minimum: 0,
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
        title: "GP Margin %",
        formula: "(grossProfitEstimated / salesEstimated) * 100",
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
        title: "NP Margin %",
        formula: "(netProfit / salesEstimated) * 100",
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

export default statement4Schema;
