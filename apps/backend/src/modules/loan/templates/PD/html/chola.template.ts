import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0";
const labelCellStyle =
  "border:1px solid #ccc;padding:8px;font-weight:bold;vertical-align:top;line-height:1.5";
const valueCellStyle =
  "border:1px solid #ccc;padding:8px;vertical-align:top;line-height:1.5";
const paragraphStyle = "margin:8px 0;line-height:1.5;font-size:12px;color:#333";

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
  const familyMembers = ensureArray(
    verificationData.applicantsFamilyDetails?.familyMembers
  ).map((member: any) => [
    formatMultiline(member?.name || ""),
    formatMultiline(member?.relation || ""),
    formatMultiline(member?.age || ""),
  ]);

  // Handle nested structures for existing loans
  const existingLoansData =
    verificationData.existingLoanDetails ||
    verificationData.existingLoans ||
    {};
  const existingLoans = ensureArray(existingLoansData?.loanDetails).map(
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
            `<li>${formatMultiline(asset?.assetDetails || asset?.details || "")}</li>`
        )
        .join("")
    : "<li>Not provided</li>";

  // Handle nested structures for customer references
  const customerReferences = verificationData.customersReferenceNumbers || [];

  // Handle nested structures for other incomes
  const otherIncomes = verificationData.otherIncomes || [];

  // Handle comfort factors - now a simple string field
  const comfortFactorsText =
    verificationData.comfortFactor?.comfortFactors || "";
  const comfortFactors = comfortFactorsText
    ? comfortFactorsText
        .split(/\n+/)
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => `<li>${line.trim()}</li>`)
    : [];

  // Handle discomfort factors - now a simple string field
  const discomfortFactorsText =
    verificationData.discomfortFactor?.discomfortFactors || "";
  const discomfortFactors = discomfortFactorsText
    ? discomfortFactorsText
        .split(/\n+/)
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => `<li>${line.trim()}</li>`)
    : [];

  // Handle recommendations - now a simple string field
  const recommendationsText =
    verificationData.Recommendations?.recommendations || "";
  const recommendations = recommendationsText
    ? recommendationsText
        .split(/\n+/)
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => `<li>${line.trim()}</li>`)
    : [];

  const businessList = [
    hasValue(aboutBusiness?.aboutTheApplicant)
      ? `<p style="${paragraphStyle}"><strong>About the Applicant:</strong><br>${
          aboutBusiness?.aboutTheApplicant
            ?.split("\n")
            .map(
              (line: string) =>
                `<ul style="margin-left: 8px;"><li>${line}</li></ul>`
            )
            .join("") || ""
        }</p>`
      : "",
    hasValue(aboutBusiness?.aboutTheBusiness)
      ? `<p style="${paragraphStyle}"><strong>About the Business:</strong><br>${
          aboutBusiness?.aboutTheBusiness
            ?.split("\n")
            .map(
              (line: string) =>
                `<ul style="margin-left: 8px;"><li>${line}</li></ul>`
            )
            .join("") || ""
        }</p>`
      : "",
  ]
    .filter((item) => item !== "")
    .join("");

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
      ? renderInnerTable(["Name", "Relationship", "Age"], familyMembers)
      : wrapParagraph("Not provided");

  const existingLoanTable = renderInnerTable(
    [
      "Bank Name",
      "Type of Loan",
      "Loan Amount (In Rs.)",
      "EMI/Interest (In Rs.)",
      "Total Tenure / Completed [in months]",
    ],
    existingLoans
  );

  const bankingTable = renderInnerTable(
    ["Bank Name", "A/c No", "A/c Type"],
    bankingDetails
  );

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content">
      <p style="${paragraphStyle}"><strong>LIQUID INCOME PROGRAM REPORT</strong></p>
      ${generalSection}

      <p style="${paragraphStyle}"><strong><u>About the Applicant & Business</u></strong></p>
        ${businessList || "<li>Not provided</li>"}

      <p style="${paragraphStyle}"><strong>Applicant's Family Details:</strong></p>
      ${familyTable}

      <p style="${paragraphStyle}"><strong>Assets: -</strong></p>
      <ul>
        ${assets}
      </ul>

      <p style="${paragraphStyle}"><strong>Customers - Reference numbers:</strong></p>
      <ul>
      ${ensureArray(customerReferences?.customerReferenceNumbers)
        .map((item: any) => `<li>${item?.customerReferenceNumber || ""}</li>`)
        .join("")}
      </ul>

      <p style="${paragraphStyle}"><strong>Other incomes:</strong></p>
      <ul>
      ${ensureArray(otherIncomes?.otherIncomes)
        .map((item: any) => `<li>${item?.otherIncome || ""}</li>`)
        .join("")}
      </ul>

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
            : "<li>Not provided</li>"
        }
      </ul>

      <p style="${paragraphStyle}"><strong>Discomfort Factor: -</strong></p>
      <ul>
        ${
          discomfortFactors.length
            ? discomfortFactors.join("")
            : "<li>Not provided</li>"
        }
      </ul>

      <p style="${paragraphStyle}"><strong>Recommendations:-</strong></p>
      <ul>
        ${
          recommendations.length
            ? recommendations.join("")
            : "<li>Not provided</li>"
        }
      </ul>

      <p style="${paragraphStyle}"><strong>PD Status:</strong> ${html_data.approvedStatus || "Not provided"}</p>

      <p style="${paragraphStyle}"><strong>Disclaimer if any:</strong> ${verificationData?.disclaimer?.disclaimer || "Not provided"}</p>
    </div>
    ${pdBaseTemplateFooter(html_data)}

 
    `;
};
