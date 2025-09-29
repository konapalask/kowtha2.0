import { Card, Descriptions } from "antd";
import React from "react";

const BusinessDetailsDescription: React.FC<{
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

  // For PD department, show different fields
  if (currentDepartment === 'PD') {
    return (
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Business Details"
            bordered
            column={logs ? 1 : 2}
            extra={extra}
          >
            <Descriptions.Item
              label="Type of Business"
              contentStyle={getItemStyle("typeOfBusiness")}
            >
              {data?.businessDetails?.typeOfBusiness}
            </Descriptions.Item>
            <Descriptions.Item
              label="Nature of Business"
              contentStyle={getItemStyle("natureOfBusiness")}
            >
              {data?.businessDetails?.natureOfBusiness}
            </Descriptions.Item>
            <Descriptions.Item
              label="Year Business Started"
              contentStyle={getItemStyle("yearBusinessStarted")}
            >
              {data?.businessDetails?.yearBusinessStarted}
            </Descriptions.Item>
            <Descriptions.Item
              label="Number of Workers"
              contentStyle={getItemStyle("numberOfWorkers")}
            >
              {data?.businessDetails?.numberOfWorkers}
            </Descriptions.Item>
            <Descriptions.Item
              label="Sales Volume"
              contentStyle={getItemStyle("salesVolume")}
            >
              {data?.businessDetails?.salesVolume}
            </Descriptions.Item>
            <Descriptions.Item
              label="Profit Per Unit"
              contentStyle={getItemStyle("profitPerUnit")}
            >
              {data?.businessDetails?.profitPerUnit}
            </Descriptions.Item>
            <Descriptions.Item
              label="Stock Source"
              contentStyle={getItemStyle("stockSource")}
            >
              {data?.businessDetails?.stockSource}
            </Descriptions.Item>
            <Descriptions.Item
              label="Stock Handling"
              contentStyle={getItemStyle("stockHandling")}
            >
              {data?.businessDetails?.stockHandling}
            </Descriptions.Item>
            <Descriptions.Item
              label="Major Transaction Mode"
              contentStyle={getItemStyle("majorTransactionMode")}
            >
              {data?.businessDetails?.majorTransactionMode}
            </Descriptions.Item>
            <Descriptions.Item
              label="Business Premises Ownership"
              contentStyle={getItemStyle("businessPremisesOwnership")}
            >
              {data?.businessDetails?.businessPremisesOwnership}
            </Descriptions.Item>
            <Descriptions.Item
              label="Wage Expenses"
              contentStyle={getItemStyle("wageExpenses")}
            >
              {data?.businessDetails?.wageExpenses}
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
          title="Business Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item
            label="Name Board Seen"
            contentStyle={getItemStyle("nameBoardSeen")}
          >
            {data?.businessDetails?.nameBoardSeen}
          </Descriptions.Item>
          <Descriptions.Item
            label="Name Board Matched with Initiation"
            contentStyle={getItemStyle("nameBoardMatched")}
          >
            {data?.businessDetails?.nameBoardMatched}
          </Descriptions.Item>
          <Descriptions.Item
            label="Constitution"
            contentStyle={getItemStyle("constitution")}
          >
            {data?.businessDetails?.constitution}
          </Descriptions.Item>
          {data?.businessDetails?.constitution === "Others" && (
            <Descriptions.Item
              label="Other Constitution"
              contentStyle={getItemStyle("constitutionOther")}
            >
              {data?.businessDetails?.constitutionOther}
            </Descriptions.Item>
          )}
          <Descriptions.Item
            label="Business Start Year"
            contentStyle={getItemStyle("businessStartYear")}
          >
            {data?.businessDetails?.businessStartYear}
          </Descriptions.Item>
          <Descriptions.Item
            label="Total Experience (Years)"
            contentStyle={getItemStyle("totalExperience")}
          >
            {data?.businessDetails?.totalExperience}
          </Descriptions.Item>
          <Descriptions.Item
            label="Is Business Seasonal?"
            contentStyle={getItemStyle("isBusinessSeasonal")}
          >
            {data?.businessDetails?.isBusinessSeasonal}
          </Descriptions.Item>
          <Descriptions.Item
            label="Is Address Traceable"
            contentStyle={getItemStyle("isAddressTraceable")}
          >
            {data?.businessDetails?.isAddressTraceable}
          </Descriptions.Item>
          <Descriptions.Item
            label="Geo Tag"
            contentStyle={getItemStyle("geoTag")}
          >
            {data?.businessDetails?.geoTag}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default BusinessDetailsDescription;
