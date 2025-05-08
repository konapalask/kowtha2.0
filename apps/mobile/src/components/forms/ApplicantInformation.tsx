import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {ApplicantInformationFormData} from '../../types/verification';
import {colors} from '../../constants/colors';

type ApplicantInformationProps = {
  data: ApplicantInformationFormData;
};

const ApplicantInformation: React.FC<ApplicantInformationProps> = ({data}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Applicant Name</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.applicantName}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Applicant Age</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.applicantAge}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Applicant Gender</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.applicantGender}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Marital Status</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.applicantMaritalStatus}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Education Level</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.applicantEducation}</Text>
        </View>
      </View>
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
  readOnlyField: {
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.input.background,
  },
  readOnlyText: {
    fontSize: 16,
    color: colors.text.primary,
  },
});

export default ApplicantInformation;
