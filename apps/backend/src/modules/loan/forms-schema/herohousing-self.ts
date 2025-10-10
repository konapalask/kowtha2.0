export const herohousingSelfSchema = {
  "id": 15,
  "bankName": "HeroHousing-Self",
  "sections": [
    {
      "id": "general",
      "label": "General",
      "schema": {
        "type": "object",
        "properties": {
          "loanAccountNo": {
            "type": "number",
            "title": "Loan account No.",
            "readOnly": true
          },
          "nameOfCustomer": {
            "type": "string",
            "title": "Name of customer",
            "readOnly": true
          },
          "personMetInPdAndRelationshipWithApplicant": {
            "type": "string",
            "title": "Person met in PD and relationship with Applicant"
          }
        }
      },
      "required": true
    }
  ]
} as const;
export default herohousingSelfSchema;
