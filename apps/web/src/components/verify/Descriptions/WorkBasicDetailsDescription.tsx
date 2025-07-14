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
            label="Purpose of Loan"
            contentStyle={getItemStyle("purposeOfLoan")}
          >
            {data?.basicDetails?.purposeOfLoan}
          </Descriptions.Item>
          <Descriptions.Item
            label="Loan Amount"
            contentStyle={getItemStyle("loanAmount")}
          >
            {data?.basicDetails?.loanAmount}
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
            label="Tenure"
            contentStyle={getItemStyle("tenure")}
          >
            {data?.basicDetails?.tenure}
          </Descriptions.Item>
          <Descriptions.Item
            label="Qualification"
            contentStyle={getItemStyle("qualification")}
          >
            {data?.basicDetails?.qualification}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default WorkBasicDetailsDescription;
