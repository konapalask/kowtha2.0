import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl } from "@/utils/utility";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Image } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import EditRequestLogs from "./EditRequestLogs";
import { useRouter } from "next/router";
import BasicDetailsDescription from "./Descriptions/BasicDetailsDescription";
import AddressVerificationDescription from "./Descriptions/AddressVerificationDescription";
import ResidenceDetailsDescription from "./Descriptions/ResidenceDetailsDescription";
import FamilyEmploymentDescription from "./Descriptions/FamilyEmploymentDescription";
import ThirdPartyCheckDescription from "./Descriptions/ThirdPartyCheckDescription";

export const VerificationDetails = ({
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

  useEffect(() => {
    const request = indexedDB.open("editLogs", 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("logs")) {
        db.createObjectStore("logs");
        console.log("Created object store 'logs'");
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;

      // Check if the store exists before using it
      if (!db.objectStoreNames.contains("logs")) {
        console.error("Object store 'logs' not found in DB");
        db.close();
        return;
      }

      const transaction = db.transaction("logs", "readwrite");

      transaction.oncomplete = () => {
        db.close();
        console.log("Connection closed");
      };

      transaction.onerror = () => {
        console.error("Transaction error:", transaction.error);
      };

      const store = transaction.objectStore("logs");

      const getRequest = store.get(`${id}_${activeTab}`);
      getRequest.onsuccess = (event: any) => {
        const existingLogs = event.target.result || {};
        const { id, timestamp, ...rest } = existingLogs;
        setChangedData(rest);
      };

      getRequest.onerror = () => {
        console.error("Error fetching logs:", getRequest.error);
      };
    };

    request.onerror = () => {
      console.error("Database error:", request.error);
    };
  }, []);

  if (!verificationData) return null;

  const data = verificationData || {};

  const handleEditorChange = (content: string) => {
    // if (editorContent !== "<ul><li></li></ul>") {
    setEditorContent(content);
    // }
    // onEdit("finalObservations");
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

      {/* Third Party Check Section */}
      <ThirdPartyCheckDescription
        data={data}
        extra={getButton("thirdPartyCheck")}
        logs={false}
      />

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
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}{" "}
                    Photo {idx + 1}
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
          editRequestData={changedData}
        />
      </section>

      {/* Final Observations Section */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Final Observations">
          <div style={{ height: "400px", marginBottom: "20px" }}>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              style={{ height: "300px" }}
              modules={{
                toolbar: [],
              }}
              formats={["list"]}
              placeholder=" Enter final observations here..."
            />
          </div>
        </Card>
      </section>
    </>
  );
};
