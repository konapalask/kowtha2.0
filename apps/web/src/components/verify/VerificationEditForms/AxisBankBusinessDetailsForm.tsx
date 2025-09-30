import React from "react";
import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;

const CONSTITUTION_OPTIONS = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "private_limited", label: "Private Limited" },
  { value: "public_limited", label: "Public Limited" },
  { value: "llp", label: "Limited Liability Partnership" },
  { value: "huf", label: "Hindu Undivided Family" },
  { value: "other", label: "Other" },
];

const WHO_STARTED_BUSINESS_OPTIONS = [
  { value: "self", label: "Self" },
  { value: "acquired", label: "Acquired" },
  { value: "second_gen", label: "Second Gen" },
];

const OWNERSHIP_OF_BUSINESS_PLACE_OPTIONS = [
  { value: "self_owned", label: "Self Owned" },
  { value: "rented", label: "Rented" },
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export type AxisBankBusinessDetailsFormData = {
  nameOfFirm?: string;
  constitution: string;
  whoStartedBusiness: string;
  ownershipOfBusinessPlace: string;
  yearsInCurrentOffice: string;
  yearsInCurrentCity: string;
  prevEmployment?: string;
  isResidenceCumOffice: string;
};

interface AxisBankBusinessDetailsFormProps {
  form: any;
}

const AxisBankBusinessDetailsForm: React.FC<AxisBankBusinessDetailsFormProps> = ({
  form,
}) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="nameOfFirm"
            label="Name of the Firm"
          >
            <Input placeholder="Name of the Firm (Read-only)" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="constitution"
            label="Constitution"
            rules={[{ required: true, message: "Please select constitution" }]}
          >
            <Select placeholder="Select constitution">
              {CONSTITUTION_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="whoStartedBusiness"
            label="Who Started the Business"
            rules={[{ required: true, message: "Please select who started the business" }]}
          >
            <Select placeholder="Select who started the business">
              {WHO_STARTED_BUSINESS_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ownershipOfBusinessPlace"
            label="Ownership of Business Place"
            rules={[{ required: true, message: "Please select ownership of business place" }]}
          >
            <Select placeholder="Select ownership of business place">
              {OWNERSHIP_OF_BUSINESS_PLACE_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="isResidenceCumOffice"
            label="Is Residence Cum Office?"
            rules={[{ required: true, message: "Please select if residence cum office" }]}
          >
            <Select placeholder="Select option">
              {YES_NO_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="yearsInCurrentOffice"
            label="Years in Current Office"
            rules={[{ required: true, message: "Please enter years in current office" }]}
          >
            <Input placeholder="Enter years in current office" type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="yearsInCurrentCity"
            label="Years in Current City"
            rules={[{ required: true, message: "Please enter years in current city" }]}
          >
            <Input placeholder="Enter years in current city" type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="prevEmployment"
            label="Previous Employment (if any)"
          >
            <Input placeholder="Enter previous employment details" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default AxisBankBusinessDetailsForm; 