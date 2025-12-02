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
const formatDottedList = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return String(value).replace(/\n+/g, "<br>• ");
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
    ref.nameOfPersonSpokenTo || "",
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
            <h3 style="margin:24px 0 8px;font-size:13px;font-weight:600;color:#222;">BASIC DETAILS OF APPLICANT</h3>
        <tr>
          <td style="${labelCellStyle}">Applicant <br> &middot; Business <br> &middot; Educational background <br> &middot; Past experience</td>
          <td style="${valueCellStyle}">${formatMultiline(
    basic.applicantBackground
  )}</td>
        </tr>
        ${renderKeyValue(
    "Co-Applicant <br> &middot; Business <br> &middot; Employment <br> &middot; Educational background <br> &middot; Past experience",
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
      <tr>
        <td style="${labelCellStyle}"><p style="text-align:center;">Particulars</p></td>
        <td style="${labelCellStyle}"><p style="text-align:center;">Remarks</p></td>
      </tr>
        ${renderKeyValue("Name of the Business / Employment", business.businessName)}
        ${renderKeyValue(
    "Constitution of Business Entity (Proprietorship, Partnership, Ltd. Co.)",
    business.businessConstitution
  )}
        ${renderKeyValue(
    "Name of Proprietor / Partners / Shareholders with % share",
    business.proprietorShareDetails
  )}
        ${renderKeyValue(
    "No. of Years in Current Business",
    business.yearsInBusiness
  )}
        ${renderKeyValue(
    "Business profile (to include nature of industry, product preference in the market, competition, seasonality, and other aspects of business",
    `<u><strong>Business details:</strong>  </u> <br>${formatDottedList(business.businessNarrative)}`
  )}
        ${renderKeyValue("Whether GST registered (if Yes, since when GST registration exist)", business.gstRegistration)}
        ${renderKeyValue(
    "Details of any other proof of business existence/stability available/verified during visit",
    business.proofOfBusinessStability
  )}
        <tr>
          <td style="${labelCellStyle}">Average Monthly sales/receipts</td>
          <td style="${valueCellStyle}">${formatCurrency(
    business.averageMonthlySales
  )}</td>
          </tr>
          <tr>
          <td style="${labelCellStyle}">Average Monthly purchase</td>
          <td style="${valueCellStyle}">${formatCurrency(
    business.averageMonthlyPurchase
  )}</td>
        </tr>
        ${renderKeyValue("Gross margin on the on goods sold", business.grossMargin)}
        ${renderKeyValue("Overheads to run the business (Indirect expenses)", business.indirectExpenses)}
        ${renderKeyValue("Net monthly profit from business", business.netMonthlyProfit)}
        ${renderKeyValue("Stock level", business.stockLevel)}
        ${renderKeyValue("Description about major customers alongwith credit terms", business.majorCustomers)}
        ${renderKeyValue("Description about major suppliers with credit terms", business.majorSuppliers)}
        ${renderKeyValue("Business setup details", business.businessSetupDetails)}
        ${renderKeyValue(
    "Infrastructure and manpower details (to include Business / factory details, plant capacity utilization and staff strength etc)",
    business.infrastructureManpower
  )}
        ${renderKeyValue(
    "Details of other owned Assets (Property, Land etc) / Investment Details (FD, MF, Share etc)",
    business.otherAssetsInvestments
  )}
        ${renderKeyValue(
    "Details of other Source of Income (Rental income, Agri income, Interest income etc)",
    business.otherIncomeSources
  )}
        ${renderKeyValue(
    "Monthly total household expenses",
    business.householdExpenses
  )}
        ${renderKeyValue("Collateral Details (for MLAP) – Capture Type, Occupancy status, Year of purchase, Parental owned etc", business.collateralDetails)}
      </table>


      <table style="${tableStyle}">
      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">End use (MLAP)</h2>
        <tr><td style="${labelCellStyle}">MLAP (End use in detail), (In case of BT Loan/Loan consolidation, capture end use of earlier loans), (For LCP - capture Cost, AV, source of OCR etc)</td>
        <td style="${valueCellStyle}">${formatMultiline(
    business.mlapEndUse
  )}</td></tr>
      </table>

      <table style="${tableStyle}">
      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">Residence/Business Address Details</h2>
      <tr>
        <td style="${labelCellStyle}"><p style="text-align:center;">Particulars</p></td>
        <td style="${labelCellStyle}"><p style="text-align:center;">Residence</p></td>
        <td style="${labelCellStyle}"><p style="text-align:center;">Business place(NA for salaried profile)</p></td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Premise Address</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.residencePremiseAddress)}</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.businessPremiseAddress || "N/A")}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Ownership status (Rented/Owned, parental)</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.residenceOwnershipStatus || "N/A")}</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.businessOwnershipStatus || "N/A")}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Owned / rented since when (number of Years)</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.residenceDuration || "N/A")}</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.businessDuration || "N/A")}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Details of Proof of ownership (if available/documented)</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.residenceProof || "N/A")}</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.businessProof || "N/A")}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Rented premised verification status</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.residenceRentedPremisedVerificationStatus || "N/A")}</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.businessRentedPremisedVerificationStatus || "N/A")}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Rented per month (if rented)</td> 
        <td style="${valueCellStyle}">${formatCurrency(addresses.residenceRent || "N/A")}</td>
        <td style="${valueCellStyle}">${formatCurrency(addresses.businessRent || "N/A")}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Locality comment (Middle class/Upper middle class/Lower middle class/Lower class/Tin roof)</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.residenceLocality || "N/A")}</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.businessLocality || "N/A")}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Whether Property already Mortgage (if same is owned) – mention Bank/NBFC name</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.residenceMortgage || "N/A")}</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.businessMortgage || "N/A")}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">QR code check status (for retail counters on best effort basis) – Positive / Negative</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.residenceQrCheck || "N/A")}</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.businessQrCheck || "N/A")}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Premise visit comment (whichever visited), also attach visit Pics with selfie</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.residenceVisitComment || "N/A")}</td>
        <td style="${valueCellStyle}">${formatMultiline(addresses.businessVisitComment || "N/A")}</td>
      </tr>
      </table>

      <p style="margin:0 0 10px 0;font-size:12px;color:#333;">*If stability is less than 3 years at current business premises then capture details of earlier premises as applicable</p>

      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">Reference Check Details</h2>
      ${renderArrayTable(
    [
      "Business Ref check",
      "Reference type (Nearby business premises, Buyer, Suppliers)",
      "Name of Shop/Business premises with whom ref check done",
      "Name of person spoken to",
      "Feedback on business stability, vintage of business, Volume of business, Payment regularity, Capture contact number of person as well (in case ref check done from Suppliers/Buyer)",
      "Any other Ref check feedback",
      "Ref Check status (Positive, Negative, Neutral)",
    ],
    businessRefRows
  )}

      ${renderArrayTable(
    [
      "Residence Ref check (if visited)",
      "Reference type (from neighbors, nearby Grocery stores, sweets shops, Dairy etc.",
      "Name of Person, Shop/Business premises with whom ref check done",
      "Name of person spoken to",
      "Feedback on applicant’s behavior, Involvement in Negative activity, Vintage at residence, involvement in political activity etc",
      "Any other Ref check feedback",
      "Ref Check status (Positive, Negative, Neutral)",
    ],
    residenceRefRows
  )}

      <table style="${tableStyle}">
      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">Final PD Comment</h2>
        ${renderKeyValue(
    "Interviewer’s overall comments, along with explanations",
    finalComment.interviewerComment
  )}
        ${renderKeyValue(
    "Level of activity & stocks observed Along with other Observations",
    finalComment.activityAndStocks
  )}
        ${renderKeyValue("PD Status", html_data.approvedStatus|| "Not provided")}
        ${renderKeyValue(
    "Remarks for Positive / Negative / Referred cases",
    finalComment.remarks
  )}
        ${renderKeyValue(
    "Name of the YBL Employee",
    finalComment.yblEmployeeName
  )}
        ${renderKeyValue("Designation", finalComment.yblDesignation)}
        ${renderKeyValue("EMP ID", finalComment.yblEmpId)}
        <tr>
          <td style="${labelCellStyle}">Signature</td>
          <td style="${valueCellStyle}" colspan="2"></td>
        </tr>
        ${renderKeyValue(
    "PD agency Interviewer’s Name",
    finalComment.pdAgencyInterviewer
  )}
        ${renderKeyValue(
    "Report processed by",
    finalComment.reportProcessedBy
  )}
  </table>

    
      <p style="margin:20px 0 8px 0;font-size:12px;font-weight:600;">Disclaimer Clause:</p>
      <p style="margin:0 0 24px 0;font-size:12px;color:#333;">
        This report (including any attachments) has been prepared based on verbal information provided by the person contacted. YES BANK will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. Kowtha &amp; Co will not be held liable in any case.
      </p>

      ${pdBaseTemplateFooter(html_data)}

      <!-- Annexure 1 – AFHL Cases -->
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
    "Distance of the property from current business and residence",
    annexureAfhl.distanceFromWork
  )}
        ${renderKeyValue(
    "If distance is more than 15-20Km from work place provide details of commute plan / reason for buying in far area",
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



    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
