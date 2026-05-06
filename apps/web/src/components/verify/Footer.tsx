import { useTabContext } from "@/pages/verify/[id]";
import {
  generateFinalReport,
  generatePreviewReport,
  exportFinancialAnalysis,
  getVerificationData,
} from "@/services/verifier.services";
import { sendPdEmailReplyApi, getLoansByIdApi, returnToVeApi, closeLoanApi } from "@/services/loans.services";
import { EyeOutlined, DownloadOutlined, MailOutlined, RollbackOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, message, Modal, Popconfirm, Spin } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getCurrentDepartment, getCurrentDepartmentRole } from "@/utils/utility";
import DownloadAnimation from "./DownloadAnimation";

const Footer: React.FC<{
  editorContent: any;
  disabled?: boolean;
  handleSave: any;
  verdict: any;
  open: boolean;
  setOpen: any;
  verificationType: string;
  currentDepartment?: string;
  loanId?: number;
  hasPdEmail?: boolean;
  loanClosedAt?: string | null;
  onLoanRefresh?: () => void;
}> = ({
  editorContent,
  disabled,
  handleSave,
  verdict,
  open,
  setOpen,
  verificationType,
  currentDepartment,
  loanId,
  hasPdEmail,
  loanClosedAt,
  onLoanRefresh,
}) => {
  const { activeTab } = useTabContext();
  const router = useRouter();
  const { id } = router.query;
  // const [modalVisible, setModalVisible] = useState(false);
  // const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
  //   null
  // );
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [showDownloadAnimation, setShowDownloadAnimation] = useState(false);
  const [downloadFileType, setDownloadFileType] = useState<"pdf" | "excel">("pdf");
  const [returningToVe, setReturningToVe] = useState(false);
  const [closingLoan, setClosingLoan] = useState(false);
  const currentRole = getCurrentDepartmentRole();
  const canCloseLoan = currentRole === "Verifier" || currentRole === "Admin";

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
    } catch (error: any) {
      console.error("Error generating final report:", error);
      message.error(
        error?.response?.data?.message ?? "Failed to generate final report"
      );
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloadingReport(true);
      setDownloadFileType("pdf");
      setShowDownloadAnimation(true);
    
      const verificationResponse = await getVerificationData(id as string);
      const loanIdFromVerification = verificationResponse?.data?.loanId || loanId;
      
      if (!loanIdFromVerification) {
        throw new Error("Loan ID not found");
      }
      const loanResponse = await getLoansByIdApi(loanIdFromVerification.toString());
      const loanData = loanResponse?.data?.data?.items?.[0] || loanResponse?.data?.data?.items || loanResponse?.data?.data || loanResponse?.data;

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
      
   
      const link = document.createElement("a");
      link.href = url;
      link.download = `verification-report-${loanData?.applicationNumber || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      window.URL.revokeObjectURL(url);

      setTimeout(() => {
        setShowDownloadAnimation(false);
        message.success("Final report downloaded successfully");
      }, 1500);
    } catch (error: any) {
      console.error("Error downloading report:", error);
      setShowDownloadAnimation(false);
      message.error(
        error?.response?.data?.message ?? "Failed to download final report"
      );
    } finally {
      setDownloadingReport(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      setDownloadFileType("excel");
      setShowDownloadAnimation(true);

      const excelResponse = await exportFinancialAnalysis(id as string);

      // Check if we have valid data
      if (!excelResponse) {
        throw new Error("No Excel data received");
      }

      // Fetch loan to get the application number for the file name
      let applicationNumber: string | undefined;
      if (loanId) {
        try {
          const loanResponse = await getLoansByIdApi(loanId.toString());
          const loanData =
            loanResponse?.data?.data?.items?.[0] ||
            loanResponse?.data?.data?.items ||
            loanResponse?.data?.data ||
            loanResponse?.data;
          applicationNumber = loanData?.applicationNumber;
        } catch (lookupError) {
          console.error("Error fetching loan for filename:", lookupError);
        }
      }

      // Create a blob URL for Excel file
      const blob = new Blob([excelResponse], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `financial-analysis-${applicationNumber || id}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
      

      setTimeout(() => {
        setShowDownloadAnimation(false);
        message.success("Excel file downloaded successfully");
      }, 1500);
    } catch (error: any) {
      console.error("Error exporting Excel:", error);
      setShowDownloadAnimation(false);
      message.error(
        error?.response?.data?.message ?? "Failed to export Excel file"
      );
    } finally {
      setExportingExcel(false);
    }
  };

  // const submitFinalVerdict = async () => {
  //   try {
  //     const payload = {
  //       status: verdict === "positive" ? "Positive" : "Negative",
  //       path: editorContent,
  //     };
  //     await patchFinalVerdict(id as string, verificationType, payload);
  //   } catch (error: any) {
  //     console.log("Error:", error);
  //     message.error(error?.response?.data?.message);
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

  const handleFinalReport = async () => {
    try {
      const response = await generateFinalReport(id as string, activeTab);
      // setOpen(false);
      router?.push("/verify");
      console.log(response);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleReplyToPdEmail = async () => {
    if (!loanId) {
      message.error("Loan ID not available");
      return;
    }

    try {
      setSendingEmail(true);
      const dept = currentDepartment || getCurrentDepartment();
      const response = await sendPdEmailReplyApi(loanId, dept);
      message.success(
        response?.data?.message || "Email reply sent successfully"
      );
    } catch (error: any) {
      console.error("Error sending PD email reply:", error);
      message.error(
        error?.response?.data?.message ||
          "Failed to send email reply. Please try again."
      );
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCloseLoan = async () => {
    if (!loanId) {
      message.error("Loan ID not available");
      return;
    }
    try {
      setClosingLoan(true);
      await closeLoanApi(loanId);
      message.success("Loan marked as closed");
      onLoanRefresh?.();
    } catch (error: any) {
      console.error("Error closing loan:", error);
      message.error(
        error?.response?.data?.message || "Failed to mark loan as closed"
      );
    } finally {
      setClosingLoan(false);
    }
  };

  const handleReturnToVe = async () => {
    if (!loanId) {
      message.error("Loan ID not available");
      return;
    }
    try {
      setReturningToVe(true);
      await returnToVeApi(loanId, verificationType);
      message.success("Verification returned to Verification Executive");
      router.push("/verify");
    } catch (error: any) {
      console.error("Error returning to VE:", error);
      message.error(
        error?.response?.data?.message || "Failed to return verification to VE"
      );
    } finally {
      setReturningToVe(false);
    }
  };

  return (
    <>
      <DownloadAnimation
        fileType={downloadFileType}
        isVisible={showDownloadAnimation}
      />
      <div
        style={{
          position: "sticky",
          bottom: 0,
          left: 120,
          right: 40,
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
            // submitFinalVerdict();
            setOpen(true);
            fetchPdf();
          }}
          style={{
            height: "32px",
            fontSize: "14px",
          }}
        >
          Generate Preview
        </Button>
        {currentDepartment === "PD" && (
          <>
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleDownloadReport}
              loading={downloadingReport}
              disabled={downloadingReport || disabled}
              style={{
                height: "32px",
                fontSize: "14px",
              }}
            >
              Download Final Report
            </Button>
            {canCloseLoan && loanId && (
              <Popconfirm
                title="Mark this loan as closed?"
                description="This sets the closed date to now. It cannot be undone from this screen."
                onConfirm={handleCloseLoan}
                disabled={!!loanClosedAt}
              >
                <Button
                  size="small"
                  icon={<CheckCircleOutlined />}
                  loading={closingLoan}
                  disabled={closingLoan || !!loanClosedAt}
                  style={{
                    height: "32px",
                    fontSize: "14px",
                  }}
                >
                  {loanClosedAt
                    ? `Closed ${dayjs(loanClosedAt).format("DD-MM-YYYY")}`
                    : "Mark Loan Closed"}
                </Button>
              </Popconfirm>
            )}
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleExportExcel}
              loading={exportingExcel}
              disabled={exportingExcel || disabled}
              style={{
                height: "32px",
                fontSize: "14px",
              }}
            >
              Export Excel
            </Button>
            {currentRole === "Verifier" && loanId && (
              <Popconfirm
                title="Return this verification to Verification Executive for rework?"
                onConfirm={handleReturnToVe}
              >
                <Button
                  size="small"
                  icon={<RollbackOutlined />}
                  loading={returningToVe}
                  disabled={returningToVe || disabled}
                  style={{
                    height: "32px",
                    fontSize: "14px",
                  }}
                >
                  Return to VE
                </Button>
              </Popconfirm>
            )}
            {hasPdEmail && loanId && (
              <Button
                size="small"
                icon={<MailOutlined />}
                onClick={handleReplyToPdEmail}
                loading={sendingEmail}
                disabled={sendingEmail || disabled}
                style={{
                  height: "32px",
                  fontSize: "14px",
                }}
              >
                Reply to PD Mail
              </Button>
            )}
          </>
        )}
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
            {/* <Popconfirm
              title="Are you sure you want to submit this final verdict?"
              onConfirm={handleFinalReport}
            >
              <Button
                type="primary"
                size="small"
                style={{
                  height: "32px",
                  fontSize: "14px",
                }}
              >
                Generate Final Report
              </Button>
            </Popconfirm> */}
            {/* </Space> */}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Footer;
