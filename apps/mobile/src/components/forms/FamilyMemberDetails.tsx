import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {useForm, Controller, useFieldArray, useWatch} from 'react-hook-form';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {FamilyMember} from '../../types/verification';
import {colors} from '../../constants/colors';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

interface FamilyMemberDetailsFormData {
  familyMembers: FamilyMember[];
}

interface FamilyMemberDetailsProps {
  onSubmit: (data: FamilyMember[]) => void;
  initialData?: FamilyMember[];
  maxFamilyMembers?: number;
}

const validationSchema = yup.object().shape({
  familyMembers: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Name is required'),
        relation: yup.string().required('Relation is required'),
        otherRelation: yup.string().when('relation', {
          is: (val: string) => val === 'Other',
          then: () => yup.string().required('Please specify the relation'),
        }),
        age: yup
          .string()
          .required('Age is required')
          .matches(/^[0-9]+$/, 'Age must be a number'),
        employmentType: yup.string().required('Employment type is required'),
        educationalQualification: yup
          .string()
          .required('Educational qualification is required'),
        mobileNumber: yup
          .string()
          // .required('Mobile number is required')
          .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
        stayingWithApplicant: yup
          .string()
          .required('Please specify if staying with applicant'),
      }),
    )
    .required('At least one family member is required'),
});

const FamilyMemberDetails: React.FC<FamilyMemberDetailsProps> = ({
  onSubmit,
  initialData = [],
  maxFamilyMembers,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
    watch,
  } = useForm<FamilyMemberDetailsFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      familyMembers:
        initialData.length > 0 ? initialData : [createEmptyMember()],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'familyMembers',
  });

  const relationSheetRef = useRef<ActionSheetRef>(null);
  const employmentTypeSheetRef = useRef<ActionSheetRef>(null);
  const educationalQualificationSheetRef = useRef<ActionSheetRef>(null);
  const stayingWithSheetRef = useRef<ActionSheetRef>(null);
  const [activeMemberIndex, setActiveMemberIndex] = useState<number>(0);

  function createEmptyMember(): FamilyMember {
    return {
      name: '',
      relation: '',
      otherRelation: '',
      age: '',
      employmentType: '',
      educationalQualification: '',
      mobileNumber: undefined,
      stayingWithApplicant: '',
    };
  }

  const relationOptions = [
    'Wife',
    'Daughter',
    'Son',
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Other',
  ];

  const employmentTypeOptions = [
    'Homemaker',
    'Student',
    'Farmer/Agriculturist',
    'Retired',
    'Part Time Job',
    'Salaried',
    'Self Employed',
    'NRI',
    'Unemployed',
  ];

  const educationalQualificationOptions = [
    'Below 10th',
    '10th Pass',
    '12th Pass',
    'Diploma/ITI Certification',
    'Graduate',
    'PG/Professional Certification',
  ];

  const stayingWithOptions = ['Yes', 'No'];

  const showActionSheet = (type: string, index: number) => {
    setActiveMemberIndex(index);
    switch (type) {
      case 'relation':
        relationSheetRef.current?.show();
        break;
      case 'employmentType':
        employmentTypeSheetRef.current?.show();
        break;
      case 'educationalQualification':
        educationalQualificationSheetRef.current?.show();
        break;
      case 'stayingWithApplicant':
        stayingWithSheetRef.current?.show();
        break;
    }
  };

  const onFormSubmit = (data: FamilyMemberDetailsFormData) => {
    onSubmit(data.familyMembers);
  };

  const renderFamilyMemberFields = (index: number) => {
    const relationValue = watch(`familyMembers.${index}.relation`);
    return (
      <View key={index} style={styles.memberContainer}>
        <View style={styles.memberHeader}>
          <Text style={styles.memberTitle}>Family Member {index + 1}</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => remove(index)}
              style={styles.removeButton}>
              <Icon name="delete" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        <Controller
          control={control}
          name={`familyMembers.${index}.name`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.familyMembers?.[index]?.name && styles.inputError,
                ]}
                placeholder="Enter name"
                value={value}
                onChangeText={onChange}
              />
              {errors.familyMembers?.[index]?.name && (
                <Text style={styles.errorText}>
                  {errors.familyMembers[index]?.name?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`familyMembers.${index}.relation`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Relation</Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  errors.familyMembers?.[index]?.relation && styles.inputError,
                ]}
                onPress={() => showActionSheet('relation', index)}>
                <Text
                  style={value ? styles.selectButtonText : styles.placeholder}>
                  {value || 'Select Relation'}
                </Text>
              </TouchableOpacity>
              {errors.familyMembers?.[index]?.relation && (
                <Text style={styles.errorText}>
                  {errors.familyMembers[index]?.relation?.message}
                </Text>
              )}
            </View>
          )}
        />

        {relationValue === 'Other' && (
          <Controller
            control={control}
            name={`familyMembers.${index}.otherRelation`}
            render={({field: {onChange, value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Specify Relation</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.familyMembers?.[index]?.otherRelation &&
                      styles.inputError,
                  ]}
                  placeholder="Enter relation"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.familyMembers?.[index]?.otherRelation && (
                  <Text style={styles.errorText}>
                    {errors.familyMembers[index]?.otherRelation?.message}
                  </Text>
                )}
              </View>
            )}
          />
        )}

        <Controller
          control={control}
          name={`familyMembers.${index}.age`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.familyMembers?.[index]?.age && styles.inputError,
                ]}
                placeholder="Enter age"
                value={value}
                keyboardType="numeric"
                onChangeText={text => {
                  if (/^\d*$/.test(text)) {
                    onChange(text);
                  }
                }}
              />
              {errors.familyMembers?.[index]?.age && (
                <Text style={styles.errorText}>
                  {errors.familyMembers[index]?.age?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`familyMembers.${index}.employmentType`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Employment Type</Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  errors.familyMembers?.[index]?.employmentType &&
                    styles.inputError,
                ]}
                onPress={() => showActionSheet('employmentType', index)}>
                <Text
                  style={value ? styles.selectButtonText : styles.placeholder}>
                  {value || 'Select Employment Type'}
                </Text>
              </TouchableOpacity>
              {errors.familyMembers?.[index]?.employmentType && (
                <Text style={styles.errorText}>
                  {errors.familyMembers[index]?.employmentType?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`familyMembers.${index}.educationalQualification`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Educational Qualification</Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  errors.familyMembers?.[index]?.educationalQualification &&
                    styles.inputError,
                ]}
                onPress={() =>
                  showActionSheet('educationalQualification', index)
                }>
                <Text
                  style={value ? styles.selectButtonText : styles.placeholder}>
                  {value || 'Select Educational Qualification'}
                </Text>
              </TouchableOpacity>
              {errors.familyMembers?.[index]?.educationalQualification && (
                <Text style={styles.errorText}>
                  {
                    errors.familyMembers[index]?.educationalQualification
                      ?.message
                  }
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`familyMembers.${index}.mobileNumber`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.familyMembers?.[index]?.mobileNumber &&
                    styles.inputError,
                ]}
                placeholder="Enter mobile number"
                value={value}
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={text => {
                  const numericValue = text.replace(/[^0-9]/g, '').slice(0, 10);
                  onChange(numericValue);
                }}
              />
              {errors.familyMembers?.[index]?.mobileNumber && (
                <Text style={styles.errorText}>
                  {errors.familyMembers[index]?.mobileNumber?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`familyMembers.${index}.stayingWithApplicant`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Staying with Applicant</Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  errors.familyMembers?.[index]?.stayingWithApplicant &&
                    styles.inputError,
                ]}
                onPress={() => showActionSheet('stayingWithApplicant', index)}>
                <Text
                  style={value ? styles.selectButtonText : styles.placeholder}>
                  {value || 'Select Option'}
                </Text>
              </TouchableOpacity>
              {errors.familyMembers?.[index]?.stayingWithApplicant && (
                <Text style={styles.errorText}>
                  {errors.familyMembers[index]?.stayingWithApplicant?.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    );
  };

  const handleAddMember = () => {
    if (maxFamilyMembers && fields.length >= maxFamilyMembers) {
      Toast.show({
        type: 'error',
        text1: 'Maximum Limit Reached',
        text2: `Cannot add more than ${maxFamilyMembers} family members`,
        position: 'bottom',
      });
      return;
    }
    append(createEmptyMember());
  };

  return (
    <ScrollView style={styles.container}>
      {fields.map((field, index) => renderFamilyMemberFields(index))}

      <TouchableOpacity
        style={[
          styles.addButton,
          maxFamilyMembers && fields.length >= maxFamilyMembers
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleAddMember}
        disabled={maxFamilyMembers ? fields.length >= maxFamilyMembers : false}>
        <Text
          style={[
            styles.addButtonText,
            maxFamilyMembers && fields.length >= maxFamilyMembers
              ? styles.disabledButtonText
              : null,
          ]}>
          Add Family Member{' '}
          {maxFamilyMembers ? `(${fields.length}/${maxFamilyMembers})` : ''}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onFormSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      <ActionSheet ref={relationSheetRef} containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Relation</Text>
          {relationOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue(`familyMembers.${activeMemberIndex}.relation`, option);
                if (option !== 'Other') {
                  setValue(
                    `familyMembers.${activeMemberIndex}.otherRelation`,
                    '',
                  );
                }
                relationSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={employmentTypeSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Employment Type</Text>
          {employmentTypeOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue(
                  `familyMembers.${activeMemberIndex}.employmentType`,
                  option,
                );
                employmentTypeSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={educationalQualificationSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>
            Select Educational Qualification
          </Text>
          {educationalQualificationOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue(
                  `familyMembers.${activeMemberIndex}.educationalQualification`,
                  option,
                );
                educationalQualificationSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={stayingWithSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Staying with Applicant?</Text>
          {stayingWithOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue(
                  `familyMembers.${activeMemberIndex}.stayingWithApplicant`,
                  option,
                );
                stayingWithSheetRef.current?.hide();
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
  memberContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text.primary,
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
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
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
    borderColor: colors.button.primary.background,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 40,
  },
  submitButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 4,
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
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#9E9E9E',
  },
});

export default FamilyMemberDetails;
