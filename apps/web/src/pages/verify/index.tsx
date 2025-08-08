import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Table, Card, Button, Space, Tag, Typography, Badge } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  EyeOutlined,
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

  // Pagination state
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Restore page from query string on mount
  useEffect(() => {
    if (router.query.page) {
      const page = parseInt(router.query.page as string, 10);
      if (!isNaN(page)) setCurrentPage(page);
    }
  }, [router.query.page]);

  useEffect(() => {
    getVerifierLoansApi()
      ?.then((res: any) => {
        setLoans(res?.data?.data ?? []);
      })
      ?.catch((err) => {
        console.log(err);
      });
  }, []);

  const filteredLoans =
    loans?.filter((loan) =>
      [
        "Unassigned",
        "Assigned",
        "FVCompleted",
        "Approved",
        "Rejected",
        "Pending",
      ].includes(loan?.status ?? "")
    ) ?? [];

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

  const columns: ColumnsType<LoanData> = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      width: 150,
      render: (text) => text ?? "-",
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
      width: 150,
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
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date?: string) => (date ? dayjs(date).fromNow() : "-"),
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const statusTags = getStatusTags(record);
        const hasInvestigations = statusTags && statusTags.props && statusTags.props.children && statusTags.props.children.some((child: any) => child !== null);
        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              if (hasInvestigations) {
                record?.id && router?.push?.(`/verify/${record.id}?page=${currentPage}`);
              }
            }}
            disabled={!hasInvestigations}
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
    filteredLoans.length >= pageSize
      ? {
          current: currentPage,
          pageSize,
          showSizeChanger: false,
          showTotal: (total: number) => `Total ${total ?? 0} items`,
          position: ["bottomCenter" as "bottomCenter"],
          onChange: (page: number) => {
            setCurrentPage(page);
            // Update query string
            router.replace({
              pathname: router.pathname,
              query: { ...router.query, page },
            }, undefined, { shallow: true });
          },
        }
      : false;

  return (
    <DashboardLayout>
      <Card>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
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
        <Table
          className="striped-table"
          // rowClassName={(_,index)=>index%2===0?"":"striped-row"}
          columns={columns}
          dataSource={filteredLoans}
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
