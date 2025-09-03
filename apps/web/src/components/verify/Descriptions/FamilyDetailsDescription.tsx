import { Card, Descriptions, Table } from "antd";
import React from "react";

const FamilyDetailsDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
  changedFields?: string[];
  isCurrentVersion?: boolean;
}> = ({
  data,
  extra,
  logs = false,
  changedFields = [],
  isCurrentVersion = false,
}) => {
  const getItemStyle = (fieldName: string) => {
    if (!changedFields.includes(fieldName)) return {};

    return {
      backgroundColor: isCurrentVersion ? "#fff1f0" : "#f6ffed", // Red for current version, green for new version
    };
  };

  const familyMembers = data?.familyMemberDetails || [];

  return (
    <section style={{ marginBottom: 24 }}>
      <Card
        title="Family Details"
        extra={extra}
      >
        {familyMembers.length > 0 ? (
          <Table
            className="striped-table"
            dataSource={familyMembers}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Relation",
                dataIndex: "relation",
                key: "relation",
                render: (text: string, record: any) =>
                  text === "Other" && record.otherRelation
                    ? `Other - ${record.otherRelation}`
                    : text,
              },
              {
                title: "Age",
                dataIndex: "age",
                key: "age",
              },
              {
                title: "Occupation",
                dataIndex: "employmentType",
                key: "employmentType",
              },
              {
                title: "Education",
                dataIndex: "educationalQualification",
                key: "educationalQualification",
              },
            ]}
            pagination={false}
            locale={{ emptyText: "No family members added yet" }}
            bordered
          />
        ) : (
          <Descriptions
            bordered
            column={logs ? 1 : 2}
          >
            <Descriptions.Item label="Name">-</Descriptions.Item>
            <Descriptions.Item label="Relation">-</Descriptions.Item>
            <Descriptions.Item label="Age">-</Descriptions.Item>
            <Descriptions.Item label="Occupation">-</Descriptions.Item>
            <Descriptions.Item label="Education">-</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </section>
  );
};

export default FamilyDetailsDescription; 