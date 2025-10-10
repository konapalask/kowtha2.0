/**
 * Test helper to load schemas synchronously for testing
 * Note: In production, schemas are loaded from backend API
 */

// Import all bank schemas from backend
// In test environment, we'll mock the API and use direct imports
const BANK_SCHEMAS: Record<string, any> = {};

/**
 * Mock implementation of schema loading for tests
 * In real app, this calls the backend API
 */
export async function loadSchemaForTest(bankName: string): Promise<any> {
  // For tests, we'll create a simplified schema structure
  // In production, this would call getPDSchema API
  
  // This is a mock - tests should mock the actual API call
  return {
    id: 1,
    bankName: bankName,
    sections: [
      {
        id: 'basicDetails',
        label: 'Basic Details',
        required: true,
        schema: {
          type: 'object',
          properties: {
            applicationNo: { type: 'string', title: 'Application No' },
            applicantName: { type: 'string', title: 'Applicant Name' },
            phoneNo: { type: 'string', title: 'Phone No' },
            concernName: { type: 'string', title: 'Concern Name' },
            constitution: {
              type: 'string',
              title: 'Constitution',
              enum: ['Proprietorship', 'Partnership', 'Private Limited', 'LLP'],
            },
          },
          required: ['applicationNo', 'applicantName', 'phoneNo'],
        },
      },
    ],
  };
}

/**
 * Get all supported bank names for testing
 */
export function getAllBankNamesForTest(): string[] {
  return [
    'RBL',
    'Axis Finance UBL Above 10L',
    'Axis Finance UBL Below 10L',
    'Tata UBL',
    'Arka Fincap',
    'Hero Fincorp',
    'ICICI',
    'IDFC HL & ML',
    'IIFL',
    'Niwas Salaried',
    'Niwas SENP',
    'India Shelter Salaried',
    'India Shelter Self Employed',
    'Hero Housing Salaried',
    'Hero Housing Self Employed',
    'Axis Bank',
    'Axis Agri',
    'Ambit',
    'Chola',
    'DCB',
    'IDFC PL',
    'InCred',
    'SMFG SME',
    'SMFG HL',
    'SMFG ML',
    'Yes Bank',
    'Sammaan',
  ];
}

/**
 * Mock the backend API response for tests
 */
export function mockBackendResponse(schema: any) {
  return {
    data: {
      status: 200,
      message: 'Bank forms fetched successfully',
      data: {
        bankName: schema.bankName,
        schema: schema,
        metadata: {
          verifierFields: [
            'financialAnalysis',
            'synopsis',
            'path',
            'approvedStatus',
            'comments',
          ],
          hasCustomTemplate: schema.bankName === 'RBL',
          sectionIds: schema.sections.map((s: any) => s.id),
        },
      },
    },
  };
}

