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
  employeesDeclared: string;
  employeesObserved: string;
  constitutionOfBusiness: string;
  natureOfBusiness: string;
  businessActivityObserved: string;
  stockObserved: string;
  businessStartYear: string;
  occupiedSince: string;
  netMargin: string;
  businessPremisesSize: string;
  rawMaterialSupplier: string;
};

type BusinessDetailsProps = {
  formData: any;
  onSubmit: any;
};

const CONSTITUTION_OPTIONS = [
  'Proprietorship',
  'Partnership',
  'Private Limited',
  'LLP',
  'Others',
];

const BUSINESS_ACTIVITY_OPTIONS = [
  'Retail',
  'Wholesale',
  'Manufacturing',
  'Service',
  'Trading',
  'Others',
];

const PREMISES_SIZE_OPTIONS = [
  'Less than 100 sq.ft',
  '100-500 sq.ft',
  '500-1000 sq.ft',
  '1000-2000 sq.ft',
  'More than 2000 sq.ft',
];

const NATURE_OF_BUSINESS_OPTIONS = [
  'Manufacturer',
  'Trader',
  'Service Provider',
  'Distributor',
  'Retailer',
  'Others',
];

const BusinessDetails: React.FC<BusinessDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const constitutionSheetRef = useRef<ActionSheetRef>(null);
  const businessActivitySheetRef = useRef<ActionSheetRef>(null);
  const premisesSizeSheetRef = useRef<ActionSheetRef>(null);
  const natureOfBusinessSheetRef = useRef<ActionSheetRef>(null);

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
    sheetRef: React.RefObject<ActionSheetRef>,
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
        {renderNumericInput(
          'employeesDeclared',
          'Number of Employees (Declared)',
        )}
        {renderNumericInput(
          'employeesObserved',
          'Number of Employees (Observed)',
        )}

        {renderSelectField(
          'constitutionOfBusiness',
          'Constitution of Business',
          CONSTITUTION_OPTIONS,
          constitutionSheetRef,
        )}

        {renderSelectField(
          'natureOfBusiness',
          'Nature of Business',
          NATURE_OF_BUSINESS_OPTIONS,
          natureOfBusinessSheetRef,
        )}

        {renderSelectField(
          'businessActivityObserved',
          'Business Activity Observed',
          BUSINESS_ACTIVITY_OPTIONS,
          businessActivitySheetRef,
        )}

        {renderNumericInput('stockObserved', 'Stock Observed (₹)')}
        {renderNumericInput('businessStartYear', 'Business Start Year')}
        {renderNumericInput('occupiedSince', 'Occupied Since (Year)')}
        {renderNumericInput('netMargin', 'Net Margin (%)')}

        {renderSelectField(
          'businessPremisesSize',
          'Business Premises Size',
          PREMISES_SIZE_OPTIONS,
          premisesSizeSheetRef,
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Raw Material Supplier</Text>
          <Controller
            control={control}
            name="rawMaterialSupplier"
            rules={{
              required: 'Raw Material Supplier is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={[
                  styles.input,
                  errors.rawMaterialSupplier && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter raw material supplier"
                placeholderTextColor={colors.text.secondary}
              />
            )}
          />
          {errors.rawMaterialSupplier && (
            <Text style={styles.errorText}>
              {errors.rawMaterialSupplier.message}
            </Text>
          )}
        </View>
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
    color: colors.text.secondary,
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
});

export default BusinessDetails;
