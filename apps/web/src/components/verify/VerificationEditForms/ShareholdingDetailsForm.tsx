import React from "react";
import { Form, Input, Select, Button, Row, Col, Popconfirm } from "antd";
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

const ShareholdingRow: React.FC<{
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
          name={[field.name, "name"]}
          fieldKey={[String(field.fieldKey), "name"]}
          label={idx === 0 ? "Name" : ""}
          rules={[{ required: true, message: "Please enter shareholder name" }]}
        >
          <Input placeholder="Enter shareholder name" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "shareholdingPercentage"]}
          fieldKey={[String(field.fieldKey), "shareholdingPercentage"]}
          label={idx === 0 ? "Shareholding %" : ""}
          rules={[
            { required: true, message: "Please enter shareholding percentage" },
            { pattern: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/, message: "Please enter a valid percentage (0.01-100)" }
          ]}
        >
          <Input placeholder="Enter %" type="number" step="0.01" min="0.01" max="100" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "relationshipWithApplicant"]}
          fieldKey={[String(field.fieldKey), "relationshipWithApplicant"]}
          label={idx === 0 ? "Relation with Applicant" : ""}
          rules={[{ required: true, message: "Please select relationship" }]}
        >
          <Select placeholder="Select relationship">
            {relationOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "designation"]}
          fieldKey={[String(field.fieldKey), "designation"]}
          label={idx === 0 ? "Designation" : ""}
          rules={[{ required: true, message: "Please enter designation" }]}
        >
          <Input placeholder="Enter designation" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "comingIntoLoanStructure"]}
          fieldKey={[String(field.fieldKey), "comingIntoLoanStructure"]}
          label={idx === 0 ? "Coming into Loan Structure" : ""}
          rules={[{ required: true, message: "Please select option" }]}
        >
          <Select placeholder="Select option">
            {yesNoOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "functionalOfPartnerDirector"]}
          fieldKey={[String(field.fieldKey), "functionalOfPartnerDirector"]}
          label={idx === 0 ? "Functional of Partner/Director" : ""}
          rules={[{ required: true, message: "Please enter functional details" }]}
        >
          <Input placeholder="Enter functional details" />
        </Form.Item>
      </Col>
      <Col span={1}>
        <Popconfirm
          title="Are you sure you want to remove this shareholder?"
          onConfirm={() => remove(field.name)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            style={{ marginTop: idx === 0 ? 30 : 0 }}
          />
        </Popconfirm>
      </Col>
    </Row>
  );
};

const ShareholdingDetailsForm: React.FC<{ form: any }> = ({ form }) => (
  <Form.List name={["shareholders"]}>
    {(fields, { add, remove }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field, idx) => (
          <ShareholdingRow
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

export default ShareholdingDetailsForm; 