import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";
import { getFooterNameFromTemplate } from "src/modules/loan/forms-schema";
type KeyValueRow = {
  label: string;
  value: any;
  formatter?: (value: any) => string;
};

type ColumnDefinition = {
  header: string;
  valueGetter: (item: any, index: number) => any;
  formatter?: (value: any, item: any, index: number) => string;
};

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:12px 0";
const cellStyle =
  "border:1px solid #bfbfbf;padding:8px;vertical-align:top;line-height:1.5";
const headerCellStyle = `${cellStyle};font-weight:bold;background:#f5f5f5;text-transform:uppercase`;
const sectionTitleStyle =
  "font-size:15px;font-weight:bold;margin:20px 0 8px 0;text-transform:uppercase;color:#242424;letter-spacing:0.5px";
const centeredTitleStyle =
  "text-align:center;font-size:18px;font-weight:bold;margin:16px 0;text-transform:uppercase;color:#222";
const paragraphStyle = "margin:8px 0;line-height:1.6;font-size:12px;color:#333";

/**
 * Calculates the financial year ending date (31.03.YEAR) based on current date
 * Financial year runs from April 1 to March 31
 * - April 1, 2025 to March 31, 2026 → returns 2026
 * - April 1, 2026 to March 31, 2027 → returns 2027
 */
const getFinancialYearEndingYear = (): number => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed: 0=Jan, 1=Feb, ..., 3=Apr, ..., 11=Dec
  const currentYear = now.getFullYear();

  // If we're in April (3) or later, the financial year ending is next year
  // If we're in Jan-Mar (0-2), the financial year ending is this year
  if (currentMonth >= 3) {
    return currentYear + 1;
  } else {
    return currentYear;
  }
};

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

const displayValue = (value: any): string => {
  if (!hasValue(value)) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-IN");
  return String(value);
};

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return displayValue(value);
  }
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
};

const formatDate = (value: any): string => {
  if (!hasValue(value)) return "";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-GB");
  }
  return displayValue(value);
};

const formatMultiline = (value: any): string => {
  const rendered = displayValue(value);
  if (!rendered) return "";
  return rendered.replace(/\n+/g, "<br>");
};

const renderSectionTitle = (title: string) =>
  `<h2 style="${sectionTitleStyle}">${title}</h2>`;

const renderCenteredTitle = (title: string) =>
  `<div style="${centeredTitleStyle}">${title}</div>`;

const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const renderTwoColumnTable = (
  rows: KeyValueRow[],
  headers?: { left?: string; right?: string }
) => {
  const items = rows.filter((row) => hasValue(row.value));
  if (items.length === 0) return "";

  const headerRow =
    headers?.left || headers?.right
      ? `
      <tr>
        <td style="${headerCellStyle};width:35%;">${headers.left || ""}</td>
        <td style="${headerCellStyle}">${headers.right || ""}</td>
      </tr>
    `
      : "";

  return `
    <table style="${tableStyle}">
      ${headerRow}
      ${items
        .map(({ label, value, formatter }) => {
          const rendered = formatter ? formatter(value) : displayValue(value);
          return `
            <tr>
              <td style="${headerCellStyle};width:35%;">${label}</td>
              <td style="${cellStyle}"><span class="var-value">${rendered}</span></td>
            </tr>
          `;
        })
        .join("")}
    </table>
  `;
};

const renderMultiColumnTable = (
  columns: ColumnDefinition[],
  items: any[] | undefined,
  emptyMessage: string
) => {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <table style="${tableStyle}">
        <tr>
          <td style="${cellStyle};text-align:center;">${emptyMessage}</td>
        </tr>
      </table>
    `;
  }

  return `
    <table style="${tableStyle}">
      <tr>
        ${columns
          .map(({ header }) => `<td style="${headerCellStyle}">${header}</td>`)
          .join("")}
      </tr>
      ${items
        .map((item, index) => {
          return `
            <tr>
              ${columns
                .map((column) => {
                  const rawValue = column.valueGetter(item, index);
                  const rendered = column.formatter
                    ? column.formatter(rawValue, item, index)
                    : displayValue(rawValue);
                  return `<td style="${cellStyle}"><span class="var-value">${rendered}</span></td>`;
                })
                .join("")}
            </tr>
          `;
        })
        .join("")}
    </table>
  `;
};

const renderSection = (title: string, content: string) => {
  if (!content || !content.trim()) return "";
  return `<div class="axis-finance-section">${renderSectionTitle(title)}${content}</div>`;
};

const renderTextSection = (title: string, value: any) => {
  if (!hasValue(value)) return "";
  return `
    <div class="axis-finance-section">
      ${renderSectionTitle(title)}
      <div style="${paragraphStyle}">${formatMultiline(value)}</div>
    </div>
  `;
};

const renderBusinessSection = (title: string, content: string) => {
  if (!content || !content.trim()) return "";
  return `
    <div style="margin: 15px 0;">
      <div style="${sectionTitleStyle}">${title}</div>
      <div>${content}</div>
    </div>
  `;
};

export const axisFinanceTemplate = (verificationData: any, html_data: any) => {
  const personal = verificationData.personalDiscussionSheet || {};
  const familySection = verificationData.familyBackground || {};
  const residence = verificationData.placeOfResidenceOffice || {};
  const company = verificationData.companyProfile || {};
  const employment = verificationData.selfEmployedOrSalaried || {};
  const businessDetails = verificationData.businessDetails || {};
  const employeeCosts = verificationData.employeotherMajorCost || {};
  const businessData = verificationData.businessData || {};
  const coApplicantIncome = verificationData.coApplicantIncome || {};
  const otherIncome = verificationData.otherIncome || {};
  const assets = verificationData.assets || {};
  const liabilitiesRaw =
    verificationData?.otherLiabilitiesIncludingCcLimitsOwnCoApplicants
      ?.otherLiabilities || [];
  const budget = verificationData.budgetAnalysis || {};
  const endUseOfFunds = verificationData.endUseOfFunds || {};
  const otherObservations = verificationData.otherObservations || {};
  const overallPositivesOrNegatives =
    verificationData.overallPositivesOrNegatives || {};
  const tradeReferences = ensureArray(
    verificationData?.tradeReferences?.tradeReferences || []
  );
  const estimatedIncome = verificationData.estimatedIncome || {};
  const personalDetailsTable = renderTwoColumnTable([
    {
      label: "Name of the Applicant",
      value: personal?.applicantName || "Not Provided",
    },
    {
      label: "Application Number",
      value: personal?.applicationNumber || "Not Provided",
    },
    {
      label: "Interviewed By",
      value: personal?.interviewedBy || "Not Provided",
    },
    {
      label: "Person Contacted",
      value: personal?.personContacted || "Not Provided",
    },
    {
      label: "Date",
      value: formatDate(personal?.pdDate) || "Not Provided",
    },
    {
      label: "Loan Amount Request",
      value: personal?.loanAmount || "Not Provided",
      formatter: formatCurrency,
    },
    {
      label: "Place of Interview",
      value: personal?.placeOfInterview || "Not Provided",
    },
    {
      label: "Contact Number",
      value: personal?.applicantMobile || "Not Provided",
      formatter: (value: any) => String(value),
    },
  ]);

  // Create family members array - handle multiple formats
  let familyMembers = [];
  if (Array.isArray(familySection)) {
    familyMembers = familySection;
  } else if (
    familySection &&
    familySection.familyMembers &&
    Array.isArray(familySection.familyMembers)
  ) {
    familyMembers = familySection.familyMembers;
  } else if (
    familySection &&
    Object.keys(familySection).length > 0 &&
    familySection.name
  ) {
    familyMembers = [familySection];
  }

  const familyMembersTable = renderMultiColumnTable(
    [
      {
        header: "Name",
        valueGetter: (item) => item.name || item.memberName || "Not Provided",
      },
      {
        header: "Relation",
        valueGetter: (item) =>
          item.relation || item.relationToApplicant || "Not Provided",
      },
      {
        header: "Age",
        valueGetter: (item) => (item.age ? `${item.age}yrs` : "Not Provided"),
      },
      {
        header: "Education",
        valueGetter: (item) =>
          item.education || item.qualification || "Not Provided",
      },
      {
        header: "Occupation",
        valueGetter: (item) => item.occupation || "Not Provided",
      },
    ],
    familyMembers,
    "No family members provided"
  );

  const familySummaryTable = renderTwoColumnTable([
    {
      label: "NO. OF. DEPENDANTS",
      value:
        familySection.noOfDependants ||
        familySection.totalDependants ||
        "Not Provided",
    },
    {
      label: "GENERAL LIFESTYLE/PERSONALITY",
      value: familySection.generalLifestylePersonality || "Not Provided",
    },
  ]);

  const residenceTable = renderTwoColumnTable([
    {
      label: "Current Address Details",
      value: residence.currentAddressDetails || "Not Provided",
    },
    {
      label: "Ownership and Name of Owners",
      value: residence.ownershipAndNameOfOwners || "Not Provided",
    },
    {
      label: "Collateral Description and Type",
      value: residence.collateralDescriptionAndType || "Not Provided",
    },
    {
      label: "Office Premises Details",
      value: residence.officePremisesDetails || "Not Provided",
    },
    {
      label: "Ownership and Name of Owners (NA for Salaried)",
      value: residence.ownershipAndNameOfOwnersNaForSalaried || "Not Provided",
    },
  ]);

  const employmentTable = renderTwoColumnTable([
    {
      label: "Name of Business / Employment",
      value: employment.businessName || "Not Provided",
    },
    {
      label: "Nature of Business Entity / Employer Details",
      value:
        employment.natureOfBusinessEntityEmployerDetailsProprietoryPartnershipPvtLtd ||
        "Not Provided",
    },
    {
      label: "Key Manager to the Business",
      value: employment.keyManagerToTheBusiness || "Not Provided",
    },
    {
      label: "No. of Years in Business / Employment",
      value: employment.noOfYearsInBusinessEmployment || "Not Provided",
    },
    {
      label: "Type of Business",
      value: employment.typeOfBusiness || "Not Provided",
    },
  ]);

  const businessDetailsTable = renderTwoColumnTable([
    {
      label: "MAIN CLIENTS",
      value: businessDetails.mainClients || "Not Provided",
    },
  ]);

  const employeeCostsTable = renderTwoColumnTable([
    {
      label: "NO. OF EMPLOYEES",
      value: employeeCosts.numberOfEmployees || "Not Provided",
    },
    {
      label: "TOTAL SALARIES PER MONTH",
      value: employeeCosts.totalSalariesPerMonth || "Not Provided",
      formatter: formatCurrency,
    },
  ]);

  const businessDataRows = [
    {
      label: "ANNUAL SALES",
      accountingYear: businessData.accountingYear?.annualSales,
      previousFinancialYear: businessData.previousFinancialYear?.annualSales,
      formatter: formatCurrency,
    },
    {
      label: "OVERALL COSTS",
      accountingYear: businessData.accountingYear?.overallCosts,
      previousFinancialYear: businessData.previousFinancialYear?.overallCosts,
      formatter: formatCurrency,
    },
    {
      label: "MAJOR COST HEADS",
      accountingYear: businessData.accountingYear?.majorCostHeads,
      previousFinancialYear: businessData.previousFinancialYear?.majorCostHeads,
    },
    {
      label: "GROSS MARGIN %",
      accountingYear: businessData.accountingYear?.grossMargin
        ? `${businessData.accountingYear.grossMargin}%`
        : "Not Provided",
      previousFinancialYear: businessData.previousFinancialYear?.grossMargin
        ? `${businessData.previousFinancialYear.grossMargin}%`
        : "Not Provided",
    },
    {
      label: "PBDIT MARGIN %",
      accountingYear: businessData.accountingYear?.pbditMargin
        ? `${businessData.accountingYear.pbditMargin}%`
        : "Not Provided",
      previousFinancialYear: businessData.previousFinancialYear?.pbditMargin
        ? `${businessData.previousFinancialYear.pbditMargin}%`
        : "Not Provided",
    },
    {
      label: "DEBTORS CYCLE",
      accountingYear: businessData.accountingYear?.debtorsCycle,
      previousFinancialYear: businessData.previousFinancialYear?.debtorsCycle,
    },
    {
      label: "CREDITORS CYCLE",
      accountingYear: businessData.accountingYear?.creditorsCycle,
      previousFinancialYear: businessData.previousFinancialYear?.creditorsCycle,
    },
    {
      label: "CAPITAL INVESTED",
      accountingYear: businessData.accountingYear?.capitalInvested,
      previousFinancialYear:
        businessData.previousFinancialYear?.capitalInvested,
      formatter: formatCurrency,
    },
    {
      label: "LOAN FUNDS (INCL. CC LIMIT)",
      accountingYear: businessData.accountingYear?.loanFundsInclCcLimit,
      previousFinancialYear:
        businessData.previousFinancialYear?.loanFundsInclCcLimit,
      formatter: formatCurrency,
    },
    {
      label: "STOCK MAINTAINED",
      accountingYear: businessData.accountingYear?.stockMaintained,
      previousFinancialYear:
        businessData.previousFinancialYear?.stockMaintained,
    },
    {
      label: "BUSINESS BANK ACCOUNTS",
      accountingYear: businessData.accountingYear?.businessBankAccounts,
      previousFinancialYear:
        businessData.previousFinancialYear?.businessBankAccounts,
    },
  ];

  const combinedBusinessTable = `
    <table style="${tableStyle}">
      <tr>
        <td style="${headerCellStyle};width:30%;">ACCOUNTING YEAR</td>
        <td style="${headerCellStyle};width:35%;">ESTIMATED(RS.)</td>
        <td style="${headerCellStyle};width:35%;">PREVIOUS FINANCIAL YEAR</td>
      </tr>
      ${businessDataRows
        .map((row) => {
          const accountingYearValue = row.formatter
            ? row.formatter(row.accountingYear)
            : displayValue(row.accountingYear || "Not Provided");
          const previousFinancialYearValue = row.formatter
            ? row.formatter(row.previousFinancialYear)
            : displayValue(row.previousFinancialYear || "Not Provided");
          return `
            <tr>
              <td style="${headerCellStyle};width:30%;">${row.label}</td>
              <td style="${cellStyle}"><span class="var-value">${accountingYearValue}</span></td>
              <td style="${cellStyle}"><span class="var-value">${previousFinancialYearValue}</span></td>
            </tr>
          `;
        })
        .join("")}
    </table>
  `;

  const coApplicantIncomeTable = renderTwoColumnTable([
    {
      label: "Co-Applicant Income",
      value: coApplicantIncome.coApplicantIncome || "Not Provided",
      formatter: formatCurrency,
    },
  ]);

  const otherIncomeTable = renderTwoColumnTable([
    {
      label: "Other Income",
      value: otherIncome.otherIncome ? otherIncome.otherIncome.split("\n").map((line: string) => `<ul style="margin: 0 6px;"><li>${line}</li></ul>`).join("") : "Not Provided",
    },
  ]);

  const assetsTable = renderTwoColumnTable([
    {
      label: "LIC / Insurance / Mediclaim",
      value: assets.licPaymentInsuranceMediclaim || "Not Provided",
    },
    {
      label: "Share / Mutual Fund Investments",
      value: assets.shareMutualFundInvestments || "Not Provided",
    },
    {
      label: "Cars / Two-Wheelers Owned",
      value: assets.carsTwoWheelersOwned || "Not Provided",
    },
    {
      label: "Other Properties Owned",
      value: assets.otherPropertiesOwned || "Not Provided",
    },
    {
      label: "Other Assets Owned",
      value: assets.otherAssetsOwned || "Not Provided",
    },
  ]);

  const liabilitiesTable = `
    <div>
      <p style="${sectionTitleStyle}"><strong><u>Other Liabilities Including CC Limits (Own/Co Applicants)</u></strong></p>
      <table style="${tableStyle}">
        <tr>
          <td style="${headerCellStyle};">From</td>
          <td style="${headerCellStyle};">Nature of Loan</td>
          <td style="${headerCellStyle};">O/S Amount</td>
          <td style="${headerCellStyle};">EMI</td>
          <td style="${headerCellStyle};">Will Close / Continue</td>
        </tr>
        ${
          ensureArray(liabilitiesRaw).length > 0
            ? `
        ${ensureArray(liabilitiesRaw)
          .map(
            (liability, index) => `
          <tr>
            <td style="${cellStyle}">${liability.from || "Not Provided"}</td>
            <td style="${cellStyle}">${liability.natureOfLoan || "Not Provided"}</td>
            <td style="${cellStyle}">${formatCurrency(liability.amount || "Not Provided")}</td>
            <td style="${cellStyle}">${formatCurrency(liability.emi || "Not Provided")}</td>
            <td style="${cellStyle}">${liability.willCloseContinue || "Not Provided"}</td>
          </tr>
        `
          )
          .join("")}`
            : `<tr><td colspan="5" style="${cellStyle};text-align:center;">No other liabilities provided</td></tr>`
        }
      </table>
    </div>
    `;

  const budgetRows = [
    {
      sno: 1,
      label:
        "<strong>Total Monthly Net Income per month (Business income + Other Income)</strong>",
      value: formatCurrency(
        budget.totalMonthlyIncomePerMonth || "Not Provided"
      ),
    },
    {
      sno: 2,
      label: "Overall Family Expenses per month",
      value: formatCurrency(budget.overAllFamilyExpenses || "Not Provided"),
      formatter: formatCurrency,
    },
    {
      sno: 3,
      label: "PL or Auto Loan EMI",
      value: formatCurrency(budget.plOrAutoLoanEMI || "Not Provided"),
      formatter: formatCurrency,
    },
    {
      sno: 4,
      label: "Other Loan EMI",
      value: formatCurrency(budget.otherLoanEmi || "Not Provided"),
      formatter: formatCurrency,
    },
    {
      sno: "",
      label: "<strong>Total Monthly Expenses per month</strong>",
      value: formatCurrency(
        budget.totalMonthlyExpensesPerMonth || "Not Provided"
      ),
      formatter: formatCurrency,
    },
    {
      sno: "",
      label: "<strong>Net Surplus</strong>",
      value: formatCurrency(budget.netSurplus || "Not Provided"),
      formatter: formatCurrency,
    },
  ];

  const budgetTable = `
    <table style="${tableStyle}">
      <tr>
        <td style="${headerCellStyle};width:10%;">S.NO</td>
        <td style="${headerCellStyle};width:60%;">PARTICULARS</td>
        <td style="${headerCellStyle};width:30%;">AMOUNT</td>
      </tr>
      ${budgetRows
        .map((row) => {
          const rendered = row.formatter
            ? row.formatter(row.value)
            : displayValue(row.value);
          return `
            <tr>
              <td style="${cellStyle};text-align:center;">${row.sno ? row.sno : ""}</td>
              <td style="${cellStyle}">${row.label}</td>
              <td style="${cellStyle}"><span class="var-value">${rendered}</span></td>
            </tr>
          `;
        })
        .join("")}
    </table>
  `;

  const endUseOfFundsTable = `
      <div>
      <p style="${sectionTitleStyle}"><strong><u>End Use of Funds</u></strong></p> 
      <p>${formatMultiline(endUseOfFunds.endUseOfFunds)}</p> 
      </div>`;

  const otherObservationsTable = `
    <div>
      <p style="${sectionTitleStyle}"><strong><u>Other Observations</u></strong></p>
      ${otherObservations?.otherObservations
        ?.split("\n")
        .map((line) => `<ul style="margin:0 6px;"><li>${line}</li></ul>`)
        .join("")}
    </div>
  `;

  // Get years in business and PBDIT margin for fixed content template
  const yearsInBusiness = employment.noOfYearsInBusinessEmployment || "";
  const pbditMargin =
    businessData.accountingYear?.pbditMargin ||
    estimatedIncome?.pbditMargin ||
    "";

  const overallPositivesOrNegativesTable = `
    <div>
      <p style="${sectionTitleStyle}"><strong><u>Overall Positives or Negatives</u></strong></p>
      <p style="${paragraphStyle}">The applicant has been doing this business for ${yearsInBusiness || "Not Provided"} years. As per oral information and submitted documents we prepared the estimated financial statement. As per the nature of business the PBDIT Margin is ${pbditMargin ? `${pbditMargin}%` : "Not Provided"}. The business is subject to market conditions and other factors and of course competition.</p>
    </div>
  `;
  const tradeReferenceTable = renderMultiColumnTable(
    [
      {
        header: "Name of the Person",
        valueGetter: (item) => item.nameOfThePerson || "Not Provided",
      },
      {
        header: "Telephone No. / Address for Communication",
        valueGetter: (item) => item.contactDetails || "Not Provided",
      },
    ],
    tradeReferences,
    "No trade references provided"
  );

  const pdStatusTable = `
    <table style="${tableStyle}">
      <tr>
        <td style="${headerCellStyle};width:35%;">PD Status</td>
        <td style="${cellStyle}">${html_data.approvedStatus || "Not provided"}</td>
      </tr>
    </table>
  `;

  const noteBlock = `
    <div style="font-size:12px;line-height:1.6;margin-top:16px;">
      <p style="${paragraphStyle}">
        <strong>Note:</strong>We have taken the estimated figures based on customer feedback and the gross profit has been calculated taking into consideration market information gathered on our experience.
      </p>
      <p style="${paragraphStyle}">
        <strong>Disclaimer:</strong>The Report (Including any attachments) has been prepared on the basis of verbal information provided by the person contacted.
        ${getFooterNameFromTemplate(html_data.bankName || "") || ""} will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions, efficient services will not be liable in any case..
      </p>
    </div>
  `;

  // Get business name from various sources
  const businessName =
    html_data?.loanDetails?.businessName ||
    employment.businessName ||
    company?.detailedProfileOfTheBusiness?.split("\n")[0] ||
    "Not Provided";

  // Get annual sales/turnover for the textual overview
  const annualSales = verificationData.financialAnalysis.grossReceipts;
  const pbditMarginValue = verificationData.financialAnalysis.pbditMargin;
  const patValue = verificationData.financialAnalysis.netProfitAfterTax;

  const estimatedIncomeTable = `
    <div> 
      <p style="${sectionTitleStyle};text-align:center;"><strong><u>ESTIMATED INCOME</u></strong></p>
      <p style="${paragraphStyle};text-align:center;"><strong>${businessName}</strong></p>
      <p style="${paragraphStyle}">As per customer the sales/turnover will be around Rs. ${annualSales ? formatCurrency(annualSales) : "Not Provided"} per annum.</p>
      <p style="${paragraphStyle}">Out of the total Gross Receipts, some are cash and some are credit.</p>
      <p style="${paragraphStyle}">The estimated profit for the period 31.03.${getFinancialYearEndingYear()} is based on previous figures and submissions by the customer.</p>
      <p style="${paragraphStyle}"><strong>The Gross Sales as per our assumptions:</strong> - ${annualSales ? formatCurrency(annualSales) : "Not Provided"}</p>
      <p style="${paragraphStyle}"><strong>PBDIT Margin:</strong> - ${pbditMarginValue ? `${pbditMarginValue.toFixed(2)}%` : "Not Provided"}</p>
      <p style="${paragraphStyle}"><strong>The PAT of the Business Concern:</strong> - ${patValue ? formatCurrency(patValue) : "Not Provided"}</p>
    </div>
  `;
  const acceptRejectPDTable = `
    <table style="${tableStyle}">
      <tr>
        <td style="${headerCellStyle};width:35%;">Accept/Reject</td>
        <td style="${cellStyle}">${verificationData.acceptRejectPD?.acceptReject || "Not provided"}</td>
      </tr>
    </table>
  `;
  const signatureTable = `
    <table style="${tableStyle}">
      <tr>
        <td style="${headerCellStyle};width:35%;">Signature</td>
        <td style="${cellStyle}"></td>
      </tr>
    </table>
  `;
  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content axis-finance">
      ${renderCenteredTitle("Personal Discussion Sheet")}
      ${renderSection("Personal Details", personalDetailsTable)}
      ${renderSection("Family Background", familyMembersTable + familySummaryTable)}
      <div style="page-break-before: always;"></div>
      ${renderSection("Place of Residence/Office", residenceTable)}
      ${renderTextSection(
        "Company Profile",
        company?.detailedProfileOfTheBusiness
          ?.split("\n")
          .map((line) => `<ul><li style="margin-left:10px;">${line}</li></ul>`)
          .join("")
      )}
      ${renderSection("Self Employed/Salaried", employmentTable)}
      ${renderBusinessSection("BUSINESS DETAILS", businessDetailsTable)}
      ${renderBusinessSection("EMPLOYEE/OTHER MAJOR COST", employeeCostsTable)}
      <div style="page-break-before: always;"></div>
      ${renderBusinessSection("BUSINESS DATA", combinedBusinessTable)}
      ${renderSection("Co-Applicant Income", coApplicantIncomeTable)}
      ${renderSection("Other Income", otherIncomeTable)}
      ${renderSection("Assets & Investments", assetsTable)}
      <div style="page-break-before: always;"></div>
      ${liabilitiesTable}
      ${renderSection("Budget Analysis", budgetTable)}
      ${endUseOfFundsTable}
      ${otherObservationsTable}
      <div style="page-break-before: always;"></div>
      ${overallPositivesOrNegativesTable}
      ${renderSection("Trade References ", tradeReferenceTable)}
      ${pdStatusTable}
      ${acceptRejectPDTable}
      ${signatureTable}
      ${estimatedIncomeTable}
      ${noteBlock}
    </div>
    ${pdBaseTemplateFooter(html_data)}

  `;
};
