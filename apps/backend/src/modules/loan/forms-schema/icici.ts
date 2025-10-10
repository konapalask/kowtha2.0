export const iciciSchema = {
  "id": 16,
  "bankName": "ICICI",
  "sections": [
    {
      "id": "general",
      "label": "General",
      "schema": {
        "type": "object",
        "properties": {
          "apsId": {
            "type": "string",
            "title": "APS ID"
          },
          "applicationNo": {
            "type": "integer",
            "title": "Application No",
            "readOnly": true
          },
          "initiationDate": {
            "type": "string",
            "title": "Initiation Date"
          },
          "branch": {
            "type": "string",
            "title": "Branch"
          }
        }
      },
      "required": true
    },
    {
      "id": "distanceFromHfcBranch",
      "label": "Distance from HFC Branch",
      "schema": {
        "type": "object",
        "properties": {
          "applicants": {
            "type": "string",
            "title": "Applicants"
          }
        }
      },
      "required": true
    },
    {
      "id": "familyBackgroundPersonalDetails",
      "label": "Family Background & Personal Details",
      "schema": {
        "type": "object",
        "properties": {
          "currentResidenceOwnedRented": {
            "type": "string",
            "title": "Current Residence – Owned/Rented"
          },
          "ifOwnedOwnerName": {
            "type": "string",
            "title": "If Owned – Owner Name"
          },
          "ifRentedOwnerNameContactNo": {
            "type": "string",
            "title": "If Rented – Owner Name & Contact No",
            "pattern": "^[0-9]{10}$"
          },
          "ifRentedPermanentResidenceDetails": {
            "type": "string",
            "title": "If Rented – Permanent Residence Details"
          },
          "noOfYearsInCurrentResidencePreviousResidenceDetails": {
            "type": "integer",
            "title": "No. of Years in Current Residence & Previous Residence Details"
          },
          "noOfYearsInSameCity": {
            "type": "integer",
            "title": "No. of Years in Same City"
          }
        }
      },
      "required": true
    },
    {
      "id": "businessLocalityMarketCompetition",
      "label": "Business Locality & Market Competition",
      "schema": {
        "type": "object",
        "properties": {
          "incomeAssessment": {
            "type": "number",
            "title": "Income Assessment"
          }
        }
      },
      "required": true
    },
    {
      "id": "assetCreationInLast5Years",
      "label": "Asset Creation in Last 5 Years",
      "schema": {
        "type": "object",
        "properties": {
          "cashFlowAnalysisPd": {
            "type": "string",
            "title": "Cash Flow Analysis (PD)"
          }
        }
      },
      "required": true
    },
    {
      "id": "grossMonthlyIncome",
      "label": "Gross Monthly Income",
      "schema": {
        "type": "object",
        "properties": {
          "lessMonthlyBusinessExpenses": {
            "type": "string",
            "title": "Less Monthly Business Expenses"
          }
        }
      },
      "required": true
    },
    {
      "id": "customersNameContactNoFeedback",
      "label": "Customers (Name, Contact No. & Feedback)",
      "schema": {
        "type": "object",
        "properties": {
          "neighborNameContactNoFeedback": {
            "type": "string",
            "title": "Neighbor (Name, Contact No. & Feedback)",
            "pattern": "^[0-9]{10}$"
          }
        }
      },
      "required": true
    },
    {
      "id": "sellerDetails",
      "label": "Seller Details",
      "schema": {
        "type": "object",
        "properties": {
          "ocrPurchaseCase": {
            "type": "string",
            "title": "OCR (Purchase Case)"
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
          "remarks": {
            "type": "string",
            "title": "Remarks"
          },
          "statusOfThisCasePositiveNegativeCreditRefer": {
            "type": "string",
            "title": "Status of this Case - Positive/Negative/Credit Refer"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default iciciSchema;
