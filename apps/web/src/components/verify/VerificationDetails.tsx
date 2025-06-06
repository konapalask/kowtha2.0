import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl } from "@/utils/utility";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Image } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import EditRequestLogs from "./EditRequestLogs";
import { useRouter } from "next/router";
import BasicDetailsDescription from "./Descriptions/BasicDetailsDescription";
import AddressVerificationDescription from "./Descriptions/AddressVerificationDescription";
import ResidenceDetailsDescription from "./Descriptions/ResidenceDetailsDescription";
import FamilyEmploymentDescription from "./Descriptions/FamilyEmploymentDescription";
import ThirdPartyCheckDescription from "./Descriptions/ThirdPartyCheckDescription";
import Footer from "./Footer";

interface VerificationDetailsProps {
  verificationData: any;
  onEdit: (formKey: string) => void;
  editLogsUpdated: number;
}

export const VerificationDetails: React.FC<VerificationDetailsProps> = ({
  verificationData,
  onEdit,
  editLogsUpdated,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { activeTab } = useTabContext();
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [editorContent, setEditorContent] = useState(
    verificationData?.finalObservations?.remarks || ""
  );
  console.log("editorContent: ", editorContent);
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
    setEditorContent(content);
  };
  const getButton = (formKey: string) => (
    <Button
      type="text"
      icon={<EditOutlined />}
      onClick={() => onEdit(formKey)}
    />
  );

  const CustomToolbar = () => (
    <div id="custom-toolbar" style={{ padding: "8px" }}>
      <span style={{ marginLeft: 8, fontWeight: "bold", fontSize: "16px" }}>
        Final Observations
      </span>
    </div>
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
          changedData={changedData}
        />
      </section>

      {/* Final Observations Section */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Final Observations">
        <div
          style={{ height: "400px", marginBottom: "20px", background: "#fff" }}
        >
          <ReactQuill
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
      </section>
      <Footer editorContent={editorContent} />
    </>
  );
};

