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
  Collapse,
  InputNumber,
  Radio,
  Select,
} from "antd";

const { TextArea } = Input;
import React, { useEffect, useState, useCallback, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import EditRequestLogs from "./EditRequestLogs";
import PDRequestLogs from "./PDRequestLogs";
import Footer from "./Footer";
import AssistantVerifierFooter from "./AssistantVerifierFooter";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import FinalVerdict from "./FinalVerdict";
import Feedback from "./Feedback";
import {
  patchFinalVerdict,
  verifierEditApi,
  asstVerifierSubmitApi,
  submitFinancialAnalysis,
  updateSynopsis,
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
import { USER_DETAILS } from "@/constants/defaultKeys";
import { getItem } from "@/helpers/localStorage";
import dynamic from "next/dynamic";

// Date format conversion utilities
const convertDDMMYYYYToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return "";
  // Handle DD-MM-YYYY format
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return dateString;
};

const convertYYYYMMDDToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  // Handle YYYY-MM-DD format
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
  return dateString;
};

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
  const curDept = getItem("currentDepartment");
  const userDetails = getItem(USER_DETAILS, true) as any;
  const role = userDetails?.departmentRoles?.find(
    (role: any) => role.department === curDept
  )?.role;
  // console.log(role);
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

  // Collapse state - moved to parent level to persist across re-renders
  const [activeSections, setActiveSections] = useState<string[]>([]);

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

        // Get bank name from completeVerificationData (which has the full verification object)
        const bankName =
          completeVerificationData?.bankName ||
          verificationData?.bankName ||
          verificationData?.loan?.bankName ||
          "";

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

          console.log("schema: ", schema);

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

            // Transform the data structure to match the schema
            const transformDataForSchema = (rawData: any, schema: any) => {
              console.log("rawData: ", rawData);
              console.log("schema: ", schema);
              const transformed: any = {};

              // Process each section in the schema
              schema.sections?.forEach((section: any) => {
                const sectionId = section.id;
                const sectionData = rawData[sectionId];

                if (sectionData) {
                  // Handle the actual schema structure with fields array
                  if (section.fields && Array.isArray(section.fields)) {
                    const sectionTransformed: any = {};

                    section.fields.forEach((field: any) => {
                      const fieldData = sectionData[field.id];
                      if (fieldData !== undefined) {
                        sectionTransformed[field.id] = fieldData;
                      }
                    });

                    transformed[sectionId] = sectionTransformed;
                  } else {
                    transformed[sectionId] = sectionData;
                  }
                }
              });

              console.log("transformed data: ", transformed);
              return transformed;
            };

            const transformedData = transformDataForSchema(rawFormData, schema);
            const formData = cleanEmptyStrings(transformedData, schema);

            console.log("Final form data being set:", formData);
            setDynamicFormData(formData);

            // console.log(
            //   "✓ PD schema loaded from backend successfully:",
            //   schema.name
            // );

            // Debug: Log the data being passed to GenericVerificationDisplay
            // console.log("🎯 Data passed to GenericVerificationDisplay:");
            // console.log("  formData:", formData);
            // console.log(
            //   "  schema sections:",
            //   schema.sections?.map((s: any) => s.id)
            // );
            // console.log("✓ Form data initialized:", formData);
          } else {
            // console.log(
            //   `Bank "${bankName}" schema could not be converted to web format`
            // );
            setUseNewApproach(false);
          }
        } catch (schemaError: any) {
          // console.log(
          //   `Bank "${bankName}" does not have PD forms or error loading:`,
          //   schemaError.message
          // );
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
        uploadedItems: data?.uploadedItems || [], // Include photo capture data
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
        verificationData?.type || completeVerificationData?.type || "Business";
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
        uploadedItems: data?.uploadedItems || [], // Include photo capture data
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

  // Handle Verification Executive Submit
  const handleVerificationExecutiveSubmit = async () => {
    try {
      setLoading(true);

      // Prepare verification data
      const verificationDataPayload = {
        ...dynamicFormData,
        ...changedData,
        uploadedItems: data?.uploadedItems || [], // Include photo capture data inside verificationData
      };

      // Get synopsis from editor content
      const synopsis =
        editorContent || "Business verification completed successfully";

      // Prepare the complete payload
      const payload = {
        verificationType: "Business",
        verificationData: verificationDataPayload,
        synopsis,
      };

      // Call the assistant verifier API
      await asstVerifierSubmitApi(id as string, payload);

      message.success("Verification submitted successfully!");

      // Refresh the verification data
      // fetchVerificationData();
      router.push(`/verify`);
    } catch (error: any) {
      console.error("Error submitting verification executive data:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit verification data";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!verificationData) return null;

  // Get bank name from completeVerificationData (which has the full verification object)
  const bankName =
    completeVerificationData?.bankName ||
    verificationData?.bankName ||
    "Axis Finance";

  // Extract the form data directly
  const rawApiData = verificationData?.verificationData || verificationData;
  const data = rawApiData;

  // Debug logging
  // console.log("🔍 BusinessVerificationDetails Debug:");
  // console.log("  verificationData:", verificationData);
  // console.log("  rawApiData:", rawApiData);
  // console.log("  data:", data);
  // console.log("  bankName:", bankName);

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

  const getButton = (formKey: string) => (
    <Button
      type="text"
      icon={<EditOutlined />}
      onClick={() => onEdit(formKey)}
      disabled={hasEditRequest}
    />
  );

  // Helper function to check conditional visibility (from SchemaSection.tsx)
  const checkConditionalVisibility = (
    dependencies: Record<string, any>,
    formData: any
  ) => {
    for (const [fieldName, expectedValue] of Object.entries(dependencies)) {
      const actualValue = formData[fieldName];

      if (Array.isArray(expectedValue)) {
        // Multiple allowed values
        if (!expectedValue.includes(actualValue)) {
          return false;
        }
      } else {
        // Single expected value
        if (actualValue !== expectedValue) {
          return false;
        }
      }
    }

    return true;
  };

  // Create a new component for collapsible form sections
  const CollapsibleFormSections = ({
    schema,
    formData,
    onEdit,
    readOnly,
    activeSections,
    setActiveSections,
    role,
    verificationData,
    changedData,
    setChangedData,
    setLocalEditLogsUpdated,
  }: {
    schema: any;
    formData: any;
    onEdit: (sectionId: string) => void;
    readOnly: boolean;
    activeSections: string[];
    setActiveSections: (sections: string[]) => void;
    role: string;
    verificationData: any;
    changedData: any;
    setChangedData: (data: any) => void;
    setLocalEditLogsUpdated: (fn: (prev: number) => number) => void;
  }) => {
    // Section-level uncommitted changes state
    const [sectionUncommittedChanges, setSectionUncommittedChanges] =
      useState<any>({});

    const toggleSection = (sectionId: string) => {
      // Check if there are uncommitted changes before closing
      if (
        activeSections.includes(sectionId) &&
        sectionUncommittedChanges[sectionId]
      ) {
        Modal.confirm({
          title: "Unsaved Changes",
          content:
            "You have unsaved changes in this section. Do you want to save them before closing?",
          okText: "Save & Close",
          cancelText: "Discard",
          onOk: () => {
            handleSectionSave(sectionId);
            setActiveSections(activeSections.filter((id) => id !== sectionId));
          },
          onCancel: () => {
            // Discard changes
            setSectionUncommittedChanges((prev: any) => {
              const newChanges = { ...prev };
              delete newChanges[sectionId];
              return newChanges;
            });
            setActiveSections(activeSections.filter((id) => id !== sectionId));
          },
        });
      } else {
        setActiveSections(
          activeSections.includes(sectionId)
            ? activeSections.filter((id) => id !== sectionId)
            : [...activeSections, sectionId]
        );
      }
    };

    // Check if there are uncommitted changes in a section
    const hasUncommittedChanges = (sectionId: string) => {
      const sectionChanges = sectionUncommittedChanges[sectionId];
      if (!sectionChanges) return false;

      // Check if there are any non-empty values in the section changes
      return Object.keys(sectionChanges).some((key) => {
        const value = sectionChanges[key];
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== undefined && value !== null && value !== "";
      });
    };

    // Handle save for a specific section
    const handleSectionSave = async (sectionId: string) => {
      try {
        const sectionData = sectionUncommittedChanges[sectionId];

        if (!sectionData) {
          message.warning("No changes to save");
          return;
        }

        // Save to IndexedDB
        const request = indexedDB.open("editLogs", 1);

        request.onerror = (event: any) => {
          console.error("Database error:", request.error);
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
                [sectionId]: sectionData,
                timestamp: new Date().toISOString(),
              };

              const putRequest = store.put(logEntry);

              putRequest.onsuccess = () => {
                console.log(`Section ${sectionId} saved successfully`);
                message.success(
                  `Section "${schema?.sections?.find((s: any) => s.id === sectionId)?.label}" saved successfully`
                );

                // Move uncommitted changes to committed changes
                setChangedData((prev: any) => ({
                  ...prev,
                  [sectionId]: sectionData,
                }));

                // Clear section uncommitted changes
                setSectionUncommittedChanges((prev: any) => {
                  const newChanges = { ...prev };
                  delete newChanges[sectionId];
                  return newChanges;
                });

                setLocalEditLogsUpdated((prev) => prev + 1); // Trigger refresh
              };

              putRequest.onerror = () => {
                console.error("Error saving section:", putRequest.error);
                message.error("Failed to save section");
              };
            };

            getRequest.onerror = () => {
              console.error("Error fetching existing log:", getRequest.error);
            };

            transaction.oncomplete = () => {
              db.close();
            };

            transaction.onerror = () => {
              console.error("Transaction error:", transaction.error);
              db.close();
            };
          } catch (error) {
            console.error("Error in transaction:", error);
            db.close();
          }
        };
      } catch (error) {
        console.error("Error saving section:", error);
        message.error("Failed to save section");
      }
    };

    return (
      <div>
        {schema?.sections?.map((section: any) => (
          // <Card
          //   key={section.id}
          //   title={section.label}
          //   extra={
          //     <Button
          //       type="text"
          //       icon={<EditOutlined />}
          //       onClick={() => onEdit(section.id)}
          //       disabled={readOnly}
          //     />
          //   }
          //   style={{ marginBottom: 16 }}
          // >
          <Collapse
            activeKey={activeSections}
            onChange={(keys) => setActiveSections(keys as string[])}
            accordion
          >
            <Collapse.Panel
              key={section.id}
              header={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{section.label}</span>
                  {role === "Verifier" &&
                    activeSections.includes(section.id) &&
                    hasUncommittedChanges(section.id) && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent collapse toggle
                          handleSectionSave(section.id);
                        }}
                        style={{
                          marginLeft: "8px",
                          fontSize: "12px",
                          height: "24px",
                          padding: "0 8px",
                        }}
                      >
                        Save
                      </Button>
                    )}
                </div>
              }
            >
              {/* <Form layout="vertical"> */}
              {/* Render form fields based on section schema */}
              <FormSectionRenderer
                section={section}
                data={useMemo(
                  () => ({
                    ...(dynamicFormData[section.id] ||
                      formData[section.id] ||
                      {}),
                    ...(changedData[section.id] || {}), // Include committed changes
                    ...(sectionUncommittedChanges[section.id] || {}),
                  }),
                  [
                    dynamicFormData[section.id],
                    formData[section.id],
                    changedData[section.id], // Add changedData to dependencies
                    sectionUncommittedChanges[section.id],
                  ]
                )}
                readOnly={readOnly}
                setSectionUncommittedChanges={setSectionUncommittedChanges}
                changedData={changedData}
              />
              {/* </Form> */}
            </Collapse.Panel>
          </Collapse>
          // </Card>
        ))}
      </div>
    );
  };

  // Form Section Renderer - Updated to handle the actual schema structure
  const FormSectionRenderer = ({
    section,
    data,
    readOnly,
    setSectionUncommittedChanges,
    changedData,
  }: {
    section: any;
    data: any;
    readOnly: boolean;
    setSectionUncommittedChanges: (fn: (prev: any) => any) => void;
    changedData: any;
  }) => {
    console.log(section);
    const [form] = Form.useForm();
    const initialValuesSet = React.useRef(false);

    // Set initial form values
    React.useEffect(() => {
      form.setFieldsValue(data);
    }, [data, form]);

    // Form change handler - update section-level uncommitted changes
    const handleFormChange = useCallback(
      (changedValues: any, allValues: any) => {
        // Update section-level uncommitted changes
        setSectionUncommittedChanges((prev: any) => ({
          ...prev,
          [section.id]: allValues,
        }));
      },
      [section.id, setSectionUncommittedChanges]
    );

    const renderField = (fieldId: string, field: any) => {
      // Check conditional visibility
      if (field.dependencies?.show) {
        const shouldShow = checkConditionalVisibility(
          field.dependencies.show,
          data
        );
        if (!shouldShow) {
          return null; // Hide field if conditions not met
        }
      }

      // Check if field is required
      const isRequired = field?.required ?? false;

      // Handle array fields
      if (field.type === "array" && field.arrayItemFields) {
        return (
          <div key={fieldId} style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>
                {field.label}
                {isRequired ? " *" : ""}
              </Text>
            </div>
            <ArrayFieldRenderer
              field={field}
              data={useMemo(() => {
                const baseData = data[fieldId] || [];
                const committedChanges =
                  changedData[section.id]?.[fieldId] || [];
                // Note: uncommitted changes for arrays are handled differently
                return committedChanges.length > 0
                  ? committedChanges
                  : baseData;
              }, [data[fieldId], changedData[section.id]])}
              readOnly={readOnly}
              setSectionUncommittedChanges={setSectionUncommittedChanges}
              sectionId={section.id}
            />
          </div>
        );
      }

      // Handle enum fields (select dropdown)
      if (field.enum && field.enum.length > 0) {
        return (
          <Form.Item key={fieldId} name={fieldId} label={field.label}>
            <Select
              disabled={readOnly || field.readOnly}
              placeholder={`Select ${field.label}`}
            >
              {field.enum.map((option: string) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      }

      // Handle different field types
      switch (field.type) {
        case "boolean":
          return (
            <Form.Item key={fieldId} name={fieldId} label={field.label}>
              <Radio.Group disabled={readOnly || field.readOnly}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          );

        case "text":
        case "string":
          // Check if it should be a date field based on field name or label
          const isDateField =
            field.label?.toLowerCase().includes("date") ||
            field.label?.toLowerCase().includes("visit") ||
            fieldId.toLowerCase().includes("date");

          if (isDateField) {
            return (
              <Form.Item
                key={fieldId}
                name={fieldId}
                label={field.label}
                getValueFromEvent={(e) => {
                  // Convert YYYY-MM-DD to DD-MM-YYYY when saving
                  return convertYYYYMMDDToDDMMYYYY(e.target.value);
                }}
                getValueProps={(value) => {
                  // Convert DD-MM-YYYY to YYYY-MM-DD when displaying
                  return {
                    value: convertDDMMYYYYToYYYYMMDD(value || ""),
                  };
                }}
              >
                <Input
                  disabled={readOnly || field.readOnly}
                  placeholder={`Select ${field.label}`}
                  type="date"
                />
              </Form.Item>
            );
          }

          // Check if it should be a textarea
          if (
            field.type === "textarea" ||
            field.ui?.widget === "textarea" ||
            field.ui?.widget === "richtext"
          ) {
            return (
              <Form.Item key={fieldId} name={fieldId} label={field.label}>
                <TextArea
                  disabled={readOnly || field.readOnly}
                  placeholder={field.placeholder || field.label}
                  rows={field.textAreaRows || field.ui?.rows || 3}
                />
              </Form.Item>
            );
          }

          return (
            <Form.Item key={fieldId} name={fieldId} label={field.label}>
              <Input
                disabled={readOnly || field.readOnly}
                placeholder={field.placeholder || field.label}
              />
            </Form.Item>
          );

        case "integer":
        case "number":
          return (
            <Form.Item key={fieldId} name={fieldId} label={field.label}>
              <InputNumber
                disabled={readOnly || field.readOnly}
                style={{ width: "100%" }}
                placeholder={field.placeholder || field.label}
                formatter={
                  field.formatter?.useIndianFormat
                    ? (value) => {
                        if (!value) return "";
                        const num = parseFloat(String(value));
                        return new Intl.NumberFormat("en-IN", {
                          minimumFractionDigits:
                            field.formatter?.minDecimalPlaces || 0,
                          maximumFractionDigits:
                            field.formatter?.maxDecimalPlaces || 2,
                        }).format(num);
                      }
                    : undefined
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") || ""}
              />
            </Form.Item>
          );

        case "date":
          return (
            <Form.Item
              key={fieldId}
              name={fieldId}
              label={field.label}
              getValueFromEvent={(e) => {
                // Convert YYYY-MM-DD to DD-MM-YYYY when saving
                return convertYYYYMMDDToDDMMYYYY(e.target.value);
              }}
              getValueProps={(value) => {
                // Convert DD-MM-YYYY to YYYY-MM-DD when displaying
                return {
                  value: convertDDMMYYYYToYYYYMMDD(value || ""),
                };
              }}
            >
              <Input
                disabled={readOnly || field.readOnly}
                placeholder={`Select ${field.label}`}
                type="date"
              />
            </Form.Item>
          );

        case "select":
          return (
            <Form.Item key={fieldId} name={fieldId} label={field.label}>
              <Select
                disabled={readOnly || field.readOnly}
                placeholder={`Select ${field.label}`}
              >
                {field.options?.map((option: string) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          );

        default:
          return (
            <Form.Item key={fieldId} name={fieldId} label={field.label}>
              <Input
                disabled={readOnly || field.readOnly}
                placeholder={field.placeholder || field.label}
              />
            </Form.Item>
          );
      }
    };

    // Handle the actual schema structure from the backend
    // The backend now returns sections with fields array
    if (!section.fields || !Array.isArray(section.fields)) {
      return <div>No fields found for section: {section.label}</div>;
    }

    // Filter fields that should be visible
    const visibleFields = section.fields.filter((field: any) => {
      if (field.dependencies?.show) {
        return checkConditionalVisibility(field.dependencies.show, data);
      }
      return true;
    });

    // Separate regular fields from array fields (arrays take full width)
    const regularFields = visibleFields.filter(
      (field: any) => field.type !== "array" || !field.arrayItemFields
    );
    const arrayFields = visibleFields.filter(
      (field: any) => field.type === "array" && field.arrayItemFields
    );

    return (
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <Row gutter={[16, 16]}>
          {/* Regular fields - responsive grid: 3 cols (xxl/xl), 2 cols (md), 1 col (sm/xs) */}
          {regularFields.map((field: any) => (
            <Col key={field.id} xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              {renderField(field.id, field)}
            </Col>
          ))}
          {/* Array fields - always full width */}
          {arrayFields.map((field: any) => (
            <Col
              key={field.id}
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
            >
              {renderField(field.id, field)}
            </Col>
          ))}
        </Row>
      </Form>
    );
  };

  // Array Field Renderer - Updated to handle the actual schema structure
  const ArrayFieldRenderer = ({
    field,
    data,
    readOnly,
    setSectionUncommittedChanges,
    sectionId,
  }: {
    field: any;
    data: any;
    readOnly: boolean;
    setSectionUncommittedChanges: (fn: (prev: any) => any) => void;
    sectionId: string;
  }) => {
    // Ensure data is an array and add unique IDs if missing
    const ensureArrayWithIds = (arrayData: any[]) => {
      if (!Array.isArray(arrayData)) return [];
      return arrayData.map((item, index) => ({
        ...item,
        _id: item._id || `item-${index}-${Date.now()}`,
      }));
    };

    const [items, setItems] = useState(() => ensureArrayWithIds(data));
    const [form] = Form.useForm();
    const initialValuesSet = React.useRef(false);

    // Update items when data changes
    React.useEffect(() => {
      const newItems = ensureArrayWithIds(data);
      setItems(newItems);

      // Set form values
      const formValues: any = {};
      newItems.forEach((item: any, index: number) => {
        Object.keys(item).forEach((key) => {
          if (key !== "_id") {
            formValues[`${field.id}[${index}].${key}`] = item[key];
          }
        });
      });
      form.setFieldsValue(formValues);
    }, [data, field.id, form]);

    // Array form change handler - update section-level uncommitted changes
    const handleArrayFormChange = useCallback(
      (changedValues: any, allValues: any) => {
        // Convert form values back to array format
        const arrayData: any[] = [];
        Object.keys(allValues).forEach((key) => {
          if (key.startsWith(`${field.id}[`)) {
            const match = key.match(
              new RegExp(`${field.id}\\[(\\d+)\\]\\.(.+)`)
            );
            if (match) {
              const index = parseInt(match[1]);
              const fieldKey = match[2];

              if (!arrayData[index]) {
                arrayData[index] = {};
              }
              arrayData[index][fieldKey] = allValues[key];
            }
          }
        });

        // Update section-level uncommitted changes
        setSectionUncommittedChanges((prev: any) => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            [field.id]: arrayData,
          },
        }));
      },
      [field.id, sectionId, setSectionUncommittedChanges]
    );

    const addItem = () => {
      const newItem: any = {
        _id: `item-${items.length}-${Date.now()}`,
      };

      // Handle the actual schema structure from backend
      if (field.arrayItemFields) {
        field.arrayItemFields.forEach((itemField: any) => {
          newItem[itemField.id] = "";
        });
      }

      setItems([...items, newItem]);
    };

    const removeItem = (index: number) => {
      setItems(items.filter((_: any, i: number) => i !== index));
    };

    const renderArrayItemField = (
      itemFieldId: string,
      itemField: any,
      itemValue: any,
      itemIndex: number
    ) => {
      const fieldKey = `${field.id}[${itemIndex}].${itemFieldId}`;

      // Handle enum fields (select dropdown) in arrays
      if (itemField.enum && itemField.enum.length > 0) {
        return (
          <Form.Item key={itemFieldId} name={fieldKey} label={itemField.label}>
            <Select
              disabled={readOnly || itemField.readOnly}
              placeholder={`Select ${itemField.label}`}
            >
              {itemField.enum.map((option: string) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      }

      // Handle different field types within array items
      switch (itemField.type) {
        case "number":
        case "integer":
          return (
            <Form.Item
              key={itemFieldId}
              name={fieldKey}
              label={itemField.label}
            >
              <InputNumber
                disabled={readOnly || itemField.readOnly}
                style={{ width: "100%" }}
                placeholder={itemField.placeholder || itemField.label}
                formatter={
                  itemField.formatter?.useIndianFormat
                    ? (value) => {
                        if (!value) return "";
                        const num = parseFloat(String(value));
                        return new Intl.NumberFormat("en-IN", {
                          minimumFractionDigits:
                            itemField.formatter?.minDecimalPlaces || 0,
                          maximumFractionDigits:
                            itemField.formatter?.maxDecimalPlaces || 2,
                        }).format(num);
                      }
                    : undefined
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") || ""}
              />
            </Form.Item>
          );

        case "date":
          return (
            <Form.Item
              key={itemFieldId}
              name={fieldKey}
              label={itemField.label}
              getValueFromEvent={(e) => {
                // Convert YYYY-MM-DD to DD-MM-YYYY when saving
                return convertYYYYMMDDToDDMMYYYY(e.target.value);
              }}
              getValueProps={(value) => {
                // Convert DD-MM-YYYY to YYYY-MM-DD when displaying
                return {
                  value: convertDDMMYYYYToYYYYMMDD(value || ""),
                };
              }}
            >
              <Input
                disabled={readOnly || itemField.readOnly}
                placeholder={`Select ${itemField.label}`}
                type="date"
              />
            </Form.Item>
          );

        case "string":
          // Check if it should be a date field based on field name or label
          const isArrayItemDateField =
            itemField.label?.toLowerCase().includes("date") ||
            itemField.label?.toLowerCase().includes("visit") ||
            itemFieldId.toLowerCase().includes("date");

          if (isArrayItemDateField) {
            return (
              <Form.Item
                key={itemFieldId}
                name={fieldKey}
                label={itemField.label}
                getValueFromEvent={(e) => {
                  // Convert YYYY-MM-DD to DD-MM-YYYY when saving
                  return convertYYYYMMDDToDDMMYYYY(e.target.value);
                }}
                getValueProps={(value) => {
                  // Convert DD-MM-YYYY to YYYY-MM-DD when displaying
                  return {
                    value: convertDDMMYYYYToYYYYMMDD(value || ""),
                  };
                }}
              >
                <Input
                  disabled={readOnly || itemField.readOnly}
                  placeholder={`Select ${itemField.label}`}
                  type="date"
                />
              </Form.Item>
            );
          }

          // Check if it should be a textarea
          if (
            itemField.ui?.widget === "textarea" ||
            itemField.ui?.widget === "richtext"
          ) {
            return (
              <Form.Item
                key={itemFieldId}
                name={fieldKey}
                label={itemField.label}
              >
                <TextArea
                  disabled={readOnly || itemField.readOnly}
                  placeholder={itemField.placeholder || itemField.label}
                  rows={itemField.ui?.rows || 3}
                />
              </Form.Item>
            );
          }

          return (
            <Form.Item
              key={itemFieldId}
              name={fieldKey}
              label={itemField.label}
            >
              <Input
                disabled={readOnly || itemField.readOnly}
                placeholder={itemField.placeholder || itemField.label}
              />
            </Form.Item>
          );

        case "boolean":
          return (
            <Form.Item
              key={itemFieldId}
              name={fieldKey}
              label={itemField.label}
            >
              <Radio.Group disabled={readOnly || itemField.readOnly}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          );

        default:
          return (
            <Form.Item
              key={itemFieldId}
              name={fieldKey}
              label={itemField.label}
            >
              <Input
                disabled={readOnly || itemField.readOnly}
                placeholder={itemField.placeholder || itemField.label}
              />
            </Form.Item>
          );
      }
    };

    return (
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleArrayFormChange}
      >
        {items.map((item: any, index: number) => (
          <Card
            key={item._id || index}
            size="small"
            style={{ marginBottom: 8 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text strong>Item {index + 1}</Text>
              {!readOnly && (
                <Button
                  type="text"
                  danger
                  size="small"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Render fields based on schema structure */}
            {field.arrayItemFields
              ? field.arrayItemFields.map((itemField: any) =>
                  renderArrayItemField(
                    itemField.id,
                    itemField,
                    item[itemField.id],
                    index
                  )
                )
              : null}
          </Card>
        ))}
        {!readOnly && (
          <Button type="dashed" onClick={addItem} style={{ width: "100%" }}>
            + Add {field.label}
          </Button>
        )}
      </Form>
    );
  };

  return (
    <div>
      {/* Bank Name Header */}
      {currentDepartment === "PD" &&
        (completeVerificationData?.bankName ||
          verificationData?.bankName ||
          verificationData?.loan?.bankName) && (
          <section style={{ margin: "6px 0 12px", textAlign: "center" }}>
            <Text style={{ color: "#1e40af", fontWeight: 600 }}>
              {typeof completeVerificationData?.bankName === "string"
                ? completeVerificationData.bankName
                : typeof verificationData?.bankName === "string"
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

      {/* {console.log(useGenericApproach, schemaForm, formLoading)} */}

      {/* Main Single Column Layout */}
      <div style={{ padding: "0 12px" }}>
        {/* PD Department - Use Dynamic Forms Only */}
        {currentDepartment === "PD" &&
        useGenericApproach &&
        schemaForm &&
        !formLoading ? (
          <>
            <CollapsibleFormSections
              schema={schemaForm}
              formData={dynamicFormData}
              onEdit={handleDynamicSectionEdit}
              readOnly={!!verificationData?.approvedStatus || hasEditRequest}
              activeSections={activeSections}
              setActiveSections={setActiveSections}
              role={role}
              verificationData={verificationData}
              changedData={changedData}
              setChangedData={setChangedData}
              setLocalEditLogsUpdated={setLocalEditLogsUpdated}
            />

            {/* Photo Capture Section - Grouped by Document Type */}
            <section style={{ marginBottom: 24 }}>
              <Card title="Photo Capture">
                {(() => {
                  // Group photos by document type
                  const groupedPhotos = (data?.uploadedItems || []).reduce(
                    (acc: any, item: any) => {
                      const docType = item.documentType || "Other";
                      if (!acc[docType]) {
                        acc[docType] = [];
                      }
                      acc[docType].push(item);
                      return acc;
                    },
                    {}
                  );

                  return Object.entries(groupedPhotos).map(
                    ([docType, photos]: [string, any]) => (
                      <div key={docType} style={{ marginBottom: 24 }}>
                        {/* Document Type Header */}
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            marginBottom: "12px",
                            fontWeight: "600",
                            fontSize: "14px",
                            textAlign: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          📄 {docType}
                        </div>

                        {/* Photos Grid for this document type */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "16px",
                          }}
                        >
                          {photos.map((item: any, idx: number) => (
                            <div key={item.id} style={{ position: "relative" }}>
                              <Image
                                src={imageUrls[item.id] || ""}
                                alt={`${docType} Photo ${idx + 1}`}
                                style={{
                                  width: "100%",
                                  height: "200px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  border: "2px solid #f0f0f0",
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: "rgba(0, 0, 0, 0.7)",
                                  color: "white",
                                  padding: "6px 8px",
                                  fontSize: "11px",
                                  borderRadius: "0 0 4px 4px",
                                }}
                              >
                                {docType} - Photo {idx + 1}{" "}
                                {item?.isCamera ? "📷" : "🖼️"}
                              </div>
                              {!(
                                !!verificationData?.approvedStatus ||
                                hasEditRequest
                              ) && (
                                <Button
                                  type="text"
                                  danger
                                  icon={<CloseCircleOutlined />}
                                  style={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    background: "rgba(255, 255, 255, 0.9)",
                                    borderRadius: "50%",
                                    width: "28px",
                                    height: "28px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                  }}
                                  onClick={() => handleDeleteClick(item.id)}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })()}

                {/* Show message if no photos */}
                {(!data?.uploadedItems || data.uploadedItems.length === 0) && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#999",
                      fontSize: "14px",
                    }}
                  >
                    📷 No photos captured yet
                  </div>
                )}
              </Card>
            </section>

            {/* Synopsis Section - Using Feedback component */}
            <Feedback
              disabled={!!verificationData?.approvedStatus || hasEditRequest}
              verdict={verdict}
              setVerdict={setVerdict}
              editorContent={editorContent}
              setEditorContent={setEditorContent}
              handleSave={handleSave}
              verificationData={verificationData}
              currentDepartment={currentDepartment}
              hasEditRequest={hasEditRequest}
            />
          </>
        ) : /* FI Department - Use Static Components */
        currentDepartment === "FI" ? (
          <>
            {/* Legacy FI Static Components */}
            <BusinessBasicDetailsDescription
              data={mergedLegacyData}
              extra={getButton("basicDetails")}
              logs={false}
            />
            <BusinessDetailsDescription
              data={mergedLegacyData}
              extra={getButton("businessDetails")}
              logs={false}
            />
            <BusinessMiscellaneousDescription
              data={mergedLegacyData}
              extra={getButton("miscellaneous")}
              logs={false}
            />
            <ExistingLoansDescription
              data={mergedLegacyData}
              extra={getButton("existingLoans")}
              logs={false}
            />
            <ThirdPartyCheckDescription
              data={mergedLegacyData}
              extra={getButton("thirdPartyCheck")}
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
                  {data?.uploadedItems?.map((item: any, idx: number) => {
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
                          Photo {idx + 1} {item?.isCamera ? null : "(Gallery)"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </section>

            {/* Final Verdict Section */}
            <FinalVerdict
              disabled={hasEditRequest}
              verdict={verdict}
              setVerdict={setVerdict}
              editorContent={editorContent}
              setEditorContent={setEditorContent}
              handleSave={handleSave}
            />
          </>
        ) : null}
      </div>

      {/* Edit Request Logs - Conditional rendering based on department */}
      {role !== "VerificationExecutive" && (
        <section style={{ marginBottom: 24 }}>
          {currentDepartment === "PD"
            ? useMemo(
                () => (
                  <PDRequestLogs
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
                ),
                [
                  data,
                  changedData,
                  verificationId,
                  hasEditRequest,
                  activeTab,
                  currentDepartment,
                  schemaForm,
                ]
              )
            : useMemo(
                () => (
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
                ),
                [
                  data,
                  changedData,
                  verificationId,
                  hasEditRequest,
                  activeTab,
                  currentDepartment,
                  schemaForm,
                ]
              )}
        </section>
      )}

      {/* Footer */}
      {role !== "VerificationExecutive" && (
        <>
          <Footer
            editorContent={editorContent}
            disabled={hasEditRequest}
            handleSave={handleSave}
            verdict={completeVerificationData?.approvedStatus}
            open={open}
            setOpen={setOpen}
            verificationType="Business"
            currentDepartment={currentDepartment}
          />
        </>
      )}

      {/* Verification Executive Footer */}
      {role === "VerificationExecutive" && (
        <AssistantVerifierFooter
          onSave={handleVerificationExecutiveSubmit}
          loading={loading}
          disabled={hasEditRequest}
        />
      )}
    </div>
  );
};
