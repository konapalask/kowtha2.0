import { Card, Descriptions } from "antd";
import React from "react";

const BusinessBasicDetailsDescription: React.FC<{
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
          title="Basic Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item
            label="Name of the Applicant"
            contentStyle={getItemStyle("applicantName")}
          >
            {data?.basicDetails?.applicantName}
          </Descriptions.Item>
          <Descriptions.Item
            label="PAN Number"
            contentStyle={getItemStyle("panNumber")}
          >
            {data?.basicDetails?.panNumber}
          </Descriptions.Item>
          <Descriptions.Item
            label="Aadhar Number"
            contentStyle={getItemStyle("aadhar")}
          >
            {data?.basicDetails?.aadhar}
          </Descriptions.Item>
          <Descriptions.Item
            label="Person Met"
            contentStyle={getItemStyle("personMet")}
          >
            {data?.basicDetails?.personMet}
          </Descriptions.Item>
          {data?.basicDetails?.personMet !== "Applicant" && (
            <>
              <Descriptions.Item
                label="Person Met Name"
                contentStyle={getItemStyle("personMetName")}
              >
                {data?.basicDetails?.personMetName}
              </Descriptions.Item>
              {data?.basicDetails?.personMet === "Others" && (
                <Descriptions.Item
                  label="Relationship to Applicant"
                  contentStyle={getItemStyle("personMetRelation")}
                >
                  {data?.basicDetails?.personMetRelation}
                </Descriptions.Item>
              )}
            </>
          )}
          <Descriptions.Item
            label="Business Name"
            contentStyle={getItemStyle("businessName")}
          >
            {data?.basicDetails?.businessName}
          </Descriptions.Item>
          <Descriptions.Item
            label="Is Business Name Same as Initiated"
            contentStyle={getItemStyle("isBusinessNameSame")}
          >
            {data?.basicDetails?.isBusinessNameSame}
          </Descriptions.Item>
          {data?.basicDetails?.isBusinessNameSame === "No" && (
            <Descriptions.Item
              label="Business Name Correction"
              contentStyle={getItemStyle("correctedBusinessName")}
            >
              {data?.basicDetails?.correctedBusinessName}
            </Descriptions.Item>
          )}
          <Descriptions.Item
            label="Nature of Business"
            contentStyle={getItemStyle("businessProfile")}
          >
            {data?.basicDetails?.businessProfile}
          </Descriptions.Item>
          <Descriptions.Item
            label="Business Address"
            contentStyle={getItemStyle("businessAddress")}
          >
            {data?.basicDetails?.businessAddress}
          </Descriptions.Item>
          <Descriptions.Item
            label="Is Address Same as Initiated"
            contentStyle={getItemStyle("isAddressSame")}
          >
            {data?.basicDetails?.isAddressSame}
          </Descriptions.Item>
          {data?.basicDetails?.isAddressSame === "No" && (
            <Descriptions.Item
              label="Address Correction"
              contentStyle={getItemStyle("addressCorrection")}
            >
              {data?.basicDetails?.addressCorrection}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </section>
  );
};

export default BusinessBasicDetailsDescription;
