import * as RNFS from 'react-native-fs';
// @ts-ignore - forms.js doesn't have TypeScript definitions
import {formSchema, getFormConfigByBank} from '../../../../forms';

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

export async function loadMobilePDFormsSchema(
  bankName: string,
): Promise<any | null> {
  if (cachedSchema[bankName]) return cachedSchema[bankName];

  try {
    // Option 1: Read from file system using RNFS (React Native compatible)
    const schemaPath =
      RNFS.MainBundlePath + '/../packages/shared/pd_forms.generated.json';
    const schemaContent = await RNFS.readFile(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent) as MobileGeneratedSchema;

    // Find the specific bank form from the schema
    const bankForm = schema.forms.find(
      f => f.name.toLowerCase() === bankName.toLowerCase(),
    );

    if (bankForm) {
      cachedSchema[bankName] = bankForm;
      return bankForm;
    }

    throw new Error(`Bank form not found for: ${bankName}`);
  } catch (error) {
    console.warn(
      'Failed to load schema from file system, trying remote fetch:',
      error,
    );

    try {
      // Option 2: Fetch from backend API (fallback)
      const response = await fetch(
        `/api/pd-schema/${encodeURIComponent(bankName)}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const schema = await response.json();
      cachedSchema[bankName] = schema;
      return schema;
    } catch (fetchError) {
      console.error('Failed to fetch schema from backend:', fetchError);

      // Option 3: Fallback to local formSchema from forms.js
      console.warn('Falling back to local formSchema for bank:', bankName);
      const localForm = getFormConfigByBank(bankName);

      if (localForm) {
        cachedSchema[bankName] = localForm;
        return localForm;
      }

      return null;
    }
  }
}
