import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Typography,
  Form,
  message,
  Card,
  Badge,
  Row,
  Col,
  Popconfirm,
  Divider,
  Tooltip,
  Popover,
  DatePicker,
  Select,
  Space,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
// import type { ColumnsType } from "antd/es/table";
import type { Key } from "react";
// import { UserContext } from "@/components/layout/UserContextProvider";
import {
  getLoansApi,
  // updateLoanApi,
  importLoansApi,
  exportLoansApi,
  type Loan,
  deleteLoanApi,
} from "@/services/loans.services";
import { getOfficesApi, Office } from "@/services/settings.services";
import {
  getFieldExecutivesByOfficeIdApi,
  getVerifiersApi,
  getAllVerificationExecutivesApi,
} from "@/services/users.services";
// import { colors } from "@/styles/colors";
import LoanEditDrawer from "@/components/loans/LoanEditDrawer";
import BulkImportDrawer from "@/components/loans/BulkImportDrawer";
import ImportCsvModal from "@/components/loans/ImportCsvModal";
import FilterOverlay, { FilterValue } from "@/components/loans/FilterOverlay";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  getUserDetails,
  getCurrentDepartment,
  getCurrentDepartmentOfficeId,
  getCurrentDepartmentRole,
  useDepartmentChange,
} from "@/utils/utility";
// import { pdBankOptions as staticPdBankOptions } from "@/utils/options";
import {
  getPdBanksApi,
  getTemplateOptionsApi,
} from "@/services/schema.service";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface FieldExecutive {
  id: number;
  name: string;
  value: number;
  label: string;
}

export interface Verifiers {
  [key: string]: any;
}

export default function Loans() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isImportModalVisible, setIsImportModalVisible] =
    useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [loans, setLoans] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false);
  const userDetails = getUserDetails();
  const currentDepartment = useDepartmentChange();
  const [isBulkImportDrawerVisible, setIsBulkImportDrawerVisible] =
    useState<boolean>(false);
  const [bulkImportForm] = Form.useForm();
  const [currentOffice, setCurrentOffice] = useState<string>(
    getCurrentDepartmentOfficeId()?.toString() ||
      userDetails?.officeId?.toString() ||
      "",
  );
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [verificationExecutives, setVerificationExecutives] = useState<any[]>(
    [],
  );
  const [offices, setOffices] = useState<Office[]>([]);
  const [editLoanInfo, setEditLoanInfo] = useState<boolean>(false);
  const [verifiers, setVerifiers] = useState<Verifiers[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<FilterValue>({
    status: undefined,
    applicationNumber: undefined,
    fieldExecutiveEmployeeCode: undefined,
    fieldExecutiveName: undefined,
  });
  const [pdBankOptions, setPdBankOptions] = useState<any[]>([]);
  const [templateOptions, setTemplateOptions] = useState<any[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportPopoverOpen, setExportPopoverOpen] = useState(false);
  const [exportFilters, setExportFilters] = useState<{
    startDate?: string;
    endDate?: string;
    status?: string;
    bankName?: string;
  }>({});

  // Update currentOffice when department changes
  useEffect(() => {
    const deptOfficeId = getCurrentDepartmentOfficeId();
    if (deptOfficeId) {
      setCurrentOffice(deptOfficeId.toString());
    }
  }, [currentDepartment]);

  const fetchLoans = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const apiFilters: any = { ...filters };
      if (apiFilters.postponed === true) {
        apiFilters.postponed = "true";
      } else if (
        apiFilters.postponed === false ||
        apiFilters.postponed === undefined
      ) {
        delete apiFilters.postponed;
      }
      const result = await getLoansApi(page, limit, apiFilters);
      const data = result.data.data;
      setLoans(data?.items ?? []);
      setPagination({
        current: data.meta.page,
        pageSize: data.meta.limit,
        total: data.meta.total,
        totalPages: data.meta.totalPages,
      });
    } catch (error) {
      message.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch loans if department is available
    if (currentDepartment) {
      fetchLoans(pagination.current, pagination.pageSize);
    }
  }, [
    refresh,
    pagination.current,
    pagination.pageSize,
    filters,
    currentDepartment,
  ]); // Add currentDepartment as dependency

  const fetchVerifiers = async () => {
    try {
      const res = await getVerifiersApi();
      const options =
        res?.data?.data?.map((item: any) => ({
          label: (
            <Row gutter={[0, 5]} style={{ width: "100%" }}>
              <Col
                xs={24}
                sm={12}
                md={9}
                xl={11}
                style={{ wordWrap: "break-word" }}
              >
                <Typography.Text>{item?.name}</Typography.Text>
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
      setVerifiers(options);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchVerificationExecutives = async () => {
    try {
      const res = await getAllVerificationExecutivesApi();
      const options =
        res?.data?.data?.map((item: any) => ({
          label: (
            <Row gutter={[0, 5]} style={{ width: "100%" }}>
              <Col
                xs={24}
                sm={12}
                md={9}
                xl={11}
                style={{ wordWrap: "break-word" }}
              >
                <Typography.Text>{item?.name}</Typography.Text>
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
      setVerificationExecutives(options);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOfficesApi()
      .then((res) => {
        const options =
          res?.data?.data?.map((item: any) => ({
            label: item.name,
            value: item.id,
          })) ?? [];
        setOffices(options);
      })
      .catch((err) => {
        // message.error("Failed to fetch offices");
        console.log(err);
      });
    // Commented out: Using static pdBankOptions from options.tsx instead of backend API
    getPdBanksApi()
      .then((res) => {
        const options =
          res?.map((item: any) => ({
            label: item,
            value: item,
          })) ?? [];
        setPdBankOptions(options);
      })
      .catch((err) => {
        console.log(err);
      });

    // Fetch template options from backend
    getTemplateOptionsApi()
      .then((res) => {
        setTemplateOptions(res ?? []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!isDrawerVisible) {
      fetchVerifiers();
      fetchVerificationExecutives();
    }
  }, [isDrawerVisible]);

  const fetchExecutives = async () => {
    try {
      const result = await getFieldExecutivesByOfficeIdApi(currentOffice);
      const options =
        result?.data?.data?.map((item: any) => ({
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
                  {/* {item?.name?.length > 15
                    ? item.name.slice(0, 15) + "..."
                    : item?.name} */}
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
      setFieldExecutives(options);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
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

  const handleTableChange = (newPagination: any) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleFilterChange = (newFilters: FilterValue) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const refreshLoans = () => {
    fetchLoans(pagination.current, pagination.pageSize);
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const response = await exportLoansApi(exportFilters);
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loans_export_${dayjs().format("YYYY-MM-DD")}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setExportPopoverOpen(false);
      setExportFilters({});
      message.success("Loans exported successfully");
    } catch (error) {
      message.error("Failed to export loans");
    } finally {
      setExportLoading(false);
    }
  };

  // Define columns based on department
  // console.log("Current department:", currentDepartment);
  const getColumns = () => {
    const baseColumns = [
      {
        title: "Application Number",
        dataIndex: "applicationNumber",
        key: "applicationNumber",
        fixed: "left",
        width: 150,
        // align: "center",
      },
      {
        title: "Applicant Name",
        dataIndex: "applicantName",
        key: "applicantName",
        width: 150,
      },
      {
        title: "Mobile",
        dataIndex: "applicantMobile",
        key: "applicantMobile",
        width: 100,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 180,
        render: (status: string) => {
          const color =
            status === "Completed"
              ? "green"
              : status === "Unassigned"
                ? "magenta"
                : status === "Assigned"
                  ? "geekblue"
                  : status === "Pending"
                    ? "orange"
                    : status === "BackendCompleted"
                      ? "cyan"
                      : "blue";
          const displayStatus =
            status === "BackendCompleted" ? "Backend Completed" : status;
          return <Tag color={color}>{displayStatus}</Tag>;
        },
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: string) => dayjs.utc(date).format("DD-MM-YYYY"),
        width: 120,
      },
      ...(currentDepartment !== "FI"
        ? [
            {
              title: "Closed At",
              dataIndex: "closedAt",
              key: "closedAt",
              render: (date: string) =>
                date ? dayjs.utc(date).format("DD-MM-YYYY") : "-",
              width: 120,
            },
          ]
        : []),
    ];

    if (currentDepartment === "PD") {
      baseColumns.push({
        title: "Bank Name",
        dataIndex: "bankName",
        key: "bankName",
        width: 120,
      });
      baseColumns.push({
        title: "Template Name",
        dataIndex: "templateName",
        key: "templateName",
        width: 150,
      });
    }

    // If current department is 'PD', only show Business column
    if (currentDepartment === "PD") {
      return [
        ...baseColumns,
        {
          title: "Business Assignee",
          key: "businessAssignee",
          onFilter: (value: boolean | Key, record: Loan) => {
            const business = record?.verifications?.find(
              (v: any) => v.type === "Business",
            );
            return business?.fieldExecutive?.employeeCode === value.toString();
          },
          render: (_: any, record: Loan) => {
            const business = record?.verifications?.find(
              (v: any) => v.type === "Business",
            );
            return business ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "4px" }}>
                  {business?.fieldExecutive?.name}
                </div>
                <Tooltip title={business?.fieldExecutive?.employeeCode}>
                  <Tag
                    color="blue"
                    style={{
                      maxWidth: "180px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {business?.fieldExecutive?.employeeCode}
                  </Tag>
                </Tooltip>
              </div>
            ) : (
              "-"
            );
          },
          align: "center",
          width: 180,
        },
        {
          title: "Business Status",
          key: "businessStatus",
          render: (_: any, record: Loan) => {
            const business = record?.verifications?.find(
              (v: any) => v.type === "Business",
            );
            if (!business) return "-";

            const isPostponed =
              business.isPostponed === true && business.status === "Pending";
            const status = isPostponed ? "Postponed" : business.status;
            const color = isPostponed
              ? "red"
              : business.status === "Completed"
                ? "green"
                : "orange";

            return <Tag color={color}>{status}</Tag>;
          },
          width: 120,
          align: "center",
        },
        ...(!(
          getCurrentDepartmentRole() === "Verifier" ||
          getCurrentDepartmentRole() === "VerificationExecutive"
        )
          ? [
              {
                title: "Actions",
                key: "actions",
                fixed: "right",
                align: "center",
                render: (_: any, record: any) => (
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      type="link"
                      onClick={() => {
                        setSelectedLoan(record?.id);
                        setIsDrawerVisible(true);
                      }}
                    >
                      Edit
                    </Button>
                    {getCurrentDepartmentRole() === "Admin" && (
                      <Popconfirm
                        title="Are you sure you want to delete this loan?"
                        onConfirm={async () => {
                          try {
                            await deleteLoanApi(record?.id);
                            message.success("Loan deleted successfully");
                            refreshLoans();
                          } catch (error) {
                            message.error("Failed to delete loan");
                          }
                        }}
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          style={{ border: "none", color: "#ff4d4f" }}
                          type="link"
                        />
                      </Popconfirm>
                    )}
                  </span>
                ),
                width: 100,
              },
            ]
          : []),
      ];
    }

    // For 'fi' department or any other department, show all columns
    return [
      ...baseColumns,
      {
        title: <Typography.Text>Address 1</Typography.Text>,
        children: [
          {
            title: "Assignee",
            key: "pavAssignee",
            onFilter: (value: boolean | Key, record: Loan) => {
              const pav = record?.verifications?.find(
                (v: any) => v.type === "AddressOne",
              );
              return pav?.fieldExecutive?.employeeCode === value.toString();
            },
            render: (_: any, record: Loan) => {
              const pav = record?.verifications?.find(
                (v: any) => v.type === "AddressOne",
              );
              return pav ? (
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <div>{pav?.fieldExecutive?.name}</div>
                  <Tag color="blue">{pav?.fieldExecutive?.employeeCode}</Tag>
                </div>
              ) : (
                "-"
              );
            },
            align: "center",
            width: 150,
          },
          {
            title: "Status",
            key: "pavStatus",
            render: (_: any, record: Loan) => {
              const pav = record?.verifications?.find(
                (v: any) => v.type === "AddressOne",
              );
              if (!pav) return "-";

              const isPostponed =
                pav.isPostponed === true && pav.status === "Pending";
              const status = isPostponed ? "Postponed" : pav.status;
              const color = isPostponed
                ? "red"
                : pav.status === "Completed"
                  ? "green"
                  : "orange";

              return <Tag color={color}>{status}</Tag>;
            },
            width: 100,
            align: "center",
          },
        ],
      },
      {
        title: <Typography.Text>Address 2</Typography.Text>,
        children: [
          {
            title: "Assignee",
            key: "cavAssignee",
            onFilter: (value: boolean | Key, record: Loan) => {
              const cav = record?.verifications?.find(
                (v: any) => v.type === "AddressTwo",
              );
              return cav?.fieldExecutive?.employeeCode === value.toString();
            },
            render: (_: any, record: Loan) => {
              const cav = record?.verifications?.find(
                (v: any) => v.type === "AddressTwo",
              );
              return cav ? (
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <div>{cav?.fieldExecutive?.name}</div>
                  <Tag color="blue">{cav?.fieldExecutive?.employeeCode}</Tag>
                </div>
              ) : (
                "-"
              );
            },
            align: "center",
            width: 150,
          },
          {
            title: "Status",
            key: "cavStatus",
            render: (_: any, record: Loan) => {
              const cav = record?.verifications?.find(
                (v: any) => v.type === "AddressTwo",
              );
              if (!cav) return "-";

              const isPostponed =
                cav.isPostponed === true && cav.status === "Pending";
              const status = isPostponed ? "Postponed" : cav.status;
              const color = isPostponed
                ? "red"
                : cav.status === "Completed"
                  ? "green"
                  : "orange";

              return <Tag color={color}>{status}</Tag>;
            },
            width: 100,
            align: "center",
          },
        ],
      },
      {
        title: <Typography.Text>Work</Typography.Text>,
        children: [
          {
            title: "Assignee",
            key: "wvAssignee",
            onFilter: (value: boolean | Key, record: Loan) => {
              const wv = record?.verifications?.find(
                (v: any) => v.type === "Work",
              );
              return wv?.fieldExecutive?.employeeCode === value.toString();
            },
            render: (_: any, record: Loan) => {
              const wv = record?.verifications?.find(
                (v: any) => v.type === "Work",
              );
              return wv ? (
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <div>{wv?.fieldExecutive?.name}</div>
                  <Tag color="blue">{wv?.fieldExecutive?.employeeCode}</Tag>
                </div>
              ) : (
                "-"
              );
            },
            align: "center",
            width: 150,
          },
          {
            title: "Status",
            key: "wvStatus",
            render: (_: any, record: Loan) => {
              const wv = record?.verifications?.find(
                (v: any) => v.type === "Work",
              );
              if (!wv) return "-";

              const isPostponed =
                wv.isPostponed === true && wv.status === "Pending";
              const status = isPostponed ? "Postponed" : wv.status;
              const color = isPostponed
                ? "red"
                : wv.status === "Completed"
                  ? "green"
                  : "orange";

              return <Tag color={color}>{status}</Tag>;
            },
            width: 100,
            align: "center",
          },
        ],
      },
      {
        title: <Typography.Text>Business</Typography.Text>,
        children: [
          {
            title: "Assignee",
            key: "businessAssignee",
            onFilter: (value: boolean | Key, record: Loan) => {
              const business = record?.verifications?.find(
                (v: any) => v.type === "Business",
              );
              return (
                business?.fieldExecutive?.employeeCode === value.toString()
              );
            },
            render: (_: any, record: Loan) => {
              const business = record?.verifications?.find(
                (v: any) => v.type === "Business",
              );
              return business ? (
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <div>{business?.fieldExecutive?.name}</div>
                  <Tag color="blue">
                    {business?.fieldExecutive?.employeeCode}
                  </Tag>
                </div>
              ) : (
                "-"
              );
            },
            align: "center",
            width: 150,
          },
          {
            title: "Status",
            key: "businessStatus",
            render: (_: any, record: Loan) => {
              const business = record?.verifications?.find(
                (v: any) => v.type === "Business",
              );
              if (!business) return "-";

              const isPostponed =
                business.isPostponed === true && business.status === "Pending";
              const status = isPostponed ? "Postponed" : business.status;
              const color = isPostponed
                ? "red"
                : business.status === "Completed"
                  ? "green"
                  : "orange";

              return <Tag color={color}>{status}</Tag>;
            },
            width: 100,
            align: "center",
          },
        ],
      },
      ...(!(getCurrentDepartmentRole() === "Verifier")
        ? [
            {
              title: "Actions",
              key: "actions",
              fixed: "right",
              align: "center",
              render: (_: any, record: any) => (
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="link"
                    onClick={() => {
                      setSelectedLoan(record?.id);
                      setIsDrawerVisible(true);
                    }}
                  >
                    Edit
                  </Button>
                  {getCurrentDepartmentRole() === "Admin" && (
                    <Popconfirm
                      title="Are you sure you want to delete this loan?"
                      onConfirm={async () => {
                        try {
                          await deleteLoanApi(record?.id);
                          message.success("Loan deleted successfully");
                          refreshLoans();
                        } catch (error) {
                          message.error("Failed to delete loan");
                        }
                      }}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        style={{ border: "none", color: "#ff4d4f" }}
                        type="link"
                      />
                    </Popconfirm>
                  )}
                </span>
              ),
              width: 100,
            },
          ]
        : []),
    ];
  };

  const columns: any = getColumns();

  return (
    <DashboardLayout>
      <Card>
        {/* <div style={{ marginBottom: 16 }}>
          <FilterOverlay 
            filters={filters}
            onFilterChange={(newFilters: FilterValue) => setFilters(newFilters)}
          />
        </div> */}
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          <FilterOverlay
            filters={filters}
            onFilterChange={handleFilterChange}
            currentDepartment={currentDepartment}
            pdBankOptions={pdBankOptions}
            templateOptions={templateOptions}
          />
          {!(
            getCurrentDepartmentRole() === "Verifier" ||
            getCurrentDepartmentRole() === "VerificationExecutive"
          ) && (
            <Space>
              <Popover
                title="Export Loans"
                trigger="click"
                open={exportPopoverOpen}
                onOpenChange={(open) => {
                  setExportPopoverOpen(open);
                  if (!open) {
                    setExportFilters({});
                  }
                }}
                content={
                  <div style={{ width: 280 }}>
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size="middle"
                    >
                      <div>
                        <Typography.Text
                          strong
                          style={{ display: "block", marginBottom: 4 }}
                        >
                          Date Range
                        </Typography.Text>
                        <DatePicker.RangePicker
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                          value={
                            exportFilters.startDate && exportFilters.endDate
                              ? [
                                  dayjs(exportFilters.startDate),
                                  dayjs(exportFilters.endDate),
                                ]
                              : null
                          }
                          onChange={(dates) => {
                            setExportFilters((prev) => ({
                              ...prev,
                              startDate: dates?.[0]?.format("YYYY-MM-DD"),
                              endDate: dates?.[1]?.format("YYYY-MM-DD"),
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <Typography.Text
                          strong
                          style={{ display: "block", marginBottom: 4 }}
                        >
                          Status
                        </Typography.Text>
                        <Select
                          style={{ width: "100%" }}
                          allowClear
                          placeholder="All statuses"
                          value={exportFilters.status}
                          options={[
                            { label: "Unassigned", value: "Unassigned" },
                            { label: "Assigned", value: "Assigned" },
                            { label: "FVCompleted", value: "FVCompleted" },
                            ...(currentDepartment !== "FI"
                              ? [
                                  {
                                    label: "Backend Completed",
                                    value: "BackendCompleted",
                                  },
                                ]
                              : []),
                            { label: "Completed", value: "Completed" },
                          ]}
                          onChange={(value) =>
                            setExportFilters((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Typography.Text
                          strong
                          style={{ display: "block", marginBottom: 4 }}
                        >
                          Bank Name
                        </Typography.Text>
                        <Select
                          style={{ width: "100%" }}
                          allowClear
                          showSearch
                          placeholder="All banks"
                          value={exportFilters.bankName}
                          options={pdBankOptions}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={(value) =>
                            setExportFilters((prev) => ({
                              ...prev,
                              bankName: value,
                            }))
                          }
                        />
                      </div>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        loading={exportLoading}
                        onClick={handleExport}
                        block
                      >
                        Export CSV
                      </Button>
                    </Space>
                  </div>
                }
              >
                <Button icon={<DownloadOutlined style={{ fontSize: 16 }} />}>
                  Export
                </Button>
              </Popover>
              <Button
                type="primary"
                icon={<PlusOutlined style={{ fontSize: 16 }} />}
                onClick={() => {
                  setSelectedLoan(null);
                  setIsDrawerVisible(true);
                }}
              >
                New Loan
              </Button>
            </Space>
          )}
          {/* <Button
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
          </Button> */}
        </div>

        <Table
          className="loans-table striped-table"
          columns={columns}
          dataSource={loans}
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total) => `Total ${total} items`,
            position: ["bottomCenter"],
          }}
          size="small"
          scroll={{ x: 1800 }}
          sticky
          bordered
        />
      </Card>

      <ImportCsvModal
        isImportModalVisible={isImportModalVisible}
        setIsImportModalVisible={setIsImportModalVisible}
        handleImport={handleImport}
      />

      {isDrawerVisible && (
        <LoanEditDrawer
          loanId={selectedLoan}
          // setSelectedLoan={setSelectedLoan}
          isDrawerVisible={isDrawerVisible}
          setIsDrawerVisible={setIsDrawerVisible}
          editLoanInfo={editLoanInfo}
          setEditLoanInfo={setEditLoanInfo}
          loading={loading}
          setLoading={setLoading}
          setLoans={setLoans}
          loans={loans}
          fieldExecutives={fieldExecutives}
          setCurrentOffice={setCurrentOffice}
          offices={offices}
          verifiers={verifiers}
          fetchLoans={refreshLoans} // Pass the helper instead
          setRefresh={setRefresh}
          fetchExecutives={fetchExecutives}
          pdBankOptions={pdBankOptions}
          templateOptions={templateOptions}
          verificationExecutives={verificationExecutives}
        />
      )}

      <BulkImportDrawer
        isBulkImportDrawerVisible={isBulkImportDrawerVisible}
        setIsBulkImportDrawerVisible={setIsBulkImportDrawerVisible}
        bulkImportForm={bulkImportForm}
        loading={loading}
        setLoading={setLoading}
        setRefresh={setRefresh}
        verifiers={verifiers}
        templateOptions={templateOptions}
      />
    </DashboardLayout>
  );
}
