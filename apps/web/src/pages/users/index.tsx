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
  Checkbox,
  Row,
  Col,
  FormInstance,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
// import DashboardLayout from "@/components/layout/DashboardLayout";
import { ColumnsType } from "antd/es/table";
import {
  createUserApi,
  getUsersApi,
  updateUserApi,
  updateUserDepartmentRolesApi,
  UserFilters,
} from "@/services/users.services";
import {
  getOfficesApi,
  getOfficesByDepartmentApi,
} from "@/services/settings.services";
import dynamic from "next/dynamic";
import {
  getUserDetails,
  getCurrentDepartment,
  setUserDetails,
  notifyUserDetailsChange,
  getCurrentDepartmentRole,
  useDepartmentChange,
} from "@/utils/utility";
import FilterOverlay from "@/components/users/FilterOverlay";

const { Option } = Select;

interface User {
  id: number;
  name: string;
  mobile: string;
  email: string;
  employeeCode: string;
  locality: string;
  deviceId?: string;
  defaultDepartment?: string;
  officeId?: number; // Made optional since it's not in API response
  status: "Active" | "Inactive";
  role: string;
  office?: {
    id: number;
    name: string;
    location?: string;
  };
  createdAt: string;
  updatedAt: string;
  departmentRoles: any[];
}

interface Office {
  id: number;
  name: string;
}

const DashboardLayout = dynamic(
  () => import("@/components/layout/DashboardLayout"),
  { ssr: false }
);

const RoleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Operations Executive", value: "OperationsExecutive" },
  { label: "Verifier", value: "Verifier" },
  { label: "Field Executive", value: "FieldExecutive" },
];

// import { Form, Checkbox, Select, Row, Col } from "antd";
// import { useState } from "react";

const FIroleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Operations Executive", value: "OperationsExecutive" },
  { label: "Verifier", value: "Verifier" },
  { label: "Field Executive", value: "FieldExecutive" },
];

const PDroleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Operations Executive", value: "OperationsExecutive" },
  { label: "Verifier", value: "Verifier" },
  { label: "Field Executive", value: "FieldExecutive" },
  { label: "Verification Executive", value: "VerificationExecutive" },
];

const departments = ["FI", "PD"];

const DepartmentRoleSelector = ({
  form,
  editingUser,
  fiOffices,
  pdOffices,
}: {
  form: FormInstance;
  editingUser: User | null;
  fiOffices: any[];
  pdOffices: any[];
}) => {
  // Get current department roles directly from form
  const getCurrentDepartments = () => {
    const currentRoles = form.getFieldValue("departmentRoles") || [];
    return currentRoles.map((r: any) => r.department);
  };

  const handleCheck = (checked: boolean, dept: string) => {
    const current = form.getFieldValue("departmentRoles") || [];
    if (checked) {
      form.setFieldsValue({
        departmentRoles: [
          ...current,
          { department: dept, role: undefined, officeId: undefined },
        ],
      });
    } else {
      const updated = current.filter((item: any) => item.department !== dept);
      form.setFieldsValue({ departmentRoles: updated });
    }
  };

  return (
    <div>
      {departments.map((dept, index) => {
        const currentDepartments = getCurrentDepartments();
        const isChecked = currentDepartments.includes(dept);

        return (
          <Row
            key={dept}
            align="middle"
            gutter={16}
            style={{ marginBottom: 12 }}
          >
            <Col>
              <Checkbox
                checked={isChecked}
                onChange={(e) => handleCheck(e.target.checked, dept)}
              >
                {dept}
              </Checkbox>
            </Col>
            <Col flex={1}>
              {isChecked && (
                <>
                  <Form.Item
                    name={[
                      "departmentRoles",
                      currentDepartments.indexOf(dept),
                      "role",
                    ]}
                    noStyle
                  >
                    <Select
                      options={dept === "FI" ? FIroleOptions : PDroleOptions}
                      placeholder={`Select role for ${dept}`}
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                  {/* Branch per department */}
                  <Form.Item
                    name={[
                      "departmentRoles",
                      currentDepartments.indexOf(dept),
                      "officeId",
                    ]}
                    rules={[
                      { required: true, message: `Select branch for ${dept}` },
                    ]}
                    style={{ display: "inline-block", marginLeft: 12 }}
                  >
                    <Select
                      options={dept === "FI" ? fiOffices : pdOffices}
                      placeholder={`Select ${dept} branch`}
                      style={{ width: 240 }}
                      onChange={(val) => {
                        // Keep root officeId in sync for backend
                        const rootOfficeId = form.getFieldValue("officeId");
                        if (!rootOfficeId) {
                          form.setFieldsValue({ officeId: val });
                        }
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[
                      "departmentRoles",
                      currentDepartments.indexOf(dept),
                      "department",
                    ]}
                    initialValue={dept}
                    hidden
                  >
                    <Input />
                  </Form.Item>
                </>
              )}
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default function Users() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const userDetails = getUserDetails();
  const currentDepartment = useDepartmentChange();
  const [offices, setOffices] = useState<Office[]>([]);
  const [fiOffices, setFiOffices] = useState<any[]>([]);
  const [pdOffices, setPdOffices] = useState<any[]>([]);
  const [officeMap, setOfficeMap] = useState<{ [key: number]: string }>({});
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
  }, [currentDepartment]);

  useEffect(() => {
    getOfficesApi()
      .then((res) => {
        const all =
          res?.data?.data?.map((item: any) => ({
            label: `${item.name} - ${item.location}`,
            value: Number(item.id),
          })) ?? [];
        setOffices(all);
        const officeNameMap: { [key: number]: string } = {};
        res?.data?.data?.forEach((item: any) => {
          officeNameMap[item.id] = item.name;
        });
        setOfficeMap(officeNameMap);
      })
      .catch((err) => console.log(err));
    getOfficesByDepartmentApi("FI")
      .then((res) => {
        const fi =
          res?.data?.data?.map((item: any) => ({
            label: `${item.name} - ${item.location}`,
            value: Number(item.id),
          })) ?? [];
        setFiOffices(fi);
      })
      .catch((err) => console.log(err));

    getOfficesByDepartmentApi("PD")
      .then((res) => {
        const pd =
          res?.data?.data?.map((item: any) => ({
            label: `${item.name} - ${item.location}`,
            value: Number(item.id),
          })) ?? [];
        setPdOffices(pd);
      })
      .catch((err) => console.log(err));
  }, [currentDepartment]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const trimmedValues = { ...values };
      ["name", "mobile", "email", "employeeCode", "locality"].forEach(
        (field) => {
          if (typeof trimmedValues[field] === "string") {
            trimmedValues[field] = trimmedValues[field].trim();
          }
        }
      );

      // Ensure departmentRoles is always an array
      if (
        !trimmedValues.departmentRoles ||
        !Array.isArray(trimmedValues.departmentRoles)
      ) {
        trimmedValues.departmentRoles = [];
      }

      console.log("Submitting user data:", trimmedValues);

      if (editingUser) {
        // Split PATCH: main fields, then departmentRoles
        const { departmentRoles, ...mainFields } = trimmedValues;
        await updateUserApi(editingUser?.id, mainFields);
        await updateUserDepartmentRolesApi(editingUser?.id, departmentRoles);

        // Check if the current user is editing their own profile
        if (
          editingUser.id === userDetails?.sub ||
          editingUser.id === userDetails?.id
        ) {
          const updatedUserDetails = {
            ...userDetails,
            ...mainFields,
            departmentRoles: departmentRoles,
          };

          setUserDetails(updatedUserDetails);
          // Notify other components about the user details change
          setTimeout(() => {
            notifyUserDetailsChange();
          }, 100);
        }

        message.success("User updated successfully");
        fetchUsers(pagination.current, pagination.pageSize, filters);
      } else {
        const response = await createUserApi(trimmedValues);
        message.success("User added successfully");
        fetchUsers(1, pagination.pageSize, filters);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    } catch (error: any) {
      console.error("Error submitting user:", error);
      message.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    // console.log('Editing user data:', user);
    // console.log('User office data:', user.office);
    // console.log('User officeId:', user.officeId);

    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      employeeCode: user.employeeCode,
      role: user.role,
      locality: user.locality,
      officeId: user.office?.id || user.officeId,
      departmentRoles: user.departmentRoles,
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
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 120,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 80,
      render: (_: string, record: User) => {
        let deptRole = record.role;
        if (currentDepartment && Array.isArray(record.departmentRoles)) {
          const found = record.departmentRoles.find(
            (dr: any) => dr.department === currentDepartment
          );
          if (found && found.role) {
            deptRole = found.role;
          }
        }
        const getRoleColor = (role: string) => {
          switch (role) {
            case "Admin":
            case "PDAdmin":
              return "geekblue";
            case "OperationsExecutive":
            case "PDOperationsExecutive":
              return "gold";
            case "FieldExecutive":
            case "PDFieldExecutive":
              return "green";
            case "Verifier":
            case "PDVerifier":
              return "volcano";
            default:
              return "default";
          }
        };
        const getRoleLabel = (role: string) => {
          const allOptions = [
            ...RoleOptions,
            ...FIroleOptions,
            ...PDroleOptions,
          ];
          const roleOption = allOptions.find((option) => option.value === role);
          return roleOption ? roleOption.label : role;
        };
        return (
          <Tag color={getRoleColor(deptRole)}>{getRoleLabel(deptRole)}</Tag>
        );
      },
    },
    {
      title: "Branch",
      dataIndex: "office",
      key: "office",
      width: 50,
      render: (office: any, record: User) => {
        if (office?.name) {
          return office.name;
        }

        if (record.departmentRoles && Array.isArray(record.departmentRoles)) {
          const branchNames = record.departmentRoles
            .map((deptRole: any) => {
              if (deptRole.officeId && officeMap[deptRole.officeId]) {
                return officeMap[deptRole.officeId];
              }
              return null;
            })
            .filter((name: string | null) => name !== null);

          if (branchNames.length > 0) {
            return branchNames.join(", ");
          }
        }

        return "-";
      },
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
      ...(getCurrentDepartmentRole() !== "Admin" &&
        getCurrentDepartmentRole() !== "PDAdmin" && { fixed: "right" }),
    },
    ...(getCurrentDepartmentRole() === "Admin"
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
        {getCurrentDepartmentRole() === "Admin" && (
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
                form.setFieldsValue({ departmentRoles: [] });
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
          pagination={
            Object.values(filters).some((v) => v !== undefined && v !== "") &&
            users.length <= 10
              ? false
              : {
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showTotal: (total) => `Total ${total} users`,
                  position: ["bottomCenter"],
                }
          }
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
          form.setFieldsValue({ departmentRoles: [] });
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          // onFinishFailed={(errorInfo) => {
          //   console.log('Form validation failed:', errorInfo);
          // }}
          initialValues={{
            departmentRoles: [],
            status: "Active",
          }}
          style={{ gap: 8, display: "flex", flexDirection: "column" }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter name" },
              {
                validator: (_, value) => {
                  if (value && value.startsWith(" ")) {
                    return Promise.reject("Cannot start with a space.");
                  }
                  if (value && /[^A-Za-z0-9 ]/.test(value)) {
                    return Promise.reject(
                      "Special characters are not allowed."
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input maxLength={40} />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[
              { required: true, message: "Please enter mobile number" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Mobile number must be exactly 10 digits",
              },
              { pattern: /^[^\s].*$/, message: "Cannot start with a space." },
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
              { pattern: /^[^\s].*$/, message: "Cannot start with a space." },
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
            rules={[
              { required: true, message: "Please enter employee code" },
              {
                validator: (_, value) => {
                  if (value && value.startsWith(" ")) {
                    return Promise.reject("Cannot start with a space.");
                  }
                  if (value && /[^A-Za-z0-9 ]/.test(value)) {
                    return Promise.reject(
                      "Special characters are not allowed."
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
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
            name="departmentRoles"
            label="Department & Role"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || !Array.isArray(value) || value.length === 0) {
                    return Promise.reject(
                      "Please select at least one department and role"
                    );
                  }
                  const hasAllRoles = value.every(
                    (item: any) => item.department && item.role
                  );
                  if (!hasAllRoles) {
                    return Promise.reject(
                      "Please select roles for all departments"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <DepartmentRoleSelector
              form={form}
              editingUser={editingUser}
              fiOffices={fiOffices}
              pdOffices={pdOffices}
            />
          </Form.Item>
          <Form.Item
            name="locality"
            label="Location"
            rules={[
              { required: true, message: "Please enter location" },
              {
                validator: (_, value) => {
                  if (value && value.startsWith(" ")) {
                    return Promise.reject("Cannot start with a space.");
                  }
                  if (value && /[^A-Za-z0-9 ]/.test(value)) {
                    return Promise.reject(
                      "Special characters are not allowed."
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input maxLength={30} />
          </Form.Item>
          {/* Removed global Branch field. Branch is now selected per department above. */}
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
                  form.setFieldsValue({ departmentRoles: [] });
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
