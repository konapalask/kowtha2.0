/**
 * Template Validator - Validates data against schema and detects mismatches
 * Helps identify issues in data flow: Mobile -> Backend -> Database -> PDF
 */

export interface ValidationResult {
  isValid: boolean;
  missingRequiredFields: string[];
  unexpectedFields: string[];
  typeMismatches: string[];
  emptyRequiredFields: string[];
}

export interface SchemaField {
  name: string;
  type: string;
  required?: boolean;
  properties?: SchemaField[];
}

/**
 * Validates verification data against expected schema structure
 */
export function validateVerificationData(
  data: any,
  schema: any,
  bankName: string,
  enableDebugLogs: boolean = false
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    missingRequiredFields: [],
    unexpectedFields: [],
    typeMismatches: [],
    emptyRequiredFields: [],
  };

  if (!data || typeof data !== "object") {
    result.isValid = false;
    result.missingRequiredFields.push(
      "verificationData is null or not an object"
    );
    return result;
  }

  if (enableDebugLogs) {
    console.log(`\n[${bankName}] Validation Report:`);
    console.log("-".repeat(60));
  }

  // Check for missing or empty required sections
  const requiredSections =
    schema.sections?.filter((s: any) => s.required).map((s: any) => s.id) || [];

  for (const sectionId of requiredSections) {
    if (!data[sectionId]) {
      result.missingRequiredFields.push(sectionId);
      result.isValid = false;
      if (enableDebugLogs) {
        console.log(`Missing required section: ${sectionId}`);
      }
    } else if (
      typeof data[sectionId] === "object" &&
      Object.keys(data[sectionId]).length === 0
    ) {
      result.emptyRequiredFields.push(sectionId);
      result.isValid = false;
      if (enableDebugLogs) {
        console.log(`Empty required section: ${sectionId}`);
      }
    } else {
      // Check for missing required properties within the section
      const section = schema.sections.find((s: any) => s.id === sectionId);
      if (section?.schema?.required) {
        const missingProps = section.schema.required.filter(
          (prop: string) =>
            !data[sectionId][prop] || data[sectionId][prop] === ""
        );
        if (missingProps.length > 0) {
          missingProps.forEach((prop: string) => {
            result.emptyRequiredFields.push(`${sectionId}.${prop}`);
            if (enableDebugLogs) {
              console.log(`Empty required field: ${sectionId}.${prop}`);
            }
          });
          result.isValid = false;
        }
      }

      // Log section presence
      if (enableDebugLogs) {
        console.log(
          `Section present: ${sectionId} (${Object.keys(data[sectionId]).length} fields)`
        );
      }
    }
  }

  // Check for unexpected sections (may indicate schema-template mismatch)
  const expectedSections = schema.sections?.map((s: any) => s.id) || [];
  const actualSections = Object.keys(data).filter(
    (key) => key !== "uploadedItems"
  );

  for (const sectionId of actualSections) {
    if (!expectedSections.includes(sectionId)) {
      result.unexpectedFields.push(sectionId);
      if (enableDebugLogs) {
        console.log(
          `Unexpected section in data: ${sectionId} (not in schema)`
        );
      }
    }
  }

  // Summary
  if (enableDebugLogs) {
    console.log("-".repeat(60));
    if (result.isValid) {
      console.log("Validation passed");
    } else {
      console.log("Validation failed");
      if (result.missingRequiredFields.length > 0) {
        console.log(
          `Missing sections: ${result.missingRequiredFields.join(", ")}`
        );
      }
      if (result.emptyRequiredFields.length > 0) {
        console.log(
          `Empty required fields: ${result.emptyRequiredFields.join(", ")}`
        );
      }
    }
    console.log("-".repeat(60) + "\n");
  }

  return result;
}

/**
 * Logs detailed data structure for debugging schema-template mismatches
 */
export function logDataStructure(data: any, label: string = "Data"): void {
  console.log(`\n[${label}] Structure:`);
  console.log("-".repeat(60));

  if (!data || typeof data !== "object") {
    console.log("Data is null or not an object");
    return;
  }

  function printStructure(obj: any, indent: string = ""): void {
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        console.log(`${indent}${key}: null/undefined`);
      } else if (Array.isArray(value)) {
        console.log(`${indent}${key}: Array[${value.length}]`);
        if (value.length > 0 && typeof value[0] === "object") {
          console.log(
            `${indent}  |- Item structure: ${JSON.stringify(Object.keys(value[0]))}`
          );
        }
      } else if (typeof value === "object") {
        console.log(
          `${indent}${key}: Object {${Object.keys(value).length} props}`
        );
        printStructure(value, indent + "  |- ");
      } else {
        const valueStr = String(value).substring(0, 50);
        console.log(
          `${indent}${key}: ${typeof value} = "${valueStr}${String(value).length > 50 ? "..." : ""}"`
        );
      }
    }
  }

  printStructure(data);
  console.log("-".repeat(60) + "\n");
}
