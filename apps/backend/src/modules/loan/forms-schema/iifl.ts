export const iiflSchema = {
  id: 19,
  bankName: "IIFL",
  sections: [
    {
      id: "prospectNo",
      label: "Prospect No.",
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Name",
            readOnly: true,
          },
          maritalStatusSingleMarriedDivorcedOthers: {
            type: "string",
            title: "Marital Status (Single / Married / Divorced / Others)",
            enum: ["Single", "Married", "Divorced", "Others"],
          },
          educationalQualificationBelow10th10thPass12thPassDiplomaItiGraduatePgProfessionalCertification:
            {
              type: "string",
              title:
                "Educational Qualification (Below 10th / 10th Pass / 12th Pass / Diploma/ITI / Graduate / PG/Professional Certification)",
            },
        },
        required: ["name"],
      },
      required: true,
    },
    {
      id: "categoryGeneralScStObcOthers",
      label: "Category (General / SC / ST / OBC / Others)",
      schema: {
        type: "object",
        properties: {
          numberOfDependents: {
            type: "integer",
            title: "Number of Dependents",
          },
          children: {
            type: "string",
            title: "Children",
          },
          adults: {
            type: "string",
            title: "Adults",
          },
          others: {
            type: "string",
            title: "Others",
          },
          numberOfYearsInCurrentResidence113355Years: {
            type: "integer",
            title:
              "Number of Years in Current Residence (<=1 / 1–3 / 3–5 / >5 Years)",
          },
          currentResidenceHouseSize1rk1bhk2bhk2bhk: {
            type: "string",
            title: "Current Residence House Size (1RK / 1BHK / 2BHK / >2BHK)",
          },
          if1YearThenPreviousAddress: {
            type: "string",
            title: "If <1 Year, then Previous Address",
          },
          numberOfYearsStayedAtThatAddress: {
            type: "integer",
            title: "Number of Years Stayed at that Address",
          },
          numberOfYearsInCurrentCity3Years3Years: {
            type: "integer",
            title: "Number of Years in Current City (<=3 Years / >3 Years)",
          },
          if3YearsPreviousCity: {
            type: "integer",
            title: "If <=3 Years – Previous City",
          },
          numberOfYearsInThatCity: {
            type: "integer",
            title: "Number of Years in that City",
          },
          reasonForChange: {
            type: "string",
            title: "Reason for Change",
          },
          parentsStayingWithSelfSeparateExpired: {
            type: "string",
            title: "Parents Staying With? (Self / Separate / Expired)",
          },
          usageOfPropertyAfterPurchaseSelfOccupancyInvestmentRentingPurposeOthers:
            {
              type: "string",
              title:
                "Usage of Property after Purchase (Self-Occupancy / Investment / Renting Purpose / Others)",
            },
          briefCommentsObservationOfTheCase: {
            type: "string",
            title: "Brief Comments / Observation of the Case",
          },
        },
      },
      required: true,
    },
    {
      id: "dateOfCaseInitiated",
      label: "Date of Case Initiated",
      schema: {
        type: "object",
        properties: {
          dateOfAppointmentProvided: {
            type: "string",
            title: "Date of Appointment Provided",
            format: "date",
          },
          initiatedAddress: {
            type: "string",
            title: "Initiated Address",
          },
          visitedAddress: {
            type: "string",
            title: "Visited Address",
          },
          residentialAddress: {
            type: "string",
            title: "Residential Address",
          },
          contactInformation: {
            type: "string",
            title: "Contact Information",
            pattern: "^[0-9]{10}$",
          },
          loanAmountRequired: {
            type: "number",
            title: "Loan Amount Required",
            formatter: {
              useIndianFormat: true,
              locale: "en-IN",
              maxDecimalPlaces: 2,
              minDecimalPlaces: 0,
            },
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
          familyMembersApplicantSpouseChildrenParentsInLawsEtcDescriptive: {
            type: "string",
            title:
              "Family Members (Applicant, Spouse, Children, Parents, In-laws, etc. — descriptive)",
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
      required: true,
    },
    {
      id: "familyDetails",
      label: "Family Details (Structured)",
      schema: {
        type: "object",
        properties: {
          familyMembers: {
            type: "array",
            title: "Family Members",
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
                  type: "integer",
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
        },
      },
      required: true,
    },
    {
      id: "applicantSProfile",
      label: "Applicant’s Profile",
      schema: {
        type: "object",
        properties: {
          applicantSEducation: {
            type: "string",
            title: "Applicant’s Education",
          },
          nativePlace: {
            type: "string",
            title: "Native Place",
          },
          businessName: {
            type: "string",
            title: "Business Name",
          },
          businessTypeProprietorshipEtc: {
            type: "string",
            title: "Business Type (Proprietorship, etc.)",
          },
          yearsOfExperience: {
            type: "integer",
            title: "Years of Experience",
          },
          machineryUsedEGSewingMachines: {
            type: "string",
            title: "Machinery Used (e.g., Sewing Machines)",
          },
          natureOfBusinessServices: {
            type: "string",
            title: "Nature of Business / Services",
          },
          dailyOutputRates: {
            type: "string",
            title: "Daily Output & Rates",
          },
          materialsPurchased: {
            type: "string",
            title: "Materials Purchased",
          },
          noOfWorkersSalary: {
            type: "string",
            title: "No. of Workers & Salary",
          },
          customers: {
            type: "string",
            title: "Customers",
          },
          businessPremisesOwnedRentedRelativeS: {
            type: "string",
            title: "Business Premises (Owned/Rented/Relative’s)",
          },
          rentPaidIfAny: {
            type: "number",
            title: "Rent Paid (if any)",
          },
          neighborEnquiryResult: {
            type: "string",
            title: "Neighbor Enquiry Result",
          },
        },
      },
      required: true,
    },
    {
      id: "concernsObservations",
      label: "Concerns / Observations",
      schema: {
        type: "object",
        properties: {
          businessVintageDocumentsProvidedYN: {
            type: "string",
            title: "Business Vintage Documents Provided (Y/N)",
          },
          businessNameBoardPermanentTemporary: {
            type: "string",
            title: "Business Name Board (Permanent/Temporary)",
          },
          workersPresentAtTimeOfVisit: {
            type: "string",
            title: "Workers Present at Time of Visit",
          },
          kachaRecordsProvidedYN: {
            type: "string",
            title: "Kacha Records Provided (Y/N)",
          },
          upiPaymentsProvidedYN: {
            type: "string",
            title: "UPI Payments Provided (Y/N)",
          },
          addressMatchMismatchInitiatedVsVisited: {
            type: "string",
            title: "Address Match/Mismatch (Initiated vs. Visited)",
          },
          otherObservationsBusinessActivityStockMachines: {
            type: "string",
            title: "Other Observations (Business Activity, Stock, Machines)",
          },
        },
      },
      required: true,
    },
    {
      id: "netMargin",
      label: "Net Margin %",
      schema: {
        type: "object",
        properties: {
          otherIncomes: {
            type: "string",
            title: "Other Incomes",
          },
          spouseIncomeAutoDrivingEtc: {
            type: "number",
            title: "Spouse Income (Auto Driving, etc.)",
          },
          referenceDetails: {
            type: "string",
            title: "Reference Details",
          },
          referencesNameContactNo: {
            type: "string",
            title: "References (Name & Contact No.)",
            pattern: "^[0-9]{10}$",
          },
        },
      },
      required: true,
    },
    {
      id: "assetsDetails",
      label: "Assets Details",
      schema: {
        type: "object",
        properties: {
          assets: {
            type: "array",
            title: "Assets Owned",
            items: {
              type: "object",
              properties: {
                assetType: {
                  type: "string",
                  title: "Asset Type",
                },
                description: {
                  type: "string",
                  title: "Description",
                },
                marketValue: {
                  type: "string",
                  title: "Market Value",
                },
                ownerName: {
                  type: "string",
                  title: "Owner Name",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "existingLoans",
      label: "Existing Loans",
      schema: {
        type: "object",
        properties: {
          existingLoans: {
            type: "array",
            title: "Existing Loans",
            items: {
              type: "object",
              properties: {
                bankName: {
                  type: "string",
                  title: "Bank Name",
                },
                typeOfLoan: {
                  type: "string",
                  title: "Type of Loan",
                },
                loanAmount: {
                  type: "string",
                  title: "Loan Amount",
                },
                emi: {
                  type: "string",
                  title: "EMI",
                },
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
      required: true,
    },
    {
      id: "bankingDetails",
      label: "Banking Details",
      schema: {
        type: "object",
        properties: {
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
                  title: "Account Type",
                  enum: ["Savings", "Current", "CC/OD"],
                },
                noOfYears: {
                  type: "integer",
                  title: "No. of Years",
                },
              },
            },
          },
        },
      },
      required: true,
    },
    {
      id: "pdOfficerDetails",
      label: "PD Officer Details",
      schema: {
        type: "object",
        properties: {
          nameOfPdOfficer: {
            type: "string",
            title: "Name of PD Officer",
          },
          dateOfDiscussion: {
            type: "string",
            title: "Date of Discussion",
          },
          signatureOfPdOfficer: {
            type: "string",
            title: "Signature of PD Officer",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default iiflSchema;
