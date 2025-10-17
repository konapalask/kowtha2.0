export const axisFinanceUblBelow10lSchema = {
    id: 2,
    bankName: "Axis Finance UBL Below 10L",
    sections: [
      {
        id: "basicDetails",
        label: "Basic Details",
        schema: {
          type: "object",
          properties: {
            applicationNo: {
              type: "string",
              title: "Ref No/Application No",
              readOnly: true,
            },
            customerName: {
              type: "string",
              title: "Name of the Customer",
              readOnly: true,
            },
            dateOfReport: {
              type: "string",
              format: "date",
              title: "Date of Report",
            },
            concernName: {
              type: "string",
              title: "Name of the Concern",
            },
            constitution: {
              type: "string",
              title: "Constitution",
            },
            initiatedAddress: {
              type: "string",
              title: "Initiated Address",
            },
            visitedAddress: {
              type: "string",
              title: "Visited Address",
            },
            phoneNo: {
              type: "number",
              title: "Phone No.",
            },
            appointmentFixed: {
              type: "string",
              format: "time",
              title: "Appointment Fixed",
            },
            structureOfLoan: {
              type: "string",
              title: "Structure of Loan",
            },
            noOfVisit: {
              type: "string",
              title: "No. of Visit",
            },
            personMet: {
              type: "string",
              title: "Person Met",
            },
            aboutApplicant: {
              type: "string",
              title: "About Applicant",
            },
            residentialDetails: {
              type: "string",
              title: "Residential Details",
            },
            coApplicantDetails: {
              type: "string",
              title: "Co-Applicant Details",
            },
            region: {
              type: "string",
              title: "Region",
            },
            location: {
              type: "string",
              title: "Location",
            },
            branch: {
              type: "string",
              title: "Branch",
            },
          },
          required: ["applicationNo", "customerName", "concernName"],
        },
        required: true,
      },
      {
        id: "familyDetails",
        label: "Family Details",
        schema: {
          type: "object",
          properties: {
            familyDetails: {
              type: "array",
              title: "Family Details",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    title: "Name",
                  },
                  relation: {
                    type: "string",
                    title: "Relation with Applicant",
                  },
                  ageYears: {
                    type: "integer",
                    title: "Age (Yrs)",
                  },
                  qualification: {
                    type: "string",
                    title: "Qualification",
                  },
                  occupation: {
                    type: "string",
                    title: "Occupation",
                  },
                  incomePerMonth: {
                    type: "number",
                    title: "Income per month (approx.)",
                    formatter: {
                      useIndianFormat: true,
                      locale: "en-IN",
                      maxDecimalPlaces: 2,
                      minDecimalPlaces: 0,
                    },
                  },
                  dependent: {
                    type: "string",
                    title: "Dependent",
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: "shareholdingDetails",
        label: "Shareholding Details",
        schema: {
          type: "object",
          properties: {
            shareholdingDetails: {
              type: "array",
              title: "Constitution / Shareholding Details",
              items: {
                type: "object",
                properties: {
                  shareholderName: {
                    type: "string",
                    title: "Name of the Shareholder",
                  },
                  relationWithMainApplicant: {
                    type: "string",
                    title: "Relation with Main Applicant",
                  },
                  designation: {
                    type: "string",
                    title: "Designation",
                  },
                  percentShareholding: {
                    type: "number",
                    title: "% of Shareholding",
                  },
                  comingIntoLoanStructure: {
                    type: "string",
                    title: "Coming into Loan Structure",
                  },
                  functionalRole: {
                    type: "string",
                    title: "Functional of Partner / Director",
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: "businessDetails",
        label: "Business Details",
        schema: {
          aboutBusiness: {
            type: "array",
            title: "About the Business",
          },
        },
        required: true,
      },
      {
        id: "documentsObserved",
        label: "Documents Observed",
        schema: {
          type: "object",
          properties: {
            documentsObserved: {
              type: "array",
              title: "Documents Observed",
              items: {
                type: "object",
                properties: {
                  documentCategory: {
                    type: "string",
                    title: "Document Category",
                  },
                  documentName: {
                    type: "string",
                    title: "Document Name",
                  },
                  documentType: {
                    type: "string",
                    title: "Document Type",
                  },
                  remarks: {
                    type: "string",
                    title: "Remarks",
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: "suppliersCreditors",
        label: "Suppliers/Creditors",
        schema: {
          type: "object",
          properties: {
            noOfFixedSuppliers: {
              type: "integer",
              title: "No of Fixed Suppliers",
            },
            creditPeriod: {
              type: "integer",
              title: "Credit Period",
            },
            cashChequeProportion: {
              type: "number",
              title: "Cash-Cheque Proportion",
            },
            top3Suppliers: {
              type: "array",
              title: "Top 3 Suppliers",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    title: "Name (top 3 Suppliers)",
                  },
                  contactDetails: {
                    type: "number",
                    title: "Contact Details",
                  },
                  location: {
                    type: "string",
                    title: "Location",
                  },
                  refCheck: {
                    type: "string",
                    title: "Ref. Check",
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: "clientsDebtors",
        label: "Clients/Debtors",
        schema: {
          type: "object",
          properties: {
            noOfFixedCustomers: {
              type: "integer",
              title: "No of Fixed Customers",
            },
            clientCreditPeriodDays: {
              type: "integer",
              title: "Credit Period",
            },
            clientCashChequeProportion: {
              type: "number",
              title: "Cash-Cheque Proportion",
            },
            top3Customers: {
              type: "array",
              title: "Top 3 Customers",
              buttonTitle: "Add Customer",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    title: "Name",
                  },
                  contactDetails: {
                    type: "string",
                    title: "Contact Details",
                  },
                  location: {
                    type: "string",
                    title: "Location",
                  },
                  refCheck: {
                    type: "string",
                    title: "Ref. Check",
                  },
                },
              },
            },
            averageStockMaintained: {
              type: "number",
              title: "Average Stock Maintained",
            },
            turnoverAndMargins: {
              type: "number",
              title: "Turnover & Margins",
            },
          },
        },
        required: true,
      },
      {
        id: "expenditure",
        label: "Expenditure",
        schema: {
          type: "object",
          properties: {
            salariesAndWages: {
              type: "array",
              title: "Salaries & Wages",
              items: {
                type: "object",
                properties: {
                  noOfEmployees: {
                    type: "integer",
                    title: "No. of Employees",
                  },
                  salaryPerMonthPerEmployee: {
                    type: "number",
                    title: "Salary per Month per Employee",
                  },
                  statusOfEmployee: {
                    type: "string",
                    title: "Status of Employee",
                  },
                  noOfLabours: {
                    type: "integer",
                    title: "No. of Labours",
                  },
                  wagesPerMonthOrDay: {
                    type: "number",
                    title: "Wages per Month / Per Day",
                  },
                  statusOfLabour: {
                    type: "string",
                    title: "Status of Labour",
                  },
                  remarks: {
                    type: "string",
                    title: "Remarks",
                  },
                },
              },
            },
            workingHours: {
              type: "number",
              title: "Working Hours",
            },
            otherMajorExpensesAndBasis: {
              type: "string",
              title: "Other Major Expenses & Basis",
            },
          },
        },
        required: true,
      },
      {
        id: "assetDetails",
        label: "Asset Details",
        schema: {
          type: "object",
          properties: {
            assetDetails: {
              type: "array",
              title: "Asset Details",
              items: {
                type: "object",
                properties: {
                  address: {
                    type: "string",
                    title: "Address",
                  },
                  areaMeasurements: {
                    type: "string",
                    title: "Area Measurements",
                  },
                  purchaseCostLakhs: {
                    type: "number",
                    title: "Purchase Cost (in Lakhs)",
                  },
                  purchaseYear: {
                    type: "integer",
                    title: "Purchase Year",
                  },
                  marketValueLakhs: {
                    type: "number",
                    title: "Market Value (in Lakhs)",
                  },
                  ownerName: {
                    type: "string",
                    title: "Owner Name",
                  },
                  mortgaged: {
                    type: "string",
                    title: "Mortgaged (Yes/No)",
                  },
                  liquidMoveableMonetary: {
                    type: "string",
                    title:
                      "Any Liquid, Moveable & Monetary Items such as Cash, Gold, FD, RD, Mutual Fund Holdings, Shares, Bonds, Securities",
                  },
                  insurances: {
                    type: "string",
                    title:
                      "Life Insurance, Mediclaim, Property/Asset Insurance, Medician, Property.Asses Insurance (Premium & Sum Assured)",
                  },
                },
              },
            },
            capitalInvestedLoansAdvances: {
              type: "string",
              title: "Capital Invested in any Business, Loans & Advances given",
            },
            vehicles: {
              type: "string",
              title: "Car, Bike and Other Vehicles (Company Name and Model)",
            },
          },
        },
        required: true,
      },
      {
        id: "loanDetails",
        label: "Existing Loans",
        schema: {
          type: "object",
          properties: {
            loanDetails: {
              type: "array",
              title: "Loan Details",
              items: {
                type: "object",
                properties: {
                  bankOrNbfcName: {
                    type: "string",
                    title: "Name of Bank / NBFC",
                  },
                  typeOfLoan: {
                    type: "string",
                    title: "Type of Loan",
                  },
                  sanctionedAmount: {
                    type: "number",
                    title: "Sanctioned Amount (in Lakhs)",
                  },
                  osBalance: {
                    type: "number",
                    title: "O/S Balance",
                  },
                  emiRs: {
                    type: "number",
                    title: "EMI (in Rs.)",
                  },
                  emiPaidBank: {
                    type: "string",
                    title: "EMI Paid Bank",
                  },
                  securedAgainstAsset: {
                    type: "string",
                    title: "Secured Against which Asset",
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: "bankingDetails",
        label: "Banking Details",
        schema: {
          type: "object",
          properties: {
            bankDetails: {
              type: "array",
              title: "Bank Details",
              items: {
                type: "object",
                properties: {
                  bankName: {
                    type: "string",
                    title: "Bank Name",
                  },
                  branchName: {
                    type: "string",
                    title: "Branch Name",
                  },
                  accountType: {
                    type: "string",
                    title: "Account Type",
                  },
                  openSinceYear: {
                    type: "integer",
                    title: "Open Since (Year)",
                  },
                },
              },
            },
          },
        },
        required: true,
      },
      {
        id: "thirdPartyCheck",
        label: "Third Party Check",
        schema: {
          type: "object",
          properties: {
            thirdPartyCheck: {
              type: "array",
              title: "Third Party Check",
              minItems: 2,
              items: {
                type: "object",
                properties: {
                  individualOrBusinessName: {
                    type: "string",
                    title: "Individual / Business Name",
                  },
                  address: {
                    type: "string",
                    title: "Address",
                  },
                  contactNo: {
                    type: "string",
                    title: "Contact No.",
                  },
                  knowingSince: {
                    type: "string",
                    title: "Knowing Since",
                  },
                  feedbackOnBorrower: {
                    type: "string",
                    title: "Feedback on Borrower",
                  },
                  feedbackOnBusiness: {
                    type: "string",
                    title: "Feedback on Business",
                  },
                },
              },
            },
            otherIncome: {
              type: "string",
              title: "Other Income (Income from other than initiated business)",
            },
            siteCoordinates: {
              type: "string",
              title: "Site Coordinates (Latitude, Longitude)",
            },
            observation: {
              type: "array",
              title: "Observation",
              items: {
                type: "string",
                title: "Observation",
              },
            },
            Remarks: {
              type: "string",
              title: "Remarks",
  
            },
            AFLVerifierNameAndEmpCode: {
              type: "string",
              title: "AFL Verifier's Name & Emp Code",
            },
            AFLVerifierSignature: {
              type: "string",
              title: "AFL Verifier's Signature",
            },
            Status: {
              type: "string",
              title: "Status",
            },
          },
        },
        required: true,
      },
      {
        id: "photos",
        label: "Photos",
        schema: {
          type: "array",
          title: "Photos",
          items: {
            type: "string",
            title: "Photos",
          },
        },
        required: true,
      },
    ],
  } as const;
  export default axisFinanceUblBelow10lSchema;
  