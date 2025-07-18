import React from "react";
import { Form, Input, Select, Col, Button } from "antd";

const QUALIFICATION_OPTIONS = [
  "Below 10th",
  "10th Pass",
  "12th Pass",
  "Diploma/ITI Certification",
  "Graduate",
  "PG/Professional Certification",
];

interface WorkBasicDetailsFormData {
  applicantName: string;
  bankName: string;
  prospectNumber: string;
  purposeOfLoan: string;
  loanAmount: string;
  tenure: string;
  qualification: string;
  availablePersonName: string;
  isApplicantAvailable: string;
  availablePersonMobile: string;
  availablePersonRelation: string;
  availablePersonRelationOther?: string;
}

const IS_APPLICANT_AVAILABLE_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const AVAILABLE_PERSON_RELATION_OPTIONS = [
  "Spouse",
  "Parent",
  "Sibling",
  "Relative",
  "Neighbor",
  "Others",
];

const WorkBasicDetails: React.FC<{ form: any }> = ({ form }) => {
  const availablePersonRelation = Form.useWatch("availablePersonRelation", form);
  const isApplicantAvailable = Form.useWatch("isApplicantAvailable", form);
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
          // rules={[{ required: true, message: "Loan Amount is required" }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>
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
          name="isApplicantAvailable"
          label="Is Applicant Available?"
          rules={[{ required: true, message: "Please select if applicant is available" }]}
        >
          <Select placeholder="Select">
            {IS_APPLICANT_AVAILABLE_OPTIONS.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Only show these fields if isApplicantAvailable is 'No' */}
      {isApplicantAvailable === "No" && (
        <>
          <Col span={8}>
            <Form.Item
              name="availablePersonName"
              label="Available Person Name"
              rules={[{ required: true, message: "Available Person Name is required" }]}
            >
              <Input placeholder="Enter available person's name" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="availablePersonMobile"
              label="Available Person Mobile"
              rules={[
                { required: true, message: "Mobile number is required" },
                { pattern: /^\d{10}$/, message: "Enter a valid 10-digit mobile number" },
              ]}
            >
              <Input maxLength={10} placeholder="Enter mobile number" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="availablePersonRelation"
              label="Available Person Relation"
              rules={[{ required: true, message: "Relation is required" }]}
            >
              <Select placeholder="Select relation">
                {AVAILABLE_PERSON_RELATION_OPTIONS.map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {availablePersonRelation === "Others" && (
            <Col span={8}>
              <Form.Item
                name="availablePersonRelationOther"
                label="Specify Relation"
                rules={[{ required: true, message: "Please specify the relation" }]}
              >
                <Input placeholder="Specify relation to applicant" />
              </Form.Item>
            </Col>
          )}
        </>
      )}

      {/* Tenure and Qualification should always be shown */}
      <Col span={8}>
        <Form.Item
          name="tenure"
          label="Tenure (in months)"
          rules={[
            { required: true, message: "Tenure is required" },
            { pattern: /^\d+$/, message: "Please enter valid number" },
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
