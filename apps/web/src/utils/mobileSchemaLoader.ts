import { WebFormDefinition } from '@/types/webSchema';
import { convertMobileSchemaToWeb } from './mobileToWebSchemaConverter';
// Import from mobile forms.js - the ACTUAL source of truth used in production
// @ts-ignore - importing from JS file
import { formSchema as mobileFormSchemas } from './mobileSchemas.js';

// Mobile form schemas imported directly from mobile app
/*
// Old hardcoded schemas - now using mobile forms.js
const mobileFormSchemasOld = [
  {
    id: 1,
    bankName: 'Axis Finance UBL Above 10L',
    sections: [
      {
        id: 'basicDetails',
        label: 'Basic Details',
        schema: {
          type: 'object',
          properties: {
            applicationNo: { type: 'string', title: 'Ref No/Application No', readOnly: true },
            applicantName: { type: 'string', title: 'Name of the Applicant', readOnly: true },
            concernName: { type: 'string', title: 'Name of Concern' },
            constitution: { 
              type: 'string', 
              title: 'Constitution',
              enum: ['Proprietorship', 'Private Limited', 'Limited Liability Partnership', 'Simple Partnership']
            },
            initiatedAddress: { type: 'string', title: 'Initiated Address', readOnly: true },
            visitedAddress: { type: 'string', title: 'Visited Address' },
            phoneNo: { type: 'string', title: 'Phone No.', pattern: '^[0-9]{10}$', readOnly: true },
            appointmentFixed: { type: 'string', title: 'Appointment Fixed', enum: ['Yes', 'No'] },
            structureOfLoan: { type: 'string', title: 'Structure of Loan' },
            noOfVisit: { type: 'integer', title: 'No. of Visit' },
            personMet: { type: 'string', title: 'Person Met' },
            aboutApplicant: { type: 'string', title: 'About Applicant' },
            residentialDetails: { type: 'string', title: 'Residential Details' },
            coApplicantDetails: { type: 'string', title: 'Co-Applicant Details' },
          },
          required: ['applicationNo', 'applicantName', 'concernName'],
        },
        required: true,
      },
      {
        id: 'familyDetails',
        label: 'Family Details',
        schema: {
          type: 'object',
          properties: {
            familyDetails: {
              type: 'array',
              title: 'Family Details',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', title: 'Name' },
                  relation: { type: 'string', title: 'Relation with Applicant' },
                  ageYears: { type: 'integer', title: 'Age (Yrs)' },
                  qualification: { type: 'string', title: 'Qualification' },
                  occupation: { type: 'string', title: 'Occupation' },
                  incomePerMonth: { type: 'number', title: 'Income per month (approx.)' },
                  dependent: { type: 'string', title: 'Dependent' },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'shareholdingDetails',
        label: 'Shareholding Details',
        schema: {
          type: 'object',
          properties: {
            shareholdingDetails: {
              type: 'array',
              title: 'Constitution / Shareholding Details',
              items: {
                type: 'object',
                properties: {
                  shareholderName: { type: 'string', title: 'Name of the Shareholder' },
                  relationWithMainApplicant: { type: 'string', title: 'Relation with Main Applicant' },
                  designation: { type: 'string', title: 'Designation' },
                  percentShareholding: { type: 'number', title: '% of Shareholding' },
                  comingIntoLoanStructure: { type: 'string', title: 'Coming into Loan Structure' },
                  functionalRole: { type: 'string', title: 'Functional of Partner / Director' },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'businessDetails',
        label: 'Business Details',
        schema: {
          type: 'object',
          properties: {
            aboutBusiness: { type: 'string', title: 'About the Business' },
            businessSynopsis: { type: 'string', title: 'Business Synopsis' },
          },
        },
        required: true,
      },
      {
        id: 'documentsObserved',
        label: 'Documents Observed',
        schema: {
          type: 'object',
          properties: {
            documentsObserved: {
              type: 'array',
              title: 'Documents Observed',
              items: {
                type: 'object',
                properties: {
                  documentCategory: { type: 'string', title: 'Document Category' },
                  documentName: { type: 'string', title: 'Document Name' },
                  documentType: { type: 'string', title: 'Document Type', enum: ['PAN Card'] },
                  remarks: { type: 'string', title: 'Remarks' },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'suppliersCreditors',
        label: 'Suppliers/Creditors',
        schema: {
          type: 'object',
          properties: {
            noOfFixedSuppliers: { type: 'integer', title: 'No of Fixed Suppliers' },
            supplierCreditPeriodDays: { type: 'integer', title: 'Credit Period in days' },
            supplierCashChequeProportion: { type: 'number', title: 'Cash-Cheque Proportion' },
            top3Suppliers: {
              type: 'array',
              title: 'Top 3 Suppliers',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', title: 'Name' },
                  contactDetails: { type: 'string', title: 'Contact Details' },
                  location: { type: 'string', title: 'Location' },
                  refCheck: { type: 'string', title: 'Ref. Check' },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'clientsDebtors',
        label: 'Clients/Debtors',
        schema: {
          type: 'object',
          properties: {
            noOfFixedCustomers: { type: 'integer', title: 'No of Fixed Customers' },
            clientCreditPeriodDays: { type: 'integer', title: 'Credit Period in days' },
            clientCashChequeProportion: { type: 'number', title: 'Cash-Cheque Proportion' },
            top3Customers: {
              type: 'array',
              title: 'Top 3 Customers',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', title: 'Name' },
                  contactDetails: { type: 'string', title: 'Contact Details' },
                  location: { type: 'string', title: 'Location' },
                  refCheck: { type: 'string', title: 'Ref. Check' },
                },
              },
            },
            averageStockMaintained: { type: 'number', title: 'Average Stock Maintained' },
            turnoverAndMargins: { type: 'number', title: 'Turnover & Margins' },
          },
        },
        required: true,
      },
      {
        id: 'expenditure',
        label: 'Expenditure',
        schema: {
          type: 'object',
          properties: {
            salariesAndWages: {
              type: 'array',
              title: 'Salaries & Wages',
              items: {
                type: 'object',
                properties: {
                  noOfEmployees: { type: 'integer', title: 'No. of Employees' },
                  salaryPerMonthPerEmployee: { type: 'number', title: 'Salary per Month per Employee' },
                  statusOfEmployee: { type: 'string', title: 'Status of Employee', enum: ['Contract', 'Full time'] },
                  noOfLabours: { type: 'integer', title: 'No. of Labours' },
                  wagesPerMonthOrDay: { type: 'number', title: 'Wages per Month / Per Day' },
                  statusOfLabour: { type: 'string', title: 'Status of Labour' },
                  remarks: { type: 'string', title: 'Remarks' },
                },
              },
            },
            workingHours: { type: 'string', title: 'Working Hours' },
            otherMajorExpensesAndBasis: { type: 'string', title: 'Other Major Expenses & Basis' },
          },
        },
        required: true,
      },
      {
        id: 'assetDetails',
        label: 'Asset Details',
        schema: {
          type: 'object',
          properties: {
            assetDetails: {
              type: 'array',
              title: 'Asset Details',
              items: {
                type: 'object',
                properties: {
                  address: { type: 'string', title: 'Address' },
                  areaMeasurements: { type: 'string', title: 'Area Measurements' },
                  purchaseCostLakhs: { type: 'number', title: 'Purchase Cost (in Lakhs)' },
                  purchaseYear: { type: 'integer', title: 'Purchase Year' },
                  marketValueLakhs: { type: 'number', title: 'Market Value (in Lakhs)' },
                  ownerName: { type: 'string', title: 'Owner Name' },
                  mortgaged: { type: 'string', title: 'Mortgaged (Yes/No)' },
                  liquidMoveableMonetary: { type: 'string', title: 'Any Liquid, Moveable & Monetary Items (Cash, Gold, FD, RD, MF, Shares, Bonds, Securities)' },
                  insurances: { type: 'string', title: 'Life Insurance, Mediclaim, Property/Asset Insurance (Premium & Sum Assured)' },
                },
              },
            },
            capitalInvestedLoansAdvances: { type: 'string', title: 'Capital Invested in any Business, Loans & Advances given' },
            vehicles: { type: 'string', title: 'Car, Bike and Other Vehicles (Company Name and Model)' },
          },
        },
        required: true,
      },
      {
        id: 'loanDetails',
        label: 'Existing Loans',
        schema: {
          type: 'object',
          properties: {
            loanDetails: {
              type: 'array',
              title: 'Loan Details',
              items: {
                type: 'object',
                properties: {
                  bankOrNbfcName: { type: 'string', title: 'Name of Bank / NBFC' },
                  typeOfLoan: { type: 'string', title: 'Type of Loan' },
                  sanctionedAmount: { type: 'number', title: 'Sanctioned Amount' },
                  osBalance: { type: 'number', title: 'O/S Balance' },
                  emiRs: { type: 'number', title: 'EMI (in Rs.)' },
                  emiPaidBank: { type: 'string', title: 'EMI Paid Bank' },
                  securedAgainstAsset: { type: 'string', title: 'Secured Against which Asset' },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'bankingDetails',
        label: 'Banking Details',
        schema: {
          type: 'object',
          properties: {
            bankDetails: {
              type: 'array',
              title: 'Bank Details',
              items: {
                type: 'object',
                properties: {
                  bankName: { type: 'string', title: 'Bank Name' },
                  branchName: { type: 'string', title: 'Branch Name' },
                  accountType: { type: 'string', title: 'Account Type' },
                  openSinceYear: { type: 'integer', title: 'Open Since (Year)' },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'thirdPartyCheck',
        label: 'Third Party Check',
        schema: {
          type: 'object',
          properties: {
            thirdPartyCheck: {
              type: 'array',
              title: 'Third Party Check',
              minItems: 2,
              items: {
                type: 'object',
                properties: {
                  individualOrBusinessName: { type: 'string', title: 'Individual / Business Name' },
                  address: { type: 'string', title: 'Address' },
                  contactNo: { type: 'string', title: 'Contact No.' },
                  knowingSince: { type: 'string', title: 'Knowing Since' },
                  feedbackOnBorrower: { type: 'string', title: 'Feedback on Borrower' },
                  feedbackOnBusiness: { type: 'string', title: 'Feedback on Business' },
                },
              },
            },
            otherIncome: { type: 'string', title: 'Other Income (Income from other than initiated business)' },
            siteCoordinates: { type: 'string', title: 'Site Coordinates', readOnly: true },
            observation: { type: 'string', title: 'Observation' },
          },
        },
        required: true,
      },
    ],
  },
  // Axis Finance UBL Below 10L
  {
    id: 2,
    bankName: 'Axis Finance UBL Below 10L',
    sections: [
      {
        id: 'basicDetails',
        label: 'Basic Details',
        schema: {
          type: 'object',
          properties: {
            applicationNo: { type: 'string', title: 'Ref No/Application No', readOnly: true },
            applicantName: { type: 'string', title: 'Name of the Applicant', readOnly: true },
            concernName: { type: 'string', title: 'Name of Concern' },
            constitution: { 
              type: 'string', 
              title: 'Constitution',
              enum: ['Proprietorship', 'Private Limited', 'Limited Liability Partnership', 'Simple Partnership']
            },
            initiatedAddress: { type: 'string', title: 'Initiated Address', readOnly: true },
            visitedAddress: { type: 'string', title: 'Visited Address' },
            phoneNo: { type: 'string', title: 'Phone No.', pattern: '^[0-9]{10}$', readOnly: true },
            appointmentFixed: { type: 'string', title: 'Appointment Fixed', enum: ['Yes', 'No'] },
            structureOfLoan: { type: 'string', title: 'Structure of Loan' },
            noOfVisit: { type: 'integer', title: 'No. of Visit' },
            personMet: { type: 'string', title: 'Person Met' },
            aboutApplicant: { type: 'string', title: 'About Applicant' },
            residentialDetails: { type: 'string', title: 'Residential Details' },
            coApplicantDetails: { type: 'string', title: 'Co-Applicant Details' },
          },
          required: ['applicationNo', 'applicantName', 'concernName'],
        },
        required: true,
      },
      {
        id: 'familyDetails',
        label: 'Family Details',
        schema: {
          type: 'object',
          properties: {
            familyDetails: {
              type: 'array',
              title: 'Family Details',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', title: 'Name' },
                  relation: { type: 'string', title: 'Relation with Applicant' },
                  ageYears: { type: 'integer', title: 'Age (Yrs)' },
                  qualification: { type: 'string', title: 'Qualification' },
                  occupation: { type: 'string', title: 'Occupation' },
                  incomePerMonth: { type: 'number', title: 'Income per month (approx.)' },
                  dependent: { type: 'string', title: 'Dependent' },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'shareholdingDetails',
        label: 'Shareholding Details',
        schema: {
          type: 'object',
          properties: {
            shareholdingDetails: {
              type: 'array',
              title: 'Constitution / Shareholding Details',
              items: {
                type: 'object',
                properties: {
                  shareholderName: { type: 'string', title: 'Name of the Shareholder' },
                  relationWithMainApplicant: { type: 'string', title: 'Relation with Main Applicant' },
                  designation: { type: 'string', title: 'Designation' },
                  percentShareholding: { type: 'number', title: '% of Shareholding' },
                  comingIntoLoanStructure: { type: 'string', title: 'Coming into Loan Structure' },
                  functionalRole: { type: 'string', title: 'Functional of Partner / Director' },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'businessDetails',
        label: 'Business Details',
        schema: {
          type: 'object',
          properties: {
            aboutBusiness: { type: 'string', title: 'About the Business' },
            businessSynopsis: { type: 'string', title: 'Business Synopsis' },
          },
        },
        required: true,
      },
    ],
  },
  // Axis Bank
  {
    id: 3,
    bankName: 'Axis Bank',
    sections: [
      {
        id: 'applicantDetails',
        label: 'Applicant Details',
        schema: {
          type: 'object',
          properties: {
            applicationNo: { type: 'string', title: 'Application No', readOnly: true },
            applicationId: { type: 'string', title: 'Application ID', readOnly: true },
            pdDate: { type: 'string', title: 'PD Date' },
            product: { type: 'string', title: 'Product (HL / LAP / Asha HL)', enum: ['HL', 'LAP', 'Asha HL'] },
            loanAmount: { type: 'string', title: 'Loan Amount', readOnly: true },
            customerName: { type: 'string', title: 'Customer Name', readOnly: true },
            pdAddress: { type: 'string', title: 'PD Address (Residence/Office/Factory/Godown)', enum: ['residence', 'Office', 'Factory', 'Godown'] },
            contactNumber: { type: 'string', title: 'Contact Number (Mobile / Landline)', readOnly: true },
            personMet: { type: 'string', title: 'Person Met' },
            relationshipWithBorrower: { 
              type: 'string', 
              title: 'Relationship with Borrower',
              enum: ['Himself or Herself', 'Co-applicant', 'Guarantor', 'Family', 'Neighbor']
            },
          },
          required: ['applicationId', 'customerName'],
        },
        required: true,
      },
      {
        id: 'familyBackground',
        label: 'Family Background',
        schema: {
          type: 'object',
          properties: {
            familyMembers: {
              type: 'array',
              title: 'Family Background',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', title: 'Name' },
                  relationToApplicant: { type: 'string', title: 'Relation to applicant' },
                  age: { type: 'integer', title: 'age' },
                  qualification: { type: 'string', title: 'qualification' },
                  occupation: { type: 'string', title: 'occupation' },
                  incomePerMonth: { type: 'number', title: 'income per month' },
                  dependent: { type: 'string', title: 'dependent' },
                },
              },
            },
            totalFamilyMembers: { type: 'integer', title: 'Total Family Members (Nos)' },
            noOfEarningMembers: { type: 'integer', title: 'No. of Earning Members (Nos)' },
          },
        },
        required: true,
      },
      {
        id: 'businessPlaceVintage',
        label: 'Business Place & Vintage Details',
        schema: {
          type: 'object',
          properties: {
            nameOfFirm: { type: 'string', title: 'Name of Firm', readOnly: true },
            constitution: { 
              type: 'string', 
              title: 'Constitution (Proprietorship / Partnership / Company / LLP)',
              enum: ['Proprietorship', 'Partnership', 'Company', 'LLP']
            },
            whoStartedBusiness: { 
              type: 'string', 
              title: 'Who started the business (Self / Acquired / Second gen)',
              enum: ['self', 'acquired', 'second gen']
            },
            ownershipOfBusinessPlace: { 
              type: 'string', 
              title: 'Ownership of business place (Self-owned / Rented)',
              enum: ['owned', 'rented']
            },
            yearsInCurrentOffice: { type: 'integer', title: 'Years in current office' },
            yearsInCurrentCity: { type: 'integer', title: 'Years in current city' },
            yearsInCurrentBusiness: { type: 'integer', title: 'Years in current business' },
            previousEmployment: { type: 'string', title: 'Previous employment (if any)' },
            isResiCumOffice: { type: 'string', title: 'Is Resi Cum office?', enum: ['Yes', 'No'] },
          },
        },
        required: true,
      },
      {
        id: 'businessFinancialProfile',
        label: 'Business / Financial Profile',
        schema: {
          type: 'object',
          properties: {
            natureOfBusiness: { 
              type: 'string', 
              title: 'Nature of Business (Trading / Manufacturing / Services / Others)',
              enum: ['Trading', 'Manufacturing', 'Services', 'Others']
            },
            productServicesOffered: { type: 'string', title: 'Product / Services Offered' },
            businessModelBackground: { type: 'string', title: 'Business Model & Background of Business' },
          },
        },
        required: true,
      },
      {
        id: 'businessDetails',
        label: 'Business Details',
        schema: {
          type: 'object',
          properties: {
            aboutTheBusiness: { type: 'string', title: 'About the business' },
            yearBusinessStarted: { type: 'integer', title: 'Year Business Started' },
            typeOfBusiness: { 
              type: 'string', 
              title: 'Type of Business (e.g., Proprietorship/Partnership)',
              enum: ['Proprietorship', 'Private Limited', 'Limited Liability Partnership', 'Simple Partnership']
            },
            businessName: { type: 'string', title: 'Business Name' },
            natureOfBusiness: { type: 'string', title: 'Nature of Business' },
            stockSource: { type: 'string', title: 'Stock Source (Suppliers/Farmers)' },
            stockHandling: { type: 'string', title: 'Stock Handling (Premises / Direct Delivery)' },
            salesVolume: { type: 'string', title: 'Sales Volume' },
            profitPerUnit: { type: 'string', title: 'Profit per Unit' },
            businessPremisesOwnership: { type: 'string', title: 'Business Premises Ownership' },
            numberOfWorkers: { type: 'string', title: 'Number of Workers' },
            wageExpenses: { type: 'string', title: 'Wage Expenses' },
            majorTransactionMode: { type: 'string', title: 'Major Transaction Mode (Cash/Bank)' },
            regularCustomers: {
              type: 'array',
              title: 'Regular Customers',
              items: {
                type: 'object',
                properties: {
                  nameOfRegularCustomers: { type: 'string', title: 'Name of Regular Customers' },
                  contactNumberOfRegularCustomers: { type: 'string', title: 'Contact Number of Regular Customers' },
                },
              },
            },
            regularSuppliers: {
              type: 'array',
              title: 'Regular Suppliers',
              items: {
                type: 'object',
                properties: {
                  nameOfRegularSuppliers: { type: 'string', title: 'Name of Regular Suppliers' },
                  contactNumberOfRegularSuppliers: { type: 'string', title: 'Contact Number of Regular Suppliers' },
                },
              },
            },
            businessActivityObserved: { type: 'string', title: 'Business Activity observed' },
            stockLevelObserved: { type: 'string', title: 'Stock Level observed' },
            documentsObserved: { type: 'string', title: 'Documents Observed' },
            gstRegistration: { type: 'string', title: 'Whether Business was Registered under GST - Yes/No If Yes then mention GST Number', enum: ['Yes', 'No'] },
            gstNumber: { type: 'string', title: 'GST Number' },
            itrFiled: { type: 'string', title: 'ITRs Filed - Yes/No If Yes then mention the income', enum: ['Yes', 'No'] },
            income: { type: 'string', title: 'Income' },
          },
        },
        required: true,
      },
      {
        id: 'otherDetailsObserved',
        label: 'Other details observed during visit',
        schema: {
          type: 'object',
          properties: {
            businessNameBoardSeen: { type: 'string', title: 'Business name board seen', enum: ['Yes', 'no'] },
            noOfEmployeesSeen: { type: 'integer', title: 'No. of employees seen' },
            businessActivitySeen: { type: 'string', title: 'Business activity seen', enum: ['Yes', 'no'] },
            stockSeen: { type: 'string', title: 'Stock seen', enum: ['Yes', 'no'] },
            noOfMachinesSeen: { type: 'integer', title: 'No. of machines seen' },
            top3ClientsCustomers: {
              type: 'array',
              title: 'Top 3 Clients (Customers)',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', title: 'Name' },
                  contactDetails: { type: 'string', title: 'Contact Details' },
                  location: { type: 'string', title: 'Location' },
                },
              },
            },
            top3ClientsSuppliers: {
              type: 'array',
              title: 'Top 3 Clients (Suppliers)',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', title: 'Name' },
                  contactDetails: { type: 'string', title: 'Contact Details' },
                  location: { type: 'string', title: 'Location' },
                },
              },
            },
            otherBusinessIncomeSource: { type: 'string', title: 'Any other business or alternate income source' },
            otherObservationsRemarks: { type: 'string', title: 'Any other observations / remarks during visit' },
            neighborCheckThirdParty: { type: 'string', title: 'Details of neighbor check / Third party check done and status' },
          },
        },
        required: true,
      },
      {
        id: 'commonPoints',
        label: 'Common Points applicable for all cases',
        schema: {
          type: 'object',
          properties: {
            monthlyGrossReceipts: { type: 'string', title: 'Monthly Gross Receipts' },
            monthlyExpenses: { type: 'string', title: 'Monthly Expenses' },
            netProfit: { type: 'string', title: 'Net Profit' },
            netMargin: { type: 'string', title: 'Net Margin' },
            majorExpenses: { type: 'string', title: 'Major Expenses' },
            monthlyHouseholdExpenses: { type: 'string', title: 'Monthly Household Expenses' },
            employees: { type: 'string', title: 'Employees' },
            numberOfEmployees: { type: 'string', title: 'Number of Employees' },
            otherIncomes: { type: 'string', title: 'Other Incomes' },
            concerns: { type: 'string', title: 'Concerns' },
            otherObservation: { type: 'string', title: 'Other Observation' },
            neighborCheckThirdParty: { type: 'string', title: 'Details of neighbor check / Third party check done and status' },
            endUseOfProposedLoan: { type: 'string', title: 'End use of proposed Loan (detailed)' },
            bankingPerformance: { type: 'string', title: 'Banking performance' },
            anyChequeBounces: { type: 'string', title: 'Any cheque bounces (Y/N)', enum: ['Yes', 'no'] },
            detailsOfCollateral: { type: 'string', title: 'Details of collateral (Address of property)' },
          },
        },
        required: true,
      },
    ],
  },
  // Add other banks here...
];
*/

// Use mobile forms.js directly - it's the ACTUAL production schema
// pd_forms.generated.json was found to have incorrect/outdated section structures
const allBankSchemas = mobileFormSchemas;

export function getMobileSchemaByBank(bankName: string): WebFormDefinition | null {
  // Normalize bank name for matching (handle variations like "Rbl" vs "RBL")
  const normalizedBankName = bankName.toLowerCase().trim();
  
  const schema = allBankSchemas.find(
    config => config.bankName.toLowerCase().trim() === normalizedBankName
  );
  
  if (!schema) {
    console.warn(`Schema not found for bank: "${bankName}". Available banks:`, 
      allBankSchemas.map(s => s.bankName));
    return null;
  }
  
  console.log(`✓ Schema found for bank: ${bankName} → ${schema.bankName}`);
  return convertMobileSchemaToWeb(schema);
}

export function getAllMobileBanks(): string[] {
  return allBankSchemas.map(config => config.bankName);
}

export function getSupportedBanks(): string[] {
  // Return all banks from mobile forms.js - the actual production schemas
  return allBankSchemas.map(config => config.bankName);
}
