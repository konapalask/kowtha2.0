import React, {useRef, useEffect, useState} from 'react';
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
import {colors} from '../../constants/colors';

// Define the form data type for business basic details
export type BusinessBasicDetailsFormData = {
  applicantName: string;
  personMet: string;
  personMetName?: string;
  personMetRelation?: string;
  businessName: string;
  businessProfile: string;
  businessAddress: string;
  isAddressSame: string;
  addressCorrection?: string;
};

type BusinessBasicDetailsProps = {
  onSubmit: (data: BusinessBasicDetailsFormData) => void;
  initialData?: BusinessBasicDetailsFormData;
};

const personMetOptions = [
  'Applicant',
  'Co-Applicant',
  'Family',
  'Guaranteer',
  'Others',
];
const yesNoOptions = ['Yes', 'No'];

const BusinessBasicDetails: React.FC<BusinessBasicDetailsProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useForm<BusinessBasicDetailsFormData>({
    defaultValues: initialData || {
      applicantName: '',
      businessName: '',
      businessProfile: '',
      personMet: '',
      personMetName: '',
      personMetRelation: '',
      businessAddress: '',
      isAddressSame: '',
      addressCorrection: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const personMetSheetRef = useRef<ActionSheetRef>(null);
  const isAddressSameSheetRef = useRef<ActionSheetRef>(null);

  const watchedPersonMet = watch('personMet');
  const watchedIsAddressSame = watch('isAddressSame');

  return (
    <ScrollView style={styles.container}>
      {/* Name of the Applicant */}
      <Controller
        control={control}
        name="applicantName"
        rules={{required: 'Name of the applicant is required'}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name of the Applicant</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Enter applicant name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
              readOnly
            />
            {errors.applicantName && (
              <Text style={styles.errorText}>
                {errors.applicantName.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Person Met */}
      <Controller
        control={control}
        name="personMet"
        rules={{required: 'Please select who was met'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Person Met</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => personMetSheetRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Person Met'}
              </Text>
            </TouchableOpacity>
            {errors.personMet && (
              <Text style={styles.errorText}>{errors.personMet.message}</Text>
            )}
          </View>
        )}
      />
      {/* If not Applicant, show name field */}
      {watchedPersonMet && watchedPersonMet !== 'Applicant' && (
        <Controller
          control={control}
          name="personMetName"
          rules={{required: 'Please enter the name of the person met'}}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name of Person Met</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter name of person met"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.text.disabled}
              />
              {errors.personMetName && (
                <Text style={styles.errorText}>
                  {errors.personMetName.message}
                </Text>
              )}
            </View>
          )}
        />
      )}
      {/* If Others, show relation field */}
      {watchedPersonMet === 'Others' && (
        <Controller
          control={control}
          name="personMetRelation"
          rules={{required: 'Please specify the relationship to the applicant'}}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Specify Relationship to Applicant
              </Text>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                placeholder="Specify relationship"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.text.disabled}
              />
              {errors.personMetRelation && (
                <Text style={styles.errorText}>
                  {errors.personMetRelation.message}
                </Text>
              )}
            </View>
          )}
        />
      )}

      <Controller
        control={control}
        name="businessName"
        rules={{required: 'Business name is required'}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter business name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
              multiline
              numberOfLines={3}
            />
            {errors.businessAddress && (
              <Text style={styles.errorText}>
                {errors.businessAddress.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="businessProfile"
        rules={{required: 'Required'}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter business profile"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.businessProfile && (
              <Text style={styles.errorText}>
                {errors.businessProfile.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Business Address */}
      <Controller
        control={control}
        name="businessAddress"
        rules={{required: 'Business address is required'}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter business address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
              multiline
              numberOfLines={3}
              readOnly
            />
            {errors.businessAddress && (
              <Text style={styles.errorText}>
                {errors.businessAddress.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Is the address same as initiated? */}
      <Controller
        control={control}
        name="isAddressSame"
        rules={{required: 'Please specify if the address is same as initiated'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Is the address same as initiated?</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => isAddressSameSheetRef.current?.show()}>
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

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      {/* ActionSheets */}
      <ActionSheet ref={personMetSheetRef} containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Person Met</Text>
          {personMetOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('personMet', option);
                if (option === 'Applicant') {
                  setValue('personMetName', '');
                  setValue('personMetRelation', '');
                }
                personMetSheetRef.current?.hide();
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
  readOnlyInput: {
    backgroundColor: colors.input.disabled,
    color: colors.text.primary,
  },
});

export default BusinessBasicDetails;
