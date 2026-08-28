import { Card, Table } from "antd";
import React from "react";

const columns = [
  {
    title: "Employer/Business Name",
    dataIndex: "employerName",
    key: "employerName",
    render: (text: any, record: any) => record.renderedEmployerName,
  },
  {
    title: "Designation",
    dataIndex: "designation",
    key: "designation",
    render: (text: any, record: any) => record.renderedDesignation,
  },
  {
    title: "From Date",
    dataIndex: "fromDate",
    key: "fromDate",
    render: (text: any, record: any) => record.renderedFromDate,
  },
  {
    title: "To Date",
    dataIndex: "toDate",
    key: "toDate",
    render: (text: any, record: any) => record.renderedToDate,
  },
  {
    title: "Contact Person Name",
    dataIndex: "contactPersonName",
    key: "contactPersonName",
    render: (text: any, record: any) => record.renderedContactPersonName,
  },
  {
    title: "Contact Person Mobile",
    dataIndex: "contactPersonNumber",
    key: "contactPersonNumber",
    render: (text: any, record: any) => record.renderedContactPersonNumber,
  },
  {
    title: "Reason for Movement",
    dataIndex: "reasonForMovement",
    key: "reasonForMovement",
    render: (text: any, record: any) => record.renderedReasonForMovement,
  },
];

const PastEmploymentsDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
  changedFields?: string[];
  changedData?: any;
}> = ({ data, extra, logs = false, changedFields = [], changedData = {} }) => {
  const employments = data?.pastEmployment?.employments || [];
  const prevEmployments = changedData?.pastEmployment?.employments || [];
  // console.log(employments);
  function renderCell(field: string, idx: number, value: any) {
    if (
      prevEmployments[idx] &&
      prevEmployments[idx][field] !== undefined &&
      prevEmployments[idx][field] !== value
    ) {
      return (
        <span>
          <span style={{ textDecoration: "line-through", color: "#888" }}>
            {prevEmployments[idx][field]}
          </span>
          <span style={{ marginLeft: 8, color: "#d4380d", fontWeight: 600 }}>
            {value}
          </span>
        </span>
      );
    }
    return value;
  }

  function isRowChanged(idx: number, emp: any) {
    if (!prevEmployments[idx]) return false;
    return [
      "employerName",
      "designation",
      "fromDate",
      "toDate",
      "contactPersonName",
      "contactPersonNumber",
      "reasonForMovement",
    ].some(
      (field) =>
        prevEmployments[idx][field] !== undefined &&
        prevEmployments[idx][field] !== emp[field]
    );
  }

  const tableData = employments.map((emp: any, idx: number) => ({
    key: idx,
    renderedEmployerName: renderCell("employerName", idx, emp.employerName),
    renderedDesignation: renderCell("designation", idx, emp.designation),
    renderedFromDate: renderCell("fromDate", idx, emp.fromDate),
    renderedToDate: renderCell("toDate", idx, emp.toDate),
    renderedContactPersonName: renderCell(
      "contactPersonName",
      idx,
      emp.contactPersonName
    ),
    renderedContactPersonNumber: renderCell(
      "contactPersonNumber",
      idx,
      emp.contactPersonNumber
    ),
    renderedReasonForMovement: renderCell(
      "reasonForMovement",
      idx,
      emp.reasonForMovement
    ),
    isChanged: isRowChanged(idx, emp),
    ...emp,
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
            <span>Past Employments</span>
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
      <style>{`
        .changed-row td {
          background: #f6ffed !important;
        }
      `}</style>
    </div>
  );
};

export default PastEmploymentsDescription;
