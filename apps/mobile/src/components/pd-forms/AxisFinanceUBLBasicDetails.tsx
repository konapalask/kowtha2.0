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

interface AxisFinanceUBLBasicDetailsFormData {
  applicantName: string;
  nameOfConcern: string;
  constitution: string;
  initiatedAddress: string;
  visitedAddress: string;
  phoneNo: string;
  appointmentFixed: string;
  structureOfLoan: string;
  noOfVisit: string;
  personMet: string;
  nameOfPersonMet: string;
  aboutApplicant: string;
  residentialDetails: string;
  coApplicantDetails: string;
}

interface AxisFinanceUBLBasicDetailsProps {
  onSubmit: (data: AxisFinanceUBLBasicDetailsFormData) => void;
  initialData?: AxisFinanceUBLBasicDetailsFormData;
}

const CONSTITUTION_OPTIONS = [
  {id: 'sole_proprietorship', name: 'Sole Proprietorship'},
  {id: 'partnership', name: 'Partnership'},
  {id: 'private_limited', name: 'Private Limited'},
  {id: 'public_limited', name: 'Public Limited'},
  {id: 'llp', name: 'Limited Liability Partnership'},
  {id: 'huf', name: 'Hindu Undivided Family'},
  {id: 'other', name: 'Other'},
];

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

const AxisFinanceUBLBasicDetails: React.FC<AxisFinanceUBLBasicDetailsProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<AxisFinanceUBLBasicDetailsFormData>({
    defaultValues: initialData || {
      applicantName: '',
      nameOfConcern: '',
      constitution: '',
      initiatedAddress: '',
      visitedAddress: '',
      phoneNo: '',
      appointmentFixed: '',
      structureOfLoan: '',
      noOfVisit: '',
      personMet: '',
      nameOfPersonMet: '',
      aboutApplicant: '',
      residentialDetails: '',
      coApplicantDetails: '',
    },
  });

  const personMet = watch('personMet');

  const onFormSubmit = (data: AxisFinanceUBLBasicDetailsFormData) => {
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

      <SelectFormItem
        data={{
          title: 'Constitution',
          key: 'constitution',
          control,
          errors,
          required: true,
          options: CONSTITUTION_OPTIONS,
        }}
      />

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Initiated Address *</Text>
        <Text style={styles.readonlyText}>{initialData?.initiatedAddress}</Text>
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

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Phone No *</Text>
        <Text style={styles.readonlyText}>{initialData?.phoneNo}</Text>
      </View>

      <SelectFormItem
        data={{
          title: 'Appointment Fixed',
          key: 'appointmentFixed',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'Structure of Loan',
          key: 'structureOfLoan',
          control,
          errors,
          required: true,
          options: STRUCTURE_OF_LOAN_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'No of Visit',
          key: 'noOfVisit',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of visits',
          keyboardType: 'numeric',
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
          title: 'Co-applicant Details',
          key: 'coApplicantDetails',
          control,
          errors,
          required: false,
          placeholder: 'Enter co-applicant details',
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

export default AxisFinanceUBLBasicDetails;
