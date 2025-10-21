/**
 * Adapter to convert pd_forms.generated.json format to forms.js format
 * This ensures compatibility with existing conversion logic
 */

interface GeneratedField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

interface GeneratedSection {
  id: string;
  label: string;
  fields: GeneratedField[];
}

interface GeneratedForm {
  id: string;
  name: string;
  sections: GeneratedSection[];
}

interface GeneratedSchema {
  version: string;
  generated_at: string;
  source_file: string;
  forms: GeneratedForm[];
}

/**
 * Convert generated JSON format to forms.js format
 * Generated format has simpler structure, we need to convert to JSON Schema format
 */
export function convertGeneratedToFormsFormat(generatedSchema: GeneratedSchema): any[] {
  return generatedSchema.forms.map((form, index) => {
    return {
      id: index + 1,
      bankName: form.name,
      sections: form.sections.map(section => {
        // Convert fields array to properties object (JSON Schema format)
        const properties: any = {};
        const required: string[] = [];

        section.fields.forEach(field => {
          // Map field type from simple type to JSON Schema type
          let fieldType = 'string';
          let fieldFormat: string | undefined;
          
          switch (field.type.toLowerCase()) {
            case 'number':
            case 'integer':
              fieldType = 'integer';
              break;
            case 'date':
              fieldType = 'string';
              fieldFormat = 'date';
              break;
            case 'select':
            case 'dropdown':
              fieldType = 'string';
              // Note: enum values would need to be provided separately
              break;
            case 'boolean':
            case 'checkbox':
              fieldType = 'boolean';
              break;
            case 'textarea':
            case 'text':
            default:
              fieldType = 'string';
          }

          properties[field.id] = {
            type: fieldType,
            title: field.label,
            ...(fieldFormat && { format: fieldFormat }),
          };

          if (field.required) {
            required.push(field.id);
          }
        });

        return {
          id: section.id,
          label: section.label,
          schema: {
            type: 'object',
            properties,
            ...(required.length > 0 && { required }),
            // Preserve field order from generated JSON
            fieldOrder: section.fields.map(f => f.id),
          },
          required: false, // Section level requirement - can be configured
        };
      }),
    };
  });
}

/**
 * Get supported bank names from generated schema
 */
export function getSupportedBanksFromGenerated(generatedSchema: GeneratedSchema): string[] {
  return generatedSchema.forms.map(form => form.name);
}

