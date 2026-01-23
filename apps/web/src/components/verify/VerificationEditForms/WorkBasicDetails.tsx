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
          label="Name of the Applicant"
          rules={[{ required: true, message: "Please enter applicant name" }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="bankName"
          label="Name of the Bank"
          rules={[{ required: true, message: "Please enter bank name" }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="prospectNumber"
          label="Prospect Number"
          rules={[{ required: true, message: "Please enter prospect number" }]}
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
          name="qualification"
          label="Qualification"
          rules={[{ required: true, message: "Please select qualification" }]}
        >
          <Select>
            <Select.Option value="Below 10th">Below 10th</Select.Option>
            <Select.Option value="10th Pass">10th Pass</Select.Option>
            <Select.Option value="12th Pass">12th Pass</Select.Option>
            <Select.Option value="Diploma/ITI Certification">Diploma/ITI Certification</Select.Option>
            <Select.Option value="Graduate">Graduate</Select.Option>
            <Select.Option value="PG/Professional Certification">PG/Professional Certification</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="isApplicantAvailable"
          label="Is Applicant Available"
          rules={[{ required: true, message: "Please select if applicant is available" }]}
        >
          <Select>
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {form.getFieldValue("isApplicantAvailable") === "No" && (
        <>
          <Col span={8}>
            <Form.Item
              name="availablePersonName"
              label="Name of the person met"
              rules={[{ required: true, message: "Please enter name of the person met" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="availablePersonMobile"
              label="Contact Number"
              rules={[
                { required: true, message: "Please enter contact number" },
                { pattern: /^\d{10}$/, message: "Please enter a valid 10-digit mobile number" },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="availablePersonRelation"
              label="Relation to the applicant"
              rules={[{ required: true, message: "Please select relation" }]}
            >
              <Select>
                <Select.Option value="Spouse">Spouse</Select.Option>
                <Select.Option value="Parent">Parent</Select.Option>
                <Select.Option value="Sibling">Sibling</Select.Option>
                <Select.Option value="Relative">Relative</Select.Option>
                <Select.Option value="Neighbor">Neighbor</Select.Option>
                <Select.Option value="Others">Others</Select.Option>
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
    </>
  );
};

export default WorkBasicDetails;