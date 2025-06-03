import React from 'react';
import { Form, Input, Select, Col } from 'antd';

const AddressVerificationForm: React.FC = () => {
  const [form] = Form.useForm();
  const yearsAtCurrentResidence = Form.useWatch('numberOfYearsAtCurrentResidence', form);
  const yearsAtCurrentCity = Form.useWatch('numberOfYearsAtCurrentCity', form);

  return (
    <>
      <Col span={8}>
        <Form.Item
          name="address"
          label="Address Type"
          rules={[{ required: true, message: "Please select address type" }]}
        >
          <Select>
            <Select.Option value="Residence">Residence</Select.Option>
            <Select.Option value="Office">Office</Select.Option>
            <Select.Option value="Business">Business</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="addressCategory"
          label="Address Category"
          rules={[{ required: true, message: "Please select address category" }]}
        >
          <Select>
            <Select.Option value="Urban">Urban</Select.Option>
            <Select.Option value="Rural">Rural</Select.Option>
            <Select.Option value="Semi-Urban">Semi-Urban</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item
          name="addressDetails"
          label="Address Details"
          rules={[{ required: true, message: "Please enter address details" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="numberOfYearsAtCurrentResidence"
          label="No. of Years at Current Residence"
          rules={[{ required: true, message: "Please select years at current residence" }]}
        >
          <Select>
            <Select.Option value="<=1 year">≤1 year</Select.Option>
            <Select.Option value="1-3 years">1-3 years</Select.Option>
            <Select.Option value="3-5 years">3-5 years</Select.Option>
            <Select.Option value=">5 years">&gt;5 years</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {yearsAtCurrentResidence && yearsAtCurrentResidence !== '>5 years' && (
        <>
          <Col span={12}>
            <Form.Item
              name="previousAddress"
              label="Previous Address"
              rules={[{ required: true, message: "Please enter previous address" }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="previousAddressYears"
              label="No. of Years at Previous Address"
              rules={[{ required: true, message: "Please enter years at previous address" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Col>
        </>
      )}
      <Col span={8}>
        <Form.Item
          name="numberOfYearsAtCurrentCity"
          label="No. of Years at Current City"
          rules={[{ required: true, message: "Please select years at current city" }]}
        >
          <Select>
            <Select.Option value="<=3 years">≤3 years</Select.Option>
            <Select.Option value=">3 years">&gt;3 years</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {yearsAtCurrentCity === '<=3 years' && (
        <>
          <Col span={8}>
            <Form.Item
              name="previousCity"
              label="Previous City"
              rules={[{ required: true, message: "Please enter previous city" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="numberOfYearsAtPreviousCity"
              label="No. of Years at Previous City"
              rules={[{ required: true, message: "Please enter years at previous city" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="reasonForChange"
              label="Reason for Change"
              rules={[{ required: true, message: "Please enter reason for change" }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </>
      )}
      <Col span={8}>
        <Form.Item
          name="geoTag"
          label="Geo Tag"
          rules={[{ required: true, message: "Please enter geo tag" }]}
        >
          <Input />
        </Form.Item>
      </Col>
    </>
  );
};

export default AddressVerificationForm; 