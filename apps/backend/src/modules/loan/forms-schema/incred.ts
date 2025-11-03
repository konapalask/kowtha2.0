import statement2Schema from "../financials-schema/statement2";
export const incredSchema = {
  id: 20,
  bankName: "INCRED",
  sections: [
    {
      id: "general",
      label: "General",
      schema: {
        type: "object",
        properties: {
          applicationNo: {
            type: "integer",
            title: "Application No",
            readOnly: true,
          },
          nameOfTheApplicantConcern: {
            type: "string",
            title: "Name of the Applicant/Concern",
            readOnly: true,
          },
          nameOfCoApplicantCoApplicantS: {
            type: "string",
            title: "Name of Co-Applicant / Co-applicant's",
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
        required: ["applicationNo", "nameOfTheApplicantConcern"],
      },
      required: true,
    },
    {
      id: "dateTimeOfVisit",
      label: "Date & time of Visit",
      schema: {
        type: "object",
        properties: {
          pdDoneByWithDesignation: {
            type: "string",
            title: "PD Done by with Designation",
          },
        },
      },
      required: true,
    },
    {
      id: "loanAmtAppliedAndPurpose",
      label: "Loan Amt. Applied and Purpose",
      schema: {
        type: "object",
        properties: {
          aboutTheApplicantBusiness: {
            type: "string",
            title: "About the Applicant/Business",
          },
          aboutTheCoApplicant: {
            type: "string",
            title: "About the Co-Applicant",
          },
          asPerAuditedItrs: {
            type: "string",
            title: "As Per Audited ITRs",
          },
          turnoverRs: {
            type: "number",
            title: "Turnover (Rs.)",
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
      id: "netProfitRs",
      label: "Net Profit (Rs.)",
      schema: {
        type: "object",
        properties: {
          asPerAssessment: {
            type: "string",
            title: "As Per Assessment",
          },
          receiptsPerMonthRs: {
            type: "number",
            title: "Receipts Per Month (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          purchasesPerMonthRs: {
            type: "number",
            title: "Purchases Per Month (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          expensesPerMonthRs: {
            type: "number",
            title: "Expenses Per Month (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          whetherRegisteredUnderMsme: {
            type: "boolean",
            title: "Whether registered under MSME",
          },
          whetherRegisteredUnderGst: {
            type: "boolean",
            title: "Whether Registered under GST",
          },
        },
      },
      required: true,
    },
    {
      id: "debtorsCreditorsStock",
      label: "Debtors, Creditors & Stock",
      schema: {
        type: "object",
        properties: {
          fyEGFy202526: {
            type: "string",
            title: "FY (e.g., FY 2025-26)",
          },
          currentPeriodAtTimeOfPd: {
            type: "number",
            title: "Current Period / At Time of PD",
          },
          noOfDays: {
            type: "integer",
            title: "No. of Days",
          },
        },
      },
      required: true,
    },
    {
      id: "creditPeriodAllowedByCreditorsSupplies",
      label: "Credit Period allowed by Creditors/Supplies",
      schema: {
        type: "object",
        properties: {
          stock: {
            type: "string",
            title: "Stock",
          },
          capitalInvestmentTillDate: {
            type: "number",
            title: "Capital Investment Till Date",
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
      id: "personalDetailsFamilyBackground",
      label: "Personal Details – Family Background",
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Name",
          },
          relation: {
            type: "string",
            title: "Relation",
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
          noOfDependents: {
            type: "integer",
            title: "No. of Dependents",
          },
        },
      },
      required: true,
    },
    {
      id: "otherLiabilitiesLoansApplicantCoApplicants",
      label: "Other Liabilities / Loans (Applicant/Co-Applicants)",
      schema: {
        type: "object",
        properties: {
          financier: {
            type: "string",
            title: "Financier",
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
          willCloseContinue: {
            type: "string",
            title: "Will Close / Continue",
          },
        },
      },
      required: true,
    },
    {
      id: "references",
      label: "References",
      schema: {
        type: "object",
        properties: {
          sNo: {
            type: "integer",
            title: "S No",
          },
          nameOfThePerson: {
            type: "string",
            title: "Name of the Person",
          },
        },
      },
      required: true,
    },
    {
      id: "observationsRemarksDuringPd",
      label: "Observations/Remarks During PD",
      schema: {
        type: "object",
        properties: {
          estimatedIncome: {
            type: "number",
            title: "Estimated Income",
          },
        },
      },
      required: true,
    },
    {
      id: "theGrossSalesAsPerOurAssumptions",
      label: "The Gross Sales as per our assumptions",
      schema: {
        type: "object",
        properties: {
          pbditMargin: {
            type: "number",
            title: "PBDIT Margin",
          },
          thePatOfTheBusinessConcernRs: {
            type: "string",
            title: "The PAT of the Business Concern (Rs.)",
          },
          overallPositivesNegatives: {
            type: "string",
            title: "Overall Positives / Negatives",
          },
          acceptReject: {
            type: "string",
            title: "Accept / Reject",
          },
        },
      },
      required: true,
    },
    statement2Schema,
  ],
} as const;
export default incredSchema;
