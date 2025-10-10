export const axisFinanceUblBelow10lSchema = {
  "id": 2,
  "bankName": "Axis Finance UBL Below 10L",
  "sections": [
    {
      "id": "basicDetails",
      "label": "Basic Details",
      "schema": {
        "type": "object",
        "properties": {
          "applicationNo": {
            "type": "string",
            "title": "Ref No/Application No",
            "readOnly": true
          },
          "applicantName": {
            "type": "string",
            "title": "Name of the Applicant",
            "readOnly": true
          },
          "concernName": {
            "type": "string",
            "title": "Name of Concern"
          },
          "constitution": {
            "type": "string",
            "title": "Constitution",
            "enum": [
              "Proprietorship",
              "Private Limited",
              "Limited Liability Partnership",
              "Simple Partnership"
            ]
          },
          "initiatedAddress": {
            "type": "string",
            "title": "Initiated Address",
            "readOnly": true
          },
          "visitedAddress": {
            "type": "string",
            "title": "Visited Address"
          },
          "phoneNo": {
            "type": "string",
            "title": "Phone No.",
            "pattern": "^[0-9]{10}$",
            "readOnly": true
          },
          "appointmentFixed": {
            "type": "string",
            "title": "Appointment Fixed",
            "enum": [
              "Yes",
              "No"
            ]
          },
          "structureOfLoan": {
            "type": "string",
            "title": "Structure of Loan"
          },
          "noOfVisit": {
            "type": "integer",
            "title": "No. of Visit"
          },
          "personMet": {
            "type": "string",
            "title": "Person Met"
          },
          "aboutApplicant": {
            "type": "string",
            "title": "About Applicant"
          },
          "residentialDetails": {
            "type": "string",
            "title": "Residential Details"
          },
          "coApplicantDetails": {
            "type": "string",
            "title": "Co-Applicant Details"
          }
        },
        "required": [
          "applicationNo",
          "applicantName",
          "concernName"
        ]
      },
      "required": true
    },
    {
      "id": "familyDetails",
      "label": "Family Details",
      "schema": {
        "type": "object",
        "properties": {
          "familyDetails": {
            "type": "array",
            "title": "Family Details",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "title": "Name"
                },
                "relation": {
                  "type": "string",
                  "title": "Relation with Applicant"
                },
                "ageYears": {
                  "type": "integer",
                  "title": "Age (Yrs)"
                },
                "qualification": {
                  "type": "string",
                  "title": "Qualification"
                },
                "occupation": {
                  "type": "string",
                  "title": "Occupation"
                },
                "incomePerMonth": {
                  "type": "number",
                  "title": "Income per month (approx.)"
                },
                "dependent": {
                  "type": "string",
                  "title": "Dependent"
                }
              }
            }
          }
        }
      },
      "required": true
    },
    {
      "id": "shareholdingDetails",
      "label": "Shareholding Details",
      "schema": {
        "type": "object",
        "properties": {
          "shareholdingDetails": {
            "type": "array",
            "title": "Constitution / Shareholding Details",
            "items": {
              "type": "object",
              "properties": {
                "shareholderName": {
                  "type": "string",
                  "title": "Name of the Shareholder"
                },
                "relationWithMainApplicant": {
                  "type": "string",
                  "title": "Relation with Main Applicant"
                },
                "designation": {
                  "type": "string",
                  "title": "Designation"
                },
                "percentShareholding": {
                  "type": "number",
                  "title": "% of Shareholding"
                },
                "comingIntoLoanStructure": {
                  "type": "string",
                  "title": "Coming into Loan Structure"
                },
                "functionalRole": {
                  "type": "string",
                  "title": "Functional of Partner / Director"
                }
              }
            }
          }
        }
      },
      "required": true
    },
    {
      "id": "businessDetails",
      "label": "Business Details",
      "schema": {
        "type": "object",
        "properties": {
          "aboutBusiness": {
            "type": "string",
            "title": "About the Business"
          },
          "businessSynopsis": {
            "type": "string",
            "title": "Business Synopsis"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default axisFinanceUblBelow10lSchema;
