import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BackButton} from '../lib/BackButton';
import {
  getFormConfigByBank,
  getAvailableBanks,
  BankFormConfig,
  BankFormSection,
} from '../components/pd-forms/bankFormConfigs';
import {UploadedItem} from '../types/verification';
import {submitVerification} from '../services/field.services';
import {clearItem} from '../helpers/utility';
import Toast from 'react-native-toast-message';
import Investigable from '../components/forms/Investigable';
import CollapsibleSection from '../components/CollapsibleSection';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SchemaSection from '../components/pd-forms/SchemaSection';
import { loadMobilePDFormsSchema, resolveAxisUBLVariant } from '../components/pd-forms/schema/pdSchema';

const PD = ({navigation, route}: {navigation: any; route: any}) => {
  const {item} = route.params as {item: any};
  const {userData} = route.params as {userData: any};
  const STORAGE_KEY = `${item?.id}_pd`;

  // console.log('item', item);
  // console.log('userData', userData);

  const bankName = userData?.loan?.bankName;
  const isAxisFinance = (bankName || '').toLowerCase().includes('axis');
  const [schemaForm, setSchemaForm] = useState<any>(null);

  const formConfig = getFormConfigByBank(bankName);

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
  // const [formData, setFormData] = useState<any>({});
  const [sectionData, setSectionData] = useState<any>({
    basicDetails: {
      applicantName: userData?.loan?.applicantName || '',
      nameOfConcern: userData?.businessName || '',
      initiatedAddress: userData?.applicantAddress || '',
      phoneNo: userData?.loan?.applicantMobile || '',
    },
  });
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [investigable, setInvestigable] = useState<boolean | null>(null);
  // console.log('sectionData', sectionData);

  useLayoutEffect(() => {
    loadFormData();
  }, []);

  useEffect(() => {
    // Load schema for Axis UBL pilot
    const loadSchema = async () => {
      try {
        if (isAxisFinance) {
          const schema = await loadMobilePDFormsSchema();
          const formId = resolveAxisUBLVariant();
          const form = schema.forms.find(f => f.id === formId);
          setSchemaForm(form || null);
        }
      } catch (e) {
        setSchemaForm(null);
      }
    };
    loadSchema();
  }, [isAxisFinance]);

  // Watch form values to update formData
  // const watchedValues = watch();
  // useEffect(() => {
  //   setFormData(watchedValues);
  // }, []);

  const loadFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // console.log('parsedData', parsedData);
        // setFormData(parsedData);
        setSectionData((prev: any) => ({
          ...prev,
          ...parsedData,
        }));
        setUploadedItems(parsedData.uploadedItems || []);
        setInvestigable(parsedData.investigable ?? null);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const saveFormData = async (data: any) => {
    try {
      // console.log('data obtained', data);
      const dataToSave = {
        ...data,
        sectionData,
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
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev: any) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
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

  const handleSectionDataChange = (sectionId: string, data: any) => {
    const updatedSectionData = {
      ...sectionData,
      [sectionId]: data,
    };
    setSectionData(updatedSectionData);
    saveFormData(updatedSectionData);
    setExpandedSections((prev: any) => ({
      ...prev,
      [sectionId]: false,
    }));
  };

  const handleUploadedItemsChange = async (items: UploadedItem[]) => {
    // console.log('items', items);
    // setUploadedItems(items);
    await saveFormData({...sectionData, uploadedItems: items});
  };

  const onSubmit = async (data: any) => {
    try {
      if (!formConfig) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Form configuration not found',
        });
        return;
      }

      const requiredSections = formConfig.sections.filter(
        section => section.required,
      );
      const missingRequiredSections = requiredSections.filter(section => {
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
      });

      if (missingRequiredSections.length > 0) {
        const missingSectionNames = missingRequiredSections
          .map(section => section.label)
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

  if (!formConfig) {
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
          <Text style={styles.availableBanksText}>
            Available banks: {getAvailableBanks().join(', ')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton
        navigation={navigation}
        title={`PD - ${bankName}`}
        hide={false}
        noBorder={false}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
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
              {/* Axis UBL schema-driven pilot: if schemaForm is available, render from schema; else use existing config */}
              {(isAxisFinance && schemaForm?.sections?.length ? schemaForm.sections.map((sec: any) => {
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
                          fields={sec.fields}
                          initialData={sectionData[sec.id]}
                          onSubmit={(data: any) => handleSectionDataChange(sec.id, data)}
                        />
                      </View>
                    )}
                  </View>
                );
              }) : formConfig.sections.map(section => {
                const SectionComponent = section.component;
                const isExpanded = expandedSections[section.id] || false;

                return (
                  <View key={section.id} style={styles.sectionContainer}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => toggleSection(section.id)}>
                      <Text style={styles.sectionTitle}>{section.label}</Text>
                      {isSectionValid(section.id) && (
                        // <View style={styles.validIndicator} />
                        <Icon name="check" size={18} color="#34C759" />
                      )}
                      <Text style={styles.sectionIndicator}>
                        {isExpanded ? '▼' : '▶'}
                      </Text>
                      {/* {isSectionValid(section.id) && (
                        <View style={styles.validIndicator} />
                      )} */}
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.sectionContent}>
                        {section.id === 'photoCapture' ? (
                          <SectionComponent
                            onUploadedItemsChange={handleUploadedItemsChange}
                            initialItems={sectionData?.uploadedItems ?? []}
                            loanId={item?.id || item?.verificationId}
                          />
                        ) : (
                          <SectionComponent
                            onSubmit={(data: any) =>
                              handleSectionDataChange(section.id, data)
                            }
                            initialData={sectionData[section.id]}
                          />
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
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
    </View>
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
