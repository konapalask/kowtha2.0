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
  isBusinessNameSame: string;
  correctedBusinessName: string;
  aadhar: string;
  panNumber: string;
  isApplicantAvailable: string;
  availablePersonName: string;
  availablePersonMobile: string;
  availablePersonRelation: string;
  availablePersonRelationOther: string;
};

type BusinessBasicDetailsProps = {
  onSubmit: (data: BusinessBasicDetailsFormData) => void;
  initialData?: BusinessBasicDetailsFormData;
};

const personMetOptions = [
  'Applicant',
  'Co-Applicant',
  'Family',
  'Guarantor',
  'Others',
];
const yesNoOptions = ['Yes', 'No'];
const relationOptions = ['Co Applicant', 'Family', 'Colleague', 'Others'];

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
      isBusinessNameSame: '',
      correctedBusinessName: '',
      aadhar: '',
      panNumber: '',
      isApplicantAvailable: '',
      availablePersonName: '',
      availablePersonMobile: '',
      availablePersonRelation: '',
      availablePersonRelationOther: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const personMetSheetRef = useRef<ActionSheetRef>(null);
  const isAddressSameSheetRef = useRef<ActionSheetRef>(null);
  const isBusinessNameRef = useRef<ActionSheetRef>(null);
  const isApplicantAvailableSheetRef = useRef<ActionSheetRef>(null);
  const relationSheetRef = useRef<ActionSheetRef>(null);

  const watchedPersonMet = watch('personMet');
  const watchedIsAddressSame = watch('isAddressSame');
  const watchedIsBusinessNameSame = watch('isBusinessNameSame');
  const watchedIsApplicantAvailable = watch('isApplicantAvailable');
  const watchedAvailablePersonRelation = watch('availablePersonRelation');

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

      <Controller
        control={control}
        name="panNumber"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>PAN Number</Text>
            <TextInput
              style={[styles.input, {color: colors.text.primary}]}
              value={value}
              onChangeText={text => {
                // Convert to uppercase and remove any non-alphanumeric characters
                const formattedText = text
                  .replace(/[^A-Za-z0-9]/g, '')
                  .toUpperCase();
                onChange(formattedText);
              }}
              maxLength={10}
              placeholder="Enter PAN number"
              placeholderTextColor={colors.text.disabled}
            />
            {errors.panNumber && (
              <Text style={styles.errorText}>{errors.panNumber.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="aadhar"
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Aadhar Number</Text>
            <TextInput
              style={[styles.input]}
              value={value}
              onChangeText={text => {
                // Only pass numeric values to onChange
                if (/^\d*$/.test(text)) {
                  onChange(text);
                }
              }}
              maxLength={12}
              keyboardType="numeric"
              placeholder="Enter Aadhar"
              placeholderTextColor={colors.text.disabled}
            />
            {errors.aadhar && (
              <Text style={styles.errorText}>{errors.aadhar.message}</Text>
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
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Enter business name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
              multiline
              numberOfLines={3}
              readOnly
            />
            {errors.businessName && (
              <Text style={styles.errorText}>
                {errors.businessName.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="isBusinessNameSame"
        rules={{
          required: 'Please specify if business name is same as initiated',
        }}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Is business name same as initiated?
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => isBusinessNameRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Yes/No'}
              </Text>
            </TouchableOpacity>
            {errors.isBusinessNameSame && (
              <Text style={styles.errorText}>
                {errors.isBusinessNameSame.message}
              </Text>
            )}
          </View>
        )}
      />
      {/* Address Correction if No */}
      {watchedIsBusinessNameSame === 'No' && (
        <Controller
          control={control}
          name="correctedBusinessName"
          rules={{required: 'Please provide the corrected business name'}}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Business Name Correction</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter corrected business name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.text.disabled}
                multiline
                numberOfLines={2}
              />
              {errors.correctedBusinessName && (
                <Text style={styles.errorText}>
                  {errors.correctedBusinessName.message}
                </Text>
              )}
            </View>
          )}
        />
      )}

      <Controller
        control={control}
        name="businessProfile"
        rules={{required: 'Required'}}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nature of Business</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter nature of business"
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
              style={[styles.input, styles.readOnlyInput]}
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

      {/* Is Applicant Available */}
      <Controller
        control={control}
        name="isApplicantAvailable"
        rules={{required: 'Please specify if applicant is available'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Is the applicant available at the time of verification?
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => isApplicantAvailableSheetRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Availability'}
              </Text>
            </TouchableOpacity>
            {errors.isApplicantAvailable && (
              <Text style={styles.errorText}>
                {errors.isApplicantAvailable.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Available Person Name - Only show if applicant is not available */}
      {watchedIsApplicantAvailable === 'No' && (
        <>
          <Controller
            control={control}
            name="availablePersonName"
            rules={{required: 'Name of available person is required'}}
            render={({field: {onChange, onBlur, value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name of Person Available</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name of person available"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.availablePersonName && (
                  <Text style={styles.errorText}>
                    {errors.availablePersonName.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="availablePersonMobile"
            rules={{required: 'Mobile number is required'}}
            render={({field: {onChange, onBlur, value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Mobile Number of Person Available
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.availablePersonMobile && (
                  <Text style={styles.errorText}>
                    {errors.availablePersonMobile.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="availablePersonRelation"
            rules={{required: 'Relation is required'}}
            render={({field: {value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Relation to Applicant</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => relationSheetRef.current?.show()}>
                  <Text
                    style={
                      value ? styles.selectButtonText : styles.placeholder
                    }>
                    {value || 'Select Relation'}
                  </Text>
                </TouchableOpacity>
                {errors.availablePersonRelation && (
                  <Text style={styles.errorText}>
                    {errors.availablePersonRelation.message}
                  </Text>
                )}
              </View>
            )}
          />
          {watchedAvailablePersonRelation === 'Others' && (
            <Controller
              control={control}
              name="availablePersonRelationOther"
              rules={{required: 'Please specify relation'}}
              render={({field: {onChange, onBlur, value}}) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Specify Relation</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Specify relation"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.availablePersonRelationOther && (
                    <Text style={styles.errorText}>
                      {errors.availablePersonRelationOther.message}
                    </Text>
                  )}
                </View>
              )}
            />
          )}
        </>
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
      <ActionSheet ref={isBusinessNameRef} containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>
            Is the business name same as initiated?
          </Text>
          {yesNoOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('isBusinessNameSame', option);
                if (option === 'Yes') {
                  setValue('correctedBusinessName', '');
                }
                isBusinessNameRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>
      <ActionSheet
        ref={isApplicantAvailableSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Is Applicant Available?</Text>
          {yesNoOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('isApplicantAvailable', option);
                if (option === 'Yes') {
                  setValue('availablePersonName', ''); // Clear name if Yes is selected
                }
                isApplicantAvailableSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet ref={relationSheetRef} containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Relation</Text>
          {relationOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('availablePersonRelation', option);
                if (option !== 'Others') {
                  setValue('availablePersonRelationOther', '');
                }
                relationSheetRef.current?.hide();
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
