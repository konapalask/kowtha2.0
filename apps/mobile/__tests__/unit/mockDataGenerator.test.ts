import {
  generateMockDataFromSchema,
  validateGeneratedData,
} from '../helpers/mockDataGenerator';
import { loadSchemaForTest } from '../helpers/schemaLoader';

describe('Mock Data Generator', () => {
  describe('generateMockDataFromSchema', () => {
    it('should generate valid mock data for a simple schema', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      expect(mockData).toBeDefined();
      expect(mockData.basicDetails).toBeDefined();
      expect(mockData.basicDetails.applicationNo).toBeDefined();
      expect(mockData.basicDetails.applicantName).toBeDefined();
    });

    it('should generate data matching field types', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      // Check types
      expect(typeof mockData.basicDetails.applicationNo).toBe('string');
      expect(typeof mockData.basicDetails.applicantName).toBe('string');
      expect(typeof mockData.basicDetails.phoneNo).toBe('string');
    });

    it('should generate valid phone numbers', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      const phone = mockData.basicDetails.phoneNo;
      expect(phone).toMatch(/^9\d{9}$/); // Indian mobile format
    });

    it('should pick from enum values when available', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      const constitution = mockData.basicDetails.constitution;
      const validOptions = [
        'Proprietorship',
        'Partnership',
        'Private Limited',
        'LLP',
      ];
      expect(validOptions).toContain(constitution);
    });

    it('should generate arrays with multiple items', async () => {
      const schemaWithArray = {
        id: 1,
        bankName: 'Test Bank',
        sections: [
          {
            id: 'familyDetails',
            label: 'Family Details',
            schema: {
              type: 'object',
              properties: {
                members: {
                  type: 'array',
                  title: 'Family Members',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', title: 'Name' },
                      relation: { type: 'string', title: 'Relation' },
                      age: { type: 'number', title: 'Age' },
                    },
                  },
                },
              },
            },
          },
        ],
      };

      const mockData = generateMockDataFromSchema(schemaWithArray);
      expect(Array.isArray(mockData.familyDetails.members)).toBe(true);
      expect(mockData.familyDetails.members.length).toBeGreaterThan(0);
      expect(mockData.familyDetails.members[0].name).toBeDefined();
    });

    it('should handle nested objects correctly', async () => {
      const schemaWithNested = {
        id: 1,
        bankName: 'Test Bank',
        sections: [
          {
            id: 'businessDetails',
            label: 'Business Details',
            schema: {
              type: 'object',
              properties: {
                repaymentFrom: {
                  type: 'object',
                  title: 'Repayment From',
                  properties: {
                    businessIncome: { type: 'number', title: 'Business Income' },
                    salaryIncome: { type: 'number', title: 'Salary Income' },
                  },
                },
              },
            },
          },
        ],
      };

      const mockData = generateMockDataFromSchema(schemaWithNested);
      expect(mockData.businessDetails.repaymentFrom).toBeDefined();
      expect(
        typeof mockData.businessDetails.repaymentFrom.businessIncome
      ).toBe('number');
    });
  });

  describe('validateGeneratedData', () => {
    it('should validate that generated data matches schema', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      const validation = validateGeneratedData(mockData, schema);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing required fields', async () => {
      const schema = await loadSchemaForTest('RBL');
      const incompleteData = {
        basicDetails: {
          // Missing required fields
        },
      };

      const validation = validateGeneratedData(incompleteData, schema);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should detect missing required sections', async () => {
      const schema = await loadSchemaForTest('RBL');
      const incompleteData = {}; // Missing basicDetails section

      const validation = validateGeneratedData(incompleteData, schema);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain(
        'Missing required section: basicDetails'
      );
    });
  });

  describe('Smart field generation', () => {
    it('should generate realistic names for name fields', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      const name = mockData.basicDetails.applicantName;
      expect(name).toBeDefined();
      expect(name.length).toBeGreaterThan(0);
      expect(name).toMatch(/^[A-Za-z\s]+$/); // Only letters and spaces
    });

    it('should generate valid business names', async () => {
      const schema = {
        id: 1,
        bankName: 'Test',
        sections: [
          {
            id: 'business',
            label: 'Business',
            schema: {
              type: 'object',
              properties: {
                concernName: { type: 'string', title: 'Concern Name' },
                businessName: { type: 'string', title: 'Business Name' },
              },
            },
          },
        ],
      };

      const mockData = generateMockDataFromSchema(schema);
      expect(mockData.business.concernName).toBeDefined();
      expect(mockData.business.businessName).toBeDefined();
    });
  });
});

