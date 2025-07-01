import { Card, Descriptions } from "antd";
import React from "react";

const BusinessDetailsDescription: React.FC<{
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

  return (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Business Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item
            label="Name Board Seen"
            contentStyle={getItemStyle("nameBoardSeen")}
          >
            {data?.businessDetails?.nameBoardSeen}
          </Descriptions.Item>
          <Descriptions.Item
            label="Name Board Matched with Initiation"
            contentStyle={getItemStyle("nameBoardMatched")}
          >
            {data?.businessDetails?.nameBoardMatched}
          </Descriptions.Item>
          <Descriptions.Item
            label="Constitution"
            contentStyle={getItemStyle("constitution")}
          >
            {data?.businessDetails?.constitution}
          </Descriptions.Item>
          {data?.businessDetails?.constitution === "Others" && (
            <Descriptions.Item
              label="Other Constitution"
              contentStyle={getItemStyle("constitutionOther")}
            >
              {data?.businessDetails?.constitutionOther}
            </Descriptions.Item>
          )}
          {/* <Descriptions.Item 
            label="Key Manager Relationship"
            contentStyle={getItemStyle('keyManagerRelation')}
          >
            {data?.businessDetails?.keyManagerRelation}
          </Descriptions.Item>
          {data?.businessDetails?.keyManagerRelation === "Others" && (
            <Descriptions.Item 
              label="Other Relationship"
              contentStyle={getItemStyle('keyManagerRelationOther')}
            >
              {data?.businessDetails?.keyManagerRelationOther}
            </Descriptions.Item>
          )}
          {data?.businessDetails?.keyManagerRelation !== "Applicant" && (
            <Descriptions.Item 
              label="Key Manager Name"
              contentStyle={getItemStyle('keyManager')}
            >
              {data?.businessDetails?.keyManager}
            </Descriptions.Item>
          )} */}
          <Descriptions.Item
            label="Business Start Year"
            contentStyle={getItemStyle("businessStartYear")}
          >
            {data?.businessDetails?.businessStartYear}
          </Descriptions.Item>
          <Descriptions.Item
            label="Total Experience (Years)"
            contentStyle={getItemStyle("totalExperience")}
          >
            {data?.businessDetails?.totalExperience}
          </Descriptions.Item>
          <Descriptions.Item
            label="Is Business Seasonal?"
            contentStyle={getItemStyle("isBusinessSeasonal")}
          >
            {data?.businessDetails?.isBusinessSeasonal}
          </Descriptions.Item>
          <Descriptions.Item
            label="Is Address Traceable"
            contentStyle={getItemStyle("isAddressTraceable")}
          >
            {data?.businessDetails?.isAddressTraceable}
          </Descriptions.Item>
          <Descriptions.Item
            label="Geo Tag"
            contentStyle={getItemStyle("geoTag")}
          >
            {data?.businessDetails?.geoTag}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default BusinessDetailsDescription;
