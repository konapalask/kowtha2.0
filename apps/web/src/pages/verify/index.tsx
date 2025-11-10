import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { Table, Card, Button, Space, Tag, Typography, Badge, Input, Checkbox, Modal } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
// import DashboardLayout from "@/components/layout/DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import {
  getFieldExecutivesApi,
  getVerifierLoansApi,
} from "@/services/loans.services";
import { useDepartmentChange } from "@/utils/utility";

dayjs.extend(relativeTime);

// const { Title } = Typography;
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";

// Define a generic type for our loan data
type LoanData = {
  id?: string | number;
  applicationNumber?: string;
  applicantName?: string;
  status?: string;
  uploadedAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow for additional properties
};

const DashboardLayout = dynamic(
  () => import("@/components/layout/DashboardLayout"),
  { ssr: false }
);

export default function Verify() {
  const [loading, setLoading] = useState(false);
  // const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loans, setLoans] = useState<LoanData[]>([]);
  const router = useRouter();
  const currentDepartment = useDepartmentChange();

  // Search state
  const [searchApplicationNumber, setSearchApplicationNumber] = useState<string>("");
  const [searchApplicantName, setSearchApplicantName] = useState<string>("");
  
  // Filter state
  const [showPostponedOnly, setShowPostponedOnly] = useState<boolean>(false);

  // Pagination state
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Postponed notification state
  const [postponedNotificationVisible, setPostponedNotificationVisible] = useState(false);
  const [postponedLoans, setPostponedLoans] = useState<any[]>([]);

  // Helper function to get acknowledged postponements from localStorage
  const getAcknowledgedPostponements = (): Set<string> => {
    try {
      const stored = localStorage.getItem("acknowledgedPostponements");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  };

  // Helper function to save acknowledged postponements to localStorage
  const saveAcknowledgedPostponements = (acknowledged: Set<string>) => {
    try {
      localStorage.setItem("acknowledgedPostponements", JSON.stringify(Array.from(acknowledged)));
    } catch (error) {
      console.error("Failed to save acknowledged postponements:", error);
    }
  };

  // Restore page from query string on mount
  useEffect(() => {
    if (router.query.page) {
      const page = parseInt(router.query.page as string, 10);
      if (!isNaN(page)) setCurrentPage(page);
    }
  }, [router.query.page]);

  useEffect(() => {
    getVerifierLoansApi()
      ?.then((res: any) => {
        const newLoans = res?.data?.data ?? [];
        setLoans(newLoans);
        
        // Get already acknowledged postponements
        const acknowledged = getAcknowledgedPostponements();
        
        // Check for postponed appointments that haven't been acknowledged
        const postponedLoansList: any[] = [];
        
        newLoans.forEach((loan: any) => {
          const postponedVerifications = loan?.verifications?.filter(
            (v: any) => v.isPostponed === true && v.status === "Pending"
          ) || [];
          
          if (postponedVerifications.length > 0) {
            const unacknowledgedVerifications = postponedVerifications.filter((v: any) => {
              // Create a unique key for this postponement
              // Include verification ID, postponed date, and reason to detect changes
              const postponementKey = `${v.id}_${v.postponedDate || ''}_${v.postponedReason || ''}`;
              
              // Check if this specific postponement has been acknowledged
              return !acknowledged.has(postponementKey);
            });
            
            if (unacknowledgedVerifications.length > 0) {
              postponedLoansList.push({
                loan,
                verifications: unacknowledgedVerifications,
              });
            }
          }
        });
        
        // Show notification only if there are unacknowledged postponed appointments
        if (postponedLoansList.length > 0) {
          setPostponedLoans(postponedLoansList);
          setPostponedNotificationVisible(true);
        }
      })
      ?.catch((err) => {
        console.log(err);
      });
  }, [currentDepartment]); // Add currentDepartment as dependency

  const filteredLoans =
    loans?.filter((loan) => {
      // Filter by status
      const statusMatch = [
        "Unassigned",
        "Assigned",
        "FVCompleted",
        "Approved",
        "Rejected",
        "Pending",
      ].includes(loan?.status ?? "");

      // Filter by application number
      const applicationNumberMatch = !searchApplicationNumber || 
        (loan?.applicationNumber?.toLowerCase() || "").includes(
          searchApplicationNumber.toLowerCase()
        );

      // Filter by applicant name
      const applicantNameMatch = !searchApplicantName || 
        (loan?.applicantName?.toLowerCase() || "").includes(
          searchApplicantName.toLowerCase()
        );

      // Filter by appointment postponed
      let postponedMatch = true;
      if (showPostponedOnly) {
        const hasPostponedVerification = loan?.verifications?.some(
          (v: any) => v.isPostponed === true && v.status === "Pending"
        );
        postponedMatch = hasPostponedVerification === true;
      }

      return statusMatch && applicationNumberMatch && applicantNameMatch && postponedMatch;
    }) ?? [];

  const getStatusTags = (record: any) => {
    const types = [
      { key: "PermanentAddress", label: "Permanent Address" },
      { key: "CurrentAddress", label: "Current Address" },
      { key: "Work", label: "Work" },
      { key: "Business", label: "Business" },
    ];
    const verifications =
      record?.verifications?.filter(
        (option: any) => option?.status !== "Pending"
      ) ?? [];
    return (
      <Space size={[0, 8]} wrap>
        {types.map((type) => {
          const verification = verifications.find(
            (v: any) => v.addressType === type.key
          );
          if (!verification) {
            return null;
          }
          const isCompleted = verification?.status === "Completed";
          const approvedStatus = verification?.approvedStatus;
          return (
            <Tag key={type.key} color={isCompleted ? "geekblue" : "orange"}>
              {type.label}{" "}
              {approvedStatus ? (
                <CheckOutlined
                  style={{
                    color: approvedStatus === "Positive" ? "green" : "red",
                  }}
                  // color={approvedStatus === "Positive" ? "green" : "red"}
                />
              ) : null}
            </Tag>
          );
        })}
      </Space>
    );
  };

  const columns: ColumnsType<LoanData> = [
    {
      title: "Application Number",
      dataIndex: "applicationNumber",
      key: "applicationNumber",
      width: 150,
      render: (text) => text ?? "-",
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Application Number"
            prefix={<SearchOutlined />}
            value={searchApplicationNumber}
            onChange={(e) => setSearchApplicationNumber(e.target.value)}
            allowClear
            style={{ width: 200 }}
          />
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
      width: 150,
      render: (text) => text ?? "-",
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Applicant Name"
            prefix={<SearchOutlined />}
            value={searchApplicantName}
            onChange={(e) => setSearchApplicantName(e.target.value)}
            allowClear
            style={{ width: 200 }}
          />
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Investigations",
      dataIndex: "status",
      key: "status",
      render: (_, record) => getStatusTags(record),
      width: 200,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date?: string) => (date ? dayjs(date).fromNow() : "-"),
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const statusTags = getStatusTags(record);
        const hasInvestigations = statusTags && statusTags.props && statusTags.props.children && statusTags.props.children.some((child: any) => child !== null);
        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              if (hasInvestigations) {
                record?.id && router?.push?.(`/verify/${record.id}?page=${currentPage}`);
              }
            }}
            disabled={!hasInvestigations}
          >
            View
          </Button>
        );
      },
      width: 100,
      fixed: "right",
    },
  ];

  // Table pagination config
  const paginationConfig =
    filteredLoans.length >= pageSize
      ? {
          current: currentPage,
          pageSize,
          showSizeChanger: false,
          showTotal: (total: number) => `Total ${total ?? 0} items`,
          position: ["bottomCenter" as "bottomCenter"],
          onChange: (page: number) => {
            setCurrentPage(page);
            // Update query string
            router.replace({
              pathname: router.pathname,
              query: { ...router.query, page },
            }, undefined, { shallow: true });
          },
        }
      : false;

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, page: 1 },
    }, undefined, { shallow: true });
  }, [searchApplicationNumber, searchApplicantName, showPostponedOnly]);

  return (
    <DashboardLayout>
      <Card>
        <div
          style={{
            marginTop: 16,
            marginBottom: 16,
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {/* <Badge color="green" text="Completed - Positive" /> */}
            <div style={{ gap: 2 }}>
              <CheckOutlined style={{ color: "green" }} /> Completed - Positive
            </div>
            {/* <Badge color="red" text="Completed - Negative" /> */}
            <div style={{ gap: 2 }}>
              <CheckOutlined style={{ color: "red" }} /> Completed - Negative
            </div>

            {/* <Badge color="green" text="Investigations completed" /> */}
            {/* <Tag color="green">Investigations Completed</Tag> */}
            {/* <Badge color="orange" text="In Progress" />
            <Badge color="default" text="Pending" /> */}
          </div>
          <Checkbox
            checked={showPostponedOnly}
            onChange={(e) => setShowPostponedOnly(e.target.checked)}
          >
            Appointment Postponed
          </Checkbox>
        </div>
        <Table
          className="striped-table"
          // rowClassName={(_,index)=>index%2===0?"":"striped-row"}
          columns={columns}
          dataSource={filteredLoans}
          rowKey={(record) =>
            record?.id?.toString() ?? Math.random().toString()
          }
          loading={loading}
          pagination={paginationConfig}
          // size="small"
          // scroll={{ y: 400 }}
          sticky
          bordered
        />
      </Card>

      {/* Postponed Appointment Notification Modal */}
      <Modal
        open={postponedNotificationVisible}
        onOk={() => {
          // Mark all shown postponements as acknowledged
          const acknowledged = getAcknowledgedPostponements();
          postponedLoans.forEach((item) => {
            item.verifications.forEach((v: any) => {
              const postponementKey = `${v.id}_${v.postponedDate || ''}_${v.postponedReason || ''}`;
              acknowledged.add(postponementKey);
            });
          });
          saveAcknowledgedPostponements(acknowledged);
          setPostponedNotificationVisible(false);
        }}
        onCancel={() => {
          // Mark all shown postponements as acknowledged even if cancelled
          const acknowledged = getAcknowledgedPostponements();
          postponedLoans.forEach((item) => {
            item.verifications.forEach((v: any) => {
              const postponementKey = `${v.id}_${v.postponedDate || ''}_${v.postponedReason || ''}`;
              acknowledged.add(postponementKey);
            });
          });
          saveAcknowledgedPostponements(acknowledged);
          setPostponedNotificationVisible(false);
        }}
        okText="OK"
        cancelButtonProps={{ style: { display: "none" } }}
        width={600}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ExclamationCircleOutlined style={{ color: "#faad14", fontSize: 20 }} />
            <span>Appointment(s) Postponed</span>
          </div>
        }
      >
        <div style={{ marginTop: 16, maxHeight: "60vh", overflowY: "auto" }}>
          {postponedLoans.length > 0 ? (
            <div>
              <p style={{ marginBottom: 16, fontSize: 14, fontWeight: 500 }}>
                The following appointment(s) have been postponed:
              </p>
              {postponedLoans.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    border: "1px solid #f0f0f0",
                    borderRadius: 4,
                    backgroundColor: "#fffbe6",
                  }}
                >
                  <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                    <strong>Application Number:</strong> {item.loan?.applicationNumber}
                  </p>
                  <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                    <strong>Applicant Name:</strong> {item.loan?.applicantName || "-"}
                  </p>
                  {item.verifications.map((v: any, vIndex: number) => (
                    <div key={vIndex} style={{ marginLeft: 16, marginBottom: 8 }}>
                      <p style={{ marginBottom: 4, fontSize: 13 }}>
                        <strong>Verification Type:</strong>{" "}
                        {v.type === "Business"
                          ? "Business Verification"
                          : v.type === "Work"
                            ? "Work Verification"
                            : v.type === "PermanentAddress"
                              ? "Permanent Address Verification"
                              : v.type === "CurrentAddress"
                                ? "Current Address Verification"
                                : v.type}
                      </p>
                      {v.postponedDate && (
                        <p style={{ marginBottom: 4, fontSize: 13 }}>
                          <strong>Postponed To:</strong>{" "}
                          {dayjs(v.postponedDate).format("DD-MM-YYYY")}
                        </p>
                      )}
                      {v.postponedReason && (
                        <p style={{ marginBottom: 4, fontSize: 13 }}>
                          <strong>Reason:</strong> {v.postponedReason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
