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
  Tabs,
  Badge,
} from "antd";
import { useRouter } from "@/utils/router";
import { MobileOutlined, LockOutlined, UserOutlined, KeyOutlined, SafetyCertificateFilled } from "@ant-design/icons";
import {
  generateOtpApi,
  verifyOtpApi,
  loginWithPasswordApi,
  getUserDetailsApi,
  updateUserDepartmentApi,
} from "@/services/auth.services";
import { setCookie } from "@/helpers/localStorage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/defaultKeys";
import { DOMAIN } from "@/config/env";
import {
  getUserDetails,
  setUserDetails,
  getDefaultDepartmentRole,
  getFirstAvailableNavigationOption,
  setCurrentDepartment,
  getCurrentDepartment,
} from "@/utils/utility";
import SelectDepartmentModal from "@/components/SelectDepartmentModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";

const { Title, Text } = Typography;

export default function Login() {
  const [otpForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("password");
  const [isNavigating, setIsNavigating] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showForcePasswordModal, setShowForcePasswordModal] = useState(false);
  const [userDepartmentRoles, setUserDepartmentRoles] = useState<
    { department: string; role: string; status?: string }[]
  >([]);
  const [userDetailsTemp, setUserDetailsTemp] = useState<any>(null);
  const userDetails = getUserDetails();

  useEffect(() => {
    if (Object.keys(userDetails).length > 0 && !isNavigating && !showForcePasswordModal) {
      try {
        router.push(getFirstAvailableNavigationOption(getDefaultDepartmentRole() || ""));
      } catch (error) {
        console.error("Navigation error:", error);
        setIsNavigating(false);
        message.error("Failed to navigate to dashboard");
      }
    }
  }, [userDetails, router, isNavigating, showForcePasswordModal]);

  useEffect(() => {
    if (router.query.error) {
      message.error("Authentication failed. Please try again.");
    }
  }, [router.query.error]);

  const processSuccessfulAuth = async (
    accessToken: string,
    refreshToken: string,
    isPasswordChanged: boolean = true
  ) => {
    setCookie(ACCESS_TOKEN, accessToken, `.${DOMAIN}`, "/");
    setCookie(REFRESH_TOKEN, refreshToken, `.${DOMAIN}`, "/");

    try {
      const userDetailsResponse = await getUserDetailsApi();
      if (!userDetailsResponse?.data) {
        throw new Error("No user details received");
      }

      const userData = {
        ...userDetailsResponse.data,
        id: userDetailsResponse.data.id || userDetailsResponse.data.sub,
        mobile: userDetailsResponse.data.mobile || "",
        role: userDetailsResponse.data.role || "User",
        officeId: userDetailsResponse.data.officeId || null,
        employeeCode: userDetailsResponse.data.employeeCode || "",
        name: userDetailsResponse.data.name || "",
        email: userDetailsResponse.data.email || "",
        defaultDepartment: userDetailsResponse.data.defaultDepartment || "",
        status: userDetailsResponse.data.status || "Active",
        locality: userDetailsResponse.data.locality || "",
        departmentRoles: userDetailsResponse.data.departmentRoles || [],
      };

      if (!isPasswordChanged) {
        setUserDetailsTemp(userData);
        setShowForcePasswordModal(true);
        return;
      }

      await finalizeLogin(userData);
    } catch (error: any) {
      console.error("Error fetching user details:", error);
      message.error("Failed to fetch user details");
    }
  };

  const finalizeLogin = async (userData: any) => {
    if (!userData.defaultDepartment) {
      const departmentRoles = userData.departmentRoles || [];
      if (!Array.isArray(departmentRoles) || departmentRoles.length === 0) {
        message.error("Invalid department configuration. Please contact administrator.");
        setCookie(ACCESS_TOKEN, "", `.${DOMAIN}`, "/");
        setCookie(REFRESH_TOKEN, "", `.${DOMAIN}`, "/");
        return;
      }
      if (departmentRoles.length === 1) {
        const singleDepartment = departmentRoles[0].department;
        if (!singleDepartment || typeof singleDepartment !== "string") {
          message.error("Invalid department configuration. Please contact administrator.");
          setCookie(ACCESS_TOKEN, "", `.${DOMAIN}`, "/");
          setCookie(REFRESH_TOKEN, "", `.${DOMAIN}`, "/");
          return;
        }

        try {
          await updateUserDepartmentApi(userData.id, singleDepartment);
          const updatedUserDetails = {
            ...userData,
            defaultDepartment: singleDepartment,
          };
          setUserDetails(updatedUserDetails);
          setCurrentDepartment(singleDepartment);
          message.success(`Default department set to ${singleDepartment}`);
        } catch (error) {
          console.error("Error setting default department:", error);
          message.error("Failed to set default department");
          setUserDetailsTemp(userData);
          setUserDepartmentRoles(departmentRoles);
          setShowDepartmentModal(true);
        }
      } else if (departmentRoles.length > 1) {
        const validDepartments = departmentRoles.filter(
          (dept) =>
            dept &&
            dept.department &&
            typeof dept.department === "string" &&
            dept.role &&
            typeof dept.role === "string"
        );
        if (validDepartments.length !== departmentRoles.length) {
          message.error("Invalid department configuration. Please contact administrator.");
          setCookie(ACCESS_TOKEN, "", `.${DOMAIN}`, "/");
          setCookie(REFRESH_TOKEN, "", `.${DOMAIN}`, "/");
          return;
        }
        setUserDetailsTemp(userData);
        setUserDepartmentRoles(departmentRoles);
        setShowDepartmentModal(true);
      } else {
        message.error("No departments assigned to user. Please contact administrator.");
        setCookie(ACCESS_TOKEN, "", `.${DOMAIN}`, "/");
        setCookie(REFRESH_TOKEN, "", `.${DOMAIN}`, "/");
      }
    } else {
      setUserDetails(userData);
      if (!getCurrentDepartment() && userData.defaultDepartment) {
        setCurrentDepartment(userData.defaultDepartment);
      }
    }
  };

  const handlePasswordLogin = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      const res = await loginWithPasswordApi({
        username: values.username,
        password: values.password,
        isMobile: false,
      });

      if (res.data?.accessToken && res.data?.refreshToken) {
        message.success("Logged in successfully!");
        await processSuccessfulAuth(
          res.data.accessToken,
          res.data.refreshToken,
          res.data.isPasswordChanged
        );
      } else {
        message.error("Login failed. No token received.");
      }
    } catch (error: any) {
      console.error("Password login error:", error);
      message.error(error.response?.data?.message || "Invalid mobile/email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (values: { mobile: string }) => {
    try {
      setLoading(true);
      await generateOtpApi({ mobile: values.mobile });
      setOtpSent(true);
      message.success("OTP sent successfully");
    } catch (error: any) {
      console.error("OTP send error:", error);
      const messageText = error?.response?.data?.message;
      message.error(messageText || "Failed to send OTP. Please check mobile number.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (values: { mobile: string; otp: string }) => {
    try {
      setLoading(true);
      const result = await verifyOtpApi(values);
      if (result.data?.accessToken && result.data?.refreshToken) {
        message.success("OTP verified successfully");
        await processSuccessfulAuth(result.data.accessToken, result.data.refreshToken, true);
      } else {
        message.error("Authentication failed");
      }
    } catch (error: any) {
      console.error("OTP verify error:", error);
      message.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentSelect = async (department: string) => {
    try {
      await updateUserDepartmentApi(userDetailsTemp.id, department);
      const updatedUserDetails = {
        ...userDetailsTemp,
        defaultDepartment: department,
      };
      setUserDetails(updatedUserDetails);
      setCurrentDepartment(department);
      setShowDepartmentModal(false);
      message.success("Default department updated successfully");
    } catch (error) {
      console.error("Error updating default department:", error);
      message.error("Failed to update default department");
    }
  };

  const handlePasswordChangedSuccess = async () => {
    setShowForcePasswordModal(false);
    if (userDetailsTemp) {
      await finalizeLogin(userDetailsTemp);
    }
  };

  if (userDetails && isNavigating && !showForcePasswordModal) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px), radial-gradient(#e2e8f0 1px, #f8fafc 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
        padding: "24px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Floating Posh White Card */}
        <Card
          style={{
            background: "#ffffff",
            border: "1px solid #eef2f6",
            borderRadius: "20px",
            boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.02)",
            padding: "16px 8px 8px 8px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24, marginTop: 8 }}>
            <div style={{ display: "inline-block", marginBottom: 12 }}>
              <Image
                src="/images/appLogos/KowthaDarkIcon.png"
                alt="Kowtha Logo"
                width={190}
                preview={false}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div>
              <Title level={4} style={{ margin: "4px 0 0 0", color: "#0B2545", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Loan Verification Platform
              </Title>
              <Text type="secondary" style={{ fontSize: 13, color: "#64748B" }}>
                Secure enterprise portal & verification management
              </Text>
            </div>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setOtpSent(false);
            }}
            centered
            items={[
              {
                key: "password",
                label: (
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>
                    <KeyOutlined /> Password Login
                  </span>
                ),
                children: (
                  <Form
                    form={passwordForm}
                    onFinish={handlePasswordLogin}
                    layout="vertical"
                    size="large"
                    style={{ marginTop: 12 }}
                  >
                    <Form.Item
                      name="username"
                      label={<Text strong style={{ fontSize: 13, color: "#334155" }}>Mobile Number or Email</Text>}
                      rules={[{ required: true, message: "Please enter your mobile or email" }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: "#94A3B8", marginRight: 6 }} />}
                        placeholder="e.g. 9876543210 or user@cakowtha.co.in"
                        style={{ height: 44, borderRadius: 8 }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label={<Text strong style={{ fontSize: 13, color: "#334155" }}>Password</Text>}
                      rules={[{ required: true, message: "Please enter your password" }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: "#94A3B8", marginRight: 6 }} />}
                        placeholder="••••••••"
                        style={{ height: 44, borderRadius: 8 }}
                      />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24, marginBottom: 8 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{
                          background: "#0B2545",
                          height: 46,
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 14.5,
                          letterSpacing: "0.01em",
                        }}
                      >
                        Sign In to Account
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: "otp",
                label: (
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>
                    <MobileOutlined /> OTP Login
                  </span>
                ),
                children: (
                  <Form
                    form={otpForm}
                    onFinish={otpSent ? handleVerifyOTP : handleSendOTP}
                    layout="vertical"
                    size="large"
                    style={{ marginTop: 12 }}
                  >
                    <Form.Item
                      name="mobile"
                      label={<Text strong style={{ fontSize: 13, color: "#334155" }}>Registered Mobile Number</Text>}
                      rules={[
                        { required: true, message: "Please enter your mobile number" },
                        { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit mobile number" },
                      ]}
                    >
                      <Input
                        prefix={<MobileOutlined style={{ color: "#94A3B8", marginRight: 6 }} />}
                        placeholder="10-digit mobile number"
                        disabled={otpSent}
                        maxLength={10}
                        style={{ height: 44, borderRadius: 8 }}
                      />
                    </Form.Item>

                    {otpSent && (
                      <Form.Item
                        name="otp"
                        label={<Text strong style={{ fontSize: 13, color: "#334155" }}>One-Time Password (OTP)</Text>}
                        rules={[
                          { required: true, message: "Please enter the OTP" },
                          { pattern: /^[0-9]{6}$/, message: "Please enter a valid 6-digit OTP" },
                        ]}
                      >
                        <Input
                          maxLength={6}
                          prefix={<LockOutlined style={{ color: "#94A3B8", marginRight: 6 }} />}
                          placeholder="6-digit OTP"
                          style={{ height: 44, borderRadius: 8, letterSpacing: "0.2em", fontWeight: 600 }}
                        />
                      </Form.Item>
                    )}

                    <Form.Item style={{ marginTop: 24, marginBottom: 8 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{
                          background: "#0B2545",
                          height: 46,
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 14.5,
                        }}
                      >
                        {otpSent ? "Verify OTP & Continue" : "Request Secure OTP"}
                      </Button>
                    </Form.Item>

                    {otpSent && (
                      <div style={{ textAlign: "center", marginTop: 10 }}>
                        <Button
                          type="link"
                          style={{ color: "#0B2545", padding: 0, fontWeight: 500 }}
                          onClick={() => {
                            otpForm.resetFields();
                            setOtpSent(false);
                          }}
                        >
                          ← Change Mobile Number
                        </Button>
                      </div>
                    )}
                  </Form>
                ),
              },
            ]}
          />

          <div style={{ textAlign: "center", marginTop: 18, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Text type="secondary" style={{ fontSize: 12, color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <SafetyCertificateFilled style={{ color: "#059669" }} /> 256-Bit Encrypted Secure Authentication
            </Text>
          </div>
        </Card>
      </div>

      <SelectDepartmentModal
        visible={showDepartmentModal}
        departmentRoles={userDepartmentRoles}
        onSelect={handleDepartmentSelect}
        onCancel={() => setShowDepartmentModal(false)}
      />

      <ChangePasswordModal
        open={showForcePasswordModal}
        forceChange={true}
        hasExistingPassword={false}
        onSuccess={handlePasswordChangedSuccess}
      />
    </div>
  );
}
