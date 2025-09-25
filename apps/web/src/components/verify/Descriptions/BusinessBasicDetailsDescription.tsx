import { Card, Descriptions } from "antd";
import React from "react";

const BusinessBasicDetailsDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
  changedFields?: string[];
  isCurrentVersion?: boolean;
  currentDepartment?: string;
}> = ({
  data,
  extra,
  logs = false,
  changedFields = [],
  isCurrentVersion = false,
  currentDepartment,
}) => {
  const getItemStyle = (fieldName: string) => {
    if (!changedFields.includes(fieldName)) return {};

    return {
      backgroundColor: isCurrentVersion ? "#fff1f0" : "#f6ffed", // Red for current version, green for new version
    };
  };

  // Helper function to format display values
  const formatDisplayValue = (value: any, fieldName: string) => {
    if (!value) return "-";
    
    // Format specific fields
    switch (fieldName) {
      case "personMet":
        return value.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      case "constitution":
        return value.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      case "structureOfLoan":
        return value.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      case "appointmentFixed":
        return value.charAt(0).toUpperCase() + value.slice(1);
      default:
        return value;
    }
  };

  // For PD department, show different fields
  if (currentDepartment === 'PD') {
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
              label="Phone No"
              contentStyle={getItemStyle("phoneNo")}
            >
              {formatDisplayValue(data?.basicDetails?.phoneNo, "phoneNo")}
            </Descriptions.Item>
            <Descriptions.Item
              label="No. of Visit"
              contentStyle={getItemStyle("noOfVisit")}
            >
              {formatDisplayValue(data?.basicDetails?.noOfVisit, "noOfVisit")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Person Met"
              contentStyle={getItemStyle("personMet")}
            >
              {formatDisplayValue(data?.basicDetails?.personMet, "personMet")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Constitution"
              contentStyle={getItemStyle("constitution")}
            >
              {formatDisplayValue(data?.basicDetails?.constitution, "constitution")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Applicant Name"
              contentStyle={getItemStyle("applicantName")}
            >
              {formatDisplayValue(data?.basicDetails?.applicantName, "applicantName")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Name of Concern"
              contentStyle={getItemStyle("nameOfConcern")}
            >
              {formatDisplayValue(data?.basicDetails?.nameOfConcern, "nameOfConcern")}
            </Descriptions.Item>
            <Descriptions.Item
              label="About Applicant"
              contentStyle={getItemStyle("aboutApplicant")}
            >
              {formatDisplayValue(data?.basicDetails?.aboutApplicant, "aboutApplicant")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Visited Address"
              contentStyle={getItemStyle("visitedAddress")}
            >
              {formatDisplayValue(data?.basicDetails?.visitedAddress, "visitedAddress")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Structure of Loan"
              contentStyle={getItemStyle("structureOfLoan")}
            >
              {formatDisplayValue(data?.basicDetails?.structureOfLoan, "structureOfLoan")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Appointment Fixed"
              contentStyle={getItemStyle("appointmentFixed")}
            >
              {formatDisplayValue(data?.basicDetails?.appointmentFixed, "appointmentFixed")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Initiated Address"
              contentStyle={getItemStyle("initiatedAddress")}
            >
              {formatDisplayValue(data?.basicDetails?.initiatedAddress, "initiatedAddress")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Co-Applicant Details"
              contentStyle={getItemStyle("coApplicantDetails")}
            >
              {formatDisplayValue(data?.basicDetails?.coApplicantDetails, "coApplicantDetails")}
            </Descriptions.Item>
            <Descriptions.Item
              label="Residential Details"
              contentStyle={getItemStyle("residentialDetails")}
            >
              {formatDisplayValue(data?.basicDetails?.residentialDetails, "residentialDetails")}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </section>
    );
  }

  // Original implementation for other departments
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
          {data?.basicDetails?.isApplicantAvailable && (
            <Descriptions.Item
              label="Is Applicant Available"
              contentStyle={getItemStyle("isApplicantAvailable")}
            >
              {data?.basicDetails?.isApplicantAvailable}
            </Descriptions.Item>
          )}
          {data?.basicDetails?.isApplicantAvailable === "No" && (
            <>
              {data?.basicDetails?.availablePersonName && (
                <Descriptions.Item
                  label="Name of the person met"
                  contentStyle={getItemStyle("availablePersonName")}
                >
                  {data?.basicDetails?.availablePersonName}
                </Descriptions.Item>
              )}
              {data?.basicDetails?.availablePersonMobile && (
                <Descriptions.Item
                  label="Contact Number"
                  contentStyle={getItemStyle("availablePersonMobile")}
                >
                  {data?.basicDetails?.availablePersonMobile}
                </Descriptions.Item>
              )}
              {data?.basicDetails?.availablePersonRelation && (
                <Descriptions.Item
                  label="Relation to the applicant"
                  contentStyle={getItemStyle("availablePersonRelation")}
                >
                  {data?.basicDetails?.availablePersonRelation === "Others"
                    ? `Others - ${data?.basicDetails?.availablePersonRelationOther || ""}`
                    : data?.basicDetails?.availablePersonRelation}
                </Descriptions.Item>
              )}
            </>
          )}
        </Descriptions>
      </Card>
    </section>
  );
};

export default BusinessBasicDetailsDescription;
