export const niwasSalariedSchema = {
  id: 23,
  bankName: "Niwas Salaried",
  sections: [
    {
      id: "generalInfo",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          prospectNo: { type: "string", title: "Prospect No." },
          nameOfApplicant: { type: "string", title: "Name of Applicant" },
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
          houseSize: {
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
          twoWheeler: { type: "string", title: "Two-Wheeler (Yes/No)" },
          autoCab: { type: "string", title: "Auto/Cab (Yes/No)" },
          computerLaptop: {
            type: "string",
            title: "Computer / Laptop (Yes/No)",
          },
          ac: { type: "string", title: "AC (Yes/No)" },
          fridge: { type: "string", title: "Fridge (Yes/No)" },
          induction: { type: "string", title: "Induction (Yes/No)" },
          investments: {
            type: "string",
            title: "Investments (property, amount etc.)",
            ui: { widget: "textarea", rows: 2 },
          },
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
      id: "employmentDetails",
      label: "Employment Details",
      schema: {
        type: "object",
        properties: {
          employerName: {
            type: "string",
            title: "Name of Current Employer/Business Firm",
          },
          yearsInCurrentJob: {
            type: "string",
            title: "Years in Current Job / Date of Joining",
          },
          totalWorkExperience: {
            type: "string",
            title: "Total Work Experience (years)",
          },
          officialEmail: {
            type: "string",
            title: "Official / Business Email ID",
          },
          contactNumber: {
            type: "string",
            title: "Contact Number",
          },
          numberOfEmployeesInFirm: {
            type: "string",
            title: "Number of employees in firm",
          },
        },
      },
    },
    {
      id: "companyDetails",
      label: "Company / Employer Information",
      schema: {
        type: "object",
        properties: {
          companyHeadOffice: {
            type: "string",
            title: "Company head office location",
          },
          promotersNames: {
            type: "string",
            title: "Name of promoters / management",
          },
          numberOfCompanyEmployees: {
            type: "string",
            title: "Number of company employees",
          },
          constitution: {
            type: "string",
            title: "Constitution",
          },
          citiesPresent: {
            type: "string",
            title: "Presence in how many cities / towns",
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of business / services provided",
            ui: { widget: "textarea", rows: 2 },
          },
          typeOfCustomers: {
            type: "string",
            title: "Type of customers",
          },
          yearsSinceIncorporation: {
            type: "string",
            title: "Years since incorporation",
          },
          gstRegistered: {
            type: "string",
            title: "GST registered (Yes/No)",
          },
          gstNumber: { type: "string", title: "GST number" },
          branchesAcrossIndia: {
            type: "string",
            title: "Branches across India",
          },
          shareHoldingPattern: {
            type: "string",
            title: "Share holding pattern",
          },
          managementTeam: {
            type: "string",
            title: "Management team",
          },
          bankingRelationship: {
            type: "string",
            title: "Banking relationship (working capital, term loans etc.)",
          },
        },
      },
    },
    {
      id: "businessPremises",
      label: "Business Premises & Operations",
      schema: {
        type: "object",
        properties: {
          businessPremiseOwnership: {
            type: "string",
            title: "Business premises whether owned or rented",
          },
          monthlySalesReceipts: {
            type: "string",
            title: "Actual monthly sales / receipts as per customer",
          },
          percentSalesOnCredit: {
            type: "string",
            title: "What % sales is done on credit",
          },
          manufacturingTradingDetails: {
            type: "string",
            title: "Manufacturing / trading details",
            ui: { widget: "textarea", rows: 2 },
          },
          salesConcentration: {
            type: "string",
            title: "Sales concentration >50% on one party (details)",
          },
          businessCycleDebtors: {
            type: "string",
            title: "Business cycle – Debtors",
          },
          businessCycleCreditors: {
            type: "string",
            title: "Business cycle – Creditors",
          },
          stockValuation: {
            type: "string",
            title: "Stock valuation as on date",
          },
          grossNetMargins: {
            type: "string",
            title: "Gross & net margins",
          },
          monthlyNetSaving: {
            type: "string",
            title: "Monthly net saving (Rs.)",
          },
          majorSuppliers: {
            type: "string",
            title: "Name & contact of two major suppliers",
          },
          majorCustomers: {
            type: "string",
            title: "Name & contact of two major buyers",
          },
          numberOfEmployees: {
            type: "string",
            title: "No. of employees",
          },
          nameBoardSeen: {
            type: "string",
            title: "Name board seen (details)",
          },
          localityOfOffice: {
            type: "string",
            title: "Locality of business / office",
          },
          residenceCumOffice: {
            type: "string",
            title: "Whether residence cum office set up",
          },
          vatExciseApplicability: {
            type: "string",
            title: "Applicability of VAT / Excise / Service tax",
          },
          latestTaxReturn: {
            type: "string",
            title: "Latest VAT / Service tax paid",
          },
        },
      },
    },
    {
      id: "essChecklist",
      label: "ESS Checklist",
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
                typeOfLoan: { type: "string", title: "Type of Loan" },
                bankName: { type: "string", title: "Bank Name" },
                loanAmount: { type: "string", title: "Loan Amount" },
                emi: { type: "string", title: "EMI" },
                tenureRemaining: { type: "string", title: "Tenure remaining" },
              },
            },
          },
        },
      },
    },
    {
      id: "loanPurpose",
      label: "Loan Purpose & Cost",
      schema: {
        type: "object",
        properties: {
          purposeOfLoan: {
            type: "string",
            title: "Purpose of loan",
          },
          minimumLoanAmountRequired: {
            type: "string",
            title: "Minimum loan amount required",
          },
          tenureRequired: {
            type: "string",
            title: "Tenure required",
          },
          monthlyHouseholdExpenses: {
            type: "string",
            title: "Monthly household expenses",
          },
          comfortableEmi: {
            type: "string",
            title: "Comfortable EMI",
          },
          fundsRequired: {
            type: "string",
            title: "Funds required",
          },
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
          registrationCharges: {
            type: "string",
            title: "Registration / stamp duty charges",
          },
          otherLoanAmountTaken: {
            type: "string",
            title: "Other loan amount taken",
          },
          totalAmountSpent: {
            type: "string",
            title: "Total amount spent",
          },
          totalTransactionCost: {
            type: "string",
            title: "Total transaction cost",
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
                relation: { type: "string", title: "Relation" },
                age: { type: "string", title: "Age" },
                employmentType: {
                  type: "string",
                  title: "Employment Type",
                },
                education: {
                  type: "string",
                  title: "Educational Qualification",
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
      label: "Reference Details",
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
                designation: { type: "string", title: "Designation" },
                yearsKnown: {
                  type: "string",
                  title: "No. of Years known the applicant",
                },
                contactNumber: { type: "string", title: "Contact Number" },
                email: { type: "string", title: "Email Address" },
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
      id: "employerFirmCheck",
      label: "Employer Firm Check",
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
            title: "Comments / Observation of the case",
            ui: { widget: "textarea", rows: 4 },
          },
          pdOfficerName: { type: "string", title: "Name of PD Officer" },
          discussionDate: { type: "string", title: "Date of Discussion" },
          pdOfficerSignature: { type: "string", title: "Signature of PD Officer" },
        },
      },
    },
  ],
} as const;

export default niwasSalariedSchema;
