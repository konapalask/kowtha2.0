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

export interface BankFormSection {
  id: string;
  label: string;
  component: React.ComponentType<any>;
}

export interface BankFormConfig {
  id: number;
  bankName: string;
  sections: BankFormSection[];
}

export const bankFormConfigs: BankFormConfig[] = [
  {
    id: 1,
    bankName: 'Axis Finance',
    sections: [
      {
        id: 'basicDetails',
        label: 'Basic Details',
        component: AxisFinanceUBLBasicDetails,
      },
      {
        id: 'familyDetails',
        label: 'Family Details',
        component: FamilyMemberDetails,
      },
      {
        id: 'shareholdingDetails',
        label: 'Shareholding Details',
        component: ShareholdingDetails,
      },
      {
        id: 'suppliersCreditors',
        label: 'Suppliers/Creditors',
        component: SuppliersCreditors,
      },
      {
        id: 'clientsDebtors',
        label: 'Clients/Debtors',
        component: ClientsDebtors,
      },
      {
        id: 'salariesWages',
        label: 'Salaries & Wages',
        component: SalariesWages,
      },
      {
        id: 'assetDetails',
        label: 'Asset Details',
        component: AssetDetails,
      },
      {
        id: 'existingLoans',
        label: 'Existing Loans',
        component: ExistingLoans,
      },
      {
        id: 'thirdPartyCheck',
        label: 'Third Party Check',
        component: ThirdPartyCheck,
      },
      {
        id: 'additionalDetails',
        label: 'Additional Details',
        component: AdditionalDetails,
      },
      {
        id: 'photoCapture',
        label: 'Photo Capture',
        component: PhotoCapture,
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
