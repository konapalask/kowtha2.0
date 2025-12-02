import financialsSchema from "../financials-schema/generic";
export const axisFinanceUblBelow10lSchema = {
  id: 2,
  bankName: "Axis Finance UBL Below 10L",
  sections: [
    {
      id: "basicDetails",
      label: "Basic Details",
      schema: {
        type: "object",
        properties: {
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
          applicationNo: {
            type: "string",
            title: "Ref No / Application No",
            readOnly: true,
          },
          applicantName: {
            type: "string",
            title: "Name of Customer",
            readOnly: true,
          },
          pdConductedAt: {
            type: "string",
            title: "PD Conducted At",
            enum: ["Residence", "Office", "Residence cum Office"],
          },
          applicantContactNumber: {
            type: "integer",
            title: "Contact Number",
            readOnly: true,
          },
          dateOfVisit: {
            type: "string",
            title: "Date of Visit",
            format: "date",
          },
          addressVisited: {
            type: "string",
            title: "Visited Address",
            ui: {
              widget: "textarea",
              rows: 3,
            },
            readOnly: true,
          },
          bornAndBroughtUpFrom: {
            type: "string",
            title: "Born and Brought Up From",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          dateOfBirth: {
            type: "string",
            title: "Date of Birth",
            format: "date",
          },
          qualification: {
            type: "string",
            title: "Qualification",
          },
          previousWorkExperience: {
            type: "string",
            title: "Previous Work Experience",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "businessDetails",
      label: "Business Details",
      schema: {
        type: "object",
        properties: {
          nameOfFirm: {
            type: "string",
            title: "Name of the firm/company",
            readOnly: true,
          },
          typeOfBusiness: {
            type: "string",
            title: "Type of Firm",
          },
          ifPartnership: {
            type: "string",
            title: "If Partnership OR Pvt. Ltd. Provide share Holders Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
          officeDetails: {
            type: "string",
            title: "Office Details (office stability)",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          businessActivity: {
            type: "string",
            title:
              "level ofBusiness Activity (Remarks on Stocks, Total/current working capacity of Plant. )",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
          numberOfEmployees: {
            type: "integer",
            title: "Number of Employees",
          },
          salaryPaidToEmployees: {
            type: "string",
            title: "Salary paid to employees",
            ui: {
              widget: "textarea",
              rows: 2,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "customerDetails",
      label: "Customer Details",
      schema: {
        type: "object",
        properties: {
          majorCustomers: {
            type: "array",
            title: "Major Customers",
            items: {
              type: "object",
              properties: {
                nameOfCustomer: {
                  type: "string",
                  title: "Contact Person",
                },
                contactNo: { type: "integer", title: "Contact Number" },
                creditPeriod: { type: "number", title: "Credit Period" },
                paymentMode: { type: "string", title: "Payment Mode" },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "supplierDetails",
      label: "Supplier Details",
      schema: {
        type: "object",
        properties: {
          majorSuppliers: {
            type: "array",
            title: "Major Suppliers",
            items: {
              type: "object",
              properties: {
                nameOfSupplier: {
                  type: "string",
                  title: "Contact Person",
                },
                contactNo: { type: "integer", title: "Contact Number" },
                creditPeriod: { type: "number", title: "Credit Period" },
                paymentMode: { type: "string", title: "Payment Mode" },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "turnOverDetails",
      label: "Turnover Details",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "string",
            title: "Turnover Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "otherBusinessOrSourceOfIncome",
      label: "Other Business or Source of Income",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "string",
            title: "Other Business or Source of Income",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
    },
    {
      id: "assetDetails",
      label: "Movable/Immovable Assets Details",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "string",
            title: "Movable/Immovable Assets Details",
            ui: {
              widget: "textarea",
              rows: 3,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "familyDetails",
      label: "Family Details",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            title: "Details of applicants family members & their occupation",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                relationWithApplicant: {
                  type: "string",
                  title: "Relation with applicant",
                },
                age: {
                  type: "integer",
                  title: "Age (Yrs)",
                },
                occupation: {
                  type: "string",
                  title: "Occupation",
                },
              },
            },
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
          permanentAddress: {
            type: "string",
            title: "Permanent Address (If different from above)",
            ui: { widget: "textarea", rows: 3 },
          },
          residenceAddress: {
            type: "string",
            title: "Residence Address",
            ui: { widget: "textarea", rows: 3 },
          },
          resiStability: {
            type: "object",
            title: "Residence Stability",
            properties: {
              typeOfResidence: { type: "string", title: "Type of Residence" },
              durationOfStay: { type: "string", title: "Duration" },
              rentPerMonth: {
                type: "number",
                title: "Rent per month",
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
      required: true,
    },
    {
      id: "existingLoanDetails",
      label: "Existing Loan Details",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "string",
            title: "Existing Loan Details",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
      required: true,
    },
    {
      id: "bankingHabits",
      label: "Banking Habits",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "string",
            title: "Banking Habits",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
      required: true,
    },
    {
      id: "creditCardDetails",
      label: "Credit Card Details if any",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "string",
            title: "Credit Card Details if any",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "loanapplied",
      label: "Loan application Details",
      schema: {
        type: "object",
        properties: {
          loanType: { type: "string", title: "Type of Loan" },
          loanPurpose: { type: "string", title: "Loan Purpose" },
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
          affordableEMI: {
            type: "number",
            title: "Affordable EMI",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
          },
        },
      },
      required: true,
    },
    {
      id: "documentsSeen",
      label: "Documents Seen",
      schema: {
        type: "object",
        properties: {
          details: {
            type: "string",
            title: "Documents Seen",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
      required: true,
    },
    {
      id: "thirdPartyCheck",
      label: "Third Party Check",
      schema: {
        type: "object",
        properties: {
          nameOfThirdParty: {
            type: "string",
            title: "Name of Third Party Check",
          },
          statusOfThirdParty: {
            type: "string",
            title: "Third party check status",
          },
          feedbackRemarks: {
            type: "string",
            title: "Third party feedback remarks",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
      required: true,
    },
    {
      id: "overallDetails",
      label: "Overall Details",
      schema: {
        type: "object",
        properties: {
          overallRemarks: {
            type: "string",
            title: "Overall Remarks of the visit",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },

    financialsSchema,
  ],
} as const;
export default axisFinanceUblBelow10lSchema;
