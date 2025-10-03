import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl } from "@/utils/utility";
import {
  CloseCircleOutlined,
  // CloseCircleOutlined,
  EditOutlined,
  // EyeOutlined,
  // PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Image, message, Modal, Table, Row, Col, Descriptions, Form, Input, Typography } from "antd";
// import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import EditRequestLogs from "./EditRequestLogs";
import Footer from "./Footer";
import { useRouter } from "next/router";
import BusinessBasicDetailsDescription from "./Descriptions/BusinessBasicDetailsDescription";
import BusinessDetailsDescription from "./Descriptions/BusinessDetailsDescription";
import BusinessMiscellaneousDescription from "./Descriptions/BusinessMiscellaneousDescription";
import ApplicantDetailsDescription from "./Descriptions/ApplicantDetailsDescription";
import FamilyDetailsDescription from "./Descriptions/FamilyDetailsDescription";

// import PdfPreview from "./PdfPreview";
import FinalVerdict from "./FinalVerdict";
import Feedback from "./Feedback";
import {
  patchFinalVerdict,
  verifierEditApi,
  submitFinancialAnalysis,
} from "@/services/verifier.services";

// Import bank configuration system
import { 
  getBankConfig, 
  transformApiResponse, 
  shouldShowSection, 
  getSectionOrder,
  isArkaFincap,
  isAxisFinance 
} from "./bankConfigs";
import { isAxisSchemaShaped, adaptAxisSchemaToLegacy } from "@/utils/pdAxisSchemaAdapter";

interface BusinessVerificationDetailsProps {
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

export const BusinessVerificationDetails: React.FC<
  BusinessVerificationDetailsProps
> = ({
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
  const [changedData, setChangedData] = useState<any>({});
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
  // const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    patchFinalVerdict(id as string, "Business", {
      status: verdict === "positive" ? "Positive" : "Negative",
      path: editorContent,
    })
      .then((response) => {
        // console.log("response: ", response)
        message.success(response.data.message);
        // setOpen(true);
        // setVerdict(verdict);
        // setOpen(false);
        // router?.push("/verify");
        // setLoading(false);
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
      if (verificationData?.uploadedItems) {
        const urls: { [key: string]: string } = {};
        for (const item of verificationData.uploadedItems) {
          try {
            const response = await getS3ImageUrl(item.s3ImageUrl);
            urls[item.id] = response;
          } catch (error) {
            console.error("Error fetching image URL:", error);
          }
        }
        setImageUrls(urls);
      }
    };

    fetchImageUrls();
  }, [verificationData?.uploadedItems]);

  useEffect(() => {
    const request = indexedDB.open("editLogs", 1);

    request.onerror = (event) => {
      console.error("Database error:", request.error);
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;

      try {
        const transaction = db.transaction("logs", "readonly");
        const store = transaction.objectStore("logs");
        const getRequest = store.get(`${id}_${activeTab}`);

        getRequest.onsuccess = (event: any) => {
          const existingLogs = event.target.result || {};
          const { id, timestamp, ...rest } = existingLogs;
          setChangedData(rest);
        };

        getRequest.onerror = (event: any) => {
          console.error("Error fetching logs:", event);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      } catch (error) {
        console.error("Transaction error:", error);
        db.close();
      }
    };
  }, [id, activeTab, editLogsUpdated]);

  // Watch financial form values for automatic calculation
  const financialFormValues = Form.useWatch([], financialForm);

  // Calculate profits whenever financial form values change
  useEffect(() => {
    if (financialFormValues) {
      console.log('Financial form values:', financialFormValues);
      const calculateProfits = () => {
        // Gross Profit Calculation
        const openingStock = parseFloat((financialFormValues as any).toOpeningStock) || 0;
        const purchase = parseFloat((financialFormValues as any).toPurchase) || 0;
        const costOfServices = parseFloat((financialFormValues as any).toCostOfServices) || 0;
        const wages = parseFloat((financialFormValues as any).toWages) || 0;
        const hamaliCharges = parseFloat((financialFormValues as any).toHamaliCharges) || 0;
        const manufacturingExpenses = parseFloat((financialFormValues as any).toManufacturingExpenses) || 0;
        const packingCharges = parseFloat((financialFormValues as any).toPackingCharges) || 0;
        const sales = parseFloat((financialFormValues as any).bySales) || 0;
        const services = parseFloat((financialFormValues as any).byServices) || 0;
        const closingStock = parseFloat((financialFormValues as any).byClosingStock) || 0;

        // Gross Profit = (Sales + Services + Closing Stock) - (Opening Stock + Purchases + Cost of Services + Wages + Hamali + Manufacturing + Packing)
        const grossProfit = (sales + services + closingStock) - (openingStock + purchase + costOfServices + wages + hamaliCharges + manufacturingExpenses + packingCharges);

        // Net Profit Calculation
        const salaries = parseFloat((financialFormValues as any).toSalaries) || 0;
        const rent = parseFloat((financialFormValues as any).toRent) || 0;
        const electricityCharges = parseFloat((financialFormValues as any).toElectricityCharges) || 0;
        const printingStationery = parseFloat((financialFormValues as any).toPrintingStationery) || 0;
        const telephoneCharges = parseFloat((financialFormValues as any).toTelephoneCharges) || 0;
        const postageTelegram = parseFloat((financialFormValues as any).toPostageTelegram) || 0;
        const officeMaintenance = parseFloat((financialFormValues as any).toOfficeMaintenance) || 0;
        const repairsMaintenance = parseFloat((financialFormValues as any).toRepairsMaintenance) || 0;
        const sadarExpenses = parseFloat((financialFormValues as any).toSadarExpenses) || 0;
        const auditFee = parseFloat((financialFormValues as any).toAuditFee) || 0;
        const advertisement = parseFloat((financialFormValues as any).toAdvertisement) || 0;
        const bankCharges = parseFloat((financialFormValues as any).toBankCharges) || 0;
        const insurance = parseFloat((financialFormValues as any).toInsurance) || 0;
        const depreciation = parseFloat((financialFormValues as any).toDepreciation) || 0;
        const interestOnLoan = parseFloat((financialFormValues as any).toInterestOnLoan) || 0;
        const rentReceived = parseFloat((financialFormValues as any).byRentReceived) || 0;
        const commissionReceived = parseFloat((financialFormValues as any).byCommissionReceived) || 0;

        // Indirect Expenses = All "To" fields in net profit section
        const indirectExpenses = salaries + rent + electricityCharges + printingStationery + 
          telephoneCharges + postageTelegram + officeMaintenance + repairsMaintenance + 
          sadarExpenses + auditFee + advertisement + bankCharges + insurance + 
          depreciation + interestOnLoan;

        // Other Incomes = Rent Received + Commission Received
        const otherIncomes = rentReceived + commissionReceived;

        // Net Profit = Gross Profit + Other Incomes - Indirect Expenses
        const netProfit = grossProfit + otherIncomes - indirectExpenses;

        console.log('Calculated values:', {
          grossProfit,
          netProfit,
          indirectExpenses,
          otherIncomes
        });

        setCalculatedGrossProfit(grossProfit);
        setCalculatedNetProfit(netProfit);
      };

      calculateProfits();
    }
  }, [financialFormValues]);

  // Load existing financial data when component mounts
  useEffect(() => {
    console.log('verificationData received:', verificationData);
    console.log('completeVerificationData received:', completeVerificationData);
    
    // Now verificationData is the entire verification object, so financialAnalysis is directly under it
    let financialData = null;
    
    // Try to get financial data from the correct path
    if (verificationData?.financialAnalysis) {
      financialData = verificationData.financialAnalysis;
      console.log('Financial data found in verificationData.financialAnalysis:', financialData);
    }
    
    if (financialData) {
      console.log('Loading financial data:', financialData);
      
      // Set form values based on the API response structure
      const formValues = {
        toOpeningStock: financialData.openingStock?.toString() || '',
        toPurchase: financialData.purchase?.toString() || '',
        toCostOfServices: financialData.costOfServices?.toString() || '',
        toWages: financialData.wages?.toString() || '',
        toHamaliCharges: financialData.hamaliCharges?.toString() || '',
        toManufacturingExpenses: financialData.manufacturingExpenses?.toString() || '',
        toPackingCharges: financialData.packingCharges?.toString() || '',
        bySales: financialData.sales?.toString() || '',
        byServices: financialData.services?.toString() || '',
        byClosingStock: financialData.closingStock?.toString() || '',
        toSalaries: financialData.salaries?.toString() || '',
        toRent: financialData.rent?.toString() || '',
        toElectricityCharges: financialData.electricityCharges?.toString() || '',
        toPrintingStationery: financialData.printingStationery?.toString() || '',
        toTelephoneCharges: financialData.telephoneCharges?.toString() || '',
        toPostageTelegram: financialData.postageTelegram?.toString() || '',
        toOfficeMaintenance: financialData.officeMaintenance?.toString() || '',
        toRepairsMaintenance: financialData.repairsMaintenance?.toString() || '',
        toSadarExpenses: financialData.sadarExpenses?.toString() || '',
        toAuditFee: financialData.auditFee?.toString() || '',
        toAdvertisement: financialData.advertisement?.toString() || '',
        toBankCharges: financialData.bankCharges?.toString() || '',
        toInsurance: financialData.insurance?.toString() || '',
        toDepreciation: financialData.depreciation?.toString() || '',
        toInterestOnLoan: financialData.interestOnLoan?.toString() || '',
        byRentReceived: financialData.rentReceived?.toString() || '',
        byCommissionReceived: financialData.commissionReceived?.toString() || '',
      };
      
      console.log('Setting form values:', formValues);
      
      // Set form values immediately
      financialForm.setFieldsValue(formValues);
      console.log('Form values set successfully');

      // Set calculated values
      setCalculatedGrossProfit(financialData.grossProfit || 0);
      setCalculatedNetProfit(financialData.netProfit || 0);
      
      console.log('Calculated values set - Gross Profit:', financialData.grossProfit, 'Net Profit:', financialData.netProfit);
    } else {
      console.log('No financial data found in verificationData.financialAnalysis');
    }
  }, [verificationData, financialForm]);

  const handleFinancialSubmit = async () => {
    try {
      setLoading(true);
      const values = await financialForm.validateFields();

      // Prepare the complete financial analysis data
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
        grossProfit: calculatedGrossProfit,
        netProfit: calculatedNetProfit
      };

      console.log('Submitting financial data:', financialData);

      // Call the financial analysis API with department parameter
      await submitFinancialAnalysis(id as string, financialData);
      
      message.success("Financial analysis submitted successfully!");
      
      // Refresh the verification data to show updated values
      fetchVerificationData();
    } catch (error) {
      console.error("Error submitting financial analysis:", error);
      message.error("Failed to submit financial analysis");
    } finally {
      setLoading(false);
    }
  };

  if (!verificationData) return null;

  // Get bank configuration and transform API response based on bank
  const bankName = verificationData?.bankName || 'Axis Finance';
  const bankConfig = getBankConfig(bankName);
  
  // Transform the raw API response using bank-specific transformer
  const rawApiData = verificationData?.verificationData || verificationData;
  const transformedData = (() => {
    // If Axis schema-shaped payload is present (snake_case sections), adapt to legacy view shape for pilot
    if (bankName?.toLowerCase().includes('axis') && isAxisSchemaShaped(rawApiData)) {
      return adaptAxisSchemaToLegacy(rawApiData);
    }
    return transformApiResponse(bankName, rawApiData);
  })();

  // Extract the form data using transformed data
  const data = transformedData;
  
  // Coalesce PD section objects in case of different shapes (keeping for backward compatibility)
  const coalesce = (a: any, b: any) => (a !== undefined && a !== null ? a : b);
  const unwrapKey = (obj: any, key: string) => (obj && typeof obj === 'object' && obj[key] ? obj[key] : obj);
  const salariesWagesData = unwrapKey(coalesce(data?.salariesWages, transformedData?.salariesWages), 'salariesWages');
  const clientsDebtorsData = unwrapKey(coalesce(data?.clientsDebtors, transformedData?.financeDetails), 'clientsDebtors');
  const suppliersCreditorsData = coalesce(data?.suppliersCreditors, transformedData?.suppliersCreditors);
  const assetDetailsData = coalesce(data?.assetDetails, transformedData?.assetDetails);

  const handleEditorChange = (content: string) => {
    // const liMatch = content.match(/<li>/g);
    // const liCount = liMatch ? liMatch.length : 0;

    // if (liCount === 0) {
    //   setEditorContent("<ul><li></li></ul>");
    // } else {
    setEditorContent(content);
    // }
  };

  // Check if there are pending edit requests for key sections (Basic Details, Business Details, or Business Miscellaneous Details)
  const hasPendingEditRequestForKeySections = () => {
    if (!hasEditRequest) return false;
    const keySections = currentDepartment === 'PD' 
      ? ['businessBasicDetails', 'businessDetails', 'applicantDetails', 'familyDetails']
      : ['businessBasicDetails', 'businessDetails', 'miscellaneous'];
    return Object.keys(changedData).some(key => keySections.includes(key));
  };

  // Determine if Existing Loans and Third Party Check edit buttons should be disabled
  const shouldDisableExistingLoansAndThirdPartyCheck = hasEditRequest || hasPendingEditRequestForKeySections();

  const getButton = (formKey: string) => (
    <Button
      type="text"
      icon={<EditOutlined />}
      onClick={() => onEdit(formKey)}
      disabled={hasEditRequest}
    />
  );

  const handlePhotoRemoval = async (pid: any) => {
    // const updatedItems = data.uploadedItems.filter(
    //   (i: any) => i.id !== item.id
    // );
    const updatedItems =
      completeVerificationData?.verificationData?.uploadedItems?.filter(
        (photo: any) => photo?.id !== pid
      );

    const updatedData = {
      // findings: "",
      verificationData: {
        ...completeVerificationData.verificationData,
        uploadedItems: updatedItems,
      },
      // path: "",
      approvedStatus: "Positive",
    };
    // console.log(updatedData);
    verifierEditApi(id as string, "Business", updatedData)
      .then((res) => fetchVerificationData())
      .catch((error) => console.log(`Error:`, error));
  };

  const handleDeleteClick = (id: any) => {
    Modal.confirm({
      title: "Are you sure you want to delete this picture?",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: () => {
        handlePhotoRemoval(id);
      },
    });
  };

  const { Text } = Typography;

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

  // Dynamic section renderer based on bank configuration
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'basicDetails':
        return (
          <BusinessBasicDetailsDescription
            key="basicDetails"
            data={{
              ...data,
              bankName: verificationData?.bankName,
              applicationNumber: applicationNumber,
              loanId: loanId
            }}
            extra={getButton("businessBasicDetails")}
            logs={false}
            currentDepartment={currentDepartment}
          />
        );

      case 'familyDetails':
        return (
          <section key="familyDetails" style={{ marginBottom: 24 }}>
            <Card title="Family Details" extra={getButton("familyDetails")}>
              <Table
                className="striped-table"
                dataSource={
                  currentDepartment === 'PD' 
                    ? data?.familyMemberDetails || data?.familyDetails || []
                    : data?.familyDetails || data?.familyMemberDetails || []
                }
                columns={[
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Relation", dataIndex: "relation", key: "relation", 
                    render: (text: string, record: any) =>
                      text === "Other" && record.otherRelation
                        ? `Other - ${record.otherRelation}`
                        : text
                  },
                  { title: "Age", dataIndex: "age", key: "age" },
                  { title: "Mobile Number", dataIndex: "mobileNumber", key: "mobileNumber" },
                  { title: "Staying with Applicant", dataIndex: "stayingWithApplicant", key: "stayingWithApplicant" },
                  { title: "Employment Type", dataIndex: "employmentType", key: "employmentType" },
                  { title: "Educational Qualification", dataIndex: "educationalQualification", key: "educationalQualification" },
                ]}
                pagination={false}
                locale={{ emptyText: "No family members added yet" }}
                bordered
              />
            </Card>
          </section>
        );

      case 'shareholdingDetails':
        if (!shouldShowSection(bankName, 'shareholdingDetails')) return null;
        return (
          <section key="shareholdingDetails" style={{ marginBottom: 24 }}>
            <Card title="Shareholding Details" extra={getButton("shareholdingDetails")}>
              <Table
                className="striped-table"
                dataSource={(() => {
                  // Handle different data structures for shareholding details
                  if (Array.isArray(data?.shareholdingDetails?.shareholders)) {
                    return data.shareholdingDetails.shareholders;
                  }
                  if (Array.isArray(data?.shareholdingDetails)) {
                    return data.shareholdingDetails;
                  }
                  // If shareholdingDetails is an object with shareholders key but shareholders is not an array
                  if (data?.shareholdingDetails && typeof data.shareholdingDetails === 'object' && data.shareholdingDetails.shareholders) {
                    console.warn('Shareholding details has unexpected structure:', data.shareholdingDetails);
                    return [];
                  }
                  return [];
                })()}
                columns={[
                  { title: "Name", dataIndex: "name", key: "name" },
                  {
                    title: "Shareholding %",
                    dataIndex: "shareholdingPercentage",
                    key: "shareholdingPercentage",
                  },
                  {
                    title: "Relation with Applicant",
                    dataIndex: "relationshipWithApplicant",
                    key: "relationshipWithApplicant",
                  },
                  { title: "Designation", dataIndex: "designation", key: "designation" },
                  {
                    title: "Coming into Loan Structure",
                    dataIndex: "comingIntoLoanStructure",
                    key: "comingIntoLoanStructure",
                  },
                  {
                    title: "Functional of Partner/Director",
                    dataIndex: "functionalOfPartnerDirector",
                    key: "functionalOfPartnerDirector",
                  },
                ]}
                pagination={false}
                locale={{ emptyText: "No shareholders added yet" }}
                bordered
                style={{ marginBottom: data?.shareholdingDetails?.aboutTheBusiness ? 16 : 0 }}
              />
              {/* About the Business section */}
              {data?.shareholdingDetails?.aboutTheBusiness && (
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="About the Business">
                    {data.shareholdingDetails.aboutTheBusiness}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </section>
        );

      case 'documentsObserved':
        return (
          <section key="documentsObserved" style={{ marginBottom: 24 }}>
            <Card title="Documents Observed" extra={getButton("documentsObserved")}>
              <Table
                className="striped-table"
                dataSource={(() => {
                  // Handle different data structures for documents observed
                  if (Array.isArray(data?.documentsObserved?.documents)) {
                    return data.documentsObserved.documents;
                  }
                  if (Array.isArray(data?.documentsObserved)) {
                    return data.documentsObserved;
                  }
                  // If documentsObserved is a string or other format, return empty array
                  return [];
                })()}
                columns={[
                  { title: "Document Name", dataIndex: "documentName", key: "documentName" },
                  { title: "Document Type", dataIndex: "documentType", key: "documentType" },
                  { title: "Document Category", dataIndex: "documentCategory", key: "documentCategory" },
                  { title: "Remarks", dataIndex: "remarks", key: "remarks" },
                ]}
                pagination={false}
                locale={{ emptyText: "No documents observed yet" }}
                bordered
              />
              {/* Fallback for legacy string format */}
              {!Array.isArray(data?.documentsObserved?.documents) && 
               !Array.isArray(data?.documentsObserved) && 
               (typeof data?.documentsObserved === 'string' || data?.documentsObserved?.documents) && (
                <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
                  <Typography.Text strong>Legacy Format:</Typography.Text>
                  <div style={{ marginTop: 8 }}>
                    {data?.documentsObserved?.documents || data?.documentsObserved || "-"}
                  </div>
                </div>
              )}
            </Card>
          </section>
        );

      case 'suppliersCreditors':
        return (
          <section key="suppliersCreditors" style={{ marginBottom: 24 }}>
            <Card title="Suppliers/Creditors" extra={getButton("suppliersCreditors")}>
              <Descriptions bordered column={2} style={{ marginBottom: 12 }}>
                <Descriptions.Item label="No. of Fixed Suppliers">
                  {suppliersCreditorsData?.suppliersCreditors?.numberOfFixedSuppliers || suppliersCreditorsData?.numberOfFixedSuppliers || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Credit Period">
                  {suppliersCreditorsData?.suppliersCreditors?.creditPeriod || suppliersCreditorsData?.creditPeriod || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Cash-Cheque Proportions">
                  {suppliersCreditorsData?.suppliersCreditors?.cashChequeProportions || suppliersCreditorsData?.cashChequeProportions || "-"}
                </Descriptions.Item>
              </Descriptions>
              <Table
                className="striped-table"
                dataSource={suppliersCreditorsData?.suppliersCreditors?.suppliers || suppliersCreditorsData?.suppliers || []}
                columns={[
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Phone", dataIndex: "phone", key: "phone" },
                  { title: "Location", dataIndex: "location", key: "location" },
                  { 
                    title: "Review", 
                    dataIndex: "review", 
                    key: "review",
                    render: (review: string) => review ? review.charAt(0).toUpperCase() + review.slice(1) : "-"
                  },
                ]}
                pagination={false}
                locale={{ emptyText: "No suppliers added yet" }}
                bordered
              />
            </Card>
          </section>
        );

      case 'clientsDebtors':
        return (
          <section key="clientsDebtors" style={{ marginBottom: 24 }}>
            <Card title="Clients/Debtors" extra={getButton("clientsDebtors")}>
              <Descriptions bordered column={2} style={{ marginBottom: 12 }}>
                <Descriptions.Item label="No. of Fixed Customers">
                  {clientsDebtorsData?.clientsDebtors?.numberOfFixedCustomers || clientsDebtorsData?.numberOfFixedCustomers || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Credit Period">
                  {clientsDebtorsData?.clientsDebtors?.creditPeriod || clientsDebtorsData?.creditPeriod || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Cash-Cheque Proportions">
                  {clientsDebtorsData?.clientsDebtors?.cashChequeProportions || clientsDebtorsData?.cashChequeProportions || "-"}
                </Descriptions.Item>
              </Descriptions>
              <Typography.Text strong style={{ display: 'block', margin: '8px 0' }}>Business Metrics</Typography.Text>
              <Descriptions bordered column={2} style={{ marginBottom: 12 }}>
                <Descriptions.Item label="Average Stock Maintenance">
                  {clientsDebtorsData?.clientsDebtors?.averageStockMaintenance || clientsDebtorsData?.averageStockMaintenance || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Turnover">
                  {clientsDebtorsData?.clientsDebtors?.turnover || clientsDebtorsData?.turnover || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Net Margins">
                  {clientsDebtorsData?.clientsDebtors?.netMargins || clientsDebtorsData?.netMargins || "-"}
                </Descriptions.Item>
              </Descriptions>
              <Table
                className="striped-table"
                dataSource={
                  clientsDebtorsData?.clientsDebtors?.customers || 
                  clientsDebtorsData?.customers || 
                  [
                    {
                      name: clientsDebtorsData?.clientsDebtors?.customer1Name || clientsDebtorsData?.customer1Name,
                      phone: clientsDebtorsData?.clientsDebtors?.customer1Phone || clientsDebtorsData?.customer1Phone,
                      location: clientsDebtorsData?.clientsDebtors?.customer1Location || clientsDebtorsData?.customer1Location,
                      review: clientsDebtorsData?.clientsDebtors?.customer1Review || clientsDebtorsData?.customer1Review,
                    },
                    {
                      name: clientsDebtorsData?.clientsDebtors?.customer2Name || clientsDebtorsData?.customer2Name,
                      phone: clientsDebtorsData?.clientsDebtors?.customer2Phone || clientsDebtorsData?.customer2Phone,
                      location: clientsDebtorsData?.clientsDebtors?.customer2Location || clientsDebtorsData?.customer2Location,
                      review: clientsDebtorsData?.clientsDebtors?.customer2Review || clientsDebtorsData?.customer2Review,
                    },
                    {
                      name: clientsDebtorsData?.clientsDebtors?.customer3Name || clientsDebtorsData?.customer3Name,
                      phone: clientsDebtorsData?.clientsDebtors?.customer3Phone || clientsDebtorsData?.customer3Phone,
                      location: clientsDebtorsData?.clientsDebtors?.customer3Location || clientsDebtorsData?.customer3Location,
                      review: clientsDebtorsData?.clientsDebtors?.customer3Review || clientsDebtorsData?.customer3Review,
                    },
                  ].filter((c: any) => c && (c.name || c.phone || c.location || c.review))
                }
                columns={[
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Phone", dataIndex: "phone", key: "phone" },
                  { title: "Location", dataIndex: "location", key: "location" },
                  { 
                    title: "Review", 
                    dataIndex: "review", 
                    key: "review",
                    render: (review: string) => review ? review.charAt(0).toUpperCase() + review.slice(1) : "-"
                  },
                ]}
                pagination={false}
                locale={{ emptyText: "No customers added yet" }}
                bordered
              />
            </Card>
          </section>
        );

      case 'salariesWages':
        // Check if it's Axis Finance to show subsections
        if (isAxisFinance(bankName)) {
          return (
            <section key="salariesWages" style={{ marginBottom: 24 }}>
              <Card title="Salaries & Wages" extra={getButton("salariesWages")}>
                {/* Employee Information Subsection */}
                <div style={{ marginBottom: 24 }}>
                  <Typography.Title level={5} style={{ marginBottom: 12 }}>
                    Employee Information
                  </Typography.Title>
                  <Descriptions bordered column={3} size="small">
                    <Descriptions.Item label="No. of Employees">
                      {data?.salariesWages?.employeeInformation?.numberOfEmployees || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Salary per month per employee">
                      {data?.salariesWages?.employeeInformation?.salaryPerMonthPerEmployee || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status of Employee">
                      {data?.salariesWages?.employeeInformation?.statusOfEmployee || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                {/* Labour Information Subsection */}
                <div>
                  <Typography.Title level={5} style={{ marginBottom: 12 }}>
                    Labour Information
                  </Typography.Title>
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="No. of Labours">
                      {data?.salariesWages?.labourInformation?.numberOfLabours || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Wages per month/per day">
                      {data?.salariesWages?.labourInformation?.wagesPerMonthPerDay || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status of Labour">
                      {data?.salariesWages?.labourInformation?.statusOfLabour || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Working Hours Start">
                      {data?.salariesWages?.labourInformation?.workingHoursStart || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Working Hours End">
                      {data?.salariesWages?.labourInformation?.workingHoursEnd || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Other Major Expenditure">
                      {data?.salariesWages?.labourInformation?.otherMajorExpenditure || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Remarks" span={2}>
                      {data?.salariesWages?.labourInformation?.remarks || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Card>
            </section>
          );
        } else {
          // Original layout for other banks (Arka Fincap, etc.)
          return (
            <section key="salariesWages" style={{ marginBottom: 24 }}>
              <Card title="Salaries & Wages" extra={getButton("salariesWages")}>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="No. of Employees">
                    {salariesWagesData?.numberOfEmployees || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Salary/Employee/Month">
                    {salariesWagesData?.salaryPerMonthPerEmployee || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status of Employee">
                    {salariesWagesData?.statusOfEmployee || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No. of Labours">
                    {salariesWagesData?.numberOfLabours || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Wages per month/day">
                    {salariesWagesData?.wagesPerMonthPerDay || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status of Labour">
                    {salariesWagesData?.statusOfLabour || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Working Hours Start">
                    {salariesWagesData?.workingHoursStart || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Working Hours End">
                    {salariesWagesData?.workingHoursEnd || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Other Major Expenditure">
                    {salariesWagesData?.otherMajorExpenditure || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Remarks">
                    {salariesWagesData?.remarks || "-"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </section>
          );
        }

      case 'assetDetails':
        return (
          <section key="assetDetails" style={{ marginBottom: 24 }}>
            <Card title="Asset Details" extra={getButton("assetDetails")}>
              <Table
                className="striped-table"
                dataSource={assetDetailsData?.assets || []}
                columns={[
                  { title: "Address", dataIndex: "address", key: "address" },
                  { title: "Mortgaged", dataIndex: "mortgaged", key: "mortgaged" },
                  { title: "Owner Name", dataIndex: "ownerName", key: "ownerName" },
                  { title: "Market Value", dataIndex: "marketValue", key: "marketValue" },
                  { title: "Area Measured", dataIndex: "areaMeasured", key: "areaMeasured" },
                  { title: "Purchase Cost", dataIndex: "purchaseCost", key: "purchaseCost" },
                  { title: "Purchase Year", dataIndex: "purchaseYear", key: "purchaseYear" },
                ]}
                pagination={false}
                locale={{ emptyText: "No assets added yet" }}
                bordered
                style={{ marginBottom: 12 }}
              />
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Status">
                  {assetDetailsData?.status || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Remarks">
                  {assetDetailsData?.remarks || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Vehicles">
                  {assetDetailsData?.vehicles || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Other Income">
                  {assetDetailsData?.otherIncome || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Observations">
                  {assetDetailsData?.observations || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Site Coordinates">
                  {assetDetailsData?.siteCoordinates || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Life Insurance/Mediclaim">
                  {assetDetailsData?.lifeInsuranceMediclaim || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Capital Invested in Business">
                  {assetDetailsData?.capitalInvestedBusiness || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Liquid/Moveable/Monetary Items">
                  {assetDetailsData?.liquidMoveableMonetaryItems || "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </section>
        );

      case 'existingLoans':
        return (
          <section key="existingLoans" style={{ marginBottom: 24 }}>
            <Card
              title="Existing Loans"
              extra={
                <Button
                  style={{ border: "none" }}
                  icon={<EditOutlined />}
                  onClick={() => onEdit("existingLoans")}
                  disabled={shouldDisableExistingLoansAndThirdPartyCheck}
                />
              }
            >
              <Table
                className="striped-table"
                dataSource={data?.existingLoans?.loans || []}
                columns={[
                  { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
                  { title: "Purpose", dataIndex: "purpose", key: "purpose" },
                  { title: "Loan Amount", dataIndex: "loanAmount", key: "loanAmount" },
                  { title: "EMI", dataIndex: "emi", key: "emi" },
                  { title: "Tenure", dataIndex: "tenure", key: "tenure" },
                ]}
                pagination={false}
                locale={{ emptyText: "No existing loans added yet" }}
                bordered
              />
            </Card>
          </section>
        );

      case 'bankingDetails':
        return (
          <section key="bankingDetails" style={{ marginBottom: 24 }}>
            <Card title="Banking Details" extra={getButton("bankingDetails")}>
              {/* Bank Accounts Table */}
              <Table
                className="striped-table"
                dataSource={data?.bankingDetails?.bankAccounts || []}
                columns={[
                  { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
                  { title: "Account", dataIndex: "account", key: "account" },
                  { title: "Account Type", dataIndex: "type", key: "type" },
                  { title: "Average Balance", dataIndex: "averageBalance", key: "averageBalance" },
                  { title: "Years Maintained", dataIndex: "numberOfYearsMaintained", key: "numberOfYearsMaintained" },
                ]}
                pagination={false}
                locale={{ emptyText: "No banking details added yet" }}
                bordered
              />
              
              {/* Additional Banking Details */}
              <Row style={{ marginTop: 24 }} gutter={[16, 16]}>
                <Col span={12}>
                  <Card size="small" title="LIC/Mutual Funds">
                    <Typography.Text>{data?.bankingDetails?.licMutualFunds || "Not specified"}</Typography.Text>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="Assets">
                    <Typography.Text>{data?.bankingDetails?.assets || "Not specified"}</Typography.Text>
                  </Card>
                </Col>
              </Row>
            </Card>
          </section>
        );

      case 'businessDetails':
        return (
          <BusinessDetailsDescription
            key="businessDetails"
            data={{
              ...data,
              bankName: verificationData?.bankName,
              applicationNumber: applicationNumber,
              loanId: loanId
            }}
            extra={getButton("businessDetails")}
            logs={false}
            currentDepartment={currentDepartment}
          />
        );

      case 'financeDetails':
        return (
          <section key="financeDetails" style={{ marginBottom: 24 }}>
            <Card title="Finance Details" extra={getButton("clientsDebtors")}>
              <Descriptions bordered column={2} style={{ marginBottom: 12 }}>
                <Descriptions.Item label="No. of Fixed Customers">
                  {clientsDebtorsData?.clientsDebtors?.numberOfFixedCustomers || clientsDebtorsData?.numberOfFixedCustomers || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Credit Period">
                  {clientsDebtorsData?.clientsDebtors?.creditPeriod || clientsDebtorsData?.creditPeriod || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Cash-Cheque Proportions">
                  {clientsDebtorsData?.clientsDebtors?.cashChequeProportions || clientsDebtorsData?.cashChequeProportions || "-"}
                </Descriptions.Item>
              </Descriptions>
              <Typography.Text strong style={{ display: 'block', margin: '8px 0' }}>Business Metrics</Typography.Text>
              <Descriptions bordered column={2} style={{ marginBottom: 12 }}>
                <Descriptions.Item label="Average Stock Maintenance">
                  {clientsDebtorsData?.clientsDebtors?.averageStockMaintenance || clientsDebtorsData?.averageStockMaintenance || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Turnover">
                  {clientsDebtorsData?.clientsDebtors?.turnover || clientsDebtorsData?.turnover || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Net Margins">
                  {clientsDebtorsData?.clientsDebtors?.netMargins || clientsDebtorsData?.netMargins || "-"}
                </Descriptions.Item>
              </Descriptions>
              <Table
                className="striped-table"
                dataSource={
                  clientsDebtorsData?.clientsDebtors?.customers || 
                  clientsDebtorsData?.customers || 
                  [
                    {
                      name: clientsDebtorsData?.clientsDebtors?.customer1Name || clientsDebtorsData?.customer1Name,
                      phone: clientsDebtorsData?.clientsDebtors?.customer1Phone || clientsDebtorsData?.customer1Phone,
                      location: clientsDebtorsData?.clientsDebtors?.customer1Location || clientsDebtorsData?.customer1Location,
                      review: clientsDebtorsData?.clientsDebtors?.customer1Review || clientsDebtorsData?.customer1Review,
                    },
                    {
                      name: clientsDebtorsData?.clientsDebtors?.customer2Name || clientsDebtorsData?.customer2Name,
                      phone: clientsDebtorsData?.clientsDebtors?.customer2Phone || clientsDebtorsData?.customer2Phone,
                      location: clientsDebtorsData?.clientsDebtors?.customer2Location || clientsDebtorsData?.customer2Location,
                      review: clientsDebtorsData?.clientsDebtors?.customer2Review || clientsDebtorsData?.customer2Review,
                    },
                    {
                      name: clientsDebtorsData?.clientsDebtors?.customer3Name || clientsDebtorsData?.customer3Name,
                      phone: clientsDebtorsData?.clientsDebtors?.customer3Phone || clientsDebtorsData?.customer3Phone,
                      location: clientsDebtorsData?.clientsDebtors?.customer3Location || clientsDebtorsData?.customer3Location,
                      review: clientsDebtorsData?.clientsDebtors?.customer3Review || clientsDebtorsData?.customer3Review,
                    },
                  ].filter((c: any) => c && (c.name || c.phone || c.location || c.review))
                }
                columns={[
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Phone", dataIndex: "phone", key: "phone" },
                  { title: "Location", dataIndex: "location", key: "location" },
                  { 
                    title: "Review", 
                    dataIndex: "review", 
                    key: "review",
                    render: (review: string) => review ? review.charAt(0).toUpperCase() + review.slice(1) : "-"
                  },
                ]}
                pagination={false}
                locale={{ emptyText: "No customers added yet" }}
                bordered
              />
            </Card>
          </section>
        );

      case 'thirdPartyCheck':
        return (
          <section key="thirdPartyCheck" style={{ marginBottom: 24 }}>
            <Card
              title="Third Party Check"
              extra={
                <Button
                  style={{ border: "none" }}
                  icon={<EditOutlined />}
                  onClick={() => onEdit("thirdPartyCheck")}
                  disabled={shouldDisableExistingLoansAndThirdPartyCheck}
                />
              }
            >
              <Table
                className="striped-table"
                dataSource={data?.thirdPartyCheck?.checks || []}
                columns={[
                  { title: "TPC Name", dataIndex: "tpcName", key: "tpcName" },
                  { title: "Mobile", dataIndex: "mobileNumber", key: "mobileNumber" },
                  {
                    title: "Relationship",
                    dataIndex: "relationship",
                    key: "relationship",
                    render: (text: string, record: any) =>
                      text === "Other" && (record.otherRelation || record.relationshipOther)
                        ? `Other - ${(record.otherRelation || record.relationshipOther)}`
                        : text,
                  },
                  { title: "Feedback Status", dataIndex: "feedbackStatus", key: "feedbackStatus" },
                  { title: "Comments", dataIndex: "comments", key: "comments" },
                ]}
                pagination={false}
                locale={{ emptyText: "No references added yet" }}
                bordered
              />
            </Card>
          </section>
        );

      case 'additionalDetails':
        // Render differently based on bank type
        if (isAxisFinance(bankName)) {
          // For Axis Finance - render as simple list
          return (
            <section key="additionalDetails" style={{ marginBottom: 24 }}>
              <Card title="Additional Details">
                {(data?.additionalDetails?.details || []).length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {data?.additionalDetails?.details?.map((d: any, idx: number) => (
                      <li key={idx}>{d?.value}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ color: "#6b7280" }}>No additional details added</div>
                )}
              </Card>
            </section>
          );
        } else {
          // For ARKA FINCAP - render as BusinessMiscellaneousDescription
          return (
            <BusinessMiscellaneousDescription
              key="additionalDetails"
              data={{
                ...data,
                bankName: verificationData?.bankName,
                applicationNumber: applicationNumber,
                loanId: loanId
              }}
              extra={getButton("miscellaneous")}
              logs={false}
            />
          );
        }

      case 'photoCapture':
        return (
          <section key="photoCapture" style={{ marginBottom: 24 }}>
            <Card title="Photo Capture">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                {data?.uploadedItems?.map((item: any, idx: number) => (
                  <div key={item.id} style={{ position: "relative" }}>
                    <Image
                      src={imageUrls[item.id] || ""}
                      alt={`Photo ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<CloseCircleOutlined />}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "50%",
                        padding: 4,
                      }}
                      disabled={hasEditRequest}
                      onClick={() => handleDeleteClick(item.id)}
                    />
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
                  </div>
                ))}
              </div>
            </Card>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {currentDepartment === 'PD' ? (
        <>
          {/* Dynamic section rendering based on bank configuration */}
          {getSectionOrder(bankName).map((sectionId) => renderSection(sectionId)).filter(Boolean)}
        </>
      ) : (
        <>
          {/* Original order for non-PD */}
          <BusinessBasicDetailsDescription
            data={data}
            extra={getButton("businessBasicDetails")}
            logs={false}
            currentDepartment={currentDepartment}
          />
          <BusinessDetailsDescription
            data={data}
            extra={getButton("businessDetails")}
            logs={false}
            currentDepartment={currentDepartment}
          />
          {currentDepartment !== 'PD' && (
            <BusinessMiscellaneousDescription
              data={data}
              extra={getButton("miscellaneous")}
              logs={false}
            />
          )}
          {/* Existing Loans */}
          <section style={{ marginBottom: 24 }}>
            <Card
              title="Existing Loans"
              extra={
                <Button
                  style={{ border: "none" }}
                  icon={<EditOutlined />}
                  onClick={() => onEdit("existingLoans")}
                  disabled={shouldDisableExistingLoansAndThirdPartyCheck}
                />
              }
            >
              <Table
                className="striped-table"
                dataSource={data?.existingLoans?.loans || []}
                columns={[
                  { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
                  { title: "Purpose", dataIndex: "purpose", key: "purpose" },
                  { title: "Loan Amount", dataIndex: "loanAmount", key: "loanAmount" },
                  { title: "EMI", dataIndex: "emi", key: "emi" },
                  { title: "Tenure", dataIndex: "tenure", key: "tenure" },
                ]}
                pagination={false}
                locale={{ emptyText: "No existing loans added yet" }}
                bordered
              />
            </Card>
          </section>
          {/* Third Party Check */}
          <section style={{ marginBottom: 24 }}>
            <Card
              title="Third Party Check"
              extra={
                <Button
                  style={{ border: "none" }}
                  icon={<EditOutlined />}
                  onClick={() => onEdit("thirdPartyCheck")}
                  disabled={shouldDisableExistingLoansAndThirdPartyCheck}
                />
              }
            >
              <Table
                className="striped-table"
                dataSource={data?.thirdPartyCheck?.checks || []}
                columns={[
                  { title: "TPC Name", dataIndex: "tpcName", key: "tpcName" },
                  { title: "Mobile", dataIndex: "mobileNumber", key: "mobileNumber" },
                  {
                    title: "Relationship",
                    dataIndex: "relationship",
                    key: "relationship",
                    render: (text: string, record: any) =>
                      text === "Other" && (record.otherRelation || record.relationshipOther)
                        ? `Other - ${(record.otherRelation || record.relationshipOther)}`
                        : text,
                  },
                  { title: "Feedback Status", dataIndex: "feedbackStatus", key: "feedbackStatus" },
                  { title: "Comments", dataIndex: "comments", key: "comments" },
                ]}
                pagination={false}
                locale={{ emptyText: "No references added yet" }}
                bordered
              />
            </Card>
          </section>
        </>
      )}

      <section style={{ marginBottom: 24 }}>
        <EditRequestLogs
          currentData={data}
          changedData={changedData}
          verificationId={verificationId}
          fetchEditRequests={fetchEditRequests}
          disabled={hasEditRequest}
          admin={false}
          verificationType={activeTab}
          currentDepartment={currentDepartment}
        />
      </section>

      {/* Financial Analysis Section - Only for PD department */}
      {currentDepartment === 'PD' && (
        <section style={{ marginBottom: 24 }}>
          <Card 
            title="Financial Analysis"
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit("financialAnalysis")}
                disabled={hasEditRequest}
              />
            }
          >
            <Form form={financialForm} layout="vertical" disabled={!!verificationData?.financialAnalysis}>
            {/* Gross Profit Section */}
            <Card title={`To Gross Profit - ₹${calculatedGrossProfit.toLocaleString()}`} size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                {/* Left side - All "To" fields */}
                <Col span={12}>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item 
                        name="toOpeningStock" 
                        label="To Opening Stock"
                        rules={[createNonNegativeRule('Opening Stock')]}
                      >
                        <Input placeholder="Opening Stock" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toPurchase" 
                        label="To Purchase"
                        rules={[createNonNegativeRule('Purchase')]}
                      >
                        <Input placeholder="Purchase" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toCostOfServices" 
                        label="To Cost of Services"
                        rules={[createNonNegativeRule('Cost of Services')]}
                      >
                        <Input placeholder="Cost of Services" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toWages" 
                        label="To Wages"
                        rules={[createNonNegativeRule('Wages')]}
                      >
                        <Input placeholder="Wages" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toHamaliCharges" 
                        label="To Hamali Charges"
                        rules={[createNonNegativeRule('Hamali Charges')]}
                      >
                        <Input placeholder="Hamali Charges" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toManufacturingExpenses" 
                        label="To Manufacturing Expenses"
                        rules={[createNonNegativeRule('Manufacturing Expenses')]}
                      >
                        <Input placeholder="Manufacturing Expenses" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toPackingCharges" 
                        label="To Packing Charges"
                        rules={[createNonNegativeRule('Packing Charges')]}
                      >
                        <Input placeholder="Packing Charges" type="number" min={0} />
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
                        rules={[createNonNegativeRule('Sales')]}
                      >
                        <Input placeholder="Sales" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="byServices" 
                        label="By Services"
                        rules={[createNonNegativeRule('Services')]}
                      >
                        <Input placeholder="Services" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="byClosingStock" 
                        label="By Closing Stock"
                        rules={[createNonNegativeRule('Closing Stock')]}
                      >
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
                      <Form.Item 
                        name="toSalaries" 
                        label="To Salaries"
                        rules={[createNonNegativeRule('Salaries')]}
                      >
                        <Input placeholder="Salaries" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toRent" 
                        label="To Rent"
                        rules={[createNonNegativeRule('Rent')]}
                      >
                        <Input placeholder="Rent" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toElectricityCharges" 
                        label="To Electricity Charges"
                        rules={[createNonNegativeRule('Electricity Charges')]}
                      >
                        <Input placeholder="Electricity Charges" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toPrintingStationery" 
                        label="To Printing & Stationery"
                        rules={[createNonNegativeRule('Printing & Stationery')]}
                      >
                        <Input placeholder="Printing & Stationery" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toTelephoneCharges" 
                        label="To Telephone Charges"
                        rules={[createNonNegativeRule('Telephone Charges')]}
                      >
                        <Input placeholder="Telephone Charges" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toPostageTelegram" 
                        label="To Postage & Telegram"
                        rules={[createNonNegativeRule('Postage & Telegram')]}
                      >
                        <Input placeholder="Postage & Telegram" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toOfficeMaintenance" 
                        label="To Office Maintenance"
                        rules={[createNonNegativeRule('Office Maintenance')]}
                      >
                        <Input placeholder="Office Maintenance" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toRepairsMaintenance" 
                        label="To Repairs & Maintenance"
                        rules={[createNonNegativeRule('Repairs & Maintenance')]}
                      >
                        <Input placeholder="Repairs & Maintenance" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toSadarExpenses" 
                        label="To Sadar Expenses"
                        rules={[createNonNegativeRule('Sadar Expenses')]}
                      >
                        <Input placeholder="Sadar Expenses" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toAuditFee" 
                        label="To Audit Fee"
                        rules={[createNonNegativeRule('Audit Fee')]}
                      >
                        <Input placeholder="Audit Fee" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toAdvertisement" 
                        label="To Advertisement"
                        rules={[createNonNegativeRule('Advertisement')]}
                      >
                        <Input placeholder="Advertisement" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toBankCharges" 
                        label="To Bank Charges"
                        rules={[createNonNegativeRule('Bank Charges')]}
                      >
                        <Input placeholder="Bank Charges" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toInsurance" 
                        label="To Insurance"
                        rules={[createNonNegativeRule('Insurance')]}
                      >
                        <Input placeholder="Insurance" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toDepreciation" 
                        label="To Depreciation"
                        rules={[createNonNegativeRule('Depreciation')]}
                      >
                        <Input placeholder="Depreciation" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="toInterestOnLoan" 
                        label="To Interest on Loan"
                        rules={[createNonNegativeRule('Interest on Loan')]}
                      >
                        <Input placeholder="Interest on Loan" type="number" min={0} />
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
                        rules={[createNonNegativeRule('Rent Received')]}
                      >
                        <Input placeholder="Rent Received" type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item 
                        name="byCommissionReceived" 
                        label="By Commission Received"
                        rules={[createNonNegativeRule('Commission Received')]}
                      >
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

      {/* Submit Financial Analysis Button - Only for PD department */}
      {currentDepartment === 'PD' && (
        <section style={{ marginBottom: 24 }}>
          <Card>
            <Row justify="end">
              <Col>
                <Button 
                  type="primary" 
                  size="small"
                  onClick={handleFinancialSubmit}
                  loading={loading}
                  disabled={loading || !!verificationData?.financialAnalysis}
                  style={{
                    background: (loading || !!verificationData?.financialAnalysis) ? "#9ca3af" : "#1e40af",
                    border: "none",
                    borderRadius: "6px",
                    height: "32px",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: (loading || !!verificationData?.financialAnalysis) ? "none" : "0 2px 8px rgba(30, 64, 175, 0.3)",
                    color: "#ffffff"
                  }}
                >
                  {loading ? "Submitting..." : (!!verificationData?.financialAnalysis ? "Financial Analysis Already Submitted" : "Submit Financial Analysis")}
                </Button>
              </Col>
            </Row>
          </Card>
        </section>
      )}

      {/* <Card style={{marginBottom:24, textAlign:"center"}}> */}
      {/* <section style={{marginBottom:24, textAlign:"center", padding:8}}> */}
      {/* <Button icon={<EyeOutlined />} onClick={()=>{
          setOpen(true)
        }}>Preview</Button> */}
      {currentDepartment === 'PD' ? (
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
      <Footer
        editorContent={editorContent}
        disabled={hasEditRequest}
        handleSave={handleSave}
        verdict={completeVerificationData?.approvedStatus}
        open={open}
        setOpen={setOpen}
        verificationType="Business"
      />
    </>
  );
};
