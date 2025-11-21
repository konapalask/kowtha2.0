import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const cellLabelStyle =
  "border:1px solid #d0d7de;padding:8px 10px;width:34%;font-weight:600;background:#f5f7fa;vertical-align:top;color:#1f2d3d;line-height:1.5";
const cellValueStyle =
  "border:1px solid #d0d7de;padding:8px 10px;vertical-align:top;color:#2f3b52;line-height:1.5";
const paragraphStyle =
  "margin:6px 0;line-height:1.55;font-size:12px;color:#2f3b52";

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

const wrapParagraph = (content: string) =>
  `<p style="${paragraphStyle}">${content}</p>`;

const sectionTitle = (text: string) =>
  `<h2 style="margin:22px 0 10px;font-size:18px;font-weight:600;color:#1a237e;text-transform:uppercase;letter-spacing:0.5px;">${text}</h2>`;

const renderKeyValueTable = (
  rows: Array<[string, any, ((value: any) => string)?]>
) => {
  const items = rows.filter(([_, value]) => hasValue(value));
  if (items.length === 0) return "";

  return `
    <table style="${tableStyle}">
      ${items
        .map(([label, value, formatter]) => {
          const rendered = formatter
            ? formatter(value)
            : formatMultiline(value);
          return `
        <tr>
          <td style="${cellLabelStyle}">${label}</td>
          <td style="${cellValueStyle}">${wrapParagraph(rendered)}</td>
        </tr>`;
        })
        .join("")}
    </table>
  `;
};

const renderList = (items: string[], emptyLabel = "Not provided") =>
  items.length
    ? `<ul style="margin:6px 0 6px 18px;padding:0;">${items
        .map(
          (item) =>
            `<li style="margin-bottom:4px;font-size:12px;color:#2f3b52;line-height:1.45;">${item}</li>`
        )
        .join("")}</ul>`
    : wrapParagraph(emptyLabel);

const renderInnerTable = (headers: string[], rows: string[][]) => {
  if (!rows.length) {
    return wrapParagraph("Not provided");
  }

  const headerRow = headers
    .map(
      (header) =>
        `<th style="border:1px solid #d0d7de;padding:8px 10px;background:#e9edf5;font-size:12px;font-weight:600;color:#1f2d3d;text-align:left;">${header}</th>`
    )
    .join("");

  const rowMarkup = rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell) =>
              `<td style="border:1px solid #d0d7de;padding:8px 10px;font-size:12px;color:#2f3b52;line-height:1.45;">${cell}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  return `
    <table style="${tableStyle}">
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${rowMarkup}</tbody>
    </table>
  `;
};

const renderFamilyTable = (members: any[]) => {
  const rows = ensureArray(members).map((member: any) => [
    formatMultiline(member?.name || ""),
    formatMultiline(
      member?.relationship || member?.relationshipWithApplicant || ""
    ),
    formatMultiline(member?.age || ""),
    formatMultiline(member?.qualification || member?.education || ""),
    formatMultiline(member?.occupation || ""),
    formatMultiline(member?.income || member?.incomeDetailsDependent || ""),
  ]);

  return renderInnerTable(
    [
      "Name",
      "Relationship",
      "Age",
      "Qualification",
      "Occupation",
      "Income / Dependent",
    ],
    rows
  );
};

const renderObligationsTable = (loans: any[]) => {
  const rows = ensureArray(loans).map((loan: any) => [
    formatMultiline(
      loan?.institution ||
        loan?.institutionBankNbfcName ||
        loan?.financialInstitution ||
        ""
    ),
    formatMultiline(loan?.typeOfLoan || loan?.loanType || ""),
    formatMultiline(
      loan?.monthlyPrincipalEmi ||
        (hasValue(loan?.emi) ? formatCurrency(loan?.emi) : "") ||
        ""
    ),
    formatMultiline(loan?.loanAmount ? formatCurrency(loan?.loanAmount) : ""),
  ]);

  return renderInnerTable(
    [
      "Institution / Bank / NBFC Name",
      "Type of Loan (LAP / HL / CD / CV / AL etc.)",
      "Monthly Principal / EMI",
      "Loan Amount (Rs. Lacs)",
    ],
    rows
  );
};

export const idfcPlTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.general || {};
  const employment = verificationData.employmentDetails || {};
  const income = verificationData.incomeDetails || {};
  const banking = verificationData.bankingDetails || {};
  const residence = verificationData.residenceDetails || {};
  const assets = verificationData.assetsOwned || {};
  const bil = verificationData.loanDetailsBil || {};

  const latitude = general.latitude || verificationData.general?.lat || "";
  const longitude = general.longitude || verificationData.general?.lng || "";
  const coordinateDisplay =
    hasValue(latitude) || hasValue(longitude)
      ? `${latitude || "N/A"}, ${longitude || "N/A"}`
      : "";

  const residenceDocuments = ensureArray(
    income?.documentsSeenAtResidence ||
      verificationData.documentsObserved?.residenceDocuments ||
      []
  ).map((doc) => formatMultiline(doc));

  const officeDocuments = ensureArray(
    income?.documentsSeenAtOffice ||
      verificationData.documentsObserved?.officeDocuments ||
      []
  ).map((doc) => formatMultiline(doc));

  const assetsOwned = ensureArray(
    residence?.assetsOwned ||
      (assets?.assetsOwned ? [assets.assetsOwned] : []) ||
      []
  ).map((entry: any) => formatMultiline(entry));

  const generalRows: Array<[string, any, ((value: any) => string)?]> = [
    ["Name of the Applicant", general.nameOfTheApplicant],
    ["SDFC ID", general.sdfcId],
    ["Person Contacted", general.personContacted],
    ["Visited Address", general.visitedAddress],
    ["Date / Time of Visit", general.dateOfVisitTimeOfVisit],
    [
      "Alternate Contact Number",
      general.alternateContactNumberOfTheCustomerMobileLandline,
    ],
    ["Marital Status", general.maritalStatusMarriedDivorcedBachelor],
    ["Name of the Employer", employment.nameOfTheEmployer],
    [
      "Type of Firm (Proprietor / Partnership / Pvt. Ltd. / Govt. / PSU / MNC)",
      employment.typeOfFirmProprietorPartnershipPvtLtdGovtPsuMnc,
    ],
    ["Number of Employees", employment.numberOfEmployees],
    ["Department", employment.department],
    ["Designation", employment.designation],
    ["Years in Current Company", employment.yearsInCurrentCompany],
    [
      "Previous Job Details / Total Experience",
      employment.previousJobDetailsWorkExperienceTotalYearsOfExperience,
    ],
    [
      "Level of activity & stocks (observations)",
      employment.levelOfActivityStocksAlongWithObservations,
    ],
    [
      "Company Profile (Service / Manufacturing / Small Scale / Finance / Other)",
      employment.companyProfileServiceManufacturingSmallScaleFinanceOtherPleaseSpecify,
    ],
    ["Third Party Check", employment.thirdPartyCheck],
  ];

  const incomeRows: Array<[string, any, ((value: any) => string)?]> = [
    ["Gross Salary", income.grossSalary, formatCurrency],
    ["Net Salary", income.netSalary, formatCurrency],
    ["Overtime Details (if any)", income.overtimeDetailsIfAny],
    ["Monthly Expenses", income.monthlyExpenses, formatCurrency],
    ["Monthly Net Income", income.monthlyNetIncome, formatCurrency],
    [
      "Total No. of Family Members",
      renderFamilyTable(
        income.familyMembers ||
          income.familyMembersRelationshipAgeNameSalary ||
          []
      ),
    ],
    [
      "Earning Family Members Income Details",
      income.earningFamilyMembersIncomeDetails,
      formatCurrency,
    ],
    ["No. of Dependents", income.noOfDependents],
    [
      "Any Other Source of Income (Monthly/Annual)",
      income.anyOtherSourceOfIncomeMonthlyAnnual,
      formatCurrency,
    ],
  ];

  const bankingRows: Array<[string, any, ((value: any) => string)?]> = [
    ["Banking Relationship With", banking.bankingRelationshipWith],
    ["Cash Credit Limit", banking.cashCreditLimit, formatCurrency],
    ["Overdraft Limit", banking.overdraftLimit, formatCurrency],
  ];

  const residenceRows: Array<[string, any, ((value: any) => string)?]> = [
    [
      "Current Residence (Owned / Rented / Parents House / Relatives House / Company Provided)",
      residence.currentResidenceOwnedRentedParentsHouseRelativesHouseCompanyProvided ||
        residence.currentResidence,
    ],
    [
      "Years at Current Residence",
      residence.yearsAtCurrentResidence || residence.yearsAtResidence,
    ],
    ["Assets Owned", renderList(assetsOwned, "Assets not reported")],
    ["Four Wheeler : _____(Make/Model)", residence.fourWheelerMakeModel],
    ["Two Wheeler : _____(Make/Model)", residence.twoWheelerMakeModel],
  ];

  const loans =
    verificationData.obligations?.loans ||
    verificationData.obligationsLoans?.obligationsLoans ||
    verificationData.obligationsLoans ||
    [];

  const disclaimer = `This report (including any attachments) has been prepared based on verbal information provided by the person contacted. IDFC FIRST BANK will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. Kowtha &amp; Co. will not be held liable in any case.`;

  return `
    ${pdBaseTemplate(html_data)}
    <style>
      .idfc-pl-template ul li strong { color: #1f2d3d; }
      .idfc-pl-template .grid-two {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }
    </style>
    <div class="template-content idfc-pl-template">
      ${sectionTitle("Personal Discussion Report")}
      ${renderKeyValueTable(generalRows)}


      ${sectionTitle("Income Details")}
      ${renderKeyValueTable(incomeRows)}

      ${sectionTitle("Banking Details")}
      ${renderKeyValueTable(bankingRows)}

      ${sectionTitle("Obligations / Loans")}
      ${renderObligationsTable(loans)}

      ${sectionTitle("Residence & Assets")}
      ${renderKeyValueTable(residenceRows)}

      ${sectionTitle("BIL LOAN DETAILS:")}
      ${renderKeyValueTable([
        ["Loan Amount Applied", bil.loanAmountApplied, formatCurrency],
        ["End Use", bil.endUse],
        ["Name of Interviewer", bil.nameOfInterviewer || ""],
        ["Designation & Signature", bil.designationSignature || ""],
        ["PD Status", bil.statusOfThisCasePositiveNegativeCreditRefer || ""],
        ["Interviewer's Remarks", bil.interviewerSRemarks || ""],
      ])}

      ${sectionTitle("Disclaimer Clause")}
      ${wrapParagraph(disclaimer)}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
