import { Layout, Menu, Button, Space, Typography, Avatar, Dropdown } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  DashboardOutlined,
  FileOutlined,
  TeamOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AVATAR_COLORS = [
  '#fbeaf3', // light pink
  '#fde4ec', // lighter pink
  '#e0f7fa', // light teal
  '#fff9c4', // light yellow
  '#ffe0b2', // light orange
  '#d1c4e9', // light purple
  '#c8e6c9', // light green
];

function getInitials(user: any): string {
  const first = user?.firstName || user?.name?.split(' ')[0] || '';
  const last = user?.lastName || user?.name?.split(' ')[1] || '';
  if (first && last) return (first[0] + last[0]).toUpperCase();
  if (first) return first[0].toUpperCase();
  return 'U';
}

function getAvatarColor(userId: number | string | undefined | null): string {
  if (typeof userId !== 'number') return AVATAR_COLORS[0];
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ fontSize: 20, color: '#85365f' }} />, // primary
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'loans',
      icon: <FileOutlined style={{ fontSize: 20, color: '#85365f' }} />, // primary
      label: <Link href="/loans">Loans</Link>,
    },
    {
      key: 'users',
      icon: <TeamOutlined style={{ fontSize: 20, color: '#85365f' }} />, // primary
      label: <Link href="/users">Users</Link>,
    },
    {
      key: 'verify',
      icon: <CheckCircleOutlined style={{ fontSize: 20, color: '#85365f' }} />, // primary
      label: <Link href="/verify">Verify</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined style={{ fontSize: 20, color: '#85365f' }} />, // primary
      label: <Link href="/settings/organization">Organization</Link>,
    },
  ];

  // TODO: Extend NextAuth session user type for id and office
  const userId = (session?.user as any)?.id ?? 0;
  const avatarColor = getAvatarColor(userId);
  const initials = getInitials(session?.user);
  const office = (session?.user as any)?.office ?? 'Office';

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <a href="/profile">My Profile</a>
      </Menu.Item>
      <Menu.Item key="logout">
        <a href="/api/auth/signout">Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Noto Sans, sans-serif' }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          background: '#fff',
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          fontFamily: 'Noto Sans, sans-serif',
        }}>
          <h2 style={{ margin: 0, color: '#85365f', fontWeight: 700 }}>LVS</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[router.pathname.split('/')[1] || 'dashboard']}
          items={menuItems}
          style={{ fontFamily: 'Noto Sans, sans-serif', fontWeight: 500 }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontFamily: 'Noto Sans, sans-serif',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', color: '#85365f' }}
          />
          <Space>
            <Text type="secondary" style={{ fontWeight: 500 }}>{office}</Text>
            <Text style={{ fontWeight: 500 }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
            <Dropdown overlay={menu} placement="bottomRight" trigger={['click', 'hover']}>
              <Avatar
                style={{
                  backgroundColor: avatarColor,
                  color: '#85365f',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  fontSize: 18,
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
                size={40}
              >
                {initials}
              </Avatar>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', fontFamily: 'Noto Sans, sans-serif' }}>
          {children}
        </Content>
      </Layout>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap');
        body, html, * {
          font-family: 'Noto Sans', sans-serif !important;
        }
        :root {
          --ant-primary-color: #85365f;
        }
        .ant-btn-primary {
          background: #85365f !important;
          border-color: #85365f !important;
        }
        .ant-btn-primary:hover, .ant-btn-primary:focus {
          background: #9c145a !important;
          border-color: #9c145a !important;
        }
        .ant-menu-item-selected {
          background: #fbeaf3 !important;
          color: #85365f !important;
        }
      `}</style>
    </Layout>
  );
} 