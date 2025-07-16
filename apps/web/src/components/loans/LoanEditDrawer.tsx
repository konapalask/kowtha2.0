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
import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { bankOptions, loanTypeOptions } from "@/utils/options";
import FieldAssignmentForm from "./FieldAssignmentForm";
import LoanInformationEditForm from "./LoanInformationEditForm";
import {
  assignExecutivesApi,
  deleteFieldAssignmentApi,
  getLoansByIdApi,
} from "@/services/loans.services";
import { getUserDetails } from "@/utils/utility";
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
}) => {
  const [form] = Form.useForm();
  const userDetails = getUserDetails();
  const [selectedLoan, setSelectedLoan] = useState<string | null>(loanId);
  // const [address1Disabled, setAddress1Disabled] = useState<boolean>(false);
  // const [address2Disabled, setAddress2Disabled] = useState<boolean>(false);
  // const [workDisabled, setWorkDisabled] = useState<boolean>(false);
  // const [businessDisabled, setBusinessDisabled] = useState<boolean>(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [fieldExecutiveEdit, setFieldExecutiveEdit] = useState<
    Record<string, boolean>
  >({
    Address1: false,
    Address2: false,
    Work: false,
    Business: false,
  });

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

  const handleClose = () => {
    setIsDrawerVisible(false);
    form.resetFields();
    setLoanDetails(null);
    setSelectedLoan(null);
    setEditLoanInfo(false);
    setLoanDetails(null);
    setFieldExecutiveEdit({
      Address1: false,
      Address2: false,
      Work: false,
      Business: false,
    });
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
                </Descriptions>
              )}
            </div>

            {loanDetails?.id && (
              <>
                <Row style={{ display: "flex" }} gutter={[8, 8]}>
                  {[
                    { type: "AddressOne", label: "Address 1" },
                    { type: "AddressTwo", label: "Address 2" },
                    { type: "Work", label: "Work" },
                    { type: "Business", label: "Business" },
                  ].map(({ type, label }) => {
                    const verification = loanDetails?.verifications?.find(
                      (v: any) => v.type === type
                    );
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
                                  color={
                                    verification?.isPostponed
                                      ? "volcano"
                                      : verification.status === "Completed"
                                        ? "green"
                                        : "orange"
                                  }
                                >
                                  {verification?.isPostponed
                                    ? "Postponed"
                                    : verification.status}
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
                                {verification?.status === "Pending" &&
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
                                        Business Name:{" "}
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
                            />
                          )}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default LoanEditDrawer;
