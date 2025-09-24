import React from "react";
import { Form, Input, Select, Col, Button, Row, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const statusOptions = ["positive", "negative"];

const AssetDetailsForm: React.FC<{ form: any }> = ({ form }) => {
  const assets = Form.useWatch("assetDetails.assets", form) || [];

  const addAsset = () => {
    const currentAssets = form.getFieldValue("assetDetails.assets") || [];
    form.setFieldValue("assetDetails.assets", [
      ...currentAssets,
      {
        address: "",
        areaMeasured: "",
        purchaseCost: "",
        purchaseYear: "",
        marketValue: "",
        ownerName: "",
        mortgaged: "",
      },
    ]);
  };

  const removeAsset = (index: number) => {
    const currentAssets = form.getFieldValue("assetDetails.assets") || [];
    const newAssets = currentAssets.filter((_: any, i: number) => i !== index);
    form.setFieldValue("assetDetails.assets", newAssets);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button type="dashed" onClick={addAsset} block icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
            Add Asset
          </Button>
        </Col>
      </Row>

      {assets.map((_: any, index: number) => (
        <div key={index} style={{ marginBottom: 24, padding: 16, border: "1px solid #d9d9d9", borderRadius: 6 }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <h4 style={{ margin: 0 }}>Asset {index + 1}</h4>
            </Col>
            <Col>
              <Popconfirm title="Are you sure you want to remove this asset?" onConfirm={() => removeAsset(index)} okText="Yes" cancelText="No">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name={["assetDetails", "assets", index, "address"]} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
                <Input placeholder="Enter address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["assetDetails", "assets", index, "areaMeasured"]} label="Area Measured (in sq.ft)" rules={[{ required: true, message: "Please enter area" }]}>
                <Input placeholder="Enter area in sq.ft" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["assetDetails", "assets", index, "purchaseCost"]} label="Purchase Cost (in lac)" rules={[{ required: true, message: "Please enter cost" }]}>
                <Input placeholder="Enter cost in lac" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["assetDetails", "assets", index, "purchaseYear"]} label="Purchase Year" rules={[{ required: true, message: "Please enter year" }]}>
                <Input placeholder="Enter year" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["assetDetails", "assets", index, "marketValue"]} label="Market Value (in lac)" rules={[{ required: true, message: "Please enter value" }]}>
                <Input placeholder="Enter value in lac" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["assetDetails", "assets", index, "ownerName"]} label="Owner Name" rules={[{ required: true, message: "Please enter owner name" }]}>
                <Input placeholder="Enter owner name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["assetDetails", "assets", index, "mortgaged"]} label="Mortgaged" rules={[{ required: true, message: "Please select option" }]}>
                <Select placeholder="Select option">
                  <Select.Option value="yes">Yes</Select.Option>
                  <Select.Option value="no">No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ))}

      <Row gutter={[16, 16]}>
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