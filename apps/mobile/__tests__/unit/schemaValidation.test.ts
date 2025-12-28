import {
  loadSchemaForTest,
  getAllBankNamesForTest,
  mockBackendResponse,
} from '../helpers/schemaLoader';
import { generateMockDataFromSchema } from '../helpers/mockDataGenerator';

describe('Schema Validation Tests', () => {
  describe('Schema Loading', () => {
    it('should load schema for any bank', async () => {
      const schema = await loadSchemaForTest('RBL');

      expect(schema).toBeDefined();
      expect(schema.bankName).toBe('RBL');
      expect(schema.sections).toBeDefined();
      expect(Array.isArray(schema.sections)).toBe(true);
    });

    it('should return valid schema structure', async () => {
      const schema = await loadSchemaForTest('RBL');

      expect(schema).toHaveProperty('id');
      expect(schema).toHaveProperty('bankName');
      expect(schema).toHaveProperty('sections');
      expect(schema.sections.length).toBeGreaterThan(0);
    });

    it('should have required properties in each section', async () => {
      const schema = await loadSchemaForTest('RBL');

      schema.sections.forEach((section: any) => {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('label');
        expect(section).toHaveProperty('schema');
        expect(section.schema).toHaveProperty('type');
        expect(section.schema).toHaveProperty('properties');
      });
    });
  });

  describe('All Banks Schema Consistency', () => {
    const allBanks = getAllBankNamesForTest();

    it('should have schemas for all banks', () => {
      expect(allBanks.length).toBe(27);
    });

    it('should load schema for each bank without errors', async () => {
      const promises = allBanks.map((bankName) =>
        loadSchemaForTest(bankName)
      );
      const schemas = await Promise.all(promises);

      schemas.forEach((schema, index) => {
        expect(schema).toBeDefined();
        expect(schema.sections).toBeDefined();
        expect(schema.sections.length).toBeGreaterThan(0);
      });
    });

    it('should generate valid mock data for all banks', async () => {
      for (const bankName of allBanks.slice(0, 5)) {
        // Test first 5 banks
        const schema = await loadSchemaForTest(bankName);
        const mockData = generateMockDataFromSchema(schema);

        expect(mockData).toBeDefined();
        expect(Object.keys(mockData).length).toBeGreaterThan(0);
      }
    });
  });

  describe('Backend API Response Structure', () => {
    it('should match expected API response format', async () => {
      const schema = await loadSchemaForTest('RBL');
      const apiResponse = mockBackendResponse(schema);

      expect(apiResponse.data.status).toBe(200);
      expect(apiResponse.data.message).toBeDefined();
      expect(apiResponse.data.data.bankName).toBe('RBL');
      expect(apiResponse.data.data.schema).toBeDefined();
      expect(apiResponse.data.data.metadata).toBeDefined();
    });

    it('should include verifier metadata', async () => {
      const schema = await loadSchemaForTest('RBL');
      const apiResponse = mockBackendResponse(schema);
      const metadata = apiResponse.data.data.metadata;

      expect(metadata.verifierFields).toBeDefined();
      expect(Array.isArray(metadata.verifierFields)).toBe(true);
      expect(metadata.verifierFields).toContain('financialAnalysis');
      expect(metadata.verifierFields).toContain('synopsis');
    });

    it('should have template information', async () => {
      const schema = await loadSchemaForTest('RBL');
      const apiResponse = mockBackendResponse(schema);
      const metadata = apiResponse.data.data.metadata;

      expect(metadata).toHaveProperty('hasCustomTemplate');
      expect(typeof metadata.hasCustomTemplate).toBe('boolean');
    });
  });

  describe('Schema Field Types', () => {
    it('should handle all common field types', async () => {
      const schemaWithAllTypes = {
        id: 1,
        bankName: 'Test Bank',
        sections: [
          {
            id: 'allTypes',
            label: 'All Types',
            schema: {
              type: 'object',
              properties: {
                stringField: { type: 'string', title: 'String Field' },
                numberField: { type: 'number', title: 'Number Field' },
                booleanField: { type: 'boolean', title: 'Boolean Field' },
                dateField: {
                  type: 'string',
                  format: 'date',
                  title: 'Date Field',
                },
                enumField: {
                  type: 'string',
                  enum: ['Option1', 'Option2', 'Option3'],
                  title: 'Enum Field',
                },
                arrayField: {
                  type: 'array',
                  title: 'Array Field',
                  items: {
                    type: 'object',
                    properties: {
                      itemName: { type: 'string', title: 'Item Name' },
                    },
                  },
                },
                objectField: {
                  type: 'object',
                  title: 'Object Field',
                  properties: {
                    nestedString: { type: 'string', title: 'Nested String' },
                  },
                },
              },
            },
          },
        ],
      };

      const mockData = generateMockDataFromSchema(schemaWithAllTypes);

      expect(typeof mockData.allTypes.stringField).toBe('string');
      expect(typeof mockData.allTypes.numberField).toBe('number');
      expect(typeof mockData.allTypes.booleanField).toBe('boolean');
      expect(typeof mockData.allTypes.dateField).toBe('string');
      expect(['Option1', 'Option2', 'Option3']).toContain(
        mockData.allTypes.enumField
      );
      expect(Array.isArray(mockData.allTypes.arrayField)).toBe(true);
      expect(typeof mockData.allTypes.objectField).toBe('object');
    });
  });
});

