import { Button, message, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTabContext } from "@/pages/verify/[id]";
import { generatePreviewReport } from "@/services/verifier.services";

interface AssistantVerifierFooterProps {
  onSave: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const AssistantVerifierFooter: React.FC<AssistantVerifierFooterProps> = ({
  onSave,
  loading = false,
  disabled = false,
}) => {
  const { activeTab } = useTabContext();
  const router = useRouter();
  const { id } = router.query;
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchPdf = async () => {
    try {
      const reportResponse = await generatePreviewReport(
        id as string,
        activeTab,
        null
      );

      if (!reportResponse) {
        throw new Error("No PDF data received");
      }

      const blob = new Blob([reportResponse], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
    } catch (error: any) {
      console.error("Error generating preview report:", error);
      message.error(
        error?.response?.data?.message ?? "Failed to generate preview report"
      );
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
          left: 0,
          right: 0,
          background: "#fff",
          padding: "8px 16px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          zIndex: 1000,
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setOpen(true);
            fetchPdf();
          }}
          disabled={disabled}
          style={{
            height: "32px",
            fontSize: "14px",
          }}
        >
          Generate Preview
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={onSave}
          loading={loading}
          disabled={disabled}
          style={{
            minWidth: "140px",
            height: "32px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Submit Verification
        </Button>
      </div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          if (pdfPreviewUrl) {
            window.URL.revokeObjectURL(pdfPreviewUrl);
          }
          setPdfPreviewUrl(null);
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        style={{ top: 10 }}
        footer={null}
        width={"100%"}
        title={"Loan preview"}
        maskClosable={false}
      >
        <div style={{ height: "85vh", overflow: "hidden" }}>
          {pdfPreviewUrl ? (
            <object
              data={pdfPreviewUrl}
              type="application/pdf"
              width="100%"
              height={"100%"}
              style={{ border: "1px solid #eee" }}
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
      </Modal>
    </>
  );
};

export default AssistantVerifierFooter;
