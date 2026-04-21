import { useTabContext } from "@/pages/verify/[id]";
import { getS3ImageUrl, compressImage } from "@/utils/utility";
import {
  deleteDraft,
  loadDraft,
  saveDraftSection,
} from "@/utils/draftStore";
import {
  CloseCircleOutlined,
  EditOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  FileOutlined,
} from "@ant-design/icons";
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
  DatePicker,
  TimePicker,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "react-quill/dist/quill.snow.css";

const COORDINATE_FIELD_KEYS = [
  "siteCoordinates",
  "coordinates",
  "latitude",
  "longitude",
  "latitudeLongitude",
  "latitudeAndLongitude",
  "officeGeoTag",
  "customerGeoTag",
  "geoTag",
  "geoCoordinates",
  "geoLocation",
  "lat",
  "lng",
  "long",
  "siteLatitude",
  "siteLongitude",
  "currentLatitude",
  "currentLongitude",
];

const isCoordinateField = (fieldId: string): boolean => {
  if (!fieldId) return false;
  const fieldIdLower = fieldId.toLowerCase();
  return COORDINATE_FIELD_KEYS.some(
    (key) => fieldIdLower === key.toLowerCase()
  );
};

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
  getPresignedUploadUrl,
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
  pdEmailLogs?: any[];
  loanTemplateName?: string;
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
  pdEmailLogs,
  loanTemplateName,
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
  const [pdfViewerVisible, setPdfViewerVisible] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);
  const [currentPdfFileName, setCurrentPdfFileName] = useState<string>("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const processedFilesRef = useRef<Set<string>>(new Set());
  const [editorContent, setEditorContent] = useState(() => {
    const content = currentDepartment === "FI" 
      ? completeVerificationData?.path 
      : completeVerificationData?.synopsis;
    
    if (content) {
      const isHtmlList = /<\s*ul[^>]*>/i.test(content);
      return isHtmlList ? content : "<ul><li><br></li></ul>";
    }
    return "<ul><li><br></li></ul>";
  });

  useEffect(() => {
    const content = currentDepartment === "FI" 
      ? completeVerificationData?.path 
      : completeVerificationData?.synopsis;
    
    if (content) {
      const isHtmlList = /<\s*ul[^>]*>/i.test(content);
      const contentToSet = isHtmlList ? content : content;
      setEditorContent(contentToSet);
    }
  }, [completeVerificationData?.path, completeVerificationData?.synopsis, currentDepartment]);

  // Sync verdict state when approvedStatus changes
  useEffect(() => {
    if (completeVerificationData?.approvedStatus === "Positive") {
      setVerdict("positive");
    } else if (completeVerificationData?.approvedStatus === "Negative") {
      setVerdict("negative");
    } else if (completeVerificationData?.approvedStatus === "CreditRefer") {
      setVerdict("credit_refer");
    } else {
      setVerdict(null);
    }
  }, [completeVerificationData?.approvedStatus]);

  const [changedData, setChangedData] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState(
    completeVerificationData?.approvedStatus === "Positive"
      ? "positive"
      : completeVerificationData?.approvedStatus === "Negative"
        ? "negative"
        : completeVerificationData?.approvedStatus === "CreditRefer"
          ? "credit_refer"
          : null
  );
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if (savedSectionRef.current && savedSectionScrollRef.current !== null) {
      const scrollPosition = savedSectionScrollRef.current;
      const sectionId = savedSectionRef.current;
      const prevViewportTop = savedSectionViewportTopRef.current;

      const sectionElement = document.getElementById(`section-${sectionId}`);
      if (sectionElement && typeof prevViewportTop === "number") {
        const newViewportTop = sectionElement.getBoundingClientRect().top;
        const delta = newViewportTop - prevViewportTop;
        window.scrollTo({
          top: (window.scrollY || window.pageYOffset) + delta,
          behavior: "auto",
        });
      } else {
        window.scrollTo({ top: scrollPosition, behavior: "auto" });
      }

      savedSectionRef.current = null;
      savedSectionScrollRef.current = null;
      savedSectionViewportTopRef.current = null;
    }
  }, [verificationData, completeVerificationData]); // Trigger when data updates

  // New dynamic form states
  const [schemaForm, setSchemaForm] = useState<WebFormDefinition | null>(null);
  const [useNewApproach, setUseNewApproach] = useState(false);
  const schemaCacheKeyRef = useRef<string | null>(null);

  // Ref to track section that was just saved (for scroll restoration)
  const savedSectionRef = React.useRef<string | null>(null);
  const savedSectionScrollRef = React.useRef<number | null>(null);
  const savedSectionViewportTopRef = React.useRef<number | null>(null);
  const [useGenericApproach, setUseGenericApproach] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [dynamicFormData, setDynamicFormData] = useState<WebFormData>({});

  const [savedSectionData, setSavedSectionData] = useState<Record<string, any>>(
    {}
  );

  // Dynamic edit modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditSection, setCurrentEditSection] = useState<string>("");
  const [currentSectionSchema, setCurrentSectionSchema] = useState<any>(null);
  const [localEditLogsUpdated, setLocalEditLogsUpdated] = useState(0);

  const [activeSections, setActiveSections] = useState<string[]>([]);

  const formInstancesRef = React.useRef<{ [key: string]: any }>({});

  const handleSave = async () => {
    let status: string;
    if (verdict === "positive") {
      status = "Positive";
    } else if (verdict === "negative") {
      status = "Negative";
    } else if (verdict === "credit_refer") {
      status = "CreditRefer";
    } else {
      status = "Positive"; // default fallback
    }

    patchFinalVerdict(id as string, "Business", {
      status,
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
      // For VerificationExecutive: prioritize savedSectionData.uploadedItems
      const uploadedItems =
        (role === "VerificationExecutive" && savedSectionData?.uploadedItems) ||
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
    role,
    savedSectionData?.uploadedItems,
    verificationData?.uploadedItems,
    verificationData?.verificationData?.uploadedItems,
  ]);

  useEffect(() => {
    // PD: reconcile drafts against server updatedAt via draftStore helper
    // so stale drafts saved before a VE re-submit on another device are
    // dropped silently. FI continues to use the inline logic below.
    if (currentDepartment === "PD") {
      (async () => {
        try {
          if (hasEditRequest) {
            await deleteDraft(String(id), activeTab);
            setChangedData({});
            return;
          }
          const serverUpdatedAt = verificationData?.updatedAt;
          const draft = await loadDraft(String(id), activeTab, serverUpdatedAt);
          setChangedData(draft ?? {});
        } catch (err) {
          console.error("PD draft load error:", err);
        }
      })();
      return;
    }

    const request = indexedDB.open("editLogs", 1);

    request.onerror = (event) => {
      console.error("Database error:", request.error);
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;

      try {
        if (hasEditRequest) {
          const transaction = db.transaction("logs", "readwrite");
          const store = transaction.objectStore("logs");
          const deleteRequest = store.delete(`${id}_${activeTab}`);

          deleteRequest.onsuccess = () => {
            console.log("Cleared IndexedDB record due to edit request");
            setChangedData({});
            db.close();
          };

          deleteRequest.onerror = () => {
            console.error("Error deleting from IndexedDB:", deleteRequest.error);
            db.close();
          };

          transaction.oncomplete = () => {
            db.close();
          };
          return;
        }

        // Otherwise, load the data normally
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
  }, [
    id,
    activeTab,
    editLogsUpdated,
    localEditLogsUpdated,
    hasEditRequest,
    currentDepartment,
    verificationData?.updatedAt,
  ]);

  useEffect(() => {
    const loadDynamicSchema = async () => {
      try {
        // Get bank name from completeVerificationData (which has the full verification object)
        const bankName =
          completeVerificationData?.bankName ||
          verificationData?.bankName ||
          verificationData?.loan?.bankName ||
          "";

        const templateName =
          completeVerificationData?.loan?.templateName ||
          verificationData?.loan?.templateName ||
          "";

        const deptKey = currentDepartment || "PD";
        const schemaKey = `${deptKey}::${bankName}::${templateName}`;

        if (!bankName && !templateName) {
          console.log(
            "No bank name or template name found, skipping dynamic schema"
          );
          setUseNewApproach(false);
          setUseGenericApproach(false);
          schemaCacheKeyRef.current = null;
          setFormLoading(false);
          return;
        }

        const rawFormData =
          verificationData?.verificationData || verificationData || {};

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
                  const field = schema.fields.find((f: any) => f.id === key);
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

        const transformDataForSchema = (rawData: any, schema: any) => {
          const transformed: any = {};

          schema.sections?.forEach((section: any) => {
            const sectionId = section.id;
            const sectionData = rawData[sectionId];

            if (sectionData) {
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

          return transformed;
        };

        if (
          schemaForm &&
          useGenericApproach &&
          schemaCacheKeyRef.current === schemaKey
        ) {
          const transformedData = transformDataForSchema(
            rawFormData,
            schemaForm
          );
          const formData = cleanEmptyStrings(transformedData, schemaForm);
          setDynamicFormData(formData);
          setFormLoading(false);
          return;
        }

        setFormLoading(true);
        console.log(
          "Loading PD schema from backend for bank:",
          bankName,
          "templateName:",
          templateName
        );

        try {
          const { getSchemaFromBackend, convertBackendSchemaToWebFormat } =
            await import("@/services/schema.service");
          const backendResponse = await getSchemaFromBackend(
            bankName,
            deptKey,
            templateName || undefined
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
            schemaCacheKeyRef.current = schemaKey;

            // Initialize form data from existing verification data
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
  }, [verificationData, currentDepartment, useGenericApproach, schemaForm]);

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
    // PD: go through draftStore so baseUpdatedAt is stamped for later
    // stale-reconcile. FI keeps the inline IndexedDB write below.
    if (currentDepartment === "PD") {
      const validation = validateSectionData(data, currentSectionSchema);
      if (!validation.isValid) {
        message.error(validation.errors.join(", "));
        throw new Error("Validation failed");
      }
      try {
        await saveDraftSection(
          String(id),
          activeTab,
          sectionId,
          data,
          verificationData?.updatedAt
        );
        setEditModalVisible(false);
        setLocalEditLogsUpdated((prev) => prev + 1);
        fetchVerificationData();
        return;
      } catch (err) {
        console.error("PD draft save error:", err);
        message.error("Failed to save changes");
        throw err;
      }
    }

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

  const handleFeedbackSubmit = async () => {
    try {
      setLoading(true);
      if (!verdict) {
        message.error("Please select a verdict (Positive/Negative/Credit Refer)");
        return;
      }
      const synopsis = editorContent || "";
      let approvedStatus: "Positive" | "Negative" | "CreditRefer" | null = null;
      if (verdict === "positive") {
        approvedStatus = "Positive";
      } else if (verdict === "negative") {
        approvedStatus = "Negative";
      } else if (verdict === "credit_refer") {
        approvedStatus = "CreditRefer";
      }

      const payload: any = {
        approvedStatus: approvedStatus,
      };

      if (synopsis && synopsis.trim() !== "" && synopsis !== "<ul><li><br></li></ul>") {
        try {
          await updateSynopsis(id as string, synopsis);
        } catch (error) {
          console.error("Error updating synopsis:", error);
        }
      }

      await verifierEditApi(id as string, "Business", payload);

      message.success("Feedback submitted successfully!");

      if (fetchVerificationData) {
        fetchVerificationData();
      }
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      message.error(
        error?.response?.data?.message || "Failed to submit feedback"
      );
    } finally {
      setLoading(false);
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

      // Merge saved section data (from Save buttons - no API calls)
      allSectionsData = mergeDeep(allSectionsData, savedSectionData || {});

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
        console.log(
          "Financial Analysis data collected:",
          allSectionsData.financialAnalysis
        );
      }

      Object.keys(existingVerificationData).forEach((sectionKey) => {
        if (sectionKey === "uploadedItems") return;

        if (!allSectionsData[sectionKey]) {
          allSectionsData[sectionKey] = existingVerificationData[sectionKey];
        }
      });

      // Get uploadedItems from multiple sources, prioritizing savedSectionData for VerificationExecutive
      const uploadedItemsFromSaved = savedSectionData?.uploadedItems;
      const uploadedItems =
        uploadedItemsFromSaved ||
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

      let approvedStatus: "Positive" | "Negative" | "CreditRefer" | null = null;
      if (verdict === "positive") {
        approvedStatus = "Positive";
      } else if (verdict === "negative") {
        approvedStatus = "Negative";
      } else if (verdict === "credit_refer") {
        approvedStatus = "CreditRefer";
      }

      const payload = {
        verificationType: "Business",
        verificationData: verificationDataPayload,
        synopsis,
        approvedStatus,
      };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));
      if ((verificationDataPayload as any).financialAnalysis) {
        console.log(
          "Financial Analysis in payload:",
          (verificationDataPayload as any).financialAnalysis
        );
      }

      await asstVerifierSubmitApi(id as string, payload);

      message.success("Verification submitted successfully!");

      const page = router.query.page;
      if (page) {
        router.push({ pathname: "/verify", query: { page: page.toString() } });
      } else {
        router.push("/verify");
      }
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

  const data =
    role === "VerificationExecutive" && savedSectionData?.uploadedItems
      ? {
          ...rawApiData,
          uploadedItems: savedSectionData.uploadedItems,
        }
      : rawApiData;

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
    // Store scroll position and section ID for restoration after save (same as section save)
    const scrollPosition = window.scrollY || window.pageYOffset;
    savedSectionRef.current = "photoCapture";
    savedSectionScrollRef.current = scrollPosition;
    savedSectionViewportTopRef.current =
      document.getElementById("section-photoCapture")?.getBoundingClientRect()
        .top ?? null;

    if (role === "VerificationExecutive") {
      const currentItems =
        savedSectionData?.uploadedItems ||
        completeVerificationData?.verificationData?.uploadedItems ||
        verificationData?.verificationData?.uploadedItems ||
        [];

      const updatedItems = currentItems.filter(
        (photo: any) => photo?.id !== pid
      );

      // Update savedSectionData
      setSavedSectionData((prev: any) => ({
        ...prev,
        uploadedItems: updatedItems,
      }));

      // Also update the completeVerificationData state locally for immediate UI update
      if (completeVerificationData?.verificationData) {
        completeVerificationData.verificationData.uploadedItems = updatedItems;
      }

      message.success("Photo deleted successfully!");
      return;
    }

    // For Verifier/Admin: Update via API
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
      .then((res) => {
        message.success("Photo deleted successfully!");
        fetchVerificationData();
      })
      .catch((error) => {
        console.log(`Error:`, error);
        message.error("Failed to delete photo. Please try again.");
      });
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

  const isDocumentItem = (item: any): boolean => {
    return (
      item.type === "document" ||
      item.fileType === "pdf" ||
      (item.fileName && item.fileName.toLowerCase().endsWith(".pdf"))
    );
  };

  const getFileExtension = (item: any): string => {
    if (item.fileType) return item.fileType.toLowerCase();
    if (item.fileName) {
      const parts = item.fileName.split(".");
      if (parts.length > 1) return parts[parts.length - 1].toLowerCase();
    }
    return "jpg";
  };

  const handleViewDocument = async (item: any) => {
    try {
      const presignedUrl = await getS3ImageUrl(item.s3ImageUrl);

      if (!presignedUrl) {
        message.error("Failed to load document URL. Please try again.");
        return;
      }

      window.open(presignedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error loading document:", error);
      message.error("Failed to load document. Please try again.");
    }
  };

  const handleDownloadDocument = async (item: any) => {
    try {
      const presignedUrl = await getS3ImageUrl(item.s3ImageUrl);
      const fileName =
        item.fileName || item.s3ImageUrl.split("/").pop() || "document";

      const response = await fetch(presignedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      message.success("Document download started");
    } catch (error) {
      console.error("Error downloading document:", error);
      message.error("Failed to download document. Please try again.");
    }
  };

  const handleDownloadAllFiles = async () => {
    try {
      const uploadedItems = data?.uploadedItems || [];

      if (uploadedItems.length === 0) {
        message.warning("No files available to download");
        return;
      }

      message.loading({
        content: `Preparing ${uploadedItems.length} file(s) for download...`,
        key: "downloadAll",
        duration: 0,
      });

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < uploadedItems.length; i++) {
        const item = uploadedItems[i];
        try {
          const fileType = isDocumentItem(item) ? "document" : "photo";
          message.loading({
            content: `Downloading ${fileType} ${i + 1} of ${uploadedItems.length}...`,
            key: "downloadAll",
            duration: 0,
          });

          const presignedUrl = await getS3ImageUrl(item.s3ImageUrl);

          const response = await fetch(presignedUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status}`);
          }

          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = blobUrl;
          const fileName =
            item.fileName ||
            item.s3ImageUrl.split("/").pop() ||
            `file-${item.id}`;
          link.download = fileName;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);

          successCount++;

          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(
            `Error downloading ${item.fileName || item.id}:`,
            error
          );
          failCount++;
        }
      }

      message.destroy("downloadAll");
      if (successCount > 0) {
        message.success(
          `Successfully downloaded ${successCount} file(s) to your device`
        );
      }
      if (failCount > 0) {
        message.error(`Failed to download ${failCount} file(s)`);
      }
    } catch (error) {
      console.error("Error downloading all files:", error);
      message.destroy("downloadAll");
      message.error("Failed to download files. Please try again.");
    }
  };

  const MAX_PHOTO_UPLOADS = 50;

  const handleMultipleFileUpload = async (info: any) => {
    const { fileList } = info;

    const newFiles = fileList
      .filter((f: any) => {
        if (!f.originFileObj) return false;
        const fileKey = `${f.name}-${f.size}-${f.uid}`;
        if (processedFilesRef.current.has(fileKey)) return false;
        processedFilesRef.current.add(fileKey);
        return true;
      })
      .map((f: any) => f.originFileObj)
      .filter((f: any) => f instanceof File);

    if (newFiles.length === 0) return;

    const existingPhotos = (
      completeVerificationData?.verificationData?.uploadedItems || []
    ).filter((item: any) => item.type === "photo");
    const newPhotoFiles = newFiles.filter((f: File) => {
      const mime = (f.type || "").toLowerCase();
      const name = f.name.toLowerCase();
      return (
        mime === "image/jpeg" ||
        mime === "image/png" ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png")
      );
    });
    if (existingPhotos.length + newPhotoFiles.length > MAX_PHOTO_UPLOADS) {
      message.error(
        `You can only upload up to ${MAX_PHOTO_UPLOADS} photos. Currently ${existingPhotos.length} photo(s) uploaded.`
      );
      return;
    }

    let successCount = 0;
    let failCount = 0;
    let allNewItems: any[] = [];
    const existingItems =
      completeVerificationData?.verificationData?.uploadedItems || [];

    const scrollPosition = window.scrollY || window.pageYOffset;
    savedSectionRef.current = "photoCapture";
    savedSectionScrollRef.current = scrollPosition;
    savedSectionViewportTopRef.current =
      document.getElementById("section-photoCapture")?.getBoundingClientRect()
        .top ?? null;

    const uploadPromises = newFiles.map(async (file: File) => {
      try {
        const fileNameLower = file.name.toLowerCase();
        const mimeType = (file.type || "").toLowerCase();
        const isJpeg =
          mimeType === "image/jpeg" ||
          fileNameLower.endsWith(".jpg") ||
          fileNameLower.endsWith(".jpeg");
        const isPng =
          mimeType === "image/png" || fileNameLower.endsWith(".png");
        const isImage = isJpeg || isPng;
        const isPdf =
          mimeType === "application/pdf" || fileNameLower.endsWith(".pdf");

        const dept = currentDepartment || curDept;
        if (dept === "PD") {
          if (!isImage && !isPdf) {
            message.error(
              `${file.name}: Please upload a JPG/PNG image or PDF file only`
            );
            failCount++;
            return;
          }
        } else {
          if (!isImage) {
            message.error(`${file.name}: Please upload a JPG/PNG image file`);
            failCount++;
            return;
          }
        }

        if (file.size > 10 * 1024 * 1024) {
          message.error(`${file.name}: File size should not exceed 10MB`);
          failCount++;
          return;
        }

        const timestamp = new Date().getTime();
        const randomStr = Math.random().toString(36).substring(7);

        let fileExtension = "jpg";
        if (isPdf) {
          fileExtension = "pdf";
        } else if (isPng) {
          fileExtension = "png";
        } else if (isJpeg) {
          fileExtension = "jpg";
        }

        let uploadFile: File = file;
        if (isImage) {
          uploadFile = await compressImage(file);
          fileExtension = "jpg";
        }

        const fileName = `verification/${id}/${timestamp}-${randomStr}.${fileExtension}`;

        const { url: presignedUrl } = await getPresignedUploadUrl(
          fileName,
          uploadFile.type
        );

        const fileBlob = await uploadFile.arrayBuffer();

        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: fileBlob,
          headers: {
            "Content-Type": uploadFile.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Upload failed with status: ${uploadResponse.status}`
          );
        }

        const newItem = {
          id: `${timestamp}-${randomStr}`,
          s3ImageUrl: fileName,
          type: isPdf ? "document" : "photo",
          fileType: isPdf ? "pdf" : "jpg",
          fileName: file.name,
          timestamp: new Date().toISOString(),
          isCamera: false,
          documentType: "Other",
        };

        allNewItems.push(newItem);
        successCount++;
      } catch (error: any) {
        console.error(`Error uploading ${file.name}:`, error);
        message.error(`${file.name}: ${error?.message || "Failed to upload"}`);
        failCount++;
      }
    });

    await Promise.all(uploadPromises);

    if (allNewItems.length > 0) {
      const updatedItems = [...existingItems, ...allNewItems];

      if (role === "VerificationExecutive") {
        setSavedSectionData((prev: any) => ({
          ...prev,
          uploadedItems: updatedItems,
        }));

        if (completeVerificationData?.verificationData) {
          completeVerificationData.verificationData.uploadedItems =
            updatedItems;
        }
      } else {
        const updatedData = {
          verificationData: {
            ...completeVerificationData?.verificationData,
            uploadedItems: updatedItems,
          },
        };
        await verifierEditApi(id as string, "Business", updatedData);
      }
    }

    if (successCount > 0) {
      message.success(`${successCount} file(s) uploaded successfully!`);
      fetchVerificationData();
    }
    if (failCount > 0 && successCount === 0) {
      message.error(`${failCount} file(s) failed to upload`);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const fileNameLower = file.name.toLowerCase();
      const mimeType = (file.type || "").toLowerCase();
      const isJpeg =
        mimeType === "image/jpeg" ||
        fileNameLower.endsWith(".jpg") ||
        fileNameLower.endsWith(".jpeg");
      const isPng = mimeType === "image/png" || fileNameLower.endsWith(".png");
      const isImage = isJpeg || isPng;
      const isPdf =
        mimeType === "application/pdf" || fileNameLower.endsWith(".pdf");

      if (isImage) {
        const existingPhotos = (
          completeVerificationData?.verificationData?.uploadedItems || []
        ).filter((item: any) => item.type === "photo");
        if (existingPhotos.length >= MAX_PHOTO_UPLOADS) {
          message.error(
            `You can only upload up to ${MAX_PHOTO_UPLOADS} photos. Currently ${existingPhotos.length} photo(s) uploaded.`
          );
          return false;
        }
      }

      const dept = currentDepartment || curDept;
      if (dept === "PD") {
        if (!isImage && !isPdf) {
          message.error("Please upload a JPG/PNG image or PDF file only");
          return false;
        }
      } else {
        if (!isImage) {
          message.error("Please upload a JPG/PNG image file");
          return false;
        }
      }

      if (file.size > 10 * 1024 * 1024) {
        message.error("File size should not exceed 10MB");
        return false;
      }

      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(7);

      let fileExtension = "jpg";
      if (isPdf) {
        fileExtension = "pdf";
      } else if (isPng) {
        fileExtension = "png";
      } else if (isJpeg) {
        fileExtension = "jpg";
      }

      let uploadFile: File = file;
      if (isImage) {
        uploadFile = await compressImage(file);
        fileExtension = "jpg";
      }

      const fileName = `verification/${id}/${timestamp}-${randomStr}.${fileExtension}`;

      const { url: presignedUrl } = await getPresignedUploadUrl(
        fileName,
        uploadFile.type
      );

      const fileBlob = await uploadFile.arrayBuffer();

      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: fileBlob,
        headers: {
          "Content-Type": uploadFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      const newItem = {
        id: `${timestamp}-${randomStr}`,
        s3ImageUrl: fileName,
        type: isPdf ? "document" : "photo",
        fileType: isPdf ? "pdf" : "jpg",
        fileName: file.name,
        timestamp: new Date().toISOString(),
        isCamera: false,
        documentType: "Other",
      };

      const existingItems =
        completeVerificationData?.verificationData?.uploadedItems || [];

      const scrollPosition = window.scrollY || window.pageYOffset;
      savedSectionRef.current = "photoCapture";
      savedSectionScrollRef.current = scrollPosition;
      savedSectionViewportTopRef.current =
        document.getElementById("section-photoCapture")?.getBoundingClientRect()
          .top ?? null;

      if (role === "VerificationExecutive") {
        const updatedItems = [...existingItems, newItem];
        setSavedSectionData((prev: any) => ({
          ...prev,
          uploadedItems: updatedItems,
        }));

        if (completeVerificationData?.verificationData) {
          completeVerificationData.verificationData.uploadedItems =
            updatedItems;
        }

        return;
      }

      const updatedData = {
        verificationData: {
          ...completeVerificationData?.verificationData,
          uploadedItems: [...existingItems, newItem],
        },
      };

      await verifierEditApi(id as string, "Business", updatedData);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      throw new Error(error?.message || "Failed to upload file");
    }
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
    savedSectionData,
    setSavedSectionData,
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
    savedSectionData: Record<string, any>;
    setSavedSectionData: (data: any) => void;
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

    // Helper function to convert flat array format (fieldId[index].property) to array format
    const convertFlatArraysToNested = (
      formValues: any,
      sectionSchema: any
    ): any => {
      if (!formValues || typeof formValues !== "object") return formValues;

      const result: any = {};
      const arrayFields: Record<string, any[]> = {};

      // First pass: identify array fields and collect their values
      Object.keys(formValues).forEach((key) => {
        // Check if this is an array field in flat format (e.g., "aboutBusiness[0].detail")
        const arrayMatch = key.match(/^(.+?)\[(\d+)\]\.(.+)$/);
        if (arrayMatch) {
          const fieldId = arrayMatch[1];
          const index = parseInt(arrayMatch[2]);
          const propertyName = arrayMatch[3];

          if (!arrayFields[fieldId]) {
            arrayFields[fieldId] = [];
          }
          if (!arrayFields[fieldId][index]) {
            arrayFields[fieldId][index] = {};
          }
          arrayFields[fieldId][index][propertyName] = formValues[key];
        } else {
          // Regular field, keep as is
          result[key] = formValues[key];
        }
      });

      // Second pass: add converted arrays to result
      Object.keys(arrayFields).forEach((fieldId) => {
        result[fieldId] = arrayFields[fieldId];
      });

      return result;
    };

    // Handle save for a specific section
    const handleSectionSave = async (sectionId: string) => {
      // Store current scroll position and section ID for restoration after save
      const scrollPosition = window.scrollY || window.pageYOffset;
      savedSectionRef.current = sectionId;
      savedSectionScrollRef.current = scrollPosition;
      savedSectionViewportTopRef.current =
        document.getElementById(`section-${sectionId}`)?.getBoundingClientRect()
          .top ?? null;

      // Ensure section stays expanded
      if (!activeSections.includes(sectionId)) {
        setActiveSections([...activeSections, sectionId]);
      }

      try {
        // Get current form values from the form instance for the section being saved
        const formInstance = formInstancesRef.current[sectionId];
        let sectionData: any = {};

        const initialSectionData = formData?.[sectionId] || {};

        if (formInstance) {
          const formValues = formInstance.getFieldsValue();
          const sectionSchema = schema?.sections?.find(
            (s: any) => s.id === sectionId
          );
          sectionData = convertFlatArraysToNested(formValues, sectionSchema);
        }

        const uncommittedData = sectionUncommittedChanges[sectionId] || {};
        sectionData = { ...uncommittedData, ...sectionData };
        Object.keys(initialSectionData).forEach((key) => {
          const initialValue = initialSectionData[key];
          if (
            !Array.isArray(initialValue) &&
            (typeof initialValue === "string" ||
              typeof initialValue === "number" ||
              initialValue === null)
          ) {
            if (sectionData[key] === undefined || sectionData[key] === null) {
              if (
                initialValue !== "" &&
                initialValue !== null &&
                initialValue !== undefined
              ) {
                sectionData[key] = "";
              }
            }
          }
        });

        const sectionSchema = schema?.sections?.find(
          (s: any) => s.id === sectionId
        );

        const getNestedValue = (obj: any, path: string): any => {
          const keys = path.split(".");
          let value = obj;
          for (const key of keys) {
            if (value && typeof value === "object" && key in value) {
              value = value[key];
            } else {
              return undefined;
            }
          }
          return value;
        };

        const isEmptyValue = (value: any): boolean => {
          return (
            value === "" ||
            value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim() === "")
          );
        };

        if (sectionSchema && sectionSchema.fields) {
          const validationErrors: string[] = [];

          sectionSchema.fields.forEach((field: any) => {
            let fieldValue = sectionData[field.id];

            if (fieldValue === undefined && field.id.includes(".")) {
              fieldValue = getNestedValue(sectionData, field.id);
            }

            if (fieldValue === undefined) {
              if (
                sectionData.basicDetails &&
                sectionData.basicDetails[field.id] !== undefined
              ) {
                fieldValue = sectionData.basicDetails[field.id];
              } else if (
                sectionData.businessDetails &&
                sectionData.businessDetails[field.id] !== undefined
              ) {
                fieldValue = sectionData.businessDetails[field.id];
              }
            }

            const isFieldEmpty = isEmptyValue(fieldValue);
            const isRequired = field.required === true;
            const isLoanAmount =
              field.id === "loanAmount" || field.id.endsWith(".loanAmount");

            if (isRequired && !isLoanAmount && isFieldEmpty) {
              const fieldLabel = field.label || field.id || "Field";
              validationErrors.push(
                `${fieldLabel} is mandatory and cannot be empty`
              );
            }
          });

          if (validationErrors.length > 0) {
            message.error(`Cannot save: ${validationErrors.join(", ")}`);

            if (
              formInstance &&
              initialSectionData &&
              Object.keys(initialSectionData).length > 0
            ) {
              formInstance.setFieldsValue(initialSectionData);
            }

            return;
          }
        }

        const hasActualChanges = (() => {
          // If we have form values from the form instance, there might be changes
          // Don't immediately return false if sectionData is empty - check form values first
          const formValues = formInstance?.getFieldsValue() || {};
          const hasFormValues =
            formValues && Object.keys(formValues).length > 0;

          // If sectionData is empty but we have form values, that's a potential change
          if (
            (!sectionData || Object.keys(sectionData).length === 0) &&
            !hasFormValues
          ) {
            return false;
          }

          // Check if any key in sectionData differs from initialSectionData
          const allKeys = Array.from(
            new Set([
              ...Object.keys(sectionData),
              ...Object.keys(initialSectionData),
            ])
          );

          for (const key of allKeys) {
            const currentValue = sectionData[key];
            const initialValue = initialSectionData[key];

            // Deep comparison for arrays and objects
            if (Array.isArray(currentValue) || Array.isArray(initialValue)) {
              const currentArray = Array.isArray(currentValue)
                ? currentValue
                : [];
              const initialArray = Array.isArray(initialValue)
                ? initialValue
                : [];

              // If current array has items but initial doesn't, that's a change
              if (currentArray.length > 0 && initialArray.length === 0) {
                // Check if current array has any non-empty items
                const hasNonEmptyItems = currentArray.some((item: any) => {
                  if (!item || typeof item !== "object") return false;
                  return Object.values(item).some((val: any) => {
                    if (val === null || val === undefined) return false;
                    if (typeof val === "string" && val.trim() !== "")
                      return true;
                    return val !== "";
                  });
                });
                if (hasNonEmptyItems) return true;
              }

              // Check if arrays have different lengths
              if (currentArray.length !== initialArray.length) {
                return true;
              }

              // Check if any item has non-empty values and arrays differ
              const hasNonEmptyItems = currentArray.some((item: any) => {
                if (!item || typeof item !== "object") return false;
                return Object.values(item).some((val: any) => {
                  if (val === null || val === undefined) return false;
                  if (typeof val === "string" && val.trim() !== "") return true;
                  return val !== "";
                });
              });

              if (
                hasNonEmptyItems &&
                JSON.stringify(currentArray) !== JSON.stringify(initialArray)
              ) {
                return true;
              }
            } else if (
              typeof currentValue === "object" &&
              currentValue !== null
            ) {
              if (
                JSON.stringify(currentValue) !==
                JSON.stringify(initialValue || {})
              ) {
                return true;
              }
            } else {
              // For primitive values, normalize empty values for comparison
              const normalizedCurrent =
                currentValue === "" ||
                currentValue === null ||
                currentValue === undefined
                  ? null
                  : currentValue;
              const normalizedInitial =
                initialValue === "" ||
                initialValue === null ||
                initialValue === undefined
                  ? null
                  : initialValue;

              // If normalized values differ, it's a change
              if (normalizedCurrent !== normalizedInitial) {
                if (normalizedCurrent !== null || normalizedInitial !== null) {
                  return true;
                }
              }
            }
          }

          return false;
        })();

        if (!hasActualChanges) {
          message.warning("No changes to save");
          return;
        }

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

          // Also save to IndexedDB for local tracking.
          // PD uses the draftStore helper to stamp baseUpdatedAt; FI
          // keeps the inline IndexedDB write.
          if (currentDepartment === "PD") {
            try {
              await saveDraftSection(
                String(id),
                activeTab,
                sectionId,
                sectionData,
                verificationData?.updatedAt
              );
              setChangedData((prev: any) => ({
                ...prev,
                [sectionId]: sectionData,
              }));
              setSectionUncommittedChanges((prev: any) => {
                const newChanges = { ...prev };
                delete newChanges[sectionId];
                return newChanges;
              });
              setLocalEditLogsUpdated((prev) => prev + 1);
            } catch (err) {
              console.error("PD draft save error:", err);
            }
          } else {
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
          }

          message.success(
            `Section "${schema?.sections?.find((s: any) => s.id === sectionId)?.label}" saved successfully`
          );

          const mergedData = mergedVerificationData as any;
          const completeData = completeVerificationData?.verificationData as any;
          const verifyData = verificationData?.verificationData as any;
          const financialAnalysisData = 
            mergedData?.financialAnalysis ||
            completeData?.financialAnalysis ||
            verifyData?.financialAnalysis ||
            {};
          const combinedData = { ...financialAnalysisData, ...sectionData };
          
          const sectionSchema = schema?.sections?.find((s: any) => s.id === sectionId);
          const sectionLabel = sectionSchema?.label?.toLowerCase() || "";
          const hasStatement4Fields = 
            combinedData.hasOwnProperty("openingStockAudited") ||
            combinedData.hasOwnProperty("openingStockAssessed") ||
            combinedData.hasOwnProperty("salesAudited") ||
            combinedData.hasOwnProperty("grossProfitAssessed");
          
          const isStatement3 = 
            !hasStatement4Fields &&
            (sectionLabel.includes("comprehensive actuals vs estimated") ||
             combinedData.hasOwnProperty("netProfitEstimated") ||
             combinedData.hasOwnProperty("openingStockEstimated") ||
             combinedData.hasOwnProperty("purchasesEstimated"));
          
          const isStatement4 = 
            hasStatement4Fields ||
            sectionLabel.includes("detailed financial analysis with balance sheet") ||
            sectionLabel.includes("statement 4") ||
            sectionLabel.includes("statement4") ||
            (combinedData.hasOwnProperty("grossProfitAssessed") && 
             combinedData.hasOwnProperty("netProfit") &&
             !combinedData.hasOwnProperty("netProfitAfterTax")) ||
            (combinedData.hasOwnProperty("netProfit") && 
             !combinedData.hasOwnProperty("netProfitAfterTax") &&
             !combinedData.hasOwnProperty("netProfitEstimated"));
          
          const isStatement2 = 
            !hasStatement4Fields &&
            !isStatement3 &&
            (sectionLabel.includes("gp/pbdit") ||
             combinedData.hasOwnProperty("netProfitAfterTax") ||
             (combinedData.hasOwnProperty("grossReceipts") &&
              combinedData.hasOwnProperty("otherIncome")));

          let netProfit = null;
          if (isStatement3) {
            netProfit =
              sectionData?.netProfitEstimated ||
              combinedData?.netProfitEstimated ||
              null;
          } else if (isStatement4) {
            netProfit =
              sectionData?.netProfit ||
              combinedData?.netProfit ||
              null;
          } else if (isStatement2) {
            netProfit =
              sectionData?.netProfitAfterTax ||
              combinedData?.netProfitAfterTax ||
              null;
          } else {
            netProfit =
              sectionData?.netProfitEstimated ||
              sectionData?.netProfitAfterTax ||
              sectionData?.netProfit ||
              combinedData?.netProfitEstimated ||
              combinedData?.netProfitAfterTax ||
              combinedData?.netProfit ||
              null;
          }

          const netProfitNum =
            netProfit !== null && netProfit !== undefined
              ? typeof netProfit === "string"
                ? parseFloat(String(netProfit).replace(/,/g, ""))
                : Number(netProfit)
              : null;

          const isStatement4ByNetProfit = 
            !isStatement2 &&
            !isStatement3 &&
            sectionId === "financialAnalysis" &&
            combinedData.hasOwnProperty("netProfit") &&
            !combinedData.hasOwnProperty("netProfitAfterTax") &&
            !combinedData.hasOwnProperty("netProfitEstimated");

          if (
            sectionId === "financialAnalysis" &&
            netProfitNum !== null && 
            netProfitNum > 1000000 &&
            (isStatement2 || isStatement3 || isStatement4 || isStatement4ByNetProfit)
          ) {
            await fetchVerificationData?.();           
            window.location.reload();
            return;
          }

          await fetchVerificationData?.();
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

          // Check arrays - empty array is a valid change (means array was cleared)
          if (Array.isArray(value)) {
            // Empty array is a change (user removed all items)
            if (value.length === 0) return true;
            // Check if any item in the array has at least one non-empty field
            return value.some((item: any) => {
              if (!item || typeof item !== "object") return false;
              return Object.values(item).some((fieldValue: any) => {
                if (fieldValue === null || fieldValue === undefined)
                  return false;
                if (typeof fieldValue === "string" && fieldValue.trim() === "")
                  return false;
                return true;
              });
            });
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
          <span style={{ fontWeight: "bold" }}>{sectionLabel}</span>
          {(role === "Verifier" ||
            role === "Admin" ||
            role === "VerificationExecutive") &&
            activeSections.includes(sectionId) &&
            hasChanges && (
              <Button
                type="primary"
                size="middle"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent collapse toggle
                  onSave();
                }}
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  height: "30px",
                  padding: "0 16px",
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
              <div id={`section-${section.id}`}>
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
                      ...(savedSectionData[section.id] || {}), // Include saved section data (for VerificationExecutive)
                      ...(sectionUncommittedChanges[section.id] || {}),
                    }),
                    [
                      dynamicFormData[section.id],
                      formData[section.id],
                      changedData[section.id], // Add changedData to dependencies
                      savedSectionData[section.id], // Add savedSectionData to dependencies
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
              </div>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    );
  };

  const evaluateFormula = (
    formula: string,
    formValues: Record<string, any>
  ): number | null => {
    if (!formula || typeof formula !== "string") return null;

    try {
      const fieldNameMatches = formula.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g);
      const fieldNamesInFormula = fieldNameMatches || [];

      const jsKeywords = [
        "true",
        "false",
        "null",
        "undefined",
        "NaN",
        "Infinity",
        "if",
        "else",
        "return",
      ];
      const validFieldNames = fieldNamesInFormula.filter(
        (name) => !jsKeywords.includes(name)
      );

      let evaluatedFormula = formula;
      for (const fieldName of validFieldNames) {
        const regex = new RegExp(`\\b${fieldName}\\b`, "g");
        const value = formValues[fieldName];

        let numValue = 0;
        if (value !== undefined && value !== null && value !== "") {
          const parsed =
            typeof value === "number" ? value : parseFloat(String(value));
          if (!isNaN(parsed)) {
            numValue = parsed;
          }
        }

        evaluatedFormula = evaluatedFormula.replace(regex, String(numValue));
      }

      const result = Function(
        '"use strict"; return (' + evaluatedFormula + ")"
      )();
      return typeof result === "number" && !isNaN(result) ? result : null;
    } catch (error) {
      console.debug(
        "Formula evaluation error:",
        error,
        "Formula:",
        formula,
        "Values:",
        formValues
      );
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

    const calculateFormulasInArrayItemForEffect = (
      arrayField: any,
      arrayIndex: number,
      formValues: any,
      prefix: string = ""
    ): Record<string, any> => {
      const calculatedFields: Record<string, any> = {};
      const itemFields = arrayField.arrayItemFields || [];

      const itemValues: Record<string, any> = {};
      itemFields.forEach((itemField: any) => {
        const flatKey = prefix
          ? `${prefix}[${arrayIndex}].${itemField.id}`
          : `${arrayField.id}[${arrayIndex}].${itemField.id}`;
        const value = formValues[flatKey];
        if (value !== undefined && value !== null && value !== "") {
          itemValues[itemField.id] =
            typeof value === "number" ? value : parseFloat(String(value)) || 0;
        } else {
          itemValues[itemField.id] = 0;
        }
      });

      const workingItemValues = { ...itemValues };
      const formulaItemFields = itemFields.filter(
        (field: any) => field.formula
      );
      const maxPasses = 10;
      let pass = 0;
      let hasNewCalculations = true;

      while (hasNewCalculations && pass < maxPasses) {
        hasNewCalculations = false;
        pass++;

        formulaItemFields.forEach((itemField: any) => {
          const calculatedValue = evaluateFormula(
            itemField.formula,
            workingItemValues
          );
          if (calculatedValue !== null) {
            const currentValue = workingItemValues[itemField.id];
            const currentNum =
              typeof currentValue === "number"
                ? currentValue
                : parseFloat(String(currentValue || 0));
            const newNum = calculatedValue;

            if (isNaN(currentNum) || Math.abs(currentNum - newNum) > 0.0001) {
              const flatKey = prefix
                ? `${prefix}[${arrayIndex}].${itemField.id}`
                : `${arrayField.id}[${arrayIndex}].${itemField.id}`;
              calculatedFields[flatKey] = calculatedValue;
              workingItemValues[itemField.id] = calculatedValue;
              hasNewCalculations = true;
            }
          }
        });
      }

      itemFields.forEach((itemField: any) => {
        if (itemField.type === "array" && itemField.arrayItemFields) {
          const nestedArrayValue =
            formValues[
              prefix
                ? `${prefix}[${arrayIndex}].${itemField.id}`
                : `${arrayField.id}[${arrayIndex}].${itemField.id}`
            ];
          if (Array.isArray(nestedArrayValue)) {
            nestedArrayValue.forEach((_, nestedIndex: number) => {
              const nestedPrefix = prefix
                ? `${prefix}[${arrayIndex}].${itemField.id}`
                : `${arrayField.id}[${arrayIndex}].${itemField.id}`;
              const nestedCalculated = calculateFormulasInArrayItemForEffect(
                itemField,
                nestedIndex,
                formValues,
                nestedPrefix
              );
              Object.assign(calculatedFields, nestedCalculated);
            });
          }
        }
      });

      return calculatedFields;
    };

    // Calculate formula fields whenever form values change
    React.useEffect(() => {
      if (!isActive || !formValues) return; // Only calculate when section is active

      const calculatedFields: Record<string, any> = {};

      const calculateFormulasInObject = (
        objectField: any,
        objectValues: Record<string, any>
      ): Record<string, any> => {
        const calculatedFields: Record<string, any> = {};
        const objectFields = objectField.objectFields || [];

        const workingValues: Record<string, any> = { ...objectValues };
        const formulaFields = objectFields.filter(
          (field: any) => field.formula
        );
        const maxPasses = 10;
        let pass = 0;
        let hasNewCalculations = true;

        while (hasNewCalculations && pass < maxPasses) {
          hasNewCalculations = false;
          pass++;

          formulaFields.forEach((field: any) => {
            const calculatedValue = evaluateFormula(
              field.formula,
              workingValues
            );
            if (calculatedValue !== null) {
              const currentValue = workingValues[field.id];
              const currentNum =
                typeof currentValue === "number"
                  ? currentValue
                  : parseFloat(String(currentValue || 0));
              const newNum = calculatedValue;

              if (isNaN(currentNum) || Math.abs(currentNum - newNum) > 0.0001) {
                calculatedFields[field.id] = calculatedValue;
                workingValues[field.id] = calculatedValue;
                hasNewCalculations = true;
              }
            }
          });
        }

        return calculatedFields;
      };

      // Find all fields with formulas and calculate them
      section.fields?.forEach((field: any) => {
        if (field.formula) {
          const calculatedValue = evaluateFormula(field.formula, formValues);
          if (calculatedValue !== null) {
            calculatedFields[field.id] = calculatedValue;
          }
        }

        if (field.type === "object" && field.objectFields) {
          const objectValue = formValues[field.id];
          if (
            objectValue &&
            typeof objectValue === "object" &&
            !Array.isArray(objectValue)
          ) {
            const objectCalculated = calculateFormulasInObject(
              field,
              objectValue
            );
            if (Object.keys(objectCalculated).length > 0) {
              calculatedFields[field.id] = {
                ...objectValue,
                ...objectCalculated,
              };
            }
          }
        }

        if (field.type === "array" && field.arrayItemFields) {
          const arrayValue = formValues[field.id];
          if (Array.isArray(arrayValue)) {
            arrayValue.forEach((_, index: number) => {
              const arrayCalculated = calculateFormulasInArrayItemForEffect(
                field,
                index,
                formValues
              );
              Object.assign(calculatedFields, arrayCalculated);
            });
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
    const calculateFormulasInArrayItem = (
      arrayField: any,
      arrayIndex: number,
      allValues: any,
      prefix: string = ""
    ): Record<string, any> => {
      const calculatedFields: Record<string, any> = {};
      const itemFields = arrayField.arrayItemFields || [];

      const itemValues: Record<string, any> = {};
      itemFields.forEach((itemField: any) => {
        const flatKey = prefix
          ? `${prefix}[${arrayIndex}].${itemField.id}`
          : `${arrayField.id}[${arrayIndex}].${itemField.id}`;
        const value = allValues[flatKey];
        if (value !== undefined && value !== null && value !== "") {
          itemValues[itemField.id] =
            typeof value === "number" ? value : parseFloat(String(value)) || 0;
        } else {
          itemValues[itemField.id] = 0;
        }
      });

      const workingItemValues = { ...itemValues };
      const formulaItemFields = itemFields.filter(
        (field: any) => field.formula
      );
      const maxPasses = 10;
      let pass = 0;
      let hasNewCalculations = true;

      while (hasNewCalculations && pass < maxPasses) {
        hasNewCalculations = false;
        pass++;

        formulaItemFields.forEach((itemField: any) => {
          const calculatedValue = evaluateFormula(
            itemField.formula,
            workingItemValues
          );
          if (calculatedValue !== null) {
            const currentValue = workingItemValues[itemField.id];
            const currentNum =
              typeof currentValue === "number"
                ? currentValue
                : parseFloat(String(currentValue || 0));
            const newNum = calculatedValue;

            if (isNaN(currentNum) || Math.abs(currentNum - newNum) > 0.0001) {
              const flatKey = prefix
                ? `${prefix}[${arrayIndex}].${itemField.id}`
                : `${arrayField.id}[${arrayIndex}].${itemField.id}`;
              calculatedFields[flatKey] = calculatedValue;
              workingItemValues[itemField.id] = calculatedValue;
              hasNewCalculations = true;
            }
          }
        });
      }

      itemFields.forEach((itemField: any) => {
        if (itemField.type === "array" && itemField.arrayItemFields) {
          const nestedArrayValue =
            allValues[
              prefix
                ? `${prefix}[${arrayIndex}].${itemField.id}`
                : `${arrayField.id}[${arrayIndex}].${itemField.id}`
            ];
          if (Array.isArray(nestedArrayValue)) {
            nestedArrayValue.forEach((_, nestedIndex: number) => {
              const nestedPrefix = prefix
                ? `${prefix}[${arrayIndex}].${itemField.id}`
                : `${arrayField.id}[${arrayIndex}].${itemField.id}`;
              const nestedCalculated = calculateFormulasInArrayItem(
                itemField,
                nestedIndex,
                allValues,
                nestedPrefix
              );
              Object.assign(calculatedFields, nestedCalculated);
            });
          }
        }
      });

      return calculatedFields;
    };

    const handleFormChange = useCallback(
      (changedValues: any, allValues: any) => {
        const workingValues = { ...allValues };

        const calculatedFields: Record<string, any> = {};
        const formulaFields =
          section.fields?.filter((field: any) => field.formula) || [];
        const maxPasses = 10;
        let pass = 0;
        let hasNewCalculations = true;

        while (hasNewCalculations && pass < maxPasses) {
          hasNewCalculations = false;
          pass++;

          formulaFields.forEach((field: any) => {
            const calculatedValue = evaluateFormula(
              field.formula,
              workingValues
            );
            if (calculatedValue !== null) {
              const currentValue = workingValues[field.id];
              const currentNum =
                typeof currentValue === "number"
                  ? currentValue
                  : parseFloat(String(currentValue || 0));
              const newNum = calculatedValue;

              if (isNaN(currentNum) || Math.abs(currentNum - newNum) > 0.0001) {
                calculatedFields[field.id] = calculatedValue;
                workingValues[field.id] = calculatedValue;
                hasNewCalculations = true;
              }
            }
          });
        }

        const calculateFormulasInObjectForChange = (
          objectField: any,
          objectValues: Record<string, any>
        ): Record<string, any> => {
          const calculated: Record<string, any> = {};
          const objectFields = objectField.objectFields || [];

          const workingObjectValues: Record<string, any> = { ...objectValues };
          const formulaFields = objectFields.filter(
            (field: any) => field.formula
          );
          const maxPasses = 10;
          let pass = 0;
          let hasNewCalculations = true;

          while (hasNewCalculations && pass < maxPasses) {
            hasNewCalculations = false;
            pass++;

            formulaFields.forEach((field: any) => {
              const calculatedValue = evaluateFormula(
                field.formula,
                workingObjectValues
              );
              if (calculatedValue !== null) {
                const currentValue = workingObjectValues[field.id];
                const currentNum =
                  typeof currentValue === "number"
                    ? currentValue
                    : parseFloat(String(currentValue || 0));
                const newNum = calculatedValue;

                if (
                  isNaN(currentNum) ||
                  Math.abs(currentNum - newNum) > 0.0001
                ) {
                  calculated[field.id] = calculatedValue;
                  workingObjectValues[field.id] = calculatedValue;
                  hasNewCalculations = true;
                }
              }
            });
          }

          return calculated;
        };

        section.fields?.forEach((field: any) => {
          if (field.type === "object" && field.objectFields) {
            const objectValue = allValues[field.id];
            if (
              objectValue &&
              typeof objectValue === "object" &&
              !Array.isArray(objectValue)
            ) {
              const objectCalculated = calculateFormulasInObjectForChange(
                field,
                objectValue
              );
              if (Object.keys(objectCalculated).length > 0) {
                calculatedFields[field.id] = {
                  ...objectValue,
                  ...objectCalculated,
                };
              }
            }
          }

          if (field.type === "array" && field.arrayItemFields) {
            const arrayValue = allValues[field.id];
            if (Array.isArray(arrayValue)) {
              arrayValue.forEach((_, index: number) => {
                const arrayCalculated = calculateFormulasInArrayItem(
                  field,
                  index,
                  allValues
                );
                Object.assign(calculatedFields, arrayCalculated);
              });
            }
          }
        });

        if (Object.keys(calculatedFields).length > 0) {
          form.setFieldsValue(calculatedFields);
          Object.assign(allValues, calculatedFields);
        }

        setSectionUncommittedChanges((prev: any) => ({
          ...prev,
          [section.id]: allValues,
        }));
      },
      [section.id, section.fields, form, setSectionUncommittedChanges]
    );

    // Helper functions for financial analysis field grouping
    const isFinancialAnalysisSection = () => {
      // Exclude detailed financial analysis as it has its own special rendering
      if (section.id === "financialAnalysisDetailed") {
        return false;
      }
      return (
        section.id === "financialAnalysis" ||
        section.id === "financialAnalysisComprehensive" ||
        section.label?.toLowerCase().includes("financial") ||
        section.label?.toLowerCase().includes("comprehensive actuals")
      );
    };

    // Calculate total gross profit and total net profit based on financial analysis type
    // Note: formValues is already declared above for formula calculations
    const calculateFinancialTotals = useMemo(() => {
      const sectionLabel = section.label?.toLowerCase() || "";

      // Check if this is a financial analysis section (including Type 4 which is excluded from grouping)
      const isFinancialSection =
        section.id === "financialAnalysis" ||
        section.id === "financialAnalysisComprehensive" ||
        section.id === "financialAnalysisDetailed" ||
        sectionLabel.includes("financial");

      if (!isFinancialSection) {
        return { totalGrossProfit: 0, totalNetProfit: 0 };
      }
      // Get current form values (formValues is declared above for formula calculations)
      const currentFormValues = formValues || form.getFieldsValue();
      const allData = { ...data, ...changedData[section.id] };
      const mergedData = { ...allData, ...currentFormValues };

      const parseNum = (value: any): number => {
        if (value === null || value === undefined || value === "") return 0;
        const num = parseFloat(String(value));
        return isNaN(num) ? 0 : num;
      };

      let totalGrossProfit = 0;
      let totalNetProfit = 0;
      let grossProfitAssessedValue: number | null = null;
      let netProfitAssessedValue: number | null = null;
      let grossProfitEstimatedValue: number | null = null;
      let netProfitEstimatedValue: number | null = null;
      let grossProfitFallbackValue: number | null = null;
      let netProfitFallbackValue: number | null = null;

      const hasStatement4Fields = 
        mergedData.hasOwnProperty("openingStockAudited") ||
        mergedData.hasOwnProperty("openingStockAssessed") ||
        mergedData.hasOwnProperty("salesAudited") ||
        mergedData.hasOwnProperty("grossProfitAssessed");
      
      const isStatement3 = 
        !hasStatement4Fields &&
        (section.id === "financialAnalysisComprehensive" ||
         section.id === "financialAnalysis" && section.label?.toLowerCase().includes("comprehensive actuals vs estimated") ||
         mergedData.hasOwnProperty("netProfitEstimated") ||
         mergedData.hasOwnProperty("openingStockEstimated"));

      const hasGenericFields = mergedData.hasOwnProperty("grossProfitDebit");
      
      const isStatement4 = 
        hasStatement4Fields ||
        section.label?.toLowerCase().includes("detailed financial analysis with balance sheet") ||
        section.label?.toLowerCase().includes("statement 4") ||
        section.label?.toLowerCase().includes("statement4") ||
        (mergedData.hasOwnProperty("netProfit") && 
         !mergedData.hasOwnProperty("netProfitAfterTax") &&
         !mergedData.hasOwnProperty("netProfitEstimated") &&
         !hasGenericFields); // Exclude generic schema from statement4

      if (section.fields && Array.isArray(section.fields)) {
        section.fields.forEach((field: any) => {
          const fieldId = field.id;
          const fieldValue = mergedData[fieldId];
          const fieldLabel = (field.label || field.title || "").toLowerCase();
          const fieldIdLower = fieldId.toLowerCase();

          if (field.formula) {
            const calculatedValue = evaluateFormula(field.formula, mergedData);
            if (calculatedValue !== null) {
              mergedData[fieldId] = calculatedValue;
            }
          }
        });

        section.fields.forEach((field: any) => {
          const fieldId = field.id;
          const fieldValue = mergedData[fieldId];
          const fieldLabel = (field.label || field.title || "").toLowerCase();
          const fieldIdLower = fieldId.toLowerCase();

          if (
            fieldLabel.includes("gross profit") ||
            fieldId.toLowerCase().includes("grossprofit")
          ) {
            const value = parseNum(fieldValue || mergedData[fieldId]);
            const isAssessed =
              fieldIdLower.includes("assessed") ||
              fieldLabel.includes("assessed");
            const isAudited =
              fieldIdLower.includes("audited") ||
              fieldLabel.includes("audited");
            const isEstimated =
              fieldIdLower.includes("estimated") ||
              fieldLabel.includes("estimated");

            // For statement-3, ONLY use Estimated fields, ignore all others
            if (isStatement3) {
              if (isEstimated || fieldIdLower === "grossprofitestimated" || fieldId === "grossProfitEstimated") {
                grossProfitEstimatedValue = value;
              }
            } else {
              if (value !== 0) {
                if (isAssessed && !isAudited && !isEstimated) {
                  grossProfitAssessedValue = value;
                } else if (
                  !isAudited &&
                  !isEstimated &&
                  grossProfitAssessedValue === null &&
                  grossProfitEstimatedValue === null
                ) {
                  if (grossProfitFallbackValue === null) {
                    grossProfitFallbackValue = value;
                  }
                }
              }
            }
          }

          if (
            (fieldLabel.includes("net profit") &&
              !fieldLabel.includes("before") &&
              !fieldLabel.includes("after tax")) ||
            (fieldId.toLowerCase().includes("netprofit") &&
              !fieldId.toLowerCase().includes("before") &&
              !fieldId.toLowerCase().includes("aftertax"))
          ) {
            const value = parseNum(fieldValue || mergedData[fieldId]);
            const isAssessed =
              fieldIdLower.includes("assessed") ||
              fieldLabel.includes("assessed");
            const isAudited =
              fieldIdLower.includes("audited") ||
              fieldLabel.includes("audited");
            const isEstimated =
              fieldIdLower.includes("estimated") ||
              fieldLabel.includes("estimated");

            // For statement-3, ONLY use Estimated fields, ignore all others
            if (isStatement3) {

              if (isEstimated || fieldIdLower === "netprofitestimated" || fieldId === "netProfitEstimated") {
                netProfitEstimatedValue = value;
              }
            } else {
              if (value !== 0) {
                if (isAssessed && !isAudited && !isEstimated) {
                  netProfitAssessedValue = value;
                } else if (
                  !isAudited &&
                  !isEstimated &&
                  netProfitAssessedValue === null &&
                  netProfitEstimatedValue === null
                ) {
                  if (netProfitFallbackValue === null) {
                    netProfitFallbackValue = value;
                  }
                }
              }
            }
          }

          if (
            fieldLabel.includes("net profit after tax") ||
            fieldId.toLowerCase().includes("netprofitaftertax")
          ) {
            const value = parseNum(fieldValue || mergedData[fieldId]);
            if (
              value !== 0 &&
              netProfitAssessedValue === null &&
              netProfitEstimatedValue === null &&
              netProfitFallbackValue === null
            ) {
              netProfitFallbackValue = value;
            }
          }
        });

        if (isStatement3) {
          const grossProfitField = mergedData["grossProfitEstimated"];
          const netProfitField = mergedData["netProfitEstimated"];
          if (grossProfitField !== null && grossProfitField !== undefined && grossProfitField !== "") {
            totalGrossProfit = parseNum(grossProfitField);
          } else {
            totalGrossProfit = grossProfitEstimatedValue !== null ? grossProfitEstimatedValue : 0;
          }
          
          if (netProfitField !== null && netProfitField !== undefined && netProfitField !== "") {
            totalNetProfit = parseNum(netProfitField);
          } else {
            totalNetProfit = netProfitEstimatedValue !== null ? netProfitEstimatedValue : 0;
          }
        } else if (isStatement4) {
          const grossProfitAssessedField = mergedData["grossProfitAssessed"];
          const netProfitField = mergedData["netProfit"];
          
          if (grossProfitAssessedField !== null && grossProfitAssessedField !== undefined && grossProfitAssessedField !== "") {
            totalGrossProfit = parseNum(grossProfitAssessedField);
          } else {
            totalGrossProfit = grossProfitAssessedValue !== null ? grossProfitAssessedValue : 0;
          }
          
          if (netProfitField !== null && netProfitField !== undefined && netProfitField !== "") {
            totalNetProfit = parseNum(netProfitField);
          } else {
            totalNetProfit = netProfitAssessedValue !== null ? netProfitAssessedValue : 0;
          }
        } else {
          let grossProfitValue = null;
          if (mergedData.hasOwnProperty("grossProfitDebit")) {
            const rawValue = mergedData["grossProfitDebit"];
            if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
              grossProfitValue = parseNum(rawValue);
            }
          }
          
          if (grossProfitValue === null && formValues && formValues.hasOwnProperty("grossProfitDebit")) {
            const rawValue = formValues["grossProfitDebit"];
            if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
              grossProfitValue = parseNum(rawValue);
            }
          }
          
          totalGrossProfit = grossProfitValue !== null 
            ? grossProfitValue 
            : (grossProfitAssessedValue !== null
                ? grossProfitAssessedValue
                : grossProfitFallbackValue || 0);
          
          let netProfitValue = null;
          
          if (mergedData.hasOwnProperty("netProfit")) {
            const rawValue = mergedData["netProfit"];
            if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
              netProfitValue = parseNum(rawValue);
            }
          }
          
          if (netProfitValue === null && formValues && formValues.hasOwnProperty("netProfit")) {
            const rawValue = formValues["netProfit"];
            if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
              netProfitValue = parseNum(rawValue);
            }
          }
          
          totalNetProfit = netProfitValue !== null
            ? netProfitValue
            : (netProfitAssessedValue !== null
                ? netProfitAssessedValue
                : netProfitFallbackValue || 0);
        }
      }

      return { totalGrossProfit, totalNetProfit };
    }, [
      data,
      changedData,
      section.id,
      section.label,
      section.fields,
      form,
      formValues,
    ]);

    // Use side attribute that is set by the schema conversion service
    // This is determined from the credit/debit arrays in the schema
    const getFieldSide = (field: any): "debit" | "credit" | null => {
      return field.side || null;
    };

    const getFieldVariant = (field: any): "estimated" | "actuals" | null => {
      // Use the variant attribute set by schema service
      return field.variant || null;
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

      const isFormulaField = !!field.formula;
      const isCoordField = isCoordinateField(fieldId);
      const fieldReadOnly = readOnly || isFormulaField || isCoordField;

      const readonlyFieldStyle = fieldReadOnly
        ? { color: "#262626" }
        : undefined;
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
              onArrayTotalsChange={(totals) => {
                if (section.id === "existingLoanDetails" && (fieldId === "loans" || fieldId === "loanDetails")) {
                  form.setFieldsValue({
                    totalLoanAmount: totals.totalLoanAmount,
                    totalEmi: totals.totalEmi,
                  });
                }
              }}
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
              style={readonlyFieldStyle}
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
              <Radio.Group disabled={fieldReadOnly} style={readonlyFieldStyle}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          );

        case "time":
          // Handle time field (schema service converts format: "time" to type: "time")
          return (
            <Form.Item
              key={fieldId}
              name={fieldId}
              label={showLabel ? field.label : undefined}
              getValueProps={(value) => {
                // Convert HH:mm AM/PM or HH:mm to dayjs object
                if (!value) return { value: undefined };
                if (dayjs.isDayjs(value)) return { value };
                // Handle HH:mm AM/PM format
                const timeStr = String(value).trim();
                // Try parsing with AM/PM
                const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
                const match = timeStr.match(timeRegex);
                if (match) {
                  let hours = parseInt(match[1], 10);
                  const minutes = parseInt(match[2], 10);
                  const period = match[3].toUpperCase();
                  if (period === "PM" && hours !== 12) {
                    hours += 12;
                  } else if (period === "AM" && hours === 12) {
                    hours = 0;
                  }
                  return {
                    value: dayjs().hour(hours).minute(minutes).second(0),
                  };
                }
                // Try parsing HH:mm format
                const hhmmMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
                if (hhmmMatch) {
                  const hours = parseInt(hhmmMatch[1], 10);
                  const minutes = parseInt(hhmmMatch[2], 10);
                  return {
                    value: dayjs().hour(hours).minute(minutes).second(0),
                  };
                }
                return { value: undefined };
              }}
              getValueFromEvent={(time) => {
                // Convert dayjs object to HH:mm AM/PM format when saving
                if (!time) return undefined;
                return time.format("hh:mm A");
              }}
            >
              <TimePicker
                disabled={fieldReadOnly}
                placeholder={`Select ${field.label}`}
                format="hh:mm A"
                style={
                  fieldReadOnly
                    ? { width: "100%", ...readonlyFieldStyle }
                    : { width: "100%" }
                }
                suffixIcon={<ClockCircleOutlined />}
              />
            </Form.Item>
          );

        case "text":
        case "string":
          // PURE SCHEMA-BASED: Match mobile logic exactly
          // Mobile checks: property.format === 'date' || 'time' || 'date-time' || 'datetime'

          // Check format property for time field (fallback for fields that weren't converted)
          if (field.format === "time") {
            return (
              <Form.Item
                key={fieldId}
                name={fieldId}
                label={showLabel ? field.label : undefined}
                getValueProps={(value) => {
                  // Convert HH:mm AM/PM or HH:mm to dayjs object
                  if (!value) return { value: undefined };
                  if (dayjs.isDayjs(value)) return { value };
                  // Handle HH:mm AM/PM format
                  const timeStr = String(value).trim();
                  // Try parsing with AM/PM
                  const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
                  const match = timeStr.match(timeRegex);
                  if (match) {
                    let hours = parseInt(match[1], 10);
                    const minutes = parseInt(match[2], 10);
                    const period = match[3].toUpperCase();
                    if (period === "PM" && hours !== 12) {
                      hours += 12;
                    } else if (period === "AM" && hours === 12) {
                      hours = 0;
                    }
                    return {
                      value: dayjs().hour(hours).minute(minutes).second(0),
                    };
                  }
                  // Try parsing HH:mm format
                  const hhmmMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
                  if (hhmmMatch) {
                    const hours = parseInt(hhmmMatch[1], 10);
                    const minutes = parseInt(hhmmMatch[2], 10);
                    return {
                      value: dayjs().hour(hours).minute(minutes).second(0),
                    };
                  }
                  return { value: undefined };
                }}
                getValueFromEvent={(time) => {
                  // Convert dayjs object to HH:mm AM/PM format when saving
                  if (!time) return undefined;
                  return time.format("hh:mm A");
                }}
              >
                <TimePicker
                  disabled={fieldReadOnly}
                  placeholder={`Select ${field.label}`}
                  format="hh:mm A"
                  style={{ width: "100%" }}
                  suffixIcon={<ClockCircleOutlined />}
                />
              </Form.Item>
            );
          }

          // Check format property for datetime field (date-time or datetime)
          if (field.format === "date-time" || field.format === "datetime") {
            return (
              <Form.Item
                key={fieldId}
                name={fieldId}
                label={showLabel ? field.label : undefined}
                getValueProps={(value) => {
                  // Convert DD-MM-YYYY HH:mm A or DD/MM/YYYY HH:mm A to dayjs object
                  if (!value) return { value: undefined };
                  if (dayjs.isDayjs(value)) return { value };
                  // Handle DD-MM-YYYY HH:mm A or DD/MM/YYYY HH:mm A format
                  const dateTimeStr = String(value).trim();
                  // Try parsing with time
                  const parsed = dayjs(
                    dateTimeStr,
                    [
                      "DD-MM-YYYY HH:mm A",
                      "DD/MM/YYYY HH:mm A",
                      "DD-MM-YYYY hh:mm A",
                      "DD/MM/YYYY hh:mm A",
                      "YYYY-MM-DD HH:mm",
                      "YYYY-MM-DD HH:mm:ss",
                    ],
                    true
                  );
                  if (parsed.isValid()) {
                    return { value: parsed };
                  }
                  // Fallback: try date only
                  const parts = dateTimeStr.split(/[-\/]/);
                  if (parts.length === 3) {
                    const [day, month, year] = parts;
                    return {
                      value: dayjs(
                        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
                      ),
                    };
                  }
                  return { value: undefined };
                }}
                getValueFromEvent={(date) => {
                  // Convert dayjs object to DD/MM/YYYY HH:mm A format when saving
                  if (!date) return undefined;
                  return date.format("DD/MM/YYYY HH:mm A");
                }}
              >
                <DatePicker
                  disabled={fieldReadOnly}
                  placeholder={`Select ${field.label}`}
                  format="DD/MM/YYYY HH:mm A"
                  showTime={{ format: "HH:mm A" }}
                  style={
                    fieldReadOnly
                      ? { width: "100%", ...readonlyFieldStyle }
                      : { width: "100%" }
                  }
                />
              </Form.Item>
            );
          }

          // Check format property for date field (date only)
          if (field.format === "date") {
            return (
              <Form.Item
                key={fieldId}
                name={fieldId}
                label={showLabel ? field.label : undefined}
                getValueProps={(value) => {
                  // Convert DD-MM-YYYY or DD/MM/YYYY to dayjs object
                  if (!value) return { value: undefined };
                  if (dayjs.isDayjs(value)) return { value };
                  // Handle DD-MM-YYYY or DD/MM/YYYY format
                  const dateStr = String(value).trim();
                  const parts = dateStr.split(/[-\/]/);
                  if (parts.length === 3) {
                    const [day, month, year] = parts;
                    return {
                      value: dayjs(
                        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
                      ),
                    };
                  }
                  // Try parsing as-is
                  const parsed = dayjs(value);
                  return { value: parsed.isValid() ? parsed : undefined };
                }}
                getValueFromEvent={(date) => {
                  // Convert dayjs object to DD/MM/YYYY format when saving
                  if (!date) return undefined;
                  return date.format("DD/MM/YYYY");
                }}
              >
                <DatePicker
                  disabled={fieldReadOnly}
                  placeholder={`Select ${field.label}`}
                  format="DD/MM/YYYY"
                  style={
                    fieldReadOnly
                      ? { width: "100%", ...readonlyFieldStyle }
                      : { width: "100%" }
                  }
                />
              </Form.Item>
            );
          }

          // Check ui.widget for textarea (schema-defined widget type)
          if (
            field.ui?.widget === "textarea" ||
            field.ui?.widget === "richtext"
          ) {
            const minRows = field.ui?.rows || 2;
            return (
              <Form.Item
                key={fieldId}
                name={fieldId}
                label={showLabel ? field.label : undefined}
              >
                <TextArea
                  disabled={fieldReadOnly}
                  placeholder={field.placeholder || field.label}
                  autoSize={{ minRows: minRows }}
                  style={readonlyFieldStyle}
                />
              </Form.Item>
            );
          }

          // Default: Use TextArea with autoSize (so it can grow, but starts as single line)
          return (
            <Form.Item
              key={fieldId}
              name={fieldId}
              label={showLabel ? field.label : undefined}
            >
              <TextArea
                disabled={fieldReadOnly}
                placeholder={field.placeholder || field.label}
                autoSize={{ minRows: 1 }}
                style={readonlyFieldStyle}
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
                style={
                  fieldReadOnly
                    ? { width: "100%", ...readonlyFieldStyle }
                    : { width: "100%" }
                }
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
              getValueProps={(value) => {
                // Convert DD-MM-YYYY or DD/MM/YYYY to dayjs object
                if (!value) return { value: undefined };
                if (dayjs.isDayjs(value)) return { value };
                // Handle DD-MM-YYYY or DD/MM/YYYY format
                const dateStr = String(value).trim();
                const parts = dateStr.split(/[-\/]/);
                if (parts.length === 3) {
                  const [day, month, year] = parts;
                  return {
                    value: dayjs(
                      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
                    ),
                  };
                }
                // Try parsing as-is
                const parsed = dayjs(value);
                return { value: parsed.isValid() ? parsed : undefined };
              }}
              getValueFromEvent={(date) => {
                // Convert dayjs object to DD/MM/YYYY format when saving
                if (!date) return undefined;
                return date.format("DD/MM/YYYY");
              }}
            >
              <DatePicker
                disabled={fieldReadOnly}
                placeholder={`Select ${field.label}`}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
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
                style={readonlyFieldStyle}
              >
                {field.options?.map((option: string) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          );

        case "object":
          // Handle nested object fields (e.g., repaymentFrom with repaymentBankName, typeSAAccount, accountNo)
          if (field.objectFields && field.objectFields.length > 0) {
            return (
              <div key={fieldId} style={{ marginBottom: 16 }}>
                {showLabel && (
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>
                      {field.label}
                      {isRequired ? " *" : ""}
                    </Text>
                  </div>
                )}
                <Card size="small" style={{ backgroundColor: "#fafafa" }}>
                  <Row gutter={[16, 16]}>
                    {field.objectFields.map((objectField: any) => {
                      const isNestedCoordField = isCoordinateField(
                        objectField.id
                      );
                      const objectFieldReadOnly =
                        readOnly ||
                        objectField.readOnly ||
                        isNestedCoordField ||
                        false;
                      const objectFieldRequired = objectField.required || false;

                      const readonlyNestedFieldStyle = objectFieldReadOnly
                        ? { color: "#262626" }
                        : undefined;
                      const renderNestedField = () => {
                        switch (objectField.type) {
                          case "text":
                          case "string":
                            return (
                              <Input
                                disabled={objectFieldReadOnly}
                                placeholder={
                                  objectField.placeholder || objectField.label
                                }
                                maxLength={objectField.maxLength}
                                style={readonlyNestedFieldStyle}
                              />
                            );

                          case "number":
                          case "integer":
                            return (
                              <InputNumber
                                disabled={objectFieldReadOnly}
                                style={
                                  objectFieldReadOnly
                                    ? {
                                        width: "100%",
                                        ...readonlyNestedFieldStyle,
                                      }
                                    : { width: "100%" }
                                }
                                placeholder={
                                  objectField.placeholder || objectField.label
                                }
                                formatter={
                                  objectField.formatter?.useIndianFormat
                                    ? (value) => {
                                        if (!value) return "";
                                        const num = parseFloat(String(value));
                                        return new Intl.NumberFormat("en-IN", {
                                          minimumFractionDigits:
                                            objectField.formatter
                                              ?.minDecimalPlaces || 0,
                                          maximumFractionDigits:
                                            objectField.formatter
                                              ?.maxDecimalPlaces || 2,
                                        }).format(num);
                                      }
                                    : undefined
                                }
                                parser={(value) =>
                                  value?.replace(/\$\s?|(,*)/g, "") || ""
                                }
                              />
                            );

                          case "select":
                            return (
                              <Select
                                disabled={objectFieldReadOnly}
                                placeholder={`Select ${objectField.label}`}
                                style={readonlyNestedFieldStyle}
                              >
                                {objectField.options?.map((option: string) => (
                                  <Select.Option key={option} value={option}>
                                    {option}
                                  </Select.Option>
                                ))}
                                {objectField.enum?.map((option: string) => (
                                  <Select.Option key={option} value={option}>
                                    {option}
                                  </Select.Option>
                                ))}
                              </Select>
                            );

                          case "textarea":
                            return (
                              <TextArea
                                disabled={objectFieldReadOnly}
                                placeholder={
                                  objectField.placeholder || objectField.label
                                }
                                rows={objectField.textAreaRows || 3}
                                maxLength={objectField.maxLength}
                                style={readonlyNestedFieldStyle}
                              />
                            );

                          default:
                            return (
                              <Input
                                disabled={objectFieldReadOnly}
                                placeholder={
                                  objectField.placeholder || objectField.label
                                }
                                style={readonlyNestedFieldStyle}
                              />
                            );
                        }
                      };

                      return (
                        <Col
                          key={objectField.id}
                          span={objectField.type === "textarea" ? 24 : 12}
                        >
                          <Form.Item
                            name={[fieldId, objectField.id]}
                            label={objectField.label}
                            rules={
                              objectFieldRequired
                                ? [
                                    {
                                      required: true,
                                      message: `${objectField.label} is required`,
                                    },
                                  ]
                                : []
                            }
                          >
                            {renderNestedField()}
                          </Form.Item>
                        </Col>
                      );
                    })}
                  </Row>
                </Card>
              </div>
            );
          }
          // Fallback if objectFields is not defined
          return null;

        default:
          return (
            <Form.Item
              key={fieldId}
              name={fieldId}
              label={showLabel ? field.label : undefined}
            >
              <TextArea
                disabled={fieldReadOnly}
                placeholder={field.placeholder || field.label}
                autoSize={{ minRows: 1 }}
                style={readonlyFieldStyle}
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

    if (isFinancialAnalysisSection()) {
      const debitFields: any[] = [];
      const creditFields: any[] = [];
      const arrayFields: any[] = [];
      const objectFields: any[] = [];
      const otherFields: any[] = [];

      visibleFields.forEach((field: any) => {
        if (field.type === "array" && field.arrayItemFields) {
          arrayFields.push(field);
        } else if (field.type === "object" && field.objectFields) {
          objectFields.push(field);
        } else {
          const side = getFieldSide(field);
          if (side === "debit") {
            debitFields.push(field);
          } else if (side === "credit") {
            creditFields.push(field);
          } else {
            otherFields.push(field);
          }
        }
      });

      const { totalGrossProfit, totalNetProfit } = calculateFinancialTotals;

      return (
        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
          <Row gutter={[16, 16]}>
            {/* Debit Side (Left Column) - All debit fields (expenses like "to Purchases", "to charges") */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <div
                style={{
                  borderRight: "1px solid #e8e8e8",
                  paddingRight: 12,
                }}
              >
                {debitFields.map((field: any) => (
                  <div key={field.id} style={{ marginBottom: 16 }}>
                    {renderSingleField(field.id, field, true)}
                  </div>
                ))}
                {/* Render other fields that couldn't be categorized in left column */}
                {otherFields.map((field: any) => (
                  <div key={field.id} style={{ marginBottom: 16 }}>
                    {renderSingleField(field.id, field, true)}
                  </div>
                ))}
              </div>
            </Col>

            {/* Credit Side (Right Column) - All credit fields (incomes like "by sales", "by closing stock") */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <div style={{ paddingLeft: 12 }}>
                {creditFields.map((field: any) => (
                  <div key={field.id} style={{ marginBottom: 16 }}>
                    {renderSingleField(field.id, field, true)}
                  </div>
                ))}
              </div>
            </Col>

            {/* Object fields - full width */}
            {objectFields.map((field: any) => (
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

            {/* Total Gross Profit and Total Net Profit Display */}
            {(totalGrossProfit !== 0 || totalNetProfit !== 0) && (
              <>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Card
                    size="small"
                    style={{
                      backgroundColor: "#f0f9ff",
                      border: "1px solid #0ea5e9",
                      marginTop: 16,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        To Gross Profit
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: "20px",
                          color: "#0ea5e9",
                          display: "block",
                        }}
                      >
                        ₹
                        {totalGrossProfit.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Card
                    size="small"
                    style={{
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #22c55e",
                      marginTop: 16,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        To Net Profit
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: "20px",
                          color: "#22c55e",
                          display: "block",
                        }}
                      >
                        ₹
                        {totalNetProfit.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </div>
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </Form>
      );
    }

    // For non-financial sections, use the standard layout
    // Separate regular fields from array fields (arrays take full width)
    const regularStandaloneFields = visibleFields.filter(
      (field: any) => field.type !== "array" || !field.arrayItemFields
    );
    const arrayFields = visibleFields.filter(
      (field: any) => field.type === "array" && field.arrayItemFields
    );

    // Check if this is Type 4 (Detailed Financial Analysis with Balance Sheet) to show totals
    const isType4FinancialAnalysis =
      section.id === "financialAnalysisDetailed" ||
      section.label
        ?.toLowerCase()
        .includes("detailed financial analysis with balance sheet");
    const { totalGrossProfit, totalNetProfit } = calculateFinancialTotals;

    return (
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <Row gutter={[16, 16]}>
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

          {/* Total Gross Profit and Total Net Profit Display for Type 4 */}
          {isType4FinancialAnalysis &&
            (totalGrossProfit !== 0 || totalNetProfit !== 0) && (
              <>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Card
                    size="small"
                    style={{
                      backgroundColor: "#f0f9ff",
                      border: "1px solid #0ea5e9",
                      marginTop: 16,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        To Gross Profit
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: "20px",
                          color: "#0ea5e9",
                          display: "block",
                        }}
                      >
                        ₹
                        {totalGrossProfit.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Card
                    size="small"
                    style={{
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #22c55e",
                      marginTop: 16,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        To Net Profit
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: "20px",
                          color: "#22c55e",
                          display: "block",
                        }}
                      >
                        ₹
                        {totalNetProfit.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </div>
                  </Card>
                </Col>
              </>
            )}
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
    onArrayTotalsChange,
  }: {
    field: any;
    data: any;
    readOnly: boolean;
    setSectionUncommittedChanges: (fn: (prev: any) => any) => void;
    sectionId: string;
    onArrayTotalsChange?: (totals: { totalLoanAmount: number; totalEmi: number }) => void;
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

    const calculateFormulasInArrayItemLocal = (
      arrayField: any,
      arrayIndex: number,
      allFormValues: any,
      prefix: string = ""
    ): Record<string, any> => {
      const calculatedFields: Record<string, any> = {};
      const itemFields = arrayField.arrayItemFields || [];

      const itemValues: Record<string, any> = {};
      itemFields.forEach((itemField: any) => {
        const flatKey = prefix
          ? `${prefix}[${arrayIndex}].${itemField.id}`
          : `${arrayField.id}[${arrayIndex}].${itemField.id}`;
        const value = allFormValues[flatKey];
        if (value !== undefined && value !== null && value !== "") {
          itemValues[itemField.id] =
            typeof value === "number" ? value : parseFloat(String(value)) || 0;
        } else {
          itemValues[itemField.id] = 0;
        }
      });

      const workingItemValues = { ...itemValues };
      const formulaItemFields = itemFields.filter(
        (field: any) => field.formula
      );
      const maxPasses = 10;
      let pass = 0;
      let hasNewCalculations = true;

      while (hasNewCalculations && pass < maxPasses) {
        hasNewCalculations = false;
        pass++;

        formulaItemFields.forEach((itemField: any) => {
          const calculatedValue = evaluateFormula(
            itemField.formula,
            workingItemValues
          );
          if (calculatedValue !== null) {
            const currentValue = workingItemValues[itemField.id];
            const currentNum =
              typeof currentValue === "number"
                ? currentValue
                : parseFloat(String(currentValue || 0));
            const newNum = calculatedValue;

            if (isNaN(currentNum) || Math.abs(currentNum - newNum) > 0.0001) {
              const flatKey = prefix
                ? `${prefix}[${arrayIndex}].${itemField.id}`
                : `${arrayField.id}[${arrayIndex}].${itemField.id}`;
              calculatedFields[flatKey] = calculatedValue;
              workingItemValues[itemField.id] = calculatedValue;
              hasNewCalculations = true;
            }
          }
        });
      }

      itemFields.forEach((itemField: any) => {
        if (itemField.type === "array" && itemField.arrayItemFields) {
          const nestedArrayValue =
            allFormValues[
              prefix
                ? `${prefix}[${arrayIndex}].${itemField.id}`
                : `${arrayField.id}[${arrayIndex}].${itemField.id}`
            ];
          if (Array.isArray(nestedArrayValue)) {
            nestedArrayValue.forEach((_, nestedIndex: number) => {
              const nestedPrefix = prefix
                ? `${prefix}[${arrayIndex}].${itemField.id}`
                : `${arrayField.id}[${arrayIndex}].${itemField.id}`;
              const nestedCalculated = calculateFormulasInArrayItemLocal(
                itemField,
                nestedIndex,
                allFormValues,
                nestedPrefix
              );
              Object.assign(calculatedFields, nestedCalculated);
            });
          }
        }
      });

      return calculatedFields;
    };

    // Array form change handler - update section-level uncommitted changes
    const handleArrayFormChange = useCallback(
      (changedValues: any, allValues: any) => {
        // Get ALL form values to ensure we capture everything, not just changed fields
        const allFormValues = form.getFieldsValue();

        // Calculate formulas for array items
        const calculatedFields: Record<string, any> = {};
        if (field.arrayItemFields) {
          const arrayIndices = new Set<number>();
          Object.keys(allFormValues).forEach((key) => {
            if (key.startsWith(`${field.id}[`)) {
              const match = key.match(
                new RegExp(`${field.id}\\[(\\d+)\\]\\.(.+)`)
              );
              if (match) {
                arrayIndices.add(parseInt(match[1]));
              }
            }
          });

          arrayIndices.forEach((index) => {
            const arrayCalculated = calculateFormulasInArrayItemLocal(
              field,
              index,
              allFormValues
            );
            Object.assign(calculatedFields, arrayCalculated);
          });
        }

        if (Object.keys(calculatedFields).length > 0) {
          form.setFieldsValue(calculatedFields);
          Object.assign(allFormValues, calculatedFields);
        }

        // Convert form values back to array format
        const arrayData: any[] = [];
        Object.keys(allFormValues).forEach((key) => {
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
              arrayData[index][fieldKey] = allFormValues[key];
            }
          }
        });

        // Update section-level uncommitted changes
        // Always update, even if array is empty, to track all changes
        setSectionUncommittedChanges((prev: any) => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            [field.id]: arrayData,
          },
        }));

        if (
          onArrayTotalsChange &&
          sectionId === "existingLoanDetails" &&
          (field.id === "loans" || field.id === "loanDetails")
        ) {
          let totalLoanAmount = 0;
          let totalEmi = 0;
          arrayData.forEach((loan) => {
            if (loan && typeof loan === "object") {
              const loanAmount =
                typeof loan.loanAmount === "number"
                  ? loan.loanAmount
                  : parseFloat(String(loan.loanAmount || 0).replace(/,/g, "")) || 0;
              
              const emiValue = loan.emi !== undefined ? loan.emi : loan.emiInterest;
              const emi =
                typeof emiValue === "number"
                  ? emiValue
                  : parseFloat(String(emiValue || 0).replace(/,/g, "")) || 0;
              
              if (!isNaN(loanAmount)) totalLoanAmount += loanAmount;
              if (!isNaN(emi)) totalEmi += emi;
            }
          });
          onArrayTotalsChange({
            totalLoanAmount,
            totalEmi,
          });
        }
      },
      [
        field.id,
        field.arrayItemFields,
        sectionId,
        setSectionUncommittedChanges,
        form,
        items.length,
      ]
    );

    // Sync form values and trigger change handler when items are ADDED (not removed)
    // Removal is handled directly in removeItem function
    const previousItemsLengthRef = React.useRef(items.length);
    React.useEffect(() => {
      const wasAdded = items.length > previousItemsLengthRef.current;

      if (wasAdded) {
        // Item was added - preserve existing values and add new ones
        const currentFormValues = form.getFieldsValue();
        const formValues: any = {};

        items.forEach((item: any, index: number) => {
          if (field.arrayItemFields) {
            field.arrayItemFields.forEach((itemField: any) => {
              const key = `${field.id}[${index}].${itemField.id}`;
              // Preserve form value if it exists, otherwise use item value
              formValues[key] =
                currentFormValues[key] ?? item[itemField.id] ?? "";
            });
          } else {
            Object.keys(item).forEach((key) => {
              if (key !== "_id") {
                const formKey = `${field.id}[${index}].${key}`;
                formValues[formKey] =
                  currentFormValues[formKey] ?? item[key] ?? "";
              }
            });
          }
        });

        form.setFieldsValue(formValues);

        // Trigger change handler after a short delay
        setTimeout(() => {
          handleArrayFormChange({}, form.getFieldsValue());
        }, 0);
      }

      previousItemsLengthRef.current = items.length;
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
      // Get current form values before removal
      const currentFormValues = form.getFieldsValue();

      // Filter out the removed item
      const newItems = items.filter((_: any, i: number) => i !== index);

      // If no items remain, clear all form values for this array field and set empty array
      if (newItems.length === 0) {
        // Clear all form values for this array field
        const allFormValues = form.getFieldsValue();
        const keysToRemove: string[] = [];

        Object.keys(allFormValues).forEach((key) => {
          if (key.startsWith(`${field.id}[`)) {
            keysToRemove.push(key);
          }
        });

        // Remove all keys for this array field
        keysToRemove.forEach((key) => {
          form.setFieldValue(key, undefined);
        });

        // Update items state to empty array
        setItems([]);

        // Update uncommitted changes with empty array
        setSectionUncommittedChanges((prev: any) => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            [field.id]: [],
          },
        }));

        // Trigger change handler
        setTimeout(() => {
          const updatedFormValues = form.getFieldsValue();
          handleArrayFormChange({}, updatedFormValues);
        }, 100);
        return;
      }

      // Build new form values with reindexed items
      // Items after the removed index need to shift down
      const newFormValues: any = {};

      // Also build the array data directly for uncommitted changes
      const arrayData: any[] = [];

      newItems.forEach((item: any, newIndex: number) => {
        // Determine the old index (items after removed index were at oldIndex + 1)
        const oldIndex = newIndex >= index ? newIndex + 1 : newIndex;

        // Build array item object - start with the item data as base
        const arrayItem: any = { ...item };
        delete arrayItem._id; // Remove _id from the data

        if (field.arrayItemFields) {
          field.arrayItemFields.forEach((itemField: any) => {
            const oldKey = `${field.id}[${oldIndex}].${itemField.id}`;
            const newKey = `${field.id}[${newIndex}].${itemField.id}`;
            // Priority: form value (if exists) > item value > empty string
            // Preserve form value if it exists (even if empty, as user might have cleared it)
            const formValue = currentFormValues[oldKey];
            const value =
              formValue !== undefined
                ? formValue
                : item[itemField.id] !== undefined
                  ? item[itemField.id]
                  : "";
            newFormValues[newKey] = value;
            arrayItem[itemField.id] = value;
          });
        } else {
          Object.keys(item).forEach((key) => {
            if (key !== "_id") {
              const oldKey = `${field.id}[${oldIndex}].${key}`;
              const newKey = `${field.id}[${newIndex}].${key}`;
              const formValue = currentFormValues[oldKey];
              const value =
                formValue !== undefined
                  ? formValue
                  : item[key] !== undefined
                    ? item[key]
                    : "";
              newFormValues[newKey] = value;
              arrayItem[key] = value;
            }
          });
        }

        arrayData.push(arrayItem);
      });

      // Update items state first
      setItems(newItems);

      // Update form with reindexed values
      form.setFieldsValue(newFormValues);

      // Directly update uncommitted changes with the array data
      // This ensures changes are tracked even if form hasn't fully updated
      setSectionUncommittedChanges((prev: any) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [field.id]: arrayData,
        },
      }));

      // Also trigger the change handler to ensure everything is in sync
      setTimeout(() => {
        const allFormValues = form.getFieldsValue();
        handleArrayFormChange({}, allFormValues);
      }, 100);
    };

    const renderArrayItemField = (
      itemFieldId: string,
      itemField: any,
      itemValue: any,
      itemIndex: number
    ) => {
      const fieldKey = `${field.id}[${itemIndex}].${itemFieldId}`;
      const isItemCoordField = isCoordinateField(itemFieldId);
      const isItemFormulaField = !!itemField.formula;
      const itemFieldReadOnly =
        readOnly || isItemCoordField || isItemFormulaField;

      const readonlyItemFieldStyle = itemFieldReadOnly
        ? { color: "#262626" }
        : undefined;

      // Handle enum fields (select dropdown) in arrays
      if (itemField.enum && itemField.enum.length > 0) {
        return (
          <Form.Item key={itemFieldId} name={fieldKey} label={itemField.label}>
            <Select
              disabled={itemFieldReadOnly}
              placeholder={`Select ${itemField.label}`}
              style={readonlyItemFieldStyle}
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
        case "boolean":
          return (
            <Form.Item
              key={itemFieldId}
              name={fieldKey}
              label={itemField.label}
            >
              <Radio.Group
                disabled={itemFieldReadOnly}
                style={readonlyItemFieldStyle}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          );

        case "time":
          // Handle time field (schema service converts format: "time" to type: "time")
          return (
            <Form.Item
              key={itemFieldId}
              name={fieldKey}
              label={itemField.label}
              getValueProps={(value) => {
                // Convert HH:mm AM/PM or HH:mm to dayjs object
                if (!value) return { value: undefined };
                if (dayjs.isDayjs(value)) return { value };
                // Handle HH:mm AM/PM format
                const timeStr = String(value).trim();
                // Try parsing with AM/PM
                const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
                const match = timeStr.match(timeRegex);
                if (match) {
                  let hours = parseInt(match[1], 10);
                  const minutes = parseInt(match[2], 10);
                  const period = match[3].toUpperCase();
                  if (period === "PM" && hours !== 12) {
                    hours += 12;
                  } else if (period === "AM" && hours === 12) {
                    hours = 0;
                  }
                  return {
                    value: dayjs().hour(hours).minute(minutes).second(0),
                  };
                }
                // Try parsing HH:mm format
                const hhmmMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
                if (hhmmMatch) {
                  const hours = parseInt(hhmmMatch[1], 10);
                  const minutes = parseInt(hhmmMatch[2], 10);
                  return {
                    value: dayjs().hour(hours).minute(minutes).second(0),
                  };
                }
                return { value: undefined };
              }}
              getValueFromEvent={(time) => {
                // Convert dayjs object to HH:mm AM/PM format when saving
                if (!time) return undefined;
                return time.format("hh:mm A");
              }}
            >
              <TimePicker
                disabled={itemFieldReadOnly}
                placeholder={`Select ${itemField.label}`}
                format="hh:mm A"
                style={
                  itemFieldReadOnly
                    ? { width: "100%", ...readonlyItemFieldStyle }
                    : { width: "100%" }
                }
                suffixIcon={<ClockCircleOutlined />}
              />
            </Form.Item>
          );

        case "number":
        case "integer":
          return (
            <Form.Item
              key={itemFieldId}
              name={fieldKey}
              label={itemField.label}
            >
              <InputNumber
                disabled={itemFieldReadOnly}
                style={
                  itemFieldReadOnly
                    ? { width: "100%", ...readonlyItemFieldStyle }
                    : { width: "100%" }
                }
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
              getValueProps={(value) => {
                // Convert DD-MM-YYYY or DD/MM/YYYY to dayjs object
                if (!value) return { value: undefined };
                if (dayjs.isDayjs(value)) return { value };
                // Handle DD-MM-YYYY or DD/MM/YYYY format
                const dateStr = String(value).trim();
                const parts = dateStr.split(/[-\/]/);
                if (parts.length === 3) {
                  const [day, month, year] = parts;
                  return {
                    value: dayjs(
                      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
                    ),
                  };
                }
                // Try parsing as-is
                const parsed = dayjs(value);
                return { value: parsed.isValid() ? parsed : undefined };
              }}
              getValueFromEvent={(date) => {
                // Convert dayjs object to DD/MM/YYYY format when saving
                if (!date) return undefined;
                return date.format("DD/MM/YYYY");
              }}
            >
              <DatePicker
                disabled={itemFieldReadOnly}
                placeholder={`Select ${itemField.label}`}
                format="DD/MM/YYYY"
                style={
                  itemFieldReadOnly
                    ? { width: "100%", ...readonlyItemFieldStyle }
                    : { width: "100%" }
                }
              />
            </Form.Item>
          );

        case "string":
          // PURE SCHEMA-BASED: Match mobile logic exactly
          // Mobile checks: property.format === 'date' || 'time' || 'date-time' || 'datetime'

          // Check format property for time field
          if (itemField.format === "time") {
            return (
              <Form.Item
                key={itemFieldId}
                name={fieldKey}
                label={itemField.label}
                getValueProps={(value) => {
                  // Convert HH:mm AM/PM or HH:mm to dayjs object
                  if (!value) return { value: undefined };
                  if (dayjs.isDayjs(value)) return { value };
                  // Handle HH:mm AM/PM format
                  const timeStr = String(value).trim();
                  // Try parsing with AM/PM
                  const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
                  const match = timeStr.match(timeRegex);
                  if (match) {
                    let hours = parseInt(match[1], 10);
                    const minutes = parseInt(match[2], 10);
                    const period = match[3].toUpperCase();
                    if (period === "PM" && hours !== 12) {
                      hours += 12;
                    } else if (period === "AM" && hours === 12) {
                      hours = 0;
                    }
                    return {
                      value: dayjs().hour(hours).minute(minutes).second(0),
                    };
                  }
                  // Try parsing HH:mm format
                  const hhmmMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
                  if (hhmmMatch) {
                    const hours = parseInt(hhmmMatch[1], 10);
                    const minutes = parseInt(hhmmMatch[2], 10);
                    return {
                      value: dayjs().hour(hours).minute(minutes).second(0),
                    };
                  }
                  return { value: undefined };
                }}
                getValueFromEvent={(time) => {
                  // Convert dayjs object to HH:mm AM/PM format when saving
                  if (!time) return undefined;
                  return time.format("hh:mm A");
                }}
              >
                <TimePicker
                  disabled={itemFieldReadOnly}
                  placeholder={`Select ${itemField.label}`}
                  format="hh:mm A"
                  style={{ width: "100%" }}
                  suffixIcon={<ClockCircleOutlined />}
                />
              </Form.Item>
            );
          }

          // Check format property for datetime field (date-time or datetime)
          if (
            itemField.format === "date-time" ||
            itemField.format === "datetime"
          ) {
            return (
              <Form.Item
                key={itemFieldId}
                name={fieldKey}
                label={itemField.label}
                getValueProps={(value) => {
                  // Convert DD-MM-YYYY HH:mm A or DD/MM/YYYY HH:mm A to dayjs object
                  if (!value) return { value: undefined };
                  if (dayjs.isDayjs(value)) return { value };
                  // Handle DD-MM-YYYY HH:mm A or DD/MM/YYYY HH:mm A format
                  const dateTimeStr = String(value).trim();
                  // Try parsing with time
                  const parsed = dayjs(
                    dateTimeStr,
                    [
                      "DD-MM-YYYY HH:mm A",
                      "DD/MM/YYYY HH:mm A",
                      "DD-MM-YYYY hh:mm A",
                      "DD/MM/YYYY hh:mm A",
                      "YYYY-MM-DD HH:mm",
                      "YYYY-MM-DD HH:mm:ss",
                    ],
                    true
                  );
                  if (parsed.isValid()) {
                    return { value: parsed };
                  }
                  // Fallback: try date only
                  const parts = dateTimeStr.split(/[-\/]/);
                  if (parts.length === 3) {
                    const [day, month, year] = parts;
                    return {
                      value: dayjs(
                        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
                      ),
                    };
                  }
                  return { value: undefined };
                }}
                getValueFromEvent={(date) => {
                  // Convert dayjs object to DD/MM/YYYY HH:mm A format when saving
                  if (!date) return undefined;
                  return date.format("DD/MM/YYYY HH:mm A");
                }}
              >
                <DatePicker
                  disabled={itemFieldReadOnly}
                  placeholder={`Select ${itemField.label}`}
                  format="DD/MM/YYYY HH:mm A"
                  showTime={{ format: "HH:mm A" }}
                  style={
                    itemFieldReadOnly
                      ? { width: "100%", ...readonlyItemFieldStyle }
                      : { width: "100%" }
                  }
                />
              </Form.Item>
            );
          }

          // Check format property for date field (date only)
          if (itemField.format === "date") {
            return (
              <Form.Item
                key={itemFieldId}
                name={fieldKey}
                label={itemField.label}
                getValueProps={(value) => {
                  // Convert DD-MM-YYYY or DD/MM/YYYY to dayjs object
                  if (!value) return { value: undefined };
                  if (dayjs.isDayjs(value)) return { value };
                  // Handle DD-MM-YYYY or DD/MM/YYYY format
                  const dateStr = String(value).trim();
                  const parts = dateStr.split(/[-\/]/);
                  if (parts.length === 3) {
                    const [day, month, year] = parts;
                    return {
                      value: dayjs(
                        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
                      ),
                    };
                  }
                  // Try parsing as-is
                  const parsed = dayjs(value);
                  return { value: parsed.isValid() ? parsed : undefined };
                }}
                getValueFromEvent={(date) => {
                  // Convert dayjs object to DD/MM/YYYY format when saving
                  if (!date) return undefined;
                  return date.format("DD/MM/YYYY");
                }}
              >
                <DatePicker
                  disabled={itemFieldReadOnly}
                  placeholder={`Select ${itemField.label}`}
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            );
          }

          // Check ui.widget for textarea (schema-defined widget type)
          if (
            itemField.ui?.widget === "textarea" ||
            itemField.ui?.widget === "richtext"
          ) {
            const minRows = itemField.ui?.rows || 2;
            return (
              <Form.Item
                key={itemFieldId}
                name={fieldKey}
                label={itemField.label}
              >
                <TextArea
                  disabled={itemFieldReadOnly}
                  placeholder={itemField.placeholder || itemField.label}
                  autoSize={{ minRows: minRows }}
                  style={readonlyItemFieldStyle}
                />
              </Form.Item>
            );
          }

          // Default: Use TextArea with autoSize (so it can grow, but starts as single line)
          return (
            <Form.Item
              key={itemFieldId}
              name={fieldKey}
              label={itemField.label}
            >
              <TextArea
                disabled={itemFieldReadOnly}
                placeholder={itemField.placeholder || itemField.label}
                autoSize={{ minRows: 1 }}
                style={readonlyItemFieldStyle}
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
              <Radio.Group
                disabled={itemFieldReadOnly}
                style={readonlyItemFieldStyle}
              >
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
              <TextArea
                disabled={itemFieldReadOnly}
                placeholder={itemField.placeholder || itemField.label}
                autoSize={{ minRows: 1 }}
                style={readonlyItemFieldStyle}
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
      {currentDepartment === "PD" &&
        (() => {
          const bankName =
            (typeof completeVerificationData?.bankName === "string"
              ? completeVerificationData.bankName
              : undefined) ||
            (typeof verificationData?.bankName === "string"
              ? verificationData.bankName
              : undefined) ||
            (typeof verificationData?.loan?.bankName === "string"
              ? verificationData.loan.bankName
              : undefined) ||
            "";

          const templateName =
            loanTemplateName ||
            (typeof completeVerificationData?.loan?.templateName === "string"
              ? completeVerificationData.loan.templateName
              : undefined) ||
            (typeof verificationData?.loan?.templateName === "string"
              ? verificationData.loan.templateName
              : undefined) ||
            "";

          if (!bankName && !templateName) return null;

          const headerText = templateName
            ? `${bankName}${bankName ? " - " : ""}${templateName}`
            : bankName;

          return (
            <section style={{ margin: "6px 0 12px", textAlign: "center" }}>
              <Text style={{ color: "#1e40af", fontWeight: 600 }}>
                {headerText || "Unknown Bank"}
              </Text>
            </section>
          );
        })()}

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
        {hasEditRequest && (
          <Card
            style={{
              marginBottom: 12,
              background: "#fffbe6",
              border: "1px solid #ffe58f",
            }}
          >
            <Text style={{ color: "#d48806", fontWeight: 600 }}>
              Awaiting for Admin approval. Edits are locked because a change
              request is pending.
            </Text>
          </Card>
        )}

        {/* PD Department - Use Dynamic Forms Only */}
        {currentDepartment === "PD" &&
        useGenericApproach &&
        schemaForm &&
        !formLoading ? (
          <>
            {(() => {
              const netProfit =
                dynamicFormData?.financialAnalysis?.netProfit ||
                completeVerificationData?.verificationData?.financialAnalysis?.netProfit ||
                verificationData?.verificationData?.financialAnalysis?.netProfit ||
                verificationData?.financialAnalysis?.netProfit ||
                null;

              const netProfitNum =
                netProfit !== null && netProfit !== undefined
                  ? typeof netProfit === "string"
                    ? parseFloat(String(netProfit).replace(/,/g, ""))
                    : Number(netProfit)
                  : null;

              const isNetProfitAbove10Lakh =
                netProfitNum !== null && netProfitNum > 1000000;

              const shouldBeReadOnlyDueToNetProfit = isNetProfitAbove10Lakh && hasEditRequest;
              return (
                <CollapsibleFormSections
                  schema={schemaForm}
                  formData={dynamicFormData}
                  onEdit={handleDynamicSectionEdit}
                  readOnly={
                    shouldBeReadOnlyDueToNetProfit ||
                    (role === "VerificationExecutive"
                      ? hasEditRequest
                      : !!verificationData?.approvedStatus || hasEditRequest) // Others follow original logic
                  }
                  activeSections={activeSections}
                  setActiveSections={setActiveSections}
                  role={role}
                  verificationData={verificationData}
                  changedData={changedData}
                  setChangedData={setChangedData}
                  setLocalEditLogsUpdated={setLocalEditLogsUpdated}
                  parentFormInstancesRef={formInstancesRef}
                  savedSectionData={savedSectionData}
                  setSavedSectionData={setSavedSectionData}
                />
              );
            })()}

            {/* Photo Capture Section - Grouped by Document Type */}
            <section id="section-photoCapture" style={{ marginBottom: 24 }}>
              <Card
                title="Photo Capture"
                extra={
                  <Space>
                    {(currentDepartment || curDept) === "PD" &&
                      data?.uploadedItems &&
                      data.uploadedItems.length > 0 && (
                        <Button
                          type="default"
                          icon={<DownloadOutlined />}
                          size="small"
                          onClick={handleDownloadAllFiles}
                        >
                          Download All Files
                        </Button>
                      )}
                    {!(
                      !!verificationData?.approvedStatus || hasEditRequest
                    ) && (
                      <Upload
                        accept={
                          (currentDepartment || curDept) === "PD"
                            ? "image/jpeg,image/png,.jpg,.jpeg,.png,application/pdf,.pdf"
                            : "image/jpeg,image/png,.jpg,.jpeg,.png"
                        }
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleMultipleFileUpload}
                        multiple={true}
                      >
                        <Button
                          type="primary"
                          icon={<UploadOutlined />}
                          size="small"
                        >
                          {(currentDepartment || curDept) === "PD"
                            ? "Upload Images and Documents"
                            : "Upload Photo"}
                        </Button>
                      </Upload>
                    )}
                  </Space>
                }
              >
                {(() => {
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

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "16px",
                          }}
                        >
                          {photos.map((item: any, idx: number) => {
                            const isDoc = isDocumentItem(item);
                            const fileExt = getFileExtension(item);

                            return (
                              <div
                                key={item.id}
                                style={{ position: "relative" }}
                              >
                                {isDoc ? (
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                      borderRadius: "4px",
                                      border: "2px solid #f0f0f0",
                                      background:
                                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "white",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleViewDocument(item)}
                                  >
                                    <FileOutlined
                                      style={{
                                        fontSize: "48px",
                                        marginBottom: "8px",
                                      }}
                                    />
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        textAlign: "center",
                                        padding: "0 8px",
                                      }}
                                    >
                                      {item.fileName ||
                                        `${fileExt.toUpperCase()} Document`}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "10px",
                                        marginTop: "4px",
                                        opacity: 0.9,
                                      }}
                                    >
                                      Click to view
                                    </div>
                                  </div>
                                ) : (
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
                                )}

                                {isDoc && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: 8,
                                      left: 8,
                                      display: "flex",
                                      gap: "4px",
                                    }}
                                  >
                                    <Button
                                      type="text"
                                      icon={<EyeOutlined />}
                                      style={{
                                        background: "rgba(255, 255, 255, 0.9)",
                                        borderRadius: "4px",
                                        width: "32px",
                                        height: "32px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDocument(item);
                                      }}
                                      title="View document"
                                    />
                                    <Button
                                      type="text"
                                      icon={<DownloadOutlined />}
                                      style={{
                                        background: "rgba(255, 255, 255, 0.9)",
                                        borderRadius: "4px",
                                        width: "32px",
                                        height: "32px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadDocument(item);
                                      }}
                                      title="Download document"
                                    />
                                  </div>
                                )}

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
                                  {docType} - {isDoc ? "Document" : "Photo"}{" "}
                                  {idx + 1}{" "}
                                  {!isDoc && (item?.isCamera ? "📷" : "🖼️")}
                                  {isDoc && "📄"}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  );
                })()}

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
              verificationData={{
                ...verificationData,
                verifications: completeVerificationData
                  ? [completeVerificationData]
                  : verificationData?.verifications,
                synopsis:
                  completeVerificationData?.synopsis ||
                  verificationData?.synopsis,
              }}
              onVerificationExecutiveSubmit={handleFeedbackSubmit}
              verificationExecutiveLoading={loading}
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
              extra={getButton("businessBasicDetails")}
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
            <section id="section-photoCapture" style={{ marginBottom: 24 }}>
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
            loanId={loanId}
            hasPdEmail={
              currentDepartment === "PD" &&
              pdEmailLogs &&
              pdEmailLogs.length > 0
            }
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

      {currentDepartment === "PD" && (
        <Modal
          open={pdfViewerVisible}
          onCancel={() => {
            if (currentPdfUrl && currentPdfUrl.startsWith("blob:")) {
              window.URL.revokeObjectURL(currentPdfUrl);
            }
            setPdfViewerVisible(false);
            setCurrentPdfUrl(null);
            setCurrentPdfFileName("");
            setPdfLoading(false);
          }}
          footer={[
            <Button
              key="download"
              icon={<DownloadOutlined />}
              onClick={() => {
                if (currentPdfUrl) {
                  const link = document.createElement("a");
                  link.href = currentPdfUrl;
                  link.download = currentPdfFileName;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  message.success("Document download started");
                }
              }}
            >
              Download
            </Button>,
            <Button
              key="close"
              onClick={() => {
                if (currentPdfUrl && currentPdfUrl.startsWith("blob:")) {
                  window.URL.revokeObjectURL(currentPdfUrl);
                }
                setPdfViewerVisible(false);
                setCurrentPdfUrl(null);
                setCurrentPdfFileName("");
                setPdfLoading(false);
              }}
            >
              Close
            </Button>,
          ]}
          width="90%"
          style={{ top: 20 }}
          title={`View Document: ${currentPdfFileName}`}
        >
          <div style={{ height: "80vh", overflow: "auto" }}>
            {pdfLoading ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <p>Loading document...</p>
              </div>
            ) : currentPdfUrl ? (
              <>
                <iframe
                  src={currentPdfUrl}
                  width="100%"
                  height="100%"
                  style={{
                    border: "1px solid #eee",
                    minHeight: "600px",
                    display: "block",
                  }}
                  title={currentPdfFileName}
                  onError={() => {
                    message.warning(
                      "Unable to display document in browser. Use download or open in new tab."
                    );
                  }}
                />
                <div
                  style={{
                    marginTop: "16px",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = currentPdfUrl;
                        link.download = currentPdfFileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        message.success("Document download started");
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => {
                        window.open(
                          currentPdfUrl,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                    >
                      Open in New Tab
                    </Button>
                  </Space>
                </div>
              </>
            ) : (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <p style={{ color: "#ff4d4f", marginBottom: "16px" }}>
                  Unable to load document. Please try again.
                </p>
                <Button
                  type="primary"
                  onClick={() => {
                    setPdfViewerVisible(false);
                    setCurrentPdfUrl(null);
                    setCurrentPdfFileName("");
                    setPdfLoading(false);
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
