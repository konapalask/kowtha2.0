import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

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
  const [data, setData] = useState<AnyObject>(initialData || {});

  const handleChange = (fieldId: string, value: any) => {
    const next = {...data, [fieldId]: value};
    setData(next);
    onSubmit(next);
  };

  const renderField = (fieldId: string, property: JsonSchemaProperty) => {
    const isRequired = schema.required?.includes(fieldId) || false;
    const value = data[fieldId];

    // Handle array fields (like familyDetails)
    if (property.type === 'array' && property.items) {
      const arrayData = Array.isArray(value) ? value : [];
      return (
        <View style={styles.repeaterContainer}>
          {/* <Text style={styles.repeaterLabel}>
            {property.title}
            {isRequired ? ' *' : ''}
          </Text> */}
          {arrayData.map((item: any, index: number) => (
            <View key={index} style={styles.repeaterItem}>
              <Text style={styles.repeaterItemLabel}>Item {index + 1}</Text>
              {property.items?.properties &&
                Object.entries(property.items.properties).map(
                  ([subFieldId, subProperty]) => (
                    <View key={subFieldId} style={styles.subFieldContainer}>
                      <Text style={styles.subFieldLabel}>
                        {subProperty.title}
                      </Text>
                      <TextInput
                        style={styles.input}
                        value={item?.[subFieldId] ?? ''}
                        onChangeText={text => {
                          const newArrayData = [...arrayData];
                          newArrayData[index] = {...item, [subFieldId]: text};
                          handleChange(fieldId, newArrayData);
                        }}
                        placeholder={subProperty.title}
                        editable={!subProperty.readOnly}
                      />
                    </View>
                  ),
                )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  const newArrayData = arrayData.filter(
                    (_: any, i: number) => i !== index,
                  );
                  handleChange(fieldId, newArrayData);
                }}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newArrayData = [...arrayData, {}];
              handleChange(fieldId, newArrayData);
            }}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Handle enum fields (select dropdown)
    if (property.enum) {
      return (
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={value ?? ''}
            onValueChange={val => handleChange(fieldId, val)}
            style={styles.picker}
            enabled={!property.readOnly}>
            <Picker.Item label={`Select ${property.title}`} value="" />
            {property.enum.map(option => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      );
    }

    // Handle different field types
    switch (property.type) {
      case 'string':
        return (
          <TextInput
            style={[styles.input, property.readOnly && styles.readOnlyInput]}
            value={value ?? ''}
            onChangeText={text => handleChange(fieldId, text)}
            placeholder={property.title}
            editable={!property.readOnly}
            multiline={property.title.toLowerCase().includes('about')}
            numberOfLines={
              property.title.toLowerCase().includes('about') ? 4 : 1
            }
            textAlignVertical={
              property.title.toLowerCase().includes('about') ? 'top' : 'center'
            }
          />
        );
      case 'number':
        return (
          <TextInput
            style={[styles.input, property.readOnly && styles.readOnlyInput]}
            value={value?.toString() ?? ''}
            onChangeText={text => handleChange(fieldId, text)}
            placeholder={property.title}
            keyboardType="numeric"
            editable={!property.readOnly}
          />
        );
      case 'integer':
        return (
          <TextInput
            style={[styles.input, property.readOnly && styles.readOnlyInput]}
            value={value?.toString() ?? ''}
            onChangeText={text => handleChange(fieldId, text)}
            placeholder={property.title}
            keyboardType="numeric"
            editable={!property.readOnly}
          />
        );
      case 'boolean':
        return (
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{property.title}</Text>
            <Switch
              value={!!value}
              onValueChange={val => handleChange(fieldId, val)}
              disabled={property.readOnly}
            />
          </View>
        );
      default:
        return (
          <TextInput
            style={[styles.input, property.readOnly && styles.readOnlyInput]}
            value={value ?? ''}
            onChangeText={text => handleChange(fieldId, text)}
            placeholder={property.title}
            editable={!property.readOnly}
          />
        );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* <Text style={styles.title}>{title}</Text> */}
      {Object.entries(schema.properties).map(([fieldId, property]) => (
        <View key={fieldId} style={styles.fieldContainer}>
          {property.type !== 'array' && (
            <Text style={styles.label}>
              {property.title}
              {schema.required?.includes(fieldId) ? ' *' : ''}
            </Text>
          )}
          {renderField(fieldId, property)}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    // maxHeight: 800,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  repeaterContainer: {
    marginTop: 8,
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
  subFieldContainer: {
    marginBottom: 8,
  },
  subFieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
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
