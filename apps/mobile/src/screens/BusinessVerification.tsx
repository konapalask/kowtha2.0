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
import {UploadedItem} from '../types/verification';
import {submitVerification} from '../services/field.services';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {getItem, setItem, clearItem} from '../helpers/utility';

interface BusinessVerificationFormData {
  basicDetails: {
    applicantName: string;
    personMet: string;
    personMetName?: string;
    personMetRelation?: string;
    businessAddress: string;
    isAddressSame: string;
    addressCorrection?: string;
  };
  businessDetails: {
    nameBoardSeen: string;
    nameBoardMatched: string;
    constitution: string;
    constitutionOther?: string;
    keyManager: string;
    keyManagerRelation: string;
    businessStartYear: string;
    totalExperience: string;
    isAddressTraceable: string;
    geoTag: string;
  };
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
  };
  uploadedItems: UploadedItem[];
}

const BusinessVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {item} = route.params as {item: any};
  console.log(item);
  const {userData} = route.params as {userData: any};
  const verificationType = 'Business';

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: true,
    businessDetails: false,
    miscellaneous: false,
    photoCapture: false,
  });

  const [validSections, setValidSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: false,
    businessDetails: false,
    miscellaneous: false,
    photoCapture: false,
  });

  const [formData, setFormData] = useState<BusinessVerificationFormData>({
    basicDetails: {
      applicantName: userData.applicantName,
      personMet: '',
      personMetName: '',
      personMetRelation: '',
      businessAddress: item.address,
      isAddressSame: '',
      addressCorrection: '',
    },
    businessDetails: {
      nameBoardSeen: '',
      nameBoardMatched: '',
      constitution: '',
      constitutionOther: '',
      keyManager: '',
      keyManagerRelation: '',
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
            businessDetails: {
              ...formData.businessDetails,
              ...savedData.businessDetails,
            },
            miscellaneous: {
              ...formData.miscellaneous,
              ...savedData.miscellaneous,
            },
            uploadedItems: savedData.uploadedItems || [],
          };
          setFormData(completeFormData);
          setValidSections({
            basicDetails: !!savedData.basicDetails,
            businessDetails: !!savedData.businessDetails,
            miscellaneous: !!savedData.miscellaneous,
            photoCapture: savedData.uploadedItems?.length > 0,
          });
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

  const handleBusinessDetailsSubmit = async (
    data: BusinessVerificationFormData['businessDetails'],
  ) => {
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
    await saveFormData('businessDetails', data);
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
        findings: 'Business Verification Findings',
        verificationData: formData,
      };

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

export default BusinessVerification;
