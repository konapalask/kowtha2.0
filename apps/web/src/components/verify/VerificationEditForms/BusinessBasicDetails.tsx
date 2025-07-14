import React from "react";
import { Form, Input, Select, Col } from "antd";

const personMetOptions = [
  "Applicant",
  "Co-Applicant",
  "Family",
  "Guaranteer",
  "Others",
];

const yesNoOptions = ["Yes", "No"];

export type BusinessBasicDetailsFormData = {
  applicantName: string;
  personMet: string;
  personMetName?: string;
  personMetRelation?: string;
  businessAddress: string;
  isAddressSame: string;
  addressCorrection?: string;
};

const BusinessBasicDetails: React.FC<{ form: any }> = ({ form }) => {
  // Watch values for conditional rendering
  const personMet = Form.useWatch("personMet", form);
  const isAddressSame = Form.useWatch("isAddressSame", form);

  return (
    <>
      <Col span={8}>
        <Form.Item
          name="applicantName"
          label="Name of the Applicant"
          rules={[
            { required: true, message: "Name of the applicant is required" },
          ]}
        >
          <Input disabled />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="personMet"
          label="Person Met"
          rules={[{ required: true, message: "Please select who was met" }]}
        >
          <Select placeholder="Select Person Met">
            {personMetOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {personMet && personMet !== "Applicant" && (
        <Col span={8}>
          <Form.Item
            name="personMetName"
            label="Name of Person Met"
            rules={[
              {
                required: true,
                message: "Please enter the name of the person met",
              },
            ]}
          >
            <Input placeholder="Enter name of person met" />
          </Form.Item>
        </Col>
      )}

      {personMet === "Others" && (
        <Col span={8}>
          <Form.Item
            name="personMetRelation"
            label="Specify Relationship to Applicant"
            rules={[
              {
                required: true,
                message: "Please specify the relationship to the applicant",
              },
            ]}
          >
            <Input placeholder="Specify relationship" />
          </Form.Item>
        </Col>
      )}

      <Col span={8}>
        <Form.Item
          name="businessName"
          label="Business Name"
          rules={[{ required: true, message: "Please enter business name" }]}
        >
          <Input placeholder="Enter Business Name" />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="businessProfile"
          label="Nature of Business"
          rules={[{ required: true, message: "Please enter business profile" }]}
        >
          <Input placeholder="Enter Nature of Business" />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          name="businessAddress"
          label="Business Address"
          rules={[{ required: true, message: "Business address is required" }]}
        >
          <Input.TextArea
            rows={3}
            disabled
            placeholder="Enter business address"
          />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="isAddressSame"
          label="Is the address same as initiated?"
          rules={[
            {
              required: true,
              message: "Please specify if the address is same as initiated",
            },
          ]}
        >
          <Select placeholder="Select Yes/No">
            {yesNoOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {isAddressSame === "No" && (
        <Col span={24}>
          <Form.Item
            name="addressCorrection"
            label="Address Correction"
            rules={[
              {
                required: true,
                message: "Please provide the corrected address",
              },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Enter corrected address" />
          </Form.Item>
        </Col>
      )}
    </>
  );
};

export default BusinessBasicDetails;
