import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useForm} from 'react-hook-form';
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
  const {control, watch, setValue, getValues} = useForm({
    defaultValues: initialData,
    mode: 'onChange',
  });

  const isInitialMount = useRef(true);

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

  const renderField = (fieldId: string, property: JsonSchemaProperty) => {
    const isRequired = schema.required?.includes(fieldId) ?? true;
    const formData = getValues();

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
                    const isTextArea =
                      subProperty.title.toLowerCase().includes('about') ||
                      subProperty.title.toLowerCase().includes('address') ||
                      subProperty.title.toLowerCase().includes('description');

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
              options: [
                {key: true, title: 'Yes'},
                {key: false, title: 'No'},
              ],
              layout: 'row',
              defaultValue: formData[fieldId] ?? false,
            }}
          />
        );

      case 'string':
        // Check if it should be a textarea
        const isTextArea =
          property.title.toLowerCase().includes('about') ||
          property.title.toLowerCase().includes('address') ||
          property.title.toLowerCase().includes('description') ||
          property.title.toLowerCase().includes('remark');

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {Object.entries(schema.properties).map(([fieldId, property]) => (
        <View key={fieldId}>{renderField(fieldId, property)}</View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
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
