import React from "react";
import { Form, Input, Button, Row, Col, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const AdditionalDetailRow: React.FC<{
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
      <Col span={22}>
        <Form.Item
          {...field}
          name={[field.name, "value"]}
          fieldKey={[String(field.fieldKey), "value"]}
          label={idx === 0 ? "Additional Detail" : ""}
          rules={[{ required: true, message: "Please enter additional detail" }]}
        >
          <Input.TextArea 
            rows={3}
            placeholder={`Enter additional detail #${idx + 1}`}
          />
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

export type AdditionalDetailsFormData = {
  details: Array<{
    value: string;
  }>;
};

const AdditionalDetailsForm: React.FC<{ form: any }> = ({ form }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <Form.List name={["details"]}>
      {(fields, { add, remove }) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {fields.map((field, idx) => (
            <AdditionalDetailRow
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
              Add Another Detail
            </Button>
          </Form.Item>
        </div>
      )}
    </Form.List>
  </div>
);

export default AdditionalDetailsForm; 