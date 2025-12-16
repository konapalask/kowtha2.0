import financialsSchema from "../financials-schema/generic";

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
          pdinitiatedAddress: {
            type: "string",
            title: "PD initiated address",
            readOnly: true,
          },
          visitedAddress: {
            type: "string",
            title: "visited address",
          },
          businessLicenseAddress: {
            type: "string",
            title: "Business license address",
          },
        },
        required: ["nameOfApplicant", "applicationNo", "nameOfConcern"],
      },
      required: true,
    },
    {
      id: "residentialDetails",
      label: "Residential Details",
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
            enum: ["Rented", "Owned"],
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
      id: "propertyDetails",
      label: "Property Details",
      schema: {
        type: "object",
        properties: {
          propertyAddress: {
            type: "string",
            title: "Address",
          },
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
        },
      },
      required: true,
    },
    {
      id: "contactDetails",
      label: "Contact Details",
      schema: {
        type: "object",
        properties: {
          phoneNumber: {
            type: "integer",
            title: "Phone Number",
          },
          appointmentFixed: {
            type: "string",
            title: "Appointment Fixed",
            format: "time",
          },
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
        },
      },
      required: true,
    },
    {
      id: "structureOfLoan",
      label: "Structure of Loan",
      schema: {
        type: "object",
        properties: {
          structureOfLoan: {
            type: "string",
            title: "Structure of Loan",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "visitDetails",
      label: "Visit Details",
      schema: {
        type: "object",
        properties: {
          noOfVisit: {
            type: "string",
            title: "No. of Visit",
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
          aboutTheApplicant: {
            type: "string",
            title: "About the Applicant",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "familyDetails",
      label: "Family details",
      schema: {
        type: "object",
        properties: {
          familyDetails: {
            type: "array",
            title: "Family Details",
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
                education: {
                  type: "string",
                  title: "Education",
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
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "aboutTheBusiness",
      label: "About the Business",
      schema: {
        type: "object",
        properties: {
          aboutTheBusiness: {
            type: "string",
            title: "About the Business",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "otherObservations",
      label: "Other observations",
      schema: {
        type: "object",
        properties: {
          observations: {
            type: "string",
            title: "Observations",
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
        },
      },
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
            readOnly: true,
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
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          automationLevel: {
            type: "string",
            title: "Automation Level",
          },
          receipts: {
            type: "string",
            title: "Receipts",
          },
          payments: {
            type: "string",
            title: "Payments",
          },
        },
      },
      required: true,
    },
    {
      id: "regularCustomersAndSuppliersActivity",
      label: "Regular Customers and Suppliers Activity",
      schema: {
        type: "object",
        properties: {
          nameAndContactNumberOfRegularCustomers: {
            type: "array",
            title: "Name and Contact number of Regular Customers",
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
              },
            },
          },
          nameAndContactNumberOfRegularSuppliers: {
            type: "array",
            title: "Name and Contact number of Regular Suppliers",
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
              },
            },
          },
        },
      },
    },
    {
      id: "businessActivityAndStockLevelObserved",
      label: "Business Activity and Stock Level Observed",
      schema: {
        type: "object",
        properties: {
          netMargin: {
            type: "string",
            title: "Net Margin",
          },
          expenditure: {
            type: "string",
            title: "Expenditure",
          },
          employees: {
            type: "integer",
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
          licMutualFunds: {
            type: "string",
            title: "LIC/Mutual funds",
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
                accountType: {
                  type: "string",
                  title: "Account Type",
                  enum: ["Savings A/C", "Current A/C", "CC/OD A/C"],
                },
                averageBalance: {
                  type: "number",
                  title: "AVG BAL",
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
          },
        },
      },
    },
    {
      id: "existingLoans",
      label: "Existing Loans",
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
                type: {
                  type: "string",
                  title: "Type",
                },
                loanAmount: {
                  type: "number",
                  title: "Loan",
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
          endUse: {
            type: "string",
            title: "End Use",
          },
          securityOffered: {
            type: "string",
            title: "Security Offered",
          },
          address_3: {
            type: "string",
            title: "Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          otherBusinessInterestSourceOfIncomeFamilyIncome: {
            type: "string",
            title: "Other Business/Income",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          neighborCheck: {
            type: "string",
            title: "Neighbor Check",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          statusOfPd: {
            type: "string",
            title: "Status",
            enum: ["Positive", "Negative", "Credit Refer"],
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;
export default ambitSchema;
