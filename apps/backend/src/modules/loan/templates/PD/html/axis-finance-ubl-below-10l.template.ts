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
    .map(
      (header) =>
        `<td style="${labelCellStyle}">${header}</td>`
    )
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


export const axisFinanceUBLBelow10lTemplate = (
  verificationData: any,
  html_data: any
) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  const basic = verificationData.basicDetails || {};
  const businessDetails = verificationData.businessDetails || {};
  const customerDetails = verificationData.customerDetails || {};
  const supplierDetails = verificationData.supplierDetails || {};
  const turnOverDetails = verificationData.turnOverDetails || {};
  const otherBusinessOrSourceOfIncome = verificationData.otherBusinessOrSourceOfIncome || {};
  const assetDetails = verificationData.assetDetails || {};
  const familyDetails = verificationData.familyDetails || {};
  const addressDetails = verificationData.addressDetails || {};
  const existingLoanDetails = verificationData.existingLoanDetails || {};
  const bankingHabits = verificationData.bankingHabits || {};
  const creditCardDetails = verificationData.creditCardDetails || {};
  const loanapplied = verificationData.loanapplied || {};
  const documentsSeen = verificationData.documentsSeen || {};
  const thirdPartyCheck = verificationData.thirdPartyCheck || {};
  const overallDetails = verificationData.overallDetails || {};
  const aflVerifierNameAndEmpCode = verificationData.aflVerifierNameAndEmpCode || {};

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content">
    <table style="${tableStyle}">
      <tr>
        <td colspan="4" style="${cellStyle}"><p style="${paragraphStyle};font-size:14px;text-align:center;"><strong><u>PERSONAL DISCUSSION SHEET</u></strong></p></td>
      </tr>
      <tr>
        <td style="${labelCellStyle}"><strong>Region</strong></td>
        <td style="${labelCellStyle}"><strong>Location</strong></td>
        <td style="${labelCellStyle}"><strong>Branch</strong></td>
        <td style="${labelCellStyle}"><strong>Ref No/Application No</strong></td>
      </tr>
      <tr>
        <td style="${cellStyle}">${formatMultiline(basic.region)}</td>
        <td style="${cellStyle}">${formatMultiline(basic.location)}</td>
        <td style="${cellStyle}">${formatMultiline(basic.branch)}</td>
        <td style="${cellStyle}">${formatMultiline(
          basic.applicationNo || html_data.applicationNumber
        )}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Applicant Name</td>
        <td style="${cellStyle}">${formatMultiline(basic.applicantName)}</td>
        <td style="${labelCellStyle}">PD Conducted At</td>
        <td style="${cellStyle}">${formatMultiline(basic.pdConductedAt)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Contact Number</td>
        <td style="${cellStyle}">${formatMultiline(basic.applicantContactNumber)}</td>
        <td style="${labelCellStyle}">Date of Visit</td>
        <td style="${cellStyle}">${formatMultiline(basic.dateOfVisit)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Visited Address</td>
        <td colspan="3" style="${cellStyle}">${formatMultiline(basic.addressVisited)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Profile (Born and brought up from, DOB. Qualification and previous work experience)</td>
        <td colspan="3" style="${cellStyle}">${basic.bornAndBroughtUpFrom?"<strong>Born and brought up from:</strong> "+basic.bornAndBroughtUpFrom: ""} ${basic.dateOfBirth?"<br><strong>DOB:</strong> "+basic.dateOfBirth: ""} ${basic.qualification?"<br><strong>Qualification:</strong> "+basic.qualification: ""} ${basic.previousWorkExperience?"<br><strong>Previous work experience:</strong> "+basic.previousWorkExperience: ""}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Name of the firm/company</td>
        <td style="${cellStyle}" colspan="3">${businessDetails?.nameOfFirm || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Type of firm/company</td>
        <td style="${cellStyle}">${businessDetails?.typeOfBusiness || "Not provided"}</td>
        <td style="${labelCellStyle}">If Partnership OR Pvt. Ltd. Provide share holders details</td>
        <td style="${cellStyle}">${businessDetails?.ifPartnership || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Nature of business</td>
        <td style="${cellStyle}" colspan="3">${businessDetails?.natureOfBusiness || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Office details (office stability)</td>
        <td style="${cellStyle}" colspan="3">${businessDetails?.officeDetails || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Level of business activity (Remarks on Stocks, Total/current working capacity of Plant. )</td>
        <td style="${cellStyle}" colspan="3">${businessDetails?.businessActivity || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Employees (Number) and salary paid</td>
        <td style="${cellStyle}">${businessDetails?.numberOfEmployees || "Not provided"}</td>
        <td style="${labelCellStyle}">Salary paid to employees</td>
        <td style="${cellStyle}">${formatCurrency(businessDetails?.salaryPaidToEmployees) || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Major customers</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="3"> 
        <table style="${tableStyle}">
          <tr>
            <td style="${labelCellStyle}">Name of customer</td>
            <td style="${labelCellStyle}">Contact number</td>
            <td style="${labelCellStyle}">Credit period</td>
            <td style="${labelCellStyle}">Payment mode</td>
          </tr>
          ${ensureArray(customerDetails?.majorCustomers).map((customer: any) => `
            <tr>
              <td style="${cellStyle}">${customer?.nameOfCustomer || "Not provided"}</td>
              <td style="${cellStyle}">${customer?.contactNo || "Not provided"}</td>
              <td style="${cellStyle}">${customer?.creditPeriod || "Not provided"}</td>
              <td style="${cellStyle}">${customer?.paymentMode || "Not provided"}</td>
            </tr>
          `).join("")}
        </table>
       </td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Major suppliers</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="3"> 
        <table style="${tableStyle}">
          <tr>
            <td style="${labelCellStyle}">Name of supplier</td>
            <td style="${labelCellStyle}">Contact number</td>
            <td style="${labelCellStyle}">Credit period</td>
            <td style="${labelCellStyle}">Payment mode</td>
          </tr>
          ${ensureArray(supplierDetails?.majorSuppliers).map((supplier: any) => `
            <tr>
              <td style="${cellStyle}">${supplier?.nameOfSupplier || "Not provided"}</td>
              <td style="${cellStyle}">${supplier?.contactNo || "Not provided"}</td>
              <td style="${cellStyle}">${supplier?.creditPeriod || "Not provided"}</td>
              <td style="${cellStyle}">${supplier?.paymentMode || "Not provided"}</td>
            </tr>
          `).join("")}
        </table>
       </td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Turnover details</td>
        <td style="${cellStyle}">${turnOverDetails?.details || "Not provided"}</td>
        <td style="${labelCellStyle}">Any other business/Source of income</td>
        <td style="${cellStyle}">${otherBusinessOrSourceOfIncome?.details || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Movable/Immovable Assets Details</td>
        <td style="${cellStyle}" colspan="3">${assetDetails?.details || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Details of applicants family members & their occupation</td>
        <td style="border:1px solid #ccc;padding:8px" colspan="3">
        <table style="${tableStyle}">
          <tr>
            <td style="${labelCellStyle}">Name</td>
            <td style="${labelCellStyle}">Relation with applicant</td>
            <td style="${labelCellStyle}">Age (Yrs)</td>
            <td style="${labelCellStyle}">Occupation</td>
          </tr>
          ${ensureArray(familyDetails?.familyMembers).map((member: any) => `
            <tr>
              <td style="${cellStyle}">${member?.name || "Not provided"}</td>
              <td style="${cellStyle}">${member?.relationWithApplicant || "Not provided"}</td>
              <td style="${cellStyle}">${member?.age || "Not provided"}</td>
              <td style="${cellStyle}">${member?.occupation || "Not provided"}</td>
            </tr>
          `).join("")}
          </table>
        </td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Permanent Address</td>
        <td style="${cellStyle}">${addressDetails?.permanentAddress || "Not provided"}</td>
        <td style="${labelCellStyle}">Residence Address</td>
        <td style="${cellStyle}">${addressDetails?.residenceAddress || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Residence Stability</td>
        <td style="${cellStyle}">${addressDetails?.resiStability?.typeOfResidence ? "<strong>Type:</strong> "+addressDetails?.resiStability?.typeOfResidence : ""}<br> ${addressDetails?.resiStability?.durationOfStay ? "<strong>Duration:</strong> "+addressDetails?.resiStability?.durationOfStay : ""}<br> ${addressDetails?.resiStability?.rentPerMonth ? "<strong>Rent per month:</strong> "+formatCurrency(addressDetails?.resiStability?.rentPerMonth) : ""}</td>
        <td style="${labelCellStyle}">Existing Loan Details</td>
        <td style="${cellStyle}">${existingLoanDetails?.details || "Not provided"}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Banking Habits</td>
        <td style="${cellStyle}">${bankingHabits?.details || "Not provided"}</td>
        <td style="${labelCellStyle}">Credit Card Details if any</td>
        <td style="${cellStyle}">${creditCardDetails?.details || "Not provided"}</td>
      </tr>

      <tr>
        <td style="${labelCellStyle}">Type of loan applied</td>
        <td style="${cellStyle}">${loanapplied?.loanType || "Not provided"}</td>
        <td style="${labelCellStyle}">Loan Purpose</td>
        <td style="${cellStyle}">${loanapplied?.purposeOfLoan || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Loan Amount & Affordable EMI</td>
        <td style="${cellStyle}">${loanapplied?.loanAmount ? "Loan Amount: "+formatCurrency(loanapplied?.loanAmount): ""} ${loanapplied?.affordableEMI? "<br>Affordable EMI: "+formatCurrency(loanapplied?.affordableEMI): ""}</td>
        <td style="${labelCellStyle}">Documents Seen</td>
        <td style="${cellStyle}">${documentsSeen?.details || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}" colspan="4">TPC / Neighbour Check</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Name of the Third Party Check</td>
        <td style="${cellStyle}">${thirdPartyCheck?.nameOfThirdParty || "Not provided"}</td>
        <td style="${labelCellStyle}">Third Party Check Status</td>
        <td style="${cellStyle}">${thirdPartyCheck?.statusOfThirdParty|| "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Third Party Feedback Remarks</td>
        <td style="${cellStyle}" colspan="3">${thirdPartyCheck?.feedbackRemarks || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Overall Remarks of the visit</td>
        <td style="${cellStyle}" colspan="3">${overallDetails?.overallRemarks || "Not provided"}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">AFL Verifier's Name & Emp Code</td>
        <td style="${cellStyle}">${aflVerifierNameAndEmpCode?.aflVerifierName || "Not provided"} ${aflVerifierNameAndEmpCode?.aflVerifierEmpCode ? "-"+aflVerifierNameAndEmpCode?.aflVerifierEmpCode : ""}</td>
        <td style="${labelCellStyle}">PD Officer Signature</td> 
        <td style="${cellStyle}"></td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">PD Status</td>
        <td style="${cellStyle}" colspan="3">${html_data.approvedStatus|| "Not provided"}</td>
      </tr>
    </table>

    <p style="${paragraphStyle};font-size:14px;"><strong>Disclaimer clause:</strong> ${formatMultiline(
      verificationData.recommendations?.disclaimer ||
        "The Report (Including any attachments) has been prepared on the basis of verbal information provided by the person contacted. Axis Finance Limited will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions, efficient services will not be liable in any case."
    )}</p>
      
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};