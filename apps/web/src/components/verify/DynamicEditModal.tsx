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
                rules={itemField.required ? [{ required: true, message: `${itemField.label} is required` }] : []}
              >
                {renderFieldInput(itemField)}
              </Form.Item>
            ),
          }));

          // Action column for row removal
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

          return (
            <Card size="small" title={field.label} style={{ marginBottom: 12 }}>
              <Table
                dataSource={dataSource}
                columns={columns as any}
                pagination={false}
                bordered
                size="middle"
              />
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                style={{ width: '100%', marginTop: 8 }}
              >
                Add {field.label}
              </Button>
            </Card>
          );
        }}
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

