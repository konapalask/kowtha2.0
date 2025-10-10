export interface RBLInterface {
  netWorth: {
    netWorth: {
      ownerName: string;
      typeOfProperty: string;
      yearsOfOwnership: number;
      approxMarketValue: string;
    }[];
  };

  caseDetails: {
    contactNo: string;
    personMet: string;
    coApplicant: string;
    addressVisited: string;
    typeOfBorrower: string;
    nameOfApplicant: string;
    referenceNumber: string;
  };

  particulars: {
    coordinates: string;
  };

  loansDetails: {
    loansDetails: {
      emi: number;
      pos: string;
      product: string;
      remarks: string;
      loanAmount: number;
      nameOfBankInstitution: string;
    }[];
  };

  familyDetails: {
    aboutApplicant: string;
    aboutCoApplicant: string;
    andTheirFamilyDetails: string;
  };

  outputsSupply: {
    creditTerms: string;
    marketForOutput: string;
    modeOfMarketing: string;
    typeOfCustomers: string;
    stockOfFinishedGoods: string;
  };

  uploadedItems: {
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

  businessDetails: {
    margins: string;
    gstNumber: string;
    legalName: string;
    tradeName: string;
    shopAddress: string;
    businessName: string;
    typeOfEntity: string;
    establishment: string;
    godownAddress: string;
    lastGSTReturn: string;
    shopOwnership: string;
    productDetails: string;
    businessProcess: string;
    godownOwnership: string;
    activityObserved: string;
    natureOfBusiness: string;
    documentsObserved: string;
  };

  employeeDetails: {
    pfEsiApplied: string;
    noOfEmployees: number;
    salaryDetails: number;
  };

  inputsPurchases: {
    orderCycle: string;
    creditTerms: string;
    avgOrderQnty: number;
    otherRemarks: string;
    detailsOfInputs: string;
    purchaseDetails: string;
  };

  // ownContributions: {
  //   ownContributions: {
  //     remarks: string;
  //     particulars: string;
  //   }[];
  // };

  businessOwnerDetails: {
    businessOwnerDetails: {
      age: number;
      name: string;
      remarks: string;
      relation: string;
      occupation: string;
      qualification: string;
    }[];
  };

  otherSourcesOfIncome: {
    otherSourcesOfIncome: {
      details: string;
      sourceOfIncome: string;
    }[];
  };

  tradeReferencesCustomers: {
    customers: {
      contactDetails: string;
      nameOfCustomer: string;
    }[];
  };

  tradeReferencesSuppliers: {
    suppliers: {
      contactDetails: string;
      nameOfSuppliers: string;
    }[];
  };

  applicantsMainBankingDetails: {
    endUse: string;
    bankingDetails: {
      remarks: string;
      bankName: string;
      noOfYear: number;
      accountType: string;
      limitOfCCOD: string;
      accountHolderName: string;
    }[];
  };
}
