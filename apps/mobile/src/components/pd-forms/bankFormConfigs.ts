import React from 'react';
import FamilyMemberDetails from '../forms/FamilyMemberDetails';
import PhotoCapture from '../forms/PhotoCapture';
import AssetDetails from './AssetDetails';
import AxisFinanceUBLBasicDetails from './AxisFinanceUBLBasicDetails';
import ClientsDebtors from './ClientsDebtors';
import SalariesWages from './SalariesWages';
import ShareholdingDetails from './ShareholdingDetails';
import SuppliersCreditors from './SuppliersCreditors';
import AdditionalDetails from './AdditionalDetails';
import ExistingLoans from '../forms/ExistingLoans';
import ThirdPartyCheck from '../forms/ThirdPartyCheck';
import ArkaFincapBasicDetails from './ArkaFincap';
import ArkaFincapBusinessDetails from './ArkaFincapBusinessDetails';
import DocumentsObserved from './DocumentsObserved';
import FinanceDetails from './FinanceDetails';
import ArkaFincapBankingDetails from './ArkaFincapBankingDetails';
import AxisFinanceUBLBankingDetails from './AxisFinanceUBLBankingDetails';
import AxisBasicDetails from './AxisBasicDetails';
import AxisBusinessDetails from './AxisBusinessDetails';
import AxisBankBusinessProfile from './AxisBankBusinessProfile';
import AxisMiscelleanousDetails from './AxisMiscelleanousDetails';
import AxisSuppliersCreditors from './AxisSuppliersCreditors';
import AxisClientsDebtors from './AxisClientsDebtors';
import AxisCommonPoints from './AxisCommonPoints';
import WorkingCapitalDetails from './WorkingCapitalDetails';
import AxisBankPerformance from './AxisBankPerformance';
export interface BankFormSection {
  id: string;
  label: string;
  component: React.ComponentType<any>;
  required: boolean;
}

export interface BankFormConfig {
  id: number;
  bankName: string;
  sections: BankFormSection[];
}

export const bankFormConfigs: BankFormConfig[] = [
  {
    id: 1,
    bankName: 'Axis finance UBL',
    sections: [
      {
        id: 'basicDetails',
        label: 'Basic Details',
        component: AxisFinanceUBLBasicDetails,
        required: true,
      },
      {
        id: 'familyDetails',
        label: 'Family Details',
        component: FamilyMemberDetails,
        required: true,
      },
      {
        id: 'shareholdingDetails',
        label: 'Shareholding Details',
        component: ShareholdingDetails,
        required: true,
      },
      {
        id: 'documentsObserved',
        label: 'Documents Observed',
        component: DocumentsObserved,
        required: true,
      },
      {
        id: 'suppliersCreditors',
        label: 'Suppliers/Creditors',
        component: SuppliersCreditors,
        required: true,
      },
      {
        id: 'clientsDebtors',
        label: 'Clients/Debtors',
        component: ClientsDebtors,
        required: true,
      },
      {
        id: 'salariesWages',
        label: 'Salaries & Wages',
        component: SalariesWages,
        required: true,
      },
      {
        id: 'assetDetails',
        label: 'Asset Details',
        component: AssetDetails,
        required: true,
      },
      {
        id: 'existingLoans',
        label: 'Existing Loans',
        component: ExistingLoans,
        required: true,
      },
      {
        id: 'bankingDetails',
        label: 'Banking Details',
        component: AxisFinanceUBLBankingDetails,
        required: true,
      },
      {
        id: 'thirdPartyCheck',
        label: 'Third Party Check',
        component: ThirdPartyCheck,
        required: true,
      },
      {
        id: 'additionalDetails',
        label: 'Additional Details',
        component: AdditionalDetails,
        required: true,
      },
      {
        id: 'photoCapture',
        label: 'Photo Capture',
        component: PhotoCapture,
        required: true,
      },
    ],
  },
  {
    id: 2,
    bankName: 'Arka Fincap',
    sections: [
      {
        id: 'basicDetails',
        label: 'Basic Details',
        component: ArkaFincapBasicDetails,
        required: true,
      },
      {
        id: 'familyDetails',
        label: 'Family Details',
        component: FamilyMemberDetails,
        required: true,
      },
      {
        id: 'bankingDetails',
        label: 'Banking Details',
        component: ArkaFincapBankingDetails,
        required: true,
      },
      {
        id: 'existingLoans',
        label: 'Existing Loans',
        component: ExistingLoans,
        required: true,
      },
      {
        id: 'businessDetails',
        label: 'Business Details',
        component: ArkaFincapBusinessDetails,
        required: true,
      },
      {
        id: 'salariesWages',
        label: 'Salaries & Wages',
        component: SalariesWages,
        required: true,
      },
      {
        id: 'suppliersCreditors',
        label: 'Suppliers/Creditors',
        component: SuppliersCreditors,
        required: true,
      },
      {
        id: 'documentsObserved',
        label: 'Documents Observed',
        component: DocumentsObserved,
        required: true,
      },
      {
        id: 'financeDetails',
        label: 'Finance Details',
        component: FinanceDetails,
        required: true,
      },
      {
        id: 'thirdPartyCheck',
        label: 'Third Party Check',
        component: ThirdPartyCheck,
        required: true,
      },
      {
        id: 'additionalDetails',
        label: 'Additional Details',
        component: AdditionalDetails,
        required: true,
      },
      {
        id: 'photoCapture',
        label: 'Photo Capture',
        component: PhotoCapture,
        required: true,
      },
    ],
  },
  {
    id: 3,
    bankName: 'Axis Bank',
    sections: [
      {
        id: 'basicDetails',
        label: 'Basic Details',
        component: AxisBasicDetails,
        required: true,
      },
      {
        id: 'familyDetails',
        label: 'Family Details',
        component: FamilyMemberDetails,
        required: true,
      },
      {
        id: 'businessDetails',
        label: 'Business Details',
        component: AxisBusinessDetails,
        required: true,
      },
      {
        id: 'businessProfile',
        label: 'Business Profile',
        component: AxisBankBusinessProfile,
        required: true,
      },
      {
        id: 'miscelleanousDetails',
        label: 'Miscelleanous Details',
        component: AxisMiscelleanousDetails,
        required: true,
      },
      {
        id: 'suppliersCreditors',
        label: 'Suppliers/Creditors',
        component: AxisSuppliersCreditors,
        required: true,
      },
      {
        id: 'clientsDebtors',
        label: 'Clients/Debtors',
        component: AxisClientsDebtors,
        required: true,
      },
      {
        id: 'thirdPartyCheck',
        label: 'Third Party Check',
        component: ThirdPartyCheck,
        required: true,
      },
      {
        id: 'commonPoints',
        label: 'Common Points',
        component: AxisCommonPoints,
        required: true,
      },
      {
        id: 'existingLoans',
        label: 'Existing Loans',
        component: ExistingLoans,
        required: true,
      },
      {
        id: 'workingCapitalDetails',
        label: 'Working Capital Details',
        component: WorkingCapitalDetails,
        required: true,
      },
      {
        id: 'bankingDetails',
        label: 'Banking Details',
        component: ArkaFincapBankingDetails,
        required: true,
      },
      {
        id: 'performance',
        label: 'Performance',
        component: AxisBankPerformance,
        required: true,
      },
      {
        id: 'additionalDetails',
        label: 'Additional Details',
        component: AdditionalDetails,
        required: true,
      },
      {
        id: 'photoCapture',
        label: 'Photo Capture',
        component: PhotoCapture,
        required: true,
      },
    ],
  },
];

export const getFormConfigByBank = (
  bankName: string,
): BankFormConfig | null => {
  return (
    bankFormConfigs.find(
      config => config.bankName.toLowerCase() === bankName.toLowerCase(),
    ) || null
  );
};

export const getAvailableBanks = (): string[] => {
  return bankFormConfigs.map(config => config.bankName);
};
