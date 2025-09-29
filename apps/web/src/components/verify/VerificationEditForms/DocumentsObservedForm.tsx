import React from "react";
import { Form, Input, Button, Row, Col, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const DocumentRow: React.FC<{
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
      <Col span={6}>
        <Form.Item
          {...field}
          name={[field.name, "documentName"]}
          fieldKey={[String(field.fieldKey), "documentName"]}
          label={idx === 0 ? "Document Name" : ""}
          rules={[{ required: true, message: "Please enter document name" }]}
        >
          <Input placeholder="Enter document name" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          {...field}
          name={[field.name, "documentType"]}
          fieldKey={[String(field.fieldKey), "documentType"]}
          label={idx === 0 ? "Document Type" : ""}
          rules={[{ required: true, message: "Please enter document type" }]}
        >
          <Input placeholder="Enter document type" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          {...field}
          name={[field.name, "documentCategory"]}
          fieldKey={[String(field.fieldKey), "documentCategory"]}
          label={idx === 0 ? "Document Category" : ""}
          rules={[{ required: true, message: "Please enter document category" }]}
        >
          <Input placeholder="Enter document category" />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item
          {...field}
          name={[field.name, "remarks"]}
          fieldKey={[String(field.fieldKey), "remarks"]}
          label={idx === 0 ? "Remarks" : ""}
          rules={[{ required: true, message: "Please enter remarks" }]}
        >
          <Input placeholder="Enter remarks" />
        </Form.Item>
      </Col>
      <Col span={1} style={{ textAlign: "center" }}>
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

const DocumentsObservedForm: React.FC<{ form: any }> = ({ form }) => (
  <Form.List name={["documents"]}>
    {(fields, { add, remove }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field, idx) => (
          <DocumentRow
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
            Add Another Document
          </Button>
        </Form.Item>
      </div>
    )}
  </Form.List>
);

export default DocumentsObservedForm;
