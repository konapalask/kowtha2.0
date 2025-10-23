import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.tempate";

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

const renderArrayTable = (
  headers: string[],
  rows: string[][]
): string => {
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

export const niwasSenpTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.generalInfo || {};
  const assets = verificationData.assetsInvestments || {};
  const employment = verificationData.businessEmployment || {};
  const business = verificationData.businessOperations || {};
  const ess = ensureArray(verificationData.essChecklist?.essResponses);
  const existingLoans = ensureArray(
    verificationData.existingLoanDetails?.existingLoans
  );
  const costFunds = verificationData.costAndFunds || {};
  const banking = ensureArray(verificationData.bankingDetails?.bankingAccounts);
  const familyMembers = ensureArray(
    verificationData.familyMembers?.familyMembers
  );
  const references = ensureArray(verificationData.references?.references);
  const businessChecks = ensureArray(
    verificationData.businessFirmCheck?.checks
  );
  const pdComments = verificationData.pdOfficerComments || {};

  const assetRows = [
    ["Smartphone", assets.smartphone],
    ["Washing Machine", assets.washingMachine],
    ["Car RC No.", assets.carRcNo],
    ["Two-Wheeler", assets.twoWheeler],
    ["Auto/Cab", assets.autoCab],
    ["Computer/Laptop", assets.computerLaptop],
    ["AC", assets.ac],
    ["Fridge", assets.fridge],
    ["Induction", assets.induction],
  ].map(([label, value]) => [label, formatMultiline(value)]);

  const familyRows = familyMembers.map((member: any) => [
    member.name || "",
    member.relationship || "",
    member.age || "",
    member.occupation || "",
    member.education || "",
    member.contactNumber || "",
    member.stayingWithApplicant || "",
  ]);

  const existingLoanRows = existingLoans.map((loan: any) => [
    loan.typeOfLoan || "",
    loan.bankName || "",
    loan.loanAmount || "",
    loan.emi || "",
    loan.tenureRemaining || "",
  ]);

  const bankingRows = banking.map((account: any) => [
    account.bankName || "",
    account.accountNumber || "",
    account.accountType || "",
    account.branch || "",
    account.operatingSinceYears || "",
  ]);

  const referenceRows = references.map((ref: any) => [
    ref.name || "",
    ref.address || "",
    ref.relationship || "",
    ref.contactNumber || "",
    ref.email || "",
    ref.yearsKnown || "",
    ref.photoWithApplicant || "",
  ]);

  const businessCheckRows = businessChecks.map((check: any) => [
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
    <div class="template-content niwas-senp-template">
      <table style="${tableStyle}">
        ${renderKeyValue("Prospect No.", general.prospectNo)}
        ${renderKeyValue("Name", general.name)}
        ${renderKeyValue("Marital Status", general.maritalStatus)}
        ${renderKeyValue(
          "Educational Qualification",
          general.educationalQualification
        )}
        ${renderKeyValue("Category", general.category)}
        ${renderKeyValue(
          "Dependents - Children / Adults / Others",
          `Children: ${formatMultiline(
            general.dependentsChildren
          )} | Adults: ${formatMultiline(
            general.dependentsAdults
          )} | Others: ${formatMultiline(general.dependentsOthers)}`
        )}
        ${renderKeyValue(
          "Years in Current Residence",
          general.yearsInCurrentResidence
        )}
        ${renderKeyValue(
          "Current residence house size",
          general.currentResidenceHouseSize
        )}
        ${renderKeyValue("Previous address", general.previousAddress)}
        ${renderKeyValue(
          "Years stayed at previous address",
          general.yearsAtPreviousAddress
        )}
        ${renderKeyValue(
          "Years in current city",
          general.yearsInCurrentCity
        )}
        ${renderKeyValue("Previous city", general.previousCity)}
        ${renderKeyValue(
          "Years in previous city",
          general.yearsInPreviousCity
        )}
        ${renderKeyValue("Reason for change", general.reasonForChange)}
        ${renderKeyValue("Parents staying with", general.parentsStayingWith)}
      </table>

      <table style="${tableStyle}">
        <tr>
          <th style="border:1px solid #c7cdd1;padding:8px;background:#f4f6fb;color:#222;text-align:left;font-weight:600;">Asset</th>
          <th style="border:1px solid #c7cdd1;padding:8px;background:#f4f6fb;color:#222;text-align:left;font-weight:600;">Status</th>
        </tr>
        ${assetRows
          .map(
            ([label, value]) =>
              `<tr><td style="${labelCellStyle}">${label}</td><td style="${valueCellStyle}">${value}</td></tr>`
          )
          .join("")}
        ${renderKeyValue("Insurance (LIC)", assets.insurance)}
        ${renderKeyValue("Fixed Deposit", assets.fixedDeposit)}
        ${renderKeyValue("Chit Funds", assets.chitFunds)}
        ${renderKeyValue("Post Office Savings", assets.postOfficeSavings)}
        ${renderKeyValue(
          "Post Office savings monthly",
          assets.postOfficeSavingsMonthly
        )}
        ${renderKeyValue("Recurring Deposit", assets.recurringDeposit)}
        ${renderKeyValue(
          "Consumption of Nicotine / Alcohol",
          assets.consumptionHabits
        )}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Name of Current Business Firm", employment.businessName)}
        ${renderKeyValue("Type of Business Firm", employment.businessConstitution)}
        ${renderKeyValue("Partnership shareholding %", employment.partnershipShare)}
        ${renderKeyValue(
          "Date of commencement of business",
          employment.businessCommencementDate
        )}
        ${renderKeyValue(
          "Place of incorporation / address",
          employment.placeOfIncorporation
        )}
        ${renderKeyValue("Previous business name", employment.previousBusinessName)}
        ${renderKeyValue(
          "Years worked in previous business",
          employment.previousBusinessYears
        )}
        ${renderKeyValue(
          "Reason for change / closing previous business",
          employment.reasonForChange
        )}
        ${renderKeyValue(
          "Total work experience",
          employment.totalWorkExperience
        )}
        ${renderKeyValue("Official / Business email ID", employment.officialEmail)}
        ${renderKeyValue("Contact number", employment.contactNumber)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Type of industry", business.typeOfIndustry)}
        ${renderKeyValue("Nature of business", business.natureOfBusiness)}
        ${renderKeyValue("Constitution", business.constitution)}
        ${renderKeyValue("Type of customer", business.typeOfCustomer)}
        ${renderKeyValue("Business since", business.businessSince)}
        ${renderKeyValue(
          "Promoter experience",
          business.promoterExperience
        )}
        ${renderKeyValue("Stability in same business", business.stabilityYears)}
        ${renderKeyValue(
          "Stability verified by",
          business.stabilityVerifiedBy
        )}
        ${renderKeyValue(
          "Family structure involved in business",
          business.familyStructureInBusiness
        )}
        ${renderKeyValue("Business premises ownership", business.premisesOwnership)}
        ${renderKeyValue(
          "Actual monthly sales / receipts",
          business.actualMonthlySales
        )}
        ${renderKeyValue(
          "Sales done on credit (%)",
          business.percentSalesOnCredit
        )}
        ${renderKeyValue(
          "Manufacturing / trading details",
          business.manufacturingTradingDetails
        )}
        ${renderKeyValue(
          "Sales concentration > 50% on one party",
          business.salesConcentration
        )}
        ${renderKeyValue(
          "Business cycle – Debtors",
          business.businessCycleDebtors
        )}
        ${renderKeyValue(
          "Business cycle – Creditors",
          business.businessCycleCreditors
        )}
        ${renderKeyValue("Stock valuation", business.stockValuation)}
        ${renderKeyValue("Gross & net margins", business.grossNetMargins)}
        ${renderKeyValue(
          "Monthly net saving",
          business.monthlyNetSaving
        )}
        ${renderKeyValue("Major suppliers", business.majorSuppliers)}
        ${renderKeyValue("Major customers", business.majorCustomers)}
        ${renderKeyValue("Number of employees", business.numberOfEmployees)}
        ${renderKeyValue("Name board seen", business.nameBoardSeen)}
        ${renderKeyValue(
          "Locality of business / office",
          business.localityOfBusiness
        )}
        ${renderKeyValue(
          "Residence cum office setup",
          business.residenceCumOffice
        )}
        ${renderKeyValue(
          "Applicability of VAT / Excise / Service tax",
          business.vatExciseApplicability
        )}
        ${renderKeyValue(
          "Latest VAT / Service tax paid",
          business.latestTaxReturnValue
        )}
      </table>

      ${renderArrayTable(
        ["#", "Question", "Response"],
        essRows
      )}

      ${renderArrayTable(
        ["Type of Loan", "Bank Name", "Loan Amount", "EMI", "Tenure Remaining"],
        existingLoanRows
      )}

      <table style="${tableStyle}">
        ${renderKeyValue("Funds required", costFunds.fundsRequired)}
        ${renderKeyValue("Source of own funds (OCR)", costFunds.sourceOfOwnFunds)}
        ${renderKeyValue("Purchase cost", costFunds.purchaseCost)}
        ${renderKeyValue("Savings", costFunds.savings)}
        ${renderKeyValue(
          "Construction estimate",
          costFunds.constructionEstimate
        )}
        ${renderKeyValue(
          "Total transaction cost",
          costFunds.totalTransactionCost
        )}
      </table>

      ${renderArrayTable(
        [
          "Bank Name",
          "Account Number",
          "Account Type",
          "Branch",
          "Operating since (Years)",
        ],
        bankingRows
      )}

      ${renderArrayTable(
        [
          "Name",
          "Relationship",
          "Age",
          "Occupation",
          "Educational Qualification",
          "Contact No.",
          "Staying with Applicant",
        ],
        familyRows
      )}

      ${renderArrayTable(
        [
          "Name",
          "Address",
          "Relationship",
          "Contact Number",
          "Email Address",
          "Years Known",
          "Photo with Applicant",
        ],
        referenceRows
      )}

      ${renderArrayTable(
        [
          "Name of Person",
          "Business Firm",
          "Address",
          "Years Known",
          "Contact Number",
          "Feedback",
          "Business Card Collected",
        ],
        businessCheckRows
      )}

      <table style="${tableStyle}">
        ${renderKeyValue(
          "Comments / Observations",
          pdComments.comments
        )}
        ${renderKeyValue("Initiated address", pdComments.initiatedAddress)}
        ${renderKeyValue("Visited address", pdComments.visitedAddress)}
        ${renderKeyValue("Residential address", pdComments.residentialAddress)}
        ${renderKeyValue("Other observations", pdComments.otherObservations)}
        ${renderKeyValue("Concerns", pdComments.concerns)}
        ${renderKeyValue("Status of the case", pdComments.statusOfCase)}
        ${renderKeyValue("Name of PD Officer", pdComments.pdOfficerName)}
        ${renderKeyValue("Date of Discussion", pdComments.discussionDate)}
        ${renderKeyValue(
          "Signature of the PD Officer",
          pdComments.pdOfficerSignature
        )}
      </table>

      <p style="margin:24px 0 8px;font-weight:600;color:#222;">Disclaimer Clause:</p>
      <p style="margin:0 0 24px;color:#333;">
        This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Niwas Home Finance Private Limited will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. Kowtha &amp; Co will not be held liable in any case.
      </p>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
