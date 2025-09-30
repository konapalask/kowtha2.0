import React from "react";
import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;

const PERSON_MET_OPTIONS = [
  { value: "applicant", label: "Applicant" },
  { value: "co_applicant", label: "Co-applicant" },
  { value: "guarantor", label: "Guarantor" },
  { value: "others", label: "Others" },
];

export type AxisBankBasicDetailsFormData = {
  applicationId?: string;
  product?: string;
  loanAmount?: string;
  customerName?: string;
  address?: string;
  applicantName: string;
  nameOfConcern: string;
  phoneNo: string;
  initiatedAddress: string;
  contactNumber: string;
  personMet: string;
  relationshipWithBorrower?: string;
};

interface AxisBankBasicDetailsFormProps {
  form: any;
}

const AxisBankBasicDetailsForm: React.FC<AxisBankBasicDetailsFormProps> = ({
  form,
}) => {
  const personMet = Form.useWatch("personMet", form);

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="applicationId"
            label="Application ID"
            rules={[{ required: true, message: "Application ID is required" }]}
          >
            <Input placeholder="Application ID (Read-only)" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="product"
            label="Product"
            rules={[{ required: true, message: "Product is required" }]}
          >
            <Input placeholder="Product (Read-only)" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="loanAmount"
            label="Loan Amount"
            rules={[{ required: true, message: "Loan amount is required" }]}
          >
            <Input placeholder="Loan Amount (Read-only)" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true, message: "Customer name is required" }]}
          >
            <Input placeholder="Customer Name (Read-only)" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input.TextArea 
              rows={2} 
              placeholder="Address (Read-only)" 
              disabled 
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="applicantName"
            label="Applicant Name"
            rules={[{ required: true, message: "Please enter applicant name" }]}
          >
            <Input placeholder="Applicant Name (Read-only)" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="nameOfConcern"
            label="Name of Concern"
            rules={[{ required: true, message: "Please enter name of concern" }]}
          >
            <Input placeholder="Name of Concern (Read-only)" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="phoneNo"
            label="Phone No"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Phone No (Read-only)" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[
              { required: true, message: "Please enter contact number" },
              { len: 10, message: "Contact number must be 10 digits" },
            ]}
          >
            <Input placeholder="Enter contact number" maxLength={10} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="initiatedAddress"
            label="Initiated Address"
            rules={[{ required: true, message: "Please enter initiated address" }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Initiated Address (Read-only)" 
              disabled 
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="personMet"
            label="Person Met"
            rules={[{ required: true, message: "Please select person met" }]}
          >
            <Select placeholder="Select person met">
              {PERSON_MET_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {personMet && personMet !== "applicant" && (
          <Col span={12}>
            <Form.Item
              name="relationshipWithBorrower"
              label="Relationship with Borrower"
              rules={[
                { required: true, message: "Please enter relationship with borrower" },
              ]}
            >
              <Input placeholder="Enter relationship with borrower" />
            </Form.Item>
          </Col>
        )}
      </Row>
    </>
  );
};

export default AxisBankBasicDetailsForm; 