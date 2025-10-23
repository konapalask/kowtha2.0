export const smfgSmeSchema = {
  id: 25,
  bankName: "SMFG SME",
  sections: [
    {
      id: "generalInfo",
      label: "General Information",
      schema: {
        type: "object",
        properties: {
          branchName: {
            type: "string",
            title: "Branch Name",
          },
          applicationReferenceNo: {
            type: "string",
            title: "Application Reference No.",
            readOnly: true,
          },
          applicantName: {
            type: "string",
            title: "Applicant Name",
            readOnly: true,
          },
          applicantOfficeAddress: {
            type: "string",
            title: "Applicant Office Address",
            ui: { widget: "textarea", rows: 2 },
          },
          personMetName: {
            type: "string",
            title: "Person Met - Name",
          },
          personMetDesignation: {
            type: "string",
            title: "Person Met - Designation",
          },
          personMetMobileNo: {
            type: "string",
            title: "Person Met - Mobile No",
          },
        },
      },
      required: true,
    },
    {
      id: "personalInformation",
      label: "Personal Information",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            title: "Family Members (Name / Age / Occupation)",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                age: { type: "integer", title: "Age" },
                occupation: { type: "string", title: "Occupation" },
                isDependent: {
                  type: "string",
                  title: "Dependent",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
          residenceAddress: {
            type: "string",
            title: "Residence Address",
            ui: { widget: "textarea", rows: 2 },
          },
          ownershipStatus: {
            type: "string",
            title: "Residence Ownership",
            enum: ["Self Owned", "Parental", "Rented"],
          },
          houseArea: {
            type: "string",
            title: "Area of the House Property",
          },
          houseMarketValue: {
            type: "number",
            title: "Estimated Market Value",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          yearsAtResidence: {
            type: "string",
            title: "Years at Same Residence",
          },
          yearsInCity: {
            type: "string",
            title: "Years in Same City",
          },
          permanentAddress: {
            type: "string",
            title: "Permanent Address",
            ui: { widget: "textarea", rows: 2 },
          },
          otherOwnedProperty: {
            type: "string",
            title: "Other Owned Property in City",
          },
          otherIncomeSources: {
            type: "string",
            title: "Any other source of income apart from this business",
            ui: { widget: "textarea", rows: 2 },
          },
        },
      },
    },
    {
      id: "businessInformation",
      label: "Business Information",
      schema: {
        type: "object",
        properties: {
          businessName: { type: "string", title: "Name of Business" },
          natureOfBusiness: { type: "string", title: "Nature of Business" },
          constitution: {
            type: "string",
            title: "Constitution",
            enum: [
              "Proprietorship",
              "Partnership",
              "Private Limited",
              "LLP",
              "Other",
            ],
          },
          partners: {
            type: "string",
            title: "Partners / Directors and Share %",
            ui: { widget: "textarea", rows: 2 },
          },
          customerType: {
            type: "string",
            title: "Type of Customer",
          },
          businessStartDate: {
            type: "string",
            title: "Business Started Since",
          },
          promoterExperience: {
            type: "string",
            title: "Promoter Experience (Years)",
          },
          stabilityYears: {
            type: "integer",
            title: "Stability in Same Business (Years)",
          },
          stabilityVerifiedBy: {
            type: "string",
            title:
              "Stability Verified By (Registration / Distribution / Dealership Letter)",
          },
          familyInvolved: {
            type: "string",
            title: "Family Structure Involved in Business",
          },
          premisesOwnership: {
            type: "string",
            title: "Business Premises Ownership",
            enum: ["Owned", "Rented", "Parental"],
          },
          premiseType: {
            type: "string",
            title: "Locality of Business / Office",
          },
          isResidenceCumOffice: {
            type: "string",
            title: "Residence cum Office setup",
            enum: ["Yes", "No"],
          },
          nameBoardSeen: {
            type: "string",
            title: "Name Board Seen? What was written",
          },
        },
      },
    },
    {
      id: "financials",
      label: "Financials & Operations",
      schema: {
        type: "object",
        properties: {
          monthlySales: {
            type: "number",
            title: "Actual Monthly Sales / Receipts",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          percentSalesOnCredit: {
            type: "number",
            title: "Sales on Credit (%)",
          },
          manufacturingProcess: {
            type: "string",
            title: "Manufacturing Process / Trading Details",
            ui: { widget: "textarea", rows: 3 },
          },
          salesConcentration: {
            type: "string",
            title: "Is sales concentration >50% on one party?",
          },
          businessCycleDebtors: {
            type: "string",
            title: "Business Cycle - Debtors (credit days & amount)",
          },
          businessCycleCreditors: {
            type: "string",
            title: "Business Cycle - Creditors (credit days & amount)",
          },
          stockValuation: {
            type: "string",
            title: "Stock valuation as on date",
          },
          grossMargin: {
            type: "string",
            title: "Gross & Net Margins in Business",
          },
          netSavings: {
            type: "number",
            title: "Monthly Net Saving after Expenses (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          numberOfEmployees: {
            type: "integer",
            title: "Number of Employees",
          },
          majorSuppliers: {
            type: "array",
            title: "Major Suppliers",
            items: {
              type: "string",
              title: "Supplier",
            },
          },
          majorCustomers: {
            type: "array",
            title: "Major Customers",
            items: {
              type: "string",
              title: "Customer",
            },
          },
          registrationCertifications: {
            type: "string",
            title: "Registration / Certification Details",
          },
          taxApplicability: {
            type: "string",
            title: "Applicability of VAT / Excise / Service Tax",
          },
          latestTaxReturn: {
            type: "string",
            title: "Latest Quarter VAT / Service Tax Paid",
          },
        },
      },
    },
    {
      id: "essChecklist",
      label: "Environmental and Social Safeguards (ESS)",
      schema: {
        type: "object",
        properties: {
          essResponses: {
            type: "array",
            title: "ESS Checklist Responses",
            items: {
              type: "object",
              properties: {
                question: { type: "string", title: "Question" },
                response: {
                  type: "string",
                  title: "Response",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
          essOthers: {
            type: "string",
            title: "Other ESS notes",
            ui: { widget: "textarea", rows: 2 },
          },
        },
      },
    },
    {
      id: "existingLoans",
      label: "Existing Loan Details",
      schema: {
        type: "object",
        properties: {
          existingLoans: {
            type: "array",
            items: {
              type: "object",
              properties: {
                loanType: { type: "string", title: "Type of Loan" },
                bankName: { type: "string", title: "Bank Name" },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                emi: {
                  type: "number",
                  title: "EMI",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                tenureRemaining: { type: "string", title: "Tenure Remaining" },
              },
            },
          },
        },
      },
    },
    {
      id: "bankingBehaviour",
      label: "Banking Behaviour",
      schema: {
        type: "object",
        properties: {
          bankingAccounts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: { type: "string", title: "Bank Name" },
                accountNumber: { type: "string", title: "Account Number" },
                accountType: {
                  type: "string",
                  title: "Account Type",
                  enum: ["Current", "Savings", "CC/OD"],
                },
                operatingSince: {
                  type: "string",
                  title: "Operating Since",
                },
                vintage: { type: "string", title: "Vintage of account" },
                minBalance: { type: "string", title: "CC/OD Min Balance" },
                customerBehaviour: {
                  type: "string",
                  title: "Customer Behaviour",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "loanPurposeAndUse",
      label: "Loan Purpose & Usage",
      schema: {
        type: "object",
        properties: {
          detailedPurpose: {
            type: "string",
            title: "Detailed Purpose / End Use of Loan Amount",
            ui: { widget: "textarea", rows: 2 },
          },
          appliedLoanAmount: {
            type: "number",
            title: "Applied Loan Amount",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
    },
    {
      id: "observations",
      label: "Observations & Conclusion",
      schema: {
        type: "object",
        properties: {
          positiveObservations: {
            type: "string",
            title: "Detailed Observations (Positive & Negative)",
            ui: { widget: "textarea", rows: 6 },
          },
          concerns: {
            type: "string",
            title: "Concerns",
            ui: { widget: "textarea", rows: 3 },
          },
          pdStatus: {
            type: "string",
            title: "Status of PD",
            enum: ["Positive", "Negative", "Referred"],
          },
          pdConductedBy: {
            type: "string",
            title: "PD Conducted By (Name & Designation)",
          },
        },
      },
    },
  ],
} as const;

export default smfgSmeSchema;
