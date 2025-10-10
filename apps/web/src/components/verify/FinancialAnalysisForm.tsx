import React from "react";
import { Form, InputNumber, Card, Row, Col, Typography } from "antd";

const { Title } = Typography;

interface FinancialAnalysisFormProps {
  form: any;
  onValuesChange?: (changedValues: any, allValues: any) => void;
  readOnly?: boolean;
}

/**
 * Generic Financial Analysis Form Component
 * Works for all banks - used by verifiers to add financial analysis
 */
export const FinancialAnalysisForm: React.FC<FinancialAnalysisFormProps> = ({
  form,
  onValuesChange,
  readOnly = false,
}) => {
  const financialFields = [
    { name: "openingStock", label: "Opening Stock" },
    { name: "purchase", label: "Purchase" },
    { name: "costOfServices", label: "Cost of Services" },
    { name: "wages", label: "Wages" },
    { name: "hamaliCharges", label: "Hamali Charges" },
    { name: "manufacturingExpenses", label: "Manufacturing Expenses" },
    { name: "packingCharges", label: "Packing Charges" },
    { name: "sales", label: "Sales" },
    { name: "services", label: "Services" },
    { name: "closingStock", label: "Closing Stock" },
    { name: "salaries", label: "Salaries" },
    { name: "rent", label: "Rent" },
    { name: "electricityCharges", label: "Electricity Charges" },
    { name: "printingStationery", label: "Printing & Stationery" },
    { name: "telephoneCharges", label: "Telephone Charges" },
    { name: "postageTelegram", label: "Postage & Telegram" },
    { name: "officeMaintenance", label: "Office Maintenance" },
    { name: "repairsMaintenance", label: "Repairs & Maintenance" },
    { name: "sadarExpenses", label: "Sadar Expenses" },
    { name: "auditFee", label: "Audit Fee" },
    { name: "advertisement", label: "Advertisement" },
    { name: "bankCharges", label: "Bank Charges" },
    { name: "insurance", label: "Insurance" },
    { name: "depreciation", label: "Depreciation" },
    { name: "interestOnLoan", label: "Interest On Loan" },
    { name: "rentReceived", label: "Rent Received" },
    { name: "commissionReceived", label: "Commission Received" },
    { name: "netProfit", label: "Net Profit" },
    { name: "grossProfit", label: "Gross Profit" },
  ];

  return (
    <Card
      title={<Title level={4}>Financial Analysis</Title>}
      style={{ marginTop: 16 }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={onValuesChange}
        disabled={readOnly}
      >
        <Row gutter={[16, 16]}>
          {financialFields.map((field) => (
            <Col span={12} key={field.name}>
              <Form.Item name={field.name} label={field.label}>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={`Enter ${field.label}`}
                  min={0}
                  precision={2}
                  formatter={(value) =>
                    `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    (value
                      ? parseFloat(value.replace(/₹\s?|(,*)/g, ""))
                      : 0) as any
                  }
                />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Card>
  );
};
