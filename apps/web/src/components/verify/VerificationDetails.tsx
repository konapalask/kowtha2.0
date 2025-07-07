import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl } from "@/utils/utility";
import {
  // CloseCircleOutlined,
  EditOutlined,
  // EyeOutlined,
} from "@ant-design/icons";
import { Button, Card, Image, message, Table } from "antd";
// import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import EditRequestLogs from "./EditRequestLogs";
import FinalVerdict from "./FinalVerdict";
import { useRouter } from "next/router";
import BasicDetailsDescription from "./Descriptions/BasicDetailsDescription";
import AddressVerificationDescription from "./Descriptions/AddressVerificationDescription";
import ResidenceDetailsDescription from "./Descriptions/ResidenceDetailsDescription";
import FamilyEmploymentDescription from "./Descriptions/FamilyEmploymentDescription";
import ThirdPartyCheckDescription from "./Descriptions/ThirdPartyCheckDescription";
import Footer from "./Footer";
import {
  patchFinalVerdict,
  verifierEditApi,
} from "@/services/verifier.services";
// import PdfPreview from "./PdfPreview";

interface VerificationDetailsProps {
  verificationData: any;
  onEdit: (formKey: string) => void;
  editLogsUpdated: number;
  verificationId: string;
  fetchEditRequests: () => void;
  hasEditRequest: boolean;
  verificationType: string;
  completeVerificationData: any;
}

export const VerificationDetails: React.FC<VerificationDetailsProps> = ({
  verificationData,
  onEdit,
  editLogsUpdated,
  verificationId,
  fetchEditRequests,
  hasEditRequest,
  verificationType,
  completeVerificationData,
}) => {
  // console.log(completeVerificationData?.approvedStatus);
  const router = useRouter();
  const { id } = router.query;
  const { activeTab } = useTabContext();
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [editorContent, setEditorContent] = useState(
    completeVerificationData?.path || "<ul><li><br></li></ul>"
  );
  const [changedData, setChangedData] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [verdict, setVerdict] = useState(
    completeVerificationData?.approvedStatus === "Positive"
      ? "positive"
      : completeVerificationData?.approvedStatus === "Negative"
        ? "negative"
        : null
  );
  console.log(verdict);
  // const [editorContent, setEditorContent] = useState(initialRemarks);
  // const [verdict, setVerdict] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    patchFinalVerdict(id as string, verificationType, {
      status: verdict === "positive" ? "Positive" : "Negative",
      path: editorContent,
    })
      .then((response) => {
        // console.log("response: ", response)
        message.success(response.data.message);
        // setLoading(true);
        // setOpen(false);
        // router?.push("/verify");
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

  // const sanitizeToListOnly = (html: string) => {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(html, "text/html");

  //   // Find all <ul> elements
  //   const ul = doc.querySelector("ul");
  //   if (!ul) return "<ul><li><br></li></ul>"; // fallback if no list

  //   // Only keep <ul><li> structure, remove everything else
  //   const cleanUl = document.createElement("ul");

  //   ul.querySelectorAll("li").forEach((li: any) => {
  //     const cleanLi = document.createElement("li");
  //     cleanLi.innerHTML = li.innerHTML;
  //     cleanUl.appendChild(cleanLi);
  //   });

  //   return cleanUl.outerHTML;
  // };

  // const handleEditorChange = (content: string) => {
  //   const sanitized = sanitizeToListOnly(content);

  //   if (!sanitized || sanitized.trim() === "") {
  //     setEditorContent("<ul><li><br></li></ul>");
  //   } else {
  //     setEditorContent(sanitized);
  //   }
  // };

  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   // Prevent backspace from clearing the initial bullet point
  //   if (e.key === "Backspace" && editorContent === "<ul><li><br></li></ul>") {
  //     e.preventDefault();
  //   }
  // };

  const getButton = (formKey: string) => (
    <Button
      type="text"
      icon={<EditOutlined />}
      onClick={() => onEdit(formKey)}
      disabled={hasEditRequest}
    />
  );

  // const CustomToolbar = () => (
  //   <div
  //     id="custom-toolbar"
  //     style={{
  //       padding: "8px",
  //       display: "flex",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //     }}
  //   >
  //     <span style={{ marginLeft: 8, fontWeight: "bold", fontSize: "16px" }}>
  //       Final Observations
  //     </span>
  //     {/* <Button type="primary" onClick={handleSave} disabled={hasEditRequest} >Save</Button> */}
  //   </div>
  // );

  return (
    <>
      {/* Basic Details Section */}
      <BasicDetailsDescription
        data={data}
        extra={getButton("basicDetails")}
        logs={false}
      />

      {/* Address Verification Section */}
      <AddressVerificationDescription
        data={data}
        extra={getButton("addressVerification")}
        logs={false}
      />

      {/* Residence Details Section */}
      <ResidenceDetailsDescription
        data={data}
        extra={getButton("residenceDetails")}
        logs={false}
      />

      {/* Family & Employment Details Section */}
      <FamilyEmploymentDescription
        data={data}
        extra={getButton("familyEmploymentDetails")}
        logs={false}
      />

      <section style={{ marginBottom: 24 }}>
        <Card
          title="Family Member Details"
          extra={
            <Button
              // type="primary"
              style={{ border: "none" }}
              icon={<EditOutlined />}
              onClick={() => onEdit("familyMemberDetails")}
            />
          }
        >
          <Table
            className="striped-table"
            dataSource={data?.familyMemberDetails || []}
            columns={[
              {
                title: " Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Relation",
                dataIndex: "relation",
                key: "relation",
              },
              {
                title: "Age",
                dataIndex: "age",
                key: "age",
              },
              {
                title: "Employment Type",
                dataIndex: "employmentType",
                key: "employmentType",
              },
              {
                title: "Educational Qualification",
                dataIndex: "educationalQualification",
                key: "educationalQualification",
              },
              {
                title: "Mobile Number",
                dataIndex: "mobileNumber",
                key: "mobileNumber",
              },
              {
                title: "Staying with Applicant",
                dataIndex: "stayingWithApplicant",
                key: "stayingWithApplicant",
              },

              // {
              //   title: "Actions",
              //   key: "actions",
              //   render: (_, record) => (
              //     <Button
              //       type="text"
              //       icon={<EditOutlined />}
              //       onClick={() => onEdit("colleagueReferences")}
              //       disabled={hasEditRequest}
              //     />
              //   ),
              // },
            ]}
            pagination={false}
            locale={{ emptyText: "No references added yet" }}
            bordered
          />
        </Card>
      </section>

      {/* Third Party Check Section */}
      {/* <ThirdPartyCheckDescription
        data={data}
        extra={getButton("thirdPartyCheck")}
        logs={false}
      /> */}
      <section style={{ marginBottom: 24 }}>
        <Card
          title="Third Party Check"
          extra={
            <Button
              // type="primary"
              style={{ border: "none" }}
              icon={<EditOutlined />}
              onClick={() => onEdit("thirdPartyCheck")}
            />
          }
        >
          <Table
            className="striped-table"
            dataSource={data?.thirdPartyCheck?.checks || []}
            columns={[
              {
                title: "TPC Name",
                dataIndex: "tpcName",
                key: "tpcName",
              },
              {
                title: "Mobile",
                dataIndex: "mobileNumber",
                key: "mobileNumber",
              },
              {
                title: "Relationship",
                dataIndex: "relationship",
                key: "relationship",
              },
              {
                title: "Feedback Status",
                dataIndex: "feedbackStatus",
                key: "feedbackStatus",
              },
              {
                title: "Comments",
                dataIndex: "comments",
                key: "comments",
              },

              // {
              //   title: "Actions",
              //   key: "actions",
              //   render: (_, record) => (
              //     <Button
              //       type="text"
              //       icon={<EditOutlined />}
              //       onClick={() => onEdit("colleagueReferences")}
              //       disabled={hasEditRequest}
              //     />
              //   ),
              // },
            ]}
            pagination={false}
            locale={{ emptyText: "No references added yet" }}
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
            {data?.uploadedItems?.map((item: any, idx: number) => {
              return (
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
                    // preview={false}
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
                    Photo {idx + 1} {item?.isCamera ? null : "(Gallery)"}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section style={{ marginBottom: 24 }}>
        <EditRequestLogs
          currentData={verificationData}
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
      {/* </Card> */}
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
        verificationType={verificationType}
      />

      {/* <Modal
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
        width="100%"
        title={
          verdict === "Positive"
            ? "Positive Loan Verification"
            : "Negative Loan Verification"
        }
        destroyOnClose
        closeIcon={false}
        maskClosable={false}
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
        <Card title="Final Observations"> */}
      {/* <div
          style={{ minHeight: "300px", marginBottom: "20px", background: "#fff", borderRadius:8 }}
        >
          <CustomToolbar />
          <ReactQuill
            readOnly={hasEditRequest}
            theme="snow"
            value={editorContent}
            onChange={handleEditorChange}
            // onKeyDown={handleKeyDown}
            style={{ height: '300px' }}
            modules={{
              toolbar: false
            }}
            formats={["list"]}
          />
        </div> */}
      {/* </Card> */}
      {/* </section> */}
      {/* <Footer editorContent={editorContent} disabled={hasEditRequest} /> */}
    </>
  );
};
