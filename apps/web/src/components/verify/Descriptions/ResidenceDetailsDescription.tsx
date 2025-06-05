import { Card, Descriptions } from "antd";
import React from "react";

const ResidenceDetailsDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
}> = ({ data, extra, logs = false }) => {
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
            <Descriptions.Item label="Residence Status">
              {data?.residenceDetails?.residenceStatus}
            </Descriptions.Item>
            {data?.residenceDetails?.residenceStatus === "Rented" && (
              <Descriptions.Item label="Rent Details">
                {data?.residenceDetails?.rentDetails}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Type of Residence">
              {data?.residenceDetails?.residenceType}
            </Descriptions.Item>
            <Descriptions.Item label="Standard of Living">
              {data?.residenceDetails?.standardOfLiving}
            </Descriptions.Item>
            <Descriptions.Item label="Locality Type">
              {data?.residenceDetails?.localityType}
            </Descriptions.Item>
            <Descriptions.Item label="Accessibility">
              {data?.residenceDetails?.accessibility}
            </Descriptions.Item>
            <Descriptions.Item label="House Area (sq.ft)">
              {data?.residenceDetails?.houseArea}
            </Descriptions.Item>
            <Descriptions.Item label="Years at Current Address">
              {data?.residenceDetails?.yearsAtCurrentAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Nameboard Visible">
              {data?.residenceDetails?.nameBoardVisible}
            </Descriptions.Item>
            <Descriptions.Item label="Political Symbol Visible">
              {data?.residenceDetails?.politicalSymbolVisible}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default ResidenceDetailsDescription;
