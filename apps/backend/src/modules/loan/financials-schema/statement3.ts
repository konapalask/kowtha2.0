export const statement3Schema = {
    id: "financialAnalysisComprehensive",
    label: "Comprehensive Actuals vs Estimated Analysis",
    schema: {
        type: "object",
        properties: {
            // Header Information
            synopsis: { type: "string", title: "Synopsis of the verification" },
            businessName: { type: "string", title: "Business Name" },

            // Opening Stock
            openingStock_2023: { type: "number", title: "Opening Stock - Actuals as on 31/03/23" },
            openingStock_2024: { type: "number", title: "Opening Stock - Actuals as on 31/03/24" },
            openingStockChange: { 
                type: "number", 
                title: "Opening Stock - Change %", 
                formula: "((openingStock_2024 - openingStock_2023) / openingStock_2023) * 100" 
            },
            openingStockEstimated: { type: "number", title: "Opening Stock - Estimated" },

            // Purchases
            purchases_2023: { type: "number", title: "Purchases - Actuals as on 31/03/23" },
            purchases_2024: { type: "number", title: "Purchases - Actuals as on 31/03/24" },
            purchasesChange: { 
                type: "number", 
                title: "Purchases - Change %", 
                formula: "((purchases_2024 - purchases_2023) / purchases_2023) * 100" 
            },
            purchasesEstimated: { type: "number", title: "Purchases - Estimated" },

            // Gas & Liquid Items
            gasLiquidItems_2023: { type: "number", title: "Gas & Liquid Items - Actuals as on 31/03/23" },
            gasLiquidItems_2024: { type: "number", title: "Gas & Liquid Items - Actuals as on 31/03/24" },
            gasLiquidItemsChange: { 
                type: "number", 
                title: "Gas & Liquid Items - Change %", 
                formula: "((gasLiquidItems_2024 - gasLiquidItems_2023) / gasLiquidItems_2023) * 100" 
            },
            gasLiquidItemsEstimated: { type: "number", title: "Gas & Liquid Items - Estimated" },

            // Gross Profit
            grossProfit_2023: { type: "number", title: "Gross Profit - Actuals as on 31/03/23" },
            grossProfit_2024: { type: "number", title: "Gross Profit - Actuals as on 31/03/24" },
            grossProfitChange: { 
                type: "number", 
                title: "Gross Profit - Change %", 
                formula: "((grossProfit_2024 - grossProfit_2023) / grossProfit_2023) * 100" 
            },
            grossProfitEstimated: { type: "number", title: "Gross Profit - Estimated" },

            // Sales (Income Side)
            sales_2023: { type: "number", title: "Sales - Actuals as on 31/03/23" },
            sales_2024: { type: "number", title: "Sales - Actuals as on 31/03/24" },
            salesChange: { 
                type: "number", 
                title: "Sales - Change %", 
                formula: "((sales_2024 - sales_2023) / sales_2023) * 100" 
            },
            salesEstimated: { type: "number", title: "Sales - Estimated" },

            // Majuri Charges
            majuriCharges_2023: { type: "number", title: "Majuri Charges - Actuals as on 31/03/23" },
            majuriCharges_2024: { type: "number", title: "Majuri Charges - Actuals as on 31/03/24" },
            majuriChargesChange: { 
                type: "number", 
                title: "Majuri Charges - Change %", 
                formula: "((majuriCharges_2024 - majuriCharges_2023) / majuriCharges_2023) * 100" 
            },
            majuriChargesEstimated: { type: "number", title: "Majuri Charges - Estimated" },

            // Closing Stock
            closingStock_2023: { type: "number", title: "Closing Stock - Actuals as on 31/03/23" },
            closingStock_2024: { type: "number", title: "Closing Stock - Actuals as on 31/03/24" },
            closingStockChange: { 
                type: "number", 
                title: "Closing Stock - Change %", 
                formula: "((closingStock_2024 - closingStock_2023) / closingStock_2023) * 100" 
            },
            closingStockEstimated: { type: "number", title: "Closing Stock - Estimated" },

            // Indirect Expenses (Estimated Only)
            salariesEstimated: { type: "number", title: "Salaries - Estimated" },
            bonusEstimated: { type: "number", title: "Bonus - Estimated" },
            electricityChargesEstimated: { type: "number", title: "Electricity Charges - Estimated" },
            sadarEstimated: { type: "number", title: "Sadar - Estimated" },
            coalGasLiquidEstimated: { type: "number", title: "Coal, Gas & Liquid - Estimated" },
            sparesMachineryEstimated: { type: "number", title: "Spares & Machinery - Estimated" },
            bankInterestEstimated: { type: "number", title: "Bank Interest - Estimated" },
            bankChargesEstimated: { type: "number", title: "Bank Charges - Estimated" },
            financeChargesEstimated: { type: "number", title: "Finance Charges/Professional Tax - Estimated" },
            shopRentsEstimated: { type: "number", title: "Shop Rents - Estimated" },
            gstLateFeeEstimated: { type: "number", title: "GST Late Fee - Estimated" },
            auditorFeeEstimated: { type: "number", title: "Auditor Fee - Estimated" },
            telephoneChargesEstimated: { type: "number", title: "Telephone Charges - Estimated" },
            travellingExpEstimated: { type: "number", title: "Travelling Exp/Transport - Estimated" },
            vehicleMaintenanceEstimated: { type: "number", title: "Vehicle Maintenance & machinery - Estimated" },
            depreciationEstimated: { type: "number", title: "Depreciation - Estimated" },
            interestEstimated: { type: "number", title: "Interest - Estimated" },
            netProfitEstimated: { type: "number", title: "Net Profit - Estimated" },

            // Monthly Calculations
            monthlyTurnover: { 
                type: "number", 
                title: "Monthly Turnover", 
                formula: "salesEstimated / 12" 
            },
            monthlyPayments: { type: "number", title: "Monthly Payments" },
            monthlyNetProfit: { 
                type: "number", 
                title: "Monthly Net Profit", 
                formula: "netProfitEstimated / 12" 
            },

            // Margin Percentages
            gpPercentage: { 
                type: "number", 
                title: "Gross Profit %", 
                formula: "(grossProfitEstimated / salesEstimated) * 100" 
            },
            npPercentage: { 
                type: "number", 
                title: "Net Profit %", 
                formula: "(netProfitEstimated / salesEstimated) * 100" 
            },
        }
    }
} as const;

export default statement3Schema;

