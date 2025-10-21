export const yesBankSchema = {
  id: 26,
  bankName: "Yes Bank",
  sections: [
    {
      id: "basicDetailsOfApplicant",
      label: "Basic Details of Applicant",
      schema: {
        type: "object",
        properties: {
          applicantBusinessEducationalBackgroundPastExperience: {
            type: "string",
            title:
              "Applicant – Business / Educational background / Past experience",
          },
          coApplicantBusinessEmploymentEducationalBackgroundPastExperience: {
            type: "string",
            title:
              "Co-Applicant – Business / Employment / Educational background / Past experience",
          },
          parentsOccupationBusinessEmploymentBackground: {
            type: "string",
            title: "Parents Occupation/Business/Employment background",
          },
          detailsOfChildrenStudyingWorking: {
            type: "string",
            title: "Details of children (studying/working)",
          },
          siblingsBusinessEmploymentBackgroundIfResidingTogether: {
            type: "string",
            title:
              "Siblings Business/Employment background (if residing together)",
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
      id: "selfEmployedProfileOccupationalDetails",
      label: "Self Employed Profile – Occupational Details",
      schema: {
        type: "object",
        properties: {
          nameOfTheBusinessEmployment: {
            type: "string",
            title: "Name of the Business / Employment",
          },
          constitutionOfBusinessEntityProprietorshipPartnershipLtdCo: {
            type: "string",
            title:
              "Constitution of Business Entity (Proprietorship, Partnership, Ltd. Co.)",
          },
          nameOfProprietorPartnersShareholdersWithShareOfEach: {
            type: "number",
            title:
              "Name of Proprietor, Partners/Shareholders with % share of each",
          },
          noOfYearsInCurrentBusiness: {
            type: "integer",
            title: "No of Years in Current Business",
          },
          businessProfile: {
            type: "string",
            title: "Business profile",
          },
          whetherGstRegisteredIfYesSinceWhenGstRegistrationExist: {
            type: "string",
            title:
              "Whether GST registered (if Yes, since when GST registration exist)",
          },
          detailsOfAnyOtherProofOfBusinessExistenceStabilityAvailableVerifiedDuringVisit:
            {
              type: "string",
              title:
                "Details of any other proof of business existence/stability available/verified during visit",
            },
          averageMonthlySalesReceipts: {
            type: "string",
            title: "Average Monthly sales/receipts",
          },
          averageMonthlyPurchase: {
            type: "string",
            title: "Average monthly purchase",
          },
          grossMarginOnTheOnGoodsSold: {
            type: "number",
            title: "Gross margin on the on goods sold",
          },
          overheadsToRunTheBusinessIndirectExpenses: {
            type: "string",
            title: "Overheads to run the business (Indirect expenses)",
          },
          netMonthlyProfitFromBusiness: {
            type: "number",
            title: "Net monthly profit from business",
          },
          stockLevel: {
            type: "string",
            title: "Stock level",
          },
          descriptionAboutMajorCustomersAlongWithCreditTerms: {
            type: "string",
            title: "Description about major customers along with credit terms",
          },
          descriptionAboutMajorSuppliersAlongWithCreditTerms: {
            type: "string",
            title: "Description about major suppliers along with credit terms",
          },
          businessSetUpDetails: {
            type: "string",
            title: "Business set up details",
          },
          infrastructureAndManpowerDetailsToIncludeBusinessFactoryDetailsPlantCapacityUtilizationAndStaffStrengthEtc:
            {
              type: "string",
              title:
                "Infrastructure and manpower details (to include Business / factory details, plant capacity utilization and staff strength etc)",
            },
          detailsOfOtherOwnedAssetsPropertyLandEtcInvestmentDetailsFdMfShareEtc:
            {
              type: "string",
              title:
                "Details of other owned Assets (Property, Land etc) / Investment Details (FD, MF, Share etc)",
            },
          detailsOfOtherSourceOfIncomeRentalIncomeAgriIncomeInterestIncomeEtc: {
            type: "number",
            title:
              "Details of other Source of Income (Rental income, Agri income, Interest income etc)",
          },
          monthlyTotalHouseholdExpenses: {
            type: "string",
            title: "Monthly total Household expenses",
          },
          collateralDetailsForMlapCaptureTypeOccupancyStatusYearOfPurchaseParentalOwnedEtc:
            {
              type: "integer",
              title:
                "Collateral Details (for MLAP) – Capture Type, Occupancy status, Year of purchase, Parental owned etc",
            },
          endUseForMlapMlapEndUseInDetailInCaseOfBtLoanLoanConsolidationCaptureEndUseOfEarlierLoansForLcpCaptureCostAvSourceOfOcrEtc:
            {
              type: "string",
              title:
                "END USE (FOR MLAP) – MLAP (End use in detail), (In case of BT Loan/Loan consolidation, capture end use of earlier loans), (For LCP - capture Cost, AV, source of OCR etc)",
            },
        },
      },
      required: true,
    },
    {
      id: "refCheckStatusPositiveNegativeNeutral",
      label: "Ref Check status (Positive, Negative, Neutral)",
      schema: {
        type: "object",
        properties: {
          finalPdComment: {
            type: "string",
            title: "Final PD Comment",
          },
          interviewerSOverallCommentsAlongWithExplanations: {
            type: "string",
            title: "Interviewer’s overall comments, along with explanations",
          },
          levelOfActivityStocksObservedAlongWithOtherObservations: {
            type: "string",
            title:
              "Level of Activity & Stocks observed Along with other Observations",
          },
          remarksForPositiveNegativeAndReferredCases: {
            type: "string",
            title: "Remarks for Positive, Negative and Referred Cases",
          },
          nameOfTheYblEmployee: {
            type: "string",
            title: "Name of the YBL Employee",
          },
          designation: {
            type: "string",
            title: "Designation",
          },
          empId: {
            type: "string",
            title: "EMP ID",
          },
          signature: {
            type: "string",
            title: "Signature",
          },
          pdAgencyInterviewerSName: {
            type: "string",
            title: "PD agency Interviewer’s Name",
          },
          reportProcessedBy: {
            type: "string",
            title: "Report Processed By",
          },
          annexure1ForAfhlCases: {
            type: "string",
            title: "Annexure 1 – for AFHL Cases",
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
  ],
} as const;
export default yesBankSchema;
