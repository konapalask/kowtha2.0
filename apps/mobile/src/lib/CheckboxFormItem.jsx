import React from 'react';
import {Controller} from 'react-hook-form';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const CustomCheckboxGroup = ({
  options,
  value = [],
  onChange,
  layout = 'column',
}) => {
  const toggleValue = val => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <View style={[styles.checkboxGroup, layout === 'row' && styles.row]}>
      {options?.map((item, idx) => {
        const optionValue = item?.key || item;
        const optionLabel = item?.title || item;
        const selected = value.includes(optionValue);

        return (
          <TouchableOpacity
            key={idx}
            style={styles.optionContainer}
            onPress={() => toggleValue(optionValue)}>
            <View
              style={[styles.checkbox, selected && styles.checkboxSelected]}>
              {selected && <View style={styles.checkboxTick} />}
            </View>
            <Text style={styles.optionText}>{optionLabel}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const CheckboxFormItem = ({data}) => (
  <View style={styles.container}>
    <Text style={styles.label}>
      {data.title}{' '}
      {data?.required !== false && <Text style={styles.required}>*</Text>}
    </Text>

    <Controller
      defaultValue={[]}
      control={data.control}
      name={data.key}
      rules={{
        required: {value: data?.required !== false, message: 'Required'},
        ...data?.rules,
      }}
      render={({field: {onChange, value}}) => (
        <CustomCheckboxGroup
          options={data.options}
          value={value}
          onChange={onChange}
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
  checkboxGroup: {gap: 12},
  row: {flexDirection: 'row', flexWrap: 'wrap'},
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D0D5DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxTick: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  optionText: {color: '#000'},
  errorText: {marginTop: 4, fontSize: 12, color: 'red'},
});
