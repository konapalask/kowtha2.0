export const niwasSalariedSchema = {
  "id": 23,
  "bankName": "Niwas Salaried",
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
          "nameOfApplicant": {
            "type": "string",
            "title": "Name of Applicant",
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
          }
        }
      },
      "required": true
    },
    {
      "id": "reasonForChange",
      "label": "Reason for Change",
      "schema": {
        "type": "object",
        "properties": {
          "parentsStayingWith": {
            "type": "string",
            "title": "Parents Staying with?"
          }
        }
      },
      "required": true
    },
    {
      "id": "induction",
      "label": "Induction",
      "schema": {
        "type": "object",
        "properties": {
          "investmentsAmountIfApplicable": {
            "type": "string",
            "title": "Investments (amount if applicable)"
          }
        }
      },
      "required": true
    },
    {
      "id": "employmentDetails",
      "label": "Employment Details",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfCurrentEmployerBusinessFirm": {
            "type": "string",
            "title": "Name of Current Employer/Business Firm"
          },
          "yearsInCurrentJobBusinessDateOfJoin": {
            "type": "integer",
            "title": "Years in Current Job/Business (Date of Join)"
          },
          "totalWorkExperienceInYears": {
            "type": "string",
            "title": "Total Work Experience (in years)"
          },
          "officialBusinessEmailId": {
            "type": "string",
            "title": "Official/Business Email-ID"
          },
          "contactNumber": {
            "type": "string",
            "title": "Contact Number",
            "pattern": "^[0-9]{10}$"
          },
          "numberOfEmployeesInFirm": {
            "type": "integer",
            "title": "Number of Employees in Firm"
          }
        }
      },
      "required": true
    },
    {
      "id": "finalProductServiceOfferedByCompany",
      "label": "Final Product/Service offered by Company",
      "schema": {
        "type": "object",
        "properties": {
          "numberOfCompetitorsInNearbyMarket": {
            "type": "integer",
            "title": "Number of competitors in Nearby Market"
          }
        }
      },
      "required": true
    },
    {
      "id": "emailAddress",
      "label": "Email Address",
      "schema": {
        "type": "object",
        "properties": {
          "employerFirmCheckFromNeighbor": {
            "type": "string",
            "title": "Employer Firm Check (From Neighbor)"
          }
        }
      },
      "required": true
    },
    {
      "id": "feedbackAboutEmployerFirmPositiveNeutralNegative",
      "label": "Feedback about Employer/Firm (Positive/Neutral/Negative)",
      "schema": {
        "type": "object",
        "properties": {
          "toBeFilledByPdOfficer": {
            "type": "string",
            "title": "To be Filled by PD Officer"
          },
          "briefCommentsObservations": {
            "type": "string",
            "title": "Brief Comments / Observations"
          },
          "statusOfThisCasePositiveNegativeCreditRefer": {
            "type": "string",
            "title": "Status of this Case - Positive/Negative/Credit Refer"
          },
          "nameOfPdOfficer": {
            "type": "string",
            "title": "Name of PD Officer"
          },
          "dateOfDiscussion": {
            "type": "string",
            "title": "Date of Discussion"
          },
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
export default niwasSalariedSchema;
