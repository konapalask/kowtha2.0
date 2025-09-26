// Bank-specific configurations for PD Business Verification
export interface BankConfig {
  name: string;
  sectionOrder: string[];
  apiResponseTransformer: (rawApiResponse: any) => any;
  fieldMappings: Record<string, string>;
  customSections?: string[];
  hiddenSections?: string[];
}

export interface BankConfigs {
  [bankName: string]: BankConfig;
}

export const bankConfigs: BankConfigs = {
  'Arka Fincap': {
    name: 'Arka Fincap',
    sectionOrder: [
      'basicDetails',        // 1. Basic Details
      'familyDetails',       // 2. Family Details  
      'bankingDetails',      // 3. Banking Details
      'existingLoans',       // 4. Existing Loans
      'businessDetails',     // 5. Business Details
      'salariesWages',       // 6. Salaries & Wages
      'suppliersCreditors',  // 7. Suppliers/Creditors
      'documentsObserved',   // 8. Documents Observed
      'financeDetails',      // 9. Finance Details
      'thirdPartyCheck',     // 10. Third Party Check
      'additionalDetails',   // 11. Additional Details
      'photoCapture'         // 12. Photo Capture
    ],
    apiResponseTransformer: (rawData: any) => {
      // Transform ARKA FINCAP specific API response structure
      return {
        basicDetails: {
          applicantName: rawData?.basicDetails?.applicantName || rawData?.applicantName,
          nameOfConcern: rawData?.basicDetails?.nameOfConcern || rawData?.nameOfConcern,
          phoneNo: rawData?.basicDetails?.phoneNo || rawData?.phoneNo,
          initiatedAddress: rawData?.basicDetails?.initiatedAddress || rawData?.initiatedAddress,
          visitedAddress: rawData?.basicDetails?.visitedAddress,
          dateOfVisit: rawData?.basicDetails?.dateOfVisit,
          loanAmount: rawData?.basicDetails?.loanAmount,
          purposeOfLoan: rawData?.basicDetails?.purposeOfLoan,
          typeofCollateral: rawData?.basicDetails?.typeofCollateral,
          personMet: rawData?.basicDetails?.personMet,
          nameOfPersonMet: rawData?.basicDetails?.nameOfPersonMet,
          aboutApplicant: rawData?.basicDetails?.aboutApplicant,
          residentialDetails: rawData?.basicDetails?.residentialDetails,
        },
        familyDetails: rawData?.familyDetails || [],
        bankingDetails: rawData?.bankingDetails || {},
        existingLoans: {
          loans: rawData?.existingLoans?.loans || []
        },
        businessDetails: rawData?.businessDetails || {},
        salariesWages: rawData?.salariesWages || {},
        suppliersCreditors: rawData?.suppliersCreditors || {},
        documentsObserved: rawData?.documentsObserved || {},
        financeDetails: rawData?.clientsDebtors || rawData?.financeDetails || {},
        thirdPartyCheck: rawData?.thirdPartyCheck || {},
        additionalDetails: rawData?.additionalDetails || {},
        uploadedItems: rawData?.uploadedItems || []
      };
    },
    fieldMappings: {
      // Map ARKA FINCAP API fields to display fields
      'applicantName': 'Applicant Name',
      'nameOfConcern': 'Name of Concern',
      'phoneNo': 'Phone No',
      'visitedAddress': 'Visited Address',
      'dateOfVisit': 'Date of Visit',
      'loanAmount': 'Loan Amount',
      'purposeOfLoan': 'Purpose of Loan'
    },
    hiddenSections: ['shareholdingDetails', 'clientsDebtors', 'assetDetails'],
    customSections: ['bankingDetails', 'businessDetails', 'documentsObserved', 'financeDetails']
  },

  'Axis Finance': {
    name: 'Axis Finance',
    sectionOrder: [
      'basicDetails',        // 1. Basic Details
      'familyDetails',       // 2. Family Details
      'shareholdingDetails', // 3. Shareholding Details
      'documentsObserved',   // 4. Documents Observed
      'suppliersCreditors',  // 5. Suppliers/Creditors
      'clientsDebtors',      // 6. Clients/Debtors
      'salariesWages',       // 7. Salaries & Wages
      'assetDetails',        // 8. Asset Details
      'existingLoans',       // 9. Existing Loans
      'bankingDetails',      // 10. Banking Details
      'thirdPartyCheck',     // 11. Third Party Check
      'additionalDetails',   // 12. Additional Details
      'photoCapture'         // 13. Photo Capture
    ],
    apiResponseTransformer: (rawData: any) => {
      // Transform Axis Finance specific API response structure
      return {
        basicDetails: rawData?.basicDetails || {},
        familyDetails: rawData?.familyDetails || rawData?.familyMemberDetails || [],
        shareholdingDetails: rawData?.shareholdingDetails || {},
        documentsObserved: rawData?.documentsObserved || {},
        suppliersCreditors: rawData?.suppliersCreditors || {},
        clientsDebtors: rawData?.clientsDebtors || {},
        salariesWages: rawData?.salariesWages || {},
        assetDetails: rawData?.assetDetails || {},
        existingLoans: rawData?.existingLoans || {},
        bankingDetails: rawData?.bankingDetails || rawData?.applicantDetails || {},
        thirdPartyCheck: rawData?.thirdPartyCheck || {},
        additionalDetails: rawData?.additionalDetails || rawData?.miscellaneous || {},
        uploadedItems: rawData?.uploadedItems || []
      };
    },
    fieldMappings: {
      // Map Axis Finance API fields to display fields
      'applicantName': 'Applicant Name',
      'bankName': 'Bank Name',
      'phoneNo': 'Phone No'
    },
    hiddenSections: ['businessDetails', 'financeDetails'],
    customSections: ['shareholdingDetails', 'documentsObserved', 'assetDetails', 'bankingDetails']
  },

  // Add more banks as needed
  'HDFC Bank': {
    name: 'HDFC Bank',
    sectionOrder: [
      'basicDetails',
      'familyDetails',
      'businessDetails',
      'financialDetails',
      'existingLoans',
      'thirdPartyCheck',
      'photoCapture'
    ],
    apiResponseTransformer: (rawData: any) => {
      // Transform HDFC specific API response structure
      return {
        basicDetails: rawData?.applicant || {},
        familyDetails: rawData?.family || [],
        businessDetails: rawData?.business || {},
        financialDetails: rawData?.finances || {},
        existingLoans: rawData?.loans || {},
        thirdPartyCheck: rawData?.references || {},
        uploadedItems: rawData?.documents || []
      };
    },
    fieldMappings: {
      'applicant.name': 'Applicant Name',
      'applicant.phone': 'Phone Number',
      'business.name': 'Business Name'
    },
    hiddenSections: ['shareholdingDetails', 'suppliersCreditors', 'clientsDebtors'],
    customSections: ['financialDetails']
  }
};

// Helper functions
export const getBankConfig = (bankName: string): BankConfig => {
  // Normalize bank name to handle variations
  const normalizedBankName = normalizeBankName(bankName);
  return bankConfigs[normalizedBankName] || bankConfigs['Axis Finance']; // Default to Axis Finance
};

export const normalizeBankName = (bankName: string): string => {
  if (!bankName) return 'Axis Finance';
  
  const lowerName = bankName.toLowerCase();
  
  // Handle bank name variations
  if (lowerName.includes('arka') && lowerName.includes('fincap')) {
    return 'Arka Fincap';
  }
  if (lowerName.includes('axis')) {
    return 'Axis Finance';
  }
  if (lowerName.includes('hdfc')) {
    return 'HDFC Bank';
  }
  
  // Return original if no match found, but default to Axis Finance
  return 'Axis Finance';
};

export const transformApiResponse = (bankName: string, rawApiResponse: any): any => {
  const config = getBankConfig(bankName);
  return config.apiResponseTransformer(rawApiResponse);
};

export const isArkaFincap = (bankName: string): boolean => {
  return normalizeBankName(bankName) === 'Arka Fincap';
};

export const isAxisFinance = (bankName: string): boolean => {
  return normalizeBankName(bankName) === 'Axis Finance';
};

export const shouldShowSection = (bankName: string, sectionName: string): boolean => {
  const config = getBankConfig(bankName);
  return !config.hiddenSections?.includes(sectionName);
};

export const getSectionOrder = (bankName: string): string[] => {
  const config = getBankConfig(bankName);
  return config.sectionOrder;
};

export const getFieldLabel = (bankName: string, fieldKey: string): string => {
  const config = getBankConfig(bankName);
  return config.fieldMappings[fieldKey] || fieldKey;
};
