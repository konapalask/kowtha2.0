import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Table, Card, Button, Space, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
// import DashboardLayout from "@/components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import { getFieldExecutivesApi, getVerifierLoansApi } from "@/services/loans.services";

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

const DashboardLayout = dynamic(() => import("@/components/layout/DashboardLayout"), { ssr: false });

export default function Verify() {
  const [loading, setLoading] = useState(false);
  // const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loans, setLoans] = useState<LoanData[]>([]);

  // useEffect(() => {
  //   getFieldExecutivesApi()?.then((res) => {
  //     console.log(res)
  //   })?.catch((err) => {
  //     console.log(err)
  //   });
  // }, []);

  useEffect(() => {
    getVerifierLoansApi()?.then((res: any) => {
      setLoans(res?.data?.data ?? []);
    })?.catch((err) => {
      console.log(err)
    });
  }, []);

  const router = useRouter();

  const filteredLoans = loans?.filter((loan) =>
    ["Unassigned","Assigned", "FVCompleted", "Approved", "Rejected", "Pending"].includes(loan?.status ?? '')
  ) ?? [];

  const getStatusTags = (record: any) => {
  //  const 
  };
  const columns: ColumnsType<LoanData> = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      width: 150,
      render: (text) => text ?? '-'
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
      width: 150,
      render: (text) => text ?? '-'
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (_,record) => {
    //    return getStatusTag(record)
    //   },
    //   width: 150,
    // },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date?: string) => date ? dayjs(date).fromNow() : '-',
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
          onClick={() => record?.id && router?.push?.(`/verify/${record.id}`)}
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
          rowKey={(record) => record?.id?.toString() ?? Math.random().toString()}
          loading={loading}
          
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total ?? 0} items`,
            position: ["bottomCenter"],
          }}
          // size="small"
          // scroll={{ y: 400 }}
          sticky
        />
      </Card>
    </DashboardLayout>
  );
}
