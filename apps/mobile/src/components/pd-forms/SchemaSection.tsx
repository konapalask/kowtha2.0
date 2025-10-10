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
  const {control, watch, setValue, getValues, reset} = useForm({
    defaultValues: initialData,
    mode: 'onChange',
  });

  const isInitialMount = useRef(true);
  const [datePickerState, setDatePickerState] = useState<{
    visible: boolean;
    fieldKey: string | null;
  }>({visible: false, fieldKey: null});

  // Update form values when initialData changes (e.g., from AsyncStorage or coordinates)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset(initialData, {keepDirtyValues: true});
    }
  }, [initialData, reset]);

  // Use watch subscription to avoid infinite loops
  useEffect(() => {
    const subscription = watch(value => {
      // Skip the initial call on mount to avoid calling onSubmit with default values
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      onSubmit(value as AnyObject);
    });
    return () => subscription.unsubscribe();
  }, [watch, onSubmit]);

  const showDatePicker = (fieldKey: string) => {
    setDatePickerState({visible: true, fieldKey});
  };

  const hideDatePicker = () => {
    setDatePickerState({visible: false, fieldKey: null});
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
    const isRequired = schema.required?.includes(fieldId) ?? true;
    const formData = getValues();

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
      const arrayData = Array.isArray(formData[fieldId])
        ? formData[fieldId]
        : [];
      return (
        <View style={styles.repeaterContainer}>
          <Text style={styles.repeaterLabel}>
            {property.title}
            {isRequired ? ' *' : ''}
          </Text>
          {arrayData.map((item: any, index: number) => (
            <View key={index} style={styles.repeaterItem}>
              <Text style={styles.repeaterItemLabel}>Item {index + 1}</Text>
              {property.items?.properties &&
                Object.entries(property.items.properties).map(
                  ([subFieldId, subProperty]) => {
                    const subFieldKey = `${fieldId}[${index}].${subFieldId}`;

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
                            required: false,
                            options,
                            defaultValue: item?.[subFieldId] ?? '',
                          }}
                        />
                      );
                    }

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
                          required: false,
                          disabled: subProperty.readOnly,
                          defaultValue: item?.[subFieldId] ?? '',
                          keyboardType:
                            subProperty.type === 'number' ||
                            subProperty.type === 'integer'
                              ? 'numeric'
                              : 'default',
                        }}
                      />
                    );
                  },
                )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  const newArrayData = arrayData.filter(
                    (_: any, i: number) => i !== index,
                  );
                  setValue(fieldId, newArrayData);
                }}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newArrayData = [...arrayData, {}];
              setValue(fieldId, newArrayData);
            }}>
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
        // Use RadioFormItem for boolean (Yes/No)
        return (
          <RadioFormItem
            data={{
              control,
              key: fieldId,
              title: property.title,
              required: isRequired,
              options: [{key: true, title: 'Yes'}],
              layout: 'row',
              defaultValue: formData[fieldId] ?? false,
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
            }}
          />
        );

      case 'number':
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
              keyboardType: 'numeric',
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
