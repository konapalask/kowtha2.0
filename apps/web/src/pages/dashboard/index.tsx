import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space } from 'antd';
import { FileOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/utils/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

interface DashboardStats {
  totalLoans: number;
  verifiedLoans: number;
  rejectedLoans: number;
  pendingLoans: number;
  recentLoans: any[];
}

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
        const response = await api.get('/api/loans/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStats(response.data);
        // Mock or fetch pending loans (oldest first, status Pending)
        setPendingLoans((response.data.allLoans || []).filter((l: any) => l.status === 'Pending').sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(0, 10));
        // Mock or fetch processing stats for bar chart
        setProcessingStats([
          { status: 'Pending', count: response.data.pendingLoans },
          { status: 'Verified', count: response.data.verifiedLoans },
          { status: 'Rejected', count: response.data.rejectedLoans },
        ]);
        // Mock or fetch employee stats for bar chart
        setEmployeeStats(response.data.employeeStats || [
          { name: 'John Doe', completed: 12 },
          { name: 'Jane Smith', completed: 8 },
          { name: 'Amit Singh', completed: 5 },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const pendingLoansColumns = [
    { title: 'Application Number', dataIndex: 'applicationNumber', key: 'applicationNumber' },
    { title: 'Applicant Name', dataIndex: 'applicantName', key: 'applicantName' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="orange">{status}</Tag> },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (date: string) => new Date(date).toLocaleDateString() },
  ];

  return (
    <DashboardLayout>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Loans"
              value={stats.totalLoans}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Verified Loans"
              value={stats.verifiedLoans}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Rejected Loans"
              value={stats.rejectedLoans}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Loans"
              value={stats.pendingLoans}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Loans Pending Since Longest" style={{ marginTop: 16 }}>
        <Table
          columns={pendingLoansColumns}
          dataSource={pendingLoans}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Loan Applications Being Processed">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processingStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#85365f" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Employee-wise Loans Completed">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#85365f" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
} 