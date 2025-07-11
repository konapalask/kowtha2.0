import React, {useRef, useState} from 'react';
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
  isAddressSame: string;
  addressCorrection: string;
  yearsInCurrentJob: string;
  totalWorkExperience: string;
  companySize: string;
  natureOfService: string;
  natureOfServiceOther?: string;
  officeLocality: string;
  idCardNumber: string;
  designation: string;
  salaryMode: string;
  employerType: string;
  employerTypeOther?: string;
  grossSalary: string;
  netSalary: string;
}

interface Props {
  initialData?: Partial<WorkEmploymentDetailsFormData>;
  onSubmit: (data: WorkEmploymentDetailsFormData) => void;
}

const yesNoOptions = ['Yes', 'No'];

const validationSchema = yup.object().shape({
  currentOfficeName: yup.string().required('Current Office Name is required'),
  officeAddress: yup.string().required('Office Address is required'),
  isAddressSame: yup.string().required(`Is address same is required`),
  addressCorrection: yup.string(),
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
});

const WorkEmploymentDetails: React.FC<Props> = ({initialData, onSubmit}) => {
  const officeLocalitySheetRef = useRef<ActionSheetRef>(null);
  const salaryModeSheetRef = useRef<ActionSheetRef>(null);
  const employerTypeSheetRef = useRef<ActionSheetRef>(null);
  const natureOfServiceSheetRef = useRef<ActionSheetRef>(null);
  const isAddressSameSheetRef = useRef<ActionSheetRef>(null);

  // const [showEmployerTypeOther, setShowEmployerTypeOther] = useState(false);
  // const [showNatureOfServiceOther, setShowNatureOfServiceOther] =
  //   useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<WorkEmploymentDetailsFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData || {
      currentOfficeName: '',
      officeAddress: '',
      isAddressSame: '',
      addressCorrection: '',
      yearsInCurrentJob: '',
      totalWorkExperience: '',
      companySize: '',
      natureOfService: '',
      natureOfServiceOther: '',
      officeLocality: '',
      idCardNumber: '',
      designation: '',
      salaryMode: '',
      employerType: '',
      employerTypeOther: '',
      grossSalary: '',
      netSalary: '',
    },
  });

  const employerType = watch('employerType');
  const natureOfService = watch('natureOfService');

  const officeLocalityOptions = ['Residential', 'Commercial', 'Industry'];
  const salaryModeOptions = ['Cash', 'Online', 'Cheque', 'Mixed'];
  const employerTypeOptions = [
    'Government/PSU',
    'Unlisted Pvt. Ltd',
    'MNC/Listed Pvt. Ltd',
    'Proprietorship/Partnership/NGO/Trust',
    'Others',
  ];

  const natureOfServiceOptions = [
    'Agricultural',
    'Construction',
    'Education',
    'FMCG',
    'Health Care',
    'Manufacturing',
    'Services',
    'Travel & Tourism & Hotel',
    'E-Commerce',
    'Others',
  ];

  const showOfficeLocalitySheet = () => {
    officeLocalitySheetRef.current?.show();
  };

  const showSalaryModeSheet = () => {
    salaryModeSheetRef.current?.show();
  };

  const showEmployerTypeSheet = () => {
    employerTypeSheetRef.current?.show();
  };

  const showNatureOfServiceSheet = () => {
    natureOfServiceSheetRef.current?.show();
  };

  const showIsAddressSameSheet = () => {
    isAddressSameSheetRef.current?.show();
  };

  const onFormSubmit = (data: WorkEmploymentDetailsFormData) => {
    onSubmit(data);
  };

  const watchedIsAddressSame = watch('isAddressSame');

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
              placeholder="Enter office name"
              placeholderTextColor={colors.text.disabled}
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
              style={[styles.input, styles.textArea, styles.readOnlyInput]}
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              readOnly
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
        name="isAddressSame"
        rules={{required: 'Please specify if the address is same as initiated'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Is the address same as initiated?</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showIsAddressSameSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Yes/No'}
              </Text>
            </TouchableOpacity>
            {errors.isAddressSame && (
              <Text style={styles.errorText}>
                {errors.isAddressSame.message}
              </Text>
            )}
          </View>
        )}
      />
      {/* Address Correction if No */}
      {watchedIsAddressSame === 'No' && (
        <Controller
          control={control}
          name="addressCorrection"
          rules={{required: 'Please provide the corrected address'}}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address Correction</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter corrected address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.text.disabled}
                multiline
                numberOfLines={3}
              />
              {errors.addressCorrection && (
                <Text style={styles.errorText}>
                  {errors.addressCorrection.message}
                </Text>
              )}
            </View>
          )}
        />
      )}

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
                {color: colors.text.primary},
              ]}
              value={value}
              onChangeText={text => {
                if (/^\d*\.?\d{0,1}$/.test(text)) {
                  onChange(text);
                }
              }}
              keyboardType="decimal-pad"
              placeholder="Enter years in current job"
              placeholderTextColor={colors.text.disabled}
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
                {color: colors.text.primary},
              ]}
              value={value}
              onChangeText={text => {
                if (/^\d*\.?\d{0,1}$/.test(text)) {
                  onChange(text);
                }
              }}
              keyboardType="decimal-pad"
              placeholder="Enter total work experience"
              placeholderTextColor={colors.text.disabled}
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
              style={[
                styles.input,
                errors.companySize && styles.inputError,
                {color: colors.text.primary},
              ]}
              value={value}
              onChangeText={text => {
                if (/^\d*$/.test(text)) {
                  onChange(text);
                }
              }}
              keyboardType="numeric"
              placeholder="Enter company size"
              placeholderTextColor={colors.text.disabled}
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
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nature of Service/Business</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                errors.natureOfService && styles.inputError,
              ]}
              onPress={showNatureOfServiceSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select nature of service'}
              </Text>
            </TouchableOpacity>
            {errors.natureOfService && (
              <Text style={styles.errorText}>
                {errors.natureOfService.message}
              </Text>
            )}
          </View>
        )}
      />

      {natureOfService === 'Others' && (
        <Controller
          control={control}
          name="natureOfServiceOther"
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specify Nature of Service</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.natureOfServiceOther && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
              />
              {errors.natureOfServiceOther && (
                <Text style={styles.errorText}>
                  {errors.natureOfServiceOther.message}
                </Text>
              )}
            </View>
          )}
        />
      )}

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
                {value || 'Select office locality'}
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
              style={[
                styles.input,
                errors.idCardNumber && styles.inputError,
                {color: colors.text.primary},
              ]}
              value={value}
              onChangeText={text => {
                if (/^[A-Za-z0-9]*$/.test(text)) {
                  onChange(text.toUpperCase());
                }
              }}
              placeholder="Enter ID card number"
              autoCapitalize="characters"
              placeholderTextColor={colors.text.disabled}
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
              placeholder="Enter designation"
              placeholderTextColor={colors.text.disabled}
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
                {value || 'Select salary mode'}
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
        render={({field: {value}}) => (
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
                {value || 'Select employer type'}
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

      {employerType === 'Others' && (
        <Controller
          control={control}
          name="employerTypeOther"
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specify Employer Type</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.employerTypeOther && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
              />
              {errors.employerTypeOther && (
                <Text style={styles.errorText}>
                  {errors.employerTypeOther.message}
                </Text>
              )}
            </View>
          )}
        />
      )}

      <Controller
        control={control}
        name="grossSalary"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gross Salary per Month</Text>
            <TextInput
              style={[
                styles.input,
                errors.grossSalary && styles.inputError,
                {color: colors.text.primary},
              ]}
              value={value}
              onChangeText={text => {
                if (/^\d*$/.test(text)) {
                  onChange(text);
                }
              }}
              keyboardType="numeric"
              placeholder="Enter gross salary"
              placeholderTextColor={colors.text.disabled}
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
              style={[
                styles.input,
                errors.netSalary && styles.inputError,
                {color: colors.text.primary},
              ]}
              value={value}
              onChangeText={text => {
                if (/^\d*$/.test(text)) {
                  onChange(text);
                }
              }}
              keyboardType="numeric"
              placeholder="Enter net salary"
              placeholderTextColor={colors.text.disabled}
            />
            {errors.netSalary && (
              <Text style={styles.errorText}>{errors.netSalary.message}</Text>
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
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
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
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
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
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
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

      <ActionSheet
        ref={natureOfServiceSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Nature of Service</Text>
          {natureOfServiceOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('natureOfService', option);
                natureOfServiceSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={isAddressSameSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>
            Is the address same as initiated?
          </Text>
          {yesNoOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('isAddressSame', option);
                if (option === 'Yes') {
                  setValue('addressCorrection', '');
                }
                isAddressSameSheetRef.current?.hide();
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
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 40,
  },
  submitButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  readOnlyInput: {
    backgroundColor: colors.input.disabled,
    color: colors.text.primary,
  },
});

export default WorkEmploymentDetails;
