import React from "react";
import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export type AxisBankPerformanceFormData = {
  anyChequeBounces: string;
  detailsOfCollateral: string;
};

interface AxisBankPerformanceFormProps {
  form: any;
}

const AxisBankPerformanceForm: React.FC<AxisBankPerformanceFormProps> = ({
  form,
}) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="anyChequeBounces"
            label="Any Cheque Bounces"
            rules={[{ required: true, message: "Please select if there are any cheque bounces" }]}
          >
            <Select placeholder="Select option">
              {YES_NO_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="detailsOfCollateral"
            label="Details of Collateral"
            rules={[{ required: true, message: "Please enter details of collateral" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter details of collateral..."
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default AxisBankPerformanceForm; 