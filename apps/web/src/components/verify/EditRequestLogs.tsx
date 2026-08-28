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
import ApplicantDetailsDescription from "./Descriptions/ApplicantDetailsDescription";
import { useRouter } from "@/utils/router";
import { useTabContext } from "@/pages/verify/[id]";
import {
  getUserDetails,
  isEmpty,
  getCurrentDepartmentRole,
} from "@/utils/utility";
import ColleagueReferencesDescription from "./Descriptions/ColleagueReferencesDescription";
import PastEmploymentsDescription from "./Descriptions/PastEmploymentsDescription";
import ExistingLoansDescription from "./Descriptions/ExistingLoansDescription";
import FamilyMemberDetailsDescription from "./Descriptions/FamilyMemberDetailsDescription";
import DynamicSectionDescription from "./Descriptions/DynamicSectionDescription";
import { ArrayDiffDisplay } from "./ArrayDiffDisplay";

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
  colleagueReferences: "Colleague References",
  pastEmployment: "Past Employments",
  existingLoans: "Existing Loans",
  businessDetails: "Business Details",
  miscellaneous: "Business Miscellaneous Details",
  familyMemberDetails: "Family Member Details",
  applicantDetails: "Applicant Details",
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
  colleagueReferences: ColleagueReferencesDescription,
  pastEmployment: PastEmploymentsDescription,
  existingLoans: ExistingLoansDescription,
  businessDetails: BusinessDetailsDescription,
  miscellaneous: BusinessMiscellaneousDescription,
  familyMemberDetails: FamilyMemberDetailsDescription,
  applicantDetails: ApplicantDetailsDescription,
});

interface EditRequestLogsProps {
  currentData: any;
  changedData: any;
  verificationId: string;
  fetchEditRequests: () => void;
  disabled: boolean;
  verificationType: string;
  admin: boolean;
  currentDepartment?: string;
  dynamicSchema?: any; // Schema for dynamic forms (RBL, etc.)
}

const getChangedKeys = (currentSection: any, editSection: any) => {
  if (!currentSection || !editSection) return [];

  return Object.keys({ ...currentSection, ...editSection }).filter((key) => {
    if (!currentSection[key] && !editSection[key]) return false;

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

const mergeDataWithChanges = (currentData: any, changedData: any) => {
  if (!currentData || !changedData) return currentData;

  const mergedData = { ...currentData };

  Object.keys(changedData).forEach((sectionKey) => {
    if (
      changedData[sectionKey] &&
      typeof changedData[sectionKey] === "object"
    ) {
      mergedData[sectionKey] = {
        ...mergedData[sectionKey],
        ...changedData[sectionKey],
      };
    }
  });

  return mergedData;
};

const EditRequestLogs: React.FC<EditRequestLogsProps> = (_props) => {
  const router: any = useRouter();
  // console.log(router);
  const pathname: any = router?.pathname;
  const { dynamicSchema } = _props;
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
    currentDepartment,
  } = _props;

  if (isEmpty(changedData) && !disabled) {
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
    ? getDescriptions(verificationType || "Business")
    : getDescriptions(activeTab);

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          {getCurrentDepartmentRole() === "Admin" && (
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
          {pathname?.startsWith("/verify") && !isEmpty(changedData) && (
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
          {getCurrentDepartmentRole() === "Admin" &&
            pathname.startsWith("/edit-requests") && (
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
      {Object.keys(changedData).map((sectionKey) => {
        const SectionDescription =
          descriptions[sectionKey as keyof typeof descriptions];
        const currentSection = currentData?.[sectionKey];
        const editSection = changedData?.[sectionKey];
        const mergedEditSection =
          editSection && currentSection
            ? { ...currentSection, ...editSection }
            : editSection || currentSection || {};

        const changedKeys = getChangedKeys(currentSection, editSection);
        if (changedKeys.length === 0) return null; // Don't show sections with no changes

        // Prefer dynamic rendering when a dynamic schema is provided and contains this section
        const dynamicSectionSchema = dynamicSchema?.sections?.find(
          (s: any) => s.id === sectionKey
        );
        if (dynamicSectionSchema) {
          const sectionLabel =
            dynamicSectionSchema?.title ||
            dynamicSectionSchema?.label ||
            sectionKey
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .trim();

          // Check if this section contains array fields that need special diff display
          const arrayFields =
            dynamicSectionSchema.fields?.filter(
              (field: any) => field.type === "array"
            ) || [];
          const hasArrayFields = arrayFields.length > 0;

          // If there are array fields, render them with ArrayDiffDisplay
          if (hasArrayFields) {
            return (
              <div key={sectionKey} style={{ marginBottom: 32 }}>
                {arrayFields.map((arrayField: any) => {
                  const currentArray = currentSection?.[arrayField.id] || [];
                  const changedArray =
                    mergedEditSection?.[arrayField.id] || editSection?.[arrayField.id] || [];

                  // Only show if there are actual changes in this array
                  if (
                    JSON.stringify(currentArray) ===
                    JSON.stringify(changedArray)
                  ) {
                    return null;
                  }

                  return (
                    <ArrayDiffDisplay
                      key={`${sectionKey}-${arrayField.id}`}
                      fieldName={arrayField.id}
                      fieldLabel={
                        arrayField.label || arrayField.title || arrayField.id
                      }
                      currentArray={currentArray}
                      changedArray={changedArray}
                      arraySchema={arrayField}
                      showSideBySide={false}
                    />
                  );
                })}

                {/* Show non-array fields in traditional side-by-side view */}
                {dynamicSectionSchema.fields?.some(
                  (field: any) => field.type !== "array"
                ) && (
                  <Row gutter={24} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                      <Card
                        size="small"
                        title={
                          <>
                            <Text strong>{sectionLabel}</Text>{" "}
                            <Text type="secondary">(Current)</Text>
                          </>
                        }
                      >
                        <DynamicSectionDescription
                          data={currentSection}
                          sectionLabel={sectionLabel}
                          sectionSchema={{
                            ...dynamicSectionSchema,
                            fields:
                              dynamicSectionSchema.fields?.filter(
                                (field: any) => field.type !== "array"
                              ) || [],
                          }}
                          logs={false}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card
                        size="small"
                        title={
                          <>
                            <Text strong>{sectionLabel}</Text>{" "}
                            <Text type="success">(New)</Text>
                          </>
                        }
                      >
                        <DynamicSectionDescription
                          data={mergedEditSection}
                          changedData={mergedEditSection}
                          sectionLabel={sectionLabel}
                          sectionSchema={{
                            ...dynamicSectionSchema,
                            fields:
                              dynamicSectionSchema.fields?.filter(
                                (field: any) => field.type !== "array"
                              ) || [],
                          }}
                          logs={true}
                          changedFields={changedKeys}
                        />
                      </Card>
                    </Col>
                  </Row>
                )}
              </div>
            );
          }

          // Default side-by-side view for sections without arrays
          return (
            <Row gutter={24} key={sectionKey} style={{ marginBottom: 32 }}>
              <Col span={12}>
                <Card
                  title={
                    <>
                      <Text strong>{sectionLabel}</Text>{" "}
                      <Text type="secondary">(Current)</Text>
                    </>
                  }
                >
                  <DynamicSectionDescription
                    data={currentSection}
                    sectionLabel={sectionLabel}
                    sectionSchema={dynamicSectionSchema}
                    logs={false}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={
                    <>
                      <Text strong>{sectionLabel}</Text>{" "}
                      <Text type="success">(New)</Text>
                    </>
                  }
                >
                  <DynamicSectionDescription
                    data={mergedEditSection}
                    changedData={mergedEditSection}
                    sectionLabel={sectionLabel}
                    sectionSchema={dynamicSectionSchema}
                    logs={true}
                    changedFields={changedKeys}
                  />
                </Card>
              </Col>
            </Row>
          );
        }

        // Skip if no description component and no label
        if (!SectionDescription) return null;

        if (sectionKey === "existingLoans") {
          return (
            <Row gutter={24} key={sectionKey} style={{ marginBottom: 32 }}>
              <Col span={12}>
                <SectionDescription
                  data={{ loans: currentSection }}
                  extra={null}
                  logs={true}
                  changedFields={changedKeys}
                  changedData={{ loans: editSection }}
                />
              </Col>
              <Col span={12}>
                <SectionDescription
                  data={{ loans: editSection }}
                  extra={null}
                  logs={true}
                  changedFields={changedKeys}
                  changedData={{ loans: currentSection }}
                />
              </Col>
            </Row>
          );
        }

        return (
          <Row gutter={24} key={sectionKey} style={{ marginBottom: 32 }}>
            <Col span={12}>
              <SectionDescription
                data={{ [sectionKey]: currentSection }}
                extra={null}
                logs={true}
                changedFields={changedKeys}
                isCurrentVersion={true}
                currentDepartment={currentDepartment}
              />
            </Col>
            <Col span={12}>
              <SectionDescription
                data={{ [sectionKey]: editSection }}
                extra={
                  null
                  // false && (
                  //   <Space>
                  //     <Button
                  //       danger
                  //       icon={<CloseCircleOutlined />}
                  //       onClick={handleApprove}
                  //     >
                  //       Reject
                  //     </Button>
                  //     <Button
                  //       type="primary"
                  //       icon={<CheckCircleOutlined />}
                  //       onClick={handleApprove}
                  //     >
                  //       Approve
                  //     </Button>
                  //   </Space>
                  // )
                }
                logs={true}
                changedFields={changedKeys}
                isCurrentVersion={false}
                currentDepartment={currentDepartment}
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
