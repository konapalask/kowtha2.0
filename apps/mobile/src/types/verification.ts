export type VerificationItem = {
  id: string;
  name: string;
  description: string;
};

export type UploadedItem = {
  id: string;
  uri: string;
  type: string;
  timestamp: string;
};

export type BasicDetailsFormData = {
  verificationType: string;
  verificationDate: string;
  verificationTime: string;
  verificationMode: string;
  verificationStatus: string;
  verificationRemarks: string;
};

export type ApplicantInformationFormData = {
  applicantName: string;
  applicantAge: string;
  applicantGender: string;
  applicantMaritalStatus: string;
  applicantEducation: string;
};

export type AddressVerificationFormData = {
  addressType: string;
  addressCategory: string;
  addressSubCategory: string;
  addressDetails: string;
  geoTag: string;
};

export type ResidenceDetailsFormData = {
  residenceStatus: string;
  rentDetails: string;
  residenceType: string;
  constructionQuality: string;
  standardOfLiving: string;
  locationCategory: string;
  localityType: string;
  accessibility: string;
  houseArea: string;
  yearsAtCurrentAddress: string;
  nameplateVisible: string;
  // politicalSymbolVisible: string;
};

export type FamilyEmploymentDetailsFormData = {
  totalFamilyMembers: string;
  earningMembers: string;
  dependents: string;
  isSpouseWorking: string;
  spouseEmploymentDetails: string;
  assetsObserved: string;
};

export type ThirdPartyCheckFormData = {
  tpcName: string;
  relationship: string;
  feedbackStatus: string;
  comments: string;
};

export type FinalObservationsFormData = {
  cooperativeness: string;
  overallStatus: string;
  remarks: string;
};

// Add types for other sections as they are disclosed
export type Section2FormData = {};
export type Section3FormData = {};
export type Section4FormData = {};
export type Section5FormData = {};
export type Section6FormData = {};
export type Section7FormData = {};
export type Section8FormData = {};

export type VerificationFormData = {
  basicDetails: BasicDetailsFormData;
  applicantInformation: ApplicantInformationFormData;
  addressVerification: AddressVerificationFormData;
  residenceDetails: ResidenceDetailsFormData;
  familyEmploymentDetails: FamilyEmploymentDetailsFormData;
  thirdPartyCheck: ThirdPartyCheckFormData;
  finalObservations: FinalObservationsFormData;
  section8: Record<string, any>;
  uploadedItems: UploadedItem[];
};
