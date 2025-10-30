import financialsSchema from "../financials-schema/generic";
export const dcbSchema = {
  id: 12,
  bankName: "DCB",
  sections: [
    financialsSchema,
    {
      id: "dateOfVisit",
      label: "Date of Visit",
      schema: {
        type: "object",
        properties: {
          personMet: {
            type: "string",
            title: "Person Met",
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
          latitude: {
            type: "string",
            title: "Latitude",
          },
          longitude: {
            type: "string",
            title: "Longitude",
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
      id: "shareholdingPatternIn",
      label: "Shareholding Pattern (in %)",
      schema: {
        type: "object",
        properties: {
          history: {
            type: "string",
            title: "History",
          },
          yearOfEstablishment: {
            type: "integer",
            title: "Year of Establishment",
          },
        },
      },
      required: true,
    },
    {
      id: "anyChangeInOwnership",
      label: "Any Change in Ownership",
      schema: {
        type: "object",
        properties: {
          registrationAffiliations: {
            type: "string",
            title: "Registration / Affiliations",
          },
        },
      },
      required: true,
    },
    {
      id: "disputes",
      label: "Disputes",
      schema: {
        type: "object",
        properties: {
          businessActivities: {
            type: "string",
            title: "Business Activities",
          },
          businessProfile: {
            type: "string",
            title: "Business Profile",
          },
          products: {
            type: "string",
            title: "Products",
          },
          businessSetUp: {
            type: "string",
            title: "Business Set-up",
          },
          officeSetUpWithOverallLook: {
            type: "string",
            title: "Office Set-up with Overall Look",
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
        },
      },
      required: true,
    },
    {
      id: "emi",
      label: "EMI",
      schema: {
        type: "object",
        properties: {
          personalAssetsOfProprietor: {
            type: "string",
            title: "Personal Assets of Proprietor",
          },
        },
      },
      required: true,
    },
    {
      id: "contactNo",
      label: "Contact No",
      schema: {
        type: "object",
        properties: {
          sisterCompanies: {
            type: "string",
            title: "Sister Companies",
          },
        },
      },
      required: true,
    },
    {
      id: "assuredCovered",
      label: "Assured Covered",
      schema: {
        type: "object",
        properties: {
          performanceAfterLastAuditedFinancials: {
            type: "string",
            title: "Performance After Last Audited Financials",
          },
          lastAvailableFinancialStatementPeriod: {
            type: "string",
            title: "Last Available Financial Statement Period",
          },
        },
      },
      required: true,
    },
    {
      id: "recentSummaryFinancials2MonthsOld",
      label: "Recent Summary Financials (≤ 2 months old)",
      schema: {
        type: "object",
        properties: {
          advanceTaxesPaidCurrentAY: {
            type: "string",
            title: "Advance Taxes Paid (Current A.Y.)",
          },
          changeInBorrowingsBetweenFys: {
            type: "string",
            title: "Change in Borrowings (between FYs)",
          },
          changeInCapitalBetweenFys: {
            type: "number",
            title: "Change in Capital (between FYs)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          changeInTurnoverBetweenFys: {
            type: "number",
            title: "Change in Turnover (between FYs)",
          },
          last6MonthsTurnoverAsPerGstReturns: {
            type: "number",
            title: "Last 6 Months Turnover as per GST Returns",
          },
          netProfitOnSales: {
            type: "number",
            title: "Net Profit % on Sales",
          },
          debtorsPositionAsOn: {
            type: "string",
            title: "Debtors Position as on",
          },
          creditorsPositionAsOn: {
            type: "string",
            title: "Creditors Position as on",
          },
          otherBusinessInterestsOfTheProprietor: {
            type: "string",
            title: "Other Business Interests of the Proprietor",
          },
        },
      },
      required: true,
    },
    {
      id: "bankingDetailsStatutoryObligations",
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
            title: "Evidence of Statutory Dues (PF, PT, EIC)",
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
      id: "activityLevelsAtCpaVisit",
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
              "Level of Activity / Observations (Production / Delivery / Customers)",
          },
          photographsOfBusinessActivitySetupStock: {
            type: "string",
            title: "Photographs of Business Activity, Setup & Stock",
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
            title: "Details of End-Use of Funds",
          },
          loanRequired: {
            type: "number",
            title: "Loan Required",
          },
          emiComfortableWith: {
            type: "number",
            title: "EMI Comfortable With",
          },
        },
      },
      required: true,
    },
    {
      id: "propertyDetailsAddress",
      label: "Property Details (Address)",
      schema: {
        type: "object",
        properties: {
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
          },
          verification: {
            type: "string",
            title: "Verification",
          },
          aSalesAndPurchasesPeriodWise: {
            type: "string",
            title: "a) Sales and Purchases (Period Wise)",
          },
        },
      },
      required: true,
    },
    {
      id: "salesRs",
      label: "Sales (Rs.)",
      schema: {
        type: "object",
        properties: {
          bDocumentsVerifiedEGGstCertificateItrsBankStatement: {
            type: "string",
            title:
              "b) Documents Verified (e.g., GST Certificate, ITRs, Bank Statement)",
          },
          concludingImpressions: {
            type: "string",
            title: "Concluding Impressions",
          },
        },
      },
      required: true,
    },
    {
      id: "tpcFeedback",
      label: "TPC Feedback",
      schema: {
        type: "object",
        properties: {
          statusOfThisCasePositiveNegativeCreditRefer: {
            type: "string",
            title: "Status of this Case - Positive/Negative/Credit Refer",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default dcbSchema;
