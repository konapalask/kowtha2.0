import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {useForm, Controller} from 'react-hook-form';
import {FinalObservationsFormData} from '../../types/verification';
import {colors} from '../../constants/colors';

type FinalObservationsProps = {
  onSubmit: (data: FinalObservationsFormData) => void;
  initialData?: FinalObservationsFormData;
};

const COOPERATIVENESS_OPTIONS = ['Polite', 'Neutral', 'Rude', 'Not Met'];

const OVERALL_STATUS_OPTIONS = ['Positive', 'Negative', 'Referred', 'Fraud'];

const FinalObservations: React.FC<FinalObservationsProps> = ({
  onSubmit,
  initialData,
}) => {
  const cooperativenessRef = React.useRef<ActionSheetRef>(null);
  const overallStatusRef = React.useRef<ActionSheetRef>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<FinalObservationsFormData>({
    defaultValues: initialData || {
      cooperativeness: '',
      overallStatus: '',
      remarks: '',
    },
  });

  const handleSelect = (
    value: string,
    field: keyof FinalObservationsFormData,
    ref: React.RefObject<ActionSheetRef | null>,
  ) => {
    setValue(field, value);
    if (ref.current) {
      ref.current.hide();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Controller
          control={control}
          rules={{required: 'Cooperativeness is required'}}
          render={({field: {value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cooperativeness of Applicant*</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => cooperativenessRef.current?.show()}>
                <Text style={styles.selectButtonText}>
                  {value || 'Select cooperativeness'}
                </Text>
              </TouchableOpacity>
              {errors.cooperativeness && (
                <Text style={styles.errorText}>
                  {errors.cooperativeness.message}
                </Text>
              )}
            </View>
          )}
          name="cooperativeness"
        />

        <Controller
          control={control}
          rules={{required: 'Overall status is required'}}
          render={({field: {value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Overall Status*</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => overallStatusRef.current?.show()}>
                <Text style={styles.selectButtonText}>
                  {value || 'Select overall status'}
                </Text>
              </TouchableOpacity>
              {errors.overallStatus && (
                <Text style={styles.errorText}>
                  {errors.overallStatus.message}
                </Text>
              )}
            </View>
          )}
          name="overallStatus"
        />

        <Controller
          control={control}
          rules={{required: 'Remarks is required'}}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Remarks*</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                onChangeText={onChange}
                value={value}
                placeholder="Enter remarks"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.remarks && (
                <Text style={styles.errorText}>{errors.remarks.message}</Text>
              )}
            </View>
          )}
          name="remarks"
        />
      </ScrollView>

      <ActionSheet ref={cooperativenessRef}>
        <View style={styles.actionSheet}>
          <Text style={styles.actionSheetTitle}>Cooperativeness</Text>
          {COOPERATIVENESS_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'cooperativeness', cooperativenessRef)
              }>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet ref={overallStatusRef}>
        <View style={styles.actionSheet}>
          <Text style={styles.actionSheetTitle}>Overall Status</Text>
          {OVERALL_STATUS_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'overallStatus', overallStatusRef)
              }>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
    backgroundColor: colors.button.primary.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: colors.button.primary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
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
});

export default FinalObservations;
