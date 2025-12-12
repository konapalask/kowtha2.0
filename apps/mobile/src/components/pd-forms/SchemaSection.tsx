import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useForm} from 'react-hook-form';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import {InputFormItem} from '../../lib/InputFormItem';
import {SelectFormItem} from '../../lib/SelectFormItem';
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';
// import {CheckboxFormItem} from '../../lib/CheckboxFormItem';
import {RadioFormItem} from '../../lib/RadioFormItem';
import {
  generateArrayItemId,
  ensureArrayItemsHaveIds,
  validateArrayItemIds,
  cleanArrayForSubmission,
  ArrayItemWithId,
} from '../../helpers/arrayUtils';

type AnyObject = Record<string, any>;

interface JsonSchemaProperty {
  type: string;
  title: string;
  readOnly?: boolean;
  enum?: string[];
  pattern?: string;
  items?: JsonSchemaProperty;
  properties?: Record<string, JsonSchemaProperty>;
  format?: string;
  formatter?: {
    useIndianFormat?: boolean;
    locale?: string;
    maxDecimalPlaces?: number;
    minDecimalPlaces?: number;
    showCurrency?: boolean;
    currency?: string;
  };
  maxLength?: number;
  ui?: {
    widget?: string;
    rows?: number;
    maxLength?: number;
  };
  ['ui:options']?: {
    widget?: string;
    rows?: number;
    maxLength?: number;
  };
  dependencies?: {
    show?: Record<string, any>;
    required?: Record<string, any>;
  };
}

interface JsonSchema {
  type: string;
  properties: Record<string, JsonSchemaProperty>;
  required?: string[];
}

interface SchemaSectionProps {
  title: string;
  schema: JsonSchema;
  initialData?: AnyObject;
  onSubmit: (data: AnyObject) => void;
}

const getUiSettings = (property: JsonSchemaProperty) => {
  return property?.ui || (property as AnyObject)?.['ui:options'] || {};
};

const shouldUseTextArea = (property: JsonSchemaProperty): boolean => {
  const ui = getUiSettings(property);
  return ui?.widget === 'textarea' || ui?.widget === 'richtext';
};

const getTextAreaLines = (property: JsonSchemaProperty): number | undefined => {
  const ui = getUiSettings(property);
  if (typeof ui?.rows === 'number') {
    return ui.rows;
  }
  return 5;
};

const getMaxLength = (property: JsonSchemaProperty): number | undefined => {
  if (typeof property.maxLength === 'number') {
    return property.maxLength;
  }
  const ui = getUiSettings(property);
  if (typeof ui?.maxLength === 'number') {
    return ui.maxLength;
  }
  return undefined;
};

const SchemaSection: React.FC<SchemaSectionProps> = ({
  title,
  schema,
  initialData = {},
  onSubmit,
}) => {
  // console.log('schema', schema);
  // Helper function to convert numbers to strings for TextInput compatibility
  const normalizeFormData = (data: AnyObject): AnyObject => {
    const normalized: AnyObject = {};
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'number') {
        normalized[key] = value.toString();
      } else if (Array.isArray(value)) {
        // Handle arrays (e.g., repeater fields) - ensure all items have unique IDs
        normalized[key] = ensureArrayItemsHaveIds(value).map(item =>
          typeof item === 'object' && item !== null
            ? normalizeFormData(item)
            : typeof item === 'number'
            ? (item as any).toString()
            : item,
        );
      } else if (value && typeof value === 'object') {
        // Handle nested objects - preserve _id if present
        normalized[key] = normalizeFormData(value);
      } else {
        normalized[key] = value;
      }
    });

    // Initialize nested object structures from schema if they don't exist in data
    // This ensures React Hook Form can handle nested paths like "currentAssets.prepaidInsurance"
    if (schema?.properties) {
      Object.entries(schema.properties).forEach(([fieldId, property]) => {
        if (
          property.type === 'object' &&
          property.properties &&
          !normalized[fieldId]
        ) {
          // Initialize empty object for nested fields
          normalized[fieldId] = {};
        }
      });
    }

    return normalized;
  };

  const {control, watch, setValue, getValues, reset, trigger} = useForm({
    defaultValues: normalizeFormData(initialData),
    mode: 'onBlur', // Validate on blur so required errors appear immediately after clearing
    reValidateMode: 'onChange', // Once invalid, keep error until value becomes valid
    criteriaMode: 'firstError',
    shouldFocusError: true,
  });

  // Formula evaluation utility
  const evaluateFormula = (
    formula: string,
    formValues: Record<string, any>,
  ): number | null => {
    if (!formula || typeof formula !== 'string') return null;

    try {
      let evaluatedFormula = formula;

      // Extract all field names from the formula (words that match JavaScript identifier pattern)
      // This regex matches valid JavaScript identifiers in the formula
      const fieldNameMatches = formula.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g);
      const fieldNamesInFormula = fieldNameMatches || [];

      // Replace all field references in the formula with their numeric values
      // Treat empty/missing values as 0
      for (const fieldName of fieldNamesInFormula) {
        // Skip JavaScript keywords and built-in functions
        const jsKeywords = [
          'true',
          'false',
          'null',
          'undefined',
          'NaN',
          'Infinity',
        ];
        if (jsKeywords.includes(fieldName)) continue;

        const regex = new RegExp(`\\b${fieldName}\\b`, 'g');
        const value = formValues[fieldName];

        // Treat empty/missing values as 0
        let numValue = 0;
        if (value !== undefined && value !== null && value !== '') {
          const parsed =
            typeof value === 'number' ? value : parseFloat(String(value));
          if (!isNaN(parsed)) {
            numValue = parsed;
          }
        }

        evaluatedFormula = evaluatedFormula.replace(regex, String(numValue));
      }

      // Safely evaluate the formula using Function constructor
      const result = Function(
        '"use strict"; return (' + evaluatedFormula + ')',
      )();
      return typeof result === 'number' && !isNaN(result) ? result : null;
    } catch (error) {
      // If evaluation fails, return null (field dependencies might not be filled yet)
      return null;
    }
  };

  const [datePickerState, setDatePickerState] = useState<{
    visible: boolean;
    fieldKey: string | null;
    mode: 'date' | 'time' | 'datetime';
  }>({visible: false, fieldKey: null, mode: 'date'});

  // Hydrate default values once on mount to avoid wiping user input/errors on every keystroke
  const didHydrateRef = useRef(false);
  useEffect(() => {
    if (didHydrateRef.current) return;
    if (initialData && Object.keys(initialData).length > 0) {
      reset(normalizeFormData(initialData), {
        keepDirtyValues: true,
        keepErrors: true,
      });
    }
    didHydrateRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function to convert string values back to numbers for numeric fields
  const denormalizeFormData = (
    data: AnyObject,
    schemaProps: any = schema.properties,
  ): AnyObject => {
    const denormalized: AnyObject = {};
    Object.entries(data).forEach(([key, value]) => {
      const fieldSchema = schemaProps?.[key];

      if (fieldSchema?.type === 'number' || fieldSchema?.type === 'integer') {
        // Convert string back to number if it's a valid number
        if (typeof value === 'string' && value !== '') {
          const numValue = Number(value);
          denormalized[key] = isNaN(numValue) ? value : numValue;
        } else {
          denormalized[key] = value;
        }
      } else if (Array.isArray(value)) {
        // Handle arrays (e.g., repeater fields) - clean and preserve IDs
        denormalized[key] = cleanArrayForSubmission(
          value.map(item =>
            typeof item === 'object' && item !== null
              ? denormalizeFormData(item, fieldSchema?.items?.properties)
              : item,
          ),
        );
      } else if (
        value &&
        typeof value === 'object' &&
        fieldSchema?.type === 'object'
      ) {
        // Recursively handle nested objects with their schema - preserve _id
        denormalized[key] = denormalizeFormData(value, fieldSchema?.properties);
      } else {
        denormalized[key] = value;
      }
    });
    return denormalized;
  };

  // Helper function to recursively evaluate formulas in nested objects
  const evaluateNestedFormulas = (
    properties: Record<string, JsonSchemaProperty>,
    objectValues: AnyObject, // Values from the current object level (top-level or nested)
    parentKey: string = '', // Parent object key if nested (e.g., "cashFlowAnalysisDuringPD")
    calculatedSoFar: Record<string, any> = {}, // Previously calculated values in this object
  ): Record<string, any> => {
    const calculatedFields: Record<string, any> = {};
    const currentCalculated: Record<string, any> = {...calculatedSoFar};

    Object.entries(properties).forEach(([fieldId, property]) => {
      // Check if this field has a formula
      if ((property as any).formula) {
        // Build numeric values map from the current object's values
        // Include both raw form values AND previously calculated values
        const numericValues: Record<string, any> = {};

        // First, include all fields from the current object level (raw form values)
        Object.entries(objectValues).forEach(([key, val]) => {
          const fieldSchema = properties[key];
          if (
            fieldSchema?.type === 'number' ||
            fieldSchema?.type === 'integer'
          ) {
            const numVal =
              typeof val === 'number' ? val : parseFloat(String(val));
            numericValues[key] = isNaN(numVal) ? 0 : numVal;
          } else {
            numericValues[key] =
              val === undefined || val === null || val === '' ? 0 : val;
          }
        });

        // Include previously calculated values (for formulas that depend on other calculated fields)
        Object.entries(currentCalculated).forEach(([key, val]) => {
          if (!(key in numericValues)) {
            const numVal =
              typeof val === 'number' ? val : parseFloat(String(val));
            numericValues[key] = isNaN(numVal) ? 0 : numVal;
          }
        });

        // Ensure all schema properties are included (in case formula references fields not yet in objectValues)
        Object.keys(properties).forEach(key => {
          if (!(key in numericValues)) {
            numericValues[key] = 0;
          }
        });

        const calculatedValue = evaluateFormula(
          (property as any).formula,
          numericValues,
        );
        if (calculatedValue !== null && !isNaN(calculatedValue)) {
          const calculatedStr = calculatedValue.toString();
          // Store in currentCalculated for subsequent formulas to use
          currentCalculated[fieldId] = calculatedValue;

          if (parentKey) {
            // Nested field - store in nested structure
            if (!calculatedFields[parentKey]) {
              calculatedFields[parentKey] = {};
            }
            calculatedFields[parentKey][fieldId] = calculatedStr;
          } else {
            // Top-level field
            calculatedFields[fieldId] = calculatedStr;
          }
        }
      }

      // Recursively check nested object properties
      if (property.type === 'object' && property.properties) {
        const nestedObjectValues = objectValues[fieldId] || {};
        const nestedCalculated = evaluateNestedFormulas(
          property.properties,
          nestedObjectValues,
          parentKey ? parentKey : fieldId, // Pass the object field key as parent
          {}, // Start fresh for nested object calculations
        );

        // Merge nested calculated fields into the appropriate parent structure
        if (parentKey) {
          // We're already nested, merge into the existing parent
          if (!calculatedFields[parentKey]) {
            calculatedFields[parentKey] = {};
          }
          Object.entries(nestedCalculated).forEach(([nestedKey, nestedVal]) => {
            if (typeof nestedVal === 'object' && nestedVal !== null) {
              // Deeper nesting - merge object
              calculatedFields[parentKey] = {
                ...calculatedFields[parentKey],
                ...nestedVal,
              };
            } else {
              // Direct field
              calculatedFields[parentKey][nestedKey] = nestedVal;
            }
          });
        } else {
          // Top-level nested object - merge into fieldId key
          if (!calculatedFields[fieldId]) {
            calculatedFields[fieldId] = {};
          }
          Object.entries(nestedCalculated).forEach(([nestedKey, nestedVal]) => {
            if (typeof nestedVal === 'object' && nestedVal !== null) {
              // Deeper nesting - merge object
              calculatedFields[fieldId] = {
                ...calculatedFields[fieldId],
                ...nestedVal,
              };
            } else {
              // Direct field
              calculatedFields[fieldId][nestedKey] = nestedVal;
            }
          });
        }
      }
    });

    return calculatedFields;
  };

  // Recalculate formula fields whenever form values change
  useEffect(() => {
    const subscription = watch(value => {
      // Calculate formula fields (including nested objects and arrays)
      const formValues = value as AnyObject;
      const calculatedFields = evaluateNestedFormulas(
        schema.properties,
        formValues,
      );

      // Update form with calculated values only if they differ from current values
      if (Object.keys(calculatedFields).length > 0) {
        Object.entries(calculatedFields).forEach(([key, val]) => {
          if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            // Handle nested objects (e.g., cashFlowAnalysisDuringPD)
            const currentValue = formValues[key] || {};
            // Start with all current values to preserve existing fields
            const updatedNested: Record<string, any> = {...currentValue};
            let hasChanges = false;

            Object.entries(val).forEach(([nestedKey, nestedVal]) => {
              const currentNestedValue = currentValue[nestedKey];
              const currentStr =
                currentNestedValue !== undefined && currentNestedValue !== null
                  ? String(currentNestedValue)
                  : '';
              const newStr =
                nestedVal !== undefined && nestedVal !== null
                  ? String(nestedVal)
                  : '';

              // Compare as strings first (faster), then as numbers if different
              if (currentStr !== newStr) {
                const currentNum = parseFloat(currentStr || '0');
                const newNum = parseFloat(newStr || '0');

                // Only update if value has actually changed (avoid infinite loops)
                if (
                  isNaN(currentNum) ||
                  Math.abs(currentNum - newNum) > 0.0001
                ) {
                  updatedNested[nestedKey] = nestedVal;
                  hasChanges = true;
                }
              }
            });

            // Update the nested object only if there are changes
            if (hasChanges) {
              setValue(key as any, updatedNested, {shouldValidate: false});
            }
          } else {
            // Handle regular fields
            const currentValue = formValues[key];
            const currentNum =
              typeof currentValue === 'number'
                ? currentValue
                : parseFloat(String(currentValue || '0'));
            const newNum =
              typeof val === 'number' ? val : parseFloat(String(val || '0'));

            // Only update if value has actually changed (avoid infinite loops)
            if (isNaN(currentNum) || Math.abs(currentNum - newNum) > 0.0001) {
              setValue(key as any, val, {shouldValidate: false});
            }
          }
        });
      }

      // Handle formulas inside array items
      Object.entries(schema.properties).forEach(([fieldId, property]) => {
        if (
          property.type === 'array' &&
          property.items?.type === 'object' &&
          property.items?.properties
        ) {
          const arrayValue = formValues[fieldId];
          if (Array.isArray(arrayValue) && arrayValue.length > 0) {
            const itemProperties = property.items.properties;
            if (!itemProperties) return;

            const updatedArray = arrayValue.map((item: any, index: number) => {
              if (!item || typeof item !== 'object') return item;

              // Evaluate formulas for this array item
              const itemCalculated = evaluateNestedFormulas(
                itemProperties,
                item,
              );

              // Check if any calculated values differ from current values
              let hasItemChanges = false;
              const updatedItem = {...item};

              Object.entries(itemCalculated).forEach(([calcKey, calcVal]) => {
                const currentItemValue = item[calcKey];
                const currentStr =
                  currentItemValue !== undefined && currentItemValue !== null
                    ? String(currentItemValue)
                    : '';
                const newStr =
                  calcVal !== undefined && calcVal !== null
                    ? String(calcVal)
                    : '';

                if (currentStr !== newStr) {
                  const currentNum = parseFloat(currentStr || '0');
                  const newNum = parseFloat(newStr || '0');

                  if (
                    isNaN(currentNum) ||
                    Math.abs(currentNum - newNum) > 0.0001
                  ) {
                    updatedItem[calcKey] = calcVal;
                    hasItemChanges = true;
                  }
                }
              });

              return hasItemChanges ? updatedItem : item;
            });

            // Check if array actually changed
            const arrayChanged = updatedArray.some(
              (item: any, index: number) => item !== arrayValue[index],
            );

            if (arrayChanged) {
              setValue(fieldId as any, updatedArray, {shouldValidate: false});
            }
          }
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, schema.properties]);

  // Handle save button click - removed auto-save on change
  const handleSave = () => {
    const formValues = getValues();

    // Convert string values back to numbers and ensure array integrity before submitting
    const denormalizedData = denormalizeFormData(formValues as AnyObject);

    // Validate array items have unique IDs before submission
    Object.entries(denormalizedData).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        if (!validateArrayItemIds(val)) {
          console.warn(
            `Array field ${key} has missing or duplicate IDs, fixing...`,
          );
          denormalizedData[key] = ensureArrayItemsHaveIds(val);
        }
      }
    });

    onSubmit(denormalizedData);
  };

  const showDatePicker = (
    fieldKey: string,
    mode: 'date' | 'time' | 'datetime' = 'date',
  ) => {
    setDatePickerState({visible: true, fieldKey, mode});
  };

  const hideDatePicker = () => {
    setDatePickerState({visible: false, fieldKey: null, mode: 'date'});
  };

  const checkConditionalVisibility = (
    dependencies: Record<string, any>,
    formData: any,
  ) => {
    for (const [fieldName, expectedValue] of Object.entries(dependencies)) {
      const actualValue = formData[fieldName];

      if (Array.isArray(expectedValue)) {
        // Multiple allowed values
        if (!expectedValue.includes(actualValue)) {
          return false;
        }
      } else {
        // Single expected value
        if (actualValue !== expectedValue) {
          return false;
        }
      }
    }

    return true;
  };

  const handleDateConfirm = (date: Date) => {
    if (datePickerState.fieldKey) {
      let formattedValue: string;

      switch (datePickerState.mode) {
        case 'time':
          formattedValue = dayjs(date).format('hh:mm A');
          break;
        case 'datetime':
          formattedValue = dayjs(date).format('DD-MM-YYYY hh:mm A');
          break;
        case 'date':
        default:
          formattedValue = dayjs(date).format('DD-MM-YYYY');
          break;
      }

      setValue(datePickerState.fieldKey, formattedValue);
    }
    hideDatePicker();
  };

  const renderDateField = (
    fieldKey: string,
    title: string,
    value: string,
    isReadOnly: boolean = false,
    format: string = 'date',
  ) => {
    let displayValue = value;
    let placeholderText = 'Select date';
    let pickerMode: 'date' | 'time' | 'datetime' = 'date';

    switch (format) {
      case 'time':
        placeholderText = 'Select time';
        pickerMode = 'time';
        break;
      case 'date-time':
      case 'datetime':
        placeholderText = 'Select date and time';
        pickerMode = 'datetime';
        break;
      case 'date':
      default:
        placeholderText = 'Select date';
        pickerMode = 'date';
        break;
    }

    if (!displayValue) {
      displayValue = placeholderText;
    }

    return (
      <View style={styles.dateFieldContainer}>
        <Text style={styles.label}>{title}</Text>
        {isReadOnly ? (
          <View style={[styles.dateField, styles.disabledDateField]}>
            <Text
              style={[styles.dateText, !value && styles.placeholderText]}
              selectable={true}>
              {displayValue}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.dateField}
            onPress={() => showDatePicker(fieldKey, pickerMode)}>
            <Text style={[styles.dateText, !value && styles.placeholderText]}>
              {displayValue}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderField = (fieldId: string, property: JsonSchemaProperty) => {
    try {
      const formData = watch(); // Use watch to trigger re-renders on field changes

      // Check conditional required validation
      let isRequired = schema.required?.includes(fieldId) ?? false;

      if (property.dependencies?.required) {
        const shouldBeRequired = checkConditionalVisibility(
          property.dependencies.required,
          formData,
        );
        isRequired = shouldBeRequired;
      }

      // Check conditional visibility
      if (property.dependencies?.show) {
        const shouldShow = checkConditionalVisibility(
          property.dependencies.show,
          formData,
        );
        if (!shouldShow) {
          return null; // Hide field if conditions not met
        }
      }

      // Fields with formulas are read-only
      const isFormulaField = !!(property as any).formula;
      const fieldReadOnly = property.readOnly || isFormulaField;

      // Handle nested object fields (like repaymentFrom, currentAssets)
      if (property.type === 'object' && property.properties) {
        // Ensure the parent object exists in form data for nested field paths to work
        // React Hook Form requires the parent object to exist for dot notation paths
        if (
          !formData[fieldId] ||
          typeof formData[fieldId] !== 'object' ||
          Array.isArray(formData[fieldId])
        ) {
          setValue(fieldId as any, {}, {shouldValidate: false});
        }

        return (
          <View style={styles.nestedObjectContainer}>
            <Text style={styles.nestedObjectLabel}>
              {property.title}
              {isRequired ? ' *' : ''}
            </Text>
            <View style={styles.nestedObjectContent}>
              {Object.entries(property.properties).map(
                ([subFieldId, subProperty]) => {
                  const subFieldKey = `${fieldId}.${subFieldId}`;
                  const subFieldValue = formData[fieldId]?.[subFieldId];

                  // Handle date/time fields in nested objects
                  const isDateField =
                    subProperty?.format === 'date' ||
                    subProperty?.format === 'time' ||
                    subProperty?.format === 'date-time' ||
                    subProperty?.format === 'datetime';
                  if (isDateField) {
                    console.log('subProperty', subProperty);
                    return (
                      <View key={subFieldKey}>
                        {renderDateField(
                          subFieldKey,
                          subProperty.title,
                          subFieldValue,
                          subProperty.readOnly,
                          subProperty.format,
                        )}
                      </View>
                    );
                  }

                  // Handle enum in nested objects
                  if (subProperty.enum && subProperty.enum.length > 0) {
                    const options = subProperty.enum.map(option => ({
                      id: option,
                      name: option,
                    }));

                    return (
                      <SelectFormItem
                        key={subFieldKey}
                        data={{
                          control,
                          key: subFieldKey,
                          title: subProperty.title,
                          required: false,
                          options,
                          defaultValue: subFieldValue ?? '',
                        }}
                      />
                    );
                  }

                  // Handle textarea in nested objects
                  if (shouldUseTextArea(subProperty)) {
                    return (
                      <TextAreaFormItem
                        key={subFieldKey}
                        data={{
                          control,
                          key: subFieldKey,
                          title: subProperty.title,
                          required: false,
                          disabled:
                            subProperty.readOnly ||
                            !!(subProperty as any).formula,
                          defaultValue: subFieldValue ?? '',
                          numberOfLines: getTextAreaLines(subProperty),
                          maxLength: getMaxLength(subProperty),
                        }}
                      />
                    );
                  }

                  // Handle number/integer in nested objects
                  if (
                    subProperty.type === 'number' ||
                    subProperty.type === 'integer'
                  ) {
                    return (
                      <InputFormItem
                        key={subFieldKey}
                        data={{
                          control,
                          key: subFieldKey,
                          title: subProperty.title,
                          required: false,
                          disabled:
                            subProperty.readOnly ||
                            !!(subProperty as any).formula,
                          defaultValue: subFieldValue?.toString() ?? '',
                          placeholder: subProperty.title,
                          keyboardType: 'numeric',
                          type: subProperty.type,
                          formatter: (subProperty as any).formatter,
                          trigger,
                        }}
                      />
                    );
                  }

                  // Default to InputFormItem for nested objects
                  return (
                    <InputFormItem
                      key={subFieldKey}
                      data={{
                        control,
                        key: subFieldKey,
                        title: subProperty.title,
                        required: false,
                        disabled:
                          subProperty.readOnly ||
                          !!(subProperty as any).formula,
                        defaultValue: subFieldValue ?? '',
                        placeholder: subProperty.title,
                      }}
                    />
                  );
                },
              )}
            </View>
          </View>
        );
      }

      // Handle array fields (like familyDetails) - keeping custom implementation for now
      // as lib doesn't have a repeater component
      if (property.type === 'array' && property.items) {
        // Use live watch to reflect updates immediately in UI
        const watchedArray = watch(fieldId as any);
        const arrayData = Array.isArray(watchedArray) ? watchedArray : [];

        // For primitive arrays, don't use ensureArrayItemsHaveIds - use array directly
        const isPrimitiveArray = !property.items?.properties;
        const processedArray = isPrimitiveArray
          ? arrayData
          : ensureArrayItemsHaveIds(arrayData);

        const handleAddItem = () => {
          const currentData = getValues();
          const currentArray = Array.isArray(currentData[fieldId])
            ? currentData[fieldId]
            : [];

          // Determine if this is a primitive array (string, number, etc.) or object array

          let newItem: any;
          if (isPrimitiveArray) {
            // For primitive arrays, create the appropriate primitive value
            if (
              property.items?.type === 'number' ||
              property.items?.type === 'integer'
            ) {
              newItem = 0;
            } else {
              // Default to empty string for strings and other types
              newItem = '';
            }
          } else {
            // For object arrays, create new item with unique ID
            newItem = {
              _id: generateArrayItemId(),
            };
          }

          const newArrayData = isPrimitiveArray
            ? [...currentArray, newItem]
            : [...ensureArrayItemsHaveIds(currentArray), newItem];
          setValue(fieldId, newArrayData, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
          // Don't save immediately - wait for user to click "Save Section"
        };

        const handleRemoveItem = (indexToRemove: number) => {
          const currentData = getValues();
          const currentArray = Array.isArray(currentData[fieldId])
            ? currentData[fieldId]
            : [];

          // For primitive arrays, filter directly. For object arrays, ensure IDs first
          const arrayToFilter = isPrimitiveArray
            ? currentArray
            : ensureArrayItemsHaveIds(currentArray);
          const newArrayData = arrayToFilter.filter(
            (_: any, i: number) => i !== indexToRemove,
          );

          // Clear field values for the removed item
          // For arrays of objects, clear sub-properties
          if (property.items?.properties) {
            Object.keys(property.items.properties).forEach(subFieldId => {
              const subFieldKey = `${fieldId}[${indexToRemove}].${subFieldId}`;
              setValue(subFieldKey as any, undefined, {shouldDirty: true});
            });
          } else {
            // For arrays of primitives, clear the item value directly
            const fieldKey = `${fieldId}[${indexToRemove}]`;
            setValue(fieldKey as any, undefined, {shouldDirty: true});
          }

          setValue(fieldId, newArrayData, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
          // Don't save immediately - wait for user to click "Save Section"
        };

        return (
          <View style={styles.repeaterContainer}>
            <Text style={styles.repeaterLabel}>
              {property.title}
              {isRequired ? ' *' : ''}
            </Text>
            {processedArray.map((item: any, index: number) => (
              <View
                key={
                  isPrimitiveArray
                    ? `${fieldId}-${index}`
                    : item._id || `${fieldId}-${index}`
                }
                style={styles.repeaterItem}>
                <View style={styles.repeaterItemHeader}>
                  <Text style={styles.repeaterItemLabel}>Item {index + 1}</Text>
                  <TouchableOpacity
                    style={styles.removeButtonInline}
                    onPress={() => handleRemoveItem(index)}>
                    <Text style={styles.removeButtonTextInline}>Remove</Text>
                  </TouchableOpacity>
                </View>
                {/* Handle arrays of objects */}
                {property.items?.properties &&
                  Object.entries(property.items.properties).map(
                    ([subFieldId, subProperty]) => {
                      const subFieldKey = `${fieldId}[${index}].${subFieldId}`;
                      // Check if this field is required in the array items
                      const isSubFieldRequired =
                        (property.items as any)?.required?.includes(
                          subFieldId,
                        ) ?? false;

                      // Handle date/time fields in arrays
                      const isDateField =
                        subProperty.format === 'date' ||
                        subProperty.format === 'time' ||
                        subProperty.format === 'date-time' ||
                        subProperty.format === 'datetime';
                      if (isDateField) {
                        return (
                          <View key={subFieldKey}>
                            {renderDateField(
                              subFieldKey,
                              subProperty.title,
                              item?.[subFieldId],
                              subProperty.readOnly,
                              subProperty.format,
                            )}
                          </View>
                        );
                      }

                      // Handle enum fields (select dropdown) in arrays
                      if (subProperty.enum && subProperty.enum.length > 0) {
                        const options = subProperty.enum.map(option => ({
                          id: option,
                          name: option,
                        }));

                        return (
                          <SelectFormItem
                            key={subFieldKey}
                            data={{
                              control,
                              key: subFieldKey,
                              title: subProperty.title,
                              required: isSubFieldRequired,
                              options,
                              defaultValue: item?.[subFieldId] ?? '',
                            }}
                          />
                        );
                      }

                      if (shouldUseTextArea(subProperty)) {
                        return (
                          <TextAreaFormItem
                            key={subFieldKey}
                            data={{
                              control,
                              key: subFieldKey,
                              title: subProperty.title,
                              required: isSubFieldRequired,
                              disabled:
                                subProperty.readOnly ||
                                !!(subProperty as any).formula,
                              defaultValue: item?.[subFieldId] ?? '',
                              numberOfLines: getTextAreaLines(subProperty),
                              maxLength: getMaxLength(subProperty),
                            }}
                          />
                        );
                      }

                      return (
                        <InputFormItem
                          key={subFieldKey}
                          data={{
                            control,
                            key: subFieldKey,
                            title: subProperty.title,
                            required: isSubFieldRequired,
                            disabled:
                              subProperty.readOnly ||
                              !!(subProperty as any).formula,
                            defaultValue: item?.[subFieldId] ?? '',
                            keyboardType:
                              subProperty.type === 'number' ||
                              subProperty.type === 'integer'
                                ? 'numeric'
                                : 'default',
                            type: subProperty.type,
                            formatter: (subProperty as any).formatter,
                            trigger,
                          }}
                        />
                      );
                    },
                  )}
                {/* Handle arrays of primitives (string, number, etc.) */}
                {!property.items?.properties && property.items && (
                  <InputFormItem
                    data={{
                      control,
                      key: `${fieldId}[${index}]`,
                      title: property.items.title || property.title || 'Value',
                      required: false,
                      disabled: property.items.readOnly || false,
                      defaultValue: (() => {
                        // Extract the actual primitive value from the item
                        // Handle both primitive values and wrapped objects
                        if (
                          typeof item === 'string' ||
                          typeof item === 'number'
                        ) {
                          return String(item);
                        }
                        // If item is an object (shouldn't happen, but handle it)
                        if (item && typeof item === 'object') {
                          // Try to find a primitive value in the object
                          const primitiveValue = Object.values(item).find(
                            val =>
                              typeof val === 'string' ||
                              typeof val === 'number',
                          );
                          return primitiveValue ? String(primitiveValue) : '';
                        }
                        return '';
                      })(),
                      placeholder:
                        property.items.title || property.title || 'Enter value',
                      keyboardType:
                        property.items.type === 'number' ||
                        property.items.type === 'integer'
                          ? 'numeric'
                          : 'default',
                      type: property.items.type,
                      trigger,
                    }}
                  />
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        );
      }

      // Handle enum fields (select dropdown)
      if (property.enum && property.enum.length > 0) {
        const options = property.enum.map(option => ({
          id: option,
          name: option,
        }));

        return (
          <SelectFormItem
            data={{
              control,
              key: fieldId,
              title: property.title,
              required: isRequired,
              options,
              defaultValue: formData[fieldId] ?? '',
            }}
          />
        );
      }

      // Handle different field types
      switch (property.type) {
        case 'boolean':
          // Use RadioFormItem for boolean (Yes/No options)

          return (
            <RadioFormItem
              data={{
                control,
                key: fieldId,
                title: property.title,
                required: isRequired,
                options: [
                  {key: true, title: 'Yes'},
                  {key: false, title: 'No'},
                ],
                layout: 'row',
                defaultValue: formData[fieldId] ?? null,
              }}
            />
          );

        case 'string':
          // Check if it should be a date/time field
          const isDateField =
            property.format === 'date' ||
            property.format === 'time' ||
            property.format === 'date-time' ||
            property.format === 'datetime';
          if (isDateField) {
            return renderDateField(
              fieldId,
              property.title,
              formData[fieldId],
              property.readOnly,
              property.format,
            );
          }

          // Check if it should be a textarea
          if (shouldUseTextArea(property)) {
            return (
              <TextAreaFormItem
                data={{
                  control,
                  key: fieldId,
                  title: property.title,
                  required: isRequired,
                  disabled: fieldReadOnly,
                  defaultValue: formData[fieldId] ?? '',
                  placeholder: property.title,
                  trigger,
                  numberOfLines: getTextAreaLines(property),
                  maxLength: getMaxLength(property),
                }}
              />
            );
          }

          return (
            <InputFormItem
              data={{
                control,
                key: fieldId,
                title: property.title,
                required: isRequired,
                disabled: fieldReadOnly,
                defaultValue: formData[fieldId] ?? '',
                placeholder: property.title,
                trigger,
              }}
            />
          );

        case 'number':
          return (
            <InputFormItem
              data={{
                control,
                key: fieldId,
                title: property.title,
                required: isRequired,
                disabled: fieldReadOnly,
                defaultValue: formData[fieldId]?.toString() ?? '',
                placeholder: property.title,
                keyboardType: 'numeric', // Numeric keyboard for decimal numbers
                type: 'number',
                trigger,
                formatter: (property as any).formatter, // Pass formatter from schema
                rules: {
                  validate: {
                    isNumber: (value: string) => {
                      if (!value) return true; // Allow empty for non-required fields
                      const numValue = parseFloat(value);
                      return !isNaN(numValue) || 'Please enter a valid number';
                    },
                    nonNegative: (value: string) => {
                      if (!value) return true;
                      const numValue = parseFloat(value);
                      return (
                        numValue >= 0 ||
                        'Value must be greater than or equal to 0'
                      );
                    },
                    maxTwoDecimals: (value: string) => {
                      if (!value) return true;
                      const maxDp =
                        (property as any)?.formatter?.maxDecimalPlaces ?? 2;
                      if (maxDp == null) return true;
                      const match = value.match(/^(?:-)?\d*(?:\.(\d+))?$/);
                      if (!match) return 'Please enter a valid number';
                      const decimals = match[1]?.length || 0;
                      return (
                        decimals <= maxDp ||
                        `Maximum ${maxDp} decimal places allowed`
                      );
                    },
                  },
                },
              }}
            />
          );

        case 'integer':
          return (
            <InputFormItem
              data={{
                control,
                key: fieldId,
                title: property.title,
                required: isRequired,
                disabled: fieldReadOnly,
                defaultValue: formData[fieldId]?.toString() ?? '',
                placeholder: property.title,
                keyboardType: 'number-pad', // Number pad for integers (no decimal point)
                type: 'integer',
                trigger,
                formatter: (property as any).formatter, // Pass formatter from schema
                rules: {
                  validate: {
                    isInteger: (value: string) => {
                      if (!value) return true; // Allow empty for non-required fields
                      const intValue = parseInt(value, 10);
                      return (
                        (!isNaN(intValue) &&
                          Number.isInteger(parseFloat(value))) ||
                        'Please enter a valid integer'
                      );
                    },
                    nonNegative: (value: string) => {
                      if (!value) return true;
                      const intValue = parseInt(value, 10);
                      if (isNaN(intValue))
                        return 'Please enter a valid integer';
                      return (
                        intValue >= 0 ||
                        'Value must be greater than or equal to 0'
                      );
                    },
                  },
                },
              }}
            />
          );

        default:
          // Default to InputFormItem
          return (
            <InputFormItem
              data={{
                control,
                key: fieldId,
                title: property.title,
                required: isRequired,
                disabled: fieldReadOnly,
                defaultValue: formData[fieldId] ?? '',
                placeholder: property.title,
                trigger,
              }}
            />
          );
      }
    } catch (err: any) {
      return (
        <View style={styles.schemaErrorBox}>
          <Text style={styles.schemaErrorTitle}>Schema render error</Text>
          <Text style={styles.schemaErrorDetails}>
            Field: {fieldId} • {(property as any)?.title || 'Untitled'}
          </Text>
          <Text style={styles.schemaErrorDetails}>
            {(err && (err.message || String(err))) || 'Unknown error'}
          </Text>
        </View>
      );
    }
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {Object.entries(schema.properties || {}).map(([fieldId, property]) => {
          if (!property || !(property as any).type) {
            return (
              <View key={fieldId} style={styles.schemaErrorBox}>
                <Text style={styles.schemaErrorTitle}>Invalid schema</Text>
                <Text style={styles.schemaErrorDetails}>
                  Field: {fieldId} is missing required definition
                </Text>
              </View>
            );
          }
          return <View key={fieldId}>{renderField(fieldId, property)}</View>;
        })}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Section</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={datePickerState.visible}
        mode={datePickerState.mode}
        is24Hour={false}
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  dateFieldContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  dateField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  disabledDateField: {
    backgroundColor: '#f2f2f2',
  },
  dateText: {
    fontSize: 14,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  nestedObjectContainer: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  nestedObjectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  nestedObjectContent: {
    gap: 8,
  },
  repeaterContainer: {
    marginVertical: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  repeaterLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  repeaterItem: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  repeaterItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  repeaterItemLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  schemaErrorBox: {
    borderWidth: 1,
    borderColor: '#ffcccc',
    backgroundColor: '#fff6f6',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  schemaErrorTitle: {
    color: '#cc0000',
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 13,
  },
  schemaErrorDetails: {
    color: '#a94442',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  removeButtonInline: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonTextInline: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  saveButtonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    height: 40,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SchemaSection;
