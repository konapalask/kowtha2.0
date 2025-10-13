import React from "react";
import { Form, FormInstance } from "antd";

interface FormSelectorProps {
  form: FormInstance;
  formKey: string;
  currentTab: string;
  getMaritalStatus?: () => string;
  currentDepartment?: string;
  bankName?: string;
}

/**
 * FormSelector - Legacy component for FI department forms
 *
 * Note: PD department now uses DynamicEditModal with array tracking.
 * This component is maintained for backward compatibility with FI forms.
 */
export const FormSelector: React.FC<FormSelectorProps> = ({
  form,
  formKey,
  currentTab,
  getMaritalStatus,
  currentDepartment,
  bankName,
}) => {
  // For PD department, forms should use DynamicEditModal instead
  if (currentDepartment === "PD") {
    return (
      <div style={{ padding: "16px", textAlign: "center", color: "#999" }}>
        <p>
          PD forms now use the dynamic schema system with enhanced array
          tracking.
        </p>
        <p>Please use the DynamicEditModal for editing PD form data.</p>
      </div>
    );
  }

  // Legacy FI form rendering
  // This is a stub - you may need to implement specific FI form fields here
  return (
    <div>
      <p style={{ color: "#999", fontStyle: "italic" }}>
        Legacy form editor for {formKey}
      </p>
      <p style={{ color: "#faad14", fontSize: "12px" }}>
        Note: This is a legacy component. Consider migrating to DynamicEditModal
        for better array handling.
      </p>
    </div>
  );
};
