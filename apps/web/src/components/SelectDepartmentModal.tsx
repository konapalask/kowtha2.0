import React from "react";
import { Modal, Radio, Button } from "antd";
import type { RadioChangeEvent } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface DepartmentRole {
  department: string;
  role: string;
}

interface SelectDepartmentModalProps {
  visible: boolean;
  departmentRoles: DepartmentRole[];
  onSelect: (department: string) => void;
  onCancel: () => void;
  isCurrentDepartment?: boolean; // New prop to distinguish between default and current department selection
}

const SelectDepartmentModal: React.FC<SelectDepartmentModalProps> = ({
  visible,
  departmentRoles,
  onSelect,
  onCancel,
  isCurrentDepartment = false,
}) => {
  const [selectedDepartment, setSelectedDepartment] = React.useState<string | null>(null);

  const handleOk = () => {
    if (selectedDepartment) {
      onSelect(selectedDepartment);
    }
  };

  const handleChange = (e: RadioChangeEvent) => {
    setSelectedDepartment(e.target.value);
  };

  React.useEffect(() => {
    if (!visible) {
      setSelectedDepartment(null);
    }
  }, [visible]);

  const modalStyles = {
    header: {
      background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      borderBottom: "none",
      padding: "16px 24px",
      position: 'relative' as const, // Fixed the type here
    },
    content: {
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    body: {
      padding: "32px 24px",
      background: "#f8fafc",
    },
    footer: {
      background: "#f1f5f9",
      borderTop: "1px solid #e2e8f0",
      padding: "16px 24px",
    },
  };

  return (
    <Modal
      title={
        <div style={{
          color: "white",
          fontWeight: 600,
          fontSize: 18,
          lineHeight: 1.5,
          paddingRight: 30
        }}>
          {isCurrentDepartment ? "Select Current Department" : "Select Default Department"}
        </div>
      }
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Confirm"
      closeIcon={
        <Button
          type="text"
          onClick={onCancel}
          style={{
            position: 'absolute',
            right: 24,
            top: 16,
            color: 'white',
            padding: 0,
            height: 'auto',
          }}
        >
          <CloseOutlined style={{ fontSize: 18 }} />
        </Button>
      }
      footer={[
        <Button key="cancel" onClick={onCancel} style={{ height: 40, borderRadius: 6 }}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="default"
          disabled={!selectedDepartment}
          onClick={handleOk}
          style={{
            height: 40,
            borderRadius: 6,
            fontWeight: 600,
            background: "white",
            border: "1px solid #d1d5db",
            color: selectedDepartment ? "#1d4ed8" : "#9ca3af",
          }}
        >
          Confirm Selection
        </Button>,
      ]}
      width={500}
      centered
      maskClosable={false}
      styles={modalStyles}
      aria-labelledby="department-modal-title"
      aria-describedby="department-modal-description"
    >
      <p
        id="department-modal-description"
        style={{ color: "#475569", fontSize: 16, marginBottom: 24, fontWeight: 500 }}
      >
        {isCurrentDepartment
          ? "Please select your current working department:"
          : "Please select your default department:"
        }
      </p>

      <Radio.Group
        onChange={handleChange}
        value={selectedDepartment}
        style={{ width: "100%" }}
        aria-labelledby="department-modal-description"
      >
        {departmentRoles.map(({ department, role }) => (
          <Radio
            key={department}
            value={department}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              marginBottom: 16,
              padding: "16px 20px",
              border: "2px solid #e2e8f0",
              borderRadius: 8,
              background: "white",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            aria-label={`Select ${department} department with role ${role}`}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 16 }}>
                {department}
              </span>
              <span style={{ color: "#64748b", fontSize: 14 }}>Role: {role}</span>
            </div>
          </Radio>
        ))}
      </Radio.Group>
    </Modal>
  );
};

export default SelectDepartmentModal;