export const adityaBirlaSchema = {
  id: 7,
  bankName: "Aditya Birla",
  sections: [
    {
      id: "applicantDetails",
      label: "Applicant Details",
      schema: {
        type: "object",
        properties: {
          nameOfApplicant: {
            type: "string",
            title: "Name of Applicant",
            readOnly: true,
          },
          nameOfCoApplicant: {
            type: "string",
            title: "Name of Co-applicant",
          },
          aboutTheBusiness: {
            type: "string",
            title: "About the Business",
          },
          nameOfBusiness: {
            type: "string",
            title: "Name of Business",
            readOnly: true,
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
        required: ["nameOfApplicant", "nameOfBusiness"],
      },
      required: true,
    },
    {
      id: "noOfYearsInTheCurrentAddress",
      label: "No. of years in the current address",
      schema: {
        type: "object",
        properties: {
          noOfYearsInTheCurrentAddress: {
            type: "integer",
            title: "No. of Years in the Current Address",
          },
          constitutionOfBusiness: {
            type: "string",
            title: "Constitution of Business",
            enum: [
              "Proprietorship",
              "Partnership",
              "Private Limited",
              "Public Limited",
              "LLP",
              "HUF",
            ],
          },
        },
      },
      required: true,
    },
    {
      id: "nameOfOtherPartnersIfItIsAPartnershipConcern",
      label: "Name of other Partners (if it is a partnership concern)",
      schema: {
        type: "object",
        properties: {
          nameOfOtherPartners: {
            type: "string",
            title: "Name of other Partners",
          },
          management: {
            type: "string",
            title: "Management",
          },
          contactNumber: {
            type: "string",
            title: "Contact Number",
            pattern: "^[0-9]{10}$",
          },
          tin: {
            type: "string",
            title: "TIN",
          },
          pan: {
            type: "string",
            title: "PAN",
          },
          certificateOfIncorporation: {
            type: "string",
            title: "Certificate of Incorporation",
          },
        },
      },
      required: true,
    },
    {
      id: "documentsVerified",
      label: "Documents verified",
      schema: {
        type: "object",
        properties: {
          documentsVerified: {
            type: "string",
            title: "Documents Verified",
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business",
            enum: [
              "Manufacturing",
              "Trading",
              "Service",
              "Retail",
              "Wholesale",
              "Other",
            ],
          },
          mainProduct: {
            type: "string",
            title: "Main product",
          },
          mainRawMaterial: {
            type: "string",
            title: "Main Raw material",
          },
        },
      },
      required: true,
    },
    {
      id: "vendorsSuppliersToApplicant",
      label: "Vendors / suppliers to applicant",
      schema: {
        type: "object",
        properties: {
          vendorsSuppliersToApplicant: {
            type: "string",
            title: "Vendors / Suppliers to Applicant",
          },
          businessTransaction: {
            type: "string",
            title: "Business transaction",
          },
          stockObserved: {
            type: "string",
            title: "Stock observed",
            enum: ["High", "Medium", "Low", "No Stock"],
          },
          ifNoStocksObservedReasonForTheSame: {
            type: "string",
            title: "If no stocks observed, reason for the same",
          },
          businessActivityObserved: {
            type: "string",
            title: "Business activity observed",
          },
        },
      },
      required: true,
    },
    {
      id: "salesPaymentTerms",
      label: "Sales payment terms",
      schema: {
        type: "object",
        properties: {
          gstRegistration: {
            type: "string",
            title: "GST Registration",
          },
          itrsFiling: {
            type: "string",
            title: "ITRs filing",
          },
        },
      },
      required: true,
    },
    {
      id: "noOfEmployees",
      label: "No. of Employees",
      schema: {
        type: "object",
        properties: {
          noOfEmployees: {
            type: "integer",
            title: "No. of Employees",
          },
          salaries: {
            type: "number",
            title: "Salaries (Monthly Total)",
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
      id: "businessProfile",
      label: "Business Profile",
      schema: {
        type: "object",
        properties: {
          nativePlace: {
            type: "string",
            title: "Native Place",
          },
          businessSince: {
            type: "string",
            title: "Business since",
          },
          previousExperience: {
            type: "string",
            title: "Previous Experience",
          },
        },
      },
      required: true,
    },
    {
      id: "businessOwnership",
      label: "Business Ownership",
      schema: {
        type: "object",
        properties: {
          businessOwnership: {
            type: "string",
            title: "Business Ownership",
            enum: ["Owned", "Rented", "Leased"],
          },
          ifRentedThenMentionRentAmount: {
            type: "number",
            title: "If Rented then mention Rent Amount",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          businessPremisesAreaSqFt: {
            type: "number",
            title: "Business Premises Area (Sq. ft)",
          },
        },
      },
      required: true,
    },
    {
      id: "dailySalesMonthlySales",
      label: "Daily Sales / Monthly Sales",
      schema: {
        type: "object",
        properties: {
          dailySales: {
            type: "number",
            title: "Daily Sales",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          monthlySales: {
            type: "number",
            title: "Monthly Sales",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          currentResidenceOwnership: {
            type: "string",
            title: "Current Residence Ownership",
            enum: ["Owned", "Rented"],
          },
        },
      },
      required: true,
    },
    {
      id: "salesBillsProvided",
      label: "Sales Bills provided",
      schema: {
        type: "object",
        properties: {
          purchaseBillsProvided: {
            type: "string",
            title: "Purchase Bills provided",
          },
          neighbourCheckWithName: {
            type: "string",
            title: "Neighbour check with name",
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
          firmAccount: {
            type: "string",
            title: "Firm Account",
          },
          savingsAccount: {
            type: "string",
            title: "Savings Account",
          },
        },
      },
      required: true,
    },
    {
      id: "otherIncome",
      label: "Other income",
      schema: {
        type: "object",
        properties: {
          businessMachinery: {
            type: "string",
            title: "Business Machinery",
          },
        },
      },
      required: true,
    },
    {
      id: "observations",
      label: "Observations",
      schema: {
        type: "object",
        properties: {
          concernsDeviations: {
            type: "string",
            title: "Concerns/Deviations",
          },
        },
      },
      required: true,
    },
    {
      id: "particularsUnitsChargeTotal",
      label: "Particulars/Units/Charge/Total",
      schema: {
        type: "object",
        properties: {
          dailyGrossIncome: {
            type: "number",
            title: "Daily Gross Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          labourMaterialEveryday: {
            type: "number",
            title: "Labour & Material (Everyday)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netIncome: {
            type: "number",
            title: "Net Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          applicantSMonthlyExpensesOfTheBusiness: {
            type: "number",
            title: "Applicant's Monthly Expenses of the business",
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
      id: "sales",
      label: "Sales",
      schema: {
        type: "object",
        properties: {
          sales: {
            type: "number",
            title: "Sales",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          purchase: {
            type: "number",
            title: "Purchase",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          rent: {
            type: "number",
            title: "Rent",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          salariesWages: {
            type: "number",
            title: "Salaries/Wages",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          transportCharges: {
            type: "number",
            title: "Transport Charges",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          electricityBill: {
            type: "number",
            title: "Electricity Bill",
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
      id: "otherExp",
      label: "Other Exp",
      schema: {
        type: "object",
        properties: {
          otherExpenses: {
            type: "number",
            title: "Other Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          totalExpenses: {
            type: "number",
            title: "Total Expenses",
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
      id: "netProfit",
      label: "Net Profit",
      schema: {
        type: "object",
        properties: {
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
          netMargin: {
            type: "number",
            title: "Net Margin (%)",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default adityaBirlaSchema;
