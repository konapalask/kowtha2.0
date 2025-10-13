import {faker} from '@faker-js/faker';
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
        },
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
    const itemCount = faker.number.int({min: 1, max: 2});
    return Array.from({length: itemCount}, () =>
      generateObjectValue(fieldSchema.items),
    );
  }

  // Handle objects
  if (fieldSchema.type === 'object' && fieldSchema.properties) {
    return generateObjectValue(fieldSchema);
  }

  // Generate based on field name (smart generation)
  const fieldName = (fieldSchema.title || fieldId).toLowerCase();

  // Business/Company/Firm/Entity name (check first before general name)
  if (
    fieldName.includes('business') ||
    fieldName.includes('company') ||
    fieldName.includes('concern') ||
    fieldName.includes('firm') ||
    fieldName.includes('entity')
  ) {
    return faker.company.name();
  }

  // Bank Name (check before general name)
  if (fieldName.includes('bank') && fieldName.includes('name')) {
    return faker.helpers.arrayElement([
      'HDFC Bank',
      'ICICI Bank',
      'State Bank of India',
      'Axis Bank',
      'Kotak Mahindra Bank',
      'Punjab National Bank',
    ]);
  }

  // Name fields (person names)
  if (fieldName.includes('name')) {
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
  if (fieldName.includes('address') || fieldName.includes('location')) {
    return faker.location.streetAddress({useFullAddress: true});
  }

  // Date fields
  if (fieldSchema.format === 'date' || fieldName.includes('date')) {
    return faker.date.past({years: 5}).toISOString().split('T')[0];
  }

  // Year fields (business started, etc.)
  if (fieldName.includes('year') && !fieldName.includes('years')) {
    return faker.number.int({min: 2000, max: 2020});
  }

  // Years/Experience fields
  if (fieldName.includes('years') || fieldName.includes('experience')) {
    return faker.number.int({min: 2, max: 20});
  }

  // Amount/Salary/Income/Rent/EMI/Value fields
  if (
    fieldName.includes('amount') ||
    fieldName.includes('salary') ||
    fieldName.includes('income') ||
    fieldName.includes('rent') ||
    fieldName.includes('emi') ||
    fieldName.includes('value') ||
    fieldName.includes('margin') ||
    fieldName.includes('profit') ||
    fieldName.includes('tenure')
  ) {
    const numValue = faker.number.int({min: 10000, max: 1000000});
    // Return as string if field type is string, otherwise return number
    return fieldSchema.type === 'string' ? numValue.toString() : numValue;
  }

  // Employee/Footfall count fields
  if (fieldName.includes('employee') || fieldName.includes('number')) {
    return faker.number.int({min: 1, max: 20});
  }

  // Age fields
  if (fieldName.includes('age')) {
    return faker.number.int({min: 18, max: 65});
  }

  // City/Town fields
  if (fieldName.includes('city') || fieldName.includes('town')) {
    return faker.location.city();
  }

  // State/Region fields
  if (fieldName.includes('state') || fieldName.includes('region')) {
    return faker.location.state();
  }

  // Branch fields
  if (fieldName.includes('branch')) {
    return faker.location.city() + ' Branch';
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

  // GST fields
  if (fieldName.includes('gst') || fieldName.includes('gstin')) {
    return faker.string.numeric(15);
  }

  // Nature/Type of business
  if (fieldName.includes('nature') || fieldName.includes('type of business')) {
    return faker.helpers.arrayElement([
      'Retail Trading',
      'Manufacturing',
      'Wholesale Trading',
      'Services',
      'Distribution',
    ]);
  }

  // Occupation
  if (fieldName.includes('occupation') || fieldName.includes('profession')) {
    return faker.person.jobTitle();
  }

  // Qualification/Education
  if (fieldName.includes('qualification') || fieldName.includes('education')) {
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

  // Constitution/Ownership
  if (fieldName.includes('constitution') || fieldName.includes('ownership')) {
    return faker.helpers.arrayElement([
      'Proprietorship',
      'Partnership',
      'Private Limited',
      'LLP',
      'Owned',
      'Rented',
    ]);
  }

  // Account Type
  if (fieldName.includes('account type')) {
    return faker.helpers.arrayElement(['Savings', 'Current', 'CC/OD']);
  }

  // Account Number
  if (fieldName.includes('account') && fieldName.includes('no')) {
    return faker.string.numeric(12);
  }

  // Type of Loan
  if (
    fieldName.includes('type') &&
    (fieldName.includes('loan') || fieldName.includes('product'))
  ) {
    return faker.helpers.arrayElement([
      'Business Loan',
      'Home Loan',
      'Vehicle Loan',
      'Personal Loan',
      'Working Capital',
    ]);
  }

  // Asset Type
  if (fieldName.includes('asset') && fieldName.includes('type')) {
    return faker.helpers.arrayElement([
      'Residential Property',
      'Commercial Property',
      'Land',
      'Vehicle',
      'Machinery',
      'Gold',
    ]);
  }

  // Purpose/Details/Observations/Feedback/Recommendations - longer text fields
  if (
    fieldName.includes('purpose') ||
    fieldName.includes('about') ||
    fieldName.includes('details') ||
    fieldName.includes('observation') ||
    fieldName.includes('activity') ||
    fieldName.includes('feedback') ||
    fieldName.includes('comfort') ||
    fieldName.includes('discomfort') ||
    fieldName.includes('recommendation') ||
    fieldName.includes('disclaimer')
  ) {
    return faker.lorem.sentence({min: 10, max: 20});
  }

  // Met/Person fields
  if (fieldName.includes('met') || fieldName.includes('person')) {
    return faker.person.fullName();
  }

  // Default based on type
  switch (fieldSchema.type) {
    case 'string':
      return faker.lorem.words(3);
    case 'number':
    case 'integer':
      return faker.number.int({min: 1, max: 100000});
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
      },
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
export function validateGeneratedData(
  data: any,
  schema: any,
): {
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
          errors.push(`Missing required field: ${section.id}.${fieldId}`);
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
