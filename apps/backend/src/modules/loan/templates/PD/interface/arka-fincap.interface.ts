export interface ArkafincapInterface {
  applicantDetails: {
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
  familyMembers: {
    familyMembers: {
      name: string;
      relationship: string;
      age: number;
      education: string;
      occupation: string;
    }[];
  };
  bankingDetails: {
    bankingDetails: {
      bankName: string;
      accountType: string;
      avgBalance: number;
      noOfYearsMaintained: number;
    }[];
  };
  licMutualFunds: {
    licMutualFunds: string;
  };
  assets: {
    assets: {
      description: string;
      area: string;
      marketValue: number;
      nameOfAssetHolder: string;
    }[];
  };
  existingLoans: {
    loans: {
      bank: string;
      type: string;
      loanAmount: number;
      emi: number;
      status: string;
    }[];
  };
  aboutTheBusiness: string[];
  regularCustomers: {
    customers: {
      name: string;
      contactNumber: number;
    }[];
  };
  regularSuppliers: {
    suppliers: {
      name: string;
      contactNumber: number;
    }[];
  };
  businessActivityObserved: {
    businessActivityAndStockLevelObserved: string;
  };
  documentsObserved: {
    documentsObserved: string;
  };
  gstRegistration: {
    gstRegistered: string;
  };
  itrDetails: {
    itrFiled: string;
  };
  monthlyGrossReceipts: {
    monthlyGrossReceipts: number;
  };
  monthlyExpenses: {
    monthlyExpenses: number;
  };
  netProfit: {
    netProfit: number;
  };
  netMargin: {
    netMargin: number;
  };
  familyExpenses: {
    familyExpenses: string;
  };
  employees: {
    numberOfEmployees: number;
  };
  concerns: string[];
  otherObservations: string[];
  otherIncomes: string[];
  neighborCheck: {
    neighborCheck: string;
  };
  status: {
    status: string;
  };
  photos: {
    photos: string;
  };
}