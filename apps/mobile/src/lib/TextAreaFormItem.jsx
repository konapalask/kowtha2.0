import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Controller} from 'react-hook-form';

export const TextAreaFormItem = ({data}) => (
  <View style={styles.container}>
    <Text style={styles.label}>
      {data.title}{' '}
      {data?.required !== false && <Text style={styles.required}>*</Text>}
    </Text>

    <Controller
      defaultValue={data?.defaultValue || ''}
      control={data.control}
      name={data.key}
      rules={{
        required: {value: data?.required !== false, message: 'Required'},
        ...data?.rules,
      }}
      render={({field: {onChange, value}}) => (
        <TextInput
          style={[
            styles.textArea,
            data.errors?.[data.key] && styles.errorBorder,
          ]}
          value={value}
          onChangeText={onChange}
          multiline
          numberOfLines={5}
          textAlignVertical="top" // keeps text at top-left
          placeholder={data?.placeholder || ''}
          editable={data?.disabled !== true}
        />
      )}
    />

    {data.errors?.[data.key] && (
      <Text style={styles.errorText}>{data.errors[data.key]?.message}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {marginVertical: 8},
  label: {color: '#101828', fontSize: 16, marginBottom: 6},
  required: {color: 'red'},
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    minHeight: 120,
    color: '#000',
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
});
