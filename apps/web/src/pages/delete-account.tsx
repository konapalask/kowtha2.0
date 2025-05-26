import { useState } from "react";
import {
  Col,
  Row,
  Button,
  Input,
  Form,
  Divider,
  Radio,
  Typography,
  message,
  Modal,
  Space,
  Card,
} from "antd";

type FormValues = {
  username?: string;
  mobile?: string;
  reasons?: string;
  other_reasons?: string;
};

function DeleteAccount() {
  const [form] = Form.useForm<FormValues>();
  const [isOthers, setIsOthers] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const onFinish = (values: FormValues) => {
    if (!values.username && !values.mobile) {
      message.info("Email or Mobile number is required");
      return;
    }
    showModal();
    console.log("Form values:", values);
  };

  const onValuesChange = (changedValues: Partial<FormValues>, allValues: FormValues) => {
    setIsOthers(allValues.reasons === "Other");
  };

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsDataSubmitted(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDataSubmitted(false);
  };

  return (
    <Row justify="center" align="middle" className="login">
      <Col
        lg={{ span: 8, offset: 8 }}
        md={{ span: 12, offset: 6 }}
        sm={{ span: 20, offset: 2 }}
        xs={{ span: 20, offset: 2 }}
        style={{ boxShadow: "0px 5px 5px rgb(0 0 0 / 25%)" }}
      >
        <Card bordered={false}>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <Typography.Title level={3}>Remove Account</Typography.Title>
          </div>
          
          <Form
            form={form}
            name="delete"
            onFinish={onFinish}
            layout="vertical"
            onValuesChange={onValuesChange}
          >
            <Form.Item
              label="Email"
              name="username"
              rules={[{ message: "Please input your email!" }]}
            >
              <Input type="email" />
            </Form.Item>
            
            <Divider orientation="center">Or</Divider>
            
            <Form.Item
              label="Mobile"
              name="mobile"
              rules={[{ message: "Please input your mobile!" }]}
            >
              <Input
                addonBefore="+91"
                type="tel"
                maxLength={10}
                minLength={10}
              />
            </Form.Item>
            
            <Form.Item
              label="Reason"
              name="reasons"
              rules={[{ required: true, message: "Please choose your reason!" }]}
            >
              <Radio.Group>
                <Radio value="No longer needed">No longer needed</Radio>
                <Radio value="Privacy concerns">Privacy concerns</Radio>
                <Radio value="Other">Others</Radio>
              </Radio.Group>
            </Form.Item>

            {isOthers && (
              <Form.Item
                name="other_reasons"
                label="Other Reasons"
                rules={[{ required: true, message: "Please input other reasons" }]}
              >
                <Input.TextArea showCount maxLength={100} />
              </Form.Item>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" danger>
                Delete Account
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      <Modal
        title={!isDataSubmitted ? "Confirm Account Deletion" : undefined}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closable={!isDataSubmitted}
      >
        {isDataSubmitted ? (
          <Typography.Text>
            Our team will contact you within 3-5 working days. If you don't hear from us,
            please contact <a href="mailto:compliance@beyondscale.tech">compliance@beyondscale.tech</a>.
          </Typography.Text>
        ) : (
          <>
            <Typography.Paragraph>
              Are you sure you want to permanently delete your account?
            </Typography.Paragraph>
            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" danger onClick={handleOk}>
                  Confirm Delete
                </Button>
              </Space>
            </div>
          </>
        )}
      </Modal>
    </Row>
  );
}

export default DeleteAccount;