import React from "react";
import { Form, Input, Select, Button, Row, Col, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const statusOptions = ["positive", "negative"];

const AssetRow: React.FC<{
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
          name={[field.name, "address"]}
          fieldKey={[String(field.fieldKey), "address"]}
          label={idx === 0 ? "Address" : ""}
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "areaMeasured"]}
          fieldKey={[String(field.fieldKey), "areaMeasured"]}
          label={idx === 0 ? "Area (sq.ft)" : ""}
          rules={[{ required: true, message: "Please enter area" }]}
        >
          <Input placeholder="Enter area" type="number" />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "purchaseCost"]}
          fieldKey={[String(field.fieldKey), "purchaseCost"]}
          label={idx === 0 ? "Purchase Cost (lac)" : ""}
          rules={[{ required: true, message: "Please enter cost" }]}
        >
          <Input placeholder="Enter cost" type="number" />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "purchaseYear"]}
          fieldKey={[String(field.fieldKey), "purchaseYear"]}
          label={idx === 0 ? "Purchase Year" : ""}
          rules={[{ required: true, message: "Please enter year" }]}
        >
          <Input placeholder="Enter year" type="number" />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "marketValue"]}
          fieldKey={[String(field.fieldKey), "marketValue"]}
          label={idx === 0 ? "Market Value (lac)" : ""}
          rules={[{ required: true, message: "Please enter value" }]}
        >
          <Input placeholder="Enter value" type="number" />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "ownerName"]}
          fieldKey={[String(field.fieldKey), "ownerName"]}
          label={idx === 0 ? "Owner Name" : ""}
          rules={[{ required: true, message: "Please enter owner name" }]}
        >
          <Input placeholder="Enter owner name" />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "mortgaged"]}
          fieldKey={[String(field.fieldKey), "mortgaged"]}
          label={idx === 0 ? "Mortgaged" : ""}
          rules={[{ required: true, message: "Please select option" }]}
        >
          <Select placeholder="Select option">
            <Select.Option value="yes">Yes</Select.Option>
            <Select.Option value="no">No</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={2}>
        <Popconfirm
          title="Are you sure you want to remove this asset?"
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

const AssetDetailsForm: React.FC<{ form: any }> = ({ form }) => {
  return (
    <div>
      {/* Individual assets list */}
      <Form.List name={["assetDetails", "assets"]}>
        {(fields, { add, remove }) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {fields.map((field, idx) => (
              <AssetRow
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

      {/* Additional asset details */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Form.Item name={["assetDetails", "status"]} label="Status">
            <Select placeholder="Select status" allowClear>
              {statusOptions.map((opt) => (
                <Select.Option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["assetDetails", "remarks"]} label="Remarks">
            <Input placeholder="Enter remarks" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item name={["assetDetails", "vehicles"]} label="Vehicles">
            <Input placeholder="Enter vehicle details" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["assetDetails", "otherIncome"]} label="Other Income">
            <Input placeholder="Enter other income" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item name={["assetDetails", "observations"]} label="Observations">
            <Input placeholder="Enter observations" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["assetDetails", "siteCoordinates"]} label="Site Coordinates">
            <Input placeholder="Enter site coordinates" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item name={["assetDetails", "lifeInsuranceMediclaim"]} label="Life Insurance/Mediclaim">
            <Input placeholder="Enter details" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["assetDetails", "capitalInvestedBusiness"]} label="Capital Invested in Business">
            <Input placeholder="Enter details" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item name={["assetDetails", "liquidMoveableMonetaryItems"]} label="Liquid/Moveable/Monetary Items">
            <Input placeholder="Enter details" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default AssetDetailsForm; 