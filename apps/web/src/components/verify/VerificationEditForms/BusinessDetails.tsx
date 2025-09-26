import React from "react";
import { Form, Input, Select, Col } from "antd";

const yesNoOptions = ["Yes", "No"];

const constitutionOptions = [
  "Proprietorship",
  "Partnership",
  "Private Limited",
  "Public Limited",
  "Society",
  "Trust",
  "Others",
];


const pdConstitutionOptions = [
  "Proprietorship",
  "Partnership",
  "Private Limited",
  "LLP (Limited Liability Partnership)",
  "Others",
];


const natureOfBusinessOptions = [
  "Manufacturer",
  "Trader",
  "Service Provider",
  "Distributor",
  "Retailer",
  "Others",
];

const businessActivityObservedOptions = [
  "Retail",
  "Wholesale",
  "Manufacturing",
  "Service",
  "Trading",
  "Others",
];

export type BusinessDetailsFormData = {
  businessType: string;
  employeesDeclared: string;
  employeesObserved: string;
  constitutionOfBusiness: string;
  natureOfBusiness: string;
  businessActivityObserved: string;
  stockObserved: string;
  businessStartYear: string;
  occupiedSince: string;
  netMargin: string;
  businessPremisesSize: string;
  rawMaterialSupplier: string;
};

const BusinessDetails: React.FC<{ form: any; currentDepartment?: string }> = ({ form, currentDepartment }) => {
  // For PD department, show different fields
  if (currentDepartment === 'PD') {
    return (
      <>
        <Col span={8}>
          <Form.Item
            name="employeesDeclared"
            label="No. of Employees (Declared)"
            rules={[{ required: true, message: "Number of employees declared is required" }]}
          >
            <Input placeholder="Enter number of employees declared" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="employeesObserved"
            label="No. of Employees (Observed)"
            rules={[{ required: true, message: "Number of employees observed is required" }]}
          >
            <Input placeholder="Enter number of employees observed" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="constitutionOfBusiness"
            label="Constitution of Business"
            rules={[{ required: true, message: "Constitution of business is required" }]}
          >
            <Select placeholder="Select constitution">
              {pdConstitutionOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="natureOfBusiness"
            label="Nature of Business"
            rules={[{ required: true, message: "Nature of business is required" }]}
          >
            <Select placeholder="Select nature of business">
              {natureOfBusinessOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="businessActivityObserved"
            label="Business Activity Observed"
            rules={[{ required: true, message: "Business activity observed is required" }]}
          >
            <Select placeholder="Select business activity">
              {businessActivityObservedOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="stockObserved"
            label="Stock Observed"
            rules={[{ required: true, message: "Stock observed is required" }]}
          >
            <Input placeholder="Enter stock observed" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="businessStartYear"
            label="Business Start Year"
            rules={[{ required: true, message: "Business start year is required" }]}
          >
            <Input placeholder="Enter business start year" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="occupiedSince"
            label="Occupied Since (years)"
            rules={[{ required: true, message: "Occupied since is required" }]}
          >
            <Input placeholder="Enter years occupied" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="netMargin"
            label="Net Margin (%)"
            rules={[{ required: true, message: "Net margin is required" }]}
          >
            <Input placeholder="Enter net margin" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="businessPremisesSize"
            label="Business Premises Size (in sq. ft.)"
            rules={[{ required: true, message: "Business premises size is required" }]}
          >
            <Input placeholder="Enter premises size" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="rawMaterialSupplier"
            label="Raw Material Supplier"
            rules={[{ required: true, message: "Raw material supplier is required" }]}
          >
            <Input placeholder="Enter raw material supplier" />
          </Form.Item>
        </Col>
      </>
    );
  }

  // Original implementation for other departments
  return (
    <>
      <Col span={8}>
        <Form.Item
          name="nameBoardSeen"
          label="Name Board was seen"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select Yes/No">
            {yesNoOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="nameBoardMatched"
          label="Is it matched with the Initiation?"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select Yes/No">
            {yesNoOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="constitution"
          label="Constitution of The Business"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select Constitution">
            {constitutionOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {Form.useWatch("constitution", form) === "Others" && (
        <Col span={8}>
          <Form.Item
            name="constitutionOther"
            label="Other Constitution"
            rules={[{ required: true, message: "Please specify other constitution" }]}
          >
            <Input placeholder="Specify other constitution" />
          </Form.Item>
        </Col>
      )}

      <Col span={8}>
        <Form.Item
          name="businessStartYear"
          label="Business Start Year"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Enter business start year" />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="totalExperience"
          label="Total Experience (Years)"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Enter total experience" />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="isBusinessSeasonal"
          label="Is Business Seasonal?"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select Yes/No">
            {yesNoOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="isAddressTraceable"
          label="Is Address Traceable"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select Yes/No">
            {yesNoOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="geoTag"
          label="Geo Tag"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Enter geo tag" />
        </Form.Item>
      </Col>
    </>
  );
};

export default BusinessDetails;
