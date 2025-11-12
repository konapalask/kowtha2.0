import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:18px 0";
const headerStyle =
  "background:#2e7d32;color:#fff;font-weight:700;text-transform:uppercase;font-size:14px;padding:10px;border:1px solid #ccc;text-align:center;letter-spacing:0.6px";
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

const ensureArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return formatMultiline(value);
  }
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
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

const renderList = (items: any[]): string => {
  const entries = ensureArray(items).filter((item) => hasValue(item));
  if (!entries.length) return "Not provided";
  return `<ul style="margin:6px 0 6px 18px;padding:0;">${entries
    .map(
      (entry) =>
        `<li style="margin-bottom:4px;color:#2f3b52;">${formatMultiline(
          entry
        )}</li>`
    )
    .join("")}</ul>`;
};

export const axisAgriTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.generalInfo || {};
  const pdDetails = verificationData.pdVisitDetails || {};
  const profile = verificationData.businessProfile || {};
  const banking = verificationData.bankingAndWorkingCapital || {};
  const suppliersClients = ensureArray(verificationData.suppliersClients.suppliersClients || []);
  const observations = verificationData.observations || {};

  const facilityRows = ensureArray(banking.facilities).map((facility: any) => [
    facility.bankName || "",
    facility.limitType || "",
    formatCurrency(facility.limitAmount),
  ]);

  const supplierRows = suppliersClients.map((entry: any) => [
    entry.suppliers || "",
    entry.clients || "",
  ]);

  const generalTable = `
    <table style="${tableStyle}">
      <tr><th style="${headerStyle}" colspan="4"><u>Personal Discussion Sheet (PD) with Rural Enterprise</u></th></tr>
      ${renderKeyValueRow("Reference Number", general.referenceNumber,undefined, {colSpan: 3})}
      ${renderKeyValueRow("Name of Firm", general.nameOfFirm,undefined, {colSpan: 3})}
      <tr>
        <td style="${labelCellStyle}">Constitution</td>
        <td style="${valueCellStyle}">${formatMultiline(general.constitution)}</td>
        <td style="${labelCellStyle}">Incorporation Date</td>
        <td style="${valueCellStyle}">${formatMultiline(
          general.incorporationDate
        )}</td>
      </tr>
      ${renderKeyValueRow("Address of the Firm", pdDetails.addressOfFirm, undefined, {
        colSpan: 3,
      })}
      <tr>
        <td style="${labelCellStyle}">Date & Time of PD</td>
        <td style="${valueCellStyle}">${formatMultiline(
          pdDetails.dateAndTimeOfPd
        )}</td>
        <td style="${labelCellStyle}">Place of PD</td>
        <td style="${valueCellStyle}">${formatMultiline(pdDetails.placeOfPd)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Name of Person Met</td>
        <td style="${valueCellStyle}">${formatMultiline(
          pdDetails.nameOfPersonMet
        )}</td>
        <td style="${labelCellStyle}">Designation</td>
        <td style="${valueCellStyle}">${formatMultiline(pdDetails.designation)}</td>
      </tr>
      ${renderKeyValueRow(
        "Name of PD Official",
        pdDetails.nameOfPdOfficial,
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;



  const profileTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Business Profile</th></tr>
      ${renderKeyValueRow("Type of Industry", profile.typeOfIndustry,undefined, {colSpan: 3})}
      ${renderKeyValueRow("Nature of Business", profile.natureOfBusiness,undefined, {colSpan: 3})}
      ${renderKeyValueRow(
        "Details on management of business",
        profile.managementDetails,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Total Experience in Same line Business",
        profile.totalExperience,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Shareholding Details",
        profile.shareholdingDetails,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business Locality",
        profile.businessLocality,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business Premise setup / Ownership / Nameplate / Staff",
        profile.premiseSetup,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Financial Brief",
        profile.financialBrief,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "End use of the Loan & Loan amount Required", 
        profile.endUseOfTheLoanAndLoanAmountRequired,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Other Business / Alternate Income Sources",
        profile.otherBusinessAlternateIncomeSources,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business License Related Information",
        profile.businessLicenseRelatedInformation,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Documnets Provided during Visit",
        profile.documentsProvidedDuringVisit,
        undefined,
        { colSpan: 3 }
      )}
      <tr>
      <td style="${labelCellStyle}">Banking & Working Capital Limit Information</td>
      <td style="border:1px solid #ccc;padding:8px">
        <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}">Bank Name</td>
          <td style="${labelCellStyle}">Limit Type</td>
          <td style="${labelCellStyle}">Limit Amount</td>
        </tr>
        ${ensureArray(banking.facilities).map((facility: any) => `
          <tr>
            <td style="${valueCellStyle}">${facility.bankName}</td>
            <td style="${valueCellStyle}">${facility.limitType}</td>
            <td style="${valueCellStyle}">${formatCurrency(facility.limitAmount)}</td>
          </tr>
        `).join("")}
        </table>
        </td>
      </tr>

      ${renderKeyValueRow(
        "Is it a Takeover?", 
        banking.isItATakeover, 
        undefined, { colSpan: 3 }
      )}

      ${renderKeyValueRow(
        "Any other loan obligations of the firm",
        banking.otherLoanObligations,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Current Account if any",
        profile.currentAccountIfAny,
        undefined,
        { colSpan: 3 }
      )}${renderKeyValueRow(
        "Collateral Security Details",
        profile.collateralSecurityDetails,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Existing Banking Relations with Axis (if any)",
        profile.existingBankingRelationsWithAxisIfAny,
        undefined,
        { colSpan: 3 }
      )}

    </table>
  `;

  const supplierClientTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="2">Major Suppliers & Clients</th></tr>
      <tr>
        <td style="${labelCellStyle}">Suppliers (Creditors)</td>
        <td style="${labelCellStyle}">Clients (Debtors)</td>
      </tr>
      ${
        supplierRows.length
          ? supplierRows
              .map(
                (row) => `
        <tr>
          <td style="${valueCellStyle}">${formatMultiline(row[0])}</td>
          <td style="${valueCellStyle}">${formatMultiline(row[1])}</td>
        </tr>`
              )
              .join("")
          : `<tr><td style="${valueCellStyle}" colspan="2">Not provided</td></tr>`
      }
    </table>
  `;

  const observationsTable = `
    <table style="${tableStyle}">
      <tr><th style="${subHeaderStyle}" colspan="4">Observations & Risks</th></tr>
      ${renderKeyValueRow(
        "Stocks / Raw material related observations",
        observations.stocksRawMaterialObservations,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "COVID-19 Impact & Recovery period / Other Business Risks",
        observations.covidImpact,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Family Background & Net-worth",
        observations.familyBackgroundNetWorth,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Business Succession Plan",
        observations.businessSuccessionPlan,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Qualification of Proprietor / Partners / Directors",
        observations.qualificationOfPromoters,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Third Party Checks",
        observations.thirdPartyChecks,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Lease land Verification",
        observations.leaseLandVerification,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "Remarks & Observations",
        observations.remarksObservations,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "PD Final Status",
        observations.pdFinalStatus,
        undefined,
        { colSpan: 3 }
      )}
      ${renderKeyValueRow(
        "PD Vendor Name & Address",
        observations.pdVendorDetails,
        undefined,
        { colSpan: 3 }
      )}
    </table>
  `;

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content axis-agri-template">
      ${generalTable}
      ${profileTable}
      ${supplierClientTable}
      ${observationsTable}
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
