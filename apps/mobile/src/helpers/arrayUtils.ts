import uuid from 'react-native-uuid';

/**
 * Utility functions for array operations with unique IDs
 */

export interface ArrayItemWithId {
  _id?: string;
  [key: string]: any;
}

/**
 * Generate a unique ID for array items
 */
export const generateArrayItemId = (): string => {
  return uuid.v4() as string;
};

/**
 * Ensure array item has unique ID, generate if missing
 */
export const ensureArrayItemId = (item: any): ArrayItemWithId => {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
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

  return array.map(ensureArrayItemId);
};

/**
 * Validate array has unique IDs for all items
 */
export const validateArrayItemIds = (array: any[]): boolean => {
  if (!Array.isArray(array)) {
    return true;
  }

  const ids = array
    .filter(item => item && typeof item === 'object')
    .map(item => item._id)
    .filter(id => id);

  // Check if all items have IDs and they are unique
  const uniqueIds = new Set(ids);
  return ids.length === array.length && uniqueIds.size === ids.length;
};

/**
 * Clean array data for submission (preserve IDs)
 */
export const cleanArrayForSubmission = (array: any[]): ArrayItemWithId[] => {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.map(ensureArrayItemId).filter(item => {
    // Remove empty objects (but keep objects with only _id)
    if (!item || typeof item !== 'object') return false;

    const keys = Object.keys(item).filter(key => key !== '_id');
    return keys.length > 0;
  });
};

/**
 * Deep clone array with IDs preserved
 */
export const cloneArrayWithIds = (array: any[]): ArrayItemWithId[] => {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.map(item => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return {...item};
    }
    return item;
  });
};


