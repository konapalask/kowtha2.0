import React from "react";
import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export type AxisBankMiscellaneousDetailsFormData = {
  businessNameBoardSeen: string;
  noOfEmployeesSeen: string;
  businessActivitySeen: string;
  stockSeen: string;
  noOfMachinesSeen: string;
  anyOtherBusinessOrAlternativeIncomeSource?: string;
  anyOtherObservationsOrRemarksDuringVisit?: string;
};

interface AxisBankMiscellaneousDetailsFormProps {
  form: any;
}

const AxisBankMiscellaneousDetailsForm: React.FC<AxisBankMiscellaneousDetailsFormProps> = ({
  form,
}) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="businessNameBoardSeen"
            label="Business Name Board Seen"
            rules={[{ required: true, message: "Please select if business name board was seen" }]}
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
        <Col span={12}>
          <Form.Item
            name="businessActivitySeen"
            label="Business Activity Seen"
            rules={[{ required: true, message: "Please select if business activity was seen" }]}
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
        <Col span={12}>
          <Form.Item
            name="noOfEmployeesSeen"
            label="No of Employees Seen"
            rules={[{ required: true, message: "Please enter number of employees seen" }]}
          >
            <Input placeholder="Enter number of employees seen" type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="stockSeen"
            label="Stock Seen"
            rules={[{ required: true, message: "Please select if stock was seen" }]}
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
            name="noOfMachinesSeen"
            label="No of Machines Seen"
            rules={[{ required: true, message: "Please enter number of machines seen" }]}
          >
            <Input placeholder="Enter number of machines seen" type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="anyOtherBusinessOrAlternativeIncomeSource"
            label="Any Other Business or Alternative Income Source"
          >
            <TextArea 
              rows={3} 
              placeholder="Describe any other business or alternative income sources..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="anyOtherObservationsOrRemarksDuringVisit"
            label="Any Other Observations or Remarks During Visit"
          >
            <TextArea 
              rows={3} 
              placeholder="Enter any other observations or remarks during the visit..."
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default AxisBankMiscellaneousDetailsForm; 