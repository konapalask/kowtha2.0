import React, { useState, useEffect } from "react";
import { Modal, Descriptions, Typography, Card, Space, Tag, Divider, Button, Form, Input, message, Tooltip, Select, Spin } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, IdcardOutlined, BankOutlined, TeamOutlined, ApartmentOutlined, EditOutlined, SaveOutlined, CloseOutlined, SwapOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getCurrentDepartment } from "@/utils/utility";

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
      case 'user':
        return 'cyan';
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
        // Update local state immediately for UI responsiveness
        setCurrentUserData(prev => ({
          ...prev,
          name: values.name,
          email: values.email
        }));
        setIsEditing(false);
      }
    } catch (error: any) {
      // Check if it's a validation error or API error
      if (error?.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        // API error is already handled in the parent component
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
        // Update local state immediately for UI responsiveness
        setCurrentUserData(prev => ({
          ...prev,
          defaultDepartment: selectedDepartment
        }));
        setShowDepartmentModal(false);
      }
    } catch (error) {
      // API error is already handled in the parent component
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
    <Modal
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
            <Space>
              <Button
                type="text"
                icon={<SaveOutlined />}
                onClick={handleSave}
                style={{ color: 'var(--success-600)' }}
              >
                Save
              </Button>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleCancel}
                style={{ color: 'var(--error-600)' }}
              >
                Cancel
              </Button>
            </Space>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      style={{
        position: 'fixed',
        top: '64px', // Below navbar height
        right: '20px', // Right corner with some margin
        margin: 0,
      }}
      bodyStyle={{
        maxHeight: '80vh',
        overflowY: 'auto',
        padding: '16px'
      }}
    >
      <Card
        style={{
          background: "var(--background-primary)",
          border: "1px solid var(--neutral-200)",
          position: "relative",
          minHeight: "600px"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0, color: "var(--primary-800)" }}>
            {currentUserData.name || "User"}
          </Title>
          <Space style={{ marginTop: 8 }}>
            <Tag color={getRoleColor(currentUserData.role || "")} style={{ fontWeight: 500 }}>
              {currentUserData.role || "N/A"}
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
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
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

          {/* <Descriptions.Item
            label={
              <Space>
                <BankOutlined />
                Office ID
              </Space>
            }
          >
            {currentUserData.officeId || "N/A"}
          </Descriptions.Item> */}

          {/* <Descriptions.Item
            label={
              <Space>
                <UserOutlined />
                User ID
              </Space>
            }
          >
            {currentUserData.id || currentUserData.sub || "N/A"}
          </Descriptions.Item> */}

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
                <ApartmentOutlined style={{ color: "var(--success-600)" }} />
                Current Department
              </Space>
            }
          >
            <Space>
              <Tag color="green" style={{ fontWeight: 500 }}>
                {currentDept || "N/A"}
              </Tag>
              {currentUserData.departmentRoles && currentUserData.departmentRoles.length > 1 && (
                <Tooltip title="Change Current Department">
                  <Button
                    type="text"
                    icon={<SwapOutlined />}
                    onClick={handleChangeCurrentDepartment}
                    style={{
                      color: "var(--success-600)",
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
        
        {/* Logout Button in Bottom Right Corner */}
        <div style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
              paddingTop: "20px"
            }}>
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
      </Card>

      {/* Department Change Modal */}
      <Modal
        title={
          <Space>
            <SwapOutlined />
            <span>Change Default Department</span>
          </Space>
        }
        open={showDepartmentModal}
        onOk={handleDepartmentSave}
        onCancel={handleDepartmentCancel}
        okText="Save"
        cancelText="Cancel"
        width={400}
        centered
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
      </Modal>

      {/* Current Department Change Modal */}
      <Modal
        title={
          <Space>
            <SwapOutlined style={{ color: "var(--success-600)" }} />
            <span>Change Current Department</span>
          </Space>
        }
        open={showCurrentDepartmentModal}
        onOk={handleCurrentDepartmentSave}
        onCancel={handleCurrentDepartmentCancel}
        okText="Change"
        cancelText="Cancel"
        width={400}
        centered
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
      </Modal>

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