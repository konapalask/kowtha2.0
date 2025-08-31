import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {getItem, setItem} from '../helpers/utility';
// import {submitVerification} from '../services/verification.services';

// Components
import {colors} from '../constants/colors';
import CollapsibleSection from '../components/CollapsibleSection';
import BasicDetails from '../components/pd-forms/BasicDetails';
import BusinessDetails from '../components/pd-forms/BusinessDetails';
import ApplicantDetails from '../components/pd-forms/ApplicantDetails';
import AdditionalDetails, {
  AdditionalDetailsItem,
} from '../components/pd-forms/AdditionalDetails';
import ThirdPartyCheck, {
  ThirdPartyCheckFormData,
} from '../components/forms/ThirdPartyCheck';
import ExistingLoans from '../components/forms/ExistingLoans';
import FamilyMemberDetails from '../components/forms/FamilyMemberDetails';
import {submitVerification} from '../services/field.services';

interface PDVerificationFormData {
  basicDetails: {
    applicationNumber: string;
    applicantName: string;
    businessName: string;
    loanAmount: string;
    mobileNumber: string;
    address: string;
    bankName: string;
  };
  businessDetails: {
    businessName: string;
    businessAddress: string;
    businessType: string;
    yearsInBusiness: string;
  };
  applicantDetails: {
    age: string;
    education: string;
    maritalStatus: string;
    yearsAtCurrentAddress: string;
    yearsInCurrentCity: string;
  };
  familyMemberDetails: any[];
  thirdPartyCheck: ThirdPartyCheckFormData;
  existingLoans: {
    loans: Array<{
      bankName: string;
      purpose: string;
      loanAmount: string;
      emi: string;
      tenure: string;
    }>;
  };
  additionalDetails: AdditionalDetailsItem[];
  additionalInfo: {
    additionalRemarks: string;
    specialMentions: string;
  };
}

const STORAGE_KEY = 'pdVerificationData';

const PDVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {item} = route.params as {item: any};
  const {userData} = route.params as {userData: any};
  console.log(userData);

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: true,
    businessDetails: false,
    applicantDetails: false,
    familyMemberDetails: false,
    thirdPartyCheck: false,
    existingLoans: false,
    additionalDetails: false,
  });

  // State for tracking valid sections
  const [validSections, setValidSections] = useState<{[key: string]: boolean}>({
    basicDetails: false,
    businessDetails: false,
    applicantDetails: false,
    familyMemberDetails: false,
    thirdPartyCheck: false,
    existingLoans: false,
    additionalDetails: false,
  });

  // Toggle section expansion
  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Handle form data changes
  const handleFormDataChange = useCallback(
    (section: keyof PDVerificationFormData, data: any) => {
      setFormData(prev => {
        const newData = {
          ...prev,
          [section]: {
            ...prev[section],
            ...data,
          },
        };
        saveData(newData);
        return newData;
      });
    },
    [],
  );

  // Load saved data from AsyncStorage
  const loadSavedData = useCallback(async () => {
    try {
      const savedData = await getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save data to AsyncStorage
  const saveData = useCallback(async (data: PDVerificationFormData) => {
    try {
      await setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, []);

  // Handle form data changes

  // Handle family member details submission
  const handleFamilyMemberDetailsSubmit = useCallback(
    (data: PDVerificationFormData['familyMemberDetails']) => {
      handleFormDataChange('familyMemberDetails', data);
      setValidSections(prev => ({
        ...prev,
        familyMemberDetails: true,
      }));
    },
    [handleFormDataChange],
  );

  // Initial form data
  const initialFormData: PDVerificationFormData = {
    basicDetails: {
      applicationNumber: userData?.loan?.applicationNumber || '',
      applicantName: userData?.loan?.applicantName || '',
      businessName: userData?.businessName || '',
      loanAmount: userData?.loan?.loanAmount?.toString() || '',
      mobileNumber: userData?.loan?.applicantMobile || '',
      address: userData?.applicantAddress || '',
      bankName: userData?.loan?.bankName || '',
    },
    businessDetails: {
      businessName: '',
      businessAddress: '',
      businessType: '',
      yearsInBusiness: '',
    },
    applicantDetails: {
      age: '',
      education: '',
      maritalStatus: '',
      yearsAtCurrentAddress: '',
      yearsInCurrentCity: '',
    },
    familyMemberDetails: [],
    thirdPartyCheck: {
      checks: [],
    },
    existingLoans: {
      loans: [],
    },
    additionalDetails: [],
    additionalInfo: {
      additionalRemarks: '',
      specialMentions: '',
    },
  };

  const [formData, setFormData] =
    useState<PDVerificationFormData>(initialFormData);

  const handleSubmit = async () => {
    try {
      const allSectionsValid = Object.values(validSections).every(Boolean);
      if (!allSectionsValid) {
        Alert.alert(
          'Incomplete Form',
          'Please complete all sections before submitting.',
        );
        return;
      }

      const response: any = await submitVerification(
        formData,
        item?.applicationId,
      );

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'PD Verification submitted successfully!',
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error submitting PD verification:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit PD verification. Please try again.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView>
          <CollapsibleSection
            title="Basic Details"
            isExpanded={expandedSections.basicDetails}
            onToggle={() => toggleSection('basicDetails')}
            isValid={validSections.basicDetails}>
            <BasicDetails
              formData={formData.basicDetails}
              onSubmit={(data: PDVerificationFormData['basicDetails']) =>
                handleFormDataChange('basicDetails', data)
              }
              // onValidationChange={(isValid: boolean) =>
              //   setValidSections(prev => ({...prev, basicDetails: isValid}))
              // }
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Business Details"
            isExpanded={expandedSections.businessDetails}
            onToggle={() => toggleSection('businessDetails')}
            isValid={validSections.businessDetails}>
            <BusinessDetails
              formData={formData.businessDetails}
              onSubmit={(data: PDVerificationFormData['businessDetails']) => {
                handleFormDataChange('businessDetails', data);
                toggleSection('businessDetails');
              }}
              // onValidationChange={(isValid: boolean) =>
              //   setValidSections(prev => ({...prev, businessDetails: isValid}))
              // }
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Applicant Details"
            isExpanded={expandedSections.applicantDetails}
            onToggle={() => toggleSection('applicantDetails')}
            isValid={validSections.applicantDetails}>
            <ApplicantDetails
              formData={formData.applicantDetails}
              onSubmit={(data: PDVerificationFormData['applicantDetails']) =>
                handleFormDataChange('applicantDetails', data)
              }
              // onValidationChange={(isValid: boolean) =>
              //   setValidSections(prev => ({...prev, applicantDetails: isValid}))
              // }
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Family Member Details"
            isExpanded={expandedSections.familyMemberDetails}
            onToggle={() => toggleSection('familyMemberDetails')}
            isValid={validSections.familyMemberDetails}>
            <FamilyMemberDetails
              onSubmit={handleFamilyMemberDetailsSubmit}
              initialData={formData.familyMemberDetails}
              maxFamilyMembers={formData.familyMemberDetails?.length || 0}
              // onValidationChange={(isValid: boolean) =>
              //   setValidSections(prev => ({
              //     ...prev,
              //     familyMemberDetails: isValid,
              //   }))
              // }
            />
          </CollapsibleSection>
          <CollapsibleSection
            title="Third Party Check (TPC)"
            isExpanded={expandedSections.thirdPartyCheck}
            onToggle={() => toggleSection('thirdPartyCheck')}
            isValid={validSections.thirdPartyCheck}>
            <ThirdPartyCheck
              onSubmit={(data: ThirdPartyCheckFormData) =>
                handleFormDataChange('thirdPartyCheck', data)
              }
              initialData={formData.thirdPartyCheck}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Existing Loans"
            isExpanded={expandedSections.existingLoans}
            onToggle={() => toggleSection('existingLoans')}
            isValid={validSections.existingLoans}>
            <ExistingLoans
              onSubmit={(data: PDVerificationFormData['existingLoans']) =>
                handleFormDataChange('existingLoans', data)
              }
              initialData={formData.existingLoans}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Additional Details"
            isExpanded={expandedSections.additionalDetails}
            onToggle={() => toggleSection('additionalDetails')}
            isValid={validSections.additionalDetails}>
            <AdditionalDetails
              initialData={formData.additionalDetails}
              onSubmit={data => {
                setFormData(prev => ({
                  ...prev,
                  additionalDetails: data,
                }));
              }}
            />
          </CollapsibleSection>

          {/* <CollapsibleSection
          title="Additional Information"
          isExpanded={expandedSections.additionalInfo}
          onToggle={() => toggleSection('additionalInfo')}
          isValid={validSections.additionalInfo}>
          <AdditionalInfo
            formData={formData.additionalInfo}
            onFormChange={(data: any) =>
              setFormData(prev => ({
                ...prev,
                additionalInfo: {...prev.additionalInfo, ...data},
              }))
            }
            onValidationChange={(isValid: boolean) =>
              setValidSections(prev => ({...prev, additionalInfo: isValid}))
            }
          />
        </CollapsibleSection> */}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default PDVerification;
