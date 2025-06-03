import React from 'react';
import { Form, Input, Select, Col } from 'antd';

const FinalObservationsForm: React.FC = () => {
  const [form] = Form.useForm();
  const overallStatus = Form.useWatch('overallStatus', form);

  return (
    <>
      <Col span={8}>
        <Form.Item
          name="cooperativeness"
          label="Cooperativeness of Applicant"
          rules={[{ required: true, message: "Please select cooperativeness" }]}
        >
          <Select>
            <Select.Option value="Polite">Polite</Select.Option>
            <Select.Option value="Neutral">Neutral</Select.Option>
            <Select.Option value="Rude">Rude</Select.Option>
            <Select.Option value="Not Met">Not Met</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="overallStatus"
          label="Overall Status"
          rules={[{ required: true, message: "Please select overall status" }]}
        >
          <Select>
            <Select.Option value="Positive">Positive</Select.Option>
            <Select.Option value="Negative">Negative</Select.Option>
            <Select.Option value="Referred">Referred</Select.Option>
            <Select.Option value="Fraud">Fraud</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item
          name="remarks"
          label="Remarks"
          rules={[
            { 
              required: true, 
              message: "Please enter remarks",
              validator: (_, value) => {
                if (!value || value.trim().length < 20) {
                  return Promise.reject('Please provide detailed remarks (minimum 20 characters)');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder={`Please provide detailed observations and ${
              overallStatus === 'Negative' || overallStatus === 'Fraud' 
                ? 'reasons for rejection' 
                : overallStatus === 'Referred'
                  ? 'reasons for referral'
                  : 'final remarks'
            }`}
          />
        </Form.Item>
      </Col>
    </>
  );
};

export default FinalObservationsForm; 