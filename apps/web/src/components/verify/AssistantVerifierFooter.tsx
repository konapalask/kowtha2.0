import { Button, message } from "antd";
import React from "react";

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
  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#fff",
        padding: "16px 24px",
        borderTop: "1px solid #f0f0f0",
        display: "flex",
        justifyContent: "center",
        zIndex: 1000,
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Button
        type="primary"
        size="large"
        onClick={onSave}
        loading={loading}
        disabled={disabled}
        style={{
          minWidth: "200px",
          height: "48px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Submit Verification
      </Button>
    </div>
  );
};

export default AssistantVerifierFooter;
