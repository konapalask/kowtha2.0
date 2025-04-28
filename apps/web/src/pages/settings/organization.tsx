import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Space, Modal, message, Typography, Tabs, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
// import { useSession } from 'next-auth/react';
import api from '@/utils/axios';

const { Title } = Typography;
const { TabPane } = Tabs;

interface Office {
  id: number;
  name: string;
  townCity: string;
  address: string;
  employees?: number;
}

interface Organization {
  id: number;
  name: string;
  description: string;
}

export default function OrganizationSettings() {
  // const { data: session } = useSession();
  const [form] = Form.useForm();
  const [officeForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);
  const [organization, setOrganization] = useState<Organization>({
    id: 1,
    name: 'Loan Verification System',
    description: 'Organization description'
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const result = await api.get('/org/organization');
        if (result && result.status >= 200 && result.status < 300) {
          setOrganization(result.data);
          form.setFieldsValue(result.data);
        } else {
          message.error('Failed to load organization details');
        }
      } catch (error) {
        console.error('Fetch organization error:', error);
        message.error('Failed to load organization details');
      }
    };
    fetchOrganization();
  }, [form]);

  // Mock data for UI development
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const result = await api.get('/org/offices');
        if (result && result.status >= 200 && result.status < 300) {
          setOffices(result.data);
        } else {
          message.error('Failed to load offices');
        }
      } catch (error) {
        console.error('Fetch offices error:', error);
        message.error('Failed to load offices');
      }
    };
    fetchOffices();
  }, []);

  const handleOrganizationUpdate = async (values: any) => {
    try {
      setLoading(true);
      const result = await api.put(`/org/organization/${organization.id}`, values);
      if (result && result.status >= 200 && result.status < 300) {
        setOrganization({ ...organization, ...values });
        message.success('Organization details updated successfully');
      } else {
        message.error('Failed to update organization details');
      }
    } catch (error) {
      message.error('Failed to update organization details');
    } finally {
      setLoading(false);
    }
  };

  const handleOfficeSubmit = async (values: any) => {
    try {
      setLoading(true);
  
      if (editingOffice) {
        // Update existing office
        const result = await api.put(`/org/offices/${editingOffice.id}`, values);
        if (result && result.status >= 200 && result.status < 300) {
          setOffices(offices.map(office =>
            office.id === editingOffice.id ? { ...office, ...values } : office
          ));
          message.success('Office updated successfully');
        }
      } else {
        // Create new office
        const result = await api.post('/org/offices', values);
        if (result && result.status >= 200 && result.status < 300) {
          setOffices([...offices, result.data]);
          message.success('Office added successfully');
        }
      }
  
      setIsModalVisible(false);
      officeForm.resetFields();
      setEditingOffice(null);
    } catch (error) {
      console.error('Failed to save office:', error);
      message.error('Failed to save office');
    } finally {
      setLoading(false);
    }
  };
  

  const handleEditOffice = (office: Office) => {
    setEditingOffice(office);
    officeForm.setFieldsValue(office);
    setIsModalVisible(true);
  };

  const handleDeleteOffice = async (id: number) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOffices(offices.filter(office => office.id !== id));
      message.success('Office deleted successfully');
    } catch (error) {
      message.error('Failed to delete office');
    } finally {
      setLoading(false);
    }
  };

  const officeColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Town/City',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'No. of Employees',
      dataIndex: 'employees',
      key: 'employees',
      render: (value: number | undefined) => value ?? 0,
    },
    {
      title: 'Actions',
      key: 'actions',
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
    },
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
                rules={[{ required: true, message: 'Please enter organization name' }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="Description"
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane tab="Offices" key="2">
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingOffice(null);
                  officeForm.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Add Office
              </Button>
            </div>
            
            <Table
              columns={officeColumns}
              dataSource={offices}
              rowKey="id"
              loading={loading}
            />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={editingOffice ? 'Edit Office' : 'Add Office'}
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
            label="Office Name"
            rules={[{ required: true, message: 'Please enter office name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="Town/City"
            rules={[{ required: true, message: 'Please enter town or city' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingOffice ? 'Update' : 'Add'} Office
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingOffice(null);
                officeForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>

          {editingOffice && (
            <div style={{ marginTop: 8 }}>
              <Popconfirm
                title="Are you sure you want to archive this office?"
                onConfirm={async () => {
                  setLoading(true);
                  // Mock API call for archiving
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  setOffices(offices.map(office => office.id === editingOffice.id ? { ...office, archived: true } : office));
                  setIsModalVisible(false);
                  setEditingOffice(null);
                  officeForm.resetFields();
                  setLoading(false);
                  message.success('Office archived');
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <a style={{ color: '#cf1322' }}>Archive Office</a>
              </Popconfirm>
            </div>
          )}
        </Form>
      </Modal>
    </DashboardLayout>
  );
} 

