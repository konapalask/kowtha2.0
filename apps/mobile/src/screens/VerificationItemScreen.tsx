import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {
  VerificationItem,
  UploadedItem,
  BasicDetailsFormData,
  VerificationFormData,
  AddressVerificationFormData,
  ResidenceDetailsFormData,
  FamilyEmploymentDetailsFormData,
  ThirdPartyCheckFormData,
  FamilyMember,
} from '../types/verification';
import BasicDetails from '../components/forms/BasicDetails';
import AddressVerification from '../components/forms/AddressVerification';
import ResidenceDetails from '../components/forms/ResidenceDetails';
import FamilyEmploymentDetails from '../components/forms/FamilyEmploymentDetails';
import ThirdPartyCheck from '../components/forms/ThirdPartyCheck';
import CollapsibleSection from '../components/CollapsibleSection';
import {colors} from '../constants/colors';
import Toast from 'react-native-toast-message';
import {submitVerification} from '../services/field.services';
import {getItem, setItem, clearItem} from '../helpers/utility';
import FamilyMemberDetails from '../components/forms/FamilyMemberDetails';
import Investigable from '../components/forms/Investigable';
import PhotoCaptureFi from '../components/forms/PhotoCaptureFi';

type VerificationItemScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationItemScreen'
>;

const VerificationItemScreen = () => {
  const navigation = useNavigation<VerificationItemScreenNavigationProp>();
  const route = useRoute();
  const {item} = route.params as {item: VerificationItem};
  const {userData} = route.params as {userData: any};
  const {verificationType} = route.params as {verificationType: string};
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [investigable, setInvestigable] = useState<boolean | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: true,
    photoCapture: false,
    applicantInformation: false,
    addressVerification: false,
    residenceDetails: false,
    familyEmploymentDetails: false,
    familyMemberDetails: false,
    thirdPartyCheck: false,
    finalObservations: false,
    investigable: investigable ?? true,
  });

  const [validSections, setValidSections] = useState<{
    [key: string]: boolean;
  }>({
    basicDetails: false,
    photoCapture: false,
    addressVerification: false,
    residenceDetails: false,
    familyEmploymentDetails: false,
    familyMemberDetails: false,
    thirdPartyCheck: false,
  });

  const [formData, setFormData] = useState<VerificationFormData>({
    basicDetails: {
      verificationType: verificationType,
      applicationNumber: item?.applicationNumber,
      applicantName: item.name,
      aadhar: '',
      applicantMaritalStatus: '',
      applicantMaritalStatusOther: '',
      educationQualification: '',
      category: '',
      categoryOther: '',
      isApplicantAvailable: '',
      availablePersonName: '',
      availablePersonMobile: '',
      availablePersonRelation: '',
      availablePersonRelationOther: '',
      loanAmount: userData?.loan?.loanAmount?.toString() ?? '',
      purposeOfLoan: userData?.loan?.loanType,
    },
    addressVerification: {
      address: '',
      addressCategory: '',
      addressDetails: item?.address,
      addressMismatch: '',
      numberOfYearsAtCurrentResidence: '',
      previousAddress: '',
      previousAddressYears: '',
      numberOfYearsAtCurrentCity: '',
      previousCity: '',
      numberOfYearsAtPreviousCity: '',
      reasonForChange: '',
      geoTag: '',
    },
    residenceDetails: {
      residenceStatus: '',
      rentDetails: '',
      residenceType: '',
      specifyResidenceType: '',
      standardOfLiving: '',
      // localityType: '',
      accessibility: '',
      houseArea: '',
      yearsAtCurrentAddress: '',
      // nameBoardVisible: '',
      politicalSymbolVisible: '',
    },
    familyEmploymentDetails: {
      totalFamilyMembers: '',
      earningMembers: '',
      dependents: '',
      isSpouseWorking: '',
      spouseEmploymentDetails: '',
      assetsObserved: '',
    },
    familyMemberDetails: [],
    thirdPartyCheck: {
      checks: [
        {
          tpcName: '',
          mobileNumber: '',
          relationship: '',
          // feedbackStatus: '',
          comments: '',
        },
      ],
    },
    uploadedItems: [],
  });

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await getItem(
          `${item?.verificationId}_${verificationType}`,
        );
        if (savedData) {
          const completeFormData = {
            ...formData,
            ...savedData,
            basicDetails: {
              ...formData.basicDetails,
              ...savedData.basicDetails,
            },
            addressVerification: {
              ...formData.addressVerification,
              ...savedData.addressVerification,
            },
            residenceDetails: {
              ...formData.residenceDetails,
              ...savedData.residenceDetails,
            },
            familyEmploymentDetails: {
              ...formData.familyEmploymentDetails,
              ...savedData.familyEmploymentDetails,
            },
            familyMemberDetails: savedData.familyMemberDetails || [],
            thirdPartyCheck: {
              ...formData.thirdPartyCheck,
              ...savedData.thirdPartyCheck,
            },
            uploadedItems: savedData.uploadedItems || [],
          };
          setFormData(completeFormData);
          setValidSections({
            basicDetails: !!savedData.basicDetails,
            photoCapture: savedData.uploadedItems?.length > 0,
            addressVerification: !!savedData.addressVerification,
            residenceDetails: !!savedData.residenceDetails,
            familyEmploymentDetails: !!savedData.familyEmploymentDetails,
            familyMemberDetails: savedData.familyMemberDetails?.length > 0,
            thirdPartyCheck: !!savedData.thirdPartyCheck,
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
  }, [item?.verificationId, verificationType]);

  const saveFormData = async (section: string, data: any) => {
    try {
      const savedData =
        (await getItem(`${item?.verificationId}_${verificationType}`)) || {};
      const updatedData = {
        ...savedData,
        [section]: data,
      };
      await setItem(`${item?.verificationId}_${verificationType}`, updatedData);
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

  const handleBasicDetailsSubmit = async (data: BasicDetailsFormData) => {
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

  const handleAddressVerificationSubmit = async (
    data: AddressVerificationFormData,
  ) => {
    const updatedData = {
      ...formData,
      addressVerification: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      addressVerification: true,
    }));
    setExpandedSections(prev => ({...prev, addressVerification: false}));
    await saveFormData('addressVerification', data);
  };

  const handleResidenceDetailsSubmit = async (
    data: ResidenceDetailsFormData,
  ) => {
    const updatedData = {
      ...formData,
      residenceDetails: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      residenceDetails: true,
    }));
    setExpandedSections(prev => ({...prev, residenceDetails: false}));
    await saveFormData('residenceDetails', data);
  };

  const handleFamilyEmploymentDetailsSubmit = async (
    data: FamilyEmploymentDetailsFormData,
  ) => {
    const updatedData = {
      ...formData,
      familyEmploymentDetails: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      familyEmploymentDetails: true,
    }));
    setExpandedSections(prev => ({...prev, familyEmploymentDetails: false}));
    await saveFormData('familyEmploymentDetails', data);
  };

  const handleFamilyMemberDetailsSubmit = async (data: FamilyMember[]) => {
    const updatedData = {
      ...formData,
      familyMemberDetails: data,
    };
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      familyMemberDetails: data.length > 0,
    }));
    setExpandedSections(prev => ({...prev, familyMemberDetails: false}));
    await saveFormData('familyMemberDetails', data);
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

  const handleUploadedItemsChange = async (items: UploadedItem[]) => {
    const updatedData = {
      ...formData,
      uploadedItems: items,
    };
    setUploadedItems(items);
    setFormData(updatedData);
    setValidSections(prev => ({
      ...prev,
      photoCapture: items.length > 0,
    }));
    await saveFormData('uploadedItems', items);
  };

  const handleSubmit = async () => {
    // Check if all sections are validated
    const {familyMemberDetails, ...rest} = validSections;
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
        findings: 'Verification Findings Text',
        addressType: formData.addressVerification.address,
        verificationData: formData,
      };

      console.log('Submitting form data:', finalData);
      await submitVerification(finalData, item?.verificationId);

      // Clear the saved data after successful submission
      await clearItem(`${item?.verificationId}_${verificationType}`);

      Toast.show({
        type: 'success',
        text1: 'Successfully submitted',
        position: 'top',
      });
      navigation.goBack();
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      Toast.show({
        type: 'error',
        text1:
          error?.response?.data?.message || 'Error submitting verification',
        position: 'top',
      });
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
                showSpouse={
                  formData.basicDetails.applicantMaritalStatus === 'Married'
                }
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
                maxFamilyMembers={
                  formData.familyEmploymentDetails.totalFamilyMembers
                    ? parseInt(
                        formData.familyEmploymentDetails.totalFamilyMembers,
                      )
                    : undefined
                }
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
              <PhotoCaptureFi
                onUploadedItemsChange={handleUploadedItemsChange}
                initialItems={uploadedItems}
                loanId={item?.verificationId}
              />
            </CollapsibleSection>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Verification</Text>
            </TouchableOpacity>
          </>
        )}

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
