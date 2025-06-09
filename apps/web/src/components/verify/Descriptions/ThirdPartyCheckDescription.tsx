import { Card, Descriptions } from "antd";
import React from "react";

const ThirdPartyCheckDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
  changedFields?: string[];
  isCurrentVersion?: boolean;
}> = ({ data, extra, logs = false, changedFields = [], isCurrentVersion = false }) => {
  const getItemStyle = (fieldName: string) => {
    if (!changedFields.includes(fieldName)) return {};
    
    return {
      backgroundColor: isCurrentVersion ? '#fff1f0' : '#f6ffed'  // Red for current version, green for new version
    };
  };

  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Third Party Check"
            bordered
            column={logs ? 1 : 3}
            extra={extra || null}
          >
            <Descriptions.Item 
              label="TPC Name"
              contentStyle={getItemStyle('tpcName')}
            >
              {data?.thirdPartyCheck?.tpcName}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Mobile Number"
              contentStyle={getItemStyle('mobileNumber')}
            >
              {data?.thirdPartyCheck?.mobileNumber}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Relationship"
              contentStyle={getItemStyle('relationship')}
            >
              {data?.thirdPartyCheck?.relationship}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Comments"
              contentStyle={getItemStyle('comments')}
            >
              {data?.thirdPartyCheck?.comments}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default ThirdPartyCheckDescription;
