import statement4Schema from "../financials-schema/statement4";
export const heroFincorpSchema = {
  id: 13,
  bankName: "Hero Fincorp",
  sections: [
    {
      id: "basicDetails",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          applicantName: {
            type: "string",
            title: "Name of Applicant / Contact Person",
            readOnly: true,
          },
          concernName: {
            type: "string",
            title: "Name of Concern",
            readOnly: true,
          },
          officeAddress: {
            type: "string",
            title: "Office Address",
            readOnly: true,
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          phoneNumber: {
            type: "integer",
            title: "Phone Number",
          },
          appointmentFixed: {
            type: "string",
            format: "time",
            title: "Appointment Fixed",
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
          numberOfVisits: {
            type: "string",
            title: "No. of Visit",
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
          verifierNotes: {
            type: "string",
            title:
              "Verbal declaration / notes based on information provided by applicant",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
        },
      },
    },
    {
      id: "applicantProfile",
      label: "About the Applicant",
      schema: {
        type: "object",
        properties: {
          applicantSummary: {
            type: "string",
            title: "Applicant Summary",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
          familyMembers: {
            type: "array",
            title: "Family Members",
            minItems: 1,
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
                qualification: {
                  type: "string",
                  title: "Qualification",
                  enum: [
                    "Below 10th",
                    "10th pass",
                    "12th pass",
                    "Diploma/ITI certification",
                    "Graduate",
                    "PG/Professional Certification"
                  ],
                },
                occupation: {
                  type: "string",
                  title: "Occupation",
                },
                income: {
                  type: "string",
                  title: "Income / Dependent",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "businessProfile",
      label: "About the Business",
      schema: {
        type: "array",
        title: "Business Details",
        items: {
          type: "object",
          properties: {
            detail: {
              type: "string",
              title: "Detail",
              ui: {
                widget: "textarea",
                rows: 3,
              },
            },
          },
        },
      },
    },
    {
      id: "financialSummary",
      label: "Financial Summary",
      schema: {
        type: "object",
        properties: {
          assessmentYear: {
            type: "string",
            title: "Assessment Year",
          },
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
          netMarginPercent: {
            type: "string",
            title: "Net margin (%)",
          },
          documentsObserved: {
            type: "array",
            title: "Documents Observed",
            items: {
              type: "string",
              title: "Document",
            },
          },
          automationLevel: {
            type: "string",
            title: "Automation Level",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "relationships",
      label: "Customers & Purchase References",
      schema: {
        type: "object",
        properties: {
          customers: {
            type: "array",
            title: "Customers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNumber: {
                  type: "string",
                  title: "Contact Number",
                },
              },
            },
          },
          purchaseReferences: {
            type: "array",
            title: "Purchase References",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNumber: {
                  type: "string",
                  title: "Contact Number",
                },
              },
            },
          },
          margins: {
            type: "string",
            title: "Margins",
          },
          employeesCount: {
            type: "string",
            title: "Employees",
          },
          assets: {
            type: "string",
            title: "Assets",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "existingLoanDetails",
      label: "Existing Loans",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            financialInstitution: {
              type: "string",
              title: "Financial Institution",
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
            natureOfLoan: {
              type: "string",
              title: "Nature of Loan",
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
          },
        },
      },
    },
    {
      id: "loanAnalysis",
      label: "Loan Analysis",
      schema: {
        type: "object",
        properties: {
          endUse: {
            type: "string",
            title: "End Use (purpose of loan)",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          securityOffered: {
            type: "array",
            title: "Security Offered",
            items: {
              type: "string",
              title: "Security Detail",
            },
          },
          address: {
            type: "string",
            title: "Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          observations: {
            type: "string",
            title: "Observation",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          concerns: {
            type: "string",
            title: "Concerns",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          otherBusinessIncome: {
            type: "array",
            title: "Other Business / Income",
            items: {
              type: "string",
              title: "Income Detail",
            },
          },
          status: {
            type: "string",
            title: "Status of this case - Positive/Negative/Credit Refer",
          },
          place: {
            type: "string",
            title: "Place",
          },
        },
      },
    },
    statement4Schema,
  ],
} as const;

export default heroFincorpSchema;
