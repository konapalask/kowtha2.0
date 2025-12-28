import React, {useState} from 'react';
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

interface Supplier {
  name: string;
  phone: string;
  location: string;
  review: string;
}

interface SuppliersCreditorsFormData {
  suppliers: Supplier[];
}

interface SuppliersCreditorsProps {
  onSubmit: (data: SuppliersCreditorsFormData) => void;
  initialData?: SuppliersCreditorsFormData;
  maxSuppliers?: number;
}

const REVIEW_OPTIONS = [
  {id: 'positive', name: 'Positive'},
  {id: 'negative', name: 'Negative'},
];

const SuppliersCreditors: React.FC<SuppliersCreditorsProps> = ({
  onSubmit,
  initialData = {suppliers: []},
  maxSuppliers,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<SuppliersCreditorsFormData>({
    defaultValues: {
      suppliers:
        initialData?.suppliers?.length > 0
          ? initialData?.suppliers
          : [createEmptySupplier()],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'suppliers',
  });

  function createEmptySupplier(): Supplier {
    return {
      name: '',
      phone: '',
      location: '',
      review: '',
    };
  }

  const handleAddSupplier = () => {
    if (maxSuppliers && fields.length >= maxSuppliers) {
      Toast.show({
        type: 'error',
        text1: 'Maximum Limit Reached',
        text2: `Cannot add more than ${maxSuppliers} suppliers`,
        position: 'bottom',
      });
      return;
    }
    append(createEmptySupplier());
  };

  const onFormSubmit = (data: SuppliersCreditorsFormData) => {
    onSubmit(data);
  };

  const renderSupplierFields = (index: number) => {
    return (
      <View key={index} style={styles.supplierContainer}>
        <View style={styles.supplierHeader}>
          <Text style={styles.supplierTitle}>Supplier {index + 1}</Text>
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
            key: `suppliers.${index}.name`,
            control,
            errors,
            required: true,
            placeholder: 'Enter supplier name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Phone Number',
            key: `suppliers.${index}.phone`,
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
            key: `suppliers.${index}.location`,
            control,
            errors,
            required: true,
            placeholder: 'Enter location',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Review',
            key: `suppliers.${index}.review`,
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
      <Text style={styles.sectionTitle}>Suppliers</Text>

      {fields.map((field, index) => renderSupplierFields(index))}

      <TouchableOpacity
        style={[
          styles.addButton,
          maxSuppliers && fields.length >= maxSuppliers
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleAddSupplier}
        disabled={maxSuppliers ? fields.length >= maxSuppliers : false}>
        <Text
          style={[
            styles.addButtonText,
            maxSuppliers && fields.length >= maxSuppliers
              ? styles.disabledButtonText
              : null,
          ]}>
          Add Supplier{' '}
          {maxSuppliers ? `(${fields.length}/${maxSuppliers})` : ''}
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
  supplierContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  supplierTitle: {
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
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#9E9E9E',
  },
});

export default SuppliersCreditors;
