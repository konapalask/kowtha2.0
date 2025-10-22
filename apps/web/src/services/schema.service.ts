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
    sections: backendSchema.sections.map((section: any) => ({
      id: section.id,
      label: section.label,
      fields: convertSchemaPropertiesToFields(
        section.schema?.properties || {},
        section.schema?.required || []
      ),
      required: section.required,
    })),
  };
};

/**
 * Convert JSON schema properties to field definitions
 */
const convertSchemaPropertiesToFields = (
  properties: any,
  requiredFields: string[]
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
    };

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
        property.items.required || []
      );
    }

    // Handle object fields
    if (property.type === "object" && property.properties) {
      field.objectFields = convertSchemaPropertiesToFields(
        property.properties,
        property.required || []
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
