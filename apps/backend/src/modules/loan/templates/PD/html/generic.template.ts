import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate } from "./pd-base.template";

/**
 * Generic PD Template Generator
 * Works for any bank by dynamically rendering based on schema structure
 */
export const genericPDTemplate = (
  verificationData: any,
  schema: any,
  html_data: {
    financialAnalysis?: any;
    path?: string;
    status?: string;
    bankName?: string;
    imageDataUri?: string;
    imagesData?: string;
  }
) => {
  const recommendationStyles: Record<string, string> = {
    Positive: '<li style="color: green; font-weight: bold;">POSITIVE</li>',
    Negative: '<li style="color: red; font-weight: bold;">NEGATIVE</li>',
    CreditRefer:
      '<li style="color: orange; font-weight: bold;">CREDIT REFER</li>',
  };

  const finalRecommendationHtml =
    recommendationStyles[html_data.status || ""] || "";

  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  // Generate sections dynamically based on schema
  const sectionsHtml = schema.sections
    .map((section: any) => {
      return renderSection(section, verificationData[section.id] || {});
    })
    .join("\n");

  return `
    ${pdBaseTemplate()}

      <div class="report-title">PERSONAL DISCUSSION SHEET</div>
      <div class="report-subtitle">${schema.bankName || html_data.bankName || ""}</div>
    
      ${sectionsHtml}

      ${renderFinancialAnalysis(html_data.financialAnalysis)}

      <div style="page-break-before: always;"></div>

      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="6" class="section-header">Final Remarks</td></tr>
          <tr>
            <th>Synopsis</th>
            <td colspan="5">
              <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                ${html_data.path || ""}
              </ul>
            </td>
          </tr>
          <tr>
            <th>Final Recommendation</th>
            <td colspan="5">
              <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                ${finalRecommendationHtml}
              </ul>
            </td>
          </tr>
        </table>
      </div>
      <br>
      <br>
      <br>
      Disclaimer: 
      <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
          The report contains information provided by the Applicant met. The information is provided verbally and could be verified only to a limited extent. The bank will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions.
      </ul>

      <br>
      ${html_data.imageDataUri ? `<img src="${html_data.imageDataUri}" width="50%" height="40%" style="margin-left: 2%;" />` : ""}
      <footer class="pdf-footer">
        <span style="color:rgb(8, 136, 36);">${html_data.bankName || schema.bankName || ""}</span><br>
        Generated on ${istDate}
      </footer>
      ${html_data.imagesData || ""}
  `;
};

/**
 * Render a section based on its schema
 */
function renderSection(section: any, sectionData: any): string {
  const properties = section.schema?.properties || {};

  // Separate simple fields from complex fields (arrays, objects)
  const simpleFields: string[] = [];
  const complexFields: { key: string; property: any }[] = [];

  Object.entries(properties).forEach(([key, property]: [string, any]) => {
    if (property.type === "array" || property.type === "object") {
      complexFields.push({ key, property });
    } else {
      simpleFields.push(key);
    }
  });

  let html = `<div class="align-wrapper">
    <table class="section-table">
      <tr><td colspan="7" class="section-header">${section.label || section.id}</td></tr>`;

  // Render simple fields
  simpleFields.forEach((key) => {
    const property = properties[key];
    const value = sectionData[key];
    html += `
      <tr>
        <th>${property.title || key}</th>
        <td colspan="5"><span class="var-value">${formatValue(value, property)}</span></td>
      </tr>`;
  });

  html += `</table></div>`;

  // Render complex fields (arrays, objects)
  complexFields.forEach(({ key, property }) => {
    html += renderComplexField(key, property, sectionData[key], section.label);
  });

  return html;
}

/**
 * Render complex fields (arrays and objects)
 */
function renderComplexField(
  key: string,
  property: any,
  data: any,
  sectionLabel: string
): string {
  if (property.type === "array") {
    return renderArrayField(key, property, data);
  } else if (property.type === "object") {
    return renderObjectField(key, property, data, sectionLabel);
  }
  return "";
}

/**
 * Render array field as a table
 */
function renderArrayField(key: string, property: any, data: any): string {
  const items = Array.isArray(data) ? data : [];
  const itemProperties = property.items?.properties || {};
  const columns = Object.entries(itemProperties);

  if (columns.length === 0 || items.length === 0) {
    return `
      <div class="align-wrapper">
        <table class="section-table">
          <tr><td colspan="7" class="section-header">${property.title || key}</td></tr>
          <tr><td colspan="7" style="text-align: center;">No ${property.title || key} available</td></tr>
        </table>
      </div>`;
  }

  let html = `
    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">${property.title || key}</td></tr>
        <tr>`;

  // Table headers
  columns.forEach(([colKey, colProperty]: [string, any]) => {
    html += `<th>${colProperty.title || colKey}</th>`;
  });
  html += `</tr>`;

  // Table rows
  items.forEach((item: any) => {
    html += `<tr>`;
    columns.forEach(([colKey]) => {
      const value = item?.[colKey];
      html += `<td><span class="var-value">${formatValue(value, itemProperties[colKey])}</span></td>`;
    });
    html += `</tr>`;
  });

  html += `</table></div>`;
  return html;
}

/**
 * Render object field
 */
function renderObjectField(
  key: string,
  property: any,
  data: any,
  sectionLabel: string
): string {
  const objectProperties = property.properties || {};

  let html = `
    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">${property.title || key}</td></tr>`;

  Object.entries(objectProperties).forEach(
    ([fieldKey, fieldProperty]: [string, any]) => {
      const value = data?.[fieldKey];
      html += `
      <tr>
        <th>${fieldProperty.title || fieldKey}</th>
        <td colspan="5"><span class="var-value">${formatValue(value, fieldProperty)}</span></td>
      </tr>`;
    }
  );

  html += `</table></div>`;
  return html;
}

/**
 * Format value for display
 */
function formatValue(value: any, property: any): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  // Handle boolean
  if (property?.type === "boolean" || typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // Handle numbers
  if (typeof value === "number") {
    return value.toString();
  }

  // Handle dates
  if (property?.format === "date" && value) {
    return value.toString();
  }

  // Handle objects (shouldn't happen in leaf values, but just in case)
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return value.toString();
}

/**
 * Render Financial Analysis section
 */
function renderFinancialAnalysis(financialAnalysis: any): string {
  if (!financialAnalysis) {
    return "";
  }

  return `
    <div style="page-break-before: always;"></div>

    <div class="align-wrapper">
      <table class="section-table">
        <tr><td colspan="7" class="section-header">FINANCIAL ANALYSIS</td></tr>
        <tr>
          <th>Particulars</th>
          <th>Estimations</th>
        </tr>
        ${renderFinancialRow("Opening Stock", financialAnalysis.openingStock)}
        ${renderFinancialRow("Purchase", financialAnalysis.purchase)}
        ${renderFinancialRow("Cost of Services", financialAnalysis.costOfServices)}
        ${renderFinancialRow("Wages", financialAnalysis.wages)}
        ${renderFinancialRow("Hamali Charges", financialAnalysis.hamaliCharges)}
        ${renderFinancialRow("Manufacturing Expenses", financialAnalysis.manufacturingExpenses)}
        ${renderFinancialRow("Packing Charges", financialAnalysis.packingCharges)}
        ${renderFinancialRow("Sales", financialAnalysis.sales)}
        ${renderFinancialRow("Services", financialAnalysis.services)}
        ${renderFinancialRow("Closing Stock", financialAnalysis.closingStock)}
        ${renderFinancialRow("Salaries", financialAnalysis.salaries)}
        ${renderFinancialRow("Rent", financialAnalysis.rent)}
        ${renderFinancialRow("Electricity Charges", financialAnalysis.electricityCharges)}
        ${renderFinancialRow("Printing & Stationery", financialAnalysis.printingStationery)}
        ${renderFinancialRow("Telephone Charges", financialAnalysis.telephoneCharges)}
        ${renderFinancialRow("Postage & Telegram", financialAnalysis.postageTelegram)}
        ${renderFinancialRow("Office Maintenance", financialAnalysis.officeMaintenance)}
        ${renderFinancialRow("Repairs & Maintenance", financialAnalysis.repairsMaintenance)}
        ${renderFinancialRow("Sadar Expenses", financialAnalysis.sadarExpenses)}
        ${renderFinancialRow("Audit Fee", financialAnalysis.auditFee)}
        ${renderFinancialRow("Advertisement", financialAnalysis.advertisement)}
        ${renderFinancialRow("Bank Charges", financialAnalysis.bankCharges)}
        ${renderFinancialRow("Insurance", financialAnalysis.insurance)}
        ${renderFinancialRow("Depreciation", financialAnalysis.depreciation)}
        ${renderFinancialRow("Interest On Loan", financialAnalysis.interestOnLoan)}
        ${renderFinancialRow("Rent Received", financialAnalysis.rentReceived)}
        ${renderFinancialRow("Commission Received", financialAnalysis.commissionReceived)}
        ${renderFinancialRow("Net Profit", financialAnalysis.netProfit)}
        ${renderFinancialRow("Gross Profit", financialAnalysis.grossProfit)}
      </table>
    </div>`;
}

function renderFinancialRow(label: string, value: any): string {
  return `
    <tr>
      <td><span class="var-value">${label}</span></td>
      <td><span class="var-value">${value || 0}</span></td>
    </tr>`;
}
