import financialsSchema from "../financials-schema/generic";

export const ambitMsmeSchema = {
  id: 27,
  bankName: "Ambit-MSME",
  sections: [
    {
      id: "general",
      label: "General",
      schema: {
        type: "object",
        properties: {
          nameOfApplicant: {
            type: "string",
            title: "Name of Applicant",
            readOnly: true,
          },
          nameOfCoApplicant: {
            type: "string",
            title: "Name of Co-Applicant",
          },
          dateOfReport: {
            type: "string",
            title: "Date of Report",
            format: "date",
          },
          applicationNo: {
            type: "string",
            title: "Ambit Application ID",
            readOnly: true,
          },
          loanAmount: {
            type: "number",
            title: "Requested Loan Amount",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
            readOnly: true,
          },
          emi: {
            type: "number",
            title: "Maximum Comfortable EMI",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          businessName: {
            type: "string",
            title: "Business Name",
            readOnly: true,
          },
          nameOfTheProprietor: {
            type: "string",
            title: "Name of the proprietor as per Business license",
          },
        },
      },
      required: true,
    },

    {
      id: "addressDetails",
      label: "Address Details",
      schema: {
        type: "object",
        properties: {
          initiatedAddress: {
            type: "string",
            title: "Initiated Address",
            ui: {
              widget: "textarea",
              rows: 2,
            },
            readOnly: true,
          },
          visitedAddress: {
            type: "object",
            title: "Visited Address",
            properties: {
              address: {
                type: "string",
                title: "Address",
                ui: {
                  widget: "textarea",
                  rows: 2,
                },
              },
            },
          },
          businessLicenseAddress: {
            type: "string",
            title: "Business License Address",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
        },
      },
    },

    {
      id: "residentialDetails",
      label: "Residential Details",
      schema: {
        type: "object",
        properties: {
          address: {
            type: "string",
            title: "Address",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          rentedOrOwned: {
            type: "string",
            title: "Rented/Owned",
            enum: ["Rented", "Owned"],
          },
          ownedBy: {
            type: "string",
            title: "Owned by",
          },
          areaInSqFt: {
            type: "number",
            title: "Area (In Sq. Ft.)",
          },
          occupiedSinceYears: {
            type: "number",
            title: "Occupied since (years)",
          },
        },
      },
    },
    {
      id: "propertyDetails",
      label: "Property Details",
      schema: {
        type: "object",
        properties: {
          address: {
            type: "string",
            title: "Address",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          ownerName: {
            type: "string",
            title: "Property owner name",
          },
          marketValue: {
            type: "number",
            title: "Market Value",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          areaInSqft: {
            type: "number",
            title: "Area (In Sq. Ft.)",
          },
          occupiedSinceYears: {
            type: "number",
            title: "Occupied since (years)",
          },
        },
      },
    },
    {
      id: "generalInfo",
      label: "General Info",
      schema: {
        type: "object",
        properties: {
          phoneNumberOfApplicant: {
            type: "integer",
            title: "Mob no. of Applicant",
            readOnly: true,
          },
          phoneNumberOfCoApplicant: {
            type: "integer",
            title: "Mob no. of Co-Applicant",
          },
          kycDetailsOfApplicant: {
            type: "string",
            title: "Applicant KYC details and Utility bills/license",
          },
          kycDetailsOfCoApplicant: {
            type: "string",
            title: "Co-Applicant KYC details and Utility bills/license",
          },
          pdDoneDateAndTime: {
            type: "string",
            title: "PD done date and time",
            format: "datetime",
          },
          typeOfLoan: {
            type: "string",
            title: "Type of Loan",
          },
          noOfVisit: {
            type: "string",
            title: "No. of Visit",
          },
          personMet: {
            type: "string",
            title: "Person Met (with name and Relation)",
          },
        },
      },
    },
    {
      id: "applicantDetails",
      label: "Applicant Details",
      schema: {
        type: "object",
        properties: {
          applicantProfile: {
            type: "string",
            title: "Applicant Profile",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          detailsOfCoApplicant: {
            type: "string",
            title: "Details of all Co-Applicant",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "familyDetails",
      label: "Family Details",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "array",
            title: "Family Details",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relation: {
                  type: "string",
                  title: "Relation with Applicant",
                  enum: [
                    "Father",
                    "Mother",
                    "Brother",
                    "Sister",
                    "Spouse",
                    "Son",
                    "Daughter",
                    "Other",
                  ],
                },
                age: {
                  type: "number",
                  title: "Age (Yrs)",
                },
                qualification: {
                  type: "string",
                  title: "Qualification",
                  enum: [
                    "Below 10th",
                    "10th pass",
                    "12th pass",
                    "Diploma/ITI certification",
                    "Graduate",
                    "PG/Professional Certification",
                  ],
                },
                occupation: {
                  type: "string",
                  title: "Occupation",
                },
                incomePerMonth: {
                  type: "number",
                  title: "Income per month (approx.)",
                },
                dependent: {
                  type: "string",
                  title: "Dependent",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "businessDetails",
      label: "Business Details",
      schema: {
        type: "object",
        properties: {
          businessDetails: {
            type: "string",
            title: "Business/Employment Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "incomeAssessment",
      label: "Income Assessment",
      schema: {
        type: "object",
        properties: {
          incomeAssessment: {
            type: "string",
            title: "Income Assessment",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "suppliersDetails",
      label: "Suppliers Details",
      schema: {
        type: "object",
        properties: {
          suppliersDetails: {
            type: "array",
            title: "Suppliers Details",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNumber: {
                  type: "integer",
                  title: "Mob Number",
                },
                location: {
                  type: "string",
                  title: "Location",
                },
                feedback: {
                  type: "string",
                  title: "Feedback",
                  ui: {
                    widget: "textarea",
                    rows: 3,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "customersDetails",
      label: "Customers Details",
      schema: {
        type: "object",
        properties: {
          customersDetails: {
            type: "array",
            title: "Customers Details",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                contactNumber: {
                  type: "integer",
                  title: "Mob Number",
                },
                location: {
                  type: "string",
                  title: "Location",
                },
                feedback: {
                  type: "string",
                  title: "Feedback",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "NeighbourChecks",
      label: "Neighbour Check (TPC)",
      schema: {
        type: "object",
        properties: {
          neighbourChecks: {
            type: "array",
            title: "Neighbour Checks",
            items: {
              type: "object",
              properties: {
                neighbourName: {
                  type: "string",
                  title: "Neighbour, Resi/Business & Collateral Name",
                },
                contactNumber: {
                  type: "integer",
                  title: "Mob Number",
                },
                location: {
                  type: "string",
                  title: "Location",
                },
                feedback: {
                  type: "string",
                  title: "Feedback",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "otherChecks",
      label: "Other Checks from Neighbour",
      schema: {
        type: "object",
        properties: {
          otherChecks: {
            type: "array",
            title: "Other Checks from Neighbour",
            items: {
              type: "object",
              properties: {
                otherChecks: {
                  type: "string",
                  title: "Other Checks from Neighbour",
                },
                remarks: {
                  type: "string",
                  title: "Remarks",
                },
              },
            },
          },
        },
      },
    },

    {
      id: "averageStockMaintained",
      label: "Average Stock Maintained",
      schema: {
        type: "object",
        properties: {
          averageStockMaintained: {
            type: "number",
            title: "Average Stock Maintained",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
        },
      },
    },

    {
      id: "businessOrIncomeDetails",
      label: "Business or Income Details",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "string",
            title: "Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },

    {
      id: "assetsDetails",
      label: "Assets Details",
      schema: {
        type: "object",
        properties: {
          assetsDetails: {
            type: "array",
            title: "Assets Details",
            items: {
              type: "object",
              properties: {
                assetType: {
                  type: "string",
                  title: "Asset Type",
                },
                ownerName: {
                  type: "string",
                  title: "Ownership Hold By",
                },
                valueOfAsset: {
                  type: "string",
                  title: "Value of Asset",
                },
                currentSratus: {
                  type: "string",
                  title: "Current Status",
                  enum: ["Vacant", "Rental"],
                },
                pledgeOrFree: {
                  type: "string",
                  title: "Pledge/Free",
                },
              },
            },
          },
        },
      },
    },

    {
      id: "endUseOfLoan",
      label: "End Use of Loan",
      schema: {
        type: "object",
        properties: {
          endUse: {
            type: "string",
            title: "End Use of Loan Purppose",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "loanDetails",
      label: "Loan Details",
      schema: {
        type: "object",
        properties: {
          loanDetails: {
            type: "array",
            title: "Loan Details",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Name of Bank / NBFC",
                },
                typeOfLoan: {
                  type: "string",
                  title: "Type of Loan",
                },
                sanctionedAmount: {
                  type: "number",
                  title: "Sanctioned Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                osBalance: {
                  type: "number",
                  title: "O/S Balance (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                emi: {
                  type: "number",
                  title: "EMI Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                tenure: {
                  type: "number",
                  title: "Tenure (in Months)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                emiClearanceBankName: {
                  type: "string",
                  title: "EMI Clearance Bank Name",
                },
              },
            },
          },
        },
      },
    },

    {
      id: "strenghtsAndWeaknesses",
      label: "Strengths and Weaknesses",
      schema: {
        type: "object",
        properties: {
          strengths: {
            type: "string",
            title: "Strengths",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          weaknesses: {
            type: "string",
            title: "Weaknesses",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "documentsSeen",
      label: "Documents Seen",
      schema: {
        type: "object",
        properties: {
          documents: {
            type: "string",
            title: "Documents Seen",
          },
        },
      },
    },
    {
      id: "bankingDetails",
      label: "Banking Details",
      schema: {
        type: "object",
        properties: {
          bankingDetails: {
            type: "array",
            title: "Banking Details",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                accountType: {
                  type: "string",
                  title: "Account Type",
                },
                openSinceYear: {
                  type: "number",
                  title: "Open Since (Year)",
                },
                odOrCcLimit: {
                  type: "number",
                  title: "OD/CC Limit",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "otherObservations",
      label: "Other Observations",
      schema: {
        type: "object",
        properties: {
          observations: {
            type: "string",
            title: "Other Observations",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default ambitMsmeSchema;
