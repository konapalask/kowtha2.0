import React from "react";
import { Form, Input, Select, Col, Row } from "antd";

const reviewOptions = ["positive", "negative"];

const ClientsDebtorsForm: React.FC<{ form: any }> = ({ form }) => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item name={["clientsDebtors", "numberOfFixedCustomers"]} label="No. of Fixed Customers" rules={[{ required: true, message: "Please enter number of fixed customers" }]}>
            <Input placeholder="Enter number" type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={["clientsDebtors", "creditPeriod"]} label="Credit Period" rules={[{ required: true, message: "Please enter credit period" }]}>
            <Input placeholder="Enter credit period" type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={["clientsDebtors", "cashChequeProportions"]} label="Cash-Cheque Proportions" rules={[{ required: true, message: "Please enter cash-cheque proportions" }]}>
            <Input placeholder="Enter proportions" />
          </Form.Item>
        </Col>
      </Row>

      <h4 style={{ marginTop: 24, marginBottom: 8 }}>Business Metrics</h4>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "averageStockMaintenance"]} label="Average Stock Maintenance" rules={[{ required: true, message: "Please enter average stock maintenance" }]}>
            <Input placeholder="Enter number" type="number" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "turnover"]} label="Turnover" rules={[{ required: true, message: "Please enter turnover" }]}>
            <Input placeholder="Enter amount" type="number" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "netMargins"]} label="Net Margins" rules={[{ required: true, message: "Please enter net margins" }]}>
            <Input placeholder="Enter percentage" type="number" />
          </Form.Item>
        </Col>
      </Row>

      <h4 style={{ marginTop: 8 }}>Top 3 Customers</h4>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer1Name"]} label="Customer 1 Name">
            <Input placeholder="Enter name" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer1Phone"]} label="Phone">
            <Input placeholder="Enter phone" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer1Location"]} label="Location">
            <Input placeholder="Enter location" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer1Review"]} label="Review">
            <Select placeholder="Select review" allowClear>
              {reviewOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer2Name"]} label="Customer 2 Name">
            <Input placeholder="Enter name" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer2Phone"]} label="Phone">
            <Input placeholder="Enter phone" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer2Location"]} label="Location">
            <Input placeholder="Enter location" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer2Review"]} label="Review">
            <Select placeholder="Select review" allowClear>
              {reviewOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer3Name"]} label="Customer 3 Name">
            <Input placeholder="Enter name" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer3Phone"]} label="Phone">
            <Input placeholder="Enter phone" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer3Location"]} label="Location">
            <Input placeholder="Enter location" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={["clientsDebtors", "customer3Review"]} label="Review">
            <Select placeholder="Select review" allowClear>
              {reviewOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ClientsDebtorsForm; 