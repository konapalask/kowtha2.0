export const statement4Schema = {
    id: "financialAnalysisDetailed",
    label: "Detailed Financial Analysis with Balance Sheet",
    schema: {
        type: "object",
        properties: {
            // Header Information
            synopsis: { type: "string", title: "Synopsis of the verification" },
            businessName: { type: "string", title: "Business Name" },
            partnersNames: { type: "string", title: "Partners Names" },

            // Expenditure Section - with Audited Income and Assessed columns
            openingStockAssessed: { type: "number", title: "Opening Stock - Assessed" },
            openingStockAudited: { type: "number", title: "Opening Stock - Audited Income" },

            purchasesAssessed: { type: "number", title: "Purchases - Assessed" },
            purchasesAudited: { type: "number", title: "Purchases - Audited Income" },

            grossProfitAssessed: { type: "number", title: "Gross Profit - Assessed" },
            grossProfitEstimated: { type: "number", title: "Gross Profit - Estimated" },

            grandTotal: { 
                type: "number", 
                title: "Grand Total",
                formula: "openingStockAssessed + purchasesAssessed + grossProfitAssessed"
            },

            // Indirect Expenses
            electricity: { type: "number", title: "Electricity" },
            rent: { type: "number", title: "Rent" },
            salaries: { type: "number", title: "Salaries" },
            travellingCharges: { type: "number", title: "Travelling Charges" },
            otherExpenses: { type: "number", title: "Other Expenses" },

            netProfit: { 
                type: "number", 
                title: "Net Profit",
                formula: "grossProfitEstimated - (electricity + rent + salaries + travellingCharges + otherExpenses)"
            },

            // Income Section
            salesAudited: { type: "number", title: "By Sales - Audited Income" },
            salesEstimated: { type: "number", title: "By Sales - Estimated" },

            servicesAudited: { type: "number", title: "By Services - Audited Income" },
            servicesEstimated: { type: "number", title: "By Services - Estimated" },

            closingStockAudited: { type: "number", title: "By Closing Stock - Audited Income" },
            closingStockEstimated: { type: "number", title: "By Closing Stock - Estimated" },

            byGrossProfitAudited: { type: "number", title: "By Gross Profit - Audited Income" },
            byGrossProfitEstimated: { type: "number", title: "By Gross Profit - Estimated" },

            // Balance Sheet Section
            balanceSheet: {
                type: "object",
                title: "Balance Sheet",
                properties: {
                    // Liabilities
                    capitalAccount: { type: "number", title: "Capital Account" },
                    sundryCreditors: { type: "number", title: "Sundry Creditors" },
                    provisions: { type: "number", title: "Provisions" },
                    auditPayable: { type: "number", title: "Audit Payable" },
                    accountantFees: { type: "number", title: "Accountant Fees" },
                    newLoan: { type: "number", title: "New Loan" },

                    // Assets - Loans and Advances
                    loansAndAdvances: {
                        type: "object",
                        title: "Loans and Advances",
                        properties: {
                            gcrumChaudhary: { type: "number", title: "GCRUM Chaudhary" },
                            mahadevTrading: { type: "number", title: "Mahadev Trading" }
                        }
                    },

                    // Assets - Current Assets
                    currentAssets: {
                        type: "object",
                        title: "Current Assets",
                        properties: {
                            prepaidInsurance: { type: "number", title: "Prepaid Insurance" },
                            closingStock: { type: "number", title: "Closing Stock" },
                            sundryDebtors: { type: "number", title: "Sundry Debtors" }
                        }
                    },

                    // Other Assets
                    gstRefund: { type: "number", title: "GST Refund" },
                    gstSetOff: { type: "number", title: "GST Set Off" },
                    dcbBank: { type: "number", title: "DCB Bank" },
                    cashInHand: { type: "number", title: "Cash in Hand" },
                    additionalProperty: { type: "number", title: "Additional Property" }
                }
            },

            // Payment Calculations
            totalPayments: { 
                type: "number", 
                title: "Total Payments",
                formula: "electricity + rent + salaries + travellingCharges + otherExpenses"
            },

            netProfitMargin: { 
                type: "number", 
                title: "Net Profit Margin",
                formula: "netProfit"
            },

            // Margin Percentages
            gpMargin: { 
                type: "number", 
                title: "GP Margin %",
                formula: "(grossProfitEstimated / salesEstimated) * 100"
            },

            npMargin: { 
                type: "number", 
                title: "NP Margin %",
                formula: "(netProfit / salesEstimated) * 100"
            }
        }
    }
} as const;

export default statement4Schema;

