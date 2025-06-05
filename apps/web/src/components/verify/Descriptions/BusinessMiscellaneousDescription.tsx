import { Card, Descriptions } from "antd";
import React from "react";

const BusinessMiscellaneousDescription: React.FC<{
  data: any;
  extra: any;
  logs: boolean;
}> = ({ data, extra, logs = false }) => {
  return (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Business Miscellaneous Details"
          bordered
          column={logs ? 1 : 2}
          extra={extra}
        >
          <Descriptions.Item label="Ownership of Premises">
            {data?.miscellaneous?.ownershipOfPremises}
          </Descriptions.Item>
          {data?.miscellaneous?.ownershipOfPremises === "Rented" && (
            <Descriptions.Item label="Rental Amount">
              {data?.miscellaneous?.rentalAmount}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Years in Current Premises">
            {data?.miscellaneous?.yearsInCurrentPremises}
          </Descriptions.Item>
          <Descriptions.Item label="Stock Seen">
            {data?.miscellaneous?.stockSeen}
          </Descriptions.Item>
          <Descriptions.Item label="Employees Seen">
            {data?.miscellaneous?.employeesSeen}
          </Descriptions.Item>
          <Descriptions.Item label="Other Setup Observed">
            {data?.miscellaneous?.otherSetupObserved}
          </Descriptions.Item>
          <Descriptions.Item label="Illegal Setup Observed">
            {data?.miscellaneous?.illegalSetupObserved}
          </Descriptions.Item>
          <Descriptions.Item label="Politically Connected">
            {data?.miscellaneous?.politicallyConnected}
          </Descriptions.Item>
          <Descriptions.Item label="Private Finance/Chits">
            {data?.miscellaneous?.privateFinanceOrChits}
          </Descriptions.Item>
          <Descriptions.Item label="Business Activity">
            {data?.miscellaneous?.businessActivity}
          </Descriptions.Item>
          {data?.miscellaneous?.businessActivity === "Others" && (
            <Descriptions.Item label="Other Business Activity">
              {data?.miscellaneous?.businessActivityOther}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </section>
  );
};

export default BusinessMiscellaneousDescription; 