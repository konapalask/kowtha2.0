import { getAttendanceRecodsApi } from "@/services/attendance.services";
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
import { useEffect, useState, useMemo } from "react";
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

const statusOptions = [
  { label: "All", value: undefined },
  { label: "Available", value: true },
  { label: "Not Available", value: false },
];

export default function Attendance({ dateRange }: AttendanceProps) {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    employeeCode: "",
    status: undefined as boolean | undefined,
  });

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      const [start, end] = dateRange || [];
      const params: any = {
        startDate: start ? dayjs(start).format("YYYY-MM-DD") : undefined,
        endDate: end ? dayjs(end).format("YYYY-MM-DD") : undefined,
      };
      if (filters.status !== undefined) params.status = filters.status;
      // if (filters.employeeCode) params.employeeCode = filters.employeeCode;
      // Name filter is client-side (API doesn't support it directly)
      const response = await getAttendanceRecodsApi(params);
      setData(response?.data?.data?.userStatistics || []);
    } catch (error: any) {
      message.error("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, filters.status, filters.employeeCode]);

  // Client-side filter for name
  const filteredData = useMemo(() => {
    let result = data;
    if (filters.name) {
      result = result.filter((rec) =>
        rec.user?.name?.toLowerCase().includes(filters.name.toLowerCase())
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
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {
              setFilters((f) => ({ ...f, name: selectedKeys[0] || "" }));
              confirm();
            }}
            style={{ width: 188, marginBottom: 8, display: "block" }}
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
          {" "}
          <Badge
            status={record.availableToday ? "success" : "error"}
            dot
            style={{ marginRight: 10 }}
            //   style={{ boxShadow: `0 0 8px 2px ${record.availableToday ? '#52c41a' : '#ff4d4f'}` }}
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
          {/* <Tag color="blue" style={{marginLeft:10}}>{record.user?.employeeCode}</Tag> */}
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
            placeholder="Search code"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {
              setFilters((f) => ({
                ...f,
                employeeCode: selectedKeys[0] || "",
              }));
              confirm();
            }}
            style={{ width: 188, marginBottom: 8, display: "block" }}
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
    // {
    //   title: "Today's Status",
    //   key: 'availableToday',
    //   filters: [
    //     { text: 'Available', value: true },
    //     { text: 'Not Available', value: false },
    //   ],
    //   filteredValue: filters.status !== undefined ? [filters.status] : null,
    //   align:"center",
    //   onFilter: (value: any, record: AttendanceRecord) => record.availableToday === value,
    //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
    //     <div style={{ padding: 8 }}>
    //       <Select
    //         style={{ width: 160 }}
    //         placeholder="Select status"
    //         value={selectedKeys[0]}
    //         onChange={val => {
    //           setSelectedKeys(val !== undefined ? [val] : []);
    //           setFilters(f => ({ ...f, status: val }));
    //           confirm();
    //         }}
    //         allowClear
    //       >
    //         <Select.Option value={true}>Available</Select.Option>
    //         <Select.Option value={false}>Not Available</Select.Option>
    //       </Select>
    //       <a
    //         style={{ display: 'block', marginTop: 8 }}
    //         onClick={() => {
    //           setFilters(f => ({ ...f, status: undefined }));
    //           clearFilters();
    //           confirm();
    //         }}
    //       >
    //         Reset
    //       </a>
    //     </div>
    //   ),
    //   render: (_: any, record: AttendanceRecord) => (
    //     <Badge
    //       status={record.availableToday ? 'success' : 'error'}
    //       dot
    //     //   style={{ boxShadow: `0 0 8px 2px ${record.availableToday ? '#52c41a' : '#ff4d4f'}` }}
    //       title={record.availableToday ? 'Available Today' : 'Not Available Today'}
    //       className={record.availableToday ? "badge-pulse-success" : "badge-pulse-error"}
    //     />
    //   ),
    // },
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
