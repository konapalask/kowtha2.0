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

export type BusinessDetailsFormData = {
  yearBusinessStarted: string;
  typeOfBusiness: string;
  businessName: string;
  natureOfBusiness: string;
  stockSource: string;
  stockHandling: string;
  salesVolume: string;
  profitPerUnit: string;
  businessPremisesOwnership: string;
  numberOfWorkers: string;
  wageExpenses: string;
  majorTransactionMode: string;
};

type BusinessDetailsProps = {
  formData: any;
  onSubmit: any;
};

const TYPE_OF_BUSINESS_OPTIONS = [
  {id: 'proprietorship', name: 'Proprietorship'},
  {id: 'partnership', name: 'Partnership'},
  {id: 'private_limited', name: 'Private Limited'},
  {id: 'llp', name: 'LLP'},
  {id: 'others', name: 'Others'},
];

const NATURE_OF_BUSINESS_OPTIONS = [
  {id: 'manufacturer', name: 'Manufacturer'},
  {id: 'trader', name: 'Trader'},
  {id: 'service_provider', name: 'Service Provider'},
  {id: 'distributor', name: 'Distributor'},
  {id: 'retailer', name: 'Retailer'},
  {id: 'others', name: 'Others'},
];

const STOCK_SOURCE_OPTIONS = [
  {id: 'suppliers', name: 'Suppliers'},
  {id: 'farmers', name: 'Farmers'},
];

const STOCK_HANDLING_OPTIONS = [
  {id: 'premises', name: 'Premises'},
  {id: 'direct_delivery', name: 'Direct delivery'},
];

const BUSINESS_PREMISES_OWNERSHIP_OPTIONS = [
  {id: 'owned', name: 'Owned'},
  {id: 'rented', name: 'Rented'},
  {id: 'leased', name: 'Leased'},
  {id: 'shared', name: 'Shared'},
];

const MAJOR_TRANSACTION_MODE_OPTIONS = [
  {id: 'cash', name: 'Cash'},
  {id: 'bank', name: 'Bank'},
];

const ArkaFincapBusinessDetails: React.FC<BusinessDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<BusinessDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: BusinessDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <InputFormItem
        data={{
          title: 'Year Business Started',
          key: 'yearBusinessStarted',
          control,
          errors,
          required: true,
          placeholder: 'Enter year business started',
          keyboardType: 'numeric',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Type of Business',
          key: 'typeOfBusiness',
          control,
          errors,
          required: true,
          options: TYPE_OF_BUSINESS_OPTIONS,
        }}
      />

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Business Name *</Text>
        <Text style={styles.readonlyText}>
          {formData?.businessName || 'N/A'}
        </Text>
      </View>

      <SelectFormItem
        data={{
          title: 'Nature of Business',
          key: 'natureOfBusiness',
          control,
          errors,
          required: true,
          options: NATURE_OF_BUSINESS_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Stock Source',
          key: 'stockSource',
          control,
          errors,
          required: true,
          options: STOCK_SOURCE_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Stock Handling',
          key: 'stockHandling',
          control,
          errors,
          required: true,
          options: STOCK_HANDLING_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'Sales Volume',
          key: 'salesVolume',
          control,
          errors,
          required: true,
          placeholder: 'Enter sales volume',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Profit Per Unit',
          key: 'profitPerUnit',
          control,
          errors,
          required: true,
          placeholder: 'Enter profit per unit',
          keyboardType: 'numeric',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Business Premises Ownership',
          key: 'businessPremisesOwnership',
          control,
          errors,
          required: true,
          options: BUSINESS_PREMISES_OWNERSHIP_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'Number of Workers',
          key: 'numberOfWorkers',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of workers',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Wage Expenses',
          key: 'wageExpenses',
          control,
          errors,
          required: true,
          placeholder: 'Enter wage expenses',
          keyboardType: 'numeric',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Major Transaction Mode',
          key: 'majorTransactionMode',
          control,
          errors,
          required: true,
          options: MAJOR_TRANSACTION_MODE_OPTIONS,
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

export default ArkaFincapBusinessDetails;
