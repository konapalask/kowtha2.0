import { Card, Descriptions } from "antd";
import React from "react";

const BasicDetailsDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
}> = ({ data, extra, logs = false }) => {
  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title={"Basic Details"}
            bordered
            column={logs ? 1 : 3}
            extra={extra || null}
          >
            <Descriptions.Item label="Verification Type">
              {data?.basicDetails?.verificationType}
            </Descriptions.Item>
            <Descriptions.Item label="Application Number">
              {data?.basicDetails?.applicationNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Applicant Name">
              {data?.basicDetails?.applicantName}
            </Descriptions.Item>
            <Descriptions.Item label="Marital Status">
              {data?.basicDetails?.applicantMaritalStatus}
              {data?.basicDetails?.applicantMaritalStatus === "Others" &&
                ` - ${data?.basicDetails?.applicantMaritalStatusOther}`}
            </Descriptions.Item>
            <Descriptions.Item label="Education Qualification">
              {data?.basicDetails?.educationQualification}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {data?.basicDetails?.category}
              {data?.basicDetails?.category === "Others" &&
                ` - ${data?.basicDetails?.categoryOther}`}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default BasicDetailsDescription;
