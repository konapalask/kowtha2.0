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

interface FieldDef {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[]; // For select fields
  isRepeater?: boolean; // For repeater fields
}

interface SchemaSectionProps {
  title: string;
  fields: FieldDef[];
  initialData?: AnyObject;
  onSubmit: (data: AnyObject) => void;
}

const SchemaSection: React.FC<SchemaSectionProps> = ({
  title,
  fields,
  initialData = {},
  onSubmit,
}) => {
  const [data, setData] = useState<AnyObject>(initialData || {});

  const handleChange = (fieldId: string, value: any) => {
    const next = {...data, [fieldId]: value};
    setData(next);
    onSubmit(next);
  };

  const renderField = (f: FieldDef) => {
    // Handle repeater fields
    if (f.isRepeater) {
      const repeaterData = Array.isArray(data[f.id]) ? data[f.id] : [];
      return (
        <View style={styles.repeaterContainer}>
          <Text style={styles.repeaterLabel}>{f.label}</Text>
          {repeaterData.map((item: any, index: number) => (
            <View key={index} style={styles.repeaterItem}>
              <Text style={styles.repeaterItemLabel}>Item {index + 1}</Text>
              <TextInput
                style={styles.input}
                value={item?.value ?? ''}
                onChangeText={text => {
                  const newRepeaterData = [...repeaterData];
                  newRepeaterData[index] = {...item, value: text};
                  handleChange(f.id, newRepeaterData);
                }}
                placeholder={`Enter ${f.label.toLowerCase()}`}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  const newRepeaterData = repeaterData.filter(
                    (_: any, i: number) => i !== index,
                  );
                  handleChange(f.id, newRepeaterData);
                }}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newRepeaterData = [...repeaterData, {value: ''}];
              handleChange(f.id, newRepeaterData);
            }}>
            <Text style={styles.addButtonText}>+ Add {f.label}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Handle select fields
    if (f.type === 'select' && f.options) {
      return (
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={data[f.id] ?? ''}
            onValueChange={value => handleChange(f.id, value)}
            style={styles.picker}>
            <Picker.Item label={`Select ${f.label}`} value="" />
            {f.options.map(option => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      );
    }

    // Handle other field types
    switch (f.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'textarea':
        return (
          <TextInput
            style={[
              styles.input,
              f.type === 'textarea' && styles.textareaInput,
            ]}
            value={data[f.id] ?? ''}
            onChangeText={t => handleChange(f.id, t)}
            placeholder={f.label}
            multiline={f.type === 'textarea'}
            numberOfLines={f.type === 'textarea' ? 4 : 1}
            keyboardType={f.type === 'number' ? 'numeric' : 'default'}
          />
        );
      case 'boolean':
        return (
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{f.label}</Text>
            <Switch
              value={!!data[f.id]}
              onValueChange={v => handleChange(f.id, v)}
            />
          </View>
        );
      default:
        return (
          <TextInput
            style={styles.input}
            value={data[f.id] ?? ''}
            onChangeText={t => handleChange(f.id, t)}
            placeholder={f.label}
          />
        );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{title}</Text>
      {fields.map(f => (
        <View key={f.id} style={styles.fieldContainer}>
          {!f.isRepeater && (
            <Text style={styles.label}>
              {f.label}
              {f.required ? ' *' : ''}
            </Text>
          )}
          {renderField(f)}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    maxHeight: 400, // Limit height for scrollable content
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
  textareaInput: {
    minHeight: 80,
    textAlignVertical: 'top',
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
