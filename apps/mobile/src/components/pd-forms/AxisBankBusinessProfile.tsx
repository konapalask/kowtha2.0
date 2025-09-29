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

export type AxisBankBusinessProfileFormData = {
  natureOfBusiness: string;
  productServicesOffered: string;
  businessModelAndBackground: string;
};

type AxisBankBusinessProfileProps = {
  formData: any;
  onSubmit: any;
};

const NATURE_OF_BUSINESS_OPTIONS = [
  {id: 'trading', name: 'Trading'},
  {id: 'manufacturing', name: 'Manufacturing'},
  {id: 'services', name: 'Services'},
  {id: 'others', name: 'Others'},
];

const AxisBankBusinessProfile: React.FC<AxisBankBusinessProfileProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AxisBankBusinessProfileFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: AxisBankBusinessProfileFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
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

      <TextAreaFormItem
        data={{
          title: 'Product/Services Offered',
          key: 'productServicesOffered',
          control,
          errors,
          required: true,
          placeholder:
            'Describe the products and services offered by the business...',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Business Model and Background of Business',
          key: 'businessModelAndBackground',
          control,
          errors,
          required: true,
          placeholder:
            'Describe the business model, background, and key aspects of the business...',
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

export default AxisBankBusinessProfile;
