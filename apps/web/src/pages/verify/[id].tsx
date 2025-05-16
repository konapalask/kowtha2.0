import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  MailOutlined,
  EditOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import dynamic from "next/dynamic";
import React from "react";
import { getVerificationData } from "@/services/verifier.services";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";

const { Title } = Typography;

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
}

interface EditFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  formKey: string;
  initialValues: any;
}

const EditFormModal: React.FC<EditFormModalProps> = ({
  visible,
  onCancel,
  onSave,
  formKey,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Reset form when modal opens with new values
  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const getFormFields = () => {
    switch (formKey) {
      case "basicDetails":
        return [
          { name: "verificationType", label: "Verification Type", type: "input" },
          { name: "verificationDate", label: "Verification Date", type: "input" },
          { name: "verificationTime", label: "Verification Time", type: "input" },
          { name: "verificationMode", label: "Verification Mode", type: "input" },
          { name: "verificationStatus", label: "Verification Status", type: "input" },
          { name: "verificationRemarks", label: "Verification Remarks", type: "textarea" },
        ];
      case "applicantInformation":
        return [
          { name: "applicantName", label: "Applicant Name", type: "input" },
          { name: "applicantAge", label: "Applicant Age", type: "input" },
          { name: "applicantGender", label: "Applicant Gender", type: "select", options: ["Male", "Female", "Other"] },
          { name: "applicantMaritalStatus", label: "Marital Status", type: "select", options: ["Single", "Married", "Divorced", "Widowed"] },
          { name: "applicantEducation", label: "Education Level", type: "input" },
        ];
      case "residenceDetails":
        return [
          { name: "residenceStatus", label: "Residence Status", type: "select", options: ["Owned", "Rented", "Leased"] },
          { name: "rentDetails", label: "Rent Details", type: "input" },
          { name: "residenceType", label: "Type of Residence", type: "select", options: ["House", "Apartment", "Villa"] },
          { name: "constructionQuality", label: "Construction Quality", type: "select", options: ["Excellent", "Good", "Average", "Poor"] },
          { name: "standardOfLiving", label: "Standard of Living", type: "select", options: ["Excellent", "Good", "Average", "Poor"] },
          { name: "locationCategory", label: "Location Category", type: "select", options: ["Urban", "Semi-Urban", "Rural"] },
          { name: "localityType", label: "Locality Type", type: "select", options: ["Residential", "Commercial", "Mixed"] },
          { name: "accessibility", label: "Accessibility", type: "select", options: ["Easy", "Moderate", "Difficult"] },
          { name: "houseArea", label: "House Area", type: "input" },
          { name: "yearsAtCurrentAddress", label: "Years at Current Address", type: "input" },
          { name: "nameplateVisible", label: "Nameplate Visible", type: "select", options: ["Yes", "No"] },
        ];
      case "familyEmploymentDetails":
        return [
          { name: "totalFamilyMembers", label: "Total Family Members", type: "input" },
          { name: "earningMembers", label: "No. of Earning Members", type: "input" },
          { name: "dependents", label: "No. of Dependents", type: "input" },
          { name: "isSpouseWorking", label: "Is Spouse Working", type: "select", options: ["Yes", "No"] },
          { name: "spouseEmploymentDetails", label: "Spouse's Employment Details", type: "input" },
          { name: "assetsObserved", label: "Assets Observed", type: "input" },
        ];
      case "addressVerification":
        return [
          { name: "addressType", label: "Address Type", type: "select", options: ["Residence", "Office", "Business", "Other"] },
          { name: "addressCategory", label: "Address Category", type: "select", options: ["Urban", "Rural", "Semi-Urban"] },
          { name: "addressSubCategory", label: "Address Sub-Category", type: "select", options: ["Metropolitan", "City", "Town", "Village", "Industrial Area", "Commercial Area"] },
          { name: "addressDetails", label: "Address Details", type: "textarea" },
          { name: "geoTag", label: "Geo Tag", type: "input" },
        ];
      case "thirdPartyCheck":
        return [
          { name: "tpcName", label: "Name of TPC/Neighbor", type: "input" },
          { name: "relationship", label: "Relationship to Applicant", type: "select", options: ["Neighbor", "Friend", "Local Shop Owner", "Other"] },
          { name: "feedbackStatus", label: "Feedback Status", type: "select", options: ["Positive", "Negative", "Could Not Confirm"] },
          { name: "comments", label: "Comments/Remarks", type: "textarea" },
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
      default:
        return [];
    }
  };

  const renderFormField = (field: {
    type: string;
    options?: string[];
    name: string;
    label: string;
  }) => {
    switch (field.type) {
      case "input":
        return <Input />;
      case "textarea":
        return <Input.TextArea rows={4} />;
      case "select":
        return (
          <Select
            allowClear
            placeholder={`Select ${field.label}`}
            notFoundContent="No options available"
          >
            {field.options?.filter(Boolean).map((option: string) => (
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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
    });
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
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        preserve={false}
      >
        <Row gutter={[16, 16]}>
          {getFormFields().map((field) => (
            <Col span={8} key={field.name}>
              <Form.Item
                name={field.name}
                label={field.label}
                rules={[{ required: true, message: `Please enter ${field.label}` }]}
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

export default function LoanVerifyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const loan: any = 4;
  const [report, setReport] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [pdfPreviewUrl] = useState(
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentFormKey, setCurrentFormKey] = useState("");

  const defaultFormData: FormData = {
    basicDetails: {
      verificationType: "",
      verificationDate: "",
      verificationTime: "",
      verificationMode: "",
      verificationStatus: "",
      verificationRemarks: "",
    },
    applicantInformation: {
      applicantName: "",
      applicantAge: "",
      applicantGender: "",
      applicantMaritalStatus: "",
      applicantEducation: "",
    },
    residenceDetails: {
      residenceStatus: "",
      rentDetails: "",
      residenceType: "",
      constructionQuality: "",
      standardOfLiving: "",
      locationCategory: "",
      localityType: "",
      accessibility: "",
      houseArea: "",
      yearsAtCurrentAddress: "",
      nameplateVisible: "",
    },
    familyEmploymentDetails: {
      totalFamilyMembers: "",
      earningMembers: "",
      dependents: "",
      isSpouseWorking: "",
      spouseEmploymentDetails: "",
      assetsObserved: "",
    },
    addressVerification: {
      addressType: "",
      addressCategory: "",
      addressSubCategory: "",
      addressDetails: "",
      geoTag: "",
    },
    thirdPartyCheck: {
      tpcName: "",
      relationship: "",
      feedbackStatus: "",
      comments: "",
    },
    finalObservations: {
      cooperativeness: "",
      overallStatus: "",
      remarks: "",
    },
    officeVerification: {
      applicantName: "",
      bankName: "",
      prospectNumber: "",
      purposeOfLoan: "",
      loanAmount: "",
      tenure: "",
      panNumber: "",
      aadharNumber: "",
      qualification: "",
      currentOfficeName: "",
      officeAddress: "",
      yearsInCurrentJob: "",
      totalWorkExperience: "",
      companySize: "",
      natureOfService: "",
      officeLocality: "",
      idCardNumber: "",
      designation: "",
      salaryMode: "",
      employerType: "",
      grossSalary: "",
      netSalary: "",
      previousCompanyName: "",
      workExperience: "",
      existingLoans: "",
      references: "",
    },
    section8: {},
    uploadedItems: [],
  };

  const [formData, setFormData] = useState<FormData>(
   defaultFormData
  );

  useEffect(() => {
    getVerificationData(id as string).then((res) => {
      // setFormData(data);
      // form.setFieldsValue(res?.data?.[0]?.verificationData)
      setFormData(res?.data?.verifications?.filter((item: any) => item.type === "PermanentAddress")?.[0]?.verificationData?.verificationData);
      // console.log(res?.data?.verifications?.[0]?.verificationData?.verificationData);
      console.log(res?.data?.verifications?.filter((item: any) => item.type === "PermanentAddress")?.[0]?.verificationData?.verificationData);
    });
  }, [id]);

  if (!loan) {
    return (
      <DashboardLayout>
        <div>Loan not found.</div>
      </DashboardLayout>
    );
  }

  const handleEdit = (formKey: string) => {
    setCurrentFormKey(formKey);
    setEditModalVisible(true);
  };

  const handleFormSave = (values: any) => {
    setFormData((prev) => ({
      ...prev,
      [currentFormKey]: values,
    }));
    setEditModalVisible(false);
  };

  const handleApprove = () => {
    // Collect all form data and prepare for API submission
    const updatedData: any = {
      loanId: loan?.id,
      applicationNumber: loan?.applicationNumber,
      forms: formData,
      status: "Approved",
      timestamp: new Date().toISOString(),
    };
    router.push(`/verify`);
    message.success(`loan approved`);

    console.log("Updated data to be sent to API:", updatedData);
    // Here you would typically make an API call
    // await api.post('/api/loans/approve', updatedData);
  };

  return (
    <DashboardLayout>
      <div style={{ paddingBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Loan Verification - {loan.applicationNumber}
          </Title>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {/* Left column: forms and documents */}
          <div style={{ flex: 1, minWidth: 320 }}>
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
                      onClick={() => handleEdit("basicDetails")}
                    />
                  }
                >
                  <Descriptions.Item label="Verification Type">
                    {formData?.basicDetails?.verificationType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Verification Date">
                    {formData?.basicDetails?.verificationDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Verification Time">
                    {formData?.basicDetails?.verificationTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="Verification Mode">
                    {formData?.basicDetails?.verificationMode}
                  </Descriptions.Item>
                  <Descriptions.Item label="Verification Status">
                    {formData?.basicDetails?.verificationStatus}
                  </Descriptions.Item>
                  <Descriptions.Item label="Verification Remarks">
                    {formData?.basicDetails?.verificationRemarks}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>

            <section style={{ marginBottom: 24 }}>
              <Card>
                <Descriptions
                  title="Applicant Information"
                  bordered
                  column={2}
                  extra={
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit("applicantInformation")}
                    />
                  }
                >
                  <Descriptions.Item label="Applicant Name">
                    {formData?.applicantInformation?.applicantName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Applicant Age">
                    {formData?.applicantInformation?.applicantAge}
                  </Descriptions.Item>
                  <Descriptions.Item label="Applicant Gender">
                    {formData?.applicantInformation?.applicantGender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Marital Status">
                    {formData?.applicantInformation?.applicantMaritalStatus}
                  </Descriptions.Item>
                  <Descriptions.Item label="Education Level">
                    {formData?.applicantInformation?.applicantEducation}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>

            <section style={{ marginBottom: 24 }}>
              <Card>
                <Descriptions
                  title="Office Verification"
                  bordered
                  column={2}
                  extra={
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit("officeVerification")}
                    />
                  }
                >
                  <Descriptions.Item label="Name of the Applicant">
                    {formData?.officeVerification?.applicantName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Name of the Bank">
                    {formData?.officeVerification?.bankName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Prospect Number">
                    {formData?.officeVerification?.prospectNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Purpose of Loan">
                    {formData?.officeVerification?.purposeOfLoan}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loan Amount">
                    {formData?.officeVerification?.loanAmount}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tenure">
                    {formData?.officeVerification?.tenure}
                  </Descriptions.Item>
                  <Descriptions.Item label="PAN Number">
                    {formData?.officeVerification?.panNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Aadhar Number">
                    {formData?.officeVerification?.aadharNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Qualification">
                    {formData?.officeVerification?.qualification}
                  </Descriptions.Item>
                  <Descriptions.Item label="Current Office Name">
                    {formData?.officeVerification?.currentOfficeName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Office Address">
                    {formData?.officeVerification?.officeAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label="Years in Current Job">
                    {formData?.officeVerification?.yearsInCurrentJob}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Work Experience">
                    {formData?.officeVerification?.totalWorkExperience}
                  </Descriptions.Item>
                  <Descriptions.Item label="Company Size">
                    {formData?.officeVerification?.companySize}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nature of Service/Business">
                    {formData?.officeVerification?.natureOfService}
                  </Descriptions.Item>
                  <Descriptions.Item label="Office Locality">
                    {formData?.officeVerification?.officeLocality}
                  </Descriptions.Item>
                  <Descriptions.Item label="ID Card Number">
                    {formData?.officeVerification?.idCardNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Designation">
                    {formData?.officeVerification?.designation}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mode of Salary">
                    {formData?.officeVerification?.salaryMode}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type of Employer">
                    {formData?.officeVerification?.employerType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gross Salary per Month">
                    {formData?.officeVerification?.grossSalary}
                  </Descriptions.Item>
                  <Descriptions.Item label="Net Salary per Month">
                    {formData?.officeVerification?.netSalary}
                  </Descriptions.Item>
                  <Descriptions.Item label="Previous Company Name">
                    {formData?.officeVerification?.previousCompanyName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Work Experience">
                    {formData?.officeVerification?.workExperience}
                  </Descriptions.Item>
                  <Descriptions.Item label="Existing Loans">
                    {formData?.officeVerification?.existingLoans}
                  </Descriptions.Item>
                  <Descriptions.Item label="References (Colleagues)">
                    {formData?.officeVerification?.references}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>

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
                      onClick={() => handleEdit("addressVerification")}
                    />
                  }
                >
                  <Descriptions.Item label="Address Type">
                    {formData?.addressVerification?.addressType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address Category">
                    {formData?.addressVerification?.addressCategory}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address Sub-Category">
                    {formData?.addressVerification?.addressSubCategory}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address Details">
                    {formData?.addressVerification?.addressDetails}
                  </Descriptions.Item>
                  <Descriptions.Item label="Geo Tag">
                    {formData?.addressVerification?.geoTag}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>

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
                      onClick={() => handleEdit("residenceDetails")}
                    />
                  }
                >
                  <Descriptions.Item label="Residence Status">
                    {formData?.residenceDetails?.residenceStatus}
                  </Descriptions.Item>
                  <Descriptions.Item label="Rent Details">
                    {formData?.residenceDetails?.rentDetails}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type of Residence">
                    {formData?.residenceDetails?.residenceType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Construction Quality">
                    {formData?.residenceDetails?.constructionQuality}
                  </Descriptions.Item>
                  <Descriptions.Item label="Standard of Living">
                    {formData?.residenceDetails?.standardOfLiving}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location Category">
                    {formData?.residenceDetails?.locationCategory}
                  </Descriptions.Item>
                  <Descriptions.Item label="Locality Type">
                    {formData?.residenceDetails?.localityType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Accessibility">
                    {formData?.residenceDetails?.accessibility}
                  </Descriptions.Item>
                  <Descriptions.Item label="House Area">
                    {formData?.residenceDetails?.houseArea}
                  </Descriptions.Item>
                  <Descriptions.Item label="Years at Current Address">
                    {formData?.residenceDetails?.yearsAtCurrentAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nameplate Visible">
                    {formData?.residenceDetails?.nameplateVisible}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>

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
                      onClick={() => handleEdit("familyEmploymentDetails")}
                    />
                  }
                >
                  <Descriptions.Item label="Total Family Members">
                    {formData?.familyEmploymentDetails?.totalFamilyMembers}
                  </Descriptions.Item>
                  <Descriptions.Item label="No. of Earning Members">
                    {formData?.familyEmploymentDetails?.earningMembers}
                  </Descriptions.Item>
                  <Descriptions.Item label="No. of Dependents">
                    {formData?.familyEmploymentDetails?.dependents}
                  </Descriptions.Item>
                  <Descriptions.Item label="Is Spouse Working">
                    {formData?.familyEmploymentDetails?.isSpouseWorking}
                  </Descriptions.Item>
                  <Descriptions.Item label="Spouse's Employment Details">
                    {formData?.familyEmploymentDetails?.spouseEmploymentDetails}
                  </Descriptions.Item>
                  <Descriptions.Item label="Assets Observed">
                    {formData?.familyEmploymentDetails?.assetsObserved}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>

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
                      onClick={() => handleEdit("thirdPartyCheck")}
                    />
                  }
                >
                  <Descriptions.Item label="TPC Name">
                    {formData?.thirdPartyCheck?.tpcName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Relationship">
                    {formData?.thirdPartyCheck?.relationship}
                  </Descriptions.Item>
                  <Descriptions.Item label="Feedback Status">
                    {formData?.thirdPartyCheck?.feedbackStatus}
                  </Descriptions.Item>
                  <Descriptions.Item label="Comments">
                    {formData?.thirdPartyCheck?.comments}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>

            <section style={{ marginBottom: 24 }}>
              <Card>
                <Descriptions
                  title="Final Observations"
                  bordered
                  column={2}
                  extra={
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit("finalObservations")}
                    />
                  }
                >
                  <Descriptions.Item label="Cooperativeness">
                    {formData?.finalObservations?.cooperativeness}
                  </Descriptions.Item>
                  <Descriptions.Item label="Overall Status">
                    {formData?.finalObservations?.overallStatus}
                  </Descriptions.Item>
                  <Descriptions.Item label="Remarks">
                    {formData?.finalObservations?.remarks}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>

            <section style={{ marginBottom: 24 }}>
              <Card>
                <Descriptions title="Photo Capture" bordered column={1}>
                  {formData?.uploadedItems?.map((item, idx) => (
                    <Descriptions.Item
                      label={`${
                        item.type.charAt(0).toUpperCase() + item.type.slice(1)
                      } Photo ${idx + 1}`}
                    >
                      {item.uri}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>
            </section>

            <section style={{ marginBottom: 24 }}>
              <Card>
                <Descriptions title="Documents & Photos" bordered column={1}>
                  <Descriptions.Item label="Work Verification">
                    <Space direction="vertical">
                      {loan?.documents
                        ?.filter((d: any) => d.type === "Work")
                        .map((doc: any, idx: any) => (
                          <a
                            key={idx}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {doc.name}
                          </a>
                        ))}
                      {loan?.photos
                        ?.filter((p: any) => p.type === "Work")
                        .map((photo: any, idx: any) => (
                          <img
                            key={idx}
                            src={photo.url}
                            alt="Work Photo"
                            style={{ width: 120, borderRadius: 4 }}
                          />
                        ))}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Address Verification">
                    <Space direction="vertical">
                      {loan?.documents
                        ?.filter((d: any) => d.type === "Address")
                        .map((doc: any, idx: any) => (
                          <a
                            key={idx}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {doc.name}
                          </a>
                        ))}
                      {loan?.photos
                        ?.filter((p: any) => p.type === "Address")
                        .map((photo: any, idx: any) => (
                          <img
                            key={idx}
                            src={photo.url}
                            alt="Address Photo"
                            style={{ width: 120, borderRadius: 4 }}
                          />
                        ))}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>
          </div>
        </div>
      </div>

      <div
        style={{
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
        }}
      >
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
            }}
          >
            Approve
          </Button>
        </Space>
      </div>

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
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
          <iframe
            src={pdfPreviewUrl}
            width="100%"
            height={600}
            style={{ border: "1px solid #eee", marginTop: 8 }}
            title="PDF Preview"
          />
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
        initialValues={formData?.[currentFormKey as keyof FormData]}
      />
    </DashboardLayout>
  );
}
