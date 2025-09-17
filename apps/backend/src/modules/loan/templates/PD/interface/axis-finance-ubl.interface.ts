export interface AxisFinanceUBLVerificationDataData {
  reportDetails?: {
    region: string;
    location: string;
    branch: string;
    referenceNo: string; // Ref No/Application No
    applicantName: string;
    dateOfReport: string;
    concernName: string;
    constitution: string;
    initiatedAddress: string;
    visitedAddress: string;
    phoneNumber: string;
    appointmentFixed: string;
    structureOfLoan: string;
    numberOfVisits: string;
    personMet: string;
    visitedBy: string;
    aboutApplicant: string; // descriptive section
    residentialDetails: string;
    coApplicantDetails: string;
    familyDetails: string;
  };

  familyMembers?: Array<{
    name: string;
    relationWithApplicant: string;
    age: string;
    qualification: string;
    occupation: string;
    incomePerMonth: string;
    dependent: string;
  }>;

  shareholdingDetails?: Array<{
    shareholderName: string;
    relationWithApplicant: string;
    designation: string;
    shareholdingPercentage: string;
    includedInLoanStructure: string;
    functionOfPartnerOrDirector: string;
  }>;

  businessDetails?: {
    aboutBusiness: string;
    documentsObserved?: Array<{
      category: string;
      documentName: string;
      documentType: string;
      remarks: string;
    }>;
    suppliers?: {
      numberOfFixedSuppliers: string;
      creditPeriod: string;
      cashChequeProportion: string;
      topSuppliers?: Array<{
        name: string;
        contactDetails: string;
        location: string;
        referenceCheck: string;
      }>;
    };
    clients?: {
      numberOfFixedCustomers: string;
      creditPeriod: string;
      cashChequeProportion: string;
      topCustomers?: Array<{
        name: string;
        contactDetails: string;
        location: string;
        referenceCheck: string;
      }>;
    };
    averageStockMaintained: string;
    turnoverAndMargins: string;
    expenditure: string;
    salariesAndWages?: {
      numberOfEmployees: string;
      salaryPerEmployee: string;
      statusOfEmployees: string;
      numberOfLabours: string;
      wages: string;
      statusOfLabour: string;
    };
    remarks: string;
    workingHours: string;
    otherMajorExpenses: string;
  };

  assetDetails?: {
    immovableProperties?: Array<{
      address: string;
      areaMeasurements: string;
      purchaseCost: string;
      purchaseYear: string;
      marketValue: string;
      ownerName: string;
      mortgaged: string;
    }>;
    movableAssets?: {
      liquidMonetaryItems: string; // cash, gold, FD, MF, shares, bonds, etc.
      insuranceDetails: string; // Life, Mediclaim, Property insurance
      capitalInvested: string; // in business, loans & advances
      vehicles?: Array<{
        companyName: string;
        model: string;
      }>;
    };
    note: string; // amounts mentioned are approx
  };

  loanDetails?: Array<{
    bankOrNBFC: string;
    typeOfLoan: string;
    sanctionedAmount: string;
    outstandingBalance: string;
    emi: string;
    emiPaidBank: string;
    securedAgainst: string;
  }>;

  bankDetails?: Array<{
    bankName: string;
    branchName: string;
    accountType: string;
    openSinceYear: string;
  }>;

  endUseOfLoan?: {
    loanAmount: string;
    detailedEndUse: string;
  };

  thirdPartyCheck?: Array<{
    individualOrBusinessName: string;
    address: string;
    contactNumber: string;
    knowingSince: string;
    feedbackOnBorrower: string;
    feedbackOnBusiness: string;
    observation: string;
  }>;

  otherIncome?: string; // income apart from business
  siteCoordinates?: string;
  finalRemarks?: string;
  status?: string; // Credit Refer / Positive / Negative

  aflVerifier?: {
    name: string;
    employeeCode: string;
    signature: string;
  };
}
