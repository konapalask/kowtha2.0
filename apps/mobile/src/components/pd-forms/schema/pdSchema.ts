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
  bankName: string,
  forceRefresh: boolean = false,
): Promise<any | null> {
  if (cachedSchema[bankName] && !forceRefresh) {
    return cachedSchema[bankName];
  }

  try {
    // Fetch schema from backend API (single source of truth)
    console.log('Fetching PD schema from backend for bank:', bankName);
    const response = await getPDSchema(bankName);

    // Backend returns: { status, message, data: { bankName, schema, metadata } }
    const backendData = response.data?.data;

    if (backendData && backendData.schema) {
      // Cache and return the schema
      cachedSchema[bankName] = backendData.schema;
      console.log('✓ PD schema loaded from backend successfully:', bankName);
      return backendData.schema;
    }

    throw new Error(`No schema data received from backend for: ${bankName}`);
  } catch (error: any) {
    console.error(
      'Failed to fetch schema from backend:',
      error.message || error,
    );
    return null;
  }
}
