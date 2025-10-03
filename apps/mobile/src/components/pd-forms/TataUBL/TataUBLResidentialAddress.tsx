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

export type TataUBLResidentialAddressFormData = {
  address: string;
  ownershipOfPremises: string;
  ownedBy: string;
  areaInSqFt: string;
  occupiedSinceYears: string;
  cmvRentPerMonth: string;
  addressOfPD: string;
  personMet: string;
};

type TataUBLResidentialAddressProps = {
  formData: TataUBLResidentialAddressFormData;
  onSubmit: (data: TataUBLResidentialAddressFormData) => void;
};

const OWNERSHIP_OPTIONS = [
  {id: 'rented', name: 'Rented'},
  {id: 'owned', name: 'Owned'},
  {id: 'leased', name: 'Leased'},
];

const TataUBLResidentialAddress: React.FC<TataUBLResidentialAddressProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<TataUBLResidentialAddressFormData>({
    defaultValues: formData,
  });

  const ownershipOfPremises = watch('ownershipOfPremises');

  const onFormSubmit = (data: TataUBLResidentialAddressFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Residential Address</Text>

      <InputFormItem
        data={{
          title: 'Address',
          key: 'address',
          control,
          errors,
          required: true,
          placeholder: 'Enter residential address',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Ownership of Premises',
          key: 'ownershipOfPremises',
          control,
          errors,
          required: true,
          options: OWNERSHIP_OPTIONS,
        }}
      />

      {(ownershipOfPremises === 'rented' ||
        ownershipOfPremises === 'leased') && (
        <InputFormItem
          data={{
            title: 'Owned By',
            key: 'ownedBy',
            control,
            errors,
            required: true,
            placeholder: 'Enter owner details',
          }}
        />
      )}

      <InputFormItem
        data={{
          title: 'Area (in sq. ft)',
          key: 'areaInSqFt',
          control,
          errors,
          required: true,
          placeholder: 'Enter area in square feet',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Occupied Since (yrs)',
          key: 'occupiedSinceValues',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of years',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'CMV / Rent p.m',
          key: 'cmvRentPerMonth',
          control,
          errors,
          required: true,
          placeholder: 'Enter CMV or rent per month',
          keyboardType: 'numeric',
        }}
      />

      <Text style={styles.pdSectionTitle}>PD Details</Text>

      <InputFormItem
        data={{
          title: 'Address of PD',
          key: 'addressOfPD',
          control,
          errors,
          required: true,
          placeholder: 'Enter address where PD was conducted',
        }}
      />

      <InputFormItem
        data={{
          title: 'Person Met',
          key: 'personMet',
          control,
          errors,
          required: true,
          placeholder: 'Enter name of person met during PD',
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
  pdSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
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

export default TataUBLResidentialAddress;
