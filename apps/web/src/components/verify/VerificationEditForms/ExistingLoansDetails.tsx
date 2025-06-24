import React from "react";
import { Form, Input, Button, Row, Col, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const ExistingLoanRow: React.FC<{
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
      <Col span={5}>
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
      <Col span={5}>
        <Form.Item
          {...field}
          name={[field.name, "purpose"]}
          fieldKey={[String(field.fieldKey), "purpose"]}
          label={idx === 0 ? "Purpose" : ""}
          rules={[{ required: true, message: "Please enter purpose" }]}
        >
          <Input placeholder="Enter purpose" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "loanAmount"]}
          fieldKey={[String(field.fieldKey), "loanAmount"]}
          label={idx === 0 ? "Loan Amount" : ""}
          rules={[{ required: true, message: "Please enter loan amount" }]}
        >
          <Input placeholder="Enter loan amount" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "emi"]}
          fieldKey={[String(field.fieldKey), "emi"]}
          label={idx === 0 ? "EMI" : ""}
          rules={[{ required: true, message: "Please enter EMI" }]}
        >
          <Input placeholder="Enter EMI" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "tenure"]}
          fieldKey={[String(field.fieldKey), "tenure"]}
          label={idx === 0 ? "Tenure (months)" : ""}
          rules={[{ required: true, message: "Please enter tenure in months" }]}
        >
          <Input placeholder="Enter tenure (months)" />
        </Form.Item>
      </Col>
      <Col span={2} style={{ textAlign: "center" }}>
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

const ExistingLoansDetails: React.FC<{ form: any }> = ({ form }) => (
  <Form.List name={["loans"]}>
    {(fields, { add, remove }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field, idx) => (
          <ExistingLoanRow
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
            Add Another
          </Button>
        </Form.Item>
      </div>
    )}
  </Form.List>
);

export default ExistingLoansDetails;
