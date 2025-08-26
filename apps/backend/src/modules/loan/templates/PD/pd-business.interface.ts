export interface PDBusinessVerificationData {
    basicDetails?: {
      aadhar: string;
      panNumber: string;
      businessName: string;
      applicantName: string;
      applicantNumber: string;
      businessAddress: string;
      bankName: string;
    };
    businessDetails?: {
      typeOfBusiness: string;
      numberOfEmployees: string;
      businessActivity: string;
      businessActivityOther: string;
      constitution: string;
      natureOfBusiness: string;
      stockSeen: string;
      businessStartYear: string;
      occupiedSince: string;
      netMargin: string;
      businessPremisesSize: string;
      rawMaterialSupply: string;
      supplierRelationDuration: string;
    };
    applicantDetails?: {
      currentAddress: string;
      assets: string;
      purposeOfLoan: string;
      personMet: string;
      educationQualification: string;
      incomeDetails: string;
      nameOfCoApplicant: string;
      relationWithApplicant: string;
      maritalStatus: string;
      houseSize: string;
      workExperience: string;
      purchase: string;
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
        comments: string;
        relationship: string;
        mobileNumber: string;
        feedbackStatus: string;
      }>;
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
    familyMemberDetails?:Array<{
      age: string;
      name: string;
      relation: string;
      otherRelation: string;
      employmentType: string;
      educationalQualification: string;
    }>;
  }