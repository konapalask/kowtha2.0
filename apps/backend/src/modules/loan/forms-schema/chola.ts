import financialsSchema from "../financials-schema/generic";
export const cholaSchema = {
  id: 11,
  bankName: "Chola",
  sections: [
    {
      id: "basicInformation",
      label: "Basic Information",
      schema: {
        type: "object",
        properties: {
          nameOfTheApplicant: {
            type: "string",
            title: "Name of the Applicant",
            readOnly: true,
          },
          nameOfTheCoApplicant: {
            type: "string",
            title: "Name of the Co-applicant",
          },
          businessName: {
            type: "string",
            title: "Business Name",
            readOnly: true,
          },
          constitution: {
            type: "string",
            title: "Constitution",
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
          },
          loanAmountRequested: {
            type: "number",
            title: "Loan Requested",
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
            title: "Purpose of Loan",
            readOnly: true,
          },
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
        },
        required: [
          "nameOfTheApplicant",
          "nameOfTheCoApplicant",
          "constitution",
          "visitedAddress",
          "loanAmountRequested",
          "purposeOfLoan",
          "dateOfVisit",
          "personMet",
        ],
      },
    },
    {
      id: "aboutTheApplicantAndItsBusiness",
      label: "About the Applicant & its Business",
      schema: {
        type: "object",
        properties: {
          aboutTheApplicant: {
            type: "string",
            title: "About the Applicant",
            ui: {
              widget: "textarea",
              rows: 8,
            },
          },
          aboutTheBusiness: {
            type: "string",
            title: "About the Business",
            ui: {
              widget: "textarea",
              rows: 8,
            },
          },
        },
      },
    },
    {
      id: "applicantsFamilyDetails",
      label: "Applicant's Family Details",
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
                  title: "Relationship",
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
              },
            },
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
          assetDetails: {
            type: "array",
            title: "Asset details",
            items: {
              type: "object",
              properties: {
                assetDetails: {
                  type: "string",
                  title: "Asset details",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "customersReferenceNumbers",
      label: "Customers - Reference Numbers",
      schema: {
        type: "object",
        properties: {
          customerReferenceNumbers: {
            type: "array",
            title: "Customer Reference Numbers",
            items: {
              type: "object",
              properties: {
                customerReferenceNumber: {
                  type: "string",
                  title: "Customer Reference Number",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "otherIncomes",
      label: "Other Incomes",
      schema: {
        type: "object",
        properties: {
          otherIncomes: {
            type: "array",
            title: "Other Incomes",
            items: {
              type: "object",
              properties: {
                otherIncome: {
                  type: "string",
                  title: "Other Income",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "existingLoanDetails",
      label: "Existing Loan Details",
      schema: {
        type: "object",
        properties: {
          loanDetails: {
            type: "array",
            title: "Loan Details",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                typeOfLoan: {
                  type: "string",
                  title: "Type of Loan",
                },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount (In Rs.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                emiInterest: {
                  type: "number",
                  title: "EMI/Interest (In Rs.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                tenureTotalCompleted: {
                  type: "string",
                  title: "Total Tenure / Completed [in months]",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "bankingDetails",
      label: "Banking Details",
      schema: {
        type: "object",
        properties: {
          bankingDetails: {
            type: "array",
            title: "Banking Details",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                accountNo: {
                  type: "string",
                  title: "A/c No",
                },
                accountType: {
                  type: "string",
                  title: "A/c Type",
                },
                averageBalance: {
                  type: "number",
                  title: "Avg balance",
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
      id: "itrFinancialDetails",
      label: "ITR, Receipts, Verification, GP Margin & Expenses Details",
      schema: {
        type: "object",
        properties: {
          itrReceiptsVerificationInformation: {
            type: "string",
            title: "ITR, Receipts, Verification, GP Margin & Expenses Details",
            ui: {
              widget: "textarea",
              rows: 6,
            },
          },
        },
      },
    },
    {
      id: "comfortFactor",
      label: "Comfort Factor",
      schema: {
        type: "object",
        properties: {
          comfortFactors: {
            type: "array",
            title: "Comfort Factors",
            items: {
              type: "object",
              properties: {
                comfortFactor: {
                  type: "string",
                  title: "Comfort Factor",
                  ui: {
                    widget: "textarea",
                    rows: 6,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "discomfortFactor",
      label: "Discomfort Factor",
      schema: {
        type: "object",
        properties: {
          discomfortFactors: {
            type: "array",
            title: "Discomfort Factors",
            items: {
              type: "object",
              properties: {
                discomfortFactor: {
                  type: "string",
                  title: "Discomfort Factor",
                  ui: {
                    widget: "textarea",
                    rows: 6,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "Recommendations",
      label: "Recommendations",
      schema: {
        type: "object",
        properties: {
          recommendations: {
            type: "array",
            title: "Recommendations",
            items: {
              type: "object",
              properties: {
                recommendation: {
                  type: "string",
                  title: "Enter Details",
                },
              },
            },
          },
        },
      },
    },

    financialsSchema,
  ],
} as const;

export default cholaSchema;
