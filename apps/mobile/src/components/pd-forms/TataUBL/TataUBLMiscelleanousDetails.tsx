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
import {TextAreaFormItem} from '../../../lib/TextAreaFormItem';

export type TataUBLMiscelleanousDetailsFormData = {
  endUseOfProposedLoan: string;
  politicalConnections: string;
  anyCourtCases: string;
  businessBelongsToWhichIndustry: string;
};

type TataUBLMiscelleanousDetailsProps = {
  formData: TataUBLMiscelleanousDetailsFormData;
  onSubmit: (data: TataUBLMiscelleanousDetailsFormData) => void;
};

const TataUBLMiscelleanousDetails: React.FC<
  TataUBLMiscelleanousDetailsProps
> = ({formData, onSubmit}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLMiscelleanousDetailsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: TataUBLMiscelleanousDetailsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Miscellaneous Details</Text>

      <TextAreaFormItem
        data={{
          title: 'End Use of Proposed Loan',
          key: 'endUseOfProposedLoan',
          control,
          errors,
          required: true,
          placeholder: 'Enter end use of the proposed loan',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Political Connections',
          key: 'politicalConnections',
          control,
          errors,
          required: true,
          placeholder: 'Enter details about political connections',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Any Court Cases',
          key: 'anyCourtCases',
          control,
          errors,
          required: true,
          placeholder: 'Enter details about any court cases',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Business Belongs to Which Industry',
          key: 'businessBelongsToWhichIndustry',
          control,
          errors,
          required: true,
          placeholder: 'Enter the industry this business belongs to',
        }}
      />

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

export default TataUBLMiscelleanousDetails;
