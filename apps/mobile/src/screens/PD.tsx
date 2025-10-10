import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BackButton} from '../lib/BackButton';
import {UploadedItem} from '../types/verification';
import {submitVerification} from '../services/field.services';
import {clearItem, getItem} from '../helpers/utility';
import Toast from 'react-native-toast-message';
import Investigable from '../components/forms/Investigable';
import CollapsibleSection from '../components/CollapsibleSection';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SchemaSection from '../components/pd-forms/SchemaSection';
import {loadMobilePDFormsSchema} from '../components/pd-forms/schema/pdSchema';
import PhotoCapture from '../components/forms/PhotoCapture';
import GetLocation from 'react-native-get-location';

// Function to get initial data based on bank name
const getInitialDataByBank = (
  bankName: string,
  userData: any,
  loggedInUserName?: string,
) => {
  if (!userData || !bankName) return {};

  const bankNameLower = bankName.toLowerCase();

  // console.log('userData', userData);

  // Common data mapping
  const commonData = {
    applicantName:
      userData?.loan?.applicantName || userData?.applicantName || '',
    nameOfConcern: userData?.businessName || userData?.loan?.businessName || '',
    initiatedAddress:
      userData?.applicantAddress || userData?.loan?.applicantAddress || '',
    phoneNo: userData?.loan?.applicantMobile || userData?.contactNumber || '',
    applicationNo:
      userData?.loan?.applicationNumber || userData?.loan?.loanId || '',
    loanAmount: userData?.loan?.loanAmount || '',
    contactNumber:
      userData?.loan?.applicantMobile || userData?.contactNumber || '',
  };

  // console.log('commonData', commonData);

  // Bank-specific mappings
  if (bankNameLower.includes('axis finance ubl')) {
    return {
      basicDetails: {
        applicationNo: commonData.applicationNo,
        applicantName: commonData.applicantName,
        concernName: commonData.nameOfConcern,
        initiatedAddress: commonData.initiatedAddress,
        phoneNo: commonData.phoneNo,
      },
    };
  }

  if (bankNameLower.includes('axis bank')) {
    return {
      applicantDetails: {
        applicationId:
          userData?.loan?.applicationId || commonData.applicationNo,
        loanAmount: `${commonData.loanAmount}`,
        customerName: commonData.applicantName,
        contactNumber: commonData.contactNumber,
        pdAddress: commonData.initiatedAddress,
      },
      businessPlaceVintage: {
        nameOfFirm: commonData.nameOfConcern,
      },
    };
  }

  if (bankNameLower.includes('arka fincap')) {
    return {
      applicantDetails: {
        applicationNo: commonData.applicationNo,
        nameOfApplicant: commonData.applicantName,
        phoneNumber: commonData.phoneNo,
        nameOfConcern: commonData.nameOfConcern,
        initiatedAddress: commonData.initiatedAddress,
        loanAmount: `${commonData.loanAmount}`,
        purposeOfLoan: userData?.loan?.loanType || '',
      },
    };
  }

  if (bankNameLower.includes('tata ubl')) {
    return {
      basicDetails: {
        nameOfApplicant: commonData.applicantName,
        nameOfEntity: commonData.nameOfConcern,
        nameOfCoApplicants: userData?.coApplicantName || '',
      },
      proposedLoanDetails: {
        product: userData?.loan?.product || '',
        amount: `${commonData.loanAmount}`,
        tenure: userData?.loan?.tenure || '',
        repaymentFrom: {
          bankName: userData?.loan?.bankName || '',
          typeSAAccount: userData?.loan?.accountType || '',
          accountNo: userData?.loan?.accountNo || '',
        },
      },
      officeAddress: {
        address: commonData.initiatedAddress,
      },
      finalStatus: {
        phoneNoOfApplicant: commonData.phoneNo,
        pdDoneBy: loggedInUserName || '',
      },
    };
  }

  if (bankNameLower.includes('rbl')) {
    return {
      caseDetails: {
        referenceNumber: commonData.applicationNo,
        nameOfApplicant: commonData.applicantName,
        addressVisited: commonData.initiatedAddress,
        contactNo: commonData.phoneNo,
      },
      businessDetails: {
        businessName: commonData.nameOfConcern,
        shopAddress: commonData.initiatedAddress,
      },
    };
  }

  // Default fallback for unknown banks
  return {
    basicDetails: {
      applicantName: commonData.applicantName,
      nameOfConcern: commonData.nameOfConcern,
      initiatedAddress: commonData.initiatedAddress,
      phoneNo: commonData.phoneNo,
    },
  };
};

const PD = ({navigation, route}: {navigation: any; route: any}) => {
  const {item} = route.params as {item: any};
  const {userData} = route.params as {userData: any};
  const STORAGE_KEY = `${item?.id}_pd`;

  // console.log('item', item);
  // console.log('userData', userData);

  const bankName = userData?.loan?.bankName;
  const [schemaForm, setSchemaForm] = useState<any>(null);
  // console.log('schemaForm', schemaForm);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    resetField,
    watch,
  } = useForm({
    defaultValues: {},
  });

  const [expandedSections, setExpandedSections] = useState<any>({
    investigable: true,
  });
  const [loggedInUserName, setLoggedInUserName] = useState<string>('');
  // const [formData, setFormData] = useState<any>({});
  const initialData = getInitialDataByBank(
    bankName,
    userData,
    loggedInUserName,
  );
  console.log('initialData', initialData);
  const [sectionData, setSectionData] = useState<any>(initialData);
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [investigable, setInvestigable] = useState<boolean | null>(null);
  // console.log('sectionData', sectionData);

  // Log sectionData whenever it changes
  useEffect(() => {
    console.log('sectionData updated:', sectionData);
  }, [sectionData]);

  // useLayoutEffect(() => {
  //   loadFormData();
  // }, []);

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getItem('userDetails');
        if (userDetails?.name) {
          setLoggedInUserName(userDetails.name);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  // Consolidated effect to update sectionData with all sources
  useEffect(() => {
    const updateSectionData = async () => {
      // Start with initial data
      let updatedData = getInitialDataByBank(
        bankName,
        userData,
        loggedInUserName,
      );

      // Load saved data from AsyncStorage
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('parsedData', parsedData);
          updatedData = {
            ...updatedData,
            ...parsedData,
          };
        }
      } catch (error) {
        console.error('Error loading form data:', error);
      }

      // Update state once with all data, but preserve existing sectionData to avoid overwriting form changes
      setSectionData((prevSectionData: any) => {
        // Only update if this is the initial load or if the bank/user has changed
        // This prevents overwriting form changes when sections are toggled
        if (
          Object.keys(prevSectionData).length === 0 ||
          prevSectionData._lastBankName !== bankName ||
          prevSectionData._lastUserName !== loggedInUserName
        ) {
          return {
            ...updatedData,
            _lastBankName: bankName,
            _lastUserName: loggedInUserName,
          };
        }
        return prevSectionData;
      });
    };

    if (bankName) {
      updateSectionData();
    }
  }, [loggedInUserName, bankName, userData]);

  // Load uploaded items and investigable separately
  useLayoutEffect(() => {
    const loadAdditionalData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setUploadedItems(parsedData.uploadedItems || []);
          setInvestigable(parsedData.investigable ?? null);
        }
      } catch (error) {
        console.error('Error loading additional data:', error);
      }
    };
    loadAdditionalData();
  }, [bankName]);

  // Fetch current coordinates on component mount
  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        const {latitude, longitude} = location;
        const coordinates = `${latitude},${longitude}`;

        // Update section data with coordinates based on bank
        setSectionData((prev: any) => {
          const bankNameLower = bankName?.toLowerCase() || '';
          const updates: any = {...prev};

          // RBL bank - coordinates in particulars section
          if (bankNameLower.includes('rbl')) {
            updates.particulars = {
              ...prev.particulars,
              coordinates: coordinates,
            };
          }

          // Axis Finance UBL - siteCoordinates in thirdPartyCheck section
          if (bankNameLower.includes('axis finance ubl')) {
            updates.thirdPartyCheck = {
              ...prev.thirdPartyCheck,
              siteCoordinates: coordinates,
            };
          }

          // Tata UBL - latitudeLongitude in finalStatus section
          if (bankNameLower.includes('tata ubl')) {
            updates.finalStatus = {
              ...prev.finalStatus,
              latitudeLongitude: coordinates,
            };
          }

          return updates;
        });
      })
      .catch(error => {
        console.error('Error getting location:', error);
        // Set a fallback message if location is not available
        setSectionData((prev: any) => {
          const bankNameLower = bankName?.toLowerCase() || '';
          const updates: any = {...prev};

          // RBL bank
          if (bankNameLower.includes('rbl')) {
            updates.particulars = {
              ...prev.particulars,
              coordinates: 'Location not available',
            };
          }

          // Axis Finance UBL
          if (bankNameLower.includes('axis finance ubl')) {
            updates.thirdPartyCheck = {
              ...prev.thirdPartyCheck,
              siteCoordinates: 'Location not available',
            };
          }

          // Tata UBL
          if (bankNameLower.includes('tata ubl')) {
            updates.finalStatus = {
              ...prev.finalStatus,
              latitudeLongitude: 'Location not available',
            };
          }

          return updates;
        });
      });
  }, [bankName]);

  useEffect(() => {
    // Load schema based on bank name
    const loadSchema = async () => {
      if (!bankName) {
        console.warn('No bank name provided');
        return;
      }

      try {
        const schema = await loadMobilePDFormsSchema(bankName);
        if (schema) {
          setSchemaForm(schema);
        }
      } catch (e) {
        console.error('Error loading schema:', e);
        // Fallback is handled in pdSchema.ts by returning from forms.js
      }
    };
    loadSchema();
  }, [bankName]);

  // Watch form values to update formData
  // const watchedValues = watch();
  // useEffect(() => {
  //   setFormData(watchedValues);
  // }, []);

  const saveFormData = useCallback(
    async (data: any) => {
      try {
        // console.log('data obtained', data);
        const dataToSave = {
          ...data,
          // sectionData,
          // uploadedItems,
          investigable,
          timestamp: new Date().toISOString(),
        };
        // console.log('dataToSave', dataToSave);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        // console.log('Form data saved successfully');
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    },
    [investigable, STORAGE_KEY],
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev: any) => {
      const isCurrentlyExpanded = prev[sectionId];
      return {
        investigable: prev.investigable,
        [sectionId]: !isCurrentlyExpanded,
      };
    });
  };

  const isSectionValid = (sectionId: string): boolean => {
    if (sectionId === 'photoCapture') {
      return sectionData?.uploadedItems?.length > 0;
    }

    const sectionDataExists =
      sectionData[sectionId] !== undefined && sectionData[sectionId] !== null;
    if (!sectionDataExists) {
      return false;
    }

    const sectionContent = sectionData[sectionId];
    if (typeof sectionContent === 'object' && sectionContent !== null) {
      return Object.keys(sectionContent).length > 0;
    }

    return true;
  };

  const handleSectionDataChange = useCallback(
    (sectionId: string, data: any) => {
      setSectionData((prevSectionData: any) => {
        const updatedSectionData = {
          ...prevSectionData,
          [sectionId]: data,
        };
        // Save the updated data
        saveFormData(updatedSectionData);
        return updatedSectionData;
      });
      // Removed auto-collapse - sections stay open while editing
    },
    [saveFormData],
  );

  const handleUploadedItemsChange = useCallback(
    async (items: UploadedItem[]) => {
      // console.log('items', items);
      // setUploadedItems(items);
      setSectionData((prevSectionData: any) => {
        const updatedData = {...prevSectionData, uploadedItems: items};
        saveFormData(updatedData);
        return updatedData;
      });
    },
    [saveFormData],
  );

  const onSubmit = async (data: any) => {
    try {
      if (!schemaForm) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Form configuration not found',
        });
        return;
      }

      const requiredSections = schemaForm.sections.filter(
        (section: any) => section.required,
      );
      const missingRequiredSections = requiredSections.filter(
        (section: any) => {
          if (section.id === 'photoCapture') {
            return sectionData?.uploadedItems?.length === 0;
          }

          const sectionDataExists =
            sectionData[section.id] !== undefined &&
            sectionData[section.id] !== null;
          if (!sectionDataExists) {
            return true;
          }

          const sectionContent = sectionData[section.id];
          if (typeof sectionContent === 'object' && sectionContent !== null) {
            return Object.keys(sectionContent).length === 0;
          }

          return false;
        },
      );

      if (missingRequiredSections.length > 0) {
        const missingSectionNames = missingRequiredSections
          .map((section: any) => section.label)
          .join(', ');
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: `Please complete required sections: ${missingSectionNames}`,
        });
        return;
      }

      if (Object.keys(errors).length > 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill all required fields',
        });
        return;
      }

      const finalData = {
        verificationType: 'Business',
        findings: 'Business Verification Findings',
        addressType: 'Business',
        verificationData: sectionData,
      };

      // console.log('finalData', finalData);

      await submitVerification(finalData, item?.verificationId, 'PD');

      await clearItem(STORAGE_KEY);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'PD Verification submitted successfully!',
      });
      navigation.goBack();
      // }

      // Alert.alert('Success', 'Form data saved successfully!');
    } catch (error) {
      // Alert.alert('Error', 'Failed to save form data');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save form data',
      });
    }
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
    Toast.show({
      type: 'error',
      text1: 'Validation Error',
      text2: 'Please fill all required fields',
    });
  };

  if (!schemaForm) {
    return (
      <View style={styles.container}>
        <BackButton
          navigation={navigation}
          title="PD"
          hide={false}
          noBorder={false}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No form configuration found for bank: {bankName}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <BackButton
        navigation={navigation}
        title={`PD - ${bankName}`}
        hide={false}
        noBorder={false}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
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
              setExpandedSections((prev: any) => ({
                ...prev,
                investigable: false,
              }))
            }
          />
        </CollapsibleSection>

        {investigable && (
          <>
            <View style={styles.formContainer}>
              {schemaForm?.sections?.map((sec: any) => {
                const isExpanded = expandedSections[sec.id] || false;
                return (
                  <View key={sec.id} style={styles.sectionContainer}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => toggleSection(sec.id)}>
                      <Text style={styles.sectionTitle}>{sec.label}</Text>
                      {isSectionValid(sec.id) && (
                        <Icon name="check" size={18} color="#34C759" />
                      )}
                      <Text style={styles.sectionIndicator}>
                        {isExpanded ? '▼' : '▶'}
                      </Text>
                    </TouchableOpacity>
                    {isExpanded && (
                      <View style={styles.sectionContent}>
                        <SchemaSection
                          title={sec.label}
                          schema={sec.schema}
                          initialData={sectionData[sec.id]}
                          onSubmit={(data: any) =>
                            handleSectionDataChange(sec.id, data)
                          }
                        />
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Photo Capture Section - Common for all forms */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection('photoCapture')}>
                  <Text style={styles.sectionTitle}>Photo Capture</Text>
                  {isSectionValid('photoCapture') && (
                    <Icon name="check" size={18} color="#34C759" />
                  )}
                  <Text style={styles.sectionIndicator}>
                    {expandedSections.photoCapture ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>
                {expandedSections.photoCapture && (
                  <View style={styles.sectionContent}>
                    <PhotoCapture
                      onUploadedItemsChange={handleUploadedItemsChange}
                      initialItems={sectionData?.uploadedItems ?? []}
                      loanId={item?.id || item?.verificationId}
                      maxUploads={50}
                    />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit(onSubmit, onError)}>
                <Text style={styles.submitButtonText}>
                  Submit PD Verification
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
    // flex: 1,
  },
  sectionIndicator: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  validIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
  },
  sectionContent: {
    padding: 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  availableBanksText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PD;
