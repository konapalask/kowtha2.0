import { Card, Descriptions } from "antd";
import React from "react";

const ApplicantDetailsDescription: React.FC<{
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
          title="Applicant Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item
            label="Current Residential Address"
            contentStyle={getItemStyle("currentResidentialAddress")}
          >
            {data?.applicantDetails?.currentResidentialAddress}
          </Descriptions.Item>
          <Descriptions.Item
            label="Assets"
            contentStyle={getItemStyle("assets")}
          >
            {data?.applicantDetails?.assets}
          </Descriptions.Item>
          <Descriptions.Item
            label="Purpose of Loan"
            contentStyle={getItemStyle("purposeOfLoan")}
          >
            {data?.applicantDetails?.purposeOfLoan}
          </Descriptions.Item>
          <Descriptions.Item
            label="Person Met"
            contentStyle={getItemStyle("personMet")}
          >
            {data?.applicantDetails?.personMet}
          </Descriptions.Item>
          <Descriptions.Item
            label="Educational Qualification"
            contentStyle={getItemStyle("educationalQualification")}
          >
            {data?.applicantDetails?.educationalQualification}
          </Descriptions.Item>
          <Descriptions.Item
            label="Income Details"
            contentStyle={getItemStyle("incomeDetails")}
          >
            {data?.applicantDetails?.incomeDetails}
          </Descriptions.Item>
          <Descriptions.Item
            label="Name of Co-applicant"
            contentStyle={getItemStyle("nameOfCoApplicant")}
          >
            {data?.applicantDetails?.nameOfCoApplicant}
          </Descriptions.Item>
          <Descriptions.Item
            label="Marital Status"
            contentStyle={getItemStyle("maritalStatus")}
          >
            {data?.applicantDetails?.maritalStatus}
          </Descriptions.Item>
          <Descriptions.Item
            label="House Size (in sq. ft.)"
            contentStyle={getItemStyle("houseSize")}
          >
            {data?.applicantDetails?.houseSize}
          </Descriptions.Item>
          <Descriptions.Item
            label="Work Experience"
            contentStyle={getItemStyle("workExperience")}
          >
            {data?.applicantDetails?.workExperience}
          </Descriptions.Item>
          <Descriptions.Item
            label="Purchase"
            contentStyle={getItemStyle("purchase")}
          >
            {data?.applicantDetails?.purchase}
          </Descriptions.Item>
          <Descriptions.Item
            label="Relationship Duration"
            contentStyle={getItemStyle("relationshipDuration")}
          >
            {data?.applicantDetails?.relationshipDuration}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default ApplicantDetailsDescription; 