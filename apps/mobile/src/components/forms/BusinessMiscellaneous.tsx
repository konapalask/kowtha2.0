import React, {useRef} from 'react';
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
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';

export type BusinessMiscellaneousFormData = {
  ownershipOfPremises: string;
  rentalAmount?: string;
  yearsInCurrentPremises: string;
  stockSeen: string;
  employeesSeen: string;
  otherSetupObserved: string;
  // illegalSetupObserved: string;
  politicallyConnected: string;
  // privateFinanceOrChits: string;
  businessActivity: string;
  // businessActivityOther?: string;
  areaOfPremises: string;
  localityOfBusiness: string;
  employeesUnderApplicant: string;
};

type BusinessMiscellaneousProps = {
  onSubmit: (data: BusinessMiscellaneousFormData) => void;
  initialData?: BusinessMiscellaneousFormData;
};

const OWNERSHIP_OPTIONS = ['Owned', 'Rented', 'Leased', 'Others'];
const STOCK_SEEN_OPTIONS = ['Yes', 'No'];
// const EMPLOYEES_SEEN_OPTIONS = ['None', '1-2', '3-5', '6+'];
const ILLEGAL_SETUP_OPTIONS = ['Yes', 'No'];
const POLITICALLY_CONNECTED_OPTIONS = ['Yes', 'No'];
const PRIVATE_FINANCE_OPTIONS = ['Yes', 'No'];
const BUSINESS_ACTIVITY_OPTIONS = [
  'Trading',
  'Services',
  'Manufacturing',
  'Others',
];
const areaOfPremisesOptions = ['<250 Sq.ft', '250 to 400 Sq.ft', '>400 Sq.ft'];
const localityOptions = ['Residential', 'Commercial', 'Industry', 'Corporate'];

const BusinessMiscellaneous: React.FC<BusinessMiscellaneousProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {errors},
  } = useForm<BusinessMiscellaneousFormData>({
    defaultValues: initialData || {
      ownershipOfPremises: '',
      rentalAmount: '',
      yearsInCurrentPremises: '',
      stockSeen: '',
      employeesSeen: '',
      otherSetupObserved: '',
      // illegalSetupObserved: '',
      politicallyConnected: '',
      // privateFinanceOrChits: '',
      businessActivity: '',
      // businessActivityOther: '',
      areaOfPremises: '',
      localityOfBusiness: '',
      employeesUnderApplicant: '',
    },
  });

  React.useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const ownershipOfPremises = watch('ownershipOfPremises');
  const businessActivity = watch('businessActivity');

  // ActionSheet refs
  const ownershipSheetRef = useRef<ActionSheetRef>(null);
  const stockSeenSheetRef = useRef<ActionSheetRef>(null);
  // const employeesSeenSheetRef = useRef<ActionSheetRef>(null);
  const illegalSetupSheetRef = useRef<ActionSheetRef>(null);
  const politicallyConnectedSheetRef = useRef<ActionSheetRef>(null);
  const privateFinanceSheetRef = useRef<ActionSheetRef>(null);
  const businessActivitySheetRef = useRef<ActionSheetRef>(null);
  const areaOfPremisesSheetRef = useRef<ActionSheetRef>(null);
  const locationTypeSheetRef = useRef<ActionSheetRef>(null);

  // Show ActionSheet functions
  const showOwnershipSheet = () => ownershipSheetRef.current?.show();
  const showStockSeenSheet = () => stockSeenSheetRef.current?.show();
  // const showEmployeesSeenSheet = () => employeesSeenSheetRef.current?.show();
  const showIllegalSetupSheet = () => illegalSetupSheetRef.current?.show();
  const showPoliticallyConnectedSheet = () =>
    politicallyConnectedSheetRef.current?.show();
  const showPrivateFinanceSheet = () => privateFinanceSheetRef.current?.show();
  const showBusinessActivitySheet = () =>
    businessActivitySheetRef.current?.show();
  const showAreaOfPremises = () => areaOfPremisesSheetRef.current?.show();
  const showLocationType = () => locationTypeSheetRef.current?.show();

  return (
    <ScrollView style={styles.container}>
      {/* 19. Stock seen (select) */}
      <Controller
        control={control}
        name="stockSeen"
        rules={{required: 'Stock seen is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Stock Seen</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showStockSeenSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.stockSeen && (
              <Text style={styles.errorText}>{errors.stockSeen.message}</Text>
            )}
          </View>
        )}
      />

      {/* 16. Ownership of the Business Premises (select) */}
      <Controller
        control={control}
        name="ownershipOfPremises"
        rules={{required: 'Ownership is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ownership of Business Premises</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showOwnershipSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select ownership'}
              </Text>
            </TouchableOpacity>
            {errors.ownershipOfPremises && (
              <Text style={styles.errorText}>
                {errors.ownershipOfPremises.message}
              </Text>
            )}
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
                placeholder="Enter rental paid"
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

      <Controller
        control={control}
        name="areaOfPremises"
        rules={{required: 'This field is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Area of Premises</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showAreaOfPremises}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.areaOfPremises && (
              <Text style={styles.errorText}>
                {errors.areaOfPremises.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="localityOfBusiness"
        rules={{required: 'This field is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Locality of business</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showLocationType}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.localityOfBusiness && (
              <Text style={styles.errorText}>
                {errors.localityOfBusiness.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* 18. No: of Years in the current Business premises (input) */}
      <Controller
        control={control}
        name="yearsInCurrentPremises"
        rules={{required: 'No. of years is required'}}
        render={({field: {value, onChange, onBlur}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>No. of Years in Business Premises</Text>
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

      <Controller
        control={control}
        name="employeesUnderApplicant"
        rules={{required: 'Employees under applicant is required'}}
        render={({field: {value, onBlur, onChange}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Employees working under applicant</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of employees"
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.employeesUnderApplicant && (
              <Text style={styles.errorText}>
                {errors.employeesUnderApplicant.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* 20. Employees seen (select) */}
      <Controller
        control={control}
        name="employeesSeen"
        rules={{required: 'Employees seen is required'}}
        render={({field: {value, onBlur, onChange}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Employees Seen</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of employees"
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.text.disabled}
            />
            {errors.employeesSeen && (
              <Text style={styles.errorText}>
                {errors.employeesSeen.message}
              </Text>
            )}
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
              style={[styles.input, styles.textArea]}
              placeholder="Enter details (optional)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.text.disabled}
            />
          </View>
        )}
      />
      {/* 22. Any ILLEGAL setup was observed (select) */}
      {/* <Controller
        control={control}
        name="illegalSetupObserved"
        rules={{required: 'This field is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Any ILLEGAL Setup Observed</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showIllegalSetupSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.illegalSetupObserved && (
              <Text style={styles.errorText}>
                {errors.illegalSetupObserved.message}
              </Text>
            )}
          </View>
        )}
      /> */}
      {/* 23. Is applicant or any family member politically connected (select) */}
      <Controller
        control={control}
        name="politicallyConnected"
        rules={{required: 'This field is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Is Applicant or Any Family Member Politically Connected?
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showPoliticallyConnectedSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.politicallyConnected && (
              <Text style={styles.errorText}>
                {errors.politicallyConnected.message}
              </Text>
            )}
          </View>
        )}
      />
      {/* 24. As per neighbor check, any collections or private finance or private chits are being operated from the premises or by the applicant (select) */}
      {/* <Controller
        control={control}
        name="privateFinanceOrChits"
        rules={{required: 'This field is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Any Collections/Private Finance/Chits Operated from Premises or by
              Applicant (as per neighbor check)
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showPrivateFinanceSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select option'}
              </Text>
            </TouchableOpacity>
            {errors.privateFinanceOrChits && (
              <Text style={styles.errorText}>
                {errors.privateFinanceOrChits.message}
              </Text>
            )}
          </View>
        )}
      /> */}
      {/* 25. Business activity (Trading/Services/Manufacturing/Others, with 'others' input) */}
      <Controller
        control={control}
        name="businessActivity"
        rules={{required: 'Business activity is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business Activity</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showBusinessActivitySheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select activity'}
              </Text>
            </TouchableOpacity>
            {errors.businessActivity && (
              <Text style={styles.errorText}>
                {errors.businessActivity.message}
              </Text>
            )}
          </View>
        )}
      />
      {/* {businessActivity === 'Others' && (
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
      )} */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      {/* ActionSheets */}
      <ActionSheet ref={ownershipSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Ownership Type</Text>
          {OWNERSHIP_OPTIONS.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('ownershipOfPremises', type);
                ownershipSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet ref={stockSeenSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Stock Seen?</Text>
          {STOCK_SEEN_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('stockSeen', option);
                stockSeenSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      {/* <ActionSheet
        ref={employeesSeenSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Number of Employees Seen</Text>
          {EMPLOYEES_SEEN_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('employeesSeen', option);
                employeesSeenSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet> */}

      <ActionSheet
        ref={illegalSetupSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Illegal Setup Observed?</Text>
          {ILLEGAL_SETUP_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('illegalSetupObserved', option);
                illegalSetupSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={areaOfPremisesSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Area of premises</Text>
          {areaOfPremisesOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('areaOfPremises', option);
                areaOfPremisesSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={locationTypeSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Locality of Business</Text>
          {localityOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('localityOfBusiness', option);
                locationTypeSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={politicallyConnectedSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Politically Connected?</Text>
          {POLITICALLY_CONNECTED_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('politicallyConnected', option);
                politicallyConnectedSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={privateFinanceSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>
            Private Finance/Chits Operated?
          </Text>
          {PRIVATE_FINANCE_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('privateFinanceOrChits', option);
                privateFinanceSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={businessActivitySheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Business Activity</Text>
          {BUSINESS_ACTIVITY_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('businessActivity', option);
                businessActivitySheetRef.current?.hide();
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

export default BusinessMiscellaneous;
