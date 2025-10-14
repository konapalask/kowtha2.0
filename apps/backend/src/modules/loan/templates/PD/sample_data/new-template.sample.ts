import { NewTemplateInterface } from '../interface/new-template.interface';

export const newTemplateSampleData: NewTemplateInterface = {
  caseDetails: {
    referenceNumber: 'REF123456789',
    nameOfApplicant: 'John Doe',
    coApplicant: 'Jane Doe',
    typeOfBorrower: 'Individual',
    addressVisited: '123 Main Street, City, State',
    personMet: 'John Doe',
    contactNo: '+91-9876543210',
    dateOfVisit: '15-01-2024'
  },

  businessOwnerDetails: {
    businessOwnerDetails: [
      {
        name: 'John Doe',
        age: 35,
        qualification: 'MBA',
        occupation: 'Business Owner',
        relation: 'Self',
        remarks: 'Experienced entrepreneur with 10+ years in business'
      },
      {
        name: 'Jane Doe',
        age: 32,
        qualification: 'B.Com',
        occupation: 'Co-Owner',
        relation: 'Spouse',
        remarks: 'Handles accounts and administration'
      }
    ]
  },

  familyDetails: {
    aboutApplicant: 'Married with 2 children, residing in own house for 5 years',
    aboutCoApplicant: 'Supportive spouse actively involved in business operations'
  },

  businessDetails: {
    businessName: 'Doe Enterprises',
    typeOfEntity: 'Partnership',
    gstNumber: '29ABCDE1234F1Z5',
    legalName: 'Doe Enterprises Partnership',
    tradeName: 'Doe Traders',
    lastGSTReturn: 'December 2023',
    establishment: '2015',
    shopAddress: '123 Business Street, Commercial Area, City',
    shopOwnership: 'Rented',
    godownAddress: '456 Warehouse Road, Industrial Area, City',
    godownOwnership: 'Owned',
    natureOfBusiness: 'Trading',
    productDetails: 'Electronics and Home Appliances',
    businessProcess: 'Retail and Wholesale',
    margins: '15-20%',
    documentsObserved: 'GST Certificate, Trade License, Bank Statements',
    activityObserved: 'Active trading with regular customer footfall'
  },

  inputsPurchases: {
    detailsOfInputs: 'Electronics, Home Appliances, Accessories',
    purchaseDetails: 'Monthly purchases from authorized distributors',
    orderCycle: 'Monthly',
    avgOrderQnty: 500,
    creditTerms: '30 days',
    otherRemarks: 'Good relationship with suppliers'
  },

  outputsSupply: {
    marketForOutput: 'Local and Regional',
    modeOfMarketing: 'Retail Store and Online',
    typeOfCustomers: 'Individual consumers and small businesses',
    creditTerms: 'Cash and 15 days credit',
    stockOfFinishedGoods: 'Rs. 25,00,000'
  },

  employeeDetails: {
    noOfEmployees: 8,
    salaryDetails: 150000,
    pfEsiApplied: 'Yes'
  },

  tradeReferencesSuppliers: {
    suppliers: [
      {
        nameOfSuppliers: 'ABC Electronics Ltd',
        contactDetails: 'Mr. Rajesh Kumar - +91-9876543211'
      },
      {
        nameOfSuppliers: 'XYZ Appliances Pvt Ltd',
        contactDetails: 'Ms. Priya Sharma - +91-9876543212'
      }
    ]
  },

  tradeReferencesCustomers: {
    customers: [
      {
        nameOfCustomer: 'Local Retailer 1',
        contactDetails: 'Mr. Amit Patel - +91-9876543213'
      },
      {
        nameOfCustomer: 'Local Retailer 2',
        contactDetails: 'Ms. Sunita Singh - +91-9876543214'
      }
    ]
  },

  otherSourcesOfIncome: {
    otherSourcesOfIncome: [
      {
        sourceOfIncome: 'Rental Income',
        details: 'Rs. 25,000 per month from property rental'
      },
      {
        sourceOfIncome: 'Investment Returns',
        details: 'Rs. 15,000 per month from mutual funds'
      }
    ]
  },

  loansDetails: {
    loansDetails: [
      {
        nameOfBankInstitution: 'HDFC Bank',
        product: 'Business Loan',
        loanAmount: 500000,
        emi: 25000,
        pos: 'Rs. 2,00,000',
        remarks: 'Regular payments, good track record'
      }
    ]
  },

  applicantsMainBankingDetails: {
    bankingDetails: [
      {
        bankName: 'HDFC Bank',
        accountHolderName: 'John Doe',
        accountType: 'Current',
        noOfYear: 5,
        limitOfCCOD: 'Rs. 5,00,000',
        remarks: 'Active account with good turnover'
      }
    ],
    endUse: 'Working capital for business expansion'
  },

  ownContributions: {
    ownContributions: [
      {
        particulars: 'Cash Contribution',
        remarks: 'Rs. 2,00,000 from personal savings'
      },
      {
        particulars: 'Property Mortgage',
        remarks: 'Residential property worth Rs. 15,00,000'
      }
    ]
  },

  netWorth: {
    netWorth: [
      {
        typeOfProperty: 'Residential House',
        ownerName: 'John Doe',
        yearsOfOwnership: 5,
        approxMarketValue: 'Rs. 15,00,000'
      },
      {
        typeOfProperty: 'Commercial Property',
        ownerName: 'John Doe',
        yearsOfOwnership: 3,
        approxMarketValue: 'Rs. 25,00,000'
      }
    ]
  },

  particulars: {
    coordinates: 'Lat: 28.6139, Long: 77.2090'
  },

  uploadedItems: [
    {
      id: '1',
      uri: 'sample-image-1.jpg',
      type: 'image',
      pincode: '110001',
      isCamera: true,
      latitude: 28.6139,
      locality: 'New Delhi',
      longitude: 77.2090,
      timestamp: '2024-01-15T10:30:00Z',
      s3ImageUrl: 's3://bucket/sample-image-1.jpg',
      isOverlayNeeded: false
    }
  ]
};
