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

export type TataValueAddedInfoFormData = {
  customerBehaviour: string;
  salariesPaidDuringCovid: string;
  salaryDeductionPercentage: string;
  natureOfNeighborhoodShops: string;
  digitalWalletUsed: string;
  customerShopOfficeLocality: string;
  nearbyTransportStand: string;
  utilityBillUnitsConsumption: string;
  lossSufferedInBusiness: string;
  lossReason: string;
  strengths: string;
  weaknesses: string;
};

type TataValueAddedInfoProps = {
  formData: TataValueAddedInfoFormData;
  onSubmit: (data: TataValueAddedInfoFormData) => void;
};

const YES_NO_PARTIAL_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
  {id: 'partial', name: 'Partial'},
];

const YES_NO_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
];

const LOCALITY_OPTIONS = [
  {id: 'slum', name: 'Slum'},
  {id: 'market_road', name: 'Market Road'},
  {id: 'main_road', name: 'Main Road'},
  {id: 'highway', name: 'Highway'},
];

const TataUBLValueAddedInfo: React.FC<TataValueAddedInfoProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<TataValueAddedInfoFormData>({
    defaultValues: formData,
  });

  const salariesPaidDuringCovid = watch('salariesPaidDuringCovid');
  const lossSufferedInBusiness = watch('lossSufferedInBusiness');

  const onFormSubmit = (data: TataValueAddedInfoFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Value Added Information</Text>

      <InputFormItem
        data={{
          title: 'Customer Behaviour',
          key: 'customerBehaviour',
          control,
          errors,
          required: true,
          placeholder: 'Enter customer behaviour details',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Salaries Paid During COVID to Employees',
          key: 'salariesPaidDuringCovid',
          control,
          errors,
          required: true,
          options: YES_NO_PARTIAL_OPTIONS,
        }}
      />

      {salariesPaidDuringCovid === 'partial' && (
        <InputFormItem
          data={{
            title: 'If Partly Paid, % of Deduction on Salary',
            key: 'salaryDeductionPercentage',
            control,
            errors,
            required: true,
            placeholder: 'Enter percentage of salary deduction',
            keyboardType: 'numeric',
          }}
        />
      )}

      <InputFormItem
        data={{
          title: 'Nature/Types of Neighborhood Shops',
          key: 'natureOfNeighborhoodShops',
          control,
          errors,
          required: true,
          placeholder: 'Enter nature of neighborhood shops',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Digital Wallet Used in the Business',
          key: 'digitalWalletUsed',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Customer Shop/Office Locality',
          key: 'customerShopOfficeLocality',
          control,
          errors,
          required: true,
          options: LOCALITY_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'Nearby Bus Stop/Taxi Stand/Rickshaw Stand/Metro Station Name',
          key: 'nearbyTransportStand',
          control,
          errors,
          required: true,
          placeholder: 'Enter nearby transport stand details',
        }}
      />

      <SelectFormItem
        data={{
          title:
            'Utility Bill Last 2 Months & Present Month Units Consumption to be Written',
          key: 'utilityBillUnitsConsumption',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Loss Suffered in Business',
          key: 'lossSufferedInBusiness',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      {lossSufferedInBusiness === 'yes' && (
        <TextAreaFormItem
          data={{
            title: 'If Yes, Then Reason',
            key: 'lossReason',
            control,
            errors,
            required: true,
            placeholder: 'Enter reason for business loss',
          }}
        />
      )}

      <TextAreaFormItem
        data={{
          title: 'Strengths',
          key: 'strengths',
          control,
          errors,
          required: true,
          placeholder: 'Enter business strengths',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Weaknesses',
          key: 'weaknesses',
          control,
          errors,
          required: true,
          placeholder: 'Enter business weaknesses',
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

export default TataUBLValueAddedInfo;
