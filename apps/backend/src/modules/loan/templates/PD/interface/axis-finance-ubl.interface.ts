export interface AxisFinanceUBLInterface {
  basicDetails?: {
    region?: string;
    location?: string;
    branch?: string;
    applicationNo?: string;
    dateOfReport?: string;
    customerName?: string;
    concernName?: string;
    constitution?: string;
    initiatedAddress?: string;
    visitedAddress?: string;
    phoneNumber?: string;
    appointmentFixed?: string;
    structureOfLoan?: string;
    numberOfVisits?: string;
    personMet?: string;
    visitedBy?: string;
    aboutApplicant?: string;
    residentialDetails?: string;
    coApplicantDetails?: string;
  };

  familyDetails?: Array<{
    name?: string;
    relation?: string;
    age?: string | number;
    qualification?: string;
    occupation?: string;
    stayingWithApplicant?: string;
    mobileNumber?: string;
    incomePerMonth?: number | string;
  }>;

  shareholdingDetails?: Array<{
    shareholderName?: string;
    relationWithMainApplicant?: string;
    designation?: string;
    shareholdingPercentage?: number | string;
    comingIntoLoanStructure?: string;
    functionalRole?: string;
  }>;

  businessOverview?: {
    aboutBusiness?: Array<{ detail?: string }>;
    documentsObserved?: Array<{
      documentName?: string;
      remarks?: string;
    }>;
  };

  suppliersCreditors?: {
    numberOfFixedSuppliers?: string;
    creditPeriodDays?: string;
    cashChequeProportion?: string;
    topSuppliers?: Array<{
      name?: string;
      contactDetails?: string;
      location?: string;
      referenceCheck?: string;
    }>;
  };

  clientsDebtors?: {
    numberOfFixedCustomers?: string;
    creditPeriodDays?: string;
    cashChequeProportion?: string;
    topCustomers?: Array<{
      name?: string;
      contactDetails?: string;
      location?: string;
      referenceCheck?: string;
    }>;
    averageStockMaintained?: string;
    turnoverAndMargins?: string;
  };

  expenditure?: {
    salariesAndWages?: Array<{
      noOfEmployees?: string;
      salaryPerMonthPerEmployee?: string;
      statusOfEmployee?: string;
      noOfLabours?: string;
      wagesPerMonthOrDay?: string;
      statusOfLabour?: string;
      remarks?: string;
    }>;
    workingHours?: string;
    otherMajorExpensesAndBasis?: string;
  };

  assetDetails?: {
    immovableProperties?: Array<{
      address?: string;
      areaMeasurements?: string;
      purchaseCostLakhs?: number | string;
      purchaseYear?: string;
      marketValueLakhs?: number | string;
      ownerName?: string;
      mortgaged?: string;
    }>;
    liquidMoveableAssets?: string;
    insurances?: string;
    capitalInvestedLoans?: string;
    vehicles?: Array<string>;
  };

  existingLoans?: Array<{
    bankOrNbfcName?: string;
    typeOfLoan?: string;
    sanctionedAmount?: number | string;
    outstandingBalance?: number | string;
    emiAmount?: number | string;
    emiPaidBank?: string;
    securedAgainstAsset?: string;
  }>;

  bankingDetails?: Array<{
    bankName?: string;
    branchName?: string;
    accountType?: string;
    openSinceYear?: string;
  }>;

  thirdPartyCheck?: {
    references?: Array<{
      name?: string;
      address?: string;
      contactNo?: string;
      knowingSince?: string;
      feedbackOnBorrower?: string;
      feedbackOnBusiness?: string;
    }>;
    otherIncome?: string;
    siteCoordinates?: string;
    observations?: Array<string>;
    remarks?: string;
    verifierNameEmpCode?: string;
    verifierSignature?: string;
    status?: string;
  };

  financialSummary?: {
    totalGrossDisposableIncome?: number | string;
    totalObligations?: number | string;
    netDisposableIncome?: number | string;
    note?: string;
  };

  recommendations?: {
    recommendations?: Array<string>;
    disclaimer?: string;
  };

  [key: string]: any;
}
