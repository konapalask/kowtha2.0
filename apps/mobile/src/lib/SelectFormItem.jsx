import React, {useRef} from 'react';
import {Controller} from 'react-hook-form';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

export const SelectFormItem = ({data}) => {
  const actionSheetRef = useRef(null);

  return (
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
        render={({field: {onChange, value}, fieldState: {error}}) => {
          const selectedOption = data?.options?.find(opt => opt.id === value);
          const displayText = selectedOption?.name || 'Select an option';
          const hasValue = selectedOption !== undefined;
          
          return (
            <>
              <TouchableOpacity
                style={[styles.selector, error && styles.errorBorder]}
                onPress={() => actionSheetRef.current?.show()}>
                <Text style={[{color: hasValue ? '#000' : '#999', fontSize: 14}]}>
                  {displayText}
                </Text>
              </TouchableOpacity>

            <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
              <View style={[styles.sheetContainer, {paddingBottom: 50}]}>
                {data?.options?.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.sheetItem}
                    onPressIn={() => {
                      onChange(item.id);
                      actionSheetRef.current?.hide();
                    }}>
                    <Text style={styles.sheetText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ActionSheet>
            {error && <Text style={styles.errorText}>{error.message}</Text>}
            </>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginVertical: 8},
  label: {color: '#000', fontSize: 14, marginBottom: 4},
  required: {color: 'red'},
  selector: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {color: 'red', fontSize: 12, marginTop: 4, marginBottom: 4},
  sheetContainer: {padding: 12},
  sheetItem: {paddingVertical: 12},
  sheetText: {fontSize: 16},
});
