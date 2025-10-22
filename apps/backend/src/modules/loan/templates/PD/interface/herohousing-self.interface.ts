export interface HeroHousingSelfEmployedInterface {
  generalLoanVisitDetails: {
    loanAccountNo: string;
    nameOfCustomer: string;
    personMetInPd: string;
    relationshipWithCustomer: string;
    reasonIfCustomerNotAvailableDuringVisit?: string;
    pdVisitDateAndTime: string;
    pdAddress: string;
    latOfOfficeAddress: string;
    longOfOfficeAddress: string;
    requestedLoanAmount: number;
  };

  borrowerDetails: {
    qualificationAndProfessionalJourney: string;
  };

  familyDetails: {
    familyDetails: {
      name: string;
      relationshipWithApplicant: string;
      age: number;
      qualification: string;
      occupation: string;
      incomeDetailsDependent: string;
  }[];  
}

  currentBusinessDetails: {
    currentBusinessName: string;
    constitution: string;
    natureOfBusiness: string;
    runningSince: string;
    detailspartnersDirectorsShareholdersWithFamilyBackground: string;
  };

  detailsOfBusinessPremises: {
    addressOfBusinessPremises: string;
    ownershipOfAllAboveBusinessPremises: string;
    sizeAreaOfBusinessPremises: string;
    commentOnBusinessOperationsFootfallOfCustomerStock: string;
  };

  detailsaboutbusinessdetails: {
    briefAboutTheProductServicesDealing: string;
    noOfEmployeeAndSalaryDetails: string;
    quantumOfStock: string;
    noOfMachineryAndAssetsSeen: string;
    turnoverOfLastThreeYears: string;
    productServiceGrossMarginRatio: string;
    productServiceNetMarginRatio: string;
    anyExpansionOrNewProductServices: string;
    briefAboutTheLocalityOfBusiness: string;
  };

  detailsOfSupplierAndCustomer: {
    briefAboutSupplierAndCustomer: string;
    noOfTotalSuppliersAndCustomers: number;
    noOfTotalCustomers: number;
    billingPeriodAndReceiptMode: string;
    totalDebtorsAndCreditors: string;
    referenceOfMin2SuppliersAnd2Customers: string;
  };

  detailsOfProperty: {
    whetherCustomerVisitedTheProperty: string;
    typeOfProperty: string;
    propertyIsOccupiedByWhom: string;
    sourceOfPropertyPurchase: string;
    nameOfSellerAndRelationshipWithCustomer: string;
    typeOfPropertyAndStructureArea: string;
    actualDealValueAndSaleDeedValue: string;
    whetherSellerIsHavingAnyLoanOnTheProperty: number;
    whenSellerBoughtTheProperty: string;
  };

  investmentAndProperties: {
    customerInvestmentHabitsAndMonthlySavings: string;
    currentResidenceOwnership: string;
    detailsOfAssetsBuiltTillDate: string;
  };

  endUseOfPropertyFund: {
    endUseOfProperty: string;
    detailedEndUseOfFundInLapCases: string;
  };

  detailsOfLoans: {
    checkAndProvideDetailsOfLoanPresentlyServicing: string;
    repaymentAccountDetails: string;
    endUseOfFundsForPastLoans: string;
    checkIfAnyHomeLoanLap: string;
    anyBouncingInLoans: string;
  };

  bankingDetails: {
    allBankAccountsDetailsOpeningDate: string;
    savingsAccountDetails: string;
    percentageOfTotalReceiptRoutedThroughBanking: number;
  };

  documentVerificationOtherChecks: {
    relevantSalePurchaseRegisterBillsKutchaRecordsAndInventory: string;
    thirdPartyCheck: string;
    otherPersonOrFamilyMemberInvolvedInTheBusiness: string;
    checkQrCodesLicensesPermitsNameBoardContactNumberBelongingToEmployer: string;
    googleCheckAnyNegativeObservationsFeedbackDedupeMatch: string;
  };

  finalPDStaus: {
    finalPDStatus: string;
  };

  incomeAssessmentDetails: {
    salesReceiptsMonthlyAverage: {
      amount: number;
      comments?: string;
    };
    otherIncome: {
      amount: number;
      comments?: string;
    };
    totalMonthlyIncome: {
      amount: number;
      comments?: string;
    };
    costOfMaterialService: {
      amount: number;
      comments?: string;
    };
    directExpenses: {
      amount: number;
      comments?: string;
    };
    salary: {
      amount: number;
      comments?: string;
    };
    rent: {
      amount: number;
      comments?: string;
    };
    electricity: {
      amount: number;
      comments?: string;
    };
    otherMiscellaneousExpenses: {
      amount: number;
      comments?: string;
    };
    otherFamilyExpenses: {
      amount: number;
      comments?: string;
    };
    netMonthlyAppraisalIncome: {
      amount: number;
      comments?: string;
    };
    monthlyObligationsEMIs: {
      amount: number;
      comments?: string;
    };
    netResidualIncome: {
      amount: number;
      comments?: string;
    };
  };
}
