import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

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

  const questionList = [
    "Is the entity involved in any commercial pest control operation, use any Ozone depleting substance, hazardous chemicals, bio medical waste, Dyes, forest products, tobacco, alcohol, weapons, gambling, radioactive materials, unbounded asbestos, harmful fishing practice, commercial logging.",
    "Does the entity involve in Child or forced Labour or business involve displacement of people, impact on indigenous people or established in land designated as forest or forest products",
    "Does the entity have required consent of establishment from State pollution control board and other government authorities on establishment in Wetland Area, near National Park, Sanctuaries or Forest areas, ASI certificate for establishment up to 300 meters near a protected monument or cultural heritage, 500 meters near Coastal Regulation Zone",
    "Does the entity involves in proper mechanism for treatment or disposal of waste and does not emit air, water or noise pollutants.",
    "Does the Entity comply with the above ESS guidelines",
  ]
  const essRows = ensureArray(ess.essResponses).map((item: any, index: number) => [
    String.fromCharCode(97 + index) + ".",
    questionList[index] || "",
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
    account.accountType || "",
    formatMultiline(account.vintage),
    formatMultiline(account.ifCcOdLimitWhatIsLimitMinBal),
    formatMultiline(account.customerBehavior),
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
        <td style="${labelCellStyle}">Person Met - Name, Designation & Mobile No</td>
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
        "Details of family members name, age and occupation: (pls tick on dependents)",
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
        <td style="${labelCellStyle}">whether self owned/parental/rented</td>
        <td style="${valueCellStyle}">${formatMultiline(
          personal.ownershipStatus
        )}</td>
        <td style="${labelCellStyle}">Area of the house property and estimated market value</td>
        <td style="${valueCellStyle}">
          ${formatMultiline(personal.houseArea)}<br>
          ${formatCurrency(personal.houseMarketValue)}
        </td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">No. of Years at same Residence</td>
        <td style="${valueCellStyle}">${formatMultiline(
          personal.yearsAtResidence
        )}</td>
        <td style="${labelCellStyle}">No. of years in same city</td>
        <td style="${valueCellStyle}">${formatMultiline(personal.yearsInCity)}</td>
      </tr>
      ${renderKeyValueRow(
        "Permanent Address",
        personal.permanentAddress,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Details of other owned property in the city",
        personal.otherOwnedProperty,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Any other source of income apart from this business",
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
      ${renderKeyValueRow(
        "Nature of Business",
        business.natureOfBusiness,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Constitution",
        business.constitution,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Name of Partners/Directors and share %",
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
      ${renderKeyValueRow(
        "Stability in same business - No of Years",
        business.stabilityYears,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Whether the stability was verified by any Registration certificate / distribution / dealership letter displayed in shop / office / Factory",
        business.stabilityVerifiedBy,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Family Structure Involved in Business",
        business.familyInvolved,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business Premises wherther owned or rented",
        business.premisesOwnership,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Actual Monthly Sales / Receipts as per customer",
        financials.monthlySales,
        formatCurrency,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "What % sales is done on credit",
        financials.percentSalesOnCredit,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Manufacturing process/ Trading details",
        financials.manufacturingProcess,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Whether sales concentration is >50% on one party. If yes name of Party and contact no",
        financials.salesConcentration,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business Cycle -How many days credit allowed to Debtors and what are actual debtors amount as on date",
        financials.businessCycleDebtors,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business Cycle - How many days credit allowed by creditors to CM and what are actual Creditors amount as on date",
        financials.businessCycleCreditors,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business Cycle – What is stock valuation as on date",
        financials.stockValuation,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Gross & Net margins % in Business",
        financials.grossMargin,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Monthly Net saving after all expenses in Rs",
        financials.netSavings,
        formatCurrency,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Name and contact no of two major suppliers",
        financials.majorSuppliers,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Number of Employees",
        financials.numberOfEmployees,
        undefined,
        { colSpan: 3 }
      )}
       ${renderKeyValueRow(
        "Name Board Seen if yes what was written",
        business.nameBoardSeen,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Locality of Business / Office",
        business.premiseType,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Whether Residence cum Office set up",
        business.isResidenceCumOffice,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Applicability of VAT / Excise / Service tax and rate of same",
        financials.taxApplicability,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Latest Qtr VAT return value/Service tax paid",
        financials.latestTaxReturn,
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;

  const essTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="3">Environmental & Social Safeguards (ESS)</th></tr>
      ${renderArrayTable(
        ["#", "Question", "Response"],
        essRows,
      )}
      ${renderKeyValueRow(
        "Others",
        ess.essOthers,
        undefined,
        { colSpan: 3 }
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
      <tr><th style="${subHeaderStyle}" colspan="7">Banking Details:-</th></tr>
      ${renderArrayTable(
        [
          "Bank Name",
          "Account Type",
          "Vintage of account",
          "If CC/OD limit- what is limit – Min Bal",
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
        "Detailed Purpose / End Use of Loan Amount",
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
      <tr><th style="${subHeaderStyle}" colspan="4">Observations & Conclusion:-</th></tr>
      ${renderKeyValueRow(
        "Detailed Observations (Positive and Negative)",
        observations.positiveObservations,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Concerns",
        observations.concerns,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Status of PD",
        observations.pdStatus,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
        <td style="${labelCellStyle}">PD Conducted By</td>
        <td style="${valueCellStyle}">${formatMultiline(observations.pdConductedBy)}</td>
        <td style="${labelCellStyle}">Designation</td>
        <td style="${valueCellStyle}">${formatMultiline(observations.pdDesignation)}</td>
      </tr>
    </table>
  `;

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content smfg-sme-template">
      ${generalTable}
      ${personalTable}
      ${businessTable}
      ${essTable}
      ${existingLoansTable}
      ${bankingTable}
      ${loanPurposeTable}
      ${observationsTable}
    </div>
  `;
};
