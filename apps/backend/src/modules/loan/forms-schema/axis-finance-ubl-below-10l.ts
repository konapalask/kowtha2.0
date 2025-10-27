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
          applicationNo: {
            type: "string",
            title: "Ref No / Application No",
            readOnly: true,
          },
          dateOfReport: {
            type: "string",
            title: "Date of Report",
            format: "date",
          },
          customerName: {
            type: "string",
            title: "Name of Customer",
            readOnly: true,
          },
          concernName: {
            type: "string",
            title: "Name of Concern",
          },
          constitution: {
            type: "string",
            title: "Constitution",
          },
          initiatedAddress: {
            type: "string",
            title: "Initiated Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          phoneNumber: {
            type: "string",
            title: "Phone No.",
          },
          appointmentFixed: {
            type: "string",
            title: "Appointment Fixed",
          },
          structureOfLoan: {
            type: "string",
            title: "Structure of Loan",
          },
          numberOfVisits: {
            type: "string",
            title: "No. of Visit",
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
          visitedBy: {
            type: "string",
            title: "Visited By",
          },
          aboutApplicant: {
            type: "string",
            title: "About Applicant",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
          residentialDetails: {
            type: "string",
            title: "Residential Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          coApplicantDetails: {
            type: "string",
            title: "Co-Applicant Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "familyDetails",
      label: "Family Details",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              title: "Name",
            },
            relation: {
              type: "string",
              title: "Relation with applicant",
            },
            age: {
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
    {
      id: "shareholdingDetails",
      label: "Constitution / Shareholding Details",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            shareholderName: {
              type: "string",
              title: "Name of the Shareholder",
            },
            relationWithMainApplicant: {
              type: "string",
              title: "Relation with main applicant",
            },
            designation: {
              type: "string",
              title: "Designation",
            },
            shareholdingPercentage: {
              type: "number",
              title: "% of Shareholding",
            },
            comingIntoLoanStructure: {
              type: "string",
              title: "Coming into loan structure",
            },
            functionalRole: {
              type: "string",
              title: "Functional role of partner / director",
            },
          },
        },
      },
    },
    {
      id: "businessOverview",
      label: "Business Overview",
      schema: {
        type: "object",
        properties: {
          aboutBusiness: {
            type: "array",
            title: "About the Business",
            items: {
              type: "object",
              properties: {
                detail: {
                  type: "string",
                  title: "Detail",
                  ui: {
                    widget: "textarea",
                    rows: 3,
                  },
                },
              },
            },
          },
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
    },
    {
      id: "suppliersCreditors",
      label: "Suppliers / Creditors",
      schema: {
        type: "object",
        properties: {
          numberOfFixedSuppliers: {
            type: "string",
            title: "No of fixed suppliers",
          },
          creditPeriodDays: {
            type: "string",
            title: "Credit period",
          },
          cashChequeProportion: {
            type: "string",
            title: "Cash - Cheque proportion",
          },
          topSuppliers: {
            type: "array",
            title: "Top 3 Suppliers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactDetails: {
                  type: "string",
                  title: "Contact details",
                },
                location: {
                  type: "string",
                  title: "Location",
                },
                referenceCheck: {
                  type: "string",
                  title: "Ref. Check",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "clientsDebtors",
      label: "Clients / Debtors",
      schema: {
        type: "object",
        properties: {
          numberOfFixedCustomers: {
            type: "string",
            title: "No of fixed customers",
          },
          creditPeriodDays: {
            type: "string",
            title: "Credit period",
          },
          cashChequeProportion: {
            type: "string",
            title: "Cash - Cheque proportion",
          },
          topCustomers: {
            type: "array",
            title: "Top 3 Customers",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactDetails: {
                  type: "string",
                  title: "Contact details",
                },
                location: {
                  type: "string",
                  title: "Location",
                },
                referenceCheck: {
                  type: "string",
                  title: "Ref. Check",
                },
              },
            },
          },
          averageStockMaintained: {
            type: "string",
            title: "Average stock maintained",
          },
          turnoverAndMargins: {
            type: "string",
            title: "Turnover & margins",
          },
        },
      },
    },
    {
      id: "expenditure",
      label: "Expenditure - Salaries & Wages",
      schema: {
        type: "object",
        properties: {
          salariesAndWages: {
            type: "array",
            title: "Salaries & Wages Details",
            items: {
              type: "object",
              properties: {
                noOfEmployees: {
                  type: "string",
                  title: "No of Employees",
                },
                salaryPerMonthPerEmployee: {
                  type: "string",
                  title: "Salary per month per employee",
                },
                statusOfEmployee: {
                  type: "string",
                  title: "Status of employee",
                },
                noOfLabours: {
                  type: "string",
                  title: "No. of labours",
                },
                wagesPerMonthOrDay: {
                  type: "string",
                  title: "Wages per month/per day",
                },
                statusOfLabour: {
                  type: "string",
                  title: "Status of labour",
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                  ui: {
                    widget: "textarea",
                    rows: 3,
                  },
                },
              },
            },
          },
          workingHours: {
            type: "string",
            title: "Working Hours",
          },
          otherMajorExpensesAndBasis: {
            type: "string",
            title: "Other major expenses & basis",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "assetDetails",
      label: "Asset Details",
      schema: {
        type: "object",
        properties: {
          immovableProperties: {
            type: "array",
            title: "Immovable Properties",
            items: {
              type: "object",
              properties: {
                address: {
                  type: "string",
                  title: "Address",
                },
                areaMeasurements: {
                  type: "string",
                  title: "Area measured (Sq.ft)",
                },
                purchaseCostLakhs: {
                  type: "number",
                  title: "Purchase cost (in Lakhs)",
                },
                purchaseYear: {
                  type: "string",
                  title: "Purchase Year",
                },
                marketValueLakhs: {
                  type: "number",
                  title: "Market value (in Lakhs)",
                },
                ownerName: {
                  type: "string",
                  title: "Owner Name",
                },
                mortgaged: {
                  type: "string",
                  title: "Mortgaged (Yes/No)",
                },
              },
            },
          },
          liquidMoveableAssets: {
            type: "string",
            title:
              "Any Liquid, Moveable & Monetary items such as Cash, Gold, FD, RD, Mutual Funds, Shares, Bonds, Securities",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          insurances: {
            type: "string",
            title:
              "Life insurance, mediclaim, property/asset insurance (premium & sum assured)",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          capitalInvestedLoans: {
            type: "string",
            title:
              "Capital invested in any business, loans & advances given",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          vehicles: {
            type: "array",
            title: "Car, Bike and any other vehicle (Company Name and Model)",
              items: {
                type: "string",
                title: "Car, Bike and any other vehicle (Company Name and Model)",
              },
          },
        },
      },
    },
    {
      id: "existingLoans",
      label: "Loan Details",
      schema: {
        type: "array",
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
            outstandingBalance: {
              type: "number",
              title: "O/S Balance",
            },
            emiAmount: {
              type: "number",
              title: "EMI (in Rs.)",
            },
            emiPaidBank: {
              type: "string",
              title: "EMI Paid Bank",
            },
            securedAgainstAsset: {
              type: "string",
              title: "Secured against which asset",
            },
          },
        },
      },
    },
    {
      id: "bankingDetails",
      label: "Bank Details",
      schema: {
        type: "array",
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
              type: "string",
              title: "Open since (Year)",
            },
            endUseOfLoan: {
              type: "string",
              title: "End use of loan:(Loan Amount & Detailed End-Use)",
            },
            remarks: {
              type: "string",
              title: "Remarks",
              ui: {
                widget: "textarea",
                rows: 3,
              },
            },
          },
        },
      },
    },
    {
      id: "thirdPartyCheck",
      label: "Third Party Check",
      schema: {
        type: "object",
        properties: {
          references: {
            type: "array",
            title: "References",
            items: {
              type: "object",
              properties: {
                name: {
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
                  title: "Feedback on borrower",
                },
                feedbackOnBusiness: {
                  type: "string",
                  title: "Feedback on business",
                },
              },
            },
          },
          observations: {
            type: "array",
            title: "Observations",
            items: {
              type: "string",
              title: "Observation",
            },
          },
          otherIncome: {
            type: "string",
            title: "Other income (income from other than initiated business)",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          siteCoordinates: {
            type: "string",
            title: "Site coordinates (Latitude, Longitude)",
          },
          remarks: {
            type: "string",
            title: "Remarks",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          status: {
            type: "string",
            title: "Status",
          },
          verifierNameEmpCode: {
            type: "string",
            title: "AFL Verifier's Name & Emp Code",
          },
          verifierSignature: {
            type: "string",
            title: "AFL Verifier's Signature",
          },
        },
      },
    },
    {
      id: "financialSummary",
      label: "Financial Summary",
      schema: {
        type: "object",
        properties: {
          totalGrossDisposableIncome: {
            type: "number",
            title: "Total Gross disposable Income (A) per month",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          totalObligations: {
            type: "number",
            title: "Total Obligations (B) per month",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netDisposableIncome: {
            type: "number",
            title: "Net Disposable Income (C = A – B) per month",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          note: {
            type: "string",
            title: "Notes / Comments",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "recommendations",
      label: "Recommendations",
      schema: {
        type: "object",
        properties: {
          recommendations: {
            type: "array",
            title: "Recommendations",
            items: {
              type: "string",
              title: "Recommendation",
            },
          },
          disclaimer: {
            type: "string",
            title: "Disclaimer if any",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
  ],
} as const;
  export default axisFinanceUblBelow10lSchema;