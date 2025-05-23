import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import {colors} from '../../constants/colors';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Reference {
  name: string;
  address: string;
  designation: string;
  yearsKnown: string;
  contactNumber: string;
  emailAddress: string;
}

interface ColleagueReferencesFormData {
  references: Reference[];
}

interface Props {
  initialData?: Partial<ColleagueReferencesFormData>;
  onSubmit: (data: ColleagueReferencesFormData) => void;
}

const validationSchema = yup.object().shape({
  references: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Name is required'),
        address: yup.string().required('Address is required'),
        designation: yup.string().required('Designation is required'),
        yearsKnown: yup.string().required('Number of Years Known is required'),
        contactNumber: yup
          .string()
          .required('Contact Number is required')
          .matches(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits')
          .test(
            'no-symbols',
            'Contact number should not contain symbols',
            value => {
              return /^[0-9]+$/.test(value);
            },
          ),
        emailAddress: yup
          .string()
          .email('Invalid email address')
          .required('Email Address is required'),
      }),
    )
    .required('At least one reference is required'),
});

const ColleagueReferences: React.FC<Props> = ({initialData, onSubmit}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ColleagueReferencesFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      references: initialData?.references || [
        {
          name: '',
          address: '',
          designation: '',
          yearsKnown: '',
          contactNumber: '',
          emailAddress: '',
        },
      ],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'references',
  });

  const onFormSubmit = (data: ColleagueReferencesFormData) => {
    onSubmit(data);
  };

  const renderReferenceFields = (index: number) => {
    return (
      <View key={index} style={styles.referenceContainer}>
        <View style={styles.referenceHeader}>
          <Text style={styles.referenceTitle}>Reference {index + 1}</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => remove(index)}
              style={styles.removeButton}>
              <Icon name="delete" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        <Controller
          control={control}
          name={`references.${index}.name`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.references?.[index]?.name && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
              />
              {errors.references?.[index]?.name && (
                <Text style={styles.errorText}>
                  {errors.references[index]?.name?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`references.${index}.address`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.references?.[index]?.address && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
              />
              {errors.references?.[index]?.address && (
                <Text style={styles.errorText}>
                  {errors.references[index]?.address?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`references.${index}.designation`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Designation</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.references?.[index]?.designation && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
              />
              {errors.references?.[index]?.designation && (
                <Text style={styles.errorText}>
                  {errors.references[index]?.designation?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`references.${index}.yearsKnown`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>No. of Years Known</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.references?.[index]?.yearsKnown && styles.inputError,
                  {color: colors.text.primary},
                ]}
                value={value}
                onChangeText={text => {
                  // Allow numbers with up to 1 decimal place
                  if (/^\d*\.?\d{0,1}$/.test(text)) {
                    onChange(text);
                  }
                }}
                keyboardType="decimal-pad"
                placeholder="Enter number of years"
                placeholderTextColor={colors.text.disabled}
              />
              {errors.references?.[index]?.yearsKnown && (
                <Text style={styles.errorText}>
                  {errors.references[index]?.yearsKnown?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`references.${index}.contactNumber`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.references?.[index]?.contactNumber &&
                    styles.inputError,
                  {color: colors.text.primary},
                ]}
                value={value}
                onChangeText={text => {
                  // Only allow numbers and limit to 10 digits
                  const numericValue = text.replace(/[^0-9]/g, '').slice(0, 10);
                  onChange(numericValue);
                }}
                keyboardType="numeric"
                maxLength={10}
                placeholder="Enter 10 digit number"
                placeholderTextColor={colors.text.disabled}
              />
              {errors.references?.[index]?.contactNumber && (
                <Text style={styles.errorText}>
                  {errors.references[index]?.contactNumber?.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={`references.${index}.emailAddress`}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.references?.[index]?.emailAddress && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.references?.[index]?.emailAddress && (
                <Text style={styles.errorText}>
                  {errors.references[index]?.emailAddress?.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {fields.map((field, index) => renderReferenceFields(index))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          append({
            name: '',
            address: '',
            designation: '',
            yearsKnown: '',
            contactNumber: '',
            emailAddress: '',
          })
        }>
        <Text style={styles.addButtonText}>Add Another Reference</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onFormSubmit)}>
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
  referenceContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  referenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  referenceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text.primary,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: colors.button.secondary.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  addButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    borderColor: colors.button.primary.background,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 40,
  },
  submitButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 4,
  },
});

export default ColleagueReferences;
