import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {colors} from '../../constants/colors';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';

export type ApplicantDetailsFormData = {
  currentResidentialAddress: string;
  assets: string;
  purposeOfLoan: string;
  personMet: string;
  educationalQualification: string;
  incomeDetails: string;
  nameOfCoApplicant?: string; // Non-required field
  maritalStatus: string;
  houseSize: string;
  workExperience: string;
  purchase: string;
  relationshipDuration: string;
};

type ApplicantDetailsProps = {
  formData: any;
  onSubmit: any;
};

const MARITAL_STATUS_OPTIONS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Separated',
];

const EDUCATION_QUALIFICATION_OPTIONS = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'Diploma',
  'Graduate',
  'Post Graduate',
  'Professional Degree',
  'Others',
];

const PERSON_MET_OPTIONS = [
  'Self',
  'Spouse',
  'Parent',
  'Sibling',
  'Relative',
  'Friend',
  'Employee',
  'Others',
];

const RELATIONSHIP_DURATION_OPTIONS = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  'More than 10 years',
];

const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const maritalStatusSheetRef = useRef<ActionSheetRef>(null);
  const educationSheetRef = useRef<ActionSheetRef>(null);
  const personMetSheetRef = useRef<ActionSheetRef>(null);
  const relationshipDurationSheetRef = useRef<ActionSheetRef>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<ApplicantDetailsFormData>({
    defaultValues: formData,
  });

  const handleFormSubmit = (data: ApplicantDetailsFormData) => {
    onSubmit(data);
  };

  const renderSelectField = (
    name: keyof ApplicantDetailsFormData,
    label: string,
    options: string[],
    sheetRef: React.RefObject<ActionSheetRef>,
    isRequired: boolean = true,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} {!isRequired && '(Optional)'}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={{
          required: isRequired ? `${label} is required` : false,
        }}
        render={({field: {onChange, value}}) => (
          <>
            <TouchableOpacity
              style={[styles.selectInput, errors[name] && styles.inputError]}
              onPress={() => sheetRef.current?.show()}>
              <Text style={value ? styles.selectText : styles.placeholderText}>
                {value || `Select ${label.toLowerCase()}`}
              </Text>
            </TouchableOpacity>
            <ActionSheet ref={sheetRef}>
              <View style={styles.actionSheetContainer}>
                {options.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.optionButton}
                    onPress={() => {
                      onChange(option);
                      sheetRef.current?.hide();
                    }}>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ActionSheet>
          </>
        )}
      />
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );

  const renderInputField = (
    name: keyof ApplicantDetailsFormData,
    label: string,
    isRequired: boolean = true,
    isNumeric: boolean = false,
    multiline: boolean = false,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label} {!isRequired && '(Optional)'}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={{
          required: isRequired ? `${label} is required` : false,
          pattern: isNumeric
            ? {
                value: /^\d+$/,
                message: 'Please enter numbers only',
              }
            : undefined,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={[
              styles.input,
              errors[name] && styles.inputError,
              multiline && styles.multilineInput,
            ]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor={colors.text.secondary}
            keyboardType={isNumeric ? 'numeric' : 'default'}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
          />
        )}
      />
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderInputField(
          'currentResidentialAddress',
          'Current Residential Address',
          true,
          false,
          true,
        )}
        {renderInputField('assets', 'Assets', true, false, true)}
        {renderInputField(
          'purposeOfLoan',
          'Purpose of Loan',
          true,
          false,
          true,
        )}

        {renderSelectField(
          'personMet',
          'Person Met',
          PERSON_MET_OPTIONS,
          personMetSheetRef,
        )}

        {renderSelectField(
          'educationalQualification',
          'Educational Qualification',
          EDUCATION_QUALIFICATION_OPTIONS,
          educationSheetRef,
        )}

        {renderInputField('incomeDetails', 'Income Details', true, false, true)}

        {renderInputField(
          'nameOfCoApplicant',
          'Name of Co-applicant',
          false, // Not required
        )}

        {renderSelectField(
          'maritalStatus',
          'Marital Status',
          MARITAL_STATUS_OPTIONS,
          maritalStatusSheetRef,
        )}

        {renderInputField('houseSize', 'House Size')}
        {renderInputField(
          'workExperience',
          'Work Experience (years)',
          true,
          true,
        )}
        {renderInputField('purchase', 'Purchase', true, true)}

        {renderSelectField(
          'relationshipDuration',
          'Relationship Duration',
          RELATIONSHIP_DURATION_OPTIONS,
          relationshipDurationSheetRef,
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSubmit(handleFormSubmit)}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  selectInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  selectText: {
    color: colors.text.primary,
  },
  placeholderText: {
    color: colors.text.secondary,
  },
  actionSheetContainer: {
    padding: 16,
  },
  optionButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplicantDetails;
