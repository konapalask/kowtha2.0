import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Space, Typography, Progress } from 'antd';
import { LockOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { changePasswordApi } from '@/services/auth.services';

const { Text, Title } = Typography;

interface ChangePasswordModalProps {
  open: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  forceChange?: boolean;
  hasExistingPassword?: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
  onSuccess,
  forceChange = false,
  hasExistingPassword = false,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(passwordValue);

  const handleSubmit = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await changePasswordApi({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password updated successfully!');
      form.resetFields();
      setPasswordValue('');
      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to change password:', error);
      message.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <Space direction="vertical" size={2}>
          <Title level={4} style={{ margin: 0 }}>
            {forceChange ? 'Set Your New Password' : 'Change Password'}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {forceChange
              ? 'Please update your temporary password to secure your account.'
              : 'Choose a strong password to protect your account.'}
          </Text>
        </Space>
      }
      closable={!forceChange}
      maskClosable={!forceChange}
      onCancel={() => {
        if (!forceChange && onClose) {
          form.resetFields();
          setPasswordValue('');
          onClose();
        }
      }}
      footer={null}
      centered
      width={460}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ marginTop: 20 }}
      >
        {hasExistingPassword && !forceChange && (
          <Form.Item
            name="currentPassword"
            label={<Text strong>Current Password</Text>}
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Enter current password"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        )}

        <Form.Item
          name="newPassword"
          label={<Text strong>New Password</Text>}
          rules={[
            { required: true, message: 'Please enter a new password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Enter new password (min 6 characters)"
            size="large"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        {passwordValue && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Password Strength</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: strength < 50 ? '#ef4444' : strength < 100 ? '#f59e0b' : '#10b981',
                }}
              >
                {strength < 50 ? 'Weak' : strength < 100 ? 'Good' : 'Strong'}
              </Text>
            </div>
            <Progress
              percent={strength}
              showInfo={false}
              strokeColor={strength < 50 ? '#ef4444' : strength < 100 ? '#f59e0b' : '#10b981'}
              size="small"
            />
          </div>
        )}

        <Form.Item
          name="confirmPassword"
          label={<Text strong>Confirm New Password</Text>}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Re-enter new password"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {!forceChange && (
            <Button
              size="large"
              onClick={() => {
                form.resetFields();
                setPasswordValue('');
                if (onClose) onClose();
              }}
              style={{ borderRadius: 8 }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            style={{
              borderRadius: 8,
              backgroundColor: '#00396e',
              flex: forceChange ? 1 : undefined,
            }}
          >
            {forceChange ? 'Set Password & Continue' : 'Update Password'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
export default ChangePasswordModal;
