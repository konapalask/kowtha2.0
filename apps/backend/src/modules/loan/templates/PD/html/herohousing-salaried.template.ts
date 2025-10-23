import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;vertical-align:top;width:32%";
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
  const content = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colspan || 1}">
        ${content}
      </td>
    </tr>
  `;
};

const renderArrayTable = (headers: string[], rows: string[][]) => {
  if (!rows.length) {
    return `<table style="${tableStyle}"><tr><td style="${valueCellStyle}">Not provided</td></tr></table>`;
  }
  const headerRow = headers
    .map(
      (header) =>
        `<th style="border:1px solid #c7cdd1;padding:8px;text-align:left;font-weight:600;color:#222;">${header}</th>`
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

export const herohousingSalariedTemplate = (
  verificationData: any,
  html_data: any
) => {
  const general = verificationData.generalInfo || {};
  const borrower = verificationData.borrowerProfile || {};
  const familyMembers = ensureArray(verificationData.familyDetails?.members);
  const employment = verificationData.employmentProfile || {};
  const employer = verificationData.employerDetails || {};
  const investments = verificationData.propertyAndInvestments || {};
  const loanDetails = verificationData.loanDetails || {};
  const existingLoans = ensureArray(verificationData.existingLoans?.existingLoans);
  const bankingAccounts = ensureArray(
    verificationData.bankingDetails?.accounts
  );
  const loanPurpose = verificationData.loanPurpose || {};
  const ess = ensureArray(verificationData.essChecklist?.essResponses);
  const observations = verificationData.observations || {};

  const familyRows = familyMembers.map((member: any) => [
    member.name || "",
    member.relationship || "",
    member.age ? String(member.age) : "",
    member.qualification || "",
    member.occupation || "",
    member.incomeDetails || "",
  ]);

  const existingLoanRows = existingLoans.map((loan: any) => [
    loan.bankName || "",
    loan.loanType || "",
    formatCurrency(loan.sanctionAmount),
    formatCurrency(loan.emi),
    loan.tenureRemaining || "",
  ]);

  const bankingRows = bankingAccounts.map((account: any) => [
    account.bankName || "",
    account.accountNumber || "",
    account.accountType || "",
    account.branchName || "",
    account.operatingSince || "",
  ]);

  const essRows = ess.map((entry: any, index: number) => [
    `(${String.fromCharCode(97 + index)})`,
    entry.question || "",
    entry.response || "",
  ]);

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content hero-salaried-template">
      <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}">Loan account No.</td>
          <td style="${valueCellStyle}">${formatMultiline(general.loanAccountNo)}</td>
          <td style="${labelCellStyle}">Name of customer</td>
          <td style="${valueCellStyle}">${formatMultiline(general.nameOfCustomer)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Person met in PD & relationship with customer</td>
          <td style="${valueCellStyle}">${formatMultiline(general.personMet)}</td>
          <td style="${labelCellStyle}">Reason if customer not available during visit</td>
          <td style="${valueCellStyle}">${formatMultiline(general.reasonIfCustomerNotAvailable)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">PD visit date and time</td>
          <td style="${valueCellStyle}">${formatMultiline(general.pdVisitDate)}<br>${formatMultiline(general.pdVisitTime)}</td>
          <td style="${labelCellStyle}">Requested loan amount</td>
          <td style="${valueCellStyle}">${formatCurrency(general.requestedLoanAmount)}</td>
        </tr>
        ${renderKeyValue("PD address", general.pdAddress, undefined, { colspan: 3 })}
        ${renderKeyValue("Latitude & Longitude", general.latLongOfOfficeAddress, undefined, { colspan: 3 })}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue(
          "Borrower details (qualification & professional journey)",
          borrower.borrowerDetails,
          undefined,
          { colspan: 1 }
        )}
      </table>

      ${renderArrayTable(
        [
          "Name",
          "Relationship",
          "Age",
          "Qualification",
          "Occupation",
          "Income details / Dependent",
        ],
        familyRows
      )}

      <table style="${tableStyle}">
        ${renderKeyValue("Name of Employer", employment.nameOfEmployer)}
        ${renderKeyValue("Working since", employment.workingSince)}
        ${renderKeyValue("Type of employment", employment.typeOfEmployment)}
        ${renderKeyValue("Designation", employment.designation)}
        ${renderKeyValue("Job profile", employment.jobProfile)}
        ${renderKeyValue("Reporting to", employment.reportingTo)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Current business name", employer.businessName)}
        ${renderKeyValue("Constitution", employer.constitution)}
        ${renderKeyValue("Nature of business / services", employer.natureOfBusiness)}
        ${renderKeyValue("Running since", employer.runningSince)}
        ${renderKeyValue("Partners / Directors details", employer.partnersDetails)}
        ${renderKeyValue("Setup of business & no. of employees", employer.setupDetails)}
        ${renderKeyValue("Quantum of stock", employer.stockQuantum)}
        ${renderKeyValue("Machinery and assets seen", employer.machineryAssets)}
        ${renderKeyValue("Locality & competitor feedback", employer.localityFeedback)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue(
          "Assets / investments built till date",
          investments.investmentNotes,
          undefined,
          { colspan: 1 }
        )}
        ${renderKeyValue("End use of property / fund", investments.endUseNotes)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Loan details", loanDetails.loanNotes)}
        ${renderKeyValue("Banking details", loanDetails.bankingNotes)}
        ${renderKeyValue(
          "Document verification & other checks",
          loanDetails.documentVerificationNotes
        )}
      </table>

      ${renderArrayTable(
        ["Bank / FI Name", "Loan Type", "Sanction Amt.", "EMI", "Balance Tenor"],
        existingLoanRows
      )}

      ${renderArrayTable(
        ["Bank Name", "Account Number", "Account Type", "Branch", "Operating Since"],
        bankingRows
      )}

      <table style="${tableStyle}">
        ${renderKeyValue(
          "Detailed purpose / end use of loan amount",
          loanPurpose.detailedPurpose
        )}
        ${renderKeyValue(
          "Applied loan amount",
          loanPurpose.appliedLoanAmount,
          formatCurrency
        )}
      </table>

      ${renderArrayTable(
        ["#", "Question", "Response"],
        essRows
      )}

      <table style="${tableStyle}">
        ${renderKeyValue(
          "Detailed observations (Positive & Negative)",
          observations.detailedObservations
        )}
        ${renderKeyValue("Concerns", observations.concerns)}
        ${renderKeyValue("Status of PD", observations.pdStatus)}
        ${renderKeyValue("PD conducted by", observations.pdConductedBy)}
      </table>

      <p style="margin:20px 0 8px;font-weight:600;color:#222;">Disclaimer Clause:</p>
      <p style="margin:0 0 24px;color:#333;">
        This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Hero Housing Finance Ltd will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. Kowtha &amp; Co will not be held liable in any case.
      </p>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
