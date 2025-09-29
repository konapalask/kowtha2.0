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
  // In React Native, we don't have direct FS access to monorepo path; for pilot, expect schema to be bundled at runtime via remote fetch or inline import.
  // KISS: for now, return a minimal placeholder; PD.tsx will fallback to existing components if not available.
  return {
    version: '1.0',
    generated_at: '',
    source_file: '',
    forms: [],
  };
}

export function resolveAxisUBLVariant(): string {
  return 'axis_finance_ubl_above_10l';
}


