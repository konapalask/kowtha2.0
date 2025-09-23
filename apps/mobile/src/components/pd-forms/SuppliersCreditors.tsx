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

interface SupplierCreditor {
  numberOfFixedSuppliers: string;
  creditPeriod: string;
  cashChequeProportions: string;
  supplier1Name: string;
  supplier1Phone: string;
  supplier1Location: string;
  supplier1Review: string;
  supplier2Name: string;
  supplier2Phone: string;
  supplier2Location: string;
  supplier2Review: string;
  supplier3Name: string;
  supplier3Phone: string;
  supplier3Location: string;
  supplier3Review: string;
}

interface SuppliersCreditorsFormData {
  numberOfFixedSuppliers: string;
  creditPeriod: string;
  cashChequeProportions: string;
  supplier1Name: string;
  supplier1Phone: string;
  supplier1Location: string;
  supplier1Review: string;
  supplier2Name: string;
  supplier2Phone: string;
  supplier2Location: string;
  supplier2Review: string;
  supplier3Name: string;
  supplier3Phone: string;
  supplier3Location: string;
  supplier3Review: string;
}

interface SuppliersCreditorsProps {
  onSubmit: (data: SuppliersCreditorsFormData) => void;
  initialData?: SuppliersCreditorsFormData;
}

const REVIEW_OPTIONS = [
  {id: 'positive', name: 'Positive'},
  {id: 'negative', name: 'Negative'},
];

const SuppliersCreditors: React.FC<SuppliersCreditorsProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SuppliersCreditorsFormData>({
    defaultValues: initialData || {
      numberOfFixedSuppliers: '',
      creditPeriod: '',
      cashChequeProportions: '',
      supplier1Name: '',
      supplier1Phone: '',
      supplier1Location: '',
      supplier1Review: '',
      supplier2Name: '',
      supplier2Phone: '',
      supplier2Location: '',
      supplier2Review: '',
      supplier3Name: '',
      supplier3Phone: '',
      supplier3Location: '',
      supplier3Review: '',
    },
  });

  const onFormSubmit = (data: SuppliersCreditorsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Supplier Information</Text>

      <InputFormItem
        data={{
          title: 'No. of Fixed Suppliers',
          key: 'numberOfFixedSuppliers',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of fixed suppliers',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Credit Period',
          key: 'creditPeriod',
          control,
          errors,
          required: true,
          placeholder: 'Enter credit period',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Cash-Cheque Proportions',
          key: 'cashChequeProportions',
          control,
          errors,
          required: true,
          placeholder: 'Enter cash-cheque proportions',
        }}
      />

      <Text style={styles.sectionTitle}>Top 3 Suppliers</Text>

      {/* Supplier 1 */}
      <View style={styles.supplierContainer}>
        <Text style={styles.supplierTitle}>Supplier 1</Text>

        <InputFormItem
          data={{
            title: 'Name',
            key: 'supplier1Name',
            control,
            errors,
            required: true,
            placeholder: 'Enter supplier name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Phone Number',
            key: 'supplier1Phone',
            control,
            errors,
            required: true,
            placeholder: 'Enter phone number',
            keyboardType: 'phone-pad',
          }}
        />

        <InputFormItem
          data={{
            title: 'Location',
            key: 'supplier1Location',
            control,
            errors,
            required: true,
            placeholder: 'Enter location',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Review',
            key: 'supplier1Review',
            control,
            errors,
            required: true,
            options: REVIEW_OPTIONS,
          }}
        />
      </View>

      {/* Supplier 2 */}
      <View style={styles.supplierContainer}>
        <Text style={styles.supplierTitle}>Supplier 2</Text>

        <InputFormItem
          data={{
            title: 'Name',
            key: 'supplier2Name',
            control,
            errors,
            required: false,
            placeholder: 'Enter supplier name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Phone Number',
            key: 'supplier2Phone',
            control,
            errors,
            required: false,
            placeholder: 'Enter phone number',
            keyboardType: 'phone-pad',
          }}
        />

        <InputFormItem
          data={{
            title: 'Location',
            key: 'supplier2Location',
            control,
            errors,
            required: false,
            placeholder: 'Enter location',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Review',
            key: 'supplier2Review',
            control,
            errors,
            required: false,
            options: REVIEW_OPTIONS,
          }}
        />
      </View>

      {/* Supplier 3 */}
      <View style={styles.supplierContainer}>
        <Text style={styles.supplierTitle}>Supplier 3</Text>

        <InputFormItem
          data={{
            title: 'Name',
            key: 'supplier3Name',
            control,
            errors,
            required: false,
            placeholder: 'Enter supplier name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Phone Number',
            key: 'supplier3Phone',
            control,
            errors,
            required: false,
            placeholder: 'Enter phone number',
            keyboardType: 'phone-pad',
          }}
        />

        <InputFormItem
          data={{
            title: 'Location',
            key: 'supplier3Location',
            control,
            errors,
            required: false,
            placeholder: 'Enter location',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Review',
            key: 'supplier3Review',
            control,
            errors,
            required: false,
            options: REVIEW_OPTIONS,
          }}
        />
      </View>

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
  supplierContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  supplierTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: colors.button.primary.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  submitButtonText: {
    color: colors.button.primary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuppliersCreditors;
