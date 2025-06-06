export interface FormData {
  basicDetails: {
    verificationType: string;
    verificationDate: string;
    verificationTime: string;
    verificationMode: string;
    verificationStatus: string;
    verificationRemarks: string;
  };
  applicantInformation: {
    applicantName: string;
    applicantAge: string;
    applicantGender: string;
    applicantMaritalStatus: string;
    applicantEducation: string;
  };
  residenceDetails: {
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
  };
  familyEmploymentDetails: {
    totalFamilyMembers: string;
    earningMembers: string;
    dependents: string;
    isSpouseWorking: string;
    spouseEmploymentDetails: string;
    assetsObserved: string;
  };
  addressVerification: {
    addressType: string;
    addressCategory: string;
    addressSubCategory: string;
    addressDetails: string;
    geoTag: string;
  };
  thirdPartyCheck: {
    tpcName: string;
    relationship: string;
    // feedbackStatus: string;
    comments: string;
  };
  finalObservations: {
    cooperativeness: string;
    overallStatus: string;
    remarks: string;
  };
  officeVerification: {
    applicantName: string;
    bankName: string;
    prospectNumber: string;
    purposeOfLoan: string;
    loanAmount: string;
    tenure: string;
    panNumber: string;
    aadharNumber: string;
    qualification: string;
    currentOfficeName: string;
    officeAddress: string;
    yearsInCurrentJob: string;
    totalWorkExperience: string;
    companySize: string;
    natureOfService: string;
    officeLocality: string;
    idCardNumber: string;
    designation: string;
    salaryMode: string;
    employerType: string;
    grossSalary: string;
    netSalary: string;
    previousCompanyName: string;
    workExperience: string;
    existingLoans: string;
    references: string;
  };
  uploadedItems: Array<{
    id: string;
    uri: string;
    type: string;
    timestamp: string;
  }>;
  financialDetails: {
    fundsRequired: string;
    sourceOfOwnFunds: string;
    purchaseCost: string;
    savings: string;
    constructionEstimate: string;
    familyFriends: string;
    registrationCharges: string;
    otherLoanAmount: string;
    otherExpenses: string;
    totalAmountSpent: string;
    totalTransactionCost: string;
    paymentModeCash: string;
    paymentModeCheque: string;
  };
}

export interface EditFormModalProps {
  visible: boolean;
  onCancel: () => void;
//   onSave: (values: any) => void;
  formKey: string;
  initialValues: any;
  currentTab: string;
  fetchVerificationData: () => void;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  value?: string;
  showWhen?: (values: any) => boolean;
  readOnly?: boolean;
}

export interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}