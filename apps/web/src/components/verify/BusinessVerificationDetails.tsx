import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl } from "@/utils/utility";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  message,
  Modal,
  Table,
  Row,
  Col,
  Descriptions,
  Form,
  Input,
  Typography,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import EditRequestLogs from "./EditRequestLogs";
import Footer from "./Footer";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import FinalVerdict from "./FinalVerdict";
import Feedback from "./Feedback";
import {
  patchFinalVerdict,
  verifierEditApi,
  submitFinancialAnalysis,
} from "@/services/verifier.services";

// Import new dynamic form system
import { DirectPDFormRenderer } from "./DirectPDFormRenderer";
import { EnhancedDynamicFormRenderer } from "@/components/forms/EnhancedDynamicFormRenderer";
import { WebFormDefinition, WebFormData } from "@/types/webSchema";
import { DynamicEditModal } from "@/components/verify/DynamicEditModal";

// Import legacy description components for FI-only banks
import BusinessBasicDetailsDescription from "./Descriptions/BusinessBasicDetailsDescription";
import BusinessDetailsDescription from "./Descriptions/BusinessDetailsDescription";
import BusinessMiscellaneousDescription from "./Descriptions/BusinessMiscellaneousDescription";
import ExistingLoansDescription from "./Descriptions/ExistingLoansDescription";
import ThirdPartyCheckDescription from "./Descriptions/ThirdPartyCheckDescription";

const serializeFormValues = (value: any): any => {
  if (dayjs.isDayjs(value)) {
    return value.format("DD/MM/YYYY");
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeFormValues(item));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [key]: serializeFormValues(val),
      }),
      {} as Record<string, any>
    );
  }

  return value;
};

const mergeDeep = (target: any, source: any): any => {
  if (source === undefined) {
    return target;
  }

  if (Array.isArray(source)) {
    return source;
  }

  if (source && typeof source === "object") {
    const base =
      target && typeof target === "object" && !Array.isArray(target)
        ? { ...target }
        : {};

    Object.keys(source).forEach((key) => {
      base[key] = mergeDeep(base[key], source[key]);
    });

    return base;
  }

  return source;
};

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

  // New dynamic form states
  const [schemaForm, setSchemaForm] = useState<WebFormDefinition | null>(null);
  const [useNewApproach, setUseNewApproach] = useState(false);
  const [useGenericApproach, setUseGenericApproach] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [dynamicFormData, setDynamicFormData] = useState<WebFormData>({});

  // Dynamic edit modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditSection, setCurrentEditSection] = useState<string>("");
  const [currentSectionSchema, setCurrentSectionSchema] = useState<any>(null);
  const [localEditLogsUpdated, setLocalEditLogsUpdated] = useState(0);

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
      const uploadedItems =
        verificationData?.uploadedItems ||
        verificationData?.verificationData?.uploadedItems;

      if (uploadedItems) {
        const urls: { [key: string]: string } = {};
        for (const item of uploadedItems) {
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
  }, [
    verificationData?.uploadedItems,
    verificationData?.verificationData?.uploadedItems,
  ]);

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
          console.log("Loaded edit logs from IndexedDB:", rest);
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
  }, [id, activeTab, editLogsUpdated, localEditLogsUpdated]);

  // Load dynamic form schema from backend based on bank name
  useEffect(() => {
    const loadDynamicSchema = async () => {
      try {
        setFormLoading(true);

        // Get bank name from verification data
        const bankName =
          verificationData?.bankName || verificationData?.loan?.bankName || "";

        // Skip if no bank name
        if (!bankName) {
          console.log("No bank name found, skipping dynamic schema");
          setUseNewApproach(false);
          setFormLoading(false);
          return;
        }

        console.log("Loading PD schema from backend for bank:", bankName);

        try {
          // Fetch schema from backend (single source of truth)
          const { getSchemaFromBackend, convertBackendSchemaToWebFormat } =
            await import("@/services/schema.service");
          const backendResponse = await getSchemaFromBackend(
            bankName,
            currentDepartment || "PD"
          );

          // Convert backend schema to web format
          const schema = convertBackendSchemaToWebFormat(
            backendResponse.schema
          );

          if (schema) {
            console.log("✅ Schema loaded successfully:", schema);
            setSchemaForm(schema);
            setUseGenericApproach(true);
            setUseNewApproach(false);

            // Initialize form data from existing verification data
            // Extract the actual form data from verificationData.verificationData
            const rawFormData =
              verificationData?.verificationData || verificationData || {};

            // Clean empty strings from form data and convert empty strings to false for boolean fields
            const cleanEmptyStrings = (obj: any, schema?: any): any => {
              if (typeof obj === "string") {
                return obj.trim() === "" ? undefined : obj;
              }
              if (Array.isArray(obj)) {
                return obj.map((item) => cleanEmptyStrings(item, schema));
              }
              if (typeof obj === "object" && obj !== null) {
                const cleaned: any = {};
                for (const key in obj) {
                  const cleanedValue = cleanEmptyStrings(obj[key], schema);
                  if (cleanedValue !== undefined) {
                    // Convert empty strings to false for boolean fields
                    if (cleanedValue === "" && schema?.fields) {
                      const field = schema.fields.find(
                        (f: any) => f.id === key
                      );
                      if (field?.type === "boolean") {
                        cleaned[key] = false;
                      } else {
                        cleaned[key] = cleanedValue;
                      }
                    } else {
                      cleaned[key] = cleanedValue;
                    }
                  }
                }
                return cleaned;
              }
              return obj;
            };

            const formData = cleanEmptyStrings(rawFormData, schema);

            setDynamicFormData(formData);

            console.log(
              "✓ PD schema loaded from backend successfully:",
              schema.name
            );

            // Debug: Log the data being passed to GenericVerificationDisplay
            console.log("🎯 Data passed to GenericVerificationDisplay:");
            console.log("  formData:", formData);
            console.log(
              "  schema sections:",
              schema.sections?.map((s: any) => s.id)
            );
            console.log("✓ Form data initialized:", formData);
          } else {
            console.log(
              `Bank "${bankName}" schema could not be converted to web format`
            );
            setUseNewApproach(false);
          }
        } catch (schemaError: any) {
          console.log(
            `Bank "${bankName}" does not have PD forms or error loading:`,
            schemaError.message
          );
          setUseNewApproach(false);
          setUseGenericApproach(false);
        }
      } catch (error) {
        console.error("Error loading dynamic schema:", error);
        setUseNewApproach(false);
        setUseGenericApproach(false);
      } finally {
        setFormLoading(false);
      }
    };

    if (verificationData) {
      loadDynamicSchema();
    }
  }, [verificationData]);

  // Handle dynamic form data changes
  const handleDynamicFormDataChange = (sectionId: string, data: any) => {
    setDynamicFormData((prev) => ({
      ...prev,
      [sectionId]: data,
    }));
  };

  // Handle edit button click for dynamic sections
  const handleDynamicSectionEdit = (sectionId: string) => {
    if (!schemaForm) return;

    // Find the section schema
    const sectionSchema = schemaForm.sections.find((s) => s.id === sectionId);
    if (!sectionSchema) return;

    setCurrentEditSection(sectionId);
    setCurrentSectionSchema(sectionSchema);
    setEditModalVisible(true);
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

  // Helper function to validate section data
  const validateSectionData = (
    data: any,
    sectionSchema: any
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!sectionSchema || !sectionSchema.fields) {
      return { isValid: true, errors: [] };
    }

    sectionSchema.fields.forEach((field: any) => {
      const value = data[field.id];

      // Check if value is whitespace-only (for both required and non-required fields)
      if (typeof value === "string" && value.trim() === "") {
        errors.push(field.label);
      }

      // Check array fields
      if (field.type === "array" && field.arrayItemFields) {
        const arrayValue = data[field.id];
        if (Array.isArray(arrayValue)) {
          arrayValue.forEach((item: any, index: number) => {
            field.arrayItemFields?.forEach((itemField: any) => {
              const itemValue = item[itemField.id];
              if (typeof itemValue === "string" && itemValue.trim() === "") {
                errors.push(`${field.label}[${index + 1}].${itemField.label}`);
              }
            });
          });
        }
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  // Save dynamic section edits to IndexedDB
  const handleSaveDynamicEdit = async (sectionId: string, data: any) => {
    return new Promise<void>((resolve, reject) => {
      // Validate data before saving
      const validation = validateSectionData(data, currentSectionSchema);
      if (!validation.isValid) {
        message.error(validation.errors.join(", "));
        reject(new Error("Validation failed"));
        return;
      }

      const request = indexedDB.open("editLogs", 1);

      request.onerror = () => {
        message.error("Failed to save changes: Database error");
        reject(new Error("Database error"));
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;

        try {
          const transaction = db.transaction("logs", "readwrite");
          const store = transaction.objectStore("logs");

          const getRequest = store.get(`${id}_${activeTab}`);

          getRequest.onsuccess = () => {
            const existingData = getRequest.result || {};

            const logEntry = {
              id: `${id}_${activeTab}`,
              ...existingData,
              [sectionId]: data,
              timestamp: new Date().toISOString(),
            };

            const putRequest = store.put(logEntry);

            putRequest.onsuccess = () => {
              setEditModalVisible(false);
              setLocalEditLogsUpdated((prev) => prev + 1); // Trigger refresh of edit logs
              fetchVerificationData();
              resolve();
            };

            putRequest.onerror = () => {
              console.error("Error saving log:", putRequest.error);
              message.error("Failed to save edit log");
              reject(new Error("Failed to save edit log"));
            };
          };

          getRequest.onerror = () => {
            console.error("Error fetching existing log:", getRequest.error);
            reject(new Error("Error fetching existing log"));
          };

          transaction.oncomplete = () => {
            db.close();
          };

          transaction.onerror = () => {
            console.error("Transaction error:", transaction.error);
            reject(new Error("Transaction error"));
          };
        } catch (error) {
          console.error("Error in transaction:", error);
          db.close();
          reject(error);
        }
      };
    });
  };

  // Handle dynamic form submission
  const handleDynamicFormSubmit = async (formData: WebFormData) => {
    try {
      setLoading(true);

      const finalData = {
        verificationType: "Business",
        findings: "Business Verification Findings",
        addressType: "Business",
        verificationData: formData,
      };

      // Submit verification data
      await verifierEditApi(id as string, "Business", finalData);

      message.success("Verification data updated successfully");
      fetchVerificationData();
    } catch (error) {
      console.error("Error submitting dynamic form:", error);
      message.error("Failed to update verification data");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectFormSave = async (formValues: any) => {
    if (!id) {
      throw new Error("Unable to save: Loan identifier is missing");
    }

    try {
      const sanitizedValues = serializeFormValues(formValues);
      const existingVerificationData =
        (verificationData?.verificationData as Record<string, any>) || {};
      const mergedVerificationData = mergeDeep(
        existingVerificationData,
        sanitizedValues
      );

      const verificationType =
        verificationData?.type ||
        completeVerificationData?.type ||
        "Business";
      const findings =
        verificationData?.findings ||
        completeVerificationData?.findings ||
        "Business Verification Findings";
      const approvedStatus =
        verificationData?.approvedStatus ||
        completeVerificationData?.approvedStatus ||
        "Positive";

      await verifierEditApi(String(id), verificationType, {
        findings,
        verificationData: mergedVerificationData,
        approvedStatus,
      });

      fetchVerificationData?.();
    } catch (error: any) {
      console.error("Error saving PD form data:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save PD form data";
      throw new Error(errorMessage);
    }
  };

  // Watch financial form values for automatic calculation
  const financialFormValues = Form.useWatch([], financialForm);

  // Calculate profits whenever financial form values change
  useEffect(() => {
    if (financialFormValues) {
      console.log("Financial form values:", financialFormValues);
      const calculateProfits = () => {
        // Gross Profit Calculation
        const openingStock =
          parseFloat((financialFormValues as any).toOpeningStock) || 0;
        const purchase =
          parseFloat((financialFormValues as any).toPurchase) || 0;
        const costOfServices =
          parseFloat((financialFormValues as any).toCostOfServices) || 0;
        const wages = parseFloat((financialFormValues as any).toWages) || 0;
        const hamaliCharges =
          parseFloat((financialFormValues as any).toHamaliCharges) || 0;
        const manufacturingExpenses =
          parseFloat((financialFormValues as any).toManufacturingExpenses) || 0;
        const packingCharges =
          parseFloat((financialFormValues as any).toPackingCharges) || 0;
        const sales = parseFloat((financialFormValues as any).bySales) || 0;
        const services =
          parseFloat((financialFormValues as any).byServices) || 0;
        const closingStock =
          parseFloat((financialFormValues as any).byClosingStock) || 0;

        // Gross Profit = (Sales + Services + Closing Stock) - (Opening Stock + Purchases + Cost of Services + Wages + Hamali + Manufacturing + Packing)
        const grossProfit =
          sales +
          services +
          closingStock -
          (openingStock +
            purchase +
            costOfServices +
            wages +
            hamaliCharges +
            manufacturingExpenses +
            packingCharges);

        // Net Profit Calculation
        const salaries =
          parseFloat((financialFormValues as any).toSalaries) || 0;
        const rent = parseFloat((financialFormValues as any).toRent) || 0;
        const electricityCharges =
          parseFloat((financialFormValues as any).toElectricityCharges) || 0;
        const printingStationery =
          parseFloat((financialFormValues as any).toPrintingStationery) || 0;
        const telephoneCharges =
          parseFloat((financialFormValues as any).toTelephoneCharges) || 0;
        const postageTelegram =
          parseFloat((financialFormValues as any).toPostageTelegram) || 0;
        const officeMaintenance =
          parseFloat((financialFormValues as any).toOfficeMaintenance) || 0;
        const repairsMaintenance =
          parseFloat((financialFormValues as any).toRepairsMaintenance) || 0;
        const sadarExpenses =
          parseFloat((financialFormValues as any).toSadarExpenses) || 0;
        const auditFee =
          parseFloat((financialFormValues as any).toAuditFee) || 0;
        const advertisement =
          parseFloat((financialFormValues as any).toAdvertisement) || 0;
        const bankCharges =
          parseFloat((financialFormValues as any).toBankCharges) || 0;
        const insurance =
          parseFloat((financialFormValues as any).toInsurance) || 0;
        const depreciation =
          parseFloat((financialFormValues as any).toDepreciation) || 0;
        const interestOnLoan =
          parseFloat((financialFormValues as any).toInterestOnLoan) || 0;
        const rentReceived =
          parseFloat((financialFormValues as any).byRentReceived) || 0;
        const commissionReceived =
          parseFloat((financialFormValues as any).byCommissionReceived) || 0;

        // Indirect Expenses = All "To" fields in net profit section
        const indirectExpenses =
          salaries +
          rent +
          electricityCharges +
          printingStationery +
          telephoneCharges +
          postageTelegram +
          officeMaintenance +
          repairsMaintenance +
          sadarExpenses +
          auditFee +
          advertisement +
          bankCharges +
          insurance +
          depreciation +
          interestOnLoan;

        // Other Incomes = Rent Received + Commission Received
        const otherIncomes = rentReceived + commissionReceived;

        // Net Profit = Gross Profit + Other Incomes - Indirect Expenses
        const netProfit = grossProfit + otherIncomes - indirectExpenses;

        console.log("Calculated values:", {
          grossProfit,
          netProfit,
          indirectExpenses,
          otherIncomes,
        });

        setCalculatedGrossProfit(grossProfit);
        setCalculatedNetProfit(netProfit);
      };

      calculateProfits();
    }
  }, [financialFormValues]);

  // Load existing financial data when component mounts
  useEffect(() => {
    console.log("verificationData received:", verificationData);
    console.log("completeVerificationData received:", completeVerificationData);

    // Now verificationData is the entire verification object, so financialAnalysis is directly under it
    let financialData = null;

    // Try to get financial data from the correct path
    if (verificationData?.financialAnalysis) {
      financialData = verificationData.financialAnalysis;
      console.log(
        "Financial data found in verificationData.financialAnalysis:",
        financialData
      );
    } else if (verificationData?.verificationData?.financialAnalysis) {
      financialData = verificationData.verificationData.financialAnalysis;
      console.log(
        "Financial data found in verificationData.verificationData.financialAnalysis:",
        financialData
      );
    }

    if (financialData) {
      console.log("Loading financial data:", financialData);

      // Set form values based on the API response structure
      const formValues = {
        toOpeningStock: financialData.openingStock?.toString() || "",
        toPurchase: financialData.purchase?.toString() || "",
        toCostOfServices: financialData.costOfServices?.toString() || "",
        toWages: financialData.wages?.toString() || "",
        toHamaliCharges: financialData.hamaliCharges?.toString() || "",
        toManufacturingExpenses:
          financialData.manufacturingExpenses?.toString() || "",
        toPackingCharges: financialData.packingCharges?.toString() || "",
        bySales: financialData.sales?.toString() || "",
        byServices: financialData.services?.toString() || "",
        byClosingStock: financialData.closingStock?.toString() || "",
        toSalaries: financialData.salaries?.toString() || "",
        toRent: financialData.rent?.toString() || "",
        toElectricityCharges:
          financialData.electricityCharges?.toString() || "",
        toPrintingStationery:
          financialData.printingStationery?.toString() || "",
        toTelephoneCharges: financialData.telephoneCharges?.toString() || "",
        toPostageTelegram: financialData.postageTelegram?.toString() || "",
        toOfficeMaintenance: financialData.officeMaintenance?.toString() || "",
        toRepairsMaintenance:
          financialData.repairsMaintenance?.toString() || "",
        toSadarExpenses: financialData.sadarExpenses?.toString() || "",
        toAuditFee: financialData.auditFee?.toString() || "",
        toAdvertisement: financialData.advertisement?.toString() || "",
        toBankCharges: financialData.bankCharges?.toString() || "",
        toInsurance: financialData.insurance?.toString() || "",
        toDepreciation: financialData.depreciation?.toString() || "",
        toInterestOnLoan: financialData.interestOnLoan?.toString() || "",
        byRentReceived: financialData.rentReceived?.toString() || "",
        byCommissionReceived:
          financialData.commissionReceived?.toString() || "",
      };

      console.log("Setting form values:", formValues);

      // Set form values immediately
      financialForm.setFieldsValue(formValues);
      console.log("Form values set successfully");

      // Set calculated values
      setCalculatedGrossProfit(financialData.grossProfit || 0);
      setCalculatedNetProfit(financialData.netProfit || 0);

      console.log(
        "Calculated values set - Gross Profit:",
        financialData.grossProfit,
        "Net Profit:",
        financialData.netProfit
      );
    } else {
      console.log(
        "No financial data found in verificationData.financialAnalysis"
      );
    }
  }, [verificationData, financialForm]);

  const handleFinancialSubmit = async () => {
    try {
      setLoading(true);
      const values = await financialForm.validateFields();

      // Recalculate Gross and Net Profit at submit time to avoid stale zero values
      const openingStockVal = parseFloat(values.toOpeningStock) || 0;
      const purchaseVal = parseFloat(values.toPurchase) || 0;
      const costOfServicesVal = parseFloat(values.toCostOfServices) || 0;
      const wagesVal = parseFloat(values.toWages) || 0;
      const hamaliChargesVal = parseFloat(values.toHamaliCharges) || 0;
      const manufacturingExpensesVal =
        parseFloat(values.toManufacturingExpenses) || 0;
      const packingChargesVal = parseFloat(values.toPackingCharges) || 0;
      const salesVal = parseFloat(values.bySales) || 0;
      const servicesVal = parseFloat(values.byServices) || 0;
      const closingStockVal = parseFloat(values.byClosingStock) || 0;

      const salariesVal = parseFloat(values.toSalaries) || 0;
      const rentVal = parseFloat(values.toRent) || 0;
      const electricityChargesVal =
        parseFloat(values.toElectricityCharges) || 0;
      const printingStationeryVal =
        parseFloat(values.toPrintingStationery) || 0;
      const telephoneChargesVal = parseFloat(values.toTelephoneCharges) || 0;
      const postageTelegramVal = parseFloat(values.toPostageTelegram) || 0;
      const officeMaintenanceVal = parseFloat(values.toOfficeMaintenance) || 0;
      const repairsMaintenanceVal =
        parseFloat(values.toRepairsMaintenance) || 0;
      const sadarExpensesVal = parseFloat(values.toSadarExpenses) || 0;
      const auditFeeVal = parseFloat(values.toAuditFee) || 0;
      const advertisementVal = parseFloat(values.toAdvertisement) || 0;
      const bankChargesVal = parseFloat(values.toBankCharges) || 0;
      const insuranceVal = parseFloat(values.toInsurance) || 0;
      const depreciationVal = parseFloat(values.toDepreciation) || 0;
      const interestOnLoanVal = parseFloat(values.toInterestOnLoan) || 0;
      const rentReceivedVal = parseFloat(values.byRentReceived) || 0;
      const commissionReceivedVal =
        parseFloat(values.byCommissionReceived) || 0;

      const computedGrossProfit =
        salesVal +
        servicesVal +
        closingStockVal -
        (openingStockVal +
          purchaseVal +
          costOfServicesVal +
          wagesVal +
          hamaliChargesVal +
          manufacturingExpensesVal +
          packingChargesVal);

      const indirectExpensesVal =
        salariesVal +
        rentVal +
        electricityChargesVal +
        printingStationeryVal +
        telephoneChargesVal +
        postageTelegramVal +
        officeMaintenanceVal +
        repairsMaintenanceVal +
        sadarExpensesVal +
        auditFeeVal +
        advertisementVal +
        bankChargesVal +
        insuranceVal +
        depreciationVal +
        interestOnLoanVal;

      const otherIncomesVal = rentReceivedVal + commissionReceivedVal;
      const computedNetProfit =
        computedGrossProfit + otherIncomesVal - indirectExpensesVal;

      // Prepare the complete financial analysis data
      const financialData = {
        openingStock: openingStockVal,
        purchase: purchaseVal,
        costOfServices: costOfServicesVal,
        wages: wagesVal,
        hamaliCharges: hamaliChargesVal,
        manufacturingExpenses: manufacturingExpensesVal,
        packingCharges: packingChargesVal,
        sales: salesVal,
        services: servicesVal,
        closingStock: closingStockVal,
        salaries: salariesVal,
        rent: rentVal,
        electricityCharges: electricityChargesVal,
        printingStationery: printingStationeryVal,
        telephoneCharges: telephoneChargesVal,
        postageTelegram: postageTelegramVal,
        officeMaintenance: officeMaintenanceVal,
        repairsMaintenance: repairsMaintenanceVal,
        sadarExpenses: sadarExpensesVal,
        auditFee: auditFeeVal,
        advertisement: advertisementVal,
        bankCharges: bankChargesVal,
        insurance: insuranceVal,
        depreciation: depreciationVal,
        interestOnLoan: interestOnLoanVal,
        rentReceived: rentReceivedVal,
        commissionReceived: commissionReceivedVal,
        grossProfit: computedGrossProfit,
        netProfit: computedNetProfit,
      };

      console.log("Submitting financial data:", financialData);

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

  // Get bank name
  const bankName = verificationData?.bankName || "Axis Finance";

  // Extract the form data directly
  const rawApiData = verificationData?.verificationData || verificationData;
  const data = rawApiData;

  // Debug logging
  console.log("🔍 BusinessVerificationDetails Debug:");
  console.log("  verificationData:", verificationData);
  console.log("  rawApiData:", rawApiData);
  console.log("  data:", data);
  console.log("  bankName:", bankName);

  // For legacy FI components, wrap the data correctly
  // The description components expect data with nested structure like data.basicDetails
  const legacyFormattedData = {
    basicDetails: data?.basicDetails,
    businessDetails: data?.businessDetails,
    miscellaneous: data?.miscellaneous,
    existingLoans: data?.existingLoans,
    uploadedItems: data?.uploadedItems,
    // ExistingLoansDescription expects data.loans.loans structure
    loans: {
      loans: data?.existingLoans?.loans || [],
    },
    // ThirdPartyCheckDescription expects data.thirdPartyCheck.checks structure
    thirdPartyCheck: {
      checks: data?.thirdPartyCheck?.checks || [],
    },
    // For PD components, add top-level fields that they expect
    applicationNumber: data?.basicDetails?.applicationNumber,
    bankName: data?.basicDetails?.bankName,
  };

  // Merge pending edits from local edit logs into the display data so UI reflects changes
  // Only merge known sections to avoid unintended keys
  const mergedLegacyData = {
    ...legacyFormattedData,
    basicDetails: {
      ...(legacyFormattedData.basicDetails || {}),
      ...(changedData?.basicDetails || changedData?.businessBasicDetails || {}),
    },
    businessDetails: {
      ...(legacyFormattedData.businessDetails || {}),
      ...(changedData?.businessDetails || {}),
    },
    miscellaneous: {
      ...(legacyFormattedData.miscellaneous || {}),
      ...(changedData?.miscellaneous || {}),
    },
    // Keep existingLoans and thirdPartyCheck structures intact; logs view already shows diffs
    // Ensure top-level fields are updated from merged basicDetails
    applicationNumber:
      legacyFormattedData.applicationNumber ||
      legacyFormattedData.basicDetails?.applicationNumber,
    bankName:
      legacyFormattedData.bankName ||
      legacyFormattedData.basicDetails?.bankName,
  } as typeof legacyFormattedData;

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
    const keySections =
      currentDepartment === "PD"
        ? [
            "businessBasicDetails",
            "businessDetails",
            "applicantDetails",
            "familyDetails",
          ]
        : ["businessBasicDetails", "businessDetails", "miscellaneous"];
    return Object.keys(changedData).some((key) => keySections.includes(key));
  };

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
      {/* Dynamic Form Status removed as requested */}
      {currentDepartment === "PD" &&
        (verificationData?.bankName || verificationData?.loan?.bankName) && (
          <section style={{ margin: "6px 0 12px", textAlign: "center" }}>
            <Text style={{ color: "#1e40af", fontWeight: 600 }}>
              {typeof verificationData?.bankName === "string"
                ? verificationData.bankName
                : typeof verificationData?.loan?.bankName === "string"
                  ? verificationData.loan.bankName
                  : "Unknown Bank"}
            </Text>
          </section>
        )}

      {/* Loading Indicator */}
      {formLoading && (
        <Card style={{ marginBottom: 16, textAlign: "center" }}>
          <Space>
            <span>Loading dynamic form schema...</span>
          </Space>
        </Card>
      )}

      {/* New Dynamic Form Approach */}
      {useNewApproach && schemaForm && !formLoading && (
        <div style={{ marginBottom: 24 }}>
          <EnhancedDynamicFormRenderer
            schema={schemaForm}
            initialData={dynamicFormData}
            onSubmit={handleDynamicFormSubmit}
            onDataChange={handleDynamicFormDataChange}
            readOnly={!!verificationData?.approvedStatus || hasEditRequest}
            showValidation={true}
            autoSave={true}
            onEdit={handleDynamicSectionEdit}
            hasEditRequest={hasEditRequest}
            sideBySideSections={["businessDetails"]}
          />

          {/* Photo Capture Section for Dynamic Form */}
          <section style={{ marginBottom: 24 }}>
            <Card title="Photo Capture">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                {(dynamicFormData?.uploadedItems || []).map(
                  (item: any, idx: number) => {
                    return (
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
                          Photo {idx + 1} {item?.isCamera ? null : "(Gallery)"}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </Card>
          </section>
        </div>
      )}

      {/* Dynamic Edit Modal */}
      {editModalVisible && currentSectionSchema && (
        <DynamicEditModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          sectionSchema={currentSectionSchema}
          initialData={dynamicFormData[currentEditSection] || {}}
          onSave={handleSaveDynamicEdit}
          sectionId={currentEditSection}
        />
      )}

      {/* Enhanced Dynamic Form (for PD forms with schema) */}
      {useGenericApproach && !formLoading && schemaForm && (
        <div>
          <div
            style={{
              background: "#e6f7ff",
              padding: 8,
              marginBottom: 16,
              borderRadius: 4,
            }}
          >
            ✅ Using DirectPDFormRenderer - Direct Form Fields
          </div>
          <DirectPDFormRenderer
            schema={schemaForm}
            initialData={verificationData?.verificationData}
            onSave={handleDirectFormSave}
            readOnly={!!verificationData?.approvedStatus || hasEditRequest}
          />
        </div>
      )}

      {/* Legacy FI-style Business Data Display (for banks without PD forms) */}
      {!useGenericApproach &&
        !useNewApproach &&
        !formLoading &&
        verificationData && (
          <div style={{ marginBottom: 24 }}>
            <BusinessBasicDetailsDescription
              data={mergedLegacyData}
              extra={
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() =>
                    currentDepartment === "PD"
                      ? handleDynamicSectionEdit("basicDetails")
                      : onEdit("basicDetails")
                  }
                  disabled={hasEditRequest}
                />
              }
              logs={false}
              currentDepartment={currentDepartment}
            />

            <BusinessDetailsDescription
              data={mergedLegacyData}
              extra={
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() =>
                    currentDepartment === "PD"
                      ? handleDynamicSectionEdit("businessDetails")
                      : onEdit("businessDetails")
                  }
                  disabled={hasEditRequest}
                />
              }
              logs={false}
              currentDepartment={currentDepartment}
            />

            <BusinessMiscellaneousDescription
              data={mergedLegacyData}
              extra={
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() =>
                    currentDepartment === "PD"
                      ? handleDynamicSectionEdit("miscellaneous")
                      : onEdit("miscellaneous")
                  }
                  disabled={hasEditRequest}
                />
              }
              logs={false}
            />

            <ExistingLoansDescription
              data={legacyFormattedData}
              extra={
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() =>
                    currentDepartment === "PD"
                      ? handleDynamicSectionEdit("existingLoans")
                      : onEdit("existingLoans")
                  }
                  disabled={hasEditRequest}
                />
              }
              logs={false}
            />

            <ThirdPartyCheckDescription
              data={legacyFormattedData}
              extra={
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() =>
                    currentDepartment === "PD"
                      ? handleDynamicSectionEdit("thirdPartyCheck")
                      : onEdit("thirdPartyCheck")
                  }
                  disabled={hasEditRequest}
                />
              }
              logs={false}
            />

            {/* Photo Capture Section */}
            <section style={{ marginBottom: 24 }}>
              <Card title="Photo Capture">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {legacyFormattedData?.uploadedItems?.map(
                    (item: any, idx: number) => {
                      return (
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
                            Photo {idx + 1}{" "}
                            {item?.isCamera ? null : "(Gallery)"}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </Card>
            </section>
          </div>
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
          dynamicSchema={schemaForm}
        />
      </section>

      {/* Financial Analysis Section - Only for PD department */}
      {currentDepartment === "PD" && (
        <section style={{ marginBottom: 24 }}>
          <Card
            title="Financial Analysis"
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() =>
                  currentDepartment === "PD"
                    ? handleDynamicSectionEdit("financialAnalysis")
                    : onEdit("financialAnalysis")
                }
                disabled={hasEditRequest}
              />
            }
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
              {/* Gross Profit Section */}
              <Card
                title={`To Gross Profit - ₹${calculatedGrossProfit.toLocaleString()}`}
                size="small"
                style={{ marginBottom: 16 }}
              >
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
                          <Input placeholder="Purchase" type="number" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="toCostOfServices"
                          label="To Cost of Services"
                          rules={[createNonNegativeRule("Cost of Services")]}
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
                          <Input placeholder="Wages" type="number" min={0} />
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
                          <Input placeholder="Sales" type="number" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="byServices"
                          label="By Services"
                          rules={[createNonNegativeRule("Services")]}
                        >
                          <Input placeholder="Services" type="number" min={0} />
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
              </Card>
              {/* Net Profit Section */}
              <Card
                title={`To Net Profit - ₹${calculatedNetProfit.toLocaleString()}`}
                size="small"
                style={{ marginBottom: 16 }}
              >
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
                          <Input placeholder="Salaries" type="number" min={0} />
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
                          rules={[createNonNegativeRule("Electricity Charges")]}
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
                          rules={[createNonNegativeRule("Telephone Charges")]}
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
                          rules={[createNonNegativeRule("Postage & Telegram")]}
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
                          rules={[createNonNegativeRule("Office Maintenance")]}
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
                          rules={[createNonNegativeRule("Interest on Loan")]}
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
                          rules={[createNonNegativeRule("Commission Received")]}
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
              </Card>
            </Form>
          </Card>
        </section>
      )}

      {/* Submit Financial Analysis Button - Only for PD department */}
      {currentDepartment === "PD" && (
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
                    background:
                      loading || !!verificationData?.financialAnalysis
                        ? "#9ca3af"
                        : "#1e40af",
                    border: "none",
                    borderRadius: "6px",
                    height: "32px",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow:
                      loading || !!verificationData?.financialAnalysis
                        ? "none"
                        : "0 2px 8px rgba(30, 64, 175, 0.3)",
                    color: "#ffffff",
                  }}
                >
                  {loading
                    ? "Submitting..."
                    : !!verificationData?.financialAnalysis
                      ? "Financial Analysis Already Submitted"
                      : "Submit Financial Analysis"}
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
      <Footer
        editorContent={editorContent}
        disabled={hasEditRequest}
        handleSave={handleSave}
        verdict={completeVerificationData?.approvedStatus}
        open={open}
        setOpen={setOpen}
        verificationType="Business"
      />
    </div>
  );
};
