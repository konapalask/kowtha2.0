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
  const isBusinessNameSame = Form.useWatch("isBusinessNameSame", form);

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
          <Input style={{ color: "#000" }} disabled />
        </Form.Item>
      </Col>
      {/* PAN Number */}
      <Col span={8}>
        <Form.Item
          label="PAN Number"
          name="panNumber"
          rules={[
            { required: true, message: "PAN number is required" },
            {
              pattern: /^[A-Z0-9]{10}$/,
              message: "PAN must be 10 alphanumeric uppercase characters",
            },
          ]}
        >
          <Input
            maxLength={10}
            onChange={(e) => {
              const formatted = e.target.value
                .replace(/[^A-Za-z0-9]/g, "")
                .toUpperCase();
              form.setFieldsValue({ panNumber: formatted });
            }}
            placeholder="Enter PAN number"
          />
        </Form.Item>
      </Col>

      {/* Aadhar Number */}
      <Col span={8}>
        <Form.Item
          label="Aadhar Number"
          name="aadhar"
          rules={[
            { required: true, message: "Aadhar is required" },
            {
              pattern: /^\d{12}$/,
              message: "Aadhar must be 12 digits",
            },
          ]}
        >
          <Input
            maxLength={12}
            onChange={(e) => {
              const numeric = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ aadhar: numeric });
            }}
            placeholder="Enter Aadhar number"
          />
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
          // rules={[{ required: true, message: "Please enter business name" }]}
        >
          <Input
            disabled
            style={{ color: "#000" }}
            placeholder="Enter Business Name"
          />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="isBusinessNameSame"
          label="Is the business name same as initiated?"
          rules={[
            {
              required: true,
              message: "Please specify if the name is same as initiated",
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

      {isBusinessNameSame === "No" && (
        <Col span={24}>
          <Form.Item
            name="correctedBusinessName"
            label="Business Name Correction"
            rules={[
              {
                required: true,
                message: "Please provide the corrected name",
              },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Enter corrected name" />
          </Form.Item>
        </Col>
      )}

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
            style={{ color: "#000" }}
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
