export const axisAgriSchema = {
  id: 9,
  bankName: "Axis Agri",
  sections: [
    {
      id: "general",
      label: "General",
      schema: {
        type: "object",
        properties: {
          referenceNumber: {
            type: "integer",
            title: "Reference Number",
            readOnly: true,
          },
          nameOfFirm: {
            type: "string",
            title: "Name of Firm",
            readOnly: true,
          },
          constitution: {
            type: "string",
            title: "Constitution",
            enum: [
              "Proprietorship",
              "Partnership",
              "Private Limited",
              "Public Limited",
              "LLP",
              "HUF",
            ],
          },
          incorporationDate: {
            type: "string",
            title: "Incorporation Date",
            format: "date",
          },
          latitude: {
            type: "string",
            title: "Latitude",
          },
          longitude: {
            type: "string",
            title: "Longitude",
          },
          region: {
            type: "string",
            title: "Region",
          },
          location: {
            type: "string",
            title: "Location",
          },
          branch: {
            type: "string",
            title: "Branch",
          },
        },
        required: ["referenceNumber", "nameOfFirm"],
      },
      required: true,
    },
    {
      id: "addressOfTheFirm",
      label: "Address of the Firm",
      schema: {
        type: "object",
        properties: {
          dateTimeOfPd: {
            type: "string",
            title: "Date & Time of PD",
          },
          placeOfPd: {
            type: "string",
            title: "Place of PD",
          },
          nameOfPersonMet: {
            type: "string",
            title: "Name of Person Met",
          },
          designation: {
            type: "string",
            title: "Designation",
          },
          nameOfPdOfficial: {
            type: "string",
            title: "Name of PD Official",
          },
        },
      },
      required: true,
    },
    {
      id: "businessProfile",
      label: "Business Profile",
      schema: {
        type: "object",
        properties: {
          typeOfIndustry: {
            type: "string",
            title: "Type of Industry",
            enum: [
              "Agriculture",
              "Manufacturing",
              "Trading",
              "Service",
              "Other",
            ],
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business",
            enum: [
              "Manufacturing",
              "Trading",
              "Service",
              "Retail",
              "Wholesale",
              "Other",
            ],
          },
        },
      },
      required: true,
    },
    {
      id: "residentialAddress",
      label: "Residential Address",
      schema: {
        type: "object",
        properties: {
          phoneNumber: {
            type: "string",
            title: "Phone Number",
            pattern: "^[0-9]{10}$",
          },
          totalExperienceInSameLineOfBusiness: {
            type: "string",
            title: "Total Experience in Same Line of Business",
          },
        },
      },
      required: true,
    },
    {
      id: "shareholdingDetails",
      label: "Shareholding Details",
      schema: {
        type: "object",
        properties: {
          businessLocality: {
            type: "string",
            title: "Business Locality",
          },
        },
      },
      required: true,
    },
    {
      id: "businessPremiseSetupOwnershipNameplateStaff",
      label: "Business Premise setup / Ownership / Nameplate / Staff",
      schema: {
        type: "object",
        properties: {
          financialBrief: {
            type: "string",
            title: "Financial Brief",
          },
          turnover: {
            type: "number",
            title: "Turnover",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "bankName",
      label: "Bank Name",
      schema: {
        type: "object",
        properties: {
          limitType: {
            type: "string",
            title: "Limit Type",
          },
          limitAmount: {
            type: "number",
            title: "Limit Amount",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "stateAdditionalDetailsConductTodIfAvailed",
      label: "State Additional Details Conduct/TOD if availed",
      schema: {
        type: "object",
        properties: {
          isItATakeover: {
            type: "string",
            title: "Is it a Takeover",
          },
        },
      },
      required: true,
    },
    {
      id: "anyOtherLoanObligationsOfTheFirm",
      label: "Any other Loan Obligations of the Firm",
      schema: {
        type: "object",
        properties: {
          currentAccountIfAny: {
            type: "number",
            title: "Current Account if any",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "familyBackgroundNetWorth",
      label: "Family Background & Net-worth",
      schema: {
        type: "object",
        properties: {
          businessSuccessionPlan: {
            type: "string",
            title: "Business Succession Plan",
          },
          qualificationOfProprietorPartnersDirectors: {
            type: "string",
            title: "Qualification of Proprietor / Partners / Directors",
          },
          thirdPartyChecks: {
            type: "string",
            title: "Third Party Checks",
          },
          leaseLandVerification: {
            type: "string",
            title: "Lease land Verification",
          },
        },
      },
      required: true,
    },
    {
      id: "observationsConcerns",
      label: "Observations & Concerns",
      schema: {
        type: "object",
        properties: {
          briefDescriptionOfBusiness: {
            type: "string",
            title: "Brief Description of Business",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default axisAgriSchema;
