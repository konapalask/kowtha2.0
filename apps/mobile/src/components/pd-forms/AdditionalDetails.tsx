import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../constants/colors';

interface AdditionalDetailsFormData {
  details: any;
}

type Props = {
  initialData?: any;
  onSubmit: (data: AdditionalDetailsFormData) => void;
};

const validationSchema = yup.object().shape({
  details: yup
    .array()
    .of(
      yup.object().shape({
        value: yup.string().required('This field is required'),
      }),
    )
    .min(1, 'At least one detail is required'),
});

const AdditionalDetails: React.FC<Props> = ({initialData, onSubmit}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AdditionalDetailsFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      details: initialData?.details?.length
        ? initialData.details
        : [{value: ''}],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'details',
  });

  const onFormSubmit = (data: AdditionalDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {fields.map((field, index) => (
          <View key={field.id} style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Controller
                control={control}
                name={`details.${index}.value`}
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.details?.[index]?.value && styles.inputError,
                      styles.detailInput,
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={`Additional detail #${index + 1}`}
                    placeholderTextColor={colors.text.secondary}
                    multiline
                    numberOfLines={3}
                  />
                )}
              />
              {fields.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => remove(index)}>
                  <Icon name="remove-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
            {errors.details?.[index]?.value && (
              <Text style={styles.errorText}>
                {errors.details[index]?.value?.message}
              </Text>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => append({value: ''})}>
          <Icon name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.addButtonText}>Add Field</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSubmit(onFormSubmit)}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  scrollView: {padding: 16},
  inputContainer: {marginBottom: 16},
  inputRow: {flexDirection: 'row', alignItems: 'flex-start'},
  detailInput: {flex: 1, minHeight: 100, textAlignVertical: 'top'},
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {borderColor: colors.error},
  errorText: {color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 4},
  removeButton: {marginLeft: 8, padding: 8},
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addButtonText: {color: colors.primary, marginLeft: 8, fontWeight: '500'},
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  saveButtonText: {color: colors.primary, fontSize: 16, fontWeight: 'bold'},
});

export default AdditionalDetails;
