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
            {/* <Descriptions.Item
              label="Type of Business"
              contentStyle={getItemStyle("businessType")}
            >
              {data?.businessDetails?.businessType}
            </Descriptions.Item> */}
            <Descriptions.Item
              label="No. of Employees (Declared / Observed)"
              contentStyle={getItemStyle("employeesDeclared")}
            >
              {data?.businessDetails?.employeesDeclared} / {data?.businessDetails?.employeesObserved}
            </Descriptions.Item>
            <Descriptions.Item
              label="Constitution of Business"
              contentStyle={getItemStyle("constitutionOfBusiness")}
            >
              {data?.businessDetails?.constitutionOfBusiness}
            </Descriptions.Item>
            <Descriptions.Item
              label="Nature of Business"
              contentStyle={getItemStyle("natureOfBusiness")}
            >
              {data?.businessDetails?.natureOfBusiness}
            </Descriptions.Item>
            <Descriptions.Item
              label="Business Activity Observed"
              contentStyle={getItemStyle("businessActivityObserved")}
            >
              {data?.businessDetails?.businessActivityObserved}
            </Descriptions.Item>
            <Descriptions.Item
              label="Stock Observed"
              contentStyle={getItemStyle("stockObserved")}
            >
              {data?.businessDetails?.stockObserved}
            </Descriptions.Item>
            <Descriptions.Item
              label="Business Start Year"
              contentStyle={getItemStyle("businessStartYear")}
            >
              {data?.businessDetails?.businessStartYear}
            </Descriptions.Item>
            <Descriptions.Item
              label="Occupied Since (years)"
              contentStyle={getItemStyle("occupiedSince")}
            >
              {data?.businessDetails?.occupiedSince}
            </Descriptions.Item>
            <Descriptions.Item
              label="Net Margin (%)"
              contentStyle={getItemStyle("netMargin")}
            >
              {data?.businessDetails?.netMargin}
            </Descriptions.Item>
            <Descriptions.Item
              label="Business Premises Size (in sq. ft.)"
              contentStyle={getItemStyle("businessPremisesSize")}
            >
              {data?.businessDetails?.businessPremisesSize}
            </Descriptions.Item>
            <Descriptions.Item
              label="Raw Material Supplier"
              contentStyle={getItemStyle("rawMaterialSupplier")}
            >
              {data?.businessDetails?.rawMaterialSupplier}
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
