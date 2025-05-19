import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {colors} from '../constants/colors';
import CollapsibleSection from '../components/CollapsibleSection';
import WorkBasicDetails from '../components/forms/WorkBasicDetails';
import WorkEmploymentDetails from '../components/forms/WorkEmploymentDetails';
import ExistingLoans from '../components/forms/ExistingLoans';
import PhotoCapture from '../components/forms/PhotoCapture';
import {UploadedItem} from '../types/verification';
import {submitVerification} from '../services/field.services';
import {useNavigation, useRoute} from '@react-navigation/native';

interface WorkVerificationFormData {
  basicDetails: {
    applicantName: string;
    bankName: string;
    prospectNumber: string;
    purposeOfLoan: string;
    loanAmount: string;
    tenure: string;
    panNumber: string;
    aadharNumber: string;
    qualification: string;
  };
  employmentDetails: {
    currentOfficeName: string;
    officeAddress: string;
    yearsInCurrentJob: string;
    totalWorkExperience: string;
    companySize: string;
    natureOfService: string;
    officeLocality: string;
    idCardNumber: string;
    designation: string;
    salaryMode: string;
    employerType: string;
    grossSalary: string;
    netSalary: string;
    previousCompanyName: string;
    workExperience: string;
  };
  existingLoans: {
    loans: Array<{
      bankName: string;
      purpose: string;
      loanAmount: string;
      emi: string;
      tenure: string;
    }>;
  };
  uploadedItems: UploadedItem[];
}

const WorkVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {item} = route.params as {item: any};
  console.log('item', item);
  const {userData} = route.params as {userData: any};
  console.log('userData', userData);
  const verificationType = 'Work';
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: true,
    employmentDetails: false,
    existingLoans: false,
    photoCapture: false,
  });

  const [validSections, setValidSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: false,
    employmentDetails: false,
    existingLoans: false,
    photoCapture: false,
  });

  const [formData, setFormData] = useState<WorkVerificationFormData>({
    basicDetails: {
      applicantName: '',
      bankName: '',
      prospectNumber: '',
      purposeOfLoan: '',
      loanAmount: '',
      tenure: '',
      panNumber: '',
      aadharNumber: '',
      qualification: '',
    },
    employmentDetails: {
      currentOfficeName: '',
      officeAddress: '',
      yearsInCurrentJob: '',
      totalWorkExperience: '',
      companySize: '',
      natureOfService: '',
      officeLocality: '',
      idCardNumber: '',
      designation: '',
      salaryMode: '',
      employerType: '',
      grossSalary: '',
      netSalary: '',
      previousCompanyName: '',
      workExperience: '',
    },
    existingLoans: {
      loans: [
        {
          bankName: '',
          purpose: '',
          loanAmount: '',
          emi: '',
          tenure: '',
        },
      ],
    },
    uploadedItems: [],
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBasicDetailsSubmit = (
    data: WorkVerificationFormData['basicDetails'],
  ) => {
    setFormData(prev => ({
      ...prev,
      basicDetails: data,
    }));
    setValidSections(prev => ({
      ...prev,
      basicDetails: true,
    }));
    setExpandedSections(prev => ({...prev, basicDetails: false}));
  };

  const handleEmploymentDetailsSubmit = (
    data: WorkVerificationFormData['employmentDetails'],
  ) => {
    setFormData(prev => ({
      ...prev,
      employmentDetails: data,
    }));
    setValidSections(prev => ({
      ...prev,
      employmentDetails: true,
    }));
    setExpandedSections(prev => ({...prev, employmentDetails: false}));
  };

  const handleExistingLoansSubmit = (
    data: WorkVerificationFormData['existingLoans'],
  ) => {
    setFormData(prev => ({
      ...prev,
      existingLoans: data,
    }));
    setValidSections(prev => ({
      ...prev,
      existingLoans: true,
    }));
    setExpandedSections(prev => ({...prev, existingLoans: false}));
  };

  const handleUploadedItemsChange = (items: UploadedItem[]) => {
    setFormData(prev => ({
      ...prev,
      uploadedItems: items,
    }));
    setValidSections(prev => ({
      ...prev,
      photoCapture: items.length > 0,
    }));
  };

  const handleSubmit = async () => {
    try {
      const finalData = {
        // verificationType: verificationType,
        // findings: 'Work Verification Findings',
        // ...{
        verificationType: verificationType,
        findings: 'Work Verification Findings',
        verificationData: formData,
        // },
      };

      console.log('Submitting form data:', finalData);
      await submitVerification(finalData, item.verificationId);

      Alert.alert('Success', 'Verification submitted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting verification:', error);
      Alert.alert('Error', 'Failed to submit verification');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <CollapsibleSection
          title="Basic Details"
          isExpanded={expandedSections.basicDetails}
          onToggle={() => toggleSection('basicDetails')}
          isValid={validSections.basicDetails}>
          <WorkBasicDetails
            initialData={formData.basicDetails}
            onSubmit={handleBasicDetailsSubmit}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Employment Details"
          isExpanded={expandedSections.employmentDetails}
          onToggle={() => toggleSection('employmentDetails')}
          isValid={validSections.employmentDetails}>
          <WorkEmploymentDetails
            initialData={formData.employmentDetails}
            onSubmit={handleEmploymentDetailsSubmit}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Existing Loans"
          isExpanded={expandedSections.existingLoans}
          onToggle={() => toggleSection('existingLoans')}
          isValid={validSections.existingLoans}>
          <ExistingLoans
            initialData={formData.existingLoans}
            onSubmit={handleExistingLoansSubmit}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Photo Capture"
          isExpanded={expandedSections.photoCapture}
          onToggle={() => toggleSection('photoCapture')}
          isValid={validSections.photoCapture}>
          <PhotoCapture
            onUploadedItemsChange={handleUploadedItemsChange}
            initialItems={formData.uploadedItems}
          />
        </CollapsibleSection>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Verification</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  submitButton: {
    backgroundColor: colors.button.primary.background,
    padding: 15,
    borderRadius: 10,
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

export default WorkVerification;
