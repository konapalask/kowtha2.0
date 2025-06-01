import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {colors} from '../../constants/colors';
// import ActionSheet from '../ActionSheet';

export type BusinessMiscellaneousFormData = {
  ownershipOfPremises: string;
  rentalAmount?: string;
  yearsInCurrentPremises: string;
  stockSeen: string;
  employeesSeen: string;
  otherSetupObserved: string;
  illegalSetupObserved: string;
  politicallyConnected: string;
  privateFinanceOrChits: string;
  businessActivity: string;
  businessActivityOther?: string;
};

type BusinessMiscellaneousProps = {
  onSubmit: (data: BusinessMiscellaneousFormData) => void;
  initialData?: BusinessMiscellaneousFormData;
};

const OWNERSHIP_OPTIONS = ['Owned', 'Rented', 'Leased', 'Others'];
const STOCK_SEEN_OPTIONS = ['Yes', 'No'];
const EMPLOYEES_SEEN_OPTIONS = ['None', '1-2', '3-5', '6+'];
const ILLEGAL_SETUP_OPTIONS = ['Yes', 'No'];
const POLITICALLY_CONNECTED_OPTIONS = ['Yes', 'No'];
const PRIVATE_FINANCE_OPTIONS = ['Yes', 'No'];
const BUSINESS_ACTIVITY_OPTIONS = [
  'Trading',
  'Services',
  'Manufacturing',
  'Others',
];

const BusinessMiscellaneous: React.FC<BusinessMiscellaneousProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: {errors},
  } = useForm<BusinessMiscellaneousFormData>({
    defaultValues: initialData || {
      ownershipOfPremises: '',
      rentalAmount: '',
      yearsInCurrentPremises: '',
      stockSeen: '',
      employeesSeen: '',
      otherSetupObserved: '',
      illegalSetupObserved: '',
      politicallyConnected: '',
      privateFinanceOrChits: '',
      businessActivity: '',
      businessActivityOther: '',
    },
  });

  React.useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const ownershipOfPremises = watch('ownershipOfPremises');
  const businessActivity = watch('businessActivity');

  // ActionSheet state
  const [ownershipSheetVisible, setOwnershipSheetVisible] = useState(false);
  const [stockSeenSheetVisible, setStockSeenSheetVisible] = useState(false);
  const [employeesSeenSheetVisible, setEmployeesSeenSheetVisible] =
    useState(false);
  const [illegalSetupSheetVisible, setIllegalSetupSheetVisible] =
    useState(false);
  const [
    politicallyConnectedSheetVisible,
    setPoliticallyConnectedSheetVisible,
  ] = useState(false);
  const [privateFinanceSheetVisible, setPrivateFinanceSheetVisible] =
    useState(false);
  const [businessActivitySheetVisible, setBusinessActivitySheetVisible] =
    useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* 16. Ownership of the Business Premises (select) */}
      <Controller
        control={control}
        name="ownershipOfPremises"
        rules={{required: 'Ownership is required'}}
        render={({field: {value, onChange}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ownership of Business Premises</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setOwnershipSheetVisible(true)}>
              <Text
                style={{
                  color: value ? colors.input.text : colors.text.disabled,
                }}>
                {value || 'Select ownership'}
              </Text>
            </TouchableOpacity>
            {errors.ownershipOfPremises && (
              <Text style={styles.errorText}>
                {errors.ownershipOfPremises.message}
              </Text>
            )}
            {/* <ActionSheet
              visible={ownershipSheetVisible}
              options={OWNERSHIP_OPTIONS}
              onClose={() => setOwnershipSheetVisible(false)}
              onSelect={option => {
                onChange(option);
                setOwnershipSheetVisible(false);
              }}
            /> */}
          </View>
        )}
      />
      {/* 17. If rented - rental amount (input, conditional) */}
      {ownershipOfPremises === 'Rented' && (
        <Controller
          control={control}
          name="rentalAmount"
          rules={{required: 'Rental amount is required'}}
          render={({field: {value, onChange, onBlur}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rental Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter rental amount"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.text.disabled}
              />
              {errors.rentalAmount && (
                <Text style={styles.errorText}>
                  {errors.rentalAmount.message}
                </Text>
              )}
            </View>
          )}
        />
      )}
      {/* 18. No: of Years in the current Business premises (input) */}
      <Controller
        control={control}
        name="yearsInCurrentPremises"
        rules={{required: 'No. of years is required'}}
        render={({field: {value, onChange, onBlur}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              No. of Years in Current Business Premises
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of years"
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.yearsInCurrentPremises && (
              <Text style={styles.errorText}>
                {errors.yearsInCurrentPremises.message}
              </Text>
            )}
          </View>
        )}
      />
      {/* 19. Stock seen (select) */}
      <Controller
        control={control}
        name="stockSeen"
        rules={{required: 'Stock seen is required'}}
        render={({field: {value, onChange}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Stock Seen</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setStockSeenSheetVisible(true)}>
              <Text
                style={{
                  color: value ? colors.input.text : colors.text.disabled,
                }}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.stockSeen && (
              <Text style={styles.errorText}>{errors.stockSeen.message}</Text>
            )}
            {/* <ActionSheet
              visible={stockSeenSheetVisible}
              options={STOCK_SEEN_OPTIONS}
              onClose={() => setStockSeenSheetVisible(false)}
              onSelect={option => {
                onChange(option);
                setStockSeenSheetVisible(false);
              }}
            /> */}
          </View>
        )}
      />
      {/* 20. Employees seen (select) */}
      <Controller
        control={control}
        name="employeesSeen"
        rules={{required: 'Employees seen is required'}}
        render={({field: {value, onChange}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Employees Seen</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setEmployeesSeenSheetVisible(true)}>
              <Text
                style={{
                  color: value ? colors.input.text : colors.text.disabled,
                }}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.employeesSeen && (
              <Text style={styles.errorText}>
                {errors.employeesSeen.message}
              </Text>
            )}
            {/* <ActionSheet
              visible={employeesSeenSheetVisible}
              options={EMPLOYEES_SEEN_OPTIONS}
              onClose={() => setEmployeesSeenSheetVisible(false)}
              onSelect={option => {
                onChange(option);
                setEmployeesSeenSheetVisible(false);
              }}
            /> */}
          </View>
        )}
      />
      {/* 21. Any other setup was observed in the premises (input) */}
      <Controller
        control={control}
        name="otherSetupObserved"
        render={({field: {value, onChange, onBlur}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Any Other Setup Observed in the Premises
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter details (optional)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
            />
          </View>
        )}
      />
      {/* 22. Any ILLEGAL setup was observed (select) */}
      <Controller
        control={control}
        name="illegalSetupObserved"
        rules={{required: 'This field is required'}}
        render={({field: {value, onChange}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Any ILLEGAL Setup Observed</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setIllegalSetupSheetVisible(true)}>
              <Text
                style={{
                  color: value ? colors.input.text : colors.text.disabled,
                }}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.illegalSetupObserved && (
              <Text style={styles.errorText}>
                {errors.illegalSetupObserved.message}
              </Text>
            )}
            {/* <ActionSheet
              visible={illegalSetupSheetVisible}
              options={ILLEGAL_SETUP_OPTIONS}
              onClose={() => setIllegalSetupSheetVisible(false)}
              onSelect={option => {
                onChange(option);
                setIllegalSetupSheetVisible(false);
              }}
            /> */}
          </View>
        )}
      />
      {/* 23. Is applicant or any family member politically connected (select) */}
      <Controller
        control={control}
        name="politicallyConnected"
        rules={{required: 'This field is required'}}
        render={({field: {value, onChange}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Is Applicant or Any Family Member Politically Connected?
            </Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setPoliticallyConnectedSheetVisible(true)}>
              <Text
                style={{
                  color: value ? colors.input.text : colors.text.disabled,
                }}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.politicallyConnected && (
              <Text style={styles.errorText}>
                {errors.politicallyConnected.message}
              </Text>
            )}
            {/* <ActionSheet
              visible={politicallyConnectedSheetVisible}
              options={POLITICALLY_CONNECTED_OPTIONS}
              onClose={() => setPoliticallyConnectedSheetVisible(false)}
              onSelect={option => {
                onChange(option);
                setPoliticallyConnectedSheetVisible(false);
              }}
            /> */}
          </View>
        )}
      />
      {/* 24. As per neighbor check, any collections or private finance or private chits are being operated from the premises or by the applicant (select) */}
      <Controller
        control={control}
        name="privateFinanceOrChits"
        rules={{required: 'This field is required'}}
        render={({field: {value, onChange}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Any Collections/Private Finance/Chits Operated from Premises or by
              Applicant (as per neighbor check)
            </Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setPrivateFinanceSheetVisible(true)}>
              <Text
                style={{
                  color: value ? colors.input.text : colors.text.disabled,
                }}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.privateFinanceOrChits && (
              <Text style={styles.errorText}>
                {errors.privateFinanceOrChits.message}
              </Text>
            )}
            {/* <ActionSheet
              visible={privateFinanceSheetVisible}
              options={PRIVATE_FINANCE_OPTIONS}
              onClose={() => setPrivateFinanceSheetVisible(false)}
              onSelect={option => {
                onChange(option);
                setPrivateFinanceSheetVisible(false);
              }}
            /> */}
          </View>
        )}
      />
      {/* 25. Business activity (Trading/Services/Manufacturing/Others, with 'others' input) */}
      <Controller
        control={control}
        name="businessActivity"
        rules={{required: 'Business activity is required'}}
        render={({field: {value, onChange}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business Activity</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setBusinessActivitySheetVisible(true)}>
              <Text
                style={{
                  color: value ? colors.input.text : colors.text.disabled,
                }}>
                {value || 'Select activity'}
              </Text>
            </TouchableOpacity>
            {errors.businessActivity && (
              <Text style={styles.errorText}>
                {errors.businessActivity.message}
              </Text>
            )}
            {/* <ActionSheet
              visible={businessActivitySheetVisible}
              options={BUSINESS_ACTIVITY_OPTIONS}
              onClose={() => setBusinessActivitySheetVisible(false)}
              onSelect={option => {
                onChange(option);
                setBusinessActivitySheetVisible(false);
              }}
            /> */}
          </View>
        )}
      />
      {businessActivity === 'Others' && (
        <Controller
          control={control}
          name="businessActivityOther"
          rules={{required: 'Please specify other business activity'}}
          render={({field: {value, onChange, onBlur}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specify Other Business Activity</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter other business activity"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.text.disabled}
              />
              {errors.businessActivityOther && (
                <Text style={styles.errorText}>
                  {errors.businessActivityOther.message}
                </Text>
              )}
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>
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
  selectInput: {
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.input.background,
    justifyContent: 'center',
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
});

export default BusinessMiscellaneous;
