import financialsSchema from "../financials-schema/generic";
export const idfcHlMlSchema = {
  id: 17,
  bankName: "IDFC HL & ML",
  sections: [
    financialsSchema,
    {
      id: "generalDetails",
      label: "General Details",
      schema: {
        type: "object",
        properties: {
          nameOfApplicant: {
            type: "string",
            title: "Name of the Applicant",
            readOnly: true,
          },
          nameOfTheApplicant: {
            type: "string",
            title: "Name of the Applicant (legacy)",
          },
          nameOfCoApplicants: {
            type: "string",
            title: "Name of the Co-Applicant/s",
          },
          nameOfTheCoApplicantS: {
            type: "string",
            title: "Name of the Co-Applicant/s (legacy)",
          },
          referenceNumber: {
            type: "string",
            title: "Reference Number",
            readOnly: true,
          },
          product: {
            type: "string",
            title: "Product",
          },
          customerCategory: {
            type: "string",
            title: "Customer Category",
          },
          dateOfInitiation: {
            type: "string",
            title: "Date of Initiation",
            format: "date",
          },
          dateOfCustomerAvailability: {
            type: "string",
            title: "Date of Customer Availability",
            format: "date",
          },
          dateOfPd: {
            type: "string",
            title: "Date of PD",
            format: "date",
          },
          numberOfVisitsMade: {
            type: "string",
            title: "Number of Visits Made",
          },
          personMet: {
            type: "string",
            title: "Person Met",
          },
          placeAndAddressOfVisit: {
            type: "string",
            title: "Place and Address of Visit",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          ownershipStatus: {
            type: "string",
            title: "Owned/ Rental",
          },
          ownedRental: {
            type: "string",
            title: "Owned/ Rental (legacy)",
          },
          nameBoardSeen: {
            type: "string",
            title: "Whether Name Board Seen",
            enum: ["Yes", "No"],
          },
          whetherNameBoardSeen: {
            type: "string",
            title: "Whether Name Board Seen (legacy)",
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
      },
    },
    {
      id: "personalDetails",
      label: "Personal Details",
      schema: {
        type: "object",
        properties: {
          applicantName: {
            type: "string",
            title: "Name of the Applicant",
          },
          phoneNumber: {
            type: "string",
            title: "Phone No. of the Applicant",
          },
          panNumber: {
            type: "string",
            title: "PAN No.",
          },
          educationalQualification: {
            type: "string",
            title: "Educational Qualification",
          },
          roleInBusiness: {
            type: "string",
            title: "Role in Business",
          },
          familyMembers: {
            type: "array",
            title: "Details of Family Members",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relationship: {
                  type: "string",
                  title: "Relationship",
                },
                age: {
                  type: "string",
                  title: "Age",
                },
                qualification: {
                  type: "string",
                  title: "Qualification",
                },
                occupation: {
                  type: "string",
                  title: "Occupation",
                },
              },
            },
          },
          familyDetailsText: {
            type: "string",
            title: "Family Details (Narrative)",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
          residenceAddress: {
            type: "string",
            title: "Residence Address",
          },
          natureOfResidence: {
            type: "string",
            title: "Nature of Residence",
          },
          yearsInSameAddress: {
            type: "string",
            title: "No. of years in the same address",
          },
          yearsInSameCity: {
            type: "string",
            title: "No. of years in the same City",
          },
          permanentAddress: {
            type: "string",
            title: "Permanent Address (If different from above)",
          },
          coApplicantRelationship: {
            type: "string",
            title: "Name of the co-applicants and relationship",
          },
        },
      },
    },
    {
      id: "businessDetails",
      label: "Business / Work Details",
      schema: {
        type: "object",
        properties: {
          entityName: {
            type: "string",
            title: "Name of the Entity / Employer Name",
          },
          constitution: {
            type: "string",
            title: "Constitution",
          },
          businessModel: {
            type: "string",
            title: "Brief on business model and nature of business",
            ui: {
              widget: "textarea",
              rows: 4,
            },
          },
          yearOfIncorporation: {
            type: "integer",
            title: "Year of Incorporation",
          },
          businessManagedBy: {
            type: "string",
            title: "Business actively managed by (Self/Others; If others, name & relationship)",
          },
          numberOfYearsInBusiness: {
            type: "string",
            title: "Number of years in Business/Service",
          },
          totalWorkExperience: {
            type: "string",
            title: "Total work experience",
          },
          businessStartedBy: {
            type: "string",
            title: "Business started by (Self or Family Business)",
          },
          previousWorkExperience: {
            type: "string",
            title: "Previous work experience",
          },
          directorShareholding: {
            type: "string",
            title: "If Pvt. Ltd. – Name of Directors and their shareholding",
          },
          shopEstablishmentRegistration: {
            type: "string",
            title: "Registered with Shop & Establishment act? (Regn No.)",
          },
        },
      },
    },
    {
      id: "operationalDetails",
      label: "Operational Details",
      schema: {
        type: "object",
        properties: {
          natureOfBusiness: {
            type: "string",
            title: "Nature of business / line of activity",
          },
          relevantExperience: {
            type: "string",
            title: "Relevant experience / qualification",
          },
          businessProcess: {
            type: "string",
            title: "Describe business process",
            ui: {
              widget: "textarea",
              rows: 6,
            },
          },
          productDetails: {
            type: "string",
            title: "Details of product",
          },
          rawMaterialSource: {
            type: "string",
            title: "Source of raw material",
          },
          customerNames: {
            type: "string",
            title: "Names of customers with contact No.",
          },
          supplierNames: {
            type: "string",
            title: "Names of suppliers with contact No.",
          },
          employeeStrength: {
            type: "string",
            title: "Employee strength and actual seen at the time of visit",
          },
          businessStrengthsWeaknesses: {
            type: "string",
            title: "Strengths and weaknesses of business",
          },
          activityLevelAtVisit: {
            type: "string",
            title: "Activity level at the time of visit",
          },
        },
      },
    },
    {
      id: "financialDetails",
      label: "Financial Details",
      schema: {
        type: "object",
        properties: {
          grossIncomePerYearActual: {
            type: "string",
            title: "Gross income per year (actual)",
          },
          grossIncomePerYearEstimated: {
            type: "string",
            title: "Gross income per year (estimation)",
          },
          netIncomePerYearActual: {
            type: "string",
            title: "Net income per year (actual)",
          },
          netIncomePerYearEstimated: {
            type: "string",
            title: "Net income per year (estimation)",
          },
          netProfitLastTwoYears: {
            type: "string",
            title: "Net profit for last 2 years",
          },
          grossBusinessMarginPercent: {
            type: "string",
            title: "Gross business margin %",
          },
          netBusinessMarginPercent: {
            type: "string",
            title: "Net business margin %",
          },
          yearsFilingItrs: {
            type: "string",
            title: "No. of years filing ITRs",
          },
          lastTwoYearsItrs: {
            type: "string",
            title: "Last 2 years ITRs",
          },
          lastTwoYearsForm16: {
            type: "string",
            title: "Last 2 years Form 16 (Salaried)",
          },
        },
      },
    },
    {
      id: "termLoans",
      label: "Loans & Banking Details - Term Loans",
      schema: {
        type: "object",
        properties: {
          termLoans: {
            type: "array",
            title: "Term Loans",
            items: {
              type: "object",
              properties: {
                institution: {
                  type: "string",
                  title: "Institution / Bank / NBFC Name",
                },
                loanType: {
                  type: "string",
                  title: "Type of Loan (LAP / HL / CD / CV / AL etc.)",
                },
                monthlyEmi: {
                  type: "string",
                  title: "Monthly Principal / EMI",
                },
                monthlyInterest: {
                  type: "string",
                  title: "Monthly Interest (if not in EMI mode)",
                },
                loanAmount: {
                  type: "string",
                  title: "Loan amount (Rs. lacs)",
                },
                mob: {
                  type: "string",
                  title: "MOB",
                },
                outstanding: {
                  type: "string",
                  title: "Outstanding (Rs)",
                },
              },
            },
          },
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
                  title: "Type of Account",
                },
                relationshipSince: {
                  type: "string",
                  title: "Relationship since",
                },
                averageBalance: {
                  type: "string",
                  title: "Avg balance",
                },
              },
            },
          },
          otherAssets: {
            type: "string",
            title: "Other Assets",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          otherBusiness: {
            type: "string",
            title: "Other Business if any",
          },
          rentalIncome: {
            type: "string",
            title: "Rental Income (if any)",
          },
          rentalProperties: {
            type: "array",
            title: "Rental property details",
            items: {
              type: "object",
              properties: {
                propertyAddress: {
                  type: "string",
                  title: "Property address",
                },
                tenantName: {
                  type: "string",
                  title: "Tenant Name",
                },
                tenure: {
                  type: "string",
                  title: "Since when (no of years)",
                },
                rentAgreementAvailable: {
                  type: "string",
                  title: "Rent agreement available (Y/N)",
                },
                monthlyRent: {
                  type: "string",
                  title: "Monthly rent amount (incl. maintenance)",
                },
              },
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
          loanAmountApplied: {
            type: "string",
            title: "Amount of loan applied",
          },
          purposeOfLoan: {
            type: "string",
            title: "Purpose of loan (End use)",
          },
          collateralOffered: {
            type: "string",
            title: "Collateral offered",
          },
          collateralAddress: {
            type: "string",
            title: "Address of the property offered as collateral",
          },
          propertyOwner: {
            type: "string",
            title: "Owner of the property",
          },
          propertyVacantReason: {
            type: "string",
            title: "If the property is vacant, reason for the same",
          },
          propertyArea: {
            type: "string",
            title: "Area of the property (Sq. yd.)",
          },
          propertyMarketValue: {
            type: "string",
            title: "Market value of the property (Approx)",
          },
          propertyMortgaged: {
            type: "string",
            title: "Is the property presently mortgaged with any Bank / FI?",
          },
          existingFinancierDetails: {
            type: "string",
            title: "If yes (provide the name of financier and loan details)",
          },
          loanEndUse: {
            type: "string",
            title: "End use of loan",
          },
        },
      },
    },
    {
      id: "personalDiscussion",
      label: "Personal Discussion Details",
      schema: {
        type: "object",
        properties: {
          strengths: {
            type: "string",
            title: "Strengths",
          },
          otherObservation: {
            type: "string",
            title: "Other observation",
          },
          overallOutcome: {
            type: "string",
            title: "Overall outcome of the personal discussion",
          },
          remarks: {
            type: "string",
            title: "Remarks",
          },
          pdConductedBy: {
            type: "string",
            title: "PD Conducted by",
          },
          signature: {
            type: "string",
            title: "Signature",
          },
          pdDate: {
            type: "string",
            title: "Date",
          },
          detailsMatch: {
            type: "string",
            title:
              "Whether details provided in the application and during discussion are same (Yes/No)",
          },
          detailsMismatchNotes: {
            type: "string",
            title: "If No, provide details",
          },
        },
      },
    },
  ],
} as const;

export default idfcHlMlSchema;
