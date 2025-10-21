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
            pattern: "^[0-9]{10}$",
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
            readOnly: true,
          },
          dateOfVisitTimeOfVisit: {
            type: "string",
            title: "Date of Visit / Time of Visit",
          },
          alternateContactNumberOfTheCustomerMobileLandline: {
            type: "string",
            title: "Alternate Contact Number of the Customer (Mobile/Landline)",
            pattern: "^[0-9]{10}$",
          },
          maritalStatusMarriedDivorcedBachelor: {
            type: "string",
            title: "Marital Status (Married/Divorced/Bachelor)",
            enum: ["Married", "Divorced", "Bachelor"],
          },
          latitude: {
            type: "string",
            title: "Latitude",
          },
          longitude: {
            type: "string",
            title: "Longitude",
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
        required: ["nameOfTheApplicant", "sdfcId"],
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
            type: "integer",
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
            type: "integer",
            title: "Years in Current Company",
          },
          previousJobDetailsWorkExperienceTotalYearsOfExperience: {
            type: "integer",
            title:
              "Previous Job Details / Work Experience / Total Years of Experience",
          },
          levelOfActivityStocksObservations: {
            type: "string",
            title: "Level of Activity & Stocks (Observations)",
          },
          companyProfileServiceManufacturingSmallScaleFinanceOther: {
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
              minDecimalPlaces: 0,
            },
          },
          netSalary: {
            type: "number",
            title: "Net Salary",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
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
              minDecimalPlaces: 0,
            },
          },
          monthlyNetIncome: {
            type: "number",
            title: "Monthly Net Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          totalNoOfFamilyMembers: {
            type: "string",
            title: "Total No. of Family Members",
          },
          earningFamilyMembersIncomeDetails: {
            type: "number",
            title: "Earning Family Members Income Details",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          noOfDependents: {
            type: "string",
            title: "No. of Dependents",
          },
          anyOtherSourceOfIncomeMonthlyAnnual: {
            type: "number",
            title: "Any Other Source of Income (Monthly/Annual)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          familyMembersRelationshipAgeNameSalary: {
            type: "string",
            title: "Family Members(Relationship, Age, Name, Salary)",
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
          bankingRelationshipWith: {
            type: "string",
            title: "Banking Relationship With",
          },
          cashCreditLimit: {
            type: "number",
            title: "Cash Credit Limit",
          },
          overdraftLimit: {
            type: "number",
            title: "Overdraft Limit",
          },
        },
      },
      required: true,
    },
    {
      id: "loanAmount",
      label: "Loan Amount",
      schema: {
        type: "object",
        properties: {
          residenceAssets: {
            type: "string",
            title: "Residence & Assets",
          },
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
          assetsOwned: {
            type: "string",
            title: "Assets Owned",
          },
          fourWheelerMakeModel: {
            type: "string",
            title: "Four Wheeler (Make/Model)",
          },
          twoWheelerMakeModel: {
            type: "string",
            title: "Two Wheeler (Make/Model)",
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
            title: "Status of this Case - Positive/Negative/Credit Refer",
          },
          interviewerSRemarks: {
            type: "string",
            title: "Interviewer’s Remarks",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default idfcPlSchema;
