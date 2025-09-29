import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm} from 'react-hook-form';
import {colors} from '../../constants/colors';
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';

export type AxisCommonPointsFormData = {
  turnoverAndMargin: string;
  salesFluctuations: string;
  customerIdentityEstablishedDuringPD: string;
  charteredAcDetails: string;
  loansTakenFromFamilyFriendsBusinessAssociates: string;
};

type AxisCommonPointsProps = {
  formData: any;
  onSubmit: any;
};

const AxisCommonPoints: React.FC<AxisCommonPointsProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AxisCommonPointsFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: AxisCommonPointsFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <TextAreaFormItem
        data={{
          title: 'Turnover and Margin',
          key: 'turnoverAndMargin',
          control,
          errors,
          required: true,
          placeholder: 'Describe turnover and margin details...',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Sales Fluctuations',
          key: 'salesFluctuations',
          control,
          errors,
          required: true,
          placeholder: 'Describe sales fluctuations and patterns...',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Customer Identity Established During PD',
          key: 'customerIdentityEstablishedDuringPD',
          control,
          errors,
          required: true,
          placeholder:
            'Describe customer identity established during personal discussion...',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Chartered Ac Details',
          key: 'charteredAcDetails',
          control,
          errors,
          required: true,
          placeholder: 'Enter chartered accountant details...',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Loans Taken from Family, Friends, Business Associates, etc',
          key: 'loansTakenFromFamilyFriendsBusinessAssociates',
          control,
          errors,
          required: true,
          placeholder:
            'Describe loans taken from family, friends, business associates, etc...',
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

export default AxisCommonPoints;
