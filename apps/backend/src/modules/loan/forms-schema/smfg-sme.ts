import financialsSchema from "../financials-schema/generic";
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
            readOnly: true,
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
            type: "integer",
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
          businessName: {
            type: "string",
            title: "Name of Business",
            readOnly: true,
          },
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
            title: "Name of Partners/Directors and share %",
            ui: { widget: "textarea", rows: 2 },
          },
          customerType: {
            type: "string",
            title: "Type of Customer",
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
            type: "boolean",
            title: "Whether sales concentration is >50% on one party.",
          },
          salesConcentrationPartyName: {
            type: "string",
            title: "Name of Party",
            dependencies: {
              show: {
                salesConcentration: true,
              },
              required: {
                salesConcentration: true,
              },
            },
          },
          salesConcentrationPartyContactNo: {
            type: "number",
            title: "Contact Number of Party",
            dependencies: {
              show: {
                salesConcentration: true,
              },
              required: {
                salesConcentration: true,
              },
            },
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
            title: "Monthly Net Saving after all Expenses (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          majorSuppliers: {
            type: "array",
            title: "Name and contact no of two major suppliers",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name of Supplier" },
                contactNo: { type: "number", title: "Contact No of Supplier" },
              },
            },
          },
          majorCustomers: {
            type: "array",
            title: "Name and contact no of two major buyers",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name of Buyer" },
                contactNo: { type: "number", title: "Contact No of Buyer" },
              },
            },
          },
          numberOfEmployees: {
            type: "integer",
            title: "Number of Employees",
          },
          nameBoardSeen: {
            type: "string",
            title: "Name Board Seen? What was written",
          },
          premiseType: {
            type: "string",
            title: "Locality of Business / Office",
          },
          isResidenceCumOffice: {
            type: "string",
            title: "Whether Residence cum Office setup",
            enum: ["Yes", "No"],
          },
          taxApplicability: {
            type: "string",
            title:
              "Applicability of VAT / Excise / Service Tax and rate of same",
          },
          latestTaxReturn: {
            type: "string",
            title: "Latest Qtr VAT return value/Service tax paid",
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
          entityInvolvementCommercialEtc: {
            type: "string",
            title:
              "Is the entity involved in any commercial pest control operation, use any Ozone depleting substance, hazardous chemicals, bio medical waste, Dyes, forest products, tobacco, alcohol, weapons, gambling, radioactive materials, unbounded asbestos, harmful fishing practice, commercial logging.",
            enum: ["Yes", "No"],
          },
          entityInvolvementForceLabourEtc: {
            type: "string",
            title:
              "Does the entity involve in Child or forced Labour or business involve displacement of people, impact on indigenous people or established in land designated as forest or forest products",
            enum: ["Yes", "No"],
          },
          entityConsent: {
            type: "string",
            title:
              "Does the entity have required consent of establishment from State pollution control board and other government authorities on establishment in Wetland Area, near National Park, Sanctuaries or Forest areas, ASI certificate for establishment up to 300 meters near a protected monument or cultural heritage, 500 meters near Coastal Regulation Zone",
            enum: ["Yes", "No"],
          },
          entityPollutants: {
            type: "string",
            title:
              "Does the entity involves in proper mechanism for treatment or disposal of waste and does not emit air, water or noise pollutants.",
            enum: ["Yes", "No"],
          },
          entityESSGuidelines: {
            type: "string",
            title: "Does the Entity comply with the above ESS guidelines",
            enum: ["Yes", "No"],
          },
          otherESSNotes: {
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
      label: "Banking Details",
      schema: {
        type: "object",
        properties: {
          bankingAccounts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: { type: "string", title: "Bank Name" },
                accountType: {
                  type: "string",
                  title: "Account Type",
                  enum: ["Current", "Savings", "CC/OD"],
                },
                vintage: { type: "string", title: "Vintage of account" },
                ifCcOdLimitWhatIsLimitMinBal: { type: "string", title: "CC/OD Min Balance" },
                customerBehavior: {
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
          loanAmountApplied: {
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
            title: "PD Status",
            enum: ["Positive", "Negative", "Credit Refer"],
          },
          pdDate: {
            type: "string",
            title: "PD Date",
            format: "date",
          },
          pdTime: {
            type: "string",
            title: "PD Time",
            format: "time",
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default smfgSmeSchema;
