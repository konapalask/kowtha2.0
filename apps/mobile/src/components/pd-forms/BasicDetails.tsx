import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../constants/colors';

interface BasicDetailsData {
  applicationNumber: string;
  applicantName: string;
  businessName: string;
  loanAmount: number | string;
  mobileNumber: string;
  address: string;
  bankName: string;
}

interface BasicDetailsProps {
  formData: BasicDetailsData;
  onSubmit: any;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({formData, onSubmit}) => {
  const renderDetailRow = (label: string, value: string) => (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value || '-'}</Text>
      </View>
    </View>
  );

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderDetailRow('Application Number', formData.applicationNumber)}
        {renderDetailRow('Name of the Applicant', formData.applicantName)}
        {renderDetailRow('Name of the Business', formData.businessName)}
        {renderDetailRow('Loan Amount', `₹${formData?.loanAmount ?? '-'}`)}
        {renderDetailRow('Mobile Number', formData.mobileNumber)}
        {renderDetailRow('Business Address', formData.address)}
        {renderDetailRow('Bank Name', formData.bankName)}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    padding: 16,
  },
  detailRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  valueContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: {
    fontSize: 16,
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BasicDetails;
