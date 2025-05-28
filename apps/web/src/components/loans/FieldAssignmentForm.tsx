import { Form, Radio, Select, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";

interface FieldAssignmentFormProps {
  verification: any;
  type: string;
  selectedLoan: any;
  handleVerificationAssign: (loanId: number, type: string, values: any) => void;
  permanentAddressDisabled: boolean;
  currentAddressDisabled: boolean;
  workDisabled: boolean;
  setCurrentOffice: (office: string) => void;
  userDetails: any;
  offices: any[];
  fieldExecutives: any[];
  loading: boolean;
}

const FieldAssignmentForm: React.FC<FieldAssignmentFormProps> = ({
  verification,
  type,
  selectedLoan,
  handleVerificationAssign,
  permanentAddressDisabled,
  currentAddressDisabled,
  workDisabled,
  setCurrentOffice,
  userDetails,
  offices,
  fieldExecutives,
  loading,
}) => {
  return (
    <div>
      <Form
        layout="vertical"
        initialValues={
          verification
            ? {
                assignmentMethod: verification?.assignmentMethod,
                office: verification?.office,
                assignee: verification?.assignee,
              }
            : {
                assignmentMethod: "Local",
              }
        }
        onFinish={(values) =>
          handleVerificationAssign(selectedLoan.id, type, values)
        }
        disabled={
          type === "PermanentAddress"
            ? permanentAddressDisabled
            : type === "CurrentAddress"
              ? currentAddressDisabled
              : workDisabled
        }
      >
        <Form.Item
          name="assignmentMethod"
          label="Assignment Method"
          rules={[
            {
              required: true,
              message: "Please select assignment method",
            },
          ]}
        >
          <Radio.Group
            onChange={(e) => {
              if (e.target.value === "Local") {
                setCurrentOffice(userDetails?.officeId || "");
              }
            }}
          >
            <Radio.Button value="Local">Local</Radio.Button>
            <Radio.Button value="Remote">Remote</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues?.assignmentMethod !== currentValues?.assignmentMethod
          }
        >
          {({ getFieldValue }) => {
            const assignmentMethod = getFieldValue("assignmentMethod");
            if (assignmentMethod === "Remote") {
              return (
                <Form.Item
                  name="office"
                  label="Select Branch"
                  rules={[
                    {
                      required: true,
                      message: "Please select a branch",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select branch"
                    onChange={(value) => {
                      setCurrentOffice(value);
                    }}
                    options={offices}
                  />
                </Form.Item>
              );
            }
            return null;
          }}
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues?.assignmentMethod !== currentValues?.assignmentMethod ||
            prevValues?.office !== currentValues?.office
          }
        >
          {({ getFieldValue }) => {
            // const assignmentMethod = getFieldValue("assignmentMethod");
            // const office = getFieldValue("office");
            return (
              <Form.Item
                name="assignee"
                label="Assign Field Executive"
                rules={[
                  {
                    required: true,
                    message: "Please select a field executive",
                  },
                ]}
              >
                <Select
                  placeholder="Select field executive"
                  style={{ width: "100%" }}
                  options={fieldExecutives}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<UserOutlined />}
          >
            {verification ? "Update Assignment" : "Assign Executive"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FieldAssignmentForm;
