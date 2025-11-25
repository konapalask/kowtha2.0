import financialsSchema from "../financials-schema/generic";
export const indiaShelterSalariedSchema = {
  id: 22,
  bankName: "India Shelter Salaried",
  sections: [
    {
      id: "generalInfo",
      label: "General Information",
      schema: {
        type: "object",
        properties: {
          loanNumber: {
            type: "string",
            title: "Loan Number",
            readOnly: true,
          },
          branch: {
            type: "string",
            title: "Branch",
          },
        },
      },
      required: true,
    },
    {
      id: "basicDetails",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          loanProduct: {
            type: "string",
            title: "Loan Product",
            enum: ["HL", "LAP", "HL/LAP"],
          },
          meetingPerson: {
            type: "string",
            title: "To whom you meet?",
          },
          applicantName: {
            type: "string",
            title: "Applicant Name",
            readOnly: true,
          },
          applicantDob: {
            type: "string",
            title: "Applicant DOB",
            format: "date",
          },
          maritalStatus: {
            type: "string",
            title: "Marital Status",
            enum: ["Single", "Married", "Divorced", "Other"],
          },
          spouseName: {
            type: "string",
            title: "Spouse Name",
          },
          spouseDob: {
            type: "string",
            title: "Spouse DOB",
            format: "date",
          },
          spouseWorkDetails: {
            type: "string",
            title: "Does the spouse work? (If yes, brief details)",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          qualification: {
            type: "string",
            title: "Qualification",
            enum: [
              "Below 10",
              "10th Pass",
              "12th Pass",
              "Diploma",
              "ITI Certification",
              "Graduate",
              "PG",
              "Professional Certification",
            ],
          },
          category: {
            type: "string",
            title: "Category",
            enum: ["General", "SC", "ST", "OBC", "Others"],
          },
          totalFamilyMembers: {
            type: "integer",
            title: "Total No. of Family Members",
            minimum: 0,
          },
          nonEarningMembers: {
            type: "integer",
            title: "No. of non-earning members / dependents",
            minimum: 0,
          },
          dependentsChildren: {
            type: "integer",
            title: "No of Dependents - Children",
            minimum: 0,
          },
          dependentsAdults: {
            type: "integer",
            title: "No of Dependents - Adults",
            minimum: 0,
          },
          dependentsOthers: {
            type: "integer",
            title: "No of Dependents - Others",
            minimum: 0,
          },
        },
      },
      required: true,
    },
    {
      id: "residenceDetails",
      label: "Residence Details",
      schema: {
        type: "object",
        properties: {
          residenceAddress: {
            type: "string",
            title: "Residence Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          yearsAtCurrentResidence: {
            type: "number",
            title: "No of Years at Current Residence",
            minimum: 0,
          },
          areaSqft: {
            type: "string",
            title: "Area (in Sq ft)",
          },
          monthlyRentDeposit: {
            type: "string",
            title: "Monthly Rent & Security Deposit (if rented)",
          },
          purchasePriceMv: {
            type: "string",
            title: "Purchase price & MV (if owned)",
          },
          yearsInCurrentCity: {
            type: "string",
            title: "Years in Current City",
            enum: ["<=3 Years", ">3 Years"],
          },
        },
      },
      required: true,
    },
    {
      id: "financialProfile",
      label: "Financial Profile",
      schema: {
        type: "object",
        properties: {
          otherIncome: {
            type: "string",
            title: "Other Income",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          netWorth: {
            type: "string",
            title: "Net Worth (Car / Property / Investments)",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          creditCardDetails: {
            type: "string",
            title: "Credit Card Details",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          monthlyHouseholdExpenses: {
            type: "number",
            title: "Monthly Household expenses (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          existingRelationshipWithIndiashelter: {
            type: "string",
            title: "Existing Relationship with Indiashelter",
          },
        },
      },
    },
    {
      id: "employerDetails",
      label: "Employer Details",
      schema: {
        type: "object",
        properties: {
          employerName: {
            type: "string",
            title: "Employer Name",
          },
          employerAddress: {
            type: "string",
            title: "Employer Address",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          designation: {
            type: "string",
            title: "Designation",
          },
          salaryGross: {
            type: "number",
            title: "Current Monthly Salary - Gross",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          salaryNet: {
            type: "number",
            title: "Current Monthly Salary - Net",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          yearsInPresentEmployment: {
            type: "number",
            title: "No. of years in present employment",
            minimum: 0,
          },
          jobProfile: {
            type: "string",
            title: "Applicant's Job Profile",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          companyOverview: {
            type: "string",
            title: "About the company",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          officeGeoTag: {
            type: "string",
            title: "Customer Location (Office / Business GEO Tag)",
            readOnly: true,
          },
          previousEmployment: {
            type: "string",
            title: "Previous Employment",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
        },
      },
    },
    {
      id: "familyMembers",
      label: "Family Member Details",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relationWithApplicant: {
                  type: "string",
                  title: "Relation with Applicant",
                },
                age: {
                  type: "integer",
                  title: "Age (yrs)",
                  minimum: 0,
                },
                occupation: {
                  type: "string",
                  title: "Occupation (Job / Business)",
                },
                educationalQualification: {
                  type: "string",
                  title: "Educational Qualification (incl. Govt/Private)",
                  enum: [
                    "Below 10th",
                    "10th pass",
                    "12th pass",
                    "Diploma/ITI certification",
                    "Graduate",
                    "PG/Professional Certification",
                  ],
                },
                contactNumber: {
                  type: "integer",
                  title: "Contact Number",
                },
                stayingWithApplicant: {
                  type: "string",
                  title: "Staying with Applicant",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "currentLoanDetails",
      label: "Current Loan Details",
      schema: {
        type: "object",
        properties: {
          currentLoans: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank / FI Name",
                },
                loanType: {
                  type: "string",
                  title: "Loan Type",
                },
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
                emisPaid: {
                  type: "number",
                  title: "No. of EMI Paid",
                  minimum: 0,
                },
                balanceTenor: {
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
          bankingAccounts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                accountNumber: {
                  type: "string",
                  title: "Account Number",
                },
                accountType: {
                  type: "string",
                  title: "Account Type",
                  enum: ["Savings", "Current"],
                },
                branchName: {
                  type: "string",
                  title: "Branch Name",
                },
                operatingSinceYears: {
                  type: "string",
                  title: "Operating Since (Years)",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "loanPurpose",
      label: "Loan Details & Purpose",
      schema: {
        type: "object",
        properties: {
          purposes: {
            type: "string",
            title: "Purpose of Loan",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          minimumLoanAmount: {
            type: "number",
            title: "Minimum Loan Amount Required (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
            readOnly: true,
          },
          tenureRequired: {
            type: "string",
            title: "Tenure required",
          },
          comfortableEmi: {
            type: "number",
            title: "Comfortable EMI",
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
      id: "collateralDetails",
      label: "Collateral Details",
      schema: {
        type: "object",
        properties: {
          propertyStatus: {
            type: "string",
            title: "Status of Property to be Purchased",
            enum: [
              "Ready to Move",
              "Under Construction",
              "Construction Yet to Start",
            ],
          },
          usageAfterPurchase: {
            type: "string",
            title: "Usage of Property After Purchase",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          propertyAddress: {
            type: "string",
            title: "Property Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          propertyAreaSqft: {
            type: "string",
            title: "Area (in Sqft)",
          },
          ownershipDuration: {
            type: "string",
            title: "Ownership of the property from how many years?",
          },
          agreementValue: {
            type: "number",
            title: "Agreement value",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          ownContribution: {
            type: "number",
            title: "Own Contribution",
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
      id: "references",
      label: "Reference Details",
      schema: {
        type: "object",
        properties: {
          references: {
            type: "array",
            minItems: 1,
            title: "References",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                address: {
                  type: "string",
                  title: "Address",
                  ui: {
                    widget: "textarea",
                    rows: 2,
                  },
                },
                relationship: {
                  type: "string",
                  title: "Relationship",
                },
                contactNumber: {
                  type: "integer",
                  title: "Contact Number",
                },
                email: {
                  type: "string",
                  title: "Email Address",
                  format: "email",
                },
                yearsKnown: {
                  type: "number",
                  title: "Years Known",
                  minimum: 0,
                },
              },
            },
          },
        },
      },
    },
    {
      id: "tpcDetails",
      label: "TPC (Third Party Check) Details",
      schema: {
        type: "object",
        properties: {
          officeReferences: {
            type: "array",
            title: "Office Reference Checks",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                mobileNumber: {
                  type: "integer",
                  title: "Mobile Number",
                },
                knowingSince: {
                  type: "string",
                  title: "Knowing Since (Months / Years)",
                },
                feedback: {
                  type: "string",
                  title: "Feedback",
                  enum: ["Positive", "Negative", "Neutral"],
                },
                comments: {
                  type: "string",
                  title: "Comments",
                  ui: {
                    widget: "textarea",
                    rows: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "documentVerification",
      label: "Document Verification",
      schema: {
        type: "object",
        properties: {
          documents: {
            type: "array",
            title: "Documents Checked",
            items: {
              type: "object",
              properties: {
                documentType: {
                  type: "string",
                  title: "Document Type",
                },
                documentStatus: {
                  type: "string",
                  title: "Original / Copy / Not Provided",
                  enum: ["Original", "Copy", "Not Provided"],
                },
                crossChecked: {
                  type: "string",
                  title: "Details Cross Checked",
                  enum: ["Yes", "No"],
                },
                comments: {
                  type: "string",
                  title: "Comments",
                  ui: {
                    widget: "textarea",
                    rows: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "pdOfficerReview",
      label: "PD Officer Review",
      schema: {
        type: "object",
        properties: {
          majorObservations: {
            type: "string",
            title: "Major Observations / Comments / Concerns",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          caseStrengths: {
            type: "string",
            title: "Case Strengths",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          caseWeakness: {
            type: "string",
            title: "Case Weakness",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          pdStatus: {
            type: "string",
            title: "PD Status",
            enum: ["Positive", "Negative", "Referred"],
          },
          pdOfficerName: {
            type: "string",
            title: "Name of PD Officer",
          },
          visitDate: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          visitTime: {
            type: "string",
            title: "Time of Visit",
            format: "time",
          },
          officerSignature: {
            type: "string",
            title: "Signature of the PD Officer",
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default indiaShelterSalariedSchema;
