import { Radio, Card, Button, Select } from "antd";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface FeedbackProps {
  disabled?: boolean;
  verdict: boolean | null | string;
  setVerdict: any;
  editorContent: any;
  setEditorContent: any;
  handleSave: any;
}

const Feedback: React.FC<FeedbackProps> = ({
  disabled = false,
  verdict,
  setVerdict,
  editorContent,
  setEditorContent,
  handleSave,
}) => {
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

  return (
    <section style={{ marginBottom: 24 }}>
      <Card
        title="Synopsis"
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{ minHeight: "300px", background: "#fff", borderRadius: 8 }}
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
          
          {/* Feedback options moved to bottom */}
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
  );
};

export default Feedback; 