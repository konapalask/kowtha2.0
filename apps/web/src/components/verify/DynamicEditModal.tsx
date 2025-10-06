import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Row, Col, Space, Card, message } from 'antd';
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
      await onSave(sectionId, values);
      message.success('Changes saved to edit logs successfully');
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('Form validation error:', error);
      message.error('Please fill all required fields');
    } finally {
      setLoading(false);
    }
  };

  const renderArrayField = (field: WebFieldDefinition) => {
    return (
      <Form.List name={field.id}>
        {(fields, { add, remove }) => (
          <div>
            {fields.map((formField, index) => (
              <Card 
                key={formField.key} 
                size="small" 
                style={{ marginBottom: 12 }}
                title={`${field.label} ${index + 1}`}
                extra={
                  fields.length > 1 && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(formField.name)}
                    />
                  )
                }
              >
                <Row gutter={[16, 16]}>
                  {field.arrayItemFields?.map((itemField) => (
                    <Col span={12} key={itemField.id}>
                      <Form.Item
                        name={[formField.name, itemField.id]}
                        label={itemField.label}
                        rules={[
                          { required: itemField.required, message: `${itemField.label} is required` }
                        ]}
                      >
                        {renderFieldInput(itemField)}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              icon={<PlusOutlined />}
              style={{ width: '100%' }}
            >
              Add {field.label}
            </Button>
          </div>
        )}
      </Form.List>
    );
  };

  const renderFieldInput = (field: WebFieldDefinition) => {
    switch (field.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={field.placeholder} />;
      
      case 'select':
        return (
          <Select
            placeholder={field.placeholder}
            options={field.options?.map(opt => ({ label: opt, value: opt }))}
            showSearch
          />
        );
      
      case 'textarea':
        return <TextArea rows={3} placeholder={field.placeholder} />;
      
      case 'array':
        return null; // Arrays are handled by renderArrayField
      
      default:
        return <Input placeholder={field.placeholder} />;
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

    return (
      <Col span={field.type === 'textarea' ? 24 : 12} key={field.id}>
        <Form.Item
          name={field.id}
          label={field.label}
          rules={[
            { required: field.required, message: `${field.label} is required` }
          ]}
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

