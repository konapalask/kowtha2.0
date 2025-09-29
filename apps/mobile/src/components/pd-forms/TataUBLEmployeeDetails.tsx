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

export type TataUBLEmployeeDetailsFormData = {
  currentEmployees: string;
  salaryRange: string;
  keyEmployeeName: string;
};

type TataUBLEmployeeDetailsProps = {
  formData: TataUBLEmployeeDetailsFormData;
  onSubmit: (data: TataUBLEmployeeDetailsFormData) => void;
};

const TataUBLEmployeeDetails: React.FC<TataUBLEmployeeDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLEmployeeDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: TataUBLEmployeeDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Employee Details</Text>

      <InputFormItem
        data={{
          title: 'Current Employees',
          key: 'currentEmployees',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of current employees',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Salary Range',
          key: 'salaryRange',
          control,
          errors,
          required: true,
          placeholder: 'Enter salary range',
        }}
      />

      <InputFormItem
        data={{
          title: 'Key Employee Name',
          key: 'keyEmployeeName',
          control,
          errors,
          required: true,
          placeholder: 'Enter key employee name',
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

export default TataUBLEmployeeDetails;
