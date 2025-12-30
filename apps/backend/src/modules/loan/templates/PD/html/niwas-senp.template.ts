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

const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
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
  const headerRow = headers
    .map(
      (header) =>
        `<th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">${header}</th>`
    )
    .join("");

  const safeRows = rows && rows.length > 0 ? rows : [headers.map(() => "-")];

  const bodyRows = safeRows
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

export const niwasSenpTemplate = (verificationData: any, html_data: any) => {
  const general = verificationData.generalInfo || {};
  const assets = verificationData.assetsInvestments || {};
  const employment = verificationData.businessEmployment || {};
  const business = verificationData.businessDetails || {};
  const pastEmploymentBusinessDetails = verificationData.pastEmploymentBusinessDetails || {};
  const businessIncomeComputationMonthly = verificationData.businessIncomeComputationMonthly || {};
  const ess = ensureArray(verificationData.essChecklist?.essResponses);
  const existingLoans =     verificationData.existingLoanDetails || {};
  const costFunds = verificationData.costAndFunds || {};
  const banking = ensureArray(verificationData.bankingDetails?.bankingAccounts);
  const familyMembers = verificationData.familyMembers || {};
  const references = ensureArray(verificationData.references?.references);
  const businessChecks = ensureArray(
    verificationData.businessFirmCheck?.checks
  );
  const pdComments = verificationData.pdOfficerComments || {};

  const assetRows = [
    ["Smartphone", assets.smartphone],
    ["Washing Machine", assets.washingMachine],
    ["Car RC No.", assets.carRcNo],
    ["Two-Wheeler", assets.twoWheeler],
    ["Auto/Cab", assets.autoCab],
    ["Computer/Laptop", assets.computerLaptop],
    ["AC", assets.ac],
    ["Fridge", assets.fridge],
    ["Induction", assets.induction],
    ["Insurance (LIC)", assets.insurance],
    ["Fixed Deposit", assets.fixedDeposit],
    ["Chit Funds", assets.chitFunds],
    ["Post Office Savings", assets.postOfficeSavings],
    ["Is Post Office savings monthly?", assets.postOfficeSavingsMonthly],
    ["Any Recurring Deposit", assets.recurringDeposit],
    ["Do you consume Nicotine Products or Alcohol?", assets.consumptionHabits],
  ].map(([label, value]) => [label, formatMultiline(value)]);

  const familyRows = ensureArray(familyMembers?.familyMembers).map((member: any) => [
    member.name || "",
    member.relationship || "",
    member.age || "",
    member.employmentType || "",
    member.education || "",
    member.contactNumber || "",
    member.stayingWithApplicant || "",
  ]);

  const loanPurpose = verificationData.loanDetails || {};
  const bankingRows = banking.map((account: any) => [
    account.bankName || "",
    account.accountNumber || "",
    account.accountType || "",
    account.branch || "",
    account.operatingSinceYears || "",
  ]);

  const referenceRows = references.map((ref: any) => [
    ref.name || "",
    ref.address || "",
    ref.relationship || "",
    ref.contactNumber || "",
    ref.email || "",
    ref.yearsKnown || "",
    ref.photoWithApplicant || "",
  ]);

  const businessCheckRows = businessChecks.map((check: any) => [
    check.name || "",
    check.businessName || "",
    check.address || "",
    check.yearsKnown || "",
    check.contactNumber || "",
    check.feedback || "",
    check.businessCardCollected || "",
  ]);

  const essRows = ess.map((entry: any, index: number) => [
    `(${String.fromCharCode(97 + index)})`,
    entry.question || "",
    entry.response || "",
  ]);

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content niwas-senp-template">
    <h1 style="margin:0 0 16px;color:#1f2a37;font-size:24px; text-align:center">PD Meet - Self Employed Applicant</h1>
      <table style="${tableStyle}">
        ${renderKeyValue("Prospect No.", general.prospectNo)}
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="2">Basic Details</td>
        </tr>
        ${renderKeyValue("Name", general.applicantName)}
        ${renderKeyValue("Marital Status", general.maritalStatus)}
        ${renderKeyValue(
          "Educational Qualification",
          general.educationalQualification
        )}
        ${renderKeyValue("Category", general.category)}
        ${renderKeyValue(
          "Dependents - Children / Adults / Others",
          `Children: ${formatMultiline(
            general.dependentsChildren
          )} | Adults: ${formatMultiline(
            general.dependentsAdults
          )} | Others: ${formatMultiline(general.dependentsOthers)}`
        )}
        ${renderKeyValue(
          "Number of years in Current Residence",
          general.yearsInCurrentResidence
        )}
        ${renderKeyValue(
          "Current residence house size",
          general.currentResidenceHouseSize
        )}
        ${renderKeyValue("If <1= Year, then Previous Address", general.yearsInCurrentResidence === "<1 Year" ? general.previousAddress : "NA")}
        ${renderKeyValue("Number of Years Stayed at that Address", general.yearsInCurrentResidence === "<1 Year" ? general.yearsAtPreviousAddress : "NA")}
     
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
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.yearsInCurrentCity === "<=3 Years" ? general.previousCity : "NA")}</td>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Number of Years in that City:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.yearsInCurrentCity === "<=3 Years" ? general.yearsInPreviousCity : "NA")}</td>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Reason for Change:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.yearsInCurrentCity === "<=3 Years" ? general.reasonForChange : "NA")}</td>
              </tr>
            </table>
          </td>
        </tr>
        ${renderKeyValue("Parents staying with", general.parentsStayingWith)}
        <td style="${labelCellStyle}">If parents living separately, then mention</td>
          <td style="${valueCellStyle}" colspan="3">
            <table style="border-collapse:collapse;width:100%;margin:0;">
              <tr>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Residing City:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.ifParentsLivingSeparately?.residingCity)}</td>
                <td style="border:none;padding:0 16px 0 0;font-weight:600;color:#333;">Residing Location Ownership Status:</td>
                <td style="border:none;padding:0 16px 0 0;color:#333;">${formatMultiline(general.ifParentsLivingSeparately?.residingLocationOwnershipStatus)}</td>
              </tr>
            </table>
          </td>
      </table>

      <table style="${tableStyle}">
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="6"><b>Assets and Investments</b></td>
        </tr>
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
          <td style="${valueCellStyle}" colspan="5"> ${formatMultiline(assets.consumptionHabits) || "Not provided"}</td>
          </tr>
      </table>

      <table style="${tableStyle}">
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="2">Employment Details</td>
        </tr>
        ${renderKeyValue("Name of Current Business Firm", employment.businessName)}
        ${renderKeyValue("Type of Business Firm", employment.businessConstitution)}
        ${renderKeyValue("If Partnership, % shareholding", employment.partnershipShare ? `${employment.partnershipShare}%` : "")}
        ${renderKeyValue(
          "Date of commencement of business",
          employment.businessCommencementDate
        )}
        ${renderKeyValue(
          "Place of incorporation",
          "Address: " + formatMultiline(employment.placeOfIncorporation)
        )}
        <tr>
          <td style="${labelCellStyle}" colspan="2">if above less than 3 years, then provide details:-</td>
        </tr>
        ${renderKeyValue("Name of the Previous Business", employment.previousBusinessName)}
        ${renderKeyValue(
          "Number of Years worked in previous business",
          employment.previousBusinessYears
        )}
        ${renderKeyValue(
          "Reason for change / Closing the previous business",
          employment.reasonForChange
        )}
        ${renderKeyValue(
          "Total work experience",
          employment.totalWorkExperience
        )}
        ${renderKeyValue("Official / Business Email-ID", employment.officialEmail)}
        ${renderKeyValue("Contact Number", employment.contactNumber)}
      </table>

      <table style="${tableStyle}">
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="2"><b>Business Details</b></td>
        </tr>
        ${renderKeyValue("Type of industry", business.typeOfIndustry)}
        ${renderKeyValue("Business Profile", business.businessProfile)}
        ${renderKeyValue("Business Premises Ownership", business.businessPremisesOwnership)}
        ${renderKeyValue("Area of office", business.areaOfOffice)}
        ${renderKeyValue(
          "Stock/Assets Seen in Business Premises",
          business.stocksAssetsSeen
        )}
        ${renderKeyValue(
          "Others (Please specify all major assets seen)",
          business.otherAssetsSeen
        )}
        ${renderKeyValue(
          "Locality of business Premises",
          business.localityOfBusiness
        )}
        ${renderKeyValue("Annual Turnover", business.annualTurnover)}
        ${renderKeyValue("Net Profit Margin", business.netProfitMargin)}
        ${renderKeyValue("Is Business seasonal?", business.businessSeasonal)}
        ${renderKeyValue("Number of Employees", business.numberOfEmployees)}
        ${renderKeyValue("Profile Description of employee/staff", business.profileDescriptionOfEmployeeStaff)}
        ${renderKeyValue("Designation of Employee/Staff member", business.designationOfEmployeeStaffMember)}
        ${renderKeyValue("No. of Employees in that role", business.noOfEmployeesInThatRole)}
        ${renderKeyValue("No of Years Business Running in this Premises", business.yearsAtCurrentPremises)}
        ${renderKeyValue("If less than 3 years - Provide address details from where it was operating earlier", business.earlierOperatingAddress)}
        ${renderKeyValue("Popularity in Local Market", business.popularityInLocalMarket)}
        ${renderKeyValue("No. of Competitors in Nearby Market", business.noOfCompetitorsInNearbyMarket)}
        ${renderKeyValue("Final Product/Service of Business", business.finalProductServiceOfBusiness)}
        ${renderKeyValue("Business Started by", business.businessStartedBy)}
        ${renderKeyValue("If Self Started, Source of initial Funds", business.sourceOfInitialFunds)}
      </table>

      <table style="${tableStyle}">
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="6"><b>Past Employment/Business Details</b></td>
        </tr>
              <tr>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Employer/Business Name</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Designation</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">From</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">To</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Reason for Closing</th>
                <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Contact Person Name & Number</th>
              </tr>
              ${pastEmploymentBusinessDetails.pastEmployments.map((employment: any) => `  
              <tr>
                <td style="${valueCellStyle}">${employment.employerBusinessName}</td>
                <td style="${valueCellStyle}">${employment.designation}</td>
                <td style="${valueCellStyle}">${employment.from}</td>
                <td style="${valueCellStyle}">${employment.to}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.reasonForClosing)}</td>
                <td style="${valueCellStyle}">${employment.contactPersonName} ${employment.contactPersonNumber ? `- ${employment.contactPersonNumber}` : ""}</td>
              </tr>
              `).join("")}  
        </table>

        <table style="${tableStyle}; text-align:left;">
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="4"><b>Business Income Computation (Monthly Basis)</b></td>
        </tr>
          <tr>
            <th colspan="2" style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:center;color:#222;background:#f4f6fb;">Revenue</th>
            <th colspan="2" style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:center;color:#222;background:#f4f6fb;">Expenditure</th>
          </tr>
          <tr>
            <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Revenue</th>
            <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:right;color:#222;background:#f4f6fb;">Amount (in Rs)</th>
            <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:left;color:#222;background:#f4f6fb;">Expenditure</th>
            <th style="border:1px solid #c7cdd1;padding:8px;font-weight:600;text-align:right;color:#222;background:#f4f6fb;">Amount (in Rs)</th>
          </tr>
          <tr>
            <td style="${labelCellStyle}">Sales</td>
            <td style="${valueCellStyle};text-align:right">${formatCurrency(businessIncomeComputationMonthly.revenue.sales)}</td>
            <td style="${labelCellStyle}">Wages</td>
            <td style="${valueCellStyle};text-align:right">${formatCurrency(businessIncomeComputationMonthly.expenditure.wages)}</td>
          </tr>
          <tr>
            <td style="${valueCellStyle}" colspan="2"></td>
            <td style="${labelCellStyle}">Diesel</td>
            <td style="${valueCellStyle};text-align:right">${formatCurrency(businessIncomeComputationMonthly.expenditure.diesel)}</td>
          </tr>
          <tr>
            <td style="${valueCellStyle}" colspan="2"></td>
            <td style="${labelCellStyle}">Maintenance & Repairs</td>
            <td style="${valueCellStyle};text-align:right">${formatCurrency(businessIncomeComputationMonthly.expenditure.maintenanceRepairs)}</td>
          </tr>
          <tr>
            <td style="${valueCellStyle}" colspan="2"></td>
            <td style="${labelCellStyle}">Other expenses</td>
            <td style="${valueCellStyle};text-align:right">${formatCurrency(businessIncomeComputationMonthly.expenditure.otherExpenses)}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle};font-weight:600;" colspan="1">Total Monthly Revenue (A)</td>
            <td style="${valueCellStyle};font-weight:600;text-align:right">${formatCurrency(businessIncomeComputationMonthly.revenue.totalMonthlyRevenueA)}</td>
            <td style="${labelCellStyle};font-weight:600;" colspan="1">Total Monthly Expenses(B)</td>
            <td style="${valueCellStyle};font-weight:600;text-align:right">${formatCurrency(businessIncomeComputationMonthly.expenditure.totalMonthlyExpensesB)}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle};font-weight:600;" colspan="4"></td>
          </tr>
          ${renderKeyValue("Net Monthly Profit (= A - B)", formatCurrency(businessIncomeComputationMonthly.netMonthlyProfitAB), undefined, { colspan: 4 })}
          ${renderKeyValue("Other Monthly Income", formatCurrency(businessIncomeComputationMonthly.otherMonthlyIncome), undefined, { colspan: 4 })}
          ${renderKeyValue("Rental Income - Cash", formatCurrency(businessIncomeComputationMonthly.rentalIncomeCash), undefined, { colspan: 4 })}
          ${renderKeyValue("Rental Income - Cheque", formatCurrency(businessIncomeComputationMonthly.rentalIncomeCheque), undefined, { colspan: 4 })}
          ${renderKeyValue("Incentives / Perks - Cash", formatCurrency(businessIncomeComputationMonthly.incentivesCash), undefined, { colspan: 4 })}
          ${renderKeyValue("Incentives / Perks - Cheque", formatCurrency(businessIncomeComputationMonthly.incentivesCheque), undefined, { colspan: 4 })}
          ${renderKeyValue("Monthly Bonus - Cash", formatCurrency(businessIncomeComputationMonthly.monthlyBonusCash), undefined, { colspan: 4 })}
          ${renderKeyValue("Monthly Bonus - Cheque", formatCurrency(businessIncomeComputationMonthly.monthlyBonusCheque), undefined, { colspan: 4 })}
          <tr>
            <td style="${labelCellStyle}">Others, please specify source type:</td>
            <td style="${valueCellStyle}" colspan="3">${formatMultiline(businessIncomeComputationMonthly.otherMonthlyIncomeSourceType || "")}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle} colspan="2">Monthly Income (In Rs):</td>
            <td style="${valueCellStyle}" colspan="1"><b>Cash Amount:</b> ${formatCurrency(businessIncomeComputationMonthly.otherMonthlyIncomeCash || "Not provided")}</td>
            <td style="${valueCellStyle}" colspan="2"><b>Cheque Amount:</b> ${formatCurrency(businessIncomeComputationMonthly.otherMonthlyIncomeCheque || "Not provided")}</td>
          </tr>
      </table>


      <table style="${tableStyle}">
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="5">Existing or Past Loan Details</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}">Loan Type</td>
            <td style="${labelCellStyle}">Lending Institution Name</td>
            <td style="${labelCellStyle}">Loan Amount (in Rs.)</td>
            <td style="${labelCellStyle}">Tenure Remaining</td>
            <td style="${labelCellStyle}">EMI</td>
          </tr>
          ${ensureArray(existingLoans?.existingLoans).map((loan: any) => `
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(loan.typeOfLoan || "")}</td>
            <td style="${valueCellStyle}">${formatMultiline(loan.bankName || "")}</td>
            <td style="${valueCellStyle}">${formatCurrency(loan.loanAmount || "Not provided")}</td>
            <td style="${valueCellStyle}">${formatMultiline(loan.tenureRemaining || "")}</td>
            <td style="${valueCellStyle}">${formatCurrency(loan.emi || "Not provided")}</td>
          </tr>
          `).join("")}
        </table>

      <table style="${tableStyle}">
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="2">Loan Details</td>
        </tr>
        ${renderKeyValue("Purpose of Loan", loanPurpose.purposeOfLoan)}
        ${renderKeyValue("Minimum Loan Amount Required", loanPurpose.minimumLoanAmountRequired)}
        ${renderKeyValue("Tenure Required", loanPurpose.tenureRequired)}
        ${renderKeyValue("Monthly Household Expenses", loanPurpose.monthlyHouseholdExpenses)}
        ${renderKeyValue("Comfortable EMI", loanPurpose.comfortableEmi)}
        ${renderKeyValue("Status of Property to be Purchased", loanPurpose.statusOfPropertyToBePurchased)}
        ${renderKeyValue("Usage of Property After Purchase", loanPurpose.usageOfPropertyAfterPurchase)}
      </table>


      <table style="${tableStyle}">
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="2">Cost and Funds Information(Loan Details)</td>
        </tr>
        ${renderKeyValue("Funds required", formatCurrency(costFunds.fundsRequired))}
        ${renderKeyValue("Source of own funds (OCR)", costFunds.sourceOfOwnFunds)}
        ${renderKeyValue("Purchase cost", formatCurrency(costFunds.purchaseCost))}
        ${renderKeyValue("Savings", formatCurrency(costFunds.savings))}
        ${renderKeyValue(
          "Construction estimate",
          formatCurrency(costFunds.constructionEstimate)
        )}
        ${renderKeyValue("Family/Friends", costFunds.familyFriends)}
        ${renderKeyValue("Registration/Stamp Duty Charges", formatCurrency(costFunds.registrationStampDutyCharges))}
        ${renderKeyValue("Other Loan Taken", formatCurrency(costFunds.otherLoanAmountTaken))}
        ${renderKeyValue("Other Expenses", formatCurrency(costFunds.otherExpenses))}
        ${renderKeyValue("Total Amount Spent (Total of all the above)", formatCurrency(costFunds.totalAmountSpent))}
        ${renderKeyValue(
          "Total transaction cost (Total of all the above)",
          formatCurrency(costFunds.totalTransactionCost)
        )}
        <tr>
          <td style="${labelCellStyle}" >Mode of Payment to Seller:</td>
          <td style="${valueCellStyle}" colspan="2">
          <span><b>Cash Amount:</b> ${formatCurrency(costFunds.modeOfPaymentToSeller.cashAmount || "Not provided")}</span>
          <span style="margin-left: 16px;"><b>Cheque Amount:</b> ${formatCurrency(costFunds.modeOfPaymentToSeller.chequeAmount || "Not provided")}</span>
          </td>
        </tr>
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:14px;text-align:center;">
        Other Family Member Details
      </h2>
      ${renderArrayTable(
        [
          "Name",
          "Relationship",
          "Age",
          "Employment Type",
          "Educational Qualification(Also mention if Govt. or Private institution)",
          "Contact No.",
          "Staying with Applicant",
        ],
        familyRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:14px;text-align:center;">
        Reference (Business Parties)
      </h2>

      ${renderArrayTable(
        [
          "Name",
          "Address",
          "Relationship",
          "Contact Number",
          "Email Address",
          "No of Years Known the Applicant",
          "Photo with Applicant",
        ],
        referenceRows
      )}

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:14px;text-align:center;">
        Business Firm Check (From Neighbor/ Independent checking/ From existing customer)
      </h2>
      ${renderArrayTable(
        [
          "Name of the Applicant",
          "Name of Business Firm",
          "Address",
          "No of Years Known the Firm",
          "Contact Number",
          "Feedback about Employer/Firm",
          "Business Card Collected (Yes/No)",
        ],
        businessCheckRows
      )}


      <table style="${tableStyle}">
        <tr>
          <td style="text-align:center;font-size:14px;${labelCellStyle}" colspan="2">To be Filled by PD Officer</td>
        </tr>
        ${renderKeyValue(
          "Brief Comments/Observations of the case",
          pdComments.comments.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join("")
        )}
        ${renderKeyValue("Initiated address", pdComments.initiatedAddress)}
        ${renderKeyValue("Visited address", pdComments.visitedAddress)}
        ${renderKeyValue("Residential address", pdComments.residentialAddress)}
        ${renderKeyValue("Other observations", pdComments.otherObservations.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join(""))}
        ${renderKeyValue("Concerns", pdComments.concerns.split("\n").map((line: string) => `<ul><li>${line}</li></ul>`).join(""))}
        ${renderKeyValue("Status of the case", html_data.approvedStatus || "Not provided")}
        ${renderKeyValue("Name of PD Officer", pdComments.nameofInterviewer)}
        ${renderKeyValue("Date of Discussion", pdComments.discussionDate)}
        <tr>
          <td style="${labelCellStyle}">Signature of the PD Officer</td>
          <td style="${valueCellStyle}"></td>
        </tr>
      </table>

      <p style="margin:24px 0 8px;font-weight:600;color:#222;">Disclaimer Clause:</p>
      <p style="margin:0 0 24px;color:#333;">
        This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Niwas Home Finance Private Limited will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. Kowtha &amp; Co will not be held liable in any case.
      </p>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
