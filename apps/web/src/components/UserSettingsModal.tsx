import React from "react";
import { Modal, Descriptions, Typography, Card, Space, Tag, Divider } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, IdcardOutlined, BankOutlined, TeamOutlined, ApartmentOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface UserData {
  id?: number;
  email?: string;
  employeeCode?: string;
  locality?: string;
  mobile?: string;
  name?: string;
  officeId?: number;
  role?: string;
  status?: string;
  sub?: number;
  defaultDepartment?: string;
  departmentRoles?: Array<{
    department: string;
    role: string;
  }>;
}

interface UserSettingsModalProps {
  visible: boolean;
  onCancel: () => void;
  userData: UserData;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  visible,
  onCancel,
  userData,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'purple';
      case 'verifier':
        return 'blue';
      case 'user':
        return 'cyan';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          <span>User Settings</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      <Card
        style={{
          background: "var(--background-primary)",
          border: "1px solid var(--neutral-200)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0, color: "var(--primary-800)" }}>
            {userData.name || "User"}
          </Title>
          <Space style={{ marginTop: 8 }}>
            <Tag color={getRoleColor(userData.role || "")} style={{ fontWeight: 500 }}>
              {userData.role || "N/A"}
            </Tag>
            <Tag color={getStatusColor(userData.status || "")} style={{ fontWeight: 500 }}>
              {userData.status || "N/A"}
            </Tag>
          </Space>
        </div>

        <Descriptions
          column={1}
          bordered
          size="middle"
          labelStyle={{
            fontWeight: 600,
            color: "var(--primary-800)",
            backgroundColor: "var(--primary-50)",
            width: "40%",
          }}
          contentStyle={{
            backgroundColor: "var(--background-primary)",
            fontWeight: 500,
          }}
        >
          <Descriptions.Item
            label={
              <Space>
                <MailOutlined />
                Email
              </Space>
            }
          >
            {userData.email || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <IdcardOutlined />
                Employee Code
              </Space>
            }
          >
            {userData.employeeCode || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <PhoneOutlined />
                Mobile
              </Space>
            }
          >
            {userData.mobile || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <EnvironmentOutlined />
                Locality
              </Space>
            }
          >
            {userData.locality || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <BankOutlined />
                Office ID
              </Space>
            }
          >
            {userData.officeId || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <UserOutlined />
                User ID
              </Space>
            }
          >
            {userData.id || userData.sub || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <ApartmentOutlined />
                Default Department
              </Space>
            }
          >
            {userData.defaultDepartment || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <TeamOutlined />
                Department Roles
              </Space>
            }
          >
            {userData.departmentRoles && userData.departmentRoles.length > 0 ? (
              <Space wrap>
                {userData.departmentRoles.map((deptRole, index) => (
                  <Tag
                    key={index}
                    color="blue"
                    style={{
                      marginBottom: 4,
                      fontWeight: 500,
                      borderRadius: 4
                    }}
                  >
                    {deptRole.department} - {deptRole.role}
                  </Tag>
                ))}
              </Space>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <style jsx>{`
        .ant-descriptions-item-label {
          font-family: "Noto Sans", sans-serif !important;
        }
        .ant-descriptions-item-content {
          font-family: "Noto Sans", sans-serif !important;
        }
      `}</style>
    </Modal>
  );
};

export default UserSettingsModal;