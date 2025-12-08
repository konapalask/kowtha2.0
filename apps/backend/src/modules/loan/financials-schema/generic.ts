export const financialsSchema = {
  id: "financialAnalysis",
  label: "Financial Analysis",
  schema: {
    type: "object",
    properties: {
      // Debit side (To ...)
      openingStock: {
        type: "number",
        title: "To Opening Stock",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      purchase: {
        type: "number",
        title: "To Purchase",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      costOfServices: {
        type: "number",
        title: "To Cost of Services",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      wages: {
        type: "number",
        title: "To Wages",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      hamaliCharges: {
        type: "number",
        title: "To Hamali Charges",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      manufacturingExpenses: {
        type: "number",
        title: "To Manufacturing Expenses",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      packingCharges: {
        type: "number",
        title: "To Packing Charges",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grossProfitDebit: {
        type: "number",
        title: "To Gross Profit",
        formula: "(sales + services + closingStock) - (openingStock + purchase + costOfServices + wages + hamaliCharges + manufacturingExpenses + packingCharges)",
        readOnly: true,
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
        title: "To Salaries",
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
        title: "To Rent",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      electricityCharges: {
        type: "number",
        title: "To Electricity Charges",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      printingStationery: {
        type: "number",
        title: "To Printing & Stationery",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      telephoneCharges: {
        type: "number",
        title: "To Telephone Charges",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      postageTelegram: {
        type: "number",
        title: "To Postage & Telegram",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      officeMaintenance: {
        type: "number",
        title: "To Office Maintenance",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      repairsMaintenance: {
        type: "number",
        title: "To Repairs & Maintenance",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      sadarExpenses: {
        type: "number",
        title: "To Sadar Expenses",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      auditFee: {
        type: "number",
        title: "To Audit Fee",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      advertisement: {
        type: "number",
        title: "To Advertisement",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      bankCharges: {
        type: "number",
        title: "To Bank Charges",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      insurance: {
        type: "number",
        title: "To Insurance",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      depreciation: {
        type: "number",
        title: "To Depreciation",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      interestOnLoan: {
        type: "number",
        title: "To Interest on Loan",
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
        title: "To Net Profit",
        formula: "grossProfitDebit + rentReceived + commissionReceived - (salaries + rent + electricityCharges + printingStationery + telephoneCharges + postageTelegram + officeMaintenance + repairsMaintenance + sadarExpenses + auditFee + advertisement + bankCharges + insurance + depreciation + interestOnLoan)",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Credit side (By ...)
      sales: {
        type: "number",
        title: "By Sales",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      services: {
        type: "number",
        title: "By Services",
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
        title: "By Closing Stock",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grossProfitCredit: {
        type: "number",
        title: "By Gross Profit",
        formula: "grossProfitDebit",
        readOnly: true,
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      rentReceived: {
        type: "number",
        title: "By Rent Received",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      commissionReceived: {
        type: "number",
        title: "By Commission Received",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
    },
    
    debit: [
      // Opening Stock
      "openingStock",
      // Purchase
      "purchase",
      // Cost of Services
      "costOfServices",
      // Wages
      "wages",
      // Hamali Charges
      "hamaliCharges",
      // Manufacturing Expenses
      "manufacturingExpenses",
      // Packing Charges
      "packingCharges",
      // Gross Profit (Debit)
      "grossProfitDebit",
      // Salaries
      "salaries",
      // Rent
      "rent",
      // Electricity Charges
      "electricityCharges",
      // Printing & Stationery
      "printingStationery",
      // Telephone Charges
      "telephoneCharges",
      // Postage & Telegram
      "postageTelegram",
      // Office Maintenance
      "officeMaintenance",
      // Repairs & Maintenance
      "repairsMaintenance",
      // Sadar Expenses
      "sadarExpenses",
      // Audit Fee
      "auditFee",
      // Advertisement
      "advertisement",
      // Bank Charges
      "bankCharges",
      // Insurance
      "insurance",
      // Depreciation
      "depreciation",
      // Interest on Loan
      "interestOnLoan",
      // Net Profit
      "netProfit",
    ],
    credit: [
      // Sales
      "sales",
      // Services
      "services",
      // Closing Stock
      "closingStock",
      // Gross Profit (Credit)
      "grossProfitCredit",
      // Rent Received
      "rentReceived",
      // Commission Received
      "commissionReceived",
    ],
  },
} as const;

export default financialsSchema;