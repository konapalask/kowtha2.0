export const ambitSchema = {
  "id": 8,
  "bankName": "Ambit",
  "sections": [
    {
      "id": "general",
      "label": "General",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfApplicant": {
            "type": "string",
            "title": "Name of Applicant"
          },
          "nameOfCoApplicant": {
            "type": "string",
            "title": "Name of Co-Applicant"
          },
          "applicationNo": {
            "type": "integer",
            "title": "Application no."
          },
          "nameOfConcern": {
            "type": "string",
            "title": "Name of Concern"
          },
          "nameOfTheProprietorAsPerLicense": {
            "type": "string",
            "title": "Name of the proprietor as per license"
          }
        }
      },
      "required": true
    },
    {
      "id": "address",
      "label": "Address",
      "schema": {
        "type": "object",
        "properties": {
          "rentedOwned": {
            "type": "number",
            "title": "Rented/Owned"
          },
          "ownedBy": {
            "type": "string",
            "title": "Owned by"
          },
          "areaInSqFt": {
            "type": "string",
            "title": "Area (In Sq. Ft.)"
          },
          "occupiedSinceYears": {
            "type": "integer",
            "title": "Occupied since (years)"
          }
        }
      },
      "required": true
    },
    {
      "id": "marketValue",
      "label": "Market Value",
      "schema": {
        "type": "object",
        "properties": {
          "ownedBy": {
            "type": "string",
            "title": "Owned by"
          },
          "areaInSqFt": {
            "type": "string",
            "title": "Area (In Sq. Ft.)"
          },
          "occupiedSinceYears": {
            "type": "integer",
            "title": "Occupied since (years)"
          },
          "phoneNumber": {
            "type": "string",
            "title": "Phone Number",
            "pattern": "^[0-9]{10}$"
          },
          "appointmentFixed": {
            "type": "string",
            "title": "Appointment Fixed"
          }
        }
      },
      "required": true
    },
    {
      "id": "noOfVisit",
      "label": "No. of Visit",
      "schema": {
        "type": "object",
        "properties": {
          "personMet": {
            "type": "string",
            "title": "Person Met"
          },
          "aboutTheApplicant": {
            "type": "string",
            "title": "About the Applicant"
          }
        }
      },
      "required": true
    },
    {
      "id": "familyDetails",
      "label": "Family details",
      "schema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "title": "Name"
          },
          "relationalship": {
            "type": "string",
            "title": "Relationalship"
          },
          "age": {
            "type": "integer",
            "title": "Age"
          },
          "education": {
            "type": "string",
            "title": "Education"
          },
          "occupation": {
            "type": "string",
            "title": "Occupation"
          },
          "aboutTheBusiness": {
            "type": "string",
            "title": "About the Business"
          }
        }
      },
      "required": true
    },
    {
      "id": "otherObservations",
      "label": "Other observations",
      "schema": {
        "type": "object",
        "properties": {
          "concerns": {
            "type": "string",
            "title": "Concerns"
          }
        }
      },
      "required": true
    },
    {
      "id": "purposeOfLoan",
      "label": "Purpose of Loan",
      "schema": {
        "type": "object",
        "properties": {
          "asPerAuditedIndividualItrS": {
            "type": "string",
            "title": "As per Audited individual ITR’s"
          },
          "whetherRegisteredUnderMsme": {
            "type": "string",
            "title": "Whether registered under MSME"
          },
          "whetherRegisteredUnderGst": {
            "type": "string",
            "title": "Whether registered under GST"
          }
        }
      },
      "required": true
    },
    {
      "id": "documentsObserved",
      "label": "Documents Observed",
      "schema": {
        "type": "object",
        "properties": {
          "automationLevel": {
            "type": "string",
            "title": "Automation Level"
          },
          "receipts": {
            "type": "string",
            "title": "Receipts"
          },
          "payments": {
            "type": "string",
            "title": "Payments"
          }
        }
      },
      "required": true
    },
    {
      "id": "netProfit",
      "label": "Net Profit",
      "schema": {
        "type": "object",
        "properties": {
          "netMargin": {
            "type": "number",
            "title": "Net Margin"
          }
        }
      },
      "required": true
    },
    {
      "id": "nameAndContactNumberOfRegularSuppliers",
      "label": "Name and Contact number of Regular Suppliers",
      "schema": {
        "type": "object",
        "properties": {
          "expenditure": {
            "type": "string",
            "title": "Expenditure"
          }
        }
      },
      "required": true
    },
    {
      "id": "employees",
      "label": "Employees",
      "schema": {
        "type": "object",
        "properties": {
          "assets": {
            "type": "string",
            "title": "Assets"
          },
          "licMutualFunds": {
            "type": "string",
            "title": "LIC/Mutual funds"
          }
        }
      },
      "required": true
    },
    {
      "id": "bankName",
      "label": "Bank Name",
      "schema": {
        "type": "object",
        "properties": {
          "accountType": {
            "type": "string",
            "title": "Account Type"
          },
          "averageBalance": {
            "type": "number",
            "title": "Average Balance"
          },
          "noOfYearsMaintained": {
            "type": "integer",
            "title": "No. of years maintained"
          }
        }
      },
      "required": true
    },
    {
      "id": "bankName",
      "label": "Bank Name",
      "schema": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "title": "Type"
          }
        }
      },
      "required": true
    },
    {
      "id": "loanAmount",
      "label": "Loan Amount",
      "schema": {
        "type": "object",
        "properties": {
          "emi": {
            "type": "number",
            "title": "EMI"
          },
          "openClose": {
            "type": "string",
            "title": "Open/Close"
          },
          "endUse": {
            "type": "string",
            "title": "End Use"
          },
          "securityOffered": {
            "type": "string",
            "title": "Security Offered"
          }
        }
      },
      "required": true
    },
    {
      "id": "otherBusinessIncome",
      "label": "Other Business/Income",
      "schema": {
        "type": "object",
        "properties": {
          "neighborCheck": {
            "type": "string",
            "title": "Neighbor Check"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default ambitSchema;
