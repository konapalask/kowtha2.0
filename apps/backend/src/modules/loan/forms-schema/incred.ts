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
          nameOfApplicant: {
            type: "string",
            title: "Name of the Applicant",
            readOnly: true,
          },
          nameOfCoApplicant: {
            type: "string",
            title: "Name of the Co-Applicant",
          },
          visitedPremiseBusinessAddress: {
            type: "string",
            title: "Visited Premise / Business Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          personMeetOwnerOfTheBusinessWithContactNo: {
            type: "string",
            title: "Person Meet/owner of the business with Contact No",
          },
          dateTimeOfVisit: {
            type: "string",
            title: "Date & time of Visit",
            format: "datetime",
          },
          pdDoneByWithDesignation: {
            type: "string",
            title: "PD Done by with Designation",
          },
          loanAmtAppliedAndPurpose: {
            type: "string",
            title: "Loan Amt. Applied and Purpose",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
        required: ["applicationNo", "nameOfTheApplicantConcern"],
      },
      required: true,
    },
    {
      id: "applicantAndBusinessDetails",
      label: "Applicant and Business Details",
      schema: {
        type: "object",
        properties: {
          aboutTheApplicantOrBusiness: {
            type: "string",
            title: "About the Applicant/Business",
            ui: {
              widget: "textarea",
              rows: 8,
            },
          },
          aboutTheCoApplicant: {
            type: "string",
            title: "About the Co-Applicant",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          asPerAuditedItrsTurnover: {
            type: "number",
            title: "As Per Audited ITRs - Turnover",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          asPerAuditedItrsNetProfit: {
            type: "number",
            title: "As Per Audited ITRs - Net Profit",
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
      id: "asPerAssessment",
      label: "As Per Assessment",
      schema: {
        type: "object",
        properties: {
          receiptsPerMonth: {
            type: "number",
            title: "Receipts Per Month (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          purchasesPerMonth: {
            type: "number",
            title: "Purchases Per Month (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          expensesPerMonth: {
            type: "number",
            title: "Expenses Per Month (Rs.)",
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
      id: "noOfEmployees",
      label: "No. of Employees",
      schema: {
        type: "object",
        properties: {
          noOfEmployees: {
            type: "integer",
            title: "No. of Employees",
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
          debtors: {
            type: "object",
            properties: {
              fy2020to2021: {
                type: "number",
                title: "FY 2020-21",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              currentPeriodOrAtTimeOfPd: {
                type: "string",
                title: "Current Period / At Time of PD",
              },
              noOfDays: {
                type: "integer",
                title: "Credit Period allowed to Debtors - No. of Days",
              },
            },
          },
          creditors: {
            type: "object",
            properties: {
                fy2020to2021: {
                type: "number",
                title: "FY 2020-21",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
                currentPeriodOrAtTimeOfPd: {
                  type: "string",
                  title: "Current Period / At Time of PD",
                },
                noOfDays: {
                  type: "integer",
                  title: "Credit Period allowed by Creditors/Supplies - No. of Days",
                },
              },
            },
          },
          stock: {
            type: "object",
            properties: {
              fy2020to2021: {
                type: "number",
                title: "FY 2020-21",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
                currentPeriodOrAtTimeOfPd: {
                  type: "string",
                  title: "Current Period / At Time of PD",
                },
                noOfDays: {
                  type: "integer",
                  title: "Credit Period allowed by Creditors/Supplies - No. of Days"
                }
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "capitalInvestmentTillDate",
      label: "Capital Investment Till Date",
      schema: {
        type: "object",
        properties: {
          tillDate: {
            type: "number",
            title: "Till Date",
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
      id: "documentsObserved",
      label: "Documents Observed",
      schema: {
        type: "object",
        properties: {
          documentsObserved: {
            type: "string",
            title: "Documents observed/ Statutory requirement docs",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          docsVerified: {
            type: "string",
            title: "Docs Verified for P&L",
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
              },
          },
          noOfDependents: {
            type: "integer",
            title: "No. of Dependents",
          },
          generalLifestylePersonality: {
            type: "string",
            title: "General Lifestyle/Personality",
          },
        },
      },
      },
    },
    {
      id: "residenceOfficeCollateralDetails",
      label: "RESIDENCE/OFFICE/Collateral Details",
      schema: {
        type: "object",
        properties: {
          ownershipAndNameOfOwners: {
            type: "string",
            title: "OWNERSHIP AND NAME OF OWNERS",
          },
          officePremisesDetails: {
            type: "string",
            title: "OFFICE PREMISES DETAILS",
          },
          residenceCurrentAddressDetails: {
            type: "string",
            title: "RESIDENCE/CURRENT ADDRESS DETAILS",
          },
          collateralDescriptionAndTypeApproxValue: {
            type: "string",
            title: "COLLATERAL DESCRIPTION AND TYPE & Approx Value",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "otherLiabilitiesLoansApplicantCoApplicants",
      label: "Other Liabilities / Loans (Applicant/Co-Applicants)",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            financier: {
              type: "string",
              title: "Financier",
            },
            natureOfLoan: {
              type: "string",
              title: "Nature of Loan / Account No.",
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
              willCloseContinue: {
                type: "string",
                title: "Will Close / Continue",
                enum: ["Close", "Continue"],
              },
              
            },
          },
        },
      },
    },   
    {
      id: "chitFundetc",
      label: "Chit fund, Private Finance and Hand loans etc",
      schema: {
        type: "object",
        properties: {
          chitFundetc: {
            type: "string",
            title: "Chit fund, Private Finance and Hand loans etc",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    }, 
    {
      id: "otherAssets",
      label: "Other Assets",
      schema: {
        type: "object",
        properties: {
          otherAssets: {
            type: "string",
            title: "Other Assets",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id:"otherSourcesOfIncome",
      label: "Other Sources of Income",
      schema: {
        type: "object",
        properties: {
          otherSourcesOfIncome: {
            type: "string",
            title: "Other Sources of Income",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    
    {
      id: "references",
      label: "References",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            nameOfThePerson: {
              type: "string",
              title: "Name of the Person",
            },
            telephoneNoAddressForCommunication: {
              type: "string",
              title: "Telephone No. / Address for Communication",
            },
            supplierOrBuyerOrMarketReference: {
              type: "string",
              title: "Supplier / Buyer / Market Reference",
            },
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
          observationsRemarksDuringPd: {
            type: "string",
            title: "Observations/Remarks During PD",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
      required: true,
    },
    statement2Schema,
  ],
} as const;
export default incredSchema;
