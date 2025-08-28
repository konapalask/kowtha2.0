import React from "react";
import { Form, Input, Row, Col } from "antd";

export type ToGrossProfitFormData = {
  toOpeningStock: string;
  toPurchase: string;
  toCostOfServices: string;
  toWages: string;
  toHamaliCharges: string;
  toManufacturingExpenses: string;
  toPackingCharges: string;
  bySales: string;
  byServices: string;
  byClosingStock: string;
};

const ToGrossProfitForm: React.FC<{ form: any }> = ({ form }) => {
  return (
    <Row gutter={[16, 0]}>
      {/* Left side - All "To" fields */}
      <Col span={12}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="toOpeningStock"
              label="To Opening Stock"
            >
              <Input placeholder="Enter opening stock value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toPurchase"
              label="To Purchase"
            >
              <Input placeholder="Enter purchase value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toCostOfServices"
              label="To Cost of Services"
            >
              <Input placeholder="Enter cost of services" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toWages"
              label="To Wages"
            >
              <Input placeholder="Enter wages value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toHamaliCharges"
              label="To Hamali Charges"
            >
              <Input placeholder="Enter hamali charges" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toManufacturingExpenses"
              label="To Manufacturing Expenses"
            >
              <Input placeholder="Enter manufacturing expenses" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toPackingCharges"
              label="To Packing Charges"
            >
              <Input placeholder="Enter packing charges" />
            </Form.Item>
          </Col>
        </Row>
      </Col>
      
      {/* Right side - All "By" fields */}
      <Col span={12}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="bySales"
              label="By Sales"
            >
              <Input placeholder="Enter sales value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="byServices"
              label="By Services"
            >
              <Input placeholder="Enter services value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="byClosingStock"
              label="By Closing Stock"
            >
              <Input placeholder="Enter closing stock value" />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ToGrossProfitForm; 