import financialsSchema from "../financials-schema/generic";
export const iiflSchema = {
  id: 19,
  bankName: "IIFL",
  sections: [
    {
      id: "basicDetails",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          prospectNo: { type: "string", title: "Prospect No.", readOnly: true },
          nameOfApplicant: {
            type: "string",
            title: "Name",
            readOnly: true,
          },
          maritalStatus: {
            type: "string",
            title: "Marital Status",
            enum: ["Single", "Married", "Divorced", "Others"],
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
          category: {
            type: "string",
            title: "Category",
            enum: ["General", "SC", "ST", "OBC", "Others"],
          },
          dependentsChildren: {
            type: "number",
            title: "Number of Dependents - Children",
          },
          dependentsAdults: {
            type: "number",
            title: "Number of Dependents - Adults",
          },
          dependentsOthers: {
            type: "string",
            title: "Number of Dependents - Others",
          },
          yearsInCurrentResidence: {
            type: "string",
            title: "No. of Years in Current Residence",
            enum: ["<=1 Year", "1-3 Years", "3-5 Years", ">5 Years"],
          },
          currentResidenceHouseSize: {
            type: "string",
            title: "Current Residence House Size",
            enum: ["1 RK", "1 BHK", "2 BHK", ">2 BHK"],
          },
          previousAddress: {
            type: "string",
            title: "If <= Year, then Previous Address",
            dependencies: {
              show: {
                yearsInCurrentResidence: "<=1 Year",
              },
              required:{
                yearsInCurrentResidence: "<=1 Year",
              }
            },
          },
          yearsStayedPreviousAddress: {
            type: "string",
            title: "Number of Years Stayed at Previous Address",
            dependencies: {
              show: {
                yearsInCurrentResidence: "<=1 Year",
              },
              required:{
                yearsInCurrentResidence: "<=1 Year",
              }
            },
          },
          yearsInCurrentCity: {
            type: "string",
            title: "Number of Years in Current City",
            enum: ["<=3 Years", ">3 Years"],
          },
          previousCity: {
            type: "string",
            title: "Previous City (if ≤ 3 years in current city)",
            dependencies: {
              show: {
                yearsInCurrentCity: "<=3 Years",
              },
              required:{
                yearsInCurrentCity: "<=3 Years",
              }
            },
          },
          yearsInPreviousCity: {
            type: "string",
            title: "Number of Years in Previous City (if ≤ 3 years in current city)",
            dependencies: {
              show: {
                yearsInCurrentCity: "<=3 Years",
              },
              required:{
                yearsInCurrentCity: "<=3 Years",
              }
            },
          },
          reasonForChange: {
            type: "string",
            title: "Reason for Change (if ≤ 3 years in current city)",
            dependencies: {
              show: {
                yearsInCurrentCity: "<=3 Years",
              },
              required:{
                yearsInCurrentCity: "<=3 Years",
              }
            },
          },
          parentsStayingWith: {
            type: "string",
            title: "Parents Staying With?",
            enum: ["Self", "Separate", "Expired"],
          },
          propertyUsage: {
            type: "string",
            title: "Usage of Property after Purchase",
            enum: ["Self-Occupancy", "Investment", "Renting", "Others"],
          },
        },
      },
    },
    {
      id: "briefCommentsObservation",
      label: "Brief Comments/Observation of the case",
      schema: {
        type: "object",
        properties: {
          dateOfCaseInitiated: {
            type: "string",
            title: "Date of Case Initiated",
            format: "date",
          },
          dateOfAppointmentProvided: {
            type: "string",
            title: "Date of Appointment Provided",
            format: "date",
          },
          initiatedAddress: {
            type: "string",
            title: "Initiated Address",
            ui: { widget: "textarea", rows: 2 },
            readOnly: true,
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
            ui: { widget: "textarea", rows: 2 },
          },
          residentialAddress: {
            type: "string",
            title: "Residential Address",
            ui: { widget: "textarea", rows: 2 },
          },
          contactInformation: {
            type: "string",
            title: "Contact Information",
          },
          loanAmountRequired: {
            type: "string",
            title: "Loan Amount Required",
            readOnly: true,
          },
          purposeOfLoan: {
            type: "string",
            title: "Purpose of Loan",
            readOnly: true,
          },
          profileInitiated: {
            type: "string",
            title: "Profile Initiated",
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
          familyMembers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                relationship: { type: "string", title: "Relationship" },
                age: { type: "integer", title: "Age" },
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
                occupation: { type: "string", title: "Occupation" },
              },
            },
          },
        },
      },
    },
    {
      id: "applicantProfile",
      label: "Applicant Profile",
      schema: {
        type: "object",
        properties: {
          applicantProfile: {
            type: "string",
            title: "Applicant Profile",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "observations",
      label: "Observations & Concerns",
      schema: {
        type: "object",
        properties: {
          concerns: {
            type: "string",
            title: "Concerns",
            ui: { widget: "textarea", rows: 3 },
          },
          otherObservations: {
            type: "string",
            title: "Other Observations (Business Activity, Stock, Machines)",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "incomeDetails",
      label: "Income Details",
      schema: {
        type: "object",
        properties: {
          income: {
            type: "object",
            title: "Income",
            properties: {
              grossReceipts: { type: "number", title: "Gross Receipts", formatter: { useIndianFormat: true, locale: "en-IN", maxDecimalPlaces: 2 } },
              otherIncomes: { type: "number", title: "Other Incomes", formatter: { useIndianFormat: true, locale: "en-IN", maxDecimalPlaces: 2 } },
            },
          },
          expenses: {
            type: "object",
            title: "Expenses",
            properties: {
              purchases: { type: "number", title: "Purchases", formatter: { useIndianFormat: true, locale: "en-IN", maxDecimalPlaces: 2 } },
              salaries: { type: "number", title: "Salaries", formatter: { useIndianFormat: true, locale: "en-IN", maxDecimalPlaces: 2 } },
              electricity: { type: "number", title: "Electricity", formatter: { useIndianFormat: true, locale: "en-IN", maxDecimalPlaces: 2 } },
              otherExpenses: { type: "number", title: "Other Expenses", formatter: { useIndianFormat: true, locale: "en-IN", maxDecimalPlaces: 2 } },
            },
          },
        },
      },
    },
    {
      id: "otherIncome",
      label: "Other Income",
      schema: {
        type: "object",
        properties: {
          otherIncome: { type: "string", title: "Other Income", ui: { widget: "textarea", rows: 3 } },
        },
      },
    },
    {
      id: "references",
      label: "References",
      schema: {
        type: "object",
        properties: {
          references: { type: "string", title: "References", ui: { widget: "textarea", rows: 3 } },
        },
      },
    },
    {
      id: "finalPdStatus",
      label: "Final PD status",
      schema: {
        type: "object",
        properties: {
          finalPdStatus: { type: "string", title: "Status of the case", enum: ["Positive", "Negative","Credit Refer"] },
        },
      },
    },
    {
      id: "dateOfDiscussion",
      label: "Date of Discussion",
      schema: {
        type: "object",
        properties: {
          dateOfDiscussion: { type: "string", title: "Date of Discussion", format: "date" },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default iiflSchema;
