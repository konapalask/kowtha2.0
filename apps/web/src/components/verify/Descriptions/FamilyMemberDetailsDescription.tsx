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
    title: "Relation",
    dataIndex: "relation",
    key: "relation",
    render: (text: any, record: any) => record.renderedRelation,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    render: (text: any, record: any) => record.renderedAge,
  },
  {
    title: "Employment Type",
    dataIndex: "employmentType",
    key: "employmentType",
    render: (text: any, record: any) => record.renderedEmploymentType,
  },
  {
    title: "Educational Qualification",
    dataIndex: "educationalQualification",
    key: "educationalQualification",
    render: (text: any, record: any) => record.renderedEducationalQualification,
  },
  {
    title: "Mobile",
    dataIndex: "mobileNumber",
    key: "mobileNumber",
    render: (text: any, record: any) => record.renderedMobileNumber,
  },
  {
    title: "Staying with Applicant",
    dataIndex: "stayingWithApplicant",
    key: "stayingWithApplicant",
    render: (text: any, record: any) => record.renderedStayingWithApplicant,
  },
];

const FamilyMemberDetailsDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
  changedFields?: string[];
  changedData?: any;
}> = ({ data, extra, logs = false, changedFields = [], changedData = {} }) => {
  const familyMemberDetails = data?.familyMemberDetails || [];
  const prevDetails = changedData?.familyMemberDetails || [];

  function renderCell(field: string, idx: number, value: any) {
    if (
      prevDetails[idx] &&
      prevDetails[idx][field] !== undefined &&
      prevDetails[idx][field] !== value
    ) {
      return (
        <span>
          <span style={{ textDecoration: "line-through", color: "#888" }}>
            {prevDetails[idx][field]}
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
    if (!prevDetails[idx]) return false;
    return [
      "name",
      "relation",
      "age",
      "employmentType",
      "educationalQualification",
      "mobileNumber",
      "stayingWithApplicant",
    ].some(
      (field) =>
        prevDetails[idx][field] !== undefined &&
        prevDetails[idx][field] !== emp[field]
    );
  }

  const tableData = familyMemberDetails.map((emp: any, idx: number) => ({
    key: idx,
    renderedName: renderCell("name", idx, emp.name),
    renderedRelation: renderCell(
      "relation",
      idx,
      emp?.relation === "Other"
        ? `${emp.relation}-${emp.otherRelation}`
        : emp?.relation
    ),
    renderedAge: renderCell("age", idx, emp.age),
    renderedEmploymentType: renderCell(
      "employmentType",
      idx,
      emp.employmentType
    ),
    renderedEducationalQualification: renderCell(
      "educationalQualification",
      idx,
      emp.educationalQualification
    ),
    renderedMobileNumber: renderCell("mobileNumber", idx, emp.mobileNumber),
    renderedStayingWithApplicant: renderCell(
      "stayingWithApplicant",
      idx,
      emp.stayingWithApplicant
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
            // scroll={{ x: 100 }}
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

export default FamilyMemberDetailsDescription;
