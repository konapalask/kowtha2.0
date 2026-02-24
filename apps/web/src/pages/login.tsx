import { useState, useEffect, useContext } from "react";
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
import { MobileOutlined, LockOutlined } from "@ant-design/icons";
import {
  generateOtpApi,
  verifyOtpApi,
  getUserDetailsApi,
  updateUserDepartmentApi,
} from "@/services/auth.services";
import { getCookie, setCookie } from "@/helpers/localStorage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/defaultKeys";
import { UserContext } from "@/components/layout/UserContextProvider";
import { getUserDetails, isEmpty, setUserDetails, getCurrentDepartmentRole, getDefaultDepartmentRole, getFirstAvailableNavigationOption, setCurrentDepartment, initializeCurrentDepartment, getCurrentDepartment } from "@/utils/utility";
import SelectDepartmentModal from "@/components/SelectDepartmentModal";
// import { useUser } from "@/components/layout/UserContextProvider";

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  // const { userDetails, setUserDetails } = useContext(UserContext);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [userDepartmentRoles, setUserDepartmentRoles] = useState<{ department: string; role: string; status?: string }[]>([]);
  const [userDetailsTemp, setUserDetailsTemp] = useState<any>(null);
  const userDetails = getUserDetails();

  useEffect(() => {
    // Prevent multiple redirects
    if (Object.keys(userDetails).length > 0 && !isNavigating) {
      setIsNavigating(true);
      router
        .push(getFirstAvailableNavigationOption(getDefaultDepartmentRole() || ""))
        .catch((error) => {
          console.error("Navigation error:", error);
          setIsNavigating(false);
          message.error("Failed to navigate to dashboard");
        });
    }
  }, [userDetails, router, isNavigating]);

  useEffect(() => {
    if (router.query.error) {
      message.error("Authentication failed. Please try again.");
    }
  }, [router.query.error]);

  // const handleSendOTP = async (values: { mobile: string }) => {
  //   try {
  //     setLoading(true);
  //     await generateOtpApi({ mobile: values.mobile });
  //     setOtpSent(true);
  //     message.success("OTP sent successfully");
  //   } catch (error) {
  //     console.error("OTP send error:", error);
  //     message.error("Failed to send OTP");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSendOTP = async (values: { mobile: string }) => {
    try {
      setLoading(true);
      await generateOtpApi({ mobile: values.mobile });
      setOtpSent(true);
      message.success("OTP sent successfully");
    } catch (error: any) {
      console.error("OTP send error:", error);

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Message can be string or array — handle both
        const messageText = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message;

        switch (status) {
          case 400:
            message.error(
              messageText || "Bad request. Please check the input."
            );
            break;
          case 403:
            message.error(messageText || "Access denied.");
            break;
          case 404:
            message.error(messageText || "Mobile number not found.");
            break;
          default:
            message.error(
              messageText || "Something went wrong. Please try again."
            );
        }
      } else {
        // For network errors or no response
        message.error("Network error. Please check your connection.");
      }
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

      // Set tokens
      setCookie(
        ACCESS_TOKEN,
        result.data?.accessToken,
        `.${process.env.NEXT_PUBLIC_DOMAIN}`,
        "/"
      );
      setCookie(
        REFRESH_TOKEN,
        result.data?.refreshToken,
        `.${process.env.NEXT_PUBLIC_DOMAIN}`,
        "/"
      );

      // Fetch and set user details
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
          departmentRoles: userDetailsResponse.data.departmentRoles || []
        };

        // Check if user has a default department
        if (!userData.defaultDepartment) {
          const departmentRoles = userData.departmentRoles || [];
          if (!Array.isArray(departmentRoles) || departmentRoles.length === 0) {
            message.error("Invalid department configuration. Please contact administrator.");
            setCookie(ACCESS_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
            setCookie(REFRESH_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
            return;
          }
          if (departmentRoles.length === 1) {
            const singleDepartment = departmentRoles[0].department;
            
            // Validate department object structure
            if (!singleDepartment || typeof singleDepartment !== 'string') {
              console.log("Invalid department structure:", departmentRoles[0]);
              message.error("Invalid department configuration. Please contact administrator.");
              // Clear tokens since login cannot proceed
              setCookie(ACCESS_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
              setCookie(REFRESH_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
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
              
              // Small delay to ensure state is updated before navigation
              setTimeout(() => {
                // The useEffect will handle navigation automatically
              }, 100);
            } catch (error) {
              console.error("Error setting default department:", error);
              message.error("Failed to set default department");
              // Fallback to showing modal if API call fails
              setUserDetailsTemp(userData);
              setUserDepartmentRoles(departmentRoles);
              setShowDepartmentModal(true);
            }
          } else if (departmentRoles.length > 1) {
            console.log(`User has ${departmentRoles.length} departments, showing selection modal`);
            // Validate all department objects have required structure
            const validDepartments = departmentRoles.filter(dept => 
              dept && dept.department && typeof dept.department === 'string' && 
              dept.role && typeof dept.role === 'string'
            );
            
            if (validDepartments.length !== departmentRoles.length) {
              console.log("Some departments have invalid structure:", departmentRoles);
              message.error("Invalid department configuration. Please contact administrator.");
              setCookie(ACCESS_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
              setCookie(REFRESH_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
              return;
            }
            
            // User has multiple departments, show selection modal
            setUserDetailsTemp(userData);
            setUserDepartmentRoles(departmentRoles);
            setShowDepartmentModal(true);
          } else {
            console.log("User has no departments assigned");
            // User has no departments, handle appropriately
            message.error("No departments assigned to user. Please contact administrator.");
            // Clear tokens since login cannot proceed
            setCookie(ACCESS_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
            setCookie(REFRESH_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
          }
        } else {
          setUserDetails(userData);
          // Initialize current department if not already set
          if (!getCurrentDepartment() && userData.defaultDepartment) {
            setCurrentDepartment(userData.defaultDepartment);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        message.error("Failed to fetch user details");
        // Clear tokens if user details fetch fails
        // setCookie(ACCESS_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
        // setCookie(REFRESH_TOKEN, '', `.${process.env.NEXT_PUBLIC_DOMAIN}`, "/");
        // setUserDetails(undefined);
      }
    } catch (error: any) {
      console.error("OTP verify error:", error);
      message.error(error?.response?.data?.message || "Verification failed");
      // setUserDetails(undefined);
    } finally {
      setLoading(false);
    }
  };

  // Don't show login form if user is already logged in and navigating
  if (userDetails && isNavigating) {
    return null;
  }

  const handleBack = () => {
    form.resetFields();
    setOtpSent(false);
  };

  const handleDepartmentSelect = async (department: string) => {
    try {
      // Update user with selected default department using PATCH API
      await updateUserDepartmentApi(userDetailsTemp.id, department);

      // Update user details with the new default department
      const updatedUserDetails = {
        ...userDetailsTemp,
        defaultDepartment: department,
      };

      // Update localStorage with the new user details
      setUserDetails(updatedUserDetails);
      setCurrentDepartment(department);
      setShowDepartmentModal(false);
      message.success("Default department updated successfully");
    } catch (error) {
      console.error("Error updating default department:", error);
      message.error("Failed to update default department");
    }
  };

  // const handleResend = () =>{

  // }

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
          boxShadow: "0 4px 12px rgba(0,0,0,0.65)",
          borderRadius: "8px",
          borderColor: "transparent",
          // background: "var(--background-primary)",
          opacity: 0.7,
          background: "#00396e",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center", transform: "translateX(-10px)" }}>
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
                borderRadius: "8px",
                // height: "40px",
              }}
            >
              <Input
                prefix={
                  <MobileOutlined
                    style={{ color: "var(--primary-600)", fontSize: "16px" }}
                  />
                }
                placeholder="Enter mobile number"
                disabled={otpSent}
                style={{
                  borderRadius: "8px",
                  height: "40px",
                }}
                maxLength={10}
                // minLength={10}
              />
            </Form.Item>
            <br />

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
                  maxLength={6}
                  prefix={
                    <LockOutlined style={{ color: "var(--primary-600)" }} />
                  }
                  placeholder="Enter 6-digit OTP"
                  style={{
                    borderRadius: "8px",
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
                  marginTop: "40px",
                }}
              >
                {otpSent ? "Verify OTP" : "Send OTP"}
              </Button>
            </Form.Item>
            {otpSent && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  type="link"
                  style={{ color: "#fff" }}
                  onClick={handleBack}
                >
                  Back to Login
                </Button>
                {/* <Button type="link" style={{color:"#fff"}} onClick={handleResend}>Resend OTP</Button> */}
              </div>
            )}
          </Form>
        </Space>
      </Card>
      <SelectDepartmentModal
        visible={showDepartmentModal}
        departmentRoles={userDepartmentRoles}
        onSelect={handleDepartmentSelect}
        onCancel={() => setShowDepartmentModal(false)}
      />
    </div>
  );
}
