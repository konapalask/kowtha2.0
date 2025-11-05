import financialsSchema from "../financials-schema/generic";
export const niwasSenpSchema = {
  id: 24,
  bankName: "Niwas Senp",
  sections: [
    {
      id: "generalInfo",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
          prospectNo: { type: "string", title: "Prospect No." },
          name: { type: "string", title: "Name" },
          maritalStatus: {
            type: "string",
            title: "Marital Status",
            enum: ["Single", "Married", "Divorced", "Others"],
          },
          educationalQualification: {
            type: "string",
            title:
              "Educational Qualification",
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
            title: "Number of Years in Current Residence",
            enum: ["<1 Year", "1-3 Years", "3-5 Years", ">5 Years"],
          },
          currentResidenceHouseSize: {
            type: "string",
            title: "Current residence house size",
            enum: ["1 RK", "1 BHK", "2 BHK", ">2 BHK"],
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
            title: "Number of Years in current city",
            enum: ["<=3 Years", ">3 Years"],
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
          },
          ifParentsLivingSeparately: {
            type: "object",
            title: "If parents living separately, then mention",
            properties: {
              residingCity: {
                type: "string",
                title: "Residing City",
              },
              residingLocationOwnershipStatus: {
                type: "string",
                title: "Residing location ownership status",
                enum: ["Self-Owned", "Prent-Owned", "Rented"],
              },
            },
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
          smartphone: { type: "string", title: "Smartphone (Yes/No)", enum: ["Yes", "No"] },
          washingMachine: { type: "string", title: "Washing Machine (Yes/No)", enum: ["Yes", "No"] },
          carRcNo: { type: "string", title: "Car RC No. (Yes/No)", enum: ["Yes", "No"] },
          twoWheeler: { type: "string", title: "Two Wheeler (Yes/No)", enum: ["Yes", "No"] },
          autoCab: { type: "string", title: "Auto/Cab (Yes/No)", enum: ["Yes", "No"] },
          computerLaptop: {
            type: "string",
            title: "Computer / Laptop (Yes/No)", enum: ["Yes", "No"] },
          ac: { type: "string", title: "AC (Yes/No)" ,enum: ["Yes", "No"]},
          fridge: { type: "string", title: "Fridge (Yes/No)" ,enum: ["Yes", "No"]},
          induction: { type: "string", title: "Induction (Yes/No)" ,enum: ["Yes", "No"]},
          insurance: { type: "string", title: "Insurance (LIC)" ,enum: ["Yes", "No"]},
          fixedDeposit: { type: "string", title: "Fixed Deposit" ,enum: ["Yes", "No"]},
          chitFunds: { type: "string", title: "Chit Funds" ,enum: ["Yes", "No"]},
          postOfficeSavings: { type: "string", title: "Post Office Savings" ,enum: ["Yes", "No"]},
          postOfficeSavingsMonthly: {
            type: "string",
            title: "Post Office savings monthly (Yes/No)",
            enum: ["Yes", "No"],
          },
          recurringDeposit: {
            type: "string",
            title: "Recurring Deposit (Yes/No)",
            enum: ["Yes", "No"],
          },
          consumptionHabits: {
            type: "string",
            title: "Consumption of Nicotine / Alcohol (Yes/No)",
            enum: ["Yes", "No"],
          },
        },
      },
    },
    {
      id: "businessEmployment",
      label: "Employment & Business Details",
      schema: {
        type: "object",
        properties: {
          businessName: { type: "string", title: "Name of Current Business Firm" },
          businessConstitution: {
            type: "string",
            title: "Type of Business Firm",
            enum: ["Proprietorship", "Partnership", "Others"],
          },
          partnershipShare: {
            type: "number",
            title: "If partnership - shareholding %",
          },
          businessCommencementDate: {
            type: "date",
            title: "Date of commencement of business",
          },
          placeOfIncorporation: {
            type: "string",
            title: "Place of incorporation / address",
            ui: { widget: "textarea", rows: 2 },
          },
          previousBusinessName: {
            type: "string",
            title: "Previous business name (if applicable)",
          },
          previousBusinessYears: {
            type: "number",
            title: "Years worked in previous business",
          },
          reasonForChange: {
            type: "string",
            title: "Reason for change / closing previous business",
          },
          totalWorkExperience: {
            type: "number",
            title: "Total work experience",
          },
          officialEmail: { type: "string", title: "Official / Business email ID" },
          contactNumber: { type: "string", title: "Contact number" },
        },
      },
    },
    {
      id: "businessDetails",
      label: "Business Details",
      schema: {
        type: "object",
        properties: {
          typeOfIndustry: {
            type: "string",
            title: "Type of industry",
            enum: ["Small Manufacturing Unit from Home/other premises", "Trading", "Services", "Other"],
          },

          businessProfile: {
            type: "string",
            title: "Business Profile",
            enum:[
              "Car Driver",
              "Auto Garage",
              "Two Wheeler Auto Driver",
              "Carpenter",
              "Kirana Shop",
              "Caterers",
              "Repairing shop",
              "Coaching Classes",
              "Computer/Mobile Repairing shop",
              "Contractors of Diamond Polishing/Job work of Jewelry",
              "Cyber Café",
              "Fast Food Outlet",
              "Labor Contractor",
              "Milk Pan Shop owner",
              "Photography/studio",
              "Spa & Hair Saloon",
              "Tailor",
              "Vegetable & Fruit Vendor",
              "Others, Please Specify",
            ],
           
          },
          businessPremisesOwnership: {
            type: "string",
            title: "BusinessPremises Ownership",
            enum: ["Self-Owned", "Family-Owned", "Joint Ownership", "Rented", "NA"],
          },
          areaOfOffice: {
            type: "string",
            title: "Area of office",
            enum: ["<=250 Sq.ft", "251 to 400 Sq.ft", ">400 Sq.ft","NA"],
          },
          stocksAssetsSeen: {
            type: "string",
            title: "Stocks/Assets Seen in Business Premises",
          },
          otherAssetsSeen: {
            type: "string",
            title: "Others (Please specify all major assets seen):",
          },
          localityOfBusiness: {
            type: "string",
            title: "Locality of business Premises",
            enum: ["Residential", "Commercial", "Industrial", "Corporate Hub/Office Space", "Other"],
          },
          annualTurnover: {
            type: "number",
            title: "Annual Turnover",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netProfitMargin: {
            type: "number",
            title: "Net Profit Margin",
          },
          businessSeasonal: {
            type: "string",
            title: "Is Business seasonal?",
            enum: ["Yes", "No"],
          },
          numberOfEmployees: {
            type: "number",
            title: "Number of Employees",
          },
          profileDescriptionOfEmployeeStaff: {
            type: "string",
            title: "Profile Description of employee/staff",
          },
          designationOfEmployeeStaffMember: {
            type: "string",
            title: "Designation of Employee/Staff member",
        },
        noOfEmployeesInThatRole: {
          type: "number",
          title: "No. of Employees in that role",
        },
        yearsAtCurrentPremises: {
          type: "number",
          title: "No. of Years for which Business Running in this Premises",
        },
        earlierOperatingAddress: {
          type: "string",
          title: "If less than 3 years - Provide address details from where it was operating earlier",
        },
        popularityInLocalMarket: {
          type: "string",
          title: "Popularity in Local Market",
          enum: ["Average", "Good", "High"],
        },
        noOfCompetitorsInNearbyMarket: {
          type: "string",
          title: "No. of Competitors in Nearby Market",

        },
        finalProductServiceOfBusiness: {
          type: "string",
          title: "Final Product/Service of Business",
        },
        businessStartedBy: {
          type: "string",
          title: "Business Started by",
          enum: ["Self", "Father/ Other Family member","Mother", "Others"],
      },
      sourceOfInitialFunds: {
        type: "string",
        title: "If Self Started, Source of initial Funds",
        enum: ["Own Funding", "Borrowed from Family", "Loan", "Others"],
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
                employerBusinessName: { type: "string", title: "Employer/Business Name" },
                designation: { type: "string", title: "Designation" },
                from: { type: "date", title: "From" },
                to: { type: "date", title: "To" },
                reasonForMovement: { type: "string", title: "Reason for Movement" },
                contactPersonNameNumber: { type: "object", title: "Contact Person Name & Number", properties: {
                  contactPersonName: { type: "string", title: "Contact Person Name" },
                  contactPersonNumber: { type: "string", title: "Contact Person Number" },
                } },
              },
            },
          },
        },
      },
    },
  
    {
      id: "businessIncomeComputationMonthly",
      label: "Business Income Computation (Monthly Basis)",
      schema: {
        type: "object",
        properties: {
          revenue: {
            type: "object",
            sales: { type: "number", title: "Sales" , formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            } },
            totalMonthlyRevenueA: { type: "number", title: "Total Monthly Revenue (A)" , formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            } },
          },
          expenditure: {
            type: "object",
            purchases: { type: "number", title: "Purchases" , formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            } },
            rent: { type: "number", title: "Rent" , formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            } },
            electricity: { type: "number", title: "Electricity" , formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            } },
            transportation: { type: "number", title: "Transportation" , formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            } },
            otherExpenses: { type: "number", title: "Other Expenses" , formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            } },
            totalMonthlyExpensesB: { type: "number", title: "Total Monthly Expenses (B)" , formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            } },
          },
          netMonthlyProfitAB: { type: "number", title: "Net Monthly Profit (=A-B)" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          otherMonthlyIncome: { type: "number", title: "Other Monthly Income" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          rentalIncomeCash: { type: "number", title: "Rental Income - Cash" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          rentalIncomeCheque: { type: "number", title: "Rental Income - Cheque" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          incentivesCash: { type: "string", title: "Incentives / Perks - Cash" },
          incentivesCheque: { type: "number", title: "Incentives / Perks - Cheque" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          monthlyBonusCash: { type: "number", title: "Monthly Bonus - Cash" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          monthlyBonusCheque: { type: "number", title: "Monthly Bonus - Cheque" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          otherMonthlyIncomeSourceType: { type: "string", title: "Others, please specify source type" },
          otherMonthlyIncomeCash: { type: "number", title: "Other Monthly Income - Cash" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          otherMonthlyIncomeCheque: { type: "number", title: "Other Monthly Income - Cheque" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
        },
      },
    },

    {
      id: "existingLoanDetails",
      label: "Existing Loan Details",
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
                loanAmount: { type: "number", title: "Loan Amount" , formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                } },
                emi: { type: "number", title: "EMI" , formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                } },
                tenureRemaining: { type: "number", title: "Tenure Remaining" , formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                } },
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
          purposeOfLoan: { type: "string", title: "Purpose of Loan", enum: ["Flat Purchase", "House Purchase", "Plot Purchase", "Construction of Residential House Property", "Improvement/Extension", "Balance Transfer", "Plot + Construction", "Hand Loan Clearance"] },
          minimumLoanAmountRequired: { type: "number", title: "Minimum Loan Amount Required" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          tenureRequired: { type: "number", title: "Tenure Required" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          monthlyHouseholdExpenses: { type: "number", title: "Monthly Household Expenses" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          comfortableEmi: { type: "number", title: "Comfortable EMI" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          statusOfPropertyToBePurchased: { type: "string", title: "Status of Property to be Purchased" , enum: ["Ready", "Under Construction", "Construction Yet to Start"]},
          usageOfPropertyAfterPurchase: { type: "string", title: "Usage of Property After Purchase" , enum: ["Self-Occupancy", "Investment", "Others", "Renting Purpose"]},
   },
  },
},

    {
      id: "costAndFunds",
      label: "Cost & Funds Information",
      schema: {
        type: "object",
        properties: {
          fundsRequired: { type: "number", title: "Funds required" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          sourceOfOwnFunds: {
            type: "string",
            title: "Source of own funds (OCR)",
          },
          purchaseCost: { type: "number", title: "Purchase cost" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          savings: { type: "number", title: "Savings" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          constructionEstimate: {
            type: "number",
            title: "Construction estimate",
          },
          familyFriends: { type: "string", title: "Family/Friends" },
          registrationStampDutyCharges: { type: "string", title: "Registration/Stamp Duty Charges" },
          otherLoanAmountTaken: { type: "number", title: "Other Loan Amount Taken" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          otherExpenses: { type: "number", title: "Other Expenses" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          totalAmountSpent: { type: "number", title: "Total Amount Spent (Total of all the above)" , formatter: {
            useIndianFormat: true,
            locale: "en-IN",
            maxDecimalPlaces: 2,
            minDecimalPlaces: 0,
          } },
          totalTransactionCost: {
            type: "number",
            title: "Total transaction cost (Total of all the above cost)",
          },
          modeOfPaymentToSeller: {
            type: "object",
            title: "Mode of Payment to Seller (Cash / Cheque)",
            properties: {
              cashAmount: { type: "number", title: "Cash Amount" , formatter: {
                useIndianFormat: true,
                locale: "en-IN",
                maxDecimalPlaces: 2,
                minDecimalPlaces: 0,
              } },
              chequeAmount: { type: "number", title: "Cheque Amount" , formatter: {
                useIndianFormat: true,
                locale: "en-IN",
                maxDecimalPlaces: 2,
                minDecimalPlaces: 0,
              } },
            },
          },
        },
      },
    },
    // {
    //   id: "bankingDetails",
    //   label: "Banking Details",
    //   schema: {
    //     type: "object",
    //     properties: {
    //       bankingAccounts: {
    //         type: "array",
    //         items: {
    //           type: "object",
    //           properties: {
    //             bankName: { type: "string", title: "Bank Name" },
    //             accountNumber: { type: "string", title: "Account Number" },
    //             accountType: { type: "string", title: "Account Type" },
    //             branch: { type: "string", title: "Branch" },
    //             operatingSinceYears: {
    //               type: "string",
    //               title: "Operating since (years)",
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
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
                relationship: { type: "string", title: "Relationship" },
                age: { type: "string", title: "Age" },
                employmentType: { type: "string", title: "Employment Type" },
                education: {
                  type: "string",
                  title:
                    "Educational Qualification (Also mention if Govt. or Private institution)",
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
      label: "References (Business Parties)",
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
                relationship: { type: "string", title: "Relationship" },
                contactNumber: { type: "number", title: "Contact Number" },
                email: { type: "string", title: "Email Address" },
                yearsKnown: {
                  type: "number",
                  title: "No. of Years known the applicant",
                },
                photoWithApplicant: {
                  type: "string",
                  title: "Photo with Applicant (Yes/No)",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "businessFirmCheck",
      label: "Business Firm Check",
      schema: {
        type: "object",
        properties: {
          checks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name of the person" },
                businessName: { type: "string", title: "Name of business firm" },
                address: { type: "string", title: "Address" },
                yearsKnown: {
                  type: "number",
                  title: "Number of years known the firm",
                },
                contactNumber: { type: "number", title: "Contact number" },
                feedback: {
                  type: "string",
                  title: "Feedback (Positive / Neutral / Negative)",
                },
                businessCardCollected: {
                  type: "string",
                  title: "Business card collected (Yes/No)",
                  enum: ["Yes", "No"],
                },
              },
            },
          },
        },
      },
    },
    {
      id: "pdOfficerComments",
      label: "PD Officer Comments",
      schema: {
        type: "object",
        properties: {
          comments: {
            type: "string",
            title: "Comments / Observations of the case",
            ui: { widget: "textarea", rows: 4 },
          },
          initiatedAddress: {
            type: "string",
            title: "Initiated address",
            ui: { widget: "textarea", rows: 2 },
          },
          visitedAddress: {
            type: "string",
            title: "Visited address",
            ui: { widget: "textarea", rows: 2 },
          },
          residentialAddress: {
            type: "string",
            title: "Residential address",
            ui: { widget: "textarea", rows: 2 },
          },
          otherObservations: {
            type: "string",
            title: "Other observations",
            ui: { widget: "textarea", rows: 3 },
          },
          concerns: {
            type: "string",
            title: "Concerns",
            ui: { widget: "textarea", rows: 2 },
          },
          statusOfCase: {
            type: "string",
            title: "Status of the case",
            enum: ["Positive", "Negative", "Others"],
          },
          pdOfficerName: { type: "string", title: "Name of PD Officer" },
          discussionDate: { type: "date", title: "Date of Discussion" },
          pdOfficerSignature: { type: "string", title: "Signature of PD Officer" },
        },
      },
    },
    financialsSchema,
  ],
} as const;

export default niwasSenpSchema;
