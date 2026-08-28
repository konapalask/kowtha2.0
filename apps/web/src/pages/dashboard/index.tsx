import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, DatePicker } from "antd";
import {
  FileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDashboardMetrics } from "@/services/dashboard.services";
import dayjs from "dayjs";
import Attendance from "@/components/attendance/Attendance";
import { useDepartmentChange, getCurrentDepartmentRole } from "@/utils/utility";

interface DashboardMetrics {
  totalLoans: number | null | undefined;
  totalVerifications: number | null | undefined;
  pendingVerifications: number | null | undefined;
  completedVerifications: number | null | undefined;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLoans: 0,
    totalVerifications: 0,
    pendingVerifications: 0,
    completedVerifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[any, any]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const currentDepartment = useDepartmentChange();

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const params = {
        fromDate: dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : null,
        toDate: dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : null,
      };
      const data = await getDashboardMetrics(params);
      setMetrics(data || {});
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [currentDepartment, dateRange]);

  return (
    <DashboardLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Dashboard
        </Typography.Title>
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as [any, any])}
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
              background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
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
              background:
                "linear-gradient(90deg, #43e97b 0%, rgb(66, 238, 206) 100%)",
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

      {getCurrentDepartmentRole() !== "VerificationExecutive" && (
        <Attendance dateRange={dateRange} />
      )}
    </DashboardLayout>
  );
}
