/**
 * Dummy Data Generator for QA Form Testing
 * Generates realistic mock data using faker.js for testing PD forms
 */

import {faker} from '@faker-js/faker';

export const AVAILABLE_BANKS = [
  'Axis Finance UBL Above 10L',
  'Axis Finance UBL Below 10L',
  'Axis Bank',
  'Arka Fincap',
  'Tata Ubl',
  'RBL',
  'HeroHousing-Salaried',
  'HeroHousing-Self',
  'Chola',
  'DCB',
  'Hero Fincorp',
  'ICICI',
  'IDFC HL & ML',
  'IDFC PL',
  'IIFL',
  'Niwas Salaried',
  'Niwas Senp',
  'Yes Bank',
  'SMFG SME',
  'India Shelter SENP',
  'India Shelter Salaried',
  'INCRED',
  'Axis Agri',
  'Aditya Birla',
  'Ambit',
  'Axis Finance',
];

/**
 * Generate realistic Indian coordinates (mocking GPS location)
 * Covers major Indian cities for testing
 */
const generateIndianCoordinates = () => {
  // Major Indian cities coordinates for realistic testing
  const indianCities = [
    {name: 'Mumbai', lat: 19.076, lng: 72.8777},
    {name: 'Delhi', lat: 28.7041, lng: 77.1025},
    {name: 'Bangalore', lat: 12.9716, lng: 77.5946},
    {name: 'Hyderabad', lat: 17.385, lng: 78.4867},
    {name: 'Chennai', lat: 13.0827, lng: 80.2707},
    {name: 'Kolkata', lat: 22.5726, lng: 88.3639},
    {name: 'Pune', lat: 18.5204, lng: 73.8567},
    {name: 'Ahmedabad', lat: 23.0225, lng: 72.5714},
    {name: 'Vijayawada', lat: 16.5062, lng: 80.648},
  ];

  const city = faker.helpers.arrayElement(indianCities);
  // Add small random offset (0.01 to 0.05 degrees) for variation
  const latOffset = (Math.random() - 0.5) * 0.05;
  const lngOffset = (Math.random() - 0.5) * 0.05;

  return {
    latitude: (city.lat + latOffset).toFixed(6),
    longitude: (city.lng + lngOffset).toFixed(6),
    cityName: city.name,
  };
};

/**
 * Generate realistic Indian address
 */
const generateIndianAddress = (cityName: string) => {
  const streetNumber = faker.number.int({min: 1, max: 999});
  const streetName = faker.helpers.arrayElement([
    'MG Road',
    'Main Road',
    'Park Street',
    'Gandhi Road',
    'Nehru Street',
    'Station Road',
    'Market Road',
    'Temple Street',
  ]);
  const area = faker.helpers.arrayElement([
    'Sector',
    'Colony',
    'Nagar',
    'Puram',
    'Layout',
    'Extension',
  ]);
  const areaNumber = faker.number.int({min: 1, max: 50});
  const pincode = faker.number.int({min: 400001, max: 799999});

  return `${streetNumber}, ${streetName}, ${area} ${areaNumber}, ${cityName} - ${pincode}`;
};

/**
 * Generate realistic Indian phone number
 */
const generateIndianPhone = () => {
  const prefix = faker.helpers.arrayElement([
    '98',
    '99',
    '97',
    '96',
    '95',
    '94',
    '93',
    '92',
    '91',
    '90',
  ]);
  const remaining = faker.number.int({min: 10000000, max: 99999999});
  return `${prefix}${remaining}`;
};

/**
 * Generate realistic business name
 */
const generateBusinessName = () => {
  const types = [
    'Enterprises',
    'Industries',
    'Trading Co.',
    'Pvt Ltd',
    'Solutions',
    'Services',
    'Corporation',
  ];
  const prefix = faker.helpers.arrayElement([
    faker.person.lastName(),
    faker.company.name().split(' ')[0],
    faker.location.city().split(' ')[0],
  ]);
  const type = faker.helpers.arrayElement(types);
  return `${prefix} ${type}`;
};

/**
 * Generates comprehensive dummy data for QA testing with faker
 */
export const generateDummyUserData = (bankName: string) => {
  const timestamp = Date.now();
  const coordinates = generateIndianCoordinates();
  const cityName = coordinates.cityName;

  // Generate realistic Indian names
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const coApplicantName = `${faker.person.firstName()} ${faker.person.lastName()}`;

  const address = generateIndianAddress(cityName);
  const phone = generateIndianPhone();
  const businessName = generateBusinessName();
  const applicationNumber = `${bankName.substring(0, 3).toUpperCase()}${faker.number.int({min: 100000, max: 999999})}`;

  // For real database, we'll use a fixed QA test loan ID
  // This should be created in your database (see setup guide)
  const QA_TEST_LOAN_ID = 1; // You can update this to match your QA loan ID
  const QA_TEST_VERIFICATION_ID = 1; // You can update this to match your verification ID

  // Mock userData object (matches the structure expected by PD screen)
  const userData = {
    id: QA_TEST_VERIFICATION_ID,
    type: 'Business',
    status: 'Pending',
    loanId: QA_TEST_LOAN_ID,
    applicantAddress: address,
    businessName: businessName,
    contactNumber: phone,
    coordinates: {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
    loan: {
      applicationId: applicationNumber,
      applicationNumber: applicationNumber,
      applicantName: fullName,
      applicantMobile: phone,
      applicantAddress: address,
      bankName: bankName,
      loanAmount: faker.number.int({min: 500000, max: 10000000}),
      loanType: faker.helpers.arrayElement([
        'Business Loan',
        'Home Loan',
        'LAP',
        'Working Capital',
      ]),
      product: faker.helpers.arrayElement(['LAP', 'BL', 'HL', 'WC']),
      tenure: `${faker.number.int({min: 12, max: 240})} months`,
      accountType: faker.helpers.arrayElement(['Savings', 'Current']),
      accountNo: faker.finance.accountNumber(10),
    },
    applicantName: fullName,
    coApplicantName: coApplicantName,
  };

  // Mock item object (matches the structure expected by PD screen)
  const item = {
    id: QA_TEST_VERIFICATION_ID,
    verificationId: QA_TEST_VERIFICATION_ID,
    loanId: QA_TEST_LOAN_ID,
    name: fullName,
    applicationNumber: applicationNumber,
    address: address,
    businessName: businessName,
    currentOfficeName: `${cityName} Branch`,
    coordinates: {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
  };

  return {userData, item, coordinates};
};

/**
 * Generate realistic family members data
 */
export const generateFamilyMembers = (count: number = 3) => {
  return Array.from({length: count}, () => ({
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    relationship: faker.helpers.arrayElement([
      'Spouse',
      'Father',
      'Mother',
      'Son',
      'Daughter',
      'Brother',
      'Sister',
    ]),
    age: faker.number.int({min: 1, max: 80}),
    education: faker.helpers.arrayElement([
      '10th',
      '12th',
      'Graduate',
      'Post Graduate',
      'Diploma',
      'ITI',
    ]),
    occupation: faker.helpers.arrayElement([
      'Business',
      'Service',
      'Student',
      'Homemaker',
      'Retired',
    ]),
  }));
};

/**
 * Generate realistic banking details
 */
export const generateBankingDetails = (count: number = 2) => {
  const banks = [
    'HDFC Bank',
    'ICICI Bank',
    'SBI',
    'Axis Bank',
    'Kotak Bank',
    'Punjab National Bank',
  ];

  return Array.from({length: count}, () => ({
    bankName: faker.helpers.arrayElement(banks),
    accountType: faker.helpers.arrayElement(['Savings', 'Current', 'CC/OD']),
    accountNo: faker.finance.accountNumber(10),
    noOfYears: faker.number.int({min: 1, max: 15}),
    avgBalance: faker.number.int({min: 10000, max: 500000}),
  }));
};

/**
 * Generate realistic loan details
 */
export const generateExistingLoans = (count: number = 1) => {
  return Array.from({length: count}, () => ({
    bankName: faker.helpers.arrayElement([
      'HDFC',
      'ICICI',
      'SBI',
      'Axis',
      'Bajaj Finserv',
    ]),
    typeOfLoan: faker.helpers.arrayElement([
      'Home Loan',
      'Personal Loan',
      'Auto Loan',
      'Business Loan',
    ]),
    loanAmount: faker.number.int({min: 100000, max: 5000000}),
    emi: faker.number.int({min: 5000, max: 50000}),
    status: faker.helpers.arrayElement(['Open', 'Closed']),
  }));
};

/**
 * Generate realistic asset details
 */
export const generateAssets = (count: number = 1) => {
  return Array.from({length: count}, () => ({
    assetType: faker.helpers.arrayElement([
      'Property',
      'Vehicle',
      'Gold',
      'FD',
      'Mutual Funds',
    ]),
    description: faker.helpers.arrayElement([
      'Residential Property',
      'Commercial Property',
      'Plot',
      '2 Wheeler',
      '4 Wheeler',
    ]),
    marketValue: faker.number.int({min: 500000, max: 10000000}),
    ownerName: `${faker.person.firstName()} ${faker.person.lastName()}`,
  }));
};

/**
 * Generate realistic customer/supplier references
 */
export const generateReferences = (count: number = 2) => {
  return Array.from({length: count}, () => ({
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    contactNumber: generateIndianPhone(),
    businessName: generateBusinessName(),
    feedback: faker.helpers.arrayElement(['Positive', 'Neutral', 'Good']),
  }));
};

/**
 * Get comprehensive bank-specific test data
 */
export const getBankSpecificDummyData = (bankName: string) => {
  const baseData = generateDummyUserData(bankName);

  // Add additional structured data
  const enhancedData = {
    ...baseData,
    familyMembers: generateFamilyMembers(3),
    bankingDetails: generateBankingDetails(2),
    existingLoans: generateExistingLoans(1),
    assets: generateAssets(2),
    suppliers: generateReferences(2),
    customers: generateReferences(2),
  };

  return enhancedData;
};
