import React from "react";
import { Form, Input, Select, Button, Row, Col, Space, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const RELATIONSHIP_OPTIONS = [
  "Neighbor",
  "Friend",
  "Local Shop Owner",
  "Other",
];
// const FEEDBACK_STATUS_OPTIONS = ['Positive', 'Negative', 'Could Not Confirm'];

const ThirdPartyCheckRow: React.FC<{
  field: any;
  idx: any;
  remove: any;
  fieldsLength: any;
  form: any;
}> = ({ field, idx, remove, fieldsLength, form }) => {
  const relationship = Form.useWatch(
    ["checks", field.name, "relationship"],
    form
  );
  return (
    <Row
      gutter={18}
      key={String(field.key)}
      // align="middle"
      style={{ marginBottom: 0, backgroundColor: "#efefef", padding: 8 }}
    >
      <Col span={6}>
        <Form.Item
          {...field}
          name={[field.name, "tpcName"]}
          fieldKey={[String(field.fieldKey), "tpcName"]}
          label={idx === 0 ? "Name of TPC/Neighbor" : ""}
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "mobileNumber"]}
          fieldKey={[String(field.fieldKey), "mobileNumber"]}
          label={idx === 0 ? "Mobile Number" : ""}
          rules={[
            { required: true, message: "Please enter mobile number" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit mobile number",
            },
          ]}
        >
          <Input maxLength={10} placeholder="Enter mobile number" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          {...field}
          name={[field.name, "relationship"]}
          fieldKey={[String(field.fieldKey), "relationship"]}
          label={idx === 0 ? "Relationship " : ""}
          rules={[{ required: true, message: "Please select relationship" }]}
        >
          <Select placeholder="Select relationship">
            {RELATIONSHIP_OPTIONS.map((rel) => (
              <Option key={rel} value={rel}>
                {rel}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {relationship === "Other" && (
        <Col span={5}>
          <Form.Item
            {...field}
            name={[field.name, "relationshipOther"]}
            fieldKey={[String(field.fieldKey), "relationshipOther"]}
            label={idx === 0 ? "Specify Relationship" : ""}
            rules={[
              {
                required: true,
                message: "Please specify relationship",
              },
            ]}
          >
            <Input placeholder="Specify relationship" />
          </Form.Item>
        </Col>
      )}
      <Col span={6}>
        <Form.Item
          {...field}
          name={[field.name, "comments"]}
          fieldKey={[String(field.fieldKey), "comments"]}
          label={idx === 0 ? "Comments/Remarks" : ""}
          rules={[
            {
              required: true,
              message: "Please enter comments/remarks",
            },
          ]}
        >
          <Input.TextArea rows={1} placeholder="Enter comments" />
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

const ThirdPartyCheckForm: React.FC<{ form: any }> = ({ form }) => (
  <Form.List name={["checks"]}>
    {(fields, { add, remove }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field, idx) => (
          <ThirdPartyCheckRow
            key={field.key}
            field={field}
            idx={idx}
            remove={remove}
            fieldsLength={fields.length}
            form={form}
          />
        ))}
        {/* <br /> */}
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

export default ThirdPartyCheckForm;
