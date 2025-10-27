import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.template";

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

const renderInnerTable = (headers: string[], rows: string[][]) => {
  if (!rows.length) {
    return wrapParagraph("Not provided");
  }
  const headerRow = headers
    .map(
      (header) =>
        `<td style="${cellStyle};font-weight:bold;background:#f5f5f5;text-align:center;">${header}</td>`
    )
    .join("");
  const rowsHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td style="${cellStyle};text-align:center;">${cell || "-"}</td>`)
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

export const axisFinanceUBLTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });
  const basic = verificationData.basicDetails || {};
  const familyMembers = ensureArray(verificationData.familyDetails).map(
    (member: any) => [
      formatMultiline(member?.name || ""),
      formatMultiline(member?.relation || ""),
      formatMultiline(member?.age ? `${member.age} years` : ""),
      formatMultiline(member?.qualification || ""),
      formatMultiline(member?.occupation || ""),
      hasValue(member?.incomePerMonth)
        ? formatCurrency(member?.incomePerMonth)
        : "",
      formatMultiline(member?.dependent || ""),
    ]
  );

  const shareholding = ensureArray(verificationData.shareholdingDetails).map(
    (item: any) => [
      formatMultiline(item?.shareholderName || ""),
      formatMultiline(item?.relationWithMainApplicant || ""),
      formatMultiline(item?.designation || ""),
      formatMultiline(item?.shareholdingPercentage || ""),
      formatMultiline(item?.comingIntoLoanStructure || ""),
      formatMultiline(item?.functionalRole || ""),
    ]
  );

  const businessPoints = ensureArray(
    verificationData.businessOverview?.aboutBusiness
  )
    .map((entry: any) =>
      hasValue(entry?.detail)
        ? formatMultiline(entry.detail)
        : ""
    )
    .filter(Boolean)
    .join("<br>");

  const documentsObserved = ensureArray(
    verificationData.businessOverview?.documentsObserved
  )
    .map((doc: any) => {
      if (!hasValue(doc?.documentName) && !hasValue(doc?.remarks)) {
        return "";
      }
      const base = hasValue(doc?.documentName)
        ? formatMultiline(doc.documentName)
        : "Document";
      const extra = hasValue(doc?.remarks)
        ? ` – ${formatMultiline(doc.remarks)}`
        : "";
      return `<li>${base}${extra}</li>`;
    })
    .filter(Boolean)
    .join("");

  const suppliersSection = verificationData.suppliersCreditors || {};

  const suppliers = ensureArray(suppliersSection.topSuppliers).map(
    (supplier: any) =>
    [supplier?.name, supplier?.contactDetails, supplier?.location, supplier?.referenceCheck]
      .map(formatMultiline)
      .join(" - ")
  );

  const customersSection = verificationData.clientsDebtors || {};

  const customers = ensureArray(customersSection.topCustomers).map(
    (customer: any) =>
    [customer?.name, customer?.contactDetails, customer?.location, customer?.referenceCheck]
      .map(formatMultiline)
      .join(" - ")
  );

  const expenditureSection = verificationData.expenditure || {};

  const salaries = ensureArray(
    expenditureSection.salariesAndWages
  ).map((item: any) => [
    formatMultiline(item?.noOfEmployees || ""),
    formatMultiline(item?.salaryPerMonthPerEmployee || ""),
    formatMultiline(item?.statusOfEmployee || ""),
    formatMultiline(item?.noOfLabours || ""),
    formatMultiline(item?.wagesPerMonthOrDay || ""),
    formatMultiline(item?.statusOfLabour || ""),
    formatMultiline(item?.remarks || ""),
  ]);

  const assetSection = verificationData.assetDetails || {};

  const immovableProperties = ensureArray(
    assetSection.immovableProperties
  ).map((property: any) => [
    formatMultiline(property?.address || ""),
    formatMultiline(property?.areaMeasurements || ""),
    formatCurrency(property?.purchaseCostLakhs),
    formatMultiline(property?.purchaseYear || ""),
    formatCurrency(property?.marketValueLakhs),
    formatMultiline(property?.ownerName || ""),
    formatMultiline(property?.mortgaged || ""),
  ]);

  const vehicles = ensureArray(assetSection.vehicles || []).map(
    (vehicle: any) => `<li>${formatMultiline(vehicle || "")}</li>`
  );

  const existingLoans = ensureArray(verificationData.existingLoans).map(
    (loan: any) => [
      formatMultiline(loan?.bankOrNbfcName || ""),
      formatMultiline(loan?.typeOfLoan || ""),
      formatCurrency(loan?.sanctionedAmount),
      formatCurrency(loan?.outstandingBalance),
      formatCurrency(loan?.emiAmount),
      formatMultiline(loan?.emiPaidBank || ""),
      formatMultiline(loan?.securedAgainstAsset || ""),
    ]
  );

  const bankingAccounts = ensureArray(verificationData.bankingDetails).map(
    (account: any) => [
      formatMultiline(account?.bankName || ""),
      formatMultiline(account?.branchName || ""),
      formatMultiline(account?.accountType || ""),
      formatMultiline(account?.openSinceYear || ""),
    ]
  );

  const endUseOfLoan = verificationData.bankingDetails?.[0]?.endUseOfLoan || "";

  const thirdPartySection = verificationData.thirdPartyCheck || {};

  const thirdPartyReferences = ensureArray(
    thirdPartySection.references
  ).map((ref: any) => [
    formatMultiline(ref?.name || ""),
    formatMultiline(ref?.address || ""),
    formatMultiline(ref?.contactNo || ""),
    formatMultiline(ref?.knowingSince || ""),
    formatMultiline(ref?.feedbackOnBorrower || ""),
    formatMultiline(ref?.feedbackOnBusiness || ""),
  ]);

  const observations = ensureArray(thirdPartySection.observations)
    .map((item: any) => `<li>${formatMultiline(item || "")}</li>`)
    .join("");

  const recommendations = ensureArray(
    verificationData.recommendations?.recommendations
  )
    .map((item: any) => `<li>${formatMultiline(item || "")}</li>`)
    .join("");

  const generalTable = `
    <table style="${tableStyle}">
      <tr>
        <td colspan="21" style="${cellStyle}"><p style="${paragraphStyle}"><strong>PERSONAL DISCUSSION SHEET</strong></p></td>
      </tr>
      <tr>
        <td colspan="6" style="${cellStyle}"><strong>Region</strong></td>
        <td colspan="5" style="${cellStyle}"><strong>Location</strong></td>
        <td colspan="5" style="${cellStyle}"><strong>Branch</strong></td>
        <td colspan="5" style="${cellStyle}"><strong>Ref No/Application No</strong></td>
      </tr>
      <tr>
        <td colspan="6" style="${cellStyle}">${formatMultiline(basic.region)}</td>
        <td colspan="5" style="${cellStyle}">${formatMultiline(basic.location)}</td>
        <td colspan="5" style="${cellStyle}">${formatMultiline(basic.branch)}</td>
        <td colspan="5" style="${cellStyle}">${formatMultiline(
          basic.applicationNo || html_data.applicationNumber
        )}</td>
      </tr>
      ${[
        ["Name of Customer", basic.customerName],
        ["Date of Report", basic.dateOfReport],
        ["Name of Concern", basic.concernName],
        ["Constitution", basic.constitution],
        ["Initiated Address", basic.initiatedAddress],
        ["Visited Address", basic.visitedAddress],
        ["Phone no.", basic.phoneNumber],
        ["Appointment Fixed", basic.appointmentFixed],
        ["Structure of Loan", basic.structureOfLoan],
        ["No. of Visit", basic.numberOfVisits],
        ["Person Met", basic.personMet],
        ["Visited By", basic.visitedBy],
        ["About Applicant", basic.aboutApplicant],
        ["Residential Details", basic.residentialDetails],
        ["Co-Applicant Details", basic.coApplicantDetails],
      ]
        .map(
          ([label, value]) => `
        <tr>
          <td style="${cellStyle}"><strong>${label}</strong></td>
          <td colspan="20" style="${cellStyle}">${formatMultiline(value)}</td>
        </tr>`
        )
        .join("")}
    </table>
  `;

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content">
      ${generalTable}

      <p style="${paragraphStyle}"><strong>Family Details</strong></p>
      ${renderInnerTable(
        [
          "Name",
          "Relation with Applicant",
          "Age(Yrs)",
          "Qualification",
          "Occupation",
          "Income per month (approx.)",
          "Dependent",
        ],
        familyMembers
      )}

      <p style="${paragraphStyle}"><strong>Shareholding Details</strong></p>
      ${renderInnerTable(
        [
          "Name of the Shareholder",
          "Relation with Main Applicant",
          "Designation",
          "% of Shareholding",
          "Coming into Loan Structure",
          "Functional of Partner / Director",
        ],
        shareholding
      )}

      <p style="${paragraphStyle}"><strong>About the Business</strong></p>
      ${renderKeyValueTable([
        ["About the Business", businessPoints || "Not provided"]
      ])}

      <p style="${paragraphStyle}"><strong>Documents Observed</strong></p>
      ${renderInnerTable(
        [
          "Document Category",
          "Document Name", 
          "Document Type",
          "Remarks"
        ],
        ensureArray(verificationData.businessOverview?.documentsObserved).map((doc: any) => [
          formatMultiline(doc?.documentCategory || ""),
          formatMultiline(doc?.documentName || ""),
          formatMultiline(doc?.documentType || ""),
          formatMultiline(doc?.remarks || "")
        ])
      )}

      <p style="${paragraphStyle}"><strong>Suppliers / Creditors</strong></p>
      ${renderKeyValueTable([
        [
          "No of fixed suppliers",
          suppliersSection.numberOfFixedSuppliers || "Not provided",
        ],
        [
          "Credit period",
          suppliersSection.creditPeriodDays || "Not provided",
        ],
        [
          "Cash - Cheque proportion",
          suppliersSection.cashChequeProportion || "Not provided",
        ],
      ])}
      ${renderInnerTable(
        [
          "Name (top 3 Suppliers)",
          "Contact Details",
          "Location",
          "Ref. Check"
        ],
        ensureArray(suppliersSection.topSuppliers).map((supplier: any) => [
          formatMultiline(supplier?.name || ""),
          formatMultiline(supplier?.contactDetails || ""),
          formatMultiline(supplier?.location || ""),
          formatMultiline(supplier?.referenceCheck || "")
        ])
      )}

      <p style="${paragraphStyle}"><strong>Clients / Debtors</strong></p>
      ${renderKeyValueTable([
        [
          "No of fixed customers",
          customersSection.numberOfFixedCustomers || "Not provided",
        ],
        [
          "Credit period",
          customersSection.creditPeriodDays || "Not provided",
        ],
        [
          "Cash - Cheque proportion",
          customersSection.cashChequeProportion || "Not provided",
        ],
      ])}
      ${renderInnerTable(
        [
          "Name (top 3 Customers)",
          "Contact Details",
          "Location",
          "Ref. Check"
        ],
        ensureArray(customersSection.topCustomers).map((customer: any) => [
          formatMultiline(customer?.name || ""),
          formatMultiline(customer?.contactDetails || ""),
          formatMultiline(customer?.location || ""),
          formatMultiline(customer?.referenceCheck || "")
        ])
      )}
      ${renderKeyValueTable([
        [
          "Average stock maintained",
          customersSection.averageStockMaintained || "Not provided",
        ],
        [
          "Turnover & margins",
          customersSection.turnoverAndMargins || "Not provided",
        ],
      ])}

      <p style="${paragraphStyle}"><strong>Expenditure - Salaries & Wages</strong></p>
      ${renderInnerTable(
        [
          "No. of Employees",
          "Salary per month per employee",
          "Status of employee",
          "No. of labours",
          "Wages per month/per day",
          "Status of labour",
          "Remarks",
        ],
        salaries
      )}
      ${renderKeyValueTable([
        ["Working Hours", expenditureSection.workingHours],
        [
          "Other major expenses & basis",
          expenditureSection.otherMajorExpensesAndBasis,
        ],
      ])}

      <p style="${paragraphStyle}"><strong>Asset Details</strong></p>
      <p style="${paragraphStyle}">All Immovable properties held that is Residential, Commercial, Land, Plot and any fixed structure:</p>
      
      ${renderInnerTable(
        [
          "Address",
          "Area measured (Sq.ft)",
          "Purchase cost (in Lakhs)",
          "Purchase Year",
          "Market value (in Lakhs)",
          "Owner Name",
          "Mortgaged (Yes/No)",
        ],
        immovableProperties
      )}
      ${renderKeyValueTable([
        [
          "Any Liquid, Moveable & Monetary items such as Cash, Gold, FD, RD, Mutual Fund Holdings, Shares, Bonds, Securities",
          assetSection.liquidMoveableAssets || "NA",
        ],
        [
          "Life Insurance, Mediclaim, Property/Asset Insurance (Premium & Sum Assured)",
          assetSection.insurances || "NA",
        ],
        [
          "Capital invested in any business, Loans & Advances given",
          assetSection.capitalInvestedLoans || "NA",
        ],
        [
          "Car, Bike and any other vehicle (Company Name and Model)",
          vehicles.length ? vehicles.join(", ") : "NA",
        ],
      ])}

      <p style="${paragraphStyle}"><strong>Loan Details</strong></p>
      ${renderInnerTable(
        [
          "Name of Bank / NBFC",
          "Type of Loan",
          "Sanctioned Amount (in Lakhs)",
          "O/S Balance",
          "EMI (in Rs.)",
          "EMI Paid Bank",
          "Secured against which asset",
        ],
        existingLoans
      )}

      <p style="${paragraphStyle}"><strong>Bank Details</strong></p>
      ${renderInnerTable(
        ["Bank Name", "Branch Name", "Account Type", "Open since (Year)"],
        bankingAccounts
      )}

      ${renderKeyValueTable([
        ["End Use of Loan: (Loan Amount & Detailed End-Use)", endUseOfLoan || "Not provided"]
      ])}

      <p style="${paragraphStyle}"><strong>Third Party Check</strong></p>
      ${renderInnerTable(
        [
          "Individual / Business Name",
          "Address",
          "Contact No.",
          "Knowing Since",
          "Feedback on borrower",
          "Feedback on business",
        ],
        thirdPartyReferences
      )}
      ${renderKeyValueTable([
        ["Observation:", observations || "Not provided"],
      ])}
      ${renderKeyValueTable([
        ["Other Income: (Income from other than initiated business)", thirdPartySection.otherIncome || "NA"],
        ["Site Coordinates:", thirdPartySection.siteCoordinates || ""],
      ])}
      ${renderKeyValueTable([
        ["Remarks:", thirdPartySection.remarks || ""],
        ["Status:", thirdPartySection.status || ""],
        ["AFL Verifier's Name & Emp Code:", thirdPartySection.verifierNameEmpCode || ""],
        ["AFL Verifier's Signature:", thirdPartySection.verifierSignature || ""],
      ])}

      


      <p style="${paragraphStyle}"><strong>Disclaimer if any:</strong> ${formatMultiline(
        verificationData.recommendations?.disclaimer ||
          "We estimated financials, purely based on the valid documents provided by the applicant."
      )}</p>

      <p style="${paragraphStyle}">Gross disposable income is sum of Net profit & interest depreciations</p>
      <ul><li>Business premises photo with customer & Vendor's Self to be attached in this report.</li></ul>
      <p style="${paragraphStyle}"><strong>Business Photos:</strong></p>
    </div>
 
    `;
};
