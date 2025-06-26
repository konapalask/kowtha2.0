import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import {colors} from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Types
export interface ThirdPartyCheckItem {
  tpcName: string;
  mobileNumber: string;
  relationship: string;
  feedbackStatus: string;
  comments: string;
}

export interface ThirdPartyCheckFormData {
  checks: ThirdPartyCheckItem[];
}

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
const FEEDBACK_OPTIONS = ['Positive', 'Negative', 'Neutral'];

const ThirdPartyCheck: React.FC<ThirdPartyCheckProps> = ({
  onSubmit,
  initialData,
}) => {
  const relationshipRef = React.useRef<ActionSheetRef>(null);
  const [activeRelationshipIndex, setActiveRelationshipIndex] = React.useState<
    number | null
  >(null);
  const feedbackStatusRef = React.useRef<ActionSheetRef>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<ThirdPartyCheckFormData>({
    defaultValues: {
      checks: initialData?.checks || [
        {
          tpcName: '',
          mobileNumber: '',
          relationship: '',
          feedbackStatus: '',
          comments: '',
        },
      ],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'checks',
  });

  const handleSelect = (
    value: string,
    index: number,
    ref: React.RefObject<ActionSheetRef | null>,
  ) => {
    setValue(`checks.${index}.relationship`, value);
    if (ref.current) {
      ref.current.hide();
    }
  };

  const renderCheckFields = (index: number) => (
    <View key={fields[index].id} style={styles.checkContainer}>
      <View style={styles.checkHeader}>
        <Text style={styles.checkTitle}>Third Party Check {index + 1}</Text>
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
        rules={{required: 'TPC/Neighbor name is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name of TPC/Neighbor*</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Enter name"
            />
            {errors.checks?.[index]?.tpcName && (
              <Text style={styles.errorText}>
                {errors.checks[index]?.tpcName?.message}
              </Text>
            )}
          </View>
        )}
        name={`checks.${index}.tpcName`}
      />
      <Controller
        control={control}
        rules={{required: 'Mobile number is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number*</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => {
                if (/^\d*$/.test(text)) {
                  onChange(text.slice(0, 10));
                }
              }}
              value={value}
              placeholder="Enter mobile number"
              keyboardType="numeric"
              maxLength={10}
            />
            {errors.checks?.[index]?.mobileNumber && (
              <Text style={styles.errorText}>
                {errors.checks[index]?.mobileNumber?.message}
              </Text>
            )}
          </View>
        )}
        name={`checks.${index}.mobileNumber`}
      />
      <Controller
        control={control}
        rules={{required: 'Relationship is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Relationship to Applicant*</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                setActiveRelationshipIndex(index);
                relationshipRef.current?.show();
              }}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select relationship'}
              </Text>
            </TouchableOpacity>
            {errors.checks?.[index]?.relationship && (
              <Text style={styles.errorText}>
                {errors.checks[index]?.relationship?.message}
              </Text>
            )}
          </View>
        )}
        name={`checks.${index}.relationship`}
      />
      <Controller
        control={control}
        rules={{required: 'Feedback status is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Feedback Status*</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                setActiveRelationshipIndex(index);
                feedbackStatusRef.current?.show();
              }}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Feedback Status'}
              </Text>
            </TouchableOpacity>
            {errors.checks?.[index]?.feedbackStatus && (
              <Text style={styles.errorText}>
                {errors.checks[index]?.feedbackStatus?.message}
              </Text>
            )}
          </View>
        )}
        name={`checks.${index}.feedbackStatus`}
      />
      <Controller
        control={control}
        rules={{required: 'Comments/Remarks is required'}}
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
            {errors.checks?.[index]?.comments && (
              <Text style={styles.errorText}>
                {errors.checks[index]?.comments?.message}
              </Text>
            )}
          </View>
        )}
        name={`checks.${index}.comments`}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {fields.map((_, index) => renderCheckFields(index))}
        {fields.length < 2 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              append({
                tpcName: '',
                mobileNumber: '',
                relationship: '',
                feedbackStatus: '',
                comments: '',
              })
            }>
            <Text style={styles.addButtonText}>Add Another Check</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <ActionSheet ref={relationshipRef}>
        <View style={styles.actionSheet}>
          <Text style={styles.actionSheetTitle}>Select Relationship</Text>
          {RELATIONSHIP_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() => {
                if (activeRelationshipIndex !== null) {
                  handleSelect(
                    option,
                    activeRelationshipIndex,
                    relationshipRef,
                  );
                  setActiveRelationshipIndex(null);
                }
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>
      <ActionSheet ref={feedbackStatusRef}>
        <View style={styles.actionSheet}>
          <Text style={styles.actionSheetTitle}>Select Feedback Status</Text>
          {FEEDBACK_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() => {
                if (activeRelationshipIndex !== null) {
                  setValue(
                    `checks.${activeRelationshipIndex}.feedbackStatus`,
                    option,
                  );
                  feedbackStatusRef.current?.hide();
                  setActiveRelationshipIndex(null);
                }
              }}>
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
  checkContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkTitle: {
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
