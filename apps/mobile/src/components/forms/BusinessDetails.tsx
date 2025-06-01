import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { colors } from '../../constants/colors';
import GetLocation from 'react-native-get-location';

const yesNoOptions = ['Yes', 'No'];
const constitutionOptions = [
  'Proprietorship',
  'Partnership',
  'PVT Ltd',
  'Ltd',
  'Society',
  'Trust',
  'Others',
];

export type BusinessDetailsFormData = {
  nameBoardSeen: string;
  nameBoardMatched: string;
  constitution: string;
  constitutionOther?: string;
  keyManager: string;
  keyManagerRelation: string;
  businessStartYear: string;
  totalExperience: string;
  isAddressTraceable: string;
  geoTag: string;
};

type BusinessDetailsProps = {
  onSubmit: (data: BusinessDetailsFormData) => void;
  initialData?: BusinessDetailsFormData;
};

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ onSubmit, initialData }) => {
  const {
    control, handleSubmit, setValue, watch, reset, formState: { errors },
  } = useForm<BusinessDetailsFormData>({
    defaultValues: initialData || {
      nameBoardSeen: '',
      nameBoardMatched: '',
      constitution: '',
      constitutionOther: '',
      keyManager: '',
      keyManagerRelation: '',
      businessStartYear: '',
      totalExperience: '',
      isAddressTraceable: '',
      geoTag: '',
    },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  useEffect(() => {
    GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 })
      .then(location => setValue('geoTag', `${location.latitude},${location.longitude}`))
      .catch(() => setValue('geoTag', 'Location not available'));
  }, [setValue]);

  const nameBoardSeenSheetRef = useRef<ActionSheetRef>(null);
  const nameBoardMatchedSheetRef = useRef<ActionSheetRef>(null);
  const constitutionSheetRef = useRef<ActionSheetRef>(null);
  const isAddressTraceableSheetRef = useRef<ActionSheetRef>(null);

  const watchedConstitution = watch('constitution');

  return (
    <ScrollView style={styles.container}>
      {/* Name Board was seen */}
      <Controller
        control={control}
        name="nameBoardSeen"
        rules={{ required: 'Required' }}
        render={({ field: { value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name Board was seen</Text>
            <TouchableOpacity style={styles.selectButton} onPress={() => nameBoardSeenSheetRef.current?.show()}>
              <Text style={value ? styles.selectButtonText : styles.placeholder}>{value || 'Select Yes/No'}</Text>
            </TouchableOpacity>
            {errors.nameBoardSeen && <Text style={styles.errorText}>{errors.nameBoardSeen.message}</Text>}
          </View>
        )}
      />
      {/* Is it matched with the Initiation? */}
      <Controller
        control={control}
        name="nameBoardMatched"
        rules={{ required: 'Required' }}
        render={({ field: { value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Is it matched with the Initiation?</Text>
            <TouchableOpacity style={styles.selectButton} onPress={() => nameBoardMatchedSheetRef.current?.show()}>
              <Text style={value ? styles.selectButtonText : styles.placeholder}>{value || 'Select Yes/No'}</Text>
            </TouchableOpacity>
            {errors.nameBoardMatched && <Text style={styles.errorText}>{errors.nameBoardMatched.message}</Text>}
          </View>
        )}
      />
      {/* Constitution of The Business */}
      <Controller
        control={control}
        name="constitution"
        rules={{ required: 'Required' }}
        render={({ field: { value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Constitution of The Business</Text>
            <TouchableOpacity style={styles.selectButton} onPress={() => constitutionSheetRef.current?.show()}>
              <Text style={value ? styles.selectButtonText : styles.placeholder}>{value || 'Select Constitution'}</Text>
            </TouchableOpacity>
            {errors.constitution && <Text style={styles.errorText}>{errors.constitution.message}</Text>}
          </View>
        )}
      />
      {/* If Others, specify constitution */}
      {watchedConstitution === 'Others' && (
        <Controller
          control={control}
          name="constitutionOther"
          rules={{ required: 'Please specify constitution' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specify Constitution</Text>
              <TextInput
                style={styles.input}
                placeholder="Specify constitution"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.text.disabled}
              />
              {errors.constitutionOther && <Text style={styles.errorText}>{errors.constitutionOther.message}</Text>}
            </View>
          )}
        />
      )}
      {/* Key manager person of the Business */}
      <Controller
        control={control}
        name="keyManager"
        rules={{ required: 'Required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Key manager person of the Business</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter key manager name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.keyManager && <Text style={styles.errorText}>{errors.keyManager.message}</Text>}
          </View>
        )}
      />
      {/* Relationship to the applicant */}
      <Controller
        control={control}
        name="keyManagerRelation"
        rules={{ required: 'Required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Relationship to the applicant</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter relationship"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.keyManagerRelation && <Text style={styles.errorText}>{errors.keyManagerRelation.message}</Text>}
          </View>
        )}
      />
      {/* Business started in the year */}
      <Controller
        control={control}
        name="businessStartYear"
        rules={{ required: 'Required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business started in the year</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.businessStartYear && <Text style={styles.errorText}>{errors.businessStartYear.message}</Text>}
          </View>
        )}
      />
      {/* Total experience in the field */}
      <Controller
        control={control}
        name="totalExperience"
        rules={{ required: 'Required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Total experience in the field (years)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter total experience"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              placeholderTextColor={colors.text.disabled}
            />
            {errors.totalExperience && <Text style={styles.errorText}>{errors.totalExperience.message}</Text>}
          </View>
        )}
      />
      {/* Is Business address traceable */}
      <Controller
        control={control}
        name="isAddressTraceable"
        rules={{ required: 'Required' }}
        render={({ field: { value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Is Business address traceable?</Text>
            <TouchableOpacity style={styles.selectButton} onPress={() => isAddressTraceableSheetRef.current?.show()}>
              <Text style={value ? styles.selectButtonText : styles.placeholder}>{value || 'Select Yes/No'}</Text>
            </TouchableOpacity>
            {errors.isAddressTraceable && <Text style={styles.errorText}>{errors.isAddressTraceable.message}</Text>}
          </View>
        )}
      />
      {/* GeoTag */}
      <Controller
        control={control}
        name="geoTag"
        rules={{ required: 'Geo tag is required' }}
        render={({ field: { value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Geo Tag</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={value}
              editable={false}
              placeholder="Capturing location..."
              placeholderTextColor={colors.text.disabled}
            />
            {errors.geoTag && <Text style={styles.errorText}>{errors.geoTag.message}</Text>}
          </View>
        )}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>
      {/* ActionSheets */}
      <ActionSheet ref={nameBoardSeenSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Name Board was seen</Text>
          {yesNoOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPress={() => {
                setValue('nameBoardSeen', option);
                nameBoardSeenSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>
      <ActionSheet ref={nameBoardMatchedSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Is it matched with the Initiation?</Text>
          {yesNoOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPress={() => {
                setValue('nameBoardMatched', option);
                nameBoardMatchedSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>
      <ActionSheet ref={constitutionSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Constitution of The Business</Text>
          {constitutionOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPress={() => {
                setValue('constitution', option);
                if (option !== 'Others') setValue('constitutionOther', '');
                constitutionSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>
      <ActionSheet ref={isAddressTraceableSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Is Business address traceable?</Text>
          {yesNoOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPress={() => {
                setValue('isAddressTraceable', option);
                isAddressTraceableSheetRef.current?.hide();
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

export default BusinessDetails;
