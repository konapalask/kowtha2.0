export const arkaFincapSchema = {
  id: 4,
  bankName: "Arka Fincap",
  sections: [
    {
      id: "applicantDetails",
      label: "Applicant Details",
      schema: {
        type: "object",
        properties: {
          applicationNo: {
            type: "string",
            title: "Application No",
            readOnly: true,
          },
          nameOfApplicant: {
            type: "string",
            title: "Name of Applicant",
            readOnly: true,
          },
          nameOfCoApplicant: {
            type: "string",
            title: "Name of Co-Applicant",
          },
          phoneNumber: {
            type: "integer",
            title: "Phone Number",
            readOnly: true,
          },
          nameOfConcern: {
            type: "string",
            title: "Name of Concern",
            readOnly: true,
          },
          initiatedPremises: {
            type: "string",
            title: "Initiated Premises",
            readOnly: true,
          },
          visitedPremises: {
            type: "string",
            title: "Visited Premises",
          },
          residentialPremises: {
            type: "string",
            title: "Residential Premises",
          },
          appointmentFixed: {
            type: "string",
            title: "Appointment Fixed",
            format: "time",
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
          amountAndPurposeOfLoan: {
            type: "string",
            title: "Amount and Purpose of Loan",
            readOnly: true,
          },
          typeOfCollateral: {
            type: "string",
            title: "Type of Collateral",
          },
          marketValueOfCollateral: {
            type: "string",
            title: "Market Value of Collateral Security",
          },
          collateralPropertyAddress: {
            type: "string",
            title: "Collateral Property Address",
          },
          aboutTheApplicant: {
            type: "string",
            title: "About the Applicant",
          },
        },
        required: ["applicationNo", "nameOfApplicant", "nameOfConcern"],
      },
      required: true,
    },
    {
      id: "familyMembers",
      label: "Family Members",
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
                relationship: {
                  type: "string",
                  title: "Relationship",
                },
                age: {
                  type: "integer",
                  title: "Age",
                },
                education: {
                  type: "string",
                  title: "Education",
                },
                occupation: {
                  type: "string",
                  title: "Occupation",
                },
              },
            },
          },
        },
      },
      required: true,
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
                accountType: {
                  type: "string",
                  title: "ACCOUNT TYPE",
                  enum: ["Savings", "Current", "CC/OD"],
                },
                avgBalance: {
                  type: "number",
                  title: "AVG BAL",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                noOfYearsMaintained: {
                  type: "number",
                  title: "NO: OF YEARS MAINTAINED",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "licMutualFunds",
      label: "LIC/Mutual Funds",
      schema: {
        type: "object",
        properties: {
          licMutualFunds: {
            type: "string",
            title: "LIC/Mutual Funds",
          },
        },
      },
      required: true,
    },
    {
      id: "assets",
      label: "Assets",
      schema: {
        type: "object",
        properties: {
          assets: {
            type: "array",
            title: "Assets",
            items: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                  title: "Asset Description",
                },
                area: {
                  type: "string",
                  title: "Area",
                },
                marketValue: {
                  type: "number",
                  title: "Market Value",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                nameOfAssetHolder: {
                  type: "string",
                  title: "Name of Asset Holder",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "existingLoans",
      label: "Existing Loans",
      schema: {
        type: "object",
        properties: {
          loans: {
            type: "array",
            title: "No. of Loans",
            items: {
              type: "object",
              properties: {
                bank: {
                  type: "string",
                  title: "BANK",
                },
                type: {
                  type: "string",
                  title: "TYPE",
                },
                loanAmount: {
                  type: "number",
                  title: "LOAN",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                emi: {
                  type: "number",
                  title: "EMI",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                status: {
                  type: "string",
                  title: "OPEN/CLOSE",
                  enum: ["Open", "Close"],
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "aboutTheBusiness",
      label: "About the Business",
      schema: {
        type: "array",
        title: "About the Business",
        items: {
          type: "string",
          title: "Business Detail",
        },
        minItems: 1,
      },
      required: true,
    },
    {
      id: "regularCustomers",
      label: "Regular Customers",
      schema: {
        type: "object",
        properties: {
          customers: {
            type: "array",
            title: "Name and Contact Number of Regular Customers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Customer Name",
                },
                contactNumber: {
                  type: "integer",
                  title: "Contact Number",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "regularSuppliers",
      label: "Regular Suppliers",
      schema: {
        type: "object",
        properties: {
          suppliers: {
            type: "array",
            title: "Name and Contact Number of Regular Suppliers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Supplier Name",
                },
                contactNumber: {
                  type: "number",
                  title: "Contact Number",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "businessActivityObserved",
      label: "Business Activity and Stock Level observed",
      schema: {
        type: "object",
        properties: {
          businessActivityAndStockLevelObserved: {
            type: "string",
            title: "Business Activity and Stock Level observed at the time of visit",
          },
        },
      },
      required: true,
    },
    {
      id: "documentsObserved",
      label: "Documents Observed",
      schema: {
        type: "object",
        properties: {
          documentsObserved: {
            type: "string",
            title: "Documents Observed",
          },
        },
      },
      required: true,
    },
    {
      id: "gstRegistration",
      label: "GST Registration",
      schema: {
        type: "object",
        properties: {
          gstRegistered: {
            type: "string",
            title: "Whether Business Registered under GST?",
          },
        },
      },
      required: true,
    },
    {
      id: "itrDetails",
      label: "ITR Details",
      schema: {
        type: "object",
        properties: {
          itrFiled: {
            type: "string",
            title: "As per Audited Individual ITR's",
          },
        },
      },
      required: true,
    },
    {
      id: "monthlyGrossReceipts",
      label: "Monthly Gross Receipts",
      schema: {
        type: "object",
        properties: {
          monthlyGrossReceipts: {
            type: "number",
            title: "Monthly Gross Receipts",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "monthlyExpenses",
      label: "Monthly Expenses",
      schema: {
        type: "object",
        properties: {
          monthlyExpenses: {
            type: "number",
            title: "Monthly Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "netProfit",
      label: "Net Profit",
      schema: {
        type: "object",
        properties: {
          netProfit: {
            type: "number",
            title: "Net Profit",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "netMargin",
      label: "Net Margin",
      schema: {
        type: "object",
        properties: {
          netMargin: {
            type: "number",
            title: "Net Margin",
          },
        },
      },
      required: true,
    },
    {
      id: "familyExpenses",
      label: "Family Expenses",
      schema: {
        type: "object",
        properties: {
          familyExpenses: {
            type: "string",
            title: "Family Expenses",

          },
        },
      },
      required: true,
    },
    {
      id: "employees",
      label: "Employees",
      schema: {
        type: "object",
        properties: {
          numberOfEmployees: {
            type: "integer",
            title: "Number of Employees",
          },
        },
      },
      required: true,
    },
    {
      id: "concerns",
      label: "Concerns",
      schema: {
        type: "array",
        title: "Concerns",
        items: {
          type: "string",
          title: "Concerns",
        },
        minItems: 1,
      },
      required: true,
    },
    {
      id: "otherObservations",
      label: "Other Observations",
      schema: {
        type: "array",
        title: "Other Observations",
        items: {
          type: "string",
          title: "Other Observations",
        },
        minItems: 1,
      },
      required: true,
    },
    {
      id: "otherIncomes",
      label: "Other Incomes",
      schema: {
        type: "array",
        title: "Other Incomes",
        items: {
          type: "string",
          title: "Other Incomes",
        },
        minItems: 1,
      },
      required: true,
    },
    {
      id: "neighborCheck",
      label: "Neighbor Check",
      schema: {
        type: "object",
        properties: {
          neighborCheck: {
            type: "string",
            title: "Neighbor Check Feedback",
          },
        },
      },
      required: true,
    },
    {
      id: "status",
      label: "Status",
      schema: {
        type: "object",
        properties: {
          status: {
            type: "string",
            title: "Status",
          },
        },
      },
      required: true,
    },

  ],
} as const;
export default arkaFincapSchema;
