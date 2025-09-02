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
  Badge,
} from "antd";
// import { UserOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import {
  assignExecutivesApi,
  updateExecutivesApi,
} from "@/services/loans.services";
import { getFieldExecutivesByOfficeIdApi } from "@/services/users.services";
import styles from "./FieldAssignmentForm.module.css";
import { UserOutlined } from "@ant-design/icons";
import { getCurrentDepartmentOfficeId } from "@/utils/utility";

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
  loading: globalLoading,
  setLoading: setGlobalLoading,
  verifiers = [],
  fetchLoans,
  setRefresh,
  setFieldExecutiveEdit,
  fetchExecutives,
}) => {
  const [form] = Form.useForm();
  const [localLoading, setLocalLoading] = useState(false);
  const [localFieldExecutives, setLocalFieldExecutives] = useState<any[]>([]);
  const [fieldExecutivesLoading, setFieldExecutivesLoading] = useState(false);
  
  const currentDepartmentOfficeId = getCurrentDepartmentOfficeId();
  const remoteOffices = offices?.filter(
    (option: any) => Number(option?.value) !== Number(currentDepartmentOfficeId)
  );

 
  const getAssignmentMethod = (verification: any) => {
    if (!verification?.fieldExecutive?.departmentRoles) {
      return "Local";
    }
    
    const fieldExecutiveOfficeId = verification.fieldExecutive.departmentRoles.find(
      (role: any) => role.officeId
    )?.officeId;
    
    // Compare with current user's office ID
    if (fieldExecutiveOfficeId && currentDepartmentOfficeId) {
      return Number(fieldExecutiveOfficeId) === Number(currentDepartmentOfficeId) ? "Local" : "Remote";
    }
    
    return "Local";
  };

  const getOfficeId = (verification: any) => {
    if (!verification?.fieldExecutive?.departmentRoles) {
      return null;
    }
    
    const fieldExecutiveOfficeId = verification.fieldExecutive.departmentRoles.find(
      (role: any) => role.officeId
    )?.officeId;
    
    return fieldExecutiveOfficeId || null;
  };

  const fetchFieldExecutivesForOffice = async (officeId: string) => {
    try {
      setFieldExecutivesLoading(true);
      const result = await getFieldExecutivesByOfficeIdApi(officeId);
      const options = result?.data?.data?.map((item: any) => ({
        label: (
          <Row gutter={[0, 5]} style={{ width: "100%" }}>
            <Col xs={24} sm={24} md={1} xl={1}>
              <Badge
                dot
                status={item?.availabletoday ? "success" : "error"}
              />
            </Col>

            <Col
              xs={24}
              sm={12}
              md={8}
              xl={10}
              style={{ wordWrap: "break-word" }}
            >
              <Typography.Text>
                {item?.name}
              </Typography.Text>
            </Col>

            <Col xs={24} sm={6} md={6} xl={9}>
              <Tag color="blue">{item?.employeeCode}</Tag>
            </Col>

            <Col xs={24} sm={6} md={9} xl={4}>
              <Tag color="blue">P: {item?.pendingVerifications}</Tag>
            </Col>
          </Row>
        ),
        value: item?.id,
      })) ?? [];
      
   
      if (verification?.fieldExecutive) {
        const currentFieldExecutive = verification.fieldExecutive;
        const isAlreadyIncluded = options.some((option: any) => option.value === currentFieldExecutive.id);
        
        if (!isAlreadyIncluded) {
          options.unshift({
            label: (
              <Row gutter={[0, 5]} style={{ width: "100%" }}>
                <Col xs={24} sm={24} md={1} xl={1}>
                  <Badge
                    dot
                    status={currentFieldExecutive?.availabletoday ? "success" : "error"}
                  />
                </Col>

                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  xl={10}
                  style={{ wordWrap: "break-word" }}
                >
                  <Typography.Text>
                    {currentFieldExecutive.name}
                  </Typography.Text>
                </Col>

                <Col xs={24} sm={6} md={6} xl={9}>
                  <Tag color="blue">{currentFieldExecutive.employeeCode}</Tag>
                </Col>

                <Col xs={24} sm={6} md={9} xl={4}>
                  <Tag color="blue">P: {currentFieldExecutive?.pendingVerifications || 0}</Tag>
                </Col>
              </Row>
            ),
            value: currentFieldExecutive.id,
          });
        }
      }
      
      setLocalFieldExecutives(options);
    } catch (error) {
      console.error("Error fetching field executives:", error);
      setLocalFieldExecutives([]);
    } finally {
      setFieldExecutivesLoading(false);
    }
  };

 
  useEffect(() => {
    if (verification) { 
      const fieldExecutiveOfficeId = verification.fieldExecutive?.departmentRoles?.find(
        (role: any) => role.officeId
      )?.officeId;
      
      if (fieldExecutiveOfficeId) {
        fetchFieldExecutivesForOffice(fieldExecutiveOfficeId.toString());
      } else {
        // Fallback to current office
        const currentOfficeId = getCurrentDepartmentOfficeId();
        if (currentOfficeId) {
          fetchFieldExecutivesForOffice(currentOfficeId.toString());
        }
      }
    } else {
      const currentOfficeId = getCurrentDepartmentOfficeId();
      if (currentOfficeId) {
        fetchFieldExecutivesForOffice(currentOfficeId.toString());
      }
    }
  }, [verification]);

  useEffect(() => {
    if (verification) {
      const assignmentMethod = getAssignmentMethod(verification);
      if (assignmentMethod === "Remote") {
        const officeId = getOfficeId(verification);
        if (officeId) {
          fetchFieldExecutivesForOffice(officeId.toString());
        }
      }
    }
  }, [verification]);

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
      setLocalLoading(true);
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
              setCurrentOffice(currentDepartmentOfficeId?.toString() || "");
      setFieldExecutiveEdit((prev: any) => ({ ...prev, [type]: false }));
      fetchExecutives();
    } catch (error) {
      message.error("Failed to assign field executive");
      console.log(error);
    } finally {
      setLocalLoading(false);
    }
  };

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
                assignmentMethod: getAssignmentMethod(verification),
                office: getAssignmentMethod(verification) === "Remote" ? getOfficeId(verification) : null,
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
                        setCurrentOffice(currentDepartmentOfficeId?.toString() || "");
                        fetchFieldExecutivesForOffice(currentDepartmentOfficeId?.toString() || "");
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
                        fetchFieldExecutivesForOffice(value);
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
                initialValue={verification?.fieldExecutive ? {
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
                  value: verification?.fieldExecutive?.id,
                } : undefined}
                hidden={!address || (assignmentMethod === "Remote" && !office)}
              >
                <Select
                  placeholder="Select a Field Executive"
                  options={localFieldExecutives}
                  showSearch
                  loading={fieldExecutivesLoading}
                  filterOption={(input, option) =>
                    (option?.label?.toString().toLowerCase() || '').includes(input.toLowerCase())
                  }
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
            loading={localLoading}
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
