import statement2Schema from "../financials-schema/statement2";

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
          applicantName: {
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
          pdDate: {
            type: "string",
            title: "Date",
            format: "date",
          },
          loaAmountRequest: {
            type: "number",
            title: "Loan Amount Request",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          placeOfInterview: {
            type: "string",
            title: "Place of Interview",
          },
          applicantMobile: {
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
            enum: [
              "Self",
              "Spouse",
              "Son",
              "Daughter",
              "Father",
              "Mother",
              "Brother",
              "Sister",
              "Other",
            ],
          },
          age: {
            type: "integer",
            title: "Age",
          },
          education: {
            type: "string",
            title: "Education",
            enum: [
              "Below 10th",
              "10th pass",
              "Under graduate",
              "Graduate",
              "Post Graduate",
              "Professional",
            ],
          },
          occupation: {
            type: "string",
            title: "Occupation",
          },
          noOfDependants: {
            type: "integer",
            title: "No. of Dependants",
          },
          generalLifestylePersonality: {
            type: "string",
            title: "General Lifestyle/Personality",
            enum: ["Good", "Average", "Bad"],
          },
        },
        required: true,
      },
    },
    {
      id: "placeOfResidenceOffice",
      label: "Place of Residence/Office",
      schema: {
        type: "object",
        properties: {
          currentAddressDetails: {
            type: "string",
            title: "Current Address Details",
          },
          ownershipAndNameOfOwners: {
            type: "string",
            title: "Ownership and Name of Owners",
          },
          collateralDescriptionAndType: {
            type: "string",
            title: "Collateral Description and Type",
          },
          officePremisesDetails: {
            type: "string",
            title: "Office Premises Details",
          },
          ownershipAndNameOfOwnersNaForSalaried: {
            type: "string",
            title: "Ownership and Name of Owners (NA for Salaried)",
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
          detailedProfileOfTheBusiness: {
            type: "string",
            title: "Enter details of business",
            ui: {
              widget: "textarea",
              rows: 6,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "selfEmployedOrSalaried",
      label: "Self Employed/Salaried",
      schema: {
        type: "object",
        properties: {
          nameOfBusinessEmployment: {
            type: "string",
            title: "Name of Business / Employment",
          },
          natureOfBusinessEntityEmployerDetailsProprietoryPartnershipPvtLtd: {
            type: "string",
            title:
              "Nature of Business Entity / Employer Details (Proprietory / Partnership / Pvt. Ltd)",
            enum: ["Proprietory", "Partnership", "Pvt. Ltd"],
          },
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
      id: "employeotherMajorCost",
      label: "Employee or Other Major Cost",
      schema: {
        type: "object",
        properties: {
          numberOfEmployees: {
            type: "integer",
            title: "Number of Employees",
          },
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
          estimatedTotalCosts: {
            type: "number",
            title: "Estimated Total Costs",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "businessData",
      label: "Business Data",
      schema: {
        type: "object",
        properties: {
          annualSales: {
            type: "number",
            title: "Annual Sales",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
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
            type: "string",
            title: "Major Cost Heads",
          },
          grossMargin: {
            type: "number",
            title: "Gross Margin %",
          },
          pbditMargin: {
            type: "number",
            title: "PBDIT Margin %",
          },
          debtorsCycle: {
            type: "integer",
            title: "Debtors Cycle",
          },
          creditorsCycle: {
            type: "integer",
            title: "Creditors Cycle",
          },
          capitalInvested: {
            type: "number",
            title: "Capital Invested",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          loanFundsInclCcLimit: {
            type: "string",
            title: "Loan Funds (incl. CC limit)",
          },
          stockMaintained: {
            type: "string",
            title: "Stock Maintained",
          },
          businessBankAccounts: {
            type: "string",
            title: "Business Bank Accounts",
          },
        },
      },
      required: true,
    },
    {
      id: "coApplicantIncome",
      label: "Co-Applicant Income",
      schema: {
        type: "object",
        properties: {
          coApplicantIncome: {
            type: "number",
            title: "Co-Applicant Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
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
          otherPropertiesOwned: {
            type: "string",
            title: "Other Properties Owned",
          },
          otherAssetsOwned: {
            type: "string",
            title: "Other Assets Owned",
          },
        },
      },
      required: true,
    },
    {
      id: "otherLiabilitiesIncludingCcLimitsOwnCoApplicants",
      label: "OTHER LIABILITIES INCLUDING CC LIMITS (OWN/CO APPLICANTS)",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            from: {
              type: "string",
              title: "From",
            },
            natureOfLoan: {
              type: "string",
              title: "Nature of Loan",
              enum: ["Personal Loan", "Home Loan", "Car Loan", "Other"],
            },
            amount: {
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
          },
        },
      },
      required: true,
    },
    {
      id: "budgetAnalysis",
      label: "Budget Analysis",
      schema: {
        type: "object",
        properties: {
          totalMonthlyExpensesPerMonth: {
            type: "string",
            title: "Total Monthly Expenses per Month",
          },
          overAllFamilyExpenses: {
            type: "string",
            title: "Over All Family Expenses",
          },
          plOrAutoLoanEMI: {
            type: "number",
            title: "PL or Auto Loan EMI",
          },
          otherLoanEmi: {
            type: "number",
            title: "Other Loan EMI",
          },
          totalMonthlyIncomePerMonth: {
            type: "string",
            title: "Total Monthly Income per Month",
          },
          netSurplus: {
            type: "string",
            title: "Net Surplus",
          },
          affordableEmi: {
            type: "number",
            title: "Affordable EMI",
          },
        },
      },
      required: true,
    },

    {
      id: "endUseOfFunds",
      label: "End Use of Funds",
      schema: {
        type: "object",
        properties: {
          endUseOfFunds: {
            type: "string",
            title: "End Use of Funds",
          },
        },
      },
    },
    {
      id: "otherObservations",
      label: "Other Observations",
      schema: {
        type: "object",
        properties: {
          otherObservations: {
            type: "string",
            title: "Other Observations",
            ui: {
              widget: "textarea",
              rows: 6,
            },
          },
        },
      },
    },
    {
      id: "tradeReferences",
      label: "Trade References",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            nameOfThePerson: {
              type: "string",
              title: "Name of the Person",
            },
            contactDetails: {
              type: "string",
              title: "Telephone No. / Address for Communication",
            },
          },
        },
      },
      required: true,
    },
    statement2Schema,
  ],
} as const;
export default axisFinanceSchema;
