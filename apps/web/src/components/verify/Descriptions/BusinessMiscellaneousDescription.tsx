import { Card, Descriptions } from "antd";
import React from "react";

const BusinessMiscellaneousDescription: React.FC<{
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
          title="Business Miscellaneous Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item
            label="Stock Seen"
            contentStyle={getItemStyle("stockSeen")}
          >
            {data?.miscellaneous?.stockSeen}
          </Descriptions.Item>
          <Descriptions.Item
            label="Ownership of Premises"
            contentStyle={getItemStyle("ownershipOfPremises")}
          >
            {data?.miscellaneous?.ownershipOfPremises}
          </Descriptions.Item>
          {data?.miscellaneous?.ownershipOfPremises === "Rented" && (
            <Descriptions.Item
              label="Rent paid"
              contentStyle={getItemStyle("rentalAmount")}
            >
              {data?.miscellaneous?.rentalAmount}
            </Descriptions.Item>
          )}
          {data?.miscellaneous?.ownershipOfPremises === "Leased" && (
            <Descriptions.Item
              label="Lease"
              contentStyle={getItemStyle("leaseAmount")}
            >
              {data?.miscellaneous?.leaseAmount}
            </Descriptions.Item>
          )}
          <Descriptions.Item
            label="Area of Premises"
            contentStyle={getItemStyle("areaOfPremises")}
          >
            {data?.miscellaneous?.areaOfPremises}
          </Descriptions.Item>
          <Descriptions.Item
            label="Locality of Business"
            contentStyle={getItemStyle("localityOfBusiness")}
          >
            {data?.miscellaneous?.localityOfBusiness}
          </Descriptions.Item>
          <Descriptions.Item
            label="Years in Current Premises"
            contentStyle={getItemStyle("yearsInCurrentPremises")}
          >
            {data?.miscellaneous?.yearsInCurrentPremises}
          </Descriptions.Item>
          <Descriptions.Item
            label="Employees under applicant"
            contentStyle={getItemStyle("employeesUnderApplicant")}
          >
            {data?.miscellaneous?.employeesUnderApplicant}
          </Descriptions.Item>
          <Descriptions.Item
            label="Employees Seen"
            contentStyle={getItemStyle("employeesSeen")}
          >
            {data?.miscellaneous?.employeesSeen}
          </Descriptions.Item>
          <Descriptions.Item
            label="Other Setup Observed"
            contentStyle={getItemStyle("otherSetupObserved")}
          >
            {data?.miscellaneous?.otherSetupObserved}
          </Descriptions.Item>
          <Descriptions.Item
            label="Politically Connected"
            contentStyle={getItemStyle("politicallyConnected")}
          >
            {data?.miscellaneous?.politicallyConnected}
          </Descriptions.Item>
          <Descriptions.Item
            label="Business Activity"
            contentStyle={getItemStyle("businessActivity")}
          >
            {data?.miscellaneous?.businessActivity}
          </Descriptions.Item>
          {/* {data?.miscellaneous?.businessActivity === "Others" && (
            <Descriptions.Item
              label="Other Business Activity"
              contentStyle={getItemStyle("businessActivityOther")}
            >
              {data?.miscellaneous?.businessActivityOther}
            </Descriptions.Item>
          )} */}
        </Descriptions>
      </Card>
    </section>
  );
};

export default BusinessMiscellaneousDescription;
