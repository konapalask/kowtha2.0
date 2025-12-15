import financialsSchema from "../financials-schema/generic";

export const janaSenpBelow50lSchema = {
  id: 29,
  bankName: "Jana Senp Below 50l",
  sections: [
    {
      id: "applicationDetails",
      label: "Application Details",
      schema: {
        type: "object",
        properties: {
          applicationNumber: {
            type: "string",
            title: "Application Number",
            readOnly: true,
          },
        },
      },
    },
    {
      id: "borrowerFamilyDetails",
      label: "Details of Borrower’s & their family members & their Occupations",
      schema: {
        type: "object",
        properties: {
          borrowerFamilyDetails: {
            type: "array",
            title: "Borrower & Family Members",
            items: {
              type: "object",
              properties: {
                name: { type: "string", title: "Name" },
                relationWithApplicant: {
                  type: "string",
                  title: "Relation",
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
                age: { type: "number", title: "Age (Yrs)" },
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
                earningMember: {
                  type: "string",
                  title: "Earning Member",
                  enum: ["Yes", "No"],
                },
                approxIncome: {
                  type: "number",
                  title: "Approx. Income",
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
            ui: { widget: "textarea", rows: 3 },
            readOnly: true,
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },

    {
      id: "borrowerprofile",
      label: "Borrower Profile",
      schema: {
        type: "object",
        properties: {
          applicantName: { type: "string", title: "Applicant", readOnly: true },
          applicantDateOfBirth: {
            type: "string",
            title: "Date of Birth",
            format: "date",
          },
          coApplicantName: { type: "string", title: "Co-Applicant" },
          coApplicantDateOfBirth: {
            type: "string",
            title: "Date of Birth",
            format: "date",
          },
        },
      },
    },
    {
      id: "residenceDetails",
      label: "Residence Details & Stability at Current Residence",
      schema: {
        type: "object",
        properties: {
          residenceDetails: { type: "string", title: "Residence Details" },
        },
      },
    },

    {
      id: "residenceOwnershipDetails",
      label: "Residence Ownership Details",
      schema: {
        type: "object",
        properties: {
          residenceOwnership: { type: "string", title: "Residence Ownership" },
        },
      },
    },
    {
      id: "nameOfFirm",
      label: "Name of Firm",
      schema: {
        type: "object",
        properties: {
          nameOfFirm: {
            type: "string",
            title: "Name of Firm (employer/business)",
            readOnly: true,
          },
        },
      },
    },
    {
      id: "designation",
      label: "Designation",
      schema: {
        type: "object",
        properties: {
          designation: {
            type: "string",
            title: "Designation of Borrower/ownership type of business",
          },
        },
      },
    },
    {
      id: "shareholdingDetails",
      label: "Shareholding Details",
      schema: {
        type: "object",
        properties: {
          shareholdingDetails: {
            type: "array",
            title: "Shareholding Details",
            items: {
              type: "object",
              properties: {
                shareholderName: {
                  type: "string",
                  title: "Name of the Shareholder",
                },
                relationWithApplicant: {
                  type: "string",
                  title: "Relation with Applicant",
                },
                designation: { type: "string", title: "Designation" },
                shareholdingPercentage: {
                  type: "number",
                  title: "% of Shareholding",
                },
                comingIntoLoanStructure: {
                  type: "string",
                  title: "Coming into Loan Structure",
                },
                functionHandled: { type: "string", title: "Function Handled" },
              },
            },
          },
        },
      },
    },

    {
      id: "employmentOrBusinessDetails",
      label:
        "Employment/ Business Details & Stability Business premises details",
      schema: {
        type: "object",
        properties: {
          employmentDetails: {
            type: "string",
            title: "Employment/ Business Details",
          },
          businessPremises: {
            type: "string",
            title: "Stability Business premises details",
          },
        },
      },
    },

    {
      id: "jobProfile",
      label:
        "Business Profile /Employment job profile along with previous business/employment details",
      schema: {
        type: "object",
        properties: {
          businessOrEmploymentProfile: {
            type: "string",
            title: "Business Profile /Employment job profile",
          },
          previousBusinessOrEmploymentDetails: {
            type: "string",
            title: "Previous business/employment details",
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
          averaggeStock: {
            type: "number",
            title: "Average Stock Maintained",
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
    {
      id: "workingHours",
      label: "Working Hours",
      schema: {
        type: "object",
        properties: {
          workingHours: { type: "string", title: "Working Hours" },
        },
      },
    },
    {
      id: "employmentDetails",
      label: "Employee Details (to be filled for Self Employed Profile)",
      schema: {
        type: "object",
        properties: {
          noOfEmployees: { type: "number", title: "No of Employees" },
          salaryPerMonthPerEmployee: {
            type: "number",
            title: "Salary per month per employee",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          statusOfEmployee: { type: "string", title: "Status of Employee" },
          noOfLabours: { type: "number", title: "No of Labours" },
          wagesPerMonthOrDay: {
            type: "number",
            title: "Wages per month/per day",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          statusOfLabour: { type: "string", title: "Status of Labour" },
        },
      },
    },

    {
      id: "currentMonthlySalary",
      label: "Current Monthly Salary (to be filled in salaried income profile)",
      schema: {
        type: "object",
        properties: {
          modeOfSalaryPayment: {
            type: "string",
            title: "Mode of Salary Payment",
          },
          last3MonthSalary: { type: "string", title: "Last 3 Month Salary" },
          netSalaryAsPerSalarySlipOrCertificate: {
            type: "string",
            title: "Net Salary as per salary slip/ certificate",
          },
          netSalaryAsPeBankCredits: {
            type: "string",
            title: "Net Salary as per bank credits",
          },
          dateOfCredit: { type: "string", title: "Date of Credit" },
        },
      },
    },

    {
      id: "otherIncome",
      label: "Other Sources ofIncome",
      schema: {
        type: "object",
        properties: {
          otherIncome: {
            type: "array",
            title: "Other Sources of Income",
            items: {
              type: "object",
              properties: {
                typeOfIncome: { type: "string", title: "Type of Income" },
                incomeAmount: {
                  type: "number",
                  title: "Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                remarks: { type: "string", title: "Remarks (pls. Specify)" },
              },
            },
          },
        },
      },
    },
    {
      id: "specificForCashSalariedProfile",
      label:
        "Specific for Cash Salaried Profile (To be filled in for Cash Salaried profile)",
      schema: {
        type: "object",
        properties: {
          didPdAgentMetTheEmployer: {
            type: "string",
            title: "Did the PD agent met the employer?",
            enum: ["Yes", "No"],
          },
          employerName: { type: "string", title: "Name of the employer" },
          mobileNumberOfEmployer: {
            type: "string",
            title: "Mobile number of the employer",
          },

          employerMaintainAttendanceSheet: {
            type: "string",
            title: "Does Employer maintain attendance sheet",
            enum: ["Yes", "No"],
          },
          nameOfBorrowerReflectingInAttendance: {
            type: "string",
            title:
              "If yes, is the name of the borrower reflecting in the attendance register",
            enum: ["Yes", "No"],
            dependencies: {
              show: {
                employerMaintainAttendanceSheet: "Yes",
              },
              required: {
                employerMaintainAttendanceSheet: "Yes",
              },
            },
          },
          howManyMonthsReflectingInAttendance: {
            type: "string",
            title:
              "for how many months (try to check last 6 months attendance register)",
            dependencies: {
              show: {
                employerMaintainAttendanceSheet: "Yes",
                nameOfBorrowerReflectingInAttendance: "Yes",
              },
              required: {
                employerMaintainAttendanceSheet: "Yes",
                nameOfBorrowerReflectingInAttendance: "Yes",
              },
            },
          },

          attendanceReferenceChecksinSameFirm: {
            type: "array",
            title:
              "If no, then do reference checks for employment confirmation with other employees working in the same firm. Minimum 2 references to be obtain. (Name & mobile number of the reference people to be documented)",
            items: {
              type: "object",
              properties: {
                nameOfReferencePeople: {
                  type: "string",
                  title:
                    "Name of the reference people for attendance confirmation in same firm",
                },
                mobileNumberReferencePeople: {
                  type: "string",
                  title:
                    "Mobile number of the reference people for attendance confirmation in same firm",
                },
              },
            },
          },

          attendanceNeighboursReferenceChecks: {
            type: "array",
            title:
              "Neighbour two reference checks to confirm applicant's employer information is correct. (name & contact number along with feedback to be documented)",
            items: {
              type: "object",
              properties: {
                nameOfNeighbour: {
                  type: "string",
                  title: "Name of the neighbour",
                },
                mobileNumberNeighbour: {
                  type: "string",
                  title: "Mobile number of the neighbour",
                },
                feedbackOnApplicant: {
                  type: "string",
                  title: "Feedback on the applicant",
                },
              },
            },
          },

          proofOfSalaryMaintenance: {
            type: "string",
            title:
              "Does the employer maintain any salary register or any salary paid receipt/voucher or any other documentary proof for salary being paid to the borrower (Y/N)",
            enum: ["Yes", "No"],
          },
          ifYesVerifySalaryPaid: {
            type: "string",
            title: "If yes, verify the salary paid to the borrower and capture photos in the PD report",
            ui: { widget: "textarea", rows: 3 },
            dependencies: {
              show: {
                proofOfSalaryMaintenance: "Yes",
              },
              required: {
                proofOfSalaryMaintenance: "Yes",
              },
            },
          },

          salaryReferenceCheckInSameFirm: {
            type: "array",
            title:
              "If no, then do reference checks with other employees working in the same firm for salary confirmation. Minimum 2 references to be obtained. (Name & mobile number of the reference people to be documented).",
            items: {
              type: "object",
              properties: {
                nameOfReferencePeople: {
                  type: "string",
                  title:
                    "Name of the reference people for salary confirmation in same firm",
                },
                mobileNumberReferencePeople: {
                  type: "string",
                  title:
                    "Mobile number of the reference people for salary confirmation in same firm",
                },
              },
            },
          },
          variationInSalary: {
            type: "string",
            title:
              "Any variation in the salary paid amount as per salary certificate & as per salary register verified during the visit.",
          },
          employeHasGSTNumber: {
            type: "string",
            title: "Does the employer has GST number?",
            enum: ["Yes", "No"],
          },
          gstNumber: {
            type: "string",
            title: "If yes, Try to collect GST number of the employer.",
            dependencies: {
              show: {
                employeHasGSTNumber: "Yes",
              },
              required: {
                employeHasGSTNumber: "Yes",
              },
            },
          },
        },
      },
    },

    {
      id: "businessAndProuctsAndEndUseOfTheSame",
      label: "Main Business, Products and End use of the same",
      schema: {
        type: "object",
        properties: {
          endUseOfProducts: {
            type: "string",
            title: "End Use of Business / Products",
          },
        },
      },
    },

    {
      id: "clientDetails",
      label: "Client Details",
      schema: {
        type: "object",
        properties: {
          noOfFixedClients: { type: "string", title: "No of Fixed Clients" },
          creditPeriod: { type: "string", title: "Credit Period" },
          cashChequeProportion: {
            type: "string",
            title: "Cash - Cheque proportion",
          },
          top3customers: {
            type: "array",
            title: "Top 3 Customers",
            items: {
              type: "object",
              properties: {
                nameOfClient: {
                  type: "string",
                  title: "Name (top 3 customers)",
                },
                contactDetails: { type: "string", title: "Contact Details" },
                location: { type: "string", title: "Location" },
                referenceCheck: { type: "string", title: "Ref. Check" },
              },
            },
          },
        },
      },
    },

    {
      id: "vendorDetails",
      label: "Vendor Details",
      schema: {
        type: "object",
        properties: {
          noOfFixedVendor: { type: "string", title: "No of Fixed Vendor" },
          creditPeriod: { type: "string", title: "Credit Period" },
          cashChequeProportion: {
            type: "string",
            title: "Cash - Cheque proportion",
          },
          top3vendors: {
            type: "array",
            title: "Top 3 Vendors",
            items: {
              type: "object",
              properties: {
                nameOfVendor: { type: "string", title: "Name (top 3 vendors)" },
                contactDetails: { type: "string", title: "Contact Details" },
                location: { type: "string", title: "Location" },
                referenceCheck: { type: "string", title: "Ref. Check" },
              },
            },
          },
        },
      },
    },
    {
      id: "thirdPartyChecks",
      label: "Third Party Checks",
      schema: {
        type: "object",
        properties: {
          thirdPartyChecks: {
            type: "array",
            title: "Third Party Checks",
            items: {
              type: "object",
              properties: {
                individualOrBusinessName: {
                  type: "string",
                  title: "Individual / Business Name",
                },
                address: { type: "string", title: "Address" },
                contactNo: { type: "number", title: "Contact No." },
                knowingSince: { type: "number", title: "Knowing Since" },
                feedbackOnBorrower: {
                  type: "string",
                  title: "Feedback on Borrower",
                },
                feedbackOnBusiness: {
                  type: "string",
                  title: "Feedback on Business",
                },
              },
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
          incomedetails: {
            type: "array",
            title: "Income Details",
            items: {
              type: "object",
              properties: {
                last3MonthSalary: { type: "string", title: "Last 3 months" },
                sales: {
                  type: "number",
                  title: "Sales",
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
                gstPaid: {
                  type: "number",
                  title: "GST Paid",
                },
              },
            },
          },
          totalMonthlySalesOrRevenue: {
            type: "number",
            title: "Total Monthly Sales/Revenue",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          monthlyBusinessExpenses: {
            type: "number",
            title: "Less: Monthly Business Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netBusinessIncome: {
            type: "number",
            title: "Net Business Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          currentObligations: {
            type: "number",
            title: "Less: Current Obligations",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          familyExpenses: {
            type: "number",
            title: "Less: Family Expenses",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          netDisposalIncome: {
            type: "number",
            title: "Net Disposal Income",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          annualSales: {
            type: "number",
            title: "Annual Sales",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          annualGstPaid: {
            type: "number",
            title: "Annual GST Paid",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          annualGrossProfit: {
            type: "number",
            title: "Annual Gross Profit",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          annualNetProfit: {
            type: "number",
            title: "Annual Net Profit",
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
    {
      id: "specificForContractorProfile",
      label:
        "Specific for Contractor Profile (To be filled in for Contractor (Resi cum office) profile:-)",
      schema: {
        type: "object",
        properties: {
          contractsCompleted: {
            type: "string",
            title: "How many contracts completed in last 6 months",
          },
          modeOfPayment: {
            type: "string",
            title: "In what mode, payment is getting against these contracts.",
          },
          clientDetails: {
            type: "object",
            title:
              "Document name of client, mobile number, type of contract & contract value in PD report",
            properties: {
              nameOfClient: {
                type: "string",
                title: "Document name of the client",
              },
              mobileNumberOfClient: {
                type: "integer",
                title: "Mobile number of the client",
              },
              typeOfContract: { type: "string", title: "Type of contract" },
              contractValue: {
                type: "number",
                title: "Contract Value in PD report",
                formatter: {
                  useIndianFormat: true,
                  locale: "en-IN",
                  maxDecimalPlaces: 2,
                  minDecimalPlaces: 0,
                },
              },
            },
          },
          clientReferenceCheck: {
            type: "array",
            title:
              "Randomly call 2 to 3 clients to verify the contract details and document the feedback in the PD report along with details of the client called for confirmation.",
            items: {
              type: "object",
              properties: {
                nameOfClient: { type: "string", title: "Name of the client" },
                mobileNumberOfClient: {
                  type: "integer",
                  title: "Mobile number of the client",
                },
                feedbackOnClient: {
                  type: "string",
                  title: "Feedback on the client",
                  ui: { widget: "textarea", rows: 3 },
                },
              },
            },
          },
          neighbourReferenceCheck: {
            type: "array",
            title:
              "Neighbour reference checks (minimum 2 people) details with name & contact details to be captured in the PD report",
            items: {
              type: "object",
              properties: {
                nameOfNeighbour: {
                  type: "string",
                  title: "Name of the neighbour",
                },
                mobileNumberOfNeighbour: {
                  type: "integer",
                  title: "Mobile number of the neighbour",
                },
                feedbackDetails: {
                  type: "string",
                  title: "Feedback details",
                  ui: { widget: "textarea", rows: 3 },
                },
              },
            },
          },
          stabilityInTheSameBusiness: {
            type: "string",
            title: "Stability or vintage in the same line of business",
          },
          directOrSubContractor: {
            type: "string",
            title: "Direct contractor or doing sub-contracting work",
          },
          advanceAmountPaid: {
            type: "number",
            title: "Advance amount paid to workers",
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
    {
      id: "levelOfActivity",
      label: "Level of Activity & Stocks along with Observation",
      schema: {
        type: "object",
        properties: {
          observations: {
            type: "string",
            title: "Level of Activity & Stocks along with Observation",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "mortgageDetails",
      label: "Details of property to be mortgaged",
      schema: {
        type: "object",
        properties: {
          collateralAddress: {
            type: "string",
            title: "Collateral Address",
            ui: { widget: "textarea", rows: 3 },
          },
          areaInSqYards: {
            type: "number",
            title: "Area in Sq. Yards",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          agreementValue: {
            type: "number",
            title: "Agreement Value (in Lakhs)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          actualPurchaseCost: {
            type: "number",
            title: "Actual Purchase Cost (in Lakhs)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          marketValue: {
            type: "number",
            title: "Market Value (in Lakhs)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          ocrValue: {
            type: "number",
            title: "OCR (in Lakhs)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          ocrPaidTillDate: {
            type: "number",
            title: "OCR paid till date (in Lakhs)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
          ocrSource: { type: "string", title: "Source of OCR" },
        },
      },
    },

    {
      id: "endUseOfLoan",
      label: "End Use of Loan",
      schema: {
        type: "object",
        properties: {
          hlPurchase: { type: "string", title: "HL Purchase" },
          hlRepair: { type: "string", title: "HL Repair or Renovation" },
          hlConstruction: { type: "string", title: "HL Construction" },
          hlPlotAndConstruction: {
            type: "string",
            title: "HL Plot + Construction",
          },
          hlWorkingCapital: { type: "string", title: "HL Working Capital" },
          assetAcquisition: {
            type: "string",
            title: "Asset Acquisition and Expansion",
          },
          marketDevelopment: {
            type: "string",
            title: "Market Development and growth",
          },
          debtManagement: {
            type: "string",
            title: "Debt Management and Financial Efficiency",
          },
          btAndTopUp: { type: "string", title: "BT and Top Up" },
        },
      },
    },

    {
      id: "assetDetails",
      label:
        "Other Asset Details (Including properties, vehicles, investments etc.)",
      schema: {
        type: "object",
        properties: {
          assetDetails: {
            type: "string",
            title: "Asset Details",
            ui: { widget: "textarea", rows: 3 },
          },
          propertiesValue: {
            type: "number",
            title:
              "Properties (Flat, Individual House, Commercial, Agri land, vacant residential land, etc.)",
          },
          lifeInsurance: {
            type: "number",
            title: "Life Insurance",
          },
          medicalInsurance: {
            type: "number",
            title: "Medical Insurance",
          },
          sipValue: {
            type: "number",
            title: "SIP",
          },
          fdValue: {
            type: "number",
            title: "FD",
          },
          vehicleValue: {
            type: "number",
            title: "Vehicle",
          },
          otherAssetsValue: {
            type: "number",
            title: "Others",
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
                nameOfBank: { type: "string", title: "Name of Bank" },
                typeOfLoan: { type: "string", title: "Type of Loan" },
                loanAmount: {
                  type: "number",
                  title: "Loan Amount",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                osBalance: {
                  type: "number",
                  title: "O/S Balance (in Lakhs)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                emi: {
                  type: "number",
                  title: "EMI (in Rs.)",
                  formatter: {
                    useIndianFormat: true,
                    locale: "en-IN",
                    maxDecimalPlaces: 2,
                    minDecimalPlaces: 0,
                  },
                },
                tenure: { type: "number", title: "Tenure" },
                monthOnBooks: { type: "string", title: "Month on Books" },
                emiPaidBank: { type: "string", title: "EMI Paid Bank" },
              },
            },
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
          details: {
            type: "array",
            title: "Banking Details",
            items: {
              type: "object",
              properties: {
                bankName: { type: "string", title: "Bank Name" },
                branchName: { type: "string", title: "Branch Name" },
                accountType: { type: "string", title: "Account Type" },
                openSinceYear: { type: "string", title: "Open Since (Year)" },
              },
            },
          },
        },
      },
    },

    {
      id: "loanAmountAndEndUseOfLoan",
      label: "Loan Amount Required & End Use",
      schema: {
        type: "object",
        properties: {
          loanAmountRequired: {
            type: "number",
            title: "Loan Amount Required (in Lakhs)",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
            readOnly: true,
          },
          endUseDetailsOfLoan: {
            type: "string",
            title: "End Use of Loan (Amount & Detailed End Use",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "existingRelationWithLender",
      label: "Existing Relation with this lender Bank/FI",
      schema: {
        type: "object",
        properties: {
          relationshipWithLender: { type: "string", title: "Relation" },
        },
      },
    },
    {
      id: "documentsSeen",
      label: "Documents Seen",
      schema: {
        type: "object",
        properties: {
          documentsSeen: {
            type: "array",
            title: "Documents Seen",
            items: {
              type: "object",
              properties: {
                documentCategory: {
                  type: "string",
                  title: "Document Category",
                  enum: [
                    "KYC Documents",
                    "Business Ownership Documents",
                    "Income & Expense Documents",
                    "Other Documents",
                  ],
                },
                documentName: { type: "string", title: "Document Name" },
                documentType: { type: "string", title: "Document Type" },
                documentRemarks: {
                  type: "string",
                  title: "Remarks",
                  ui: { widget: "textarea", rows: 3 },
                },
              },
            },
          },
        },
      },
    },
    {
      id: "interviewerComments",
      label:
        "Interviewer’s Comments along with the explanations to credit comments (with brief summary report)",
      schema: {
        type: "object",
        properties: {
          comforts: {
            type: "string",
            title: "Comforts",
            ui: { widget: "textarea", rows: 3 },
          },
          discomforts: {
            type: "string",
            title: "Discomforts",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "observations",
      label: "Observations",
      schema: {
        type: "object",
        properties: {
          observations: {
            type: "string",
            title: "Observations",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "interviewerDetails",
      label: "Interviewer Details",
      schema: {
        type: "object",
        properties: {
          interviewerName: { type: "string", title: "Interviewer Name" },
          dateAndTimeOfInterview: {
            type: "string",
            title: "Visit Date and Time",
            format: "datetime",
          },
        },
      },
    },
    {
      id: "geoTagDetails",
      label: "Geo Tag Details",
      schema: {
        type: "object",
        properties: {
          coordinates: { type: "string", title: "Coordinates", readOnly: true },
        },
      },
    },
    financialsSchema,
  ],
} as const;
export default janaSenpBelow50lSchema;
