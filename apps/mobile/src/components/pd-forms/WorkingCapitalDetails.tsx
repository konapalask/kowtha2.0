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
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';

export type WorkingCapitalDetailsFormData = {
  bankName: string;
  limit: string;
  utilization: string;
  collateral: string;
  linkedLoansIfAny: string;
  endOfProposedLoans: string;
};

type WorkingCapitalDetailsProps = {
  formData: any;
  onSubmit: any;
};

const WorkingCapitalDetails: React.FC<WorkingCapitalDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<WorkingCapitalDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: WorkingCapitalDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <InputFormItem
        data={{
          title: 'Bank Name',
          key: 'bankName',
          control,
          errors,
          required: true,
          placeholder: 'Enter bank name',
        }}
      />

      <InputFormItem
        data={{
          title: 'Limit',
          key: 'limit',
          control,
          errors,
          required: true,
          placeholder: 'Enter limit amount',
          keyboardType: 'numeric',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Utilization',
          key: 'utilization',
          control,
          errors,
          required: true,
          placeholder: 'Describe utilization details...',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Collateral',
          key: 'collateral',
          control,
          errors,
          required: true,
          placeholder: 'Describe collateral details...',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Linked Loans (if any)',
          key: 'linkedLoansIfAny',
          control,
          errors,
          required: false,
          placeholder: 'Describe linked loans if any...',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'End of Proposed Loans',
          key: 'endOfProposedLoans',
          control,
          errors,
          required: true,
          placeholder: 'Describe end of proposed loans...',
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

export default WorkingCapitalDetails;
