import React from "react";
import { Form, Input, Row, Col } from "antd";

const { TextArea } = Input;

export type AxisBankWorkingCapitalDetailsFormData = {
  bankName: string;
  limit: string;
  utilization: string;
  collateral: string;
  linkedLoansIfAny?: string;
  endOfProposedLoans: string;
};

interface AxisBankWorkingCapitalDetailsFormProps {
  form: any;
}

const AxisBankWorkingCapitalDetailsForm: React.FC<AxisBankWorkingCapitalDetailsFormProps> = ({
  form,
}) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="bankName"
            label="Bank Name"
            rules={[{ required: true, message: "Please enter bank name" }]}
          >
            <Input placeholder="Enter bank name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="limit"
            label="Limit"
            rules={[{ required: true, message: "Please enter limit amount" }]}
          >
            <Input placeholder="Enter limit amount" type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="utilization"
            label="Utilization"
            rules={[{ required: true, message: "Please describe utilization details" }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Describe utilization details..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="collateral"
            label="Collateral"
            rules={[{ required: true, message: "Please describe collateral details" }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Describe collateral details..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="linkedLoansIfAny"
            label="Linked Loans (if any)"
          >
            <TextArea 
              rows={3} 
              placeholder="Describe linked loans if any..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="endOfProposedLoans"
            label="End of Proposed Loans"
            rules={[{ required: true, message: "Please describe end of proposed loans" }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Describe end of proposed loans..."
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default AxisBankWorkingCapitalDetailsForm; 