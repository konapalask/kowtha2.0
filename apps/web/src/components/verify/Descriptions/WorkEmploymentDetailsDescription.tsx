import { Card, Descriptions } from "antd";
import React from "react";

const WorkEmploymentDetailsDescription: React.FC<{
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
          title="Employment Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item
            label="Current Office Name"
            contentStyle={getItemStyle("currentOfficeName")}
          >
            {data?.employmentDetails?.currentOfficeName}
          </Descriptions.Item>
          <Descriptions.Item
            label="Office Address"
            contentStyle={getItemStyle("officeAddress")}
          >
            {data?.employmentDetails?.officeAddress}
          </Descriptions.Item>
          <Descriptions.Item
            label="Address Mismatch"
            contentStyle={getItemStyle("isAddressSame")}
          >
            {data?.employmentDetails?.isAddressSame}
          </Descriptions.Item>
          {data?.employmentDetails?.isAddressSame === "Yes" && (
            <>
              <Descriptions.Item
                label="Corrected Address"
                contentStyle={getItemStyle("addressCorrection")}
              >
                {data?.employmentDetails?.addressCorrection}
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item
            label="Years in Current Job"
            contentStyle={getItemStyle("yearsInCurrentJob")}
          >
            {data?.employmentDetails?.yearsInCurrentJob}
          </Descriptions.Item>
          <Descriptions.Item
            label="Total Work Experience"
            contentStyle={getItemStyle("totalWorkExperience")}
          >
            {data?.employmentDetails?.totalWorkExperience}
          </Descriptions.Item>
          <Descriptions.Item
            label="Company Size"
            contentStyle={getItemStyle("companySize")}
          >
            {data?.employmentDetails?.companySize}
          </Descriptions.Item>
          <Descriptions.Item
            label="Nature of Service/Business"
            contentStyle={getItemStyle("natureOfService")}
          >
            {data?.employmentDetails?.natureOfService}
            {data?.employmentDetails?.natureOfService === "Others" &&
              ` - ${data?.employmentDetails?.natureOfServiceOther}`}
          </Descriptions.Item>
          <Descriptions.Item
            label="Office Locality"
            contentStyle={getItemStyle("officeLocality")}
          >
            {data?.employmentDetails?.officeLocality}
          </Descriptions.Item>
          <Descriptions.Item
            label="ID Card Number"
            contentStyle={getItemStyle("idCardNumber")}
          >
            {data?.employmentDetails?.idCardNumber}
          </Descriptions.Item>
          <Descriptions.Item
            label="Designation"
            contentStyle={getItemStyle("designation")}
          >
            {data?.employmentDetails?.designation}
          </Descriptions.Item>
          <Descriptions.Item
            label="Mode of Salary"
            contentStyle={getItemStyle("salaryMode")}
          >
            {data?.employmentDetails?.salaryMode}
          </Descriptions.Item>
          <Descriptions.Item
            label="Type of Employer"
            contentStyle={getItemStyle("employerType")}
          >
            {data?.employmentDetails?.employerType}
            {data?.employmentDetails?.employerType === "Other" &&
              ` - ${data?.employmentDetails?.employerTypeOther}`}
          </Descriptions.Item>
          <Descriptions.Item
            label="Gross Salary per Month"
            contentStyle={getItemStyle("grossSalary")}
          >
            {data?.employmentDetails?.grossSalary}
          </Descriptions.Item>
          <Descriptions.Item
            label="Net Salary per Month"
            contentStyle={getItemStyle("netSalary")}
          >
            {data?.employmentDetails?.netSalary}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default WorkEmploymentDetailsDescription;
