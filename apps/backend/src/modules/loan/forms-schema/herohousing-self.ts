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
            title: "PD visit time",
          },
          pdVisitDateAndTime: {
            type: "string",
            title: "PD visit date and time (legacy field)",
          },
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
          latOfOfficeAddress: {
            type: "string",
            title: "Latitude of office address (legacy)",
          },
          longOfOfficeAddress: {
            type: "string",
            title: "Longitude of office address (legacy)",
          },
          latLongOfOfficeAddress: {
            type: "string",
            title: "Lat/Long of office address (legacy)",
          },
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
      label: "Borrower profile",
      schema: {
        type: "object",
        properties: {
          qualificationAndJourney: {
            type: "string",
            title:
              "Borrower details – includes qualification & professional journey",
            ui: {
              widget: "textarea",
              rows: 6,
            },
          },
          qualificationAndProfessionalJourney: {
            type: "string",
            title:
              "Borrower details (legacy) – qualification & professional journey",
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
      label: "Business premises",
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
          ownershipOfAllAboveBusinessPremises: {
            type: "string",
            title: "Ownership of business premises (legacy)",
          },
          businessPremisesSize: {
            type: "string",
            title: "Size / area of business premises",
          },
          sizeAreaOfBusinessPremises: {
            type: "string",
            title: "Size / area of business premises (legacy)",
          },
          operationsAndFootfallObservation: {
            type: "string",
            title:
              "Comment on business operations / footfall / stock & other observations",
          },
          commentOnBusinessOperationsFootfallOfCustomerStock: {
            type: "string",
            title:
              "Comment on business operations / footfall / stock (legacy)",
          },
        },
      },
    },
    {
      id: "businessOperations",
      label: "Business operations & performance",
      schema: {
        type: "object",
        properties: {
          productServiceDetails: {
            type: "string",
            title: "Brief about the products / services dealing",
          },
          noOfEmployeeAndSalaryDetails: {
            type: "string",
            title: "No. of employees and salary details",
          },
          stockQuantum: {
            type: "string",
            title: "Quantum of stock",
          },
          quantumOfStock: {
            type: "string",
            title: "Quantum of stock (legacy)",
          },
          machineryAndAssets: {
            type: "string",
            title: "No. of machinery and assets seen",
          },
          turnoverHistory: {
            type: "string",
            title:
              "Turnover of last three years and current year till date (actual)",
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
              "Expansion or new products/services introduced in last 2 years (impact on revenue)",
          },
          briefAboutTheLocalityOfBusiness: {
            type: "string",
            title:
              "Brief about the locality, competitors, prospects & negative feedback",
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
            title: "No. of total suppliers",
          },
          supplierCreditTerms: {
            type: "string",
            title: "Supplier credit period details",
          },
          noOfTotalCustomers: {
            type: "integer",
            title: "No. of total customers",
          },
          customerCreditTerms: {
            type: "string",
            title: "Customer credit period details",
          },
          billingCycleAndReceiptMode: {
            type: "string",
            title:
              "Billing period/cycle and receipt mode (comment if any advance received)",
          },
          totalDebtorsAndCreditors: {
            type: "string",
            title:
              "Total debtors and creditors as on date (mention defaults/write offs)",
          },
          tradeReferences: {
            type: "array",
            title: "References of suppliers/customers (min 2 each)",
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
          },
          propertyOccupancy: {
            type: "string",
            title:
              "Property is occupied by whom & reason if not self-occupied (include rent / tenancy / construction stage)",
          },
          propertyPurchaseSource: {
            type: "string",
            title: "Source of property purchase (Dealer/Builder/Reference)",
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
            title: "Actual deal value vs sale deed value (OCR source)",
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
              "Investment habits & monthly savings (schemes / properties / FD etc)",
          },
          residenceOwnership: {
            type: "string",
            title: "Whether current residence is owned or rented (mention rent)",
          },
          assetsBuilt: {
            type: "string",
            title:
              "Details of assets built till date (immovable, movable, gold, FD, equity, other savings)",
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
              "Proposed end use of property (self-occupation/investment etc.)",
          },
          fundUtilisation: {
            type: "string",
            title: "Clear and detailed end use of fund",
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
              "Loans presently servicing (mention if closing / continuing)",
          },
          repaymentAccount: {
            type: "string",
            title:
              "Repayment account from which EMIs are being paid",
          },
          pastLoanEndUse: {
            type: "string",
            title:
              "End use of loans taken in last 3 years / exceptional borrowings",
          },
          mortgageOrFacilities: {
            type: "string",
            title:
              "Any home loan/LAP/CC/OD facility (mention mortgage property and usage)",
          },
          repaymentBehaviour: {
            type: "string",
            title:
              "Repayment behaviour – bouncing details with period and reason",
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
              "Details of business bank accounts (account open date, major transaction accounts)",
          },
          savingsAccounts: {
            type: "string",
            title:
              "Savings accounts of applicant and co-applicant",
          },
          receiptsRoutedThroughBanking: {
            type: "number",
            title: "% of total receipts routed through banking",
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
              "Sale/purchase registers, bills, kutcha records, inventory observations",
          },
          thirdPartyChecks: {
            type: "string",
            title:
              "Neighbour / independent reference check (ownership, existence period)",
          },
          additionalInvolvementCheck: {
            type: "string",
            title:
              "Check if any family member involved in managing the business",
          },
          complianceAndBranding: {
            type: "string",
            title:
              "Verification of QR codes, licenses, permits, name board, contact number etc.",
          },
          externalFeedback: {
            type: "string",
            title: "Google / external checks & negative feedback (if any)",
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
          lineItems: {
            type: "array",
            title: "Income assessment line items",
            items: {
              type: "object",
              properties: {
                particular: {
                  type: "string",
                  title: "Particular",
                },
                monthlyAmount: {
                  type: "number",
                  title: "Amount (Rs.) Monthly",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                comments: {
                  type: "string",
                  title: "Comments / Mode of validation",
                },
              },
            },
          },
          monthlyNetIncome: {
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
          },
          monthlyObligations: {
            type: "number",
            title: "Less: Monthly obligations / EMIs not getting closed",
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
          },
        },
      },
    },
  ],
} as const;

export default herohousingSelfSchema;
