import { Card, Descriptions } from "antd";
import React from "react";

const BusinessDetailsDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
}> = ({ data, extra, logs = false }) => {
  return (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Business Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item label="Name Board Seen">
            {data?.businessDetails?.nameBoardSeen}
          </Descriptions.Item>
          <Descriptions.Item label="Name Board Matched with Initiation">
            {data?.businessDetails?.nameBoardMatched}
          </Descriptions.Item>
          <Descriptions.Item label="Constitution">
            {data?.businessDetails?.constitution}
          </Descriptions.Item>
          {data?.businessDetails?.constitution === "Others" && (
            <Descriptions.Item label="Other Constitution">
              {data?.businessDetails?.constitutionOther}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Key Manager Relationship">
            {data?.businessDetails?.keyManagerRelation}
          </Descriptions.Item>
          {data?.businessDetails?.keyManagerRelation === "Others" && (
            <Descriptions.Item label="Other Relationship">
              {data?.businessDetails?.keyManagerRelationOther}
            </Descriptions.Item>
          )}
          {data?.businessDetails?.keyManagerRelation !== "Applicant" && (
            <Descriptions.Item label="Key Manager Name">
              {data?.businessDetails?.keyManager}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Business Start Year">
            {data?.businessDetails?.businessStartYear}
          </Descriptions.Item>
          <Descriptions.Item label="Total Experience (Years)">
            {data?.businessDetails?.totalExperience}
          </Descriptions.Item>
          <Descriptions.Item label="Is Address Traceable">
            {data?.businessDetails?.isAddressTraceable}
          </Descriptions.Item>
          <Descriptions.Item label="Geo Tag">
            {data?.businessDetails?.geoTag}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default BusinessDetailsDescription; 