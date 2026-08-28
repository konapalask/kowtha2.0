"use client";
import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Tag, Space, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "@/utils/router";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  getAllEditRequestsApi,
  updateEditRequestApi,
} from "@/services/verifier.services";
import { useDepartmentChange } from "@/utils/utility";
import dayjs from "dayjs";

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
  const [loginRequests, setLoginRequests] = useState<any>([]);
  const currentDepartment = useDepartmentChange();

  const fetchEditRequests = async () => {
    setLoading(true);
    try {
      const response = await getAllEditRequestsApi();
      const data = response?.data ?? [];

      const loanRequests = data.filter((req: any) => req?.type !== "Login");
      const loginRequests = data.filter((req: any) => req?.type === "Login");

      // console.log({ loanRequests, loginRequests });

      setEditRequests(loanRequests);
      setLoginRequests(loginRequests);
    } catch (error) {
      console.error("Error fetching edit requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditRequests();
  }, [currentDepartment]); // Add currentDepartment as dependency

  console.log(editRequests);

  const columns: ColumnsType<EditRequest> = [
    {
      title: "Application Number",
      dataIndex: ["loan", "applicationNumber"],
      key: "applicationNumber",
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
      dataIndex: ["requester", "employeeCode"],
      key: "requestedBy",
    },
    {
      title: "Requested At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
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

  const handleApprove = async (record: LoginRequest) => {
    try {
      const response = await updateEditRequestApi(record?.id, {
        status: "Approved",
      });
      // console.log(response);
      message.success("Approved Successfully");
      fetchEditRequests();
    } catch (error: any) {
      console.log(`Error:${error}`);
      message.error(
        error?.response?.data?.message || "Failed to approve this request"
      );
    }
  };

  const handleReject = async (record: LoginRequest) => {
    try {
      const response = await updateEditRequestApi(record?.id, {
        status: "Rejected",
      });
      // console.log(response);
      message.success("Rejected Successfully");
      fetchEditRequests();
    } catch (error: any) {
      console.log(`Error:${error}`);
      message.error(
        error?.response?.data?.message || "Failed to reject this request"
      );
    }
  };

  const loginRequestColumns: ColumnsType<LoginRequest> = [
    {
      title: "Employee Code",
      dataIndex: ["requester", "employeeCode"],
      key: "employeeCode",
    },
    {
      title: "Name",
      dataIndex: ["requester", "name"],
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: ["requester", "mobile"],
      key: "phoneNumber",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={
              <CheckCircleOutlined
                style={{ color: "#52c41a", fontSize: "20px" }}
              />
            }
            onClick={() => handleApprove(record)}
          />
          <Button
            type="text"
            icon={
              <CloseCircleOutlined
                style={{ color: "#ff4d4f", fontSize: "20px" }}
              />
            }
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
              className="striped-table"
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
              bordered
            />
          </Space>
        </Card>

        <Card title="Login Requests">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Table
              className="striped-table"
              columns={loginRequestColumns}
              dataSource={loginRequests}
              rowKey="id"
              pagination={false}
              bordered
            />
          </Space>
        </Card>
      </Space>
    </DashboardLayout>
  );
};

export default EditRequests;
