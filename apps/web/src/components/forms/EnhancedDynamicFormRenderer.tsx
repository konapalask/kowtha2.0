import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Switch,
  Descriptions,
  Typography,
  Divider,
  message,
  Table
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { WebFormDefinition, WebSectionDefinition, WebFieldDefinition, WebFormData } from '@/types/webSchema';
import { validateFormData } from '@/utils/mobileToWebSchemaConverter';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface EnhancedDynamicFormRendererProps {
  schema: WebFormDefinition;
  initialData?: WebFormData;
  onSubmit: (data: WebFormData) => void;
  onDataChange: (sectionId: string, data: any) => void;
  readOnly?: boolean;
  showValidation?: boolean;
  autoSave?: boolean;
  onEdit?: (sectionId: string) => void; // Callback when edit button is clicked
  hasEditRequest?: boolean; // Whether there's a pending edit request
}

export const EnhancedDynamicFormRenderer: React.FC<EnhancedDynamicFormRendererProps> = ({
  schema,
  initialData = {},
  onSubmit,
  onDataChange,
  readOnly = false,
  showValidation = true,
  autoSave = true,
  onEdit,
  hasEditRequest = false,
}) => {
  const [form] = Form.useForm();
  const [sectionValidation, setSectionValidation] = useState<{[key: string]: boolean}>({});
  const [formData, setFormData] = useState<WebFormData>(initialData);

  // Initialize form with initialData
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('Setting form values from initialData:', initialData);
      form.setFieldsValue(initialData);
      setFormData(initialData);
    }
  }, [initialData, form]);

  // Watch form values for auto-save and validation
  const formValues = Form.useWatch([], form);

  useEffect(() => {
    if (formValues && autoSave) {
      setFormData(formValues);
      // Auto-save logic can be implemented here
    }
  }, [formValues, autoSave]);

  const renderField = (field: WebFieldDefinition, sectionId: string) => {
    const commonProps = {
      placeholder: field.placeholder || field.label,
      disabled: readOnly || field.readOnly,
    };

    switch (field.type) {
      case 'text':
        return <Input {...commonProps} />;
      
      case 'select':
        return (
          <Select 
            {...commonProps} 
            options={field.options?.map(opt => ({ label: opt, value: opt }))} 
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        );
      
      case 'date':
        return <DatePicker {...commonProps} style={{ width: '100%' }} />;
      
      case 'number':
        return <InputNumber {...commonProps} style={{ width: '100%' }} />;
      
      case 'textarea':
        return <TextArea {...commonProps} rows={4} />;
      
      case 'boolean':
        return <Switch {...commonProps} />;
      
      case 'array':
        return <DynamicArrayField field={field} sectionId={sectionId} readOnly={readOnly} />;
      
      default:
        return <Input {...commonProps} />;
    }
  };

  const DynamicArrayField: React.FC<{field: WebFieldDefinition, sectionId: string, readOnly: boolean}> = ({ 
    field, 
    sectionId, 
    readOnly 
  }) => {
    const [items, setItems] = useState<any[]>(
      formData[sectionId]?.[field.id] || [{}]
    );

    // Update items when formData changes (for initialData loading)
    useEffect(() => {
      const dataItems = formData[sectionId]?.[field.id];
      if (dataItems && Array.isArray(dataItems) && dataItems.length > 0) {
        // Filter out empty objects
        const validItems = dataItems.filter(item => 
          item && Object.keys(item).length > 0
        );
        if (validItems.length > 0) {
          setItems(validItems);
        }
      }
    }, [formData, sectionId, field.id]);

    const addItem = () => {
      const newItems = [...items, {}];
      setItems(newItems);
      updateFormData(sectionId, field.id, newItems);
    };

    const removeItem = (index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      updateFormData(sectionId, field.id, newItems);
    };

    const updateItem = (index: number, key: string, value: any) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [key]: value };
      setItems(newItems);
      updateFormData(sectionId, field.id, newItems);
    };

    const updateFormData = (sectionId: string, fieldId: string, value: any) => {
      const newFormData = {
        ...formData,
        [sectionId]: {
          ...formData[sectionId],
          [fieldId]: value,
        },
      };
      setFormData(newFormData);
      onDataChange(sectionId, newFormData[sectionId]);
    };

    return (
      <div>
        {items.map((item, index) => (
          <Card key={index} size="small" style={{ marginBottom: 12 }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text strong>{`${field.label} ${index + 1}`}</Text>
                  {!readOnly && items.length > 1 && (
                    <Button 
                      icon={<DeleteOutlined />} 
                      onClick={() => removeItem(index)}
                      danger
                      size="small"
                      type="text"
                    />
                  )}
                </Space>
              </Col>
              
              {/* Dynamically render array item fields based on schema */}
              {field.arrayItemFields && field.arrayItemFields.map((itemField: WebFieldDefinition) => (
                <Col span={12} key={itemField.id}>
                  {itemField.type === 'number' ? (
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{itemField.label}</Text>
                      <InputNumber
                        placeholder={itemField.label}
                        value={item[itemField.id]}
                        onChange={(value) => updateItem(index, itemField.id, value)}
                        disabled={readOnly}
                        style={{ width: '100%' }}
                      />
                    </div>
                  ) : itemField.type === 'select' ? (
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{itemField.label}</Text>
                      <Select
                        placeholder={itemField.label}
                        value={item[itemField.id]}
                        onChange={(value) => updateItem(index, itemField.id, value)}
                        disabled={readOnly}
                        options={itemField.options?.map((opt: string) => ({ label: opt, value: opt }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  ) : itemField.type === 'textarea' ? (
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{itemField.label}</Text>
                      <TextArea
                        placeholder={itemField.label}
                        value={item[itemField.id]}
                        onChange={(e) => updateItem(index, itemField.id, e.target.value)}
                        disabled={readOnly}
                        rows={2}
                      />
                    </div>
                  ) : (
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{itemField.label}</Text>
                      <Input
                        placeholder={itemField.label}
                        value={item[itemField.id]}
                        onChange={(e) => updateItem(index, itemField.id, e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                  )}
                </Col>
              ))}
            </Row>
          </Card>
        ))}
        {!readOnly && (
          <Button 
            icon={<PlusOutlined />} 
            onClick={addItem}
            type="dashed"
            style={{ width: '100%', marginTop: 8 }}
          >
            Add {field.label}
          </Button>
        )}
      </div>
    );
  };

  const validateSection = (section: WebSectionDefinition): boolean => {
    const sectionData = formData[section.id];
    if (!sectionData) return false;

    // Check if required fields are filled
    const requiredFields = section.fields.filter(field => field.required);
    const filledRequiredFields = requiredFields.filter(field => {
      const value = sectionData[field.id];
      return value !== undefined && value !== null && value !== '';
    });

    return filledRequiredFields.length === requiredFields.length;
  };

  const renderSection = (section: WebSectionDefinition) => {
    const isValid = validateSection(section);
    
    // Separate array and non-array fields
    const arrayFields = section.fields.filter(f => f.type === 'array');
    const regularFields = section.fields.filter(f => f.type !== 'array');
    
    return (
      <section key={section.id} style={{ marginBottom: 24 }}>
        <Card
          title={
            <Space>
              <span>{section.label}</span>
              {section.required && <span style={{ color: 'red' }}>*</span>}
              {showValidation && (
                isValid ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                )
              )}
            </Space>
          }
          extra={
            onEdit && !readOnly && !hasEditRequest && (
              <Button 
                type="text" 
                icon={<EditOutlined />}
                onClick={() => onEdit(section.id)}
                disabled={hasEditRequest}
              >
                Edit
              </Button>
            )
          }
        >
          {/* Regular fields in Descriptions table */}
          {regularFields.length > 0 && (
            <Descriptions bordered column={2} size="middle" style={{ marginBottom: arrayFields.length > 0 ? 16 : 0 }}>
              {regularFields.map(field => {
                const value = form.getFieldValue([section.id, field.id]);
                return (
                  <Descriptions.Item 
                    key={field.id} 
                    label={
                      <Space>
                        <span>{field.label}</span>
                        {field.required && <span style={{ color: 'red' }}>*</span>}
                      </Space>
                    }
                    span={field.type === 'textarea' ? 2 : 1}
                  >
                    {value || <Text type="secondary">-</Text>}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          )}

          {/* Array fields rendered as tables (FI style) */}
          {arrayFields.map(field => {
            const arrayData = form.getFieldValue([section.id, field.id]) || [];
            
            // Build table columns from arrayItemFields
            const columns = field.arrayItemFields?.map((itemField: WebFieldDefinition) => ({
              title: itemField.label,
              dataIndex: itemField.id,
              key: itemField.id,
              render: (text: any) => text || <Text type="secondary">-</Text>,
            })) || [];
            
            return (
              <div key={field.id} style={{ marginTop: regularFields.length > 0 ? 16 : 0 }}>
                <div style={{ 
                  fontWeight: 600,
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>
                    {field.label}
                    {field.required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
                  </span>
                </div>
                <Table
                  dataSource={arrayData.filter((item: any) => item && Object.keys(item).length > 0)}
                  columns={columns}
                  pagination={false}
                  bordered
                  locale={{ emptyText: `No ${field.label.toLowerCase()} added yet` }}
                  rowKey={(record, index) => index?.toString() || '0'}
                  size="middle"
                />
              </div>
            );
          })}
        </Card>
      </section>
    );
  };

  const handleSubmit = (values: any) => {
    const validation = validateFormData(values, schema);
    if (!validation.isValid) {
      message.error(`Please fix the following errors: ${validation.errors.join(', ')}`);
      return;
    }
    onSubmit(values);
  };

  const handleReset = () => {
    form.resetFields();
    setFormData(initialData);
  };

  return (
    <div>
      {/* Header card removed as requested */}

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        initialValues={initialData}
      >
        {schema.sections.map(renderSection)}
        
        <Divider />
        
        {!readOnly && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Space size="large">
              <Button type="primary" htmlType="submit" size="large">
                Submit Verification
              </Button>
              <Button size="large" onClick={handleReset}>
                Reset Form
              </Button>
            </Space>
          </div>
        )}
      </Form>
    </div>
  );
};
