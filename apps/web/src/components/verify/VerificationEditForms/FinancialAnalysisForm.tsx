import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col, Typography, Card } from "antd";

const { Text, Title } = Typography;

// Helper function to create non-negative validation rule
const createNonNegativeRule = (fieldName: string) => ({
  validator: (_: any, value: any) => {
    if (value === '' || value === undefined || value === null) return Promise.resolve();
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      return Promise.reject(new Error(`${fieldName} must be non-negative`));
    }
    return Promise.resolve();
  }
});

export type FinancialAnalysisFormData = {
  // Gross Profit fields
  toOpeningStock: string;
  toPurchase: string;
  toCostOfServices: string;
  toWages: string;
  toHamaliCharges: string;
  toManufacturingExpenses: string;
  toPackingCharges: string;
  bySales: string;
  byServices: string;
  byClosingStock: string;
  
  // Net Profit fields
  toSalaries: string;
  toRent: string;
  toElectricityCharges: string;
  toPrintingStationery: string;
  toTelephoneCharges: string;
  toPostageTelegram: string;
  toOfficeMaintenance: string;
  toRepairsMaintenance: string;
  toSadarExpenses: string;
  toAuditFee: string;
  toAdvertisement: string;
  toBankCharges: string;
  toInsurance: string;
  toDepreciation: string;
  toInterestOnLoan: string;
  byRentReceived: string;
  byCommissionReceived: string;
};

const FinancialAnalysisForm: React.FC<{ form: any }> = ({ form }) => {
  const [calculatedGrossProfit, setCalculatedGrossProfit] = useState<number>(0);
  const [calculatedNetProfit, setCalculatedNetProfit] = useState<number>(0);

  // Watch form values for automatic calculation
  const formValues = Form.useWatch([], form);

  // Calculate profits whenever form values change
  useEffect(() => {
    if (formValues) {
      const calculateProfits = () => {
        // Gross Profit Calculation
        const openingStock = parseFloat((formValues as any).toOpeningStock) || 0;
        const purchase = parseFloat((formValues as any).toPurchase) || 0;
        const costOfServices = parseFloat((formValues as any).toCostOfServices) || 0;
        const wages = parseFloat((formValues as any).toWages) || 0;
        const hamaliCharges = parseFloat((formValues as any).toHamaliCharges) || 0;
        const manufacturingExpenses = parseFloat((formValues as any).toManufacturingExpenses) || 0;
        const packingCharges = parseFloat((formValues as any).toPackingCharges) || 0;
        const sales = parseFloat((formValues as any).bySales) || 0;
        const services = parseFloat((formValues as any).byServices) || 0;
        const closingStock = parseFloat((formValues as any).byClosingStock) || 0;

        // Gross Profit = (Sales + Services + Closing Stock) - (Opening Stock + Purchases + Cost of Services + Wages + Hamali + Manufacturing + Packing)
        const grossProfit = (sales + services + closingStock) - (openingStock + purchase + costOfServices + wages + hamaliCharges + manufacturingExpenses + packingCharges);

        setCalculatedGrossProfit(grossProfit);

        // Net Profit Calculation
        const salaries = parseFloat((formValues as any).toSalaries) || 0;
        const rent = parseFloat((formValues as any).toRent) || 0;
        const electricityCharges = parseFloat((formValues as any).toElectricityCharges) || 0;
        const printingStationery = parseFloat((formValues as any).toPrintingStationery) || 0;
        const telephoneCharges = parseFloat((formValues as any).toTelephoneCharges) || 0;
        const postageTelegram = parseFloat((formValues as any).toPostageTelegram) || 0;
        const officeMaintenance = parseFloat((formValues as any).toOfficeMaintenance) || 0;
        const repairsMaintenance = parseFloat((formValues as any).toRepairsMaintenance) || 0;
        const sadarExpenses = parseFloat((formValues as any).toSadarExpenses) || 0;
        const auditFee = parseFloat((formValues as any).toAuditFee) || 0;
        const advertisement = parseFloat((formValues as any).toAdvertisement) || 0;
        const bankCharges = parseFloat((formValues as any).toBankCharges) || 0;
        const insurance = parseFloat((formValues as any).toInsurance) || 0;
        const depreciation = parseFloat((formValues as any).toDepreciation) || 0;
        const interestOnLoan = parseFloat((formValues as any).toInterestOnLoan) || 0;
        const rentReceived = parseFloat((formValues as any).byRentReceived) || 0;
        const commissionReceived = parseFloat((formValues as any).byCommissionReceived) || 0;

        // Indirect Expenses = All "To" fields in net profit section
        const indirectExpenses = salaries + rent + electricityCharges + printingStationery + 
          telephoneCharges + postageTelegram + officeMaintenance + repairsMaintenance + 
          sadarExpenses + auditFee + advertisement + bankCharges + insurance + 
          depreciation + interestOnLoan;

        // Other Incomes = Rent Received + Commission Received
        const otherIncomes = rentReceived + commissionReceived;

        // Net Profit = Gross Profit + Other Incomes - Indirect Expenses
        const netProfit = grossProfit + otherIncomes - indirectExpenses;

        setCalculatedNetProfit(netProfit);
      };

      calculateProfits();
    }
  }, [formValues]);

  // Note: This form is used within the edit modal, so submission is handled by the parent modal
  // The form values will be automatically passed to the modal's submit handler

  return (
    <div>
      {/* Gross Profit Section */}
      <Card title="To Gross Profit" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 0]}>
          {/* Left side - All "To" fields */}
          <Col span={12}>
            <Row gutter={[8, 0]}>
              <Col span={24}>
                <Form.Item
                  name="toOpeningStock"
                  label="To Opening Stock"
                  rules={[createNonNegativeRule('Opening Stock')]}
                >
                  <Input placeholder="Enter opening stock value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toPurchase"
                  label="To Purchase"
                  rules={[createNonNegativeRule('Purchase')]}
                >
                  <Input placeholder="Enter purchase value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toCostOfServices"
                  label="To Cost of Services"
                  rules={[createNonNegativeRule('Cost of Services')]}
                >
                  <Input placeholder="Enter cost of services" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toWages"
                  label="To Wages"
                  rules={[createNonNegativeRule('Wages')]}
                >
                  <Input placeholder="Enter wages value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toHamaliCharges"
                  label="To Hamali Charges"
                  rules={[createNonNegativeRule('Hamali Charges')]}
                >
                  <Input placeholder="Enter hamali charges" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toManufacturingExpenses"
                  label="To Manufacturing Expenses"
                  rules={[createNonNegativeRule('Manufacturing Expenses')]}
                >
                  <Input placeholder="Enter manufacturing expenses" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toPackingCharges"
                  label="To Packing Charges"
                  rules={[createNonNegativeRule('Packing Charges')]}
                >
                  <Input placeholder="Enter packing charges" type="number" min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          
          {/* Right side - All "By" fields */}
          <Col span={12}>
            <Row gutter={[8, 0]}>
              <Col span={24}>
                <Form.Item
                  name="bySales"
                  label="By Sales"
                  rules={[createNonNegativeRule('Sales')]}
                >
                  <Input placeholder="Enter sales value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="byServices"
                  label="By Services"
                  rules={[createNonNegativeRule('Services')]}
                >
                  <Input placeholder="Enter services value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="byClosingStock"
                  label="By Closing Stock"
                  rules={[createNonNegativeRule('Closing Stock')]}
                >
                  <Input placeholder="Enter closing stock value" type="number" min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Net Profit Section */}
      <Card title="To Net Profit" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 0]}>
          {/* Left side - All "To" fields */}
          <Col span={12}>
            <Row gutter={[8, 0]}>
              <Col span={24}>
                <Form.Item
                  name="toSalaries"
                  label="To Salaries"
                  rules={[createNonNegativeRule('Salaries')]}
                >
                  <Input placeholder="Enter salaries value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toRent"
                  label="To Rent"
                  rules={[createNonNegativeRule('Rent')]}
                >
                  <Input placeholder="Enter rent value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toElectricityCharges"
                  label="To Electricity Charges"
                  rules={[createNonNegativeRule('Electricity Charges')]}
                >
                  <Input placeholder="Enter electricity charges" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toPrintingStationery"
                  label="To Printing & Stationery"
                  rules={[createNonNegativeRule('Printing & Stationery')]}
                >
                  <Input placeholder="Enter printing & stationery value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toTelephoneCharges"
                  label="To Telephone Charges"
                  rules={[createNonNegativeRule('Telephone Charges')]}
                >
                  <Input placeholder="Enter telephone charges" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toPostageTelegram"
                  label="To Postage & Telegram"
                  rules={[createNonNegativeRule('Postage & Telegram')]}
                >
                  <Input placeholder="Enter postage & telegram value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toOfficeMaintenance"
                  label="To Office Maintenance"
                  rules={[createNonNegativeRule('Office Maintenance')]}
                >
                  <Input placeholder="Enter office maintenance value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toRepairsMaintenance"
                  label="To Repairs & Maintenance"
                  rules={[createNonNegativeRule('Repairs & Maintenance')]}
                >
                  <Input placeholder="Enter repairs & maintenance value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toSadarExpenses"
                  label="To Sadar Expenses"
                  rules={[createNonNegativeRule('Sadar Expenses')]}
                >
                  <Input placeholder="Enter sadar expenses" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toAuditFee"
                  label="To Audit Fee"
                  rules={[createNonNegativeRule('Audit Fee')]}
                >
                  <Input placeholder="Enter audit fee" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toAdvertisement"
                  label="To Advertisement"
                  rules={[createNonNegativeRule('Advertisement')]}
                >
                  <Input placeholder="Enter advertisement value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toBankCharges"
                  label="To Bank Charges"
                  rules={[createNonNegativeRule('Bank Charges')]}
                >
                  <Input placeholder="Enter bank charges" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toInsurance"
                  label="To Insurance"
                  rules={[createNonNegativeRule('Insurance')]}
                >
                  <Input placeholder="Enter insurance value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toDepreciation"
                  label="To Depreciation"
                  rules={[createNonNegativeRule('Depreciation')]}
                >
                  <Input placeholder="Enter depreciation value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="toInterestOnLoan"
                  label="To Interest on Loan"
                  rules={[createNonNegativeRule('Interest on Loan')]}
                >
                  <Input placeholder="Enter interest on loan" type="number" min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          
          {/* Right side - All "By" fields */}
          <Col span={12}>
            <Row gutter={[8, 0]}>
              <Col span={24}>
                <Form.Item
                  name="byRentReceived"
                  label="By Rent Received"
                  rules={[createNonNegativeRule('Rent Received')]}
                >
                  <Input placeholder="Enter rent received value" type="number" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="byCommissionReceived"
                  label="By Commission Received"
                  rules={[createNonNegativeRule('Commission Received')]}
                >
                  <Input placeholder="Enter commission received value" type="number" min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Calculated Results Display */}
      <Card title="Calculated Results" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ 
              padding: 16, 
              backgroundColor: '#f0f8ff', 
              border: '1px solid #d9d9d9', 
              borderRadius: 6,
              textAlign: 'center'
            }}>
              <Text strong>Calculated Gross Profit: ₹{calculatedGrossProfit.toLocaleString()}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ 
              padding: 16, 
              backgroundColor: '#f0f8ff', 
              border: '1px solid #d9d9d9', 
              borderRadius: 6,
              textAlign: 'center'
            }}>
              <Text strong>Calculated Net Profit: ₹{calculatedNetProfit.toLocaleString()}</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Note: Submission is handled by the parent edit modal */}
    </div>
  );
};

export default FinancialAnalysisForm; 