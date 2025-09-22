import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {colors} from '../../constants/colors';
import {InputFormItem} from '../../lib/InputFormItem';
import {SelectFormItem} from '../../lib/SelectFormItem';
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Employee {
  numberOfEmployees: string;
  salaryPerMonthPerEmployee: string;
  statusOfEmployee: string;
  numberOfLabours: string;
  wagesPerMonthPerDay: string;
  statusOfLabour: string;
  remarks: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  otherMajorExpenditure: string;
}

interface SalariesWagesFormData {
  numberOfEmployees: string;
  salaryPerMonthPerEmployee: string;
  statusOfEmployee: string;
  numberOfLabours: string;
  wagesPerMonthPerDay: string;
  statusOfLabour: string;
  remarks: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  otherMajorExpenditure: string;
}

interface SalariesWagesProps {
  onSubmit: (data: SalariesWagesFormData) => void;
  initialData?: SalariesWagesFormData;
}

const EMPLOYEE_STATUS_OPTIONS = [
  {id: 'permanent', name: 'Permanent'},
  {id: 'contractual', name: 'Contractual'},
];

const LABOUR_STATUS_OPTIONS = [
  {id: 'permanent', name: 'Permanent'},
  {id: 'contractual', name: 'Contractual'},
];

const SalariesWages: React.FC<SalariesWagesProps> = ({
  onSubmit,
  initialData,
}) => {
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
  } = useForm<SalariesWagesFormData>({
    defaultValues: initialData || {
      numberOfEmployees: '',
      salaryPerMonthPerEmployee: '',
      statusOfEmployee: '',
      numberOfLabours: '',
      wagesPerMonthPerDay: '',
      statusOfLabour: '',
      remarks: '',
      workingHoursStart: '',
      workingHoursEnd: '',
      otherMajorExpenditure: '',
    },
  });

  const workingHoursStart = watch('workingHoursStart');
  const workingHoursEnd = watch('workingHoursEnd');

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleStartTimeConfirm = (date: Date) => {
    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    setValue('workingHoursStart', timeString);
    hideStartTimePicker();
  };

  const handleEndTimeConfirm = (date: Date) => {
    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    setValue('workingHoursEnd', timeString);
    hideEndTimePicker();
  };

  const onFormSubmit = (data: SalariesWagesFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Employee Information</Text>

      <InputFormItem
        data={{
          title: 'No. of Employees',
          key: 'numberOfEmployees',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of employees',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Salary per month per employee',
          key: 'salaryPerMonthPerEmployee',
          control,
          errors,
          required: true,
          placeholder: 'Enter salary amount',
          keyboardType: 'numeric',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Status of Employee',
          key: 'statusOfEmployee',
          control,
          errors,
          required: true,
          options: EMPLOYEE_STATUS_OPTIONS,
        }}
      />

      <Text style={styles.sectionTitle}>Labour Information</Text>

      <InputFormItem
        data={{
          title: 'No. of Labours',
          key: 'numberOfLabours',
          control,
          errors,
          required: true,
          placeholder: 'Enter number of labours',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Wages per month/per day',
          key: 'wagesPerMonthPerDay',
          control,
          errors,
          required: true,
          placeholder: 'Enter wages amount',
          keyboardType: 'numeric',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Status of Labour',
          key: 'statusOfLabour',
          control,
          errors,
          required: true,
          options: LABOUR_STATUS_OPTIONS,
        }}
      />

      <Text style={styles.sectionTitle}>Working Hours</Text>

      <View style={styles.timePickerContainer}>
        <Text style={styles.fieldLabel}>Working Hours Range *</Text>
        <View style={styles.timePickerRow}>
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={showStartTimePicker}>
            <Text style={styles.timePickerText}>
              {workingHoursStart || 'Start Time'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.timeSeparator}>to</Text>
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={showEndTimePicker}>
            <Text style={styles.timePickerText}>
              {workingHoursEnd || 'End Time'}
            </Text>
          </TouchableOpacity>
        </View>
        {errors.workingHoursStart && (
          <Text style={styles.errorText}>
            {errors.workingHoursStart.message}
          </Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Additional Information</Text>

      <TextAreaFormItem
        data={{
          title: 'Remarks',
          key: 'remarks',
          control,
          errors,
          required: false,
          placeholder: 'Enter any remarks',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Other Major Expenditure',
          key: 'otherMajorExpenditure',
          control,
          errors,
          required: false,
          placeholder: 'Enter other major expenditure details',
        }}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onFormSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
        is24Hour={true}
      />

      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
        is24Hour={true}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: colors.text.primary,
  },
  timePickerContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text.primary,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  timePickerText: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 16,
    color: colors.text.secondary,
    marginHorizontal: 8,
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
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  submitButtonText: {
    color: colors.button.primary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SalariesWages;
