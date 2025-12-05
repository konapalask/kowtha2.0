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
  const business = verificationData.businessOperations || {};
  const ess = ensureArray(verificationData.essChecklist?.essResponses);
  const existingLoans = ensureArray(
    verificationData.existingLoanDetails?.existingLoans
  );
  const costFunds = verificationData.costAndFunds || {};
  const banking = ensureArray(verificationData.bankingDetails?.bankingAccounts);
  const familyMembers = ensureArray(
    verificationData.familyMembers?.familyMembers
  );
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
  ].map(([label, value]) => [label, formatMultiline(value)]);

  const familyRows = familyMembers.map((member: any) => [
    member.name || "",
    member.relationship || "",
    member.age || "",
    member.occupation || "",
    member.education || "",
    member.contactNumber || "",
    member.stayingWithApplicant || "",
  ]);

  const existingLoanRows = existingLoans.map((loan: any) => [
    loan.typeOfLoan || "",
    loan.bankName || "",
    loan.loanAmount || "",
    loan.emi || "",
    loan.tenureRemaining || "",
  ]);
  const loanPurpose = verificationData.loanPurpose || {};
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
          <td style="${labelCellStyle} text-align:center;" colspan="2">Basic Details</td>
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
        ${renderKeyValue("Parents staying with", general.parentsStayingWith)}
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
        ${renderKeyValue("Name of Current Business Firm", employment.businessName)}
        ${renderKeyValue("Type of Business Firm", employment.businessConstitution)}
        ${renderKeyValue("If Partnership, % shareholding", employment.partnershipShare)}
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

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Business Details
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Type of industry", business.typeOfIndustry)}
        ${renderKeyValue("Business Profile", business.natureOfBusiness)}
        ${renderKeyValue("Business Premises Ownership", business.constitution)}
        ${renderKeyValue("Area of office", business.areaOfOffice)}
        ${renderKeyValue(
          "Stock/Assets Seen in Business Premises",
          business.stockAssetsSeen
        )}
        ${renderKeyValue(
          "Others (Please specify all major assets seen)",
          business.othersMajorAssetsSeen
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
        ${renderKeyValue("If less than 3 years - Provide address details from where it was operating earlier", business.addressDetailsFromWhereItWasOperatingEarlier)}
        ${renderKeyValue("Popularity in Local Market", business.popularityInLocalMarket)}
        ${renderKeyValue("No. of Competitors in Nearby Market", business.noOfCompetitorsInNearbyMarket)}
        ${renderKeyValue("Final Product/Service of Business", business.finalProductServiceOfBusiness)}
        ${renderKeyValue("Business Started by", business.businessStartedBy)}
        ${renderKeyValue("If Self Started, Source of initial Funds", business.sourceOfInitialFunds)}
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
                <td style="${valueCellStyle}">${formatMultiline(employment.previousBusinessName)}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.designation)}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.fromDate)}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.toDate)}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.contactPersonName)}</td>
                <td style="${valueCellStyle}">${formatMultiline(employment.reasonForMovement)}</td>
              </tr>
        </table>

        <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        Business Income Computation (Monthly Basis)
        </h2>
        <table style="${tableStyle}; text-align:left;">
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
            <td style="${valueCellStyle};text-align:right">${formatCurrency(business.salesAmount)}</td>
            <td style="${labelCellStyle}">Wages</td>
            <td style="${valueCellStyle};text-align:right">${formatCurrency(business.wagesAmount)}</td>
          </tr>
          <tr>
            <td style="${valueCellStyle}" colspan="2"></td>
            <td style="${labelCellStyle}">Diesel</td>
            <td style="${valueCellStyle};text-align:right">${formatCurrency(business.diesel)}</td>
          </tr>
          <tr>
            <td style="${valueCellStyle}" colspan="2"></td>
            <td style="${labelCellStyle}">Maintenance & Repairs</td>
            <td style="${valueCellStyle};text-align:right">${formatCurrency(business.maintenanceRepairs)}</td>
          </tr>
          <tr>
            <td style="${valueCellStyle}" colspan="2"></td>
            <td style="${labelCellStyle}">Other expenses</td>
            <td style="${valueCellStyle};text-align:right">${formatCurrency(business.otherExpenses)}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle};font-weight:600;" colspan="1">Total Monthly Revenue (A)</td>
            <td style="${valueCellStyle};font-weight:600;text-align:right">${formatCurrency(business.totalMonthlyRevenue)}</td>
            <td style="${labelCellStyle};font-weight:600;" colspan="1">Total Monthly Expenses(B)</td>
            <td style="${valueCellStyle};font-weight:600;text-align:right">${formatCurrency(business.totalMonthlyExpenses)}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle};font-weight:600;" colspan="4"></td>
          </tr>
          ${renderKeyValue("Net Monthly Profit (= A - B)", business.netMonthlyProfit, undefined, { colspan: 4 })}
          ${renderKeyValue("Other Monthly Income", business.otherMonthlyIncome, undefined, { colspan: 4 })}
          ${renderKeyValue("Rental Income - Cash", business.rentalIncomeCash, undefined, { colspan: 4 })}
          ${renderKeyValue("Rental Income - Cheque", business.rentalIncomeCheque, undefined, { colspan: 4 })}
          ${renderKeyValue("Incentives / Perks - Cash", business.incentivesCash, undefined, { colspan: 4 })}
          ${renderKeyValue("Incentives / Perks - Cheque", business.incentivesCheque, undefined, { colspan: 4 })}
          ${renderKeyValue("Monthly Bonus - Cash", business.monthlyBonusCash, undefined, { colspan: 4 })}
          ${renderKeyValue("Monthly Bonus - Cheque", business.monthlyBonusCheque, undefined, { colspan: 4 })}
          <tr>
            <td style="${labelCellStyle}">Others, please specify source type:</td>
            <td style="${valueCellStyle}" colspan="3">${formatMultiline(employment.otherMonthlyIncomeSourceType || "")}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle} colspan="2">Monthly Income (In Rs):</td>
            <td style="${valueCellStyle}" colspan="1">Cash Amount: ${formatCurrency(employment.monthlyIncomeCash || "Not provided")}</td>
            <td style="${valueCellStyle}" colspan="2">Cheque Amount: ${formatCurrency(employment.monthlyIncomeCheque || "Not provided")}</td>
          </tr>
      </table>


      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
      Existing or Past Loan Details
      </h2>
      <table style="${tableStyle}">
          <tr>
            <td style="${labelCellStyle}">Loan Type</td>
            <td style="${labelCellStyle}">Lending Institution Name</td>
            <td style="${labelCellStyle}">Loan Amount (in Rs.)</td>
            <td style="${labelCellStyle}">Tenure Remaining</td>
            <td style="${labelCellStyle}">EMI</td>
          </tr>
          <tr>
            <td style="${valueCellStyle}">${formatMultiline(existingLoanRows[0]?.[0] || "")}</td>
            <td style="${valueCellStyle}">${formatMultiline(existingLoanRows[0]?.[1] || "")}</td>
            <td style="${valueCellStyle}">${formatCurrency(existingLoanRows[0]?.[2] || "Not provided")}</td>
            <td style="${valueCellStyle}">${formatMultiline(existingLoanRows[0]?.[4] || "")}</td>
            <td style="${valueCellStyle}">${formatCurrency(existingLoanRows[0]?.[3] || "Not provided")}</td>
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
      Loan Details
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Purpose of Loan", loanPurpose.purposeOfLoan)}
        ${renderKeyValue("Minimum Loan Amount Required", loanPurpose.minimumLoanAmountRequired)}
        ${renderKeyValue("Tenure Required", loanPurpose.tenureRequired)}
        ${renderKeyValue("Monthly Household Expenses", loanPurpose.monthlyHouseholdExpenses)}
        ${renderKeyValue("Comfortable EMI", loanPurpose.comfortableEmi)}
        ${renderKeyValue("Status of Property to be Purchased", loanPurpose.statusOfPropertyToBePurchased)}
        ${renderKeyValue("Usage of Property After Purchase", loanPurpose.usageOfPropertyAfterPurchase)}
      </table>


      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
      Cost and Funds Information(Loan Details)
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Funds required", costFunds.fundsRequired)}
        ${renderKeyValue("Source of own funds (OCR)", costFunds.sourceOfOwnFunds)}
        ${renderKeyValue("Purchase cost", costFunds.purchaseCost)}
        ${renderKeyValue("Savings", costFunds.savings)}
        ${renderKeyValue(
          "Construction estimate",
          costFunds.constructionEstimate
        )}
        ${renderKeyValue("Family/Friends", costFunds.familyFriends)}
        ${renderKeyValue("Registration/Stamp Duty Charges", costFunds.registrationStampDutyCharges)}
        ${renderKeyValue("Other Loan Taken", costFunds.otherLoanAmountTaken)}
        ${renderKeyValue("Other Expenses", costFunds.otherExpenses)}
        ${renderKeyValue("Total Amount Spent (Total of all the above)", costFunds.totalAmountSpent)}
        ${renderKeyValue(
          "Total transaction cost (Total of all the above)",
          costFunds.totalTransactionCost
        )}
        <tr>
          <td style="${labelCellStyle}" >Mode of Payment to Seller:</td>
          <td style="${valueCellStyle}" colspan="2">
          <span>Cash Amount: ${formatCurrency(costFunds.cashAmount || "Not provided")}</span>
          <span style="margin-left: 16px;">Cheque Amount: ${formatCurrency(costFunds.chequeAmount || "Not provided")}</span>
          </td>
        </tr>
      </table>

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
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

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
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

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
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

      <h2 style="margin:24px 0 16px;color:#1f2a37;font-size:16px;">
        To be Filled by PD Officer
      </h2>
      <table style="${tableStyle}">
        ${renderKeyValue(
          "Brief Comments/Observations of the case",
          pdComments.comments
        )}
        ${renderKeyValue("Initiated address", pdComments.initiatedAddress)}
        ${renderKeyValue("Visited address", pdComments.visitedAddress)}
        ${renderKeyValue("Residential address", pdComments.residentialAddress)}
        ${renderKeyValue("Other observations", pdComments.otherObservations)}
        ${renderKeyValue("Concerns", pdComments.concerns)}
        ${renderKeyValue("Status of the case", pdComments.statusOfCase)}
        ${renderKeyValue("Name of PD Officer", pdComments.pdOfficerName)}
        ${renderKeyValue("Date of Discussion", pdComments.discussionDate)}
        <tr>
          <td style="${labelCellStyle}">Signature of the PD Officer</td>
          <td style="${valueCellStyle}"></td>
        </tr>
        ${renderKeyValue(
          "Pd Status",
          html_data.approvedStatus|| "Not provided"
        )}
      </table>

      <p style="margin:24px 0 8px;font-weight:600;color:#222;">Disclaimer Clause:</p>
      <p style="margin:0 0 24px;color:#333;">
        This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Niwas Home Finance Private Limited will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. Kowtha &amp; Co will not be held liable in any case.
      </p>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
