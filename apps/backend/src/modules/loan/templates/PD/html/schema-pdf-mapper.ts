/**
 * Schema-PDF Mapper
 * Maps schema definitions to PDF template rendering requirements
 * Single source of truth: Schema defines what's required
 */

export interface SchemaFieldRequirement {
  [sectionId: string]: {
    [fieldId: string]: boolean; // true = required, false = optional
  };
}

/**
 * Extract field requirements from schema
 * Returns a map of section -> field -> isRequired
 */
export function extractFieldRequirements(schema: any): SchemaFieldRequirement {
  const requirements: SchemaFieldRequirement = {};

  if (!schema?.sections) {
    return requirements;
  }

  for (const section of schema.sections) {
    const sectionId = section.id;
    requirements[sectionId] = {};

    // Get required fields for this section
    const requiredFields = section.schema?.required || [];

    // Get all properties
    const properties = section.schema?.properties || {};

    // Map each field to its required status
    for (const fieldId of Object.keys(properties)) {
      requirements[sectionId][fieldId] = requiredFields.includes(fieldId);
    }
  }

  return requirements;
}

/**
 * Check if a specific field is required based on schema
 */
export function isFieldRequired(
  requirements: SchemaFieldRequirement,
  sectionId: string,
  fieldId: string
): boolean {
  return requirements[sectionId]?.[fieldId] ?? false;
}

/**
 * Helper function for PDF templates to display values with schema-driven indicators
 */
export function displayFieldValue(
  value: any,
  requirements: SchemaFieldRequirement,
  sectionId: string,
  fieldId: string
): string {
  const isEmpty = value === null || value === undefined || value === "";
  const isRequired = isFieldRequired(requirements, sectionId, fieldId);

  if (isEmpty) {
    if (isRequired) {
      return '<span style="color: #d32f2f; font-style: italic; font-weight: 500;">Not Provided *</span>';
    }
    return '<span style="color: #666; font-style: italic;">Not Provided</span>';
  }

  return String(value);
}

/**
 * Get HTML for required indicator (*)
 */
export function getRequiredIndicator(
  requirements: SchemaFieldRequirement,
  sectionId: string,
  fieldId: string
): string {
  const isRequired = isFieldRequired(requirements, sectionId, fieldId);
  return isRequired ? '<span style="color: #d32f2f;">*</span>' : "";
}
