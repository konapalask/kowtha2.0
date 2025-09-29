import React from "react";
import { Form, Input, Select, Button, Space, Table, Card } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

// Basic Details Edit Form
export const TataUBLBasicDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Form.Item
        label="Name of Applicant"
        name={["basicDetails", "nameOfApplicant"]}
        rules={[{ required: true, message: "Please enter applicant name" }]}
      >
        <Input placeholder="Enter applicant name" />
      </Form.Item>
      <Form.Item
        label="Name of Entity"
        name={["basicDetails", "nameOfEntity"]}
        rules={[{ required: true, message: "Please enter entity name" }]}
      >
        <Input placeholder="Enter entity name" />
      </Form.Item>
      <Form.Item
        label="Name of Co-Applicants"
        name={["basicDetails", "nameOfCoApplicants"]}
      >
        <Input placeholder="Enter co-applicant names" />
      </Form.Item>
      <Form.Item
        label="Phone No"
        name={["basicDetails", "phoneNo"]}
        rules={[{ required: true, message: "Please enter phone number" }]}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>
      <Form.Item
        label="Initiated Address"
        name={["basicDetails", "initiatedAddress"]}
        rules={[{ required: true, message: "Please enter initiated address" }]}
      >
        <TextArea rows={3} placeholder="Enter initiated address" />
      </Form.Item>
    </>
  );
};

// Proposed Loan Details Edit Form
export const TataUBLProposedLoanDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Form.Item
        label="Product"
        name={["proposedLoanDetails", "product"]}
        rules={[{ required: true, message: "Please enter product" }]}
      >
        <Input placeholder="Enter product" />
      </Form.Item>
      <Form.Item
        label="Amount"
        name={["proposedLoanDetails", "amount"]}
        rules={[{ required: true, message: "Please enter amount" }]}
      >
        <Input placeholder="Enter amount" />
      </Form.Item>
      <Form.Item
        label="Tenure"
        name={["proposedLoanDetails", "tenure"]}
        rules={[{ required: true, message: "Please enter tenure" }]}
      >
        <Input placeholder="Enter tenure" />
      </Form.Item>
      <Form.Item
        label="Repayment From"
        name={["proposedLoanDetails", "repaymentFrom"]}
        rules={[{ required: true, message: "Please enter repayment from" }]}
      >
        <Input placeholder="Enter repayment from date" />
      </Form.Item>
      <Form.Item
        label="Bank Name"
        name={["proposedLoanDetails", "bankName"]}
        rules={[{ required: true, message: "Please enter bank name" }]}
      >
        <Input placeholder="Enter bank name" />
      </Form.Item>
      <Form.Item
        label="Type"
        name={["proposedLoanDetails", "type"]}
        rules={[{ required: true, message: "Please enter type" }]}
      >
        <Input placeholder="Enter type" />
      </Form.Item>
      <Form.Item
        label="Account Number"
        name={["proposedLoanDetails", "accNo"]}
        rules={[{ required: true, message: "Please enter account number" }]}
      >
        <Input placeholder="Enter account number" />
      </Form.Item>
    </>
  );
};

// Office Address Edit Form
export const TataUBLOfficeAddressEdit: React.FC<{ form: any }> = ({ form }) => {
  const ownershipOptions = ["Rented", "Owned", "Leased"];
  
  return (
    <>
      <Form.Item
        label="Address"
        name={["officeAddress", "address"]}
        rules={[{ required: true, message: "Please enter address" }]}
      >
        <TextArea rows={3} placeholder="Enter office address" />
      </Form.Item>
      <Form.Item
        label="Ownership of Premises"
        name={["officeAddress", "ownershipOfPremises"]}
        rules={[{ required: true, message: "Please select ownership" }]}
      >
        <Select placeholder="Select ownership">
          {ownershipOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Owned By"
        name={["officeAddress", "ownedBy"]}
      >
        <Input placeholder="Enter owned by" />
      </Form.Item>
      <Form.Item
        label="Area in Sq Ft"
        name={["officeAddress", "areaInSqFt"]}
        rules={[{ required: true, message: "Please enter area" }]}
      >
        <Input placeholder="Enter area in sq ft" />
      </Form.Item>
      <Form.Item
        label="Occupied Since Years"
        name={["officeAddress", "occupiedSinceYears"]}
        rules={[{ required: true, message: "Please enter occupied since years" }]}
      >
        <Input placeholder="Enter occupied since years" />
      </Form.Item>
      <Form.Item
        label="CMV/Rent per Month"
        name={["officeAddress", "cmvRentPerMonth"]}
        rules={[{ required: true, message: "Please enter CMV/rent per month" }]}
      >
        <Input placeholder="Enter CMV/rent per month" />
      </Form.Item>
    </>
  );
};

// Residential Address Edit Form
export const TataUBLResidentialAddressEdit: React.FC<{ form: any }> = ({ form }) => {
  const ownershipOptions = ["Rented", "Owned", "Leased"];
  
  return (
    <>
      <Form.Item
        label="Address"
        name={["residentialAddress", "address"]}
        rules={[{ required: true, message: "Please enter address" }]}
      >
        <TextArea rows={3} placeholder="Enter residential address" />
      </Form.Item>
      <Form.Item
        label="Ownership of Premises"
        name={["residentialAddress", "ownershipOfPremises"]}
        rules={[{ required: true, message: "Please select ownership" }]}
      >
        <Select placeholder="Select ownership">
          {ownershipOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Owned By"
        name={["residentialAddress", "ownedBy"]}
      >
        <Input placeholder="Enter owned by" />
      </Form.Item>
      <Form.Item
        label="Area in Sq Ft"
        name={["residentialAddress", "areaInSqFt"]}
        rules={[{ required: true, message: "Please enter area" }]}
      >
        <Input placeholder="Enter area in sq ft" />
      </Form.Item>
      <Form.Item
        label="Occupied Since Years"
        name={["residentialAddress", "occupiedSinceValues"]}
        rules={[{ required: true, message: "Please enter occupied since years" }]}
      >
        <Input placeholder="Enter occupied since years" />
      </Form.Item>
      <Form.Item
        label="CMV/Rent per Month"
        name={["residentialAddress", "cmvRentPerMonth"]}
        rules={[{ required: true, message: "Please enter CMV/rent per month" }]}
      >
        <Input placeholder="Enter CMV/rent per month" />
      </Form.Item>
      <Form.Item
        label="Address of PD"
        name={["residentialAddress", "addressOfPD"]}
      >
        <TextArea rows={2} placeholder="Enter address of PD" />
      </Form.Item>
      <Form.Item
        label="Person Met"
        name={["residentialAddress", "personMet"]}
      >
        <Input placeholder="Enter person met" />
      </Form.Item>
    </>
  );
};

// Business Details Edit Form
export const TataUBLBusinessDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Form.Item
        label="Current Business Details"
        name={["businessDetails", "currentBusinessDetails"]}
        rules={[{ required: true, message: "Please enter business details" }]}
      >
        <TextArea rows={4} placeholder="Enter current business details" />
      </Form.Item>
      <Form.Item
        label="Stock as on Date"
        name={["businessDetails", "stockAsOnDate"]}
        rules={[{ required: true, message: "Please enter stock date" }]}
      >
        <Input placeholder="Enter stock as on date" />
      </Form.Item>
    </>
  );
};

// Employee Details Edit Form
export const TataUBLEmployeeDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Form.Item
        label="Current Employees"
        name={["employeeDetails", "currentEmployees"]}
        rules={[{ required: true, message: "Please enter current employees" }]}
      >
        <Input placeholder="Enter number of current employees" />
      </Form.Item>
      <Form.Item
        label="Salary Range"
        name={["employeeDetails", "salaryRange"]}
        rules={[{ required: true, message: "Please enter salary range" }]}
      >
        <Input placeholder="Enter salary range" />
      </Form.Item>
      <Form.Item
        label="Key Employee Name"
        name={["employeeDetails", "keyEmployeeName"]}
        rules={[{ required: true, message: "Please enter key employee name" }]}
      >
        <Input placeholder="Enter key employee name" />
      </Form.Item>
    </>
  );
};

// Bank Details Edit Form
export const TataUBLBankDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Form.Item
        label="Primary Banker"
        name={["bankDetails", "primaryBanker"]}
        rules={[{ required: true, message: "Please enter primary banker" }]}
      >
        <Input placeholder="Enter primary banker" />
      </Form.Item>
      <Form.Item
        label="Nature of Account"
        name={["bankDetails", "natureOfAccount"]}
        rules={[{ required: true, message: "Please enter nature of account" }]}
      >
        <Input placeholder="Enter nature of account" />
      </Form.Item>
      <Form.Item
        label="Average Balance"
        name={["bankDetails", "avgBalance"]}
        rules={[{ required: true, message: "Please enter average balance" }]}
      >
        <Input placeholder="Enter average balance" />
      </Form.Item>
    </>
  );
};

// Sales & Profit Details Edit Form
export const TataUBLSalesAndProfitDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  const yesNoOptions = ["Yes", "No"];
  
  return (
    <>
      <Form.Item
        label="Turnover Previous Fiscal Year"
        name={["salesAndProfitDetails", "turnoverPrevFiscalYear"]}
        rules={[{ required: true, message: "Please enter turnover" }]}
      >
        <Input placeholder="Enter turnover previous fiscal year" />
      </Form.Item>
      <Form.Item
        label="Expected Turnover Current Fiscal Year"
        name={["salesAndProfitDetails", "expectedTurnoverCurrentFiscalYear"]}
        rules={[{ required: true, message: "Please enter expected turnover" }]}
      >
        <Input placeholder="Enter expected turnover current fiscal year" />
      </Form.Item>
      <Form.Item
        label="Monthly Turnover/Sales"
        name={["salesAndProfitDetails", "monthlyTurnoverSales"]}
        rules={[{ required: true, message: "Please enter monthly turnover" }]}
      >
        <Input placeholder="Enter monthly turnover/sales" />
      </Form.Item>
      <Form.Item
        label="Net Monthly Income"
        name={["salesAndProfitDetails", "netMonthlyIncome"]}
        rules={[{ required: true, message: "Please enter net monthly income" }]}
      >
        <Input placeholder="Enter net monthly income" />
      </Form.Item>
      <Form.Item
        label="Profit Margin"
        name={["salesAndProfitDetails", "profitMargin"]}
        rules={[{ required: true, message: "Please enter profit margin" }]}
      >
        <Input placeholder="Enter profit margin" />
      </Form.Item>
      <Form.Item
        label="COVID Effect on Turnover"
        name={["salesAndProfitDetails", "covidEffectOnTurnover"]}
        rules={[{ required: true, message: "Please select COVID effect" }]}
      >
        <Select placeholder="Select COVID effect on turnover">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Business Running Same Speed After Lockdown"
        name={["salesAndProfitDetails", "businessRunningSameSpeedAfterLockdown"]}
        rules={[{ required: true, message: "Please select business speed" }]}
      >
        <Select placeholder="Select business running same speed">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Cash Sales Percentage"
        name={["salesAndProfitDetails", "cashSalesPercentage"]}
        rules={[{ required: true, message: "Please enter cash sales percentage" }]}
      >
        <Input placeholder="Enter cash sales percentage" />
      </Form.Item>
    </>
  );
};

// Customers Details Edit Form
export const TataUBLCustomersDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Form.Item
        label="Total Debtors as on Date"
        name={["customersDetails", "totalDebtorsAsOnDate"]}
        rules={[{ required: true, message: "Please enter total debtors" }]}
      >
        <Input placeholder="Enter total debtors as on date" />
      </Form.Item>
      <Form.Item
        label="Total Customers"
        name={["customersDetails", "totalCustomers"]}
        rules={[{ required: true, message: "Please enter total customers" }]}
      >
        <Input placeholder="Enter total customers" />
      </Form.Item>
      <Form.List name={["customersDetails", "customers"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                title={`Customer ${name + 1}`}
                size="small"
                extra={
                  <Button
                    type="link"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
                style={{ marginBottom: 16 }}
              >
                <Form.Item
                  {...restField}
                  name={[name, "customerName"]}
                  label="Customer Name"
                  rules={[{ required: true, message: "Please enter customer name" }]}
                >
                  <Input placeholder="Enter customer name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "percentageOfTotalSales"]}
                  label="Percentage of Total Sales"
                  rules={[{ required: true, message: "Please enter percentage" }]}
                >
                  <Input placeholder="Enter percentage of total sales" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "debtorDays"]}
                  label="Debtor Days"
                  rules={[{ required: true, message: "Please enter debtor days" }]}
                >
                  <Input placeholder="Enter debtor days" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "relationshipSinceYears"]}
                  label="Relationship Since Years"
                  rules={[{ required: true, message: "Please enter relationship years" }]}
                >
                  <Input placeholder="Enter relationship since years" />
                </Form.Item>
              </Card>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Customer
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
};

// Supplier Details Edit Form
export const TataUBLSupplierDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Form.Item
        label="Total Creditors as on Date"
        name={["supplierDetails", "totalCreditorsAsOnDate"]}
        rules={[{ required: true, message: "Please enter total creditors" }]}
      >
        <Input placeholder="Enter total creditors as on date" />
      </Form.Item>
      <Form.Item
        label="Total Suppliers"
        name={["supplierDetails", "totalSuppliers"]}
        rules={[{ required: true, message: "Please enter total suppliers" }]}
      >
        <Input placeholder="Enter total suppliers" />
      </Form.Item>
      <Form.List name={["supplierDetails", "suppliers"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                title={`Supplier ${name + 1}`}
                size="small"
                extra={
                  <Button
                    type="link"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
                style={{ marginBottom: 16 }}
              >
                <Form.Item
                  {...restField}
                  name={[name, "supplierName"]}
                  label="Supplier Name"
                  rules={[{ required: true, message: "Please enter supplier name" }]}
                >
                  <Input placeholder="Enter supplier name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "percentageOfTotalSales"]}
                  label="Percentage of Total Sales"
                  rules={[{ required: true, message: "Please enter percentage" }]}
                >
                  <Input placeholder="Enter percentage of total sales" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "creditorDays"]}
                  label="Creditor Days"
                  rules={[{ required: true, message: "Please enter creditor days" }]}
                >
                  <Input placeholder="Enter creditor days" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "relationshipSinceYears"]}
                  label="Relationship Since Years"
                  rules={[{ required: true, message: "Please enter relationship years" }]}
                >
                  <Input placeholder="Enter relationship since years" />
                </Form.Item>
              </Card>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Supplier
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
};

// Additional Business Details Edit Form
export const TataUBLAdditionalBusinessDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Form.Item
        label="Other Business / Income Details"
        name={["additionalBusinessDetails", "otherBusinessIncomeDetails"]}
        rules={[{ required: true, message: "Please enter other business details" }]}
      >
        <TextArea rows={3} placeholder="Enter other business/income details" />
      </Form.Item>
      <Form.Item
        label="Assets"
        name={["additionalBusinessDetails", "assets"]}
        rules={[{ required: true, message: "Please enter assets" }]}
      >
        <TextArea rows={3} placeholder="Enter assets" />
      </Form.Item>
      <Form.Item
        label="Liabilities"
        name={["additionalBusinessDetails", "liabilities"]}
        rules={[{ required: true, message: "Please enter liabilities" }]}
      >
        <TextArea rows={3} placeholder="Enter liabilities" />
      </Form.Item>
    </>
  );
};

// Miscellaneous Details Edit Form
export const TataUBLMiscellaneousDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Form.Item
        label="End Use of Proposed Loan"
        name={["miscelleanousDetails", "endUseOfProposedLoan"]}
        rules={[{ required: true, message: "Please enter end use of loan" }]}
      >
        <TextArea rows={3} placeholder="Enter end use of proposed loan" />
      </Form.Item>
      <Form.Item
        label="Political Connections"
        name={["miscelleanousDetails", "politicalConnections"]}
        rules={[{ required: true, message: "Please enter political connections" }]}
      >
        <TextArea rows={2} placeholder="Enter political connections" />
      </Form.Item>
      <Form.Item
        label="Any Court Cases"
        name={["miscelleanousDetails", "anyCourtCases"]}
        rules={[{ required: true, message: "Please enter court cases info" }]}
      >
        <TextArea rows={2} placeholder="Enter any court cases" />
      </Form.Item>
      <Form.Item
        label="Business Belongs to Which Industry"
        name={["miscelleanousDetails", "businessBelongsToWhichIndustry"]}
        rules={[{ required: true, message: "Please enter industry" }]}
      >
        <Input placeholder="Enter business industry" />
      </Form.Item>
    </>
  );
};

// Value Added Details Edit Form
export const TataUBLValueAddedDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  const yesNoOptions = ["Yes", "No"];
  const localityOptions = ["Slum", "Market Road", "Main Road", "Highway"];
  
  return (
    <>
      <Form.Item
        label="Customer Behaviour"
        name={["valueAddedDetails", "customerBehaviour"]}
        rules={[{ required: true, message: "Please enter customer behaviour" }]}
      >
        <Input placeholder="Enter customer behaviour" />
      </Form.Item>
      <Form.Item
        label="Salaries Paid During COVID"
        name={["valueAddedDetails", "salariesPaidDuringCovid"]}
        rules={[{ required: true, message: "Please select salaries paid" }]}
      >
        <Select placeholder="Select salaries paid during COVID">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Digital Wallet Used"
        name={["valueAddedDetails", "digitalWalletUsed"]}
        rules={[{ required: true, message: "Please select digital wallet used" }]}
      >
        <Select placeholder="Select digital wallet used">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Nature of Neighborhood Shops"
        name={["valueAddedDetails", "natureOfNeighborhoodShops"]}
        rules={[{ required: true, message: "Please enter neighborhood shops" }]}
      >
        <Input placeholder="Enter nature of neighborhood shops" />
      </Form.Item>
      <Form.Item
        label="Customer Shop/Office Locality"
        name={["valueAddedDetails", "customerShopOfficeLocality"]}
        rules={[{ required: true, message: "Please select locality" }]}
      >
        <Select placeholder="Select customer shop/office locality">
          {localityOptions.map(option => (
            <Option key={option} value={option.toLowerCase().replace(' ', '_')}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Nearby Transport Stand"
        name={["valueAddedDetails", "nearbyTransportStand"]}
        rules={[{ required: true, message: "Please enter transport stand" }]}
      >
        <Input placeholder="Enter nearby transport stand" />
      </Form.Item>
      <Form.Item
        label="Utility Bill Units Consumption"
        name={["valueAddedDetails", "utilityBillUnitsConsumption"]}
        rules={[{ required: true, message: "Please select utility consumption" }]}
      >
        <Select placeholder="Select utility bill units consumption">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Loss Suffered in Business"
        name={["valueAddedDetails", "lossSufferedInBusiness"]}
        rules={[{ required: true, message: "Please select loss suffered" }]}
      >
        <Select placeholder="Select loss suffered in business">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Loss Reason"
        name={["valueAddedDetails", "lossReason"]}
        rules={[{ required: true, message: "Please enter loss reason" }]}
      >
        <TextArea rows={2} placeholder="Enter loss reason" />
      </Form.Item>
      <Form.Item
        label="Strengths"
        name={["valueAddedDetails", "strengths"]}
        rules={[{ required: true, message: "Please enter strengths" }]}
      >
        <TextArea rows={2} placeholder="Enter strengths" />
      </Form.Item>
      <Form.Item
        label="Weaknesses"
        name={["valueAddedDetails", "weaknesses"]}
        rules={[{ required: true, message: "Please enter weaknesses" }]}
      >
        <TextArea rows={2} placeholder="Enter weaknesses" />
      </Form.Item>
    </>
  );
};

// Site Visit Details Edit Form
export const TataUBLSiteVisitDetailsEdit: React.FC<{ form: any }> = ({ form }) => {
  const yesNoOptions = ["Yes", "No"];
  
  return (
    <>
      <Form.Item
        label="Nameplate Displayed"
        name={["siteVisitDetails", "nameplateDisplayed"]}
        rules={[{ required: true, message: "Please select nameplate displayed" }]}
      >
        <Select placeholder="Select nameplate displayed">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Office Well Furnished"
        name={["siteVisitDetails", "officeWellFurnished"]}
        rules={[{ required: true, message: "Please select office furnished" }]}
      >
        <Select placeholder="Select office well furnished">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Business Activity Seen"
        name={["siteVisitDetails", "businessActivitySeen"]}
        rules={[{ required: true, message: "Please select business activity seen" }]}
      >
        <Select placeholder="Select business activity seen">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Difficulty in Locating Premises"
        name={["siteVisitDetails", "difficultyInLocatingPremises"]}
        rules={[{ required: true, message: "Please select difficulty in locating" }]}
      >
        <Select placeholder="Select difficulty in locating premises">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Neighborhood"
        name={["siteVisitDetails", "neighborhood"]}
        rules={[{ required: true, message: "Please enter neighborhood" }]}
      >
        <TextArea rows={2} placeholder="Enter neighborhood details" />
      </Form.Item>
      <Form.Item
        label="Landmark"
        name={["siteVisitDetails", "landmark"]}
        rules={[{ required: true, message: "Please enter landmark" }]}
      >
        <Input placeholder="Enter landmark" />
      </Form.Item>
      <Form.Item
        label="Abnormal Increase/Decrease in Turnover"
        name={["siteVisitDetails", "abnormalIncreaseDecreaseInTurnover"]}
        rules={[{ required: true, message: "Please enter turnover changes" }]}
      >
        <TextArea rows={2} placeholder="Enter abnormal increase/decrease in turnover" />
      </Form.Item>
      <Form.Item
        label="Any Decrease in Networth"
        name={["siteVisitDetails", "anyDecreaseInNetworth"]}
        rules={[{ required: true, message: "Please select decrease in networth" }]}
      >
        <Select placeholder="Select any decrease in networth">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Stock Seen During PD"
        name={["siteVisitDetails", "stockSeenDuringPD"]}
        rules={[{ required: true, message: "Please select stock seen" }]}
      >
        <Select placeholder="Select stock seen during PD">
          {yesNoOptions.map(option => (
            <Option key={option} value={option.toLowerCase()}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="No. of Employees Seen During PD"
        name={["siteVisitDetails", "noOfEmployeesSeenDuringPD"]}
        rules={[{ required: true, message: "Please enter employees seen" }]}
      >
        <Input placeholder="Enter number of employees seen during PD" />
      </Form.Item>
      <Form.Item
        label="No. of Customers Seen During PD"
        name={["siteVisitDetails", "noOfCustomersSeenDuringPD"]}
        rules={[{ required: true, message: "Please enter customers seen" }]}
      >
        <Input placeholder="Enter number of customers seen during PD" />
      </Form.Item>
    </>
  );
}; 