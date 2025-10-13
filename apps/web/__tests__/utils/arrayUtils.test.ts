import {
  generateArrayItemId,
  ensureArrayItemId,
  ensureArrayItemsHaveIds,
  validateArrayItemIds,
  cleanArrayForSubmission,
  cloneArrayWithIds,
  convertFormListToArray,
  prepareArrayForFormList,
  findArrayChanges,
  findChangedFields,
  deepEqual,
} from "../../src/utils/arrayUtils";

describe("Web arrayUtils", () => {
  describe("generateArrayItemId", () => {
    it("should generate a valid UUID-like string", () => {
      const id = generateArrayItemId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
      expect(id).toMatch(
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
      );
    });

    it("should generate unique IDs", () => {
      const ids = Array.from({ length: 100 }, () => generateArrayItemId());
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });
  });

  describe("ensureArrayItemId", () => {
    it("should add _id to object without one", () => {
      const item = { name: "John", age: 30 };
      const result = ensureArrayItemId(item);

      expect(result).toHaveProperty("_id");
      expect(typeof result._id).toBe("string");
      expect(result.name).toBe("John");
      expect(result.age).toBe(30);
    });

    it("should preserve existing _id", () => {
      const existingId = "existing-id-123";
      const item = { _id: existingId, name: "John" };
      const result = ensureArrayItemId(item);

      expect(result._id).toBe(existingId);
      expect(result.name).toBe("John");
    });

    it("should handle non-object items", () => {
      expect(ensureArrayItemId(null)).toBe(null);
      expect(ensureArrayItemId("string")).toBe("string");
      expect(ensureArrayItemId([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe("findArrayChanges", () => {
    it("should detect added items", () => {
      const oldArray = [{ _id: "id-1", name: "John", age: 30 }];
      const newArray = [
        { _id: "id-1", name: "John", age: 30 },
        { _id: "id-2", name: "Jane", age: 25 }, // Added
      ];

      const result = findArrayChanges(oldArray, newArray);

      expect(result.hasChanges).toBe(true);
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

      const result = findArrayChanges(oldArray, newArray);

      expect(result.hasChanges).toBe(true);
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

      const result = findArrayChanges(oldArray, newArray);

      expect(result.hasChanges).toBe(true);
      expect(result.modified).toHaveLength(2);

      const johnChange = result.modified.find((m) => m.id === "id-1");
      expect(johnChange?.changedFields).toContain("age");

      const janeChange = result.modified.find((m) => m.id === "id-2");
      expect(janeChange?.changedFields).toContain("name");
    });

    it("should detect no changes when arrays are identical", () => {
      const array = [
        { _id: "id-1", name: "John", age: 30 },
        { _id: "id-2", name: "Jane", age: 25 },
      ];

      const result = findArrayChanges(array, array);

      expect(result.hasChanges).toBe(false);
      expect(result.added).toHaveLength(0);
      expect(result.removed).toHaveLength(0);
      expect(result.modified).toHaveLength(0);
    });
  });

  describe("findChangedFields", () => {
    it("should identify changed fields", () => {
      const oldItem = { _id: "id-1", name: "John", age: 30, city: "NYC" };
      const newItem = { _id: "id-1", name: "John Smith", age: 30, city: "LA" };

      const result = findChangedFields(oldItem, newItem);

      expect(result).toContain("name");
      expect(result).toContain("city");
      expect(result).not.toContain("age");
      expect(result).not.toContain("_id");
    });

    it("should handle added and removed fields", () => {
      const oldItem = { _id: "id-1", name: "John", oldField: "value" };
      const newItem = { _id: "id-1", name: "John", newField: "value" };

      const result = findChangedFields(oldItem, newItem);

      expect(result).toContain("oldField");
      expect(result).toContain("newField");
      expect(result).not.toContain("name");
      expect(result).not.toContain("_id");
    });

    it("should handle null/undefined values", () => {
      const oldItem = { _id: "id-1", name: "John", value: null };
      const newItem = { _id: "id-1", name: "John", value: undefined };

      const result = findChangedFields(oldItem, newItem);

      expect(result).toContain("value");
    });
  });

  describe("deepEqual", () => {
    it("should compare primitive values correctly", () => {
      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
      expect(deepEqual("test", "test")).toBe(true);
      expect(deepEqual(123, 123)).toBe(true);
      expect(deepEqual(true, true)).toBe(true);

      expect(deepEqual("test", "different")).toBe(false);
      expect(deepEqual(123, 456)).toBe(false);
      expect(deepEqual(true, false)).toBe(false);
      expect(deepEqual(null, undefined)).toBe(false);
    });

    it("should compare arrays correctly", () => {
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(deepEqual([], [])).toBe(true);
      expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);

      expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
      expect(deepEqual([{ a: 1 }], [{ a: 2 }])).toBe(false);
    });

    it("should compare objects correctly", () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(deepEqual({}, {})).toBe(true);
      expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);

      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });
  });

  describe("convertFormListToArray", () => {
    it("should convert Ant Design Form.List data to array with IDs", () => {
      const formListData = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];

      const result = convertFormListToArray(formListData);

      expect(result).toHaveLength(2);
      result.forEach((item) => {
        expect(item).toHaveProperty("_id");
        expect(typeof item._id).toBe("string");
      });
    });

    it("should handle non-array input", () => {
      expect(convertFormListToArray(null as any)).toEqual([]);
      expect(convertFormListToArray(undefined as any)).toEqual([]);
    });
  });

  describe("prepareArrayForFormList", () => {
    it("should prepare array data for Ant Design Form.List", () => {
      const array = [
        { name: "John", age: 30 },
        { _id: "existing-id", name: "Jane", age: 25 },
      ];

      const result = prepareArrayForFormList(array);

      expect(result).toHaveLength(2);
      result.forEach((item) => {
        expect(item).toHaveProperty("_id");
        expect(typeof item._id).toBe("string");
      });

      // Should maintain existing ID
      expect(result.find((item) => item.name === "Jane")?._id).toBe(
        "existing-id"
      );
    });
  });

  describe("cleanArrayForSubmission", () => {
    it("should clean array and ensure proper IDs", () => {
      const array = [
        { _id: "id-1", name: "John", age: 30 },
        { _id: "id-2" }, // Only ID, should be removed
        { name: "Jane", age: 25 }, // No ID, will get one
        {}, // Empty, should be removed
        { _id: "id-3", name: "", age: null }, // Empty values but has structure
      ];

      const result = cleanArrayForSubmission(array);

      expect(result.length).toBeLessThan(array.length);
      result.forEach((item) => {
        expect(item).toHaveProperty("_id");
        expect(typeof item._id).toBe("string");
      });

      // Should keep items with actual content
      expect(result.find((item) => item.name === "John")).toBeDefined();
      expect(result.find((item) => item.name === "Jane")).toBeDefined();
    });

    it("should filter out items with only whitespace", () => {
      const array = [
        { _id: "id-1", name: "   ", age: 30 }, // Whitespace name
        { _id: "id-2", name: "John", age: 30 }, // Valid
        { _id: "id-3", description: "\t\n" }, // Whitespace description
      ];

      const result = cleanArrayForSubmission(array);

      expect(result).toHaveLength(2); // Only items with real content
      expect(result.find((item) => item.name === "John")).toBeDefined();
      expect(
        result.find((item) => item.age === 30 && item.name !== "   ")
      ).toBeDefined();
    });
  });

  describe("cloneArrayWithIds", () => {
    it("should create deep copy of array", () => {
      const original = [
        { _id: "id-1", name: "John", details: { age: 30 } },
        { _id: "id-2", name: "Jane", details: { age: 25 } },
      ];

      const cloned = cloneArrayWithIds(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[0]).not.toBe(original[0]);

      // Modify original to ensure deep copy
      original[0].name = "Modified";
      original[0].details.age = 999;

      expect(cloned[0].name).toBe("John");
      expect(cloned[0].details.age).toBe(30);
    });
  });

  describe("validateArrayItemIds", () => {
    it("should validate arrays with unique IDs", () => {
      const array = [
        { _id: "id-1", name: "John" },
        { _id: "id-2", name: "Jane" },
        { _id: "id-3", name: "Bob" },
      ];

      expect(validateArrayItemIds(array)).toBe(true);
    });

    it("should detect missing IDs", () => {
      const array = [
        { _id: "id-1", name: "John" },
        { name: "Jane" }, // Missing ID
        { _id: "id-3", name: "Bob" },
      ];

      expect(validateArrayItemIds(array)).toBe(false);
    });

    it("should detect duplicate IDs", () => {
      const array = [
        { _id: "id-1", name: "John" },
        { _id: "id-1", name: "Jane" }, // Duplicate
        { _id: "id-3", name: "Bob" },
      ];

      expect(validateArrayItemIds(array)).toBe(false);
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete Form.List workflow", () => {
      // Start with form data (might not have IDs)
      const formData = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];

      // Prepare for Form.List
      const prepared = prepareArrayForFormList(formData);
      expect(prepared).toHaveLength(2);
      expect(validateArrayItemIds(prepared)).toBe(true);

      // Simulate form editing (Form.List returns similar data)
      const edited = [
        { ...prepared[0], age: 31 }, // Modified
        prepared[1], // Unchanged
        { _id: generateArrayItemId(), name: "Bob", age: 35 }, // Added
      ];

      // Clean for submission
      const cleaned = cleanArrayForSubmission(edited);
      expect(cleaned).toHaveLength(3);
      expect(validateArrayItemIds(cleaned)).toBe(true);

      // Detect changes
      const changes = findArrayChanges(prepared, cleaned);
      expect(changes.hasChanges).toBe(true);
      expect(changes.added).toHaveLength(1);
      expect(changes.modified).toHaveLength(1);
      expect(changes.removed).toHaveLength(0);
    });

    it("should maintain data integrity through multiple operations", () => {
      let data = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];

      // Step 1: Ensure IDs
      data = ensureArrayItemsHaveIds(data);
      expect(validateArrayItemIds(data)).toBe(true);

      // Step 2: Clone for editing
      const cloned = cloneArrayWithIds(data);
      cloned[0].age = 31; // Modify clone

      // Step 3: Detect changes
      const changes = findArrayChanges(data, cloned);
      expect(changes.hasChanges).toBe(true);
      expect(changes.modified[0].changedFields).toContain("age");

      // Step 4: Clean for submission
      const cleaned = cleanArrayForSubmission(cloned);
      expect(validateArrayItemIds(cleaned)).toBe(true);
      expect(cleaned[0].age).toBe(31);
    });
  });
});
