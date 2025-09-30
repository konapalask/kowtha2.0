import React from "react";
import { Form, Input, Row, Col } from "antd";

const { TextArea } = Input;

export type AxisBankCommonPointsFormData = {
  turnoverAndMargin: string;
  salesFluctuations: string;
  customerIdentityEstablishedDuringPD: string;
  charteredAcDetails: string;
  loansTakenFromFamilyFriendsBusinessAssociates: string;
};

interface AxisBankCommonPointsFormProps {
  form: any;
}

const AxisBankCommonPointsForm: React.FC<AxisBankCommonPointsFormProps> = ({
  form,
}) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="turnoverAndMargin"
            label="Turnover and Margin"
            rules={[{ required: true, message: "Please describe turnover and margin details" }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Describe turnover and margin details..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="salesFluctuations"
            label="Sales Fluctuations"
            rules={[{ required: true, message: "Please describe sales fluctuations" }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Describe sales fluctuations and patterns..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="customerIdentityEstablishedDuringPD"
            label="Customer Identity Established During PD"
            rules={[{ required: true, message: "Please describe customer identity established during PD" }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Describe customer identity established during personal discussion..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="charteredAcDetails"
            label="Chartered AC Details"
            rules={[{ required: true, message: "Please enter chartered accountant details" }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Enter chartered accountant details..."
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="loansTakenFromFamilyFriendsBusinessAssociates"
            label="Loans Taken from Family, Friends, Business Associates, etc"
            rules={[{ required: true, message: "Please describe loans taken from family, friends, business associates" }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Describe loans taken from family, friends, business associates, etc..."
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default AxisBankCommonPointsForm; 