export const herohousingSalariedSchema = {
  id: 14,
  bankName: "HeroHousing-Salaried",
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
          },
        },
        required: ["loanAccountNo", "nameOfCustomer", "personMetInPd", "relationshipWithCustomer", "pdVisitDateAndTime", "latLongOfOfficeAddress", "requestedLoanAmount"],
      },
       
    },
    {
      id: "profileOfCustomer",
      label: "Profile of Customer",
      schema: {
        type: "object",
        properties: {
          borrowerDetails: {
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
      id: "currentJobProfile",
      label: "Current Job Profile",
      schema: {
        type: "object",
        properties: {
          nameOfEmployer: {
            type: "string",
            title: "Name of Employer",
          },
          workingSince: {
            type: "string",
            title: "Working since",
          },
          typeOfEmployment: {
            type: "string",
            title: "Type of employment (Permanent/Contractual)",
            enum: ["Permanent", "Contractual"],
          },
          designation: {
            type: "string",
            title: "Designation",
          },
          jobProfile: {
            type: "string",
            title: "Job profile",
          },
          reportingTo: {
            type: "string",
            title: "Reporting to (Name/Designation)",
          },
        },
      },
       
    },
    {
      id: "detailsOfEmployer",
      label: "Details of Employer",
      schema: {
        type: "object",
        properties: {
          currentBusinessName: {
            type: "string",
            title: "Current business Name",
          },
          constitution: {
            type: "string",
            title: "Constitution",
          },
          natureOfBusinessProductOrServices: {
            type: "string",
            title: "Nature of business/product or services details",
          },
          runningSince: {
            type: "string",
            title: "Running since",
          },
          detailsOfPartnersDirectorsShareholdersWithFamilyBackground: {
            type: "string",
            title: "Details of partners, director, shareholders with family background and other details (For each partner if constitution is other than proprietorship firm)",
          },
          noOfEmployeesAndSetupOfBusiness: {
            type: "string",
            title: "No. of employees and setup of business",
          },
          quantumOfStock: {
            type: "string",
            title: "Quantum of stock",
          },
          noOfMachineryAndAssetsSeen: {
            type: "string",
            title: "No. of Machinery and assets seen",
          },
          localityDetailsCompetitorsOverallProspectOfLocationAnyNegativeFeedback:
            {
              type: "string",
              title: "Brief details about the locality of business, surrounding competitors, overall prospect of location etc and any negative feedback",
            },
        },
      },
       
    },
    {
      id: "propertyDetails",
      label: "Details of Property",
      schema: {
        type: "object",
        properties: {
          whetherCustomerVisitedTheProperty: {
            type: "string",
            title: "Whether Customer visited the property",
          },
          typeOfPropertyReadyPlotSelfConstructionUnderConstructionVacant: {
            type: "string",
            title:
              "Type of property (Ready/Plot/Self Construction/Under Construction/Vacant etc)",
          },
          occupiedByWhomAndReasonIfNotSelfOccupied: {
            type: "string",
            title: "Property is occupied by whom and reason if not self-occupied (Also mention stage in case self-construction/under construction and expected completion date, also mention rent amount and period of tenancy if the property is given on rent)",
          },
          sourceOfPropertyPurchaseThroughDealerBuilderReferenceRelative: {
            type: "string",
            title: "Source of property purchase (Through Dealer/Builder/Reference/Relative)",
          },
          nameOfSellerRelationshipWithCustomer: {
            type: "string",
            title: "Name of seller & relationship with customer",
          },
          typeOfPropertyStructureArea: {
            type: "string",
            title: "Type of property/structure & area",
          },
          actualDealValueSaleDeedValue: {
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
            title:              "What was the end use of fund of these loans (All BL/PL/LAP loan taken in last 3 years), also please check if there is any exceptional borrowing in last 12 months than exact use ",
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
            title: "Please check and mention details of all his bank account, account open date, Name of bank account where salary is getting credited (if bank salary)",
          },
          savingsAccountDetails: {
            type: "string",
            title: "Please check any saving account of applicant and co applicant and provide the details of these accounts",
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
          payrollRegisterAndAttendanceRegisterVerification: {
            type: "string",
            title: "Payroll register & attendance register verification",
          },
          thirdPartyCheck: {
            type: "string",
            title: "TPC from minimum 1 neighbour and 1 local independent party to be done (It should be done by showing the photo of customer and employment to be confirmed in the name of customer with existence period",
          },
          familyRelationshipCheckWithEmployer: {
            type: "string",
            title: "Additional check to be done from reference if there is any family relationship with employer and employee",
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
  ],
} as const;
export default herohousingSalariedSchema;
