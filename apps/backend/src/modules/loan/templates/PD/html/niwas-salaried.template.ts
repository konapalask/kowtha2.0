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
  const company = verificationData.companyDetails || {};
  const premises = verificationData.businessPremises || {};
  const ess = ensureArray(verificationData.essChecklist?.essResponses);
  const existingLoans = ensureArray(
    verificationData.existingLoans?.existingLoans
  );
  const loanPurpose = verificationData.loanPurpose || {};
  const familyMembers = ensureArray(
    verificationData.familyMembers?.familyMembers
  );
  const references = ensureArray(verificationData.references?.references);
  const employerChecks = ensureArray(
    verificationData.employerFirmCheck?.checks
  );
  const pastEmployments = ensureArray(
    verificationData.pastEmployment?.employments
  );
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
    ref.noOfYearsKnownTheApplicant || "",
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

  const pastEmploymentRows = pastEmployments.map((employment: any) => [
    employment.employerName || "",
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

        <tr>
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
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Smartphone (Yes/No): ${assetRows[0]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Washing Machine (Yes/No): ${assetRows[1]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Car RC No. (Yes/No): ${assetRows[2]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Two-Wheeler (Yes/No): ${assetRows[3]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Auto/Cab (Yes/No): ${assetRows[4]?.[1] || "Not provided"}</td>
              </tr>
              <tr>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Computer / Laptop (Yes/No): ${assetRows[5]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">AC (Yes/No): ${assetRows[6]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Fridge (Yes/No): ${assetRows[7]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Induction (Yes/No): ${assetRows[8]?.[1] || "Not provided"}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Investments (Mention Amount if he owns or invest in any instrument)</td>
          <td style="${valueCellStyle}" colspan="5">
            <table style="border-collapse:collapse;width:100%;margin:0;">
              <tr>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Property: ${assetRows[9]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Insurance (LIC): ${assetRows[10]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Fixed Deposit: ${assetRows[11]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Chit Funds: ${assetRows[12]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Post Office Savings: ${assetRows[13]?.[1] || "Not provided"}</td>
              </tr>
              <tr>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Is Post Office savings monthly (Yes/No): ${assetRows[14]?.[1] || "Not provided"}</td>
                <td style="border:1px solid #c7cdd1;padding:0 8px 0 0;color:#333;">Any recurring deposit (Yes/No): ${assetRows[15]?.[1] || "Not provided"}</td>
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
        ${renderKeyValue("Final Product/Service offered by Company", employment.natureOfBusiness)}
        ${renderKeyValue("Number of Competitors in Nearby Market", employment.numberOfCompetitorsInNearbyMarket)}
        ${renderKeyValue("Locality of Business Premises", employment.localityOfBusinessPremises)}
        <tr>
          <td style="${labelCellStyle}" colspan="2"></td>
        </tr>
          ${renderKeyValue("Employee ID (Copy/Photograph Mandatory)", employment.employeeId)}
          ${renderKeyValue("Designation", employment.designation)}
        <tr>
          <td colspan="2" style="padding:0;">
            <table style="${tableStyle}">
              <tr>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Mode of Salary</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Type of Employer</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Type of Industry</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Department</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Role</th>
              </tr>
              <tr>
                <td style="${valueCellStyle}">${formatMultiline(employment.modeOfSalary)}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.typeOfEmployer)}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.typeOfIndustry)}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.department)}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.role)}</td>
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
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Employer/Business Name</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Designation</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">From</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">To</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Contact Person Name & Number</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Reason for Movement</th>
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
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(employment.cashAmount || 0)}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(employment.chequeAmount || 0)}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}" colspan="3">Other Monthly Income:- ${formatCurrency(employment.otherMonthlyIncome || 0)}</td> 
          </tr>
          <tr>
            <td style="${labelCellStyle}">Rental Income (In Rs)</td>
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(employment.rentalIncomeCash || 0)}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(employment.rentalIncomeCheque || 0)}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}">Incentives/Perks (In Rs)</td>
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(employment.incentivesCash || 0)}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(employment.incentivesCheque || 0)}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}">Monthly Bonus (In Rs)</td>
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(employment.monthlyBonusCash || 0)}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(employment.monthlyBonusCheque || 0)}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}">Others, please specify source type:</td>
            <td style="${valueCellStyle}" colspan="2">${formatMultiline(employment.otherMonthlyIncomeSourceType || "")}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}">Monthly Income (In Rs):</td>
            <td style="${valueCellStyle}">Cash Amount: ${formatCurrency(employment.monthlyIncomeCash || 0)}</td>
            <td style="${valueCellStyle}">Cheque Amount: ${formatCurrency(employment.monthlyIncomeCheque || 0)}</td>
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
        ${renderKeyValue("Status of Property to be Purchased", loanPurpose.statusOfPropertyToBePurchased)}
        ${renderKeyValue("Usage of Property After Purchase", loanPurpose.usageOfPropertyAfterPurchase)}
        
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        cost and Funds Information (Loan Details)
        </h2>
        <table style="${tableStyle}">
          ${renderKeyValue("Funds Required", loanPurpose.fundsRequired)}
          ${renderKeyValue(
            "Source of Own Funds (OCR)",
            loanPurpose.sourceOfOwnFunds
          )}
          ${renderKeyValue("Purchase Cost", loanPurpose.purchaseCost)}
          ${renderKeyValue("Savings", loanPurpose.savings)}
          ${renderKeyValue(
            "Construction Estimate",
            loanPurpose.constructionEstimate
          )}
          ${renderKeyValue("Family/Friends", loanPurpose.familyFriends)}
          ${renderKeyValue(
            "Registration / Stamp Duty charges",
            loanPurpose.registrationCharges
          )}
          ${renderKeyValue(
            "Other Loan Amount Taken",
            loanPurpose.otherLoanAmountTaken
          )}
          ${renderKeyValue("Other Expenses", loanPurpose.otherExpenses)}
          ${renderKeyValue(
            "Total Amount Spent (Total of all the above)",
            loanPurpose.totalAmountSpent
          )}
          ${renderKeyValue(
            "Total Transaction Cost (Total of all the above)",
            loanPurpose.totalTransactionCost
          )}
          ${renderKeyValue("Mode of Payment to Seller (Cash / Cheque)", loanPurpose.modeOfPaymentToSeller)}
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
        ${renderKeyValue(
          "Signature of PD Officer",
          pdComments.pdOfficerSignature
        )}
      </table>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};

export default niwasSalariedTemplate;
