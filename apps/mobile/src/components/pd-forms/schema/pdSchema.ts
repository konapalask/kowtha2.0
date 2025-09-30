import * as RNFS from 'react-native-fs';

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

let cachedSchema: MobileGeneratedSchema | null = null;

export async function loadMobilePDFormsSchema(): Promise<MobileGeneratedSchema> {
  if (cachedSchema) return cachedSchema;

  try {
    // Option 1: Read from file system using RNFS (React Native compatible)
    const schemaPath =
      RNFS.MainBundlePath + '/../packages/shared/pd_forms.generated.json';
    const schemaContent = await RNFS.readFile(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent) as MobileGeneratedSchema;
    cachedSchema = schema;
    return schema;
  } catch (error) {
    console.warn(
      'Failed to load schema from file system, trying remote fetch:',
      error,
    );

    try {
      // Option 2: Fetch from backend API (fallback)
      const response = await fetch('/api/pd-schema');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const schema = (await response.json()) as MobileGeneratedSchema;
      cachedSchema = schema;
      return schema;
    } catch (fetchError) {
      console.error('Failed to fetch schema from backend:', fetchError);

      // Option 3: Return minimal placeholder (current behavior)
      console.warn('Falling back to empty schema - using existing components');
      return {
        version: '1.0',
        generated_at: '',
        source_file: '',
        forms: [],
      };
    }
  }
}

export function resolveAxisUBLVariant(): string {
  return 'axis_finance_ubl_above_10l';
}
