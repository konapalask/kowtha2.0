import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:18px 0";
const headerStyle =
  "background:#2e7d32;color:#fff;font-weight:700;text-transform:uppercase;font-size:14px;letter-spacing:0.6px;padding:10px;border:1px solid #ccc;text-align:center";
const subHeaderStyle =
  "background:#f7d8c7;color:#4a3426;font-weight:600;font-size:12px;padding:8px;border:1px solid #ccc;text-transform:uppercase";
const labelCellStyle =
  "background:#f4f6fb;font-weight:600;color:#1f2d3d;padding:8px;border:1px solid #d0d7de;vertical-align:top;width:25%";
const valueCellStyle =
  "padding:8px;border:1px solid #d0d7de;color:#2f3b52;vertical-align:top";
const centeredCellStyle = `${valueCellStyle};text-align:center;font-weight:600`;

const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some((entry) => hasValue(entry));
  if (typeof value === "object") {
    return Object.values(value).some((entry) => hasValue(entry));
  }
  return false;
};

const formatMultiline = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return String(value).replace(/\n+/g, "<br>");
};

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return formatMultiline(value);
  }
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
};

const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const renderList = (items: any[], fallback = "Not provided") => {
  const cleaned = ensureArray(items).filter((item) => hasValue(item));
  if (!cleaned.length) {
    return fallback;
  }
  return `<ul style="margin:6px 0 6px 16px;padding:0;">${cleaned
    .map(
      (item) =>
        `<li style="margin-bottom:4px;color:#2f3b52;line-height:1.45;">${formatMultiline(
          item
        )}</li>`
    )
    .join("")}</ul>`;
};

const renderKeyValueRow = (
  label: string,
  value: any,
  formatter?: (value: any) => string,
  options?: { colSpan?: number }
) => {
  const content = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colSpan || 1}">
        ${content}
      </td>
    </tr>
  `;
};

const renderTableHeader = (title: string) =>
  `<tr><th style="${headerStyle}" colspan="4">${title}</th></tr>`;

export const indiaShelterSalariedTemplate = (
  verificationData: any,
  html_data: any
) => {
  const general = verificationData.generalInfo || {};
  const basic = verificationData.basicDetails || {};
  const residence = verificationData.residenceDetails || {};
  const financial = verificationData.financialProfile || {};
  const loanPurpose = verificationData.loanPurpose || {};
  const collateral = verificationData.collateralDetails || {};
  const references = ensureArray(verificationData.references?.references);
  const employer = verificationData.employerDetails || {};
  const familyMembers = verificationData.familyMembers;
  const currentLoans = ensureArray(
    verificationData.currentLoanDetails?.currentLoans
  );
  const banking = ensureArray(verificationData.bankingDetails?.bankingAccounts);
  const tpcRefs = ensureArray(verificationData.tpcDetails?.officeReferences);
  const documents = ensureArray(
    verificationData.documentVerification?.documents
  );
  const pdReview = verificationData.pdOfficerReview || {};

  const dependentsRow = `
    <tr>
      <td style="${labelCellStyle}">Number of Dependents</td>
      <td style="${valueCellStyle}"><strong>Children:</strong> ${
        hasValue(basic.dependentsChildren)
          ? basic.dependentsChildren
          : "Not provided"
      }</td>
      <td style="${valueCellStyle}"><strong>Adults:</strong> ${
        hasValue(basic.dependentsAdults)
          ? basic.dependentsAdults
          : "Not provided"
      }</td>
      <td style="${valueCellStyle}"><strong>Others:</strong> ${
        hasValue(basic.dependentsOthers)
          ? basic.dependentsOthers
          : "Not provided"
      }</td>
    </tr>
  `;

  const generalTable = `
    <table style="${tableStyle}">
      ${renderTableHeader("PD SHEET – SALARIED")}
      ${renderKeyValueRow("Loan Number", general.loanNumber, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow("Branch", general.branch, undefined, { colSpan: 3 })}
    </table>
  `;

  const basicDetailsTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Basic Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Loan Product</td>
        <td style="${valueCellStyle}">${formatMultiline(basic.loanProduct)}</td>
        <td style="${labelCellStyle}">To Whom you meet?</td>
        <td style="${valueCellStyle}">${formatMultiline(
          basic.meetingPerson
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Applicant Name</td>
        <td style="${valueCellStyle}">${formatMultiline(
          basic.applicantName
        )}</td>
        <td style="${labelCellStyle}">Applicant DOB</td>
        <td style="${valueCellStyle}">${formatMultiline(basic.applicantDob)}</td>
      </tr>
      ${renderKeyValueRow("Marital Status", basic.maritalStatus, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow("Spouse Name", basic.spouseName, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow("Spouse DOB", basic.spouseDob, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Does the spouse work? (If yes then give brief)",
        basic.spouseWorkDetails,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow("Qualification", basic.qualification, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow("Category", basic.category, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Total No. of Family Members",
        basic.totalFamilyMembers,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "No. of non-earning members / dependents",
        basic.nonEarningMembers,
        undefined,
        { colSpan: 3 }
      )}
      ${dependentsRow}
    </table>
  `;

  const residenceTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Residence Address & details</th></tr>
      ${renderKeyValueRow("Address: ", residence.residenceAddress, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Years at Current Residence",
        residence.yearsAtCurrentResidence,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow("Area (in Sq ft)", residence.areaSqft, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Monthly Rent & Security Deposit (if rented)",
        residence.monthlyRentDeposit,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Purchase price & MV (if owned)",
        residence.purchasePriceMv,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Number of Years in Current City",
        residence.yearsInCurrentCity,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow("Other Income", financial.otherIncome, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Net Worth (Car / Property / Investments)",
        financial.netWorth,
        undefined,
        { colSpan: 3 }
      )}
       ${renderKeyValueRow(
         "Credit Card Details",
         "Rs. " + financial.creditCardDetails,
         undefined,
         { colSpan: 3 }
       )}
      ${renderKeyValueRow(
        "Monthly Household Expenses",
        financial.monthlyHouseholdExpenses,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Existing Relationship with Indiashelter",
        financial.existingRelationshipWithIndiashelter,
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;

  const loanPurposeTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Loan Details & Purpose</th></tr>
      ${renderKeyValueRow(
        "Purpose of Loan",
        renderList(loanPurpose.purposes, "Not provided"),
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Minimum Loan Amount Required",
        formatCurrency(loanPurpose.minimumLoanAmount),
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Tenure Required",
        formatMultiline(loanPurpose.tenureRequired),
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Comfortable EMI",
        formatCurrency(loanPurpose.comfortableEmi),
        undefined,
        { colSpan: 3 }
      )}
      
    </table>
  `;

  const collateralTable = `
  <table style="${tableStyle}">
    <tr><th style="${subHeaderStyle}" colspan="4">Collateral Details</th></tr>
    ${renderKeyValueRow(
      "Status of Property to be Purchased",
      collateral.propertyStatus,
      undefined,
      { colSpan: 3 }
    )}
    ${renderKeyValueRow(
      "Usage of Property after Purchase",
      renderList(collateral.usageAfterPurchase, "Not provided"),
      undefined,
      { colSpan: 3 }
    )}
    ${renderKeyValueRow(
      "Property Address",
      collateral.propertyAddress,
      undefined,
      { colSpan: 3 }
    )}
    ${renderKeyValueRow(
      "Area (in Sqft)",
      collateral.propertyAreaSqft,
      undefined,
      { colSpan: 3 }
    )}
    ${renderKeyValueRow(
      "Ownership of the property from how many years?",
      collateral.ownershipDuration,
      undefined,
      { colSpan: 3 }
    )}
    ${renderKeyValueRow(
      "Agreement Value",
      formatCurrency(collateral.agreementValue),
      undefined,
      { colSpan: 3 }
    )}
    ${renderKeyValueRow(
      "Own Contribution",
      formatCurrency(collateral.ownContribution),
      undefined,
      { colSpan: 3 }
    )}
    </table>
  `;

  const referencesTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="7">Reference Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Name</td>
        <td style="${labelCellStyle}">Address</td>
        <td style="${labelCellStyle}">Relationship</td>
        <td style="${labelCellStyle}">Contact Number</td>
        <td style="${labelCellStyle}">Email</td>
        <td style="${labelCellStyle}">Years Known</td>
      </tr>
      ${
        references.length
          ? references
              .map(
                (ref: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(ref.name)}</td>
            <td style="${valueCellStyle}">${formatMultiline(ref.address)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              ref.relationship
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              ref.contactNumber
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(ref.email)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              ref.yearsKnown
            )}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="6">Not provided</td></tr>`
      }
    </table>
  `;

  const employerTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Employer Details</th></tr>
      ${renderKeyValueRow("Employer Name", employer.employerName, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Employer Address",
        employer.employerAddress,
        undefined,
        { colSpan: 3 }
      )}
      
      ${renderKeyValueRow("Designation", employer.designation, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow(
        "Current Monthly Salary (Gross)",
        employer.salaryGross,
        formatCurrency,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Current Monthly Salary (Net)",
        employer.salaryNet,
        formatCurrency,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "No of yrs in present employment",
        employer.yearsInPresentEmployment,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Applicant's Job Profile",
        employer.jobProfile,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "About the company",
        employer.companyOverview,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Customer Location (Office / Business GEO Tag)</td>
        <td style="${valueCellStyle}" colspan="3">${formatMultiline(
          employer.officeGeoTag
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Previous Employment",
        employer.previousEmployment,
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;

  const familyMembersTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="7">Family Member Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Name</td>
        <td style="${labelCellStyle}">Relation with Applicant</td>
        <td style="${labelCellStyle}">Age (yrs)</td>
        <td style="${labelCellStyle}">Occupation</td>
        <td style="${labelCellStyle}">Educational Qualification</td>
        <td style="${labelCellStyle}">Contact No.</td>
        <td style="${labelCellStyle}">Staying with Applicant</td>
      </tr>
      ${
        familyMembers?.familyMembers?.length
          ? familyMembers?.familyMembers
              .map(
                (member: any) => `
          <tr>
            <td style="${valueCellStyle}">${member.name}</td>
            <td style="${valueCellStyle}">${member.relationWithApplicant}</td>
            <td style="${valueCellStyle}">${member.age}</td>
            <td style="${valueCellStyle}">${member.occupation}</td>
            <td style="${valueCellStyle}">${member.educationalQualification}</td>
            <td style="${valueCellStyle}">${member.contactNumber}</td>
            <td style="${valueCellStyle}">${member.stayingWithApplicant}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="7">Not provided</td></tr>`
      }
    </table>
  `;

  const currentLoansTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="6">Current Loan Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Bank / FI Name</td>
        <td style="${labelCellStyle}">Loan Type</td>
        <td style="${labelCellStyle}">Sanction Amount</td>
        <td style="${labelCellStyle}">EMI</td>
        <td style="${labelCellStyle}">No. of EMI Paid</td>
        <td style="${labelCellStyle}">Balance Tenor</td>
      </tr>
      ${
        currentLoans.length
          ? currentLoans
              .map(
                (loan: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(loan.bankName)}</td>
            <td style="${valueCellStyle}">${formatMultiline(loan.loanType)}</td>
            <td style="${valueCellStyle}">${formatCurrency(
              loan.sanctionAmount
            )}</td>
            <td style="${valueCellStyle}">${formatCurrency(loan.emi)}</td>
            <td style="${valueCellStyle}">${formatMultiline(loan.emisPaid)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              loan.balanceTenor
            )}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="6">Not provided</td></tr>`
      }
    </table>
  `;

  const bankingTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="5">Banking Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Bank Name</td>
        <td style="${labelCellStyle}">Account Number</td>
        <td style="${labelCellStyle}">Account Type</td>
        <td style="${labelCellStyle}">Branch Name</td>
        <td style="${labelCellStyle}">Operating Since (Years)</td>
      </tr>
      ${
        banking.length
          ? banking
              .map(
                (account: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(
              account.bankName
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              account.accountNumber
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              account.accountType
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              account.branchName
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              account.operatingSinceYears
            )}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="5">Not provided</td></tr>`
      }
    </table>
  `;

  const tpcTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="5">TPC (Third Party Check) Details</th></tr>
      <tr>
        <td style="${labelCellStyle}">Name</td>
        <td style="${labelCellStyle}">Mobile Number</td>
        <td style="${labelCellStyle}">Knowing Since (Months / Years)</td>
        <td style="${labelCellStyle}">Feedback</td>
        <td style="${labelCellStyle}">Comments</td>
      </tr>
      ${
        tpcRefs.length
          ? tpcRefs
              .map(
                (ref: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(ref.name)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              ref.mobileNumber
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              ref.knowingSince
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(ref.feedback)}</td>
            <td style="${valueCellStyle}">${formatMultiline(ref.comments)}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="5">Not provided</td></tr>`
      }
    </table>
  `;

  const documentsTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Documents Verified</th></tr>
      <tr>
        <td style="${labelCellStyle}">Document Type</td>
        <td style="${labelCellStyle}">Original / Copy / Not Provided</td>
        <td style="${labelCellStyle}">Details Cross Checked</td>
        <td style="${labelCellStyle}">Comments</td>
      </tr>
      ${
        documents.length
          ? documents
              .map(
                (doc: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(
              doc.documentType
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              doc.documentStatus
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              doc.crossChecked
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(doc.comments)}</td>
          </tr>
        `
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="4">Not provided</td></tr>`
      }
    </table>
  `;

  const pdReviewTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">To be filled by PD officer</th></tr>
      ${renderKeyValueRow(
        "Major Observations / Comments / Concerns",
        pdReview.majorObservations,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow("Case Strengths", pdReview.caseStrengths, undefined, {
        colSpan: 3,
      })}
      ${renderKeyValueRow("Case Weakness", pdReview.caseWeakness, undefined, {
        colSpan: 3,
      })}
      <tr>
        <td style="${labelCellStyle}">PD Status</td>
        <td style="${valueCellStyle}">${html_data.approvedStatus|| "Not provided"}</td>
        <td style="${labelCellStyle}">Name of PD Officer</td>
        <td style="${valueCellStyle}">${formatMultiline(
          pdReview.pdOfficerName
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Date of Visit</td>
        <td style="${valueCellStyle}">${formatMultiline(pdReview.visitDate)}</td>
        <td style="${labelCellStyle}">Time of Visit</td>
        <td style="${valueCellStyle}">${formatMultiline(pdReview.visitTime)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Signature of the PD Officer TRUE/FALSE</td>
        <td style="${valueCellStyle}"></td>
      </tr>
    </table>
  `;

  return `
    ${pdBaseTemplate(html_data)}
    <style>
      .india-shelter-salaried .section-divider {
        margin: 28px 0 0;
        border-top: 2px solid #d0d7de;
      }
    </style>
    <div class="template-content india-shelter-salaried">
      ${generalTable}
      ${basicDetailsTable}
      ${residenceTable}
      ${employerTable}
      ${familyMembersTable}
      ${currentLoansTable}
      ${bankingTable}
      ${loanPurposeTable}
      ${collateralTable}
      ${referencesTable}
      ${tpcTable}
      ${documentsTable}
      ${pdReviewTable}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
