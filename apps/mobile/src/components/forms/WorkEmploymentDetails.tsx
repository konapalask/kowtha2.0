import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {colors} from '../../constants/colors';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

interface WorkEmploymentDetailsFormData {
  currentOfficeName: string;
  officeAddress: string;
  yearsInCurrentJob: string;
  totalWorkExperience: string;
  companySize: string;
  natureOfService: string;
  officeLocality: string;
  idCardNumber: string;
  designation: string;
  salaryMode: string;
  employerType: string;
  grossSalary: string;
  netSalary: string;
  previousCompanyName: string;
  workExperience: string;
}

interface Props {
  initialData?: Partial<WorkEmploymentDetailsFormData>;
  onSubmit: (data: WorkEmploymentDetailsFormData) => void;
}

const validationSchema = yup.object().shape({
  currentOfficeName: yup.string().required('Current Office Name is required'),
  officeAddress: yup.string().required('Office Address is required'),
  yearsInCurrentJob: yup.string().required('Years in Current Job is required'),
  totalWorkExperience: yup
    .string()
    .required('Total Work Experience is required'),
  companySize: yup.string().required('Company Size is required'),
  natureOfService: yup.string().required('Nature of Service is required'),
  officeLocality: yup.string().required('Office Locality is required'),
  idCardNumber: yup.string().required('ID Card Number is required'),
  designation: yup.string().required('Designation is required'),
  salaryMode: yup.string().required('Salary Mode is required'),
  employerType: yup.string().required('Employer Type is required'),
  grossSalary: yup.string().required('Gross Salary is required'),
  netSalary: yup.string().required('Net Salary is required'),
  previousCompanyName: yup
    .string()
    .required('Previous Company Name is required'),
  workExperience: yup.string().required('Work Experience is required'),
});

const WorkEmploymentDetails: React.FC<Props> = ({initialData, onSubmit}) => {
  const officeLocalitySheetRef = useRef<ActionSheetRef>(null);
  const salaryModeSheetRef = useRef<ActionSheetRef>(null);
  const employerTypeSheetRef = useRef<ActionSheetRef>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<WorkEmploymentDetailsFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData || {
      currentOfficeName: '',
      officeAddress: '',
      yearsInCurrentJob: '',
      totalWorkExperience: '',
      companySize: '',
      natureOfService: '',
      officeLocality: '',
      idCardNumber: '',
      designation: '',
      salaryMode: '',
      employerType: '',
      grossSalary: '',
      netSalary: '',
      previousCompanyName: '',
      workExperience: '',
    },
  });

  const officeLocalityOptions = ['Residential', 'Commercial', 'Industry'];
  const salaryModeOptions = ['Cash', 'Online'];
  const employerTypeOptions = ['Government', 'Private'];

  const showOfficeLocalitySheet = () => {
    officeLocalitySheetRef.current?.show();
  };

  const showSalaryModeSheet = () => {
    salaryModeSheetRef.current?.show();
  };

  const showEmployerTypeSheet = () => {
    employerTypeSheetRef.current?.show();
  };

  const onFormSubmit = (data: WorkEmploymentDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Controller
        control={control}
        name="currentOfficeName"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Office Name</Text>
            <TextInput
              style={[
                styles.input,
                errors.currentOfficeName && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
            />
            {errors.currentOfficeName && (
              <Text style={styles.errorText}>
                {errors.currentOfficeName.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="officeAddress"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Office Address</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.officeAddress && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
            />
            {errors.officeAddress && (
              <Text style={styles.errorText}>
                {errors.officeAddress.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="yearsInCurrentJob"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Years in Current Job</Text>
            <TextInput
              style={[
                styles.input,
                errors.yearsInCurrentJob && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
            {errors.yearsInCurrentJob && (
              <Text style={styles.errorText}>
                {errors.yearsInCurrentJob.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="totalWorkExperience"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Total Work Experience</Text>
            <TextInput
              style={[
                styles.input,
                errors.totalWorkExperience && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
            {errors.totalWorkExperience && (
              <Text style={styles.errorText}>
                {errors.totalWorkExperience.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="companySize"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Company Size</Text>
            <TextInput
              style={[styles.input, errors.companySize && styles.inputError]}
              value={value}
              onChangeText={onChange}
            />
            {errors.companySize && (
              <Text style={styles.errorText}>{errors.companySize.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="natureOfService"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nature of Service/Business</Text>
            <TextInput
              style={[
                styles.input,
                errors.natureOfService && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
            />
            {errors.natureOfService && (
              <Text style={styles.errorText}>
                {errors.natureOfService.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="officeLocality"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Office Locality</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                errors.officeLocality && styles.inputError,
              ]}
              onPress={showOfficeLocalitySheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Office Locality'}
              </Text>
            </TouchableOpacity>
            {errors.officeLocality && (
              <Text style={styles.errorText}>
                {errors.officeLocality.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="idCardNumber"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID Card Number</Text>
            <TextInput
              style={[styles.input, errors.idCardNumber && styles.inputError]}
              value={value}
              onChangeText={onChange}
            />
            {errors.idCardNumber && (
              <Text style={styles.errorText}>
                {errors.idCardNumber.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="designation"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Designation</Text>
            <TextInput
              style={[styles.input, errors.designation && styles.inputError]}
              value={value}
              onChangeText={onChange}
            />
            {errors.designation && (
              <Text style={styles.errorText}>{errors.designation.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="salaryMode"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mode of Salary</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                errors.salaryMode && styles.inputError,
              ]}
              onPress={showSalaryModeSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Salary Mode'}
              </Text>
            </TouchableOpacity>
            {errors.salaryMode && (
              <Text style={styles.errorText}>{errors.salaryMode.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="employerType"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Type of Employer</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                errors.employerType && styles.inputError,
              ]}
              onPress={showEmployerTypeSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Employer Type'}
              </Text>
            </TouchableOpacity>
            {errors.employerType && (
              <Text style={styles.errorText}>
                {errors.employerType.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="grossSalary"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gross Salary per Month</Text>
            <TextInput
              style={[styles.input, errors.grossSalary && styles.inputError]}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
            {errors.grossSalary && (
              <Text style={styles.errorText}>{errors.grossSalary.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="netSalary"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Net Salary per Month</Text>
            <TextInput
              style={[styles.input, errors.netSalary && styles.inputError]}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
            {errors.netSalary && (
              <Text style={styles.errorText}>{errors.netSalary.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="previousCompanyName"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Previous Company Name</Text>
            <TextInput
              style={[
                styles.input,
                errors.previousCompanyName && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
            />
            {errors.previousCompanyName && (
              <Text style={styles.errorText}>
                {errors.previousCompanyName.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="workExperience"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Work Experience</Text>
            <TextInput
              style={[styles.input, errors.workExperience && styles.inputError]}
              value={value}
              onChangeText={onChange}
            />
            {errors.workExperience && (
              <Text style={styles.errorText}>
                {errors.workExperience.message}
              </Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onFormSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      <ActionSheet
        ref={officeLocalitySheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Office Locality</Text>
          {officeLocalityOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('officeLocality', option);
                officeLocalitySheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet ref={salaryModeSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Salary Mode</Text>
          {salaryModeOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('salaryMode', option);
                salaryModeSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={employerTypeSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Employer Type</Text>
          {employerTypeOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('employerType', option);
                employerTypeSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text.primary,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 100,
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
  selectButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.background,
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholder: {
    fontSize: 16,
    color: colors.text.disabled,
  },
  actionSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  actionSheetContent: {
    padding: 16,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text.primary,
  },
  actionSheetItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionSheetItemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  submitButton: {
    borderColor: colors.button.primary.background,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  submitButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkEmploymentDetails;
