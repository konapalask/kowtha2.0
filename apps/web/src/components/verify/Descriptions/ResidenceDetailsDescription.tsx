import { Card, Descriptions } from "antd";
import React from "react";

const ResidenceDetailsDescription: React.FC<{
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
            title="Residence Details"
            bordered
            column={logs ? 1 : 3}
            extra={extra || null}
          >
            <Descriptions.Item 
              label="Residence Status"
              contentStyle={getItemStyle('residenceStatus')}
            >
              {data?.residenceDetails?.residenceStatus}
            </Descriptions.Item>
            {data?.residenceDetails?.residenceStatus === "Rented" && (
              <Descriptions.Item 
                label="Rent Details"
                contentStyle={getItemStyle('rentDetails')}
              >
                {data?.residenceDetails?.rentDetails}
              </Descriptions.Item>
            )}
            <Descriptions.Item 
              label="Type of Residence"
              contentStyle={getItemStyle('residenceType')}
            >
              {data?.residenceDetails?.residenceType}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Standard of Living"
              contentStyle={getItemStyle('standardOfLiving')}
            >
              {data?.residenceDetails?.standardOfLiving}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Locality Type"
              contentStyle={getItemStyle('localityType')}
            >
              {data?.residenceDetails?.localityType}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Accessibility"
              contentStyle={getItemStyle('accessibility')}
            >
              {data?.residenceDetails?.accessibility}
            </Descriptions.Item>
            <Descriptions.Item 
              label="House Area (sq.ft)"
              contentStyle={getItemStyle('houseArea')}
            >
              {data?.residenceDetails?.houseArea}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Years at Current Address"
              contentStyle={getItemStyle('yearsAtCurrentAddress')}
            >
              {data?.residenceDetails?.yearsAtCurrentAddress}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Nameboard Visible"
              contentStyle={getItemStyle('nameBoardVisible')}
            >
              {data?.residenceDetails?.nameBoardVisible}
            </Descriptions.Item>
            <Descriptions.Item 
              label="Political Symbol Visible"
              contentStyle={getItemStyle('politicalSymbolVisible')}
            >
              {data?.residenceDetails?.politicalSymbolVisible}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default ResidenceDetailsDescription;
