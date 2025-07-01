import React from "react";
import { Form, Input, Select, Col } from "antd";

const yesNoOptions = ["Yes", "No"];
const constitutionOptions = [
  "Proprietorship",
  "Partnership",
  "PVT Ltd",
  "Ltd",
  "Society",
  "Trust",
  "Others",
];
const relationshipOptions = [
  "Applicant",
  "Co-Applicant",
  "Guarantor",
  "Family",
  "Others",
];

export type BusinessDetailsFormData = {
  nameBoardSeen: string;
  nameBoardMatched: string;
  constitution: string;
  constitutionOther?: string;
  keyManagerRelation: string;
  keyManagerRelationOther?: string;
  keyManager?: string;
  businessStartYear: string;
  totalExperience: string;
  isAddressTraceable: string;
};

const BusinessDetails: React.FC<{ form: any }> = ({ form }) => {
  // Watch values for conditional rendering
  const constitution = Form.useWatch("constitution", form);
  const keyManagerRelation = Form.useWatch("keyManagerRelation", form);

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

      {constitution === "Others" && (
        <Col span={8}>
          <Form.Item
            name="constitutionOther"
            label="Specify Constitution"
            rules={[{ required: true, message: "Please specify constitution" }]}
          >
            <Input placeholder="Specify constitution" />
          </Form.Item>
        </Col>
      )}

      {/* <Col span={8}>
        <Form.Item
          name="keyManagerRelation"
          label="Key manager relationship to the applicant"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select relationship">
            {relationshipOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {keyManagerRelation === "Others" && (
        <Col span={8}>
          <Form.Item
            name="keyManagerRelationOther"
            label="Specify Relationship"
            rules={[{ required: true, message: "Please specify relationship" }]}
          >
            <Input placeholder="Specify relationship" />
          </Form.Item>
        </Col>
      )}

      {keyManagerRelation && keyManagerRelation !== "Applicant" && (
        <Col span={8}>
          <Form.Item
            name="keyManager"
            label="Key manager person of the Business"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Enter key manager name" />
          </Form.Item>
        </Col>
      )} */}

      <Col span={8}>
        <Form.Item
          name="businessStartYear"
          label="Business started in the year"
          rules={[
            { required: true, message: "Required" },
            {
              pattern: /^\d{4}$/,
              message: "Please enter a valid year (YYYY)",
            },
          ]}
        >
          <Input placeholder="YYYY" maxLength={4} />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name="totalExperience"
          label="Total experience in the field (years)"
          rules={[
            { required: true, message: "Required" },
            {
              pattern: /^\d+$/,
              message: "Please enter a valid number",
            },
          ]}
        >
          <Input type="number" placeholder="Enter total experience" />
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
          label="Is Business address traceable?"
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
          label="Geotag"
          rules={[{ required: true, message: "Required" }]}
          // hidden
        >
          <Input disabled />
        </Form.Item>
      </Col>
    </>
  );
};

export default BusinessDetails;
