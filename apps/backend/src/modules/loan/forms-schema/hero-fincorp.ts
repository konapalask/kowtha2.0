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
          applicantPhoneNumber: {
            type: "integer",
            title: "Phone Number",
            readOnly: true,
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
            readOnly: true,
          },
          numberOfVisits: {
            type: "string",
            title: "No. of Visit",
          },
          personMet: {
            type: "string",
            title: "Person Met",
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
                    "PG/Professional Certification",
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
      id: "residentialAddress",
      label: "Residential Address",
      schema: {
        type: "object",
        properties: {
          residentialAddress: {
            type: "string",
            title: "Residential Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "businessProfile",
      label: "About the Business",
      schema: {
        type: "object",
        properties: {
          aboutTheBusiness: {
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
    {
      id: "turnoverAndNetProfitDetails",
      label: "Turnover and net profit details for last one year audited financials.",
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
            type: "number",
            title: "Net margin (%)",
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
      id: "itrFilling",
      label: "ITR’s filling U/s 44AD",
      schema: {
        type: "object",
        properties: {
          itrFilling: {
            type: "string",
            title: "ITR’s filling U/s 44AD",
            enum: ["Yes", "No"],
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
          documentsObserved: {
            type: "string",
            title: "Documents Observed",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
        },
      },
    },
    {
      id: "automationLevel",
      label: "Automation Level",
      schema: {
        type: "object",
        properties: {
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
      id: "majorSuppliers",
      label: "Major Suppliers",
      schema: {
        type: "object",
        properties: {
          majorSuppliers: {
            type: "array",
            title: "Major Suppliers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNumber: {
                  type: "integer",
                  title: "Contact Number",
                },
                address: {
                  type: "string",
                  title: "Address",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "majorCustomers",
      label: "Major Customers",
      schema: {
        type: "object",
        properties: {
          majorCustomers: {
            type: "array",
            title: "Major Customers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNumber: {
                  type: "integer",
                  title: "Contact Number",
                },
                address: {
                  type: "string",
                  title: "Address",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "margins",
      label: "Margins",
      schema: {
        type: "object",
        properties: {
          margins: {
            type: "string",
            title: "Margins",
          },
        },
      },
    },
    {
      id: "employees",
      label: "Employees",
      schema: {
        type: "object",
        properties: {
          employees: {
            type: "string",
            title: "Employees",
          },
        },
      },
    },
    {
      id: "assets",
      label: "Assets",
      schema: {
        type: "object",
        properties: {
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
        type: "object",
        properties: {
          existingLoans: {
            type: "array",
            title: "Existing Loans",
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
            ui: {
              widget: "textarea",
              rows: 3,
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
          tpcDetails: {
            type: "string",
            title: "TPC (Third Party check) Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          otherBusinessIncome: {
            type: "string",
            title: "Other Business / Income",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    statement4Schema,
  ],
} as const;

export default heroFincorpSchema;
