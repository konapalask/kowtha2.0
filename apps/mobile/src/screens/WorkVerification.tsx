import React, {useState, useEffect} from 'react';
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
import ColleagueReferences from '../components/forms/ColleagueReferences';
import PastEmployment from '../components/forms/PastEmployment';
import ExistingLoans from '../components/forms/ExistingLoans';
import PhotoCapture from '../components/forms/PhotoCapture';
import {UploadedItem} from '../types/verification';
import {submitVerification} from '../services/field.services';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {getItem, setItem, clearItem} from '../helpers/utility';

interface WorkVerificationFormData {
  basicDetails: {
    applicantName: string;
    bankName: string;
    prospectNumber: string;
    purposeOfLoan: string;
    loanAmount: string;
    tenure: string;
    // panNumber: string;
    // aadharNumber: string;
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
  };
  colleagueReferences: {
    references: Array<{
      name: string;
      address: string;
      designation: string;
      yearsKnown: string;
      contactNumber: string;
      emailAddress: string;
    }>;
  };
  pastEmployment: {
    employments: Array<{
      employerName: string;
      designation: string;
      fromDate: string;
      toDate: string;
      contactPersonName: string;
      contactPersonNumber: string;
      reasonForMovement: string;
    }>;
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
  const {userData} = route.params as {userData: any};
  const verificationType = 'Work';
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: true,
    employmentDetails: false,
    colleagueReferences: false,
    pastEmployment: false,
    existingLoans: false,
    photoCapture: false,
  });

  const [validSections, setValidSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: false,
    employmentDetails: false,
    colleagueReferences: false,
    pastEmployment: false,
    existingLoans: false,
    photoCapture: false,
  });

  const [formData, setFormData] = useState<WorkVerificationFormData>({
    basicDetails: {
      applicantName: userData.applicantName,
      bankName: userData.bankName,
      prospectNumber: userData.applicationNumber,
      purposeOfLoan: userData.loanType,
      loanAmount: userData.loanAmount.toString(),
      tenure: '',
      // panNumber: '',
      // aadharNumber: '',
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
    },
    colleagueReferences: {
      references: [
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
    pastEmployment: {
      employments: [
        {
          employerName: '',
          designation: '',
          fromDate: '',
          toDate: '',
          contactPersonName: '',
          contactPersonNumber: '',
          reasonForMovement: '',
        },
      ],
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

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await getItem(
          `${item.verificationId}_${verificationType}`,
        );
        if (savedData) {
          const completeFormData = {
            ...formData,
            ...savedData,
            basicDetails: {
              ...formData.basicDetails,
              ...savedData.basicDetails,
            },
            employmentDetails: {
              ...formData.employmentDetails,
              ...savedData.employmentDetails,
            },
            colleagueReferences: {
              ...formData.colleagueReferences,
              ...savedData.colleagueReferences,
            },
            pastEmployment: {
              ...formData.pastEmployment,
              ...savedData.pastEmployment,
            },
            existingLoans: {
              ...formData.existingLoans,
              ...savedData.existingLoans,
            },
            uploadedItems: savedData.uploadedItems || [],
          };
          setFormData(completeFormData);
          setValidSections({
            basicDetails: !!savedData.basicDetails,
            employmentDetails: !!savedData.employmentDetails,
            colleagueReferences: !!savedData.colleagueReferences,
            pastEmployment: !!savedData.pastEmployment,
            existingLoans: !!savedData.existingLoans,
            photoCapture: savedData.uploadedItems?.length > 0,
          });
          if (savedData.basicDetails) {
            setExpandedSections(prev => ({
              ...prev,
              basicDetails: true,
            }));
          }
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
  }, [item.verificationId, verificationType]);

  const saveFormData = async (section: string, data: any) => {
    try {
      const savedData =
        (await getItem(`${item.verificationId}_${verificationType}`)) || {};
      const updatedData = {
        ...savedData,
        [section]: data,
      };
      await setItem(`${item.verificationId}_${verificationType}`, updatedData);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBasicDetailsSubmit = async (
    data: WorkVerificationFormData['basicDetails'],
  ) => {
    const updatedData = {
      ...formData,
      basicDetails: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      basicDetails: true,
    }));
    setExpandedSections(prev => ({...prev, basicDetails: false}));
    await saveFormData('basicDetails', data);
  };

  const handleEmploymentDetailsSubmit = async (
    data: WorkVerificationFormData['employmentDetails'],
  ) => {
    const updatedData = {
      ...formData,
      employmentDetails: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      employmentDetails: true,
    }));
    setExpandedSections(prev => ({...prev, employmentDetails: false}));
    await saveFormData('employmentDetails', data);
  };

  const handleColleagueReferencesSubmit = async (
    data: WorkVerificationFormData['colleagueReferences'],
  ) => {
    const updatedData = {
      ...formData,
      colleagueReferences: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      colleagueReferences: true,
    }));
    setExpandedSections(prev => ({...prev, colleagueReferences: false}));
    await saveFormData('colleagueReferences', data);
  };

  const handlePastEmploymentSubmit = async (
    data: WorkVerificationFormData['pastEmployment'],
  ) => {
    const updatedData = {
      ...formData,
      pastEmployment: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      pastEmployment: true,
    }));
    setExpandedSections(prev => ({...prev, pastEmployment: false}));
    await saveFormData('pastEmployment', data);
  };

  const handleExistingLoansSubmit = async (
    data: WorkVerificationFormData['existingLoans'],
  ) => {
    const updatedData = {
      ...formData,
      existingLoans: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      existingLoans: true,
    }));
    setExpandedSections(prev => ({...prev, existingLoans: false}));
    await saveFormData('existingLoans', data);
  };

  const handleUploadedItemsChange = async (items: UploadedItem[]) => {
    const updatedData = {
      ...formData,
      uploadedItems: items,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      photoCapture: items.length > 0,
    }));
    await saveFormData('uploadedItems', items);
  };

  const handleSubmit = async () => {
    // Check if all sections are validated
    const allSectionsValid = Object.values(validSections).every(
      isValid => isValid,
    );

    if (!allSectionsValid) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all mandatory fields before submitting',
        position: 'bottom',
      });
      return;
    }

    try {
      const finalData = {
        verificationType: verificationType,
        findings: 'Work Verification Findings',
        verificationData: {
          ...formData,
          addressType: "Work",
        },
      };

      console.log('Submitting form data:', finalData);
      await submitVerification(finalData, item.verificationId);

      // Clear the saved data after successful submission
      await clearItem(`${item.verificationId}_${verificationType}`);

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
          title="Colleague References"
          isExpanded={expandedSections.colleagueReferences}
          onToggle={() => toggleSection('colleagueReferences')}
          isValid={validSections.colleagueReferences}>
          <ColleagueReferences
            initialData={formData.colleagueReferences}
            onSubmit={handleColleagueReferencesSubmit}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Past Employment"
          isExpanded={expandedSections.pastEmployment}
          onToggle={() => toggleSection('pastEmployment')}
          isValid={validSections.pastEmployment}>
          <PastEmployment
            initialData={formData.pastEmployment}
            onSubmit={handlePastEmploymentSubmit}
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
