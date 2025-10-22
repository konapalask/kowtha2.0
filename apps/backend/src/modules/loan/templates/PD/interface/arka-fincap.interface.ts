export interface ArkaFincapInterface {
  // Applicant Details Section
  applicantDetails?: {
    applicationNo: string;
    nameOfApplicant: string;
    nameOfCoApplicant: string;
    phoneNumber: number;
    nameOfConcern: string;
    initiatedPremises: string;
    visitedPremises: string;
    residentialPremises: string;
    appointmentFixed: string;
    dateOfVisit: string;
    personMet: string;
    amountAndPurposeOfLoan: string;
    typeOfCollateral: string;
    marketValueOfCollateral: string;
    collateralPropertyAddress: string;
    aboutTheApplicant: string;
  };

  // Family Members Section
  familyMembers?: {
    familyMembers: {
      name: string;
      relationship: string;
      age: number;
      education: string;
      occupation: string;
    }[];
  };

  // Banking Details Section
  bankingDetails?: {
    bankingDetails: {
      bankName: string;
      accountType: string;
      avgBalance: number;
      noOfYearsMaintained: number;
    }[];
  };

  // LIC/Mutual Funds Section
  licMutualFunds?: {
    licMutualFunds: string;
  };

  // Assets Section
  assets?: {
    assets: {
      description: string;
      area: string;
      marketValue: number;
      nameOfAssetHolder: string;
    }[];
  };

  // Existing Loans Section
  existingLoans?: {
    loans: {
      bank: string;
      type: string;
      loanAmount: number;
      emi: number;
      status: string;
    }[];
  };

  // About the Business Section
  aboutTheBusiness?: string[];

  // Regular Customers Section
  regularCustomers?: {
    customers: {
      name: string;
      contactNumber: number;
    }[];
  };

  // Regular Suppliers Section
  regularSuppliers?: {
    suppliers: {
      name: string;
      contactNumber: number;
    }[];
  };

  // Business Activity Observed Section
  businessActivityObserved?: {
    businessActivityAndStockLevelObserved: string;
  };

  // Documents Observed Section
  documentsObserved?: {
    documentsObserved: string;
  };

  // GST Registration Section
  gstRegistration?: {
    gstRegistered: string;
  };

  // ITR Details Section
  itrDetails?: {
    itrFiled: string;
  };

  // Monthly Gross Receipts Section
  monthlyGrossReceipts?: {
    monthlyGrossReceipts: number;
  };

  // Monthly Expenses Section
  monthlyExpenses?: {
    monthlyExpenses: number;
  };

  // Net Profit Section
  netProfit?: {
    netProfit: number;
  };

  // Net Margin Section
  netMargin?: {
    netMargin: number;
  };

  // Family Expenses Section
  familyExpenses?: {
    familyExpenses: string;
  };

  // Employees Section
  employees?: {
    numberOfEmployees: number;
  };

  // Concerns Section
  concerns?: string[];

  // Other Observations Section
  otherObservations?: string[];

  // Other Incomes Section
  otherIncomes?: string[];

  // Neighbor Check Section
  neighborCheck?: {
    neighborCheck: string;
  };

  // Status Section
  status?: {
    status: string;
  };

  // Uploaded Items Section
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

