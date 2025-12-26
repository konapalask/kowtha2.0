import React from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  message,
  Space,
  Divider,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import {
  postEditRequestApi,
  updateEditRequestApi,
} from "@/services/verifier.services";
import { useRouter } from "next/router";
import { useTabContext } from "@/pages/verify/[id]";
import {
  getUserDetails,
  isEmpty,
  getCurrentDepartmentRole,
} from "@/utils/utility";
import DynamicSectionDescription from "./Descriptions/DynamicSectionDescription";
import { ArrayDiffDisplay } from "./ArrayDiffDisplay";

const { Text, Title } = Typography;

interface PDRequestLogsProps {
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

const PDRequestLogs: React.FC<PDRequestLogsProps> = (_props) => {
  const router: any = useRouter();
  const pathname: any = router?.pathname;
  const { dynamicSchema } = _props;
  const loanId = router?.query?.id || null;
  const { activeTab } = useTabContext();
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
            PD Request Logs
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
            PD Request Logs
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

      {/* PD-specific diff display */}
      {Object.keys(changedData).map((sectionKey) => {
        const currentSection = currentData?.[sectionKey];
        const editSection = changedData?.[sectionKey];
        const mergedEditSection =
          editSection && currentSection
            ? { ...currentSection, ...editSection }
            : editSection || currentSection || {};

        const changedKeys = getChangedKeys(currentSection, editSection);
        if (changedKeys.length === 0) return null; // Don't show sections with no changes

        // Get dynamic section schema
        const dynamicSectionSchema = dynamicSchema?.sections?.find(
          (s: any) => s.id === sectionKey
        );

        if (!dynamicSectionSchema && dynamicSchema !== null) {
          const isFinancialAnalysis = 
            sectionKey === "financialAnalysis" ||
            sectionKey === "financialAnalysisComprehensive" ||
            sectionKey === "financialAnalysisDetailed" ||
            sectionKey.toLowerCase().includes("financial");
          
          if (isFinancialAnalysis) {
            return (
              <Card key={sectionKey} style={{ marginBottom: 32 }}>
                <Text type="warning">
                  Financial Analysis section found but schema not loaded. 
                  Please ensure the bank schema is properly configured.
                </Text>
                <Row gutter={24} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    <Card size="small" title="Current Values">
                      <pre style={{ fontSize: 12, maxHeight: 400, overflow: "auto" }}>
                        {JSON.stringify(currentSection || {}, null, 2)}
                      </pre>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="New Values">
                      <pre style={{ fontSize: 12, maxHeight: 400, overflow: "auto" }}>
                        {JSON.stringify(editSection || {}, null, 2)}
                      </pre>
                    </Card>
                  </Col>
                </Row>
              </Card>
            );
          }
          
          return null;
        }
        if (!dynamicSectionSchema && dynamicSchema === null) {
          return null;
        }

        const sectionLabel =
          dynamicSectionSchema?.title ||
          dynamicSectionSchema?.label ||
          sectionKey
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim();

        // Check if this section contains array fields
        const arrayFields =
          dynamicSectionSchema.fields?.filter(
            (field: any) => field.type === "array"
          ) || [];
        const hasArrayFields = arrayFields.length > 0;

        return (
          <div key={sectionKey} style={{ marginBottom: 32 }}>
            <Title level={4} style={{ marginBottom: 16, color: "#1890ff" }}>
              📋 {sectionLabel}
            </Title>

            {/* Render array fields with special diff display */}
            {hasArrayFields && (
              <div style={{ marginBottom: 24 }}>
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
                    <div
                      key={`${sectionKey}-${arrayField.id}`}
                      style={{ marginBottom: 16 }}
                    >
                      <Text strong style={{ fontSize: 16, color: "#52c41a" }}>
                        📊{" "}
                        {arrayField.label || arrayField.title || arrayField.id}
                      </Text>
                      <ArrayDiffDisplay
                        fieldName={arrayField.id}
                        fieldLabel={
                          arrayField.label || arrayField.title || arrayField.id
                        }
                        currentArray={currentArray}
                        changedArray={changedArray}
                        arraySchema={arrayField}
                        showSideBySide={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Render non-array fields in side-by-side view */}
            {dynamicSectionSchema.fields?.some(
              (field: any) => field.type !== "array"
            ) && (
              <Row gutter={24} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Card
                    size="small"
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Text strong style={{ color: "#8c8c8c" }}>
                          📄 Initial Values
                        </Text>
                      </div>
                    }
                    style={{
                      border: "1px solid #d9d9d9",
                      backgroundColor: "#fafafa",
                    }}
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
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Text strong style={{ color: "#52c41a" }}>
                          ✏️ Latest Changes
                        </Text>
                      </div>
                    }
                    style={{
                      border: "1px solid #52c41a",
                      backgroundColor: "#f6ffed",
                    }}
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

            {/* Summary of changes
            <div
              style={{
                padding: "12px 16px",
                background: "#e6f7ff",
                border: "1px solid #91d5ff",
                borderRadius: "6px",
                marginTop: 16,
              }}
            >
              <Text strong style={{ color: "#1890ff" }}>
                📝 Changes Summary:
              </Text>
              <div style={{ marginTop: 8 }}>
                {changedKeys.map((key, index) => {
                  const field = dynamicSectionSchema.fields?.find(
                    (f: any) => f.id === key
                  );
                  const fieldLabel = field?.label || field?.title || key;
                  return (
                    <span key={key}>
                      <Text code style={{ color: "#1890ff" }}>
                        {fieldLabel}
                      </Text>
                      {index < changedKeys.length - 1 && (
                        <Text style={{ margin: "0 8px", color: "#8c8c8c" }}>
                          •
                        </Text>
                      )}
                    </span>
                  );
                })}
              </div>
            </div> */}

            <Divider />
          </div>
        );
      })}
    </Card>
  );
};

export default PDRequestLogs;
