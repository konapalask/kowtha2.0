import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;background:#f4f6fb;vertical-align:top;width:32%";
const valueCellStyle =
  "border:1px solid #c7cdd1;padding:8px;color:#333;vertical-align:top";

const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some((entry) => hasValue(entry));
  if (typeof value === "object")
    return Object.values(value).some((entry) => hasValue(entry));
  return false;
};

const formatMultiline = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return String(value).replace(/\n+/g, "<br>");
};

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return formatMultiline(value);
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
};

const ensureArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const renderKeyValue = (
  label: string,
  value: any,
  formatter?: (value: any) => string,
  options?: { colspan?: number }
) => {
  const rendered = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colspan || 1}">
        ${rendered}
      </td>
    </tr>
  `;
};

const renderArrayTable = (headers: string[], rows: string[][]): string => {
  if (!rows.length) {
    return `<table style="${tableStyle}"><tr><td style="${valueCellStyle}">Not provided</td></tr></table>`;
  }
  const headerRow = headers
    .map(
      (header) =>
        `<th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">${header}</th>`
    )
    .join("");
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell) =>
              `<td style="${valueCellStyle}">${formatMultiline(cell)}</td>`
          )
          .join("")}</tr>`
    )
    .join("");
  return `<table style="${tableStyle}"><tr>${headerRow}</tr>${bodyRows}</table>`;
};

export const niwasSalariedTemplate = (
  verificationData: any,
  html_data: any
) => {
  const general = verificationData.generalInfo || {};
  const assets = verificationData.assetsInvestments || {};
  const employment = verificationData.employmentDetails || {};
  const company = verificationData.companyDetails || {};
  const premises = verificationData.businessPremises || {};
  const ess = ensureArray(verificationData.essChecklist?.essResponses);
  const existingLoans = ensureArray(
    verificationData.existingLoans?.existingLoans
  );
  const loanPurpose = verificationData.loanPurpose || {};
  const familyMembers = ensureArray(
    verificationData.familyMembers?.familyMembers
  );
  const references = ensureArray(verificationData.references?.references);
  const employerChecks = ensureArray(
    verificationData.employerFirmCheck?.checks
  );
  const pdComments = verificationData.pdOfficerComments || {};

  const assetRows = [
    ["Smartphone", assets.smartphone],
    ["Washing Machine", assets.washingMachine],
    ["Car RC No.", assets.carRcNo],
    ["Two-Wheeler", assets.twoWheeler],
    ["Auto / Cab", assets.autoCab],
    ["Computer / Laptop", assets.computerLaptop],
    ["AC", assets.ac],
    ["Fridge", assets.fridge],
    ["Induction", assets.induction],
    ["Insurance (LIC)", assets.insurance],
    ["Fixed Deposit", assets.fixedDeposit],
    ["Chit Funds", assets.chitFunds],
    ["Post Office Savings", assets.postOfficeSavings],
    [
      "Post Office Savings Monthly",
      assets.postOfficeSavingsMonthly,
    ],
    ["Recurring Deposit", assets.recurringDeposit],
    ["Consumption (Nicotine / Alcohol)", assets.consumptionHabits],
    ["Investments", assets.investments],
  ].map(([label, value]) => [label, formatMultiline(value)]);

  const familyRows = familyMembers.map((member: any) => [
    member.name || "",
    member.relation || member.relationship || "",
    member.age || "",
    member.employmentType || "",
    member.education || "",
    member.contactNumber || "",
    member.stayingWithApplicant || "",
  ]);

  const existingLoanRows = existingLoans.map((loan: any) => [
    loan.typeOfLoan || "",
    loan.bankName || "",
    loan.loanAmount ? formatCurrency(loan.loanAmount) : "",
    loan.emi ? formatCurrency(loan.emi) : "",
    loan.tenureRemaining || "",
  ]);

  const referenceRows = references.map((ref: any) => [
    ref.name || "",
    ref.address || "",
    ref.designation || "",
    ref.yearsKnown || "",
    ref.contactNumber || "",
    ref.email || "",
    ref.photoWithApplicant || "",
  ]);

  const employerCheckRows = employerChecks.map((check: any) => [
    check.name || "",
    check.businessName || "",
    check.address || "",
    check.yearsKnown || "",
    check.contactNumber || "",
    check.feedback || "",
    check.businessCardCollected || "",
  ]);

  const essRows = ess.map((entry: any, index: number) => [
    `(${String.fromCharCode(97 + index)})`,
    entry.question || "",
    entry.response || "",
  ]);

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content niwas-salaried-template">
      <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Basic Details</h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Prospect No.", general.prospectNo)}
        ${renderKeyValue("Name of Applicant", general.nameOfApplicant)}
        ${renderKeyValue("Marital Status", general.maritalStatus)}
        ${renderKeyValue(
          "Educational Qualification",
          general.educationalQualification
        )}
        ${renderKeyValue("Category", general.category)}
        ${renderKeyValue(
          "Dependents - Children",
          general.dependentsChildren
        )}
        ${renderKeyValue("Dependents - Adults", general.dependentsAdults)}
        ${renderKeyValue("Dependents - Others", general.dependentsOthers)}
        ${renderKeyValue(
          "Years in Current Residence",
          general.yearsInCurrentResidence
        )}
        ${renderKeyValue("House Size", general.houseSize)}
        ${renderKeyValue("Previous Address", general.previousAddress)}
        ${renderKeyValue(
          "Years Stayed at Previous Address",
          general.yearsAtPreviousAddress
        )}
        ${renderKeyValue(
          "Years in Current City",
          general.yearsInCurrentCity
        )}
        ${renderKeyValue("Previous City", general.previousCity)}
        ${renderKeyValue(
          "Years in Previous City",
          general.yearsInPreviousCity
        )}
        ${renderKeyValue("Reason for Change", general.reasonForChange)}
        ${renderKeyValue(
          "Parents Staying With",
          general.parentsStayingWith
        )}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Assets and Investments
      </h2>
      ${renderArrayTable(["Asset / Investment", "Details"], assetRows)}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Employment Details
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Current Employer", employment.employerName)}
        ${renderKeyValue(
          "Years in Current Job / Date of Joining",
          employment.yearsInCurrentJob
        )}
        ${renderKeyValue(
          "Total Work Experience",
          employment.totalWorkExperience
        )}
        ${renderKeyValue("Official Email", employment.officialEmail)}
        ${renderKeyValue("Contact Number", employment.contactNumber)}
        ${renderKeyValue(
          "Number of Employees in Firm",
          employment.numberOfEmployeesInFirm
        )}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Company / Employer Information
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue(
          "Head Office Location",
          company.companyHeadOffice
        )}
        ${renderKeyValue(
          "Promoters / Management",
          company.promotersNames
        )}
        ${renderKeyValue(
          "Number of Company Employees",
          company.numberOfCompanyEmployees
        )}
        ${renderKeyValue("Constitution", company.constitution)}
        ${renderKeyValue("Presence Across Cities", company.citiesPresent)}
        ${renderKeyValue("Nature of Business / Services", company.natureOfBusiness)}
        ${renderKeyValue("Type of Customers", company.typeOfCustomers)}
        ${renderKeyValue(
          "Years Since Incorporation",
          company.yearsSinceIncorporation
        )}
        ${renderKeyValue("GST Registered", company.gstRegistered)}
        ${renderKeyValue("GST Number", company.gstNumber)}
        ${renderKeyValue(
          "Branches Across India",
          company.branchesAcrossIndia
        )}
        ${renderKeyValue(
          "Share Holding Pattern",
          company.shareHoldingPattern
        )}
        ${renderKeyValue("Management Team", company.managementTeam)}
        ${renderKeyValue(
          "Banking Relationship",
          company.bankingRelationship
        )}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Business Premises &amp; Operations
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue(
          "Premises Owned / Rented",
          premises.businessPremiseOwnership
        )}
        ${renderKeyValue(
          "Monthly Sales / Receipts",
          premises.monthlySalesReceipts
        )}
        ${renderKeyValue(
          "Sales on Credit (%)",
          premises.percentSalesOnCredit
        )}
        ${renderKeyValue(
          "Manufacturing / Trading Details",
          premises.manufacturingTradingDetails
        )}
        ${renderKeyValue(
          "Sales Concentration",
          premises.salesConcentration
        )}
        ${renderKeyValue(
          "Business Cycle – Debtors",
          premises.businessCycleDebtors
        )}
        ${renderKeyValue(
          "Business Cycle – Creditors",
          premises.businessCycleCreditors
        )}
        ${renderKeyValue("Stock Valuation", premises.stockValuation)}
        ${renderKeyValue(
          "Gross & Net Margins",
          premises.grossNetMargins
        )}
        ${renderKeyValue(
          "Monthly Net Saving (Rs.)",
          premises.monthlyNetSaving
        )}
        ${renderKeyValue("Major Suppliers", premises.majorSuppliers)}
        ${renderKeyValue("Major Customers", premises.majorCustomers)}
        ${renderKeyValue("Number of Employees", premises.numberOfEmployees)}
        ${renderKeyValue("Name Board Seen", premises.nameBoardSeen)}
        ${renderKeyValue(
          "Locality of Office / Business",
          premises.localityOfOffice
        )}
        ${renderKeyValue(
          "Residence cum Office Setup",
          premises.residenceCumOffice
        )}
        ${renderKeyValue(
          "VAT / Excise / Service Tax Applicability",
          premises.vatExciseApplicability
        )}
        ${renderKeyValue("Latest Tax Return Paid", premises.latestTaxReturn)}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        ESS Checklist
      </h2>
      ${renderArrayTable(
        ["#", "Question", "Response"],
        essRows.map((row) => row.map((cell) => cell || ""))
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Existing Loan Details
      </h2>
      ${renderArrayTable(
        ["Type of Loan", "Bank Name", "Loan Amount", "EMI", "Tenure Remaining"],
        existingLoanRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Loan Purpose &amp; Cost
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Purpose of Loan", loanPurpose.purposeOfLoan)}
        ${renderKeyValue(
          "Minimum Loan Amount Required",
          loanPurpose.minimumLoanAmountRequired
        )}
        ${renderKeyValue(
          "Tenure Required",
          loanPurpose.tenureRequired
        )}
        ${renderKeyValue(
          "Monthly Household Expenses",
          loanPurpose.monthlyHouseholdExpenses
        )}
        ${renderKeyValue(
          "Comfortable EMI",
          loanPurpose.comfortableEmi
        )}
        ${renderKeyValue("Funds Required", loanPurpose.fundsRequired)}
        ${renderKeyValue(
          "Source of Own Funds (OCR)",
          loanPurpose.sourceOfOwnFunds
        )}
        ${renderKeyValue("Purchase Cost", loanPurpose.purchaseCost)}
        ${renderKeyValue("Savings", loanPurpose.savings)}
        ${renderKeyValue(
          "Construction Estimate",
          loanPurpose.constructionEstimate
        )}
        ${renderKeyValue(
          "Registration / Stamp Duty",
          loanPurpose.registrationCharges
        )}
        ${renderKeyValue(
          "Other Loan Amount Taken",
          loanPurpose.otherLoanAmountTaken
        )}
        ${renderKeyValue(
          "Total Amount Spent",
          loanPurpose.totalAmountSpent
        )}
        ${renderKeyValue(
          "Total Transaction Cost",
          loanPurpose.totalTransactionCost
        )}
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Other Family Member Details
      </h2>
      ${renderArrayTable(
        [
          "Name",
          "Relation",
          "Age",
          "Employment Type",
          "Education",
          "Contact No.",
          "Staying with Applicant",
        ],
        familyRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Reference Details
      </h2>
      ${renderArrayTable(
        [
          "Name",
          "Address",
          "Designation",
          "Years Known",
          "Contact Number",
          "Email",
          "Photo with Applicant",
        ],
        referenceRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Employer Firm Check
      </h2>
      ${renderArrayTable(
        [
          "Name",
          "Business Firm",
          "Address",
          "Years Known",
          "Contact Number",
          "Feedback",
          "Business Card Collected",
        ],
        employerCheckRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        PD Officer Comments
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Comments", pdComments.comments)}
        ${renderKeyValue(
          "Name of PD Officer",
          pdComments.pdOfficerName
        )}
        ${renderKeyValue(
          "Date of Discussion",
          pdComments.discussionDate
        )}
        ${renderKeyValue(
          "Signature of PD Officer",
          pdComments.pdOfficerSignature
        )}
      </table>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};

export default niwasSalariedTemplate;
