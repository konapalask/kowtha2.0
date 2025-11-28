export const statement3Schema = {
  id: "financialAnalysis",
  label: "Comprehensive Actuals vs Estimated Analysis",
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

      // Opening Stock
      openingStock_2023: {
        type: "number",
        title: "Opening Stock - Actuals as on 31/03/23",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      openingStock_2024: {
        type: "number",
        title: "Opening Stock - Actuals as on 31/03/24",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      openingStockChange: {
        type: "number",
        title: "Opening Stock - Change %",
        formula:
          "((openingStock_2024 - openingStock_2023) / openingStock_2023) * 100",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      openingStockEstimated: {
        type: "number",
        title: "Opening Stock - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Purchases
      purchases_2023: {
        type: "number",
        title: "Purchases - Actuals as on 31/03/23",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      purchases_2024: {
        type: "number",
        title: "Purchases - Actuals as on 31/03/24",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      purchasesChange: {
        type: "number",
        title: "Purchases - Change %",
        formula: "((purchases_2024 - purchases_2023) / purchases_2023) * 100",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      purchasesEstimated: {
        type: "number",
        title: "Purchases - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Gas & Liquid Items
      gasLiquidItems_2023: {
        type: "number",
        title: "Gas & Liquid Items - Actuals as on 31/03/23",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      gasLiquidItems_2024: {
        type: "number",
        title: "Gas & Liquid Items - Actuals as on 31/03/24",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      gasLiquidItemsChange: {
        type: "number",
        title: "Gas & Liquid Items - Change %",
        formula:
          "((gasLiquidItems_2024 - gasLiquidItems_2023) / gasLiquidItems_2023) * 100",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      gasLiquidItemsEstimated: {
        type: "number",
        title: "Gas & Liquid Items - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Gross Profit
      grossProfit_2023: {
        type: "number",
        title: "Gross Profit - Actuals as on 31/03/23",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grossProfit_2024: {
        type: "number",
        title: "Gross Profit - Actuals as on 31/03/24",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      grossProfitChange: {
        type: "number",
        title: "Gross Profit - Change %",
        formula:
          "((grossProfit_2024 - grossProfit_2023) / grossProfit_2023) * 100",
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

      // Sales (Income Side)
      sales_2023: {
        type: "number",
        title: "Sales - Actuals as on 31/03/23",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      sales_2024: {
        type: "number",
        title: "Sales - Actuals as on 31/03/24",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      salesChange: {
        type: "number",
        title: "Sales - Change %",
        formula: "((sales_2024 - sales_2023) / sales_2023) * 100",
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
        title: "Sales - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Majuri Charges
      majuriCharges_2023: {
        type: "number",
        title: "Majuri Charges - Actuals as on 31/03/23",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      majuriCharges_2024: {
        type: "number",
        title: "Majuri Charges - Actuals as on 31/03/24",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      majuriChargesChange: {
        type: "number",
        title: "Majuri Charges - Change %",
        formula:
          "((majuriCharges_2024 - majuriCharges_2023) / majuriCharges_2023) * 100",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      majuriChargesEstimated: {
        type: "number",
        title: "Majuri Charges - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Closing Stock
      closingStock_2023: {
        type: "number",
        title: "Closing Stock - Actuals as on 31/03/23",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      closingStock_2024: {
        type: "number",
        title: "Closing Stock - Actuals as on 31/03/24",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      closingStockChange: {
        type: "number",
        title: "Closing Stock - Change %",
        formula:
          "((closingStock_2024 - closingStock_2023) / closingStock_2023) * 100",
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
        title: "Closing Stock - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Indirect Expenses (Estimated Only)
      salariesEstimated: {
        type: "number",
        title: "Salaries - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      bonusEstimated: {
        type: "number",
        title: "Bonus - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      electricityChargesEstimated: {
        type: "number",
        title: "Electricity Charges - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      sadarEstimated: {
        type: "number",
        title: "Sadar - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      coalGasLiquidEstimated: {
        type: "number",
        title: "Coal, Gas & Liquid - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      sparesMachineryEstimated: {
        type: "number",
        title: "Spares & Machinery - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      bankInterestEstimated: {
        type: "number",
        title: "Bank Interest - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      bankChargesEstimated: {
        type: "number",
        title: "Bank Charges - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      financeChargesEstimated: {
        type: "number",
        title: "Finance Charges/Professional Tax - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      shopRentsEstimated: {
        type: "number",
        title: "Shop Rents - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      gstLateFeeEstimated: {
        type: "number",
        title: "GST Late Fee - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      auditorFeeEstimated: {
        type: "number",
        title: "Auditor Fee - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      telephoneChargesEstimated: {
        type: "number",
        title: "Telephone Charges - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      travellingExpEstimated: {
        type: "number",
        title: "Travelling Exp/Transport - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      vehicleMaintenanceEstimated: {
        type: "number",
        title: "Vehicle Maintenance & machinery - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      depreciationEstimated: {
        type: "number",
        title: "Depreciation - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      interestEstimated: {
        type: "number",
        title: "Interest - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      netProfitEstimated: {
        type: "number",
        title: "Net Profit - Estimated",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Monthly Calculations
      monthlyTurnover: {
        type: "number",
        title: "Monthly Turnover",
        formula: "salesEstimated / 12",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      monthlyPayments: {
        type: "number",
        title: "Monthly Payments",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      monthlyNetProfit: {
        type: "number",
        title: "Monthly Net Profit",
        formula: "netProfitEstimated / 12",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },

      // Margin Percentages
      gpPercentage: {
        type: "number",
        title: "Gross Profit %",
        formula: "(grossProfitEstimated / salesEstimated) * 100",
        minimum: 0,
        formatter: {
          useIndianFormat: true,
          locale: "en-IN",
          maxDecimalPlaces: 2,
          minDecimalPlaces: 0,
        },
      },
      npPercentage: {
        type: "number",
        title: "Net Profit %",
        formula: "(netProfitEstimated / salesEstimated) * 100",
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

export default statement3Schema;
