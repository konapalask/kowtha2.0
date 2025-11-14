import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  Space,
  Typography,
} from "antd";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface SimpleDynamicFormProps {
  loanData: any; // Read-only loan data (application number, bank name, etc.)
  verificationData: any; // Field executive's data that can be edited
  schema: any; // Bank schema defining sections and fields
  onSave?: (updatedData: any) => void;
  loading?: boolean;
}

export const SimpleDynamicForm: React.FC<SimpleDynamicFormProps> = ({
  loanData,
  verificationData,
  schema,
  onSave,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get field value from verification data
  const getFieldValue = (fieldPath: string) => {
    const paths = fieldPath.split(".");
    let value = verificationData;

    for (const path of paths) {
      if (value && typeof value === "object") {
        value = value[path];
      } else {
        return undefined;
      }
    }

    return value;
  };

  // Render field based on type
  const renderField = (field: any, sectionId: string) => {
    const fieldPath = `${sectionId}.${field.id}`;
    const value = getFieldValue(fieldPath);

    const commonProps = {
      placeholder: `Enter ${field.label}`,
      disabled: !editMode, // Allow editing of readOnly fields when in edit mode
    };

    switch (field.type) {
      case "select":
        return (
          <Select
            {...commonProps}
            options={field.enum?.map((option: string) => ({
              label: option,
              value: option,
            }))}
          />
        );
      case "number":
        return <InputNumber {...commonProps} style={{ width: "100%" }} />;
      case "textarea":
        return <Input.TextArea {...commonProps} rows={3} />;
      default:
        return <Input {...commonProps} />;
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      const values = form.getFieldsValue();

      // Merge with existing verification data
      const updatedData = {
        ...verificationData,
        ...values,
      };

      if (onSave) {
        await onSave(updatedData);
      }

      setEditMode(false);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  // Set initial form values
  React.useEffect(() => {
    if (verificationData) {
      form.setFieldsValue(verificationData);
    }
  }, [verificationData, form]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {loanData?.bankName || "Verification"}
          </Title>
          <Text type="secondary">
            Application: {loanData?.applicationNumber}
          </Text>
        </div>
        <Space>
          {editMode ? (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          )}
        </Space>
      </div>

      {/* Read-only Loan Information */}
      <Card title="Loan Information" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div>
              <Text strong>Application Number:</Text>{" "}
              {loanData?.applicationNumber}
            </div>
          </Col>
          <Col span={8}>
            <div>
              <Text strong>Bank:</Text> {loanData?.bankName}
            </div>
          </Col>
          <Col span={8}>
            <div>
              <Text strong>Applicant:</Text> {loanData?.applicantName}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Dynamic Sections from Schema */}
      <Form form={form} layout="vertical">
        {schema?.sections?.map((section: any) => (
          <Card
            key={section.id}
            title={section.label}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={[16, 16]}>
              {section.fields?.map((field: any) => (
                <Col
                  key={field.id}
                  span={field.span || 8} // Default to 3 columns (24/8=3)
                  xs={24}
                  sm={12}
                  md={8}
                >
                  <Form.Item
                    name={[section.id, field.id]}
                    label={field.label}
                    initialValue={getFieldValue(`${section.id}.${field.id}`)}
                    required={field.required}
                  >
                    {renderField(field, section.id)}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Card>
        ))}
      </Form>
    </div>
  );
};

export default SimpleDynamicForm;


