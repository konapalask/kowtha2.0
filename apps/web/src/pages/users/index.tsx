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
  Tag,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
// import DashboardLayout from "@/components/layout/DashboardLayout";
import { ColumnsType } from "antd/es/table";
import {
  createUserApi,
  getUsersApi,
  updateUserApi,
  UserFilters,
} from "@/services/users.services";
import { getOfficesApi } from "@/services/settings.services";
import dynamic from "next/dynamic";
import { getUserDetails } from "@/utils/utility";
import FilterOverlay from "@/components/users/FilterOverlay";

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

const DashboardLayout = dynamic(
  () => import("@/components/layout/DashboardLayout"),
  { ssr: false }
);

const FiRoleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Operations Executive", value: "OperationsExecutive" },
  { label: "Verifier", value: "Verifer" },
  { label: "Field Executive", value: "FieldExecutive" },
];

const PdRoleOptions = [
  { label: "PD-Admin", value: "PD-Admin" },
  { label: "PD-Operations Executive", value: "PD-OperationsExecutive" },
  { label: "PD-Verifier", value: "PD-Verifer" },
  { label: "PD-Field Executive", value: "PD-FieldExecutive" },
];

export default function Users() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const userDetails = getUserDetails();
  const [offices, setOffices] = useState<Office[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<UserFilters>({
    employeeCode: undefined,
    name: undefined,
    role: undefined,
  });

 
  const fetchUsers = async (page = 1, pageSize = 10, filters = {}) => {
    setLoading(true);
    try {
      const response = await getUsersApi(page, pageSize, filters);
      const data = response?.data?.data;
      setUsers(data?.records ?? []);
      setPagination({
        current: data.meta.page,
        pageSize: data.meta.limit,
        total: data.meta.total,
        totalPages: data.meta.totalPages,
      });
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, pagination.pageSize, filters);
  }, []);

  useEffect(() => {
    getOfficesApi()
      .then((res) => {
        const options =
          res?.data?.data?.map((item: any) => ({
            label: `${item.name} - ${item.location}`,
            value: item.id,
          })) ?? [];
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
        const response = await updateUserApi(editingUser?.id, values);
        message.success("User updated successfully");
        fetchUsers(pagination.current, pagination.pageSize, filters); 
      } else {
        const response = await createUserApi(values);
        message.success("User added successfully");
        fetchUsers(1, pagination.pageSize, filters); 
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    } catch (error: any) {
      message.error(error?.response?.data?.message);
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      fetchUsers(pagination.current, pagination.pageSize, filters);
      message.success("User deleted successfully");
    } catch (error) {
      message.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatus = (status: string) => {
    form.setFieldsValue({ status });
    handleSubmit({
      ...form.getFieldsValue(),
      status: status,
    });
  };

  const handleTableChange = (newPagination: any) => {
    fetchUsers(newPagination.current, newPagination.pageSize, filters);
  };

  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    fetchUsers(1, pagination.pageSize, newFilters);
  };

  const columns: ColumnsType<User> = [
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 80,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      width: 60,
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
      width: 80,
      render: (role: string) => (
        <Tag
          color={
            role === "Admin"
              ? "geekblue"
              : role === "OperationsExecutive"
                ? "gold"
                : role === "FieldExecutive"
                  ? "green"
                  : "volcano"
          }
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Branch",
      dataIndex: "office",
      key: "office",
      width: 50,
      render: (office: any) => office?.name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 50,
      render: (status: string) =>
        status === "Active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
      ...(userDetails?.role !== "Admin" && { fixed: "right" }),
    },
    ...(userDetails?.role === "Admin"
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_: any, record: User) => (
              // <Space>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                Edit
              </Button>
              // </Space>
            ),
            fixed: "right" as const,
            width: 50,
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout>
      <Card>
        {userDetails?.role === "Admin" && (
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FilterOverlay
              filters={filters}
              onFilterChange={handleFilterChange}
            />
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
          className="striped-table"
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
          sticky
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total) => `Total ${total} users`,
            position: ["bottomCenter"],
          }}
          scroll={{ x: 1500 }}
          bordered
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
            <Input maxLength={40} />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[
              { required: true, message: "Please enter mobile number" },
              { max: 10, message: "Cannot be more than 10 characters" },
              {
                pattern: /^[0-9]+$/,
                message: "Please enter a valid mobile number",
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input maxLength={10} prefix="+91" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 8 }}
            rules={[
              // {
              //   required: true,
              //   message: "Please input your email!",
              // },
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
            rules={[{ required: true, message: "Please enter employee code" }]}
            style={{ marginBottom: 8 }}
          >
            <Input
              maxLength={15}
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
            <Select options={FiRoleOptions} />
          </Form.Item>
          <Form.Item
            name="locality"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
            style={{ marginBottom: 8 }}
          >
            <Input maxLength={30} />
          </Form.Item>
          <Form.Item
            name="officeId"
            label="Branch"
            rules={[{ required: true, message: "Please select branch" }]}
            style={{ marginBottom: 8 }}
          >
            <Select options={offices} placeholder="Select branch" />
          </Form.Item>
          {editingUser && editingUser.status === "Active" && (
            <Form.Item style={{ marginBottom: 8 }}>
              <Popconfirm
                title="Are you sure you want to deactivate the user?"
                onConfirm={() => handleUserStatus("Inactive")}
                okText="Yes"
                cancelText="No"
              >
                <Button danger style={{ float: "right" }}>
                  Deactivate User
                </Button>
              </Popconfirm>
            </Form.Item>
          )}
          {editingUser && editingUser.status === "Inactive" && (
            <Form.Item style={{ marginBottom: 8 }}>
              <Popconfirm
                title="Are you sure you want to activate the user?"
                onConfirm={() => handleUserStatus("Active")}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  style={{
                    float: "right",
                    color: "green",
                    borderColor: "green",
                  }}
                >
                  Activate User
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
