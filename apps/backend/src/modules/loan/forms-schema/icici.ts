import { financialsSchema } from "../financials-schema/generic";
export const iciciSchema = {
  id: 16,
  bankName: "ICICI",
  sections: [
    financialsSchema,
    {
      id: "proposal",
      label: "Proposal",
      schema: {
        type: "object",
        properties: {
          apsId: {
            type: "string",
            title: "APS ID",
          },
          applicationNo: {
            type: "string",
            title: "Application No",
            readOnly: true,
          },
          initiationDate: {
            type: "string",
            title: "Initiation Date",
            format: "date",
          },
          branch: {
            type: "string",
            title: "Branch",
          },
        },
        required: ["applicationNo"],
      },
      required: true,
    },
    {
      id: "pdDetails",
      label: "PD Details",
      schema: {
        type: "object",
        properties: {
          businessName: {
            type: "string",
            title: "Business Name",
            readOnly: true,
          },
          pdConductedDate: {
            type: "string",
            title: "PD Conducted on (Date)",
            format: "date",
          },
          locationOfPd: {
            type: "string",
            title: "Location of PD (Resi/Office)",
            enum: ["Residence", "Office", "Factory", "Godown"],
          },
          locationAddressOfPd: {
            type: "string",
            title: "Location Address of PD",
          },
          personMetAtPd: {
            type: "string",
            title: "Person Met at PD",
          },
          relationshipWithApplicant: {
            type: "string",
            title: "Relationship of the Person Met During PD with Applicant",
          },
          distanceFromHfcBranch: {
            type: "string",
            title: "Distance from HFC Branch",
          },
          
        },
      },
      required: true,
    },
    {
      id: "applicants",
      label: "Applicants",
      schema: {
        type: "object",
        properties: {
          applicants: {
            type: "array",
            title: "Applicants",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name of the Applicant / Co-Applicant",
                },
                relationshipWithApplicant: {
                  type: "string",
                  title: "Relationship with Applicant",
                },
                currentAge: {
                  type: "integer",
                  title: "Current Age",
                },
                qualification: {
                  type: "string",
                  title: "Qualification",
                },
                incomeHolder: {
                  type: "string",
                  title: "Income Holder (Yes/No)",
                  enum: ["Yes", "No"],
                },
                propertyOwnership: {
                  type: "string",
                  title: "Property Ownership (Yes/No)",
                  enum: ["Yes", "No"],
                },
                incomeSource: {
                  type: "string",
                  title: "Income Source (Business/Rental/Salary)",
                },
                remarks: {
                  type: "string",
                  title: "Remarks If Any",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "familyBackgroundPersonalDetails",
      label: "Family Background & Personal Details",
      schema: {
        type: "object",
        properties: {
          residenceDetails: {
            currentResidenceOwnedRented: {
              type: "string",
              title: "Current Residence – Owned/Rented",
              enum: ["Owned", "Rented"],
            },
            ifOwnedOwnerName: {
              type: "string",
              title: "If Owned – Owner Name",
            },
            ifRentedOwnerNameContactNo: {
              type: "string",
              title: "If Rented – Owner Name & Contact No",
            },
            ifRentedPermanentResidenceDetails: {
              type: "string",
              title: "If Rented – Permanent Residence Details",
            },
            noOfYearsInCurrentResidence: {
              type: "integer",
              title: "No. of Years in Current Residence",
            },
            previousResidenceDetails: {
              type: "string",
              title: "Previous Residence Details",
            },
            noOfYearsInSameCity: {
              type: "integer",
              title: "No. of Years in Same City",
            },
            distanceFromCurrentResidenceToBusiness: {
              type: "string",
              title: "Distance from Current Residence to Business Premises",
            },

          },
          
          familyDetailsWithDependents: {
            type: "string",
            title: "Family Details with No. of Dependents",
          },
          earningMembersInFamily: {
            type: "string",
            title:
              "Earning Members in Family, Their Source of Income and Total Income",
          },
        },
      },
      required: true,
    },
    {
      id: "natureOfBusinessAndVintage",
      label: "Nature of Business and Business Vintage",
      schema: {
        type: "object",
        properties: {
          businessPremisesOwnedRented: {
            type: "string",
            title: "Business Premises Owned/Rented",
            enum: ["Owned", "Rented"],
          },
          businessPremisesOwnerDetails: {
            type: "string",
            title: "Business Premises Owner Details",
          },
          noOfYearsInSamePremises: {
            type: "integer",
            title: "No. of Years in Same Premises",
          },
          noOfYearsInSameBusiness: {
            type: "integer",
            title: "No. of Years in Same Business",
          },
          previousExperience: {
            type: "string",
            title: "Previous Experience (if any)",
          },
          businessActivity: {
            type: "string",
            title: "Business Activity",
          },
          grossMargin: {
            type: "string",
            title: "Gross Margin %",
          },
          netMargin: {
            type: "string",
            title: "Net Margin %",
          },
          ideaToStartBusiness: {
            type: "string",
            title: "Idea/Reason to Start Business",
          },
          staffDetails: {
            type: "string",
            title: "Staff Details",
          },
          documentsVerified: {
            type: "string",
            title:
              "Documents Verified (Kutcha Bills/License/Other Documents) and Period",
          },
          machineryAssetsUsed: {
            type: "string",
            title: "Machinery/Assets Used in Business",
          },
          businessVintageAsPerLocalReferences: {
            type: "integer",
            title: "Business Vintage as Per Local References (Years)",
          },
          businessVintageAsPerDocuments: {
            type: "integer",
            title: "Business Vintage as per Document Verified (Years)",
          },
          businessLocalityAndMarketCompetition: {
            type: "string",
            title: "Business Locality and Market Competition",
          },
        },
      },
      required: true,
    },
    {
      id: "incomeAssessment",
      label: "Income Assessment",
      schema: {
        type: "object",
        properties: {
          coreBusinessIncome: {
            type: "number",
            title: "Core Business Income",
          },
          anyOtherIncome: {
            type: "number",
            title: "Any Other Income",
          },
          maximumEmiPayingCapability: {
            type: "number",
            title: "Maximum EMI Paying Capability (Customer Confirmed)",
          },
        },
      },
      required: true,
    },
    {
      id: "assetCreation",
      label: "Asset Creation in Last 5 Years",
      schema: {
        type: "object",
        properties: {
          assetsCreated: {
            type: "string",
            title: "Assets Created in Last 5 Years",
          },
        },
      },
      required: true,
    },
    {
      id: "cashFlowAnalysis",
      label: "Cash Flow Analysis During PD (Not Applicable in Salaried Cases)",
      schema: {
        type: "object",
        properties: {
          applicantMonthlyTO: {
            type: "number",
            title: "Applicant - Monthly TO / Gross Receipts",
          },
          applicantCostOfRawMaterial: {
            type: "number",
            title: "Applicant - Less: Cost of Raw Material",
          },
          applicantRentIncome: {
            type: "number",
            title: "Applicant - Rent Income (If Any)",
          },
          applicantOtherIncome: {
            type: "number",
            title: "Applicant - Any Other Regular Income (Other than Business)",
          },
          applicantGrossMonthlyIncome: {
            type: "number",
            title: "Applicant - Gross Monthly Income",
          },
          applicantBusinessExpensesRent: {
            type: "number",
            title: "Applicant - Business Expenses: Rent",
          },
          applicantBusinessExpensesSalary: {
            type: "number",
            title: "Applicant - Business Expenses: Salary",
          },
          applicantBusinessExpensesElectricity: {
            type: "number",
            title: "Applicant - Business Expenses: Electricity",
          },
          applicantBusinessExpensesTravelling: {
            type: "number",
            title: "Applicant - Business Expenses: Travelling",
          },
          applicantBusinessExpensesOther: {
            type: "number",
            title: "Applicant - Business Expenses: Other Operating Expense",
          },
          applicantIncomeLeftForDomestic: {
            type: "number",
            title: "Applicant - Income Left for Domestic Expenses",
          },
          applicantHouseholdExpensesFood: {
            type: "number",
            title: "Applicant - Household Expenses: Food",
          },
          applicantHouseholdExpensesSchoolFees: {
            type: "number",
            title: "Applicant - Household Expenses: School and Tuition Fees",
          },
          applicantHouseholdExpensesOther: {
            type: "number",
            title: "Applicant - Household Expenses: Others",
          },
          applicantNetMonthlyIncome: {
            type: "number",
            title: "Applicant - Net Monthly Income Post All Expenses",
          },
          applicantSavingsInvestments: {
            type: "number",
            title: "Applicant - Less: Savings/Investments/Insurance Premiums",
          },
          applicantExistingEmi: {
            type: "number",
            title: "Applicant - Less: Existing EMI",
          },
          applicantNetSurplusForEmi: {
            type: "number",
            title: "Applicant - Net Surplus Available for Proposed EMI",
          },
          coApplicantMonthlyTO: {
            type: "number",
            title: "Co-Applicant - Monthly TO / Gross Receipts",
          },
          coApplicantCostOfRawMaterial: {
            type: "number",
            title: "Co-Applicant - Less: Cost of Raw Material",
          },
          coApplicantRentIncome: {
            type: "number",
            title: "Co-Applicant - Rent Income (If Any)",
          },
          coApplicantOtherIncome: {
            type: "number",
            title: "Co-Applicant - Any Other Regular Income",
          },
          coApplicantGrossMonthlyIncome: {
            type: "number",
            title: "Co-Applicant - Gross Monthly Income",
          },
          coApplicantBusinessExpensesRent: {
            type: "number",
            title: "Co-Applicant - Business Expenses: Rent",
          },
          coApplicantBusinessExpensesSalary: {
            type: "number",
            title: "Co-Applicant - Business Expenses: Salary",
          },
          coApplicantBusinessExpensesElectricity: {
            type: "number",
            title: "Co-Applicant - Business Expenses: Electricity",
          },
          coApplicantBusinessExpensesTravelling: {
            type: "number",
            title: "Co-Applicant - Business Expenses: Travelling",
          },
          coApplicantBusinessExpensesOther: {
            type: "number",
            title: "Co-Applicant - Business Expenses: Other Operating Expense",
          },
          coApplicantIncomeLeftForDomestic: {
            type: "number",
            title: "Co-Applicant - Income Left for Domestic Expenses",
          },
          coApplicantHouseholdExpensesFood: {
            type: "number",
            title: "Co-Applicant - Household Expenses: Food",
          },
          coApplicantHouseholdExpensesSchoolFees: {
            type: "number",
            title: "Co-Applicant - Household Expenses: School Fees",
          },
          coApplicantHouseholdExpensesOther: {
            type: "number",
            title: "Co-Applicant - Household Expenses: Others",
          },
          coApplicantNetMonthlyIncome: {
            type: "number",
            title: "Co-Applicant - Net Monthly Income Post All Expenses",
          },
          coApplicantSavingsInvestments: {
            type: "number",
            title: "Co-Applicant - Less: Savings/Investments",
          },
          coApplicantExistingEmi: {
            type: "number",
            title: "Co-Applicant - Less: Existing EMI",
          },
          coApplicantNetSurplusForEmi: {
            type: "number",
            title: "Co-Applicant - Net Surplus Available for Proposed EMI",
          },
          weeklySalesMonday: {
            type: "number",
            title: "Weekly Sales - Monday",
          },
          weeklySalesTuesday: {
            type: "number",
            title: "Weekly Sales - Tuesday",
          },
          weeklySalesWednesday: {
            type: "number",
            title: "Weekly Sales - Wednesday",
          },
          weeklySalesThursday: {
            type: "number",
            title: "Weekly Sales - Thursday",
          },
          weeklySalesFriday: {
            type: "number",
            title: "Weekly Sales - Friday",
          },
          weeklySalesSaturday: {
            type: "number",
            title: "Weekly Sales - Saturday",
          },
          weeklySalesSunday: {
            type: "number",
            title: "Weekly Sales - Sunday",
          },
          totalWeeklySales: {
            type: "number",
            title: "Total Weekly Sales",
          },
        },
      },
      required: true,
    },
    {
      id: "observationsAtPd",
      label: "Observations at the Time of PD",
      schema: {
        type: "object",
        properties: {
          stockValue: {
            type: "string",
            title: "Stock Value",
          },
          timeSpent: {
            type: "string",
            title: "Time Spent",
          },
          footfall: {
            type: "string",
            title: "Footfall",
          },
          sales: {
            type: "string",
            title: "Sales Observed",
          },
        },
      },
      required: true,
    },
    {
      id: "triggerPointVerification",
      label: "Trigger Point Verification",
      schema: {
        type: "object",
        properties: {
          forTraders: {
            type: "string",
            title: "For Traders (Weighing Machine Bill/UPI Scanner)",
          },
          forManufacturers: {
            type: "string",
            title: "For Manufacturers (Electricity Consumption)",
          },
          remarks: {
            type: "string",
            title: "Remarks",
          },
        },
      },
      required: true,
    },
    {
      id: "itrAndFinancial",
      label: "ITR and Financial",
      schema: {
        type: "object",
        properties: {
          itrFiling: {
            type: "string",
            title: "ITR Filling (Yes/No)",
            enum: ["Yes", "No"],
          },
          itrAmountDeclared: {
            type: "string",
            title: "If Filing - Amount of Income Declared",
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
          bankDetails: {
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
                  title: "A/c Type",
                  enum: ["Savings", "Current", "CC/OD"],
                },
                noOfYears: {
                  type: "integer",
                  title: "No. of Years",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "existingLoanDetails",
      label: "Existing Loan Details",
      schema: {
        type: "object",
        properties: {
          loans: {
            type: "array",
            title: "Existing Loans",
            items: {
              type: "object",
              properties: {
                lender: {
                  type: "string",
                  title: "Lender",
                },
                typeOfLoan: {
                  type: "string",
                  title: "Type of Loan",
                },
                loanAvailedYear: {
                  type: "integer",
                  title: "Loan Availed Year",
                },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount",
                },
                pos: {
                  type: "number",
                  title: "POS (Principal Outstanding)",
                },
                emi: {
                  type: "number",
                  title: "EMI",
                },
                securityOffered: {
                  type: "string",
                  title: "Security Offered",
                },
                emiDeductingBankAccount: {
                  type: "string",
                  title: "EMI Deducting Bank Account",
                },
              },
            },
          },
          totalLoanAmount: {
            type: "number",
            title: "Total Loan Amount",
          },
          totalPos: {
            type: "number",
            title: "Total POS",
          },
          totalEmi: {
            type: "number",
            title: "Total EMI",
          },
        },
      },
      required: true,
    },
    {
      id: "references",
      label: "References (Name & Contact No.)",
      schema: {
        type: "object",
        properties: {
          suppliersOrStaff: {
            type: "array",
            title: "Suppliers / Staff",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNo: {
                  type: "string",
                  title: "Contact No.",
                },
              },
            },
          },
          customers: {
            type: "array",
            title: "Customers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNo: {
                  type: "string",
                  title: "Contact No.",
                },
              },
            },
          },
          neighborFeedback: {
            type: "string",
            title: "Neighbor Feedback",
          },
        },
      },
      required: true,
    },
    {
      id: "collateralDetails",
      label: "Collateral Details",
      schema: {
        type: "object",
        properties: {
          propertyLocation: {
            type: "string",
            title: "Property Location",
          },
          propertyType: {
            type: "string",
            title: "Property Type",
          },
          propertyArea: {
            type: "string",
            title: "Property Area (sq ft)",
          },
          propertyValue: {
            type: "string",
            title: "Property Value",
          },
          registrationValue: {
            type: "string",
            title: "Registration Value",
          },
          proposePropertyCurrentOccupancy: {
            type: "string",
            title: "Proposed Property Current Occupancy",
          },
          proposePropertyDistanceFromBusiness: {
            type: "string",
            title: "Proposed Property Distance from Business",
          },
        },
      },
      required: true,
    },
    {
      id: "sellerDetails",
      label: "Seller Details (Purchase Case)",
      schema: {
        type: "object",
        properties: {
          sellerDetails: {
            type: "string",
            title: "Seller Details",
          },
        },
      },
      required: true,
    },
    {
      id: "ocrDetails",
      label: "OCR Details for Purchase Case",
      schema: {
        type: "object",
        properties: {
          ocrPaid: {
            type: "string",
            title: "OCR Paid",
          },
          ocrSource: {
            type: "string",
            title: "OCR Source",
          },
        },
      },
      required: true,
    },
    {
      id: "endUseOfLoan",
      label: "End Use of Loan",
      schema: {
        type: "object",
        properties: {
          endUseOfLoan: {
            type: "string",
            title: "End Use of Loan",
          },
        },
      },
      required: true,
    },
    {
      id: "remarks",
      label: "Remarks: Summary of Transaction",
      schema: {
        type: "object",
        properties: {
          summaryOfTransaction: {
            type: "string",
            title: "Summary of Transaction (Detailed Remarks)",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default iciciSchema;
