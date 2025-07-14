import React from "react";
import { Form, Input, Select, Col } from "antd";

const OWNERSHIP_OPTIONS = ["Owned", "Rented", "Leased", "Others"];
const STOCK_SEEN_OPTIONS = ["Yes", "No"];
const EMPLOYEES_SEEN_OPTIONS = ["None", "1-2", "3-5", "6+"];
const ILLEGAL_SETUP_OPTIONS = ["Yes", "No"];
const POLITICALLY_CONNECTED_OPTIONS = ["Yes", "No"];
const PRIVATE_FINANCE_OPTIONS = ["Yes", "No"];
const BUSINESS_ACTIVITY_OPTIONS = [
  "Trading",
  "Services",
  "Manufacturing",
  "Others",
];
const areaOfPremisesOptions = ["<250 Sq.ft", "250 to 400 Sq.ft", ">400 Sq.ft"];
const localityOptions = ["Residential", "Commercial", "Industry", "Corporate"];

export type BusinessMiscellaneousFormData = {
  ownershipOfPremises: string;
  rentalAmount?: string;
  yearsInCurrentPremises: string;
  stockSeen: string;
  employeesSeen: string;
  otherSetupObserved: string;
  illegalSetupObserved: string;
  politicallyConnected: string;
  privateFinanceOrChits: string;
  businessActivity: string;
  businessActivityOther?: string;
};

const BusinessMiscellaneous: React.FC<{ form: any }> = ({ form }) => {
  // Watch values for conditional rendering
  const ownershipOfPremises = Form.useWatch("ownershipOfPremises", form);
  const businessActivity = Form.useWatch("businessActivity", form);

  return (
    <>
      <Col span={8}>
        <Form.Item
          name="stockSeen"
          label="Stock Seen"
          rules={[{ required: true, message: "Stock seen is required" }]}
        >
          <Select placeholder="Select option">
            {STOCK_SEEN_OPTIONS.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="ownershipOfPremises"
          label="Ownership of Business Premises"
          rules={[{ required: true, message: "Ownership is required" }]}
        >
          <Select placeholder="Select ownership">
            {OWNERSHIP_OPTIONS.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {ownershipOfPremises === "Rented" && (
        <Col span={8}>
          <Form.Item
            name="rentalAmount"
            label="Rent paid"
            rules={[{ required: true, message: "Rent paid is required" }]}
          >
            <Input type="number" placeholder="Enter rent paid" />
          </Form.Item>
        </Col>
      )}

      <Col span={8}>
        <Form.Item
          name="areaOfPremises"
          label="Area of Premises"
          rules={[{ required: true, message: "Area of Premises is required" }]}
        >
          <Select placeholder="Select option">
            {areaOfPremisesOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="localityOfBusiness"
          label="Locality of Business"
          rules={[{ required: true, message: "Employees seen is required" }]}
        >
          <Select placeholder="Select option">
            {localityOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="yearsInCurrentPremises"
          label="No. of Years in Current Business Premises"
          rules={[
            { required: true, message: "No. of years is required" },
            { pattern: /^\d+$/, message: "Please enter a valid number" },
          ]}
        >
          <Input type="number" placeholder="Enter number of years" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="employeesUnderApplicant"
          label="Employees working under applicant"
          rules={[
            {
              required: true,
              message: "Employees working under applicant is required",
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Enter number of employees working under applicant"
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="employeesSeen"
          label="Employees Seen"
          rules={[{ required: true, message: "Employees seen is required" }]}
        >
          <Input type="number" placeholder="Enter number of employees seen" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="politicallyConnected"
          label="Is Applicant or Any Family Member Politically Connected?"
          rules={[{ required: true, message: "This field is required" }]}
        >
          <Select placeholder="Select option">
            {POLITICALLY_CONNECTED_OPTIONS.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/*
      <Col span={8}>
        <Form.Item
          name="businessActivity"
          label="Business Activity"
          rules={[{ required: true, message: "Business activity is required" }]}
        >
          <Select placeholder="Select activity">
            {BUSINESS_ACTIVITY_OPTIONS.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      */}

      <Col span={24}>
        <Form.Item
          name="otherSetupObserved"
          label="Any Other Setup Observed in the Premises"
        >
          <Input.TextArea rows={3} placeholder="Enter details (optional)" />
        </Form.Item>
      </Col>

      {/* <Col span={8}>
        <Form.Item
          name="illegalSetupObserved"
          label="Any ILLEGAL Setup Observed"
          rules={[{ required: true, message: "This field is required" }]}
        >
          <Select placeholder="Select option">
            {ILLEGAL_SETUP_OPTIONS.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col> */}

      {/* <Col span={24}>
        <Form.Item
          name="privateFinanceOrChits"
          label="Any Collections/Private Finance/Chits Operated from Premises or by Applicant (as per neighbor check)"
          rules={[{ required: true, message: "This field is required" }]}
        >
          <Select placeholder="Select option">
            {PRIVATE_FINANCE_OPTIONS.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col> */}

      {/* {businessActivity === "Others" && (
        <Col span={8}>
          <Form.Item
            name="businessActivityOther"
            label="Specify Other Business Activity"
            rules={[
              {
                required: true,
                message: "Please specify other business activity",
              },
            ]}
          >
            <Input placeholder="Enter other business activity" />
          </Form.Item>
        </Col>
      )} */}
    </>
  );
};

export default BusinessMiscellaneous;
