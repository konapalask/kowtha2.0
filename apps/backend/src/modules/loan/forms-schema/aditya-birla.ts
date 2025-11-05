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
            type: "string",
            title: "Contact number",
          },
          tin: { type: "string", title: "TIN" },
          pan: { type: "string", title: "PAN" },
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
          businessName: { type: "string", title: "Business name" },
          previousExperience: { type: "string", title: "Previous experience" },
          businessPremises: { type: "string", title: "Business premises" },
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
                relation: { type: "string", title: "Relation" },
                age: { type: "string", title: "Age" },
                businessName: { type: "string", title: "Business name" },
                education: { type: "string", title: "Education" },
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
          salesBills: { type: "number", title: "Sales bills" },
          purchaseBills: { type: "number", title: "Purchase bills" },
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
          statusOfPd: { type: "string", title: "Status" },
          loanAmountApplied: {
            type: "number",
            title: "Loan amount applied",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },

          purposeOfLoan: { type: "string", title: "Purpose of loan" },
          particulars: {
            type: "array",
            items: {
              type: "object",
              properties: {
                particulars: { type: "string", title: "Particulars" },
                units: { type: "string", title: "Units" },
                charge: { type: "string", title: "Charge" },
                total: { type: "string", title: "Total" },
              },
            },
          },
          dailyGrossIncome: { type: "number", title: "Daily gross income" },
          labourMaterialEveryday: {
            type: "number",
            title: "Labour & material (Everyday)",
          },
          netIncomeDay: { type: "number", title: "Net income / day" },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default adityaBirlaSchema;
