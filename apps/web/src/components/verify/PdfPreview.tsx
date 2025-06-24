import { useTabContext } from "@/pages/verify/[id]";
import { generatePreviewReport } from "@/services/verifier.services";
import React, { useEffect, useState } from "react";

const PdfPreview: React.FC<{
  id: string;
  status: string | null;
  setLoading: (val: boolean) => void;
}> = ({ id, status, setLoading }) => {
  // console.log(id, status);
  const { activeTab } = useTabContext();
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const fetchPdf = async () => {
    try {
      const reportResponse = await generatePreviewReport(
        id as string,
        activeTab,
        status
      );

      // Check if we have valid data
      if (!reportResponse) {
        throw new Error("No PDF data received");
      }

      // Create a blob URL directly from the response
      const blob = new Blob([reportResponse], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
      setLoading(false);
    } catch (error) {
      console.error("Error generating final report:", error);
      // message.error(
      //   "Failed to generate final report: " + (error as Error).message
      // );
    }
  };

  useEffect(() => {
    if (id) {
      fetchPdf();
    }
  }, []);
  return (
    <>
      <div style={{ marginBottom: 16, height: "80dvh" }}>
        <strong>PDF Preview:</strong>
        {pdfPreviewUrl ? (
          <object
            data={pdfPreviewUrl}
            type="application/pdf"
            width="100%"
            height={"100%"}
            style={{ border: "1px solid #eee", marginTop: 8 }}
          >
            <div style={{ padding: "20px", textAlign: "center" }}>
              Unable to display PDF file.{" "}
              <a href={pdfPreviewUrl} target="_blank" rel="noopener noreferrer">
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
    </>
  );
};
export default PdfPreview;
