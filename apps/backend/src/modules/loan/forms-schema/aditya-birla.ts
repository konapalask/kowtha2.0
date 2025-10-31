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
            type: "string",
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
      id: "businessOverview",
      label: "Business Overview",
      schema: {
        type: "object",
        properties: {
          aboutBusiness: {
            type: "string",
            title: "Business profile",
            ui: { widget: "textarea", rows: 3 },
          },
          vendorsSuppliers: {
            type: "string",
            title: "Vendors / Suppliers to applicant",
          },
          businessTransaction: {
            type: "string",
            title: "Business transaction",
          },
          stockObserved: {
            type: "string",
            title: "Stock observed",
          },
          reasonForNoStock: {
            type: "string",
            title: "Reason if no stock observed",
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
          mainProduct: { type: "string", title: "Main Product" },
          mainRawMaterial: { type: "string", title: "Main Raw Material" },
          vendors: {
            type: "string",
            title: "Major Vendors",
          },
          businessPremiseOwnership: {
            type: "string",
            title: "Business premises ownership",
          },
          actualMonthlySales: {
            type: "string",
            title: "Monthly sales / receipts",
          },
          percentageSalesOnCredit: {
            type: "string",
            title: "Sales on credit (%)",
          },
          manufacturingDetails: {
            type: "string",
            title: "Manufacturing / trading details",
          },
          salesConcentration: {
            type: "string",
            title: "Sales concentration >50% on one party?",
          },
          debtorsCycle: {
            type: "string",
            title: "Business cycle – debtors",
          },
          creditorsCycle: {
            type: "string",
            title: "Business cycle – creditors",
          },
          stockValuation: {
            type: "string",
            title: "Stock valuation",
          },
          netMargins: {
            type: "string",
            title: "Gross & net margins",
          },
          monthlyNetSavings: {
            type: "string",
            title: "Monthly net saving",
          },
          majorCustomers: {
            type: "string",
            title: "Main customers in the business",
          },
          salesPaymentTerms: {
            type: "string",
            title: "Sales payment terms",
          },
          gstRegistration: {
            type: "string",
            title: "GST registration",
          },
          itrsFiling: { type: "string", title: "ITRs filing" },
        },
      },
    },
    {
      id: "employeesInfrastructure",
      label: "Employees & Infrastructure",
      schema: {
        type: "object",
        properties: {
          numberOfEmployees: {
            type: "string",
            title: "Number of employees",
          },
          salaries: {
            type: "string",
            title: "Salaries payout",
          },
          godownAddress: {
            type: "string",
            title: "Godown address (if any)",
          },
          otherBusinessDetails: {
            type: "string",
            title: "Other business details",
            ui: { widget: "textarea", rows: 2 },
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
          detailedObservations: {
            type: "string",
            title: "Detailed observations",
            ui: { widget: "textarea", rows: 6 },
          },
          concerns: {
            type: "string",
            title: "Concerns",
          },
          statusOfPd: {
            type: "string",
            title: "Status of PD",
            enum: ["Positive", "Negative", "Referred"],
          },
          pdConductedBy: {
            type: "string",
            title: "PD conducted by (Name & designation)",
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default adityaBirlaSchema;
