export interface CholaInterface {
  basicInformation: {
    nameOfTheApplicant: string;
    nameOfTheCoApplicant: string;
    businessName: string;
    constitution: string;
    visitedAddress: string;
    loanRequested: number;
    purposeOfLoan: string;
    dateOfVisit: string;
    personMet: string;
  };

  aboutTheApplicantAndItsBusiness: {
    aboutTheApplicant: string;
  };

  applicantsFamilyDetails: {
    familyMembers: {
      name: string;
      relation: string;
      age: number;
    }[];
  };

  assets: {
    assetDetails: string;
  }[];

  customersReferenceNumbers: {
    customerReferenceNumber: string;
  }[];

  otherIncomes: {
    otherIncome: string;
  }[];

  existingLoanDetails: {
    bankName: string;
    typeOfLoan: string;
    loanAmount: number;
    emiInterest: number;
    tenureTotalCompleted: string;
  }[];

  bankingDetails: {
    bankingDetails: {
      bankName: string;
      accountNo: string;
      accountType: string;
    }[];
  };

  itrFinancialDetails: {
    itr: string;
    receipts: string;
    verification: string;
    gpMarginAndExpenses: string;
  };

  comfortFactor: {
    comfortFactor: string;
  }[];

  discomfortFactor: {
    discomfortFactor: string;
  }[];

  Recommendations: {
    recommendations: string;
  }[];

  disclaimer: {
    disclaimer: string;
  };

  financialStatement: {
    expenditure: {
      toPurchaseOfMaterial: number;
      toElectricity: number;
      toRent: number;
      toSalaries: number;
      toTransportation: number;
      toOtherExpenses: number;
      toNetProfit: number;
      totalExpenditure: number;
    };
    income: {
      byGrossReceipts: number;
      totalIncome: number;
    };
  };

  financialAnalysis: {
    totalGrossDisposableIncome: number;
    totalObligations: number;
    netDisposableIncome: number;
  };
}
