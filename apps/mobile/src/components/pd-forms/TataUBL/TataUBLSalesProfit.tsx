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
import {InputFormItem} from '../../../lib/InputFormItem';
import {SelectFormItem} from '../../../lib/SelectFormItem';

export type TataUBLSalesProfitFormData = {
  turnoverPrevFiscalYear: string;
  expectedTurnoverCurrentFiscalYear: string;
  monthlyTurnoverSales: string;
  netMonthlyIncome: string;
  profitMargin: string;
  covidEffectOnTurnover: string;
  businessRunningSameSpeedAfterLockdown: string;
  cashSalesPercentage: string;
};

type TataUBLSalesProfitProps = {
  formData: TataUBLSalesProfitFormData;
  onSubmit: (data: TataUBLSalesProfitFormData) => void;
};

const YES_NO_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
];

const TataUBLSalesProfit: React.FC<TataUBLSalesProfitProps> = ({
  formData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TataUBLSalesProfitFormData>({
    defaultValues: formData,
  });

  const onFormSubmit = (data: TataUBLSalesProfitFormData) => {
    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Sales & Profit Details</Text>

      <InputFormItem
        data={{
          title: 'Turnover (prev fiscal year)',
          key: 'turnoverPrevFiscalYear',
          control,
          errors,
          required: true,
          placeholder: 'Enter previous fiscal year turnover',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Expected Turnover for Current Fiscal Year',
          key: 'expectedTurnoverCurrentFiscalYear',
          control,
          errors,
          required: true,
          placeholder: 'Enter expected current fiscal year turnover',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Monthly Turnover/Sales',
          key: 'monthlyTurnoverSales',
          control,
          errors,
          required: true,
          placeholder: 'Enter monthly turnover/sales',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Net Monthly Income',
          key: 'netMonthlyIncome',
          control,
          errors,
          required: true,
          placeholder: 'Enter net monthly income',
          keyboardType: 'numeric',
        }}
      />

      <InputFormItem
        data={{
          title: 'Profit Margin',
          key: 'profitMargin',
          control,
          errors,
          required: true,
          placeholder: 'Enter profit margin',
          keyboardType: 'numeric',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Is there any effect on Turnover due to COVID',
          key: 'covidEffectOnTurnover',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <SelectFormItem
        data={{
          title: 'After Lockdown is Business Running on Same Speed',
          key: 'businessRunningSameSpeedAfterLockdown',
          control,
          errors,
          required: true,
          options: YES_NO_OPTIONS,
        }}
      />

      <InputFormItem
        data={{
          title: 'Cash Sales (% of Total Turnover)',
          key: 'cashSalesPercentage',
          control,
          errors,
          required: true,
          placeholder: 'Enter cash sales percentage',
          keyboardType: 'numeric',
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

export default TataUBLSalesProfit;
