// Additional bank schemas for Arka Fincap, Tata Ubl, and RBL
export const additionalBankSchemas = [
  // Arka Fincap
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
            applicationNo: { type: 'string', title: 'Application No', readOnly: true },
            nameOfApplicant: { type: 'string', title: 'Name of Applicant', readOnly: true },
            nameOfCoApplicant: { type: 'string', title: 'Name of Co-Applicant' },
            phoneNumber: { type: 'string', title: 'Phone Number', readOnly: true },
            nameOfConcern: { type: 'string', title: 'Name of Concern', readOnly: true },
            initiatedAddress: { type: 'string', title: 'Initiated Address', readOnly: true },
            visitedAddress: { type: 'string', title: 'Visited Address' },
            residentialAddress: { type: 'string', title: 'Residential Address' },
            dateTimeOfVisit: { type: 'string', title: 'Date & Time of Visit' },
            personMet: { type: 'string', title: 'Person Met' },
            amountAndPurposeOfLoan: { type: 'string', title: 'Amount and Purpose of Loan', readOnly: true },
            typeOfCollateral: { type: 'string', title: 'Type of collateral' },
            collateralPropertyAddress: { type: 'string', title: 'Collateral Property Address' },
            aboutApplicant: { type: 'string', title: 'About Applicant(Descriptive section)' },
          },
          required: ['applicationNo', 'nameOfApplicant', 'nameOfConcern'],
        },
        required: true,
      },
    ],
  },
  // Tata Ubl
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
            nameOfApplicant: { type: 'string', title: 'Name of Applicant', readOnly: true },
            nameOfEntity: { type: 'string', title: 'Name of Entity', readOnly: true },
            nameOfCoApplicants: { type: 'string', title: 'Name of Co-Applicant(s)', readOnly: true },
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
            product: { type: 'string', title: 'Product', readOnly: true },
            amount: { type: 'string', title: 'Amount', readOnly: true },
            tenure: { type: 'string', title: 'Tenure' },
            repaymentFrom: { type: 'string', title: 'Repayment from' },
            bankName: { type: 'string', title: 'Bank name', readOnly: true },
            typeSAAccount: { type: 'string', title: 'Type (SA A/C)' },
            accountNo: { type: 'string', title: 'Account No.' },
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
            add: { type: 'string', title: 'Add' },
            rentedOwned: { type: 'string', title: 'Rented/Owned', enum: ['Rented', 'Owned'] },
            ownedBy: { type: 'string', title: 'Owned by' },
            areaSqFt: { type: 'string', title: 'Area (In Sq. Ft.)' },
            occupiedSinceYears: { type: 'integer', title: 'Occupied since (years)' },
            cmvRentPerMonth: { type: 'number', title: 'CMV / Rent p.m.' },
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
            add: { type: 'string', title: 'Add' },
            rentedOwned: { type: 'string', title: 'Rented/Owned', enum: ['Rented', 'Owned'] },
            ownedBy: { type: 'string', title: 'Owned by' },
            areaSqFt: { type: 'string', title: 'Area (In Sq. Ft.)' },
            occupiedSinceYears: { type: 'integer', title: 'Occupied since (years)' },
            cmvRentPerMonth: { type: 'number', title: 'CMV / Rent p.m.' },
            addressOfPDAndPersonMet: { type: 'string', title: 'Address of PD and persona met' },
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
                  name: { type: 'string', title: 'Name' },
                  age: { type: 'integer', title: 'Age' },
                  qualification: { type: 'string', title: 'Qualification' },
                  profession: { type: 'string', title: 'Profession' },
                  relation: { type: 'string', title: 'Relation' },
                  monthlyIncome: { type: 'number', title: 'Monthly income' },
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
            currentBusinessDetails: { type: 'string', title: 'Current Business Details' },
            stockAsOnDate: { type: 'string', title: 'Stock as on date' },
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
            currentEmployees: { type: 'string', title: 'Current Employees' },
            salaryRange: { type: 'string', title: 'Salary Range' },
            keyEmployeeName: { type: 'string', title: 'Key Employee Name' },
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
            primaryBanker: { type: 'string', title: 'Primary Banker' },
            natureOfAccount: { type: 'string', title: 'Nature of Account' },
            avgBal: { type: 'string', title: 'Avg. Bal' },
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
            turnoverFY202425: { type: 'string', title: 'Turnover (FY 2024-25)' },
            expTurnoverFY202526: { type: 'string', title: 'Exp. Turnover (FY 2025-26)' },
            monthlyTurnoverSales: { type: 'string', title: 'Monthly Turnover / Sales' },
            netMonthlyIncome: { type: 'string', title: 'Net Monthly Income' },
            profitMargin: { type: 'string', title: 'Profit Margin' },
            covidEffectOnTurnover: { type: 'string', title: 'Is there any effect on turnover due to Covid' },
            postLockdownBusinessSpeed: { type: 'string', title: 'After lockdown, is business running on same speed?' },
            cashSalesPercentage: { type: 'integer', title: 'Cash Sales (% of total turnover)' },
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
            totalDebtorsAsOnDate: { type: 'integer', title: 'Total Debtors as on date' },
            totalCustomersNo: { type: 'integer', title: 'Total Customers (No.)' },
            customers: {
              type: 'array',
              title: 'Customers',
              items: {
                type: 'object',
                properties: {
                  nameOfCustomer: { type: 'string', title: 'Name of Customer' },
                  percentageOfTotalSales: { type: 'string', title: '% of Total Sales' },
                  debtorDays: { type: 'string', title: 'Debtor Days' },
                  relationshipSinceYears: { type: 'integer', title: 'Relationship since (years)' },
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
            totalCreditorsAsOnDate: { type: 'integer', title: 'Total Creditors as on date' },
            totalSuppliersNo: { type: 'integer', title: 'Total Suppliers (No.)' },
            suppliers: {
              type: 'array',
              title: 'Suppliers',
              items: {
                type: 'object',
                properties: {
                  nameOfSupplier: { type: 'string', title: 'Name of Supplier' },
                  percentageOfTotalPurchases: { type: 'string', title: '% of Total Purchases' },
                  creditorDays: { type: 'string', title: 'Creditor Days' },
                  relationshipSinceYears: { type: 'integer', title: 'Relationship since (years)' },
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
            otherBusinessIncomeDetails: { type: 'string', title: 'Other Business/Income Details (if any)' },
            assets: { type: 'string', title: 'Assets' },
            liabilities: {
              type: 'array',
              title: 'Liabilities',
              items: {
                type: 'object',
                properties: {
                  bank: { type: 'string', title: 'Bank' },
                  natureOfLoan: { type: 'string', title: 'Nature of Loan' },
                  amount: { type: 'number', title: 'Amount' },
                  emi: { type: 'number', title: 'EMI' },
                  tenure: { type: 'string', title: 'Tenure' },
                  outstandingBalance: { type: 'number', title: 'Outstanding Balance' },
                },
              },
            },
            endUseOfProposedLoan: { type: 'string', title: 'End Use of proposed Loan' },
            politicalConnection: { type: 'string', title: 'Political Connection', enum: ['Yes', 'no'] },
            anyCourtCases: { type: 'string', title: 'Any Court Cases', enum: ['Yes', 'no'] },
            businessIndustry: { type: 'string', title: 'Business belongs to which industry' },
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
            customerBehavior: { type: 'string', title: 'Customer Behavior?', enum: ['Good', 'Bad', 'Relatively neutral'] },
            salariesPaidDuringCovid: { type: 'string', title: 'Salaries paid during covid to employees?', enum: ['Yes', 'Partial', 'No'] },
            salaryDeductionPercentage: { type: 'integer', title: 'If partly paid, % of deduction on salary?' },
            neighborhoodShopsNature: { type: 'string', title: 'Nature/Types of Neighborhood Shops (E.g. General Store, Jewelry Store, Hardware Store, etc.)' },
            digitalWalletUsed: { type: 'string', title: 'Digital wallet used in the business? (E.g. PhonePe, Paytm, GooglePay, AmazonPay, JIO Money, Yono SBI, Airtel Money, Etc.)' },
            customerShopLocality: { type: 'string', title: 'Customer Shop/Office Locality (Slum/Market Road/Main Road/Highway)', enum: ['Slum', 'Market Road', 'Main Road', 'Highway'] },
            nearbyTransportStand: { type: 'string', title: 'Nearby Bus Stop / Taxi Stand / Rickshaw Stand / Metro Station Name' },
            utilityBillDetails: { type: 'string', title: 'Utility bill (Clear Photo to be Taken) last 2 months & present month units consumption to be written' },
            lossSufferedInBusiness: { type: 'string', title: 'Loss Suffered In Business, If yes, the reason?' },
            strengths: { type: 'string', title: 'Strengths' },
            weaknesses: { type: 'string', title: 'Weaknesses' },
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
            namePlateDisplayed: { type: 'string', title: 'Name Plate Displayed', enum: ['Yes', 'no'] },
            officeWellFurnished: { type: 'string', title: 'Office Well Furnished?', enum: ['Yes', 'no'] },
            businessActivitySeen: { type: 'string', title: 'Business Activity Seen', enum: ['Yes', 'no'] },
            difficultyInLocatingPremises: { type: 'string', title: 'Difficulty in locating premises?', enum: ['Yes', 'no'] },
            neighborhood: { type: 'string', title: 'Neighborhood' },
            landmark: { type: 'string', title: 'Landmark' },
            abnormalIncreaseDecreaseInTurnover: { type: 'string', title: 'Abnormal Increase/Decrease in Turnover', enum: ['Yes', 'no'] },
            anyDecreaseInNetWorth: { type: 'string', title: 'Any Decrease in Net worth', enum: ['Yes', 'no'] },
            stockSeenDuringPD: { type: 'string', title: 'Stock Seen During PD?', enum: ['Yes', 'no'] },
            noOfEmployeesSeenDuringPD: { type: 'integer', title: 'No. of employees seen during PD?' },
            noOfCustomersSeenDuringPD: { type: 'integer', title: 'No. of customers seen during PD?' },
            thirdPartyConfirmation: { type: 'string', title: 'Third Party Confirmation' },
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
            panCard: { type: 'string', title: 'Pan Card' },
            otherDocumentSeen: { type: 'string', title: 'other Document Seen' },
          },
        },
        required: true,
      },
    ],
  },
  // RBL
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
            referenceNumber: { type: 'string', title: 'Reference Number( LOS ID)', readOnly: true },
            nameOfApplicant: { type: 'string', title: 'Name of Applicant', readOnly: true },
            coApplicant: { type: 'string', title: 'Co – Applicant' },
            typeOfBorrower: { type: 'string', title: 'Type of Borrower' },
            meetingDetails: { type: 'string', title: 'Meeting Details' },
            addressVisited: { type: 'string', title: 'Address Visited' },
            personMet: { type: 'string', title: 'Person Met' },
            contactNo: { type: 'integer', title: 'Contact No' },
            dateOfVisit: { type: 'string', title: 'Date of Visit' },
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
                  name: { type: 'string', title: 'Name' },
                  age: { type: 'integer', title: 'Age' },
                  qualification: { 
                    type: 'string', 
                    title: 'Qualification',
                    enum: ['Below 10th', '10th pass', 'Under graduate', 'Graduate', 'Post Graduate']
                  },
                  occupation: { type: 'string', title: 'Occupation' },
                  relation: { type: 'string', title: 'Relation' },
                  remarks: { type: 'string', title: 'Remarks' },
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
            aboutApplicant: { type: 'string', title: 'About Applicant' },
            aboutCoApplicant: { type: 'string', title: 'About Co-applicant:' },
            andTheirFamilyDetails: { type: 'string', title: 'And their family details:' },
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
            businessName: { type: 'string', title: 'Business Name', readOnly: true },
            typeOfEntity: { type: 'string', title: 'Type of Entity' },
            gstNumber: { type: 'string', title: 'GST Number' },
            legalName: { type: 'string', title: 'Legal Name' },
            tradeName: { type: 'string', title: 'Trade Name' },
            lastGSTReturn: { type: 'string', title: 'Last GST Return (As per GST records)' },
            establishment: { type: 'string', title: 'Establishment' },
            shopAddress: { type: 'string', title: 'Shop Address', readOnly: true },
            shopOwnership: { type: 'string', title: 'Shop Ownership', enum: ['Owned', 'Rented'] },
            godownAddress: { type: 'string', title: 'Godown Address' },
            godownOwnership: { type: 'string', title: 'Godown Ownership', enum: ['Owned', 'Rented'] },
            natureOfBusiness: { type: 'string', title: 'Nature of Business' },
            productDetails: { type: 'string', title: 'Product Details (please also comment on Vintage of the product deals by the firm & Future changes if any)' },
            businessProcess: { type: 'string', title: 'Business Process' },
            margins: { type: 'string', title: 'Margins' },
            documentsObserved: { type: 'string', title: 'Documents Observed' },
            activityObserved: { type: 'string', title: 'Activity Observed' },
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
            detailsOfInputs: { type: 'string', title: 'Details of Inputs' },
            purchaseDetails: { type: 'string', title: 'Purchase Details' },
            orderCycle: { type: 'string', title: 'Order Cycle' },
            avgOrderQnty: { type: 'string', title: 'Avg Order Qnty' },
            creditTerms: { type: 'string', title: 'Credit Terms' },
            otherRemarks: { type: 'string', title: 'Other Remarks' },
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
            marketForOutput: { type: 'string', title: 'Market for Output' },
            modeOfMarketing: { type: 'string', title: 'Mode of Marketing' },
            typeOfCustomers: { type: 'string', title: 'Type of Customers' },
            creditTerms: { type: 'string', title: 'Credit Terms' },
            stockOfFinishedGoods: { type: 'string', title: 'Stock of Finished Goods' },
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
            noOfEmployees: { type: 'integer', title: 'No. of Employees' },
            salaryDetails: { type: 'string', title: 'Salary Details' },
            pfEsiApplied: { type: 'string', title: 'PF/ESI Applied' },
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
                  nameOfSuppliers: { type: 'string', title: 'Name of Suppliers' },
                  contactDetails: { type: 'string', title: 'Contact Details' },
                },
              },
            },
            customers: {
              type: 'array',
              title: 'Trade References - Customers',
              items: {
                type: 'object',
                properties: {
                  nameOfCustomer: { type: 'string', title: 'Name of Customer' },
                  contactDetails: { type: 'string', title: 'Contact Details' },
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
                  sourceOfIncome: { type: 'string', title: 'Source of Income' },
                  details: { type: 'string', title: 'Details' },
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
                  nameOfBankInstitution: { type: 'string', title: 'Name of Bank / Institution' },
                  product: { type: 'string', title: 'Product' },
                  loanAmount: { type: 'number', title: 'Loan amount' },
                  emi: { type: 'number', title: 'EMI' },
                  os: { type: 'string', title: 'O/S' },
                  remarks: { type: 'string', title: 'Remarks' },
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
            bankName: { type: 'string', title: 'Bank Name' },
            accountHolderName: { type: 'string', title: 'Account Holder name' },
            accountType: { type: 'string', title: 'Account type' },
            noOfYear: { type: 'integer', title: 'No of year' },
            limitOfCCOD: { type: 'string', title: 'Limit of CC/OD' },
            remarks: { type: 'string', title: 'Remarks' },
            endUse: { type: 'string', title: 'End Use' },
            ownContribution: { type: 'string', title: 'Own contribution' },
            particulars: { type: 'string', title: 'Particulars' },
            remarksAdditional: { type: 'string', title: 'Remarks' },
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
                  typeOfProperty: { type: 'string', title: 'Type of property / Other investments like gold , LIC , FC etc.,' },
                  ownerName: { type: 'string', title: 'Owner name' },
                  approxMarketValue: { type: 'string', title: 'Approx. Market value' },
                  yearsOfOwnership: { type: 'string', title: 'Years of ownership' },
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
            coordinates: { type: 'string', title: 'Coordinates', readOnly: true },
          },
        },
        required: true,
      },
    ],
  },
];
