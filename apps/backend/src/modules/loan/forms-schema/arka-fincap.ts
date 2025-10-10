export const arkaFincapSchema = {
  "id": 4,
  "bankName": "Arka Fincap",
  "sections": [
    {
      "id": "applicantDetails",
      "label": "Applicant Details",
      "schema": {
        "type": "object",
        "properties": {
          "applicationNo": {
            "type": "string",
            "title": "Application No",
            "readOnly": true
          },
          "nameOfApplicant": {
            "type": "string",
            "title": "Name of Applicant",
            "readOnly": true
          },
          "nameOfCoApplicant": {
            "type": "string",
            "title": "Name of Co-Applicant"
          },
          "phoneNumber": {
            "type": "string",
            "title": "Phone Number",
            "readOnly": true
          },
          "nameOfConcern": {
            "type": "string",
            "title": "Name of Concern",
            "readOnly": true
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
          "residentialAddress": {
            "type": "string",
            "title": "Residential Address"
          },
          "dateTimeOfVisit": {
            "type": "string",
            "title": "Date & Time of Visit"
          },
          "personMet": {
            "type": "string",
            "title": "Person Met"
          },
          "amountAndPurposeOfLoan": {
            "type": "string",
            "title": "Amount and Purpose of Loan",
            "readOnly": true
          },
          "typeOfCollateral": {
            "type": "string",
            "title": "Type of collateral"
          },
          "collateralPropertyAddress": {
            "type": "string",
            "title": "Collateral Property Address"
          },
          "aboutApplicant": {
            "type": "string",
            "title": "About Applicant(Descriptive section)"
          }
        },
        "required": [
          "applicationNo",
          "nameOfApplicant",
          "nameOfConcern"
        ]
      },
      "required": true
    }
  ]
} as const;
export default arkaFincapSchema;
