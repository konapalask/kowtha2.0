import { Card, Descriptions, Row, Col } from "antd";
import React from "react";

const ToGrossProfitDescription: React.FC<{
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
      <Card title="To Gross Profit" extra={extra}>
        <Row gutter={[16, 0]}>
          {/* Left side - All "To" fields */}
          <Col span={12}>
            <Descriptions
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item
                label="To Opening Stock"
                contentStyle={getItemStyle("toOpeningStock")}
              >
                {data?.toGrossProfit?.toOpeningStock || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Purchase"
                contentStyle={getItemStyle("toPurchase")}
              >
                {data?.toGrossProfit?.toPurchase || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Cost of Services"
                contentStyle={getItemStyle("toCostOfServices")}
              >
                {data?.toGrossProfit?.toCostOfServices || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Wages"
                contentStyle={getItemStyle("toWages")}
              >
                {data?.toGrossProfit?.toWages || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Hamali Charges"
                contentStyle={getItemStyle("toHamaliCharges")}
              >
                {data?.toGrossProfit?.toHamaliCharges || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Manufacturing Expenses"
                contentStyle={getItemStyle("toManufacturingExpenses")}
              >
                {data?.toGrossProfit?.toManufacturingExpenses || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="To Packing Charges"
                contentStyle={getItemStyle("toPackingCharges")}
              >
                {data?.toGrossProfit?.toPackingCharges || "-"}
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
                label="By Sales"
                contentStyle={getItemStyle("bySales")}
              >
                {data?.toGrossProfit?.bySales || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="By Services"
                contentStyle={getItemStyle("byServices")}
              >
                {data?.toGrossProfit?.byServices || "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label="By Closing Stock"
                contentStyle={getItemStyle("byClosingStock")}
              >
                {data?.toGrossProfit?.byClosingStock || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </section>
  );
};

export default ToGrossProfitDescription; 