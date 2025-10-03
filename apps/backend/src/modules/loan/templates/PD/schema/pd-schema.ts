import * as fs from 'fs';
import * as path from 'path';

export interface PDFFieldDefinition {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface PDFSectionDefinition {
  id: string;
  label: string;
  fields: PDFFieldDefinition[];
}

export interface PDFFormDefinition {
  id: string; // e.g., axis_finance_ubl_above_10l
  name: string;
  sections: PDFSectionDefinition[];
}

export interface GeneratedPDFormsSchema {
  version: string;
  generated_at: string;
  source_file: string;
  forms: PDFFormDefinition[];
}

let cachedSchema: GeneratedPDFormsSchema | null = null;

function candidatePaths(): string[] {
  const candidates: string[] = [];
  // Monorepo root when running from repo root
  candidates.push(path.resolve(process.cwd(), 'packages/shared/pd_forms.generated.json'));
  // When running compiled code from dist folder (approximate relative hops)
  candidates.push(path.resolve(__dirname, '../../../../../../../packages/shared/pd_forms.generated.json'));
  // Fallback: relative to apps/backend
  candidates.push(path.resolve(__dirname, '../../../../../packages/shared/pd_forms.generated.json'));
  return candidates;
}

export function loadPDFormsSchema(): GeneratedPDFormsSchema {
  if (cachedSchema) return cachedSchema;
  const candidates = candidatePaths();
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const content = fs.readFileSync(candidate, 'utf-8');
        const parsed = JSON.parse(content) as GeneratedPDFormsSchema;
        cachedSchema = parsed;
        return parsed;
      }
    } catch {
      // try next candidate
    }
  }
  throw new Error('pd_forms.generated.json not found. Checked: ' + candidates.join(' | '));
}

export function getFormById(formId: string): PDFFormDefinition | undefined {
  const schema = loadPDFormsSchema();
  return schema.forms.find(f => f.id === formId);
}

export function resolveAxisUBLVariant(_bankName: string | null | undefined, _loanAmount: number | null | undefined): string {
  // KISS: default to above 10L variant as per current requirement
  return 'axis_finance_ubl_above_10l';
}


