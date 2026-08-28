import {
  Layout,
  Menu,
  Button,
  Space,
  Typography,
  Avatar,
  Grid,
  Badge,
  notification,
  Popover,
  message,
  Tooltip,
} from "antd";
import {
  DashboardOutlined,
  FileOutlined,
  TeamOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleOutlined,
  AuditOutlined,
  NotificationOutlined,
  UserOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter, Link, Image } from "@/utils/router";
const logo = "/images/appLogos/KowthaDarkIcon.png";
const smallLogo = "/images/appLogos/kowthaSmallLogo.png";
import { getOfficesApi } from "@/services/settings.services";
import {
  getUserDetails,
  setUserDetails,
  getCurrentDepartment,
  setCurrentDepartment,
  initializeCurrentDepartment,
  subscribeToUserDetailsChanges,
  notifyUserDetailsChange,
  getUserDetailsUpdateCounter,
  getCurrentDepartmentRole,
  getFirstAvailableNavigationOption,
  isDepartmentActiveForUser,
  getFirstActiveDepartmentForUser,
} from "@/utils/utility";
import { getAllEditRequestsApi } from "@/services/verifier.services";
import { updateUserDepartmentApi } from "@/services/auth.services";
import { updateUserApi } from "@/services/users.services";
import UserSettingsModal from "../UserSettingsModal";
import SelectDepartmentModal from "../SelectDepartmentModal";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const AVATAR_COLORS = [
  "var(--primary-50)", // lightest primary
  "var(--primary-100)", // light primary
  "var(--primary-200)", // lighter primary
  "var(--primary-300)", // light medium primary
  "var(--primary-400)", // medium primary
  "var(--primary-500)", // medium dark primary
  "var(--primary-600)", // dark primary
];

function getInitials(user: any): string {
  const first = user?.firstName || user?.name?.split(" ")[0] || "";
  const last = user?.lastName || user?.name?.split(" ")[1] || "";
  if (first && last) return (first[0] + last[0]).toUpperCase();
  if (first) return first[0].toUpperCase();
  return "U";
}

function getAvatarColor(userId: number | string | undefined | null): string {
  if (typeof userId !== "number") return AVATAR_COLORS[0];
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const screens = useBreakpoint();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime] = useState(new Date());
  const [userDetails, setUserDetailsState] = useState(getUserDetails());
  const [loading, setLoading] = useState<boolean>(false);
  const [requestData, setRequestData] = useState<any>([]);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [userDepartmentRoles, setUserDepartmentRoles] = useState<
    { department: string; role: string; status?: string }[]
  >([]);
  const [modalUserData, setModalUserData] = useState(userDetails);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [currentDept, setCurrentDept] = useState<string>("");
  const [offices, setOffices] = useState<any[]>([]);
  const [currentBranchName, setCurrentBranchName] = useState<string>("");

  useEffect(() => {
    const handleUserDetailsChange = () => {
      const currentUserDetails = getUserDetails();
      setUserDetailsState(currentUserDetails);
    };

    // Subscribe to user details changes
    const unsubscribe = subscribeToUserDetailsChanges(handleUserDetailsChange);

    return () => unsubscribe();
  }, []);

  // Force re-render when user details update counter changes
  useEffect(() => {
    const checkForUpdates = () => {
      const currentUserDetails = getUserDetails();
      setUserDetailsState(currentUserDetails);
    };

    checkForUpdates();

    const interval = setInterval(checkForUpdates, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initialCurrentDept = initializeCurrentDepartment();
    setCurrentDept(initialCurrentDept);
  }, [userDetails?.defaultDepartment]);

  // If user becomes inactive in current department, fallback to first active
  useEffect(() => {
    if (currentDept && !isDepartmentActiveForUser(currentDept)) {
      const fallback = getFirstActiveDepartmentForUser();
      if (fallback && fallback !== currentDept) {
        setCurrentDept(fallback);
        setCurrentDepartment(fallback);
        message.info(`Switched to ${fallback} since ${currentDept} is inactive`);
      }
    }
  }, [currentDept, userDetails?.departmentRoles]);

  useEffect(() => {
    getOfficesApi()
      .then((res) => {
        setOffices(res?.data?.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (currentDept && userDetails?.departmentRoles && offices.length > 0) {
      const currentDeptRole = userDetails.departmentRoles.find(
        (role: any) => role.department === currentDept
      );

      if (currentDeptRole?.officeId) {
        const office = offices.find(
          (office: any) => office.id === currentDeptRole.officeId
        );
        setCurrentBranchName(office?.name || "");
      } else {
        setCurrentBranchName("");
      }
    }
  }, [currentDept, userDetails?.departmentRoles, offices]);

  const fetchEditRequests = async () => {
    setLoading(true);
    try {
      const response = await getAllEditRequestsApi();
      const data = response?.data ?? [];
      setRequestData(data);

      // const loanRequests = data.filter((req: any) => req?.type !== "Login");
      // const loginRequests = data.filter((req: any) => req?.type === "Login");

      // // console.log({ loanRequests, loginRequests });

      // setEditRequests(loanRequests);
      // setLoginRequests(loginRequests);
    } catch (error) {
      console.error("Error fetching edit requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditRequests();
    const interval = setInterval(fetchEditRequests, 120000); // poll every 2 min
    return () => clearInterval(interval);
  }, [currentDept]); // Add currentDept as dependency to re-fetch when department changes

  // useEffect(() => {
  //   setCollapsed(!!(screens.xs || screens.sm || screens.md));
  // }, [screens]);

  const menuItems = [
    ...(!(
      getCurrentDepartmentRole() === "VerificationExecutive"
    )
      ? [
          {
            key: "dashboard",
            icon: (
              <DashboardOutlined
                style={{ fontSize: 20, color: "var(--primary-800)" }}
              />
            ),
            label: <Link href="/dashboard">Dashboard</Link>,
          },
        ]
      : []),
    {
      key: "loans",
      icon: (
        <FileOutlined style={{ fontSize: 20, color: "var(--primary-800)" }} />
      ),
      label: <Link href="/loans">Loans</Link>,
    },
    ...(getCurrentDepartmentRole() !== "VerificationExecutive"
      ? [
          {
            key: "users",
            icon: (
              <TeamOutlined style={{ fontSize: 20, color: "var(--primary-800)" }} />
            ),
            label: <Link href="/users">Users</Link>,
          },
        ]
      : []),
    ...(getCurrentDepartmentRole() === "Admin" ||
    getCurrentDepartmentRole() === "Verifier" ||
    getCurrentDepartmentRole() === "VerificationExecutive"
      ? [
          {
            key: "verify",
            icon: (
              <CheckCircleOutlined
                style={{ fontSize: 20, color: "var(--primary-800)" }}
              />
            ),
            label: <Link href="/verify">Verify</Link>,
          },
        ]
      : []),
    ...(getCurrentDepartmentRole() === "Admin"
      ? [
          {
            key: "edit-requests",
            icon: (
              <AuditOutlined
                style={{ fontSize: 20, color: "var(--primary-800)" }}
              />
            ),
            label: <Link href="/edit-requests">Requests</Link>,
          },
        ]
      : []),
    // ...(userDetails?.role === "Admin"
    //   ? [
    //       {
    //         key: "attendance",
    //         icon: <Image src={attendanceIcon} alt="Attendance icon" width={20}height={20} style={{filter:"var(--primary-filter)"}} />,
    //         label: <Link href="/attendance">Attendance</Link>,
    //       },
    //     ]
    //   : []),
    {
      key: "settings",
      icon: (
        <SettingOutlined
          style={{ fontSize: 20, color: "var(--primary-800)" }}
        />
      ),
      label: <Link href="/settings/organization">Organization</Link>,
    },
  ];

  const avatarColor = getAvatarColor(userDetails?.id);
  const initials = getInitials(userDetails);

  const handleSettingsClick = async () => {
    setIsSettingsModalVisible(true);
    // Use current user details instead of fetching from API
    setModalUserData(userDetails);
  };

  const handleSettingsModalClose = () => {
    setIsSettingsModalVisible(false);
  };

  const handleChangeDepartment = () => {
    // Set user's department roles for the modal (for changing current department)
    setUserDepartmentRoles(userDetails?.departmentRoles || []);
    setShowDepartmentModal(true);
  };

  const handleCurrentDepartmentChange = (newCurrentDepartment: string) => {
    console.log("Changing current department to:", newCurrentDepartment);
    if (!isDepartmentActiveForUser(newCurrentDepartment)) {
      message.error(`${newCurrentDepartment} (Not supported for Inactive)`);
      return;
    }
    setCurrentDept(newCurrentDepartment);
    setCurrentDepartment(newCurrentDepartment);
    message.success(`Current department changed to ${newCurrentDepartment}`);

    const userDetails = getUserDetails();
    const newDepartmentRole = userDetails?.departmentRoles?.find(
      (role: any) => role.department === newCurrentDepartment
    )?.role;

    if (newDepartmentRole) {
      const firstOption = getFirstAvailableNavigationOption(newDepartmentRole);
      router.push(firstOption);
    } else {
      // Fallback to reload if role not found
      router.reload();
    }
  };

  const handleDepartmentSelect = async (department: string) => {
    try {
      // This now changes the current department, not the default department
      handleCurrentDepartmentChange(department);
      setShowDepartmentModal(false);
    } catch (error) {
      console.error("Error changing current department:", error);
      message.error("Failed to change current department");
      setShowDepartmentModal(false);
    }
  };

  const handleUserUpdate = async (updatedData: {
    name: string;
    email: string;
  }) => {
    try {
      console.log("Attempting to update user:", userDetails.id, updatedData);

      // Update user with name and email using PATCH API
      const response = await updateUserApi(userDetails.id, updatedData);
      console.log("User update response:", response);

      // Create updated user details with new name and email
      const updatedUserDetails = {
        ...userDetails,
        name: updatedData.name,
        email: updatedData.email,
      };

      // Update localStorage with the new user details
      setUserDetails(updatedUserDetails);
      // Update component state to trigger re-render
      setUserDetailsState(updatedUserDetails);
      // Notify other components about the user details change
      notifyUserDetailsChange();
      message.success("User information updated successfully");
    } catch (error: any) {
      console.error("Error updating user information:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);

      const errorMessage =
        error?.response?.data?.message || "Failed to update user information";
      message.error(errorMessage);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleUserDepartmentChange = async (newDefaultDepartment: string) => {
    try {
      // Validate department parameter
      if (!newDefaultDepartment || newDefaultDepartment.trim() === "") {
        message.error("Please select a valid department");
        return;
      }

      console.log(
        "Attempting to update department:",
        userDetails.id,
        newDefaultDepartment
      );
      console.log("User details:", userDetails);

      // Update user with selected default department using PATCH API
      const response = await updateUserDepartmentApi(
        userDetails.id,
        newDefaultDepartment
      );
      console.log("Department update response:", response);

      // Create updated user details with new default department
      const updatedUserDetails = {
        ...userDetails,
        defaultDepartment: newDefaultDepartment,
      };

      // Update localStorage with the new user details
      setUserDetails(updatedUserDetails);
      // Update component state to trigger re-render
      setUserDetailsState(updatedUserDetails);
      // Notify other components about the user details change
      notifyUserDetailsChange();
      message.success("Default department updated successfully");
    } catch (error: any) {
      console.error("Error updating default department:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);
      console.error("Error message:", error?.message);

      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update default department";
      message.error(errorMessage);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  // Removed dropdown menu - profile avatar will directly open modal

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        collapsedWidth={80}
        theme="light"
        style={{
          background: "#ffffff",
          borderRight: "1px solid #eef2f6",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f1f5f9",
            padding: "0 16px",
          }}
        >
          {collapsed ? (
            <Image
              loading="lazy"
              src={smallLogo}
              alt="Kowtha Logo"
              width={42}
              height={42}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <Image
              loading="lazy"
              src={logo}
              alt="Kowtha Logo"
              width={160}
              height={42}
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
        <div style={{ padding: "12px 8px" }}>
          <Menu
            mode="inline"
            selectedKeys={[router.pathname.split("/")[1] || "dashboard"]}
            items={menuItems}
            style={{
              background: "transparent",
              borderRight: 0,
              fontWeight: 500,
              fontSize: 13.5,
            }}
          />
        </div>
      </Sider>
      <Layout style={{ background: "#f8fafc" }}>
        <Header
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "0 28px",
            height: "70px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            borderBottom: "1px solid #eef2f6",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.02)",
            position: "sticky",
            top: 0,
            zIndex: 90,
          }}
        >
          <Space size={20}>
            {/* Current Department and Branch Badge */}
            {currentDept && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f0f7ff",
                  border: "1px solid #d2e2f1",
                  padding: "5px 14px",
                  borderRadius: "9999px",
                }}
              >
                <Badge color="#0B2545" />
                <Text style={{ fontWeight: 700, color: "#0B2545", fontSize: 13 }}>
                  {currentDept}
                </Text>
                {currentBranchName && (
                  <Text style={{ fontWeight: 500, color: "#64748B", fontSize: 12.5 }}>
                    • {currentBranchName}
                  </Text>
                )}
                {userDetails?.departmentRoles && userDetails.departmentRoles.length > 1 && (
                  <Tooltip title="Switch Department">
                    <Button
                      type="text"
                      size="small"
                      icon={<SwapOutlined style={{ fontSize: 13, color: "#0B2545" }} />}
                      onClick={handleChangeDepartment}
                      style={{
                        padding: "0 4px",
                        height: 20,
                        marginLeft: 4,
                      }}
                    />
                  </Tooltip>
                )}
              </div>
            )}

            {getCurrentDepartmentRole() === "Admin" && (
              <Popover
                placement="bottomRight"
                trigger="hover"
                content={
                  <div style={{ minWidth: 320, maxWidth: 400 }}>
                    {requestData && requestData.length > 0 ? (
                      <div style={{ maxHeight: 350, overflowY: "auto" }}>
                        {requestData.slice(0, 5).map((req: any) => (
                          <div
                            key={req.id}
                            style={{
                              border: "1px solid #f1f5f9",
                              borderRadius: 8,
                              marginBottom: 10,
                              padding: 12,
                              background: "#ffffff",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                            }}
                          >
                            <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
                              {req.type || "Edit Request"} -{" "}
                              <span
                                style={{
                                  color:
                                    req.status === "Pending"
                                      ? "#d97706"
                                      : req.status === "Approved"
                                      ? "#059669"
                                      : "#dc2626",
                                }}
                              >
                                {req.status}
                              </span>
                            </div>
                            <div style={{ fontSize: 12.5, color: "#475569" }}>
                              {req.applicantName ||
                                req.requester?.name ||
                                req.requester?.employeeCode ||
                                "-"}
                            </div>
                            <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>
                              {new Date(
                                req.createdAt || req.requestedAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          color: "#94a3b8",
                          textAlign: "center",
                          padding: 16,
                          fontSize: 13,
                        }}
                      >
                        No pending requests
                      </div>
                    )}
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        marginTop: 8,
                        paddingTop: 8,
                        textAlign: "center",
                      }}
                    >
                      <a
                        href="/edit-requests"
                        style={{ color: "#0B2545", fontWeight: 600, fontSize: 13 }}
                      >
                        View all requests →
                      </a>
                    </div>
                  </div>
                }
              >
                <Badge
                  count={requestData?.length || 0}
                  style={{ backgroundColor: "#0B2545" }}
                  size="small"
                >
                  <Button
                    type="text"
                    shape="circle"
                    icon={<NotificationOutlined style={{ fontSize: 18, color: "#475569" }} />}
                  />
                </Badge>
              </Popover>
            )}

            <Text style={{ fontWeight: 600, color: "#64748B", fontSize: 13 }}>
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            {/* Profile Avatar Trigger */}
            <Tooltip title="User Profile & Settings">
              <Avatar
                onClick={handleSettingsClick}
                style={{
                  background: "linear-gradient(135deg, #0B2545 0%, #134074 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(11, 37, 69, 0.25)",
                  fontSize: 15,
                  cursor: "pointer",
                  border: "2px solid #ffffff",
                }}
                size={38}
              >
                {initials}
              </Avatar>
            </Tooltip>
          </Space>
        </Header>
        <Content
          style={{
            margin: 0,
            padding: "24px 28px",
            background: "#f8fafc",
            minHeight: "calc(100vh - 70px)",
          }}
        >
          {children}
        </Content>
      </Layout>
      <style>{`
        .ant-menu-item {
          border-radius: 8px !important;
          margin: 4px 0 !important;
          padding: 0 16px !important;
          transition: all 0.2s ease !important;
        }
        .ant-menu-item-selected {
          background: #f0f7ff !important;
          color: #0B2545 !important;
          font-weight: 600 !important;
        }
        .ant-menu-item-selected .anticon {
          color: #0B2545 !important;
        }
        .ant-menu-item:hover {
          background: #f8fafc !important;
          color: #0B2545 !important;
        }
        .ant-layout-sider-trigger {
          background: #ffffff !important;
          border-top: 1px solid #f1f5f9 !important;
          border-right: 1px solid #eef2f6 !important;
          color: #64748b !important;
          font-size: 16px !important;
        }
        .ant-layout-sider-trigger:hover {
          background: #f8fafc !important;
          color: #0B2545 !important;
        }
      `}</style>

      <UserSettingsModal
        visible={isSettingsModalVisible}
        onCancel={handleSettingsModalClose}
        userData={modalUserData}
        onUpdateUser={handleUserUpdate}
        onChangeDepartment={handleUserDepartmentChange}
        onChangeCurrentDepartment={handleCurrentDepartmentChange}
        loading={isLoadingUserData}
      />

      <SelectDepartmentModal
        visible={showDepartmentModal}
        departmentRoles={userDepartmentRoles}
        onSelect={handleDepartmentSelect}
        onCancel={() => setShowDepartmentModal(false)}
        isCurrentDepartment={true}
        currentDepartment={currentDept}
      />
    </Layout>
  );
}
