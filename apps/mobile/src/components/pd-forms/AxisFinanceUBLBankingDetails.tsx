import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm, useFieldArray} from 'react-hook-form';
import {colors} from '../../constants/colors';
import {InputFormItem} from '../../lib/InputFormItem';
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

interface BankAccount {
  bankName: string;
  branchName: string;
  accountType: string;
  openSince: string;
  endUseOfLoan: string;
}

interface BankingDetailsFormData {
  bankAccounts: BankAccount[];
}

interface BankingDetailsProps {
  onSubmit: (data: BankingDetailsFormData) => void;
  initialData?: BankingDetailsFormData;
  maxBankAccounts?: number;
}

const AxisFinanceUBLBankingDetails: React.FC<BankingDetailsProps> = ({
  onSubmit,
  initialData = {bankAccounts: []},
  maxBankAccounts,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<BankingDetailsFormData>({
    defaultValues: {
      bankAccounts:
        initialData?.bankAccounts?.length > 0
          ? initialData?.bankAccounts
          : [createEmptyBankAccount()],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'bankAccounts',
  });

  function createEmptyBankAccount(): BankAccount {
    return {
      bankName: '',
      branchName: '',
      accountType: '',
      openSince: '',
      endUseOfLoan: '',
    };
  }

  const handleAddBankAccount = () => {
    if (maxBankAccounts && fields.length >= maxBankAccounts) {
      Toast.show({
        type: 'error',
        text1: 'Maximum Limit Reached',
        text2: `Cannot add more than ${maxBankAccounts} bank accounts`,
        position: 'bottom',
      });
      return;
    }
    append(createEmptyBankAccount());
  };

  const onFormSubmit = (data: BankingDetailsFormData) => {
    onSubmit(data);
  };

  const renderBankAccountFields = (index: number) => {
    return (
      <View key={index} style={styles.bankAccountContainer}>
        <View style={styles.bankAccountHeader}>
          <Text style={styles.bankAccountTitle}>Bank Account {index + 1}</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => remove(index)}
              style={styles.removeButton}>
              <Icon name="delete" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        <InputFormItem
          data={{
            title: 'Bank Name',
            key: `bankAccounts.${index}.bankName`,
            control,
            errors,
            required: true,
            placeholder: 'Enter bank name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Branch Name',
            key: `bankAccounts.${index}.branchName`,
            control,
            errors,
            required: true,
            placeholder: 'Enter branch name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Account Type',
            key: `bankAccounts.${index}.accountType`,
            control,
            errors,
            required: true,
            placeholder: 'Enter account type (e.g., Savings, Current)',
          }}
        />

        <InputFormItem
          data={{
            title: 'Open Since',
            key: `bankAccounts.${index}.openSince`,
            control,
            errors,
            required: true,
            placeholder: 'Enter when account was opened',
            keyboardType: 'numeric',
          }}
        />

        <TextAreaFormItem
          data={{
            title: 'End Use of Loan',
            key: `bankAccounts.${index}.endUseOfLoan`,
            control,
            errors,
            required: true,
            placeholder: 'Describe the end use of the loan...',
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Bank Accounts</Text>

      {fields.map((field, index) => renderBankAccountFields(index))}

      <TouchableOpacity
        style={[
          styles.addButton,
          maxBankAccounts && fields.length >= maxBankAccounts
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleAddBankAccount}
        disabled={maxBankAccounts ? fields.length >= maxBankAccounts : false}>
        <Text
          style={[
            styles.addButtonText,
            maxBankAccounts && fields.length >= maxBankAccounts
              ? styles.disabledButtonText
              : null,
          ]}>
          Add Bank Account{' '}
          {maxBankAccounts ? `(${fields.length}/${maxBankAccounts})` : ''}
        </Text>
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
  bankAccountContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bankAccountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankAccountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  removeButton: {
    padding: 4,
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
    marginHorizontal: 16,
  },
  submitButtonText: {
    color: colors.button.primary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#9E9E9E',
  },
});

export default AxisFinanceUBLBankingDetails;
