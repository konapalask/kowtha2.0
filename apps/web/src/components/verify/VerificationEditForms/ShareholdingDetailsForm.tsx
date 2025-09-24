import React from "react";
import { Form, Input, Select, Col, Button, Row, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const relationOptions = [
  "self",
  "spouse",
  "son",
  "daughter",
  "father",
  "mother",
  "brother",
  "sister",
  "business_partner",
  "director",
  "other",
];

const yesNoOptions = ["yes", "no"];

const ShareholdingDetailsForm: React.FC<{ form: any }> = ({ form }) => {
  const shareholders = Form.useWatch("shareholders", form) || [];

  const addShareholder = () => {
    const currentShareholders = form.getFieldValue("shareholders") || [];
    form.setFieldValue("shareholders", [
      ...currentShareholders,
      {
        name: "",
        shareholdingPercentage: "",
        relationshipWithApplicant: "",
        designation: "",
        comingIntoLoanStructure: "",
        functionalOfPartnerDirector: "",
      },
    ]);
  };

  const removeShareholder = (index: number) => {
    const currentShareholders = form.getFieldValue("shareholders") || [];
    const newShareholders = currentShareholders.filter((_: any, i: number) => i !== index);
    form.setFieldValue("shareholders", newShareholders);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button type="dashed" onClick={addShareholder} block icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
            Add Shareholder
          </Button>
        </Col>
      </Row>

      {shareholders.map((_: any, index: number) => (
        <div key={index} style={{ marginBottom: 24, padding: 16, border: "1px solid #d9d9d9", borderRadius: 6 }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <h4 style={{ margin: 0 }}>Shareholder {index + 1}</h4>
            </Col>
            <Col>
              <Popconfirm title="Are you sure you want to remove this shareholder?" onConfirm={() => removeShareholder(index)} okText="Yes" cancelText="No">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name={["shareholders", index, "name"]} label="Name of Shareholder" rules={[{ required: true, message: "Please enter shareholder name" }]}>
                <Input placeholder="Enter shareholder name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["shareholders", index, "shareholdingPercentage"]}
                label="Percentage of Shareholding"
                rules={[
                  { required: true, message: "Please enter shareholding percentage" },
                  { pattern: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/, message: "Please enter a valid percentage (0.01-100)" }
                ]}
              >
                <Input placeholder="Enter percentage (0.01 to 100)" type="number" step="0.01" min="0.01" max="100" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["shareholders", index, "relationshipWithApplicant"]} label="Relationship with Applicant" rules={[{ required: true, message: "Please select relationship" }]}>
                <Select placeholder="Select relationship">
                  {relationOptions.map((option) => (
                    <Select.Option key={option} value={option}>
                      {option.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["shareholders", index, "designation"]} label="Designation" rules={[{ required: true, message: "Please enter designation" }]}>
                <Input placeholder="Enter designation" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["shareholders", index, "comingIntoLoanStructure"]} label="Coming into Loan Structure" rules={[{ required: true, message: "Please select option" }]}>
                <Select placeholder="Select option">
                  {yesNoOptions.map((option) => (
                    <Select.Option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["shareholders", index, "functionalOfPartnerDirector"]} label="Functional of Partner/Director" rules={[{ required: true, message: "Please enter functional details" }]}>
                <Input placeholder="Enter functional details" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default ShareholdingDetailsForm; 