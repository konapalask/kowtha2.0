import { useTabContext } from "@/pages/verify/[id]";
import {
  generatePreviewReport,
  loanApproveRejectApi,
  patchFinalVerdict,
} from "@/services/verifier.services";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Popconfirm, Space } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Footer: React.FC<{
  editorContent: any;
  disabled?: boolean;
  handleSave: any;
  verdict: any;
  open: boolean;
  setOpen: any;
  verificationType: string;
}> = ({
  editorContent,
  disabled,
  handleSave,
  verdict,
  open,
  setOpen,
  verificationType,
}) => {
  const { activeTab } = useTabContext();
  const router = useRouter();
  const { id } = router.query;
  // const [modalVisible, setModalVisible] = useState(false);
  // const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
  //   null
  // );
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // const handleApprove = async () => {
  //   try {
  //     setModalVisible(false);

  //     // Log for debugging
  //   } catch (error) {
  //     console.error("Error generating final report:", error);
  //     message.error(
  //       "Failed to generate final report: " + (error as Error).message
  //     );
  //   }
  // };

  const fetchPdf = async () => {
    try {
      const reportResponse = await generatePreviewReport(
        id as string,
        activeTab,
        null
      );

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

  const submitFinalVerdict = async () => {
    try {
      const payload = {
        status: verdict === "positive" ? "Positive" : "Negative",
        path: editorContent,
      };
      await patchFinalVerdict(id as string, verificationType, payload);
    } catch (error: any) {
      console.log("Error:", error);
      message.error(error?.response?.data?.message);
    }
  };

  // const approveLoan = async () => {
  //   try {
  //     const response = await loanApproveRejectApi(id as string, {
  //       status: "Approved",
  //       comments: "",
  //     });
  //   } catch (error) {
  //     console.error("Error approving loan:", error);
  //   }
  // };

  // const rejectLoan = async () => {
  //   try {
  //     const response = await loanApproveRejectApi(id as string, {
  //       status: "Rejected",
  //       comments: "",
  //     });
  //   } catch (error) {
  //     console.error("Error rejecting loan:", error);
  //   }
  // };

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
          // marginBottom: 24,
        }}
      >
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            // submitFinalVerdict();
            setOpen(true);
            fetchPdf();
          }}
        >
          Generate Preview
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
          {/* <strong>PDF Preview:</strong> */}
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
        {verdict && (
          <div className="flex-end" style={{ marginTop: 8 }}>
            {/* <div style={{ marginBottom: 16 }}>
              Are you sure you want to{" "}
              {verdict === "positive" ? "recommend" : "reject"} this loan
              verification?
            </div> */}
            {/* <Space sty> */}
            {/* <Button type={"primary"} onClick={handleSave}>
              Submit
            </Button> */}
            <Popconfirm
              title="Are you sure you want to submit this final verdict?"
              onConfirm={handleSave}
            >
              <Button type="primary">Generate Final Report</Button>
            </Popconfirm>
            {/* </Space> */}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Footer;
