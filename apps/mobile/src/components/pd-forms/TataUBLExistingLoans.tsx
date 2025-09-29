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
import {colors} from '../../constants/colors';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Loan {
  bankName: string;
  purpose: string;
  loanAmount: string;
  emi: string;
  tenure: string;
  outstandingBalance: string;
}

interface TataUBLExistingLoansFormData {
  loans: Loan[];
}

interface TataUBLExistingLoansProps {
  initialData?: Partial<TataUBLExistingLoansFormData>;
  onSubmit: (data: TataUBLExistingLoansFormData) => void;
}

const validationSchema = yup.object().shape({
  loans: yup
    .array()
    .of(
      yup.object().shape({
        bankName: yup.string().required('Bank Name is required'),
        purpose: yup.string().required('Purpose is required'),
        loanAmount: yup.string().required('Loan Amount is required'),
        emi: yup.string().required('EMI is required'),
        tenure: yup.string().required('Tenure is required'),
        outstandingBalance: yup
          .string()
          .required('Outstanding Balance is required'),
      }),
    )
    .required('At least one loan is required'),
});

const TataUBLExistingLoans: React.FC<TataUBLExistingLoansProps> = ({
  initialData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLExistingLoansFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      loans: initialData?.loans || [
        {
          bankName: '',
          purpose: '',
          loanAmount: '',
          emi: '',
          tenure: '',
          outstandingBalance: '',
        },
      ],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'loans',
  });

  const onFormSubmit = (data: TataUBLExistingLoansFormData) => {
    onSubmit(data);
  };

  const renderLoanFields = (index: number) => {
    return (
      <View key={index} style={styles.loanContainer}>
        <View style={styles.loanHeader}>
          <Text style={styles.loanTitle}>Loan {index + 1}</Text>
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
          name={`loans.${index}.bankName`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.loans?.[index]?.bankName && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
                placeholder="Enter bank name"
                placeholderTextColor={colors.text.disabled}
              />
              {errors.loans?.[index]?.bankName && (
                <Text style={styles.errorText}>
                  {errors.loans[index]?.bankName?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`loans.${index}.purpose`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Purpose</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.loans?.[index]?.purpose && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
                placeholder="Enter purpose"
                placeholderTextColor={colors.text.disabled}
              />
              {errors.loans?.[index]?.purpose && (
                <Text style={styles.errorText}>
                  {errors.loans[index]?.purpose?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`loans.${index}.loanAmount`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Loan Amount</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.loans?.[index]?.loanAmount && styles.inputError,
                  {color: colors.text.primary},
                ]}
                value={value}
                onChangeText={text => {
                  // Only allow numbers and limit to 1 decimal place
                  if (/^\d*\.?\d{0,1}$/.test(text)) {
                    onChange(text);
                  }
                }}
                keyboardType="numeric"
                placeholder="Enter loan amount"
                placeholderTextColor={colors.text.disabled}
              />
              {errors.loans?.[index]?.loanAmount && (
                <Text style={styles.errorText}>
                  {errors.loans[index]?.loanAmount?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`loans.${index}.emi`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMI</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.loans?.[index]?.emi && styles.inputError,
                  {color: colors.text.primary},
                ]}
                value={value}
                onChangeText={text => {
                  // Only allow numbers and limit to 1 decimal place
                  if (/^\d*\.?\d{0,1}$/.test(text)) {
                    onChange(text);
                  }
                }}
                keyboardType="numeric"
                placeholder="Enter EMI"
                placeholderTextColor={colors.text.disabled}
              />
              {errors.loans?.[index]?.emi && (
                <Text style={styles.errorText}>
                  {errors.loans[index]?.emi?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`loans.${index}.tenure`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tenure</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.loans?.[index]?.tenure && styles.inputError,
                  {color: colors.text.primary},
                ]}
                value={value}
                onChangeText={text => {
                  // Only allow numbers and limit to 1 decimal place
                  if (/^\d*\.?\d{0,1}$/.test(text)) {
                    onChange(text);
                  }
                }}
                keyboardType="numeric"
                placeholder="Enter tenure"
                placeholderTextColor={colors.text.disabled}
              />
              {errors.loans?.[index]?.tenure && (
                <Text style={styles.errorText}>
                  {errors.loans[index]?.tenure?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`loans.${index}.outstandingBalance`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Outstanding Balance</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.loans?.[index]?.outstandingBalance &&
                    styles.inputError,
                  {color: colors.text.primary},
                ]}
                value={value}
                onChangeText={text => {
                  // Only allow numbers and limit to 1 decimal place
                  if (/^\d*\.?\d{0,1}$/.test(text)) {
                    onChange(text);
                  }
                }}
                keyboardType="numeric"
                placeholder="Enter outstanding balance"
                placeholderTextColor={colors.text.disabled}
              />
              {errors.loans?.[index]?.outstandingBalance && (
                <Text style={styles.errorText}>
                  {errors.loans[index]?.outstandingBalance?.message}
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
      <Text style={styles.sectionTitle}>Existing Loans</Text>

      {fields.map((field, index) => renderLoanFields(index))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          append({
            bankName: '',
            purpose: '',
            loanAmount: '',
            emi: '',
            tenure: '',
            outstandingBalance: '',
          })
        }>
        <Text style={styles.addButtonText}>Add Another Loan</Text>
      </TouchableOpacity>

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: colors.text.primary,
  },
  loanContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanTitle: {
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
    backgroundColor: colors.button.primary.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: colors.button.primary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 4,
  },
});

export default TataUBLExistingLoans;
