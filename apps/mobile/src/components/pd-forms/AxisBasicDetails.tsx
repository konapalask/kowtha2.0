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

interface AxisBasicDetailsFormData {
  applicationId: string;
  product: string;
  loanAmount: string;
  customerName: string;
  address: string;
  contactNumber: string;
  personMet: string;
  relationshipWithBorrower: string;
}

interface AxisBasicDetailsProps {
  onSubmit: (data: AxisBasicDetailsFormData) => void;
  initialData?: AxisBasicDetailsFormData;
}

const PRODUCT_OPTIONS = [
  {id: 'hl', name: 'HL'},
  {id: 'lap', name: 'LAP'},
  {id: 'asha_hl', name: 'Asha HL'},
];

const PERSON_MET_OPTIONS = [
  {id: 'applicant', name: 'Applicant'},
  {id: 'co_applicant', name: 'Co-applicant'},
  {id: 'guarantor', name: 'Guarantor'},
  {id: 'others', name: 'Others'},
];

const AxisBasicDetails: React.FC<AxisBasicDetailsProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<AxisBasicDetailsFormData>({
    defaultValues: initialData || {
      applicationId: '',
      product: '',
      loanAmount: '',
      customerName: '',
      address: '',
      contactNumber: '',
      personMet: '',
      relationshipWithBorrower: '',
    },
  });

  const personMet = watch('personMet');

  const onFormSubmit = (data: AxisBasicDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Basic Information</Text>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Application ID *</Text>
        <Text style={styles.readonlyText}>
          {initialData?.applicationId || 'N/A'}
        </Text>
      </View>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Product *</Text>
        <Text style={styles.readonlyText}>{initialData?.product || 'N/A'}</Text>
      </View>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Loan Amount *</Text>
        <Text style={styles.readonlyText}>
          {initialData?.loanAmount || 'N/A'}
        </Text>
      </View>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Customer Name *</Text>
        <Text style={styles.readonlyText}>
          {initialData?.customerName || 'N/A'}
        </Text>
      </View>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Address *</Text>
        <Text style={styles.readonlyText}>{initialData?.address || 'N/A'}</Text>
      </View>

      <InputFormItem
        data={{
          title: 'Contact Number',
          key: 'contactNumber',
          control,
          errors,
          required: true,
          placeholder: 'Enter contact number',
          keyboardType: 'phone-pad',
          rules: {
            validate: (value: string) => {
              if (value.length !== 10)
                return 'Contact number must be 10 digits';
              return true;
            },
          },
        }}
      />

      <SelectFormItem
        data={{
          title: 'Person Met',
          key: 'personMet',
          control,
          errors,
          required: true,
          options: PERSON_MET_OPTIONS,
        }}
      />

      {personMet && personMet !== 'applicant' && (
        <InputFormItem
          data={{
            title: 'Relationship with Borrower',
            key: 'relationshipWithBorrower',
            control,
            errors,
            required: true,
            placeholder: 'Enter relationship with borrower',
          }}
        />
      )}

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

export default AxisBasicDetails;
