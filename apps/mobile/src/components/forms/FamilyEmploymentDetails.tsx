import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {useForm, Controller} from 'react-hook-form';
import {FamilyEmploymentDetailsFormData} from '../../types/verification';
import {colors} from '../../constants/colors';
import Toast from 'react-native-toast-message';

interface FamilyEmploymentDetailsProps {
  onSubmit: (data: FamilyEmploymentDetailsFormData) => void;
  initialData?: FamilyEmploymentDetailsFormData;
}

const YES_NO_OPTIONS = ['Yes', 'No'];

const FamilyEmploymentDetails: React.FC<FamilyEmploymentDetailsProps> = ({
  onSubmit,
  initialData,
}) => {
  const isSpouseWorkingRef = React.useRef<ActionSheetRef>(null);
  const [showSpouseDetails, setShowSpouseDetails] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
    trigger,
  } = useForm<FamilyEmploymentDetailsFormData>({
    defaultValues: initialData || {
      totalFamilyMembers: '',
      earningMembers: '',
      dependents: '',
      isSpouseWorking: '',
      spouseEmploymentDetails: '',
      assetsObserved: '',
    },
    mode: 'onChange',
  });

  const isSpouseWorking = watch('isSpouseWorking');
  const totalFamilyMembers = watch('totalFamilyMembers');
  const earningMembers = watch('earningMembers');
  const dependents = watch('dependents');

  React.useEffect(() => {
    setShowSpouseDetails(isSpouseWorking === 'Yes');
  }, [isSpouseWorking]);

  // Add validation effect for total family members
  React.useEffect(() => {
    if (totalFamilyMembers) {
      trigger('totalFamilyMembers');
    }
  }, [totalFamilyMembers, earningMembers, dependents]);

  // Add validation effect for earning members
  React.useEffect(() => {
    if (earningMembers) {
      trigger('earningMembers');
    }
  }, [earningMembers, totalFamilyMembers]);

  // Add validation effect for dependents
  React.useEffect(() => {
    if (dependents) {
      trigger('dependents');
    }
  }, [dependents, totalFamilyMembers]);

  const handleSelect = (
    value: string,
    field: keyof FamilyEmploymentDetailsFormData,
    ref: React.RefObject<ActionSheetRef | null>,
  ) => {
    setValue(field, value);
    trigger(field);
    if (ref.current) {
      ref.current.hide();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Controller
          control={control}
          rules={{
            required: 'Total family members is required',
            validate: value => {
              if (
                earningMembers &&
                dependents &&
                parseInt(earningMembers) + parseInt(dependents) !==
                  parseInt(value)
              ) {
                return 'Earning members and Dependents should sum up to total family members';
              }
              return true;
            },
          }}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Total Family Members*</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.totalFamilyMembers && styles.inputError,
                ]}
                onChangeText={text => {
                  if (/^\d*$/.test(text)) {
                    onChange(text);
                    trigger('totalFamilyMembers');
                  }
                }}
                value={value}
                placeholder="Enter total family members"
                keyboardType="numeric"
              />
              {errors.totalFamilyMembers && (
                <Text style={styles.errorText}>
                  {errors.totalFamilyMembers.message}
                </Text>
              )}
            </View>
          )}
          name="totalFamilyMembers"
        />

        <Controller
          control={control}
          rules={{
            required: 'Number of earning members is required',
            validate: value => {
              if (
                totalFamilyMembers &&
                parseInt(totalFamilyMembers) < parseInt(value)
              ) {
                return 'Number of earning members cannot be greater than total family members';
              }
              return true;
            },
          }}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>No. of Earning Members*</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.earningMembers && styles.inputError,
                ]}
                onChangeText={text => {
                  if (/^\d*$/.test(text)) {
                    onChange(text);
                    trigger('earningMembers');
                  }
                }}
                value={value}
                placeholder="Enter number of earning members"
                keyboardType="numeric"
              />
              {errors.earningMembers && (
                <Text style={styles.errorText}>
                  {errors.earningMembers.message}
                </Text>
              )}
            </View>
          )}
          name="earningMembers"
        />

        <Controller
          control={control}
          rules={{
            required: 'Number of dependents is required',
            validate: value => {
              if (
                totalFamilyMembers &&
                parseInt(totalFamilyMembers) < parseInt(value)
              ) {
                return 'Number of dependents cannot be greater than total family members';
              }
              return true;
            },
          }}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>No. of Dependents*</Text>
              <TextInput
                style={[styles.input, errors.dependents && styles.inputError]}
                onChangeText={text => {
                  if (/^\d*$/.test(text)) {
                    onChange(text);
                    trigger('dependents');
                  }
                }}
                value={value}
                placeholder="Enter number of dependents"
                keyboardType="numeric"
              />
              {errors.dependents && (
                <Text style={styles.errorText}>
                  {errors.dependents.message}
                </Text>
              )}
            </View>
          )}
          name="dependents"
        />

        <Controller
          control={control}
          rules={{required: 'Spouse working status is required'}}
          render={({field: {value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Is Spouse Working?*</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => isSpouseWorkingRef.current?.show()}>
                <Text
                  style={value ? styles.selectButtonText : styles.placeholder}>
                  {value || 'Select working status'}
                </Text>
              </TouchableOpacity>
              {errors.isSpouseWorking && (
                <Text style={styles.errorText}>
                  {errors.isSpouseWorking.message}
                </Text>
              )}
            </View>
          )}
          name="isSpouseWorking"
        />

        {showSpouseDetails && (
          <Controller
            control={control}
            rules={{required: 'Spouse employment details is required'}}
            render={({field: {onChange, value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Spouse's Employment Details*</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter spouse's employment details"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {errors.spouseEmploymentDetails && (
                  <Text style={styles.errorText}>
                    {errors.spouseEmploymentDetails.message}
                  </Text>
                )}
              </View>
            )}
            name="spouseEmploymentDetails"
          />
        )}

        <Controller
          control={control}
          rules={{required: 'Assets observed is required'}}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Vehicle or Major Assets Observed*
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                onChangeText={onChange}
                value={value}
                placeholder="Enter vehicles or major assets observed"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.assetsObserved && (
                <Text style={styles.errorText}>
                  {errors.assetsObserved.message}
                </Text>
              )}
            </View>
          )}
          name="assetsObserved"
        />
      </ScrollView>

      <ActionSheet ref={isSpouseWorkingRef}>
        <View style={styles.actionSheet}>
          <Text style={styles.actionSheetTitle}>Is Spouse Working?</Text>
          <View style={styles.actionSheetContent}>
            {YES_NO_OPTIONS.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.actionSheetItem}
                onPressIn={() =>
                  handleSelect(option, 'isSpouseWorking', isSpouseWorkingRef)
                }>
                <Text style={styles.actionSheetItemText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    padding: 16,
  },
  actionSheetContent: {
    // padding: 16,
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
  inputError: {
    borderColor: colors.error,
  },
});

export default FamilyEmploymentDetails;
