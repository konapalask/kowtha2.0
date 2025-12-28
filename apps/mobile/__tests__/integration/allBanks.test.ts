import {
  generateMockDataFromSchema,
  validateGeneratedData,
} from '../helpers/mockDataGenerator';
import {
  loadSchemaForTest,
  getAllBankNamesForTest,
} from '../helpers/schemaLoader';

/**
 * Comprehensive automated tests for ALL 27 banks
 * This test suite validates that every bank's schema:
 * 1. Loads successfully
 * 2. Generates valid mock data
 * 3. Passes validation
 * 4. Has proper structure
 */

describe('All 27 Banks - Automated Tests', () => {
  const allBanks = getAllBankNamesForTest();

  // Verify we have all 27 banks
  it('should have schemas for all 27 banks', () => {
    expect(allBanks.length).toBe(27);
  });

  describe.each(allBanks)('Bank: %s', (bankName) => {
    let schema: any;
    let mockData: any;

    beforeAll(async () => {
      schema = await loadSchemaForTest(bankName);
      mockData = generateMockDataFromSchema(schema);
    });

    it('should load schema successfully', () => {
      expect(schema).toBeDefined();
      expect(schema.bankName).toBe(bankName);
      expect(schema.sections).toBeDefined();
      expect(Array.isArray(schema.sections)).toBe(true);
      expect(schema.sections.length).toBeGreaterThan(0);
    });

    it('should have valid schema structure', () => {
      schema.sections.forEach((section: any) => {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('label');
        expect(section).toHaveProperty('schema');
        expect(section.schema).toHaveProperty('type');
        expect(section.schema.type).toBe('object');
        expect(section.schema).toHaveProperty('properties');
      });
    });

    it('should generate mock data successfully', () => {
      expect(mockData).toBeDefined();
      expect(typeof mockData).toBe('object');
      expect(Object.keys(mockData).length).toBeGreaterThan(0);
    });

    it('should pass validation with generated data', () => {
      const validation = validateGeneratedData(mockData, schema);
      
      if (!validation.isValid) {
        console.error(`Validation errors for ${bankName}:`, validation.errors);
      }

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should populate all required fields', () => {
      schema.sections.forEach((section: any) => {
        if (section.required && section.schema.required) {
          section.schema.required.forEach((fieldId: string) => {
            const value = mockData[section.id]?.[fieldId];
            expect(value).toBeDefined();

            // Check not empty for strings
            if (typeof value === 'string') {
              expect(value.length).toBeGreaterThan(0);
            }
          });
        }
      });
    });

    it('should have valid data types for all fields', () => {
      schema.sections.forEach((section: any) => {
        const sectionData = mockData[section.id];

        Object.entries(section.schema.properties || {}).forEach(
          ([fieldId, fieldSchema]: [string, any]) => {
            const value = sectionData?.[fieldId];

            if (value !== undefined && value !== null) {
              switch (fieldSchema.type) {
                case 'string':
                  expect(typeof value).toBe('string');
                  break;
                case 'number':
                case 'integer':
                  expect(typeof value).toBe('number');
                  expect(isNaN(value)).toBe(false);
                  break;
                case 'boolean':
                  expect(typeof value).toBe('boolean');
                  break;
                case 'array':
                  expect(Array.isArray(value)).toBe(true);
                  break;
                case 'object':
                  expect(typeof value).toBe('object');
                  expect(Array.isArray(value)).toBe(false);
                  break;
              }
            }
          }
        );
      });
    });

    it('should respect enum constraints', () => {
      schema.sections.forEach((section: any) => {
        Object.entries(section.schema.properties || {}).forEach(
          ([fieldId, fieldSchema]: [string, any]) => {
            if (fieldSchema.enum) {
              const value = mockData[section.id]?.[fieldId];
              if (value) {
                expect(fieldSchema.enum).toContain(value);
              }
            }
          }
        );
      });
    });

    it('should generate valid phone numbers (if present)', () => {
      Object.values(mockData).forEach((sectionData: any) => {
        Object.entries(sectionData || {}).forEach(([key, value]) => {
          if (
            (key.toLowerCase().includes('phone') ||
              key.toLowerCase().includes('mobile')) &&
            typeof value === 'string'
          ) {
            expect(value).toMatch(/^9\d{9}$/);
          }
        });
      });
    });

    it('should generate valid dates (if present)', () => {
      schema.sections.forEach((section: any) => {
        Object.entries(section.schema.properties || {}).forEach(
          ([fieldId, fieldSchema]: [string, any]) => {
            if (
              fieldSchema.format === 'date' ||
              fieldSchema.type === 'date'
            ) {
              const value = mockData[section.id]?.[fieldId];
              if (value && typeof value === 'string') {
                expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
              }
            }
          }
        );
      });
    });

    it('should handle array fields correctly', () => {
      schema.sections.forEach((section: any) => {
        Object.entries(section.schema.properties || {}).forEach(
          ([fieldId, fieldSchema]: [string, any]) => {
            if (fieldSchema.type === 'array') {
              const arrayValue = mockData[section.id]?.[fieldId];

              if (arrayValue) {
                expect(Array.isArray(arrayValue)).toBe(true);
                expect(arrayValue.length).toBeGreaterThan(0);

                // Verify array items have correct structure
                if (fieldSchema.items?.properties) {
                  arrayValue.forEach((item: any) => {
                    expect(typeof item).toBe('object');
                    Object.keys(fieldSchema.items.properties).forEach(
                      (propKey) => {
                        // Item should have the property defined
                        expect(item).toHaveProperty(propKey);
                      }
                    );
                  });
                }
              }
            }
          }
        );
      });
    });

    it('should handle nested objects correctly', () => {
      schema.sections.forEach((section: any) => {
        Object.entries(section.schema.properties || {}).forEach(
          ([fieldId, fieldSchema]: [string, any]) => {
            if (fieldSchema.type === 'object') {
              const objectValue = mockData[section.id]?.[fieldId];

              if (objectValue) {
                expect(typeof objectValue).toBe('object');
                expect(Array.isArray(objectValue)).toBe(false);

                // Verify nested object has correct structure
                if (fieldSchema.properties) {
                  Object.keys(fieldSchema.properties).forEach((propKey) => {
                    expect(objectValue).toHaveProperty(propKey);
                  });
                }
              }
            }
          }
        );
      });
    });
  });

  describe('Cross-Bank Statistics', () => {
    let allSchemas: any[] = [];
    let allMockData: any[] = [];

    beforeAll(async () => {
      allSchemas = await Promise.all(
        allBanks.map((bankName) => loadSchemaForTest(bankName))
      );
      allMockData = allSchemas.map((schema) =>
        generateMockDataFromSchema(schema)
      );
    });

    it('should successfully load all 27 bank schemas', () => {
      expect(allSchemas.length).toBe(27);
      allSchemas.forEach((schema) => {
        expect(schema).toBeDefined();
        expect(schema.sections).toBeDefined();
      });
    });

    it('should generate valid data for all banks', () => {
      expect(allMockData.length).toBe(27);
      allMockData.forEach((data, index) => {
        const validation = validateGeneratedData(data, allSchemas[index]);
        if (!validation.isValid) {
          console.error(
            `Bank ${allBanks[index]} validation failed:`,
            validation.errors
          );
        }
        expect(validation.isValid).toBe(true);
      });
    });

    it('should have consistent structure across all banks', () => {
      allSchemas.forEach((schema) => {
        expect(schema).toHaveProperty('id');
        expect(schema).toHaveProperty('bankName');
        expect(schema).toHaveProperty('sections');
        expect(Array.isArray(schema.sections)).toBe(true);
      });
    });

    it('should calculate test coverage statistics', () => {
      const stats = {
        totalBanks: allBanks.length,
        totalSections: 0,
        totalFields: 0,
        arrayFieldsCount: 0,
        objectFieldsCount: 0,
        enumFieldsCount: 0,
      };

      allSchemas.forEach((schema) => {
        stats.totalSections += schema.sections.length;

        schema.sections.forEach((section: any) => {
          const properties = section.schema.properties || {};
          stats.totalFields += Object.keys(properties).length;

          Object.values(properties).forEach((field: any) => {
            if (field.type === 'array') stats.arrayFieldsCount++;
            if (field.type === 'object') stats.objectFieldsCount++;
            if (field.enum) stats.enumFieldsCount++;
          });
        });
      });

      console.log('Test Coverage Statistics:', stats);

      expect(stats.totalBanks).toBe(27);
      expect(stats.totalSections).toBeGreaterThan(27); // At least 1 section per bank
      expect(stats.totalFields).toBeGreaterThan(100); // Reasonable number of fields
    });
  });

  describe('Performance Tests', () => {
    it('should load all bank schemas in reasonable time', async () => {
      const startTime = Date.now();

      await Promise.all(
        allBanks.map((bankName) => loadSchemaForTest(bankName))
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should load all schemas in less than 5 seconds
      expect(duration).toBeLessThan(5000);
    });

    it('should generate mock data for all banks quickly', async () => {
      const schemas = await Promise.all(
        allBanks.map((bankName) => loadSchemaForTest(bankName))
      );

      const startTime = Date.now();

      schemas.forEach((schema) => {
        generateMockDataFromSchema(schema);
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should generate all mock data in less than 3 seconds
      expect(duration).toBeLessThan(3000);
    });
  });
});

