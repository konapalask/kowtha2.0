import React, { useState } from "react";
import {
  Card,
  Descriptions,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Space,
  Divider,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { WebFormDefinition, WebFormData } from "@/types/webSchema";

interface GenericVerificationDisplayProps {
  data: any;
  schema: WebFormDefinition | null;
  loading?: boolean;
  onSave?: (updatedData: any) => void;
  onCancel?: () => void;
  readOnly?: boolean;
}

export const GenericVerificationDisplay: React.FC<
  GenericVerificationDisplayProps
> = ({ data, schema, loading = false, onSave, onCancel, readOnly = false }) => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [editingData, setEditingData] = useState(data);

  // Helper function to get field value from nested data structure
  const getFieldValue = (fieldPath: string): any => {
    const paths = fieldPath.split(".");
    let value = editingData;

    for (const path of paths) {
      if (value && typeof value === "object") {
        value = value[path];
      } else {
        return undefined;
      }
    }

    return value;
  };

  // Helper function to set field value in nested data structure
  const setFieldValue = (fieldPath: string, value: any): void => {
    const paths = fieldPath.split(".");
    const newData = { ...editingData };
    let current = newData;

    // Navigate to the parent object
    for (let i = 0; i < paths.length - 1; i++) {
      const path = paths[i];
      if (!current[path] || typeof current[path] !== "object") {
        current[path] = {};
      }
      current = current[path];
    }

    // Set the final value
    const finalPath = paths[paths.length - 1];
    current[finalPath] = value;

    setEditingData(newData);
  };

  // Render field based on type
  const renderField = (field: any, sectionName: string): React.ReactNode => {
    const fieldPath = `${sectionName}.${field.id}`;
    const value = getFieldValue(fieldPath);

    if (editMode && !readOnly) {
      return renderEditableField(field, fieldPath, value);
    } else {
      return renderDisplayField(field, value);
    }
  };

  // Render editable field
  const renderEditableField = (
    field: any,
    fieldPath: string,
    value: any
  ): React.ReactNode => {
    const commonProps = {
      value: value || "",
      onChange: (e: any) => {
        const newValue = e.target ? e.target.value : e;
        setFieldValue(fieldPath, newValue);
      },
      placeholder: field.placeholder || `Enter ${field.label}`,
    };

    switch (field.type) {
      case "select":
        return (
          <Select
            {...commonProps}
            style={{ width: "100%" }}
            options={field.options?.map((opt: any) => ({
              label: opt.label,
              value: opt.value,
            }))}
          />
        );
      case "textarea":
        return <Input.TextArea {...commonProps} rows={3} />;
      case "number":
        return <Input {...commonProps} type="number" />;
      case "boolean":
        return (
          <Switch
            checked={!!value}
            onChange={(checked) => setFieldValue(fieldPath, checked)}
          />
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  // Render display field
  const renderDisplayField = (field: any, value: any): React.ReactNode => {
    if (!value && value !== 0) return "-";

    switch (field.type) {
      case "boolean":
        return value ? "Yes" : "No";
      case "array":
        if (Array.isArray(value)) {
          return value.length > 0 ? `${value.length} items` : "No items";
        }
        return "-";
      default:
        return String(value);
    }
  };

  // Render array field
  const renderArrayField = (
    field: any,
    sectionName: string
  ): React.ReactNode => {
    const fieldPath = `${sectionName}.${field.id}`;
    const value = getFieldValue(fieldPath);

    if (!Array.isArray(value)) return "-";

    if (value.length === 0) {
      return "No items";
    }

    if (editMode && !readOnly) {
      return (
        <div>
          {value.map((item: any, index: number) => (
            <Card
              key={item._id || index}
              size="small"
              style={{ marginBottom: 8 }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {field.itemSchema?.fields?.map((itemField: any) => (
                  <div key={itemField.key}>
                    <label style={{ fontWeight: "bold", marginRight: 8 }}>
                      {itemField.label}:
                    </label>
                    {renderField(
                      {
                        ...itemField,
                        id: `${fieldPath}[${index}].${itemField.id}`,
                      },
                      ""
                    )}
                  </div>
                ))}
              </Space>
            </Card>
          ))}
        </div>
      );
    } else {
      return (
        <div>
          {value.map((item: any, index: number) => (
            <Card
              key={item._id || index}
              size="small"
              style={{ marginBottom: 8 }}
            >
              <Descriptions size="small" column={1}>
                {field.itemSchema?.fields?.map((itemField: any) => (
                  <Descriptions.Item key={itemField.id} label={itemField.label}>
                    {renderDisplayField(itemField, item[itemField.id])}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Card>
          ))}
        </div>
      );
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      if (onSave) {
        await onSave(editingData);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingData(data);
    setEditMode(false);
    if (onCancel) {
      onCancel();
    }
  };

  if (loading) {
    return <div>Loading verification data...</div>;
  }

  if (!schema) {
    return <div>No schema available for this verification.</div>;
  }

  return (
    <div>
      {/* Header with Edit/Save/Cancel buttons */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Verification Details</h2>
        <Space>
          {editMode ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditMode(true)}
              disabled={readOnly}
            >
              Edit
            </Button>
          )}
        </Space>
      </div>

      {/* Render sections */}
      {schema.sections?.map((section) => (
        <Card
          key={section.id}
          title={section.label}
          style={{ marginBottom: 16 }}
        >
          <Descriptions
            bordered
            column={editMode ? 1 : 2}
            size={editMode ? "default" : "small"}
          >
            {section.fields?.map((field) => (
              <Descriptions.Item
                key={field.id}
                label={field.label}
                span={editMode ? 1 : 1}
              >
                {field.type === "array"
                  ? renderArrayField(field, section.id)
                  : renderField(field, section.id)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      ))}
    </div>
  );
};

export default GenericVerificationDisplay;
