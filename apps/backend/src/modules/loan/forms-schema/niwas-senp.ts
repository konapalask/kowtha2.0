export const niwasSenpSchema = {
  id: 24,
  bankName: "Niwas Senp",
  sections: [
    {
      id: "generalInfo",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          prospectNo: { type: "string", title: "Prospect No." },
          name: { type: "string", title: "Name" },
          maritalStatus: {
            type: "string",
            title: "Marital Status",
            enum: ["Single", "Married", "Divorced", "Others"],
          },
          educationalQualification: {
            type: "string",
            title:
              "Educational Qualification (Below 10th / 10th / 12th / Diploma / Graduate / PG)",
          },
          category: {
            type: "string",
            title: "Category",
            enum: ["General", "SC", "ST", "OBC", "Others"],
          },
          dependentsChildren: {
            type: "string",
            title: "Number of Dependents - Children",
          },
          dependentsAdults: {
            type: "string",
            title: "Number of Dependents - Adults",
          },
          dependentsOthers: {
            type: "string",
            title: "Number of Dependents - Others",
          },
          yearsInCurrentResidence: {
            type: "string",
            title: "Years in Current Residence",
          },
          currentResidenceHouseSize: {
            type: "string",
            title: "Current residence house size",
          },
          previousAddress: {
            type: "string",
            title: "Previous address (if < 1 year)",
          },
          yearsAtPreviousAddress: {
            type: "string",
            title: "Years stayed at previous address",
          },
          yearsInCurrentCity: {
            type: "string",
            title: "Years in current city",
          },
          previousCity: {
            type: "string",
            title: "Previous city (if ≤ 3 years)",
          },
          yearsInPreviousCity: {
            type: "string",
            title: "Years in previous city",
          },
          reasonForChange: {
            type: "string",
            title: "Reason for change",
          },
          parentsStayingWith: {
            type: "string",
            title: "Parents staying with (Self / Separate / Expired)",
          },
        },
      },
    },
    {
      id: "assetsInvestments",
      label: "Assets and Investments",
      schema: {
        type: "object",
        properties: {
          smartphone: { type: "string", title: "Smartphone (Yes/No)" },
          washingMachine: { type: "string", title: "Washing Machine (Yes/No)" },
          carRcNo: { type: "string", title: "Car RC No. (Yes/No)" },
          twoWheeler: { type: "string", title: "Two Wheeler (Yes/No)" },
          autoCab: { type: "string", title: "Auto/Cab (Yes/No)" },
          computerLaptop: {
            type: "string",
            title: "Computer / Laptop (Yes/No)",
          },
          ac: { type: "string", title: "AC (Yes/No)" },
          fridge: { type: "string", title: "Fridge (Yes/No)" },
          induction: { type: "string", title: "Induction (Yes/No)" },
          insurance: { type: "string", title: "Insurance (LIC)" },
          fixedDeposit: { type: "string", title: "Fixed Deposit" },
          chitFunds: { type: "string", title: "Chit Funds" },
          postOfficeSavings: { type: "string", title: "Post Office Savings" },
          postOfficeSavingsMonthly: {
            type: "string",
            title: "Post Office savings monthly (Yes/No)",
          },
          recurringDeposit: {
            type: "string",
            title: "Recurring Deposit (Yes/No)",
          },
          consumptionHabits: {
            type: "string",
            title: "Consumption of Nicotine / Alcohol (Yes/No)",
          },
        },
      },
    },
    {
      id: "businessEmployment",
      label: "Employment & Business Details",
      schema: {
        type: "object",
        properties: {
          businessName: { type: "string", title: "Name of Current Business Firm" },
          businessConstitution: {
            type: "string",
            title: "Type of Business Firm",
          },
          partnershipShare: {
            type: "string",
            title: "If partnership - shareholding %",
          },
          businessCommencementDate: {
            type: "string",
            title: "Date of commencement of business",
          },
          placeOfIncorporation: {
            type: "string",
            title: "Place of incorporation / address",
            ui: { widget: "textarea", rows: 2 },
          },
          previousBusinessName: {
            type: "string",
            title: "Previous business name (if applicable)",
          },
          previousBusinessYears: {
            type: "string",
            title: "Years worked in previous business",
          },
          reasonForChange: {
            type: "string",
            title: "Reason for change / closing previous business",
          },
          totalWorkExperience: {
            type: "string",
            title: "Total work experience",
          },
          officialEmail: { type: "string", title: "Official / Business email ID" },
          contactNumber: { type: "string", title: "Contact number" },
        },
      },
    },
    {
      id: "businessOperations",
      label: "Business Operations",
      schema: {
        type: "object",
        properties: {
          typeOfIndustry: {
            type: "string",
            title: "Type of industry",
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of business",
          },
          constitution: {
            type: "string",
            title: "Constitution of business",
          },
          typeOfCustomer: {
            type: "string",
            title: "Type of customer",
          },
          businessSince: {
            type: "string",
            title: "Business since (year)",
          },
          promoterExperience: {
            type: "string",
            title: "Promoter experience (years)",
          },
          stabilityYears: {
            type: "string",
            title: "Stability in same business (years)",
          },
          stabilityVerifiedBy: {
            type: "string",
            title:
              "Stability verified by (registration certificate / dealership etc.)",
          },
          familyStructureInBusiness: {
            type: "string",
            title: "Family structure involved in business",
          },
          premisesOwnership: {
            type: "string",
            title: "Business premises ownership",
          },
          actualMonthlySales: {
            type: "string",
            title: "Actual monthly sales / receipts",
          },
          percentSalesOnCredit: {
            type: "string",
            title: "Sales done on credit (%)",
          },
          manufacturingTradingDetails: {
            type: "string",
            title: "Manufacturing / trading details",
            ui: { widget: "textarea", rows: 3 },
          },
          salesConcentration: {
            type: "string",
            title: "Is sales concentration > 50% on one party? (details)",
          },
          businessCycleDebtors: {
            type: "string",
            title: "Business cycle – Debtors days / amount",
          },
          businessCycleCreditors: {
            type: "string",
            title: "Business cycle – Creditors days / amount",
          },
          stockValuation: { type: "string", title: "Stock valuation as on date" },
          grossNetMargins: { type: "string", title: "Gross & net margins" },
          monthlyNetSaving: {
            type: "string",
            title: "Monthly net saving after expenses",
          },
          majorSuppliers: {
            type: "string",
            title: "Major suppliers",
            ui: { widget: "textarea", rows: 2 },
          },
          majorCustomers: {
            type: "string",
            title: "Major customers",
            ui: { widget: "textarea", rows: 2 },
          },
          numberOfEmployees: {
            type: "string",
            title: "Number of employees",
          },
          nameBoardSeen: {
            type: "string",
            title: "Name board seen (details)",
          },
          localityOfBusiness: {
            type: "string",
            title: "Locality of business / office",
          },
          residenceCumOffice: {
            type: "string",
            title: "Residence cum office setup (Yes/No)",
          },
          vatExciseApplicability: {
            type: "string",
            title: "Applicability of VAT / Excise / Service tax",
          },
          latestTaxReturnValue: {
            type: "string",
            title: "Latest quarter VAT return / Service tax paid",
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
      id: "existingLoanDetails",
      label: "Existing Loan Details",
      schema: {
        type: "object",
        properties: {
          existingLoans: {
            type: "array",
            items: {
              type: "object",
              properties: {
                typeOfLoan: { type: "string", title: "Type of Loan" },
                bankName: { type: "string", title: "Bank Name" },
                loanAmount: { type: "string", title: "Loan Amount" },
                emi: { type: "string", title: "EMI" },
                tenureRemaining: { type: "string", title: "Tenure Remaining" },
              },
            },
          },
        },
      },
    },
    {
      id: "costAndFunds",
      label: "Cost & Funds Information",
      schema: {
        type: "object",
        properties: {
          fundsRequired: { type: "string", title: "Funds required" },
          sourceOfOwnFunds: {
            type: "string",
            title: "Source of own funds (OCR)",
          },
          purchaseCost: { type: "string", title: "Purchase cost" },
          savings: { type: "string", title: "Savings" },
          constructionEstimate: {
            type: "string",
            title: "Construction estimate",
          },
          totalTransactionCost: {
            type: "string",
            title: "Total transaction cost",
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
                bankName: { type: "string", title: "Bank Name" },
                accountNumber: { type: "string", title: "Account Number" },
                accountType: { type: "string", title: "Account Type" },
                branch: { type: "string", title: "Branch" },
                operatingSinceYears: {
                  type: "string",
                  title: "Operating since (years)",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "familyMembers",
      label: "Other Family Member Details",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                relationship: { type: "string", title: "Relationship" },
                age: { type: "string", title: "Age" },
                occupation: { type: "string", title: "Occupation" },
                education: {
                  type: "string",
                  title:
                    "Educational Qualification (mention if Govt. / Private)",
                },
                contactNumber: { type: "string", title: "Contact No." },
                stayingWithApplicant: {
                  type: "string",
                  title: "Staying with Applicant (Yes/No)",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "references",
      label: "References (Business Parties)",
      schema: {
        type: "object",
        properties: {
          references: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                address: { type: "string", title: "Address" },
                relationship: { type: "string", title: "Relationship" },
                contactNumber: { type: "string", title: "Contact Number" },
                email: { type: "string", title: "Email Address" },
                yearsKnown: {
                  type: "string",
                  title: "No. of Years known the applicant",
                },
                photoWithApplicant: {
                  type: "string",
                  title: "Photo with Applicant (Yes/No)",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "businessFirmCheck",
      label: "Business Firm Check",
      schema: {
        type: "object",
        properties: {
          checks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name of the person" },
                businessName: { type: "string", title: "Name of business firm" },
                address: { type: "string", title: "Address" },
                yearsKnown: {
                  type: "string",
                  title: "Number of years known the firm",
                },
                contactNumber: { type: "string", title: "Contact number" },
                feedback: {
                  type: "string",
                  title: "Feedback (Positive / Neutral / Negative)",
                },
                businessCardCollected: {
                  type: "string",
                  title: "Business card collected (Yes/No)",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "pdOfficerComments",
      label: "PD Officer Comments",
      schema: {
        type: "object",
        properties: {
          comments: {
            type: "string",
            title: "Comments / Observations",
            ui: { widget: "textarea", rows: 4 },
          },
          initiatedAddress: {
            type: "string",
            title: "Initiated address",
            ui: { widget: "textarea", rows: 2 },
          },
          visitedAddress: {
            type: "string",
            title: "Visited address",
            ui: { widget: "textarea", rows: 2 },
          },
          residentialAddress: {
            type: "string",
            title: "Residential address",
            ui: { widget: "textarea", rows: 2 },
          },
          otherObservations: {
            type: "string",
            title: "Other observations",
            ui: { widget: "textarea", rows: 3 },
          },
          concerns: {
            type: "string",
            title: "Concerns",
            ui: { widget: "textarea", rows: 2 },
          },
          statusOfCase: {
            type: "string",
            title: "Status of the case",
            enum: ["Positive", "Negative", "Credit Refer"],
          },
          pdOfficerName: { type: "string", title: "Name of PD Officer" },
          discussionDate: { type: "string", title: "Date of Discussion" },
          pdOfficerSignature: { type: "string", title: "Signature of PD Officer" },
        },
      },
    },
  ],
} as const;

export default niwasSenpSchema;
