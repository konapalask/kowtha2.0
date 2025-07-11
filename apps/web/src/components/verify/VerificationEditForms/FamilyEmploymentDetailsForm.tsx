import React from "react";
import { Form, Input, Select, Col, InputNumber } from "antd";

const { Option } = Select;

const FamilyEmploymentDetailsForm: React.FC<{
  form: any;
  getMaritalStatus: any;
}> = ({ form, getMaritalStatus }) => {
  const isSpouseWorking = Form.useWatch("isSpouseWorking", form);
  const maritalStatus = getMaritalStatus();
  return (
    <>
      <Col span={8}>
        <Form.Item
          name="totalFamilyMembers"
          label="Total Family Members"
          rules={[
            { required: true, message: "Please enter total family members" },
            {
              validator: (_, value) => {
                const earning = form.getFieldValue("earningMembers") || 0;
                const dependents = form.getFieldValue("dependents") || 0;

                if (value !== undefined && value !== earning + dependents) {
                  return Promise.reject(
                    new Error("Total must equal earning members + dependents")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber min={1} style={{ maxWidth: 70 }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="earningMembers"
          label="No. of Earning Members"
          rules={[
            {
              required: true,
              message: "Please enter number of earning members",
            },
          ]}
        >
          <InputNumber min={0} style={{ maxWidth: 70 }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="dependents"
          label="No. of Dependents"
          rules={[
            { required: true, message: "Please enter number of dependents" },
          ]}
        >
          <InputNumber min={0} style={{ maxWidth: 70 }} />
        </Form.Item>
      </Col>
      {maritalStatus === "Married" && (
        <Col span={6}>
          <Form.Item
            name="isSpouseWorking"
            label="Is Spouse Working"
            rules={[
              { required: true, message: "Please select if spouse is working" },
            ]}
          >
            <Select style={{ maxWidth: 70 }}>
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </Form.Item>
        </Col>
      )}
      {isSpouseWorking === "Yes" && (
        <>
          <Col span={16}>
            <Form.Item
              name="spouseEmploymentDetails"
              label="Spouse's Employment Details"
              rules={[
                {
                  required: true,
                  message: "Please enter spouse's employment details",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter details about spouse's employment including company name, designation, and monthly income"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="spouseMonthlyIncome"
              label="Spouse's Monthly Income"
              rules={[
                {
                  required: true,
                  message: "Please enter spouse's monthly income",
                },
                { type: "number", message: "Please enter a valid number" },
              ]}
            >
              <Input type="number" min={0} prefix="₹" />
            </Form.Item>
          </Col>
        </>
      )}
      <Col span={16}>
        <Form.Item
          name="assetsObserved"
          label="Assets Observed"
          rules={[{ required: true, message: "Please enter assets observed" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="List the assets observed during verification"
          />
        </Form.Item>
      </Col>
    </>
  );
};

export default FamilyEmploymentDetailsForm;
