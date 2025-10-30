import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;vertical-align:top;font-weight:600;color:#222;width:30%";
const valueCellStyle =
  "border:1px solid #c7cdd1;padding:8px;vertical-align:top;color:#333";

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

const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return formatMultiline(value);
  return `Rs. ${numeric.toLocaleString("en-IN")}/-`;
};

const ensureArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const renderKeyValue = (
  label: string,
  value: any,
  formatter?: (value: any) => string,
  options?: { colspan?: number }
) => {
  const content = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colspan || 1}">
        ${content}
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
        `<th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;">${header}</th>`
    )
    .join("");
  const bodyRows = rows
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
    <table style="${tableStyle}">
      <tr>${headerRow}</tr>
      ${bodyRows}
    </table>
  `;
};

export const yesBankTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.generalInfo || {};
  const basic = verificationData.basicApplicantDetails || {};
  const business = verificationData.businessProfile || {};
  const addresses = verificationData.addressDetails || {};
  const businessRefs = ensureArray(
    verificationData.businessReferences?.references
  );
  const residenceRefs = ensureArray(
    verificationData.residenceReferences?.references
  );
  const finalComment = verificationData.finalComment || {};
  const annexureAfhl = verificationData.annexureAfhl || {};
  const annexureSalaried = verificationData.annexureSalaried || {};

  const businessRefRows = businessRefs.map((ref: any, index: number) => [
    `Ref ${index + 1}`,
    ref.referenceType || "",
    ref.businessName || "",
    ref.contactPerson || "",
    ref.feedback || "",
    ref.otherFeedback || "",
    ref.status || "",
  ]);

  const residenceRefRows = residenceRefs.map((ref: any, index: number) => [
    `Ref ${index + 1}`,
    ref.referenceType || "",
    ref.personMet || "",
    ref.feedback || "",
    ref.otherFeedback || "",
    ref.status || "",
  ]);

  const employmentDocs = renderArrayTable(
    ["Documentary evidence"],
    ensureArray(annexureSalaried.employmentDocuments).map((doc: any) => [doc])
  );

  return `
    ${pdBaseTemplate(html_data)}
    <h2 style="margin:24px 0 8px;text-align:center;font-size:20px;font-weight:600;color:#222;"><strong>PERSONAL DISCUSSION REPORT</strong></h2>
    <div class="template-content yes-bank-template">
      <table style="${tableStyle}">
        ${renderKeyValue("Name of the Main applicant", general.mainApplicantName)}
        ${renderKeyValue(
          "PD done with and relation with applicant",
          general.relationWithApplicant
        )}
        ${renderKeyValue(
          "Address of the visit with landmark",
          general.addressVisited
        )}
        <tr>
          <td style="${labelCellStyle}">CAS ID</td>
          <td style="${valueCellStyle}">${formatMultiline(general.casId)}</td>
          <td style="${labelCellStyle}">Product (AFHL/MLAP)</td>
          <td style="${valueCellStyle}">${formatMultiline(general.product)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">PD visit date and time</td>
          <td style="${valueCellStyle}">
            ${formatMultiline(general.pdVisitDate)}<br>${formatMultiline(
    general.pdVisitTime
  )}
          </td>
          <td style="${labelCellStyle}">Contact number</td>
          <td style="${valueCellStyle}">${formatMultiline(
            general.contactNumber
          )}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Loan applied amount</td>
          <td style="${valueCellStyle}">${formatCurrency(
            general.loanAppliedAmount
          )}</td>
          <td style="${labelCellStyle}">Tenor required</td>
          <td style="${valueCellStyle}">${formatMultiline(
            general.tenorRequired
          )}</td>
        </tr>
        ${renderKeyValue(
          "Address visited type",
          general.addressVisitedType,
          undefined,
          { colspan: 3 }
        )}
      </table>

      <table style="${tableStyle}">
            <h3 style="margin:24px 0 8px;font-size:13px;font-weight:600;color:#222;">Basic Details of Applicant</h3>
        <tr>
          <td style="${labelCellStyle}">Applicant – Business / Educational background / Past experience</td>
          <td style="${valueCellStyle}">${formatMultiline(
            basic.applicantBackground
          )}</td>
        </tr>
        ${renderKeyValue(
          "Co-Applicant – Business / Employment / Educational background / Past experience",
          basic.coApplicantBackground
        )}
        ${renderKeyValue(
          "Parents occupation / business / employment background",
          basic.parentsBackground
        )}
        ${renderKeyValue(
          "Details of children (studying / working)",
          basic.childrenDetails
        )}
        ${renderKeyValue(
          "Siblings business / employment background (if residing together)",
          basic.siblingsBackground
        )}
      </table>

      <table style="${tableStyle}">
      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">Self Employed Profile – Occupational Details</h2>
        ${renderKeyValue("Name of the Business / Employment", business.businessName)}
        ${renderKeyValue(
          "Constitution of Business Entity",
          business.businessConstitution
        )}
        ${renderKeyValue(
          "Proprietor / Partner share details",
          business.proprietorShareDetails
        )}
        ${renderKeyValue(
          "No. of years in current business",
          business.yearsInBusiness
        )}
        ${renderKeyValue(
          "Business profile",
          business.businessNarrative
        )}
        ${renderKeyValue("GST Registration", business.gstRegistration)}
        ${renderKeyValue(
          "Proof of business existence / stability",
          business.proofOfBusinessStability
        )}
        <tr>
          <td style="${labelCellStyle}">Average monthly sales / receipts</td>
          <td style="${valueCellStyle}">${formatCurrency(
            business.averageMonthlySales
          )}</td>
          <td style="${labelCellStyle}">Average monthly purchase</td>
          <td style="${valueCellStyle}">${formatCurrency(
            business.averageMonthlyPurchase
          )}</td>
        </tr>
        ${renderKeyValue("Gross margin", business.grossMargin)}
        ${renderKeyValue("Overheads / Indirect expenses", business.indirectExpenses)}
        ${renderKeyValue("Net monthly profit", business.netMonthlyProfit)}
        ${renderKeyValue("Stock level", business.stockLevel)}
        ${renderKeyValue("Major customers", business.majorCustomers)}
        ${renderKeyValue("Major suppliers", business.majorSuppliers)}
        ${renderKeyValue("Business setup details", business.businessSetupDetails)}
        ${renderKeyValue(
          "Infrastructure & manpower details",
          business.infrastructureManpower
        )}
        ${renderKeyValue(
          "Other owned assets / Investments",
          business.otherAssetsInvestments
        )}
        ${renderKeyValue(
          "Other sources of income",
          business.otherIncomeSources
        )}
        ${renderKeyValue(
          "Monthly household expenses",
          business.householdExpenses
        )}
        ${renderKeyValue("Collateral details", business.collateralDetails)}
        ${renderKeyValue("End use (MLAP)", business.mlapEndUse)}
      </table>

      <table style="${tableStyle}">
      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">Residence and Business Address Details</h2>
        <tr><td style="${labelCellStyle}">Residence premise address</td><td style="${valueCellStyle}">${formatMultiline(
          addresses.residencePremiseAddress
        )}</td></tr>
        <tr><td style="${labelCellStyle}">Residence ownership status</td><td style="${valueCellStyle}">${formatMultiline(
          addresses.residenceOwnershipStatus
        )}</td></tr>
        <tr><td style="${labelCellStyle}">Residence owned / rented since when</td><td style="${valueCellStyle}">${formatMultiline(
          addresses.residenceDuration
        )}</td></tr>
        ${renderKeyValue(
          "Residential proof of ownership",
          addresses.residenceProof
        )}
        ${renderKeyValue(
          "Residence rent per month",
          addresses.residenceRent
        )}
        ${renderKeyValue(
          "Residence locality comment",
          addresses.residenceLocality
        )}
        ${renderKeyValue("Residence mortgage status", addresses.residenceMortgage)}
        ${renderKeyValue("Residence QR code check", addresses.residenceQrCheck)}
        ${renderKeyValue(
          "Residence visit comments",
          addresses.residenceVisitComment
        )}
        ${renderKeyValue(
          "Business premise address",
          addresses.businessPremiseAddress
        )}
        ${renderKeyValue(
          "Business ownership status",
          addresses.businessOwnershipStatus
        )}
        ${renderKeyValue(
          "Business owned / rented since when",
          addresses.businessDuration
        )}
        ${renderKeyValue("Business proof of ownership", addresses.businessProof)}
        ${renderKeyValue("Business rent per month", addresses.businessRent)}
        ${renderKeyValue("Business locality comment", addresses.businessLocality)}
        ${renderKeyValue(
          "Business mortgage status",
          addresses.businessMortgage
        )}
        ${renderKeyValue("Business QR code check", addresses.businessQrCheck)}
        ${renderKeyValue(
          "Business visit comments",
          addresses.businessVisitComment
        )}
        ${renderKeyValue(
          "Earlier premises details",
          addresses.earlierPremiseDetails
        )}
      </table>

      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">Reference Check Details</h2>
      ${renderArrayTable(
        [
          "Reference",
          "Reference type",
          "Shop / Business name",
          "Person spoken to",
          "Feedback",
          "Other feedback",
          "Status",
        ],
        businessRefRows
      )}

      ${renderArrayTable(
        [
          "Reference",
          "Reference type",
          "Person / Shop name",
          "Feedback",
          "Other feedback",
          "Status",
        ],
        residenceRefRows
      )}

      <table style="${tableStyle}">
      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">Final PD Comment</h2>
        ${renderKeyValue(
          "Interviewer’s overall comments",
          finalComment.interviewerComment
        )}
        ${renderKeyValue(
          "Level of activity & stocks observed",
          finalComment.activityAndStocks
        )}
        ${renderKeyValue("PD Status", finalComment.pdStatus)}
        ${renderKeyValue(
          "Remarks for Positive / Negative / Referred cases",
          finalComment.remarks
        )}
        ${renderKeyValue(
          "Name of the YBL employee",
          finalComment.yblEmployeeName
        )}
        ${renderKeyValue("Designation", finalComment.yblDesignation)}
        ${renderKeyValue("Employee ID", finalComment.yblEmpId)}
        ${renderKeyValue("Signature", finalComment.yblSignature)}
        ${renderKeyValue(
          "PD agency interviewer’s name",
          finalComment.pdAgencyInterviewer
        )}
        ${renderKeyValue(
          "Report processed by",
          finalComment.reportProcessedBy
        )}
      </table>

      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">Annexure 1 – AFHL Cases</h2>
      <table style="${tableStyle}">
        ${renderKeyValue(
          "Source from which property was identified",
          annexureAfhl.propertyIdentifiedThrough
        )}
        ${renderKeyValue(
          "Builder / Project / Representative details",
          annexureAfhl.builderDetails
        )}
        ${renderKeyValue("Type of transaction", annexureAfhl.transactionType)}
        ${renderKeyValue("Type of property", annexureAfhl.propertyType)}
        ${renderKeyValue(
          "Property details",
          annexureAfhl.propertyDetails
        )}
        ${renderKeyValue(
          "Total cost of the property",
          annexureAfhl.totalPropertyCost,
          formatCurrency
        )}
        ${renderKeyValue("Source of OCR", annexureAfhl.ocrSource)}
        ${renderKeyValue(
          "Down payment details",
          annexureAfhl.downPaymentDone
        )}
        ${renderKeyValue(
          "Amount of down payment",
          annexureAfhl.downPaymentAmount,
          formatCurrency
        )}
        ${renderKeyValue(
          "Source of funds for down payment",
          annexureAfhl.downPaymentSource
        )}
        ${renderKeyValue(
          "Purpose of purchase",
          annexureAfhl.purposeOfPurchase
        )}
        ${renderKeyValue(
          "Distance from current business / residence",
          annexureAfhl.distanceFromWork
        )}
        ${renderKeyValue(
          "Commute plan / reason for buying in far area",
          annexureAfhl.commutePlan
        )}
      </table>

      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">Annexure 2 – Salaried Profile</h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Name of the Company", annexureSalaried.companyName)}
        ${renderKeyValue(
          "Constitution of the Company",
          annexureSalaried.companyConstitution
        )}
        ${renderKeyValue(
          "HR & Reporting Authority contact",
          annexureSalaried.hrAndReportingContact
        )}
        ${renderKeyValue(
          "Employer representative",
          annexureSalaried.employerContact
        )}
        ${renderKeyValue(
          "Employer details",
          annexureSalaried.employerDetails
        )}
        ${renderKeyValue(
          "Employment status",
          annexureSalaried.employmentStatus
        )}
        ${renderKeyValue(
          "Current designation & department",
          annexureSalaried.currentDesignation
        )}
        ${renderKeyValue("Employee ID", annexureSalaried.employeeId)}
        ${renderKeyValue(
          "Salary mode & account details",
          annexureSalaried.salaryMode
        )}
        ${renderKeyValue(
          "Gross monthly salary",
          annexureSalaried.grossMonthlySalary,
          formatCurrency
        )}
        ${renderKeyValue(
          "Net monthly salary",
          annexureSalaried.netMonthlySalary,
          formatCurrency
        )}
        ${renderKeyValue(
          "Loans from employer",
          annexureSalaried.employerLoanDetails
        )}
        ${renderKeyValue(
          "Terms of employment",
          annexureSalaried.employmentTerms
        )}
        ${renderKeyValue(
          "Vintage with current employer",
          annexureSalaried.currentEmployerVintage
        )}
        ${renderKeyValue(
          "Previous work experience details",
          annexureSalaried.previousExperienceDetails
        )}
        ${renderKeyValue(
          "Years worked in previous job",
          annexureSalaried.previousExperienceYears
        )}
        ${renderKeyValue("Other source of income", annexureSalaried.otherIncome)}
        ${renderKeyValue(
          "Existing residence status",
          annexureSalaried.residenceStatus
        )}
        ${renderKeyValue(
          "Rental expenses per month",
          annexureSalaried.rentExpenses
        )}
        ${renderKeyValue(
          "Other family expenses per month",
          annexureSalaried.familyExpenses
        )}
        ${renderKeyValue(
          "Third party check for employment",
          annexureSalaried.employmentTPC
        )}
      </table>
      ${employmentDocs}

      <p style="margin:20px 0 8px 0;font-size:12px;font-weight:600;">Disclaimer Clause:</p>
      <p style="margin:0 0 24px 0;font-size:12px;color:#333;">
        This report (including any attachments) has been prepared based on verbal information provided by the person contacted. YES BANK will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. Kowtha &amp; Co will not be held liable in any case.
      </p>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
