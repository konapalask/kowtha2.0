import { useRouter } from "next/router";
import { useEffect, useState, createContext, useContext } from "react";
import {
  Button,
  Typography,
  Space,
  Tag,
  Divider,
  Modal,
  Descriptions,
  Tooltip,
  Input,
  Card,
  Form,
  Select,
  InputNumber,
  Row,
  Col,
  message,
  Tabs,
  Table,
  Image,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  MailOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import dynamic from "next/dynamic";
import React from "react";
import { getVerificationData, generateFinalReport, verifierEditApi } from "@/services/verifier.services";
import { getS3ImageUrl } from "@/utils/utility";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const { Title } = Typography;
const { TabPane } = Tabs;

interface FormData {
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
    feedbackStatus: string;
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
  section8: Record<string, any>;
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

interface EditFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  formKey: string;
  initialValues: any;
  currentTab: string;
  fetchVerificationData: () => void;
}

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  value?: string;
  showWhen?: (values: any) => boolean;
  readOnly?: boolean;
}

const EditFormModal: React.FC<EditFormModalProps> = ({
  visible,
  onCancel,
  onSave,
  formKey,
  initialValues,
  currentTab,
  fetchVerificationData,
}) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    if (visible && initialValues) {
      const currentVerification = initialValues?.verifications?.find((v: any) => v.type === currentTab);
      form.setFieldsValue(currentVerification?.verificationData || {});
      if (formKey === 'finalObservations') {
        setEditorContent(currentVerification?.verificationData?.remarks || '');
      }
    }
  }, [visible, initialValues, form, formKey, currentTab]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (formKey === 'finalObservations') {
        values.remarks = editorContent;
      }

      // Find current verification data
      const currentVerification = initialValues?.verifications?.find((v: any) => v.type === currentTab);
      const currentVerificationData = currentVerification?.verificationData || {};

      // Create payload with updated data
      const payload = {
        verificationData: {
          ...currentVerificationData,
          [formKey]: values
        }
      };

      // Call API to update verification data
      await verifierEditApi(id as string, currentTab, payload);
      
      message.success('Changes saved successfully');
      onSave(values);
      form.resetFields();
      onCancel();
      // Refresh verification data
      fetchVerificationData();
    } catch (error) {
      console.error('Error saving form:', error);
      message.error('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const getFormFields = () => {
    switch (formKey) {
      case "basicDetails":
        return [
          { 
            name: "verificationType", 
            label: "Verification Type", 
            type: "input", 
            required: true,
            value: currentTab === 'PermanentAddress' ? 'Permanent Address' : 
                   currentTab === 'CurrentAddress' ? 'Current Address' : 
                   currentTab === 'Work' ? 'Work Verification' : 'Final Observations'
          },
          { 
            name: "applicationNumber", 
            label: "Application Number", 
            type: "input", 
            required: true 
          },
          { 
            name: "applicantName", 
            label: "Applicant Name", 
            type: "input", 
            required: true 
          },
          { 
            name: "applicantMaritalStatus", 
            label: "Marital Status", 
            type: "select", 
            options: ['Single', 'Married', 'Divorced', 'Others'],
            required: true
          },
          { 
            name: "applicantMaritalStatusOther", 
            label: "Specify Marital Status", 
            type: "input",
            // showWhen: (values) => values.applicantMaritalStatus === 'Others',
            // required: true
          },
          { 
            name: "educationQualification", 
            label: "Education Qualification", 
            type: "select",
            options: [
              'Below 10th',
              '10th pass',
              '12th pass',
              'Diploma/ITI certification',
              'Graduate',
              'PG/Professional Certification'
            ],
            required: true
          },
          { 
            name: "category", 
            label: "Category", 
            type: "select",
            options: ['General', 'SC', 'ST', 'OBC', 'Others'],
            required: true
          },
          { 
            name: "categoryOther", 
            label: "Specify Category", 
            type: "input",
            // showWhen: (values) => values.category === 'Others',
            // required: true
          }
        ];
      // case "applicantInformation":
      //   return [
      //     { name: "applicantName", label: "Applicant Name", type: "input" },
      //     { name: "applicantAge", label: "Applicant Age", type: "input" },
      //     { name: "applicantGender", label: "Applicant Gender", type: "select", options: ["Male", "Female", "Other"] },
      //     { name: "applicantMaritalStatus", label: "Marital Status", type: "select", options: ["Single", "Married", "Divorced", "Widowed"] },
      //     { name: "applicantEducation", label: "Education Level", type: "input" },
      //   ];
      case "residenceDetails":
        return [
          { name: "residenceStatus", label: "Residence Status", type: "select", options: ["Owned", "Rented", "Leased"], required: true },
          { name: "rentDetails", label: "Rent Details", type: "input" },
          { name: "residenceType", label: "Type of Residence", type: "select", options: ["House", "Apartment", "Villa"], required: true },
          { name: "constructionQuality", label: "Construction Quality", type: "select", options: ["Excellent", "Good", "Average", "Poor"], required: true },
          { name: "standardOfLiving", label: "Standard of Living", type: "select", options: ["Excellent", "Good", "Average", "Poor"], required: true },
          { name: "locationCategory", label: "Location Category", type: "select", options: ["Urban", "Semi-Urban", "Rural"], required: true },
          { name: "localityType", label: "Locality Type", type: "select", options: ["Residential", "Commercial", "Mixed"], required: true },
          { name: "accessibility", label: "Accessibility", type: "select", options: ["Easy", "Moderate", "Difficult"], required: true },
          { name: "houseArea", label: "House Area", type: "input", required: true },
          { name: "yearsAtCurrentAddress", label: "Years at Current Address", type: "input", required: true },
          { name: "nameplateVisible", label: "Nameplate Visible", type: "select", options: ["Yes", "No"], required: true },
        ];
      case "familyEmploymentDetails":
        return [
          { name: "totalFamilyMembers", label: "Total Family Members", type: "input", required: true },
          { name: "earningMembers", label: "No. of Earning Members", type: "input", required: true },
          { name: "dependents", label: "No. of Dependents", type: "input", required: true },
          { name: "isSpouseWorking", label: "Is Spouse Working", type: "select", options: ["Yes", "No"], required: true },
          { name: "spouseEmploymentDetails", label: "Spouse's Employment Details", type: "input" },
          { name: "assetsObserved", label: "Assets Observed", type: "input", required: true },
        ];
      case "addressVerification":
        return [
          { name: "address", label: "Address Type", type: "select", options: ["Residence", "Office", "Business", "Other"] , required: true},
          { name: "addressCategory", label: "Address Category", type: "select", options: ["Urban", "Rural", "Semi-Urban"], required: true },
          { name: "addressDetails", label: "Address Details", type: "textarea", required: true },
          {name:"numberOfYearsAtCurrentResidence",label:"No. of Years at Current Residence",type:"select", options:["<=1 year","1-3 years","3-5 years",">5 years"],required:true},
          {name:"previousAddress",label:"Previous Address",type:"input"},
          {name:"numberOfYearsAtPreviousAddress",label:"No. of Years at Previous Address",type:"input"},
          {name:"numberOfYearsAtCurrentCity",label:"No. of Years at Current City",type:"select",options:["<=3 years",">3 years"], required:true},
          {name:"previousCity",label:"Previous City",type:"input"},
          {name:"numberOfYearsAtPreviousCity",label:"No. of Years at Previous City",type:"input"},
          {name:"reasonForChange",label:"Reason for Change",type:"textarea"},
          { name: "geoTag", label: "Geo Tag", type: "input", required: true },
        ];
      case "thirdPartyCheck":
        return [
          { name: "tpcName", label: "Name of TPC/Neighbor", type: "input", required: true },
          {name:"mobileNumber",label:"Mobile Number",type:"input",required:true},
          { name: "relationship", label: "Relationship to Applicant", type: "select", options: ["Neighbor", "Friend", "Local Shop Owner", "Other"], required: true },
          { name: "feedbackStatus", label: "Feedback Status", type: "select", options: ["Positive", "Negative", "Could Not Confirm"], required: true },
          { name: "comments", label: "Comments/Remarks", type: "textarea", required: true },
        ];
      case "finalObservations":
        return [
          { name: "cooperativeness", label: "Cooperativeness of Applicant", type: "select", options: ["Polite", "Neutral", "Rude", "Not Met"] },
          { name: "overallStatus", label: "Overall Status", type: "select", options: ["Positive", "Negative", "Referred", "Fraud"] },
          { name: "remarks", label: "Remarks", type: "textarea" },
        ];
      case "officeVerification":
        return [
          { name: "applicantName", label: "Name of the Applicant", type: "input" },
          { name: "bankName", label: "Name of the Bank", type: "input" },
          { name: "prospectNumber", label: "Prospect Number", type: "input" },
          { name: "purposeOfLoan", label: "Purpose of Loan", type: "input" },
          { name: "loanAmount", label: "Loan Amount", type: "input" },
          { name: "tenure", label: "Tenure", type: "input" },
          { name: "panNumber", label: "PAN Number", type: "input" },
          { name: "aadharNumber", label: "Aadhar Number", type: "input" },
          { name: "qualification", label: "Qualification", type: "input" },
          { name: "currentOfficeName", label: "Name of Current Working Office", type: "input" },
          { name: "officeAddress", label: "Office Address", type: "textarea" },
          { name: "yearsInCurrentJob", label: "Years in Current Job", type: "input" },
          { name: "totalWorkExperience", label: "Total Work Experience", type: "input" },
          { name: "companySize", label: "Company Size", type: "input" },
          { name: "natureOfService", label: "Nature of Service/Business", type: "input" },
          { name: "officeLocality", label: "Locality of Office Premises", type: "select", options: ["Residential", "Commercial", "Industry"] },
          { name: "idCardNumber", label: "ID Card Number", type: "input" },
          { name: "designation", label: "Designation", type: "input" },
          { name: "salaryMode", label: "Mode of Salary", type: "select", options: ["Cash", "Online"] },
          { name: "employerType", label: "Type of Employer", type: "select", options: ["Government", "Private"] },
          { name: "grossSalary", label: "Gross Salary per Month", type: "input" },
          { name: "netSalary", label: "Net Salary per Month", type: "input" },
          { name: "previousCompanyName", label: "Previous Company Name", type: "input" },
          { name: "workExperience", label: "Work Experience", type: "input" },
          { name: "existingLoans", label: "Existing Loans", type: "textarea" },
          { name: "references", label: "References (Colleagues)", type: "textarea" },
        ];
      case "financialDetails":
        return [
          { name: "fundsRequired", label: "Funds Required", type: "input" },
          { name: "sourceOfOwnFunds", label: "Source of Own Funds", type: "input" },
          { name: "purchaseCost", label: "Purchase Cost", type: "input" },
          { name: "savings", label: "Savings", type: "input" },
          { name: "constructionEstimate", label: "Construction Estimate", type: "input" },
          { name: "familyFriends", label: "Family/Friends", type: "input" },
          { name: "registrationCharges", label: "Registration/Stamp Duty Charges", type: "input" },
          { name: "otherLoanAmount", label: "Other Loan Amount Taken", type: "input" },
          { name: "otherExpenses", label: "Other Expenses", type: "input" },
          { name: "totalAmountSpent", label: "Total Amount Spent", type: "input" },
          { name: "totalTransactionCost", label: "Total Transaction Cost", type: "input" },
          { name: "paymentModeCash", label: "Mode of Payment to Seller (Cash)", type: "input" },
          { name: "paymentModeCheque", label: "Mode of Payment to Seller (Cheque)", type: "input" },
        ];
      default:
        return [];
    }
  };

  const renderFormField = (field: FormField) => {
    const formValues = form.getFieldsValue();
    
    // Check if field should be shown
    if (field.showWhen && !field.showWhen(formValues)) {
      return null;
    }

    switch (field.type) {
      case "input":
        return <Input disabled={field.readOnly} />;
      case "textarea":
        return <Input.TextArea rows={4} />;
      case "select":
        return (
          <Select
            allowClear
            placeholder={`Select ${field.label}`}
            notFoundContent="No options available"
          >
            {field.options?.map((option: string) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input />;
    }
  };

  return (
    <Modal
      title={`Edit ${formKey.replace(/([A-Z])/g, " $1").trim()}`}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      width={1000}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues?.verifications?.find((v: any) => v.type === currentTab)?.verificationData?.[formKey]}
        preserve={false}
      >
        <Row gutter={[16, 16]}>
          {getFormFields().map((field:any) => (
            <Col span={ 8} key={field.name}>
              <Form.Item
                name={field.name}
                label={field.label}
                rules={[{ required: field.required, message: `Please ${field.type === 'select' ? 'select' : 'enter'} ${field.label.toLowerCase()}` }]}
              >
                {renderFormField(field)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

const VerificationDetails = ({ verificationData, onEdit }: { verificationData: any; onEdit: (formKey: string) => void }) => {
  const { activeTab } = useTabContext();
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (verificationData?.uploadedItems) {
        console.log('Uploaded Items:', verificationData.uploadedItems);
        const urls: {[key: string]: string} = {};
        for (const item of verificationData.uploadedItems) {
          try {
            console.log('Fetching URL for item:', item);
            const response = await getS3ImageUrl(item.s3ImageUrl);
            console.log('S3 URL Response:', response);
            urls[item.id] = response;
          } catch (error) {
            console.error('Error fetching image URL:', error);
          }
        }
        console.log('Setting image URLs:', urls);
        setImageUrls(urls);
      }
    };

    fetchImageUrls();
  }, [verificationData?.uploadedItems]);

  if (!verificationData) return null;

  const data = verificationData || {};
  console.log('Current imageUrls state:', imageUrls);

  return (
    <>
      {/* Basic Details Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title={`${activeTab === 'permanent' ? 'Permanent' : 'Current'} Address Details`}
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("basicDetails")}
              />
            }
          >
            <Descriptions.Item label="Verification Type">
              {data?.basicDetails?.verificationType}
            </Descriptions.Item>
            <Descriptions.Item label="Application Number">
              {data?.basicDetails?.applicationNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Applicant Name">
              {data?.basicDetails?.applicantName}
            </Descriptions.Item>
            <Descriptions.Item label="Marital Status">
              {data?.basicDetails?.applicantMaritalStatus}
              {data?.basicDetails?.applicantMaritalStatus === 'Others' && 
                ` - ${data?.basicDetails?.applicantMaritalStatusOther}`}
            </Descriptions.Item>
            <Descriptions.Item label="Education Qualification">
              {data?.basicDetails?.educationQualification}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {data?.basicDetails?.category}
              {data?.basicDetails?.category === 'Others' && 
                ` - ${data?.basicDetails?.categoryOther}`}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Address Verification Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Address Verification"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("addressVerification")}
              />
            }
          >
            <Descriptions.Item label="Address Type">
              {data?.addressVerification?.address}
            </Descriptions.Item>
            <Descriptions.Item label="Address Category">
              {data?.addressVerification?.addressCategory}
            </Descriptions.Item>
            <Descriptions.Item label="Address Details">
              {data?.addressVerification?.addressDetails}
            </Descriptions.Item>
            <Descriptions.Item label="Years at Current Residence">
              {data?.addressVerification?.numberOfYearsAtCurrentResidence}
            </Descriptions.Item>
            {data?.addressVerification?.numberOfYearsAtCurrentResidence === '<=1year' && (
              <>
                <Descriptions.Item label="Previous Address">
                  {data?.addressVerification?.previousAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Years at Previous Address">
                  {data?.addressVerification?.previousAddressYears}
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="Years in Current City">
              {data?.addressVerification?.numberOfYearsAtCurrentCity}
            </Descriptions.Item>
            {data?.addressVerification?.numberOfYearsAtCurrentCity === '<=3 years' && (
              <>
                <Descriptions.Item label="Previous City">
                  {data?.addressVerification?.previousCity}
                </Descriptions.Item>
                <Descriptions.Item label="Years in Previous City">
                  {data?.addressVerification?.numberOfYearsAtPreviousCity}
                </Descriptions.Item>
                <Descriptions.Item label="Reason for Change">
                  {data?.addressVerification?.reasonForChange}
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="Geo Tag">
              {data?.addressVerification?.geoTag}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Residence Details Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Residence Details"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("residenceDetails")}
              />
            }
          >
            <Descriptions.Item label="Residence Status">
              {data?.residenceDetails?.residenceStatus}
            </Descriptions.Item>
            {data?.residenceDetails?.residenceStatus === 'Rented' && (
              <Descriptions.Item label="Rent Details">
                {data?.residenceDetails?.rentDetails}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Type of Residence">
              {data?.residenceDetails?.residenceType}
            </Descriptions.Item>
            <Descriptions.Item label="Construction Quality">
              {data?.residenceDetails?.constructionQuality}
            </Descriptions.Item>
            <Descriptions.Item label="Standard of Living">
              {data?.residenceDetails?.standardOfLiving}
            </Descriptions.Item>
            <Descriptions.Item label="Location Category">
              {data?.residenceDetails?.locationCategory}
            </Descriptions.Item>
            <Descriptions.Item label="Locality Type">
              {data?.residenceDetails?.localityType}
            </Descriptions.Item>
            <Descriptions.Item label="Accessibility">
              {data?.residenceDetails?.accessibility}
            </Descriptions.Item>
            <Descriptions.Item label="House Area">
              {data?.residenceDetails?.houseArea}
            </Descriptions.Item>
            <Descriptions.Item label="Years at Current Address">
              {data?.residenceDetails?.yearsAtCurrentAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Nameplate Visible">
              {data?.residenceDetails?.nameplateVisible}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Family & Employment Details Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Family & Employment Details"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("familyEmploymentDetails")}
              />
            }
          >
            <Descriptions.Item label="Total Family Members">
              {data?.familyEmploymentDetails?.totalFamilyMembers}
            </Descriptions.Item>
            <Descriptions.Item label="No. of Earning Members">
              {data?.familyEmploymentDetails?.earningMembers}
            </Descriptions.Item>
            <Descriptions.Item label="No. of Dependents">
              {data?.familyEmploymentDetails?.dependents}
            </Descriptions.Item>
            <Descriptions.Item label="Is Spouse Working">
              {data?.familyEmploymentDetails?.isSpouseWorking}
            </Descriptions.Item>
            <Descriptions.Item label="Spouse's Employment Details">
              {data?.familyEmploymentDetails?.spouseEmploymentDetails}
            </Descriptions.Item>
            <Descriptions.Item label="Assets Observed">
              {data?.familyEmploymentDetails?.assetsObserved}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Third Party Check Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Third Party Check"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("thirdPartyCheck")}
              />
            }
          >
            <Descriptions.Item label="TPC Name">
              {data?.thirdPartyCheck?.tpcName}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {data?.thirdPartyCheck?.mobileNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Relationship">
              {data?.thirdPartyCheck?.relationship}
            </Descriptions.Item>
            <Descriptions.Item label="Feedback Status">
              {data?.thirdPartyCheck?.feedbackStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Comments">
              {data?.thirdPartyCheck?.comments}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Photo Capture Section */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Photo Capture">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {data?.uploadedItems?.map((item: any, idx: number) => {
              console.log('Rendering image for item:', item, 'with URL:', imageUrls[item.id]);
              return (
                <div key={item.id} style={{ position: 'relative' }}>
                  <Image
                    src={imageUrls[item.id] || ''}
                    alt={`Photo ${idx + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                    preview={false}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<CloseCircleOutlined />}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '50%',
                      padding: 4
                    }}
                    onClick={() => {
                      // Handle photo removal
                      const updatedItems = data.uploadedItems.filter((i: any) => i.id !== item.id);
                      onEdit("photoCapture");
                    }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '12px'
                  }}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Photo {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </>
  );
};

const WorkVerificationDetails = ({ verificationData, onEdit }: { verificationData: any; onEdit: (formKey: string) => void }) => {
  const { activeTab } = useTabContext();
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (verificationData?.uploadedItems) {
        const urls: {[key: string]: string} = {};
        for (const item of verificationData.uploadedItems) {
          try {
            const response = await getS3ImageUrl(item.s3ImageUrl);
            urls[item.id] = response.url;
          } catch (error) {
            console.error('Error fetching image URL:', error);
          }
        }
        setImageUrls(urls);
      }
    };

    fetchImageUrls();
  }, [verificationData?.uploadedItems]);

  if (!verificationData) return null;

  const data = verificationData || {};

  return (
    <>
      {/* Basic Details Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Basic Details"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("basicDetails")}
              />
            }
          >
            <Descriptions.Item label="Name of the Applicant">
              {data?.basicDetails?.applicantName || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Name of the Bank">
              {data?.basicDetails?.bankName || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Prospect Number">
              {data?.basicDetails?.prospectNumber || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Purpose of Loan">
              {data?.basicDetails?.purposeOfLoan || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Loan Amount">
              {data?.basicDetails?.loanAmount || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Tenure">
              {data?.basicDetails?.tenure || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="PAN Number">
              {data?.basicDetails?.panNumber || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Aadhar Number">
              {data?.basicDetails?.aadharNumber || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Qualification">
              {data?.basicDetails?.qualification || 'No data'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Employment Details Section */}
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Employment Details"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("employmentDetails")}
              />
            }
          >
            <Descriptions.Item label="Current Office Name">
              {data?.employmentDetails?.currentOfficeName || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Office Address">
              {data?.employmentDetails?.officeAddress || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Years in Current Job">
              {data?.employmentDetails?.yearsInCurrentJob || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Total Work Experience">
              {data?.employmentDetails?.totalWorkExperience || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Company Size">
              {data?.employmentDetails?.companySize || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Nature of Service/Business">
              {data?.employmentDetails?.natureOfService || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Office Locality">
              {data?.employmentDetails?.officeLocality || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="ID Card Number">
              {data?.employmentDetails?.idCardNumber || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Designation">
              {data?.employmentDetails?.designation || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Mode of Salary">
              {data?.employmentDetails?.salaryMode || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Type of Employer">
              {data?.employmentDetails?.employerType || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Gross Salary per Month">
              {data?.employmentDetails?.grossSalary || 'No data'}
            </Descriptions.Item>
            <Descriptions.Item label="Net Salary per Month">
              {data?.employmentDetails?.netSalary || 'No data'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      {/* Colleague References Section */}
      <section style={{ marginBottom: 24 }}>
        <Card
          title="Colleague References"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => onEdit("colleagueReferences")}
            >
              Add Reference
            </Button>
          }
        >
          <Table
            dataSource={data?.colleagueReferences?.references || []}
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Designation',
                dataIndex: 'designation',
                key: 'designation',
              },
              {
                title: 'Years Known',
                dataIndex: 'yearsKnown',
                key: 'yearsKnown',
              },
              {
                title: 'Contact Number',
                dataIndex: 'contactNumber',
                key: 'contactNumber',
              },
              {
                title: 'Email',
                dataIndex: 'emailAddress',
                key: 'emailAddress',
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit("colleagueReferences")}
                  />
                ),
              },
            ]}
            pagination={false}
            locale={{ emptyText: 'No references added yet' }}
          />
        </Card>
      </section>

      {/* Past Employment Section */}
      <section style={{ marginBottom: 24 }}>
        <Card
          title="Past Employment"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => onEdit("pastEmployment")}
            >
              Add Employment
            </Button>
          }
        >
          <Table
            dataSource={data?.pastEmployment?.employments || []}
            columns={[
              {
                title: 'Employer Name',
                dataIndex: 'employerName',
                key: 'employerName',
              },
              {
                title: 'Designation',
                dataIndex: 'designation',
                key: 'designation',
              },
              {
                title: 'From Date',
                dataIndex: 'fromDate',
                key: 'fromDate',
              },
              {
                title: 'To Date',
                dataIndex: 'toDate',
                key: 'toDate',
              },
              {
                title: 'Contact Person',
                dataIndex: 'contactPersonName',
                key: 'contactPersonName',
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit("pastEmployment")}
                  />
                ),
              },
            ]}
            pagination={false}
            locale={{ emptyText: 'No past employment records added yet' }}
          />
        </Card>
      </section>

      {/* Existing Loans Section */}
      <section style={{ marginBottom: 24 }}>
        <Card
          title="Existing Loans"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => onEdit("existingLoans")}
            >
              Add Loan
            </Button>
          }
        >
          <Table
            dataSource={data?.existingLoans?.loans || []}
            columns={[
              {
                title: 'Bank Name',
                dataIndex: 'bankName',
                key: 'bankName',
              },
              {
                title: 'Purpose',
                dataIndex: 'purpose',
                key: 'purpose',
              },
              {
                title: 'Loan Amount',
                dataIndex: 'loanAmount',
                key: 'loanAmount',
              },
              {
                title: 'EMI',
                dataIndex: 'emi',
                key: 'emi',
              },
              {
                title: 'Tenure',
                dataIndex: 'tenure',
                key: 'tenure',
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit("existingLoans")}
                  />
                ),
              },
            ]}
            pagination={false}
            locale={{ emptyText: 'No existing loans added yet' }}
          />
        </Card>
      </section>

      {/* Photo Capture Section */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Photo Capture">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {data?.uploadedItems?.map((item: any, idx: number) => (
              <div key={item.id} style={{ position: 'relative' }}>
                <Image
                  src={imageUrls[item.id] || ''}
                  alt={`Photo ${idx + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                  preview={false}
                />
                <Button
                  type="text"
                  danger
                  icon={<CloseCircleOutlined />}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    padding: 4
                  }}
                  onClick={() => {
                    // Handle photo removal
                    const updatedItems = data.uploadedItems.filter((i: any) => i.id !== item.id);
                    onEdit("photoCapture");
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '4px 8px',
                  fontSize: '12px'
                }}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Photo {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
};

const FinalObservationsDetails = ({ verificationData, onEdit }: { verificationData: any; onEdit: (formKey: string) => void }) => {
  const { activeTab } = useTabContext();
  if (!verificationData) return null;

  const data = verificationData?.verificationData?.verificationData || {};
  const [editorContent, setEditorContent] = useState(data?.finalObservations?.remarks || '');

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    // You can also trigger the onEdit callback here if you want to save changes immediately
    onEdit("finalObservations");
  };

  return (
    <>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Financial Details"
            bordered
            column={2}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("financialDetails")}
              />
            }
          >
            <Descriptions.Item label="Funds Required">
              {data?.financialDetails?.fundsRequired}
            </Descriptions.Item>
            <Descriptions.Item label="Source of Own Funds">
              {data?.financialDetails?.sourceOfOwnFunds}
            </Descriptions.Item>
            <Descriptions.Item label="Purchase Cost">
              {data?.financialDetails?.purchaseCost}
            </Descriptions.Item>
            <Descriptions.Item label="Savings">
              {data?.financialDetails?.savings}
            </Descriptions.Item>
            <Descriptions.Item label="Construction Estimate">
              {data?.financialDetails?.constructionEstimate}
            </Descriptions.Item>
            <Descriptions.Item label="Family/Friends">
              {data?.financialDetails?.familyFriends}
            </Descriptions.Item>
            <Descriptions.Item label="Registration/Stamp Duty Charges">
              {data?.financialDetails?.registrationCharges}
            </Descriptions.Item>
            <Descriptions.Item label="Other Loan Amount Taken">
              {data?.financialDetails?.otherLoanAmount}
            </Descriptions.Item>
            <Descriptions.Item label="Other Expenses">
              {data?.financialDetails?.otherExpenses}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount Spent">
              {data?.financialDetails?.totalAmountSpent}
            </Descriptions.Item>
            <Descriptions.Item label="Total Transaction Cost">
              {data?.financialDetails?.totalTransactionCost}
            </Descriptions.Item>
            <Descriptions.Item label="Mode of Payment to Seller (Cash)">
              {data?.financialDetails?.paymentModeCash}
            </Descriptions.Item>
            <Descriptions.Item label="Mode of Payment to Seller (Cheque)">
              {data?.financialDetails?.paymentModeCheque}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      <section style={{ marginBottom: 24 }}>
        <Card title="Final Observations">
          <div style={{ height: '400px', marginBottom: '20px' }}>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              style={{ height: '300px' }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'color': [] }, { 'background': [] }],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
            />
          </div>
        </Card>
      </section>
    </>
  );
};

// Create Tab Context
interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabContext = createContext<TabContextType>({
  activeTab: 'PermanentAddress',
  setActiveTab: () => {},
});

const useTabContext = () => useContext(TabContext);

export default function LoanVerifyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [verificationData, setVerificationData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentFormKey, setCurrentFormKey] = useState("");
  const [activeTab, setActiveTab] = useState("PermanentAddress");

  const fetchVerificationData = async () => {
    getVerificationData(id as string).then((res) => {
      setVerificationData(res?.data);
    }).catch((err) => {
      console.error(err);
      message.error('Failed to fetch verification data');
    });
  }

  useEffect(() => {
    if (id) {
     fetchVerificationData();
    }
  }, [id]);

  const handleEdit = (formKey: string) => {
    setCurrentFormKey(formKey);
    setEditModalVisible(true);
  };

  const handleFormSave = (values: any) => {
    // Handle form save logic here
    setEditModalVisible(false);
  };

  const handleApprove = async () => {
    try {
      // Generate final report first
      // const reportResponse = await generateFinalReport(id as string);
      // console.log('Report Response:', reportResponse);
      
      // // Check if we have valid data
      // if (!reportResponse) {
      //   throw new Error('No PDF data received');
      // }

      // // Create a blob URL directly from the response
      // const blob = new Blob([reportResponse], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // setPdfPreviewUrl(url);
      
      // Show the modal after setting the PDF URL
      setModalAction("approve");
      setModalVisible(true);

      // Log for debugging
      console.log('PDF URL created');
    } catch (error) {
      console.error('Error generating final report:', error);
      message.error('Failed to generate final report: ' + (error as Error).message);
    }
  };

  // Clean up the blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        window.URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const getVerificationByType = (type: string) => {
    // Map tab keys to verification types
    const typeMapping: { [key: string]: string } = {
      PermanentAddress: 'PermanentAddress',
      CurrentAddress: 'CurrentAddress',
      Work: 'Work',
      Final: 'Work' // Using Work verification for final observations
    };

    // Get the verification type based on the current tab
    const verificationType = typeMapping[activeTab];
    
    // Find the verification data for the current type
    const verification = verificationData?.verifications?.find((v: any) => v.type === verificationType);
    
    // Return the verification data with the correct structure
    return verification?.verificationData || {};
  };

  const fetchPdf = async () => {
    const reportResponse = await generateFinalReport(id as string);
      console.log('Report Response:', reportResponse);
      
      // Check if we have valid data
      if (!reportResponse) {
        throw new Error('No PDF data received');
      }

      // Create a blob URL directly from the response
      const blob = new Blob([reportResponse], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
  };

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <DashboardLayout>
        <div style={{ paddingBottom: "20px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}>
            <Title level={3} style={{ margin: 0 }}>
              Loan Verification - {verificationData?.applicationNumber}
            </Title>
          </div>

          <Tabs 
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
          >
            <TabPane tab="Permanent Address" key="PermanentAddress">
              <VerificationDetails 
                verificationData={getVerificationByType('PermanentAddress')} 
                onEdit={handleEdit}
              />
            </TabPane>
            <TabPane tab="Current Address" key="CurrentAddress">
              <VerificationDetails 
                verificationData={getVerificationByType('CurrentAddress')} 
                onEdit={handleEdit}
              />
            </TabPane>
            <TabPane tab="Work Verification" key="Work">
              <WorkVerificationDetails 
                verificationData={getVerificationByType('Work')} 
                onEdit={handleEdit}
              />
            </TabPane>
            <TabPane tab="Final Observations" key="Final">
              <FinalObservationsDetails 
                verificationData={getVerificationByType('Work')} 
                onEdit={handleEdit}
              />
              <div style={{
                position: "sticky",
                bottom: 0,
                left: 120,
                right: 40,
                background: "#fff",
                padding: "16px 24px",
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "16px",
                zIndex: 1000,
                boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.06)",
              }}>
                <Space>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setModalAction("reject");
                      setModalVisible(true);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      setModalAction("approve");
                      setModalVisible(true);
                      fetchPdf();
                    }}
                  >
                    Approve
                  </Button>
                </Space>
              </div>
            </TabPane>
          </Tabs>
        </div>

        <Modal
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            if (pdfPreviewUrl) {
              window.URL.revokeObjectURL(pdfPreviewUrl);
            }
            setPdfPreviewUrl(null);
          }}
          footer={null}
          width={900}
          title={
            modalAction === "approve"
              ? "Approve Loan Verification"
              : "Reject Loan Verification"
          }
        >
          <div style={{ marginBottom: 16 }}>
            <strong>PDF Preview:</strong>
            {pdfPreviewUrl ? (
              <object
                data={pdfPreviewUrl}
                type="application/pdf"
                width="100%"
                height={600}
                style={{ border: "1px solid #eee", marginTop: 8 }}
              >
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  Unable to display PDF file. <a href={pdfPreviewUrl} target="_blank" rel="noopener noreferrer">Download</a> instead.
                </div>
              </object>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                Loading PDF preview...
              </div>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            Are you sure you want to{" "}
            {modalAction === "approve" ? "approve" : "reject"} this loan
            verification?
          </div>
          <Space>
            {modalAction === "approve" && (
              <Button
                icon={<DownloadOutlined />}
                type="primary"
                onClick={handleApprove}
              >
                Approve & Download PDF
              </Button>
            )}
            <Button
              type={modalAction === "approve" ? "default" : "primary"}
              onClick={handleApprove}
            >
              {modalAction === "approve" ? "Approve" : "Reject"}
            </Button>
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
          </Space>
        </Modal>

        <EditFormModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onSave={handleFormSave}
          formKey={currentFormKey}
          initialValues={verificationData}
          currentTab={activeTab}
          fetchVerificationData={fetchVerificationData}
        />
      </DashboardLayout>
    </TabContext.Provider>
  );
}
