import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, Image, message, Modal, Table, Typography, Descriptions, Form, Input, Row, Col } from "antd";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl } from "@/utils/utility";
import { patchFinalVerdict, submitFinancialAnalysis } from "@/services/verifier.services";
import Footer from "./Footer";
import Feedback from "./Feedback";

interface TataUBLVerificationDetailsProps {
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

const { Title } = Typography;

export const TataUBLVerificationDetails: React.FC<TataUBLVerificationDetailsProps> = ({
  verificationData,
  onEdit,
  editLogsUpdated,
  verificationId,
  fetchEditRequests,
  hasEditRequest,
  completeVerificationData,
  fetchVerificationData,
  editRequests = [],
  currentDepartment,
  applicationNumber,
  loanId,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { activeTab } = useTabContext();
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [editorContent, setEditorContent] = useState(
    completeVerificationData?.path || "<ul><li><br></li></ul>"
  );
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState(
    completeVerificationData?.approvedStatus === "Positive"
      ? "positive"
      : completeVerificationData?.approvedStatus === "Negative"
        ? "negative"
        : null
  );
  const [financialForm] = Form.useForm();
  const [calculatedGrossProfit, setCalculatedGrossProfit] = useState<number>(0);
  const [calculatedNetProfit, setCalculatedNetProfit] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    patchFinalVerdict(id as string, "Business", {
      status: verdict === "positive" ? "Positive" : "Negative",
      path: editorContent,
    })
      .then((response) => {
        message.success(response.data.message);
        fetchVerificationData();
      })
      .catch((error) => {
        console.log("error: ", error);
        message.error(
          error.response.data.message || "Failed to save final observations"
        );
      });
  };

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls: { [key: string]: string } = {};
      if (verificationData?.uploadedItems) {
        for (const item of verificationData.uploadedItems) {
          if (item.s3Key) {
            try {
              const url = await getS3ImageUrl(item.s3Key);
              urls[item.s3Key] = url;
            } catch (error) {
              console.error(`Failed to get URL for ${item.s3Key}:`, error);
            }
          }
        }
      }
      setImageUrls(urls);
    };
    fetchImageUrls();
  }, [verificationData]);

  const getButton = (formKey: string) => (
    <Button
      type="text"
      icon={<EditOutlined />}
      onClick={() => onEdit(formKey)}
      disabled={hasEditRequest}
    />
  );

  const data = verificationData;

  // Basic Details Section
  const renderBasicDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Basic Details"
          bordered
          column={2}
          extra={getButton("basicDetails")}
        >
          <Descriptions.Item label="Name of Applicant">
            {data?.basicDetails?.nameOfApplicant || data?.basicDetails?.applicantName}
          </Descriptions.Item>
          <Descriptions.Item label="Name of Entity">
            {data?.basicDetails?.nameOfEntity || data?.basicDetails?.nameOfConcern}
          </Descriptions.Item>
          <Descriptions.Item label="Name of Co-Applicants">
            {data?.basicDetails?.nameOfCoApplicants}
          </Descriptions.Item>
          <Descriptions.Item label="Phone No">
            {data?.basicDetails?.phoneNo}
          </Descriptions.Item>
          <Descriptions.Item label="Initiated Address" span={2}>
            {data?.basicDetails?.initiatedAddress}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Proposed Loan Details Section
  const renderProposedLoanDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Proposed Loan Details"
          bordered
          column={2}
          extra={getButton("proposedLoanDetails")}
        >
          <Descriptions.Item label="Product">
            {data?.proposedLoanDetails?.product}
          </Descriptions.Item>
          <Descriptions.Item label="Amount">
            {data?.proposedLoanDetails?.amount}
          </Descriptions.Item>
          <Descriptions.Item label="Tenure">
            {data?.proposedLoanDetails?.tenure}
          </Descriptions.Item>
          <Descriptions.Item label="Repayment From">
            {data?.proposedLoanDetails?.repaymentFrom}
          </Descriptions.Item>
          <Descriptions.Item label="Bank Name">
            {data?.proposedLoanDetails?.bankName}
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            {data?.proposedLoanDetails?.type}
          </Descriptions.Item>
          <Descriptions.Item label="Account Number">
            {data?.proposedLoanDetails?.accNo}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Office Address Section
  const renderOfficeAddress = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Office Address"
          bordered
          column={2}
          extra={getButton("officeAddress")}
        >
          <Descriptions.Item label="Address" span={2}>
            {data?.officeAddress?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Ownership of Premises">
            {data?.officeAddress?.ownershipOfPremises}
          </Descriptions.Item>
          <Descriptions.Item label="Owned By">
            {data?.officeAddress?.ownedBy}
          </Descriptions.Item>
          <Descriptions.Item label="Area in Sq Ft">
            {data?.officeAddress?.areaInSqFt}
          </Descriptions.Item>
          <Descriptions.Item label="Occupied Since Years">
            {data?.officeAddress?.occupiedSinceYears}
          </Descriptions.Item>
          <Descriptions.Item label="CMV/Rent per Month">
            {data?.officeAddress?.cmvRentPerMonth}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Residential Address Section
  const renderResidentialAddress = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Residential Address"
          bordered
          column={2}
          extra={getButton("residentialAddress")}
        >
          <Descriptions.Item label="Address" span={2}>
            {data?.residentialAddress?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Ownership of Premises">
            {data?.residentialAddress?.ownershipOfPremises}
          </Descriptions.Item>
          <Descriptions.Item label="Owned By">
            {data?.residentialAddress?.ownedBy}
          </Descriptions.Item>
          <Descriptions.Item label="Area in Sq Ft">
            {data?.residentialAddress?.areaInSqFt}
          </Descriptions.Item>
          <Descriptions.Item label="Occupied Since Years">
            {data?.residentialAddress?.occupiedSinceValues}
          </Descriptions.Item>
          <Descriptions.Item label="CMV/Rent per Month">
            {data?.residentialAddress?.cmvRentPerMonth}
          </Descriptions.Item>
          <Descriptions.Item label="Address of PD">
            {data?.residentialAddress?.addressOfPD}
          </Descriptions.Item>
          <Descriptions.Item label="Person Met">
            {data?.residentialAddress?.personMet}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Family Details Section
  const renderFamilyDetails = () => {
    const familyData = data?.familyDetails || [];
    const familyColumns = [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Relation", dataIndex: "relation", key: "relation" },
      { title: "Age", dataIndex: "age", key: "age" },
      { title: "Employment Type", dataIndex: "employmentType", key: "employmentType" },
      { title: "Educational Qualification", dataIndex: "educationalQualification", key: "educationalQualification" },
      { title: "Mobile Number", dataIndex: "mobileNumber", key: "mobileNumber" },
      { title: "Staying With Applicant", dataIndex: "stayingWithApplicant", key: "stayingWithApplicant" },
    ];

    return (
      <section style={{ marginBottom: 24 }}>
        <Card title="Family Details" extra={getButton("familyDetails")}>
          <Table
            className="striped-table"
            dataSource={familyData}
            columns={familyColumns}
            pagination={false}
            rowKey={(record, index) => index?.toString() || "0"}
          />
        </Card>
      </section>
    );
  };

  // Business Details Section
  const renderBusinessDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Business Details"
          bordered
          column={2}
          extra={getButton("businessDetails")}
        >
          <Descriptions.Item label="Current Business Details" span={2}>
            {data?.businessDetails?.currentBusinessDetails}
          </Descriptions.Item>
          <Descriptions.Item label="Stock as on Date">
            {data?.businessDetails?.stockAsOnDate}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Employee Details Section
  const renderEmployeeDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Employee Details"
          bordered
          column={2}
          extra={getButton("employeeDetails")}
        >
          <Descriptions.Item label="Current Employees">
            {data?.employeeDetails?.currentEmployees}
          </Descriptions.Item>
          <Descriptions.Item label="Salary Range">
            {data?.employeeDetails?.salaryRange}
          </Descriptions.Item>
          <Descriptions.Item label="Key Employee Name">
            {data?.employeeDetails?.keyEmployeeName}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Bank Details Section
  const renderBankDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Bank Details"
          bordered
          column={2}
          extra={getButton("bankDetails")}
        >
          <Descriptions.Item label="Primary Banker">
            {data?.bankDetails?.primaryBanker}
          </Descriptions.Item>
          <Descriptions.Item label="Nature of Account">
            {data?.bankDetails?.natureOfAccount}
          </Descriptions.Item>
          <Descriptions.Item label="Average Balance">
            {data?.bankDetails?.avgBalance}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Sales & Profit Details Section
  const renderSalesAndProfitDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Sales & Profit Details"
          bordered
          column={2}
          extra={getButton("salesAndProfitDetails")}
        >
          <Descriptions.Item label="Turnover Previous Fiscal Year">
            {data?.salesAndProfitDetails?.turnoverPrevFiscalYear}
          </Descriptions.Item>
          <Descriptions.Item label="Expected Turnover Current Fiscal Year">
            {data?.salesAndProfitDetails?.expectedTurnoverCurrentFiscalYear}
          </Descriptions.Item>
          <Descriptions.Item label="Monthly Turnover/Sales">
            {data?.salesAndProfitDetails?.monthlyTurnoverSales}
          </Descriptions.Item>
          <Descriptions.Item label="Net Monthly Income">
            {data?.salesAndProfitDetails?.netMonthlyIncome}
          </Descriptions.Item>
          <Descriptions.Item label="Profit Margin">
            {data?.salesAndProfitDetails?.profitMargin}
          </Descriptions.Item>
          <Descriptions.Item label="COVID Effect on Turnover">
            {data?.salesAndProfitDetails?.covidEffectOnTurnover}
          </Descriptions.Item>
          <Descriptions.Item label="Business Running Same Speed After Lockdown">
            {data?.salesAndProfitDetails?.businessRunningSameSpeedAfterLockdown}
          </Descriptions.Item>
          <Descriptions.Item label="Cash Sales Percentage">
            {data?.salesAndProfitDetails?.cashSalesPercentage}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Customers Details Section
  const renderCustomersDetails = () => {
    const customersData = data?.customersDetails?.customers || [];
    const customersColumns = [
      { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
      { title: "Percentage of Total Sales", dataIndex: "percentageOfTotalSales", key: "percentageOfTotalSales" },
      { title: "Debtor Days", dataIndex: "debtorDays", key: "debtorDays" },
      { title: "Relationship Since Years", dataIndex: "relationshipSinceYears", key: "relationshipSinceYears" },
    ];

    return (
      <section style={{ marginBottom: 24 }}>
        <Card title="Customers Details" extra={getButton("customersDetails")}>
          <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Total Debtors as on Date">
              {data?.customersDetails?.totalDebtorsAsOnDate}
            </Descriptions.Item>
            <Descriptions.Item label="Total Customers">
              {data?.customersDetails?.totalCustomers}
            </Descriptions.Item>
          </Descriptions>
          <Table
            className="striped-table"
            dataSource={customersData}
            columns={customersColumns}
            pagination={false}
            rowKey={(record, index) => index?.toString() || "0"}
          />
        </Card>
      </section>
    );
  };

  // Supplier Details Section
  const renderSupplierDetails = () => {
    const suppliersData = data?.supplierDetails?.suppliers || [];
    const suppliersColumns = [
      { title: "Supplier Name", dataIndex: "supplierName", key: "supplierName" },
      { title: "Percentage of Total Sales", dataIndex: "percentageOfTotalSales", key: "percentageOfTotalSales" },
      { title: "Creditor Days", dataIndex: "creditorDays", key: "creditorDays" },
      { title: "Relationship Since Years", dataIndex: "relationshipSinceYears", key: "relationshipSinceYears" },
    ];

    return (
      <section style={{ marginBottom: 24 }}>
        <Card title="Supplier Details" extra={getButton("supplierDetails")}>
          <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Total Creditors as on Date">
              {data?.supplierDetails?.totalCreditorsAsOnDate}
            </Descriptions.Item>
            <Descriptions.Item label="Total Suppliers">
              {data?.supplierDetails?.totalSuppliers}
            </Descriptions.Item>
          </Descriptions>
          <Table
            className="striped-table"
            dataSource={suppliersData}
            columns={suppliersColumns}
            pagination={false}
            rowKey={(record, index) => index?.toString() || "0"}
          />
        </Card>
      </section>
    );
  };

  // Additional Business Details Section
  const renderAdditionalBusinessDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Additional Business Details"
          bordered
          column={1}
          extra={getButton("additionalBusinessDetails")}
        >
          <Descriptions.Item label="Other Business / Income Details">
            {data?.additionalBusinessDetails?.otherBusinessIncomeDetails}
          </Descriptions.Item>
          <Descriptions.Item label="Assets">
            {data?.additionalBusinessDetails?.assets}
          </Descriptions.Item>
          <Descriptions.Item label="Liabilities">
            {data?.additionalBusinessDetails?.liabilities}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Existing Loans Section
  const renderExistingLoans = () => {
    const loansData = data?.existingLoans?.loans || [];
    const loansColumns = [
      { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
      { title: "Purpose", dataIndex: "purpose", key: "purpose" },
      { title: "Loan Amount", dataIndex: "loanAmount", key: "loanAmount" },
      { title: "EMI", dataIndex: "emi", key: "emi" },
      { title: "Tenure", dataIndex: "tenure", key: "tenure" },
      { title: "Outstanding Balance", dataIndex: "outstandingBalance", key: "outstandingBalance" },
    ];

    return (
      <section style={{ marginBottom: 24 }}>
        <Card title="Existing Loans" extra={getButton("existingLoans")}>
          <Table
            className="striped-table"
            dataSource={loansData}
            columns={loansColumns}
            pagination={false}
            rowKey={(record, index) => index?.toString() || "0"}
          />
        </Card>
      </section>
    );
  };

  // Miscellaneous Details Section
  const renderMiscellaneousDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Miscellaneous Details"
          bordered
          column={1}
          extra={getButton("miscelleanousDetails")}
        >
          <Descriptions.Item label="End Use of Proposed Loan">
            {data?.miscelleanousDetails?.endUseOfProposedLoan}
          </Descriptions.Item>
          <Descriptions.Item label="Political Connections">
            {data?.miscelleanousDetails?.politicalConnections}
          </Descriptions.Item>
          <Descriptions.Item label="Any Court Cases">
            {data?.miscelleanousDetails?.anyCourtCases}
          </Descriptions.Item>
          <Descriptions.Item label="Business Belongs to Which Industry">
            {data?.miscelleanousDetails?.businessBelongsToWhichIndustry}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Value Added Details Section
  const renderValueAddedDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Value Added Details"
          bordered
          column={2}
          extra={getButton("valueAddedDetails")}
        >
          <Descriptions.Item label="Customer Behaviour">
            {data?.valueAddedDetails?.customerBehaviour}
          </Descriptions.Item>
          <Descriptions.Item label="Salaries Paid During COVID">
            {data?.valueAddedDetails?.salariesPaidDuringCovid}
          </Descriptions.Item>
          <Descriptions.Item label="Digital Wallet Used">
            {data?.valueAddedDetails?.digitalWalletUsed}
          </Descriptions.Item>
          <Descriptions.Item label="Nature of Neighborhood Shops">
            {data?.valueAddedDetails?.natureOfNeighborhoodShops}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Shop/Office Locality">
            {data?.valueAddedDetails?.customerShopOfficeLocality}
          </Descriptions.Item>
          <Descriptions.Item label="Nearby Transport Stand">
            {data?.valueAddedDetails?.nearbyTransportStand}
          </Descriptions.Item>
          <Descriptions.Item label="Utility Bill Units Consumption">
            {data?.valueAddedDetails?.utilityBillUnitsConsumption}
          </Descriptions.Item>
          <Descriptions.Item label="Loss Suffered in Business">
            {data?.valueAddedDetails?.lossSufferedInBusiness}
          </Descriptions.Item>
          <Descriptions.Item label="Loss Reason" span={2}>
            {data?.valueAddedDetails?.lossReason}
          </Descriptions.Item>
          <Descriptions.Item label="Strengths" span={2}>
            {data?.valueAddedDetails?.strengths}
          </Descriptions.Item>
          <Descriptions.Item label="Weaknesses" span={2}>
            {data?.valueAddedDetails?.weaknesses}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Site Visit Details Section
  const renderSiteVisitDetails = () => (
    <section style={{ marginBottom: 24 }}>
      <Card>
        <Descriptions
          title="Site Visit Details"
          bordered
          column={2}
          extra={getButton("siteVisitDetails")}
        >
          <Descriptions.Item label="Nameplate Displayed">
            {data?.siteVisitDetails?.nameplateDisplayed}
          </Descriptions.Item>
          <Descriptions.Item label="Office Well Furnished">
            {data?.siteVisitDetails?.officeWellFurnished}
          </Descriptions.Item>
          <Descriptions.Item label="Business Activity Seen">
            {data?.siteVisitDetails?.businessActivitySeen}
          </Descriptions.Item>
          <Descriptions.Item label="Difficulty in Locating Premises">
            {data?.siteVisitDetails?.difficultyInLocatingPremises}
          </Descriptions.Item>
          <Descriptions.Item label="Neighborhood">
            {data?.siteVisitDetails?.neighborhood}
          </Descriptions.Item>
          <Descriptions.Item label="Landmark">
            {data?.siteVisitDetails?.landmark}
          </Descriptions.Item>
          <Descriptions.Item label="Abnormal Increase/Decrease in Turnover">
            {data?.siteVisitDetails?.abnormalIncreaseDecreaseInTurnover}
          </Descriptions.Item>
          <Descriptions.Item label="Any Decrease in Networth">
            {data?.siteVisitDetails?.anyDecreaseInNetworth}
          </Descriptions.Item>
          <Descriptions.Item label="Stock Seen During PD">
            {data?.siteVisitDetails?.stockSeenDuringPD}
          </Descriptions.Item>
          <Descriptions.Item label="No. of Employees Seen During PD">
            {data?.siteVisitDetails?.noOfEmployeesSeenDuringPD}
          </Descriptions.Item>
          <Descriptions.Item label="No. of Customers Seen During PD">
            {data?.siteVisitDetails?.noOfCustomersSeenDuringPD}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );

  // Third Party Check Section
  const renderThirdPartyCheck = () => {
    const tpcData = data?.thirdPartyCheck?.checks || [];
    const tpcColumns = [
      { title: "TPC Name", dataIndex: "tpcName", key: "tpcName" },
      { title: "Mobile Number", dataIndex: "mobileNumber", key: "mobileNumber" },
      { title: "Relationship", dataIndex: "relationship", key: "relationship" },
      { title: "Feedback Status", dataIndex: "feedbackStatus", key: "feedbackStatus" },
      { title: "Comments", dataIndex: "comments", key: "comments" },
    ];

    return (
      <section style={{ marginBottom: 24 }}>
        <Card title="Third Party Check" extra={getButton("thirdPartyCheck")}>
          <Table
            className="striped-table"
            dataSource={tpcData}
            columns={tpcColumns}
            pagination={false}
            rowKey={(record, index) => index?.toString() || "0"}
          />
        </Card>
      </section>
    );
  };

  // Documents Observed Section
  const renderDocumentsObserved = () => {
    const documentsData = data?.documentsObserved?.documents || [];
    const documentsColumns = [
      { title: "Document Name", dataIndex: "documentName", key: "documentName" },
      { title: "Document Type", dataIndex: "documentType", key: "documentType" },
      { title: "Document Category", dataIndex: "documentCategory", key: "documentCategory" },
      { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    ];

    return (
      <section style={{ marginBottom: 24 }}>
        <Card title="Documents Observed" extra={getButton("documentsObserved")}>
          <Table
            className="striped-table"
            dataSource={documentsData}
            columns={documentsColumns}
            pagination={false}
            rowKey={(record, index) => index?.toString() || "0"}
          />
        </Card>
      </section>
    );
  };

  // Additional Details Section
  const renderAdditionalDetails = () => {
    const additionalData = data?.additionalDetails?.details || [];
    const additionalColumns = [
      { title: "Details", dataIndex: "value", key: "value" },
    ];

    return (
      <section style={{ marginBottom: 24 }}>
        <Card title="Additional Details" extra={getButton("additionalDetails")}>
          <Table
            className="striped-table"
            dataSource={additionalData}
            columns={additionalColumns}
            pagination={false}
            rowKey={(record, index) => index?.toString() || "0"}
          />
        </Card>
      </section>
    );
  };

  // Photo Capture Section
  const renderPhotoCapture = () => {
    const photos = verificationData?.uploadedItems || [];
    
    return (
      <section style={{ marginBottom: 24 }}>
        <Card title="Photo Capture" extra={getButton("photoCapture")}>
          {photos.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {photos.map((photo: any, index: number) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <Image
                    width={200}
                    height={150}
                    src={imageUrls[photo.s3Key] || photo.url}
                    alt={photo.description || `Photo ${index + 1}`}
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={{ marginTop: 8, fontSize: '12px' }}>
                    {photo.description || `Photo ${index + 1}`}
                  </div>
                  {photo.location && (
                    <div style={{ fontSize: '10px', color: '#666' }}>
                      {photo.location}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>No photos uploaded</div>
          )}
        </Card>
      </section>
    );
  };

  return (
    <div>
      <Title level={3}>Tata UBL - Business Verification Details</Title>
      
      {/* Render all sections in the exact order as mobile app */}
      {renderBasicDetails()}
      {renderProposedLoanDetails()}
      {renderOfficeAddress()}
      {renderResidentialAddress()}
      {renderFamilyDetails()}
      {renderBusinessDetails()}
      {renderEmployeeDetails()}
      {renderBankDetails()}
      {renderSalesAndProfitDetails()}
      {renderCustomersDetails()}
      {renderSupplierDetails()}
      {renderAdditionalBusinessDetails()}
      {renderExistingLoans()}
      {renderMiscellaneousDetails()}
      {renderValueAddedDetails()}
      {renderSiteVisitDetails()}
      {renderThirdPartyCheck()}
      {renderDocumentsObserved()}
      {renderAdditionalDetails()}
      {renderPhotoCapture()}

      {/* Financial Analysis Section - Only for PD department */}
      {currentDepartment === 'PD' && (
        <section style={{ marginBottom: 24 }}>
          <Card 
            title="Financial Analysis"
            extra={getButton("financialAnalysis")}
          >
            <Form form={financialForm} layout="vertical" disabled={!!completeVerificationData?.financialAnalysis}>
              {/* Gross Profit Section */}
              <Card title={`To Gross Profit - ₹${calculatedGrossProfit.toLocaleString()}`} size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 8]}>
                  {/* Left side - All "To" fields */}
                  <Col span={12}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Form.Item name="toOpeningStock" label="To Opening Stock">
                          <Input placeholder="Opening Stock" type="number" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="toPurchase" label="To Purchase">
                          <Input placeholder="Purchase" type="number" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="toCostOfServices" label="To Cost of Services">
                          <Input placeholder="Cost of Services" type="number" min={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  {/* Right side - All "By" fields */}
                  <Col span={12}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Form.Item name="bySales" label="By Sales">
                          <Input placeholder="Sales" type="number" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="byServices" label="By Services">
                          <Input placeholder="Services" type="number" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="byClosingStock" label="By Closing Stock">
                          <Input placeholder="Closing Stock" type="number" min={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
              
              {/* Net Profit Section */}
              <Card title={`To Net Profit - ₹${calculatedNetProfit.toLocaleString()}`} size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 8]}>
                  {/* Left side - All "To" fields */}
                  <Col span={12}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Form.Item name="toSalaries" label="To Salaries">
                          <Input placeholder="Salaries" type="number" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="toRent" label="To Rent">
                          <Input placeholder="Rent" type="number" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="toElectricityCharges" label="To Electricity Charges">
                          <Input placeholder="Electricity Charges" type="number" min={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  {/* Right side - All "By" fields */}
                  <Col span={12}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Form.Item name="byRentReceived" label="By Rent Received">
                          <Input placeholder="Rent Received" type="number" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="byCommissionReceived" label="By Commission Received">
                          <Input placeholder="Commission Received" type="number" min={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Form>
          </Card>
        </section>
      )}

      {/* Synopsis Section */}
      <section style={{ marginBottom: 24 }}>
        <Card title="Synopsis">
          <Feedback
            disabled={false}
            verdict={verdict}
            setVerdict={setVerdict}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            handleSave={handleSave}
            verificationData={completeVerificationData}
            hasEditRequest={hasEditRequest}
          />
        </Card>
      </section>



      {/* Footer */}
      <Footer 
        editorContent={editorContent}
        handleSave={handleSave}
        verdict={verdict}
        open={open}
        setOpen={setOpen}
        verificationType="Business"
      />

      {/* Modal for edit requests */}
      <Modal
        title="Edit Request"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        {/* Modal content would go here */}
      </Modal>
    </div>
  );
};

export default TataUBLVerificationDetails; 