import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col, Button, message, Typography } from "antd";
import { useRouter } from "next/router";
import { submitFinancialAnalysis } from "@/services/verifier.services";

const { Text } = Typography;

export type ToGrossProfitFormData = {
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
};

const ToGrossProfitForm: React.FC<{ form: any }> = ({ form }) => {
  const [calculatedGrossProfit, setCalculatedGrossProfit] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  // Watch form values for automatic calculation
  const formValues = Form.useWatch([], form);

  // Calculate gross profit whenever form values change
  useEffect(() => {
    if (formValues) {
      const calculateGrossProfit = () => {
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

        // Direct Expenses = Cost of Services + Wages + Hamali Charges + Manufacturing Expenses + Packing Charges
        const directExpenses = costOfServices + wages + hamaliCharges + manufacturingExpenses + packingCharges;

        // Gross Profit = (Sales + Services) - (Opening Stock + Purchases + Direct Expenses - Closing Stock)
        const grossProfit = (sales + services) - (openingStock + purchase + directExpenses - closingStock);

        setCalculatedGrossProfit(grossProfit);
      };

      calculateGrossProfit();
    }
  }, [formValues]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Prepare the financial analysis data
      const financialData = {
        openingStock: parseFloat(values.toOpeningStock) || 0,
        purchase: parseFloat(values.toPurchase) || 0,
        costOfServices: parseFloat(values.toCostOfServices) || 0,
        wages: parseFloat(values.toWages) || 0,
        hamaliCharges: parseFloat(values.toHamaliCharges) || 0,
        manufacturingExpenses: parseFloat(values.toManufacturingExpenses) || 0,
        packingCharges: parseFloat(values.toPackingCharges) || 0,
        sales: parseFloat(values.bySales) || 0,
        services: parseFloat(values.byServices) || 0,
        closingStock: parseFloat(values.byClosingStock) || 0,
        grossProfit: calculatedGrossProfit,
        netProfit: 0 // Will be calculated in the backend
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
                name="toOpeningStock"
                label="To Opening Stock"
              >
                <Input placeholder="Enter opening stock value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toPurchase"
                label="To Purchase"
              >
                <Input placeholder="Enter purchase value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toCostOfServices"
                label="To Cost of Services"
              >
                <Input placeholder="Enter cost of services" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toWages"
                label="To Wages"
              >
                <Input placeholder="Enter wages value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toHamaliCharges"
                label="To Hamali Charges"
              >
                <Input placeholder="Enter hamali charges" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toManufacturingExpenses"
                label="To Manufacturing Expenses"
              >
                <Input placeholder="Enter manufacturing expenses" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="toPackingCharges"
                label="To Packing Charges"
              >
                <Input placeholder="Enter packing charges" type="number" />
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
              >
                <Input placeholder="Enter sales value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="byServices"
                label="By Services"
              >
                <Input placeholder="Enter services value" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="byClosingStock"
                label="By Closing Stock"
              >
                <Input placeholder="Enter closing stock value" type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Calculated Gross Profit Display */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
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
      </Row>

      {/* Submit Button */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={handleSubmit}
            loading={loading}
            disabled={calculatedGrossProfit === 0}
            style={{
              background: "linear-gradient(90deg, #4facfe 0%, rgba(7, 220, 231, 0.69) 100%)",
              border: "none",
              borderRadius: "8px",
              height: "48px",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(79, 172, 254, 0.4)"
            }}
          >
            Submit Financial Analysis
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ToGrossProfitForm; 