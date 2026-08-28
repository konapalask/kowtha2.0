import { getAttendanceRecodsApi } from "@/services/attendance.services";
import { useDepartmentChange, getCurrentDepartment } from "@/utils/utility";
import {
  Table,
  Input,
  Select,
  Tag,
  Space,
  Badge,
  message,
  Typography,
  Card,
  Button,
  Progress,
  Avatar,
  Drawer,
  Descriptions,
  Divider,
  Statistic,
  Row,
  Col,
  Tooltip,
} from "antd";
import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  SearchOutlined,
  DownloadOutlined,
  UserOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PhoneOutlined,
  IdcardOutlined,
  FireOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";

const { Title, Text } = Typography;

interface AttendanceProps {
  dateRange: [any, any];
}

interface AttendanceRecord {
  userId: number;
  user: {
    id: number;
    name: string;
    mobile: string;
    role: string;
    employeeCode?: string;
  };
  totalDays: number;
  presentDays: number;
  absentDays: number;
  totalAssigned: number;
  completedVerifications: number;
  pendingVerifications: number;
  inProgressVerifications: number;
  availableToday: boolean;
}

export default function Attendance({ dateRange }: AttendanceProps) {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedEmployee, setSelectedEmployee] = useState<AttendanceRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentDepartment = useDepartmentChange();

  const fetchAttendanceRecords = async () => {
    const department = getCurrentDepartment();
    if (!department) return;
    setLoading(true);
    try {
      const [start, end] = dateRange || [];
      const params: any = {
        startDate: start ? dayjs(start).format("YYYY-MM-DD") : undefined,
        endDate: end ? dayjs(end).format("YYYY-MM-DD") : undefined,
      };
      const response = await getAttendanceRecodsApi(params);
      setData(response?.data?.data?.userStatistics || []);
    } catch (error: any) {
      console.error("Failed to fetch attendance records", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const department = getCurrentDepartment();
    if (!department) return;
    fetchAttendanceRecords();
  }, [dateRange, currentDepartment]);

  const filteredData = useMemo(() => {
    return data.filter((rec) => {
      const matchesSearch =
        !searchQuery ||
        rec.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.user?.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.user?.mobile?.includes(searchQuery);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && rec.availableToday) ||
        (statusFilter === "OFFLINE" && !rec.availableToday);

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const handleExport = () => {
    if (filteredData.length === 0) {
      message.warning("No data to export");
      return;
    }

    const exportRows = filteredData.map((rec) => {
      const rate =
        rec.totalAssigned > 0
          ? Math.round((rec.completedVerifications / rec.totalAssigned) * 100)
          : 0;
      return {
        "Employee Name": rec.user?.name || "N/A",
        "Employee Code": rec.user?.employeeCode || "N/A",
        "Mobile": rec.user?.mobile || "N/A",
        "Role": rec.user?.role || "Field Executive",
        "Total Assigned": rec.totalAssigned || 0,
        "Pending": rec.pendingVerifications || 0,
        "Completed": rec.completedVerifications || 0,
        "Absent Days": rec.absentDays || 0,
        "Completion Rate (%)": `${rate}%`,
        "Today Status": rec.availableToday ? "Available" : "Not Available",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Performance");
    XLSX.writeFile(workbook, `Kowtha_Employee_Performance_${dayjs().format("YYYY-MM-DD")}.xlsx`);
    message.success("Employee performance data exported successfully");
  };

  const openEmployeeDrawer = (record: AttendanceRecord) => {
    setSelectedEmployee(record);
    setDrawerOpen(true);
  };

  const columns: any[] = [
    {
      title: "Employee",
      key: "employee",
      width: 260,
      render: (_: any, record: AttendanceRecord) => {
        const initials = record.user?.name
          ? record.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          : "FE";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <Avatar
                style={{
                  background: "#f0f7ff",
                  color: "#0B2545",
                  fontWeight: 700,
                  fontSize: 12.5,
                  border: "1px solid #d2e2f1",
                }}
                size={36}
              >
                {initials}
              </Avatar>
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  backgroundColor: record.availableToday ? "#059669" : "#94a3b8",
                  border: "1.5px solid #ffffff",
                }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "#0B2545", fontSize: 13.5 }}>
                {record.user?.name || "Unnamed"}
              </div>
              <div style={{ fontSize: 11.5, color: "#64748B" }}>
                {record.user?.role || "Field Executive"} • {record.user?.mobile || "-"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Code",
      dataIndex: ["user", "employeeCode"],
      key: "employeeCode",
      width: 130,
      render: (code: string) => (
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: 12,
            fontWeight: 600,
            background: "#f8fafc",
            padding: "3px 8px",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            color: "#334155",
          }}
        >
          {code || "-"}
        </span>
      ),
    },
    {
      title: "Assigned",
      dataIndex: "totalAssigned",
      key: "totalAssigned",
      width: 110,
      align: "center",
      sorter: (a: AttendanceRecord, b: AttendanceRecord) => a.totalAssigned - b.totalAssigned,
      render: (val: number) => (
        <span style={{ fontWeight: 700, color: "#0B2545", fontSize: 14 }}>
          {val ?? 0}
        </span>
      ),
    },
    {
      title: "Pending",
      dataIndex: "pendingVerifications",
      key: "pendingVerifications",
      width: 110,
      align: "center",
      sorter: (a: AttendanceRecord, b: AttendanceRecord) => a.pendingVerifications - b.pendingVerifications,
      render: (val: number) => (
        <Tag
          style={{
            background: val > 0 ? "#fef3c7" : "#f8fafc",
            color: val > 0 ? "#92400e" : "#94a3b8",
            border: `1px solid ${val > 0 ? "#fde68a" : "#e2e8f0"}`,
            borderRadius: "9999px",
            fontWeight: 600,
            fontSize: 12,
            padding: "2px 10px",
          }}
        >
          {val ?? 0}
        </Tag>
      ),
    },
    {
      title: "Completed",
      dataIndex: "completedVerifications",
      key: "completedVerifications",
      width: 120,
      align: "center",
      sorter: (a: AttendanceRecord, b: AttendanceRecord) => a.completedVerifications - b.completedVerifications,
      render: (val: number) => (
        <Tag
          style={{
            background: "#ecfdf5",
            color: "#065f46",
            border: "1px solid #a7f3d0",
            borderRadius: "9999px",
            fontWeight: 600,
            fontSize: 12,
            padding: "2px 10px",
          }}
        >
          {val ?? 0}
        </Tag>
      ),
    },
    {
      title: "Absent Days",
      dataIndex: "absentDays",
      key: "absentDays",
      width: 120,
      align: "center",
      sorter: (a: AttendanceRecord, b: AttendanceRecord) => a.absentDays - b.absentDays,
      render: (val: number) => (
        <span style={{ color: val > 2 ? "#dc2626" : "#64748b", fontWeight: 500 }}>
          {val ?? 0} d
        </span>
      ),
    },
    {
      title: "Completion Rate",
      key: "rate",
      width: 180,
      sorter: (a: AttendanceRecord, b: AttendanceRecord) => {
        const rateA = a.totalAssigned > 0 ? a.completedVerifications / a.totalAssigned : 0;
        const rateB = b.totalAssigned > 0 ? b.completedVerifications / b.totalAssigned : 0;
        return rateA - rateB;
      },
      render: (_: any, record: AttendanceRecord) => {
        const rate =
          record.totalAssigned > 0
            ? Math.min(100, Math.round((record.completedVerifications / record.totalAssigned) * 100))
            : 0;
        const strokeColor = rate >= 80 ? "#059669" : rate >= 50 ? "#d97706" : "#dc2626";
        return (
          <div style={{ width: 140 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: strokeColor }}>
                {rate}%
              </span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                {record.completedVerifications}/{record.totalAssigned}
              </span>
            </div>
            <Progress
              percent={rate}
              showInfo={false}
              strokeColor={strokeColor}
              trailColor="#f1f5f9"
              size="small"
              strokeWidth={5}
            />
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 130,
      align: "center",
      render: (_: any, record: AttendanceRecord) => (
        <Tag
          style={{
            borderRadius: "9999px",
            padding: "2px 10px",
            fontSize: 11.5,
            fontWeight: 600,
            border: "1px solid",
            background: record.availableToday ? "#ecfdf5" : "#f1f5f9",
            borderColor: record.availableToday ? "#a7f3d0" : "#e2e8f0",
            color: record.availableToday ? "#065f46" : "#64748b",
          }}
        >
          {record.availableToday ? "Available" : "Offline"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 90,
      fixed: "right",
      render: (_: any, record: AttendanceRecord) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined style={{ color: "#0B2545" }} />}
          onClick={() => openEmployeeDrawer(record)}
          style={{ borderRadius: "6px" }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <Card
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #eef2f6",
          boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 6px 16px -4px rgba(15, 23, 42, 0.04)",
          padding: 8,
        }}
      >
        {/* Table Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            padding: "12px 16px 20px 16px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: "#0B2545", fontWeight: 700, fontSize: 16 }}>
              Employee Operations & Capacity
            </Title>
            <Text type="secondary" style={{ fontSize: 12.5, color: "#64748B" }}>
              Workforce verification volume, turnaround efficiency, and attendance records
            </Text>
          </div>

          <Space size={12} wrap>
            <Input
              prefix={<SearchOutlined style={{ color: "#94A3B8" }} />}
              placeholder="Search by name, code or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ width: 260, borderRadius: 8, height: 38 }}
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140, height: 38 }}
              options={[
                { label: "All Status", value: "ALL" },
                { label: "● Available", value: "ACTIVE" },
                { label: "○ Offline", value: "OFFLINE" },
              ]}
            />

            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              style={{
                height: 38,
                borderRadius: 8,
                fontWeight: 600,
                borderColor: "#e2e8f0",
                color: "#0B2545",
              }}
            >
              Export Excel
            </Button>
          </Space>
        </div>

        {/* Data Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record.userId}
          loading={loading}
          scroll={{ x: 1100 }}
          onRow={(record) => ({
            onClick: () => openEmployeeDrawer(record),
            style: { cursor: "pointer" },
          })}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            position: ["bottomCenter"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`,
          }}
        />
      </Card>

      {/* Employee Detail Drawer */}
      <Drawer
        title={
          selectedEmployee ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar
                size={42}
                style={{
                  background: "#f0f7ff",
                  color: "#0B2545",
                  fontWeight: 700,
                  fontSize: 16,
                  border: "1.5px solid #d2e2f1",
                }}
              >
                {selectedEmployee.user?.name?.substring(0, 2).toUpperCase() || "FE"}
              </Avatar>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#0B2545" }}>
                  {selectedEmployee.user?.name}
                </div>
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  {selectedEmployee.user?.role || "Field Executive"} • Code: {selectedEmployee.user?.employeeCode || "N/A"}
                </div>
              </div>
            </div>
          ) : (
            "Employee Profile"
          )
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={460}
      >
        {selectedEmployee && (
          <div style={{ padding: "8px 0" }}>
            {/* Quick KPI Stats */}
            <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card
                  bordered={false}
                  style={{ background: "#f8fafc", borderRadius: 12, border: "1px solid #eef2f6" }}
                >
                  <Statistic
                    title={<Text style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>TOTAL ASSIGNED</Text>}
                    value={selectedEmployee.totalAssigned ?? 0}
                    valueStyle={{ color: "#0B2545", fontWeight: 700, fontSize: 24 }}
                    prefix={<IdcardOutlined style={{ fontSize: 18, color: "#134074" }} />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  bordered={false}
                  style={{ background: "#ecfdf5", borderRadius: 12, border: "1px solid #a7f3d0" }}
                >
                  <Statistic
                    title={<Text style={{ fontSize: 12, color: "#065f46", fontWeight: 600 }}>COMPLETED</Text>}
                    value={selectedEmployee.completedVerifications ?? 0}
                    valueStyle={{ color: "#059669", fontWeight: 700, fontSize: 24 }}
                    prefix={<CheckCircleOutlined style={{ fontSize: 18, color: "#059669" }} />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  bordered={false}
                  style={{ background: "#fef3c7", borderRadius: 12, border: "1px solid #fde68a" }}
                >
                  <Statistic
                    title={<Text style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>PENDING</Text>}
                    value={selectedEmployee.pendingVerifications ?? 0}
                    valueStyle={{ color: "#d97706", fontWeight: 700, fontSize: 24 }}
                    prefix={<ClockCircleOutlined style={{ fontSize: 18, color: "#d97706" }} />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  bordered={false}
                  style={{ background: "#f0f7ff", borderRadius: 12, border: "1px solid #d2e2f1" }}
                >
                  <Statistic
                    title={<Text style={{ fontSize: 12, color: "#1e40af", fontWeight: 600 }}>SUCCESS RATE</Text>}
                    value={
                      selectedEmployee.totalAssigned > 0
                        ? Math.round((selectedEmployee.completedVerifications / selectedEmployee.totalAssigned) * 100)
                        : 0
                    }
                    suffix="%"
                    valueStyle={{ color: "#0B2545", fontWeight: 700, fontSize: 24 }}
                    prefix={<FireOutlined style={{ fontSize: 18, color: "#0B2545" }} />}
                  />
                </Card>
              </Col>
            </Row>

            <Divider style={{ margin: "16px 0" }} />

            {/* Profile Information */}
            <Title level={5} style={{ color: "#0B2545", marginBottom: 12 }}>
              Personnel Details
            </Title>
            <Descriptions column={1} size="small" bordered style={{ borderRadius: 8, overflow: "hidden" }}>
              <Descriptions.Item label="Mobile Number">
                <Space>
                  <PhoneOutlined style={{ color: "#0B2545" }} />
                  <a href={`tel:${selectedEmployee.user?.mobile}`} style={{ color: "#0B2545", fontWeight: 500 }}>
                    {selectedEmployee.user?.mobile || "N/A"}
                  </a>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Employee Code">
                {selectedEmployee.user?.employeeCode || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Department Role">
                {selectedEmployee.user?.role || "Field Executive"}
              </Descriptions.Item>
              <Descriptions.Item label="Attendance Status">
                <Tag color={selectedEmployee.availableToday ? "success" : "default"}>
                  {selectedEmployee.availableToday ? "Available Today" : "Not Available"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Present Days (Period)">
                {selectedEmployee.presentDays ?? 0} days
              </Descriptions.Item>
              <Descriptions.Item label="Absent Days (Period)">
                {selectedEmployee.absentDays ?? 0} days
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: "20px 0" }} />

            <div style={{ textAlign: "right" }}>
              <Button type="primary" onClick={() => setDrawerOpen(false)} style={{ borderRadius: 8, background: "#0B2545" }}>
                Close Profile
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
