import { Radio, Card, Button, Select, Row, Col, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const customStyles = `
  .ql-editor {
    font-size: 16px !important;
    line-height: 1.6 !important;
  }
  .ql-editor p {
    font-size: 16px !important;
    margin-bottom: 8px !important;
  }
  .ql-editor ul li {
    font-size: 16px !important;
    line-height: 1.6 !important;
  }
  
  .ql-editor.ql-disabled,
  .ql-editor[readonly] {
    background-color: #f8f9fa !important;
    color: #6c757d !important;
  }
  
  .ql-container.ql-disabled {
    background-color: #f8f9fa !important;
  }
  
  .ql-toolbar.ql-disabled {
    background-color: #f8f9fa !important;
  }
`;
import {
  submitFinancialAnalysis,
  updateSynopsis,
} from "@/services/verifier.services";
import { useRouter } from "next/router";
import { getItem } from "@/helpers/localStorage";
import { USER_DETAILS } from "@/constants/defaultKeys";

interface FeedbackProps {
  disabled?: boolean;
  verdict: boolean | null | string;
  setVerdict: any;
  editorContent: any;
  setEditorContent: any;
  handleSave: any;
  verificationData?: any;
  currentDepartment?: string;
  hasEditRequest?: boolean;
}

const Feedback: React.FC<FeedbackProps> = ({
  disabled = false,
  verdict,
  setVerdict,
  editorContent,
  setEditorContent,
  handleSave,
  verificationData,
  currentDepartment,
  hasEditRequest = false,
}) => {
  const userDetails = getItem(USER_DETAILS, true) as any;
  const role = userDetails?.departmentRoles?.find(
    (role: any) => role.department === "PD"
  )?.role;
  const router = useRouter();
  const { id } = router.query;
  const [synopsisLoading, setSynopsisLoading] = useState(false);
  const [existingSynopsis, setExistingSynopsis] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const isInitializedRef = useRef(false);

  const convertTextToPoints = (text: string): string => {
    if (!text) return "<ul><li><br></li></ul>";

    const points = text
      .split(/[•\-\*\.]/)
      .map((point) => point.trim())
      .filter((point) => point.length > 0)
      .map((point) => `<li>${point}</li>`)
      .join("");

    return `<ul>${points}</ul>`;
  };

  const convertPointsToText = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const liElements = doc.querySelectorAll("li");

    if (liElements.length === 0) return "";

    return Array.from(liElements)
      .map((li) => li.textContent?.trim())
      .filter((text) => text && text.length > 0)
      .join(". ");
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    
    let foundSynopsis = null;

    if (
      verificationData &&
      verificationData.verifications &&
      verificationData.verifications.length > 0
    ) {
      const businessVerification = verificationData.verifications.find(
        (v: any) => v.type === "Business"
      );

      if (businessVerification && businessVerification.synopsis) {
        foundSynopsis = businessVerification.synopsis;
      }
    }

    if (!foundSynopsis && verificationData && verificationData.synopsis) {
      foundSynopsis = verificationData.synopsis;
    }

    if (
      !foundSynopsis &&
      verificationData &&
      verificationData.verifications &&
      verificationData.verifications[0]
    ) {
      const firstVerification = verificationData.verifications[0];
      if (firstVerification.synopsis) {
        foundSynopsis = firstVerification.synopsis;
      }
    }

    if (foundSynopsis) {
      setExistingSynopsis(foundSynopsis);
      const isHtmlList = /<\s*ul[^>]*>/i.test(foundSynopsis);
      const contentToSet = isHtmlList
        ? foundSynopsis
        : convertTextToPoints(foundSynopsis);
      setEditorContent(contentToSet);
      setHasChanges(false);
    }
    
    isInitializedRef.current = true;
  }, [verificationData]);

  const templateOptions = [
    { value: "TATA_CAPITAL_LIMITED", label: "TATA CAPITAL LIMITED" },
    {
      value: "TATA_CAPITAL_HOUSING_FINANCE_LIMITED",
      label: "TATA CAPITAL HOUSING FINANCE LIMITED",
    },
    {
      value: "INDIABULLS_HOUSING_FINANCE_LTD",
      label: "INDIABULLS HOUSING FINANCE LTD",
    },
    {
      value: "IDFC_FIRST_FINANCIAL_SERVICES_LIMITED",
      label: "IDFC FIRST FINANCIAL SERVICES LIMITED",
    },
    {
      value: "IIFL_HOUSING_FINANCE_LIMITED",
      label: "IIFL HOUSING FINANCE LIMITED",
    },
    {
      value: "ADITYA_BIRLA_HOUSING_FINANCE_LIMITED",
      label: "ADITYA BIRLA HOUSING FINANCE LIMITED",
    },
    {
      value: "PUNJAB_NATIONAL_BANK_HOUSING_FINANCE_LIMITED",
      label: "PUNJAB NATIONAL BANK HOUSING FINANCE LIMITED",
    },
    {
      value: "INDUSIND_HOUSING_FINANCE_LIMITED",
      label: "INDUSIND HOUSING FINANCE LIMITED",
    },
    { value: "INDUSIND_BANK_LIMITED", label: "INDUSIND BANK LIMITED" },
    {
      value: "CENTRUM_HOUSING_FINANCE_LTD",
      label: "CENTRUM HOUSING FINANCE LTD",
    },
    {
      value: "STATE_BANK_OF_INDIA_IT_VERIFICATION_AGENCY",
      label: "STATE BANK OF INDIA –IT VERIFICATION AGENCY",
    },
    { value: "AXIS_FINANCE_LTD", label: "AXIS FINANCE LTD" },
    {
      value: "FULLERTON_HOUSING_FINANCE_LTD",
      label: "FULLERTON HOUSING FINANCE LTD",
    },
    {
      value: "FULLERTON_CREDIT_COMPANY_LTD",
      label: "FULLERTON CREDIT COMPANY LTD",
    },
    { value: "AHAM_HOUSING_FINANCE_LTD", label: "AHAM HOUSING FINANCE LTD" },
    { value: "ICICI_HOME_FINANCE_LTD", label: "ICICI HOME FINANCE LTD" },
    {
      value: "PIRAMAL_HOUSING_FINANCE_LTD",
      label: "PIRAMAL HOUSING FINANCE LTD",
    },
    { value: "YES_BANK_LTD", label: "YES BANK LTD" },
    {
      value: "INCRED_HOUSING_FINANCE_LTD",
      label: "INCRED HOUSING FINANCE LTD",
    },
    { value: "AMBIT_FINVEST_PVT_LTD", label: "AMBIT FINVEST PVT.LTD" },
    {
      value: "INDOSTAR_HOME_FINANCE_PRIVATE_LIMITED",
      label: "INDOSTAR HOME FINANCE PRIVATE LIMITED",
    },
    {
      value: "BANK_OF_INDIA_DUE_DILIGENCE",
      label: "BANK OF INDIA - DUE DILIGENCE",
    },
    {
      value: "NEOGROWTH_CREDIT_PRIVATE_LIMITED",
      label: "NEOGROWTH CREDIT PRIVATE LIMITED",
    },
    {
      value: "CHOLAMANDALAM_INVESTMENT_AND_FINANCE_COMPANY_LTD",
      label: "CHOLAMANDALAM INVESTMENT AND FINANCE COMPANY LTD",
    },
    {
      value: "HOUSING_DEVELOPMENT_FINANCE_CORPORATION_LIMITED",
      label: "HOUSING DEVELOPMENT FINANCE CORPORATION LIMITED",
    },
    {
      value: "HIRANANDINI_FINANCIAL_SERVICES_PRIVATE_LTD",
      label: "HIRANANDINI FINANCIAL SERVICES PRIVATE LTD",
    },
    {
      value: "MUTHOOT_HOUSING_FINANCE_COMPANY_LIMITED",
      label: "MUTHOOT HOUSING FINANCE COMPANY LIMITED",
    },
    { value: "DCB_BANK_LTD", label: "DCB BANK LTD" },
    {
      value: "CANARA_BANK_DUE_DILIGENCE_ANDHRA_PRADESH",
      label:
        "CANARA BANK - DUE DILIGENCE FOR THE ENTIRE STATE OF ANDHRA PRADESH",
    },
    { value: "RBL_BANK_LIMITED", label: "RBL BANK LIMITED" },
    { value: "NORTHEN_ARC_CAPITAL_LTD", label: "NORTHEN ARC CAPITAL LTD" },
    { value: "AXIS_BANK_LTD", label: "AXIS BANK LTD" },
    { value: "ARKA_FINCAP_LIMITED", label: "ARKA FINCAP LIMITED" },
    { value: "CENT_BANK", label: "CENT BANK" },
    { value: "NIDO_HOME_FINANCE_LIMITED", label: "NIDO HOME FINANCE LIMITED" },
    { value: "HERO_FINCORP", label: "HERO FINCORP" },
    {
      value: "KOTAK_MAHINDRA_BANK_LIMITED",
      label: "KOTAK MAHINDRA BANK LIMITED",
    },
    {
      value: "SHRIRAM_HOUSING_FINANCE_LTD",
      label: "SHRIRAM HOUSING FINANCE LTD",
    },
    {
      value: "SHRIRAM_CITY_UNION_FINANCE_LTD",
      label: "SHRIRAM CITY UNION FINANCE LTD",
    },
    {
      value: "HERO_HOUSING_FINANCIAL_LTD",
      label: "HERO HOUSING FINANCIAL LTD",
    },
    { value: "GODREJ_CAPITAL", label: "GODREJ CAPITAL" },
  ];

  const sanitizeToListOnly = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const ul = doc.querySelector("ul");
    if (!ul) return "<ul><li><br></li></ul>";

    const cleanUl = document.createElement("ul");

    ul.querySelectorAll("li").forEach((li: any) => {
      const cleanLi = document.createElement("li");
      cleanLi.innerHTML = li.innerHTML;
      cleanUl.appendChild(cleanLi);
    });

    return cleanUl.outerHTML;
  };

  const handleEditorChange = (content: string) => {
    // Don't sanitize on every keystroke - only set the content directly
    // Sanitization will happen on save/submit
    if (!content || content.trim() === "" || content === "<p><br></p>") {
      setEditorContent("<ul><li><br></li></ul>");
    } else {
      // Only sanitize if content doesn't have <ul> structure yet
      // This allows user to type freely
      if (content.includes("<ul>") || content.includes("<li>")) {
        setEditorContent(content);
      } else {
        // If user is typing plain text, wrap it in list structure
        // But don't be too aggressive - let them type
        setEditorContent(content);
      }
    }
    
    // Track if content has changed from original (for Verifier/Admin)
    if (role !== "VerificationExecutive" && existingSynopsis) {
      const originalContent = existingSynopsis;
      const isHtmlList = /<\s*ul[^>]*>/i.test(originalContent);
      const normalizedOriginal = isHtmlList
        ? originalContent
        : convertTextToPoints(originalContent);
      setHasChanges(content !== normalizedOriginal);
    } else if (role !== "VerificationExecutive") {
      // For new synopsis, track if there's any content
      setHasChanges(!!(content && content.trim() !== "" && content !== "<ul><li><br></li></ul>"));
    }
  };

  const handleVerdictChange = (e: any) => {
    setVerdict(e.target.value);
  };

  const handleSynopsisSubmit = async () => {
    try {
      setSynopsisLoading(true);

      // Validate the content has actual list text
      const synopsisPlain = convertPointsToText(editorContent);

      if (!synopsisPlain || synopsisPlain === "") {
        message.error("Please enter synopsis content before submitting");
        return;
      }

      // Get financial analysis data from verification data
      const businessVerification = verificationData?.verifications?.find(
        (v: any) => v.type === "Business"
      );
      const financialData = businessVerification?.financialAnalysis || {};

      // Prepare the complete payload
      const payload = {
        openingStock: financialData.openingStock || 0,
        purchase: financialData.purchase || 0,
        costOfServices: financialData.costOfServices || 0,
        wages: financialData.wages || 0,
        hamaliCharges: financialData.hamaliCharges || 0,
        manufacturingExpenses: financialData.manufacturingExpenses || 0,
        packingCharges: financialData.packingCharges || 0,
        sales: financialData.sales || 0,
        services: financialData.services || 0,
        closingStock: financialData.closingStock || 0,
        salaries: financialData.salaries || 0,
        rent: financialData.rent || 0,
        electricityCharges: financialData.electricityCharges || 0,
        printingStationery: financialData.printingStationery || 0,
        telephoneCharges: financialData.telephoneCharges || 0,
        postageTelegram: financialData.postageTelegram || 0,
        officeMaintenance: financialData.officeMaintenance || 0,
        repairsMaintenance: financialData.repairsMaintenance || 0,
        sadarExpenses: financialData.sadarExpenses || 0,
        auditFee: financialData.auditFee || 0,
        advertisement: financialData.advertisement || 0,
        bankCharges: financialData.bankCharges || 0,
        insurance: financialData.insurance || 0,
        depreciation: financialData.depreciation || 0,
        interestOnLoan: financialData.interestOnLoan || 0,
        rentReceived: financialData.rentReceived || 0,
        commissionReceived: financialData.commissionReceived || 0,
        netProfit: financialData.netProfit || 0,
        grossProfit: financialData.grossProfit || 0,
        synopsis: editorContent,
      };

      console.log("Submitting synopsis with payload:", payload);

      // Submit new synopsis with financial data
      await submitFinancialAnalysis(id as string, payload);
      message.success("Synopsis submitted successfully!");
      setExistingSynopsis(editorContent);
    } catch (error) {
      console.error("Error submitting synopsis:", error);
      message.error("Failed to submit synopsis");
    } finally {
      setSynopsisLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <section style={{ marginBottom: 24 }}>
        <Card
          title="Synopsis"
          extra={null}
          bodyStyle={{ padding: 0 }}
        >
          <div
            style={{
              minHeight: "300px",
              background: disabled ? "#f8f9fa" : "#fff",
              borderRadius: 8,
              border: disabled ? "1px solid #e9ecef" : "1px solid #d9d9d9",
            }}
          >
            <ReactQuill
              readOnly={disabled}
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              style={{ height: "250px" }}
              modules={{
                toolbar: false,
              }}
              formats={["list"]}
            />

            {/* Submit Synopsis Button - Between synopsis and feedback */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #f0f0f0",
                background: "#f8f9fa",
              }}
            >
              <Row justify="end">
                <Col>
                  {role !== "VerificationExecutive" ? (
                    <Button
                      type="primary"
                      size="small"
                      onClick={async () => {
                        // Sanitize content before saving
                        const sanitized = sanitizeToListOnly(editorContent);
                        const contentToSave = sanitized || "<ul><li><br></li></ul>";
                        
                        // For Verifier/Admin: Always use PATCH update when synopsis exists
                        if (existingSynopsis) {
                          try {
                            setSynopsisLoading(true);
                            await updateSynopsis(id as string, contentToSave);
                            message.success("Synopsis updated successfully!");
                            setExistingSynopsis(contentToSave);
                            setEditorContent(contentToSave);
                            setHasChanges(false);
                          } catch (error) {
                            console.error("Error updating synopsis:", error);
                            message.error("Failed to update synopsis");
                          } finally {
                            setSynopsisLoading(false);
                          }
                        } else {
                          // New synopsis submission - update editorContent with sanitized version first
                          setEditorContent(contentToSave);
                          await handleSynopsisSubmit();
                        }
                      }}
                      loading={synopsisLoading}
                      disabled={
                        disabled ||
                        !editorContent ||
                        editorContent.trim() === "<ul><li><br></li></ul>" ||
                        synopsisLoading ||
                        (!!existingSynopsis && !hasChanges)
                      }
                      style={{
                        background:
                          existingSynopsis && !hasChanges
                            ? "#9ca3af"
                            : "#1e40af",
                        border: "none",
                        borderRadius: "6px",
                        height: "32px",
                        fontSize: "14px",
                        fontWeight: "500",
                        boxShadow:
                          existingSynopsis && !hasChanges
                            ? "none"
                            : "0 2px 8px rgba(30, 64, 175, 0.3)",
                        color: "#ffffff",
                      }}
                    >
                      {existingSynopsis && !hasChanges
                        ? "No Changes"
                        : existingSynopsis
                          ? "Save"
                          : "Submit Synopsis"}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        const synopsisPlain = convertPointsToText(editorContent);
                        if (!synopsisPlain || synopsisPlain === "") {
                          message.warning("Please enter synopsis content before saving.");
                          return;
                        }
                        // message.success("Synopsis saved locally. It will be submitted with verification.");
                      }}
                      disabled={
                        disabled ||
                        !editorContent ||
                        editorContent.trim() === "<ul><li><br></li></ul>"
                      }
                      style={{
                        background: "#1e40af",
                        border: "none",
                        borderRadius: "6px",
                        height: "32px",
                        fontSize: "14px",
                        fontWeight: "500",
                        boxShadow: "0 2px 8px rgba(30, 64, 175, 0.3)",
                        color: "#ffffff",
                      }}
                    >
                      Save Synopsis
                    </Button>
                  )}
                </Col>
              </Row>
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #f0f0f0",
                background: "#fafafa",
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <strong>Feedback:</strong>
              </div>
              <Radio.Group
                value={verdict}
                onChange={handleVerdictChange}
                disabled={disabled}
              >
                <Radio value="positive">Positive</Radio>
                <Radio value="negative">Negative</Radio>
                <Radio value="credit_refer">Credit Refer</Radio>
              </Radio.Group>

              {/* Template Selection Dropdown - Hidden for Verifier, Admin, and VerificationExecutive */}
              {false && (
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Select Template:</strong>
                  </div>
                  <Select
                    placeholder="Choose a template"
                    style={{ width: "100%" }}
                    disabled={disabled}
                    options={templateOptions}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </div>
              )}

              {role !== "VerificationExecutive" && (
                <div style={{ textAlign: "right" }}>
                  <Button
                    disabled={!verdict || disabled}
                    type="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Feedback;
