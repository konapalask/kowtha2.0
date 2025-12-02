import financialsSchema from "../financials-schema/generic";
export const niwasSalariedSchema = {
  id: 23,
  bankName: "Niwas Salaried",
  sections: [
    {
      id: "generalInfo",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          prospectNo: { type: "string", title: "Prospect No.", readOnly: true },
          nameOfApplicant: {
            type: "string",
            title: "Name of Applicant",
            readOnly: true,
          },
          maritalStatus: {
            type: "string",
            title: "Marital Status",
            enum: ["Single", "Married", "Divorced", "Others"],
          },
          educationalQualification: {
            type: "string",
            title: "Educational Qualification ",
            enum: ["Below 10th", "10th", "12th", "Diploma", "Graduate", "PG"],
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
            type: "number",
            title: "Number of Dependents - Others",
          },
          yearsInCurrentResidence: {
            type: "string",
            title: "Years in Current Residence",
            enum: ["<1 Year", "1-3 Years", "3-5 Years", ">5 Years"],
          },
          houseSize: {
            type: "string",
            title: "Current residence house size",
            enum: ["1 BHK", "2 BHK", ">2 BHK"],
          },
          previousAddress: {
            type: "string",
            title: "Previous address (if < 1 year)",
          },
          yearsAtPreviousAddress: {
            type: "number",
            title: "Years stayed at previous address",
          },
          yearsInCurrentCity: {
            type: "number",
            title: "Years in current city",
          },
          previousCity: {
            type: "string",
            title: "Previous city (if ≤ 3 years)",
          },
          yearsInPreviousCity: {
            type: "number",
            title: "Years in previous city",
          },
          reasonForChange: {
            type: "string",
            title: "Reason for change",
          },
          parentsStayingWith: {
            type: "string",
            title: "Parents staying with (Self / Separate / Expired)",
            enum: ["Self", "Separate", "Expired"],
          },
          residingCity: {
            type: "string",
            title: "Residing City",
          },
          residingLocationOwnershipStatus: {
            type: "string",
            title: "Residing location ownership status",
            enum: ["self-Owned", "Parent-Owned", "Rented"],
          },
        },
      },
    },
    {
      id: "assetsInvestments",
      label: "Assets and Investments",
      schema: {
        type: "object",
        properties: {
          smartphone: {
            type: "string",
            title: "Smartphone",
            enum: ["Yes", "No"],
          },
          washingMachine: {
            type: "string",
            title: "Washing Machine",
            enum: ["Yes", "No"],
          },
          carRcNo: { type: "string", title: "Car RC No." },
          twoWheeler: {
            type: "string",
            title: "Two-Wheeler",
            enum: ["Yes", "No"],
          },
          autoCab: { type: "string", title: "Auto/Cab", enum: ["Yes", "No"] },
          computerLaptop: {
            type: "string",
            title: "Computer / Laptop",
            enum: ["Yes", "No"],
          },
          ac: { type: "string", title: "AC", enum: ["Yes", "No"] },
          fridge: { type: "string", title: "Fridge", enum: ["Yes", "No"] },
          induction: {
            type: "string",
            title: "Induction",
            enum: ["Yes", "No"],
          },
          investments: {
            type: "string",
            title: "Investments (property, amount etc.)",
            ui: { widget: "textarea", rows: 2 },
          },
          insurance: {
            type: "string",
            title: "Insurance (LIC)",
            enum: ["Yes", "No"],
          },
          fixedDeposit: { type: "string", title: "Fixed Deposit" },
          chitFunds: {
            type: "string",
            title: "Chit Funds",
            enum: ["Yes", "No"],
          },
          postOfficeSavings: {
            type: "string",
            title: "Post Office Savings",
            enum: ["Yes", "No"],
          },
          postOfficeSavingsMonthly: {
            type: "string",
            title: "Post Office savings monthly",
            enum: ["Yes", "No"],
          },
          recurringDeposit: {
            type: "string",
            title: "Recurring Deposit",
            enum: ["Yes", "No"],
          },
          consumptionHabits: {
            type: "string",
            title: "Consumption of Nicotine / Alcohol",
            enum: ["Yes", "No"],
          },
        },
      },
    },
    {
      id: "employmentDetails",
      label: "Employment Details",
      schema: {
        type: "object",
        properties: {
          employerName: {
            type: "string",
            title: "Name of Current Employer/Business Firm",
          },
          yearsInCurrentJob: {
            type: "number",
            title: "Years in Current Job / Date of Joining",
          },
          totalWorkExperience: {
            type: "number",
            title: "Total Work Experience (years)",
          },
          officialEmail: {
            type: "string",
            title: "Official / Business Email ID",
          },
          contactNumber: {
            type: "number",
            title: "Contact Number",
          },
          numberOfEmployeesInFirm: {
            type: "number",
            title: "Number of employees in firm",
          },
          finalProductServiceOffered: {
            type: "string",
            title: "Final product/service offered by company",
          },
          companyCompetitors: {
            type: "number",
            title: "Number of competitors in nearby market",
          },
          localityOfBusinessPremises: {
            type: "string",
            title: "Locality of business premises",
            enum: [
              "Residential",
              "Commercial",
              "Industrial",
              "Corporate Hub/Office Space",
              "Other",
            ],
          },
          employeeId: {
            type: "string",
            title: "Employee ID (Copy/Photograph Mandatory)",
          },
          designation: {
            type: "string",
            title: "Designation",
          },
        },
      },
    },
    {
      id: "companyEmployerInformation",
      label: "Company / Employer Information",
      schema: {
        type: "object",
        properties: {
          modeOfSalary: {
            type: "string",
            title: "Mode of Salary",
            enum: ["Cash", "Cheque", "Other"],
          },
          typeOfEmployer: {
            type: "string",
            title: "Type of Employer",
            enum: [
              "Govt/PSU",
              "Unlisted Pvt. Ltd",
              "MNC/Listed Pvt. Ltd",
              "Proprietorship/Partnership/NGO/Trust",
              "Others,Please Specify:-Civil & Electrical Contractor.",
            ],
          },
          typeOfIndustry: {
            type: "string",
            title: "Type of Industry",
            enum: [
              "Agriculture",
              "Construction",
              "Education",
              "FMCG",
              "Healthcare",
              "Manufacturing",
              "Services",
              "Travel & Tourism",
              "E-Commerce",
              "Other,Please Specify",
            ],
          },
          department: {
            type: "string",
            title: "Department",
            enum: [
              "Human Resources",
              "Accounts & Finance",
              "Marketing",
              "Sales",
              "IT",
              "Operations",
              "Transportation",
              "Cleaning/Support staff",
              "Other,Please Specify",
            ],
          },
          role: {
            type: "string",
            title: "Role",
            enum: [
              "Accountant",
              "Administration Executive",
              "Assistant",
              "Cab Driver/Auto Driver",
              "Class 4 Employees of Govt Sector",
              "Cooks",
              "Waiters",
              "Delivery Boy",
              "Employee of Security Agency",
              "Factory Manager",
              "Factory Worker",
              "Floor Manager/Manager in Store",
              "House - Keeping / support staff",
              "Job Worker on Project Basis",
              "Nurses/Ward boy in medical institution",
              "Sales Executive",
              "Supervisor",
              "Teacher",
              "Tele-caller/Back Office Executive",
              "Others, Please Specify",
            ],
          },
        },
      },
    },
    {
      id: "pastEmploymentBusinessDetails",
      label: "Past Employment/Business Details",
      schema: {
        type: "object",
        properties: {
          pastEmployments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                emplyerorBusinessName: {
                  type: "string",
                  title: " Employer/Business Name",
                },
                designation: {
                  type: "string",
                  title: "Designation",
                },
                fromDate: {
                  type: "date",
                  title: "From Date",
                },
                toDate: {
                  type: "date",
                  title: "To Date",
                },
                contactPersonName: {
                  type: "string",
                  title: "Contact Person Name",
                },
                contactPersonNumber: {
                  type: "number",
                  title: "Contact Person Number",
                },
                reasonForMovement: {
                  type: "string",
                  title: "Reason for Movement",
                },
              },
            },
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
          monthlySalaryIncome: {
            type: "object",
            title: "Monthly Salary Income",
            properties: {
              cashAmount: {
                type: "number",
                title: "Cash Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              chequeAmount: {
                type: "number",
                title: "Cheque Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
            },
          },
          otherMonthlyIncome: {
            type: "number",
            title: "Other Monthly Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          rentalIncome: {
            type: "object",
            title: "Rental Income (In Rs)",
            properties: {
              cashAmount: {
                type: "number",
                title: "Cash Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              chequeAmount: {
                type: "number",
                title: "Cheque Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
            },
          },
          incentives: {
            type: "object",
            title: "Incentives/Perks (In Rs)",
            properties: {
              cashAmount: {
                type: "number",
                title: "Cash Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              chequeAmount: {
                type: "number",
                title: "Cheque Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
            },
          },
          monthlyBonus: {
            type: "object",
            title: "Monthly Bonus (In Rs)",
            properties: {
              cashAmount: {
                type: "number",
                title: "Cash Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              chequeAmount: {
                type: "number",
                title: "Cheque Amount",
                format: "currency",
              },
            },
          },
          otherMonthlyIncomeSourceType: {
            type: "string",
            title: "Others, please specify source type",
          },
          monthlyIncome: {
            type: "object",
            title: "Monthly Income (In Rs)",
            properties: {
              cashAmount: {
                type: "number",
                title: "Cash Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              chequeAmount: {
                type: "number",
                title: "Cheque Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
            },
          },
        },
      },
    },
    {
      id: "existingLoans",
      label: "Existing or Past Loan Details",
      schema: {
        type: "object",
        properties: {
          existingLoans: {
            type: "array",
            items: {
              type: "object",
              properties: {
                typeOfLoan: { type: "string", title: "Type of Loan" },
                bankName: { type: "string", title: "Bank Name" },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount (in Rs.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                emi: {
                  type: "number",
                  title: "EMI",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                tenureRemaining: { type: "string", title: "Tenure remaining" },
              },
            },
          },
        },
      },
    },
    {
      id: "loanPurpose",
      label: "Loan Details",
      schema: {
        type: "object",
        properties: {
          purposeOfLoan: {
            type: "string",
            title: "Purpose of loan",
            enum: [
              "Flat Purchase",
              "House Purchase",
              "Plot Purchase",
              "Plot + Construction",
              "Improvement/Extension",
              "Balance Transfer",
              "Hand Loan Clearance",
              "Construction",
              "Personal Needs",
            ],
          },
          minimumLoanAmountRequired: {
            type: "number",
            title: "Minimum loan amount required",
            format: "currency",
          },
          tenureRequired: {
            type: "number",
            title: "Tenure required",
            format: "currency",
          },
          monthlyHouseholdExpenses: {
            type: "number",
            title: "Monthly household expenses",
            format: "currency",
          },
          comfortableEmi: {
            type: "number",
            title: "Comfortable EMI",
            format: "currency",
          },
          statusOfProperty: {
            type: "string",
            title: "Status of property to be purchased",
            enum: ["Ready", "Under Construction", "Construction Yet to Start"],
          },
          usageOfProperty: {
            type: "string",
            title: "Usage of property after purchase",
            enum: ["Self-Occupancy", "Investment", "Others"],
          },
        },
      },
    },
    {
      id: "costAndFunds",
      label: "Cost and Funds",
      schema: {
        type: "object",
        properties: {
          fundsRequired: {
            type: "number",
            title: "Funds required",
            format: "currency",
          },
          sourceOfOwnFunds: {
            type: "string",
            title: "Source of own funds (OCR)",
          },
          purchaseCost: {
            type: "number",
            title: "Purchase cost",
            format: "currency",
          },
          savings: { type: "number", title: "Savings", format: "currency" },
          constructionEstimate: {
            type: "number",
            title: "Construction estimate",
            format: "currency",
          },
          familyFriends: {
            type: "string",
            title: "Family/Friends",
          },
          registrationCharges: {
            type: "number",
            title: "Registration / stamp duty charges",
            format: "currency",
          },
          otherLoanAmountTaken: {
            type: "number",
            title: "Other loan amount taken",
            format: "currency",
          },
          otherExpenses: {
            type: "number",
            title: "Other expenses",
            format: "currency",
          },
          totalAmountSpent: {
            type: "number",
            title: "Total amount spent (Total of all the above)",
            format: "currency",
          },
          totalTransactionCost: {
            type: "number",
            title: "Total transaction cost (Total of all the above)",
            format: "currency",
          },
          modeOfPaymentToSeller: {
            type: "object",
            title: "Mode of payment to seller (Cash / Cheque)",
            properties: {
              cashAmount: {
                type: "number",
                title: "Cash Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
              chequeAmount: {
                type: "number",
                title: "Cheque Amount",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
            },
          },
        },
      },
    },
    {
      id: "familyMembers",
      label: "Other Family Member Details",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                relation: { type: "string", title: "Relation" },
                age: { type: "integer", title: "Age" },
                employmentType: {
                  type: "string",
                  title: "Employment Type",
                },
                education: {
                  type: "string",
                  title: "Educational Qualification",
                },
                contactNumber: { type: "number", title: "Contact No." },
                stayingWithApplicant: {
                  type: "string",
                  title: "Staying with Applicant",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "references",
      label: "Reference Details",
      schema: {
        type: "object",
        properties: {
          references: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                address: { type: "string", title: "Address" },
                designation: { type: "string", title: "Designation" },
                yearsKnown: {
                  type: "string",
                  title: "No. of Years known the applicant",
                },
                contactNumber: { type: "number", title: "Contact Number" },
                email: { type: "string", title: "Email Address" },
                photoWithApplicant: {
                  type: "string",
                  title: "Photo with Applicant",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "employerFirmCheck",
      label: "Employer Firm Check",
      schema: {
        type: "object",
        properties: {
          checks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name of the person" },
                businessName: {
                  type: "string",
                  title: "Name of business firm",
                },
                address: { type: "string", title: "Address" },
                yearsKnown: {
                  type: "string",
                  title: "Number of years known the firm",
                },
                contactNumber: { type: "number", title: "Contact number" },
                feedback: {
                  type: "string",
                  title: "Feedback (Positive / Neutral / Negative)",
                },
                businessCardCollected: {
                  type: "string",
                  title: "Business card collected",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default niwasSalariedSchema;
