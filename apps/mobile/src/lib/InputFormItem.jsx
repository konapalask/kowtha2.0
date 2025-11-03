import React from 'react';
import {Controller} from 'react-hook-form';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import {
  formatNumberForInput,
  parseFormattedNumber,
  FORMATTERS,
  isValidNumber,
} from '../utils/numberFormatting';

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
          // Handle number formatting
          const getDisplayValue = () => {
            if (value == null || value === '') return '';

            // If formatter is specified in schema, format the value for display
            if (data?.formatter) {
              const formatted = formatNumberForInput(value, data.formatter);
              // console.log(`[InputFormItem] Formatting field "${data.key}": value="${value}" → formatted="${formatted}"`, data.formatter);
              return formatted;
            }

            // For number/integer types, ensure it's a string
            return String(value);
          };

          const displayValue = getDisplayValue();

          // Handle text change with formatting
          const handleTextChange = text => {
            if (data?.formatter) {
              // For formatted fields, we need to handle the input carefully
              // Allow typing and format on blur, but store clean values

              if (text === '') {
                onChange('');
                return;
              }

              // Parse the input to get clean numeric value
              const cleanValue = parseFormattedNumber(text);

              // Validate the clean value
              if (cleanValue === '' || isValidNumber(cleanValue)) {
                onChange(cleanValue);
              }
              // If invalid, don't update the value (keeps previous valid value)
            } else if (data?.type === 'number') {
              // Allow numbers, decimal point, and empty string
              const filteredText = text.replace(/[^0-9.]/g, '');
              // Prevent multiple decimal points
              const parts = filteredText.split('.');
              if (parts.length > 2) {
                onChange(parts[0] + '.' + parts.slice(1).join(''));
              } else {
                onChange(filteredText);
              }
            } else if (data?.type === 'integer') {
              // Allow only integers
              const filteredText = text.replace(/[^0-9]/g, '');
              onChange(filteredText);
            } else {
              onChange(text);
            }
          };

          return (
            <>
              <TextInput
                style={[
                  styles.input,
                  isDisabled && styles.disabledInput,
                  error && styles.errorBorder,
                  {fontSize: data?.name ? 20 : 14},
                ]}
                placeholder={data?.placeholder}
                value={displayValue}
                onChangeText={text => {
                  handleTextChange(text);
                  // If field is invalid, keep validating on change so message persists
                  if (invalid && data?.trigger) {
                    data.trigger(data.key);
                  }
                }}
                onBlur={handleBlur}
                editable={!isDisabled}
                keyboardType={
                  data?.formatter ||
                  data?.type === 'number' ||
                  data?.type === 'integer'
                    ? 'numeric'
                    : data?.keyboardType || 'default'
                }
                secureTextEntry={data?.type === 'password'}
                placeholderTextColor="#999"
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </>
          );
        }}
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
