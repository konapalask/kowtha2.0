import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Row, Col, Space, Card, message, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { WebSectionDefinition, WebFieldDefinition } from '@/types/webSchema';

const { TextArea } = Input;

interface DynamicEditModalProps {
  visible: boolean;
  onCancel: () => void;
  sectionSchema: WebSectionDefinition | null;
  initialData: any;
  onSave: (sectionId: string, data: any) => Promise<void>;
  sectionId: string;
}

export const DynamicEditModal: React.FC<DynamicEditModalProps> = ({
  visible,
  onCancel,
  sectionSchema,
  initialData,
  onSave,
  sectionId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Helper function to validate non-empty strings
  const validateNonEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
      // Check if string has at least one non-whitespace character
      return value.trim().length > 0;
    }
    if (typeof value === 'number') {
      return !isNaN(value);
    }
    return true; // For other types, consider them valid
  };

  // Helper function to clean whitespace-only values
  const cleanWhitespaceValues = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim() === '' ? undefined : obj.trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(cleanWhitespaceValues).filter(item => item !== undefined);
    }
    if (typeof obj === 'object' && obj !== null) {
      const cleaned: any = {};
      for (const key in obj) {
        const cleanedValue = cleanWhitespaceValues(obj[key]);
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
      return cleaned;
    }
    return obj;
  };

  useEffect(() => {
    if (visible && initialData && sectionSchema) {
      // Set initial form values
      form.setFieldsValue(initialData);
    }
  }, [visible, initialData, sectionSchema, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Additional validation for empty strings/spaces - only save if at least one non-whitespace character
      const validationErrors: string[] = [];
      if (sectionSchema) {
        sectionSchema.fields.forEach(field => {
          const value = values[field.id];
          
          // Check if value is whitespace-only (for both required and non-required fields)
          if (typeof value === 'string' && value.trim() === '') {
            validationErrors.push(field.label);
          }
          
          // Check array fields
          if (field.type === 'array' && field.arrayItemFields) {
            const arrayValue = values[field.id];
            if (Array.isArray(arrayValue)) {
              arrayValue.forEach((item: any, index: number) => {
                field.arrayItemFields?.forEach(itemField => {
                  const itemValue = item[itemField.id];
                  if (typeof itemValue === 'string' && itemValue.trim() === '') {
                    validationErrors.push(`${field.label}[${index + 1}].${itemField.label}`);
                  }
                });
              });
            }
          }
        });
      }
      
      if (validationErrors.length > 0) {
        message.error(validationErrors.join(', '));
        return;
      }
      
      // Clean whitespace-only values before saving
      const cleanedValues = cleanWhitespaceValues(values);
      
      // Only save to request logs if validation passes (at least one non-whitespace character)
      await onSave(sectionId, cleanedValues);
      message.success('Changes saved to edit logs successfully');
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('Form validation error:', error);
      message.error('Please fill all required fields with valid content');
    } finally {
      setLoading(false);
    }
  };

  const renderArrayField = (field: WebFieldDefinition) => {
    // Render array items in a table layout similar to FI edit modals
    return (
      <Form.List name={field.id}>
        {(fields, { add, remove }) => {
          // Build row data for the table; carry the name path for each row
          const dataSource = fields.map((f, idx) => ({ key: f.key, index: idx, namePath: f.name }));

          // Build columns from array item fields
          const columns = (field.arrayItemFields || []).map((itemField) => ({
            title: itemField.label,
            dataIndex: itemField.id,
            key: itemField.id,
            render: (_: any, row: any) => (
              <Form.Item
                name={[row.namePath, itemField.id]}
                style={{ marginBottom: 0 }}
                rules={itemField.required ? [
                  { required: true, message: `${itemField.label} is required` },
                  {
                    validator: (_: any, value: any) => {
                      if (!validateNonEmpty(value)) {
                        return Promise.reject(new Error(`Please enter at least one character for: ${itemField.label}`));
                      }
                      return Promise.resolve();
                    }
                  }
                ] : []}
              >
                {renderFieldInput(itemField)}
              </Form.Item>
            ),
          }));

          // Action column for row removal (only if field is not readOnly)
          if (!field.readOnly) {
            columns.push({
              title: '',
              dataIndex: '__actions',
              key: 'actions',
              // Provide two-arg compatible function and derive index from row.key
              render: (_: any, row: any) => {
                const index = dataSource.findIndex(r => r.key === row.key);
                if (fields.length <= 1 || index < 0) {
                  return <span />;
                }
                return (
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(fields[index].name)}
                  />
                );
              },
            });
          }

          return (
            <Card size="small" title={field.label} style={{ marginBottom: 12 }}>
              <Table
                dataSource={dataSource}
                columns={columns as any}
                pagination={false}
                bordered
                size="middle"
              />
              {!field.readOnly && (
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ width: '100%', marginTop: 8 }}
                >
                  Add {field.label}
                </Button>
              )}
            </Card>
          );
        }}
      </Form.List>
    );
  };

  const renderObjectField = (field: WebFieldDefinition) => {
    return (
      <Card title={field.label} size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          {field.objectFields?.map((objectField) => (
            <Col span={objectField.type === 'textarea' ? 24 : 12} key={objectField.id}>
              <Form.Item
                name={[field.id, objectField.id]}
                label={objectField.label}
                rules={objectField.required ? [
                  { required: true, message: `${objectField.label} is required` },
                  {
                    validator: (_: any, value: any) => {
                      if (!validateNonEmpty(value)) {
                        return Promise.reject(new Error(`Please enter at least one character for: ${objectField.label}`));
                      }
                      return Promise.resolve();
                    }
                  }
                ] : []}
              >
                {renderFieldInput(objectField)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  const renderFieldInput = (field: WebFieldDefinition) => {
    const isReadOnly = field.readOnly;
    
    // Common onChange handler to trim whitespace
    const handleChange = (value: any, onChange?: (value: any) => void) => {
      if (typeof value === 'string' && onChange) {
        // Trim whitespace but allow user to type spaces
        onChange(value);
      } else if (onChange) {
        onChange(value);
      }
    };
    
    switch (field.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={field.placeholder} disabled={isReadOnly} />;
      
      case 'select':
        return (
          <Select
            placeholder={field.placeholder}
            options={field.options?.map(opt => ({ label: opt, value: opt }))}
            showSearch
            disabled={isReadOnly}
          />
        );
      
      case 'textarea':
        return (
          <TextArea 
            rows={3} 
            placeholder={field.placeholder} 
            disabled={isReadOnly}
            onBlur={(e) => {
              // Trim whitespace on blur
              const trimmedValue = e.target.value.trim();
              if (trimmedValue !== e.target.value) {
                e.target.value = trimmedValue;
                form.setFieldValue(field.id, trimmedValue);
              }
            }}
          />
        );
      
      case 'array':
        return null; // Arrays are handled by renderArrayField
      
      case 'object':
        return null; // Objects are handled by renderObjectField
      
      default:
        return (
          <Input 
            placeholder={field.placeholder} 
            disabled={isReadOnly}
            onBlur={(e) => {
              // Trim whitespace on blur
              const trimmedValue = e.target.value.trim();
              if (trimmedValue !== e.target.value) {
                e.target.value = trimmedValue;
                form.setFieldValue(field.id, trimmedValue);
              }
            }}
          />
        );
    }
  };

  const renderField = (field: WebFieldDefinition) => {
    if (field.type === 'array') {
      return (
        <Col span={24} key={field.id}>
          {renderArrayField(field)}
        </Col>
      );
    }

    if (field.type === 'object') {
      return (
        <Col span={24} key={field.id}>
          {renderObjectField(field)}
        </Col>
      );
    }

    return (
      <Col span={field.type === 'textarea' ? 24 : 12} key={field.id}>
        <Form.Item
          name={field.id}
          label={field.label}
          rules={field.required ? [
            { required: true, message: `${field.label} is required` },
            {
              validator: (_: any, value: any) => {
                if (!validateNonEmpty(value)) {
                  return Promise.reject(new Error(`Please enter at least one character for: ${field.label}`));
                }
                return Promise.resolve();
              }
            }
          ] : []}
        >
          {renderFieldInput(field)}
        </Form.Item>
      </Col>
    );
  };

  if (!sectionSchema) {
    return null;
  }

  return (
    <Modal
      title={`Edit ${sectionSchema.label}`}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Save to Logs
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialData}
      >
        <Row gutter={[16, 16]}>
          {sectionSchema.fields.map(renderField)}
        </Row>
      </Form>
    </Modal>
  );
};

