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
import { useRouter } from "next/router";
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
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../../public/images/appLogos/KowthaDarkIcon.png";
import smallLogo from "../../../public/images/appLogos/kowthaSmallLogo.png";
// import attendanceIcon from "../../../public/images/svgIcons/attendance.svg";
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
    getCurrentDepartmentRole() === "VerificationExecutive" ||
    getCurrentDepartmentRole() === "OperationsExecutive"
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
    <Layout style={{ minHeight: "100vh", fontFamily: "Noto Sans, sans-serif" }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          background: "var(--background-primary)",
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid var(--neutral-200)",
            fontFamily: "Noto Sans, sans-serif",
          }}
        >
          {collapsed ? (
            <Image
              loading="lazy"
              src={smallLogo}
              alt="Kowtha Logo"
              width={120}
              height={60}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <Image
              loading="lazy"
              src={logo}
              alt="Kowtha Logo"
              width={120}
              height={60}
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[router.pathname.split("/")[1] || "dashboard"]}
          items={menuItems}
          style={{ fontFamily: "Noto Sans, sans-serif", fontWeight: 500 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "var(--background-primary)",
            padding: "0 24px",
            display: "flex",
            justifyContent: "flex-end", // align items to the left
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontFamily: "Noto Sans, sans-serif",
          }}
        >
          {/* <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", color: "var(--primary-800)" }}
          /> */}
          <Space>
            {/* Current Department and Branch Display */}
            {currentDept && (
              <Space>
                <Text style={{ fontWeight: 600, color: "var(--primary-800)" }}>
                  {currentDept}
                </Text>
                {currentBranchName && (
                  <Text
                    style={{ fontWeight: 500, color: "var(--neutral-600)" }}
                  >
                    - {currentBranchName}
                  </Text>
                )}
                {userDetails?.departmentRoles &&
                  userDetails.departmentRoles.length > 1 && (
                    <Tooltip title="Change Current Department">
                      <Button
                        type="text"
                        icon={<SwapOutlined />}
                        onClick={handleChangeDepartment}
                        style={{
                          color: "var(--primary-800)",
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </Tooltip>
                  )}
              </Space>
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
                              border: "1px solid #eee",
                              borderRadius: 8,
                              marginBottom: 10,
                              padding: 10,
                              background: "#fff",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                            }}
                          >
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>
                              {req.type || "Edit Request"} -{" "}
                              <span
                                style={{
                                  color:
                                    req.status === "Pending"
                                      ? "#faad14"
                                      : req.status === "Approved"
                                        ? "#52c41a"
                                        : "#ff4d4f",
                                }}
                              >
                                {req.status}
                              </span>
                            </div>
                            <div style={{ fontSize: 13, color: "#555" }}>
                              {req.applicantName ||
                                req.requester?.name ||
                                req.requester?.employeeCode ||
                                "-"}
                            </div>
                            <div style={{ fontSize: 12, color: "#888" }}>
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
                          color: "#888",
                          textAlign: "center",
                          padding: 16,
                        }}
                      >
                        No requests
                      </div>
                    )}
                    <div
                      style={{
                        borderTop: "1px solid #eee",
                        marginTop: 8,
                        paddingTop: 8,
                        textAlign: "center",
                      }}
                    >
                      <a
                        href="/edit-requests"
                        style={{ color: "#1677ff", fontWeight: 500 }}
                      >
                        View all requests
                      </a>
                    </div>
                  </div>
                }
              >
                <Badge
                  count={requestData?.length || 0}
                  style={{ marginRight: 20, fontSize: 10 }}
                  size="small"
                >
                  <span style={{ cursor: "pointer", marginRight: 20 }}>
                    <NotificationOutlined style={{ fontSize: 18 }} />
                  </span>
                </Badge>
              </Popover>
            )}
            {/* Removed default office display - now showing department-specific branch name */}
            <Text style={{ fontWeight: 500 }}>
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            {/* <Text style={{ fontWeight: 500 }}>
              {currentBranchName || "Loading..."}
            </Text> */}
            <Avatar
              onClick={handleSettingsClick}
              style={{
                backgroundColor: "var(--primary-400)",
                color: "#fff",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                fontSize: 18,
                borderRadius: "50%",
                cursor: "pointer",
              }}
              size={40}
            >
              {initials}
            </Avatar>
          </Space>
        </Header>
        <Content
          style={{
            margin: 0,
            padding: 16,
            background: "#f5f5f5",
            fontFamily: "Noto Sans, sans-serif",
          }}
        >
          {children}
        </Content>
      </Layout>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap");
        body,
        html,
        * {
          font-family: "Noto Sans", sans-serif !important;
        }
        :root {
          --ant-primary-color: var(--primary-800);
        }
        .ant-btn-primary {
          background: var(--primary-800) !important;
          border-color: var(--primary-800) !important;
        }
        .ant-btn-primary:hover,
        .ant-btn-primary:focus {
          background: var(--primary-700) !important;
          border-color: var(--primary-700) !important;
        }
        .ant-menu-item-selected {
          background: var(--primary-50) !important;
          color: var(--primary-800) !important;
        }
        .ant-menu-item:hover {
          color: var(--primary-700) !important;
        }
        .ant-menu-item-selected .anticon {
          color: var(--primary-800) !important;
        }
        .ant-layout-sider-trigger {
          background: var(--primary-50) !important;
          color: var(--primary-800) !important;
          font-size: 20px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.3s;
        }

        .ant-layout-sider-trigger:hover {
          background: var(--primary-100) !important;
          color: var(--primary-700) !important;
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
