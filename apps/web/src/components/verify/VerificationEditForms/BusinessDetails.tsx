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

// New options for Arka Fincap fields
const typeOfBusinessOptions = [
  "Proprietorship",
  "Partnership",
  "Private Limited",
  "LLP",
  "Others",
];

const stockSourceOptions = [
  "Suppliers",
  "Manufacturers",
  "Wholesalers",
  "Direct Import",
  "Others",
];

const stockHandlingOptions = [
  "Premises",
  "Warehouse",
  "Godown",
  "Others",
];

const transactionModeOptions = [
  "Cash",
  "Cheque",
  "Online Transfer",
  "Mixed",
  "Others",
];

const premisesOwnershipOptions = [
  "Owned",
  "Rented",
  "Leased",
  "Others",
];

export type BusinessDetailsFormData = {
  typeOfBusiness: string;
  natureOfBusiness: string;
  yearBusinessStarted: string;
  numberOfWorkers: string;
  salesVolume: string;
  profitPerUnit: string;
  stockSource: string;
  stockHandling: string;
  majorTransactionMode: string;
  businessPremisesOwnership: string;
  wageExpenses: string;
  // Legacy fields for other departments
  businessType?: string;
  employeesDeclared?: string;
  employeesObserved?: string;
  constitutionOfBusiness?: string;
  businessActivityObserved?: string;
  stockObserved?: string;
  businessStartYear?: string;
  occupiedSince?: string;
  netMargin?: string;
  businessPremisesSize?: string;
  rawMaterialSupplier?: string;
};

const BusinessDetails: React.FC<{ form: any; currentDepartment?: string }> = ({ form, currentDepartment }) => {
  // For PD department, show Arka Fincap specific fields
  if (currentDepartment === 'PD') {
    return (
      <>
        <Col span={8}>
          <Form.Item
            name="typeOfBusiness"
            label="Type of Business"
            rules={[{ required: true, message: "Type of business is required" }]}
          >
            <Select placeholder="Select type of business">
              {typeOfBusinessOptions.map((option) => (
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
            name="yearBusinessStarted"
            label="Year Business Started"
            rules={[{ required: true, message: "Year business started is required" }]}
          >
            <Input placeholder="Enter year business started" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="numberOfWorkers"
            label="Number of Workers"
            rules={[{ required: true, message: "Number of workers is required" }]}
          >
            <Input placeholder="Enter number of workers" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="salesVolume"
            label="Sales Volume"
            rules={[{ required: true, message: "Sales volume is required" }]}
          >
            <Input placeholder="Enter sales volume" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="profitPerUnit"
            label="Profit Per Unit"
            rules={[{ required: true, message: "Profit per unit is required" }]}
          >
            <Input placeholder="Enter profit per unit" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="stockSource"
            label="Stock Source"
            rules={[{ required: true, message: "Stock source is required" }]}
          >
            <Select placeholder="Select stock source">
              {stockSourceOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="stockHandling"
            label="Stock Handling"
            rules={[{ required: true, message: "Stock handling is required" }]}
          >
            <Select placeholder="Select stock handling">
              {stockHandlingOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="majorTransactionMode"
            label="Major Transaction Mode"
            rules={[{ required: true, message: "Major transaction mode is required" }]}
          >
            <Select placeholder="Select transaction mode">
              {transactionModeOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="businessPremisesOwnership"
            label="Business Premises Ownership"
            rules={[{ required: true, message: "Business premises ownership is required" }]}
          >
            <Select placeholder="Select premises ownership">
              {premisesOwnershipOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="wageExpenses"
            label="Wage Expenses"
            rules={[{ required: true, message: "Wage expenses is required" }]}
          >
            <Input placeholder="Enter wage expenses" />
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
