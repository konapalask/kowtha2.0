import financialsSchema from "../financials-schema/generic";

export const adityaBirlaSchema = {
  id: 7,
  bankName: "Aditya Birla",
  sections: [
    {
      id: "proposalInfo",
      label: "Proposal Information",
      schema: {
        type: "object",
        properties: {
          proposalNumber: {
            type: "string",
            title: "Proposal No.",
            readOnly: true,
          },
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          timeOfVisit: {
            type: "string",
            title: "Time of Visit",
            format: "time",
          },
        },
      },
    },
    {
      id: "applicantDetails",
      label: "Applicant Details",
      schema: {
        type: "object",
        properties: {
          nameOfApplicant: {
            type: "string",
            title: "Name of Applicant",
            readOnly: true,
          },
          nameOfCoApplicant: {
            type: "string",
            title: "Name of Co-applicant",
          },
          nameOfBusiness: {
            type: "string",
            title: "Name of Business",
            readOnly: true,
          },
          businessAddress: {
            type: "string",
            title: "Business Address",
            ui: { widget: "textarea", rows: 2 },
            readOnly: true,
          },
          yearsInCurrentAddress: {
            type: "number",
            title: "No. of years in current address",
          },
          constitutionOfBusiness: {
            type: "string",
            title: "Constitution of Business",
          },
        },
      },
    },
    {
      id: "partnersManagement",
      label: "Partners / Management",
      schema: {
        type: "object",
        properties: {
          otherPartners: {
            type: "string",
            title: "Names of other partners / directors",
          },
          management: { type: "string", title: "Management" },
          contactNumber: {
            type: "integer",
            title: "Contact number",
          },
          tin: { type: "string", title: "TIN" },
          pan: {
            type: "string",
            title: "PAN",
            pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            description: "PAN format: ABCDE1234F",
          },
          certificateOfIncorporation: {
            type: "string",
            title: "Certificate of Incorporation",
          },
        },
      },
    },
    {
      id: "documentVerification",
      label: "Document Verification",
      schema: {
        type: "object",
        properties: {
          documentsVerified: {
            type: "string",
            title: "Documents verified",
            ui: { widget: "textarea", rows: 4 },
          },
        },
      },
    },
    {
      id: "natureOfBusiness",
      label: "Nature of Business",
      schema: {
        type: "object",
        properties: {
          natureOfBusiness: { type: "string", title: "Nature of Business" },
          mainProduct: { type: "string", title: "Main Product" },
          mainRawMaterial: { type: "string", title: "Main Raw Material" },
          vendorsSuppliersToApplicant: {
            type: "string",
            title: "Vendors / Suppliers to applicant",
          },
        },
      },
    },

    {
      id: "businessOverview",
      label: "Business Overview",
      schema: {
        type: "object",
        properties: {
          businessTransaction: {
            type: "string",
            title: "Business transaction",
          },
          stockObserved: {
            type: "number",
            title: "Stock observed",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          reasonForNoStock: {
            type: "string",
            title: "If no stocks observed, reason for the same",
          },
          businessActivityObserved: {
            type: "string",
            title: "Business activity observed",
          },
        },
      },
    },
    {
      id: "salesFinancials",
      label: "Sales, Customers & Financials",
      schema: {
        type: "object",
        properties: {
          mainCustomers: {
            type: "string",
            title: "Main customers in the business",
          },
          salesPaymentTerms: { type: "string", title: "Sales payment terms" },
          gstRegistration: { type: "string", title: "GST registration" },
          itrsFiling: { type: "string", title: "ITRs filing" },
          numberOfEmployees: {
            type: "number",
            title: "Number of employees (Co- applicant)",
          },
          godownAddress: { type: "string", title: "Godown address (if any)" },
          otherBusinessDetails: {
            type: "string",
            title: "Other business details (if any)",
          },
        },
      },
    },

    {
      id: "businessProfile",
      label: "Business Profile",
      schema: {
        type: "object",
        properties: {
          applicantSummary: { type: "string", title: "Applicant summary" },
          nativePlace: { type: "string", title: "Native Place" },
          businessSince: {
            type: "string",
            title: "Business since",
          },
          previousExperience: { type: "string", title: "Previous experience" },
          businessPremises: {
            type: "string",
            title: "Business premises",
            readOnly: true,
          },
          ifRented: { type: "string", title: "If rented" },
          businessPremisesInSqFt: {
            type: "string",
            title: "Business premises in Sq. ft",
          },
          marketReferenceFrom: {
            type: "string",
            title: "Market reference from",
          },
          vendorsContactDetails: {
            type: "string",
            title: "Vendors contact details",
          },
          dailySalesMonthlySales: {
            type: "string",
            title: "Daily sales/ monthly sales",
          },
          personalDetailsSummary: {
            type: "string",
            title: "About personal details",
          },
        },
      },
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
                name: { type: "string", title: "Name" },
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
                },
                age: { type: "integer", title: "Age" },
                occupation: { type: "string", title: "Occupation" },
                education: {
                  type: "string",
                  title: "Education",
                  enum: [
                    "Below 10th",
                    "10th pass",
                    "12th pass",
                    "Diploma/ITI certification",
                    "Graduate",
                    "PG/Professional Certification",
                  ],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "observations",
      label: "Business Details & Observations",
      schema: {
        type: "object",
        properties: {
          salesBills: { type: "string", title: "Sales bills" },
          purchaseBills: { type: "string", title: "Purchase bills" },
          neighbourCheckName: { type: "string", title: "Neighbour check name" },
          neighbourCheckNumber: {
            type: "string",
            title: "Neighbour check number",
          },
          cibilDetails: { type: "string", title: "Cibil details" },
          previousLoans: {
            type: "string",
            title: "Previous loans",
            ui: { widget: "textarea", rows: 4 },
          },
          bankingDetails: { type: "string", title: "Banking details" },
          firmAccount: { type: "string", title: "Firm account" },
          savingsAccount: { type: "string", title: "Savings account" },
          assetsDetails: { type: "string", title: "Assets details" },
          otherIncome: { type: "string", title: "Other income" },
          businessMachinery: { type: "string", title: "Business machinery" },
          observation: {
            type: "string",
            title: "Observation",
            ui: { widget: "textarea", rows: 6 },
          },
          concernsDeviations: {
            type: "string",
            title: "Concerns / Deviations",
            ui: { widget: "textarea", rows: 4 },
          },
          statusOfPd: { type: "string", title: "Status" ,enum: ["Positive", "Negative", "Credit Refer"]},
        },
      },
    },
    {
      id: "loanDetails",
      label: "Loan Details",
      schema: {
        type: "object",
        properties: {
          loanAmountApplied: {
            type: "number",
            title: "Loan amount applied",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
            readOnly: true,
          },
          purposeOfLoan: {
            type: "string",
            title: "Purpose of loan",
            readOnly: true,
          },
        },
      },
    },
    {
      id: "dailyIncomeCalculation",
      label: "Daily Income Calculation",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "array",
            title: "Details",
            items: {
              type: "object",
              properties: {
                particulars: { type: "string", title: "Particulars" },
                units: { type: "string", title: "Units" },
                charge: { type: "string", title: "Charge" },
                total: {
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
          dailyGrossIncome: {
            type: "number",
            title: "Daily Gross Income (Total)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          labourAndMaterialEveryday: {
            type: "number",
            title: "Labour & Material (Total)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netIncomePerDay: {
            type: "number",
            title: "Net Income/Day (Total)",
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
      id: "applicantsMonthlyExpensesOfTheBusiness",
      label: "Applicant's Monthly Expenses of the business",
      schema: {
        type: "object",
        properties: {
          salesDetails: {
            type: "number",
            title: "Sales",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          purchaseDetails: {
            type: "number",
            title: "Purchase",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          rentDetails: {
            type: "number",
            title: "Rent",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          salaryAndWagesDetails: {
            type: "number",
            title: "Salary and Wages",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          transportDetails: {
            type: "number",
            title: "Transport Charges",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          electricityDetails: {
            type: "number",
            title: "Electricity Bill",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          otherExpensesDetails: {
            type: "number",
            title: "Other Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          totalExpenses: {
            type: "number",
            title: "Total Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
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
          netMargin: { type: "number", title: "Net Margin" },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default adityaBirlaSchema;
