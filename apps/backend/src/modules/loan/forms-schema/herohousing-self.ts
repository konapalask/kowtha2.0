import financialsSchema from "../financials-schema/generic";
export const herohousingSelfSchema = {
  id: 15,
  bankName: "HeroHousing-Self",
  sections: [
    {
      id: "loanSummary",
      label: "Loan & Visit Summary",
      schema: {
        type: "object",
        properties: {
          loanAccountNo: {
            type: "string",
            title: "Loan account No.",
            readOnly: true,
          },
          nameOfCustomer: {
            type: "string",
            title: "Name of customer",
            readOnly: true,
          },
          personMetInPd: {
            type: "string",
            title: "Person met in PD",
          },
          relationshipWithCustomer: {
            type: "string",
            title: "Relationship with customer",
          },
          reasonIfCustomerNotAvailable: {
            type: "string",
            title: "Reason if customer not available during visit",
          },
          pdVisitDate: {
            type: "string",
            format: "date",
            title: "PD visit date",
          },
          pdVisitTime: {
            type: "string",
            format: "time",
            title: "PD visit time",
          },
          // pdVisitDateAndTime: {
          //   type: "string",
          //   title: "PD visit date and time (legacy field)",
          // },
          pdAddress: {
            type: "string",
            title: "PD address & location",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          latitude: {
            type: "string",
            title: "Latitude of business address",
          },
          longitude: {
            type: "string",
            title: "Longitude of business address",
          },
          // latLongOfOfficeAddress: {
          //   type: "string",
          //   title: "Lat/Long of office address (legacy)",
          // },
          requestedLoanAmount: {
            type: "number",
            title: "Requested loan amount",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
      required: [
        "loanAccountNo",
        "nameOfCustomer",
        "personMetInPd",
        "pdAddress",
        "requestedLoanAmount",
      ],
    },
    {
      id: "borrowerProfile",
      label: "Borrower details",
      schema: {
        type: "object",
        properties: {
          qualificationOfCustomer: {
            type: "string",
            title: "Qualification of customer",
          },
          professionalJourney: {
            type: "string",
            title:
              "Complete professional journey (service/business details of each activity post qualification to till date)",
            ui: {
              widget: "textarea",
              rows: 6,
            },
          },
          familyMembers: {
            type: "array",
            title: "Family details (including dependents)",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relationshipWithApplicant: {
                  type: "string",
                  title: "Relationship with applicant",
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
                    "12th pass",
                    "Diploma/ITI certification",
                    "Graduate",
                    "PG/Professional Certification",
                  ],
                },
                occupation: {
                  type: "string",
                  title: "Occupation (Job/Business)",
                },
                incomeDetails: {
                  type: "string",
                  title: "Income details / dependent",
                },
                incomeDetailsDependent: {
                  type: "string",
                  title: "Income details / dependent (legacy)",
                },
              },
            },
          },
          familyDetails: {
            type: "array",
            title: "Family details (legacy)",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relationshipWithApplicant: {
                  type: "string",
                  title: "Relationship with applicant",
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
                    "12th pass",
                    "Diploma/ITI certification",
                    "Graduate",
                    "PG/Professional Certification",
                  ],
                },
                occupation: {
                  type: "string",
                  title: "Occupation (Job/Business)",
                },
                incomeDetailsDependent: {
                  type: "string",
                  title: "Income details / dependent",
                },
              },
            },
          },
          totalDependants: {
            type: "integer",
            title: "No. of dependants",
          },
          familyBackgroundNotes: {
            type: "string",
            title: "Family background notes",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
        },
      },
    },
    {
      id: "currentBusinessDetails",
      label: "Current business details",
      schema: {
        type: "object",
        properties: {
          currentBusinessName: {
            type: "string",
            title: "Current business name",
          },
          businessName: {
            type: "string",
            title: "Business name (legacy)",
          },
          constitution: {
            type: "string",
            title: "Constitution",
            enum: [
              "Proprietorship",
              "Partnership",
              "Private Limited",
              "Public Limited",
              "LLP",
              "Other",
            ],
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of business / product or services details",
          },
          runningSince: {
            type: "string",
            title: "Running since",
          },
          industryExperienceYears: {
            type: "number",
            title: "Years of experience in the same line of business",
          },
          detailspartnersDirectorsShareholdersWithFamilyBackground: {
            type: "string",
            title:
              "Details of partners / directors / shareholders & family background",
          },
        },
      },
    },
    {
      id: "businessPremises",
      label: "Details of business premises",
      schema: {
        type: "object",
        properties: {
          addressOfBusinessPremises: {
            type: "string",
            title:
              "Address of business premises and additional places of business",
          },
          ownershipDetails: {
            type: "string",
            title:
              "Ownership of business premises (mention rent amount and landlord name in case rented)",
          },
          sizeOfBusinessPremises: {
            type: "string",
            title: "Size / area of business premises",
          },
          operationsAndFootfallObservation: {
            type: "string",
            title:
              "Comment on business operations / footfall / stock & other observations",
          },
        },
      },
    },
    {
      id: "businessOperations",
      label: "Details about business details",
      schema: {
        type: "object",
        properties: {
          productServiceDetails: {
            type: "string",
            title: "Brief about the products / services dealing",
          },
          stockQuantum: {
            type: "string",
            title: "Quantum of stock",
          },
          noOfEmployeeAndSalaryDetails: {
            type: "string",
            title: "No. of employees and salary details",
          },
          machineryAndAssets: {
            type: "string",
            title: "No. of machinery and assets seen",
          },
          turnoverHistory: {
            type: "string",
            title:
              "Turnover of last three years and current year till date (Total actual turnover of customer)",
          },
          productServiceGrossMarginRatio: {
            type: "string",
            title: "Product / service gross margin ratio",
          },
          productServiceNetMarginRatio: {
            type: "string",
            title: "Product / service net margin ratio",
          },
          expansionOrChanges: {
            type: "string",
            title:
              "Any expansion or new product or change in business line in last 2 Years including change in business premises and any expected impact on the current revenue ",
          },
          briefAboutTheLocalityOfBusiness: {
            type: "string",
            title:
              "Brief details about the locality of business, surrounding competitors, overall prospect of location etc and any negative feedback ",
          },
        },
      },
    },
    {
      id: "supplierCustomerDetails",
      label: "Details of supplier and customer",
      schema: {
        type: "object",
        properties: {
          supplierCustomerOverview: {
            type: "string",
            title:
              "Brief about supplier and customer and geographic reach/presence",
          },
          noOfTotalSuppliersAndCustomers: {
            type: "integer",
            title:
              "No of total suppliers and details of terms for credit period ",
          },
          noOfTotalCustomers: {
            type: "integer",
            title:
              "No of total customers and details of terms for credit period ",
          },
          billingCycleAndReceiptMode: {
            type: "string",
            title:
              "Billing period/cycle and receipt mode (Billing on consignment basis/monthly basis/progress of work basis) also comment if any advance is received",
          },
          totalDebtorsAndCreditors: {
            type: "string",
            title:
              "Total debtors and creditors as on date (mention defaults/write offs)",
          },
          tradeReferences: {
            type: "array",
            title:
              "Please collect Reference of min 2 suppliers and 2 customers with their phone no. and business name) ",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                businessName: {
                  type: "string",
                  title: "Business name",
                },
                relation: {
                  type: "string",
                  title: "Relation (Supplier / Customer)",
                },
                contactNumber: {
                  type: "string",
                  title: "Contact number",
                  pattern: "^[0-9]{10}$",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "propertyDetails",
      label: "Details of property",
      schema: {
        type: "object",
        properties: {
          customerVisitedProperty: {
            type: "string",
            title: "Whether customer visited the property",
          },
          propertyType: {
            type: "string",
            title:
              "Type of property (Ready/Plot/Self Construction/Under Construction/Vacant etc)",
            enum: [
              "Ready",
              "Plot",
              "Self Construction",
              "Under Construction",
              "Vacant",
            ],
          },
          propertyOccupancy: {
            type: "string",
            title:
              "Property is occupied by whom and reason if not self-occupied (Also mention stage in case self-construction/under construction and expected completion date, also mention rent amount and period of tenancy if the property is given on rent)",
          },
          propertyPurchaseSource: {
            type: "string",
            title:
              "Source of property purchase (through dealer, builder/reference/relative) ",
            enum: ["Dealer", "Builder", "Reference", "Relative"],
          },
          sellerDetails: {
            type: "string",
            title: "Name of seller and relationship with customer",
          },
          structureAndArea: {
            type: "string",
            title: "Type of property / structure and area",
          },
          dealAndSaleDeedValue: {
            type: "string",
            title: "What is actual deal value and sale deed value, OCR source ",
          },
          sellerExistingLoan: {
            type: "string",
            title: "Whether seller is having any loan on the property",
          },
          sellerPurchaseTimeline: {
            type: "string",
            title: "When seller bought the property",
          },
        },
      },
    },
    {
      id: "investmentAndAssets",
      label: "Investment & properties",
      schema: {
        type: "object",
        properties: {
          investmentHabits: {
            type: "string",
            title:
              "What is customer investment habits and he is doing any monthly saving in any of saving scheme, investment in properties, FD or any other nature of saving ",
          },
          residenceOwnership: {
            type: "string",
            title:
              "Whether current residence is owned or rented and rent amount if any ",
          },
          assetsBuilt: {
            type: "string",
            title:
              "Details of assets built till date (Including immovable properties, movable property, gold, FD, Equity investment, other savings) ",
          },
        },
      },
    },
    {
      id: "endUseDetails",
      label: "End use of property/fund",
      schema: {
        type: "object",
        properties: {
          propertyEndUse: {
            type: "string",
            title:
              "Proposed End use of property (self-occupation/investment etc) for HL/P+C/Self construction cases",
          },
          fundUtilisation: {
            type: "string",
            title: "Clear and detailed end use of fund in LAP cases",
          },
        },
      },
    },
    {
      id: "loanObligations",
      label: "Details of loans",
      schema: {
        type: "object",
        properties: {
          currentLoansServiced: {
            type: "string",
            title:
              "Please check and provide the details of loan presently servicing and whether he will be closing such loans or going to continue",
          },
          repaymentAccount: {
            type: "string",
            title: "Repayment account from which EMIs are being paid",
          },
          pastLoanEndUse: {
            type: "string",
            title:
              "What was the end use of fund of these loans (All BL/PL/LAP loan taken in last 3 years), also please check if there is any exceptional borrowing in last 12 months than exact use and impact on the business revenue ",
          },
          mortgageOrFacilities: {
            type: "string",
            title:
              "Also check if any home loan/LAP than what is address of mortgage property, usage of such property, any CC/OD limit or any other facility in the name of customer ",
          },
          repaymentBehaviour: {
            type: "string",
            title:
              "Comment whether there is any bouncing in loans and if yes, period and reason of such bounces ",
          },
        },
      },
    },
    {
      id: "bankingDetails",
      label: "Banking details",
      schema: {
        type: "object",
        properties: {
          businessBanking: {
            type: "string",
            title:
              "Please check and mention details of all his bank account, account open date, Name of bank account in which major business transactions are happening ",
          },
          savingsAccounts: {
            type: "string",
            title:
              "Please check any saving account of applicant and co applicant and provide the details of these accounts ",
          },
          receiptsRoutedThroughBanking: {
            type: "number",
            title: "% of total receipt routed through banking",
            formatter: {
              useIndianFormat: false,
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
    },
    {
      id: "documentVerificationChecks",
      label: "Document verification & other checks",
      schema: {
        type: "object",
        properties: {
          recordsAndInventoryObservation: {
            type: "string",
            title:
              "Please check all relevant sale/purchase register/bills/Kutcha records, Inventory in line with those record, Payroll register and share observations ",
          },
          thirdPartyChecks: {
            type: "string",
            title:
              "TPC from minimum 1 neighbour and 1 local independent party to be done (It should be done by showing the photo of customer and ownership to be confirmed in the name of customer with existence period ",
          },
          additionalInvolvementCheck: {
            type: "string",
            title:
              "Additional check to be done from reference that any other person or family member involved in the business/manage the business ",
          },
          complianceAndBranding: {
            type: "string",
            title:
              "Please check all QR code, license, permits, name board, contact number etc and all these belongs to customer and share observations ",
          },
          externalFeedback: {
            type: "string",
            title:
              "Google check and any negative observation/feedback/dedupe match or any other feedback",
          },
          supportingDocumentsCollected: {
            type: "string",
            title: "Supporting documents collected",
          },
        },
      },
    },
    {
      id: "finalStatus",
      label: "Final PD status",
      schema: {
        type: "object",
        properties: {
          pdStatus: {
            type: "string",
            title: "Final PD status",
            enum: ["Positive", "Negative", "Credit Refer"],
          },
          statusComments: {
            type: "string",
            title: "Comments / reasons for status",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
        },
      },
    },
    {
      id: "incomeAssessment",
      label: "Income assessment details",
      schema: {
        type: "object",
        properties: {
          salesReceiptsMonthlyAverage: {
            type: "number",
            title: "Sales/receipt (Monthly average)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          salesReceiptsMonthlyAverageComments: {
            type: "string",
            title: "Sales/receipt (Monthly average) comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          otherIncome: {
            type: "number",
            title: "Other income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          otherIncomeComments: {
            type: "string",
            title: "Other income comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          totalMonthlyIncome: {
            type: "number",
            title: "Total monthly income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          totalMonthlyIncomeComments: {
            type: "string",
            title: "Total monthly income comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          costOfMaterialService: {
            type: "number",
            title: "Cost of material/service",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          costOfMaterialServiceComments: {
            type: "string",
            title: "Cost of material/service comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          directExpenses: {
            type: "number",
            title: "Direct expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          directExpensesComments: {
            type: "string",
            title: "Direct expenses comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          salary: {
            type: "number",
            title: "Salary",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          salaryComments: {
            type: "string",
            title: "Salary comments",
            ui: {
              widget: "textarea",
              rows: 2,
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
          rentComments: {
            type: "string",
            title: "Rent comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          electricityExpenses: {
            type: "number",
            title: "Electricity Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          electricityExpensesComments: {
            type: "string",
            title: "Electricity expenses comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          otherMiscellaneousExpenses: {
            type: "number",
            title: "Other Miscellaneous Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          otherMiscellaneousExpensesComments: {
            type: "string",
            title: "Other miscellaneous expenses comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          otherFamilyExpenses: {
            type: "number",
            title:
              "Other Family Expenses like school fees/house rent, household expenses etc",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          otherFamilyExpensesComments: {
            type: "string",
            title: "Other family expenses comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          netMonthlyAppraisalIncome: {
            type: "number",
            title: "Net monthly appraisal income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          monthlyNetIncomeComments: {
            type: "string",
            title: "Net monthly income comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          monthlyObligations: {
            type: "number",
            title:
              "Less: Monthly obligations / EMIs which are not getting closed",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          monthlyObligationsComments: {
            type: "string",
            title: "Obligations comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          netResidualIncome: {
            type: "number",
            title: "Net residual income (monthly)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netResidualIncomeComments: {
            type: "string",
            title: "Residual income comments",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default herohousingSelfSchema;
