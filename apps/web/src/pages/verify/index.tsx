import dynamic from "next/dynamic";
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
// import DashboardLayout from "@/components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import {
  getFieldExecutivesApi,
  getVerifierLoansApi,
} from "@/services/loans.services";
import { useDepartmentChange, getCurrentDepartmentRole } from "@/utils/utility";

dayjs.extend(relativeTime);

// const { Title } = Typography;
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";

// Define a generic type for our loan data
type LoanData = {
  id?: string | number;
  applicationNumber?: string;
  applicantName?: string;
  status?: string;
  uploadedAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow for additional properties
};

const DashboardLayout = dynamic(
  () => import("@/components/layout/DashboardLayout"),
  { ssr: false }
);

export default function Verify() {
  const [loading, setLoading] = useState(false);
  // const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loans, setLoans] = useState<LoanData[]>([]);
  const router = useRouter();
  const currentDepartment = useDepartmentChange();

  // Search state
  const [searchApplicationNumber, setSearchApplicationNumber] =
    useState<string>("");
  const [searchApplicantName, setSearchApplicantName] = useState<string>("");
  const [activeSearchField, setActiveSearchField] = useState<string | null>(null);

  // Pagination state - similar to loans page approach
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    if (router.isReady) {
      if (router.query.page) {
        const page = parseInt(router.query.page as string, 10);
        if (!isNaN(page) && page > 0) {
          setCurrentPage((prevPage) => {
            return prevPage !== page ? page : prevPage;
          });
        }
      } else {
        setCurrentPage((prevPage) => {
          return prevPage !== 1 ? 1 : prevPage;
        });
      }
    }
  }, [router.isReady, router.query.page]);

  const fetchLoans = useCallback(async (page?: number) => {
    if (!router.isReady) return;

    let pageToUse = 1;
    
    if (page !== undefined) {
      pageToUse = page;
    } else if (router.query.page) {
      const pageFromQuery = parseInt(router.query.page as string, 10);
      if (!isNaN(pageFromQuery) && pageFromQuery > 0) {
        pageToUse = pageFromQuery;
      }
    }

    setLoading(true);
    try {
      const res = await getVerifierLoansApi(pageToUse, pageSize, {
        applicationNumber: searchApplicationNumber,
        applicantName: searchApplicantName,
      });
      const responseData = res?.data?.data || res?.data || res;
      const items = responseData?.items || responseData?.data || [];
      const meta = responseData?.meta || {
        total: items.length,
        page: pageToUse,
        limit: pageSize,
        totalPages: Math.ceil(items.length / pageSize),
      };

      setLoans(Array.isArray(items) ? items : []);
      setPaginationMeta(meta);
      setCurrentPage(pageToUse);
    } catch (err) {
      console.log(err);
      setLoans([]);
      setPaginationMeta({
        total: 0,
        page: 1,
        limit: pageSize,
        totalPages: 0,
      });
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [
    router.isReady,
    router.query.page,
    currentDepartment,
    pageSize,
    searchApplicationNumber,
    searchApplicantName,
  ]);

  useEffect(() => {
    fetchLoans();
  }, [
    router.isReady,
    router.query.page,
    currentDepartment,
    pageSize,
    searchApplicationNumber,
    searchApplicantName,
    fetchLoans,
  ]);

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
          return (
            <Tag key={type.key} color={isCompleted ? "geekblue" : "orange"}>
              {type.label}{" "}
              {approvedStatus ? (
                <CheckOutlined
                  style={{
                    color: approvedStatus === "Positive" ? "green" : "red",
                  }}
                  // color={approvedStatus === "Positive" ? "green" : "red"}
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
                  color: searchApplicationNumber ? "#1890ff" : undefined,
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
      render: (text) => text ?? "-",
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
                  color: searchApplicantName ? "#1890ff" : undefined,
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
      title: "Investigations",
      dataIndex: "status",
      key: "status",
      render: (_, record) => getStatusTags(record),
      width: 200,
    },
    {
      title: "Updated At",
      key: "updatedAt",
      render: (_, record) => {
        const latest =
          record?.verifications?.[0]?.updatedAt ?? record?.updatedAt;
        return latest ? dayjs(latest).fromNow() : "-";
      },
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const enabledStatuses = ["FVCompleted", "BackendCompleted", "Completed"];
        const verifications = record?.verifications || [];
        const hasFeSubmission = verifications.some(
          (v: any) =>
            v?.initialSubmitted === true ||
            v?.status === "Completed" ||
            v?.status === "FVCompleted"
        );

        const isEnabled =
          record?.department === "FI"
            ? hasFeSubmission
            : hasFeSubmission || enabledStatuses.includes(record?.status ?? "");

        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              if (isEnabled) {
                record?.id &&
                  router?.push?.(`/verify/${record.id}?page=${currentPage}`);
              }
            }}
            disabled={!isEnabled}
          >
            View
          </Button>
        );
      },
      width: 100,
      fixed: "right",
    },
  ];

  // Table pagination config
  const paginationConfig =
    paginationMeta.totalPages > 0
      ? {
          current: currentPage,
          pageSize: paginationMeta.limit,
          total: paginationMeta.total,
          showSizeChanger: false,
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} of ${total} items`,
          position: ["bottomCenter" as "bottomCenter"],
          onChange: (page: number) => {
            setCurrentPage(page);
            router.replace(
              {
                pathname: router.pathname,
                query: { ...router.query, page },
              },
              undefined,
              { shallow: true }
            );
            fetchLoans(page);
          },
        }
      : false;

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, page: 1 },
      },
      undefined,
      { shallow: true }
    );
  }, [searchApplicationNumber, searchApplicantName]);

  return (
    <DashboardLayout>
      <Card>
        <div
          style={{
            marginTop: 16,
            marginBottom: 16,
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {/* <Badge color="green" text="Completed - Positive" /> */}
            <div style={{ gap: 2 }}>
              <CheckOutlined style={{ color: "green" }} /> Completed - Positive
            </div>
            {/* <Badge color="red" text="Completed - Negative" /> */}
            <div style={{ gap: 2 }}>
              <CheckOutlined style={{ color: "red" }} /> Completed - Negative
            </div>

            {/* <Badge color="green" text="Investigations completed" /> */}
            {/* <Tag color="green">Investigations Completed</Tag> */}
            {/* <Badge color="orange" text="In Progress" />
            <Badge color="default" text="Pending" /> */}
          </div>
        </div>
        <Table
          className="striped-table"
          // rowClassName={(_,index)=>index%2===0?"":"striped-row"}
          columns={columns}
          dataSource={loans}
          rowKey={(record) =>
            record?.id?.toString() ?? Math.random().toString()
          }
          loading={loading}
          pagination={paginationConfig}
          // size="small"
          // scroll={{ y: 400 }}
          sticky
          bordered
        />
      </Card>
    </DashboardLayout>
  );
}
