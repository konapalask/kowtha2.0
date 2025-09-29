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
import {SelectFormItem} from '../../lib/SelectFormItem';
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';

export type AxisMiscelleanousDetailsFormData = {
  businessNameBoardSeen: string;
  noOfEmployeesSeen: string;
  businessActivitySeen: string;
  stockSeen: string;
  noOfMachinesSeen: string;
  anyOtherBusinessOrAlternativeIncomeSource: string;
  anyOtherObservationsOrRemarksDuringVisit: string;
};

type AxisMiscelleanousDetailsProps = {
  formData: any;
  onSubmit: any;
};

const YES_NO_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
];

const AxisMiscelleanousDetails: React.FC<AxisMiscelleanousDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AxisMiscelleanousDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: AxisMiscelleanousDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <SelectFormItem
        data={{
          title: 'Business Name Board Seen',
          key: 'businessNameBoardSeen',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'No of Employees Seen',
          key: 'noOfEmployeesSeen',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of employees seen',
          keyboardType: 'numeric',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Business Activity Seen',
          key: 'businessActivitySeen',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Stock Seen',
          key: 'stockSeen',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'No of Machines Seen',
          key: 'noOfMachinesSeen',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of machines seen',
          keyboardType: 'numeric',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Any Other Business or Alternative Income Source',
          key: 'anyOtherBusinessOrAlternativeIncomeSource',
          control,
          errors,
          required: false,
          placeholder:
            'Describe any other business or alternative income sources...',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Any Other Observations or Remarks During Visit',
          key: 'anyOtherObservationsOrRemarksDuringVisit',
          control,
          errors,
          required: false,
          placeholder:
            'Enter any other observations or remarks during the visit...',
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

export default AxisMiscelleanousDetails;
