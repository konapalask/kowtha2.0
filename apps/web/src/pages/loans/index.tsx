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
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import type { ColumnsType } from "antd/es/table";
import type { Key } from "react";
// import { UserContext } from "@/components/layout/UserContextProvider";
import {
  getLoansApi,
  // updateLoanApi,
  importLoansApi,
  type Loan,
  deleteLoanApi,
} from "@/services/loans.services";
import { getOfficesApi, Office } from "@/services/settings.services";
import {
  getFieldExecutivesByOfficeIdApi,
  getVerifiersApi,
} from "@/services/users.services";
// import { colors } from "@/styles/colors";
import LoanEditDrawer from "@/components/loans/LoanEditDrawer";
import BulkImportDrawer from "@/components/loans/BulkImportDrawer";
import ImportCsvModal from "@/components/loans/ImportCsvModal";
import FilterOverlay, { FilterValue } from "@/components/loans/FilterOverlay";
import dynamic from "next/dynamic";
import { getUserDetails, getCurrentDepartment, getCurrentDepartmentOfficeId, getCurrentDepartmentRole, useDepartmentChange } from "@/utils/utility";

const DashboardLayout = dynamic(
  () => import("@/components/layout/DashboardLayout"),
  { ssr: false }
);

dayjs.extend(relativeTime);

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
    getCurrentDepartmentOfficeId()?.toString() || userDetails?.officeId?.toString() || ""
  );
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
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
      const result = await getLoansApi(page, limit, filters);
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
    fetchLoans(pagination.current, pagination.pageSize);
  }, [refresh, pagination.current, pagination.pageSize, filters, currentDepartment]); // Add currentDepartment as dependency

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
    getVerifiersApi()
      .then((res) => {
        const options =
          res?.data?.data?.map((item: any) => ({
            label: item.name,
            value: item.id,
          })) ?? [];
        setVerifiers(options);
      })
      .catch((err) => {
        console.log(err);
        // message.error("Failed to fetch verifiers");
      });
  }, []);

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

  const refreshLoans = () => {
    fetchLoans(pagination.current, pagination.pageSize);
  };

  // Define columns based on department
  console.log('Current department:', currentDepartment);
  const getColumns = () => {
    const baseColumns = [
      {
        title: "Application Number",
        dataIndex: "applicationNumber",
        key: "applicationNumber",
        fixed: "left",
        width: 180,
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
        width: 100,
        render: (status: string) => {
          const color =
            status === "Unassigned"
              ? "magenta"
              : status === "Assigned"
                ? "geekblue"
                : status === "Pending"
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
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
        width: 120,
      },
    ];

    // If current department is 'PD', only show Business column
    if (currentDepartment === 'PD') {
      return [
        ...baseColumns,
        {
          title: <Typography.Text>Business</Typography.Text>,
          children: [
            {
              title: "Assignee",
              key: "businessAssignee",
              onFilter: (value: boolean | Key, record: Loan) => {
                const business = record?.verifications?.find(
                  (v: any) => v.type === "Business"
                );
                return business?.fieldExecutive?.employeeCode === value.toString();
              },
              render: (_: any, record: Loan) => {
                const business = record?.verifications?.find(
                  (v: any) => v.type === "Business"
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
                          whiteSpace: "nowrap"
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
              width: 150,
            },
            {
              title: "Status",
              key: "businessStatus",
              render: (_: any, record: Loan) => {
                const business = record?.verifications?.find(
                  (v: any) => v.type === "Business"
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
                    {(getCurrentDepartmentRole() === "Admin" ) && (
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
                (v: any) => v.type === "AddressOne"
              );
              return pav?.fieldExecutive?.employeeCode === value.toString();
            },
            render: (_: any, record: Loan) => {
              const pav = record?.verifications?.find(
                (v: any) => v.type === "AddressOne"
              );
              return pav ? (
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
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
                (v: any) => v.type === "AddressOne"
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
                (v: any) => v.type === "AddressTwo"
              );
              return cav?.fieldExecutive?.employeeCode === value.toString();
            },
            render: (_: any, record: Loan) => {
              const cav = record?.verifications?.find(
                (v: any) => v.type === "AddressTwo"
              );
              return cav ? (
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
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
                (v: any) => v.type === "AddressTwo"
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
                (v: any) => v.type === "Work"
              );
              return wv?.fieldExecutive?.employeeCode === value.toString();
            },
            render: (_: any, record: Loan) => {
              const wv = record?.verifications?.find(
                (v: any) => v.type === "Work"
              );
              return wv ? (
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
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
                (v: any) => v.type === "Work"
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
                (v: any) => v.type === "Business"
              );
              return business?.fieldExecutive?.employeeCode === value.toString();
            },
            render: (_: any, record: Loan) => {
              const business = record?.verifications?.find(
                (v: any) => v.type === "Business"
              );
              return business ? (
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div>{business?.fieldExecutive?.name}</div>
                  <Tag color="blue">{business?.fieldExecutive?.employeeCode}</Tag>
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
                (v: any) => v.type === "Business"
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
                  {(getCurrentDepartmentRole() === "Admin" )&& (
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
            onFilterChange={(newFilters: FilterValue) => setFilters(newFilters)}
          />
          {!(getCurrentDepartmentRole() === "Verifier") && (
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
          pagination={
            // Hide pagination if filters are applied and results are <= 10
            (Object.values(filters).some((v) => v !== undefined && v !== "") && loans.length <= 20)
              ? false
              : {
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showTotal: (total) => `Total ${total} items`,
                  position: ["bottomCenter"],
                }
          }
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
      />
    </DashboardLayout>
  );
}
