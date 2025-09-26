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
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axiosInstance from "@/config/axios.config";
import { ColumnsType } from "antd/es/table";
import {
  createOfficeApi,
  getOfficesApi,
  getOrganizationApi,
  getBanksApi,
  createBankApi,
  updateBankApi,
  deleteBankApi,
  Office,
  Bank,
  updateOfficeApi,
} from "@/services/settings.services";
import { getUserDetails, getCurrentDepartmentRole, getCurrentDepartment } from "@/utils/utility";

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
  const currentDepartment = getCurrentDepartment();
  const isFI = currentDepartment === "FI";
  const [form] = Form.useForm();
  const [officeForm] = Form.useForm();
  const [bankForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [organization, setOrganization] = useState<Organization>({
    id: 1,
    name: "Loan Verification System",
    description: "Organization description",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);

  useEffect(() => {
    if (isModalVisible) {
      if (editingOffice) {
        officeForm.setFieldsValue({
          name: editingOffice.name,
          location: editingOffice.location,
          address: editingOffice.address,
        });
      } else {
        officeForm.resetFields();
      }
    }
  }, [isModalVisible, editingOffice, officeForm]);

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


  const fetchBanks = async () => {
    try {
      const result = await getBanksApi();
      setBanks(result?.data?.data ?? []);
    } catch (error) {
      console.error("Fetch banks error:", error);
    }
  };
  useEffect(() => {
    if (isFI) {
      fetchBanks();
    }
  }, [isFI]);

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

  const handleCreateBank = async (values: any) => {
    try {
      setLoading(true);
      await createBankApi(values);
      message.success("Bank created successfully");
      setIsBankModalVisible(false);
      bankForm.resetFields();
      fetchBanks();
    } catch (error) {
      message.error("Failed to create bank");
    } finally {
      setLoading(false);
    }
  };

  const handleBankSubmit = async (values: any) => {
    try {
      setLoading(true);

      if (editingBank) {
        await updateBankApi(editingBank.id, values);
        fetchBanks();
        message.success("Bank updated successfully");
      } else {
        await createBankApi(values);
        fetchBanks();
        message.success("Bank created successfully");
      }

      setIsBankModalVisible(false);
      bankForm.resetFields();
      setEditingBank(null);
    } catch (error) {
      message.error(`Failed to ${editingBank ? 'update' : 'create'} bank`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBank = (bank: Bank) => {
    setEditingBank(bank);
    bankForm.setFieldsValue(bank);
    setIsBankModalVisible(true);
  };

  const handleDeleteBank = async (id: number) => {
    try {
      setLoading(true);
      await deleteBankApi(id);
      fetchBanks();
      message.success("Bank deleted successfully");
    } catch (error) {
      message.error("Failed to delete bank");
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

  const bankColumns: any[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 170,
    },
    {
      title: "Parent Company",
      dataIndex: "parent",
      key: "parent",
      width: 170,
    },
    // {
    //   title: "Logo",
    //   dataIndex: "logo",
    //   key: "logo",
    //   width: 170,
    //   render: (logo: string | null) => 
    //     logo ? (
    //       <img 
    //         src={logo} 
    //         alt="Bank Logo" 
    //         style={{ width: 50, height: 50, objectFit: "contain" }} 
    //       />
    //     ) : (
    //       <span style={{ color: "#999" }}>No Logo</span>
    //     ),
    // },
        {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
      sorter: (a: Bank, b: Bank) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
    },
    ...(isAdmin
      ? [
          {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: Bank) => (
              <Space>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditBank(record)}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this bank?"
                  onConfirm={() => handleDeleteBank(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Button>
                </Popconfirm>
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

                 {isFI && (
          <TabPane tab="Banks" key="3">
            <Card>
              {isAdmin && (
                <div style={{ marginBottom: 16 }} className="flex-end">
                                <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingBank(null);
                  bankForm.resetFields();
                  setIsBankModalVisible(true);
                }}
              >
                Add Bank
              </Button>
                </div>
              )}

              <Table
                className="striped-table"
                columns={bankColumns}
                dataSource={banks}
                rowKey="id"
                loading={loading}
                scroll={{ y: 400 }}
                bordered
                pagination={banks.length < 10 ? false : undefined}
              />
            </Card>
          </TabPane>
        )}
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
                e.target.value = e.target.value.trim();
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

          {editingOffice && !editingOffice?.archived && (
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
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <a style={{ color: "#cf1322" }}>Delete Office</a>
              </Popconfirm>
            </div>
          )}
          {editingOffice && editingOffice?.archived && (
            <div style={{ marginTop: 8 }}>
              <Popconfirm
                title="Are you sure you want to unarchive this office?"
                onConfirm={async () => {
                  setLoading(true);
                  handleArchive(editingOffice?.id, false);
                  setIsModalVisible(false);
                  setEditingOffice(null);
                  officeForm.resetFields();
                  setLoading(false);
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

      <Modal
        title={editingBank ? "Edit Bank" : "Add Bank"}
        open={isBankModalVisible}
        centered
        onCancel={() => {
          setIsBankModalVisible(false);
          setEditingBank(null);
          bankForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={bankForm}
          layout="vertical"
          onFinish={handleBankSubmit}
          initialValues={{ logo: undefined, parent: undefined }}
        >
          <Form.Item
            name="name"
            label="Bank Name"
            rules={[
              { required: true, message: "Please enter bank name" },
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

          {/* <Form.Item name="logo" label="Logo URL">
            <Input />
          </Form.Item> */}

          <Form.Item 
            name="parent" 
            label="Parent Company"
            rules={[
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

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingBank ? "Update" : "Add"} Bank
              </Button>
              <Button
                onClick={() => {
                  setIsBankModalVisible(false);
                  setEditingBank(null);
                  bankForm.resetFields();
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
