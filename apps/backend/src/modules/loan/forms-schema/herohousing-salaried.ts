export const herohousingSalariedSchema = {
  "id": 14,
  "bankName": "HeroHousing-Salaried",
  "sections": [
    {
      "id": "general",
      "label": "General",
      "schema": {
        "type": "object",
        "properties": {
          "loanAccountNo": {
            "type": "number",
            "title": "Loan account No.",
            "readOnly": true
          },
          "nameOfCustomer": {
            "type": "string",
            "title": "Name of customer",
            "readOnly": true
          },
          "personMetInPdAndRelationshipWithCustomer": {
            "type": "string",
            "title": "Person met in PD and relationship with customer"
          },
          "reasonIfCustomerNotAvailableDuringVisit": {
            "type": "string",
            "title": "Reason if customer not available during visit"
          },
          "pdVisitDateAndTime": {
            "type": "string",
            "title": "PD Visit date and time"
          },
          "pdAddress": {
            "type": "string",
            "title": "PD address"
          },
          "latLongOfOfficeAddress": {
            "type": "string",
            "title": "Lat, Long of office address",
            "readOnly": true
          }
        }
      },
      "required": true
    },
    {
      "id": "currentJobProfile",
      "label": "Current Job Profile",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfEmployer": {
            "type": "string",
            "title": "Name of Employer"
          }
        }
      },
      "required": true
    },
    {
      "id": "totalExperience",
      "label": "Total experience",
      "schema": {
        "type": "object",
        "properties": {
          "grossSalaryAndNetSalary": {
            "type": "string",
            "title": "Gross salary and Net salary"
          },
          "typeOfEmploymentPermanentContractual": {
            "type": "string",
            "title": "Type of employment (Permanent/Contractual)"
          },
          "designation": {
            "type": "string",
            "title": "Designation"
          },
          "jobProfile": {
            "type": "string",
            "title": "Job profile"
          },
          "reportingToNameDesignation": {
            "type": "string",
            "title": "Reporting to (Name/Designation)"
          }
        }
      },
      "required": true
    },
    {
      "id": "detailsOfEmployer",
      "label": "Details of Employer",
      "schema": {
        "type": "object",
        "properties": {
          "currentBusinessName": {
            "type": "string",
            "title": "Current business Name"
          },
          "constitution": {
            "type": "string",
            "title": "Constitution"
          },
          "natureOfBusinessProductOrServices": {
            "type": "string",
            "title": "Nature of business/product or services"
          },
          "runningSince": {
            "type": "string",
            "title": "Running since"
          }
        }
      },
      "required": true
    },
    {
      "id": "detailsOfPartnersDirectorsShareholdersWithFamilyBackground",
      "label": "Details of partners, directors, shareholders (with family background)",
      "schema": {
        "type": "object",
        "properties": {
          "noOfEmployeesAndSetupOfBusiness": {
            "type": "string",
            "title": "No. of employees and setup of business"
          },
          "quantumOfStock": {
            "type": "string",
            "title": "Quantum of stock"
          },
          "noOfMachineryAndAssetsSeen": {
            "type": "string",
            "title": "No. of Machinery and assets seen"
          },
          "localityDetailsCompetitorsOverallProspectOfLocationAnyNegativeFeedback": {
            "type": "string",
            "title": "Locality details (competitors, overall prospect of location, any negative feedback)"
          }
        }
      },
      "required": true
    },
    {
      "id": "propertyDetails",
      "label": "Property Details",
      "schema": {
        "type": "object",
        "properties": {
          "whetherExecutiveVisitedTheProperty": {
            "type": "string",
            "title": "Whether Executive visited the property"
          },
          "typeOfPropertyReadyPlotSelfConstructionUnderConstructionVacant": {
            "type": "string",
            "title": "Type of property (Ready/Plot/Self Construction/Under Construction/Vacant)"
          },
          "occupiedByWhomAndReasonIfNotSelfOccupied": {
            "type": "string",
            "title": "Occupied by whom and reason if not self-occupied"
          },
          "constructionStageExpectedCompletionDate": {
            "type": "string",
            "title": "Construction stage & expected completion date"
          }
        }
      },
      "required": true
    },
    {
      "id": "rentAmountTenancyPeriodIfRented",
      "label": "Rent amount & tenancy period (if rented)",
      "schema": {
        "type": "object",
        "properties": {
          "sourceOfPropertyPurchaseThroughDealerBuilderReferenceRelative": {
            "type": "string",
            "title": "Source of property purchase (Through Dealer/Builder/Reference/Relative)"
          },
          "nameOfSellerRelationshipWithCustomer": {
            "type": "string",
            "title": "Name of seller & relationship with customer"
          },
          "typeOfPropertyStructureArea": {
            "type": "string",
            "title": "Type of property/structure & area"
          },
          "actualDealValueSaleDeedValue": {
            "type": "number",
            "title": "Actual deal value & sale deed value"
          },
          "whetherSellerIsHavingAnyLoanOnTheProperty": {
            "type": "number",
            "title": "Whether seller is having any loan on the property"
          },
          "whenSellerBoughtTheProperty": {
            "type": "string",
            "title": "When seller bought the property"
          },
          "investmentsProperties": {
            "type": "string",
            "title": "Investments & Properties"
          },
          "customerInvestmentHabitsMonthlySavingsFdPropertyEtc": {
            "type": "string",
            "title": "Customer investment habits (monthly savings, FD, property, etc.)"
          },
          "currentResidenceOwnershipOwnedRentedRentAmount": {
            "type": "number",
            "title": "Current residence ownership (Owned/Rented + Rent amount)"
          },
          "detailsOfAssetsBuiltTillDateImmovableMovableGoldFdEquityOtherSavings": {
            "type": "string",
            "title": "Details of assets built till date (Immovable, Movable, Gold, FD, Equity, Other savings)"
          },
          "endUseOfPropertyFund": {
            "type": "string",
            "title": "End Use of Property/Fund"
          },
          "proposedEndUseOfPropertySelfOccupationInvestmentForHlCases": {
            "type": "string",
            "title": "Proposed end use of property (Self-occupation/Investment) for HL cases"
          },
          "detailedEndUseOfFundInLapCases": {
            "type": "string",
            "title": "Detailed end use of fund (in LAP cases)"
          }
        }
      },
      "required": true
    },
    {
      "id": "whetherLoansWillBeClosedOrContinued",
      "label": "Whether loans will be closed or continued",
      "schema": {
        "type": "object",
        "properties": {
          "repaymentAccountDetails": {
            "type": "string",
            "title": "Repayment account details"
          },
          "endUseOfFundsForPastLoansBlPlLapInLast3Years": {
            "type": "string",
            "title": "End use of funds for past loans (BL/PL/LAP in last 3 years)"
          },
          "exceptionalBorrowingInLast12MonthsExactUseAndImpactOnTheBusinessRevenue": {
            "type": "string",
            "title": "Exceptional borrowing in last 12 months (exact use and impact on the business revenue)"
          },
          "mortgagePropertyAddressForHlLap": {
            "type": "string",
            "title": "Mortgage property address (for HL/LAP)"
          },
          "usageOfMortgagedProperty": {
            "type": "string",
            "title": "Usage of mortgaged property"
          },
          "odLimitOrOtherFacilitiesInCustomerSName": {
            "type": "number",
            "title": "OD limit or other facilities in customer’s name"
          }
        }
      },
      "required": true
    },
    {
      "id": "documentVerificationOtherChecks",
      "label": "Document Verification & Other Checks",
      "schema": {
        "type": "object",
        "properties": {
          "payrollRegisterAttendanceRegisterVerification": {
            "type": "string",
            "title": "Payroll register & attendance register verification"
          },
          "tpcThirdPartyCheckMinimum1Neighbour1LocalIndependentParty": {
            "type": "string",
            "title": "TPC (Third Party Check) – minimum 1 neighbour + 1 local independent party"
          },
          "familyRelationshipCheckWithEmployer": {
            "type": "string",
            "title": "Family relationship check with employer"
          },
          "verificationOfQrCodesLicensesPermitsNameBoardContactNumberBelongingToEmployer": {
            "type": "string",
            "title": "Verification of QR codes, licenses, permits, name board, contact number (belonging to employer)",
            "pattern": "^[0-9]{10}$"
          },
          "googleCheckAnyNegativeObservationsFeedbackDedupeMatch": {
            "type": "string",
            "title": "Google check & any negative observations/feedback/dedupe match"
          },
          "statusOfTheCase": {
            "type": "string",
            "title": "Status of the case"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default herohousingSalariedSchema;
