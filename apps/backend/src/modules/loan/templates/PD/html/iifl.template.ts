import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;background:#f4f6fb;vertical-align:top;width:32%";
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
  const rendered = formatter ? formatter(value) : formatMultiline(value);
  return `
    <tr>
      <td style="${labelCellStyle}">${label}</td>
      <td style="${valueCellStyle}" colspan="${options?.colspan || 1}">
        ${rendered}
      </td>
    </tr>
  `;
};

const renderArrayTable = (headers: string[], rows: string[][]): string => {
  if (!rows.length) {
    return `<table style="${tableStyle}"><tr><td style="${valueCellStyle}">Not provided</td></tr></table>`;
  }
  const headerRow = headers
    .map(
      (header) =>
        `<th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">${header}</th>`
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
  return `<table style="${tableStyle}"><tr>${headerRow}</tr>${bodyRows}</table>`;
};

export const iiflTemplate = (verificationData: any, html_data: any) => {
  const basic = verificationData.basicDetails || {};
  const caseDetails = verificationData.briefCommentsObservation || {};
  const familyDetails = verificationData.familyDetails || {};
  const profile = verificationData.applicantProfile || {};
  const observations = verificationData.observations || {};
  const incomeDetails = verificationData.incomeDetails || {};
  const otherIncome = verificationData.otherIncome || {};
  const references = verificationData.references || {};



  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content iifl-template">

      <table style="${tableStyle}">
      <tr>
        <td style="text-align: center; ${labelCellStyle}"colspan="7">PD Sheet - Self Employed Applicant</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}">Prospect No.</td>
        <td style="${valueCellStyle}" colspan="6">${basic.prospectNo}</td>
      </tr>
      <tr>
        <td style="text-align: center; ${labelCellStyle}"colspan="7">Basic Details</td>
      </tr>
        ${renderKeyValue("Name of Applicant", basic.nameOfApplicant, undefined, { colspan: 6 })}
        ${renderKeyValue("Marital Status", basic.maritalStatus, undefined, { colspan: 6 })}
        ${renderKeyValue(
          "Educational Qualification",
          basic.educationalQualification,
          undefined,
          { colspan: 6 }
        )}
        ${renderKeyValue("Category", basic.category, undefined, { colspan: 6 })}
        <tr>
          <td style="${labelCellStyle}">Number of Dependents</td>
          <td style="${labelCellStyle}">Children</td>
          <td style="${valueCellStyle}">${basic.dependentsChildren}</td>
          <td style="${labelCellStyle}">Adults</td>
          <td style="${valueCellStyle}">${basic.dependentsAdults}</td>
          <td style="${labelCellStyle}">Others</td>
          <td style="${valueCellStyle}">${basic.dependentsOthers}</td>
        </tr>
        ${renderKeyValue("Number of Years in Current Residence", basic.yearsInCurrentResidence, undefined, { colspan: 6 })}
        ${renderKeyValue("Current Residence House Size", basic.currentResidenceHouseSize, undefined, { colspan: 6 })}
        <tr>
          <td style="${labelCellStyle}">If <=1 Year, then Previous Address</td>
          <td style="${valueCellStyle}" colspan="2">${basic.yearsInCurrentResidence  === "<=1 Year" ? basic.previousAddress : "NA"}</td>
          <td style="${labelCellStyle}">Number of Years Stayed at Previous Address</td>
          <td style="${valueCellStyle}" colspan="3">${basic.yearsInCurrentResidence  === "<=1 Year" ? basic.yearsStayedPreviousAddress : "NA"}</td>
        </tr>
        ${renderKeyValue(
          "Number of Years in Current City",
          basic.yearsInCurrentCity,
          undefined,
          { colspan: 6 }
        )}
        <tr>
          <td style="${labelCellStyle}">If <=3 Years in current city, then mention</td>
          <td style="border:1px solid #c7cdd1;padding:8px;" colspan="6">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Previous City</td>
                <td style="${valueCellStyle}" colspan="2">${basic.yearsInCurrentCity  === "<=3 Years" ? basic.previousCity : "NA"}</td>
                <td style="${labelCellStyle}">Number of Years in Previous City</td>
                <td style="${valueCellStyle}" colspan="3">${basic.yearsInCurrentCity  === "<=3 Years" ? basic.yearsInPreviousCity : "NA"}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Reason for Change</td>
                <td style="${valueCellStyle}" colspan="5">${basic.yearsInCurrentCity  === "<=3 Years" ? basic.reasonForChange : "NA"}</td>
              </tr>
            </table>
          </td>
        </tr>
        ${renderKeyValue(
          "Parents Staying With?",
          basic.parentsStayingWith,
          undefined,
          { colspan: 6 }
        )}
        ${renderKeyValue("Usage of Property after Purchase", basic.propertyUsage, undefined, { colspan: 6 })}
      </table>

      <table style="${tableStyle}">
        <tr>
          <td style="text-align: center; ${labelCellStyle}"colspan="7">Brief Comments/Observation of the case</td>
        <td style="border:1px solid #ccc;padding:8px">
          <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Date of Case Initiated</td>
                <td style="${valueCellStyle}">${caseDetails.dateOfCaseInitiated}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Date of Appointment Provided</td>
                <td style="${valueCellStyle}">${caseDetails.dateOfAppointmentProvided}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Initiated Address</td>
                <td style="${valueCellStyle}">${caseDetails.initiatedAddress}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Visited Address</td>
                <td style="${valueCellStyle}">${caseDetails.visitedAddress}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Residential Address</td>
                <td style="${valueCellStyle}">${caseDetails.residentialAddress}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Contact Information</td>
                <td style="${valueCellStyle}">${caseDetails.contactInformation}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Loan Amount Required</td>
                <td style="${valueCellStyle}">${formatCurrency(caseDetails.loanAmountRequired)}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Purpose of Loan</td>
                <td style="${valueCellStyle}">${caseDetails.purposeOfLoan}</td>
              </tr>
              <tr>
                <td style="${labelCellStyle}">Profile Initiated</td>
                <td style="${valueCellStyle}">${caseDetails.profileInitiated}</td>
              </tr>
          </table>
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}" colspan="5">Family Details</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Name</td>
              <td style="${labelCellStyle}">Relationship</td>
              <td style="${labelCellStyle}">Age</td>
              <td style="${labelCellStyle}">Qualification</td>
              <td style="${labelCellStyle}">Occupation</td>
            </tr>
            ${familyDetails.familyMembers.map((member: any) => `
              <tr>
                <td style="${valueCellStyle}">${member.name}</td>
                <td style="${valueCellStyle}">${member.relationship}</td>
                <td style="${valueCellStyle}">${member.age}</td>
                <td style="${valueCellStyle}">${member.qualification}</td>
                <td style="${valueCellStyle}">${member.occupation}</td>
              </tr>
            `).join("")}
          </table>
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Applicant Profile</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${profile.applicantProfile.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("")}</td>
            </tr>
          </table>
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Concerns</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${observations.concerns.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("")}</td>
            </tr>
          </table>
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Other Observations</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${observations.otherObservations.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("")}</td>
            </tr>
          </table>
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}" colspan="3">Income Details</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}"><u>Income</u></td>
              <td style="${labelCellStyle}"></td>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}">Gross Receipts</td>
              <td style="${valueCellStyle}">${formatCurrency(incomeDetails.income.grossReceipts)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Add</td>
              <td style="${labelCellStyle}">Other Incomes</td>
              <td style="${valueCellStyle}">${formatCurrency(incomeDetails.income.otherIncomes)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}">Total (A)</td>
              <td style="${valueCellStyle}">${formatCurrency(incomeDetails.income.grossReceipts + incomeDetails.income.otherIncomes)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Less</td>
              <td style="${labelCellStyle}"><u>Expenses</u></td>
              <td style="${labelCellStyle}"></td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}">Purchases</td>
              <td style="${valueCellStyle}">${formatCurrency(incomeDetails.expenses.purchases)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}">Salaries</td>
              <td style="${valueCellStyle}">${formatCurrency(incomeDetails.expenses.salaries)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}">Electricity</td>
              <td style="${valueCellStyle}">${formatCurrency(incomeDetails.expenses.electricity)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}">Other Expenses</td>
              <td style="${valueCellStyle}">${formatCurrency(incomeDetails.expenses.otherExpenses)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}">Total (B)</td>
              <td style="${valueCellStyle}">${formatCurrency(incomeDetails.expenses.purchases + incomeDetails.expenses.salaries + incomeDetails.expenses.electricity + incomeDetails.expenses.otherExpenses)}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}">Net Profit (A-B)</td>
              <td style="${valueCellStyle}">${formatCurrency(incomeDetails.income.grossReceipts + incomeDetails.income.otherIncomes - (incomeDetails.expenses.purchases + incomeDetails.expenses.salaries + incomeDetails.expenses.electricity + incomeDetails.expenses.otherExpenses))}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}"></td>
              <td style="${labelCellStyle}">Net Margin %</td>
              <td style="${valueCellStyle}">${((incomeDetails.income.grossReceipts + incomeDetails.income.otherIncomes - (incomeDetails.expenses.purchases + incomeDetails.expenses.salaries + incomeDetails.expenses.electricity + incomeDetails.expenses.otherExpenses)) / (incomeDetails.income.grossReceipts + incomeDetails.income.otherIncomes) * 100).toFixed(2)}%</td>
            </tr>
          </table>
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">Other Income</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${otherIncome.otherIncome.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("")}</td>
            </tr>
          </table>
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}">References (Name & Contact No.)</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${formatMultiline(references.references)}</td>
            </tr>
          </table>
          <table style="${tableStyle}">
            <tr>  
              <td style="${labelCellStyle}">Status of the Case</td>
            </tr>
            <tr>
              <td style="${valueCellStyle}">${html_data.approvedStatus}</td>
            </tr>
          </table>
         </td>
         </tr>
      </table>
      <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}">Name of PD Officer</td>
          <td style="${valueCellStyle}">${html_data.verifierName}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Date of Discussion</td>
          <td style="${valueCellStyle}">${verificationData.dateOfDiscussion?.dateOfDiscussion || new Date().toLocaleDateString("en-IN")}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Signature of the PD Officer</td>
          <td style="${valueCellStyle}"></td>
        </tr>
      </table>



      <p style="margin:24px 0 8px;"><strong>Disclaimer Clause:</strong> <br>This report (including any attachments) has been prepared based on verbal information provided by the person contacted. IIFL HOME FINANCE LTD will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. KOWTHA & CO will not be held liable in any case</p>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};

export default iiflTemplate;
