import financialsSchema from "../financials-schema/generic";
export const tataUblSchema = {
  id: 5,
  bankName: "Tata Ubl",
  sections: [
    {
      id: "basicDetails",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          applicantName: {
            type: "string",
            title: "Name of Applicant",
            readOnly: true,
          },
          businessName: {
            type: "string",
            title: "Name of Entity",
            readOnly: true,
          },
          nameOfCoApplicants: {
            type: "string",
            title: "Name of Co-Applicant(s)",
          },
        },
      },
      required: true,
    },
    {
      id: "proposedLoanDetails",
      label: "Proposed Loan Details",
      schema: {
        type: "object",
        properties: {
          product: {
            type: "string",
            title: "Product",
            // readOnly: true,
          },
          loanAmount: {
            type: "number",
            title: "Amount",
            readOnly: true,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          tenure: {
            type: "number",
            title: "Tenure (months)",
          },
          repaymentFrom: {
            type: "object",
            title: "Repayment from (Bank name)",
            properties: {
              repaymentBankName: {
                type: "string",
                title: "Bank name",
                readOnly: true,
              },
              typeSAAccount: {
                type: "string",
                title: "Type (SA A/C)",
                enum: ["Savings", "Current", "Fixed Deposit"],
                default: "Savings",
              },
              accountNo: {
                type: "number",
                title: "Account No.",
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "officeAddress",
      label: "Office Address",
      schema: {
        type: "object",
        properties: {
          officeAddress: {
            type: "string",
            title: "Address",
            readOnly: true,
          },
          rentedOwned: {
            type: "string",
            title: "Rented/Owned",
            enum: ["Rented", "Owned"],
          },
          ownedBy: {
            type: "string",
            title: "Owned by",
          },
          areaSqFt: {
            type: "string",
            title: "Area (In Sq. Ft.)",
          },
          occupiedSinceYears: {
            type: "integer",
            title: "Occupied since (years)",
          },
          cmvRentPerMonth: {
            type: "number",
            title: "CMV / Rent p.m.",
          },
        },
      },
      required: true,
    },
    {
      id: "residentialAddress",
      label: "Residential Address",
      schema: {
        type: "object",
        properties: {
          address: {
            type: "string",
            title: "Address",
          },
          rentedOwned: {
            type: "string",
            title: "Rented/Owned",
            enum: ["Rented", "Owned"],
          },
          ownedBy: {
            type: "string",
            title: "Owned by",
          },
          areaSqFt: {
            type: "string",
            title: "Area (In Sq. Ft.)",
          },
          occupiedSinceYears: {
            type: "integer",
            title: "Occupied since (years)",
          },
          cmvRentPerMonth: {
            type: "number",
            title: "CMV / Rent p.m.",
          },
        },
      },
      required: true,
    },
    {
      id: "addressOfPDAndPersonMet",
      label: "Address of PD and Person Met",
      schema: {
        type: "object",
        properties: {
          addressOfPDAndPersonMet: {
            type: "string",
            title: "Address of PD and persona met",
          },
        },
      },
      required: true,
    },
    {
      id: "familyDetails",
      label: "Family Details",
      schema: {
        type: "object",
        properties: {
          familyDetails: {
            type: "array",
            title: "Family Details",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                age: {
                  type: "integer",
                  title: "Age",
                },
                qualification: {
                  type: "string",
                  title: "Qualification",
                  enum: [
                    "Below 10th",
                    "10th pass",
                    "Under graduate",
                    "Graduate",
                    "Post Graduate",
                    "Professional",
                  ],
                  default: "Below 10th",
                },
                profession: {
                  type: "string",
                  title: "Profession",
                },
                relation: {
                  type: "string",
                  title: "Relation",
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
                  default: "Father",
                },
                monthlyIncome: {
                  type: "number",
                  title: "Monthly income",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "businessDetails",
      label: "Business Details",
      schema: {
        type: "object",
        properties: {
          currentBusinessDetails: {
            type: "string",
            title: "Current Business Details",
            ui: { widget: "textarea", rows: 6 },
          },
          stockAsOnDate: {
            type: "date",
            title: "Stock as on date",
          },
        },
      },
      required: true,
    },
    {
      id: "employeesDetails",
      label: "Employees Details",
      schema: {
        type: "object",
        properties: {
          currentEmployees: {
            type: "number",
            title: "Current Employees",
          },
          salaryRange: {
            type: "number",
            title: "Salary Range",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 0,
              minDecimalPlaces: 0,
            },
          },
          keyEmployeeName: {
            type: "string",
            title: "Key Employee Name",
          },
        },
      },
      required: true,
    },
    {
      id: "bankDetails",
      label: "Bank Details",
      schema: {
        type: "object",
        properties: {
          primaryBanker: {
            type: "string",
            title: "Primary Banker",
          },
          natureOfAccount: {
            type: "string",
            title: "Nature of Account",
          },
          avgBal: {
            type: "string",
            title: "Avg. Bal",
          },
        },
      },
      required: true,
    },
    {
      id: "salesAndProfitDetails",
      label: "Sales and Profit Details",
      schema: {
        type: "object",
        properties: {
          turnoverFY202425: {
            type: "string",
            title: "Turnover (FY 2024-25)",
          },
          expTurnoverFY202526: {
            type: "string",
            title: "Exp. Turnover (FY 2025-26)",
          },
          monthlyTurnoverSales: {
            type: "string",
            title: "Monthly Turnover / Sales",
          },
          netMonthlyIncome: {
            type: "string",
            title: "Net Monthly Income",
          },
          profitMargin: {
            type: "string",
            title: "Profit Margin",
          },
          covidEffectOnTurnover: {
            type: "string",
            title: "Is there any effect on turnover due to Covid",
          },
          postLockdownBusinessSpeed: {
            type: "string",
            title: "After lockdown, is business running on same speed?",
          },
          cashSalesPercentage: {
            type: "integer",
            title: "Cash Sales (% of total turnover)",
          },
        },
      },
      required: true,
    },
    {
      id: "customerDetails",
      label: "Customer Details",
      schema: {
        type: "object",
        properties: {
          totalDebtorsAsOnDate: {
            type: "integer",
            title: "Total Debtors as on date",
          },
          totalCustomersNo: {
            type: "integer",
            title: "Total Customers (No.)",
          },
          customers: {
            type: "array",
            title: "Customers",
            items: {
              type: "object",
              properties: {
                nameOfCustomer: {
                  type: "string",
                  title: "Name of Customer",
                },
                percentageOfTotalSales: {
                  type: "string",
                  title: "% of Total Sales",
                },
                debtorDays: {
                  type: "string",
                  title: "Debtor Days",
                },
                relationshipSinceYears: {
                  type: "integer",
                  title: "Relationship since (years)",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "supplierDetails",
      label: "Supplier Details",
      schema: {
        type: "object",
        properties: {
          totalCreditorsAsOnDate: {
            type: "integer",
            title: "Total Creditors as on date",
          },
          totalSuppliersNo: {
            type: "integer",
            title: "Total Suppliers (No.)",
          },
          suppliers: {
            type: "array",
            title: "Suppliers",
            items: {
              type: "object",
              properties: {
                nameOfSupplier: {
                  type: "string",
                  title: "Name of Supplier",
                },
                percentageOfTotalPurchases: {
                  type: "string",
                  title: "% of Total Purchases",
                },
                creditorDays: {
                  type: "string",
                  title: "Creditor Days",
                },
                relationshipSinceYears: {
                  type: "integer",
                  title: "Relationship since (years)",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "otherDetails",
      label: "Other Details",
      schema: {
        type: "object",
        properties: {
          otherBusinessIncomeDetails: {
            type: "string",
            title: "Other Business/Income Details (if any)",
          },
          assets: {
            type: "string",
            title: "Assets",
          },
          liabilities: {
            type: "array",
            title: "Liabilities",
            items: {
              type: "object",
              properties: {
                bank: {
                  type: "string",
                  title: "Bank",
                },
                natureOfLoan: {
                  type: "string",
                  title: "Nature of Loan",
                },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 0,
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
                tenure: {
                  type: "number",
                  title: "Tenure (Months)",
                },
                outstandingBalance: {
                  type: "number",
                  title: "Outstanding Balance",
                },
              },
            },
          },
          endUseOfProposedLoan: {
            type: "string",
            title: "End Use of proposed Loan",
          },
          politicalConnection: {
            type: "string",
            title: "Political Connection",
            enum: ["Yes", "no"],
          },
          anyCourtCases: {
            type: "string",
            title: "Any Court Cases",
            enum: ["Yes", "no"],
          },
          businessIndustry: {
            type: "string",
            title: "Business belongs to which industry",
          },
        },
      },
      required: true,
    },
    {
      id: "valueAddedInformation",
      label: "Value Added Information",
      schema: {
        type: "object",
        properties: {
          customerBehavior: {
            type: "string",
            title: "Customer Behavior?",
            enum: ["Good", "Bad", "Relatively neutral"],
          },
          salariesPaidDuringCovid: {
            type: "string",
            title: "Salaries paid during covid to employees?",
            enum: ["Yes", "Partial", "No"],
          },
          salaryDeductionPercentage: {
            type: "integer",
            title: "If partly paid, % of deduction on salary?",
          },
          neighborhoodShopsNature: {
            type: "string",
            title:
              "Nature/Types of Neighborhood Shops (E.g. General Store, Jewelry Store, Hardware Store, etc.)",
          },
          digitalWalletUsed: {
            type: "string",
            title:
              "Digital wallet used in the business? (E.g. PhonePe, Paytm, GooglePay, AmazonPay, JIO Money, Yono SBI, Airtel Money, Etc.)",
          },
          customerShopLocality: {
            type: "string",
            title:
              "Customer Shop/Office Locality (Slum/Market Road/Main Road/Highway)",
            enum: ["Slum", "Market Road", "Main Road", "Highway"],
          },
          nearbyTransportStand: {
            type: "string",
            title:
              "Nearby Bus Stop / Taxi Stand / Rickshaw Stand / Metro Station Name",
          },
          utilityBillDetails: {
            type: "string",
            title:
              "Take Utility bill photo of last 2 months towards end & present month units consumption to be written",
          },
          lossSufferedInBusiness: {
            type: "string",
            title: "Loss Suffered In Business, If yes, the reason?",
          },
          strengths: {
            type: "string",
            title: "Strengths",
          },
          weaknesses: {
            type: "string",
            title: "Weaknesses",
          },
        },
      },
      required: true,
    },
    {
      id: "siteVisitObservations",
      label: "Site Visit Observations",
      schema: {
        type: "object",
        properties: {
          namePlateDisplayed: {
            type: "string",
            title: "Name Plate Displayed",
            enum: ["Yes", "no"],
          },
          officeWellFurnished: {
            type: "string",
            title: "Office Well Furnished?",
            enum: ["Yes", "no"],
          },
          businessActivitySeen: {
            type: "string",
            title: "Business Activity Seen",
            enum: ["Yes", "no"],
          },
          difficultyInLocatingPremises: {
            type: "string",
            title: "Difficulty in locating premises?",
            enum: ["Yes", "no"],
          },
          neighborhood: {
            type: "string",
            title: "Neighborhood",
          },
          landmark: {
            type: "string",
            title: "Landmark",
          },
          abnormalIncreaseDecreaseInTurnover: {
            type: "string",
            title: "Abnormal Increase/Decrease in Turnover",
            enum: ["Yes", "no"],
          },
          anyDecreaseInNetWorth: {
            type: "string",
            title: "Any Decrease in Net worth",
            enum: ["Yes", "no"],
          },
          stockSeenDuringPD: {
            type: "string",
            title: "Stock Seen During PD?",
            enum: ["Yes", "no"],
          },
          noOfEmployeesSeenDuringPD: {
            type: "integer",
            title: "No. of employees seen during PD?",
          },
          noOfCustomersSeenDuringPD: {
            type: "integer",
            title: "No. of customers seen during PD?",
          },
          thirdPartyConfirmation: {
            type: "string",
            title: "Third Party Confirmation",
          },
        },
      },
      required: true,
    },
    financialsSchema,
  ],
} as const;
export default tataUblSchema;
