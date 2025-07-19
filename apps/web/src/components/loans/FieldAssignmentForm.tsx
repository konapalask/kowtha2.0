import {
  Form,
  Radio,
  Select,
  Button,
  message,
  Input,
  Row,
  Col,
  Typography,
  Tag,
} from "antd";
// import { UserOutlined } from "@ant-design/icons";
import React from "react";
import {
  assignExecutivesApi,
  updateExecutivesApi,
} from "@/services/loans.services";
import styles from "./FieldAssignmentForm.module.css";
import { UserOutlined } from "@ant-design/icons";

interface FieldAssignmentFormProps {
  verification: any;
  type: string;
  selectedLoan: any;
  setCurrentOffice: (office: string) => void;
  userDetails: any;
  offices: any[];
  fieldExecutives: any[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  verifiers?: any[];
  fetchLoans: () => void;
  setRefresh: any;
  setFieldExecutiveEdit: any;
  fetchExecutives: any;
}

const FieldAssignmentForm: React.FC<FieldAssignmentFormProps> = ({
  verification,
  type,
  selectedLoan,
  setCurrentOffice,
  userDetails,
  offices,
  fieldExecutives,
  loading,
  setLoading,
  verifiers = [],
  fetchLoans,
  setRefresh,
  setFieldExecutiveEdit,
  fetchExecutives,
}) => {
  const [form] = Form.useForm();
  const getVerificationType = (type: string) => {
    switch (type) {
      case "Address1":
        return "AddressOne";
      case "Address2":
        return "AddressTwo";
      default:
        return type;
    }
  };

  const handleVerificationAssign = async (
    loanId: number,
    type: string,
    values: {
      assignmentMethod: "Local" | "Remote";
      office?: string;
      fieldExecutiveId: any;
      address: string;
      verifierId: string;
      businessName: string;
      currentOfficeName: string;
    }
  ) => {
    // console.log(values);
    const finalData = {
      ...(type === "Business" ? { businessName: values?.businessName } : {}),
      ...(type === "Work"
        ? { currentOfficeName: values?.currentOfficeName }
        : {}),
      verifierId: values?.verifierId,
      verificationType: getVerificationType(type),
      fieldExecutiveId:
        values.fieldExecutiveId?.value ?? values.fieldExecutiveId,
      address: values.address,
    };
    try {
      setLoading(true);
      if (verification) {
        await updateExecutivesApi(loanId, finalData);
        // Determine which fields are being updated
        const feChanged =
          finalData.fieldExecutiveId &&
          finalData.fieldExecutiveId !== verification.fieldExecutiveId;
        const verifierChanged =
          finalData.verifierId &&
          finalData.verifierId !== verification.verifierId;
        let msg = "";
        if (feChanged && verifierChanged) {
          msg = "Field executive and verifier updated successfully";
        } else if (feChanged) {
          msg = "Field executive updated successfully";
        } else if (verifierChanged) {
          msg = "Verifier updated successfully";
        } else {
          msg = "Assignment updated successfully";
        }
        message.success(msg);
      } else {
        await assignExecutivesApi(loanId, finalData);
        message.success(
          "Field executive and verifier are assigned successfully"
        );
      }
      fetchLoans();
      setCurrentOffice(userDetails?.officeId);
      setFieldExecutiveEdit((prev: any) => ({ ...prev, [type]: false }));
      fetchExecutives();
    } catch (error) {
      message.error("Failed to assign field executive");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const remoteOffices = offices?.filter(
    (option: any) => option?.value !== userDetails?.officeId
  );

  // console.log(verification);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={
          verification
            ? {
                businessName: verification?.businessName,
                currentOfficeName: verification?.currentOfficeName,
                assignmentMethod:
                  verification?.office &&
                  verification?.office !== userDetails?.officeId
                    ? "Remote"
                    : "Local",
                office: verification?.office,
                fieldExecutiveId: verification?.fieldExecutiveId,
                address: verification?.applicantAddress || "",
                verifierId: verification?.verifierId,
              }
            : {
                assignmentMethod: "Local",
                address: "",
              }
        }
        onFinish={(values) =>
          handleVerificationAssign(selectedLoan.id, type, values)
        }
      >
        {type === "Business" && (
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please enter business name",
              },
            ]}
            name={"businessName"}
            label={"Business Name"}
          >
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 2 }}
              minLength={3}
              maxLength={60}
              placeholder="Business Name"
            />
          </Form.Item>
        )}
        {type === "Work" && (
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please enter company name",
              },
            ]}
            name={"currentOfficeName"}
            label={"Company Name"}
          >
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 2 }}
              minLength={3}
              maxLength={60}
              placeholder="Company Name"
            />
          </Form.Item>
        )}
        <Form.Item
          name="address"
          // label={type === "AddressOne" ? "Address 1" :type === "AddressTwo" ? "Address 2" : type === "Work" ? "Work Address" : type === "Business" ? "Business Address" : "Address"}
          rules={[
            {
              required: true,
              message: "Please enter the address",
            },
          ]}
        >
          <Input.TextArea
            rows={2}
            placeholder="Enter address for verification"
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues?.assignmentMethod !== currentValues?.assignmentMethod ||
            !prevValues?.address
          }
        >
          {({ getFieldValue }) => {
            const assignmentMethod = getFieldValue("assignmentMethod");
            const address = getFieldValue("address");
            return (
              <>
                <Form.Item
                  name="assignmentMethod"
                  rules={[
                    {
                      required: true,
                      message: "Please select assignment method",
                    },
                  ]}
                  hidden={!address}
                >
                  <Radio.Group
                    disabled={!address}
                    style={{ width: "100%" }}
                    className={styles.customRadioGroup}
                    onChange={(e) => {
                      if (e.target.value === "Local") {
                        setCurrentOffice(userDetails?.officeId || "");
                      }
                      form.setFieldValue("fieldExecutiveId", null);
                      form.setFieldValue("office", null);
                    }}
                  >
                    <Radio.Button value="Local">Local</Radio.Button>
                    <Radio.Button value="Remote">Remote</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                {assignmentMethod === "Remote" && (
                  <Form.Item
                    name="office"
                    // label="Select Branch"
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
                        form.setFieldValue("fieldExecutiveId", null);
                      }}
                      options={remoteOffices}
                    />
                  </Form.Item>
                )}
              </>
            );
          }}
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues?.assignmentMethod !== currentValues?.assignmentMethod ||
            prevValues?.office !== currentValues?.office ||
            !prevValues?.address
          }
        >
          {({ getFieldValue }) => {
            const address = getFieldValue("address");
            const assignmentMethod = getFieldValue("assignmentMethod");
            const office = getFieldValue("office");
            return (
              <Form.Item
                name="fieldExecutiveId"
                label="Field Executive"
                rules={[
                  {
                    required: true,
                    message: "Please select a field executive",
                  },
                ]}
                initialValue={{
                  label: (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text>
                        {verification?.fieldExecutive?.name}
                      </Typography.Text>
                      <Tag color="blue">
                        {verification?.fieldExecutive?.employeeCode}
                      </Tag>
                    </div>
                  ),
                  value: verification?.fieldExecutive?.employeeCode,
                }}
                hidden={!address || (assignmentMethod === "Remote" && !office)}
              >
                <Select
                  placeholder="Select a Field Executive"
                  options={fieldExecutives}
                  // onSelect removed to allow form validation to show error
                />
              </Form.Item>
            );
          }}
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues?.assignmentMethod !== currentValues?.assignmentMethod ||
            prevValues?.office !== currentValues?.office ||
            !prevValues?.address
          }
        >
          {({ getFieldValue }) => {
            const address = getFieldValue("address");
            const assignmentMethod = getFieldValue("assignmentMethod");
            const office = getFieldValue("office");
            return (
              <Form.Item
                label=" Verifier"
                name={"verifierId"}
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                    message: "Please select a verifier",
                  },
                ]}
                hidden={!address || (assignmentMethod === "Remote" && !office)}
              >
                <Select
                  placeholder="Select Verifier"
                  value={verification?.verifierId || null}
                  options={verifiers}
                  style={{ width: "100%" }}
                  disabled={
                    !address || (assignmentMethod === "Remote" && !office)
                  }
                />
              </Form.Item>
            );
          }}
        </Form.Item>

        <Form.Item>
          <Button
            // type="primary"
            htmlType="submit"
            loading={loading}
            icon={<UserOutlined />}
          >
            {verification ? "Update Assignment" : "Assign Executives"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FieldAssignmentForm;
