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

interface ClientDebtor {
  numberOfFixedCustomers: string;
  creditPeriod: string;
  cashChequeProportions: string;
  customer1Name: string;
  customer1Phone: string;
  customer1Location: string;
  customer1Review: string;
  customer2Name: string;
  customer2Phone: string;
  customer2Location: string;
  customer2Review: string;
  customer3Name: string;
  customer3Phone: string;
  customer3Location: string;
  customer3Review: string;
  averageStockMaintenance: string;
  turnover: string;
  netMargins: string;
}

interface ClientsDebtorsFormData {
  numberOfFixedCustomers: string;
  creditPeriod: string;
  cashChequeProportions: string;
  customer1Name: string;
  customer1Phone: string;
  customer1Location: string;
  customer1Review: string;
  customer2Name: string;
  customer2Phone: string;
  customer2Location: string;
  customer2Review: string;
  customer3Name: string;
  customer3Phone: string;
  customer3Location: string;
  customer3Review: string;
  averageStockMaintenance: string;
  turnover: string;
  netMargins: string;
}

interface ClientsDebtorsProps {
  onSubmit: (data: ClientsDebtorsFormData) => void;
  initialData?: ClientsDebtorsFormData;
}

const REVIEW_OPTIONS = [
  {id: 'positive', name: 'Positive'},
  {id: 'negative', name: 'Negative'},
];

const ClientsDebtors: React.FC<ClientsDebtorsProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ClientsDebtorsFormData>({
    defaultValues: initialData || {
      numberOfFixedCustomers: '',
      creditPeriod: '',
      cashChequeProportions: '',
      customer1Name: '',
      customer1Phone: '',
      customer1Location: '',
      customer1Review: '',
      customer2Name: '',
      customer2Phone: '',
      customer2Location: '',
      customer2Review: '',
      customer3Name: '',
      customer3Phone: '',
      customer3Location: '',
      customer3Review: '',
      averageStockMaintenance: '',
      turnover: '',
      netMargins: '',
    },
  });

  const onFormSubmit = (data: ClientsDebtorsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Customer Information</Text>

      <InputFormItem
        data={{
          title: 'No. of Fixed Customers',
          key: 'numberOfFixedCustomers',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of fixed customers',
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

      <Text style={styles.sectionTitle}>Top 3 Customers</Text>

      {/* Customer 1 */}
      <View style={styles.customerContainer}>
        <Text style={styles.customerTitle}>Customer 1</Text>

        <InputFormItem
          data={{
            title: 'Name',
            key: 'customer1Name',
            control,
            errors,
            required: true,
            placeholder: 'Enter customer name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Phone Number',
            key: 'customer1Phone',
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
            key: 'customer1Location',
            control,
            errors,
            required: true,
            placeholder: 'Enter location',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Review',
            key: 'customer1Review',
            control,
            errors,
            required: true,
            options: REVIEW_OPTIONS,
          }}
        />
      </View>

      {/* Customer 2 */}
      <View style={styles.customerContainer}>
        <Text style={styles.customerTitle}>Customer 2</Text>

        <InputFormItem
          data={{
            title: 'Name',
            key: 'customer2Name',
            control,
            errors,
            required: false,
            placeholder: 'Enter customer name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Phone Number',
            key: 'customer2Phone',
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
            key: 'customer2Location',
            control,
            errors,
            required: false,
            placeholder: 'Enter location',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Review',
            key: 'customer2Review',
            control,
            errors,
            required: false,
            options: REVIEW_OPTIONS,
          }}
        />
      </View>

      {/* Customer 3 */}
      <View style={styles.customerContainer}>
        <Text style={styles.customerTitle}>Customer 3</Text>

        <InputFormItem
          data={{
            title: 'Name',
            key: 'customer3Name',
            control,
            errors,
            required: false,
            placeholder: 'Enter customer name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Phone Number',
            key: 'customer3Phone',
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
            key: 'customer3Location',
            control,
            errors,
            required: false,
            placeholder: 'Enter location',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Review',
            key: 'customer3Review',
            control,
            errors,
            required: false,
            options: REVIEW_OPTIONS,
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>Business Metrics</Text>

      <InputFormItem
        data={{
          title: 'Average Stock Maintenance',
          key: 'averageStockMaintenance',
          control,
          errors,
          required: true,
          placeholder: 'Enter average stock maintenance',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Turnover',
          key: 'turnover',
          control,
          errors,
          required: true,
          placeholder: 'Enter turnover amount',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Net Margins',
          key: 'netMargins',
          control,
          errors,
          required: true,
          placeholder: 'Enter net margins percentage',
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
  customerContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customerTitle: {
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

export default ClientsDebtors;
