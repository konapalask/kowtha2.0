import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Tag, Space, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
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

interface LoginRequest {
  id: string;
  employeeCode: string;
  name: string;
  phoneNumber: string;
}

const EditRequests: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editRequests, setEditRequests] = useState<EditRequest[]>([]);
  
  // Add dummy login requests data
  const [loginRequests] = useState<LoginRequest[]>([
    {
      id: "1",
      employeeCode: "EMP001",
      name: "John Doe",
      phoneNumber: "+91 9876543210",
    },
    {
      id: "2",
      employeeCode: "EMP002",
      name: "Jane Smith",
      phoneNumber: "+91 9876543211",
    },
    {
      id: "3",
      employeeCode: "EMP003",
      name: "Mike Johnson",
      phoneNumber: "+91 9876543212",
    },
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

  const handleApprove = (record: LoginRequest) => {
    message.success(`Login request for ${record.name} approved`);
  };

  const handleReject = (record: LoginRequest) => {
    message.success(`Login request for ${record.name} rejected`);
  };

  const loginRequestColumns: ColumnsType<LoginRequest> = [
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      key: "employeeCode",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />}
            onClick={() => handleApprove(record)}
          />
          <Button
            type="text"
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />}
            onClick={() => handleReject(record)}
          />
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <DashboardLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="Edit Requests">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* <Title level={4}>Edit Requests</Title> */}
            <Table
              columns={columns}
              dataSource={editRequests}
              loading={loading}
              rowKey="id"
              pagination={false}
              // pagination={{
              //   pageSize: 10,
              //   showSizeChanger: true,
              //   showTotal: (total) => `Total ${total} items`,
              // }}
            />
          </Space>
        </Card>

        <Card title="Login Requests">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* <Title level={4}>Login Requests</Title> */}
            <Table
              columns={loginRequestColumns}
              dataSource={loginRequests}
              rowKey="id"
              pagination={false}
              // pagination={{
              //   pageSize: 10,
              //   showSizeChanger: true,
              //   showTotal: (total) => `Total ${total} items`,
              // }}
            />
          </Space>
        </Card>
      </Space>
    </DashboardLayout>
  );
};

export default EditRequests;
