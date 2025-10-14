import {
  generateArrayItemId,
  ensureArrayItemId,
  ensureArrayItemsHaveIds,
  validateArrayItemIds,
  cleanArrayForSubmission,
  cloneArrayWithIds,
} from '../../src/helpers/arrayUtils';

describe('arrayUtils', () => {
  describe('generateArrayItemId', () => {
    it('should generate a valid UUID-like string', () => {
      const id = generateArrayItemId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(id).toMatch(
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
      );
    });

    it('should generate unique IDs', () => {
      const ids = Array.from({length: 100}, () => generateArrayItemId());
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });
  });

  describe('ensureArrayItemId', () => {
    it('should add _id to object without one', () => {
      const item = {name: 'John', age: 30};
      const result = ensureArrayItemId(item);

      expect(result).toHaveProperty('_id');
      expect(typeof result._id).toBe('string');
      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
    });

    it('should preserve existing _id', () => {
      const existingId = 'existing-id-123';
      const item = {_id: existingId, name: 'John'};
      const result = ensureArrayItemId(item);

      expect(result._id).toBe(existingId);
      expect(result.name).toBe('John');
    });

    it('should handle null/undefined items', () => {
      expect(ensureArrayItemId(null)).toBe(null);
      expect(ensureArrayItemId(undefined)).toBe(undefined);
    });

    it('should handle non-object items', () => {
      expect(ensureArrayItemId('string')).toBe('string');
      expect(ensureArrayItemId(123)).toBe(123);
      expect(ensureArrayItemId([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('ensureArrayItemsHaveIds', () => {
    it('should add IDs to all items in array', () => {
      const array = [
        {name: 'John', age: 30},
        {name: 'Jane', age: 25},
        {name: 'Bob', age: 35},
      ];

      const result = ensureArrayItemsHaveIds(array);

      expect(result).toHaveLength(3);
      result.forEach(item => {
        expect(item).toHaveProperty('_id');
        expect(typeof item._id).toBe('string');
      });

      // Check that all IDs are unique
      const ids = result.map(item => item._id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it('should preserve existing IDs and add missing ones', () => {
      const existingId = 'existing-123';
      const array = [
        {_id: existingId, name: 'John'},
        {name: 'Jane'}, // No ID
        {name: 'Bob'}, // No ID
      ];

      const result = ensureArrayItemsHaveIds(array);

      expect(result[0]._id).toBe(existingId);
      expect(result[1]).toHaveProperty('_id');
      expect(result[2]).toHaveProperty('_id');

      // All IDs should be unique
      const ids = result.map(item => item._id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it('should handle duplicate IDs by making them unique', () => {
      const duplicateId = 'duplicate-123';
      const array = [
        {_id: duplicateId, name: 'John'},
        {_id: duplicateId, name: 'Jane'},
        {_id: duplicateId, name: 'Bob'},
      ];

      const result = ensureArrayItemsHaveIds(array);

      // All IDs should be unique
      const ids = result.map(item => item._id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);

      // First item should keep original ID
      expect(result[0]._id).toBe(duplicateId);
      // Others should get modified IDs
      expect(result[1]._id).toMatch(/duplicate-123_\d+/);
      expect(result[2]._id).toMatch(/duplicate-123_\d+/);
    });

    it('should handle empty array', () => {
      const result = ensureArrayItemsHaveIds([]);
      expect(result).toEqual([]);
    });

    it('should handle non-array input', () => {
      const result = ensureArrayItemsHaveIds(null as any);
      expect(result).toEqual([]);
    });
  });

  describe('validateArrayItemIds', () => {
    it('should return true for array with unique IDs', () => {
      const array = [
        {_id: 'id-1', name: 'John'},
        {_id: 'id-2', name: 'Jane'},
        {_id: 'id-3', name: 'Bob'},
      ];

      expect(validateArrayItemIds(array)).toBe(true);
    });

    it('should return false for array with missing IDs', () => {
      const array = [
        {_id: 'id-1', name: 'John'},
        {name: 'Jane'}, // Missing ID
        {_id: 'id-3', name: 'Bob'},
      ];

      expect(validateArrayItemIds(array)).toBe(false);
    });

    it('should return false for array with duplicate IDs', () => {
      const array = [
        {_id: 'id-1', name: 'John'},
        {_id: 'id-1', name: 'Jane'}, // Duplicate ID
        {_id: 'id-3', name: 'Bob'},
      ];

      expect(validateArrayItemIds(array)).toBe(false);
    });

    it('should return true for empty array', () => {
      expect(validateArrayItemIds([])).toBe(true);
    });

    it('should return true for non-array input', () => {
      expect(validateArrayItemIds(null as any)).toBe(true);
      expect(validateArrayItemIds(undefined as any)).toBe(true);
    });
  });

  describe('cleanArrayForSubmission', () => {
    it('should remove empty objects but preserve IDs', () => {
      const array = [
        {_id: 'id-1', name: 'John', age: 30},
        {_id: 'id-2'}, // Only ID, should be removed
        {_id: 'id-3', name: '', age: 0}, // Empty strings and zero values, should be kept
        {name: 'Jane'}, // No ID, will get one but has content
        {}, // Completely empty, should be removed
      ];

      const result = cleanArrayForSubmission(array);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({_id: 'id-1', name: 'John', age: 30});
      expect(result[1]).toEqual({_id: 'id-3', name: '', age: 0});
      expect(result[2]).toHaveProperty('_id');
      expect(result[2].name).toBe('Jane');
    });

    it('should ensure all remaining items have IDs', () => {
      const array = [
        {name: 'John', age: 30},
        {name: 'Jane', age: 25},
      ];

      const result = cleanArrayForSubmission(array);

      expect(result).toHaveLength(2);
      result.forEach(item => {
        expect(item).toHaveProperty('_id');
        expect(typeof item._id).toBe('string');
      });
    });

    it('should handle non-array input', () => {
      expect(cleanArrayForSubmission(null as any)).toEqual([]);
      expect(cleanArrayForSubmission(undefined as any)).toEqual([]);
    });
  });

  describe('cloneArrayWithIds', () => {
    it('should create deep copy of array', () => {
      const original = [
        {_id: 'id-1', name: 'John', details: {age: 30}},
        {_id: 'id-2', name: 'Jane', details: {age: 25}},
      ];

      const cloned = cloneArrayWithIds(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[0]).not.toBe(original[0]);

      // Modify original to ensure deep copy
      original[0].name = 'Modified';
      original[0].details.age = 999;

      expect(cloned[0].name).toBe('John');
      expect(cloned[0].details.age).toBe(30);
    });

    it('should handle non-array input', () => {
      expect(cloneArrayWithIds(null as any)).toEqual([]);
      expect(cloneArrayWithIds(undefined as any)).toEqual([]);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: generate, validate, clean', () => {
      // Start with mixed data
      const originalArray = [
        {name: 'John', age: 30},
        {_id: 'existing-id', name: 'Jane', age: 25},
        {name: ''}, // Should be cleaned out
        {}, // Should be cleaned out
        {name: 'Bob', age: 35},
      ];

      // Step 1: Ensure IDs
      const withIds = ensureArrayItemsHaveIds(originalArray);
      expect(withIds).toHaveLength(5);

      // Step 2: Clean for submission
      const cleaned = cleanArrayForSubmission(withIds);
      expect(cleaned).toHaveLength(3); // Only items with real content

      // Step 3: Validate
      expect(validateArrayItemIds(cleaned)).toBe(true);

      // Verify content
      expect(cleaned.find(item => item.name === 'John')).toBeDefined();
      expect(cleaned.find(item => item.name === 'Jane')?._id).toBe(
        'existing-id',
      );
      expect(cleaned.find(item => item.name === 'Bob')).toBeDefined();
    });
  });
});


