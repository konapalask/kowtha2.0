import React from 'react';
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

interface WorkBasicDetailsFormData {
  applicantName: string;
  bankName: string;
  prospectNumber: string;
  purposeOfLoan: string;
  loanAmount: string;
  tenure: string;
  panNumber: string;
  aadharNumber: string;
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
  loanAmount: yup.string().required('Loan Amount is required'),
  tenure: yup.string().required('Tenure is required'),
  panNumber: yup.string().optional().default(''),
  aadharNumber: yup.string().optional().default(''),
  qualification: yup.string().required('Qualification is required'),
});

const WorkBasicDetails: React.FC<Props> = ({initialData, onSubmit}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<WorkBasicDetailsFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData || {
      applicantName: '',
      bankName: '',
      prospectNumber: '',
      purposeOfLoan: '',
      loanAmount: '',
      tenure: '',
      panNumber: '',
      aadharNumber: '',
      qualification: '',
    },
  });

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
              style={[styles.input, errors.applicantName && styles.inputError]}
              value={value}
              onChangeText={onChange}
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
              style={[styles.input, errors.bankName && styles.inputError]}
              value={value}
              onChangeText={onChange}
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
              style={[styles.input, errors.prospectNumber && styles.inputError]}
              value={value}
              onChangeText={onChange}
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
              style={[styles.input, errors.purposeOfLoan && styles.inputError]}
              value={value}
              onChangeText={onChange}
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
              style={[styles.input, errors.loanAmount && styles.inputError]}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
            {errors.loanAmount && (
              <Text style={styles.errorText}>{errors.loanAmount.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="tenure"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tenure</Text>
            <TextInput
              style={[styles.input, errors.tenure && styles.inputError]}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
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
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Qualification</Text>
            <TextInput
              style={[styles.input, errors.qualification && styles.inputError]}
              value={value}
              onChangeText={onChange}
            />
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
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    borderColor: colors.button.primary.background,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  submitButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkBasicDetails;
