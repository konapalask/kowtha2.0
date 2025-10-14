export interface NewTemplateInterface {
  // Case Details Section
  caseDetails?: {
    referenceNumber: string;
    nameOfApplicant: string;
    coApplicant: string;
    typeOfBorrower: string;
    addressVisited: string;
    personMet: string;
    contactNo: string;
    dateOfVisit: string;
  };

  // Business Owner Details
  businessOwnerDetails?: {
    businessOwnerDetails: {
      name: string;
      age: number;
      qualification: string;
      occupation: string;
      relation: string;
      remarks: string;
    }[];
  };

  // Family Details
  familyDetails?: {
    aboutApplicant: string;
    aboutCoApplicant: string;
  };

  // Business Details
  businessDetails?: {
    businessName: string;
    typeOfEntity: string;
    gstNumber: string;
    legalName: string;
    tradeName: string;
    lastGSTReturn: string;
    establishment: string;
    shopAddress: string;
    shopOwnership: string;
    godownAddress: string;
    godownOwnership: string;
    natureOfBusiness: string;
    productDetails: string;
    businessProcess: string;
    margins: string;
    documentsObserved: string;
    activityObserved: string;
  };

  // Inputs/Purchases
  inputsPurchases?: {
    detailsOfInputs: string;
    purchaseDetails: string;
    orderCycle: string;
    avgOrderQnty: number;
    creditTerms: string;
    otherRemarks: string;
  };

  // Outputs/Supply
  outputsSupply?: {
    marketForOutput: string;
    modeOfMarketing: string;
    typeOfCustomers: string;
    creditTerms: string;
    stockOfFinishedGoods: string;
  };

  // Employee Details
  employeeDetails?: {
    noOfEmployees: number;
    salaryDetails: number;
    pfEsiApplied: string;
  };

  // Trade References - Suppliers
  tradeReferencesSuppliers?: {
    suppliers: {
      nameOfSuppliers: string;
      contactDetails: string;
    }[];
  };

  // Trade References - Customers
  tradeReferencesCustomers?: {
    customers: {
      nameOfCustomer: string;
      contactDetails: string;
    }[];
  };

  // Other Sources of Income
  otherSourcesOfIncome?: {
    otherSourcesOfIncome: {
      sourceOfIncome: string;
      details: string;
    }[];
  };

  // Loan Details
  loansDetails?: {
    loansDetails: {
      nameOfBankInstitution: string;
      product: string;
      loanAmount: number;
      emi: number;
      pos: string;
      remarks: string;
    }[];
  };

  // Applicants Main Banking Details
  applicantsMainBankingDetails?: {
    bankingDetails: {
      bankName: string;
      accountHolderName: string;
      accountType: string;
      noOfYear: number;
      limitOfCCOD: string;
      remarks: string;
    }[];
    endUse: string;
  };

  // Own Contribution
  ownContributions?: {
    ownContributions: {
      particulars: string;
      remarks: string;
    }[];
  };

  // Net Worth
  netWorth?: {
    netWorth: {
      typeOfProperty: string;
      ownerName: string;
      yearsOfOwnership: number;
      approxMarketValue: string;
    }[];
  };

  // Particulars
  particulars?: {
    coordinates: string;
  };

  // Uploaded Items
  uploadedItems?: {
    id: string;
    uri: string;
    type: string;
    pincode: string;
    isCamera: boolean;
    latitude: number;
    locality: string;
    longitude: number;
    timestamp: string;
    s3ImageUrl: string;
    isOverlayNeeded: boolean;
  }[];
}
