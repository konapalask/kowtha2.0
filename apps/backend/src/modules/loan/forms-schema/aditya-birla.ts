export const adityaBirlaSchema = {
  "id": 7,
  "bankName": "Aditya Birla",
  "sections": [
    {
      "id": "applicantDetails",
      "label": "Applicant Details",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfApplicant": {
            "type": "string",
            "title": "Name of Applicant"
          },
          "nameOfCoApplicant": {
            "type": "string",
            "title": "Name of Co-applicant"
          },
          "aboutTheBusiness": {
            "type": "string",
            "title": "About the Business"
          },
          "nameOfBusiness": {
            "type": "string",
            "title": "Name of Business"
          }
        }
      },
      "required": true
    },
    {
      "id": "noOfYearsInTheCurrentAddress",
      "label": "No. of years in the current address",
      "schema": {
        "type": "object",
        "properties": {
          "constitutionOfBusiness": {
            "type": "string",
            "title": "Constitution of Business"
          }
        }
      },
      "required": true
    },
    {
      "id": "nameOfOtherPartnersIfItIsAPartnershipConcern",
      "label": "Name of other Partners (if it is a partnership concern)",
      "schema": {
        "type": "object",
        "properties": {
          "management": {
            "type": "integer",
            "title": "Management"
          },
          "contactNumber": {
            "type": "string",
            "title": "Contact Number",
            "pattern": "^[0-9]{10}$"
          },
          "tin": {
            "type": "string",
            "title": "TIN"
          },
          "pan": {
            "type": "string",
            "title": "PAN"
          },
          "certificateOfIncorporation": {
            "type": "string",
            "title": "Certificate of Incorporation"
          }
        }
      },
      "required": true
    },
    {
      "id": "documentsVerified",
      "label": "Documents verified",
      "schema": {
        "type": "object",
        "properties": {
          "natureOfBusiness": {
            "type": "string",
            "title": "Nature of Business"
          },
          "mainProduct": {
            "type": "string",
            "title": "Main product"
          },
          "mainRawMaterial": {
            "type": "string",
            "title": "Main Raw material"
          }
        }
      },
      "required": true
    },
    {
      "id": "vendorsSuppliersToApplicant",
      "label": "Vendors / suppliers to applicant",
      "schema": {
        "type": "object",
        "properties": {
          "businessTransaction": {
            "type": "string",
            "title": "Business transaction"
          },
          "stockObserved": {
            "type": "string",
            "title": "Stock observed"
          },
          "ifNoStocksObservedReasonForTheSame": {
            "type": "integer",
            "title": "If no stocks observed, reason for the same"
          },
          "businessActivityObserved": {
            "type": "string",
            "title": "Business activity observed"
          }
        }
      },
      "required": true
    },
    {
      "id": "salesPaymentTerms",
      "label": "Sales payment terms",
      "schema": {
        "type": "object",
        "properties": {
          "gstRegistration": {
            "type": "string",
            "title": "GST Registration"
          },
          "itrsFiling": {
            "type": "string",
            "title": "ITRs filing"
          }
        }
      },
      "required": true
    },
    {
      "id": "noOfEmployees",
      "label": "No. of Employees",
      "schema": {
        "type": "object",
        "properties": {
          "salaries": {
            "type": "string",
            "title": "Salaries"
          }
        }
      },
      "required": true
    },
    {
      "id": "businessProfile",
      "label": "Business Profile",
      "schema": {
        "type": "object",
        "properties": {
          "nativePlace": {
            "type": "string",
            "title": "Native Place"
          },
          "businessSince": {
            "type": "string",
            "title": "Business since"
          },
          "previousExperience": {
            "type": "string",
            "title": "Previous Experience"
          }
        }
      },
      "required": true
    },
    {
      "id": "businessOwnership",
      "label": "Business Ownership",
      "schema": {
        "type": "object",
        "properties": {
          "ifRentedThenMentionRentAmount": {
            "type": "number",
            "title": "If Rented then mention Rent Amount"
          },
          "businessPremisesAreaSqFt": {
            "type": "number",
            "title": "Business Premises Area (Sq. ft)"
          }
        }
      },
      "required": true
    },
    {
      "id": "dailySalesMonthlySales",
      "label": "Daily Sales / Monthly Sales",
      "schema": {
        "type": "object",
        "properties": {
          "currentResidence": {
            "type": "number",
            "title": "Current Residence"
          }
        }
      },
      "required": true
    },
    {
      "id": "salesBillsProvided",
      "label": "Sales Bills provided",
      "schema": {
        "type": "object",
        "properties": {
          "purchaseBillsProvided": {
            "type": "string",
            "title": "Purchase Bills provided"
          },
          "neighbourCheckWithName": {
            "type": "string",
            "title": "Neighbour check with name"
          }
        }
      },
      "required": true
    },
    {
      "id": "bankingDetails",
      "label": "Banking Details",
      "schema": {
        "type": "object",
        "properties": {
          "firmAccount": {
            "type": "string",
            "title": "Firm Account"
          },
          "savingsAccount": {
            "type": "string",
            "title": "Savings Account"
          }
        }
      },
      "required": true
    },
    {
      "id": "otherIncome",
      "label": "Other income",
      "schema": {
        "type": "object",
        "properties": {
          "businessMachinery": {
            "type": "string",
            "title": "Business Machinery"
          }
        }
      },
      "required": true
    },
    {
      "id": "observations",
      "label": "Observations",
      "schema": {
        "type": "object",
        "properties": {
          "concernsDeviations": {
            "type": "string",
            "title": "Concerns/Deviations"
          }
        }
      },
      "required": true
    },
    {
      "id": "particularsUnitsChargeTotal",
      "label": "Particulars/Units/Charge/Total",
      "schema": {
        "type": "object",
        "properties": {
          "dailyGrossIncome": {
            "type": "number",
            "title": "Daily Gross Income"
          },
          "labourMaterialEveryday": {
            "type": "string",
            "title": "Labour & Material (Everyday)"
          },
          "netIncome": {
            "type": "number",
            "title": "Net Income"
          },
          "applicantSMonthlyExpensesOfTheBusiness": {
            "type": "string",
            "title": "Applicant’s Monthly Expenses of the business"
          }
        }
      },
      "required": true
    },
    {
      "id": "sales",
      "label": "Sales",
      "schema": {
        "type": "object",
        "properties": {
          "purchase": {
            "type": "string",
            "title": "Purchase"
          },
          "rent": {
            "type": "number",
            "title": "Rent"
          },
          "salariesWages": {
            "type": "integer",
            "title": "Salaries/Wages"
          },
          "transportCharges": {
            "type": "string",
            "title": "Transport Charges"
          },
          "electricityBill": {
            "type": "string",
            "title": "Electricity Bill"
          }
        }
      },
      "required": true
    },
    {
      "id": "otherExp",
      "label": "Other Exp",
      "schema": {
        "type": "object",
        "properties": {
          "totalExpenses": {
            "type": "string",
            "title": "Total Expenses"
          }
        }
      },
      "required": true
    },
    {
      "id": "netProfit",
      "label": "Net Profit",
      "schema": {
        "type": "object",
        "properties": {
          "netMargin": {
            "type": "number",
            "title": "Net Margin"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default adityaBirlaSchema;
