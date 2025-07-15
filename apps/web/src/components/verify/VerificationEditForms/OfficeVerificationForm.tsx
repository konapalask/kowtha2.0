import React from "react";
import { Form, Input, Select, Col, Typography } from "antd";

const { Option } = Select;
const { Title } = Typography;

const OfficeVerificationForm: React.FC<{ form: any }> = ({ form }) => {
  // const employerType = Form.useWatch("employerType", form);
  // const salaryMode = Form.useWatch("salaryMode", form);
  const isAddressSame = Form.useWatch("isAddressSame", form);
  const natureOfService = Form.useWatch("natureOfService", form);

  return (
    <>
      {/* Basic Information */}
      {/* <Col span={24}>
        <Title level={5}>Basic Information</Title>
      </Col> */}
      <Col span={8}>
        <Form.Item
          name="currentOfficeName"
          label="Name of Current Working Office"
          rules={[{ required: true, message: "Please enter office name" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item
          name="officeAddress"
          label="Office Address"
          rules={[{ required: true, message: "Please enter office address" }]}
        >
          <Input.TextArea rows={2} disabled />
        </Form.Item>
      </Col>

      <Col span={4}>
        <Form.Item
          name="isAddressSame"
          label="Address Mismatch"
          rules={[{ required: true, message: "Please enter office address" }]}
        >
          <Select>
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
          </Select>
        </Form.Item>
      </Col>
      {isAddressSame && (
        <Col span={16}>
          <Form.Item
            name="addressCorrection"
            label="Address Correction"
            rules={[{ required: true, message: "Please enter office address" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
      )}
      {/* <Col span={8}>
        <Form.Item
          name="isAddressSame"
          label="Address Mismatch?"
          rules={[{ required: true, message: "Please specify if address matches" }]}
        >
          <Select placeholder="Select">
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
          </Select>
        </Form.Item>
      </Col> */}
      {/* {form.getFieldValue && form.getFieldValue("isAddressSame") === "No" && (
        <Col span={16}>
          <Form.Item
            name="addressCorrection"
            label="Corrected Address"
            rules={[{ required: true, message: "Please enter corrected address" }]}
          >
            <Input.TextArea rows={2} placeholder="Enter corrected address" />
          </Form.Item>
        </Col>
      )} */}
      <Col span={8}>
        <Form.Item
          name="yearsInCurrentJob"
          label="Years in Current Job"
          rules={[
            { required: true, message: "Please enter years in current job" },
          ]}
        >
          <Input type="number" min={0} />
        </Form.Item>
      </Col>

      {/* Employment Details */}
      {/* <Col span={24}>
        <Title level={5} style={{ marginTop: 16 }}>Employment Details</Title>
      </Col> */}
      <Col span={8}>
        <Form.Item
          name="totalWorkExperience"
          label="Total Work Experience"
          rules={[
            { required: true, message: "Please enter total work experience" },
          ]}
        >
          <Input type="number" min={0} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="companySize"
          label="Company Size"
          rules={[{ required: true, message: "Please enter company size" }]}
        >
          <Input type="number" min={1} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="natureOfService"
          label="Nature of Service/Business"
          rules={[
            { required: true, message: "Please enter nature of service" },
          ]}
        >
          <Select>
            <Select.Option key={1} value="Agricultural">
              Agricultural
            </Select.Option>
            <Select.Option key={2} value="Construction">
              Construction
            </Select.Option>
            <Select.Option key={3} value="Education">
              Education
            </Select.Option>
            <Select.Option key={4} value="FMCG">
              FMCG
            </Select.Option>
            <Select.Option key={5} value="Health Care">
              Health Care
            </Select.Option>
            <Select.Option key={6} value="Manufacturing">
              Manufacturing
            </Select.Option>
            <Select.Option key={7} value="Services">
              Services
            </Select.Option>
            <Select.Option key={8} value="Travel, Tourism & Hotel">
              Travel & Tourism & Hotel
            </Select.Option>
            <Select.Option key={9} value="Others">
              Others
            </Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {/* Show this field only if natureOfService is 'Others' */}
      {natureOfService === "Others" && (
        <Col span={8}>
          <Form.Item
            name="natureOfServiceOther"
            label="Specify Nature of Service/Business"
            rules={[
              {
                required: true,
                message: "Please specify nature of service/business",
              },
            ]}
          >
            <Input placeholder="Enter nature of service/business" />
          </Form.Item>
        </Col>
      )}
      <Col span={8}>
        <Form.Item
          name="officeLocality"
          label="Locality of Office Premises"
          rules={[{ required: true, message: "Please select office locality" }]}
        >
          <Select>
            <Select.Option value="Residential">Residential</Select.Option>
            <Select.Option value="Commercial">Commercial</Select.Option>
            <Select.Option value="Industry">Industry</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="idCardNumber"
          label="ID Card Number"
          rules={[{ required: true, message: "Please enter ID card number" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="designation"
          label="Designation"
          rules={[{ required: true, message: "Please enter designation" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="salaryMode"
          label="Mode of Salary"
          rules={[{ required: true, message: "Please select salary mode" }]}
        >
          <Select>
            <Select.Option value="Cash">Cash</Select.Option>
            <Select.Option value="Online">Online</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="employerType"
          label="Type of Employer"
          rules={[{ required: true, message: "Please select employer type" }]}
        >
          <Select>
            <Select.Option value="Government/PSU">Government/PSU</Select.Option>
            <Select.Option value="Unlisted Pvt. Ltd">
              Unlisted Pvt. Ltd
            </Select.Option>
            <Select.Option value="MNC/Listed Pvt. Ltd">
              MNC/Listed Pvt. Ltd
            </Select.Option>
            <Select.Option value="Proprietorship/Partnership/NGO/Trust">
              Proprietorship/Partnership/NGO/Trust
            </Select.Option>
            <Select.Option value="Others">Others</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {/* Show this field only if employerType is 'Others' */}
      {form.getFieldValue &&
        form.getFieldValue("employerType") === "Others" && (
          <Col span={8}>
            <Form.Item
              name="employerTypeOther"
              label="Specify Type of Employer"
              rules={[
                { required: true, message: "Please specify type of employer" },
              ]}
            >
              <Input placeholder="Enter type of employer" />
            </Form.Item>
          </Col>
        )}

      {/* Salary Details */}
      {/* <Col span={24}>
        <Title level={5} style={{ marginTop: 16 }}>Salary Details</Title>
      </Col> */}

      <Col span={8}>
        <Form.Item
          name="grossSalary"
          label="Gross Salary per Month"
          rules={[{ required: true, message: "Please enter gross salary" }]}
        >
          <Input type="number" min={0} prefix="₹" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="netSalary"
          label="Net Salary per Month"
          rules={[{ required: true, message: "Please enter net salary" }]}
        >
          <Input type="number" min={0} prefix="₹" />
        </Form.Item>
      </Col>

      {/* Previous Employment */}
      {/* <Col span={24}>
        <Title level={5} style={{ marginTop: 16 }}>Previous Employment</Title>
      </Col>
      <Col span={8}>
        <Form.Item
          name="previousCompanyName"
          label="Previous Company Name"
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="workExperience"
          label="Work Experience"
        >
          <Input type="number" min={0} />
        </Form.Item>
      </Col> */}

      {/* Additional Information */}
      {/* <Col span={24}>
        <Title level={5} style={{ marginTop: 16 }}>Additional Information</Title>
      </Col> */}
      {/* <Col span={12}>
        <Form.Item
          name="existingLoans"
          label="Existing Loans"
        >
          <Input.TextArea rows={2} placeholder="Enter details of any existing loans" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="references"
          label="References (Colleagues)"
          rules={[{ required: true, message: "Please enter references" }]}
        >
          <Input.TextArea rows={2} placeholder="Enter colleague references with contact details" />
        </Form.Item>
      </Col> */}
    </>
  );
};

export default OfficeVerificationForm;
