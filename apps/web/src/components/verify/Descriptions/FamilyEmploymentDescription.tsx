import { Card, Descriptions } from "antd";
import React from "react";

const FamilyEmploymentDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
}> = ({ data, extra, logs = false }) => {
  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Family & Employment Details"
            bordered
            column={logs ? 1 : 2}
            extra={extra || null}
          >
            <Descriptions.Item label="Total Family Members">
              {data?.familyEmploymentDetails?.totalFamilyMembers}
            </Descriptions.Item>
            <Descriptions.Item label="No. of Earning Members">
              {data?.familyEmploymentDetails?.earningMembers}
            </Descriptions.Item>
            <Descriptions.Item label="No. of Dependents">
              {data?.familyEmploymentDetails?.dependents}
            </Descriptions.Item>
            <Descriptions.Item label="Is Spouse Working">
              {data?.familyEmploymentDetails?.isSpouseWorking}
            </Descriptions.Item>
            <Descriptions.Item label="Spouse's Employment Details">
              {data?.familyEmploymentDetails?.spouseEmploymentDetails}
            </Descriptions.Item>
            <Descriptions.Item label="Assets Observed">
              {data?.familyEmploymentDetails?.assetsObserved}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default FamilyEmploymentDescription;
