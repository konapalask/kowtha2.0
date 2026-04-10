import financialsSchema from "../financials-schema/generic";
const getFinancialYearEndingYear = (): number => {
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

export const cholaSchema = {
  id: 11,
  bankName: "Chola",
  sections: [
    {
      id: "basicInformation",
      label: "Basic Information",
      schema: {
        type: "object",
        properties: {
          nameOfTheApplicant: {
            type: "string",
            title: "Name of the Applicant",
            readOnly: true,
          },
          nameOfTheCoApplicant: {
            type: "string",
            title: "Name of the Co-applicant",
          },
          businessName: {
            type: "string",
            title: "Business Name",
            readOnly: true,
          },
          constitution: {
            type: "string",
            title: "Constitution",
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
          },
          loanAmountRequested: {
            type: "number",
            title: "Loan Requested",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          purposeOfLoan: {
            type: "string",
            title: "Purpose of Loan",
          },
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
        },
        required: [
          "nameOfTheApplicant",
          "nameOfTheCoApplicant",
          "constitution",
          "visitedAddress",
          "purposeOfLoan",
          "personMet",
        ],
      },
    },
    {
      id: "aboutTheApplicantAndItsBusiness",
      label: "About the Applicant & its Business content",
      schema: {
        type: "object",
        properties: {
          aboutTheApplicant: {
            type: "string",
            title: "About the Applicant",
            ui: {
              widget: "textarea",
              rows: 8,
            },
          },
          aboutTheBusiness: {
            type: "string",
            title: "About the Business",
            ui: {
              widget: "textarea",
              rows: 8,
            },
          },
        },
      },
    },
    {
      id: "residentialDetails",
      label: "Residential Details",
      schema: {
        type: "object",
        properties: {
          residentialDetails: {
            type: "string",
            title: "Residential Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "assets",
      label: "Assets Owned by the Applicant",
      schema: {
        type: "object",
        properties: {
          assetDetails: {
            type: "array",
            title: "Asset details",
            items: {
              type: "object",
              properties: {
                assetDetails: {
                  type: "string",
                  title: "Asset details",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "applicantsNetWorth",
      label: "Applicant's Net Worth",
      schema: {
        type: "object",
        properties: {
          applicantsNetWorth: {
            type: "string",
            title: "Applicant's Net Worth",
          },
        },
      },
    },
    {
      id: "applicantsFamilyDetails",
      label: "Applicant's Family Details",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            title: "Family Members",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relation: {
                  type: "string",
                  title: "Relationship",
                  enum: [
                    "Father",
                    "Mother",
                    "Brother",
                    "Sister",
                    "Spouse",
                    "Son",
                    "Daughter",
                    "Other",
                  ],
                },
                age: {
                  type: "integer",
                  title: "Age",
                },
                occupation: {
                  type: "string",
                  title: "Occupation",
                },
                qualification: {
                  type: "string",
                  title: "Qualification",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "customersReference",
      label: "Customers Reference",
      schema: {
        type: "object",
        properties: {
          customersReference: {
            type: "array",
            title: "Customers Reference",
            items: {
              type: "object",
              properties: {
                customerName: {
                  type: "string",
                  title: "Customer Name",
                },
                customerReferenceNumber: {
                  type: "string",
                  title: "Customer Reference Number",
                },
                feedback: {
                  type: "string",
                  title: "Feedback",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "suppliersReference",
      label: "Suppliers Reference",
      schema: {
        type: "object",
        properties: {
          suppliersReference: {
            type: "array",
            title: "Suppliers Reference",
            items: {
              type: "object",
              properties: {
                supplierName: {
                  type: "string",
                  title: "Supplier Name",
                },
                supplierReferenceNumber: {
                  type: "string",
                  title: "Supplier Reference Number",
                },
                feedback: {
                  type: "string",
                  title: "Feedback",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "otherIncomes",
      label: "Other Incomes",
      schema: {
        type: "object",
        properties: {
          otherIncomes: {
            type: "array",
            title: "Other Incomes",
            items: {
              type: "object",
              properties: {
                otherIncome: {
                  type: "string",
                  title: "Other Income",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "existingLoanDetails",
      label: "Existing Loan Details",
      schema: {
        type: "object",
        properties: {
          loanDetails: {
            type: "array",
            title: "Loan Details",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                typeOfLoan: {
                  type: "string",
                  title: "Type of Loan",
                },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount (In Rs.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                emiInterest: {
                  type: "number",
                  title: "EMI/Interest (In Rs.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                tenureTotalCompleted: {
                  type: "string",
                  title: "Total Tenure / Completed [in months]",
                },
              },
            },
          },
          totalEmi: {
            type: "number",
            title: "Total EMI",
            formula: "loanDetails.reduce((sum, emi) => sum + (emi.emiInterest || 0), 0)",
            readOnly: true,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
    },
    {
      id: "bankingDetails",
      label: "Banking Details",
      schema: {
        type: "object",
        properties: {
          bankingDetails: {
            type: "array",
            title: "Banking Details",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                accountNo: {
                  type: "string",
                  title: "A/c No",
                },
                accountType: {
                  type: "string",
                  title: "A/c Type",
                },
                averageBalance: {
                  type: "number",
                  title: "Avg balance",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "itrFinancialDetails",
      label: "ITR, Receipts, Verification, GP Margin & Expenses Details",
      schema: {
        type: "object",
        properties: {
          itrReceiptsVerificationInformation: {
            type: "string",
            title: "ITR, Receipts, Verification, GP Margin & Expenses Details",
            ui: {
              widget: "textarea",
              rows: 6,
            },
          },
        },
      },
    },
    {
      id: "comfortFactor",
      label: "Comfort Factor",
      schema: {
        type: "object",
        properties: {
          comfortFactors: {
            type: "string",
            title: "Comfort Factors",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "discomfortFactor",
      label: "Discomfort Factor",
      schema: {
        type: "object",
        properties: {
          discomfortFactors: {
            type: "string",
            title: "Discomfort Factors",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "thirdPartyChecks",
      label: "Third Party Checks",
      schema: {
        type: "object",
        properties: {
          tpcDetails: {
            type: "string",
            title: "TPC (Third Party check) Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "Recommendations",
      label: "Recommendations",
      schema: {
        type: "object",
        properties: {
          recommendations: {
            type: "string",
            title: "Recommendations",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "disclaimer",
      label: "Disclaimer",
      schema: {
        type: "object",
        properties: {
          disclaimer: {
            type: "string",
            title: "Disclaimer",
          },
        },
      },
    },
    {
      id: "estimatedProfitAndLoss",
      label: `Estimated Profit & Loss Account For the year ended 31st March ${getFinancialYearEndingYear()}`,
      schema: {
        type: "object",
        properties: {
          openingStock: {
            type: "number",
            title: "Opening Stock",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          purchases: {
            type: "number",
            title: "Purchases",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          otherDirectExpenses: {
            type: "number",
            title: "Other Direct Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          grossProfitExpenditure: {
            type: "number",
            title: "Gross Profit Expenditure",
            formula: "totalIncome - (openingStock + purchases + otherDirectExpenses)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
            readOnly: true,
          },
          totalExpenditure: {
            type: "number",
            title: "Total Expenditure",
            formula: "totalIncome",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
            readOnly: true,
          },
          salaries: {
            type: "number",
            title: "Salaries",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          rentExpenses: {
            type: "number",
            title: "Rent",
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
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          transportOrTravelling: {
            type: "number",
            title: "Transport/Travelling",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          generalExpenses: {
            type: "number",
            title: "General Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          maintenanceExpenses: {
            type: "number",
            title: "Maintenance Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          otherIndirectExpenses: {
            type: "number",
            title: "Other Indirect Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netProfitExpenditure: {
            type: "number",
            title: "Net Profit",
            formula: "grossProfitIncome - (salaries + rentExpenses + electricity + transportOrTravelling + generalExpenses + maintenanceExpenses + otherIndirectExpenses)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
            readOnly: true,
          },
          totalNetProfitExpenditure: {
            type: "number",
            title: "Total",
            formula: "salaries + rentExpenses + electricity + transportOrTravelling + generalExpenses + maintenanceExpenses + otherIndirectExpenses + netProfitExpenditure",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
            readOnly: true,
          },


          // Income Section
          grossReceipts: {
            type: "number",
            title: "Gross Receipts",
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
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          totalIncome: {
            type: "number",
            title: "Total Income",
            formula: "grossReceipts + otherIncome + closingStock",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
            readOnly: true,
          },
          grossProfitIncome: {
            type: "number",
            title: "Gross Profit",
            formula: "totalIncome - (openingStock + purchases + otherDirectExpenses)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
            readOnly: true,
          },
          totalNetProfitIncome: {
            type: "number",
            title: "Total",
            formula: "grossProfitIncome",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
            readOnly: true,
          },
        },
      },
    },
    {
      id: "incomeDetails",
      label: "Income Details",
      schema: {
        type: "object",
        properties: {
          totalGrossDisposableIncome: {
            type: "number",
            title: "Total Gross disposable Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          totalObligations: {
            type: "number",
            title: "Total Obligations",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netDisposableIncome: {
            type: "number",
            title: "Net Disposable Income",
            formula: "totalGrossDisposableIncome - totalObligations",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
    },

    financialsSchema,
  ],
} as const;

export default cholaSchema;
