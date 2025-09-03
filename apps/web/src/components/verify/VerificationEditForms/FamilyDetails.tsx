import React from "react";
import { Form, Input, Select, Col, Button, Space, Row, Popconfirm } from "antd";
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const relationOptions = [
  "Father",
  "Mother",
  "Spouse",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Other",
];

const employmentOptions = [
  "Full Time Job",
  "Part Time Job",
  "Business",
  "Student",
  "Housewife",
  "Retired",
  "Unemployed",
  "Other",
];

const educationOptions = [
  "Below 10th",
  "10th Pass",
  "12th Pass",
  "Graduate",
  "Post Graduate",
  "Professional",
  "Other",
];

const yesNoOptions = ["Yes", "No"];

export type FamilyDetailsFormData = {
  familyMemberDetails: Array<{
    name: string;
    relation: string;
    otherRelation?: string;
    age: string;
    employmentType: string;
    educationalQualification: string;
    mobileNumber: string;
    stayingWithApplicant: string;
  }>;
};

const FamilyMemberRow: React.FC<{
  field: any;
  idx: any;
  remove: any;
  fieldsLength: any;
  form: any;
}> = ({ field, idx, remove, fieldsLength, form }) => {
  // Watch the relation for this specific family member
  const relation = Form.useWatch(["familyMemberDetails", field.name, "relation"], form);

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
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
      </Col>
      
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "relation"]}
          fieldKey={[String(field.fieldKey), "relation"]}
          label={idx === 0 ? "Relation" : ""}
          rules={[{ required: true, message: "Relation is required" }]}
        >
          <Select placeholder="Select relation">
            {relationOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      
      {relation === "Other" && (
        <Col span={4}>
          <Form.Item
            {...field}
            name={[field.name, "otherRelation"]}
            fieldKey={[String(field.fieldKey), "otherRelation"]}
            label={idx === 0 ? "Other Relation" : ""}
            rules={[{ required: true, message: "Please specify other relation" }]}
          >
            <Input placeholder="Specify other relation" />
          </Form.Item>
        </Col>
      )}
      
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "age"]}
          fieldKey={[String(field.fieldKey), "age"]}
          label={idx === 0 ? "Age" : ""}
          rules={[{ required: true, message: "Age is required" }]}
        >
          <Input placeholder="Enter age" type="number" min={0} max={120} />
        </Form.Item>
      </Col>
      
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "employmentType"]}
          fieldKey={[String(field.fieldKey), "employmentType"]}
          label={idx === 0 ? "Occupation" : ""}
          rules={[{ required: true, message: "Occupation is required" }]}
        >
          <Select placeholder="Select occupation">
            {employmentOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "educationalQualification"]}
          fieldKey={[String(field.fieldKey), "educationalQualification"]}
          label={idx === 0 ? "Education" : ""}
          rules={[{ required: true, message: "Education is required" }]}
        >
          <Select placeholder="Select education">
            {educationOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "mobileNumber"]}
          fieldKey={[String(field.fieldKey), "mobileNumber"]}
          label={idx === 0 ? "Mobile Number" : ""}
          rules={[
            { required: true, message: "Mobile number is required" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Mobile number must be 10 digits",
            },
          ]}
        >
          <Input placeholder="Enter mobile number" maxLength={10} />
        </Form.Item>
      </Col>
      
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "stayingWithApplicant"]}
          fieldKey={[String(field.fieldKey), "stayingWithApplicant"]}
          label={idx === 0 ? "Staying with Applicant" : ""}
          rules={[{ required: true, message: "Please specify if staying with applicant" }]}
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

const FamilyDetails: React.FC<{ form: any }> = ({ form }) => (
  <Form.List name="familyMemberDetails">
    {(fields, { add, remove }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field, idx) => (
          <FamilyMemberRow
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

export default FamilyDetails; 