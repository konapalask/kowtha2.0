import React from "react";
import { Form, Input, Select, Col, FormInstance, InputNumber } from "antd";

const { Option } = Select;

const maritalStatusOptions = ["Single", "Married", "Divorced", "Others"];
const categoryOptions = ["General", "SC", "ST", "OBC", "Others"];
const educationQualificationOptions = [
  "Below 10th",
  "10th pass",
  "12th pass",
  "Diploma/ITI certification",
  "Graduate",
  "PG/Professional Certification",
];

const BasicDetailsForm: React.FC<{ form: FormInstance }> = ({ form }) => {
  const maritalStatus = Form.useWatch("maritalStatus", form);
  const category = Form.useWatch("category", form);
  const isApplicantAvailable = Form.useWatch("isApplicantAvailable", form);
  const availablePersonRelation = Form.useWatch("availablePersonRelation", form);

  return (
    <>
      <Form.Item name={"verificationType"} hidden />
      <Col span={8}>
        <Form.Item
          name="applicationNumber"
          label="Application Number"
          rules={[
            { required: true, message: "Please enter application number" },
          ]}
        >
          <Input disabled />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="applicantName"
          label="Applicant Name"
          rules={[{ required: true, message: "Please enter applicant name" }]}
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
          name="applicantMaritalStatus"
          label="Marital Status"
          rules={[{ required: true, message: "Please select marital status" }]}
        >
          <Select>
            {maritalStatusOptions.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {maritalStatus === "Others" && (
        <Col span={8}>
          <Form.Item
            name="applicantMaritalStatusOther"
            label="Specify Marital Status"
            rules={[
              { required: true, message: "Please specify marital status" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      )}

      <Col span={8}>
        <Form.Item
          name="educationQualification"
          label="Education Qualification"
          rules={[
            {
              required: true,
              message: "Please select education qualification",
            },
          ]}
        >
          <Select>
            {educationQualificationOptions.map((qual) => (
              <Option key={qual} value={qual}>
                {qual}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select>
            {categoryOptions.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {category === "Others" && (
        <Col span={8}>
          <Form.Item
            name="categoryOther"
            label="Specify Category"
            rules={[{ required: true, message: "Please specify category" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      )}

      <Col span={8}>
        <Form.Item
          name="isApplicantAvailable"
          label="Is Applicant Available"
          rules={[
            {
              required: true,
              message: "Please select if applicant is available",
            },
          ]}
        >
          <Select>
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
          </Select>
        </Form.Item>
      </Col>

      {isApplicantAvailable === "No" && (
        <>
          <Col span={8}>
            <Form.Item
              name="availablePersonName"
              label="Name of Person Available"
              rules={[
                {
                  required: true,
                  message: "Please enter name of person available",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="availablePersonMobile"
              label="Mobile Number"
              rules={[
                { required: true, message: "Please enter mobile number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="availablePersonRelation"
              label="Relation to Applicant"
              rules={[{ required: true, message: "Please select relation" }]}
            >
              <Select>
                <Option value="Co Applicant">Co Applicant</Option>
                <Option value="Family">Family</Option>
                <Option value="Colleague">Colleague</Option>
                <Option value="Others">Others</Option>
              </Select>
            </Form.Item>
          </Col>
          {availablePersonRelation === "Others" && (
            <Col span={8}>
              <Form.Item
                name="availablePersonRelationOther"
                label="Specify Relation"
                rules={[
                  { required: true, message: "Please specify the relation" },
                ]}
              >
                <Input placeholder="Specify relation to applicant" />
              </Form.Item>
            </Col>
          )}
        </>
      )}
      <Col span={8}>
        <Form.Item
          name="purposeOfLoan"
          label="Purpose of Loan"
          rules={[{ required: true, message: "Please enter purpose of loan" }]}
        >
          <Input placeholder="Enter purpose of loan" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="loanAmount"
          label="Loan Amount"
          rules={[{ required: true, message: "Please enter loan amount" }]}
        >
          <Input placeholder="Enter loan amount" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="tenure"
          label="Tenure"
          rules={[{ required: true, message: "Please enter tenure" }]}
        >
          <Input placeholder="Enter tenure" />
        </Form.Item>
      </Col>
    </>
  );
};

export default BasicDetailsForm;
