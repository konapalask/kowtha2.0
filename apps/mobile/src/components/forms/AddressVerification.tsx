import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {useForm, Controller, useWatch} from 'react-hook-form';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {AddressVerificationFormData} from '../../types/verification';
import {colors} from '../../constants/colors';
import GetLocation from 'react-native-get-location';

type AddressVerificationProps = {
  onSubmit: (data: AddressVerificationFormData) => void;
  initialData?: AddressVerificationFormData;
};

const AddressVerification: React.FC<AddressVerificationProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<AddressVerificationFormData>({
    defaultValues: initialData || {
      address: '',
      addressCategory: '',
      addressDetails: '',
      numberOfYearsAtCurrentResidence: '',
      previousAddress: '',
      previousAddressYears: '',
      numberOfYearsAtCurrentCity: '',
      previousCity: '',
      numberOfYearsAtPreviousCity: '',
      reasonForChange: '',
      geoTag: '',
    },
  });

  const addressSheetRef = useRef<ActionSheetRef>(null);
  const addressCategorySheetRef = useRef<ActionSheetRef>(null);
  const yearsAtResidenceSheetRef = useRef<ActionSheetRef>(null);
  const yearsInCitySheetRef = useRef<ActionSheetRef>(null);

  const addressTypes = ['Residence', 'Office', 'Business', 'Other'];
  const addressCategories = ['Urban', 'Rural', 'Semi-Urban'];
  const yearsAtResidenceOptions: Array<
    AddressVerificationFormData['numberOfYearsAtCurrentResidence']
  > = ['<=1year', '1-3 years', '3-5 years', '>5 years'];
  const yearsInCityOptions: Array<
    AddressVerificationFormData['numberOfYearsAtCurrentCity']
  > = ['<=3 years', '>3 years'];

  const watchedNumberOfYearsAtCurrentResidence = useWatch({
    control,
    name: 'numberOfYearsAtCurrentResidence',
  });
  const watchedNumberOfYearsAtCurrentCity = useWatch({
    control,
    name: 'numberOfYearsAtCurrentCity',
  });

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        const {latitude, longitude} = location;
        setValue('geoTag', `${latitude},${longitude}`);
      })
      .catch(error => {
        console.error('Error getting location:', error);
        setValue('geoTag', 'Location not available');
      });
  }, [setValue]);

  const showAddressSheet = () => {
    addressSheetRef.current?.show();
  };

  const showAddressCategorySheet = () => {
    addressCategorySheetRef.current?.show();
  };

  const showYearsAtResidenceSheet = () => {
    yearsAtResidenceSheetRef.current?.show();
  };

  const showYearsInCitySheet = () => {
    yearsInCitySheetRef.current?.show();
  };

  return (
    <ScrollView style={styles.container}>
      <Controller
        control={control}
        name="address"
        rules={{required: 'Address type is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address Type</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showAddressSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Address Type'}
              </Text>
            </TouchableOpacity>
            {errors.address && (
              <Text style={styles.errorText}>{errors.address.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="addressCategory"
        rules={{required: 'Address category is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address Category</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showAddressCategorySheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Address Category'}
              </Text>
            </TouchableOpacity>
            {errors.addressCategory && (
              <Text style={styles.errorText}>
                {errors.addressCategory.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="addressDetails"
        rules={{required: 'Address details are required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter address details"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
            />
            {errors.addressDetails && (
              <Text style={styles.errorText}>
                {errors.addressDetails.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="numberOfYearsAtCurrentResidence"
        rules={{required: 'Number of years at current residence is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Number of Years at Current Residence
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showYearsAtResidenceSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select duration'}
              </Text>
            </TouchableOpacity>
            {errors.numberOfYearsAtCurrentResidence && (
              <Text style={styles.errorText}>
                {errors.numberOfYearsAtCurrentResidence.message}
              </Text>
            )}
          </View>
        )}
      />

      {watchedNumberOfYearsAtCurrentResidence === '<=1year' && (
        <>
          <Controller
            control={control}
            name="previousAddress"
            rules={{
              required: 'Previous address is required if stay is <=1 year',
            }}
            render={({field: {onChange, value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Previous Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter previous address"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                />
                {errors.previousAddress && (
                  <Text style={styles.errorText}>
                    {errors.previousAddress.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="previousAddressYears"
            rules={{
              required:
                'Years at previous address is required if stay at current is <=1 year',
            }}
            render={({field: {onChange, value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Number of Years at Previous Address
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter number of years"
                  value={value}
                  onChangeText={text => {
                    const num = parseInt(text) || 0;
                    onChange(Math.max(0, num).toString());
                  }}
                  keyboardType="numeric"
                />
                {errors.previousAddressYears && (
                  <Text style={styles.errorText}>
                    {errors.previousAddressYears.message}
                  </Text>
                )}
              </View>
            )}
          />
        </>
      )}

      <Controller
        control={control}
        name="numberOfYearsAtCurrentCity"
        rules={{required: 'Number of years at current city is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of Years in Current City</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showYearsInCitySheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select duration'}
              </Text>
            </TouchableOpacity>
            {errors.numberOfYearsAtCurrentCity && (
              <Text style={styles.errorText}>
                {errors.numberOfYearsAtCurrentCity.message}
              </Text>
            )}
          </View>
        )}
      />

      {watchedNumberOfYearsAtCurrentCity === '<=3 years' && (
        <>
          <Controller
            control={control}
            name="previousCity"
            rules={{
              required:
                'Previous city is required if stay in current city is <=3 years',
            }}
            render={({field: {onChange, value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Previous City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter previous city"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.previousCity && (
                  <Text style={styles.errorText}>
                    {errors.previousCity.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="numberOfYearsAtPreviousCity"
            rules={{
              required:
                'Years at previous city is required if stay in current city is <=3 years',
            }}
            render={({field: {onChange, value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Number of Years in Previous City
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter number of years"
                  value={value}
                  onChangeText={text => {
                    const num = parseInt(text) || 0;
                    onChange(Math.max(0, num).toString());
                  }}
                  keyboardType="numeric"
                />
                {errors.numberOfYearsAtPreviousCity && (
                  <Text style={styles.errorText}>
                    {errors.numberOfYearsAtPreviousCity.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="reasonForChange"
            rules={{
              required:
                'Reason for change is required if stay in current city is <=3 years',
            }}
            render={({field: {onChange, value}}) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Reason for Change</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter reason for change"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                />
                {errors.reasonForChange && (
                  <Text style={styles.errorText}>
                    {errors.reasonForChange.message}
                  </Text>
                )}
              </View>
            )}
          />
        </>
      )}

      <Controller
        control={control}
        name="geoTag"
        rules={{required: 'Geo tag is required'}}
        render={({field: {value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Geo Tag</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={value}
              editable={false}
              placeholder="Capturing location..."
              placeholderTextColor={colors.text.disabled}
            />
            {errors.geoTag && (
              <Text style={styles.errorText}>{errors.geoTag.message}</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      <ActionSheet ref={addressSheetRef} containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Address Type</Text>
          {addressTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('address', type);
                addressSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={addressCategorySheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Address Category</Text>
          {addressCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('addressCategory', category);
                addressCategorySheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={yearsAtResidenceSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>
            Select Years at Current Residence
          </Text>
          {yearsAtResidenceOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('numberOfYearsAtCurrentResidence', option);
                yearsAtResidenceSheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        ref={yearsInCitySheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>
            Select Years in Current City
          </Text>
          {yearsInCityOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('numberOfYearsAtCurrentCity', option);
                yearsInCitySheetRef.current?.hide();
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
  readOnlyInput: {
    backgroundColor: colors.input.disabled,
    color: colors.text.disabled,
  },
});

export default AddressVerification;
