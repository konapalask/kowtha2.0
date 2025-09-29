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
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';

export type TataUBLBusinessDetailsFormData = {
  currentBusinessDetails: string;
  stockAsOnDate: string;
};

type TataUBLBusinessDetailsProps = {
  formData: TataUBLBusinessDetailsFormData;
  onSubmit: (data: TataUBLBusinessDetailsFormData) => void;
};

const TataUBLBusinessDetails: React.FC<TataUBLBusinessDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLBusinessDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: TataUBLBusinessDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Business Details</Text>

      <TextAreaFormItem
        data={{
          title: 'Current Business Details',
          key: 'currentBusinessDetails',
          control,
          errors,
          required: true,
          placeholder: 'Enter current business details',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Stock as on Date',
          key: 'stockAsOnDate',
          control,
          errors,
          required: true,
          placeholder: 'Enter stock details as on current date',
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

export default TataUBLBusinessDetails;
