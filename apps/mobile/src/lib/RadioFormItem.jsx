import React from 'react';
import {Controller} from 'react-hook-form';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const CustomRadioGroup = ({options, value, onChange, layout = 'row'}) => (
  <View
    style={[styles.radioGroup, layout === 'row' ? styles.row : styles.column]}>
    {options?.map((item, idx) => {
      const optionValue = item?.key || item;
      const optionLabel = item?.title || item;
      const selected = value === optionValue;

      return (
        <TouchableOpacity
          key={idx}
          style={styles.optionContainer}
          onPress={() => onChange(optionValue)}>
          <View
            style={[styles.radioCircle, selected && styles.radioCircleSelected]}
          />
          <Text style={styles.optionText}>{optionLabel}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export const RadioFormItem = ({data}) => (
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
        <CustomRadioGroup
          options={data.options}
          value={value}
          onChange={val => {
            onChange(val);
            if (typeof data?.resetField === 'function') {
              data?.resetKey?.forEach(item => data.resetField(item));
            }
          }}
          layout={data?.layout}
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
  radioGroup: {gap: 12},
  row: {flexDirection: 'row'},
  column: {flexDirection: 'column'},
  optionContainer: {flexDirection: 'row', alignItems: 'center'},
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D0D5DD',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  optionText: {color: '#000'},
  errorText: {marginTop: 4, fontSize: 12, color: 'red'},
});
