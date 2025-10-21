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
          applicationNo: {
            type: "string",
            title: "Application No",
            readOnly: true,
          },
          applicationId: {
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
            enum: ["HL", "LAP", "Asha HL"],
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
          customerName: {
            type: "string",
            title: "Customer Name",
            readOnly: true,
          },
          pdAddress: {
            type: "string",
            title: "PD Address (Residence/Office/Factory/Godown)",
            enum: ["residence", "Office", "Factory", "Godown"],
          },
          contactNumber: {
            type: "string",
            title: " Contact Number (Mobile / Landline)",
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
        required: ["applicationId", "customerName"],
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
            title: "Family Background",
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
                qualification: {
                  type: "string",
                  title: "qualification",
                },
                occupation: {
                  type: "string",
                  title: "occupation",
                },
                incomePerMonth: {
                  type: "number",
                  title: "income per month",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                dependent: {
                  type: "string",
                  title: "dependent",
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
          nameOfFirm: {
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
          productServicesOffered: {
            type: "string",
            title: "Product / Services Offered",
          },
          businessModelBackground: {
            type: "string",
            title: "Business Model & Background of Business",
          },
        },
      },
      required: true,
    },
    {
      id: "businessDetails",
      label: "Business Details",
      schema: {
        type: "object",
        properties: {
          aboutTheBusiness: {
            type: "string",
            title: "About the business",
          },
          yearBusinessStarted: {
            type: "integer",
            title: "Year Business Started",
          },
          typeOfBusiness: {
            type: "string",
            title: "Type of Business (e.g., Proprietorship/Partnership)",
            enum: [
              "Proprietorship",
              "Private Limited",
              "Limited Liability Partnership",
              "Simple Partnership",
            ],
          },
          businessName: {
            type: "string",
            title: "Business Name",
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business",
          },
          stockSource: {
            type: "string",
            title: "Stock Source (Suppliers/Farmers)",
          },
          stockHandling: {
            type: "string",
            title: "Stock Handling (Premises / Direct Delivery)",
          },
          salesVolume: {
            type: "string",
            title: "Sales Volume",
          },
          profitPerUnit: {
            type: "string",
            title: "Profit per Unit",
          },
          businessPremisesOwnership: {
            type: "string",
            title: "Business Premises Ownership",
          },
          numberOfWorkers: {
            type: "integer",
            title: "Number of Workers",
          },
          wageExpenses: {
            type: "number",
            title: "Wage Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          majorTransactionMode: {
            type: "string",
            title: "Major Transaction Mode (Cash/Bank)",
          },
          regularCustomers: {
            type: "array",
            title: "Regular Customers",
            items: {
              type: "object",
              properties: {
                nameOfRegularCustomers: {
                  type: "string",
                  title: "Name of Regular Customers",
                },
                contactNumberOfRegularCustomers: {
                  type: "string",
                  title: "Contact Number of Regular Customers",
                },
              },
            },
          },
          regularSuppliers: {
            type: "array",
            title: "Regular Suppliers",
            items: {
              type: "object",
              properties: {
                nameOfRegularSuppliers: {
                  type: "string",
                  title: "Name of Regular Suppliers",
                },
                contactNumberOfRegularSuppliers: {
                  type: "string",
                  title: "Contact Number of Regular Suppliers",
                },
              },
            },
          },
          businessActivityObserved: {
            type: "string",
            title: "Business Activity observed",
          },
          stockLevelObserved: {
            type: "string",
            title: "Stock Level observed",
          },
          documentsObserved: {
            type: "string",
            title: "Documents Observed",
          },
          gstRegistration: {
            type: "boolean",
            title:
              "Whether Business was Registered under GST - Yes/No If Yes then mention GST Number",
          },
          gstNumber: {
            type: "string",
            title: "GST Number",
            dependencies: {
              show: {
                gstRegistration: true,
              },
              required: {
                gstRegistration: true,
              },
            },
          },
          itrFiled: {
            type: "string",
            title: "ITRs Filed - Yes/No If Yes then mention the income",
            enum: ["Yes", "No"],
          },
          income: {
            type: "string",
            title: "Income",
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
            enum: ["Yes", "no"],
          },
          noOfEmployeesSeen: {
            type: "integer",
            title: "No. of employees seen",
          },
          businessActivitySeen: {
            type: "string",
            title: "Business activity seen",
            enum: ["Yes", "no"],
          },
          stockSeen: {
            type: "string",
            title: "Stock seen",
            enum: ["Yes", "no"],
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
                  type: "string",
                  title: "Contact Details",
                },
                location: {
                  type: "string",
                  title: "Location",
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
                  type: "string",
                  title: "Contact Details",
                },
                location: {
                  type: "string",
                  title: "Location",
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
          monthlyGrossReceipts: {
            type: "number",
            title: "Monthly Gross Receipts",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          monthlyExpenses: {
            type: "number",
            title: "Monthly Expenses",
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
          netMargin: {
            type: "number",
            title: "Net Margin",
          },
          majorExpenses: {
            type: "number",
            title: "Major Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          monthlyHouseholdExpenses: {
            type: "number",
            title: "Monthly Household Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          employees: {
            type: "string",
            title: "Employees",
          },
          numberOfEmployees: {
            type: "integer",
            title: "Number of Employees",
          },
          otherIncomes: {
            type: "string",
            title: "Other Incomes",
          },
          concerns: {
            type: "string",
            title: "Concerns",
          },
          otherObservation: {
            type: "string",
            title: "Other Observation",
          },
          neighborCheckThirdParty: {
            type: "string",
            title:
              "Details of neighbor check / Third party check done and status",
          },
        },
        endUseOfProposedLoan: {
          type: "string",
          title: "End use of proposed Loan (detailed)",
        },
        bankingPerformance: {
          type: "string",
          title: "Banking performance",
        },
        anyChequeBounces: {
          type: "string",
          title: "Any cheque bounces (Y/N)",
          enum: ["Yes", "no"],
        },
        detailsOfCollateral: {
          type: "string",
          title: "Details of collateral (Address of property)",
        },
      },
      required: true,
    },
  ],
} as const;
export default axisBankSchema;
