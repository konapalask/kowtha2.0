import financialsSchema from "../financials-schema/generic";

export const janaSenpAbove50lSchema = {
  id: 29,
  bankName: "Jana Senp Above 50l",
  sections: [
    {
      id: "general",
      label: "General",
      schema: {
        type: "object",
        properties: {
          applicantName: {
            type: "string",
            title: "Name of Customer",
            readOnly: true,
          },
          dateOfReport: {
            type: "string",
            title: "Date of Report",
            format: "date",
          },
          applicationNumber: {
            type: "string",
            title: "Application ID",
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
            ui: {
              widget: "textarea",
              rows: 3,
            },
            readOnly: true,
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          applicantPhoneNumber: {
            type: "integer",
            title: "Phone Number",
            readOnly: true,
          },
          appointmentFixedTime: {
            type: "string",
            title: "Appointment Fixed",
            format: "time",
          },
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          structureOfLoan: {
            type: "string",
            title: "Structure of Loan",
          },
          numberOfVisits: {
            type: "string",
            title: "No. of Visit",
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
          visitedBy: {
            type: "string",
            title: "Visited By",
          },
          checkedBy: {
            type: "string",
            title: "Checked By",
          },
        },
      },
    },

    {
      id: "aboutTheApplicant",
      label: "About the Applicant",
      schema: {
        type: "object",
        properties: {
          aboutTheApplicant: {
            type: "string",
            title: "About the Applicant",
            ui: {
              widget: "textarea",
              rows: 3,
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
      id: "coApplicantDetails",
      label: "Co-Applicant Details",
      schema: {
        type: "object",
        properties: {
          coApplicantDetails: {
            type: "string",
            title: "Co-Applicant Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "familyDetails",
      label: "Family Details",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            title: "Family Members",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                relationship: {
                  type: "string",
                  title: "Relationship with Applicant",
                },
                age: { type: "number", title: "Age (Yrs)" },
                qualification: {
                  type: "string",
                  title: "Qualification",
                  enum: [
                    "Below 10th",
                    "10th pass",
                    "12th pass",
                    "Diploma/ITI certification",
                    "Graduate",
                    "PG/Professional Certification",
                  ],
                },
                occupation: { type: "string", title: "Occupation" },
                incomePerMonth: {
                  type: "number",
                  title: "Income per month (approx.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                dependent: { type: "string", title: "Dependent" },
              },
            },
          },
        },
      },
    },

    {
      id: "constitution",
      label: "Constitution",
      schema: {
        type: "object",
        properties: {
          constitution: { type: "string", title: "Constitution" },
        },
      },
    },
    {
      id: "shareholdingDetails",
      label: "Shareholding Details",
      schema: {
        type: "object",
        properties: {
          shareholdingDetails: {
            type: "array",
            title: "Shareholding Details",
            items: {
              type: "object",
              properties: {
                shareholderName: {
                  type: "string",
                  title: "Name of the Shareholder",
                },
                relationship: {
                  type: "string",
                  title: "Relation with Main Applicant",
                },
                designation: { type: "string", title: "Designation" },
                shareholdingPercentage: {
                  type: "number",
                  title: "% of Shareholding",
                },
                comingIntoLoanStructure: {
                  type: "string",
                  title: "Coming into Loan Structure",
                },
                functionalRole: {
                  type: "string",
                  title: "Functional role of partner / director",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "aboutTheBusiness",
      label: "Functional role of partner / director",
      schema: {
        type: "object",
        properties: {
          aboutTheBusiness: {
            type: "string",
            title: "About the Business",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "productOrServiceDetails",
      label: "Product or Service Details",
      schema: {
        type: "object",
        properties: {
          productOrServiceDetails: {
            type: "array",
            title: "Product or Service Details",
            items: {
              type: "object",
              properties: {
                productOrServiceDetail: {
                  type: "string",
                  title: "Product/Service Detail",
                  ui: {
                    widget: "textarea",
                    rows: 3,
                  },
                },
                productOrServicePriceRange: {
                  type: "number",
                  title: "Product/Service Price Range approx.",
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
      id: "financialDetails",
      label: "Financial Details",
      schema: {
        type: "object",
        properties: {
          annualReceipts: {
            type: "object",
            title: "Annual Receipts",
            properties: {
              ay202425: {
                type: "number",
                title: "AY 2024-25",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              ay202324: {
                type: "number",
                title: "AY 2023-24",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },

              Remarks: { type: "string", title: "Remarks" },
            },
          },
          grossProfit: {
            type: "object",
            properties: {
              ay202425: {
                type: "number",
                title: "AY 2024-25",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              ay202324: {
                type: "number",
                title: "AY 2023-24",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              Remarks: { type: "string", title: "Remarks" },
            },
          },
          grossProfitMargin: {
            type: "object",
            title: "Gross Profit Margin",
            properties: {
              ay202425: { type: "number", title: "AY 2024-25" },
              ay202324: { type: "number", title: "AY 2023-24" },
              Remarks: { type: "string", title: "Remarks" },
            },
          },
          netProfit: {
            type: "object",
            title: "Net Profit",
            properties: {
              ay202425: {
                type: "number",
                title: "AY 2024-25",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              ay202324: {
                type: "number",
                title: "AY 2023-24",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              Remarks: { type: "string", title: "Remarks" },
            },
          },
          netProfitMargin: {
            type: "object",
            title: "Net Profit Margin",
            properties: {
              ay202425: { type: "number", title: "AY 2024-25" },
              ay202324: { type: "number", title: "AY 2023-24" },
              Remarks: { type: "string", title: "Remarks" },
            },
          },
          filledDate: {
            type: "object",
            title: "Filled Date",
            properties: {
              ay202425: { type: "string", title: "AY 2024-25", format: "date" },
              ay202324: { type: "string", title: "AY 2023-24", format: "date" },
              Remarks: { type: "string", title: "Remarks" },
            },
          },
        },
      },
    },

    {
      id: "documentsObserved",
      label: "Documents Observed",
      schema: {
        type: "object",
        properties: {
          documents: {
            type: "array",
            title: "Documents Observed",
            items: {
              type: "object",
              properties: {
                documentCategory: {
                  type: "string",
                  title: "Document Category",
                },
                documentName: { type: "string", title: "Document Name" },
                documentType: { type: "string", title: "Document Type" },
                documentRemarks: {
                  type: "string",
                  title: "Remarks",
                  ui: { widget: "textarea", rows: 3 },
                },
              },
            },
          },
        },
      },
    },

    {
      id: "suppleirsOrCreditors",
      label: "Suppleirs or Creditors",
      schema: {
        type: "object",
        properties: {
          noOfFixedSuppliers: {
            type: "number",
            title: "No of Fixed Suppliers",
          },
          creditPeriod: { type: "number", title: "Credit Period" },
          cashChequeProportion: {
            type: "number",
            title: "Cash - Cheque proportion",
          },
          top3suppliers: {
            type: "array",
            title: "Top 3 Suppliers",
            items: {
              type: "object",
              properties: {
                nameOfSupplier: {
                  type: "string",
                  title: "Name (top 3 suppliers)",
                },
                contactDetails: { type: "string", title: "Contact Details" },
                location: { type: "string", title: "Location" },
                referenceCheck: { type: "string", title: "Ref. Check" },
              },
            },
          },
        },
      },
    },
    {
      id: "clientsDebtors",
      label: "Clients / Debtors",
      schema: {
        type: "object",
        properties: {
          noOfFixedCustomers: {
            type: "number",
            title: "No of Fixed Customers",
          },
          creditPeriod: { type: "number", title: "Credit Period" },
          cashChequeProportion: {
            type: "number",
            title: "Cash - Cheque proportion",
          },
          top3customers: {
            type: "array",
            title: "Top 3 Customers",
            items: {
              type: "object",
              properties: {
                nameOfClient: {
                  type: "string",
                  title: "Name (top 3 customers)",
                },
                contactDetails: { type: "string", title: "Contact Details" },
                location: { type: "string", title: "Location" },
                referenceCheck: { type: "string", title: "Ref. Check" },
              },
            },
          },
        },
      },
    },

    {
      id: "averageStockMaintained",
      label: "Average Stock Maintained",
      schema: {
        type: "object",
        properties: {
          averageStockMaintained: {
            type: "number",
            title: "Average Stock Maintained",
          },
        },
      },
    },
    {
      id: "turnoverAndMargins",
      label: "Turnover & Margins",
      schema: {
        type: "object",
        properties: {
          turnover: {
            type: "number",
            title: "Turnover",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          margins: {
            type: "number",
            title: "Margins",
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
      id: "expenditureDetails",
      label: "Expenditure Details",
      schema: {
        type: "object",
        properties: {
          noOfEmployees: { type: "number", title: "No of Employees" },
          salaryPerMonthPerEmployee: {
            type: "number",
            title: "Salary per month per employee",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          statusOfEmployee: { type: "string", title: "Status of Employee" },
          noOfLabours: { type: "number", title: "No of Labours" },
          wagesPerMonthOrDay: {
            type: "number",
            title: "Wages per month/per day",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          statusOfLabour: { type: "string", title: "Status of Labour" },
        },
      },
    },

    {
      id: "workingHours",
      label: "Working Hours",
      schema: {
        type: "object",
        properties: {
          workingHours: { type: "string", title: "Working Hours" },
        },
      },
    },
    {
      id: "otherMajorExpensesAndBasis",
      label: "Other Major Expenses & Basis",
      schema: {
        type: "object",
        properties: {
          otherMajorExpensesAndBasis: {
            type: "string",
            title: "Other Major Expenses & Basis",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "assetDetails",
      label: "Asset Details",
      schema: {
        type: "object",
        properties: {
          assets: {
            type: "array",
            title: "Immovable Properties",
            items: {
              type: "object",
              properties: {
                assetAddress: { type: "string", title: "Address" },
                assetAreaMeasured: {
                  type: "string",
                  title: "Area measured (Sq.ft)",
                },
                assetPurchaseCost: {
                  type: "number",
                  title: "Purchase cost (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                purchaseYear: { type: "string", title: "Purchase Year" },
                marketValue: {
                  type: "number",
                  title: "Market value (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                ownerName: { type: "string", title: "Owner Name" },
                mortgaged: {
                  type: "string",
                  title: "Mortgaged",
                  enum: ["Yes", "No"],
                },
              },
              liquidMoveableAssets: {
                type: "string",
                title:
                  "Any Liquid, Moveable & Monetary items such as Cash, Gold, FD, RD, Mutual Funds, Shares, Bonds, Securities",
                ui: { widget: "textarea", rows: 3 },
              },
              insurances: {
                type: "string",
                title:
                  "Life insurance, mediclaim, property/asset insurance (premium & sum assured)",
                ui: { widget: "textarea", rows: 3 },
              },
              capitalInvestedBusiness: {
                type: "string",
                title:
                  "Capital Invested in any Business, Loans & Advances given",
                ui: { widget: "textarea", rows: 3 },
              },
              vehicles: {
                type: "string",
                title: "Car, Bike and Other Vehicles (Company Name and Model)",
                ui: { widget: "textarea", rows: 3 },
              },
            },
          },
        },
      },
    },

    {
      id: "existingLoans",
      label: "Existing Loans",
      schema: {
        type: "object",
        properties: {
          existingLoans: {
            type: "array",
            title: "Existing Loans",
            items: {
              type: "object",
              properties: {
                bankOrNbfcName: {
                  type: "string",
                  title: "Name of Bank / NBFC",
                },
                typeOfLoan: { type: "string", title: "Type of Loan" },
                sanctionedAmount: {
                  type: "number",
                  title: "Sanctioned Amount (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                emi: {
                  type: "number",
                  title: "EMI (in Rs.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                tenureRemaining: { type: "string", title: "Tenure (months)" },
                monthOnBooks: { type: "string", title: "Month on Books" },
                emiPaidBank: { type: "string", title: "EMI Paid Bank" },
                securedAgainstAsset: {
                  type: "string",
                  title: "Secured Against which Asset",
                },
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
          details: {
            type: "array",
            title: "Banking Details",
            items: {
              type: "object",
              properties: {
                bankName: { type: "string", title: "Bank Name" },
                branchName: { type: "string", title: "Branch Name" },
                accountType: { type: "string", title: "Account Type" },
                openSinceYear: { type: "string", title: "Open Since (Year)" },
              },
            },
          },
        },
      },
    },

    {
      id: "endUseOfLoan",
      label: "End Use of Loan",
      schema: {
        type: "object",
        properties: {
          endUseOfLoan: {
            type: "string",
            title: "End Use of Loan",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },

    {
      id: "detailsOfSecurityOffered",
      label: "Details of Security Offered",
      schema: {
        type: "object",
        properties: {
          addressofSecurity: {
            type: "string",
            title: "Address",
            ui: { widget: "textarea", rows: 3 },
          },
          detailsOfSecurity: {
            type: "array",
            title: "Details of Security",
            items: {
              type: "object",
              properties: {
                areaInSqFt: { type: "number", title: "Area Measurement" },
                agreementValue: {
                  type: "number",
                  title: "Agreement Value (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                purchaseCost: {
                  type: "number",
                  title: "Actual Purchase Cost (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                marketValue: {
                  type: "number",
                  title: "Market Value (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                ocrValue: {
                  type: "string",
                  title: "OCR (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                ocrPaidTillDate: {
                  type: "number",
                  title: "OCR paid till date (in Lakhs)",
                },
                ocrSource: { type: "string", title: "OCR Source" },
              },
            },
          },
        },
      },
    },
    {
      id: "thirdPartyConfirmation",
      label: "Third Party Confirmation",
      schema: {
        type: "object",
        properties: {
          thirdPartyConfirmation: {
            type: "array",
            title: "Third Party Confirmation",
            items: {
              type: "object",
              properties: {
                individualOrBusinessName: {
                  type: "string",
                  title: "Individual / Business Name",
                },
                address: { type: "string", title: "Address" },
                contactNo: { type: "number", title: "Contact No." },
                knowingSince: { type: "number", title: "Knowing Since" },
                feedbackOnBorrower: {
                  type: "string",
                  title: "Feedback on Borrower",
                },
                feedbackOnBusiness: {
                  type: "string",
                  title: "Feedback on Business",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "observations",
      label: "Observations",
      schema: {
        type: "object",
        properties: {
          observations: {
            type: "string",
            title: "Observations",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "otherIncome",
      label: "Other Income",
      schema: {
        type: "object",
        properties: {
          otherIncome: {
            type: "array",
            title: "Other Income",
            items: {
              type: "object",
              properties: {
                incomeAmount: {
                  type: "number",
                  title: "Income Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                details: { type: "string", title: "Details" },
                reference: { type: "string", title: "Reference" },
              },
            },
          },
        },
      },
    },

    {
      id: "remarks",
      label: "Remarks",
      schema: {
        type: "object",
        properties: {
          remarks: {
            type: "string",
            title: "Remarks",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    financialsSchema,
  ],
};
export default janaSenpAbove50lSchema;
