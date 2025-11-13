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
import {colors} from '../constants/colors';

// Field key mappings for automatic data population
const FIELD_KEY_MAPPINGS = {
  applicantName: ['applicantName', 'nameOfApplicant', 'nameOfTheApplicant'],
  businessName: [
    'businessName',
    'nameOfConcern',
    'nameOfBusiness',
    'nameOfFirm',
    'concernName',
  ],
  phoneNo: [
    'applicantMobile',
    'applicantContactNumber',
    'applicantPhoneNumber',
    'loanAmountRequired',
  ],
  applicationNumber: [
    'applicationNumber',
    'applicationNo',
    'applicationId',
    'referenceNumber',
    'proposalNumber',
    'loanAccountNo',
  ],
  loanAmount: ['loanAmount', 'loanAmountRequested'],
  purposeOfLoan: ['loanType', 'purposeOfLoan'],
  bankName: ['repaymentBankName'],
  address: [
    'applicantAddress',
    'initiatedAddress',
    'addressVisited',
    'businessAddress',
    'pdAddress',
    'officeAddress',
    'initiatedPremises',
    'addressOfFirm',
  ],
  latitude: ['latitude', 'lat', 'siteLatitude', 'currentLatitude'],
  longitude: ['longitude', 'lng', 'long', 'siteLongitude', 'currentLongitude'],
  coordinates: [
    'coordinates',
    'geoTag',
    'geoCoordinates',
    'siteCoordinates',
    'latitudeLongitude',
  ],
};

// Function to check if a field key matches any pattern in the mapping
const matchesFieldPattern = (fieldKey: string, patterns: string[]): boolean => {
  const fieldKeyLower = fieldKey.toLowerCase();
  return patterns.some(pattern =>
    fieldKeyLower.includes(pattern.toLowerCase()),
  );
};

// Function to get initial data based on schema structure (DYNAMIC APPROACH)
const getInitialDataByBank = (
  schema: any,
  userData: any,
  loggedInUserName?: string,
) => {
  if (!userData || !schema) return {};
  console.log('userData', userData);
  // Extract common data from userData
  const commonData: Record<string, any> = {
    applicantName:
      userData?.loan?.applicantName || userData?.applicantName || '',
    businessName: userData?.businessName || userData?.loan?.businessName || '',
    phoneNo: userData?.loan?.applicantMobile || userData?.contactNumber || '',
    applicationNumber:
      userData?.loan?.applicationNumber || userData?.loan?.loanId || '',
    loanAmount: userData?.loan?.loanAmount || '',
    purposeOfLoan: userData?.loan?.loanType || '',
    bankName: userData?.loan?.bankName || '',
    address:
      userData?.applicantAddress || userData?.loan?.applicantAddress || '',
    latitude: '',
    longitude: '',
    coordinates: '',
  };

  const initialData: Record<string, any> = {};

  // Iterate through schema sections
  if (schema?.sections) {
    schema.sections.forEach((section: any) => {
      initialData[section.id] = {};

      // Iterate through section fields
      if (section.schema?.properties) {
        Object.keys(section.schema.properties).forEach(fieldKey => {
          // Check each field against our mappings
          for (const [commonKey, patterns] of Object.entries(
            FIELD_KEY_MAPPINGS,
          )) {
            if (matchesFieldPattern(fieldKey, patterns)) {
              // Special handling for coordinates
              if (commonKey === 'coordinates') {
                // For coordinates field, try to get from commonData or leave empty
                const coords = commonData.coordinates || '';
                initialData[section.id][fieldKey] = coords;
              }
              // Special handling for geo coordinates (latitude/longitude)
              else if (commonKey === 'latitude' || commonKey === 'longitude') {
                // These are usually set dynamically with GetLocation
                // Leave empty for now, will be populated separately
                if (!initialData[section.id][fieldKey]) {
                  initialData[section.id][fieldKey] = commonData[commonKey];
                }
              } else {
                // Regular field mapping
                initialData[section.id][fieldKey] = commonData[commonKey];
              }
              break; // Found a match, move to next field
            }
          }

          // Special case: pdDoneBy or nameOfPersonMet
          if (
            fieldKey.includes('pdDone') ||
            fieldKey.includes('pdDoneBy') ||
            // fieldKey.includes('nameOfPersonMet') ||
            fieldKey.includes('verifierName')
          ) {
            initialData[section.id][fieldKey] = loggedInUserName || '';
          }

          // Special case: bankName
          if (fieldKey.includes('bank') && fieldKey.includes('name')) {
            initialData[section.id][fieldKey] = userData?.loan?.bankName || '';
          }

          // Ensure field exists in initial data (even if empty)
          if (!(fieldKey in initialData[section.id])) {
            initialData[section.id][fieldKey] = '';
          }
        });
      }
    });
  }

  return initialData;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [formData, setFormData] = useState<any>({});
  // Initialize with empty object - schema will define the structure
  const [sectionData, setSectionData] = useState<any>({});
  // console.log('sectionData', sectionData);
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [investigable, setInvestigable] = useState<boolean | null>(null);
  // console.log('sectionData', sectionData);

  // Log sectionData whenever it changes
  // useEffect(() => {
  //   console.log('sectionData updated:', sectionData);
  // }, [sectionData]);

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
      if (!schemaForm) return; // Wait for schema to load

      // Start with initial data using dynamic schema-based approach
      let updatedData = getInitialDataByBank(
        schemaForm,
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

    if (bankName && schemaForm) {
      updateSectionData();
    }
  }, [loggedInUserName, bankName, userData, schemaForm]);

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
    console.log(userData);
    // Load schema based on bank name
    const loadSchema = async () => {
      if (!userData?.templateName && !bankName) {
        console.warn('No template name provided');
        return;
      }

      try {
        const schema = await loadMobilePDFormsSchema(
          userData?.templateName ?? bankName,
        );
        if (schema) {
          setSchemaForm(schema);
          // Note: Initial data population is now handled in the consolidated effect
        }
      } catch (e) {
        console.error('Error loading schema:', e);
        // Fallback is handled in pdSchema.ts by returning from forms.js
      }
    };
    loadSchema();
  }, [userData?.templateName]);

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

  const isSectionValid = (sectionId: string, sectionSchema?: any): boolean => {
    // Special handling for photo capture section
    if (sectionId === 'photoCapture') {
      return (sectionData?.uploadedItems?.length || 0) > 0;
    }

    // If no schema provided, fallback to basic check
    if (!sectionSchema) {
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
    }

    // Check if section has data
    const sectionContent = sectionData[sectionId];
    if (!sectionContent || typeof sectionContent !== 'object') {
      return false;
    }

    // Get required fields from schema
    const baseRequiredFields = sectionSchema?.required || [];

    if (baseRequiredFields.length === 0) {
      // If no required fields, do not mark section as completed
      return false;
    }

    // Filter required fields based on conditional dependencies
    const requiredFields = baseRequiredFields.filter((fieldId: string) => {
      const fieldSchema = sectionSchema?.properties?.[fieldId];
      if (!fieldSchema?.dependencies?.required) {
        return true; // Always required if no conditional dependency
      }

      // Check if field should be required based on dependencies
      const dependencies = fieldSchema.dependencies.required;
      for (const [depFieldName, expectedValue] of Object.entries(
        dependencies,
      )) {
        const actualValue = sectionContent[depFieldName];
        if (Array.isArray(expectedValue)) {
          if (!expectedValue.includes(actualValue)) {
            return false; // Not required if dependency condition not met
          }
        } else {
          if (actualValue !== expectedValue) {
            return false; // Not required if dependency condition not met
          }
        }
      }
      return true; // Required if all dependency conditions are met
    });

    // Check if all required fields are filled
    for (const fieldId of requiredFields) {
      const fieldValue = sectionContent[fieldId];
      const fieldSchema = sectionSchema?.properties?.[fieldId];

      // For array fields
      if (fieldSchema?.type === 'array') {
        if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
          return false;
        }

        // Check if each array item has required fields filled
        const itemRequiredFields = fieldSchema.items?.required || [];
        if (itemRequiredFields.length > 0) {
          const hasValidItem = fieldValue.some((item: any) => {
            if (!item || typeof item !== 'object') return false;
            return itemRequiredFields.every((requiredField: string) => {
              const itemFieldValue = item[requiredField];
              return (
                itemFieldValue !== null &&
                itemFieldValue !== undefined &&
                itemFieldValue !== ''
              );
            });
          });

          if (!hasValidItem) {
            return false;
          }
        }
      } else {
        // Regular field - check if it's empty
        const isEmpty =
          fieldValue === null || fieldValue === undefined || fieldValue === '';

        if (isEmpty) {
          return false;
        }
      }
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
    console.log('🚀 FORM SUBMISSION STARTED');

    // Prevent double submission
    if (isSubmitting) {
      console.log('🛑 ALREADY SUBMITTING - Ignoring duplicate submit');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!schemaForm) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Form configuration not found',
        });
        return;
      }

      const validationErrors: string[] = [];

      // Check ALL sections (both required and optional)
      for (const section of schemaForm.sections) {
        if (section.id === 'photoCapture') {
          // Photo capture validation (only if section is required)
          if (
            section.required &&
            (!sectionData?.uploadedItems ||
              sectionData.uploadedItems.length === 0)
          ) {
            validationErrors.push(
              `${section.label}: At least one photo is required`,
            );
          }
          continue;
        }

        const sectionDataExists =
          sectionData[section.id] !== undefined &&
          sectionData[section.id] !== null;

        // If section is REQUIRED and empty → error
        if (section.required && !sectionDataExists) {
          validationErrors.push(`${section.label}: Section is required`);
          continue;
        }

        // If section is OPTIONAL and empty → skip validation (OK)
        if (!section.required && !sectionDataExists) {
          continue;
        }

        // If section has data (required OR optional), validate its contents
        const sectionContent = sectionData[section.id];
        if (typeof sectionContent === 'object' && sectionContent !== null) {
          // Check if section is empty
          if (Object.keys(sectionContent).length === 0) {
            if (section.required) {
              validationErrors.push(
                `${section.label}: Section cannot be empty`,
              );
            }
            continue;
          }

          // Check field-level requirements within the section (for both required and optional sections)
          const baseRequiredFields = section.schema?.required || [];

          // Filter required fields based on conditional dependencies
          const requiredFields = baseRequiredFields.filter(
            (fieldId: string) => {
              const fieldSchema = section.schema?.properties?.[fieldId];
              if (!fieldSchema?.dependencies?.required) {
                return true; // Always required if no conditional dependency
              }

              // Check if field should be required based on dependencies
              const dependencies = fieldSchema.dependencies.required;
              for (const [depFieldName, expectedValue] of Object.entries(
                dependencies,
              )) {
                const actualValue = sectionContent[depFieldName];
                if (Array.isArray(expectedValue)) {
                  if (!expectedValue.includes(actualValue)) {
                    return false; // Not required if dependency condition not met
                  }
                } else {
                  if (actualValue !== expectedValue) {
                    return false; // Not required if dependency condition not met
                  }
                }
              }
              return true; // Required if all dependency conditions are met
            },
          );
          for (const fieldId of requiredFields) {
            const fieldValue = sectionContent[fieldId];

            // For array fields, check if array exists and has items with required fields
            const fieldSchema = section.schema?.properties?.[fieldId];
            if (fieldSchema?.type === 'array' && Array.isArray(fieldValue)) {
              // If array is required but empty (and we have section data), that might be an issue
              // But we'll allow empty arrays for now - user just hasn't added items yet

              const itemRequiredFields = fieldSchema.items?.required || [];

              // Check each item in the array for required fields
              fieldValue.forEach((item: any, index: number) => {
                if (item && typeof item === 'object') {
                  itemRequiredFields.forEach((requiredField: string) => {
                    const itemFieldValue = item[requiredField];
                    const itemFieldEmpty =
                      itemFieldValue === null ||
                      itemFieldValue === undefined ||
                      itemFieldValue === '' ||
                      (typeof itemFieldValue === 'string' &&
                        itemFieldValue.trim() === '');

                    if (itemFieldEmpty) {
                      const itemFieldTitle =
                        fieldSchema.items?.properties?.[requiredField]?.title ||
                        requiredField;
                      validationErrors.push(
                        `${section.label} → ${fieldSchema.title} [${
                          index + 1
                        }] → ${itemFieldTitle}: Required field is empty`,
                      );
                    }
                  });
                }
              });
              continue;
            }

            // Regular field validation
            const isEmpty =
              fieldValue === null ||
              fieldValue === undefined ||
              fieldValue === '';

            if (isEmpty) {
              const fieldTitle =
                section.schema?.properties?.[fieldId]?.title || fieldId;
              validationErrors.push(
                `${section.label} → ${fieldTitle}: Required field is empty`,
              );
            }
          }
        }
      }

      if (validationErrors.length > 0) {
        console.log('🛑 BLOCKING FORM SUBMISSION - Validation failed!');

        Toast.show({
          type: 'error',
          text1: 'Frontend Validation Error!',
          text2: validationErrors[0], // Show first error
          visibilityTime: 8000,
          position: 'top',
        });

        // Log all errors for debugging (using console.log to avoid toast display)
        console.log('❌ Form validation failed:', validationErrors);

        console.log('🛑 RETURNING NOW - Form should NOT submit');
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Validation passed - Proceeding with submission');

      if (Object.keys(errors).length > 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill all required fields',
        });
        setIsSubmitting(false);
        return;
      }

      // Ensure all array items have UUIDs before submission
      const processedSectionData = {...sectionData};

      // Process each section to ensure array items have UUIDs
      Object.keys(processedSectionData).forEach(sectionId => {
        const sectionData = processedSectionData[sectionId];
        if (sectionData && typeof sectionData === 'object') {
          Object.keys(sectionData).forEach(fieldId => {
            const fieldValue = sectionData[fieldId];
            if (Array.isArray(fieldValue)) {
              // Ensure each array item has a UUID
              processedSectionData[sectionId][fieldId] = fieldValue.map(
                (item: any) => ({
                  ...item,
                  _id: item._id || require('react-native-uuid').v4(),
                }),
              );
            }
          });
        }
      });

      const finalData = {
        verificationType: 'Business',
        findings: 'Business Verification Findings',
        addressType: 'Business',
        verificationData: processedSectionData,
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
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
    Toast.show({
      type: 'error',
      text1: '🔧 React Hook Form Error',
      text2: 'Please fill all required fields',
      visibilityTime: 5000,
      position: 'top',
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
                      <Text style={styles.sectionTitle}>
                        {sec.label}
                        {sec.required && (
                          <Text style={styles.requiredMark}> *</Text>
                        )}
                      </Text>
                      {isSectionValid(sec.id, sec.schema) && (
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
  requiredMark: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: colors.button.primary.background,
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
