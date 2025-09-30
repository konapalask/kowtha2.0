import { useTabContext } from "@/pages/verify/[id]";
import {
  EditOutlined,
} from "@ant-design/icons";
import { Button, Card, Image, Table, Row, Col, Descriptions, Typography, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// Removed unused description component imports - using custom displays instead

// Import bank configuration system
import { 
  getBankConfig, 
  transformApiResponse, 
  shouldShowSection, 
  getSectionOrder,
  isAxisBank 
} from "./bankConfigs";

interface AxisBankVerificationDetailsProps {
  verificationData: any;
  onEdit: (formKey: string) => void;
  editLogsUpdated: number;
  verificationId: string;
  fetchEditRequests: () => void;
  hasEditRequest: boolean;
  completeVerificationData: any;
  fetchVerificationData: any;
  editRequests?: any[];
  currentDepartment?: string;
  applicationNumber?: string;
  loanId?: number;
}

export const AxisBankVerificationDetails: React.FC<
  AxisBankVerificationDetailsProps
> = ({
  verificationData,
  onEdit,
  editLogsUpdated,
  verificationId,
  fetchEditRequests,
  hasEditRequest,
  completeVerificationData,
  fetchVerificationData,
  editRequests,
  currentDepartment,
  applicationNumber,
  loanId
}) => {
  const bankName = completeVerificationData?.bankName || 'Axis Bank';
  const sectionOrder = getSectionOrder(bankName);
  const data = transformApiResponse(bankName, verificationData);

  const handleEdit = (formKey: string) => {
    onEdit(formKey);
  };

  const getButton = (key: string) => (
    <Button
      type="primary"
      icon={<EditOutlined />}
      onClick={() => handleEdit(key)}
      style={{ marginLeft: 8 }}
    >
      Edit
    </Button>
  );

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'basicDetails':
        return (
          <section key="basicDetails" style={{ marginBottom: 24 }}>
            <Card title="Basic Details" extra={getButton("basicDetails")}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Application ID">
                  {applicationNumber || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Product">
                  {data?.basicDetails?.product || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Loan Amount">
                  {data?.basicDetails?.loanAmount || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Name">
                  {data?.basicDetails?.applicantName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {data?.basicDetails?.initiatedAddress || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Contact Number">
                  {data?.basicDetails?.contactNumber || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Person Met">
                  {data?.basicDetails?.personMet || 'N/A'}
                </Descriptions.Item>
                {data?.basicDetails?.personMet && data?.basicDetails?.personMet !== 'applicant' && (
                  <Descriptions.Item label="Relationship with Borrower" span={2}>
                    {data?.basicDetails?.relationshipWithBorrower || 'N/A'}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </section>
        );

      case 'familyDetails':
        const familyMembers = data?.familyDetails || [];
        return (
          <section key="familyDetails" style={{ marginBottom: 24 }}>
            <Card title="Family Details" extra={getButton("familyDetails")}>
              {familyMembers.length > 0 ? (
                <Table
                  dataSource={familyMembers}
                  columns={[
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Relation', dataIndex: 'relation', key: 'relation' },
                    { title: 'Age', dataIndex: 'age', key: 'age' },
                    { title: 'Employment Type', dataIndex: 'employmentType', key: 'employmentType' },
                    { title: 'Educational Qualification', dataIndex: 'educationalQualification', key: 'educationalQualification' },
                    { title: 'Mobile Number', dataIndex: 'mobileNumber', key: 'mobileNumber' },
                    { title: 'Staying with Applicant', dataIndex: 'stayingWithApplicant', key: 'stayingWithApplicant' },
                  ]}
                  pagination={false}
                />
              ) : (
                <Typography.Text type="secondary">No family details available</Typography.Text>
              )}
            </Card>
          </section>
        );

      case 'businessDetails':
        return (
          <section key="businessDetails" style={{ marginBottom: 24 }}>
            <Card title="Business Details" extra={getButton("businessDetails")}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Name of the Firm">
                  {data?.businessDetails?.nameOfFirm || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Constitution">
                  {data?.businessDetails?.constitution || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Who Started the Business">
                  {data?.businessDetails?.whoStartedBusiness || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Ownership of Business Place">
                  {data?.businessDetails?.ownershipOfBusinessPlace || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Years in Current Office">
                  {data?.businessDetails?.yearsInCurrentOffice || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Years in Current City">
                  {data?.businessDetails?.yearsInCurrentCity || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Previous Employment">
                  {data?.businessDetails?.prevEmployment || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Is Residence Cum Office?">
                  {data?.businessDetails?.isResidenceCumOffice || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </section>
        );

      case 'businessProfile':
        return (
          <section key="businessProfile" style={{ marginBottom: 24 }}>
            <Card title="Business Profile" extra={getButton("businessProfile")}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Nature of Business">
                  {data?.businessProfile?.natureOfBusiness || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Product/Services Offered">
                  {data?.businessProfile?.productServicesOffered || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Business Model and Background">
                  {data?.businessProfile?.businessModelAndBackground || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </section>
        );

      case 'miscelleanousDetails':
        return (
          <section key="miscelleanousDetails" style={{ marginBottom: 24 }}>
            <Card title="Miscellaneous Details" extra={getButton("miscelleanousDetails")}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Business Name Board Seen">
                  {data?.miscelleanousDetails?.businessNameBoardSeen || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Business Activity Seen">
                  {data?.miscelleanousDetails?.businessActivitySeen || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="No of Employees Seen">
                  {data?.miscelleanousDetails?.noOfEmployeesSeen || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Stock Seen">
                  {data?.miscelleanousDetails?.stockSeen || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="No of Machines Seen">
                  {data?.miscelleanousDetails?.noOfMachinesSeen || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Any Other Business or Alternative Income Source" span={2}>
                  {data?.miscelleanousDetails?.anyOtherBusinessOrAlternativeIncomeSource || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Any Other Observations or Remarks During Visit" span={2}>
                  {data?.miscelleanousDetails?.anyOtherObservationsOrRemarksDuringVisit || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </section>
        );

      case 'suppliersCreditors':
        const suppliers = data?.suppliersCreditors?.suppliers || [];
        return (
          <section key="suppliersCreditors" style={{ marginBottom: 24 }}>
            <Card title="Suppliers/Creditors" extra={getButton("suppliersCreditors")}>
              {suppliers.length > 0 ? (
                <Table
                  dataSource={suppliers}
                  columns={[
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
                    { title: 'Location', dataIndex: 'location', key: 'location' },
                    { title: 'Review', dataIndex: 'review', key: 'review' },
                  ]}
                  pagination={false}
                />
              ) : (
                <Typography.Text type="secondary">No suppliers/creditors data available</Typography.Text>
              )}
            </Card>
          </section>
        );

      case 'clientsDebtors':
        const customers = data?.clientsDebtors?.customers || [];
        return (
          <section key="clientsDebtors" style={{ marginBottom: 24 }}>
            <Card title="Clients/Debtors" extra={getButton("clientsDebtors")}>
              {customers.length > 0 ? (
                <Table
                  dataSource={customers}
                  columns={[
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
                    { title: 'Location', dataIndex: 'location', key: 'location' },
                    { title: 'Review', dataIndex: 'review', key: 'review' },
                  ]}
                  pagination={false}
                />
              ) : (
                <Typography.Text type="secondary">No clients/debtors data available</Typography.Text>
              )}
            </Card>
          </section>
        );

      case 'thirdPartyCheck':
        const tpcChecks = data?.thirdPartyCheck?.checks || [];
        return (
          <section key="thirdPartyCheck" style={{ marginBottom: 24 }}>
            <Card title="Third Party Check" extra={getButton("thirdPartyCheck")}>
              {tpcChecks.length > 0 ? (
                <Table
                  dataSource={tpcChecks}
                  columns={[
                    { title: 'TPC Name', dataIndex: 'tpcName', key: 'tpcName' },
                    { title: 'Mobile Number', dataIndex: 'mobileNumber', key: 'mobileNumber' },
                    { title: 'Relationship', dataIndex: 'relationship', key: 'relationship' },
                    { title: 'Feedback Status', dataIndex: 'feedbackStatus', key: 'feedbackStatus' },
                    { title: 'Comments', dataIndex: 'comments', key: 'comments' },
                  ]}
                  pagination={false}
                />
              ) : (
                <Typography.Text type="secondary">No third party check data available</Typography.Text>
              )}
            </Card>
          </section>
        );

      case 'commonPoints':
        return (
          <section key="commonPoints" style={{ marginBottom: 24 }}>
            <Card title="Common Points" extra={getButton("commonPoints")}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Turnover and Margin">
                  {data?.commonPoints?.turnoverAndMargin || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Sales Fluctuations">
                  {data?.commonPoints?.salesFluctuations || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Identity Established During PD">
                  {data?.commonPoints?.customerIdentityEstablishedDuringPD || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Chartered AC Details">
                  {data?.commonPoints?.charteredAcDetails || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Loans Taken from Family, Friends, Business Associates, etc">
                  {data?.commonPoints?.loansTakenFromFamilyFriendsBusinessAssociates || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </section>
        );

      case 'existingLoans':
        const existingLoans = data?.existingLoans?.loans || [];
        return (
          <section key="existingLoans" style={{ marginBottom: 24 }}>
            <Card title="Existing Loans" extra={getButton("existingLoans")}>
              {existingLoans.length > 0 ? (
                <Table
                  dataSource={existingLoans}
                  columns={[
                    { title: 'Bank Name', dataIndex: 'bankName', key: 'bankName' },
                    { title: 'Purpose', dataIndex: 'purpose', key: 'purpose' },
                    { title: 'Loan Amount', dataIndex: 'loanAmount', key: 'loanAmount' },
                    { title: 'EMI', dataIndex: 'emi', key: 'emi' },
                    { title: 'Tenure (months)', dataIndex: 'tenure', key: 'tenure' },
                  ]}
                  pagination={false}
                />
              ) : (
                <Typography.Text type="secondary">No existing loans data available</Typography.Text>
              )}
            </Card>
          </section>
        );

      case 'workingCapitalDetails':
        return (
          <section key="workingCapitalDetails" style={{ marginBottom: 24 }}>
            <Card title="Working Capital Details" extra={getButton("workingCapitalDetails")}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Bank Name">
                  {data?.workingCapitalDetails?.bankName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Limit">
                  {data?.workingCapitalDetails?.limit || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Utilization" span={2}>
                  {data?.workingCapitalDetails?.utilization || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Collateral" span={2}>
                  {data?.workingCapitalDetails?.collateral || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Linked Loans (if any)" span={2}>
                  {data?.workingCapitalDetails?.linkedLoansIfAny || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="End of Proposed Loans" span={2}>
                  {data?.workingCapitalDetails?.endOfProposedLoans || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </section>
        );

      case 'bankingDetails':
        const bankAccounts = data?.bankingDetails?.bankAccounts || [];
        return (
          <section key="bankingDetails" style={{ marginBottom: 24 }}>
            <Card title="Banking Details" extra={getButton("bankingDetails")}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Assets">
                  {data?.bankingDetails?.assets || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="LIC/Mutual Funds">
                  {data?.bankingDetails?.licMutualFunds || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
              {bankAccounts.length > 0 && (
                <>
                  <Typography.Title level={5} style={{ marginTop: 16, marginBottom: 8 }}>Bank Accounts</Typography.Title>
                  <Table
                    dataSource={bankAccounts}
                    columns={[
                      { title: 'Bank Name', dataIndex: 'bankName', key: 'bankName' },
                      { title: 'Account Type', dataIndex: 'type', key: 'type' },
                      { title: 'Account Number', dataIndex: 'account', key: 'account' },
                      { title: 'Average Balance', dataIndex: 'averageBalance', key: 'averageBalance' },
                      { title: 'Years Maintained', dataIndex: 'numberOfYearsMaintained', key: 'numberOfYearsMaintained' },
                    ]}
                    pagination={false}
                  />
                </>
              )}
            </Card>
          </section>
        );

      case 'performance':
        return (
          <section key="performance" style={{ marginBottom: 24 }}>
            <Card title="Performance" extra={getButton("performance")}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Any Cheque Bounces">
                  {data?.performance?.anyChequeBounces || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Details of Collateral">
                  {data?.performance?.detailsOfCollateral || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </section>
        );

      case 'additionalDetails':
        const details = data?.additionalDetails?.details || [];
        return (
          <section key="additionalDetails" style={{ marginBottom: 24 }}>
            <Card title="Additional Details" extra={getButton("additionalDetails")}>
              {details.length > 0 ? (
                <ul>
                  {details.map((detail: any, index: number) => (
                    <li key={index}>{detail.value}</li>
                  ))}
                </ul>
              ) : (
                <Typography.Text type="secondary">No additional details available</Typography.Text>
              )}
            </Card>
          </section>
        );

      case 'financialAnalysis':
        // Get financial analysis data from verification data
        const financialData = verificationData?.financialAnalysis || data?.financialAnalysis;
        
        // Calculate totals
        const calculateTotal = (items: any[], key: string) => {
          return items?.reduce((sum: number, item: any) => sum + (parseFloat(item[key]) || 0), 0) || 0;
        };
        
        const toGrossTotal = (
          parseFloat(financialData?.toOpeningStock || '0') +
          parseFloat(financialData?.toPurchase || '0') +
          parseFloat(financialData?.toCostOfServices || '0') +
          parseFloat(financialData?.toWages || '0') +
          parseFloat(financialData?.toHamaliCharges || '0') +
          parseFloat(financialData?.toManufacturingExpenses || '0') +
          parseFloat(financialData?.toPackingCharges || '0')
        );
        
        const byGrossTotal = (
          parseFloat(financialData?.bySales || '0') +
          parseFloat(financialData?.byServices || '0') +
          parseFloat(financialData?.byClosingStock || '0')
        );
        
        const grossProfit = byGrossTotal - toGrossTotal;
        
        const toNetTotal = (
          parseFloat(financialData?.toSalaries || '0') +
          parseFloat(financialData?.toRent || '0') +
          parseFloat(financialData?.toElectricityCharges || '0') +
          parseFloat(financialData?.toPrintingStationery || '0') +
          parseFloat(financialData?.toTelephoneCharges || '0') +
          parseFloat(financialData?.toPostageTelegram || '0') +
          parseFloat(financialData?.toOfficeMaintenance || '0') +
          parseFloat(financialData?.toRepairsMaintenance || '0') +
          parseFloat(financialData?.toSadarExpenses || '0') +
          parseFloat(financialData?.toAuditFee || '0') +
          parseFloat(financialData?.toAdvertisement || '0') +
          parseFloat(financialData?.toBankCharges || '0') +
          parseFloat(financialData?.toInsurance || '0') +
          parseFloat(financialData?.toDepreciation || '0') +
          parseFloat(financialData?.toInterestOnLoan || '0')
        );
        
        const byNetTotal = (
          parseFloat(financialData?.byRentReceived || '0') +
          parseFloat(financialData?.byCommissionReceived || '0')
        );
        
        const netProfit = grossProfit - toNetTotal + byNetTotal;
        
        return (
          <section key="financialAnalysis" style={{ marginBottom: 24 }}>
            <Card title="Financial Analysis" extra={getButton("financialAnalysis")}>
              {/* Gross Profit Section */}
              <Card 
                title={`Gross Profit Calculation - ₹${grossProfit.toLocaleString()}`} 
                size="small" 
                style={{ marginBottom: 16, backgroundColor: grossProfit >= 0 ? '#f6ffed' : '#fff2f0' }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small" title={`To (Expenses) - ₹${toGrossTotal.toLocaleString()}`} bordered={false} style={{ backgroundColor: '#fafafa' }}>
                      <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label="Opening Stock">₹{parseFloat(financialData?.toOpeningStock || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Purchase">₹{parseFloat(financialData?.toPurchase || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Cost of Services">₹{parseFloat(financialData?.toCostOfServices || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Wages">₹{parseFloat(financialData?.toWages || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Hamali Charges">₹{parseFloat(financialData?.toHamaliCharges || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Manufacturing Expenses">₹{parseFloat(financialData?.toManufacturingExpenses || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Packing Charges">₹{parseFloat(financialData?.toPackingCharges || '0').toLocaleString()}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title={`By (Income) - ₹${byGrossTotal.toLocaleString()}`} bordered={false} style={{ backgroundColor: '#f6ffed' }}>
                      <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label="Sales">₹{parseFloat(financialData?.bySales || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Services">₹{parseFloat(financialData?.byServices || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Closing Stock">₹{parseFloat(financialData?.byClosingStock || '0').toLocaleString()}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              </Card>
              
              {/* Net Profit Section */}
              <Card 
                title={`Net Profit Calculation - ₹${netProfit.toLocaleString()}`} 
                size="small" 
                style={{ backgroundColor: netProfit >= 0 ? '#f6ffed' : '#fff2f0' }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small" title={`To (Operating Expenses) - ₹${toNetTotal.toLocaleString()}`} bordered={false} style={{ backgroundColor: '#fafafa' }}>
                      <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label="Salaries">₹{parseFloat(financialData?.toSalaries || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Rent">₹{parseFloat(financialData?.toRent || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Electricity Charges">₹{parseFloat(financialData?.toElectricityCharges || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Printing & Stationery">₹{parseFloat(financialData?.toPrintingStationery || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Telephone Charges">₹{parseFloat(financialData?.toTelephoneCharges || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Postage & Telegram">₹{parseFloat(financialData?.toPostageTelegram || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Office Maintenance">₹{parseFloat(financialData?.toOfficeMaintenance || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Repairs & Maintenance">₹{parseFloat(financialData?.toRepairsMaintenance || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Sadar Expenses">₹{parseFloat(financialData?.toSadarExpenses || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Audit Fee">₹{parseFloat(financialData?.toAuditFee || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Advertisement">₹{parseFloat(financialData?.toAdvertisement || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Bank Charges">₹{parseFloat(financialData?.toBankCharges || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Insurance">₹{parseFloat(financialData?.toInsurance || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Depreciation">₹{parseFloat(financialData?.toDepreciation || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Interest on Loan">₹{parseFloat(financialData?.toInterestOnLoan || '0').toLocaleString()}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title={`By (Other Income) - ₹${byNetTotal.toLocaleString()}`} bordered={false} style={{ backgroundColor: '#f6ffed' }}>
                      <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label="Rent Received">₹{parseFloat(financialData?.byRentReceived || '0').toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Commission Received">₹{parseFloat(financialData?.byCommissionReceived || '0').toLocaleString()}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              </Card>
              
              {/* Summary */}
              <Card size="small" title="Financial Summary" style={{ marginTop: 16, backgroundColor: '#f0f2f5' }}>
                <Descriptions bordered column={3}>
                  <Descriptions.Item label="Gross Profit" span={1}>
                    <Typography.Text strong style={{ color: grossProfit >= 0 ? '#52c41a' : '#ff4d4f' }}>
                      ₹{grossProfit.toLocaleString()}
                    </Typography.Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Net Profit" span={1}>
                    <Typography.Text strong style={{ color: netProfit >= 0 ? '#52c41a' : '#ff4d4f' }}>
                      ₹{netProfit.toLocaleString()}
                    </Typography.Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Profit Margin" span={1}>
                    <Typography.Text strong>
                      {byGrossTotal > 0 ? ((netProfit / byGrossTotal) * 100).toFixed(2) : '0.00'}%
                    </Typography.Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Card>
          </section>
        );

      case 'synopsis':
        return (
          <section key="synopsis" style={{ marginBottom: 24 }}>
            <Card title="Synopsis" extra={getButton("synopsis")}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Synopsis">
                  {data?.synopsis?.synopsis || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </section>
        );

      case 'photoCapture':
        const images = data?.uploadedItems || [];
        return (
          <section key="photoCapture" style={{ marginBottom: 24 }}>
            <Card title="Photo Capture">
              {images.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {images.map((item: any, index: number) => (
                                         <Col key={index} span={6}>
                       <Image
                         width="100%"
                         src={item.path}
                         alt={`Photo ${index + 1}`}
                         style={{ borderRadius: 8 }}
                       />
                     </Col>
                  ))}
                </Row>
              ) : (
                <Typography.Text type="secondary">No photos available</Typography.Text>
              )}
            </Card>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Render sections in the order specified by bank configuration */}
      {sectionOrder.map((sectionId) => {
        if (shouldShowSection(bankName, sectionId)) {
          return renderSection(sectionId);
        }
        return null;
      })}

      {/* Footer placeholder - can be added later with correct props */}
    </div>
  );
};

export default AxisBankVerificationDetails; 