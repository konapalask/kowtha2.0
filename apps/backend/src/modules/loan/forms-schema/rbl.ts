export const rblSchema = {
  "id": 6,
  "bankName": "RBL",
  "sections": [
    {
      "id": "caseDetails",
      "label": "Case Details",
      "schema": {
        "type": "object",
        "properties": {
          "referenceNumber": {
            "type": "string",
            "title": "Reference Number( LOS ID)",
            "readOnly": true
          },
          "nameOfApplicant": {
            "type": "string",
            "title": "Name of Applicant",
            "readOnly": true
          },
          "coApplicant": {
            "type": "string",
            "title": "Co – Applicant"
          },
          "typeOfBorrower": {
            "type": "string",
            "title": "Type of Borrower"
          },
          "meetingDetails": {
            "type": "string",
            "title": "Meeting Details"
          },
          "addressVisited": {
            "type": "string",
            "title": "Address Visited"
          },
          "personMet": {
            "type": "string",
            "title": "Person Met"
          },
          "contactNo": {
            "type": "integer",
            "title": "Contact No"
          },
          "dateOfVisit": {
            "type": "string",
            "title": "Date of Visit"
          }
        },
        "required": [
          "referenceNumber",
          "nameOfApplicant"
        ]
      },
      "required": true
    },
    {
      "id": "businessOwnerDetails",
      "label": "Business owner Details",
      "schema": {
        "type": "object",
        "properties": {
          "businessOwnerDetails": {
            "type": "array",
            "title": "Business owner Details",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "title": "Name"
                },
                "age": {
                  "type": "integer",
                  "title": "Age"
                },
                "qualification": {
                  "type": "string",
                  "title": "Qualification",
                  "enum": [
                    "Below 10th",
                    "10th pass",
                    "Under graduate",
                    "Graduate",
                    "Post Graduate"
                  ]
                },
                "occupation": {
                  "type": "string",
                  "title": "Occupation"
                },
                "relation": {
                  "type": "string",
                  "title": "Relation"
                },
                "remarks": {
                  "type": "string",
                  "title": "Remarks"
                }
              }
            }
          }
        }
      },
      "required": true
    },
    {
      "id": "familyDetails",
      "label": "Family Details",
      "schema": {
        "type": "object",
        "properties": {
          "aboutApplicant": {
            "type": "string",
            "title": "About Applicant"
          },
          "aboutCoApplicant": {
            "type": "string",
            "title": "About Co-applicant:"
          },
          "andTheirFamilyDetails": {
            "type": "string",
            "title": "And their family details:"
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
          "businessName": {
            "type": "string",
            "title": "Business Name",
            "readOnly": true
          },
          "typeOfEntity": {
            "type": "string",
            "title": "Type of Entity"
          },
          "gstNumber": {
            "type": "string",
            "title": "GST Number"
          },
          "legalName": {
            "type": "string",
            "title": "Legal Name"
          },
          "tradeName": {
            "type": "string",
            "title": "Trade Name"
          },
          "lastGSTReturn": {
            "type": "string",
            "title": "Last GST Return (As per GST records)"
          },
          "establishment": {
            "type": "string",
            "title": "Establishment"
          },
          "shopAddress": {
            "type": "string",
            "title": "Shop Address",
            "readOnly": true
          },
          "shopOwnership": {
            "type": "string",
            "title": "Shop Ownership",
            "enum": [
              "Owned",
              "Rented"
            ]
          },
          "godownAddress": {
            "type": "string",
            "title": "Godown Address"
          },
          "godownOwnership": {
            "type": "string",
            "title": "Godown Ownership",
            "enum": [
              "Owned",
              "Rented"
            ]
          },
          "natureOfBusiness": {
            "type": "string",
            "title": "Nature of Business"
          },
          "productDetails": {
            "type": "string",
            "title": "Product Details (please also comment on Vintage of the product deals by the firm & Future changes if any)"
          },
          "businessProcess": {
            "type": "string",
            "title": "Business Process"
          },
          "margins": {
            "type": "string",
            "title": "Margins"
          },
          "documentsObserved": {
            "type": "string",
            "title": "Documents Observed"
          },
          "activityObserved": {
            "type": "string",
            "title": "Activity Observed"
          }
        }
      },
      "required": true
    },
    {
      "id": "inputsPurchases",
      "label": "Inputs/Purchases",
      "schema": {
        "type": "object",
        "properties": {
          "detailsOfInputs": {
            "type": "string",
            "title": "Details of Inputs"
          },
          "purchaseDetails": {
            "type": "string",
            "title": "Purchase Details"
          },
          "orderCycle": {
            "type": "string",
            "title": "Order Cycle"
          },
          "avgOrderQnty": {
            "type": "string",
            "title": "Avg Order Qnty"
          },
          "creditTerms": {
            "type": "string",
            "title": "Credit Terms"
          },
          "otherRemarks": {
            "type": "string",
            "title": "Other Remarks"
          }
        }
      },
      "required": true
    },
    {
      "id": "outputsSupply",
      "label": "Outputs/Supply",
      "schema": {
        "type": "object",
        "properties": {
          "marketForOutput": {
            "type": "string",
            "title": "Market for Output"
          },
          "modeOfMarketing": {
            "type": "string",
            "title": "Mode of Marketing"
          },
          "typeOfCustomers": {
            "type": "string",
            "title": "Type of Customers"
          },
          "creditTerms": {
            "type": "string",
            "title": "Credit Terms"
          },
          "stockOfFinishedGoods": {
            "type": "string",
            "title": "Stock of Finished Goods"
          }
        }
      },
      "required": true
    },
    {
      "id": "employeeDetails",
      "label": "Employee Details",
      "schema": {
        "type": "object",
        "properties": {
          "noOfEmployees": {
            "type": "integer",
            "title": "No. of Employees"
          },
          "salaryDetails": {
            "type": "string",
            "title": "Salary Details"
          },
          "pfEsiApplied": {
            "type": "string",
            "title": "PF/ESI Applied"
          }
        }
      },
      "required": true
    },
    {
      "id": "tradeReferences",
      "label": "Trade References",
      "schema": {
        "type": "object",
        "properties": {
          "suppliers": {
            "type": "array",
            "title": "Trade References - Suppliers",
            "items": {
              "type": "object",
              "properties": {
                "nameOfSuppliers": {
                  "type": "string",
                  "title": "Name of Suppliers"
                },
                "contactDetails": {
                  "type": "string",
                  "title": "Contact Details"
                }
              }
            }
          },
          "customers": {
            "type": "array",
            "title": "Trade References - Customers",
            "items": {
              "type": "object",
              "properties": {
                "nameOfCustomer": {
                  "type": "string",
                  "title": "Name of Customer"
                },
                "contactDetails": {
                  "type": "string",
                  "title": "Contact Details"
                }
              }
            }
          }
        }
      },
      "required": true
    },
    {
      "id": "otherSourcesOfIncome",
      "label": "Other sources of Income",
      "schema": {
        "type": "object",
        "properties": {
          "otherSourcesOfIncome": {
            "type": "array",
            "title": "Other sources of Income",
            "items": {
              "type": "object",
              "properties": {
                "sourceOfIncome": {
                  "type": "string",
                  "title": "Source of Income"
                },
                "details": {
                  "type": "string",
                  "title": "Details"
                }
              }
            }
          }
        }
      },
      "required": true
    },
    {
      "id": "loansDetails",
      "label": "Loans Details",
      "schema": {
        "type": "object",
        "properties": {
          "loansDetails": {
            "type": "array",
            "title": "Loans Details",
            "items": {
              "type": "object",
              "properties": {
                "nameOfBankInstitution": {
                  "type": "string",
                  "title": "Name of Bank / Institution"
                },
                "product": {
                  "type": "string",
                  "title": "Product"
                },
                "loanAmount": {
                  "type": "number",
                  "title": "Loan amount"
                },
                "emi": {
                  "type": "number",
                  "title": "EMI"
                },
                "os": {
                  "type": "string",
                  "title": "O/S"
                },
                "remarks": {
                  "type": "string",
                  "title": "Remarks"
                }
              }
            }
          }
        }
      },
      "required": true
    },
    {
      "id": "applicantsMainBankingDetails",
      "label": "Applicant's main Banking Details",
      "schema": {
        "type": "object",
        "properties": {
          "bankName": {
            "type": "string",
            "title": "Bank Name"
          },
          "accountHolderName": {
            "type": "string",
            "title": "Account Holder name"
          },
          "accountType": {
            "type": "string",
            "title": "Account type"
          },
          "noOfYear": {
            "type": "integer",
            "title": "No of year"
          },
          "limitOfCCOD": {
            "type": "string",
            "title": "Limit of CC/OD"
          },
          "remarks": {
            "type": "string",
            "title": "Remarks"
          },
          "endUse": {
            "type": "string",
            "title": "End Use"
          },
          "ownContribution": {
            "type": "string",
            "title": "Own contribution"
          },
          "particulars": {
            "type": "string",
            "title": "Particulars"
          },
          "remarksAdditional": {
            "type": "string",
            "title": "Remarks"
          }
        }
      },
      "required": true
    },
    {
      "id": "netWorth",
      "label": "Net Worth",
      "schema": {
        "type": "object",
        "properties": {
          "netWorth": {
            "type": "array",
            "title": "Net Worth",
            "items": {
              "type": "object",
              "properties": {
                "typeOfProperty": {
                  "type": "string",
                  "title": "Type of property / Other investments like gold , LIC , FC etc.,"
                },
                "ownerName": {
                  "type": "string",
                  "title": "Owner name"
                },
                "approxMarketValue": {
                  "type": "string",
                  "title": "Approx. Market value"
                },
                "yearsOfOwnership": {
                  "type": "string",
                  "title": "Years of ownership"
                }
              }
            }
          }
        }
      },
      "required": true
    },
    {
      "id": "particulars",
      "label": "Particulars",
      "schema": {
        "type": "object",
        "properties": {
          "coordinates": {
            "type": "string",
            "title": "Coordinates",
            "readOnly": true
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default rblSchema;
