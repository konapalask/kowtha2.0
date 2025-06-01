import { Form, Radio, Select, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { assignExecutivesApi } from "@/services/loans.services";

interface FieldAssignmentFormProps {
  verification: any;
  type: string;
  selectedLoan: any;
  permanentAddressDisabled: boolean;
  currentAddressDisabled: boolean;
  workDisabled: boolean;
  setCurrentOffice: (office: string) => void;
  userDetails: any;
  offices: any[];
  fieldExecutives: any[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  verifiers?: any[];
}

const FieldAssignmentForm: React.FC<FieldAssignmentFormProps> = ({
  verification,
  type,
  selectedLoan,
  permanentAddressDisabled,
  currentAddressDisabled,
  workDisabled,
  setCurrentOffice,
  userDetails,
  offices,
  fieldExecutives,
  loading,
  setLoading,
  verifiers = [],
}) => {
  const handleVerificationAssign = async (
    loanId: number,
    verificationType: string,
    values: {
      assignmentMethod: "Local" | "Remote";
      office?: string;
      assignee: string;
    }
  ) => {
    const finalData = {
      ...values,
      verificationType,
      fieldExecutiveId: values.assignee,
      address: "Anakapalli",
    };
    try {
      setLoading(true);
      await assignExecutivesApi(loanId, finalData);
      message.success("Field executive assigned successfully");
    } catch (error) {
      message.error("Failed to assign field executive");
    } finally {
      setLoading(false);
    }
  };

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
                label="Field Executive"
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

        <Form.Item
          name={"verifierId"}
          label="Verifier"
          rules={[
            {
              required: true,
              message: "Please select a verifier",
            },
          ]}
        >
          <Select
            placeholder="Select verifier"
            style={{ width: "100%" }}
            options={verifiers}
          />
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
