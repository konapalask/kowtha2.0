export type VerificationItem = {
  id: string;
  name: string;
  applicationNumber: string;
  description: string;
  address: string;
  verificationId: string;
};

export type UploadedItem = {
  id: string;
  uri: string;
  s3ImageUrl?: string;
  type: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  locality?: string;
  pincode?: string;
  isCamera?: boolean;
};

export interface BasicDetailsFormData {
  verificationType: string;
  applicationNumber: string;
  applicantName: string;
  applicantMaritalStatus: string;
  applicantMaritalStatusOther: string;
  educationQualification: string;
  category: string;
  categoryOther: string;
  isApplicantAvailable: string;
  availablePersonName: string;
  availablePersonMobile: string;
  availablePersonRelation: string;
  availablePersonRelationOther: string;
  aadhar: string;
  panNumber: string;
  loanAmount: string;
  tenure: string;
  purposeOfLoan: string;
}

export type ApplicantInformationFormData = {
  applicantName: string;
  applicantAge: string;
  applicantGender: string;
  applicantMaritalStatus: string;
  applicantEducation: string;
};

export type AddressVerificationFormData = {
  address: string;
  addressCategory: string;
  addressDetails: string;
  addressMismatch: string;
  addressCorrectionDetails?: string;
  addressProof: string;
  numberOfYearsAtCurrentResidence: string;
  previousAddress?: string;
  previousAddressYears?: string;
  numberOfYearsAtCurrentCity: string;
  previousCity?: string;
  numberOfYearsAtPreviousCity?: string;
  reasonForChange?: string;
  geoTag: string;
};

export type ResidenceDetailsFormData = {
  residenceStatus: string;
  rentDetails: string;
  residenceType: string;
  // specifyResidenceType: string;
  standardOfLiving: string;
  // localityType: string;
  accessibility: string;
  houseArea: string;
  yearsAtCurrentAddress: string;
  // nameBoardVisible: string;
  politicalSymbolVisible: string;
  leaseAmount: string;
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
  mobileNumber: string;
  relationship: string;
  // feedbackStatus: string;
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

export interface FamilyMember {
  name: string;
  relation: string;
  otherRelation?: string;
  age: string;
  employmentType: string;
  educationalQualification: string;
  mobileNumber?: string;
  stayingWithApplicant: string;
}

export interface VerificationFormData {
  basicDetails: BasicDetailsFormData;
  addressVerification: AddressVerificationFormData;
  residenceDetails: ResidenceDetailsFormData;
  familyEmploymentDetails: FamilyEmploymentDetailsFormData;
  familyMemberDetails: FamilyMember[];
  thirdPartyCheck: any;
  uploadedItems: UploadedItem[];
}
