export const heroFincorpSchema = {
  id: 13,
  bankName: "Hero Fincorp",
  sections: [
    {
      id: "general",
      label: "General",
      schema: {
        type: "object",
        properties: {
          nameOfApplicantContactPerson: {
            type: "string",
            title: "Name of Applicant / Contact Person",
            readOnly: true,
          },
          nameOfConcern: {
            type: "string",
            title: "Name of Concern",
            readOnly: true,
          },
          officeAddress: {
            type: "string",
            title: "Office Address",
            readOnly: true,
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
        required: ["nameOfApplicantContactPerson", "nameOfConcern"],
      },
      required: true,
    },
    {
      id: "appointmentFixed",
      label: "Appointment Fixed",
      schema: {
        type: "object",
        properties: {
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          structureOfLoan: {
            type: "number",
            title: "Structure of Loan",
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
      id: "loanAmount",
      label: "Loan Amount",
      schema: {
        type: "object",
        properties: {
          noOfVisit: {
            type: "integer",
            title: "No. of Visit",
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
          aboutTheApplicant: {
            type: "string",
            title: "About the Applicant",
          },
        },
      },
      required: true,
    },
    {
      id: "applicantFamilyDetailsNumberOfMembersEtc",
      label: "Applicant Family Details (number of members, etc.)",
      schema: {
        type: "object",
        properties: {
          aboutTheBusiness: {
            type: "string",
            title: "About the Business",
          },
        },
      },
      required: true,
    },
    {
      id: "ay",
      label: "AY",
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
          netMargin: {
            type: "number",
            title: "Net Margin (%)",
          },
          documentsObservedEGGstCertificateItrsBankStatement: {
            type: "string",
            title:
              "Documents Observed (e.g., GST Certificate, ITRs, Bank Statement)",
          },
          automationLevelBusinessActivityAndStockSeen: {
            type: "string",
            title: "Automation Level (Business Activity and Stock seen)",
          },
        },
      },
      required: true,
    },
    {
      id: "customers",
      label: "Customers",
      schema: {
        type: "object",
        properties: {
          customerName: {
            type: "string",
            title: "Customer Name",
          },
          customerNumber: {
            type: "string",
            title: "Customer Number",
            pattern: "^[0-9]{10}$",
          },
          purchases: {
            type: "string",
            title: "Purchases",
          },
          supplierName: {
            type: "string",
            title: "Supplier Name",
          },
          supplierNumber: {
            type: "string",
            title: "Supplier Number",
            pattern: "^[0-9]{10}$",
          },
          margins: {
            type: "string",
            title: "Margins",
          },
          netMargin: {
            type: "number",
            title: "Net Margin (%)",
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
          noOfWorkers: {
            type: "integer",
            title: "No. of Workers",
          },
          assets: {
            type: "string",
            title: "Assets",
          },
        },
      },
      required: true,
    },
    {
      id: "emi",
      label: "EMI",
      schema: {
        type: "object",
        properties: {
          endUsePurposeOfLoan: {
            type: "string",
            title: "End Use(Purpose of Loan)",
          },
          securityOfferedTypeOfSecurityEGOwnHouseProperty: {
            type: "string",
            title:
              "Security Offered(Type of Security (e.g., Own House Property))",
          },
          address: {
            type: "string",
            title: "Address",
          },
          observations: {
            type: "string",
            title: "Observations",
          },
          concerns: {
            type: "string",
            title: "Concerns",
          },
          otherBusinessIncomeDetails: {
            type: "number",
            title: "Other Business / Income Details",
          },
          statusOfThisCasePositiveNegativeCreditRefer: {
            type: "string",
            title: "Status of this Case - Positive/Negative/Credit Refer",
          },
          place: {
            type: "string",
            title: "Place",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default heroFincorpSchema;
