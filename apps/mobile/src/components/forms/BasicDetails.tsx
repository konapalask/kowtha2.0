import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {BasicDetailsFormData} from '../../types/verification';
import {colors} from '../../constants/colors';

type BasicDetailsProps = {
  onSubmit: (data: BasicDetailsFormData) => void;
  initialData?: BasicDetailsFormData;
};

const BasicDetails: React.FC<BasicDetailsProps> = ({onSubmit, initialData}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useForm<BasicDetailsFormData>({
    defaultValues: initialData || {
      verificationType: '',
      applicationNumber: '',
      applicantName: '',
      applicantMaritalStatus: '',
      applicantMaritalStatusOther: '',
      educationQualification: '',
      category: '',
      categoryOther: '',
    },
  });

  // Add useEffect to update form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const maritalStatusSheetRef = useRef<ActionSheetRef>(null);
  const educationQualificationSheetRef = useRef<ActionSheetRef>(null);
  const categorySheetRef = useRef<ActionSheetRef>(null);

  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Others'];
  const educationQualificationOptions = [
    'Below 10th',
    '10th pass',
    '12th pass',
    'Diploma/ITI certification',
    'Graduate',
    'PG/Professional Certification',
  ];
  const categoryOptions = ['General', 'SC', 'ST', 'OBC', 'Others'];

  const watchedMaritalStatus = watch('applicantMaritalStatus');
  const watchedCategory = watch('category');

  return (
    <ScrollView style={styles.container}>
      {/* Verification Type (Read-only) */}
      <Controller
        control={control}
        name="verificationType"
        rules={{required: 'Verification type is required'}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Verification Type</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Enter Verification Type"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={false}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.verificationType && (
              <Text style={styles.errorText}>
                {errors.verificationType.message}
              </Text>
            )}
          </View>
        )}
      />
      {/* Application Number */}
      <Controller
        control={control}
        name="applicationNumber"
        rules={{required: 'Application number is required'}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Application Number</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Enter Application Number"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={false}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.applicationNumber && (
              <Text style={styles.errorText}>
                {errors.applicationNumber.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Applicant Name */}
      <Controller
        control={control}
        name="applicantName"
        rules={{required: 'Applicant name is required'}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Applicant Name</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Enter Applicant Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={false}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.applicantName && (
              <Text style={styles.errorText}>
                {errors.applicantName.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Applicant Marital Status */}
      <Controller
        control={control}
        name="applicantMaritalStatus"
        rules={{required: 'Marital status is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Applicant Marital Status</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => maritalStatusSheetRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Marital Status'}
              </Text>
            </TouchableOpacity>
            {errors.applicantMaritalStatus && (
              <Text style={styles.errorText}>
                {errors.applicantMaritalStatus.message}
              </Text>
            )}
          </View>
        )}
      />
      {watchedMaritalStatus === 'Others' && (
        <Controller
          control={control}
          name="applicantMaritalStatusOther"
          rules={{required: 'Please specify marital status'}}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specify Marital Status</Text>
              <TextInput
                style={styles.input}
                placeholder="Specify Marital Status"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.applicantMaritalStatusOther && (
                <Text style={styles.errorText}>
                  {errors.applicantMaritalStatusOther.message}
                </Text>
              )}
            </View>
          )}
        />
      )}

      {/* Education Qualification */}
      <Controller
        control={control}
        name="educationQualification"
        rules={{required: 'Education qualification is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Education Qualification</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => educationQualificationSheetRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Education Qualification'}
              </Text>
            </TouchableOpacity>
            {errors.educationQualification && (
              <Text style={styles.errorText}>
                {errors.educationQualification.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Category */}
      <Controller
        control={control}
        name="category"
        rules={{required: 'Category is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => categorySheetRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Category'}
              </Text>
            </TouchableOpacity>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category.message}</Text>
            )}
          </View>
        )}
      />
      {watchedCategory === 'Others' && (
        <Controller
          control={control}
          name="categoryOther"
          rules={{required: 'Please specify category'}}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specify Category</Text>
              <TextInput
                style={styles.input}
                placeholder="Specify Category"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.categoryOther && (
                <Text style={styles.errorText}>
                  {errors.categoryOther.message}
                </Text>
              )}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      {/* ActionSheets */}
      <ActionSheet
        ref={maritalStatusSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Marital Status</Text>
          {maritalStatusOptions.map(status => (
            <TouchableOpacity
              key={status}
              style={styles.actionSheetItem}
              onPress={() => {
                setValue('applicantMaritalStatus', status);
                if (status !== 'Others') {
                  setValue('applicantMaritalStatusOther', ''); // Clear other field
                }
                maritalStatusSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={educationQualificationSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>
            Select Education Qualification
          </Text>
          {educationQualificationOptions.map(qualification => (
            <TouchableOpacity
              key={qualification}
              style={styles.actionSheetItem}
              onPress={() => {
                setValue('educationQualification', qualification);
                educationQualificationSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{qualification}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet ref={categorySheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Category</Text>
          {categoryOptions.map(cat => (
            <TouchableOpacity
              key={cat}
              style={styles.actionSheetItem}
              onPress={() => {
                setValue('category', cat);
                if (cat !== 'Others') {
                  setValue('categoryOther', ''); // Clear other field
                }
                categorySheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{cat}</Text>
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
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.input.background,
    color: colors.input.text,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.input.background,
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholder: {
    fontSize: 16,
    color: colors.text.disabled,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    borderColor: colors.button.primary.background,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    height: 40,
  },
  submitButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
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
  readOnlyField: {
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.input.disabled,
  },
  readOnlyText: {
    fontSize: 16,
    color: colors.text.disabled,
  },
  readOnlyInput: {
    backgroundColor: colors.input.disabled,
    color: colors.text.primary,
  },
});

export default BasicDetails;
