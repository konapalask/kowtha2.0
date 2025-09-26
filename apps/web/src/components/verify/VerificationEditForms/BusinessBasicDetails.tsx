import React from "react";
import { Form, Input, Select, Col } from "antd";

const yesNoOptions = ["Yes", "No"];

// Add options for the new fields
const constitutionOptions = [
  "private_limited",
  "public_limited", 
  "partnership",
  "sole_proprietorship",
  "llp",
  "other"
];

const structureOfLoanOptions = [
  "term_loan",
  "working_capital",
  "overdraft",
  "cash_credit",
  "other"
];

const personMetOptions = [
  "applicant",
  "co_applicant",
  "family_member",
  "employee",
  "other"
];

export type BusinessBasicDetailsFormData = {
  applicationNumber: string;
  applicantName: string;
  businessName: string;
  loanAmount: string;
  mobileNumber: string;
  address: string;
  bankName: string;
};

const BusinessBasicDetails: React.FC<{ form: any; currentDepartment?: string }> = ({ form, currentDepartment }) => {
  // For PD department, show different fields
  if (currentDepartment === 'PD') {
    return (
      <>
        <Col span={12}>
          <Form.Item
            name="phoneNo"
            label="Phone No"
            rules={[
              { required: true, message: "Phone number is required" },
              { pattern: /^[0-9]{10}$/, message: "Phone number must be 10 digits" },
            ]}
          >
            <Input placeholder="Enter phone number" maxLength={10} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="noOfVisit"
            label="No. of Visit"
            rules={[{ required: true, message: "Number of visits is required" }]}
          >
            <Input placeholder="Enter number of visits" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="personMet"
            label="Person Met"
            rules={[{ required: true, message: "Person met is required" }]}
          >
            <Select placeholder="Select person met">
              {personMetOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="constitution"
            label="Constitution"
            rules={[{ required: true, message: "Constitution is required" }]}
          >
            <Select placeholder="Select constitution">
              {constitutionOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="applicantName"
            label="Applicant Name"
            rules={[{ required: true, message: "Applicant name is required" }]}
          >
            <Input disabled style={{ color: "#000" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="nameOfConcern"
            label="Name of Concern"
            rules={[{ required: true, message: "Name of concern is required" }]}
          >
            <Input placeholder="Enter name of concern" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="aboutApplicant"
            label="About Applicant"
            rules={[{ required: true, message: "About applicant is required" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter details about applicant" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="visitedAddress"
            label="Visited Address"
            rules={[{ required: true, message: "Visited address is required" }]}
          >
            <Input placeholder="Enter visited address" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="structureOfLoan"
            label="Structure of Loan"
            rules={[{ required: true, message: "Structure of loan is required" }]}
          >
            <Select placeholder="Select structure of loan">
              {structureOfLoanOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="appointmentFixed"
            label="Appointment Fixed"
            rules={[{ required: true, message: "Appointment fixed is required" }]}
          >
            <Select placeholder="Select Yes/No">
              {yesNoOptions.map((option) => (
                <Select.Option key={option} value={option.toLowerCase()}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="initiatedAddress"
            label="Initiated Address"
            rules={[{ required: true, message: "Initiated address is required" }]}
          >
            <Input placeholder="Enter initiated address" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="coApplicantDetails"
            label="Co-Applicant Details"
            rules={[{ required: true, message: "Co-applicant details is required" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter co-applicant details" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="residentialDetails"
            label="Residential Details"
            rules={[{ required: true, message: "Residential details is required" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter residential details" />
          </Form.Item>
        </Col>
      </>
    );
  }

  // Original implementation for other departments
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
      <Col span={8}>
        <Form.Item
          label="Aadhar Number"
          name="aadhar"
          rules={[
            { required: true, message: "Aadhar number is required" },
            {
              pattern: /^[0-9]{12}$/,
              message: "Aadhar must be 12 digits",
            },
          ]}
        >
          <Input
            maxLength={12}
            onChange={(e) => {
              const formatted = e.target.value.replace(/[^0-9]/g, "");
              form.setFieldsValue({ aadhar: formatted });
            }}
            placeholder="Enter Aadhar number"
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="isApplicantAvailable"
          label="Is Applicant Available?"
          rules={[
            { required: true, message: "Please specify if applicant is available" },
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
      {Form.useWatch("isApplicantAvailable", form) === "No" && (
        <>
          <Col span={8}>
            <Form.Item
              name="availablePersonName"
              label="Name of the person met"
              rules={[
                { required: true, message: "Please enter the name of person met" },
              ]}
            >
              <Input placeholder="Enter name of person met" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="availablePersonMobile"
              label="Contact Number"
              rules={[
                { required: true, message: "Please enter contact number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Mobile number must be 10 digits",
                },
              ]}
            >
              <Input placeholder="Enter contact number" maxLength={10} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="availablePersonRelation"
              label="Relation to the applicant"
              rules={[
                { required: true, message: "Please select relation to applicant" },
              ]}
            >
              <Select placeholder="Select relation">
                <Select.Option value="Co Applicant">Co Applicant</Select.Option>
                <Select.Option value="Family">Family</Select.Option>
                <Select.Option value="Colleague">Colleague</Select.Option>
                <Select.Option value="Others">Others</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {Form.useWatch("availablePersonRelation", form) === "Others" && (
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
      <Col span={8}>
        <Form.Item
          name="businessName"
          label="Business Name"
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
      {Form.useWatch("isBusinessNameSame", form) === "No" && (
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
          rules={[
            { required: true, message: "Please enter nature of business" },
          ]}
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
      {Form.useWatch("isAddressSame", form) === "No" && (
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
