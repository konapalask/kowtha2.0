import React from "react";
import { Form, Input, Row, Col } from "antd";

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
  return (
    <Row gutter={[16, 0]}>
      {/* Left side - All "To" fields */}
      <Col span={12}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="toSalaries"
              label="To Salaries"
            >
              <Input placeholder="Enter salaries value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toRent"
              label="To Rent"
            >
              <Input placeholder="Enter rent value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toElectricityCharges"
              label="To Electricity Charges"
            >
              <Input placeholder="Enter electricity charges" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toPrintingStationery"
              label="To Printing & Stationery"
            >
              <Input placeholder="Enter printing & stationery value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toTelephoneCharges"
              label="To Telephone Charges"
            >
              <Input placeholder="Enter telephone charges" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toPostageTelegram"
              label="To Postage & Telegram"
            >
              <Input placeholder="Enter postage & telegram value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toOfficeMaintenance"
              label="To Office Maintenance"
            >
              <Input placeholder="Enter office maintenance value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toRepairsMaintenance"
              label="To Repairs & Maintenance"
            >
              <Input placeholder="Enter repairs & maintenance value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toSadarExpenses"
              label="To Sadar Expenses"
            >
              <Input placeholder="Enter sadar expenses" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toAuditFee"
              label="To Audit Fee"
            >
              <Input placeholder="Enter audit fee" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toAdvertisement"
              label="To Advertisement"
            >
              <Input placeholder="Enter advertisement value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toBankCharges"
              label="To Bank Charges"
            >
              <Input placeholder="Enter bank charges" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toInsurance"
              label="To Insurance"
            >
              <Input placeholder="Enter insurance value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toDepreciation"
              label="To Depreciation"
            >
              <Input placeholder="Enter depreciation value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="toInterestOnLoan"
              label="To Interest on Loan"
            >
              <Input placeholder="Enter interest on loan" />
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
              <Input placeholder="Enter gross profit value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="byRentReceived"
              label="By Rent Received"
            >
              <Input placeholder="Enter rent received value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="byCommissionReceived"
              label="By Commission Received"
            >
              <Input placeholder="Enter commission received value" />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ToNetProfitForm; 