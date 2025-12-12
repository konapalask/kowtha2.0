import financialsSchema from "../financials-schema/generic";
export const idfcHlMlSchema = {
  id: 17,
  bankName: "IDFC HL & ML",
  sections: [
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
          nameOfCoApplicants: {
            type: "string",
            title: "Name of the Co-Applicant/s",
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
          nameBoardSeen: {
            type: "string",
            title: "Whether Name Board Seen",
            enum: ["Yes", "No"],
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
            readOnly: true,
          },
          applicantPhoneNumber: {
            type: "integer",
            title: "Phone No. of the Applicant",
            readOnly: true,
          },
          panNumber: {
            type: "string",
            title: "PAN No.",
            pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            description: "PAN format: ABCDE1234F",
          },
          educationalQualification: {
            type: "string",
            title: "Educational Qualification",
            enum: [
              "Below 10th",
              "10th pass",
              "12th pass",
              "Diploma/ITI certification",
              "Graduate",
              "PG/Professional Certification",
            ],
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
                  type: "integer",
                  title: "Age",
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
              },
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
          businessName: {
            type: "string",
            title: "Name of the Entity / Employer Name",
            readOnly: true,
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
            title:
              "Business actively managed by (Self/Others; If others, name & relationship)",
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
          netProfitLastTwoYearsEstimated: {
            type: "string",
            title: "Net profit for last 2 years (estimation)",
          },
          grossBusinessMarginPercent: {
            type: "string",
            title: "Gross business margin %",
          },
          grossBusinessMarginPercentEstimated: {
            type: "string",
            title: "Gross business margin % (estimation)",
          },
          netBusinessMarginPercent: {
            type: "string",
            title: "Net business margin %",
          },
          netBusinessMarginPercentEstimated: {
            type: "string",
            title: "Net business margin % (estimation)",
          },
          yearsFilingItrs: {
            type: "string",
            title: "No. of years filing ITRs",
          },
          yearsFilingItrsEstimated: {
            type: "string",
            title: "No. of years filing ITRs (estimation)",
          },
          lastTwoYearsItrs: {
            type: "string",
            title: "Last 2 years ITRs",
          },
          lastTwoYearsItrsEstimated: {
            type: "string",
            title: "Last 2 years ITRs (estimation)",
          },
          lastTwoYearsForm16: {
            type: "string",
            title: "Last 2 years Form 16 (Salaried)",
          },
          lastTwoYearsForm16Estimated: {
            type: "string",
            title: "Last 2 years Form 16 (Salaried) (estimation)",
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
                  type: "number",
                  title: "Loan amount (Rs. lacs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
                },
                mob: {
                  type: "string",
                  title: "MOB",
                },
                outstanding: {
                  type: "number",
                  title: "Outstanding (Rs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                  },
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
                  title: "Rent agreement available",
                  enum: ["Yes", "No"],
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
            readOnly: true,
          },
          purposeOfLoan: {
            type: "string",
            title: "Purpose of loan",
            readOnly: true,
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
          pdDate: {
            type: "string",
            title: "Date",
            format: "date",
          },
        },
      },
    },
    {
      id: "detailsConfirmation",
      label: "Details Confirmation",
      schema: {
        type: "object",
        properties: {
          detailsCheckedSameOrNot: {
            type: "string",
            title:
              "The details provided in the application form and the details provided by the customer at the time of discussion are same",
            enum: ["Yes", "No"],
          },
          detailsNotSameReason: {
            type: "string",
            title: "If NO please provide the details",
            dependencies: {
              show: {
                detailsCheckedSameOrNot: "No",
              },
              required: {
                detailsCheckedSameOrNot: "No",
              },
            },
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default idfcHlMlSchema;
