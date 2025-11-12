import financialsSchema from "../financials-schema/generic";
export const herohousingSalariedSchema = {
  id: 14,
  bankName: "HeroHousing-Salaried",
  sections: [
    {
      id: "generalInfo",
      label: "General Loan & Visit Details",
      schema: {
        type: "object",
        properties: {
          loanAccountNo: {
            type: "string",
            title: "Loan account No.",
          },
          nameOfCustomer: {
            type: "string",
            title: "Name of customer",
          },
          personMet: {
            type: "string",
            title: "Person met in PD & relationship with customer",
          },
          reasonIfCustomerNotAvailable: {
            type: "string",
            title: "Reason if customer not available during visit",
          },
          pdVisitDateAndTimepd: {
            type: "string",
            title: "PD visit date and time",
            format: "datetime",
          },
          pdAddress: {
            type: "string",
            title: "PD address",
            ui: { widget: "textarea", rows: 2 },
          },
          latLongOfOfficeAddress: {
            type: "string",
            title: "Latitude & Longitude of office address",
          },
          requestedLoanAmount: {
            type: "number",
            title: "Requested loan amount",
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
      id: "borrowerProfile",
      label: "Profile of Customer",
      schema: {
        type: "object",
        properties: {
          qualificationOfCustomer: {
            type: "string",
            title: "Qualification of customer",
          },
          professionalJourney: {
            type: "string",
            title: "Complete professional journey (service/ business details of each activity post qualification to till date)",
            ui: { widget: "textarea", rows: 3 },
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
          members: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                relationship: {
                  type: "string",
                  title: "Relationship with applicant",
                },
                age: { type: "integer", title: "Age" },
                qualification: { type: "string", title: "Qualification" },
                occupation: { type: "string", title: "Occupation (job/business)" },
                incomeDetails: {
                  type: "string",
                  title: "Income details / dependent",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "employmentProfile",
      label: "Current Job Profile",
      schema: {
        type: "object",
        properties: {
          nameOfEmployer: { type: "string", title: "Name of Employer" },
          workingSince: { type: "string", title: "Working since" },
          typeOfEmployment: {
            type: "string",
            title: "Type of employment",
            enum: ["Permanent", "Contractual"],
          },
          designation: { type: "string", title: "Designation" },
          jobProfile: {
            type: "string",
            title: "Job profile",
            ui: { widget: "textarea", rows: 2 },
          },
          reportingTo: {
            type: "string",
            title: "Reporting to (Name/Designation)",
          },
        },
      },
    },
    {
      id: "employerDetails",
      label: "Details of Employer",
      schema: {
        type: "object",
        properties: {
          businessName: { type: "string", title: "Current business name" },
          constitution: { type: "string", title: "Constitution" },
          natureOfBusiness: {
            type: "string",
            title: "Nature of business / services",
            ui: { widget: "textarea", rows: 2 },
          },
          runningSince: { type: "string", title: "Running since" },
          partnersDetails: {
            type: "string",
            title: "Details of partners, director, shareholders with family background and other details (For each partner if constitution is other than proprietorship firm)",
          },
          setupDetails: {
            type: "string",
            title: "No. of employee and set up of business",
          },
          stockQuantum: { type: "string", title: "Quantum of stock" },
          machineryAssets: {
            type: "string",
            title: "No. of machinery and assets seen",
          },
          localityFeedback: {
            type: "string",
            title:
              "Brief details about the locality of business, surrounding competitors, overall prospect of location etc and any negative feedback",
            ui: { widget: "textarea", rows: 2 },
          },
        },
      },
    },
    {
      id: "propertyDetails",
      label: "Details of property",
      schema: {
        type: "object",
        properties: {
          customerVisitedProperty: {
            type: "string",
            title: "Whether customer visited the property",
            ui: { widget: "textarea", rows: 2 },
          },
          propertyType: {
            type: "string",
            title: "Type of property (Ready build/Plot/Self Construction/under construction/vacant etc)",
            enum: [
              "Ready",
              "Plot",
              "Self Construction",
              "Under Construction",
              "Vacant",
            ],
          },
          propertyOccupancy: {
            type: "string",
            title: "Property is occupied by whom and reason if not self-occupied (Also mention stage in case self-construction/under construction and expected completion date, also mention rent amount and period of tenancy if the property is given on rent)",
          },
        sourceOfPropertyPurchase: {
            type: "string",
            title: "Source of property purchase (through dealer, builder/reference/relative)",
            enum: [
              "Dealer",
              "Builder",
              "Reference",
              "Relative",
            ],
          },
          sellerDetails: {
            type: "string",
            title: "Name of seller",
          },
          relationshipWithCustomer: {
            type: "string",
            title: "Relationship with customer",
          },
          typeOfProperty: {
            type: "string",
            title: "Type of property/structure",
          },
          areaOfProperty: {
            type: "string",
            title: "Area of property",
          },
          dealValue: {
            type: "string",
            title: "Actual deal value",
          },
          saleDeedValue: {
            type: "string",
            title: "Sale deed value",
          },
          ocrSource: {
            type: "string",
            title: "OCR source",
          },
          whenSellerBoughtTheProperty: {
            type: "string",
            title: "When seller bought the property",
          },
          
        },
      },
      },

    {
      id: "investmentAndProperties",
      label: "Investments and Properties",
      schema: {
        type: "object",
        properties: {
          investmentHabits: {
            type: "string",
            title: "What is customer investment habits and he is doing any monthly saving in any of saving scheme, investment in properties, FD or any other nature of saving",
            ui: { widget: "textarea", rows: 3 },
          },
          currentResidenceOwnership: {
            type: "string",
            title: "Whether current residence is owned or rented and rent amount if any",
            ui: { widget: "textarea", rows: 2 },
          },
          rentedAmountIfAny: {
            type: "number",
            title: "Rented amount if any",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          detailsOfAssetsBuiltTillDate: {
            type: "string",
            title: "Details of assets built till date (Including immovable properties, movable property, gold, FD, Equity investment, other savings)",
          },
        },
      },
    },

    {
      id: "endUseOfPropertyFund",
      label: "End use of property/fund",
      schema: {
        type: "object",
        properties: {
          proposedEndUseOfProperty: {
            type: "string",
            title: "Proposed end use of property (self-occupation/investment etc) for HL/P+C/Self construction cases",
          },
          detailedEndUseOfFundInLapCases: {
            type: "string",
            title: "Clear and detailed end use of fund in LAP cases",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },

    {
      id: "detailsOfLoans",
      label: "Details of loans",
      schema: {
        type: "object",
        properties: {
          detailsOfLoansPresentlyServicing: {
            type: "string",
            title: "Please check and provide the details of loan presently servicing and whether he will be closing such loans or going to continue, repayment account from which all these EMI are getting paid",
          },
          repaymentAccount: {
            type: "string",
            title: "Repayment account from which all these EMI are getting paid",
          },
          pastLoanEndUse: {
            type: "string",
            title: "What was the end use of fund of these loans (All BL/PL/LAP loan taken in last 3 years), also please check if there is any exceptional borrowing in last 12 months than exact use and impact on the business revenue",
          },
          checkIfAnyHomeLoanLap: {
            type: "string",
            title: "Also check if any home loan/LAP than what is address of mortgage property, usage of such property, any CC/OD limit or any other facility in the name of customer",
          },
          anyBouncingInLoans: {
            type: "string",
            title: "Comment whether there is any bouncing in loans and if yes, period and reason of such bounces",
          },
          loanNotes: {
            type: "string",
            title: "Loan notes",
            ui: { widget: "textarea", rows: 3 },
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
        bankAccounts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              bankDetails: { type: "string", title: "Bank details" },
              accountOpenDate: { type: "string", title: "Account open date", format: "date" },
              nameOfBankAccount: { type: "string", title: "Name of bank account in where salary is credited (if bank salary)" },
            },
          },
        },
        savingAccounts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              savingsAccountDetails: { type: "string", title: "Please check any saving account of applicant and co applicant and provide the details of these accounts" },
            },
          },
        },
      },
    },
  },
    
    {
      id: "documentVerificationAndOtherChecks",
      label: "Document verification and other checks",
      schema: {
        type: "object",
        properties: {
          checkPayrollRegisterAndAttendanceRegister: {
            type: "string",
            title: "Please check all Payroll register, attendance register to check employment and salary details of applicant and share observations",
          },
          thirdPartyCheck: {
            type: "string",
            title: "TPC from minimum 1 neighbour and 1 local independent party to be done (It should be done by showing the photo of customer and employment to be confirmed in the name of customer with existence period",
            ui: { widget: "textarea", rows: 2 },
          },
          familyRelationshipCheckWithEmployer: {
            type: "string",
            title: "Additional check to be done from reference if there is any family relationship with employer and employee",
          },
          checkQrCodesLicensesPermitsNameBoardContactNumberBelongingToEmployer: {
            type: "string",
            title: "Please check all QR code, license, permits, name board, contact number etc and all these belongs to employer and share observations",
          },
          googleCheckAnyNegativeObservationsFeedbackDedupeMatch: {
            type: "string",
            title: "Google check and any negative observation/feedback/dedupe match or any other feedback",
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default herohousingSalariedSchema;
