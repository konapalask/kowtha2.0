import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl } from "@/utils/utility";
import {
  CloseCircleOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Descriptions, Image, Table } from "antd";
import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useState } from "react";
// import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import EditRequestLogs from "./EditRequestLogs";
import Footer from "./Footer";
import { useRouter } from "next/router";

// interface TabContextType {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }
// const TabContext = createContext<TabContextType>({
//   activeTab: 'PermanentAddress',
//   setActiveTab: () => {},
// });
// const useTabContext = () =>useContext(TabContext)

export const WorkVerificationDetails = ({
  verificationData,
  onEdit,
}: {
  verificationData: any;
  onEdit: (formKey: string) => void;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { activeTab } = useTabContext();
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [editorContent, setEditorContent] = useState(
    verificationData?.finalObservations?.remarks || "<ul><li></li></ul>"
  );
  console.log(editorContent);
  const [changedData, setChangedData] = useState<any>({});

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (verificationData?.uploadedItems) {
        const urls: { [key: string]: string } = {};
        for (const item of verificationData.uploadedItems) {
          try {
            const response = await getS3ImageUrl(item.s3ImageUrl);
            urls[item.id] = response;
          } catch (error) {
            console.error("Error fetching image URL:", error);
          }
        }
        setImageUrls(urls);
      }
    };

    fetchImageUrls();
  }, [verificationData?.uploadedItems]);

  if (!verificationData) return null;

  const data = verificationData || {};

  const handleEditorChange = (content: string) => {
    const liMatch = content.match(/<li>/g);
    const liCount = liMatch ? liMatch.length : 0;

    if (liCount === 0) {
      // force at least one <li>
      setEditorContent("<ul><li></li></ul>");
    } else {
      setEditorContent(content);
    }
  };
  const getButton = (formKey: string) => (
    <Button
      type="text"
      icon={<EditOutlined />}
      onClick={() => onEdit(formKey)}
    />
  );

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
              {data?.basicDetails?.applicantName || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Name of the Bank">
              {data?.basicDetails?.bankName || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Prospect Number">
              {data?.basicDetails?.prospectNumber || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Purpose of Loan">
              {data?.basicDetails?.purposeOfLoan || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Loan Amount">
              {data?.basicDetails?.loanAmount || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Tenure">
              {data?.basicDetails?.tenure || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="PAN Number">
              {data?.basicDetails?.panNumber || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Aadhar Number">
              {data?.basicDetails?.aadharNumber || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Qualification">
              {data?.basicDetails?.qualification || "No data"}
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
              {data?.employmentDetails?.currentOfficeName || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Office Address">
              {data?.employmentDetails?.officeAddress || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Years in Current Job">
              {data?.employmentDetails?.yearsInCurrentJob || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Total Work Experience">
              {data?.employmentDetails?.totalWorkExperience || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Company Size">
              {data?.employmentDetails?.companySize || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Nature of Service/Business">
              {data?.employmentDetails?.natureOfService || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Office Locality">
              {data?.employmentDetails?.officeLocality || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="ID Card Number">
              {data?.employmentDetails?.idCardNumber || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Designation">
              {data?.employmentDetails?.designation || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Mode of Salary">
              {data?.employmentDetails?.salaryMode || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Type of Employer">
              {data?.employmentDetails?.employerType || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Gross Salary per Month">
              {data?.employmentDetails?.grossSalary || "No data"}
            </Descriptions.Item>
            <Descriptions.Item label="Net Salary per Month">
              {data?.employmentDetails?.netSalary || "No data"}
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
                title: "Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Designation",
                dataIndex: "designation",
                key: "designation",
              },
              {
                title: "Years Known",
                dataIndex: "yearsKnown",
                key: "yearsKnown",
              },
              {
                title: "Contact Number",
                dataIndex: "contactNumber",
                key: "contactNumber",
              },
              {
                title: "Email",
                dataIndex: "emailAddress",
                key: "emailAddress",
              },
              {
                title: "Actions",
                key: "actions",
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
            locale={{ emptyText: "No references added yet" }}
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
                title: "Employer Name",
                dataIndex: "employerName",
                key: "employerName",
              },
              {
                title: "Designation",
                dataIndex: "designation",
                key: "designation",
              },
              {
                title: "From Date",
                dataIndex: "fromDate",
                key: "fromDate",
              },
              {
                title: "To Date",
                dataIndex: "toDate",
                key: "toDate",
              },
              {
                title: "Contact Person",
                dataIndex: "contactPersonName",
                key: "contactPersonName",
              },
              {
                title: "Actions",
                key: "actions",
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
            locale={{ emptyText: "No past employment records added yet" }}
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
                title: "Bank Name",
                dataIndex: "bankName",
                key: "bankName",
              },
              {
                title: "Purpose",
                dataIndex: "purpose",
                key: "purpose",
              },
              {
                title: "Loan Amount",
                dataIndex: "loanAmount",
                key: "loanAmount",
              },
              {
                title: "EMI",
                dataIndex: "emi",
                key: "emi",
              },
              {
                title: "Tenure",
                dataIndex: "tenure",
                key: "tenure",
              },
              {
                title: "Actions",
                key: "actions",
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
            locale={{ emptyText: "No existing loans added yet" }}
          />
        </Card>
      </section>

      {/* Photo Capture Section */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Photo Capture">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {data?.uploadedItems?.map((item: any, idx: number) => (
              <div key={item.id} style={{ position: "relative" }}>
                <Image
                  src={imageUrls[item.id] || ""}
                  alt={`Photo ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  preview={false}
                />
                <Button
                  type="text"
                  danger
                  icon={<CloseCircleOutlined />}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "50%",
                    padding: 4,
                  }}
                  onClick={() => {
                    // Handle photo removal
                    const updatedItems = data.uploadedItems.filter(
                      (i: any) => i.id !== item.id
                    );
                    onEdit("photoCapture");
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    padding: "4px 8px",
                    fontSize: "12px",
                  }}
                >
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Photo{" "}
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section style={{ marginBottom: 24 }}>
        <EditRequestLogs currentData={data} editRequestData={undefined} />
      </section>

      {/* Final Observations Section */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Final Observations">
          <div style={{ height: "400px" }}>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              style={{ height: "300px" }}
              modules={{
                toolbar: {
                  container: "#custom-toolbar",
                },
              }}
              formats={["list"]}
              placeholder=" Enter final observations here..."
            />
          </div>
        </Card>
      </section>
      <Footer editorContent={editorContent} />
    </>
  );
};
