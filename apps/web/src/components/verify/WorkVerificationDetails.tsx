import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl } from "@/utils/utility";
import {
  // CloseCircleOutlined,
  EditOutlined,
  // EyeOutlined,
  // PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Image, message, Modal, Table } from "antd";
// import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import EditRequestLogs from "./EditRequestLogs";
import Footer from "./Footer";
import { useRouter } from "next/router";
import WorkBasicDetailsDescription from "./Descriptions/WorkBasicDetailsDescription";
import WorkEmploymentDetailsDescription from "./Descriptions/WorkEmploymentDetailsDescription";
// import PdfPreview from "./PdfPreview";
import FinalVerdict from "./FinalVerdict";
import {
  patchFinalVerdict,
  verifierEditApi,
} from "@/services/verifier.services";

// interface TabContextType {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }
// const TabContext = createContext<TabContextType>({
//   activeTab: 'PermanentAddress',
//   setActiveTab: () => {},
// });
// const useTabContext = () =>useContext(TabContext)

interface WorkVerificationDetailsProps {
  verificationData: any;
  onEdit: (formKey: string) => void;
  editLogsUpdated: number;
  verificationId: string;
  fetchEditRequests: () => void;
  hasEditRequest: boolean;
}

export const WorkVerificationDetails: React.FC<
  WorkVerificationDetailsProps
> = ({
  verificationData,
  onEdit,
  editLogsUpdated,
  verificationId,
  fetchEditRequests,
  hasEditRequest,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { activeTab } = useTabContext();
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [editorContent, setEditorContent] = useState(
    verificationData?.finalObservations?.remarks || "<ul><li><br></li></ul>"
  );
  const [changedData, setChangedData] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState(verificationData?.finalVerdict);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    const payload = {
      status: verdict === "positive" ? "Positive" : "Negative",
      path: editorContent,
    };
    patchFinalVerdict(id as string, "Work", payload)
      .then((response) => {
        // console.log("response: ", response)
        message.success(response.data.message);
        // setOpen(true);
        // setVerdict(verdict);
        setLoading(true);
      })
      .catch((error) => {
        console.log("error: ", error);
        message.error(
          error.response.data.message || "Failed to save final observations"
        );
      });
  };

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

  useEffect(() => {
    const request = indexedDB.open("editLogs", 1);

    request.onerror = (event) => {
      console.error("Database error:", request.error);
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;

      try {
        const transaction = db.transaction("logs", "readonly");
        const store = transaction.objectStore("logs");
        const getRequest = store.get(`${id}_${activeTab}`);

        getRequest.onsuccess = (event: any) => {
          const existingLogs = event.target.result || {};
          const { id, timestamp, ...rest } = existingLogs;
          setChangedData(rest);
        };

        getRequest.onerror = (event: any) => {
          console.error("Error fetching logs:", event);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      } catch (error) {
        console.error("Transaction error:", error);
        db.close();
      }
    };
  }, [id, activeTab, editLogsUpdated]);

  if (!verificationData) return null;

  const data = verificationData || {};

  const handleEditorChange = (content: string) => {
    // const liMatch = content.match(/<li>/g);
    // const liCount = liMatch ? liMatch.length : 0;

    // if (liCount === 0) {
    //   // force at least one <li>
    //   setEditorContent("<ul><li></li></ul>");
    // } else {
    setEditorContent(content);
    // }
  };
  const getButton = (formKey: string) => (
    <Button
      type="text"
      icon={<EditOutlined />}
      onClick={() => onEdit(formKey)}
      disabled={hasEditRequest}
    />
  );

  return (
    <>
      {/* Basic Details Section */}
      <WorkBasicDetailsDescription
        data={data}
        extra={getButton("workBasicDetails")}
        logs={false}
      />

      {/* Employment Details Section */}
      <WorkEmploymentDetailsDescription
        data={data}
        extra={getButton("employmentDetails")}
        logs={false}
      />

      {/* Colleague References Section */}
      <section style={{ marginBottom: 24 }}>
        <Card
          title="Colleague References"
          // extra={
          //   <Button
          //     type="primary"
          //     icon={<PlusOutlined />}
          //     onClick={() => onEdit("colleagueReferences")}
          //   >
          //     Add Reference
          //   </Button>
          // }
        >
          <Table
            className="striped-table"
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
                    disabled={hasEditRequest}
                  />
                ),
              },
            ]}
            pagination={false}
            locale={{ emptyText: "No references added yet" }}
            bordered
          />
        </Card>
      </section>

      {/* Past Employment Section */}
      <section style={{ marginBottom: 24 }}>
        <Card
          title="Past Employment"
          // extra={
          //   <Button
          //     type="primary"
          //     icon={<PlusOutlined />}
          //     onClick={() => onEdit("pastEmployment")}
          //   >
          //     Add Employment
          //   </Button>
          // }
        >
          <Table
            className="striped-table"
            dataSource={data?.pastEmployment?.employments || []}
            columns={[
              {
                title: "Organization",
                dataIndex: "employerName",
                key: "employerName",
                width: 150,
              },
              {
                title: "Designation",
                dataIndex: "designation",
                key: "designation",
                width: 100,
              },
              {
                title: "From Date",
                dataIndex: "fromDate",
                key: "fromDate",
                width: 100,
              },
              {
                title: "To Date",
                dataIndex: "toDate",
                key: "toDate",
                width: 100,
              },
              {
                title: "Contact Person Name",
                dataIndex: "contactPersonName",
                key: "contactPersonName",
                width: 200,
              },
              {
                title: "Contact Person Mobile",
                dataIndex: "contactPersonNumber",
                key: "contactPersonNumber",
                width: 150,
              },
              {
                title: "Reason for Movement",
                dataIndex: "reasonForMovement",
                key: "reasonForMovement",
                width: 250,
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit("pastEmployment")}
                    disabled={hasEditRequest}
                  />
                ),
                width: 80,
                fixed: "right",
              },
            ]}
            scroll={{ x: 1500 }}
            pagination={false}
            locale={{ emptyText: "No past employment records added yet" }}
            bordered
          />
        </Card>
      </section>

      {/* Existing Loans Section */}
      <section style={{ marginBottom: 24 }}>
        <Card
          title="Existing Loans"
          // extra={
          //   <Button
          //     type="primary"
          //     icon={<PlusOutlined />}
          //     onClick={() => onEdit("existingLoans")}
          //   >
          //     Add Loan
          //   </Button>
          // }
        >
          <Table
            className="striped-table"
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
                    disabled={hasEditRequest}
                  />
                ),
              },
            ]}
            pagination={false}
            locale={{ emptyText: "No existing loans added yet" }}
            bordered
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
                {/* <Button
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
                  disabled={hasEditRequest}
                  onClick={() => {
                    // Handle photo removal
                    const updatedItems = data.uploadedItems.filter(
                      (i: any) => i.id !== item.id
                    );
                    // onEdit("photoCapture");
                  }}
                /> */}
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
        <EditRequestLogs
          currentData={data}
          changedData={changedData}
          verificationId={verificationId}
          fetchEditRequests={fetchEditRequests}
          disabled={hasEditRequest}
          admin={false}
          verificationType={activeTab}
        />
      </section>

      {/* <Card style={{marginBottom:24, textAlign:"center"}}> */}
      {/* <section style={{marginBottom:24, textAlign:"center"}}>
        <Button icon={<EyeOutlined />} onClick={()=>{
          setOpen(true)
        }}>Preview</Button>
      </section> */}
      <FinalVerdict
        disabled={hasEditRequest}
        verdict={verdict}
        setVerdict={setVerdict}
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        handleSave={handleSave}
      />

      <Footer
        editorContent={editorContent}
        disabled={hasEditRequest}
        handleSave={handleSave}
        verdict={verdict}
        open={open}
        setOpen={setOpen}
        verificationType="Work"
      />
      {/* </Card> */}
      {/* 
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          // if (pdfPreviewUrl) {
          //   window.URL.revokeObjectURL(pdfPreviewUrl);
          // }
          // setPdfPreviewUrl(null);
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        footer={null}
        width={900}
        title={
          verdict === "Positive"
            ? "Positive Loan Verification"
            : "Negative Loan Verification"
        }
        destroyOnClose
        closeIcon={false}
        maskClosable
      >
        <PdfPreview
          id={id as string}
          status={verdict}
          setLoading={setLoading}
        />
        <Button
          type="primary"
          onClick={() => {
            router.push("/verify");
          }}
          loading={loading}
        >
          Confirm
        </Button>
      </Modal> */}

      {/* Final Observations Section */}
      {/* <section style={{ marginBottom: 24 }}>
        <Card title="Final Observations">
          <div style={{ height: "400px", marginBottom: "20px", background: "#fff" }}>
            <ReactQuill
              readOnly={hasEditRequest}
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              style={{ height: '300px' }}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ color: [] }, { background: [] }],
                  ["link"],
                  ["clean"],
                ],
              }}
              placeholder=" Enter final observations here..."
            />
          </div>
        </Card>
      </section> */}
      {/* <Footer editorContent={editorContent} disabled={hasEditRequest} /> */}
    </>
  );
};
