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
const formatNumber = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};
const formatCurrency = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  return `Rs. ${formatNumber(value).replace(/,/g, ",")}/-`;
};
const formatObservations = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const text = String(value);
  // Split by newlines and format as dotted bullets
  const lines = text
    .split(/\n+/)
    .filter((line: string) => line.trim().length > 0);
  if (lines.length === 0) return "Not provided";
  return lines.map((line: string) => `<ul style="margin:0 0 0 12px;padding:0;"><li>${line.trim()}</li></ul>`).join("<br>");
};

const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
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
  const documents = verificationData.documentVerification || {};
  const natureOfBusiness = verificationData.natureOfBusiness || {};
  const business = verificationData.businessOverview || {};
  const financials = verificationData.salesFinancials || {};
  const businessProfile = verificationData.businessProfile || {};
  const familyMembers = verificationData.familyMembers?.familyMembers || [];
  const observations = verificationData.observations || {};
  const loanDetails = verificationData.loanDetails || {};
  const dailyIncomeCalculation = verificationData.dailyIncomeCalculation || {};
  const expenses =
    verificationData.applicantsMonthlyExpensesOfTheBusiness || {};

  const templateName = html_data?.bankName || "Aditya Birla";

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content aditya-birla-template">
      <!-- <h2 style="margin:16px 0 8px;font-size:16px;font-weight:600;color:#222;text-align:center;">${templateName}</h2> -->
      <table style="${tableStyle}">
        ${renderKeyValue("Proposal No.", proposal.proposalNumber)}
        <tr>
          <td style="${labelCellStyle}">Date of Visit</td>
          <td style="${valueCellStyle}">${formatMultiline(proposal.dateOfVisit)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Time of Visit</td>
          <td style="${valueCellStyle}">${formatMultiline(proposal.timeOfVisit)}</td>
        </tr>
      </table>


      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">APPLICANT'S DETAIL</h2>
      <table style="${tableStyle}">
        ${renderKeyValue("Name of Applicant", applicant.nameOfApplicant)}
        ${renderKeyValue("Name of Co-applicant", applicant.nameOfCoApplicant)}
      </table>

      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;">ABOUT BUSINESS</h2>
      <table style="${tableStyle}">
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
        ${renderKeyValue("Documents verified", formatMultiline(documents.documentsVerified))}
        ${renderKeyValue("Nature of Business", natureOfBusiness.natureOfBusiness)}
        ${renderKeyValue("Main product", natureOfBusiness.mainProduct)}
        ${renderKeyValue("Main raw material", natureOfBusiness.mainRawMaterial)}
        ${renderKeyValue("Vendors / suppliers to applicant", natureOfBusiness.vendorsSuppliersToApplicant)}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Business Transaction", business.businessTransaction)}
        ${renderKeyValue("Stock observed", business.stockObserved)}
        ${renderKeyValue("If no stocks observed, reason for the same", business.reasonForNoStock)}
        ${renderKeyValue("Business Activity Observed", business.businessActivityObserved)}
      </table>

      <table style="${tableStyle}">
        
        ${renderKeyValue("Main customers in the business", financials.mainCustomers)}
        ${renderKeyValue("Sales payment terms", financials.salesPaymentTerms)}
        ${renderKeyValue("GST registration", financials.gstRegistration)}
        ${renderKeyValue("ITRs filing", financials.itrsFiling)}
        <tr>
          <td style="${labelCellStyle}">No. of employees & Salaries</td>
          <td style="${valueCellStyle}"><p style="margin:0 0 8px 0;"><strong>Declared by customer:</strong> ${formatMultiline(financials.numberOfEmployees.declaredByCustomer)}</p><p style="margin:0 0 8px 0;"><strong>Observed:</strong> ${formatMultiline(financials.numberOfEmployees.observed)}</p><p style="margin:0;"><strong>Salaries:</strong> ${formatCurrency(financials.numberOfEmployees.salaries)}</p></td>
        </tr>
        ${renderKeyValue("Godown address (if any)", financials.godownAddress)}
        ${renderKeyValue("Other business details (if any)", financials.otherBusinessDetails)}
      </table>

      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;"><u>BUSINESS PROFILE:</u></h2>
      <table style="${tableStyle}">
      <tr>
        <td colspan="2">
        ${renderKeyValue("BUSINESS PROFILE:", formatObservations(businessProfile.applicantSummary))}
        </td>
        <td colspan="2">
          ${renderKeyValue("Native Place", businessProfile.nativePlace)}
          ${renderKeyValue("Business Since", businessProfile.businessSince)}
          ${renderKeyValue("Previous Experience", businessProfile.previousExperience)}
          ${renderKeyValue("Business Premises", businessProfile.businessPremises)}
          ${renderKeyValue("if rented", businessProfile.ifRented)}
          ${renderKeyValue("Business Premises in Sq. ft:", businessProfile.businessPremisesInSqFt)}
          ${renderKeyValue("Market Reference from", businessProfile.marketReferenceFrom)}
          
        </td>
        <td colspan="2">
          ${renderKeyValue("Vendors contact Details", businessProfile.vendorsContactDetails)}
          ${renderKeyValue("Daily Sales/ Monthly Sales", businessProfile.dailySalesMonthlySales)}
        </td>
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("ABOUT PERSONAL DETAILS:", formatMultiline(businessProfile.personalDetailsSummary))}
        </table>

      <h2 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#222;"><u>Family Members:</u></h2>
      <table style="${tableStyle}">
      <tr>
        <td style="${labelCellStyle}">Name</td>
        <td style="${labelCellStyle}">Relation</td>
        <td style="${labelCellStyle}">Age</td>
        <td style="${labelCellStyle}">Business</td>
        <td style="${labelCellStyle}">Education</td>  
      </tr>
      ${ensureArray(familyMembers)
        .map(
          (member: any) => `
        <tr>
          <td style="${valueCellStyle}">${formatMultiline(member.name)}</td>
          <td style="${valueCellStyle}">${formatMultiline(member.relation)}</td>
          <td style="${valueCellStyle}">${formatMultiline(member.age)}</td>
          <td style="${valueCellStyle}">${formatMultiline(member.occupation)}</td>
          <td style="${valueCellStyle}">${formatMultiline(member.education)}</td>
        </tr>
      `
        )
        .join("\n")}
      </table>

      <table style="${tableStyle}">
        ${renderKeyValue("Sales Bills", observations.salesBills || observations.salesBills || "NP")}
        ${renderKeyValue("Purchase Bills", observations.purchaseBills || observations.purchaseBills || "Not Provided")}
        ${renderKeyValue(
          "Neighbour check with name & number",
          (() => {
            const thirdPartyCheck = verificationData.thirdPartyCheck || {};
            const checks = Array.isArray(thirdPartyCheck.checks)
              ? thirdPartyCheck.checks
              : [];
            const neighborCheck = checks.find(
              (check: any) =>
                check.relationship === "Neighbor" ||
                check.relationship?.toLowerCase().includes("neighbor")
            );
            if (neighborCheck && neighborCheck.tpcName) {
              return `${neighborCheck.tpcName || ""} - ${neighborCheck.mobileNumber || ""}`.trim();
            }
            // Fallback to direct observation fields
            if (
              observations.neighbourCheckNameAndNumber ||
              observations.neighbourCheck
            ) {
              return `${observations.neighbourCheckNameAndNumber.split("\n").map((line: string) => `<p style="margin:0 0 0 12px;padding:0;">${line.trim()}</p>`).join("") || ""}`;
            }
            return "Not provided";
          })()
        )}
        ${renderKeyValue("CIBIL Details", observations.cibilDetails)}
        <tr>
          <td style="${labelCellStyle}">Previous Loans</td>
          <td style="border-collapse:collapse;">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">BANK</td>
                <td style="${labelCellStyle}">TYPE</td>
                <td style="${labelCellStyle}">LOAN</td>
                <td style="${labelCellStyle}">EMI</td>
                <td style="${labelCellStyle}">Open/Close</td>
              </tr>
              ${ensureArray(observations.previousLoans || [])
                .map((loan: any) => `<tr>
                  <td style="${valueCellStyle}">${formatMultiline(loan.bank)}</td>
                  <td style="${valueCellStyle}">${formatMultiline(loan.type)}</td>
                  <td style="${valueCellStyle}">${formatCurrency(loan.loan)}</td>
                  <td style="${valueCellStyle}">${formatCurrency(loan.emi)}</td>
                  <td style="${valueCellStyle}">${formatMultiline(loan.status)}</td>
                </tr>`).join("")}
            </table>
          <td>
        </tr>
        ${renderKeyValue("Banking Details", observations.bankingDetails)}
        ${renderKeyValue("Firm Account", observations.firmAccount)}
        ${renderKeyValue("Savings Account", observations.savingsAccount)}
        ${renderKeyValue("Assets Details", observations.assetsDetails)}
        ${renderKeyValue("Other income", observations.otherIncome)}
        ${renderKeyValue("Business Machinery", observations.businessMachinery || "NA")}
        ${renderKeyValue("Observation", formatObservations(observations.observation || "Not provided"))}
        ${renderKeyValue("Concerns / Deviations", formatObservations(observations.concernsDeviations || "Not provided"))}
        ${renderKeyValue("Status", html_data.approvedStatus|| "Not provided")}


        <tr>
          <td style="${labelCellStyle}">Loan Details</td>
            <td style="${valueCellStyle}">Loan Amount: ${loanDetails.loanAmountApplied} <br>Purpose of Loan: ${loanDetails.purposeOfLoan}</td>
        </tr>
      </table>     
      
      <table style="${tableStyle}">
      <tr>
        <td style="${labelCellStyle};width:25%;">Particulars</td>
        <td style="${labelCellStyle};width:25%;">Units</td>
        <td style="${labelCellStyle};width:25%;">Charge</td>
        <td style="${labelCellStyle};width:25%;">Total</td>
      </tr>
      ${ensureArray(dailyIncomeCalculation?.details || [])
        .map(
          (detail: any) => `<tr>
          <td style="${valueCellStyle};width:25%;">${formatMultiline(detail.particulars)}</td>
          <td style="${valueCellStyle};width:25%;">${formatMultiline(detail.units)}</td>
          <td style="${valueCellStyle};width:25%;">${formatMultiline(detail.charge)}</td>
          <td style="${valueCellStyle};width:25%;">${formatCurrency(detail.total)}</td>
        </tr>`
        )
        .join("\n")}
      <tr>
        <td style="${labelCellStyle}" colspan="3">Daily Gross Income (Total)</td>
        <td style="${valueCellStyle};width:25%;">${formatCurrency(dailyIncomeCalculation.dailyGrossIncome)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}" colspan="3">Labour & Material (Total)</td>
        <td style="${valueCellStyle};width:25%;">${formatCurrency(dailyIncomeCalculation.labourAndMaterialEveryday)}</td>
      </tr>
      <tr>
        <td style="${labelCellStyle}" colspan="3">Net Income/Day (Total)</td>
        <td style="${valueCellStyle};width:25%;">${formatCurrency(dailyIncomeCalculation.netIncomePerDay)}</td>
      </tr>
      </table>

      <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}"colspan="2">Applicant's Monthly Expenses of the business</td>      
        </tr>
        <tr>
          <td style="${labelCellStyle}">Sales</td>
          <td style="${valueCellStyle}">${formatCurrency(expenses?.salesDetails || 0)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Purchase</td>
          <td style="${valueCellStyle}">${formatCurrency(expenses?.purchaseDetails || 0)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Rent</td>
          <td style="${valueCellStyle}">${formatCurrency(expenses?.rentDetails || 0)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Salary and Wages</td>
          <td style="${valueCellStyle}">${formatCurrency(expenses?.salaryAndWagesDetails || 0)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Transport Charges</td>
          <td style="${valueCellStyle}">${formatCurrency(expenses?.transportDetails || 0)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Electricity Bill</td>
          <td style="${valueCellStyle}">${formatCurrency(expenses?.electricityDetails || 0)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Other Expenses</td>
          <td style="${valueCellStyle}">${formatCurrency(expenses?.otherExpensesDetails || 0)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Total Expenses</td>
          <td style="${valueCellStyle}">${formatCurrency(expenses?.totalExpenses || 0)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Net Profit</td>
          <td style="${valueCellStyle}">${formatCurrency(expenses?.netProfit || 0)}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Net Margin</td>
          <td style="${valueCellStyle}">${expenses?.netMargin + "%" || "Not provided"}</td>
        </tr>
        </table>

      <br><p> Signature of the Assesing Official: ________________________</p>
      <p style="margin:0 0 24px;color:#333;">We taken the estimated figures based on customer feedback and the gross profit has been calculated taking into consideration market information gathered on our experience.</p>
      <p style="margin:20px 0 8px;font-weight:600;color:#222;">Disclaimer Clause:</p>
      <p style="margin:0 0 24px;color:#333;">
        This report (including any attachments) has been prepared based on verbal information provided by the person contacted. Aditya Birla Finance will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. M/s. Kowtha &amp; Co will not be held liable in any case.
      </p>
      <p style="margin:0 0 24px;color:#333;">ADITYA BIRLA CAPITAL (Aditya Birla Housing Finance Ltd., will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions, our efficient services will not be liable in any case.</p>
    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
