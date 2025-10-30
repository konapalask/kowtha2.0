import financialsSchema from "../financials-schema/generic";
export const indiaShelterSenpSchema = {
  id: 21,
  bankName: "India Shelter SENP",
  sections: [
    financialsSchema,
    {
      id: "generalInfo",
      label: "General Information",
      schema: {
        type: "object",
        properties: {
          loanNumber: {
            type: "string",
            title: "Loan Number",
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
      id: "basicDetails",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          personMet: {
            type: "string",
            title: "Name of the Person Met",
          },
          loanProduct: {
            type: "string",
            title: "Loan Product",
            enum: ["HL", "LAP", "HL/LAP"],
          },
          applicantName: {
            type: "string",
            title: "Name of the Applicant",
          },
          maritalStatus: {
            type: "string",
            title: "Marital Status",
            enum: ["Single", "Married", "Divorced", "Other"],
          },
          educationalQualification: {
            type: "string",
            title:
              "Educational Qualification (Below 10 / 10th Pass / 12th Pass / Diploma / ITI Certification / Graduate / PG / Professional Certification)",
              enum: [
                "Below 10",
                "10th Pass",
                "12th Pass",
                "Diploma",
                "ITI Certification",
                "Graduate",
                "PG",
                "Professional Certification",
              ],
          },
          category: {
            type: "string",
            title: "Category",
            enum: ["General", "SC", "ST", "OBC", "Others"],
          },
          totalFamilyMembers: {
            type: "integer",
            title: "Total No. of Family Members",
            minimum: 0,
          },
          dependentsChildren: {
            type: "integer",
            title: "Dependents - Children",
            minimum: 0,
          },
          dependentsAdults: {
            type: "integer",
            title: "Dependents - Adults",
            minimum: 0,
          },
          dependentsOthers: {
            type: "integer",
            title: "Dependents - Others",
            minimum: 0,
          },
        },
      },
      required: true,
    },
    {
      id: "residenceDetails",
      label: "Residence Details",
      schema: {
        type: "object",
        properties: {
          residenceAddress: {
            type: "string",
            title: "Residence Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          yearsAtCurrentResidence: {
            type: "number",
            title: "No. of Years at Current Residence",
            minimum: 0,
          },
          areaSqft: {
            type: "string",
            title: "Area (in Sq ft)",
          },
          monthlyRentDeposit: {
            type: "number",
            title: "Monthly Rent & Security Deposit (if rented)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          purchasePriceMv: {
            type: "number",
            title: "Purchase price & MV (if owned)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          yearsInCurrentCity: {
            type: "string",
            title: "Number of Years in Current City",
            enum: ["<=3 Years", ">3 Years"],
          },
          parentsStayingWith: {
            type: "string",
            title: "Parents Staying with?",
            enum: ["Self", "Separate", "Expired"],
          },
          nativePlace: {
            type: "string",
            title: "Native Place",
          },
          electricityBillInCustomerName: {
            type: "string",
            title: "If LAP—Electricity bill in customer name availability?",
            enum: ["Yes", "No"],
          },
        },
      },
      required: true,
    },
    {
      id: "assetChecklist",
      label: "Assets and Investment Details",
      schema: {
        type: "object",
        properties: {
          assetsOwned: {
            type: "string",
            title: "Assets Owned (Summary)",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          smartphone: {
            type: "string",
            title: "Smartphone",
            enum: ["Yes", "No"],
          },
          washingMachine: {
            type: "string",
            title: "Washing Machine",
            enum: ["Yes", "No"],
          },
          car: {
            type: "string",
            title: "Car",
            enum: ["Yes", "No"],
          },
          twoWheeler: {
            type: "string",
            title: "Two Wheeler",
            enum: ["Yes", "No"],
          },
          computerLaptop: {
            type: "string",
            title: "Computer / Laptop",
            enum: ["Yes", "No"],
          },
          ac: {
            type: "string",
            title: "AC",
            enum: ["Yes", "No"],
          },
          fridge: {
            type: "string",
            title: "Fridge",
            enum: ["Yes", "No"],
          },
          induction: {
            type: "string",
            title: "Induction",
            enum: ["Yes", "No"],
          },
        },
      },
    },
    {
      id: "financialAssets",
      label: "Financial Assets",
      schema: {
        type: "object",
        properties: {
          fixedDeposits: {
            type: "string",
            title: "Fixed Deposits (amount/maturity)",
          },
          mutualFunds: {
            type: "string",
            title: "Mutual Funds (type/value)",
          },
          sharesStocks: {
            type: "string",
            title: "Shares / Stocks (companies/value)",
          },
          insurance: {
            type: "string",
            title: "Insurance (type/sum assured)",
          },
          otherInvestments: {
            type: "string",
            title: "Other investments?",
          },
          postOfficeSavings: {
            type: "string",
            title: "Is Post Office savings monthly?",
            enum: ["Yes", "No"],
          },
          recurringDeposit: {
            type: "string",
            title: "Any Recurring Deposit?",
            enum: ["Yes", "No"],
          },
        },
      },
    },
    {
      id: "landAssets",
      label: "Land Details",
      schema: {
        type: "object",
        properties: {
          plots: {
            type: "array",
            title: "Land Holdings",
            items: {
              type: "object",
              properties: {
                totalArea: {
                  type: "string",
                  title: "Total area of plot",
                },
                location: {
                  type: "string",
                  title: "Location",
                },
                landType: {
                  type: "string",
                  title:
                    "Type (Agricultural / Commercial / Residential / Industrial)",
                },
                marketValue: {
                  type: "number",
                  title: "Current market value",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "houseAssets",
      label: "House Details",
      schema: {
        type: "object",
        properties: {
          houses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                builtUpArea: {
                  type: "string",
                  title: "Built-up area (in Sq ft)",
                },
                location: {
                  type: "string",
                  title: "Location",
                },
                occupancyStatus: {
                  type: "string",
                  title: "Self-occupied or rented",
                },
                monthlyIncomeIfRented: {
                  type: "number",
                  title: "Monthly income (if rented)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                marketValue: {
                  type: "number",
                  title: "Current market value",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "shopAssets",
      label: "Shop / Commercial Space",
      schema: {
        type: "object",
        properties: {
          shops: {
            type: "array",
            items: {
              type: "object",
              properties: {
                area: {
                  type: "string",
                  title: "Area of shop/space (in Sq ft)",
                },
                location: {
                  type: "string",
                  title: "Location",
                },
                occupancyStatus: {
                  type: "string",
                  title: "Self-occupied or rented",
                },
                monthlyIncomeIfRented: {
                  type: "number",
                  title: "Monthly income (if rented)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                marketValue: {
                  type: "number",
                  title: "Current market value",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "vehicleAssets",
      label: "Vehicle Details",
      schema: {
        type: "object",
        properties: {
          vehicles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                makeModel: {
                  type: "string",
                  title: "Make and model",
                },
                purpose: {
                  type: "string",
                  title: "Purpose (Personal / Commercial)",
                },
                marketValue: {
                  type: "number",
                  title: "Current market value",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "preciousMetals",
      label: "Precious Metals",
      schema: {
        type: "object",
        properties: {
          holdings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                totalQuantity: {
                  type: "string",
                  title: "Total quantity (grams)",
                },
                form: {
                  type: "string",
                  title: "Form (jewellery/coins/bars)",
                },
                marketValue: {
                  type: "number",
                  title: "Current market value",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "livestockAssets",
      label: "Livestock",
      schema: {
        type: "object",
        properties: {
          livestock: {
            type: "array",
            title: "Animals",
            items: {
              type: "object",
              properties: {
                typeOfAnimals: {
                  type: "string",
                  title: "Types of animals",
                },
                quantity: {
                  type: "string",
                  title: "Quantity of each type",
                },
                purpose: {
                  type: "string",
                  title: "Purpose (dairy/farming/breeding)",
                },
                totalValue: {
                  type: "number",
                  title: "Total value",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                monthlyIncome: {
                  type: "number",
                  title: "Monthly income",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                maintenanceCosts: {
                  type: "number",
                  title: "Maintenance costs",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "businessDetails",
      label: "Business Details",
      schema: {
        type: "object",
        properties: {
          businessName: {
            type: "string",
            title: "Name of Current Business Firm",
          },
          businessFirmType: {
            type: "string",
            title: "Type of Business Firm",
            enum: [
              "Proprietorship",
              "Partnership",
              "LTD",
              "PVT LTD",
              "Others",
            ],
          },
          shareholding: {
            type: "string",
            title: "If Partnership, % shareholding",
          },
          partners: {
            type: "array",
            title: "Name of the Partners",
            items: {
              type: "string",
              title: "Partner Name",
            },
          },
          commencementDate: {
            type: "string",
            title: "Date of commencement of Business",
          },
          placeOfIncorporation: {
            type: "string",
            title: "Place of Incorporation (Address)",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          pdAddress: {
            type: "string",
            title: "Address of the PD",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          totalWorkExperienceYears: {
            type: "number",
            title: "Total Work Experience (Years)",
            minimum: 0,
          },
          mobileNumber: {
            type: "string",
            title: "Mobile No.",
            pattern: "^[0-9]{10}$",
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business",
          },
          industryType: {
            type: "string",
            title: "Type of Industry",
            enum: ["Manufacturer", "Trading", "Services", "Other"],
          },
          businessProfile: {
            type: "string",
            title: "Business Profile",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          premisesOwnership: {
            type: "string",
            title: "Business Premises Ownership",
            enum: [
              "Self-Owned",
              "Family-Owned",
              "Joint Ownership",
              "Rented",
            ],
          },
          stocksAssetsSeen: {
            type: "string",
            title: "Stocks/Assets Seen in Business Premises",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          businessLocality: {
            type: "string",
            title: "Locality of Business Premises",
            enum: [
              "Residential",
              "Commercial",
              "Industrial",
              "Corporate Hub/Office Space",
              "Other",
            ],
          },
          annualTurnover: {
            type: "number",
            title: "Annual Turnover (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          netProfitMargin: {
            type: "string",
            title: "Net Profit Margin",
          },
          businessSeasonal: {
            type: "string",
            title: "Is Business seasonal?",
            enum: ["Yes", "No"],
          },
          numberOfEmployees: {
            type: "integer",
            title: "Number of Employees",
            minimum: 0,
          },
          yearsAtCurrentPremises: {
            type: "number",
            title: "No. of Years Business Running in this Premises",
            minimum: 0,
          },
          competitorsNearby: {
            type: "integer",
            title: "No. of Competitors in Nearby Market",
            minimum: 0,
          },
          businessStartedBy: {
            type: "string",
            title: "Business started by",
            enum: ["Self", "Father", "Other Family Members"],
          },
          initialFundingSource: {
            type: "string",
            title: "If Self Started, source of initial funds",
            enum: ["Own Funding", "Borrowed from Family", "Loan", "Others"],
          },
          customerGeoTag: {
            type: "string",
            title: "Customer Location (Office / Business GEO Tag)",
          },
        },
      },
    },
    {
      id: "businessIncome",
      label: "Business Income Computation (Monthly Basis)",
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
            },
          },
          receipts: {
            type: "number",
            title: "Receipts",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          purchases: {
            type: "number",
            title: "Purchases",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          rent: {
            type: "number",
            title: "Rent",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          electricity: {
            type: "number",
            title: "Electricity",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          transportation: {
            type: "number",
            title: "Transportation",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          otherExpenses: {
            type: "number",
            title: "Other Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          totalMonthlyRevenue: {
            type: "number",
            title: "Total Monthly Revenue (A)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          totalMonthlyExpenses: {
            type: "number",
            title: "Total Monthly Expenses (B)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          netMonthlyProfit: {
            type: "number",
            title: "Net Monthly Profit (= A - B)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
    },
    {
      id: "otherMonthlyIncome",
      label: "Other Monthly Income",
      schema: {
        type: "object",
        properties: {
          rentalIncomeCash: {
            type: "number",
            title: "Rental Income - Cash",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          rentalIncomeCheque: {
            type: "number",
            title: "Rental Income - Cheque",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          incentivesCash: {
            type: "number",
            title: "Incentives / Perks - Cash",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          incentivesCheque: {
            type: "number",
            title: "Incentives / Perks - Cheque",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          monthlyBonusCash: {
            type: "number",
            title: "Monthly Bonus - Cash",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          monthlyBonusCheque: {
            type: "number",
            title: "Monthly Bonus - Cheque",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          otherIncomeCash: {
            type: "number",
            title: "Any Other Income - Cash",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          otherIncomeCheque: {
            type: "number",
            title: "Any Other Income - Cheque",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
    },
    {
      id: "loanPurpose",
      label: "Loan Details & Purpose",
      schema: {
        type: "object",
        properties: {
          purposes: {
            type: "array",
            title: "Purpose of Loan",
            uniqueItems: true,
            items: {
              type: "string",
              enum: [
                "Flat Purchase",
                "House Purchase",
                "Plot Purchase",
                "Construction of Residential House Property",
                "Business development",
                "Improvement/Extension",
                "Balance Transfer",
                "Plot + Construction",
              ],
            },
          },
          minimumLoanAmount: {
            type: "number",
            title: "Minimum Loan Amount Required",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          tenureRequired: {
            type: "string",
            title: "Tenure Required (years)",
          },
          monthlyHouseholdExpenses: {
            type: "number",
            title: "Monthly Household Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          comfortableEmi: {
            type: "number",
            title: "Comfortable EMI",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
    },
    {
      id: "collateralDetails",
      label: "Collateral Details",
      schema: {
        type: "object",
        properties: {
          propertyStatus: {
            type: "string",
            title: "Status of Property to be Purchased",
            enum: ["Ready to move", "Under Construction", "Construction Yet to Start"],
          },
          usageAfterPurchase: {
            type: "array",
            title: "Usage of Property after Purchase",
            uniqueItems: true,
            items: {
              type: "string",
              enum: ["Self-Occupancy", "Investment", "Others", "Renting Purpose"],
            },
          },
          usageOtherNotes: {
            type: "string",
            title: "If Others, specify usage",
          },
          propertyAddress: {
            type: "string",
            title: "Property Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          propertyArea: {
            type: "string",
            title: "Area (in Sq. ft.)",
          },
          ownershipDuration: {
            type: "string",
            title: "Ownership of the property from how many years?",
          },
          agreementValue: {
            type: "number",
            title: "Agreement value",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          ownContribution: {
            type: "number",
            title: "Own Contribution",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
    },
    {
      id: "currentLoanDetails",
      label: "Current Loan Details",
      schema: {
        type: "object",
        properties: {
          currentLoans: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank / FI Name",
                },
                loanType: {
                  type: "string",
                  title: "Loan Type",
                },
                sanctionAmount: {
                  type: "number",
                  title: "Sanction Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                emi: {
                  type: "number",
                  title: "EMI",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                emisPaid: {
                  type: "number",
                  title: "No. of EMI Paid",
                  minimum: 0,
                },
                balanceTenor: {
                  type: "string",
                  title: "Balance Tenor",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "costAndFunds",
      label: "Cost and Funds Information (Loan Details)",
      schema: {
        type: "object",
        properties: {
          fundsRequired: {
            type: "number",
            title: "Funds Required",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          ownFundsSource: {
            type: "string",
            title: "Source of Own Funds (OCR)",
          },
          purchaseCost: {
            type: "number",
            title: "Purchase Cost",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          savings: {
            type: "number",
            title: "Savings",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          constructionEstimate: {
            type: "number",
            title: "Construction Estimate",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          totalTransactionCost: {
            type: "number",
            title: "Total Transaction Cost",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
    },
    {
      id: "bankingDetails",
      label: "Banking Details",
      schema: {
        type: "object",
        properties: {
          bankingAccounts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                accountNumber: {
                  type: "string",
                  title: "Account Number",
                },
                branch: {
                  type: "string",
                  title: "Branch",
                },
                accountType: {
                  type: "string",
                  title: "Account Type",
                  enum: ["Savings", "Current", "Overdraft", "Other"],
                },
                operatingSinceYears: {
                  type: "string",
                  title: "Operation since (Years)",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "otherFamilyMembers",
      label: "Other Family Member Details",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relationWithApplicant: {
                  type: "string",
                  title: "Relation with Applicant",
                },
                age: {
                  type: "integer",
                  title: "Age (years)",
                  minimum: 0,
                },
                occupation: {
                  type: "string",
                  title: "Occupation (Job / Business)",
                },
                educationalQualification: {
                  type: "string",
                  title:
                    "Educational Qualification (Also mention if Govt. or Private institution)",
                },
                contactNumber: {
                  type: "string",
                  title: "Contact Number",
                  pattern: "^[0-9]{10}$",
                },
                stayingWithApplicant: {
                  type: "string",
                  title: "Staying with Applicant",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "references",
      label: "References (Business Parties)",
      schema: {
        type: "object",
        properties: {
          references: {
            type: "array",
            items: {
              type: "object",
              properties: {
                referenceName: {
                  type: "string",
                  title: "Name",
                },
                address: {
                  type: "string",
                  title: "Address",
                  ui: {
                    widget: "textarea",
                    rows: 2,
                  },
                },
                relationship: {
                  type: "string",
                  title: "Relationship",
                },
                contactNumber: {
                  type: "string",
                  title: "Contact Number",
                  pattern: "^[0-9]{10}$",
                },
                email: {
                  type: "string",
                  title: "Email address",
                  format: "email",
                },
                yearsKnown: {
                  type: "number",
                  title: "No. of Years known the applicant",
                  minimum: 0,
                },
                photoWithApplicant: {
                  type: "string",
                  title: "Photo with Applicant (Yes/No / Notes)",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "tpcDetails",
      label: "TPC (Third Party Check) Details",
      schema: {
        type: "object",
        properties: {
          businessReferences: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                address: {
                  type: "string",
                  title: "Address",
                  ui: {
                    widget: "textarea",
                    rows: 2,
                  },
                },
                mobileNumber: {
                  type: "string",
                  title: "Mobile No.",
                  pattern: "^[0-9]{10}$",
                },
                knowingSince: {
                  type: "string",
                  title: "Knowing since (Months / Years)",
                },
                feedback: {
                  type: "string",
                  title: "Feedback",
                  enum: ["Positive", "Negative", "Neutral"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "pdOfficerReview",
      label: "PD Officer Review",
      schema: {
        type: "object",
        properties: {
          majorObservations: {
            type: "string",
            title: "Major Observations / Comments / Concerns During PD",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          caseStrengths: {
            type: "string",
            title: "Case Strengths",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          caseWeakness: {
            type: "string",
            title: "Case Weakness",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          pdStatus: {
            type: "string",
            title: "PD Status",
            enum: ["Positive", "Negative", "Referred"],
          },
          pdOfficerName: {
            type: "string",
            title: "Name of PD Officer",
          },
          visitDate: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          visitTime: {
            type: "string",
            title: "Time of Visit",
          },
          officerSignature: {
            type: "string",
            title: "Signature of the PD Officer",
          },
        },
      },
    },
  ],
} as const;

export default indiaShelterSenpSchema;
