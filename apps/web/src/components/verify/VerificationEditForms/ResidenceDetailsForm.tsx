import React from 'react';
import { Form, Input, Select, Col, InputNumber } from 'antd';

const { Option } = Select;

const RESIDENCE_STATUS_OPTIONS = ['Owned', 'Rented', 'Leased'];
const RESIDENCE_TYPE_OPTIONS = ['House', 'Apartment', 'Villa', 'Others'];
const LOCATION_CATEGORY_OPTIONS = ['Urban', 'Semi-Urban', 'Rural'];
const STANDARD_OF_LIVING_OPTIONS = ['Excellent', 'Good', 'Average', 'Poor'];
const LOCALITY_TYPE_OPTIONS = ['Residential', 'Commercial', 'Mixed'];
const ACCESSIBILITY_OPTIONS = ['Easy', 'Moderate', 'Difficult'];

const ResidenceDetailsForm: React.FC<{form: any}> = ({form}) => {
  const residenceStatus = Form.useWatch('residenceStatus', form);
  const residenceType = Form.useWatch('residenceType', form);

  return (
    <>
      <Col span={8}>
        <Form.Item
          name="residenceStatus"
          label="Residence Status"
          rules={[{ required: true, message: "Please select residence status" }]}
        >
          <Select>
            {RESIDENCE_STATUS_OPTIONS.map(status => (
              <Option key={status} value={status}>{status}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {(residenceStatus === 'Rented' || residenceStatus === 'Leased') && (
        <Col span={16}>
          <Form.Item
            name="rentDetails"
            label="Rent Details"
            rules={[{ required: true, message: "Please enter rent details" }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter monthly rent amount, agreement details, etc." 
            />
          </Form.Item>
        </Col>
      )}

      <Col span={8}>
        <Form.Item
          name="residenceType"
          label="Type of Residence"
          rules={[{ required: true, message: "Please select residence type" }]}
        >
          <Select>
            {RESIDENCE_TYPE_OPTIONS.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {residenceType === 'Others' && (
        <Col span={8}>
          <Form.Item
            name="residenceTypeOther"
            label="Specify Residence Type"
            rules={[{ required: true, message: "Please specify residence type" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      )}

      <Col span={8}>
        <Form.Item
          name="standardOfLiving"
          label="Standard of Living"
          rules={[{ required: true, message: "Please select standard of living" }]}
        >
          <Select>
            {STANDARD_OF_LIVING_OPTIONS.map(option => (
              <Option key={option} value={option}>{option}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="localityType"
          label="Locality Type"
          rules={[{ required: true, message: "Please select locality type" }]}
        >
          <Select>
            {LOCALITY_TYPE_OPTIONS.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="accessibility"
          label="Accessibility"
          rules={[{ required: true, message: "Please select accessibility" }]}
        >
          <Select>
            {ACCESSIBILITY_OPTIONS.map(option => (
              <Option key={option} value={option}>{option}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={6}>
      <Form.Item 
      name="houseArea"
      label="Area of House (Approx)"
      rules={[{ required: true, message: "Please enter Area" }]}>
        <InputNumber style={{minWidth:100}} suffix="sq.ft" />
      </Form.Item>
      </Col>

      <Col span={6}>
        <Form.Item
          name="yearsAtCurrentAddress"
          label="Years at Current Address"
          rules={[{ required: true, message: "Please enter years at current address" }]}
        >
          <Input type="number" min={0} style={{maxWidth: 70}} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          name="nameBoardVisible"
          label="Nameboard Visible"
          rules={[{ required: true, message: "Please select if nameboard is visible" }]}
        >
          <Select>
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          name="politicalSymbolVisible"
          label="Political Symbol Visible"
          rules={[{ required: true, message: "Please select if political symbol is visible" }]}
        >
          <Select>
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
          </Select>
        </Form.Item>
      </Col>

    </>
  );
};

export default ResidenceDetailsForm; 