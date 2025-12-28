import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm} from 'react-hook-form';
import {colors} from '../../../constants/colors';

export type TataBasicDetailsFormData = {
  nameOfApplicant: string;
  nameOfEntity: string;
  nameOfCoApplicants: string;
};

type TataBasicDetailsProps = {
  formData: TataBasicDetailsFormData;
  onSubmit: (data: TataBasicDetailsFormData) => void;
};

const TataUBLBasicDetails: React.FC<TataBasicDetailsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataBasicDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: TataBasicDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Basic Information</Text>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Name of Applicant *</Text>
        <Text style={styles.readonlyText}>
          {formData?.nameOfApplicant || 'N/A'}
        </Text>
      </View>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Name of Entity *</Text>
        <Text style={styles.readonlyText}>
          {formData?.nameOfEntity || 'N/A'}
        </Text>
      </View>

      <View style={styles.readonlyField}>
        <Text style={styles.fieldLabel}>Name of Co-applicants *</Text>
        <Text style={styles.readonlyText}>
          {formData?.nameOfCoApplicants || 'N/A'}
        </Text>
      </View>

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: colors.text.primary,
  },
  readonlyField: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text.primary,
  },
  readonlyText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: colors.button.primary.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: colors.button.primary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TataUBLBasicDetails;
