export const indiaShelterSenpSchema = {
  "id": 21,
  "bankName": "India Shelter SENP",
  "sections": [
    {
      "id": "general",
      "label": "General",
      "schema": {
        "type": "object",
        "properties": {
          "branch": {
            "type": "string",
            "title": "Branch"
          }
        }
      },
      "required": true
    },
    {
      "id": "basicDetails",
      "label": "Basic Details",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfThePersonMet": {
            "type": "string",
            "title": "Name of the Person Met"
          }
        }
      },
      "required": true
    },
    {
      "id": "loanProductHlLap",
      "label": "Loan Product (HL / LAP)",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfTheApplicant": {
            "type": "string",
            "title": "Name of the Applicant"
          }
        }
      },
      "required": true
    },
    {
      "id": "maritalStatusSingleMarriedDivorcedOther",
      "label": "Marital Status (Single / Married / Divorced / Other)",
      "schema": {
        "type": "object",
        "properties": {
          "educationalQualificationBelow1010thPass12thPassDiplomaItiCertificationGraduatePgProfessionalCertification": {
            "type": "string",
            "title": "Educational Qualification (Below 10 / 10th Pass / 12th Pass / Diploma / ITI Certification / Graduate / PG / Professional Certification)"
          }
        }
      },
      "required": true
    },
    {
      "id": "totalNoOfFamilyMembers",
      "label": "Total No. of Family Members",
      "schema": {
        "type": "object",
        "properties": {
          "numberOfDependents": {
            "type": "integer",
            "title": "Number of Dependents"
          },
          "children": {
            "type": "string",
            "title": "Children"
          },
          "adults": {
            "type": "string",
            "title": "Adults"
          }
        }
      },
      "required": true
    },
    {
      "id": "address",
      "label": "Address",
      "schema": {
        "type": "object",
        "properties": {
          "noOfYearsAtCurrentResidence": {
            "type": "number",
            "title": "No of Years at Current Residence"
          },
          "areaInSqFt": {
            "type": "string",
            "title": "Area (in Sq ft)"
          },
          "monthlyRentSecurityDepositIfRented": {
            "type": "number",
            "title": "Monthly Rent & Security Deposit (if Rented)"
          },
          "purchasePriceMvIfOwned": {
            "type": "number",
            "title": "Purchase price & MV (if owned)"
          },
          "numberOfYearsInCurrentCity3Years3Years": {
            "type": "number",
            "title": "Number of Years in Current City (<=3 Years / >3 Years)"
          },
          "parentsStayingWithSelfSeparateExpired": {
            "type": "number",
            "title": "Parents Staying with? (Self / Separate / Expired)"
          },
          "nativePlace": {
            "type": "string",
            "title": "Native Place"
          }
        }
      },
      "required": true
    },
    {
      "id": "assetsAndInvestmentDetails",
      "label": "Assets and Investment Details",
      "schema": {
        "type": "object",
        "properties": {
          "assetsOwned": {
            "type": "string",
            "title": "Assets Owned"
          },
          "smartphoneYesNo": {
            "type": "string",
            "title": "Smartphone (Yes/No)",
            "pattern": "^[0-9]{10}$"
          },
          "washingMachineYesNo": {
            "type": "integer",
            "title": "Washing Machine (Yes/No)"
          },
          "carYesNo": {
            "type": "integer",
            "title": "Car (Yes/No)"
          },
          "twoWheelerYesNo": {
            "type": "integer",
            "title": "Two-Wheeler (Yes/No)"
          },
          "computerLaptopYesNo": {
            "type": "integer",
            "title": "Computer/Laptop (Yes/No)"
          },
          "acYesNo": {
            "type": "integer",
            "title": "AC (Yes/No)"
          },
          "fridgeYesNo": {
            "type": "integer",
            "title": "Fridge (Yes/No)"
          },
          "inductionYesNo": {
            "type": "integer",
            "title": "Induction (Yes/No)"
          },
          "financialAssets": {
            "type": "string",
            "title": "Financial Assets"
          },
          "investments": {
            "type": "string",
            "title": "Investments"
          },
          "fixedDepositsAmountMaturity": {
            "type": "number",
            "title": "Fixed Deposits (amount/maturity)"
          }
        }
      },
      "required": true
    },
    {
      "id": "sharesStocksCompaniesValue",
      "label": "Shares/Stocks (companies/value)",
      "schema": {
        "type": "object",
        "properties": {
          "insuranceTypeSumAssured": {
            "type": "string",
            "title": "Insurance (type/sum assured)"
          }
        }
      },
      "required": true
    },
    {
      "id": "otherInvestments",
      "label": "Other investments",
      "schema": {
        "type": "object",
        "properties": {
          "isPostOfficeSavingsMonthlyYesNo": {
            "type": "integer",
            "title": "Is Post Office savings monthly (Yes / No)"
          },
          "anyRecurringDepositYesNo": {
            "type": "integer",
            "title": "Any Recurring Deposit (Yes / No)"
          },
          "land": {
            "type": "string",
            "title": "Land"
          },
          "totalAreaOfPlot": {
            "type": "string",
            "title": "Total area of plot"
          },
          "location": {
            "type": "string",
            "title": "Location"
          },
          "typeAgriculturalCommercialResidentialIndustrial": {
            "type": "string",
            "title": "Type (Agricultural / Commercial / Residential / Industrial)"
          }
        }
      },
      "required": true
    },
    {
      "id": "currentMarketValue",
      "label": "Current market value",
      "schema": {
        "type": "object",
        "properties": {
          "house": {
            "type": "string",
            "title": "House"
          },
          "builtUpAreaInSqFt": {
            "type": "string",
            "title": "Built-up area (in Sq ft)"
          },
          "location": {
            "type": "string",
            "title": "Location"
          },
          "selfOccupiedOrRented": {
            "type": "number",
            "title": "Self-occupied or rented"
          },
          "ifRentedMonthlyIncome": {
            "type": "number",
            "title": "If rented, monthly income"
          }
        }
      },
      "required": true
    },
    {
      "id": "currentMarketValue",
      "label": "Current market value",
      "schema": {
        "type": "object",
        "properties": {
          "shopCommercialSpace": {
            "type": "string",
            "title": "Shop/Commercial Space"
          },
          "areaOfShopSpaceInSqFt": {
            "type": "string",
            "title": "Area of shop/space (in Sq ft)"
          },
          "location": {
            "type": "string",
            "title": "Location"
          },
          "selfOccupiedOrRented": {
            "type": "number",
            "title": "Self-occupied or rented"
          },
          "ifRentedMonthlyIncome": {
            "type": "number",
            "title": "If rented, monthly income"
          }
        }
      },
      "required": true
    },
    {
      "id": "currentMarketValue",
      "label": "Current market value",
      "schema": {
        "type": "object",
        "properties": {
          "vehicles": {
            "type": "string",
            "title": "Vehicles"
          },
          "4Wheelers": {
            "type": "string",
            "title": "4-Wheelers"
          },
          "makeAndModel": {
            "type": "string",
            "title": "Make and model"
          },
          "purposePersonalCommercial": {
            "type": "string",
            "title": "Purpose (Personal/Commercial)"
          },
          "preciousMetals": {
            "type": "string",
            "title": "Precious Metals"
          },
          "goldJewellery": {
            "type": "string",
            "title": "Gold & Jewellery"
          },
          "totalQuantityGrams": {
            "type": "string",
            "title": "Total quantity (grams)"
          },
          "formJewelleryCoinsBars": {
            "type": "string",
            "title": "Form (jewellery/coins/bars)"
          }
        }
      },
      "required": true
    },
    {
      "id": "currentMarketValue",
      "label": "Current market value",
      "schema": {
        "type": "object",
        "properties": {
          "livestock": {
            "type": "string",
            "title": "Livestock"
          },
          "animals": {
            "type": "string",
            "title": "Animals"
          },
          "typesOfAnimals": {
            "type": "string",
            "title": "Types of animals"
          },
          "quantityOfEachType": {
            "type": "string",
            "title": "Quantity of each type"
          },
          "purposeDairyFarmingBreeding": {
            "type": "string",
            "title": "Purpose (dairy/farming/breeding)"
          }
        }
      },
      "required": true
    },
    {
      "id": "totalValue",
      "label": "Total value",
      "schema": {
        "type": "object",
        "properties": {
          "monthlyIncome": {
            "type": "number",
            "title": "Monthly income"
          },
          "maintenanceCosts": {
            "type": "number",
            "title": "Maintenance costs"
          }
        }
      },
      "required": true
    },
    {
      "id": "businessDetails",
      "label": "Business Details",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfCurrentBusinessFirm": {
            "type": "number",
            "title": "Name of Current Business Firm"
          }
        }
      },
      "required": true
    },
    {
      "id": "typeOfBusinessFirmProprietorshipPartnershipLtdPvtLtdOthers",
      "label": "Type of Business Firm (Proprietorship / Partnership / LTD. / PVT LTD. / Others)",
      "schema": {
        "type": "object",
        "properties": {
          "ifPartnershipShareholding": {
            "type": "number",
            "title": "If Partnership, % shareholding"
          },
          "nameOfThePartnerS": {
            "type": "string",
            "title": "Name of the Partner's"
          },
          "dateOfCommencementOfBusinessDdMmYyyy": {
            "type": "string",
            "title": "Date of commencement of Business (DD/MM/YYYY)"
          }
        }
      },
      "required": true
    },
    {
      "id": "addressOfThePd",
      "label": "Address of the PD",
      "schema": {
        "type": "object",
        "properties": {
          "totalWorkExperienceYears": {
            "type": "integer",
            "title": "Total Work Experience (Years)"
          },
          "mobileNo": {
            "type": "string",
            "title": "Mobile No.",
            "pattern": "^[0-9]{10}$"
          },
          "natureOfBusiness": {
            "type": "string",
            "title": "Nature of Business"
          },
          "typeOfIndustryManufacturerTradingServices": {
            "type": "string",
            "title": "Type of Industry (Manufacturer / Trading / Services)"
          }
        }
      },
      "required": true
    },
    {
      "id": "businessPremisesOwnershipSelfOwnedFamilyOwnedJointOwnershipRented",
      "label": "Business Premises ownership (Self-Owned / Family-Owned / Joint Ownership / Rented)",
      "schema": {
        "type": "object",
        "properties": {
          "stocksAssetsSeenInBusinessPremises": {
            "type": "number",
            "title": "Stocks/Assets Seen in Business Premises"
          },
          "localityOfBusinessPremisesResidentialCommercialIndustrialCorporateHubOfficeSpace": {
            "type": "number",
            "title": "Locality of Business Premises (Residential / Commercial / Industrial / Corporate Hub/Office Space)"
          },
          "annualTurnoverRs": {
            "type": "number",
            "title": "Annual Turnover (Rs.)"
          }
        }
      },
      "required": true
    },
    {
      "id": "netProfitMargin",
      "label": "Net Profit Margin",
      "schema": {
        "type": "object",
        "properties": {
          "isBusinessSeasonalYesNo": {
            "type": "integer",
            "title": "Is Business seasonal? (Yes / No)"
          }
        }
      },
      "required": true
    },
    {
      "id": "numberOfEmployees",
      "label": "Number of Employees",
      "schema": {
        "type": "object",
        "properties": {
          "noOfYearsBusinessRunningInThisPremises": {
            "type": "number",
            "title": "No of Years Business Running in this Premises"
          },
          "noOfCompetitorsInNearbyMarket": {
            "type": "integer",
            "title": "No of Competitors in Nearby Market"
          }
        }
      },
      "required": true
    },
    {
      "id": "customerLocationOfficeBusinessGeoTagLatitudeLongitude",
      "label": "Customer Location (Office / Business GEO Tag) (Latitude & Longitude)",
      "schema": {
        "type": "object",
        "properties": {
          "businessIncomeComputationMonthlyBasis": {
            "type": "number",
            "title": "Business Income Computation (Monthly Basis)"
          },
          "revenue": {
            "type": "string",
            "title": "Revenue"
          },
          "amountInRs": {
            "type": "number",
            "title": "Amount (in Rs)"
          },
          "expenditure": {
            "type": "string",
            "title": "Expenditure"
          },
          "amountInRs2": {
            "type": "number",
            "title": "Amount (in Rs)"
          }
        }
      },
      "required": true
    },
    {
      "id": "salesReceipts",
      "label": "Sales/Receipts",
      "schema": {
        "type": "object",
        "properties": {
          "purchases": {
            "type": "string",
            "title": "Purchases"
          },
          "rent": {
            "type": "number",
            "title": "Rent"
          },
          "electricity": {
            "type": "string",
            "title": "Electricity"
          },
          "transportation": {
            "type": "string",
            "title": "Transportation"
          }
        }
      },
      "required": true
    },
    {
      "id": "otherExpenses",
      "label": "Other Expenses",
      "schema": {
        "type": "object",
        "properties": {
          "totalMonthlyRevenueA": {
            "type": "string",
            "title": "Total Monthly Revenue (A)"
          },
          "totalMonthlyExpensesB": {
            "type": "string",
            "title": "Total Monthly Expenses (B)"
          }
        }
      },
      "required": true
    },
    {
      "id": "otherMonthlyIncome",
      "label": "Other Monthly Income",
      "schema": {
        "type": "object",
        "properties": {
          "rentalIncome": {
            "type": "number",
            "title": "Rental Income"
          },
          "cashAmount": {
            "type": "number",
            "title": "cash amount"
          },
          "chqAmount": {
            "type": "number",
            "title": "chq amount"
          },
          "incentivesPerks": {
            "type": "string",
            "title": "Incentives/Perks"
          },
          "cashAmount2": {
            "type": "number",
            "title": "cash amount"
          },
          "chqAmount2": {
            "type": "number",
            "title": "chq amount"
          },
          "monthlyBonus": {
            "type": "string",
            "title": "Monthly Bonus"
          },
          "cashAmount3": {
            "type": "number",
            "title": "cash amount"
          },
          "chqAmount3": {
            "type": "number",
            "title": "chq amount"
          }
        }
      },
      "required": true
    },
    {
      "id": "anyOther",
      "label": "Any Other",
      "schema": {
        "type": "object",
        "properties": {
          "cashAmount": {
            "type": "number",
            "title": "cash amount"
          },
          "chqAmount": {
            "type": "number",
            "title": "chq amount"
          }
        }
      },
      "required": true
    },
    {
      "id": "purposeOfLoan",
      "label": "Purpose of Loan",
      "schema": {
        "type": "object",
        "properties": {
          "flatPurchase": {
            "type": "string",
            "title": "Flat Purchase"
          },
          "housePurchase": {
            "type": "string",
            "title": "House Purchase"
          },
          "plotPurchase": {
            "type": "string",
            "title": "Plot Purchase"
          },
          "constructionOfResidentialHouseProperty": {
            "type": "string",
            "title": "Construction of Residential House Property"
          },
          "businessDevelopment": {
            "type": "string",
            "title": "Business development"
          },
          "improvementExtension": {
            "type": "string",
            "title": "Improvement/Extension"
          },
          "balanceTransfer": {
            "type": "number",
            "title": "Balance Transfer"
          },
          "plotConstruction": {
            "type": "string",
            "title": "Plot + Construction"
          }
        }
      },
      "required": true
    },
    {
      "id": "minimumLoanAmountRequiredRs",
      "label": "Minimum Loan Amount Required (Rs.)",
      "schema": {
        "type": "object",
        "properties": {
          "tenureRequiredYears": {
            "type": "integer",
            "title": "Tenure Required (years)"
          },
          "monthlyHouseholdExpensesRs": {
            "type": "string",
            "title": "Monthly Household Expenses (Rs.)"
          },
          "comfortableEmiRs": {
            "type": "number",
            "title": "Comfortable EMI (Rs.)"
          }
        }
      },
      "required": true
    },
    {
      "id": "collateralDetails",
      "label": "Collateral Details",
      "schema": {
        "type": "object",
        "properties": {
          "statusOfPropertyToBePurchasedReadyToMoveUnderConstructionConstructionYetToStart": {
            "type": "string",
            "title": "Status of Property to be Purchased (Ready to move / Under Construction / Construction Yet to Start)"
          }
        }
      },
      "required": true
    },
    {
      "id": "propertyAddress",
      "label": "Property Address",
      "schema": {
        "type": "object",
        "properties": {
          "areaInSqFt": {
            "type": "string",
            "title": "Area (in Sq. ft.)"
          }
        }
      },
      "required": true
    },
    {
      "id": "agreementValue",
      "label": "Agreement value",
      "schema": {
        "type": "object",
        "properties": {
          "ownContributionRs": {
            "type": "string",
            "title": "Own Contribution (Rs.)"
          }
        }
      },
      "required": true
    },
    {
      "id": "loanType",
      "label": "Loan Type",
      "schema": {
        "type": "object",
        "properties": {
          "sanctionAmt": {
            "type": "string",
            "title": "Sanction Amt."
          },
          "emi": {
            "type": "number",
            "title": "EMI"
          },
          "noOfEmiPaid": {
            "type": "number",
            "title": "No. of EMI Paid"
          },
          "balTenure": {
            "type": "integer",
            "title": "Bal. Tenure"
          }
        }
      },
      "required": true
    },
    {
      "id": "costAndFundsInformationLoanDetails",
      "label": "Cost and Funds Information (Loan Details)",
      "schema": {
        "type": "object",
        "properties": {
          "fundsRequiredRs": {
            "type": "string",
            "title": "Funds Required (Rs.)"
          },
          "sourceOfOwnFundsOcr": {
            "type": "string",
            "title": "Source of Own Funds (OCR)"
          },
          "purchaseCost": {
            "type": "number",
            "title": "Purchase Cost"
          },
          "savings": {
            "type": "string",
            "title": "Savings"
          },
          "constructionEstimate": {
            "type": "string",
            "title": "Construction Estimate"
          },
          "totalTransactionCostTotalOfAllTheAboveCost": {
            "type": "number",
            "title": "Total Transaction Cost (Total of all the above cost)"
          }
        }
      },
      "required": true
    },
    {
      "id": "bankName",
      "label": "Bank Name",
      "schema": {
        "type": "object",
        "properties": {
          "accountNo": {
            "type": "integer",
            "title": "Account no."
          },
          "branch": {
            "type": "string",
            "title": "Branch"
          },
          "accountType": {
            "type": "string",
            "title": "Account Type"
          },
          "operationSinceYrs": {
            "type": "string",
            "title": "Operation since (Yrs)"
          }
        }
      },
      "required": true
    },
    {
      "id": "otherFamilyMemberDetails",
      "label": "Other Family Member Details",
      "schema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "title": "Name"
          },
          "relationWithApplicant": {
            "type": "string",
            "title": "Relation with Applicant"
          },
          "ageYears": {
            "type": "integer",
            "title": "Age (years)"
          },
          "occupationJobBusiness": {
            "type": "string",
            "title": "Occupation (Job / Business)"
          },
          "educationalQualificationAlsoMentionIfGovtOrPrivateInstitution": {
            "type": "string",
            "title": "Educational Qualification (Also mention if Govt. or Private institution)"
          },
          "contactNo": {
            "type": "string",
            "title": "Contact no",
            "pattern": "^[0-9]{10}$"
          },
          "stayingWithApplicantYesNo": {
            "type": "integer",
            "title": "Staying with Applicant (Yes/No)"
          }
        }
      },
      "required": true
    },
    {
      "id": "referencesBusinessParties",
      "label": "References (Business Parties)",
      "schema": {
        "type": "object",
        "properties": {
          "reference1": {
            "type": "string",
            "title": "Reference 1"
          },
          "name": {
            "type": "string",
            "title": "Name"
          }
        }
      },
      "required": true
    },
    {
      "id": "address",
      "label": "Address",
      "schema": {
        "type": "object",
        "properties": {
          "relationship": {
            "type": "string",
            "title": "Relationship"
          },
          "contactNumber": {
            "type": "string",
            "title": "Contact Number",
            "pattern": "^[0-9]{10}$"
          }
        }
      },
      "required": true
    },
    {
      "id": "emailAddress",
      "label": "Email address",
      "schema": {
        "type": "object",
        "properties": {
          "noOfYearKnownTheApplicant": {
            "type": "integer",
            "title": "No of Year known the applicant"
          },
          "reference2": {
            "type": "string",
            "title": "Reference 2"
          },
          "name": {
            "type": "string",
            "title": "Name"
          }
        }
      },
      "required": true
    },
    {
      "id": "address",
      "label": "Address",
      "schema": {
        "type": "object",
        "properties": {
          "relationship": {
            "type": "string",
            "title": "Relationship"
          },
          "contactNumber": {
            "type": "string",
            "title": "Contact Number",
            "pattern": "^[0-9]{10}$"
          }
        }
      },
      "required": true
    },
    {
      "id": "emailAddress",
      "label": "Email address",
      "schema": {
        "type": "object",
        "properties": {
          "noOfYearKnownTheApplicant": {
            "type": "integer",
            "title": "No of Year known the applicant"
          }
        }
      },
      "required": true
    },
    {
      "id": "tpcThirdPartyCheckDetails",
      "label": "TPC (Third Party check) Details",
      "schema": {
        "type": "object",
        "properties": {
          "businessReference": {
            "type": "string",
            "title": "Business Reference"
          },
          "name": {
            "type": "string",
            "title": "Name"
          }
        }
      },
      "required": true
    },
    {
      "id": "address",
      "label": "Address",
      "schema": {
        "type": "object",
        "properties": {
          "mobileNo": {
            "type": "string",
            "title": "Mobile No.",
            "pattern": "^[0-9]{10}$"
          },
          "knowingSinceMonthsYears": {
            "type": "integer",
            "title": "Knowing since (Months / Years)"
          },
          "feedbackPositiveNegative": {
            "type": "string",
            "title": "Feedback (Positive / Negative)"
          },
          "toBeFilledByPdOfficer": {
            "type": "string",
            "title": "To be filled by PD officer"
          }
        }
      },
      "required": true
    },
    {
      "id": "caseWeakness",
      "label": "Case Weakness",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfPdOfficer": {
            "type": "string",
            "title": "Name of PD Officer"
          }
        }
      },
      "required": true
    },
    {
      "id": "dateTimeOfVisit",
      "label": "Date & Time of Visit",
      "schema": {
        "type": "object",
        "properties": {
          "signatureOfThePdOfficer": {
            "type": "string",
            "title": "Signature of the PD Officer"
          },
          "pdStatusPositiveNegativeCreditRefer": {
            "type": "string",
            "title": "PD Status (Positive / Negative / Credit Refer)"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default indiaShelterSenpSchema;
