import { useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Select,
  message,
  Typography,
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/utils/axios";

const { Title } = Typography;

interface Loan {
  id: number;
  applicationNumber: string;
  applicantName: string;
  loanType: string;
  bankName: string;
  status: string;
  createdAt: string;
  fieldExecutives: {
    id: number;
    fieldExecutive: {
      id: number;
      name: string;
    };
    status: string;
  }[];
}

interface FieldExecutive {
  id: number;
  name: string;
}

export default function ManageLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [form] = Form.useForm();

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/loans", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLoans(response.data);
    } catch (error) {
      message.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const fetchFieldExecutives = async () => {
    try {
      const response = await api.get("/api/users/field-executives", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFieldExecutives(response.data);
    } catch (error) {
      message.error("Failed to fetch field executives");
    }
  };

  useEffect(() => {
    fetchLoans();
    fetchFieldExecutives();
  }, []);

  const handleAssign = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await api.post(`/api/loans/${selectedLoan?.id}/assign`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("Field executive assigned successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchLoans();
    } catch (error) {
      message.error("Failed to assign field executive");
    }
  };

  const columns = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
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
    },
    {
      title: "Field Executives",
      dataIndex: "fieldExecutives",
      key: "fieldExecutives",
      render: (fieldExecutives: Loan["fieldExecutives"]) => (
        <Space direction="vertical">
          {fieldExecutives.map((fe) => (
            <Tag
              key={fe.id}
              color={fe.status === "Completed" ? "success" : "processing"}
            >
              {fe.fieldExecutive.name} ({fe.status})
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Loan) => (
        <Space>
          {record.status === "Pending" && (
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => handleAssign(record)}
            >
              Assign
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Card>
        <Table
          columns={columns}
          dataSource={loans}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Assign Field Executive"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fieldExecutiveId"
            label="Field Executive"
            rules={[
              { required: true, message: "Please select a field executive" },
            ]}
          >
            <Select
              placeholder="Select field executive"
              options={fieldExecutives.map((fe) => ({
                label: fe.name,
                value: fe.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
