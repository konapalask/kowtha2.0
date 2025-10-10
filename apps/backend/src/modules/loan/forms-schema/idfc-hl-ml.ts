export const idfcHlMlSchema = {
  "id": 17,
  "bankName": "IDFC HL & ML",
  "sections": [
    {
      "id": "general",
      "label": "General",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfTheApplicant": {
            "type": "string",
            "title": "Name of the Applicant",
            "readOnly": true
          },
          "nameOfTheCoApplicantS": {
            "type": "string",
            "title": "Name of the Co-Applicant/s"
          },
          "referenceNumber": {
            "type": "integer",
            "title": "Reference Number",
            "readOnly": true
          },
          "product": {
            "type": "string",
            "title": "Product"
          },
          "customerCategory": {
            "type": "string",
            "title": "Customer Category"
          },
          "dateOfInitiation": {
            "type": "string",
            "title": "Date of Initiation"
          },
          "dateOfCustomerAvailability": {
            "type": "string",
            "title": "Date of Customer Availability"
          },
          "dateOfPd": {
            "type": "string",
            "title": "Date of PD"
          },
          "numberOfVisitsMade": {
            "type": "integer",
            "title": "Number of Visits Made"
          },
          "personMet": {
            "type": "string",
            "title": "Person Met"
          },
          "placeAndAddressOfVisit": {
            "type": "string",
            "title": "Place and Address of Visit"
          },
          "ownedRental": {
            "type": "string",
            "title": "Owned/Rental"
          },
          "whetherNameBoardSeen": {
            "type": "string",
            "title": "Whether Name Board Seen"
          }
        }
      },
      "required": true
    },
    {
      "id": "personalDetails",
      "label": "Personal Details",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfTheApplicant": {
            "type": "string",
            "title": "Name of the Applicant"
          },
          "phoneNoOfTheApplicant": {
            "type": "string",
            "title": "Phone No. of the Applicant",
            "pattern": "^[0-9]{10}$"
          },
          "panNo": {
            "type": "string",
            "title": "PAN No."
          },
          "educationalQualification": {
            "type": "string",
            "title": "Educational Qualification"
          },
          "roleInBusiness": {
            "type": "string",
            "title": "Role in Business"
          }
        }
      },
      "required": true
    },
    {
      "id": "detailsOfFamilyMembers",
      "label": "Details of Family Members",
      "schema": {
        "type": "object",
        "properties": {
          "residenceAddress": {
            "type": "string",
            "title": "Residence Address"
          },
          "natureOfResidence": {
            "type": "string",
            "title": "Nature of Residence"
          },
          "noOfYearsInTheSameAddress": {
            "type": "integer",
            "title": "No. of Years in the Same Address"
          },
          "noOfYearsInTheSameCity": {
            "type": "integer",
            "title": "No. of Years in the Same City"
          },
          "permanentAddressIfDifferentFromAbove": {
            "type": "string",
            "title": "Permanent Address (If different from above)"
          }
        }
      },
      "required": true
    },
    {
      "id": "businessWorkDetails",
      "label": "Business / Work Details",
      "schema": {
        "type": "object",
        "properties": {
          "nameOfTheEntityEmployerName": {
            "type": "string",
            "title": "Name of the Entity / Employer Name"
          },
          "constitution": {
            "type": "string",
            "title": "Constitution"
          },
          "briefOnBusinessModelAndNatureOfBusiness": {
            "type": "string",
            "title": "Brief on Business Model and Nature of Business"
          },
          "yearOfIncorporation": {
            "type": "integer",
            "title": "Year of Incorporation"
          }
        }
      },
      "required": true
    },
    {
      "id": "businessActivelyManagedBySelfOthersIfOthersNameRelationship",
      "label": "Business actively managed by (Self/Others; If others, name & relationship)",
      "schema": {
        "type": "object",
        "properties": {
          "numberOfYearsInBusinessService": {
            "type": "integer",
            "title": "Number of Years in Business / Service"
          },
          "totalWorkExperience": {
            "type": "string",
            "title": "Total Work Experience"
          },
          "businessStartedBySelfOrFamilyBusiness": {
            "type": "string",
            "title": "Business Started by (Self or Family Business)"
          },
          "previousWorkExperience": {
            "type": "string",
            "title": "Previous Work Experience"
          },
          "ifPvtLtdNameOfDirectorsAndTheirShareholding": {
            "type": "string",
            "title": "If Pvt. Ltd. – Name of Directors and their Shareholding"
          },
          "registeredWithShopEstablishmentActYesNoRegnNo": {
            "type": "string",
            "title": "Registered with Shop & Establishment Act (Yes/No, Regn No.)"
          }
        }
      },
      "required": true
    },
    {
      "id": "operationalDetails",
      "label": "Operational Details",
      "schema": {
        "type": "object",
        "properties": {
          "natureOfBusinessLineOfActivity": {
            "type": "string",
            "title": "Nature of Business / Line of Activity"
          },
          "relevantExperienceQualification": {
            "type": "string",
            "title": "Relevant Experience / Qualification"
          },
          "describeBusinessProcess": {
            "type": "string",
            "title": "Describe Business Process"
          },
          "detailsOfProduct": {
            "type": "string",
            "title": "Details of Product"
          },
          "sourceOfRawMaterial": {
            "type": "string",
            "title": "Source of Raw Material"
          },
          "namesOfCustomersWithContactNo": {
            "type": "string",
            "title": "Names of Customers with Contact No.",
            "pattern": "^[0-9]{10}$"
          },
          "namesOfSuppliersWithContactNo": {
            "type": "string",
            "title": "Names of Suppliers with Contact No.",
            "pattern": "^[0-9]{10}$"
          },
          "employeeStrengthAndActualSeenAtVisit": {
            "type": "string",
            "title": "Employee Strength and Actual Seen at Visit"
          },
          "strengthsAndWeaknessesOfBusiness": {
            "type": "string",
            "title": "Strengths and Weaknesses of Business"
          },
          "activityLevelAtTimeOfVisit": {
            "type": "string",
            "title": "Activity Level at Time of Visit"
          }
        }
      },
      "required": true
    },
    {
      "id": "avgBalance",
      "label": "Avg Balance",
      "schema": {
        "type": "object",
        "properties": {
          "otherAssets": {
            "type": "string",
            "title": "Other Assets"
          },
          "otherBusinessIfAny": {
            "type": "string",
            "title": "Other Business (if any)"
          },
          "rentalIncomeIfAny": {
            "type": "number",
            "title": "Rental Income (if any)"
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
          "amountOfLoanApplied": {
            "type": "number",
            "title": "Amount of Loan Applied"
          },
          "purposeOfLoanEndUse": {
            "type": "number",
            "title": "Purpose of Loan (End Use)"
          },
          "collateralOffered": {
            "type": "string",
            "title": "Collateral Offered"
          },
          "addressOfThePropertyOfferedAsCollateral": {
            "type": "string",
            "title": "Address of the Property Offered as Collateral"
          },
          "ownerOfTheProperty": {
            "type": "string",
            "title": "Owner of the Property"
          },
          "ifThePropertyIsVacantReason": {
            "type": "string",
            "title": "If the Property is Vacant, Reason"
          },
          "areaOfThePropertySqYd": {
            "type": "string",
            "title": "Area of the Property (Sq. yd.)"
          },
          "marketValueOfThePropertyApprox": {
            "type": "number",
            "title": "Market Value of the Property (Approx)"
          }
        }
      },
      "required": true
    },
    {
      "id": "isThePropertyMortgagedWithAnyBankFi",
      "label": "Is the Property Mortgaged with any Bank/FI?",
      "schema": {
        "type": "object",
        "properties": {
          "ifYesNameOfFinancierAndLoanDetails": {
            "type": "number",
            "title": "If Yes – Name of Financier and Loan Details"
          },
          "endUseOfLoan": {
            "type": "number",
            "title": "End Use of Loan"
          }
        }
      },
      "required": true
    },
    {
      "id": "personalDiscussionDetails",
      "label": "Personal Discussion Details",
      "schema": {
        "type": "object",
        "properties": {
          "strengths": {
            "type": "string",
            "title": "Strengths"
          },
          "otherObservationEGGstGstReturnsBankStatementItrsFoodLicense": {
            "type": "string",
            "title": "Other Observation (e.g., GST, GST Returns, Bank Statement, ITRs, Food License)"
          },
          "statusOfThisCasePositiveNegativeCreditRefer": {
            "type": "string",
            "title": "Status of this Case - Positive/Negative/Credit Refer"
          },
          "remarks": {
            "type": "string",
            "title": "Remarks"
          },
          "pdConductedBy": {
            "type": "string",
            "title": "PD Conducted by"
          },
          "signature": {
            "type": "string",
            "title": "Signature"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default idfcHlMlSchema;
