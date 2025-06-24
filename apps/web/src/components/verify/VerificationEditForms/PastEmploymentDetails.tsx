import React from "react";
import { Form, Input, Button, Row, Col, Popconfirm, DatePicker } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const PastEmploymentRow: React.FC<{
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
          name={[field.name, "employerName"]}
          fieldKey={[String(field.fieldKey), "employerName"]}
          label={idx === 0 ? "Employer/Business Name" : ""}
          rules={[
            { required: true, message: "Please enter employer/business name" },
          ]}
        >
          <Input placeholder="Enter employer/business name" />
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
          name={[field.name, "fromDate"]}
          fieldKey={[String(field.fieldKey), "fromDate"]}
          label={idx === 0 ? "From Date" : ""}
          rules={[{ required: true, message: "Please select from date" }]}
          getValueProps={(value) => ({
            value: value ? dayjs(value, "DD/MM/YYYY") : undefined,
          })}
          getValueFromEvent={(date) =>
            date ? date.format("DD/MM/YYYY") : undefined
          }
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            placeholder="From date"
          />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "toDate"]}
          fieldKey={[String(field.fieldKey), "toDate"]}
          label={idx === 0 ? "To Date" : ""}
          rules={[{ required: true, message: "Please select to date" }]}
          getValueProps={(value) => ({
            value: value ? dayjs(value, "DD/MM/YYYY") : undefined,
          })}
          getValueFromEvent={(date) =>
            date ? date.format("DD/MM/YYYY") : undefined
          }
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            placeholder="To date"
          />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "contactPersonName"]}
          fieldKey={[String(field.fieldKey), "contactPersonName"]}
          label={idx === 0 ? "Contact Person Name" : ""}
          rules={[
            { required: true, message: "Please enter contact person name" },
          ]}
        >
          <Input placeholder="Contact person name" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "contactPersonNumber"]}
          fieldKey={[String(field.fieldKey), "contactPersonNumber"]}
          label={idx === 0 ? "Contact Person Mobile" : ""}
          rules={[
            { required: true, message: "Please enter contact person mobile" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit mobile number",
            },
          ]}
        >
          <Input maxLength={10} placeholder="Contact person mobile" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "reasonForMovement"]}
          fieldKey={[String(field.fieldKey), "reasonForMovement"]}
          label={idx === 0 ? "Reason for Movement" : ""}
          rules={[
            { required: true, message: "Please enter reason for movement" },
          ]}
        >
          <Input placeholder="Reason for movement" />
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

const PastEmploymentDetails: React.FC<{ form: any }> = ({ form }) => (
  <Form.List name={["employments"]}>
    {(fields, { add, remove }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field, idx) => (
          <PastEmploymentRow
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

export default PastEmploymentDetails;
