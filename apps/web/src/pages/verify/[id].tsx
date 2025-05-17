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
  Tabs,
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
import { getVerificationData, generateFinalReport } from "@/services/verifier.services";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";

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

const VerificationDetails = ({ verificationData, onEdit }: { verificationData: any; onEdit: (formKey: string) => void }) => {
  if (!verificationData) return null;

  const data = verificationData?.verificationData?.verificationData || {};

  return (
    <>
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
            <Descriptions.Item label="Verification Type">
              {data?.basicDetails?.verificationType}
            </Descriptions.Item>
            <Descriptions.Item label="Verification Date">
              {data?.basicDetails?.verificationDate}
            </Descriptions.Item>
            <Descriptions.Item label="Verification Time">
              {data?.basicDetails?.verificationTime}
            </Descriptions.Item>
            <Descriptions.Item label="Verification Mode">
              {data?.basicDetails?.verificationMode}
            </Descriptions.Item>
            <Descriptions.Item label="Verification Status">
              {data?.basicDetails?.verificationStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Verification Remarks">
              {data?.basicDetails?.verificationRemarks}
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
                onClick={() => onEdit("addressVerification")}
              />
            }
          >
            <Descriptions.Item label="Address Type">
              {data?.addressVerification?.addressType}
            </Descriptions.Item>
            <Descriptions.Item label="Address Category">
              {data?.addressVerification?.addressCategory}
            </Descriptions.Item>
            <Descriptions.Item label="Address Sub-Category">
              {data?.addressVerification?.addressSubCategory}
            </Descriptions.Item>
            <Descriptions.Item label="Address Details">
              {data?.addressVerification?.addressDetails}
            </Descriptions.Item>
            <Descriptions.Item label="Geo Tag">
              {data?.addressVerification?.geoTag}
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
                onClick={() => onEdit("residenceDetails")}
              />
            }
          >
            <Descriptions.Item label="Residence Status">
              {data?.residenceDetails?.residenceStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Rent Details">
              {data?.residenceDetails?.rentDetails}
            </Descriptions.Item>
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
                onClick={() => onEdit("finalObservations")}
              />
            }
          >
            <Descriptions.Item label="Cooperativeness">
              {data?.finalObservations?.cooperativeness}
            </Descriptions.Item>
            <Descriptions.Item label="Overall Status">
              {data?.finalObservations?.overallStatus}
            </Descriptions.Item>
            <Descriptions.Item label="Remarks">
              {data?.finalObservations?.remarks}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>

      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions title="Photo Capture" bordered column={1}>
            {data?.uploadedItems?.map((item: any, idx: number) => (
              <Descriptions.Item
                key={item.id}
                label={`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Photo ${idx + 1}`}
              >
                <img
                  src={item.uri}
                  alt={`Photo ${idx + 1}`}
                  style={{ maxWidth: '200px', borderRadius: '4px' }}
                />
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      </section>
    </>
  );
};

const WorkVerificationDetails = ({ verificationData, onEdit }: { verificationData: any; onEdit: (formKey: string) => void }) => {
  if (!verificationData) return null;

  const data = verificationData?.verificationData?.verificationData || {};

  return (
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
              onClick={() => onEdit("officeVerification")}
            />
          }
        >
          <Descriptions.Item label="Name of the Applicant">
            {data?.officeVerification?.applicantName}
          </Descriptions.Item>
          <Descriptions.Item label="Name of the Bank">
            {data?.officeVerification?.bankName}
          </Descriptions.Item>
          <Descriptions.Item label="Prospect Number">
            {data?.officeVerification?.prospectNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Purpose of Loan">
            {data?.officeVerification?.purposeOfLoan}
          </Descriptions.Item>
          <Descriptions.Item label="Loan Amount">
            {data?.officeVerification?.loanAmount}
          </Descriptions.Item>
          <Descriptions.Item label="Tenure">
            {data?.officeVerification?.tenure}
          </Descriptions.Item>
          <Descriptions.Item label="PAN Number">
            {data?.officeVerification?.panNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Aadhar Number">
            {data?.officeVerification?.aadharNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Qualification">
            {data?.officeVerification?.qualification}
          </Descriptions.Item>
          <Descriptions.Item label="Current Office Name">
            {data?.officeVerification?.currentOfficeName}
          </Descriptions.Item>
          <Descriptions.Item label="Office Address">
            {data?.officeVerification?.officeAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Years in Current Job">
            {data?.officeVerification?.yearsInCurrentJob}
          </Descriptions.Item>
          <Descriptions.Item label="Total Work Experience">
            {data?.officeVerification?.totalWorkExperience}
          </Descriptions.Item>
          <Descriptions.Item label="Company Size">
            {data?.officeVerification?.companySize}
          </Descriptions.Item>
          <Descriptions.Item label="Nature of Service/Business">
            {data?.officeVerification?.natureOfService}
          </Descriptions.Item>
          <Descriptions.Item label="Office Locality">
            {data?.officeVerification?.officeLocality}
          </Descriptions.Item>
          <Descriptions.Item label="ID Card Number">
            {data?.officeVerification?.idCardNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Designation">
            {data?.officeVerification?.designation}
          </Descriptions.Item>
          <Descriptions.Item label="Mode of Salary">
            {data?.officeVerification?.salaryMode}
          </Descriptions.Item>
          <Descriptions.Item label="Type of Employer">
            {data?.officeVerification?.employerType}
          </Descriptions.Item>
          <Descriptions.Item label="Gross Salary per Month">
            {data?.officeVerification?.grossSalary}
          </Descriptions.Item>
          <Descriptions.Item label="Net Salary per Month">
            {data?.officeVerification?.netSalary}
          </Descriptions.Item>
          <Descriptions.Item label="Previous Company Name">
            {data?.officeVerification?.previousCompanyName}
          </Descriptions.Item>
          <Descriptions.Item label="Work Experience">
            {data?.officeVerification?.workExperience}
          </Descriptions.Item>
          <Descriptions.Item label="Existing Loans">
            {data?.officeVerification?.existingLoans}
          </Descriptions.Item>
          <Descriptions.Item label="References (Colleagues)">
            {data?.officeVerification?.references}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default function LoanVerifyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [verificationData, setVerificationData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(null);
  const [pdfPreviewUrl] = useState("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentFormKey, setCurrentFormKey] = useState("");

  useEffect(() => {
    if (id) {
      getVerificationData(id as string).then((res) => {
        setVerificationData(res?.data);
      }).catch((err) => {
        console.error(err);
        message.error('Failed to fetch verification data');
      });
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
      const reportResponse = await generateFinalReport(id as string);
      console.log('Final Report Response:', reportResponse);

      // Then proceed with approval
      // router.push(`/verify`);
      message.success(`loan approved`);
    } catch (error) {
      console.error('Error generating final report:', error);
      message.error('Failed to generate final report');
    }
  };

  const getVerificationByType = (type: string) => {
    return verificationData?.verifications?.find((v: any) => v.type === type);
  };

  return (
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

        <Tabs defaultActiveKey="permanent">
          <TabPane tab="Permanent Address" key="permanent">
            <VerificationDetails 
              verificationData={getVerificationByType('PermanentAddress')} 
              onEdit={handleEdit}
            />
          </TabPane>
          <TabPane tab="Current Address" key="current">
            <VerificationDetails 
              verificationData={getVerificationByType('CurrentAddress')} 
              onEdit={handleEdit}
            />
          </TabPane>
          <TabPane tab="Work Verification" key="work">
            <WorkVerificationDetails 
              verificationData={getVerificationByType('Work')} 
              onEdit={handleEdit}
            />
          </TabPane>
        </Tabs>
      </div>

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
        initialValues={verificationData?.[currentFormKey as keyof FormData]}
      />
    </DashboardLayout>
  );
}
