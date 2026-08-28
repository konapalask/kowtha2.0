import { useEffect, useState, useRef, useCallback } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Badge,
  Input,
} from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "@/utils/router";
import {
  getFieldExecutivesApi,
  getVerifierLoansApi,
} from "@/services/loans.services";
import { useDepartmentChange, getCurrentDepartmentRole } from "@/utils/utility";

type LoanData = {
  id?: string | number;
  applicationNumber?: string;
  applicantName?: string;
  status?: string;
  uploadedAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

export default function Verify() {
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<LoanData[]>([]);
  const router = useRouter();
  const currentDepartment = useDepartmentChange();

  // Search state
  const [searchApplicationNumber, setSearchApplicationNumber] = useState<string>("");
  const [searchApplicantName, setSearchApplicantName] = useState<string>("");
  const [activeSearchField, setActiveSearchField] = useState<string | null>(null);

  // Debounced search filters
  const [debouncedAppNumber, setDebouncedAppNumber] = useState<string>("");
  const [debouncedApplicantName, setDebouncedApplicantName] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAppNumber(searchApplicationNumber);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchApplicationNumber]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedApplicantName(searchApplicantName);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchApplicantName]);

  // Pagination state
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(() => {
    const p = parseInt(router.query.page as string, 10);
    return !isNaN(p) && p > 0 ? p : 1;
  });

  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Synchronize currentPage with query parameter
  useEffect(() => {
    if (router.isReady && router.query.page) {
      const pageFromQuery = parseInt(router.query.page as string, 10);
      if (!isNaN(pageFromQuery) && pageFromQuery > 0 && pageFromQuery !== currentPage) {
        setCurrentPage(pageFromQuery);
      }
    }
  }, [router.isReady, router.query.page]);

  // Primary optimized data fetcher
  const fetchLoans = useCallback(async (pageToFetch: number) => {
    if (!router.isReady) return;

    setLoading(true);
    try {
      const res = await getVerifierLoansApi(pageToFetch, pageSize, {
        applicationNumber: debouncedAppNumber,
        applicantName: debouncedApplicantName,
      });

      const responseData = res?.data?.data || res?.data || res;
      const items = responseData?.items || responseData?.data || [];
      const meta = responseData?.meta || {
        total: items.length,
        page: pageToFetch,
        limit: pageSize,
        totalPages: Math.ceil(items.length / pageSize),
      };

      setLoans(Array.isArray(items) ? items : []);
      setPaginationMeta(meta);
    } catch (err) {
      console.error("Error fetching verifier loans:", err);
      setLoans([]);
      setPaginationMeta({
        total: 0,
        page: 1,
        limit: pageSize,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [
    router.isReady,
    currentDepartment,
    pageSize,
    debouncedAppNumber,
    debouncedApplicantName,
  ]);

  // Execute fetch when page, department, or debounced search changes
  useEffect(() => {
    fetchLoans(currentPage);
  }, [currentPage, currentDepartment, debouncedAppNumber, debouncedApplicantName, fetchLoans]);

  const getStatusTags = (record: any) => {
    const types = [
      { key: "PermanentAddress", label: "Permanent Address" },
      { key: "CurrentAddress", label: "Current Address" },
      { key: "Work", label: "Work" },
      { key: "Business", label: "Business" },
    ];
    const verifications =
      record?.verifications?.filter(
        (option: any) => option?.status !== "Pending"
      ) ?? [];
    return (
      <Space size={[0, 8]} wrap>
        {types.map((type) => {
          const verification = verifications.find(
            (v: any) => v.addressType === type.key
          );
          if (!verification) {
            return null;
          }
          const isCompleted = verification?.status === "Completed";
          const approvedStatus = verification?.approvedStatus;
          const isPositive = approvedStatus === "Positive";
          const isNegative = approvedStatus === "Negative" || approvedStatus === "Mismatch";
          
          return (
            <Tag
              key={type.key}
              style={{
                borderRadius: "9999px",
                padding: "3px 10px",
                fontSize: "11.5px",
                fontWeight: 600,
                border: "1px solid",
                background: isCompleted
                  ? isPositive
                    ? "#ecfdf5"
                    : isNegative
                    ? "#fef2f2"
                    : "#f0f7ff"
                  : "#fffbeb",
                borderColor: isCompleted
                  ? isPositive
                    ? "#a7f3d0"
                    : isNegative
                    ? "#fecaca"
                    : "#bfdbfe"
                  : "#fde68a",
                color: isCompleted
                  ? isPositive
                    ? "#065f46"
                    : isNegative
                    ? "#991b1b"
                    : "#1e40af"
                  : "#92400e",
              }}
            >
              {type.label}{" "}
              {approvedStatus ? (
                <CheckOutlined
                  style={{
                    color: isPositive ? "#059669" : "#dc2626",
                    marginLeft: 4,
                  }}
                />
              ) : null}
            </Tag>
          );
        })}
      </Space>
    );
  };

  const applicationNumberInputRef = useRef<any>(null);
  const applicantNameInputRef = useRef<any>(null);

  useEffect(() => {
    if (activeSearchField === "applicationNumber" && applicationNumberInputRef.current) {
      setTimeout(() => {
        applicationNumberInputRef.current?.focus();
      }, 100);
    } else if (activeSearchField === "applicantName" && applicantNameInputRef.current) {
      setTimeout(() => {
        applicantNameInputRef.current?.focus();
      }, 100);
    }
  }, [activeSearchField]);

  const columns: ColumnsType<LoanData> = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          {activeSearchField === "applicationNumber" ? (
            <Input
              ref={applicationNumberInputRef}
              placeholder="Search Application Number"
              prefix={<SearchOutlined />}
              value={searchApplicationNumber}
              onChange={(e) => setSearchApplicationNumber(e.target.value)}
              onBlur={() => {
                if (!searchApplicationNumber) {
                  setActiveSearchField(null);
                }
              }}
              allowClear
              style={{ width: "100%" }}
              autoFocus
            />
          ) : (
            <>
              <span>Application Number</span>
              <SearchOutlined
                style={{
                  color: searchApplicationNumber ? "#0B2545" : undefined,
                  cursor: "pointer",
                }}
                onClick={() => setActiveSearchField("applicationNumber")}
              />
            </>
          )}
        </div>
      ),
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      width: 200,
      render: (text) => (
        <span style={{ fontWeight: 600, color: "#0B2545" }}>
          {text ?? "-"}
        </span>
      ),
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          {activeSearchField === "applicantName" ? (
            <Input
              ref={applicantNameInputRef}
              placeholder="Search Applicant Name"
              prefix={<SearchOutlined />}
              value={searchApplicantName}
              onChange={(e) => setSearchApplicantName(e.target.value)}
              onBlur={() => {
                if (!searchApplicantName) {
                  setActiveSearchField(null);
                }
              }}
              allowClear
              style={{ width: "100%" }}
              autoFocus
            />
          ) : (
            <>
              <span>Applicant Name</span>
              <SearchOutlined
                style={{
                  color: searchApplicantName ? "#0B2545" : undefined,
                  cursor: "pointer",
                }}
                onClick={() => setActiveSearchField("applicantName")}
              />
            </>
          )}
        </div>
      ),
      dataIndex: "applicantName",
      key: "applicantName",
      width: 200,
      render: (text) => text ?? "-",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      width: 150,
      render: (text) => text ?? "-",
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
      width: 150,
      render: (text) => text ?? "-",
    },
    {
      title: "Applicant Type",
      dataIndex: "applicantType",
      key: "applicantType",
      width: 120,
      render: (text) => text ?? "-",
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      render: (date: string) => {
        if (!date) return "-";
        return (
          <Space direction="vertical" size={0}>
            <span style={{ fontWeight: 500 }}>{dayjs(date).format("DD/MM/YYYY")}</span>
            <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
              {dayjs(date).format("hh:mm A")}
            </span>
          </Space>
        );
      },
    },
    {
      title: "Ops Executive",
      dataIndex: ["operationsExecutive", "name"],
      key: "operationsExecutive",
      width: 150,
      render: (text) => text ?? "-",
    },
    {
      title: "Status",
      key: "status",
      width: 220,
      render: (_, record) => getStatusTags(record),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          style={{
            background: "#0B2545",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "12px",
            height: "30px",
            padding: "0 12px",
          }}
          onClick={() => {
            router.push(`/verify/${record.id}`);
          }}
        >
          Verify
        </Button>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    const newPage = pagination.current;
    setCurrentPage(newPage);
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    });
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 20 }}>
        <Typography.Title level={3} style={{ margin: 0, color: "#0B2545", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Verification Queue
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 13, color: "#64748B" }}>
          Pending and completed loan verifications assigned to your desk
        </Typography.Text>
      </div>

      <Card
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #eef2f6",
          boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)",
          padding: "8px",
        }}
      >
        <Table
          columns={columns}
          dataSource={loans}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: paginationMeta.total,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} cases`,
            position: ["bottomCenter"],
          }}
        />
      </Card>
    </DashboardLayout>
  );
}
