import React, { useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';

type AnyObject = Record<string, any>;

interface FieldDef {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

interface SchemaSectionProps {
  title: string;
  fields: FieldDef[];
  initialData?: AnyObject;
  onSubmit: (data: AnyObject) => void;
}

const SchemaSection: React.FC<SchemaSectionProps> = ({ title, fields, initialData = {}, onSubmit }) => {
  const [data, setData] = useState<AnyObject>(initialData || {});

  const handleChange = (fieldId: string, value: any) => {
    const next = { ...data, [fieldId]: value };
    setData(next);
    onSubmit(next);
  };

  const renderField = (f: FieldDef) => {
    switch (f.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'textarea':
        return (
          <TextInput
            style={styles.input}
            value={data[f.id] ?? ''}
            onChangeText={(t) => handleChange(f.id, t)}
            placeholder={f.label}
            multiline={f.type === 'textarea'}
          />
        );
      case 'boolean':
        return (
          <View style={styles.switchRow}>
            <Switch
              value={!!data[f.id]}
              onValueChange={(v) => handleChange(f.id, v)}
            />
          </View>
        );
      default:
        return (
          <TextInput
            style={styles.input}
            value={data[f.id] ?? ''}
            onChangeText={(t) => handleChange(f.id, t)}
            placeholder={f.label}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {fields.map((f) => (
        <View key={f.id} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {f.label}{f.required ? ' *' : ''}
          </Text>
          {renderField(f)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  fieldContainer: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff'
  },
  switchRow: { flexDirection: 'row', alignItems: 'center' }
});

export default SchemaSection;


