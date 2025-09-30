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
import ShareholdingDetailsForm from "./ShareholdingDetailsForm";
import SuppliersCreditorsForm from "./SuppliersCreditorsForm";
import ClientsDebtorsForm from "./ClientsDebtorsForm";
import SalariesWagesForm from "./SalariesWagesForm";
import AssetDetailsForm from "./AssetDetailsForm";
import DocumentsObservedForm from "./DocumentsObservedForm";
import BankingDetailsForm from "./BankingDetailsForm";
import AdditionalDetailsForm from "./AdditionalDetailsForm";
import {
  TataUBLBasicDetailsEdit,
  TataUBLProposedLoanDetailsEdit,
  TataUBLOfficeAddressEdit,
  TataUBLResidentialAddressEdit,
  TataUBLBusinessDetailsEdit,
  TataUBLEmployeeDetailsEdit,
  TataUBLBankDetailsEdit,
  TataUBLSalesAndProfitDetailsEdit,
  TataUBLCustomersDetailsEdit,
  TataUBLSupplierDetailsEdit,
  TataUBLAdditionalBusinessDetailsEdit,
  TataUBLMiscellaneousDetailsEdit,
  TataUBLValueAddedDetailsEdit,
  TataUBLSiteVisitDetailsEdit,
} from "./TataUBLEditForms";
// Axis Bank specific forms
import AxisBankBasicDetailsForm from "./AxisBankBasicDetailsForm";
import AxisBankBusinessDetailsForm from "./AxisBankBusinessDetailsForm";
import AxisBankBusinessProfileForm from "./AxisBankBusinessProfileForm";
import AxisBankMiscellaneousDetailsForm from "./AxisBankMiscellaneousDetailsForm";
import AxisBankCommonPointsForm from "./AxisBankCommonPointsForm";
import AxisBankWorkingCapitalDetailsForm from "./AxisBankWorkingCapitalDetailsForm";
import AxisBankPerformanceForm from "./AxisBankPerformanceForm";
import SynopsisForm from "./SynopsisForm";

interface FormSelectorProps {
  form: any;
  formKey: string;
  currentTab: any;
  getMaritalStatus: any;
  currentDepartment?: string;
  bankName?: string;
}

export const FormSelector: React.FC<FormSelectorProps> = ({
  form,
  formKey,
  currentTab,
  getMaritalStatus,
  currentDepartment,
  bankName,
}) => {
  switch (formKey) {
    case "basicDetails":
      // Check if this is Tata UBL
      if (bankName === "Tata Ubl") {
        return <TataUBLBasicDetailsEdit form={form} />;
      }
      // Check if this is Axis Bank
      if (bankName === "Axis Bank") {
        return <AxisBankBasicDetailsForm form={form} />;
      }
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
      return <BusinessBasicDetails form={form} currentDepartment={currentDepartment} bankName={bankName} />;
    case "businessDetails":
      // Check if this is Tata UBL
      if (bankName === "Tata Ubl") {
        return <TataUBLBusinessDetailsEdit form={form} />;
      }
      // Check if this is Axis Bank
      if (bankName === "Axis Bank") {
        return <AxisBankBusinessDetailsForm form={form} />;
      }
      return <BusinessDetails form={form} currentDepartment={currentDepartment} />;
    case "applicantDetails":
      return <ApplicantDetails form={form} currentDepartment={currentDepartment} />;
    case "familyDetails":
      return <FamilyDetails form={form} />;
    case "miscellaneous":
      return <BusinessMiscellaneous form={form} />;
    case "familyMemberDetails":
      return <FamilyMemberForm form={form} />;
    case "shareholdingDetails":
      return <ShareholdingDetailsForm form={form} />;
    case "suppliersCreditors":
      return <SuppliersCreditorsForm form={form} />;
    case "clientsDebtors":
      return <ClientsDebtorsForm form={form} />;
    case "salariesWages":
      return <SalariesWagesForm form={form} />;
    case "documentsObserved":
      return <DocumentsObservedForm form={form} />;
    case "assetDetails":
      return <AssetDetailsForm form={form} />;
    case "bankingDetails":
      return <BankingDetailsForm form={form} />;
    case "financeDetails":
      return <ShareholdingDetailsForm form={form} />;
    case "additionalDetails":
      return <AdditionalDetailsForm form={form} />;
    case "toGrossProfit":
      return <ToGrossProfitForm form={form} />;
    case "toNetProfit":
      return <ToNetProfitForm form={form} />;
    case "financialAnalysis":
      return <FinancialAnalysisForm form={form} />;
    // Tata UBL specific forms
    case "proposedLoanDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLProposedLoanDetailsEdit form={form} />;
      }
      return null;
    case "officeAddress":
      if (bankName === "Tata Ubl") {
        return <TataUBLOfficeAddressEdit form={form} />;
      }
      return null;
    case "residentialAddress":
      if (bankName === "Tata Ubl") {
        return <TataUBLResidentialAddressEdit form={form} />;
      }
      return null;
    case "employeeDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLEmployeeDetailsEdit form={form} />;
      }
      return null;
    case "bankDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLBankDetailsEdit form={form} />;
      }
      return null;
    case "salesAndProfitDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLSalesAndProfitDetailsEdit form={form} />;
      }
      return null;
    case "customersDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLCustomersDetailsEdit form={form} />;
      }
      return null;
    case "supplierDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLSupplierDetailsEdit form={form} />;
      }
      return null;
    case "additionalBusinessDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLAdditionalBusinessDetailsEdit form={form} />;
      }
      return null;
    case "miscelleanousDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLMiscellaneousDetailsEdit form={form} />;
      }
      return null;
    case "valueAddedDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLValueAddedDetailsEdit form={form} />;
      }
      return null;
    case "siteVisitDetails":
      if (bankName === "Tata Ubl") {
        return <TataUBLSiteVisitDetailsEdit form={form} />;
      }
      return null;
    // Axis Bank specific forms
    case "businessProfile":
      if (bankName === "Axis Bank") {
        return <AxisBankBusinessProfileForm form={form} />;
      }
      return null;
    case "miscelleanousDetails":
      if (bankName === "Axis Bank") {
        return <AxisBankMiscellaneousDetailsForm form={form} />;
      }
      return null;
    case "commonPoints":
      if (bankName === "Axis Bank") {
        return <AxisBankCommonPointsForm form={form} />;
      }
      return null;
    case "workingCapitalDetails":
      if (bankName === "Axis Bank") {
        return <AxisBankWorkingCapitalDetailsForm form={form} />;
      }
      return null;
    case "performance":
      if (bankName === "Axis Bank") {
        return <AxisBankPerformanceForm form={form} />;
      }
      return null;
    case "synopsis":
      return <SynopsisForm form={form} />;
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
