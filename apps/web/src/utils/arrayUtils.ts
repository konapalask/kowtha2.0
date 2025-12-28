/**
 * Array utilities for web app with unique ID support
 */

export interface ArrayItemWithId {
  _id?: string;
  [key: string]: any;
}

/**
 * Generate a unique ID for array items (UUID v4)
 */
export const generateArrayItemId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Ensure array item has unique ID, generate if missing
 */
export const ensureArrayItemId = (item: any): ArrayItemWithId => {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    return {
      ...item,
      _id: item._id || generateArrayItemId(),
    };
  }
  return item;
};

/**
 * Ensure all items in array have unique IDs
 */
export const ensureArrayItemsHaveIds = (array: any[]): ArrayItemWithId[] => {
  if (!Array.isArray(array)) {
    return [];
  }

  const usedIds = new Set<string>();

  return array.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return item;
    }

    let id = item._id;

    // Generate ID if missing
    if (!id) {
      id = generateArrayItemId();
    }

    // Ensure ID is unique within this array
    let uniqueId = id;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}_${counter}`;
      counter++;
    }

    usedIds.add(uniqueId);

    return {
      ...item,
      _id: uniqueId,
    };
  });
};

/**
 * Validate array has unique IDs for all items
 */
export const validateArrayItemIds = (array: any[]): boolean => {
  if (!Array.isArray(array)) {
    return true;
  }

  const ids = array
    .filter((item) => item && typeof item === "object")
    .map((item) => item._id)
    .filter((id) => id);

  // Check if all items have IDs and they are unique
  const uniqueIds = new Set(ids);
  return ids.length === array.length && uniqueIds.size === ids.length;
};

/**
 * Clean array data for submission (preserve IDs, remove empty items)
 */
export const cleanArrayForSubmission = (array: any[]): ArrayItemWithId[] => {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.map(ensureArrayItemId).filter((item) => {
    // Remove empty objects (but keep objects with only _id if they have other data)
    if (!item || typeof item !== "object") return false;

    const keys = Object.keys(item).filter((key) => key !== "_id");
    if (keys.length === 0) return false;

    // Check if any of the values are non-empty
    return keys.some((key) => {
      const value = item[key];
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    });
  });
};

/**
 * Deep clone array with IDs preserved
 */
export const cloneArrayWithIds = (array: any[]): ArrayItemWithId[] => {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.map((item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return { ...item };
    }
    return item;
  });
};

/**
 * Convert Ant Design Form.List data to proper array with IDs
 */
export const convertFormListToArray = (
  formListData: any[]
): ArrayItemWithId[] => {
  if (!Array.isArray(formListData)) {
    return [];
  }

  return formListData.map((item) => ensureArrayItemId(item));
};

/**
 * Prepare array data for Ant Design Form.List
 */
export const prepareArrayForFormList = (array: any[]): any[] => {
  const arrayWithIds = ensureArrayItemsHaveIds(array);

  // Ant Design Form.List expects objects without the Antd internal fields
  return arrayWithIds.map((item) => ({ ...item }));
};

/**
 * Find array changes between old and new arrays
 */
export const findArrayChanges = (oldArray: any[], newArray: any[]) => {
  const oldItems = ensureArrayItemsHaveIds(oldArray || []);
  const newItems = ensureArrayItemsHaveIds(newArray || []);

  const oldItemsMap = new Map(oldItems.map((item) => [item._id, item]));
  const newItemsMap = new Map(newItems.map((item) => [item._id, item]));

  const added: ArrayItemWithId[] = [];
  const removed: ArrayItemWithId[] = [];
  const modified: {
    id: string;
    oldItem: ArrayItemWithId;
    newItem: ArrayItemWithId;
    changedFields: string[];
  }[] = [];

  // Find added items
  newItems.forEach((item) => {
    if (item._id && !oldItemsMap.has(item._id)) {
      added.push(item);
    }
  });

  // Find removed items
  oldItems.forEach((item) => {
    if (item._id && !newItemsMap.has(item._id)) {
      removed.push(item);
    }
  });

  // Find modified items
  newItems.forEach((newItem) => {
    if (newItem._id && oldItemsMap.has(newItem._id)) {
      const oldItem = oldItemsMap.get(newItem._id)!;
      const changedFields = findChangedFields(oldItem, newItem);

      if (changedFields.length > 0) {
        modified.push({
          id: newItem._id,
          oldItem,
          newItem,
          changedFields,
        });
      }
    }
  });

  return {
    added,
    removed,
    modified,
    hasChanges: added.length > 0 || removed.length > 0 || modified.length > 0,
  };
};

/**
 * Find changed fields between two objects
 */
export const findChangedFields = (oldItem: any, newItem: any): string[] => {
  const changedFields: string[] = [];

  const allKeys = new Set([
    ...Object.keys(oldItem || {}),
    ...Object.keys(newItem || {}),
  ]);

  allKeys.forEach((key) => {
    if (key === "_id") return; // Skip ID comparison

    const oldValue = oldItem?.[key];
    const newValue = newItem?.[key];

    if (!deepEqual(oldValue, newValue)) {
      changedFields.push(key);
    }
  });

  return changedFields;
};

/**
 * Deep equality check
 */
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }

  return a === b;
};

