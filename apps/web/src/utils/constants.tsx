import { read } from "fs";

export const getFormFields = (formKey: string, currentTab: string) => {
  switch (formKey) {
    case "basicDetails":
      return [
        {
          name: "verificationType",
          label: "Verification Type",
          type: "input",
          readOnly: true,
          required: true,
          value:
            currentTab === "PermanentAddress"
              ? "Permanent Address"
              : currentTab === "CurrentAddress"
                ? "Current Address"
                : currentTab === "Work"
                  ? "Work Verification"
                  : "Final Observations",
        },
        {
          name: "applicationNumber",
          label: "Application Number",
          type: "input",
          readOnly: true,
          required: true,
        },
        {
          name: "applicantName",
          label: "Applicant Name",
          type: "input",
          readOnly: true,
          required: true,
        },
        {
          name: "applicantMaritalStatus",
          label: "Marital Status",
          type: "select",
          options: ["Single", "Married", "Divorced", "Others"],
          required: true,
        },
        {
          name: "applicantMaritalStatusOther",
          label: "Specify Marital Status",
          type: "input",
          // showWhen: (values) => values.applicantMaritalStatus === 'Others',
          // required: true
        },
        {
          name: "educationQualification",
          label: "Education Qualification",
          type: "select",
          options: [
            "Below 10th",
            "10th pass",
            "12th pass",
            "Diploma/ITI certification",
            "Graduate",
            "PG/Professional Certification",
          ],
          required: true,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["General", "SC", "ST", "OBC", "Others"],
          required: true,
        },
        {
          name: "categoryOther",
          label: "Specify Category",
          type: "input",
          // showWhen: (values) => values.category === 'Others',
          // required: true
        },
      ];
    // case "applicantInformation":
    //   return [
    //     { name: "applicantName", label: "Applicant Name", type: "input" },
    //     { name: "applicantAge", label: "Applicant Age", type: "input" },
    //     { name: "applicantGender", label: "Applicant Gender", type: "select", options: ["Male", "Female", "Other"] },
    //     { name: "applicantMaritalStatus", label: "Marital Status", type: "select", options: ["Single", "Married", "Divorced", "Widowed"] },
    //     { name: "applicantEducation", label: "Education Level", type: "input" },
    //   ];
    case "residenceDetails":
      return [
        {
          name: "residenceStatus",
          label: "Residence Status",
          type: "select",
          options: ["Owned", "Rented", "Leased"],
          required: true,
        },
        { name: "rentDetails", label: "Rent Details", type: "input" },
        {
          name: "residenceType",
          label: "Type of Residence",
          type: "select",
          options: ["House", "Apartment", "Villa"],
          required: true,
        },
        {
          name: "constructionQuality",
          label: "Construction Quality",
          type: "select",
          options: ["Excellent", "Good", "Average", "Poor"],
          required: true,
        },
        {
          name: "standardOfLiving",
          label: "Standard of Living",
          type: "select",
          options: ["Excellent", "Good", "Average", "Poor"],
          required: true,
        },
        {
          name: "locationCategory",
          label: "Location Category",
          type: "select",
          options: ["Urban", "Semi-Urban", "Rural"],
          required: true,
        },
        {
          name: "localityType",
          label: "Locality Type",
          type: "select",
          options: ["Residential", "Commercial", "Mixed"],
          required: true,
        },
        {
          name: "accessibility",
          label: "Accessibility",
          type: "select",
          options: ["Easy", "Moderate", "Difficult"],
          required: true,
        },
        {
          name: "houseArea",
          label: "House Area",
          type: "input",
          required: true,
        },
        {
          name: "yearsAtCurrentAddress",
          label: "Years at Current Address",
          type: "input",
          required: true,
        },
        {
          name: "nameplateVisible",
          label: "Nameplate Visible",
          type: "select",
          options: ["Yes", "No"],
          required: true,
        },
      ];
    case "familyEmploymentDetails":
      return [
        {
          name: "totalFamilyMembers",
          label: "Total Family Members",
          type: "input",
          required: true,
        },
        {
          name: "earningMembers",
          label: "No. of Earning Members",
          type: "input",
          required: true,
        },
        {
          name: "dependents",
          label: "No. of Dependents",
          type: "input",
          required: true,
        },
        {
          name: "isSpouseWorking",
          label: "Is Spouse Working",
          type: "select",
          options: ["Yes", "No"],
          required: true,
        },
        {
          name: "spouseEmploymentDetails",
          label: "Spouse's Employment Details",
          type: "input",
        },
        {
          name: "assetsObserved",
          label: "Assets Observed",
          type: "input",
          required: true,
        },
      ];
    case "addressVerification":
      return [
        {
          name: "address",
          label: "Address Type",
          type: "select",
          options: ["Residence", "Office", "Business", "Other"],
          required: true,
        },
        {
          name: "addressCategory",
          label: "Address Category",
          type: "select",
          options: ["Urban", "Rural", "Semi-Urban"],
          required: true,
        },
        {
          name: "addressDetails",
          label: "Address Details",
          type: "textarea",
          required: true,
        },
        {
          name: "numberOfYearsAtCurrentResidence",
          label: "No. of Years at Current Residence",
          type: "select",
          options: ["<=1 year", "1-3 years", "3-5 years", ">5 years"],
          required: true,
        },
        { name: "previousAddress", label: "Previous Address", type: "input" },
        {
          name: "previousAddressYears",
          label: "No. of Years at Previous Address",
          type: "input",
        },
        {
          name: "numberOfYearsAtCurrentCity",
          label: "No. of Years at Current City",
          type: "select",
          options: ["<=3 years", ">3 years"],
          required: true,
        },
        { name: "previousCity", label: "Previous City", type: "input" },
        {
          name: "numberOfYearsAtPreviousCity",
          label: "No. of Years at Previous City",
          type: "input",
        },
        {
          name: "reasonForChange",
          label: "Reason for Change",
          type: "textarea",
        },
        { name: "geoTag", label: "Geo Tag", type: "input", required: true },
      ];
    case "thirdPartyCheck":
      return [
        {
          name: "tpcName",
          label: "Name of TPC/Neighbor",
          type: "input",
          required: true,
        },
        {
          name: "mobileNumber",
          label: "Mobile Number",
          type: "input",
          required: true,
        },
        {
          name: "relationship",
          label: "Relationship to Applicant",
          type: "select",
          options: ["Neighbor", "Friend", "Local Shop Owner", "Other"],
          required: true,
        },
        {
          name: "feedbackStatus",
          label: "Feedback Status",
          type: "select",
          options: ["Positive", "Negative", "Could Not Confirm"],
          required: true,
        },
        {
          name: "comments",
          label: "Comments/Remarks",
          type: "textarea",
          required: true,
        },
      ];
    case "finalObservations":
      return [
        {
          name: "cooperativeness",
          label: "Cooperativeness of Applicant",
          type: "select",
          options: ["Polite", "Neutral", "Rude", "Not Met"],
        },
        {
          name: "overallStatus",
          label: "Overall Status",
          type: "select",
          options: ["Positive", "Negative", "Referred", "Fraud"],
        },
        { name: "remarks", label: "Remarks", type: "textarea" },
      ];
    case "officeVerification":
      return [
        {
          name: "applicantName",
          label: "Name of the Applicant",
          type: "input",
        },
        { name: "bankName", label: "Name of the Bank", type: "input" },
        { name: "prospectNumber", label: "Prospect Number", type: "input" },
        { name: "purposeOfLoan", label: "Purpose of Loan", type: "input" },
        { name: "loanAmount", label: "Loan Amount", type: "input" },
        { name: "tenure", label: "Tenure", type: "input" },
        { name: "panNumber", label: "PAN Number", type: "input" },
        { name: "aadharNumber", label: "Aadhar Number", type: "input" },
        { name: "qualification", label: "Qualification", type: "input" },
        {
          name: "currentOfficeName",
          label: "Name of Current Working Office",
          type: "input",
        },
        { name: "officeAddress", label: "Office Address", type: "textarea" },
        {
          name: "yearsInCurrentJob",
          label: "Years in Current Job",
          type: "input",
        },
        {
          name: "totalWorkExperience",
          label: "Total Work Experience",
          type: "input",
        },
        { name: "companySize", label: "Company Size", type: "input" },
        {
          name: "natureOfService",
          label: "Nature of Service/Business",
          type: "input",
        },
        {
          name: "officeLocality",
          label: "Locality of Office Premises",
          type: "select",
          options: ["Residential", "Commercial", "Industry"],
        },
        { name: "idCardNumber", label: "ID Card Number", type: "input" },
        { name: "designation", label: "Designation", type: "input" },
        {
          name: "salaryMode",
          label: "Mode of Salary",
          type: "select",
          options: ["Cash", "Online"],
        },
        {
          name: "employerType",
          label: "Type of Employer",
          type: "select",
          options: ["Government", "Private"],
        },
        { name: "grossSalary", label: "Gross Salary per Month", type: "input" },
        { name: "netSalary", label: "Net Salary per Month", type: "input" },
        {
          name: "previousCompanyName",
          label: "Previous Company Name",
          type: "input",
        },
        { name: "workExperience", label: "Work Experience", type: "input" },
        { name: "existingLoans", label: "Existing Loans", type: "textarea" },
        {
          name: "references",
          label: "References (Colleagues)",
          type: "textarea",
        },
      ];
    case "financialDetails":
      return [
        { name: "fundsRequired", label: "Funds Required", type: "input" },
        {
          name: "sourceOfOwnFunds",
          label: "Source of Own Funds",
          type: "input",
        },
        { name: "purchaseCost", label: "Purchase Cost", type: "input" },
        { name: "savings", label: "Savings", type: "input" },
        {
          name: "constructionEstimate",
          label: "Construction Estimate",
          type: "input",
        },
        { name: "familyFriends", label: "Family/Friends", type: "input" },
        {
          name: "registrationCharges",
          label: "Registration/Stamp Duty Charges",
          type: "input",
        },
        {
          name: "otherLoanAmount",
          label: "Other Loan Amount Taken",
          type: "input",
        },
        { name: "otherExpenses", label: "Other Expenses", type: "input" },
        {
          name: "totalAmountSpent",
          label: "Total Amount Spent",
          type: "input",
        },
        {
          name: "totalTransactionCost",
          label: "Total Transaction Cost",
          type: "input",
        },
        {
          name: "paymentModeCash",
          label: "Mode of Payment to Seller (Cash)",
          type: "input",
        },
        {
          name: "paymentModeCheque",
          label: "Mode of Payment to Seller (Cheque)",
          type: "input",
        },
      ];
    default:
      return [];
  }
};
