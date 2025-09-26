import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm, useFieldArray} from 'react-hook-form';
import {colors} from '../../constants/colors';
import {InputFormItem} from '../../lib/InputFormItem';
import {SelectFormItem} from '../../lib/SelectFormItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

interface Customer {
  name: string;
  phone: string;
  location: string;
  review: string;
}

interface ClientsDebtorsFormData {
  customers: Customer[];
}

interface ClientsDebtorsProps {
  onSubmit: (data: ClientsDebtorsFormData) => void;
  initialData?: ClientsDebtorsFormData;
  maxCustomers?: number;
}

const REVIEW_OPTIONS = [
  {id: 'positive', name: 'Positive'},
  {id: 'negative', name: 'Negative'},
];

const ClientsDebtors: React.FC<ClientsDebtorsProps> = ({
  onSubmit,
  initialData = {customers: []},
  maxCustomers,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<ClientsDebtorsFormData>({
    defaultValues: {
      customers:
        initialData?.customers?.length > 0
          ? initialData?.customers
          : [createEmptyCustomer()],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'customers',
  });

  function createEmptyCustomer(): Customer {
    return {
      name: '',
      phone: '',
      location: '',
      review: '',
    };
  }

  const handleAddCustomer = () => {
    if (maxCustomers && fields.length >= maxCustomers) {
      Toast.show({
        type: 'error',
        text1: 'Maximum Limit Reached',
        text2: `Cannot add more than ${maxCustomers} customers`,
        position: 'bottom',
      });
      return;
    }
    append(createEmptyCustomer());
  };

  const onFormSubmit = (data: ClientsDebtorsFormData) => {
    onSubmit(data);
  };

  const renderCustomerFields = (index: number) => {
    return (
      <View key={index} style={styles.customerContainer}>
        <View style={styles.customerHeader}>
          <Text style={styles.customerTitle}>Customer {index + 1}</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => remove(index)}
              style={styles.removeButton}>
              <Icon name="delete" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        <InputFormItem
          data={{
            title: 'Name',
            key: `customers.${index}.name`,
            control,
            errors,
            required: true,
            placeholder: 'Enter customer name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Phone Number',
            key: `customers.${index}.phone`,
            control,
            errors,
            required: true,
            placeholder: 'Enter phone number',
            keyboardType: 'phone-pad',
            rules: {
              validate: (value: string) => {
                if (value.length !== 10)
                  return 'Phone number must be 10 digits';
                return true;
              },
            },
          }}
        />

        <InputFormItem
          data={{
            title: 'Location',
            key: `customers.${index}.location`,
            control,
            errors,
            required: true,
            placeholder: 'Enter location',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Review',
            key: `customers.${index}.review`,
            control,
            errors,
            required: true,
            options: REVIEW_OPTIONS,
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Customers</Text>

      {fields.map((field, index) => renderCustomerFields(index))}

      <TouchableOpacity
        style={[
          styles.addButton,
          maxCustomers && fields.length >= maxCustomers
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleAddCustomer}
        disabled={maxCustomers ? fields.length >= maxCustomers : false}>
        <Text
          style={[
            styles.addButtonText,
            maxCustomers && fields.length >= maxCustomers
              ? styles.disabledButtonText
              : null,
          ]}>
          Add Customer{' '}
          {maxCustomers ? `(${fields.length}/${maxCustomers})` : ''}
        </Text>
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
  customerContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    backgroundColor: colors.button.secondary.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  addButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#9E9E9E',
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
