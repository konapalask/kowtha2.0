import { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';

const { Title } = Typography;
const { Option } = Select;

interface User {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  status: 'Active' | 'Inactive';
  role: string;
  office?: string;
}

interface Office {
  id: number;
  name: string;
}

export default function Users() {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      mobile: '9876543210',
      status: 'Active',
      role: 'FieldExecutive',
      office: 'Head Office',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      mobile: '9876543211',
      status: 'Active',
      role: 'Verifier',
      office: 'Branch Office',
    },
  ]);

  const [offices] = useState<Office[]>([
    { id: 1, name: 'Head Office' },
    { id: 2, name: 'Branch Office' },
  ]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingUser) {
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('User updated successfully');
      } else {
        setUsers([...users, { id: Date.now(), ...values }]);
        message.success('User added successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    } catch (error) {
      message.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(users.filter(user => user.id !== id));
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = () => {
    // Implement the logic to deactivate the user
    console.log('Deactivating user');
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <span style={{ color: status === 'Active' ? 'green' : 'red' }}>{status}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Office',
      dataIndex: 'office',
      key: 'office',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUser(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add User
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ gap: 8, display: 'flex', flexDirection: 'column' }}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
            style={{ marginBottom: 8 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
            style={{ marginBottom: 8 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[{ required: true, message: 'Please enter mobile number' }]}
            style={{ marginBottom: 8 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
            style={{ marginBottom: 8 }}
          >
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="OperationsExecutive">Operations Executive</Option>
              <Option value="FieldExecutive">Field Executive</Option>
              <Option value="Verifier">Verifier</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="office"
            label="Office"
            rules={[{ required: true, message: 'Please select office' }]}
            style={{ marginBottom: 8 }}
          >
            <Select>
              {offices.map(office => (
                <Option key={office.id} value={office.name}>
                  {office.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {editingUser && (
            <Form.Item style={{ marginBottom: 8 }}>
              <Button
                danger
                onClick={() => {
                  form.setFieldsValue({ status: 'Inactive' });
                  handleSubmit({ ...form.getFieldsValue(), status: 'Inactive' });
                }}
                style={{ float: 'right' }}
              >
                Deactivate User
              </Button>
            </Form.Item>
          )}
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUser ? 'Update' : 'Add'} User
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingUser(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
          {editingUser && (
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Popconfirm
                title="Are you sure you want to deactivate the user?"
                onConfirm={handleDeactivateUser}
                okText="Yes"
                cancelText="No"
              >
                <a style={{ color: '#cf1322' }}>Deactivate User</a>
              </Popconfirm>
            </div>
          )}
        </Form>
      </Modal>
    </DashboardLayout>
  );
} 