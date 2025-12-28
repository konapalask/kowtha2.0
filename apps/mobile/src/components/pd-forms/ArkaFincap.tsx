import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {colors} from '../../constants/colors';
import {InputFormItem} from '../../lib/InputFormItem';
import {SelectFormItem} from '../../lib/SelectFormItem';
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';

interface ArkaFincapBasicDetailsFormData {
  applicationNumber: string;
  applicantName: string;
  coApplicantName: string;
  phoneNo: string;
  nameOfConcern: string;
  initiatedAddress: string;
  visitedAddress: string;
  residentialDetails: string;
  dateOfVisit: string;
  personMet: string;
  nameOfPersonMet: string;
  loanAmount: string;
  purposeOfLoan: string;
  typeofCollateral: string;
  collateralDetails: string;
  aboutApplicant: string;
}

interface ArkaFincapBasicDetailsProps {
  onSubmit: (data: ArkaFincapBasicDetailsFormData) => void;
  initialData?: ArkaFincapBasicDetailsFormData;
}

const YES_NO_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
];

const STRUCTURE_OF_LOAN_OPTIONS = [
  {id: 'term_loan', name: 'Term Loan'},
  {id: 'working_capital', name: 'Working Capital'},
  {id: 'overdraft', name: 'Overdraft'},
  {id: 'cash_credit', name: 'Cash Credit'},
  {id: 'letter_of_credit', name: 'Letter of Credit'},
  {id: 'bank_guarantee', name: 'Bank Guarantee'},
  {id: 'other', name: 'Other'},
];

const PERSON_MET_OPTIONS = [
  {id: 'applicant', name: 'Applicant'},
  {id: 'co_applicant', name: 'Co-applicant'},
  {id: 'partner', name: 'Partner'},
  {id: 'director', name: 'Director'},
  {id: 'manager', name: 'Manager'},
  {id: 'other', name: 'Other'},
];

const ArkaFincapBasicDetails: React.FC<ArkaFincapBasicDetailsProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<ArkaFincapBasicDetailsFormData>({
    defaultValues: initialData || {
      applicantName: '',
      nameOfConcern: '',
      initiatedAddress: '',
      visitedAddress: '',
      phoneNo: '',
      dateOfVisit: '',
      personMet: '',
      nameOfPersonMet: '',
      loanAmount: '',
      purposeOfLoan: '',
      aboutApplicant: '',
      residentialDetails: '',
      typeofCollateral: '',
      collateralDetails: '',
    },
  });

  const personMet = watch('personMet');

  const onFormSubmit = (data: ArkaFincapBasicDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Basic Information</Text>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Applicant Name *</Text>
        <Text style={styles.readonlyText}>{initialData?.applicantName}</Text>
      </View>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Name of Concern *</Text>
        <Text style={styles.readonlyText}>{initialData?.nameOfConcern}</Text>
      </View>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Initiated Address *</Text>
        <Text style={styles.readonlyText}>{initialData?.initiatedAddress}</Text>
      </View>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Phone No *</Text>
        <Text style={styles.readonlyText}>{initialData?.phoneNo}</Text>
      </View>

      <TextAreaFormItem
        data={{
          title: 'Visited Address',
          key: 'visitedAddress',
          control,
          errors,
          required: true,
          placeholder: 'Enter visited address',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Date of Visit',
          key: 'dateOfVisit',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Loan Amount',
          key: 'loanAmount',
          control,
          errors,
          required: true,
          options: STRUCTURE_OF_LOAN_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'Purpose of Loan',
          key: 'purposeOfLoan',
          control,
          errors,
          required: true,
          placeholder: 'Enter purpose of loan',
        }}
      />

      <InputFormItem
        data={{
          title: 'Type of Collateral',
          key: 'typeofCollateral',
          control,
          errors,
          required: true,
          placeholder: 'Enter type of collateral',
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
            title: 'Name of the person met',
            key: 'nameOfPersonMet',
            control,
            errors,
            required: true,
            placeholder: 'Enter name of person met',
          }}
        />
      )}

      <TextAreaFormItem
        data={{
          title: 'About Applicant',
          key: 'aboutApplicant',
          control,
          errors,
          required: true,
          placeholder: 'Enter details about the applicant',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Residential Details',
          key: 'residentialDetails',
          control,
          errors,
          required: true,
          placeholder: 'Enter residential details',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Collateral Details',
          key: 'collateralDetails',
          control,
          errors,
          required: false,
          placeholder: 'Enter collateral details',
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

export default ArkaFincapBasicDetails;
