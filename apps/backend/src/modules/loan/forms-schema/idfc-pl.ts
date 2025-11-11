import financialsSchema from "../financials-schema/generic";
export const idfcPlSchema = {
  id: 18,
  bankName: "IDFC PL",
  sections: [
    {
      id: "general",
      label: "General",
      schema: {
        type: "object",
        properties: {
          nameOfTheApplicant: {
            type: "string",
            title: "Name of the Applicant",
            readOnly: true,
          },
          sdfcId: {
            type: "string",
            title: "SDFC ID",
            readOnly: true,
          },
          personContacted: {
            type: "string",
            title: "Person Contacted",
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
            readOnly: true,
          },
          dateOfVisitTimeOfVisit: {
            type: "string",
            title: "Date / Time of Visit",
          },
          alternateContactNumberOfTheCustomerMobileLandline: {
            type: "string",
            title: "Alternate Contact Number (Mobile / Landline)",
            pattern: "^[0-9]{10}$",
          },
          maritalStatusMarriedDivorcedBachelor: {
            type: "string",
            title: "Marital Status",
            enum: ["Married", "Divorced", "Bachelor"],
          },
          branch: {
            type: "string",
            title: "Branch",
          },
        },
        required: ["nameOfTheApplicant", "sdfcId", "visitedAddress"],
      },
      required: true,
    },
    {
      id: "employmentDetails",
      label: "Employment Details",
      schema: {
        type: "object",
        properties: {
          nameOfTheEmployer: {
            type: "string",
            title: "Name of the Employer",
          },
          typeOfFirmProprietorPartnershipPvtLtdGovtPsuMnc: {
            type: "string",
            title:
              "Type of Firm (Proprietor / Partnership / Pvt. Ltd. / Govt. / PSU / MNC)",
          },
          numberOfEmployees: {
            type: "string",
            title: "Number of Employees",
          },
          department: {
            type: "string",
            title: "Department",
          },
          designation: {
            type: "string",
            title: "Designation",
          },
          yearsInCurrentCompany: {
            type: "string",
            title: "Years in Current Company",
          },
          previousJobDetailsWorkExperienceTotalYearsOfExperience: {
            type: "string",
            title:
              "Previous Job Details / Work Experience / Total Years of Experience",
          },
          levelOfActivityStocksAlongWithObservations: {
            type: "string",
            title: "Level of Activity & Stocks (Observations)",
          },
          companyProfileServiceManufacturingSmallScaleFinanceOtherPleaseSpecify:
            {
              type: "string",
              title:
                "Company Profile (Service / Manufacturing / Small Scale / Finance / Other)",
            },
          thirdPartyCheck: {
            type: "string",
            title: "Third Party Check",
          },
        },
      },
      required: true,
    },
    {
      id: "incomeDetails",
      label: "Income Details",
      schema: {
        type: "object",
        properties: {
          grossSalary: {
            type: "number",
            title: "Gross Salary",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          netSalary: {
            type: "number",
            title: "Net Salary",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          overtimeDetailsIfAny: {
            type: "string",
            title: "Overtime Details (if any)",
          },
          monthlyExpenses: {
            type: "number",
            title: "Monthly Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          monthlyNetIncome: {
            type: "number",
            title: "Monthly Net Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          totalNoOfFamilyMembers: {
            type: "integer",
            title: "Total No. of Family Members",
          },
          earningFamilyMembersIncomeDetails: {
            type: "number",
            title: "Earning Family Members Income Details",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          noOfDependents: {
            type: "integer",
            title: "No. of Dependents",
          },
          anyOtherSourceOfIncomeMonthlyAnnual: {
            type: "number",
            title: "Any Other Source of Income (Monthly / Annual)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          salaryAccountBank: {
            type: "string",
            title: "Salary Account Bank",
          },
          salaryAccountNumber: {
            type: "string",
            title: "Salary Account Number",
          },
          salaryCreditMode: {
            type: "string",
            title: "Salary Credit Mode",
            enum: ["Bank Transfer", "Cheque", "Cash", "Other"],
          },
          incomeObservation: {
            type: "string",
            title: "Income Observation / Remarks",
          },
          familyMembers: {
            type: "array",
            title: "Family Members",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relationshipWithApplicant: {
                  type: "string",
                  title: "Relationship",
                },
                age: {
                  type: "integer",
                  title: "Age",
                },
                qualification: {
                  type: "string",
                  title: "Qualification",
                  enum: [
                    "Below 10th",
                    "10th pass",
                    "12th pass",
                    "Diploma/ITI certification",
                    "Graduate",
                    "PG/Professional Certification"
                  ],
                },
                occupation: {
                  type: "string",
                  title: "Occupation",
                },
                incomeDetailsDependent: {
                  type: "string",
                  title: "Income Details / Dependent",
                },
              },
            },
          },
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
          residenceDocuments: {
            type: "array",
            title: "Residence Documents",
            items: {
              type: "string",
              title: "Document",
            },
          },
          officeDocuments: {
            type: "array",
            title: "Office Documents",
            items: {
              type: "string",
              title: "Document",
            },
          },
        },
      },
    },
    {
      id: "bankingDetails",
      label: "Banking Details",
      schema: {
        type: "object",
        properties: {
          bankingRelationshipWith: {
            type: "string",
            title: "Banking Relationship With",
          },
          cashCreditLimit: {
            type: "number",
            title: "Cash Credit Limit",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          overdraftLimit: {
            type: "number",
            title: "Overdraft Limit",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "obligationsLoans",
      label: "Obligations / Loans",
      schema: {
        type: "object",
        properties: {
          loans: {
            type: "array",
            title: "Existing Loans",
            items: {
              type: "object",
              properties: {
                institutionBankNbfcName: {
                  type: "string",
                  title: "Institution / NBFC Name",
                },
                typeOfLoan: {
                  type: "string",
                  title: "Type of Loan",
                },
                monthlyPrincipalEmi: {
                  type: "number",
                  title: "Monthly Principal / EMI",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "residenceDetails",
      label: "Residence & Assets",
      schema: {
        type: "object",
        properties: {
          currentResidenceOwnedRentedParentsHouseRelativesHouseCompanyProvided:
            {
              type: "string",
              title:
                "Current Residence (Owned / Rented / Parents House / Relatives House / Company Provided)",
            },
          yearsAtCurrentResidence: {
            type: "integer",
            title: "Years at Current Residence",
          },
          residenceObservation: {
            type: "string",
            title: "Residence Observation / Notes",
          },
          assetsOwnedList: {
            type: "array",
            title: "Assets Owned",
            items: {
              type: "string",
              title: "Asset Detail",
            },
          },
          assetsOwned: {
            type: "string",
            title: "Assets Owned (Summary)",
          },
          fourWheelerMakeModel: {
            type: "string",
            title: "Four Wheeler (Make / Model)",
          },
          twoWheelerMakeModel: {
            type: "string",
            title: "Two Wheeler (Make / Model)",
          },
        },
      },
      required: true,
    },
    {
      id: "loanDetailsBil",
      label: "Loan Details (BIL)",
      schema: {
        type: "object",
        properties: {
          loanAmountApplied: {
            type: "number",
            title: "Loan Amount Applied",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          endUse: {
            type: "string",
            title: "End Use",
          },
          interviewDetails: {
            type: "string",
            title: "Interview Details",
          },
          nameOfInterviewer: {
            type: "string",
            title: "Name of Interviewer",
          },
          designationSignature: {
            type: "string",
            title: "Designation & Signature",
          },
          statusOfThisCasePositiveNegativeCreditRefer: {
            type: "string",
            title: "Status of this Case (Positive / Negative / Credit Refer)",
          },
          interviewerSRemarks: {
            type: "string",
            title: "Interviewer's Remarks",
          },
        },
      },
      required: true,
    },
    financialsSchema,
  ],
} as const;

export default idfcPlSchema;
