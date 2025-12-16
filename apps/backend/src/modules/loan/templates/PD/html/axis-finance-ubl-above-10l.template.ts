import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;background:#b6bec3;vertical-align:top;width:25%";
const cellStyle =
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
    .map((header) => `<td style="${labelCellStyle}">${header}</td>`)
    .join("");
  const rowsHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell) =>
              `<td style="${cellStyle};text-align:center;">${cell || "-"}</td>`
          )
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

export const axisFinanceUBLTemplate = (
  verificationData: any,
  html_data: any
) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });
  const basic = verificationData.basicDetails || {};
  // Handle both possible structures: familyDetails.familyDetails or familyDetails.familyMembers or just familyDetails array
  const familyDetailsData = verificationData.familyDetails || {};
  const familyMembers = ensureArray(familyDetailsData.details).map(
    (member: any) => [
      formatMultiline(member?.name || "Not provided"),
      formatMultiline(member?.relation || "Not provided"),
      formatMultiline(member?.age ? `${member.age} years` : "Not provided"),
      formatMultiline(member?.qualification || "Not provided"),
      formatMultiline(member?.occupation || "Not provided"),
      formatCurrency(member?.incomePerMonth || "Not provided"),
      formatMultiline(member?.dependent || "Not provided"),
    ]
  );

  // Handle both possible structures: shareholdingDetails.shareholdingDetails or shareholdingDetails array
  const shareholdingData = verificationData.shareholdingDetails || {};
  const shareholdingArray = Array.isArray(shareholdingData)
    ? shareholdingData
    : Array.isArray(shareholdingData.shareholdingDetails)
      ? shareholdingData.shareholdingDetails
      : [];
  const shareholding = ensureArray(shareholdingArray).map((item: any) => [
    formatMultiline(item?.shareholderName || ""),
    formatMultiline(item?.relationWithMainApplicant || ""),
    formatMultiline(item?.designation || ""),
    formatMultiline(item?.shareholdingPercentage || ""),
    formatMultiline(item?.comingIntoLoanStructure || ""),
    formatMultiline(item?.functionalRole || ""),
  ]);

  const businessPoints = formatMultiline(
    verificationData.businessOverview?.aboutBusiness
  );
  const businessPointsList =
    businessPoints && businessPoints !== "Not provided"
      ? businessPoints
          .split(/<br\s*\/?>|\n/g)
          .map((line: string) => line.trim())
          .filter(Boolean)
      : [];

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
      [
        supplier?.name,
        supplier?.contactDetails,
        supplier?.location,
        supplier?.referenceCheck,
      ]
        .map(formatMultiline)
        .join(" - ")
  );

  const customersSection = verificationData.clientsDebtors || {};

  const customers = ensureArray(customersSection.topCustomers).map(
    (customer: any) =>
      [
        customer?.name,
        customer?.contactDetails,
        customer?.location,
        customer?.referenceCheck,
      ]
        .map(formatMultiline)
        .join(" - ")
  );

  const expenditureSection = verificationData.expenditure || {};

  const salaries = ensureArray(expenditureSection.salariesAndWages).map(
    (item: any) => [
      formatMultiline(item?.noOfEmployees || ""),
      formatMultiline(item?.salaryPerMonthPerEmployee || ""),
      formatMultiline(item?.statusOfEmployee || ""),
      formatMultiline(item?.noOfLabours || ""),
      formatMultiline(item?.wagesPerMonthOrDay || ""),
      formatMultiline(item?.statusOfLabour || ""),
      formatMultiline(item?.remarks || ""),
    ]
  );

  const assetSection = verificationData.assetDetails || {};

  const immovableProperties = ensureArray(assetSection.immovableProperties).map(
    (property: any) => [
      formatMultiline(property?.address || ""),
      formatMultiline(property?.areaMeasurements || ""),
      formatCurrency(property?.purchaseCostLakhs),
      formatMultiline(property?.purchaseYear || ""),
      formatCurrency(property?.marketValueLakhs),
      formatMultiline(property?.ownerName || ""),
      formatMultiline(property?.mortgaged || ""),
    ]
  );

  const vehicles = ensureArray(assetSection.vehicles || []).map(
    (vehicle: any) => `<li>${formatMultiline(vehicle || "")}</li>`
  );

  // Handle both possible structures: existingLoans.loans or existingLoans array
  const existingLoansData = verificationData.existingLoans || {};
  const existingLoansArray = Array.isArray(existingLoansData)
    ? existingLoansData
    : Array.isArray(existingLoansData.loans)
      ? existingLoansData.loans
      : [];
  const existingLoans = ensureArray(existingLoansArray).map((loan: any) => [
    formatMultiline(loan?.bankOrNbfcName || ""),
    formatMultiline(loan?.typeOfLoan || ""),
    formatCurrency(loan?.sanctionedAmount),
    formatCurrency(loan?.outstandingBalance),
    formatCurrency(loan?.emiAmount),
    formatMultiline(loan?.emiPaidBank || ""),
    formatMultiline(loan?.securedAgainstAsset || ""),
  ]);

  // Handle both possible structures: bankingDetails.bankingDetails or bankingDetails array
  const bankingDetailsData = verificationData.bankingDetails || {};
  const bankingAccounts = ensureArray(bankingDetailsData?.banks).map(
    (account: any) => [
      account?.bankName || "",
      account?.branchName || "",
      account?.accountType || "",
      account?.openSince || "",
    ]
  );

  // End use of loan might be in loanDetails or bankingDetails
  const endUseOfLoan =
    verificationData.loanDetails?.endUseOfLoan ||
    verificationData.bankingDetails?.endUseOfLoan ||
    (Array.isArray(verificationData.bankingDetails) &&
      verificationData.bankingDetails[0]?.endUseOfLoan) ||
    "";

  const thirdPartySection = verificationData.thirdPartyCheck || {};

  const thirdPartyReferences = ensureArray(thirdPartySection.references).map(
    (ref: any) => [
      formatMultiline(ref?.name || ""),
      formatMultiline(ref?.address || ""),
      formatMultiline(ref?.contactNo || ""),
      formatMultiline(ref?.knowingSince || ""),
      formatMultiline(ref?.feedbackOnBorrower || ""),
      formatMultiline(ref?.feedbackOnBusiness || ""),
    ]
  );

  const observations = formatMultiline(thirdPartySection.observations || "");

  const recommendations = ensureArray(
    verificationData.recommendations?.recommendations
  )
    .map((item: any) => `<li>${formatMultiline(item || "")}</li>`)
    .join("");

  const generalTable = `
    <table style="${tableStyle}">
      <tr>
        <td colspan="21" style="${cellStyle}"><p style="${paragraphStyle};font-size:14px;"><strong>PERSONAL DISCUSSION SHEET</strong></p></td>
      </tr>
      <tr>
        <td colspan="6" style="${labelCellStyle}"><strong>Region</strong></td>
        <td colspan="5" style="${labelCellStyle}"><strong>Location</strong></td>
        <td colspan="5" style="${labelCellStyle}"><strong>Branch</strong></td>
        <td colspan="5" style="${labelCellStyle}"><strong>Ref No/Application No</strong></td>
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
        ["Name of Customer", basic.applicantName],
        ["Date of Report", basic.dateOfReport],
        ["Name of Concern", basic.concernName],
        ["Constitution", basic.constitution],
        ["Initiated Address", basic.initiatedAddress],
        ["Visited Address", basic.visitedAddress],
        ["Phone no.", basic.applicantContactNumber],
        ["Appointment Fixed", basic.appointmentFixed],
        ["Structure of Loan", basic.structureOfLoan],
        ["No. of Visit", basic.numberOfVisits],
        ["Person Met", basic.personMet],
        ["Visited By", basic.visitedBy],
        ["About Applicant", formatMultiline(basic.aboutApplicant)],
        ["Residential Details", formatMultiline(basic.residentialDetails)],
        ["Co-Applicant Details", formatMultiline(basic.coApplicantDetails)],
      ]
        .map(
          ([label, value]) => `
        <tr>
          <td style="${labelCellStyle}"><strong>${label}</strong></td>
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

      <p style="${paragraphStyle};font-size:14px;"><strong>Family Details</strong></p>
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

      <p style="${paragraphStyle};font-size:14px;"><strong>Shareholding Details</strong></p>
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

      <p style="${paragraphStyle};font-size:14px;"><strong>About the Business</strong></p>
      <table style="${tableStyle}">
      <tr>
      <td width="25%" style="${labelCellStyle}"><strong>About the Business</strong></td>
      <td style="${cellStyle}">${businessPointsList.length ? `<ul style="margin: 0; padding-left: 20px;">${businessPointsList.map((line: string) => `<li style="margin-left: 8px;">${line}</li>`).join("")}</ul>` : "Not provided"}</td>
      </tr>
      </table>


      <p style="${paragraphStyle};font-size:14px;"><strong>Documents Observed</strong></p>
      ${
        renderInnerTable(
          ["Document Category", "Document Name", "Document Type", "Remarks"],
          ensureArray(verificationData.businessOverview?.documentsObserved).map(
            (doc: any) => [
              formatMultiline(doc?.documentCategory || ""),
              formatMultiline(doc?.documentName || ""),
              formatMultiline(doc?.documentType || ""),
              formatMultiline(doc?.remarks || ""),
            ]
          )
        ) || ""
      }

      <p style="${paragraphStyle};font-size:14px;"><strong>Suppliers / Creditors</strong></p>
      ${renderKeyValueTable([
        [
          "No of fixed suppliers",
          suppliersSection.numberOfFixedSuppliers || "Not provided",
        ],
        ["Credit period", suppliersSection.creditPeriodDays || "Not provided"],
        [
          "Cash - Cheque proportion",
          suppliersSection.cashChequeProportion || "Not provided",
        ],
      ])}
      ${renderInnerTable(
        ["Name (top 3 Suppliers)", "Contact Details", "Location", "Ref. Check"],
        ensureArray(suppliersSection.topSuppliers).map((supplier: any) => [
          formatMultiline(supplier?.name || ""),
          formatMultiline(supplier?.contactDetails || ""),
          formatMultiline(supplier?.location || ""),
          formatMultiline(supplier?.referenceCheck || ""),
        ])
      )}

      <p style="${paragraphStyle};font-size:14px;"><strong>Clients / Debtors</strong></p>
      ${renderKeyValueTable([
        [
          "No of fixed customers",
          customersSection.numberOfFixedCustomers || "Not provided",
        ],
        ["Credit period", customersSection.creditPeriodDays || "Not provided"],
        [
          "Cash - Cheque proportion",
          customersSection.cashChequeProportion || "Not provided",
        ],
      ])}
      ${renderInnerTable(
        ["Name (top 3 Customers)", "Contact Details", "Location", "Ref. Check"],
        ensureArray(customersSection.topCustomers).map((customer: any) => [
          formatMultiline(customer?.name || ""),
          formatMultiline(customer?.contactDetails || ""),
          formatMultiline(customer?.location || ""),
          formatMultiline(customer?.referenceCheck || ""),
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

      <p style="${paragraphStyle};font-size:14px;"><strong>Expenditure - Salaries & Wages</strong></p>
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

      <p style="${paragraphStyle};font-size:14px;"><strong>Asset Details</strong></p>
      <p style="${paragraphStyle}"><i>All Immovable properties held that is Residential, Commercial, Land, Plot and any fixed structure:</i></p>
      
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
          assetSection.vehicles || "NA",
        ],
      ])}
      <p style="${paragraphStyle};font-size:12px;font-style:italic;margin-top:8px;"><strong>NOTE:</strong> AMOUNTS MENTIONED ABOVE ARE APPROX</p>

      <p style="${paragraphStyle};font-size:14px;"><strong>Loan Details</strong></p>
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

      <p style="${paragraphStyle};font-size:14px;"><strong>Bank Details</strong></p>
      ${renderInnerTable(
        ["Bank Name", "Branch Name", "Account Type", "Open since (Year)"],
        bankingAccounts
      )}

      ${renderKeyValueTable([
        [
          "End Use of Loan: (Loan Amount & Detailed End-Use)",
          endUseOfLoan || "Not provided",
        ],
      ])}

      <p style="${paragraphStyle};font-size:14px;"><strong>Third Party Check</strong></p>
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
      ${renderKeyValueTable([["Observations:", observations || "Not provided"]])}
      ${renderKeyValueTable([
        [
          "Other Income: (Income from other than initiated business)",
          thirdPartySection.otherIncome || "NA",
        ],
        ["Site Coordinates:", thirdPartySection.siteCoordinates || ""],
      ])}
      ${renderKeyValueTable([
        ["Remarks:", thirdPartySection.remarks || ""],
        ["Status:", html_data.approvedStatus || "Not provided"],
        [
          "AFL Verifier's Name & Emp Code:",
          thirdPartySection?.aflVerifierNameAndEmpCode || "",
        ],
      ])}
      <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}">AFL Verifier's Signature</td>
          <td style="${cellStyle}"></td>
        </tr>
      </table>
      <p style="${paragraphStyle};font-size:14px;"><strong>Disclaimer if any:</strong> ${formatMultiline(
        verificationData.recommendations?.disclaimer ||
          "The Report (Including any attachments) has been prepared on the basis of verbal information provided by the person contacted. Axis Finance Limited will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions, efficient services will not be liable in any case."
      )}</p>

      
    </div>

    ${pdBaseTemplateFooter(html_data)}
 
    `;
};
