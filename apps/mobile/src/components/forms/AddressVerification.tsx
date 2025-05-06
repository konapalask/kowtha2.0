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
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {AddressVerificationFormData} from '../../types/verification';
import {colors} from '../../constants/colors';

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
      addressType: '',
      addressCategory: '',
      addressSubCategory: '',
      addressDetails: '',
      geoTag: '',
    },
  });

  const addressTypeSheetRef = useRef<ActionSheetRef>(null);
  const addressCategorySheetRef = useRef<ActionSheetRef>(null);
  const addressSubCategorySheetRef = useRef<ActionSheetRef>(null);

  const addressTypes = ['Residence', 'Office', 'Business', 'Other'];
  const addressCategories = ['Urban', 'Rural', 'Semi-Urban'];
  const addressSubCategories = [
    'Metropolitan',
    'City',
    'Town',
    'Village',
    'Industrial Area',
    'Commercial Area',
  ];

  const showAddressTypeSheet = () => {
    addressTypeSheetRef.current?.show();
  };

  const showAddressCategorySheet = () => {
    addressCategorySheetRef.current?.show();
  };

  const showAddressSubCategorySheet = () => {
    addressSubCategorySheetRef.current?.show();
  };

  return (
    <ScrollView style={styles.container}>
      <Controller
        control={control}
        name="addressType"
        rules={{required: 'Address type is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address Type</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showAddressTypeSheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Address Type'}
              </Text>
            </TouchableOpacity>
            {errors.addressType && (
              <Text style={styles.errorText}>{errors.addressType.message}</Text>
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
        name="addressSubCategory"
        rules={{required: 'Address sub-category is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address Sub-Category</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={showAddressSubCategorySheet}>
              <Text
                style={value ? styles.selectButtonText : styles.placeholder}>
                {value || 'Select Address Sub-Category'}
              </Text>
            </TouchableOpacity>
            {errors.addressSubCategory && (
              <Text style={styles.errorText}>
                {errors.addressSubCategory.message}
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
        name="geoTag"
        rules={{required: 'Geo tag is required'}}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Geo Tag</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter geo tag"
              value={value}
              onChangeText={onChange}
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

      <ActionSheet
        ref={addressTypeSheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Select Address Type</Text>
          {addressTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('addressType', type);
                addressTypeSheetRef.current?.hide();
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
        ref={addressSubCategorySheetRef}
        containerStyle={styles.actionSheet}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>
            Select Address Sub-Category
          </Text>
          {addressSubCategories.map((subCategory, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionSheetItem}
              onPressIn={() => {
                setValue('addressSubCategory', subCategory);
                addressSubCategorySheetRef.current?.hide();
              }}>
              <Text style={styles.actionSheetItemText}>{subCategory}</Text>
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
    backgroundColor: colors.button.primary.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: colors.button.primary.text,
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

export default AddressVerification;
