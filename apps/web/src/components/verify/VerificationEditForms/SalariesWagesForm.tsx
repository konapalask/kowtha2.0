import React from "react";
import { Form, Input, Select, Col, Row, Typography, Divider } from "antd";

const statusOptions = ["permanent", "contractual"];

const SalariesWagesForm: React.FC<{ form: any; bankName?: string }> = ({ form, bankName }) => {
  const isAxisFinance = bankName?.toLowerCase().includes('axis');
  const isArkaFincap = bankName?.toLowerCase().includes('arka');

  if (isAxisFinance || isArkaFincap) {
    return (
      <div>
        {/* Employee Information Section */}
        <Typography.Title level={5} style={{ marginBottom: 16 }}>
          Employee Information
        </Typography.Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item 
              name={["salariesWages", "employeeInformation", "numberOfEmployees"]} 
              label="No. of Employees" 
              rules={[{ required: true, message: "Please enter number of employees" }]}
            >
              <Input placeholder="Enter number" type="number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              name={["salariesWages", "employeeInformation", "salaryPerMonthPerEmployee"]} 
              label="Salary per month per employee" 
              rules={[{ required: true, message: "Please enter salary amount" }]}
            >
              <Input placeholder="Enter amount" type="number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              name={["salariesWages", "employeeInformation", "statusOfEmployee"]} 
              label="Status of Employee" 
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select an option">
                {statusOptions.map((opt) => (
                  <Select.Option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Labour Information Section */}
        <Typography.Title level={5} style={{ marginBottom: 16 }}>
          Labour Information
        </Typography.Title>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item 
              name={["salariesWages", "labourInformation", "numberOfLabours"]} 
              label="No. of Labours" 
              rules={[{ required: true, message: "Please enter number of labours" }]}
            >
              <Input placeholder="Enter number" type="number" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item 
              name={["salariesWages", "labourInformation", "wagesPerMonthPerDay"]} 
              label="Wages per month/per day" 
              rules={[{ required: true, message: "Please enter wages" }]}
            >
              <Input placeholder="Enter amount" type="number" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item 
              name={["salariesWages", "labourInformation", "statusOfLabour"]} 
              label="Status of Labour" 
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select an option">
                {statusOptions.map((opt) => (
                  <Select.Option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item 
              name={["salariesWages", "labourInformation", "workingHoursStart"]} 
              label="Working Hours Start" 
              rules={[{ required: true, message: "Please enter start time" }]}
            >
              <Input placeholder="HH:MM" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item 
              name={["salariesWages", "labourInformation", "workingHoursEnd"]} 
              label="Working Hours End" 
              rules={[{ required: true, message: "Please enter end time" }]}
            >
              <Input placeholder="HH:MM" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item 
              name={["salariesWages", "labourInformation", "otherMajorExpenditure"]} 
              label="Other Major Expenditure"
            >
              <Input placeholder="Enter details" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name={["salariesWages", "labourInformation", "remarks"]} 
              label="Remarks"
            >
              <Input.TextArea placeholder="Enter remarks" rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  } else {
    // Original layout for other banks
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item name={["salariesWages", "numberOfEmployees"]} label="No. of Employees" rules={[{ required: true, message: "Please enter number of employees" }]}>
              <Input placeholder="Enter number" type="number" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={["salariesWages", "salaryPerMonthPerEmployee"]} label="Salary/Employee/Month" rules={[{ required: true, message: "Please enter salary amount" }]}>
              <Input placeholder="Enter amount" type="number" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={["salariesWages", "statusOfEmployee"]} label="Status of Employee" rules={[{ required: true, message: "Please select status" }]}>
              <Select placeholder="Select status">
                {statusOptions.map((opt) => (
                  <Select.Option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={["salariesWages", "numberOfLabours"]} label="No. of Labours" rules={[{ required: true, message: "Please enter number of labours" }]}>
              <Input placeholder="Enter number" type="number" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item name={["salariesWages", "wagesPerMonthPerDay"]} label="Wages per month/day" rules={[{ required: true, message: "Please enter wages" }]}>
              <Input placeholder="Enter amount" type="number" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={["salariesWages", "statusOfLabour"]} label="Status of Labour" rules={[{ required: true, message: "Please select status" }]}>
              <Select placeholder="Select status">
                {statusOptions.map((opt) => (
                  <Select.Option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={["salariesWages", "workingHoursStart"]} label="Working Hours Start" rules={[{ required: true, message: "Please enter start time" }]}>
              <Input placeholder="HH:MM" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={["salariesWages", "workingHoursEnd"]} label="Working Hours End" rules={[{ required: true, message: "Please enter end time" }]}>
              <Input placeholder="HH:MM" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name={["salariesWages", "otherMajorExpenditure"]} label="Other Major Expenditure">
              <Input placeholder="Enter details" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={["salariesWages", "remarks"]} label="Remarks">
              <Input placeholder="Enter remarks" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
};

export default SalariesWagesForm; 