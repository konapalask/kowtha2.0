import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Space,
  Image,
} from "antd";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { MobileOutlined, LockOutlined } from "@ant-design/icons";
// import Image from "next/image";
import { generateOtpApi, verifyOtpApi } from "@/services/auth.services";
import { getCookie, setCookie } from "@/helpers/localStorage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/defaultKeys";

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    if (router.query.error) {
      message.error("Authentication failed. Please try again.");
    }
  }, [router.query.error]);

  const handleSendOTP = async (values: { mobile: string }) => {
    try {
      setLoading(true);
      await generateOtpApi({ mobile: values.mobile });
      setOtpSent(true);
      message.success("OTP sent successfully");
    } catch (error) {
      console.error("OTP send error:", error);
      message.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (values: { mobile: string; otp: string }) => {
    try {
      setLoading(true);
      const result = await verifyOtpApi({
        mobile: values.mobile,
        otp: values.otp,
      });
      if (result.status >= 200 && result.status < 300) {
        console.log(process.env.NEXT_PUBLIC_DOMAIN)
        setCookie(ACCESS_TOKEN, result.data?.accessToken, `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
        setCookie(REFRESH_TOKEN, result.data?.refreshToken, `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");

        // setCookie(REFRESH_TOKEN, result.data.refreshToken);
        console.log(getCookie(ACCESS_TOKEN))
        console.log(getCookie(REFRESH_TOKEN))
        router.push("/dashboard");
      } else {
        message.error(result.data?.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("OTP verify error:", error);
      message.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        // background: "var(--background-secondary)",
        padding: "16px",
        backgroundImage: "url('/images/loginBackground.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          // boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: "8px",
          borderColor:"transparent",
          // background: "var(--background-primary)",
          // opacity: 0.2,
          background:"transparent"
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center",transform:"translateX(-10px)" }}>
            <div style={{ marginBottom: 0 }}>
              <Image
                src="/images/appLogos/KowthaLightIcon.png"
                // src="/images/appLogos/KowthaDarkIcon.png"
                alt="Kowtha Logo"
                width={300}
                height={150}
                style={{ objectFit: "contain" }}
                preview={false}
              />
            </div>
            {/* <Title
              level={2}
              style={{ marginBottom: 8, color: "var(--primary-800)" }}
            >
              Loan Verification System
            </Title> */}
            {/* <Text type="secondary" style={{ color: "var(--neutral-600)" }}>
              {otpSent
                ? "Enter the OTP sent to your mobile"
                : "Enter your mobile number to continue"}
            </Text> */}
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
                { required: true, message: "Please enter your mobile number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              ]}
              style={{
                backgroundColor: "#fff",
                // borderRadius: "6px",
                // height: "40px",
              }}
            >
              <Input
                prefix={
                  <MobileOutlined style={{ color: "var(--primary-600)", fontSize: "16px" }} />
                }
                placeholder="Enter mobile number"
                disabled={otpSent}
                style={{
                  borderRadius: "6px",
                  height: "40px",
                }}
                maxLength={10}
                // minLength={10}
              />
            </Form.Item>

            {otpSent && (
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: "Please enter the OTP" },
                  {
                    pattern: /^[0-9]{6}$/,
                    message: "Please enter a valid 6-digit OTP",
                  },
                ]}
              >
                <Input
                  prefix={
                    <LockOutlined style={{ color: "var(--primary-600)" }} />
                  }
                  placeholder="Enter 6-digit OTP"
                  style={{
                    borderRadius: "6px",
                    height: "40px",
                  }}
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
                  // height: "40px",
                  // borderRadius: "6px",
                  // background: "var(--primary-700)",
                  // border: "none",
                  // color: "#fff",
                  background: "#F37920",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                }}
              >
                {otpSent ? "Verify OTP" : "Send OTP"}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
