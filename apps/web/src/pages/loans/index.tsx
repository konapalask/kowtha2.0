import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Modal,
  Form,
  Input,
  Upload,
  Drawer,
  Descriptions,
  Select,
  message,
  Card,
  Radio,
  Checkbox,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import * as XLSX from "xlsx";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;

interface Verification {
  id: number;
  type: "Permanent Address" | "Current Address" | "Work";
  assignmentMethod: "Local" | "Remote";
  office?: string;
  assignee: string;
  status: "Pending" | "In Progress" | "Completed";
}

interface Loan {
  id: number;
  applicationNumber: string;
  applicantName: string;
  applicantPhone: string;
  applicantAddress: string;
  loanType: string;
  bankName: string;
  status: string;
  assignee: string;
  uploadedAt: string;
  updatedAt: string;
  verifications: Verification[];
}

interface FieldExecutive {
  id: number;
  name: string;
}

interface RemoteExecutives {
  [office: string]: FieldExecutive[];
}

export default function Loans() {
  const [loading, setLoading] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [form] = Form.useForm();
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 1,
      applicationNumber: "LOAN-001",
      applicantName: "John Doe",
      applicantPhone: "9876543210",
      applicantAddress: "123 Main St, Mumbai",
      loanType: "Home Loan",
      bankName: "HDFC Bank",
      status: "Pending",
      assignee: "Jane Smith",
      uploadedAt: "2024-03-20T10:00:00Z",
      updatedAt: "2024-03-20T10:00:00Z",
      verifications: [
        {
          id: 1,
          type: "Permanent Address",
          assignmentMethod: "Local",
          assignee: "John Doe",
          status: "Pending",
        },
        {
          id: 2,
          type: "Work",
          assignmentMethod: "Remote",
          office: "Delhi",
          assignee: "Jane Smith",
          status: "Pending",
        },
      ],
    },
    {
      id: 2,
      applicationNumber: "LOAN-002",
      applicantName: "Jane Smith",
      applicantPhone: "9876543210",
      applicantAddress: "456 Park Ave, Delhi",
      loanType: "Business Loan",
      bankName: "ICICI Bank",
      status: "In Progress",
      assignee: "John Doe",
      uploadedAt: "2024-03-19T15:30:00Z",
      updatedAt: "2024-03-20T09:15:00Z",
      verifications: [
        {
          id: 3,
          type: "Current Address",
          assignmentMethod: "Local",
          assignee: "Jane Smith",
          status: "Pending",
        },
      ],
    },
  ]);

  const [fieldExecutives] = useState<FieldExecutive[]>([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ]);

  const [selectedOffice, setSelectedOffice] = useState<string>("");
  const [offices] = useState(["Mumbai", "Delhi", "Bangalore", "Chennai"]);
  const [remoteExecutives] = useState<RemoteExecutives>({
    Mumbai: [
      { id: 3, name: "Raj Kumar" },
      { id: 4, name: "Priya Shah" },
    ],
    Delhi: [
      { id: 5, name: "Amit Singh" },
      { id: 6, name: "Neha Gupta" },
    ],
    Bangalore: [
      { id: 7, name: "Karthik R" },
      { id: 8, name: "Divya M" },
    ],
    Chennai: [
      { id: 9, name: "Senthil K" },
      { id: 10, name: "Lakshmi N" },
    ],
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [editLoanInfo, setEditLoanInfo] = useState(false);

  const handleImport = async (file: File) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Loans imported successfully");
      setIsImportModalVisible(false);
    } catch (error) {
      message.error("Failed to import loans");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAssign = async (
    loanId: number,
    verificationType: string,
    values: {
      assignmentMethod: "Local" | "Remote";
      office?: string;
      assignee: string;
    }
  ) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoans(
        loans.map((loan) => {
          if (loan.id === loanId) {
            const updatedVerifications = loan.verifications.map((v) =>
              v.type === verificationType ? { ...v, ...values } : v
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

  const handleLoanInfoSave = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoans(
        loans.map((loan) =>
          loan.id === selectedLoan?.id ? { ...loan, ...values } : loan
        )
      );
      setEditLoanInfo(false);
      setLoading(false);
      message.success("Loan information updated");
    }, 1000);
  };

  const columns: ColumnsType<Loan> = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
    },
    {
      title: "Phone",
      dataIndex: "applicantPhone",
      key: "applicantPhone",
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
    },
    {
      title: (
        <Typography.Text style={{ color: "#4CAF50" }}>
          Permanent Address
        </Typography.Text>
      ),
      children: [
        {
          title: "Assignee",
          key: "pavAssignee",
          render: (_, record: Loan) => {
            const pav = record.verifications.find(
              (v) => v.type === "Permanent Address"
            );
            return pav ? pav.assignee : "-";
          },
        },
        {
          title: "Status",
          key: "pavStatus",
          render: (_, record: Loan) => {
            const pav = record.verifications.find(
              (v) => v.type === "Permanent Address"
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
      title: (
        <Typography.Text style={{ color: "#2196F3" }}>
          Current Address
        </Typography.Text>
      ),
      children: [
        {
          title: "Assignee",
          key: "cavAssignee",
          render: (_, record: Loan) => {
            const cav = record.verifications.find(
              (v) => v.type === "Current Address"
            );
            return cav ? cav.assignee : "-";
          },
        },
        {
          title: "Status",
          key: "cavStatus",
          render: (_, record: Loan) => {
            const cav = record.verifications.find(
              (v) => v.type === "Current Address"
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
      title: (
        <Typography.Text style={{ color: "#9C27B0" }}>Work</Typography.Text>
      ),
      children: [
        {
          title: "Assignee",
          key: "wvAssignee",
          render: (_, record: Loan) => {
            const wv = record.verifications.find((v) => v.type === "Work");
            return wv ? wv.assignee : "-";
          },
        },
        {
          title: "Status",
          key: "wvStatus",
          render: (_, record: Loan) => {
            const wv = record.verifications.find((v) => v.type === "Work");
            return wv ? (
              <Tag color={wv.status === "Completed" ? "green" : "blue"}>
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
      title: "Uploaded At",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      render: (date: string) => dayjs(date).fromNow(),
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
        <div className="flex-end" style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<UploadOutlined style={{ fontSize: 16 }} />}
            onClick={() => setIsImportModalVisible(true)}
          >
            Import Loans
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
        />
      </Card>
      <Modal
        title="Import Loans"
        open={isImportModalVisible}
        onCancel={() => setIsImportModalVisible(false)}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            <InfoCircleOutlined /> The CSV file should contain the following
            columns:
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
            if (ext === "csv") {
              handleImport(file);
            } else if (ext === "xls" || ext === "xlsx") {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (!e.target) {
                  message.error("File read error");
                  return;
                }
                const data = new Uint8Array(e.target.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                // You can process the workbook here or pass to handleImport
                message.success("XLS/XLSX file loaded (mock)");
                setIsImportModalVisible(false);
              };
              reader.readAsArrayBuffer(file);
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
            Click or drag CSV file to this area to upload
          </p>
        </Upload.Dragger>
      </Modal>

      <Drawer
        title={
          <span>
            Loan Details - {selectedLoan?.applicationNumber}{" "}
            {selectedLoan && (
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
          setSelectedOffice("");
          setSameAddress(false);
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
                {!editLoanInfo && (
                  <Button
                    type="link"
                    onClick={() => setEditLoanInfo(true)}
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                )}
              </div>
              {!editLoanInfo ? (
                <Descriptions
                  bordered
                  size="small"
                  column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                >
                  <Descriptions.Item label="Application Number">
                    {selectedLoan.applicationNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Applicant Name">
                    {selectedLoan.applicantName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {selectedLoan.applicantAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loan Type">
                    {selectedLoan.loanType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bank Name">
                    {selectedLoan.bankName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Uploaded At">
                    {dayjs(selectedLoan.uploadedAt).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Form
                  layout="vertical"
                  initialValues={{
                    applicationNumber: selectedLoan.applicationNumber,
                    applicantName: selectedLoan.applicantName,
                    applicantAddress: selectedLoan.applicantAddress,
                    loanType: selectedLoan.loanType,
                    bankName: selectedLoan.bankName,
                  }}
                  onFinish={handleLoanInfoSave}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Application Number"
                        name="applicationNumber"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Applicant Name"
                        name="applicantName"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        {" "}
                        <Input />{" "}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Address"
                        name="applicantAddress"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        {" "}
                        <Input />{" "}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Loan Type"
                        name="loanType"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        {" "}
                        <Input />{" "}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Bank Name"
                        name="bankName"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        {" "}
                        <Input />{" "}
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
                        Save
                      </Button>
                      <Button onClick={() => setEditLoanInfo(false)}>
                        Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
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
                        type: "Permanent Address",
                        merged: true,
                      },
                      { label: "Work", type: "Work", merged: false },
                    ].map(({ label, type, merged }) => {
                      const verification = selectedLoan.verifications.find(
                        (v) =>
                          merged
                            ? v.type === "Permanent Address" ||
                              v.type === "Current Address"
                            : v.type === type
                      );
                      return (
                        <Card
                          key={label}
                          title={label}
                          style={{ flex: 1 }}
                          extra={
                            verification && (
                              <Tag
                                color={
                                  verification.status === "Completed"
                                    ? "green"
                                    : "blue"
                                }
                              >
                                {verification.status}
                              </Tag>
                            )
                          }
                        >
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
                                : undefined
                            }
                            onFinish={(values) =>
                              handleVerificationAssign(
                                selectedLoan.id,
                                type,
                                values
                              )
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
                              <Radio.Group>
                                <Radio.Button value="Local">Local</Radio.Button>
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
                                      label="Select Office"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please select an office",
                                        },
                                      ]}
                                    >
                                      <Select
                                        placeholder="Select office"
                                        onChange={(value) =>
                                          setSelectedOffice(value)
                                        }
                                      >
                                        {offices.map((office) => (
                                          <Option key={office} value={office}>
                                            {office}
                                          </Option>
                                        ))}
                                      </Select>
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
                                    <Select placeholder="Select field executive">
                                      {assignmentMethod === "Local"
                                        ? fieldExecutives.map((fe) => (
                                            <Option key={fe.id} value={fe.name}>
                                              {fe.name}
                                            </Option>
                                          ))
                                        : office &&
                                          remoteExecutives[office]?.map(
                                            (fe: FieldExecutive) => (
                                              <Option
                                                key={fe.id}
                                                value={fe.name}
                                              >
                                                {fe.name}
                                              </Option>
                                            )
                                          )}
                                    </Select>
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
                        </Card>
                      );
                    })
                  : ["Permanent Address", "Current Address", "Work"].map(
                      (type) => {
                        const verification = selectedLoan.verifications.find(
                          (v) => v.type === type
                        );
                        return (
                          <Card
                            key={type}
                            title={type}
                            style={{ flex: 1 }}
                            extra={
                              verification && (
                                <Tag
                                  color={
                                    verification.status === "Completed"
                                      ? "green"
                                      : "blue"
                                  }
                                >
                                  {verification.status}
                                </Tag>
                              )
                            }
                          >
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
                                  : undefined
                              }
                              onFinish={(values) =>
                                handleVerificationAssign(
                                  selectedLoan.id,
                                  type,
                                  values
                                )
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
                                <Radio.Group>
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
                                        label="Select Office"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please select an office",
                                          },
                                        ]}
                                      >
                                        <Select
                                          placeholder="Select office"
                                          onChange={(value) =>
                                            setSelectedOffice(value)
                                          }
                                        >
                                          {offices.map((office) => (
                                            <Option key={office} value={office}>
                                              {office}
                                            </Option>
                                          ))}
                                        </Select>
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
                                      <Select placeholder="Select field executive">
                                        {assignmentMethod === "Local"
                                          ? fieldExecutives.map((fe) => (
                                              <Option
                                                key={fe.id}
                                                value={fe.name}
                                              >
                                                {fe.name}
                                              </Option>
                                            ))
                                          : office &&
                                            remoteExecutives[office]?.map(
                                              (fe: FieldExecutive) => (
                                                <Option
                                                  key={fe.id}
                                                  value={fe.name}
                                                >
                                                  {fe.name}
                                                </Option>
                                              )
                                            )}
                                      </Select>
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
                          </Card>
                        );
                      }
                    )}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
