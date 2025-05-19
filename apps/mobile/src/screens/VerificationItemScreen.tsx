import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {
  VerificationItem,
  UploadedItem,
  BasicDetailsFormData,
  VerificationFormData,
  ApplicantInformationFormData,
  AddressVerificationFormData,
  ResidenceDetailsFormData,
  FamilyEmploymentDetailsFormData,
  ThirdPartyCheckFormData,
  FinalObservationsFormData,
} from '../types/verification';
import BasicDetails from '../components/forms/BasicDetails';
import PhotoCapture from '../components/forms/PhotoCapture';
import ApplicantInformation from '../components/forms/ApplicantInformation';
import AddressVerification from '../components/forms/AddressVerification';
import ResidenceDetails from '../components/forms/ResidenceDetails';
import FamilyEmploymentDetails from '../components/forms/FamilyEmploymentDetails';
import ThirdPartyCheck from '../components/forms/ThirdPartyCheck';
import FinalObservations from '../components/forms/FinalObservations';
import CollapsibleSection from '../components/CollapsibleSection';
import {colors} from '../constants/colors';
import Toast from 'react-native-toast-message';
import {submitVerification} from '../services/field.services';

type VerificationItemScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationItemScreen'
>;

const VerificationItemScreen = () => {
  const navigation = useNavigation<VerificationItemScreenNavigationProp>();
  const route = useRoute();
  const {item} = route.params as {item: VerificationItem};
  const {verificationType} = route.params as {verificationType: string};
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: true,
    photoCapture: false,
    applicantInformation: false,
    addressVerification: false,
    residenceDetails: false,
    familyEmploymentDetails: false,
    thirdPartyCheck: false,
    finalObservations: false,
  });

  const [validSections, setValidSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: false,
    photoCapture: false,
    applicantInformation: false,
    addressVerification: false,
    residenceDetails: false,
    familyEmploymentDetails: false,
    thirdPartyCheck: false,
    finalObservations: false,
  });

  const [formData, setFormData] = useState<VerificationFormData>({
    basicDetails: {
      verificationType: verificationType,
      applicationNumber: item?.applicationNumber,
      applicantName: item.name,
      applicantMaritalStatus: '',
      educationQualification: '',
      category: '',
    },
    applicantInformation: {
      applicantName: '',
      applicantAge: '',
      applicantGender: '',
      applicantMaritalStatus: '',
      applicantEducation: '',
    },
    addressVerification: {
      addressCategory: '',
      addressDetails: '',
      geoTag: '',
      address: '',
      numberOfYearsAtCurrentResidence: '',
      numberOfYearsAtCurrentCity: '',
    },
    residenceDetails: {
      residenceStatus: '',
      rentDetails: '',
      residenceType: '',
      constructionQuality: '',
      standardOfLiving: '',
      locationCategory: '',
      localityType: '',
      accessibility: '',
      houseArea: '',
      yearsAtCurrentAddress: '',
      nameplateVisible: '',
    },
    familyEmploymentDetails: {
      totalFamilyMembers: '',
      earningMembers: '',
      dependents: '',
      isSpouseWorking: '',
      spouseEmploymentDetails: '',
      assetsObserved: '',
    },
    thirdPartyCheck: {
      tpcName: '',
      mobileNumber: '',
      relationship: '',
      feedbackStatus: '',
      comments: '',
    },
    finalObservations: {
      cooperativeness: '',
      overallStatus: '',
      remarks: '',
    },
    uploadedItems: [],
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBasicDetailsSubmit = (data: BasicDetailsFormData) => {
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

  const handleApplicantInformationSubmit = (
    data: ApplicantInformationFormData,
  ) => {
    setFormData(prev => ({
      ...prev,
      applicantInformation: data,
    }));
    setValidSections(prev => ({
      ...prev,
      applicantInformation: true,
    }));
    setExpandedSections(prev => ({...prev, applicantInformation: false}));
  };

  const handleAddressVerificationSubmit = (
    data: AddressVerificationFormData,
  ) => {
    setFormData(prev => ({
      ...prev,
      addressVerification: data,
    }));
    setValidSections(prev => ({
      ...prev,
      addressVerification: true,
    }));
    setExpandedSections(prev => ({...prev, addressVerification: false}));
  };

  const handleResidenceDetailsSubmit = (data: ResidenceDetailsFormData) => {
    setFormData(prev => ({
      ...prev,
      residenceDetails: data,
    }));
    setValidSections(prev => ({
      ...prev,
      residenceDetails: true,
    }));
    setExpandedSections(prev => ({...prev, residenceDetails: false}));
  };

  const handleFamilyEmploymentDetailsSubmit = (
    data: FamilyEmploymentDetailsFormData,
  ) => {
    setFormData(prev => ({
      ...prev,
      familyEmploymentDetails: data,
    }));
    setValidSections(prev => ({
      ...prev,
      familyEmploymentDetails: true,
    }));
    setExpandedSections(prev => ({...prev, familyEmploymentDetails: false}));
  };

  const handleThirdPartyCheckSubmit = (data: ThirdPartyCheckFormData) => {
    setFormData(prev => ({
      ...prev,
      thirdPartyCheck: data,
    }));
    setValidSections(prev => ({
      ...prev,
      thirdPartyCheck: true,
    }));
    setExpandedSections(prev => ({...prev, thirdPartyCheck: false}));
  };

  const handleFinalObservationsSubmit = (data: FinalObservationsFormData) => {
    setFormData(prev => ({
      ...prev,
      finalObservations: data,
    }));
    setValidSections(prev => ({
      ...prev,
      finalObservations: true,
    }));
    setExpandedSections(prev => ({...prev, finalObservations: false}));
  };

  const handleUploadedItemsChange = (items: UploadedItem[]) => {
    setUploadedItems(items);
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
        verificationType: verificationType,
        findings: 'Verification Findings Text',
        verificationData: formData,
      };

      console.log('Submitting form data:', finalData);
      await submitVerification(
        {
          verificationType: verificationType,
          findings: 'Verification Findings Text',
          verificationData: finalData,
        },
        item?.id,
      );

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
          <BasicDetails
            initialData={formData.basicDetails}
            onSubmit={handleBasicDetailsSubmit}
          />
        </CollapsibleSection>

        {/* <CollapsibleSection
          title="Applicant Information"
          isExpanded={expandedSections.applicantInformation}
          onToggle={() => toggleSection('applicantInformation')}
          isValid={validSections.applicantInformation}>
          <ApplicantInformation data={formData.applicantInformation} />
        </CollapsibleSection> */}

        <CollapsibleSection
          title="Address Verification"
          isExpanded={expandedSections.addressVerification}
          onToggle={() => toggleSection('addressVerification')}
          isValid={validSections.addressVerification}>
          <AddressVerification
            onSubmit={handleAddressVerificationSubmit}
            initialData={formData.addressVerification}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Residence Details"
          isExpanded={expandedSections.residenceDetails}
          onToggle={() => toggleSection('residenceDetails')}
          isValid={validSections.residenceDetails}>
          <ResidenceDetails
            onSubmit={handleResidenceDetailsSubmit}
            initialData={formData.residenceDetails}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Family & Employment Details"
          isExpanded={expandedSections.familyEmploymentDetails}
          onToggle={() => toggleSection('familyEmploymentDetails')}
          isValid={validSections.familyEmploymentDetails}>
          <FamilyEmploymentDetails
            onSubmit={handleFamilyEmploymentDetailsSubmit}
            initialData={formData.familyEmploymentDetails}
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
            initialItems={uploadedItems}
          />
        </CollapsibleSection>

        {/* <CollapsibleSection
          title="Final Observations"
          isExpanded={expandedSections.finalObservations}
          onToggle={() => toggleSection('finalObservations')}
          isValid={validSections.finalObservations}>
          <FinalObservations
            onSubmit={handleFinalObservationsSubmit}
            initialData={formData.finalObservations}
          />
        </CollapsibleSection> */}

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

export default VerificationItemScreen;
