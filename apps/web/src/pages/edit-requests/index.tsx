import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Tag, Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { EyeOutlined } from "@ant-design/icons";
import { getAllEditRequestsApi } from "@/services/verifier.services";

const { Title } = Typography;

interface EditRequest {
  id: string;
  loanId: string;
  applicantName: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  status: "Pending" | "Approved" | "Rejected";
  requestedBy: string;
  requestedAt: string;
}

const EditRequests: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editRequests, setEditRequests] = useState<EditRequest[]>([
    // {
    //   id: "1",
    //   loanId: "1001",
    //   applicantName: "Alice Smith",
    //   fieldName: "Email",
    //   oldValue: "alice.old@email.com",
    //   newValue: "alice.new@email.com",
    //   status: "pending",
    //   requestedBy: "Verifier1",
    //   requestedAt: "2025-05-25T10:00:00Z",
    // },
    // {
    //   id: "2",
    //   loanId: "1002",
    //   applicantName: "Bob Johnson",
    //   fieldName: "City",
    //   oldValue: "New York",
    //   newValue: "San Francisco",
    //   status: "approved",
    //   requestedBy: "Verifier2",
    //   requestedAt: "2025-05-24T15:30:00Z",
    // },
  ]);

  const fetchEditRequests = async () => {
    setLoading(true);
    try {
      const response = await getAllEditRequestsApi();
      console.log(response.data);
      setEditRequests(response.data);
    } catch (error) {
      console.error("Error fetching edit requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditRequests();
  }, []);

  const columns: ColumnsType<EditRequest> = [
    {
      title: "Loan ID",
      dataIndex: "loanId",
      key: "loanId",
      // render: (text) => (
      //   <Button type="link" onClick={() => router.push(`/loans/${text}`)}>
      //     {text}
      //   </Button>
      // ),
    },
    // {
    //   title: "Applicant Name",
    //   dataIndex: "applicantName",
    //   key: "applicantName",
    // },
    // {
    //   title: "Field",
    //   dataIndex: "fieldName",
    //   key: "fieldName",
    // },
    // {
    //   title: 'Old Value',
    //   dataIndex: 'oldValue',
    //   key: 'oldValue',
    //   ellipsis: true,
    // },
    // {
    //   title: 'New Value',
    //   dataIndex: 'newValue',
    //   key: 'newValue',
    //   ellipsis: true,
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap: any = {
          Pending: "orange",
          Approved: "green",
          Rejected: "red",
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Requested By",
      dataIndex: "requestedBy",
      key: "requestedBy",
    },
    {
      title: "Requested At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "Pending" && (
          <Space size="middle">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() =>
                record?.id &&
                router?.push?.(
                  `/edit-requests/${record.id}/loan-id/${record.loanId}`
                )
              }
            />
          </Space>
        ),
      align: "center",
    },
  ];

  useEffect(() => {
    const fetchEditRequests = async () => {
      setLoading(true);
      try {
        // const response = await getEditRequestsApi();
        // setEditRequests(response.data);
      } catch (error) {
        console.error("Error fetching edit requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEditRequests();
  }, []);

  return (
    <DashboardLayout>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={4}>Edit Requests</Title>
          <Table
            columns={columns}
            dataSource={editRequests}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
          />
        </Space>
      </Card>
    </DashboardLayout>
  );
};

export default EditRequests;
