import { Injectable, BadRequestException } from "@nestjs/common";
import { LoggingService } from "../../common/logging/logging.service";

export interface ArrayItemWithId {
  _id?: string;
  [key: string]: any;
}

export interface ArrayValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fixedData?: any;
}

export interface ArrayChangeMetadata {
  added: ArrayItemWithId[];
  removed: ArrayItemWithId[];
  modified: {
    id: string;
    oldItem: ArrayItemWithId;
    newItem: ArrayItemWithId;
    changedFields: string[];
  }[];
  reordered: boolean;
}

@Injectable()
export class ArrayValidationService {
  constructor(private loggingService: LoggingService) {}

  /**
   * Validate array data integrity
   */
  validateArrayData(
    arrayData: any,
    fieldName: string,
    schema?: any
  ): ArrayValidationResult {
    const result: ArrayValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!Array.isArray(arrayData)) {
      result.isValid = false;
      result.errors.push(`Field ${fieldName} must be an array`);
      return result;
    }

    // Check for unique IDs
    const ids = arrayData
      .filter((item) => item && typeof item === "object")
      .map((item) => item._id)
      .filter((id) => id);

    const uniqueIds = new Set(ids);

    // Check if all items have IDs
    if (ids.length !== arrayData.length) {
      result.isValid = false;
      result.errors.push(`Some items in ${fieldName} are missing unique IDs`);
    }

    // Check for duplicate IDs
    if (uniqueIds.size !== ids.length) {
      result.isValid = false;
      result.errors.push(`Duplicate IDs found in ${fieldName}`);
    }

    // Validate ID format (should be UUID-like)
    const invalidIds = ids.filter((id) => !this.isValidId(id));
    if (invalidIds.length > 0) {
      result.warnings.push(
        `Invalid ID format in ${fieldName}: ${invalidIds.join(", ")}`
      );
    }

    // Schema validation if provided
    if (schema && schema.items && schema.items.properties) {
      const requiredFields = schema.items.required || [];

      arrayData.forEach((item, index) => {
        if (!item || typeof item !== "object") {
          result.errors.push(
            `Item ${index} in ${fieldName} is not a valid object`
          );
          return;
        }

        // Check required fields
        requiredFields.forEach((requiredField: string) => {
          if (
            requiredField !== "_id" &&
            !this.hasValidValue(item[requiredField])
          ) {
            result.warnings.push(
              `Item ${index} in ${fieldName} missing required field: ${requiredField}`
            );
          }
        });

        // Validate field types
        Object.entries(schema.items.properties).forEach(
          ([fieldKey, fieldSchema]: [string, any]) => {
            if (item[fieldKey] !== undefined && item[fieldKey] !== null) {
              if (!this.validateFieldType(item[fieldKey], fieldSchema)) {
                result.warnings.push(
                  `Item ${index} in ${fieldName}.${fieldKey} has invalid type`
                );
              }
            }
          }
        );
      });
    }

    if (result.errors.length > 0) {
      result.isValid = false;
    }

    return result;
  }

  /**
   * Ensure all array items have unique IDs
   */
  ensureArrayHasIds(arrayData: any[]): ArrayItemWithId[] {
    if (!Array.isArray(arrayData)) {
      return [];
    }

    const usedIds = new Set<string>();

    return arrayData.map((item) => {
      if (!item || typeof item !== "object") {
        return item;
      }

      let id = item._id;

      // Generate ID if missing
      if (!id) {
        id = this.generateUniqueId();
      }

      // Ensure ID is unique
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
  }

  /**
   * Compare two arrays and generate change metadata
   */
  detectArrayChanges(
    oldArray: ArrayItemWithId[],
    newArray: ArrayItemWithId[]
  ): ArrayChangeMetadata {
    const oldItems = Array.isArray(oldArray) ? oldArray : [];
    const newItems = Array.isArray(newArray) ? newArray : [];

    const oldItemsMap = new Map(oldItems.map((item) => [item._id, item]));
    const newItemsMap = new Map(newItems.map((item) => [item._id, item]));

    const added: ArrayItemWithId[] = [];
    const removed: ArrayItemWithId[] = [];
    const modified: ArrayChangeMetadata["modified"] = [];

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
        const changedFields = this.findChangedFields(oldItem, newItem);

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

    // Check if order changed
    const oldIds = oldItems.map((item) => item._id).filter((id) => id);
    const newIds = newItems.map((item) => item._id).filter((id) => id);
    const reordered = !this.arraysEqual(oldIds, newIds);

    return {
      added,
      removed,
      modified,
      reordered,
    };
  }

  /**
   * Validate verification data arrays
   */
  validateVerificationArrays(verificationData: any): ArrayValidationResult {
    const result: ArrayValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!verificationData || typeof verificationData !== "object") {
      return result;
    }

    // Common array fields to validate
    const arrayFields = [
      "familyMembers",
      "familyMemberDetails",
      "familyDetails",
      "businessOwnerDetails",
      "shareholdingDetails",
      "employees",
      "suppliers",
      "customers",
      "assets",
      "liabilities",
    ];

    Object.entries(verificationData).forEach(([key, value]) => {
      if (Array.isArray(value) || arrayFields.includes(key)) {
        if (Array.isArray(value) && value.length > 0) {
          const validation = this.validateArrayData(value, key);

          if (!validation.isValid) {
            result.isValid = false;
            result.errors.push(...validation.errors);
          }

          result.warnings.push(...validation.warnings);
        }
      }
    });

    return result;
  }

  /**
   * Fix array data by adding missing IDs
   */
  fixArrayData(data: any): any {
    if (!data || typeof data !== "object") {
      return data;
    }

    const fixed = { ...data };

    Object.entries(fixed).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        fixed[key] = this.ensureArrayHasIds(value);
      } else if (value && typeof value === "object") {
        fixed[key] = this.fixArrayData(value);
      }
    });

    return fixed;
  }

  // Private helper methods

  private isValidId(id: any): boolean {
    if (typeof id !== "string") return false;

    // Check if it's a valid UUID format or similar
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id) || (id.length >= 8 && id.length <= 64);
  }

  private hasValidValue(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  }

  private validateFieldType(value: any, schema: any): boolean {
    if (!schema || !schema.type) return true;

    switch (schema.type) {
      case "string":
        return typeof value === "string";
      case "number":
        return typeof value === "number" && !isNaN(value);
      case "integer":
        return typeof value === "number" && Number.isInteger(value);
      case "boolean":
        return typeof value === "boolean";
      case "array":
        return Array.isArray(value);
      case "object":
        return value && typeof value === "object" && !Array.isArray(value);
      default:
        return true;
    }
  }

  private findChangedFields(oldItem: any, newItem: any): string[] {
    const changedFields: string[] = [];

    const allKeys = new Set([
      ...Object.keys(oldItem || {}),
      ...Object.keys(newItem || {}),
    ]);

    allKeys.forEach((key) => {
      if (key === "_id") return; // Skip ID comparison

      const oldValue = oldItem?.[key];
      const newValue = newItem?.[key];

      if (!this.deepEqual(oldValue, newValue)) {
        changedFields.push(key);
      }
    });

    return changedFields;
  }

  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== typeof b) return false;

    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      return a.every((item, index) => this.deepEqual(item, b[index]));
    }

    if (typeof a === "object") {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every((key) => this.deepEqual(a[key], b[key]));
    }

    return a === b;
  }

  private arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((item, index) => item === b[index]);
  }

  private generateUniqueId(): string {
    // Simple UUID v4 generator
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
