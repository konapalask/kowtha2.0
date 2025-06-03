import React from 'react';
import BasicDetailsForm from './BasicDetailsForm';
import ResidenceDetailsForm from './ResidenceDetailsForm';
import FamilyEmploymentDetailsForm from './FamilyEmploymentDetailsForm';
import AddressVerificationForm from './AddressVerificationForm';
import ThirdPartyCheckForm from './ThirdPartyCheckForm';
import FinalObservationsForm from './FinalObservationsForm';
import OfficeVerificationForm from './OfficeVerificationForm';

interface FormSelectorProps {
  form: any;
  formKey: string;
  currentTab: any;
}

export const FormSelector: React.FC<FormSelectorProps> = ({form, formKey, currentTab }) => {
  switch (formKey) {
    case 'basicDetails':
      return <BasicDetailsForm form={form} />;
    case 'residenceDetails':
      return <ResidenceDetailsForm />;
    case 'familyEmploymentDetails':
      return <FamilyEmploymentDetailsForm />;
    case 'addressVerification':
      return <AddressVerificationForm />;
    case 'thirdPartyCheck':
      return <ThirdPartyCheckForm />;
    case 'finalObservations':
      return <FinalObservationsForm />;
    case 'officeVerification':
      return <OfficeVerificationForm />;
    default:
      return null;
  }
};

export { default as BasicDetailsForm } from './BasicDetailsForm';
export { default as ResidenceDetailsForm } from './ResidenceDetailsForm';
export { default as FamilyEmploymentDetailsForm } from './FamilyEmploymentDetailsForm';
export { default as AddressVerificationForm } from './AddressVerificationForm';
export { default as ThirdPartyCheckForm } from './ThirdPartyCheckForm';
export { default as FinalObservationsForm } from './FinalObservationsForm';
export { default as OfficeVerificationForm } from './OfficeVerificationForm'; 