export const cholaSchema = {
  id: 11,
  bankName: "Chola",
  sections: [
    {
      id: "general",
      label: "General",
      schema: {
        type: "object",
        properties: {
          nameOfTheApplicant: {
            type: "string",
            title: "Name of the Applicant",
            readOnly: true,
          },
          nameOfTheCoApplicant: {
            type: "string",
            title: "Name of the Co-Applicant",
          },
          businessName: {
            type: "string",
            title: "Business Name",
            readOnly: true,
          },
          constitution: {
            type: "string",
            title: "Constitution",
            enum: [
              "Proprietorship",
              "Private Limited",
              "Limited Liability Partnership",
              "Simple Partnership",
            ],
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
          },
          loanRequested: {
            type: "number",
            title: "Loan Requested",
            readOnly: true,
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          purposeOfLoan: {
            type: "string",
            title: "Purpose of Loan",
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
      id: "pdDetails",
      label: "PD Details",
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
            title: "Person Met",
          },
        },
      },
      required: true,
    },
    {
      id: "aboutApplicantAndBusiness",
      label: "About the Applicant and Business",
      schema: {
        type: "object",
        properties: {
          aboutApplicant: {
            type: "string",
            title: "About the Applicant",
          },
          businessStartedYear: {
            type: "integer",
            title: "Business Started Year",
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business",
          },
          yearsOfExperience: {
            type: "integer",
            title: "Years of Experience in Same Field",
          },
          businessPremisesOwnership: {
            type: "string",
            title: "Business Premises Ownership",
            enum: ["Owned", "Rented"],
          },
          rentAmountIfRented: {
            type: "number",
            title: "Rent Amount (if Rented)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          numberOfEmployees: {
            type: "integer",
            title: "Number of Employees",
          },
          salaryDetails: {
            type: "string",
            title: "Salary Details",
          },
          businessObservations: {
            type: "string",
            title: "Business Observations (Footfall, Stock, Equipment)",
          },
          businessActivityLevel: {
            type: "string",
            title: "Business Activity Level Observed",
          },
        },
      },
      required: true,
    },
    {
      id: "familyDetails",
      label: "Applicant's Family Details",
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
                relationship: {
                  type: "string",
                  title: "Relationship",
                },
                age: {
                  type: "integer",
                  title: "Age",
                },
                education: {
                  type: "string",
                  title: "Education",
                },
                qualification: {
                  type: "string",
                  title: "Qualification",
                },
                occupation: {
                  type: "string",
                  title: "Occupation",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "customers",
      label: "Customers (Name, Phone, Business Name)",
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
                phone: {
                  type: "string",
                  title: "Phone",
                },
                businessName: {
                  type: "string",
                  title: "Business Name",
                },
              },
            },
          },
          customerFeedback: {
            type: "string",
            title: "Customer Feedback",
          },
        },
      },
      required: true,
    },
    {
      id: "suppliers",
      label: "Suppliers",
      schema: {
        type: "object",
        properties: {
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
                phone: {
                  type: "string",
                  title: "Phone",
                },
                businessName: {
                  type: "string",
                  title: "Business Name",
                },
              },
            },
          },
          supplierFeedback: {
            type: "string",
            title: "Supplier Feedback",
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
          assetsOwnedByApplicant: {
            type: "string",
            title: "Assets Owned by Applicant",
          },
          assetsOwnedByCoApplicant: {
            type: "string",
            title: "Assets Owned by Co-Applicant",
          },
          assetsOwnedByGuarantor: {
            type: "string",
            title: "Assets Owned by Guarantor",
          },
          assetDetails: {
            type: "array",
            title: "Detailed Asset List",
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
      label: "Existing Loan Details",
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
                  title: "EMI / Interest",
                },
                tenureTotalCompleted: {
                  type: "string",
                  title: "Total Tenure / Completed (in months)",
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
                accountNo: {
                  type: "string",
                  title: "Account No",
                },
                accountType: {
                  type: "string",
                  title: "Account Type",
                  enum: ["Savings", "Current", "CC/OD"],
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "itrAndVerification",
      label: "ITR, Receipts, Verification, GP Margin & Expenses Details",
      schema: {
        type: "object",
        properties: {
          itrDetails: {
            type: "string",
            title: "ITR Details",
          },
          receiptsVerified: {
            type: "string",
            title: "Receipts Verified",
          },
          gpMargin: {
            type: "string",
            title: "GP Margin",
          },
          expensesDetails: {
            type: "string",
            title: "Expenses Details",
          },
        },
      },
      required: true,
    },
    {
      id: "financials",
      label: "Financials",
      schema: {
        type: "object",
        properties: {
          totalGrossDisposableIncome: {
            type: "number",
            title: "Total Gross Disposable Income per Month",
          },
          totalObligations: {
            type: "number",
            title: "Total Obligations per Month",
          },
          netDisposableIncome: {
            type: "number",
            title: "Net Disposable Income per Month",
          },
          netProfitMargin: {
            type: "number",
            title: "Net Profit & Margin",
          },
        },
      },
      required: true,
    },
    {
      id: "otherIncomes",
      label: "Other Incomes",
      schema: {
        type: "object",
        properties: {
          otherIncomesIfAny: {
            type: "string",
            title: "Other Incomes (if any)",
          },
        },
      },
      required: true,
    },
    {
      id: "comfortAndDiscomfortFactors",
      label: "Comfort & Discomfort Factors",
      schema: {
        type: "object",
        properties: {
          comfortFactor: {
            type: "string",
            title: "Comfort Factor",
          },
          discomfortFactor: {
            type: "string",
            title: "Discomfort Factor",
          },
        },
      },
      required: true,
    },
    {
      id: "recommendations",
      label: "Recommendations",
      schema: {
        type: "object",
        properties: {
          recommendations: {
            type: "string",
            title: "Recommendations",
          },
          disclaimer: {
            type: "string",
            title: "Disclaimer (if any)",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default cholaSchema;
