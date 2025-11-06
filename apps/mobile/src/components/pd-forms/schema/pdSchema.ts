import {getPDSchema} from '../../../services/field.services';

export interface MobileFieldDefinition {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface MobileSectionDefinition {
  id: string;
  label: string;
  fields: MobileFieldDefinition[];
}

export interface MobileFormDefinition {
  id: string;
  name: string;
  sections: MobileSectionDefinition[];
}

export interface MobileGeneratedSchema {
  version: string;
  generated_at: string;
  source_file: string;
  forms: MobileFormDefinition[];
}

let cachedSchema: Record<string, any> = {};

/**
 * Clear schema cache for a specific bank or all banks
 * Useful for development/testing when schema changes
 */
export function clearSchemaCache(bankName?: string): void {
  if (bankName) {
    delete cachedSchema[bankName];
    console.log(`✓ Schema cache cleared for: ${bankName}`);
  } else {
    cachedSchema = {};
    console.log('✓ Schema cache cleared for all banks');
  }
}

export async function loadMobilePDFormsSchema(
  templateName: string,
  forceRefresh: boolean = false,
): Promise<any | null> {
  if (cachedSchema[templateName] && !forceRefresh) {
    return cachedSchema[templateName];
  }

  try {
    // Fetch schema from backend API (single source of truth)
    console.log('Fetching PD schema from backend for template:', templateName);
    const response = await getPDSchema(templateName);

    // Backend returns: { status, message, data: { bankName, schema, metadata } }
    const backendData = response.data?.data;

    if (backendData && backendData.schema) {
      // Cache and return the schema
      cachedSchema[templateName] = backendData.schema;
      console.log(
        '✓ PD schema loaded from backend successfully:',
        templateName,
      );
      return backendData.schema;
    }

    throw new Error(
      `No schema data received from backend for: ${templateName}`,
    );
  } catch (error: any) {
    console.error(
      'Failed to fetch schema from backend:',
      error.message || error,
    );
    return null;
  }
}
