import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:600;color:#222;background:#fce4d6;vertical-align:top;width:25%";
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

const formatObservations = (value: any): string => {
  if (!hasValue(value)) return "Not provided";
  const text = String(value);
  // Split by newlines and format as dotted bullets
  const lines = text
    .split(/\n+/)
    .filter((line: string) => line.trim().length > 0);
  if (lines.length === 0) return "Not provided";
  return lines.map((line: string) => `• ${line.trim()}`).join("<br>");
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
  return `
    <table style="${tableStyle}">
      <tr>
        ${headers.map((header) => `<th style="${labelCellStyle}">${header}</th>`).join("")}
      </tr>
      ${rows
        .map(
          (row) => `
        <tr>
          ${row.map((cell) => `<td style="${valueCellStyle}">${cell}</td>`).join("")}
        </tr>
      `
        )
        .join("")}
    </table>
  `;
};

export const iciciTemplate = (verificationData: any, html_data: any) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  const proposal = verificationData.proposal || {};
  const pdDetails = verificationData.pdDetails || {};
  const applicants = verificationData.applicants || {};
  const familyDetails = verificationData.familyBackgroundPersonalDetails || {};
  const residenceDetails = familyDetails?.residenceDetails || {};
  const natureOfBusinessAndBusinessVintage =
    verificationData.natureOfBusinessAndVintage || {};
  const incomeAssessment = verificationData.incomeAssessment || {};
  const assetCreationInLast5Years = verificationData.assetCreation || {};
  const cashFlowAnalysis = verificationData.cashFlowAnalysis || {};
  const coApplicantCases = ensureArray(cashFlowAnalysis.coApplicantCases || []);
  const coApplicantWeeklySales = ensureArray(
    cashFlowAnalysis.coApplicantWeeklySalesMonday || []
  );
  const observationsAtPd = verificationData.observationsAtPd || {};
  const coApplicantObservations = ensureArray(
    observationsAtPd.coApplicantCases || []
  );
  const triggerPointVerification =
    verificationData.triggerPointVerification || {};
  const itrAndFinancial = verificationData.itrAndFinancial || {};
  const bankingDetails = verificationData.bankingDetails?.bankDetails || {};

  // Handle existing loan details - check multiple possible structures
  const existingLoanDetailsSection = verificationData.existingLoanDetails || {};
  const existingLoanDetails = existingLoanDetailsSection;

  // Extract loans array - handle both direct array and nested structure
  const existingLoansArray = Array.isArray(existingLoanDetailsSection.loans)
    ? existingLoanDetailsSection.loans
    : Array.isArray(existingLoanDetailsSection)
      ? existingLoanDetailsSection
      : [];
  const existingLoans = existingLoansArray;

  const references = verificationData.references || {};
  const collateralDetails = verificationData.collateralDetails || {};
  const sellerDetails = verificationData.sellerDetails || {};
  const ocrDetails = verificationData.ocrDetails || {};
  const endUseOfLoan = verificationData.endUseOfLoan || {};
  const remarks = verificationData.remarks || {};
  const pdStatus = verificationData.pdStatus || {};

  return `
    ${pdBaseTemplate(html_data)}


    <div class="align-wrapper">
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td colspan="3" style="${labelCellStyle}"><strong>Proposal</strong></td>
        </tr>
        <tr>
          <td style="${labelCellStyle}"><strong>APS ID</strong></td>
          <td style="${valueCellStyle}">${proposal.apsId || ""}</td>
          <td style="${labelCellStyle}"><strong>Application No</strong></td>
          <td style="${valueCellStyle}">${proposal.applicationNo || ""}</td>
          <td style="${labelCellStyle}"><strong>Initiation Date</strong></td>
          <td style="${valueCellStyle}">${proposal.initiationDate || ""}</td>
          <td style="${labelCellStyle}"><strong>Branch</strong></td>
          <td style="${valueCellStyle}">${proposal.branch || ""}</td>
        </tr>
      </table>

      <table style="${tableStyle}">
        <tr>
          <td colspan="3" style="${labelCellStyle}"><strong>PD Details</strong></td>
        </tr>
        <tr>
          <td style="${labelCellStyle}"><strong>Business Name</strong></td>
          <td style="${labelCellStyle}"><strong>PD Conducted on (Date)</strong></td>
          <td style="${labelCellStyle}"><strong>Location of PD (Resi/Office)</strong></td>
          <td style="${labelCellStyle}"><strong>Location Address of PD</strong></td>
          <td style="${labelCellStyle}"><strong>PD Conducted by (Name)</strong></td>
          <td style="${labelCellStyle}"><strong>Person Met at PD</strong></td>
          <td style="${labelCellStyle}"><strong>Relationship of the Person Met During PD with Applicant</strong></td>
          <td style="${labelCellStyle}"><strong>Distance from HFC Branch</strong></td>
        </tr>
        <tr>
          <td style="${valueCellStyle}">${pdDetails?.businessName || ""}</td>
          <td style="${valueCellStyle}">${pdDetails?.pdConductedDate || ""}</td>
          <td style="${valueCellStyle}">${pdDetails?.locationOfPd || ""}</td>
          <td style="${valueCellStyle}">${pdDetails?.locationAddressOfPd || ""}</td>
          <td style="${valueCellStyle}">${html_data?.fieldExecutive || ""}</td>
          <td style="${valueCellStyle}">${pdDetails?.personMetAtPd || ""}</td>
          <td style="${valueCellStyle}">${pdDetails?.relationshipWithApplicant || ""}</td>
          <td style="${valueCellStyle}">${pdDetails?.distanceFromHfcBranch || ""}</td>
        </tr>
      </table>


      <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}" colspan="3"><strong>Applicants</strong></td>
        </tr>
        <tr>
          <td style="${labelCellStyle}"><strong>Name of the applicant/ Co Applicant</strong></td>
          <td style="${labelCellStyle}"><strong>Relationship with applicant</strong></td>
          <td style="${labelCellStyle}"><strong>Current age</strong></td>
          <td style="${labelCellStyle}"><strong>Qualification</strong></td>
          <td style="${labelCellStyle}"><strong>Income Holder(Yes/No)</strong></td>
          <td style="${labelCellStyle}"><strong>Property ownership (Yes / No)</strong></td>
          <td style="${labelCellStyle}"><strong>Income Source(Business/Rental/Salary/)</strong></td>
          <td style="${labelCellStyle}"><strong>Remarks If any</strong></td>
        </tr>
        ${ensureArray(applicants.applicants)
          .map(
            (applicant: any) => `
          <tr>
            <td style="${valueCellStyle}">${applicant.name || ""}</td>
            <td style="${valueCellStyle}">${applicant.relationshipWithApplicant || ""}</td>
            <td style="${valueCellStyle}">${applicant.currentAge || ""}</td>
            <td style="${valueCellStyle}">${applicant.qualification || ""}</td>
            <td style="${valueCellStyle}">${applicant.incomeHolder || ""}</td>
            <td style="${valueCellStyle}">${applicant.propertyOwnership || ""}</td>
            <td style="${valueCellStyle}">${applicant.incomeSource || ""}</td>
            <td style="${valueCellStyle}">${applicant.remarks || ""}</td>
          </tr>
        `
          )
          .join("\n")}

        </tr>
        </table>

        <div style="page-break-before: always;"></div>
        <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle};vertical-align: middle;"><strong>Family Background and Personal details</strong></td>
          <td style="${labelCellStyle};vertical-align: middle;"><strong>Residence Details</strong></td>
          <td style="border:1px solid #ccc;padding:8px" colspan="6">
            <table style="${tableStyle} width:100%;margin:0;">
            <tr>
              <td style="${labelCellStyle}">Current Residence- Owned/Rented</td>
              <td style="${valueCellStyle}">${residenceDetails.currentResidenceOwnedRented || ""} ${residenceDetails.currentResidenceAddress ? "<br><strong>Address: </strong>" + residenceDetails.currentResidenceAddress : ""}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">If Current Residence is Owned- Owner Name</td>
              <td style="${valueCellStyle}">${residenceDetails.ifOwnedOwnerName || ""}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">If Rented- Owner Name & Contact No</td>
              <td style="${valueCellStyle}">${residenceDetails.ifRentedOwnerNameContactNo || ""}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">If Rented- Permanent Residence Details</td>
              <td style="${valueCellStyle}">${residenceDetails.ifRentedPermanentResidenceDetails || ""}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">No of Years in Current Residence and previous residence details</td>
              <td style="${valueCellStyle}">${residenceDetails.noOfYearsInCurrentResidence || "" ? `<strong>Current:</strong> ${residenceDetails.noOfYearsInCurrentResidence || ""}` : ""} ${residenceDetails.previousResidenceDetails ? `<br><strong>Previous:</strong> ${residenceDetails.previousResidenceDetails}` : ""}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">No of Years in Same City</td>
              <td style="${valueCellStyle}">${residenceDetails.noOfYearsInSameCity || ""}</td>
            </tr>
            <tr>
              <td style="${labelCellStyle}">Distance from Current Residence to Business Premises</td>
              <td style="${valueCellStyle}">${residenceDetails.distanceFromCurrentResidenceToBusiness || ""}</td>
            </tr>
            </table>
          </td>
        </tr>
        
        <tr>
          <td style="${labelCellStyle}" colspan="2"><strong>Family Details with No. of Dependents</strong></td>
          <td style="${valueCellStyle}" colspan="6">${familyDetails.familyDetailsWithDependents || ""}</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}" colspan="2"><strong>Earning members in family , their source of income and total income</strong></td>
          <td style="${valueCellStyle}" colspan="6">${familyDetails.earningMembersInFamily || ""}</td>  
        </tr>
        </table>

        <div style="page-break-before: always;"></div>

        <!-- Nature of Business Section -->
        <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle};vertical-align: middle;"><strong>Nature of Business and Business Vintage</strong></td>
          <td style="border:1px solid #ccc;padding:8px" colspan="7">
          <table style="${tableStyle}">
          <tr>
            <td style="${labelCellStyle}"><strong>Business Premises:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.businessPremisesOwnedRented || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Business Premises Owner details:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.businessPremisesOwnerDetails || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>No of years in Same premises:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.noOfYearsInSamePremises || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>No of Years in same Business:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.noOfYearsInSameBusiness || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Previous exp if any:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.previousExperience || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Business Activity:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.businessActivity || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Gross margin and Net Margin:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.grossMargin ? `<strong>Gross Margin:</strong> ${natureOfBusinessAndBusinessVintage.grossMargin}%` : ""} ${natureOfBusinessAndBusinessVintage.netMargin ? `<br><strong>Net Margin:</strong> ${natureOfBusinessAndBusinessVintage.netMargin}%` : ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Ideas about to start business:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.ideaToStartBusiness || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Staff Details:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.staffDetails || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Documents Verified:</strong></td>
            <td style="${valueCellStyle}">${formatObservations(natureOfBusinessAndBusinessVintage.documentsVerified)}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Machinery/Assets used in business:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.machineryAssetsUsed || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Business Vintage as Per Local References:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.businessVintageAsPerLocalReferences || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Business Vintage as per Document Verified:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.businessVintageAsPerDocuments || ""}</td>
        </tr>
        <tr>
            <td style="${labelCellStyle}"><strong>Business Locality and Market Competition:</strong></td>
            <td style="${valueCellStyle}">${natureOfBusinessAndBusinessVintage.businessLocalityAndMarketCompetition || ""}</td>
          </tr>
          </table>
          </td>
        </tr>

        <tr>
          <td style="${labelCellStyle};vertical-align: middle;"><strong>Income Assessment</strong></td>
          <td style="border:1px solid #ccc;padding:8px" colspan="7">
          <table style="${tableStyle}">
            <tr>
              <td style="${labelCellStyle}"><strong>Core Business income:</strong></td>
              <td style="${valueCellStyle}">${incomeAssessment.coreBusinessIncome || ""}</td>
        </tr>
        <tr>
              <td style="${labelCellStyle}"><strong>Any other Income:</strong></td>
              <td style="${valueCellStyle}">${incomeAssessment.anyOtherIncome || ""}</td>
        </tr>
        <tr>
              <td style="${labelCellStyle}"><strong>Maximum EMI Paying Capability customer confirmed</strong></td>
              <td style="${valueCellStyle}">${incomeAssessment.maximumEmiPayingCapability || ""}</td>
            </tr>
          </table>
          </td>
        </tr>

        <tr>
          <td style="${labelCellStyle}"><strong>Asset Creation in last 5 years</strong></td>
          <td style="${valueCellStyle}" colspan="7">${assetCreationInLast5Years.assetsCreated || ""}</td>
        </tr>
        </table>



        <div style="page-break-before: always;"></div>
         <!--******** Cash Flow Analysis Section********* -->

         <table style="${tableStyle}">
           <tr>
             <td colspan="2" style="padding:0;vertical-align:top;">
               <table style="${tableStyle} width:100%;margin:0;padding:0;">
                 <tr>
                   <td style="${labelCellStyle}" colspan="2"><strong>Cash Flow Analysis During PD</strong></td>
                   ${coApplicantCases.length > 0 ? `<td style="${labelCellStyle}" colspan="${coApplicantCases.length}">(Not Applicable in Salaried Cases)</td>` : `<td style="${labelCellStyle}">(Not Applicable in Salaried Cases)</td>`}
                 </tr>
                 <tr>
                   <td style="${labelCellStyle}"><strong>Particulars</strong></td>
                   <td style="${labelCellStyle}">Applicnt <br>Rs</td>
                   ${coApplicantCases.map((_, index) => `<td style="${labelCellStyle}">Co-applicant ${index + 1}<br>Rs</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Monthly TO / Gross Receipts (Weekly sales * 4)</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantMonthlyTO || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantMonthlyTO || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Less: Cost of Raw Material</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantCostOfRawMaterial || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantCostOfRawMaterial || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Rent Income (If Any)</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantRentIncome || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantRentIncome || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Any Other Regular Income Other than Business</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantOtherIncome || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantOtherIncome || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Gross Monthly Income</td>
                  <td style="${valueCellStyle}"><strong style="color:#0066cc;">${cashFlowAnalysis.applicantGrossMonthlyIncome || ""}</strong></td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}"><strong style="color:#0066cc;">${coApp.coApplicantGrossMonthlyIncome || ""}</strong></td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}" colspan="${1 + 1 + coApplicantCases.length}"><strong>Less Monthly Business Expenses</strong></td>
                </tr>
                 <tr>
                  <td style="${labelCellStyle}">Rent</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantBusinessExpensesRent || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantBusinessExpensesRent || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Salary</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantBusinessExpensesSalary || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantBusinessExpensesSalary || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Electricity</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantBusinessExpensesElectricity || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantBusinessExpensesElectricity || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Travelling</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantBusinessExpensesTravelling || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantBusinessExpensesTravelling || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Other Operating Expense</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantBusinessExpensesOther || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantBusinessExpensesOther || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Income Left for Domestic Expenses</td>
                  <td style="${valueCellStyle}"><strong style="color:#0066cc;">${cashFlowAnalysis.applicantIncomeLeftForDomestic || ""}</strong></td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}"><strong style="color:#0066cc;">${coApp.coApplicantIncomeLeftForDomestic || ""}</strong></td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}" colspan="${1 + 1 + coApplicantCases.length}"><strong>Less Monthly Household Expenses</strong></td>
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">a) Food Expenses</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantHouseholdExpensesFood || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantHouseholdExpensesFood || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">b) School and tuition fees</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantHouseholdExpensesSchoolFees || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantHouseholdExpensesSchoolFees || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">c) Other HouseHold Expenses</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantHouseholdExpensesHouseRent || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantHouseholdExpensesOther || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Net monthly income post all expenses</td>
                  <td style="${valueCellStyle}"><strong style="color:#0066cc;">${cashFlowAnalysis.applicantNetMonthlyIncome || ""}</strong></td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}"><strong style="color:#0066cc;">${coApp.coApplicantNetMonthlyIncome || ""}</strong></td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Less: Savings/Investments: Insurance Premiums</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantSavingsInvestments || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantSavingsInvestments || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Less: Existing EMI</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.applicantExistingEmi || ""}</td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantExistingEmi || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}" colspan="${1 + 1 + coApplicantCases.length}"></td>
        </tr>
        <tr>
                  <td style="${labelCellStyle}">Net Surplus Available for Propose EMI</td>
                  <td style="${valueCellStyle}"><strong style="color:#0066cc;">${cashFlowAnalysis.applicantNetSurplusForEmi || ""}</strong></td>
                  ${coApplicantCases.map((coApp: any) => `<td style="${valueCellStyle}"><strong style="color:#0066cc;">${coApp.coApplicantNetSurplusForEmi || ""}</strong></td>`).join("")}
        </tr>
               </table>
             </td>


             <td colspan="2" style="padding:0;vertical-align:top;">
               <table style="${tableStyle} width:100%;margin:0;padding:0;">
                 <tr>
                   <td style="${labelCellStyle}" colspan="${1 + 1 + coApplicantWeeklySales.length}"><strong>Weekly sales</strong></td>
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Day</td>
                  <td style="${labelCellStyle}">Applicant</td>
                  ${coApplicantWeeklySales.map((_, index) => `<td style="${labelCellStyle}">Co-applicant ${index + 1}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Monday</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.weeklySalesMonday || ""}</td>
                  ${coApplicantWeeklySales.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantWeeklySalesMonday || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Tuesday</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.weeklySalesTuesday || ""}</td>
                  ${coApplicantWeeklySales.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantWeeklySalesTuesday || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Wednesday</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.weeklySalesWednesday || ""}</td>
                  ${coApplicantWeeklySales.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantWeeklySalesWednesday || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Thursday</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.weeklySalesThursday || ""}</td>
                  ${coApplicantWeeklySales.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantWeeklySalesThursday || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Friday</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.weeklySalesFriday || ""}</td>
                  ${coApplicantWeeklySales.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantWeeklySalesFriday || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Saturday</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.weeklySalesSaturday || ""}</td>
                  ${coApplicantWeeklySales.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantWeeklySalesSaturday || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Sunday</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.weeklySalesSunday || ""}</td>
                  ${coApplicantWeeklySales.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantWeeklySalesSunday || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Weekly Sales</td>
                  <td style="${valueCellStyle}">${cashFlowAnalysis.totalWeeklySales || ""}</td>
                  ${coApplicantWeeklySales.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantTotalWeeklySales || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}" colspan="${1 + 1 + coApplicantWeeklySales.length}"></td>
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}" colspan="${1 + 1 + coApplicantObservations.length}"><strong>Observations at the Time of PD</strong></td>
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Stock Value</td>
                  <td style="${valueCellStyle}">${observationsAtPd.stockValue || ""}</td>
                  ${coApplicantObservations.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantStockValue || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Time Spent</td>
                  <td style="${valueCellStyle}">${observationsAtPd.timeSpent || ""}</td>
                  ${coApplicantObservations.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantTimeSpent || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Footfall</td>
                  <td style="${valueCellStyle}">${observationsAtPd.footfall || ""}</td>
                  ${coApplicantObservations.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantFootfall || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}">Sales</td>
                  <td style="${valueCellStyle}">${observationsAtPd.sales || ""}</td>
                  ${coApplicantObservations.map((coApp: any) => `<td style="${valueCellStyle}">${coApp.coApplicantSales || ""}</td>`).join("")}
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}" colspan="3"></td>
                 </tr>
                 <tr>
                  <td style="${labelCellStyle}" colspan="2"><strong>Trigger Point Verification</strong></td>
                  <td style="${labelCellStyle}">Remarks</td>
        </tr>
        <tr>
                  <td style="${labelCellStyle}">For Traders</td>
                  <td style="${valueCellStyle}">${triggerPointVerification.forTraders || ""}</td>
                  <td style="${valueCellStyle}">${triggerPointVerification.forTradersRemarks || ""}</td>
        </tr>
        <tr>
                  <td style="${labelCellStyle}">For Manufacturers</td>
                  <td style="${valueCellStyle}">${triggerPointVerification.forManufacturers || ""}</td>
                  <td style="${valueCellStyle}">${triggerPointVerification.forManufacturersRemarks || ""}</td>
        </tr>
               </table>
             </td>
        </tr>
         </table>


        <div style="page-break-before: always;"></div>
         <table style="${tableStyle}">
          <tr>
            <td style="${labelCellStyle}" colspan="3"><strong>ITR and Financial</strong></td>
          </tr>
          <tr>
            <td style="${labelCellStyle}"></td>
            <td style="${labelCellStyle}">ITR Filing</td>
            <td style="${valueCellStyle}">${itrAndFinancial.itrFiling || "Not Provided"}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}">ITR Details If any</td>
            <td style="${valueCellStyle}"><b>if filling - amount of income declared:</b></td>
            <td style="${valueCellStyle}">${itrAndFinancial.itrDetailsIfAny || "Not Provided"} ${itrAndFinancial.itrFiling === "Yes" ? `<br><strong>Amount of income declared:</strong> ${itrAndFinancial.itrAmountDeclared || "Not Provided"}` : "Not Provided"}</td>
          </tr>
          <tr>
            <td style="${labelCellStyle}"><strong>Banking Details</strong></td>
            <td style="border:1px solid #ccc;padding:8px" colspan="3">
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Bank Name</td>
                <td style="${labelCellStyle}">A/c Type</td>
                <td style="${labelCellStyle}">No. of Years</td>
        </tr>
              ${ensureArray(bankingDetails)
                .map(
                  (bank: any) => `
                <tr>
                  <td style="${valueCellStyle}">${bank.bankName || "Not Provided"}</td>
                  <td style="${valueCellStyle}">${bank.accountType || "Not Provided"}</td>
                  <td style="${valueCellStyle}">${bank.noOfYears || "Not Provided"}</td>
                </tr>
              `
                )
                .join("")}
            </table>
            </td>
        </tr>
          </table>





          <table style="${tableStyle}">
          <tr>
            <td style="${labelCellStyle}" colspan="8"><strong>Existing Loan Details</strong></td>
        </tr>
        <tr>
            <td style="${labelCellStyle}">Lender</td>
            <td style="${labelCellStyle}">Type of Loan</td>
            <td style="${labelCellStyle}">Loan Availed Year</td>
            <td style="${labelCellStyle}">Loan Amount</td>
            <td style="${labelCellStyle}">POS</td>
            <td style="${labelCellStyle}">EMI</td>
            <td style="${labelCellStyle}">Security Offered</td>
            <td style="${labelCellStyle}">EMI Deducting Bank Account</td>
          </tr>
          ${
            existingLoans.length > 0
              ? existingLoans
                  .map(
                    (loan: any) => `
            <tr>
              <td style="${valueCellStyle}">${loan?.lender || ""}</td>
              <td style="${valueCellStyle}">${loan?.typeOfLoan || ""}</td>
              <td style="${valueCellStyle}">${
                loan?.loanAvailedYear !== null &&
                loan?.loanAvailedYear !== undefined
                  ? String(loan.loanAvailedYear)
                  : ""
              }</td>
              <td style="${valueCellStyle}">${formatCurrency(loan?.loanAmount)}</td>
              <td style="${valueCellStyle}">${formatCurrency(loan?.posAmount)}</td>
              <td style="${valueCellStyle}">${formatCurrency(loan?.emi)}</td>
              <td style="${valueCellStyle}">${loan?.securityOffered || ""}</td>
              <td style="${valueCellStyle}">${loan?.emiDeductingBankAccount || ""}</td>
            </tr>
            `
                  )
                  .join("")
              : `<tr><td style="${valueCellStyle}" colspan="8" style="text-align:center;">No existing loan details provided</td></tr>`
          }
          <tr>
            <td style="${labelCellStyle}" colspan="3">Total</td>
            <td style="${valueCellStyle}">${formatCurrency(existingLoanDetails?.totalLoanAmount)}</td>
            <td style="${labelCellStyle}">Total EMI</td>
            <td style="${valueCellStyle}">${formatCurrency(existingLoanDetails?.totalEmi)}</td>
            <td style="${labelCellStyle}" colspan="2"></td>
        </tr>
        </table>

        <!-- Reference Section -->
        <table style="${tableStyle}">
        <tr>
          <td style=" text-align: center; ${labelCellStyle}" colspan="2"><strong>Reference (Name & Contact No.)</strong></td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Suppliers/Staff</td>
          <td style="${valueCellStyle}">${
            ensureArray(references.suppliersOrStaff).length > 0
              ? ensureArray(references.suppliersOrStaff)
                  .map((staff: any) => {
                    const name = staff?.name || "";
                    const contactNo = staff?.contactNo || "";
                    const feedback = staff?.feedback
                      ? ` - ${staff.feedback}`
                      : "";
                    if (!name && !contactNo) return null;
                    return `${name || "Not Provided"} - ${contactNo || "Not Provided"}${feedback}`;
                  })
                  .filter((item: string | null) => item !== null)
                  .join("<br>") || "Not Provided"
              : "Not Provided"
          }</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Customers</td>
          <td style="${valueCellStyle}">${
            ensureArray(references.customers).length > 0
              ? ensureArray(references.customers)
                  .map((customer: any) => {
                    const name = customer?.name || "";
                    const contactNo = customer?.contactNo || "";
                    const feedback = customer?.feedback
                      ? ` - ${customer.feedback}`
                      : "";
                    if (!name && !contactNo) return null;
                    return `${name || "Not Provided"} - ${contactNo || "Not Provided"}${feedback}`;
                  })
                  .filter((item: string | null) => item !== null)
                  .join("<br>") || "Not Provided"
              : "Not Provided"
          }</td>
        </tr>
        <tr>
          <td style="${labelCellStyle}">Neighbor Feedback</td>
          <td style="${valueCellStyle}">${
            ensureArray(references.neighbors).length > 0
              ? ensureArray(references.neighbors)
                  .map(
                    (neighbor: any) =>
                      `${neighbor.name || ""}${neighbor.contactNo ? ` - ${neighbor.contactNo}` : ""}${neighbor.feedback ? ` - ${neighbor.feedback}` : ""}`
                  )
                  .filter((item: string) => item.trim())
                  .join("<br>")
              : references.neighborFeedback || ""
          }</td>
        </tr>
        </table>


        <div style="page-break-before: always;"></div>

        <table style="${tableStyle}">
        <!-- Collateral Details Section -->
        <tr>
          <td style="${labelCellStyle};vertical-align: middle;" colspan="2"><strong>Collateral Details</strong></td>
          <td style="border:1px solid #ccc;padding:8px" >
            <table style="${tableStyle}">
              <tr>
                <td style="${labelCellStyle}">Property Location</td>
                <td style="${valueCellStyle}">${collateralDetails.propertyLocation || "Not Provided"}</td>
        </tr>
        <tr>
                <td style="${labelCellStyle}">Property Type</td>
                <td style="${valueCellStyle}">${collateralDetails.propertyType || "Not Provided"}</td>
        </tr>
        <tr>
                <td style="${labelCellStyle}">Property Area (sqft.)</td>
                <td style="${valueCellStyle}">${collateralDetails.propertyArea || ""}</td>
        </tr>
        <tr>
                <td style="${labelCellStyle}">Property Value and Registration Value</td>
                <td style="${valueCellStyle}">${collateralDetails.propertyValue || "Not Provided"} ${collateralDetails.registrationValue ? "<br><strong>Registration Value: </strong>" + collateralDetails.registrationValue : "Not Provided"}</td>
        </tr>
        <tr>
                <td style="${labelCellStyle}">Propose Property Current Occupancy</td>
                <td style="${valueCellStyle}">${collateralDetails.proposePropertyCurrentOccupancy || "Not Provided"}</td>
        </tr>
        <tr>
                <td style="${labelCellStyle}">Propose Property Distance from Business</td>
                <td style="${valueCellStyle}">${collateralDetails.proposePropertyDistanceFromBusiness || "Not Provided"}</td>
        </tr>
        <tr>
                <td style="${labelCellStyle}">Seller Details</td>
                <td style="${valueCellStyle}">${collateralDetails.sellerDetails || "Not Provided"}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- OCR Details Section -->
        <tr>
          <td colspan="2" rowspan="2" style="${labelCellStyle}"><strong>OCR details for Purchase Case:</strong></td>
          <td style="${valueCellStyle}"><strong>OCR Paid:</strong> ${ocrDetails.ocrPaid || "Not Provided"}</td>
        </tr>
        <tr>
          <td style="${valueCellStyle}"><strong>OCR source:</strong> ${ocrDetails.ocrSource || "Not Provided"}</td>
        </tr>

        <!-- End Use Section -->
        <tr>
          <td style="${labelCellStyle}" colspan="2"><strong>End use of loan:</strong></td>
          <td style="${valueCellStyle}">${endUseOfLoan.endUseOfLoan || "Not Provided"}</td>
        </tr>
        </table>

        <!-- Remarks Section -->
        <table style="${tableStyle}">
        <tr>
          <td style="${labelCellStyle}" colspan="3"><strong>Remarks: Summary of Transaction</strong></td>
        </tr>
        <tr>
          <td style="${valueCellStyle}" colspan="3">${formatObservations(remarks.summaryOfTransaction || "")}</td>
        </tr>

        <tr>
          <td style="${labelCellStyle}"><strong>PD Status</strong></td>
          <td style="${valueCellStyle}">${html_data.approvedStatus || "Not provided"}</td>
        </tr>
      </table>


    </div>
    ${pdBaseTemplateFooter(html_data)}
  `;
};
