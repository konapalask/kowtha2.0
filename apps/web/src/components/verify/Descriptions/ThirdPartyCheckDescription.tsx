import { Card, Table } from "antd";
import React from "react";

const columns = [
  {
    title: "TPC Name",
    dataIndex: "tpcName",
    key: "tpcName",
    render: (text: any, record: any) => record.renderedTpcName,
  },
  {
    title: "Mobile Number",
    dataIndex: "mobileNumber",
    key: "mobileNumber",
    render: (text: any, record: any) => record.renderedMobileNumber,
  },
  {
    title: "Relationship",
    dataIndex: "relationship",
    key: "relationship",
    render: (text: any, record: any) => record.renderedRelationship,
  },
  {
    title: "Comments",
    dataIndex: "comments",
    key: "comments",
    render: (text: any, record: any) => record.renderedComments,
  },
];

const ThirdPartyCheckDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
  changedFields?: string[];
  changedData?: any;
}> = ({ data, extra, logs = false, changedFields = [], changedData = {} }) => {
  // Prepare the checks data for the table
  const checks = data?.thirdPartyCheck?.checks || [];
  // If changedData is provided, use it for comparison
  const prevChecks = changedData?.thirdPartyCheck?.checks || [];

  // Helper to render cell with strikethrough if changed
  function renderCell(field: string, idx: number, value: any) {
    if (
      prevChecks[idx] &&
      prevChecks[idx][field] !== undefined &&
      prevChecks[idx][field] !== value
    ) {
      return (
        <span>
          <span style={{ textDecoration: "line-through", color: "#888" }}>
            {prevChecks[idx][field]}
          </span>
          <span style={{ marginLeft: 8, color: "#d4380d", fontWeight: 600 }}>
            {value}
          </span>
        </span>
      );
    }
    return value;
  }

  // Helper to check if any field in the row is changed
  function isRowChanged(idx: number, check: any) {
    if (!prevChecks[idx]) return false;
    return ["tpcName", "mobileNumber", "relationship", "comments"].some(
      (field) =>
        prevChecks[idx][field] !== undefined &&
        prevChecks[idx][field] !== check[field]
    );
  }

  const tableData = checks.map((check: any, idx: number) => ({
    key: idx,
    renderedTpcName: renderCell("tpcName", idx, check.tpcName),
    renderedMobileNumber: renderCell("mobileNumber", idx, check.mobileNumber),
    renderedRelationship: renderCell("relationship", idx, check.relationship),
    renderedComments: renderCell("comments", idx, check.comments),
    isChanged: isRowChanged(idx, check),
    ...check,
  }));

  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <div
            style={{
              fontWeight: 600,
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Third Party Check</span>
            {extra || null}
          </div>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            rowClassName={(_record, idx) =>
              tableData[idx]?.isChanged ? "changed-row" : ""
            }
          />
        </Card>
      </section>
      <style jsx global>{`
        .changed-row td {
          background: #f6ffed !important;
        }
      `}</style>
    </div>
  );
};

export default ThirdPartyCheckDescription;
