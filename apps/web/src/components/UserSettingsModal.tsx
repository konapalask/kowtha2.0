import React, { useState, useEffect } from "react";
import { Drawer, Descriptions, Typography, Card, Space, Tag, Divider, Button, Form, Input, message, Tooltip, Select, Spin } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, IdcardOutlined, BankOutlined, TeamOutlined, ApartmentOutlined, EditOutlined, SaveOutlined, CloseOutlined, SwapOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getCurrentDepartment, getCurrentDepartmentRole } from "@/utils/utility";

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
  onUpdateUser?: (updatedData: { name: string; email: string }) => void;
  onChangeDepartment?: (newDefaultDepartment: string) => void;
  onChangeCurrentDepartment?: (newCurrentDepartment: string) => void;
  loading?: boolean;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  visible,
  onCancel,
  userData,
  onUpdateUser,
  onChangeDepartment,
  onChangeCurrentDepartment,
  loading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showCurrentDepartmentModal, setShowCurrentDepartmentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCurrentDepartment, setSelectedCurrentDepartment] = useState<string>('');
  const [currentUserData, setCurrentUserData] = useState(userData);
  const [currentDept, setCurrentDept] = useState<string>('');
  const [form] = Form.useForm();

  // Update local state when userData prop changes
  useEffect(() => {
    setCurrentUserData(userData);
  }, [userData]);

  // Get current department from localStorage
  useEffect(() => {
    const currentDepartment = getCurrentDepartment();
    setCurrentDept(currentDepartment);
  }, []);

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
      case 'operationsexecutive':
        return 'green';
      case 'fieldexecutive':
        return 'orange';
      case 'pdadmin':
        return 'purple';
      case 'pdverifier':
        return 'blue';
      case 'pdfieldexecutive':
        return 'orange';
      case 'pdoperationsexecutive':
        return 'green';
      default:
        return 'default';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      name: currentUserData.name || '',
      email: currentUserData.email || '',
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('Saving user data:', values);
      if (onUpdateUser) {
        await onUpdateUser(values);
        setCurrentUserData(prev => ({
          ...prev,
          name: values.name,
          email: values.email
        }));
        setIsEditing(false);
      }
    } catch (error: any) {
      if (error?.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleChangeDepartment = () => {
    setSelectedDepartment(currentUserData.defaultDepartment || '');
    setShowDepartmentModal(true);
  };

  const handleChangeCurrentDepartment = () => {
    setSelectedCurrentDepartment(currentDept || '');
    setShowCurrentDepartmentModal(true);
  };

  const handleDepartmentSave = async () => {
    try {
      if (!selectedDepartment || selectedDepartment.trim() === '') {
        message.error('Please select a department');
        return;
      }
      
      if (onChangeDepartment) {
        console.log('Updating department to:', selectedDepartment);
        console.log('Available departments:', currentUserData.departmentRoles);
        await onChangeDepartment(selectedDepartment);
        setCurrentUserData(prev => ({
          ...prev,
          defaultDepartment: selectedDepartment
        }));
        setShowDepartmentModal(false);
      }
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDepartmentCancel = () => {
    setShowDepartmentModal(false);
    setSelectedDepartment('');
  };

  const handleCurrentDepartmentSave = async () => {
    try {
      if (!selectedCurrentDepartment || selectedCurrentDepartment.trim() === '') {
        message.error('Please select a current department');
        return;
      }
      
      if (onChangeCurrentDepartment) {
        console.log('Updating current department to:', selectedCurrentDepartment);
        onChangeCurrentDepartment(selectedCurrentDepartment);
        setCurrentDept(selectedCurrentDepartment);
        setShowCurrentDepartmentModal(false);
      }
    } catch (error) {
      console.error('Error updating current department:', error);
    }
  };

  const handleCurrentDepartmentCancel = () => {
    setShowCurrentDepartmentModal(false);
    setSelectedCurrentDepartment('');
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Space>
            <UserOutlined />
            <span>User Settings</span>
          </Space>
          {!isEditing ? (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={handleEdit}
              style={{ color: 'var(--primary-600)' }}
            >
              Edit
            </Button>
          ) : (
            <Space size="middle">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                style={{
                  borderRadius: '6px',
                  fontWeight: 500,
                  height: '32px',
                  padding: '4px 16px',
                  background: 'var(--primary-800)',
                  borderColor: 'var(--primary-800)',
                  boxShadow: '0 2px 4px rgba(0, 29, 58, 0.2)',
                }}
              >
                Save
              </Button>
              <Button
                type="default"
                icon={<CloseOutlined />}
                onClick={handleCancel}
                style={{
                  borderRadius: '6px',
                  fontWeight: 500,
                  height: '32px',
                  padding: '4px 16px',
                  borderColor: 'var(--neutral-300)',
                  color: 'var(--neutral-700)',
                }}
              >
                Cancel
              </Button>
            </Space>
          )}
        </div>
      }
      placement="right"
      open={visible}
      onClose={onCancel}
      width={600}
      bodyStyle={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 56px)',
        paddingBottom: '80px' // Add space for logout button
      }}
    >
      <Card
        style={{
          background: "var(--background-primary)",
          border: "1px solid var(--neutral-200)",
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24, flexShrink: 0 }}>
          <Title level={4} style={{ margin: 0, color: "var(--primary-800)" }}>
            {currentUserData.name || "User"}
          </Title>
          <Space style={{ marginTop: 8 }}>
            <Tag color={getRoleColor(getCurrentDepartmentRole() || "")} style={{ fontWeight: 500 }}>
              {getCurrentDepartmentRole() || "N/A"}
            </Tag>
            <Tag color={getStatusColor(currentUserData.status || "")} style={{ fontWeight: 500 }}>
              {currentUserData.status || "N/A"}
            </Tag>
          </Space>
        </div>

        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            style={{ marginBottom: 24 }}
          >
            <Form.Item
              label={
                <Space>
                  <UserOutlined />
                  Name
                </Space>
              }
              name="name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>
            
            <Form.Item
              label={
                <Space>
                  <MailOutlined />
                  Email
                </Space>
              }
              name="email"
              // rules={[
              //   { required: true, message: 'Please enter your email' },
              //   { type: 'email', message: 'Please enter a valid email' }
              // ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
          </Form>
        ) : null}

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
          style={{ flex: 1, overflowY: 'auto' }}
        >
          {!isEditing && (
            <>
              <Descriptions.Item
                label={
                  <Space>
                    <UserOutlined />
                    Name
                  </Space>
                }
              >
                {currentUserData.name || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <MailOutlined />
                    Email
                  </Space>
                }
              >
                {currentUserData.email || "N/A"}
              </Descriptions.Item>
            </>
          )}

          <Descriptions.Item
            label={
              <Space>
                <IdcardOutlined />
                Employee Code
              </Space>
            }
          >
            {currentUserData.employeeCode || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <PhoneOutlined />
                Mobile
              </Space>
            }
          >
            {currentUserData.mobile || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <EnvironmentOutlined />
                Locality
              </Space>
            }
          >
            {currentUserData.locality || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <ApartmentOutlined />
                Default Department
              </Space>
            }
          >
            <Space>
              {currentUserData.defaultDepartment || "N/A"}
              {currentUserData.departmentRoles && currentUserData.departmentRoles.length > 1 && (
                <Tooltip title="Change Default Department">
                  <Button
                    type="text"
                    icon={<SwapOutlined />}
                    onClick={handleChangeDepartment}
                    style={{
                      color: "var(--primary-800)",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </Tooltip>
              )}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <TeamOutlined />
                Department Roles
              </Space>
            }
          >
            {currentUserData.departmentRoles && currentUserData.departmentRoles.length > 0 ? (
              <Space wrap>
                {currentUserData.departmentRoles.map((deptRole, index) => (
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

      {/* Logout Button - Fixed at bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Logout">
          <Link href="/logout">
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              size="large"
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(255, 77, 79, 0.3)"
              }}
            >
              Logout
            </Button>
          </Link>
        </Tooltip>
      </div>

      {/* Department Change Modal */}
      <Drawer
        title={
          <Space>
            <SwapOutlined />
            <span>Change Default Department</span>
          </Space>
        }
        placement="right"
        open={showDepartmentModal}
        onClose={handleDepartmentCancel}
        width={400}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleDepartmentCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleDepartmentSave}>
              Save
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Typography.Text>
            Select your new default department from the available options:
          </Typography.Text>
        </div>
        <Select
          value={selectedDepartment}
          onChange={setSelectedDepartment}
          style={{ width: '100%' }}
          placeholder="Select a department"
          size="large"
        >
          {currentUserData.departmentRoles?.map((deptRole, index) => (
            <Select.Option key={index} value={deptRole.department}>
              <Space>
                <Tag color="blue" style={{ margin: 0 }}>
                  {deptRole.role}
                </Tag>
                {deptRole.department}
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Drawer>

      {/* Current Department Change Modal */}
      <Drawer
        title={
          <Space>
            <SwapOutlined style={{ color: "var(--success-600)" }} />
            <span>Change Current Department</span>
          </Space>
        }
        placement="right"
        open={showCurrentDepartmentModal}
        onClose={handleCurrentDepartmentCancel}
        width={400}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCurrentDepartmentCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleCurrentDepartmentSave}>
              Change
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Typography.Text>
            Select your current working department:
          </Typography.Text>
        </div>
        <Select
          value={selectedCurrentDepartment}
          onChange={setSelectedCurrentDepartment}
          style={{ width: '100%' }}
          placeholder="Select a department"
          size="large"
        >
          {currentUserData.departmentRoles?.map((deptRole, index) => (
            <Select.Option key={index} value={deptRole.department}>
              <Space>
                <Tag color="blue" style={{ margin: 0 }}>
                  {deptRole.role}
                </Tag>
                {deptRole.department}
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Drawer>

      <style jsx>{`
        .ant-descriptions-item-label {
          font-family: "Noto Sans", sans-serif !important;
        }
        .ant-descriptions-item-content {
          font-family: "Noto Sans", sans-serif !important;
        }
      `}</style>
    </Drawer>
  );
};

export default UserSettingsModal;
