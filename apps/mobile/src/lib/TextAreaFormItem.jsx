import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Controller} from 'react-hook-form';

export const TextAreaFormItem = ({data}) => {
  const [height, setHeight] = useState(
    Math.max(80, (data?.numberOfLines ?? 5) * 24),
  );

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

          const handleContentSizeChange = event => {
            const newHeight = event.nativeEvent.contentSize.height;
            const minHeight = Math.max(80, (data?.numberOfLines ?? 5) * 24);
            const maxHeight = 300; // Maximum height to prevent infinite growth
            // Set height to content size, but clamp between min and max
            setHeight(Math.max(minHeight, Math.min(newHeight + 20, maxHeight)));
          };

          return (
            <TextInput
              style={[
                styles.textArea,
                {height: height},
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
              onContentSizeChange={handleContentSizeChange}
              multiline
              textAlignVertical="top" // keeps text at top-left
              placeholder={data?.placeholder || ''}
              editable={data?.disabled !== true}
              maxLength={data?.maxLength}
              scrollEnabled={false} // Disable scrolling, let it grow instead
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
};

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
