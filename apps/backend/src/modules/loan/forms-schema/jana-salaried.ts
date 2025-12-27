import financialsSchema from "../financials-schema/generic";
export const janaSalariedSchema = {
  id: 28,
  bankName: "Jana-Salaried",
  sections: [
    {
      id: "general",
      label: "General",
      schema: {
        type: "object",
        properties: {
          applicationNumber: {
            type: "string",
            title: "Application Number",
            readOnly: true,
          },
          applicantName: {
            type: "string",
            title: "Name of Applicant",
            readOnly: true,
          },
          dateOfBirthOfApplicant: {
            type: "string",
            title: "Date of Birth of Applicant",
            format: "date",
          },
          spouseName: {
            type: "string",
            title: "Name of Spouse",
          },
          dateOfBirthOfSpouse: {
            type: "string",
            title: "Date of Birth of Spouse",
            format: "date",
          },
          doesSpouseWork: {
            type: "string",
            title: "Does Spouse Work?",
            enum: ["Yes", "No"],
          },
          spouseWorkDetails: {
            type: "string",
            title: "Spouse Work Details",
            dependencies: {
              show: {
                doesSpouseWork: "Yes",
              },
              required: {
                doesSpouseWork: "Yes",
              },
            },
            ui: { widget: "textarea", rows: 3 },
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
          employerName: {
            type: "string",
            title: "Employer Name",
          },
          employerAddress: {
            type: "string",
            title: "Employer Address",
          },
          pdPlace: {
            type: "string",
            title: "PD Place",
          },
          designation: {
            type: "string",
            title: "Designation",
          },
          currentMonthlySalary: {
            type: "number",
            title: "Current Monthly Salary",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          yearsInPresentEmployment: {
            type: "number",
            title: "Years in Present Employment",
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
          familyMembers: {
            type: "array",
            title: "Family Members",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                relationship: {
                  type: "string",
                  title: "Relationship with Applicant",
                },
                age: { type: "number", title: "Age (Yrs)" },
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
                occupation: { type: "string", title: "Occupation" },
                incomePerMonth: {
                  type: "number",
                  title: "Income per month (approx.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                dependent: { type: "string", title: "Dependent" },
              },
            },
          },
          nonearningFamilyMembers: {
            type: "number",
            title: "No of non-earning Family Members/dependents",
          },
        },
      },
    },
    {
      id: "residenceDetails",
      label: "Residence Details",
      schema: {
        type: "object",
        properties: {
          ownership: { type: "string", title: "Ownership" },
          areaInSqFt: { type: "number", title: "Area (in Sq ft)" },
          purchaseYear: {
            type: "string",
            title: "Purchase Year / Rent Agreement Period",
          },
          purchaseCost: {
            type: "number",
            title: "Purchase Cost / Rent per month",
          },
          currentMarketValue: {
            type: "number",
            title: "Current Market Value / Security Deposit",
          },
          ownerRelationship: {
            type: "string",
            title: "Owner / Landlord (Relationship with Applicant)",
          },
          tenant: { type: "string", title: "Tenant" },
          mortgaged: { type: "string", title: "Mortgaged" },
        },
      },
    },

    {
      id: "applicantDetails",
      label: "Applicant Details",
      schema: {
        type: "object",
        properties: {
          applicantJobProfile: {
            type: "string",
            title: "Applicant's Job Profile",
            ui: { widget: "textarea", rows: 3 },
          },
          aboutTheCompany: {
            type: "string",
            title: "About the company",
            ui: { widget: "textarea", rows: 3 },
          },
          previousEmploymentDetails: {
            type: "string",
            title: "Previous Employment",
            ui: { widget: "textarea", rows: 3 },
          },
          spouseJobProfile: {
            type: "string",
            title: "Spouse's Job Profile",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "networthDetails",
      label: "Net Worth (Car / Property / Investments etc.)",
      schema: {
        type: "object",
        properties: {
          netWorth: {
            type: "array",
            title: "Net Worth (Car / Property / Investments etc.)",
            items: {
              type: "object",
              properties: {
                address: { type: "string", title: "Address" },
                areaInSqFt: { type: "number", title: "Area (in Sq ft)" },
                purchaseCostLakhs: {
                  type: "number",
                  title: "Purchase Cost (in Lakhs)",
                },
                purchaseYear: { type: "string", title: "Purchase Year" },
                marketValueLakhs: {
                  type: "number",
                  title: "Market Value (in Lakhs)",
                },
                ownerName: { type: "string", title: "Owner Name" },
                mortgaged: {
                  type: "string",
                  title: "Mortgaged",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
          liquidMoveableAssets: {
            type: "string",
            title:
              "Any Liquid, Moveable & Monetary items such as Cash, Gold, FD, RD, Mutual Fund Holdings, Shares, Bonds, Securities -",
            ui: { widget: "textarea", rows: 3 },
          },
          insurances: {
            type: "string",
            title:
              "Life Insurance, Mediclaim, Property/Asset Insurance (Premium & Sum Assured) -",
            ui: { widget: "textarea", rows: 3 },
          },
          capitalInvestedBusiness: {
            type: "string",
            title: "Capital Invested in any Business, Loans & Advances given -",
            ui: { widget: "textarea", rows: 3 },
          },
          vehicles: {
            type: "string",
            title: "Car, Bike and Other Vehicles (Company Name and Model) -",
            ui: { widget: "textarea", rows: 3 },
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
          loanDetails: {
            type: "array",
            title: "Loan Details",
            items: {
              type: "object",
              properties: {
                bankName: { type: "string", title: "Name of Bank / NBFC" },
                typeOfLoan: { type: "string", title: "Type of Loan" },
                sanctionedAmount: {
                  type: "number",
                  title: "Sanctioned Amount (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                osBalance: {
                  type: "number",
                  title: "O/S Balance (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                emi: {
                  type: "number",
                  title: "EMI (in Rs.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                tenure: { type: "number", title: "Tenure(months)" },
                monthOnBooks: { type: "string", title: "Month on Books" },
                emiPaidBank: { type: "string", title: "EMI Paid Bank" },
                securedAgainstAsset: {
                  type: "string",
                  title: "Secured Against which Asset",
                },
              },
            },
          },
        },
      },
    },

    {
      id: "existingRelationship",
      label: "Existing Relationship with Jana Small Finance Bank Ltd.",
      schema: {
        type: "object",
        properties: {
          existingRelationship: {
            type: "string",
            title: "Existing Relationship with Jana Small Finance Bank Ltd.",
            ui: { widget: "textarea", rows: 3 },
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
                bankName: { type: "string", title: "Bank Name" },
                branchName: { type: "string", title: "Branch Name" },
                accountType: { type: "string", title: "Account Type" },
                operatingSinceYear: {
                  type: "number",
                  title: "Operating Since (Year)",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "creditCardDetails",
      label: "Credit Card Details",
      schema: {
        type: "object",
        properties: {
          creditCardDetails: {
            type: "string",
            title: "Credit Card Details",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "loanAmountAndPurpose",
      label: "Loan Amount and Purpose",
      schema: {
        type: "object",
        properties: {
          loanAmount: {
            type: "number",
            title: "Loan Amount",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
            readOnly: true,
          },
          purposeOfLoan: {
            type: "string",
            title: "Purpose of Loan",
            readOnly: true,
          },
        },
      },
    },

    {
      id: "securityOffered",
      label: "Security Offered",
      schema: {
        type: "object",
        properties: {
          address: {
            type: "string",
            title: "Address",
            ui: { widget: "textarea", rows: 3 },
          },
          securityDetails: {
            type: "array",
            title: "Security Details",
            items: {
              type: "object",
              properties: {
                areaInSqFt: { type: "number", title: "Area in Sq Ft" },
                agreementValue: {
                  type: "number",
                  title: "Agreement Value (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },

                purchaseCost: {
                  type: "number",
                  title: "ActualPurchase Cost (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                marketValue: {
                  type: "number",
                  title: "Market Value (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                ocrValue: {
                  type: "string",
                  title: "OCR (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                ocrPaidTillDate: {
                  type: "number",
                  title: "OCR Paid Till Date (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                ocrSource: { type: "string", title: "OCR Source" },
              },
            },
          },
        },
      },
    },

    {
      id: "otherIncome",
      label: "Other Income",
      schema: {
        type: "object",
        properties: {
          otherIncomes: {
            type: "array",
            title: "Other Income",
            items: {
              type: "object",
              properties: {
                incomeAmount: {
                  type: "number",
                  title: "Income",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                details: { type: "string", title: "Details" },
                reference: { type: "string", title: "Reference" },
              },
            },
          },
        },
      },
    },

    {
      id: "thirdPartyConfirmation",
      label: "Third Party Confirmation",
      schema: {
        type: "object",
        properties: {
          thirdPartyConfirmations: {
            type: "array",
            title: "Third Party Confirmation",
            items: {
              type: "object",
              properties: {
                individualOrBusinessName: {
                  type: "string",
                  title: "Individual / Business Name",
                },
                address: {
                  type: "string",
                  title: "Address",
                  ui: { widget: "textarea", rows: 2 },
                },
                contactNo: { type: "number", title: "Contact No." },
                knowingSince: { type: "string", title: "Knowing Since" },
                feedbackOnBorrower: {
                  type: "string",
                  title: "Feedback on Borrower",
                },
                feedbackOnBusiness: {
                  type: "string",
                  title: "Feedback on Business",
                },
              },
            },
          },
        },
      },
    },

    {
      id: "documentsVerified",
      label: "Documents Verified",
      schema: {
        type: "object",
        properties: {
          documentsVerified: {
            type: "array",
            title: "Documents Verified",
            items: {
              type: "object",
              properties: {
                documentCategory: {
                  type: "string",
                  title: "Document Category",
                  enum: [
                    "KYC Documents",
                    "Income & Expense Records",
                    "Other Documents",
                  ],
                },
                documentName: { type: "string", title: "Document Name" },
                documentType: {
                  type: "string",
                  title: "Document Type",
                  enum: ["Original", "Scan Image"],
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  ui: { widget: "textarea", rows: 3 },
                },
              },
            },
          },
        },
      },
    },

    {
      id: "otherObservations",
      label: "Other Observations",
      schema: {
        type: "object",
        properties: {
          caseStrengths: {
            type: "string",
            title: "Case Strengths",
            ui: { widget: "textarea", rows: 3 },
          },
          caseWeakness: {
            type: "string",
            title: "Case Weakness",
            ui: { widget: "textarea", rows: 3 },
          },
          pdStatus: {
            type: "string",
            title: "PD Status",
            enum: ["Positive", "Negative", "Credit Refer"],
          },
          nameOfAgencyExecutive: {
            type: "string",
            title: "Name of Agency Executive",
          },
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          timeOfVisit: {
            type: "string",
            title: "Time of Visit",
            format: "time",
          },
          checkedBy: { type: "string", title: "Checked By" },
        },
      },
    },
    {
      id: "geoTagDetails",
      label: "Site Coordinates",
      schema: {
        type: "object",
        properties: {
          coordinates: { type: "string", title: "Coordinates", readOnly: true },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default janaSalariedSchema;
