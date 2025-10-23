import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;vertical-align:top;width:32%";
const valueCellStyle =
  "border:1px solid #c7cdd1;padding:8px;color:#333;vertical-align:top";

const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some((entry) => hasValue(entry));
  if (typeof value === "object")
    return Object.values(value).some((entry) => hasValue(entry));
  return false;
};

const formatMultiline = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return String(value).replace(/\n+/g, "<br>");
};

const renderKeyValue = (
  label: string,
  value: any,
  options?: { colspan?: number }
) => `
  <tr>
    <td style="${labelCellStyle}">${label}</td>
    <td style="${valueCellStyle}" colspan="${options?.colspan || 1}">
      ${formatMultiline(value)}
    </td>
  </tr>
`;

export const adityaBirlaTemplate = (verificationData: any, html_data: any) => {
  const proposal = verificationData.proposalInfo || {};
  const applicant = verificationData.applicantDetails || {};
  const partners = verificationData.partnersManagement || {};
  const business = verificationData.businessOverview || {};
  const financials = verificationData.salesFinancials || {};
  const employees = verificationData.employeesInfrastructure || {};
  const observations = verificationData.observations || {};

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content aditya-birla-template">
      <table style="${tableStyle}">
        ${renderKeyValue("Proposal No.", proposal.proposalNumber)}
        <tr>
          <td style="${labelCellStyle}">Date of Visit</td>
          <td style="${valueCellStyle}">${formatMultiline(proposal.dateOfVisit)}</td>
          <td style="${labelCellStyle}">Time of Visit</td>
          <td style="${valueCellStyle}">${formatMultiline(proposal.timeOfVisit)}</td>
        </tr>
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Name of Applicant", applicant.nameOfApplicant)}
        ${renderKeyValue("Name of Co-applicant", applicant.nameOfCoApplicant)}
        ${renderKeyValue("Name of Business", applicant.nameOfBusiness)}
        ${renderKeyValue("Business Address", applicant.businessAddress, { colspan: 1 })}
        ${renderKeyValue("No. of years in current address", applicant.yearsInCurrentAddress)}
        ${renderKeyValue("Constitution of Business", applicant.constitutionOfBusiness)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Names of other partners / directors", partners.otherPartners)}
        ${renderKeyValue("Management", partners.management)}
        ${renderKeyValue("Contact number", partners.contactNumber)}
        ${renderKeyValue("TIN", partners.tin)}
        ${renderKeyValue("PAN", partners.pan)}
        ${renderKeyValue("Certificate of Incorporation", partners.certificateOfIncorporation)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Business profile", business.aboutBusiness)}
        ${renderKeyValue("Vendors / Suppliers to applicant", business.vendorsSuppliers)}
        ${renderKeyValue("Business transaction", business.businessTransaction)}
        ${renderKeyValue("Stock observed", business.stockObserved)}
        ${renderKeyValue("Reason if no stock observed", business.reasonForNoStock)}
        ${renderKeyValue("Business activity observed", business.businessActivityObserved)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Main Product", financials.mainProduct)}
        ${renderKeyValue("Main Raw Material", financials.mainRawMaterial)}
        ${renderKeyValue("Major Vendors", financials.vendors)}
        ${renderKeyValue("Business premises ownership", financials.businessPremiseOwnership)}
        ${renderKeyValue("Monthly sales / receipts", financials.actualMonthlySales)}
        ${renderKeyValue("Sales on credit (%)", financials.percentageSalesOnCredit)}
        ${renderKeyValue("Manufacturing / trading details", financials.manufacturingDetails)}
        ${renderKeyValue("Sales concentration >50% on one party?", financials.salesConcentration)}
        ${renderKeyValue("Business cycle – debtors", financials.debtorsCycle)}
        ${renderKeyValue("Business cycle – creditors", financials.creditorsCycle)}
        ${renderKeyValue("Stock valuation", financials.stockValuation)}
        ${renderKeyValue("Gross & net margins", financials.netMargins)}
        ${renderKeyValue("Monthly net saving", financials.monthlyNetSavings)}
        ${renderKeyValue("Main customers in the business", financials.majorCustomers)}
        ${renderKeyValue("Sales payment terms", financials.salesPaymentTerms)}
        ${renderKeyValue("GST registration", financials.gstRegistration)}
        ${renderKeyValue("ITRs filing", financials.itrsFiling)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Number of employees", employees.numberOfEmployees)}
        ${renderKeyValue("Salaries payout", employees.salaries)}
        ${renderKeyValue("Godown address", employees.godownAddress)}
        ${renderKeyValue("Other business details", employees.otherBusinessDetails)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Detailed observations", observations.detailedObservations, { colspan: 1 })}
        ${renderKeyValue("Concerns", observations.concerns)}
        ${renderKeyValue("Status of PD", observations.statusOfPd)}
        ${renderKeyValue("PD conducted by", observations.pdConductedBy)}
      </table>

      <p style="margin:20px 0 8px;font-weight:600;color:#222;">Disclaimer Clause:</p>
      <p style="margin:0 0 24px;color:#333;">
        This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Aditya Birla Finance will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. Kowtha &amp; Co will not be held liable in any case.
      </p>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
