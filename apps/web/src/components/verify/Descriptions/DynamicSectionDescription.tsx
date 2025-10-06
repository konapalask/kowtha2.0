import React from 'react';
import { Descriptions, Card, Typography, Space, Tag } from 'antd';

const { Text } = Typography;

interface DynamicSectionDescriptionProps {
  data: any;
  changedData?: any;
  logs?: boolean;
  changedFields?: string[];
  sectionLabel: string;
  sectionSchema?: any; // Schema with field definitions and order
}

const DynamicSectionDescription: React.FC<DynamicSectionDescriptionProps> = ({
  data,
  changedData,
  logs = false,
  changedFields = [],
  sectionLabel,
  sectionSchema,
}) => {
  const renderValue = (value: any, fieldKey?: string): React.ReactNode => {
    if (value === null || value === undefined || value === '') {
      return <Text type="secondary">-</Text>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <Text type="secondary">No items</Text>;
      }

      return (
        <div>
          {value.map((item, index) => {
            if (typeof item === 'object' && item !== null) {
              // Get array item field definitions from schema if available
              let itemFieldOrder: string[] = Object.keys(item);
              if (sectionSchema?.fields && fieldKey) {
                const arrayFieldSchema = sectionSchema.fields.find((f: any) => f.id === fieldKey);
                if (arrayFieldSchema?.arrayItemFields) {
                  itemFieldOrder = arrayFieldSchema.arrayItemFields.map((f: any) => f.id);
                }
              }
              
              return (
                <Card 
                  key={index} 
                  size="small" 
                  style={{ marginBottom: 8, backgroundColor: '#fafafa' }}
                  title={<Text strong style={{ fontSize: '13px' }}>Item {index + 1}</Text>}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {itemFieldOrder.map((key) => {
                      const val = item[key];
                      if (val === undefined || val === null || val === '') return null;
                      return (
                        <div key={key}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>{formatLabel(key)}: </Text>
                          <Text style={{ fontSize: '13px' }}>{String(val)}</Text>
                        </div>
                      );
                    })}
                  </Space>
                </Card>
              );
            }
            return <div key={index}>{String(item)}</div>;
          })}
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div>
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <Text strong>{formatLabel(key)}: </Text>
              <Text>{String(val || '-')}</Text>
            </div>
          ))}
        </div>
      );
    }

    return String(value);
  };

  const formatLabel = (key: string): string => {
    // Use schema label if available
    if (sectionSchema?.fields) {
      const field = sectionSchema.fields.find((f: any) => f.id === key);
      if (field?.label) return field.label;
    }
    
    // Fallback: Convert camelCase to Title Case with spaces
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const isFieldChanged = (fieldKey: string): boolean => {
    return changedFields.includes(fieldKey);
  };

  const renderDescriptionItem = (key: string, value: any, isChanged: boolean) => {
    const label = formatLabel(key);
    
    // Special handling for array fields - render them outside Descriptions for better formatting
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      return (
        <div key={key} style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <Text strong>{label}</Text>
            {logs && isChanged && (
              <Tag color="orange" style={{ marginLeft: 8 }}>Modified</Tag>
            )}
          </div>
            {renderValue(value, key)}
        </div>
      );
    }
    
    if (logs && isChanged) {
      return (
        <Descriptions.Item
          key={key}
          label={
            <Space>
              <span>{label}</span>
              <Tag color="orange">Modified</Tag>
            </Space>
          }
          span={3}
        >
          {renderValue(value, key)}
        </Descriptions.Item>
      );
    }

    return (
      <Descriptions.Item key={key} label={label} span={3}>
        {renderValue(value, key)}
      </Descriptions.Item>
    );
  };

  const getAllKeys = () => {
    // If schema is available, use field order from schema
    if (sectionSchema?.fields) {
      const schemaFieldIds = sectionSchema.fields.map((f: any) => f.id);
      // Also include any additional keys from data that might not be in schema
      const dataKeys = new Set<string>();
      if (data) Object.keys(data).forEach(k => dataKeys.add(k));
      if (changedData) Object.keys(changedData).forEach(k => dataKeys.add(k));
      
      // Return schema fields first (in order), then any extra fields
      const extraKeys = Array.from(dataKeys).filter(k => !schemaFieldIds.includes(k));
      return [...schemaFieldIds, ...extraKeys];
    }
    
    // Fallback: if no schema, just get all keys (unordered)
    const keys = new Set<string>();
    if (data) Object.keys(data).forEach(k => keys.add(k));
    if (changedData) Object.keys(changedData).forEach(k => keys.add(k));
    return Array.from(keys);
  };

  const allKeys = getAllKeys();

  // Separate array fields from regular fields
  const arrayFields: string[] = [];
  const regularFields: string[] = [];
  
  allKeys.forEach(key => {
    const currentValue = data?.[key];
    const newValue = changedData?.[key];
    const valueToCheck = logs && newValue !== undefined ? newValue : currentValue;
    
    if (Array.isArray(valueToCheck) && valueToCheck.length > 0 && typeof valueToCheck[0] === 'object') {
      arrayFields.push(key);
    } else {
      regularFields.push(key);
    }
  });

  return (
    <Card
      title={
        <Space>
          <span>{sectionLabel}</span>
          {logs && <Tag color="blue">Changes</Tag>}
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      {/* Regular fields in Descriptions */}
      {regularFields.length > 0 && (
        <Descriptions bordered column={1} size="small" style={{ marginBottom: arrayFields.length > 0 ? 16 : 0 }}>
          {regularFields.map(key => {
            const currentValue = data?.[key];
            const newValue = changedData?.[key];
            const isChanged = isFieldChanged(key);
            
            // Use changed data if available, otherwise current data
            const valueToShow = logs && newValue !== undefined ? newValue : currentValue;
            
            return renderDescriptionItem(key, valueToShow, isChanged);
          })}
        </Descriptions>
      )}
      
      {/* Array fields rendered separately */}
      {arrayFields.map(key => {
        const currentValue = data?.[key];
        const newValue = changedData?.[key];
        const isChanged = isFieldChanged(key);
        
        // Use changed data if available, otherwise current data
        const valueToShow = logs && newValue !== undefined ? newValue : currentValue;
        
        return renderDescriptionItem(key, valueToShow, isChanged);
      })}
    </Card>
  );
};

export default DynamicSectionDescription;

