export const axisAgriSchema = {
  id: 9,
  bankName: "Axis Agri",
  sections: [
    {
      id: "generalInfo",
      label: "General Information",
      schema: {
        type: "object",
        properties: {
          referenceNumber: {
            type: "string",
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
              "Other",
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
      id: "pdVisitDetails",
      label: "PD Visit Details",
      schema: {
        type: "object",
        properties: {
          addressOfFirm: {
            type: "string",
            title: "Address of the Firm",
            ui: { widget: "textarea", rows: 3 },
          },
          dateAndTimeOfPd: {
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
            title: "Designation of Person Met",
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
          managementDetails: {
            type: "string",
            title: "Details on management of business",
            ui: { widget: "textarea", rows: 3 },
          },
          totalExperience: {
            type: "string",
            title: "Total Experience in Same Line Business",
          },
          shareholdingDetails: {
            type: "string",
            title: "Shareholding Details",
            ui: { widget: "textarea", rows: 2 },
          },
          businessLocality: {
            type: "string",
            title: "Business Locality",
          },
          premiseSetup: {
            type: "string",
            title: "Business Premise setup / Ownership / Nameplate / Staff",
            ui: { widget: "textarea", rows: 3 },
          },
          financialBrief: {
            type: "string",
            title: "Financial Brief",
            ui: { widget: "textarea", rows: 3 },
          },
          financeTurnover: {
            type: "number",
            title: "Annual Turnover (Rs.)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          collateralSecurityDetails: {
            type: "string",
            title: "Collateral Security Details",
            ui: { widget: "textarea", rows: 2 },
          },
          currentAccountIfAny: {
            type: "string",
            title: "Current Account (if any)",
          },
          existingBankingRelationsWithAxisIfAny: {
            type: "string",
            title: "Existing Banking Relations with Axis (if any)",
            ui: { widget: "textarea", rows: 2 },
          },
        },
      },
      required: true,
    },
    {
      id: "bankingAndWorkingCapital",
      label: "Banking & Working Capital Limits",
      schema: {
        type: "object",
        properties: {
          facilities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
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
                  },
                },
              },
            },
          },
          additionalDetails: {
            type: "string",
            title: "Additional Details / Conduct / TOD if availed",
            ui: { widget: "textarea", rows: 2 },
          },
          takeoverRemarks: {
            type: "string",
            title: "Is it a Takeover?",
          },
          otherLoanObligations: {
            type: "string",
            title: "Other Loan Obligations of the Firm",
            ui: { widget: "textarea", rows: 2 },
          },
        },
      },
    },
    {
      id: "suppliersClients",
      label: "Major Suppliers & Clients",
      schema: {
        type: "object",
        properties: {
          suppliersClients: {
            type: "array",
            items: {
              type: "object",
              properties: {
                suppliers: {
                  type: "string",
                  title: "Suppliers (Creditors)",
                },
                clients: {
                  type: "string",
                  title: "Clients (Debtors)",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "observations",
      label: "Observations, Risks & Succession",
      schema: {
        type: "object",
        properties: {
          stocksRawMaterialObservations: {
            type: "string",
            title: "Stocks / Raw material related observations",
            ui: { widget: "textarea", rows: 2 },
          },
          covidImpact: {
            type: "string",
            title: "COVID-19 Impact & Recovery period / Other Business Risks",
            ui: { widget: "textarea", rows: 2 },
          },
          familyBackgroundNetWorth: {
            type: "string",
            title: "Family Background & Net-worth",
            ui: { widget: "textarea", rows: 2 },
          },
          businessSuccessionPlan: {
            type: "string",
            title: "Business Succession Plan",
            ui: { widget: "textarea", rows: 2 },
          },
          qualificationOfPromoters: {
            type: "string",
            title: "Qualification of Proprietor / Partners / Directors",
            ui: { widget: "textarea", rows: 2 },
          },
          thirdPartyChecks: {
            type: "string",
            title: "Third Party Checks",
            ui: { widget: "textarea", rows: 2 },
          },
          leaseLandVerification: {
            type: "string",
            title: "Lease land Verification",
            ui: { widget: "textarea", rows: 2 },
          },
          remarksObservations: {
            type: "string",
            title: "Remarks & Observations",
            ui: { widget: "textarea", rows: 3 },
          },
          pdFinalStatus: {
            type: "string",
            title: "PD Final Status",
            enum: ["Positive", "Negative", "Referred", "Pending"],
          },
          pdVendorDetails: {
            type: "string",
            title: "PD Vendor Name & Address",
            ui: { widget: "textarea", rows: 2 },
          },
          pdVendorStamp: {
            type: "string",
            title: "PD Vendor Stamp & Signature",
          },
        },
      },
    },
  ],
} as const;

export default axisAgriSchema;
