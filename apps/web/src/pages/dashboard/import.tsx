import { useState } from 'react';
import { Card, Upload, Button, Table, message, Space, Typography } from 'antd';
import { UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import axiosInstance from '@/config/axios.config';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title } = Typography;

interface LoanPreview {
  applicationNumber: string;
  applicantName: string;
  applicantMobile: string;
  applicantAddress: string;
  loanType: string;
  bankName: string;
  loanAmount: number;
}

export default function ImportLoans() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewData, setPreviewData] = useState<LoanPreview[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj as File);

    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/loans/import', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Loans imported successfully');
      setFileList([]);
      setPreviewData([]);
    } catch (error) {
      message.error('Failed to import loans');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post('/api/loans/preview', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setPreviewData(response.data);
    } catch (error) {
      message.error('Failed to preview file');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Application Number',
      dataIndex: 'applicationNumber',
      key: 'applicationNumber',
    },
    {
      title: 'Applicant Name',
      dataIndex: 'applicantName',
      key: 'applicantName',
    },
    {
      title: 'Mobile',
      dataIndex: 'applicantMobile',
      key: 'applicantMobile',
    },
    {
      title: 'Address',
      dataIndex: 'applicantAddress',
      key: 'applicantAddress',
    },
    {
      title: 'Loan Type',
      dataIndex: 'loanType',
      key: 'loanType',
    },
    {
      title: 'Bank Name',
      dataIndex: 'bankName',
      key: 'bankName',
    },
    {
      title: 'Loan Amount',
      dataIndex: 'loanAmount',
      key: 'loanAmount',
      render: (amount: number) => `₹${amount.toLocaleString()}`,
    },
  ];

  return (
    <DashboardLayout>
      <Title level={2}>Import Loans</Title>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload
            accept=".xlsx,.xls"
            fileList={fileList}
            onChange={({ fileList }) => {
              setFileList(fileList);
              if (fileList.length > 0 && fileList[0].originFileObj) {
                handlePreview(fileList[0].originFileObj);
              }
            }}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select Excel File</Button>
          </Upload>

          {previewData.length > 0 && (
            <>
              <Title level={4}>Preview</Title>
              <Table
                className="striped-table"
                columns={columns}
                dataSource={previewData}
                rowKey="applicationNumber"
                pagination={false}
                scroll={{ x: true }}
              />
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={handleUpload}
                loading={loading}
                style={{ marginTop: 16 }}
              >
                Import Loans
              </Button>
            </>
          )}
        </Space>
      </Card>
    </DashboardLayout>
  );
} 