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
          const rendered = formatter
            ? formatter(value)
            : displayValue(value);
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
          .map(
            ({ header }) =>
              `<td style="${headerCellStyle}">${header}</td>`
          )
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

export const axisFinanceTemplate = (verificationData: any, html_data: any) => {
  const personal = verificationData.personalDiscussionSheet || {};
  const familySection = verificationData.familyBackground || {};
  const residence = verificationData.placeOfResidenceOffice || {};
  const company = verificationData.companyProfile || {};
  const employment =
    verificationData["Self Employed/Salaried"] ||
    verificationData.selfEmployed ||
    {};
  const businessDetails = verificationData.businessDetails || {};
  const employeeCosts = verificationData.employeotherMajorCost || {};
  const businessData = verificationData.businessData || {};
  const additionalIncome = verificationData.otherIncome || {};
  const liabilitiesRaw =
    verificationData.otherLiabilitiesIncludingCcLimitsOwnCoApplicants || [];
  const budget = verificationData.budgetAnalysis || {};
  const tradeReferences = ensureArray(verificationData.tradeReferences);

  const familyMembers = ensureArray(
    familySection.familyMembers ||
      verificationData.familyDetails?.familyMembers
  ).filter((member) => hasValue(member));

  const totalFamilyMembers =
    familySection.totalFamilyMembers ||
    verificationData.familyDetails?.totalFamilyMembers ||
    "";

  const earningMembers =
    familySection.noOfEarningMembers ||
    familySection.earningMembers ||
    verificationData.familyDetails?.earningMembers ||
    "";

  const personalDetailsTable = renderTwoColumnTable([
    {
      label: "Application No.",
      value: personal.applicationNumber,
    },
    {
      label: "Name of the Applicant",
      value: personal.applicantName,
    },
    {
      label: "Interviewed By",
      value: personal.interviewedBy,
    },
    {
      label: "Person Contacted",
      value: personal.personContacted,
    },
    {
      label: "Date",
      value: formatDate(personal.pdDate),
    },
    {
      label: "Loan Amount Request",
      value: personal.loanAmount,
      formatter: formatCurrency,
    },
    {
      label: "Place of Interview",
      value: personal.placeOfInterview,
    },
    {
      label: "Contact Number",
      value: personal.applicantMobile,
    },
  ]);

  const familyTable = renderMultiColumnTable(
    [
      {
        header: "Name",
        valueGetter: (item) =>
          item.name ||
          item.fullName ||
          item.memberName ||
          "",
      },
      {
        header: "Relation",
        valueGetter: (item) =>
          item.relation ||
          item.relationToApplicant ||
          "",
      },
      {
        header: "Age",
        valueGetter: (item) => item.age,
      },
      {
        header: "Education",
        valueGetter: (item) =>
          item.education || item.qualification,
      },
      {
        header: "Occupation",
        valueGetter: (item) => item.occupation,
      },
      {
        header: "Dependent",
        valueGetter: (item) => item.dependent,
      },
      {
        header: "Income / Month",
        valueGetter: (item) => item.incomePerMonth,
        formatter: (value) => formatCurrency(value),
      },
    ],
    familyMembers,
    "Family member details not provided"
  );

  const familySummaryTable = renderTwoColumnTable([
    {
      label: "Total Family Members",
      value: totalFamilyMembers,
    },
    {
      label: "No. of Earning Members",
      value: earningMembers,
    },
    {
      label: "No. of Dependants",
      value: familySection.noOfDependants,
    },
  ]);

  const residenceTable = renderTwoColumnTable([
    {
      label: "Current Address Details",
      value: residence.currentAddressDetails,
    },
    {
      label: "Ownership and Name of Owners",
      value: residence.ownershipAndNameOfOwners,
    },
    {
      label: "Collateral Description and Type",
      value: residence.collateralDescriptionAndType,
    },
    {
      label: "Office Premises Details",
      value: residence.officePremisesDetails,
    },
    {
      label: "Ownership and Name of Owners (NA for Salaried)",
      value: residence.ownershipAndNameOfOwnersNaForSalaried,
    },
  ]);

  const employmentTable = renderTwoColumnTable([
    {
      label: "Name of Business / Employment",
      value: employment.nameOfBusinessEmployment,
    },
    {
      label: "Nature of Business Entity / Employer Details",
      value:
        employment
          .natureOfBusinessEntityEmployerDetailsProprietoryPartnershipPvtLtd,
    },
    {
      label: "Key Manager to the Business",
      value: employment.keyManagerToTheBusiness,
    },
    {
      label: "No. of Years in Business / Employment",
      value: employment.noOfYearsInBusinessEmployment,
    },
    {
      label: "Type of Business",
      value: employment.typeOfBusiness,
    },
  ]);

  const workforceTable = renderTwoColumnTable([
    {
      label: "Main Clients",
      value: businessDetails.mainClients,
    },
    {
      label: "No. of Employees",
      value: employeeCosts.noOfEmployees,
    },
    {
      label: "Total Salaries per Month",
      value: employeeCosts.totalSalariesPerMonth,
      formatter: formatCurrency,
    },
    {
      label: "Accounting Year",
      value: employeeCosts.accountingYear,
    },
    {
      label: "Estimated Total Costs",
      value: employeeCosts.estimatedTotalCosts,
      formatter: formatCurrency,
    },
  ]);

  const financialsTable = renderTwoColumnTable([
    {
      label: "Annual Sales",
      value: businessData.annualSales,
      formatter: formatCurrency,
    },
    {
      label: "Overall Costs",
      value: businessData.overallCosts,
      formatter: formatCurrency,
    },
    {
      label: "Major Cost Heads",
      value: businessData.majorCostHeads,
    },
    {
      label: "Gross Margin %",
      value: businessData.grossMargin,
    },
    {
      label: "PBDIT Margin %",
      value: businessData.pbditMargin,
    },
    {
      label: "Debtors Cycle",
      value: businessData.debtorsCycle,
    },
    {
      label: "Creditors Cycle",
      value: businessData.creditorsCycle,
    },
    {
      label: "Capital Invested",
      value: businessData.capitalInvested,
      formatter: formatCurrency,
    },
    {
      label: "Loan Funds (incl. CC limit)",
      value: businessData.loanFundsInclCcLimit,
    },
    {
      label: "Stock Maintained",
      value: businessData.stockMaintained,
    },
    {
      label: "Business Bank Accounts",
      value: businessData.businessBankAccounts,
    },
  ]);

  const incomeAssetsTable = renderTwoColumnTable([
    {
      label: "Co-Applicant Income",
      value: additionalIncome.coApplicantIncome,
      formatter: formatCurrency,
    },
    {
      label: "LIC / Insurance / Mediclaim",
      value: additionalIncome.licPaymentInsuranceMediclaim,
    },
    {
      label: "Share / Mutual Fund Investments",
      value: additionalIncome.shareMutualFundInvestments,
    },
    {
      label: "Cars / Two-Wheelers Owned",
      value: additionalIncome.carsTwoWheelersOwned,
    },
    {
      label: "Other Properties Owned",
      value: additionalIncome.otherPropertiesOwned,
    },
    {
      label: "Other Assets Owned",
      value: additionalIncome.otherAssetsOwned,
    },
  ]);

  const liabilitiesEntries = Array.isArray(liabilitiesRaw)
    ? liabilitiesRaw
    : Array.isArray(liabilitiesRaw?.items)
    ? liabilitiesRaw.items
    : hasValue(liabilitiesRaw)
    ? ensureArray(liabilitiesRaw)
    : [];

  const liabilitiesTable = renderMultiColumnTable(
    [
      {
        header: "From",
        valueGetter: (item) => item.from,
      },
      {
        header: "Nature of Loan",
        valueGetter: (item) =>
          item.natureOfLoan || item.nature || item.natureOfLoanAccountNo,
      },
      {
        header: "O/S Amount",
        valueGetter: (item) => item.amount || item.oSAmount,
        formatter: (value) => formatCurrency(value),
      },
      {
        header: "EMI",
        valueGetter: (item) => item.emi,
        formatter: (value) => formatCurrency(value),
      },
      {
        header: "Will Close / Continue",
        valueGetter: (item) => item.willCloseContinue,
      },
    ],
    liabilitiesEntries,
    "No other liabilities reported"
  );

  const budgetTable = renderTwoColumnTable([
    {
      label:
        "Total Monthly Income per month (Business income + Other Income)",
      value: budget.totalMonthlyIncomePerMonth,
    },
    {
      label: "Overall Family Expenses per month",
      value: budget.overAllFamilyExpenses,
    },
    {
      label: "PL / Auto Loan EMI",
      value: budget.plOrAutoLoanEMI,
      formatter: formatCurrency,
    },
    {
      label: "Other Loan EMI",
      value: budget.otherLoanEmi,
      formatter: formatCurrency,
    },
    {
      label: "Total Monthly Expenses per month",
      value: budget.totalMonthlyExpensesPerMonth,
    },
    {
      label: "Net Surplus",
      value: budget.netSurplus,
    },
    {
      label: "Affordable EMI",
      value: budget.affordableEmi,
      formatter: formatCurrency,
    },
  ]);

  const tradeReferenceTable = renderMultiColumnTable(
    [
      {
        header: "Name of the Person",
        valueGetter: (item) => item.nameOfThePerson,
      },
      {
        header: "Telephone No. / Address for Communication",
        valueGetter: (item) => item.contactDetails,
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
    </div>
  `;

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content axis-finance">
      ${renderCenteredTitle("Personal Discussion Sheet")}
      ${renderSection("Personal Details", personalDetailsTable)}
      ${renderSection("Family Background", familyTable + familySummaryTable)}
      ${renderTextSection(
        "General Lifestyle / Personality",
        familySection.generalLifestylePersonality
      )}
      ${renderSection("Residence & Collateral", residenceTable)}
      ${renderTextSection(
        "Company Profile",
        company.detailedProfileOfTheBusiness
      )}
      ${renderSection("Business / Employment Overview", employmentTable)}
      ${renderSection("Business Operations & Workforce", workforceTable)}
      ${renderSection("Business / Financial Profile", financialsTable)}
      ${renderSection("Other Income & Assets", incomeAssetsTable)}
      ${renderSection("Liabilities & Repayment Position", liabilitiesTable)}
      ${renderSection("Budget Analysis", budgetTable)}
      ${renderTextSection("End Use of Funds", budget.endUseOfFunds)}
      ${renderTextSection("Other Observations", budget.otherObservations)}
      ${renderSection("Trade References", tradeReferenceTable)}
      ${noteBlock}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
