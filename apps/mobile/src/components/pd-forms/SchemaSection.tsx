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

const SchemaSection: React.FC<SchemaSectionProps> = ({
  title,
  schema,
  initialData = {},
  onSubmit,
}) => {
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
              ? item.toString()
              : item,
        );
      } else if (value && typeof value === 'object') {
        // Handle nested objects - preserve _id if present
        normalized[key] = normalizeFormData(value);
      } else {
        normalized[key] = value;
      }
    });
    return normalized;
  };

  const {control, watch, setValue, getValues, reset, trigger} = useForm({
    defaultValues: normalizeFormData(initialData),
    mode: 'onBlur', // Validate on blur so required errors appear immediately after clearing
    reValidateMode: 'onChange', // Once invalid, keep error until value becomes valid
    criteriaMode: 'firstError',
    shouldFocusError: true,
  });

  const isInitialMount = useRef(true);
  const [datePickerState, setDatePickerState] = useState<{
    visible: boolean;
    fieldKey: string | null;
  }>({visible: false, fieldKey: null});

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

  // Use watch subscription to avoid infinite loops
  useEffect(() => {
    const subscription = watch(value => {
      // Skip the initial call on mount to avoid calling onSubmit with default values
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      // Convert string values back to numbers and ensure array integrity before submitting
      const denormalizedData = denormalizeFormData(value as AnyObject);

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
    });
    return () => subscription.unsubscribe();
  }, [watch, onSubmit]);

  const showDatePicker = (fieldKey: string) => {
    setDatePickerState({visible: true, fieldKey});
  };

  const hideDatePicker = () => {
    setDatePickerState({visible: false, fieldKey: null});
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
      const formattedDate = dayjs(date).format('DD-MM-YYYY');
      setValue(datePickerState.fieldKey, formattedDate);
    }
    hideDatePicker();
  };

  const renderDateField = (
    fieldKey: string,
    title: string,
    value: string,
    isReadOnly: boolean = false,
  ) => {
    const displayValue = value || 'Select date';

    return (
      <View style={styles.dateFieldContainer}>
        <Text style={styles.label}>{title}</Text>
        <TouchableOpacity
          style={[styles.dateField, isReadOnly && styles.disabledDateField]}
          onPress={() => !isReadOnly && showDatePicker(fieldKey)}
          disabled={isReadOnly}>
          <Text style={[styles.dateText, !value && styles.placeholderText]}>
            {displayValue}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderField = (fieldId: string, property: JsonSchemaProperty) => {
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

    // Handle nested object fields (like repaymentFrom)
    if (property.type === 'object' && property.properties) {
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

                // Handle date fields in nested objects
                const isDateField =
                  // subProperty.title.toLowerCase().includes('date') &&
                  subProperty?.format === 'date';
                if (isDateField) {
                  console.log('subProperty', subProperty);
                  return (
                    <View key={subFieldKey}>
                      {renderDateField(
                        subFieldKey,
                        subProperty.title,
                        subFieldValue,
                        subProperty.readOnly,
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
                const isTextArea =
                  subProperty.title.toLowerCase().includes('about') ||
                  subProperty.title.toLowerCase().includes('address') ||
                  subProperty.title.toLowerCase().includes('description') ||
                  subProperty.title.toLowerCase().includes('remark') ||
                  subProperty.title.toLowerCase().includes('details');

                if (isTextArea) {
                  return (
                    <TextAreaFormItem
                      key={subFieldKey}
                      data={{
                        control,
                        key: subFieldKey,
                        title: subProperty.title,
                        required: false,
                        disabled: subProperty.readOnly,
                        defaultValue: subFieldValue ?? '',
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
                        disabled: subProperty.readOnly,
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
                      disabled: subProperty.readOnly,
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

      const handleAddItem = () => {
        const currentData = getValues();
        const currentArray = Array.isArray(currentData[fieldId])
          ? currentData[fieldId]
          : [];

        // Create new item with unique ID
        const newItem = {
          _id: generateArrayItemId(),
        };

        const newArrayData = [
          ...ensureArrayItemsHaveIds(currentArray),
          newItem,
        ];
        setValue(fieldId, newArrayData, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        // Persist immediately so toggling sections does not revert
        onSubmit(getValues());
      };

      const handleRemoveItem = (indexToRemove: number) => {
        const currentData = getValues();
        const currentArray = Array.isArray(currentData[fieldId])
          ? currentData[fieldId]
          : [];

        // Ensure all items have IDs before filtering
        const arrayWithIds = ensureArrayItemsHaveIds(currentArray);
        const newArrayData = arrayWithIds.filter(
          (_: any, i: number) => i !== indexToRemove,
        );

        // Clear all field values for the removed item to prevent stale data
        if (property.items?.properties) {
          Object.keys(property.items.properties).forEach(subFieldId => {
            const subFieldKey = `${fieldId}[${indexToRemove}].${subFieldId}`;
            setValue(subFieldKey as any, undefined, {shouldDirty: true});
          });
        }

        setValue(fieldId, newArrayData, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        // Persist immediately so toggling sections does not revert
        onSubmit(getValues());
      };

      return (
        <View style={styles.repeaterContainer}>
          <Text style={styles.repeaterLabel}>
            {property.title}
            {isRequired ? ' *' : ''}
          </Text>
          {ensureArrayItemsHaveIds(arrayData).map(
            (item: ArrayItemWithId, index: number) => (
              <View
                key={item._id || `${fieldId}-${index}`}
                style={styles.repeaterItem}>
                <Text style={styles.repeaterItemLabel}>Item {index + 1}</Text>
                {property.items?.properties &&
                  Object.entries(property.items.properties).map(
                    ([subFieldId, subProperty]) => {
                      const subFieldKey = `${fieldId}[${index}].${subFieldId}`;
                      // Check if this field is required in the array items
                      const isSubFieldRequired =
                        property.items?.required?.includes(subFieldId) ?? false;

                      // Handle date fields in arrays
                      const isDateField = subProperty.format === 'date';
                      if (isDateField) {
                        return (
                          <View key={subFieldKey}>
                            {renderDateField(
                              subFieldKey,
                              subProperty.title,
                              item?.[subFieldId],
                              subProperty.readOnly,
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

                      const isTextArea =
                        subProperty.title.toLowerCase().includes('about') ||
                        subProperty.title.toLowerCase().includes('address') ||
                        subProperty.title
                          .toLowerCase()
                          .includes('description') ||
                        subProperty.title.toLowerCase().includes('remark') ||
                        subProperty.title.toLowerCase().includes('details');

                      if (isTextArea) {
                        return (
                          <TextAreaFormItem
                            key={subFieldKey}
                            data={{
                              control,
                              key: subFieldKey,
                              title: subProperty.title,
                              required: isSubFieldRequired,
                              disabled: subProperty.readOnly,
                              defaultValue: item?.[subFieldId] ?? '',
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
                            disabled: subProperty.readOnly,
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
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(index)}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ),
          )}
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
        // Check if it should be a date field
        const isDateField = property.format === 'date';
        if (isDateField) {
          return renderDateField(
            fieldId,
            property.title,
            formData[fieldId],
            property.readOnly,
          );
        }

        // Check if it should be a textarea
        const isTextArea =
          property.title.toLowerCase().includes('about') ||
          property.title.toLowerCase().includes('address') ||
          property.title.toLowerCase().includes('description') ||
          property.title.toLowerCase().includes('remark') ||
          property.title.toLowerCase().includes('details');

        if (isTextArea) {
          return (
            <TextAreaFormItem
              data={{
                control,
                key: fieldId,
                title: property.title,
                required: isRequired,
                disabled: property.readOnly,
                defaultValue: formData[fieldId] ?? '',
                placeholder: property.title,
                trigger,
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
              disabled: property.readOnly,
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
              disabled: property.readOnly,
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
              disabled: property.readOnly,
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
              disabled: property.readOnly,
              defaultValue: formData[fieldId] ?? '',
              placeholder: property.title,
              trigger,
            }}
          />
        );
    }
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {Object.entries(schema.properties).map(([fieldId, property]) => (
          <View key={fieldId}>{renderField(fieldId, property)}</View>
        ))}
      </ScrollView>
      <DateTimePickerModal
        isVisible={datePickerState.visible}
        mode="date"
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
    marginVertical: 8,
  },
  repeaterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  repeaterItem: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  repeaterItemLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
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
});

export default SchemaSection;
