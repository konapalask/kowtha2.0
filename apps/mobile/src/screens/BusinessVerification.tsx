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
import BusinessBasicDetails from '../components/forms/BusinessBasicDetails';
import BusinessDetails from '../components/forms/BusinessDetails';
import BusinessMiscellaneous from '../components/forms/BusinessMiscellaneous';
import PhotoCapture from '../components/forms/PhotoCapture';
import ThirdPartyCheck, {
  ThirdPartyCheckFormData,
} from '../components/forms/ThirdPartyCheck';
import {UploadedItem} from '../types/verification';
import {submitVerification} from '../services/field.services';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {getItem, setItem, clearItem} from '../helpers/utility';
import {BusinessDetailsFormData} from '../components/forms/BusinessDetails';
import Investigable from '../components/forms/Investigable';
import ExistingLoans from '../components/forms/ExistingLoans';

interface BusinessVerificationFormData {
  basicDetails: {
    applicantName: string;
    personMet: string;
    personMetName?: string;
    personMetRelation?: string;
    businessAddress: string;
    isAddressSame: string;
    addressCorrection?: string;
    businessName: string;
  };
  businessDetails: BusinessDetailsFormData;
  miscellaneous: {
    ownershipOfPremises: string;
    rentalAmount?: string;
    yearsInCurrentPremises: string;
    stockSeen: string;
    employeesSeen: string;
    otherSetupObserved: string;
    illegalSetupObserved: string;
    politicallyConnected: string;
    privateFinanceOrChits: string;
    businessActivity: string;
    businessActivityOther?: string;
    areaOfPremises: string;
    localityOfBusiness: string;
    employeesUnderApplicant: string;
  };
  thirdPartyCheck: ThirdPartyCheckFormData;
  uploadedItems: UploadedItem[];
  existingLoans: {
    loans: Array<{
      bankName: string;
      purpose: string;
      loanAmount: string;
      emi: string;
      tenure: string;
    }>;
  };
}

const BusinessVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {item} = route.params as {item: any};
  const {userData} = route.params as {userData: any};
  const verificationType = 'Business';
  const [validSections, setValidSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: false,
    businessDetails: false,
    miscellaneous: false,
    thirdPartyCheck: false,
    photoCapture: false,
    existingLoans: false,
  });
  const [investigable, setInvestigable] = useState<boolean | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: true,
    businessDetails: false,
    miscellaneous: false,
    thirdPartyCheck: false,
    photoCapture: false,
    investigable: investigable ?? true,
    existingLoans: false,
  });

  const [formData, setFormData] = useState<BusinessVerificationFormData>({
    basicDetails: {
      applicantName: userData?.loan?.applicantName,
      personMet: '',
      personMetName: '',
      personMetRelation: '',
      businessAddress: item?.address,
      isAddressSame: '',
      addressCorrection: '',
      businessName: item?.businessName ?? '',
    },
    businessDetails: {
      nameBoardSeen: '',
      nameBoardMatched: '',
      constitution: '',
      constitutionOther: '',
      // keyManager: '',
      // keyManagerRelation: '',
      businessProfile: '',
      isBusinessSeasonal: '',
      businessStartYear: '',
      totalExperience: '',
      isAddressTraceable: '',
      geoTag: '',
    },
    miscellaneous: {
      ownershipOfPremises: '',
      rentalAmount: '',
      yearsInCurrentPremises: '',
      stockSeen: '',
      employeesSeen: '',
      otherSetupObserved: '',
      illegalSetupObserved: '',
      politicallyConnected: '',
      privateFinanceOrChits: '',
      businessActivity: '',
      businessActivityOther: '',
      areaOfPremises: '',
      localityOfBusiness: '',
      employeesUnderApplicant: '',
    },
    thirdPartyCheck: {
      checks: [{tpcName: '', mobileNumber: '', relationship: '', comments: ''}],
    },
    uploadedItems: [],
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
            businessDetails: {
              ...formData.businessDetails,
              ...savedData.businessDetails,
            },
            miscellaneous: {
              ...formData.miscellaneous,
              ...savedData.miscellaneous,
            },
            thirdPartyCheck: savedData.thirdPartyCheck || {
              checks: [
                {tpcName: '', mobileNumber: '', relationship: '', comments: ''},
              ],
            },
            uploadedItems: savedData.uploadedItems || [],
            existingLoans: savedData.existingLoans || {
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
          };
          setFormData(completeFormData);
          const updatedSections = {
            basicDetails: !!savedData.basicDetails,
            businessDetails: !!savedData.businessDetails,
            miscellaneous: !!savedData.miscellaneous,
            thirdPartyCheck: !!savedData.thirdPartyCheck,
            photoCapture: savedData.uploadedItems?.length > 0,
            existingLoans: !!savedData.existingLoans,
          };

          setValidSections(updatedSections);

          // check if at least one is true
          const isAnySectionValid = Object.values(updatedSections).some(
            val => val,
          );
          setInvestigable(isAnySectionValid);
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
    setExpandedSections(prev => {
      const isCurrentlyOpen = !!prev[section];

      // If it's open, close it (set all to false)
      if (isCurrentlyOpen) return {};

      // Otherwise, open this one and close others
      return {[section]: true};
    });
  };

  const handleBasicDetailsSubmit = async (
    data: BusinessVerificationFormData['basicDetails'],
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

  const handleBusinessDetailsSubmit = (data: BusinessDetailsFormData) => {
    const updatedData = {
      ...formData,
      businessDetails: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      businessDetails: true,
    }));
    setExpandedSections(prev => ({...prev, businessDetails: false}));
    saveFormData('businessDetails', data);
  };

  const handleMiscellaneousSubmit = async (
    data: BusinessVerificationFormData['miscellaneous'],
  ) => {
    const updatedData = {
      ...formData,
      miscellaneous: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      miscellaneous: true,
    }));
    setExpandedSections(prev => ({...prev, miscellaneous: false}));
    await saveFormData('miscellaneous', data);
  };

  const handleThirdPartyCheckSubmit = async (data: ThirdPartyCheckFormData) => {
    const updatedData = {
      ...formData,
      thirdPartyCheck: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      thirdPartyCheck: true,
    }));
    setExpandedSections(prev => ({...prev, thirdPartyCheck: false}));
    await saveFormData('thirdPartyCheck', data);
  };

  const handleExistingLoansSubmit = async (
    data: BusinessVerificationFormData['existingLoans'],
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
    const {existingLoans, ...rest} = validSections;
    const allSectionsValid = Object.values(rest).every(isValid => isValid);

    if (!allSectionsValid) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all mandatory fields before submitting',
        position: 'top',
      });
      return;
    }

    try {
      const finalData = {
        verificationType: verificationType,
        findings: 'Business Verification Findings',
        addressType: 'Business',
        verificationData: formData,
      };

      console.log(finalData);

      await submitVerification(finalData, item.verificationId);
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
          title="Applicant asked to postpone?"
          onToggle={() => toggleSection('investigable')}
          isExpanded={expandedSections.investigable}
          isValid={investigable ?? false}>
          <Investigable
            item={item}
            isInvestigable={investigable}
            setIsInvestigable={setInvestigable}
            onYes={() =>
              setExpandedSections(prev => ({...prev, investigable: false}))
            }
          />
        </CollapsibleSection>
        {investigable && (
          <>
            <CollapsibleSection
              title="Basic Details"
              isExpanded={expandedSections.basicDetails}
              onToggle={() => toggleSection('basicDetails')}
              isValid={validSections.basicDetails}>
              <BusinessBasicDetails
                initialData={formData.basicDetails}
                onSubmit={handleBasicDetailsSubmit}
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Business Details"
              isExpanded={expandedSections.businessDetails}
              onToggle={() => toggleSection('businessDetails')}
              isValid={validSections.businessDetails}>
              <BusinessDetails
                initialData={formData.businessDetails}
                onSubmit={handleBusinessDetailsSubmit}
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Miscellaneous Details"
              isExpanded={expandedSections.miscellaneous}
              onToggle={() => toggleSection('miscellaneous')}
              isValid={validSections.miscellaneous}>
              <BusinessMiscellaneous
                initialData={formData.miscellaneous}
                onSubmit={handleMiscellaneousSubmit}
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
              title="Third-Party Check"
              isExpanded={expandedSections.thirdPartyCheck}
              onToggle={() => toggleSection('thirdPartyCheck')}
              isValid={validSections.thirdPartyCheck}>
              <ThirdPartyCheck
                onSubmit={handleThirdPartyCheckSubmit}
                initialData={formData.thirdPartyCheck}
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
                loanId={item.verificationId}
              />
            </CollapsibleSection>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Verification</Text>
            </TouchableOpacity>
          </>
        )}
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

export default BusinessVerification;
