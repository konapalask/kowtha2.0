import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";
import { getFinancialYearEndingYear } from "src/modules/loan/financials-schema/statement3";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0";
const labelCellStyle =
  "border:1px solid #ccc;padding:8px;font-weight:bold;vertical-align:top;line-height:1.5";
const valueCellStyle =
  "border:1px solid #ccc;padding:8px;vertical-align:top;line-height:1.5";
const paragraphStyle = "margin:8px 0;line-height:1.5;font-size:14px;color:#333";

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

const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const wrapParagraph = (content: string) =>
  `<p style="${paragraphStyle}">${content}</p>`;

const bulletList = (items: string[]) =>
  items.length
    ? `<ul style="margin:4px 0 0 18px;padding-left:18px;">${items
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`
    : "";

const renderKeyValueTable = (
  rows: Array<[string, any, ((value: any) => string)?]>
) => {
  if (!rows.length) return "";
  return `
    <table style="${tableStyle}">
      ${rows
        .map(([label, value, formatter]) => {
          const rendered = formatter
            ? formatter(value)
            : formatMultiline(value);
          return `
          <tr>
            <td style="${labelCellStyle}">${wrapParagraph(label)}</td>
            <td style="${valueCellStyle}">${wrapParagraph(rendered)}</td>
          </tr>`;
        })
        .join("")}
    </table>
  `;
};

const renderInstructionTable = (
  rows: Array<{ instruction: string; value: any }>
) => {
  if (!rows.length) return "";
  return `
    <table style="${tableStyle}">
      ${rows
        .map(
          ({ instruction, value }) => `
        <tr>
          <td style="${labelCellStyle}">${instruction}</td>
          <td style="${valueCellStyle}">${value}</td>
        </tr>`
        )
        .join("")}
    </table>
  `;
};

const renderInnerTable = (headers: string[], rows: string[][]) => {
  if (!rows.length) {
    return wrapParagraph("Not provided");
  }
  const headerRow = headers
    .map(
      (header) =>
        `<td style="${labelCellStyle};font-weight:bold;background:#f5f5f5;">${header}</td>`
    )
    .join("");
  const rowsHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td style="${valueCellStyle}">${cell}</td>`)
          .join("")}</tr>`
    )
    .join("");
  return `
    <table style="${tableStyle}">
      <tr>${headerRow}</tr>
      ${rowsHtml}
    </table>
  `;
};

export const cholaTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  const basic = verificationData.basicInformation || {};
  const aboutBusiness = verificationData.aboutTheApplicantAndItsBusiness || {};
  const residentialDetails = verificationData.rlabelCellStyleesidentialDetails || {};
  const assetsOwnedByTheApplicant = verificationData.assetsOwnedByTheApplicant || {};
  const applicantsNetWorth = verificationData.applicantsNetWorth || {};
  const familyMembers = ensureArray(
    verificationData.applicantsFamilyDetails?.familyMembers
  ).map((member: any) => [
    formatMultiline(member?.name || ""),
    formatMultiline(member?.relation || ""),
    formatMultiline(member?.age || ""),
    formatMultiline(member?.qualification || ""),
    formatMultiline(member?.occupation || ""),
  ]);

  // Handle nested structures for existing loans
  const existingLoansData =
    verificationData.existingLoanDetails ||
    verificationData.existingLoans ||
    {};
  const existingLoansArray = ensureArray(existingLoansData?.loanDetails);
  const existingLoans = existingLoansArray.map(
    (loan: any) => [
      formatMultiline(loan?.bankName || loan?.bankOrNbfcName || ""),
      formatMultiline(loan?.typeOfLoan || ""),
      formatCurrency(loan?.loanAmount || loan?.sanctionedAmount),
      formatCurrency(loan?.emiInterest || loan?.emi || loan?.emiAmount),
      formatMultiline(loan?.tenureTotalCompleted || loan?.tenure || ""),
    ]
  );
  // Handle nested structures for banking details
  const bankingDetailsData = verificationData.bankingDetails || {};
  const bankingDetailsArray = Array.isArray(bankingDetailsData)
    ? bankingDetailsData
    : Array.isArray(bankingDetailsData.bankingDetails)
      ? bankingDetailsData.bankingDetails
      : [];
  const bankingDetails = ensureArray(bankingDetailsArray).map((bank: any) => [
    formatMultiline(bank?.bankName || ""),
    formatMultiline(bank?.accountNo || bank?.accountNumber || ""),
    formatMultiline(bank?.accountType || ""),
    formatCurrency(bank?.averageBalance || 0),
  ]);

  // Handle nested structures for assets
  const assetsSection = verificationData.assets || {};
  const assetsArray = Array.isArray(assetsSection.assetDetails)
    ? assetsSection.assetDetails
    : [];

  const assets = assetsArray.length
    ? assetsArray
        .map(
          (asset: any) =>
            `<ul><li>${formatMultiline(asset?.assetDetails || asset?.details || "")}</li></ul>`
        )
        .join("")
    : "Not provided";

  // Handle nested structures for customer references
  const customerReferences = ensureArray(verificationData.customersReference?.customersReference).map((item: any) => [formatMultiline(item?.customerName || ""), formatMultiline(item?.customerReferenceNumber || ""), formatMultiline(item?.feedback || "")]);
  const supplierReferences = ensureArray(verificationData.suppliersReference?.suppliersReference).map((item: any) => [formatMultiline(item?.supplierName || ""), formatMultiline(item?.supplierReferenceNumber || ""), formatMultiline(item?.feedback || "")]);

  // Handle nested structures for other incomes
  const otherIncomes = verificationData.otherIncomes || [];

  // Handle comfort factors - now a simple string field
  const comfortFactorsText =
    verificationData.comfortFactor?.comfortFactors || "";
  const comfortFactors = comfortFactorsText ? String(comfortFactorsText).split("\n").filter((line: string) => line.trim()).map((line: string) => `<li>${line.trim()}</li>`) : [];

  // Handle discomfort factors - now a simple string field
  const discomfortFactorsText =
    verificationData.discomfortFactor?.discomfortFactors || "";
  const discomfortFactors = discomfortFactorsText ? String(discomfortFactorsText).split("\n").filter((line: string) => line.trim()).map((line: string) => `<li>${line.trim()}</li>`).join("") : "";

  const tpcDetails = verificationData.thirdPartyChecks?.tpcDetails || "";
  // Handle recommendations - now a simple string field
  const recommendationsText =
    verificationData.Recommendations?.recommendations || "";
  const recommendations = recommendationsText ? String(recommendationsText).split("\n").filter((line: string) => line.trim()).map((line: string) => `<li>${line.trim()}</li>`).join("") : "";
  
  const incomeDetails = verificationData.incomeDetails || {};

  const estimatedProfitAndLoss = verificationData?.estimatedProfitAndLoss || {};




  const businessList = 
      `<p style="${paragraphStyle}"><strong>About the Applicant & Business content:</strong><br>${aboutBusiness?.aboutTheApplicant ? aboutBusiness?.aboutTheApplicant.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("") : "Not Provided"}</p>
    <p style="${paragraphStyle}"><strong>Residential Details:</strong> ${residentialDetails?.residentialDetails ? residentialDetails?.residentialDetails.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("") : "Not Provided"}</p>
    <p style="${paragraphStyle}"><strong>About the Business's Industry Overview:</strong><br>${aboutBusiness?.aboutTheBusiness ? aboutBusiness?.aboutTheBusiness.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("") : "Not Provided"}</p>`


  const generalSection = renderKeyValueTable([
    [
      "Name of the applicant",
      basic.nameOfTheApplicant || html_data?.loanDetails?.applicantName,
    ],
    ["Name of the co-applicant", basic.nameOfTheCoApplicant],
    ["Business name", basic.businessName],
    ["Constitution", basic.constitution],
    ["Visited Address", basic.visitedAddress],
    ["Loan Requested", formatCurrency(basic.loanAmountRequested)],
    ["Purpose of loan", basic.purposeOfLoan],
    ["Date of visit", basic.dateOfVisit],
    ["Person met", basic.personMet],
  ]);

  const familyTable =
    familyMembers.length > 0
      ? renderInnerTable(["Name", "Relationship", "Age", "Qualification", "Occupation"], familyMembers)
      : wrapParagraph("Not provided");

      const customerReferenceTable = renderInnerTable([
        "Name",
        "Number",
        "Feedback",
      ], customerReferences);

      const supplierReferenceTable = renderInnerTable([
        "Name",
        "Number",
        "Feedback",
      ], supplierReferences);

  // Render existing loan table with Total EMI footer
  const existingLoanHeaders = [
    "Bank Name",
    "Type of Loan",
    "Loan Amount (In Rs.)",
    "EMI/Interest (In Rs.)",
    "Total Tenure / Completed [in months]",
  ];
  const existingLoanTable = existingLoans.length > 0
    ? (() => {
        const headerRow = existingLoanHeaders
          .map(
            (header) =>
              `<td style="${labelCellStyle};font-weight:bold;background:#f5f5f5;">${header}</td>`
          )
          .join("");
        const rowsHtml = existingLoans
          .map(
            (row) =>
              `<tr>${row
                .map((cell) => `<td style="${valueCellStyle}">${cell}</td>`)
                .join("")}</tr>`
          )
          .join("");
        const totalEMIRow = `<tr>
          <td style="${valueCellStyle}"></td>
          <td style="${valueCellStyle}"></td>
          <td style="${labelCellStyle};font-weight:bold;background:#f5f5f5;">Total EMI</td>
          <td style="${valueCellStyle}">${formatCurrency(existingLoansData?.totalEmi)}</td>
          <td style="${valueCellStyle}"></td>
        </tr>`;
        return `
          <table style="${tableStyle}">
            <tr>${headerRow}</tr>
            ${rowsHtml}
            ${totalEMIRow}
          </table>
        `;
      })()
    : wrapParagraph("Not provided");

  const bankingTable = renderInnerTable(
    ["Bank Name", "A/c No", "A/c Type", "Average Balance"],
    bankingDetails
  );

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content">
      <p style="text-align: center; ${paragraphStyle}"><strong><u>LIQUID INCOME PROGRAM REPORT</u></strong></p>
      ${generalSection}

      ${businessList || "<li>Not provided</li>"}


      
      <p style="${paragraphStyle}"><strong>Assets Owned by the Applicant: -</strong></p>
        ${assets}
      <p style="${paragraphStyle}"><strong>Applicant's Net Worth: </strong>  ${formatMultiline(applicantsNetWorth?.applicantsNetWorth || "Not provided")}</p>
     
      <p style="${paragraphStyle}"><strong>Applicant's Family Details:</strong></p>
      ${familyTable}

      <p style="${paragraphStyle}"><strong>Customer Reference Details:</strong></p>
      ${customerReferenceTable}

      <p style="${paragraphStyle}"><strong>Supplier Reference Details:</strong></p>
      ${supplierReferenceTable}

      <p style="${paragraphStyle}"><strong>Other incomes:</strong></p>
      ${ensureArray(otherIncomes?.otherIncomes)
        .map((item: any) => `<ul><li>${item?.otherIncome || ""}</li></ul>`)
        .join("")}

      <p style="${paragraphStyle}"><strong>Existing Loan Details:</strong></p>
      ${existingLoanTable}

      <p style="${paragraphStyle}"><strong>Banking Details:</strong></p>
      ${bankingTable}

      <p style="${paragraphStyle}"><strong>ITR, Receipts, Verification, GP Margin & Expenses details:</strong></p>
      <p style="margin-left: 8px;">${formatMultiline(
        verificationData.itrFinancialDetails
          ?.itrReceiptsVerificationInformation || ""
      )}</p>

      <p style="${paragraphStyle}"><strong>Comfort Factor: -</strong></p>
      <ul>
        ${
          comfortFactors.length
            ? comfortFactors.join("")
            : "Not provided"
        }
      </ul>

      <p style="${paragraphStyle}"><strong>Discomfort Factor: -</strong></p>
      <ul>
        ${
          discomfortFactors
            ? discomfortFactors
            : "Not provided"
        }
      </ul>

      <p style="${paragraphStyle}"><strong>TPC (Third Party check) Details:</strong></p>
        ${
          tpcDetails
            ? String(tpcDetails).split("\n").filter((line: string) => line.trim()).map((line: string) => `<ul><li>${line.trim()}</li></ul>`).join("")
            : "Not provided"
        }

      <p style="${paragraphStyle}"><strong>Recommendations:-</strong></p>
      <ul>
        ${
          recommendations
            ? recommendations
            : "Not provided"
        }
      </ul>


      <p style="${paragraphStyle}"><strong>Disclaimer if any:</strong> ${verificationData?.disclaimer?.disclaimer || "Not provided"}</p>


      
      <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle};text-align:center;background:#f5f5f5;" colspan="4"><strong>Estimated Profit & Loss Account For the year ended 31st March ${getFinancialYearEndingYear()}</strong></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};text-align:center;background:#f5f5f5;">Expenditure</td>
          <td style="${labelCellStyle};text-align:center;background:#f5f5f5;">Ampunt (In Rs.)</td>
          <td style="${labelCellStyle};text-align:center;background:#f5f5f5;">Income</td>
          <td style="${labelCellStyle};text-align:center;background:#f5f5f5;">Amount (In Rs.)</td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Opening Stock</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.openingStock)}</td>
          <td style="${labelCellStyle};">Gross Receipts</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.grossReceipts)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Purchases</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.purchases)}</td>
          <td style="${labelCellStyle};">Other Income</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.otherIncome)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Other Direct Expenses</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.otherDirectExpenses)}</td>
          <td style="${labelCellStyle};">closing Stock</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.closingStock)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Gross Profit</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.grossProfitExpenditure)}</td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};background:yellow;">Total</td>
          <td style="${labelCellStyle};background:yellow;">${formatCurrency(estimatedProfitAndLoss?.totalExpenditure)}</td>
          <td style="${labelCellStyle};background:yellow;"></td>
          <td style="${labelCellStyle};background:yellow;">${formatCurrency(estimatedProfitAndLoss?.totalIncome)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">salaries</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.salaries)}</td>
          <td style="${labelCellStyle};">Gross Profit</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.grossProfitIncome)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Rent Expenses</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.rentExpenses)}</td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Electricity</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.electricity)}</td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Transport/Travelling</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.transportOrTravelling)}</td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">General Expenses</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.generalExpenses)}</td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Maintenance Expenses</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.maintenanceExpenses)}</td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Other Indirect Expenses</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.otherIndirectExpenses)}</td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};">Net Profit</td>
          <td style="${labelCellStyle};">${formatCurrency(estimatedProfitAndLoss?.netProfitExpenditure)}</td>
          <td style="${labelCellStyle};"></td>
          <td style="${labelCellStyle};"></td>
        </tr>
        <tr>
          <td style="${labelCellStyle};background:yellow;">Total</td>
          <td style="${labelCellStyle};background:yellow;">${formatCurrency(estimatedProfitAndLoss?.totalNetProfitExpenditure)}</td>
          <td style="${labelCellStyle};background:yellow;"></td>
          <td style="${labelCellStyle};background:yellow;">${formatCurrency(estimatedProfitAndLoss?.totalNetProfitIncome)}</td>
        </tr>
      </table>



      <p style="${paragraphStyle}"><strong>Total Gross Disposable Income (A):</strong> <span style="margin-left: 8px;">${formatCurrency(incomeDetails?.totalGrossDisposableIncome)}</span> per month</p>
      <p style="${paragraphStyle}"><strong>Total Obligations (B):</strong> <span style="margin-left: 8px;">${formatCurrency(incomeDetails?.totalObligations)}</span> per month</p>
      <p style="${paragraphStyle}"><strong>Net Disposable Income (C = A - B):</strong> <span style="margin-left: 8px;">${formatCurrency(incomeDetails?.netDisposableIncome)}</span> per month</p>

      <p style="${paragraphStyle}">*Gross disposable income is sum of Net profit & interest depreciations</p>

      <p style="${paragraphStyle}"><strong>PD Status:</strong> ${html_data.approvedStatus || "Not provided"}</p>

    </div>
    ${pdBaseTemplateFooter(html_data)}

 
    `;
};
