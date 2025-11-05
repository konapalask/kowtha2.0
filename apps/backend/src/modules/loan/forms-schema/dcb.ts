import statement3Schema from "../financials-schema/statement3";
export const dcbSchema = {
  id: 12,
  bankName: "DCB",
  sections: [
    {
      id: "basicDetails",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          personMet: {
            type: "string",
            title: "Person(S) Met",
          },
          name: {
            type: "string",
            title: "Name",
            readOnly: true,
          },
          designation: {
            type: "string",
            title: "Designation",
          },
          yearsOfService: {
            type: "integer",
            title: "Years of Service",
          },
        },
        required: ["name"],
      },
      required: true,
    },
    {
      id: "borrowerSNameAndAddress",
      label: "Borrower’s Name and Address",
      schema: {
        type: "object",
        properties: {
          borrowerName: {
            type: "string",
            title: "Borrower's Name",
          },
          residenceAddress: {
            type: "string",
            title: "Residence Address",
          },
          businessAddress: {
            type: "string",
            title: "Business Address",
          },
          otherSiteSOfTheBorrower: {
            type: "string",
            title: "Other Site(s) of the Borrower",
          },
          constitutionOfBorrower: {
            type: "string",
            title: "Constitution of Borrower",
            enum: [
              "Proprietorship",
              "Partnership",
              "Private Limited",
              "Public Limited",
              "LLP",
              "HUF",
              "Others",
            ],
          },
          detailsOfDirectorsProprietor: {
            type: "string",
            title: "Details of Directors & Proprietor",
          },
        },
      },
      required: true,
    },
    {
      id: "detailsOfDirectorsAndProprietor",
      label: "Details of Directors & Proprietor",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            nameOfShareholder: {
              type: "string",
              title: "Name",
            },
            ageOfShareholder: {
              type: "integer",
              title: "Age",
            },
            qualifications: {
              type: "string",
              title: "Qualifications",
            },
            responsibilities: {
              type: "string",
              title: "Responsibilities",
            },
            shareholdingPatternIn: {
              type: "number",
              title: "Share holding Pattern (in %)",
            },
          },
        },
      },
      required: true,
    },
    {
      id: "history",
      label: "History",
      schema: {
        type: "object",
        properties: {
          yearOfEstablishment: {
            type: "integer",
            title: "Year of Establishment",
          },
          anyChangeInOwnership: {
            type: "string",
            title: "Any Change in Ownership",
          },
          registrationAffiliations: {
            type: "string",
            title: "Registration / Affiliations",
          },
          anyAwardsWon: {
            type: "string",
            title: "Any Awards Won",
          },
          anyChangeInRegisteredOffice: {
            type: "string",
            title: "Any Change in Registered Office",
          },
          legalProceedings: {
            type: "string",
            title: "Legal Proceedings",
          },
          disputes: {
            type: "string",
            title: "Disputes",
          },
        },
      },
      required: true,
    },

    {
      id: "businessActivities",
      label: "Business Activities",
      schema: {
        type: "object",
        properties: {
          businessProfile: {
            type: "string",
            title: "Business Profile",
          },
          products: {
            type: "string",
            title: "Products",
          },

        },
      },
    },
    
    {
      id: "businessSetup",
      label: "Business Set-up",
      schema: {
        type: "object",
        properties: {
          officeSetUpWithOverallLook: {
            type: "array",
            title: "Office Set-up with Overall Look",
            items: {
              type: "object",
              properties: {
                detail: {
                  type: "string",
                  title: "Detail",
                  ui: {
                    widget: "textarea",
                    rows: 3,
                  },
                },
              },
            },
          },
          expenses: {
            type: "array",
            title: "Expenses",
            items: {
              type: "object",
              properties: {
                expenseDetail: {
                  type: "string",
                  title: "Expense Detail",
                  ui: {
                    widget: "textarea",
                    rows: 3,
                  },
                },
              },
            },
          },
          transactions: {
            type: "array",
            title: "Transactions",
            items: {
              type: "object",
              properties: {
                transactionDetail: {
                  type: "string",
                  title: "Transaction Detail",
                  ui: {
                    widget: "textarea",
                    rows: 3,
                  },
                },
              },
            },
          },
          plantAndMachinery: {
            type: "string", 
            title: "Plant and Machinery",
          },
          officeEquipment: {
            type: "string",
            title: "Office Equipment",
          },
          workersAndSalaries: {
            type: "string",
            title: "Workers and Salaries",
          },
          noOfEmployees: {
            type: "integer",
            title: "No. of Employees",
          },
          typeOfBusiness: {
            type: "string",
            title: "Type",
          },
          averagePay: {
            type: "number",
            title: "Average Pay",
          },
        },
      },
      required: true,
    },
    {
      id: "detailsOfAllLoansAsOn",
      label: "Details of All Loans as on",
      schema: {
          type: "array",
          items: {
            type: "object",
        properties: {
          bank: {
            type: "string",
            title: "Bank",
          },
          typeOfLoan: {
            type: "string",
            title: "Type of Loan",
          },
          loanAmount: {
            type: "number",
            title: "o/s Amount/",
          },
          emi: {
            type: "number",
            title: "EMI",
          },
         
        },
        },
      },
      required: true,
    },
    {
      id: "personalAssetsOfProprietor",
      label: "Personal Assets of Proprietor",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            asset: {
              type: "string",
              title: "Asset",
            },
            value: {
              type: "number",
              title: "Value",
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
      required: true,
    },
    {
      id: "detailsOfCustomers",
      label: "Details of Customers / Clients: Not Applicable- Walk in Customers.",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
          nameOfCustomers: {
            type: "string",
            title: "Name of Customers",
          },
          location: {
            type: "string",
            title: "Location",
          },
          contactNo: {
            type: "number",
            title: "Contact No",
          },
        },
      },
      },
      required: true,
    },
    {
      id: "detailsOfSuppliers",
      label: "Details of Suppliers",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            nameOfSuppliers: {
              type: "string",
              title: "Name of Suppliers",
            },
            location: {
              type: "string",
              title: "Location",
            },
            contactNo: {
              type: "number",
              title: "Contact No",
            },
          },
        },
      },
      required: true,
    },
    {
      id: "sisterCompanies",
      label: "Sister Companies :",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            nameOfSisterCompanies: {
              type: "string",
              title: "Name of firm",
            },
            businessProfile: {
              type: "string",
              title: "Business Profile",
            },
            turnover: {
              type: "number",
              title: "Turnover",
              formatter: {
                useIndianFormat: true,
                locale: "en-IN",
                maxDecimalPlaces: 2,
                minDecimalPlaces: 0,
              },
            },
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
          },
        },
      },
      required: true,
    },

    {
      id: "insuranceCompanyName",
      label: "Insurance Company Name",
      schema: {
        type: "string",
        title: "Insurance Company Name",
      },
      required: true,
    },
    {
      id: "insuranceDetails",
      label: "Insurance Details",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
          assetsCovered: {
            type: "string",
            title: "Assets Covered",
          },
          coverNoteNoPolicyNo: {
            type: "string",
            title: "Cover Note No. / Policy No",
          },
          validUpTo: {
            type: "string",
            title: "Valid up to",
          },
          sumAssured: {
            type: "number",
            title: "Sum Assured",
          },
          assuredCovered: {
            type: "string",
            title: "Assured Covered",
          },
         },
        },
      },
      required: true,
    },
    {
      id: "performanceDetails",
      label: "Performance After Last Audited Financials",
      schema: {
        type: "object",
        properties: {
          lastAvailableFinancialStatementPeriod: {
            type: "string",
            title: "Last available financial statement period",
          },
          recentSummaryFinancials: {
            type: "string",
            title: "Recent summary financials ( up to a period not more than two months old)",
          },
          advanceTaxesPaidCurrentAY: {
            type: "number",
            title: "Advance Taxes Paid (for current A.Y.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          changeInBorrowingsBetweenFys: {
            type: "number",
            title: "Change in Borrowings (from F.Y. 20-21 to F.Y. 21-22)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          changeInCapitalBetweenFys: {
            type: "number",
            title: "Change in Capital (from F.Y. 22-23 to F.Y. 23-24)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          changeInTurnoverBetweenFys: {
            type: "number",
            title: "Change in Turnover (from F.Y. 22-23 to F.Y. 23-24)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          last6MonthsTurnoverAsPerGstReturns: {
            type: "number",
            title: "Last 6 Months Turnover as per GST Returns",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netProfitOnSales: {
            type: "number",
            title: "Net Profit % on Sales",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          debtorsPositionAsOn: {
            type: "string",
            title: "Debtors Position as on",
          },
          creditorsPositionAsOn: {
            type: "string",
            title: "Creditors Position as on",
          },
        },
      },
      required: true,
    },
    {
      id: "otherBusinessInterests",
      label: "Other Business Interests of the Proprietor",
      schema: {
        type: "object",
        properties: {
          otherBusinessInterestsOfTheProprietor: {
            type: "string",
            title: "Other Business Interests of the Proprietor",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "bankingDetails",
      label: "Banking Details & Statutory Obligations",
      schema: {
        type: "object",
        properties: {
          bankName: {
            type: "string",
            title: "Bank Name",
          },
          branch: {
            type: "string",
            title: "Branch",
          },
          accountNumber: {
            type: "integer",
            title: "Account Number",
          },
          accountType: {
            type: "string",
            title: "Account Type",
          },
          bankingSince: {
            type: "string",
            title: "Banking Since",
          },
          evidenceOfStatutoryDuesPfPtEic: {
            type: "string",
            title: "Evidence of statutory dues being paid on time PF, PT and EIC (Employee related)",
          },
          municipalCorporationTaxesBstCstMvat: {
            type: "string",
            title: "Municipal & Corporation Taxes (BST, CST & MVAT)",
          },
          lastUtilityPaymentMadeElectricity: {
            type: "string",
            title: "Last Utility Payment Made (Electricity)",
          },
        },
      },
      required: true,
    },
    {
      id: "activityLevelsAtCPAVisit",
      label: "Activity Levels at CPA Visit",
      schema: {
        type: "object",
        properties: {
          numberOfEmployeesWorkersObserved: {
            type: "integer",
            title: "Number of Employees & Workers Observed",
          },
          levelOfActivityObservationsProductionDeliveryCustomers: {
            type: "string",
            title:
              "Level of activity as well as overall observation of business (description of Production / Delivery / Customers)",
          },
          photographsOfBusinessActivitySetupStock: {
            type: "string",
            title: "Photographs of Business Activity, Setup and Stock",
          },
        },
      },
      required: true,
    },
    {
      id: "loanPurpose",
      label: "Loan Purpose",
      schema: {
        type: "object",
        properties: {
          detailsOfEndUseOfFunds: {
            type: "string",
            title: "End-Use of Funds (incl Cash out use)",
          },
          loanRequired: {
            type: "number",
            title: "Loan Required",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          emiComfortableWith: {
            type: "number",
            title: "EMI Comfortable With",
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
      id: "detailsOfPropertyToBeMortgaged",
      label: "Details of Property to be mortgaged",
      schema: {
        type: "object",
        properties: {
          propertyDetailsAddress: {
            type: "string",
            title: "Property Details (address)",
          },
          nameOfThePropertyOwner: {
            type: "string",
            title: "Name of the Property Owner",
          },
          usageOfProperty: {
            type: "string",
            title: "Usage of Property",
          },
          occupancyStatus: {
            type: "string",
            title: "Occupancy Status",
          },
          estimatedValueAsPerCustomer: {
            type: "number",
            title: "Estimated Value as per Customer",
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
      id: "verification",
      label: "Verification",
      schema: {
        type: "object",
        properties: {
          detailsOfSalesAndPurchasesPeriodWise: {
            type: "array",
            items: {
              type: "object",
              properties: {
                months: {
                  type: "integer",
                  title: "Months",
                },
                purchasesRs: {
                  type: "number",
                  title: "Purchases (Rs.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                salesRs: {
                  type: "number",
                  title: "Sales (Rs.)",
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
          documentVerification: {
            type: "string",
            title: "Document Verified",
          },
        },
      },
      required: true,
    },
    {
      id: "concludingImpressions",
      label: "Concluding impressions",
      schema: {
        type: "object",
        properties: {
          concludingImpressions: {
            type: "string",
            title: "Concluding Impressions",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
        },
      },
      required: true,
    },
    statement3Schema,
  ],
} as const;
export default dcbSchema;
