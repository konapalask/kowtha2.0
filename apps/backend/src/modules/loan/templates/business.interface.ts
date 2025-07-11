export interface BusinessVerificationData {
    basicDetails?: {
      aadhar: string;
      panNumber: string;
      personMet: string;
      personMetRelation: string;
      businessName: string;
      applicantName: string;
      isAddressSame: string;
      businessAddress: string;
      businessAddress2: string;
      personMetName: string;
      addressCorrection: string;
      isBusinessNameSame: string;
      correctedBusinessName: string;
      businessProfile: string;
    };
    miscellaneous?: {
      stockSeen: string;
      rentalAmount: string;
      employeesSeen: string;
      businessActivity: string;
      otherSetupObserved: string;
      ownershipOfPremises: string;
      illegalSetupObserved: string;
      politicallyConnected: string;
      businessActivityOther: string;
      privateFinanceOrChits: string;
      yearsInCurrentPremises: string;
      areaOfPremises: string;
      localityOfBusiness: string;
      employeesUnderApplicant: string;
      
    };
    uploadedItems?: Array<{
      id: string;
      uri: string;
      type: string;
      timestamp: string;
      s3ImageUrl: string;
    }>;
    thirdPartyCheck?: {
      checks: Array<{
        tpcName: string;
        relationship: string;
        comments: string;
        feedbackStatus: string;
        mobileNumber: string;
      }>;
    };
    businessDetails?: {
      geoTag: string;
      constitution: string;
      nameBoardSeen: string;
      totalExperience: string;
      nameBoardMatched: string;
      isBusinessSeasonal: string;
      businessStartYear: string;
      constitutionOther: string;
      isAddressTraceable: string;
    };
    existingLoans?: {
      loans: Array<{
        emi: string;
        tenure: string;
        purpose: string;
        bankName: string;
        loanAmount: string;
      }>;
    };
  }