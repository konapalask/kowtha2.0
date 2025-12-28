import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm} from 'react-hook-form';
import {colors} from '../../../constants/colors';
import {TextAreaFormItem} from '../../../lib/TextAreaFormItem';

export type TataUBLAdditionalBusinessDetailsFormData = {
  otherBusinessIncomeDetails: string;
  assets: string;
  liabilities: string;
};

type TataUBLAdditionalBusinessDetailsProps = {
  formData: TataUBLAdditionalBusinessDetailsFormData;
  onSubmit: (data: TataUBLAdditionalBusinessDetailsFormData) => void;
};

const TataUBLAdditionalBusinessDetails: React.FC<
  TataUBLAdditionalBusinessDetailsProps
> = ({formData, onSubmit}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLAdditionalBusinessDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: TataUBLAdditionalBusinessDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Additional Business Details</Text>

      <TextAreaFormItem
        data={{
          title: 'Other Business / Income Details (if any)',
          key: 'otherBusinessIncomeDetails',
          control,
          errors,
          required: true,
          placeholder: 'Enter any other business or income details',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Assets',
          key: 'assets',
          control,
          errors,
          required: true,
          placeholder: 'Enter details about assets',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Liabilities',
          key: 'liabilities',
          control,
          errors,
          required: true,
          placeholder: 'Enter details about liabilities',
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

export default TataUBLAdditionalBusinessDetails;
