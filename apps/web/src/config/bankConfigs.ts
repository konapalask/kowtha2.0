export const SUPPORTED_BANKS = [
  'Axis Finance UBL Above 10L',
  'Axis Finance UBL Below 10L', 
  'Axis Bank',
  'Arka Fincap',
  'Tata Ubl',
  'RBL'
];

export const BANK_DISPLAY_NAMES = {
  'Axis Finance UBL Above 10L': 'Axis Finance UBL (Above 10L)',
  'Axis Finance UBL Below 10L': 'Axis Finance UBL (Below 10L)',
  'Axis Bank': 'Axis Bank',
  'Arka Fincap': 'Arka Fincap',
  'Tata Ubl': 'Tata UBL',
  'RBL': 'RBL Bank'
};

export const BANK_CONFIGURATIONS = {
  'Axis Finance UBL Above 10L': {
    id: 1,
    name: 'Axis Finance UBL Above 10L',
    sections: ['basicDetails', 'familyDetails', 'shareholdingDetails', 'businessDetails', 'documentsObserved', 'suppliersCreditors', 'clientsDebtors', 'expenditure', 'assetDetails', 'loanDetails', 'bankingDetails', 'thirdPartyCheck'],
    requiredSections: ['basicDetails', 'familyDetails', 'shareholdingDetails', 'businessDetails']
  },
  'Axis Finance UBL Below 10L': {
    id: 2,
    name: 'Axis Finance UBL Below 10L',
    sections: ['basicDetails', 'familyDetails', 'shareholdingDetails', 'businessDetails'],
    requiredSections: ['basicDetails', 'familyDetails', 'shareholdingDetails', 'businessDetails']
  },
  'Axis Bank': {
    id: 3,
    name: 'Axis Bank',
    sections: ['applicantDetails', 'familyBackground', 'businessPlaceVintage', 'businessFinancialProfile', 'businessDetails', 'otherDetailsObserved', 'commonPoints'],
    requiredSections: ['applicantDetails', 'familyBackground', 'businessPlaceVintage']
  },
  'Arka Fincap': {
    id: 4,
    name: 'Arka Fincap',
    sections: ['applicantDetails'],
    requiredSections: ['applicantDetails']
  },
  'Tata Ubl': {
    id: 5,
    name: 'Tata Ubl',
    sections: ['basicDetails', 'proposedLoanDetails', 'officeAddress', 'residentialAddress', 'familyDetails', 'businessDetails', 'employeesDetails', 'bankDetails', 'salesAndProfitDetails', 'customerDetails', 'supplierDetails', 'otherDetails', 'valueAddedInformation', 'siteVisitObservations', 'документы'],
    requiredSections: ['basicDetails', 'proposedLoanDetails', 'officeAddress', 'residentialAddress']
  },
  'RBL': {
    id: 6,
    name: 'RBL',
    sections: ['caseDetails', 'businessOwnerDetails', 'familyDetails', 'businessDetails', 'inputsPurchases', 'outputsSupply', 'employeeDetails', 'tradeReferences', 'otherSourcesOfIncome', 'loansDetails', 'applicantsMainBankingDetails', 'netWorth', 'particulars'],
    requiredSections: ['caseDetails', 'businessOwnerDetails', 'familyDetails', 'businessDetails']
  }
};

export function getBankConfig(bankName: string) {
  return BANK_CONFIGURATIONS[bankName as keyof typeof BANK_CONFIGURATIONS] || null;
}

export function isBankSupported(bankName: string): boolean {
  return SUPPORTED_BANKS.some(bank => 
    bank.toLowerCase() === bankName.toLowerCase()
  );
}

export function getBankDisplayName(bankName: string): string {
  return BANK_DISPLAY_NAMES[bankName as keyof typeof BANK_DISPLAY_NAMES] || bankName;
}
