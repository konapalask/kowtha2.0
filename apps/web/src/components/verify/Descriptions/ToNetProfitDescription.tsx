import { Card, Descriptions, Row, Col } from "antd";
import React from "react";

const ToNetProfitDescription: React.FC<{
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
      <Card title="To Net Profit" extra={extra}>
        <Row gutter={[16, 0]}>
          {/* Left side - All "To" fields */}
          <Col span={12}>
            <Descriptions
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item
                label="To Salaries"
                contentStyle={getItemStyle("toSalaries")}
              >
                {data?.toNetProfit?.toSalaries || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Rent"
                contentStyle={getItemStyle("toRent")}
              >
                {data?.toNetProfit?.toRent || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Electricity Charges"
                contentStyle={getItemStyle("toElectricityCharges")}
              >
                {data?.toNetProfit?.toElectricityCharges || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Printing & Stationery"
                contentStyle={getItemStyle("toPrintingStationery")}
              >
                {data?.toNetProfit?.toPrintingStationery || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Telephone Charges"
                contentStyle={getItemStyle("toTelephoneCharges")}
              >
                {data?.toNetProfit?.toTelephoneCharges || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Postage & Telegram"
                contentStyle={getItemStyle("toPostageTelegram")}
              >
                {data?.toNetProfit?.toPostageTelegram || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Office Maintenance"
                contentStyle={getItemStyle("toOfficeMaintenance")}
              >
                {data?.toNetProfit?.toOfficeMaintenance || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Repairs & Maintenance"
                contentStyle={getItemStyle("toRepairsMaintenance")}
              >
                {data?.toNetProfit?.toRepairsMaintenance || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Sadar Expenses"
                contentStyle={getItemStyle("toSadarExpenses")}
              >
                {data?.toNetProfit?.toSadarExpenses || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Audit Fee"
                contentStyle={getItemStyle("toAuditFee")}
              >
                {data?.toNetProfit?.toAuditFee || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Advertisement"
                contentStyle={getItemStyle("toAdvertisement")}
              >
                {data?.toNetProfit?.toAdvertisement || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Bank Charges"
                contentStyle={getItemStyle("toBankCharges")}
              >
                {data?.toNetProfit?.toBankCharges || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Insurance"
                contentStyle={getItemStyle("toInsurance")}
              >
                {data?.toNetProfit?.toInsurance || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Depreciation"
                contentStyle={getItemStyle("toDepreciation")}
              >
                {data?.toNetProfit?.toDepreciation || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Interest on Loan"
                contentStyle={getItemStyle("toInterestOnLoan")}
              >
                {data?.toNetProfit?.toInterestOnLoan || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          
          {/* Right side - All "By" fields */}
          <Col span={12}>
            <Descriptions
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item
                label="By Gross Profit"
                contentStyle={getItemStyle("byGrossProfit")}
              >
                {data?.toNetProfit?.byGrossProfit || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="By Rent Received"
                contentStyle={getItemStyle("byRentReceived")}
              >
                {data?.toNetProfit?.byRentReceived || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="By Commission Received"
                contentStyle={getItemStyle("byCommissionReceived")}
              >
                {data?.toNetProfit?.byCommissionReceived || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </section>
  );
};

export default ToNetProfitDescription; 