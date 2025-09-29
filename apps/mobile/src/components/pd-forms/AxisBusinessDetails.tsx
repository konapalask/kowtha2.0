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

export type AxisBusinessDetailsFormData = {
  nameOfFirm: string;
  constitution: string;
  whoStartedBusiness: string;
  ownershipOfBusinessPlace: string;
  yearsInCurrentOffice: string;
  yearsInCurrentCity: string;
  prevEmployment: string;
  isResidenceCumOffice: string;
};

type AxisBusinessDetailsProps = {
  formData: any;
  onSubmit: any;
};

const CONSTITUTION_OPTIONS = [
  {id: 'sole_proprietorship', name: 'Sole Proprietorship'},
  {id: 'partnership', name: 'Partnership'},
  {id: 'private_limited', name: 'Private Limited'},
  {id: 'public_limited', name: 'Public Limited'},
  {id: 'llp', name: 'Limited Liability Partnership'},
  {id: 'huf', name: 'Hindu Undivided Family'},
  {id: 'other', name: 'Other'},
];

const WHO_STARTED_BUSINESS_OPTIONS = [
  {id: 'self', name: 'Self'},
  {id: 'acquired', name: 'Acquired'},
  {id: 'second_gen', name: 'Second Gen'},
];

const OWNERSHIP_OF_BUSINESS_PLACE_OPTIONS = [
  {id: 'self_owned', name: 'Self Owned'},
  {id: 'rented', name: 'Rented'},
];

const YES_NO_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
];

const AxisBusinessDetails: React.FC<AxisBusinessDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AxisBusinessDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: AxisBusinessDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Name of the Firm *</Text>
        <Text style={styles.readonlyText}>{formData?.nameOfFirm || 'N/A'}</Text>
      </View>

      <SelectFormItem
        data={{
          title: 'Constitution',
          key: 'constitution',
          control,
          errors,
          required: true,
          options: CONSTITUTION_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Who Started the Business',
          key: 'whoStartedBusiness',
          control,
          errors,
          required: true,
          options: WHO_STARTED_BUSINESS_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Ownership of Business Place',
          key: 'ownershipOfBusinessPlace',
          control,
          errors,
          required: true,
          options: OWNERSHIP_OF_BUSINESS_PLACE_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'Years in Current Office',
          key: 'yearsInCurrentOffice',
          control,
          errors,
          required: true,
          placeholder: 'Enter years in current office',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Years in Current City',
          key: 'yearsInCurrentCity',
          control,
          errors,
          required: true,
          placeholder: 'Enter years in current city',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Previous Employment (if any)',
          key: 'prevEmployment',
          control,
          errors,
          required: false,
          placeholder: 'Enter previous employment details',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Is Residence Cum Office?',
          key: 'isResidenceCumOffice',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
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

export default AxisBusinessDetails;
