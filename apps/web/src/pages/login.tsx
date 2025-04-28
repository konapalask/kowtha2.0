import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Space } from 'antd';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import api from '@/utils/axios';

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  useEffect(() => {
    if (router.query.error) {
      message.error('Authentication failed. Please try again.');
    }
  }, [router.query.error]);

  const handleSendOTP = async (values: { mobile: string }) => {
    try {
      setLoading(true);
      await api.post('/auth/otp/generate', {
        mobile: values.mobile
      });
      setOtpSent(true);
      message.success('OTP sent successfully');
    } catch (error) {
      console.error('OTP send error:', error);
      message.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (values: { mobile: string; otp: string }) => {
    try {
      setLoading(true);
      // Real API call for login
      const result = await api.post('/auth/otp/verify', {
        mobile: values.mobile,
        otp: values.otp,
        });
      if (result?.status >= 200 && result.status < 300) {
        router.push('/dashboard');
      } else {
        message.error('Failed to verify OTP');
      }
    } catch (error) {
      console.error('OTP verify error:', error);
      message.error('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#fbeaf3' // light background for contrast
    }}>
      <Card 
        style={{ 
          width: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8, color: '#85365f' }}>
              Loan Verification System
            </Title>
            <Text type="secondary">
              {otpSent ? 'Enter the OTP sent to your mobile' : 'Enter your mobile number to continue'}
            </Text>
          </div>

          <Form
            form={form}
            onFinish={otpSent ? handleVerifyOTP : handleSendOTP}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="mobile"
              rules={[
                { required: true, message: 'Please enter your mobile number' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' }
              ]}
            >
              <Input 
                prefix={<MobileOutlined />} 
                placeholder="Enter mobile number"
                disabled={otpSent}
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>

            {otpSent && (
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: 'Please enter the OTP' },
                  { pattern: /^[0-9]{6}$/, message: 'Please enter a valid 6-digit OTP' }
                ]}
              >
                <Input 
                  prefix={<LockOutlined />}
                  placeholder="Enter 6-digit OTP"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            )}

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                style={{ 
                  height: '40px',
                  borderRadius: '6px',
                  background: '#85365f',
                  border: 'none',
                  color: '#fff',
                }}
              >
                {otpSent ? 'Verify OTP' : 'Send OTP'}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
} 