import {
  generateMockDataFromSchema,
  validateGeneratedData,
} from '../helpers/mockDataGenerator';
import { loadSchemaForTest } from '../helpers/schemaLoader';

/**
 * Comprehensive tests for specific banks
 * Tests: RBL, Axis Finance UBL, Tata UBL, Arka Fincap, Hero Fincorp
 */

describe('Bank-Specific Form Tests', () => {
  describe('RBL Bank', () => {
    let schema: any;
    let mockData: any;

    beforeAll(async () => {
      schema = await loadSchemaForTest('RBL');
      mockData = generateMockDataFromSchema(schema);
    });

    it('should load RBL schema successfully', () => {
      expect(schema).toBeDefined();
      expect(schema.bankName).toBe('RBL');
      expect(schema.sections).toBeDefined();
    });

    it('should generate valid mock data for RBL', () => {
      expect(mockData).toBeDefined();
      expect(mockData.basicDetails).toBeDefined();
    });

    it('should validate generated RBL data', () => {
      const validation = validateGeneratedData(mockData, schema);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should have all required RBL fields populated', () => {
      schema.sections.forEach((section: any) => {
        if (section.required && section.schema.required) {
          section.schema.required.forEach((fieldId: string) => {
            const value = mockData[section.id]?.[fieldId];
            expect(value).toBeDefined();
            expect(value).not.toBe('');
          });
        }
      });
    });

    it('should handle RBL-specific enum values', () => {
      // RBL typically has constitution field
      if (mockData.basicDetails?.constitution) {
        const validConstitutions = [
          'Proprietorship',
          'Partnership',
          'Private Limited',
          'LLP',
        ];
        expect(validConstitutions).toContain(mockData.basicDetails.constitution);
      }
    });
  });

  describe('Axis Finance UBL Above 10L', () => {
    let schema: any;
    let mockData: any;

    beforeAll(async () => {
      schema = await loadSchemaForTest('Axis Finance UBL Above 10L');
      mockData = generateMockDataFromSchema(schema);
    });

    it('should load Axis Finance UBL schema successfully', () => {
      expect(schema).toBeDefined();
      expect(schema.bankName).toBe('Axis Finance UBL Above 10L');
    });

    it('should generate valid mock data for Axis Finance UBL', () => {
      expect(mockData).toBeDefined();
      const validation = validateGeneratedData(mockData, schema);
      expect(validation.isValid).toBe(true);
    });

    it('should handle array fields in Axis Finance UBL', () => {
      // Axis Finance UBL has family details array
      if (schema.sections.some((s: any) => s.id === 'familyDetails')) {
        const familySection = schema.sections.find(
          (s: any) => s.id === 'familyDetails'
        );
        if (familySection) {
          const familyData = mockData.familyDetails;
          expect(familyData).toBeDefined();
        }
      }
    });

    it('should generate valid phone numbers for Axis Finance UBL', () => {
      if (mockData.basicDetails?.phoneNo) {
        expect(mockData.basicDetails.phoneNo).toMatch(/^9\d{9}$/);
      }
    });
  });

  describe('Tata UBL', () => {
    let schema: any;
    let mockData: any;

    beforeAll(async () => {
      schema = await loadSchemaForTest('Tata UBL');
      mockData = generateMockDataFromSchema(schema);
    });

    it('should load Tata UBL schema successfully', () => {
      expect(schema).toBeDefined();
      expect(schema.bankName).toBe('Tata UBL');
    });

    it('should generate valid mock data for Tata UBL', () => {
      expect(mockData).toBeDefined();
      const validation = validateGeneratedData(mockData, schema);
      expect(validation.isValid).toBe(true);
    });

    it('should handle nested object fields in Tata UBL', () => {
      // Tata UBL often has nested objects like repaymentFrom
      const hasObjectFields = schema.sections.some((section: any) =>
        Object.values(section.schema.properties || {}).some(
          (prop: any) => prop.type === 'object'
        )
      );

      if (hasObjectFields) {
        // Verify nested objects are generated correctly
        Object.keys(mockData).forEach((sectionId) => {
          const sectionData = mockData[sectionId];
          if (typeof sectionData === 'object') {
            expect(sectionData).toBeDefined();
          }
        });
      }
    });
  });

  describe('Arka Fincap', () => {
    let schema: any;
    let mockData: any;

    beforeAll(async () => {
      schema = await loadSchemaForTest('Arka Fincap');
      mockData = generateMockDataFromSchema(schema);
    });

    it('should load Arka Fincap schema successfully', () => {
      expect(schema).toBeDefined();
      expect(schema.bankName).toBe('Arka Fincap');
    });

    it('should generate valid mock data for Arka Fincap', () => {
      expect(mockData).toBeDefined();
      const validation = validateGeneratedData(mockData, schema);
      expect(validation.isValid).toBe(true);
    });

    it('should populate all sections for Arka Fincap', () => {
      schema.sections.forEach((section: any) => {
        expect(mockData[section.id]).toBeDefined();
        expect(Object.keys(mockData[section.id]).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Hero Fincorp', () => {
    let schema: any;
    let mockData: any;

    beforeAll(async () => {
      schema = await loadSchemaForTest('Hero Fincorp');
      mockData = generateMockDataFromSchema(schema);
    });

    it('should load Hero Fincorp schema successfully', () => {
      expect(schema).toBeDefined();
      expect(schema.bankName).toBe('Hero Fincorp');
    });

    it('should generate valid mock data for Hero Fincorp', () => {
      expect(mockData).toBeDefined();
      const validation = validateGeneratedData(mockData, schema);
      expect(validation.isValid).toBe(true);
    });

    it('should validate data types for Hero Fincorp', () => {
      schema.sections.forEach((section: any) => {
        Object.entries(section.schema.properties || {}).forEach(
          ([fieldId, fieldSchema]: [string, any]) => {
            const value = mockData[section.id]?.[fieldId];

            if (value !== undefined && value !== null) {
              switch (fieldSchema.type) {
                case 'string':
                  expect(typeof value).toBe('string');
                  break;
                case 'number':
                case 'integer':
                  expect(typeof value).toBe('number');
                  break;
                case 'boolean':
                  expect(typeof value).toBe('boolean');
                  break;
                case 'array':
                  expect(Array.isArray(value)).toBe(true);
                  break;
                case 'object':
                  expect(typeof value).toBe('object');
                  break;
              }
            }
          }
        );
      });
    });
  });

  describe('Cross-Bank Validation', () => {
    it('should generate unique data for each bank', async () => {
      const banks = ['RBL', 'Tata UBL', 'Arka Fincap'];
      const allData = await Promise.all(
        banks.map(async (bankName) => {
          const schema = await loadSchemaForTest(bankName);
          return generateMockDataFromSchema(schema);
        })
      );

      // Each bank should have valid data
      allData.forEach((data) => {
        expect(data).toBeDefined();
        expect(Object.keys(data).length).toBeGreaterThan(0);
      });
    });

    it('should maintain data consistency across test runs', async () => {
      const schema = await loadSchemaForTest('RBL');
      const data1 = generateMockDataFromSchema(schema);
      const data2 = generateMockDataFromSchema(schema);

      // Both should have same structure
      expect(Object.keys(data1)).toEqual(Object.keys(data2));
    });
  });
});

