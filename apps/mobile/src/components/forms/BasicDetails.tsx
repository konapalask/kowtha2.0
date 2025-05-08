import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {BasicDetailsFormData} from '../../types/verification';
import {colors} from '../../constants/colors';

type BasicDetailsProps = {
  data: BasicDetailsFormData;
};

const BasicDetails: React.FC<BasicDetailsProps> = ({data}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Type</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.verificationType}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Date</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.verificationDate}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Time</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.verificationTime}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Mode</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.verificationMode}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Status</Text>
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{data.verificationStatus}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Remarks</Text>
        <View style={[styles.readOnlyField, styles.textArea]}>
          <Text style={styles.readOnlyText}>{data.verificationRemarks}</Text>
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
  textArea: {
    minHeight: 100,
  },
});

export default BasicDetails;
