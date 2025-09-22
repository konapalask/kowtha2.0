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
        id: 'basic_details',
        label: 'Basic Details',
        component: AxisFinanceUBLBasicDetails,
      },
      {
        id: 'family_details',
        label: 'Family Details',
        component: FamilyMemberDetails,
      },
      {
        id: 'shareholding_details',
        label: 'Shareholding Details',
        component: ShareholdingDetails,
      },
      {
        id: 'suppliers_creditors',
        label: 'Suppliers/Creditors',
        component: SuppliersCreditors,
      },
      {
        id: 'clients_debtors',
        label: 'Clients/Debtors',
        component: ClientsDebtors,
      },
      {
        id: 'salaries_wages',
        label: 'Salaries & Wages',
        component: SalariesWages,
      },
      {
        id: 'asset_details',
        label: 'Asset Details',
        component: AssetDetails,
      },
      {
        id: 'Existing Loans',
        label: 'Existing Loans',
        component: ExistingLoans,
      },
      {
        id: 'third_party_check',
        label: 'Third Party Check',
        component: ThirdPartyCheck,
      },
      {
        id: 'additional_details',
        label: 'Additional Details',
        component: AdditionalDetails,
      },
      {
        id: 'photo_capture',
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
