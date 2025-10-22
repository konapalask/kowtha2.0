export interface HeroHousingSalariedInterface {
  generalLoanVisitDetails: {
    loanAccountNo: string;
    nameOfCustomer: string;
    personMetInPd: string;
    relationshipWithCustomer: string;
    reasonIfCustomerNotAvailableDuringVisit?: string;
    pdVisitDateAndTime: string;
    pdAddress?: string;
    latLongOfOfficeAddress: string;
    requestedLoanAmount: number;
  };
  profileOfCustomer: {
    borrowerDetails: string;
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
  };
  currentJobProfile: {
    nameOfEmployer: string;
    workingSince: string;
    typeOfEmployment: string;
    designation: string;
    jobProfile: string;
    reportingTo: string;
  };
  detailsOfEmployer: {
    currentBusinessName: string;
    constitution: string;
    natureOfBusinessProductOrServices: string;
    runningSince: string;
    detailsOfPartnersDirectorsShareholdersWithFamilyBackground: string;
    noOfEmployeesAndSetupOfBusiness: string;
    quantumOfStock: string;
    noOfMachineryAndAssetsSeen: string;
    localityDetailsCompetitorsOverallProspectOfLocationAnyNegativeFeedback: string;
  };
  propertyDetails: {
    whetherCustomerVisitedTheProperty: string;
    typeOfPropertyReadyPlotSelfConstructionUnderConstructionVacant: string;
    occupiedByWhomAndReasonIfNotSelfOccupied: string;
    sourceOfPropertyPurchaseThroughDealerBuilderReferenceRelative: string;
    nameOfSellerRelationshipWithCustomer: string;
    typeOfPropertyStructureArea: string;
    actualDealValueSaleDeedValue: string;
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
  };
  documentVerificationOtherChecks: {
    payrollRegisterAndAttendanceRegisterVerification: string;
    thirdPartyCheck: string;
    familyRelationshipCheckWithEmployer: string;
    checkQrCodesLicensesPermitsNameBoardContactNumberBelongingToEmployer: string;
    googleCheckAnyNegativeObservationsFeedbackDedupeMatch: string;
  };
}
