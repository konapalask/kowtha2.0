import { Card, Descriptions } from "antd";
import React from "react";

const FamilyEmploymentDescription: React.FC<{
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
            title="Family & Employment Details"
            bordered
            column={logs ? 1 : 3}
            extra={extra || null}
          >
            <Descriptions.Item 
              label="Total Family Members"
              contentStyle={getItemStyle('totalFamilyMembers')}
            >
              {data?.familyEmploymentDetails?.totalFamilyMembers}
            </Descriptions.Item>
            <Descriptions.Item 
              label="No. of Earning Members"
              contentStyle={getItemStyle('earningMembers')}
            >
              {data?.familyEmploymentDetails?.earningMembers}
            </Descriptions.Item>
            <Descriptions.Item 
              label="No. of Dependents"
              contentStyle={getItemStyle('dependents')}
            >
              {data?.familyEmploymentDetails?.dependents}
            </Descriptions.Item>
          {data?.basicDetails?.maritalStatus==="Married"&&
          <Descriptions.Item 
            label="Is Spouse Working"
            contentStyle={getItemStyle('isSpouseWorking')}
          >
              {data?.familyEmploymentDetails?.isSpouseWorking}
            </Descriptions.Item>
          }
         {data?.familyEmploymentDetails?.isSpouseWorking==="Yes"&&
         <Descriptions.Item 
           label="Spouse's Employment Details"
           contentStyle={getItemStyle('spouseEmploymentDetails')}
         >
              {data?.familyEmploymentDetails?.spouseEmploymentDetails}
            </Descriptions.Item>}
            <Descriptions.Item 
              label="Assets Observed"
              contentStyle={getItemStyle('assetsObserved')}
            >
              {data?.familyEmploymentDetails?.assetsObserved}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default FamilyEmploymentDescription;
