import React from 'react';
import { Form, Input, Select, Col, Button } from 'antd';

const QUALIFICATION_OPTIONS = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'Diploma/ITI Certification',
  'Graduate',
  'PG/Professional Certification',
];

interface WorkBasicDetailsFormData {
  applicantName: string;
  bankName: string;
  prospectNumber: string;
  purposeOfLoan: string;
  loanAmount: string;
  tenure: string;
  qualification: string;
}

const WorkBasicDetails: React.FC<{form: any}> = ({form}) => {
  return (
    <>
      <Col span={8}>
        <Form.Item
          name="applicantName"
          label="Applicant Name"
          rules={[{ required: true, message: "Applicant Name is required" }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="bankName"
          label="Bank Name"
          rules={[{ required: true, message: "Bank Name is required" }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="prospectNumber"
          label="Prospect Number"
          rules={[{ required: true, message: "Prospect Number is required" }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="purposeOfLoan"
          label="Purpose of Loan"
          rules={[{ required: true, message: "Purpose of Loan is required" }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="loanAmount"
          label="Loan Amount"
          rules={[{ required: true, message: "Loan Amount is required" }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="tenure"
          label="Tenure (in months)"
          rules={[
            { required: true, message: "Tenure is required" },
            { pattern: /^\d+$/, message: "Please enter valid number" }
          ]}
        >
          <Input type="number" placeholder="Enter tenure in months" />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="qualification"
          label="Qualification"
          rules={[{ required: true, message: "Qualification is required" }]}
        >
          <Select placeholder="Select Qualification">
            {QUALIFICATION_OPTIONS.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </>
  );
};

export default WorkBasicDetails;
