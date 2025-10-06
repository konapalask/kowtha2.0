import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Space, Typography, Row, Col } from 'antd';
import { EnhancedDynamicFormRenderer } from '@/components/forms/EnhancedDynamicFormRenderer';
import { getMobileSchemaByBank, getAllMobileBanks } from '@/utils/mobileSchemaLoader';
import { WebFormDefinition, WebFormData } from '@/types/webSchema';

const { Title, Text } = Typography;

const DynamicFormTest: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [schemaForm, setSchemaForm] = useState<WebFormDefinition | null>(null);
  const [formData, setFormData] = useState<WebFormData>({});
  const [loading, setLoading] = useState(false);

  const availableBanks = getAllMobileBanks();

  const handleBankChange = (bankName: string) => {
    setSelectedBank(bankName);
    setLoading(true);
    
    const schema = getMobileSchemaByBank(bankName);
    if (schema) {
      setSchemaForm(schema);
      // Initialize with some sample data
      setFormData({
        basicDetails: {
          applicationNo: 'APP123456',
          applicantName: 'John Doe',
          concernName: 'Sample Business',
          constitution: 'Proprietorship',
          phoneNo: '9876543210',
        },
        familyDetails: {
          familyDetails: [
            {
              name: 'Jane Doe',
              relation: 'Spouse',
              ageYears: 30,
              qualification: 'Graduate',
              occupation: 'Teacher',
              incomePerMonth: 25000,
              dependent: 'No',
            }
          ]
        }
      });
    } else {
      setSchemaForm(null);
    }
    
    setLoading(false);
  };

  const handleFormSubmit = (data: WebFormData) => {
    console.log('Form submitted:', data);
    alert('Form submitted successfully! Check console for data.');
  };

  const handleFormDataChange = (sectionId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: data,
    }));
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Dynamic PD Form Test</Title>
      <Text type="secondary">
        Test the dynamic form system with all 6 supported banks
      </Text>

      <Card style={{ marginTop: 16, marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Text strong>Select Bank:</Text>
          </Col>
          <Col span={12}>
            <Select
              style={{ width: '100%' }}
              placeholder="Choose a bank to test"
              value={selectedBank}
              onChange={handleBankChange}
              options={availableBanks.map(bank => ({ label: bank, value: bank }))}
            />
          </Col>
          <Col span={4}>
            <Button 
              onClick={() => {
                setSelectedBank('');
                setSchemaForm(null);
                setFormData({});
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Card>

      {loading && (
        <Card>
          <Text>Loading form schema...</Text>
        </Card>
      )}

      {schemaForm && !loading && (
        <Card title={`Dynamic Form - ${schemaForm.name}`}>
          <EnhancedDynamicFormRenderer
            schema={schemaForm}
            initialData={formData}
            onSubmit={handleFormSubmit}
            onDataChange={handleFormDataChange}
            readOnly={false}
            showValidation={true}
            autoSave={true}
          />
        </Card>
      )}

      {!selectedBank && !loading && (
        <Card>
          <Text type="secondary">
            Please select a bank from the dropdown above to test the dynamic form system.
          </Text>
          <br />
          <Text type="secondary">
            Supported banks: {availableBanks.join(', ')}
          </Text>
        </Card>
      )}
    </div>
  );
};

export default DynamicFormTest;
