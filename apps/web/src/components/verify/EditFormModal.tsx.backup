import { useTabContext } from "@/pages/verify/[id]";
import { EditFormModalProps } from "@/utils/verifierInterface";
import { Form, message, Modal, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormSelector } from "./VerificationEditForms";
import { updateFinancialAnalysis } from "@/services/verifier.services";
import { useDepartmentChange } from "@/utils/utility";
import _ from "lodash";

const formKeyMapping: Record<string, string> = {
  businessBasicDetails: "basicDetails",
  workBasicDetails: "basicDetails",
  toGrossProfit: "toGrossProfit",
  toNetProfit: "toNetProfit",
  // PD department specific mappings
  applicantDetails: "applicantDetails",
  familyDetails: "familyMemberDetails",
};

interface ExtendedEditFormModalProps extends EditFormModalProps {
  onEditSuccess?: () => void;
}

export const EditFormModal: React.FC<ExtendedEditFormModalProps> = ({
  visible,
  onCancel,
  formKey,
  initialValues,
  currentTab,
  fetchVerificationData,
  onEditSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { activeTab } = useTabContext();
  const currentDepartment = useDepartmentChange();
  // const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      const currentVerification = initialValues?.verifications?.find(
        (v: any) => v.type === currentTab
      );
      
      // Handle financial analysis data differently since it's not nested under verificationData
      if (formKey === "financialAnalysis") {
        const financialData = currentVerification?.financialAnalysis;
        if (financialData) {
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
          form.setFieldsValue(formValues);
        }
      } else if (currentDepartment === 'PD') {
        // Handle PD department data structure
        if (formKey === "applicantDetails") {
          const applicantData = currentVerification?.verificationData?.applicantDetails;
          if (applicantData) {
            form.setFieldsValue(applicantData);
          }
        } else if (formKey === "familyDetails") {
          const familyData = currentVerification?.verificationData?.familyMemberDetails || currentVerification?.verificationData?.familyDetails;
          if (familyData) {
            form.setFieldsValue({ familyMemberDetails: familyData });
          }
        } else if (formKey === "businessBasicDetails") {
          const basicData = currentVerification?.verificationData?.basicDetails;
          if (basicData) {
            form.setFieldsValue(basicData);
          }
        } else if (formKey === "businessDetails") {
          const businessData = currentVerification?.verificationData?.businessDetails;
          if (businessData) {
            form.setFieldsValue(businessData);
          }
        } else if (formKey === "shareholdingDetails") {
          const shareData = currentVerification?.verificationData?.shareholdingDetails;
          if (shareData) {
            // Form expects { shareholders: [...] }
            form.setFieldsValue(shareData);
          }
        } else if (formKey === "suppliersCreditors") {
          const supData = currentVerification?.verificationData?.suppliersCreditors;
          if (supData) {
            form.setFieldsValue({ suppliersCreditors: supData });
          }
        } else if (formKey === "clientsDebtors") {
          const cliData = currentVerification?.verificationData?.clientsDebtors;
          if (cliData) {
            const customers = Array.isArray(cliData.customers) ? cliData.customers : [];
            const mappedCustomers = {
              customer1Name: customers[0]?.name,
              customer1Phone: customers[0]?.phone,
              customer1Location: customers[0]?.location,
              customer1Review: customers[0]?.review,
              customer2Name: customers[1]?.name,
              customer2Phone: customers[1]?.phone,
              customer2Location: customers[1]?.location,
              customer2Review: customers[1]?.review,
              customer3Name: customers[2]?.name,
              customer3Phone: customers[2]?.phone,
              customer3Location: customers[2]?.location,
              customer3Review: customers[2]?.review,
            };
            form.setFieldsValue({ clientsDebtors: { ...cliData, ...mappedCustomers } });
          }
        } else if (formKey === "salariesWages") {
          const salData = currentVerification?.verificationData?.salariesWages;
          if (salData) {
            form.setFieldsValue({ salariesWages: salData });
          }
        } else if (formKey === "assetDetails") {
          const assetData = currentVerification?.verificationData?.assetDetails;
          if (assetData) {
            form.setFieldsValue({ assetDetails: assetData });
          }
        } else {
          // Handle other PD forms normally
          form.setFieldsValue(currentVerification?.verificationData || {});
        }
      } else {
        // Handle other forms normally
        form.setFieldsValue(currentVerification?.verificationData || {});
      }
    }
  }, [visible, initialValues, form, formKey, currentTab, currentDepartment]);

  const getInitialValues = async () => {
    const currentVerification = initialValues?.verifications?.find(
      (v: any) => v.addressType === currentTab
    );
    
    // Handle financial analysis data differently
    if (formKey === "financialAnalysis") {
      return currentVerification?.financialAnalysis;
    }
    
    // For PD department, handle data structure differently
    if (currentDepartment === 'PD') {
      if (formKey === "applicantDetails") {
        return currentVerification?.verificationData?.applicantDetails;
      }
      if (formKey === "familyDetails") {
        return { familyMemberDetails: (currentVerification?.verificationData?.familyMemberDetails || currentVerification?.verificationData?.familyDetails || []) };
      }
      if (formKey === "businessBasicDetails") {
        return currentVerification?.verificationData?.basicDetails;
      }
      if (formKey === "businessDetails") {
        return currentVerification?.verificationData?.businessDetails;
      }
      if (formKey === "shareholdingDetails") {
        return currentVerification?.verificationData?.shareholdingDetails;
      }
      if (formKey === "suppliersCreditors") {
        return { suppliersCreditors: currentVerification?.verificationData?.suppliersCreditors };
      }
      if (formKey === "clientsDebtors") {
        return { clientsDebtors: currentVerification?.verificationData?.clientsDebtors };
      }
      if (formKey === "salariesWages") {
        return { salariesWages: currentVerification?.verificationData?.salariesWages };
      }
      if (formKey === "assetDetails") {
        return { assetDetails: currentVerification?.verificationData?.assetDetails };
      }
    }
    
    // Handle other forms normally
    return currentVerification?.verificationData?.[formKeyMapping[formKey] || formKey];
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Validate form first. If invalid, this will throw and skip the rest.
      const values = await form.validateFields();
      // Only proceed if validation passes

      const formValues =
        formKey === "familyMemberDetails"
          ? Object.values(values?.familyMemberDetails)
          : values;
      console.log(formValues);
      const initialValues = await getInitialValues();
      const cleanedInitialValues = Object.fromEntries(
        Object.entries(initialValues).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );
      const isChanged =
        JSON.stringify(_.sortBy(Object.entries(formValues))) !==
        JSON.stringify(_.sortBy(Object.entries(cleanedInitialValues)));

      if (isChanged) {
        // Handle financial analysis submissions differently
        if (formKey === "financialAnalysis") {
          try {
            // Calculate gross profit and net profit
            const openingStock = parseFloat(values.toOpeningStock) || 0;
            const purchase = parseFloat(values.toPurchase) || 0;
            const costOfServices = parseFloat(values.toCostOfServices) || 0;
            const wages = parseFloat(values.toWages) || 0;
            const hamaliCharges = parseFloat(values.toHamaliCharges) || 0;
            const manufacturingExpenses = parseFloat(values.toManufacturingExpenses) || 0;
            const packingCharges = parseFloat(values.toPackingCharges) || 0;
            const sales = parseFloat(values.bySales) || 0;
            const services = parseFloat(values.byServices) || 0;
            const closingStock = parseFloat(values.byClosingStock) || 0;
            const salaries = parseFloat(values.toSalaries) || 0;
            const rent = parseFloat(values.toRent) || 0;
            const electricityCharges = parseFloat(values.toElectricityCharges) || 0;
            const printingStationery = parseFloat(values.toPrintingStationery) || 0;
            const telephoneCharges = parseFloat(values.toTelephoneCharges) || 0;
            const postageTelegram = parseFloat(values.toPostageTelegram) || 0;
            const officeMaintenance = parseFloat(values.toOfficeMaintenance) || 0;
            const repairsMaintenance = parseFloat(values.toRepairsMaintenance) || 0;
            const sadarExpenses = parseFloat(values.toSadarExpenses) || 0;
            const auditFee = parseFloat(values.toAuditFee) || 0;
            const advertisement = parseFloat(values.toAdvertisement) || 0;
            const bankCharges = parseFloat(values.toBankCharges) || 0;
            const insurance = parseFloat(values.toInsurance) || 0;
            const depreciation = parseFloat(values.toDepreciation) || 0;
            const interestOnLoan = parseFloat(values.toInterestOnLoan) || 0;
            const rentReceived = parseFloat(values.byRentReceived) || 0;
            const commissionReceived = parseFloat(values.byCommissionReceived) || 0;

            // Calculate Gross Profit
            // Gross Profit = (Sales + Services + Closing Stock) - (Opening Stock + Purchases + Cost of Services + Wages + Hamali + Manufacturing + Packing)
            const grossProfit = (sales + services + closingStock) - (openingStock + purchase + costOfServices + wages + hamaliCharges + manufacturingExpenses + packingCharges);

            // Calculate Net Profit
            // Net Profit = (Gross Profit + Other Incomes) - (Indirect Expenses)
            // Other Incomes = Rent Received + Commission Received
            // Indirect Expenses = Salaries + Rent + Electricity + Printing & Stationery + Telephone + Postage + Office Maintenance + Repairs & Maintenance + Sadar Expenses + Audit Fee + Advertisement + Bank Charges + Insurance + Depreciation + Interest on Loan
            const indirectExpenses = salaries + rent + electricityCharges + printingStationery + 
              telephoneCharges + postageTelegram + officeMaintenance + repairsMaintenance + 
              sadarExpenses + auditFee + advertisement + bankCharges + insurance + 
              depreciation + interestOnLoan;
            const otherIncomes = rentReceived + commissionReceived;
            const netProfit = grossProfit + otherIncomes - indirectExpenses;

            // Prepare the financial analysis payload
            const financialData = {
              openingStock,
              purchase,
              costOfServices,
              wages,
              hamaliCharges,
              manufacturingExpenses,
              packingCharges,
              sales,
              services,
              closingStock,
              salaries,
              rent,
              electricityCharges,
              printingStationery,
              telephoneCharges,
              postageTelegram,
              officeMaintenance,
              repairsMaintenance,
              sadarExpenses,
              auditFee,
              advertisement,
              bankCharges,
              insurance,
              depreciation,
              interestOnLoan,
              rentReceived,
              commissionReceived,
              grossProfit,
              netProfit
            };

            // Call the PATCH API for financial analysis
            await updateFinancialAnalysis(id as string, financialData);
            message.success("Financial analysis updated successfully!");
            fetchVerificationData();
            onEditSuccess?.();
            onCancel();
            return;
          } catch (error) {
            console.error("Error updating financial analysis:", error);
            message.error("Failed to update financial analysis");
            setLoading(false);
            return;
          }
        }

        // Handle other forms normally
        const mappedKey = formKeyMapping[formKey] || formKey;
        
        // For PD department, handle data structure differently
        let finalData: Record<string, any>;
        if (currentDepartment === 'PD') {
          if (formKey === "businessBasicDetails") {
            finalData = {
              basicDetails: formValues,
            };
          } else if (formKey === "businessDetails") {
            finalData = {
              businessDetails: formValues,
            };
          } else if (formKey === "applicantDetails") {
            finalData = {
              applicantDetails: formValues,
            };
          } else if (formKey === "familyDetails") {
            finalData = {
              familyMemberDetails: formValues.familyMemberDetails || [],
            };
          } else {
            finalData = {
              [mappedKey]: formValues,
            };
          }
        } else {
          finalData = {
            [mappedKey]: formValues,
          };
        }

        const request = indexedDB.open("editLogs", 1);

        request.onerror = (event) => {
          console.error("Database error:", request.error);
          message.error("Failed to save changes: Database error");
        };

        request.onsuccess = (event: any) => {
          const db = request.result;

          try {
            const transaction = db.transaction("logs", "readwrite");
            const store = transaction.objectStore("logs");

            const getRequest = store.get(`${id}_${activeTab}`);

            getRequest.onsuccess = () => {
              const existingData = getRequest.result || {};

              const logEntry = {
                id: `${id}_${activeTab}`,
                ...existingData,
                ...finalData,
                timestamp: new Date().toISOString(),
              };

              const putRequest = store.put(logEntry);

              putRequest.onsuccess = () => {
                message.success("Changes saved to edit logs successfully");
                form.resetFields();
                fetchVerificationData();
                onEditSuccess?.();
                onCancel();
              };

              putRequest.onerror = () => {
                console.error("Error saving log:", putRequest.error);
                message.error("Failed to save edit log");
              };
            };

            getRequest.onerror = () => {
              console.error("Error fetching existing log:", getRequest.error);
              // If we can't read existing data, just save the new data
              const logEntry = {
                id: `${id}_${activeTab}`,
                ...finalData,
                timestamp: new Date().toISOString(),
              };

              const putRequest = store.put(logEntry);
              putRequest.onsuccess = () => {
                message.success("Changes saved to edit logs successfully");
                form.resetFields();
                fetchVerificationData();
                onEditSuccess?.();
                onCancel();
              };
            };

            transaction.oncomplete = () => {
              db.close();
            };

            transaction.onerror = () => {
              console.error("Transaction error:", transaction.error);
              message.error("Failed to save changes: Transaction error");
              db.close();
            };
          } catch (error) {
            console.error("Error in database operation:", error);
            message.error("Failed to save changes: Operation error");
            db.close();
          }
        };
      } else {
        // If not changed, check if a log exists and update it by removing the data related to formKey
        const request = indexedDB.open("editLogs", 1);
        request.onerror = (event) => {
          console.error("Database error:", request.error);
        };
        request.onsuccess = (event: any) => {
          const db = request.result;
          try {
            const transaction = db.transaction("logs", "readwrite");
            const store = transaction.objectStore("logs");
            const key = `${id}_${activeTab}`;
            const getRequest = store.get(key);
            getRequest.onsuccess = () => {
              const existingData = getRequest.result;
              if (existingData) {
                const mappedKey = formKeyMapping[formKey] || formKey;
                // Remove the data related to formKey
                const updatedData = { ...existingData };
                delete updatedData[mappedKey];
                // Optionally, check if only id and timestamp remain
                // If so, you could delete the log, but per instruction, just update it
                const putRequest = store.put(updatedData);
                putRequest.onsuccess = () => {
                  message.success("Removed stale form data from edit log");
                  // console.log("Removed stale form data from edit log");
                  onEditSuccess?.();
                };
                putRequest.onerror = () => {
                  console.error("Error updating log:", putRequest.error);
                };
              }
            };
            getRequest.onerror = () => {
              console.error(
                "Error checking for existing log:",
                getRequest.error
              );
            };
            transaction.oncomplete = () => {
              db.close();
            };
            transaction.onerror = () => {
              console.error("Transaction error:", transaction.error);
              db.close();
            };
          } catch (error) {
            console.error("Error in database operation:", error);
            db.close();
          }
        };
      }
      onCancel();
    } catch (error) {
      // If validation fails, AntD will show errors on the form fields automatically
      // Only show a message if you want a global error
      // message.error("Please fill all required fields correctly.");
      setLoading(false);
    }
  };

  const getMaritalStatus = () => {
    return initialValues?.verifications?.find(
      (v: any) => v.addressType === currentTab
    )?.verificationData?.basicDetails?.maritalStatus;
  };

  // console.log(initialValues);

  console.log(
    initialValues?.verifications?.find((v: any) => v.addressType === currentTab)
      ?.verificationData?.[formKeyMapping[formKey] || formKey]
  );

  return (
    <Modal
      title={`Edit ${formKey.replace(/([A-Z])/g, " $1").trim()}`}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      width={"100%"}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          formKey === "familyMemberDetails"
            ? {
                familyMemberDetails: initialValues?.verifications?.find(
                  (v: any) => v.addressType === currentTab
                )?.verificationData?.[formKeyMapping[formKey] || formKey],
              }
            : formKey === "financialAnalysis"
            ? {
                // For financial analysis, we'll set initial values in useEffect
                // since the data structure is different
              }
            : currentDepartment === 'PD' && formKey === "familyDetails"
            ? {
                familyMemberDetails: initialValues?.verifications?.find(
                  (v: any) => v.addressType === currentTab
                )?.verificationData?.familyMemberDetails || [],
              }
            : currentDepartment === 'PD' && formKey === "applicantDetails"
            ? initialValues?.verifications?.find(
                (v: any) => v.addressType === currentTab
              )?.verificationData?.applicantDetails
            : currentDepartment === 'PD' && formKey === "businessBasicDetails"
            ? initialValues?.verifications?.find(
                (v: any) => v.addressType === currentTab
              )?.verificationData?.basicDetails
            : currentDepartment === 'PD' && formKey === "businessDetails"
            ? initialValues?.verifications?.find(
                (v: any) => v.addressType === currentTab
              )?.verificationData?.businessDetails
            : currentDepartment === 'PD' && formKey === "shareholdingDetails"
            ? initialValues?.verifications?.find(
                (v: any) => v.addressType === currentTab
              )?.verificationData?.shareholdingDetails
            : currentDepartment === 'PD' && formKey === "suppliersCreditors"
            ? initialValues?.verifications?.find(
                (v: any) => v.addressType === currentTab
              )?.verificationData?.suppliersCreditors
            : currentDepartment === 'PD' && formKey === "clientsDebtors"
            ? initialValues?.verifications?.find(
                (v: any) => v.addressType === currentTab
              )?.verificationData?.clientsDebtors
            : currentDepartment === 'PD' && formKey === "salariesWages"
            ? initialValues?.verifications?.find(
                (v: any) => v.addressType === currentTab
              )?.verificationData?.salariesWages
            : currentDepartment === 'PD' && formKey === "assetDetails"
            ? initialValues?.verifications?.find(
                (v: any) => v.addressType === currentTab
              )?.verificationData?.assetDetails
            : initialValues?.verifications?.find(
                (v: any) => v.addressType === currentTab
              )?.verificationData?.[formKeyMapping[formKey] || formKey]
        }
        // onValuesChange={() => setDirty(true)}
        // preserve={false}
      >
        <Row gutter={[12, 0]}>
          <FormSelector
            form={form}
            formKey={formKey}
            currentTab={currentTab}
            getMaritalStatus={getMaritalStatus}
            currentDepartment={currentDepartment}
          />
        </Row>
      </Form>
    </Modal>
  );
};
