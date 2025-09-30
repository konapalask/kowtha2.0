import React from "react";
import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const NATURE_OF_BUSINESS_OPTIONS = [
  { value: "trading", label: "Trading" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Services" },
  { value: "others", label: "Others" },
];

export type AxisBankBusinessProfileFormData = {
  natureOfBusiness: string;
  productServicesOffered: string;
  businessModelAndBackground: string;
};

interface AxisBankBusinessProfileFormProps {
  form: any;
}

const AxisBankBusinessProfileForm: React.FC<AxisBankBusinessProfileFormProps> = ({
  form,
}) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="natureOfBusiness"
            label="Nature of Business"
            rules={[{ required: true, message: "Please select nature of business" }]}
          >
            <Select placeholder="Select nature of business">
              {NATURE_OF_BUSINESS_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="productServicesOffered"
            label="Product/Services Offered"
            rules={[{ required: true, message: "Please describe products and services offered" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Describe the products and services offered by the business..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="businessModelAndBackground"
            label="Business Model and Background of Business"
            rules={[{ required: true, message: "Please describe business model and background" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Describe the business model, background, and key aspects of the business..."
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default AxisBankBusinessProfileForm; 