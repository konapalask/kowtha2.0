import { useTabContext } from "@/pages/verify/[id]";
import {
  EditOutlined,
} from "@ant-design/icons";
import { Button, Card, Image, Table, Row, Col, Descriptions, Typography, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Feedback from "./Feedback";
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

  // State for Feedback component (Synopsis + Feedback)
  const [verdict, setVerdict] = useState<boolean | null | string>(null);
  const [editorContent, setEditorContent] = useState<string>("");

  const handleEdit = (formKey: string) => {
    onEdit(formKey);
  };

  const getButton = (key: string) => (
    <Button
      style={{ border: "none", background: "transparent" }}
      icon={<EditOutlined />}
      onClick={() => handleEdit(key)}
      disabled={hasEditRequest}
    />
  );

  // Helper function to format values by replacing underscores with spaces
  const formatValue = (value: any): string => {
    if (!value || value === 'N/A') return 'N/A';
    return String(value).replace(/_/g, ' ');
  };

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
                  {formatValue(data?.basicDetails?.product)}
                </Descriptions.Item>
                <Descriptions.Item label="Loan Amount">
                  {formatValue(data?.basicDetails?.loanAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Name">
                  {formatValue(data?.basicDetails?.applicantName)}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {formatValue(data?.basicDetails?.initiatedAddress)}
                </Descriptions.Item>
                <Descriptions.Item label="Contact Number">
                  {formatValue(data?.basicDetails?.contactNumber)}
                </Descriptions.Item>
                <Descriptions.Item label="Person Met">
                  {formatValue(data?.basicDetails?.personMet)}
                </Descriptions.Item>
                {data?.basicDetails?.personMet && data?.basicDetails?.personMet !== 'applicant' && (
                  <Descriptions.Item label="Relationship with Borrower" span={2}>
                    {formatValue(data?.basicDetails?.relationshipWithBorrower)}
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
                  {formatValue(data?.businessDetails?.nameOfFirm)}
                </Descriptions.Item>
                <Descriptions.Item label="Constitution">
                  {formatValue(data?.businessDetails?.constitution)}
                </Descriptions.Item>
                <Descriptions.Item label="Who Started the Business">
                  {formatValue(data?.businessDetails?.whoStartedBusiness)}
                </Descriptions.Item>
                <Descriptions.Item label="Ownership of Business Place">
                  {formatValue(data?.businessDetails?.ownershipOfBusinessPlace)}
                </Descriptions.Item>
                <Descriptions.Item label="Years in Current Office">
                  {formatValue(data?.businessDetails?.yearsInCurrentOffice)}
                </Descriptions.Item>
                <Descriptions.Item label="Years in Current City">
                  {formatValue(data?.businessDetails?.yearsInCurrentCity)}
                </Descriptions.Item>
                <Descriptions.Item label="Previous Employment">
                  {formatValue(data?.businessDetails?.prevEmployment)}
                </Descriptions.Item>
                <Descriptions.Item label="Is Residence Cum Office?">
                  {formatValue(data?.businessDetails?.isResidenceCumOffice)}
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
                  {formatValue(data?.businessProfile?.natureOfBusiness)}
                </Descriptions.Item>
                <Descriptions.Item label="Product/Services Offered">
                  {formatValue(data?.businessProfile?.productServicesOffered)}
                </Descriptions.Item>
                <Descriptions.Item label="Business Model and Background">
                  {formatValue(data?.businessProfile?.businessModelAndBackground)}
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
                  {formatValue(data?.miscelleanousDetails?.businessNameBoardSeen)}
                </Descriptions.Item>
                <Descriptions.Item label="Business Activity Seen">
                  {formatValue(data?.miscelleanousDetails?.businessActivitySeen)}
                </Descriptions.Item>
                <Descriptions.Item label="No of Employees Seen">
                  {formatValue(data?.miscelleanousDetails?.noOfEmployeesSeen)}
                </Descriptions.Item>
                <Descriptions.Item label="Stock Seen">
                  {formatValue(data?.miscelleanousDetails?.stockSeen)}
                </Descriptions.Item>
                <Descriptions.Item label="No of Machines Seen">
                  {formatValue(data?.miscelleanousDetails?.noOfMachinesSeen)}
                </Descriptions.Item>
                <Descriptions.Item label="Any Other Business or Alternative Income Source" span={2}>
                  {formatValue(data?.miscelleanousDetails?.anyOtherBusinessOrAlternativeIncomeSource)}
                </Descriptions.Item>
                <Descriptions.Item label="Any Other Observations or Remarks During Visit" span={2}>
                  {formatValue(data?.miscelleanousDetails?.anyOtherObservationsOrRemarksDuringVisit)}
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
                  {formatValue(data?.commonPoints?.turnoverAndMargin)}
                </Descriptions.Item>
                <Descriptions.Item label="Sales Fluctuations">
                  {formatValue(data?.commonPoints?.salesFluctuations)}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Identity Established During PD">
                  {formatValue(data?.commonPoints?.customerIdentityEstablishedDuringPD)}
                </Descriptions.Item>
                <Descriptions.Item label="Chartered AC Details">
                  {formatValue(data?.commonPoints?.charteredAcDetails)}
                </Descriptions.Item>
                <Descriptions.Item label="Loans Taken from Family, Friends, Business Associates, etc">
                  {formatValue(data?.commonPoints?.loansTakenFromFamilyFriendsBusinessAssociates)}
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
                  {formatValue(data?.workingCapitalDetails?.bankName)}
                </Descriptions.Item>
                <Descriptions.Item label="Limit">
                  {formatValue(data?.workingCapitalDetails?.limit)}
                </Descriptions.Item>
                <Descriptions.Item label="Utilization" span={2}>
                  {formatValue(data?.workingCapitalDetails?.utilization)}
                </Descriptions.Item>
                <Descriptions.Item label="Collateral" span={2}>
                  {formatValue(data?.workingCapitalDetails?.collateral)}
                </Descriptions.Item>
                <Descriptions.Item label="Linked Loans (if any)" span={2}>
                  {formatValue(data?.workingCapitalDetails?.linkedLoansIfAny)}
                </Descriptions.Item>
                <Descriptions.Item label="End of Proposed Loans" span={2}>
                  {formatValue(data?.workingCapitalDetails?.endOfProposedLoans)}
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
                  {formatValue(data?.bankingDetails?.assets)}
                </Descriptions.Item>
                <Descriptions.Item label="LIC/Mutual Funds">
                  {formatValue(data?.bankingDetails?.licMutualFunds)}
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
                  {formatValue(data?.performance?.anyChequeBounces)}
                </Descriptions.Item>
                <Descriptions.Item label="Details of Collateral">
                  {formatValue(data?.performance?.detailsOfCollateral)}
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
          parseFloat(financialData?.openingStock || financialData?.toOpeningStock || '0') +
          parseFloat(financialData?.purchase || financialData?.toPurchase || '0') +
          parseFloat(financialData?.costOfServices || financialData?.toCostOfServices || '0') +
          parseFloat(financialData?.wages || financialData?.toWages || '0') +
          parseFloat(financialData?.hamaliCharges || financialData?.toHamaliCharges || '0') +
          parseFloat(financialData?.manufacturingExpenses || financialData?.toManufacturingExpenses || '0') +
          parseFloat(financialData?.packingCharges || financialData?.toPackingCharges || '0')
        );
        
        const byGrossTotal = (
          parseFloat(financialData?.sales || financialData?.bySales || '0') +
          parseFloat(financialData?.services || financialData?.byServices || '0') +
          parseFloat(financialData?.closingStock || financialData?.byClosingStock || '0')
        );
        
        const grossProfit = byGrossTotal - toGrossTotal;
        
        const toNetTotal = (
          parseFloat(financialData?.salaries || financialData?.toSalaries || '0') +
          parseFloat(financialData?.rent || financialData?.toRent || '0') +
          parseFloat(financialData?.electricityCharges || financialData?.toElectricityCharges || '0') +
          parseFloat(financialData?.printingStationery || financialData?.toPrintingStationery || '0') +
          parseFloat(financialData?.telephoneCharges || financialData?.toTelephoneCharges || '0') +
          parseFloat(financialData?.postageTelegram || financialData?.toPostageTelegram || '0') +
          parseFloat(financialData?.officeMaintenance || financialData?.toOfficeMaintenance || '0') +
          parseFloat(financialData?.repairsMaintenance || financialData?.toRepairsMaintenance || '0') +
          parseFloat(financialData?.sadarExpenses || financialData?.toSadarExpenses || '0') +
          parseFloat(financialData?.auditFee || financialData?.toAuditFee || '0') +
          parseFloat(financialData?.advertisement || financialData?.toAdvertisement || '0') +
          parseFloat(financialData?.bankCharges || financialData?.toBankCharges || '0') +
          parseFloat(financialData?.insurance || financialData?.toInsurance || '0') +
          parseFloat(financialData?.depreciation || financialData?.toDepreciation || '0') +
          parseFloat(financialData?.interestOnLoan || financialData?.toInterestOnLoan || '0')
        );
        
        const byNetTotal = (
          parseFloat(financialData?.rentReceived || financialData?.byRentReceived || '0') +
          parseFloat(financialData?.commissionReceived || financialData?.byCommissionReceived || '0')
        );
        
        const netProfit = grossProfit - toNetTotal + byNetTotal;
        
        return (
          <section key="financialAnalysis" style={{ marginBottom: 24 }}>
            <Card 
              title="Financial Analysis"
              extra={getButton("financialAnalysis")}
            >
              {/* Gross Profit Section */}
              <Card title={`To Gross Profit - ₹${grossProfit.toLocaleString()}`} size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 8]}>
                  {/* Left side - All "To" fields */}
                  <Col span={12}>
                       <Descriptions bordered column={1} size="small">
                         <Descriptions.Item label="To Opening Stock">
                           {formatValue(financialData?.openingStock || financialData?.toOpeningStock)}
                         </Descriptions.Item>
                         <Descriptions.Item label="To Purchase">
                           {formatValue(financialData?.purchase || financialData?.toPurchase)}
                         </Descriptions.Item>
                         <Descriptions.Item label="To Cost of Services">
                           {formatValue(financialData?.costOfServices || financialData?.toCostOfServices)}
                         </Descriptions.Item>
                         <Descriptions.Item label="To Wages">
                           {formatValue(financialData?.wages || financialData?.toWages)}
                         </Descriptions.Item>
                         <Descriptions.Item label="To Hamali Charges">
                           {formatValue(financialData?.hamaliCharges || financialData?.toHamaliCharges)}
                         </Descriptions.Item>
                         <Descriptions.Item label="To Manufacturing Expenses">
                           {formatValue(financialData?.manufacturingExpenses || financialData?.toManufacturingExpenses)}
                         </Descriptions.Item>
                         <Descriptions.Item label="To Packing Charges">
                           {formatValue(financialData?.packingCharges || financialData?.toPackingCharges)}
                         </Descriptions.Item>
                       </Descriptions>
                  </Col>
                  {/* Right side - All "By" fields */}
                  <Col span={12}>
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="By Sales">
                        {formatValue(financialData?.sales || financialData?.bySales)}
                      </Descriptions.Item>
                      <Descriptions.Item label="By Services">
                        {formatValue(financialData?.services || financialData?.byServices)}
                      </Descriptions.Item>
                      <Descriptions.Item label="By Closing Stock">
                        {formatValue(financialData?.closingStock || financialData?.byClosingStock)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>

              {/* Net Profit Section */}
              <Card title={`To Net Profit - ₹${netProfit.toLocaleString()}`} size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 8]}>
                  {/* Left side - Operating expenses */}
                  <Col span={12}>
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="To Salaries">
                        {formatValue(financialData?.salaries || financialData?.toSalaries)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Rent">
                        {formatValue(financialData?.rent || financialData?.toRent)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Electricity Charges">
                        {formatValue(financialData?.electricityCharges || financialData?.toElectricityCharges)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Printing & Stationery">
                        {formatValue(financialData?.printingStationery || financialData?.toPrintingStationery)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Telephone Charges">
                        {formatValue(financialData?.telephoneCharges || financialData?.toTelephoneCharges)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Postage & Telegram">
                        {formatValue(financialData?.postageTelegram || financialData?.toPostageTelegram)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Office Maintenance">
                        {formatValue(financialData?.officeMaintenance || financialData?.toOfficeMaintenance)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Repairs & Maintenance">
                        {formatValue(financialData?.repairsMaintenance || financialData?.toRepairsMaintenance)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Sadar Expenses">
                        {formatValue(financialData?.sadarExpenses || financialData?.toSadarExpenses)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Audit Fee">
                        {formatValue(financialData?.auditFee || financialData?.toAuditFee)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Advertisement">
                        {formatValue(financialData?.advertisement || financialData?.toAdvertisement)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Bank Charges">
                        {formatValue(financialData?.bankCharges || financialData?.toBankCharges)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Insurance">
                        {formatValue(financialData?.insurance || financialData?.toInsurance)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Depreciation">
                        {formatValue(financialData?.depreciation || financialData?.toDepreciation)}
                      </Descriptions.Item>
                      <Descriptions.Item label="To Interest on Loan">
                        {formatValue(financialData?.interestOnLoan || financialData?.toInterestOnLoan)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                  {/* Right side - Other income */}
                  <Col span={12}>
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="By Rent Received">
                        {formatValue(financialData?.rentReceived || financialData?.byRentReceived)}
                      </Descriptions.Item>
                      <Descriptions.Item label="By Commission Received">
                        {formatValue(financialData?.commissionReceived || financialData?.byCommissionReceived)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </Card>
          </section>
        );


      case 'photoCapture':
        const images = data?.uploadedItems || [];
        return (
          <section key="photoCapture" style={{ marginBottom: 24 }}>
            <Card title="Photo Capture">
              {images.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {images.map((item: any, idx: number) => (
                    <div key={item.id || idx} style={{ position: "relative" }}>
                      <Image
                        src={item.path || item.url || ""}
                        alt={`Photo ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      {item.type && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            padding: "4px 8px",
                            fontSize: "12px",
                          }}
                        >
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Photo {idx + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Typography.Text type="secondary">No photos uploaded</Typography.Text>
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

      {/* Synopsis Section with Feedback */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Synopsis">
          <Feedback
            disabled={!!data?.synopsis?.synopsis}
            verdict={verdict}
            setVerdict={setVerdict}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            handleSave={() => {}}
            verificationData={verificationData}
            currentDepartment={currentDepartment}
            hasEditRequest={hasEditRequest}
          />
        </Card>
      </section>

      {/* Footer placeholder - can be added later with correct props */}
    </div>
  );
};

export default AxisBankVerificationDetails; 