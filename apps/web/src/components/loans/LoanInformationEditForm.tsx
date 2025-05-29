import React, { useContext } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  Space,
  message,
} from "antd";
import { UserContext } from "../layout/UserContextProvider";
import { createLoanApi, updateLoanApi } from "@/services/loans.services";
import {
  applicantTypeOptions,
  bankOptions,
  loanTypeOptions,
} from "@/utils/options";

interface LoanInfoFormProps {
  form: any;
  selectedLoan: any;
  setSelectedLoan: (loan: any) => void;
  setLoans: (updater: any) => void;
  setIsDrawerVisible: (visible: boolean) => void;
  setEditLoanInfo: (val: boolean) => void;
  loading: boolean;
  loans: any[];
  setLoading: (loading: boolean) => void;
}

const LoanInformationEditForm: React.FC<LoanInfoFormProps> = ({
  form,
  selectedLoan,
  setSelectedLoan,
  setLoans,
  setIsDrawerVisible,
  setEditLoanInfo,
  loading,
  loans,
  setLoading,
}) => {
  const { userDetails } = useContext(UserContext);

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        initialValues={
          selectedLoan
            ? {
                applicationNumber: selectedLoan.applicationNumber,
                applicantName: selectedLoan.applicantName,
                applicantMobile: selectedLoan.applicantMobile,
                loanAmount: selectedLoan.loanAmount,
                applicantAddress: selectedLoan.applicantAddress,
                loanType:
                  loanTypeOptions.find(
                    (option) =>
                      option.value.toLowerCase() ===
                      selectedLoan.loanType?.toLowerCase()
                  )?.value || selectedLoan.loanType,
                bankName:
                  bankOptions.find((option) =>
                    option.value
                      .toLowerCase()
                      .includes(selectedLoan.bankName?.toLowerCase() || "")
                  )?.value || selectedLoan.bankName,
              }
            : undefined
        }
        onFinish={async (values) => {
          try {
            setLoading(true);
            let result: any;
            if (!selectedLoan.id) {
              // Create new loan
              const loanData = {
                ...values,
                officeId: userDetails?.officeId,
                operationsExecutiveId: userDetails?.sub,
                applicationNumber: values.applicationNumber?.trim(),
                applicantName: values.applicantName?.trim(),
                applicantMobile: values.applicantMobile?.trim(),
                applicantAddress: values.applicantAddress?.trim(),
                loanType: values.loanType,
                bankName: values.bankName,
                loanAmount: Number(values.loanAmount),
              };

              result = await createLoanApi([loanData]);
              // Handle the new response format
              if (
                result.data.data.successful &&
                result.data.data.successful.length > 0
              ) {
                const createdLoan = result.data.data.successful[0];
                // Create a new loan object with the loanId as id
                const newLoan = {
                  ...loanData,
                  id: createdLoan.loanId,
                  applicationNumber: createdLoan.applicationNumber,
                  status: "Pending",
                  verifications: [],
                };
                setSelectedLoan(newLoan);
                // Add the new loan to the loans list
                setLoans((prevLoans: any) => [...prevLoans, newLoan]);
                message.success("Loan created successfully");
                setIsDrawerVisible(false);
              } else {
                message.error("Failed to create loan");
              }
            } else {
              // Update existing loan
              result = await updateLoanApi(selectedLoan.id, values);
              setLoans(
                loans.map((loan) =>
                  loan.id === selectedLoan.id ? result.data : loan
                )
              );
              message.success("Loan information updated");
            }
            setEditLoanInfo(false);
          } catch (error) {
            message.error(
              selectedLoan.id
                ? "Failed to update loan information"
                : "Failed to create loan"
            );
          } finally {
            setLoading(false);
          }
        }}
      >
        <Row gutter={8}>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Application Number"
              name="applicationNumber"
              rules={[
                { required: true, message: "Required" },
                { whitespace: true, message: "Cannot be empty" },
              ]}
            >
              <Input disabled={!!selectedLoan.id} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Applicant Name"
              name="applicantName"
              rules={[
                { required: true, message: "Required" },
                { whitespace: true, message: "Cannot be empty" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Mobile Number"
              name="applicantMobile"
              rules={[
                { required: true, message: "Required" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Loan Amount"
              name="loanAmount"
              rules={[
                { required: true, message: "Required" },
                {
                  type: "number",
                  message: "Please enter a valid amount",
                },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Address"
              name="applicantAddress"
              rules={[
                { required: true, message: "Required" },
                { whitespace: true, message: "Cannot be empty" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Loan Type"
              name="loanType"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select loan type"
                options={loanTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Bank Name"
              name="bankName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                showSearch
                placeholder="Select bank"
                options={bankOptions}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} style={{ padding: 4 }}>
            <Form.Item
              labelCol={{ span: 24, style: { marginBottom: 0 } }}
              label="Applicant Type"
              name="applicantType"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                // showSearch
                placeholder="Select Applicant Type"
                options={applicantTypeOptions}
                // filterOption={(input, option) =>
                //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                // }
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {selectedLoan.id ? "Save" : "Create Loan"}
            </Button>
            {selectedLoan.id && (
              <Button onClick={() => setEditLoanInfo(false)}>Cancel</Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoanInformationEditForm;
