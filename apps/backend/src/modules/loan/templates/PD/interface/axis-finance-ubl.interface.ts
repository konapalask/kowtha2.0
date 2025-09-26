export interface AxisFinanceUBLInterface {
  assetDetails: {
    assets: {
      address: string;
      mortgaged: string;
      ownerName: string;
      marketValue: string;
      areaMeasured: string;
      purchaseCost: string;
      purchaseYear: string;
    }[];
    status: string;
    remarks: string;
    vehicles: string;
    otherIncome: string;
    observations: string;
    siteCoordinates: string;
    lifeInsuranceMediclaim: string;
    capitalInvestedBusiness: string;
    liquidMoveableMonetaryItems: string;
  };
  basicDetails: {
    phoneNo: string;
    noOfVisit: string;
    personMet: string;
    region: string;
    location: string;
    branch: string;
    constitution: string;
    applicantName: string;
    nameOfConcern: string;
    aboutApplicant: string;
    visitedAddress: string;
    structureOfLoan: string;
    appointmentFixed: string;
    initiatedAddress: string;
    coApplicantDetails: string;
    residentialDetails: string;
  };
  existingLoans: {
    loans: {
      emi: string;
      tenure: string;
      purpose: string;
      bankName: string;
      loanAmount: string;
    }[];
  };
  familyDetails: {
    age: string;
    name: string;
    relation: string;
    mobileNumber: string;
    otherRelation: string;
    employmentType: string;
    stayingWithApplicant: string;
    educationalQualification: string;
  }[];
  salariesWages: {
    remarks: string;
    statusOfLabour: string;
    numberOfLabours: string;
    workingHoursEnd: string;
    statusOfEmployee: string;
    numberOfEmployees: string;
    workingHoursStart: string;
    wagesPerMonthPerDay: string;
    otherMajorExpenditure: string;
    salaryPerMonthPerEmployee: string;
  };
  clientsDebtors: {
    turnover: string;
    customers: {
      name: string;
      phone: string;
      review: string;
      location: string;
    }[];
    netMargins: string;
    creditPeriod: string;
    cashChequeProportions: string;
    numberOfFixedCustomers: string;
    averageStockMaintenance: string;
  };
  thirdPartyCheck: {
    checks: {
      tpcName: string;
      comments: string;
      mobileNumber: string;
      relationship: string;
      otherRelation: string;
      feedbackStatus: string;
    }[];
  };
  additionalDetails: {
    details: {
      value: string;
    }[];
  };
  suppliersCreditors: {
    suppliers: {
      name: string;
      phone: string;
      review: string;
      location: string;
    }[];
    creditPeriod: string;
    cashChequeProportions: string;
    numberOfFixedSuppliers: string;
  };
  shareholdingDetails: {
    shareholders: {
      name: string;
      designation: string;
      shareholdingPercentage: string;
      comingIntoLoanStructure: string;
      relationshipWithApplicant: string;
      functionalOfPartnerDirector: string;
    }[];
  };
  uploadedItems: {
    id: string;
    uri: string;
    type: string;
    timestamp: string;
  }[];
}
