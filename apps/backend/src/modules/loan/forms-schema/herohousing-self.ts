export const herohousingSelfSchema = {
  id: 15,
  bankName: "HeroHousing-Self",
  sections: [
    {
      id: "generalLoanVisitDetails",
      label: "General Loan & Visit Details",
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
          reasonIfCustomerNotAvailableDuringVisit: {
            type: "string",
            title: "Reason if customer not available during visit",
          },
          pdVisitDateAndTime: {
            type: "string",
            format: "date-time",
            title: "PD Visit date and time",
          },
          pdAddress: {
            type: "string",
            title: "PD address",
          },
          latOfOfficeAddress: {
            type: "string",
            title: "Latitude of office address",
          },
          longOfOfficeAddress: {
            type: "string",
            title: "Longitude of office address",
          },
          requestedLoanAmount: {
            type: "number",
            title: "Requested loan amount",
            format:{
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            }
          },
        },
        required: ["loanAccountNo", "nameOfCustomer", "personMetInPd", "relationshipWithCustomer", "pdVisitDateAndTime", "latLongOfOfficeAddress", "requestedLoanAmount"],
      },
       
    },
    {
      id: "borrowerDetails",
      label: "Borrower details",
      schema: {
        type: "object",
        properties: {
          qualificationAndProfessionalJourney: {
            type: "string",
            title: "Borrower details- includes qualification & professional journey(service/ business details of each activity post qualification to till date)",
          },
        },
      },
       
    },
    {
      id: "familyDetails",
      label: "Family details (Including dependents) - Family background (Parents and siblings including all dependents)",
      schema: {
        type: "object",
        properties: {
          familyDetails: {
            type: "array",
            title: "Family Details",
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
                  title: "Income Details / dependent",
                },
              },
            },
          },
        },
      },
       
    },
    {
      id: "currentBusinessDetails",
      label: "Current Business Details",
      schema: {
        type: "object",
        properties: {
          currentBusinessName: {
            type: "string",
            title: "Current business name",
          },
          constitution: {
            type: "string",
            title: "Constitution", 
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of business/product or services details",
          },
          runningSince: {
            type: "string",
            title: "Running since",
          },
          detailspartnersDirectorsShareholdersWithFamilyBackground: {
            type: "string",
            title: "Details of partners, director, shareholders with family background and other details (For each partner if constitution is other than proprietorship firm)",
          },
        },
      },
       
    },
    {
      id: "detailsOfBusinessPremises",
      label: "Details of Business Premises",
      schema: {
        type: "object",
        properties: {
          addressOfBusinessPremises: {
            type: "string",
            title: "Address of business premises and additional places of business",
          },
          ownershipOfAllAboveBusinessPremises: {
            type: "string",
            title: "Ownership of all above business premises (Also mention rent amount and landlord name in case rented)",
          },
          sizeAreaOfBusinessPremises: {
            type: "string",
            title: "Size/area of business premises",
          }, 
          commentOnBusinessOperationsFootfallOfCustomerStock: {
            type: "string",
            title: "Comment on the business operations/footfall of customer/stock etc and share observations if any",
          },
        },
      },
       
    },
    {
      id: "detailsaboutbusinessdetails",
      label: "Details about business",
      schema: {
        type: "object",
        properties: {
          briefAboutTheProductServicesDealing: {
            type: "string",
            title: "Brief about the product/services dealing",
          },
          noOfEmployeeAndSalaryDetails: {
            type: "string",
            title: "No. of employee and salary details",
          },
          quantumOfStock: {
            type: "string",
            title: "Quantum of stock",
          },
          noOfMachineryAndAssetsSeen: {
            type: "string",
            title: "No. of Machinery and assets seen",
          },
          turnoverOfLastThreeYears: {
            type: "string",
            title: "Turnover of last three  till date (Total actual turnover of customer)",
          },
          productServiceGrossMarginRatio: {
            type: "string",
            title: "Product/service Gross Margin ratio",
          },
          productServiceNetMarginRatio: {
            type: "string",
            title: "Product/service Net Margin ratio",
          },
          anyExpansionOrNewProductServices: {
            type: "string",
            title: "Any expansion or new product/services introduced in last 2 years includimg change in business premises and any expected impact on the current revenue",
          },
          briefAboutTheLocalityOfBusiness: {
            type: "string",
            title: "Brief about the locality of business, surrounding competitors, overall prospect of location etc and any negative feedback",
          },
         
        },
      }, 
    },
    {
      id: "detailsOfSupplierAndCustomer",
      label: "Details of Supplier and Customer",
      schema: {
        type: "object",
        properties: {
          briefAboutSupplierAndCustomer: {
            type: "string",
            title: "Brief about supplier and customer and geographic reach/presence",
          },
          noOfTotalSuppliersAndCustomers: {
            type: "number",
            title: "No. of total suppliers and details of terms for credit period",
          },
          noOfTotalCustomers: {
            type: "number",
            title: "No. of total customers and details of terms for credit period",
          },
          billingPeriodAndReceiptMode:{
            type: "string",
            title: "Billing period/cycle and receipt mode (Billing on cosignment basis/ monthly basis/ progress of work basis) also co",
          },
          totalDebtorsAndCreditors: {
            type: "string",
            title: "Total debtors and creditors as on date and any default/write off in past",
          },
          referenceOfMin2SuppliersAnd2Customers: {
            type: "string",
            title: "Please collect Reference of min 2 suppliers and 2 customers with their phone no. and business name",
          },

        },
      },
    },
    {
      id: "detailsOfProperty",
      label: "Details of Property",
      schema: {
        type: "object",
        properties: {
          whetherCustomerVisitedTheProperty: {
            type: "string",
            title: "Whether Customer visited the property",
          },
          typeOfProperty: {
            type: "string",
            title: "Type of property (Ready/Plot/Self Construction/Under Construction/Vacant etc)",
          },
          propertyIsOccupiedByWhom:{
            type: "string",
            title: "Property is occupied by whom and reason if not self-occupied (Also mention stage in case self-construction/under construction and expected completion date, also mention rent amount and period of tenancy if the property is given on rent)",
          },
          sourceOfPropertyPurchase: {
            type: "string",
            title: "Source of property purchase (Through Dealer/Builder/Reference/Relative)",
          },
          nameOfSellerAndRelationshipWithCustomer: {
            type: "string",
            title: "Name of seller and relationship with customer",
          },
          typeOfPropertyAndStructureArea: {
            type: "string",
            title: "Type of property/structure and area",
          },
          actualDealValueAndSaleDeedValue: {
            type: "string",
            title: "What is actual deal value and sale deed value, OCR source",
          },
          whetherSellerIsHavingAnyLoanOnTheProperty: {
            type: "number",
            title: "Whether seller is having any loan on the property",
          },
          whenSellerBoughtTheProperty: {
            type: "string",
            title: "When seller bought the property",
          },
        },
      },
    },
    {
      id: "investmentAndProperties",
      label: "Investment & Properties",
      schema: {
        type: "object",
        properties: {
          customerInvestmentHabitsAndMonthlySavings: {
            type: "string",
            title: "What is customer investment habits and he is doing any monthly saving in any of saving scheme, investment in properties, FD or any other nature of saving",
          },
          currentResidenceOwnership: {
            type: "string",
            title: "Whether current residence is owned or rented and rent amount if any",
          },
          detailsOfAssetsBuiltTillDate: {
            type: "string",
            title: "Details of assets built till date (Including immovable properties, movable property, gold, FD, Equity investment, other savings)",
          },
        },
      },
       
    },
    {
      id: "endUseOfPropertyFund",
      label: "End Use of Property/Fund",
      schema: {
        type: "object",
        properties: {
          endUseOfProperty: {
            type: "string",
            title: "Proposed End use of property (self-occupation/investment etc) for HL/P+C/Self construction cases",
          },
          detailedEndUseOfFundInLapCases: {
            type: "string",
            title: "Clear and detailed end use of fund in LAP cases ",
          },
        },
      },
       
    },
    {
      id: "detailsOfLoans",
      label: "Details of Loans",
      schema: {
        type: "object",
        properties: {
          checkAndProvideDetailsOfLoanPresentlyServicing: {
            type: "string",
            title: "Please check and provide the details of loan presently servicing and whether he will be closing such loans or going to continue, ",
          },
          repaymentAccountDetails: {
            type: "string",
            title: "Repayment account from which all these EMI are getting paid ",
          },
          endUseOfFundsForPastLoans: {
            type: "string",
            title:"What was the end use of fund of these loans (All BL/PL/LAP loan taken in last 3 years), also please check if there is any exceptional borrowing in last 12 months than exact use and impact on the business revenue",
          },
          checkIfAnyHomeLoanLap: {
            type: "string",
            title: "Also check if any home loan/LAP than what is address of mortgage property, usage of such property, any OD limit or any other facility in the name of customer",
            },
          anyBouncingInLoans: {
            type: "string",
            title: "Comment whether there is any bouncing in loans and if yes, period and reason of such bounces",
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
          allBankAccountsDetailsOpeningDate: {
            type: "string",
            title: "Please check and mention details of all his bank account, account open date, Name of bank account in which major business transactions are happening",
          },
          savingsAccountDetails: {
            type: "string",
            title: "Please check any saving account of applicant and co applicant and provide the details of these accounts",
          },
          percentageOfTotalReceiptRoutedThroughBanking: {
            type: "number",
            title: "% of total receipt routed through banking",
          },
        },
      },
       
    },
    {
      id: "documentVerificationOtherChecks",
      label: "Document Verification & Other Checks",
      schema: {
        type: "object",
        properties: {
          relevantSalePurchaseRegisterBillsKutchaRecordsAndInventory: {
            type: "string",
            title: "Please check all relevant sale/purchase register/ bills/ kutcha records and inventory in line with those recored, payroll register and share observations",
          },
          thirdPartyCheck: {
            type: "string",
            title: "TPC from minimum 1 neighbour and 1 local independent party to be done (It should be done by showing the photo of customer and ownership to be confirmed in the name of customer with existence period",
          }, 
          otherPersonOrFamilyMemberInvolvedInTheBusiness: {
            type: "string",
            title: "Additional check to be done from reference that any other person or family member involved in the business/manage the business",
          }, 
          checkQrCodesLicensesPermitsNameBoardContactNumberBelongingToEmployer:
            {
              type: "string",
              title: "Please check all QR code, license, permits, name board, contact number etc and all these belongs to employer and share observations",
            },
          googleCheckAnyNegativeObservationsFeedbackDedupeMatch: {
            type: "string",
            title: "Google check and any negative observation/feedback/dedupe match", 
          },
        },
      },
       
    },
    {
      id:"finalPDStaus",
      label: "Final PD Status",
      schema: {
        type: "object",
        properties: {
          finalPDStatus: {
            type: "string",
            title: "Final PD Status (Positive/Negative) with comment for reason of status",
          },
        },
      },
    },
    {
      id:"incomeAssessmentDetails",
      label: "Income Assessment Details",
      schema: {
        type: "object",
        properties: {
          salesReceiptsMonthlyAverage: {
            type: "object",
            title: "Sales/receipts (monthly average)",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          otherIncome: {
            type: "object",
            title: "Other income",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          totalMonthlyIncome: {
            type: "object",
            title: "Total monthly income",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          costOfMaterialService: {
            type: "object",
            title: "Cost of material/cost of service",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          directExpenses: {
            type: "object",
            title: "Direct expenses",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          salary: {
            type: "object",
            title: "Salary",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          rent: {
            type: "object",
            title: "Rent",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          electricity: {
            type: "object",
            title: "Electricity expenses",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          otherMiscellaneousExpenses: {
            type: "object",
            title: "Other miscellaneous expenses",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          otherFamilyExpenses: {
            type: "object",
            title: "Other family expenses (school fees, house rent, household expenses etc)",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          netMonthlyAppraisalIncome: {
            type: "object",
            title: "Net monthly appraisal income",
            properties: {
              amount: { 
                type: "number",
                title: "Amount (Rs.) Monthly",
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          monthlyObligationsEMIs: {
            type: "object",
            title: "Less:- Monthly obligations/EMI which are not getting closed",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
                minimum: 0,
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
          netResidualIncome: {
            type: "object",
            title: "Net residual income (monthly)",
            properties: {
              amount: {
                type: "number",
                title: "Amount (Rs.) Monthly",
              },
              comments: {
                type: "string",
                title: "Comments",
              },
            },
          },
        },
      },
    },
  ],
} as const;
export default herohousingSelfSchema;
