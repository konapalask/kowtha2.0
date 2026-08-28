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
} from "antd";
import { useEffect, useState, useMemo, useRef } from "react";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";

interface AttendanceProps {
  dateRange: [any, any]; // dayjs.Dayjs[]
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
  const [filters, setFilters] = useState({
    name: "",
    employeeCode: "",
    status: undefined as boolean | undefined,
  });
  const currentDepartment = useDepartmentChange();

  // Refs for filter inputs to focus them when dropdown opens
  const nameInputRef = useRef<any>(null);
  const employeeCodeInputRef = useRef<any>(null);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const params = {
        department: getCurrentDepartment(),
        startDate: dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : undefined,
        endDate: dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : undefined,
      };
      const response = await getAttendanceRecodsApi(params);
      setData(response?.data || []);
    } catch (error) {
      message.error("Failed to fetch attendance records");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, [currentDepartment, dateRange]);

  const filteredData = useMemo(() => {
    let result = data;
    if (filters.name) {
      result = result.filter((rec) =>
        (rec.user?.name || "").toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.employeeCode) {
      result = result.filter((rec) =>
        (rec.user?.employeeCode || "")
          .toLowerCase()
          .includes(filters.employeeCode.toLowerCase())
      );
    }
    return result;
  }, [data, filters.name, filters.employeeCode]);

  const columns: any[] = [
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(input) => {
              nameInputRef.current = input;
              if (input) {
                requestAnimationFrame(() => {
                  input.focus();
                });
              }
            }}
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              setFilters((f) => ({ ...f, name: e.target.value || "" }));
              confirm({ closeDropdown: false });
            }}
            style={{ width: 188, marginBottom: 8, display: "block" }}
            autoFocus
          />
          <Space>
            <a
              onClick={() => {
                setFilters((f) => ({ ...f, name: selectedKeys[0] || "" }));
                confirm();
              }}
              style={{ color: "#1890ff" }}
            >
              Search
            </a>
            <a
              onClick={() => {
                setFilters((f) => ({ ...f, name: "" }));
                clearFilters();
                confirm();
              }}
            >
              Reset
            </a>
          </Space>
        </div>
      ),
      render: (_: any, record: AttendanceRecord) => (
        <>
          <Badge
            status={record.availableToday ? "success" : "error"}
            dot
            style={{ marginRight: 10 }}
            title={
              record.availableToday ? "Available Today" : "Not Available Today"
            }
            className={
              record.availableToday
                ? "badge-pulse-success"
                : "badge-pulse-error"
            }
          />
          {record.user?.name}
        </>
      ),
    },
    {
      title: "Employee Code",
      dataIndex: ["user", "employeeCode"],
      key: "employeeCode",
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(input) => {
              employeeCodeInputRef.current = input;
              if (input) {
                requestAnimationFrame(() => {
                  input.focus();
                });
              }
            }}
            placeholder="Search code"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              setFilters((f) => ({ ...f, employeeCode: e.target.value || "" }));
              confirm({ closeDropdown: false });
            }}
            style={{ width: 188, marginBottom: 8, display: "block" }}
            autoFocus
          />
          <Space>
            <a
              onClick={() => {
                setFilters((f) => ({
                  ...f,
                  employeeCode: selectedKeys[0] || "",
                }));
                confirm();
              }}
              style={{ color: "#1890ff" }}
            >
              Search
            </a>
            <a
              onClick={() => {
                setFilters((f) => ({ ...f, employeeCode: "" }));
                clearFilters();
                confirm();
              }}
            >
              Reset
            </a>
          </Space>
        </div>
      ),
      render: (_: any, record: AttendanceRecord) =>
        record.user?.employeeCode || "-",
    },
    {
      title: "Total Assigned",
      dataIndex: "totalAssigned",
      key: "totalAssigned",
      sorter: (a: AttendanceRecord, b: AttendanceRecord) =>
        a.totalAssigned - b.totalAssigned,
    },
    {
      title: "Pending",
      dataIndex: "pendingVerifications",
      key: "pendingVerifications",
      sorter: (a: AttendanceRecord, b: AttendanceRecord) =>
        a.pendingVerifications - b.pendingVerifications,
    },
    {
      title: "Completed",
      dataIndex: "completedVerifications",
      key: "completedVerifications",
      sorter: (a: AttendanceRecord, b: AttendanceRecord) =>
        a.completedVerifications - b.completedVerifications,
    },
    {
      title: "Absent",
      key: "absentDays",
      render: (_: any, record: AttendanceRecord) => `${record.absentDays}`,
      sorter: (a: AttendanceRecord, b: AttendanceRecord) =>
        a.absentDays - b.absentDays,
    },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <Table
        className="striped-table"
        title={() => (
          <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>
            Employee Details
          </Typography.Text>
        )}
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record.userId}
        loading={loading}
        bordered
        pagination={
          filteredData.length >= 10
            ? {
                pageSize: 10,
                showSizeChanger: false,
                position: ["bottomCenter"],
                showTotal: (total) => `Total ${total ?? 0} items`,
              }
            : false
        }
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
