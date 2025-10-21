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
  if (currentDepartment === "PD") {
    const pdArkaStyle = !!(
      data?.businessDetails?.typeOfEntity ||
      data?.businessDetails?.gstNumber ||
      data?.businessDetails?.legalName ||
      data?.businessDetails?.tradeName
    );

    // Check if it's Chola-style data (has businessName, businessType, etc.)
    const pdCholaStyle = !!(
      data?.businessDetails?.businessName ||
      data?.businessDetails?.businessType ||
      data?.businessDetails?.yearsInBusiness ||
      data?.businessDetails?.natureOfBusiness
    );

    // Check if it's RBL-style data (has different businessDetails structure)
    const pdRBLStyle = !!(
      data?.businessDetails?.legalName ||
      data?.businessDetails?.tradeName ||
      data?.businessDetails?.gstNumber ||
      data?.businessDetails?.typeOfEntity
    );

    return (
      <section style={{ marginBottom: 24 }}>
        <Card>
          <Descriptions
            title="Business Details"
            bordered
            column={logs ? 1 : 2}
            extra={extra}
          >
            {pdRBLStyle ? (
              <>
                <Descriptions.Item
                  label="Business Name"
                  contentStyle={getItemStyle("businessName")}
                >
                  {data?.businessDetails?.businessName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Legal Name"
                  contentStyle={getItemStyle("legalName")}
                >
                  {data?.businessDetails?.legalName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Trade Name"
                  contentStyle={getItemStyle("tradeName")}
                >
                  {data?.businessDetails?.tradeName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Type of Entity"
                  contentStyle={getItemStyle("typeOfEntity")}
                >
                  {data?.businessDetails?.typeOfEntity}
                </Descriptions.Item>
                <Descriptions.Item
                  label="GST Number"
                  contentStyle={getItemStyle("gstNumber")}
                >
                  {data?.businessDetails?.gstNumber}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Nature of Business"
                  contentStyle={getItemStyle("natureOfBusiness")}
                >
                  {data?.businessDetails?.natureOfBusiness}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Margins"
                  contentStyle={getItemStyle("margins")}
                >
                  {data?.businessDetails?.margins}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Business Process"
                  contentStyle={getItemStyle("businessProcess")}
                >
                  {data?.businessDetails?.businessProcess}
                </Descriptions.Item>
              </>
            ) : pdCholaStyle ? (
              <>
                <Descriptions.Item
                  label="Business Name"
                  contentStyle={getItemStyle("businessName")}
                >
                  {data?.businessDetails?.businessName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Business Type"
                  contentStyle={getItemStyle("businessType")}
                >
                  {data?.businessDetails?.businessType}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Years in Business"
                  contentStyle={getItemStyle("yearsInBusiness")}
                >
                  {data?.businessDetails?.yearsInBusiness}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Nature of Business"
                  contentStyle={getItemStyle("natureOfBusiness")}
                >
                  {data?.businessDetails?.natureOfBusiness}
                </Descriptions.Item>
              </>
            ) : pdArkaStyle ? (
              <>
                <Descriptions.Item
                  label="Business Name"
                  contentStyle={getItemStyle("businessName")}
                >
                  {data?.businessDetails?.businessName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Type of Entity"
                  contentStyle={getItemStyle("typeOfEntity")}
                >
                  {data?.businessDetails?.typeOfEntity}
                </Descriptions.Item>
                <Descriptions.Item
                  label="GST Number"
                  contentStyle={getItemStyle("gstNumber")}
                >
                  {data?.businessDetails?.gstNumber}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Legal Name"
                  contentStyle={getItemStyle("legalName")}
                >
                  {data?.businessDetails?.legalName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Trade Name"
                  contentStyle={getItemStyle("tradeName")}
                >
                  {data?.businessDetails?.tradeName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Last GST Return (As per GST records)"
                  contentStyle={getItemStyle("lastGSTReturn")}
                >
                  {data?.businessDetails?.lastGSTReturn}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Establishment"
                  contentStyle={getItemStyle("establishment")}
                >
                  {data?.businessDetails?.establishment}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Shop Address"
                  contentStyle={getItemStyle("shopAddress")}
                >
                  {data?.businessDetails?.shopAddress}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Shop Ownership"
                  contentStyle={getItemStyle("shopOwnership")}
                >
                  {data?.businessDetails?.shopOwnership}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Godown Address"
                  contentStyle={getItemStyle("godownAddress")}
                >
                  {data?.businessDetails?.godownAddress}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Godown Ownership"
                  contentStyle={getItemStyle("godownOwnership")}
                >
                  {data?.businessDetails?.godownOwnership}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Nature of Business"
                  contentStyle={getItemStyle("natureOfBusiness")}
                >
                  {data?.businessDetails?.natureOfBusiness}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Product Details (please also comment on Vintage of the product deals by the firm & Future changes if any)"
                  contentStyle={getItemStyle("productDetails")}
                >
                  {data?.businessDetails?.productDetails}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Business Process"
                  contentStyle={getItemStyle("businessProcess")}
                >
                  {data?.businessDetails?.businessProcess}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Margins"
                  contentStyle={getItemStyle("margins")}
                >
                  {data?.businessDetails?.margins}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Documents Observed"
                  contentStyle={getItemStyle("documentsObserved")}
                >
                  {data?.businessDetails?.documentsObserved}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Activity Observed"
                  contentStyle={getItemStyle("activityObserved")}
                >
                  {data?.businessDetails?.activityObserved}
                </Descriptions.Item>
              </>
            ) : (
              <>
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
              </>
            )}
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
