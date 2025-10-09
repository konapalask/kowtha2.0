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
  layout?: 'vertical' | 'side-by-side'; // Layout option for form display
  sideBySideSections?: string[]; // Specific sections that should use side-by-side layout
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
  layout = 'vertical',
  sideBySideSections = [],
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

  const renderField = (field: WebFieldDefinition, sectionId: string) => {
    const isFieldReadOnly = readOnly || field.readOnly;
    
    // For readOnly fields, render as plain text instead of form controls
    if (isFieldReadOnly) {
      const value = form.getFieldValue([sectionId, field.id]);
      const isEmpty = !validateNonEmpty(value);
      const isEmptyString = typeof value === 'string' && value.trim() === '';
      
      return (
        <Text 
          type={(isEmpty || isEmptyString) && field.required ? "danger" : "secondary"} 
          style={{ fontSize: '14px', padding: '4px 0' }}
        >
          {(isEmpty || isEmptyString) && field.required ? 'Please fill the required field' : (value || '-')}
        </Text>
      );
    }

    const commonProps = {
      placeholder: field.placeholder || field.label,
      disabled: false, // Only global readOnly affects this now
    };

    // Add validation rules for required fields
    const validationRules = [];
    if (field.required) {
      validationRules.push({
        required: true,
        message: `${field.label} is required`,
        validator: (_: any, value: any) => {
          if (!validateNonEmpty(value)) {
            return Promise.reject(new Error(`Please enter at least one character for: ${field.label}`));
          }
          return Promise.resolve();
        }
      });
    }

    // Wrap field in Form.Item for validation
    const renderFieldInput = () => {
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

    return (
      <Form.Item
        name={[sectionId, field.id]}
        rules={validationRules}
        style={{ marginBottom: 0 }}
      >
        {renderFieldInput()}
      </Form.Item>
    );
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
                  {!readOnly && !field.readOnly && items.length > 1 && (
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
              {field.arrayItemFields && field.arrayItemFields.map((itemField: WebFieldDefinition) => {
                const isItemFieldReadOnly = readOnly || itemField.readOnly;
                
                // Validation rules for array item fields
                const itemValidationRules = [];
                if (itemField.required) {
                  itemValidationRules.push({
                    required: true,
                    message: `${itemField.label} is required`,
                    validator: (_: any, value: any) => {
                      if (!validateNonEmpty(value)) {
                        return Promise.reject(new Error(`Please enter at least one character for: ${itemField.label}`));
                      }
                      return Promise.resolve();
                    }
                  });
                }
                
                return (
                  <Col span={12} key={itemField.id}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{itemField.label}</Text>
                      {isItemFieldReadOnly ? (
                        <div style={{ padding: '4px 0', fontSize: '14px' }}>
                          {(() => {
                            const itemValue = item[itemField.id];
                            const isEmpty = !validateNonEmpty(itemValue);
                            const isEmptyString = typeof itemValue === 'string' && itemValue.trim() === '';
                            return (isEmpty || isEmptyString) && itemField.required ? (
                              <Text type="danger">Please fill the required field</Text>
                            ) : (
                              <Text type="secondary">{itemValue || '-'}</Text>
                            );
                          })()}
                        </div>
                      ) : (
                        <Form.Item
                          name={[sectionId, field.id, index, itemField.id]}
                          rules={itemValidationRules}
                          style={{ marginBottom: 0 }}
                        >
                          {itemField.type === 'number' ? (
                            <InputNumber
                              placeholder={itemField.label}
                              style={{ width: '100%' }}
                            />
                          ) : itemField.type === 'select' ? (
                            <Select
                              placeholder={itemField.label}
                              options={itemField.options?.map((opt: string) => ({ label: opt, value: opt }))}
                              style={{ width: '100%' }}
                            />
                          ) : itemField.type === 'textarea' ? (
                            <TextArea
                              placeholder={itemField.label}
                              rows={2}
                            />
                          ) : (
                            <Input
                              placeholder={itemField.label}
                            />
                          )}
                        </Form.Item>
                      )}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card>
        ))}
        {!readOnly && !field.readOnly && (
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
    
    // Check if this specific section should use side-by-side layout
    const useSideBySideForSection = sideBySideSections.includes(section.id);
    
    // Separate array and non-array fields
    const arrayFields = section.fields.filter(f => f.type === 'array');
    const regularFields = section.fields.filter(f => f.type !== 'array');
    
    return (
      <section key={section.id} style={{ marginBottom: 24 }}>
        <Card
          title={
            <Space>
              <span>{section.label}</span>
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
            <Descriptions 
              bordered 
              column={2} 
              size="middle" 
              style={{ marginBottom: arrayFields.length > 0 ? 16 : 0 }}
            >
              {regularFields.map(field => {
                const value = form.getFieldValue([section.id, field.id]);
                const isEmpty = !validateNonEmpty(value);
                const isEmptyString = typeof value === 'string' && value.trim() === '';
                
                
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
                    {(isEmpty || isEmptyString) && field.required ? (
                      <Text type="danger">Please fill the required field</Text>
                    ) : (
                      value || <Text type="secondary">-</Text>
                    )}
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
              render: (text: any) => {
                const isEmpty = !validateNonEmpty(text);
                const isEmptyString = typeof text === 'string' && text.trim() === '';
                if ((isEmpty || isEmptyString) && itemField.required) {
                  return <Text type="danger">Please fill the required field</Text>;
                }
                return text || <Text type="secondary">-</Text>;
              },
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
                  {(() => {
                    const sectionLabel = (section.label || '').trim().toLowerCase();
                    const fieldLabel = (field.label || '').trim().toLowerCase();
                    const isDuplicateHeading = fieldLabel !== '' && fieldLabel === sectionLabel;
                    if (isDuplicateHeading) return null; // avoid duplicate heading when same as section label
                    return (
                      <span>
                        {field.label}
                        {field.required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
                      </span>
                    );
                  })()}
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
    // First run the schema validation
    const validation = validateFormData(values, schema);
    if (!validation.isValid) {
      message.error(`Please fix the following errors: ${validation.errors.join(', ')}`);
      return;
    }
    
    // Additional validation for empty strings/spaces - only submit if at least one non-whitespace character
    const additionalErrors: string[] = [];
    schema.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          const value = values[section.id]?.[field.id];
          if (!validateNonEmpty(value)) {
            additionalErrors.push(`Please enter at least one character for: ${field.label}`);
          }
        }
        
        // Check array fields
        if (field.type === 'array' && field.arrayItemFields) {
          const arrayValue = values[section.id]?.[field.id];
          if (Array.isArray(arrayValue)) {
            arrayValue.forEach((item: any, index: number) => {
              field.arrayItemFields?.forEach(itemField => {
                  if (itemField.required) {
                    const itemValue = item[itemField.id];
                    if (!validateNonEmpty(itemValue)) {
                      additionalErrors.push(`Please enter at least one character for: ${field.label}[${index + 1}].${itemField.label}`);
                    }
                  }
              });
            });
          }
        }
      });
    });
    
    if (additionalErrors.length > 0) {
      message.error(`Please fix the following errors: ${additionalErrors.join(', ')}`);
      return;
    }
    
    // Only submit if validation passes (at least one non-whitespace character)
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
      </Form>
    </div>
  );
};
