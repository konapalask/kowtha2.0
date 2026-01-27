import React from "react";
import { Form, Input, Select, Col } from "antd";

const WorkEmploymentDetails: React.FC<{ form: any }> = ({ form }) => {
  const isOfficeNameSame = Form.useWatch("isOfficeNameSame", form);
  const isAddressSame = Form.useWatch("isAddressSame", form);
  const employerType = Form.useWatch("employerType", form);
  const natureOfService = Form.useWatch("natureOfService", form);

  return (
    <>
      <Col span={8}>
        <Form.Item
          name="currentOfficeName"
          label="Current Office Name"
          rules={[{ required: true, message: "Please enter current office name" }]}
        >
          <Input placeholder="Enter current office name" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="isOfficeNameSame"
          label="Is Office Name Same as Initiated?"
          rules={[{ required: true, message: "Please select if office name is same as initiated" }]}
        >
          <Select>
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {form.getFieldValue("isOfficeNameSame") === "No" && (
        <Col span={8}>
          <Form.Item
            name="correctedOfficeName"
            label="Corrected Office Name"
            rules={[{ required: true, message: "Please enter corrected office name" }]}
          >
            <Input placeholder="Enter corrected office name" />
          </Form.Item>
        </Col>
      )}
      <Col span={8}>
        <Form.Item
          name="officeAddress"
          label="Office Address"
          rules={[{ required: true, message: "Please enter office address" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter office address" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="isAddressSame"
          label="Is Address Same?"
          rules={[{ required: true, message: "Please select if address is same" }]}
        >
          <Select>
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {form.getFieldValue("isAddressSame") === "No" && (
        <Col span={8}>
          <Form.Item
            name="addressCorrection"
            label="Corrected Address"
            rules={[{ required: true, message: "Please enter corrected address" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter corrected address" />
          </Form.Item>
        </Col>
      )}
      <Col span={8}>
        <Form.Item
          name="yearsInCurrentJob"
          label="Years in Current Job"
          rules={[{ required: true, message: "Please enter years in current job" }]}
        >
          <Input
            type="number"
            placeholder="Enter years in current job"
            onChange={(e) => {
              const numeric = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ yearsInCurrentJob: numeric });
            }}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="totalWorkExperience"
          label="Total Work Experience"
          rules={[{ required: true, message: "Please enter total work experience" }]}
        >
          <Input
            type="number"
            placeholder="Enter total work experience"
            onChange={(e) => {
              const numeric = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ totalWorkExperience: numeric });
            }}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="companySize"
          label="Company Size"
          rules={[{ required: true, message: "Please enter company size" }]}
        >
          <Input
            type="number"
            placeholder="Enter company size"
            onChange={(e) => {
              const numeric = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ companySize: numeric });
            }}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="natureOfService"
          label="Nature of Service/Business"
          rules={[{ required: true, message: "Please select nature of service/business" }]}
        >
          <Select>
            <Select.Option value="Agricultural">Agricultural</Select.Option>
            <Select.Option value="Construction">Construction</Select.Option>
            <Select.Option value="Education">Education</Select.Option>
            <Select.Option value="FMCG">FMCG</Select.Option>
            <Select.Option value="Health Care">Health Care</Select.Option>
            <Select.Option value="Manufacturing">Manufacturing</Select.Option>
            <Select.Option value="Services">Services</Select.Option>
            <Select.Option value="Travel & Tourism & Hotel">Travel & Tourism & Hotel</Select.Option>
            <Select.Option value="E-Commerce">E-Commerce</Select.Option>
            <Select.Option value="Others">Others</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {natureOfService === "Others" && (
        <Col span={8}>
          <Form.Item
            name="natureOfServiceOther"
            label="Specify Nature of Service"
            rules={[{ required: true, message: "Please specify nature of service" }]}
          >
            <Input placeholder="Specify nature of service" />
          </Form.Item>
        </Col>
      )}
      <Col span={8}>
        <Form.Item
          name="officeLocality"
          label="Office Locality"
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
          <Input placeholder="Enter ID card number" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="designation"
          label="Designation"
          rules={[{ required: true, message: "Please enter designation" }]}
        >
          <Input placeholder="Enter designation" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="salaryMode"
          label="Mode of Salary"
          rules={[{ required: true, message: "Please select mode of salary" }]}
        >
          <Select>
            <Select.Option value="Cash">Cash</Select.Option>
            <Select.Option value="Online">Online</Select.Option>
            <Select.Option value="Cheque">Cheque</Select.Option>
            <Select.Option value="Mixed">Mixed</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="employerType"
          label="Type of Employer"
          rules={[{ required: true, message: "Please select type of employer" }]}
        >
          <Select>
            <Select.Option value="Government/PSU">Government/PSU</Select.Option>
            <Select.Option value="Unlisted Pvt. Ltd">Unlisted Pvt. Ltd</Select.Option>
            <Select.Option value="MNC/Listed Pvt. Ltd">MNC/Listed Pvt. Ltd</Select.Option>
            <Select.Option value="Proprietorship/Partnership/NGO/Trust">Proprietorship/Partnership/NGO/Trust</Select.Option>
            <Select.Option value="Others">Others</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {employerType === "Others" && (
        <Col span={8}>
          <Form.Item
            name="employerTypeOther"
            label="Specify Type of Employer"
            rules={[{ required: true, message: "Please specify type of employer" }]}
          >
            <Input placeholder="Specify type of employer" />
          </Form.Item>
        </Col>
      )}
      <Col span={8}>
        <Form.Item
          name="grossSalary"
          label="Gross Salary per Month"
          rules={[{ required: true, message: "Please enter gross salary per month" }]}
        >
          <Input
            type="number"
            placeholder="Enter gross salary per month"
            onChange={(e) => {
              const numeric = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ grossSalary: numeric });
            }}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="netSalary"
          label="Net Salary per Month"
          rules={[{ required: true, message: "Please enter net salary per month" }]}
        >
          <Input
            type="number"
            placeholder="Enter net salary per month"
            onChange={(e) => {
              const numeric = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ netSalary: numeric });
            }}
          />
        </Form.Item>
      </Col>
    </>
  );
};

export default WorkEmploymentDetails;
