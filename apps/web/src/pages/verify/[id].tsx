import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Typography, Space, Tag, Divider, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, MailOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const { Title } = Typography;

// Dummy data for demo
const dummyLoans = [
  {
    id: 1,
    applicationNumber: 'LOAN-001',
    applicantName: 'John Doe',
    status: 'FVCompleted',
    uploadedAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    bankName: 'HDFC Bank',
    loanType: 'Home Loan',
    loanAmount: 500000,
    contactNumber: '9876543210',
    documents: [
      { type: 'Work', name: 'work_photo1.jpg', url: '#' },
      { type: 'Address', name: 'address_doc1.pdf', url: '#' },
      { type: 'Work', name: 'work_photo2.jpg', url: '#' },
      { type: 'Address', name: 'address_doc2.pdf', url: '#' },
    ],
    photos: [
      { type: 'Work', url: 'https://via.placeholder.com/120?text=Work+Photo+1' },
      { type: 'Address', url: 'https://via.placeholder.com/120?text=Address+Photo+1' },
    ],
  },
  {
    id: 2,
    applicationNumber: 'LOAN-002',
    applicantName: 'Jane Smith',
    status: 'Approved',
    uploadedAt: '2024-03-19T15:30:00Z',
    updatedAt: '2024-03-20T09:15:00Z',
    bankName: 'ICICI Bank',
    loanType: 'Business Loan',
    loanAmount: 1000000,
    contactNumber: '9876543211',
    documents: [
      { type: 'Work', name: 'work_photo3.jpg', url: '#' },
      { type: 'Address', name: 'address_doc3.pdf', url: '#' },
    ],
    photos: [
      { type: 'Work', url: 'https://via.placeholder.com/120?text=Work+Photo+2' },
      { type: 'Address', url: 'https://via.placeholder.com/120?text=Address+Photo+2' },
    ],
  },
];

export default function LoanVerifyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const loan = dummyLoans.find(l => l.id === Number(id));
  const [report, setReport] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [pdfPreviewUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'); // Dummy PDF

  if (!loan) {
    return <DashboardLayout><div>Loan not found.</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <Title level={3}>Loan Verification - {loan.applicationNumber}</Title>
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Left column: details, docs, photos */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <section style={{ marginBottom: 24 }}>
            <Title level={4}>Loan Details</Title>
            <div><strong>Applicant Name:</strong> {loan.applicantName}</div>
            <div><strong>Status:</strong> <Tag color="blue">{loan.status}</Tag></div>
            <div><strong>Bank Name:</strong> {loan.bankName}</div>
            <div><strong>Loan Type:</strong> {loan.loanType}</div>
            <div><strong>Loan Amount:</strong> ₹{loan.loanAmount.toLocaleString()}</div>
            <div><strong>Contact Number:</strong> {loan.contactNumber}</div>
            <div><strong>Uploaded At:</strong> {loan.uploadedAt}</div>
            <div><strong>Updated At:</strong> {loan.updatedAt}</div>
          </section>
          <section style={{ marginBottom: 24 }}>
            <Title level={4}>Documents & Photos</Title>
            <Divider orientation="left">Work Verification</Divider>
            <Space direction="vertical">
              {loan.documents.filter(d => d.type === 'Work').map((doc, idx) => (
                <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
              ))}
              {loan.photos.filter(p => p.type === 'Work').map((photo, idx) => (
                <img key={idx} src={photo.url} alt="Work Photo" style={{ width: 120, borderRadius: 4 }} />
              ))}
            </Space>
            <Divider orientation="left">Address Verification</Divider>
            <Space direction="vertical">
              {loan.documents.filter(d => d.type === 'Address').map((doc, idx) => (
                <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
              ))}
              {loan.photos.filter(p => p.type === 'Address').map((photo, idx) => (
                <img key={idx} src={photo.url} alt="Address Photo" style={{ width: 120, borderRadius: 4 }} />
              ))}
            </Space>
          </section>
        </div>
        {/* Right column: report editor and actions */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <section style={{ marginBottom: 24 }}>
            <Title level={4}>Verification Report</Title>
            <div style={{ marginBottom: 16 }}>
              <ReactQuill value={report} onChange={setReport} style={{ height: 200 }} />
            </div>
            <div style={{ marginTop: 24 }}>
              <Space>
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => { setModalAction('approve'); setModalVisible(true); }}>Approve</Button>
                <Button danger icon={<CloseCircleOutlined />} onClick={() => { setModalAction('reject'); setModalVisible(true); }}>Reject</Button>
              </Space>
            </div>
          </section>
        </div>
      </div>
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        title={modalAction === 'approve' ? 'Approve Loan Verification' : 'Reject Loan Verification'}
      >
        <div style={{ marginBottom: 16 }}>
          <strong>PDF Preview:</strong>
          <iframe src={pdfPreviewUrl} width="100%" height={600} style={{ border: '1px solid #eee', marginTop: 8 }} title="PDF Preview" />
        </div>
        <div style={{ marginBottom: 16 }}>
          Are you sure you want to {modalAction === 'approve' ? 'approve' : 'reject'} this loan verification?
        </div>
        <Space>
          {modalAction === 'approve' && (
            <Button icon={<DownloadOutlined />} type="primary">Approve & Download PDF</Button>
          )}
          <Button type={modalAction === 'approve' ? 'default' : 'primary'}>{modalAction === 'approve' ? 'Approve' : 'Reject'}</Button>
          <Button onClick={() => setModalVisible(false)}>Cancel</Button>
        </Space>
      </Modal>
    </DashboardLayout>
  );
} 