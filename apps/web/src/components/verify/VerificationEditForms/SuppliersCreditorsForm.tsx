import React from "react";
import { Form, Input, Select, Button, Row, Col, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const reviewOptions = ["positive", "negative"];

const SupplierRow: React.FC<{
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
          name={[field.name, "name"]}
          fieldKey={[String(field.fieldKey), "name"]}
          label={idx === 0 ? "Name" : ""}
          rules={[{ required: true, message: "Please enter supplier name" }]}
        >
          <Input placeholder="Enter supplier name" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          {...field}
          name={[field.name, "phone"]}
          fieldKey={[String(field.fieldKey), "phone"]}
          label={idx === 0 ? "Phone" : ""}
          rules={[
            { required: true, message: "Please enter phone number" },
            { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number" }
          ]}
        >
          <Input placeholder="Enter phone number" maxLength={10} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          {...field}
          name={[field.name, "location"]}
          fieldKey={[String(field.fieldKey), "location"]}
          label={idx === 0 ? "Location" : ""}
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item
          {...field}
          name={[field.name, "review"]}
          fieldKey={[String(field.fieldKey), "review"]}
          label={idx === 0 ? "Review" : ""}
          rules={[{ required: true, message: "Please select review" }]}
        >
          <Select placeholder="Select review">
            {reviewOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={1}>
        <Popconfirm
          title="Are you sure you want to remove this supplier?"
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

const SuppliersCreditorsForm: React.FC<{ form: any }> = ({ form }) => {
  return (
    <div>
      {/* Summary fields */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Form.Item 
            name={["suppliersCreditors", "numberOfFixedSuppliers"]} 
            label="No. of Fixed Suppliers" 
            rules={[{ required: true, message: "Please enter number of fixed suppliers" }]}
          >
            <Input placeholder="Enter number" type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name={["suppliersCreditors", "creditPeriod"]} 
            label="Credit Period" 
            rules={[{ required: true, message: "Please enter credit period" }]}
          >
            <Input placeholder="Enter credit period" type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name={["suppliersCreditors", "cashChequeProportions"]} 
            label="Cash-Cheque Proportions" 
            rules={[{ required: true, message: "Please enter cash-cheque proportions" }]}
          >
            <Input placeholder="Enter proportions" />
          </Form.Item>
        </Col>
      </Row>

      {/* Individual suppliers list */}
      <Form.List name={["suppliersCreditors", "suppliers"]}>
        {(fields, { add, remove }) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {fields.map((field, idx) => (
              <SupplierRow
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
    </div>
  );
};

export default SuppliersCreditorsForm; 