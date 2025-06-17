import {
  Layout,
  Menu,
  Button,
  Space,
  Typography,
  Avatar,
  Dropdown,
  Grid,
} from "antd";
import { useRouter } from "next/router";
import {
  DashboardOutlined,
  FileOutlined,
  TeamOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import logo from "../../../public/images/appLogos/KowthaDarkIcon.png";
import smallLogo from "../../../public/images/appLogos/kowthaSmallLogo.png";
import { UserContext } from "./UserContextProvider";
import { getOfficesApi } from "@/services/settings.services";
import { getUserDetails } from "@/utils/utility";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const AVATAR_COLORS = [
  "var(--primary-50)", // lightest primary
  "var(--primary-100)", // light primary
  "var(--primary-200)", // lighter primary
  "var(--primary-300)", // light medium primary
  "var(--primary-400)", // medium primary
  "var(--primary-500)", // medium dark primary
  "var(--primary-600)", // dark primary
];

function getInitials(user: any): string {
  const first = user?.firstName || user?.name?.split(" ")[0] || "";
  const last = user?.lastName || user?.name?.split(" ")[1] || "";
  if (first && last) return (first[0] + last[0]).toUpperCase();
  if (first) return first[0].toUpperCase();
  return "U";
}

function getAvatarColor(userId: number | string | undefined | null): string {
  if (typeof userId !== "number") return AVATAR_COLORS[0];
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const screens = useBreakpoint();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime] = useState(new Date());
  const [office, setOffice] = useState<string>("");
  const userDetails = getUserDetails();

  useEffect(() => {
  if(userDetails?.officeId){
    getOfficesApi()
    .then((res) => {
      setOffice(
        res?.data?.data?.find((office: any) => office?.id === userDetails?.officeId)
          ?.name
      );
    })
    .catch((err) => {
      console.log(err);
    });
  }
  }, [userDetails?.officeId]);

  // useEffect(() => {
  //   const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  //   return () => clearInterval(timer);
  // }, []);

  // useEffect(() => {
  //   setCollapsed(!!(screens.xs || screens.sm || screens.md));
  // }, [screens]);

  const menuItems = [
    {
      key: "dashboard",
      icon: (
        <DashboardOutlined
          style={{ fontSize: 20, color: "var(--primary-800)" }}
        />
      ),
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "loans",
      icon: (
        <FileOutlined style={{ fontSize: 20, color: "var(--primary-800)" }} />
      ),
      label: <Link href="/loans">Loans</Link>,
    },
    {
      key: "users",
      icon: (
        <TeamOutlined style={{ fontSize: 20, color: "var(--primary-800)" }} />
      ),
      label: <Link href="/users">Users</Link>,
    },
   ...((userDetails?.role==="Admin"||userDetails?.role==="Verifier")?[
    {
      key: "verify",
      icon: (
        <CheckCircleOutlined
          style={{ fontSize: 20, color: "var(--primary-800)" }}
        />
      ),
      label: <Link href="/verify">Verify</Link>,
    }
   ]:[]),
    ...(userDetails?.role === "Admin"
      ? [
          {
            key: "edit-requests",
            icon: (
              <AuditOutlined
                style={{ fontSize: 20, color: "var(--primary-800)" }}
              />
            ),
            label: <Link href="/edit-requests">Requests</Link>,
          },
        ]
      : []),
    {
      key: "settings",
      icon: (
        <SettingOutlined
          style={{ fontSize: 20, color: "var(--primary-800)" }}
        />
      ),
      label: <Link href="/settings/organization">Organization</Link>,
    },
  ];

  const avatarColor = getAvatarColor(userDetails?.id);
  const initials = getInitials(userDetails);

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link href="/profile">My Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Link href="/logout">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "Noto Sans, sans-serif" }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          background: "var(--background-primary)",
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid var(--neutral-200)",
            fontFamily: "Noto Sans, sans-serif",
          }}
        >
          {collapsed ? (
            <Image
              src={smallLogo}
              alt="Kowtha Logo"
              width={120}
              height={60}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <Image
              src={logo}
              alt="Kowtha Logo"
              width={120}
              height={60}
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[router.pathname.split("/")[1] || "dashboard"]}
          items={menuItems}
          style={{ fontFamily: "Noto Sans, sans-serif", fontWeight: 500 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "var(--background-primary)",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontFamily: "Noto Sans, sans-serif",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", color: "var(--primary-800)" }}
          />
          <Space>
            <Text type="secondary" style={{ fontWeight: 500 }}>
              {office}
            </Text>
            <Text style={{ fontWeight: 500 }}>
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
            <Dropdown
              overlay={menu}
              placement="bottomRight"
              trigger={["click", "hover"]}
            >
              <Avatar
                style={{
                  backgroundColor: avatarColor,
                  color: "var(--primary-800)",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  fontSize: 18,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                size={40}
              >
                {initials}
              </Avatar>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: 0,
            padding: 16,
            background: "#f5f5f5",
            fontFamily: "Noto Sans, sans-serif",
          }}
        >
          {children}
        </Content>
      </Layout>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap");
        body,
        html,
        * {
          font-family: "Noto Sans", sans-serif !important;
        }
        :root {
          --ant-primary-color: var(--primary-800);
        }
        .ant-btn-primary {
          background: var(--primary-800) !important;
          border-color: var(--primary-800) !important;
        }
        .ant-btn-primary:hover,
        .ant-btn-primary:focus {
          background: var(--primary-700) !important;
          border-color: var(--primary-700) !important;
        }
        .ant-menu-item-selected {
          background: var(--primary-50) !important;
          color: var(--primary-800) !important;
        }
        .ant-menu-item:hover {
          color: var(--primary-700) !important;
        }
        .ant-menu-item-selected .anticon {
          color: var(--primary-800) !important;
        }
      `}</style>
    </Layout>
  );
}
