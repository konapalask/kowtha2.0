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

      {(() => {
        const financialAnalysisFieldNames = [
          "grossReceipts", "otherIncome", "incomeSubtotal",
          "costOfMaterialConsumed", "wages", "hamaliCharges", 
          "manufacturingExpenses", "packingCharges", "expenditureSubtotal",
          "grossProfitAsPerAssumption", "grossProfitRatio", "gpRatio",
          "financeExpenses", "depreciation", "incomeTax",
          "netProfitBeforeInterestTaxDepreciation", "netProfitBeforeTaxDepreciation",
          "netProfitBeforeTax", "netProfitAfterTax",
          "pbditMargin", "netProfitMargin", "totalExpensesInclCostOfSales"
        ];

        const rootLevelFinancialFields = Object.keys(changedData).filter(key => 
          financialAnalysisFieldNames.includes(key) ||
          (key.toLowerCase().includes("gross") && !key.toLowerCase().includes("details")) ||
          (key.toLowerCase().includes("profit") && !key.toLowerCase().includes("details")) ||
          (key.toLowerCase().includes("income") && key !== "otherIncome" && !key.toLowerCase().includes("details")) ||
          key.toLowerCase().includes("expenditure") ||
          key.toLowerCase().includes("expense") ||
          key.toLowerCase().includes("pbdit") ||
          key.toLowerCase().includes("margin")
        );

        let processedChangedData = { ...changedData };
        let processedCurrentData = { ...currentData };
        
        if (rootLevelFinancialFields.length > 0 && !changedData.financialAnalysis) {
          const financialAnalysisData: any = {};
          const financialAnalysisCurrentData: any = {};
          
          rootLevelFinancialFields.forEach(key => {
            if (changedData[key] !== undefined) {
              financialAnalysisData[key] = changedData[key];
            }
            if (currentData?.[key] !== undefined) {
              financialAnalysisCurrentData[key] = currentData[key];
            }
          });

          if (Object.keys(financialAnalysisData).length > 0) {
            processedChangedData = {
              ...Object.fromEntries(
                Object.keys(changedData)
                  .filter(k => !rootLevelFinancialFields.includes(k))
                  .map(k => [k, changedData[k]])
              ),
              financialAnalysis: financialAnalysisData
            };
            
            if (Object.keys(financialAnalysisCurrentData).length > 0) {
              processedCurrentData = {
                ...currentData,
                financialAnalysis: {
                  ...(currentData?.financialAnalysis || {}),
                  ...financialAnalysisCurrentData
                }
              };
            }
          }
        }

        return Object.keys(processedChangedData).map((sectionKey) => {
          const currentSection = processedCurrentData?.[sectionKey];
          const editSection = processedChangedData?.[sectionKey];
          const mergedEditSection =
            editSection && currentSection
              ? { ...currentSection, ...editSection }
              : editSection || currentSection || {};

          const changedKeys = getChangedKeys(currentSection, editSection);
          if (changedKeys.length === 0) return null;

          let dynamicSectionSchema = dynamicSchema?.sections?.find(
            (s: any) => s.id === sectionKey
          );

          if (!dynamicSectionSchema && dynamicSchema !== null) {
            const isFinancialAnalysis = 
              sectionKey === "financialAnalysis" ||
              sectionKey === "financialAnalysisComprehensive" ||
              sectionKey === "financialAnalysisDetailed" ||
              sectionKey.toLowerCase().includes("financial");
            
            if (isFinancialAnalysis) {
              dynamicSectionSchema = dynamicSchema?.sections?.find(
                (s: any) => 
                  s.id === "financialAnalysis" ||
                  s.id === "financialAnalysisComprehensive" ||
                  s.id === "financialAnalysisDetailed" ||
                  s.label?.toLowerCase().includes("financial") ||
                  s.label?.toLowerCase().includes("gp/pbdit") ||
                  s.label?.toLowerCase().includes("gppbdit")
              );

              if (!dynamicSectionSchema) {
                const allFieldKeys = new Set([
                  ...Object.keys(currentSection || {}),
                  ...Object.keys(editSection || {})
                ]);
                
                const basicFields = Array.from(allFieldKeys).map((key) => ({
                  id: key,
                  label: key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim(),
                  type: "string"
                }));

                dynamicSectionSchema = {
                  id: sectionKey,
                  label: "GP/PBDIT Financial Analysis",
                  fields: basicFields
                };
              }
            } else {

              const isFinancialField = financialAnalysisFieldNames.includes(sectionKey) ||
                sectionKey.toLowerCase().includes("gross") ||
                sectionKey.toLowerCase().includes("profit") ||
                sectionKey.toLowerCase().includes("income") ||
                sectionKey.toLowerCase().includes("expenditure") ||
                sectionKey.toLowerCase().includes("expense");
              
              if (isFinancialField) {
                return null;
              }
              
              const matchingSchema = dynamicSchema?.sections?.find((s: any) => {
                const fieldIds = (s.fields || []).map((f: any) => f.id);
                return fieldIds.includes(sectionKey);
              });
              
              if (matchingSchema) {
                dynamicSectionSchema = matchingSchema;
              } else {
                return null;
              }
            }
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

            {hasArrayFields && (
              <div style={{ marginBottom: 24 }}>
                {arrayFields.map((arrayField: any) => {
                  const currentArray = currentSection?.[arrayField.id] || [];
                  const changedArray =
                    mergedEditSection?.[arrayField.id] || editSection?.[arrayField.id] || [];

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
            </div>

            <Divider />
          </div>
        );
        });
      })()}
    </Card>
  );
};

export default PDRequestLogs;
