import { format,  toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0";
const cellStyle =
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

const ensureArray = <T,>(value: T | T[] | undefined | null): T[] => {
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
            <td style="${cellStyle}">${wrapParagraph(label)}</td>
            <td style="${cellStyle}">${wrapParagraph(rendered)}</td>
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
          <td style="${cellStyle}">${instruction}</td>
          <td style="${cellStyle}">${value}</td>
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
        `<td style="${cellStyle};font-weight:bold;background:#f5f5f5;">${header}</td>`
    )
    .join("");
  const rowsHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td style="${cellStyle}">${cell}</td>`)
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
  const aboutBusiness = verificationData.aboutTheApplicantAndItsBusiness || [];
  const familyMembers = ensureArray(
    verificationData.applicantsFamilyDetails?.familyMembers
  ).map((member: any) => [
    formatMultiline(member?.name || ""),
    formatMultiline(member?.relation || ""),
    formatMultiline(member?.age || ""),
  ]);

  const existingLoans = ensureArray(
    verificationData.existingLoanDetails
  ).map((loan: any) => [
    formatMultiline(loan?.bankName || ""),
    formatMultiline(loan?.typeOfLoan || ""),
    formatCurrency(loan?.loanAmount),
    formatCurrency(loan?.emiInterest),
    formatMultiline(loan?.tenureTotalCompleted || ""),
  ]);

  const bankingDetails = ensureArray(
    verificationData.bankingDetails
  ).map((bank: any) => [
    formatMultiline(bank?.bankName || ""),
    formatMultiline(bank?.accountNo || ""),
    formatMultiline(bank?.accountType || ""),
    
  ]);

  const assets = ensureArray(verificationData.assets).map(
    (asset: any) => `<li>${formatMultiline(asset?.assetDetails || "")}</li>`
  );

  const customerReferences = ensureArray(
    verificationData.customersReferenceNumbers
  ).map(
    (item: any) =>
      `<li>${formatMultiline(item?.customerReferenceNumber || "")}</li>`
  );

  const otherIncomes = ensureArray(verificationData.otherIncomes).map(
    (item: any) => `<li>${formatMultiline(item?.otherIncome || "")}</li>`
  );

  const comfortFactors = ensureArray(verificationData.comfortFactor).map(
    (item: any) => `<li>${formatMultiline(item?.comfortFactor || "")}</li>`
  );

  const discomfortFactors = ensureArray(verificationData.discomfortFactor).map(
    (item: any) => `<li>${formatMultiline(item?.discomfortFactor || "")}</li>`
  );

  const recommendations = ensureArray(verificationData.Recommendations).map(
    (item: any) => formatMultiline(item?.recommendations || "")
  );

  const businessList = Array.isArray(aboutBusiness)
    ? aboutBusiness
        .map((item: any) =>
          hasValue(item?.aboutTheApplicant)
            ? `<li>${formatMultiline(item.aboutTheApplicant)}</li>`
            : ""
        )
        .join("")
    : hasValue(aboutBusiness?.details)
    ? `<li>${formatMultiline(aboutBusiness.details)}</li>`
    : hasValue(aboutBusiness)
    ? `<li>${formatMultiline(aboutBusiness)}</li>`
    : "";

  const generalSection = renderKeyValueTable([
    [
      "Name of the applicant",
      basic.nameOfTheApplicant || html_data?.loanDetails?.applicantName,
    ],
    ["Name of the co-applicant", basic.nameOfTheCoApplicant],
    ["Business name", basic.businessName],
    ["Constitution", basic.constitution],
    ["Visited Address", basic.visitedAddress],
    ["Loan Requested", formatCurrency(basic.loanRequested)],
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
    [
      "Bank Name",
      "A/c No",
      "A/c Type",
    ],
    bankingDetails
  );

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content">
      <p style="${paragraphStyle}"><strong>LIQUID INCOME PROGRAM REPORT</strong></p>
      ${generalSection}

      <p style="${paragraphStyle}"><strong>About the Applicant & Business:</strong></p>
      <ul>
        ${businessList || "<li>Not provided</li>"}
      </ul>

      <p style="${paragraphStyle}"><strong>Applicant's Family Details:</strong></p>
      ${familyTable}

      <p style="${paragraphStyle}"><strong>Assets: -</strong></p>
      <ul>
        ${assets.length ? assets.join("") : "<li>Not provided</li>"}
      </ul>

      <p style="${paragraphStyle}"><strong>Customers - Reference numbers:</strong></p>
      <ul>
        ${
          customerReferences.length
            ? customerReferences.join("")
            : "<li>Not provided</li>"
        }
      </ul>

      <p style="${paragraphStyle}"><strong>Other incomes:</strong></p>
      <ul>
        ${otherIncomes.length ? otherIncomes.join("") : "<li>Not provided</li>"}
      </ul>

      <p style="${paragraphStyle}"><strong>Existing Loan Details:</strong></p>
      ${existingLoanTable}

      <p style="${paragraphStyle}"><strong>Banking Details:</strong></p>
      ${bankingTable}

      <p style="${paragraphStyle}"><strong>ITR, Receipts, Verification, GP Margin & Expenses details:</strong></p>
      ${wrapParagraph(
        formatMultiline(
          verificationData.itrFinancialDetails
            ?.itrReceiptsVerificationInformation || ""
        )
      )}

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

      <p style="${paragraphStyle}"><strong>Recommendations:</strong> ${
        recommendations.length ? recommendations.join("<br>") : "Not provided"
      }</p>

      <p style="${paragraphStyle}"><strong>Disclaimer if any:</strong> ${
        verificationData.disclaimer ||
        "We estimated financials, purely based on the valid documents provided by the applicant."
      }</p>


      <br><br>
      <p style="${paragraphStyle}">Gross disposable income is sum of Net profit & interest depreciations</p>
      <ul><li>Business premises photo with customer & Vendor's Self to be attached in this report.</li></ul>

      <div style="page-break-before: always;"></div>
      <p style="${paragraphStyle}"><strong>Business Photos:</strong></p>
    </div>

 
    `;
};
