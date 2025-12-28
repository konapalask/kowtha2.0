import React from "react";
import { Card, Button, Form, Input, Row, Col, Collapse } from "antd";
import Feedback from "./Feedback";
import FinalVerdict from "./FinalVerdict";

const { TextArea } = Input;

interface RightColumnProps {
  financialForm: any;
  calculatedGrossProfit: number;
  calculatedNetProfit: number;
  handleFinancialSubmit: () => Promise<void>;
  loading: boolean;
  verificationData: any;
  readOnly: boolean;
  verdict: string | null;
  setVerdict: (verdict: string | null) => void;
  editorContent: string;
  setEditorContent: (content: string) => void;
  handleSave: () => Promise<void>;
  currentDepartment?: string;
  hasEditRequest: boolean;
}

/**
 * RightColumn Component
 *
 * This component renders the right side of the BusinessVerificationDetails layout,
 * containing the Financial Analysis section and Final Verdict section.
 *
 * Features:
 * - Financial Analysis form with real-time profit calculations (PD department only)
 * - Final Verdict section with rich text editor
 * - Responsive layout with proper spacing
 * - Conditional rendering based on department type
 *
 * @param props - Component props
 * @returns JSX element containing the right column layout
 */
export const RightColumn: React.FC<RightColumnProps> = ({
  financialForm,
  calculatedGrossProfit,
  calculatedNetProfit,
  handleFinancialSubmit,
  loading,
  verificationData,
  readOnly,
  verdict,
  setVerdict,
  editorContent,
  setEditorContent,
  handleSave,
  currentDepartment,
  hasEditRequest,
}) => {
  console.log(verificationData);
  // Helper function to create non-negative validation rule
  const createNonNegativeRule = (fieldName: string) => ({
    validator: (_: any, value: any) => {
      if (value === "" || value === undefined || value === null)
        return Promise.resolve();
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        return Promise.reject(new Error(`${fieldName} must be non-negative`));
      }
      return Promise.resolve();
    },
  });

  return (
    <div>
      {/* Financial Analysis Section - Only for PD department */}
      {currentDepartment === "PD" && (
        <Card
          title="Financial Analysis"
          style={{ marginBottom: 16 }}
          //   extra={
          //     <Button
          //       type="primary"
          //       size="small"
          //       onClick={handleFinancialSubmit}
          //       loading={loading}
          //       disabled={readOnly || !!verificationData?.financialAnalysis}
          //       style={{
          //         background:
          //           loading || !!verificationData?.financialAnalysis
          //             ? "#9ca3af"
          //             : "#1e40af",
          //         border: "none",
          //         borderRadius: "6px",
          //         height: "32px",
          //         fontSize: "14px",
          //         fontWeight: "500",
          //         boxShadow:
          //           loading || !!verificationData?.financialAnalysis
          //             ? "none"
          //             : "0 2px 8px rgba(30, 64, 175, 0.3)",
          //         color: "#ffffff",
          //       }}
          //     >
          //       {loading
          //         ? "Submitting..."
          //         : !!verificationData?.financialAnalysis
          //           ? "Financial Analysis Already Submitted"
          //           : "Submit Financial Analysis"}
          //     </Button>
          //   }
        >
          <Form
            form={financialForm}
            layout="vertical"
            disabled={
              !!(
                verificationData?.financialAnalysis ||
                verificationData?.verificationData?.financialAnalysis
              )
            }
          >
            <Collapse
              defaultActiveKey={[]}
              items={[
                {
                  key: "grossProfit",
                  label: `To Gross Profit - ₹${calculatedGrossProfit.toLocaleString()}`,
                  children: (
                    <Row gutter={[16, 8]}>
                      {/* Left side - All "To" fields */}
                      <Col span={12}>
                        <Row gutter={[8, 8]}>
                          <Col span={24}>
                            <Form.Item
                              name="toOpeningStock"
                              label="To Opening Stock"
                              rules={[createNonNegativeRule("Opening Stock")]}
                            >
                              <Input
                                placeholder="Opening Stock"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toPurchase"
                              label="To Purchase"
                              rules={[createNonNegativeRule("Purchase")]}
                            >
                              <Input
                                placeholder="Purchase"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toCostOfServices"
                              label="To Cost of Services"
                              rules={[
                                createNonNegativeRule("Cost of Services"),
                              ]}
                            >
                              <Input
                                placeholder="Cost of Services"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toWages"
                              label="To Wages"
                              rules={[createNonNegativeRule("Wages")]}
                            >
                              <Input
                                placeholder="Wages"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toHamaliCharges"
                              label="To Hamali Charges"
                              rules={[createNonNegativeRule("Hamali Charges")]}
                            >
                              <Input
                                placeholder="Hamali Charges"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toManufacturingExpenses"
                              label="To Manufacturing Expenses"
                              rules={[
                                createNonNegativeRule("Manufacturing Expenses"),
                              ]}
                            >
                              <Input
                                placeholder="Manufacturing Expenses"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toPackingCharges"
                              label="To Packing Charges"
                              rules={[createNonNegativeRule("Packing Charges")]}
                            >
                              <Input
                                placeholder="Packing Charges"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      {/* Right side - All "By" fields */}
                      <Col span={12}>
                        <Row gutter={[8, 8]}>
                          <Col span={24}>
                            <Form.Item
                              name="bySales"
                              label="By Sales"
                              rules={[createNonNegativeRule("Sales")]}
                            >
                              <Input
                                placeholder="Sales"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="byServices"
                              label="By Services"
                              rules={[createNonNegativeRule("Services")]}
                            >
                              <Input
                                placeholder="Services"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="byClosingStock"
                              label="By Closing Stock"
                              rules={[createNonNegativeRule("Closing Stock")]}
                            >
                              <Input
                                placeholder="Closing Stock"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: "netProfit",
                  label: `To Net Profit - ₹${calculatedNetProfit.toLocaleString()}`,
                  children: (
                    <Row gutter={[16, 8]}>
                      {/* Left side - All "To" fields */}
                      <Col span={12}>
                        <Row gutter={[8, 8]}>
                          <Col span={24}>
                            <Form.Item
                              name="toSalaries"
                              label="To Salaries"
                              rules={[createNonNegativeRule("Salaries")]}
                            >
                              <Input
                                placeholder="Salaries"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toRent"
                              label="To Rent"
                              rules={[createNonNegativeRule("Rent")]}
                            >
                              <Input placeholder="Rent" type="number" min={0} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toElectricityCharges"
                              label="To Electricity Charges"
                              rules={[
                                createNonNegativeRule("Electricity Charges"),
                              ]}
                            >
                              <Input
                                placeholder="Electricity Charges"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toPrintingStationery"
                              label="To Printing & Stationery"
                              rules={[
                                createNonNegativeRule("Printing & Stationery"),
                              ]}
                            >
                              <Input
                                placeholder="Printing & Stationery"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toTelephoneCharges"
                              label="To Telephone Charges"
                              rules={[
                                createNonNegativeRule("Telephone Charges"),
                              ]}
                            >
                              <Input
                                placeholder="Telephone Charges"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toPostageTelegram"
                              label="To Postage & Telegram"
                              rules={[
                                createNonNegativeRule("Postage & Telegram"),
                              ]}
                            >
                              <Input
                                placeholder="Postage & Telegram"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toOfficeMaintenance"
                              label="To Office Maintenance"
                              rules={[
                                createNonNegativeRule("Office Maintenance"),
                              ]}
                            >
                              <Input
                                placeholder="Office Maintenance"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toRepairsMaintenance"
                              label="To Repairs & Maintenance"
                              rules={[
                                createNonNegativeRule("Repairs & Maintenance"),
                              ]}
                            >
                              <Input
                                placeholder="Repairs & Maintenance"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toSadarExpenses"
                              label="To Sadar Expenses"
                              rules={[createNonNegativeRule("Sadar Expenses")]}
                            >
                              <Input
                                placeholder="Sadar Expenses"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toAuditFee"
                              label="To Audit Fee"
                              rules={[createNonNegativeRule("Audit Fee")]}
                            >
                              <Input
                                placeholder="Audit Fee"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toAdvertisement"
                              label="To Advertisement"
                              rules={[createNonNegativeRule("Advertisement")]}
                            >
                              <Input
                                placeholder="Advertisement"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toBankCharges"
                              label="To Bank Charges"
                              rules={[createNonNegativeRule("Bank Charges")]}
                            >
                              <Input
                                placeholder="Bank Charges"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toInsurance"
                              label="To Insurance"
                              rules={[createNonNegativeRule("Insurance")]}
                            >
                              <Input
                                placeholder="Insurance"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toDepreciation"
                              label="To Depreciation"
                              rules={[createNonNegativeRule("Depreciation")]}
                            >
                              <Input
                                placeholder="Depreciation"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="toInterestOnLoan"
                              label="To Interest on Loan"
                              rules={[
                                createNonNegativeRule("Interest on Loan"),
                              ]}
                            >
                              <Input
                                placeholder="Interest on Loan"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      {/* Right side - All "By" fields */}
                      <Col span={12}>
                        <Row gutter={[8, 8]}>
                          <Col span={24}>
                            <Form.Item
                              name="byRentReceived"
                              label="By Rent Received"
                              rules={[createNonNegativeRule("Rent Received")]}
                            >
                              <Input
                                placeholder="Rent Received"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="byCommissionReceived"
                              label="By Commission Received"
                              rules={[
                                createNonNegativeRule("Commission Received"),
                              ]}
                            >
                              <Input
                                placeholder="Commission Received"
                                type="number"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ),
                },
              ]}
            />
          </Form>
        </Card>
      )}

      {/* Final Verdict Section */}
      {currentDepartment === "PD" ? (
        <Feedback
          disabled={hasEditRequest}
          verdict={verdict}
          setVerdict={setVerdict}
          editorContent={editorContent}
          setEditorContent={setEditorContent}
          handleSave={handleSave}
          verificationData={verificationData}
          currentDepartment={currentDepartment}
          hasEditRequest={hasEditRequest}
        />
      ) : (
        <FinalVerdict
          disabled={hasEditRequest}
          verdict={verdict}
          setVerdict={setVerdict}
          editorContent={editorContent}
          setEditorContent={setEditorContent}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};
