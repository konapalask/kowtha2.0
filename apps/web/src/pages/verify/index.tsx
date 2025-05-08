import { useState } from "react";
import { Table, Card, Button, Space, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

dayjs.extend(relativeTime);

const { Title } = Typography;
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Loan {
  id: number;
  applicationNumber: string;
  applicantName: string;
  status: string;
  uploadedAt: string;
  updatedAt: string;
  documents: string[];
}

export default function Verify() {
  const [loading, setLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 1,
      applicationNumber: "LOAN-001",
      applicantName: "John Doe",
      status: "FVCompleted",
      uploadedAt: "2024-03-20T10:00:00Z",
      updatedAt: "2024-03-20T10:00:00Z",
      documents: ["document1.pdf", "document2.pdf"],
    },
    {
      id: 2,
      applicationNumber: "LOAN-002",
      applicantName: "Jane Smith",
      status: "Approved",
      uploadedAt: "2024-03-19T15:30:00Z",
      updatedAt: "2024-03-20T09:15:00Z",
      documents: ["document3.pdf", "document4.pdf"],
    },
  ]);

  const router = useRouter();

  const filteredLoans = loans.filter((loan) =>
    ["FVCompleted", "Approved", "Rejected"].includes(loan.status)
  );

  const columns: ColumnsType<Loan> = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      width: 150,
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "Pending") color = "orange";
        else if (status === "Approved") color = "green";
        else if (status === "Rejected") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
      width: 150,
    },
    {
      title: "Uploaded At",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      render: (date: string) => dayjs(date).fromNow(),
      width: 150,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => dayjs(date).fromNow(),
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/verify/${record.id}`)}
        >
          View
        </Button>
      ),
      width: 100,
      fixed: "right",
    },
  ];

  return (
    <DashboardLayout>
      <Card>
        <Table
          columns={columns}
          dataSource={filteredLoans}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            position: ["bottomCenter"],
          }}
          size="small"
          scroll={{ y: 400 }}
        />
      </Card>
    </DashboardLayout>
  );
}
