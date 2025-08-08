export interface VerificationData {
      basicDetails?: {
        aadhar: string;
        category: string;
        panNumber: string;
        applicantName: string;
        categoryOther: string;
        verificationType: string;
        applicationNumber: string;
        availablePersonName: string;
        isApplicantAvailable: string;
        availablePersonMobile: string;
        applicantMaritalStatus: string;
        educationQualification: string;
        availablePersonRelation: string;
        applicantMaritalStatusOther: string;
        availablePersonRelationOther: string;
      };
      residenceDetails?: {
        houseArea: string;
        rentDetails: string;
        leaseAmount: string;
        accessibility: string;
        residenceType: string;
        residenceStatus: string;
        standardOfLiving: string;
        specifyResidenceType: string;
        yearsAtCurrentAddress: string;
        politicalSymbolVisible: string;
      };
      familyEmploymentDetails?: {
        dependents: string;
        assetsObserved: string;
        earningMembers: string;
        isSpouseWorking: string;
        totalFamilyMembers: string;
        spouseEmploymentDetails: string;
      };
      familyMemberDetails?:Array<{
        age: string;
        name: string;
        relation: string;
        mobileNumber: string;
        otherRelation: string;
        employmentType: string;
        stayingWithApplicant: string;
        educationalQualification: string;
      }>;
      thirdPartyCheck?: {
        checks: Array<{
          tpcName: string;
          comments: string;
          mobileNumber: string;
          relationship: string;
          feedbackStatus: string;
        }>;
      };
      addressVerification?: {
        geoTag: string;
        address: string;
        addressProof: string;
        previousCity: string;
        addressDetails: string;
        addressCategory: string;
        addressMismatch: string;
        previousAddress: string;
        reasonForChange: string;
        previousAddressYears: string;
        addressCorrectionDetails: string;
        numberOfYearsAtCurrentCity: string;
        numberOfYearsAtPreviousCity: string;
        numberOfYearsAtCurrentResidence: string;
      };
      uploadedItems?: Array<{
        id: string;
        uri: string;
        type: string;
        pincode: string;
        isCamera: string;
        latitude: string;
        locality: string;
        longitude: string;
        timestamp: string;
        s3ImageUrl: string;
        isOverlayNeeded: string;
      }>;
}