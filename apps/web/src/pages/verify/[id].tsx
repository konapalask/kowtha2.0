import { useRouter } from "next/router";
import { useState } from "react";
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

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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
  section8: Record<string, any>;
  uploadedItems: Array<{
    id: string;
    uri: string;
    type: string;
    timestamp: string;
  }>;
}

// Dummy data for demo
const dummyLoans = [
  {
    id: 1,
    applicationNumber: "LOAN-001",
    applicantName: "John Doe",
    status: "FVCompleted",
    uploadedAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
    bankName: "HDFC Bank",
    loanType: "Home Loan",
    loanAmount: 500000,
    contactNumber: "9876543210",
    documents: [
      { type: "Work", name: "work_photo1.jpg", url: "#" },
      { type: "Address", name: "address_doc1.pdf", url: "#" },
    ],
    photos: [
      {
        type: "Work",
        url: "https://via.placeholder.com/120?text=Work+Photo+1",
      },
      {
        type: "Address",
        url: "https://via.placeholder.com/120?text=Address+Photo+1",
      },
    ],
    forms: {
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
      addressVerification: {
        addressType: "Residence",
        addressCategory: "Rural",
        addressSubCategory: "Town",
        addressDetails: "kondapur",
        geoTag: "random geo tags",
      },
      residenceDetails: {
        residenceStatus: "Owned",
        rentDetails: "",
        residenceType: "House",
        constructionQuality: "Good",
        standardOfLiving: "Good",
        locationCategory: "Semi-Urban",
        localityType: "Residential",
        accessibility: "Easy",
        houseArea: "12000",
        yearsAtCurrentAddress: "2",
        nameplateVisible: "Yes",
      },
      familyEmploymentDetails: {
        totalFamilyMembers: "5",
        earningMembers: "2",
        dependents: "3",
        isSpouseWorking: "Yes",
        spouseEmploymentDetails: "IT",
        assetsObserved: "Vehicle",
      },
      thirdPartyCheck: {
        tpcName: "Pentayya",
        relationship: "Neighbor",
        feedbackStatus: "Positive",
        comments: "Good",
      },
      finalObservations: {
        cooperativeness: "Neutral",
        overallStatus: "Positive",
        remarks: "Good",
      },
      section8: {},
      uploadedItems: [
        {
          id: "1746694405367",
          uri: "file:///data/user/0/com.mobile/cache/rn_image_picker_lib_temp_664e69aa-2645-4740-a947-695c01f7d6a8.jpg",
          type: "photo",
          timestamp: "2025-05-08T08:53:25.367Z",
        },
      ],
    },
  },
];

export default function LoanVerifyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const loan = dummyLoans.find((l) => l.id === Number(id));
  const [report, setReport] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [pdfPreviewUrl] = useState(
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  );

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
    section8: {},
    uploadedItems: [],
  };

  const [formData, setFormData] = useState<FormData>(
    loan?.forms || defaultFormData
  );

  if (!loan) {
    return (
      <DashboardLayout>
        <div>Loan not found.</div>
      </DashboardLayout>
    );
  }

  const handleEdit = (formKey: string) => {
    console.log(`Editing ${formKey}`);
    // Here you would typically open a modal or navigate to edit the form
  };

  const handleApprove = () => {
    // Collect all form data and prepare for API submission
    const updatedData = {
      loanId: loan.id,
      applicationNumber: loan.applicationNumber,
      forms: formData,
      status: "Approved",
      timestamp: new Date().toISOString(),
    };

    console.log("Updated data to be sent to API:", updatedData);
    // Here you would typically make an API call
    // await api.post('/api/loans/approve', updatedData);
  };

  return (
    <DashboardLayout>
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
        <Space>
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
        </Space>
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
                  {formData.basicDetails.verificationType}
                </Descriptions.Item>
                <Descriptions.Item label="Verification Date">
                  {formData.basicDetails.verificationDate}
                </Descriptions.Item>
                <Descriptions.Item label="Verification Time">
                  {formData.basicDetails.verificationTime}
                </Descriptions.Item>
                <Descriptions.Item label="Verification Mode">
                  {formData.basicDetails.verificationMode}
                </Descriptions.Item>
                <Descriptions.Item label="Verification Status">
                  {formData.basicDetails.verificationStatus}
                </Descriptions.Item>
                <Descriptions.Item label="Verification Remarks">
                  {formData.basicDetails.verificationRemarks}
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
                  {formData.applicantInformation.applicantName}
                </Descriptions.Item>
                <Descriptions.Item label="Applicant Age">
                  {formData.applicantInformation.applicantAge}
                </Descriptions.Item>
                <Descriptions.Item label="Applicant Gender">
                  {formData.applicantInformation.applicantGender}
                </Descriptions.Item>
                <Descriptions.Item label="Marital Status">
                  {formData.applicantInformation.applicantMaritalStatus}
                </Descriptions.Item>
                <Descriptions.Item label="Education Level">
                  {formData.applicantInformation.applicantEducation}
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
                  {formData.residenceDetails.residenceStatus}
                </Descriptions.Item>
                <Descriptions.Item label="Rent Details">
                  {formData.residenceDetails.rentDetails}
                </Descriptions.Item>
                <Descriptions.Item label="Type of Residence">
                  {formData.residenceDetails.residenceType}
                </Descriptions.Item>
                <Descriptions.Item label="Construction Quality">
                  {formData.residenceDetails.constructionQuality}
                </Descriptions.Item>
                <Descriptions.Item label="Standard of Living">
                  {formData.residenceDetails.standardOfLiving}
                </Descriptions.Item>
                <Descriptions.Item label="Location Category">
                  {formData.residenceDetails.locationCategory}
                </Descriptions.Item>
                <Descriptions.Item label="Locality Type">
                  {formData.residenceDetails.localityType}
                </Descriptions.Item>
                <Descriptions.Item label="Accessibility">
                  {formData.residenceDetails.accessibility}
                </Descriptions.Item>
                <Descriptions.Item label="House Area">
                  {formData.residenceDetails.houseArea}
                </Descriptions.Item>
                <Descriptions.Item label="Years at Current Address">
                  {formData.residenceDetails.yearsAtCurrentAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Nameplate Visible">
                  {formData.residenceDetails.nameplateVisible}
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
                  {formData.familyEmploymentDetails.totalFamilyMembers}
                </Descriptions.Item>
                <Descriptions.Item label="No. of Earning Members">
                  {formData.familyEmploymentDetails.earningMembers}
                </Descriptions.Item>
                <Descriptions.Item label="No. of Dependents">
                  {formData.familyEmploymentDetails.dependents}
                </Descriptions.Item>
                <Descriptions.Item label="Is Spouse Working">
                  {formData.familyEmploymentDetails.isSpouseWorking}
                </Descriptions.Item>
                <Descriptions.Item label="Spouse's Employment Details">
                  {formData.familyEmploymentDetails.spouseEmploymentDetails}
                </Descriptions.Item>
                <Descriptions.Item label="Assets Observed">
                  {formData.familyEmploymentDetails.assetsObserved}
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
                  {formData.addressVerification.addressType}
                </Descriptions.Item>
                <Descriptions.Item label="Address Category">
                  {formData.addressVerification.addressCategory}
                </Descriptions.Item>
                <Descriptions.Item label="Address Sub-Category">
                  {formData.addressVerification.addressSubCategory}
                </Descriptions.Item>
                <Descriptions.Item label="Address Details">
                  {formData.addressVerification.addressDetails}
                </Descriptions.Item>
                <Descriptions.Item label="Geo Tag">
                  {formData.addressVerification.geoTag}
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
                  {formData.thirdPartyCheck.tpcName}
                </Descriptions.Item>
                <Descriptions.Item label="Relationship">
                  {formData.thirdPartyCheck.relationship}
                </Descriptions.Item>
                <Descriptions.Item label="Feedback Status">
                  {formData.thirdPartyCheck.feedbackStatus}
                </Descriptions.Item>
                <Descriptions.Item label="Comments">
                  {formData.thirdPartyCheck.comments}
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
                  {formData.finalObservations.cooperativeness}
                </Descriptions.Item>
                <Descriptions.Item label="Overall Status">
                  {formData.finalObservations.overallStatus}
                </Descriptions.Item>
                <Descriptions.Item label="Remarks">
                  {formData.finalObservations.remarks}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </section>

          <section style={{ marginBottom: 24 }}>
            <Card>
              <Descriptions title="Photo Capture" bordered column={1}>
                {formData.uploadedItems?.map((item, idx) => (
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
                    {loan.documents
                      .filter((d) => d.type === "Work")
                      .map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.name}
                        </a>
                      ))}
                    {loan.photos
                      .filter((p) => p.type === "Work")
                      .map((photo, idx) => (
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
                    {loan.documents
                      .filter((d) => d.type === "Address")
                      .map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.name}
                        </a>
                      ))}
                    {loan.photos
                      .filter((p) => p.type === "Address")
                      .map((photo, idx) => (
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
    </DashboardLayout>
  );
}
