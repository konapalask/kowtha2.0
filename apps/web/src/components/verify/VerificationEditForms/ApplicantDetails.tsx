import React from "react";
import { Form, Input, Select, Col } from "antd";

const maritalStatusOptions = ["Single", "Married", "Divorced", "Others"];
const educationOptions = [
  "Below 10th",
  "10th pass",
  "12th pass",
  "Diploma/ITI certification",
  "Graduate",
  "Post Graduate",
  "Professional Certification",
];

export type ApplicantDetailsFormData = {
  currentResidentialAddress: string;
  assets: string;
  purposeOfLoan: string;
  personMet: string;
  educationalQualification: string;
  incomeDetails: string;
  nameOfCoApplicant: string;
  maritalStatus: string;
  houseSize: string;
  workExperience: string;
  purchase: string;
  relationshipDuration: string;
};

const ApplicantDetails: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Col span={24}>
        <Form.Item
          name="currentResidentialAddress"
          label="Current Residential Address"
          rules={[{ required: true, message: "Current residential address is required" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter current residential address" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="assets"
          label="Assets"
          rules={[{ required: true, message: "Assets information is required" }]}
        >
          <Input placeholder="Enter assets details" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="purposeOfLoan"
          label="Purpose of Loan"
          rules={[{ required: true, message: "Purpose of loan is required" }]}
        >
          <Input placeholder="Enter purpose of loan" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="personMet"
          label="Person Met"
          rules={[{ required: true, message: "Person met is required" }]}
        >
          <Input placeholder="Enter person met" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="educationalQualification"
          label="Educational Qualification"
          rules={[{ required: true, message: "Educational qualification is required" }]}
        >
          <Select placeholder="Select educational qualification">
            {educationOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="incomeDetails"
          label="Income Details"
          rules={[{ required: true, message: "Income details are required" }]}
        >
          <Input placeholder="Enter income details" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="nameOfCoApplicant"
          label="Name of Co-applicant"
          rules={[{ required: true, message: "Name of co-applicant is required" }]}
        >
          <Input placeholder="Enter co-applicant name" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="maritalStatus"
          label="Marital Status"
          rules={[{ required: true, message: "Marital status is required" }]}
        >
          <Select placeholder="Select marital status">
            {maritalStatusOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="houseSize"
          label="House Size (in sq. ft.)"
          rules={[{ required: true, message: "House size is required" }]}
        >
          <Input placeholder="Enter house size" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="workExperience"
          label="Work Experience"
          rules={[{ required: true, message: "Work experience is required" }]}
        >
          <Input placeholder="Enter work experience" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="purchase"
          label="Purchase"
          rules={[{ required: true, message: "Purchase information is required" }]}
        >
          <Input placeholder="Enter purchase details" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="relationshipDuration"
          label="Relationship Duration"
          rules={[{ required: true, message: "Relationship duration is required" }]}
        >
          <Input placeholder="Enter relationship duration" />
        </Form.Item>
      </Col>
    </>
  );
};

export default ApplicantDetails; 