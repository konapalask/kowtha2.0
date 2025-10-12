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
            type: "string",
            title: "Phone Number",
            readOnly: true,
          },
          nameOfConcern: {
            type: "string",
            title: "Name of Concern",
            readOnly: true,
          },
          initiatedAddress: {
            type: "string",
            title: "Initiated Address",
            readOnly: true,
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
          },
          residentialAddress: {
            type: "string",
            title: "Residential Address",
          },
          appointmentFixed: {
            type: "string",
            title: "Appointment Fixed (Time)",
          },
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
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
          aboutApplicant: {
            type: "string",
            title: "About Applicant (Descriptive Section)",
          },
          latitude: {
            type: "string",
            title: "Latitude",
          },
          longitude: {
            type: "string",
            title: "Longitude",
          },
          region: {
            type: "string",
            title: "Region",
          },
          location: {
            type: "string",
            title: "Location",
          },
          branch: {
            type: "string",
            title: "Branch",
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
                  title: "Account Type",
                  enum: ["Savings", "Current", "CC/OD"],
                },
                avgBalance: {
                  type: "number",
                  title: "Average Balance",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                noOfYearsMaintained: {
                  type: "integer",
                  title: "No. of Years Maintained",
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
            title: "LIC/Mutual Funds Details",
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
                  title: "Bank",
                },
                type: {
                  type: "string",
                  title: "Type",
                },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount",
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
                  title: "Open/Close",
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
        type: "object",
        properties: {
          businessStartedYear: {
            type: "integer",
            title: "Business Started Year",
          },
          constitution: {
            type: "string",
            title: "Constitution",
            enum: [
              "Sole Proprietorship",
              "Partnership",
              "Private Limited",
              "Limited Liability Partnership",
            ],
          },
          proprietorDetails: {
            type: "string",
            title: "Proprietor/Partner Details",
          },
          businessName: {
            type: "string",
            title: "Business Name",
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business",
          },
          businessDescription: {
            type: "string",
            title: "Business Description (Detailed)",
          },
          purchasesFrom: {
            type: "string",
            title: "Purchases Stock From",
          },
          deliveryMode: {
            type: "string",
            title: "Delivery Mode",
          },
          stockMaintenance: {
            type: "string",
            title: "Stock Maintenance Details",
          },
          salesVolume: {
            type: "string",
            title: "Monthly Sales Volume",
          },
          profitMargin: {
            type: "string",
            title: "Profit Margin per Unit/Kg",
          },
          businessPremisesOwnership: {
            type: "string",
            title: "Business Premises Ownership",
            enum: ["Owned", "Rented"],
          },
          numberOfWorkers: {
            type: "integer",
            title: "Number of Workers",
          },
          totalWages: {
            type: "number",
            title: "Total Wages per Month",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          transactionMode: {
            type: "string",
            title: "Major Business Transaction Mode",
            enum: ["Cash", "Bank", "Cash/Bank"],
          },
        },
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
                  type: "string",
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
                  type: "string",
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
      label: "Business Activity and Stock Level Observed",
      schema: {
        type: "object",
        properties: {
          businessActivityObserved: {
            type: "string",
            title:
              "Business Activity and Stock Level Observed at Time of Visit",
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
            enum: ["Yes", "No"],
          },
          gstNumber: {
            type: "string",
            title: "GST Number (if registered)",
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
            enum: ["Yes", "No", "Not Applicable"],
          },
          itrDetails: {
            type: "string",
            title: "ITR Details (if filed)",
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
            title: "Net Margin %",
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
            type: "number",
            title:
              "Family Expenses (Purchases, Salaries, Electricity, Transport/Travelling, Other)",
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
        type: "object",
        properties: {
          concerns: {
            type: "string",
            title: "Concerns (Any Negative Observations)",
          },
        },
      },
      required: true,
    },
    {
      id: "otherObservations",
      label: "Other Observations",
      schema: {
        type: "object",
        properties: {
          otherObservations: {
            type: "string",
            title: "Other Observations",
          },
        },
      },
      required: true,
    },
    {
      id: "otherIncomes",
      label: "Other Incomes",
      schema: {
        type: "object",
        properties: {
          otherIncomes: {
            type: "string",
            title: "Other Incomes",
          },
        },
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
  ],
} as const;
export default arkaFincapSchema;
