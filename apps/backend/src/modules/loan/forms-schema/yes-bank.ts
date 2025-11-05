import financialsSchema from "../financials-schema/generic";
export const yesBankSchema = {
  id: 26,
  bankName: "Yes Bank",
  sections: [
    {
      id: "generalInfo",
      label: "General Information",
      schema: {
        type: "object",
        properties: {
          mainApplicantName: {
            type: "string",
            title: "Name of the Main applicant",
          },
          relationWithApplicant: {
            type: "string",
            title: "PD done with and relation with applicant",
          },
          addressVisited: {
            type: "string",
            title: "Address of the visit with landmark",
            ui: { widget: "textarea", rows: 2 },
          },
          casId: {
            type: "string",
            title: "CAS ID",
          },
          product: {
            type: "string",
            title: "Product (AFHL/MLAP)",
          },
          pdVisitDate: {
            type: "string",
            title: "PD visit date",
          },
          pdVisitTime: {
            type: "string",
            title: "PD visit time",
          },
          contactNumber: {
            type: "string",
            title: "Contact number",
          },
          loanAppliedAmount: {
            type: "number",
            title: "Loan applied amount",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          tenorRequired: {
            type: "string",
            title: "Tenor required",
          },
          addressVisitedType: {
            type: "string",
            title: "Address visited type",
            enum: ["Residence", "Business", "Employment place", "Other"],
          },
        },
      },
      required: true,
    },
    {
      id: "basicApplicantDetails",
      label: "Basic Details of Applicant",
      schema: {
        type: "object",
        properties: {
          applicantBackground: {
            type: "string",
            title: "Applicant – Business / Educational background / Past experience",
            ui: { widget: "textarea", rows: 3 },
          },
          coApplicantBackground: {
            type: "string",
            title: "Co-Applicant – Business / Employment / Educational background / Past experience",
            ui: { widget: "textarea", rows: 3 },
          },
          parentsBackground: {
            type: "string",
            title: "Parents Occupation / Business / Employment background",
          },
          childrenDetails: {
            type: "string",
            title: "Details of children (studying / working)",
          },
          siblingsBackground: {
            type: "string",
            title: "Siblings Business / Employment background (if residing together)",
          },
        },
      },
    },
    {
      id: "businessProfile",
      label: "Self Employed Profile – Occupational Details",
      schema: {
        type: "object",
        properties: {
          businessName: {
            type: "string",
            title: "Name of the Business / Employment",
          },
          businessConstitution: {
            type: "string",
            title: "Constitution of Business Entity",
          },
          proprietorShareDetails: {
            type: "string",
            title: "Name of Proprietor / Partners / Shareholders with % share",
          },
          yearsInBusiness: {
            type: "string",
            title: "No. of Years in Current Business",
          },
          businessNarrative: {
            type: "string",
            title: "Business profile (nature of industry, market, competition, seasonality etc.)",
            ui: { widget: "textarea", rows: 5 },
          },
          gstRegistration: {
            type: "string",
            title: "GST Registration details",
          },
          proofOfBusinessStability: {
            type: "string",
            title: "Proof of business existence / stability verified",
          },
          averageMonthlySales: {
            type: "number",
            title: "Average Monthly Sales / Receipts",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          averageMonthlyPurchase: {
            type: "number",
            title: "Average Monthly Purchase",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          grossMargin: {
            type: "string",
            title: "Gross margin on goods sold",
          },
          indirectExpenses: {
            type: "string",
            title: "Overheads / Indirect expenses",
          },
          netMonthlyProfit: {
            type: "string",
            title: "Net monthly profit from business",
          },
          stockLevel: {
            type: "string",
            title: "Stock level",
          },
          majorCustomers: {
            type: "string",
            title: "Description about major customers with credit terms",
            ui: { widget: "textarea", rows: 3 },
          },
          majorSuppliers: {
            type: "string",
            title: "Description about major suppliers with credit terms",
            ui: { widget: "textarea", rows: 3 },
          },
          businessSetupDetails: {
            type: "string",
            title: "Business setup details",
            ui: { widget: "textarea", rows: 3 },
          },
          infrastructureManpower: {
            type: "string",
            title: "Infrastructure and manpower details",
            ui: { widget: "textarea", rows: 3 },
          },
          otherAssetsInvestments: {
            type: "string",
            title: "Other owned assets / Investments (property, land, FD, MF etc.)",
          },
          otherIncomeSources: {
            type: "string",
            title: "Other sources of income (rental, agri, interest etc.)",
          },
          householdExpenses: {
            type: "string",
            title: "Monthly total household expenses",
          },
          collateralDetails: {
            type: "string",
            title: "Collateral details (Type, occupancy status, year of purchase, parental owned etc.)",
          },
          mlapEndUse: {
            type: "string",
            title: "MLAP End use / consolidation details",
          },
        },
      },
    },
    {
      id: "addressDetails",
      label: "Residence and Business Address Details",
      schema: {
        type: "object",
        properties: {
          residencePremiseAddress: {
            type: "string",
            title: "Residence premise address",
            ui: { widget: "textarea", rows: 2 },
          },
          residenceOwnershipStatus: {
            type: "string",
            title: "Residence ownership status",
          },
          residenceDuration: {
            type: "string",
            title: "Residence owned / rented since when",
          },
          residenceProof: {
            type: "string",
            title: "Residential proof of ownership",
          },
          residenceRent: {
            type: "string",
            title: "Residence rent per month (if rented)",
          },
          residenceLocality: {
            type: "string",
            title: "Residence locality comment",
          },
          residenceMortgage: {
            type: "string",
            title: "Residence mortgage status",
          },
          residenceQrCheck: {
            type: "string",
            title: "Residence QR code check status",
          },
          residenceVisitComment: {
            type: "string",
            title: "Residence visit comments / photos reference",
          },
          businessPremiseAddress: {
            type: "string",
            title: "Business premise address",
            ui: { widget: "textarea", rows: 2 },
          },
          businessOwnershipStatus: {
            type: "string",
            title: "Business ownership status",
          },
          businessDuration: {
            type: "string",
            title: "Business owned / rented since when",
          },
          businessProof: {
            type: "string",
            title: "Business proof of ownership",
          },
          businessRent: {
            type: "string",
            title: "Business rent per month (if rented)",
          },
          businessLocality: {
            type: "string",
            title: "Business locality comment",
          },
          businessMortgage: {
            type: "string",
            title: "Business mortgage status",
          },
          businessQrCheck: {
            type: "string",
            title: "Business QR code check status",
          },
          businessVisitComment: {
            type: "string",
            title: "Business visit comments / photos reference",
          },
          earlierPremiseDetails: {
            type: "string",
            title: "Earlier premises details (if stability < 3 years)",
          },
        },
      },
    },
    {
      id: "businessReferences",
      label: "Business Reference Checks",
      schema: {
        type: "object",
        properties: {
          references: {
            type: "array",
            items: {
              type: "object",
              properties: {
                referenceType: { type: "string", title: "Reference type" },
                businessName: {
                  type: "string",
                  title: "Shop / Business name",
                },
                contactPerson: {
                  type: "string",
                  title: "Person spoken to",
                },
                feedback: {
                  type: "string",
                  title:
                    "Feedback on stability, vintage, volume, payment regularity",
                  ui: { widget: "textarea", rows: 2 },
                },
                otherFeedback: {
                  type: "string",
                  title: "Other feedback",
                },
                status: {
                  type: "string",
                  title: "Ref check status",
                  enum: ["Positive", "Negative", "Neutral"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "residenceReferences",
      label: "Residence Reference Checks",
      schema: {
        type: "object",
        properties: {
          references: {
            type: "array",
            items: {
              type: "object",
              properties: {
                referenceType: {
                  type: "string",
                  title: "Reference type",
                },
                personMet: {
                  type: "string",
                  title: "Person / Shop name",
                },
                feedback: {
                  type: "string",
                  title:
                    "Feedback on behaviour, negative activity, residence vintage etc.",
                  ui: { widget: "textarea", rows: 2 },
                },
                otherFeedback: {
                  type: "string",
                  title: "Other feedback",
                },
                status: {
                  type: "string",
                  title: "Ref check status",
                  enum: ["Positive", "Negative", "Neutral"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "finalComment",
      label: "Final PD Comment",
      schema: {
        type: "object",
        properties: {
          interviewerComment: {
            type: "string",
            title: "Interviewer’s overall comments",
            ui: { widget: "textarea", rows: 4 },
          },
          activityAndStocks: {
            type: "string",
            title: "Level of activity & stocks observed / other observations",
          },
          pdStatus: {
            type: "string",
            title: "PD Status",
            enum: ["Positive", "Negative", "Referred"],
          },
          remarks: {
            type: "string",
            title: "Remarks for Positive / Negative / Referred cases",
          },
          yblEmployeeName: {
            type: "string",
            title: "Name of the YBL employee",
          },
          yblDesignation: { type: "string", title: "Designation" },
          yblEmpId: { type: "string", title: "Employee ID" },
          yblSignature: { type: "string", title: "Signature" },
          pdAgencyInterviewer: {
            type: "string",
            title: "PD agency interviewer’s name",
          },
          reportProcessedBy: {
            type: "string",
            title: "Report processed by",
          },
        },
      },
    },
    {
      id: "annexureAfhl",
      label: "Annexure 1 – AFHL Cases",
      schema: {
        type: "object",
        properties: {
          propertyIdentifiedThrough: {
            type: "string",
            title: "Source from which property was identified",
          },
          builderDetails: {
            type: "string",
            title: "Builder / Project / Representative details",
          },
          transactionType: {
            type: "string",
            title: "Type of transaction",
          },
          propertyType: {
            type: "string",
            title: "Type of property",
          },
          propertyDetails: {
            type: "string",
            title: "Property details (Address, flat no., size, stage etc.)",
            ui: { widget: "textarea", rows: 3 },
          },
          totalPropertyCost: {
            type: "number",
            title: "Total cost of the property",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          ocrSource: {
            type: "string",
            title: "Source details of OCR",
          },
          downPaymentDone: {
            type: "string",
            title: "Down payment details (if already done)",
          },
          downPaymentAmount: {
            type: "number",
            title: "Amount of down payment",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          downPaymentSource: {
            type: "string",
            title: "Source of funds for down payment",
          },
          purposeOfPurchase: {
            type: "string",
            title: "Purpose of purchase (Self occupation / Investment)",
          },
          distanceFromWork: {
            type: "string",
            title: "Distance from current business / residence",
          },
          commutePlan: {
            type: "string",
            title: "Commute plan / reason for buying far property",
          },
        },
      },
    },
    {
      id: "annexureSalaried",
      label: "Annexure 2 – Salaried Profile",
      schema: {
        type: "object",
        properties: {
          companyName: { type: "string", title: "Name of the Company" },
          companyConstitution: {
            type: "string",
            title: "Constitution of the Company",
          },
          hrAndReportingContact: {
            type: "string",
            title: "Name & email ID of HR and reporting authority",
          },
          employerContact: {
            type: "string",
            title: "Employer representative (name, designation, contact)",
          },
          employerDetails: {
            type: "string",
            title: "Employer details (years in business, employees, industry)",
            ui: { widget: "textarea", rows: 3 },
          },
          employmentStatus: {
            type: "string",
            title: "Employment status (Regular / Contract)",
          },
          currentDesignation: {
            type: "string",
            title: "Current designation & department",
          },
          employeeId: { type: "string", title: "Employee ID" },
          salaryMode: {
            type: "string",
            title: "Salary mode & salary account details",
          },
          grossMonthlySalary: {
            type: "number",
            title: "Gross monthly salary",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          netMonthlySalary: {
            type: "number",
            title: "Net monthly salary",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
            },
          },
          employerLoanDetails: {
            type: "string",
            title: "Loans from employer (if any)",
          },
          employmentTerms: {
            type: "string",
            title: "Terms of employment",
          },
          currentEmployerVintage: {
            type: "string",
            title: "Vintage with current employer",
          },
          previousExperienceDetails: {
            type: "string",
            title: "Previous work experience details",
            ui: { widget: "textarea", rows: 2 },
          },
          previousExperienceYears: {
            type: "string",
            title: "Years worked in previous job",
          },
          otherIncome: {
            type: "string",
            title: "Any other source of income",
          },
          residenceStatus: {
            type: "string",
            title: "Existing residence status",
          },
          rentExpenses: {
            type: "string",
            title: "Rental expenses per month",
          },
          familyExpenses: {
            type: "string",
            title: "Other general family expenses per month",
          },
          employmentTPC: {
            type: "string",
            title: "Third party check for employment",
          },
          employmentDocuments: {
            type: "array",
            title: "Documentary evidence seen for employment",
            items: { type: "string", title: "Document" },
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default yesBankSchema;
