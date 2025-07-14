import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col, Popconfirm, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const FamilyMemberRow: React.FC<{
  field: any;
  idx: any;
  remove: any;
  fieldsLength: any;
  form: any;
}> = ({ field, idx, remove, fieldsLength, form }) => {
  const relation = Form.useWatch(
    ["familyMemberDetails", field.name, "relation"],
    form
  );
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
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "relation"]}
          fieldKey={[String(field.fieldKey), "relation"]}
          label={idx === 0 ? "Relation" : ""}
          rules={[{ required: true, message: "Please select relation" }]}
        >
          <Select placeholder="Select relation">
            <Option value="Spouse">Spouse</Option>
            <Option value="Daughter">Daughter</Option>
            <Option value="Son">Son</Option>
            <Option value="Father">Father</Option>
            <Option value="Mother">Mother</Option>
            <Option value="Brother">Brother</Option>
            <Option value="Sister">Sister</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
      </Col>
      {relation === "Other" && (
        <Col span={5}>
          <Form.Item
            {...field}
            name={[field.name, "otherRelation"]}
            fieldKey={[String(field.fieldKey), "otherRelation"]}
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
      <Col span={2}>
        <Form.Item
          {...field}
          name={[field.name, "age"]}
          fieldKey={[String(field.fieldKey), "age"]}
          label={idx === 0 ? "Age" : ""}
          rules={[
            { required: true, message: "Please enter age" },
            {
              pattern: /^[0-9]{1,3}$/,
              message: "Please enter a valid age",
            },
          ]}
        >
          <Input maxLength={3} placeholder="Age" />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "employmentType"]}
          fieldKey={[String(field.fieldKey), "employmentType"]}
          label={idx === 0 ? "Employment Type" : ""}
          rules={[{ required: true, message: "Please select employment type" }]}
        >
          <Select placeholder="Select employment type">
            <Option value="Salaried">Salaried</Option>
            <Option value="Self Employed">Self Employed</Option>
            <Option value="Business">Business</Option>
            <Option value="Student">Student</Option>
            <Option value="Homemaker">Homemaker</Option>
            <Option value="Retired">Retired</Option>
            <Option value="Unemployed">Unemployed</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...field}
          name={[field.name, "educationalQualification"]}
          fieldKey={[String(field.fieldKey), "educationalQualification"]}
          label={idx === 0 ? "Educational Qualification" : ""}
          rules={[
            {
              required: true,
              message: "Please enter educational qualification",
            },
          ]}
        >
          <Input placeholder="Enter educational qualification" />
        </Form.Item>
      </Col>
      <Col span={3}>
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
          <Input maxLength={10} placeholder="Mobile number" />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...field}
          name={[field.name, "stayingWithApplicant"]}
          fieldKey={[String(field.fieldKey), "stayingWithApplicant"]}
          label={idx === 0 ? "Staying with Applicant" : ""}
          rules={[{ required: true, message: "Please select staying status" }]}
        >
          <Select placeholder="Select status">
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
          </Select>
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

const FamilyMemberForm: React.FC<{ form: any }> = ({ form }) => {
  return (
    <Form.List name={"familyMemberDetails"}>
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
              Add Family Member
            </Button>
          </Form.Item>
        </div>
      )}
    </Form.List>
  );
};

export default FamilyMemberForm;
