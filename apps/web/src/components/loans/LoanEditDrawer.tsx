import {
  Drawer,
  Tag,
  Typography,
  Button,
  Card,
  Descriptions,
  Switch,
} from "antd";
import {
  CloseOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import React, { useContext, useState } from "react";
import { bankOptions, loanTypeOptions } from "@/utils/options";
import { UserContext } from "../layout/UserContextProvider";
import FieldAssignmentForm from "./FieldAssignmentForm";
import LoanInformationEditForm from "./LoanInformationEditForm";

interface LoanEditProps {
  selectedLoan: any;
  setSelectedLoan: (loan: any) => void;
  isDrawerVisible: boolean;
  setIsDrawerVisible: (visible: boolean) => void;
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
  verifiers?: any[];
  fetchLoans: () => void;
  setRefresh: (refresh: boolean) => void;
}

const LoanEditDrawer: React.FC<LoanEditProps> = ({
  selectedLoan,
  setSelectedLoan,
  isDrawerVisible,
  setIsDrawerVisible,
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
  verifiers = [],
  fetchLoans,
  setRefresh,
}) => {
  const { userDetails } = useContext(UserContext);
  const [address1Disabled, setAddress1Disabled] = useState(false);
  const [address2Disabled, setAddress2Disabled] = useState(false);
  const [workDisabled, setWorkDisabled] = useState(false);
  const [businessDisabled, setBusinessDisabled] = useState(false);
  const [fieldExecutiveEdit, setFieldExecutiveEdit] = useState<
    Record<string, boolean>
  >({
    Address1: false,
    Address2: false,
    Work: false,
    Business: false,
  });

  // useEffect(()=> {

  // })
  function hasVerificationType( type:string) {
    return selectedLoan.verifications?.some((v:any) => v.type === type) || false;
  }
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
        width="90%"
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedLoan(null);
          setEditLoanInfo(false);
        }}
        open={isDrawerVisible}
        maskClosable={false}
        destroyOnClose
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
                  fetchLoans={fetchLoans}
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
                  {/* <Descriptions.Item label="Address">
                    {selectedLoan?.applicantAddress}
                  </Descriptions.Item> */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Typography.Title level={4} style={{ margin: 0 }}>Verifications</Typography.Title>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {!hasVerificationType("AddressOne") && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Address 1:</span>
                    <Switch
                      checked={!address1Disabled}
                      checkedChildren="Enabled"
                      unCheckedChildren="Disabled"
                      onChange={(checked) => setAddress1Disabled(!checked)}
                    />
                  </div>}
                  {!hasVerificationType("AddressTwo") && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Address 2:</span>
                    <Switch
                      checked={!address2Disabled}
                      checkedChildren="Enabled"
                      unCheckedChildren="Disabled"
                      onChange={(checked) => setAddress2Disabled(!checked)}
                    />
                    </div>}
                  {!hasVerificationType("Work") && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Work:</span>
                    <Switch
                      checked={!workDisabled}
                      checkedChildren="Enabled"
                      unCheckedChildren="Disabled"
                      onChange={(checked) => setWorkDisabled(!checked)}
                    />
                  </div>}
                  {!hasVerificationType("Business") && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Business:</span>
                    <Switch
                      checked={!businessDisabled}
                      checkedChildren="Enabled"
                      unCheckedChildren="Disabled"
                      onChange={(checked) => setBusinessDisabled(!checked)}
                    />
                  </div>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { type: "AddressOne", label: "Address 1", disabled: address1Disabled },
                  { type: "AddressTwo", label: "Address 2", disabled: address2Disabled },
                  { type: "Work", label: "Work", disabled: workDisabled },
                  { type: "Business", label: "Business", disabled: businessDisabled }
                ].filter(item => !item.disabled).map(({ type, label }) => {
                  const verification = selectedLoan?.verifications?.find(
                    (v: any) => v.type === type
                  );
                  return (
                    <Card
                      key={type}
                      title={label}
                      style={{
                        flex: 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      bodyStyle={{
                        flex: verification?.status === "Completed" ? "none" : 1,
                        padding: 12
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
                        </>
                      }
                    >
                      {verification && (
                        <div
                          style={{
                            marginBottom: 0
                          }}
                        >
                          <div className="flex-end">
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
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "left",
                              gap: "8px",
                              marginBottom: 8,
                            }}
                          >
                            <div style={{display:"flex",alignItems:"left",gap:"8px", flexDirection:"row"}}>
                              <span>Field Executive:</span>
                              <Tag color="blue">
                                Id: {verification.fieldExecutive?.employeeCode}
                              </Tag>
                            </div>
                            <div style={{display:"flex",alignItems:"left",gap:"8px", flexDirection:"row"}}>
                              <span>Verifier:</span>
                              <Tag color="blue">
                                Id: {verification.verifier?.employeeCode}
                              </Tag>    
                            </div>                       
                          </div>
                        </div>
                      )}
                      {verification?.status === "Completed" && (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#52c41a",
                            padding: "8px 0",
                          }}
                        >
                          <InfoCircleOutlined style={{ marginRight: 8 }} />
                          Verification completed - No further updates required
                        </div>
                      )}
                      {(!verification || fieldExecutiveEdit[type]) && (
                        <FieldAssignmentForm
                          verification={verification}
                          type={type}
                          selectedLoan={selectedLoan}
                          address1Disabled={address1Disabled}
                          address2Disabled={address2Disabled}
                          workDisabled={workDisabled}
                          businessDisabled={businessDisabled}
                          setCurrentOffice={setCurrentOffice}
                          userDetails={userDetails}
                          offices={offices}
                          fieldExecutives={fieldExecutives}
                          loading={loading}
                          setLoading={setLoading}
                          verifiers={verifiers}
                          fetchLoans={fetchLoans}
                          setRefresh={setRefresh}
                        />
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default LoanEditDrawer;
