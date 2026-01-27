import { useTabContext } from "@/pages/verify/[id]";
import { EditFormModalProps } from "@/utils/verifierInterface";
import { Form, message, Modal, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { FormSelector } from "./VerificationEditForms";
import { updateFinancialAnalysis } from "@/services/verifier.services";
import { useDepartmentChange } from "@/utils/utility";
import { getSchemaFromBackend } from "@/services/schema.service";
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
  const initialValuesSetRef = useRef(false);
  const [financialSchemaProperties, setFinancialSchemaProperties] = useState<Record<string, any> | null>(null);

  const evaluateFormula = (
    formula: string,
    formValues: Record<string, any>
  ): number | null => {
    if (!formula || typeof formula !== "string") return null;

    try {
      let evaluatedFormula = formula;

      const fieldNameMatches = formula.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g);
      const fieldNamesInFormula = fieldNameMatches || [];

      for (const fieldName of fieldNamesInFormula) {
        const jsKeywords = [
          'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
        ];
        if (jsKeywords.includes(fieldName)) continue;

        const regex = new RegExp(`\\b${fieldName}\\b`, 'g');
        const value = formValues[fieldName];

        let numValue = 0;
        if (value !== undefined && value !== null && value !== '') {
          const parsed = typeof value === 'number' ? value : parseFloat(String(value));
          if (!isNaN(parsed)) {
            numValue = parsed;
          }
        }

        evaluatedFormula = evaluatedFormula.replace(regex, String(numValue));
      }

      const result = Function(
        '"use strict"; return (' + evaluatedFormula + ')',
      )();
      return typeof result === 'number' && !isNaN(result) ? result : null;
    } catch (error) {
      return null;
    }
  };

  const evaluateNestedFormulas = (
    properties: Record<string, any>,
    objectValues: Record<string, any>,
    parentKey: string = '',
    calculatedSoFar: Record<string, any> = {},
  ): Record<string, any> => {
    const calculatedFields: Record<string, any> = {};
    const currentCalculated: Record<string, any> = {...calculatedSoFar};

    Object.entries(properties).forEach(([fieldId, property]) => {
      if ((property as any).formula) {
        const numericValues: Record<string, any> = {};

        Object.entries(objectValues).forEach(([key, val]) => {
          const fieldSchema = properties[key];
          if (
            fieldSchema?.type === 'number' ||
            fieldSchema?.type === 'integer'
          ) {
            const numVal =
              typeof val === 'number' ? val : parseFloat(String(val));
            numericValues[key] = isNaN(numVal) ? 0 : numVal;
          } else {
            numericValues[key] =
              val === undefined || val === null || val === '' ? 0 : val;
          }
        });

        Object.entries(currentCalculated).forEach(([key, val]) => {
          if (!(key in numericValues)) {
            const numVal =
              typeof val === 'number' ? val : parseFloat(String(val));
            numericValues[key] = isNaN(numVal) ? 0 : numVal;
          }
        });

        Object.keys(properties).forEach(key => {
          if (!(key in numericValues)) {
            numericValues[key] = 0;
          }
        });

        const calculatedValue = evaluateFormula(
          (property as any).formula,
          numericValues,
        );
        if (calculatedValue !== null && !isNaN(calculatedValue)) {
          const calculatedStr = calculatedValue.toString();
          currentCalculated[fieldId] = calculatedValue;

          if (parentKey) {
            if (!calculatedFields[parentKey]) {
              calculatedFields[parentKey] = {};
            }
            calculatedFields[parentKey][fieldId] = calculatedStr;
          } else {
            calculatedFields[fieldId] = calculatedStr;
          }
        }
      }

      if (property.type === 'object' && property.properties) {
        const nestedObjectValues = objectValues[fieldId] || {};
        const nestedCalculated = evaluateNestedFormulas(
          property.properties,
          nestedObjectValues,
          parentKey ? parentKey : fieldId,
          {},
        );

        if (parentKey) {
          if (!calculatedFields[parentKey]) {
            calculatedFields[parentKey] = {};
          }
          Object.entries(nestedCalculated).forEach(([nestedKey, nestedVal]) => {
            if (typeof nestedVal === 'object' && nestedVal !== null) {
              calculatedFields[parentKey] = {
                ...calculatedFields[parentKey],
                ...nestedVal,
              };
            } else {
              calculatedFields[parentKey][nestedKey] = nestedVal;
            }
          });
        } else {
          if (!calculatedFields[fieldId]) {
            calculatedFields[fieldId] = {};
          }
          Object.entries(nestedCalculated).forEach(([nestedKey, nestedVal]) => {
            if (typeof nestedVal === 'object' && nestedVal !== null) {
              calculatedFields[fieldId] = {
                ...calculatedFields[fieldId],
                ...nestedVal,
              };
            } else {
              calculatedFields[fieldId][nestedKey] = nestedVal;
            }
          });
        }
      }
    });

    return calculatedFields;
  };

  useEffect(() => {
    if (formKey !== "financialAnalysis" || !visible) return;

    const fetchSchema = async () => {
      try {
        const currentVerification = initialValues?.verifications?.find(
          (v: any) => v.type === currentTab
        );
        const bankName = currentVerification?.bankName || initialValues?.loan?.bankName || "";
        const templateName = initialValues?.loan?.templateName || "";

        if (!bankName && !templateName) {
          console.warn("No bank name or template name found for schema fetch");
          return;
        }

        const schemaResponse = await getSchemaFromBackend(
          bankName || templateName,
          "PD"
        );

        const financialSection = schemaResponse?.schema?.sections?.find(
          (section: any) => section.id === "financialAnalysis"
        );

        if (financialSection?.schema?.properties) {
          setFinancialSchemaProperties(financialSection.schema.properties);
        }
      } catch (error) {
        console.error("Error fetching financial analysis schema:", error);
      }
    };

    fetchSchema();
  }, [formKey, visible, initialValues, currentTab]);

  const formValues = Form.useWatch([], form);

  useEffect(() => {
    if (formKey !== "financialAnalysis" || !visible || !formValues || !financialSchemaProperties) return;

    const calculatedFields = evaluateNestedFormulas(
      financialSchemaProperties,
      formValues,
    );

    if (Object.keys(calculatedFields).length > 0) {
      Object.entries(calculatedFields).forEach(([key, val]) => {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          const currentValue = formValues[key] || {};
          const updatedNested: Record<string, any> = {...currentValue};
          let hasChanges = false;

          Object.entries(val).forEach(([nestedKey, nestedVal]) => {
            const currentNestedValue = currentValue[nestedKey];
            const currentStr =
              currentNestedValue !== undefined && currentNestedValue !== null
                ? String(currentNestedValue)
                : '';
            const newStr =
              nestedVal !== undefined && nestedVal !== null
                ? String(nestedVal)
                : '';

            if (currentStr !== newStr) {
              const currentNum = parseFloat(currentStr || '0');
              const newNum = parseFloat(newStr || '0');

              if (
                isNaN(currentNum) ||
                Math.abs(currentNum - newNum) > 0.0001
              ) {
                updatedNested[nestedKey] = nestedVal;
                hasChanges = true;
              }
            }
          });

          if (hasChanges) {
            form.setFieldsValue({ [key]: updatedNested });
          }
        } else {
          const currentValue = formValues[key];
          const currentNum =
            typeof currentValue === 'number'
              ? currentValue
              : parseFloat(String(currentValue || '0'));
          const newNum =
            typeof val === 'number' ? val : parseFloat(String(val || '0'));

          if (isNaN(currentNum) || Math.abs(currentNum - newNum) > 0.0001) {
            form.setFieldsValue({ [key]: val });
          }
        }
      });
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, formKey, visible, financialSchemaProperties]);

  useEffect(() => {
    if (!visible) {
      initialValuesSetRef.current = false;
      setFinancialSchemaProperties(null);
      form.resetFields();
    }
  }, [visible, form]);

  useEffect(() => {
    // Only set initial values once when modal first opens
    if (visible && initialValues && !initialValuesSetRef.current) {
      initialValuesSetRef.current = true;
      
      const currentVerification = initialValues?.verifications?.find(
        (v: any) => v.type === currentTab || v.addressType === currentTab
      );

      if (currentTab === "Work") {
        if (formKey === "workBasicDetails") {
          const basicData = currentVerification?.verificationData?.basicDetails;
          if (basicData) {
            form.setFieldsValue(basicData);
          }
        } else if (formKey === "employmentDetails") {
          const employmentData = currentVerification?.verificationData?.employmentDetails;
          if (employmentData) {
            form.setFieldsValue(employmentData);
          }
        }
      } else if (formKey === "financialAnalysis") {
        const financialData = currentVerification?.financialAnalysis;
        if (financialData) {
          const formValues: Record<string, any> = {};
          
          Object.keys(financialData).forEach((key) => {
            const value = financialData[key];
            if (value !== undefined && value !== null) {
              formValues[key] = typeof value === "number" ? value : value.toString();
            }
          });
          
          form.setFieldsValue(formValues);
        }
      } else if (currentDepartment === "PD") {
        // Handle PD department data structure
        if (formKey === "applicantDetails") {
          const applicantData =
            currentVerification?.verificationData?.applicantDetails;
          if (applicantData) {
            form.setFieldsValue(applicantData);
          }
        } else if (formKey === "familyDetails") {
          const familyData =
            currentVerification?.verificationData?.familyMemberDetails ||
            currentVerification?.verificationData?.familyDetails;
          if (familyData) {
            form.setFieldsValue({ familyMemberDetails: familyData });
          }
        } else if (formKey === "businessBasicDetails") {
          const basicData = currentVerification?.verificationData?.basicDetails;
          if (basicData) {
            form.setFieldsValue(basicData);
          }
        } else if (formKey === "businessDetails") {
          const businessData =
            currentVerification?.verificationData?.businessDetails;
          if (businessData) {
            form.setFieldsValue(businessData);
          }
        } else if (formKey === "shareholdingDetails") {
          const shareData =
            currentVerification?.verificationData?.shareholdingDetails;
          if (shareData) {
            // Form expects { shareholders: [...] }
            form.setFieldsValue(shareData);
          }
        } else if (formKey === "suppliersCreditors") {
          const supData =
            currentVerification?.verificationData?.suppliersCreditors;
          if (supData) {
            form.setFieldsValue({ suppliersCreditors: supData });
          }
        } else if (formKey === "clientsDebtors") {
          const cliData = currentVerification?.verificationData?.clientsDebtors;
          if (cliData) {
            const customers = Array.isArray(cliData.customers)
              ? cliData.customers
              : [];
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
            form.setFieldsValue({
              clientsDebtors: { ...cliData, ...mappedCustomers },
            });
          }
        } else if (formKey === "salariesWages") {
          const salData = currentVerification?.verificationData?.salariesWages;
          if (salData) {
            form.setFieldsValue({ salariesWages: salData });
          }
        } else if (formKey === "documentsObserved") {
          const docData =
            currentVerification?.verificationData?.documentsObserved;
          if (docData) {
            form.setFieldsValue({ documentsObserved: docData });
          }
          // Tata UBL specific form handling
        } else if (
          formKey === "basicDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const basicData = currentVerification?.verificationData?.basicDetails;
          if (basicData) {
            form.setFieldsValue({ basicDetails: basicData });
          }
        } else if (
          formKey === "proposedLoanDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const loanData =
            currentVerification?.verificationData?.proposedLoanDetails;
          if (loanData) {
            form.setFieldsValue({ proposedLoanDetails: loanData });
          }
        } else if (
          formKey === "officeAddress" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const officeData =
            currentVerification?.verificationData?.officeAddress;
          if (officeData) {
            form.setFieldsValue({ officeAddress: officeData });
          }
        } else if (
          formKey === "residentialAddress" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const resData =
            currentVerification?.verificationData?.residentialAddress;
          if (resData) {
            form.setFieldsValue({ residentialAddress: resData });
          }
        } else if (
          formKey === "employeeDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const empData =
            currentVerification?.verificationData?.employeeDetails;
          if (empData) {
            form.setFieldsValue({ employeeDetails: empData });
          }
        } else if (
          formKey === "bankDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const bankData = currentVerification?.verificationData?.bankDetails;
          if (bankData) {
            form.setFieldsValue({ bankDetails: bankData });
          }
        } else if (
          formKey === "salesAndProfitDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const salesData =
            currentVerification?.verificationData?.salesAndProfitDetails;
          if (salesData) {
            form.setFieldsValue({ salesAndProfitDetails: salesData });
          }
        } else if (
          formKey === "customersDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const custData =
            currentVerification?.verificationData?.customersDetails;
          if (custData) {
            form.setFieldsValue({ customersDetails: custData });
          }
        } else if (
          formKey === "supplierDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const suppData =
            currentVerification?.verificationData?.supplierDetails;
          if (suppData) {
            form.setFieldsValue({ supplierDetails: suppData });
          }
        } else if (
          formKey === "additionalBusinessDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const addBizData =
            currentVerification?.verificationData?.additionalBusinessDetails;
          if (addBizData) {
            form.setFieldsValue({ additionalBusinessDetails: addBizData });
          }
        } else if (
          formKey === "existingLoans" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const loanData = currentVerification?.verificationData?.existingLoans;
          if (loanData) {
            form.setFieldsValue({ existingLoans: loanData });
          }
        } else if (
          formKey === "miscelleanousDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const miscData =
            currentVerification?.verificationData?.miscelleanousDetails;
          if (miscData) {
            form.setFieldsValue({ miscelleanousDetails: miscData });
          }
        } else if (
          formKey === "valueAddedDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const valueData =
            currentVerification?.verificationData?.valueAddedDetails;
          if (valueData) {
            form.setFieldsValue({ valueAddedDetails: valueData });
          }
        } else if (
          formKey === "siteVisitDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const siteData =
            currentVerification?.verificationData?.siteVisitDetails;
          if (siteData) {
            form.setFieldsValue({ siteVisitDetails: siteData });
          }
        } else if (
          formKey === "thirdPartyCheck" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const tpcData =
            currentVerification?.verificationData?.thirdPartyCheck;
          if (tpcData) {
            form.setFieldsValue({ thirdPartyCheck: tpcData });
          }
        } else if (
          formKey === "additionalDetails" &&
          currentVerification?.bankName === "Tata Ubl"
        ) {
          const addData =
            currentVerification?.verificationData?.additionalDetails;
          if (addData) {
            form.setFieldsValue({ additionalDetails: addData });
          }
        }
        if (formKey === "assetDetails") {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]); // Only depend on visible to prevent resetting during user edits

  const getInitialValues = async () => {
    const currentVerification = initialValues?.verifications?.find(
      (v: any) => v.addressType === currentTab || v.type === currentTab
    );

    if (currentTab === "Work") {
      if (formKey === "workBasicDetails") {
        return currentVerification?.verificationData?.basicDetails;
      }
      if (formKey === "employmentDetails") {
        return currentVerification?.verificationData?.employmentDetails;
      }
    }

    // Handle financial analysis data differently
    if (formKey === "financialAnalysis") {
      return currentVerification?.financialAnalysis;
    }

    // For PD department, handle data structure differently
    if (currentDepartment === "PD") {
      if (formKey === "applicantDetails") {
        return currentVerification?.verificationData?.applicantDetails;
      }
      if (formKey === "familyDetails") {
        return {
          familyMemberDetails:
            currentVerification?.verificationData?.familyMemberDetails ||
            currentVerification?.verificationData?.familyDetails ||
            [],
        };
      }
      if (formKey === "businessBasicDetails") {
        return currentVerification?.verificationData?.basicDetails;
      }
      if (formKey === "businessDetails") {
        return currentVerification?.verificationData?.businessDetails;
      }
      if (formKey === "bankingDetails") {
        return currentVerification?.verificationData?.bankingDetails;
      }
      if (formKey === "financeDetails") {
        return currentVerification?.verificationData?.financeDetails;
      }
      if (formKey === "shareholdingDetails") {
        return currentVerification?.verificationData?.shareholdingDetails;
      }
      if (formKey === "suppliersCreditors") {
        return {
          suppliersCreditors:
            currentVerification?.verificationData?.suppliersCreditors,
        };
      }
      if (formKey === "clientsDebtors") {
        return {
          clientsDebtors: currentVerification?.verificationData?.clientsDebtors,
        };
      }
      if (formKey === "salariesWages") {
        return {
          documentsObserved:
            currentVerification?.verificationData?.documentsObserved,
        };
      }
      if (formKey === "documentsObserved") {
        return {
          documentsObserved:
            currentVerification?.verificationData?.documentsObserved,
        };
      }
      if (formKey === "assetDetails") {
        return {
          assetDetails: currentVerification?.verificationData?.assetDetails,
        };
      }
      if (formKey === "additionalDetails") {
        return currentVerification?.verificationData?.additionalDetails;
      }
    }

    // Handle other forms normally
    return currentVerification?.verificationData?.[
      formKeyMapping[formKey] || formKey
    ];
  };

  // Helper function to validate non-empty strings
  const validateNonEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") {
      // Check if string has at least one non-whitespace character
      return value.trim().length > 0;
    }
    if (typeof value === "number") {
      return !isNaN(value);
    }
    return true; // For other types, consider them valid
  };

  // Helper function to clean whitespace-only values
  const cleanWhitespaceValues = (obj: any): any => {
    if (typeof obj === "string") {
      return obj.trim() === "" ? undefined : obj.trim();
    }
    if (Array.isArray(obj)) {
      return obj
        .map(cleanWhitespaceValues)
        .filter((item) => item !== undefined);
    }
    if (typeof obj === "object" && obj !== null) {
      const cleaned: any = {};
      for (const key in obj) {
        const cleanedValue = cleanWhitespaceValues(obj[key]);
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
      return cleaned;
    }
    return obj;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Validate form first. If invalid, this will throw and skip the rest.
      const values = await form.validateFields();
      console.log("values", values);

      // Ant Design form validation already handles required fields correctly
      // including conditional requirements (e.g., otherRelation when relation === "Other")
      // Empty strings for optional fields will be cleaned by cleanWhitespaceValues below

      // Only proceed if validation passes

      // Clean whitespace-only values before processing
      const cleanedValues = cleanWhitespaceValues(values);

      const formValues =
        formKey === "familyMemberDetails"
          ? Object.values(cleanedValues?.familyMemberDetails)
          : cleanedValues;
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
        if (formKey === "financialAnalysis") {
          try {
            await updateFinancialAnalysis(id as string, values);
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

        let finalData: Record<string, any>;
        if (currentTab === "Work") {
          if (formKey === "workBasicDetails") {
            finalData = {
              basicDetails: formValues,
            };
          } else if (formKey === "employmentDetails") {
            finalData = {
              employmentDetails: formValues,
            };
          } else {
            finalData = {
              [mappedKey]: formValues,
            };
          }
        } else if (currentDepartment === "PD") {
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
                }
              : currentTab === "Work" && formKey === "workBasicDetails"
                ? initialValues?.verifications?.find(
                    (v: any) => v.addressType === currentTab || v.type === currentTab
                  )?.verificationData?.basicDetails
                : currentTab === "Work" && formKey === "employmentDetails"
                  ? initialValues?.verifications?.find(
                      (v: any) => v.addressType === currentTab || v.type === currentTab
                    )?.verificationData?.employmentDetails
                  : currentDepartment === "PD" && formKey === "familyDetails"
                ? {
                    familyMemberDetails:
                      initialValues?.verifications?.find(
                        (v: any) => v.addressType === currentTab
                      )?.verificationData?.familyMemberDetails || [],
                  }
                : currentDepartment === "PD" && formKey === "applicantDetails"
                  ? initialValues?.verifications?.find(
                      (v: any) => v.addressType === currentTab
                    )?.verificationData?.applicantDetails
                  : currentDepartment === "PD" &&
                      formKey === "businessBasicDetails"
                    ? initialValues?.verifications?.find(
                        (v: any) => v.addressType === currentTab
                      )?.verificationData?.basicDetails
                    : currentDepartment === "PD" &&
                        formKey === "businessDetails"
                      ? initialValues?.verifications?.find(
                          (v: any) => v.addressType === currentTab
                        )?.verificationData?.businessDetails
                      : currentDepartment === "PD" &&
                          formKey === "shareholdingDetails"
                        ? initialValues?.verifications?.find(
                            (v: any) => v.addressType === currentTab
                          )?.verificationData?.shareholdingDetails
                        : currentDepartment === "PD" &&
                            formKey === "suppliersCreditors"
                          ? initialValues?.verifications?.find(
                              (v: any) => v.addressType === currentTab
                            )?.verificationData?.suppliersCreditors
                          : currentDepartment === "PD" &&
                              formKey === "clientsDebtors"
                            ? initialValues?.verifications?.find(
                                (v: any) => v.addressType === currentTab
                              )?.verificationData?.clientsDebtors
                            : currentDepartment === "PD" &&
                                formKey === "salariesWages"
                              ? initialValues?.verifications?.find(
                                  (v: any) => v.addressType === currentTab
                                )?.verificationData?.salariesWages
                              : currentDepartment === "PD" &&
                                  formKey === "assetDetails"
                                ? initialValues?.verifications?.find(
                                    (v: any) => v.addressType === currentTab
                                  )?.verificationData?.assetDetails
                                : initialValues?.verifications?.find(
                                    (v: any) => v.addressType === currentTab
                                  )?.verificationData?.[
                                    formKeyMapping[formKey] || formKey
                                  ]
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
          />
        </Row>
      </Form>
    </Modal>
  );
};
