import { format, toZonedTime } from "date-fns-tz";
import { pdBaseTemplate, pdBaseTemplateFooter } from "./pd-base.template";

const tableStyle =
  "border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:16px 0";
const labelCellStyle =
  "border:1px solid #c7cdd1;padding:8px;font-weight:bold;color:#222;vertical-align:top;width:32%";
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

const renderArrayTable = (headers: string[], rows: string[][]) => {
  if (!rows.length) {
    return `<table style="${tableStyle}"><tr><td style="${valueCellStyle}">Not provided</td></tr></table>`;
  }
  const headerRow = headers
    .map(
      (header) =>
        `<th style="border:1px solid #c7cdd1;padding:8px;text-align:left;font-weight:600;color:#222;">${header}</th>`
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

export const herohousingSalariedTemplate = (
  verificationData: any,
  html_data: any
) => {
  const date = new Date();
  const timeZone = "Asia/Kolkata";
  const zonedDate = toZonedTime(date, timeZone);
  const istDate = format(zonedDate, "dd-MM-yyyy hh:mm:ss a xxx", { timeZone });

  // Debug: Log the structure to help identify data issues
  console.log("🔍 [HeroHousing Salaried] Verification Data Structure:", {
    hasLoanDetails: verificationData?.loanDetails,
    loanDetailsKeys: verificationData?.loanDetails ? Object.keys(verificationData.loanDetails) : [],
    loanDetailsValue: verificationData?.loanDetails,
    allTopLevelKeys: verificationData ? Object.keys(verificationData) : [],
  });

  const general = verificationData?.generalInfo || {};
  const borrowerDetails = verificationData?.borrowerProfile || {};
  const familyDetails = verificationData?.familyDetails || {};
  const currentJobProfile = verificationData?.employmentProfile || {};
  const detailsOfEmployer = verificationData?.employerDetails || {};
  const propertyDetails = verificationData?.propertyDetails || {};
  const investmentAndProperties = verificationData?.investmentAndProperties || {};
  const endUseOfPropertyFund = verificationData?.endUseOfPropertyFund || {};
  const loanDetails = verificationData?.detailsOfLoans || {};
  const bankingDetails = verificationData?.bankingDetails || {};
  const doc = verificationData?.documentVerificationAndOtherChecks || {};

  return `
    ${pdBaseTemplate()}

    <div class="template-content">
      <p style="margin:8px 0;line-height:1.5"><strong>PD REPORT – CASH SALARIED/SALARIED</strong></p>
      
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Loan account No.</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.loanAccountNo || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name of customer</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.nameOfCustomer || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Person met in PD and relationship with customer</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>Mention the reason if customer was not available during the visit</strong></p>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5">${general.personMet || ""}</p>
            <p style="margin:8px 0;line-height:1.5">${general.reasonIfCustomerNotAvailable || ""}</p>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD Visit date and time</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.pdVisitDate || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>PD address</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.pdAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Lat log of office address</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${ general.latLongOfOfficeAddress || ""}</p></td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Requested loan amount</strong></p></td>
          <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${general.requestedLoanAmount || ""}</p></td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Profile of customer</strong></p>
      
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Borrower details ---</strong></p>
            <p style="margin:8px 0;line-height:1.5"><strong>It should include the</strong></p>
            <ul>
              <li><strong>Qualification of customer,</strong></li>
              <li><strong>Complete professional journey (service/ business details of each activity post qualification to till date</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
          <ul>
            <li><p style="margin:8px 0;line-height:1.5">${borrowerDetails.qualificationOfCustomer || ""}</p></li>
            <li><p style="margin:8px 0;line-height:1.5">${borrowerDetails.professionalJourney || ""}</p></li>
          </ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Family details</strong></p>
            <ul>
              <li><strong>Family details – Including dependents</strong></li>
              <li><strong>Family background (Parents and siblings including all dependents)</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin:10px 0">
              <tr>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Name</strong></p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Relationship with applicant</strong></p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Age</strong></p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Qualification</strong></p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Occupation (Job/Business)</strong> <br> /dependent</p></td>
                <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5"><strong>Income Details/dependent</strong></p></td>
              </tr>
              ${ensureArray(familyDetails.members).map((member) => `
                <tr>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.name || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.relationship || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.age || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.qualification || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.occupation || ""}</p></td>
                  <td style="border:1px solid #ccc;padding:8px"><p style="margin:8px 0;line-height:1.5">${member.incomeDetails || ""}</p></td>
                </tr>
              `).join("")}
            </table>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Current Job profile</strong></p>
            <ul>
              <li><strong>Name of Employer</strong></li>
              <li><strong>Working since</strong></li>
              <li><strong>Type of employment (permanent/Contractual)</strong></li>
              <li><strong>Designation</strong></li>
              <li><strong>Job profile</strong></li>
              <li><strong>Reporting to (Name/Designation)</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <ul>
              <li><p style="margin:8px 0;line-height:1.5">${currentJobProfile.nameOfEmployer || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${currentJobProfile.workingSince || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${currentJobProfile.typeOfEmployment || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${currentJobProfile.designation || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${currentJobProfile.jobProfile || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${currentJobProfile.reportingTo || ""}</p></li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of employer</strong></p>
            <ul>
              <li><strong>Current business Name</strong></li>
              <li><strong>Constitution</strong></li>
              <li><strong>Nature of business/product or services details</strong></li>
              <li><strong>Running since</strong></li>
              <li><strong>Details of partners, director, shareholders with family background and other details</strong></li>
              <li><strong>No. of employee and set up of business</strong></li>
              <li><strong>Quantum of stock</strong></li>
              <li><strong>No of Machinery and assets seen</strong></li>
              <li><strong>Brief details about the locality of business, surrounding competitors, overall prospect of location etc and any negative feedback</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <ul>
              <li><p style="margin:8px 0;line-height:1.5">${detailsOfEmployer.businessName || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${detailsOfEmployer.constitution || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${detailsOfEmployer.natureOfBusiness || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${detailsOfEmployer.runningSince || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${detailsOfEmployer.partnersDetails || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${detailsOfEmployer.setupDetails || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${detailsOfEmployer.stockQuantum || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${detailsOfEmployer.machineryAssets || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${detailsOfEmployer.localityFeedback || ""}</p></li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of Property –</strong></p>
            <ul>
              <li><strong>Whether customer visited the property</strong></li>
              <li><strong>Type of property (Ready build/Plot/Self Construction/under construction/vacant etc)</strong></li>
              <li><strong>Property is occupied by whom and reason if not self-occupied (Also mention stage in case self-construction/under construction and expected completion date, also mention rent amount and period of tenancy if the property is given on rent)</strong></li>
              <li><strong>Source of property purchase (through dealer, builder/reference/relative)</strong></li>
              <li><strong>Name of seller and any relationship with customer</strong></li>
              <li><strong>Type of property/structure and area,</strong></li>
              <li><strong>What is actual deal value and sale deed value, OCR source</strong></li>
              <li><strong>Whether seller is having any loan on the property</strong></li>
              <li><strong>When seller bought the property,</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <ul>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.customerVisitedProperty || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.propertyType || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.propertyOccupancy || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.sourceOfPropertyPurchase || ""}</p></li>  
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.sellerDetails || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.relationshipWithCustomer || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.typeOfProperty || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.areaOfProperty || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.dealValue || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.saleDeedValue || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.ocrSource || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${propertyDetails.whenSellerBoughtTheProperty || ""}</p></li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Investment and properties -</strong></p>
            <ul>
              <li><strong>What is customer investment habits and he is doing any monthly saving in any of saving scheme, investment in properties, FD or any other nature of saving</strong></li>
              <li><strong>Whether current residence is owned or rented and rent amount if any</strong></li>
              <li><strong>Details of assets built till date (Including immovable properties, movable property, gold, FD, Equity investment, other savings)</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <ul>
              <li><p style="margin:8px 0;line-height:1.5">${investmentAndProperties.investmentHabits || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${investmentAndProperties.currentResidenceOwnership || ""} ${investmentAndProperties.rentedAmountIfAny ? "Rent amount: " + investmentAndProperties.rentedAmountIfAny : ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${investmentAndProperties.detailsOfAssetsBuiltTillDate || ""}</p></li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>End use of property/fund –</strong></p>
            <ul>
              <li><strong>Proposed End use of property (self-occupation/investment etc) for HL/P+C/Self construction cases</strong></li>
              <li><strong>Clear and detailed end use of fund in LAP cases</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <ul>
              <li><p style="margin:8px 0;line-height:1.5">${endUseOfPropertyFund?.proposedEndUseOfProperty || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${endUseOfPropertyFund?.detailedEndUseOfFundInLapCases || ""}</p></li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Details of loans –</strong></p>
            <ul>
              <li><strong>Please check and provide the details of loan presently servicing and whether he will be closing such loans or going to continue,</strong></li>
              <li><strong>Repayment account from which all these EMI are getting paid</strong></li>
              <li><strong>What was the end use of fund of these loans (All BL/PL/LAP loan taken in last 3 years), also please check if there is any exceptional borrowing in last 12 months than exact use</strong></li>
              <li><strong>Also check if any home loan/LAP than what is address of mortgage property, usage of such property, any OD limit or any other facility in the name of customer</strong></li>
              <li><strong>Comment whether there is any bouncing in loans and if yes, period and reason of such bounces</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <ul>
              <li><p style="margin:8px 0;line-height:1.5">${loanDetails?.detailsOfLoansPresentlyServicing || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${loanDetails?.repaymentAccount || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${loanDetails?.pastLoanEndUse || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${loanDetails?.checkIfAnyHomeLoanLap || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${loanDetails?.anyBouncingInLoans || ""}</p></li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Banking –</strong></p>
            <ul>
              <li><strong>Please check and mention details of all his bank account, account open date, Name of bank account where salary is getting credited (if bank salary)</strong></li>
              <li><strong>Please check any saving account of applicant and co applicant and provide the details of these accounts</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
          ${bankingDetails?.bankAccounts && Array.isArray(bankingDetails.bankAccounts) && bankingDetails.bankAccounts.length > 0 ? `
          <p style="margin:8px 0;line-height:1.5"><strong>Bank Accounts:</strong></p>
          <ul>
            ${ensureArray(bankingDetails.bankAccounts).map((account: any) => `
              <li><p style="margin:8px 0;line-height:1.5">${account.bankDetails || ""}${account.accountOpenDate ? " - " + account.accountOpenDate : ""}${account.nameOfBankAccount ? " - " + account.nameOfBankAccount : ""}</p></li>
            `).join("")}
          </ul>
          ` : ""}
            ${bankingDetails?.savingAccounts && Array.isArray(bankingDetails.savingAccounts) && bankingDetails.savingAccounts.length > 0 ? `
              <p style="margin:8px 0;line-height:1.5"><strong>Savings Accounts:</strong></p>
              <ul>
                ${ensureArray(bankingDetails.savingAccounts).map((account: any) => `
                  <li><p style="margin:8px 0;line-height:1.5">${account.savingsAccountDetails || ""}</p></li>
                `).join("")}
              </ul>
            ` : ""}
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:8px">
            <p style="margin:8px 0;line-height:1.5"><strong>Document verification and other checks</strong></p>
            <ul>
              <li><strong>Please check all Payroll register, attendance register to check employment and salary details of applicant and share observations</strong></li>
              <li><strong>TPC from minimum 1 neighbour and 1 local independent party to be done (It should be done by showing the photo of customer and employment to be confirmed in the name of customer with existence period</strong></li>
              <li><strong>Additional check to be done from reference if there is any family relationship with employer and employee</strong></li>
              <li><strong>Please check all QR code, license, permits, name board, contact number etc and all these belongs to employer and share observations</strong></li>
              <li><strong>Google check and any negative observation/feedback/dedupe match or any other feedback</strong></li>
            </ul>
          </td>
          <td style="border:1px solid #ccc;padding:8px">
            <ul>
              <li><p style="margin:8px 0;line-height:1.5">${ doc.checkPayrollRegisterAndAttendanceRegister || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${ doc.thirdPartyCheck || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${ doc.familyRelationshipCheckWithEmployer || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${ doc.checkQrCodesLicensesPermitsNameBoardContactNumberBelongingToEmployer || ""}</p></li>
              <li><p style="margin:8px 0;line-height:1.5">${ doc.googleCheckAnyNegativeObservationsFeedbackDedupeMatch || ""}</p></li>
            </ul>
          </td>
        </tr>
      </table>

      <p style="margin:8px 0;line-height:1.5"><strong>Disclaimer Clause:</strong></p>
      <p style="margin:8px 0;line-height:1.5">This report (including any attachments) has been prepared based on verbal information provided by the person contacted. HERO HOUSING FINANCE LTD will be solely responsible for any actions taken on this report and any liabilities directly or indirectly accruing from such actions. <strong>M/s. KOWTHA & CO </strong>will not be held liable in any case.</p>

      ${pdBaseTemplateFooter(html_data)}
    </div>
  `;
};
