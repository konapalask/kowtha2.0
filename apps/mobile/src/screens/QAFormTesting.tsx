import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useForm} from 'react-hook-form';
import {BackButton} from '../lib/BackButton';
import {UploadedItem} from '../types/verification';
import {submitVerification} from '../services/field.services';
import {clearItem, getItem} from '../helpers/utility';
import Toast from 'react-native-toast-message';
import Investigable from '../components/forms/Investigable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SchemaSection from '../components/pd-forms/SchemaSection';
import {loadMobilePDFormsSchema} from '../components/pd-forms/schema/pdSchema';
import PhotoCapture from '../components/forms/PhotoCapture';
import {Picker} from '@react-native-picker/picker';
import Pdf from 'react-native-pdf';
import axiosInstance from '../config/axios';
import {
  AVAILABLE_BANKS,
  generateDummyUserData,
  generateFamilyMembers,
  generateBankingDetails,
  generateExistingLoans,
  generateAssets,
  generateReferences,
} from '../helpers/dummyPDData';
import {generateMockDataFromSchema} from '../helpers/mockDataGenerator';

// Deep merge utility that prefers source values and preserves arrays when source is non-empty
const deepMerge = (target: any, source: any): any => {
  if (source === undefined || source === null) return target;
  if (Array.isArray(target) && Array.isArray(source)) {
    // Prefer source array if it has items; otherwise keep target
    return source.length > 0 ? source : target;
  }
  if (
    target &&
    typeof target === 'object' &&
    !Array.isArray(target) &&
    source &&
    typeof source === 'object' &&
    !Array.isArray(source)
  ) {
    const result: any = {...target};
    Object.keys(source).forEach(key => {
      result[key] = deepMerge(target?.[key], source[key]);
    });
    return result;
  }
  // For primitives or differing types, prefer source if it is not empty string/null/undefined
  if (source === '' || source === null || source === undefined) return target;
  return source;
};

// Field key mappings for automatic data population (align with PD.tsx)
const FIELD_KEY_MAPPINGS: Record<string, string[]> = {
  applicantName: ['applicantName', 'nameOfApplicant', 'nameOfTheApplicant'],
  businessName: [
    'businessName',
    'nameOfConcern',
    'nameOfBusiness',
    'nameOfEntity',
  ],
  phoneNo: ['applicantMobile', 'applicantContactNumber', 'phoneNo'],
  applicationNumber: [
    'applicationNumber',
    'applicationNo',
    'applicationId',
    'referenceNumber',
    'proposalNumber',
  ],
  loanAmount: ['loanAmount', 'amount'],
  purposeOfLoan: ['loanType', 'purposeOfLoan'],
  bankName: ['repaymentBankName', 'bankName'],
  address: [
    'applicantAddress',
    'initiatedAddress',
    'addressVisited',
    'businessAddress',
    'pdAddress',
    'officeAddress',
    'initiatedPremises',
    'address',
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

const matchesFieldPattern = (fieldKey: string, patterns: string[]): boolean => {
  const fieldKeyLower = fieldKey.toLowerCase();
  return patterns.some(pattern =>
    fieldKeyLower.includes(pattern.toLowerCase()),
  );
};

// Dynamic schema-based initial data (similar to PD.tsx)
const getInitialDataBySchema = (
  schema: any,
  userData: any,
  loggedInUserName?: string,
) => {
  if (!userData || !schema) return {} as any;

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

  if (schema?.sections) {
    schema.sections.forEach((section: any) => {
      initialData[section.id] = {};

      if (section.schema?.properties) {
        Object.keys(section.schema.properties).forEach(fieldKey => {
          for (const [commonKey, patterns] of Object.entries(
            FIELD_KEY_MAPPINGS,
          )) {
            if (matchesFieldPattern(fieldKey, patterns)) {
              if (commonKey === 'coordinates') {
                const coords = commonData.coordinates || '';
                initialData[section.id][fieldKey] = coords;
              } else if (
                commonKey === 'latitude' ||
                commonKey === 'longitude'
              ) {
                if (!initialData[section.id][fieldKey]) {
                  initialData[section.id][fieldKey] = commonData[commonKey];
                }
              } else {
                initialData[section.id][fieldKey] = commonData[commonKey];
              }
              break;
            }
          }

          // Special case: pdDoneBy or nameOfPersonMet
          if (
            fieldKey.includes('pdDone') ||
            fieldKey.includes('pdDoneBy') ||
            fieldKey.includes('nameOfPersonMet') ||
            fieldKey.includes('verifierName')
          ) {
            initialData[section.id][fieldKey] = loggedInUserName || '';
          }

          // Special case: bankName
          if (
            fieldKey.toLowerCase().includes('bank') &&
            fieldKey.toLowerCase().includes('name')
          ) {
            initialData[section.id][fieldKey] = userData?.loan?.bankName || '';
          }

          if (!(fieldKey in initialData[section.id])) {
            initialData[section.id][fieldKey] = '';
          }
        });
      }
    });
  }

  return initialData;
};

// Function to get initial data based on bank name
const getInitialDataByBank = (
  bankName: string,
  userData: any,
  loggedInUserName?: string,
) => {
  if (!userData || !bankName) {
    return {};
  }

  const bankNameLower = bankName.toLowerCase();

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
    // Generate comprehensive RBL test data
    const familyMembers = generateFamilyMembers(3);
    const bankingDetails = generateBankingDetails(1)[0];
    const existingLoans = generateExistingLoans(2);
    const assets = generateAssets(2);
    const references = generateReferences(2);

    return {
      caseDetails: {
        referenceNumber: commonData.applicationNo,
        nameOfApplicant: commonData.applicantName,
        coApplicant: userData?.coApplicantName || '',
        typeOfBorrower: 'Self Employed',
        meetingDetails: 'Met at business premises',
        addressVisited: commonData.initiatedAddress,
        personMet: commonData.applicantName,
        contactNo: parseInt(commonData.phoneNo, 10) || 0,
        dateOfVisit: new Date().toISOString().split('T')[0],
      },
      businessOwnerDetails: {
        businessOwnerDetails: familyMembers.map(member => ({
          name: member.name,
          age: member.age,
          qualification:
            member.education === '10th'
              ? '10th pass'
              : member.education === '12th'
              ? 'Under graduate'
              : 'Graduate',
          occupation: member.occupation,
          relation: member.relationship,
          remarks: 'Verified at premises',
        })),
      },
      familyDetails: {
        aboutApplicant: `${commonData.applicantName} is engaged in ${commonData.nameOfConcern}. Family consists of ${familyMembers.length} members.`,
        aboutCoApplicant: userData?.coApplicantName
          ? `${userData.coApplicantName} is co-applicant`
          : '',
        andTheirFamilyDetails: familyMembers
          .map(m => `${m.name} - ${m.relationship}, Age: ${m.age}`)
          .join('; '),
      },
      businessDetails: {
        businessName: commonData.nameOfConcern,
        typeOfEntity: 'Proprietorship',
        gstNumber: 'GSTIN' + Math.random().toString().slice(2, 17), // Generate 15 digit GST
        legalName: commonData.nameOfConcern + ' (Legal Entity)',
        tradeName: commonData.nameOfConcern,
        lastGSTReturn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // Last month
        establishment: 'Established 5 years ago',
        shopAddress: commonData.initiatedAddress,
        shopOwnership: 'Owned',
        godownAddress: '',
        godownOwnership: 'Owned',
        natureOfBusiness: 'Trading and Retail',
        productDetails:
          'Deals in retail products. Vintage: 5+ years. No major changes planned.',
        businessProcess:
          'Purchase from suppliers, stock at shop, sell to customers through retail',
        margins: '15-20% gross margin',
        documentsObserved:
          'GST returns, bank statements, invoices, stock register',
        activityObserved:
          'Active business operations observed. Staff present. Inventory visible.',
      },
      inputsPurchases: {
        detailsOfInputs: 'Raw materials from local suppliers',
        purchaseDetails: 'Monthly purchase cycle',
        orderCycle: 'Monthly',
        avgOrderQnty: '500 units',
        creditTerms: '30 days',
        otherRemarks: 'Regular supplier relationship',
      },
      outputsSupply: {
        marketForOutput: 'Local and regional markets',
        modeOfMarketing: 'Direct sales and distributors',
        typeOfCustomers: 'Retailers and end consumers',
        creditTerms: '15-30 days',
        stockOfFinishedGoods: 'Rs. 2-3 lakhs',
      },
      employeeDetails: {
        noOfEmployees: 5,
        salaryDetails: 'Rs. 15,000 - 25,000 per month',
        pfEsiApplied: 'No',
      },
      tradeReferences: {
        suppliers: references.slice(0, 2).map(ref => ({
          nameOfSuppliers: ref.businessName,
          contactDetails: ref.contactNumber,
        })),
        customers: references.slice(0, 2).map(ref => ({
          nameOfCustomer: ref.businessName,
          contactDetails: ref.contactNumber,
        })),
      },
      otherSourcesOfIncome: {
        otherSourcesOfIncome: [
          {
            sourceOfIncome: 'Rental Income',
            details: 'Rs. 20,000 per month from property',
          },
        ],
      },
      loansDetails: {
        loansDetails: existingLoans.map(loan => ({
          nameOfBankInstitution: loan.bankName,
          product: loan.typeOfLoan,
          loanAmount: loan.loanAmount,
          emi: loan.emi,
          os: `${loan.loanAmount * 0.6}`,
          remarks: 'Regular payments',
        })),
      },
      applicantsMainBankingDetails: {
        bankName: bankingDetails.bankName,
        accountHolderName: commonData.applicantName,
        accountType: bankingDetails.accountType,
        noOfYear: bankingDetails.noOfYears,
        limitOfCCOD:
          bankingDetails.accountType === 'CC/OD' ? 'Rs. 5,00,000' : 'NA',
        remarks: 'Satisfactory banking with regular transactions',
        endUse:
          userData?.loan?.loanType || 'Working capital and business expansion',
        ownContribution: '30% of total project cost from own funds',
        particulars:
          'Funds to be used for working capital requirements and inventory purchase',
        remarksAdditional:
          'Good banking relationship maintained for ' +
          bankingDetails.noOfYears +
          ' years',
      },
      netWorth: {
        netWorth: assets.map(asset => ({
          typeOfProperty: asset.assetType,
          ownerName: asset.ownerName,
          approxMarketValue: `Rs. ${asset.marketValue}`,
          yearsOfOwnership: '5 years',
        })),
      },
    };
  }

  // Chola
  if (bankNameLower.includes('chola')) {
    return {
      general: {
        nameOfTheApplicant: commonData.applicantName,
        businessName: commonData.nameOfConcern,
        loanRequested: commonData.loanAmount,
      },
    };
  }

  // IDFC HL & ML, IDFC PL
  if (bankNameLower.includes('idfc')) {
    return {
      applicantDetails: {
        nameOfApplicant: commonData.applicantName,
        businessName: commonData.nameOfConcern,
      },
    };
  }

  // IIFL
  if (bankNameLower.includes('iifl')) {
    return {
      applicantDetails: {
        nameOfApplicant: commonData.applicantName,
      },
    };
  }

  // Hero Fincorp
  if (bankNameLower.includes('hero fincorp')) {
    return {
      details: {
        nameOfTheCustomer: commonData.applicantName,
        nameOfTheFirm: commonData.nameOfConcern,
        businessAddress: commonData.initiatedAddress,
      },
    };
  }

  // Hero Housing (Salaried and Self)
  if (
    bankNameLower.includes('herohousing') ||
    bankNameLower.includes('hero housing')
  ) {
    return {
      applicantDetails: {
        applicantName: commonData.applicantName,
        businessName: commonData.nameOfConcern,
        nameOfBusiness: commonData.nameOfConcern,
      },
    };
  }

  // India Shelter & Niwas
  if (
    bankNameLower.includes('india shelter') ||
    bankNameLower.includes('niwas')
  ) {
    return {
      noOfVisit: {
        applicantName: commonData.applicantName,
        nameOfBusiness: commonData.nameOfConcern,
      },
    };
  }

  // ICICI
  if (bankNameLower.includes('icici')) {
    return {
      basicDetails: {
        nameOfApplicant: commonData.applicantName,
        businessAddress: commonData.initiatedAddress,
      },
    };
  }

  // DCB
  if (bankNameLower.includes('dcb')) {
    return {
      basicDetails: {
        nameOfApplicant: commonData.applicantName,
      },
    };
  }

  // INCRED
  if (bankNameLower.includes('incred')) {
    return {
      basicDetails: {
        applicantName: commonData.applicantName,
        businessName: commonData.nameOfConcern,
      },
    };
  }

  // Axis Agri
  if (bankNameLower.includes('axis agri')) {
    return {
      personalDetails: {
        nameOfApplicant: commonData.applicantName,
        businessName: commonData.nameOfConcern,
      },
    };
  }

  // Aditya Birla
  if (bankNameLower.includes('aditya birla')) {
    return {
      applicantDetails: {
        nameOfApplicant: commonData.applicantName,
        nameOfBusiness: commonData.nameOfConcern,
      },
    };
  }

  // Ambit
  if (bankNameLower.includes('ambit')) {
    return {
      applicantDetails: {
        nameOfApplicant: commonData.applicantName,
        nameOfBusiness: commonData.nameOfConcern,
        contactNumber: commonData.phoneNo,
      },
    };
  }

  // Axis Finance (general, not UBL)
  if (
    bankNameLower.includes('axis finance') &&
    !bankNameLower.includes('ubl')
  ) {
    return {
      basicDetails: {
        applicantName: commonData.applicantName,
        nameOfEntity: commonData.nameOfConcern,
      },
    };
  }

  // Yes Bank
  if (bankNameLower.includes('yes bank')) {
    return {
      applicantDetails: {
        nameOfApplicant: commonData.applicantName,
        businessName: commonData.nameOfConcern,
      },
    };
  }

  // SMFG SME
  if (bankNameLower.includes('smfg')) {
    return {
      basicDetails: {
        nameOfApplicantOrBusiness: commonData.applicantName,
        applicantName: commonData.applicantName,
        businessName: commonData.nameOfConcern,
      },
    };
  }

  // Default fallback for unknown banks
  return {
    basicDetails: {
      applicantName: commonData.applicantName,
      nameOfConcern: commonData.nameOfConcern,
      nameOfApplicant: commonData.applicantName,
      businessName: commonData.nameOfConcern,
      initiatedAddress: commonData.initiatedAddress,
      phoneNo: commonData.phoneNo,
    },
  };
};

const QAFormTesting = ({navigation}: {navigation: any}) => {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [formLoaded, setFormLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form data states (similar to PD.tsx)
  const [schemaForm, setSchemaForm] = useState<any>(null);
  const [sectionData, setSectionData] = useState<any>({});
  const [investigable, setInvestigable] = useState<boolean | null>(null);
  const [expandedSections, setExpandedSections] = useState<any>({
    investigable: true,
  });
  const [loggedInUserName, setLoggedInUserName] = useState<string>('');
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [item, setItem] = useState<any>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfToken, setPdfToken] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STORAGE_KEY = selectedBank
    ? `qa_${selectedBank.replace(/\s+/g, '_')}_pd`
    : '';

  const {
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {},
  });

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getItem('userDetails');
        if (userDetails?.name) {
          setLoggedInUserName(userDetails.name);
        }
        if (userDetails?.id) {
          setLoggedInUserId(userDetails.id);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const loadForm = async () => {
    if (!selectedBank) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a bank',
      });
      return;
    }

    setLoading(true);
    try {
      // Generate comprehensive dummy data with faker
      const dummyData = generateDummyUserData(selectedBank);

      Toast.show({
        type: 'info',
        text1: 'Creating QA Test Loan...',
        text2: 'Please wait while we set up test data',
        visibilityTime: 2000,
      });

      // Auto-create a QA loan for this bank
      try {
        if (!loggedInUserId) {
          throw new Error('User ID not available. Please login again.');
        }

        console.log('🔵 QA LOAN CREATION: Calling API');
        console.log('🔵 Request body:', {
          bankName: selectedBank,
          fieldExecutiveId: loggedInUserId,
        });

        const qaLoanResponse = await axiosInstance.post('/loans/qa-test-loan', {
          bankName: selectedBank,
          fieldExecutiveId: loggedInUserId,
          qaData: {
            applicantName: dummyData.userData.applicantName,
            applicantMobile: dummyData.userData.contactNumber,
            applicantAddress: dummyData.userData.applicantAddress,
            loanAmount: dummyData.userData.loan.loanAmount,
            loanType: dummyData.userData.loan.loanType,
          },
        });

        console.log('🔵 QA LOAN RESPONSE STATUS:', qaLoanResponse.status);
        console.log('✅ QA LOAN RESPONSE DATA:', qaLoanResponse.data);

        const qaLoanData = qaLoanResponse.data;

        // Update item with real loan and verification IDs
        const updatedItem = {
          ...dummyData.item,
          id: qaLoanData.data.verification.id,
          verificationId: qaLoanData.data.verification.id,
          loanId: qaLoanData.data.loan.id,
          applicationNumber: qaLoanData.data.loan.applicationNumber,
        };

        // Update userData with real loan data
        dummyData.userData.loan.applicationNumber =
          qaLoanData.data.loan.applicationNumber;
        dummyData.userData.loanId = qaLoanData.data.loan.id;
        dummyData.userData.id = qaLoanData.data.verification.id;
        dummyData.userData.businessName =
          qaLoanData.data.verification.businessName ||
          dummyData.userData.businessName;

        setItem(updatedItem);

        Toast.show({
          type: 'success',
          text1: 'QA Loan Created ✓',
          text2: `${selectedBank} | Loan #${qaLoanData.data.loan.id}`,
          visibilityTime: 3000,
        });
      } catch (qaError: any) {
        console.error('❌ QA LOAN CREATION FAILED:', qaError);
        console.error('Error type:', typeof qaError);
        console.error('Error message:', qaError?.message);
        console.error('Error stack:', qaError?.stack);
        console.error('Full error object:', JSON.stringify(qaError, null, 2));

        Toast.show({
          type: 'info',
          text1: 'Using Mock Data',
          text2: qaError?.message || 'Could not create real loan',
          visibilityTime: 3000,
        });
        // Fallback to mock item if QA loan creation fails
        setItem(dummyData.item);
      }

      // Load schema (force refresh in QA mode to always get latest schema)
      const schema = await loadMobilePDFormsSchema(selectedBank, true);
      if (!schema) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `No schema found for ${selectedBank}`,
        });
        return;
      }

      setSchemaForm(schema);

      // Get initial data: bank-specific + dynamic schema-based
      let bankInitialData = getInitialDataByBank(
        selectedBank,
        dummyData.userData,
        loggedInUserName,
      );
      const schemaInitialData = getInitialDataBySchema(
        schema,
        dummyData.userData,
        loggedInUserName,
      );

      // Generate comprehensive mock data for ALL fields using enhanced faker.js generator
      try {
        const comprehensiveMockData = generateMockDataFromSchema(schema);
        console.log('🔍 Generated comprehensive mock data for all sections', {
          bankName: selectedBank,
          sectionCount: schema.sections?.length || 0,
          mockDataKeys: Object.keys(comprehensiveMockData),
        });

        // Merge order (to preserve mock data):
        // 1) Start with schema-based initial data
        // 2) Merge bank-specific initial data on top (fills more keys)
        // 3) Finally merge MOCK data LAST so it wins and is not lost
        let mergedInitial = deepMerge(schemaInitialData, bankInitialData);
        mergedInitial = deepMerge(mergedInitial, comprehensiveMockData);

        // Ensure per-section deep merge as well to retain mock section objects
        if (schema.sections?.length) {
          schema.sections.forEach((section: any) => {
            const id = section.id;
            const base = (schemaInitialData as any)[id] || {};
            const bankBase = (bankInitialData as any)[id] || {};
            const mockBase = (comprehensiveMockData as any)[id] || {};
            mergedInitial[id] = deepMerge(deepMerge(base, bankBase), mockBase);
          });
        }

        console.log(
          '✅ Merge complete with mock data preserved (mock wins on conflicts)',
          {bankName: selectedBank},
        );

        // AUTO-INJECT GPS COORDINATES into all sections that need it
        const dataWithCoordinates = injectCoordinatesIntoSections(
          mergedInitial,
          dummyData.coordinates,
          schema,
        );

        setSectionData(dataWithCoordinates);
        setFormLoaded(true);
      } catch (error) {
        console.error('❌ Failed to generate comprehensive mock data:', error);
        // Fallback: still combine schema + bank initial data
        const mergedInitial = deepMerge(schemaInitialData, bankInitialData);
        const dataWithCoordinates = injectCoordinatesIntoSections(
          mergedInitial,
          dummyData.coordinates,
          schema,
        );
        setSectionData(dataWithCoordinates);
        setFormLoaded(true);
      }

      Toast.show({
        type: 'success',
        text1: 'Form Loaded ✓',
        text2: `${selectedBank} | GPS: ${dummyData.coordinates.latitude}, ${dummyData.coordinates.longitude}`,
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error('❌ FORM LOAD FAILED:', error);
      console.error('Load error details:', {
        message: error?.message,
        bank: selectedBank,
      });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load form',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Auto-inject GPS coordinates into any section that has latitude/longitude fields
   * This solves the "coordinates mandatory but readonly" issue
   */
  const injectCoordinatesIntoSections = (
    sectionData: any,
    coordinates: {latitude: string; longitude: string; cityName: string},
    schema: any,
  ) => {
    const updatedData = {...sectionData};

    // Iterate through all schema sections and inject coordinates where needed
    schema.sections?.forEach((section: any) => {
      const properties = section.schema?.properties || {};
      const hasLatitude = 'latitude' in properties;
      const hasLongitude = 'longitude' in properties;
      const hasCoordinates = 'coordinates' in properties;

      if (hasLatitude || hasLongitude || hasCoordinates) {
        // Initialize section data if it doesn't exist
        if (!updatedData[section.id]) {
          updatedData[section.id] = {};
        }

        // Inject coordinates (for RBL and similar banks with "coordinates" field)
        if (hasCoordinates) {
          updatedData[
            section.id
          ].coordinates = `${coordinates.latitude},${coordinates.longitude}`;
        }

        // Inject separate latitude/longitude fields
        if (hasLatitude) {
          updatedData[section.id].latitude = coordinates.latitude;
        }
        if (hasLongitude) {
          updatedData[section.id].longitude = coordinates.longitude;
        }

        // Also inject region/location/branch if they exist
        if ('region' in properties) {
          updatedData[section.id].region = coordinates.cityName;
        }
        if ('location' in properties) {
          updatedData[section.id].location = coordinates.cityName;
        }
        if ('branch' in properties && !updatedData[section.id].branch) {
          updatedData[section.id].branch = `${coordinates.cityName} Branch`;
        }
      }
    });

    return updatedData;
  };

  const resetForm = () => {
    setFormLoaded(false);
    setSchemaForm(null);
    setSectionData({});
    setInvestigable(null);
    setExpandedSections({investigable: true});
    setItem(null);
    reset();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev: any) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isSectionValid = (sectionId: string) => {
    if (sectionId === 'photoCapture') {
      return sectionData?.uploadedItems?.length > 0;
    }
    if (sectionId === 'investigable') {
      return investigable !== null;
    }
    return (
      sectionData[sectionId] && Object.keys(sectionData[sectionId]).length > 0
    );
  };

  const handleSectionDataChange = useCallback(
    (sectionId: string, data: any) => {
      setSectionData((prevData: any) => ({
        ...prevData,
        [sectionId]: data,
      }));
    },
    [],
  );

  const handleUploadedItemsChange = useCallback(
    async (items: UploadedItem[]) => {
      setSectionData((prevSectionData: any) => {
        const updatedData = {...prevSectionData, uploadedItems: items};
        return updatedData;
      });
    },
    [],
  );

  const handleViewPdf = async () => {
    if (!item?.loanId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Loan ID not available',
      });
      return;
    }

    try {
      // Get auth token (key is 'accessToken' from axios config)
      const token = await getItem('accessToken');

      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Token not found. Please login again.',
        });
        return;
      }

      // Construct full PDF URL (baseURL already has /api)
      const baseUrl = axiosInstance.defaults.baseURL;
      // Remove trailing slash from baseURL and leading slash to avoid double slashes
      const cleanBaseUrl = baseUrl?.endsWith('/')
        ? baseUrl.slice(0, -1)
        : baseUrl;
      const pdfUrl = `${cleanBaseUrl}/loans/${item.loanId}/preview-final-report?type=Business&department=PD`;

      console.log('📄 Opening PDF:', pdfUrl);
      console.log(
        '🔑 Token:',
        token ? `Bearer ${token.substring(0, 20)}...` : 'Missing',
      );

      // Store URL and token for react-native-pdf
      setPdfUrl(pdfUrl);
      setPdfToken(token);
      setShowPdfPreview(true);

      // Set 2 minute timeout
      setTimeout(() => {
        if (showPdfPreview && pdfUrl) {
          console.warn('⏱️ PDF load timeout after 2 minutes');
          Toast.show({
            type: 'error',
            text1: 'PDF Load Timeout',
            text2: 'PDF took too long to load. Please try again.',
            visibilityTime: 4000,
          });
          setShowPdfPreview(false);
          setPdfUrl(null);
          setPdfToken(null);
        }
      }, 120000); // 2 minutes
    } catch (error: any) {
      console.error('❌ PDF GENERATION FAILED:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to generate PDF';
      Toast.show({
        type: 'error',
        text1: 'PDF Generation Failed',
        text2: errorMessage,
        visibilityTime: 4000,
      });
    }
  };

  const onSubmit = async () => {
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

      console.log('🔍 VALIDATION START - Checking form data:', {
        sectionCount: schemaForm.sections.length,
        sectionDataKeys: Object.keys(sectionData),
      });

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

        console.log(`🔍 Checking section: ${section.id}`, {
          required: section.required,
          hasData: sectionDataExists,
          data: sectionData[section.id],
        });

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

          console.log(
            `🔍 Section ${section.id} - Required fields:`,
            requiredFields,
            `(base: ${baseRequiredFields}, conditional: ${
              requiredFields.length !== baseRequiredFields.length
            })`,
          );

          for (const fieldId of requiredFields) {
            const fieldValue = sectionContent[fieldId];

            // For array fields, check if array exists and has items with required fields
            const fieldSchema = section.schema?.properties?.[fieldId];
            if (fieldSchema?.type === 'array' && Array.isArray(fieldValue)) {
              const itemRequiredFields = fieldSchema.items?.required || [];
              console.log(`🔍 Array field ${fieldId}:`, {
                itemCount: fieldValue.length,
                itemRequiredFields,
                items: fieldValue,
              });

              // Check each item in the array for required fields
              fieldValue.forEach((item: any, index: number) => {
                console.log(`🔍 Checking array item [${index}]:`, item);

                if (item && typeof item === 'object') {
                  itemRequiredFields.forEach((requiredField: string) => {
                    const itemFieldValue = item[requiredField];
                    const itemFieldEmpty =
                      itemFieldValue === null ||
                      itemFieldValue === undefined ||
                      itemFieldValue === '' ||
                      (typeof itemFieldValue === 'string' &&
                        itemFieldValue.trim() === '');

                    console.log(
                      `🔍 Item [${index}] field "${requiredField}":`,
                      {
                        value: itemFieldValue,
                        isEmpty: itemFieldEmpty,
                      },
                    );

                    if (itemFieldEmpty) {
                      const itemFieldTitle =
                        fieldSchema.items?.properties?.[requiredField]?.title ||
                        requiredField;
                      const errorMsg = `${section.label} → ${
                        fieldSchema.title
                      } [${
                        index + 1
                      }] → ${itemFieldTitle}: Required field is empty`;
                      console.log('❌ VALIDATION ERROR:', errorMsg);
                      validationErrors.push(errorMsg);
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

      console.log('🔍 VALIDATION COMPLETE:', {
        errorCount: validationErrors.length,
        errors: validationErrors,
      });

      if (validationErrors.length > 0) {
        console.log('🛑 BLOCKING FORM SUBMISSION - Validation failed!');

        Toast.show({
          type: 'error',
          text1: '🪄 Abracadabra - Frontend Validation Error!',
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

      const finalData = {
        verificationType: 'Business',
        findings: 'QA Test - Business Verification Findings',
        addressType: 'Business',
        verificationData: sectionData,
      };

      await submitVerification(finalData, item?.loanId, 'PD');

      await clearItem(STORAGE_KEY);

      // Mark form as submitted so PDF button appears
      setFormSubmitted(true);

      // Show success message with PDF preview option
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Form submitted! Tap "View PDF" button to preview.',
        visibilityTime: 5000,
      });

      // Don't reset form immediately so user can view PDF
      // resetForm() will be called when they close PDF or navigate away
    } catch (error: any) {
      console.error('❌ FORM SUBMISSION FAILED:', error);
      setIsSubmitting(false);

      // Extract meaningful error message
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to submit form data';

      const errorStatus = error?.response?.status;

      console.error('Submission error details:', {
        status: errorStatus,
        message: errorMessage,
        fullError: error?.response?.data,
      });

      Toast.show({
        type: 'error',
        text1: errorStatus ? `Error ${errorStatus}` : 'Submission Error',
        text2: errorMessage,
        visibilityTime: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (formErrors: any) => {
    console.log('Form errors:', formErrors);
    Toast.show({
      type: 'error',
      text1: '🔧 React Hook Form Error',
      text2: 'Please check all required fields',
      visibilityTime: 5000,
      position: 'top',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <BackButton
            navigation={navigation}
            title=""
            hide={false}
            noBorder={true}
          />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>QA Form Testing</Text>
            <View style={styles.testingBadge}>
              <Text style={styles.testingBadgeText}>TESTING MODE</Text>
            </View>
          </View>
        </View>

        {!formLoaded ? (
          <View style={styles.selectorContainer}>
            <Text style={styles.sectionTitle}>Select Bank</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedBank}
                onValueChange={itemValue => setSelectedBank(itemValue)}
                style={styles.picker}>
                <Picker.Item label="-- Select a Bank --" value="" />
                {AVAILABLE_BANKS.map(bank => (
                  <Picker.Item key={bank} label={bank} value={bank} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={[
                styles.loadButton,
                !selectedBank && styles.loadButtonDisabled,
              ]}
              onPress={loadForm}
              disabled={loading || !selectedBank}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loadButtonText}>Load Form</Text>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Icon name="info" size={20} color="#145886" />
              <Text style={styles.infoText}>
                This screen allows you to test all PD forms with pre-populated
                dummy data without going through the initiation process.
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.loadedFormHeader}>
              <View style={styles.bankNameContainer}>
                <Text style={styles.loadedBankLabel}>Testing:</Text>
                <Text style={styles.loadedBankName}>{selectedBank}</Text>
              </View>
              <TouchableOpacity style={styles.changeButton} onPress={resetForm}>
                <Text style={styles.changeButtonText}>Change Bank</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {/* Investigable Section */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection('investigable')}>
                  <Text style={styles.sectionTitle}>
                    Applicant asked to postpone?
                  </Text>
                  {investigable !== null && (
                    <Icon name="check" size={18} color="#34C759" />
                  )}
                  <Text style={styles.sectionIndicator}>
                    {expandedSections.investigable ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>
                {expandedSections.investigable && (
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
                )}
              </View>

              {/* Schema-driven sections */}
              {investigable &&
                schemaForm?.sections?.map((sec: any) => {
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

              {/* Photo Capture Section */}
              {investigable && (
                <>
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

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        isSubmitting && styles.submitButtonDisabled,
                      ]}
                      onPress={handleSubmit(onSubmit, onError)}
                      disabled={isSubmitting}>
                      <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Submitting...' : 'Submit QA Test Form'}
                      </Text>
                    </TouchableOpacity>

                    {item?.loanId && formSubmitted && (
                      <TouchableOpacity
                        style={styles.pdfButton}
                        onPress={handleViewPdf}>
                        <Icon name="picture-as-pdf" size={20} color="#fff" />
                        <Text style={styles.pdfButtonText}>View PDF</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* PDF Preview Modal */}
      <Modal
        visible={showPdfPreview}
        animationType="slide"
        onRequestClose={() => {
          setShowPdfPreview(false);
          setPdfUrl(null);
          setPdfToken(null);
        }}>
        <View style={styles.pdfModal}>
          <View style={styles.pdfModalHeader}>
            <Text style={styles.pdfModalTitle}>PDF Preview</Text>
            <TouchableOpacity
              onPress={() => {
                setShowPdfPreview(false);
                setPdfUrl(null);
                setPdfToken(null);
              }}>
              <Icon name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          {pdfUrl && pdfToken ? (
            <Pdf
              trustAllCerts={false}
              source={{
                uri: pdfUrl,
                cache: false,
                headers: {
                  Authorization: `Bearer ${pdfToken}`,
                },
                expiration: 120, // 2 minute timeout
              }}
              style={styles.pdf}
              onLoadProgress={percent => {
                if (percent === 0) {
                  console.log('📥 PDF download started...');
                } else if (percent < 1) {
                  console.log(
                    `📥 PDF downloading: ${Math.round(percent * 100)}%`,
                  );
                }
              }}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`✅ PDF loaded: ${numberOfPages} pages`);
                console.log(`📄 File path: ${filePath}`);
                Toast.show({
                  type: 'success',
                  text1: 'PDF Loaded Successfully',
                  text2: `${numberOfPages} pages`,
                  visibilityTime: 2000,
                });
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`📄 Page ${page}/${numberOfPages}`);
              }}
              onError={error => {
                console.error('❌ PDF load error:', error);
                Toast.show({
                  type: 'error',
                  text1: 'PDF Display Error',
                  text2: 'Failed to load PDF. Check connection and try again.',
                  visibilityTime: 4000,
                });
                // Close modal on error
                setShowPdfPreview(false);
                setPdfUrl(null);
                setPdfToken(null);
              }}
              enablePaging={true}
              horizontal={false}
              spacing={0}
              fitPolicy={0}
              activityIndicatorProps={{
                color: '#007AFF',
                size: 'large',
              }}
            />
          ) : (
            <View style={styles.pdfLoading}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.pdfLoadingText}>Preparing PDF...</Text>
            </View>
          )}
        </View>
      </Modal>
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
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  testingBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  testingBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectorContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  requiredMark: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  loadButton: {
    backgroundColor: '#145886',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#145886',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  loadedFormHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankNameContainer: {
    flex: 1,
  },
  loadedBankLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  loadedBankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#145886',
  },
  changeButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    padding: 16,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionContent: {
    padding: 16,
  },
  sectionIndicator: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: '#145886',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pdfButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pdfModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  pdfModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  pdf: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pdfMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#145886',
    marginBottom: 8,
    textAlign: 'center',
  },
  pdfSubMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  openPdfButton: {
    backgroundColor: '#145886',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  openPdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pdfLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default QAFormTesting;
