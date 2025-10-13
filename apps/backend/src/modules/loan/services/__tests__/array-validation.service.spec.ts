import { Test, TestingModule } from "@nestjs/testing";
import { ArrayValidationService } from "../array-validation.service";
import { LoggingService } from "../../../common/logging/logging.service";

describe("ArrayValidationService", () => {
  let service: ArrayValidationService;
  let mockLoggingService: jest.Mocked<LoggingService>;

  beforeEach(async () => {
    const mockLogging = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArrayValidationService,
        {
          provide: LoggingService,
          useValue: mockLogging,
        },
      ],
    }).compile();

    service = module.get<ArrayValidationService>(ArrayValidationService);
    mockLoggingService = module.get(LoggingService);
  });

  describe("validateArrayData", () => {
    it("should validate array with unique IDs successfully", () => {
      const arrayData = [
        { _id: "id-1", name: "John", age: 30 },
        { _id: "id-2", name: "Jane", age: 25 },
        { _id: "id-3", name: "Bob", age: 35 },
      ];

      const result = service.validateArrayData(arrayData, "familyMembers");

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it("should detect missing IDs", () => {
      const arrayData = [
        { _id: "id-1", name: "John", age: 30 },
        { name: "Jane", age: 25 }, // Missing ID
        { _id: "id-3", name: "Bob", age: 35 },
      ];

      const result = service.validateArrayData(arrayData, "familyMembers");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Some items in familyMembers are missing unique IDs"
      );
    });

    it("should detect duplicate IDs", () => {
      const arrayData = [
        { _id: "id-1", name: "John", age: 30 },
        { _id: "id-1", name: "Jane", age: 25 }, // Duplicate ID
        { _id: "id-3", name: "Bob", age: 35 },
      ];

      const result = service.validateArrayData(arrayData, "familyMembers");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Duplicate IDs found in familyMembers");
    });

    it("should warn about invalid ID formats", () => {
      const arrayData = [
        { _id: "short", name: "John", age: 30 },
        { _id: "id-2", name: "Jane", age: 25 },
      ];

      const result = service.validateArrayData(arrayData, "familyMembers");

      expect(result.warnings).toContain(
        "Invalid ID format in familyMembers: short"
      );
    });

    it("should validate with schema constraints", () => {
      const schema = {
        items: {
          required: ["name", "age"],
          properties: {
            name: { type: "string" },
            age: { type: "integer" },
            email: { type: "string" },
          },
        },
      };

      const arrayData = [
        { _id: "id-1", name: "John", age: 30 },
        { _id: "id-2", name: "Jane", age: "invalid" }, // Invalid type
        { _id: "id-3", age: 35 }, // Missing required field
      ];

      const result = service.validateArrayData(
        arrayData,
        "familyMembers",
        schema
      );

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings).toContain(
        "Item 1 in familyMembers.age has invalid type"
      );
      expect(result.warnings).toContain(
        "Item 2 in familyMembers missing required field: name"
      );
    });

    it("should handle non-array input", () => {
      const result = service.validateArrayData("not-an-array", "field");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Field field must be an array");
    });
  });

  describe("ensureArrayHasIds", () => {
    it("should add IDs to items without them", () => {
      const arrayData = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];

      const result = service.ensureArrayHasIds(arrayData);

      expect(result).toHaveLength(2);
      result.forEach((item) => {
        expect(item).toHaveProperty("_id");
        expect(typeof item._id).toBe("string");
        expect(item._id.length).toBeGreaterThan(0);
      });
    });

    it("should preserve existing IDs", () => {
      const existingId = "existing-123";
      const arrayData = [
        { _id: existingId, name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];

      const result = service.ensureArrayHasIds(arrayData);

      expect(result[0]._id).toBe(existingId);
      expect(result[1]).toHaveProperty("_id");
      expect(result[1]._id).not.toBe(existingId);
    });

    it("should handle duplicate IDs by making them unique", () => {
      const duplicateId = "duplicate-123";
      const arrayData = [
        { _id: duplicateId, name: "John" },
        { _id: duplicateId, name: "Jane" },
        { _id: duplicateId, name: "Bob" },
      ];

      const result = service.ensureArrayHasIds(arrayData);

      const ids = result.map((item) => item._id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);

      expect(result[0]._id).toBe(duplicateId);
      expect(result[1]._id).toBe(`${duplicateId}_1`);
      expect(result[2]._id).toBe(`${duplicateId}_2`);
    });

    it("should handle non-array input", () => {
      expect(service.ensureArrayHasIds(null)).toEqual([]);
      expect(service.ensureArrayHasIds(undefined)).toEqual([]);
      expect(service.ensureArrayHasIds("string" as any)).toEqual([]);
    });
  });

  describe("detectArrayChanges", () => {
    it("should detect added items", () => {
      const oldArray = [{ _id: "id-1", name: "John", age: 30 }];
      const newArray = [
        { _id: "id-1", name: "John", age: 30 },
        { _id: "id-2", name: "Jane", age: 25 }, // Added
      ];

      const result = service.detectArrayChanges(oldArray, newArray);

      expect(result.added).toHaveLength(1);
      expect(result.added[0]._id).toBe("id-2");
      expect(result.removed).toHaveLength(0);
      expect(result.modified).toHaveLength(0);
    });

    it("should detect removed items", () => {
      const oldArray = [
        { _id: "id-1", name: "John", age: 30 },
        { _id: "id-2", name: "Jane", age: 25 },
      ];
      const newArray = [{ _id: "id-1", name: "John", age: 30 }];

      const result = service.detectArrayChanges(oldArray, newArray);

      expect(result.added).toHaveLength(0);
      expect(result.removed).toHaveLength(1);
      expect(result.removed[0]._id).toBe("id-2");
      expect(result.modified).toHaveLength(0);
    });

    it("should detect modified items", () => {
      const oldArray = [
        { _id: "id-1", name: "John", age: 30 },
        { _id: "id-2", name: "Jane", age: 25 },
      ];
      const newArray = [
        { _id: "id-1", name: "John", age: 31 }, // Age modified
        { _id: "id-2", name: "Jane Smith", age: 25 }, // Name modified
      ];

      const result = service.detectArrayChanges(oldArray, newArray);

      expect(result.added).toHaveLength(0);
      expect(result.removed).toHaveLength(0);
      expect(result.modified).toHaveLength(2);

      const johnChange = result.modified.find((m) => m.id === "id-1");
      expect(johnChange?.changedFields).toContain("age");

      const janeChange = result.modified.find((m) => m.id === "id-2");
      expect(janeChange?.changedFields).toContain("name");
    });

    it("should detect reordering", () => {
      const oldArray = [
        { _id: "id-1", name: "John" },
        { _id: "id-2", name: "Jane" },
      ];
      const newArray = [
        { _id: "id-2", name: "Jane" },
        { _id: "id-1", name: "John" },
      ];

      const result = service.detectArrayChanges(oldArray, newArray);

      expect(result.reordered).toBe(true);
      expect(result.added).toHaveLength(0);
      expect(result.removed).toHaveLength(0);
      expect(result.modified).toHaveLength(0);
    });
  });

  describe("validateVerificationArrays", () => {
    it("should validate all array fields in verification data", () => {
      const verificationData = {
        familyMembers: [
          { _id: "id-1", name: "John", age: 30 },
          { _id: "id-2", name: "Jane", age: 25 },
        ],
        businessOwnerDetails: [{ _id: "id-3", name: "Alice", role: "Owner" }],
        regularField: "not an array",
      };

      const result = service.validateVerificationArrays(verificationData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect validation errors in multiple arrays", () => {
      const verificationData = {
        familyMembers: [
          { _id: "id-1", name: "John" },
          { name: "Jane" }, // Missing ID
        ],
        businessOwnerDetails: [
          { _id: "id-1", name: "Alice" }, // Duplicate ID with familyMembers
        ],
      };

      const result = service.validateVerificationArrays(verificationData);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle null/undefined verification data", () => {
      expect(service.validateVerificationArrays(null).isValid).toBe(true);
      expect(service.validateVerificationArrays(undefined).isValid).toBe(true);
    });
  });

  describe("fixArrayData", () => {
    it("should add IDs to arrays recursively", () => {
      const data = {
        familyMembers: [
          { name: "John", age: 30 },
          { name: "Jane", age: 25 },
        ],
        nested: {
          businessOwners: [{ name: "Alice", role: "Owner" }],
        },
        regularField: "unchanged",
      };

      const result = service.fixArrayData(data);

      expect(result.familyMembers).toHaveLength(2);
      expect(result.familyMembers[0]).toHaveProperty("_id");
      expect(result.familyMembers[1]).toHaveProperty("_id");

      expect(result.nested.businessOwners).toHaveLength(1);
      expect(result.nested.businessOwners[0]).toHaveProperty("_id");

      expect(result.regularField).toBe("unchanged");
    });

    it("should handle non-object input", () => {
      expect(service.fixArrayData(null)).toBe(null);
      expect(service.fixArrayData("string")).toBe("string");
      expect(service.fixArrayData(123)).toBe(123);
    });
  });

  describe("Private helper methods", () => {
    it("should validate UUID format correctly", () => {
      // Access private method via bracket notation for testing
      const isValidId = (service as any).isValidId;

      expect(isValidId("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isValidId("not-a-uuid")).toBe(false);
      expect(isValidId("short")).toBe(false);
      expect(isValidId(123)).toBe(false);
      expect(isValidId(null)).toBe(false);
    });

    it("should validate field types correctly", () => {
      const validateFieldType = (service as any).validateFieldType;

      expect(validateFieldType("text", { type: "string" })).toBe(true);
      expect(validateFieldType(123, { type: "number" })).toBe(true);
      expect(validateFieldType(123, { type: "integer" })).toBe(true);
      expect(validateFieldType(true, { type: "boolean" })).toBe(true);
      expect(validateFieldType([], { type: "array" })).toBe(true);
      expect(validateFieldType({}, { type: "object" })).toBe(true);

      expect(validateFieldType("text", { type: "number" })).toBe(false);
      expect(validateFieldType(3.14, { type: "integer" })).toBe(false);
    });

    it("should check deep equality correctly", () => {
      const deepEqual = (service as any).deepEqual;

      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
      expect(deepEqual("test", "test")).toBe(true);
      expect(deepEqual(123, 123)).toBe(true);
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);

      expect(deepEqual("test", "different")).toBe(false);
      expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(deepEqual(null, undefined)).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty arrays", () => {
      const result = service.validateArrayData([], "emptyArray");
      expect(result.isValid).toBe(true);
    });

    it("should handle arrays with mixed data types", () => {
      const arrayData = [
        { _id: "id-1", name: "John" },
        "string item", // Non-object
        null, // Null item
        { _id: "id-2", name: "Jane" },
      ];

      const result = service.validateArrayData(arrayData, "mixedArray");
      expect(result.isValid).toBe(false);
    });

    it("should handle very large arrays", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        _id: `id-${i}`,
        name: `Person ${i}`,
      }));

      const result = service.validateArrayData(largeArray, "largeArray");
      expect(result.isValid).toBe(true);
    });
  });
});
