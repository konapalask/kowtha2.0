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
      render={({
        field: {onChange, value, onBlur},
        fieldState: {error, invalid},
      }) => {
        // Manual validation trigger on blur
        const handleBlur = async () => {
          onBlur();
          // Trigger validation for this specific field on blur
          if (data?.trigger) {
            await data.trigger(data.key);
          }
        };

        return (
          <TextInput
            style={[
              styles.textArea,
              {minHeight: Math.max(80, (data?.numberOfLines ?? 5) * 24)},
              error && styles.errorBorder,
            ]}
            value={value}
            onChangeText={text => {
              onChange(text);
              if (invalid && data?.trigger) {
                data.trigger(data.key);
              }
            }}
            onBlur={handleBlur}
            multiline
            numberOfLines={data?.numberOfLines ?? 5}
            textAlignVertical="top" // keeps text at top-left
            placeholder={data?.placeholder || ''}
            editable={data?.disabled !== true}
            maxLength={data?.maxLength}
          />
        );
      }}
    />
    {!!data && (
      // Prefer fieldState.error from Controller; fall back to external errors prop if provided
      <>
        {/** Render error from RHF field state if available */}
        {/* eslint-disable-next-line react/no-children-prop */}
      </>
    )}
    {/* Display error consistently using Controller's fieldState */}
    {/* We render a second Controller solely to access current error state without re-binding input */}
    <Controller
      control={data.control}
      name={data.key}
      render={({fieldState: {error}}) =>
        error ? <Text style={styles.errorText}>{error.message}</Text> : null
      }
    />
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
