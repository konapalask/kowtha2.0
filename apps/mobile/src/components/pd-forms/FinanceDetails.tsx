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

interface Shareholder {
  name: string;
  shareholdingPercentage: string;
  relationshipWithApplicant: string;
  designation: string;
  comingIntoLoanStructure: string;
  functionalOfPartnerDirector: string;
}

interface ShareholdingDetailsFormData {
  shareholders: Shareholder[];
}

interface ShareholdingDetailsProps {
  onSubmit: (data: ShareholdingDetailsFormData) => void;
  initialData?: Shareholder[];
  maxShareholders?: number;
}

const RELATIONSHIP_OPTIONS = [
  {id: 'self', name: 'Self'},
  {id: 'spouse', name: 'Spouse'},
  {id: 'son', name: 'Son'},
  {id: 'daughter', name: 'Daughter'},
  {id: 'father', name: 'Father'},
  {id: 'mother', name: 'Mother'},
  {id: 'brother', name: 'Brother'},
  {id: 'sister', name: 'Sister'},
  {id: 'business_partner', name: 'Business Partner'},
  {id: 'director', name: 'Director'},
  {id: 'other', name: 'Other'},
];

const YES_NO_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
];

const FinanceDetails: React.FC<ShareholdingDetailsProps> = ({
  onSubmit,
  initialData = [],
  maxShareholders,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<ShareholdingDetailsFormData>({
    defaultValues: {
      shareholders:
        initialData.length > 0 ? initialData : [createEmptyShareholder()],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'shareholders',
  });

  function createEmptyShareholder(): Shareholder {
    return {
      name: '',
      shareholdingPercentage: '',
      relationshipWithApplicant: '',
      designation: '',
      comingIntoLoanStructure: '',
      functionalOfPartnerDirector: '',
    };
  }

  const handleAddShareholder = () => {
    if (maxShareholders && fields.length >= maxShareholders) {
      Toast.show({
        type: 'error',
        text1: 'Maximum Limit Reached',
        text2: `Cannot add more than ${maxShareholders} shareholders`,
        position: 'bottom',
      });
      return;
    }
    append(createEmptyShareholder());
  };

  const onFormSubmit = (data: ShareholdingDetailsFormData) => {
    onSubmit(data);
  };

  const renderShareholderFields = (index: number) => {
    return (
      <View key={index} style={styles.shareholderContainer}>
        <View style={styles.shareholderHeader}>
          <Text style={styles.shareholderTitle}>Shareholder {index + 1}</Text>
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
            title: 'Name of Shareholder',
            key: `shareholders.${index}.name`,
            control,
            errors,
            required: true,
            placeholder: 'Enter shareholder name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Percentage of Shareholding',
            key: `shareholders.${index}.shareholdingPercentage`,
            control,
            errors,
            required: true,
            placeholder: 'Enter percentage (0.01 to 100)',
            keyboardType: 'numeric',
            rules: {
              validate: (value: string) => {
                const num = parseFloat(value);
                if (isNaN(num)) return 'Please enter a valid number';
                if (num < 0.01 || num > 100)
                  return 'Percentage must be between 0.01 and 100';
                return true;
              },
            },
          }}
        />

        <SelectFormItem
          data={{
            title: 'Relationship with Applicant',
            key: `shareholders.${index}.relationshipWithApplicant`,
            control,
            errors,
            required: true,
            options: RELATIONSHIP_OPTIONS,
          }}
        />

        <InputFormItem
          data={{
            title: 'Designation',
            key: `shareholders.${index}.designation`,
            control,
            errors,
            required: true,
            placeholder: 'Enter designation',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Coming into Loan Structure',
            key: `shareholders.${index}.comingIntoLoanStructure`,
            control,
            errors,
            required: true,
            options: YES_NO_OPTIONS,
          }}
        />

        <InputFormItem
          data={{
            title: 'Functional of Partner/Director',
            key: `shareholders.${index}.functionalOfPartnerDirector`,
            control,
            errors,
            required: true,
            placeholder: 'Enter functional details',
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {fields.map((field, index) => renderShareholderFields(index))}

      <TouchableOpacity
        style={[
          styles.addButton,
          maxShareholders && fields.length >= maxShareholders
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleAddShareholder}
        disabled={maxShareholders ? fields.length >= maxShareholders : false}>
        <Text
          style={[
            styles.addButtonText,
            maxShareholders && fields.length >= maxShareholders
              ? styles.disabledButtonText
              : null,
          ]}>
          Add Shareholder{' '}
          {maxShareholders ? `(${fields.length}/${maxShareholders})` : ''}
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
  shareholderContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareholderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  shareholderTitle: {
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

export default FinanceDetails;
