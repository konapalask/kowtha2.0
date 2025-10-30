export const statement2Schema =
    {
        id: "financialAnalysis",
        label: "GP/PBDIT Financial Analysis",
        schema: {
            type: "object",
            properties: {
                grossReceipts: { type: "number", title: "Gross Receipts" },
                otherIncome: { type: "number", title: "Other Income" },
                incomeSubtotal: { type: "number", title: "Sub-total (Income)", formula: "grossReceipts + otherIncome" },

                // Cost Section
                costOfMaterialConsumed: { type: "number", title: "Cost of material consumed" },
                costToReceiptsPercentage: { type: "number", title: "Cost of material consumed to Receipts %" },

                // Gross Profit
                grossProfitAsPerAssumption: { type: "number", title: "Gross Profit as per assumption" },
                gpRatio: { type: "number", title: "GP ratio %" },

                // Expenditure
                salary: { type: "number", title: "Salary" },
                rent: { type: "number", title: "Rent" },
                electricity: { type: "number", title: "Electricity" },
                travelling: { type: "number", title: "Travelling" },
                otherExpenses: { type: "number", title: "Other Expenses" },
                expenditureSubtotal: { type: "number", title: "Sub-total (Expenditure)", formula: "salary + rent + electricity + travelling + otherExpenses" },

                // Net Profit before interest, tax & Depreciation
                netProfitBeforeInterestTaxDepreciation: { type: "number", title: "Net Profit before interest, tax & Depreciation", formula: "incomeSubtotal - expenditureSubtotal" },
                pbditMargin: { type: "number", title: "PBDIT Margin %", formula: "netProfitBeforeInterestTaxDepreciation / incomeSubtotal" },
                financeExpenses: { type: "number", title: "Finance Expenses" },

                // Net Profit before tax & Depreciation
                netProfitBeforeTaxDepreciation: { type: "number", title: "Net Profit before tax & Depreciation", formula: "netProfitBeforeInterestTaxDepreciation - financeExpenses" },
                depreciation: { type: "number", title: "Depreciation" },

                // Net Profit Before Tax
                netProfitBeforeTax: { type: "number", title: "Net Profit Before Tax", formula: "netProfitBeforeTaxDepreciation - depreciation" },
                incomeTax: { type: "number", title: "Income Tax" },

                // Net Profit After Tax
                netProfitAfterTax: { type: "number", title: "Net Profit After Tax", formula: "netProfitBeforeTax - incomeTax" },
                totalExpensesInclCostOfSales: { type: "number", title: "Total expenses including cost of sales", formula: "expenditureSubtotal + costOfMaterialConsumed + depreciation + financeExpenses + incomeTax" },
            }
        }
    } as const;

export default statement2Schema;


