import { Card, Descriptions } from "antd";
import React from "react";

const WorkBasicDetailsDescription: React.FC<{
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
          <Descriptions.Item label="Name of the Bank">
            {data?.basicDetails?.bankName}
          </Descriptions.Item>
          <Descriptions.Item label="Prospect Number">
            {data?.basicDetails?.prospectNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Purpose of Loan">
            {data?.basicDetails?.purposeOfLoan}
          </Descriptions.Item>
          <Descriptions.Item label="Loan Amount">
            {data?.basicDetails?.loanAmount}
          </Descriptions.Item>
          <Descriptions.Item label="Tenure">
            {data?.basicDetails?.tenure}
          </Descriptions.Item>
          <Descriptions.Item label="Qualification">
            {data?.basicDetails?.qualification}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default WorkBasicDetailsDescription; 