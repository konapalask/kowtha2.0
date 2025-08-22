"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  Modal,
  message,
  Tabs,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/config/axios.config";
import { ColumnsType } from "antd/es/table";
import {
  createOfficeApi,
  getOfficesApi,
  getOrganizationApi,
  Office,
  updateOfficeApi,
} from "@/services/settings.services";
import { getUserDetails, getCurrentDepartmentRole } from "@/utils/utility";

const { TabPane } = Tabs;

// interface Office {
//   id: number;
//   name: string;
//   townCity: string;
//   address: string;
//   employees?: number;
// }

interface Organization {
  id: number;
  name: string;
  description: string;
}

export default function OrganizationSettings() {
  const userDetails = getUserDetails();
  const isAdmin = getCurrentDepartmentRole() === "Admin" ;
  const [form] = Form.useForm();
  const [officeForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);
  const [organization, setOrganization] = useState<Organization>({
    id: 1,
    name: "Loan Verification System",
    description: "Organization description",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const result = await getOrganizationApi();
        setOrganization(result.data);
        form.setFieldsValue(result.data);
      } catch (error) {
        console.error("Fetch organization error:", error);
        // message.error("Failed to load organization details");
      }
    };
    fetchOrganization();
  }, [form]);

  // Mock data for UI development
  const fetchOffices = async () => {
    try {
      const result = await getOfficesApi();
      setOffices(result?.data?.data ?? []);
    } catch (error) {
      console.error("Fetch offices error:", error);
      // message.error("Failed to load branches");
    }
  };
  useEffect(() => {
    fetchOffices();
  }, []);

  const handleOrganizationUpdate = async (values: any) => {
    try {
      setLoading(true);
      await axiosInstance.put(
        `/accounts/organization/${organization.id}`,
        values
      );
      setOrganization({ ...organization, ...values });
      message.success("Organization details updated successfully");
    } catch (error) {
      message.error("Failed to update organization details");
    } finally {
      setLoading(false);
    }
  };

  const handleOfficeSubmit = async (values: any) => {
    try {
      setLoading(true);

      if (editingOffice) {
        // Update existing office
        await updateOfficeApi(editingOffice.id, values);
        fetchOffices();
        message.success("Branch updated successfully");
      } else {
        // Create new office
        await createOfficeApi(values);
        fetchOffices();
        message.success("Branch added successfully");
      }

      setIsModalVisible(false);
      officeForm.resetFields();
      setEditingOffice(null);
    } catch (error) {
      console.error("Failed to save Branch:", error);
      message.error("Failed to save Branch");
    } finally {
      setLoading(false);
    }
  };

  const handleEditOffice = (office: Office) => {
    setEditingOffice(office);
    officeForm.setFieldsValue(office);
    setIsModalVisible(true);
  };

  const handleArchive = async (id: number, archive: boolean) => {
    try {
      setLoading(true);
      const values = await officeForm.validateFields();
      console.log(values);
      await updateOfficeApi(id, { ...values, archived: archive });
      fetchOffices();
      message.success(
        `Branch ${archive ? "Deleted" : "Unarchived"} successfully`
      );
    } catch (error) {
      message.error(`Failed to ${archive ? "Delete" : "Unarchive"} Branch`);
    } finally {
      setLoading(false);
    }
  };

  const officeColumns: any[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Town/City",
      dataIndex: "location",
      key: "location",
      width: 150,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 150,
    },
    {
      title: "No. of Employees",
      dataIndex: "numberofEmployees",
      key: "emplnumberofEmployeesoyees",
      sorter: (a: any, b: any) => a.employees - b.employees,
      render: (value: number | undefined) => value ?? 0,
      width: 150,
    },
    ...(isAdmin
      ? [
          {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: Office) => (
              <Space>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditOffice(record)}
                >
                  Edit
                </Button>
              </Space>
            ),
            width: 100,
            fixed: "right",
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout>
      <Tabs defaultActiveKey="1">
        <TabPane tab="General" key="1">
          <Card style={{ marginBottom: 24 }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={organization}
              onFinish={handleOrganizationUpdate}
            >
              <Form.Item
                name="name"
                label="Organization Name"
                rules={[
                  { required: true, message: "Please enter organization name" },
                  {
                    validator: (_, value) =>
                      value && /^\s/.test(value)
                        ? Promise.reject(new Error("Can't start with a space"))
                        : Promise.resolve(),
                  },
                ]}
                // normalize={(value) =>
                //   typeof value === "string"
                //     ? value.trim().replace(/\s{2,}/g, " ")
                //     : value
                // }
              >
                <Input
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                  }}
                  readOnly={!isAdmin}
                />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea rows={4} readOnly={!isAdmin} />
              </Form.Item>

              {isAdmin && (
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Save Changes
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="Branches" key="2">
          <Card>
            {isAdmin && (
              <div style={{ marginBottom: 16 }} className="flex-end">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingOffice(null);
                    officeForm.resetFields();
                    setIsModalVisible(true);
                  }}
                >
                  Add Branch
                </Button>
              </div>
            )}

            <Table
              className="striped-table"
              columns={officeColumns}
              dataSource={offices}
              rowKey="id"
              loading={loading}
              scroll={{ y: 400 }}
              bordered
              pagination={offices.length < 10 ? false : undefined}
              onRow={(record) => {
                return {
                  style: record.archived
                    ? { backgroundColor: 'rgba(255, 0, 0, 0.08)' }
                    : {},
                };
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={editingOffice ? "Edit Branch" : "Add Branch"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOffice(null);
          officeForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={officeForm}
          layout="vertical"
          initialValues={{
            name: editingOffice?.name,
            location: editingOffice?.location,
            address: editingOffice?.address,
          }}
          onFinish={handleOfficeSubmit}
        >
          <Form.Item
            name="name"
            label="Branch Name"
            rules={[
              { required: true, message: "Please enter branch name" },
              {
                validator: (_, value) =>
                  value && /^\s/.test(value)
                    ? Promise.reject(new Error("Can't start with a space"))
                    : Promise.resolve(),
              },
            ]}
          >
            <Input
              onBlur={(e) => {
                e.target.value = e.target.value.trim();
              }}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Town/City"
            rules={[
              { required: true, message: "Please enter town or city" },
              {
                validator: (_, value) =>
                  value && /^\s/.test(value)
                    ? Promise.reject(new Error("Can't start with a space"))
                    : Promise.resolve(),
              },
            ]}
          >
            <Input
              onBlur={(e) => {
                e.target.value = e.target.value.trim(); // or just .trim() to remove both ends
              }}
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingOffice ? "Update" : "Add"} Branch
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingOffice(null);
                  officeForm.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>

          {!editingOffice?.archived && (
            <div style={{ marginTop: 8 }}>
              <Popconfirm
                title="Are you sure you want to archive this office?"
                onConfirm={async () => {
                  setLoading(true);
                  handleArchive(editingOffice?.id, true);
                  setIsModalVisible(false);
                  setEditingOffice(null);
                  officeForm.resetFields();
                  setLoading(false);
                  // message.success("Branch deleted");
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <a style={{ color: "#cf1322" }}>Delete Office</a>
              </Popconfirm>
            </div>
          )}
          {editingOffice?.archived && (
            <div style={{ marginTop: 8 }}>
              <Popconfirm
                title="Are you sure you want to archive this office?"
                onConfirm={async () => {
                  setLoading(true);
                  handleArchive(editingOffice?.id, false);
                  setIsModalVisible(false);
                  setEditingOffice(null);
                  officeForm.resetFields();
                  setLoading(false);
                  // message.success("Branch deleted");
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <a style={{ color: "green" }}>Unarchive Office</a>
              </Popconfirm>
            </div>
          )}
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
