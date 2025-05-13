import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Space, Typography } from "antd";
import {
  FileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
// import api from "@/utils/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import axiosInstance from "@/config/axios.config";

interface DashboardStats {
  totalLoans: number;
  verifiedLoans: number;
  rejectedLoans: number;
  pendingLoans: number;
  recentLoans: any[];
}

// Add this dummy data at the top of the file, after imports
const DUMMY_EMPLOYEE_STATS = [
  { name: "John Doe", completed: 12 },
  { name: "Jane Smith", completed: 8 },
  { name: "Amit Singh", completed: 5 },
  { name: "Rajesh Kumar", completed: 10 },
];

const DUMMY_RECENT_LOANS = [
  {
    id: 1,
    applicationNumber: "LVS-2024-001",
    applicantName: "Rajesh Kumar",
    status: "Pending",
    createdAt: "2024-03-15T10:30:00",
    amount: 500000,
    type: "Home Loan",
  },
  {
    id: 2,
    applicationNumber: "LVS-2024-002",
    applicantName: "Priya Sharma",
    status: "Verified",
    createdAt: "2024-03-14T15:45:00",
    amount: 300000,
    type: "Personal Loan",
  },
  {
    id: 3,
    applicationNumber: "LVS-2024-003",
    applicantName: "Mohammed Ali",
    status: "Rejected",
    createdAt: "2024-03-13T09:15:00",
    amount: 750000,
    type: "Business Loan",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLoans: 0,
    verifiedLoans: 0,
    rejectedLoans: 0,
    pendingLoans: 0,
    recentLoans: [],
  });

  const [pendingLoans, setPendingLoans] = useState<any[]>([]);
  const [processingStats, setProcessingStats] = useState<any[]>([]);
  const [employeeStats, setEmployeeStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/api/loans/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(response.data);

        // Use dummy data if API fails or for development
        const pendingLoansData = response.data.allLoans || DUMMY_RECENT_LOANS;
        setPendingLoans(
          pendingLoansData
            .filter((l: any) => l.status === "Pending")
            .sort(
              (a: any, b: any) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .slice(0, 10)
        );

        // Use dummy data for processing stats
        setProcessingStats([
          { status: "Pending", count: response.data.pendingLoans || 6 },
          { status: "Verified", count: response.data.verifiedLoans || 16 },
          { status: "Rejected", count: response.data.rejectedLoans || 3 },
        ]);

        // Use dummy data for employee stats
        setEmployeeStats(response.data.employeeStats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Fallback to dummy data if API fails
        setPendingLoans(
          DUMMY_RECENT_LOANS.filter((l) => l.status === "Pending")
        );
        setProcessingStats([
          { status: "Pending", count: 6 },
          { status: "Verified", count: 16 },
          { status: "Rejected", count: 3 },
        ]);
        setEmployeeStats(DUMMY_EMPLOYEE_STATS);
      }
    };

    fetchStats();
  }, []);

  const pendingLoansColumns = [
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
      title: "Loan Type",
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `₹${amount.toLocaleString()}`,
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "Pending"
              ? "orange"
              : status === "Verified"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
      width: 150,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      width: 150,
    },
  ];

  return (
    <DashboardLayout>
      <Row gutter={[16, 16]}>
        <Col sm={12} md={12} lg={6}>
          <Card
            style={{
              height: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderColor: "#145886",
              // backgroundColor: "rgba(20, 88, 134, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(20, 88, 134, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileOutlined style={{ fontSize: "24px", color: "#145886" }} />
              </div>
              <div>
                <Statistic
                  title={
                    <Typography
                      style={{
                        color: "#145886",
                        fontSize: "16px",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Total Loans
                    </Typography>
                  }
                  value={stats.totalLoans}
                  valueStyle={{
                    color: "#145886",
                    fontSize: "28px",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col sm={12} md={12} lg={6}>
          <Card
            style={{
              height: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderColor: "#2196F3",
              // backgroundColor: "rgba(33, 150, 243, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleOutlined
                  style={{ fontSize: "24px", color: "#2196F3" }}
                />
              </div>
              <div>
                <Statistic
                  title={
                    <Typography
                      style={{
                        color: "#2196F3",
                        fontSize: "16px",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Verified Loans
                    </Typography>
                  }
                  value={stats.verifiedLoans}
                  valueStyle={{
                    color: "#2196F3",
                    fontSize: "28px",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col sm={12} md={12} lg={6}>
          <Card
            style={{
              height: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderColor: "#F44336",
              // backgroundColor: "rgba(244, 67, 54, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CloseCircleOutlined
                  style={{ fontSize: "24px", color: "#F44336" }}
                />
              </div>
              <div>
                <Statistic
                  title={
                    <Typography
                      style={{
                        color: "#F44336",
                        fontSize: "16px",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Rejected Loans
                    </Typography>
                  }
                  value={stats.rejectedLoans}
                  valueStyle={{
                    color: "#F44336",
                    fontSize: "28px",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col sm={12} md={12} lg={6}>
          <Card
            style={{
              height: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderColor: "#FFC107",
              // backgroundColor: "rgba(255, 193, 7, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 193, 7, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ClockCircleOutlined
                  style={{ fontSize: "24px", color: "#FFC107" }}
                />
              </div>
              <div>
                <Statistic
                  title={
                    <Typography
                      style={{
                        color: "#FFC107",
                        fontSize: "16px",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Pending Loans
                    </Typography>
                  }
                  value={stats.pendingLoans}
                  valueStyle={{
                    color: "#FFC107",
                    fontSize: "28px",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Loans Pending Since Longest" style={{ marginTop: 16 }}>
        <Table
          columns={pendingLoansColumns}
          dataSource={pendingLoans}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ y: 200 }}
        />
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col md={24} lg={12}>
          <Card title="Loan Applications Being Processed">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={processingStats}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {processingStats.map((entry, index) => {
                    const COLORS = ["#FFC107", "#2196F3", "#F44336"];
                    return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col md={24} lg={12}>
          <Card title="Employee-wise Loans Completed">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={employeeStats}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#4CAF50" />
                {/* <Bar dataKey="pending" name="Pending" fill="#FFC107" />
                <Bar dataKey="verified" name="Verified" fill="#2196F3" />
                <Bar dataKey="rejected" name="Rejected" fill="#F44336" /> */}
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
