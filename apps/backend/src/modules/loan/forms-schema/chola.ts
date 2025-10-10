export const cholaSchema = {
  "id": 11,
  "bankName": "Chola",
  "sections": [
    {
      "id": "general",
      "label": "General",
      "schema": {
        "type": "object",
        "properties": {
          "basicInformation": {
            "type": "string",
            "title": "Basic Information",
            "readOnly": true
          },
          "nameOfTheApplicant": {
            "type": "string",
            "title": "Name of the Applicant",
            "readOnly": true
          },
          "nameOfTheCoApplicant": {
            "type": "string",
            "title": "Name of the Co-applicant"
          },
          "businessName": {
            "type": "string",
            "title": "Business Name",
            "readOnly": true
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
          "visitedAddress": {
            "type": "string",
            "title": "Visited Address"
          },
          "loanRequested": {
            "type": "number",
            "title": "Loan Requested",
            "readOnly": true
          },
          "purposeOfLoan": {
            "type": "number",
            "title": "Purpose of Loan"
          }
        }
      },
      "required": true
    },
    {
      "id": "dateOfVisit",
      "label": "Date of Visit",
      "schema": {
        "type": "object",
        "properties": {
          "personMet": {
            "type": "string",
            "title": "Person Met"
          }
        }
      },
      "required": true
    },
    {
      "id": "customersNamePhoneBusinessName",
      "label": "Customers (name, phone, business name)",
      "schema": {
        "type": "object",
        "properties": {
          "assetsOwnedByApplicantCoApplicantGuarantor": {
            "type": "string",
            "title": "Assets owned by Applicant / Co-applicant / Guarantor"
          }
        }
      },
      "required": true
    },
    {
      "id": "applicantSFamilyDetails",
      "label": "Applicant’s Family Details",
      "schema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "title": "Name"
          },
          "relationship": {
            "type": "string",
            "title": "Relationship"
          },
          "age": {
            "type": "integer",
            "title": "Age"
          },
          "education": {
            "type": "string",
            "title": "Education"
          }
        }
      },
      "required": true
    },
    {
      "id": "qualification",
      "label": "Qualification",
      "schema": {
        "type": "object",
        "properties": {
          "otherIncomesIfAny": {
            "type": "string",
            "title": "Other Incomes if any"
          }
        }
      },
      "required": true
    },
    {
      "id": "payments",
      "label": "Payments",
      "schema": {
        "type": "object",
        "properties": {
          "netProfitMarigin": {
            "type": "number",
            "title": "Net Profit & Marigin"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default cholaSchema;
