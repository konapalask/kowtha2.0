import { Card, Descriptions } from "antd";
import React from "react";

const BasicDetailsDescription: React.FC<{
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
    <div>
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title={"Basic Details"}
            bordered
            column={logs ? 1 : 3}
            extra={extra || null}
          >
            <Descriptions.Item
              label="Application Number"
              contentStyle={getItemStyle("applicationNumber")}
            >
              {data?.basicDetails?.applicationNumber}
            </Descriptions.Item>
            <Descriptions.Item
              label="Applicant Name"
              contentStyle={getItemStyle("applicantName")}
            >
              {data?.basicDetails?.applicantName}
            </Descriptions.Item>
            <Descriptions.Item
              label="Aadhar Nubmer"
              contentStyle={getItemStyle("aadhar")}
            >
              {data?.basicDetails?.aadhar}
            </Descriptions.Item>
            <Descriptions.Item
              label="Marital Status"
              contentStyle={getItemStyle("applicantMaritalStatus")}
            >
              {data?.basicDetails?.applicantMaritalStatus}
              {data?.basicDetails?.applicantMaritalStatus === "Others" &&
                ` - ${data?.basicDetails?.applicantMaritalStatusOther}`}
            </Descriptions.Item>
            <Descriptions.Item
              label="Education Qualification"
              contentStyle={getItemStyle("educationQualification")}
            >
              {data?.basicDetails?.educationQualification}
            </Descriptions.Item>
            <Descriptions.Item
              label="Category"
              contentStyle={getItemStyle("category")}
            >
              {data?.basicDetails?.category}
              {data?.basicDetails?.category === "Others" &&
                ` - ${data?.basicDetails?.categoryOther}`}
            </Descriptions.Item>
            <Descriptions.Item
              label="Is Applicant Available?"
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
                  {data?.basicDetails?.availablePersonRelation}
                  {data?.basicDetails?.availablePersonRelation === "Others" &&
                    ` - ${data?.basicDetails?.availablePersonRelationOther}`}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </Card>
      </section>
    </div>
  );
};

export default BasicDetailsDescription;
