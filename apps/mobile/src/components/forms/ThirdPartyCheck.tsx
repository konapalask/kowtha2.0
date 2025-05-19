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
import {ThirdPartyCheckFormData} from '../../types/verification';
import {colors} from '../../constants/colors';

type ThirdPartyCheckProps = {
  onSubmit: (data: ThirdPartyCheckFormData) => void;
  initialData?: ThirdPartyCheckFormData;
};

const RELATIONSHIP_OPTIONS = [
  'Neighbor',
  'Friend',
  'Local Shop Owner',
  'Other',
];

const FEEDBACK_STATUS_OPTIONS = ['Positive', 'Negative', 'Could Not Confirm'];

const ThirdPartyCheck: React.FC<ThirdPartyCheckProps> = ({
  onSubmit,
  initialData,
}) => {
  const relationshipRef = React.useRef<ActionSheetRef>(null);
  const feedbackStatusRef = React.useRef<ActionSheetRef>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<ThirdPartyCheckFormData>({
    defaultValues: initialData || {
      tpcName: '',
      mobileNumber: '',
      relationship: '',
      feedbackStatus: '',
      comments: '',
    },
  });

  const handleSelect = (
    value: string,
    field: keyof ThirdPartyCheckFormData,
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
          // rules={{required: 'TPC/Neighbor name is required'}}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name of TPC/Neighbor*</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder="Enter name"
              />
              {errors.tpcName && (
                <Text style={styles.errorText}>{errors.tpcName.message}</Text>
              )}
            </View>
          )}
          name="tpcName"
        />

        <Controller
          control={control}
          // rules={{required: 'Mobile number is required'}}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number*</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errors.mobileNumber && (
                <Text style={styles.errorText}>
                  {errors.mobileNumber.message}
                </Text>
              )}
            </View>
          )}
          name="mobileNumber"
        />

        <Controller
          control={control}
          // rules={{required: 'Relationship is required'}}
          render={({field: {value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Relationship to Applicant*</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => relationshipRef.current?.show()}>
                <Text style={styles.selectButtonText}>
                  {value || 'Select relationship'}
                </Text>
              </TouchableOpacity>
              {errors.relationship && (
                <Text style={styles.errorText}>
                  {errors.relationship.message}
                </Text>
              )}
            </View>
          )}
          name="relationship"
        />

        <Controller
          control={control}
          // rules={{required: 'Feedback status is required'}}
          render={({field: {value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Feedback Status*</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => feedbackStatusRef.current?.show()}>
                <Text style={styles.selectButtonText}>
                  {value || 'Select feedback status'}
                </Text>
              </TouchableOpacity>
              {errors.feedbackStatus && (
                <Text style={styles.errorText}>
                  {errors.feedbackStatus.message}
                </Text>
              )}
            </View>
          )}
          name="feedbackStatus"
        />

        <Controller
          control={control}
          // rules={{required: 'Comments/Remarks is required'}}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Comments/Remarks*</Text>
              <TextInput
                style={[styles.textArea, styles.input]}
                onChangeText={onChange}
                value={value}
                placeholder="Enter comments or remarks"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.comments && (
                <Text style={styles.errorText}>{errors.comments.message}</Text>
              )}
            </View>
          )}
          name="comments"
        />
      </ScrollView>

      <ActionSheet ref={relationshipRef}>
        <View style={styles.actionSheet}>
          <Text style={styles.actionSheetTitle}>Select Relationship</Text>
          {RELATIONSHIP_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'relationship', relationshipRef)
              }>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet ref={feedbackStatusRef}>
        <View style={styles.actionSheet}>
          <Text style={styles.actionSheetTitle}>Select Feedback Status</Text>
          {FEEDBACK_STATUS_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'feedbackStatus', feedbackStatusRef)
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
    borderColor: colors.button.primary.background,
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
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

export default ThirdPartyCheck;
