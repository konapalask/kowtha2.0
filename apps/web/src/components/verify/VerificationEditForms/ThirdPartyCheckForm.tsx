import React from 'react';
import { Form, Input, Select, Col } from 'antd';

const { Option } = Select;

const RELATIONSHIP_OPTIONS = ['Neighbor', 'Friend', 'Local Shop Owner', 'Other'];
// const FEEDBACK_STATUS_OPTIONS = ['Positive', 'Negative', 'Could Not Confirm'];

const ThirdPartyCheckForm: React.FC<{form:any}> = ({form}) => {
  const relationship = Form.useWatch('relationship', form);

  return (
    <>
      <Col span={8}>
        <Form.Item
          name="tpcName"
          label="Name of TPC/Neighbor"
          rules={[{ required: true, message: "Please enter name of TPC/Neighbor" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="mobileNumber"
          label="Mobile Number"
          rules={[
            { required: true, message: "Please enter mobile number" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit mobile number"
            }
          ]}
        >
          <Input maxLength={10} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="relationship"
          label="Relationship to Applicant"
          rules={[{ required: true, message: "Please select relationship" }]}
        >
          <Select>
            {RELATIONSHIP_OPTIONS.map(rel => (
              <Option key={rel} value={rel}>{rel}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {relationship === 'Other' && (
        <Col span={8}>
          <Form.Item
            name="relationshipOther"
            label="Specify Relationship"
            rules={[{ required: true, message: "Please specify relationship" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      )}
      {/* <Col span={8}>
        <Form.Item
          name="feedbackStatus"
          label="Feedback Status"
          rules={[{ required: true, message: "Please select feedback status" }]}
        >
          <Select>
            {FEEDBACK_STATUS_OPTIONS.map(status => (
              <Option key={status} value={status}>{status}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col> */}
      <Col span={16}>
        <Form.Item
          name="comments"
          label="Comments/Remarks"
          rules={[{ required: true, message: "Please enter comments/remarks" }]}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Enter detailed feedback from the third party" 
          />
        </Form.Item>
      </Col>
    </>
  );
};

export default ThirdPartyCheckForm; 