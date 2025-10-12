export const herohousingSelfSchema = {
  id: 15,
  bankName: "HeroHousing-Self",
  sections: [
    {
      id: "basicDetails",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          loanAccountNo: {
            type: "string",
            title: "Loan Account No.",
            readOnly: true,
          },
          nameOfCustomer: {
            type: "string",
            title: "Name of Customer",
            readOnly: true,
          },
          personMetInPd: {
            type: "string",
            title: "Person Met in PD",
          },
          relationshipWithApplicant: {
            type: "string",
            title: "Relationship with Applicant",
          },
          pdVisitDate: {
            type: "string",
            title: "PD Visit Date",
            format: "date",
          },
          pdVisitTime: {
            type: "string",
            title: "PD Visit Time",
          },
          pdAddress: {
            type: "string",
            title: "PD Address & Location",
          },
          latitude: {
            type: "string",
            title: "Latitude of Business Address",
          },
          longitude: {
            type: "string",
            title: "Longitude of Business Address",
          },
          requestedLoanAmount: {
            type: "number",
            title: "Requested Loan Amount",
            readOnly: true,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
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
        required: ["nameOfCustomer", "personMetInPd"],
      },
      required: true,
    },
    {
      id: "borrowerProfile",
      label: "Profile of Customer - Borrower Details",
      schema: {
        type: "object",
        properties: {
          borrowerDetails: {
            type: "string",
            title: "Borrower Details (Qualification, Professional Journey)",
          },
          applicantAge: {
            type: "integer",
            title: "Applicant Age",
          },
          qualification: {
            type: "string",
            title: "Qualification",
          },
          nativePlace: {
            type: "string",
            title: "Native Place",
          },
          currentResidence: {
            type: "string",
            title: "Current Residence",
          },
          professionalJourney: {
            type: "string",
            title:
              "Professional Journey (Service/Business Details Post Qualification to Date)",
          },
        },
      },
      required: true,
    },
    {
      id: "familyDetails",
      label: "Family Details",
      schema: {
        type: "object",
        properties: {
          familyBackground: {
            type: "string",
            title: "Family Background (Parents and Siblings)",
          },
          familyMembers: {
            type: "array",
            title: "Family Members (Including Dependents)",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relationshipWithApplicant: {
                  type: "string",
                  title: "Relationship with Applicant",
                },
                age: {
                  type: "integer",
                  title: "Age",
                },
                qualification: {
                  type: "string",
                  title: "Qualification",
                },
                occupation: {
                  type: "string",
                  title: "Occupation (Job/Business)",
                },
                incomeDetails: {
                  type: "string",
                  title: "Income Details / Dependent",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "currentBusinessDetails",
      label: "Current Business Details",
      schema: {
        type: "object",
        properties: {
          businessName: {
            type: "string",
            title: "Current Business Name",
            readOnly: true,
          },
          constitution: {
            type: "string",
            title: "Constitution",
            enum: [
              "Proprietorship",
              "Partnership",
              "Private Limited",
              "Limited Liability Partnership",
            ],
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business / Product or Services Details",
          },
          runningSince: {
            type: "string",
            title: "Running Since (Year)",
          },
          yearsOfExperience: {
            type: "integer",
            title: "Years of Experience in Same Line of Business",
          },
          partnersDirectorsDetails: {
            type: "string",
            title:
              "Details of Partners, Directors, Shareholders (if not Proprietorship)",
          },
        },
      },
      required: true,
    },
    {
      id: "businessPremisesDetails",
      label: "Details of Business Premises",
      schema: {
        type: "object",
        properties: {
          businessAddress: {
            type: "string",
            title: "Address of Business Premises",
          },
          additionalPlaces: {
            type: "string",
            title: "Additional Places of Business",
          },
          ownershipStatus: {
            type: "string",
            title: "Ownership of Business Premises",
            enum: ["Owned", "Rented", "Resi Cum Business"],
          },
          rentAmount: {
            type: "number",
            title: "Rent Amount (if Rented)",
          },
          landlordName: {
            type: "string",
            title: "Landlord Name (if Rented)",
          },
          sizeArea: {
            type: "string",
            title: "Size/Area of Business Premises (in sq ft)",
          },
          businessOperations: {
            type: "string",
            title: "Comment on Business Operations/Footfall/Stock",
          },
        },
      },
      required: true,
    },
    {
      id: "aboutBusinessDetails",
      label: "Details About Business",
      schema: {
        type: "object",
        properties: {
          productServicesDealing: {
            type: "string",
            title: "Brief About Product/Services Dealing",
          },
          numberOfEmployees: {
            type: "integer",
            title: "No. of Employees",
          },
          salaryDetails: {
            type: "string",
            title: "Salary Details",
          },
          quantumOfStock: {
            type: "string",
            title: "Quantum of Stock",
          },
          machineryAssets: {
            type: "string",
            title: "No. of Machinery and Assets Seen",
          },
          turnoverLastThreeYears: {
            type: "string",
            title: "Turnover of Last Three Years and Current Year Till Date",
          },
          grossMarginRatio: {
            type: "string",
            title: "Product/Service Gross Margins Ratio",
          },
          netMarginRatio: {
            type: "string",
            title: "Product/Service Net Margins Ratio",
          },
          expansionOrChanges: {
            type: "string",
            title:
              "Any Expansion or New Product or Change in Business Line in Last 2 Years",
          },
          localityAndCompetition: {
            type: "string",
            title:
              "Brief Details About Locality of Business, Surrounding Competitors, Overall Prospect",
          },
        },
      },
      required: true,
    },
    {
      id: "supplierCustomerDetails",
      label: "Details of Supplier and Customer",
      schema: {
        type: "object",
        properties: {
          supplierCustomerOverview: {
            type: "string",
            title:
              "Brief About Supplier and Customer and Geographical Reach/Presence",
          },
          numberOfSuppliers: {
            type: "integer",
            title: "No. of Total Suppliers",
          },
          supplierCreditPeriod: {
            type: "string",
            title: "Details of Terms for Credit Period (Suppliers)",
          },
          numberOfCustomers: {
            type: "integer",
            title: "No. of Total Customers",
          },
          customerCreditPeriod: {
            type: "string",
            title: "Details of Terms for Credit Period (Customers)",
          },
          billingCycle: {
            type: "string",
            title: "Billing Period/Cycle and Receipt Mode",
          },
          debtorsCreditors: {
            type: "string",
            title: "Total Debtors and Creditors as on Date",
          },
          references: {
            type: "array",
            title: "References (Min 2 Suppliers and 2 Customers)",
            minItems: 2,
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                phoneNumber: {
                  type: "string",
                  title: "Phone Number",
                },
                type: {
                  type: "string",
                  title: "Type",
                  enum: ["Supplier", "Customer"],
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "propertyDetails",
      label: "Details of Property",
      schema: {
        type: "object",
        properties: {
          customerVisitedProperty: {
            type: "string",
            title: "Whether Customer Visited the Property",
            enum: ["Yes", "No"],
          },
          typeOfProperty: {
            type: "string",
            title: "Type of Property",
            enum: [
              "Ready Build",
              "Plot",
              "Self Construction",
              "Under Construction",
              "Vacant",
            ],
          },
          propertyOccupiedBy: {
            type: "string",
            title: "Property is Occupied By Whom",
          },
          reasonIfNotSelfOccupied: {
            type: "string",
            title: "Reason if Not Self-Occupied",
          },
          sourceOfPropertyPurchase: {
            type: "string",
            title:
              "Source of Property Purchase (Dealer/Builder/Reference/Relative)",
          },
          nameOfSeller: {
            type: "string",
            title: "Name of Seller",
          },
          relationshipWithSeller: {
            type: "string",
            title: "Any Relationship with Seller",
          },
          propertyStructureAndArea: {
            type: "string",
            title: "Type of Property/Structure and Area",
          },
          actualDealValue: {
            type: "number",
            title: "Actual Deal Value",
          },
          saleDeedValue: {
            type: "number",
            title: "Sale Deed Value",
          },
          ocrSource: {
            type: "string",
            title: "OCR Source",
          },
          sellerLoanOnProperty: {
            type: "string",
            title: "Whether Seller is Having Any Loan on the Property",
            enum: ["Yes", "No"],
          },
          sellerPropertyPurchaseDate: {
            type: "string",
            title: "When Seller Bought the Property",
          },
        },
      },
      required: true,
    },
    {
      id: "investmentAndProperties",
      label: "Investment and Properties",
      schema: {
        type: "object",
        properties: {
          investmentHabits: {
            type: "string",
            title: "Customer Investment Habits and Monthly Savings",
          },
          currentResidenceOwnership: {
            type: "string",
            title: "Whether Current Residence is Owned or Rented",
            enum: ["Owned", "Rented"],
          },
          rentAmountIfRented: {
            type: "number",
            title: "Rent Amount (if Rented)",
          },
          assetsBuildTillDate: {
            type: "string",
            title:
              "Details of Assets Built Till Date (Immovable Properties, Movable Property, Gold, FD, Equity, Other Savings)",
          },
        },
      },
      required: true,
    },
    {
      id: "endUseOfFund",
      label: "End Use of Property/Fund",
      schema: {
        type: "object",
        properties: {
          endUseOfProperty: {
            type: "string",
            title:
              "Proposed End Use of Property (Self-Occupation/Investment etc) - For HL/P+C/Self Construction",
          },
          endUseOfFund: {
            type: "string",
            title: "Clear and Detailed End Use of Fund in LAP Cases",
          },
        },
      },
      required: true,
    },
    {
      id: "loanDetails",
      label: "Details of Loans",
      schema: {
        type: "object",
        properties: {
          loanDetails: {
            type: "array",
            title: "Existing Loans Details",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank/NBFC Name",
                },
                typeOfLoan: {
                  type: "string",
                  title: "Type of Loan",
                },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount",
                },
                emi: {
                  type: "number",
                  title: "EMI",
                },
                status: {
                  type: "string",
                  title: "Status",
                  enum: ["Open", "Closed"],
                },
                willContinueOrClose: {
                  type: "string",
                  title: "Will Continue or Close",
                  enum: ["Continue", "Close"],
                },
                repaymentAccount: {
                  type: "string",
                  title: "Repayment Account from Which EMI is Paid",
                },
                endUseOfFund: {
                  type: "string",
                  title:
                    "End Use of Fund (for BL/PL/LAP taken in last 3 years)",
                },
                mortgagePropertyAddress: {
                  type: "string",
                  title: "Mortgage Property Address (if HL/LAP)",
                },
                usageOfMortgageProperty: {
                  type: "string",
                  title: "Usage of Mortgage Property",
                },
                anyBouncingInLoan: {
                  type: "string",
                  title: "Any Bouncing in Loan",
                  enum: ["Yes", "No"],
                },
                bouncingReason: {
                  type: "string",
                  title: "Reason for Bouncing (if any)",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "bankingDetails",
      label: "Banking",
      schema: {
        type: "object",
        properties: {
          bankAccounts: {
            type: "array",
            title: "Bank Accounts Details",
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
                  enum: ["Savings", "Current", "CC/OD"],
                },
                accountOpenDate: {
                  type: "string",
                  title: "Account Open Date/Years",
                },
                majorBusinessTransactions: {
                  type: "string",
                  title: "Major Business Transactions Through This Account",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
          percentReceiptThroughBanking: {
            type: "string",
            title: "% of Total Receipt Routed Through Banking",
          },
        },
      },
      required: true,
    },
    {
      id: "documentVerificationAndChecks",
      label: "Document Verification and Other Checks",
      schema: {
        type: "object",
        properties: {
          documentsVerified: {
            type: "string",
            title:
              "Documents Verified (Sale/Purchase Register/Bills/Kutcha Records/Inventory/Payroll)",
          },
          tpcChecks: {
            type: "string",
            title: "TPC from Minimum 1 Neighbour and 1 Local Independent Party",
          },
          additionalChecks: {
            type: "string",
            title:
              "Additional Check from Reference (Any Other Person/Family Member Involved in Business)",
          },
          qrCodeLicensePermits: {
            type: "string",
            title:
              "QR Code, License, Permits, Name Board, Contact Number Verified",
          },
          googleCheckAndFeedback: {
            type: "string",
            title:
              "Google Check and Any Negative Observation/Feedback/Dedupe Match",
          },
        },
      },
      required: true,
    },
    {
      id: "incomeAssessment",
      label: "Income Assessment Details",
      schema: {
        type: "object",
        properties: {
          salesReceiptsMonthly: {
            type: "number",
            title: "Sales/Receipt (Monthly Average)",
          },
          otherIncome: {
            type: "number",
            title: "Other Income",
          },
          totalMonthlyIncome: {
            type: "number",
            title: "Total Monthly Income",
          },
          costOfMaterialOrService: {
            type: "number",
            title: "Cost of Material/Cost of Service",
          },
          directExpensesSalary: {
            type: "number",
            title: "Direct Expenses - Salary",
          },
          directExpensesRent: {
            type: "number",
            title: "Direct Expenses - Rent",
          },
          directExpensesElectricity: {
            type: "number",
            title: "Direct Expenses - Electricity",
          },
          directExpensesMiscellaneous: {
            type: "number",
            title: "Direct Expenses - Other Miscellaneous",
          },
          familyExpenses: {
            type: "number",
            title:
              "Other Family Expenses (School Fees/House Rent/Household Expenses)",
          },
          netMonthlyAppraisalIncome: {
            type: "number",
            title: "Net Monthly Appraisal Income",
          },
          monthlyObligationsEmi: {
            type: "number",
            title: "Less: Monthly Obligations/EMI Which Are Not Getting Closed",
          },
          netResidualIncome: {
            type: "number",
            title: "Net Residual Income (Monthly)",
          },
          comments: {
            type: "string",
            title: "Comments / Mode of Validation",
          },
        },
      },
      required: true,
    },
    {
      id: "observation",
      label: "Final Observation",
      schema: {
        type: "object",
        properties: {
          observation: {
            type: "string",
            title: "Final PD Observation and Comments",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default herohousingSelfSchema;
