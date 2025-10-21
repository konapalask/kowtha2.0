import { WebFormDefinition, WebSectionDefinition, WebFieldDefinition, WebArrayItemDefinition } from '@/types/webSchema';

export function convertMobileSchemaToWeb(mobileSchema: any): WebFormDefinition {
  const sections: WebSectionDefinition[] = mobileSchema.sections.map((section: any) => {
    // Preserve field order if fieldOrder is provided (from generated schema)
    const fieldOrder = section.schema.fieldOrder || Object.keys(section.schema.properties || {});
    
    const fields: WebFieldDefinition[] = fieldOrder.map((key: string) => {
      const prop = section.schema.properties?.[key];
      if (!prop) return null;
      
      const field: WebFieldDefinition = {
        id: key,
        label: prop.title || key,
        type: getWebFieldType(prop),
        required: section.schema.required?.includes(key) || false,
        readOnly: prop.readOnly || false,
        placeholder: prop.title || key,
      };

      // Add options for select fields
      if (prop.enum) {
        field.options = prop.enum;
      }

      // Extract array item fields for array type
      if (prop.type === 'array' && prop.items && prop.items.properties) {
        const arrayItemFields: WebFieldDefinition[] = [];
        const itemProperties = prop.items.properties;
        const itemRequired = prop.items.required || [];
        
        Object.keys(itemProperties).forEach((itemKey) => {
          const itemProp = itemProperties[itemKey];
          arrayItemFields.push({
            id: itemKey,
            label: itemProp.title || itemKey,
            type: getWebFieldType(itemProp),
            required: itemRequired.includes(itemKey),
            readOnly: itemProp.readOnly || false,
            placeholder: itemProp.title || itemKey,
            options: itemProp.enum || undefined,
          });
        });
        
        field.arrayItemFields = arrayItemFields;
      }

      // Extract object fields for object type
      if (prop.type === 'object' && prop.properties) {
        const objectFields: WebFieldDefinition[] = [];
        const objectProperties = prop.properties;
        const objectRequired = prop.required || [];
        
        Object.keys(objectProperties).forEach((objectKey) => {
          const objectProp = objectProperties[objectKey];
          objectFields.push({
            id: objectKey,
            label: objectProp.title || objectKey,
            type: getWebFieldType(objectProp),
            required: objectRequired.includes(objectKey),
            readOnly: objectProp.readOnly || false,
            placeholder: objectProp.title || objectKey,
            options: objectProp.enum || undefined,
          });
        });
        
        field.objectFields = objectFields;
      }

      // Add validation rules
      if (prop.pattern) {
        field.validation = { pattern: prop.pattern };
      }

      if (prop.minimum !== undefined) {
        field.validation = { ...field.validation, min: prop.minimum };
      }

      if (prop.maximum !== undefined) {
        field.validation = { ...field.validation, max: prop.maximum };
      }

      if (prop.minLength !== undefined) {
        field.validation = { ...field.validation, minLength: prop.minLength };
      }

      if (prop.maxLength !== undefined) {
        field.validation = { ...field.validation, maxLength: prop.maxLength };
      }

      return field;
    }).filter((field: WebFieldDefinition | null): field is WebFieldDefinition => field !== null); // Filter out null fields

    return {
      id: section.id,
      label: section.label,
      fields,
      required: section.required || false,
      collapsible: true,
      defaultExpanded: section.id === 'basicDetails' || section.id === 'general', // Expand first section by default
    };
  });

  return {
    id: mobileSchema.id.toString(),
    name: mobileSchema.bankName,
    sections,
    version: '1.0',
  };
}

function getWebFieldType(prop: any): WebFieldDefinition['type'] {
  if (prop.enum) return 'select';
  if (prop.type === 'integer' || prop.type === 'number') return 'number';
  if (prop.type === 'boolean') return 'boolean';
  if (prop.type === 'array') return 'array';
  if (prop.type === 'object') return 'object';
  if (prop.format === 'date' || prop.type === 'date') return 'date';
  return 'text';
}

export function getArrayItemDefinition(field: WebFieldDefinition): WebArrayItemDefinition[] {
  // This would be defined based on the specific array field type
  // For now, return a generic structure
  return [
    {
      id: 'item',
      label: 'Item',
      type: 'text',
      required: true,
    }
  ];
}

// Helper function to validate non-empty strings
function validateNonEmpty(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    // Check if string has at least one non-whitespace character
    return value.trim().length > 0;
  }
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  return true; // For other types, consider them valid
}

export function validateFormData(formData: any, schema: WebFormDefinition): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  schema.sections.forEach(section => {
    if (section.required && (!formData[section.id] || Object.keys(formData[section.id] || {}).length === 0)) {
      errors.push(`${section.label} is required`);
    }

    section.fields.forEach(field => {
      if (field.required) {
        const value = formData[section.id]?.[field.id];
        if (!validateNonEmpty(value)) {
          errors.push(`Please enter at least one character for: ${field.label}`);
        }
      }

      // Additional validation based on field type
      if (field.validation) {
        const value = formData[section.id]?.[field.id];
        if (value !== undefined && value !== null && value !== '') {
          if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
            errors.push(`${field.label} format is invalid`);
          }
          if (field.validation.min && Number(value) < field.validation.min) {
            errors.push(`${field.label} must be at least ${field.validation.min}`);
          }
          if (field.validation.max && Number(value) > field.validation.max) {
            errors.push(`${field.label} must be at most ${field.validation.max}`);
          }
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
