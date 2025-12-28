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
import {InputFormItem} from '../../../lib/InputFormItem';
import {SelectFormItem} from '../../../lib/SelectFormItem';

export type TataUBLSiteVisitObservationsFormData = {
  nameplateDisplayed: string;
  officeWellFurnished: string;
  businessActivitySeen: string;
  difficultyInLocatingPremises: string;
  neighborhood: string;
  landmark: string;
  abnormalIncreaseDecreaseInTurnover: string;
  anyDecreaseInNetworth: string;
  stockSeenDuringPD: string;
  noOfEmployeesSeenDuringPD: string;
  noOfCustomersSeenDuringPD: string;
};

type TataUBLSiteVisitObservationsProps = {
  formData: TataUBLSiteVisitObservationsFormData;
  onSubmit: (data: TataUBLSiteVisitObservationsFormData) => void;
};

const YES_NO_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
];

const TataUBLSiteVisitObservations: React.FC<
  TataUBLSiteVisitObservationsProps
> = ({formData, onSubmit}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLSiteVisitObservationsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: TataUBLSiteVisitObservationsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Site Visit Observations</Text>

      <SelectFormItem
        data={{
          title: 'Name Plate Displayed',
          key: 'nameplateDisplayed',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Office Well Furnished',
          key: 'officeWellFurnished',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
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
          title: 'Difficulty in Locating Premises',
          key: 'difficultyInLocatingPremises',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'Neighborhood',
          key: 'neighborhood',
          control,
          errors,
          required: true,
          placeholder: 'Enter neighborhood details',
        }}
      />

      <InputFormItem
        data={{
          title: 'Landmark',
          key: 'landmark',
          control,
          errors,
          required: true,
          placeholder: 'Enter landmark details',
        }}
      />

      <InputFormItem
        data={{
          title: 'Abnormal Increase / Decrease in Turnover',
          key: 'abnormalIncreaseDecreaseInTurnover',
          control,
          errors,
          required: true,
          placeholder: 'Enter turnover change details',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Any Decrease in Networth',
          key: 'anyDecreaseInNetworth',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Stock Seen During PD',
          key: 'stockSeenDuringPD',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'No of Employees Seen During PD',
          key: 'noOfEmployeesSeenDuringPD',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of employees seen',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'No of Customers Seen During PD',
          key: 'noOfCustomersSeenDuringPD',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of customers seen',
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

export default TataUBLSiteVisitObservations;
