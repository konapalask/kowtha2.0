import React from "react";
import BasicDetailsForm from "./BasicDetailsForm";
import ResidenceDetailsForm from "./ResidenceDetailsForm";
import FamilyEmploymentDetailsForm from "./FamilyEmploymentDetailsForm";
import AddressVerificationForm from "./AddressVerificationForm";
import ThirdPartyCheckForm from "./ThirdPartyCheckForm";
// import FinalObservationsForm from './FinalObservationsForm';
import OfficeVerificationForm from "./OfficeVerificationForm";
import WorkBasicDetails from "./WorkBasicDetails";
import BusinessBasicDetails from "./BusinessBasicDetails";
import BusinessDetails from "./BusinessDetails";
import ApplicantDetails from "./ApplicantDetails";
import BusinessMiscellaneous from "./BusinessMiscellaneous";
import ColleagueReferencesDetails from "./ColleagueReferencesDetails";
import PastEmploymentDetails from "./PastEmploymentDetails";
import ExistingLoansDetails from "./ExistingLoansDetails";
import FamilyMemberForm from "./FamilyMemberForm";
import ToGrossProfitForm from "./ToGrossProfitForm";
import ToNetProfitForm from "./ToNetProfitForm";
import FamilyDetails from "./FamilyDetails";
import FinancialAnalysisForm from "./FinancialAnalysisForm";

interface FormSelectorProps {
  form: any;
  formKey: string;
  currentTab: any;
  getMaritalStatus: any;
  currentDepartment?: string;
}

export const FormSelector: React.FC<FormSelectorProps> = ({
  form,
  formKey,
  currentTab,
  getMaritalStatus,
  currentDepartment,
}) => {
  switch (formKey) {
    case "basicDetails":
      return <BasicDetailsForm form={form} />;
    case "addressVerification":
      return <AddressVerificationForm form={form} />;
    case "residenceDetails":
      return <ResidenceDetailsForm form={form} />;
    case "familyEmploymentDetails":
      return (
        <FamilyEmploymentDetailsForm
          form={form}
          getMaritalStatus={getMaritalStatus}
        />
      );
    case "thirdPartyCheck":
      return <ThirdPartyCheckForm form={form} />;
    // case 'finalObservations':
    //   return <FinalObservationsForm form={form} />;
    case "employmentDetails":
      return <OfficeVerificationForm form={form} />;
    case "workBasicDetails":
      return <WorkBasicDetails form={form} />;
    case "colleagueReferences":
      return <ColleagueReferencesDetails form={form} />;
    case "pastEmployment":
      return <PastEmploymentDetails form={form} />;
    case "existingLoans":
      return <ExistingLoansDetails form={form} />;
    case "businessBasicDetails":
      return <BusinessBasicDetails form={form} currentDepartment={currentDepartment} />;
    case "businessDetails":
      return <BusinessDetails form={form} currentDepartment={currentDepartment} />;
    case "applicantDetails":
      return <ApplicantDetails form={form} />;
    case "familyDetails":
      return <FamilyDetails form={form} />;
    case "miscellaneous":
      return <BusinessMiscellaneous form={form} />;
    case "familyMemberDetails":
      return <FamilyMemberForm form={form} />;
    case "toGrossProfit":
      return <ToGrossProfitForm form={form} />;
    case "toNetProfit":
      return <ToNetProfitForm form={form} />;
    case "financialAnalysis":
      return <FinancialAnalysisForm form={form} />;
    default:
      return null;
  }
};

export { default as BasicDetailsForm } from "./BasicDetailsForm";
export { default as ResidenceDetailsForm } from "./ResidenceDetailsForm";
export { default as FamilyEmploymentDetailsForm } from "./FamilyEmploymentDetailsForm";
export { default as AddressVerificationForm } from "./AddressVerificationForm";
export { default as ThirdPartyCheckForm } from "./ThirdPartyCheckForm";
export { default as FinalObservationsForm } from "./FinalObservationsForm";
export { default as OfficeVerificationForm } from "./OfficeVerificationForm";
