import statement4Schema from "../financials-schema/statement4";
export const rblSchema = {
  id: 6,
  bankName: "RBL",
  sections: [
    {
      id: "caseDetails",
      label: "Case Details",
      schema: {
        type: "object",
        properties: {
          applicationNumber: {
            type: "string",
            title: "Reference Number (LOS ID)",
            readOnly: true,
          },
          applicantName: {
            type: "string",
            title: "Name of Applicant",
            readOnly: true,
          },
          coApplicant: {
            type: "string",
            title: "Co – Applicant",
          },
          // isExistingCustomer: {
          //   type: "boolean",
          //   title: "Is Existing Customer?",
          // },
          typeOfBorrower: {
            type: "string",
            title: "Type of Borrower",
            enum: [
              "Individual",
              "Partnership",
              "Company",
              "LLP",
              "Sole Proprietorship",
            ],
          },
        },
      },
    },
    //make meeting details as section and add the fields till date of visit
    {
      id: "meetingDetails",
      label: "Meeting Details",
      schema: {
        type: "object",
        properties: {
          addressVisited: {
            type: "string",
            title: "Address Visited",
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
          contactNo: {
            type: "integer",
            title: "Contact No",
          },
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
        },
      },
    },
    {
      id: "businessOwnerDetails",
      label: "Business owner Details",
      schema: {
        type: "object",
        properties: {
          businessOwnerDetails: {
            type: "array",
            title: "Business owner Details",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                age: {
                  type: "integer",
                  title: "Age",
                },
                qualification: {
                  type: "string",
                  title: "Qualification",
                  enum: [
                    "Below 10th",
                    "10th pass",
                    "Under graduate",
                    "Graduate",
                    "Post Graduate",
                  ],
                },
                occupation: {
                  type: "string",
                  title: "Occupation",
                  enum: [
                    "Business",
                    "Salaried",
                    "Farmer/Agriculturist",
                    "Retired",
                    "Part Time",
                    "Student",
                    "Homemaker",
                  ],
                },
                relation: {
                  type: "string",
                  title: "Relation",
                  enum: [
                    "Self",
                    "Spouse",
                    "Son",
                    "Daughter",
                    "Father",
                    "Mother",
                    "Brother",
                    "Sister",
                    "Other",
                  ],
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                },
              },
            },
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
          aboutApplicant: {
            type: "string",
            title: "About Applicant",
          },
          aboutCoApplicant: {
            type: "string",
            title: "About Co-applicant:",
          },
          andTheirFamilyDetails: {
            type: "string",
            title: "And their family details:",
          },
        },
      },
      required: false,
    },
    {
      id: "businessDetails",
      label: "Business Details",
      schema: {
        type: "object",
        properties: {
          businessName: {
            type: "string",
            title: "Business Name",
            readOnly: true,
          },
          typeOfEntity: {
            type: "string",
            title: "Type of Entity",
            enum: [
              "Proprietorship",
              "Partnership",
              "Private Limited",
              "Public Limited",
              "LLP",
              "HUF",
            ],
          },
          hasGstNumber: {
            type: "boolean",
            title: "Has GST Number?",
          },
          gstNumber: {
            type: "string",
            title: "GST Number",
            dependencies: {
              show: {
                hasGstNumber: true,
              },
              required: {
                hasGstNumber: true,
              },
            },
          },
          legalName: {
            type: "string",
            title: "Legal Name",
          },
          tradeName: {
            type: "string",
            title: "Trade Name",
          },
          lastGSTReturn: {
            type: "string",
            title: "Last GST Return (As per GST records)",
          },
          establishment: {
            type: "string",
            title: "Establishment",
          },
          shopAddress: {
            type: "string",
            title: "Shop Address",
            readOnly: true,
          },
          shopOwnership: {
            type: "string",
            title: "Shop Ownership",
            enum: ["Owned", "Rented", "Leased"],
          },
          godownAddress: {
            type: "string",
            title: "Godown Address",
          },
          godownOwnership: {
            type: "string",
            title: "Godown Ownership",
            enum: ["Owned", "Rented", "Leased", "Not Applicable"],
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
              "Export/Import",
              "Agriculture",
              "Construction",
              "Other",
            ],
          },
          productDetails: {
            type: "string",
            title:
              "Product Details (please also comment on Vintage of the product deals by the firm & Future changes if any)",
          },
          businessProcess: {
            type: "string",
            title: "Business Process",
            ui: {
              widget: "textarea",
              rows: 6,
            },
          },
          margins: {
            type: "string",
            title: "Margins",
          },
          documentsObserved: {
            type: "string",
            title: "Documents Observed",
            enum: [
              "Business License",
              "GST Registration Certificate",
              "PAN Card",
              "Bank Account Details",
              "Other",
            ],
            multiple: true,
          },
          activityObserved: {
            type: "string",
            title: "Activity Observed",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
        },
        required: ["legalName", "tradeName"],
      },
      required: true,
    },
    {
      id: "inputsPurchases",
      label: "Inputs/Purchases",
      schema: {
        type: "object",
        properties: {
          detailsOfInputs: {
            type: "string",
            title: "Details of Inputs",
          },
          purchaseDetails: {
            type: "string",
            title: "Purchase Details",
          },
          orderCycle: {
            type: "string",
            title: "Order Cycle",
          },
          avgOrderQnty: {
            type: "string",
            title: "Avg Order Qnty",
          },
          creditTerms: {
            type: "string",
            title: "Credit Terms",
          },
          otherRemarks: {
            type: "string",
            title: "Other Remarks",
          },
        },
      },
      required: false,
    },
    {
      id: "outputsSupply",
      label: "Outputs/Supply",
      schema: {
        type: "object",
        properties: {
          marketForOutput: {
            type: "string",
            title: "Market for Output",
          },
          modeOfMarketing: {
            type: "string",
            title: "Mode of Marketing",
          },
          typeOfCustomers: {
            type: "string",
            title: "Type of Customers",
          },
          creditTerms: {
            type: "string",
            title: "Credit Terms",
          },
          stockOfFinishedGoods: {
            type: "string",
            title: "Stock of Finished Goods",
          },
        },
      },
      required: false,
    },
    {
      id: "employeeDetails",
      label: "Employee Details",
      schema: {
        type: "object",
        properties: {
          noOfEmployees: {
            type: "integer",
            title: "No. of Employees",
          },
          salaryDetails: {
            type: "string",
            title: "Salary Details",
          },
          pfEsiApplied: {
            type: "boolean",
            title: "PF/ESI Applied?",
            description: "Check if PF/ESI is applicable to employees",
          },
        },
        required: ["noOfEmployees"],
      },
      required: false,
    },
    {
      id: "tradeReferences",
      label: "Trade References",
      schema: {
        type: "object",
        properties: {
          suppliers: {
            type: "array",
            title: "Trade References - Suppliers",
            items: {
              type: "object",
              properties: {
                nameOfSuppliers: {
                  type: "string",
                  title: "Name of Suppliers",
                },
                contactDetails: {
                  type: "string",
                  title: "Contact Details",
                },
              },
            },
          },
          customers: {
            type: "array",
            title: "Trade References - Customers",
            items: {
              type: "object",
              properties: {
                nameOfCustomer: {
                  type: "string",
                  title: "Name of Customer",
                },
                contactDetails: {
                  type: "string",
                  title: "Contact Details",
                },
              },
            },
          },
        },
      },
      required: false,
    },
    {
      id: "otherSourcesOfIncome",
      label: "Other sources of Income",
      schema: {
        type: "object",
        properties: {
          otherSourcesOfIncome: {
            type: "array",
            title: "Other sources of Income",
            items: {
              type: "object",
              properties: {
                sourceOfIncome: {
                  type: "string",
                  title: "Source of Income",
                },
                details: {
                  type: "string",
                  title: "Details",
                },
              },
              required: ["sourceOfIncome"],
            },
          },
        },
        required: ["otherSourcesOfIncome"],
      },
      required: false,
    },
    {
      id: "loansDetails",
      label: "Loans Details",
      schema: {
        type: "object",
        properties: {
          loansDetails: {
            type: "array",
            title: "Loans Details",
            items: {
              type: "object",
              properties: {
                nameOfBankInstitution: {
                  type: "string",
                  title: "Name of Bank / Institution",
                },
                product: {
                  type: "string",
                  title: "Product",
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
                os: {
                  type: "string",
                  title: "O/S",
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "applicantsMainBankingDetails",
      label: "Applicant's main Banking Details",
      schema: {
        type: "object",
        properties: {
          bankName: {
            type: "string",
            title: "Bank Name",
          },
          accountHolderName: {
            type: "string",
            title: "Account Holder name",
          },
          accountType: {
            type: "string",
            title: "Account type",
            enum: ["Savings", "Current", "CC", "OD", "Term Deposit"],
          },
          noOfYear: {
            type: "integer",
            title: "No of year",
          },
          limitOfCCOD: {
            type: "number",
            title: "Limit of CC/OD",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          remarks: {
            type: "string",
            title: "Remarks",
          },
          endUse: {
            type: "string",
            title: "End Use",
          },
          ownContribution: {
            type: "string",
            title: "Own contribution",
          },
          particulars: {
            type: "string",
            title: "Particulars",
          },
          remarksAdditional: {
            type: "string",
            title: "Remarks",
          },
        },
      },
      required: true,
    },
    {
      id: "ownContributions",
      label: "Own Contributions",
      schema: {
        type: "object",
        properties: {
          Particulars: {
            type: "string",
            title: "Particulars (source of own contribution)",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
          Remarks: {
            type: "string",
            title: "Remarks",
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
      id: "netWorth",
      label: "Net Worth",
      schema: {
        type: "object",
        properties: {
          netWorth: {
            type: "array",
            title: "Net Worth",
            items: {
              type: "object",
              properties: {
                typeOfProperty: {
                  type: "string",
                  title:
                    "Type of property / Other investments like gold , LIC , FC etc.,",
                },
                ownerName: {
                  type: "string",
                  title: "Owner name",
                },
                approxMarketValue: {
                  type: "number",
                  title: "Approx. Market value",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                yearsOfOwnership: {
                  type: "number",
                  title: "Years of ownership",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    statement4Schema,
  ],
} as const;
export default rblSchema;
