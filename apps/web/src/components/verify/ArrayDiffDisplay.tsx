import React, { useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Collapse,
  Typography,
  Row,
  Col,
  Tooltip,
  Space,
  Alert,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  EditOutlined,
  SwapOutlined,
  InfoCircleOutlined,
  ExpandAltOutlined,
  CompressOutlined,
} from "@ant-design/icons";
import { findArrayChanges, ArrayItemWithId } from "@/utils/arrayUtils";

const { Text, Title } = Typography;
const { Panel } = Collapse;

interface ArrayDiffDisplayProps {
  fieldName: string;
  fieldLabel: string;
  currentArray: ArrayItemWithId[];
  changedArray: ArrayItemWithId[];
  arraySchema?: any; // Schema for the array items
  showSideBySide?: boolean;
  onToggleView?: () => void;
}

interface ChangeStats {
  added: number;
  removed: number;
  modified: number;
  total: number;
}

export const ArrayDiffDisplay: React.FC<ArrayDiffDisplayProps> = ({
  fieldName,
  fieldLabel,
  currentArray = [],
  changedArray = [],
  arraySchema,
  showSideBySide = false,
  onToggleView,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState(false);

  // Analyze changes
  const changes = findArrayChanges(currentArray, changedArray);

  const stats: ChangeStats = {
    added: changes.added.length,
    removed: changes.removed.length,
    modified: changes.modified.length,
    total: currentArray.length,
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const renderChangeIcon = (changeType: "added" | "removed" | "modified") => {
    const iconProps = {
      added: { icon: <PlusOutlined />, color: "#52c41a" },
      removed: { icon: <MinusOutlined />, color: "#ff4d4f" },
      modified: { icon: <EditOutlined />, color: "#faad14" },
    };

    const { icon, color } = iconProps[changeType];
    return <span style={{ color, fontSize: "16px" }}>{icon}</span>;
  };

  const renderChangeTag = (changeType: "added" | "removed" | "modified") => {
    const tagProps = {
      added: { color: "success", text: "Added" },
      removed: { color: "error", text: "Removed" },
      modified: { color: "warning", text: "Modified" },
    };

    const { color, text } = tagProps[changeType];
    return <Tag color={color}>{text}</Tag>;
  };

  const renderFieldValue = (
    value: any,
    fieldKey: string,
    isOld: boolean = false
  ) => {
    if (value === null || value === undefined) {
      return <Text type="secondary">-</Text>;
    }

    if (typeof value === "boolean") {
      return <Text>{value ? "Yes" : "No"}</Text>;
    }

    if (typeof value === "string" && value.trim() === "") {
      return (
        <Text type="secondary" italic>
          (empty)
        </Text>
      );
    }

    const displayValue = String(value);
    const maxLength = 50;

    if (displayValue.length > maxLength) {
      return (
        <Tooltip title={displayValue}>
          <Text style={{ color: isOld ? "#ff7875" : undefined }}>
            {displayValue.substring(0, maxLength)}...
          </Text>
        </Tooltip>
      );
    }

    return (
      <Text style={{ color: isOld ? "#ff7875" : undefined }}>
        {displayValue}
      </Text>
    );
  };

  const renderUnifiedDiffTable = () => {
    // Combine all items with their change status
    const allItems: Array<{
      item: ArrayItemWithId;
      changeType: "added" | "removed" | "modified" | "unchanged";
      modifiedFields?: string[];
      oldItem?: ArrayItemWithId;
    }> = [];

    // Add removed items
    changes.removed.forEach((item) => {
      allItems.push({ item, changeType: "removed" });
    });

    // Add current items (unchanged or modified)
    const changedMap = new Map(changedArray.map((item) => [item._id, item]));
    const modifiedMap = new Map(
      changes.modified.map((change) => [change.id, change])
    );

    currentArray.forEach((item) => {
      if (item._id && changedMap.has(item._id)) {
        const newItem = changedMap.get(item._id)!;
        const modification = modifiedMap.get(item._id) || null;

        if (modification) {
          allItems.push({
            item: newItem,
            changeType: "modified",
            modifiedFields: modification.changedFields,
            oldItem: item,
          });
        } else {
          allItems.push({ item: newItem, changeType: "unchanged" });
        }
      }
    });

    // Add new items
    changes.added.forEach((item) => {
      allItems.push({ item, changeType: "added" });
    });

    // Get field names from schema or first item
    const fieldNames = arraySchema?.items?.properties
      ? Object.keys(arraySchema.items.properties).filter((key) => key !== "_id")
      : allItems.length > 0
        ? Object.keys(allItems[0].item).filter((key) => key !== "_id")
        : [];

    const columns = [
      {
        title: "",
        dataIndex: "changeType",
        key: "changeType",
        width: 60,
        render: (_: any, record: any) => {
          if (record.changeType === "unchanged") return null;
          return renderChangeIcon(record.changeType);
        },
      },
      {
        title: "Status",
        dataIndex: "changeType",
        key: "status",
        width: 100,
        render: (_: any, record: any) => {
          if (record.changeType === "unchanged") return null;
          return renderChangeTag(record.changeType);
        },
      },
      ...fieldNames.map((fieldName) => ({
        title: arraySchema?.items?.properties?.[fieldName]?.title || fieldName,
        dataIndex: fieldName,
        key: fieldName,
        render: (_: any, record: any) => {
          const { item, changeType, modifiedFields, oldItem } = record;
          const isModified = modifiedFields?.includes(fieldName);

          if (changeType === "modified" && isModified && oldItem) {
            // Show both old and new values
            return (
              <div>
                <div
                  style={{ textDecoration: "line-through", color: "#ff7875" }}
                >
                  {renderFieldValue(oldItem[fieldName], fieldName, true)}
                </div>
                <div style={{ color: "#52c41a", fontWeight: 500 }}>
                  {renderFieldValue(item[fieldName], fieldName)}
                </div>
              </div>
            );
          }

          return renderFieldValue(item[fieldName], fieldName);
        },
      })),
      {
        title: "Actions",
        key: "actions",
        width: 100,
        render: (_: any, record: any) => {
          if (
            record.changeType === "unchanged" ||
            !record.modifiedFields?.length
          )
            return null;

          const isExpanded = expandedRows.has(record.item._id);
          return (
            <Button
              type="text"
              size="small"
              icon={isExpanded ? <CompressOutlined /> : <ExpandAltOutlined />}
              onClick={() => toggleRowExpansion(record.item._id)}
              title={isExpanded ? "Hide details" : "Show details"}
            />
          );
        },
      },
    ];

    return (
      <Table
        dataSource={allItems}
        columns={columns}
        rowKey={(record) => record.item._id || Math.random().toString()}
        pagination={false}
        size="small"
        bordered
        className="array-diff-table"
        rowClassName={(record) => {
          const baseClass = "array-diff-row";
          const typeClass = `array-diff-row-${record.changeType}`;
          return `${baseClass} ${typeClass}`;
        }}
        expandable={{
          expandedRowKeys: Array.from(expandedRows),
          onExpand: (expanded, record) =>
            record.item._id && toggleRowExpansion(record.item._id),
          expandedRowRender: (record) => {
            if (
              record.changeType !== "modified" ||
              !record.modifiedFields?.length
            ) {
              return null;
            }

            return (
              <div style={{ padding: "8px 16px", backgroundColor: "#fafafa" }}>
                <Text strong>Modified fields:</Text>
                <ul style={{ marginBottom: 0, marginTop: 8 }}>
                  {record.modifiedFields.map((fieldName) => (
                    <li key={fieldName} style={{ marginBottom: 4 }}>
                      <Text code>{fieldName}</Text>:
                      <span
                        style={{
                          marginLeft: 8,
                          textDecoration: "line-through",
                          color: "#ff7875",
                        }}
                      >
                        {JSON.stringify(record.oldItem?.[fieldName])}
                      </span>
                      <SwapOutlined
                        style={{ margin: "0 8px", color: "#1890ff" }}
                      />
                      <span style={{ color: "#52c41a", fontWeight: 500 }}>
                        {JSON.stringify(record.item[fieldName])}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          },
          rowExpandable: (record) =>
            record.changeType === "modified" &&
            (record.modifiedFields?.length || 0) > 0,
        }}
      />
    );
  };

  const renderSideBySideView = () => {
    return (
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="Current Version" bordered>
            <Table
              dataSource={currentArray}
              columns={Object.keys(currentArray[0] || {})
                .filter((key) => key !== "_id")
                .map((key) => ({
                  title: key,
                  dataIndex: key,
                  key,
                  render: (value: any) => renderFieldValue(value, key),
                }))}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="Modified Version" bordered>
            <Table
              dataSource={changedArray}
              columns={Object.keys(changedArray[0] || {})
                .filter((key) => key !== "_id")
                .map((key) => ({
                  title: key,
                  dataIndex: key,
                  key,
                  render: (value: any) => renderFieldValue(value, key),
                }))}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    );
  };

  const renderChangeSummary = () => {
    if (!changes.hasChanges) {
      return (
        <Alert
          message="No changes detected"
          type="info"
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: 16 }}
        />
      );
    }

    return (
      <Alert
        message={
          <Space>
            <Text strong>Changes Summary:</Text>
            {stats.added > 0 && <Tag color="success">{stats.added} Added</Tag>}
            {stats.removed > 0 && (
              <Tag color="error">{stats.removed} Removed</Tag>
            )}
            {stats.modified > 0 && (
              <Tag color="warning">{stats.modified} Modified</Tag>
            )}
          </Space>
        }
        type="warning"
        style={{ marginBottom: 16 }}
        action={
          <Space>
            {onToggleView && (
              <Button
                size="small"
                type="text"
                onClick={onToggleView}
                icon={showSideBySide ? <SwapOutlined /> : <SwapOutlined />}
              >
                {showSideBySide ? "Unified View" : "Side by Side"}
              </Button>
            )}
            <Button
              size="small"
              type="text"
              onClick={() => setShowDetails(!showDetails)}
              icon={<InfoCircleOutlined />}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </Space>
        }
      />
    );
  };

  return (
    <Card
      title={
        <Space>
          <Title level={5} style={{ margin: 0 }}>
            {fieldLabel}
          </Title>
          <Text type="secondary">
            ({currentArray.length} → {changedArray.length} items)
          </Text>
        </Space>
      }
      size="small"
      style={{ marginBottom: 16 }}
    >
      {renderChangeSummary()}

      {changes.hasChanges && (
        <div>
          {showSideBySide ? renderSideBySideView() : renderUnifiedDiffTable()}
        </div>
      )}

      {!changes.hasChanges && (
        <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
          <InfoCircleOutlined
            style={{ fontSize: "24px", marginBottom: "8px" }}
          />
          <div>No changes to display</div>
        </div>
      )}

      {showDetails && changes.hasChanges && (
        <Collapse
          size="small"
          style={{ marginTop: 16 }}
          items={[
            {
              key: "details",
              label: "Detailed Changes",
              children: (
                <div>
                  {changes.added.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <Text strong style={{ color: "#52c41a" }}>
                        Added Items ({changes.added.length})
                      </Text>
                      <pre
                        style={{
                          background: "#f6ffed",
                          padding: 8,
                          fontSize: 12,
                        }}
                      >
                        {JSON.stringify(changes.added, null, 2)}
                      </pre>
                    </div>
                  )}

                  {changes.removed.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <Text strong style={{ color: "#ff4d4f" }}>
                        Removed Items ({changes.removed.length})
                      </Text>
                      <pre
                        style={{
                          background: "#fff1f0",
                          padding: 8,
                          fontSize: 12,
                        }}
                      >
                        {JSON.stringify(changes.removed, null, 2)}
                      </pre>
                    </div>
                  )}

                  {changes.modified.length > 0 && (
                    <div>
                      <Text strong style={{ color: "#faad14" }}>
                        Modified Items ({changes.modified.length})
                      </Text>
                      {changes.modified.map((change, index) => (
                        <div key={change.id} style={{ marginTop: 8 }}>
                          <Text code>
                            Item {index + 1} (ID: {change.id})
                          </Text>
                          <Row gutter={16} style={{ marginTop: 4 }}>
                            <Col span={12}>
                              <Text type="secondary">Before:</Text>
                              <pre
                                style={{
                                  background: "#fff1f0",
                                  padding: 4,
                                  fontSize: 11,
                                }}
                              >
                                {JSON.stringify(change.oldItem, null, 2)}
                              </pre>
                            </Col>
                            <Col span={12}>
                              <Text type="secondary">After:</Text>
                              <pre
                                style={{
                                  background: "#f6ffed",
                                  padding: 4,
                                  fontSize: 11,
                                }}
                              >
                                {JSON.stringify(change.newItem, null, 2)}
                              </pre>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      <style jsx>{`
        .array-diff-table .array-diff-row-added {
          background-color: #f6ffed;
        }
        .array-diff-table .array-diff-row-removed {
          background-color: #fff1f0;
        }
        .array-diff-table .array-diff-row-modified {
          background-color: #fffbe6;
        }
        .array-diff-table .array-diff-row-unchanged {
          background-color: #fafafa;
        }
      `}</style>
    </Card>
  );
};
