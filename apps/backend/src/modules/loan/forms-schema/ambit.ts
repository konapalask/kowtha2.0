export const ambitSchema = {
  id: 8,
  bankName: "Ambit",
  sections: [
    {
      id: "general",
      label: "General",
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
            title: "Name of Co-Applicant",
          },
          applicationNo: {
            type: "string",
            title: "Application no.",
            readOnly: true,
          },
          nameOfConcern: {
            type: "string",
            title: "Name of Concern",
            readOnly: true,
          },
          nameOfTheProprietorAsPerLicense: {
            type: "string",
            title: "Name of the proprietor as per license",
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
        required: ["nameOfApplicant", "applicationNo", "nameOfConcern"],
      },
      required: true,
    },
    {
      id: "address",
      label: "Address",
      schema: {
        type: "object",
        properties: {
          address: {
            type: "string",
            title: "Address",
          },
          rentedOwned: {
            type: "string",
            title: "Rented/Owned",
            enum: ["Owned", "Rented", "Leased"],
          },
          ownedBy: {
            type: "string",
            title: "Owned by",
          },
          areaInSqFt: {
            type: "number",
            title: "Area (In Sq. Ft.)",
          },
          occupiedSinceYears: {
            type: "integer",
            title: "Occupied since (years)",
          },
        },
      },
      required: true,
    },
    {
      id: "marketValue",
      label: "Market Value",
      schema: {
        type: "object",
        properties: {
          marketValue: {
            type: "number",
            title: "Market Value",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          ownedBy: {
            type: "string",
            title: "Owned by",
          },
          areaInSqFt: {
            type: "number",
            title: "Area (In Sq. Ft.)",
          },
          occupiedSinceYears: {
            type: "integer",
            title: "Occupied since (years)",
          },
          phoneNumber: {
            type: "string",
            title: "Phone Number",
            pattern: "^[0-9]{10}$",
          },
          appointmentFixed: {
            type: "string",
            title: "Appointment Fixed",
            enum: ["Yes", "No"],
          },
        },
      },
      required: true,
    },
    {
      id: "noOfVisit",
      label: "No. of Visit",
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
      id: "familyDetails",
      label: "Family details",
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
                relationship: {
                  type: "string",
                  title: "Relationship",
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
          },
          aboutTheBusiness: {
            type: "string",
            title: "About the Business",
          },
        },
      },
      required: true,
    },
    {
      id: "otherObservations",
      label: "Other observations",
      schema: {
        type: "object",
        properties: {
          concerns: {
            type: "string",
            title: "Concerns",
          },
        },
      },
      required: true,
    },
    {
      id: "purposeOfLoan",
      label: "Purpose of Loan",
      schema: {
        type: "object",
        properties: {
          purposeOfLoan: {
            type: "string",
            title: "Purpose of Loan",
          },
          asPerAuditedIndividualItrS: {
            type: "string",
            title: "As per Audited individual ITR's",
          },
          whetherRegisteredUnderMsme: {
            type: "string",
            title: "Whether registered under MSME",
            enum: ["Yes", "No"],
          },
          whetherRegisteredUnderGst: {
            type: "string",
            title: "Whether registered under GST",
            enum: ["Yes", "No"],
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
            title: "Documents Observed",
          },
          automationLevel: {
            type: "string",
            title: "Automation Level",
          },
          receipts: {
            type: "number",
            title: "Receipts",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          payments: {
            type: "number",
            title: "Payments",
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
      id: "netProfit",
      label: "Net Profit",
      schema: {
        type: "object",
        properties: {
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
        },
      },
      required: true,
    },
    {
      id: "nameAndContactNumberOfRegularSuppliers",
      label: "Name and Contact number of Regular Suppliers",
      schema: {
        type: "object",
        properties: {
          suppliers: {
            type: "array",
            title: "Regular Suppliers",
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
                  pattern: "^[0-9]{10}$",
                },
              },
            },
          },
          expenditure: {
            type: "number",
            title: "Expenditure",
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
      id: "employees",
      label: "Employees",
      schema: {
        type: "object",
        properties: {
          noOfEmployees: {
            type: "integer",
            title: "No. of Employees",
          },
          assets: {
            type: "string",
            title: "Assets",
          },
          licMutualFunds: {
            type: "string",
            title: "LIC/Mutual funds",
          },
        },
      },
      required: true,
    },
    {
      id: "bankName",
      label: "Bank Name",
      schema: {
        type: "object",
        properties: {
          bankName: {
            type: "string",
            title: "Bank Name",
          },
          accountType: {
            type: "string",
            title: "Account Type",
            enum: ["Savings", "Current", "CC/OD"],
          },
          averageBalance: {
            type: "number",
            title: "Average Balance",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          noOfYearsMaintained: {
            type: "integer",
            title: "No. of years maintained",
          },
        },
      },
      required: true,
    },
    {
      id: "existingLoans",
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
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                type: {
                  type: "string",
                  title: "Type",
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
                },
                openClose: {
                  type: "string",
                  title: "Open/Close",
                  enum: ["Open", "Close"],
                },
              },
            },
          },
          endUse: {
            type: "string",
            title: "End Use",
          },
          securityOffered: {
            type: "string",
            title: "Security Offered",
          },
        },
      },
      required: true,
    },
    {
      id: "otherBusinessIncome",
      label: "Other Business/Income",
      schema: {
        type: "object",
        properties: {
          otherBusinessIncome: {
            type: "number",
            title: "Other Business/Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          neighborCheck: {
            type: "string",
            title: "Neighbor Check",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default ambitSchema;
