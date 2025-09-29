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

export type TataProposedLoanDetailsFormData = {
  product: string;
  amount: string;
  tenure: string;
  repaymentFrom: string;
  bankName: string;
  type: string;
  accNo: string;
};

type TataProposedLoanDetailsProps = {
  formData: TataProposedLoanDetailsFormData;
  onSubmit: (data: TataProposedLoanDetailsFormData) => void;
};

const TataUBLProposedLoanDetails: React.FC<TataProposedLoanDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataProposedLoanDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: TataProposedLoanDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Proposed Loan Details</Text>

      <InputFormItem
        data={{
          title: 'Product',
          key: 'product',
          control,
          errors,
          required: true,
          placeholder: 'Enter product',
        }}
      />

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Amount *</Text>
        <Text style={styles.readonlyText}>{formData?.amount || 'N/A'}</Text>
      </View>

      <InputFormItem
        data={{
          title: 'Tenure',
          key: 'tenure',
          control,
          errors,
          required: true,
          placeholder: 'Enter tenure',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Repayment From',
          key: 'repaymentFrom',
          control,
          errors,
          required: true,
          placeholder: 'Enter repayment from',
        }}
      />

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Bank Name *</Text>
        <Text style={styles.readonlyText}>{formData?.bankName || 'N/A'}</Text>
      </View>

      <InputFormItem
        data={{
          title: 'Type (SA A/C)',
          key: 'type',
          control,
          errors,
          required: true,
          placeholder: 'Enter type',
        }}
      />

      <InputFormItem
        data={{
          title: 'Acc No',
          key: 'accNo',
          control,
          errors,
          required: true,
          placeholder: 'Enter account number',
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
  readonlyField: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text.primary,
  },
  readonlyText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontStyle: 'italic',
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

export default TataUBLProposedLoanDetails;
