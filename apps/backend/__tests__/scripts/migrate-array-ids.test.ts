import { PrismaClient } from "@prisma/client";
import {
  migrateArrayIds,
  processVerificationData,
  validateArrayIds,
} from "../../src/scripts/migrate-array-ids";

// Mock PrismaClient
jest.mock("@prisma/client");
const MockPrismaClient = PrismaClient as jest.MockedClass<typeof PrismaClient>;

describe("migrate-array-ids", () => {
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = new MockPrismaClient() as jest.Mocked<PrismaClient>;
  });

  describe("processVerificationData", () => {
    it("should add IDs to array fields", () => {
      const verificationData = {
        familyMemberDetails: [
          { name: "John", age: 30 },
          { name: "Jane", age: 25 },
        ],
        businessOwnerDetails: [{ name: "Alice", role: "Owner" }],
        regularField: "not an array",
      };

      const result = processVerificationData(verificationData);

      expect(result.stats.arraysProcessed).toBe(2);
      expect(result.stats.itemsProcessed).toBe(3);

      expect(result.data.familyMemberDetails).toHaveLength(2);
      expect(result.data.familyMemberDetails[0]).toHaveProperty("_id");
      expect(result.data.familyMemberDetails[1]).toHaveProperty("_id");

      expect(result.data.businessOwnerDetails).toHaveLength(1);
      expect(result.data.businessOwnerDetails[0]).toHaveProperty("_id");

      expect(result.data.regularField).toBe("not an array");
    });

    it("should preserve existing IDs", () => {
      const existingId = "existing-123";
      const verificationData = {
        familyMemberDetails: [
          { _id: existingId, name: "John", age: 30 },
          { name: "Jane", age: 25 }, // Missing ID
        ],
      };

      const result = processVerificationData(verificationData);

      expect(result.data.familyMemberDetails[0]._id).toBe(existingId);
      expect(result.data.familyMemberDetails[1]).toHaveProperty("_id");
      expect(result.data.familyMemberDetails[1]._id).not.toBe(existingId);
    });

    it("should handle nested array structures", () => {
      const verificationData = {
        businessDetails: {
          branches: [
            {
              name: "Main Branch",
              employees: [{ name: "Employee 1" }, { name: "Employee 2" }],
            },
          ],
        },
      };

      const result = processVerificationData(verificationData);

      expect(result.stats.arraysProcessed).toBe(2);
      expect(result.data.businessDetails.branches[0]).toHaveProperty("_id");
      expect(
        result.data.businessDetails.branches[0].employees[0]
      ).toHaveProperty("_id");
      expect(
        result.data.businessDetails.branches[0].employees[1]
      ).toHaveProperty("_id");
    });

    it("should handle empty and null data", () => {
      expect(processVerificationData(null).data).toBe(null);
      expect(processVerificationData(undefined).data).toBe(undefined);
      expect(processVerificationData({}).data).toEqual({});
    });

    it("should handle arrays with mixed content", () => {
      const verificationData = {
        mixedArray: [
          { name: "Valid Object" },
          null, // Invalid item
          "string", // Invalid item
          { name: "Another Valid Object" },
        ],
      };

      const result = processVerificationData(verificationData);

      // Should still process valid objects
      expect(result.stats.arraysProcessed).toBe(1);
      expect(result.data.mixedArray).toHaveLength(4); // Preserves all items
      expect(result.data.mixedArray[0]).toHaveProperty("_id");
      expect(result.data.mixedArray[3]).toHaveProperty("_id");
    });
  });

  describe("validateArrayIds", () => {
    it("should validate data with proper array IDs", () => {
      const validData = {
        familyMemberDetails: [
          { _id: "id-1", name: "John" },
          { _id: "id-2", name: "Jane" },
        ],
        businessOwnerDetails: [{ _id: "id-3", name: "Alice" }],
      };

      const result = validateArrayIds(validData);

      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("should detect missing IDs", () => {
      const invalidData = {
        familyMemberDetails: [
          { _id: "id-1", name: "John" },
          { name: "Jane" }, // Missing ID
        ],
      };

      const result = validateArrayIds(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain("Missing _id in familyMemberDetails[1]");
    });

    it("should detect duplicate IDs across different arrays", () => {
      const invalidData = {
        familyMemberDetails: [{ _id: "duplicate-id", name: "John" }],
        businessOwnerDetails: [
          { _id: "duplicate-id", name: "Alice" }, // Duplicate ID
        ],
      };

      const result = validateArrayIds(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain(
        "Duplicate _id 'duplicate-id' in businessOwnerDetails[0]"
      );
    });

    it("should handle nested structures", () => {
      const nestedData = {
        businessDetails: {
          branches: [
            {
              _id: "branch-1",
              employees: [
                { name: "Employee 1" }, // Missing ID in nested array
              ],
            },
          ],
        },
      };

      const result = validateArrayIds(nestedData);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain(
        "Missing _id in businessDetails.branches.employees[0]"
      );
    });
  });

  describe("Migration Statistics", () => {
    it("should track statistics correctly during dry run", async () => {
      // Mock Prisma methods
      mockPrisma.verification.count = jest.fn().mockResolvedValue(3);
      mockPrisma.verification.findMany = jest.fn().mockResolvedValue([
        {
          id: 1,
          verificationData: {
            familyMemberDetails: [
              { name: "John" }, // Missing ID
              { name: "Jane" }, // Missing ID
            ],
          },
          department: "PD",
          loan: { bankName: "Test Bank", applicationNumber: "APP001" },
        },
        {
          id: 2,
          verificationData: {
            businessOwnerDetails: [
              { name: "Alice" }, // Missing ID
            ],
          },
          department: "PD",
          loan: { bankName: "Test Bank", applicationNumber: "APP002" },
        },
        {
          id: 3,
          verificationData: null, // No data to migrate
          department: "PD",
          loan: { bankName: "Test Bank", applicationNumber: "APP003" },
        },
      ]);

      // Replace the prisma import with our mock
      (require("../../src/scripts/migrate-array-ids") as any).prisma =
        mockPrisma;

      const stats = await migrateArrayIds({ dryRun: true });

      expect(stats.totalVerifications).toBe(3);
      expect(stats.verificationsProcessed).toBe(3);
      expect(stats.arraysProcessed).toBe(2); // Only first two have arrays
      expect(stats.itemsProcessed).toBe(3); // 2 family members + 1 business owner
      expect(stats.errors).toHaveLength(0);

      // Should not have called update in dry run
      expect(mockPrisma.verification.update).not.toHaveBeenCalled();
    });

    it("should handle migration errors gracefully", async () => {
      mockPrisma.verification.count = jest.fn().mockResolvedValue(1);
      mockPrisma.verification.findMany = jest.fn().mockResolvedValue([
        {
          id: 1,
          verificationData: {
            familyMemberDetails: "invalid data", // Invalid array data
          },
          department: "PD",
          loan: { bankName: "Test Bank", applicationNumber: "APP001" },
        },
      ]);

      const stats = await migrateArrayIds({ dryRun: true });

      expect(stats.errors.length).toBeGreaterThan(0);
      expect(stats.verificationsProcessed).toBe(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle verification with no array fields", () => {
      const verificationData = {
        basicDetails: {
          name: "John",
          age: 30,
        },
        notes: "Some text",
      };

      const result = processVerificationData(verificationData);

      expect(result.stats.arraysProcessed).toBe(0);
      expect(result.stats.itemsProcessed).toBe(0);
      expect(result.data).toEqual(verificationData);
    });

    it("should handle verification with empty arrays", () => {
      const verificationData = {
        familyMemberDetails: [],
        businessOwnerDetails: [],
      };

      const result = processVerificationData(verificationData);

      expect(result.stats.arraysProcessed).toBe(0);
      expect(result.data).toEqual(verificationData);
    });

    it("should handle arrays with only primitive values", () => {
      const verificationData = {
        tags: ["tag1", "tag2", "tag3"], // Array of strings
        priorities: [1, 2, 3], // Array of numbers
      };

      const result = processVerificationData(verificationData);

      // Primitive arrays shouldn't be processed
      expect(result.stats.arraysProcessed).toBe(0);
      expect(result.data).toEqual(verificationData);
    });
  });
});
