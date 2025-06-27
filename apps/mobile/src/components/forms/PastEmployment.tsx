import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import {colors} from '../../constants/colors';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';

interface Employment {
  employerName: string;
  designation: string;
  fromDate: string;
  toDate: string;
  contactPersonName: string;
  contactPersonNumber: string;
  reasonForMovement: string;
}

interface PastEmploymentFormData {
  employments: Employment[];
}

interface Props {
  initialData?: Partial<PastEmploymentFormData>;
  onSubmit: (data: PastEmploymentFormData) => void;
}

const validationSchema = yup.object().shape({
  employments: yup
    .array()
    .of(
      yup.object().shape({
        employerName: yup
          .string()
          .required('Employer/Business Name is required'),
        designation: yup.string().required('Designation is required'),
        fromDate: yup.string().required('From Date is required'),
        toDate: yup.string().required('To Date is required'),
        contactPersonName: yup
          .string()
          .required('Contact Person Name is required'),
        contactPersonNumber: yup
          .string()
          .required('Contact Person Number is required')
          .matches(/^\d{10}$/, 'Contact number must be exactly 10 digits'),
        reasonForMovement: yup
          .string()
          .required('Reason for Movement is required'),
      }),
    )
    .required('At least one employment record is required'),
});

const PastEmployment: React.FC<Props> = ({initialData, onSubmit}) => {
  const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<PastEmploymentFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      employments: initialData?.employments || [
        {
          employerName: '',
          designation: '',
          fromDate: '',
          toDate: '',
          contactPersonName: '',
          contactPersonNumber: '',
          reasonForMovement: '',
        },
      ],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'employments',
  });

  const onFormSubmit = (data: PastEmploymentFormData) => {
    onSubmit(data);
  };

  const handleFromDateConfirm = (date: Date) => {
    if (date) {
      setValue(
        `employments.${currentDateIndex}.fromDate`,
        dayjs(date).format('DD/MM/YYYY'),
      );
    }
    setFromDatePickerVisible(false);
  };

  const handleToDateConfirm = (date: Date) => {
    if (date) {
      setValue(
        `employments.${currentDateIndex}.toDate`,
        dayjs(date).format('DD/MM/YYYY'),
      );
    }
    setToDatePickerVisible(false);
  };

  const renderEmploymentFields = (index: number) => {
    return (
      <View key={index} style={styles.employmentContainer}>
        <View style={styles.employmentHeader}>
          <Text style={styles.employmentTitle}>Employment {index + 1}</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => remove(index)}
              style={styles.removeButton}>
              <Icon name="delete" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        <Controller
          control={control}
          name={`employments.${index}.employerName`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Employer/Business Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.employments?.[index]?.employerName &&
                    styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
              />
              {errors.employments?.[index]?.employerName && (
                <Text style={styles.errorText}>
                  {errors.employments[index]?.employerName?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`employments.${index}.designation`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Designation</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.employments?.[index]?.designation && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
              />
              {errors.employments?.[index]?.designation && (
                <Text style={styles.errorText}>
                  {errors.employments[index]?.designation?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`employments.${index}.fromDate`}
          render={({field: {value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.dateInput,
                  errors.employments?.[index]?.fromDate && styles.inputError,
                ]}
                onPress={() => {
                  setCurrentDateIndex(index);
                  setFromDatePickerVisible(true);
                }}>
                <Text style={value ? styles.dateText : styles.placeholder}>
                  {value || 'Select From Date'}
                </Text>
              </TouchableOpacity>
              {errors.employments?.[index]?.fromDate && (
                <Text style={styles.errorText}>
                  {errors.employments[index]?.fromDate?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`employments.${index}.toDate`}
          render={({field: {value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.dateInput,
                  errors.employments?.[index]?.toDate && styles.inputError,
                ]}
                onPress={() => {
                  setCurrentDateIndex(index);
                  setToDatePickerVisible(true);
                }}>
                <Text style={value ? styles.dateText : styles.placeholder}>
                  {value || 'Select To Date'}
                </Text>
              </TouchableOpacity>
              {errors.employments?.[index]?.toDate && (
                <Text style={styles.errorText}>
                  {errors.employments[index]?.toDate?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`employments.${index}.contactPersonName`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contact Person Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.employments?.[index]?.contactPersonName &&
                    styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
              />
              {errors.employments?.[index]?.contactPersonName && (
                <Text style={styles.errorText}>
                  {errors.employments[index]?.contactPersonName?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`employments.${index}.contactPersonNumber`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contact Person Number</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.employments?.[index]?.contactPersonNumber &&
                    styles.inputError,
                  {color: colors.text.primary},
                ]}
                value={value}
                onChangeText={text => {
                  // Only allow numbers and limit to 10 digits
                  if (/^\d*$/.test(text)) {
                    onChange(text.slice(0, 10));
                  }
                }}
                keyboardType="numeric"
                maxLength={10}
                placeholder="Enter 10 digit number"
                placeholderTextColor={colors.text.disabled}
              />
              {errors.employments?.[index]?.contactPersonNumber && (
                <Text style={styles.errorText}>
                  {errors.employments[index]?.contactPersonNumber?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`employments.${index}.reasonForMovement`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reason for Movement</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.employments?.[index]?.reasonForMovement &&
                    styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
              />
              {errors.employments?.[index]?.reasonForMovement && (
                <Text style={styles.errorText}>
                  {errors.employments[index]?.reasonForMovement?.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {fields.map((field, index) => renderEmploymentFields(index))}

      {fields?.length < 2 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            append({
              employerName: '',
              designation: '',
              fromDate: '',
              toDate: '',
              contactPersonName: '',
              contactPersonNumber: '',
              reasonForMovement: '',
            })
          }>
          <Text style={styles.addButtonText}>Add Another Employment</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onFormSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isFromDatePickerVisible}
        mode="date"
        onConfirm={handleFromDateConfirm}
        onCancel={() => setFromDatePickerVisible(false)}
        date={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        maximumDate={new Date()}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />

      <DateTimePickerModal
        isVisible={isToDatePickerVisible}
        mode="date"
        onConfirm={handleToDateConfirm}
        onCancel={() => setToDatePickerVisible(false)}
        date={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        maximumDate={new Date()}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  employmentContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  employmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  employmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text.primary,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: colors.button.secondary.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  addButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    borderColor: colors.button.primary.background,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 40,
  },
  submitButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 4,
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholder: {
    fontSize: 16,
    color: colors.text.disabled,
  },
});

export default PastEmployment;
