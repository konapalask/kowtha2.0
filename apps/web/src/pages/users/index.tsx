import { useContext, useEffect, useState } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { ColumnsType } from "antd/es/table";
import {
  createUserApi,
  getUsersApi,
  updateUserApi,
} from "@/services/users.services";
import { UserContext } from "@/components/layout/UserContextProvider";
import { getOfficesApi } from "@/services/settings.services";
const { Option } = Select;

interface User {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  status: "Active" | "Inactive";
  role: string;
  office?: any;
}

interface Office {
  id: number;
  name: string;
}

export default function Users() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { userDetails } = useContext(UserContext);
  const [offices, setOffices] = useState<Office[]>([]);

  const fetchUsers = async () => {
    getUsersApi()
      .then((res) => {
        setUsers(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUsers();
    getOfficesApi()
      .then((res) => {
        const options =
          res?.data?.map((item: any) => ({
            label: `${item.name} - ${item.location}`,
            value: item.id,
          })) ?? [];
        console.log("Offices:", options);
        setOffices(options);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      if (editingUser) {
        // setUsers(
        //   users.map((user) =>
        //     user.id === editingUser.id ? { ...user, ...values } : user
        //   )
        // );
        const response = await updateUserApi(editingUser?.id, values);
        console.log(response);
        message.success("User updated successfully");
        fetchUsers();
      } else {
        const response = await createUserApi(values);
        console.log(response);
        message.success("User added successfully");
      }
      fetchUsers();
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    } catch (error) {
      message.error("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      officeId: user?.office?.id,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers(users.filter((user) => user.id !== id));
      message.success("User deleted successfully");
    } catch (error) {
      message.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = () => {
    // Implement the logic to deactivate the user
    console.log("Deactivating user");
    form.setFieldsValue({ status: "Inactive" });
    handleSubmit({
      ...form.getFieldsValue(),
      status: "Inactive",
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: 150,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      width: 150,
    },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    //   width: 200,
    // },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 150,
    },
    {
      title: "Branch",
      dataIndex: "office",
      key: "office",
      width: 150,
      render: (office: any) => office?.name,
    },
    ...(userDetails?.role === "Admin"
      ? [
          {
            title: "Actions",
            key: "actions",
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
            fixed: "right" as const,
            width: 100,
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout>
      <Card>
        {userDetails?.role === "Admin" && (
          <div className="flex-end" style={{ marginBottom: 16 }}>
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
        )}

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          sticky
          pagination={{
            showTotal: (total) => `Total ${total} users`,
            position: ["bottomCenter"],
          }}
        />
      </Card>

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
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
          style={{ gap: 8, display: "flex", flexDirection: "column" }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
            style={{ marginBottom: 8 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[{ required: true, message: "Please enter mobile number" }, { max: 10, message: "Cannot be more than 10 characters" }, { pattern: /^[0-9]+$/, message: "Please enter a valid mobile number" }]}
            style={{ marginBottom: 8 }}
          >
            <Input maxLength={10} prefix="+91" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 8 }}
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="employeeCode"
            label="Employee Code"
            style={{ marginBottom: 8 }}
          >
            <Input
              onInput={(e: any) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role" }]}
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
            name="officeId"
            label="Branch"
            rules={[{ required: true, message: "Please select branch" }]}
            style={{ marginBottom: 8 }}
          >
            <Select options={offices} placeholder="Select branch" />
          </Form.Item>
          {editingUser && (
            <Form.Item style={{ marginBottom: 8 }}>
              <Popconfirm
                title="Are you sure you want to deactivate the user?"
                onConfirm={handleDeactivateUser}
                okText="Yes"
                cancelText="No"
              >
                <Button danger style={{ float: "right" }}>
                  Deactivate User
                </Button>
              </Popconfirm>
            </Form.Item>
          )}
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUser ? "Update" : "Add"} User
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingUser(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
