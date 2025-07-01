import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {colors} from '../../constants/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface InvestigableProps {
  isInvestigable: boolean | null;
  setIsInvestigable: (value: boolean | null) => void;
  // reason?: string;
  // setReason?: (value: string) => void;
  onYes: () => void;
}

const Investigable: React.FC<InvestigableProps> = ({
  isInvestigable,
  setIsInvestigable,
  onYes,
  // reason,
  // setReason,
}) => {
  const [reason, setReason] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  const formattedDate = selectedDate ? selectedDate.toLocaleDateString() : '';

  return (
    <View style={styles.card}>
      {/* <Text style={styles.question}>Can this loan be investigated?</Text> */}
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => {
            setIsInvestigable(true);
            onYes();
          }}>
          <View
            style={[
              styles.radioCircle,
              isInvestigable === true && styles.selectedRadio,
            ]}
          />
          <Text style={styles.radioLabel}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setIsInvestigable(false)}>
          <View
            style={[
              styles.radioCircle,
              isInvestigable === false && styles.selectedRadio,
            ]}
          />
          <Text style={styles.radioLabel}>No</Text>
        </TouchableOpacity>
      </View>
      {isInvestigable === false && (
        <View style={styles.inputContainer}>
          {/* Date Picker Field */}
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateField}
            onPress={() => setDatePickerVisible(true)}>
            <Text style={styles.dateText}>
              {formattedDate || 'Select date'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisible(false)}
          />
          {/* Reason Input */}
          <Text style={styles.label}>Please specify reason</Text>
          <TextInput
            numberOfLines={4}
            style={styles.input}
            placeholder="Enter reason"
            value={reason}
            onChangeText={setReason}
            multiline
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text.primary,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRadio: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  inputContainer: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: colors.background,
    minHeight: 40,
  },
  dateField: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
  },
});

export default Investigable;
