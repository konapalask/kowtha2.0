import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {colors} from '../../constants/colors';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';

export type BusinessDetailsFormData = {
  yearBusinessStarted: string;
  typeOfBusiness: string;
  businessName: string;
  natureOfBusiness: string;
  stockSource: string;
  stockHandling: string;
  salesVolume: string;
  profitPerUnit: string;
  businessPremisesOwnership: string;
  numberOfWorkers: string;
  wageExpenses: string;
  majorTransactionMode: string;
};

type BusinessDetailsProps = {
  formData: any;
  onSubmit: any;
};

const TYPE_OF_BUSINESS_OPTIONS = [
  'Proprietorship',
  'Partnership',
  'Private Limited',
  'LLP',
  'Others',
];

const NATURE_OF_BUSINESS_OPTIONS = [
  'Manufacturer',
  'Trader',
  'Service Provider',
  'Distributor',
  'Retailer',
  'Others',
];

const STOCK_SOURCE_OPTIONS = ['Suppliers', 'Farmers'];

const STOCK_HANDLING_OPTIONS = ['Premises', 'Direct delivery'];

const BUSINESS_PREMISES_OWNERSHIP_OPTIONS = [
  'Owned',
  'Rented',
  'Leased',
  'Shared',
];

const MAJOR_TRANSACTION_MODE_OPTIONS = ['Cash', 'Bank'];

const ArkaFincapBusinessDetails: React.FC<BusinessDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const typeOfBusinessSheetRef = useRef<ActionSheetRef>(null);
  const natureOfBusinessSheetRef = useRef<ActionSheetRef>(null);
  const stockSourceSheetRef = useRef<ActionSheetRef>(null);
  const stockHandlingSheetRef = useRef<ActionSheetRef>(null);
  const businessPremisesOwnershipSheetRef = useRef<ActionSheetRef>(null);
  const majorTransactionModeSheetRef = useRef<ActionSheetRef>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
    watch,
  } = useForm<BusinessDetailsFormData>({
    defaultValues: formData,
  });

  const handleFormSubmit = (data: BusinessDetailsFormData) => {
    onSubmit(data);
  };

  const renderNumericInput = (
    name: keyof BusinessDetailsFormData,
    label: string,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={{
          required: `${label} is required`,
          pattern: {
            value: /^\d+$/,
            message: 'Please enter numbers only',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={[styles.input, errors[name] && styles.inputError]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="numeric"
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor={colors.text.secondary}
          />
        )}
      />
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );

  const renderSelectField = (
    name: keyof BusinessDetailsFormData,
    label: string,
    options: string[],
    sheetRef: React.RefObject<ActionSheetRef | null>,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={{
          required: `${label} is required`,
        }}
        render={({field: {onChange, value}}) => (
          <>
            <TouchableOpacity
              style={[styles.selectInput, errors[name] && styles.inputError]}
              onPress={() => sheetRef.current?.show()}>
              <Text style={value ? styles.selectText : styles.placeholderText}>
                {value || `Select ${label.toLowerCase()}`}
              </Text>
            </TouchableOpacity>
            <ActionSheet ref={sheetRef}>
              <View style={styles.actionSheetContainer}>
                {options.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.optionButton}
                    onPressIn={() => {
                      onChange(option);
                      sheetRef.current?.hide();
                    }}>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ActionSheet>
          </>
        )}
      />
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderNumericInput('yearBusinessStarted', 'Year Business Started')}

        {renderSelectField(
          'typeOfBusiness',
          'Type of Business',
          TYPE_OF_BUSINESS_OPTIONS,
          typeOfBusinessSheetRef,
        )}

        <View style={styles.readonlyField}>
          <Text style={styles.label}>Business Name *</Text>
          <Text style={styles.readonlyText}>
            {formData?.businessName || 'N/A'}
          </Text>
        </View>

        {renderSelectField(
          'natureOfBusiness',
          'Nature of Business',
          NATURE_OF_BUSINESS_OPTIONS,
          natureOfBusinessSheetRef,
        )}

        {renderSelectField(
          'stockSource',
          'Stock Source',
          STOCK_SOURCE_OPTIONS,
          stockSourceSheetRef,
        )}

        {renderSelectField(
          'stockHandling',
          'Stock Handling',
          STOCK_HANDLING_OPTIONS,
          stockHandlingSheetRef,
        )}

        {renderNumericInput('salesVolume', 'Sales Volume')}
        {renderNumericInput('profitPerUnit', 'Profit Per Unit')}

        {renderSelectField(
          'businessPremisesOwnership',
          'Business Premises Ownership',
          BUSINESS_PREMISES_OWNERSHIP_OPTIONS,
          businessPremisesOwnershipSheetRef,
        )}

        {renderNumericInput('numberOfWorkers', 'Number of Workers')}
        {renderNumericInput('wageExpenses', 'Wage Expenses')}

        {renderSelectField(
          'majorTransactionMode',
          'Major Transaction Mode',
          MAJOR_TRANSACTION_MODE_OPTIONS,
          majorTransactionModeSheetRef,
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSubmit(handleFormSubmit)}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  selectInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    height: 48,
  },
  selectText: {
    color: colors.text.primary,
  },
  placeholderText: {
    color: colors.text.secondary,
  },
  actionSheetContainer: {
    padding: 16,
  },
  optionButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  readonlyField: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  readonlyText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});

export default ArkaFincapBusinessDetails;
