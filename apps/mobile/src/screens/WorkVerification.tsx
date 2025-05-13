import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface OfficeVerificationForm {
  applicantName: string;
  bankName: string;
  prospectNumber: string;
  purposeOfLoan: string;
  loanAmount: string;
  tenure: string;
  panNumber: string;
  aadharNumber: string;
  qualification: string;
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
  existingLoans: string;
  references: string;
}

const schema = yup.object().shape({
  applicantName: yup.string().required('Applicant name is required'),
  bankName: yup.string().required('Bank name is required'),
  prospectNumber: yup.string().required('Prospect number is required'),
  purposeOfLoan: yup.string().required('Purpose of loan is required'),
  loanAmount: yup.string().required('Loan amount is required'),
  tenure: yup.string().required('Tenure is required'),
  panNumber: yup
    .string()
    .required('PAN number is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number'),
  aadharNumber: yup
    .string()
    .required('Aadhar number is required')
    .matches(/^[0-9]{12}$/, 'Invalid Aadhar number'),
  qualification: yup.string().required('Qualification is required'),
  currentOfficeName: yup.string().required('Current office name is required'),
  officeAddress: yup.string().required('Office address is required'),
  yearsInCurrentJob: yup.string().required('Years in current job is required'),
  totalWorkExperience: yup
    .string()
    .required('Total work experience is required'),
  companySize: yup.string().required('Company size is required'),
  natureOfService: yup.string().required('Nature of service is required'),
  officeLocality: yup.string().required('Office locality is required'),
  idCardNumber: yup.string().required('ID card number is required'),
  designation: yup.string().required('Designation is required'),
  salaryMode: yup.string().required('Salary mode is required'),
  employerType: yup.string().required('Employer type is required'),
  grossSalary: yup.string().required('Gross salary is required'),
  netSalary: yup.string().required('Net salary is required'),
  previousCompanyName: yup.string(),
  workExperience: yup.string(),
  existingLoans: yup.string(),
  references: yup.string(),
});

const WorkVerification = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<OfficeVerificationForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      applicantName: '',
      bankName: '',
      prospectNumber: '',
      purposeOfLoan: '',
      loanAmount: '',
      tenure: '',
      panNumber: '',
      aadharNumber: '',
      qualification: '',
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
      existingLoans: '',
      references: '',
    },
  });

  const onSubmit = (data: OfficeVerificationForm) => {
    console.log(data);
    Alert.alert('Success', 'Verification submitted successfully');
    // Handle form submission
  };

  const renderInputField = (
    label: string,
    name: keyof OfficeVerificationForm,
    keyboardType: 'default' | 'numeric' | 'email-address' = 'default',
    multiline: boolean = false,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={[
              styles.input,
              multiline && styles.multilineInput,
              errors[name] && styles.inputError,
            ]}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
          />
        )}
      />
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );

  const renderPickerField = (
    label: string,
    name: keyof OfficeVerificationForm,
    options: string[],
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => (
          <View
            style={[styles.pickerContainer, errors[name] && styles.inputError]}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}>
              <Picker.Item label="Select an option" value="" />
              {options.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        )}
      />
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Office Verification</Text>

      {renderInputField('Name of the Applicant', 'applicantName')}
      {renderInputField('Name of the Bank', 'bankName')}
      {renderInputField('Prospect Number', 'prospectNumber')}
      {renderInputField('Purpose of Loan', 'purposeOfLoan')}
      {renderInputField('Loan Amount', 'loanAmount', 'numeric')}
      {renderInputField('Tenure', 'tenure', 'numeric')}
      {renderInputField('PAN Number', 'panNumber')}
      {renderInputField('Aadhar Number', 'aadharNumber', 'numeric')}
      {renderInputField('Qualification', 'qualification')}
      {renderInputField('Current Office Name', 'currentOfficeName')}
      {renderInputField('Office Address', 'officeAddress', 'default', true)}
      {renderInputField('Years in Current Job', 'yearsInCurrentJob', 'numeric')}
      {renderInputField(
        'Total Work Experience',
        'totalWorkExperience',
        'numeric',
      )}
      {renderInputField('Company Size', 'companySize')}
      {renderInputField('Nature of Service/Business', 'natureOfService')}

      {renderPickerField('Office Locality', 'officeLocality', [
        'Residential',
        'Commercial',
        'Industry',
      ])}

      {renderInputField('ID Card Number', 'idCardNumber')}
      {renderInputField('Designation', 'designation')}

      {renderPickerField('Mode of Salary', 'salaryMode', ['Cash', 'Online'])}

      {renderPickerField('Type of Employer', 'employerType', [
        'Government',
        'Private',
      ])}

      {renderInputField('Gross Salary per Month', 'grossSalary', 'numeric')}
      {renderInputField('Net Salary per Month', 'netSalary', 'numeric')}
      {renderInputField('Previous Company Name', 'previousCompanyName')}
      {renderInputField('Work Experience', 'workExperience')}
      {renderInputField('Existing Loans', 'existingLoans', 'default', true)}
      {renderInputField(
        'References (Colleagues)',
        'references',
        'default',
        true,
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: 4,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#1890ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WorkVerification;
