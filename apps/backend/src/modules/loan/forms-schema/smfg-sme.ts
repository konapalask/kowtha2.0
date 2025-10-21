export const smfgSmeSchema = {
  id: 25,
  bankName: "SMFG SME",
  sections: [
    {
      id: "basicDetails",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          branchCode: {
            type: "string",
            title: "Branch Code",
          },
          applicationReferenceNo: {
            type: "string",
            title: "Application Reference No.",
            readOnly: true,
          },
          applicantName: {
            type: "string",
            title: "Applicant Name",
            readOnly: true,
          },
          applicantOfficeAddress: {
            type: "string",
            title: "Applicant Office Address",
            readOnly: true,
          },
          personMetName: {
            type: "string",
            title: "Person Met - Name",
          },
          personMetDesignation: {
            type: "string",
            title: "Person Met - Designation",
          },
          personMetMobileNo: {
            type: "string",
            title: "Person Met - Mobile No",
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
      },
      required: true,
    },
    {
      id: "personalInformation",
      label: "Personal Information",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            title:
              "Details of Family Members (Name, Age, Occupation - Tick on Dependents)",
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
                occupation: {
                  type: "string",
                  title: "Occupation",
                },
                isDependent: {
                  type: "string",
                  title: "Is Dependent",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
          residenceAddress: {
            type: "string",
            title: "Residence Address",
          },
          ownershipStatus: {
            type: "string",
            title: "Whether Self Owned / Parental / Rented",
            enum: ["Self Owned", "Parental", "Rented"],
          },
          areaOfHouseProperty: {
            type: "string",
            title: "Area of the House Property",
          },
          estimatedMarketValue: {
            type: "number",
            title: "Estimated Market Value",
          },
        },
      },
      required: true,
    },
    {
      id: "residenceAndPropertyDetails",
      label: "Residence and Property Details",
      schema: {
        type: "object",
        properties: {
          noOfYearsInSameCity: {
            type: "integer",
            title: "No. of Years in Same City",
          },
          permanentAddress: {
            type: "string",
            title: "Permanent Address",
          },
          detailsOfOtherOwnedProperty: {
            type: "string",
            title: "Details of Other Owned Property in the City",
          },
          anyOtherSourceOfIncome: {
            type: "number",
            title: "Any Other Source of Income Apart from This Business",
          },
        },
      },
      required: true,
    },
    {
      id: "businessInformation",
      label: "Business Information",
      schema: {
        type: "object",
        properties: {
          nameOfBusiness: {
            type: "string",
            title: "Name of Business",
            readOnly: true,
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business",
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
          partnersDirectorsDetails: {
            type: "array",
            title: "Name of Partners/Directors and Share %",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                sharePercentage: {
                  type: "number",
                  title: "Share %",
                },
              },
            },
          },
          typeOfCustomer: {
            type: "string",
            title: "Type of Customer",
          },
          stabilityInSameBusinessYears: {
            type: "integer",
            title: "Stability in Same Business - No. of Years",
          },
          stabilityVerifiedBy: {
            type: "string",
            title:
              "Stability Verified By (Registration Certificate / Distribution / Dealership Letter)",
          },
          familyStructureInvolvedInBusiness: {
            type: "string",
            title: "Family Structure Involved in Business",
          },
          businessPremisesOwnership: {
            type: "string",
            title: "Business Premises Whether Owned or Rented",
            enum: ["Owned", "Rented"],
          },
        },
      },
      required: true,
    },
    {
      id: "salesAndFinancials",
      label: "Sales and Financials",
      schema: {
        type: "object",
        properties: {
          actualMonthlySales: {
            type: "number",
            title: "Actual Monthly Sales/Receipts as Per Customer",
          },
          percentSalesOnCredit: {
            type: "number",
            title: "What % Sales is Done on Credit",
          },
          majorCustomers: {
            type: "string",
            title: "Major Customers",
          },
          majorSuppliers: {
            type: "string",
            title: "Major Suppliers",
          },
        },
      },
      required: true,
    },
    {
      id: "customersAndSuppliers",
      label: "Customers and Suppliers",
      schema: {
        type: "object",
        properties: {
          customers: {
            type: "array",
            title: "Regular Customers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNo: {
                  type: "string",
                  title: "Contact No",
                },
                feedback: {
                  type: "string",
                  title: "Feedback",
                },
              },
            },
          },
          suppliers: {
            type: "array",
            title: "Regular Suppliers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNo: {
                  type: "string",
                  title: "Contact No",
                },
                feedback: {
                  type: "string",
                  title: "Feedback",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "assets",
      label: "Assets",
      schema: {
        type: "object",
        properties: {
          assets: {
            type: "array",
            title: "Assets Owned",
            items: {
              type: "object",
              properties: {
                assetType: {
                  type: "string",
                  title: "Asset Type",
                },
                description: {
                  type: "string",
                  title: "Description",
                },
                marketValue: {
                  type: "string",
                  title: "Market Value",
                },
                ownerName: {
                  type: "string",
                  title: "Owner Name",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "existingLoans",
      label: "Existing Loans",
      schema: {
        type: "object",
        properties: {
          existingLoans: {
            type: "array",
            title: "Existing Loans",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                typeOfLoan: {
                  type: "string",
                  title: "Type of Loan",
                },
                loanAmount: {
                  type: "string",
                  title: "Loan Amount",
                },
                emi: {
                  type: "string",
                  title: "EMI",
                },
                status: {
                  type: "string",
                  title: "Status",
                  enum: ["Open", "Closed"],
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
                  title: "Account Type",
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
      id: "observation",
      label: "Observation",
      schema: {
        type: "object",
        properties: {
          observation: {
            type: "string",
            title: "Final Observation and Comments",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default smfgSmeSchema;
