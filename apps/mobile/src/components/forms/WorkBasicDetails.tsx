import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {colors} from '../../constants/colors';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ExtraDimensions from 'react-native-extra-dimensions-android';

interface WorkBasicDetailsFormData {
  applicantName: string;
  bankName: string;
  prospectNumber: string;
  purposeOfLoan: string;
  loanAmount: string;
  tenure: string;
  panNumber: string;
  aadhar: string;
  qualification: string;
}

interface Props {
  initialData?: Partial<WorkBasicDetailsFormData>;
  onSubmit: (data: WorkBasicDetailsFormData) => void;
}

const validationSchema = yup.object().shape({
  applicantName: yup.string().required('Applicant Name is required'),
  bankName: yup.string().required('Bank Name is required'),
  prospectNumber: yup.string().required('Prospect Number is required'),
  purposeOfLoan: yup.string().required('Purpose of Loan is required'),
  // loanAmount: yup.string().required('Loan Amount is required'),
  tenure: yup.string().required('Tenure is required'),
  panNumber: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
    .optional()
    .default(''),
  aadhar: yup
    .string()
    .matches(/^\d{12}$/, 'Invalid Aadhar number')
    .optional()
    .default(''),
  qualification: yup.string().required('Qualification is required'),
});

const QUALIFICATION_OPTIONS = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'Diploma/ITI Certification',
  'Graduate',
  'PG/Professional Certification',
];

const WorkBasicDetails: React.FC<Props> = ({initialData, onSubmit}) => {
  const qualificationSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();
  // console.log(insets);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    reset,
  } = useForm<WorkBasicDetailsFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData || {
      applicantName: '',
      bankName: '',
      prospectNumber: '',
      purposeOfLoan: '',
      loanAmount: '',
      tenure: '',
      // panNumber: '',
      // aadharNumber: '',
      qualification: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const showQualificationSheet = () => {
    qualificationSheetRef.current?.show();
  };

  const onFormSubmit = (data: WorkBasicDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Controller
        control={control}
        name="applicantName"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Applicant Name</Text>
            <TextInput
              style={[
                styles.input,
                styles.readOnlyInput,
                errors.applicantName && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              editable={false}
            />
            {errors.applicantName && (
              <Text style={styles.errorText}>
                {errors.applicantName.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="bankName"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bank Name</Text>
            <TextInput
              style={[
                styles.input,
                styles.readOnlyInput,
                errors.bankName && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              editable={false}
              multiline
              numberOfLines={2}
            />
            {errors.bankName && (
              <Text style={styles.errorText}>{errors.bankName.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="prospectNumber"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Prospect Number</Text>
            <TextInput
              style={[
                styles.input,
                styles.readOnlyInput,
                errors.prospectNumber && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              editable={false}
            />
            {errors.prospectNumber && (
              <Text style={styles.errorText}>
                {errors.prospectNumber.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="purposeOfLoan"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Purpose of Loan</Text>
            <TextInput
              style={[
                styles.input,
                styles.readOnlyInput,
                errors.purposeOfLoan && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              editable={false}
            />
            {errors.purposeOfLoan && (
              <Text style={styles.errorText}>
                {errors.purposeOfLoan.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="loanAmount"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Loan Amount</Text>
            <TextInput
              style={[
                styles.input,
                styles.readOnlyInput,
                errors.loanAmount && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              editable={false}
            />
            {errors.loanAmount && (
              <Text style={styles.errorText}>{errors.loanAmount.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="panNumber"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>PAN Number</Text>
            <TextInput
              style={[
                styles.input,
                errors.panNumber && styles.inputError,
                {color: colors.text.primary},
              ]}
              value={value}
              onChangeText={text => {
                // Convert to uppercase and remove any non-alphanumeric characters
                const formattedText = text
                  .replace(/[^A-Za-z0-9]/g, '')
                  .toUpperCase();
                onChange(formattedText);
              }}
              maxLength={10}
              placeholder="Enter PAN number"
              placeholderTextColor={colors.text.disabled}
            />
            {errors.panNumber && (
              <Text style={styles.errorText}>{errors.panNumber.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="aadhar"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Aadhar Number</Text>
            <TextInput
              style={[styles.input, errors.aadhar && styles.inputError]}
              value={value}
              onChangeText={text => {
                // Only pass numeric values to onChange
                if (/^\d*$/.test(text)) {
                  onChange(text);
                }
              }}
              maxLength={12}
              keyboardType="numeric"
              placeholder="Enter Aadhar"
              placeholderTextColor={colors.text.disabled}
            />
            {errors.aadhar && (
              <Text style={styles.errorText}>{errors.aadhar.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="tenure"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tenure (in months)</Text>
            <TextInput
              style={[
                styles.input,
                errors.tenure && styles.inputError,
                {color: colors.text.primary},
              ]}
              value={value}
              onChangeText={text => {
                // Only pass numeric values to onChange
                if (/^\d*$/.test(text)) {
                  onChange(text);
                }
              }}
              keyboardType="numeric"
              placeholder="Enter tenure in months"
              placeholderTextColor={colors.text.disabled}
            />
            {errors.tenure && (
              <Text style={styles.errorText}>{errors.tenure.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="qualification"
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Qualification</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                errors.qualification && styles.inputError,
              ]}
              onPress={showQualificationSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Qualification'}
              </Text>
            </TouchableOpacity>
            {errors.qualification && (
              <Text style={styles.errorText}>
                {errors.qualification.message}
              </Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onFormSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      <ActionSheet
        ref={qualificationSheetRef}
        containerStyle={styles.actionSheet}>
        <View
          style={[
            styles.actionSheetContent,
            {paddingBottom: insets.bottom || 50},
          ]}>
          <Text style={styles.actionSheetTitle}>Select Qualification</Text>
          {QUALIFICATION_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('qualification', option);
                qualificationSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
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
    backgroundColor: colors.input.background,
  },
  inputError: {
    borderColor: colors.error,
  },
  readOnlyInput: {
    backgroundColor: colors.input.disabled,
    color: colors.text.primary,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    borderColor: colors.button.primary.background,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 40,
  },
  submitButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.input.background,
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholder: {
    fontSize: 16,
    color: colors.text.disabled,
  },
  actionSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  actionSheetContent: {
    padding: 16,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text.primary,
  },
  actionSheetItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionSheetItemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
});

export default WorkBasicDetails;
