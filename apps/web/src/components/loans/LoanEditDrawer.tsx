import {
  Drawer,
  Tag,
  Typography,
  Button,
  Checkbox,
  Card,
  Descriptions,
  Divider,
  message,
  Switch,
} from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import React, { useContext, useState } from "react";
import { bankOptions, loanTypeOptions } from "@/utils/options";
import { UserContext } from "../layout/UserContextProvider";
import { assignExecutivesApi } from "@/services/loans.services";
import FieldAssignmentForm from "./FieldAssignmentForm";
import LoanInformationEditForm from "./LoanInformationEditForm";

interface LoanEditProps {
  selectedLoan: any;
  setSelectedLoan: (loan: any) => void;
  isDrawerVisible: boolean;
  setIsDrawerVisible: (visible: boolean) => void;
  sameAddress: boolean;
  setSameAddress: (val: boolean) => void;
  editLoanInfo: boolean;
  setEditLoanInfo: (val: boolean) => void;
  form: any;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setLoans: any;
  loans: any[];
  fieldExecutives?: any[];
  setCurrentOffice?: (officeId: string) => void;
  offices?: any[];
}

const LoanEditDrawer: React.FC<LoanEditProps> = ({
  selectedLoan,
  setSelectedLoan,
  isDrawerVisible,
  setIsDrawerVisible,
  sameAddress,
  setSameAddress,
  editLoanInfo,
  setEditLoanInfo,
  form,
  loading,
  setLoading,
  setLoans,
  loans,
  fieldExecutives = [],
  setCurrentOffice = () => {},
  offices = [],
}) => {
  const { userDetails } = useContext(UserContext);
  const [permanentAddressDisabled, setPermanentAddressDisabled] =
    useState(false);
  const [currentAddressDisabled, setCurrentAddressDisabled] = useState(false);
  const [workDisabled, setWorkDisabled] = useState(false);

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
    };
    try {
      setLoading(true);
      const result = await assignExecutivesApi(loanId, finalData);

      setLoans(
        loans.map((loan) => {
          if (loan.id === loanId) {
            const updatedVerifications = loan.verifications.map((v: any) =>
              v.type === verificationType ? { ...v, ...result.data } : v
            );
            return { ...loan, verifications: updatedVerifications };
          }
          return loan;
        })
      );

      message.success("Field executive assigned successfully");
    } catch (error) {
      message.error("Failed to assign field executive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Drawer
        title={
          <span>
            {selectedLoan?.id
              ? `Loan Details - ${selectedLoan?.applicationNumber}`
              : "New Loan"}{" "}
            {selectedLoan?.status && (
              <Tag
                color={
                  selectedLoan.status === "Pending"
                    ? "orange"
                    : selectedLoan.status === "Approved"
                      ? "green"
                      : selectedLoan.status === "Rejected"
                        ? "red"
                        : selectedLoan.status === "FieldVerificationComplete"
                          ? "green"
                          : selectedLoan.status === "FieldVerificationStarted"
                            ? "blue"
                            : "default"
                }
                style={{ marginLeft: 8 }}
              >
                {(() => {
                  switch (selectedLoan.status) {
                    case "Pending":
                      return "Unassigned";
                    case "Assigned":
                      return "Assigned";
                    case "FieldVerificationStarted":
                      return "Under FV";
                    case "FieldVerificationComplete":
                      return "FV Completed";
                    case "Approved":
                      return "Approved";
                    case "Rejected":
                      return "Rejected";
                    default:
                      return selectedLoan.status;
                  }
                })()}
              </Tag>
            )}
          </span>
        }
        placement="right"
        width="80%"
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedLoan(null);
          setSameAddress(false);
          setEditLoanInfo(false);
        }}
        open={isDrawerVisible}
        maskClosable={false}
      >
        {selectedLoan && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Loan Information
                </Typography.Title>
                {!editLoanInfo && selectedLoan.id && (
                  <Button
                    type="link"
                    onClick={() => {
                      setEditLoanInfo(true);
                      if (selectedLoan) {
                        // Find the matching loan type option
                        const matchingLoanType = loanTypeOptions.find(
                          (option) =>
                            option.value.toLowerCase() ===
                            selectedLoan.loanType?.toLowerCase()
                        );

                        // Find the matching bank option
                        const matchingBank = bankOptions.find((option) =>
                          option.value
                            .toLowerCase()
                            .includes(
                              selectedLoan.bankName?.toLowerCase() || ""
                            )
                        );

                        form.setFieldsValue({
                          applicationNumber: selectedLoan.applicationNumber,
                          applicantName: selectedLoan.applicantName,
                          applicantMobile: selectedLoan.applicantMobile,
                          loanAmount: selectedLoan.loanAmount,
                          applicantAddress: selectedLoan.applicantAddress,
                          loanType:
                            matchingLoanType?.value || selectedLoan.loanType,
                          bankName:
                            matchingBank?.value || selectedLoan.bankName,
                        });
                      }
                    }}
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                )}
              </div>
              {!selectedLoan.id || editLoanInfo ? (
                <LoanInformationEditForm
                  form={form}
                  selectedLoan={selectedLoan}
                  setSelectedLoan={setSelectedLoan}
                  setLoans={setLoans}
                  setIsDrawerVisible={setIsDrawerVisible}
                  setEditLoanInfo={setEditLoanInfo}
                  loading={loading}
                  loans={loans}
                  setLoading={setLoading}
                />
              ) : (
                <Descriptions
                  className="loan-details-descriptions"
                  bordered
                  size="small"
                  column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                >
                  <Descriptions.Item label="Application Number">
                    {selectedLoan?.applicationNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Applicant Name">
                    {selectedLoan?.applicantName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mobile Number">
                    {selectedLoan?.applicantMobile}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loan Amount">
                    {selectedLoan?.loanAmount}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {selectedLoan?.applicantAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loan Type">
                    {selectedLoan?.loanType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bank Name">
                    {selectedLoan?.bankName}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </div>

            <div style={{ marginTop: 24 }}>
              <Typography.Title level={4}>Verifications</Typography.Title>
              <Checkbox
                checked={sameAddress}
                onChange={(e) => setSameAddress(e.target.checked)}
                style={{ marginBottom: 16 }}
              >
                Permanent and Current Address are the same
              </Checkbox>
              <div style={{ display: "flex", gap: 16 }}>
                {sameAddress
                  ? [
                      {
                        label: "Permanent & Current Address",
                        type: "PermanentAddress",
                        merged: true,
                      },
                      { label: "Work", type: "Work", merged: false },
                    ].map(({ label, type, merged }) => {
                      const verification = selectedLoan?.verifications?.find(
                        (v: any) =>
                          merged
                            ? v.type === "PermanentAddress" ||
                              v.type === "CurrentAddress"
                            : v.type === type
                      );
                      return (
                        <Card
                          key={label}
                          title={label}
                          style={{
                            flex: 1,
                            height:
                              verification?.status === "Completed"
                                ? "auto"
                                : "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          bodyStyle={{
                            flex:
                              verification?.status === "Completed" ? "none" : 1,
                            padding:
                              verification?.status === "Completed"
                                ? "12px"
                                : "24px",
                          }}
                          extra={
                            <>
                              {verification && (
                                <>
                                  {verification && (
                                    <Tag
                                      color={
                                        verification.status === "Completed"
                                          ? "green"
                                          : "blue"
                                      }
                                    >
                                      {verification.status}
                                    </Tag>
                                  )}
                                </>
                              )}
                              <Switch
                                checked={
                                  type === "PermanentAddress"
                                    ? !permanentAddressDisabled
                                    : type === "CurrentAddress"
                                      ? !currentAddressDisabled
                                      : !workDisabled
                                }
                                checkedChildren="Enabled"
                                unCheckedChildren="Disabled"
                                style={{ marginLeft: 8 }}
                                onChange={(checked) => {
                                  if (type === "PermanentAddress") {
                                    setPermanentAddressDisabled(!checked);
                                  } else if (type === "CurrentAddress") {
                                    setCurrentAddressDisabled(!checked);
                                  } else if (type === "Work") {
                                    setWorkDisabled(!checked);
                                  }
                                }}
                              />
                            </>
                          }
                        >
                          {verification && (
                            <div
                              style={{
                                marginBottom:
                                  verification?.status === "Completed" ? 0 : 16,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  marginBottom: 8,
                                }}
                              >
                                <span>Currently assigned to:</span>
                                <Tag color="blue">
                                  {fieldExecutives?.find(
                                    (fe) =>
                                      fe.value === verification.fieldExecutiveId
                                  )?.label || "-"}
                                </Tag>
                              </div>
                              {verification?.status !== "Completed" && (
                                <Divider style={{ margin: "8px 0" }} />
                              )}
                            </div>
                          )}
                          {verification?.status === "Completed" ? (
                            <div
                              style={{
                                textAlign: "center",
                                color: "#52c41a",
                                padding: "8px 0",
                              }}
                            >
                              <InfoCircleOutlined style={{ marginRight: 8 }} />
                              Verification completed - No further updates
                              required
                            </div>
                          ) : (
                            <FieldAssignmentForm
                              verification={verification}
                              type={type}
                              selectedLoan={selectedLoan}
                              handleVerificationAssign={
                                handleVerificationAssign
                              }
                              permanentAddressDisabled={
                                permanentAddressDisabled
                              }
                              currentAddressDisabled={currentAddressDisabled}
                              workDisabled={workDisabled}
                              setCurrentOffice={setCurrentOffice}
                              userDetails={userDetails}
                              offices={offices}
                              fieldExecutives={fieldExecutives}
                              loading={loading}
                            />
                          )}
                        </Card>
                      );
                    })
                  : ["PermanentAddress", "CurrentAddress", "Work"].map(
                      (type) => {
                        const verification = selectedLoan?.verifications?.find(
                          (v: any) => v.type === type
                        );
                        return (
                          <Card
                            key={type}
                            title={type}
                            style={{
                              flex: 1,
                              height:
                                verification?.status === "Completed"
                                  ? "auto"
                                  : "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                            bodyStyle={{
                              flex:
                                verification?.status === "Completed"
                                  ? "none"
                                  : 1,
                              padding:
                                verification?.status === "Completed"
                                  ? "12px"
                                  : "24px",
                            }}
                            extra={
                              <>
                                {verification && (
                                  <Tag
                                    color={
                                      verification.status === "Completed"
                                        ? "green"
                                        : "blue"
                                    }
                                  >
                                    {verification.status}
                                  </Tag>
                                )}
                                <Switch
                                  checked={
                                    type === "PermanentAddress"
                                      ? !permanentAddressDisabled
                                      : type === "CurrentAddress"
                                        ? !currentAddressDisabled
                                        : !workDisabled
                                  }
                                  checkedChildren="Enabled"
                                  unCheckedChildren="Disabled"
                                  style={{ marginLeft: 8 }}
                                  onChange={(checked) => {
                                    if (type === "PermanentAddress") {
                                      setPermanentAddressDisabled(!checked);
                                    } else if (type === "CurrentAddress") {
                                      setCurrentAddressDisabled(!checked);
                                    } else if (type === "Work") {
                                      setWorkDisabled(!checked);
                                    }
                                  }}
                                />
                              </>
                            }
                          >
                            {verification && (
                              <div
                                style={{
                                  marginBottom:
                                    verification?.status === "Completed"
                                      ? 0
                                      : 16,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: 8,
                                  }}
                                >
                                  <span>Currently assigned to:</span>
                                  <Tag color="blue">
                                    {fieldExecutives?.find(
                                      (fe) =>
                                        fe.value ===
                                        verification.fieldExecutiveId
                                    )?.label || "-"}
                                  </Tag>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<EditOutlined />}
                                  >
                                    Edit
                                  </Button>
                                </div>
                                {verification?.status !== "Completed" && (
                                  <Divider style={{ margin: "8px 0" }} />
                                )}
                              </div>
                            )}
                            {verification?.status === "Completed" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "#52c41a",
                                  padding: "8px 0",
                                }}
                              >
                                <InfoCircleOutlined
                                  style={{ marginRight: 8 }}
                                />
                                Verification completed - No further updates
                                required
                              </div>
                            ) : (
                              <FieldAssignmentForm
                                verification={verification}
                                type={type}
                                selectedLoan={selectedLoan}
                                handleVerificationAssign={
                                  handleVerificationAssign
                                }
                                permanentAddressDisabled={
                                  permanentAddressDisabled
                                }
                                currentAddressDisabled={currentAddressDisabled}
                                workDisabled={workDisabled}
                                setCurrentOffice={setCurrentOffice}
                                userDetails={userDetails}
                                offices={offices}
                                fieldExecutives={fieldExecutives}
                                loading={loading}
                              />
                            )}
                          </Card>
                        );
                      }
                    )}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default LoanEditDrawer;
