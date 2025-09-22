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

// PD Form Data Interfaces
export interface AxisFinanceUBLBasicDetailsFormData {
  applicantName: string;
  nameOfConcern: string;
  constitution: string;
  initiatedAddress: string;
  visitedAddress: string;
  phoneNo: string;
  appointmentFixed: string;
  structureOfLoan: string;
  noOfVisit: string;
  personMet: string;
  nameOfPersonMet: string;
  aboutApplicant: string;
  residentialDetails: string;
  coApplicantDetails: string;
}

export interface Shareholder {
  name: string;
  shareholdingPercentage: string;
  relationshipWithApplicant: string;
  designation: string;
  comingIntoLoanStructure: string;
  functionalOfPartnerDirector: string;
}

export interface SupplierCreditor {
  numberOfFixedSuppliers: string;
  creditPeriod: string;
  cashChequeProportions: string;
  supplier1Name: string;
  supplier1Phone: string;
  supplier1Location: string;
  supplier1Review: string;
  supplier2Name: string;
  supplier2Phone: string;
  supplier2Location: string;
  supplier2Review: string;
  supplier3Name: string;
  supplier3Phone: string;
  supplier3Location: string;
  supplier3Review: string;
}

export interface ClientDebtor {
  numberOfFixedCustomers: string;
  creditPeriod: string;
  cashChequeProportions: string;
  customer1Name: string;
  customer1Phone: string;
  customer1Location: string;
  customer1Review: string;
  customer2Name: string;
  customer2Phone: string;
  customer2Location: string;
  customer2Review: string;
  customer3Name: string;
  customer3Phone: string;
  customer3Location: string;
  customer3Review: string;
  averageStockMaintenance: string;
  turnover: string;
  netMargins: string;
}

export interface Employee {
  numberOfEmployees: string;
  salaryPerMonthPerEmployee: string;
  statusOfEmployee: string;
  numberOfLabours: string;
  wagesPerMonthPerDay: string;
  statusOfLabour: string;
  remarks: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  otherMajorExpenditure: string;
}

export interface Asset {
  address: string;
  areaMeasured: string;
  purchaseCost: string;
  purchaseYear: string;
  marketValue: string;
  ownerName: string;
  mortgaged: string;
}

export interface PDFormData {
  axisFinanceUBLBasicDetails: AxisFinanceUBLBasicDetailsFormData;
  familyMemberDetails: FamilyMember[];
  shareholdingDetails: Shareholder[];
  suppliersCreditors: SupplierCreditor[];
  clientsDebtors: ClientDebtor[];
  salariesWages: Employee[];
  assetDetails: Asset[];
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
