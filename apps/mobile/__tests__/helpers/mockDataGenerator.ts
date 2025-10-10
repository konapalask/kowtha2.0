import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';

/**
 * Configure json-schema-faker with faker.js
 */
jsf.extend('faker', () => faker);
jsf.option({
  alwaysFakeOptionals: true,
  useDefaultValue: true,
  useExamplesValue: true,
  minItems: 1,
  maxItems: 3,
});

/**
 * Generate mock data from a JSON schema section
 */
export function generateMockDataFromSchema(schema: any): any {
  if (!schema || !schema.sections) {
    throw new Error('Invalid schema: sections not found');
  }

  const mockData: any = {};

  schema.sections.forEach((section: any) => {
    const sectionData: any = {};

    if (section.schema && section.schema.properties) {
      Object.entries(section.schema.properties).forEach(
        ([fieldId, fieldSchema]: [string, any]) => {
          sectionData[fieldId] = generateFieldValue(fieldId, fieldSchema);
        }
      );
    }

    mockData[section.id] = sectionData;
  });

  return mockData;
}

/**
 * Generate a single field value based on schema and field name
 */
function generateFieldValue(fieldId: string, fieldSchema: any): any {
  // Handle enum (dropdown) - pick first option
  if (fieldSchema.enum && fieldSchema.enum.length > 0) {
    return fieldSchema.enum[0];
  }

  // Handle arrays
  if (fieldSchema.type === 'array' && fieldSchema.items) {
    const itemCount = faker.number.int({ min: 1, max: 2 });
    return Array.from({ length: itemCount }, () =>
      generateObjectValue(fieldSchema.items)
    );
  }

  // Handle objects
  if (fieldSchema.type === 'object' && fieldSchema.properties) {
    return generateObjectValue(fieldSchema);
  }

  // Generate based on field name (smart generation)
  const fieldName = (fieldSchema.title || fieldId).toLowerCase();

  // Name fields
  if (
    fieldName.includes('name') &&
    !fieldName.includes('concern') &&
    !fieldName.includes('business')
  ) {
    return faker.person.fullName();
  }

  // Phone/Mobile fields
  if (fieldName.includes('phone') || fieldName.includes('mobile')) {
    return '9' + faker.string.numeric(9);
  }

  // Email fields
  if (fieldName.includes('email')) {
    return faker.internet.email();
  }

  // Address fields
  if (fieldName.includes('address')) {
    return faker.location.streetAddress({ useFullAddress: true });
  }

  // Date fields
  if (fieldSchema.format === 'date' || fieldName.includes('date')) {
    return faker.date.past({ years: 5 }).toISOString().split('T')[0];
  }

  // Amount/Salary/Income fields
  if (
    fieldName.includes('amount') ||
    fieldName.includes('salary') ||
    fieldName.includes('income')
  ) {
    return faker.number.int({ min: 10000, max: 1000000 });
  }

  // Age fields
  if (fieldName.includes('age')) {
    return faker.number.int({ min: 18, max: 65 });
  }

  // City/Town fields
  if (fieldName.includes('city') || fieldName.includes('town')) {
    return faker.location.city();
  }

  // State fields
  if (fieldName.includes('state')) {
    return faker.location.state();
  }

  // Pincode fields
  if (fieldName.includes('pincode') || fieldName.includes('pin')) {
    return faker.string.numeric(6);
  }

  // PAN fields
  if (fieldName.includes('pan')) {
    return 'ABCDE1234F';
  }

  // Aadhaar fields
  if (fieldName.includes('aadhaar') || fieldName.includes('aadhar')) {
    return faker.string.numeric(12);
  }

  // Business/Company name
  if (
    fieldName.includes('business') ||
    fieldName.includes('company') ||
    fieldName.includes('concern')
  ) {
    return faker.company.name();
  }

  // Occupation
  if (fieldName.includes('occupation') || fieldName.includes('profession')) {
    return faker.person.jobTitle();
  }

  // Qualification/Education
  if (
    fieldName.includes('qualification') ||
    fieldName.includes('education')
  ) {
    return faker.helpers.arrayElement([
      'Graduate',
      'Post Graduate',
      'Under Graduate',
      '12th',
      '10th',
    ]);
  }

  // Relation
  if (fieldName.includes('relation')) {
    return faker.helpers.arrayElement([
      'Father',
      'Mother',
      'Spouse',
      'Son',
      'Daughter',
      'Brother',
      'Sister',
    ]);
  }

  // Constitution
  if (fieldName.includes('constitution')) {
    return faker.helpers.arrayElement([
      'Proprietorship',
      'Partnership',
      'Private Limited',
      'LLP',
    ]);
  }

  // Default based on type
  switch (fieldSchema.type) {
    case 'string':
      return faker.lorem.words(3);
    case 'number':
    case 'integer':
      return faker.number.int({ min: 1, max: 100000 });
    case 'boolean':
      return faker.datatype.boolean();
    default:
      return faker.lorem.word();
  }
}

/**
 * Generate object value from object schema
 */
function generateObjectValue(objectSchema: any): any {
  const obj: any = {};

  if (objectSchema.properties) {
    Object.entries(objectSchema.properties).forEach(
      ([fieldId, fieldSchema]: [string, any]) => {
        obj[fieldId] = generateFieldValue(fieldId, fieldSchema);
      }
    );
  }

  return obj;
}

/**
 * Generate mock data using json-schema-faker (alternative approach)
 */
export function generateMockDataWithJSF(schema: any): any {
  try {
    return jsf.generate(schema);
  } catch (error) {
    console.error('Error generating mock data with JSF:', error);
    // Fallback to custom generator
    return generateMockDataFromSchema(schema);
  }
}

/**
 * Validate that generated data matches schema requirements
 */
export function validateGeneratedData(data: any, schema: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  schema.sections?.forEach((section: any) => {
    const sectionData = data[section.id];

    if (!sectionData && section.required) {
      errors.push(`Missing required section: ${section.id}`);
      return;
    }

    // Check required fields
    if (section.schema?.required) {
      section.schema.required.forEach((fieldId: string) => {
        if (
          !sectionData[fieldId] &&
          sectionData[fieldId] !== 0 &&
          sectionData[fieldId] !== false
        ) {
          errors.push(
            `Missing required field: ${section.id}.${fieldId}`
          );
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

