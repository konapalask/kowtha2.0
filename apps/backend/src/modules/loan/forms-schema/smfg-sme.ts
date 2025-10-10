export const smfgSmeSchema = {
  "id": 25,
  "bankName": "SMFG SME",
  "sections": [
    {
      "id": "branchCode",
      "label": "Branch Code",
      "schema": {
        "type": "object",
        "properties": {
          "applicationReferenceNo": {
            "type": "string",
            "title": "Application Reference No.",
            "readOnly": true
          },
          "applicantName": {
            "type": "string",
            "title": "Applicant Name",
            "readOnly": true
          },
          "applicantOfficeAddress": {
            "type": "string",
            "title": "Applicant Office Address",
            "readOnly": true
          },
          "personMetNameDesignationMobileNo": {
            "type": "string",
            "title": "Person Met - Name, Designation & Mobile No",
            "pattern": "^[0-9]{10}$"
          }
        }
      },
      "required": true
    },
    {
      "id": "personalInformation",
      "label": "Personal Information:",
      "schema": {
        "type": "object",
        "properties": {
          "detailsOfFamilyMembersNameAgeAndOccupationPlsTickOnDependents": {
            "type": "integer",
            "title": "Details of family members name, age and occupation (pls tick on dependents)"
          },
          "residenceAddress": {
            "type": "string",
            "title": "Residence Address"
          },
          "whetherSelfOwnedParentalRented": {
            "type": "string",
            "title": "whether self owned/parental/rented"
          },
          "areaOfTheHousePropertyAndEstimatedMarketValue": {
            "type": "number",
            "title": "Area of the house property and estimated market value"
          }
        }
      },
      "required": true
    },
    {
      "id": "noOfYearsInSameCity",
      "label": "No. of years in same city",
      "schema": {
        "type": "object",
        "properties": {
          "permanentAddress": {
            "type": "string",
            "title": "Permanent Address"
          },
          "detailsOfOtherOwnedPropertyInTheCity": {
            "type": "string",
            "title": "Details of other owned property in the city"
          },
          "anyOtherSourceOfIncomeApartFromThisBusiness": {
            "type": "number",
            "title": "Any other source of income apart from this business"
          }
        }
      },
      "required": true
    },
    {
      "id": "businessInformation",
      "label": "Business Information",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfBusiness": {
            "type": "string",
            "title": "Name of Business",
            "readOnly": true
          }
        }
      },
      "required": true
    },
    {
      "id": "natureOfBusiness",
      "label": "Nature of Business",
      "schema": {
        "type": "object",
        "properties": {
          "constitution": {
            "type": "string",
            "title": "Constitution"
          }
        }
      },
      "required": true
    },
    {
      "id": "nameOfPartnersDirectorsAndShare",
      "label": "Name of Partners/Directors and share %",
      "schema": {
        "type": "object",
        "properties": {
          "typeOfCustomer": {
            "type": "string",
            "title": "Type of Customer"
          }
        }
      },
      "required": true
    },
    {
      "id": "stabilityInSameBusinessNoOfYears",
      "label": "Stability in same business - No of Years",
      "schema": {
        "type": "object",
        "properties": {
          "whetherTheStabilityWasVerifiedByAnyRegistrationCertificateDistributionDealershipLetterDisplayedInShopOfficeFactory": {
            "type": "string",
            "title": "Whether the stability was verified by any Registration certificate / distribution / dealership letter displayed in shop / office / Factory"
          },
          "familyStructureInvolvedInBusiness": {
            "type": "string",
            "title": "Family Structure involved in Business"
          },
          "businessPremisesWhetherOwnedOrRented": {
            "type": "string",
            "title": "Business Premises whether owned or rented"
          }
        }
      },
      "required": true
    },
    {
      "id": "actualMonthlySalesReceiptsAsPerCustomer",
      "label": "Actual monthly sales/Receipts as per Customer",
      "schema": {
        "type": "object",
        "properties": {
          "whatSalesIsDoneOnCredit": {
            "type": "number",
            "title": "What % sales is done on credit"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default smfgSmeSchema;
