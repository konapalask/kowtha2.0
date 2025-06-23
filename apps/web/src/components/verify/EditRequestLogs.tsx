import React from "react";
import { Card, Typography, Row, Col, Button, message, Space } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import {
  postEditRequestApi,
  updateEditRequestApi,
} from "@/services/verifier.services";
import BasicDetailsDescription from "./Descriptions/BasicDetailsDescription";
import AddressVerificationDescription from "./Descriptions/AddressVerificationDescription";
import FamilyEmploymentDescription from "./Descriptions/FamilyEmploymentDescription";
import ResidenceDetailsDescription from "./Descriptions/ResidenceDetailsDescription";
import ThirdPartyCheckDescription from "./Descriptions/ThirdPartyCheckDescription";
import WorkBasicDetailsDescription from "./Descriptions/WorkBasicDetailsDescription";
import BusinessBasicDetailsDescription from "./Descriptions/BusinessBasicDetailsDescription";
import WorkEmploymentDetailsDescription from "./Descriptions/WorkEmploymentDetailsDescription";
import BusinessDetailsDescription from "./Descriptions/BusinessDetailsDescription";
import BusinessMiscellaneousDescription from "./Descriptions/BusinessMiscellaneousDescription";
import { useRouter } from "next/router";
import { useTabContext } from "@/pages/verify/[id]";
import { getUserDetails } from "@/utils/utility";

const { Text } = Typography;

const getLabels = {
  basicDetails: "Basic Details",
  workBasicDetails: "Basic Details",
  businessBasicDetails: "Basic Details",
  addressVerification: "Address Verification",
  familyEmploymentDetails: "Family & Employment Details",
  residenceDetails: "Residence Details",
  thirdPartyCheck: "Third Party Check",
  employmentDetails: "Employment Details",
  businessDetails: "Business Details",
  miscellaneous: "Business Miscellaneous Details",
};

const getDescriptions = (activeTab: string) => ({
  basicDetails:
    activeTab === "Work"
      ? WorkBasicDetailsDescription
      : activeTab === "Business"
        ? BusinessBasicDetailsDescription
        : BasicDetailsDescription,
  workBasicDetails: WorkBasicDetailsDescription,
  businessBasicDetails: BusinessBasicDetailsDescription,
  addressVerification: AddressVerificationDescription,
  familyEmploymentDetails: FamilyEmploymentDescription,
  residenceDetails: ResidenceDetailsDescription,
  thirdPartyCheck: ThirdPartyCheckDescription,
  employmentDetails: WorkEmploymentDetailsDescription,
  businessDetails: BusinessDetailsDescription,
  miscellaneous: BusinessMiscellaneousDescription,
});

interface EditRequestLogsProps {
  currentData: any;
  changedData: any;
  verificationId: string;
  fetchEditRequests: () => void;
  disabled: boolean;
  verificationType: string;
  admin: boolean;
}

// Helper to get changed keys for a section
const getChangedKeys = (currentSection: any, editSection: any) => {
  if (!currentSection || !editSection) return [];

  return Object.keys({ ...currentSection, ...editSection }).filter((key) => {
    // Skip if both values are undefined or null
    if (!currentSection[key] && !editSection[key]) return false;

    // If one value exists and the other doesn't, it's a change
    if (!currentSection[key] || !editSection[key]) return true;

    // For arrays, compare length and contents
    if (Array.isArray(currentSection[key]) && Array.isArray(editSection[key])) {
      if (currentSection[key].length !== editSection[key].length) return true;
      return (
        JSON.stringify(currentSection[key]) !== JSON.stringify(editSection[key])
      );
    }

    // For objects, do deep comparison
    if (
      typeof currentSection[key] === "object" &&
      typeof editSection[key] === "object"
    ) {
      return (
        JSON.stringify(currentSection[key]) !== JSON.stringify(editSection[key])
      );
    }

    // For primitive values, do direct comparison
    return currentSection[key] !== editSection[key];
  });
};

const EditRequestLogs: React.FC<EditRequestLogsProps> = (_props) => {
  const router: any = useRouter();
  const loanId = router?.query?.id || null;
  // const verificationType = router?.query?.activeTab || "PermanentAddress";
  const { activeTab } = useTabContext();
  // console.log("activeTab", activeTab);
  const userDetails = getUserDetails();
  const {
    currentData,
    changedData,
    verificationId,
    fetchEditRequests,
    disabled,
    verificationType,
    admin,
  } = _props;
  // console.log("currentData", currentData);
  // console.log("changedData", changedData);

  if (!changedData) {
    return (
      <Card
        title={
          <Typography style={{ fontSize: 16, fontWeight: 600 }}>
            Request Logs
          </Typography>
        }
      >
        <Text type="secondary">No request logs found</Text>
      </Card>
    );
  }

  const handleApprove = async () => {
    try {
      await updateEditRequestApi(verificationId, {
        status: "Approved",
      });
      message.success("Response saved successfully");
      router.push(`/edit-requests`);
    } catch (err) {
      console.error(err);
      message.error("Failed to save response");
    }
  };

  const handleReject = async () => {
    try {
      await updateEditRequestApi(verificationId, {
        status: "Rejected",
      });
      message.success("Response saved successfully");
      router.push(`/edit-requests`);
    } catch (err) {
      console.error(err);
      message.error("Failed to save response");
    }
  };

  const handleRequest = async () => {
    try {
      await postEditRequestApi({
        loanId: parseInt(loanId),
        verificationId: verificationId,
        changes: changedData,
      });

      // After successful API call, delete the entry from IndexedDB
      const request = indexedDB.open("editLogs", 1);

      request.onerror = (event: any) => {
        console.error("Database error:", request.error);
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;

        try {
          const transaction = db.transaction("logs", "readwrite");
          const store = transaction.objectStore("logs");

          // Delete the entry using the composite key
          const deleteRequest = store.delete(`${loanId}_${activeTab}`);

          deleteRequest.onsuccess = () => {
            message.success("Request sent successfully");
            // Optionally trigger a refresh of the parent component if needed
          };

          deleteRequest.onerror = () => {
            console.error(
              "Error deleting from IndexedDB:",
              deleteRequest.error
            );
          };

          transaction.oncomplete = () => {
            db.close();
          };
        } catch (error) {
          console.error("Transaction error:", error);
          db.close();
        }
      };
      fetchEditRequests();
    } catch (err) {
      console.error(err);
      message.error("Failed to send request");
    }
  };

  const descriptions = admin
    ? getDescriptions(verificationType)
    : getDescriptions(activeTab);

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          {userDetails?.role === "Admin" && (
            <LeftOutlined
              style={{ cursor: "pointer", marginRight: 8 }}
              onClick={() => window.history.back()}
            />
          )}
          <Typography style={{ fontSize: 16, fontWeight: 600 }}>
            Request Logs
          </Typography>
        </div>
      }
      extra={
        <>
          {userDetails?.role !== "Admin" && (
            <Button
              type="primary"
              onClick={handleRequest}
              style={{
                marginLeft: "auto",
                backgroundColor: disabled ? "#f5f5f5" : undefined,
                borderColor: disabled ? "#d9d9d9" : undefined,
                color: disabled ? "rgba(248, 248, 248, 0.75)" : undefined,
              }}
              disabled={disabled}
            >
              Request Approval
            </Button>
          )}
          {userDetails?.role === "Admin" && (
            <Space>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleReject}
              >
                Reject
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApprove}
              >
                Approve
              </Button>
            </Space>
          )}
        </>
      }
    >
      {disabled && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            background: "#fffbe6",
            border: "1px solid #ffe58f",
            borderRadius: "4px",
            color: "#d48806",
          }}
        >
          Awaiting approval from admin
        </div>
      )}
      {Object.keys(changedData)
        .filter((sectionKey) => getLabels[sectionKey as keyof typeof getLabels])
        .map((sectionKey) => {
          const SectionDescription =
            descriptions[sectionKey as keyof typeof descriptions];
          const currentSection = currentData?.[sectionKey];
          const editSection = changedData?.[sectionKey];
          if (!SectionDescription) return null;

          const changedKeys = getChangedKeys(currentSection, editSection);
          if (changedKeys.length === 0) return null; // Don't show sections with no changes

          return (
            <Row gutter={24} key={sectionKey} style={{ marginBottom: 32 }}>
              <Col span={12}>
                <SectionDescription
                  data={{ [sectionKey]: currentSection }}
                  extra={null}
                  logs={true}
                  changedFields={changedKeys}
                  isCurrentVersion={true}
                />
              </Col>
              <Col span={12}>
                <SectionDescription
                  data={{ [sectionKey]: editSection }}
                  extra={
                    false && (
                      <Space>
                        <Button
                          danger
                          icon={<CloseCircleOutlined />}
                          onClick={handleApprove}
                        >
                          Reject
                        </Button>
                        <Button
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          onClick={handleApprove}
                        >
                          Approve
                        </Button>
                      </Space>
                    )
                  }
                  logs={true}
                  changedFields={changedKeys}
                  isCurrentVersion={false}
                />
                {/* {changedKeys.length > 0 && (
                  <div style={{ color: "#52c41a", fontSize: 12, marginTop: 4 }}>
                    Changed fields: {changedKeys.join(", ")}
                  </div>
                )} */}
              </Col>
            </Row>
          );
        })}
    </Card>
  );
};

export default EditRequestLogs;
