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

interface Supplier {
  supplierName: string;
  percentageOfTotalSales: string;
  creditorDays: string;
  relationshipSinceYears: string;
}

interface TataUBLSupplierDetailsFormData {
  totalCreditorsAsOnDate: string;
  totalSuppliers: string;
  suppliers: Supplier[];
}

interface TataUBLSupplierDetailsProps {
  onSubmit: (data: TataUBLSupplierDetailsFormData) => void;
  initialData?: TataUBLSupplierDetailsFormData;
  maxSuppliers?: number;
}

const TataUBLSupplierDetails: React.FC<TataUBLSupplierDetailsProps> = ({
  onSubmit,
  initialData = {suppliers: []},
  maxSuppliers,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLSupplierDetailsFormData>({
    defaultValues: {
      totalCreditorsAsOnDate: '',
      totalSuppliers: '',
      suppliers: initialData.suppliers || [],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'suppliers',
  });

  const createEmptySupplier = (): Supplier => ({
    supplierName: '',
    percentageOfTotalSales: '',
    creditorDays: '',
    relationshipSinceYears: '',
  });

  const handleAddSupplier = () => {
    if (maxSuppliers && fields.length >= maxSuppliers) {
      Toast.show({
        type: 'info',
        text1: 'Maximum suppliers reached',
        text2: `You can add maximum ${maxSuppliers} suppliers`,
      });
      return;
    }
    append(createEmptySupplier());
  };

  const onFormSubmit = (data: TataUBLSupplierDetailsFormData) => {
    onSubmit(data);
  };

  const renderSupplierFields = (
    supplier: Supplier & {id: string},
    index: number,
  ) => (
    <View key={supplier.id} style={styles.supplierContainer}>
      <View style={styles.supplierHeader}>
        <Text style={styles.supplierTitle}>Supplier {index + 1}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => remove(index)}>
          <Icon name="close" size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <InputFormItem
        data={{
          title: 'Name of the Supplier',
          key: `suppliers.${index}.supplierName`,
          control,
          errors,
          required: true,
          placeholder: 'Enter supplier name',
        }}
      />

      <InputFormItem
        data={{
          title: '% of Total Sales',
          key: `suppliers.${index}.percentageOfTotalSales`,
          control,
          errors,
          required: true,
          placeholder: 'Enter percentage of total sales',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Creditor Days',
          key: `suppliers.${index}.creditorDays`,
          control,
          errors,
          required: true,
          placeholder: 'Enter creditor days',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Relationship Since (yrs)',
          key: `suppliers.${index}.relationshipSinceYears`,
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
      <Text style={styles.sectionTitle}>Supplier Details</Text>

      <InputFormItem
        data={{
          title: 'Total Creditors as on Date',
          key: 'totalCreditorsAsOnDate',
          control,
          errors,
          required: true,
          placeholder: 'Enter total creditors amount',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Total Creditors',
          key: 'totalSuppliers',
          control,
          errors,
          required: true,
          placeholder: 'Enter total number of suppliers',
          keyboardType: 'numeric',
        }}
      />

      <Text style={styles.supplierSectionTitle}>Supplier Information</Text>

      {fields.map((supplier, index) => renderSupplierFields(supplier, index))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddSupplier}>
        <Icon name="plus" size={20} color={colors.secondary} />
        <Text style={styles.addButtonText}>Add Supplier</Text>
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
  supplierSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: colors.text.primary,
  },
  supplierContainer: {
    backgroundColor: colors.secondary + '10',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  supplierTitle: {
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

export default TataUBLSupplierDetails;
