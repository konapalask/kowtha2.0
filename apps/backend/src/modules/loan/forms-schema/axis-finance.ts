export const axisFinanceSchema = {
  id: 10,
  bankName: "Axis Finance",
  sections: [
    {
      id: "personalDiscussionSheet",
      label: "Personal Discussion Sheet",
      schema: {
        type: "object",
        properties: {
          applicationNo: {
            type: "integer",
            title: "Application No.",
            readOnly: true,
          },
          nameOfTheApplicant: {
            type: "string",
            title: "Name of the Applicant",
            readOnly: true,
          },
          interviewedBy: {
            type: "string",
            title: "Interviewed By",
          },
          personContacted: {
            type: "string",
            title: "Person Contacted",
            pattern: "^[0-9]{10}$",
          },
          date: {
            type: "string",
            title: "Date",
            format: "date",
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
      },
      required: true,
    },
    {
      id: "loanAmountRequest",
      label: "Loan Amount Request",
      schema: {
        type: "object",
        properties: {
          placeOfInterview: {
            type: "string",
            title: "Place of Interview",
          },
          contactNumber: {
            type: "string",
            title: "Contact Number",
            pattern: "^[0-9]{10}$",
          },
        },
      },
      required: true,
    },
    {
      id: "familyBackground",
      label: "Family Background",
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Name",
          },
          relation: {
            type: "string",
            title: "Relation",
          },
          age: {
            type: "integer",
            title: "Age",
          },
          education: {
            type: "string",
            title: "Education",
          },
          occupation: {
            type: "string",
            title: "Occupation",
          },
          noOfDependants: {
            type: "integer",
            title: "No. of Dependants",
          },
        },
      },
      required: true,
    },
    {
      id: "generalLifestylePersonality",
      label: "General Lifestyle/Personality",
      schema: {
        type: "object",
        properties: {
          placeOfResidenceOffice: {
            type: "string",
            title: "Place of Residence/Office",
          },
        },
      },
      required: true,
    },
    {
      id: "ownershipAndNameOfOwners",
      label: "Ownership and Name of Owners",
      schema: {
        type: "object",
        properties: {
          collateralDescriptionAndType: {
            type: "string",
            title: "Collateral Description and Type",
          },
        },
      },
      required: true,
    },
    {
      id: "companyProfile",
      label: "Company Profile",
      schema: {
        type: "object",
        properties: {
          nameOfBusinessEmployment: {
            type: "string",
            title: "Name of Business / Employment",
          },
        },
      },
      required: true,
    },
    {
      id: "natureOfBusinessEntityEmployerDetailsProprietoryPartnershipPvtLtd",
      label:
        "Nature of Business Entity / Employer Details (Proprietory / Partnership / Pvt. Ltd)",
      schema: {
        type: "object",
        properties: {
          keyManagerToTheBusiness: {
            type: "integer",
            title: "Key Manager to the Business",
          },
          noOfYearsInBusinessEmployment: {
            type: "integer",
            title: "No. of Years in Business / Employment",
          },
          typeOfBusiness: {
            type: "string",
            title: "Type of Business",
          },
        },
      },
      required: true,
    },
    {
      id: "businessDetails",
      label: "Business Details",
      schema: {
        type: "object",
        properties: {
          mainClients: {
            type: "string",
            title: "Main Clients",
          },
        },
      },
      required: true,
    },
    {
      id: "noOfEmployees",
      label: "No of Employees",
      schema: {
        type: "object",
        properties: {
          totalSalariesPerMonth: {
            type: "number",
            title: "Total Salaries per Month",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          accountingYear: {
            type: "integer",
            title: "Accounting Year",
          },
          businessData: {
            type: "string",
            title: "Business Data",
          },
        },
      },
      required: true,
    },
    {
      id: "annualSales",
      label: "Annual Sales",
      schema: {
        type: "object",
        properties: {
          overallCosts: {
            type: "number",
            title: "Overall Costs",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          majorCostHeads: {
            type: "number",
            title: "Major Cost Heads",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          grossMargin: {
            type: "number",
            title: "Gross Margin %",
          },
          pbditMargin: {
            type: "number",
            title: "PBDIT Margin %",
          },
        },
      },
      required: true,
    },
    {
      id: "creditorsCycle",
      label: "Creditors Cycle",
      schema: {
        type: "object",
        properties: {
          capitalInvested: {
            type: "number",
            title: "Capital Invested",
          },
        },
      },
      required: true,
    },
    {
      id: "loanFundsInclCcLimit",
      label: "Loan Funds (incl. CC limit)",
      schema: {
        type: "object",
        properties: {
          stockMaintained: {
            type: "string",
            title: "Stock Maintained",
          },
        },
      },
      required: true,
    },
    {
      id: "businessBankAccounts",
      label: "Business Bank Accounts",
      schema: {
        type: "object",
        properties: {
          incomeAssets: {
            type: "number",
            title: "Income & Assets",
          },
          coApplicantSIncome: {
            type: "number",
            title: "Co-Applicant’s Income",
          },
        },
      },
      required: true,
    },
    {
      id: "otherIncome",
      label: "Other Income",
      schema: {
        type: "object",
        properties: {
          licPaymentInsuranceMediclaim: {
            type: "string",
            title: "LIC Payment / Insurance / Mediclaim",
          },
          shareMutualFundInvestments: {
            type: "string",
            title: "Share / Mutual Fund Investments",
          },
          carsTwoWheelersOwned: {
            type: "string",
            title: "Cars / Two-Wheelers Owned",
          },
        },
      },
      required: true,
    },
    {
      id: "otherLiabilitiesIncludingCcLimitsOwnCoApplicants",
      label: "OTHER LIABILITIES INCLUDING CC LIMITS (OWN/CO APPLICANTS)",
      schema: {
        type: "object",
        properties: {
          from: {
            type: "string",
            title: "From",
          },
        },
      },
      required: true,
    },
    {
      id: "natureOfLoanAccountNo",
      label: "Nature of Loan / Account No.",
      schema: {
        type: "object",
        properties: {
          oSAmount: {
            type: "number",
            title: "O/S Amount",
          },
          emi: {
            type: "number",
            title: "EMI",
          },
          willCloseContinue: {
            type: "string",
            title: "Will Close / Continue",
          },
          budgetAnalysis: {
            type: "string",
            title: "Budget Analysis",
          },
        },
      },
      required: true,
    },
    {
      id: "otherLoanEmi",
      label: "Other Loan EMI",
      schema: {
        type: "object",
        properties: {
          totalMonthlyExpensesPerMonth: {
            type: "string",
            title: "Total Monthly Expenses per Month",
          },
          netSurplus: {
            type: "string",
            title: "Net Surplus",
          },
          affordableEmi: {
            type: "number",
            title: "Affordable EMI",
          },
          endUseOfFunds: {
            type: "string",
            title: "End Use of Funds",
          },
        },
      },
      required: true,
    },
    {
      id: "otherObservations",
      label: "Other Observations",
      schema: {
        type: "object",
        properties: {
          tradeReference: {
            type: "string",
            title: "Trade Reference",
          },
          slNo: {
            type: "integer",
            title: "Sl No",
          },
          nameOfThePerson: {
            type: "string",
            title: "Name of the Person",
          },
        },
      },
      required: true,
    },
    {
      id: "telephoneNoAddressForCommunication",
      label: "Telephone No / Address for Communication",
      schema: {
        type: "object",
        properties: {
          estimatedIncome: {
            type: "number",
            title: "Estimated Income",
          },
        },
      },
      required: true,
    },
    {
      id: "theGrossSalesAsPerOurAssumptions",
      label: "The Gross Sales as per our assumptions",
      schema: {
        type: "object",
        properties: {
          pbditMargin: {
            type: "number",
            title: "PBDIT Margin",
          },
          thePatOfTheBusinessConcernRs: {
            type: "string",
            title: "The PAT of the Business Concern (Rs.)",
          },
          overallPositivesNegatives: {
            type: "string",
            title: "Overall Positives / Negatives",
          },
          acceptReject: {
            type: "string",
            title: "Accept / Reject",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default axisFinanceSchema;
