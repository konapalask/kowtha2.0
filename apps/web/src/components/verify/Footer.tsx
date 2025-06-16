import { useTabContext } from "@/pages/verify/[id]";
import { generateFinalReport, loanApproveRejectApi } from "@/services/verifier.services";
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Footer: React.FC<{ editorContent: any; disabled?: boolean }> = ({ editorContent, disabled }) => {
  const { activeTab } = useTabContext();
  const router = useRouter();
  const { id } = router.query;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const handleApprove = async () => {
    try {
      setModalAction(null);
      setModalVisible(false);

      // Log for debugging
    } catch (error) {
      console.error("Error generating final report:", error);
      message.error(
        "Failed to generate final report: " + (error as Error).message
      );
    }
  };

  const fetchPdf = async () => {
   try{
    const reportResponse = await generateFinalReport(id as string, activeTab,null);

    // Check if we have valid data
    if (!reportResponse) {
      throw new Error("No PDF data received");
    }

    // Create a blob URL directly from the response
    const blob = new Blob([reportResponse], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    setPdfPreviewUrl(url);
   } catch (error) {
    console.error("Error generating final report:", error);
    // message.error(
    //   "Failed to generate final report: " + (error as Error).message
    // );
   }
  };

  const approveLoan = async () => {
    try{
      const response = await loanApproveRejectApi(id as string, {
        status: "Approved",comments:""
      });
    } catch (error) {
      console.error("Error approving loan:", error);
    }
  };

  const rejectLoan = async () => {
    try{
      const response = await loanApproveRejectApi(id as string, {
        status: "Rejected",
        comments:""
      });
    } catch (error) {
      console.error("Error rejecting loan:", error);
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

  return (
    <>
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
          justifyContent: "center",
          gap: "16px",
          zIndex: 1000,
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.06)",
          marginBottom:24
        }}
      >
        <Button icon={<EyeOutlined />} onClick={()=>{
          setModalVisible(true)
          fetchPdf()
        }} >Preview</Button>
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
        cancelButtonProps={{
          style: {
            display: "none"
          }
        }}
        footer={null}
        width={900}
        title={
         "loan preview"
        }
      >
        <div style={{ marginBottom: 16 }}>
          {/* <strong>PDF Preview:</strong> */}
          {pdfPreviewUrl ? (
            <object
              data={pdfPreviewUrl}
              type="application/pdf"
              width="100%"
              height={600}
              style={{ border: "1px solid #eee", marginTop: 8 }}
            >
              <div style={{ padding: "20px", textAlign: "center" }}>
                Unable to display PDF file.{" "}
                <a
                  href={pdfPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>{" "}
                instead.
              </div>
            </object>
          ) : (
            <div style={{ padding: "20px", textAlign: "center" }}>
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
          <Button
            type={"primary"}
            onClick={handleApprove}
          >
            Confirm
          </Button>
        </Space>
      </Modal>
    </>
  );
};

export default Footer;
