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
          prospectNo: { type: "string", title: "Prospect No." },
          nameOfApplicant: { type: "string", title: "Name of Applicant" },
          maritalStatus: {
            type: "string",
            title: "Marital Status",
            enum: ["Single", "Married", "Divorced", "Others"],
          },
          educationalQualification: {
            type: "string",
            title:
              "Educational Qualification (Below 10th / 10th Pass / 12th Pass / Diploma / Graduate / PG / Professional Certification)",
          },
          category: {
            type: "string",
            title: "Category",
            enum: ["General", "SC", "ST", "OBC", "Others"],
          },
          dependentsChildren: {
            type: "string",
            title: "Number of Dependents - Children",
          },
          dependentsAdults: {
            type: "string",
            title: "Number of Dependents - Adults",
          },
          dependentsOthers: {
            type: "string",
            title: "Number of Dependents - Others",
          },
          yearsInCurrentResidence: {
            type: "string",
            title: "Years in Current Residence",
          },
          currentResidenceHouseSize: {
            type: "string",
            title: "Current Residence House Size",
          },
          previousAddress: {
            type: "string",
            title: "Previous Address (if < 1 year)",
            ui: { widget: "textarea", rows: 2 },
          },
          yearsStayedPreviousAddress: {
            type: "string",
            title: "Years Stayed at Previous Address",
          },
          yearsInCurrentCity: {
            type: "string",
            title: "Years in Current City",
          },
          previousCity: {
            type: "string",
            title: "Previous City (if ≤ 3 years)",
          },
          yearsInPreviousCity: {
            type: "string",
            title: "Years in Previous City",
          },
          reasonForChange: {
            type: "string",
            title: "Reason for Change",
            ui: { widget: "textarea", rows: 2 },
          },
          parentsStayingWith: {
            type: "string",
            title: "Parents Staying With? (Self / Separate / Expired)",
          },
          propertyUsage: {
            type: "string",
            title:
              "Property Usage after Purchase (Self-Occupancy / Investment / Renting / Others)",
          },
          comments: {
            type: "string",
            title: "Comments / Observations of the Case",
            ui: { widget: "textarea", rows: 3 },
          },
        },
      },
    },
    {
      id: "caseDetails",
      label: "Case Details",
      schema: {
        type: "object",
        properties: {
          dateOfCaseInitiated: {
            type: "string",
            title: "Date of Case Initiated",
          },
          dateOfAppointmentProvided: {
            type: "string",
            title: "Date of Appointment Provided",
          },
          initiatedAddress: {
            type: "string",
            title: "Initiated Address",
            ui: { widget: "textarea", rows: 2 },
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
          },
          purposeOfLoan: {
            type: "string",
            title: "Purpose of Loan",
          },
          profileInitiated: {
            type: "string",
            title: "Profile Initiated",
          },
          securityOffered: {
            type: "string",
            title: "Security Offered",
          },
          familyMembersDescription: {
            type: "string",
            title: "Family Members (Narrative)",
            ui: { widget: "textarea", rows: 3 },
          },
          latitude: { type: "string", title: "Latitude" },
          longitude: { type: "string", title: "Longitude" },
          region: { type: "string", title: "Region" },
          location: { type: "string", title: "Location" },
          branch: { type: "string", title: "Branch" },
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
                age: { type: "string", title: "Age" },
                qualification: { type: "string", title: "Qualification" },
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
          applicantEducation: {
            type: "string",
            title: "Applicant’s Education",
          },
          nativePlace: { type: "string", title: "Native Place" },
          businessName: { type: "string", title: "Business / Employer Name" },
          businessType: {
            type: "string",
            title: "Business Type / Constitution",
          },
          yearsOfExperience: {
            type: "string",
            title: "Years of Experience",
          },
          machineryUsed: {
            type: "string",
            title: "Machinery / Equipment Used",
          },
          natureOfBusiness: {
            type: "string",
            title: "Nature of Business / Services",
            ui: { widget: "textarea", rows: 3 },
          },
          dailyOutputRates: {
            type: "string",
            title: "Daily Output & Rates",
          },
          materialsPurchased: {
            type: "string",
            title: "Materials Purchased",
          },
          workersAndSalaries: {
            type: "string",
            title: "Number of Workers & Salaries",
          },
          customers: { type: "string", title: "Customers" },
          businessPremises: {
            type: "string",
            title: "Business Premises (Owned / Rented / Relative)",
          },
          rentPaid: { type: "string", title: "Rent Paid (if any)" },
          neighborEnquiryResult: {
            type: "string",
            title: "Neighbour Enquiry Result",
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
          businessVintageDocumentsProvided: {
            type: "string",
            title: "Business Vintage Documents Provided (Yes/No)",
          },
          businessNameBoard: {
            type: "string",
            title: "Business Name Board (Permanent / Temporary)",
          },
          workersPresentAtVisit: {
            type: "string",
            title: "Workers Present at Time of Visit",
          },
          kachaRecordsProvided: {
            type: "string",
            title: "Kacha Records Provided (Yes/No)",
          },
          upiPaymentsProvided: {
            type: "string",
            title: "UPI Payments Provided (Yes/No)",
          },
          addressMatch: {
            type: "string",
            title: "Address Match (Initiated vs. Visited)",
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
      id: "incomeReferences",
      label: "Income & References",
      schema: {
        type: "object",
        properties: {
          netMarginPercent: {
            type: "string",
            title: "Net Margin %",
          },
          otherIncomes: {
            type: "string",
            title: "Other Incomes",
          },
          spouseIncome: {
            type: "string",
            title: "Spouse Income",
          },
          referencesSummary: {
            type: "string",
            title: "Reference Details",
            ui: { widget: "textarea", rows: 2 },
          },
          referenceContacts: {
            type: "string",
            title: "References (Name & Contact No.)",
            ui: { widget: "textarea", rows: 2 },
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
          assets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                assetType: { type: "string", title: "Asset Type" },
                description: { type: "string", title: "Description" },
                marketValue: { type: "string", title: "Market Value" },
                ownerName: { type: "string", title: "Owner Name" },
              },
            },
          },
        },
      },
    },
    {
      id: "existingLoans",
      label: "Existing Loans",
      schema: {
        type: "object",
        properties: {
          existingLoans: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: { type: "string", title: "Bank Name" },
                typeOfLoan: { type: "string", title: "Type of Loan" },
                loanAmount: { type: "string", title: "Loan Amount" },
                emi: { type: "string", title: "EMI" },
                status: {
                  type: "string",
                  title: "Status",
                  enum: ["Open", "Closed"],
                },
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
          bankingDetails: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bankName: { type: "string", title: "Bank Name" },
                accountType: {
                  type: "string",
                  title: "Account Type",
                  enum: ["Savings", "Current", "CC/OD"],
                },
                relationshipSinceYears: {
                  type: "string",
                  title: "No. of Years",
                },
              },
            },
          },
        },
      },
    },
    {
      id: "pdOfficerDetails",
      label: "PD Officer Details",
      schema: {
        type: "object",
        properties: {
          pdOfficerName: { type: "string", title: "Name of PD Officer" },
          dateOfDiscussion: { type: "string", title: "Date of Discussion" },
          pdOfficerSignature: {
            type: "string",
            title: "Signature of PD Officer",
          },
        },
      },
    },
  ],
} as const;

export default iiflSchema;
