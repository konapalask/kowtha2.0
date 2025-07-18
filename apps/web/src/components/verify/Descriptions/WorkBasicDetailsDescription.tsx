import { Card, Descriptions } from "antd";
import React from "react";

const WorkBasicDetailsDescription: React.FC<{
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
            label="Name of the Bank"
            contentStyle={getItemStyle("bankName")}
          >
            {data?.basicDetails?.bankName}
          </Descriptions.Item>
          <Descriptions.Item
            label="Prospect Number"
            contentStyle={getItemStyle("prospectNumber")}
          >
            {data?.basicDetails?.prospectNumber}
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
            label="Qualification"
            contentStyle={getItemStyle("qualification")}
          >
            {data?.basicDetails?.qualification}
          </Descriptions.Item>
          <Descriptions.Item
            label="Is Applicant Available"
            contentStyle={getItemStyle("isApplicantAvailable")}
          >
            {data?.basicDetails?.isApplicantAvailable}
          </Descriptions.Item>
          {data?.basicDetails?.isApplicantAvailable === "No" && (
            <>
              <Descriptions.Item
                label="Name of the person met"
                contentStyle={getItemStyle("availablePersonName")}
              >
                {data?.basicDetails?.availablePersonName}
              </Descriptions.Item>
              <Descriptions.Item
                label="Contact Number"
                contentStyle={getItemStyle("availablePersonMobile")}
              >
                {data?.basicDetails?.availablePersonMobile}
              </Descriptions.Item>
              <Descriptions.Item
                label="Relation to the applicant"
                contentStyle={getItemStyle("availablePersonRelation")}
              >
                {data?.basicDetails?.availablePersonRelation === "Others"
                  ? `Others - ${data?.basicDetails?.availablePersonRelationOther || ""}`
                  : data?.basicDetails?.availablePersonRelation}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Card>
    </section>
  );
};

export default WorkBasicDetailsDescription;
