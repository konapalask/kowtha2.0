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
import {SelectFormItem} from '../../lib/SelectFormItem';
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';

export type AxisBankPerformanceFormData = {
  anyChequeBounces: string;
  detailsOfCollateral: string;
};

type AxisBankPerformanceProps = {
  formData: any;
  onSubmit: any;
};

const YES_NO_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
];

const AxisBankPerformance: React.FC<AxisBankPerformanceProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AxisBankPerformanceFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: AxisBankPerformanceFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <SelectFormItem
        data={{
          title: 'Any Cheque Bounces',
          key: 'anyChequeBounces',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Details of Collateral',
          key: 'detailsOfCollateral',
          control,
          errors,
          required: true,
          placeholder: 'Enter details of collateral...',
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

export default AxisBankPerformance;
