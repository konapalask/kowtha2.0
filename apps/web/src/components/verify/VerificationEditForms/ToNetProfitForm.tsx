import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col, Button, message, Typography } from "antd";
import { useRouter } from "next/router";
import { submitFinancialAnalysis } from "@/services/verifier.services";

const { Text } = Typography;

export type ToNetProfitFormData = {
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
  byGrossProfit: string;
  byRentReceived: string;
  byCommissionReceived: string;
};

const ToNetProfitForm: React.FC<{ form: any }> = ({ form }) => {
  const [calculatedNetProfit, setCalculatedNetProfit] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  // Watch form values for automatic calculation
  const formValues = Form.useWatch([], form);

  // Calculate net profit whenever form values change
  useEffect(() => {
    if (formValues) {
      const calculateNetProfit = () => {
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
        const grossProfit = parseFloat((formValues as any).byGrossProfit) || 0;
        const rentReceived = parseFloat((formValues as any).byRentReceived) || 0;
        const commissionReceived = parseFloat((formValues as any).byCommissionReceived) || 0;

        // Indirect Expenses = All "To" fields
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

      calculateNetProfit();
    }
  }, [formValues]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Prepare the financial analysis data
      const financialData = {
        salaries: parseFloat(values.toSalaries) || 0,
        rent: parseFloat(values.toRent) || 0,
        electricityCharges: parseFloat(values.toElectricityCharges) || 0,
        printingStationery: parseFloat(values.toPrintingStationery) || 0,
        telephoneCharges: parseFloat(values.toTelephoneCharges) || 0,
        postageTelegram: parseFloat(values.toPostageTelegram) || 0,
        officeMaintenance: parseFloat(values.toOfficeMaintenance) || 0,
        repairsMaintenance: parseFloat(values.toRepairsMaintenance) || 0,
        sadarExpenses: parseFloat(values.toSadarExpenses) || 0,
        auditFee: parseFloat(values.toAuditFee) || 0,
        advertisement: parseFloat(values.toAdvertisement) || 0,
        bankCharges: parseFloat(values.toBankCharges) || 0,
        insurance: parseFloat(values.toInsurance) || 0,
        depreciation: parseFloat(values.toDepreciation) || 0,
        interestOnLoan: parseFloat(values.toInterestOnLoan) || 0,
        rentReceived: parseFloat(values.byRentReceived) || 0,
        commissionReceived: parseFloat(values.byCommissionReceived) || 0,
        netProfit: calculatedNetProfit
      };

      // Call the financial analysis API
      await submitFinancialAnalysis(id as string, financialData);
      
      message.success("Financial analysis submitted successfully!");
    } catch (error) {
      console.error("Error submitting financial analysis:", error);
      message.error("Failed to submit financial analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row gutter={[16, 0]}>
        {/* Left side - All "To" fields */}
        <Col span={12}>
          <Row gutter={[8, 0]}>
            <Col span={24}>
              <Form.Item
                name="toSalaries"
                label="To Salaries"
              >
                <Input placeholder="Enter salaries value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toRent"
                label="To Rent"
              >
                <Input placeholder="Enter rent value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toElectricityCharges"
                label="To Electricity Charges"
              >
                <Input placeholder="Enter electricity charges" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toPrintingStationery"
                label="To Printing & Stationery"
              >
                <Input placeholder="Enter printing & stationery value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toTelephoneCharges"
                label="To Telephone Charges"
              >
                <Input placeholder="Enter telephone charges" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toPostageTelegram"
                label="To Postage & Telegram"
              >
                <Input placeholder="Enter postage & telegram value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toOfficeMaintenance"
                label="To Office Maintenance"
              >
                <Input placeholder="Enter office maintenance value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toRepairsMaintenance"
                label="To Repairs & Maintenance"
              >
                <Input placeholder="Enter repairs & maintenance value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toSadarExpenses"
                label="To Sadar Expenses"
              >
                <Input placeholder="Enter sadar expenses" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toAuditFee"
                label="To Audit Fee"
              >
                <Input placeholder="Enter audit fee" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toAdvertisement"
                label="To Advertisement"
              >
                <Input placeholder="Enter advertisement value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toBankCharges"
                label="To Bank Charges"
              >
                <Input placeholder="Enter bank charges" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toInsurance"
                label="To Insurance"
              >
                <Input placeholder="Enter insurance value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toDepreciation"
                label="To Depreciation"
              >
                <Input placeholder="Enter depreciation value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toInterestOnLoan"
                label="To Interest on Loan"
              >
                <Input placeholder="Enter interest on loan" type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        
        {/* Right side - All "By" fields */}
        <Col span={12}>
          <Row gutter={[8, 0]}>
            <Col span={24}>
              <Form.Item
                name="byGrossProfit"
                label="By Gross Profit"
              >
                <Input placeholder="Enter gross profit value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="byRentReceived"
                label="By Rent Received"
              >
                <Input placeholder="Enter rent received value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="byCommissionReceived"
                label="By Commission Received"
              >
                <Input placeholder="Enter commission received value" type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Calculated Net Profit Display */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
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

      {/* Submit Button */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={handleSubmit}
            loading={loading}
            disabled={calculatedNetProfit === 0}
          >
            Submit Financial Analysis
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ToNetProfitForm; 