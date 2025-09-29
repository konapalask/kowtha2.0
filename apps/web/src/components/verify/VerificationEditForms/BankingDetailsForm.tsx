import React from "react";
import { Form, Input, Button, Row, Col, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const BankAccountRow: React.FC<{
  field: any;
  idx: any;
  remove: any;
  fieldsLength: any;
  form: any;
}> = ({ field, idx, remove, fieldsLength, form }) => {
  return (
    <Row
      gutter={8}
      key={String(field.key)}
      style={{ marginBottom: 0, backgroundColor: "#efefef", padding: 8 }}
    >
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "bankName"]}
          fieldKey={[String(field.fieldKey), "bankName"]}
          label={idx === 0 ? "Bank Name" : ""}
          rules={[{ required: true, message: "Please enter bank name" }]}
        >
          <Input placeholder="Enter bank name" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "account"]}
          fieldKey={[String(field.fieldKey), "account"]}
          label={idx === 0 ? "Account Number" : ""}
          rules={[{ required: true, message: "Please enter account number" }]}
        >
          <Input placeholder="Enter account number" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "type"]}
          fieldKey={[String(field.fieldKey), "type"]}
          label={idx === 0 ? "Account Type" : ""}
          rules={[{ required: true, message: "Please enter account type" }]}
        >
          <Input placeholder="Enter account type" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "averageBalance"]}
          fieldKey={[String(field.fieldKey), "averageBalance"]}
          label={idx === 0 ? "Average Balance" : ""}
          rules={[{ required: true, message: "Please enter average balance" }]}
        >
          <Input placeholder="Enter average balance" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "numberOfYearsMaintained"]}
          fieldKey={[String(field.fieldKey), "numberOfYearsMaintained"]}
          label={idx === 0 ? "Years Maintained" : ""}
          rules={[{ required: true, message: "Please enter number of years" }]}
        >
          <Input placeholder="Enter years" />
        </Form.Item>
      </Col>
      <Col span={3} style={{ textAlign: "center" }}>
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => remove(field.name)}
          disabled={fieldsLength === 1}
        >
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            disabled={fieldsLength === 1}
            style={{ marginTop: idx === 0 ? 29 : 0 }}
          />
        </Popconfirm>
      </Col>
    </Row>
  );
};

export type BankingDetailsFormData = {
  bankAccounts: Array<{
    bankName: string;
    account: string;
    type: string;
    averageBalance: string;
    numberOfYearsMaintained: string;
  }>;
  licMutualFunds: string;
  assets: string;
};

const BankingDetailsForm: React.FC<{ form: any }> = ({ form }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {/* Bank Accounts Section */}
    <div style={{ marginBottom: 24 }}>
      <h4>Bank Accounts</h4>
      <Form.List name={["bankAccounts"]}>
        {(fields, { add, remove }) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {fields.map((field, idx) => (
              <BankAccountRow
                key={field.key}
                field={field}
                idx={idx}
                remove={remove}
                fieldsLength={fields.length}
                form={form}
              />
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                style={{ width: "100%", marginTop: 8 }}
              >
                Add Another Bank Account
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </div>

    {/* LIC/Mutual Funds Section */}
    <div style={{ marginBottom: 24 }}>
      <Col span={24}>
        <Form.Item
          name="licMutualFunds"
          label="LIC/Mutual Funds"
          rules={[{ required: true, message: "LIC/Mutual Funds information is required" }]}
        >
          <Input.TextArea 
            rows={4}
            placeholder="Describe LIC policies, mutual fund investments, and other financial instruments..."
          />
        </Form.Item>
      </Col>
    </div>

    {/* Assets Section */}
    <div style={{ marginBottom: 24 }}>
      <Col span={24}>
        <Form.Item
          name="assets"
          label="Assets"
          rules={[{ required: true, message: "Assets information is required" }]}
        >
          <Input.TextArea 
            rows={4}
            placeholder="Describe all assets including property, vehicles, equipment, and other valuable items..."
          />
        </Form.Item>
      </Col>
    </div>
  </div>
);

export default BankingDetailsForm; 