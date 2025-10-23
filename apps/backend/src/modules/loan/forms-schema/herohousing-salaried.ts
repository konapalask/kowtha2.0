export const herohousingSalariedSchema = {
  id: 14,
  bankName: "HeroHousing-Salaried",
  sections: [
    {
      id: "generalInfo",
      label: "General Loan & Visit Details",
      schema: {
        type: "object",
        properties: {
          loanAccountNo: {
            type: "string",
            title: "Loan account No.",
          },
          nameOfCustomer: {
            type: "string",
            title: "Name of customer",
          },
          personMet: {
            type: "string",
            title: "Person met in PD & relationship with customer",
          },
          reasonIfCustomerNotAvailable: {
            type: "string",
            title: "Reason if customer not available during visit",
          },
          pdVisitDate: {
            type: "string",
            title: "PD visit date",
          },
          pdVisitTime: {
            type: "string",
            title: "PD visit time",
          },
          pdAddress: {
            type: "string",
            title: "PD address",
            ui: { widget: "textarea", rows: 2 },
          },
          latLongOfOfficeAddress: {
            type: "string",
            title: "Latitude & Longitude of office address",
          },
          requestedLoanAmount: {
            type: "number",
            title: "Requested loan amount",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
    },
    {
      id: "borrowerProfile",
      label: "Profile of Customer",
      schema: {
        type: "object",
        properties: {
          borrowerDetails: {
            type: "string",
            title:
              "Borrower details (qualification & professional journey)",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "familyDetails",
      label: "Family Details",
      schema: {
        type: "object",
        properties: {
          members: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                relationship: {
                  type: "string",
                  title: "Relationship with applicant",
                },
                age: { type: "integer", title: "Age" },
                qualification: { type: "string", title: "Qualification" },
                occupation: { type: "string", title: "Occupation" },
                incomeDetails: {
                  type: "string",
                  title: "Income details / Dependent",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "employmentProfile",
      label: "Current Job Profile",
      schema: {
        type: "object",
        properties: {
          nameOfEmployer: { type: "string", title: "Name of Employer" },
          workingSince: { type: "string", title: "Working since" },
          typeOfEmployment: {
            type: "string",
            title: "Type of employment",
            enum: ["Permanent", "Contractual"],
          },
          designation: { type: "string", title: "Designation" },
          jobProfile: {
            type: "string",
            title: "Job profile",
            ui: { widget: "textarea", rows: 2 },
          },
          reportingTo: {
            type: "string",
            title: "Reporting to (Name/Designation)",
          },
        },
      },
    },
    {
      id: "employerDetails",
      label: "Details of Employer",
      schema: {
        type: "object",
        properties: {
          businessName: { type: "string", title: "Current business name" },
          constitution: { type: "string", title: "Constitution" },
          natureOfBusiness: {
            type: "string",
            title: "Nature of business / services",
            ui: { widget: "textarea", rows: 2 },
          },
          runningSince: { type: "string", title: "Running since" },
          partnersDetails: {
            type: "string",
            title: "Partners / Directors details",
          },
          setupDetails: {
            type: "string",
            title: "Setup of business & no. of employees",
          },
          stockQuantum: { type: "string", title: "Quantum of stock" },
          machineryAssets: {
            type: "string",
            title: "Machinery and assets seen",
          },
          localityFeedback: {
            type: "string",
            title:
              "Locality competitors, overall prospect, negative feedback",
            ui: { widget: "textarea", rows: 2 },
          },
        },
      },
    },
    {
      id: "propertyAndInvestments",
      label: "Investments and Properties",
      schema: {
        type: "object",
        properties: {
          investmentNotes: {
            type: "string",
            title: "Details of assets / investments built till date",
            ui: { widget: "textarea", rows: 3 },
          },
          endUseNotes: {
            type: "string",
            title: "End use of property / fund",
            ui: { widget: "textarea", rows: 2 },
          },
        },
      },
    },
    {
      id: "loanDetails",
      label: "Loan Details",
      schema: {
        type: "object",
        properties: {
          loanNotes: {
            type: "string",
            title: "Details of loans presently servicing",
            ui: { widget: "textarea", rows: 3 },
          },
          bankingNotes: {
            type: "string",
            title: "Banking details & salary credit account",
            ui: { widget: "textarea", rows: 2 },
          },
          documentVerificationNotes: {
            type: "string",
            title: "Document verification & other checks",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "existingLoans",
      label: "Existing Loan Details",
      schema: {
        type: "object",
        properties: {
          existingLoans: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: { type: "string", title: "Bank / FI Name" },
                loanType: { type: "string", title: "Loan Type" },
                sanctionAmount: {
                  type: "number",
                  title: "Sanction Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                emi: {
                  type: "number",
                  title: "EMI",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                tenureRemaining: {
                  type: "string",
                  title: "Balance Tenor",
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
          accounts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: { type: "string", title: "Bank Name" },
                accountNumber: { type: "string", title: "Account Number" },
                accountType: {
                  type: "string",
                  title: "Account Type",
                },
                branchName: { type: "string", title: "Branch Name" },
                operatingSince: { type: "string", title: "Operating since" },
              },
            },
          },
        },
      },
    },
    {
      id: "loanPurpose",
      label: "Loan Purpose",
      schema: {
        type: "object",
        properties: {
          detailedPurpose: {
            type: "string",
            title: "Detailed purpose / end use of loan amount",
            ui: { widget: "textarea", rows: 2 },
          },
          appliedLoanAmount: {
            type: "number",
            title: "Applied loan amount",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
    },
    {
      id: "essChecklist",
      label: "Environmental & Social Safeguards (ESS)",
      schema: {
        type: "object",
        properties: {
          essResponses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string", title: "Question" },
                response: {
                  type: "string",
                  title: "Response",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "observations",
      label: "Observations & Conclusion",
      schema: {
        type: "object",
        properties: {
          detailedObservations: {
            type: "string",
            title: "Detailed observations (Positive & Negative)",
            ui: { widget: "textarea", rows: 4 },
          },
          concerns: {
            type: "string",
            title: "Concerns",
            ui: { widget: "textarea", rows: 2 },
          },
          pdStatus: {
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
  ],
} as const;

export default herohousingSalariedSchema;
