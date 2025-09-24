import React from "react";
import { Form, Input, Select, Col, Button, Row, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const reviewOptions = ["positive", "negative"];

const SuppliersCreditorsForm: React.FC<{ form: any }> = ({ form }) => {
  const suppliers = Form.useWatch("suppliersCreditors.suppliers", form) || [];

  const addSupplier = () => {
    const currentSuppliers = form.getFieldValue("suppliersCreditors.suppliers") || [];
    form.setFieldValue("suppliersCreditors.suppliers", [
      ...currentSuppliers,
      {
        name: "",
        phone: "",
        location: "",
        review: "",
      },
    ]);
  };

  const removeSupplier = (index: number) => {
    const currentSuppliers = form.getFieldValue("suppliersCreditors.suppliers") || [];
    const newSuppliers = currentSuppliers.filter((_: any, i: number) => i !== index);
    form.setFieldValue("suppliersCreditors.suppliers", newSuppliers);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item name={["suppliersCreditors", "numberOfFixedSuppliers"]} label="No. of Fixed Suppliers" rules={[{ required: true, message: "Please enter number of fixed suppliers" }]}>
            <Input placeholder="Enter number" type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={["suppliersCreditors", "creditPeriod"]} label="Credit Period" rules={[{ required: true, message: "Please enter credit period" }]}>
            <Input placeholder="Enter credit period" type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={["suppliersCreditors", "cashChequeProportions"]} label="Cash-Cheque Proportions" rules={[{ required: true, message: "Please enter cash-cheque proportions" }]}>
            <Input placeholder="Enter proportions" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button type="dashed" onClick={addSupplier} block icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
            Add Supplier
          </Button>
        </Col>
      </Row>

      {suppliers.map((_: any, index: number) => (
        <div key={index} style={{ marginBottom: 24, padding: 16, border: "1px solid #d9d9d9", borderRadius: 6 }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <h4 style={{ margin: 0 }}>Supplier {index + 1}</h4>
            </Col>
            <Col>
              <Popconfirm title="Are you sure you want to remove this supplier?" onConfirm={() => removeSupplier(index)} okText="Yes" cancelText="No">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name={["suppliersCreditors", "suppliers", index, "name"]} label="Name" rules={[{ required: true, message: "Please enter supplier name" }]}>
                <Input placeholder="Enter supplier name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["suppliersCreditors", "suppliers", index, "phone"]} label="Phone Number" rules={[{ required: true, message: "Please enter phone number" }]}>
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["suppliersCreditors", "suppliers", index, "location"]} label="Location" rules={[{ required: true, message: "Please enter location" }]}>
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["suppliersCreditors", "suppliers", index, "review"]} label="Review" rules={[{ required: true, message: "Please select review" }]}>
                <Select placeholder="Select review">
                  {reviewOptions.map((option) => (
                    <Select.Option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default SuppliersCreditorsForm; 