import { Card, Descriptions } from "antd";
import React from "react";

const BusinessBasicDetailsDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
}> = ({ data, extra, logs = false }) => {
  return (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Basic Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item label="Name of the Applicant">
            {data?.basicDetails?.applicantName}
          </Descriptions.Item>
          <Descriptions.Item label="Person Met">
            {data?.basicDetails?.personMet}
          </Descriptions.Item>
          {data?.basicDetails?.personMet !== "Applicant" && (
            <>
              <Descriptions.Item label="Person Met Name">
                {data?.basicDetails?.personMetName}
              </Descriptions.Item>
              {data?.basicDetails?.personMet === "Others" && (
                <Descriptions.Item label="Relationship to Applicant">
                  {data?.basicDetails?.personMetRelation}
                </Descriptions.Item>
              )}
            </>
          )}
          <Descriptions.Item label="Business Address">
            {data?.basicDetails?.businessAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Is Address Same as Initiated">
            {data?.basicDetails?.isAddressSame}
          </Descriptions.Item>
          {data?.basicDetails?.isAddressSame === "No" && (
            <Descriptions.Item label="Address Correction">
              {data?.basicDetails?.addressCorrection}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </section>
  );
};

export default BusinessBasicDetailsDescription; 