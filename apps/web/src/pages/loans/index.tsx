import { useContext, useEffect, useState } from "react";
import { Table, Button, Tag, Typography, Form, message, Card } from "antd";
import { EditOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
import type { Key } from "react";
import { UserContext } from "@/components/layout/UserContextProvider";
import {
  getLoansApi,
  updateLoanApi,
  importLoansApi,
  type Loan,
} from "@/services/loans.services";
import { getOfficesApi, Office } from "@/services/settings.services";
import {
  getFieldExecutivesByOfficeIdApi,
  getVerifiersApi,
} from "@/services/users.services";
import { colors } from "@/styles/colors";
import LoanEditDrawer from "@/components/loans/LoanEditDrawer";
import BulkImportDrawer from "@/components/loans/BulkImportDrawer";
import ImportCsvModal from "@/components/loans/ImportCsvModal";
import FilterOverlay, { FilterValue } from "@/components/loans/FilterOverlay";
import dynamic from "next/dynamic";
import { getUserDetails } from "@/utils/utility";

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
  const [isBulkImportDrawerVisible, setIsBulkImportDrawerVisible] =
    useState<boolean>(false);
  const [bulkImportForm] = Form.useForm();
  const [currentOffice, setCurrentOffice] = useState<string>(
    userDetails?.officeId || ""
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
  }, [refresh, pagination.current, pagination.pageSize, filters]);

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

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const result = await getFieldExecutivesByOfficeIdApi(currentOffice);
        const options =
          result?.data?.data?.map((item: any) => ({
            label: (
              <Typography.Text
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {item.name} <Tag color="blue">{item.employeeCode}</Tag>{" "}
                <Tag color="blue">Pending:{item.pendingVerifications}</Tag>
              </Typography.Text>
            ),
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

  const handleTableChange = (newPagination: any) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const columns: any = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      fixed: "left",
      width: 200,
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
            return pav ? pav?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
          width: 100,
        },
        {
          title: "Status",
          key: "pavStatus",
          render: (_: any, record: Loan) => {
            const pav = record?.verifications?.find(
              (v: any) => v.type === "AddressOne"
            );
            return pav ? (
              <Tag color={pav.status === "Completed" ? "green" : "orange"}>
                {pav.status}
              </Tag>
            ) : (
              "-"
            );
          },
          width: 100,
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
            return cav ? cav?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
          width: 100,
        },
        {
          title: "Status",
          key: "cavStatus",
          render: (_: any, record: Loan) => {
            const cav = record?.verifications?.find(
              (v: any) => v.type === "AddressTwo"
            );
            return cav ? (
              <Tag color={cav.status === "Completed" ? "green" : "orange"}>
                {cav.status}
              </Tag>
            ) : (
              "-"
            );
          },
          width: 100,
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
            return wv ? wv?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
          width: 100,
        },
        {
          title: "Status",
          key: "wvStatus",
          render: (_: any, record: Loan) => {
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
          width: 100,
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
            return business ? business?.fieldExecutive?.employeeCode : "-";
          },
          align: "center",
          width: 100,
        },
        {
          title: "Status",
          key: "wvStatus",
          render: (_: any, record: Loan) => {
            const wv = record?.verifications?.find(
              (v: any) => v.type === "Business"
            );
            return wv ? (
              <Tag color={wv.status === "Completed" ? "green" : "orange"}>
                {wv.status}
              </Tag>
            ) : (
              "-"
            );
          },
          width: 100,
        },
      ],
    },
    ...(!(userDetails?.role === "Verifier")
      ? [
          {
            title: "Actions",
            key: "actions",
            fixed: "right",
            align: "center",
            render: (_: any, record: any) => (
              <Button
                type="link"
                // icon={<EditOutlined />}
                onClick={() => {
                  setSelectedLoan(record.applicationNumber);
                  setIsDrawerVisible(true);
                }}
              >
                Edit
              </Button>
            ),
            width: 100,
          },
        ]
      : []),
  ];

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
          {!(userDetails?.role === "Verifier") && (
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
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total) => `Total ${total} items`,
            position: ["bottomCenter"],
          }}
          size="small"
          scroll={{ x: 1500 }}
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
          selectedApplicationNumber={selectedLoan}
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
          fetchLoans={fetchLoans}
          setRefresh={setRefresh}
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
