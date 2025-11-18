import financialsSchema from "../financials-schema/generic";
export const axisBankSchema = {
  id: 3,
  bankName: "Axis Bank",
  sections: [
    {
      id: "applicantDetails",
      label: "Applicant Details",
      schema: {
        type: "object",
        properties: {
          applicationNumber: {
            type: "string",
            title: "Application ID",
            readOnly: true,
          },

          pdDate: {
            type: "string",
            title: "PD Date",
            format: "date",
          },
          product: {
            type: "string",
            title: "Product (HL / LAP / Asha HL)",
            enum: ["HL", "LAP", "Asha HL", "EL", "Others"],
          },
          loanAmount: {
            type: "number",
            title: "Loan Amount",
            readOnly: true,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          applicantName: {
            type: "string",
            title: "Customer Name",
            readOnly: true,
          },
          pdAddress: {
            type: "string",
            title: "PD Address Type (Residence/Office/Factory/Godown)",
            enum: ["Residence", "Office", "Factory", "Godown"],
          },
          applicantAddress: {
            type: "string",
            title: "Full Address",
            readOnly: true,
            ui: { widget: "textarea", rows: 3 },
          },
          applicantContactNumber: {
            type: "string",
            title: "Contact Number (Mobile / Landline)",
            readOnly: true,
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
          relationshipWithBorrower: {
            type: "string",
            title: "Relationship with Borrower",
            enum: [
              "Himself or Herself",
              "Co-applicant",
              "Guarantor",
              "Family",
              "Neighbor",
            ],
          },
        },
      },
      required: true,
    },
    {
      id: "familyBackground",
      label: "Family Background",
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
                relationToApplicant: {
                  type: "string",
                  title: "Relation to applicant",
                },
                age: {
                  type: "integer",
                  title: "age",
                },
              },
            },
          },
          totalFamilyMembers: {
            type: "integer",
            title: "Total Family Members (Nos)",
          },
          noOfEarningMembers: {
            type: "integer",
            title: "No. of Earning Members (Nos)",
          },
        },
      },
      required: true,
    },
    {
      id: "businessPlaceVintage",
      label: "Business Place & Vintage Details",
      schema: {
        type: "object",
        properties: {
          businessName: {
            type: "string",
            title: "Name of Firm",
            readOnly: true,
          },
          constitution: {
            type: "string",
            title:
              "Constitution (Proprietorship / Partnership / Company / LLP)",
            enum: ["Proprietorship", "Partnership", "Company", "LLP"],
          },
          whoStartedBusiness: {
            type: "string",
            title: "Who started the business (Self / Acquired / Second gen)",
            enum: ["self", "acquired", "second gen"],
          },
          ownershipOfBusinessPlace: {
            type: "string",
            title: "Ownership of business place (Self-owned / Rented)",
            enum: ["owned", "rented"],
          },
          yearsInCurrentOffice: {
            type: "integer",
            title: "Years in current office",
          },
          yearsInCurrentCity: {
            type: "integer",
            title: "Years in current city",
          },
          yearsInCurrentBusiness: {
            type: "integer",
            title: "Years in current business",
          },
          previousEmployment: {
            type: "string",
            title: "Previous employment (if any)",
          },
          isResiCumOffice: {
            type: "string",
            title: "Is Resi Cum office?",
            enum: ["Yes", "No"],
          },
          separateOfficeDetails: {
            type: "string",
            title: "Separate office details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
            show: {
              isResiCumOffice: "Yes",
            },
            required: {
              isResiCumOffice: "Yes",
            },
          },
        },
      },
      required: true,
    },
    {
      id: "businessFinancialProfile",
      label: "Business / Financial Profile",
      schema: {
        type: "object",
        properties: {
          natureOfBusiness: {
            type: "string",
            title:
              "Nature of Business (Trading / Manufacturing / Services / Others)",
            enum: ["Trading", "Manufacturing", "Services", "Others"],
          },
          natureOfBusinessOther: {
            type: "string",
            title: "Nature of Business (Other)",
            show: {
              natureOfBusiness: "Others",
            },
            required: {
              natureOfBusiness: "Others",
            },
          },
          productServicesOffered: {
            type: "string",
            title: "Product / Services Offered",
          },
          businessModelBackground: {
            type: "string",
            title: "Business Model & Background of Business",
            ui: {
              widget: "textarea",
              rows: 6,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "otherDetailsObserved",
      label: "Other details observed during visit",
      schema: {
        type: "object",
        properties: {
          businessNameBoardSeen: {
            type: "string",
            title: "Business name board seen",
            enum: ["Yes", "No"],
          },
          noOfEmployeesSeen: {
            type: "integer",
            title: "No. of employees seen",
          },
          businessActivitySeen: {
            type: "string",
            title: "Business activity seen",
            enum: ["Yes", "No"],
          },
          stockSeen: {
            type: "string",
            title: "Stock seen",
          },
          noOfMachinesSeen: {
            type: "integer",
            title: "No. of machines seen",
          },
          top3ClientsCustomers: {
            type: "array",
            title: "Top 3 Clients (Customers)",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactDetails: {
                  type: "integer",
                  title: "Contact Details",
                },
                averageDebtorDays: {
                  type: "integer",
                  title: "Average debtor days",
                },
              },
            },
          },
          top3ClientsSuppliers: {
            type: "array",
            title: "Top 3 Clients (Suppliers)",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactDetails: {
                  type: "integer",
                  title: "Contact Details",
                },
                averageCreditorDays: {
                  type: "integer",
                  title: "Average creditor days",
                },
              },
            },
          },
          otherBusinessIncomeSource: {
            type: "string",
            title: "Any other business or alternate income source",
          },
          otherObservationsRemarks: {
            type: "string",
            title: "Any other observations / remarks during visit",
          },
          neighborCheckThirdParty: {
            type: "string",
            title:
              "Details of neighbor check / Third party check done and status",
          },
        },
      },
      required: true,
    },
    {
      id: "commonPoints",
      label: "Common Points applicable for all cases",
      schema: {
        type: "object",
        properties: {
          turnOverAndMargin: {
            type: "number",
            title: "Turnover and Margin",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          peakSalesMonths: {
            type: "number",
            title: "Peak sales months - Volume in INR",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          lowSalesMonths: {
            type: "number",
            title: "Low sales months - Volume in INR",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          customerIdentityEstablished: {
            type: "string",
            title: "Customer Identity established during PD",
            enum: ["Yes", "No"],
          },
          customerIdentityDetails: {
            type: "string",
            title: "If yes, established through document",
            show: {
              customerIdentityEstablished: "Yes",
            },
            required: {
              customerIdentityEstablished: "Yes",
            },
          },
          charteredACDetails: {
            type: "string",
            title: "Chartered A/c details",
          },
          detailsOfExistingLoans: {
            type: "array",
            title: "Details of existing loans confirmed during PD",
            items: {
              type: "object",
              properties: {
                loanType: {
                  type: "string",
                  title: "Loan type",
                },
                loanAmount: {
                  type: "number",
                  title: "Loan amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                tenure: {
                  type: "string",
                  title: "Tenure",
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
                balTenure: {
                  type: "string",
                  title: "Bal tenure",
                },
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
              },
            },
          },
          loansFromFamilyFriends: {
            type: "string",
            title: "Loans taken from family, friends business associates etc.",
          },
          workingCapitalBankName: {
            type: "string",
            title: "Working Capital - Bank Name",
          },
          workingCapitalLimit: {
            type: "string",
            title: "Working Capital - Limit",
          },
          workingCapitalUtilisation: {
            type: "string",
            title: "Working Capital - Utilisation",
          },
          workingCapitalCollateral: {
            type: "string",
            title: "Working Capital - Collateral",
          },
          workingCapitalLinkedLoans: {
            type: "string",
            title: "Working Capital - Details of linked loans (if any)",
          },
          endUseOfProposedLoan: {
            type: "string",
            title:
              "End Use of proposed Loan in detail(Basis purpose of loan, in case cash out end use must be detailed)",
            ui: {
              widget: "textarea",
              rows: 6,
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
                  title: "A/c type",
                  enum: ["Savings", "Current", "CC/OD"],
                },
                averageBalance: {
                  type: "number",
                  title: "Average Balances",
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
          anyChequeBounces: {
            type: "string",
            title: "Banking performance- Any cheque bounces seen (Y/N)",
            enum: ["Yes", "No"],
          },
          addressOfProperty: {
            type: "string",
            title: "Details of collateral- Address of property",
          },
          statusOfPD: {
            type: "string",
            title: "Status of PD (Positive, Negative, Credit Refer)",
            enum: ["Positive", "Negative", "Credit Refer"],
          },
        },
      },
    },

    {
      id: "pdDetails",
      label: "PD Details",
      schema: {
        type: "object",
        properties: {
          pdOfficerName: {
            type: "string",
            title: "PD Officer Name",
          },
          // pdOfficerSignature: {
          //   type: "string",
          //   title: "PD Officer Signature",
          // },
        },
      },
    },

    {
      id: "annexure1",
      label: "Annexure 1",
      schema: {
        type: "object",
        properties: {
          monthlTurnOver: {
            type: "number",
            title: "Monthly Turnover (Totalmonthlybilling)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          totalPurchases: {
            type: "number",
            title:
              "Total Purchases (Monthly purchases, costofacquisition etc.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          grossAndNetMargin: {
            type: "number",
            title: "Gross and Net margin of business",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          cashFlowAnalysisDuringPD: {
            type: "object",
            title: "Estimated income - Cash flow analysis during PD",
            properties: {
              monthlyToGrossReceiptsEstimated: {
                type: "number",
                title: "Monthly TO / Gross Receipts (estimated)",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              anyOtherIncome: {
                type: "number",
                title: "Any other income (monthly)(commison rental etc.)",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              lessDirectExpenses: {
                type: "number",
                title:
                  "Less: Direct expenses (Purchase cost, cost of goods sold, selling expenses)",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              lessRentalExpenses: {
                type: "number",
                title: "Less: Indirect expenses",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              lessStaffSalary: {
                type: "number",
                title: "Less: Staff Salary",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              lessElectricity: {
                type: "number",
                title: "Less: Electricity/mobile/travelexpenses.",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              lessAnyotherExpenses: {
                type: "number",
                title: "Less: Any other expenses than mentioned above",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              foodExpenses: {
                type: "number",
                title: "Food Expenses",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              childrenEducation: {
                type: "number",
                title: "Children education",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              houseRent: {
                type: "number",
                title: "House rent(if any)",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              medicalExpenses: {
                type: "number",
                title: "Medical expenses",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              otherHouseHoldExpenses: {
                type: "number",
                title: "Other household expenses",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              lessSavingsInvestmentsInsurancePremium: {
                type: "number",
                title: "Less: Savings / investments / insurance premium",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              lessExistingEmisObligations: {
                type: "number",
                title: "Less: Existing EMIs (obligations)",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              emiAllocatedFoTheProposedLoan: {
                type: "number",
                title: "EMI allocated for the proposed loan",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              netSurplus: {
                type: "number",
                title: "Net Surplus income post all expenses & obligations",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
            },
          },
          loansTakenFromFamilyFriends: {
            type: "number",
            title: "Loans taken from family, friends business associates etc.",
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

    financialsSchema,
  ],
} as const;
export default axisBankSchema;
