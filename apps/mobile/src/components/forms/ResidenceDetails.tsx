import React, {useState, useRef} from 'react';
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
import {ResidenceDetailsFormData} from '../../types/verification';
import {colors} from '../../constants/colors';

interface ResidenceDetailsProps {
  onSubmit: (data: ResidenceDetailsFormData) => void;
  initialData?: ResidenceDetailsFormData;
}

const RESIDENCE_STATUS_OPTIONS = ['Owned', 'Rented', 'Leased'];
const RESIDENCE_TYPE_OPTIONS = ['House', 'Apartment', 'Villa', 'Others'];
const QUALITY_OPTIONS = ['Excellent', 'Good', 'Average', 'Poor'];
const LOCATION_CATEGORY_OPTIONS = ['Urban', 'Semi-Urban', 'Rural'];
const LOCALITY_TYPE_OPTIONS = ['Residential', 'Commercial', 'Mixed'];
const ACCESSIBILITY_OPTIONS = ['Easy', 'Moderate', 'Difficult'];
const YES_NO_OPTIONS = ['Yes', 'No'];

const ResidenceDetails: React.FC<ResidenceDetailsProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
  } = useForm<ResidenceDetailsFormData>({
    defaultValues: initialData || {
      residenceStatus: '',
      residenceType: '',
      specifyResidenceType: '',
      standardOfLiving: '',
      // localityType: '',
      accessibility: '',
      // nameBoardVisible: '',
      rentDetails: '',
      yearsAtCurrentAddress: '',
      politicalSymbolVisible: '',
    },
  });

  const residenceStatusRef = useRef<ActionSheetRef>(null);
  const residenceTypeRef = useRef<ActionSheetRef>(null);
  const constructionQualityRef = useRef<ActionSheetRef>(null);
  const standardOfLivingRef = useRef<ActionSheetRef>(null);
  const locationCategoryRef = useRef<ActionSheetRef>(null);
  const localityTypeRef = useRef<ActionSheetRef>(null);
  const accessibilityRef = useRef<ActionSheetRef>(null);
  const nameBoardVisibleRef = useRef<ActionSheetRef>(null);
  const politicalSymbolVisibleRef = useRef<ActionSheetRef>(null);
  const [showRentDetails, setShowRentDetails] = useState(false);

  const residenceStatus = watch('residenceStatus');
  const residenceType = watch('residenceType');

  const handleSelect = (
    value: string,
    field: keyof ResidenceDetailsFormData,
    ref: React.RefObject<ActionSheetRef | null>,
  ) => {
    setValue(field, value);
    if (ref.current) {
      ref.current.hide();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Controller
        control={control}
        rules={{required: 'Residence status is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Residence Status*</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => residenceStatusRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select residence status'}
              </Text>
            </TouchableOpacity>
            {errors.residenceStatus && (
              <Text style={styles.errorText}>
                {errors.residenceStatus.message}
              </Text>
            )}
          </View>
        )}
        name="residenceStatus"
      />

      {residenceStatus === 'Rented' && (
        <Controller
          control={control}
          rules={{
            required: 'Rent is required',
            validate: value => {
              if (isNaN(Number(value))) {
                return 'Please enter a valid number';
              }
              return true;
            },
          }}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rent per month*</Text>
              <TextInput
                style={[styles.input]}
                onChangeText={text => {
                  // Only update if the entire string is digits
                  if (/^\d*$/.test(text)) {
                    onChange(text);
                  }
                  // Otherwise ignore the input
                }}
                value={value}
                placeholder="Enter rent"
                placeholderTextColor={colors.text.disabled}
                keyboardType="numeric" // Show numeric keyboard on mobile
                inputMode="decimal" // Modern alternative to keyboardType
              />
              {errors.rentDetails && (
                <Text style={styles.errorText}>
                  {errors.rentDetails.message}
                </Text>
              )}
            </View>
          )}
          name="rentDetails"
        />
      )}

      <Controller
        control={control}
        rules={{required: 'Residence type is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Type of Residence*</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => residenceTypeRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select residence type'}
              </Text>
            </TouchableOpacity>
            {errors.residenceType && (
              <Text style={styles.errorText}>
                {errors.residenceType.message}
              </Text>
            )}
          </View>
        )}
        name="residenceType"
      />

      {residenceType === 'Others' && (
        <Controller
          control={control}
          rules={{required: 'Specify Residence type is required'}}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rent Details*</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                onChangeText={onChange}
                value={value}
                placeholder="Specify residence type"
                multiline
                numberOfLines={1}
                placeholderTextColor={colors.text.disabled}
              />
              {errors.rentDetails && (
                <Text style={styles.errorText}>
                  {errors.rentDetails.message}
                </Text>
              )}
            </View>
          )}
          name="specifyResidenceType"
        />
      )}

      <Controller
        control={control}
        rules={{required: 'Standard of living is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Standard of Living*</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => standardOfLivingRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select standard of living'}
              </Text>
            </TouchableOpacity>
            {errors.standardOfLiving && (
              <Text style={styles.errorText}>
                {errors.standardOfLiving.message}
              </Text>
            )}
          </View>
        )}
        name="standardOfLiving"
      />

      {/* <Controller
        control={control}
        rules={{required: 'Locality type is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Locality Type*</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => localityTypeRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select locality type'}
              </Text>
            </TouchableOpacity>
            {errors.localityType && (
              <Text style={styles.errorText}>
                {errors.localityType.message}
              </Text>
            )}
          </View>
        )}
        name="localityType"
      /> */}

      <Controller
        control={control}
        rules={{required: 'Accessibility is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Accessibility*</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => accessibilityRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select accessibility'}
              </Text>
            </TouchableOpacity>
            {errors.accessibility && (
              <Text style={styles.errorText}>
                {errors.accessibility.message}
              </Text>
            )}
          </View>
        )}
        name="accessibility"
      />

      {/* <Controller
        control={control}
        rules={{required: 'House area is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Approx. Area of House (Sq ft)*</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => {
                if (/^\d*\.?\d{0,1}$/.test(text)) {
                  onChange(text);
                }
              }}
              value={value}
              placeholder="Enter house area"
              keyboardType="decimal-pad"
            />
            {errors.houseArea && (
              <Text style={styles.errorText}>{errors.houseArea.message}</Text>
            )}
          </View>
        )}
        name="houseArea"
      /> */}

      <Controller
        control={control}
        rules={{required: 'Years at current address is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>No. of Years at Current Address*</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => {
                if (/^\d*\.?\d{0,1}$/.test(text)) {
                  onChange(text);
                }
              }}
              value={value}
              placeholder="Enter number of years"
              keyboardType="decimal-pad"
            />
            {errors.yearsAtCurrentAddress && (
              <Text style={styles.errorText}>
                {errors.yearsAtCurrentAddress.message}
              </Text>
            )}
          </View>
        )}
        name="yearsAtCurrentAddress"
      />

      {/* <Controller
        control={control}
        rules={{required: 'Nameplate visibility is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nameplate Visible?*</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => nameBoardVisibleRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select visibility'}
              </Text>
            </TouchableOpacity>
            {errors.nameBoardVisible && (
              <Text style={styles.errorText}>
                {errors.nameBoardVisible.message}
              </Text>
            )}
          </View>
        )}
        name="nameBoardVisible"
      /> */}

      <Controller
        control={control}
        rules={{required: 'Political symbol visibility is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Political Symbol Visible?*</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => politicalSymbolVisibleRef.current?.show()}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select visibility'}
              </Text>
            </TouchableOpacity>
            {errors.politicalSymbolVisible && (
              <Text style={styles.errorText}>
                {errors.politicalSymbolVisible.message}
              </Text>
            )}
          </View>
        )}
        name="politicalSymbolVisible"
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      <ActionSheet
        ref={residenceStatusRef}
        containerStyle={styles.actionSheet}
        gestureEnabled={true}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Residence Status</Text>
          {RESIDENCE_STATUS_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'residenceStatus', residenceStatusRef)
              }>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={residenceTypeRef}
        containerStyle={styles.actionSheet}
        gestureEnabled={true}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Residence Type</Text>
          {RESIDENCE_TYPE_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'residenceType', residenceTypeRef)
              }>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={standardOfLivingRef}
        containerStyle={styles.actionSheet}
        gestureEnabled={true}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Standard of Living</Text>
          {QUALITY_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'standardOfLiving', standardOfLivingRef)
              }>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={localityTypeRef}
        containerStyle={styles.actionSheet}
        gestureEnabled={true}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Locality Type</Text>
          {LOCALITY_TYPE_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'localityType', localityTypeRef)
              }>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={accessibilityRef}
        containerStyle={styles.actionSheet}
        gestureEnabled={true}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Accessibility</Text>
          {ACCESSIBILITY_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'accessibility', accessibilityRef)
              }>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={nameBoardVisibleRef}
        containerStyle={styles.actionSheet}
        gestureEnabled={true}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Visibility</Text>
          {YES_NO_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(option, 'nameBoardVisible', nameBoardVisibleRef)
              }>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={politicalSymbolVisibleRef}
        containerStyle={styles.actionSheet}
        gestureEnabled={true}>
        <View style={[styles.actionSheetContent, {paddingBottom: 50}]}>
          <Text style={styles.actionSheetTitle}>Select Visibility</Text>
          {YES_NO_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.actionSheetItem}
              onPressIn={() =>
                handleSelect(
                  option,
                  'politicalSymbolVisible',
                  politicalSymbolVisibleRef,
                )
              }>
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

export default ResidenceDetails;
