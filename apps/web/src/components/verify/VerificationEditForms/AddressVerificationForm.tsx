import React from 'react';
import { Form, Input, Select, Col } from 'antd';

const AddressVerificationForm: React.FC<{form: any}> = ({form}) => {
  const yearsAtCurrentResidence = Form.useWatch('numberOfYearsAtCurrentResidence', form);
  const yearsAtCurrentCity = Form.useWatch('numberOfYearsAtCurrentCity', form);
  const addressMismatch = Form.useWatch('addressMismatch',form)

  return (
    <>
      <Col span={8}>
        <Form.Item
          name="address"
          label="Address Type"
          rules={[{ required: true, message: "Please select address type" }]}
        >
          <Select>
            <Select.Option value="PermanentAddress">Permanent Address</Select.Option>
            <Select.Option value="CurrentAddress">Current Address</Select.Option>
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
      <Col span={24}>
        <Form.Item
          name="addressDetails"
          label="Address Details"
          rules={[{ required: true, message: "Please enter address details" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={6}>
     <Form.Item name="addressMismatch" label="Address Mismatch?" rules={[{ required: true, message: "Please select address mismatch" }]}>
      <Select style={{maxWidth:100}}>
        <Select.Option value="Yes">Yes</Select.Option>
        <Select.Option value="No">No</Select.Option>
      </Select>
     </Form.Item>
      </Col>
      {addressMismatch==="Yes"&&<Col span={18}>
        <Form.Item name="correctedAddress" label="Corrected Address" rules={[{ required: true, message: "Please enter corrected address" }]}>
          <Input />
        </Form.Item>
      </Col>}

      <Col span={8}>
        <Form.Item
          name="numberOfYearsAtCurrentResidence"
          label="No. of Years at Current Residence"
          rules={[{ required: true, message: "Please select years at current residence" }]}
        >
          <Select>
            <Select.Option value="<=2years">≤2 years</Select.Option>
            <Select.Option value=">2years">&gt;2 years</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      {yearsAtCurrentResidence && yearsAtCurrentResidence === '<=2years' && (
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
          <Col span={6}>
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
          <Input style={{color:"#000"}} disabled />
        </Form.Item>
      </Col>
    </>
  );
};

export default AddressVerificationForm; 