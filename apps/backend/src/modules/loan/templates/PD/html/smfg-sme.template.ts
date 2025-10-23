import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.tempate";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:18px 0";
const headerStyle =
  "background:#1a73e8;color:#fff;font-weight:700;text-transform:uppercase;font-size:14px;padding:10px;border:1px solid #ccc;text-align:center;letter-spacing:0.6px";
const subHeaderStyle =
  "background:#f7d8c7;color:#4a3426;font-weight:600;font-size:12px;padding:8px;border:1px solid #ccc;text-transform:uppercase";
const labelCellStyle =
  "background:#f4f6fb;font-weight:600;color:#1f2d3d;padding:8px;border:1px solid #d0d7de;vertical-align:top;width:28%";
const valueCellStyle =
  "padding:8px;border:1px solid #d0d7de;color:#2f3b52;vertical-align:top";

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

const renderKeyValueRow = (
  label: string,
  value: any,
  formatter?: (value: any) => string,
  options?: { colSpan?: number }
) => {
  const rendered = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colSpan || 1}">
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
    return `<tr><td style="${valueCellStyle}" colspan="${headers.length}">Not provided</td></tr>`;
  }
  const headerRow = headers
    .map(
      (header) =>
        `<th style="background:#f4f6fb;border:1px solid #d0d7de;padding:8px;font-weight:600;color:#1f2d3d;">${header}</th>`
    )
    .join("");
  const body = rows
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
  return `
    <tr>
      <td colspan="${headers.length}">
        <table style="width:100%;border-collapse:collapse;">
          <tr>${headerRow}</tr>
          ${body}
        </table>
      </td>
    </tr>
  `;
};

const renderList = (items: any[]) => {
  const values = ensureArray(items).filter((item) => hasValue(item));
  if (!values.length) return "Not provided";
  return `<ul style="margin:6px 0 6px 18px;padding:0;">${values
    .map(
      (value) =>
        `<li style="margin-bottom:4px;color:#2f3b52;">${formatMultiline(
          value
        )}</li>`
    )
    .join("")}</ul>`;
};

export const smfgSmeTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.generalInfo || {};
  const personal = verificationData.personalInformation || {};
  const business = verificationData.businessInformation || {};
  const financials = verificationData.financials || {};
  const ess = verificationData.essChecklist || {};
  const existingLoans = ensureArray(verificationData.existingLoans?.existingLoans);
  const bankingAccounts = ensureArray(
    verificationData.bankingBehaviour?.bankingAccounts
  );
  const loanPurpose = verificationData.loanPurposeAndUse || {};
  const observations = verificationData.observations || {};

  const familyList = renderList(
    ensureArray(personal.familyMembers).map((member: any) => {
      const dependent =
        member.isDependent && member.isDependent.toLowerCase() === "yes"
          ? " (Dependent)"
          : "";
      return `${member.name || ""} - ${member.age || ""} yrs, ${
        member.occupation || ""
      }${dependent}`;
    })
  );

  const suppliersList = renderList(
    ensureArray(financials.majorSuppliers).map((entry: any) => entry)
  );
  const customersList = renderList(
    ensureArray(financials.majorCustomers).map((entry: any) => entry)
  );

  const essRows = ensureArray(ess.essResponses).map((item: any, index: number) => [
    String.fromCharCode(97 + index) + ".",
    item.question || "",
    item.response || "",
  ]);

  const loanRows = existingLoans.map((loan: any) => [
    loan.loanType || "",
    loan.bankName || "",
    formatCurrency(loan.loanAmount),
    formatCurrency(loan.emi),
    formatMultiline(loan.tenureRemaining),
  ]);

  const bankingRows = bankingAccounts.map((account: any) => [
    account.bankName || "",
    account.accountNumber || "",
    account.accountType || "",
    formatMultiline(account.operatingSince),
    formatMultiline(account.vintage),
    formatMultiline(account.minBalance),
    formatMultiline(account.customerBehaviour),
  ]);

  const generalTable = `
    <table style="${tableStyle}">
      <tr><th style="${headerStyle}" colspan="4">Personal Discussion Report - SMFG SME</th></tr>
      <tr>
        <td style="${labelCellStyle}">Branch Name</td>
        <td style="${valueCellStyle}">${formatMultiline(general.branchName)}</td>
        <td style="${labelCellStyle}">Application Reference No.</td>
        <td style="${valueCellStyle}">${formatMultiline(
          general.applicationReferenceNo
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Applicant Name</td>
        <td style="${valueCellStyle}">${formatMultiline(
          general.applicantName
        )}</td>
        <td style="${labelCellStyle}"></td>
        <td style="${valueCellStyle}"></td>
      </tr>
      ${renderKeyValueRow(
        "Applicant Office Address",
        general.applicantOfficeAddress,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Person Met</td>
        <td style="${valueCellStyle}" colspan="3">
          ${formatMultiline(general.personMetName)} | ${formatMultiline(
    general.personMetDesignation
  )} | ${formatMultiline(general.personMetMobileNo)}
        </td>
      </tr>
    </table>
  `;

  const personalTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Personal Information</th></tr>
      ${renderKeyValueRow(
        "Family Members",
        familyList,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Residence Address",
        personal.residenceAddress,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Residence Ownership</td>
        <td style="${valueCellStyle}">${formatMultiline(
          personal.ownershipStatus
        )}</td>
        <td style="${labelCellStyle}">House Area / Market Value</td>
        <td style="${valueCellStyle}">
          ${formatMultiline(personal.houseArea)}<br>
          ${formatCurrency(personal.houseMarketValue)}
        </td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Years at Residence</td>
        <td style="${valueCellStyle}">${formatMultiline(
          personal.yearsAtResidence
        )}</td>
        <td style="${labelCellStyle}">Years in Same City</td>
        <td style="${valueCellStyle}">${formatMultiline(personal.yearsInCity)}</td>
      </tr>
      ${renderKeyValueRow(
        "Permanent Address",
        personal.permanentAddress,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Other Owned Property in City",
        personal.otherOwnedProperty,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Other Income Sources",
        personal.otherIncomeSources,
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;

  const businessTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Business Information</th></tr>
      ${renderKeyValueRow(
        "Name of Business",
        business.businessName,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Nature of Business</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.natureOfBusiness
        )}</td>
        <td style="${labelCellStyle}">Constitution</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.constitution
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Partners / Directors and Share %",
        business.partners,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Type of Customer",
        business.customerType,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Business Started Since</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.businessStartDate
        )}</td>
        <td style="${labelCellStyle}">Promoter Experience</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.promoterExperience
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Stability in Same Business</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.stabilityYears
        )}</td>
        <td style="${labelCellStyle}">Stability Verified By</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.stabilityVerifiedBy
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Family Structure Involved in Business",
        business.familyInvolved,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Business Premises Ownership</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.premisesOwnership
        )}</td>
        <td style="${labelCellStyle}">Locality of Business / Office</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.premiseType
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Residence cum Office Setup</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.isResidenceCumOffice
        )}</td>
        <td style="${labelCellStyle}">Name Board Seen</td>
        <td style="${valueCellStyle}">${formatMultiline(
          business.nameBoardSeen
        )}</td>
      </tr>
    </table>
  `;

  const financialsTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Financials & Operations</th></tr>
      <tr>
        <td style="${labelCellStyle}">Actual Monthly Sales / Receipts</td>
        <td style="${valueCellStyle}">${formatCurrency(
          financials.monthlySales
        )}</td>
        <td style="${labelCellStyle}">Sales on Credit (%)</td>
        <td style="${valueCellStyle}">${formatMultiline(
          financials.percentSalesOnCredit
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Manufacturing / Trading Details",
        financials.manufacturingProcess,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Sales Concentration",
        financials.salesConcentration,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business Cycle - Debtors",
        financials.businessCycleDebtors,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business Cycle - Creditors",
        financials.businessCycleCreditors,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Stock valuation as on date",
        financials.stockValuation,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Gross & Net Margins</td>
        <td style="${valueCellStyle}">${formatMultiline(
          financials.grossMargin
        )}</td>
        <td style="${labelCellStyle}">Monthly Net Saving (Rs.)</td>
        <td style="${valueCellStyle}">${formatCurrency(
          financials.netSavings
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Number of Employees</td>
        <td style="${valueCellStyle}">${formatMultiline(
          financials.numberOfEmployees
        )}</td>
        <td style="${labelCellStyle}">Registration Certificates</td>
        <td style="${valueCellStyle}">${formatMultiline(
          financials.registrationCertifications
        )}</td>
      </tr>
      ${renderKeyValueRow(
        "Major Suppliers",
        suppliersList,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Major Customers",
        customersList,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">Tax Applicability</td>
        <td style="${valueCellStyle}">${formatMultiline(
          financials.taxApplicability
        )}</td>
        <td style="${labelCellStyle}">Latest Tax Return</td>
        <td style="${valueCellStyle}">${formatMultiline(
          financials.latestTaxReturn
        )}</td>
      </tr>
    </table>
  `;

  const essTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="3">Environmental & Social Safeguards (ESS)</th></tr>
      ${renderArrayTable(
        ["#", "Question", "Response"],
        essRows
      )}
      ${renderKeyValueRow(
        "Other ESS Notes",
        ess.essOthers,
        undefined,
        { colSpan: 2 }
      )}
    </table>
  `;

  const existingLoansTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="5">Existing Loan Details</th></tr>
      ${renderArrayTable(
        ["Type of Loan", "Bank Name", "Loan Amount", "EMI", "Tenure Remaining"],
        loanRows
      )}
    </table>
  `;

  const bankingTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="7">Banking Behaviour</th></tr>
      ${renderArrayTable(
        [
          "Bank Name",
          "Account Number",
          "Account Type",
          "Operating Since",
          "Vintage",
          "CC/OD Min Bal",
          "Customer Behaviour",
        ],
        bankingRows
      )}
    </table>
  `;

  const loanPurposeTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="2">Loan Purpose & Usage</th></tr>
      ${renderKeyValueRow(
        "Detailed Purpose / End Use",
        loanPurpose.detailedPurpose,
        undefined,
        { colSpan: 1 }
      )}
      ${renderKeyValueRow(
        "Applied Loan Amount",
        loanPurpose.appliedLoanAmount,
        formatCurrency,
        { colSpan: 1 }
      )}
    </table>
  `;

  const observationsTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="2">Observations & Conclusion</th></tr>
      ${renderKeyValueRow(
        "Detailed Observations (Positive & Negative)",
        observations.positiveObservations,
        undefined,
        { colSpan: 1 }
      )}
      ${renderKeyValueRow(
        "Concerns",
        observations.concerns,
        undefined,
        { colSpan: 1 }
      )}
      <tr>
        <td style="${labelCellStyle}">Status of PD</td>
        <td style="${valueCellStyle}">${formatMultiline(observations.pdStatus)}</td>
      </tr>
      ${renderKeyValueRow(
        "PD Conducted By",
        observations.pdConductedBy,
        undefined,
        { colSpan: 1 }
      )}
    </table>
  `;

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content smfg-sme-template">
      ${generalTable}
      ${personalTable}
      ${businessTable}
      ${financialsTable}
      ${essTable}
      ${existingLoansTable}
      ${bankingTable}
      ${loanPurposeTable}
      ${observationsTable}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
