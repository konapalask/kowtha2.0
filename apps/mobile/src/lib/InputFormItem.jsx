import React from 'react';
import {Controller} from 'react-hook-form';
import {TextInput, View, Text, StyleSheet} from 'react-native';

export function InputFormItem({data}) {
  const isDisabled = data?.disabled;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {data.title}{' '}
        {data?.required !== false && <Text style={styles.required}>*</Text>}
      </Text>

      <Controller
        defaultValue={data?.defaultValue}
        control={data.control}
        name={data.key}
        rules={{
          required: {
            value: data?.required !== false,
            message: data?.message ?? 'Required',
          },
          ...data?.rules,
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <>
            <TextInput
              style={[
                styles.input,
                isDisabled && styles.disabledInput,
                error && styles.errorBorder,
                {fontSize: data?.name ? 20 : 14},
              ]}
              placeholder={data?.placeholder}
              value={value}
              onChangeText={onChange}
              editable={!isDisabled}
              keyboardType={data?.keyboardType || 'default'}
              secureTextEntry={data?.type === 'password'}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />

      {/* {error && <Text style={styles.errorText}>{error?.message}</Text>} */}
      {/* {data.errors?.[data.key] && (
        <Text style={styles.errorText}>{data.errors[data.key]?.message}</Text>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginVertical: 8},
  label: {color: '#333', fontSize: 13, marginBottom: 4},
  required: {color: 'red'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  disabledInput: {
    backgroundColor: '#f2f2f2',
    color: '#777',
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
