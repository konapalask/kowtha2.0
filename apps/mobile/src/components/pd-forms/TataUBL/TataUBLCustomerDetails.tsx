import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm, useFieldArray} from 'react-hook-form';
import {colors} from '../../../constants/colors';
import {InputFormItem} from '../../../lib/InputFormItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

interface Customer {
  customerName: string;
  percentageOfTotalSales: string;
  debtorDays: string;
  relationshipSinceYears: string;
}

interface TataUBLCustomerDetailsFormData {
  totalDebtorsAsOnDate: string;
  totalCustomers: string;
  customers: Customer[];
}

interface TataUBLCustomerDetailsProps {
  onSubmit: (data: TataUBLCustomerDetailsFormData) => void;
  initialData?: TataUBLCustomerDetailsFormData;
  maxCustomers?: number;
}

const TataUBLCustomerDetails: React.FC<TataUBLCustomerDetailsProps> = ({
  onSubmit,
  initialData = {customers: []},
  maxCustomers,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLCustomerDetailsFormData>({
    defaultValues: {
      totalDebtorsAsOnDate: '',
      totalCustomers: '',
      customers: initialData.customers || [],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'customers',
  });

  const createEmptyCustomer = (): Customer => ({
    customerName: '',
    percentageOfTotalSales: '',
    debtorDays: '',
    relationshipSinceYears: '',
  });

  const handleAddCustomer = () => {
    if (maxCustomers && fields.length >= maxCustomers) {
      Toast.show({
        type: 'info',
        text1: 'Maximum customers reached',
        text2: `You can add maximum ${maxCustomers} customers`,
      });
      return;
    }
    append(createEmptyCustomer());
  };

  const onFormSubmit = (data: TataUBLCustomerDetailsFormData) => {
    onSubmit(data);
  };

  const renderCustomerFields = (
    customer: Customer & {id: string},
    index: number,
  ) => (
    <View key={customer.id} style={styles.customerContainer}>
      <View style={styles.customerHeader}>
        <Text style={styles.customerTitle}>Customer {index + 1}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => remove(index)}>
          <Icon name="close" size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <InputFormItem
        data={{
          title: 'Name of Customer',
          key: `customers.${index}.customerName`,
          control,
          errors,
          required: true,
          placeholder: 'Enter customer name',
        }}
      />

      <InputFormItem
        data={{
          title: '% of Total Sales',
          key: `customers.${index}.percentageOfTotalSales`,
          control,
          errors,
          required: true,
          placeholder: 'Enter percentage of total sales',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Debtor Days',
          key: `customers.${index}.debtorDays`,
          control,
          errors,
          required: true,
          placeholder: 'Enter debtor days',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Relationship Since (yrs)',
          key: `customers.${index}.relationshipSinceYears`,
          control,
          errors,
          required: true,
          placeholder: 'Enter years of relationship',
          keyboardType: 'numeric',
        }}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Customer Details</Text>

      <InputFormItem
        data={{
          title: 'Total Debtors as on Date',
          key: 'totalDebtorsAsOnDate',
          control,
          errors,
          required: true,
          placeholder: 'Enter total debtors amount',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Total Customers',
          key: 'totalCustomers',
          control,
          errors,
          required: true,
          placeholder: 'Enter total number of customers',
          keyboardType: 'numeric',
        }}
      />

      <Text style={styles.customerSectionTitle}>Customer Information</Text>

      {fields.map((customer, index) => renderCustomerFields(customer, index))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddCustomer}>
        <Icon name="plus" size={20} color={colors.secondary} />
        <Text style={styles.addButtonText}>Add Customer</Text>
      </TouchableOpacity>

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
  customerSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: colors.text.primary,
  },
  customerContainer: {
    backgroundColor: colors.secondary + '10',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary + '20',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  addButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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

export default TataUBLCustomerDetails;
