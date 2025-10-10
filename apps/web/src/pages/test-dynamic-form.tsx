import React, { useState, useEffect } from "react";
import {
  Card,
  Select,
  Button,
  Space,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import { EnhancedDynamicFormRenderer } from "@/components/forms/EnhancedDynamicFormRenderer";
import {
  getSchemaFromBackend,
  getSupportedBanks,
  convertBackendSchemaToWebFormat,
} from "@/services/schema.service";
import { WebFormDefinition, WebFormData } from "@/types/webSchema";

const { Title, Text } = Typography;

const DynamicFormTest: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [schemaForm, setSchemaForm] = useState<WebFormDefinition | null>(null);
  const [formData, setFormData] = useState<WebFormData>({});
  const [loading, setLoading] = useState(false);
  const [availableBanks, setAvailableBanks] = useState<string[]>([]);

  // Load available banks from backend on mount
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const banks = await getSupportedBanks();
        setAvailableBanks(banks);
      } catch (error) {
        message.error("Failed to load available banks");
        console.error(error);
      }
    };
    loadBanks();
  }, []);

  const handleBankChange = async (bankName: string) => {
    setSelectedBank(bankName);
    setLoading(true);

    try {
      // Fetch schema from backend
      const backendResponse = await getSchemaFromBackend(bankName);
      const schema = convertBackendSchemaToWebFormat(backendResponse.schema);

      if (schema) {
        setSchemaForm(schema);
        // Initialize with some sample data
        setFormData({
          basicDetails: {
            applicationNo: "APP123456",
            applicantName: "John Doe",
            concernName: "Sample Business",
            constitution: "Proprietorship",
            phoneNo: "9876543210",
          },
          familyDetails: {
            familyDetails: [
              {
                name: "Jane Doe",
                relation: "Spouse",
                ageYears: 30,
                qualification: "Graduate",
                occupation: "Teacher",
                incomePerMonth: 25000,
                dependent: "No",
              },
            ],
          },
        });
        message.success(`Schema loaded successfully for ${bankName}`);
      } else {
        setSchemaForm(null);
        message.error("Failed to convert schema");
      }
    } catch (error: any) {
      setSchemaForm(null);
      message.error(`Error loading schema: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data: WebFormData) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully! Check console for data.");
  };

  const handleFormDataChange = (sectionId: string, data: any) => {
    setFormData((prev) => ({
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
              style={{ width: "100%" }}
              placeholder="Choose a bank to test"
              value={selectedBank}
              onChange={handleBankChange}
              options={availableBanks.map((bank) => ({
                label: bank,
                value: bank,
              }))}
            />
          </Col>
          <Col span={4}>
            <Button
              onClick={() => {
                setSelectedBank("");
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
            Please select a bank from the dropdown above to test the dynamic
            form system.
          </Text>
          <br />
          <Text type="secondary">
            Supported banks: {availableBanks.join(", ")}
          </Text>
        </Card>
      )}
    </div>
  );
};

export default DynamicFormTest;
