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

export const dcbTemplate = (verificationData: any, html_data: any) => {
  const basicDetails = verificationData.basicDetails || {};
  const borrowerNameAndAddress = verificationData.borrowerSNameAndAddress || {};
  // Handle nested structures for directors and proprietor
  const detailsOfDirectorsAndProprietorData =
    verificationData.detailsOfDirectorsAndProprietor || {};
  const detailsOfDirectorsAndProprietorArray = Array.isArray(
    detailsOfDirectorsAndProprietorData
  )
    ? detailsOfDirectorsAndProprietorData
    : Array.isArray(detailsOfDirectorsAndProprietorData.directorsAndProprietor)
      ? detailsOfDirectorsAndProprietorData.directorsAndProprietor
      : [];
  const detailsOfDirectorsAndProprietor = ensureArray(
    verificationData.detailsOfDirectorsAndProprietor.details
  );
  const history = verificationData.history || {};
  const businessActivities = verificationData.businessActivities || {};
  const businessSetup = verificationData.businessSetup || {};
  const detailsOfAllLoansAsOn =
    verificationData.detailsOfAllLoansAsOn.details || {};
  const personalAssetsOfProprietor =
    verificationData.personalAssetsOfProprietor.details || {};
  const detailsOfCustomers = verificationData.detailsOfCustomers.details || {};
  const detailsOfSuppliers = verificationData.detailsOfSuppliers.details || {};
  const sisterCompanies = verificationData.sisterCompanies.details || {};
  const insuranceDetails = verificationData.insuranceDetails || {};
  const performanceDetails = verificationData.performanceDetails || {};
  const otherBusinessInterests = verificationData.otherBusinessInterests || {};
  const bankingDetails = verificationData.bankingDetails || {};
  const activityLevelsAtCPAVisit =
    verificationData.activityLevelsAtCPAVisit || {};
  const loanPurpose = verificationData.loanPurpose || {};
  const detailsOfPropertyToBeMortgaged =
    verificationData.detailsOfPropertyToBeMortgaged || {};
  const verification = verificationData.verification || {};
  const concludingImpressions = verificationData.concludingImpressions || {};

  return `
    ${pdBaseTemplate(html_data)}
    <div class="template-content dcb-template">
    <h1 style="margin:0 0 16px;color:#1f2a37;font-size:24px; text-align:center">DCB BANK LTD</h1>
    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">PD & VERIFICATION REPORT</h2>
    <table style="${tableStyle}">
      ${renderKeyValue("Date of Visit", basicDetails.dateOfVisit)}
      ${renderKeyValue("Person(s) Met", basicDetails.personMet)}
      ${renderKeyValue("Name", basicDetails.applicantName)}
      ${renderKeyValue("Designation", basicDetails.designation)}
      ${renderKeyValue("Years of Service", basicDetails.yearsOfService)}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Borrower Details</h2>
    <table style="${tableStyle}">
    <tr>
      <td style="${labelCellStyle}">Borrower's Name and Address</td>
      <td style="${valueCellStyle}">${formatMultiline(borrowerNameAndAddress.borrowerName)} <br><strong>Residence Address:</strong> ${formatMultiline(borrowerNameAndAddress.residenceAddress)} <br><strong>Business Address:</strong> ${formatMultiline(borrowerNameAndAddress.businessAddress)}</td>
    </tr>
    ${renderKeyValue("Other site(s) of the Borrower / sites(s)", borrowerNameAndAddress.otherSiteSOfTheBorrower)}
    ${renderKeyValue("Constitution of Borrower", borrowerNameAndAddress.constitutionOfBorrower)}
    ${renderKeyValue("Details of Directors & Proprietor", detailsOfDirectorsAndProprietorData.directorsAndProprietor)}
    </table>
    ${renderArrayTable(
      [
        "Name",
        "Age (in Yrs)",
        "Qualifications",
        "Responsibilities",
        "Share holding Pattern (in %)",
      ],
      detailsOfDirectorsAndProprietor
        .filter(
          (director: any) =>
            hasValue(director?.nameOfShareholder) ||
            hasValue(director?.ageOfShareholder) ||
            hasValue(director?.qualifications) ||
            hasValue(director?.responsibilities) ||
            hasValue(director?.shareholdingPatternIn)
        )
        .map((director: any) => [
          director?.nameOfShareholder || "",
          director?.ageOfShareholder || "",
          director?.qualifications || "",
          director?.responsibilities || "",
          director?.shareholdingPatternIn !== undefined &&
          director?.shareholdingPatternIn !== null
            ? `${director.shareholdingPatternIn}%`
            : "",
        ])
    )}

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">History</h2>
    <table style="${tableStyle}">
      ${renderKeyValue("Year of Establishment", history.yearOfEstablishment)}
      ${renderKeyValue("Any Change in Ownership", history.anyChangeInOwnership)}
      ${renderKeyValue("Registration / Affiliations", history.registrationAffiliations)}
      ${renderKeyValue("Any Awards Won", history.anyAwardsWon)}
      ${renderKeyValue("Any Change in Registered Office", history.anyChangeInRegisteredOffice)}
      ${renderKeyValue("Legal Proceedings", history.legalProceedings)}
      ${renderKeyValue("Disputes", history.disputes)}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Business Activities</h2>
    <table style="${tableStyle}">
      ${renderKeyValue("Business Profile", businessActivities.businessProfile)}
      ${renderKeyValue("Products", businessActivities.products)}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Business Set-up</h2>
    <table style="${tableStyle}">
    ${renderKeyValue(
      "Office Set-up with Overall Look",
      formatMultiline(businessSetup.officeSetUpWithOverallLook),
      undefined,
      { colspan: 3 }
    )}
    ${renderKeyValue(
      "Expenses",
      formatMultiline(businessSetup.expenses),
      undefined,
      { colspan: 3 }
    )}
    ${renderKeyValue(
      "Transactions",
      formatMultiline(businessSetup.transactions),
      undefined,
      { colspan: 3 }
    )}
    ${renderKeyValue("Plant and Machinery", businessSetup.plantAndMachinery, undefined, { colspan: 3 })}
    ${renderKeyValue("Office Equipment", businessSetup.officeEquipment, undefined, { colspan: 3 })}
    ${renderKeyValue("Workers and Salaries", businessSetup.workersAndSalaries, undefined, { colspan: 3 })}
    <tr>
      <td style="${labelCellStyle}">No. of Employees</td>
      <td style="${labelCellStyle}">Type</td>
      <td style="${labelCellStyle}">Average Pay</td>
      </tr>
      <tr>
      <td style="${valueCellStyle}">${businessSetup.noOfEmployees}</td>
      <td style="${valueCellStyle}">${businessSetup.typeOfBusiness}</td>
      <td style="${valueCellStyle}">${businessSetup.averagePay}</td>
    </tr>
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Details of All Loans as on Date of Visit</h2>
    <table style="${tableStyle}">
    <tr>
      <td style="${labelCellStyle}">Bank</td>
      <td style="${labelCellStyle}">Type of Loan</td>
      <td style="${labelCellStyle}">o/s Amount/</td>
      <td style="${labelCellStyle}">EMI</td>
    </tr>
    ${detailsOfAllLoansAsOn
      .map(
        (item: any) => `
      <tr>
        <td style="${valueCellStyle}">${item.bank || ""}</td>
        <td style="${valueCellStyle}">${item.typeOfLoan || ""}</td>
        <td style="${valueCellStyle}">${item.loanAmount || ""}</td>
        <td style="${valueCellStyle}">${item.emi || ""}</td>
      </tr>
    `
      )
      .join("")}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Personal Assets of Proprietor</h2>
    <table style="${tableStyle}">
    <tr>
    <td style="${labelCellStyle}">S.No</td>
      <td style="${labelCellStyle}">Asset</td>
      <td style="${labelCellStyle}">Value</td>
    </tr>
    ${personalAssetsOfProprietor
      .map(
        (item: any, index: number) => `
      <tr>
        <td style="${valueCellStyle}">${index + 1}</td>
        <td style="${valueCellStyle}">${item.asset || ""}</td>
        <td style="${valueCellStyle}">${item.value || ""}</td>
      </tr>
    `
      )
      .join("")}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Details of Customers / Clients: Not Applicable- Walk in Customers</h2>
    <table style="${tableStyle}">
    <tr>
      <td style="${labelCellStyle}">S.No</td>
      <td style="${labelCellStyle}">Name of Customers</td>
      <td style="${labelCellStyle}">Location</td>
      <td style="${labelCellStyle}">Contact No</td>
    </tr>
    ${detailsOfCustomers
      .map(
        (item: any, index: number) => `
      <tr>
        <td style="${valueCellStyle}">${index + 1}</td>
        <td style="${valueCellStyle}">${item.nameOfCustomers || ""}</td>
        <td style="${valueCellStyle}">${item.location || ""}</td>
        <td style="${valueCellStyle}">${item.contactNo || ""}</td>
      </tr>
    `
      )
      .join("")}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Details of Suppliers</h2>
    <table style="${tableStyle}">
    <tr>
      <td style="${labelCellStyle}">S.No</td>
      <td style="${labelCellStyle}">Name of Suppliers</td>
      <td style="${labelCellStyle}">Location</td>
      <td style="${labelCellStyle}">Contact No</td>
    </tr>
    ${detailsOfSuppliers
      .map(
        (item: any, index: number) => `
      <tr>
        <td style="${valueCellStyle}">${index + 1}</td>
        <td style="${valueCellStyle}">${item.nameOfSuppliers || ""}</td>
        <td style="${valueCellStyle}">${item.location || ""}</td>
        <td style="${valueCellStyle}">${item.contactNo || ""}</td>
      </tr>
    `
      )
      .join("")}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Sister Companies :</h2>
    <table style="${tableStyle}">
    <tr>
      <td style="${labelCellStyle}">S.No</td>
      <td style="${labelCellStyle}">Name of Firm</td>
      <td style="${labelCellStyle}">Business Profile</td>
      <td style="${labelCellStyle}">Turnover</td>
      <td style="${labelCellStyle}">Net Profit</td>
    </tr>
    ${sisterCompanies
      .map(
        (item: any, index: number) => `
      <tr>
        <td style="${valueCellStyle}">${index + 1}</td>
        <td style="${valueCellStyle}">${item.nameOfSisterCompanies}</td>
        <td style="${valueCellStyle}">${item.businessProfile}</td>
        <td style="${valueCellStyle}">${item.turnover}</td>
        <td style="${valueCellStyle}">${item.netProfit}</td>
      </tr>
    `
      )
      .join("")}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Insurance Details</h2>
    <p><strong>Insurance Company Name:-</strong> ${insuranceDetails.insuranceCompanyName} <br> <strong>Due they are taking the exemptions by taking the Children Education Fee:</strong> ${insuranceDetails.dueExemptions}</p>
    <table style="${tableStyle}">
    <tr>
    <td style="${labelCellStyle}">S.No</td>
    <td style="${labelCellStyle}">Assets Covered</td>
    <td style="${labelCellStyle}">Cover Note No. / Policy No</td>
    <td style="${labelCellStyle}">Valid up to</td>
    <td style="${labelCellStyle}">Sum Assured</td>
    <td style="${labelCellStyle}">Assured Covered</td>
    </tr>
    ${insuranceDetails.details
      .map(
        (item: any, index: number) => `
      <tr>
        <td style="${valueCellStyle}">${index + 1}</td>
        <td style="${valueCellStyle}">${item.assetsCovered || ""}</td>
        <td style="${valueCellStyle}">${item.coverNoteNoPolicyNo || ""}</td>
        <td style="${valueCellStyle}">${item.validUpTo || ""}</td>
        <td style="${valueCellStyle}">${item.sumAssured || ""}</td>
        <td style="${valueCellStyle}">${item.assuredCovered || ""}</td>
      </tr>
    `
      )
      .join("")}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Performance After Last Audited Financials</h2>
    <table style="${tableStyle}">
    ${renderKeyValue("Last available financial statement period", performanceDetails.lastAvailableFinancialStatementPeriod)}
    ${renderKeyValue("Recent summary financials ( up to a period not more than two months old)", performanceDetails.recentSummaryFinancials)}
    ${renderKeyValue("Advance Taxes Paid (for current A.Y.)", performanceDetails.advanceTaxesPaidCurrentAY)}
    ${renderKeyValue("Change in Borrowings (from F.Y. 20-21 to F.Y. 21-22)", performanceDetails.changeInBorrowingsBetweenFys)}
    ${renderKeyValue("Change in Capital (from F.Y. 22-23 to F.Y. 23-24)", performanceDetails.changeInCapitalBetweenFys)}
    ${renderKeyValue("Change in Turnover (between FYs)", performanceDetails.changeInTurnoverBetweenFys)}
    ${renderKeyValue("Last 6 Months Turnover as per GST Returns", performanceDetails.last6MonthsTurnoverAsPerGstReturns)}
    ${renderKeyValue("Net Profit % on Sales", performanceDetails.netProfitOnSales)}
    ${renderKeyValue("Debtors Position as on", performanceDetails.debtorsPositionAsOn)}
    ${renderKeyValue("Creditors Position as on", performanceDetails.creditorsPositionAsOn)}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Other Business Interests of the Proprietor</h2>
    <table style="${tableStyle}">
    ${renderKeyValue("Other Business Interests of the Proprietor", otherBusinessInterests.otherBusinessInterestsOfTheProprietor, undefined, { colspan: 3 })}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Banking Details & Statutory Obligations</h2>
    <table style="${tableStyle}">
    ${renderKeyValue("Banking Name", bankingDetails.bankName)}
    ${renderKeyValue("Branch", bankingDetails.branch)}
    ${renderKeyValue("Account Number", bankingDetails.accountNumber)}
    ${renderKeyValue("Account Type", bankingDetails.accountType)}
    ${renderKeyValue("Banking Since", bankingDetails.bankingSince)}
    ${renderKeyValue("Evidence of statutory dues being paid on time PF, PT and EIC (Employee related)", bankingDetails.evidenceOfStatutoryDuesPfPtEic)}
    ${renderKeyValue("Municipal & Corporation Taxes (BST, CST & MVAT)", bankingDetails.municipalCorporationTaxesBstCstMvat)}
    ${renderKeyValue("Last Utility Payment Made (Electricity)", bankingDetails.lastUtilityPaymentMadeElectricity)}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Activity Levels at CPA Visit</h2>
    <table style="${tableStyle}">
    ${renderKeyValue("Number of Employees & Workers Observed", activityLevelsAtCPAVisit.numberOfEmployeesWorkersObserved)}
    ${renderKeyValue("Level of activity as well as overall observation of business (description of Production / Delivery / Customers)", activityLevelsAtCPAVisit.levelOfActivityObservationsProductionDeliveryCustomers)}
    ${renderKeyValue("Photographs of Business Activity, Set up and Stock", activityLevelsAtCPAVisit.photographsOfBusinessActivitySetupStock)}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Loan Purpose</h2>
    <table style="${tableStyle}">
    <tr>
    <td style="${labelCellStyle}" colspan="2">Details of End-Use of Funds:</td>
    </tr>
    ${renderKeyValue("End-Use of Funds (incl Cash out use)", loanPurpose.detailsOfEndUseOfFunds)}
    ${renderKeyValue("Loan Required", loanPurpose.loanRequired)}
    ${renderKeyValue("EMI Comfortable With", loanPurpose.emiComfortableWith)}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Details of Property to be mortgaged</h2>
    <table style="${tableStyle}">
    ${renderKeyValue("Property Details (address)", detailsOfPropertyToBeMortgaged.propertyDetailsAddress)}
    ${renderKeyValue("Name of the Property Owner", detailsOfPropertyToBeMortgaged.nameOfThePropertyOwner)}
    ${renderKeyValue("Usage of Property", detailsOfPropertyToBeMortgaged.usageOfProperty)}
    ${renderKeyValue("Occupancy Status", detailsOfPropertyToBeMortgaged.occupancyStatus)}
    ${renderKeyValue("Estimated Value as per Customer", detailsOfPropertyToBeMortgaged.estimatedValueAsPerCustomer)}
    </table>

    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Verification</h2>
    <h3 style="margin:0 0 16px;color:#1f2a37;font-size:14px;">a) Details of Sales and Purchases during the Period from as follows: as per applicant’s oral information</h3>
    <table style="${tableStyle}">
        <tr>
            <td style="${labelCellStyle}">Months</td>
            <td style="${labelCellStyle}">Purchases (Rs.)</td>
            <td style="${labelCellStyle}">Sales (Rs.)</td>
        </tr>
        ${ensureArray(verification.detailsOfSalesAndPurchasesPeriodWise)
          .map(
            (item: any, index: number) => `
            <tr>
                <td style="${valueCellStyle}">${item.months}</td>
                <td style="${valueCellStyle}">${item.purchasesRs}</td>
                <td style="${valueCellStyle}">${item.salesRs}</td>
            </tr>
        `
          )
          .join("")}
    </table>

    <h3 style="margin:0 0 16px;color:#1f2a37;font-size:14px;">b) Document Verified</h3>
    <table style="${tableStyle}">
    <tr>
        <td style="${labelCellStyle}">Document Verified</td>
        <td style="${valueCellStyle}">${formatMultiline(verification.documentVerification)}</td>
    </tr>
    </table>
            
    <h2 style="margin:0 0 16px;color:#1f2a37;font-size:16px;">Concluding Impressions</h2>
    <table style="${tableStyle}">
    <tr>
        <td style="${labelCellStyle}">Concluding Impressions</td>
        <td style="${valueCellStyle}">${formatMultiline(concludingImpressions.concludingImpressions)}</td>
    </tr>
    </table>

    ${pdBaseTemplateFooter(html_data)}
  `;
};

export default dcbTemplate;
