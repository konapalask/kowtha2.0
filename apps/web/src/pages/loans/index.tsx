import { useContext, useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Typography,
  Form,
  Select,
  message,
  Card,
} from "antd";
import { EditOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
import { UserContext } from "@/components/layout/UserContextProvider";
// import type { UploadFile } from "antd/es/upload/interface";
// import * as XLSX from "xlsx";
import {
  getLoansApi,
  updateLoanApi,
  importLoansApi,
  type Loan,
} from "@/services/loans.services";
import { getOfficesApi, Office } from "@/services/settings.services";
import { getFieldExecutivesByOfficeIdApi } from "@/services/users.services";
import { colors } from "@/styles/colors";
import LoanEditDrawer from "@/components/loans/LoanEditDrawer";
import { bankOptions, loanTypeOptions } from "@/utils/options";
import BulkImportDrawer from "@/components/loans/BulkImportDrawer";
import ImportCsvModal from "@/components/loans/ImportCsvModal";

dayjs.extend(relativeTime);
interface FieldExecutive {
  id: number;
  name: string;
  value: number;
  label: string;
}

export default function Loans() {
  const [loading, setLoading] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [form] = Form.useForm();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [refresh, setRefresh] = useState(false);
  const { userDetails } = useContext(UserContext);
  const [isBulkImportDrawerVisible, setIsBulkImportDrawerVisible] =
    useState(false);
  const [bulkImportForm] = Form.useForm();
  const [currentOffice, setCurrentOffice] = useState<string>(
    userDetails?.officeId || ""
  );
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [sameAddress, setSameAddress] = useState(false);
  const [editLoanInfo, setEditLoanInfo] = useState(false);

  // Reset form when selected loan changes
  useEffect(() => {
    if (selectedLoan) {
      // Find the matching loan type option
      const matchingLoanType = loanTypeOptions.find(
        (option) =>
          option.value.toLowerCase() === selectedLoan.loanType?.toLowerCase()
      );

      // Find the matching bank option
      const matchingBank = bankOptions.find((option) =>
        option.value
          .toLowerCase()
          .includes(selectedLoan.bankName?.toLowerCase() || "")
      );

      form.setFieldsValue({
        applicationNumber: selectedLoan.applicationNumber,
        applicantName: selectedLoan.applicantName,
        applicantMobile: selectedLoan.applicantMobile,
        loanAmount: selectedLoan.loanAmount,
        applicantAddress: selectedLoan.applicantAddress,
        loanType: matchingLoanType?.value || selectedLoan.loanType,
        bankName: matchingBank?.value || selectedLoan.bankName,
      });
    }
  }, [selectedLoan, form]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const result = await getLoansApi();
        setLoans(result.data.data ?? []);
      } catch (error) {
        message.error("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [refresh]);

  // useEffect(() => {
  //   getExecutivesApi().then((res) => {
  //     const options = res?.data?.data?.map((item: any) => ({
  //       label: item.name,
  //       value: item.id,
  //     }))??[];
  //     setFieldExecutives(options);
  //   }).catch((err) => {
  //     // message.error("Failed to fetch field executives");
  //     console.log(err)
  //   });
  // }, []);

  useEffect(() => {
    getOfficesApi()
      .then((res) => {
        const options =
          res?.data?.map((item: any) => ({
            label: item.name,
            value: item.id,
          })) ?? [];
        setOffices(options);
      })
      .catch((err) => {
        // message.error("Failed to fetch offices");
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const result = await getFieldExecutivesByOfficeIdApi(currentOffice);
        const options =
          result?.data?.data?.map((item: any) => ({
            label: item.name,
            value: item.id,
          })) ?? [];
        setFieldExecutives(options);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExecutives();
  }, [currentOffice]);

  const handleImport = async (file: File) => {
    try {
      setLoading(true);
      await importLoansApi(file);
      message.success("Loans imported successfully");
      setIsImportModalVisible(false);
      setRefresh(!refresh);
    } catch (error) {
      message.error("Failed to import loans");
    } finally {
      setLoading(false);
    }
  };

  // const handleVerificationAssign = async (
  //   loanId: number,
  //   verificationType: string,
  //   values: {
  //     assignmentMethod: "Local" | "Remote";
  //     office?: string;
  //     assignee: string;
  //   }
  // ) => {
  //   const finalData = {
  //     ...values,
  //     verificationType,
  //     fieldExecutiveId: values.assignee,
  //   };
  //   try {
  //     setLoading(true);
  //     const result = await assignExecutivesApi(loanId, finalData);

  //     setLoans(
  //       loans.map((loan) => {
  //         if (loan.id === loanId) {
  //           const updatedVerifications = loan.verifications.map((v: any) =>
  //             v.type === verificationType ? { ...v, ...result.data } : v
  //           );
  //           return { ...loan, verifications: updatedVerifications };
  //         }
  //         return loan;
  //       })
  //     );

  //     message.success("Field executive assigned successfully");
  //   } catch (error) {
  //     message.error("Failed to assign field executive");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLoanInfoSave = async (values: any) => {
    try {
      setLoading(true);
      if (!selectedLoan) return;

      const result = await updateLoanApi(selectedLoan.id, values);
      setLoans(
        loans.map((loan) => (loan.id === selectedLoan.id ? result.data : loan))
      );
      setEditLoanInfo(false);
      message.success("Loan information updated");
    } catch (error) {
      message.error("Failed to update loan information");
    } finally {
      setLoading(false);
    }
  };

  // const handleBulkImport = async (values: any) => {
  //   console.log(values);
  //   try {
  //     setLoading(true);
  //     // Transform the form values into the required format
  //     const loansData = values.loans.map((loan: any) => ({
  //       ...loan,
  //       officeId: userDetails?.officeId,
  //       operationsExecutiveId: userDetails?.sub,
  //     }));
  //     console.log(loansData);

  //     const result = await createLoanApi(loansData);
  //     if (
  //       result.data.data.successful &&
  //       result.data.data.successful.length > 0
  //     ) {
  //       message.success(
  //         `Successfully created ${result.data.data.successfulCount} loans`
  //       );
  //       setIsBulkImportDrawerVisible(false);
  //       bulkImportForm.resetFields();
  //       setRefresh(!refresh);
  //     } else {
  //       message.error("Failed to create loans");
  //     }
  //   } catch (error) {
  //     message.error("Failed to create loans");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const columns: ColumnsType<Loan> = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      width: 200,
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
    },
    {
      title: "Mobile",
      dataIndex: "applicantMobile",
      key: "applicantMobile",
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Pending"
            ? "orange"
            : status === "Approved"
              ? "green"
              : status === "Rejected"
                ? "red"
                : "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => dayjs(date).fromNow(),
    },

    {
      title: <Typography.Text>Permanent Address</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "pavAssignee",
          render: (_, record: Loan) => {
            const pav = record?.verifications?.find(
              (v: any) => v.type === "PermanentAddress"
            );
            return pav ? pav?.fieldExecutive?.id : "-";
          },
          align: "center",
        },
        {
          title: "Status",
          key: "pavStatus",
          render: (_, record: Loan) => {
            const pav = record?.verifications?.find(
              (v: any) => v.type === "PermanentAddress"
            );
            return pav ? (
              <Tag color={pav.status === "Completed" ? "green" : "orange"}>
                {pav.status}
              </Tag>
            ) : (
              "-"
            );
          },
        },
      ],
    },
    {
      title: <Typography.Text>Current Address</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "cavAssignee",
          render: (_, record: Loan) => {
            const cav = record?.verifications?.find(
              (v: any) => v.type === "CurrentAddress"
            );
            return cav ? cav?.fieldExecutive?.id : "-";
          },
          align: "center",
        },
        {
          title: "Status",
          key: "cavStatus",
          render: (_, record: Loan) => {
            const cav = record?.verifications?.find(
              (v: any) => v.type === "CurrentAddress"
            );
            return cav ? (
              <Tag color={cav.status === "Completed" ? "green" : "orange"}>
                {cav.status}
              </Tag>
            ) : (
              "-"
            );
          },
        },
      ],
    },
    {
      title: <Typography.Text>Work</Typography.Text>,
      children: [
        {
          title: "Assignee",
          key: "wvAssignee",
          render: (_, record: Loan) => {
            const wv = record?.verifications?.find(
              (v: any) => v.type === "Work"
            );
            return wv ? wv?.fieldExecutive?.id : "-";
          },
          align: "center",
        },
        {
          title: "Status",
          key: "wvStatus",
          render: (_, record: Loan) => {
            const wv = record?.verifications?.find(
              (v: any) => v.type === "Work"
            );
            return wv ? (
              <Tag color={wv.status === "Completed" ? "green" : "orange"}>
                {wv.status}
              </Tag>
            ) : (
              "-"
            );
          },
        },
      ],
    },

    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedLoan(record);
            setIsDrawerVisible(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Card>
        <div
          className="flex-end"
          style={{ marginBottom: 16, display: "flex", gap: "8px" }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined style={{ fontSize: 16 }} />}
            onClick={() => {
              setSelectedLoan({} as Loan);
              setIsDrawerVisible(true);
            }}
          >
            New Loan
          </Button>
          <Button
            style={{
              color: colors.secondary.main,
              borderColor: colors.secondary.main,
            }}
            onClick={() => setIsBulkImportDrawerVisible(true)}
          >
            Bulk Add
          </Button>
          <Button
            type="link"
            icon={<UploadOutlined style={{ fontSize: 16 }} />}
            onClick={() => setIsImportModalVisible(true)}
          >
            CSV/Excel Import
          </Button>
        </div>

        <Table
          className="loans-table"
          columns={columns}
          dataSource={loans}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            position: ["bottomCenter"],
          }}
          size="small"
          scroll={{ x: 1500 }}
          sticky
        />
      </Card>

      <ImportCsvModal
        isImportModalVisible={isImportModalVisible}
        setIsImportModalVisible={setIsImportModalVisible}
        handleImport={handleImport}
      />

      <LoanEditDrawer
        selectedLoan={selectedLoan}
        setSelectedLoan={setSelectedLoan}
        isDrawerVisible={isDrawerVisible}
        setIsDrawerVisible={setIsDrawerVisible}
        sameAddress={sameAddress}
        setSameAddress={setSameAddress}
        editLoanInfo={editLoanInfo}
        setEditLoanInfo={setEditLoanInfo}
        form={form}
        loading={loading}
        setLoading={setLoading}
        setLoans={setLoans}
        loans={loans}
        fieldExecutives={fieldExecutives}
        setCurrentOffice={setCurrentOffice}
        offices={offices}
      />

      <BulkImportDrawer
        isBulkImportDrawerVisible={isBulkImportDrawerVisible}
        setIsBulkImportDrawerVisible={setIsBulkImportDrawerVisible}
        bulkImportForm={bulkImportForm}
        loading={loading}
        setLoading={setLoading}
        setRefresh={setRefresh}
      />

      {/* <Modal
  title="Import Loans"
  open={isImportModalVisible}
  onCancel={() => setIsImportModalVisible(false)}
  footer={null}
>
  <div style={{ marginBottom: 16 }}>
    <Text type="secondary">
      <InfoCircleOutlined /> The .csv/.xls/.xlsx file should contain the
      following columns:
    </Text>
    <ul>
      <li>applicationNumber (required)</li>
      <li>applicantName (required)</li>
      <li>applicantAddress (required)</li>
      <li>loanType (required)</li>
      <li>bankName (required)</li>
      <li>loanAmount (required)</li>
    </ul>
    <Text type="secondary">
      Maximum file size: 10MB
      <br />
      Maximum records: 5000
    </Text>
  </div>

  <Upload.Dragger
    accept=".csv,.xls,.xlsx"
    maxCount={1}
    beforeUpload={(file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        message.error("File size should not exceed 10MB");
        return false;
      }
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "csv" || ext === "xls" || ext === "xlsx") {
        handleImport(file);
      } else {
        message.error("Unsupported file format");
      }
      return false;
    }}
  >
    <p className="ant-upload-drag-icon">
      <UploadOutlined />
    </p>
    <p className="ant-upload-text">
      Click or drag file to this area to upload
    </p>
  </Upload.Dragger>
</Modal> */}

      {/* <Drawer
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
                                .includes(
                                  selectedLoan.bankName?.toLowerCase() || ""
                                )
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
                          setLoans((prevLoans) => [...prevLoans, newLoan]);
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
                            message:
                              "Please enter a valid 10-digit mobile number",
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
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        {selectedLoan.id ? "Save" : "Create Loan"}
                      </Button>
                      {selectedLoan.id && (
                        <Button onClick={() => setEditLoanInfo(false)}>
                          Cancel
                        </Button>
                      )}
                    </Space>
                  </Form.Item>
                </Form>
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
                            <Form
                              layout="vertical"
                              initialValues={
                                verification
                                  ? {
                                      assignmentMethod:
                                        verification?.assignmentMethod,
                                      office: verification?.office,
                                      assignee: verification?.assignee,
                                    }
                                  : {
                                      assignmentMethod: "Local",
                                    }
                              }
                              onFinish={(values) =>
                                handleVerificationAssign(
                                  selectedLoan.id,
                                  type,
                                  values
                                )
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
                                      setCurrentOffice(
                                        userDetails?.officeId || ""
                                      );
                                    }
                                  }}
                                >
                                  <Radio.Button value="Local">
                                    Local
                                  </Radio.Button>
                                  <Radio.Button value="Remote">
                                    Remote
                                  </Radio.Button>
                                </Radio.Group>
                              </Form.Item>
                              <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) =>
                                  prevValues?.assignmentMethod !==
                                  currentValues?.assignmentMethod
                                }
                              >
                                {({ getFieldValue }) => {
                                  const assignmentMethod =
                                    getFieldValue("assignmentMethod");
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
                                  prevValues?.assignmentMethod !==
                                    currentValues?.assignmentMethod ||
                                  prevValues?.office !== currentValues?.office
                                }
                              >
                                {({ getFieldValue }) => {
                                  const assignmentMethod =
                                    getFieldValue("assignmentMethod");
                                  const office = getFieldValue("office");
                                  return (
                                    <Form.Item
                                      name="assignee"
                                      label="Assign Field Executive"
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please select a field executive",
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
                                  {verification
                                    ? "Update Assignment"
                                    : "Assign Executive"}
                                </Button>
                              </Form.Item>
                            </Form>
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
                              <Form
                                layout="vertical"
                                initialValues={
                                  verification
                                    ? {
                                        assignmentMethod:
                                          verification.assignmentMethod,
                                        office: verification.office,
                                        assignee: verification.assignee,
                                      }
                                    : {
                                        assignmentMethod: "Local",
                                      }
                                }
                                onFinish={(values) =>
                                  handleVerificationAssign(
                                    selectedLoan.id,
                                    type,
                                    values
                                  )
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
                                      message:
                                        "Please select assignment method",
                                    },
                                  ]}
                                >
                                  <Radio.Group
                                    onChange={(e) => {
                                      if (e.target.value === "Local") {
                                        setCurrentOffice(
                                          userDetails?.officeId || ""
                                        );
                                      }
                                    }}
                                  >
                                    <Radio.Button value="Local">
                                      Local
                                    </Radio.Button>
                                    <Radio.Button value="Remote">
                                      Remote
                                    </Radio.Button>
                                  </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                  noStyle
                                  shouldUpdate={(prevValues, currentValues) =>
                                    prevValues?.assignmentMethod !==
                                    currentValues?.assignmentMethod
                                  }
                                >
                                  {({ getFieldValue }) => {
                                    const assignmentMethod =
                                      getFieldValue("assignmentMethod");
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
                                    prevValues?.assignmentMethod !==
                                      currentValues?.assignmentMethod ||
                                    prevValues?.office !== currentValues?.office
                                  }
                                >
                                  {({ getFieldValue }) => {
                                    const assignmentMethod =
                                      getFieldValue("assignmentMethod");
                                    const office = getFieldValue("office");
                                    return (
                                      <Form.Item
                                        name="assignee"
                                        label="Assign Field Executive"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Please select a field executive",
                                          },
                                        ]}
                                      >
                                        <Select
                                          placeholder="Select field executive"
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
                                    {verification
                                      ? "Update Assignment"
                                      : "Assign Executive"}
                                  </Button>
                                </Form.Item>
                              </Form>
                            )}
                          </Card>
                        );
                      }
                    )}
              </div>
            </div>
          </>
        )}
      </Drawer> */}

      {/* Bulk Import Drawer */}
      {/* <Drawer
        title="Bulk Import Loans"
        placement="right"
        width={"100%"}
        onClose={() => {
          setIsBulkImportDrawerVisible(false);
          bulkImportForm.resetFields();
        }}
        bodyStyle={{ padding: "16px" }}
        open={isBulkImportDrawerVisible}
        maskClosable={false}
        footer={
          <div style={{ textAlign: "right", padding: "10px" }}>
            <Space>
              <Button
                type="primary"
                loading={loading}
                onClick={() => bulkImportForm.submit()}
              >
                Create Loans
              </Button>
              <Button
                onClick={() => {
                  setIsBulkImportDrawerVisible(false);
                  bulkImportForm.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={bulkImportForm}
          onFinish={handleBulkImport}
          layout="vertical"
        >
          <Form.List name="loans">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <Row gutter={[8, 8]} align="middle" wrap={false}>
                      <Col xs={24} md={4} lg={4} xl={4} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "applicationNumber"]}
                          label="Application Number"
                          rules={[
                            { required: true, message: "Required" },
                            { whitespace: true, message: "Cannot be empty" },
                          ]}
                        >
                          <Input style={{ height: "32px" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={5} lg={3} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "applicantName"]}
                          label="Applicant Name"
                          rules={[
                            { required: true, message: "Required" },
                            { whitespace: true, message: "Cannot be empty" },
                          ]}
                        >
                          <Input style={{ height: "32px" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4} lg={4} xl={3} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "applicantMobile"]}
                          label="Mobile Number"
                          rules={[
                            { required: true, message: "Required" },
                            {
                              pattern: /^[0-9]{10}$/,
                              message:
                                "Please enter a valid 10-digit mobile number",
                            },
                          ]}
                        >
                          <Input
                            maxLength={10}
                            style={{ height: "32px" }}
                            addonBefore={"+91"}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={7} lg={6} xl={6} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "applicantAddress"]}
                          label="Address"
                          rules={[
                            { required: true, message: "Required" },
                            { whitespace: true, message: "Cannot be empty" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4} lg={3} xl={2} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "loanType"]}
                          label="Loan Type"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select
                            placeholder="Select loan type"
                            options={loanTypeOptions}
                            style={{ height: "32px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6} lg={5} xl={5} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "bankName"]}
                          label="Bank Name"
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
                            style={{ height: "32px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={3} lg={2} xl={2} style={{ padding: 4 }}>
                        <Form.Item
                          {...restField}
                          labelCol={{ span: 24, style: { marginBottom: 0 } }}
                          name={[name, "loanAmount"]}
                          label="Loan Amount"
                          rules={[
                            { required: true, message: "Required" },
                            {
                              type: "number",
                              message: "Please enter a valid amount",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: "100%", height: "32px" }}
                            addonAfter={"₹"}
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        md={3}
                        lg={2}
                        xl={2}
                        style={{
                          padding: "0 4px 0 4px",
                          display: "flex",
                          alignContent: "end",
                        }}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    style={{ maxWidth: 500 }}
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Loan
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Drawer> */}
      <style jsx global>{`
        .ant-form-item {
          margin-bottom: 12px !important;
        }
      `}</style>
    </DashboardLayout>
  );
}
