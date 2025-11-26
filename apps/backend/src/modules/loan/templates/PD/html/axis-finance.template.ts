import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

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

const renderTwoColumnTable = (rows: KeyValueRow[]) => {
  const items = rows.filter((row) => hasValue(row.value));
  if (items.length === 0) return "";

  return `
    <table style="${tableStyle}">
      
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
      <div style="font-size:14px;font-weight:bold;color:#242424;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #bfbfbf;padding-bottom:4px;margin-bottom:8px;">${title}</div>
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
    verificationData?.otherLiabilitiesIncludingCcLimitsOwnCoApplicants?.otherLiabilities || [];
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
        valueGetter: (item) => item.relation || item.relationToApplicant || "Not Provided",
      },
      {
        header: "Age",
        valueGetter: (item) => (item.age ? `${item.age}yrs` : "Not Provided"),
      },
      {
        header: "Education",
        valueGetter: (item) => item.education || item.qualification || "Not Provided",
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
        familySection.noOfDependants || familySection.totalDependants || "Not Provided",
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
      value: employment.nameOfBusinessEmployment || "Not Provided",
    },
    {
      label: "Nature of Business Entity / Employer Details",
      value:
        employment.natureOfBusinessEntityEmployerDetailsProprietoryPartnershipPvtLtd || "Not Provided",
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

  const combinedBusinessTable = renderTwoColumnTable([
    {
      label: "ANNUAL SALES",
      value: businessData.annualSales || "Not Provided",
      formatter: formatCurrency,
    },
    {
      label: "OVERALL COSTS",
      value: businessData.overallCosts || "Not Provided",
      formatter: formatCurrency,
    },
    {
      label: "MAJOR COST HEADS",
      value: businessData.majorCostHeads || "Not Provided",
    },
    {
      label: "GROSS MARGIN %",
      value: businessData.grossMargin || "Not Provided",
    },
    {
      label: "PBDIT MARGIN %",
      value: businessData.pbditMargin || "Not Provided",
    },
    {
      label: "DEBTORS CYCLE",
      value: businessData.debtorsCycle || "Not Provided",
    },
    {
      label: "CREDITORS CYCLE",
      value: businessData.creditorsCycle || "Not Provided",
    },
    {
      label: "CAPITAL INVESTED",
      value: businessData.capitalInvested || "Not Provided",
      formatter: formatCurrency,
    },
    {
      label: "LOAN FUNDS (INCL. CC LIMIT)",
      value: businessData.loanFundsInclCcLimit || "Not Provided",
    },
    {
      label: "STOCK MAINTAINED",
      value: businessData.stockMaintained || "Not Provided",
    },
    {
      label: "BUSINESS BANK ACCOUNTS",
      value: businessData.businessBankAccounts || "Not Provided",
    },
  ]);

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
      value: otherIncome.otherIncome || "Not Provided",
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

  const liabilitiesTable =`
    <div>
      <p style="${paragraphStyle}"><strong><u>Other Liabilities Including CC Limits (Own/Co Applicants)</u></strong></p>
      <table style="${tableStyle}">
        <tr>
          <td style="${headerCellStyle};">From</td>
          <td style="${headerCellStyle};">Nature of Loan</td>
          <td style="${headerCellStyle};">O/S Amount</td>
          <td style="${headerCellStyle};">EMI</td>
          <td style="${headerCellStyle};">Will Close / Continue</td>
        </tr>
        ${ensureArray(liabilitiesRaw).length > 0 ? `
        ${ensureArray(liabilitiesRaw).map((liability, index) => `
          <tr>
            <td style="${cellStyle}">${liability.from || "Not Provided"}</td>
            <td style="${cellStyle}">${liability.natureOfLoan || "Not Provided"}</td>
            <td style="${cellStyle}">${formatCurrency(liability.amount || "Not Provided")}</td>
            <td style="${cellStyle}">${formatCurrency(liability.emi || "Not Provided")}</td>
            <td style="${cellStyle}">${liability.willCloseContinue || "Not Provided"}</td>
          </tr>
        `).join("")}`: `<tr><td colspan="5" style="${cellStyle};text-align:center;">No other liabilities provided</td></tr>`}
      </table>
    </div>
    `;

  const budgetRows = [
    {
      sno: 1,
      label: "Affordable EMI",
      value: budget.affordableEmi || "Not Provided",
      formatter: formatCurrency,
    },
    {
      sno: 2,
      label: "Net Surplus",
      value: budget.netSurplus || "Not Provided",
    },
    {
      sno: 3,
      label:
        "Total Monthly Net Income per month (Business income + Other Income)",
      value: budget.totalMonthlyIncomePerMonth || "Not Provided",
    },
    {
      sno: 4,
      label: "Other Loan EMI",
      value: budget.otherLoanEmi || "Not Provided",
      formatter: formatCurrency,
    },
    {
      sno: 5,
      label: "PL / Auto Loan EMI",
      value: budget.plOrAutoLoanEMI || "Not Provided",
      formatter: formatCurrency,
    },
    {
      sno: 6,
      label: "Overall Family Expenses per month",
      value: budget.overAllFamilyExpenses || "Not Provided",
    },
    {
      sno: 7,
      label: "Total Monthly Expenses per month",
      value: budget.totalMonthlyExpensesPerMonth || "Not Provided",
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
              <td style="${cellStyle};text-align:center;">${row.sno}</td>
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
      <p style="${paragraphStyle}"><strong><u>End Use of Funds</u></strong><br>${formatMultiline(endUseOfFunds.endUseOfFunds)}</p> 
        
      </div>`;

  const otherObservationsTable = `
    <div>
      <p style="${paragraphStyle}"><strong><u>Other Observations</u></strong><br>${otherObservations?.otherObservations?.split("\n").map(line => `<li style="margin-left:10px;">${line}</li>`).join("")}</p>
    </div>
  `;

  const overallPositivesOrNegativesTable = `
    <div>
      <p style="${paragraphStyle}"><strong><u>Overall Positives or Negatives</u></strong> <br>${formatMultiline(overallPositivesOrNegatives.overallPositivesOrNegatives)}</p>
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

  const noteBlock = `
    <div style="font-size:12px;line-height:1.6;margin-top:16px;">
      <p style="margin:8px 0;">
        <strong>Note:</strong> The estimated financials and qualitative remarks furnished above are based on the applicant’s disclosures and on-site observations captured during the personal discussion.
      </p>
      <p style="margin:8px 0;">
        <strong>Disclaimer:</strong> The report contains information shared by the person contacted during the visit. Axis Finance will be solely responsible for decisions taken on the basis of this report and any liabilities directly or indirectly arising therefrom.
      </p>
      <p style="margin:8px 0;">
        TATA (Tata housing finance Ltd / Tata capital Ltd., will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions, efficient services will not be liable in any case.
      </p>
    </div>
  `;

  const estimatedIncomeTable = `
    <div> 
    <p style="font-size:18px;font-weight:bold;"><u>Estimated Income</u></p>
    <p style="${paragraphStyle}">${formatMultiline(estimatedIncome?.estimatedIncomeDetails || "Not Provided")}</p>
    ${estimatedIncome?.patOfTheBusinessConcern ? `<p style="${paragraphStyle}"><strong>The PAT of the Business Concern (Rs.)</strong> ${formatCurrency(estimatedIncome?.patOfTheBusinessConcern)}</p>` : ""}
    </div>
  `;


  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content axis-finance">
      ${renderCenteredTitle("Personal Discussion Sheet")}
      ${renderSection("Personal Details", personalDetailsTable)}
      ${renderSection("Family Background", familyMembersTable + familySummaryTable)}
      ${renderSection("Place of Residence/Office", residenceTable)}
      ${renderTextSection("Company Profile", company?.detailedProfileOfTheBusiness?.split("\n").map(line => `<li style="margin-left:10px;">${line}</li>`).join(""))}
      ${renderSection("Self Employed/Salaried", employmentTable)}
      ${renderBusinessSection("BUSINESS DETAILS", businessDetailsTable)}
      ${renderBusinessSection("EMPLOYEE/OTHER MAJOR COST", employeeCostsTable)}
      ${renderBusinessSection("BUSINESS DATA", combinedBusinessTable)}
      ${renderSection("Co-Applicant Income", coApplicantIncomeTable)}
      ${renderSection("Other Income", otherIncomeTable)}
      ${renderSection("Assets & Investments", assetsTable)}
      ${liabilitiesTable}
      ${renderSection("Budget Analysis", budgetTable)}
      ${endUseOfFundsTable}
      ${otherObservationsTable}
      ${overallPositivesOrNegativesTable}
      ${renderSection("Trade References ", tradeReferenceTable)}
      ${estimatedIncomeTable}
      ${noteBlock}
    </div>
  `;
};
