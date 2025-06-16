import { Radio, Card, Button, Popconfirm } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface FinalVerdictProps {
  disabled?: boolean;
  initialVerdict?: string;
  initialRemarks?: string;
  onVerdictChange?: (verdict: string) => void;
  onRemarksChange?: (remarks: string) => void;
  handleSave: (verdict: string, remarks: string) => void;
  hasEditRequest?: boolean;
}

const FinalVerdict: React.FC<FinalVerdictProps> = ({
  disabled = false,
  initialVerdict = "",
  initialRemarks = "<ul><li><br></li></ul>",
  onVerdictChange,
  onRemarksChange,
  handleSave,
  hasEditRequest,
}) => {
  const [verdict, setVerdict] = useState(initialVerdict);
  const [editorContent, setEditorContent] = useState(initialRemarks);

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
      onRemarksChange?.("<ul><li><br></li></ul>");
    } else {
      setEditorContent(sanitized);
      onRemarksChange?.(sanitized);
    }
  };

  const handleVerdictChange = (e: any) => {
    setVerdict(e.target.value);
    onVerdictChange?.(e.target.value);
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <Card title="Final Verdict" bodyStyle={{ padding: 0 }} extra={<Popconfirm title="Are you sure you want to submit this final verdict?" onConfirm={()=>handleSave(verdict,editorContent)} disabled={hasEditRequest} >
        <Button type="primary" >Submit</Button>
      </Popconfirm>}>
       
        <div style={{ minHeight: "300px", background: "#fff", borderRadius: 8 }}>
          {/* <CustomToolbar /> */}
          <div style={{ paddingLeft:24, marginBottom: 16 }}>
          <Radio.Group
            value={verdict} 
            onChange={handleVerdictChange}
            disabled={disabled}
          >
            <Radio value="positive">Positive</Radio>
            <Radio value="negative">Negative</Radio>
          </Radio.Group>
          </div>
          <ReactQuill
            readOnly={disabled}
            theme="snow"
            value={editorContent}
            onChange={handleEditorChange}
            style={{ height: '300px' }}
            modules={{
              toolbar: false
            }}
            formats={["list"]}
          />
        </div>
      </Card>
    </section>
  );
};

export default FinalVerdict; 