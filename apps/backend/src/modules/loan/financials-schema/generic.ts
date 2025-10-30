export const financialsSchema =
  {
    id: "financialAnalysis",
    label: "Financial Analysis",
    schema: {
      type: "object",
      properties: {
        // Debit side (To ...)
        openingStockActuals: { type: "string", title: "To Opening Stock - Actuals" },
        openingStockEstimations: {
          type: "string",
          title: "To Opening Stock - Estimations",
        },
        purchaseActuals: { type: "string", title: "To Purchase - Actuals" },
        purchaseEstimations: {
          type: "string",
          title: "To Purchase - Estimations",
        },
        costOfServicesActuals: {
          type: "string",
          title: "To Cost of Services - Actuals",
        },
        costOfServicesEstimations: {
          type: "string",
          title: "To Cost of Services - Estimations",
        },
        wagesActuals: { type: "string", title: "To Wages - Actuals" },
        wagesEstimations: { type: "string", title: "To Wages - Estimations" },
        hamaliChargesActuals: {
          type: "string",
          title: "To Hamali Charges - Actuals",
        },
        hamaliChargesEstimations: {
          type: "string",
          title: "To Hamali Charges - Estimations",
        },
        manufacturingExpensesActuals: {
          type: "string",
          title: "To Manufacturing Expenses - Actuals",
        },
        manufacturingExpensesEstimations: {
          type: "string",
          title: "To Manufacturing Expenses - Estimations",
        },
        packingChargesActuals: {
          type: "string",
          title: "To Packing Charges - Actuals",
        },
        packingChargesEstimations: {
          type: "string",
          title: "To Packing Charges - Estimations",
        },
        grossProfitDebitActuals: {
          type: "string",
          title: "To Gross Profit - Actuals",
        },
        grossProfitDebitEstimations: {
          type: "string",
          title: "To Gross Profit - Estimations",
        },
        salariesActuals: { type: "string", title: "To Salaries - Actuals" },
        salariesEstimations: {
          type: "string",
          title: "To Salaries - Estimations",
        },
        rentActuals: { type: "string", title: "To Rent - Actuals" },
        rentEstimations: { type: "string", title: "To Rent - Estimations" },
        electricityChargesActuals: {
          type: "string",
          title: "To Electricity Charges - Actuals",
        },
        electricityChargesEstimations: {
          type: "string",
          title: "To Electricity Charges - Estimations",
        },
        printingStationeryActuals: {
          type: "string",
          title: "To Printing & Stationery - Actuals",
        },
        printingStationeryEstimations: {
          type: "string",
          title: "To Printing & Stationery - Estimations",
        },
        telephoneChargesActuals: {
          type: "string",
          title: "To Telephone Charges - Actuals",
        },
        telephoneChargesEstimations: {
          type: "string",
          title: "To Telephone Charges - Estimations",
        },
        postageTelegramActuals: {
          type: "string",
          title: "To Postage & Telegram - Actuals",
        },
        postageTelegramEstimations: {
          type: "string",
          title: "To Postage & Telegram - Estimations",
        },
        officeMaintenanceActuals: {
          type: "string",
          title: "To Office Maintenance - Actuals",
        },
        officeMaintenanceEstimations: {
          type: "string",
          title: "To Office Maintenance - Estimations",
        },
        repairsMaintenanceActuals: {
          type: "string",
          title: "To Repairs & Maintenance - Actuals",
        },
        repairsMaintenanceEstimations: {
          type: "string",
          title: "To Repairs & Maintenance - Estimations",
        },
        sadarExpensesActuals: {
          type: "string",
          title: "To Sadar Expenses - Actuals",
        },
        sadarExpensesEstimations: {
          type: "string",
          title: "To Sadar Expenses - Estimations",
        },
        auditFeeActuals: { type: "string", title: "To Audit Fee - Actuals" },
        auditFeeEstimations: {
          type: "string",
          title: "To Audit Fee - Estimations",
        },
        advertisementActuals: {
          type: "string",
          title: "To Advertisement - Actuals",
        },
        advertisementEstimations: {
          type: "string",
          title: "To Advertisement - Estimations",
        },
        bankChargesActuals: {
          type: "string",
          title: "To Bank Charges - Actuals",
        },
        bankChargesEstimations: {
          type: "string",
          title: "To Bank Charges - Estimations",
        },
        insuranceActuals: { type: "string", title: "To Insurance - Actuals" },
        insuranceEstimations: {
          type: "string",
          title: "To Insurance - Estimations",
        },
        depreciationActuals: {
          type: "string",
          title: "To Depreciation - Actuals",
        },
        depreciationEstimations: {
          type: "string",
          title: "To Depreciation - Estimations",
        },
        interestOnLoanActuals: {
          type: "string",
          title: "To Interest on Loan - Actuals",
        },
        interestOnLoanEstimations: {
          type: "string",
          title: "To Interest on Loan - Estimations",
        },
        netProfitActuals: { type: "string", title: "To Net Profit - Actuals" },
        netProfitEstimations: {
          type: "string",
          title: "To Net Profit - Estimations",
        },

        // Credit side (By ...)
        salesActuals: { type: "string", title: "By Sales - Actuals" },
        salesEstimations: { type: "string", title: "By Sales - Estimations" },
        servicesActuals: { type: "string", title: "By Services - Actuals" },
        servicesEstimations: {
          type: "string",
          title: "By Services - Estimations",
        },
        closingStockActuals: {
          type: "string",
          title: "By Closing Stock - Actuals",
        },
        closingStockEstimations: {
          type: "string",
          title: "By Closing Stock - Estimations",
        },
        grossProfitCreditActuals: {
          type: "string",
          title: "By Gross Profit - Actuals",
        },
        grossProfitCreditEstimations: {
          type: "string",
          title: "By Gross Profit - Estimations",
        },
        rentReceivedActuals: {
          type: "string",
          title: "By Rent Received - Actuals",
        },
        rentReceivedEstimations: {
          type: "string",
          title: "By Rent Received - Estimations",
        },
        commissionReceivedActuals: {
          type: "string",
          title: "By Commission Received - Actuals",
        },
        commissionReceivedEstimations: {
          type: "string",
          title: "By Commission Received - Estimations",
        },
      },
    },
  } as const;

export default financialsSchema;
