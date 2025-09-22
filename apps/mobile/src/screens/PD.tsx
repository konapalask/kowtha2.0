import React, {useState, useEffect} from 'react';
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

const PD = ({navigation, route}: {navigation: any; route: any}) => {
  const {item} = route.params as {item: any};
  const {userData} = route.params as {userData: any};
  const STORAGE_KEY = `${item?.id}_pd`;

  // Get bank name from item or userData
  const bankName = item?.bankName || userData?.bankName || 'Axis Finance';

  // Get form configuration for the bank
  const formConfig = getFormConfigByBank(bankName);

  // Initialize form with react-hook-form
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

  // State for section expansion
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [formData, setFormData] = useState<any>({});
  const [sectionData, setSectionData] = useState<{
    [key: string]: any;
  }>({});

  // Load saved form data on component mount
  useEffect(() => {
    loadFormData();
  }, []);

  // Watch form values to update formData
  const watchedValues = watch();
  useEffect(() => {
    setFormData(watchedValues);
  }, []);

  const loadFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setSectionData(parsedData.sectionData || {});
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const saveFormData = async (data: any) => {
    try {
      const dataToSave = {
        ...data,
        sectionData,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('Form data saved successfully');
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isSectionValid = (sectionId: string): boolean => {
    // For now, we'll consider a section valid if it has data
    // This can be enhanced with specific validation logic per section
    return (
      sectionData[sectionId] !== undefined && sectionData[sectionId] !== null
    );
  };

  const handleSectionDataChange = (sectionId: string, data: any) => {
    setSectionData((prev: any) => ({
      ...prev,
      [sectionId]: data,
    }));
  };

  const onSubmit = async (data: any) => {
    try {
      // Merge all section data
      const mergedData = {
        ...data,
        ...formData,
        sectionData,
      };
      await saveFormData(mergedData);
      Alert.alert('Success', 'Form data saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save form data');
    }
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
    Alert.alert('Validation Error', 'Please fill all required fields');
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
        <View style={styles.formContainer}>
          {formConfig.sections.map(section => {
            const SectionComponent = section.component;
            const isExpanded = expandedSections[section.id] || false;

            return (
              <View key={section.id} style={styles.sectionContainer}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(section.id)}>
                  <Text style={styles.sectionTitle}>{section.label}</Text>
                  <Text style={styles.sectionIndicator}>
                    {isExpanded ? '▼' : '▶'}
                  </Text>
                  {isSectionValid(section.id) && (
                    <View style={styles.validIndicator} />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.sectionContent}>
                    <SectionComponent
                      onSubmit={(data: any) =>
                        handleSectionDataChange(section.id, data)
                      }
                      initialData={sectionData[section.id]}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Text
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit, onError)}>
          Save Form Data
        </Text>
      </View>
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
    flex: 1,
  },
  sectionIndicator: {
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
  saveButton: {
    backgroundColor: '#007AFF',
    color: '#fff',
    padding: 16,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PD;
