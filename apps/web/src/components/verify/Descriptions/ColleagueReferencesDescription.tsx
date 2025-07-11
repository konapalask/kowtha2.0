import { Card, Table } from "antd";
import React from "react";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: any, record: any) => record.renderedName,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (text: any, record: any) => record.renderedAddress,
  },
  {
    title: "Designation",
    dataIndex: "designation",
    key: "designation",
    render: (text: any, record: any) => record.renderedDesignation,
  },
  {
    title: "Years Known",
    dataIndex: "yearsKnown",
    key: "yearsKnown",
    render: (text: any, record: any) => record.renderedYearsKnown,
  },
  {
    title: "Contact Number",
    dataIndex: "contactNumber",
    key: "contactNumber",
    render: (text: any, record: any) => record.renderedContactNumber,
  },
  {
    title: "Email Address",
    dataIndex: "emailAddress",
    key: "emailAddress",
    render: (text: any, record: any) => record.renderedEmailAddress,
  },
];

const ColleagueReferencesDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
  changedFields?: string[];
  changedData?: any;
}> = ({ data, extra, logs = false, changedFields = [], changedData = {} }) => {
  const references = data?.colleagueReferences?.references || [];
  const prevReferences = changedData?.colleagueReferences?.references || [];
  // console.log(references);

  function renderCell(field: string, idx: number, value: any) {
    if (
      prevReferences[idx] &&
      prevReferences[idx][field] !== undefined &&
      prevReferences[idx][field] !== value
    ) {
      return (
        <span>
          {/* <span style={{ textDecoration: "line-through", color: "#888" }}>
            {prevReferences[idx][field]}
          </span> */}
          <span style={{ marginLeft: 8, color: "#d4380d", fontWeight: 600 }}>
            {value}
          </span>
        </span>
      );
    }
    return value;
  }

  function isRowChanged(idx: number, ref: any) {
    if (!prevReferences[idx]) return false;
    return [
      "name",
      "address",
      "designation",
      "yearsKnown",
      "contactNumber",
      "emailAddress",
    ].some(
      (field) =>
        prevReferences[idx][field] !== undefined &&
        prevReferences[idx][field] !== ref[field]
    );
  }

  const tableData = references.map((ref: any, idx: number) => ({
    key: idx,
    renderedName: renderCell("name", idx, ref.name),
    renderedAddress: renderCell("address", idx, ref.address),
    renderedDesignation: renderCell("designation", idx, ref.designation),
    renderedYearsKnown: renderCell("yearsKnown", idx, ref.yearsKnown),
    renderedContactNumber: renderCell("contactNumber", idx, ref.contactNumber),
    renderedEmailAddress: renderCell("emailAddress", idx, ref.emailAddress),
    isChanged: isRowChanged(idx, ref),
    ...ref,
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
            <span>Colleague References</span>
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

export default ColleagueReferencesDescription;
