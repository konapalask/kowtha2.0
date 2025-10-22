import {faker} from '@faker-js/faker';

/**
 * Generate mock data from a JSON schema section
 */
export function generateMockDataFromSchema(schema: any): any {
  if (!schema || !schema.sections) {
    throw new Error('Invalid schema: sections not found');
  }

  const mockData: any = {};

  schema.sections.forEach((section: any) => {
    let sectionData: any = {};

    // Handle different section types
    if (section.schema?.type === 'array') {
      // Handle array sections
      const itemCount = faker.number.int({min: 1, max: 3});
      sectionData = Array.from({length: itemCount}, () => {
        if (section.schema.items?.properties) {
          const itemData: any = {};
          Object.entries(section.schema.items.properties).forEach(
            ([fieldId, fieldSchema]: [string, any]) => {
              itemData[fieldId] = generateFieldValue(fieldId, fieldSchema);
            },
          );
          return itemData;
        }
        return generateObjectValue(section.schema.items || {});
      });
    } else if (section.schema?.properties) {
      // Handle object sections
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
  // Handle enum (dropdown) - pick random option instead of first
  if (fieldSchema.enum && fieldSchema.enum.length > 0) {
    return faker.helpers.arrayElement(fieldSchema.enum);
  }

  // Handle arrays
  if (fieldSchema.type === 'array' && fieldSchema.items) {
    const itemCount = faker.number.int({min: 1, max: 3});
    return Array.from({length: itemCount}, () =>
      generateObjectValue(fieldSchema.items),
    );
  }

  // Handle objects
  if (fieldSchema.type === 'object' && fieldSchema.properties) {
    return generateObjectValue(fieldSchema);
  }

  // Handle read-only fields - return empty or default values
  if (fieldSchema.readOnly) {
    switch (fieldSchema.type) {
      case 'string':
        return fieldId.toLowerCase().includes('name')
          ? faker.person.fullName()
          : '';
      case 'number':
      case 'integer':
        return fieldId.toLowerCase().includes('amount')
          ? faker.number.int({min: 100000, max: 5000000})
          : 0;
      default:
        return '';
    }
  }

  // Handle pattern-based validation (like phone numbers)
  if (fieldSchema.pattern) {
    if (fieldSchema.pattern.includes('^[0-9]{10}$')) {
      // Indian mobile number pattern
      return '9' + faker.string.numeric(9);
    }
    if (fieldSchema.pattern.includes('[0-9]')) {
      return faker.string.numeric(10);
    }
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

  // Coordinates and GPS fields
  if (fieldName.includes('latitude') || fieldName.includes('lat')) {
    return faker.number
      .float({min: 8.0, max: 37.0, fractionDigits: 6})
      .toString();
  }
  if (fieldName.includes('longitude') || fieldName.includes('lng')) {
    return faker.number
      .float({min: 68.0, max: 97.0, fractionDigits: 6})
      .toString();
  }
  if (fieldName.includes('coordinates')) {
    const lat = faker.number.float({min: 8.0, max: 37.0, fractionDigits: 6});
    const lng = faker.number.float({min: 68.0, max: 97.0, fractionDigits: 6});
    return `${lat},${lng}`;
  }

  // Application and Reference IDs
  if (
    fieldId.toLowerCase().includes('applicationno') ||
    fieldId.toLowerCase().includes('applicationid')
  ) {
    return faker.string.alphanumeric(8).toUpperCase();
  }
  if (fieldName.includes('reference') || fieldName.includes('ref')) {
    return 'REF' + faker.string.numeric(6);
  }

  // Contact and Communication fields
  if (
    fieldName.includes('contact') &&
    (fieldName.includes('number') || fieldName.includes('mobile'))
  ) {
    return '9' + faker.string.numeric(9);
  }
  if (fieldName.includes('landline')) {
    return faker.string.numeric(10);
  }

  // Time and Duration fields
  if (fieldName.includes('time') || fieldName.includes('duration')) {
    return faker.date
      .recent({days: 30})
      .toISOString()
      .split('T')[1]
      .split('.')[0];
  }

  // Distance fields
  if (fieldName.includes('distance')) {
    return faker.number.int({min: 1, max: 50}) + ' km';
  }

  // Status and Yes/No fields
  if (fieldName.includes('status')) {
    return faker.helpers.arrayElement([
      'Active',
      'Pending',
      'Completed',
      'Approved',
      'Rejected',
    ]);
  }
  if (fieldName.includes('yes') || fieldName.includes('no')) {
    return faker.helpers.arrayElement(['Yes', 'No']);
  }

  // Property and Real Estate fields
  if (fieldName.includes('property') && fieldName.includes('area')) {
    return faker.number.int({min: 500, max: 5000}) + ' sq ft';
  }
  if (
    fieldName.includes('market value') ||
    fieldName.includes('property value')
  ) {
    return faker.number.int({min: 500000, max: 20000000});
  }

  // Employment and Work Experience
  if (fieldName.includes('employer') || fieldName.includes('company name')) {
    return faker.company.name();
  }
  if (fieldName.includes('designation') || fieldName.includes('job title')) {
    return faker.person.jobTitle();
  }
  if (fieldName.includes('department')) {
    return faker.helpers.arrayElement([
      'Sales',
      'Marketing',
      'Finance',
      'Operations',
      'HR',
      'IT',
      'Admin',
    ]);
  }

  // Financial fields with specific ranges
  if (fieldName.includes('gross salary') || fieldName.includes('net salary')) {
    return faker.number.int({min: 25000, max: 200000});
  }
  if (fieldName.includes('monthly expenses')) {
    return faker.number.int({min: 10000, max: 80000});
  }

  // Loan and Credit fields
  if (fieldName.includes('loan amount') || fieldName.includes('credit limit')) {
    return faker.number.int({min: 100000, max: 15000000});
  }
  if (fieldName.includes('outstanding') || fieldName.includes('os amount')) {
    return faker.number.int({min: 50000, max: 5000000});
  }
  if (fieldName.includes('emi')) {
    return faker.number.int({min: 5000, max: 100000});
  }

  // Family and Dependents
  if (fieldName.includes('dependent') || fieldName.includes('family member')) {
    return faker.number.int({min: 1, max: 8});
  }
  if (fieldName.includes('marital status')) {
    return faker.helpers.arrayElement([
      'Married',
      'Single',
      'Divorced',
      'Widowed',
    ]);
  }

  // Vehicle fields
  if (
    fieldName.includes('vehicle') ||
    fieldName.includes('car') ||
    fieldName.includes('wheeler')
  ) {
    if (fieldName.includes('two')) {
      return faker.helpers.arrayElement([
        'Honda Activa',
        'TVS Jupiter',
        'Bajaj Pulsar',
        'Hero Splendor',
      ]);
    } else {
      return faker.helpers.arrayElement([
        'Maruti Swift',
        'Hyundai i20',
        'Honda City',
        'Toyota Innova',
      ]);
    }
  }

  // Product and Service fields
  if (fieldName.includes('product') && !fieldName.includes('type of')) {
    return faker.commerce.productName();
  }
  if (fieldName.includes('service')) {
    return faker.helpers.arrayElement([
      'Consulting',
      'Trading',
      'Manufacturing',
      'Support',
      'Maintenance',
    ]);
  }

  // Rate and percentage fields
  if (
    fieldName.includes('rate') ||
    fieldName.includes('percentage') ||
    fieldName.includes('%')
  ) {
    return faker.number.float({min: 1, max: 100, fractionDigits: 2});
  }

  // File and Document related
  if (fieldName.includes('document') && !fieldName.includes('observed')) {
    return faker.helpers.arrayElement([
      'PAN Card',
      'Aadhaar Card',
      'Bank Statement',
      'GST Certificate',
    ]);
  }

  // Interview and Assessment fields
  if (fieldName.includes('interview') || fieldName.includes('assessment')) {
    return faker.lorem.sentences(2);
  }
  if (fieldName.includes('interviewer')) {
    return faker.person.fullName();
  }

  // Meeting and Visit fields
  if (fieldName.includes('meeting') || fieldName.includes('visit')) {
    return faker.helpers.arrayElement([
      'Business Premises',
      'Residence',
      'Office',
      'Factory',
    ]);
  }

  // Level and Grade fields
  if (fieldName.includes('level') || fieldName.includes('grade')) {
    return faker.helpers.arrayElement([
      'Level 1',
      'Level 2',
      'Grade A',
      'Grade B',
      'Senior',
      'Junior',
    ]);
  }

  // Cycle and Period fields
  if (fieldName.includes('cycle') || fieldName.includes('period')) {
    return faker.helpers.arrayElement([
      '15 days',
      '30 days',
      '45 days',
      '60 days',
      '90 days',
    ]);
  }

  // Stock and Inventory
  if (fieldName.includes('stock') || fieldName.includes('inventory')) {
    return faker.number.int({min: 100, max: 10000}) + ' units';
  }

  // Certification and Registration
  if (fieldName.includes('certificate') || fieldName.includes('registered')) {
    return faker.helpers.arrayElement(['Yes', 'No']);
  }

  // Automation and Technology
  if (fieldName.includes('automation') || fieldName.includes('system')) {
    return faker.helpers.arrayElement([
      'Manual',
      'Semi-Automated',
      'Fully Automated',
      'Computerized',
    ]);
  }

  // Security and Collateral
  if (fieldName.includes('security') || fieldName.includes('collateral')) {
    return faker.helpers.arrayElement([
      'Property',
      'Vehicle',
      'Gold',
      'Shares',
      'Bank Guarantee',
    ]);
  }

  // Turnover and Sales fields
  if (
    fieldName.includes('turnover') ||
    fieldName.includes('sales') ||
    fieldName.includes('receipts')
  ) {
    return faker.number.int({min: 50000, max: 20000000});
  }

  // Structure and Organization fields
  if (fieldName.includes('structure') && fieldName.includes('loan')) {
    return faker.number.int({min: 500000, max: 10000000});
  }
  if (fieldName.includes('branch code')) {
    return faker.string.alphanumeric(4).toUpperCase();
  }
  if (fieldName.includes('application reference')) {
    return faker.string.alphanumeric(10).toUpperCase();
  }

  // Feedback and Observations
  if (fieldName.includes('feedback')) {
    return faker.helpers.arrayElement([
      'Good',
      'Excellent',
      'Positive',
      'Satisfactory',
      'Very Good',
    ]);
  }
  if (fieldName.includes('observation') && !fieldName.includes('observed')) {
    return faker.lorem.sentences(3);
  }

  // Dependencies and Family structure
  if (fieldName.includes('dependent')) {
    return faker.helpers.arrayElement(['Yes', 'No']);
  }
  if (fieldName.includes('share percentage') || fieldName.includes('share %')) {
    return faker.number.int({min: 10, max: 100});
  }

  // Ownership and Status fields
  if (fieldName.includes('ownership') && fieldName.includes('status')) {
    return faker.helpers.arrayElement([
      'Self Owned',
      'Parental',
      'Rented',
      'Owned',
    ]);
  }
  if (fieldName.includes('self owned') || fieldName.includes('rented')) {
    return faker.helpers.arrayElement(['Self Owned', 'Rented', 'Owned']);
  }

  // Percentage calculations
  if (
    fieldName.includes('percent') ||
    fieldName.includes('% sales') ||
    fieldName.includes('credit')
  ) {
    return faker.number.int({min: 10, max: 90});
  }

  // Customer and Supplier feedback
  if (fieldName.includes('customer') && fieldName.includes('name')) {
    return faker.person.fullName();
  }
  if (fieldName.includes('supplier') && fieldName.includes('name')) {
    return faker.person.fullName();
  }

  // Major customers/suppliers
  if (fieldName.includes('major')) {
    if (fieldName.includes('customer')) {
      return faker.company.name() + ', ' + faker.company.name();
    }
    if (fieldName.includes('supplier')) {
      return faker.company.name() + ', ' + faker.company.name();
    }
  }

  // Stability and verification fields
  if (fieldName.includes('stability')) {
    return faker.lorem.sentences(2);
  }
  if (fieldName.includes('verified by')) {
    return faker.helpers.arrayElement([
      'Registration Certificate',
      'Distribution Letter',
      'Dealership Letter',
      'Bank Statement',
    ]);
  }

  // Family business involvement
  if (fieldName.includes('family') && fieldName.includes('structure')) {
    return faker.lorem.sentences(2);
  }

  // Default based on type
  switch (fieldSchema.type) {
    case 'string':
      if (fieldSchema.format === 'date') {
        return faker.date.past({years: 5}).toISOString().split('T')[0];
      }
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
