import React from "react";
import { Form, Input, Button, Row, Col, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const ColleagueReferenceRow: React.FC<{
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
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item
          {...field}
          name={[field.name, "address"]}
          fieldKey={[String(field.fieldKey), "address"]}
          label={idx === 0 ? "Address" : ""}
          // rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>
      </Col>
      <Col span={3}>
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
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "yearsKnown"]}
          fieldKey={[String(field.fieldKey), "yearsKnown"]}
          label={idx === 0 ? "Years Known" : ""}
          rules={[{ required: true, message: "Please enter years known" }]}
        >
          <Input placeholder="Years" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "contactNumber"]}
          fieldKey={[String(field.fieldKey), "contactNumber"]}
          label={idx === 0 ? "Contact Number" : ""}
          rules={[
            { required: true, message: "Please enter contact number" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit contact number",
            },
          ]}
        >
          <Input maxLength={10} placeholder="Contact number" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "emailAddress"]}
          fieldKey={[String(field.fieldKey), "emailAddress"]}
          label={idx === 0 ? "Email Address" : ""}
          rules={[
            // { required: true, message: "Please enter email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Email address" />
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

const ColleagueReferencesDetails: React.FC<{ form: any }> = ({ form }) => (
  <Form.List name={["references"]}>
    {(fields, { add, remove }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field, idx) => (
          <ColleagueReferenceRow
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

export default ColleagueReferencesDetails;
