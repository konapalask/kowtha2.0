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
              required: true,
            },
            applicantName: {
              type: 'string',
              title: 'Name of the Applicant',
              readOnly: true,
              required: true,
            },
            concernName: {
              type: 'string',
              title: 'Name of Concern',
              required: true,
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
              required: true,
            },
            initiatedAddress: {
              type: 'string',
              title: 'Initiated Address',
              readOnly: true,
              required: true,
            },
            visitedAddress: {
              type: 'string',
              title: 'Visited Address',
              required: true,
            },
            phoneNo: {
              type: 'string',
              title: 'Phone No.',
              pattern: '^[0-9]{10}$',
              readOnly: true,
              required: true,
            },
            appointmentFixed: {
              type: 'string',
              title: 'Appointment Fixed',
              enum: ['Yes', 'No'],
              required: true,
            },
            structureOfLoan: {
              type: 'string',
              title: 'Structure of Loan',
              required: true,
            },
            noOfVisit: {
              type: 'integer',
              title: 'No. of Visit',
              required: true,
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
              required: true,
            },
            aboutApplicant: {
              type: 'string',
              title: 'About Applicant',
              required: true,
            },
            residentialDetails: {
              type: 'string',
              title: 'Residential Details',
              required: true,
            },
            coApplicantDetails: {
              type: 'string',
              title: 'Co-Applicant Details',
              required: true,
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name', required: true},
                  relation: {
                    type: 'string',
                    title: 'Relation with Applicant',
                    required: true,
                  },
                  ageYears: {
                    type: 'integer',
                    title: 'Age (Yrs)',
                    required: true,
                  },
                  qualification: {
                    type: 'string',
                    title: 'Qualification',
                    required: true,
                  },
                  occupation: {
                    type: 'string',
                    title: 'Occupation',
                    required: true,
                  },
                  incomePerMonth: {
                    type: 'number',
                    title: 'Income per month (approx.)',
                    required: true,
                  },
                  dependent: {
                    type: 'string',
                    title: 'Dependent',
                    required: true,
                  },
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  shareholderName: {
                    type: 'string',
                    title: 'Name of the Shareholder',
                    required: true,
                  },
                  relationWithMainApplicant: {
                    type: 'string',
                    title: 'Relation with Main Applicant',
                    required: true,
                  },
                  designation: {
                    type: 'string',
                    title: 'Designation',
                    required: true,
                  },
                  percentShareholding: {
                    type: 'number',
                    title: '% of Shareholding',
                    required: true,
                  },
                  comingIntoLoanStructure: {
                    type: 'string',
                    title: 'Coming into Loan Structure',
                    required: true,
                  },
                  functionalRole: {
                    type: 'string',
                    title: 'Functional of Partner / Director',
                    required: true,
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
              required: true,
            },
            businessSynopsis: {
              type: 'string',
              title: 'Business Synopsis',
              required: true,
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  documentCategory: {
                    type: 'string',
                    title: 'Document Category',
                    required: true,
                  },
                  documentName: {
                    type: 'string',
                    title: 'Document Name',
                    required: true,
                  },
                  documentType: {
                    type: 'string',
                    title: 'Document Type',
                    enum: ['PAN Card'],
                    required: true,
                  },
                  remarks: {type: 'string', title: 'Remarks', required: true},
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
              required: true,
            },
            supplierCreditPeriodDays: {
              type: 'integer',
              title: 'Credit Period in days',
              required: true,
            },
            supplierCashChequeProportion: {
              type: 'number',
              title: 'Cash-Cheque Proportion',
              required: true,
            },
            top3Suppliers: {
              type: 'array',
              title: 'Top 3 Suppliers',
              required: true,
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name', required: true},
                  contactDetails: {
                    type: 'string',
                    title: 'Contact Details',
                    required: true,
                  },
                  location: {type: 'string', title: 'Location', required: true},
                  refCheck: {
                    type: 'string',
                    title: 'Ref. Check',
                    required: true,
                  },
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
              required: true,
            },
            clientCreditPeriodDays: {
              type: 'integer',
              title: 'Credit Period in days',
              required: true,
            },
            clientCashChequeProportion: {
              type: 'number',
              title: 'Cash-Cheque Proportion',
              required: true,
            },
            top3Customers: {
              type: 'array',
              title: 'Top 3 Customers',
              buttonTitle: 'Add Customer',
              required: true,
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name', required: true},
                  contactDetails: {
                    type: 'string',
                    title: 'Contact Details',
                    required: true,
                  },
                  location: {type: 'string', title: 'Location', required: true},
                  refCheck: {
                    type: 'string',
                    title: 'Ref. Check',
                    required: true,
                  },
                },
              },
            },
            averageStockMaintained: {
              type: 'number',
              title: 'Average Stock Maintained',
              required: true,
            },
            turnoverAndMargins: {
              type: 'number',
              title: 'Turnover & Margins',
              required: true,
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  noOfEmployees: {
                    type: 'integer',
                    title: 'No. of Employees',
                    required: true,
                  },
                  salaryPerMonthPerEmployee: {
                    type: 'number',
                    title: 'Salary per Month per Employee',
                    required: true,
                  },
                  statusOfEmployee: {
                    type: 'string',
                    title: 'Status of Employee',
                    enum: ['Contract', 'Full time'],
                    required: true,
                  },
                  noOfLabours: {
                    type: 'integer',
                    title: 'No. of Labours',
                    required: true,
                  },
                  wagesPerMonthOrDay: {
                    type: 'number',
                    title: 'Wages per Month / Per Day',
                    required: true,
                  },
                  statusOfLabour: {
                    type: 'string',
                    title: 'Status of Labour',
                    required: true,
                  },
                  remarks: {type: 'string', title: 'Remarks', required: true},
                },
              },
            },
            workingHours: {
              type: 'string',
              title: 'Working Hours',
              required: true,
            },
            otherMajorExpensesAndBasis: {
              type: 'string',
              title: 'Other Major Expenses & Basis',
              required: true,
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  address: {type: 'string', title: 'Address', required: true},
                  areaMeasurements: {
                    type: 'string',
                    title: 'Area Measurements',
                    required: true,
                  },
                  purchaseCostLakhs: {
                    type: 'number',
                    title: 'Purchase Cost (in Lakhs)',
                    required: true,
                  },
                  purchaseYear: {
                    type: 'integer',
                    title: 'Purchase Year',
                    required: true,
                  },
                  marketValueLakhs: {
                    type: 'number',
                    title: 'Market Value (in Lakhs)',
                    required: true,
                  },
                  ownerName: {
                    type: 'string',
                    title: 'Owner Name',
                    required: true,
                  },
                  mortgaged: {
                    type: 'string',
                    title: 'Mortgaged (Yes/No)',
                    required: true,
                  },
                  liquidMoveableMonetary: {
                    type: 'string',
                    title:
                      'Any Liquid, Moveable & Monetary Items (Cash, Gold, FD, RD, MF, Shares, Bonds, Securities)',
                    required: true,
                  },
                  insurances: {
                    type: 'string',
                    title:
                      'Life Insurance, Mediclaim, Property/Asset Insurance (Premium & Sum Assured)',
                    required: true,
                  },
                },
              },
            },
            capitalInvestedLoansAdvances: {
              type: 'string',
              title: 'Capital Invested in any Business, Loans & Advances given',
              required: true,
            },
            vehicles: {
              type: 'string',
              title: 'Car, Bike and Other Vehicles (Company Name and Model)',
              required: true,
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  bankOrNbfcName: {
                    type: 'string',
                    title: 'Name of Bank / NBFC',
                    required: true,
                  },
                  typeOfLoan: {
                    type: 'string',
                    title: 'Type of Loan',
                    required: true,
                  },
                  sanctionedAmount: {
                    type: 'number',
                    title: 'Sanctioned Amount',
                    required: true,
                  },
                  osBalance: {
                    type: 'number',
                    title: 'O/S Balance',
                    required: true,
                  },
                  emiRs: {
                    type: 'number',
                    title: 'EMI (in Rs.)',
                    required: true,
                  },
                  emiPaidBank: {
                    type: 'string',
                    title: 'EMI Paid Bank',
                    required: true,
                  },
                  securedAgainstAsset: {
                    type: 'string',
                    title: 'Secured Against which Asset',
                    required: true,
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  bankName: {
                    type: 'string',
                    title: 'Bank Name',
                    required: true,
                  },
                  branchName: {
                    type: 'string',
                    title: 'Branch Name',
                    required: true,
                  },
                  accountType: {
                    type: 'string',
                    title: 'Account Type',
                    required: true,
                  },
                  openSinceYear: {
                    type: 'integer',
                    title: 'Open Since (Year)',
                    required: true,
                  },
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  individualOrBusinessName: {
                    type: 'string',
                    title: 'Individual / Business Name',
                    required: true,
                  },
                  address: {type: 'string', title: 'Address', required: true},
                  contactNo: {
                    type: 'string',
                    title: 'Contact No.',
                    required: true,
                  },
                  knowingSince: {
                    type: 'string',
                    title: 'Knowing Since',
                    required: true,
                  },
                  feedbackOnBorrower: {
                    type: 'string',
                    title: 'Feedback on Borrower',
                    required: true,
                  },
                  feedbackOnBusiness: {
                    type: 'string',
                    title: 'Feedback on Business',
                    required: true,
                  },
                },
              },
            },
            otherIncome: {
              type: 'string',
              title: 'Other Income (Income from other than initiated business)',
              required: true,
            },
            siteCoordinates: {
              type: 'string',
              title: 'Site Coordinates',
              readOnly: true,
              required: true,
            },
            observation: {
              type: 'string',
              title: 'Observation',
              required: true,
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
              required: true,
            },
            applicantName: {
              type: 'string',
              title: 'Name of the Applicant',
              readOnly: true,
              required: true,
            },
            concernName: {
              type: 'string',
              title: 'Name of Concern',
              required: true,
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
              required: true,
            },
            initiatedAddress: {
              type: 'string',
              title: 'Initiated Address',
              readOnly: true,
              required: true,
            },
            visitedAddress: {
              type: 'string',
              title: 'Visited Address',
              required: true,
            },
            phoneNo: {
              type: 'string',
              title: 'Phone No.',
              pattern: '^[0-9]{10}$',
              readOnly: true,
              required: true,
            },
            appointmentFixed: {
              type: 'string',
              title: 'Appointment Fixed',
              enum: ['Yes', 'No'],
              required: true,
            },
            structureOfLoan: {
              type: 'string',
              title: 'Structure of Loan',
              required: true,
            },
            noOfVisit: {
              type: 'integer',
              title: 'No. of Visit',
              required: true,
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
              required: true,
            },
            aboutApplicant: {
              type: 'string',
              title: 'About Applicant',
              required: true,
            },
            residentialDetails: {
              type: 'string',
              title: 'Residential Details',
              required: true,
            },
            coApplicantDetails: {
              type: 'string',
              title: 'Co-Applicant Details',
              required: true,
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name', required: true},
                  relation: {
                    type: 'string',
                    title: 'Relation with Applicant',
                    required: true,
                  },
                  ageYears: {
                    type: 'integer',
                    title: 'Age (Yrs)',
                    required: true,
                  },
                  qualification: {
                    type: 'string',
                    title: 'Qualification',
                    required: true,
                  },
                  occupation: {
                    type: 'string',
                    title: 'Occupation',
                    required: true,
                  },
                  incomePerMonth: {
                    type: 'number',
                    title: 'Income per month (approx.)',
                    required: true,
                  },
                  dependent: {
                    type: 'string',
                    title: 'Dependent',
                    required: true,
                  },
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
              required: true,
              items: {
                type: 'object',
                properties: {
                  shareholderName: {
                    type: 'string',
                    title: 'Name of the Shareholder',
                    required: true,
                  },
                  relationWithMainApplicant: {
                    type: 'string',
                    title: 'Relation with Main Applicant',
                    required: true,
                  },
                  designation: {
                    type: 'string',
                    title: 'Designation',
                    required: true,
                  },
                  percentShareholding: {
                    type: 'number',
                    title: '% of Shareholding',
                    required: true,
                  },
                  comingIntoLoanStructure: {
                    type: 'string',
                    title: 'Coming into Loan Structure',
                    required: true,
                  },
                  functionalRole: {
                    type: 'string',
                    title: 'Functional of Partner / Director',
                    required: true,
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
              required: true,
            },
            businessSynopsis: {
              type: 'string',
              title: 'Business Synopsis',
              required: true,
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
            applicationId: {
              type: 'string',
              title: 'Application ID',
              readOnly: true,
              required: true,
            },
            pdDate: {
              type: 'string',
              title: 'PD Date',
              required: true,
            },
            product: {
              type: 'string',
              title: 'Product (HL / LAP / Asha HL)',
              enum: ['HL', 'LAP', 'Asha HL'],
              required: true,
            },
            loanAmount: {
              type: 'string',
              title: 'Loan Amount',
              readOnly: true,
              required: true,
            },
            customerName: {
              type: 'string',
              title: 'Customer Name',
              readOnly: true,
              required: true,
            },
            pdAddress: {
              type: 'string',
              title: 'PD Address (Residence/Office/Factory/Godown)',
              required: true,
            },
            contactNumber: {
              type: 'string',
              title: ' Contact Number (Mobile / Landline)',
              readOnly: true,
              required: true,
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
              required: true,
            },
            relationshipWithBorrower: {
              type: 'string',
              title: 'Relationship with Borrower',
              enum: [
                'Applicant',
                'Co-applicant',
                'Guarantor',
                'Family',
                'Neighbor',
              ],
              required: true,
            },
          },
          required: ['applicationId', 'customerName'],
        },
        required: true,
      },
      {
        id: 'borrowerDetails',
        label: 'Borrower Details',
        schema: {
          type: 'object',
          properties: {
            familyMembers: {
              type: 'array',
              title: 'Family Background',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name', required: true},
                  relationToApplicant: {
                    type: 'string',
                    title: 'Relation to applicant',
                  },
                  age: {type: 'integer', title: 'age', required: true},
                  qualification: {
                    type: 'string',
                    title: 'qualification',
                    required: true,
                  },
                  occupation: {
                    type: 'string',
                    title: 'occupation',
                    required: true,
                  },
                  incomePerMonth: {
                    type: 'number',
                    title: 'income per month',
                    required: true,
                  },
                  dependent: {
                    type: 'string',
                    title: 'dependent',
                    required: true,
                  },
                },
              },
            },
            totalFamilyMembers: {
              type: 'integer',
              title: 'Total Family Members (Nos)',
              required: true,
            },
            noOfEarningMembers: {
              type: 'integer',
              title: 'No. of Earning Members (Nos)',
              required: true,
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
              required: true,
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
            officeDetails: {
              type: 'string',
              title: 'Office Details (If office same as residence)',
              required: false,
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
            natureOfBusinessOther: {
              type: 'string',
              title: 'Spicify Nature of Business (Other)',
            },
            productServicesOffered: {
              type: 'string',
              title: 'Product / Services Offered',
            },
            businessModelBackground: {
              type: 'string',
              title: 'Business Model & Background of Business',
            },
            otherDetailsObserved: {
              type: 'string',
              title: 'Other details observed during visit',
            },
            top3ClientsCustomers: {
              type: 'array',
              title: 'Top 3 Clients (Customers)',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name', required: true},
                  contactDetails: {
                    type: 'string',
                    title: 'Contact Details',
                    required: true,
                  },
                  location: {type: 'string', title: 'Location', required: true},
                },
              },
            },
            top3ClientsSuppliers: {
              type: 'array',
              title: 'Top 3 Clients (Suppliers)',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string', title: 'Name', required: true},
                  contactDetails: {
                    type: 'string',
                    title: 'Contact Details',
                    required: true,
                  },
                  location: {type: 'string', title: 'Location', required: true},
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
            turnoverAndMargin: {
              type: 'string',
              title: 'Turnover and Margin',
              required: true,
            },
            salesFluctuations: {
              type: 'string',
              title: 'Sales fluctuations',
              required: true,
            },
            customerIdentityEstablished: {
              type: 'string',
              title: 'Customer Identity established during PD',
              enum: ['Yes', 'No'],
              required: true,
            },
            charteredACDetails: {
              type: 'string',
              title: 'Chartered A/C details',
              required: true,
            },
            detailsOfExistingLoans: {
              type: 'array',
              title: 'Details of existing loans confirmed during PD',
              required: true,
              items: {
                type: 'object',
                properties: {
                  loanType: {
                    type: 'string',
                    title: 'Loan type',
                    required: true,
                  },
                  loanAmount: {
                    type: 'number',
                    title: 'Loan amount',
                    required: true,
                  },
                  tenure: {
                    type: 'string',
                    title: 'Tenure',
                    required: true,
                  },
                  emi: {
                    type: 'number',
                    title: 'EMI',
                    required: true,
                  },
                  balanceTenure: {
                    type: 'string',
                    title: 'Balance Tenure',
                    required: true,
                  },
                  bankName: {
                    type: 'string',
                    title: 'Bank name',
                    required: true,
                  },
                },
              },
            },
            loansFromFamilyFriends: {
              type: 'string',
              title:
                'Loans taken from family, friends, business associates, etc',
              required: true,
            },
          },
        },
        required: true,
      },
      {
        id: 'workingCapitalDetails',
        label: 'Details of Working Capital (OD/CC) if any',
        schema: {
          type: 'object',
          properties: {
            bankName: {
              type: 'string',
              title: 'Bank name',
              required: true,
            },
            limit: {
              type: 'string',
              title: 'Limit',
              required: true,
            },
            utilisation: {
              type: 'string',
              title: 'Utilisation',
              required: true,
            },
            collateral: {
              type: 'string',
              title: 'Collateral',
              required: true,
            },
            linkedLoans: {
              type: 'string',
              title: 'Linked Loans (if any)',
              required: false,
            },
            endUseOfProposedLoans: {
              type: 'string',
              title: 'End use of Proposed loans in (detailed)',
              required: true,
            },
          },
        },
        required: true,
      },
      {
        id: 'bankingDetails',
        label: 'Banking details',
        schema: {
          type: 'object',
          properties: {
            bankingDetails: {
              type: 'array',
              title: 'Banking details',
              required: true,
              items: {
                type: 'object',
                properties: {
                  bankName: {
                    type: 'string',
                    title: 'Bank name',
                    required: true,
                  },
                  accountType: {
                    type: 'string',
                    title: 'A/c type',
                    required: true,
                  },
                  averageBalances: {
                    type: 'string',
                    title: 'Average balances',
                    required: true,
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'bankingPerformance',
        label: 'Banking performance',
        schema: {
          type: 'object',
          properties: {
            anyChequeBounces: {
              type: 'string',
              title: 'Any Cheque bounces',
              enum: ['Yes', 'No'],
              required: true,
            },
            detailsOfCollateral: {
              type: 'string',
              title: 'Details of collateral',
              required: true,
            },
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
              required: true,
            },
            nameOfApplicant: {
              type: 'string',
              title: 'Name of Applicant',
              readOnly: true,
              required: true,
            },
            nameOfCoApplicant: {
              type: 'string',
              title: 'Name of Co-Applicant',
              required: true,
            },
            phoneNumber: {
              type: 'string',
              title: 'Phone Number',
              readOnly: true,
              required: true,
            },
            nameOfConcern: {
              type: 'string',
              title: 'Name of Concern',
              readOnly: true,
              required: true,
            },
            initiatedAddress: {
              type: 'string',
              title: 'Initiated Address',
              readOnly: true,
              required: true,
            },
            visitedAddress: {
              type: 'string',
              title: 'Visited Address',
              required: true,
            },
            residentialAddress: {
              type: 'string',
              title: 'Residential Address',
              required: true,
            },
            dateTimeOfVisit: {
              type: 'string',
              title: 'Date & Time of Visit',
              required: true,
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
              required: true,
            },
            amountAndPurposeOfLoan: {
              type: 'string',
              title: 'Amount and Purpose of Loan',
              readOnly: true,
              required: true,
            },
            typeOfCollateral: {
              type: 'string',
              title: 'Type of collateral',
              required: true,
            },
            collateralPropertyAddress: {
              type: 'string',
              title: 'Collateral Property Address',
              required: true,
            },
            aboutApplicant: {
              type: 'string',
              title: 'About Applicant(Descriptive section)',
              required: true,
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
              // readOnly: true,
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
              // readOnly: true,
            },
            amount: {
              type: 'string',
              title: 'Amount',
              readOnly: true,
            },
            tenure: {
              type: 'integer',
              title: 'Tenure',
            },
            repaymentFrom: {
              type: 'object',
              title: 'Repayment from',
              properties: {
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
            address: {
              type: 'string',
              title: 'Address',
              readOnly: true,
              required: true,
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
            address: {
              type: 'string',
              title: 'Address',
              required: true,
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
              type: 'integer',
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
              title: 'Address of PD and person met',
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
                  name: {type: 'string', title: 'Name', required: true},
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
                      'Professional',
                    ],
                  },
                  profession: {
                    type: 'string',
                    title: 'Profession',
                    required: true,
                  },
                  relation: {type: 'string', title: 'Relation', required: true},
                  monthlyIncome: {
                    type: 'number',
                    title: 'Monthly income',
                    required: true,
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
            currentBusinessDetails: {
              type: 'array',
              title: 'Current Business Details',
              items: {
                type: 'object',
                properties: {
                  businessDetails: {
                    type: 'string',
                    title: 'Business Details',
                  },
                },
              },
            },
            stockAsOnDay: {
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
              enum: ['Yes', 'No'],
            },
            postLockdownBusinessSpeed: {
              type: 'string',
              title: 'After lockdown, is business running on same speed?',
              enum: ['Yes', 'No'],
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
            totalDebtorsAsOnDay: {
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
                  debtorDays: {type: 'integer', title: 'Debtor Days'},
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
            totalCreditorsAsOnDay: {
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
                  creditorDays: {type: 'integer', title: 'Creditor Days'},
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
                  bank: {type: 'string', title: 'Bank', required: true},
                  natureOfLoan: {type: 'string', title: 'Nature of Loan'},
                  amount: {type: 'number', title: 'Amount', required: true},
                  emi: {type: 'number', title: 'EMI', required: true},
                  tenure: {type: 'string', title: 'Tenure', required: true},
                  outstandingBalance: {
                    type: 'number',
                    title: 'Outstanding Balance',
                    required: true,
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
        id: 'documents',
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
      {
        id: 'finalStatus',
        label: 'Final Status',
        schema: {
          type: 'object',
          properties: {
            dateOfPD: {
              type: 'string',
              title: 'Date of PD',
              format: 'date',
            },
            personMetAtTimeOfPD: {
              type: 'string',
              title: 'Person met at the time of PD',
            },
            phoneNoOfApplicant: {
              type: 'string',
              title: 'Phone no of applicant',
              readOnly: true,
            },
            pdDoneBy: {
              type: 'string',
              title: 'PD done by',
              readOnly: true,
            },
            latitudeLongitude: {
              type: 'string',
              title: 'Latitude and longitude',
              readOnly: true,
            },
            videoLink: {
              type: 'string',
              title: 'Video link',
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
              enum: [
                'Individual',
                'Proprietorship',
                'Partnership Firm',
                'Private Limited Company',
                'Public Limited Company',
                'LLP (Limited Liability Partnership)',
                'Trust',
                'Society',
                'HUF (Hindu Undivided Family)',
                'Others',
              ],
            },
            // meetingDetails: {
            //   type: 'string',
            //   title: 'Meeting Details',
            // },
            addressVisited: {
              type: 'string',
              title: 'Address Visited',
              readOnly: true,
            },
            personMet: {
              type: 'string',
              title: 'Person Met',
              // readOnly: true,
            },
            contactNo: {
              type: 'integer',
              title: 'Contact No',
              readOnly: true,
            },
            // dateOfVisit: {
            //   type: 'string',
            //   title: 'Date of Visit',
            //   readOnly: true,
            // },
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
                  name: {type: 'string', title: 'Name', required: true},
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
                  relation: {type: 'string', title: 'Relation', required: true},
                  remarks: {type: 'string', title: 'Remarks', required: true},
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
              enum: ['Yes', 'No', 'Applied'],
            },
          },
        },
        required: true,
      },
      {
        id: 'tradeReferencesSuppliers',
        label: 'Trade References - Suppliers',
        schema: {
          type: 'object',
          properties: {
            suppliers: {
              type: 'array',
              title: 'Suppliers',
              items: {
                type: 'object',
                properties: {
                  nameOfSuppliers: {type: 'string', title: 'Name of Suppliers'},
                  contactDetails: {
                    type: 'string',
                    title: 'Contact Details',
                    required: true,
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: 'tradeReferencesCustomers',
        label: 'Trade References - Customers',
        schema: {
          type: 'object',
          properties: {
            customers: {
              type: 'array',
              title: 'Customers',
              items: {
                type: 'object',
                properties: {
                  nameOfCustomer: {type: 'string', title: 'Name of Customer'},
                  contactDetails: {
                    type: 'string',
                    title: 'Contact Details',
                    required: true,
                  },
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
                  emi: {type: 'number', title: 'EMI', required: true},
                  pos: {type: 'string', title: 'POS'},
                  remarks: {type: 'string', title: 'Remarks', required: true},
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
            bankingDetails: {
              type: 'array',
              title: 'Banking Details',
              items: {
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
                    enum: [
                      'Savings',
                      'Current',
                      'Overdraft',
                      'Cash Credit',
                      'Term Loan',
                    ],
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
                },
              },
            },
            endUse: {
              type: 'string',
              title: 'End Use',
            },
          },
        },
        required: true,
      },
      {
        id: 'ownContributions',
        label: 'Own Contributions',
        schema: {
          type: 'object',
          properties: {
            ownContributions: {
              type: 'array',
              title: 'Own Contributions',
              items: {
                type: 'object',
                properties: {
                  particulars: {
                    type: 'string',
                    title: 'Particulars',
                  },
                  remarks: {
                    type: 'string',
                    title: 'Remarks',
                  },
                },
              },
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
                    type: 'integer',
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
