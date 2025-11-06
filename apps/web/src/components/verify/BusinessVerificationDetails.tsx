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


const convertTimeToHTML5Format = (timeString: string): string => {
  if (!timeString) return "";
  
  if (/^\d{1,2}:\d{2}$/.test(timeString.trim())) {
    return timeString.trim();
  }
  
  const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
  const match = timeString.trim().match(timeRegex);
  
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }
 
  return timeString;
};


const convertTimeFromHTML5Format = (timeString: string): string => {
  if (!timeString) return "";
  
  
  if (/AM|PM/i.test(timeString)) {
    return timeString;
  }
  
  // Try to parse "HH:MM" format (24-hour)
  const timeRegex = /(\d{1,2}):(\d{2})/;
  const match = timeString.trim().match(timeRegex);
  
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    
    const period = hours >= 12 ? "PM" : "AM";
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }
    
    return `${hours}:${minutes} ${period}`;
  }
  
 
  return timeString;
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
  console.log("verificationData", verificationData);
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

  const [activeSections, setActiveSections] = useState<string[]>([]);

  const formInstancesRef = React.useRef<{ [key: string]: any }>({});

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

  const handleVerificationExecutiveSubmit = async () => {
    try {
      setLoading(true);

      const rawApiData =
        verificationData?.verificationData || verificationData || {};
      const existingVerificationData = rawApiData as Record<string, any>;

      let allSectionsData: Record<string, any> = mergeDeep(
        existingVerificationData,
        dynamicFormData || {}
      );

      allSectionsData = mergeDeep(allSectionsData, changedData || {});

      Object.keys(formInstancesRef.current).forEach((sectionId) => {
        const instance = formInstancesRef.current[sectionId];
        if (instance) {
          const formValues = instance.getFieldsValue();
          if (formValues && Object.keys(formValues).length > 0) {
            allSectionsData[sectionId] = mergeDeep(
              allSectionsData[sectionId] || {},
              formValues
            );
          }
        }
      });

      if (allSectionsData.financialAnalysis) {
        console.log("Financial Analysis data collected:", allSectionsData.financialAnalysis);
      }

      Object.keys(existingVerificationData).forEach((sectionKey) => {
        if (sectionKey === "uploadedItems") return;

        if (!allSectionsData[sectionKey]) {
          allSectionsData[sectionKey] =
            existingVerificationData[sectionKey];
        }
      });

      const uploadedItems =
        existingVerificationData?.uploadedItems ||
        verificationData?.verificationData?.uploadedItems ||
        verificationData?.uploadedItems ||
        [];

      const { uploadedItems: _, ...sectionsWithoutUploadedItems } =
        allSectionsData;


      const verificationDataPayload = {
        ...sectionsWithoutUploadedItems,
        uploadedItems: uploadedItems,
      };

      const synopsis =
        editorContent || "Business verification completed successfully";

      const payload = {
        verificationType: "Business",
        verificationData: verificationDataPayload,
        synopsis,
      };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));
      if ((verificationDataPayload as any).financialAnalysis) {
        console.log("Financial Analysis in payload:", (verificationDataPayload as any).financialAnalysis);
      }

      await asstVerifierSubmitApi(id as string, payload);

      message.success("Verification submitted successfully!");

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
    parentFormInstancesRef,
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
    parentFormInstancesRef: React.MutableRefObject<{ [key: string]: any }>;
  }) => {
    const [sectionUncommittedChanges, setSectionUncommittedChanges] =
      useState<any>({});

    const formInstancesRef = parentFormInstancesRef;

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
    // Using useMemo to ensure it updates when sectionUncommittedChanges changes
    // This ensures the button visibility updates when form values change
    const hasUncommittedChanges = (sectionId: string) => {
      const sectionChanges = sectionUncommittedChanges[sectionId];
      if (!sectionChanges) return false;

      // Check if there are any non-empty values in the section changes
      return Object.keys(sectionChanges).some((key) => {
        const value = sectionChanges[key];
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        if (typeof value === "object" && value !== null) {
          return Object.keys(value).length > 0;
        }
        return value !== undefined && value !== null && value !== "";
      });
    };

    // Handle save for a specific section
    const handleSectionSave = async (sectionId: string) => {
      try {
        // Get current form values from the form instance for the section being saved
        const formInstance = formInstancesRef.current[sectionId];
        let sectionData: any = {};

        if (formInstance) {
          // Get all current form values from this section's form
          sectionData = formInstance.getFieldsValue();
        } else {
          // Fallback to uncommitted changes if form instance not available
          sectionData = sectionUncommittedChanges[sectionId];
        }

        if (!sectionData || Object.keys(sectionData).length === 0) {
          message.warning("No changes to save");
          return;
        }

        // Save to backend API
        try {
          // Get all initial data (contains all sections from backend)
          const rawApiData =
            verificationData?.verificationData || verificationData || {};
          const existingVerificationData = rawApiData as Record<string, any>;

          // Collect data from ALL sections to preserve them
          // 1. Start with all initial verification data (preserves ALL sections from backend)
          // 2. Merge with formData (dynamicFormData) which may have initial loaded data
          // 3. Merge committed changes from IndexedDB
          // 4. Get current values from all form instances
          // 5. Include uncommitted changes
          let allSectionsData: Record<string, any> = mergeDeep(
            existingVerificationData,
            formData || {}
          );

          // Merge committed changes
          allSectionsData = mergeDeep(allSectionsData, changedData || {});

          // Update with data from all form instances (if available)
          // Form instances have the most current values, so they take precedence
          // But preserve all sections that exist in initial data (even without form instances)
          Object.keys(formInstancesRef.current).forEach((sid) => {
            const instance = formInstancesRef.current[sid];
            if (instance) {
              const formValues = instance.getFieldsValue();
              if (formValues && Object.keys(formValues).length > 0) {
                // Merge with existing data to preserve fields not in the form
                allSectionsData[sid] = mergeDeep(
                  allSectionsData[sid] || {},
                  formValues
                );
              }
            }
          });

          // Also include uncommitted changes from other sections that don't have form instances
          Object.keys(sectionUncommittedChanges).forEach((sid) => {
            const uncommittedData = sectionUncommittedChanges[sid];
            if (uncommittedData && Object.keys(uncommittedData).length > 0) {
              // Merge with existing or form instance data
              allSectionsData[sid] = mergeDeep(
                allSectionsData[sid] || {},
                uncommittedData
              );
            }
          });

          // Ensure the current section's data is included (takes precedence)
          allSectionsData[sectionId] = mergeDeep(
            allSectionsData[sectionId] || {},
            sectionData
          );

          // IMPORTANT: Preserve ALL sections from initial data, even if they don't have form instances
          // This ensures sections like commonPoints, familyBackground, etc. are not lost
          Object.keys(existingVerificationData).forEach((sectionKey) => {
            // Skip uploadedItems - we'll add it separately at the end
            if (sectionKey === "uploadedItems") return;

            // If section doesn't exist in allSectionsData, preserve it from initial data
            if (!allSectionsData[sectionKey]) {
              allSectionsData[sectionKey] =
                existingVerificationData[sectionKey];
            }
          });

          // Get uploadedItems from existing verification data or from the prop
          const uploadedItems =
            existingVerificationData?.uploadedItems ||
            verificationData?.verificationData?.uploadedItems ||
            verificationData?.uploadedItems ||
            [];

          // Remove uploadedItems from allSectionsData if it exists there (we'll add it at the end)
          const { uploadedItems: _, ...sectionsWithoutUploadedItems } =
            allSectionsData;

          // Include uploadedItems inside verificationData (at the root level of verificationData)
          const mergedVerificationData = {
            ...sectionsWithoutUploadedItems,
            uploadedItems: uploadedItems,
          };

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
            // findings,
            verificationData: mergedVerificationData,
            // approvedStatus,
          });

          // Also save to IndexedDB for local tracking
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
                  console.error("Error saving to IndexedDB:", putRequest.error);
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

          message.success(
            `Section "${schema?.sections?.find((s: any) => s.id === sectionId)?.label}" saved successfully`
          );

          // Refresh verification data
          fetchVerificationData?.();
        } catch (error: any) {
          console.error("Error saving section to backend:", error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to save section";
          message.error(errorMessage);
        }
      } catch (error) {
        console.error("Error saving section:", error);
        message.error("Failed to save section");
      }
    };

    // Header component - no memo to ensure it re-renders when state changes
    const SectionHeader = ({
      sectionLabel,
      sectionId,
      sectionChanges,
      onSave,
    }: {
      sectionLabel: string;
      sectionId: string;
      sectionChanges: any;
      onSave: () => void;
    }) => {
      // Calculate hasChanges directly from the state passed as prop
      // Handle undefined/null sectionChanges properly
      const hasChanges = (() => {
        if (!sectionChanges || typeof sectionChanges !== "object") {
          return false;
        }

        const keys = Object.keys(sectionChanges);
        if (keys.length === 0) {
          return false;
        }

        // Check if there are any non-empty values
        return keys.some((key) => {
          const value = sectionChanges[key];

          // Skip empty strings
          if (value === "" || value === null || value === undefined) {
            return false;
          }

          // Check arrays
          if (Array.isArray(value)) {
            return value.length > 0;
          }

          // Check objects (but not empty objects)
          if (typeof value === "object" && value !== null) {
            return Object.keys(value).length > 0;
          }

          // For other types, if it exists, it's a change
          return true;
        });
      })();

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{sectionLabel}</span>
          {(role === "Verifier" || role === "Admin") &&
            activeSections.includes(sectionId) &&
            hasChanges && (
              <Button
                type="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent collapse toggle
                  onSave();
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
      );
    };

    return (
      <div>
        <Collapse
          activeKey={activeSections}
          onChange={(keys) => {
            // Only update if user manually changed (not from state updates)
            setActiveSections(
              Array.isArray(keys) ? keys : [keys].filter(Boolean)
            );
          }}
          accordion={false}
        >
          {schema?.sections?.map((section: any) => (
            <Collapse.Panel
              key={section.id}
              header={
                <SectionHeader
                  sectionLabel={section.label}
                  sectionId={section.id}
                  sectionChanges={sectionUncommittedChanges[section.id] || {}}
                  onSave={() => handleSectionSave(section.id)}
                />
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
                onFormInstanceReady={(formInstance) => {
                  formInstancesRef.current[section.id] = formInstance;
                }}
                isActive={activeSections.includes(section.id)}
              />
              {/* </Form> */}
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    );
  };

  // Formula evaluation utility
  const evaluateFormula = (
    formula: string,
    formValues: Record<string, any>
  ): number | null => {
    if (!formula || typeof formula !== "string") return null;

    try {
      // Extract field references from formula (words that match field names)
      // Replace field references with their actual values
      let evaluatedFormula = formula;

      // Find all potential field names (words that appear in formValues)
      const fieldNames = Object.keys(formValues).filter(
        (key) =>
          formValues[key] !== undefined &&
          formValues[key] !== null &&
          formValues[key] !== ""
      );

      // Replace field references with their numeric values
      for (const fieldName of fieldNames) {
        const regex = new RegExp(`\\b${fieldName}\\b`, "g");
        const value = formValues[fieldName];
        const numValue =
          typeof value === "number" ? value : parseFloat(String(value));
        if (!isNaN(numValue)) {
          evaluatedFormula = evaluatedFormula.replace(regex, String(numValue));
        }
      }

      // Check if formula still contains field references (meaning some values are missing)
      // This is a simple check - if the formula contains words that look like field names, we might be missing values
      // But we'll try to evaluate anyway and return null if it fails

      // Safely evaluate the formula using Function constructor
      // This allows us to evaluate expressions like "a + b" or "(a + b) * 100"
      const result = Function(
        '"use strict"; return (' + evaluatedFormula + ")"
      )();
      return typeof result === "number" && !isNaN(result) ? result : null;
    } catch (error) {
      // If evaluation fails, return null (field dependencies might not be filled yet)
      return null;
    }
  };

  // Form Section Renderer - Updated to handle the actual schema structure
  const FormSectionRenderer = ({
    section,
    data,
    readOnly,
    setSectionUncommittedChanges,
    changedData,
    onFormInstanceReady,
    isActive,
  }: {
    section: any;
    data: any;
    readOnly: boolean;
    setSectionUncommittedChanges: (fn: (prev: any) => any) => void;
    changedData: any;
    onFormInstanceReady?: (formInstance: any) => void;
    isActive?: boolean;
  }) => {
    // console.log(section);
    const [form] = Form.useForm();
    const previousSectionIdRef = React.useRef<string | null>(null);
    const previousIsActiveRef = React.useRef<boolean>(false);
    const lastInitializedDataRef = React.useRef<any>(null);

    // Register form instance with parent
    React.useEffect(() => {
      if (onFormInstanceReady) {
        onFormInstanceReady(form);
      }
    }, [form, onFormInstanceReady]);

    // Set initial form values when section changes, on first mount, or when section becomes active
    React.useEffect(() => {
      const isNewSection = previousSectionIdRef.current !== section.id;
      const becameActive = isActive && !previousIsActiveRef.current;

      if (isNewSection || previousSectionIdRef.current === null) {
        // New section or first mount - initialize with data (includes uncommitted changes)
        form.setFieldsValue(data || {});
        previousSectionIdRef.current = section.id;
        previousIsActiveRef.current = isActive || false;
        lastInitializedDataRef.current = data;
      } else if (becameActive) {
        // Section became active - re-initialize with latest data (preserves uncommitted changes)
        // Only re-initialize if data actually changed to avoid losing user input
        if (
          JSON.stringify(data) !==
          JSON.stringify(lastInitializedDataRef.current)
        ) {
          form.setFieldsValue(data || {});
          lastInitializedDataRef.current = data;
        }
        previousIsActiveRef.current = true;
      } else {
        previousIsActiveRef.current = isActive || false;
      }
      // Intentionally not including 'data' in deps to avoid resetting during typing
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section.id, form, isActive]);

    // Watch form values to recalculate formulas
    const formValues = Form.useWatch([], form);

    // Calculate formula fields whenever form values change
    React.useEffect(() => {
      if (!isActive || !formValues) return; // Only calculate when section is active

      const calculatedFields: Record<string, any> = {};

      // Find all fields with formulas and calculate them
      section.fields?.forEach((field: any) => {
        if (field.formula) {
          const calculatedValue = evaluateFormula(field.formula, formValues);
          if (calculatedValue !== null) {
            calculatedFields[field.id] = calculatedValue;
          }
        }
      });

      // Update form with calculated values only if they differ from current values
      if (Object.keys(calculatedFields).length > 0) {
        const fieldsToUpdate: Record<string, any> = {};
        Object.entries(calculatedFields).forEach(([key, val]) => {
          const currentValue = formValues[key];
          const currentNum =
            typeof currentValue === "number"
              ? currentValue
              : parseFloat(String(currentValue));
          const newNum =
            typeof val === "number" ? val : parseFloat(String(val));

          // Only update if value has actually changed (avoid infinite loops)
          if (isNaN(currentNum) || Math.abs(currentNum - newNum) > 0.0001) {
            fieldsToUpdate[key] = val;
          }
        });

        if (Object.keys(fieldsToUpdate).length > 0) {
          form.setFieldsValue(fieldsToUpdate);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues, isActive]);

    // Form change handler - update section-level uncommitted changes and recalculate formulas
    const handleFormChange = useCallback(
      (changedValues: any, allValues: any) => {
        // Recalculate formula fields
        const calculatedFields: Record<string, any> = {};
        section.fields?.forEach((field: any) => {
          if (field.formula) {
            const calculatedValue = evaluateFormula(field.formula, allValues);
            if (calculatedValue !== null) {
              calculatedFields[field.id] = calculatedValue;
            }
          }
        });

        // Update form with calculated values
        if (Object.keys(calculatedFields).length > 0) {
          form.setFieldsValue(calculatedFields);
          // Merge calculated fields into allValues for uncommitted changes
          Object.assign(allValues, calculatedFields);
        }

        // Update section-level uncommitted changes
        setSectionUncommittedChanges((prev: any) => ({
          ...prev,
          [section.id]: allValues,
        }));
      },
      [section.id, section.fields, form, setSectionUncommittedChanges]
    );

    // Helper functions for financial analysis field grouping
    const isFinancialAnalysisSection = () => {
      return (
        section.id === "financialAnalysis" ||
        section.id === "financialAnalysisComprehensive" ||
        section.label?.toLowerCase().includes("financial")
      );
    };

    // Use side and variant attributes that are set by the schema conversion service
    // These are determined from the credit/debit arrays in the schema
    const getFieldSide = (field: any): "debit" | "credit" | null => {
      // Use the side attribute set by schema service (from credit/debit arrays)
      return field.side || null;
    };

    const getFieldVariant = (field: any): "estimated" | "actuals" | null => {
      // Use the variant attribute set by schema service
      return field.variant || null;
    };

    // Extract base name for grouping (removes side/variant suffixes)
    const getBaseFieldName = (field: any): string => {
      const fieldId = field.id || "";
      const title = field.label || field.title || "";

      // Try to extract base from title (remove "To"/"By" and " - Estimated/Actuals")
      let base = title
        .replace(/^(To|By)\s+/i, "")
        .replace(/\s*-\s*(Estimated|Actuals|Estimations)$/i, "")
        .trim();

      // If title extraction didn't work, use field ID
      if (!base || base === title) {
        base = fieldId
          .replace(/Debit|Credit/gi, "")
          .replace(/Actuals|Estimations|Estimated/gi, "")
          .replace(/_2023|_2024/g, "")
          .replace(/Change$/, "");
      }

      return base || fieldId;
    };

    // Group fields for financial analysis display
    // Groups fields by base name, then organizes into 4 parts: [Debit Estimated, Debit Actuals, Credit Estimated, Credit Actuals]
    const groupFinancialFields = (
      fields: any[]
    ): {
      grouped: Array<{
        baseName: string;
        debitEstimated: any | null;
        debitActuals: any | null;
        creditEstimated: any | null;
        creditActuals: any | null;
        debitOnly: any | null; // For fields without estimated/actuals variant on debit side
        creditOnly: any | null; // For fields without estimated/actuals variant on credit side
      }>;
      standalone: any[];
    } => {
      if (!isFinancialAnalysisSection()) {
        return { grouped: [], standalone: fields };
      }

      // Group fields by base name while preserving order
      // Use Map to store groups and an array to track order of first occurrence
      const fieldGroups = new Map<
        string,
        {
          baseName: string;
          debitEstimated: any | null;
          debitActuals: any | null;
          creditEstimated: any | null;
          creditActuals: any | null;
          debitOnly: any | null;
          creditOnly: any | null;
        }
      >();
      const groupOrder: string[] = []; // Track the order groups are created

      const processed = new Set<string>();
      const standalone: any[] = [];

      fields.forEach((field) => {
        if (processed.has(field.id)) return;

        const baseName = getBaseFieldName(field);
        const side = getFieldSide(field);
        const variant = getFieldVariant(field);

        // Initialize group if it doesn't exist and track its order
        if (!fieldGroups.has(baseName)) {
          fieldGroups.set(baseName, {
            baseName,
            debitEstimated: null,
            debitActuals: null,
            creditEstimated: null,
            creditActuals: null,
            debitOnly: null,
            creditOnly: null,
          });
          groupOrder.push(baseName); // Track order of first occurrence
        }

        const group = fieldGroups.get(baseName)!;

        // Categorize field based on side and variant
        if (side === "debit") {
          if (variant === "estimated") {
            group.debitEstimated = field;
          } else if (variant === "actuals") {
            group.debitActuals = field;
          } else {
            // No variant, goes in debitOnly
            group.debitOnly = field;
          }
        } else if (side === "credit") {
          if (variant === "estimated") {
            group.creditEstimated = field;
          } else if (variant === "actuals") {
            group.creditActuals = field;
          } else {
            // No variant, goes in creditOnly
            group.creditOnly = field;
          }
        } else {
          // No side determined, treat as standalone
          standalone.push(field);
          processed.add(field.id);
          return;
        }

        processed.add(field.id);
      });

      // Convert map to array in the order groups were first encountered
      const grouped = groupOrder.map((baseName) => fieldGroups.get(baseName)!);

      return { grouped, standalone };
    };

    // Render a single field (for use in grouped and standalone rendering)
    const renderSingleField = (
      fieldId: string,
      field: any,
      showLabel = true
    ) => {
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

      // Fields with formulas are read-only
      const isFormulaField = !!field.formula;
      const fieldReadOnly = readOnly || field.readOnly || isFormulaField;

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
          <Form.Item
            key={fieldId}
            name={fieldId}
            label={showLabel ? field.label : undefined}
          >
            <Select
              disabled={fieldReadOnly}
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
            <Form.Item
              key={fieldId}
              name={fieldId}
              label={showLabel ? field.label : undefined}
            >
              <Radio.Group disabled={fieldReadOnly}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          );

        case "text":
        case "string":
          const isTimeField =
            (field.label?.toLowerCase().includes("time") ||
              fieldId.toLowerCase().includes("time")) &&
            !field.label?.toLowerCase().includes("date") &&
            !fieldId.toLowerCase().includes("date");

          const isDateField =
            (field.label?.toLowerCase().includes("date") ||
              field.label?.toLowerCase().includes("visit") ||
              fieldId.toLowerCase().includes("date")) &&
            !isTimeField;

          if (isTimeField) {
            return (
              <Form.Item
                key={fieldId}
                name={fieldId}
                label={showLabel ? field.label : undefined}
                getValueFromEvent={(e) => {
                
                  return convertTimeFromHTML5Format(e.target.value);
                }}
                getValueProps={(value) => {
                  return {
                    value: convertTimeToHTML5Format(value || ""),
                  };
                }}
              >
                <Input
                  disabled={fieldReadOnly}
                  placeholder={`Select ${field.label}`}
                  type="time"
                />
              </Form.Item>
            );
          }

          if (isDateField) {
            return (
              <Form.Item
                key={fieldId}
                name={fieldId}
                label={showLabel ? field.label : undefined}
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
                  disabled={fieldReadOnly}
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
              <Form.Item
                key={fieldId}
                name={fieldId}
                label={showLabel ? field.label : undefined}
              >
                <TextArea
                  disabled={fieldReadOnly}
                  placeholder={field.placeholder || field.label}
                  rows={field.textAreaRows || field.ui?.rows || 3}
                />
              </Form.Item>
            );
          }

          return (
            <Form.Item
              key={fieldId}
              name={fieldId}
              label={showLabel ? field.label : undefined}
            >
              <Input
                disabled={readOnly || field.readOnly}
                placeholder={field.placeholder || field.label}
              />
            </Form.Item>
          );

        case "integer":
        case "number":
          return (
            <Form.Item
              key={fieldId}
              name={fieldId}
              label={showLabel ? field.label : undefined}
            >
              <InputNumber
                disabled={fieldReadOnly}
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
              label={showLabel ? field.label : undefined}
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
                disabled={fieldReadOnly}
                placeholder={`Select ${field.label}`}
                type="date"
              />
            </Form.Item>
          );

        case "select":
          return (
            <Form.Item
              key={fieldId}
              name={fieldId}
              label={showLabel ? field.label : undefined}
            >
              <Select
                disabled={fieldReadOnly}
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
            <Form.Item
              key={fieldId}
              name={fieldId}
              label={showLabel ? field.label : undefined}
            >
              <Input
                disabled={readOnly || field.readOnly}
                placeholder={field.placeholder || field.label}
              />
            </Form.Item>
          );
      }
    };

    // Render all grouped fields for financial analysis
    // Layout: All groups rendered in a single row with two columns
    // Left column: All debit fields stacked vertically (Estimated then Actuals for each group)
    // Right column: All credit fields stacked vertically (Estimated then Actuals for each group)
    const renderAllGroupedFields = (
      groups: Array<{
        baseName: string;
        debitEstimated: any | null;
        debitActuals: any | null;
        creditEstimated: any | null;
        creditActuals: any | null;
        debitOnly: any | null;
        creditOnly: any | null;
      }>
    ) => {
      // Helper to get clean title from a field
      const getCleanTitle = (field: any | null, baseName: string): string => {
        if (!field) return baseName;
        const title = field.title || field.label || baseName;
        return title
          .replace(/^(To|By)\s+/i, "")
          .replace(/\s*-\s*(Estimated|Actuals|Estimations)$/i, "")
          .trim();
      };

      // Collect all debit fields and credit fields in order
      const debitFields: Array<{
        field: any;
        title: string;
        variant: "estimated" | "actuals" | "only";
      }> = [];
      const creditFields: Array<{
        field: any;
        title: string;
        variant: "estimated" | "actuals" | "only";
      }> = [];

      groups.forEach((group) => {
        const baseTitle = getCleanTitle(
          group.debitEstimated ||
            group.debitActuals ||
            group.debitOnly ||
            group.creditEstimated ||
            group.creditActuals ||
            group.creditOnly,
          group.baseName
        );

        const hasDebitVariants =
          group.debitEstimated !== null || group.debitActuals !== null;
        const hasCreditVariants =
          group.creditEstimated !== null || group.creditActuals !== null;
        const hasVariants = hasDebitVariants || hasCreditVariants;

        // Add debit fields in order (Estimated, then Actuals, or Only if no variants)
        if (group.debitEstimated) {
          debitFields.push({
            field: group.debitEstimated,
            title: baseTitle,
            variant: "estimated",
          });
        } else if (!hasVariants && group.debitOnly) {
          debitFields.push({
            field: group.debitOnly,
            title: baseTitle,
            variant: "only",
          });
        }

        if (group.debitActuals) {
          debitFields.push({
            field: group.debitActuals,
            title: baseTitle,
            variant: "actuals",
          });
        }

        // Add credit fields in order (Estimated, then Actuals, or Only if no variants)
        if (group.creditEstimated) {
          creditFields.push({
            field: group.creditEstimated,
            title: baseTitle,
            variant: "estimated",
          });
        } else if (!hasVariants && group.creditOnly) {
          creditFields.push({
            field: group.creditOnly,
            title: baseTitle,
            variant: "only",
          });
        }

        if (group.creditActuals) {
          creditFields.push({
            field: group.creditActuals,
            title: baseTitle,
            variant: "actuals",
          });
        }
      });

      // Find the maximum number of fields to determine layout
      const maxFields = Math.max(debitFields.length, creditFields.length);

      return (
        <Col
          key="financial-analysis-all-groups"
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
          xxl={24}
        >
          <div style={{ marginBottom: 24 }}>
            <Row gutter={[8, 8]}>
              {/* Debit Side (Left Column) - All debit fields stacked vertically */}
              <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <div
                  style={{
                    borderRight: "1px solid #e8e8e8",
                    paddingRight: 12,
                  }}
                >
                  {debitFields.map((item, index) => (
                    <div
                      key={`debit-${item.field.id}`}
                      style={{
                        marginBottom: index < debitFields.length - 1 ? 16 : 0,
                      }}
                    >
                      <div>
                        <Text
                          strong
                          style={{
                            fontSize: "12px",
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          {item.title}
                        </Text>
                        {item.variant !== "only" && (
                          <Text
                            type="secondary"
                            style={{
                              fontSize: "11px",
                              display: "block",
                              marginBottom: 4,
                            }}
                          >
                            {item.variant === "estimated"
                              ? "Estimated"
                              : "Actuals"}
                          </Text>
                        )}
                        {renderSingleField(item.field.id, item.field, false)}
                      </div>
                    </div>
                  ))}
                  {debitFields.length === 0 && (
                    <Text type="secondary" style={{ fontStyle: "italic" }}>
                      No debit fields
                    </Text>
                  )}
                </div>
              </Col>

              {/* Credit Side (Right Column) - All credit fields stacked vertically */}
              <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <div style={{ paddingLeft: 12 }}>
                  {creditFields.map((item, index) => (
                    <div
                      key={`credit-${item.field.id}`}
                      style={{
                        marginBottom: index < creditFields.length - 1 ? 16 : 0,
                      }}
                    >
                      <div>
                        <Text
                          strong
                          style={{
                            fontSize: "12px",
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          {item.title}
                        </Text>
                        {item.variant !== "only" && (
                          <Text
                            type="secondary"
                            style={{
                              fontSize: "11px",
                              display: "block",
                              marginBottom: 4,
                            }}
                          >
                            {item.variant === "estimated"
                              ? "Estimated"
                              : "Actuals"}
                          </Text>
                        )}
                        {renderSingleField(item.field.id, item.field, false)}
                      </div>
                    </div>
                  ))}
                  {creditFields.length === 0 && (
                    <Text type="secondary" style={{ fontStyle: "italic" }}>
                      No credit fields
                    </Text>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      );
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

    // Group financial analysis fields if this is a financial section
    const { grouped: groupedFields, standalone: standaloneFields } =
      isFinancialAnalysisSection()
        ? groupFinancialFields(visibleFields)
        : { grouped: [], standalone: visibleFields };

    // Separate regular fields from array fields (arrays take full width)
    const regularStandaloneFields = standaloneFields.filter(
      (field: any) => field.type !== "array" || !field.arrayItemFields
    );
    const arrayFields = standaloneFields.filter(
      (field: any) => field.type === "array" && field.arrayItemFields
    );

    return (
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <Row gutter={[16, 16]}>
          {/* Grouped financial fields - all groups rendered together with debit on left, credit on right */}
          {groupedFields.length > 0 && renderAllGroupedFields(groupedFields)}

          {/* Regular standalone fields - responsive grid: 3 cols (xxl/xl), 2 cols (md), 1 col (sm/xs) */}
          {regularStandaloneFields.map((field: any) => (
            <Col key={field.id} xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              {renderSingleField(field.id, field, true)}
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
              {renderSingleField(field.id, field, true)}
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
    const previousFieldIdRef = React.useRef<string | null>(null);

    // Update items only when field changes or on initial mount
    // Don't reset when data changes due to user input
    React.useEffect(() => {
      const isNewField = previousFieldIdRef.current !== field.id;
      if (isNewField || previousFieldIdRef.current === null) {
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
        previousFieldIdRef.current = field.id;
      }
      // Intentionally not including 'data' to avoid resetting on user input
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.id, form]);

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

    // Sync form values and trigger change handler when items change
    const previousItemsLengthRef = React.useRef(items.length);
    React.useEffect(() => {
      if (previousItemsLengthRef.current !== items.length) {
        // Items were added or removed, update form and trigger change handler
        const formValues: any = {};
        items.forEach((item: any, index: number) => {
          Object.keys(item).forEach((key) => {
            if (key !== "_id") {
              formValues[`${field.id}[${index}].${key}`] = item[key];
            }
          });
        });
        form.setFieldsValue(formValues);
        handleArrayFormChange({}, formValues);
        previousItemsLengthRef.current = items.length;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length]);

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
          const isArrayItemTimeField =
            (itemField.label?.toLowerCase().includes("time") ||
              itemFieldId.toLowerCase().includes("time")) &&
            !itemField.label?.toLowerCase().includes("date") &&
            !itemFieldId.toLowerCase().includes("date");

          const isArrayItemDateField =
            (itemField.label?.toLowerCase().includes("date") ||
              itemField.label?.toLowerCase().includes("visit") ||
              itemFieldId.toLowerCase().includes("date")) &&
            !isArrayItemTimeField;

          if (isArrayItemTimeField) {
            return (
              <Form.Item
                key={itemFieldId}
                name={fieldKey}
                label={itemField.label}
                getValueFromEvent={(e) => {
                  // Convert HH:MM to HH:MM AM/PM when saving
                  return convertTimeFromHTML5Format(e.target.value);
                }}
                getValueProps={(value) => {
                  // Convert HH:MM AM/PM to HH:MM when displaying
                  return {
                    value: convertTimeToHTML5Format(value || ""),
                  };
                }}
              >
                <Input
                  disabled={readOnly || itemField.readOnly}
                  placeholder={`Select ${itemField.label}`}
                  type="time"
                />
              </Form.Item>
            );
          }

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
              parentFormInstancesRef={formInstancesRef}
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
                            display: "inline-block",
                            minWidth: "300px",
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

      {/* Edit Request Logs - Only for FI department, not for PD */}
      {role !== "VerificationExecutive" && currentDepartment !== "PD" && (
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
