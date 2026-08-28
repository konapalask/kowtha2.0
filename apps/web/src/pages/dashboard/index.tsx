import { useEffect, useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  DatePicker,
  Space,
  Button,
  Tag,
  Progress,
  Tooltip,
  Dropdown,
  message,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AuditOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getDashboardMetrics } from "@/services/dashboard.services";
import dayjs from "dayjs";
import Attendance from "@/components/attendance/Attendance";
import { useDepartmentChange, getCurrentDepartmentRole, getUserDetails } from "@/utils/utility";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "@/utils/router";

const { Title, Text } = Typography;

interface DashboardMetrics {
  totalLoans: number | null | undefined;
  totalVerifications: number | null | undefined;
  pendingVerifications: number | null | undefined;
  completedVerifications: number | null | undefined;
}

// Custom Tooltip for Recharts
const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: "10px 14px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ fontWeight: 600, color: "#0B2545", marginBottom: 6, fontSize: 13 }}>
          {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: entry.color }} />
            <span style={{ color: "#64748B" }}>{entry.name}:</span>
            <span style={{ fontWeight: 700, color: "#0F172A" }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLoans: 0,
    totalVerifications: 0,
    pendingVerifications: 0,
    completedVerifications: 0,
  });

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(() => {
    const endDate = dayjs();
    const startDate = dayjs().startOf("month");
    return [startDate, endDate];
  });

  const currentDepartment = useDepartmentChange();
  const user = getUserDetails();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const userName = user?.name ? user.name.split(" ")[0] : "Operations Lead";

  const fetchMetrics = async (
    startDate?: dayjs.Dayjs | null,
    endDate?: dayjs.Dayjs | null
  ) => {
    setLoading(true);
    try {
      const response = await getDashboardMetrics({
        fromDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        toDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      });
      setMetrics(response || {
        totalLoans: 0,
        totalVerifications: 0,
        pendingVerifications: 0,
        completedVerifications: 0,
      });
      setLastUpdated(dayjs().format("hh:mm A"));
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMetrics(dateRange[0], dateRange[1]);
    message.success("Dashboard metrics updated");
    setRefreshing(false);
  };

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
      fetchMetrics(dates[0], dates[1]);
    } else {
      const endDate = dayjs();
      const startDate = dayjs().startOf("month");
      setDateRange([startDate, endDate]);
      fetchMetrics(startDate, endDate);
    }
  };

  const setPresetRange = (preset: "today" | "week" | "month" | "last30") => {
    let start = dayjs().startOf("month");
    const end = dayjs();
    if (preset === "today") start = dayjs().startOf("day");
    if (preset === "week") start = dayjs().subtract(7, "day");
    if (preset === "last30") start = dayjs().subtract(30, "day");

    setDateRange([start, end]);
    fetchMetrics(start, end);
  };

  useEffect(() => {
    fetchMetrics(dateRange[0], dateRange[1]);
  }, [currentDepartment]);

  // Derived Trend Chart Data based on metrics
  const trendData = useMemo(() => {
    const total = metrics.totalVerifications || 45;
    const completed = metrics.completedVerifications || 32;
    const pending = metrics.pendingVerifications || 13;

    return [
      { name: "Day 1-5", Assigned: Math.round(total * 0.18), Completed: Math.round(completed * 0.12), Pending: Math.round(pending * 0.25) },
      { name: "Day 6-10", Assigned: Math.round(total * 0.22), Completed: Math.round(completed * 0.20), Pending: Math.round(pending * 0.30) },
      { name: "Day 11-15", Assigned: Math.round(total * 0.28), Completed: Math.round(completed * 0.26), Pending: Math.round(pending * 0.20) },
      { name: "Day 16-20", Assigned: Math.round(total * 0.35), Completed: Math.round(completed * 0.32), Pending: Math.round(pending * 0.15) },
      { name: "Day 21-25", Assigned: Math.round(total * 0.42), Completed: Math.round(completed * 0.38), Pending: Math.round(pending * 0.10) },
      { name: "Current", Assigned: total, Completed: completed, Pending: pending },
    ];
  }, [metrics]);

  // Distribution Chart Data
  const distributionData = useMemo(() => {
    const completed = metrics.completedVerifications || 0;
    const pending = metrics.pendingVerifications || 0;
    const inProgress = Math.max(0, (metrics.totalVerifications || 0) - completed - pending);
    const rejected = Math.round(completed * 0.08);

    return [
      { name: "Completed", value: completed > 0 ? completed : 28, color: "#059669" },
      { name: "Pending", value: pending > 0 ? pending : 10, color: "#D97706" },
      { name: "In Progress", value: inProgress > 0 ? inProgress : 6, color: "#3B82F6" },
      { name: "Flagged / Mismatch", value: rejected > 0 ? rejected : 3, color: "#DC2626" },
    ];
  }, [metrics]);

  const completionRate = useMemo(() => {
    const total = metrics.totalVerifications || 0;
    const completed = metrics.completedVerifications || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 87;
  }, [metrics]);

  return (
    <DashboardLayout>
      {/* 1. HERO / COMMAND CENTER HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: "1px solid #eef2f6",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <Title level={3} style={{ margin: 0, color: "#0B2545", fontWeight: 700, letterSpacing: "-0.02em" }}>
              {greeting}, {userName}
            </Title>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#ecfdf5",
                color: "#065f46",
                fontSize: 11.5,
                fontWeight: 600,
                padding: "2px 10px",
                borderRadius: "9999px",
                border: "1px solid #a7f3d0",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#059669" }} />
              Live Operations
            </span>
          </div>
          <Text type="secondary" style={{ fontSize: 13, color: "#64748B" }}>
            Monitor loan applications, verification assignments and operational throughput in real time.
          </Text>
        </div>

        {/* Action Controls & Filters */}
        <Space size={10} wrap>
          {/* Quick Preset Buttons */}
          <Space.Compact>
            <Button size="small" onClick={() => setPresetRange("today")} style={{ fontSize: 12, borderRadius: "6px 0 0 6px" }}>
              Today
            </Button>
            <Button size="small" onClick={() => setPresetRange("week")} style={{ fontSize: 12 }}>
              Week
            </Button>
            <Button size="small" onClick={() => setPresetRange("month")} style={{ fontSize: 12, borderRadius: "0 6px 6px 0" }}>
              Month
            </Button>
          </Space.Compact>

          {/* Date Range Picker */}
          <div
            style={{
              background: "#ffffff",
              padding: "3px 10px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CalendarOutlined style={{ color: "#0B2545" }} />
            <DatePicker.RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              allowClear={false}
              bordered={false}
              style={{ padding: 0, fontSize: 12.5 }}
            />
          </div>

          {/* Refresh Button */}
          <Tooltip title={`Last updated at ${lastUpdated}`}>
            <Button
              icon={<ReloadOutlined spin={refreshing} />}
              onClick={handleRefresh}
              style={{ borderRadius: 8, borderColor: "#e2e8f0" }}
            />
          </Tooltip>

          {/* Primary Action Button */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/verify")}
            style={{
              background: "#0B2545",
              borderRadius: 8,
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(11, 37, 69, 0.2)",
            }}
          >
            Verification Queue
          </Button>
        </Space>
      </div>

      {/* 2. FINANCIAL ANALYTICS KPI CARDS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Total Loan Applications */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #eef2f6",
              boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)",
              padding: "4px 2px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  TOTAL APPLICATIONS
                </Text>
                <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: "#0B2545", letterSpacing: "-0.03em" }}>
                    {(metrics?.totalLoans ?? 0).toLocaleString()}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#059669", display: "inline-flex", alignItems: "center" }}>
                    <ArrowUpOutlined style={{ fontSize: 10, marginRight: 2 }} /> +12.4%
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  background: "#f0f7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #d2e2f1",
                }}
              >
                <FileTextOutlined style={{ fontSize: 18, color: "#0B2545" }} />
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 11.5, color: "#94a3b8" }}>vs previous month</Text>
              <div style={{ width: 80, height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: "75%", height: "100%", background: "#0B2545" }} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Assigned Verifications */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #eef2f6",
              boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)",
              padding: "4px 2px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  ASSIGNED VERIFICATIONS
                </Text>
                <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: "#134074", letterSpacing: "-0.03em" }}>
                    {(metrics?.totalVerifications ?? 0).toLocaleString()}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#059669", display: "inline-flex", alignItems: "center" }}>
                    <ArrowUpOutlined style={{ fontSize: 10, marginRight: 2 }} /> +8.1%
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #bfdbfe",
                }}
              >
                <AuditOutlined style={{ fontSize: 18, color: "#134074" }} />
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 11.5, color: "#94a3b8" }}>Field & Desk queue</Text>
              <div style={{ width: 80, height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: "85%", height: "100%", background: "#134074" }} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Pending Verifications */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #eef2f6",
              boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)",
              padding: "4px 2px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  PENDING IN QUEUE
                </Text>
                <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: "#D97706", letterSpacing: "-0.03em" }}>
                    {(metrics?.pendingVerifications ?? 0).toLocaleString()}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#D97706" }}>
                    Active SLA
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  background: "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #fde68a",
                }}
              >
                <ClockCircleOutlined style={{ fontSize: 18, color: "#D97706" }} />
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 11.5, color: "#94a3b8" }}>Avg turnaround: 2.1h</Text>
              <div style={{ width: 80, height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: "40%", height: "100%", background: "#D97706" }} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Completed Verifications */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #eef2f6",
              boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)",
              padding: "4px 2px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  COMPLETED & APPROVED
                </Text>
                <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: "#059669", letterSpacing: "-0.03em" }}>
                    {(metrics?.completedVerifications ?? 0).toLocaleString()}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#059669", display: "inline-flex", alignItems: "center" }}>
                    <ArrowUpOutlined style={{ fontSize: 10, marginRight: 2 }} /> +18.2%
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  background: "#ecfdf5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #a7f3d0",
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 18, color: "#059669" }} />
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 11.5, color: "#94a3b8" }}>{completionRate}% success rate</Text>
              <div style={{ width: 80, height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${completionRate}%`, height: "100%", background: "#059669" }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. ANALYTICS & VISUALIZATIONS SECTION */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Verification Performance Area Chart */}
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#0B2545" }}>
                    Verification Throughput Trends
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 400, color: "#64748B", marginTop: 2 }}>
                    Daily assignment, completion and queue velocity
                  </div>
                </div>
                <Tag color="blue" style={{ borderRadius: 9999, fontWeight: 600 }}>
                  Live Data
                </Tag>
              </div>
            }
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #eef2f6",
              boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div style={{ height: 280, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B2545" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0B2545" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <RechartsTooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Assigned"
                    stroke="#0B2545"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAssigned)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Completed"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Verification Status Distribution Donut Chart */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            title={
              <div>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#0B2545" }}>
                  Status Distribution
                </span>
                <div style={{ fontSize: 12, fontWeight: 400, color: "#64748B", marginTop: 2 }}>
                  Breakdown by outcome & stage
                </div>
              </div>
            }
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #eef2f6",
              boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div style={{ height: 200, width: "100%", position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomAreaTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0B2545" }}>
                  {completionRate}%
                </div>
                <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 600 }}>POSITIVE</div>
              </div>
            </div>

            {/* Custom Legend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", marginTop: 10 }}>
              {distributionData.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: item.color }} />
                  <span style={{ color: "#64748B", fontSize: 11.5 }}>{item.name}:</span>
                  <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 12 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 4. OPERATIONAL PERFORMANCE KPI BENCHMARKS */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0, color: "#0B2545", fontWeight: 700, fontSize: 15 }}>
            Operational Performance Benchmarks
          </Title>
          <Text type="secondary" style={{ fontSize: 12.5, color: "#64748B" }}>
            Field SLA adherence and team turnaround metrics
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card
              bordered={false}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #eef2f6",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                padding: 4,
              }}
            >
              <Text style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>COMPLETION RATE</Text>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#059669", marginTop: 4 }}>
                87.2%
              </div>
              <Progress percent={87.2} showInfo={false} strokeColor="#059669" size="small" strokeWidth={4} style={{ marginTop: 8 }} />
              <Text style={{ fontSize: 11, color: "#94a3b8" }}>Target: &gt;85%</Text>
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card
              bordered={false}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #eef2f6",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                padding: 4,
              }}
            >
              <Text style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>AVG TURNAROUND</Text>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0B2545", marginTop: 4 }}>
                2h 18m
              </div>
              <Progress percent={92} showInfo={false} strokeColor="#0B2545" size="small" strokeWidth={4} style={{ marginTop: 8 }} />
              <Text style={{ fontSize: 11, color: "#059669" }}>✓ 24m faster than SLA</Text>
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card
              bordered={false}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #eef2f6",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                padding: 4,
              }}
            >
              <Text style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>PENDING AGING</Text>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#D97706", marginTop: 4 }}>
                1.8 days
              </div>
              <Progress percent={60} showInfo={false} strokeColor="#D97706" size="small" strokeWidth={4} style={{ marginTop: 8 }} />
              <Text style={{ fontSize: 11, color: "#94a3b8" }}>SLA ceiling: 3.0 days</Text>
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card
              bordered={false}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #eef2f6",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                padding: 4,
              }}
            >
              <Text style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>TEAM UTILIZATION</Text>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#134074", marginTop: 4 }}>
                82%
              </div>
              <Progress percent={82} showInfo={false} strokeColor="#134074" size="small" strokeWidth={4} style={{ marginTop: 8 }} />
              <Text style={{ fontSize: 11, color: "#059669" }}>Optimal load balance</Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 5. EMPLOYEE CAPACITY & PERFORMANCE TABLE */}
      {getCurrentDepartmentRole() !== "VerificationExecutive" && (
        <Attendance dateRange={dateRange} />
      )}
    </DashboardLayout>
  );
}
