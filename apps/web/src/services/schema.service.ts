import axiosInstance from "@/config/axios.config";

export interface BankSchemaMetadata {
  verifierFields: string[];
  hasCustomTemplate: boolean;
  sectionIds: string[];
}

export interface BankSchemaResponse {
  bankName: string;
  schema: any;
  metadata: BankSchemaMetadata;
}

/**
 * Fetch form schema from backend for a specific bank
 * This is the single source of truth for all bank form schemas
 */
export const getSchemaFromBackend = async (
  bankName: string,
  department: string = "PD"
): Promise<BankSchemaResponse> => {
  try {
    const response = await axiosInstance.get(`/loans/get-bank-forms`, {
      params: { bankName, department },
    });

    if (response.data.status === 200) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to fetch schema");
  } catch (error: any) {
    console.error(`Error fetching schema for bank ${bankName}:`, error);
    throw error;
  }
};

export const getPdBanksApi = async () => {
  const response = await axiosInstance.get(`/loans/get-bank-forms`, {
    params: { department: "PD", type: "banks" },
  });
  return response.data.data;
};

/**
 * Fetch list of all supported bank names
 */
export const getSupportedBanks = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get(`/loans/banks`);

    if (response.data.status === 200) {
      return response.data.data;
    }

    throw new Error("Failed to fetch supported banks");
  } catch (error: any) {
    console.error("Error fetching supported banks:", error);
    throw error;
  }
};

/**
 * Convert backend JSON schema format to web form definition format
 * The backend returns sections with JSON schema, we need to convert to our form structure
 */
export const convertBackendSchemaToWebFormat = (backendSchema: any) => {
  if (!backendSchema || !backendSchema.sections) {
    console.warn("Invalid backend schema format");
    return null;
  }

  return {
    id: backendSchema.id,
    name: backendSchema.bankName,
    sections: backendSchema.sections.map((section: any) => {
      const schema = section.schema || {};
      const creditFields = schema.credit || [];
      const debitFields = schema.debit || [];
      
      // Convert properties to fields with side and variant attributes
      const allFields = convertSchemaPropertiesToFields(
        schema.properties || {},
        schema.required || [],
        creditFields,
        debitFields
      );

      // Create a map for quick lookup
      const fieldMap = new Map(allFields.map((field: any) => [field.id, field]));

      // Order fields based on credit/debit arrays to preserve the intended order
      // Debit fields first (in the order specified in debit array), then credit fields (in the order specified in credit array)
      const orderedFields: any[] = [];
      
      // Add debit fields in the order they appear in debitFields array
      debitFields.forEach((fieldId) => {
        const field = fieldMap.get(fieldId);
        if (field) {
          orderedFields.push(field);
        }
      });
      
      // Add credit fields in the order they appear in creditFields array
      creditFields.forEach((fieldId) => {
        const field = fieldMap.get(fieldId);
        if (field) {
          orderedFields.push(field);
        }
      });
      
      // Add any remaining fields that weren't in the arrays (preserving their original order)
      allFields.forEach((field: any) => {
        if (!debitFields.includes(field.id) && !creditFields.includes(field.id)) {
          orderedFields.push(field);
        }
      });

      return {
        id: section.id,
        label: section.label,
        fields: orderedFields,
        required: section.required,
      };
    }),
  };
};

/**
 * Convert JSON schema properties to field definitions
 */
const convertSchemaPropertiesToFields = (
  properties: any,
  requiredFields: string[],
  creditFields: string[] = [],
  debitFields: string[] = []
) => {
  const fields: any[] = [];

  Object.entries(properties).forEach(([fieldId, property]: [string, any]) => {
    const uiSettings = property.ui || property["ui:options"] || {};

    const field: any = {
      id: fieldId,
      label: property.title || fieldId,
      type: mapJsonSchemaTypeToFieldType(property),
      required: requiredFields.includes(fieldId) || property.required || false,
      readOnly: property.readOnly || false,
      placeholder: property.title || fieldId,
      formatter: property.formatter,
      dependencies: property.dependencies,
      title: property.title, // Preserve original title
    };

    // Determine side (debit/credit) based on credit/debit arrays or fallback to title/fieldId
    if (debitFields.includes(fieldId)) {
      field.side = "debit";
    } else if (creditFields.includes(fieldId)) {
      field.side = "credit";
    } else {
      // Fallback: check title starts with "To" (debit) or "By" (credit)
      const title = property.title || "";
      if (title.toLowerCase().startsWith("to ")) {
        field.side = "debit";
      } else if (title.toLowerCase().startsWith("by ")) {
        field.side = "credit";
      }
      // If still no side, check fieldId
      if (!field.side) {
        if (fieldId.toLowerCase().includes("debit")) {
          field.side = "debit";
        } else if (fieldId.toLowerCase().includes("credit")) {
          field.side = "credit";
        }
      }
    }

    // Determine variant (estimated/actuals) based on field ID or title
    const title = property.title || "";
    const lowerFieldId = fieldId.toLowerCase();
    const lowerTitle = title.toLowerCase();
    
    if (
      lowerFieldId.includes("estimation") ||
      lowerFieldId.includes("estimated") ||
      lowerTitle.includes("estimation") ||
      lowerTitle.includes("estimated")
    ) {
      field.variant = "estimated";
    } else if (
      lowerFieldId.includes("actual") ||
      lowerTitle.includes("actual") ||
      lowerFieldId.includes("_2023") ||
      lowerFieldId.includes("_2024")
    ) {
      field.variant = "actuals";
    }

    if (Object.keys(uiSettings).length > 0) {
      field.ui = uiSettings;
    }

    if (uiSettings.widget === "textarea") {
      field.type = "textarea";
    }
    if (uiSettings.widget === "richtext") {
      field.type = "richtext";
    }

    if (typeof uiSettings.rows === "number") {
      field.textAreaRows = uiSettings.rows;
    }

    if (typeof uiSettings.maxLength === "number") {
      field.maxLength = uiSettings.maxLength;
    }

    // Handle enum (select dropdown)
    if (property.enum && Array.isArray(property.enum)) {
      field.options = property.enum;
      field.enum = property.enum;
    }

    // Handle array fields
    if (property.type === "array" && property.items) {
      field.arrayItemFields = convertSchemaPropertiesToFields(
        property.items.properties || {},
        property.items.required || [],
        creditFields,
        debitFields
      );
    }

    // Handle object fields
    if (property.type === "object" && property.properties) {
      field.objectFields = convertSchemaPropertiesToFields(
        property.properties,
        property.required || [],
        creditFields,
        debitFields
      );
    }

    // Handle date format
    if (property.format === "date") {
      field.type = "date";
    }

    fields.push(field);
  });

  return fields;
};

/**
 * Map JSON schema types to our field types
 */
const mapJsonSchemaTypeToFieldType = (property: any): string => {
  if (property.ui?.widget === "richtext") return "richtext";
  if (property["ui:options"]?.widget === "richtext") return "richtext";
  if (property.ui?.widget === "textarea") return "textarea";
  if (property["ui:options"]?.widget === "textarea") return "textarea";
  if (property.enum) return "select";
  if (property.format === "date") return "date";
  if (property.type === "boolean") return "boolean";
  if (property.type === "array") return "array";
  if (property.type === "object") return "object";
  if (property.type === "number" || property.type === "integer")
    return "number";

  // Check if it should be textarea based on title
  const title = (property.title || "").toLowerCase();
  if (
    title.includes("address") ||
    title.includes("description") ||
    title.includes("about") ||
    title.includes("remark") ||
    title.includes("details") ||
    title.includes("synopsis")
  ) {
    return "textarea";
  }

  return "text";
};
