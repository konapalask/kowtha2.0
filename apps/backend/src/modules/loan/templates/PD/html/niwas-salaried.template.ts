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

export const niwasSalariedTemplate = (
  verificationData: any,
  html_data: any
) => {
  const general = verificationData.generalInfo || {};
  const assets = verificationData.assetsInvestments || {};
  const employment = verificationData.employmentDetails || {};
  const companyDetails = verificationData.companyEmployerInformation || {};
  const premises = verificationData.businessPremises || {};
  const ess = ensureArray(verificationData.essChecklist?.essResponses);
  const existingLoans = ensureArray(
    verificationData.existingLoans?.existingLoans
  );
  const loanPurpose = verificationData.loanPurpose || {};
  const costAndFunds = verificationData.costAndFunds || {};
  const familyMembers = ensureArray(
    verificationData.familyMembers?.familyMembers
  );
  const references = ensureArray(verificationData.references?.references);
  const employerChecks = ensureArray(
    verificationData.employerFirmCheck?.checks
  );
  const pastEmployments = ensureArray(
    verificationData.pastEmploymentBusinessDetails?.pastEmployments
  );
  const financialDetails = verificationData.financialDetails || {};
  const pdComments = verificationData.pdOfficerComments || {};

  const assetRows = [
    ["Smartphone", assets.smartphone],
    ["Washing Machine", assets.washingMachine],
    ["Car RC No.", assets.carRcNo],
    ["Two-Wheeler", assets.twoWheeler],
    ["Auto / Cab", assets.autoCab],
    ["Computer / Laptop", assets.computerLaptop],
    ["AC", assets.ac],
    ["Fridge", assets.fridge],
    ["Induction", assets.induction],
    ["Property", assets.property],
    ["Insurance (LIC)", assets.insurance],
    ["Fixed Deposit", assets.fixedDeposit],
    ["Chit Funds", assets.chitFunds],
    ["Post Office Savings", assets.postOfficeSavings],
    [
      "IsPost Office Savings Monthly",
      assets.postOfficeSavingsMonthly,
    ],
    ["Any Recurring Deposit", assets.recurringDeposit],

    ["Do you consumeNicotine Products or Alcohol?", assets.consumptionHabits],
  ].map(([label, value]) => [label, formatMultiline(value)]);

  const familyRows = familyMembers.map((member: any) => [
    member.name || "",
    member.relation || member.relationship || "",
    member.age || "",
    member.employmentType || "",
    member.education || "",
    member.contactNumber || "",
    member.stayingWithApplicant || "",
  ]);

  const existingLoanRows = existingLoans.map((loan: any) => [
    loan.typeOfLoan || "",
    loan.bankName || "",
    loan.loanAmount ? formatCurrency(loan.loanAmount) : "",
    loan.emi ? formatCurrency(loan.emi) : "",
    loan.tenureRemaining || "",
  ]);

  const referenceRows = references.map((ref: any) => [
    ref.name || "",
    ref.address || "",
    ref.designation || "",
    ref.yearsKnown || "",
    ref.contactNumber || "",
    ref.email || "",
   ]);

  const employerCheckRows = employerChecks.map((check: any) => [
    check.name || "",
    check.businessName || "",
    check.address || "",
    check.yearsKnown || "",
    check.contactNumber || "",
    check.feedback || "",
  ]);

  const essRows = ess.map((entry: any, index: number) => [
    `(${String.fromCharCode(97 + index)})`,
    entry.question || "",
    entry.response || "",
  ]);

  const pastEmploymentRows = ensureArray(pastEmployments).map((employment: any) => [
    employment.emplyerorBusinessName || "",
    employment.designation || "",
    employment.fromDate || "",
    employment.toDate || "",
    `${employment.contactPersonName || ""}${employment.contactPersonNumber ? ` - ${employment.contactPersonNumber}` : ""}`.trim(),
    employment.reasonForMovement || "",
  ]);

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content niwas-salaried-template">
    <h1 style="margin:0 0 16px;color:#1f2a37;font-size:24px; text-align:center">PD Sheet - Salaried Applicant</h1>
    <table style="${tableStyle}">
      ${renderKeyValue("Prospect No.", general.prospectNo)}
    </table>

      <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Basic Details</h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Name of Applicant", general.nameOfApplicant)}
        ${renderKeyValue("Marital Status", general.maritalStatus)}
        ${renderKeyValue(
          "Educational Qualification",
          general.educationalQualification
        )}
        ${renderKeyValue("Category", general.category)}
        <tr>
          <td style="${labelCellStyle}">Number of Dependents</td>
          <td style="${valueCellStyle}" colspan="3">
            <table style="border-collapse:collapse;width:100%;margin:0;">
              <tr>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Children:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.dependentsChildren)}</td>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Adults:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.dependentsAdults)}</td>
                <td style="border:none;padding:0;font-weight:600;color:#333;">Others:</td>
                <td style="border:none;padding:0;color:#333;">${formatMultiline(general.dependentsOthers)}</td>
              </tr>
            </table>
          </td>
        </tr>
        ${renderKeyValue(
          "Number of Years in Current Residence",
          general.yearsInCurrentResidence
        )}
        ${renderKeyValue("Current ResidenceHouse Size", general.houseSize)}

        ${renderKeyValue("If <1= Year, then Previous Address", general.previousAddress)}
        ${renderKeyValue("Number of Years Stayed at that Address", general.yearsAtPreviousAddress)}
     
        ${renderKeyValue(
          "Number of Years in Current City",
          general.yearsInCurrentCity
        )}
        <tr>
          <td style="${labelCellStyle}">If <=3 Years, then Previous City</td>
          <td style="${valueCellStyle}" colspan="3">
            <table style="border-collapse:collapse;width:100%;margin:0;">
              <tr>
               <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Previous City:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.previousCity)}</td>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Number of Years in that City:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.yearsAtPreviousAddress)}</td>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Reason for Change:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.reasonForChange)}</td>
              </tr>
            </table>
          </td>
        </tr>
               ${renderKeyValue(
          "Parents Staying With",
          general.parentsStayingWith
        )}

          <td style="${labelCellStyle}">If parents living separately, then mention</td>
          <td style="${valueCellStyle}" colspan="3">
            <table style="border-collapse:collapse;width:100%;margin:0;">
              <tr>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Residing City:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.residingCity)}</td>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Residing Location Ownership Status:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.residingLocationOwnershipStatus)}</td>
              </tr>
            </table>
          </td>
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Assets and Investments
      </h2>
      <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}">Assets Owned</td>
          <td style="${valueCellStyle}" colspan="5">
            <table style="border-collapse:collapse;width:100%;margin:0;">
              <tr>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Smartphone (Yes/No):</b> ${assetRows[0]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Washing Machine (Yes/No):</b> ${assetRows[1]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Car RC No. (Yes/No):</b> ${assetRows[2]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Two-Wheeler (Yes/No):</b> ${assetRows[3]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Auto/Cab (Yes/No):</b> ${assetRows[4]?.[1] || "Not provided"}</td>
              </tr>
              <tr>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Computer / Laptop (Yes/No):</b> ${assetRows[5]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>AC (Yes/No):</b> ${assetRows[6]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Fridge (Yes/No):</b> ${assetRows[7]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Induction (Yes/No):</b> ${assetRows[8]?.[1] || "Not provided"}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Investments (Mention Amount if he owns or invest in any instrument)</td>
          <td style="${valueCellStyle}" colspan="5">
            <table style="border-collapse:collapse;width:100%;margin:0;">
              <tr>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Property:</b> ${assetRows[9]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Insurance (LIC):</b> ${assetRows[10]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Fixed Deposit:</b> ${assetRows[11]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Chit Funds:</b> ${assetRows[12]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Post Office Savings:</b> ${assetRows[13]?.[1] || "Not provided"}</td>
              </tr>
              <tr>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Is Post Office savings monthly (Yes/No):</b> ${assetRows[14]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;"><b>Any recurring deposit (Yes/No):</b> ${assetRows[15]?.[1] || "Not provided"}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Did you consume Nicotine Products or Alcohol?</td>
          <td style="${valueCellStyle}" colspan="5"> ${assetRows[16]?.[1] || "Not provided"}</td>
          </tr>
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Employment Details
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Name of Current Employer/Business Firm", employment.employerName)}
        ${renderKeyValue(
          "Years in Current Job / Date",
          employment.yearsInCurrentJob
        )}
        ${renderKeyValue(
          "Total Work Experience (in years)",
          employment.totalWorkExperience
        )}
        ${renderKeyValue("Official/Business Email-ID", employment.officialEmail)}
        ${renderKeyValue("Contact Number", employment.contactNumber)}
        ${renderKeyValue(
          "Number of Employees in Firm",
          employment.numberOfEmployeesInFirm
        )}
        <tr>
          <td style="${labelCellStyle}">Final Product/Service offered by Company</td>
          <td style="${valueCellStyle}">${employment.finalProductServiceOffered || "Not provided"}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Number of Competitors in Nearby Market</td>
          <td style="${valueCellStyle}">${employment.companyCompetitors || "Not provided"}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Locality of Business Premises</td>
            <td style="${valueCellStyle}">${ employment.localityOfBusinessPremises || "Not provided"}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}" colspan="2"></td>
        </tr>
          ${renderKeyValue("Employee ID (Copy/Photograph Mandatory)", employment.employeeId || "Not provided")}
          ${renderKeyValue("Designation", employment.designation || "Not provided")}
        <tr>
          <td colspan="2" style="padding:0;">
            <table style="${tableStyle}">
              <tr>
                <th style="${labelCellStyle}">Mode of Salary</th>
                <th style="${labelCellStyle}">Type of Employer</th>
                <th style="${labelCellStyle}">Type of Industry</th>
                <th style="${labelCellStyle}">Department</th>
                <th style="${labelCellStyle}">Role</th>
              </tr>
              <tr>
                <td style="${valueCellStyle}">${ companyDetails.modeOfSalary || "Not provided"}</td>
                <td style="${valueCellStyle}">${ companyDetails.typeOfEmployer || "Not provided"}</td>
                <td style="${valueCellStyle}">${ companyDetails.typeOfIndustry || "Not provided"}</td>
                <td style="${valueCellStyle}">${ companyDetails.department || "Not provided"}</td>
                <td style="${valueCellStyle}">${ companyDetails.role || "Not provided"}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Past Employment/Business Details
      </h2>
      <table style="${tableStyle}">
              <tr>
                <th style="${labelCellStyle}">Employer/Business Name</th>
                <th style="${labelCellStyle}">Designation</th>
                <th style="${labelCellStyle}">From</th>
                <th style="${labelCellStyle}">To</th>
                <th style="${labelCellStyle}">Contact Person Name & Number</th>
                <th style="${labelCellStyle}">Reason for Movement</th>
              </tr>
              <tr>
                <td style="${valueCellStyle}">${formatMultiline(pastEmploymentRows[0]?.[0] || "")}</td>
                <td style="${valueCellStyle}">${formatMultiline(pastEmploymentRows[0]?.[1] || "")}</td>
                <td style="${valueCellStyle}">${formatMultiline(pastEmploymentRows[0]?.[2] || "")}</td>
                <td style="${valueCellStyle}">${formatMultiline(pastEmploymentRows[0]?.[3] || "")}</td>
                <td style="${valueCellStyle}">${formatMultiline(pastEmploymentRows[0]?.[4] || "")}</td>
                <td style="${valueCellStyle}">${formatMultiline(pastEmploymentRows[0]?.[5] || "")}</td>
              </tr>
            </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Financial Details
      </h2>
      <table style="${tableStyle}">
          <tr>
            <td style="${labelCellStyle}">Monthly Salary Income</td>
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(financialDetails?.monthlySalaryIncome?.cashAmount || "Not provided")}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(financialDetails?.monthlySalaryIncome?.chequeAmount || "Not provided")}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}" colspan="3">Other Monthly Income:- ${formatCurrency(financialDetails?.otherMonthlyIncome || "Not provided")}</td> 
          </tr>
          <tr>
            <td style="${labelCellStyle}">Rental Income (In Rs)</td>
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(financialDetails?.rentalIncome?.cashAmount || "Not provided")}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(financialDetails?.rentalIncome?.chequeAmount || "Not provided")}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}">Incentives/Perks (In Rs)</td>
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(financialDetails?.incentives?.cashAmount || "Not provided")}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(financialDetails?.incentives?.chequeAmount || "Not provided")}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}">Monthly Bonus (In Rs)</td>
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(financialDetails?.monthlyBonus?.cashAmount || "Not provided")}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(financialDetails?.monthlyBonus?.chequeAmount || "Not provided")}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}">Others, please specify source type:</td>
            <td style="${valueCellStyle}" colspan="2">${formatMultiline(financialDetails?.otherMonthlyIncomeSourceType || "")}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}">Monthly Income (In Rs):</td>
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(financialDetails?.monthlyIncome?.cashAmount || "Not provided")}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(financialDetails?.monthlyIncome?.chequeAmount || "Not provided")}</td>
          </tr>
      </table>


      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Existing or Past Loan Details
      </h2>
      ${renderArrayTable(
        ["Loan Type", "Lending Institution Name", "Loan Amount (in Rs.)", "Tenure Remaining", "EMI"],
        existingLoanRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Loan Details
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Purpose of Loan", loanPurpose.purposeOfLoan)}
        ${renderKeyValue(
          "Minimum Loan Amount Required",
          loanPurpose.minimumLoanAmountRequired
        )}
        ${renderKeyValue(
          "Tenure Required",
          loanPurpose.tenureRequired
        )}
        ${renderKeyValue(
          "Monthly Household Expenses",
          loanPurpose.monthlyHouseholdExpenses
        )}
        ${renderKeyValue(
          "Comfortable EMI",
          loanPurpose.comfortableEmi
        )}
        ${renderKeyValue("Status of Property to be Purchased", loanPurpose.statusOfProperty)}
        ${renderKeyValue("Usage of Property After Purchase", loanPurpose.usageOfProperty)}
        
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        cost and Funds Information (Loan Details)
        </h2>
        <table style="${tableStyle}">
          ${renderKeyValue("Funds Required", costAndFunds.fundsRequired)}
          ${renderKeyValue(
            "Source of Own Funds (OCR)",
            costAndFunds.sourceOfOwnFunds
          )}
          ${renderKeyValue("Purchase Cost", costAndFunds.purchaseCost)}
          ${renderKeyValue("Savings", costAndFunds.savings)}
          ${renderKeyValue(
            "Construction Estimate",
            costAndFunds.constructionEstimate
          )}
          ${renderKeyValue("Family/Friends", costAndFunds.familyFriends)}
          ${renderKeyValue(
            "Registration / Stamp Duty charges",
            costAndFunds.registrationCharges
          )}
          ${renderKeyValue(
            "Other Loan Amount Taken",
            costAndFunds.otherLoanAmountTaken
          )}
          ${renderKeyValue("Other Expenses", costAndFunds.otherExpenses)}
          ${renderKeyValue(
            "Total Amount Spent (Total of all the above)",
            costAndFunds.totalAmountSpent
          )}
          ${renderKeyValue(
            "Total Transaction Cost (Total of all the above)",
            costAndFunds.totalTransactionCost
          )}
          ${renderKeyValue("Mode of Payment to Seller (Cash / Cheque)","Cash Amount:"+ formatCurrency(costAndFunds?.modeOfPaymentToSeller?.cashAmount || "Not provided")+"<br>" +"Cheque Amount: "+ formatCurrency(costAndFunds?.modeOfPaymentToSeller?.chequeAmount || "Not provided"))}
            </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Other Family Member Details
      </h2>
      ${renderArrayTable(
        [
          "Name",
          "Relation",
          "Age",
          "Employment Type",
          "Educational Qualification(Also mention if Govt. or Private institution)",
          "Contact No.",
          "Staying with Applicant",
        ],
        familyRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Reference Details
      </h2>
      ${renderArrayTable(
        [
          "Name",
          "Address",
          "Designation",
          "No of Years known the Applicant",
          "Contact Number",
          "Email Address", 
        ],
        referenceRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Employer Firm Check (From Neighbor)
      </h2>
      ${renderArrayTable(
        [
          "Name of the Person",
          "Name of Business Firm",
          "Address",
          "Number of Years Known the Firm",
          "Contact Number",
          "Feedback about Employer/Firm (Positive/Neutral/Negative)",
        ],
        employerCheckRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        To be Filled by PD Officer
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Brief Comments / Observations of the case", pdComments.comments)}
        ${renderKeyValue(
          "Name of PD Officer",
          pdComments.pdOfficerName
        )}
        ${renderKeyValue(
          "Date of Discussion",
          pdComments.discussionDate
        )}
        <tr>
          <td style="${labelCellStyle}">Signature of the PD Officer</td>
          <td style="${valueCellStyle}"></td>
        </tr>
        ${renderKeyValue(
          "PD Status",
          html_data.approvedStatus|| "Not provided"
        )}
      </table>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};

export default niwasSalariedTemplate;
