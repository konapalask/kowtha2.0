import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, DatePicker } from "antd";
import {
  FileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  // CalendarOutlined,
} from "@ant-design/icons";
// import DashboardLayout from "@/components/layout/DashboardLayout";
// import api from "@/utils/axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";
import { getDashboardMetrics } from "@/services/dashboard.services";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Attendance from "@/components/attendance/Attendance";

interface DashboardMetrics {
  totalLoans: number | null | undefined;
  totalVerifications: number | null | undefined;
  pendingVerifications: number | null | undefined;
  completedVerifications: number | null | undefined;
  // percentages: {
  //   verified: number | null | undefined;
  //   rejected: number | null | undefined;
  //   pending: number | null | undefined;
  // };
}

const DashboardLayout = dynamic(
  () => import("@/components/layout/DashboardLayout"),
  { ssr: false }
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLoans: 0,
    totalVerifications: 0,
    pendingVerifications: 0,
    completedVerifications: 0,
    // percentages: {
    //   verified: 0,
    //   rejected: 0,
    //   pending: 0,
    // },
  });

  // const [pendingLoans, setPendingLoans] = useState<any[]>([]);
  // const [processingStats, setProcessingStats] = useState<any[]>([]);
  // const [employeeStats, setEmployeeStats] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(() => {
    const endDate = dayjs();
    const startDate = dayjs().startOf("month");
    return [startDate, endDate];
  });

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
      fetchMetrics(dates[0], dates[1]);
    }
  };

  const fetchMetrics = async (
    startDate?: dayjs.Dayjs | null,
    endDate?: dayjs.Dayjs | null
  ) => {
    try {
      const response = await getDashboardMetrics({
        fromDate: dayjs(startDate).format("YYYY-MM-DD") || null,
        toDate: dayjs(endDate).format("YYYY-MM-DD") || null,
      });
      setMetrics(response);

      // Use dummy data if API fails or for development
      // const pendingLoansData = response.data.allLoans || DUMMY_RECENT_LOANS;
      // setPendingLoans(
      //   pendingLoansData
      //     .filter((l: any) => l.status === "Pending")
      //     .sort(
      //       (a: any, b: any) =>
      //         new Date(a.createdAt).getTime() -
      //         new Date(b.createdAt).getTime()
      //     )
      //     .slice(0, 10)
      // );

      // Use dummy data for processing stats
      // console.log(response)
      // setProcessingStats([
      //   { status: "Pending", count: response.percentages.pending },
      //   { status: "Verified", count: response.percentages.verified },
      //   { status: "Rejected", count: response.percentages.rejected },
      // ]);

      // Use dummy data for employee stats
      // setEmployeeStats(response?.employeeStats||[]);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  useEffect(() => {
    fetchMetrics(dateRange?.[0], dateRange?.[1]);
  }, []);

  // const pendingLoansColumns = [
  //   {
  //     title: "Application Number",
  //     dataIndex: "applicationNumber",
  //     key: "applicationNumber",
  //     width: 150,
  //   },
  //   {
  //     title: "Applicant Name",
  //     dataIndex: "applicantName",
  //     key: "applicantName",
  //     width: 150,
  //   },
  //   {
  //     title: "Loan Type",
  //     dataIndex: "type",
  //     key: "type",
  //     width: 150,
  //   },
  //   {
  //     title: "Amount",
  //     dataIndex: "amount",
  //     key: "amount",
  //     render: (amount: number) => `₹${amount.toLocaleString()}`,
  //     width: 150,
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     key: "status",
  //     render: (status: string) => (
  //       <Tag
  //         color={
  //           status === "Pending"
  //             ? "orange"
  //             : status === "Verified"
  //             ? "green"
  //             : "red"
  //         }
  //       >
  //         {status}
  //       </Tag>
  //     ),
  //     width: 150,
  //   },
  //   {
  //     title: "Created At",
  //     dataIndex: "createdAt",
  //     key: "createdAt",
  //     render: (date: string) => new Date(date).toLocaleDateString(),
  //     width: 150,
  //   },
  // ];

  return (
    <DashboardLayout>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <DatePicker.RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          allowClear={false}
          ranges={{
            "Last 7 Days": [dayjs().subtract(7, "day"), dayjs()],
            "Last 30 Days": [dayjs().subtract(30, "day"), dayjs()],
            "Last 6 Months": [dayjs().subtract(6, "month"), dayjs()],
            "This Year": [dayjs().startOf("year"), dayjs()],
          }}
          style={{ width: "280px" }}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col sm={12} md={12} lg={6}>
          <Card
            style={{
              height: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderColor: "none",
              background:
                "linear-gradient(90deg, #4facfe 0%,rgba(7, 220, 231, 0.69) 100%)",
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
                  color: "#fff",
                }}
              >
                <FileOutlined style={{ fontSize: "24px", color: "#fff" }} />
              </div>
              <div>
                <Statistic
                  title={
                    <Typography
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Total Loans
                    </Typography>
                  }
                  value={metrics?.totalLoans ?? 0}
                  valueStyle={{
                    color: "#fff",
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
              // borderColor: "#F44336",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
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
                  style={{ fontSize: "24px", color: "#fff" }}
                />
              </div>
              <div>
                <Statistic
                  title={
                    <Typography
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Total Verifications
                    </Typography>
                  }
                  value={metrics?.totalVerifications ?? 0}
                  valueStyle={{
                    color: "#fff",
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
              // borderColor: "#FFC107",
              background: "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)",
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
                  style={{ fontSize: "24px", color: "#fff" }}
                />
              </div>
              <div>
                <Statistic
                  title={
                    <Typography
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Pending Verifications
                    </Typography>
                  }
                  value={metrics?.pendingVerifications ?? 0}
                  valueStyle={{
                    color: "#fff",
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
              // borderColor: "#2196F3",
              background:
                "linear-gradient(90deg, #43e97b 0%,rgb(66, 238, 206) 100%)",
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
                  style={{ fontSize: "24px", color: "#fff" }}
                />
              </div>
              <div>
                <Statistic
                  title={
                    <Typography
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Completed Verifications
                    </Typography>
                  }
                  value={metrics?.completedVerifications ?? 0}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
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
                  label={({ _, percent }) => ` ${(percent * 100).toFixed(0)}%`}
                >
                  {processingStats.map((_, index) => {
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
                 <Bar dataKey="pending" name="Pending" fill="#FFC107" />
                <Bar dataKey="verified" name="Verified" fill="#2196F3" />
                <Bar dataKey="rejected" name="Rejected" fill="#F44336" /> 
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row> */}
      <Attendance dateRange={dateRange} />
    </DashboardLayout>
  );
}
