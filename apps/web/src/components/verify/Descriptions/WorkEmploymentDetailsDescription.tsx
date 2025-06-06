import { Card, Descriptions } from "antd";
import React from "react";

const WorkEmploymentDetailsDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
}> = ({ data, extra, logs = false }) => {
  return (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Employment Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item label="Current Office Name">
            {data?.employmentDetails?.currentOfficeName}
          </Descriptions.Item>
          <Descriptions.Item label="Office Address">
            {data?.employmentDetails?.officeAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Years in Current Job">
            {data?.employmentDetails?.yearsInCurrentJob}
          </Descriptions.Item>
          <Descriptions.Item label="Total Work Experience">
            {data?.employmentDetails?.totalWorkExperience}
          </Descriptions.Item>
          <Descriptions.Item label="Company Size">
            {data?.employmentDetails?.companySize}
          </Descriptions.Item>
          <Descriptions.Item label="Nature of Service/Business">
            {data?.employmentDetails?.natureOfService}
            {data?.employmentDetails?.natureOfService === "Other" &&
              ` - ${data?.employmentDetails?.natureOfServiceOther}`}
          </Descriptions.Item>
          <Descriptions.Item label="Office Locality">
            {data?.employmentDetails?.officeLocality}
          </Descriptions.Item>
          <Descriptions.Item label="ID Card Number">
            {data?.employmentDetails?.idCardNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Designation">
            {data?.employmentDetails?.designation}
          </Descriptions.Item>
          <Descriptions.Item label="Mode of Salary">
            {data?.employmentDetails?.salaryMode}
          </Descriptions.Item>
          <Descriptions.Item label="Type of Employer">
            {data?.employmentDetails?.employerType}
            {data?.employmentDetails?.employerType === "Other" &&
              ` - ${data?.employmentDetails?.employerTypeOther}`}
          </Descriptions.Item>
          <Descriptions.Item label="Gross Salary per Month">
            {data?.employmentDetails?.grossSalary}
          </Descriptions.Item>
          <Descriptions.Item label="Net Salary per Month">
            {data?.employmentDetails?.netSalary}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default WorkEmploymentDetailsDescription; 