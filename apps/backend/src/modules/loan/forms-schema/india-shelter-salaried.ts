export const indiaShelterSalariedSchema = {
  id: 22,
  bankName: "India Shelter Salaried",
  sections: [
    {
      id: "general",
      label: "General",
      schema: {
        type: "object",
        properties: {
          branch: {
            type: "string",
            title: "Branch",
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
        },
      },
      required: true,
    },
    {
      id: "loanProductHlLap",
      label: "Loan Product (HL / LAP)",
      schema: {
        type: "object",
        properties: {
          toWhomYouMeet: {
            type: "string",
            title: "To Whom you meet?",
          },
          nameOfTheApplicantWithDob: {
            type: "string",
            title: "Name of the Applicant with DOB",
          },
          name: {
            type: "string",
            title: "Name",
          },
          dob: {
            type: "string",
            title: "DOB",
          },
        },
      },
      required: true,
    },
    {
      id: "maritalStatusSingleMarriedDivorcedOther",
      label: "Marital Status (Single / Married / Divorced / Other)",
      schema: {
        type: "object",
        properties: {
          nameOfTheSpouseWithDob: {
            type: "string",
            title: "Name of the Spouse with DOB",
          },
          name: {
            type: "string",
            title: "Name",
          },
          dob: {
            type: "string",
            title: "DOB",
          },
          doesTheSpouseWorkIfYesThenGiveBrief: {
            type: "string",
            title: "Does the Spouse Work (If yes then give brief)",
          },
          qualificationBelow1010thPass12thPassDiplomaItiCertificationGraduatePgProfessionalCertification:
            {
              type: "string",
              title:
                "Qualification (Below 10 / 10th Pass / 12th Pass / Diploma / ITI Certification / Graduate / PG / Professional Certification)",
            },
        },
      },
      required: true,
    },
    {
      id: "totalNoOfFamilyMembers",
      label: "Total No. of Family Members",
      schema: {
        type: "object",
        properties: {
          noOfNonEarningMembersDependants: {
            type: "integer",
            title: "No of non-earning members / dependants",
          },
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
        },
      },
      required: true,
    },
    {
      id: "address",
      label: "Address",
      schema: {
        type: "object",
        properties: {
          noOfYearsAtCurrentResidence: {
            type: "number",
            title: "No of Years at Current Residence",
          },
          areaInSqFt: {
            type: "string",
            title: "Area (in Sq ft)",
          },
          monthlyRentSecurityDepositIfRented: {
            type: "number",
            title: "Monthly Rent & Security Deposit (if Rented)",
          },
          purchasePriceMvIfOwned: {
            type: "number",
            title: "Purchase Price & MV (if owned)",
          },
          numberOfYearsInCurrentCity3Years3Years: {
            type: "number",
            title: "Number of Years in Current City (<=3 Years / >3 Years)",
          },
        },
      },
      required: true,
    },
    {
      id: "creditCardDetails",
      label: "Credit Card details",
      schema: {
        type: "object",
        properties: {
          monthlyHouseholdExpensesRs: {
            type: "string",
            title: "Monthly Household expenses (Rs.)",
          },
          existingRelationshipWithIndiashelter: {
            type: "string",
            title: "Existing Relationship with Indiashelter",
          },
        },
      },
      required: true,
    },
    {
      id: "employerDetails",
      label: "Employer Details",
      schema: {
        type: "object",
        properties: {
          employerName: {
            type: "string",
            title: "Employer Name",
          },
        },
      },
      required: true,
    },
    {
      id: "employerAddress",
      label: "Employer Address",
      schema: {
        type: "object",
        properties: {
          designation: {
            type: "string",
            title: "Designation",
          },
          currentMonthlySalary: {
            type: "number",
            title: "Current Monthly Salary",
          },
          gross: {
            type: "string",
            title: "Gross",
          },
          net: {
            type: "string",
            title: "Net",
          },
          noOfYrsInPresentEmployment: {
            type: "integer",
            title: "No of yrs in present employment",
          },
        },
      },
      required: true,
    },
    {
      id: "applicantSJobProfile",
      label: "Applicant's Job Profile",
      schema: {
        type: "object",
        properties: {
          aboutTheCompany: {
            type: "string",
            title: "About the company",
          },
        },
      },
      required: true,
    },
    {
      id: "customerLocationOfficeBusinessGeoTagLatitudeLongitude",
      label:
        "Customer Location (Office / Business GEO Tag) (Latitude & Longitude)",
      schema: {
        type: "object",
        properties: {
          previousEmployment: {
            type: "string",
            title: "Previous Employment",
          },
        },
      },
      required: true,
    },
    {
      id: "familyMemberDetails",
      label: "Family Member Details",
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Name",
          },
          relationWithApplicant: {
            type: "string",
            title: "Relation with Applicant",
          },
          ageYrs: {
            type: "integer",
            title: "Age (yrs)",
          },
          occupationJobBusiness: {
            type: "string",
            title: "Occupation (Job / Business)",
          },
          educationalQualificationAlsoMentionIfGovtOrPrivateInstitution: {
            type: "string",
            title:
              "Educational Qualification (Also mention if Govt. or Private institution)",
          },
          contactNo: {
            type: "string",
            title: "Contact no",
            pattern: "^[0-9]{10}$",
          },
          stayingWithApplicantYesNo: {
            type: "integer",
            title: "Staying with Applicant (yes/no)",
          },
        },
      },
      required: true,
    },
    {
      id: "loanType",
      label: "Loan Type",
      schema: {
        type: "object",
        properties: {
          sanctionAmt: {
            type: "string",
            title: "Sanction Amt.",
          },
          emi: {
            type: "number",
            title: "EMI",
          },
          noOfEmiPaid: {
            type: "number",
            title: "No. of EMI Paid",
          },
          balTenure: {
            type: "integer",
            title: "Bal. Tenure",
          },
        },
      },
      required: true,
    },
    {
      id: "bankName",
      label: "Bank Name",
      schema: {
        type: "object",
        properties: {
          accountNo: {
            type: "integer",
            title: "Account no.",
          },
          accountTypeSavingCurrent: {
            type: "number",
            title: "Account Type (Saving / Current)",
          },
          branchName: {
            type: "string",
            title: "Branch Name",
          },
          operatingSinceYrs: {
            type: "string",
            title: "Operating Since (Yrs)",
          },
        },
      },
      required: true,
    },
    {
      id: "purposeOfLoan",
      label: "Purpose of Loan",
      schema: {
        type: "object",
        properties: {
          flatPurchase: {
            type: "string",
            title: "Flat Purchase",
          },
          housePurchase: {
            type: "string",
            title: "House Purchase",
          },
          plotPurchase: {
            type: "string",
            title: "Plot Purchase",
          },
          constructionOfResidentialHouseProperty: {
            type: "string",
            title: "Construction of Residential House Property",
          },
          businessDevelopment: {
            type: "string",
            title: "Business development",
          },
          improvementExtension: {
            type: "string",
            title: "Improvement/Extension",
          },
          balanceTransfer: {
            type: "number",
            title: "Balance Transfer",
          },
          plotConstruction: {
            type: "string",
            title: "Plot + Construction",
          },
        },
      },
      required: true,
    },
    {
      id: "minimumLoanAmountRequiredRs",
      label: "Minimum Loan Amount Required (Rs.)",
      schema: {
        type: "object",
        properties: {
          tenureRequired: {
            type: "integer",
            title: "Tenure required",
          },
          comfortableEmi: {
            type: "number",
            title: "Comfortable EMI",
          },
        },
      },
      required: true,
    },
    {
      id: "collateralDetails",
      label: "Collateral Details",
      schema: {
        type: "object",
        properties: {
          statusOfPropertyToBePurchasedReadyToMoveUnderConstructionConstructionYetToStart:
            {
              type: "string",
              title:
                "Status of Property to be Purchased (Ready to move / Under Construction / Construction Yet to Start)",
            },
        },
      },
      required: true,
    },
    {
      id: "propertyAddress",
      label: "Property Address",
      schema: {
        type: "object",
        properties: {
          areaInSqft: {
            type: "string",
            title: "Area (in Sqft)",
          },
        },
      },
      required: true,
    },
    {
      id: "agreementValue",
      label: "Agreement value",
      schema: {
        type: "object",
        properties: {
          ownContribution: {
            type: "string",
            title: "Own Contribution",
          },
        },
      },
      required: true,
    },
    {
      id: "referencesDetails",
      label: "References Details",
      schema: {
        type: "object",
        properties: {
          reference1: {
            type: "string",
            title: "Reference 1",
          },
          name: {
            type: "string",
            title: "Name",
          },
        },
      },
      required: true,
    },
    {
      id: "address",
      label: "Address",
      schema: {
        type: "object",
        properties: {
          relationship: {
            type: "string",
            title: "Relationship",
          },
          contactNumber: {
            type: "string",
            title: "Contact Number",
            pattern: "^[0-9]{10}$",
          },
        },
      },
      required: true,
    },
    {
      id: "emailAddress",
      label: "Email address",
      schema: {
        type: "object",
        properties: {
          noOfYearKnownTheApplicant: {
            type: "integer",
            title: "No of Year known the applicant",
          },
          reference2: {
            type: "string",
            title: "Reference 2",
          },
          name: {
            type: "string",
            title: "Name",
          },
        },
      },
      required: true,
    },
    {
      id: "address",
      label: "Address",
      schema: {
        type: "object",
        properties: {
          relationship: {
            type: "string",
            title: "Relationship",
          },
          contactNumber: {
            type: "string",
            title: "Contact Number",
            pattern: "^[0-9]{10}$",
          },
        },
      },
      required: true,
    },
    {
      id: "emailAddress",
      label: "Email address",
      schema: {
        type: "object",
        properties: {
          noOfYearKnownTheApplicant: {
            type: "integer",
            title: "No of Year known the applicant",
          },
        },
      },
      required: true,
    },
    {
      id: "tpcThirdPartyCheckDetails",
      label: "TPC (Third Party check) Details",
      schema: {
        type: "object",
        properties: {
          officeReferenceCheck: {
            type: "string",
            title: "Office Reference check",
          },
          name: {
            type: "string",
            title: "Name",
          },
          mobileNo: {
            type: "string",
            title: "Mobile No.",
            pattern: "^[0-9]{10}$",
          },
          knowingSinceMonthsYears: {
            type: "integer",
            title: "Knowing since (Months / Years)",
          },
          feedbackPositiveNegative: {
            type: "string",
            title: "Feedback (Positive / Negative)",
          },
          documentVerified: {
            type: "string",
            title: "Document Verified",
          },
          documentType: {
            type: "string",
            title: "Document Type",
          },
          originalCopyNotProvided: {
            type: "integer",
            title: "Original / Copy / Not Provided",
          },
        },
      },
      required: true,
    },
    {
      id: "detailsCrossCheckedYesNo",
      label: "Details Cross - Checked (Yes / No)",
      schema: {
        type: "object",
        properties: {
          commentsIfAny: {
            type: "string",
            title: "Comments (If any)",
          },
          toBeFilledByPdOfficer: {
            type: "string",
            title: "To be filled by PD Officer",
          },
        },
      },
      required: true,
    },
    {
      id: "caseWeakness",
      label: "Case Weakness",
      schema: {
        type: "object",
        properties: {
          pdStatusPositiveNegativeCreditRefer: {
            type: "string",
            title: "PD status (Positive / Negative / Credit Refer)",
          },
          nameOfPdOfficer: {
            type: "string",
            title: "Name of PD Officer",
          },
        },
      },
      required: true,
    },
    {
      id: "dateTimeOfVisit",
      label: "Date & Time of Visit",
      schema: {
        type: "object",
        properties: {
          signatureOfThePdOfficer: {
            type: "string",
            title: "Signature of the PD Officer",
          },
        },
      },
      required: true,
    },
  ],
} as const;
export default indiaShelterSalariedSchema;
