import { Radio, Card, Button, Select, Row, Col, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Custom CSS for larger font size in the editor
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
  
  /* Light color when read-only */
  .ql-editor.ql-disabled,
  .ql-editor[readonly] {
    background-color: #f8f9fa !important;
    color: #6c757d !important;
  }
  
  /* Light color for the entire editor container when disabled */
  .ql-container.ql-disabled {
    background-color: #f8f9fa !important;
  }
  
  .ql-toolbar.ql-disabled {
    background-color: #f8f9fa !important;
  }
`;
import { submitFinancialAnalysis, updateSynopsis } from "@/services/verifier.services";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { id } = router.query;
  const [synopsisLoading, setSynopsisLoading] = useState(false);
  const [existingSynopsis, setExistingSynopsis] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Function to convert text to points format
  const convertTextToPoints = (text: string): string => {
    if (!text) return "<ul><li><br></li></ul>";
    
    const points = text
      .split(/[•\-\*\.]/) 
      .map(point => point.trim())
      .filter(point => point.length > 0)
      .map(point => `<li>${point}</li>`)
      .join('');
    
    return `<ul>${points}</ul>`;
  };

  // Function to convert points back to text
  const convertPointsToText = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const liElements = doc.querySelectorAll("li");
    
    if (liElements.length === 0) return "";
    
    return Array.from(liElements)
      .map(li => li.textContent?.trim())
      .filter(text => text && text.length > 0)
      .join('. ');
  };
  
  // Fetch and display existing synopsis data when component loads
  useEffect(() => {
  
    let foundSynopsis = null;
    
    if (verificationData && verificationData.verifications && verificationData.verifications.length > 0) {
      const businessVerification = verificationData.verifications.find((v: any) => v.type === "Business");
      
      if (businessVerification && businessVerification.synopsis) {
        foundSynopsis = businessVerification.synopsis;
      }
    }
    

    if (!foundSynopsis && verificationData && verificationData.synopsis) {
      foundSynopsis = verificationData.synopsis;
    }
    
    // Fallback: check if synopsis is in the first verification
    if (!foundSynopsis && verificationData && verificationData.verifications && verificationData.verifications[0]) {
      const firstVerification = verificationData.verifications[0];
      if (firstVerification.synopsis) {
        foundSynopsis = firstVerification.synopsis;
      }
    }
    
    if (foundSynopsis) {
      setExistingSynopsis(foundSynopsis);
      // If backend already has UL HTML, use it directly; else convert plain text to UL
      const isHtmlList = /<\s*ul[^>]*>/i.test(foundSynopsis);
      const contentToSet = isHtmlList ? foundSynopsis : convertTextToPoints(foundSynopsis);
      setEditorContent(contentToSet);
    }
  }, [verificationData, setEditorContent]);
  
  const templateOptions = [
    { value: "TATA_CAPITAL_LIMITED", label: "TATA CAPITAL LIMITED" },
    { value: "TATA_CAPITAL_HOUSING_FINANCE_LIMITED", label: "TATA CAPITAL HOUSING FINANCE LIMITED" },
    { value: "INDIABULLS_HOUSING_FINANCE_LTD", label: "INDIABULLS HOUSING FINANCE LTD" },
    { value: "IDFC_FIRST_FINANCIAL_SERVICES_LIMITED", label: "IDFC FIRST FINANCIAL SERVICES LIMITED" },
    { value: "IIFL_HOUSING_FINANCE_LIMITED", label: "IIFL HOUSING FINANCE LIMITED" },
    { value: "ADITYA_BIRLA_HOUSING_FINANCE_LIMITED", label: "ADITYA BIRLA HOUSING FINANCE LIMITED" },
    { value: "PUNJAB_NATIONAL_BANK_HOUSING_FINANCE_LIMITED", label: "PUNJAB NATIONAL BANK HOUSING FINANCE LIMITED" },
    { value: "INDUSIND_HOUSING_FINANCE_LIMITED", label: "INDUSIND HOUSING FINANCE LIMITED" },
    { value: "INDUSIND_BANK_LIMITED", label: "INDUSIND BANK LIMITED" },
    { value: "CENTRUM_HOUSING_FINANCE_LTD", label: "CENTRUM HOUSING FINANCE LTD" },
    { value: "STATE_BANK_OF_INDIA_IT_VERIFICATION_AGENCY", label: "STATE BANK OF INDIA –IT VERIFICATION AGENCY" },
    { value: "AXIS_FINANCE_LTD", label: "AXIS FINANCE LTD" },
    { value: "FULLERTON_HOUSING_FINANCE_LTD", label: "FULLERTON HOUSING FINANCE LTD" },
    { value: "FULLERTON_CREDIT_COMPANY_LTD", label: "FULLERTON CREDIT COMPANY LTD" },
    { value: "AHAM_HOUSING_FINANCE_LTD", label: "AHAM HOUSING FINANCE LTD" },
    { value: "ICICI_HOME_FINANCE_LTD", label: "ICICI HOME FINANCE LTD" },
    { value: "PIRAMAL_HOUSING_FINANCE_LTD", label: "PIRAMAL HOUSING FINANCE LTD" },
    { value: "YES_BANK_LTD", label: "YES BANK LTD" },
    { value: "INCRED_HOUSING_FINANCE_LTD", label: "INCRED HOUSING FINANCE LTD" },
    { value: "AMBIT_FINVEST_PVT_LTD", label: "AMBIT FINVEST PVT.LTD" },
    { value: "INDOSTAR_HOME_FINANCE_PRIVATE_LIMITED", label: "INDOSTAR HOME FINANCE PRIVATE LIMITED" },
    { value: "BANK_OF_INDIA_DUE_DILIGENCE", label: "BANK OF INDIA - DUE DILIGENCE" },
    { value: "NEOGROWTH_CREDIT_PRIVATE_LIMITED", label: "NEOGROWTH CREDIT PRIVATE LIMITED" },
    { value: "CHOLAMANDALAM_INVESTMENT_AND_FINANCE_COMPANY_LTD", label: "CHOLAMANDALAM INVESTMENT AND FINANCE COMPANY LTD" },
    { value: "HOUSING_DEVELOPMENT_FINANCE_CORPORATION_LIMITED", label: "HOUSING DEVELOPMENT FINANCE CORPORATION LIMITED" },
    { value: "HIRANANDINI_FINANCIAL_SERVICES_PRIVATE_LTD", label: "HIRANANDINI FINANCIAL SERVICES PRIVATE LTD" },
    { value: "MUTHOOT_HOUSING_FINANCE_COMPANY_LIMITED", label: "MUTHOOT HOUSING FINANCE COMPANY LIMITED" },
    { value: "DCB_BANK_LTD", label: "DCB BANK LTD" },
    { value: "CANARA_BANK_DUE_DILIGENCE_ANDHRA_PRADESH", label: "CANARA BANK - DUE DILIGENCE FOR THE ENTIRE STATE OF ANDHRA PRADESH" },
    { value: "RBL_BANK_LIMITED", label: "RBL BANK LIMITED" },
    { value: "NORTHEN_ARC_CAPITAL_LTD", label: "NORTHEN ARC CAPITAL LTD" },
    { value: "AXIS_BANK_LTD", label: "AXIS BANK LTD" },
    { value: "ARKA_FINCAP_LIMITED", label: "ARKA FINCAP LIMITED" },
    { value: "CENT_BANK", label: "CENT BANK" },
    { value: "NIDO_HOME_FINANCE_LIMITED", label: "NIDO HOME FINANCE LIMITED" },
    { value: "HERO_FINCORP", label: "HERO FINCORP" },
    { value: "KOTAK_MAHINDRA_BANK_LIMITED", label: "KOTAK MAHINDRA BANK LIMITED" },
    { value: "SHRIRAM_HOUSING_FINANCE_LTD", label: "SHRIRAM HOUSING FINANCE LTD" },
    { value: "SHRIRAM_CITY_UNION_FINANCE_LTD", label: "SHRIRAM CITY UNION FINANCE LTD" },
    { value: "HERO_HOUSING_FINANCIAL_LTD", label: "HERO HOUSING FINANCIAL LTD" },
    { value: "GODREJ_CAPITAL", label: "GODREJ CAPITAL" }
  ];

  const sanitizeToListOnly = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find all <ul> elements
    const ul = doc.querySelector("ul");
    if (!ul) return "<ul><li><br></li></ul>"; // fallback if no list

    // Only keep <ul><li> structure, remove everything else
    const cleanUl = document.createElement("ul");

    ul.querySelectorAll("li").forEach((li: any) => {
      const cleanLi = document.createElement("li");
      cleanLi.innerHTML = li.innerHTML;
      cleanUl.appendChild(cleanLi);
    });

    return cleanUl.outerHTML;
  };

  const handleEditorChange = (content: string) => {
    const sanitized = sanitizeToListOnly(content);

    if (!sanitized || sanitized.trim() === "") {
      setEditorContent("<ul><li><br></li></ul>");
    } else {
      setEditorContent(sanitized);
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
      
      if (!synopsisPlain || synopsisPlain === '') {
        message.error('Please enter synopsis content before submitting');
        return;
      }

      // Get financial analysis data from verification data
      const businessVerification = verificationData?.verifications?.find((v: any) => v.type === "Business");
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
        synopsis: editorContent
      };

      console.log('Submitting synopsis with payload:', payload);
      
      if (isEditing) {
        // Update existing synopsis using PATCH
        await updateSynopsis(id as string, editorContent);
        message.success('Synopsis updated successfully!');
        setIsEditing(false);
        // Update the existing synopsis state with new content
        setExistingSynopsis(editorContent);
      } else {
        // Submit new synopsis with financial data
        await submitFinancialAnalysis(id as string, payload);
        message.success('Synopsis submitted successfully!');
        setExistingSynopsis(editorContent);
      }
      
    } catch (error) {
      console.error('Error submitting synopsis:', error);
      message.error(isEditing ? 'Failed to update synopsis' : 'Failed to submit synopsis');
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
          extra={
            existingSynopsis && (
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setIsEditing(true);
                  // If existing synopsis is UL HTML, use as-is; else convert text to UL
                  const isHtmlList = /<\s*ul[^>]*>/i.test(existingSynopsis);
                  const contentToSet = isHtmlList ? existingSynopsis : convertTextToPoints(existingSynopsis);
                  setEditorContent(contentToSet);
                  // Focus the editor for better UX
                  setTimeout(() => {
                    const editor = document.querySelector('.ql-editor');
                    if (editor) {
                      (editor as HTMLElement).focus();
                    }
                  }, 100);
                }}
                disabled={hasEditRequest}
              />
            )
          }
          bodyStyle={{ padding: 0 }}
        >
          <div
            style={{ 
              minHeight: "300px", 
              background: (disabled || (!!existingSynopsis && !isEditing)) ? "#f8f9fa" : "#fff", 
              borderRadius: 8,
              border: (disabled || (!!existingSynopsis && !isEditing)) ? "1px solid #e9ecef" : "1px solid #d9d9d9"
            }}
          >
            <ReactQuill
              readOnly={disabled || (!!existingSynopsis && !isEditing)}
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
            <div style={{ 
              padding: "16px 24px", 
              borderTop: "1px solid #f0f0f0",
              background: "#f8f9fa"
            }}>
              <Row justify="end">
                <Col>
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={handleSynopsisSubmit}
                    loading={synopsisLoading}
                    disabled={disabled || !editorContent || editorContent.trim() === "<ul><li><br></li></ul>" || synopsisLoading || (!!existingSynopsis && !isEditing)}
                    style={{
                      background: (existingSynopsis && !isEditing) ? "#9ca3af" : "#1e40af",
                      border: "none",
                      borderRadius: "6px",
                      height: "32px",
                      fontSize: "14px",
                      fontWeight: "500",
                      boxShadow: (existingSynopsis && !isEditing) ? "none" : "0 2px 8px rgba(30, 64, 175, 0.3)",
                      color: "#ffffff"
                    }}
                  >
                    {existingSynopsis && !isEditing ? "Synopsis Already Submitted" : isEditing ? "Update Synopsis" : "Submit Synopsis"}
                  </Button>
                </Col>
              </Row>
            </div>
            
            <div style={{ 
              padding: "16px 24px", 
              borderTop: "1px solid #f0f0f0",
              background: "#fafafa"
            }}>
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
              </Radio.Group>
              
              {/* Template Selection Dropdown */}
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
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              
              <div style={{ textAlign: "right" }}>
                <Button
                  disabled={!verdict || disabled}
                  type="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Feedback; 