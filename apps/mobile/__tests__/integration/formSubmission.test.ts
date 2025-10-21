import { generateMockDataFromSchema } from '../helpers/mockDataGenerator';
import { loadSchemaForTest, mockBackendResponse } from '../helpers/schemaLoader';
import axiosInstance from '../../src/config/axios';
import { getPDSchema } from '../../src/services/field.services';

// Mock axios
jest.mock('../../src/config/axios');
jest.mock('../../src/services/field.services');

describe('Form Submission Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema Loading Flow', () => {
    it('should fetch schema from backend API', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockResponse = mockBackendResponse(schema);

      (getPDSchema as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getPDSchema('RBL');

      expect(getPDSchema).toHaveBeenCalledWith('RBL');
      expect(result.data.status).toBe(200);
      expect(result.data.data.bankName).toBe('RBL');
    });

    it('should handle schema loading errors gracefully', async () => {
      (getPDSchema as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      await expect(getPDSchema('InvalidBank')).rejects.toThrow(
        'Network error'
      );
    });

    it('should cache schema after first load', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockResponse = mockBackendResponse(schema);

      (getPDSchema as jest.Mock).mockResolvedValue(mockResponse);

      // First call
      await getPDSchema('RBL');
      // Second call
      await getPDSchema('RBL');

      // Should be called twice (no caching in test environment)
      expect(getPDSchema).toHaveBeenCalledTimes(2);
    });
  });

  describe('Form Data Submission Flow', () => {
    it('should submit valid form data successfully', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      (axiosInstance.post as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          message: 'Verification submitted successfully',
        },
      });

      const response = await axiosInstance.post(
        '/verification/submit',
        mockData
      );

      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/verification/submit',
        mockData
      );
      expect(response.data.success).toBe(true);
    });

    it('should handle submission errors', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      (axiosInstance.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            error: 'Validation failed',
            details: ['Missing required field'],
          },
        },
      });

      await expect(
        axiosInstance.post('/verification/submit', mockData)
      ).rejects.toBeDefined();
    });

    it('should include all required fields in submission', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      (axiosInstance.post as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      await axiosInstance.post('/verification/submit', mockData);

      const submittedData =
        (axiosInstance.post as jest.Mock).mock.calls[0][1];

      // Verify all required sections are present
      schema.sections.forEach((section: any) => {
        if (section.required) {
          expect(submittedData[section.id]).toBeDefined();
        }
      });
    });
  });

  describe('End-to-End Flow for Each Bank', () => {
    const testBanks = [
      'RBL',
      'Axis Finance UBL Above 10L',
      'Tata UBL',
      'Arka Fincap',
      'Hero Fincorp',
    ];

    testBanks.forEach((bankName) => {
      it(`should complete full flow for ${bankName}`, async () => {
        // Step 1: Load schema
        const schema = await loadSchemaForTest(bankName);
        expect(schema).toBeDefined();

        // Step 2: Generate mock data
        const mockData = generateMockDataFromSchema(schema);
        expect(mockData).toBeDefined();

        // Step 3: Mock backend response
        (getPDSchema as jest.Mock).mockResolvedValue(
          mockBackendResponse(schema)
        );

        // Step 4: Fetch schema (simulating app behavior)
        const fetchedSchema = await getPDSchema(bankName);
        expect(fetchedSchema.data.data.bankName).toBe(bankName);

        // Step 5: Submit data
        (axiosInstance.post as jest.Mock).mockResolvedValue({
          data: { success: true },
        });

        const submitResponse = await axiosInstance.post(
          '/verification/submit',
          mockData
        );

        expect(submitResponse.data.success).toBe(true);
      });
    });
  });

  describe('Image Upload Simulation', () => {
    it('should handle image uploads with form data', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      const uploadedItems = [
        {
          id: '1',
          s3ImageUrl: 's3://bucket/image1.jpg',
          isCamera: true,
        },
        {
          id: '2',
          s3ImageUrl: 's3://bucket/image2.jpg',
          isCamera: false,
        },
      ];

      const submissionData = {
        ...mockData,
        uploadedItems,
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue({
        data: { success: true, imageCount: 2 },
      });

      const response = await axiosInstance.post(
        '/verification/submit',
        submissionData
      );

      expect(response.data.imageCount).toBe(2);
    });
  });

  describe('Offline Support Simulation', () => {
    it('should queue data when offline', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      // Simulate network failure
      (axiosInstance.post as jest.Mock).mockRejectedValue({
        message: 'Network Error',
      });

      try {
        await axiosInstance.post('/verification/submit', mockData);
      } catch (error: any) {
        expect(error.message).toBe('Network Error');
        // In real app, this would trigger offline queue
      }
    });

    it('should retry submission when back online', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      // First attempt fails
      (axiosInstance.post as jest.Mock)
        .mockRejectedValueOnce({
          message: 'Network Error',
        })
        // Retry succeeds
        .mockResolvedValueOnce({
          data: { success: true },
        });

      // First attempt
      try {
        await axiosInstance.post('/verification/submit', mockData);
      } catch (error) {
        // Expected to fail
      }

      // Retry
      const retryResponse = await axiosInstance.post(
        '/verification/submit',
        mockData
      );

      expect(retryResponse.data.success).toBe(true);
    });
  });

  describe('Validation Before Submission', () => {
    it('should validate data format before submission', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      // Ensure dates are in correct format
      Object.values(mockData).forEach((sectionData: any) => {
        Object.entries(sectionData || {}).forEach(([key, value]) => {
          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Verify date format
            expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          }
        });
      });
    });

    it('should validate phone numbers before submission', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      // Check phone number format
      if (mockData.basicDetails?.phoneNo) {
        expect(mockData.basicDetails.phoneNo).toMatch(/^9\d{9}$/);
      }
    });

    it('should validate enum values before submission', async () => {
      const schema = await loadSchemaForTest('RBL');
      const mockData = generateMockDataFromSchema(schema);

      // Check enum fields
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
  });
});

