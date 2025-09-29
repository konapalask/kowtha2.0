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

export type TataUBLOfficeAddressFormData = {
  address: string;
  ownershipOfPremises: string;
  ownedBy: string;
  areaInSqFt: string;
  occupiedSinceYears: string;
  cmvRentPerMonth: string;
};

type TataUBLOfficeAddressProps = {
  formData: TataUBLOfficeAddressFormData;
  onSubmit: (data: TataUBLOfficeAddressFormData) => void;
};

const OWNERSHIP_OPTIONS = [
  {id: 'rented', name: 'Rented'},
  {id: 'owned', name: 'Owned'},
  {id: 'leased', name: 'Leased'},
];

const TataUBLOfficeAddress: React.FC<TataUBLOfficeAddressProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<TataUBLOfficeAddressFormData>({
    defaultValues: formData,
  });

  const ownershipOfPremises = watch('ownershipOfPremises');

  const onFormSubmit = (data: TataUBLOfficeAddressFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Office Address</Text>

      <InputFormItem
        data={{
          title: 'Address',
          key: 'address',
          control,
          errors,
          required: true,
          placeholder: 'Enter office address',
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
          key: 'occupiedSinceYears',
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

export default TataUBLOfficeAddress;
