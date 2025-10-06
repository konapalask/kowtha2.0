export const formSchema = [
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
            applicationNo: {
              type: 'string',
              title: 'Ref No/Application No',
              readOnly: true,
            },
            applicantName: {
              type: 'string',
              title: 'Name of the Applicant',
              readOnly: true,
            },
            concernName: {
              type: 'string',
              title: 'Name of Concern',
            },
            constitution: {
              type: 'string',
              title: 'Constitution',
              enum: [
                'Proprietorship',
                'Private Limited',
                'Limited Liability Partnership',
                'Simple Partnership',
              ],
            },
            initiatedAddress: {
              type: 'string',
              title: 'Initiated Address',
              readOnly: true,
            },
            visitedAddress: {
              type: 'string',
              title: 'Visited Address',
            },
            phoneNo: {
              type: 'string',
              title: 'Phone No.',
              pattern: '^[0-9]{10}$',
              readOnly: true,
            },
            appointmentFixed: {
              type: 'string',
              title: 'Appointment Fixed',
              enum: ['Yes', 'No'],
            },
            structureOfLoan: {
              type: 'string',
              title: 'Structure of Loan',
            },
            noOfVisit: {
              type: 'integer',
              title: 'No. of Visit',
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
            },
            aboutApplicant: {
              type: 'string',
              title: 'About Applicant',
            },
            residentialDetails: {
              type: 'string',
              title: 'Residential Details',
            },
            coApplicantDetails: {
              type: 'string',
              title: 'Co-Applicant Details',
            },
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
                  name: {type: 'string', title: 'Name'},
                  relation: {type: 'string', title: 'Relation with Applicant'},
                  ageYears: {type: 'integer', title: 'Age (Yrs)'},
                  qualification: {type: 'string', title: 'Qualification'},
                  occupation: {type: 'string', title: 'Occupation'},
                  incomePerMonth: {
                    type: 'number',
                    title: 'Income per month (approx.)',
                  },
                  dependent: {type: 'string', title: 'Dependent'},
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
                  shareholderName: {
                    type: 'string',
                    title: 'Name of the Shareholder',
                  },
                  relationWithMainApplicant: {
                    type: 'string',
                    title: 'Relation with Main Applicant',
                  },
                  designation: {type: 'string', title: 'Designation'},
                  percentShareholding: {
                    type: 'number',
                    title: '% of Shareholding',
                  },
                  comingIntoLoanStructure: {
                    type: 'string',
                    title: 'Coming into Loan Structure',
                  },
                  functionalRole: {
                    type: 'string',
                    title: 'Functional of Partner / Director',
                  },
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
            aboutBusiness: {
              type: 'string',
              title: 'About the Business',
            },
            businessSynopsis: {
              type: 'string',
              title: 'Business Synopsis',
            },
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
                  documentCategory: {
                    type: 'string',
                    title: 'Document Category',
                  },
                  documentName: {type: 'string', title: 'Document Name'},
                  documentType: {
                    type: 'string',
                    title: 'Document Type',
                    enum: ['PAN Card'],
                  },
                  remarks: {type: 'string', title: 'Remarks'},
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
            noOfFixedSuppliers: {
              type: 'integer',
              title: 'No of Fixed Suppliers',
            },
            supplierCreditPeriodDays: {
              type: 'integer',
              title: 'Credit Period in days',
            },
            supplierCashChequeProportion: {
              type: 'number',
              title: 'Cash-Cheque Proportion',
            },
            top3Suppliers: {
              type: 'array',
              title: 'Top 3 Suppliers',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name'},
                  contactDetails: {type: 'string', title: 'Contact Details'},
                  location: {type: 'string', title: 'Location'},
                  refCheck: {type: 'string', title: 'Ref. Check'},
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
            noOfFixedCustomers: {
              type: 'integer',
              title: 'No of Fixed Customers',
            },
            clientCreditPeriodDays: {
              type: 'integer',
              title: 'Credit Period in days',
            },
            clientCashChequeProportion: {
              type: 'number',
              title: 'Cash-Cheque Proportion',
            },
            top3Customers: {
              type: 'array',
              title: 'Top 3 Customers',
              buttonTitle: 'Add Customer',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name'},
                  contactDetails: {type: 'string', title: 'Contact Details'},
                  location: {type: 'string', title: 'Location'},
                  refCheck: {type: 'string', title: 'Ref. Check'},
                },
              },
            },
            averageStockMaintained: {
              type: 'number',
              title: 'Average Stock Maintained',
            },
            turnoverAndMargins: {
              type: 'number',
              title: 'Turnover & Margins',
            },
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
                  noOfEmployees: {type: 'integer', title: 'No. of Employees'},
                  salaryPerMonthPerEmployee: {
                    type: 'number',
                    title: 'Salary per Month per Employee',
                  },
                  statusOfEmployee: {
                    type: 'string',
                    title: 'Status of Employee',
                    enum: ['Contract', 'Full time'],
                  },
                  noOfLabours: {type: 'integer', title: 'No. of Labours'},
                  wagesPerMonthOrDay: {
                    type: 'number',
                    title: 'Wages per Month / Per Day',
                  },
                  statusOfLabour: {type: 'string', title: 'Status of Labour'},
                  remarks: {type: 'string', title: 'Remarks'},
                },
              },
            },
            workingHours: {type: 'string', title: 'Working Hours'},
            otherMajorExpensesAndBasis: {
              type: 'string',
              title: 'Other Major Expenses & Basis',
            },
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
                  address: {type: 'string', title: 'Address'},
                  areaMeasurements: {
                    type: 'string',
                    title: 'Area Measurements',
                  },
                  purchaseCostLakhs: {
                    type: 'number',
                    title: 'Purchase Cost (in Lakhs)',
                  },
                  purchaseYear: {type: 'integer', title: 'Purchase Year'},
                  marketValueLakhs: {
                    type: 'number',
                    title: 'Market Value (in Lakhs)',
                  },
                  ownerName: {type: 'string', title: 'Owner Name'},
                  mortgaged: {type: 'string', title: 'Mortgaged (Yes/No)'},
                  liquidMoveableMonetary: {
                    type: 'string',
                    title:
                      'Any Liquid, Moveable & Monetary Items (Cash, Gold, FD, RD, MF, Shares, Bonds, Securities)',
                  },
                  insurances: {
                    type: 'string',
                    title:
                      'Life Insurance, Mediclaim, Property/Asset Insurance (Premium & Sum Assured)',
                  },
                },
              },
            },
            capitalInvestedLoansAdvances: {
              type: 'string',
              title: 'Capital Invested in any Business, Loans & Advances given',
            },
            vehicles: {
              type: 'string',
              title: 'Car, Bike and Other Vehicles (Company Name and Model)',
            },
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
                  bankOrNbfcName: {
                    type: 'string',
                    title: 'Name of Bank / NBFC',
                  },
                  typeOfLoan: {type: 'string', title: 'Type of Loan'},
                  sanctionedAmount: {
                    type: 'number',
                    title: 'Sanctioned Amount',
                  },
                  osBalance: {type: 'number', title: 'O/S Balance'},
                  emiRs: {type: 'number', title: 'EMI (in Rs.)'},
                  emiPaidBank: {type: 'string', title: 'EMI Paid Bank'},
                  securedAgainstAsset: {
                    type: 'string',
                    title: 'Secured Against which Asset',
                  },
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
                  bankName: {type: 'string', title: 'Bank Name'},
                  branchName: {type: 'string', title: 'Branch Name'},
                  accountType: {type: 'string', title: 'Account Type'},
                  openSinceYear: {type: 'integer', title: 'Open Since (Year)'},
                },
              },
            },
          },
        },
        required: true,
      },
      //   {
      //     id: 'additionalDetails',
      //     label: 'Additional Details',
      //     schema: {
      //       type: 'object',
      //       properties: {
      //         otherIncome: {
      //           type: 'string',
      //           title: 'Other Income (Income from other than initiated business)',
      //         },
      //         siteCoordinates: {
      //           type: 'string',
      //           title: 'Site Coordinates',
      //           readOnly: true,
      //         },
      //         observation: {
      //           type: 'string',
      //           title: 'Observation',
      //         },
      //       },
      //     },
      //     required: true,
      //   },
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
                  individualOrBusinessName: {
                    type: 'string',
                    title: 'Individual / Business Name',
                  },
                  address: {type: 'string', title: 'Address'},
                  contactNo: {type: 'string', title: 'Contact No.'},
                  knowingSince: {type: 'string', title: 'Knowing Since'},
                  feedbackOnBorrower: {
                    type: 'string',
                    title: 'Feedback on Borrower',
                  },
                  feedbackOnBusiness: {
                    type: 'string',
                    title: 'Feedback on Business',
                  },
                },
              },
            },
            otherIncome: {
              type: 'string',
              title: 'Other Income (Income from other than initiated business)',
            },
            siteCoordinates: {
              type: 'string',
              title: 'Site Coordinates',
              readOnly: true,
            },
            observation: {
              type: 'string',
              title: 'Observation',
            },
          },
        },
        required: true,
      },
    ],
  },
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
            applicationNo: {
              type: 'string',
              title: 'Ref No/Application No',
              readOnly: true,
            },
            applicantName: {
              type: 'string',
              title: 'Name of the Applicant',
              readOnly: true,
            },
            concernName: {
              type: 'string',
              title: 'Name of Concern',
            },
            constitution: {
              type: 'string',
              title: 'Constitution',
              enum: [
                'Proprietorship',
                'Private Limited',
                'Limited Liability Partnership',
                'Simple Partnership',
              ],
            },
            initiatedAddress: {
              type: 'string',
              title: 'Initiated Address',
              readOnly: true,
            },
            visitedAddress: {
              type: 'string',
              title: 'Visited Address',
            },
            phoneNo: {
              type: 'string',
              title: 'Phone No.',
              pattern: '^[0-9]{10}$',
              readOnly: true,
            },
            appointmentFixed: {
              type: 'string',
              title: 'Appointment Fixed',
              enum: ['Yes', 'No'],
            },
            structureOfLoan: {
              type: 'string',
              title: 'Structure of Loan',
            },
            noOfVisit: {
              type: 'integer',
              title: 'No. of Visit',
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
            },
            aboutApplicant: {
              type: 'string',
              title: 'About Applicant',
            },
            residentialDetails: {
              type: 'string',
              title: 'Residential Details',
            },
            coApplicantDetails: {
              type: 'string',
              title: 'Co-Applicant Details',
            },
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
                  name: {type: 'string', title: 'Name'},
                  relation: {type: 'string', title: 'Relation with Applicant'},
                  ageYears: {type: 'integer', title: 'Age (Yrs)'},
                  qualification: {type: 'string', title: 'Qualification'},
                  occupation: {type: 'string', title: 'Occupation'},
                  incomePerMonth: {
                    type: 'number',
                    title: 'Income per month (approx.)',
                  },
                  dependent: {type: 'string', title: 'Dependent'},
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
                  shareholderName: {
                    type: 'string',
                    title: 'Name of the Shareholder',
                  },
                  relationWithMainApplicant: {
                    type: 'string',
                    title: 'Relation with Main Applicant',
                  },
                  designation: {type: 'string', title: 'Designation'},
                  percentShareholding: {
                    type: 'number',
                    title: '% of Shareholding',
                  },
                  comingIntoLoanStructure: {
                    type: 'string',
                    title: 'Coming into Loan Structure',
                  },
                  functionalRole: {
                    type: 'string',
                    title: 'Functional of Partner / Director',
                  },
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
            aboutBusiness: {
              type: 'string',
              title: 'About the Business',
            },
            businessSynopsis: {
              type: 'string',
              title: 'Business Synopsis',
            },
          },
        },
        required: true,
      },
    ],
  },
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
            applicationNo: {
              type: 'string',
              title: 'Application No',
              readOnly: true,
            },
            applicationId: {
              type: 'string',
              title: 'Application ID',
              readOnly: true,
            },
            pdDate: {
              type: 'string',
              title: 'PD Date',
            },
            product: {
              type: 'string',
              title: 'Product (HL / LAP / Asha HL)',
              enum: ['HL', 'LAP', 'Asha HL'],
            },
            loanAmount: {
              type: 'string',
              title: 'Loan Amount',
              readOnly: true,
            },
            customerName: {
              type: 'string',
              title: 'Customer Name',
              readOnly: true,
            },
            pdAddress: {
              type: 'string',
              title: 'PD Address (Residence/Office/Factory/Godown)',
              enum: ['residence', 'Office', 'Factory', 'Godown'],
            },
            contactNumber: {
              type: 'string',
              title: ' Contact Number (Mobile / Landline)',
              readOnly: true,
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
            },
            relationshipWithBorrower: {
              type: 'string',
              title: 'Relationship with Borrower',
              enum: [
                'Himself or Herself',
                'Co-applicant',
                'Guarantor',
                'Family',
                'Neighbor',
              ],
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
                  name: {type: 'string', title: 'Name'},
                  relationToApplicant: {
                    type: 'string',
                    title: 'Relation to applicant',
                  },
                  age: {type: 'integer', title: 'age'},
                  qualification: {type: 'string', title: 'qualification'},
                  occupation: {type: 'string', title: 'occupation'},
                  incomePerMonth: {type: 'number', title: 'income per month'},
                  dependent: {type: 'string', title: 'dependent'},
                },
              },
            },
            totalFamilyMembers: {
              type: 'integer',
              title: 'Total Family Members (Nos)',
            },
            noOfEarningMembers: {
              type: 'integer',
              title: 'No. of Earning Members (Nos)',
            },
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
            nameOfFirm: {
              type: 'string',
              title: 'Name of Firm',
              readOnly: true,
            },
            constitution: {
              type: 'string',
              title:
                'Constitution (Proprietorship / Partnership / Company / LLP)',
              enum: ['Proprietorship', 'Partnership', 'Company', 'LLP'],
            },
            whoStartedBusiness: {
              type: 'string',
              title: 'Who started the business (Self / Acquired / Second gen)',
              enum: ['self', 'acquired', 'second gen'],
            },
            ownershipOfBusinessPlace: {
              type: 'string',
              title: 'Ownership of business place (Self-owned / Rented)',
              enum: ['owned', 'rented'],
            },
            yearsInCurrentOffice: {
              type: 'integer',
              title: 'Years in current office',
            },
            yearsInCurrentCity: {
              type: 'integer',
              title: 'Years in current city',
            },
            yearsInCurrentBusiness: {
              type: 'integer',
              title: 'Years in current business',
            },
            previousEmployment: {
              type: 'string',
              title: 'Previous employment (if any)',
            },
            isResiCumOffice: {
              type: 'string',
              title: 'Is Resi Cum office?',
              enum: ['Yes', 'No'],
            },
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
              title:
                'Nature of Business (Trading / Manufacturing / Services / Others)',
              enum: ['Trading', 'Manufacturing', 'Services', 'Others'],
            },
            productServicesOffered: {
              type: 'string',
              title: 'Product / Services Offered',
            },
            businessModelBackground: {
              type: 'string',
              title: 'Business Model & Background of Business',
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
            aboutTheBusiness: {
              type: 'string',
              title: 'About the business',
            },
            yearBusinessStarted: {
              type: 'integer',
              title: 'Year Business Started',
            },
            typeOfBusiness: {
              type: 'string',
              title: 'Type of Business (e.g., Proprietorship/Partnership)',
              enum: [
                'Proprietorship',
                'Private Limited',
                'Limited Liability Partnership',
                'Simple Partnership',
              ],
            },
            businessName: {
              type: 'string',
              title: 'Business Name',
            },
            natureOfBusiness: {
              type: 'string',
              title: 'Nature of Business',
            },
            stockSource: {
              type: 'string',
              title: 'Stock Source (Suppliers/Farmers)',
            },
            stockHandling: {
              type: 'string',
              title: 'Stock Handling (Premises / Direct Delivery)',
            },
            salesVolume: {
              type: 'string',
              title: 'Sales Volume',
            },
            profitPerUnit: {
              type: 'string',
              title: 'Profit per Unit',
            },
            businessPremisesOwnership: {
              type: 'string',
              title: 'Business Premises Ownership',
            },
            numberOfWorkers: {
              type: 'string',
              title: 'Number of Workers',
            },
            wageExpenses: {
              type: 'string',
              title: 'Wage Expenses',
            },
            majorTransactionMode: {
              type: 'string',
              title: 'Major Transaction Mode (Cash/Bank)',
            },
            regularCustomers: {
              type: 'array',
              title: 'Regular Customers',
              items: {
                type: 'object',
                properties: {
                  nameOfRegularCustomers: {
                    type: 'string',
                    title: 'Name of Regular Customers',
                  },
                  contactNumberOfRegularCustomers: {
                    type: 'string',
                    title: 'Contact Number of Regular Customers',
                  },
                },
              },
            },
            regularSuppliers: {
              type: 'array',
              title: 'Regular Suppliers',
              items: {
                type: 'object',
                properties: {
                  nameOfRegularSuppliers: {
                    type: 'string',
                    title: 'Name of Regular Suppliers',
                  },
                  contactNumberOfRegularSuppliers: {
                    type: 'string',
                    title: 'Contact Number of Regular Suppliers',
                  },
                },
              },
            },
            businessActivityObserved: {
              type: 'string',
              title: 'Business Activity observed',
            },
            stockLevelObserved: {
              type: 'string',
              title: 'Stock Level observed',
            },
            documentsObserved: {
              type: 'string',
              title: 'Documents Observed',
            },
            gstRegistration: {
              type: 'string',
              title:
                'Whether Business was Registered under GST - Yes/No If Yes then mention GST Number',
              enum: ['Yes', 'No'],
            },
            gstNumber: {
              type: 'string',
              title: 'GST Number',
            },
            itrFiled: {
              type: 'string',
              title: 'ITRs Filed - Yes/No If Yes then mention the income',
              enum: ['Yes', 'No'],
            },
            income: {
              type: 'string',
              title: 'Income',
            },
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
            businessNameBoardSeen: {
              type: 'string',
              title: 'Business name board seen',
              enum: ['Yes', 'no'],
            },
            noOfEmployeesSeen: {
              type: 'integer',
              title: 'No. of employees seen',
            },
            businessActivitySeen: {
              type: 'string',
              title: 'Business activity seen',
              enum: ['Yes', 'no'],
            },
            stockSeen: {
              type: 'string',
              title: 'Stock seen',
              enum: ['Yes', 'no'],
            },
            noOfMachinesSeen: {
              type: 'integer',
              title: 'No. of machines seen',
            },
            top3ClientsCustomers: {
              type: 'array',
              title: 'Top 3 Clients (Customers)',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name'},
                  contactDetails: {type: 'string', title: 'Contact Details'},
                  location: {type: 'string', title: 'Location'},
                },
              },
            },
            top3ClientsSuppliers: {
              type: 'array',
              title: 'Top 3 Clients (Suppliers)',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name'},
                  contactDetails: {type: 'string', title: 'Contact Details'},
                  location: {type: 'string', title: 'Location'},
                },
              },
            },
            otherBusinessIncomeSource: {
              type: 'string',
              title: 'Any other business or alternate income source',
            },
            otherObservationsRemarks: {
              type: 'string',
              title: 'Any other observations / remarks during visit',
            },
            neighborCheckThirdParty: {
              type: 'string',
              title:
                'Details of neighbor check / Third party check done and status',
            },
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
            monthlyGrossReceipts: {
              type: 'string',
              title: 'Monthly Gross Receipts',
            },
            monthlyExpenses: {
              type: 'string',
              title: 'Monthly Expenses',
            },
            netProfit: {
              type: 'string',
              title: 'Net Profit',
            },
            netMargin: {
              type: 'string',
              title: 'Net Margin',
            },
            majorExpenses: {
              type: 'string',
              title: 'Major Expenses',
            },
            monthlyHouseholdExpenses: {
              type: 'string',
              title: 'Monthly Household Expenses',
            },
            employees: {
              type: 'string',
              title: 'Employees',
            },
            numberOfEmployees: {
              type: 'string',
              title: 'Number of Employees',
            },
            otherIncomes: {
              type: 'string',
              title: 'Other Incomes',
            },
            concerns: {
              type: 'string',
              title: 'Concerns',
            },
            otherObservation: {
              type: 'string',
              title: 'Other Observation',
            },
            neighborCheckThirdParty: {
              type: 'string',
              title:
                'Details of neighbor check / Third party check done and status',
            },
          },
          endUseOfProposedLoan: {
            type: 'string',
            title: 'End use of proposed Loan (detailed)',
          },
          bankingPerformance: {
            type: 'string',
            title: 'Banking performance',
          },
          anyChequeBounces: {
            type: 'string',
            title: 'Any cheque bounces (Y/N)',
            enum: ['Yes', 'no'],
          },
          detailsOfCollateral: {
            type: 'string',
            title: 'Details of collateral (Address of property)',
          },
        },
        required: true,
      },
    ],
  },
  {
    id: 4,
    bankName: 'Arka Fincap',
    sections: [
      {
        id: 'applicantDetails',
        label: 'Applicant Details',
        schema: {
          type: 'object',
          properties: {
            applicationNo: {
              type: 'string',
              title: 'Application No',
              readOnly: true,
            },
            nameOfApplicant: {
              type: 'string',
              title: 'Name of Applicant',
              readOnly: true,
            },
            nameOfCoApplicant: {
              type: 'string',
              title: 'Name of Co-Applicant',
            },
            phoneNumber: {
              type: 'string',
              title: 'Phone Number',
              readOnly: true,
            },
            nameOfConcern: {
              type: 'string',
              title: 'Name of Concern',
              readOnly: true,
            },
            initiatedAddress: {
              type: 'string',
              title: 'Initiated Address',
              readOnly: true,
            },
            visitedAddress: {
              type: 'string',
              title: 'Visited Address',
            },
            residentialAddress: {
              type: 'string',
              title: 'Residential Address',
            },
            dateTimeOfVisit: {
              type: 'string',
              title: 'Date & Time of Visit',
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
            },
            amountAndPurposeOfLoan: {
              type: 'string',
              title: 'Amount and Purpose of Loan',
              readOnly: true,
            },
            typeOfCollateral: {
              type: 'string',
              title: 'Type of collateral',
            },
            collateralPropertyAddress: {
              type: 'string',
              title: 'Collateral Property Address',
            },
            aboutApplicant: {
              type: 'string',
              title: 'About Applicant(Descriptive section)',
            },
          },
          required: ['applicationNo', 'nameOfApplicant', 'nameOfConcern'],
        },
        required: true,
      },
    ],
  },
  {
    id: 5,
    bankName: 'Tata Ubl',
    sections: [
      {
        id: 'basicDetails',
        label: 'Basic Details',
        schema: {
          type: 'object',
          properties: {
            nameOfApplicant: {
              type: 'string',
              title: 'Name of Applicant',
              readOnly: true,
            },
            nameOfEntity: {
              type: 'string',
              title: 'Name of Entity',
              readOnly: true,
            },
            nameOfCoApplicants: {
              type: 'string',
              title: 'Name of Co-Applicant(s)',
              readOnly: true,
            },
          },
          required: ['nameOfApplicant', 'nameOfEntity'],
        },
        required: true,
      },
      {
        id: 'proposedLoanDetails',
        label: 'Proposed Loan Details',
        schema: {
          type: 'object',
          properties: {
            product: {
              type: 'string',
              title: 'Product',
              readOnly: true,
            },
            amount: {
              type: 'string',
              title: 'Amount',
              readOnly: true,
            },
            tenure: {
              type: 'string',
              title: 'Tenure',
            },
            repaymentFrom: {
              type: 'string',
              title: 'Repayment from',
            },
            bankName: {
              type: 'string',
              title: 'Bank name',
              readOnly: true,
            },
            typeSAAccount: {
              type: 'string',
              title: 'Type (SA A/C)',
            },
            accountNo: {
              type: 'string',
              title: 'Account No.',
            },
          },
        },
        required: true,
      },
      {
        id: 'officeAddress',
        label: 'Office Address',
        schema: {
          type: 'object',
          properties: {
            add: {
              type: 'string',
              title: 'Add',
            },
            rentedOwned: {
              type: 'string',
              title: 'Rented/Owned',
              enum: ['Rented', 'Owned'],
            },
            ownedBy: {
              type: 'string',
              title: 'Owned by',
            },
            areaSqFt: {
              type: 'string',
              title: 'Area (In Sq. Ft.)',
            },
            occupiedSinceYears: {
              type: 'integer',
              title: 'Occupied since (years)',
            },
            cmvRentPerMonth: {
              type: 'number',
              title: 'CMV / Rent p.m.',
            },
          },
        },
        required: true,
      },
      {
        id: 'residentialAddress',
        label: 'Residential Address',
        schema: {
          type: 'object',
          properties: {
            add: {
              type: 'string',
              title: 'Add',
            },
            rentedOwned: {
              type: 'string',
              title: 'Rented/Owned',
              enum: ['Rented', 'Owned'],
            },
            ownedBy: {
              type: 'string',
              title: 'Owned by',
            },
            areaSqFt: {
              type: 'string',
              title: 'Area (In Sq. Ft.)',
            },
            occupiedSinceYears: {
              type: 'integer',
              title: 'Occupied since (years)',
            },
            cmvRentPerMonth: {
              type: 'number',
              title: 'CMV / Rent p.m.',
            },
            addressOfPDAndPersonMet: {
              type: 'string',
              title: 'Address of PD and persona met',
            },
          },
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
                  name: {type: 'string', title: 'Name'},
                  age: {type: 'integer', title: 'Age'},
                  qualification: {type: 'string', title: 'Qualification'},
                  profession: {type: 'string', title: 'Profession'},
                  relation: {type: 'string', title: 'Relation'},
                  monthlyIncome: {type: 'number', title: 'Monthly income'},
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
            currentBusinessDetails: {
              type: 'string',
              title: 'Current Business Details',
            },
            stockAsOnDate: {
              type: 'string',
              title: 'Stock as on date',
            },
          },
        },
        required: true,
      },
      {
        id: 'employeesDetails',
        label: 'Employees Details',
        schema: {
          type: 'object',
          properties: {
            currentEmployees: {
              type: 'string',
              title: 'Current Employees',
            },
            salaryRange: {
              type: 'string',
              title: 'Salary Range',
            },
            keyEmployeeName: {
              type: 'string',
              title: 'Key Employee Name',
            },
          },
        },
        required: true,
      },
      {
        id: 'bankDetails',
        label: 'Bank Details',
        schema: {
          type: 'object',
          properties: {
            primaryBanker: {
              type: 'string',
              title: 'Primary Banker',
            },
            natureOfAccount: {
              type: 'string',
              title: 'Nature of Account',
            },
            avgBal: {
              type: 'string',
              title: 'Avg. Bal',
            },
          },
        },
        required: true,
      },
      {
        id: 'salesAndProfitDetails',
        label: 'Sales and Profit Details',
        schema: {
          type: 'object',
          properties: {
            turnoverFY202425: {
              type: 'string',
              title: 'Turnover (FY 2024-25)',
            },
            expTurnoverFY202526: {
              type: 'string',
              title: 'Exp. Turnover (FY 2025-26)',
            },
            monthlyTurnoverSales: {
              type: 'string',
              title: 'Monthly Turnover / Sales',
            },
            netMonthlyIncome: {
              type: 'string',
              title: 'Net Monthly Income',
            },
            profitMargin: {
              type: 'string',
              title: 'Profit Margin',
            },
            covidEffectOnTurnover: {
              type: 'string',
              title: 'Is there any effect on turnover due to Covid',
            },
            postLockdownBusinessSpeed: {
              type: 'string',
              title: 'After lockdown, is business running on same speed?',
            },
            cashSalesPercentage: {
              type: 'integer',
              title: 'Cash Sales (% of total turnover)',
            },
          },
        },
        required: true,
      },
      {
        id: 'customerDetails',
        label: 'Customer Details',
        schema: {
          type: 'object',
          properties: {
            totalDebtorsAsOnDate: {
              type: 'integer',
              title: 'Total Debtors as on date',
            },
            totalCustomersNo: {
              type: 'integer',
              title: 'Total Customers (No.)',
            },
            customers: {
              type: 'array',
              title: 'Customers',
              items: {
                type: 'object',
                properties: {
                  nameOfCustomer: {type: 'string', title: 'Name of Customer'},
                  percentageOfTotalSales: {
                    type: 'string',
                    title: '% of Total Sales',
                  },
                  debtorDays: {type: 'string', title: 'Debtor Days'},
                  relationshipSinceYears: {
                    type: 'integer',
                    title: 'Relationship since (years)',
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'supplierDetails',
        label: 'Supplier Details',
        schema: {
          type: 'object',
          properties: {
            totalCreditorsAsOnDate: {
              type: 'integer',
              title: 'Total Creditors as on date',
            },
            totalSuppliersNo: {
              type: 'integer',
              title: 'Total Suppliers (No.)',
            },
            suppliers: {
              type: 'array',
              title: 'Suppliers',
              items: {
                type: 'object',
                properties: {
                  nameOfSupplier: {type: 'string', title: 'Name of Supplier'},
                  percentageOfTotalPurchases: {
                    type: 'string',
                    title: '% of Total Purchases',
                  },
                  creditorDays: {type: 'string', title: 'Creditor Days'},
                  relationshipSinceYears: {
                    type: 'integer',
                    title: 'Relationship since (years)',
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'otherDetails',
        label: 'Other Details',
        schema: {
          type: 'object',
          properties: {
            otherBusinessIncomeDetails: {
              type: 'string',
              title: 'Other Business/Income Details (if any)',
            },
            assets: {
              type: 'string',
              title: 'Assets',
            },
            liabilities: {
              type: 'array',
              title: 'Liabilities',
              items: {
                type: 'object',
                properties: {
                  bank: {type: 'string', title: 'Bank'},
                  natureOfLoan: {type: 'string', title: 'Nature of Loan'},
                  amount: {type: 'number', title: 'Amount'},
                  emi: {type: 'number', title: 'EMI'},
                  tenure: {type: 'string', title: 'Tenure'},
                  outstandingBalance: {
                    type: 'number',
                    title: 'Outstanding Balance',
                  },
                },
              },
            },
            endUseOfProposedLoan: {
              type: 'string',
              title: 'End Use of proposed Loan',
            },
            politicalConnection: {
              type: 'string',
              title: 'Political Connection',
              enum: ['Yes', 'no'],
            },
            anyCourtCases: {
              type: 'string',
              title: 'Any Court Cases',
              enum: ['Yes', 'no'],
            },
            businessIndustry: {
              type: 'string',
              title: 'Business belongs to which industry',
            },
          },
        },
        required: true,
      },
      {
        id: 'valueAddedInformation',
        label: 'Value Added Information',
        schema: {
          type: 'object',
          properties: {
            customerBehavior: {
              type: 'string',
              title: 'Customer Behavior?',
              enum: ['Good', 'Bad', 'Relatively neutral'],
            },
            salariesPaidDuringCovid: {
              type: 'string',
              title: 'Salaries paid during covid to employees?',
              enum: ['Yes', 'Partial', 'No'],
            },
            salaryDeductionPercentage: {
              type: 'integer',
              title: 'If partly paid, % of deduction on salary?',
            },
            neighborhoodShopsNature: {
              type: 'string',
              title:
                'Nature/Types of Neighborhood Shops (E.g. General Store, Jewelry Store, Hardware Store, etc.)',
            },
            digitalWalletUsed: {
              type: 'string',
              title:
                'Digital wallet used in the business? (E.g. PhonePe, Paytm, GooglePay, AmazonPay, JIO Money, Yono SBI, Airtel Money, Etc.)',
            },
            customerShopLocality: {
              type: 'string',
              title:
                'Customer Shop/Office Locality (Slum/Market Road/Main Road/Highway)',
              enum: ['Slum', 'Market Road', 'Main Road', 'Highway'],
            },
            nearbyTransportStand: {
              type: 'string',
              title:
                'Nearby Bus Stop / Taxi Stand / Rickshaw Stand / Metro Station Name',
            },
            utilityBillDetails: {
              type: 'string',
              title:
                'Utility bill (Clear Photo to be Taken) last 2 months & present month units consumption to be written',
            },
            lossSufferedInBusiness: {
              type: 'string',
              title: 'Loss Suffered In Business, If yes, the reason?',
            },
            strengths: {
              type: 'string',
              title: 'Strengths',
            },
            weaknesses: {
              type: 'string',
              title: 'Weaknesses',
            },
          },
        },
        required: true,
      },
      {
        id: 'siteVisitObservations',
        label: 'Site Visit Observations',
        schema: {
          type: 'object',
          properties: {
            namePlateDisplayed: {
              type: 'string',
              title: 'Name Plate Displayed',
              enum: ['Yes', 'no'],
            },
            officeWellFurnished: {
              type: 'string',
              title: 'Office Well Furnished?',
              enum: ['Yes', 'no'],
            },
            businessActivitySeen: {
              type: 'string',
              title: 'Business Activity Seen',
              enum: ['Yes', 'no'],
            },
            difficultyInLocatingPremises: {
              type: 'string',
              title: 'Difficulty in locating premises?',
              enum: ['Yes', 'no'],
            },
            neighborhood: {
              type: 'string',
              title: 'Neighborhood',
            },
            landmark: {
              type: 'string',
              title: 'Landmark',
            },
            abnormalIncreaseDecreaseInTurnover: {
              type: 'string',
              title: 'Abnormal Increase/Decrease in Turnover',
              enum: ['Yes', 'no'],
            },
            anyDecreaseInNetWorth: {
              type: 'string',
              title: 'Any Decrease in Net worth',
              enum: ['Yes', 'no'],
            },
            stockSeenDuringPD: {
              type: 'string',
              title: 'Stock Seen During PD?',
              enum: ['Yes', 'no'],
            },
            noOfEmployeesSeenDuringPD: {
              type: 'integer',
              title: 'No. of employees seen during PD?',
            },
            noOfCustomersSeenDuringPD: {
              type: 'integer',
              title: 'No. of customers seen during PD?',
            },
            thirdPartyConfirmation: {
              type: 'string',
              title: 'Third Party Confirmation',
            },
          },
        },
        required: true,
      },
      {
        id: 'документы',
        label: 'Documents',
        schema: {
          type: 'object',
          properties: {
            panCard: {
              type: 'string',
              title: 'Pan Card',
            },
            otherDocumentSeen: {
              type: 'string',
              title: 'other Document Seen',
            },
          },
        },
        required: true,
      },
    ],
  },
  {
    id: 6,
    bankName: 'RBL',
    sections: [
      {
        id: 'caseDetails',
        label: 'Case Details',
        schema: {
          type: 'object',
          properties: {
            referenceNumber: {
              type: 'string',
              title: 'Reference Number( LOS ID)',
              readOnly: true,
            },
            nameOfApplicant: {
              type: 'string',
              title: 'Name of Applicant',
              readOnly: true,
            },
            coApplicant: {
              type: 'string',
              title: 'Co – Applicant',
            },
            typeOfBorrower: {
              type: 'string',
              title: 'Type of Borrower',
            },
            meetingDetails: {
              type: 'string',
              title: 'Meeting Details',
            },
            addressVisited: {
              type: 'string',
              title: 'Address Visited',
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
            },
            contactNo: {
              type: 'integer',
              title: 'Contact No',
            },
            dateOfVisit: {
              type: 'string',
              title: 'Date of Visit',
            },
          },
          required: ['referenceNumber', 'nameOfApplicant'],
        },
        required: true,
      },
      {
        id: 'businessOwnerDetails',
        label: 'Business owner Details',
        schema: {
          type: 'object',
          properties: {
            businessOwnerDetails: {
              type: 'array',
              title: 'Business owner Details',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name'},
                  age: {type: 'integer', title: 'Age'},
                  qualification: {
                    type: 'string',
                    title: 'Qualification',
                    enum: [
                      'Below 10th',
                      '10th pass',
                      'Under graduate',
                      'Graduate',
                      'Post Graduate',
                    ],
                  },
                  occupation: {type: 'string', title: 'Occupation'},
                  relation: {type: 'string', title: 'Relation'},
                  remarks: {type: 'string', title: 'Remarks'},
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'familyDetails',
        label: 'Family Details',
        schema: {
          type: 'object',
          properties: {
            aboutApplicant: {
              type: 'string',
              title: 'About Applicant',
            },
            aboutCoApplicant: {
              type: 'string',
              title: 'About Co-applicant:',
            },
            andTheirFamilyDetails: {
              type: 'string',
              title: 'And their family details:',
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
            businessName: {
              type: 'string',
              title: 'Business Name',
              readOnly: true,
            },
            typeOfEntity: {
              type: 'string',
              title: 'Type of Entity',
            },
            gstNumber: {
              type: 'string',
              title: 'GST Number',
            },
            legalName: {
              type: 'string',
              title: 'Legal Name',
            },
            tradeName: {
              type: 'string',
              title: 'Trade Name',
            },
            lastGSTReturn: {
              type: 'string',
              title: 'Last GST Return (As per GST records)',
            },
            establishment: {
              type: 'string',
              title: 'Establishment',
            },
            shopAddress: {
              type: 'string',
              title: 'Shop Address',
              readOnly: true,
            },
            shopOwnership: {
              type: 'string',
              title: 'Shop Ownership',
              enum: ['Owned', 'Rented'],
            },
            godownAddress: {
              type: 'string',
              title: 'Godown Address',
            },
            godownOwnership: {
              type: 'string',
              title: 'Godown Ownership',
              enum: ['Owned', 'Rented'],
            },
            natureOfBusiness: {
              type: 'string',
              title: 'Nature of Business',
            },
            productDetails: {
              type: 'string',
              title:
                'Product Details (please also comment on Vintage of the product deals by the firm & Future changes if any)',
            },
            businessProcess: {
              type: 'string',
              title: 'Business Process',
            },
            margins: {
              type: 'string',
              title: 'Margins',
            },
            documentsObserved: {
              type: 'string',
              title: 'Documents Observed',
            },
            activityObserved: {
              type: 'string',
              title: 'Activity Observed',
            },
          },
        },
        required: true,
      },
      {
        id: 'inputsPurchases',
        label: 'Inputs/Purchases',
        schema: {
          type: 'object',
          properties: {
            detailsOfInputs: {
              type: 'string',
              title: 'Details of Inputs',
            },
            purchaseDetails: {
              type: 'string',
              title: 'Purchase Details',
            },
            orderCycle: {
              type: 'string',
              title: 'Order Cycle',
            },
            avgOrderQnty: {
              type: 'string',
              title: 'Avg Order Qnty',
            },
            creditTerms: {
              type: 'string',
              title: 'Credit Terms',
            },
            otherRemarks: {
              type: 'string',
              title: 'Other Remarks',
            },
          },
        },
        required: true,
      },
      {
        id: 'outputsSupply',
        label: 'Outputs/Supply',
        schema: {
          type: 'object',
          properties: {
            marketForOutput: {
              type: 'string',
              title: 'Market for Output',
            },
            modeOfMarketing: {
              type: 'string',
              title: 'Mode of Marketing',
            },
            typeOfCustomers: {
              type: 'string',
              title: 'Type of Customers',
            },
            creditTerms: {
              type: 'string',
              title: 'Credit Terms',
            },
            stockOfFinishedGoods: {
              type: 'string',
              title: 'Stock of Finished Goods',
            },
          },
        },
        required: true,
      },
      {
        id: 'employeeDetails',
        label: 'Employee Details',
        schema: {
          type: 'object',
          properties: {
            noOfEmployees: {
              type: 'integer',
              title: 'No. of Employees',
            },
            salaryDetails: {
              type: 'string',
              title: 'Salary Details',
            },
            pfEsiApplied: {
              type: 'string',
              title: 'PF/ESI Applied',
            },
          },
        },
        required: true,
      },
      {
        id: 'tradeReferences',
        label: 'Trade References',
        schema: {
          type: 'object',
          properties: {
            suppliers: {
              type: 'array',
              title: 'Trade References - Suppliers',
              items: {
                type: 'object',
                properties: {
                  nameOfSuppliers: {type: 'string', title: 'Name of Suppliers'},
                  contactDetails: {type: 'string', title: 'Contact Details'},
                },
              },
            },
            customers: {
              type: 'array',
              title: 'Trade References - Customers',
              items: {
                type: 'object',
                properties: {
                  nameOfCustomer: {type: 'string', title: 'Name of Customer'},
                  contactDetails: {type: 'string', title: 'Contact Details'},
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'otherSourcesOfIncome',
        label: 'Other sources of Income',
        schema: {
          type: 'object',
          properties: {
            otherSourcesOfIncome: {
              type: 'array',
              title: 'Other sources of Income',
              items: {
                type: 'object',
                properties: {
                  sourceOfIncome: {type: 'string', title: 'Source of Income'},
                  details: {type: 'string', title: 'Details'},
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'loansDetails',
        label: 'Loans Details',
        schema: {
          type: 'object',
          properties: {
            loansDetails: {
              type: 'array',
              title: 'Loans Details',
              items: {
                type: 'object',
                properties: {
                  nameOfBankInstitution: {
                    type: 'string',
                    title: 'Name of Bank / Institution',
                  },
                  product: {type: 'string', title: 'Product'},
                  loanAmount: {type: 'number', title: 'Loan amount'},
                  emi: {type: 'number', title: 'EMI'},
                  os: {type: 'string', title: 'O/S'},
                  remarks: {type: 'string', title: 'Remarks'},
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'applicantsMainBankingDetails',
        label: "Applicant's main Banking Details",
        schema: {
          type: 'object',
          properties: {
            bankName: {
              type: 'string',
              title: 'Bank Name',
            },
            accountHolderName: {
              type: 'string',
              title: 'Account Holder name',
            },
            accountType: {
              type: 'string',
              title: 'Account type',
            },
            noOfYear: {
              type: 'integer',
              title: 'No of year',
            },
            limitOfCCOD: {
              type: 'string',
              title: 'Limit of CC/OD',
            },
            remarks: {
              type: 'string',
              title: 'Remarks',
            },
            endUse: {
              type: 'string',
              title: 'End Use',
            },
            ownContribution: {
              type: 'string',
              title: 'Own contribution',
            },
            particulars: {
              type: 'string',
              title: 'Particulars',
            },
            remarksAdditional: {
              type: 'string',
              title: 'Remarks',
            },
          },
        },
        required: true,
      },
      {
        id: 'netWorth',
        label: 'Net Worth',
        schema: {
          type: 'object',
          properties: {
            netWorth: {
              type: 'array',
              title: 'Net Worth',
              items: {
                type: 'object',
                properties: {
                  typeOfProperty: {
                    type: 'string',
                    title:
                      'Type of property / Other investments like gold , LIC , FC etc.,',
                  },
                  ownerName: {type: 'string', title: 'Owner name'},
                  approxMarketValue: {
                    type: 'string',
                    title: 'Approx. Market value',
                  },
                  yearsOfOwnership: {
                    type: 'string',
                    title: 'Years of ownership',
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'particulars',
        label: 'Particulars',
        schema: {
          type: 'object',
          properties: {
            coordinates: {
              type: 'string',
              title: 'Coordinates',
              readOnly: true,
            },
          },
        },
        required: true,
      },
    ],
  },
];

const getFormConfigByBank = bankName => {
  return (
    formSchema.find(
      config => config.bankName.toLowerCase() === bankName.toLowerCase(),
    ) || null
  );
};

const getAvailableBanks = () => {
  return formSchema.map(config => config.bankName);
};

module.exports = {
  formSchema,
  getFormConfigByBank,
  getAvailableBanks,
};
