import {
  Drawer,
  Tag,
  Typography,
  Button,
  Card,
  Descriptions,
  Select,
  Checkbox,
  message,
  Form,
  Popconfirm,
  Row,
  Col,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { bankOptions, loanTypeOptions, pdBankOptions } from "@/utils/options";
import FieldAssignmentForm from "./FieldAssignmentForm";
import LoanInformationEditForm from "./LoanInformationEditForm";
import {
  assignExecutivesApi,
  deleteFieldAssignmentApi,
  getLoansByIdApi,
  reassignLoanApi,
} from "@/services/loans.services";
import { getUserDetails, getCurrentDepartment } from "@/utils/utility";
import dayjs from "dayjs";

interface LoanDetails {
  id: number;
  applicationNumber: string;
  applicantName: string;
  applicantMobile: string;
  loanAmount: string;
  loanType: string;
  bankName: string;
  applicantType: string;
  status: string;
  verifierId?: string;
  verifications?: any[];
  pdEmailLogs?: Array<{
    id: number;
    subject: string;
    body: string;
    fromEmail: string[];
    toEmail: string[];
    ccEmail: string[];
    receivedAt: string | null;
    createdAt: string;
  }>;
  [key: string]: any;
}

interface LoanEditProps {
  loanId: string | null; // This is now the applicationNumber
  isDrawerVisible: boolean;
  setIsDrawerVisible: (visible: boolean) => void;
  editLoanInfo: boolean;
  setEditLoanInfo: (val: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setLoans: any;
  loans: any[];
  fieldExecutives?: any[];
  setCurrentOffice?: (officeId: string) => void;
  offices?: any[];
  verifiers?: any[];
  fetchLoans: () => void;
  setRefresh: (refresh: boolean) => void;
  fetchExecutives: any;
  pdBankOptions: any;
  templateOptions: any[];
  verificationExecutives?: any[];
}

const LoanEditDrawer: React.FC<LoanEditProps> = ({
  loanId,
  isDrawerVisible,
  setIsDrawerVisible,
  editLoanInfo,
  setEditLoanInfo,
  loading,
  setLoading,
  setLoans,
  loans,
  fieldExecutives = [],
  setCurrentOffice = () => {},
  offices = [],
  verifiers = [],
  fetchLoans,
  setRefresh,
  fetchExecutives,
  pdBankOptions,
  templateOptions,
  verificationExecutives = [],
}) => {
  const [form] = Form.useForm();
  const userDetails = getUserDetails();
  const [currentDepartment, setCurrentDepartment] = useState(
    getCurrentDepartment()
  );
  console.log("LoanEditDrawer - Current department:", currentDepartment);

  // Watch for department changes
  useEffect(() => {
    const checkDepartment = () => {
      const dept = getCurrentDepartment();
      if (dept !== currentDepartment) {
        setCurrentDepartment(dept);
      }
    };

    // Check immediately
    checkDepartment();

    // Set up interval to check for changes
    const interval = setInterval(checkDepartment, 1000);

    return () => clearInterval(interval);
  }, [currentDepartment]);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(loanId);
  // const [address1Disabled, setAddress1Disabled] = useState<boolean>(false);
  // const [address2Disabled, setAddress2Disabled] = useState<boolean>(false);
  // const [workDisabled, setWorkDisabled] = useState<boolean>(false);
  // const [businessDisabled, setBusinessDisabled] = useState<boolean>(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [fieldExecutiveEdit, setFieldExecutiveEdit] = useState<
    Record<string, boolean>
  >(
    currentDepartment === "PD"
      ? { Business: false }
      : {
          Address1: false,
          Address2: false,
          Work: false,
          Business: false,
        }
  );

  useEffect(() => {
    if (loanId) {
      setSelectedLoan(loanId);
    }
  }, []);

  const fetchLoanDetails = async () => {
    if (!selectedLoan) return;
    try {
      setLoading(true);
      const result = await getLoansByIdApi(selectedLoan);
      const loanData = result?.data?.data?.items?.[0];
      if (loanData) {
        setLoanDetails(loanData);
      }
    } catch (error) {
      console.error("Error fetching loan details:", error);
      message.error("Failed to fetch loan details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLoan) {
      fetchLoanDetails();
    }
  }, [selectedLoan]);

  // function hasVerificationType(type: string) {
  //   return (
  //     loanDetails?.verifications?.some((v: any) => v.type === type) || false
  //   );
  // }

  const handleVerifierSelect = async (value: string) => {
    if (!loanDetails?.id) return;

    try {
      setLoading(true);
      await assignExecutivesApi(loanDetails.id, {
        verifierId: value,
      });
      message.success("Verifier assigned successfully");
      fetchLoanDetails();
      setRefresh(true);
    } catch (error) {
      message.error("Failed to assign verifier");
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async () => {
    if (!loanDetails?.id) return;

    try {
      setLoading(true);
      console.log("Reassigning loan:", loanDetails.id);
      await reassignLoanApi(loanDetails.id);
      message.success("Loan reassigned successfully");
      setRefresh(true);
    } catch (error) {
      console.error("Error reassigning loan:", error);
      message.error("Failed to reassign loan");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsDrawerVisible(false);
    form.resetFields();
    setLoanDetails(null);
    setSelectedLoan(null);
    setEditLoanInfo(false);
    setLoanDetails(null);
    setFieldExecutiveEdit(
      currentDepartment === "PD"
        ? { Business: false }
        : {
            Address1: false,
            Address2: false,
            Work: false,
            Business: false,
          }
    );
    fetchLoans();
  };

  const handleDelete = async (
    loanId: number,
    type: string,
    fieldExecutiveId: number
  ) => {
    await deleteFieldAssignmentApi(loanId, type, { fieldExecutiveId })
      .then((response) => {
        message.success(response?.data?.message);
        fetchLoanDetails();
      })
      .catch((error) => console.log(`Error:${error}`));
  };

  const handleSaveAndClose = () => {
    if (editLoanInfo) {
      form.submit();
    }
    handleClose();
  };

  return (
    <div>
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span>
              {loanDetails?.id
                ? `Loan Details - ${loanDetails.applicationNumber}`
                : "New Loan"}{" "}
              {loanDetails?.status && (
                <Tag
                  color={
                    loanDetails.status === "Pending"
                      ? "orange"
                      : loanDetails.status === "Approved"
                        ? "green"
                        : loanDetails.status === "Rejected"
                          ? "red"
                          : loanDetails.status === "BackendCompleted"
                            ? "cyan"
                            : loanDetails.status === "FieldVerificationComplete"
                              ? "green"
                              : loanDetails.status === "FieldVerificationStarted"
                                ? "blue"
                                : "default"
                  }
                  style={{ marginLeft: 8 }}
                >
                  {(() => {
                    switch (loanDetails.status) {
                      case "Pending":
                        return "Unassigned";
                      case "Assigned":
                        return "Assigned";
                      case "FieldVerificationStarted":
                        return "Under FV";
                      case "FieldVerificationComplete":
                        return "FV Completed";
                      case "BackendCompleted":
                        return "Backend Completed";
                      case "Approved":
                        return "Approved";
                      case "Rejected":
                        return "Rejected";
                      default:
                        return loanDetails.status;
                    }
                  })()}
                </Tag>
              )}
            </span>
            {loanDetails?.id && currentDepartment === "PD" && (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleReassign}
                loading={loading}
                style={{ marginLeft: 16 }}
              >
                Reassign
              </Button>
            )}
          </div>
        }
        placement="right"
        width="99%"
        onClose={handleClose}
        open={isDrawerVisible}
        // maskClosable={false}
        destroyOnClose
        footer={
          <div className="flex-end">
            <Button onClick={handleSaveAndClose} type="primary">
              Close
            </Button>
          </div>
        }
      >
        {(selectedLoan || !loanDetails?.id) && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {!editLoanInfo && loanDetails?.id && (
                  <Button
                    type="link"
                    onClick={() => {
                      setEditLoanInfo(true);
                      if (loanDetails) {
                        const matchingLoanType = loanTypeOptions.find(
                          (option) =>
                            option.value.toLowerCase() ===
                            loanDetails.loanType?.toLowerCase()
                        );

                        // const matchingBank = bankOptions.find((option) =>
                        //   option.value
                        //     .toLowerCase()
                        //     .includes(loanDetails.bankName?.toLowerCase() || "")
                        // );

                        form.setFieldsValue({
                          applicationNumber: loanDetails.applicationNumber,
                          applicantName: loanDetails.applicantName,
                          applicantMobile: loanDetails.applicantMobile,
                          loanAmount: loanDetails.loanAmount,
                          applicantAddress: loanDetails.applicantAddress,
                          loanType:
                            matchingLoanType?.value || loanDetails.loanType,
                          bankName: loanDetails.bankName,
                          applicantType: loanDetails.applicantType,
                          loanTag: loanDetails.loanTag || undefined,
                          branch: loanDetails.branch || undefined,
                        });
                      }
                    }}
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                )}
              </div>
              {!loanDetails?.id || editLoanInfo ? (
                <LoanInformationEditForm
                  form={form}
                  selectedLoan={loanDetails}
                  setSelectedLoan={setSelectedLoan}
                  setEditLoanInfo={setEditLoanInfo}
                  loading={loading}
                  setLoading={setLoading}
                  fetchLoanDetails={fetchLoanDetails}
                  pdBankOptions={pdBankOptions}
                  templateOptions={templateOptions}
                />
              ) : (
                <Descriptions
                  className="loan-details-descriptions"
                  bordered
                  size="small"
                  column={{ xxl: 4, xl: 4, lg: 4, md: 2, sm: 1, xs: 1 }}
                >
                  <Descriptions.Item label="Application Number">
                    {loanDetails?.applicationNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Applicant Name">
                    {loanDetails?.applicantName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mobile Number">
                    {loanDetails?.applicantMobile}
                  </Descriptions.Item>
                  {loanDetails?.loanAmount && (
                    <Descriptions.Item label="Loan Amount">
                      {loanDetails?.loanAmount}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Loan Type">
                    {loanDetails?.loanType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bank Name">
                    {loanDetails?.bankName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Applicant Type">
                    {loanDetails?.applicantType}
                  </Descriptions.Item>
                  {currentDepartment === "PD" && (
                    <Descriptions.Item label="Template Name">
                      {loanDetails?.templateName}
                    </Descriptions.Item>
                  )}
                  {loanDetails?.loanTag && (
                    <Descriptions.Item label="Loan Tag">
                      <Tag color={loanDetails.loanTag === "PD" ? "blue" : "purple"}>
                        {loanDetails.loanTag}
                      </Tag>
                    </Descriptions.Item>
                  )}
                  {loanDetails?.branch && (
                    <Descriptions.Item label="Branch">
                      {loanDetails.branch}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              )}
            </div>

            {loanDetails?.id && (
              <>
                <Row style={{ display: "flex" }} gutter={[8, 8]}>
                  {(currentDepartment === "PD"
                    ? [{ type: "Business", label: "Business" }]
                    : [
                        { type: "AddressOne", label: "Address 1" },
                        { type: "AddressTwo", label: "Address 2" },
                        { type: "Work", label: "Work" },
                        { type: "Business", label: "Business" },
                      ]
                  ).map(({ type, label }) => {
                    const verification = loanDetails?.verifications?.find(
                      (v: any) => v.type === type
                    );
                      const isPostponed =
                        verification?.isPostponed === true &&
                        verification?.status === "Pending";
                      const statusLabel = isPostponed
                        ? "Postponed"
                        : verification?.status;
                      const statusColor = isPostponed
                        ? "volcano"
                        : verification?.status === "Completed"
                          ? "green"
                          : "orange";
                    return (
                      <Col md={12} lg={12} xl={12} xxl={12} key={type}>
                        <Card
                          size={"small"}
                          title={label}
                          style={{
                            flex: 1,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          headStyle={{
                            minHeight: 40,
                            paddingLeft: 10,
                            paddingRight: 0,
                            border: "none",
                            fontWeight: 400,
                          }}
                          bodyStyle={{
                            flex:
                              verification?.status === "Completed" ? "none" : 1,
                            padding: 12,
                          }}
                          extra={
                            <>
                              {verification && (
                                <Tag
                                  color={statusColor}
                                >
                                  {statusLabel}
                                </Tag>
                              )}
                            </>
                          }
                        >
                          {verification && (
                            <div style={{ marginBottom: 0 }}>
                              <div
                                // className="flex-end"
                                style={{
                                  justifyContent: "space-between",
                                  display: "flex",
                                }}
                              >
                                {((verification?.status === "Pending") ||
                                  (currentDepartment === "PD" && verification)) &&
                                  (fieldExecutiveEdit[type] ? (
                                    <Button
                                      danger
                                      type="link"
                                      size="small"
                                      icon={<CloseOutlined />}
                                      onClick={() =>
                                        setFieldExecutiveEdit((prev) => ({
                                          ...prev,
                                          [type]: false,
                                        }))
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  ) : (
                                    <Button
                                      type="link"
                                      size="small"
                                      icon={<EditOutlined />}
                                      onClick={() => {
                                        setFieldExecutiveEdit((prev) => ({
                                          ...prev,
                                          [type]: true,
                                        }));
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  ))}
                                {verification &&
                                  verification?.status === "Pending" && (
                                    <Popconfirm
                                      title="Are you sure you want to delete"
                                      onConfirm={() =>
                                        handleDelete(
                                          verification?.loanId,
                                          verification?.type,
                                          verification?.fieldExecutiveId
                                        )
                                      }
                                    >
                                      <Button
                                        icon={<DeleteOutlined />}
                                        style={{
                                          border: "none",
                                          color: "#ff4d4f",
                                          boxShadow: "none",
                                        }}
                                      />
                                    </Popconfirm>
                                  )}
                              </div>
                              {!fieldExecutiveEdit[type] && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "left",
                                    gap: "8px",
                                    marginBottom: 8,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "left",
                                      gap: "8px",
                                      flexDirection: "column",
                                    }}
                                  >
                                    {verification?.isPostponed && (
                                      <span>
                                        Postponed to:{" "}
                                        {dayjs(
                                          verification?.postponedDate
                                        ).format("MMM DD,YYYY")}
                                      </span>
                                    )}
                                    {verification?.isPostponed &&
                                      verification?.postponedReason && (
                                        <span>
                                          Reason:{" "}
                                          {verification?.postponedReason}
                                        </span>
                                      )}
                                    {type === "Business" && (
                                      <span>
                                        Business Name:{" "}
                                        {verification?.businessName}
                                      </span>
                                    )}
                                    {type === "Work" && (
                                      <span>
                                        Office Name:{" "}
                                        {verification?.currentOfficeName}
                                      </span>
                                    )}
                                    <span>
                                      Address: {verification?.applicantAddress}
                                    </span>
                                    <span>
                                      FE:{" "}
                                      <Typography.Text
                                        style={{ marginRight: 5 }}
                                      >
                                        {verification?.fieldExecutive?.name}
                                      </Typography.Text>
                                      <Tag color="blue">
                                        {
                                          verification.fieldExecutive
                                            ?.employeeCode
                                        }
                                      </Tag>
                                    </span>
                                    <span>
                                      Mobile:{" "}
                                      {verification?.fieldExecutive?.mobile}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {currentDepartment === "PD" && (fieldExecutiveEdit[type]? <div style={{ marginTop: 8 }}></div> : (
                                <div style={{ marginTop: 8 }}>
                                  <span>Verification Executive:</span>{" "}
                                  {verification?.assistantVerifier?.name ||
                                    "Not assigned"}
                                </div>
                              ))}
                              {fieldExecutiveEdit[type] ? (
                                <div style={{ marginTop: 8 }}></div>
                              ) : (
                                <div style={{ marginTop: 8 }}>
                                  <span>Verifier:</span>{" "}
                                  {verification?.verifier?.name ||
                                    "Not assigned"}
                                </div>
                              )}
                            </div>
                          )}
                          {(!verification || fieldExecutiveEdit[type]) && (
                            <FieldAssignmentForm
                              verification={verification}
                              type={type}
                              selectedLoan={loanDetails}
                              setCurrentOffice={setCurrentOffice}
                              userDetails={userDetails}
                              offices={offices}
                              fieldExecutives={fieldExecutives}
                              loading={loading}
                              setLoading={setLoading}
                              verifiers={verifiers}
                              fetchLoans={fetchLoanDetails}
                              setRefresh={setRefresh}
                              setFieldExecutiveEdit={setFieldExecutiveEdit}
                              fetchExecutives={fetchExecutives}
                              verificationExecutives={verificationExecutives}
                              isFVCompleted={loanDetails?.status === "FVCompleted" || loanDetails?.status === "BackendCompleted"}
                            />
                          )}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </>
            )}

            {/* PD Email Section */}
            {currentDepartment === "PD" &&
              loanDetails?.pdEmailLogs &&
              loanDetails.pdEmailLogs.length > 0 && (
                <Card
                  title="PD Email"
                  style={{ marginTop: 16 }}
                  size="small"
                >
                  {loanDetails.pdEmailLogs.map((emailLog, index) => (
                    <div key={emailLog.id} style={{ marginBottom: index < loanDetails.pdEmailLogs!.length - 1 ? 16 : 0 }}>
                      <Descriptions column={1} size="small" bordered>
                        <Descriptions.Item label="Subject">
                          {emailLog.subject}
                        </Descriptions.Item>
                        <Descriptions.Item label="From">
                          {emailLog.fromEmail.join(", ")}
                        </Descriptions.Item>
                        {emailLog.toEmail.length > 0 && (
                          <Descriptions.Item label="To">
                            {emailLog.toEmail.join(", ")}
                          </Descriptions.Item>
                        )}
                        {emailLog.ccEmail.length > 0 && (
                          <Descriptions.Item label="CC">
                            {emailLog.ccEmail.join(", ")}
                          </Descriptions.Item>
                        )}
                        {emailLog.receivedAt && (
                          <Descriptions.Item label="Received">
                            {dayjs(emailLog.receivedAt).format(
                              "MMM DD, YYYY HH:mm"
                            )}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                      <div
                        style={{
                          marginTop: 12,
                          padding: 12,
                          backgroundColor: "#ffffff",
                          border: "1px solid #e8e8e8",
                          borderRadius: 4,
                          maxHeight: 400,
                          overflowY: "auto",
                          wordBreak: "break-word",
                          fontSize: 14,
                          lineHeight: 1.6,
                          whiteSpace: "pre-wrap",
                          color: "#333",
                        }}
                      >
                        {emailLog.body || <span style={{ color: "#999" }}>No email body content</span>}
                      </div>
                    </div>
                  ))}
                </Card>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default LoanEditDrawer;
