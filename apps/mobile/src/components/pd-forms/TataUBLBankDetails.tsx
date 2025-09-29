import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm} from 'react-hook-form';
import {colors} from '../../constants/colors';
import {InputFormItem} from '../../lib/InputFormItem';

export type TataUBLBankDetailsFormData = {
  primaryBanker: string;
  natureOfAccount: string;
  avgBalance: string;
};

type TataUBLBankDetailsProps = {
  formData: TataUBLBankDetailsFormData;
  onSubmit: (data: TataUBLBankDetailsFormData) => void;
};

const TataUBLBankDetails: React.FC<TataUBLBankDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLBankDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: TataUBLBankDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Bank Details</Text>

      <InputFormItem
        data={{
          title: 'Primary Banker',
          key: 'primaryBanker',
          control,
          errors,
          required: true,
          placeholder: 'Enter primary banker name',
        }}
      />

      <InputFormItem
        data={{
          title: 'Nature of the Account',
          key: 'natureOfAccount',
          control,
          errors,
          required: true,
          placeholder: 'Enter nature of the account',
        }}
      />

      <InputFormItem
        data={{
          title: 'Avg. Balance',
          key: 'avgBalance',
          control,
          errors,
          required: true,
          placeholder: 'Enter average balance amount',
          keyboardType: 'numeric',
        }}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: colors.text.primary,
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
});

export default TataUBLBankDetails;
