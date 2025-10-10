export const niwasSenpSchema = {
  "id": 24,
  "bankName": "Niwas Senp",
  "sections": [
    {
      "id": "general",
      "label": "General",
      "schema": {
        "type": "object",
        "properties": {
          "prospectNo": {
            "type": "string",
            "title": "Prospect No.",
            "readOnly": true
          },
          "name": {
            "type": "string",
            "title": "Name",
            "readOnly": true
          },
          "maritalStatus": {
            "type": "string",
            "title": "Marital Status"
          },
          "educationalQualification": {
            "type": "string",
            "title": "Educational Qualification"
          },
          "category": {
            "type": "string",
            "title": "Category"
          },
          "numberOfDependents": {
            "type": "integer",
            "title": "Number of Dependents"
          },
          "children": {
            "type": "string",
            "title": "Children"
          },
          "adults": {
            "type": "string",
            "title": "Adults"
          },
          "others": {
            "type": "string",
            "title": "Others"
          },
          "numberOfYearsInCurrentResidence": {
            "type": "integer",
            "title": "Number of years in Current Residence"
          },
          "currentResidenceHouseSize": {
            "type": "string",
            "title": "Current residence house size"
          },
          "previousAddressIf1Year": {
            "type": "string",
            "title": "Previous Address (if <1 year)"
          },
          "numberOfYearsStayedAtThatAddress": {
            "type": "integer",
            "title": "Number of Years stayed at that Address"
          },
          "numberOfYearsInCurrentCity": {
            "type": "integer",
            "title": "Number of Years in Current City"
          },
          "previousCityIf3Years": {
            "type": "string",
            "title": "Previous City (if ≤3 years)"
          },
          "numberOfYearsInThatCity": {
            "type": "integer",
            "title": "Number of Years in that City"
          },
          "reasonForChange": {
            "type": "string",
            "title": "Reason for Change"
          },
          "parentsStayingWith": {
            "type": "string",
            "title": "Parents Staying with?"
          }
        }
      },
      "required": true
    },
    {
      "id": "contactPersonNameNumber",
      "label": "Contact Person Name & Number",
      "schema": {
        "type": "object",
        "properties": {
          "businessIncomeComputationMonthly": {
            "type": "number",
            "title": "Business Income Computation (Monthly)"
          }
        }
      },
      "required": true
    },
    {
      "id": "totalMonthlyExpensesB",
      "label": "Total Monthly Expenses (B)",
      "schema": {
        "type": "object",
        "properties": {
          "netMonthlyProfitAB": {
            "type": "number",
            "title": "Net Monthly Profit (=A-B)"
          }
        }
      },
      "required": true
    },
    {
      "id": "loanDetails",
      "label": "Loan Details",
      "schema": {
        "type": "object",
        "properties": {
          "purposeOfLoan": {
            "type": "number",
            "title": "Purpose Of Loan"
          },
          "minimumLoanAmountRequired": {
            "type": "number",
            "title": "Minimum Loan Amount Required"
          },
          "tenureRequired": {
            "type": "integer",
            "title": "Tenure Required"
          }
        }
      },
      "required": true
    },
    {
      "id": "feedbackAboutApplicantFirm",
      "label": "Feedback about Applicant/Firm",
      "schema": {
        "type": "object",
        "properties": {
          "toBeFilledByPdOfficer": {
            "type": "string",
            "title": "To be Filled by PD Officer"
          },
          "briefCommentsObservationsOfTheCase": {
            "type": "string",
            "title": "Brief Comments / Observations of the case"
          },
          "initiatedAddress": {
            "type": "string",
            "title": "Initiated Address"
          },
          "visitedAddress": {
            "type": "string",
            "title": "Visited Address"
          },
          "residentialAddress": {
            "type": "string",
            "title": "Residential Address"
          },
          "otherObservations": {
            "type": "string",
            "title": "Other Observations"
          },
          "concerns": {
            "type": "string",
            "title": "Concerns"
          },
          "statusOfThisCasePositiveNegativeCreditRefer": {
            "type": "string",
            "title": "Status of this Case - Positive/Negative/Credit Refer"
          },
          "nameOfPdOfficer": {
            "type": "string",
            "title": "Name of PD Officer"
          }
        }
      },
      "required": true
    },
    {
      "id": "dateOfDiscussion",
      "label": "Date of Discussion",
      "schema": {
        "type": "object",
        "properties": {
          "signatureOfThePdOfficer": {
            "type": "string",
            "title": "Signature of the PD Officer"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default niwasSenpSchema;
