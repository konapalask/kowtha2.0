import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.tempate";

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

const ensureArray = <T,>(value: T | T[] | null | undefined): T[] => {
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
  const familyMembers = ensureArray(
    verificationData.familyMembers?.familyMembers
  );
  const currentLoans = ensureArray(
    verificationData.currentLoanDetails?.currentLoans
  );
  const banking = ensureArray(
    verificationData.bankingDetails?.bankingAccounts
  );
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
      <tr>
        <td style="${labelCellStyle}">Loan Number</td>
        <td style="${valueCellStyle}">${formatMultiline(general.loanNumber)}</td>
        <td style="${labelCellStyle}">Branch</td>
        <td style="${valueCellStyle}">${formatMultiline(general.branch)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Region</td>
        <td style="${valueCellStyle}">${formatMultiline(general.region)}</td>
        <td style="${labelCellStyle}">Location</td>
        <td style="${valueCellStyle}">${formatMultiline(general.location)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Latitude</td>
        <td style="${valueCellStyle}">${formatMultiline(general.latitude)}</td>
        <td style="${labelCellStyle}">Longitude</td>
        <td style="${valueCellStyle}">${formatMultiline(general.longitude)}</td>
      </tr>
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
      <tr>
        <td style="${labelCellStyle}">Marital Status</td>
        <td style="${valueCellStyle}">${formatMultiline(
          basic.maritalStatus
        )}</td>
        <td style="${labelCellStyle}">Qualification</td>
        <td style="${valueCellStyle}">${formatMultiline(
          basic.qualification
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Category</td>
        <td style="${valueCellStyle}">${formatMultiline(basic.category)}</td>
        <td style="${labelCellStyle}">Total No. of Family Members</td>
        <td style="${valueCellStyle}">${formatMultiline(
          basic.totalFamilyMembers
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Spouse Name</td>
        <td style="${valueCellStyle}">${formatMultiline(basic.spouseName)}</td>
        <td style="${labelCellStyle}">Spouse DOB</td>
        <td style="${valueCellStyle}">${formatMultiline(basic.spouseDob)}</td>
      </tr>
      ${renderKeyValueRow(
        "Does the spouse work? (If yes then give brief)",
        basic.spouseWorkDetails,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">No. of non-earning members / dependents</td>
        <td style="${valueCellStyle}">${formatMultiline(
          basic.nonEarningMembers
        )}</td>
        <td style="${labelCellStyle}" colspan="2"></td>
      </tr>
      ${dependentsRow}
    </table>
  `;

  const residenceTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Residence & Income Snapshot</th></tr>
      ${renderKeyValueRow(
        "Residence Address",
        residence.residenceAddress,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Years at Current Residence</td>
        <td style="${valueCellStyle}">${formatMultiline(
          residence.yearsAtCurrentResidence
        )}</td>
        <td style="${labelCellStyle}">Area (in Sq ft)</td>
        <td style="${valueCellStyle}">${formatMultiline(residence.areaSqft)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Monthly Rent & Security Deposit (if rented)</td>
        <td style="${valueCellStyle}">${formatCurrency(
          residence.monthlyRentDeposit
        )}</td>
        <td style="${labelCellStyle}">Purchase price & MV (if owned)</td>
        <td style="${valueCellStyle}">${formatCurrency(
          residence.purchasePriceMv
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Years in Current City</td>
        <td style="${valueCellStyle}" colspan="3">${formatMultiline(
          residence.yearsInCurrentCity
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Other Income",
        financial.otherIncome,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Net Worth (Car / Property / Investments)",
        financial.netWorth,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Existing Relationship with Indiashelter</td>
        <td style="${valueCellStyle}">${formatMultiline(
          financial.existingRelationshipWithIndiashelter
        )}</td>
        <td style="${labelCellStyle}">Monthly Household Expenses</td>
        <td style="${valueCellStyle}">${formatCurrency(
          financial.monthlyHouseholdExpenses
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Credit Card Details",
        financial.creditCardDetails,
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;

  const loanPurposeTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Loan Purpose & Collateral</th></tr>
      ${renderKeyValueRow(
        "Purpose of Loan",
        renderList(loanPurpose.purposes, "Not provided"),
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Other Purpose (if any)",
        loanPurpose.otherPurpose,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Minimum Loan Amount Required</td>
        <td style="${valueCellStyle}">${formatCurrency(
          loanPurpose.minimumLoanAmount
        )}</td>
        <td style="${labelCellStyle}">Tenure Required</td>
        <td style="${valueCellStyle}">${formatMultiline(
          loanPurpose.tenureRequired
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Comfortable EMI</td>
        <td style="${valueCellStyle}">${formatCurrency(
          loanPurpose.comfortableEmi
        )}</td>
        <td style="${labelCellStyle}">Status of Property to be Purchased</td>
        <td style="${valueCellStyle}">${formatMultiline(
          collateral.propertyStatus
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Usage of Property after Purchase",
        renderList(collateral.usageAfterPurchase, "Not provided"),
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "If Others, specify usage",
        collateral.usageOtherNotes,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Property Address",
        collateral.propertyAddress,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Area (in Sqft)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          collateral.propertyAreaSqft
        )}</td>
        <td style="${labelCellStyle}">Ownership of the property from how many years?</td>
        <td style="${valueCellStyle}">${formatMultiline(
          collateral.ownershipDuration
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Agreement Value</td>
        <td style="${valueCellStyle}">${formatCurrency(
          collateral.agreementValue
        )}</td>
        <td style="${labelCellStyle}">Own Contribution</td>
        <td style="${valueCellStyle}">${formatCurrency(
          collateral.ownContribution
        )}</td>
      </tr>
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
      <tr>
        <td style="${labelCellStyle}">Existing Relationship with Indiashelter</td>
        <td style="${valueCellStyle}">${formatMultiline(
          employer.existingRelationshipWithIndiashelter
        )}</td>
        <td style="${labelCellStyle}">Employer Name</td>
        <td style="${valueCellStyle}">${formatMultiline(
          employer.employerName
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Employer Address",
        employer.employerAddress,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Designation</td>
        <td style="${valueCellStyle}">${formatMultiline(
          employer.designation
        )}</td>
        <td style="${labelCellStyle}">Years in Present Employment</td>
        <td style="${valueCellStyle}">${formatMultiline(
          employer.yearsInPresentEmployment
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Current Monthly Salary (Gross)</td>
        <td style="${valueCellStyle}">${formatCurrency(
          employer.salaryGross
        )}</td>
        <td style="${labelCellStyle}">Current Monthly Salary (Net)</td>
        <td style="${valueCellStyle}">${formatCurrency(
          employer.salaryNet
        )}</td>
      </tr>
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
        familyMembers.length
          ? familyMembers
              .map(
                (member: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(member.name)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.relationWithApplicant
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(member.age)}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.occupation
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.educationalQualification
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.contactNumber
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              member.stayingWithApplicant
            )}</td>
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
            <td style="${valueCellStyle}">${formatMultiline(
              loan.bankName
            )}</td>
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
            <td style="${valueCellStyle}">${formatMultiline(
              ref.feedback
            )}</td>
            <td style="${valueCellStyle}">${formatMultiline(
              ref.comments
            )}</td>
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
      <tr><th style="${subHeaderStyle}" colspan="4">PD Officer Review</th></tr>
      ${renderKeyValueRow(
        "Major Observations / Comments / Concerns",
        pdReview.majorObservations,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Case Strengths",
        pdReview.caseStrengths,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Case Weakness",
        pdReview.caseWeakness,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">PD Status</td>
        <td style="${valueCellStyle}">${formatMultiline(pdReview.pdStatus)}</td>
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
        <td style="${labelCellStyle}">Signature of the PD Officer</td>
        <td style="${valueCellStyle}" colspan="3">${formatMultiline(
          pdReview.officerSignature
        )}</td>
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
      ${loanPurposeTable}
      ${referencesTable}
      ${employerTable}
      ${familyMembersTable}
      ${currentLoansTable}
      ${bankingTable}
      ${tpcTable}
      ${documentsTable}
      ${pdReviewTable}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
