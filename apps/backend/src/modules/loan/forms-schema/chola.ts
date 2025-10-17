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
          loanRequested: {
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
          required: ["nameOfTheApplicant", "nameOfTheCoApplicant", "constitution", "visitedAddress", "loanRequested", "purposeOfLoan", "dateOfVisit", "personMet"],
      },
    },
    {
      id: "aboutTheApplicantAndItsBusiness",
      label: "About the Applicant & its Business",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            aboutTheApplicant: {
              type: "string",
              title: "About the Applicant & Business",
            },
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
                },
                age: {
                  type: "integer",
                  title: "Age",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "assets",
      label: "Assets",
      schema: {
        type: "array",
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
    {
      id: "customersReferenceNumbers",
      label: "Customers - Reference Numbers",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            customerReferenceNumber: {
              type: "string",
              title: "Customer Reference Number",
            }
          },
        },
      },
    },
    {
      id: "otherIncomes",
      label: "Other Incomes",
      schema: {
        type: "array",
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
    {
      id: "existingLoanDetails",
      label: "Existing Loan Details",
      schema: {
        type: "array",
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
              },
            },
          },
        },
      },
    },
    {
      id: "itrFinancialDetails",
      label: "ITR / Financial Details",
      schema: {
        type: "object",
        properties: {
          itr: {
            type: "string",
            title: "ITR",
          },
          receipts: {
            type: "string",
            title: "Receipts",
          },
          verification: {
            type: "string",
            title: "Verification",
          },
          gpMarginAndExpenses: {
            type: "string",
            title: "GP Margin & Expenses Details",
          },

        },
      },
    },
    {
      id: "comfortFactor",
      label: "Comfort Factor",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            comfortFactor: {
              type: "string",
              title: "Comfort Factor",
            }
          },
        },
      },
    },
    {
      id: "discomfortFactor",
      label: "Discomfort Factor(e.g., Mismatch name board, Not filing ITR, not provided bank statements, etc.)",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            discomfortFactor: {
              type: "string",
              title: "Discomfort Factor",
            }
          },
        },
      },
    },
    {
      id: "Recommendations",
      label: "Recommendations",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            recommendations: {
              type: "string",
              title: "Recommendations",
            }
          },
        },
      },
    },
    {
      id: "disclaimer",
      label: "Disclaimer if any",
      schema: {
        type: "object",
        properties: {
          disclaimer: {
            type: "string",
            title: "Disclaimer if any",
          },
        },
      },
    },
     {
       id: "financialStatement",
       label: "Financial Statement",
       schema: {
         type: "object",
         properties: {
           expenditure: {
             type: "object",
             title: "EXPENDITURE",
             properties: {
               toPurchaseOfMaterial: {
                 type: "number",
                 title: "To purchase of Material",
                 formatter: {
                   useIndianFormat: true,
                   locale: "en-IN",
                   maxDecimalPlaces: 2,
                   minDecimalPlaces: 0,
                 },
               },
               toElectricity: {
                 type: "number",
                 title: "To Electricity",
                 formatter: {
                   useIndianFormat: true,
                   locale: "en-IN",
                   maxDecimalPlaces: 2,
                   minDecimalPlaces: 0,
                 },
               },
               toRent: {
                 type: "number",
                 title: "To Rent",
                 formatter: {
                   useIndianFormat: true,
                   locale: "en-IN",
                   maxDecimalPlaces: 2,
                   minDecimalPlaces: 0,
                 },
               },
               toSalaries: {
                 type: "number",
                 title: "To Salaries",
                 formatter: {
                   useIndianFormat: true,
                   locale: "en-IN",
                   maxDecimalPlaces: 2,
                   minDecimalPlaces: 0,
                 },
               },
               toTransportation: {
                 type: "number",
                 title: "To Transportation",
                 formatter: {
                   useIndianFormat: true,
                   locale: "en-IN",
                   maxDecimalPlaces: 2,
                   minDecimalPlaces: 0,
                 },
               },
               toOtherExpenses: {
                 type: "number",
                 title: "To other expenses",
                 formatter: {
                   useIndianFormat: true,
                   locale: "en-IN",
                   maxDecimalPlaces: 2,
                   minDecimalPlaces: 0,
                 },
               },
               toNetProfit: {
                 type: "number",
                 title: "To Net profit",
                 formatter: {
                   useIndianFormat: true,
                   locale: "en-IN",
                   maxDecimalPlaces: 2,
                   minDecimalPlaces: 0,
                 },
               },
               totalExpenditure: {
                 type: "number",
                 title: "Total",
                 formatter: {
                   useIndianFormat: true,
                   locale: "en-IN",
                   maxDecimalPlaces: 2,
                   minDecimalPlaces: 0,
                 },
               },
             },
           },
           income: {
             type: "object",
             title: "INCOME",
             properties: {
               byGrossReceipts: {
                 type: "number",
                 title: "By Gross Receipts",
                 formatter: {
                   useIndianFormat: true,
                   locale: "en-IN",
                   maxDecimalPlaces: 2,
                   minDecimalPlaces: 0,
                 },
               },
               totalIncome: {
                 type: "number",
                 title: "Total",
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
         required: ["expenditure", "income"],
       },
     },
    {
      id: "financialAnalysis",
      label: "Financial Analysis",
      schema: {
        type: "object",
        properties: {
          totalGrossDisposableIncome: {
            type: "number",
            title: "Total Gross Disposable Income (A)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          totalObligations: {
            type: "number",
            title: "Total Obligations (B)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netDisposableIncome: {
            type: "number",
            title: "Net Disposable Income (C = A – B)",
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
  ],
} as const;
export default cholaSchema;
